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
  Gift,
  Maximize,
  Minimize,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  requestImmersiveFullscreen, 
  toggleImmersiveFullscreen, 
  isFullscreenActive 
} from '../utils/fullscreenHelper';

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

export const ARCADE_TRANSLATIONS: Record<string, {
  headerTitle: string;
  gameCount: string;
  gameOfTheDay: string;
  claimDailyGift: string;
  tabDaily: string;
  tabAll: string;
  tabSubtitle: string;
  liveScore: string;
  changeGame: string;
  howToPlay: string;
  gameOver: string;
  highScore: string;
  points: string;
  playBtn: string;
  playAgainBtn: string;
  bonusAdded: string;
  footerTitle: string;
  footerDesc: string;
  closeBtn: string;
  fullscreenBtn: string;
  swipeOrDpad: string;
  tapToStart: string;
  jumpBtn: string;
  shootBtn: string;
  games: Record<ArcadeGameId, {
    title: string;
    subtitle: string;
    badge: string;
    description: string;
    rules: string[];
  }>;
}> = {
  tr: {
    headerTitle: 'SUPER BEAR RETRO ARCADE SALONU',
    gameCount: '10 FARKLI OYUN 🔥',
    gameOfTheDay: 'Günün Oyunu',
    claimDailyGift: 'Günün Hediyesini Al! (+150 🍯)',
    tabDaily: 'Günün Yeni Oyunları (Rotasyon)',
    tabAll: 'Tüm 10 Atari Oyunu',
    tabSubtitle: 'Her Gün Yepyeni Oyunlar & 2X Çifte Kazanç!',
    liveScore: 'Canlı Skor',
    changeGame: '◀ Oyunlar',
    howToPlay: 'Nasıl Oynanır?',
    gameOver: 'Oyun Bitti!',
    highScore: 'En Yüksek Skor',
    points: 'Puan',
    playBtn: 'Oyunu Başlat',
    playAgainBtn: 'Tekrar Oyna',
    bonusAdded: '2X Çifte Ödül Hesabına Eklendi!',
    footerTitle: '🎁 Günlük Atari Ödül Sistemi:',
    footerDesc: 'Her gün atari salonunu ziyaret et, günün 2X oyununu oyna ve bolca Altın ile Atari Jetonu topla!',
    closeBtn: 'Kapat',
    fullscreenBtn: 'Tam Ekran',
    swipeOrDpad: '🕹️ Ekranda Kaydır veya D-Pad Tuşlarını Kullan!',
    tapToStart: 'Başlamak İçin Ekrana veya Tuşa Dokun!',
    jumpBtn: 'ZIPLA',
    shootBtn: 'ATEŞ',
    games: {
      honey_rush: {
        title: 'Bal & Altın Koşusu',
        subtitle: 'Hızlı Koşu & Engelden Kaçış',
        badge: 'Refleks & Hız',
        description: 'Ayımızla koşarken dikenli kutulardan ve kayalardan kaçın, parıldayan altın petekleri ve bal kavanozlarını toplayarak rekor kır!',
        rules: ['Boşluk, Tık veya ZIPLA Tuşu: Zıpla', 'Bal Kavanozu: +10 Puan', 'Altın Petek: +25 Puan', 'Çarparsan oyun biter!']
      },
      bubble_jump: {
        title: 'Baloncuk Zıplama & Patlatma',
        subtitle: 'Gökyüzü Baloncuk Trambolini',
        badge: 'Zamanlama & Kombo',
        description: 'Yükselen renkli su baloncuklarının üzerine basarak yukarı zıpla! Baloncukları tam zamanında patlatıp gökyüzü bulutlarına ulaş!',
        rules: ['Ekranda Kaydır veya Sol/Sağ: Hareket et', 'Baloncuğa bas: Süper Zıplama', 'Gökkuşağı Balon: +50 Puan', 'Aşağı düşme!']
      },
      space_invaders: {
        title: 'Galaktik Ayı İstilası',
        subtitle: 'Kozmik Atari & Lazer Savaşı',
        badge: 'Kozmik Savaş',
        description: 'Uzay gemini yönlendir, dalga dalga inen mutant uzay arılarını ve UFO patronlarını lazer atışlarıyla patlat!',
        rules: ['Ekranda Kaydır veya Sol/Sağ: Hareket', 'ATEŞ Tuşu, Boşluk veya Tık: Ateş Et', 'Düşman Arı: +20 Puan', 'UFO Boss: +60 Puan']
      },
      flappy_bear: {
        title: 'Uçan Bal Ayısı',
        subtitle: 'Kanat Çırp & Bal Peteği Uçuşu',
        badge: 'Beceri & Uçuş',
        description: 'Küçük peri kanatlarını çırparak bal sütunları ve bambu engelleri arasından süzül! En uzak mesafeye uç!',
        rules: ['Tık, Boşluk veya KANAT Tuşu: Kanat Çırp', 'Engellerin arasından geç: +10 Puan', 'Ortadaki Bal: +25 Puan', 'Zemine veya direğe çarpma!']
      },
      brick_breaker: {
        title: 'Bal Tuğlası Kırıcı',
        subtitle: 'Klasik Arkanoid & Enerji Topu',
        badge: 'Retro Kırıcı',
        description: 'Paleti kontrol et, enerji küresini sektirerek renkli bal peteklerini ve şeker tuğlalarını kır!',
        rules: ['Ekranda Kaydır veya Sol/Sağ: Raket', 'Kırılan Her Tuğla: +15 Puan', 'Hepsini temizle: +200 Bonus', 'Topu düşürme!']
      },
      bear_snake: {
        title: 'Çilek Avcısı Piksel Yılan',
        subtitle: 'Efsanevi Yılan & Meyve Ziyafeti',
        badge: 'Nostaljik Yılan',
        description: 'Klasik atari yılanı! D-Pad tuşları veya ekranda parmağını kaydırarak yön ver, çilekleri topla ve duvarlara çarpmadan rekora koş!',
        rules: ['D-Pad Tuşları veya Ekranda Kaydır: Yön Ver', 'Kırmızı Çilek: +10 Puan & Büyüme', 'Altın Ananas: +50 Puan', 'Kuyruğuna veya duvara çarpma!']
      },
      meteor_dodge: {
        title: 'Meteor Yağmuru Kaçış',
        subtitle: 'Ateşli Göktaşı & Hayatta Kalma',
        badge: 'Hayatta Kalma',
        description: 'Gökyüzünden yağan kızgın lav meteorlarından kaç! Düşen parıldayan uzay elmaslarını kapıp hayatta kal!',
        rules: ['Ekranda Kaydır veya Sol/Sağ: Kaç', 'Uzay Elması: +25 Puan', 'Hayatta Kalınan Her Saniye: +3 Puan', 'Meteordan kaç!']
      },
      whack_mole: {
        title: 'Hırsız Arı & Köstebek Yakala',
        subtitle: 'Refleks & Hızlı Tıklama Poligonu',
        badge: 'Hızlı Refleks',
        description: 'Ağaç kovuklarından ve bal küplerinden kafasını çıkaran yaramaz hırsızlara hemen dokun, kaçmadan yakala!',
        rules: ['Çıkan Hırsıza Hızlıca Dokun', 'Normal Hırsız: +20 Puan', 'Altın Kraliçe: +50 Puan', 'Süre: 30 Saniye']
      },
      target_blaster: {
        title: 'Hedef Vurma & Meşe Poligonu',
        subtitle: 'Nişan Al & Bullseye Vuruşu',
        badge: 'Nişancılık & Odak',
        description: 'Ekranda beliren ve hareket eden renkli hedeflere, altın balonlara ve palamutlara dokun! Zaman dolmadan en yüksek puanı topla!',
        rules: ['Hedefe Dokun: Vur', 'Merkez Bullseye: +30 Puan', 'Altın Balon: +50 Puan & +3 sn', 'Süre: 30 Saniye']
      },
      retro_runner: {
        title: '8-Bit Piksel Parkur',
        subtitle: 'Cyberpunk Neon Zıplama',
        badge: 'Retro Koşucu',
        description: 'Neon ışıklı retro şehirde pikselleri topla, tehlikeli lazer engellerinin üzerinden tam zamanında zıpla!',
        rules: ['ZIPLA Tuşu, Boşluk veya Dokun: Zıpla', 'Geçilen Engel: +5 Puan', 'Lazer bloklarına çarpma!']
      }
    }
  },
  en: {
    headerTitle: 'SUPER BEAR RETRO ARCADE ZONE',
    gameCount: '10 ARCADE GAMES 🔥',
    gameOfTheDay: 'Game of the Day',
    claimDailyGift: 'Claim Daily Gift! (+150 🍯)',
    tabDaily: "Today's Games (Daily Rotation)",
    tabAll: 'All 10 Arcade Games',
    tabSubtitle: 'New Games Daily & 2X Double Rewards!',
    liveScore: 'Live Score',
    changeGame: '◀ Games',
    howToPlay: 'How to Play?',
    gameOver: 'Game Over!',
    highScore: 'High Score',
    points: 'Points',
    playBtn: 'Start Game',
    playAgainBtn: 'Play Again',
    bonusAdded: '2X Double Bonus Credited!',
    footerTitle: '🎁 Daily Arcade Rewards:',
    footerDesc: 'Visit daily, play the 2X featured game, and earn bonus Gold & Tokens!',
    closeBtn: 'Close',
    fullscreenBtn: 'Fullscreen',
    swipeOrDpad: '🕹️ Swipe on screen or use on-screen D-Pad!',
    tapToStart: 'Tap screen or press any control to start!',
    jumpBtn: 'JUMP',
    shootBtn: 'FIRE',
    games: {
      honey_rush: {
        title: 'Honey & Gold Rush',
        subtitle: 'Fast Endless Runner',
        badge: 'Speed & Reflex',
        description: 'Dodge spiked crates and stones while gathering honey jars and golden combs!',
        rules: ['Space, Tap or JUMP Button: Jump', 'Honey Jar: +10 pts', 'Golden Honeycomb: +25 pts', 'Avoid obstacles!']
      },
      bubble_jump: {
        title: 'Bubble Jump & Pop',
        subtitle: 'Sky Bubble Trampoline',
        badge: 'Timing & Combo',
        description: 'Bounce higher on floating bubbles and pop them to reach the clouds!',
        rules: ['Swipe or Left/Right: Move', 'Bounce on bubble: High Jump', 'Rainbow Bubble: +50 pts', "Don't fall down!"]
      },
      space_invaders: {
        title: 'Galactic Bear Invaders',
        subtitle: 'Cosmic 80s Space Shooter',
        badge: 'Space Battle',
        description: 'Pilot your ship and shoot down alien bee waves and boss UFOs!',
        rules: ['Swipe or Left/Right: Move', 'FIRE button or Tap: Shoot', 'Alien Bee: +20 pts', 'UFO Boss: +60 pts']
      },
      flappy_bear: {
        title: 'Flappy Honey Bear',
        subtitle: 'Wing Flap & Honey Pillars',
        badge: 'Skill Flight',
        description: 'Flap wings to navigate between sweet honey obstacles without crashing!',
        rules: ['Tap, Space or FLAP Button: Flap', 'Pass column: +10 pts', 'Collect Honey: +25 pts', "Don't crash!"]
      },
      brick_breaker: {
        title: 'Honeycomb Brick Breaker',
        subtitle: 'Classic Arkanoid & Energy Ball',
        badge: 'Retro Breaker',
        description: 'Glide the paddle to bounce the energy orb and smash all honey bricks!',
        rules: ['Swipe or Left/Right: Paddle', 'Brick hit: +15 pts', 'Clear all: +200 pts bonus', "Don't drop the ball!"]
      },
      bear_snake: {
        title: 'Berry Hunter Pixel Snake',
        subtitle: 'Classic Snake & Fruit Feast',
        badge: 'Retro Snake',
        description: 'Classic arcade snake! Steer using the on-screen D-Pad or swipe on screen to grab delicious fruits!',
        rules: ['D-Pad Buttons or Swipe: Turn', 'Red Strawberry: +10 pts & Growth', 'Golden Pineapple: +50 pts', "Don't hit walls or tail!"]
      },
      meteor_dodge: {
        title: 'Meteor Shower Dodge',
        subtitle: 'Fiery Asteroids & Survival',
        badge: 'Survival',
        description: 'Dodge falling fireballs and collect falling cosmic star gems!',
        rules: ['Swipe or Left/Right: Dodge', 'Cosmic Star: +25 pts', 'Survival per second: +3 pts', 'Dodge meteorites!']
      },
      whack_mole: {
        title: 'Thief Raccoon & Bee Whack',
        subtitle: 'Reflex & Fast Tapping',
        badge: 'Fast Reflex',
        description: 'Tap pesky thieves popping out of honey jars before they escape!',
        rules: ['Tap thief quickly', 'Standard Thief: +20 pts', 'Queen Bee: +50 pts', 'Time limit: 30s']
      },
      target_blaster: {
        title: 'Target Blaster Range',
        subtitle: 'Precision Aim & Hit',
        badge: 'Shooting Range',
        description: 'Tap moving targets, balloons and acorns before time expires!',
        rules: ['Tap target: Hit', 'Bullseye Center: +30 pts', 'Golden Balloon: +50 pts', 'Time limit: 30s']
      },
      retro_runner: {
        title: '8-Bit Pixel Parkour',
        subtitle: 'Cyberpunk Neon Runner',
        badge: 'Retro Runner',
        description: 'Leap over neon laser fences and dash through pixel streets!',
        rules: ['JUMP button or Tap: Jump', 'Clear obstacle: +5 pts', 'Avoid laser beams!']
      }
    }
  }
};

