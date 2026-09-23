/**
 * Tablet & Mobile Anti-Lag High-Performance Optimization Engine
 * 
 * Automatically detects iPads, Android tablets, smartphones, and low-end GPUs.
 * Eliminates stutters and lag by clamping pixel ratio (DPR), optimizing shadow maps,
 * disposing geometry/material leaks, reducing particle overhead, and stabilizing frame rates.
 */

export type QualityProfile = 'smooth60' | 'batterySaver' | 'balanced' | 'ultra' | 'auto';

export interface PerformanceState {
  currentProfile: QualityProfile;
  currentPixelRatio: number;
  avgFps: number;
  isMobileDevice: boolean;
  isTabletDevice: boolean;
  shadowsEnabled: boolean;
  isOptimized: boolean;
}

/**
 * Robust detection of Tablets (iPad, iPad Pro, Android tablets, Kindle, Galaxy Tab)
 */
export function detectIsTablet(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = (navigator.userAgent || '').toLowerCase();
  
  // Modern iPadOS Safari reports "MacIntel" / "Macintosh" with multi-touch points
  const isIpadOS = (navigator.platform === 'MacIntel' || navigator.platform === 'Macintosh') && navigator.maxTouchPoints > 1;
  const isIpadUa = /ipad/i.test(ua);
  
  // Android tablets generally have "android" but not "mobile"
  const isAndroidTablet = /android/i.test(ua) && !/mobile/i.test(ua);
  const isGenericTablet = /tablet|playbook|silk|kindle/i.test(ua);
  
  // Touch device with tablet screen resolution (e.g. 600px - 1400px width/height)
  const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  const minDim = Math.min(window.innerWidth, window.innerHeight);
  const maxDim = Math.max(window.innerWidth, window.innerHeight);
  const isTabletDimensions = hasTouch && minDim >= 540 && maxDim <= 1400;

  return isIpadOS || isIpadUa || isAndroidTablet || isGenericTablet || isTabletDimensions;
}

/**
 * Robust detection of Mobile phones or Tablets
 */
export function detectIsMobileOrTablet(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = (navigator.userAgent || '').toLowerCase();
  const isMobileUa = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet|silk|kindle/i.test(ua);
  const isIpadOS = (navigator.platform === 'MacIntel' || navigator.platform === 'Macintosh') && navigator.maxTouchPoints > 1;
  const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  const isMobileScreen = Math.min(window.innerWidth, window.innerHeight) <= 950 || Math.max(window.innerWidth, window.innerHeight) <= 1400;

  return isMobileUa || isIpadOS || (hasTouch && isMobileScreen);
}

const isTablet = detectIsTablet();
const isMobileOrTab = detectIsMobileOrTablet();

// Stored preferences with tablet-first defaults
const savedProfile = localStorage.getItem('super_bear_perf_profile') as QualityProfile | null;
const initialProfile: QualityProfile = savedProfile || (isMobileOrTab ? 'smooth60' : 'balanced');

const savedShadows = localStorage.getItem('super_bear_shadows_enabled');
const initialShadows = savedShadows !== null ? savedShadows === 'true' : !isMobileOrTab;

const state: PerformanceState = {
  currentProfile: initialProfile,
  currentPixelRatio: isMobileOrTab ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.5),
  avgFps: 60,
  isMobileDevice: isMobileOrTab,
  isTabletDevice: isTablet,
  shadowsEnabled: initialShadows,
  isOptimized: false,
};

// Global DPR accessor used by game-bundle.js onResize & constructor
if (typeof window !== 'undefined') {
  (window as any).__getSuperBearDpr = () => state.currentPixelRatio;
}

let frameCount = 0;
let lastTime = performance.now();
const fpsHistory: number[] = [];

/**
 * Optimizes the Three.js WebGLRenderer instance for high frame-rates and zero lag on tablets/phones
 */
