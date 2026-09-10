import React, { useState, useEffect } from 'react';
import { X, Heart, Utensils, Sparkles, Check, ShoppingBag, Plus } from 'lucide-react';

interface FoodItem {
  id: string;
  name: string;
  icon: string;
  heal: number;
  price: number;
  description: string;
  color: string;
}

interface HealthConsumablesShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  currentHp: number;
  maxHp: number;
  onConsumeFood: (healAmount: number, cost: number, itemName: string) => void;
}

const FOOD_ITEMS: FoodItem[] = [
  {
    id: 'food_apple',
    name: 'Kırmızı Dağ Elması',
    icon: '🍎',
    heal: 25,
    price: 10,
    description: 'Taze ve sulu bir elma. Hafif yaraları hızla sarar.',
    color: 'from-rose-500/20 to-orange-500/10'
  },
  {
    id: 'food_honey_jar',
    name: 'Doğal Petek Balı Kavanozu',
    icon: '🍯',
    heal: 50,
    price: 25,
    description: 'Süper Ayının en sevdiği tatlı güç kaynağı! Bol enerji verir.',
    color: 'from-amber-500/20 to-yellow-500/10'
  },
  {
    id: 'food_meat',
    name: 'Közlenmiş Et Parçası',
    icon: '🍖',
    heal: 75,
    price: 45,
    description: 'Doyurucu ve protein dolu et. Gücünü yerine getirir.',
    color: 'from-red-500/20 to-rose-500/10'
  },
  {
    id: 'food_golden_honey',
    name: 'Efsanevi Altın Bal & İksir',
    icon: '✨🍯',
    heal: 100,
    price: 80,
    description: 'Tüm canını %100 doldurur ve süper koruma aurası başlatır.',
    color: 'from-yellow-500/30 to-amber-500/20'
  },
  {
    id: 'food_pie',
    name: 'Yaban Mersinli Ayı Turtası',
    icon: '🥧',
    heal: 40,
    price: 20,
    description: 'Tavşan Ninjanın pişirdiği nefis sıcacık meyveli pasta.',
    color: 'from-purple-500/20 to-pink-500/10'
  }
];

export const HealthConsumablesShopModal: React.FC<HealthConsumablesShopModalProps> = ({
  isOpen,
  onClose,
  coins,
  currentHp,
  maxHp,
  onConsumeFood
}) => {
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBuyAndEat = (item: FoodItem) => {
    if (coins < item.price) {
      setNotice(`❌ Yetersiz Altın! Bu ürünü almak için ${item.price} 🪙 gerekiyor.`);
      setTimeout(() => setNotice(null), 3000);
      return;
    }
    if (currentHp >= maxHp) {
      setNotice(`⚠️ Sağlığınız zaten tamamen dolu! (${currentHp}/${maxHp})`);
      setTimeout(() => setNotice(null), 3000);
      return;
    }

    onConsumeFood(item.heal, item.price, item.name);
    setNotice(`😋 ${item.name} tüketildi! +${item.heal} Can kazandın.`);
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <div 
      className="fixed inset-0 z-[150] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-5 select-none pointer-events-auto animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-slate-900 border-2 border-rose-500/60 rounded-3xl w-full max-w-xl max-h-[92dvh] sm:max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-3 sm:p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>Sağlık & Besin Dükkanı</span>
                <span className="text-xs bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30">
                  Can Yenileme
                </span>
              </h2>
              <p className="text-xs text-slate-400">Lezzetli yiyecekler al ve canını anında doldur!</p>
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

        {/* Status Bar */}
        <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs sm:text-sm font-bold shrink-0">
          <div className="flex items-center gap-2 text-rose-400">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
            <span>Can: {currentHp} / {maxHp}</span>
          </div>
          <div className="flex items-center gap-2 text-amber-300 font-mono">
            <span>🪙 Cüzdan: {coins} Altın</span>
          </div>
        </div>

        {/* Notice banner */}
        {notice && (
          <div className="mx-4 mt-2 p-2 bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-bold rounded-xl text-center">
            {notice}
          </div>
        )}

        {/* Food Items List */}
        <div className="p-3 sm:p-5 overflow-y-auto flex-1 flex flex-col gap-2.5 scrollbar-thin">
          {FOOD_ITEMS.map((item) => {
            const canAfford = coins >= item.price;
            return (
              <div
                key={item.id}
                className="rounded-2xl p-3 bg-slate-950/70 border border-slate-800 hover:border-rose-500/40 flex items-center justify-between gap-3 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl shrink-0 shadow">
                    {item.icon}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white text-xs sm:text-sm truncate">{item.name}</span>
                      <span className="text-[10px] font-mono font-black text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 shrink-0">
                        +{item.heal} HP
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{item.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleBuyAndEat(item)}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition active:scale-95 shrink-0 shadow-md cursor-pointer ${
                    canAfford
                      ? 'bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{item.price} 🪙</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>🍎 Yiyecekler sağlığını anında tazeleyerek maceraya devam etmeni sağlar!</span>
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
