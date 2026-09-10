import React, { useEffect } from 'react';
import { X, Gem, Coins, BookOpen, Crown, Lock, Unlock, Sparkles, Trophy } from 'lucide-react';

interface TreasureItem {
  id: string;
  name: string;
  icon: string;
  category: 'currency' | 'gem' | 'relic' | 'book';
  description: string;
  isUnlocked: boolean;
  value: number;
  source: string;
}

interface TreasureInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  honeyGems: number;
}

export const TreasureInventoryModal: React.FC<TreasureInventoryModalProps> = ({
  isOpen,
  onClose,
  coins,
  honeyGems
}) => {
  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const treasures: TreasureItem[] = [
    {
      id: 'gold_coin',
      name: 'Altın Sikke',
      icon: '🪙',
      category: 'currency',
      description: 'Orman yollarında ve görevlerde toplanan parlak altınlar.',
      isUnlocked: true,
      value: coins,
      source: 'Genel Toplama & Görevler'
    },
    {
      id: 'honey_gem',
      name: 'Bal Zümrütü (Honey Gem)',
      icon: '⭐',
      category: 'gem',
      description: 'Nadir bulunan tatlı zümrüt kristali.',
      isUnlocked: honeyGems > 0 || true,
      value: honeyGems,
      source: 'Seviye Sandıkları'
    },
    {
      id: 'emerald',
      name: 'Orman Zümrüdü',
      icon: '🟢',
      category: 'gem',
      description: 'Derin mağaralardan çıkarılan yeşil değerli taş.',
      isUnlocked: coins >= 50,
      value: 1,
      source: '50+ Altın Toplandığında Açılır'
    },
    {
      id: 'diamond',
      name: 'Kozmik Pırlanta',
      icon: '💎',
      category: 'gem',
      description: 'Uzay tapınaklarının en değerli pırlantası.',
      isUnlocked: coins >= 200,
      value: 1,
      source: '200+ Altın Toplandığında Açılır'
    },
    {
      id: 'magic_book',
      name: 'Büyülü Kadim Kitap',
      icon: '📖',
      category: 'book',
      description: 'Süper Ayı büyülerini ve gizli tarifleri barındıran eski el yazması.',
      isUnlocked: true,
      value: 1,
      source: 'Başlangıç Hediyesi'
    },
    {
      id: 'crystal_orb',
      name: 'Kehanet Kristal Küresi',
      icon: '🔮',
      category: 'relic',
      description: 'Geleceği gösteren mistik küre.',
      isUnlocked: false,
      value: 1,
      source: 'Bölüm 5 Tamamlandığında Açılır'
    },
    {
      id: 'golden_crown',
      name: 'Kraliyet Altın Tacı',
      icon: '👑',
      category: 'relic',
      description: 'Süper Ayı Krallığının görkemli tacı.',
      isUnlocked: false,
      value: 1,
      source: '30 Uzaylı Dost Kurtarıldığında Açılır'
    },
    {
      id: 'ancient_fossil',
      name: 'Antik Dinozor Fosili',
      icon: '🦴',
      category: 'relic',
      description: 'Yeraltı mağaralarında keşfedilen milyon yıllık kalıntı.',
      isUnlocked: false,
      value: 1,
      source: 'Yeraltı Bölümü Keşfi'
    }
  ];

  const unlockedCount = treasures.filter(t => t.isUnlocked).length;

  return (
    <div 
      className="fixed inset-0 z-[150] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-5 select-none pointer-events-auto animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl w-full max-w-2xl max-h-[92dvh] sm:max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-3 sm:p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Gem className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>Hazine ve Koleksiyon Envanteri</span>
                <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                  {unlockedCount} / {treasures.length} Açık
                </span>
              </h2>
              <p className="text-xs text-slate-400">Topladığın altınlar, zümrütler ve materyaller.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-w-[42px] min-h-[42px] p-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black flex items-center justify-center transition active:scale-95 cursor-pointer border-2 border-rose-300 shadow-md"
            title="Kapat (ESC)"
            aria-label="Pencereyi Kapat"
          >
            <X className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Summary Card */}
        <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-bold shrink-0">
          <div className="flex items-center gap-2 text-amber-300 font-mono">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>Toplam Altın: {coins} 🪙</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-mono">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Koleksiyon: %{Math.round((unlockedCount / treasures.length) * 100)}</span>
          </div>
        </div>

        {/* Treasures Grid */}
        <div className="p-3 sm:p-5 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5 scrollbar-thin">
          {treasures.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl p-3 border flex items-start gap-3 transition ${
                item.isUnlocked
                  ? 'bg-slate-950/70 border-slate-800 hover:border-amber-500/40'
                  : 'bg-slate-950/30 border-slate-900 opacity-60'
              }`}
            >
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow ${
                item.isUnlocked ? 'bg-slate-900 border border-slate-800' : 'bg-slate-950 border border-slate-900 text-slate-600'
              }`}>
                {item.isUnlocked ? item.icon : <Lock className="w-5 h-5 text-slate-500" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className={`font-black text-xs sm:text-sm truncate ${item.isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                    {item.name}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border shrink-0 ${
                    item.isUnlocked
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-slate-800 text-slate-500 border-slate-700'
                  }`}>
                    {item.isUnlocked ? 'Açık' : 'Kilitli'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{item.description}</p>
                <div className="mt-1.5 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="truncate">Kaynak: {item.source}</span>
                  {item.category === 'currency' && (
                    <span className="font-mono font-bold text-amber-300">{item.value} 🪙</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span className="hidden sm:inline">🏆 Daha fazla hazine için dünyayı keşfet!</span>
          <span className="sm:hidden">🏆 {unlockedCount} Hazine</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-rose-600 text-white rounded-xl font-black text-xs transition cursor-pointer border border-slate-700 shadow"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