export const getLocalizedArcadeGames = (lang: string): ArcadeGameMeta[] => {
  const dictionary = ARCADE_TRANSLATIONS[lang] || ARCADE_TRANSLATIONS.tr;
  const defaults: { id: ArcadeGameId; icon: string; themeColor: string; accentBadge: string }[] = [
    { id: 'honey_rush', icon: '🍯', themeColor: '#f59e0b', accentBadge: 'Hız' },
    { id: 'bubble_jump', icon: '🫧', themeColor: '#38bdf8', accentBadge: 'Kombo' },
    { id: 'space_invaders', icon: '🚀', themeColor: '#8b5cf6', accentBadge: 'Kozmik' },
    { id: 'flappy_bear', icon: '🐝', themeColor: '#10b981', accentBadge: 'Uçuş' },
    { id: 'brick_breaker', icon: '🧱', themeColor: '#ec4899', accentBadge: 'Retro' },
    { id: 'bear_snake', icon: '🐍', themeColor: '#14b8a6', accentBadge: 'Yılan' },
    { id: 'meteor_dodge', icon: '☄️', themeColor: '#ef4444', accentBadge: 'Kaçış' },
    { id: 'whack_mole', icon: '🦝', themeColor: '#84cc16', accentBadge: 'Refleks' },
    { id: 'target_blaster', icon: '🎯', themeColor: '#f97316', accentBadge: 'Nişan' },
    { id: 'retro_runner', icon: '👾', themeColor: '#06b6d4', accentBadge: 'Parkur' }
  ];

  return defaults.map(def => {
    const localized = dictionary.games[def.id];
    return {
      id: def.id,
      title: localized?.title || def.id,
      subtitle: localized?.subtitle || '',
      icon: def.icon,
      themeColor: def.themeColor,
      accentBadge: localized?.badge || def.accentBadge,
      description: localized?.description || '',
      rules: localized?.rules || []
    };
  });
};

