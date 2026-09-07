import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import {
  Upload, Image as ImageIcon, Sparkles, Sliders, Palette, Shield, Save,
  RotateCcw, Download, Eye, Check, X, Wand2, RefreshCw, Zap, Flame,
  Sun, Moon, Globe, Disc, Layers, Move, Maximize2, Share2, Copy
} from 'lucide-react';
import {
  CustomCharacterDesign, EarType, MaterialType, AuraType, PatternType,
  TextureMode, BlendMode
} from './types';
import {
  analyzeImageColors, createCompositeTexture, createCapeTexture,
  SAMPLE_PRESET_IMAGES, ExtractedImageInfo, rgbToHex
} from './ImageAnalyzer';
import { createCustomBear3D, BuiltBearModel } from './3dBearBuilder';
import {
  getCurrentSavedDesign, syncDesignToGameInstance, savePreset,
  loadPresets, deletePreset, createDefaultDesign
} from './GameBridge';

interface CharacterStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDesign?: (design: CustomCharacterDesign) => void;
}

type TabType = 'image_colors' | 'textures' | 'morphology' | 'materials_aura' | 'presets';
type ColorTargetPart = 'furColor' | 'bellyColor' | 'muzzleColor' | 'earInnerColor' | 'pawColor' | 'eyeColor' | 'capeColor' | 'accentColor';

const PART_NAMES: Record<ColorTargetPart, string> = {
  furColor: '🐻 Ana Kürk',
  bellyColor: '⚪ Göbek / Göğüs',
  muzzleColor: '👄 Ağız & Burun',
  earInnerColor: '👂 Kulak İçi',
  pawColor: '🐾 Patiler & Ayaklar',
  eyeColor: '👁️ Göz Bebeği',
  capeColor: '🧣 Pelerin Rengi',
  accentColor: '✨ Aksesuar / Vurgu',
};

