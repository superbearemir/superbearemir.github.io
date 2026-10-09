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
    locationName: "Antik Şelaleli Su Kemeri & Taş Köşk Mahzeni",
    locationIcon: "🌾",
    shortSummary: "Ayıların kudreti ve kedilerin çevikliğiyle kurulan ebedi dostluk yemini.",
    fullStory: "Zamanın başlangıcında karanlık gölgeler ormanı sardığında, dağların güçlü ayıları ile vadilerin bilge kedileri ulu meşe ağacının altında bir araya geldi. Ayılar koruyucu güçlerini, kediler ise sezgilerini ve kıvrak zekalarını ortaya koydu. Birlikte 'Altın Bal ve Süt Paktı'nı imzaladılar. Bu pakt gereğince hiçbir ayı bir kediyi yalnız bırakmayacak, hiçbir kedi bir ayının sırtını korumaktan geri durmayacaktı. Şelaleli antik su kemerinin altındaki bu gizli taş köşk, o günün anısına kutsal bal petekleriyle dolduruldu.",
    quote: "Pençelerimiz birleştiğinde, en karanlık ejderha bile yolumuzdan çekilir.",
    author: "Birinci Muhafız Kedi Boncuk & Büyük Ayı Moris",
    rewardCoins: 80,
    rewardXp: 200,
    themeColor: "from-emerald-500 to-teal-600"
  },
  {
    id: 'scroll_dimensional_tether',
    scrollNumber: 3,
    title: "Büyük Deniz Feneri ve Kozmik Işık Yankısı",
    locationName: "26m Akdeniz Deniz Feneri Seyir Terası & Zirvesi",
    locationIcon: "🗼",
    shortSummary: "Büyük Deniz Feneri'nin göğe uzanan ışığı ile 15 Dünya ve boyutlar arası görünmez bağ.",
    fullStory: "Büyük Deniz Feneri yalnızca gemilere rehberlik eden bir kule değildir; tüm boyutların merkezinde dönen evrensel bir kozmik pusuladır. 26 metre yüksekliğindeki bu döner merdivenli seyir kulesinden gökyüzüne vuran devasa ışık demeti, uzayın derinliklerindeki Yıldız Krallığı'na, Poneix gezegeninin zümrüt rünlerine ve Phelix'in batık okyanuslarına bağlanır. Deniz fenerinin basamaklarını tırmanıp bu balkona çıkan her kahraman, ufkun ötesindeki boyutların şarkısını dinler ve ada ile köyün arasındaki mistik koruma kalkanını güçlendirir!",
    quote: "Deniz fenerimizin ışığı gökyüzüne vurdukça hiçbir kahraman karanlıkta yolunu kaybetmez.",
    author: "Fener Bekçisi & Kozmik Gözlemci Kedi Miço",
    rewardCoins: 90,
    rewardXp: 220,
    themeColor: "from-sky-500 to-blue-600"
  },
  {
    id: 'scroll_celestial_tree',
    scrollNumber: 4,
    title: "Göksel Hayat Ağacı ve Ada Malikanesi Terası",
    locationName: "3 Katlı Ada Malikanesi Çatı Terası & Seyir Köprüsü",
    locationIcon: "☁️",
    shortSummary: "Köyün gök kubbesine uzanan kadim dallar ve uçan adaların sırrı.",
    fullStory: "Gözlerinizi göğe çevirdiğinizde gördüğünüz devasa asma yaprakları ve altın bulutlar, binlerce yıldır uyuyan Göksel Hayat Ağacı'nın taç yapraklarıdır. Köy genişledikçe bu dallar göğe doğru tırmanmış ve üzerine adım atılabilen sağlam bulut yolları oluşturmuştur. Ada Malikanesi'nin en üst ahşap seyir terasından tüm ada vadisini izleyen Şahin Rüzgar, köyün sınırlarının her gün ufka doğru nasıl uzandığını ilk gören gözcüdür.",
    quote: "Aşağıda kök salan dostluk, yukarıda göklere taht kurar.",
    author: "Gözcü Şahin Rüzgar",
    rewardCoins: 100,
    rewardXp: 250,
    themeColor: "from-purple-500 to-indigo-600"
  },
  {
    id: 'scroll_healing_springs',
    scrollNumber: 5,
    title: "Şifalı Bal Pınarları ve Kuğu Nilüfer Göleti",
    locationName: "Kuğu Nilüfer Göleti & Çiçekli Gizli Adacık",
    locationIcon: "🌸",
    shortSummary: "Köyün çiçeklerinden ve nilüfer göletinden süzülen efsanevi gençlik ve can iksirleri.",
    fullStory: "Nilüfer göletinde açan pembe çiçekler ve su perisi sazlıkları sıradan bitkiler değildir. Arılar bu çiçeklerden topladıkları nektarı göletlerin altındaki kaynak sularıyla harmanlar. Bu pınarlardan su içen yorgun kahramanların yaraları anında iyileşir, kalpleri cesaretle dolar. Suda süzülen beyaz kuğular ve Şifacı Kaplumbağa Tonton, yüzyıllardır bu pınarların başında bekleyerek köye gelen her dosta hayat iksiri sunar.",
    quote: "Doğanın şefkati, en derin yaraları bile bir tebessümle kapatır.",
    author: "Şifacı Kaplumbağa Tonton",
    rewardCoins: 85,
    rewardXp: 210,
    themeColor: "from-rose-500 to-pink-600"
  },
  {
    id: 'scroll_underground_prophecy',
    scrollNumber: 6,
    title: "Kadim Yeraltı Kehaneti ve Moris'in Günlüğü",
    locationName: "Moris'in Gizli Dağ İni & Arşiv Odası",
    locationIcon: "⛰️",
    shortSummary: "20:00'de çatırdayacak yer kabuğu ve magma çekirdeğinin uyarısı.",
    fullStory: "Köyün kuzey dağlarındaki Moris'in gizli mağara odasında bulunan son parşömen, geleceğe dair sarsıcı bir kehanet taşır: 'Köy ne kadar büyürse büyüsün, yeraltının derinliklerinde uyuyan Magma Çekirdeği bir gün uyanacaktır. Saat 20:00'yi vurduğunda yer sarsılacak, lav solucanları ve matkap orduları yüzeye doğru harekete geçecektir.' Ancak kehanet şunu da ekler: Ayı ve kedilerin birliği bozulmadığı sürece hiçbir karanlık bu cennet vadiyi yok edemez!",
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
  const [isAncientLockCelebrationOpen, setIsAncientLockCelebrationOpen] = useState(false);
  const [isLockClaimed, setIsLockClaimed] = useState(() => {
    try {
      return localStorage.getItem('superbear_ancient_lock_claimed') === 'true';
    } catch (e) {
      return false;
    }
  });

  const allScrollsDiscovered = discoveredScrollIds.length >= LORE_SCROLLS.length;

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

    const handleLockUnlocked = () => {
      setIsAncientLockCelebrationOpen(true);
    };

    const handleLockClaimed = () => {
      setIsLockClaimed(true);
    };

    window.addEventListener('superbear:open-lore-scroll', handleOpenScroll);
    window.addEventListener('superbear:open-lore-codex', handleOpenModal);
    window.addEventListener('superbear:ancient-lock-unlocked', handleLockUnlocked);
    window.addEventListener('superbear:ancient-lock-claimed', handleLockClaimed);

    return () => {
      window.removeEventListener('superbear:open-lore-scroll', handleOpenScroll);
      window.removeEventListener('superbear:open-lore-codex', handleOpenModal);
      window.removeEventListener('superbear:ancient-lock-unlocked', handleLockUnlocked);
      window.removeEventListener('superbear:ancient-lock-claimed', handleLockClaimed);
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

        // Check if all 6 scrolls collected
        if (updated.length >= LORE_SCROLLS.length) {
          try {
            localStorage.setItem('superbear_ancient_lock_unlocked', 'true');
          } catch (e) {}
          (window as any).__ancientLockUnlocked = true;
          window.dispatchEvent(new CustomEvent('superbear:ancient-lock-unlocked', { detail: { scrollCount: 6 } }));
        }
      }
      return updated;
    });
  };

  const handleClaimLockReward = () => {
    if (isLockClaimed) return;
    try {
      localStorage.setItem('superbear_ancient_lock_claimed', 'true');
    } catch (e) {}
    setIsLockClaimed(true);

    const game = (window as any).__superBearGame;
    if (game && game.stats) {
      game.stats.coins += 1000;
      game.stats.xp += 500;
      game.stats.honeyGems = (game.stats.honeyGems || 0) + 100;
      if (game.checkLevelUp) game.checkLevelUp();
      if (game.callbacks && game.callbacks.onStatsUpdate) game.callbacks.onStatsUpdate(game.stats);
      if (game.callbacks && game.callbacks.onShowNotice) {
        game.callbacks.onShowNotice("🏆 KADİM HAZİNE ALINDI! +1000 Altın, +500 XP, +100 Saf Bal ve 👑 Kadim Bilgelik Tacı!", "success");
      }
    }
    const St = (window as any).St;
    if (St && St.playFanfare) St.playFanfare();
    else if (St && St.playLevelComplete) St.playLevelComplete();

    window.dispatchEvent(new CustomEvent('superbear:ancient-lock-claimed'));
  };

  if (!isOpen && !isAncientLockCelebrationOpen) return null;

  const currentScroll = LORE_SCROLLS[selectedScrollIndex] || LORE_SCROLLS[0];
  const isDiscovered = discoveredScrollIds.includes(currentScroll.id);

  return (
    <>
      {/* Ancient Lock Unlocked Grand Celebration Popup Modal */}
      {isAncientLockCelebrationOpen && (
        <div
          id="ancient-lock-celebration-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in"
          onClick={() => setIsAncientLockCelebrationOpen(false)}
        >
          <div
            className="relative w-full max-w-lg p-6 rounded-3xl bg-gradient-to-b from-amber-950 via-slate-900 to-slate-950 border-2 border-amber-400 shadow-2xl shadow-amber-500/30 text-center text-white space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/40 animate-bounce">
              🔓
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>KADİM KEŞİF TAMAMLANDI</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-amber-300 drop-shadow">
                Kadim Kilit Açıldı!
              </h2>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Tebrikler! Büyük Deniz Feneri ve adanın gizli noktalarındaki tüm <strong>6 Kadim Parşömen</strong> bulundu! Ulu Köprü girişindeki Kadim Mühür kırıldı ve büyük hazine serbest bırakıldı!
              </p>
            </div>

            {/* Rewards Card */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="text-xl">💰</div>
                <div className="font-black text-amber-400 text-sm mt-1">+1000</div>
                <div className="text-[10px] text-slate-400">Altın</div>
              </div>
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <div className="text-xl">⭐</div>
                <div className="font-black text-cyan-400 text-sm mt-1">+500</div>
                <div className="text-[10px] text-slate-400">Deneyim XP</div>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="text-xl">🍯</div>
                <div className="font-black text-yellow-300 text-sm mt-1">+100</div>
                <div className="text-[10px] text-slate-400">Saf Bal</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center gap-3 text-left">
              <span className="text-2xl">👑</span>
              <div className="text-xs">
                <span className="font-bold text-amber-300 block">Kadim Bilgelik Tacı & Mührü</span>
                <span className="text-slate-400">Efsanevi köy muhafızı başlığı envanterine eklendi!</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              {!isLockClaimed ? (
                <button
                  onClick={() => {
                    handleClaimLockReward();
                    setIsAncientLockCelebrationOpen(false);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl font-black text-sm bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 hover:scale-[1.02] active:scale-95 transition-transform cursor-pointer"
                >
                  🎁 Büyük Hazineyi Şimdi Al
                </button>
              ) : (
                <button
                  onClick={() => setIsAncientLockCelebrationOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl font-black text-sm bg-emerald-600 text-white shadow-lg cursor-pointer"
                >
                  ✅ Hazine Alındı - Kapat
                </button>
              )}
              <button
                onClick={() => {
                  setIsAncientLockCelebrationOpen(false);
                  setIsOpen(true);
                }}
                className="py-3 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
              >
                📜 Parşömenleri İncele
              </button>
            </div>
          </div>
        </div>
      )}

      {isOpen && (
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 sm:space-y-5">
          {/* Ancient Lock Status Card */}
          <div className={`p-4 rounded-2xl border-2 transition-all ${
            allScrollsDiscovered
              ? 'bg-gradient-to-r from-amber-950/80 via-yellow-950/70 to-slate-900 border-amber-400 shadow-xl shadow-amber-500/20'
              : 'bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border-amber-500/30 shadow-lg'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border ${
                  allScrollsDiscovered
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-bounce'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>
                  {allScrollsDiscovered ? '🔓' : '🔒'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm sm:text-base text-white">
                      {allScrollsDiscovered ? 'Kadim Hazine Kilidi: AÇILDI!' : 'Kadim Parşömen Mührü & Altın Hazine Kilidi'}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      allScrollsDiscovered
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {discoveredScrollIds.length} / {LORE_SCROLLS.length} Parşömen
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {allScrollsDiscovered
                      ? 'Tüm 6 parşömen bulundu ve Ulu Köprü girişindeki kadim kilit açıldı!'
                      : 'Köy ve adadaki 6 gizli parşömeni toplayarak kadim hazine kilidini aç!'}
                  </p>
                </div>
              </div>

              {allScrollsDiscovered ? (
                <button
                  onClick={handleClaimLockReward}
                  disabled={isLockClaimed}
                  className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 shrink-0 ${
                    isLockClaimed
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/40 hover:scale-105 cursor-pointer animate-pulse'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isLockClaimed ? '✅ Hazine Ödülü Alındı' : '👑 Kadim Hazineyi Al (+1000 Altın, +500 XP, +100 Bal)'}</span>
                </button>
              ) : (
                <div className="text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shrink-0">
                  <span>💡 3. Parşömen Büyük Deniz Feneri'nde!</span>
                </div>
              )}
            </div>

            {/* 6 Mini Scroll Sockets Indicators */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-3 pt-3 border-t border-slate-800/80">
              {LORE_SCROLLS.map(scroll => {
                const found = discoveredScrollIds.includes(scroll.id);
                return (
                  <div
                    key={scroll.id}
                    onClick={() => {
                      const idx = LORE_SCROLLS.findIndex(s => s.id === scroll.id);
                      if (idx !== -1) setSelectedScrollIndex(idx);
                    }}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                      found
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                        : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-base">{found ? scroll.locationIcon : '🔒'}</span>
                    <span className="text-[10px] font-bold mt-1 line-clamp-1">#{scroll.scrollNumber} {scroll.title.slice(0, 10)}</span>
                    <span className="text-[9px] opacity-75">{found ? 'Açık' : 'Gizli'}</span>
                  </div>
                );
              })}
            </div>
          </div>

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
    )}
  </>
  );
};