interface GameControls {
  onDpad?: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onDpadRelease?: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onAction?: (action: 'jump' | 'shoot' | 'special') => void;
  onTouchMove?: (normX: number, normY: number, clientX: number, clientY: number) => void;
  onTouchTap?: (normX: number, normY: number, clientX: number, clientY: number) => void;
  onSwipe?: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

export const ArcadeGamesModal: React.FC<ArcadeGamesModalProps> = ({
  isOpen,
  onClose,
  onRewardEarned
}) => {
  const { language } = useLanguage();
  const [selectedGame, setSelectedGame] = useState<ArcadeGameId>('bear_snake');
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [activeTab, setActiveTab] = useState<'daily' | 'all'>('daily');
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(isFullscreenActive());

  const t = ARCADE_TRANSLATIONS[language] || ARCADE_TRANSLATIONS.tr;
  const allLocalizedGames = getLocalizedArcadeGames(language);

  // Daily seed calculations
  const now = new Date();
  const todayDayNumber = Math.floor((now.getTime() - new Date(2026, 0, 1).getTime()) / 86400000);
  const dateLocaleMap: Record<string, string> = {
    tr: 'tr-TR',
    en: 'en-US',
    es: 'es-ES',
    de: 'de-DE',
    it: 'it-IT'
  };
  const todayDateStr = new Intl.DateTimeFormat(dateLocaleMap[language] || 'tr-TR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }).format(now);

  const featuredGameIndex = Math.abs(todayDayNumber) % allLocalizedGames.length;
  const featuredGame = allLocalizedGames[featuredGameIndex];

  const dailyRotationGames = [
    allLocalizedGames[featuredGameIndex],
    allLocalizedGames[(featuredGameIndex + 2) % allLocalizedGames.length],
    allLocalizedGames[(featuredGameIndex + 5) % allLocalizedGames.length],
    allLocalizedGames[(featuredGameIndex + 7) % allLocalizedGames.length]
  ];

  const [highScores, setHighScores] = useState<Record<string, number>>({});

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const gameControlsRef = useRef<GameControls>({});
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Track Fullscreen state
  useEffect(() => {
    const handleFs = () => setIsFullscreen(isFullscreenActive());
    window.addEventListener('superbear:fullscreen-change', handleFs);
    document.addEventListener('fullscreenchange', handleFs);
    return () => {
      window.removeEventListener('superbear:fullscreen-change', handleFs);
      document.removeEventListener('fullscreenchange', handleFs);
    };
  }, []);

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

  // Request fullscreen when opening arcade or starting game
  const handleStartGame = () => {
    requestImmersiveFullscreen();
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
  };

  const claimDailyReward = () => {
    if (dailyClaimed) return;
    try {
      const todayKey = now.toISOString().slice(0, 10);
      localStorage.setItem('sba_arcade_daily_claim_date', todayKey);
      setDailyClaimed(true);

      const savedCoins = localStorage.getItem('super_bear_coins');
      const curCoins = savedCoins ? parseInt(savedCoins, 10) : 0;
      const nextCoins = curCoins + 150;
      localStorage.setItem('super_bear_coins', nextCoins.toString());

      const savedTokens = localStorage.getItem('super_bear_arcade_tokens');
      const curTokens = savedTokens ? parseInt(savedTokens, 10) : 0;
      localStorage.setItem('super_bear_arcade_tokens', (curTokens + 5).toString());

      if (typeof window !== 'undefined' && (window as any).__superBearSaveManager) {
        (window as any).__superBearSaveManager.updateGold(nextCoins);
      }
      window.dispatchEvent(new CustomEvent('superbear:coins-updated', { detail: { coins: nextCoins } }));
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

    const isTodayFeatured = selectedGame === featuredGame.id;
    const multiplier = isTodayFeatured ? 2 : 1;
    const earnedCoins = Math.max(10, Math.floor((finalScore / 2) * multiplier));
    const earnedTokens = Math.max(2, Math.floor((finalScore / 12) * multiplier));

    try {
      const savedCoins = localStorage.getItem('super_bear_coins');
      const curCoins = savedCoins ? parseInt(savedCoins, 10) : 0;
      const nextCoins = curCoins + earnedCoins;
      localStorage.setItem('super_bear_coins', nextCoins.toString());

      const savedTokens = localStorage.getItem('super_bear_arcade_tokens');
      const curTokens = savedTokens ? parseInt(savedTokens, 10) : 0;
      localStorage.setItem('super_bear_arcade_tokens', (curTokens + earnedTokens).toString());

      if (typeof window !== 'undefined' && (window as any).__superBearSaveManager) {
        (window as any).__superBearSaveManager.updateGold(nextCoins);
      }
      window.dispatchEvent(new CustomEvent('superbear:coins-updated', { detail: { coins: nextCoins } }));
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

      gameControlsRef.current = {
        onAction: () => jump(),
        onDpad: (dir) => { if (dir === 'up') jump(); },
        onTouchTap: () => jump()
      };

      const handleKey = (e: KeyboardEvent) => {
        if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
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

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#334155';
        ctx.fillRect(0, height - 30, width, 30);

        pVy += 0.6;
        py += pVy;
        if (py >= height - 60) {
          py = height - 60;
          pVy = 0;
          isGrounded = true;
        }

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

        ctx.font = '32px sans-serif';
        ctx.fillText('🐻', px - 12, py + 24);

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

      const setBearNormX = (normX: number) => {
        bearX = Math.max(25, Math.min(width - 25, normX * width));
      };

      gameControlsRef.current = {
        onDpad: (dir) => {
          if (dir === 'left') bearX = Math.max(25, bearX - 40);
          if (dir === 'right') bearX = Math.min(width - 25, bearX + 40);
        },
        onTouchMove: (normX) => setBearNormX(normX),
        onTouchTap: (normX) => setBearNormX(normX)
      };

      const handleMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        setBearNormX((e.clientX - rect.left) / rect.width);
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

    // --- 3: SPACE INVADERS ---
    else if (selectedGame === 'space_invaders') {
      let playerX = width / 2;
      let playerVx = 0;
      let bullets: { x: number; y: number }[] = [];
      let enemies: { x: number; y: number; alive: boolean; isUfo?: boolean }[] = [];
      let enemyVx = 1.4;
      let currentScore = 0;
      let fireCooldown = 0;

      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 7; c++) {
          enemies.push({
            x: 70 + c * 75,
            y: 50 + r * 42,
            alive: true,
            isUfo: r === 0 && c === 3
          });
        }
      }

      const shoot = () => {
        if (fireCooldown <= 0) {
          bullets.push({ x: playerX, y: height - 45 });
          fireCooldown = 12;
          playSound(640, 'square', 0.08);
        }
      };

      gameControlsRef.current = {
        onDpad: (dir) => {
          if (dir === 'left') playerVx = -7;
          if (dir === 'right') playerVx = 7;
        },
        onDpadRelease: () => {
          playerVx = 0;
        },
        onAction: (act) => {
          if (act === 'shoot') shoot();
        },
        onTouchMove: (normX) => {
          playerX = Math.max(30, Math.min(width - 30, normX * width));
        },
        onTouchTap: (normX) => {
          playerX = Math.max(30, Math.min(width - 30, normX * width));
          shoot();
        }
      };

      const handleMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        playerX = Math.max(30, Math.min(width - 30, ((e.clientX - rect.left) / rect.width) * width));
      };
      const handleKey = (e: KeyboardEvent) => {
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') playerVx = -7;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') playerVx = 7;
        if (e.code === 'Space' || e.code === 'ArrowUp') {
          e.preventDefault();
          shoot();
        }
      };
      const handleKeyUp = (e: KeyboardEvent) => {
        if (['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD'].includes(e.code)) {
          playerVx = 0;
        }
      };

      canvas.addEventListener('mousemove', handleMove);
      canvas.addEventListener('click', shoot);
      window.addEventListener('keydown', handleKey);
      window.addEventListener('keyup', handleKeyUp);

      const loop = () => {
        if (!active) return;
        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = '#09090b';
        ctx.fillRect(0, 0, width, height);

        playerX = Math.max(30, Math.min(width - 30, playerX + playerVx));
        if (fireCooldown > 0) fireCooldown--;

        for (let i = bullets.length - 1; i >= 0; i--) {
          const b = bullets[i];
          b.y -= 8.5;
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(b.x - 2.5, b.y, 5, 12);

          for (const enemy of enemies) {
            if (enemy.alive && Math.hypot(b.x - enemy.x, b.y - enemy.y) < 24) {
              enemy.alive = false;
              bullets.splice(i, 1);
              const pts = enemy.isUfo ? 60 : 20;
              currentScore += pts;
              setScore(currentScore);
              playSound(enemy.isUfo ? 880 : 350, 'sawtooth', 0.12);
              break;
            }
          }
          if (b && b.y < -10) bullets.splice(i, 1);
        }

        let changeDir = false;
        let anyAlive = false;
        enemies.forEach(e => {
          if (!e.alive) return;
          anyAlive = true;
          e.x += enemyVx;
          if (e.x < 35 || e.x > width - 35) changeDir = true;

          ctx.font = '28px sans-serif';
          ctx.fillText(e.isUfo ? '🛸' : '🐝', e.x - 14, e.y + 10);

          if (e.y > height - 60) {
            active = false;
            recordScore(currentScore);
            return;
          }
        });

        if (!anyAlive) {
          currentScore += 150;
          setScore(currentScore);
          active = false;
          recordScore(currentScore);
          return;
        }

        if (changeDir) {
          enemyVx = -enemyVx * 1.05;
          enemies.forEach(e => { e.y += 14; });
        }

        ctx.font = '34px sans-serif';
        ctx.fillText('🚀', playerX - 17, height - 20);

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
      let hasStarted = false;

      const flap = () => {
        hasStarted = true;
        bearVy = -6.5;
        playSound(480, 'sine', 0.08);
      };

      gameControlsRef.current = {
        onAction: () => flap(),
        onDpad: () => flap(),
        onTouchTap: () => flap()
      };

      canvas.onclick = flap;
      const handleKey = (e: KeyboardEvent) => {
        if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
          e.preventDefault();
          flap();
        }
      };
      window.addEventListener('keydown', handleKey);

      const loop = () => {
        if (!active) return;
        frame++;
        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = '#065f46';
        ctx.fillRect(0, 0, width, height);

        if (!hasStarted) {
          bearY = height / 2 + Math.sin(frame * 0.08) * 8;
        } else {
          bearVy += 0.32;
          bearY += bearVy;

          if (frame % 85 === 0) {
            const gap = 115;
            const topH = 40 + Math.random() * (height - gap - 90);
            pipes.push({
              x: width + 20,
              topH,
              bottomY: topH + gap
            });
          }
        }

        for (let i = pipes.length - 1; i >= 0; i--) {
          const p = pipes[i];
          p.x -= 3.2;

          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(p.x, 0, 48, p.topH);
          ctx.fillRect(p.x, p.bottomY, 48, height - p.bottomY);

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

        ctx.font = '32px sans-serif';
        ctx.fillText('🐻', 85, bearY + 10);

        if (hasStarted && (bearY > height + 20 || bearY < -20)) {
          active = false;
          recordScore(currentScore);
          return;
        }

        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`🐝 Flappy Skoru: ${currentScore}`, 20, 36);

        if (!hasStarted) {
          ctx.fillStyle = '#fde047';
          ctx.font = 'bold 18px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🪽 Uçmak için ZIPLA Tuşuna veya Ekrana Dokun!', width / 2, height / 2 + 60);
          ctx.textAlign = 'left';
        }

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
      let paddleW = 90;
      let paddleX = width / 2 - paddleW / 2;
      let ballX = width / 2;
      let ballY = height - 70;
      let ballVx = 3.5 * (Math.random() < 0.5 ? 1 : -1);
      let ballVy = -4.0;
      let currentScore = 0;
      let ballLaunched = false;

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

      const setPaddleNormX = (normX: number) => {
        paddleX = Math.max(0, Math.min(width - paddleW, normX * width - paddleW / 2));
      };

      gameControlsRef.current = {
        onDpad: (dir) => {
          ballLaunched = true;
          if (dir === 'left') paddleX = Math.max(0, paddleX - 45);
          if (dir === 'right') paddleX = Math.min(width - paddleW, paddleX + 45);
        },
        onTouchMove: (normX) => setPaddleNormX(normX),
        onTouchTap: (normX) => {
          ballLaunched = true;
          setPaddleNormX(normX);
        },
        onAction: () => { ballLaunched = true; }
      };

      const handleMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        setPaddleNormX((e.clientX - rect.left) / rect.width);
      };
      canvas.addEventListener('mousemove', handleMove);
      canvas.addEventListener('click', () => { ballLaunched = true; });

      const loop = () => {
        if (!active) return;
        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(0, 0, width, height);

        if (!ballLaunched) {
          ballX = paddleX + paddleW / 2;
          ballY = height - 55;
        } else {
          ballX += ballVx;
          ballY += ballVy;

          if (ballX < 10 || ballX > width - 10) {
            ballVx *= -1;
            playSound(300, 'sine', 0.05);
          }
          if (ballY < 10) {
            ballVy *= -1;
            playSound(300, 'sine', 0.05);
          }

          if (ballY + 8 >= height - 35 && ballY - 8 <= height - 20) {
            if (ballX >= paddleX && ballX <= paddleX + paddleW) {
              ballVy = -Math.abs(ballVy);
              const hitRatio = (ballX - (paddleX + paddleW / 2)) / (paddleW / 2);
              ballVx = hitRatio * 5.0;
              playSound(520, 'triangle', 0.08);
            }
          }

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

          if (remaining === 0) {
            currentScore += 200;
            setScore(currentScore);
            active = false;
            recordScore(currentScore);
            return;
          }

          if (ballY > height + 20) {
            active = false;
            recordScore(currentScore);
            return;
          }
        }

        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(paddleX, height - 35, paddleW, 14);

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ec4899';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`🧱 Tuğla Skoru: ${currentScore}`, 20, 36);

        if (!ballLaunched) {
          ctx.fillStyle = '#fde047';
          ctx.font = 'bold 18px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🕹️ Topu Fırlatmak İçin Ekrana Dokun!', width / 2, height / 2);
          ctx.textAlign = 'left';
        }

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
      let food = { x: 16, y: 10, isGold: false };
      let currentScore = 0;
      let frame = 0;
      let hasStarted = false;

      const spawnFood = () => {
        food = {
          x: Math.floor(Math.random() * (width / gridSize - 2)) + 1,
          y: Math.floor(Math.random() * (height / gridSize - 2)) + 1,
          isGold: Math.random() < 0.25
        };
      };

      const setSnakeDirection = (newDir: { x: number; y: number }) => {
        hasStarted = true;
        if (newDir.x !== 0 && dir.x === 0) {
          dir = newDir;
          playSound(480, 'triangle', 0.05);
        } else if (newDir.y !== 0 && dir.y === 0) {
          dir = newDir;
          playSound(440, 'triangle', 0.05);
        } else if (!hasStarted) {
          dir = newDir;
          playSound(480, 'triangle', 0.05);
        }
      };

      gameControlsRef.current = {
        onDpad: (dirName) => {
          if (dirName === 'up') setSnakeDirection({ x: 0, y: -1 });
          else if (dirName === 'down') setSnakeDirection({ x: 0, y: 1 });
          else if (dirName === 'left') setSnakeDirection({ x: -1, y: 0 });
          else if (dirName === 'right') setSnakeDirection({ x: 1, y: 0 });
        },
        onSwipe: (dirName) => {
          if (dirName === 'up') setSnakeDirection({ x: 0, y: -1 });
          else if (dirName === 'down') setSnakeDirection({ x: 0, y: 1 });
          else if (dirName === 'left') setSnakeDirection({ x: -1, y: 0 });
          else if (dirName === 'right') setSnakeDirection({ x: 1, y: 0 });
        },
        onTouchTap: (normX, normY) => {
          if (normY < 0.35) setSnakeDirection({ x: 0, y: -1 });
          else if (normY > 0.65) setSnakeDirection({ x: 0, y: 1 });
          else if (normX < 0.5) setSnakeDirection({ x: -1, y: 0 });
          else setSnakeDirection({ x: 1, y: 0 });
        }
      };

      const handleKey = (e: KeyboardEvent) => {
        if ((e.code === 'ArrowUp' || e.code === 'KeyW')) {
          e.preventDefault(); setSnakeDirection({ x: 0, y: -1 });
        } else if ((e.code === 'ArrowDown' || e.code === 'KeyS')) {
          e.preventDefault(); setSnakeDirection({ x: 0, y: 1 });
        } else if ((e.code === 'ArrowLeft' || e.code === 'KeyA')) {
          e.preventDefault(); setSnakeDirection({ x: -1, y: 0 });
        } else if ((e.code === 'ArrowRight' || e.code === 'KeyD')) {
          e.preventDefault(); setSnakeDirection({ x: 1, y: 0 });
        }
      };
      window.addEventListener('keydown', handleKey);

      const loop = () => {
        if (!active) return;
        frame++;

        // Only advance snake once started
        if (hasStarted && frame % 8 === 0) {
          const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

          if (head.x < 0 || head.x >= width / gridSize || head.y < 0 || head.y >= height / gridSize) {
            active = false;
            recordScore(currentScore);
            return;
          }

          for (const s of snake) {
            if (s.x === head.x && s.y === head.y) {
              active = false;
              recordScore(currentScore);
              return;
            }
          }

          snake.unshift(head);

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

        if (!hasStarted) {
          ctx.fillStyle = '#fde047';
          ctx.font = 'bold 18px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🕹️ Başlamak İçin D-Pad Tuşuna Bas veya Ekranda Kaydır!', width / 2, height / 2);
          ctx.textAlign = 'left';
        }

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

      const setPlayerNormX = (normX: number) => {
        playerX = Math.max(25, Math.min(width - 25, normX * width));
      };

      gameControlsRef.current = {
        onDpad: (dir) => {
          if (dir === 'left') playerX = Math.max(25, playerX - 40);
          if (dir === 'right') playerX = Math.min(width - 25, playerX + 40);
        },
        onTouchMove: (normX) => setPlayerNormX(normX),
        onTouchTap: (normX) => setPlayerNormX(normX)
      };

      const handleMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        setPlayerNormX((e.clientX - rect.left) / rect.width);
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

    // --- 8: WHACK A MOLE ---
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

      const hitAt = (mx: number, my: number) => {
        holes.forEach(h => {
          if (h.hasMole && Math.hypot(mx - h.x, my - (h.y - 10)) < 48) {
            const pts = h.isQueen ? 50 : 20;
            currentScore += pts;
            setScore(currentScore);
            playSound(h.isQueen ? 800 : 450, 'triangle', 0.12);
            h.hasMole = false;
          }
        });
      };

      gameControlsRef.current = {
        onTouchTap: (normX, normY) => hitAt(normX * width, normY * height)
      };

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
        hitAt(((e.clientX - rect.left) / rect.width) * width, ((e.clientY - rect.top) / rect.height) * height);
      };
      canvas.addEventListener('click', handleClick);

      let frame = 0;
      const loop = () => {
        if (!active) return;
        frame++;
        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = '#14532d';
        ctx.fillRect(0, 0, width, height);

        if (frame % 45 === 0) {
          const emptyHoles = holes.filter(h => !h.hasMole);
          if (emptyHoles.length > 0) {
            const chosen = emptyHoles[Math.floor(Math.random() * emptyHoles.length)];
            chosen.hasMole = true;
            chosen.isQueen = Math.random() < 0.25;
            chosen.moleTimer = 65;
          }
        }

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

      const shootAt = (mx: number, my: number) => {
        for (let i = targets.length - 1; i >= 0; i--) {
          const t = targets[i];
          if (Math.hypot(mx - t.x, my - t.y) < t.r + 10) {
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

      gameControlsRef.current = {
        onTouchTap: (normX, normY) => shootAt(normX * width, normY * height)
      };

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
        shootAt(((e.clientX - rect.left) / rect.width) * width, ((e.clientY - rect.top) / rect.height) * height);
      };
      canvas.addEventListener('click', handleClick);

      const loop = () => {
        if (!active) return;
        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = '#450a0a';
        ctx.fillRect(0, 0, width, height);

        targets.forEach(t => {
          t.x += t.vx;
          if (t.vx > 0 && t.x > width + 30) t.x = -30;
          if (t.vx < 0 && t.x < -30) t.x = width + 30;

          ctx.beginPath();
          ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
          ctx.fillStyle = t.isGold ? '#eab308' : '#ef4444';
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.strokeStyle = '#ffffff';
          ctx.stroke();

          ctx.font = `${Math.floor(t.r * 1.1)}px sans-serif`;
          ctx.fillText(t.isGold ? '⭐' : '🎯', t.x - t.r * 0.55, t.y + t.r * 0.4);
        });

        ctx.fillStyle = '#f87171';
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

      gameControlsRef.current = {
        onAction: () => jump(),
        onDpad: (dir) => { if (dir === 'up') jump(); },
        onTouchTap: () => jump()
      };

      const handleKey = (e: KeyboardEvent) => {
        if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
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

  // Touch & Swipe handlers on the game viewport
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const normX = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
        const normY = Math.max(0, Math.min(1, (touch.clientY - rect.top) / rect.height));
        gameControlsRef.current.onTouchMove?.(normX, normY, touch.clientX, touch.clientY);
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && touchStartRef.current) {
      const touch = e.touches[0];
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const normX = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
        const normY = Math.max(0, Math.min(1, (touch.clientY - rect.top) / rect.height));
        gameControlsRef.current.onTouchMove?.(normX, normY, touch.clientX, touch.clientY);
      }

      // Check for swipe gesture
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
        if (Math.abs(dx) > Math.abs(dy)) {
          gameControlsRef.current.onSwipe?.(dx > 0 ? 'right' : 'left');
        } else {
          gameControlsRef.current.onSwipe?.(dy > 0 ? 'down' : 'up');
        }
        // reset anchor for continuous gestures
        touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current) {
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      const dt = Date.now() - touchStartRef.current.time;

      if (dt < 350 && Math.abs(dx) < 20 && Math.abs(dy) < 20) {
        // Quick Tap
        const canvas = canvasRef.current;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          const normX = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
          const normY = Math.max(0, Math.min(1, (touch.clientY - rect.top) / rect.height));
          gameControlsRef.current.onTouchTap?.(normX, normY, touch.clientX, touch.clientY);
        }
      } else if (Math.abs(dx) >= 20 || Math.abs(dy) >= 20) {
        if (Math.abs(dx) > Math.abs(dy)) {
          gameControlsRef.current.onSwipe?.(dx > 0 ? 'right' : 'left');
        } else {
          gameControlsRef.current.onSwipe?.(dy > 0 ? 'down' : 'up');
        }
      }
      touchStartRef.current = null;
    }
  };

  if (!isOpen) return null;

  const currentMeta = allLocalizedGames.find(g => g.id === selectedGame) || allLocalizedGames[0];
  const isSelectedGameDaily = selectedGame === featuredGame.id;

  const displayGames = activeTab === 'daily' 
    ? dailyRotationGames 
    : allLocalizedGames;

  // 1. GAMEPLAY SCREEN: DEDICATED IMMERSIVE RETRO ARCADE VIEW
  if (isPlaying) {
    return (
      <div 
        className="fixed inset-0 z-[150] w-screen h-screen bg-black flex flex-col justify-between select-none overflow-hidden touch-none"
        style={{
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          paddingLeft: 'env(safe-area-inset-left, 0px)',
          paddingRight: 'env(safe-area-inset-right, 0px)'
        }}
      >
        {/* Floating Minimal Top HUD Bar */}
        <div className="h-11 sm:h-12 px-3 sm:px-5 bg-slate-900/95 border-b border-purple-500/40 flex items-center justify-between shrink-0 shadow-xl backdrop-blur-md z-30">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsPlaying(false);
                setGameOver(false);
              }}
              className="px-2.5 py-1 rounded-xl bg-purple-950/90 hover:bg-purple-900 text-purple-200 border border-purple-400/50 text-xs font-black flex items-center gap-1 transition active:scale-95 cursor-pointer shadow"
            >
              <span>{t.changeGame}</span>
            </button>
            <span className="text-xl sm:text-2xl">{currentMeta.icon}</span>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xs sm:text-sm text-white">{currentMeta.title}</span>
              {isSelectedGameDaily && (
                <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-black text-[10px]">
                  2X
                </span>
              )}
            </div>
          </div>

          {/* Center Scores */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="px-3 py-0.5 rounded-full bg-slate-950 border border-amber-400/60 flex items-center gap-1.5 shadow">
              <span className="text-[11px] text-purple-300 font-bold">{t.liveScore}:</span>
              <span className="text-sm sm:text-base font-black text-amber-300">{score}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-xs text-amber-400 font-bold">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>{highScores[selectedGame] || 0}</span>
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setIsPlaying(false);
                setTimeout(() => {
                  setGameOver(false);
                  setScore(0);
                  setIsPlaying(true);
                }, 50);
              }}
              title={t.playAgainBtn}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-bold transition active:scale-95 cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-4 h-4 text-purple-300" />
              <span className="hidden md:inline">{t.playAgainBtn}</span>
            </button>
            <button
              onClick={() => toggleImmersiveFullscreen()}
              title={isFullscreen ? 'Pencere Modu' : 'Tam Ekran Modu'}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-600 hover:to-indigo-700 text-amber-300 border border-purple-400/60 text-xs font-bold transition active:scale-95 cursor-pointer flex items-center gap-1"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              <span className="hidden md:inline">{t.fullscreenBtn}</span>
            </button>
          </div>
        </div>

        {/* Center Game Viewport */}
        <div 
          className="relative flex-1 w-full flex items-center justify-center bg-black overflow-hidden touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full max-h-full max-w-full aspect-[680/380] object-contain cursor-crosshair border border-purple-900/30"
          />

          {/* ON-SCREEN VIRTUAL TOUCH CONTROLLER OVERLAYS */}
          {/* A. 4-WAY D-PAD FOR BEAR SNAKE */}
          {selectedGame === 'bear_snake' && (
            <>
              {/* Retro Arcade D-Pad on bottom-left */}
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-6 z-20 flex flex-col items-center gap-1.5 pointer-events-auto select-none">
                <button
                  onPointerDown={(e) => { e.preventDefault(); gameControlsRef.current.onDpad?.('up'); }}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-purple-950/85 active:bg-purple-600 border-2 border-purple-400 text-amber-300 flex items-center justify-center shadow-2xl active:scale-90 transition-transform"
                  aria-label="Yukarı"
                >
                  <ArrowUp className="w-7 h-7 stroke-[3]" />
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onPointerDown={(e) => { e.preventDefault(); gameControlsRef.current.onDpad?.('left'); }}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-purple-950/85 active:bg-purple-600 border-2 border-purple-400 text-amber-300 flex items-center justify-center shadow-2xl active:scale-90 transition-transform"
                    aria-label="Sol"
                  >
                    <ArrowLeft className="w-7 h-7 stroke-[3]" />
                  </button>
                  <div className="w-5 h-5 rounded-full bg-purple-500/40 border border-purple-300/40"></div>
                  <button
                    onPointerDown={(e) => { e.preventDefault(); gameControlsRef.current.onDpad?.('right'); }}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-purple-950/85 active:bg-purple-600 border-2 border-purple-400 text-amber-300 flex items-center justify-center shadow-2xl active:scale-90 transition-transform"
                    aria-label="Sağ"
                  >
                    <ArrowRight className="w-7 h-7 stroke-[3]" />
                  </button>
                </div>
                <button
                  onPointerDown={(e) => { e.preventDefault(); gameControlsRef.current.onDpad?.('down'); }}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-purple-950/85 active:bg-purple-600 border-2 border-purple-400 text-amber-300 flex items-center justify-center shadow-2xl active:scale-90 transition-transform"
                  aria-label="Aşağı"
                >
                  <ArrowDown className="w-7 h-7 stroke-[3]" />
                </button>
              </div>

              {/* On-Screen Touch / Swipe Guide Hint */}
              <div className="absolute bottom-2.5 right-3 z-10 pointer-events-none select-none px-3 py-1.5 rounded-xl bg-slate-950/80 border border-purple-400/40 text-[11px] font-bold text-purple-200 backdrop-blur-md hidden sm:block">
                <span>{t.swipeOrDpad}</span>
              </div>
            </>
          )}

          {/* B. SPACE INVADERS: LEFT/RIGHT + FIRE BUTTON */}
          {selectedGame === 'space_invaders' && (
            <>
              {/* Left/Right controls on bottom-left */}
              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3 pointer-events-auto select-none">
                <button
                  onPointerDown={(e) => { e.preventDefault(); gameControlsRef.current.onDpad?.('left'); }}
                  onPointerUp={(e) => { e.preventDefault(); gameControlsRef.current.onDpadRelease?.('left'); }}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-indigo-950/85 active:bg-indigo-600 border-2 border-indigo-400 text-white flex items-center justify-center shadow-2xl active:scale-90 transition-transform"
                >
                  <ArrowLeft className="w-8 h-8 stroke-[3]" />
                </button>
                <button
                  onPointerDown={(e) => { e.preventDefault(); gameControlsRef.current.onDpad?.('right'); }}
                  onPointerUp={(e) => { e.preventDefault(); gameControlsRef.current.onDpadRelease?.('right'); }}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-indigo-950/85 active:bg-indigo-600 border-2 border-indigo-400 text-white flex items-center justify-center shadow-2xl active:scale-90 transition-transform"
                >
                  <ArrowRight className="w-8 h-8 stroke-[3]" />
                </button>
              </div>

              {/* Fire Button on bottom-right */}
              <div className="absolute bottom-4 right-4 z-20 pointer-events-auto select-none">
                <button
                  onPointerDown={(e) => { e.preventDefault(); gameControlsRef.current.onAction?.('shoot'); }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 active:brightness-125 border-3 border-amber-300 text-white flex flex-col items-center justify-center shadow-2xl active:scale-90 transition-transform font-black text-xs sm:text-sm"
                >
                  <span className="text-xl sm:text-2xl leading-none">🔥</span>
                  <span>{t.shootBtn}</span>
                </button>
              </div>
            </>
          )}

          {/* C. JUMP RUNNERS: HONEY RUSH, FLAPPY BEAR, RETRO RUNNER */}
          {['honey_rush', 'flappy_bear', 'retro_runner'].includes(selectedGame) && (
            <div className="absolute bottom-4 right-4 z-20 pointer-events-auto select-none">
              <button
                onPointerDown={(e) => { e.preventDefault(); gameControlsRef.current.onAction?.('jump'); }}
                className="w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-500 active:brightness-125 border-3 border-amber-200 text-slate-950 flex flex-col items-center justify-center shadow-2xl active:scale-90 transition-transform font-black text-xs sm:text-sm"
              >
                <span className="text-2xl sm:text-3xl leading-none">
                  {selectedGame === 'flappy_bear' ? '🪽' : '🦘'}
                </span>
                <span>{selectedGame === 'flappy_bear' ? 'UÇ' : t.jumpBtn}</span>
              </button>
            </div>
          )}

          {/* D. PADDLE / DODGE: BRICK BREAKER, BUBBLE JUMP, METEOR DODGE */}
          {['brick_breaker', 'bubble_jump', 'meteor_dodge'].includes(selectedGame) && (
            <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between pointer-events-none select-none">
              <button
                onPointerDown={(e) => { e.preventDefault(); gameControlsRef.current.onDpad?.('left'); }}
                className="pointer-events-auto w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-purple-950/85 active:bg-purple-600 border-2 border-purple-400 text-white flex items-center justify-center shadow-2xl active:scale-90 transition-transform"
              >
                <ArrowLeft className="w-8 h-8 stroke-[3]" />
              </button>
              <div className="px-3 py-1 rounded-full bg-slate-950/80 border border-purple-400/40 text-[11px] font-bold text-purple-200 backdrop-blur-md hidden sm:block">
                <span>👈 Ekranda Parmağını Kaydır veya Tuşlara Bas 👉</span>
              </div>
              <button
                onPointerDown={(e) => { e.preventDefault(); gameControlsRef.current.onDpad?.('right'); }}
                className="pointer-events-auto w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-purple-950/85 active:bg-purple-600 border-2 border-purple-400 text-white flex items-center justify-center shadow-2xl active:scale-90 transition-transform"
              >
                <ArrowRight className="w-8 h-8 stroke-[3]" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. SELECTION / INTRO SCREEN: MOBILE-FIRST FULLSCREEN RESPONSIVE LAYOUT
  return (
    <div 
      className="fixed inset-0 z-[130] flex items-center justify-center p-0 sm:p-4 bg-slate-950/90 backdrop-blur-md select-none overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full h-full sm:h-auto sm:max-h-[94vh] max-w-5xl bg-slate-900 border-0 sm:border-2 border-purple-500/50 rounded-none sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        
        {/* Compact Header */}
        <div className="px-3 py-2.5 sm:px-5 sm:py-3.5 bg-gradient-to-r from-purple-800 via-indigo-700 to-purple-900 text-white flex items-center justify-between gap-2 border-b-2 border-purple-400/50 shrink-0 shadow-md">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-slate-950 border-2 border-purple-300 flex items-center justify-center text-lg sm:text-2xl shadow-xl shrink-0">
              🕹️
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-xl font-black tracking-wider text-white truncate">
                  {t.headerTitle}
                </h2>
                <span className="px-2 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] shrink-0">
                  {t.gameCount}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-purple-200 font-medium truncate">
                <span className="hidden sm:inline">{todayDateStr}</span>
                <span className="hidden sm:inline text-purple-400">•</span>
                <span className="text-amber-300 font-bold">⭐ {t.gameOfTheDay}: {featuredGame.title} (2X!)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {!dailyClaimed && (
              <button
                onClick={claimDailyReward}
                className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs shadow flex items-center gap-1 transition active:scale-95 cursor-pointer"
              >
                <Gift className="w-3.5 h-3.5 animate-bounce" />
                <span className="hidden xs:inline">{t.claimDailyGift}</span>
              </button>
            )}
            <button
              onClick={() => toggleImmersiveFullscreen()}
              title={isFullscreen ? 'Pencere' : 'Tam Ekran'}
              className="p-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-amber-300 border border-purple-400/50 transition active:scale-95 cursor-pointer"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black transition active:scale-95 cursor-pointer border border-rose-300 shadow"
              title={t.closeBtn}
              aria-label={t.closeBtn}
            >
              <X className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-950/80 border-b border-purple-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'daily'
                  ? 'bg-purple-600 text-white shadow border border-purple-400'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.tabDaily}</span>
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-purple-600 text-white shadow border border-purple-400'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5 text-cyan-300" />
              <span>{t.tabAll}</span>
            </button>
          </div>

          <div className="text-[11px] font-bold text-amber-300 hidden sm:flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>{t.tabSubtitle}</span>
          </div>
        </div>

        {/* Body Area */}
        <div className="p-2 sm:p-4 overflow-y-auto space-y-3 flex-1 overscroll-contain">
          
          {/* Game Selection Horizontal/Grid Strip */}
          <div className="grid grid-cols-2 xs:grid-cols-4 sm:grid-cols-4 md:grid-cols-5 gap-1.5 sm:gap-2">
            {displayGames.map(g => {
              const isSel = selectedGame === g.id;
              const hs = highScores[g.id] || 0;
              const isFeatured = g.id === featuredGame.id;

              return (
                <button
                  key={g.id}
                  onClick={() => {
                    setSelectedGame(g.id);
                    setGameOver(false);
                    setScore(0);
                  }}
                  className={`p-2 rounded-xl border-2 text-left transition transform duration-150 flex flex-col justify-between relative overflow-hidden ${
                    isSel
                      ? 'border-purple-400 bg-purple-950/70 shadow-lg shadow-purple-500/30 scale-[1.02]'
                      : 'border-slate-800 bg-slate-900/70 hover:bg-slate-800/60 opacity-85 hover:opacity-100 cursor-pointer'
                  }`}
                >
                  {isFeatured && (
                    <span className="absolute top-0 right-0 px-1.5 py-0.2 bg-gradient-to-l from-amber-400 to-yellow-500 text-slate-950 font-black text-[9px] rounded-bl shadow">
                      2X ⭐
                    </span>
                  )}

                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xl sm:text-2xl">{g.icon}</span>
                    <span className="text-[9px] font-bold text-purple-300 px-1 rounded bg-purple-950/80 border border-purple-800/50">
                      {g.accentBadge}
                    </span>
                  </div>

                  <h4 className="font-black text-xs text-white leading-tight truncate">{g.title}</h4>
                  
                  <div className="mt-1 flex items-center justify-between text-[10px] font-bold text-amber-300">
                    <div className="flex items-center gap-0.5">
                      <Trophy className="w-3 h-3 text-amber-400" />
                      <span>{hs}</span>
                    </div>
                    {isFeatured && <span className="text-amber-400 font-black">2X</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Game Intro & Play Dashboard */}
          <div className="rounded-2xl border-2 border-purple-500/40 bg-slate-950/90 p-3 sm:p-5 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              
              {/* Left Column: Game Meta & Rules */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-950 border border-purple-400/60 flex items-center justify-center text-3xl shadow">
                    {currentMeta.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-black text-white">{currentMeta.title}</h3>
                      {isSelectedGameDaily && (
                        <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-black rounded text-[10px]">
                          2X GÜNÜN OYUNU
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-purple-300 font-semibold">{currentMeta.subtitle}</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {currentMeta.description}
                </p>

                {/* Rules List */}
                <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="font-black text-purple-300 flex items-center gap-1.5 text-[11px]">
                    <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>{t.howToPlay}</span>
                  </div>
                  {currentMeta.rules.map((rule, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                      <span className="text-purple-400">•</span>
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Score, Result & Big Play Button */}
              <div className="flex flex-col items-center justify-center space-y-3 bg-purple-950/30 p-4 rounded-2xl border border-purple-500/20">
                {gameOver && (
                  <div className="w-full p-2.5 bg-amber-500/15 border border-amber-500/40 rounded-xl text-center">
                    <div className="flex items-center justify-center gap-2 text-amber-300 font-black text-sm">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>{t.gameOver} {score} {t.points}!</span>
                    </div>
                    {isSelectedGameDaily && (
                      <span className="text-emerald-400 text-[11px] font-bold block mt-0.5">
                        {t.bonusAdded}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-3 text-xs text-purple-200">
                  <span className="font-bold">{t.highScore}:</span>
                  <span className="px-2 py-0.5 rounded-lg bg-amber-400/20 text-amber-300 font-black text-sm">
                    🏆 {highScores[selectedGame] || 0}
                  </span>
                </div>

                <button
                  onClick={handleStartGame}
                  className="w-full max-w-xs py-3 px-6 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 hover:from-purple-400 hover:to-indigo-400 text-white font-black text-base shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition transform active:scale-95 cursor-pointer border border-purple-300"
                >
                  <Play className="w-5 h-5 fill-current text-amber-300" />
                  <span>{gameOver ? t.playAgainBtn : t.playBtn}</span>
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Compact Footer */}
        <div className="px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-2 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2 text-[11px] truncate">
            <span className="text-amber-400 font-bold">{t.footerTitle}</span>
            <span className="hidden sm:inline">{t.footerDesc}</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition cursor-pointer border border-slate-700 text-xs shrink-0"
          >
            {t.closeBtn}
          </button>
        </div>

      </div>
    </div>
  );
};
