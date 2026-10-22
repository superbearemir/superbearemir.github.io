import React, { useState, useEffect } from 'react';
import { X, Lock, CheckCircle2, AlertTriangle, Sparkles, Navigation } from 'lucide-react';

export interface ChapterPortalInfo {
  id: string;
  chapterNum: number;
  targetRegion: string;
  title: string;
  subtitle: string;
  icon: string;
  colorName: string;
  colorHex: number;
  bgGradient: string;
  badgeColor: string;
}

export const ALL_15_CHAPTERS: ChapterPortalInfo[] = [
  {
    id: "hub",
    chapterNum: 1,
    targetRegion: "hub",
    title: "1. Bölüm: Ayı Köyü",
    subtitle: "Neşeli Ayı Köyü Meydanı & Bakkal",
    icon: "🐻",
    colorName: "Beyaz",
    colorHex: 0xffffff,
    bgGradient: "from-slate-700 to-slate-900",
    badgeColor: "bg-slate-200 text-slate-900"
  },
  {
    id: "forest_temple",
    chapterNum: 2,
    targetRegion: "forest_temple",
    title: "2. Bölüm: Orman Tapınağı",
    subtitle: "Sarmaşıklı Muhafız & Antik Tapınak",
    icon: "🏛️",
    colorName: "Zümrüt Yeşili",
    colorHex: 0x22c55e,
    bgGradient: "from-emerald-900/80 to-green-950",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
  },
  {
    id: "beehive",
    chapterNum: 3,
    targetRegion: "beehive",
    title: "3. Bölüm: Bal Kovanı",
    subtitle: "Zırhlı Mor Ayı & Dev Kovan Labirenti",
    icon: "🍯",
    colorName: "Altın Sarısı",
    colorHex: 0xfacc15,
    bgGradient: "from-amber-900/80 to-yellow-950",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40"
  },
  {
    id: "pelican_plains",
    chapterNum: 4,
    targetRegion: "pelican_plains",
    title: "4. Bölüm: Pelikan Ovaları",
    subtitle: "Gök Adaları & Fırtına Pelikan Lordu",
    icon: "🪶",
    colorName: "Gök Mavisi",
    colorHex: 0x38bdf8,
    bgGradient: "from-sky-900/80 to-blue-950",
    badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/40"
  },
  {
    id: "snow_desert",
    chapterNum: 5,
    targetRegion: "snow_desert",
    title: "5. Bölüm: Kar Vadisi",
    subtitle: "Buz Kanyonu & Dev Koca Ayak Yeti",
    icon: "❄️",
    colorName: "Buz Beyazı / Açık Mavi",
    colorHex: 0x93c5fd,
    bgGradient: "from-blue-900/80 to-slate-950",
    badgeColor: "bg-blue-400/20 text-blue-200 border-blue-400/40"
  },
  {
    id: "volcano_cave",
    chapterNum: 6,
    targetRegion: "volcano_cave",
    title: "6. Bölüm: Volkanik Mağara",
    subtitle: "Kızıl Ejderha Ignis & 19 Lav Aşaması",
    icon: "🌋",
    colorName: "Alev Kırmızısı",
    colorHex: 0xef4444,
    bgGradient: "from-red-950 to-orange-950",
    badgeColor: "bg-red-500/20 text-red-300 border-red-500/40"
  },
  {
    id: "underwater_palace",
    chapterNum: 7,
    targetRegion: "underwater_palace",
    title: "7. Bölüm: Su Altı Sarayı",
    subtitle: "Dev Neptün Kraken & Kristal Saray",
    icon: "🌊",
    colorName: "Turkuaz Deniz Mavisi",
    colorHex: 0x06b6d4,
    bgGradient: "from-cyan-950 to-teal-950",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
  },
  {
    id: "golden_sanctuary",
    chapterNum: 8,
    targetRegion: "golden_sanctuary",
    title: "8. Bölüm: Altın Cenneti",
    subtitle: "Altın Sikke İmparatoru & 14 Aşama",
    icon: "👑",
    colorName: "Parlak 24K Altın",
    colorHex: 0xfbbf24,
    bgGradient: "from-yellow-950 to-amber-950",
    badgeColor: "bg-yellow-400/20 text-yellow-300 border-yellow-400/40"
  },
  {
    id: "dinosaur_world",
    chapterNum: 9,
    targetRegion: "dinosaur_world",
    title: "9. Bölüm: Dinozor Dünyası",
    subtitle: "Dev T-Rex Boss & 14 Prehistorik Aşama",
    icon: "🦖",
    colorName: "Orman Yeşili",
    colorHex: 0x16a34a,
    bgGradient: "from-emerald-950 to-stone-950",
    badgeColor: "bg-green-500/20 text-green-300 border-green-500/40"
  },
  {
    id: "sugar_world",
    chapterNum: 10,
    targetRegion: "sugar_world",
    title: "10. Bölüm: Şeker Dünyası",
    subtitle: "Lolipop Kralı & 14 Tatlı Aşama",
    icon: "🍭",
    colorName: "Şeker Pembesi",
    colorHex: 0xf472b6,
    bgGradient: "from-pink-950 to-rose-950",
    badgeColor: "bg-pink-500/20 text-pink-300 border-pink-500/40"
  },
  {
    id: "jokerooms",
    chapterNum: 11,
    targetRegion: "jokerooms",
    title: "11. Bölüm: Jokerooms",
    subtitle: "Sarı Koridorlar & Şakacı Palyaço",
    icon: "🚪",
    colorName: "Sarı / Kehribar",
    colorHex: 0xfde047,
    bgGradient: "from-yellow-950 to-amber-950",
    badgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40"
  },
  {
    id: "ruin_village",
    chapterNum: 12,
    targetRegion: "ruin_village",
    title: "12. Bölüm: Yıkılmış Köy",
    subtitle: "Dev Palyaço Boss & 15 Harabe Aşama",
    icon: "🏚️",
    colorName: "Koyu Kül / Kırmızı",
    colorHex: 0x991b1b,
    bgGradient: "from-red-950 to-stone-950",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40"
  },
  {
    id: "water_cave",
    chapterNum: 13,
    targetRegion: "water_cave",
    title: "13. Bölüm: Su Mağarası",
    subtitle: "Dev Su Ejderhası & 14 Yeraltı Aşaması",
    icon: "💧",
    colorName: "Derin Su Mavisi",
    colorHex: 0x0284c7,
    bgGradient: "from-sky-950 to-indigo-950",
    badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/40"
  },
  {
    id: "bee_desert",
    chapterNum: 14,
    targetRegion: "bee_desert",
    title: "14. Bölüm: Arılar Çölü",
    subtitle: "Sobek Timsahı & 17 Piramit Aşaması",
    icon: "🏜️",
    colorName: "Çöl Kumu & Kehribar",
    colorHex: 0xd97706,
    bgGradient: "from-amber-950 to-orange-950",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40"
  },
  {
    id: "earth_summit",
    chapterNum: 15,
    targetRegion: "earth_summit",
    title: "15. Bölüm: Final Zirvesi",
    subtitle: "Moris Büyük Final & 18 Göksel Aşama",
    icon: "⛰️",
    colorName: "Kozmik Mor & Kızıl",
    colorHex: 0x701a75,
    bgGradient: "from-purple-950 to-rose-950",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40"
  }
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DimensionPortalModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeChapterId, setActiveChapterId] = useState<string>("hub");
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);

  // Sync active chapter on open
  useEffect(() => {
    if (isOpen) {
      setLockedNotice(null);
      if (typeof window !== "undefined" && (window as any).__currentMasterPortalChapter) {
        setActiveChapterId((window as any).__currentMasterPortalChapter.id || "hub");
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isUnlocked = (ch: ChapterPortalInfo): boolean => {
    if (ch.chapterNum <= 2) return true; // Hub & Orman Tapınağı are always open
    if (typeof window !== "undefined" && typeof (window as any).__isChapterUnlocked === "function") {
      return (window as any).__isChapterUnlocked(ch.targetRegion) || (window as any).__isChapterUnlocked(ch.id);
    }
    // Fallback: Check localStorage
    try {
      const raw = localStorage.getItem("super_bear_unlocked_chapters_v2");
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list) && (list.includes(ch.id) || list.includes(ch.targetRegion))) {
          return true;
        }
      }
    } catch (e) {}
    return false;
  };

  const handleSelectChapter = (ch: ChapterPortalInfo) => {
    const unlocked = isUnlocked(ch);

    if (!unlocked) {
      // User explicit prompt: "ona basınca diyecekki bu portala giemessin git bossu yen sonra gel desin ve kilit açılsın"
      const warningText = "⚠️ Bu portala giremezsin! Git boss'u yen sonra gel!";
      setLockedNotice(warningText);

      if (typeof window !== "undefined") {
        if ((window as any).St && (window as any).St.playDamage) {
          (window as any).St.playDamage();
        }
        const game = (window as any).__superBearGame;
        if (game && game.callbacks && game.callbacks.onShowNotice) {
          game.callbacks.onShowNotice(warningText, "warning");
        }
      }
      return;
    }

    // Unlocked!
    setLockedNotice(null);
    setActiveChapterId(ch.id);

    if (typeof window !== "undefined" && typeof (window as any).__setMasterPortalChapter === "function") {
      (window as any).__setMasterPortalChapter(ch.id);
    }
  };

  const handleTeleportNow = (ch: ChapterPortalInfo) => {
    if (!isUnlocked(ch)) {
      handleSelectChapter(ch);
      return;
    }

    if (typeof window !== "undefined" && typeof (window as any).__setMasterPortalChapter === "function") {
      (window as any).__setMasterPortalChapter(ch.id);
    }

    const game = (window as any).__superBearGame;
    if (game && game.loadRegion) {
      if ((window as any).St && (window as any).St.playPortal) (window as any).St.playPortal();
      if (game.callbacks && game.callbacks.onShowNotice) {
        game.callbacks.onShowNotice(`🌀 ${ch.title}'na Işınlanılıyor...`, "success");
      }
      onClose();
      setTimeout(() => {
        game.loadRegion(ch.targetRegion);
      }, 300);
    } else {
      onClose();
    }
  };

  const activeChapter = ALL_15_CHAPTERS.find((c) => c.id === activeChapterId) || ALL_15_CHAPTERS[0];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border-2 border-white/20 rounded-3xl shadow-2xl overflow-hidden text-white">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/30 flex items-center justify-center text-2xl shadow-inner">
              🌀
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-wide flex items-center gap-2">
                <span>Kadim Boyut Portalı</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white font-mono font-bold">15 BÖLÜM</span>
              </h2>
              <p className="text-xs text-slate-300">
                Hedefini seç, portalın rengi anında o bölüme dönüşsün!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition active:scale-95 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Locked Notice Banner */}
        {lockedNotice && (
          <div className="mx-6 mt-4 p-4 rounded-2xl bg-red-950/90 border-2 border-red-500 flex items-center gap-3 animate-in shake duration-200 shadow-xl">
            <AlertTriangle className="w-7 h-7 text-red-400 shrink-0 animate-bounce" />
            <div className="text-left">
              <div className="text-sm sm:text-base font-black text-red-100">
                {lockedNotice}
              </div>
              <p className="text-xs text-red-300 mt-0.5">
                Bu bölüm kilitlidir. Kilidi açmak için bir önceki bölümün son boss'unu yenip gelmelisin!
              </p>
            </div>
          </div>
        )}

        {/* Active Portal Status Bar */}
        <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-white/5 border border-white/15 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-6 h-6 rounded-full border-2 border-white shadow-lg animate-pulse"
              style={{ backgroundColor: `#${activeChapter.colorHex.toString(16).padStart(6, '0')}` }}
            />
            <div className="text-xs sm:text-sm">
              <span className="text-slate-400">Aktif Portal Rengi & Hedefi: </span>
              <strong className="text-white font-bold">{activeChapter.icon} {activeChapter.title}</strong>
              <span className="ml-2 text-xs text-amber-300 font-mono">({activeChapter.colorName})</span>
            </div>
          </div>
          <button
            onClick={() => handleTeleportNow(activeChapter)}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Hemen Işınlan</span>
          </button>
        </div>

        {/* 15 Chapters Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 custom-scrollbar">
          {ALL_15_CHAPTERS.map((ch) => {
            const unlocked = isUnlocked(ch);
            const isSelected = ch.id === activeChapterId;

            return (
              <div
                key={ch.id}
                onClick={() => handleSelectChapter(ch)}
                className={`relative group rounded-2xl p-4 border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-slate-800/90 border-2 border-white shadow-xl scale-[1.01]"
                    : unlocked
                    ? "bg-slate-800/50 hover:bg-slate-800 border-white/10 hover:border-white/30"
                    : "bg-slate-950/60 border-red-900/30 opacity-75 hover:opacity-100"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-xl shadow-inner">
                        {ch.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                          {ch.chapterNum}. Bölüm
                        </div>
                        <h3 className="text-sm font-black text-white leading-tight">
                          {ch.title.split(":")[1]?.trim() || ch.title}
                        </h3>
                      </div>
                    </div>

                    {/* Status Badge */}
                    {unlocked ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Açık</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/40 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>Kilitli</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                    {ch.subtitle}
                  </p>
                </div>

                {/* Bottom Color Swatch & Action */}
                <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/40 inline-block shrink-0"
                      style={{ backgroundColor: `#${ch.colorHex.toString(16).padStart(6, '0')}` }}
                    />
                    <span>{ch.colorName}</span>
                  </div>

                  {unlocked ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTeleportNow(ch);
                      }}
                      className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 transition"
                    >
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>{isSelected ? "Işınlan" : "Seç & Işınlan"}</span>
                    </button>
                  ) : (
                    <span className="text-[11px] font-bold text-red-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Boss Yenilmeli</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>💡 İpucu: Kilitli bölümler bir önceki bölümün Boss'unu yendiğinde otomatik açılır!</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
