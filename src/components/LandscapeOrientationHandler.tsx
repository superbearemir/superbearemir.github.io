import React, { useState, useEffect } from 'react';
import { RotateCw, Smartphone, X } from 'lucide-react';

export const LandscapeOrientationHandler: React.FC = () => {
  const [isPortrait, setIsPortrait] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerHeight > window.innerWidth && window.innerWidth < 1024;
    }
    return false;
  });

  useEffect(() => {
    const checkOrientation = () => {
      const portrait = window.innerHeight > window.innerWidth && window.innerWidth < 1024;
      setIsPortrait(portrait);

      // Try automatic screen orientation lock if browser supports it
      if (!portrait && window.screen && window.screen.orientation && typeof (window.screen.orientation as any).lock === 'function') {
        try {
          (window.screen.orientation as any).lock('landscape').catch(() => {});
        } catch (e) {}
      }
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    // Lock landscape on user first click/tap
    const handleFirstUserInteraction = () => {
      if (window.screen && window.screen.orientation && typeof (window.screen.orientation as any).lock === 'function') {
        try {
          (window.screen.orientation as any).lock('landscape').catch(() => {});
        } catch (e) {}
      }
    };

    window.addEventListener('touchstart', handleFirstUserInteraction, { once: true });
    window.addEventListener('click', handleFirstUserInteraction, { once: true });

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  const handleTryRotate = () => {
    if (window.screen && window.screen.orientation && typeof (window.screen.orientation as any).lock === 'function') {
      try {
        (window.screen.orientation as any).lock('landscape').catch(() => {});
      } catch (e) {}
    }
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  if (!isPortrait) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-300 select-none max-w-[90vw]">
      <div 
        onClick={handleTryRotate}
        className="px-3.5 py-1.5 rounded-full bg-slate-950/90 border border-amber-400/80 shadow-2xl backdrop-blur-md flex items-center gap-2 text-xs font-extrabold text-amber-300 hover:border-amber-300 transition-all cursor-pointer group"
      >
        <div className="w-5 h-5 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0">
          <RotateCw className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <Smartphone className="w-3.5 h-3.5 text-amber-300" />
          <span className="text-[11px] font-bold text-slate-100">
            En iyi deneyim için <span className="text-amber-300 font-black underline underline-offset-2">Telefonu Yan Çevirin</span>
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsPortrait(false);
          }}
          className="ml-1 w-4 h-4 rounded-full bg-slate-800 hover:bg-red-500/80 hover:text-white flex items-center justify-center text-slate-400 text-[10px] transition-colors"
          title="Kapat"
        >
          <X className="w-2.5 h-2.5" />
        </button>
      </div>
    </div>
  );
};