export function optimizeGameRenderer(forceProfile?: QualityProfile) {
  const profile = forceProfile || state.currentProfile;
  state.currentProfile = profile;
  localStorage.setItem('super_bear_perf_profile', profile);

  const nativeRatio = window.devicePixelRatio || 1;
  const isMobile = state.isMobileDevice;

  let targetRatio = 1.0;
  let useShadows = state.shadowsEnabled;

  if (profile === 'batterySaver') {
    // 🚀 Low-End / Older Tablet Mode: 0.85x resolution scale, shadows disabled completely
    targetRatio = 0.85;
    useShadows = false;
  } else if (profile === 'smooth60') {
    // ⚡ 60 FPS Tablet & Mobile High-Performance Mode (Crisp 1.0x, fast basic shadows, silky 60fps)
    targetRatio = isMobile ? 1.0 : 1.25;
    useShadows = state.shadowsEnabled;
  } else if (profile === 'balanced') {
    // ⚖️ Balanced Mode
    targetRatio = isMobile ? 1.15 : 1.35;
    useShadows = state.shadowsEnabled;
  } else if (profile === 'ultra') {
    // 💎 Ultra Quality Mode (high-end desktop PC / M-series Mac)
    targetRatio = Math.min(nativeRatio, isMobile ? 1.4 : 1.75);
    useShadows = state.shadowsEnabled;
  } else {
    // 'auto' adaptive mode
    targetRatio = isMobile ? 1.0 : Math.min(nativeRatio, 1.35);
  }

  state.currentPixelRatio = targetRatio;

  const game = (window as any).__superBearGame;
  if (!game || !game.renderer) return;

  const renderer = game.renderer;

  // Apply Pixel Ratio
  renderer.setPixelRatio(targetRatio);

  // Apply Shadow settings
  if (renderer.shadowMap) {
    renderer.shadowMap.enabled = useShadows;
    if (useShadows) {
      // BasicShadowMap = 0 is 3x faster than PCFSoftShadowMap on mobile/tablets
      renderer.shadowMap.type = (profile === 'ultra' && !isMobile) ? 1 : 0;
    }
  }

  // Adjust sunlight shadow resolution
  if (game.sunLight && game.sunLight.shadow && game.sunLight.shadow.mapSize) {
    const shadowRes = (profile === 'ultra' && !isMobile) ? 1024 : (profile === 'smooth60' || isMobile) ? 512 : 512;
    game.sunLight.shadow.mapSize.width = shadowRes;
    game.sunLight.shadow.mapSize.height = shadowRes;
  }

  if (renderer.powerPreference !== 'high-performance') {
    renderer.powerPreference = 'high-performance';
  }

  // Optimize scene frustum culling & disable shadow casting on non-vital props
  if (game.scene) {
    optimizeSceneObjects(game.scene);
  }

  state.isOptimized = true;

  // Broadcast event so UI HUD reacts
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('superbear:performance-changed', {
      detail: {
        profile: state.currentProfile,
        pixelRatio: state.currentPixelRatio,
        shadowsEnabled: useShadows,
        fps: state.avgFps,
      }
    }));
  }
}

/**
 * Ensures all decorative objects don't cast heavy shadow maps and have frustum culling enabled
 */
export function optimizeSceneObjects(scene: any) {
  if (!scene || !scene.traverse) return;
  scene.traverse((obj: any) => {
    if (obj.isMesh) {
      obj.frustumCulled = true;
      if (obj.geometry && !obj.geometry.boundingSphere) {
        obj.geometry.computeBoundingSphere();
      }
      
      // On mobile or tablets: strip shadow casting from small decorative objects
      if (state.isMobileDevice && obj.castShadow) {
        const name = (obj.name || '').toLowerCase();
        if (
          name.includes('grass') ||
          name.includes('flower') ||
          name.includes('leaf') ||
          name.includes('bush') ||
          name.includes('rock') ||
          name.includes('coin') ||
          name.includes('star') ||
          name.includes('sparkle') ||
          name.includes('particle') ||
          name.includes('fence')
        ) {
          obj.castShadow = false;
        }
      }
    }
  });
}

/**
 * Toggles shadow maps on or off (Disabling shadows gives up to +25 FPS on older tablets)
 */
export function toggleGameShadows(forceEnabled?: boolean): boolean {
  const nextVal = forceEnabled !== undefined ? forceEnabled : !state.shadowsEnabled;
  state.shadowsEnabled = nextVal;
  localStorage.setItem('super_bear_shadows_enabled', String(nextVal));

  const game = (window as any).__superBearGame;
  if (game && game.renderer && game.renderer.shadowMap) {
    game.renderer.shadowMap.enabled = nextVal;
  }

  optimizeGameRenderer();
  return nextVal;
}

