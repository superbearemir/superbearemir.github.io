import React, { useState, useEffect } from 'react';
import { Sparkles, MessageCircle, KeyRound, ShieldAlert, Heart, X } from 'lucide-react';

export interface SpaceDialogueState {
  isOpen: boolean;
  step: 'mor_ayi_speech' | 'player_speech' | 'none';
  speaker: string;
  speakerAvatar: string;
  speakerRole: string;
  text: string;
  isMorAyi: boolean;
}

export const SpaceBossDialogueOverlay: React.FC = () => {
  const [dialogue, setDialogue] = useState<SpaceDialogueState>({
    isOpen: false,
    step: 'none',
    speaker: '',
    speakerAvatar: '',
    speakerRole: '',
    text: '',
    isMorAyi: false,
  });

  const [hasKey, setHasKey] = useState(false);
  const [isNearCage, setIsNearCage] = useState(false);
  const [isBademRescued, setIsBademRescued] = useState(false);

  useEffect(() => {
    const handleDialogueEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        setDialogue({
          isOpen: !!detail.isOpen,
          step: detail.step || 'none',
          speaker: detail.speaker || '',
          speakerAvatar: detail.speakerAvatar || '🐻',
          speakerRole: detail.speakerRole || '',
          text: detail.text || '',
          isMorAyi: !!detail.isMorAyi,
        });
      }
    };
    window.addEventListener('superbear:space-dialogue', handleDialogueEvent);

    const handleKeyDropped = () => {
      setHasKey(true);
    };
    window.addEventListener('superbear:key-dropped', handleKeyDropped);

    const handleNearCage = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setIsNearCage(!!(detail && detail.isNear));
    };
    window.addEventListener('superbear:near-cage', handleNearCage);

    const handleBademRescued = () => {
      setIsBademRescued(true);
      setHasKey(false);
    };
    window.addEventListener('superbear:badem-rescued', handleBademRescued);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.code === 'KeyB' || e.key === 'b' || e.key === 'B') {
        const game = (window as any).__superBearGame;
        if (game && typeof game.tryUnlockCage === 'function') {
          game.tryUnlockCage();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('superbear:space-dialogue', handleDialogueEvent);
      window.removeEventListener('superbear:key-dropped', handleKeyDropped);
      window.removeEventListener('superbear:near-cage', handleNearCage);
      window.removeEventListener('superbear:badem-rescued', handleBademRescued);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNextDialogue = () => {
    const game = (window as any).__superBearGame;
    if (game && typeof game.advanceSpaceDialogue === 'function') {
      game.advanceSpaceDialogue();
    } else {
      setDialogue((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleUnlockCage = () => {
    const game = (window as any).__superBearGame;
    if (game && typeof game.tryUnlockCage === 'function') {
      game.tryUnlockCage();
    }
  };

  return (
    <>
      {/* 1. DEV KONUŞMA BALONU (GIANT SPEECH BUBBLE MODAL) */}
      {dialogue.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in pointer-events-auto overflow-y-auto">
          <div
            className={`relative w-full max-w-2xl rounded-3xl p-4 sm:p-8 border-4 shadow-[0_0_80px_rgba(168,85,247,0.4)] flex flex-col gap-3 sm:gap-6 transition-all duration-300 transform scale-100 max-h-[94vh] overflow-y-auto ${
              dialogue.isMorAyi
                ? 'bg-gradient-to-b from-purple-950 via-slate-950 to-purple-950 border-purple-500 text-purple-100'
                : 'bg-gradient-to-b from-amber-950 via-slate-950 to-amber-950 border-amber-400 text-amber-100'
            }`}
          >
            {/* Header Badge & Prominent Top-Right Close Button */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div
                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-4xl border-2 shadow-2xl ${
                    dialogue.isMorAyi
                      ? 'bg-purple-900/60 border-purple-400 animate-pulse'
                      : 'bg-amber-900/60 border-amber-400'
                  }`}
                >
                  {dialogue.speakerAvatar}
                </div>
                <div>
                  <h3
                    className={`text-lg sm:text-2xl font-black tracking-wide ${
                      dialogue.isMorAyi ? 'text-purple-300 drop-shadow-[0_0_12px_rgba(192,132,252,0.8)]' : 'text-amber-300'
                    }`}
                  >
                    {dialogue.speaker}
                  </h3>
                  <p className="text-xs sm:text-sm font-bold opacity-80 flex items-center gap-1.5 mt-0.5">
                    {dialogue.isMorAyi ? (
                      <span className="text-purple-400 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" /> Kırık Boynuzlu Kozmik Düşman
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> Cesur Ayıcık & Badem'in Dostu
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden sm:block px-3 py-1 rounded-full bg-white/10 text-xs font-black uppercase tracking-widest text-white/90 border border-white/20">
                  💬 Karşılaşma
                </div>
                <button
                  onClick={handleNextDialogue}
                  className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95 cursor-pointer border border-white/20"
                  title="Kapat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Giant Bubble Content */}
            <div
              className={`relative p-6 rounded-3xl border-2 text-base sm:text-lg font-bold leading-relaxed shadow-inner ${
                dialogue.isMorAyi
                  ? 'bg-purple-900/30 border-purple-400/60 text-purple-200 shadow-purple-950/50'
                  : 'bg-amber-900/30 border-amber-400/60 text-amber-100 shadow-amber-950/50'
              }`}
            >
              <span className="text-3xl text-white/40 absolute -top-4 left-6 font-serif">“</span>
              <p className="italic font-extrabold tracking-wide pl-2 pr-2">{dialogue.text}</p>
              <span className="text-3xl text-white/40 absolute -bottom-6 right-6 font-serif">”</span>
            </div>

            {/* Continue Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handleNextDialogue}
                className={`px-6 py-3 rounded-2xl font-black text-sm sm:text-base flex items-center gap-2 cursor-pointer shadow-2xl transition transform hover:scale-105 active:scale-95 ${
                  dialogue.isMorAyi
                    ? 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-600 hover:from-purple-400 hover:to-fuchsia-400 text-white border border-purple-300'
                    : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 border border-yellow-200'
                }`}
              >
                <span>Devam Et</span>
                <span className="px-2 py-0.5 rounded bg-black/30 text-xs font-mono">Boşluk / Tıkla</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. ANAHTAR ENVANTERDE GÖSTERGESİ (KEY IN INVENTORY BANNER) */}
      {hasKey && !isBademRescued && (
        <div className="fixed top-20 right-6 z-50 pointer-events-auto animate-in slide-in-from-right duration-300">
          <div className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 border-2 border-yellow-200 shadow-[0_0_25px_rgba(234,179,8,0.5)] flex items-center gap-2.5 font-black text-xs sm:text-sm">
            <KeyRound className="w-5 h-5 text-slate-950 animate-spin" style={{ animationDuration: '4s' }} />
            <div>
              <div className="leading-tight">🗝️ Altın Kafes Anahtarı Alındı!</div>
              <div className="text-[11px] font-bold text-slate-900 opacity-90">
                Arenanın arkasındaki kafese git ve B tuşuna bas!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. KAFES YANINDAYKEN ETKİLEŞİM BANNERI (INTERACTION PROMPT NEAR CAGE) */}
      {isNearCage && !isBademRescued && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-auto animate-bounce">
          <button
            onClick={handleUnlockCage}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-slate-950 font-black text-sm sm:text-base border-2 border-yellow-200 shadow-[0_0_35px_rgba(245,158,11,0.7)] flex items-center gap-3 cursor-pointer transition transform hover:scale-105 active:scale-95"
          >
            <span className="text-2xl">🦜</span>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span>Kafesi Aç ve Badem'i Kurtar!</span>
                <span className="px-2 py-0.5 bg-slate-950 text-amber-300 rounded font-mono text-xs">[B Tuşu]</span>
              </div>
              <p className="text-[11px] font-bold text-slate-900 opacity-90">
                {hasKey ? '🗝️ Anahtar hazır, kafesi açmak için bas!' : '⚠️ Önce Mor Ayı\'yı yen ve anahtarı al!'}
              </p>
            </div>
          </button>
        </div>
      )}

      {/* 4. BADEM KURTARILDI ZAFER KUTLAMASI (BADEM RESCUED VICTORY BANNER) */}
      {isBademRescued && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(245,158,11,0.6)] text-center flex flex-col items-center gap-4 max-w-md w-full relative animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setIsBademRescued(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition"
              title="Kapat"
            >
              ✕
            </button>
            <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border-2 border-amber-300 flex items-center justify-center text-5xl shadow-2xl animate-bounce">
              🦜
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                ✨ BÜYÜK KURTARIŞ ZAFERİ ✨
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-amber-300 mt-2">
                Kuşumuz Badem Kurtarıldı!
              </h2>
              <p className="text-sm text-slate-200 mt-2 leading-relaxed font-medium">
                Mor Ayı mağlup oldu! Sevimli kuşumuz Badem artık özgür ve daima yanında neşeyle uçacak!
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-4 py-2 rounded-xl border border-emerald-500/40">
              <Heart className="w-4 h-4 fill-emerald-400 text-emerald-400" />
              <span>Tüm Uzay ve Dünya Maceraları Başarıyla Tamamlandı!</span>
            </div>
            <button
              onClick={() => setIsBademRescued(false)}
              className="mt-2 w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-sm shadow-lg hover:brightness-110 active:scale-95 transition cursor-pointer"
            >
              🎉 Harika! Maceraya Devam Et
            </button>
          </div>
        </div>
      )}
    </>
  );
};
