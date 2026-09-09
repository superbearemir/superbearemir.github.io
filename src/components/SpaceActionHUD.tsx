import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  Zap, 
  Paintbrush, 
  Smile, 
  Crosshair, 
  Lock, 
  Unlock, 
  Eye, 
  Sparkles, 
  X,
  Fish,
  Smartphone,
  Monitor,
  Check,
  Save,
  CheckCircle2
} from 'lucide-react';
import { QualityProfile, optimizeGameRenderer } from '../utils/mobilePerformanceOptimizer';
import { ControlMode } from './DeviceSelectionModal';
import { useGameSave } from '../utils/saveManager';

interface SpaceActionHUDProps {
  onOpenDrawingModal: () => void;
  onOpenCatShop?: () => void;
  onOpenMapModal?: () => void;
  onOpenArcade?: () => void;
  onOpenSaveModal?: () => void;
  aliensRescued?: number;
  controlMode?: ControlMode;
  onOpenDeviceSelector?: () => void;
}

export const SpaceActionHUD: React.FC<SpaceActionHUDProps> = ({
  onOpenDrawingModal,
  onOpenCatShop,
  onOpenMapModal,
  onOpenArcade,
  onOpenSaveModal,
  aliensRescued = 0,
  controlMode = 'touch',
  onOpenDeviceSelector,
}) => {
  const [activeSprayColor, setActiveSprayColor] = useState<'green' | 'purple' | 'gold' | 'red' | 'blue' | 'pink' | 'orange' | 'white' | 'cyan' | 'lime' | 'yellow' | 'magenta' | 'teal' | 'brown' | 'black' | 'indigo'>('green');
  const [activeSprayShape, setActiveSprayShape] = useState<'circle' | 'star' | 'heart' | 'square' | 'badge' | 'triangle' | 'diamond' | 'crescent' | 'ring' | 'flower' | 'cross'>('circle');
  const [sprayText, setSprayText] = useState('');
  const [teleportCooldown, setTeleportCooldown] = useState(0);
  const [laserCooldown, setLaserCooldown] = useState(0);
  const [alienCompanionActive, setAlienCompanionActive] = useState(true);
  const [tripleJumpUnlocked, setTripleJumpUnlocked] = useState(true);
  const [showSprayMenu, setShowSprayMenu] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPowersRackOpen, setIsPowersRackOpen] = useState(false);
  const [isNearInteractable, setIsNearInteractable] = useState(false);
  const [activeTab, setActiveTab] = useState<'powers' | 'emotes' | 'shop' | 'settings'>('powers');
  const [selectedPowerId, setSelectedPowerId] = useState<'teleport' | 'laser' | 'rocket' | 'ground_pound' | 'roll' | 'fish' | 'spray' | 'companion' | 'dance' | 'triple_jump' | 'interact'>('laser');

  // Game Persistence & Auto-Save Manager hook
  const { saveData, lastSaveToast, manualSave } = useGameSave();
  const [saveFlash, setSaveFlash] = useState(false);

  const handleQuickSave = () => {
    manualSave();
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 1200);
    if (onOpenSaveModal) {
      onOpenSaveModal();
    } else {
      window.dispatchEvent(new CustomEvent('superbear:open-save-modal'));
    }
  };

  // Listen for proximity and powers rack events
  useEffect(() => {
    const handleInteractProximity = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail.isNear === 'boolean') {
        setIsNearInteractable(detail.isNear);
      }
    };
    const handleCatMerchantProximity = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail.isNear === 'boolean') {
        if (detail.isNear) setIsNearInteractable(true);
      }
    };
    const handleArcadeProximity = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail.isNear === 'boolean') {
        if (detail.isNear) setIsNearInteractable(true);
      }
    };
    const handleOpenPowersRack = () => {
      setIsPowersRackOpen((prev) => !prev);
    };

    window.addEventListener('superbear:interact-proximity', handleInteractProximity);
    window.addEventListener('superbear:cat-merchant-proximity', handleCatMerchantProximity);
    window.addEventListener('superbear:arcade-proximity', handleArcadeProximity);
    window.addEventListener('superbear:open-powers-rack', handleOpenPowersRack);

    return () => {
      window.removeEventListener('superbear:interact-proximity', handleInteractProximity);
      window.removeEventListener('superbear:cat-merchant-proximity', handleCatMerchantProximity);
      window.removeEventListener('superbear:arcade-proximity', handleArcadeProximity);
      window.removeEventListener('superbear:open-powers-rack', handleOpenPowersRack);
    };
  }, []);

  // Synchronize master modal state with global flag to avoid dead zones
  useEffect(() => {
    (window as any).__superBearModalOpen = isMenuOpen;
    if (isMenuOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [isMenuOpen]);

  // Listen for global open master menu event
  useEffect(() => {
    const handleOpenMasterMenu = () => setIsMenuOpen(true);
    window.addEventListener('superbear:open-master-menu', handleOpenMasterMenu);
    return () => window.removeEventListener('superbear:open-master-menu', handleOpenMasterMenu);
  }, []);

  const [perfProfile, setPerfProfile] = useState<QualityProfile>(() => {
    return (localStorage.getItem('super_bear_perf_profile') as QualityProfile) || 'smooth60';
  });

  const togglePerformanceProfile = () => {
    const nextProfile: QualityProfile = perfProfile === 'smooth60' ? 'ultra' : perfProfile === 'ultra' ? 'balanced' : 'smooth60';
    setPerfProfile(nextProfile);
    optimizeGameRenderer(nextProfile);
  };

  // Synchronize spray settings to the global enhancer instance so shortcut V also uses them
  useEffect(() => {
    const enhancer = (window as any).__superBearSpaceEnhancer;
    if (enhancer) {
      enhancer.currentSpraySettings = {
        color: activeSprayColor,
        shape: activeSprayShape,
        text: sprayText
      };
    } else {
      (window as any).__superBearSpaceEnhancer = (window as any).__superBearSpaceEnhancer || {};
      (window as any).__superBearSpaceEnhancer.currentSpraySettings = {
        color: activeSprayColor,
        shape: activeSprayShape,
        text: sprayText
      };
    }
  }, [activeSprayColor, activeSprayShape, sprayText]);

  const handleJump = () => {
    const game = (window as any).__superBearGame;
    if (game && typeof game.handleJump === 'function') {
      game.handleJump();
      return;
    }
    const enhancer = (window as any).__superBearSpaceEnhancer;
    if (enhancer && enhancer.triggerJump) {
      enhancer.triggerJump();
    } else {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', key: ' ' }));
      setTimeout(() => {
        window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space', key: ' ' }));
      }, 60);
    }
  };

  const handleTeleportDash = () => {
    if (teleportCooldown > 0) return;
    setTeleportCooldown(100);
    const interval = setInterval(() => {
      setTeleportCooldown((prev) => {
        if (prev <= 10) {
          clearInterval(interval);
          return 0;
        }
        return prev - 10;
      });
    }, 100);

    const enhancer = (window as any).__superBearSpaceEnhancer;
    if (enhancer && enhancer.teleportDash) enhancer.teleportDash();
  };

  const handleShootLaser = () => {
    if (laserCooldown > 0) return;
    setLaserCooldown(100);
    const interval = setInterval(() => {
      setLaserCooldown((prev) => {
        if (prev <= 15) {
          clearInterval(interval);
          return 0;
        }
        return prev - 15;
      });
    }, 100);

    const enhancer = (window as any).__superBearSpaceEnhancer;
    if (enhancer && enhancer.shootLaser) enhancer.shootLaser();
  };

  const handleSprayPaint = (
    color?: 'green' | 'purple' | 'gold' | 'red' | 'blue' | 'pink' | 'orange' | 'white' | 'cyan' | 'lime' | 'yellow' | 'magenta' | 'teal' | 'brown' | 'black' | 'indigo',
    shape?: 'circle' | 'star' | 'heart' | 'square' | 'badge' | 'triangle' | 'diamond' | 'crescent' | 'ring' | 'flower' | 'cross',
    text?: string
  ) => {
    const selectedColor = color || activeSprayColor;
    const selectedShape = shape || activeSprayShape;
    const selectedText = text !== undefined ? text : sprayText;

    if (color) setActiveSprayColor(color);
    if (shape) setActiveSprayShape(shape);

    const enhancer = (window as any).__superBearSpaceEnhancer;
    if (enhancer && enhancer.sprayPaint) {
      enhancer.sprayPaint(selectedColor, selectedShape, selectedText);
    }
  };

  const handleToggleAlienCompanion = () => {
    const next = !alienCompanionActive;
    setAlienCompanionActive(next);

    const enhancer = (window as any).__superBearSpaceEnhancer;
    if (enhancer && enhancer.toggleAlienCompanion) enhancer.toggleAlienCompanion(next);
  };

  const handleTriggerEmote = (type: string) => {
    const enhancer = (window as any).__superBearSpaceEnhancer;
    if (enhancer && enhancer.triggerEmote) {
      enhancer.triggerEmote(type);
    }
  };

  const handleRocketEscape = () => {
    const game = (window as any).__superBearGame;
    const enhancer = (window as any).__superBearSpaceEnhancer;
    if (game) {
      game.speedrunInvalidated = true;
      if (game.playerVel) {
        game.playerVel.y = 30;
      }
      if (game.spawnSparkleParticles && game.playerPos) {
        for (let i = 0; i < 40; i++) {
          const ang = (i / 40) * Math.PI * 2;
          const dist = Math.random() * 3.5;
          game.spawnSparkleParticles(
            game.playerPos.clone().add(new (window as any).THREE.Vector3(Math.cos(ang) * dist, -0.5, Math.sin(ang) * dist)),
            2,
            i % 2 === 0 ? 0xf97316 : 0xfacc15
          );
        }
      }
      if (game.callbacks && game.callbacks.onShowNotice) {
        game.callbacks.onShowNotice("🚀 UZAY ROKETİ FIRLATILDI! (Art arda tıklayarak yükselebilirsin!)", "warning");
      }
    }
    if (enhancer && enhancer.triggerEmote) {
      enhancer.triggerEmote('rocket');
    }
  };

  const handleFishAction = () => {
    const enhancer = (window as any).__superBearSpaceEnhancer;
    if (enhancer && enhancer.triggerFishing) {
      enhancer.triggerFishing();
    } else {
      window.dispatchEvent(new CustomEvent('superbear:action-trigger', { detail: 'fish' }));
    }
  };

  const handleRoll = () => {
    const game = (window as any).__superBearGame;
    if (game && game.handleRoll) {
      game.handleRoll();
    } else {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ShiftLeft', key: 'Shift' }));
      setTimeout(() => {
        window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ShiftLeft', key: 'Shift' }));
      }, 150);
    }
  };

  const handleGroundPound = () => {
    const game = (window as any).__superBearGame;
    if (game && game.handleGroundPound) {
      game.handleGroundPound();
    } else {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyC', key: 'c' }));
      setTimeout(() => {
        window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyC', key: 'c' }));
      }, 150);
    }
  };

  const handleAttack = () => {
    const game = (window as any).__superBearGame;
    if (game && game.handleAttack) {
      game.handleAttack();
    } else {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyB', key: 'b' }));
      setTimeout(() => {
        window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyB', key: 'b' }));
      }, 150);
    }
  };

  const handleInteract = () => {
    const isNear = isNearInteractable || (typeof window !== 'undefined' && !!(window as any).__superBearNearInteractable);
    if (!isNear) return;

    const game = (window as any).__superBearGame;
    if (game && game.handleInteract) {
      game.handleInteract();
    } else {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyE', key: 'e' }));
      setTimeout(() => {
        window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyE', key: 'e' }));
      }, 150);
    }
  };

  const handleToggleTripleJump = () => {
    const game = (window as any).__superBearGame;
    const nextState = !tripleJumpUnlocked;
    setTripleJumpUnlocked(nextState);
    if (game && game.stats) {
      game.stats.hasTripleJump = nextState;
      game.stats.hasDoubleJump = true;
      if (game.callbacks && game.callbacks.onShowNotice) {
        game.callbacks.onShowNotice(
          nextState 
            ? "✨ 3 Kere Zıplama (Triple Jump) AÇILDI! Havada 3 defa zıplayabilirsin!" 
            : "⚠️ 3 Kere Zıplama kapatıldı.",
          nextState ? "success" : "info"
        );
      }
    }
  };

  // Auto-enable triple jump on start
  useEffect(() => {
    const timer = setTimeout(() => {
      const game = (window as any).__superBearGame;
      if (game && game.stats) {
        game.stats.hasTripleJump = true;
        game.stats.hasDoubleJump = true;
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const powerDefinitions: Record<string, {
    id: typeof selectedPowerId;
    name: string;
    shortLabel: string;
    emoji: string;
    bgClass: string;
    borderClass: string;
    handler: () => void;
    description: string;
    keyHint: string;
  }> = {
    teleport: {
      id: 'teleport',
      name: 'Işınlanma',
      shortLabel: 'IŞINLAN',
      emoji: '⚡',
      bgClass: 'from-indigo-600 to-purple-700 text-white',
      borderClass: 'border-indigo-400',
      handler: handleTeleportDash,
      description: 'Teleport Dash',
      keyHint: '[T]'
    },
    laser: {
      id: 'laser',
      name: 'Kozmik Lazer',
      shortLabel: 'LAZER',
      emoji: '🎯',
      bgClass: 'from-pink-600 to-rose-700 text-white',
      borderClass: 'border-pink-400',
      handler: handleShootLaser,
      description: 'Lazer Ateşi',
      keyHint: '[F]'
    },
    rocket: {
      id: 'rocket',
      name: 'Uzay Roketi',
      shortLabel: 'ROKET',
      emoji: '🚀',
      bgClass: 'from-amber-600 to-orange-700 text-white',
      borderClass: 'border-amber-400',
      handler: handleRocketEscape,
      description: 'Kurtul & Yüksel',
      keyHint: 'Roket'
    },
    ground_pound: {
      id: 'ground_pound',
      name: 'Yere Ezme',
      shortLabel: 'EZME',
      emoji: '💥',
      bgClass: 'from-red-600 to-orange-700 text-white',
      borderClass: 'border-red-400',
      handler: handleGroundPound,
      description: 'Havadan Yere Vur',
      keyHint: '[C]'
    },
    roll: {
      id: 'roll',
      name: 'Takla & Hız',
      shortLabel: 'TAKLA',
      emoji: '🌀',
      bgClass: 'from-emerald-600 to-teal-700 text-white',
      borderClass: 'border-emerald-400',
      handler: handleRoll,
      description: 'Takla Attır',
      keyHint: '[Shift]'
    },
    fish: {
      id: 'fish',
      name: 'Balık Tut',
      shortLabel: 'OLTA',
      emoji: '🎣',
      bgClass: 'from-sky-600 to-cyan-700 text-white',
      borderClass: 'border-sky-400',
      handler: handleFishAction,
      description: 'Nehirde Balık Tut',
      keyHint: 'Olta'
    },
    spray: {
      id: 'spray',
      name: 'Sprey Boya',
      shortLabel: 'SPREY',
      emoji: '🎨',
      bgClass: 'from-teal-600 to-emerald-700 text-white',
      borderClass: 'border-teal-400',
      handler: () => handleSprayPaint(),
      description: 'Zemine Şekil Çiz',
      keyHint: '[V]'
    },
    companion: {
      id: 'companion',
      name: 'Uzaylı Dost',
      shortLabel: 'DOST',
      emoji: '👽',
      bgClass: 'from-emerald-600 to-green-700 text-white',
      borderClass: 'border-emerald-300',
      handler: handleToggleAlienCompanion,
      description: 'Uzaylı Refakatçi',
      keyHint: '[R]'
    },
    dance: {
      id: 'dance',
      name: 'Dans Et',
      shortLabel: 'DANS',
      emoji: '🕺',
      bgClass: 'from-fuchsia-600 to-purple-700 text-white',
      borderClass: 'border-fuchsia-400',
      handler: () => handleTriggerEmote('dance'),
      description: 'Eğlenceli Dans',
      keyHint: 'Dans'
    },
    triple_jump: {
      id: 'triple_jump',
      name: '3x Zıplama',
      shortLabel: '3X ZIPLA',
      emoji: '🦘',
      bgClass: 'from-yellow-500 to-amber-600 text-slate-950',
      borderClass: 'border-yellow-300',
      handler: handleToggleTripleJump,
      description: 'Havada 3 Zıplayış',
      keyHint: '3x'
    },
    interact: {
      id: 'interact',
      name: 'Etkileşim',
      shortLabel: 'ETKİLEŞİM',
      emoji: '💬',
      bgClass: 'from-amber-500 to-yellow-600 text-slate-950',
      borderClass: 'border-amber-300',
      handler: handleInteract,
      description: 'Konuş & Dükkan Aç',
      keyHint: '[E]'
    }
  };

  const selectAndExecutePower = (powerId: typeof selectedPowerId) => {
    setSelectedPowerId(powerId);
    setIsPowersRackOpen(false); // Auto-close power rack after selection
    if (powerDefinitions[powerId] && powerDefinitions[powerId].handler) {
      powerDefinitions[powerId].handler();
    }
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }
  };

  return (
    <>
      {/* Top Left Performance, Map & Device Quick Controls (Positioned at top-12/16 to NEVER overlap game stats bar in portrait mode) */}
      <div className="fixed top-12 sm:top-16 left-3 sm:left-4 z-[40] flex items-center gap-1.5 sm:gap-2 pointer-events-none select-none">
        
        {/* Quick Map Selector Button */}
        <button
          onClick={() => {
            if (onOpenMapModal) onOpenMapModal();
            else window.dispatchEvent(new CustomEvent('superbear:open-map-selector'));
          }}
          title="38 Bölümlü Harita Seçiciyi Aç"
          className="pointer-events-auto px-2.5 py-1 rounded-full bg-gradient-to-r from-sky-600 to-teal-600 text-white border border-sky-300 shadow-lg backdrop-blur-md flex items-center gap-1.5 text-xs font-black transition transform active:scale-95 cursor-pointer hover:from-sky-500 hover:to-teal-500"
        >
          <span className="text-xs">🗺️</span>
          <span>Harita</span>
        </button>

        {/* Quick Retro Arcade Games Button (Prominently visible on Mobile and PC) */}
        <button
          onClick={() => {
            if (onOpenArcade) onOpenArcade();
            else window.dispatchEvent(new CustomEvent('superbear:open-arcade-games'));
          }}
          title="Retro Arcade Mini Oyun Salonunu Aç (10 Nostaljik Atari Oyunu)"
          className="pointer-events-auto px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white border border-purple-300 shadow-lg backdrop-blur-md flex items-center gap-1.5 text-xs font-black transition transform active:scale-95 cursor-pointer hover:from-purple-500 hover:to-pink-500"
        >
          <span className="text-xs">🕹️</span>
          <span>Arcade</span>
        </button>

        {/* Loot Boxes Quick Button */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('superbear:open-lootboxes'))}
          title="Şans Kutuları & Sandıklar (1x, 15x, Efsanevi 1 ve Efsanevi 5 Kutu)"
          className="pointer-events-auto px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500 text-slate-950 border border-amber-300 shadow-md backdrop-blur-md flex items-center gap-1.5 text-xs font-black transition transform active:scale-95 cursor-pointer hover:brightness-110 animate-pulse"
        >
          <span className="text-xs">🎁</span>
          <span>Kutular</span>
        </button>

        {/* Anti-Lag / 60 FPS Toggle Button */}
        <button
          onClick={togglePerformanceProfile}
          title="Performans ve FPS Modunu Değiştir"
          className="pointer-events-auto px-2.5 py-1 rounded-full bg-slate-900/90 text-white border border-slate-700 hover:border-amber-400 shadow-md backdrop-blur-md flex items-center gap-1.5 text-xs font-black transition transform active:scale-95 cursor-pointer hover:bg-slate-800"
        >
          <Zap className={`w-3.5 h-3.5 ${perfProfile === 'smooth60' ? 'text-amber-400 animate-pulse' : perfProfile === 'ultra' ? 'text-cyan-400' : 'text-emerald-400'}`} />
          <span className="hidden md:inline">
            {perfProfile === 'smooth60' ? '⚡ 60 FPS' : perfProfile === 'ultra' ? '💎 Ultra' : '⚖️ Dengeli'}
          </span>
        </button>

        {/* Device Mode Quick Switcher */}
        {onOpenDeviceSelector && (
          <button
            onClick={onOpenDeviceSelector}
            className="pointer-events-auto px-2.5 py-1 rounded-full bg-slate-900/90 text-slate-100 border border-slate-700 hover:border-amber-400 shadow-md backdrop-blur-md flex items-center gap-1.5 text-xs font-black transition transform active:scale-95 cursor-pointer hover:bg-slate-800"
            title="Cihaz ve Kontrol Modunu Değiştir (Mobil / PC)"
          >
            {controlMode === 'touch' ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Mobil</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">PC</span>
              </>
            )}
          </button>
        )}

        {/* Quick Save & Progress Manager Button */}
        <button
          onClick={handleQuickSave}
          title="Oyun İlerlemesini ve Altınları Kaydet (Yerel Hafıza)"
          className={`pointer-events-auto px-2.5 py-1 rounded-full text-white border shadow-lg backdrop-blur-md flex items-center gap-1.5 text-xs font-black transition-all transform active:scale-95 cursor-pointer ${
            saveFlash
              ? 'bg-emerald-500 border-emerald-200 text-slate-950 scale-105 shadow-emerald-500/50'
              : 'bg-gradient-to-r from-emerald-600 to-teal-700 border-emerald-400/80 hover:from-emerald-500 hover:to-teal-600'
          }`}
        >
          <Save className={`w-3.5 h-3.5 ${saveFlash ? 'animate-spin text-slate-950' : 'text-emerald-200'}`} />
          <span>{saveFlash ? 'Kaydedildi!' : 'Kaydet'}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
        </button>
      </div>

      {/* Floating Auto-Save Success Notification Banner */}
      {lastSaveToast && (
        <div className="fixed top-2 sm:top-3.5 left-1/2 -translate-x-1/2 z-[100] pointer-events-none select-none px-3.5 py-1.5 rounded-full bg-slate-950/90 border border-emerald-400/90 shadow-2xl backdrop-blur-md flex items-center gap-2 text-xs font-black text-emerald-300 animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
          <span>{lastSaveToast.message}</span>
        </div>
      )}

      {/* Responsive Centered Modal Dialog (Guaranteed strictly within screen bounds on any device) */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-[120] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200 pointer-events-auto select-none"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsMenuOpen(false);
          }}
        >
          <div className="bg-slate-950/95 border-2 border-purple-500/60 rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
            
            {/* Header */}
            <div className="p-3.5 sm:p-4 border-b border-purple-500/30 flex items-center justify-between bg-slate-900/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-lg shadow-md">
                  🌌
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-200 to-amber-300">
                    Süper Ayı Macera & Kontrol Menüsü
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-400">
                    Kozmik Güçler, Haritalar, Dükkan ve Ayarlar
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                aria-label="Kapat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="grid grid-cols-4 gap-1 p-2 bg-slate-900/90 border-b border-slate-800">
              <button
                onClick={() => setActiveTab('powers')}
                className={`py-1.5 px-1 rounded-xl text-[10px] sm:text-xs font-black transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
                  activeTab === 'powers' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>⚡</span>
                <span className="truncate">Güçler</span>
              </button>
              <button
                onClick={() => setActiveTab('emotes')}
                className={`py-1.5 px-1 rounded-xl text-[10px] sm:text-xs font-black transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
                  activeTab === 'emotes' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🎨</span>
                <span className="truncate">Sprey/Emojiler</span>
              </button>
              <button
                onClick={() => setActiveTab('shop')}
                className={`py-1.5 px-1 rounded-xl text-[10px] sm:text-xs font-black transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
                  activeTab === 'shop' ? 'bg-amber-600 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🏪</span>
                <span className="truncate">Bölüm/Dükkan</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-1.5 px-1 rounded-xl text-[10px] sm:text-xs font-black transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
                  activeTab === 'settings' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>⚙️</span>
                <span className="truncate">Cihaz/FPS</span>
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-3.5 sm:p-5 overflow-y-auto space-y-3 overscroll-contain">
              
              {/* TAB 1: POWERS & ACTIONS */}
              {activeTab === 'powers' && (
                <div className="space-y-2.5">
                  {/* 20:00 Underground Trailer Banner Action */}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.dispatchEvent(new CustomEvent('superbear:open-trailer'));
                    }}
                    className="w-full p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 hover:from-red-500 hover:to-orange-400 text-white font-black text-xs border border-amber-300 shadow-lg flex items-center justify-between transition active:scale-95 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl animate-bounce">🌋</span>
                      <div className="text-left">
                        <div className="font-black text-yellow-200 text-xs sm:text-sm">20:00 Fragmanı (5 Dakika)</div>
                        <div className="text-[10px] text-amber-100/80">9 Yeraltı Bölümü, Köstebekler & Zemin Yarığı</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-slate-950 text-amber-300 px-2 py-1 rounded-lg font-mono font-bold">İZLE [H]</span>
                  </button>

                  {/* Triple Jump */}
                  <button
                    onClick={handleToggleTripleJump}
                    className={`w-full p-2.5 rounded-2xl font-black text-xs flex items-center justify-between border transition active:scale-95 cursor-pointer ${
                      tripleJumpUnlocked
                        ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-slate-950 border-amber-300 shadow-md ring-1 ring-amber-300'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">🦘</span>
                      <div className="text-left">
                        <div className="font-bold">3 Kere Zıplayıcı (Triple Jump)</div>
                        <div className="text-[10px] opacity-80">Havada 3 defa art arda zıpla</div>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded-lg font-black font-mono ${
                      tripleJumpUnlocked ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {tripleJumpUnlocked ? 'AÇIK (3x)' : 'KAPALI'}
                    </span>
                  </button>

                  {/* Teleport Dash Button */}
                  <button
                    onClick={handleTeleportDash}
                    disabled={teleportCooldown > 0}
                    className={`w-full p-2.5 rounded-2xl font-black text-xs flex items-center justify-between border transition active:scale-95 cursor-pointer ${
                      teleportCooldown > 0
                        ? 'bg-slate-900 border-slate-800 text-slate-500'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400/50 shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-cyan-300" />
                      <div className="text-left">
                        <div>⚡ Hızlı Işınlanma (Teleport Dash)</div>
                        <div className="text-[10px] text-slate-300">İleriye doğru anında sıçra</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono bg-slate-950 px-2 py-1 rounded-lg">[T]</span>
                  </button>

                  {/* Space Rocket Escape Booster */}
                  <button
                    onClick={handleRocketEscape}
                    className="w-full p-2.5 rounded-2xl font-black text-xs flex items-center justify-between border bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white border-amber-400/80 shadow-lg transition active:scale-95 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Rocket className="w-4 h-4 text-yellow-300 animate-bounce" />
                      <div className="text-left">
                        <div>🚀 Uzay Roketi (Kurtulma Gücü)</div>
                        <div className="text-[10px] text-amber-100/80">Engellerden ve çukurlardan kurtul</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-slate-950 text-amber-300 px-2 py-1 rounded-lg font-mono font-bold">Kurtul!</span>
                  </button>

                  {/* Shoot Laser Button */}
                  <button
                    onClick={handleShootLaser}
                    disabled={laserCooldown > 0}
                    className={`w-full p-2.5 rounded-2xl font-black text-xs flex items-center justify-between border transition active:scale-95 cursor-pointer ${
                      laserCooldown > 0
                        ? 'bg-slate-900 border-slate-800 text-slate-500'
                        : 'bg-gradient-to-r from-pink-600 to-rose-600 text-white border-pink-400/50 shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Crosshair className="w-4 h-4 text-pink-200" />
                      <div className="text-left">
                        <div>💥 Kozmik Lazer</div>
                        <div className="text-[10px] text-pink-200/80">Düşmanlara ve hedeflere lazer ateşle</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono bg-slate-950 px-2 py-1 rounded-lg">[F]</span>
                  </button>

                  {/* Fishing Quick Action */}
                  <button
                    onClick={handleFishAction}
                    className="w-full p-2.5 bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 hover:from-sky-500 hover:to-blue-500 text-white font-black text-xs rounded-2xl border border-sky-300/60 shadow-md flex items-center justify-between transition active:scale-95 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Fish className="w-4 h-4 text-cyan-200" />
                      <div className="text-left">
                        <div>🎣 Balık Tut (Nehir & Gölet)</div>
                        <div className="text-[10px] text-cyan-100/80">Suların yanına gidip olta at</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-slate-950 text-cyan-300 px-2 py-1 rounded-lg font-mono">Olta</span>
                  </button>

                  {/* Toggle Companion Button */}
                  <button
                    onClick={handleToggleAlienCompanion}
                    className={`w-full p-2.5 rounded-2xl font-black text-xs flex items-center justify-between border transition active:scale-95 cursor-pointer ${
                      alienCompanionActive
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Smile className="w-4 h-4 text-emerald-400" />
                      <span>👽 Gezgin Uzaylı Dost (Companion)</span>
                    </div>
                    <span className="text-[10px] font-mono bg-slate-950 px-2 py-1 rounded-lg">[R]</span>
                  </button>

                  {/* Alien Quest Status */}
                  <div className="p-3 rounded-2xl bg-slate-900 border border-purple-500/30 flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-300 flex items-center gap-1.5 text-xs">
                      👽 Kurtarılan Uzaylı: {aliensRescued}/30
                    </span>
                    {aliensRescued >= 30 ? (
                      <span className="text-[10px] text-emerald-400 font-black flex items-center gap-1"><Unlock className="w-3 h-3" /> Kale Açık</span>
                    ) : (
                      <span className="text-[10px] text-amber-300 font-semibold flex items-center gap-1"><Lock className="w-3 h-3" /> Kilitli</span>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: SPRAY & EMOTES */}
              {activeTab === 'emotes' && (
                <div className="space-y-3">
                  {/* Spray Paint Box */}
                  <div className="p-3 rounded-2xl bg-slate-900/90 border border-teal-500/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-teal-300 flex items-center gap-1.5">
                        <Paintbrush className="w-4 h-4" />
                        <span>🎨 Renkli Sprey Boya ({activeSprayColor})</span>
                      </span>
                      <button
                        onClick={() => handleSprayPaint()}
                        className="px-3 py-1 bg-teal-500 text-slate-950 rounded-lg text-xs font-black shadow active:scale-95 cursor-pointer"
                      >
                        Spreyle [V]
                      </button>
                    </div>

                    {/* Colors */}
                    <div className="grid grid-cols-4 gap-1 max-h-28 overflow-y-auto">
                      {[
                        { id: 'green', name: '🟢 Yeşil', bg: 'bg-emerald-600 text-white' },
                        { id: 'purple', name: '🟣 Mor', bg: 'bg-purple-600 text-white' },
                        { id: 'gold', name: '🟡 Altın', bg: 'bg-amber-500 text-slate-950' },
                        { id: 'red', name: '🔴 Kırmızı', bg: 'bg-red-600 text-white' },
                        { id: 'blue', name: '🔵 Mavi', bg: 'bg-blue-600 text-white' },
                        { id: 'pink', name: '🌸 Pembe', bg: 'bg-pink-500 text-white' },
                        { id: 'orange', name: '🟠 Turuncu', bg: 'bg-orange-500 text-white' },
                        { id: 'white', name: '⚪ Beyaz', bg: 'bg-slate-100 text-slate-950' },
                        { id: 'cyan', name: '🌐 Turkuaz', bg: 'bg-cyan-500 text-slate-950' },
                        { id: 'lime', name: '🌿 Fıstık', bg: 'bg-lime-500 text-slate-950' },
                        { id: 'yellow', name: '🟡 Sarı', bg: 'bg-yellow-400 text-slate-950' },
                        { id: 'magenta', name: '🔮 Eflatun', bg: 'bg-fuchsia-500 text-white' },
                        { id: 'teal', name: '🌊 Teal', bg: 'bg-teal-600 text-white' },
                        { id: 'brown', name: '🟫 Kahve', bg: 'bg-amber-950 text-amber-200' },
                        { id: 'black', name: '🌑 Siyah', bg: 'bg-slate-900 text-white border border-slate-700' },
                        { id: 'indigo', name: '🌀 İndigo', bg: 'bg-indigo-600 text-white' },
                      ].map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setActiveSprayColor(c.id as any)}
                          className={`px-1.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer truncate ${
                            activeSprayColor === c.id
                              ? `${c.bg} ring-2 ring-white scale-105 shadow`
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>

                    {/* Shapes */}
                    <div className="grid grid-cols-4 gap-1">
                      {[
                        { id: 'circle', name: '⭕ Daire' },
                        { id: 'star', name: '⭐ Yıldız' },
                        { id: 'heart', name: '❤️ Kalp' },
                        { id: 'square', name: '⬜ Kare' },
                        { id: 'badge', name: '🛡️ Nişan' },
                        { id: 'triangle', name: '🔺 Üçgen' },
                        { id: 'diamond', name: '🔷 Elmas' },
                        { id: 'flower', name: '🌸 Çiçek' },
                      ].map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setActiveSprayShape(s.id as any)}
                          className={`px-1.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer truncate ${
                            activeSprayShape === s.id
                              ? 'bg-teal-600 text-white ring-2 ring-teal-300 shadow'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>

                    {/* Text input */}
                    <input
                      type="text"
                      value={sprayText}
                      onChange={(e) => setSprayText(e.target.value)}
                      placeholder="Sprey üzerine yazı (Maks 16 karakter)..."
                      maxLength={16}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>

                  {/* 26 Emojis & Moves */}
                  <div className="p-3 rounded-2xl bg-slate-900/90 border border-purple-500/40 space-y-2">
                    <div className="flex items-center justify-between text-xs text-purple-300 font-bold">
                      <span>✨ Karakter Emojileri & Hareketler (26 Efekt)</span>
                      <span className="text-[10px] text-slate-400">Tıkla ve Yap</span>
                    </div>
                    <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5 max-h-48 overflow-y-auto pr-1">
                      {[
                        { id: 'laugh', emoji: '😆', name: 'Gülme & Zıpla' },
                        { id: 'dance', emoji: '🕺', name: 'Dans Et' },
                        { id: 'crown', emoji: '👑', name: 'Kral Pozu' },
                        { id: 'sleep', emoji: '💤', name: 'Dinlen/Esne' },
                        { id: 'rocket', emoji: '🚀', name: 'Roket Fırlama' },
                        { id: 'heart', emoji: '❤️', name: 'Kalp Saç' },
                        { id: 'star', emoji: '🌟', name: 'Süper Yıldız' },
                        { id: 'ghost', emoji: '👻', name: 'Hayalet Titreşimi' },
                        { id: 'guitar', emoji: '🎸', name: 'Rockstar Gitar' },
                        { id: 'cat', emoji: '🐱', name: 'Kedi Mırıltısı' },
                        { id: 'pizza', emoji: '🍕', name: 'Pizza Ziyafeti' },
                        { id: 'freeze', emoji: '❄️', name: 'Buz Kristali' },
                        { id: 'fire', emoji: '🔥', name: 'Alev Patlaması' },
                        { id: 'cool', emoji: '🕶️', name: 'Havalı Gözlük' },
                        { id: 'unicorn', emoji: '🦄', name: 'Sihirli Unicorn' },
                        { id: 'lightning', emoji: '⚡', name: 'Şimşek Hızı' },
                        { id: 'diamond', emoji: '💎', name: 'Elmas Işıltısı' },
                        { id: 'ninja', emoji: '🥷', name: 'Ninja Taklası' },
                        { id: 'robot', emoji: '🤖', name: 'Robotik Dans' },
                        { id: 'dragon', emoji: '🐉', name: 'Ejderha Kükremesi' },
                        { id: 'balloon', emoji: '🎈', name: 'Havada Süzülme' },
                        { id: 'honey', emoji: '🍯', name: 'Bal Kavanozu' },
                        { id: 'coffee', emoji: '☕', name: 'Kahve Hızı' },
                        { id: 'bomb', emoji: '💣', name: 'Bomba Zıplaması' },
                        { id: 'ninja_cat', emoji: '🐱‍👤', name: 'Gölge Işınlanma' },
                        { id: 'lion', emoji: '🦁', name: 'Aslan Kükremesi' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleTriggerEmote(item.id)}
                          title={item.name}
                          className="p-2 bg-slate-800 hover:bg-purple-600/40 border border-slate-700 hover:border-purple-400 rounded-xl text-lg flex items-center justify-center transition active:scale-90 cursor-pointer shadow"
                        >
                          {item.emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SHOP & ADVENTURE */}
              {activeTab === 'shop' && (
                <div className="space-y-2.5">
                  {/* 38 Level Map Selector */}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (onOpenMapModal) onOpenMapModal();
                      else window.dispatchEvent(new CustomEvent('superbear:open-map-selector'));
                    }}
                    className="w-full p-3 bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white font-black text-xs rounded-2xl border border-sky-300 shadow-lg flex items-center justify-between transition active:scale-95 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">🗺️</span>
                      <div className="text-left">
                        <div className="font-black text-white text-xs sm:text-sm">Bölüm Haritası (14 Bölüm Açık)</div>
                        <div className="text-[10px] text-sky-100/80">Dünya, Uzay, Poneix ve Phelix Bölgeleri</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-slate-950 text-sky-300 px-2 py-1 rounded-lg font-mono font-bold">Harita</span>
                  </button>

                  {/* Bakkal Kedi Shop */}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (onOpenCatShop) onOpenCatShop();
                      else window.dispatchEvent(new CustomEvent('superbear:open-cat-shop'));
                    }}
                    className="w-full p-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-2xl border border-amber-300 shadow-lg flex items-center justify-between transition active:scale-95 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">🐱</span>
                      <div className="text-left">
                        <div className="font-black text-slate-950 text-xs sm:text-sm">Bakkal Kedi Capi Dükkanı</div>
                        <div className="text-[10px] text-slate-900 font-semibold">İksirler, Pelerinler ve Kozmik Eşyalar</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-slate-950 text-amber-300 px-2 py-1 rounded-lg font-mono">Dükkan</span>
                  </button>

                  {/* Şans Kutuları & Sandıklar (Loot Boxes) */}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.dispatchEvent(new CustomEvent('superbear:open-lootboxes'));
                    }}
                    className="w-full p-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-2xl border border-amber-200 shadow-lg flex items-center justify-between transition active:scale-95 cursor-pointer animate-pulse"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">🎁</span>
                      <div className="text-left">
                        <div className="font-black text-slate-950 text-xs sm:text-sm">Şans Kutuları & Sandıklar</div>
                        <div className="text-[10px] text-slate-900 font-bold">1x, 15x, Efsanevi 1 ve Efsanevi 5 Kutu</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-slate-950 text-amber-300 px-2 py-1 rounded-lg font-mono font-black">4 Paket</span>
                  </button>

                  {/* Retro Arcade Games */}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.dispatchEvent(new CustomEvent('superbear:open-arcade-games'));
                    }}
                    className="w-full p-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs rounded-2xl border border-purple-300 shadow-lg flex items-center justify-between transition active:scale-95 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">🕹️</span>
                      <div className="text-left">
                        <div className="font-black text-amber-300 text-xs sm:text-sm">Retro Arcade Günün Oyunları</div>
                        <div className="text-[10px] text-purple-200">Mini Atari Oyunları ve Skor Tablosu</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-slate-950 text-purple-300 px-2 py-1 rounded-lg font-mono">[J] Tuşu</span>
                  </button>

                  {/* Concept Drawings */}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenDrawingModal();
                    }}
                    className="w-full p-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs rounded-2xl border border-purple-400/50 flex items-center justify-between transition active:scale-95 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Eye className="w-5 h-5 text-cyan-300" />
                      <div className="text-left">
                        <div className="font-black text-white text-xs sm:text-sm">Konsept Çizim Galerisi</div>
                        <div className="text-[10px] text-cyan-200">6 Orijinal El Çizimi ve Hikaye Notları</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-slate-950 text-cyan-300 px-2 py-1 rounded-lg font-mono">Çizimler</span>
                  </button>
                </div>
              )}

              {/* TAB 4: DEVICE & SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-3">
                  {/* Device Mode Selector */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
                    <div className="text-xs font-bold text-slate-300">Cihaz ve Yönlendirme Modu:</div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          if (onOpenDeviceSelector) {
                            setIsMenuOpen(false);
                            onOpenDeviceSelector();
                          }
                        }}
                        className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition active:scale-95 cursor-pointer ${
                          controlMode === 'touch'
                            ? 'bg-emerald-950/60 border-emerald-400 ring-2 ring-emerald-500/30 text-white'
                            : 'bg-slate-800/80 border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Smartphone className="w-6 h-6 text-emerald-400" />
                          {controlMode === 'touch' && <Check className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <div className="mt-2">
                          <div className="font-black text-xs">📱 Tablet & Telefon</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">Parmağınla sürükle & yönlendir</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          if (onOpenDeviceSelector) {
                            setIsMenuOpen(false);
                            onOpenDeviceSelector();
                          }
                        }}
                        className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition active:scale-95 cursor-pointer ${
                          controlMode === 'mouse'
                            ? 'bg-indigo-950/60 border-indigo-400 ring-2 ring-indigo-500/30 text-white'
                            : 'bg-slate-800/80 border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Monitor className="w-6 h-6 text-indigo-400" />
                          {controlMode === 'mouse' && <Check className="w-4 h-4 text-indigo-400" />}
                        </div>
                        <div className="mt-2">
                          <div className="font-black text-xs">💻 Bilgisayar (PC)</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">Fareyle sürükle & WASD tuşları</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Performance / FPS Profile Toggle */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
                    <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span>Performans & FPS Modu:</span>
                      <span className="text-[10px] text-amber-400 font-mono font-bold">
                        {perfProfile === 'smooth60' ? '60 FPS Akıcı' : perfProfile === 'ultra' ? 'Ultra Kalite' : 'Dengeli'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'smooth60' as QualityProfile, label: '⚡ 60 FPS (Akıcı)', desc: 'Tablet ve telefonlar için sıfır kasma' },
                        { id: 'balanced' as QualityProfile, label: '⚖️ Dengeli', desc: 'Orta seviye cihazlar' },
                        { id: 'ultra' as QualityProfile, label: '💎 Ultra HD', desc: 'Güçlü bilgisayarlar' },
                      ].map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setPerfProfile(p.id);
                            optimizeGameRenderer(p.id);
                          }}
                          className={`p-2 rounded-xl border text-left text-xs font-bold transition active:scale-95 cursor-pointer ${
                            perfProfile === p.id
                              ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md font-black'
                              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                          }`}
                        >
                          <div>{p.label}</div>
                          <div className={`text-[9px] mt-0.5 ${perfProfile === p.id ? 'text-slate-900' : 'text-slate-500'}`}>{p.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* Horizontal Expandable Superpower Action Dock (Opens horizontally to the left of the button cluster) */}
      {isPowersRackOpen && (
        <div className="fixed bottom-5 right-20 sm:right-24 z-[85] pointer-events-auto max-w-[calc(100vw-95px)] sm:max-w-2xl bg-slate-950/95 border-2 border-purple-400/80 rounded-2xl p-2 sm:p-2.5 shadow-2xl backdrop-blur-xl animate-in slide-in-from-right-4 duration-200 text-slate-100 flex flex-col gap-1.5 select-none">
          {/* Header */}
          <div className="flex items-center justify-between px-1 pb-1 border-b border-purple-500/30">
            <div className="flex items-center gap-1.5 font-black text-xs text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-300 to-cyan-300">
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
              <span>⚡ KOZMİK GÜÇLER (Yatay Seçim)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-purple-300 font-bold hidden sm:inline">👈 Sağa/Sola Kaydır</span>
              <button
                onClick={() => setIsPowersRackOpen(false)}
                className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs transition cursor-pointer"
                aria-label="Kapat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Horizontal Scrollable Power Items Row */}
          <div className="flex flex-row items-center gap-2 overflow-x-auto py-1 px-0.5 scrollbar-thin scroll-smooth">
            {Object.keys(powerDefinitions).map((key) => {
              const power = powerDefinitions[key];
              const isSelected = selectedPowerId === power.id;
              return (
                <button
                  key={power.id}
                  onClick={() => selectAndExecutePower(power.id)}
                  className={`flex-shrink-0 min-w-[105px] sm:min-w-[120px] p-2 rounded-xl text-left border flex flex-col justify-between transition active:scale-95 cursor-pointer select-none ${
                    isSelected
                      ? 'bg-gradient-to-br from-amber-500 to-yellow-600 text-slate-950 border-yellow-200 ring-2 ring-yellow-300 shadow-lg font-black'
                      : 'bg-slate-900/95 hover:bg-slate-800 border-slate-700 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-lg leading-none">{power.emoji}</span>
                    <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-slate-950/60 opacity-80">{power.keyHint}</span>
                  </div>
                  <div className="mt-1 font-bold text-xs truncate leading-tight">{power.name}</div>
                  <div className="text-[9px] opacity-75 truncate">{power.shortLabel}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Vertical Round Button Cluster (Anchored bottom right) */}
      <div className="fixed bottom-5 right-4 sm:right-6 z-[80] flex flex-col items-end gap-3 pointer-events-none select-none">

        {/* Vertical Stack of Circular Action Buttons (Ordered bottom-up) */}
        <div className="flex flex-col-reverse items-center gap-3">
          
          {/* 1. Primary Jump Button (Bottom) */}
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleJump();
              if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
            }}
            onClick={() => {
              handleJump();
              if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
            }}
            className="pointer-events-auto w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 via-sky-500 to-blue-600 text-slate-950 border-2 border-cyan-100 shadow-2xl flex flex-col items-center justify-center font-black active:scale-90 transition transform cursor-pointer hover:scale-105 ring-4 ring-sky-400/30"
            title="Zıpla [Space / A]"
          >
            <span className="text-xl leading-none">🦘</span>
            <span className="text-[9px] font-black mt-0.5">ZIPLA</span>
          </button>

          {/* 2. Attack / Vur Button */}
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAttack();
              if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
            }}
            onClick={() => {
              handleAttack();
              if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
            }}
            className="pointer-events-auto w-14 h-14 rounded-full bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 text-white border-2 border-rose-200 shadow-xl flex flex-col items-center justify-center font-black active:scale-90 transition transform cursor-pointer hover:scale-105"
            title="Saldırı / Vur [B]"
          >
            <span className="text-lg leading-none">⚔️</span>
            <span className="text-[8px] font-black mt-0.5">VUR</span>
          </button>

          {/* 3. Interaction Button [E] (ONLY visible when near an interactable target!) */}
          {isNearInteractable && (
            <button
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleInteract();
                if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
              }}
              onClick={() => {
                handleInteract();
                if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
              }}
              className="pointer-events-auto w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-400 to-orange-500 text-slate-950 border-2 border-yellow-100 shadow-2xl flex flex-col items-center justify-center font-black active:scale-90 transition transform cursor-pointer hover:scale-105 animate-bounce"
              title="Etkileşim / Konuş / Dükkan Aç [E]"
            >
              <span className="text-lg leading-none">💬</span>
              <span className="text-[9px] font-black mt-0.5">[E]</span>
            </button>
          )}

          {/* 4. Dynamic Selected Power Button (Shows current selected power) */}
          {selectedPowerId && powerDefinitions[selectedPowerId] && (
            <button
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const def = powerDefinitions[selectedPowerId];
                if (def) def.handler();
                if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
              }}
              onClick={() => {
                const def = powerDefinitions[selectedPowerId];
                if (def) def.handler();
                if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
              }}
              className={`pointer-events-auto w-14 h-14 rounded-full bg-gradient-to-tr ${powerDefinitions[selectedPowerId].bgClass} border-2 ${powerDefinitions[selectedPowerId].borderClass} shadow-xl flex flex-col items-center justify-center font-black active:scale-90 transition transform cursor-pointer animate-in zoom-in-95 duration-150 hover:brightness-110`}
              title={`Seçili Güç: ${powerDefinitions[selectedPowerId].name}`}
            >
              <span className="text-base leading-none">{powerDefinitions[selectedPowerId].emoji}</span>
              <span className="text-[8px] font-extrabold max-w-[46px] truncate leading-none mt-0.5">{powerDefinitions[selectedPowerId].shortLabel}</span>
            </button>
          )}

          {/* 5. Powers Rack Menu Trigger Button (Top of Stack) */}
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsPowersRackOpen((prev) => !prev);
            }}
            onClick={() => setIsPowersRackOpen((prev) => !prev)}
            className="pointer-events-auto w-13 h-13 rounded-full bg-gradient-to-tr from-purple-700 via-indigo-600 to-amber-500 text-white border-2 border-yellow-300 shadow-xl flex flex-col items-center justify-center font-black active:scale-90 transition transform cursor-pointer hover:scale-105"
            title="Güç Seçim Menüsünü Aç / Kapat"
          >
            <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300 animate-pulse" />
            <span className="text-[8px] font-black leading-none mt-0.5">GÜÇLER</span>
          </button>

        </div>
      </div>
    </>
  );
};
