import React, { useState, useEffect, useRef } from 'react';
import { Rocket, Sparkles, Volume2, VolumeX, Play, Pause, SkipForward, RotateCcw, Heart, Compass, ShieldAlert } from 'lucide-react';

interface OpeningCinematicModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SceneData {
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  duration: number; // in seconds
  description: string;
}

const SCENES: SceneData[] = [
  {
    title: "Sonsuz Uzayda Mutlu Yolculuk",
    subtitle: "Grizzy Süper Ayı ve Ailesi Rokette",
    badge: "1. SAHNE: KOZMİK BİRLİKTELİK",
    badgeColor: "from-sky-500 to-indigo-600",
    duration: 8,
    description: "Grizzy Süper Ayı, sevgili eşi, yavru kardeşleri ve tüm ayı ailesiyle birlikte yüksek teknolojili uzay roketinde neşeyle uzay yolculuğu yapıyordu. Evrenin büyüleyici yıldızları arasında huzurla ilerliyorlardı..."
  },
  {
    title: "Kritik Alarm & Meteor Çarpışması!",
    subtitle: "Roket Motorunda Felaket Patlama",
    badge: "2. SAHNE: TEHLİKE & PATLAMA",
    badgeColor: "from-amber-500 to-red-600",
    duration: 7,
    description: "ANCAK BİRDEN! Kırmızı sirenler çalmaya başladı! Uzayın derinliklerinden gelen dev bir kozmik meteor rokete çarptı! Ana rektör alevler içinde kaldı ve şiddetli patlamalar roketi sarstı!"
  },
  {
    title: "Roket İkiye Ayrıldı & Aile Kopuşu",
    subtitle: "Kaçış Kapsülü Uzak Evrenlere Sürüklendi",
    badge: "3. SAHNE: ACINIKLI AYRILIK",
    badgeColor: "from-purple-600 to-pink-600",
    duration: 8,
    description: "Patlamanın şiddetiyle roket ortadan ikiye yarıldı! Ailesinin içinde bulunduğu acil durum kaçış kapsülü fırlayarak bilinmeyen uzak Poneix, Phelix ve Uzay Boyutlarına doğru sürüklendi! Grizzy ise kontrolsüzce yeryüzüne doğru düştü!"
  },
  {
    title: "Çakılış & Büyük Aile Arama Macerası",
    subtitle: "Grizzy Ailesini Bulmak İçin Ant İçiyor!",
    badge: "4. SAHNE: ZORLU MACERANIN BAŞLANGICI",
    badgeColor: "from-emerald-500 to-teal-600",
    duration: 9,
    description: "Grizzy, dumanı tüten bir krater halinde Ayı Köyü'ne çakıldı! Toz bulutu dağıldığında ayağa kalktı. Ailesi uzak gök kubbelerde kaybolmuştu! Onları bulmak için 14 zorlu bölgeden, zindanlardan ve uzay boyutlarından geçecek devasa bir maceraya atılıyor!"
  }
];

