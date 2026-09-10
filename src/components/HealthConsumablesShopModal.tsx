import React, { useState } from 'react';
import { X, Heart, ShoppingBag, Sparkles, Utensils, Zap } from 'lucide-react';

interface HealthConsumablesShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  currentHp: number;
  maxHp: number;
  onConsumeFood: (healAmount: number, cost: number, itemName: string) => void;
}

interface FoodItem {
  id: string;
  name: string;
  icon: string;
  heal: number;
  price: number;
  description: string;
  category: 'fruit' | 'drink' | 'honey' | 'meal' | 'dessert';
}

const FOOD_ITEMS: FoodItem[] = [
  {
    id: 'blackberry',
    name: 'Taze Böğürtlen',
    icon: '🫐',
    heal: 10,
    price: 15,
    description: 'Orman çalılıklarından toplanmış taze ve lezzetli böğürtlen. Hafif enerji verir.',
    category: 'fruit'
  },
  {
    id: 'fruit_juice',
    name: 'Vitaminli Meyve Suyu',
    icon: '🧃',
    heal: 20,
    price: 35,
    description: 'Ferahlatıcı ve vitamin dolu özel yapım meyve suyu.',
    category: 'drink'
  },
  {
    id: 'forest_honey',
    name: 'Altın Orman Balı',
    icon: '🍯',
    heal: 35,
    price: 60,
    description: 'Süper Ayının favori tatlısı! Vücuda hızlıca canlılık kazandırır.',
    category: 'honey'
  },
  {
    id: 'wild_meat',
    name: 'Közlenmiş Av Eti',
    icon: '🥩',
    heal: 50,
    price: 90,
    description: 'Doyurucu ve güçlendirici av eti. Ciddi yaraları hızla sarar.',
    category: 'meal'
  },
  {
    id: 'birthday_cake',
    name: 'Sihirli Çilekli Pasta',
    icon: '🎂',
    heal: 75,
    price: 140,
    description: 'Maksimum şifa ve mutluluk sağlayan efsanevi parti pastası!',
    category: 'dessert'
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
    <div className="fixed inset-0 z-[150] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-5 select-none pointer-events-auto">
      {/* Floating Direct Close Button */}
      <button
        onClick={onClose}
        aria-label="Pencereyi Kapat"
        className="fixed top-2 right-2 sm:top-4 sm:right-4 z-[250] min-w-[46px] min-h-[46px] p-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black shadow-2xl border-2 border-rose-300 flex items-center justify-center transition active:scale-90 cursor-pointer"
        title="Kapat"
      >
        <X className="w-7 h-7 stroke-[3]" />
      </button>

      <div className="bg-slate-900 border-2 border-rose-500/50 rounded-3xl w-full max-w-xl max-h-[92dvh] sm:max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Pinned Header */}
        <div className="sticky top-0 z-40 p-3 sm:p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0 shadow-md">
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
              <p className="text-xs text-slate-400">Altınlarınla lezzetli yiyecekler al ve canını anında doldur!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-w-[40px] min-h-[40px] p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-200 hover:text-white transition active:scale-95 cursor-pointer border border-slate-700 flex items-center justify-center"
            title="Kapat"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="px-5 py-3 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs sm:text-sm font-bold shrink-0">
          <div className="flex items-center gap-2 text-rose-400">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
            <span>Mevcut Can: {currentHp} / {maxHp}</span>
          </div>
          <div className="flex items-center gap-2 text-amber-300 font-mono">
            <span>🪙 Cüzdan: {coins} Altın</span>
          </div>
        </div>

        {/* Notice banner */}
        {notice && (
          <div className="mx-4 mt-3 p-2.5 bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-bold rounded-xl text-center animate-bounce">
            {notice}
          </div>
        )}

        {/* Food Items List */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 flex flex-col gap-3">
          {FOOD_ITEMS.map((item) => {
            const canAfford = coins >= item.price;
            return (
              <div
                key={item.id}
                className="bg-slate-950/60 border border-slate-800 hover:border-rose-500/40 rounded-2xl p-3.5 flex items-center justify-between gap-3 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl shrink-0 shadow">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-black text-white text-sm flex items-center gap-2">
                      <span>{item.name}</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        +{item.heal} HP Can
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 leading-snug">{item.description}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="text-xs font-mono font-black text-amber-300 bg-amber-950/40 border border-amber-800/40 px-2.5 py-1 rounded-xl">
                    {item.price} 🪙
                  </div>
                  <button
                    onClick={() => handleBuyAndEat(item)}
                    disabled={!canAfford}
                    className={`px-3.5 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow ${
                      canAfford
                        ? 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white border border-rose-400/50'
                        : 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Satın Al & Ye</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>💡 Her yiyecek anında tüketilir ve canınızı kademeli olarak doldurur.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-black transition cursor-pointer border border-slate-700"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
