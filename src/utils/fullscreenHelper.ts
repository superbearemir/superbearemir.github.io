/**
 * Immersive Fullscreen and Screen Orientation Helper
 * Automatically handles Android navigation bar hiding, iOS webapp status bar,
 * vendor prefixes, and landscape lock.
 */

export function isFullscreenActive(): boolean {
  if (typeof document === 'undefined') return false;
  const doc = document as any;
  return !!(
    doc.fullscreenElement ||
    doc.webkitFullscreenElement ||
    doc.mozFullScreenElement ||
    doc.msFullscreenElement
  );
}

export async function requestImmersiveFullscreen(): Promise<boolean> {
  if (typeof document === 'undefined') return false;
  try {
    const docEl = document.documentElement as any;
    const req =
      docEl.requestFullscreen ||
      docEl.webkitRequestFullscreen ||
      docEl.mozRequestFullScreen ||
      docEl.msRequestFullscreen;

    if (req) {
      // navigationUI: 'hide' requests Android to hide the on-screen navigation bar (back, home, apps)
      await req.call(docEl, { navigationUI: 'hide' }).catch(() => {
        // Fallback without parameter for older browsers
        try {
          return req.call(docEl);
        } catch (e) {
          return null;
        }
      });
    }

    // Attempt to lock landscape orientation
    if (
      typeof window !== 'undefined' &&
      window.screen &&
      window.screen.orientation &&
      typeof (window.screen.orientation as any).lock === 'function'
    ) {
      try {
        await (window.screen.orientation as any).lock('landscape').catch(() => {});
      } catch (e) {}
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('superbear:fullscreen-change', {
          detail: { isFullscreen: true }
        })
      );
    }
    return true;
  } catch (err) {
    console.warn('Fullscreen request failed:', err);
    return false;
  }
}

export async function exitImmersiveFullscreen(): Promise<boolean> {
  if (typeof document === 'undefined') return false;
  try {
    const doc = document as any;
    const exit =
      doc.exitFullscreen ||
      doc.webkitExitFullscreen ||
      doc.mozCancelFullScreen ||
      doc.msExitFullscreen;

    if (exit && isFullscreenActive()) {
      await exit.call(doc).catch(() => {});
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('superbear:fullscreen-change', {
          detail: { isFullscreen: false }
        })
      );
    }
    return true;
  } catch (err) {
    return false;
  }
}

export async function toggleImmersiveFullscreen(): Promise<boolean> {
  if (isFullscreenActive()) {
    return exitImmersiveFullscreen();
  } else {
    return requestImmersiveFullscreen();
  }
}

// Global hook: lock fullscreen on user first touch if desired
if (typeof window !== 'undefined') {
  const handleAutoFullscreenOnInteraction = () => {
    // Try to lock orientation to landscape
    if (
      window.screen &&
      window.screen.orientation &&
      typeof (window.screen.orientation as any).lock === 'function'
    ) {
      try {
        (window.screen.orientation as any).lock('landscape').catch(() => {});
      } catch (e) {}
    }
  };

  window.addEventListener('touchstart', handleAutoFullscreenOnInteraction, { once: true });
  window.addEventListener('click', handleAutoFullscreenOnInteraction, { once: true });

  const notifyChange = () => {
    window.dispatchEvent(
      new CustomEvent('superbear:fullscreen-change', {
        detail: { isFullscreen: isFullscreenActive() }
      })
    );
  };

  document.addEventListener('fullscreenchange', notifyChange);
  document.addEventListener('webkitfullscreenchange', notifyChange);
  document.addEventListener('mozfullscreenchange', notifyChange);
  document.addEventListener('MSFullscreenChange', notifyChange);

  (window as any).__superBearFullscreen = {
    isActive: isFullscreenActive,
    request: requestImmersiveFullscreen,
    exit: exitImmersiveFullscreen,
    toggle: toggleImmersiveFullscreen
  };
}
