import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Gamepad2, 
  Trophy, 
  Play, 
  RotateCcw, 
  Sparkles, 
  Zap, 
  Award,
  Calendar,
  Flame,
  CheckCircle2,
  Gift
} from 'lucide-react';

interface ArcadeGamesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardEarned?: (coins: number, tokens: number) => void;
}

export type ArcadeGameId = 
  | 'honey_rush' 
  | 'bubble_jump' 
  | 'target_blaster' 
  | 'retro_runner'
  | 'space_invaders'
  | 'flappy_bear'
  | 'brick_breaker'
  | 'bear_snake'
  | 'meteor_dodge'
  | 'whack_mole';

export interface ArcadeGameMeta {
  id: ArcadeGameId;
  title: string;
  subtitle: string;
  icon: string;
  themeColor: string;
  accentBadge: string;
  description: string;
  rules: string[];
}

export const ALL_ARCADE_GAMES: ArcadeGameMeta[] = [
  {
    id: 'honey_rush',
    title: 'Bal & Altın Koşusu',
    subtitle: 'Hızlı Koşu & Engelden Kaçış',
    icon: '🍯',
    themeColor: 'from-amber-500 to-yellow-600',
    accentBadge: 'Refleks & Hız',
    description: 'Ayımızla koşarken dikenli kutulardan ve kayalardan kaçın, parıldayan altın petekleri ve bal kavanozlarını toplayarak rekor kır!',
    rules: ['Boşluk veya Tık: Zıpla', 'Bal Kavanozu: +10 Puan', 'Altın Petek: +25 Puan', 'Çarparsan oyun biter!']
  },
  {
    id: 'bubble_jump',
    title: 'Baloncuk Zıplama & Patlatma',
    subtitle: 'Gökyüzü Baloncuk Trambolini',
    icon: '🫧',
    themeColor: 'from-cyan-500 to-blue-600',
    accentBadge: 'Zamanlama & Kombo',
    description: 'Yükselen renkli su baloncuklarının üzerine basarak yukarı zıpla! Baloncukları tam zamanında patlatıp gökyüzü bulutlarına ulaş!',
    rules: ['Sol/Sağ Tuşları veya Mouse: Hareket et', 'Baloncuğa bas: Süper Zıplama', 'Gökkuşağı Balon: +50 Puan', 'Aşağı düşme!']
  },
  {
    id: 'space_invaders',
    title: 'Galaktik Ayı İstilası',
    subtitle: 'Kozmik Atari & Lazer Savaşı',
    icon: '🚀',
    themeColor: 'from-violet-600 to-fuchsia-600',
    accentBadge: 'Kozmik Savaş',
    description: 'Uzay gemini yönlendir, dalga dalga inen mutant uzay arılarını ve UFO patronlarını lazer atışlarıyla patlat!',
    rules: ['Mouse veya Sol/Sağ: Hareket', 'Boşluk veya Tık: Lazer Ateşle', 'Düşman Arı: +20 Puan', 'UFO Boss: +60 Puan']
  },
  {
    id: 'flappy_bear',
    title: 'Uçan Bal Ayısı',
    subtitle: 'Kanat Çırp & Bal Peteği Uçuşu',
    icon: '🐝',
    themeColor: 'from-yellow-500 to-amber-600',
    accentBadge: 'Beceri & Uçuş',
    description: 'Küçük peri kanatlarını çırparak bal sütunları ve bambu engelleri arasından süzül! En uzak mesafeye uç!',
    rules: ['Tık veya Boşluk: Kanat Çırp', 'Engellerin arasından geç: +10 Puan', 'Ortadaki Bal: +25 Puan', 'Zemine veya direğe çarpma!']
  },
  {
    id: 'brick_breaker',
    title: 'Bal Tuğlası Kırıcı',
    subtitle: 'Klasik Arkanoid & Enerji Topu',
    icon: '🧱',
    themeColor: 'from-pink-500 to-rose-600',
    accentBadge: 'Retro Kırıcı',
    description: 'Paleti kontrol et, enerji küresini sektirerek renkli bal peteklerini ve şeker tuğlalarını kır!',
    rules: ['Mouse veya Sol/Sağ Tuşlar: Raket', 'Kırılan Her Tuğla: +15 Puan', 'Hepsini temizle: +200 Bonus', 'Topu düşürme!']
  },
  {
    id: 'bear_snake',
    title: 'Çilek Avcısı Piksel Yılan',
    subtitle: 'Efsanevi Yılan & Meyve Ziyafeti',
    icon: '🐍',
    themeColor: 'from-emerald-500 to-teal-600',
    accentBadge: 'Nostaljik Yılan',
    description: 'Klasik atari yılanı! Çilekleri topla, uzadıkça uzayan kuyruğuna ve duvarlara çarpmadan devasa bir skora ulaş!',
    rules: ['Ok Tuşları veya WASD: Yön Değiştir', 'Kırmızı Çilek: +10 Puan & Büyüme', 'Altın Ananas: +50 Puan', 'Kuyruğuna çarpma!']
  },
  {
    id: 'meteor_dodge',
    title: 'Meteor Yağmuru Kaçış',
    subtitle: 'Ateşli Göktaşı & Hayatta Kalma',
    icon: '☄️',
    themeColor: 'from-orange-500 to-red-600',
    accentBadge: 'Hayatta Kalma',
    description: 'Gökyüzünden yağan kızgın lav meteorlarından kaç! Düşen parıldayan uzay elmaslarını kapıp hayatta kal!',
    rules: ['Mouse veya Sol/Sağ: Kaç', 'Uzay Elması: +25 Puan', 'Hayatta Kalınan Her Saniye: +3 Puan', 'Meteordan kaç!']
  },
  {
    id: 'whack_mole',
    title: 'Hırsız Arı & Köstebek Yakala',
    subtitle: 'Refleks & Hızlı Tıklama Poligonu',
    icon: '🦔',
    themeColor: 'from-lime-500 to-green-600',
    accentBadge: 'Hızlı Refleks',
    description: 'Ağaç kovuklarından ve bal küplerinden kafasını çıkaran yaramaz hırsızlara hemen tıkla, kaçmadan yakala!',
    rules: ['Çıkan Hırsıza Hızlıca Tıkla', 'Normal Hırsız: +20 Puan', 'Altın Kraliçe: +50 Puan', 'Süre: 30 Saniye']
  },
  {
    id: 'target_blaster',
    title: 'Hedef Vurma & Meşe Poligonu',
    subtitle: 'Nişan Al & Bullseye Vuruşu',
    icon: '🎯',
    themeColor: 'from-rose-500 to-red-600',
    accentBadge: 'Nişancılık & Odak',
    description: 'Ekranda beliren ve hareket eden renkli hedeflere, altın balonlara ve palamutlara tıkla! Zaman dolmadan en yüksek puanı topla!',
    rules: ['Hedefe Tıkla: Vur', 'Merkez Bullseye: +30 Puan', 'Altın Balon: +50 Puan & +3 sn', 'Süre: 30 Saniye']
  },
  {
    id: 'retro_runner',
    title: '8-Bit Piksel Parkur',
    subtitle: 'Klasik Chiptune Engel Yarışı',
    icon: '👾',
    themeColor: 'from-purple-500 to-indigo-600',
    accentBadge: 'Chiptune Klasik',
    description: 'Retro piksel grafiklerle hazırlanan nostaljik atari oyunu! Giderek hızlanan platformlarda zıpla ve en uzun mesafeye koş!',
    rules: ['Boşluk veya Tık: Zıpla', 'Çift Zıplama Destekli', 'Piksel Elmasları: +15 Puan', 'Hız sürekli artar!']
  }
];

