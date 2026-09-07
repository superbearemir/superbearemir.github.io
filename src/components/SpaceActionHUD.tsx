import React, { useState, useRef, useEffect } from 'react';
import { 
  Rocket, 
  Zap, 
  Paintbrush, 
  Smile, 
  Globe, 
  Crosshair, 
  Lock, 
  Unlock, 
  Eye, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  X,
  Compass,
  Fish,
  Move,
  GripVertical
} from 'lucide-react';

interface SpaceActionHUDProps {
  onOpenDrawingModal: () => void;
  onOpenCatShop?: () => void;
  onOpenMapModal?: () => void;
  aliensRescued?: number;
}

export const SpaceActionHUD: React.FC<SpaceActionHUDProps> = ({
  onOpenDrawingModal,
  onOpenCatShop,
  onOpenMapModal,
  aliensRescued = 0,
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
  const [activeTab, setActiveTab] = useState<'powers' | 'shop'>('powers');

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

  // Draggable state: initialized right next to the top menu bar (top-left offset)
  const [pos, setPos] = useState<{ x: number; y: number }>(() => {
    return { x: 190, y: 12 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number; moved: boolean }>({
    startX: 0,
    startY: 0,
    initialX: 190,
    initialY: 12,
    moved: false,
  });

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    dragStartRef.current = {
      startX: clientX,
      startY: clientY,
      initialX: pos.x,
      initialY: pos.y,
      moved: false,
    };
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - dragStartRef.current.startX;
      const deltaY = clientY - dragStartRef.current.startY;

      if (Math.hypot(deltaX, deltaY) > 4) {
        dragStartRef.current.moved = true;
      }

      // Constrain within screen bounds
      const maxX = Math.max(10, window.innerWidth - 70);
      const maxY = Math.max(10, window.innerHeight - 70);

      const newX = Math.min(Math.max(10, dragStartRef.current.initialX + deltaX), maxX);
      const newY = Math.min(Math.max(10, dragStartRef.current.initialY + deltaY), maxY);

      setPos({ x: newX, y: newY });
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  const handleToggleClick = (e: React.MouseEvent) => {
    // If it was a drag gesture, do not toggle the menu
    if (dragStartRef.current.moved) {
      e.stopPropagation();
      return;
    }
    setIsMenuOpen(!isMenuOpen);
  };

  const handleJump = () => {
    const enhancer = (window as any).__superBearSpaceEnhancer;
    if (enhancer && enhancer.triggerJump) {
      enhancer.triggerJump();
    } else {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', key: ' ' }));
      setTimeout(() => {
        window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space', key: ' ' }));
      }, 200);
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
        game.callbacks.onShowNotice("🚀 UZAY ROKETİ FIRLATILDI! (Art arda tıklayarak yükselebilirsin! ⚠️ Speedrun geçersiz sayılır)", "warning");
      }
    }
    if (enhancer && enhancer.triggerEmote) {
      enhancer.triggerEmote('rocket');
    }
  };

  const handleTeleportToSpace = () => {
    const enhancer = (window as any).__superBearSpaceEnhancer;
    if (enhancer && enhancer.teleportToSpace) enhancer.teleportToSpace();
  };

  const handleFishAction = () => {
    const enhancer = (window as any).__superBearSpaceEnhancer;
    if (enhancer && enhancer.triggerFishing) {
      enhancer.triggerFishing();
    } else {
      window.dispatchEvent(new CustomEvent('superbear:action-trigger', { detail: 'fish' }));
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

  return (
    <div className="fixed inset-0 pointer-events-none z-[80] select-none">
      
      {/* Floating Action Menu Container (Draggable anywhere on screen with mouse & touch) */}
      <div 
        style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
        className="pointer-events-auto fixed z-[90] flex flex-col items-start gap-1.5 max-w-[calc(100vw-20px)]"
      >
        
        {/* Toggle Button with Drag Handle & 20:00 Trailer Direct Action Button */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            onClick={handleToggleClick}
            className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-700 via-indigo-700 to-slate-900 text-white font-black text-[11px] sm:text-xs flex items-center gap-1.5 sm:gap-2 border border-purple-400/60 shadow-2xl backdrop-blur-lg transition active:scale-95 touch-manipulation select-none ${
              isDragging ? 'cursor-grabbing opacity-90 ring-2 ring-purple-400' : 'cursor-grab hover:from-purple-600 hover:via-indigo-600'
            }`}
            title="Tıkla aç/kapat veya basılı tutarak sürükle"
          >
            <GripVertical className="w-3.5 h-3.5 text-purple-300 opacity-80" />
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 animate-pulse" />
            <span>🌌 Uzay Güçleri & Menü</span>
            {isMenuOpen ? <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

          {/* Direct 20:00 Underground Trailer Button */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('superbear:open-trailer'))}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 hover:from-red-500 hover:to-orange-400 text-white font-black text-[11px] sm:text-xs flex items-center gap-1.5 border border-amber-300/80 shadow-2xl backdrop-blur-lg transition active:scale-95 cursor-pointer animate-pulse"
            title="5 Dakikalık 20:00 Yeraltı Dünyası Fragmanını İzle (Kısayol: H)"
          >
            <span className="text-sm">🌋</span>
            <span>20:00 Fragmanı</span>
            <span className="px-1.5 py-0.2 bg-slate-950 text-amber-300 rounded text-[9px] font-mono">[H]</span>
          </button>
        </div>

        {/* Collapsible Mobile-Friendly Panel (Strictly bounded with max-height and scrolling) */}
        {isMenuOpen && (
          <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-950/95 border-2 border-purple-500/60 shadow-2xl backdrop-blur-xl flex flex-col gap-2 w-64 sm:w-72 max-h-[70vh] sm:max-h-[80vh] overflow-y-auto overscroll-contain animate-in fade-in slide-in-from-top-2 duration-200 text-slate-100 touch-pan-y select-none">
            
            {/* Draggable Header with Close button */}
            <div 
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
              className={`flex items-center justify-between pb-1.5 border-b border-purple-500/30 sticky top-0 bg-slate-950/95 z-10 select-none ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab hover:bg-slate-900/60'
              } p-1 -m-1 rounded-t-xl transition-colors`}
              title="Basılı tutarak menüyü ekranda istediğin yere taşı"
            >
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-black text-purple-300">
                <Move className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                <Rocket className="w-3.5 h-3.5 text-amber-400" />
                <span>Macera & Güçler</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[9px] text-slate-400 font-mono hidden sm:inline px-1 py-0.5 rounded bg-slate-900 border border-slate-800">
                  Taşı ✥
                </span>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer active:scale-90"
                  aria-label="Kapat"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Category Tabs for Easy Touch Navigation */}
            <div className="grid grid-cols-2 gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('powers')}
                className={`py-1 rounded-lg text-[10px] font-black transition-colors ${
                  activeTab === 'powers' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ⚡ Güçler & Aksiyon
              </button>
              <button
                onClick={() => setActiveTab('shop')}
                className={`py-1 rounded-lg text-[10px] font-black transition-colors ${
                  activeTab === 'shop' ? 'bg-amber-600 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🏪 Dükkan & Çizimler
              </button>
            </div>

            {/* TAB 1: POWERS & ACTIONS */}
            {activeTab === 'powers' && (
              <div className="flex flex-col gap-1.5">
                {/* 20:00 Underground Trailer Banner Action */}
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('superbear:open-trailer'))}
                  className="w-full px-2.5 py-2 rounded-xl bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 hover:from-red-500 hover:to-orange-400 text-white font-black text-xs border border-amber-300 shadow-lg shadow-red-600/30 flex items-center justify-between transition active:scale-95 cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-base animate-bounce">🌋</span>
                    <span className="leading-tight text-left">
                      <span className="block font-black text-yellow-200">20:00 Fragmanı (5 Dk)</span>
                      <span className="text-[10px] text-amber-100/80 font-normal">9 Yeraltı Bölümü & Zemin Yarığı</span>
                    </span>
                  </div>
                  <span className="text-[9px] bg-slate-950 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">İZLE [H]</span>
                </button>

                {/* Triple Jump 1-Click Unlock / Toggle */}
                <button
                  onClick={handleToggleTripleJump}
                  className={`w-full px-2.5 py-1.5 rounded-xl font-black text-xs flex items-center justify-between border transition active:scale-95 cursor-pointer ${
                    tripleJumpUnlocked
                      ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/20 ring-1 ring-amber-300'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                  title="3 Kere Zıplama Özelliğini Tekte Aç / Kapat"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">🦘</span>
                    <span>3 Kere Zıplayıcı (Triple Jump)</span>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-black font-mono ${
                    tripleJumpUnlocked ? 'bg-slate-950 text-amber-300' : 'bg-slate-900 text-slate-500'
                  }`}>
                    {tripleJumpUnlocked ? 'AÇIK (3x)' : 'KAPALI'}
                  </span>
                </button>

                {/* Fishing Quick Action */}
                <button
                  onClick={handleFishAction}
                  className="w-full px-2.5 py-1.5 bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 hover:from-sky-500 hover:to-blue-500 text-white font-black text-xs rounded-xl border border-sky-300/60 shadow-md flex items-center justify-between transition active:scale-95 cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <Fish className="w-3.5 h-3.5 text-cyan-200" />
                    <span>🎣 Balık Tut (Nehir / Gölet)</span>
                  </div>
                  <span className="text-[9px] bg-slate-950 text-cyan-300 px-1 py-0.2 rounded font-mono">Olta</span>
                </button>

                {/* Teleport Dash Button */}
                <button
                  onClick={handleTeleportDash}
                  disabled={teleportCooldown > 0}
                  className={`w-full px-2.5 py-1.5 rounded-xl font-black text-xs flex items-center justify-between border transition active:scale-95 cursor-pointer ${
                    teleportCooldown > 0
                      ? 'bg-slate-800 border-slate-700 text-slate-500'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400/50 shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-cyan-300" />
                    <span>⚡ Hızlı Işınlanma</span>
                  </div>
                  <span className="text-[9px] font-mono opacity-80">[T]</span>
                </button>

                {/* Space Rocket Escape Booster */}
                <button
                  onClick={handleRocketEscape}
                  className="w-full px-2.5 py-2 rounded-xl font-black text-xs flex items-center justify-between border bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white border-amber-400/80 shadow-lg shadow-orange-600/30 transition active:scale-95 cursor-pointer"
                  title="Geçemediğiniz bir yer olursa art arda tıklayarak roketle kurtulabilirsiniz! (Speedrun geçersiz sayılır)"
                >
                  <div className="flex items-center gap-1.5">
                    <Rocket className="w-4 h-4 text-yellow-300 animate-bounce" />
                    <span>🚀 Uzay Roketi (Kurtulma Gücü)</span>
                  </div>
                  <span className="text-[9px] bg-slate-950 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">Kurtul!</span>
                </button>

                {/* Shoot Laser Button */}
                <button
                  onClick={handleShootLaser}
                  disabled={laserCooldown > 0}
                  className={`w-full px-2.5 py-1.5 rounded-xl font-black text-xs flex items-center justify-between border transition active:scale-95 cursor-pointer ${
                    laserCooldown > 0
                      ? 'bg-slate-800 border-slate-700 text-slate-500'
                      : 'bg-gradient-to-r from-pink-600 to-rose-600 text-white border-pink-400/50 shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Crosshair className="w-3.5 h-3.5 text-pink-200" />
                    <span>💥 Kozmik Lazer</span>
                  </div>
                  <span className="text-[9px] font-mono opacity-80">[F]</span>
                </button>

                 {/* Spray Paint Selector */}
                <div className="relative w-full">
                  <button
                    onClick={() => setShowSprayMenu(!showSprayMenu)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-black text-xs flex items-center justify-between border border-teal-400/50 shadow-md active:scale-95 cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <Paintbrush className="w-3.5 h-3.5 text-emerald-200" />
                      <span>🎨 Sprey Düzenleyici ({activeSprayColor})</span>
                    </div>
                    <span className="text-[9px] font-mono opacity-80">[V]</span>
                  </button>

                  {showSprayMenu && (
                    <div className="mt-1.5 p-2 rounded-xl bg-slate-950/95 border border-emerald-500/30 flex flex-col gap-2 w-full shadow-xl">
                      {/* 1. Colors Select */}
                      <div>
                        <div className="text-[9px] text-slate-400 font-bold mb-1">Renk Seçenekleri / Colors (16):</div>
                        <div className="grid grid-cols-4 gap-1 max-h-[140px] overflow-y-auto pr-1">
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
                              className={`px-1 py-1 rounded text-[9px] font-black transition-all cursor-pointer truncate ${
                                activeSprayColor === c.id
                                  ? `${c.bg} ring-2 ring-white scale-105 shadow-md`
                                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              {c.name.split(' ')[1]}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 2. Shapes Select */}
                      <div>
                        <div className="text-[9px] text-slate-400 font-bold mb-1">Çizim Şekli / Shape (11):</div>
                        <div className="grid grid-cols-4 gap-1 max-h-[110px] overflow-y-auto pr-1">
                          {[
                            { id: 'circle', name: '⭕ Daire' },
                            { id: 'star', name: '⭐ Yıldız' },
                            { id: 'heart', name: '❤️ Kalp' },
                            { id: 'square', name: '⬜ Kare' },
                            { id: 'badge', name: '🛡️ Nişan' },
                            { id: 'triangle', name: '🔺 Üçgen' },
                            { id: 'diamond', name: '🔷 Elmas' },
                            { id: 'crescent', name: '🌙 Hilal' },
                            { id: 'ring', name: '🍩 Halka' },
                            { id: 'flower', name: '🌸 Çiçek' },
                            { id: 'cross', name: '➕ Artı' },
                          ].map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => setActiveSprayShape(s.id as any)}
                              className={`px-1 py-1 rounded text-[9px] font-black transition-all cursor-pointer truncate ${
                                activeSprayShape === s.id
                                  ? 'bg-teal-600 text-white ring-2 ring-teal-300 scale-105 shadow-md'
                                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              {s.name.split(' ')[1]}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 3. Text Overlay Input */}
                      <div>
                        <div className="text-[9px] text-slate-400 font-bold mb-1">Sprey Üzerine Yazı (Maks 16 karakter):</div>
                        <input
                          type="text"
                          value={sprayText}
                          onChange={(e) => setSprayText(e.target.value)}
                          placeholder="Yazı yazın..."
                          maxLength={16}
                          className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] text-white focus:outline-none focus:border-teal-500 font-semibold"
                        />
                      </div>

                      {/* 4. Action Button */}
                      <button
                        type="button"
                        onClick={() => {
                          handleSprayPaint();
                          setShowSprayMenu(false);
                        }}
                        className="w-full py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-lg shadow-md active:scale-95 transition cursor-pointer flex items-center justify-center gap-1"
                      >
                        🖌️ ÇİZİMİ SPREYLE / SPRAY NOW
                      </button>
                    </div>
                  )}
                </div>

                {/* Emoji Reactions & Emotes Section (26 Emojis) */}
                <div className="w-full bg-slate-900/90 border border-purple-500/30 rounded-xl p-2 shadow-md">
                  <div className="text-[9px] text-purple-300 font-bold mb-1.5 flex items-center justify-between">
                    <span>✨ Karakter Emojileri & Hareketler (26 Efekt)</span>
                    <span className="text-[8px] text-slate-400">Özel Animasyonlu</span>
                  </div>
                  <div className="grid grid-cols-9 gap-1 max-h-36 overflow-y-auto pr-1">
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
                        className="p-1.5 bg-slate-800 hover:bg-purple-600/40 border border-slate-700 hover:border-purple-400 rounded-lg text-sm flex items-center justify-center transition active:scale-90 cursor-pointer shadow"
                      >
                        {item.emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggle Companion Button */}
                <button
                  onClick={handleToggleAlienCompanion}
                  className={`w-full px-2.5 py-1.5 rounded-xl font-black text-xs flex items-center justify-between border transition active:scale-95 cursor-pointer ${
                    alienCompanionActive
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Smile className="w-3.5 h-3.5 text-emerald-400" />
                    <span>👽 Gezgin Uzaylı Dost</span>
                  </div>
                  <span className="text-[9px] font-mono opacity-80">[R]</span>
                </button>

                {/* Jump Fallback Button */}
                <button
                  onClick={handleJump}
                  className="w-full px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] flex items-center justify-between border border-slate-700 active:scale-95 cursor-pointer"
                >
                  <span>🦘 Zıpla / Jump</span>
                  <span className="text-[9px] font-mono opacity-60">Space</span>
                </button>

                {/* Alien Quest Status */}
                <div className="p-2 rounded-xl bg-slate-900 border border-purple-500/30 flex items-center justify-between text-xs mt-1">
                  <span className="font-bold text-emerald-300 flex items-center gap-1 text-[10px]">
                    👽 Kurtarılan Uzaylı: {aliensRescued}/30
                  </span>
                  {aliensRescued >= 30 ? (
                    <span className="text-[9px] text-emerald-400 font-black flex items-center gap-1"><Unlock className="w-2.5 h-2.5" /> Kale Açık</span>
                  ) : (
                    <span className="text-[9px] text-amber-300 font-semibold flex items-center gap-1"><Lock className="w-2.5 h-2.5" /> Kilitli</span>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: DÜKKAN & EKSTRALAR */}
            {activeTab === 'shop' && (
              <div className="flex flex-col gap-1.5">
                {/* 38 Level Map Selector Button (Dünya + Uzay + Poneix + Phelix) */}
                <button
                  onClick={() => {
                    if (onOpenMapModal) onOpenMapModal();
                    else window.dispatchEvent(new CustomEvent('superbear:open-map-selector'));
                  }}
                  className="w-full px-2.5 py-1.5 bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white font-black text-xs rounded-xl border border-sky-300 shadow-lg flex items-center justify-between transition active:scale-95 cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">🗺️</span>
                    <span>Tüm Harita (Dünya, Uzay, Poneix, Phelix)</span>
                  </div>
                  <span className="text-[9px] bg-slate-950 text-sky-300 px-1 py-0.2 rounded font-mono font-bold">38 Bölge</span>
                </button>

                {/* Bakkal Kedi Shop */}
                <button
                  onClick={() => {
                    if (onOpenCatShop) onOpenCatShop();
                    else window.dispatchEvent(new CustomEvent('superbear:open-cat-shop'));
                  }}
                  className="w-full px-2.5 py-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl border border-amber-300 shadow-lg flex items-center justify-between transition active:scale-95 cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">🐱</span>
                    <span>Bakkal Kedi Capitoolos</span>
                  </div>
                  <span className="text-[9px] bg-slate-950 text-amber-300 px-1 py-0.2 rounded font-mono">Dükkan</span>
                </button>

                {/* Concept Drawings */}
                <button
                  onClick={onOpenDrawingModal}
                  className="w-full px-2.5 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs rounded-xl border border-purple-400/50 flex items-center justify-between transition active:scale-95 cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-cyan-300" />
                    <span>🎨 Konsept Çizimler</span>
                  </div>
                  <span className="text-[9px] bg-slate-950 text-cyan-300 px-1 py-0.2 rounded font-mono">6 Çizim</span>
                </button>

                {/* 15. Bölüm: Arıların Çölü Teleport */}
                <button
                  onClick={() => {
                    const enhancer = (window as any).__superBearSpaceEnhancer;
                    if (enhancer && enhancer.teleportToBeeDesert) {
                      enhancer.teleportToBeeDesert();
                    } else {
                      window.dispatchEvent(new CustomEvent('superbear:teleport-bee-desert'));
                    }
                  }}
                  className="w-full px-2.5 py-1.5 bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-slate-950 font-black text-xs rounded-xl border border-amber-300 shadow-md flex items-center justify-between transition active:scale-95 cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">🏜️</span>
                    <span>15. Bölüm: Arıların Çölü</span>
                  </div>
                  <span className="text-[9px] bg-slate-950 text-amber-300 px-1 py-0.2 rounded font-mono">Çöl & Piramit</span>
                </button>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
};