export const OpeningCinematicModal: React.FC<OpeningCinematicModalProps> = ({ isOpen, onClose }) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const scene = SCENES[currentSceneIndex];

  // Initialize Web Audio synth SFX for cinematic sound effects
  const playSoundEffect = (type: 'space' | 'alarm' | 'explosion' | 'fanfare') => {
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
      if (type === 'space') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(240, now + 1.2);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0, now + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.2);
      } else if (type === 'alarm') {
        for (let i = 0; i < 3; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(880, now + i * 0.25);
          osc.frequency.setValueAtTime(440, now + i * 0.25 + 0.12);
          gain.gain.setValueAtTime(0.12, now + i * 0.25);
          gain.gain.linearRampToValueAtTime(0, now + i * 0.25 + 0.22);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.25);
          osc.stop(now + i * 0.25 + 0.22);
        }
      } else if (type === 'explosion') {
        // White noise explosion burst
        const bufferSize = ctx.sampleRate * 0.8;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.2));
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.exponentialRampToValueAtTime(60, now + 0.8);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now);
      } else if (type === 'fanfare') {
        const notes = [261.63, 329.63, 392.00, 523.25];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.18);
          gain.gain.setValueAtTime(0.15, now + idx * 0.18);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.18 + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.18);
          osc.stop(now + idx * 0.18 + 0.6);
        });
      }
    } catch (e) {}
  };

  // Trigger sound effect on scene change
  useEffect(() => {
    if (!isOpen) return;
    if (currentSceneIndex === 0) playSoundEffect('space');
    else if (currentSceneIndex === 1) playSoundEffect('alarm');
    else if (currentSceneIndex === 2) playSoundEffect('explosion');
    else if (currentSceneIndex === 3) playSoundEffect('fanfare');
  }, [currentSceneIndex, isOpen]);

  // Handle scene timer progress
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const intervalTime = 50; // ms
    const totalSteps = (scene.duration * 1000) / intervalTime;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const curProgress = (step / totalSteps) * 100;
      setProgress(curProgress);

      if (step >= totalSteps) {
        if (currentSceneIndex < SCENES.length - 1) {
          setCurrentSceneIndex(prev => prev + 1);
          setProgress(0);
        } else {
          setIsPlaying(false);
        }
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, currentSceneIndex, scene.duration]);

  // Canvas 2D Animated Rendering Loop
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // Starfield particles
    const stars = Array.from({ length: 90 }, () => ({
      x: Math.random() * 800,
      y: Math.random() * 450,
      size: Math.random() * 2 + 0.8,
      speed: Math.random() * 1.5 + 0.5,
      alpha: Math.random()
    }));

    const render = () => {
      time += 0.03;
      const width = (canvas.width = canvas.parentElement?.clientWidth || 800);
      const height = (canvas.height = canvas.parentElement?.clientHeight || 450);

      // Deep space background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      if (currentSceneIndex === 1) {
        // Red flashing alert space
        const flash = Math.sin(time * 8) * 0.3 + 0.7;
        bgGrad.addColorStop(0, `rgba(${Math.floor(80 * flash)}, 10, 20, 1)`);
        bgGrad.addColorStop(1, `rgba(20, 5, 30, 1)`);
      } else if (currentSceneIndex === 2) {
        // Purple orange explosion universe
        bgGrad.addColorStop(0, '#2e1065');
        bgGrad.addColorStop(0.5, '#7c2d12');
        bgGrad.addColorStop(1, '#090d16');
      } else if (currentSceneIndex === 3) {
        // Earth atmosphere crash site
        bgGrad.addColorStop(0, '#0284c7');
        bgGrad.addColorStop(0.6, '#0f172a');
        bgGrad.addColorStop(1, '#052e16');
      } else {
        // Peaceful blue galaxy
        bgGrad.addColorStop(0, '#0b1329');
        bgGrad.addColorStop(0.5, '#1e1b4b');
        bgGrad.addColorStop(1, '#020617');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Render moving stars
      stars.forEach(star => {
        star.x -= star.speed * (currentSceneIndex === 1 ? 2.5 : 1);
        if (star.x < 0) star.x = width;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + Math.sin(time * 3 + star.x) * 0.3})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render Scene specific animated graphics
      if (currentSceneIndex === 0) {
        // SCENE 0: Rocket flying smoothly with Bear family inside
        const rocketX = width * 0.45 + Math.sin(time * 1.5) * 20;
        const rocketY = height * 0.45 + Math.cos(time * 2) * 12;

        // Thruster flame trail
        const flameGrad = ctx.createLinearGradient(rocketX - 110, rocketY, rocketX - 50, rocketY);
        flameGrad.addColorStop(0, 'transparent');
        flameGrad.addColorStop(0.5, '#f97316');
        flameGrad.addColorStop(1, '#facc15');
        ctx.fillStyle = flameGrad;
        ctx.beginPath();
        ctx.moveTo(rocketX - 45, rocketY - 15);
        ctx.lineTo(rocketX - 110 + Math.random() * 20, rocketY);
        ctx.lineTo(rocketX - 45, rocketY + 15);
        ctx.closePath();
        ctx.fill();

        // Rocket Body
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.ellipse(rocketX, rocketY, 55, 22, 0, 0, Math.PI * 2);
        ctx.fill();

        // Red nose cone
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(rocketX + 45, rocketY, 18, -Math.PI / 2, Math.PI / 2);
        ctx.fill();

        // Windows with Bear silhouettes
        ctx.fillStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#0284c7';
        
        // Window 1: Grizzy Süper Ayı
        ctx.beginPath();
        ctx.arc(rocketX + 15, rocketY - 2, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Bear head inside window
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.arc(rocketX + 15, rocketY, 6, 0, Math.PI * 2);
        ctx.fill();

        // Window 2: Anne & Baba Ayı
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(rocketX - 15, rocketY - 2, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#92400e';
        ctx.beginPath();
        ctx.arc(rocketX - 15, rocketY, 5, 0, Math.PI * 2);
        ctx.fill();

        // Text overlay on rocket
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('SUPER BEAR 1', rocketX - 25, rocketY + 32);

      } else if (currentSceneIndex === 1) {
        // SCENE 1: Meteor strike & red alarm
        const rocketX = width * 0.45;
        const rocketY = height * 0.48;

        // Meteor streaking from top right
        const meteorProgress = (time * 120) % (width + 200);
        const meteorX = width - meteorProgress + 100;
        const meteorY = (meteorProgress * 0.5) - 50;

        // Meteor fiery tail
        ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
        ctx.beginPath();
        ctx.moveTo(meteorX, meteorY);
        ctx.lineTo(meteorX + 140, meteorY - 70);
        ctx.lineTo(meteorX + 100, meteorY - 30);
        ctx.closePath();
        ctx.fill();

        // Meteor core
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(meteorX, meteorY, 22, 0, Math.PI * 2);
        ctx.fill();

        // Shaking Rocket
        const shakeX = (Math.random() - 0.5) * 12;
        const shakeY = (Math.random() - 0.5) * 12;

        ctx.fillStyle = '#dc2626';
        ctx.font = 'black 22px sans-serif';
        ctx.fillText('⚠️ WARNING! METEOR IMPACT!', width / 2 - 160, 50);

        // Rocket with fire at rear
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.ellipse(rocketX + shakeX, rocketY + shakeY, 55, 22, 0, 0, Math.PI * 2);
        ctx.fill();

        // Fire burst on rear engine
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.arc(rocketX - 35 + shakeX, rocketY + shakeY, 28, 0, Math.PI * 2);
        ctx.fill();

      } else if (currentSceneIndex === 2) {
        // SCENE 2: Explosion & Rocket breaks apart, Family pod flies away
        const cx = width * 0.5;
        const cy = height * 0.5;

        // Massive explosion fireballs
        for (let i = 0; i < 8; i++) {
          const radius = 25 + Math.sin(time * 5 + i) * 15;
          const ex = cx + Math.cos(i) * 35;
          const ey = cy + Math.sin(i) * 35;
          ctx.fillStyle = i % 2 === 0 ? '#f97316' : '#eab308';
          ctx.beginPath();
          ctx.arc(ex, ey, radius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Family Pod escaping upwards right
        const podX = cx + (time * 30) % 250;
        const podY = cy - (time * 20) % 180;

        ctx.fillStyle = '#a855f7';
        ctx.beginPath();
        ctx.arc(podX, podY, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText('👨‍👩‍👧‍👦 AİLE KAPSÜLÜ', podX - 32, podY - 26);

        // Grizzy rocket section falling downward left
        const grizzyX = cx - (time * 25) % 220;
        const grizzyY = cy + (time * 35) % 200;

        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.ellipse(grizzyX, grizzyY, 35, 18, 0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText('🐻 GRİZZY DÜŞÜYOR!', grizzyX - 35, grizzyY + 30);

      } else if (currentSceneIndex === 3) {
        // SCENE 3: Crash Site / Bear Village Crater & Grizzy rising bravely
        const groundY = height * 0.72;

        // Green grassy hill & crater
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.moveTo(0, groundY);
        ctx.quadraticCurveTo(width * 0.5, groundY + 40, width, groundY);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();

        // Smoking Crater
        ctx.fillStyle = '#27272a';
        ctx.beginPath();
        ctx.ellipse(width * 0.5, groundY + 15, 80, 25, 0, 0, Math.PI * 2);
        ctx.fill();

        // Smoke particles rising
        for (let i = 0; i < 5; i++) {
          const sy = groundY - (time * 30 + i * 25) % 120;
          const sx = width * 0.5 + Math.sin(time * 2 + i) * 20;
          ctx.fillStyle = `rgba(161, 161, 170, ${0.6 - (groundY - sy) / 150})`;
          ctx.beginPath();
          ctx.arc(sx, sy, 12 + i * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Heroic Grizzy Bear standing next to crater
        const bearX = width * 0.5;
        const bearY = groundY - 10;

        // Bear Body
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.arc(bearX, bearY - 20, 22, 0, Math.PI * 2);
        ctx.fill();

        // Bear Head
        ctx.beginPath();
        ctx.arc(bearX, bearY - 48, 16, 0, Math.PI * 2);
        ctx.fill();

        // Red Cape
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.moveTo(bearX - 12, bearY - 40);
        ctx.lineTo(bearX - 28 + Math.sin(time * 4) * 8, bearY - 10);
        ctx.lineTo(bearX - 12, bearY - 22);
        ctx.closePath();
        ctx.fill();

        // Starlight beaming to space
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(bearX, bearY - 60);
        ctx.lineTo(bearX + 80, 20);
        ctx.stroke();

        ctx.fillStyle = '#fef08a';
        ctx.font = 'black 14px sans-serif';
        ctx.fillText('✨ "AİLEMİ BULDUM VE KURTARACAĞIM!"', bearX - 110, bearY - 80);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [isOpen, currentSceneIndex]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentSceneIndex < SCENES.length - 1) {
      setCurrentSceneIndex(prev => prev + 1);
      setProgress(0);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(prev => prev - 1);
      setProgress(0);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('superbear_intro_seen', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300 pointer-events-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xl shadow-lg shadow-amber-500/20">
              🎬
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-amber-300 tracking-wide flex items-center gap-2">
                Grizzy Süper Ayı: Giriş Hikayesi Filmi
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Roket Kazası & Aileyi Kurtarma Macerası
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title={isMuted ? "Sesi Aç" : "Sesi Kapat"}
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-amber-400" />}
            </button>
            
            <button
              onClick={handleComplete}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-red-600/80 text-xs font-bold text-slate-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer border border-slate-700 hover:border-red-500"
            >
              <span>Filmi Geç</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Scene Badge & Progress Line */}
        <div className="px-5 pt-3 pb-1 bg-slate-950/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider text-white bg-gradient-to-r ${scene.badgeColor} shadow-md`}>
              {scene.badge}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {currentSceneIndex + 1} / {SCENES.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="flex-1 max-w-xs h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-75 ease-linear rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main Canvas Cinematic Animation Area */}
        <div className="relative w-full aspect-video max-h-[360px] sm:max-h-[420px] bg-slate-950 overflow-hidden flex items-center justify-center border-y border-amber-500/20">
          <canvas ref={canvasRef} className="w-full h-full object-cover" />

          {/* Scene Overlay Title Floating Banner */}
          <div className="absolute top-4 left-4 right-4 p-3 sm:p-4 rounded-2xl bg-slate-950/75 backdrop-blur-md border border-amber-500/30 shadow-xl pointer-events-none">
            <h3 className="text-sm sm:text-base font-black text-amber-300 leading-tight">
              {scene.title}
            </h3>
            <p className="text-xs font-semibold text-amber-100/80">
              {scene.subtitle}
            </p>
          </div>
        </div>

        {/* Narrative Turkish Subtitles Box */}
        <div className="p-4 sm:p-5 bg-gradient-to-b from-slate-900 to-slate-950 flex-1 flex flex-col justify-between border-t border-slate-800">
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 shadow-inner">
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              "{scene.description}"
            </p>
          </div>

          {/* Control Bar */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCurrentSceneIndex(0);
                  setProgress(0);
                  setIsPlaying(true);
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Baştan İzle</span>
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer border border-slate-700"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{isPlaying ? "Duraklat" : "Oynat"}</span>
              </button>
            </div>

            {/* Scene Stepper */}
            <div className="flex items-center gap-2">
              {currentSceneIndex > 0 && (
                <button
                  onClick={handlePrev}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition cursor-pointer border border-slate-700"
                >
                  ◀ Geri
                </button>
              )}

              {currentSceneIndex < SCENES.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer"
                >
                  Sonraki Sahne ▶
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/25 transition transform active:scale-95 animate-pulse cursor-pointer flex items-center gap-2"
                >
                  <Compass className="w-4 h-4 text-slate-950" />
                  <span>🚀 MACERAYA BAŞLA!</span>
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
