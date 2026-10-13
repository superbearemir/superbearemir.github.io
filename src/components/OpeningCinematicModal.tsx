import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { 
  Rocket, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Compass, 
  Camera, 
  X,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronLeft,
  Flame,
  Star,
  Mic,
  MicOff,
  Sparkles,
  Gamepad2,
  Eye
} from 'lucide-react';
import { createCustomBear3D, BuiltBearModel } from '../customizer/3dBearBuilder';

interface OpeningCinematicModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SceneInfo {
  id: number;
  title: string;
  badge: string;
  badgeColor: string;
  duration: number; // in seconds
  speaker: string;
  speakerTag: string;
  dialogue: string;
  narrationVoice: string;
  summary: string;
  musicType: 'peaceful' | 'alarm' | 'sorrow' | 'action' | 'triumph';
}

const CINEMATIC_SCENES: SceneInfo[] = [
  {
    id: 1,
    title: "1. SAHNE: KOZMİK HUZUR & YILDIZLARARASI YOLCULUK",
    badge: "🚀 KOZMİK YOLCULUK",
    badgeColor: "from-sky-500 via-indigo-600 to-purple-600",
    duration: 8.5,
    speaker: "🐻 SÜPER AYI GRIZZY",
    speakerTag: "Neşeli & Sevgi Dolu",
    dialogue: "Bakın canım ailem, sonsuz galaksiler ne kadar da büyüleyici parıldıyor! Yeni macera gezegenimize güvenle varmak üzereyiz!",
    narrationVoice: "Bakın canım ailem, sonsuz galaksiler ne kadar da büyüleyici parıldıyor! Yeni macera gezegenimize varmak üzereyiz!",
    summary: "Grizzy Süper Ayı ve ailesi, yüksek teknolojili uzay roketinde evrenin derinliklerinde neşeyle yol alıyor.",
    musicType: 'peaceful'
  },
  {
    id: 2,
    title: "2. SAHNE: KIRMIZI ALARM & DEV METEOR ÇARPIŞMASI",
    badge: "⚠️ METEOR ÇARPIŞMASI",
    badgeColor: "from-red-600 via-amber-600 to-rose-700",
    duration: 9.0,
    speaker: "🤖 ROKET YAPAY ZEKASI",
    speakerTag: "Kritik Acil Durum!",
    dialogue: "DİKKAT! YÜKSEK HIZLI ALEVLİ METEOR KORİDORUMUZA GİRDİ! REAKTÖR ÇARPIŞMASINA 3... 2... 1... TUTUNUN!",
    narrationVoice: "DİKKAT! YÜKSEK HIZLI ALEVLİ METEOR KORİDORUMUZA GİRDİ! ÇARPIŞMAYA ÜÇ, İKİ, BİR... TUTUNUN!",
    summary: "Alev saçan devasa bir uzay meteoru ana motora çarpar, patlamayla tüm sirenler çalmaya başlar!",
    musicType: 'alarm'
  },
  {
    id: 3,
    title: "3. SAHNE: ROKET İKİYE AYRILIYOR & ACI AYRILIK",
    badge: "💔 KAÇIŞ KAPSÜLÜ",
    badgeColor: "from-purple-600 via-pink-600 to-indigo-800",
    duration: 9.5,
    speaker: "🐻 SÜPER AYI GRIZZY",
    speakerTag: "Ayrılık Çığlığı",
    dialogue: "HAYIRRR! Kapsüle geçin! Sizi evrenin hangi köşesinde olursa olsun bulacağım, söz veriyorum! Bekleyin beni!",
    narrationVoice: "HAYIR! Kapsüle geçin! Sizi evrenin hangi köşesinde olursa olsun mutlaka bulacağım, söz veriyorum! Beni bekleyin!",
    summary: "Gövde parçalanırken kaçış kapsülü uzay girdabına fırlar; Grizzy derin uzay boşluğuna düşer.",
    musicType: 'sorrow'
  },
  {
    id: 4,
    title: "4. SAHNE: ATMOSFERİ YARIŞ & ATEŞ KÜRESİ DÜŞÜŞÜ",
    badge: "🔥 ATMOSFER DÜŞÜŞÜ",
    badgeColor: "from-amber-500 via-orange-600 to-red-600",
    duration: 8.5,
    speaker: "⚡ GRIZZY SÜPER AYI",
    speakerTag: "Ses Duvarı Aşıldı",
    dialogue: "Yerçekimi beni çağırıyor! Gökyüzü alev aldı... Ayı Köyü vadisine doğru süpersonik hızla çakılıyorum!",
    narrationVoice: "Yerçekimi beni çağırıyor! Gökyüzü alev aldı... Ayı Köyü vadisine doğru hızla çakılıyorum!",
    summary: "Ateş plazmasına bürünen Grizzy, atmosfer tabakasını delip vadiye doğru meteor hızıyla iniş yapar.",
    musicType: 'action'
  },
  {
    id: 5,
    title: "5. SAHNE: AYI KÖYÜ & KAHRAMANIN BÜYÜK YEMİNİ",
    badge: "👑 EFSANENİN DOĞUŞU",
    badgeColor: "from-amber-400 via-yellow-500 to-emerald-500",
    duration: 10.5,
    speaker: "⚡ GRIZZY SÜPER AYI",
    speakerTag: "Kahraman Yemini",
    dialogue: "Ailem uzayın derinliklerinde tutsak... 15 zorlu seviyeyi tek tek aşacağım ve onları kurtaracağım! BAŞLIYORUZ!",
    narrationVoice: "Ailem uzayın derinliklerinde tutsak... On beş zorlu seviyeyi tek tek aşacağım ve onları kurtaracağım! Başlıyoruz!",
    summary: "Krater dumanlarından altın süper güç zırhıyla doğan Grizzy, göğe doğru kükreyerek büyük kurtarma seferini başlatır!",
    musicType: 'triumph'
  }
];

