/**
 * Mobile & Tablet Anti-Lag Performance Optimization Engine
 * 
 * Automatically applies device-tailored rendering parameters, dynamic pixel ratio clamping,
 * shadow-map optimization, and adaptive FPS stabilization so tablets and phones run at a silky smooth 60 FPS.
 */

export type QualityProfile = 'smooth60' | 'balanced' | 'ultra' | 'auto';

interface PerformanceState {
  currentProfile: QualityProfile;
  currentPixelRatio: number;
  avgFps: number;
  isMobileDevice: boolean;
  isOptimized: boolean;
}

const state: PerformanceState = {
  currentProfile: (localStorage.getItem('super_bear_perf_profile') as QualityProfile) || 'auto',
  currentPixelRatio: 1.0,
  avgFps: 60,
  isMobileDevice: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Tablet/i.test(navigator.userAgent) || (window.innerWidth <= 1024),
  isOptimized: false,
};

let frameCount = 0;
let lastTime = performance.now();
let fpsHistory: number[] = [];

/**
 * Optimizes the Three.js WebGLRenderer instance for high frame-rates and low thermal overhead on mobile/tablets
 */
export function optimizeGameRenderer(forceProfile?: QualityProfile) {
  const game = (window as any).__superBearGame;
  if (!game || !game.renderer) return;

  const renderer = game.renderer;
  const profile = forceProfile || state.currentProfile;
  state.currentProfile = profile;
  localStorage.setItem('super_bear_perf_profile', profile);

  const nativeRatio = window.devicePixelRatio || 1;
  const isMobile = state.isMobileDevice;

  let targetRatio = 1.0;

  if (profile === 'smooth60') {
    // 60 FPS High Performance Mode: Locks pixel ratio to 1.0 for instant 60fps on any mobile/tablet
    targetRatio = isMobile ? 1.0 : 1.25;
    if (renderer.shadowMap) {
      renderer.shadowMap.enabled = true;
      if ((window as any).THREE) {
        renderer.shadowMap.type = (window as any).THREE.BasicShadowMap;
      }
    }
  } else if (profile === 'ultra') {
    // Ultra Quality Mode (for high-end desktop/gaming tablets)
    targetRatio = Math.min(nativeRatio, isMobile ? 1.5 : 2.0);
    if (renderer.shadowMap && (window as any).THREE) {
      renderer.shadowMap.type = (window as any).THREE.PCFSoftShadowMap;
    }
  } else {
    // Auto Adaptive Mode: Crisp yet lightweight
    if (isMobile) {
      targetRatio = Math.min(nativeRatio, 1.15);
      if (renderer.shadowMap && (window as any).THREE) {
        renderer.shadowMap.type = (window as any).THREE.BasicShadowMap;
      }
    } else {
      targetRatio = Math.min(nativeRatio, 1.5);
      if (renderer.shadowMap && (window as any).THREE) {
        renderer.shadowMap.type = (window as any).THREE.PCFShadowMap;
      }
    }
  }

  state.currentPixelRatio = targetRatio;
  renderer.setPixelRatio(targetRatio);

  if (renderer.powerPreference !== 'high-performance') {
    renderer.powerPreference = 'high-performance';
  }

  // Optimize scene frustum culling
  if (game.scene) {
    optimizeSceneObjects(game.scene);
  }

  state.isOptimized = true;
}

/**
 * Ensures all non-moving scene objects have frustum culling enabled to eliminate offscreen GPU calculations
 */
export function optimizeSceneObjects(scene: any) {
  if (!scene || !scene.traverse) return;
  scene.traverse((obj: any) => {
    if (obj.isMesh) {
      obj.frustumCulled = true;
      if (obj.geometry && !obj.geometry.boundingSphere) {
        obj.geometry.computeBoundingSphere();
      }
      // If object is purely decorative, disable casting heavy shadows on mobile
      if (state.isMobileDevice && obj.castShadow && (obj.name.includes('grass') || obj.name.includes('particle') || obj.name.includes('coin'))) {
        obj.castShadow = false;
      }
    }
  });
}

/**
 * Real-time Adaptive FPS Stabilizer loop
 */
function runFpsStabilizerLoop() {
  const now = performance.now();
  const delta = (now - lastTime) / 1000;
  frameCount++;

  if (delta >= 1.0) {
    const currentFps = Math.round(frameCount / delta);
    fpsHistory.push(currentFps);
    if (fpsHistory.length > 5) fpsHistory.shift();

    const avg = Math.round(fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length);
    state.avgFps = avg;

    // Adaptive Anti-Lag: If in auto mode and FPS drops below 40 on mobile, reduce pixel ratio slightly
    if (state.currentProfile === 'auto' && state.isMobileDevice) {
      const game = (window as any).__superBearGame;
      if (game && game.renderer) {
        if (avg < 40 && state.currentPixelRatio > 0.85) {
          state.currentPixelRatio = Math.max(0.85, state.currentPixelRatio - 0.1);
          game.renderer.setPixelRatio(state.currentPixelRatio);
        } else if (avg >= 58 && state.currentPixelRatio < 1.15) {
          state.currentPixelRatio = Math.min(1.15, state.currentPixelRatio + 0.05);
          game.renderer.setPixelRatio(state.currentPixelRatio);
        }
      }
    }

    frameCount = 0;
    lastTime = now;
  }

  requestAnimationFrame(runFpsStabilizerLoop);
}

/**
 * Initializes mobile performance monitoring and hooks
 */
export function initMobilePerformanceOptimizer() {
  // Start FPS loop
  requestAnimationFrame(runFpsStabilizerLoop);

  // Poll until game renderer is ready
  let checkCount = 0;
  const checkInterval = setInterval(() => {
    checkCount++;
    const game = (window as any).__superBearGame;
    if (game && game.renderer) {
      optimizeGameRenderer();
      clearInterval(checkInterval);
    }
    if (checkCount > 100) {
      clearInterval(checkInterval);
    }
  }, 150);

  // Hook window resize
  window.addEventListener('resize', () => {
    optimizeGameRenderer();
  }, { passive: true });

  // Expose global manager
  (window as any).__superBearPerformanceManager = {
    setProfile: (profile: QualityProfile) => optimizeGameRenderer(profile),
    getProfile: () => state.currentProfile,
    getFps: () => state.avgFps,
    getPixelRatio: () => state.currentPixelRatio,
    isMobile: () => state.isMobileDevice,
    optimizeScene: () => {
      const g = (window as any).__superBearGame;
      if (g && g.scene) optimizeSceneObjects(g.scene);
    }
  };
}
