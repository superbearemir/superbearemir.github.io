import React, { useEffect, useRef, useState } from 'react';
import { ControlMode } from './DeviceSelectionModal';
import { QualityProfile, optimizeGameRenderer } from '../utils/mobilePerformanceOptimizer';
import { Smartphone, Monitor, Zap, RefreshCw, Sparkles, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface TouchDragControllerProps {
  mode?: ControlMode;
  controlMode?: ControlMode;
  onSwitchMode?: () => void;
  onOpenDeviceSelector?: () => void;
}

export const TouchDragController: React.FC<TouchDragControllerProps> = ({
  mode,
  controlMode: controlModeProp,
  onSwitchMode,
  onOpenDeviceSelector,
}) => {
  const activeMode: ControlMode = mode || controlModeProp || 'touch';
  const handleOpenSelector = onSwitchMode || onOpenDeviceSelector || (() => {});

  const [perfProfile, setPerfProfile] = useState<QualityProfile>(() => {
    return (localStorage.getItem('super_bear_perf_profile') as QualityProfile) || 'smooth60';
  });

  const togglePerformanceProfile = () => {
    const nextProfile: QualityProfile = perfProfile === 'smooth60' ? 'ultra' : perfProfile === 'ultra' ? 'balanced' : 'smooth60';
    setPerfProfile(nextProfile);
    optimizeGameRenderer(nextProfile);
  };
  const [isLeftTouching, setIsLeftTouching] = useState(false);
  const [touchPos, setTouchPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const joystickOriginRef = useRef<{ x: number; y: number } | null>(null);
  const isRightDraggingRef = useRef(false);
  const rightDragLastPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Mouse Drag state for PC mode
  const isMouseDownRef = useRef(false);
  const mouseStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Touch handlers for the full game viewport
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      // Don't capture touches on open modals or interactive inputs
      const target = e.target as HTMLElement;
      if (target.closest('button, input, textarea, .modal-content, [role="dialog"]')) {
        return;
      }

      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const screenWidth = window.innerWidth;

        // Left half of the screen -> Movement Drag Steering
        if (touch.clientX < screenWidth * 0.55) {
          joystickOriginRef.current = { x: touch.clientX, y: touch.clientY };
          setTouchStartPos({ x: touch.clientX, y: touch.clientY });
          setTouchPos({ x: touch.clientX, y: touch.clientY });
          setIsLeftTouching(true);
        } else {
          // Right half of the screen -> Camera / Aiming Drag
          isRightDraggingRef.current = true;
          rightDragLastPosRef.current = { x: touch.clientX, y: touch.clientY };
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const game = (window as any).__superBearGame;

      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];

        // 1. Movement Drag (Left Side)
        if (joystickOriginRef.current) {
          const origin = joystickOriginRef.current;
          const dx = touch.clientX - origin.x;
          const dy = touch.clientY - origin.y;
          const maxRadius = 60;
          const dist = Math.hypot(dx, dy);
          const angle = Math.atan2(dy, dx);
          const clampedDist = Math.min(dist, maxRadius);

          const curX = origin.x + Math.cos(angle) * clampedDist;
          const curY = origin.y + Math.sin(angle) * clampedDist;
          setTouchPos({ x: curX, y: curY });

          const normX = (Math.cos(angle) * (clampedDist / maxRadius));
          const normY = (Math.sin(angle) * (clampedDist / maxRadius));

          if (game) {
            game.joystickX = normX;
            game.joystickY = normY;
            if (game.inputs) {
              game.inputs.left = normX < -0.25;
              game.inputs.right = normX > 0.25;
              game.inputs.forward = normY < -0.25;
              game.inputs.backward = normY > 0.25;
            }
          }
        }

        // 2. Camera Drag (Right Side)
        if (isRightDraggingRef.current) {
          const deltaX = touch.clientX - rightDragLastPosRef.current.x;
          const deltaY = touch.clientY - rightDragLastPosRef.current.y;
          rightDragLastPosRef.current = { x: touch.clientX, y: touch.clientY };

          if (game) {
            if (game.camYaw !== undefined) game.camYaw += deltaX * 0.008;
            if (game.camPitch !== undefined) {
              game.camPitch = Math.max(-0.4, Math.min(0.8, game.camPitch - deltaY * 0.006));
            }
          }
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const remainingTouches = e.touches;
      let leftStillActive = false;
      let rightStillActive = false;

      for (let i = 0; i < remainingTouches.length; i++) {
        const t = remainingTouches[i];
        if (t.clientX < window.innerWidth * 0.55) leftStillActive = true;
        else rightStillActive = true;
      }

      if (!leftStillActive) {
        joystickOriginRef.current = null;
        setIsLeftTouching(false);
        const game = (window as any).__superBearGame;
        if (game) {
          game.joystickX = 0;
          game.joystickY = 0;
          if (game.inputs) {
            game.inputs.left = false;
            game.inputs.right = false;
            game.inputs.forward = false;
            game.inputs.backward = false;
          }
        }
      }

      if (!rightStillActive) {
        isRightDraggingRef.current = false;
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  // Mouse Drag Steering for PC / Computer Mode
  useEffect(() => {
    if (activeMode !== 'mouse') return;

    const handleMouseDown = (e: MouseEvent) => {
      // Only drag if left click on canvas or game area
      const target = e.target as HTMLElement;
      if (target.closest('button, input, textarea, .modal-content, [role="dialog"], a')) {
        return;
      }

      isMouseDownRef.current = true;
      mouseStartPosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDownRef.current) return;
      const game = (window as any).__superBearGame;
      if (!game) return;

      const deltaX = e.clientX - mouseStartPosRef.current.x;
      const deltaY = e.clientY - mouseStartPosRef.current.y;
      mouseStartPosRef.current = { x: e.clientX, y: e.clientY };

      // Camera Yaw and Pitch adjustment on drag
      if (game.camYaw !== undefined) game.camYaw += deltaX * 0.006;
      if (game.camPitch !== undefined) {
        game.camPitch = Math.max(-0.4, Math.min(0.8, game.camPitch - deltaY * 0.005));
      }
    };

    const handleMouseUp = () => {
      isMouseDownRef.current = false;
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [activeMode]);

  // Action Triggers
  const handleJump = () => {
    const game = (window as any).__superBearGame;
    if (game && game.handleJump) {
      game.handleJump();
    } else {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', key: ' ' }));
      setTimeout(() => {
        window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space', key: ' ' }));
      }, 150);
    }
  };

  const handleAttack = () => {
    const game = (window as any).__superBearGame;
    if (game && game.handleAttack) {
      game.handleAttack();
    } else {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyE', key: 'e' }));
      setTimeout(() => {
        window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyE', key: 'e' }));
      }, 150);
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

  const handleLaser = () => {
    const enhancer = (window as any).__superBearSpaceEnhancer;
    if (enhancer && enhancer.shootLaser) {
      enhancer.shootLaser();
    }
  };

  return (
    <>
      {/* Top Header Mode Indicator & Quick Switch Badge */}
      <div className="fixed top-3 right-4 z-[90] flex items-center gap-2 pointer-events-auto">
        {/* Anti-Lag / 60 FPS Performance Toggle */}
        <button
          onClick={togglePerformanceProfile}
          title="Performans ve FPS Modunu Değiştir"
          className="px-2.5 py-1.5 rounded-full bg-slate-900/90 text-white border border-slate-700 hover:border-amber-400 shadow-md backdrop-blur-md flex items-center gap-1.5 text-xs font-black transition transform active:scale-95 cursor-pointer hover:bg-slate-800"
        >
          <Zap className={`w-3.5 h-3.5 ${perfProfile === 'smooth60' ? 'text-amber-400 animate-pulse' : perfProfile === 'ultra' ? 'text-cyan-400' : 'text-emerald-400'}`} />
          <span className="hidden sm:inline">
            {perfProfile === 'smooth60' ? '⚡ 60 FPS Akıcı' : perfProfile === 'ultra' ? '💎 Ultra' : '⚖️ Dengeli'}
          </span>
          <span className="sm:hidden text-[11px]">
            {perfProfile === 'smooth60' ? '⚡ 60 FPS' : perfProfile === 'ultra' ? '💎 Ultra' : '⚖️ Dengeli'}
          </span>
        </button>

        {/* Device Switcher */}
        <button
          onClick={handleOpenSelector}
          className="px-3 py-1.5 rounded-full bg-white/95 text-slate-800 border-2 border-slate-200 hover:border-amber-400 shadow-md backdrop-blur-md flex items-center gap-2 text-xs font-black transition transform active:scale-95 cursor-pointer hover:bg-slate-50"
        >
          {activeMode === 'touch' ? (
            <>
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>📱 Mobil</span>
            </>
          ) : (
            <>
              <Monitor className="w-3.5 h-3.5 text-indigo-600" />
              <span>💻 PC</span>
            </>
          )}
          <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-bold border border-amber-200">
            Değiştir
          </span>
        </button>
      </div>

      {/* MOBILE / TABLET MODE TOUCH CONTROLS */}
      {activeMode === 'touch' && (
        <div className="fixed inset-0 pointer-events-none z-[80] select-none">
          
          {/* Dynamic Touch Joystick Visual Indicator on Left Thumb */}
          {isLeftTouching && (
            <div
              className="absolute pointer-events-none"
              style={{
                left: touchStartPos.x - 50,
                top: touchStartPos.y - 50,
                width: 100,
                height: 100,
              }}
            >
              <div className="w-full h-full rounded-full border-2 border-emerald-400/60 bg-emerald-950/20 backdrop-blur-sm relative flex items-center justify-center">
                {/* 4-Way Direction Indicators */}
                <ArrowUp className="w-3.5 h-3.5 text-emerald-400/80 absolute top-1" />
                <ArrowDown className="w-3.5 h-3.5 text-emerald-400/80 absolute bottom-1" />
                <ArrowLeft className="w-3.5 h-3.5 text-emerald-400/80 absolute left-1" />
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400/80 absolute right-1" />

                {/* Inner Joystick Thumb Knob */}
                <div
                  className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-lg border-2 border-white absolute transition-transform"
                  style={{
                    transform: `translate(${touchPos.x - touchStartPos.x}px, ${touchPos.y - touchStartPos.y}px)`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Left Bottom Static Helper if not actively touching */}
          {!isLeftTouching && (
            <div className="absolute bottom-6 left-6 p-3 rounded-2xl bg-slate-900/40 border border-slate-700/40 text-slate-300 text-[11px] font-bold backdrop-blur-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-xs">
                👆
              </span>
              <span>Sol taraf: Parmağınla sürükle ve yönlendir</span>
            </div>
          )}

          {/* Right Bottom Big Touch Action Buttons */}
          <div className="absolute bottom-6 right-6 flex items-end gap-3 pointer-events-auto">
            {/* Roll / Dash Button */}
            <button
              type="button"
              onTouchStart={(e) => {
                e.preventDefault();
                handleRoll();
              }}
              onClick={handleRoll}
              className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 active:from-purple-700 active:to-indigo-600 text-white font-black text-xs shadow-lg border-2 border-purple-300 flex flex-col items-center justify-center active:scale-90 transition cursor-pointer"
            >
              <RefreshCw className="w-5 h-5" />
              <span className="text-[9px] font-mono mt-0.5">Takla</span>
            </button>

            {/* Attack Button */}
            <button
              type="button"
              onTouchStart={(e) => {
                e.preventDefault();
                handleAttack();
              }}
              onClick={handleAttack}
              className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-500 active:from-rose-700 active:to-red-600 text-white font-black text-xs shadow-lg border-2 border-rose-300 flex flex-col items-center justify-center active:scale-90 transition cursor-pointer"
            >
              <Zap className="w-5 h-5" />
              <span className="text-[9px] font-mono mt-0.5">Saldır</span>
            </button>

            {/* Jump Button (Primary Large) */}
            <button
              type="button"
              onTouchStart={(e) => {
                e.preventDefault();
                handleJump();
              }}
              onClick={handleJump}
              className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 active:from-amber-600 active:to-orange-600 text-slate-950 font-black text-sm shadow-2xl border-3 border-amber-200 flex flex-col items-center justify-center active:scale-90 transition cursor-pointer"
            >
              <span className="text-xl leading-none">🦘</span>
              <span className="text-[10px] font-black uppercase tracking-wider mt-0.5">Zıpla</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
