import React, { useState, useEffect } from 'react';
import { Scroll, BookOpen, Sparkles, X, Compass, Award, CheckCircle2, ChevronRight, ChevronLeft, MapPin, Feather } from 'lucide-react';

export interface LoreScrollData {
  id: string;
  scrollNumber: number;
  title: string;
  locationName: string;
  locationIcon: string;
  shortSummary: string;
  fullStory: string;
  quote: string;
  author: string;
  rewardCoins: number;
  rewardXp: number;
  themeColor: string;
}

export const LORE_SCROLLS: LoreScrollData[] = [
  {
    id: 'scroll_expansion_mystery',
    scrollNumber: 1,
    title: "Genişleyen Toprakların Sırrı (Neden Bu Kadar Büyüdük?)",
    locationName: "Kadim Köy Meydanı Monoliti",
    locationIcon: "🏛️",
    shortSummary: "Köyün bir gecede devasa boyutlara ulaşmasının ardındaki ilahi Doğa Ruhu sırrı.",
    fullStory: "Yıllar önce Ayı Kedi Köyü yalnızca birkaç ahşap kulübe ve küçük bir dereden ibaretti. Ancak cesur kahraman Ayı Grizzy boyutlar arası yolculuğa çıkıp 15 Klasik Dünya'daki canavarları yendikçe, uzay boyutunu aşıp Poneix ve Phelix gezegenlerindeki kadim kozmik kristalleri arındırdıkça mucizevi bir şey oldu: Köyün altındaki bin yıllık 'Yaşam Çekirdeği' uyandı! Her kazanılan zafer, köyün sınırlarını metrelerce öteye genişletti; yeni bereketli tarlalar, gizli şelaleler ve göğe yükselen tepeler filizlendi. İnsanlar ve köylüler 'Neden bu kadar büyüdük?' diye fısıldaşırken bilmedikleri tek şey şuydu: Bu köy, saf sevgi ve dostlukla beslenen canlı bir cennettir!",
    quote: "Her kurtarılan dost ve yenilen her karanlık güç, köyümüzün toprağına yeni bir bahar üfler.",
    author: "Bilge Kedi Dedesi & Köy Muhtarı",
    rewardCoins: 75,
    rewardXp: 180,
    themeColor: "from-amber-500 to-yellow-600"
  },
  {
    id: 'scroll_ancient_pact',
    scrollNumber: 2,
    title: "Ayı ve Kedi Kadim Kardeşlik Paktı",
    locationName: "Değirmen Altı Gizli Mahzeni",
    locationIcon: "🌾",
    shortSummary: "Ayıların kudreti ve kedilerin çevikliğiyle kurulan ebedi dostluk yemini.",
    fullStory: "Zamanın başlangıcında karanlık gölgeler ormanı sardığında, dağların güçlü ayıları ile vadilerin bilge kedileri ulu meşe ağacının altında bir araya geldi. Ayılar koruyucu güçlerini, kediler ise sezgilerini ve kıvrak zekalarını ortaya koydu. Birlikte 'Altın Bal ve Süt Paktı'nı imzaladılar. Bu pakt gereğince hiçbir ayı bir kediyi yalnız bırakmayacak, hiçbir kedi bir ayının sırtını korumaktan geri durmayacaktı. Değirmenin altındaki bu mahzen, o günün anısına kutsal bal petekleriyle dolduruldu.",
    quote: "Pençelerimiz birleştiğinde, en karanlık ejderha bile yolumuzdan çekilir.",
    author: "Birinci Muhafız Kedi Boncuk & Büyük Ayı Moris",
    rewardCoins: 80,
    rewardXp: 200,
    themeColor: "from-emerald-500 to-teal-600"
  },
  {
    id: 'scroll_dimensional_tether',
    scrollNumber: 3,
    title: "Boyutlar Arası Bağlantı ve Kozmik Yankı",
    locationName: "Şelale Arkası Kristal Grotto",
    locationIcon: "🌊",
    shortSummary: "15 Dünya, Uzay Boyutu, Phelix ve Poneix'in köyle olan görünmez bağı.",
    fullStory: "Ayı Kedi Köyü sadece sıradan bir yerleşim değil; tüm boyutların merkezinde dönen evrensel bir çapa noktasıdır. Şelalenin ardındaki bu parıldayan kristaller, uzayın derinliklerindeki Yıldız Krallığı'na, Poneix'in yeşil rünlerine ve Phelix'in batık okyanuslarına bağlıdır. Köyde attığınız her adım, evrenin en ücra köşelerinde bir yankı uyandırır. İşte bu yüzden gökyüzünden süzülen yıldız tozları, köyün sularını şifalı kılar ve balıkların pullarını altın gibi parlatır.",
    quote: "Yıldızlar uzak görünse de kökleri bu vadinin berrak sularında yıkanır.",
    author: "Kozmik Gözlemci Kedi Maya",
    rewardCoins: 90,
    rewardXp: 220,
    themeColor: "from-sky-500 to-blue-600"
  },
  {
    id: 'scroll_celestial_tree',
    scrollNumber: 4,
    title: "Göksel Hayat Ağacı ve Bulut Geçitleri",
    locationName: "Gökyüzü Terası & Bulut Gözlemevi",
    locationIcon: "☁️",
    shortSummary: "Köyün gök kubbesine uzanan kadim dallar ve uçan adaların sırrı.",
    fullStory: "Gözlerinizi göğe çevirdiğinizde gördüğünüz devasa asma yaprakları ve altın bulutlar, binlerce yıldır uyuyan Göksel Hayat Ağacı'nın taç yapraklarıdır. Köy genişledikçe bu dallar göğe doğru tırmanmış ve üzerine adım atılabilen sağlam bulut yolları oluşturmuştur. Buradan tüm dünyayı izleyen Şahin Rüzgar, köyün sınırlarının her gün ufka doğru nasıl uzandığını ilk gören gözcüdür.",
    quote: "Aşağıda kök salan dostluk, yukarıda göklere taht kurar.",
    author: "Gözcü Şahin Rüzgar",
    rewardCoins: 100,
    rewardXp: 250,
    themeColor: "from-purple-500 to-indigo-600"
  },
  {
    id: 'scroll_healing_springs',
    scrollNumber: 5,
    title: "Şifalı Bal Pınarları & Bahçeler",
    locationName: "Doğu Sakura & Nilüfer Bahçesi",
    locationIcon: "🌸",
    shortSummary: "Köyün çiçeklerinden süzülen efsanevi gençlik ve can iksirleri.",
    fullStory: "Doğu bahçelerinde açan pembe sakura çiçekleri, sıradan çiçekler değildir. Arılar bu çiçeklerden topladıkları nektarı göletlerin altındaki kaynak sularıyla harmanlar. Bu pınarlardan su içen yorgun kahramanların yaraları anında iyileşir, kalpleri cesaretle dolar. Şifacı Kaplumbağa Tonton, yüzyıllardır bu pınarların başında bekleyerek köye gelen her dosta hayat iksiri sunar.",
    quote: "Doğanın şefkati, en derin yaraları bile bir tebessümle kapatır.",
    author: "Şifacı Kaplumbağa Tonton",
    rewardCoins: 85,
    rewardXp: 210,
    themeColor: "from-rose-500 to-pink-600"
  },
  {
    id: 'scroll_underground_prophecy',
    scrollNumber: 6,
    title: "Kadim Yeraltı Kehaneti ve Gelecek Uyarı",
    locationName: "Moris'in Dağ Sığınağı Arşivi",
    locationIcon: "⛰️",
    shortSummary: "20:00'de çatırdayacak yer kabuğu ve magma çekirdeğinin uyarısı.",
    fullStory: "Köyün kuzey dağlarındaki gizli odada bulunan son parşömen, geleceğe dair sarsıcı bir kehanet taşır: 'Köy ne kadar büyürse büyüsün, yeraltının derinliklerinde uyuyan Magma Çekirdeği bir gün uyanacaktır. Saat 20:00'yi vurduğunda yer sarsılacak, lav solucanları ve matkap orduları yüzeye doğru harekete geçecektir.' Ancak kehanet şunu da ekler: Ayı ve kedilerin birliği bozulmadığı sürece hiçbir karanlık bu cennet vadiyi yok edemez!",
    quote: "Karanlık derinlerde fısıldasa da, köyümüzün ışığı her zindanı aydınlatmaya yeter.",
    author: "Kadim Ayı Moris'in Günlük Notları",
    rewardCoins: 120,
    rewardXp: 300,
    themeColor: "from-orange-500 to-red-600"
  }
];