export const OpeningCinematicModal: React.FC<OpeningCinematicModalProps> = ({ isOpen, onClose }) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVoiceDubEnabled, setIsVoiceDubEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cameraMode, setCameraMode] = useState<'director' | 'orbit'>('director');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [progress, setProgress] = useState(0);

  // References for Three.js
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // 3D Model and Object references
  const grizzyBearRef = useRef<BuiltBearModel | null>(null);
  const babyBearRef = useRef<BuiltBearModel | null>(null);
  const rocketGroupRef = useRef<THREE.Group | null>(null);
  const rocketLeftWingRef = useRef<THREE.Mesh | null>(null);
  const rocketRightWingRef = useRef<THREE.Mesh | null>(null);
  const rocketFlamesRef = useRef<THREE.Group | null>(null);
  const podGroupRef = useRef<THREE.Group | null>(null);
  const meteorMeshRef = useRef<THREE.Mesh | null>(null);
  const meteorTrailRef = useRef<THREE.Points | null>(null);
  const explosionParticlesRef = useRef<THREE.Points | null>(null);
  const speedLinesRef = useRef<THREE.LineSegments | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const nebulaGroupRef = useRef<THREE.Group | null>(null);
  const fireAuraRef = useRef<THREE.Points | null>(null);
  const groundCraterRef = useRef<THREE.Group | null>(null);
  const alarmLightRef = useRef<THREE.PointLight | null>(null);
  const spotlightRef = useRef<THREE.SpotLight | null>(null);
  const explosionFlashLightRef = useRef<THREE.PointLight | null>(null);

  // Screen Shake trauma
  const cameraTraumaRef = useRef<number>(0);

  // Interactive Orbit state
  const orbitState = useRef({
    isDragging: false,
    prevX: 0,
    prevY: 0,
    rotY: 0,
    rotX: 0.15,
    zoom: 4.6
  });

  const sceneInfo = CINEMATIC_SCENES[currentSceneIndex];

  // Turkish Voice Dubbing using SpeechSynthesis
  const speakDialogue = useCallback((text: string, speakerName: string) => {
    if (!isVoiceDubEnabled || isMuted || typeof window === 'undefined') return;
    if (!('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'tr-TR';

      // Pick Turkish voice if available
      const voices = window.speechSynthesis.getVoices();
      const trVoice = voices.find(v => v.lang.toLowerCase().includes('tr') || v.lang.toLowerCase().includes('tur'));
      if (trVoice) {
        utterance.voice = trVoice;
      }

      // Voice pitch & rate adjustments per character
      if (speakerName.includes('YAPAY ZEKA') || speakerName.includes('BİLGİSAYAR')) {
        utterance.pitch = 1.35; // Robotic alert pitch
        utterance.rate = 1.15;
      } else if (speakerName.includes('GRIZZY')) {
        utterance.pitch = 0.95; // Warm, bold bear hero
        utterance.rate = 1.05;
      } else {
        utterance.pitch = 1.0;
        utterance.rate = 1.0;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
    }
  }, [isVoiceDubEnabled, isMuted]);

  // Stop speech when closing or changing
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Web Audio Synthesizer (Atmospheric Music & Sound Effects)
  const playCinematicSound = (type: SceneInfo['musicType']) => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;

      if (type === 'peaceful') {
        // Lush deep space chords (Major 9th harmony)
        [220, 277.18, 329.63, 415.30, 493.88].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.linearRampToValueAtTime(0.08, now + 1.2);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 5.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.12);
          osc.stop(now + 5.5);
        });
      } else if (type === 'alarm') {
        // Rapid alternating klaxon sirens
        for (let i = 0; i < 5; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(920, now + i * 0.35);
          osc.frequency.setValueAtTime(580, now + i * 0.35 + 0.18);
          gain.gain.setValueAtTime(0.12, now + i * 0.35);
          gain.gain.linearRampToValueAtTime(0.001, now + i * 0.35 + 0.33);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.35);
          osc.stop(now + i * 0.35 + 0.33);
        }
      } else if (type === 'sorrow') {
        // Melancholic emotional minor chord progression
        [196, 233.08, 293.66, 349.23, 440].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.18);
          gain.gain.setValueAtTime(0.07, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 5.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.18);
          osc.stop(now + 5.5);
        });
      } else if (type === 'action') {
        // Atmospheric roaring wind & hypersonic shockwave
        const bufferSize = ctx.sampleRate * 2.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.35;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(320, now);
        filter.frequency.exponentialRampToValueAtTime(90, now + 2.5);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 2.5);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now);
      } else if (type === 'triumph') {
        // Heroic fanfare brass chords with resonant bass boom
        const notes = [130.81, 261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = idx < 2 ? 'sawtooth' : 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.18);
          gain.gain.setValueAtTime(0.12, now + idx * 0.18);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.18 + 1.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.18);
          osc.stop(now + idx * 0.18 + 1.8);
        });
      }
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  };

  // Play explosion sound effect on meteor collision
  const playExplosionSound = () => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) return;
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;

      // Heavy 808 sub-bass drop
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(140, now);
      subOsc.frequency.exponentialRampToValueAtTime(30, now + 0.8);
      subGain.gain.setValueAtTime(0.4, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.9);

      // Noise explosion burst
      const bufferSize = ctx.sampleRate * 0.8;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(80, now + 0.7);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
    } catch (e) {
      console.warn('Explosion sound error', e);
    }
  };

  // Sound and Voice on scene change
  useEffect(() => {
    if (isOpen) {
      playCinematicSound(sceneInfo.musicType);
      // Slight delay so the sound and speech blend harmoniously
      const voiceTimeout = setTimeout(() => {
        speakDialogue(sceneInfo.narrationVoice, sceneInfo.speaker);
      }, 350);
      return () => clearTimeout(voiceTimeout);
    }
  }, [currentSceneIndex, isOpen, isVoiceDubEnabled]);

  // Scene auto-advance timer with playbackSpeed control
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const intervalTime = 100;
    const effectiveDuration = sceneInfo.duration / playbackSpeed;
    const totalSteps = (effectiveDuration * 1000) / intervalTime;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const curProgress = (step / totalSteps) * 100;
      setProgress(curProgress);

      if (step >= totalSteps) {
        if (currentSceneIndex < CINEMATIC_SCENES.length - 1) {
          setCurrentSceneIndex(prev => prev + 1);
          setProgress(0);
        } else {
          setIsPlaying(false);
        }
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, currentSceneIndex, sceneInfo.duration, playbackSpeed]);

  // Toggle Fullscreen helper
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Main Three.js Scene Setup & Animation Loop
  useEffect(() => {
    if (!isOpen) return;

    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 900;
    const height = mount.clientHeight || 520;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.4, 4.8);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    while (mount.firstChild) {
      mount.removeChild(mount.firstChild);
    }
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff7ed, 1.6);
    dirLight.position.set(6, 12, 8);
    scene.add(dirLight);

    const cyanRimLight = new THREE.DirectionalLight(0x38bdf8, 1.3);
    cyanRimLight.position.set(-8, -3, -6);
    scene.add(cyanRimLight);

    // Dynamic red alarm point light
    const alarmLight = new THREE.PointLight(0xff1e00, 0, 25);
    alarmLight.position.set(0, 3, 2);
    scene.add(alarmLight);
    alarmLightRef.current = alarmLight;

    // Explosion flash light (white/yellow shock)
    const explosionFlashLight = new THREE.PointLight(0xfffbeb, 0, 30);
    explosionFlashLight.position.set(0, 1, 0);
    scene.add(explosionFlashLight);
    explosionFlashLightRef.current = explosionFlashLight;

    // Dramatic golden spotlight for hero reveal
    const spotlight = new THREE.SpotLight(0xfbbf24, 2.5, 35, Math.PI / 4, 0.35);
    spotlight.position.set(0, 9, 2);
    scene.add(spotlight);
    spotlightRef.current = spotlight;

    // 5. Deep Space 3D Starfield & Colored Nebulae
    const starCount = 1400;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 140;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 140;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 140;

      const c = Math.random();
      if (c > 0.65) {
        starColors[i * 3] = 0.38; starColors[i * 3 + 1] = 0.82; starColors[i * 3 + 2] = 1.0; // Cyan
      } else if (c > 0.35) {
        starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 0.85; starColors[i * 3 + 2] = 0.45; // Gold
      } else if (c > 0.15) {
        starColors[i * 3] = 0.95; starColors[i * 3 + 1] = 0.45; starColors[i * 3 + 2] = 0.95; // Magenta nebula
      } else {
        starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 1.0; starColors[i * 3 + 2] = 1.0; // White
      }
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      transparent: true,
      opacity: 0.95
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);
    particlesRef.current = starPoints;

    // 6. Glowing Cosmic Nebula Clouds (Volumetric Dust)
    const nebulaGroup = new THREE.Group();
    const nebCount = 400;
    const nebGeo = new THREE.BufferGeometry();
    const nebPos = new Float32Array(nebCount * 3);
    const nebCol = new Float32Array(nebCount * 3);
    for (let i = 0; i < nebCount; i++) {
      nebPos[i * 3] = (Math.random() - 0.5) * 60 + 10;
      nebPos[i * 3 + 1] = (Math.random() - 0.5) * 30 + 5;
      nebPos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 20;

      nebCol[i * 3] = 0.4 + Math.random() * 0.5;
      nebCol[i * 3 + 1] = 0.1 + Math.random() * 0.3;
      nebCol[i * 3 + 2] = 0.7 + Math.random() * 0.3;
    }
    nebGeo.setAttribute('position', new THREE.BufferAttribute(nebPos, 3));
    nebGeo.setAttribute('color', new THREE.BufferAttribute(nebCol, 3));
    const nebMat = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    const nebMesh = new THREE.Points(nebGeo, nebMat);
    nebulaGroup.add(nebMesh);
    scene.add(nebulaGroup);
    nebulaGroupRef.current = nebulaGroup;

    // 7. Authentic 3D Grizzy Bear Model
    const grizzyBear = createCustomBear3D();
    scene.add(grizzyBear.root);
    grizzyBearRef.current = grizzyBear;

    // 8. 3D Baby Bear (cub)
    const babyBear = createCustomBear3D();
    babyBear.root.scale.set(0.42, 0.42, 0.42);
    babyBear.root.position.set(0.9, -0.2, 0.3);
    scene.add(babyBear.root);
    babyBearRef.current = babyBear;

    // 9. Upgraded High-Tech Space Rocket
    const rocketGroup = new THREE.Group();

    // Rocket Main Fuselage
    const rocketBodyGeo = new THREE.CylinderGeometry(0.85, 0.9, 3.4, 28);
    const rocketMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.75,
      roughness: 0.22
    });
    const rocketBody = new THREE.Mesh(rocketBodyGeo, rocketMat);
    rocketBody.rotation.z = Math.PI / 2;
    rocketGroup.add(rocketBody);

    // Decorative Red & Blue Racing Stripes on Rocket
    const stripeGeo = new THREE.CylinderGeometry(0.86, 0.86, 0.35, 28);
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.6, roughness: 0.3 });
    const stripeMesh = new THREE.Mesh(stripeGeo, stripeMat);
    stripeMesh.rotation.z = Math.PI / 2;
    stripeMesh.position.x = 0.6;
    rocketGroup.add(stripeMesh);

    // Aerodynamic Nose Cone
    const noseGeo = new THREE.ConeGeometry(0.85, 1.5, 28);
    const noseMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      metalness: 0.6,
      roughness: 0.25
    });
    const noseMesh = new THREE.Mesh(noseGeo, noseMat);
    noseMesh.rotation.z = -Math.PI / 2;
    noseMesh.position.x = 2.45;
    rocketGroup.add(noseMesh);

    // Cockpit Glass Dome
    const domeGeo = new THREE.SphereGeometry(0.5, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.95,
      roughness: 0.08,
      transparent: true,
      opacity: 0.82
    });
    const domeMesh = new THREE.Mesh(domeGeo, domeMat);
    domeMesh.position.set(0.65, 0.75, 0);
    rocketGroup.add(domeMesh);

    // Solar Wings (Left & Right)
    const wingGeo = new THREE.BoxGeometry(0.8, 0.08, 2.2);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.8,
      roughness: 0.2
    });
    const leftWing = new THREE.Mesh(wingGeo, wingMat);
    leftWing.position.set(-0.2, 0, 1.6);
    rocketGroup.add(leftWing);
    rocketLeftWingRef.current = leftWing;

    const rightWing = new THREE.Mesh(wingGeo, wingMat);
    rightWing.position.set(-0.2, 0, -1.6);
    rocketGroup.add(rightWing);
    rocketRightWingRef.current = rightWing;

    // Dual Thruster Engines
    const engineGeo = new THREE.CylinderGeometry(0.35, 0.52, 0.7, 20);
    const engineMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85 });
    const engine1 = new THREE.Mesh(engineGeo, engineMat);
    engine1.rotation.z = Math.PI / 2;
    engine1.position.set(-2.0, 0.35, 0);
    rocketGroup.add(engine1);

    const engine2 = new THREE.Mesh(engineGeo, engineMat);
    engine2.rotation.z = Math.PI / 2;
    engine2.position.set(-2.0, -0.35, 0);
    rocketGroup.add(engine2);

    // Glowing Rocket Thruster Flames Group
    const flamesGroup = new THREE.Group();
    const flameGeo1 = new THREE.ConeGeometry(0.38, 1.8, 16);
    const flameMat1 = new THREE.MeshBasicMaterial({ color: 0xf97316 });
    const flame1 = new THREE.Mesh(flameGeo1, flameMat1);
    flame1.rotation.z = Math.PI / 2;
    flame1.position.set(-3.0, 0.35, 0);
    flamesGroup.add(flame1);

    const flame2 = new THREE.Mesh(flameGeo1, flameMat1);
    flame2.rotation.z = Math.PI / 2;
    flame2.position.set(-3.0, -0.35, 0);
    flamesGroup.add(flame2);

    // Inner blue core flame
    const coreFlameGeo = new THREE.ConeGeometry(0.18, 1.2, 16);
    const coreFlameMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const coreFlame1 = new THREE.Mesh(coreFlameGeo, coreFlameMat);
    coreFlame1.rotation.z = Math.PI / 2;
    coreFlame1.position.set(-2.7, 0.35, 0);
    flamesGroup.add(coreFlame1);

    const coreFlame2 = new THREE.Mesh(coreFlameGeo, coreFlameMat);
    coreFlame2.rotation.z = Math.PI / 2;
    coreFlame2.position.set(-2.7, -0.35, 0);
    flamesGroup.add(coreFlame2);

    rocketGroup.add(flamesGroup);
    rocketFlamesRef.current = flamesGroup;

    rocketGroup.position.set(0, -0.6, -1.2);
    scene.add(rocketGroup);
    rocketGroupRef.current = rocketGroup;

    // 10. Glowing 3D Meteor with Magma Crust
    const meteorGeo = new THREE.DodecahedronGeometry(1.3, 2);
    const meteorMat = new THREE.MeshStandardMaterial({
      color: 0x3f1b0a,
      roughness: 0.85,
      emissive: 0xea580c,
      emissiveIntensity: 0.65
    });
    const meteorMesh = new THREE.Mesh(meteorGeo, meteorMat);
    meteorMesh.position.set(14, 7, -3);
    scene.add(meteorMesh);
    meteorMeshRef.current = meteorMesh;

    // Meteor Fire Trail Particles
    const trailCount = 180;
    const trailGeo = new THREE.BufferGeometry();
    const trailPos = new Float32Array(trailCount * 3);
    for (let i = 0; i < trailCount; i++) {
      trailPos[i * 3] = (Math.random() - 0.5) * 0.8;
      trailPos[i * 3 + 1] = (Math.random() - 0.5) * 0.8;
      trailPos[i * 3 + 2] = i * 0.25;
    }
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
    const trailMat = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 0.25,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const meteorTrail = new THREE.Points(trailGeo, trailMat);
    meteorMesh.add(meteorTrail);
    meteorTrailRef.current = meteorTrail;

    // 11. Explosion Shrapnel & Blast Particles
    const expCount = 350;
    const expGeo = new THREE.BufferGeometry();
    const expPos = new Float32Array(expCount * 3);
    const expVels: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i < expCount; i++) {
      expPos[i * 3] = 0;
      expPos[i * 3 + 1] = 0;
      expPos[i * 3 + 2] = 0;
      expVels.push({
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 8,
        z: (Math.random() - 0.5) * 8
      });
    }
    expGeo.setAttribute('position', new THREE.BufferAttribute(expPos, 3));
    const expMat = new THREE.PointsMaterial({
      color: 0xf97316,
      size: 0.32,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const explosionParticles = new THREE.Points(expGeo, expMat);
    explosionParticles.visible = false;
    scene.add(explosionParticles);
    explosionParticlesRef.current = explosionParticles;

    // 12. Hypersonic Re-entry Speed Lines for Scene 4
    const lineCount = 120;
    const linePositions = new Float32Array(lineCount * 6);
    for (let i = 0; i < lineCount; i++) {
      const lx = (Math.random() - 0.5) * 12;
      const lz = (Math.random() - 0.5) * 12;
      linePositions[i * 6] = lx;
      linePositions[i * 6 + 1] = 15;
      linePositions[i * 6 + 2] = lz;

      linePositions[i * 6 + 3] = lx;
      linePositions[i * 6 + 4] = -15;
      linePositions[i * 6 + 5] = lz;
    }
    const speedLineGeo = new THREE.BufferGeometry();
    speedLineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const speedLineMat = new THREE.LineBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.55
    });
    const speedLines = new THREE.LineSegments(speedLineGeo, speedLineMat);
    speedLines.visible = false;
    scene.add(speedLines);
    speedLinesRef.current = speedLines;

    // 13. High-Tech Escape Pod (Family Pod)
    const podGroup = new THREE.Group();
    const podBodyGeo = new THREE.SphereGeometry(0.75, 28, 28);
    const podBodyMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.75,
      roughness: 0.18
    });
    const podBody = new THREE.Mesh(podBodyGeo, podBodyMat);
    podGroup.add(podBody);

    // Glowing Viewport Window where baby bear is visible
    const podWindowGeo = new THREE.SphereGeometry(0.42, 20, 20);
    const podWindowMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9 });
    const podWindow = new THREE.Mesh(podWindowGeo, podWindowMat);
    podWindow.position.set(0.32, 0.22, 0.42);
    podGroup.add(podWindow);

    // Escape Pod Thrusters
    const podThrusterGeo = new THREE.CylinderGeometry(0.2, 0.35, 0.4, 16);
    const podThrusterMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
    const podThruster = new THREE.Mesh(podThrusterGeo, podThrusterMat);
    podThruster.rotation.x = Math.PI / 2;
    podThruster.position.set(0, 0, -0.85);
    podGroup.add(podThruster);

    // Pod Trail Flame
    const podFlameGeo = new THREE.ConeGeometry(0.3, 1.4, 16);
    const podFlameMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const podFlame = new THREE.Mesh(podFlameGeo, podFlameMat);
    podFlame.rotation.x = -Math.PI / 2;
    podFlame.position.set(0, 0, -1.6);
    podGroup.add(podFlame);

    podGroup.position.set(4, 2, -6);
    podGroup.visible = false;
    scene.add(podGroup);
    podGroupRef.current = podGroup;

    // 14. Bear Village 3D Environment (Village Ground, Totems & Pines)
    const groundGroup = new THREE.Group();

    // Main Village Soil Disc
    const groundDiscGeo = new THREE.CylinderGeometry(5.5, 6.0, 0.5, 36);
    const groundDiscMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a24, // Deep Nordic grass soil
      roughness: 0.85
    });
    const groundDisc = new THREE.Mesh(groundDiscGeo, groundDiscMat);
    groundDisc.position.y = -0.25;
    groundGroup.add(groundDisc);

    // Hero Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(1.8, 2.1, 0.35, 28);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.6,
      roughness: 0.3
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = 0.12;
    groundGroup.add(pedestal);

    // Glowing Golden Runic Ring
    const goldRingGeo = new THREE.RingGeometry(1.7, 1.9, 36);
    const goldRingMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      side: THREE.DoubleSide
    });
    const goldRing = new THREE.Mesh(goldRingGeo, goldRingMat);
    goldRing.rotation.x = -Math.PI / 2;
    goldRing.position.y = 0.31;
    groundGroup.add(goldRing);

    // Village Pine Trees around the clearing
    const pinePositions = [
      { x: -3.6, z: -2.8, s: 1.2 },
      { x: 3.8, z: -2.4, s: 1.3 },
      { x: -4.0, z: 2.0, s: 1.1 },
      { x: 3.5, z: 2.6, s: 1.25 }
    ];
    pinePositions.forEach(p => {
      const treeGroup = new THREE.Group();
      // Trunk
      const trunkGeo = new THREE.CylinderGeometry(0.15, 0.2, 1.2, 10);
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 0.6;
      treeGroup.add(trunk);

      // Layered pine cones
      [0.9, 1.5, 2.1].forEach((py, lIdx) => {
        const coneGeo = new THREE.ConeGeometry(0.9 - lIdx * 0.2, 0.9, 12);
        const coneMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.8 });
        const cone = new THREE.Mesh(coneGeo, coneMat);
        cone.position.y = py;
        treeGroup.add(cone);
      });

      treeGroup.position.set(p.x, 0, p.z);
      treeGroup.scale.set(p.s, p.s, p.s);
      groundGroup.add(treeGroup);
    });

    groundGroup.position.set(0, -0.6, 0);
    groundGroup.visible = false;
    scene.add(groundGroup);
    groundCraterRef.current = groundGroup;

    // 15. Golden Superpower Fire Aura Particles for Hero Finale
    const auraCount = 280;
    const auraGeo = new THREE.BufferGeometry();
    const auraPositions = new Float32Array(auraCount * 3);
    for (let i = 0; i < auraCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.7 + Math.random() * 1.1;
      auraPositions[i * 3] = Math.cos(angle) * radius;
      auraPositions[i * 3 + 1] = Math.random() * 2.8;
      auraPositions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    auraGeo.setAttribute('position', new THREE.BufferAttribute(auraPositions, 3));
    const auraMat = new THREE.PointsMaterial({
      color: 0xfbbf24,
      size: 0.18,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const auraPoints = new THREE.Points(auraGeo, auraMat);
    auraPoints.visible = false;
    scene.add(auraPoints);
    fireAuraRef.current = auraPoints;

    // 16. Dynamic Render Loop with Hollywood Camera & Physics
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Rotate starfield and nebulae slowly
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsed * 0.025;
        particlesRef.current.rotation.x = elapsed * 0.012;
      }
      if (nebulaGroupRef.current) {
        nebulaGroupRef.current.rotation.y = -elapsed * 0.015;
      }

      // Read current scene dynamically
      const curScene = (window as any).__cinematicCurrentSceneIndex !== undefined 
        ? (window as any).__cinematicCurrentSceneIndex 
        : currentSceneIndex;

      // Animate 3D Scene Actors based on active scene
      if (curScene === 0) {
        // --- SCENE 1: Cosmic Cruise ---
        rocketGroup.visible = true;
        meteorMesh.visible = false;
        podGroup.visible = false;
        groundGroup.visible = false;
        speedLines.visible = false;
        if (alarmLightRef.current) alarmLightRef.current.intensity = 0;
        if (spotlightRef.current) spotlightRef.current.intensity = 0.5;
        if (fireAuraRef.current) fireAuraRef.current.visible = false;
        if (explosionParticlesRef.current) explosionParticlesRef.current.visible = false;

        // Position Grizzy standing proudly waving cape
        if (grizzyBearRef.current) {
          grizzyBearRef.current.root.position.set(0, 0, 0);
          grizzyBearRef.current.root.rotation.set(0, 0.3, 0);
          grizzyBearRef.current.root.scale.set(1, 1, 1);
          grizzyBearRef.current.setAnimationPose('wave', elapsed);
        }

        // Baby bear hopping happily
        if (babyBearRef.current) {
          babyBearRef.current.root.visible = true;
          babyBearRef.current.root.position.set(1.25, -0.28 + Math.abs(Math.sin(elapsed * 6)) * 0.22, 0.45);
          babyBearRef.current.root.rotation.y = -0.3;
          babyBearRef.current.setAnimationPose('dance', elapsed);
        }

        // Rocket floating oscillation
        rocketGroup.position.set(0, -0.7 + Math.sin(elapsed * 1.6) * 0.12, -1.2);
        rocketGroup.rotation.z = Math.sin(elapsed * 0.8) * 0.05;
        if (rocketFlamesRef.current) {
          rocketFlamesRef.current.scale.set(1 + Math.sin(elapsed * 22) * 0.25, 1, 1);
        }

      } else if (curScene === 1) {
        // --- SCENE 2: Red Alert & Meteor Strike ---
        rocketGroup.visible = true;
        meteorMesh.visible = true;
        podGroup.visible = false;
        groundGroup.visible = false;
        speedLines.visible = false;
        if (fireAuraRef.current) fireAuraRef.current.visible = false;

        // Emergency flashing red alarm
        const alarmPulse = Math.sin(elapsed * 12) > 0 ? 4.5 : 0.2;
        if (alarmLightRef.current) alarmLightRef.current.intensity = alarmPulse;

        // Meteor hurtles closer and COLLIDES
        const meteorCycle = (elapsed * 0.5) % 3.0; // 3 second crash loop
        if (meteorCycle < 2.4) {
          const prog = meteorCycle / 2.4;
          meteorMesh.position.set(14 - prog * 13, 7 - prog * 6.8, -4 + prog * 3.2);
          meteorMesh.rotation.x = elapsed * 4;
          meteorMesh.rotation.y = elapsed * 3;
          if (explosionParticlesRef.current) explosionParticlesRef.current.visible = false;
          if (explosionFlashLightRef.current) explosionFlashLightRef.current.intensity = 0;
        } else {
          // Impact explosion!
          cameraTraumaRef.current = Math.max(cameraTraumaRef.current, 0.85);
          if (explosionParticlesRef.current) {
            explosionParticlesRef.current.visible = true;
            explosionParticlesRef.current.position.set(1.0, 0.2, -0.8);
          }
          if (explosionFlashLightRef.current) {
            explosionFlashLightRef.current.intensity = 5.0;
          }
        }

        // Grizzy alarmed shake
        if (grizzyBearRef.current) {
          grizzyBearRef.current.root.position.set(Math.sin(elapsed * 25) * 0.08, 0, 0);
          grizzyBearRef.current.setAnimationPose('dance', elapsed);
        }

        if (babyBearRef.current) {
          babyBearRef.current.root.visible = true;
          babyBearRef.current.root.position.set(0.9, -0.3, 0.2);
          babyBearRef.current.setAnimationPose('idle', elapsed);
        }

        // Rocket shaking violently
        rocketGroup.position.set(
          Math.sin(elapsed * 32) * 0.12,
          -0.7 + Math.cos(elapsed * 28) * 0.12,
          -1.2
        );

      } else if (curScene === 2) {
        // --- SCENE 3: Rocket Fracture & Escape Pod Launch ---
        rocketGroup.visible = true;
        meteorMesh.visible = false;
        podGroup.visible = true;
        groundGroup.visible = false;
        speedLines.visible = false;
        if (alarmLightRef.current) alarmLightRef.current.intensity = 1.2;
        if (fireAuraRef.current) fireAuraRef.current.visible = false;
        if (explosionParticlesRef.current) explosionParticlesRef.current.visible = false;

        // Escape Pod flying into distance
        const podT = (elapsed * 0.9) % 6;
        podGroup.position.set(1.5 + podT * 2.8, 0.8 + podT * 1.6, -3 - podT * 3.8);
        podGroup.rotation.y = elapsed * 2.5;

        // Baby bear is inside the escape pod
        if (babyBearRef.current) babyBearRef.current.root.visible = false;

        // Grizzy reaching out despairingly
        if (grizzyBearRef.current) {
          grizzyBearRef.current.root.position.set(-0.9, -0.2, 0.2);
          grizzyBearRef.current.root.rotation.set(-0.35, 0.85, 0);
          grizzyBearRef.current.setAnimationPose('punch', elapsed);
        }

        // Rocket body broken backwards
        rocketGroup.rotation.z = Math.sin(elapsed * 2.2) * 0.5 - 0.3;
        rocketGroup.position.set(-2.2, -1.4, -2.2);

      } else if (curScene === 3) {
        // --- SCENE 4: Supersonic Atmospheric Plunge ---
        rocketGroup.visible = false;
        meteorMesh.visible = false;
        podGroup.visible = false;
        groundGroup.visible = false;
        speedLines.visible = true;
        if (alarmLightRef.current) alarmLightRef.current.intensity = 0;
        if (spotlightRef.current) spotlightRef.current.intensity = 2.0;

        // Animate supersonic speed lines downward
        if (speedLinesRef.current) {
          speedLinesRef.current.position.y = -((elapsed * 18) % 15);
        }

        // Grizzy plunging headfirst through atmosphere
        if (grizzyBearRef.current) {
          const fallCycle = Math.sin(elapsed * 5);
          grizzyBearRef.current.root.position.set(0, 1.1 + fallCycle * 0.25, 0);
          grizzyBearRef.current.root.rotation.set(0.65, Math.PI + Math.sin(elapsed * 8) * 0.2, 0);
          grizzyBearRef.current.setAnimationPose('spin', elapsed);
        }

        if (babyBearRef.current) babyBearRef.current.root.visible = false;

      } else if (curScene === 4) {
        // --- SCENE 5: Bear Village Crater & Kahramanın Büyük Yemini ---
        rocketGroup.visible = false;
        meteorMesh.visible = false;
        podGroup.visible = false;
        groundGroup.visible = true;
        speedLines.visible = false;
        if (alarmLightRef.current) alarmLightRef.current.intensity = 0;
        if (spotlightRef.current) spotlightRef.current.intensity = 4.0;

        // Activate glowing hero power aura
        if (fireAuraRef.current) {
          fireAuraRef.current.visible = true;
          fireAuraRef.current.rotation.y = elapsed * 3.5;
        }

        // Grizzy standing majestically on pedestal doing legendary ROAR
        if (grizzyBearRef.current) {
          grizzyBearRef.current.root.position.set(0, 0.18, 0);
          grizzyBearRef.current.root.rotation.set(0, Math.sin(elapsed * 0.8) * 0.35, 0);
          grizzyBearRef.current.root.scale.set(1.18, 1.18, 1.18);
          grizzyBearRef.current.setAnimationPose('roar', elapsed);
        }

        if (babyBearRef.current) babyBearRef.current.root.visible = false;
      }

      // Camera Director vs Free Orbit Logic
      if (cameraMode === 'director') {
        let baseCamX = 0, baseCamY = 1.4, baseCamZ = 4.8;
        let lookAtX = 0, lookAtY = 0.3, lookAtZ = 0;

        if (curScene === 0) {
          // Smooth slow sweeping arc around Grizzy and rocket
          const camAngle = elapsed * 0.28;
          baseCamX = Math.sin(camAngle) * 4.4;
          baseCamY = 1.3 + Math.sin(elapsed * 0.6) * 0.25;
          baseCamZ = Math.cos(camAngle) * 4.4;
          lookAtY = 0.2;
        } else if (curScene === 1) {
          // Intense Dutch angle dramatic camera tracking meteor
          baseCamX = Math.sin(elapsed * 0.9) * 0.8 + 2.4;
          baseCamY = 1.5;
          baseCamZ = 3.4;
          lookAtY = 0.35;
        } else if (curScene === 2) {
          // Wide cinematic pull-away tracking shot
          baseCamX = -1.4;
          baseCamY = 1.6;
          baseCamZ = 4.8;
          lookAtX = 0.6;
          lookAtZ = -1.0;
        } else if (curScene === 3) {
          // High-speed tracking shot plunging downward
          baseCamX = 0;
          baseCamY = 3.4;
          baseCamZ = 4.2;
          lookAtY = 0.9;
        } else if (curScene === 4) {
          // Heroic 360 slow rotation around Grizzy with low-angle perspective
          const heroAngle = elapsed * 0.45;
          baseCamX = Math.sin(heroAngle) * 3.8;
          baseCamY = 0.9;
          baseCamZ = Math.cos(heroAngle) * 3.8;
          lookAtY = 0.9;
        }

        // Apply screen shake trauma
        if (cameraTraumaRef.current > 0.01) {
          const shakeX = (Math.random() - 0.5) * cameraTraumaRef.current * 0.8;
          const shakeY = (Math.random() - 0.5) * cameraTraumaRef.current * 0.8;
          camera.position.set(baseCamX + shakeX, baseCamY + shakeY, baseCamZ);
          cameraTraumaRef.current *= 0.92; // Decay shake
        } else {
          camera.position.set(baseCamX, baseCamY, baseCamZ);
        }

        camera.lookAt(lookAtX, lookAtY, lookAtZ);

      } else {
        // Free Orbit Mode: user drags freely
        const { rotY, rotX, zoom } = orbitState.current;
        const cx = Math.sin(rotY) * Math.cos(rotX) * zoom;
        const cy = 0.8 + Math.sin(rotX) * zoom;
        const cz = Math.cos(rotY) * Math.cos(rotX) * zoom;
        camera.position.set(cx, cy, cz);
        camera.lookAt(0, 0.6, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize observer
    const handleResize = () => {
      if (!mount || !camera || !renderer) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (rendererRef.current) rendererRef.current.dispose();
      if (grizzyBearRef.current) grizzyBearRef.current.destroy();
      if (babyBearRef.current) babyBearRef.current.destroy();
      while (mount.firstChild) mount.removeChild(mount.firstChild);
    };
  }, [isOpen, cameraMode]);

  // Sync current scene to window for render loop
  useEffect(() => {
    (window as any).__cinematicCurrentSceneIndex = currentSceneIndex;
  }, [currentSceneIndex]);

  // Drag interaction for Orbit Mode
  const handleMouseDown = (e: React.MouseEvent) => {
    orbitState.current.isDragging = true;
    orbitState.current.prevX = e.clientX;
    orbitState.current.prevY = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!orbitState.current.isDragging) return;
    const dx = e.clientX - orbitState.current.prevX;
    const dy = e.clientY - orbitState.current.prevY;
    orbitState.current.prevX = e.clientX;
    orbitState.current.prevY = e.clientY;

    orbitState.current.rotY += dx * 0.01;
    orbitState.current.rotX = Math.max(-0.6, Math.min(1.2, orbitState.current.rotX - dy * 0.01));
  };

  const handleMouseUp = () => {
    orbitState.current.isDragging = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    orbitState.current.zoom = Math.max(2.2, Math.min(8.0, orbitState.current.zoom + e.deltaY * 0.005));
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl animate-fade-in select-none"
    >
      <div className={`relative w-full h-full ${isFullscreen ? 'max-w-none max-h-none rounded-none' : 'max-w-6xl max-h-[94vh] mx-3 rounded-3xl'} flex flex-col bg-slate-950 border-2 border-amber-500/50 shadow-[0_0_100px_rgba(245,158,11,0.3)] overflow-hidden transition-all duration-300`}>
        
        {/* Top Cinematic Header Bar */}
        <div className="h-16 px-4 md:px-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-amber-500/30 flex items-center justify-between z-20 shrink-0">
          
          {/* Logo & Film Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 flex items-center justify-center text-xl shadow-lg border border-amber-300 animate-pulse">
              🎬
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm md:text-base font-black text-white tracking-wide uppercase">
                  Grizzy Süper Ayı: 3D Sinematik Film
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600/30 border border-red-500 text-red-300 shadow-sm">
                  Full 3D WebGL
                </span>
              </div>
              <p className="text-xs text-amber-300/80 font-medium">
                15 Seviyelik Kurtarma Seferi: Ailenin Peşinde Kozmik Macera
              </p>
            </div>
          </div>

          {/* Quick Scene Selector Chips */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
            {CINEMATIC_SCENES.map((sc, idx) => (
              <button
                key={sc.id}
                onClick={() => {
                  setCurrentSceneIndex(idx);
                  setProgress(0);
                  setIsPlaying(true);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentSceneIndex === idx
                    ? 'bg-gradient-to-r from-amber-500 to-red-500 text-slate-950 shadow-md scale-105'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>{sc.badge}</span>
              </button>
            ))}
          </div>

          {/* Controls: Voice Dub, Camera Mode, Fullscreen, Mute & Close */}
          <div className="flex items-center gap-2">
            
            {/* Turkish Voice Dubbing Toggle */}
            <button
              onClick={() => setIsVoiceDubEnabled(!isVoiceDubEnabled)}
              title={isVoiceDubEnabled ? 'Türkçe Seslendirmeyi Kapat' : 'Türkçe Seslendirmeyi Aç'}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                isVoiceDubEnabled
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {isVoiceDubEnabled ? <Mic className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce text-emerald-400' : ''}`} /> : <MicOff className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">
                {isVoiceDubEnabled ? (isSpeaking ? '🎙️ Konuşuyor...' : '🎙️ Seslendirme Açık') : 'Seslendirme Kapalı'}
              </span>
            </button>

            {/* Camera Mode Toggle */}
            <button
              onClick={() => setCameraMode(prev => prev === 'director' ? 'orbit' : 'director')}
              title={cameraMode === 'director' ? 'Serbest 3D İncelemeye Geç' : 'Sinematik Yönetmen Kamerasına Geç'}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                cameraMode === 'director'
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 hover:bg-amber-500/30'
                  : 'bg-sky-500/20 border-sky-500/50 text-sky-300 hover:bg-sky-500/30'
              }`}
            >
              {cameraMode === 'director' ? <Camera className="w-3.5 h-3.5" /> : <Compass className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">
                {cameraMode === 'director' ? '🎥 Yönetmen' : '🔄 3D Çevir'}
              </span>
            </button>

            {/* Audio Mute/Unmute */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title={isMuted ? 'Müziği ve Sesi Aç' : 'Müziği ve Sesi Kapat'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title={isFullscreen ? 'Tam Ekrandan Çık' : 'Tam Ekrana Geç'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-red-600/20 border border-red-500/40 text-red-300 hover:text-white hover:bg-red-600/40 transition cursor-pointer"
              title="Filmi Kapat ve Oyuna Dön"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3D Viewport Center Area */}
        <div 
          className="relative flex-1 w-full bg-slate-950 overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
        >
          {/* Three.js Canvas Mount */}
          <div ref={mountRef} className="absolute inset-0 w-full h-full" />

          {/* Top Floating Cinematic Watermark */}
          <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 pointer-events-none">
            <span className={`px-3 py-1 rounded-full text-xs font-black text-white bg-gradient-to-r ${sceneInfo.badgeColor} shadow-lg border border-white/20`}>
              {sceneInfo.title}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold text-amber-300 bg-slate-900/80 border border-amber-500/40 backdrop-blur-md">
              Bölüm {sceneInfo.id} / 5
            </span>
          </div>

          {/* 3D Drag Hint in Orbit Mode */}
          {cameraMode === 'orbit' && (
            <div className="absolute top-4 right-4 z-10 px-3.5 py-1.5 rounded-2xl bg-slate-900/90 border border-sky-400/40 text-sky-300 text-xs font-semibold backdrop-blur-md pointer-events-none animate-pulse shadow-lg flex items-center gap-2">
              <Eye className="w-3.5 h-3.5" />
              <span>Fareyle sürükleyip 3D Grizzy'yi 360° serbestçe inceleyebilirsiniz!</span>
            </div>
          )}

          {/* Cinematic Letterbox Vignette Border */}
          <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />
        </div>

        {/* Bottom Dialogue & Control Bar */}
        <div className="bg-slate-950 border-t border-amber-500/30 p-3 md:p-4 z-20 shrink-0 flex flex-col gap-3">
          
          {/* Subtitle Dialogue Card */}
          <div className="flex items-start gap-3 md:gap-4 p-3 md:p-3.5 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-xl backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 flex items-center justify-center text-2xl shadow-lg shrink-0 border border-amber-300/40">
              {sceneInfo.speaker.includes('YAPAY ZEKA') ? '🤖' : '🐻'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black text-amber-400">
                  {sceneInfo.speaker}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {sceneInfo.speakerTag}
                </span>
                {isSpeaking && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Sesli Okunuyor
                  </span>
                )}
              </div>
              <p className="text-sm md:text-base font-bold text-slate-100 leading-snug">
                "{sceneInfo.dialogue}"
              </p>
              <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                {sceneInfo.summary}
              </p>
            </div>
          </div>

          {/* Scrub Timeline & Playback Controls Bar */}
          <div className="flex items-center gap-2 md:gap-3">
            
            {/* Previous Scene Button */}
            <button
              onClick={() => {
                if (currentSceneIndex > 0) {
                  setCurrentSceneIndex(prev => prev - 1);
                  setProgress(0);
                  setIsPlaying(true);
                }
              }}
              disabled={currentSceneIndex === 0}
              className={`p-2 rounded-xl border border-slate-700 transition cursor-pointer ${
                currentSceneIndex === 0 ? 'opacity-40 cursor-not-allowed bg-slate-900' : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title="Önceki Sahne"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Play / Pause Toggle */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 transition font-black cursor-pointer shadow-md"
              title={isPlaying ? 'Durdur' : 'Oynat'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950" />}
            </button>

            {/* Replay Scene */}
            <button
              onClick={() => {
                setProgress(0);
                setIsPlaying(true);
                playCinematicSound(sceneInfo.musicType);
                speakDialogue(sceneInfo.narrationVoice, sceneInfo.speaker);
              }}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Sahneyi Baştan Oynat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Playback Speed Pill */}
            <button
              onClick={() => {
                setPlaybackSpeed(prev => prev === 1.0 ? 1.25 : prev === 1.25 ? 1.5 : 1.0);
              }}
              className="px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 hover:text-white hover:bg-slate-800 transition text-xs font-black cursor-pointer"
              title="Oynatma Hızı"
            >
              {playbackSpeed}x
            </button>

            {/* Progress Bar Container */}
            <div className="flex-1 flex flex-col gap-1 min-w-[80px]">
              <div className="flex justify-between text-[11px] font-bold text-slate-400">
                <span className="truncate">{sceneInfo.badge}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative">
                <div 
                  className={`h-full transition-all duration-100 bg-gradient-to-r ${sceneInfo.badgeColor}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Next Scene / Jump to Game */}
            {currentSceneIndex < CINEMATIC_SCENES.length - 1 ? (
              <button
                onClick={() => {
                  setCurrentSceneIndex(prev => prev + 1);
                  setProgress(0);
                  setIsPlaying(true);
                }}
                className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 text-slate-950 hover:from-amber-400 hover:to-red-400 font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-lg shrink-0"
              >
                <span>Sonraki Sahne</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-amber-500 text-slate-950 hover:from-emerald-400 hover:to-amber-400 font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-lg shrink-0 animate-pulse"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Maceraya Başla!</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