export const ArcadeGamesModal: React.FC<ArcadeGamesModalProps> = ({
  isOpen,
  onClose,
  onRewardEarned
}) => {
  const [selectedGame, setSelectedGame] = useState<ArcadeGameId>('space_invaders');
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [activeTab, setActiveTab] = useState<'daily' | 'all' | 'rewards'>('daily');
  const [dailyClaimed, setDailyClaimed] = useState(false);

  // Daily seed calculations
  const now = new Date();
  const todayDayNumber = Math.floor((now.getTime() - new Date(2026, 0, 1).getTime()) / 86400000);
  const todayDateStr = new Intl.DateTimeFormat('tr-TR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }).format(now);

  // Today's featured Game of the Day (2x bonus rewards!)
  const featuredGameIndex = Math.abs(todayDayNumber) % ALL_ARCADE_GAMES.length;
  const featuredGame = ALL_ARCADE_GAMES[featuredGameIndex];

  // Daily 4-game rotation lineup
  const dailyRotationGames = [
    ALL_ARCADE_GAMES[featuredGameIndex],
    ALL_ARCADE_GAMES[(featuredGameIndex + 2) % ALL_ARCADE_GAMES.length],
    ALL_ARCADE_GAMES[(featuredGameIndex + 5) % ALL_ARCADE_GAMES.length],
    ALL_ARCADE_GAMES[(featuredGameIndex + 7) % ALL_ARCADE_GAMES.length]
  ];

  const [highScores, setHighScores] = useState<Record<string, number>>({});

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Audio Context helper for arcade sound effects
  const playSound = (freq = 440, type: OscillatorType = 'sine', duration = 0.1) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('super_bear_arcade_highscores');
      if (saved) setHighScores(JSON.parse(saved));

      const lastClaim = localStorage.getItem('sba_arcade_daily_claim_date');
      const todayKey = now.toISOString().slice(0, 10);
      if (lastClaim === todayKey) {
        setDailyClaimed(true);
      }
    } catch (e) {}
  }, [isOpen]);

  const claimDailyReward = () => {
    if (dailyClaimed) return;
    try {
      const todayKey = now.toISOString().slice(0, 10);
      localStorage.setItem('sba_arcade_daily_claim_date', todayKey);
      setDailyClaimed(true);

      const savedCoins = localStorage.getItem('super_bear_coins');
      const curCoins = savedCoins ? parseInt(savedCoins, 10) : 0;
      localStorage.setItem('super_bear_coins', (curCoins + 150).toString());

      const savedTokens = localStorage.getItem('super_bear_arcade_tokens');
      const curTokens = savedTokens ? parseInt(savedTokens, 10) : 0;
      localStorage.setItem('super_bear_arcade_tokens', (curTokens + 5).toString());

      window.dispatchEvent(new CustomEvent('superbear:coins-updated', { detail: { coins: curCoins + 150 } }));
      playSound(587.33, 'triangle', 0.25);
    } catch (e) {}
  };

  const recordScore = (finalScore: number) => {
    setScore(finalScore);
    setGameOver(true);
    setIsPlaying(false);

    setHighScores(prev => {
      const currentHigh = prev[selectedGame] || 0;
      if (finalScore > currentHigh) {
        const nextScores = { ...prev, [selectedGame]: finalScore };
        try {
          localStorage.setItem('super_bear_arcade_highscores', JSON.stringify(nextScores));
        } catch (e) {}
        return nextScores;
      }
      return prev;
    });

    // 2X Bonus if today's featured game!
    const isTodayFeatured = selectedGame === featuredGame.id;
    const multiplier = isTodayFeatured ? 2 : 1;
    const earnedCoins = Math.max(10, Math.floor((finalScore / 2) * multiplier));
    const earnedTokens = Math.max(2, Math.floor((finalScore / 12) * multiplier));

    try {
      const savedCoins = localStorage.getItem('super_bear_coins');
      const curCoins = savedCoins ? parseInt(savedCoins, 10) : 0;
      localStorage.setItem('super_bear_coins', (curCoins + earnedCoins).toString());

      const savedTokens = localStorage.getItem('super_bear_arcade_tokens');
      const curTokens = savedTokens ? parseInt(savedTokens, 10) : 0;
      localStorage.setItem('super_bear_arcade_tokens', (curTokens + earnedTokens).toString());

      window.dispatchEvent(new CustomEvent('superbear:coins-updated', { detail: { coins: curCoins + earnedCoins } }));
    } catch (e) {}

    if (onRewardEarned) {
      onRewardEarned(earnedCoins, earnedTokens);
    }
  };

  // MINI-GAME ENGINE DISPATCH
  useEffect(() => {
    if (!isPlaying) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 680;
    canvas.height = 380;
    const width = canvas.width;
    const height = canvas.height;

    let active = true;

    // --- 1: HONEY RUSH ---
    if (selectedGame === 'honey_rush') {
      let px = 60;
      let py = height - 60;
      let pVy = 0;
      let isGrounded = true;
      let currentScore = 0;
      let obstacles: { x: number; w: number; h: number; type: 'spike' | 'box' }[] = [];
      let items: { x: number; y: number; type: 'jar' | 'comb'; collected?: boolean }[] = [];
      let speed = 5.2;
      let frame = 0;

      const jump = () => {
        if (isGrounded) {
          pVy = -11.5;
          isGrounded = false;
          playSound(440, 'triangle', 0.1);
        }
      };

      const handleKey = (e: KeyboardEvent) => {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
          e.preventDefault();
          jump();
        }
      };
      window.addEventListener('keydown', handleKey);
      canvas.onclick = jump;

      const loop = () => {
        if (!active) return;
        frame++;
        ctx.clearRect(0, 0, width, height);

        // Ground & Sky
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#334155';
        ctx.fillRect(0, height - 30, width, 30);

        // Physics
        pVy += 0.6;
        py += pVy;
        if (py >= height - 60) {
          py = height - 60;
          pVy = 0;
          isGrounded = true;
        }

        // Spawn
        if (frame % 75 === 0) {
          obstacles.push({
            x: width + 20,
            w: 24,
            h: 28 + Math.random() * 15,
            type: Math.random() < 0.5 ? 'spike' : 'box'
          });
        }
        if (frame % 90 === 0) {
          items.push({
            x: width + 20,
            y: height - 80 - Math.random() * 70,
            type: Math.random() < 0.3 ? 'comb' : 'jar'
          });
        }

        // Draw Bear
        ctx.font = '32px sans-serif';
        ctx.fillText('🐻', px - 12, py + 24);

        // Obstacles
        for (let i = obstacles.length - 1; i >= 0; i--) {
          const obs = obstacles[i];
          obs.x -= speed;
          ctx.fillStyle = obs.type === 'spike' ? '#ef4444' : '#b45309';
          ctx.fillRect(obs.x, height - 30 - obs.h, obs.w, obs.h);

          if (obs.x < px + 22 && obs.x + obs.w > px - 5 && py + 24 > height - 30 - obs.h) {
            active = false;
            recordScore(currentScore);
            return;
          }
          if (obs.x < -40) obstacles.splice(i, 1);
        }

        // Items
        for (let i = items.length - 1; i >= 0; i--) {
          const it = items[i];
          it.x -= speed;
          ctx.font = '22px sans-serif';
          ctx.fillText(it.type === 'jar' ? '🍯' : '🐝', it.x, it.y);

          if (Math.hypot(px - it.x, py - it.y) < 32) {
            const pts = it.type === 'comb' ? 25 : 10;
            currentScore += pts;
            setScore(currentScore);
            playSound(it.type === 'comb' ? 659 : 523, 'sine', 0.1);
            items.splice(i, 1);
          }
          if (it.x < -30) items.splice(i, 1);
        }

        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`🍯 Skor: ${currentScore}`, 20, 36);

        animFrameIdRef.current = requestAnimationFrame(loop);
      };
      loop();

      return () => {
        active = false;
        window.removeEventListener('keydown', handleKey);
      };
    }

    // --- 2: BUBBLE JUMP ---
    else if (selectedGame === 'bubble_jump') {
      let bearX = width / 2;
      let bearY = height - 80;
      let bearVy = -7;
      let currentScore = 0;
      let bubbles: { x: number; y: number; r: number; color: string; isGold?: boolean }[] = [];

      for (let i = 0; i < 7; i++) {
        bubbles.push({
          x: 60 + Math.random() * (width - 120),
          y: 60 + i * 50,
          r: 28,
          color: i % 2 === 0 ? '#38bdf8' : '#a855f7',
          isGold: i === 0
        });
      }

      const handleMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        bearX = ((e.clientX - rect.left) / rect.width) * width;
      };
      canvas.addEventListener('mousemove', handleMove);

      const loop = () => {
        if (!active) return;
        ctx.clearRect(0, 0, width, height);

        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, '#0284c7');
        skyGrad.addColorStop(1, '#0f172a');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        bearVy += 0.28;
        bearY += bearVy;

        bubbles.forEach(b => {
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fillStyle = b.isGold ? 'rgba(250, 204, 21, 0.45)' : 'rgba(56, 189, 248, 0.35)';
          ctx.fill();
          ctx.strokeStyle = b.isGold ? '#facc15' : '#7dd3fc';
          ctx.lineWidth = 3;
          ctx.stroke();

          if (bearVy > 0 && Math.hypot(bearX - b.x, bearY - b.y) < b.r + 14) {
            bearVy = -9.5;
            const pts = b.isGold ? 30 : 10;
            currentScore += pts;
            setScore(currentScore);
            playSound(520, 'sine', 0.1);

            b.y = Math.random() * 30 - 20;
            b.x = 40 + Math.random() * (width - 80);
            b.isGold = Math.random() < 0.25;
          }
        });

        if (bearY < 120) {
          const diff = 120 - bearY;
          bearY = 120;
          bubbles.forEach(b => {
            b.y += diff;
            if (b.y > height + 20) {
              b.y = -20;
              b.x = 40 + Math.random() * (width - 80);
            }
          });
        }

        ctx.font = '36px sans-serif';
        ctx.fillText('🐻', bearX - 18, bearY);

        if (bearY > height + 30) {
          active = false;
          recordScore(currentScore);
          return;
        }

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`🫧 Baloncuk Skoru: ${currentScore}`, 20, 36);

        animFrameIdRef.current = requestAnimationFrame(loop);
      };
      loop();

      return () => {
        active = false;
        canvas.removeEventListener('mousemove', handleMove);
      };
    }

    // --- 3: SPACE INVADERS (GALAGA STYLE) ---
    else if (selectedGame === 'space_invaders') {
      let playerX = width / 2;
      let playerVx = 0;
      let bullets: { x: number; y: number }[] = [];
      let enemies: { x: number; y: number; alive: boolean; isUfo?: boolean }[] = [];
      let enemyVx = 1.4;
      let currentScore = 0;
      let fireCooldown = 0;

      // Spawn fleet
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 7; c++) {
          enemies.push({
            x: 90 + c * 75,
            y: 50 + r * 45,
            alive: true,
            isUfo: r === 0 && c === 3
          });
        }
      }

      const handleMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        playerX = ((e.clientX - rect.left) / rect.width) * width;
      };
      const shoot = () => {
        if (fireCooldown <= 0) {
          bullets.push({ x: playerX, y: height - 55 });
          fireCooldown = 12;
          playSound(650, 'sawtooth', 0.08);
        }
      };

      canvas.addEventListener('mousemove', handleMove);
      canvas.addEventListener('click', shoot);
      const handleKey = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
          e.preventDefault();
          shoot();
        }
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') playerVx = -5;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') playerVx = 5;
      };
      const handleKeyUp = (e: KeyboardEvent) => {
        if (['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD'].includes(e.code)) playerVx = 0;
      };
      window.addEventListener('keydown', handleKey);
      window.addEventListener('keyup', handleKeyUp);

      const loop = () => {
        if (!active) return;
        ctx.clearRect(0, 0, width, height);
        if (fireCooldown > 0) fireCooldown--;

        playerX += playerVx;
        playerX = Math.max(30, Math.min(width - 30, playerX));

        // Space background
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, width, height);

        // Move Enemies
        let hitEdge = false;
        enemies.forEach(e => {
          if (e.alive) {
            e.x += enemyVx;
            if (e.x < 30 || e.x > width - 30) hitEdge = true;
          }
        });
        if (hitEdge) {
          enemyVx *= -1.05;
          enemies.forEach(e => {
            if (e.alive) e.y += 18;
          });
        }

        // Bullets
        ctx.fillStyle = '#38bdf8';
        for (let i = bullets.length - 1; i >= 0; i--) {
          const b = bullets[i];
          b.y -= 7.5;
          ctx.fillRect(b.x - 2, b.y - 8, 4, 16);

          // Hit enemies
          for (const e of enemies) {
            if (e.alive && Math.hypot(b.x - e.x, b.y - e.y) < 22) {
              e.alive = false;
              bullets.splice(i, 1);
              const pts = e.isUfo ? 60 : 20;
              currentScore += pts;
              setScore(currentScore);
              playSound(e.isUfo ? 880 : 350, 'triangle', 0.12);
              break;
            }
          }
          if (b.y < -20) bullets.splice(i, 1);
        }

        // Draw enemies
        let livingCount = 0;
        enemies.forEach(e => {
          if (e.alive) {
            livingCount++;
            ctx.font = '26px sans-serif';
            ctx.fillText(e.isUfo ? '🛸' : '👾', e.x - 13, e.y + 10);

            // Reached bottom?
            if (e.y >= height - 70) {
              active = false;
              recordScore(currentScore);
              return;
            }
          }
        });

        // Respawn wave if all dead
        if (livingCount === 0) {
          currentScore += 100;
          setScore(currentScore);
          enemies.forEach((e, idx) => {
            e.alive = true;
            e.y = 50 + Math.floor(idx / 7) * 45;
          });
          enemyVx = 1.6;
        }

        // Draw player spaceship
        ctx.font = '34px sans-serif';
        ctx.fillText('🚀', playerX - 17, height - 35);

        ctx.fillStyle = '#a855f7';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`🚀 Galaksi Skoru: ${currentScore}`, 20, 36);

        animFrameIdRef.current = requestAnimationFrame(loop);
      };
      loop();

      return () => {
        active = false;
        canvas.removeEventListener('mousemove', handleMove);
        canvas.removeEventListener('click', shoot);
        window.removeEventListener('keydown', handleKey);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }

    // --- 4: FLAPPY BEAR ---
    else if (selectedGame === 'flappy_bear') {
      let bearY = height / 2;
      let bearVy = 0;
      let currentScore = 0;
      let pipes: { x: number; topH: number; bottomY: number; passed?: boolean }[] = [];
      let frame = 0;

      const flap = () => {
        bearVy = -6.5;
        playSound(480, 'sine', 0.08);
      };
      canvas.onclick = flap;
      const handleKey = (e: KeyboardEvent) => {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
          e.preventDefault();
          flap();
        }
      };
      window.addEventListener('keydown', handleKey);

      const loop = () => {
        if (!active) return;
        frame++;
        ctx.clearRect(0, 0, width, height);

        // Sky & Honey Pillars
        ctx.fillStyle = '#065f46';
        ctx.fillRect(0, 0, width, height);

        bearVy += 0.32;
        bearY += bearVy;

        if (frame % 85 === 0) {
          const gap = 110;
          const topH = 40 + Math.random() * (height - gap - 90);
          pipes.push({
            x: width + 20,
            topH,
            bottomY: topH + gap
          });
        }

        // Draw pipes
        for (let i = pipes.length - 1; i >= 0; i--) {
          const p = pipes[i];
          p.x -= 3.2;

          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(p.x, 0, 48, p.topH);
          ctx.fillRect(p.x, p.bottomY, 48, height - p.bottomY);

          // Collision
          const bearX = 100;
          if (bearX + 14 > p.x && bearX - 14 < p.x + 48) {
            if (bearY - 12 < p.topH || bearY + 12 > p.bottomY) {
              active = false;
              recordScore(currentScore);
              return;
            }
          }

          if (!p.passed && p.x + 48 < bearX) {
            p.passed = true;
            currentScore += 10;
            setScore(currentScore);
            playSound(600, 'triangle', 0.1);
          }

          if (p.x < -60) pipes.splice(i, 1);
        }

        // Bear with wings
        ctx.font = '32px sans-serif';
        ctx.fillText('🐻', 85, bearY + 10);

        if (bearY > height + 20 || bearY < -20) {
          active = false;
          recordScore(currentScore);
          return;
        }

        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`🐝 Flappy Skoru: ${currentScore}`, 20, 36);

        animFrameIdRef.current = requestAnimationFrame(loop);
      };
      loop();

      return () => {
        active = false;
        window.removeEventListener('keydown', handleKey);
      };
    }

    // --- 5: BRICK BREAKER ---
    else if (selectedGame === 'brick_breaker') {
      let paddleX = width / 2 - 45;
      let paddleW = 90;
      let ballX = width / 2;
      let ballY = height - 70;
      let ballVx = 3.5 * (Math.random() < 0.5 ? 1 : -1);
      let ballVy = -4.0;
      let currentScore = 0;

      let bricks: { x: number; y: number; w: number; h: number; color: string; alive: boolean }[] = [];
      const colors = ['#f43f5e', '#ec4899', '#a855f7', '#3b82f6'];
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 9; c++) {
          bricks.push({
            x: 35 + c * 68,
            y: 50 + r * 28,
            w: 60,
            h: 20,
            color: colors[r],
            alive: true
          });
        }
      }

      const handleMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const mx = ((e.clientX - rect.left) / rect.width) * width;
        paddleX = Math.max(0, Math.min(width - paddleW, mx - paddleW / 2));
      };
      canvas.addEventListener('mousemove', handleMove);

      const loop = () => {
        if (!active) return;
        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(0, 0, width, height);

        ballX += ballVx;
        ballY += ballVy;

        // Bounce walls
        if (ballX < 10 || ballX > width - 10) {
          ballVx *= -1;
          playSound(300, 'sine', 0.05);
        }
        if (ballY < 10) {
          ballVy *= -1;
          playSound(300, 'sine', 0.05);
        }

        // Paddle hit
        if (ballY + 8 >= height - 35 && ballY - 8 <= height - 20) {
          if (ballX >= paddleX && ballX <= paddleX + paddleW) {
            ballVy = -Math.abs(ballVy);
            const hitRatio = (ballX - (paddleX + paddleW / 2)) / (paddleW / 2);
            ballVx = hitRatio * 5.0;
            playSound(520, 'triangle', 0.08);
          }
        }

        // Bricks hit
        let remaining = 0;
        bricks.forEach(b => {
          if (b.alive) {
            remaining++;
            ctx.fillStyle = b.color;
            ctx.fillRect(b.x, b.y, b.w, b.h);

            if (ballX > b.x && ballX < b.x + b.w && ballY > b.y && ballY < b.y + b.h) {
              b.alive = false;
              ballVy *= -1;
              currentScore += 15;
              setScore(currentScore);
              playSound(660, 'sine', 0.08);
            }
          }
        });

        // Clear bonus
        if (remaining === 0) {
          currentScore += 200;
          setScore(currentScore);
          active = false;
          recordScore(currentScore);
          return;
        }

        // Fell down
        if (ballY > height + 20) {
          active = false;
          recordScore(currentScore);
          return;
        }

        // Draw Paddle
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(paddleX, height - 35, paddleW, 14);

        // Draw Ball
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ec4899';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`🧱 Tuğla Skoru: ${currentScore}`, 20, 36);

        animFrameIdRef.current = requestAnimationFrame(loop);
      };
      loop();

      return () => {
        active = false;
        canvas.removeEventListener('mousemove', handleMove);
      };
    }

    // --- 6: BEAR SNAKE ---
    else if (selectedGame === 'bear_snake') {
      const gridSize = 20;
      let snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
      let dir = { x: 1, y: 0 };
      let food = { x: 15, y: 10, isGold: false };
      let currentScore = 0;
      let frame = 0;

      const spawnFood = () => {
        food = {
          x: Math.floor(Math.random() * (width / gridSize - 2)) + 1,
          y: Math.floor(Math.random() * (height / gridSize - 2)) + 1,
          isGold: Math.random() < 0.25
        };
      };

      const handleKey = (e: KeyboardEvent) => {
        if ((e.code === 'ArrowUp' || e.code === 'KeyW') && dir.y === 0) {
          e.preventDefault(); dir = { x: 0, y: -1 };
        } else if ((e.code === 'ArrowDown' || e.code === 'KeyS') && dir.y === 0) {
          e.preventDefault(); dir = { x: 0, y: 1 };
        } else if ((e.code === 'ArrowLeft' || e.code === 'KeyA') && dir.x === 0) {
          e.preventDefault(); dir = { x: -1, y: 0 };
        } else if ((e.code === 'ArrowRight' || e.code === 'KeyD') && dir.x === 0) {
          e.preventDefault(); dir = { x: 1, y: 0 };
        }
      };
      window.addEventListener('keydown', handleKey);

      const loop = () => {
        if (!active) return;
        frame++;

        // Update every 8 frames
        if (frame % 8 === 0) {
          const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

          // Wall collision
          if (head.x < 0 || head.x >= width / gridSize || head.y < 0 || head.y >= height / gridSize) {
            active = false;
            recordScore(currentScore);
            return;
          }

          // Self collision
          for (const s of snake) {
            if (s.x === head.x && s.y === head.y) {
              active = false;
              recordScore(currentScore);
              return;
            }
          }

          snake.unshift(head);

          // Eat food
          if (head.x === food.x && head.y === food.y) {
            const pts = food.isGold ? 50 : 10;
            currentScore += pts;
            setScore(currentScore);
            playSound(food.isGold ? 780 : 520, 'triangle', 0.1);
            spawnFood();
          } else {
            snake.pop();
          }
        }

        // Draw
        ctx.fillStyle = '#064e3b';
        ctx.fillRect(0, 0, width, height);

        // Draw food
        ctx.font = '20px sans-serif';
        ctx.fillText(food.isGold ? '🍍' : '🍓', food.x * gridSize, (food.y + 1) * gridSize - 2);

        // Draw snake
        snake.forEach((s, idx) => {
          if (idx === 0) {
            ctx.fillText('🐻', s.x * gridSize, (s.y + 1) * gridSize - 2);
          } else {
            ctx.fillStyle = '#10b981';
            ctx.fillRect(s.x * gridSize + 2, s.y * gridSize + 2, gridSize - 4, gridSize - 4);
          }
        });

        ctx.fillStyle = '#a7f3d0';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`🐍 Yılan Skoru: ${currentScore}`, 20, 36);

        animFrameIdRef.current = requestAnimationFrame(loop);
      };
      loop();

      return () => {
        active = false;
        window.removeEventListener('keydown', handleKey);
      };
    }

    // --- 7: METEOR DODGE ---
    else if (selectedGame === 'meteor_dodge') {
      let playerX = width / 2;
      let meteors: { x: number; y: number; r: number; vy: number }[] = [];
      let stars: { x: number; y: number; vy: number }[] = [];
      let currentScore = 0;
      let frame = 0;

      const handleMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        playerX = ((e.clientX - rect.left) / rect.width) * width;
      };
      canvas.addEventListener('mousemove', handleMove);

      const loop = () => {
        if (!active) return;
        frame++;
        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = '#2d0606';
        ctx.fillRect(0, 0, width, height);

        if (frame % 30 === 0) {
          meteors.push({
            x: 20 + Math.random() * (width - 40),
            y: -20,
            r: 16 + Math.random() * 12,
            vy: 4.0 + Math.random() * 3.5
          });
        }
        if (frame % 60 === 0) {
          stars.push({
            x: 20 + Math.random() * (width - 40),
            y: -20,
            vy: 2.8
          });
        }

        // Draw stars
        for (let i = stars.length - 1; i >= 0; i--) {
          const st = stars[i];
          st.y += st.vy;
          ctx.font = '24px sans-serif';
          ctx.fillText('⭐', st.x - 12, st.y);

          if (Math.hypot(playerX - st.x, height - 40 - st.y) < 30) {
            currentScore += 25;
            setScore(currentScore);
            playSound(680, 'sine', 0.1);
            stars.splice(i, 1);
          }
          if (st.y > height + 20) stars.splice(i, 1);
        }

        // Draw meteors
        for (let i = meteors.length - 1; i >= 0; i--) {
          const m = meteors[i];
          m.y += m.vy;
          ctx.font = '28px sans-serif';
          ctx.fillText('☄️', m.x - 14, m.y);

          if (Math.hypot(playerX - m.x, height - 40 - m.y) < m.r + 14) {
            active = false;
            recordScore(currentScore);
            return;
          }
          if (m.y > height + 20) {
            currentScore += 5;
            setScore(currentScore);
            meteors.splice(i, 1);
          }
        }

        // Player Bear
        ctx.font = '34px sans-serif';
        ctx.fillText('🐻', playerX - 17, height - 25);

        ctx.fillStyle = '#f87171';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`☄️ Kaçış Skoru: ${currentScore}`, 20, 36);

        animFrameIdRef.current = requestAnimationFrame(loop);
      };
      loop();

      return () => {
        active = false;
        canvas.removeEventListener('mousemove', handleMove);
      };
    }

    // --- 8: WHACK A MOLE / THIEF ---
    else if (selectedGame === 'whack_mole') {
      let currentScore = 0;
      let timeLeft = 30;
      let holes: { x: number; y: number; hasMole: boolean; isQueen: boolean; moleTimer: number }[] = [];

      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          holes.push({
            x: 160 + c * 180,
            y: 90 + r * 100,
            hasMole: false,
            isQueen: false,
            moleTimer: 0
          });
        }
      }

      const timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          active = false;
          recordScore(currentScore);
        }
      }, 1000);

      const handleClick = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const mx = ((e.clientX - rect.left) / rect.width) * width;
        const my = ((e.clientY - rect.top) / rect.height) * height;

        holes.forEach(h => {
          if (h.hasMole && Math.hypot(mx - h.x, my - (h.y - 10)) < 45) {
            const pts = h.isQueen ? 50 : 20;
            currentScore += pts;
            setScore(currentScore);
            playSound(h.isQueen ? 800 : 450, 'triangle', 0.12);
            h.hasMole = false;
          }
        });
      };
      canvas.addEventListener('click', handleClick);

      let frame = 0;
      const loop = () => {
        if (!active) return;
        frame++;
        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = '#14532d';
        ctx.fillRect(0, 0, width, height);

        // Random popup
        if (frame % 45 === 0) {
          const emptyHoles = holes.filter(h => !h.hasMole);
          if (emptyHoles.length > 0) {
            const chosen = emptyHoles[Math.floor(Math.random() * emptyHoles.length)];
            chosen.hasMole = true;
            chosen.isQueen = Math.random() < 0.25;
            chosen.moleTimer = 65;
          }
        }

        // Draw holes
        holes.forEach(h => {
          ctx.beginPath();
          ctx.ellipse(h.x, h.y + 15, 45, 18, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#052e16';
          ctx.fill();

          if (h.hasMole) {
            h.moleTimer--;
            if (h.moleTimer <= 0) h.hasMole = false;
            ctx.font = '42px sans-serif';
            ctx.fillText(h.isQueen ? '👑🐝' : '🦝', h.x - 22, h.y + 10);
          }
        });

        ctx.fillStyle = '#4ade80';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`🦝 Yakalama: ${currentScore}`, 20, 36);
        ctx.fillStyle = timeLeft < 7 ? '#ef4444' : '#facc15';
        ctx.fillText(`⏱️ Kalan Süre: ${timeLeft}s`, width - 190, 36);

        animFrameIdRef.current = requestAnimationFrame(loop);
      };
      loop();

      return () => {
        active = false;
        clearInterval(timerInterval);
        canvas.removeEventListener('click', handleClick);
      };
    }

    // --- 9: TARGET BLASTER ---
    else if (selectedGame === 'target_blaster') {
      let currentScore = 0;
      let timeLeft = 30;
      let targets: { x: number; y: number; r: number; vx: number; isGold?: boolean }[] = [];

      const spawnTarget = () => {
        targets.push({
          x: Math.random() < 0.5 ? -20 : width + 20,
          y: 70 + Math.random() * (height - 140),
          r: 22 + Math.random() * 12,
          vx: (Math.random() * 2.5 + 1.5) * (Math.random() < 0.5 ? 1 : -1),
          isGold: Math.random() < 0.25
        });
      };
      for (let i = 0; i < 4; i++) spawnTarget();

      const timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          active = false;
          recordScore(currentScore);
        }
      }, 1000);

      const handleClick = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const mx = ((e.clientX - rect.left) / rect.width) * width;
        const my = ((e.clientY - rect.top) / rect.height) * height;

        for (let i = targets.length - 1; i >= 0; i--) {
          const t = targets[i];
          if (Math.hypot(mx - t.x, my - t.y) < t.r) {
            const pts = t.isGold ? 40 : 15;
            currentScore += pts;
            setScore(currentScore);
            playSound(t.isGold ? 784 : 523, 'triangle', 0.12);
            targets.splice(i, 1);
            spawnTarget();
            break;
          }
        }
      };
      canvas.addEventListener('click', handleClick);

      const loop = () => {
        if (!active) return;
        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = '#450a0a';
        ctx.fillRect(0, 0, width, height);

        targets.forEach(t => {
          t.x += t.vx;
          if (t.x < -30 || t.x > width + 30) t.vx *= -1;

          ctx.beginPath();
          ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
          ctx.fillStyle = t.isGold ? '#eab308' : '#dc2626';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(t.x, t.y, t.r * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        });

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`🎯 Skor: ${currentScore}`, 20, 36);
        ctx.fillStyle = timeLeft < 8 ? '#ef4444' : '#fde047';
        ctx.fillText(`⏱️ Kalan Süre: ${timeLeft}s`, width - 190, 36);

        animFrameIdRef.current = requestAnimationFrame(loop);
      };
      loop();

      return () => {
        active = false;
        clearInterval(timerInterval);
        canvas.removeEventListener('click', handleClick);
      };
    }

    // --- 10: RETRO RUNNER ---
    else {
      let px = 50;
      let py = height - 60;
      let pVy = 0;
      let isGrounded = true;
      let currentScore = 0;
      let obstacles: { x: number; w: number; h: number }[] = [];
      let speed = 5.2;
      let frame = 0;

      const jump = () => {
        if (isGrounded) {
          pVy = -11.0;
          isGrounded = false;
          playSound(330, 'sawtooth', 0.1);
        }
      };
      const handleKey = (e: KeyboardEvent) => {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
          e.preventDefault();
          jump();
        }
      };
      window.addEventListener('keydown', handleKey);
      canvas.onclick = jump;

      const loop = () => {
        if (!active) return;
        frame++;
        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, height - 30);
        ctx.lineTo(width, height - 30);
        ctx.stroke();

        pVy += 0.58;
        py += pVy;
        if (py >= height - 60) {
          py = height - 60;
          pVy = 0;
          isGrounded = true;
        }

        if (frame % 60 === 0) {
          obstacles.push({ x: width + 10, w: 20, h: 32 });
          currentScore += 5;
          setScore(currentScore);
        }

        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(px, py, 26, 30);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(px + 14, py + 6, 6, 6);

        for (let i = obstacles.length - 1; i >= 0; i--) {
          const obs = obstacles[i];
          obs.x -= speed;
          ctx.fillStyle = '#ec4899';
          ctx.fillRect(obs.x, height - 30 - obs.h, obs.w, obs.h);

          if (obs.x < px + 26 && obs.x + obs.w > px && py + 30 > height - 30 - obs.h) {
            active = false;
            recordScore(currentScore);
            return;
          }
          if (obs.x < -30) obstacles.splice(i, 1);
        }

        ctx.fillStyle = '#e879f9';
        ctx.font = 'bold 20px monospace';
        ctx.fillText(`👾 PIXEL SCORE: ${currentScore}`, 20, 36);

        animFrameIdRef.current = requestAnimationFrame(loop);
      };
      loop();

      return () => {
        active = false;
        window.removeEventListener('keydown', handleKey);
      };
    }

  }, [isPlaying, selectedGame]);

  if (!isOpen) return null;

  const currentMeta = ALL_ARCADE_GAMES.find(g => g.id === selectedGame) || ALL_ARCADE_GAMES[0];
  const isSelectedGameDaily = selectedGame === featuredGame.id;

  const displayGames = activeTab === 'daily' 
    ? dailyRotationGames 
    : ALL_ARCADE_GAMES;

  return (
    <div className="fixed inset-0 z-[125] flex items-center justify-center p-2.5 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-5xl bg-slate-900/95 border-2 border-purple-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100">
        
        {/* Header with Daily Rotation Badge */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-800 via-indigo-700 to-purple-900 text-white flex flex-wrap items-center justify-between gap-3 border-b-2 border-purple-400/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-950 border-2 border-purple-300 flex items-center justify-center text-2xl shadow-xl animate-pulse">
              🕹️
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-black tracking-wider text-white">
                  SUPER BEAR RETRO ARCADE SALONU
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs border border-amber-300 shadow">
                  10 FARKLI OYUN 🔥
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-purple-200 mt-0.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-amber-300" />
                <span>{todayDateStr}</span>
                <span className="text-purple-400">•</span>
                <span className="text-amber-300 font-bold">Günün Oyunu: {featuredGame.title} (2X ÖDÜL!)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!dailyClaimed && (
              <button
                onClick={claimDailyReward}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <Gift className="w-4 h-4 animate-bounce" />
                <span>Günün Hediyesini Al! (+150 🍯)</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-slate-950/40 hover:bg-slate-950/60 text-white flex items-center justify-center transition active:scale-90 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="px-4 py-2.5 bg-slate-950/70 border-b border-purple-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-4 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'daily'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 border border-purple-400'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Günün Yeni Oyunları (Rotasyon)</span>
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 border border-purple-400'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5 text-cyan-300" />
              <span>Tüm 10 Atari Oyunu</span>
            </button>
          </div>

          <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5 hidden sm:flex">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>Her Gün Yepyeni Oyunlar & 2X Çifte Kazanç!</span>
          </div>
        </div>

        {/* Content Body */}
        {/* Content Body */}
        <div className="p-3 sm:p-5 overflow-y-auto space-y-4 flex-1 overscroll-contain">
          
          {/* Game Selection Grid (Collapsed when actively playing to maximize mobile play area) */}
          {!isPlaying ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-2 sm:gap-2.5">
              {displayGames.map(g => {
                const isSel = selectedGame === g.id;
                const hs = highScores[g.id] || 0;
                const isFeatured = g.id === featuredGame.id;

                return (
                  <button
                    key={g.id}
                    disabled={isPlaying}
                    onClick={() => {
                      setSelectedGame(g.id);
                      setGameOver(false);
                      setScore(0);
                    }}
                    className={`p-2.5 sm:p-3 rounded-2xl border-2 text-left transition transform duration-150 flex flex-col justify-between relative overflow-hidden ${
                      isSel
                        ? 'border-purple-400 bg-purple-950/60 shadow-lg shadow-purple-500/20 scale-[1.02]'
                        : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/50 opacity-85 hover:opacity-100 cursor-pointer'
                    } ${isPlaying ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    {isFeatured && (
                      <span className="absolute top-0 right-0 px-2 py-0.5 bg-gradient-to-l from-amber-400 to-yellow-500 text-slate-950 font-black text-[9px] rounded-bl-lg shadow">
                        ⭐ GÜNÜN OYUNU
                      </span>
                    )}

                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-2xl">{g.icon}</span>
                      <span className="text-[9px] font-bold text-purple-300 px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-800/50">
                        {g.accentBadge}
                      </span>
                    </div>

                    <h4 className="font-black text-sm text-white leading-tight">{g.title}</h4>
                    
                    <div className="mt-2 flex items-center justify-between text-[11px] font-bold">
                      <div className="text-amber-300 flex items-center gap-1">
                        <Trophy className="w-3 h-3 text-amber-400" />
                        <span>{hs}</span>
                      </div>
                      {isFeatured && (
                        <span className="text-[10px] text-amber-400 font-black">2X 🍯</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-between p-2.5 sm:p-3 bg-purple-950/70 border border-purple-500/40 rounded-2xl shrink-0 animate-in fade-in duration-150">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl sm:text-3xl">{currentMeta.icon}</span>
                <div>
                  <div className="font-black text-sm sm:text-base text-white flex items-center gap-2">
                    <span>{currentMeta.title}</span>
                    {isSelectedGameDaily && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px]">
                        2X
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-amber-300 font-bold">
                    Canlı Skor: {score} Puan
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setGameOver(false);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-200 border border-purple-400/40 text-xs font-bold transition active:scale-95 cursor-pointer"
              >
                ◀ Oyun Değiştir
              </button>
            </div>
          )}

          {/* Game Screen Canvas or Intro Box */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-purple-500/40 bg-slate-950 flex items-center justify-center min-h-[260px] sm:min-h-[380px]">
            {isPlaying ? (
              <canvas
                ref={canvasRef}
                className="w-full h-[260px] sm:h-[380px] max-w-[680px] cursor-pointer touch-none"
              />
            ) : (
              <div className="p-8 text-center max-w-lg space-y-4 animate-in zoom-in-95 duration-200">
                <div className="text-6xl animate-bounce">{currentMeta.icon}</div>
                <div>
                  <div className="flex items-center justify-center gap-2">
                    <h3 className="text-2xl font-black text-white">{currentMeta.title}</h3>
                    {isSelectedGameDaily && (
                      <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-black rounded-lg text-xs">
                        🌟 2X GÜNÜN OYUNU
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-purple-300 mt-1 font-semibold">{currentMeta.subtitle}</p>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {currentMeta.description}
                </p>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1 text-left inline-block w-full">
                  <div className="font-black text-purple-300 mb-1 flex items-center gap-1.5">
                    <Gamepad2 className="w-4 h-4" />
                    <span>Nasıl Oynanır?</span>
                  </div>
                  {currentMeta.rules.map((rule, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-purple-400">•</span>
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>

                {gameOver && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 font-black text-sm flex items-center justify-center gap-3">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span>Oyun Bitti! Skorun: {score} Puan!</span>
                    <span className="text-emerald-400 text-xs">
                      {isSelectedGameDaily ? '(2X Çifte Ödül Hesabına Eklendi!)' : '(Ödüller Hesabına Eklendi!)'}
                    </span>
                  </div>
                )}

                <div>
                  <button
                    onClick={() => {
                      setIsPlaying(true);
                      setGameOver(false);
                      setScore(0);
                    }}
                    className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 hover:from-purple-400 hover:to-indigo-400 text-white font-black text-base shadow-xl flex items-center gap-2 mx-auto transition transform active:scale-95 cursor-pointer"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span>{gameOver ? 'Tekrar Oyna' : 'Oyunu Başlat'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">🎁 Günlük Atari Ödül Sistemi:</span>
            <span>Her gün atari salonunu ziyaret et, günün 2X oyununu oyna ve bolca Altın ile Atari Jetonu topla!</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition cursor-pointer border border-slate-700"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
