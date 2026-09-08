import React, { useState, useEffect } from 'react';
import { RotateCw, Smartphone } from 'lucide-react';

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

  if (!isPortrait) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[250] pointer-events-auto animate-in slide-in-from-bottom-4 duration-300">
      <div className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white border-2 border-purple-300 shadow-2xl backdrop-blur-md flex items-center gap-3 text-xs font-black">
        <div className="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center text-amber-300 animate-spin" style={{ animationDuration: '6s' }}>
          <RotateCw className="w-5 h-5 text-amber-300" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-amber-200">
            <Smartphone className="w-4 h-4 text-amber-300" />
            <span>EN İYİ OYUN DENEYİMİ İÇİN</span>
          </div>
          <p className="text-[11px] font-bold text-slate-100 opacity-90">
            📱 Lütfen Telefonunuzu Yan Çevirin (Otomatik Landscape)
          </p>
        </div>
        <button
          onClick={() => setIsPortrait(false)}
          className="ml-1 p-1 rounded-lg bg-slate-950/60 hover:bg-slate-950 text-slate-300 hover:text-white text-xs font-bold"
          title="Kapat"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