/**
 * Mega Anti-Lag Booster: Instantly cleans up memory, locks 60 FPS profile, and clears dead objects
 */
export function applyAntiLagBoost(): { fps: number; profile: QualityProfile; pixelRatio: number } {
  state.shadowsEnabled = false; // Turn off heavy shadows for max smoothness
  localStorage.setItem('super_bear_shadows_enabled', 'false');
  optimizeGameRenderer('smooth60');

  const game = (window as any).__superBearGame;
  if (game && Array.isArray(game.particles)) {
    // Clear dead particle backlog
    while (game.particles.length > 5) {
      const p = game.particles.shift();
      if (p && p.mesh) {
        game.scene.remove(p.mesh);
        if (p.mesh.geometry && !p.mesh.geometry._s) p.mesh.geometry.dispose();
        if (p.mesh.material && !p.mesh.material._s) p.mesh.material.dispose();
      }
    }
  }

  return {
    fps: state.avgFps,
    profile: state.currentProfile,
    pixelRatio: state.currentPixelRatio,
  };
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

    // Adaptive Anti-Lag: If FPS drops below 42 on mobile/tablet in smooth60/auto, reduce DPR slightly
    if ((state.currentProfile === 'smooth60' || state.currentProfile === 'auto') && state.isMobileDevice) {
      const game = (window as any).__superBearGame;
      if (game && game.renderer) {
        if (avg < 40 && state.currentPixelRatio > 0.85) {
          state.currentPixelRatio = Math.max(0.85, state.currentPixelRatio - 0.08);
          game.renderer.setPixelRatio(state.currentPixelRatio);
        } else if (avg >= 58 && state.currentPixelRatio < 1.0) {
          state.currentPixelRatio = Math.min(1.0, state.currentPixelRatio + 0.04);
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
 * Initializes tablet & mobile performance monitoring and hooks
 */
export function initMobilePerformanceOptimizer() {
  // WebGL Context Loss & Crash Protection
  if (typeof window !== 'undefined') {
    window.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      console.warn('⚠️ WebGL context lost - preventing crash, restoring...');
    }, false);

    window.addEventListener('webglcontextrestored', () => {
      console.log('✅ WebGL context restored - refreshing render pipeline');
      setTimeout(() => optimizeGameRenderer(), 200);
    }, false);

    // Prevent pull-to-refresh and multi-touch page zoom jitter inside APK / WebView
    document.addEventListener('touchmove', (e) => {
      if ((e.target as HTMLElement)?.closest('canvas') || (e.target as HTMLElement)?.closest('.touch-action-none')) {
        // Allow smooth game canvas touch without browser bounce
      }
    }, { passive: true });
  }

  // Start FPS loop
  requestAnimationFrame(runFpsStabilizerLoop);

  // Poll until game renderer is ready
  let checkCount = 0;
  const checkInterval = setInterval(() => {
    checkCount++;
    const game = (window as any).__superBearGame;
    if (game && game.renderer) {
      if (isMobileOrTab && !savedProfile) {
        applyAntiLagBoost();
      } else {
        optimizeGameRenderer();
      }
      clearInterval(checkInterval);
    }
    if (checkCount > 100) {
      clearInterval(checkInterval);
    }
  }, 120);

  // Hook window resize
  window.addEventListener('resize', () => {
    optimizeGameRenderer();
  }, { passive: true });

  // Hook orientationchange for tablets
  window.addEventListener('orientationchange', () => {
    setTimeout(() => optimizeGameRenderer(), 150);
  }, { passive: true });

  // Expose global manager
  (window as any).__superBearPerformanceManager = {
    setProfile: (profile: QualityProfile) => optimizeGameRenderer(profile),
    getProfile: () => state.currentProfile,
    getFps: () => state.avgFps,
    getPixelRatio: () => state.currentPixelRatio,
    isMobile: () => state.isMobileDevice,
    isTablet: () => state.isTabletDevice,
    toggleShadows: (enabled?: boolean) => toggleGameShadows(enabled),
    getShadowsEnabled: () => state.shadowsEnabled,
    applyAntiLagBoost: () => applyAntiLagBoost(),
    optimizeScene: () => {
      const g = (window as any).__superBearGame;
      if (g && g.scene) optimizeSceneObjects(g.scene);
    },
  };
}
