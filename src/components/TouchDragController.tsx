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

  const leftTouchIdRef = useRef<number | null>(null);
  const rightTouchIdRef = useRef<number | null>(null);

  // PC Mouse Drag Steering
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
      if (game.rotateCamera) {
        game.rotateCamera(deltaX * 0.006, -deltaY * 0.005);
      } else {
        if (game.camYaw !== undefined) game.camYaw -= deltaX * 0.006;
        if (game.camPitch !== undefined) {
          game.camPitch = Math.max(-0.4, Math.min(0.8, game.camPitch - deltaY * 0.005));
        }
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

  return null;
};