export const VillageLoreModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedScrollIndex, setSelectedScrollIndex] = useState(0);
  const [discoveredScrollIds, setDiscoveredScrollIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('superbear_discovered_scrolls');
      return saved ? JSON.parse(saved) : ['scroll_expansion_mystery'];
    } catch (e) {
      return ['scroll_expansion_mystery'];
    }
  });
  const [justDiscoveredTitle, setJustDiscoveredTitle] = useState<string | null>(null);

  useEffect(() => {
    const handleOpenScroll = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.scrollId) {
        const foundIdx = LORE_SCROLLS.findIndex(s => s.id === detail.scrollId);
        if (foundIdx !== -1) {
          setSelectedScrollIndex(foundIdx);
          markScrollDiscovered(detail.scrollId);
          setIsOpen(true);
        }
      } else {
        setIsOpen(true);
      }
    };

    const handleOpenModal = () => setIsOpen(true);

    window.addEventListener('superbear:open-lore-scroll', handleOpenScroll);
    window.addEventListener('superbear:open-lore-codex', handleOpenModal);

    return () => {
      window.removeEventListener('superbear:open-lore-scroll', handleOpenScroll);
      window.removeEventListener('superbear:open-lore-codex', handleOpenModal);
    };
  }, []);

  const markScrollDiscovered = (scrollId: string) => {
    setDiscoveredScrollIds(prev => {
      if (prev.includes(scrollId)) return prev;
      const updated = [...prev, scrollId];
      try {
        localStorage.setItem('superbear_discovered_scrolls', JSON.stringify(updated));
      } catch (e) {}

      const sObj = LORE_SCROLLS.find(s => s.id === scrollId);
      if (sObj) {
        setJustDiscoveredTitle(sObj.title);
        setTimeout(() => setJustDiscoveredTitle(null), 4000);

        // Grant reward
        const game = (window as any).__superBearGame;
        if (game && game.stats) {
          game.stats.coins += sObj.rewardCoins;
          game.stats.xp += sObj.rewardXp;
          if (game.checkLevelUp) game.checkLevelUp();
          if (game.callbacks && game.callbacks.onStatsUpdate) game.callbacks.onStatsUpdate(game.stats);
          if (game.callbacks && game.callbacks.onShowNotice) {
            game.callbacks.onShowNotice(`📜 Yeni Hikaye Parşömeni Açıldı: "${sObj.title}" (+${sObj.rewardCoins} Altın, +${sObj.rewardXp} XP)`, "success");
          }
        }
      }
      return updated;
    });
  };

  if (!isOpen) return null;

  const currentScroll = LORE_SCROLLS[selectedScrollIndex] || LORE_SCROLLS[0];
  const isDiscovered = discoveredScrollIds.includes(currentScroll.id);

  return (
    <div
      id="village-lore-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md transition-all duration-300"
      onClick={() => setIsOpen(false)}
    >
      <div
        id="village-lore-modal-card"
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-2 border-amber-500/40 rounded-2xl shadow-2xl shadow-amber-500/10 overflow-hidden text-slate-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-amber-500/20 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Scroll className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-wide text-amber-300 flex items-center gap-2">
                Ayı Kedi Köyü Kadim Hikaye Parşömenleri
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              </h2>
              <p className="text-xs text-slate-400">
                Köyün Gizemli Büyümesi ve 6 Gizli Geçit Hikayesi ({discoveredScrollIds.length}/{LORE_SCROLLS.length} Keşfedildi)
              </p>
            </div>
          </div>
          <button
            id="village-lore-close-btn"
            onClick={() => setIsOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800/80 hover:bg-rose-900/40 border border-slate-700 hover:border-rose-500/50 text-slate-300 hover:text-rose-300 transition-colors"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scroll Selector Tabs */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-950/40 border-b border-slate-800 overflow-x-auto scrollbar-none">
          {LORE_SCROLLS.map((scroll, idx) => {
            const disc = discoveredScrollIds.includes(scroll.id);
            const active = idx === selectedScrollIndex;
            return (
              <button
                key={scroll.id}
                id={`lore-scroll-tab-${scroll.scrollNumber}`}
                onClick={() => setSelectedScrollIndex(idx)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                    : disc
                    ? 'bg-slate-800/70 hover:bg-slate-700 text-amber-300/90 border border-amber-500/20'
                    : 'bg-slate-900/60 text-slate-500 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{scroll.locationIcon}</span>
                <span>#{scroll.scrollNumber} {disc ? scroll.title.slice(0, 16) + '...' : 'Gizli Parşömen'}</span>
                {disc ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <span className="text-[10px] text-slate-600">🔒</span>}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {justDiscoveredTitle && (
            <div className="p-3 bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/50 rounded-xl flex items-center justify-between text-xs text-emerald-300 animate-pulse">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Harika! <strong>"{justDiscoveredTitle}"</strong> günlüğe eklendi ve ödülleri alındı!</span>
              </div>
            </div>
          )}

          {isDiscovered ? (
            <div className="space-y-4">
              {/* Card Banner */}
              <div className={`p-4 rounded-xl bg-gradient-to-r ${currentScroll.themeColor} text-slate-950 shadow-lg flex items-center justify-between`}>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider opacity-80 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Bulunduğu Yer: {currentScroll.locationName}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold mt-1 tracking-tight">
                    {currentScroll.title}
                  </h3>
                </div>
                <div className="text-3xl sm:text-4xl filter drop-shadow-md">
                  {currentScroll.locationIcon}
                </div>
              </div>

              {/* Story Parchment Box */}
              <div className="relative p-5 sm:p-6 rounded-xl bg-amber-950/20 border border-amber-600/30 text-amber-100 shadow-inner">
                <div className="absolute top-3 right-3 text-amber-500/20">
                  <Feather className="w-12 h-12" />
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-amber-100/90 font-medium">
                  {currentScroll.fullStory}
                </p>

                {/* Author Quote */}
                <div className="mt-4 pt-3 border-t border-amber-500/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-amber-300">
                  <div className="italic font-semibold">
                    "{currentScroll.quote}"
                  </div>
                  <div className="text-amber-400/80 font-bold whitespace-nowrap">
                    — {currentScroll.author}
                  </div>
                </div>
              </div>

              {/* Reward Badge */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Keşif Ödülü:</span>
                  <span className="font-bold text-amber-400">+{currentScroll.rewardCoins} Altın</span>
                  <span className="font-bold text-cyan-400">+{currentScroll.rewardXp} XP</span>
                </div>
                <div className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kayıtlara Eklendi</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center space-y-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-500 text-2xl">
                🔒
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-300">
                  Bu Hikaye Parşömeni Henüz Bulunmadı!
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Ayı Kedi Köyü'ndeki gizli geçitleri, şelale arkasını, değirmen mahzenini ve göksel bulut platformlarını araştırarak bu parşömene ulaşabilirsin.
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-300">
                  <Compass className="w-3.5 h-3.5" />
                  <span>İpucu: {currentScroll.locationName} civarını araştır!</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800 bg-slate-950/80 text-xs text-slate-400">
          <button
            id="lore-prev-btn"
            onClick={() => setSelectedScrollIndex(prev => Math.max(0, prev - 1))}
            disabled={selectedScrollIndex === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Önceki</span>
          </button>
          <div className="font-semibold text-slate-400">
            Parşömen {selectedScrollIndex + 1} / {LORE_SCROLLS.length}
          </div>
          <button
            id="lore-next-btn"
            onClick={() => setSelectedScrollIndex(prev => Math.min(LORE_SCROLLS.length - 1, prev + 1))}
            disabled={selectedScrollIndex === LORE_SCROLLS.length - 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 transition-colors"
          >
            <span>Sonraki</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