export const CharacterStudioModal: React.FC<CharacterStudioModalProps> = ({
  isOpen,
  onClose,
  onApplyDesign,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('image_colors');
  const [design, setDesign] = useState<CustomCharacterDesign>(getCurrentSavedDesign);
  const [presets, setPresets] = useState<CustomCharacterDesign[]>(loadPresets);
  const [selectedColorTarget, setSelectedColorTarget] = useState<ColorTargetPart>('furColor');
  const [imageInfo, setImageInfo] = useState<ExtractedImageInfo | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [activeAnimation, setActiveAnimation] = useState<'idle' | 'dance' | 'roar' | 'punch' | 'wave' | 'spin'>('idle');
  const [environment, setEnvironment] = useState<'studio' | 'sunny' | 'neon' | 'sunset' | 'cosmic'>('studio');
  const [notification, setNotification] = useState<string | null>(null);
  
  // Eyedropper / Magnifier state
  const [hoverColor, setHoverColor] = useState<string | null>(null);
  const [magnifierPos, setMagnifierPos] = useState<{ x: number; y: number; show: boolean }>({ x: 0, y: 0, show: false });

  // 3D Canvas Refs
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const imagePreviewCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const bearModelRef = useRef<BuiltBearModel | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lightsRef = useRef<{
    ambient: THREE.AmbientLight;
    directional: THREE.DirectionalLight;
    point: THREE.PointLight;
    rim: THREE.DirectionalLight;
  } | null>(null);

  // Orbit controls state
  const orbitState = useRef({
    isDragging: false,
    prevX: 0,
    prevY: 0,
    rotY: 0.3,
    rotX: 0.15,
    distance: 3.6,
    targetY: 1.0,
  });

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // --- Initialize 3D Scene ---
  useEffect(() => {
    if (!isOpen || !canvasContainerRef.current) return;
    const container = canvasContainerRef.current;
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 3.6);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);

    const directional = new THREE.DirectionalLight(0xfff5e6, 1.2);
    directional.position.set(3, 5, 4);
    directional.castShadow = true;
    directional.shadow.mapSize.width = 1024;
    directional.shadow.mapSize.height = 1024;
    scene.add(directional);

    const point = new THREE.PointLight(0xf59e0b, 0.8, 10);
    point.position.set(-3, 2, 2);
    scene.add(point);

    const rim = new THREE.DirectionalLight(0x38bdf8, 0.6);
    rim.position.set(0, 3, -4);
    scene.add(rim);

    lightsRef.current = { ambient, directional, point, rim };

    // 5. Floor Platform
    const floorGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.15, 32);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.3,
      metalness: 0.4,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -0.075;
    floor.receiveShadow = true;
    scene.add(floor);

    // Glowing rim ring on platform
    const ringGeo = new THREE.RingGeometry(1.55, 1.62, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.005;
    scene.add(ring);

    // 6. Build Bear Model
    const bearModel = createCustomBear3D(design);
    scene.add(bearModel.root);
    bearModelRef.current = bearModel;

    // 7. Render Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Camera orbit calculation
      const { rotY, rotX, distance, targetY } = orbitState.current;
      const cx = Math.sin(rotY) * Math.cos(rotX) * distance;
      const cy = targetY + Math.sin(rotX) * distance;
      const cz = Math.cos(rotY) * Math.cos(rotX) * distance;

      camera.position.set(cx, cy, cz);
      camera.lookAt(0, targetY, 0);

      // Animate Bear Pose
      if (bearModelRef.current) {
        bearModelRef.current.setAnimationPose(activeAnimation, elapsed);
      }

      renderer.render(scene, camera);
    };
    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      if (bearModelRef.current) bearModelRef.current.destroy();
      renderer.dispose();
    };
  }, [isOpen]);

  // Update lighting environment
  useEffect(() => {
    if (!sceneRef.current || !lightsRef.current) return;
    const scene = sceneRef.current;
    const { ambient, directional, point, rim } = lightsRef.current;

    if (environment === 'studio') {
      scene.background = new THREE.Color(0x0f172a);
      ambient.color.setHex(0xffffff);
      ambient.intensity = 0.7;
      directional.color.setHex(0xfff5e6);
      directional.intensity = 1.2;
      point.color.setHex(0xf59e0b);
      rim.color.setHex(0x38bdf8);
    } else if (environment === 'sunny') {
      scene.background = new THREE.Color(0x38bdf8);
      ambient.color.setHex(0xdbeafe);
      ambient.intensity = 0.8;
      directional.color.setHex(0xfef08a);
      directional.intensity = 1.5;
      point.color.setHex(0x22c55e);
      rim.color.setHex(0xffffff);
    } else if (environment === 'neon') {
      scene.background = new THREE.Color(0x090514);
      ambient.color.setHex(0x3b0764);
      ambient.intensity = 0.4;
      directional.color.setHex(0xec4899);
      directional.intensity = 1.6;
      point.color.setHex(0x06b6d4);
      point.intensity = 1.5;
      rim.color.setHex(0xa855f7);
    } else if (environment === 'sunset') {
      scene.background = new THREE.Color(0x431407);
      ambient.color.setHex(0x7c2d12);
      ambient.intensity = 0.6;
      directional.color.setHex(0xf97316);
      directional.intensity = 1.4;
      point.color.setHex(0xfacc15);
      rim.color.setHex(0xdb2777);
    } else if (environment === 'cosmic') {
      scene.background = new THREE.Color(0x020617);
      ambient.color.setHex(0x1e1b4b);
      ambient.intensity = 0.5;
      directional.color.setHex(0xc084fc);
      directional.intensity = 1.3;
      point.color.setHex(0x38bdf8);
      rim.color.setHex(0x818cf8);
    }
  }, [environment]);

  // Update 3D Bear Model whenever design changes
  const update3DModel = useCallback(async (newDesign: CustomCharacterDesign) => {
    if (!bearModelRef.current) return;
    
    let furCanvas: HTMLCanvasElement | undefined;
    let capeCanvas: HTMLCanvasElement | undefined;

    if (newDesign.textureSettings.mode !== 'none' || newDesign.textureSettings.patternType !== 'none' || newDesign.imageSrc) {
      furCanvas = await createCompositeTexture(newDesign.imageSrc, newDesign.palette, newDesign.textureSettings);
    }

    if (newDesign.capeEnabled) {
      capeCanvas = await createCapeTexture(newDesign.imageSrc, newDesign.palette, newDesign.name);
    }

    bearModelRef.current.updateDesign(newDesign, furCanvas, capeCanvas);
  }, []);

  useEffect(() => {
    update3DModel(design);
  }, [design, update3DModel]);

  // Draw uploaded image on preview canvas
  useEffect(() => {
    if (!imagePreviewCanvasRef.current || !design.imageSrc) return;
    const canvas = imagePreviewCanvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = design.imageSrc;
  }, [design.imageSrc]);

  // --- Handle Image Upload / Drop ---
  const handleImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('⚠️ Lütfen geçerli bir resim dosyası seçin (PNG, JPG, WEBP, SVG)!');
      return;
    }

    setIsProcessingImage(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      try {
        const info = await analyzeImageColors(dataUrl);
        setImageInfo(info);
        
        // Auto apply extracted colors
        setDesign((prev) => ({
          ...prev,
          imageSrc: dataUrl,
          imageName: file.name,
          palette: info.suggestedPalette,
          extractedSwatches: info.palette,
          auraColor: info.vibrant,
          textureSettings: {
            ...prev.textureSettings,
            mode: 'wrap', // Default to wrap for immediate visual reward!
          },
        }));

        showToast(`🎉 "${file.name}" yüklendi ve renk paleti çıkarıldı!`);
      } catch (err) {
        console.error(err);
        showToast('❌ Resim işlenirken hata oluştu.');
      } finally {
        setIsProcessingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // --- Eyedropper Magnifier over Uploaded Image ---
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = imagePreviewCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    try {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
      setHoverColor(hex);
      setMagnifierPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, show: true });
    } catch {
      // ignore
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (hoverColor) {
      setDesign((prev) => ({
        ...prev,
        palette: {
          ...prev.palette,
          [selectedColorTarget]: hoverColor,
        },
      }));
      showToast(`🎯 ${PART_NAMES[selectedColorTarget]} için renk uygulandı: ${hoverColor}`);
    }
  };

  // --- Magic Auto-Palette Generator ---
  const handleMagicColorize = () => {
    if (!imageInfo) return;
    setDesign((prev) => ({
      ...prev,
      palette: imageInfo.suggestedPalette,
      auraColor: imageInfo.vibrant,
    }));
    showToast('✨ Sihirli Renklendirme uygulandı!');
  };

  // --- Apply Preset Inspiration ---
  const handleApplyPresetInspiration = (preset: typeof SAMPLE_PRESET_IMAGES[0]) => {
    setDesign((prev) => ({
      ...prev,
      name: preset.title,
      palette: { ...preset.palette },
      extractedSwatches: Object.values(preset.palette),
      materialType: preset.material,
      auraType: preset.aura,
      auraColor: preset.palette.accentColor,
      morphology: {
        ...prev.morphology,
        earType: preset.earType,
      },
      textureSettings: {
        ...prev.textureSettings,
        patternType: preset.pattern,
      },
    }));
    showToast(`🌟 "${preset.title}" şablonu yüklendi!`);
  };

  // --- Save Character Preset ---
  const handleSaveCurrentPreset = () => {
    const updated = savePreset(design);
    setPresets(updated);
    showToast(`💾 "${design.name}" kayıtlı karakterler arasına eklendi!`);
  };

  // --- Download Snapshot Photo Card ---
  const handleDownloadCard = () => {
    if (!rendererRef.current) return;
    const cardCanvas = document.createElement('canvas');
    cardCanvas.width = 900;
    cardCanvas.height = 600;
    const ctx = cardCanvas.getContext('2d')!;

    // 1. Background gradient
    const grad = ctx.createLinearGradient(0, 0, 900, 600);
    grad.addColorStop(0, '#0F172A');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 900, 600);

    // 2. Border
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, 880, 580);

    // 3. Draw 3D Viewport snapshot
    const snapImg = new Image();
    snapImg.onload = () => {
      ctx.drawImage(snapImg, 30, 60, 480, 480);

      // Title & Name
      ctx.fillStyle = '#F59E0B';
      ctx.font = '900 32px system-ui, sans-serif';
      ctx.fillText(design.name, 530, 100);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '16px system-ui, sans-serif';
      ctx.fillText("Grizzy'nin Büyük Macerası - Özel Karakter Kartı", 530, 130);

      // Palette Swatches
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 18px system-ui, sans-serif';
      ctx.fillText('🎨 Renk Paleti:', 530, 180);

      const swatches = Object.entries(design.palette);
      swatches.forEach(([part, color], idx) => {
        const sx = 530 + (idx % 4) * 80;
        const sy = 210 + Math.floor(idx / 4) * 55;
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(sx, sy, 65, 30, 8);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#CBD5E1';
        ctx.font = '10px monospace';
        ctx.fillText(color.toUpperCase(), sx + 5, sy + 44);
      });

      // Stats & Style Badge
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(530, 360, 320, 170);
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2;
      ctx.strokeRect(530, 360, 320, 170);

      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 16px system-ui, sans-serif';
      ctx.fillText('Karakter Özellikleri', 550, 395);

      ctx.fillStyle = '#F1F5F9';
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillText(`• Kulak Tipi: ${design.morphology.earType.toUpperCase()}`, 550, 430);
      ctx.fillText(`• Malzeme: ${design.materialType.toUpperCase()}`, 550, 455);
      ctx.fillText(`• Desen: ${design.textureSettings.patternType.toUpperCase()}`, 550, 480);
      ctx.fillText(`• Aura: ${design.auraType.toUpperCase()}`, 550, 505);

      // Trigger download
      const link = document.createElement('a');
      link.download = `${design.name.toLowerCase().replace(/\s+/g, '_')}_card.png`;
      link.href = cardCanvas.toDataURL('image/png');
      link.click();
      showToast('📸 Karakter Kartı başarıyla indirildi!');
    };
    snapImg.src = rendererRef.current.domElement.toDataURL('image/png');
  };

  // --- Apply and Start Playing In-Game ---
  const handleApplyToGame = async () => {
    await syncDesignToGameInstance(design);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
    if (onApplyDesign) onApplyDesign(design);
    showToast('🚀 Tasarım karakterine giydirildi ve oyuna uygulandı!');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  // Mouse / Touch handlers for 3D Camera Orbit
  const handlePointerDown = (e: React.PointerEvent) => {
    orbitState.current.isDragging = true;
    orbitState.current.prevX = e.clientX;
    orbitState.current.prevY = e.clientY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!orbitState.current.isDragging) return;
    const dx = e.clientX - orbitState.current.prevX;
    const dy = e.clientY - orbitState.current.prevY;
    orbitState.current.prevX = e.clientX;
    orbitState.current.prevY = e.clientY;

    orbitState.current.rotY -= dx * 0.008;
    orbitState.current.rotX = Math.max(-0.5, Math.min(1.2, orbitState.current.rotX + dy * 0.008));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    orbitState.current.isDragging = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    orbitState.current.distance = Math.max(1.8, Math.min(7.0, orbitState.current.distance + e.deltaY * 0.003));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-4 bg-slate-950/90 backdrop-blur-md select-none animate-fade-in text-slate-100 overflow-hidden font-sans">
      <div className="relative w-full max-w-6xl h-[96vh] bg-slate-900 border-2 border-amber-500/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* --- Top Navigation Header --- */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-xl shadow-lg border border-amber-400/50">
              🎨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-amber-300">
                  Görselden 3D Karakter Stüdyosu
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-bold text-amber-300">
                  ÖZELLEŞTİRİCİ
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Resim yükle, renk ve desenleri çıkar, şekil ve auralarla kendi kahramanını yarat!
              </p>
            </div>
          </div>

          {/* Quick Actions & Close */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveCurrentPreset}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-amber-400" />
              Taslağı Kaydet
            </button>
            <button
              onClick={handleDownloadCard}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              Fotoğraf Kartı
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-rose-500 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* --- Main Workspace (Left: 3D Stage, Right: Customizer Tabs) --- */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
          
          {/* --- LEFT: 3D Viewport (5 Columns) --- */}
          <div className="lg:col-span-5 relative bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 overflow-hidden">
            {/* 3D Canvas Area */}
            <div
              ref={canvasContainerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onWheel={handleWheel}
              className="w-full flex-1 cursor-grab active:cursor-grabbing touch-none relative"
            />

            {/* Orbit Help Overlay */}
            <div className="absolute top-3 left-3 pointer-events-none flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm border border-slate-800 px-2.5 py-1 rounded-xl text-[11px] text-slate-300">
              <Move className="w-3.5 h-3.5 text-amber-400" />
              360° Çevir & Yakınlaştır
            </div>

            {/* Environment Preset Selector */}
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-900/85 backdrop-blur-sm border border-slate-800 p-1 rounded-xl">
              {(['studio', 'sunny', 'neon', 'sunset', 'cosmic'] as const).map((env) => (
                <button
                  key={env}
                  onClick={() => setEnvironment(env)}
                  title={`Ortam: ${env}`}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    environment === env
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {env === 'studio' && '💡 Stüdyo'}
                  {env === 'sunny' && '☀️ Çayır'}
                  {env === 'neon' && '⚡ Siber'}
                  {env === 'sunset' && '🌅 Batım'}
                  {env === 'cosmic' && '🌌 Uzay'}
                </button>
              ))}
            </div>

            {/* Bottom Animation / Emote Bar */}
            <div className="p-3 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between gap-2 overflow-x-auto">
              <span className="text-[11px] font-bold text-slate-400 shrink-0">Duruş:</span>
              <div className="flex items-center gap-1.5">
                {(['idle', 'dance', 'roar', 'punch', 'wave', 'spin'] as const).map((anim) => (
                  <button
                    key={anim}
                    onClick={() => setActiveAnimation(anim)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold capitalize transition-all cursor-pointer shrink-0 ${
                      activeAnimation === anim
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {anim === 'idle' && '😌 Nefes'}
                    {anim === 'dance' && '💃 Dans'}
                    {anim === 'roar' && '🦁 Kükre'}
                    {anim === 'punch' && '🥊 Yumruk'}
                    {anim === 'wave' && '👋 Selam'}
                    {anim === 'spin' && '🌪️ Dönüş'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* --- RIGHT: Tool Tabs & Controls (7 Columns) --- */}
          <div className="lg:col-span-7 flex flex-col min-h-0 bg-slate-900/60 overflow-hidden">
            
            {/* Tabs Header */}
            <div className="flex items-center gap-1 px-4 py-2 border-b border-slate-800 bg-slate-900/80 overflow-x-auto shrink-0">
              {[
                { id: 'image_colors', label: '🖼️ Resim & Renkler', icon: Palette },
                { id: 'textures', label: '🎨 Desen & Doku', icon: Layers },
                { id: 'morphology', label: '📐 Şekil & Beden', icon: Sliders },
                { id: 'materials_aura', label: '✨ Aura & Malzeme', icon: Sparkles },
                { id: 'presets', label: '💾 Şablon & Kayıt', icon: Save },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                        : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Contents (Scrollable) */}
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-5">
              
              {/* === TAB 1: RESİM YÜKLEME & RENKLER === */}
              {activeTab === 'image_colors' && (
                <div className="space-y-5">
                  {/* Character Name Input */}
                  <div className="flex items-center gap-3 bg-slate-800/40 p-3 rounded-2xl border border-slate-800">
                    <span className="text-xs font-bold text-amber-400 shrink-0">Karakter Adı:</span>
                    <input
                      type="text"
                      value={design.name}
                      onChange={(e) => setDesign((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Örn: Ateş Pençeli Bozayı"
                      className="flex-1 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-sm font-bold text-amber-200 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Image Upload Area */}
                  <div className="border-2 border-dashed border-amber-500/40 hover:border-amber-400 bg-slate-950/40 hover:bg-slate-900/60 p-4 rounded-2xl transition-all flex flex-col items-center justify-center text-center relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])}
                      className="hidden"
                    />
                    <Upload className="w-8 h-8 text-amber-400 mb-2 animate-bounce" />
                    <h3 className="text-sm font-bold text-slate-200">
                      Karakterin İçin İstediğin Resmi Yükle
                    </h3>
                    <p className="text-[11px] text-slate-400 max-w-sm mt-1">
                      PNG, JPG, SVG veya çizimlerini buraya sürükle ya da tıkla. Renkler ve desenler anında karaktere uyarlanır!
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-3 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg transition-transform active:scale-95 cursor-pointer"
                    >
                      📁 Dosya Seç veya Sürükle
                    </button>
                  </div>

                  {/* Uploaded Image Canvas & Interactive Eyedropper */}
                  {design.imageSrc && (
                    <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-sky-400" />
                          <h4 className="text-xs font-bold text-sky-300">
                            Görsel Damlalığı (Tıklayarak Renk Seç)
                          </h4>
                        </div>
                        <button
                          onClick={handleMagicColorize}
                          className="flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold cursor-pointer transition-all"
                        >
                          <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                          Sihirli Otomatik Renklendir
                        </button>
                      </div>

                      {/* Color Target Selector */}
                      <div className="flex items-center gap-2 flex-wrap bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                        <span className="text-[11px] font-bold text-slate-400">Hedef Bölge:</span>
                        {(Object.keys(PART_NAMES) as ColorTargetPart[]).map((part) => (
                          <button
                            key={part}
                            onClick={() => setSelectedColorTarget(part)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              selectedColorTarget === part
                                ? 'bg-sky-500 text-slate-950 font-black ring-2 ring-sky-300'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {PART_NAMES[part]}
                          </button>
                        ))}
                      </div>

                      {/* Canvas with Magnifier */}
                      <div className="relative border border-slate-700 rounded-xl overflow-hidden bg-slate-900 max-h-48 flex items-center justify-center">
                        <canvas
                          ref={imagePreviewCanvasRef}
                          onMouseMove={handleCanvasMouseMove}
                          onMouseLeave={() => setMagnifierPos({ ...magnifierPos, show: false })}
                          onClick={handleCanvasClick}
                          className="max-h-44 w-auto object-contain cursor-crosshair"
                        />
                        {magnifierPos.show && hoverColor && (
                          <div
                            className="absolute pointer-events-none w-10 h-10 rounded-full border-2 border-white shadow-2xl flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
                            style={{
                              left: magnifierPos.x,
                              top: magnifierPos.y,
                              backgroundColor: hoverColor,
                            }}
                          >
                            <span className="text-[8px] font-black text-slate-950 bg-white/80 px-1 rounded">
                              {hoverColor}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Extracted Swatches Palette */}
                  <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <Palette className="w-4 h-4 text-amber-400" />
                        Çıkarılan Renk Paleti (Hedef Bölgeye Uygula):
                      </h4>
                      <span className="text-[10px] text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md">
                        Aktif: {PART_NAMES[selectedColorTarget]}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {design.extractedSwatches.map((color, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setDesign((prev) => ({
                              ...prev,
                              palette: {
                                ...prev.palette,
                                [selectedColorTarget]: color,
                              },
                            }));
                            showToast(`${PART_NAMES[selectedColorTarget]} boyandı: ${color}`);
                          }}
                          className="group relative h-12 rounded-xl border-2 border-slate-700 hover:border-white transition-all shadow-md flex flex-col items-center justify-end p-1 overflow-hidden cursor-pointer"
                          style={{ backgroundColor: color }}
                        >
                          <span className="text-[9px] font-mono font-bold bg-slate-950/70 text-slate-200 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {color}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sample Inspiration Image Presets */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-300">
                      💡 Veya İlham Verici Hazır Temalardan Başla:
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {SAMPLE_PRESET_IMAGES.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => handleApplyPresetInspiration(preset)}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 text-left transition-all cursor-pointer"
                        >
                          <span className="text-2xl">{preset.icon}</span>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-200 truncate">{preset.title}</p>
                            <p className="text-[10px] text-slate-400">{preset.category}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* === TAB 2: DESEN & DOKU KAPLAMA === */}
              {activeTab === 'textures' && (
                <div className="space-y-5">
                  {/* Texture Mode Selection */}
                  <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-amber-300">Resim Dokusu Uygulama Modu:</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'none', label: 'Düz Renk', desc: 'Sadece renk paleti' },
                        { id: 'wrap', label: 'Tüm Gövde Sar', desc: 'Resmi kürk dokusu yap' },
                        { id: 'decal', label: 'Göğüs Amblemi', desc: 'Göbeğe rozet yerleştir' },
                        { id: 'pattern', label: 'Desen Kaplama', desc: 'Geometrik şablonlar' },
                      ].map((mode) => (
                        <button
                          key={mode.id}
                          onClick={() =>
                            setDesign((prev) => ({
                              ...prev,
                              textureSettings: {
                                ...prev.textureSettings,
                                mode: mode.id as TextureMode,
                              },
                            }))
                          }
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            design.textureSettings.mode === mode.id
                              ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <p className="text-xs font-bold">{mode.label}</p>
                          <p className="text-[10px] text-slate-400">{mode.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Procedural Pattern Selection */}
                  <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-slate-200">
                      Resmin Renklerinden Özel Desen Üret:
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'none', label: 'Yok', icon: '⚪' },
                        { id: 'stripes', label: 'Kaplan Çizgileri', icon: '🐅' },
                        { id: 'spots', label: 'Leopar Benekleri', icon: '🐆' },
                        { id: 'hexagons', label: 'Bal Peteği', icon: '🍯' },
                        { id: 'circuit', label: 'Siber Devre', icon: '⚡' },
                        { id: 'camo', label: 'Kamuflaj', icon: '🌲' },
                        { id: 'stars', label: 'Yıldızlar', icon: '✨' },
                        { id: 'gradient', label: 'Renk Geçişi', icon: '🌈' },
                      ].map((pat) => (
                        <button
                          key={pat.id}
                          onClick={() =>
                            setDesign((prev) => ({
                              ...prev,
                              textureSettings: {
                                ...prev.textureSettings,
                                patternType: pat.id as PatternType,
                              },
                            }))
                          }
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            design.textureSettings.patternType === pat.id
                              ? 'bg-purple-500/20 border-purple-400 text-purple-200 font-bold'
                              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span className="text-lg">{pat.icon}</span>
                          <span className="text-xs">{pat.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Decal Shape (if Decal mode is on) */}
                  {design.textureSettings.mode === 'decal' && (
                    <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 space-y-3">
                      <h4 className="text-xs font-bold text-slate-200">Göğüs Rozeti Şekli:</h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        {(['circle', 'shield', 'heart', 'star', 'square'] as const).map((shape) => (
                          <button
                            key={shape}
                            onClick={() =>
                              setDesign((prev) => ({
                                ...prev,
                                textureSettings: { ...prev.textureSettings, decalShape: shape },
                              }))
                            }
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                              design.textureSettings.decalShape === shape
                                ? 'bg-amber-500 text-slate-950 font-black'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {shape === 'circle' && '⭕ Daire'}
                            {shape === 'shield' && '🛡️ Kalkan'}
                            {shape === 'heart' && '❤️ Kalp'}
                            {shape === 'star' && '⭐ Yıldız'}
                            {shape === 'square' && '⬛ Kare'}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sliders for Repeat, Opacity, Rotation */}
                  <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 space-y-4">
                    <h4 className="text-xs font-bold text-slate-200">Doku & Desen Ayarları:</h4>
                    
                    {/* Repeat */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>Desen Tekrarı (Tiling / Scale):</span>
                        <span className="font-mono text-amber-400">{design.textureSettings.repeat}x</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="8"
                        step="1"
                        value={design.textureSettings.repeat}
                        onChange={(e) =>
                          setDesign((prev) => ({
                            ...prev,
                            textureSettings: {
                              ...prev.textureSettings,
                              repeat: parseInt(e.target.value),
                            },
                          }))
                        }
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>

                    {/* Rotation */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>Desen Döndürme Açısı:</span>
                        <span className="font-mono text-amber-400">{design.textureSettings.rotation}°</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        step="15"
                        value={design.textureSettings.rotation}
                        onChange={(e) =>
                          setDesign((prev) => ({
                            ...prev,
                            textureSettings: {
                              ...prev.textureSettings,
                              rotation: parseInt(e.target.value),
                            },
                          }))
                        }
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>

                    {/* Opacity */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>Doku Saydamlığı:</span>
                        <span className="font-mono text-amber-400">{Math.round(design.textureSettings.opacity * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.05"
                        value={design.textureSettings.opacity}
                        onChange={(e) =>
                          setDesign((prev) => ({
                            ...prev,
                            textureSettings: {
                              ...prev.textureSettings,
                              opacity: parseFloat(e.target.value),
                            },
                          }))
                        }
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* === TAB 3: ŞEKİL & MORFOLOJİ (BODY MORPHING) === */}
              {activeTab === 'morphology' && (
                <div className="space-y-5">
                  {/* Ear Style Selector */}
                  <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-amber-300">Kulak & Baş Şekli:</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {[
                        { id: 'round', label: 'Ayı Kulakları', icon: '🐻' },
                        { id: 'pointy', label: 'Kurt / Tilki', icon: '🦊' },
                        { id: 'bunny', label: 'Tavşan Kulak', icon: '🐰' },
                        { id: 'horns', label: 'Ejder Boynuzu', icon: '😈' },
                        { id: 'cat', label: 'Kedi Kulak', icon: '🐱' },
                      ].map((ear) => (
                        <button
                          key={ear.id}
                          onClick={() =>
                            setDesign((prev) => ({
                              ...prev,
                              morphology: {
                                ...prev.morphology,
                                earType: ear.id as EarType,
                              },
                            }))
                          }
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                            design.morphology.earType === ear.id
                              ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span className="text-2xl block mb-1">{ear.icon}</span>
                          <span className="text-xs">{ear.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Body Morphing Sliders */}
                  <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 space-y-4">
                    <h4 className="text-xs font-bold text-slate-200">Beden & Şekil Oranları:</h4>

                    {/* Head Scale */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>Kafa Boyutu (Chibi / Normal):</span>
                        <span className="font-mono text-amber-400">{design.morphology.headScale.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.7"
                        max="1.4"
                        step="0.05"
                        value={design.morphology.headScale}
                        onChange={(e) =>
                          setDesign((prev) => ({
                            ...prev,
                            morphology: { ...prev.morphology, headScale: parseFloat(e.target.value) },
                          }))
                        }
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>

                    {/* Snout Scale */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>Ağız & Burun Uzunluğu:</span>
                        <span className="font-mono text-amber-400">{design.morphology.snoutScale.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.6"
                        max="1.5"
                        step="0.05"
                        value={design.morphology.snoutScale}
                        onChange={(e) =>
                          setDesign((prev) => ({
                            ...prev,
                            morphology: { ...prev.morphology, snoutScale: parseFloat(e.target.value) },
                          }))
                        }
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>

                    {/* Chubby Scale */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>Göbek & Beden Tontonluğu:</span>
                        <span className="font-mono text-amber-400">{design.morphology.chubbyScale.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.7"
                        max="1.5"
                        step="0.05"
                        value={design.morphology.chubbyScale}
                        onChange={(e) =>
                          setDesign((prev) => ({
                            ...prev,
                            morphology: { ...prev.morphology, chubbyScale: parseFloat(e.target.value) },
                          }))
                        }
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>

                    {/* Limb Scale */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>Kol & Bacak Kas Kalınlığı:</span>
                        <span className="font-mono text-amber-400">{design.morphology.armScale.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.7"
                        max="1.4"
                        step="0.05"
                        value={design.morphology.armScale}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setDesign((prev) => ({
                            ...prev,
                            morphology: { ...prev.morphology, armScale: val, legScale: val },
                          }));
                        }}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>

                    {/* Overall Scale */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>Toplam Karakter Boyutu:</span>
                        <span className="font-mono text-amber-400">{design.morphology.overallScale.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.7"
                        max="1.3"
                        step="0.05"
                        value={design.morphology.overallScale}
                        onChange={(e) =>
                          setDesign((prev) => ({
                            ...prev,
                            morphology: { ...prev.morphology, overallScale: parseFloat(e.target.value) },
                          }))
                        }
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* === TAB 4: AURA, PARLAMA & MALZEME === */}
              {activeTab === 'materials_aura' && (
                <div className="space-y-5">
                  {/* Material Shader Type */}
                  <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-amber-300">Kürk & Zırh Malzeme Efekti:</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'standard', label: 'Doğal Kürk', desc: 'Mat & yumuşak' },
                        { id: 'shiny', label: 'Parlak Vinil', desc: 'Işıltılı oyuncak' },
                        { id: 'gold', label: 'Altın Metalik', desc: 'Kraliyet zırhı' },
                        { id: 'magma', label: 'Lav & Magma', desc: 'Ateşli ışıma' },
                        { id: 'cyber', label: 'Siber Mecha', desc: 'Neon yansıma' },
                        { id: 'glass', label: 'Buz Kristali', desc: 'Yarı şeffaf' },
                      ].map((mat) => (
                        <button
                          key={mat.id}
                          onClick={() =>
                            setDesign((prev) => ({
                              ...prev,
                              materialType: mat.id as MaterialType,
                            }))
                          }
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            design.materialType === mat.id
                              ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <p className="text-xs font-bold">{mat.label}</p>
                          <p className="text-[10px] text-slate-400">{mat.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Aura Particles */}
                  <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-slate-200">Enerji Aurası & Parçacıklar:</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'none', label: 'Yok', icon: '🚫' },
                        { id: 'sparkles', label: 'Yıldız Parıltısı', icon: '✨' },
                        { id: 'fire', label: 'Alev Çemberi', icon: '🔥' },
                        { id: 'cosmic', label: 'Kozmik Sis', icon: '🌌' },
                        { id: 'lightning', label: 'Elektrik Kıvılcımı', icon: '⚡' },
                        { id: 'honey', label: 'Bal Damlacıkları', icon: '🍯' },
                      ].map((aura) => (
                        <button
                          key={aura.id}
                          onClick={() =>
                            setDesign((prev) => ({
                              ...prev,
                              auraType: aura.id as AuraType,
                            }))
                          }
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            design.auraType === aura.id
                              ? 'bg-sky-500/20 border-sky-400 text-sky-200 font-bold'
                              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span className="text-xl">{aura.icon}</span>
                          <span className="text-xs">{aura.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cape Toggle */}
                  <div className="flex items-center justify-between bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                    <div>
                      <p className="text-xs font-bold text-slate-200">Kahraman Pelerini:</p>
                      <p className="text-[11px] text-slate-400">
                        Yüklenen resmi pelerin arkasına tablo olarak işler.
                      </p>
                    </div>
                    <button
                      onClick={() => setDesign((prev) => ({ ...prev, capeEnabled: !prev.capeEnabled }))}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        design.capeEnabled
                          ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {design.capeEnabled ? '✅ Pelerin Açık' : '❌ Pelerin Kapalı'}
                    </button>
                  </div>
                </div>
              )}

              {/* === TAB 5: KAYITLI ŞABLONLAR & DIŞA AKTAR === */}
              {activeTab === 'presets' && (
                <div className="space-y-5">
                  {/* Preset List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-200">
                        Kayıtlı Özel Tasarımların ({presets.length}):
                      </h4>
                      <button
                        onClick={handleSaveCurrentPreset}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer shadow-md"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Mevcut Tasarımı Kaydet
                      </button>
                    </div>

                    {presets.length === 0 ? (
                      <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-slate-800">
                        <p className="text-sm text-slate-400">Henüz kaydedilmiş özel karakterin yok.</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Yeni bir karakter tasarlayıp "Mevcut Tasarımı Kaydet" butonuna basabilirsin!
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {presets.map((p) => (
                          <div
                            key={p.id}
                            className="bg-slate-800/60 border border-slate-700 p-3 rounded-2xl flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className="w-8 h-8 rounded-xl border border-white/20 shrink-0"
                                style={{ backgroundColor: p.palette.furColor }}
                              />
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-200 truncate">{p.name}</p>
                                <p className="text-[10px] text-slate-400">
                                  {new Date(p.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => {
                                  setDesign({ ...p });
                                  showToast(`📂 "${p.name}" yüklendi!`);
                                }}
                                className="px-3 py-1 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs cursor-pointer"
                              >
                                Yükle
                              </button>
                              <button
                                onClick={() => {
                                  const updated = deletePreset(p.id);
                                  setPresets(updated);
                                  showToast('Silindi.');
                                }}
                                className="p-1 rounded-xl bg-slate-700 hover:bg-rose-500 text-slate-300 hover:text-white cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Share / Export Card */}
                  <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-200">3D Karakter Kartı İndir:</p>
                      <p className="text-[11px] text-slate-400">
                        Karakterinin 3D modeli ve renk paletiyle yüksek çözünürlüklü kart oluşturur.
                      </p>
                    </div>
                    <button
                      onClick={handleDownloadCard}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs cursor-pointer shadow-lg"
                    >
                      <Download className="w-4 h-4" />
                      Kartı İndir (PNG)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* --- Bottom Action & Apply Bar --- */}
            <div className="px-4 sm:px-6 py-3.5 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const def = createDefaultDesign();
                    setDesign(def);
                    showToast('🔄 Varsayılana sıfırlandı.');
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer transition-all flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Sıfırla
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer transition-all"
                >
                  Kapat
                </button>

                <button
                  onClick={handleApplyToGame}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition-all transform active:scale-95 cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  🎮 Oyuna Uygula & Başla
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Floating Toast Notification */}
        {notification && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-slate-950/95 border border-amber-400/80 text-amber-300 font-bold px-4 py-2 rounded-2xl shadow-2xl text-xs z-50 animate-bounce flex items-center gap-2">
            <span>✨</span>
            <span>{notification}</span>
          </div>
        )}

      </div>
    </div>
  );
};
