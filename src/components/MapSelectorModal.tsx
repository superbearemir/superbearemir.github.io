import React, { useState } from 'react';
import { Globe, Rocket, ShieldAlert, Sparkles, X, ChevronRight, CheckCircle2, Lock, Flame } from 'lucide-react';

interface MapSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MapSelectorModal: React.FC<MapSelectorModalProps> = ({ isOpen, onClose }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'earth' | 'space' | 'poneix' | 'phelix'>('all');

  const [unlockedMax] = useState<number>(() => {
    const saved = localStorage.getItem('super_bear_unlocked_levels_max');
    return saved ? parseInt(saved, 10) : 14;
  });

  if (!isOpen) return null;

  const handleSelectLevel = (regionId: string, levelNo: number, isWorld: boolean) => {
    // Only allow entering if level is within unlocked limit (First 14 levels open)
    if (!isWorld || levelNo > unlockedMax) {
      return;
    }
    const game = (window as any).__superBearGame;
    const poneix = (window as any).__superBearPoneixLevels;
    const phelix = (window as any).__superBearPhelixLevels;
    if (game) {
      if (typeof (window as any).__superBearPurgeScene === 'function') {
        (window as any).__superBearPurgeScene(game);
      }
      if (phelix && phelix.PHELIX_LEVEL_MAP && phelix.PHELIX_LEVEL_MAP[regionId]) {
        phelix.loadPhelixLevel(regionId);
      } else if (poneix && poneix.PONEIX_LEVEL_MAP && poneix.PONEIX_LEVEL_MAP[regionId]) {
        poneix.loadPoneixLevel(regionId);
      } else if (game.loadRegion) {
        game.loadRegion(regionId);
      }
    }
    onClose();
  };

  const earthLevels = [
    { id: 'hub', no: 1, name: 'Neşeli Ayı & Kedi Köyü', icon: '🏡', desc: 'Köy merkezi, futbol sahası, kedi bakkal ve şövaleler.' },
    { id: 'forest_temple', no: 2, name: 'Antik Orman Tapınağı', icon: '🏛️', desc: 'Kadim sütunlar, zıplama mantarları ve Orman Muhafızı Zephyr.' },
    { id: 'beehive', no: 3, name: 'Vızıldayan Kovan', icon: '🐝', desc: 'Altın bal petekleri, bal trambolinleri ve Usta Balcı Buzzy.' },
    { id: 'pelican_plains', no: 4, name: 'Pelikan Ovaları & Gök Adaları', icon: '🪽', desc: 'Bulutların üstünde yüzen adalar ve hava akımları.' },
    { id: 'snow_desert', no: 5, name: 'Kar Vadisi & Buzul Gölü', icon: '❄️', desc: 'Kaygan buz pisti, karlı çam ağaçları ve Kar Tilkisi Yuki.' },
    { id: 'volcano_cave', no: 6, name: 'Volkanik Ejderha Mağarası', icon: '🌋', desc: 'Kızıl lav nehirleri, bazalt basamaklar ve Ateş Semenderi Pyro.' },
    { id: 'underwater_palace', no: 7, name: 'Antik Su Altı Kristal Sarayı', icon: '🧜‍♀️', desc: 'Mermer sualtı sütunları ve Prenses Coral.' },
    { id: 'golden_sanctuary', no: 8, name: 'Efsanevi Altın Cenneti', icon: '🌟', desc: 'Işıltılı altın tapınak ve Başmelek Ayı.' },
    { id: 'dinosaur_world', no: 9, name: 'Tarih Öncesi Dinozor Dünyası', icon: '🦖', desc: 'Devasa dinozor iskelet kemerleri ve Arkeo.' },
    { id: 'sugar_world', no: 10, name: 'Şeker Dünyası & Lolipop Krallığı', icon: '🍭', desc: 'Dev girdap lolipoplar ve Şeker Perisi Bonbon.' },
    { id: 'jokerooms', no: 11, name: 'Jokerooms - Şaka Labirenti', icon: '🟡', desc: 'Sonsuz sarı koridorlar ve Dedektif Ayı Holmes.' },
    { id: 'ruin_village', no: 12, name: 'Yıkılmış Köy Harabeleri', icon: '🏚️', desc: 'Terk edilmiş gotik kalıntılar ve Son Sakin Bruno.' },
    { id: 'water_cave', no: 13, name: 'Karanlık Su Mağarası', icon: '💧', desc: 'Mavi kristal göletler ve Kaşif Kedi Felix.' },
    { id: 'bee_desert', no: 14, name: 'Arıların Çölü & Antik Piramit', icon: '🏜️', desc: 'Altın kum tepeleri, devasa basamaklı piramit ve Deve Kemal.' },
    { id: 'earth_summit', no: 15, name: 'Dünya Final Zirvesi & Kırmızı Çizgi', icon: '⛰️', desc: '14 hatıra dikilitaşı, Bilge Gandor ve Kozmik Uzay Kapısı!' },
  ];

  const spaceLevels = [
    { id: 'space_1_stardust', no: 1, name: 'Yıldız Tozu & Meteorlar', icon: '✨', npc: 'Kasklı Kedi Astro', desc: 'Düşük yerçekimli meteor parkuru.' },
    { id: 'space_2_crystal', no: 2, name: 'Parlayan Kristal Gezegeni', icon: '💎', npc: 'Kasklı Ayı Yuri', desc: 'Neon kristal mağaraları ve enerji sütunları.' },
    { id: 'space_3_gas_giant', no: 3, name: 'Kozmik Gaz Devi & Fırtına', icon: '🌀', npc: 'Kasklı Robot Bip-Bop', desc: 'Manyetik platformlar ve plazma gayzerleri.' },
    { id: 'space_4_asteroid_belt', no: 4, name: 'Plazma Asteroid Kuşağı', icon: '☄️', npc: 'Kasklı Yıldız Sincabı Chip', desc: 'Dönen lazer bariyerleri ve zorlu zıplamalar.' },
    { id: 'space_5_nebula_ruins', no: 5, name: 'Nebula Çölü & Uzay Harabeleri', icon: '🪐', npc: 'Kasklı Kozmik Tilki Luna', desc: 'Antik uzaylı tapınağı ve enerji köprüleri.' },
    { id: 'space_6_dark_lord', no: 6, name: 'Kara Delik & Dark Lord Kalesi', icon: '⚔️', boss: 'BOSS: DARK LORD', desc: 'Zorlu boss savaşı! Simsiyah tenli, kırmızı gözlü Dark Lord seni bekliyor!' },
    { id: 'space_7_purple_bear', no: 7, name: 'Kozmik Kale & Mor Ayı Arenası', icon: '👑', boss: 'FİNAL BOSS: KIRIK BOYNUZLU MOR AYI', desc: 'Devasa konuşma balonuyla destansı karşılaşma! Küçük kuş Badem\'i kurtar!' },
  ];

  const poneixLevels = [
    {
      id: 'poneix_1_crash_valley',
      no: 1,
      name: 'Poneix Çarpışma Vadisi & Alevli Krater',
      icon: '💥',
      badge: '🎬 TİLKİ KAÇIŞ SİNEMATİĞİ',
      desc: 'Tilki uzay aracını sabote edip kaçtı ve patlattı! Grizzy alevli kraterde gözünü açıyor. Hikayenin 1. Bölümü!'
    },
    {
      id: 'poneix_2_crystal_canyon',
      no: 2,
      name: 'Zümrüt & Plazma Kristal Kanyonu',
      icon: '💎',
      badge: 'HİKAYE BÖLÜMÜ',
      npc: 'Kasklı Kaşif Orion',
      desc: 'Yüzen zümrüt kristal köprüler, yeşil plazma halkaları ve Tilki\'nin bıraktığı gizemli enerji izleri.'
    },
    {
      id: 'poneix_3_cyber_ruins',
      no: 3,
      name: 'Antik Phoenix Sibernetik Tapınağı',
      icon: '🏛️',
      badge: 'HİKAYE BÖLÜMÜ',
      npc: 'Siber Muhafız Unit-7',
      desc: 'Lazer ızgaraları, antik veri panelleri ve 14 Dünya Bossunun güçlerinin aktarıldığı siber boru hatları.'
    },
    {
      id: 'poneix_4_magma_ocean',
      no: 4,
      name: 'Kızıl Magma Okyanusu & Yüzen Bazaltlar',
      icon: '🌋',
      badge: 'HİKAYE BÖLÜMÜ',
      desc: 'Yükselen ateş dalgaları, lav gayzerleri ve patlayan volkanik basamaklar.'
    },
    {
      id: 'poneix_5_sky_citadel',
      no: 5,
      name: 'Poneix Göksel Hisarı & Enerji Kuleleri',
      icon: '🛸',
      badge: 'HİKAYE BÖLÜMÜ',
      desc: 'Bulutların üstünde asılı teknoloji kalesi. Hızlandırıcı portallar ve siber gözetleme dronları.'
    },
    {
      id: 'poneix_6_chimera_core',
      no: 6,
      name: 'Füzyon Reaktörü & Klonlama Laboratuvarı',
      icon: '🧪',
      badge: 'FÜZYON ÇEKİRDEĞİ',
      desc: '14 Dünya Bossunun genetik ve kozmik enerjilerinin birleştirildiği gizli karanlık laboratuvar!'
    },
    {
      id: 'poneix_7_fusion_boss',
      no: 7,
      name: 'BİRLEŞİK 14 DÜNYA BOSSU APEX ARENASI',
      icon: '👑',
      boss: 'FİNAL BOSS: 14 DÜNYA BİRLEŞİK FÜZYON BOSSU',
      desc: 'Dinozor, Ejderha, Arı, Altın Cennet ve diğer tüm 14 dünya bossunun birleştiği devasa Chimera Titan ile nihai savaş!'
    },
  ];

  const phelixLevels = [
    {
      id: 'phelix_1_oases',
      no: 1,
      name: 'Bölüm 1: Phelix Vahaları (The Oases of Phelix)',
      icon: '🌴',
      badge: '🎬 TİLKİ LAZER SALDIRISI & PARAŞÜT İNİŞİ',
      desc: 'Oyuncunun gezegene ilk adım attığı, görece güvenli ama gizemlerle dolu başlangıç bölgesi. Uzun vaha parkurları!'
    },
    {
      id: 'phelix_2_neon_verge',
      no: 2,
      name: 'Bölüm 2: Neon Sınırı (Neon Verge)',
      icon: '⚡',
      badge: 'TEKNOLOJİK SINIR',
      desc: 'Teknolojik kalıntıların, fütüristik sığınakların veya terk edilmiş istasyonların başladığı sınır hattı.'
    },
    {
      id: 'phelix_3_ashen_vale',
      no: 3,
      name: 'Bölüm 3: Kül Vadisi (The Ashen Vale)',
      icon: '🌋',
      badge: 'ANKA KÖKLERİ',
      desc: 'Volkanik aktivitelerin yoğun olduğu, Phelix\'in Anka (Phoenix) köklerine selam çakan gri ve tehlikeli topraklar.'
    },
    {
      id: 'phelix_4_titanium_canyon',
      no: 4,
      name: 'Bölüm 4: Titanyum Kanyonu (Titanium Canyon)',
      icon: '🏗️',
      badge: 'DİKEY OYNANIŞ',
      desc: 'Devasa metalik yapıların ve dikey oynanışın ön plana çıktığı, madencilik veya endüstriyel bölge.'
    },
    {
      id: 'phelix_5_eye_of_tempest',
      no: 5,
      name: 'Bölüm 5: Fırtına Gözü (Eye of the Tempest)',
      icon: '🌀',
      badge: 'KOZMİK FIRTINA',
      desc: 'Gezegenin bitmek bilmeyen kozmik fırtınalarının yaşandığı, hayatta kalma mekaniklerinin zorlaştığı orta aşama.'
    },
    {
      id: 'phelix_6_cyber_void',
      no: 6,
      name: 'Bölüm 6: Siber Kıyamet (Cyber Void)',
      icon: '💻',
      badge: 'DİJİTAL TEHLİKE',
      desc: 'Tamamen yapay zeka, hackleme veya dijital tehlikelerin, siber ağların hakim olduğu bölge.'
    },
    {
      id: 'phelix_7_primal_relics',
      no: 7,
      name: 'Bölüm 7: Kadim Kalıntılar (The Primal Relics)',
      icon: '🏛️',
      badge: 'ANTİK BULMACALAR',
      desc: 'Phelix\'in geçmişine ışık tutan, antik uzaylı ırklarından kalma tapınaklar ve bulmacalar.'
    },
    {
      id: 'phelix_8_orbital_belt',
      no: 8,
      name: 'Bölüm 8: Yörünge Kuşağı (The Orbital Belt)',
      icon: '🛰️',
      badge: 'ATMOSFER DIŞI HALKA',
      desc: 'Oyunun zirve noktasına yaklaşırken atmosferin dışına, gezegenin savunma halkalarına veya uzay istasyonlarına taşındığımız bölüm.'
    },
    {
      id: 'phelix_9_core_boss',
      no: 9,
      name: 'Bölüm 9: Phelix Çekirdeği (The Core of Phelix)',
      icon: '👑',
      boss: 'FİNAL BOSS: TİLKİ BOSS (FOX BOSS)',
      desc: 'Büyük final! Gezegenin kalbinde, tüm sırların çözüldüğü ve Tilki Boss ile mecha robot savaşı!'
    }
  ];

  return (
    <div className="fixed inset-0 z-[120] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-purple-600 to-indigo-500 flex items-center justify-center text-xl shadow-lg">
              🗺️
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-emerald-300 to-indigo-300">
                Grizzy'nin Büyük Macerası - Bölüm Seçimi
              </h2>
              <p className="text-xs text-slate-400 font-semibold">
                15 Dünya + 7 Uzay (Kırmızı Çizgi) + 7 Poneix (Yeşil Çizgi) + 9 Phelix (Mavi Çizgi & Tilki Boss)
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="p-3 sm:px-5 bg-slate-950/40 border-b border-slate-800 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🌟 Tümü (38 Bölüm)
          </button>
          <button
            onClick={() => setSelectedFilter('earth')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'earth'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>🌍 15 Dünya</span>
          </button>
          <button
            onClick={() => setSelectedFilter('space')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'space'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>🌌 7 Uzay (Kırmızı Çizgi)</span>
          </button>
          <button
            onClick={() => setSelectedFilter('poneix')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'poneix'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'bg-slate-800 text-emerald-400 hover:text-emerald-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>🪐 7 Poneix (Yeşil Çizgi)</span>
          </button>
          <button
            onClick={() => setSelectedFilter('phelix')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'phelix'
                ? 'bg-sky-500 text-slate-950 font-black shadow-md'
                : 'bg-slate-800 text-sky-400 hover:text-sky-300'
            }`}
          >
            <span className="text-sm">🔷</span>
            <span>🔷 9 Phelix (Mavi Çizgi)</span>
          </button>
        </div>

        {/* Scrollable Levels Container */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">

          {/* 20:00 BIG UNDERGROUND UPDATE TRAILER BANNER */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/80 via-amber-950/70 to-slate-950 border-2 border-amber-500/70 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 via-orange-500 to-amber-400 p-0.5 shadow-lg flex-shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl animate-bounce">
                  🌋
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-amber-300 uppercase tracking-wide">
                    20:00 BÜYÜK GÜNCELLEMESİ & YERALTI DÜNYASI FRAGMANI
                  </span>
                  <span className="px-2 py-0.5 text-[9px] font-black bg-red-600 text-white rounded-full animate-pulse">
                    5 DAKİKA
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  9 Farklı Yeraltı Bölümü, Köstebekler, Dev Magma Solucanları ve Zemin Yarılması Felaketi!
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                window.dispatchEvent(new CustomEvent('superbear:open-trailer'));
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs border border-amber-300 shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>🎬 Fragmanı İzle [H]</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          {/* SECTION 1: 15 DÜNYA BÖLÜMÜ */}
          {(selectedFilter === 'all' || selectedFilter === 'earth') && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-black uppercase tracking-wider text-emerald-300">
                  🌍 Dünya Bölümleri (1 - 15)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {earthLevels.map((lvl) => {
                  const isLocked = lvl.no > 14;
                  return (
                    <button
                      key={lvl.id}
                      disabled={isLocked}
                      onClick={() => handleSelectLevel(lvl.id, lvl.no, true)}
                      className={`p-3.5 rounded-2xl border transition text-left flex flex-col justify-between shadow-md ${
                        isLocked
                          ? 'bg-slate-900/30 border-dashed border-slate-700/50 opacity-40 backdrop-blur-sm cursor-not-allowed select-none'
                          : 'bg-slate-800/80 hover:bg-emerald-950/40 border-slate-700 hover:border-emerald-500/60 transform hover:-translate-y-0.5 group cursor-pointer'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xl">{lvl.icon}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black font-mono ${
                            isLocked
                              ? 'bg-slate-800 text-slate-400 flex items-center gap-1'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {isLocked && <Lock className="w-2.5 h-2.5" />}
                            Dünya #{lvl.no} {isLocked ? '(Kilitli)' : ''}
                          </span>
                        </div>
                        <h4 className={`font-bold text-sm transition-colors ${
                          isLocked ? 'text-slate-400' : 'text-slate-100 group-hover:text-emerald-300'
                        }`}>
                          {lvl.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                          {isLocked ? '🔒 Bu bölüme girmek için ilk 14 seviyeyi tamamlamalısın.' : lvl.desc}
                        </p>
                      </div>
                      <div className={`mt-3 flex items-center justify-between text-[11px] font-bold pt-2 border-t ${
                        isLocked
                          ? 'text-slate-500 border-slate-800'
                          : 'text-emerald-400 border-slate-700/60'
                      }`}>
                        <span>{isLocked ? '🔒 Kilitli Bölüm' : 'Bölüme Işınlan'}</span>
                        {!isLocked && <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* THE PROMINENT RED LINE BORDER DIVIDER */}
          {(selectedFilter === 'all' || selectedFilter === 'space') && (
            <div className="relative py-4 my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-4 border-dashed border-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.8)]"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 py-1.5 rounded-full bg-red-600 text-white font-black text-xs uppercase tracking-widest border-2 border-red-300 shadow-xl flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 animate-bounce" />
                  <span>KIRMIZI ÇİZGİ BÖLGESİ — UZAY BAŞLANGICI</span>
                  <Flame className="w-4 h-4 animate-bounce" />
                </span>
              </div>
            </div>
          )}

          {/* SECTION 2: 7 UZAY BÖLÜMÜ */}
          {(selectedFilter === 'all' || selectedFilter === 'space') && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Rocket className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-black uppercase tracking-wider text-indigo-300">
                  🌌 Uzay Bölümleri (1 - 7) — Kasklı Canlılar & Bosslar
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {spaceLevels.map((lvl) => {
                  const isBoss = !!lvl.boss;
                  return (
                    <button
                      key={lvl.id}
                      disabled={true}
                      onClick={() => handleSelectLevel(lvl.id, lvl.no + 15, false)}
                      className="p-3.5 rounded-2xl border border-dashed border-slate-700/50 bg-slate-900/30 opacity-40 backdrop-blur-sm cursor-not-allowed select-none text-left flex flex-col justify-between shadow-inner"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xl">{lvl.icon}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black font-mono bg-slate-800 text-slate-400 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            {lvl.boss ? '👑 BOSS (Kilitli)' : `Uzay #${lvl.no} (Kilitli)`}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-400">
                          {lvl.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                          🔒 Bu uzay bölümü kilitlidir. İlk 14 Dünya bölümünü tamamlayarak açın.
                        </p>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-[11px] font-bold pt-2 border-t text-slate-500 border-slate-800">
                        <span>🔒 Kilitli Bölüm</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* THE PROMINENT GREEN LINE BORDER DIVIDER (YEŞİL ÇİZGİ) */}
          {(selectedFilter === 'all' || selectedFilter === 'space' || selectedFilter === 'poneix') && (
            <div className="relative py-5 my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-4 border-dashed border-emerald-400 animate-pulse shadow-[0_0_20px_rgba(52,211,153,0.9)]"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 py-2 rounded-full bg-emerald-600 text-white font-black text-xs uppercase tracking-widest border-2 border-emerald-300 shadow-2xl flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-bounce text-emerald-200" />
                  <span>YEŞİL ÇİZGİ BÖLGESİ — PONEİX GEZEGENİ (GÜNCELLEMEYLE UZAYAN HİKAYE)</span>
                  <Flame className="w-4 h-4 animate-bounce text-amber-300" />
                </span>
              </div>
            </div>
          )}

          {/* SECTION 3: 7 PONEİX GEZEGENİ BÖLÜMÜ */}
          {(selectedFilter === 'all' || selectedFilter === 'poneix') && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-sm">
                    🪐
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-emerald-300">
                    🪐 Poneix Gezegeni Bölümleri (1 - 7) — Yeşil Çizgi & Hikaye Modu
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/40 animate-pulse">
                  📜 Güncellemelerle Devam Eden Hikaye
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {poneixLevels.map((lvl) => {
                  return (
                    <button
                      key={lvl.id}
                      disabled={true}
                      onClick={() => handleSelectLevel(lvl.id, lvl.no + 22, false)}
                      className="p-3.5 rounded-2xl border border-dashed border-slate-700/50 bg-slate-900/30 opacity-40 backdrop-blur-sm cursor-not-allowed select-none text-left flex flex-col justify-between shadow-inner"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xl">{lvl.icon}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black font-mono bg-slate-800 text-slate-400 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            {lvl.boss ? '👑 FİNAL (Kilitli)' : `Poneix #${lvl.no} (Kilitli)`}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-400">
                          {lvl.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                          🔒 Bu Poneix gezegeni bölümü kilitlidir. İlk 14 Dünya bölümünü tamamlayarak açın.
                        </p>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-[11px] font-bold pt-2 border-t text-slate-500 border-slate-800">
                        <span>🔒 Kilitli Bölüm</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* THE PROMINENT BLUE LINE (MAVİ ÇİZGİ) BORDER DIVIDER */}
          {(selectedFilter === 'all' || selectedFilter === 'phelix') && (
            <div className="relative py-4 my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-4 border-dashed border-sky-400 animate-pulse shadow-[0_0_20px_rgba(56,189,248,0.9)]"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 py-2 rounded-full bg-sky-600 text-white font-black text-xs uppercase tracking-widest border-2 border-sky-300 shadow-2xl flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-bounce text-sky-200" />
                  <span>MAVİ ÇİZGİ BÖLGESİ — PHELİX GEZEGENİ (9 BÖLÜM & TİLKİ BOSS)</span>
                  <Flame className="w-4 h-4 animate-bounce text-amber-300" />
                </span>
              </div>
            </div>
          )}

          {/* SECTION 4: 9 PHELİX GEZEGENİ BÖLÜMÜ */}
          {(selectedFilter === 'all' || selectedFilter === 'phelix') && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold text-sm">
                    🔷
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-sky-300">
                    🔷 Phelix Gezegeni Bölümleri (1 - 9) — Mavi Çizgi & Tilki Boss
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-sky-300 bg-sky-950/80 px-2.5 py-1 rounded-full border border-sky-500/40 animate-pulse">
                  🎬 Tilki Saldırısı & Paraşüt Sinematiği
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {phelixLevels.map((lvl) => {
                  return (
                    <button
                      key={lvl.id}
                      disabled={true}
                      onClick={() => handleSelectLevel(lvl.id, lvl.no + 29, false)}
                      className="p-3.5 rounded-2xl border border-dashed border-slate-700/50 bg-slate-900/30 opacity-40 backdrop-blur-sm cursor-not-allowed select-none text-left flex flex-col justify-between shadow-inner"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xl">{lvl.icon}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black font-mono bg-slate-800 text-slate-400 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            {lvl.boss ? '👑 FİNAL (Kilitli)' : `Phelix #${lvl.no} (Kilitli)`}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-400">
                          {lvl.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                          🔒 Bu Phelix gezegeni bölümü kilitlidir. İlk 14 Dünya bölümünü tamamlayarak açın.
                        </p>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-[11px] font-bold pt-2 border-t text-slate-500 border-slate-800">
                        <span>🔒 Kilitli Bölüm</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>38 Bölge: 15 Dünya + 7 Uzay (Kırmızı Çizgi) + 7 Poneix (Yeşil Çizgi) + 9 Phelix (Mavi Çizgi & Tilki Boss)!</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition cursor-pointer"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
