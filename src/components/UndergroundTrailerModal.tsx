import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  X, 
  ChevronRight, 
  ChevronLeft,
  Camera,
  Film,
  Sparkles,
  Zap,
  Clock
} from 'lucide-react';

interface UndergroundTrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerEarthquakeInGame?: () => void;
}

interface MovieChapter {
  id: number;
  timeStart: number;
  timeEnd: number;
  title: string;
  badge: string;
  speaker: string;
  speakerColor: string;
  speakerBg: string;
  avatar: string;
  dialogue: string;
  summary: string;
  themeColor: string;
  boss: string;
}

const MOVIE_CHAPTERS: MovieChapter[] = [
  {
    id: 1,
    timeStart: 0,
    timeEnd: 35,
    title: "1. BÖLÜM: YERİN YARILDIĞI AN & MAGMA DÜŞÜŞÜ",
    badge: "FELAKETİN BAŞLANGICI",
    speaker: "🐻 SÜPER AYI (GRIZZY)",
    speakerColor: "#f59e0b",
    speakerBg: "rgba(245, 158, 11, 0.2)",
    avatar: "🐻",
    dialogue: "Dur bir dakika... Zemin titriyor! HERKES TUTUNSUN, YER İKİYE YARILIYOR! AŞAĞI DÜŞÜYORUZ!",
    summary: "Neşeli köy 10 şiddetindeki devasa depremle ikiye yarılırken Süper Ayı dipsiz lav yarıklarına düşüyor...",
    themeColor: "border-red-500 text-red-400",
    boss: "Tektonik Zemin Yarığı & Heyelanlar"
  },
  {
    id: 2,
    timeStart: 35,
    timeEnd: 70,
    title: "2. BÖLÜM: MAGMA SOLUCANLARI & KOR TÜNELLER",
    badge: "1800°C KOR KANYONU",
    speaker: "🐱 KEDİ BONCUK (TÜCCAR)",
    speakerColor: "#fb923c",
    speakerBg: "rgba(251, 146, 60, 0.2)",
    avatar: "🐱",
    dialogue: "Aman Tanrım! 1800 derece sıcaklıkta devasa zırhlı bir Lav Solucanı duvardan fırladı! ÇABUK KAÇIN!",
    summary: "Ateş nehirleri ve bazalt duvarları delen dev magma solucanları alev püskürtüyor!",
    themeColor: "border-orange-500 text-orange-400",
    boss: "Kızıl Çeneli Magma Solucanı (Titan Worm)"
  },
  {
    id: 3,
    timeStart: 70,
    timeEnd: 105,
    title: "3. BÖLÜM: KRALİÇE KÖSTEBEK & BUHARLI MATKAP MADENLERİ",
    badge: "SANAYİ & MADEN İMPARATORLUĞU",
    speaker: "⛏️ KRALİÇE KÖSTEBEK (MECHA DRILL)",
    speakerColor: "#eab308",
    speakerBg: "rgba(234, 179, 8, 0.2)",
    avatar: "⛏️",
    dialogue: "Biz yeraltının kadim efendileriyiz! Matkap ordusu, bu davetsiz misafiri derhal durdurun!",
    summary: "Zırhlı köstebek ordusu ve devasa buharlı elmas matkap tankları gezegenin çekirdeğini kazıyor!",
    themeColor: "border-yellow-500 text-yellow-400",
    boss: "Matkap Tanklı Kraliçe Köstebek"
  },
  {
    id: 4,
    timeStart: 105,
    timeEnd: 140,
    title: "4. BÖLÜM: BİYOLÜMİNESANS KRİSTAL MAĞARALARI",
    badge: "YERÇEKİMSİZ ABİS",
    speaker: "🐻 SÜPER AYI",
    speakerColor: "#38bdf8",
    speakerBg: "rgba(56, 189, 248, 0.2)",
    avatar: "💎",
    dialogue: "İnanılmaz bir parıltı... Bu mavi neon kristaller yerçekimini büküyor! Havada süzülüyorum!",
    summary: "Işıldayan devasa kuvars kristalleri yerçekimini tersine çeviriyor, kristal titan uyanıyor.",
    themeColor: "border-cyan-500 text-cyan-400",
    boss: "Kristal Muhafız Golem (Prism Titan)"
  },
  {
    id: 5,
    timeStart: 140,
    timeEnd: 175,
    title: "5. BÖLÜM: KADİM DİNOZOR VE CANAVAR FOSİL MEZARLIĞI",
    badge: "TARİH ÖNCESİ UÇURUM",
    speaker: "🐱 KEDİ BONCUK",
    speakerColor: "#a8a29e",
    speakerBg: "rgba(168, 162, 158, 0.2)",
    avatar: "🦖",
    dialogue: "Burası milyonlarca yıllık dev dinozorların mezarlığı! İskelet omurga köprülerinden çok dikkatli geç!",
    summary: "Devasa T-Rex ve ejderha fosillerinin asma köprüleri arasında kadim fosil hayaletleri dolaşıyor.",
    themeColor: "border-stone-400 text-stone-300",
    boss: "Fosil Ejderhası İskeleti (Ancient Wyrm)"
  },
  {
    id: 6,
    timeStart: 175,
    timeEnd: 210,
    title: "6. BÖLÜM: DEV ZEHİRLİ MANTAR ORMANI & SPOR FIRTINASI",
    badge: "BİYOLOJİK SPOR TEHLİKESİ",
    speaker: "🍄 MANTAR KRALİÇESİ",
    speakerColor: "#34d399",
    speakerBg: "rgba(52, 211, 153, 0.2)",
    avatar: "🍄",
    dialogue: "Ormanımızın derinliklerine hoş geldiniz... Bu trambolin mantarlar sizi doğrudan spor fırtınasına fırlatacak!",
    summary: "15 metrelik dev şapkalı zıplatan mantarlar ve havada parlayan zehirli spor bulutları.",
    themeColor: "border-emerald-500 text-emerald-400",
    boss: "Anaç Mantar Kraliçesi (Fungal Empress)"
  },
  {
    id: 7,
    timeStart: 210,
    timeEnd: 245,
    title: "7. BÖLÜM: OBSİDYEN LAV ŞELALELERİ & TİTAN DEMİRHANESİ",
    badge: "VOLKANİK OCAK",
    speaker: "🔥 TİTAN DEMİRCİSİ",
    speakerColor: "#f87171",
    speakerBg: "rgba(248, 113, 113, 0.2)",
    avatar: "🔥",
    dialogue: "Kızgın lavda en sert çeliği döveriz! Karşınızda yeraltının en kudretli silahı: MAGMA ÇEKİRDEK BIÇAĞI!",
    summary: "Akan simsiyah obsidyen lav şelalelerinin arkasında dev titan örsü ve efsanevi magma kılıcı dövülüyor.",
    themeColor: "border-red-600 text-red-500",
    boss: "Obsidyen Dövme Titanı (Magma Blacksmith)"
  },
  {
    id: 8,
    timeStart: 245,
    timeEnd: 275,
    title: "8. BÖLÜM: KAYIP YERALTI MEDENİYETİ ANTİK TAPINAĞI",
    badge: "KAYIP METROPOL",
    speaker: "🏛️ KADİM NÖBETÇİ (SENTINEL)",
    speakerColor: "#fde047",
    speakerBg: "rgba(253, 224, 71, 0.2)",
    avatar: "🏛️",
    dialogue: "Binlerce yıldır uyuyan altın piramidin kapıları aralanıyor... Yalnızca layık olanlar geçebilir!",
    summary: "Gezegenin binlerce metre altına gömülmüş altın rünlü sütunlar ve lazer gözlü koruyucu heykeller.",
    themeColor: "border-amber-400 text-amber-300",
    boss: "Kadim Yeraltı Muhafızı (Subterranean Sentinel)"
  },
  {
    id: 9,
    timeStart: 275,
    timeEnd: 300,
    title: "9. BÖLÜM: ÇEKİRDEK İMPARATORU & TİTAN SOLUCAN BOSS",
    badge: "20:00 NİHAİ FİNALİ",
    speaker: "👑 KOZMİK YERALTI LEVIATHAN'I",
    speakerColor: "#c084fc",
    speakerBg: "rgba(192, 132, 252, 0.25)",
    avatar: "👑",
    dialogue: "KİMSİNİZ SİZ KÜÇÜK YARATIKLAR?! BU DÜNYA BENİM ÇEKİRDEĞİMDİR! 20:00'DE HER ŞEY YOK OLACAK!",
    summary: "Gezegenin merkezindeki 60 metrelik kozmik abis yaratığı uyanıyor! 20:00 Güncellemesi Büyük Finali!",
    themeColor: "border-purple-500 text-purple-300",
    boss: "YERALTI LEVIATHAN'I & KOZMİK ÇEKİRDEK İBLİSİ"
  }
];

export const UndergroundTrailerModal: React.FC<UndergroundTrailerModalProps> = ({
  isOpen,
  onClose
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.5 | 2>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraMode, setCameraMode] = useState<'cinematic' | 'action' | 'drone' | 'boss'>('cinematic');
  const timerRef = useRef<number | null>(null);

  // Active chapter
  const currentChapter = MOVIE_CHAPTERS.find(c => currentTime >= c.timeStart && currentTime < c.timeEnd) || MOVIE_CHAPTERS[MOVIE_CHAPTERS.length - 1];

  // When cinematic opens, trigger in-game 3D Director
  useEffect(() => {
    if (isOpen) {
      const director = (window as any).__superBearSubterraneanMovieDirector;
      if (director && typeof director.start === 'function') {
        director.start(currentChapter.id);
      }
    }
  }, [isOpen]);

  // Sync state with 3D Director
  useEffect(() => {
    const handleChapterChange = (e: any) => {
      if (e && e.detail && e.detail.currentTime !== undefined) {
        setCurrentTime(e.detail.currentTime);
      }
    };
    const handleTimeUpdate = (e: any) => {
      if (e && e.detail && e.detail.currentTime !== undefined) {
        setCurrentTime(e.detail.currentTime);
      }
    };

    window.addEventListener('superbear:movie-chapter-change', handleChapterChange);
    window.addEventListener('superbear:movie-time-update', handleTimeUpdate);
    return () => {
      window.removeEventListener('superbear:movie-chapter-change', handleChapterChange);
      window.removeEventListener('superbear:movie-time-update', handleTimeUpdate);
    };
  }, []);

  // Timer loop for video playback
  useEffect(() => {
    if (!isOpen) return;

    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + 0.5 * playbackSpeed;
          if (next >= 300) {
            setIsPlaying(false);
            return 300;
          }
          return next;
        });
      }, 500);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isPlaying, playbackSpeed]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Chapter jump handler
  const handleJumpToChapter = (chap: MovieChapter) => {
    setCurrentTime(chap.timeStart);
    setIsPlaying(true);
    const director = (window as any).__superBearSubterraneanMovieDirector;
    if (director && typeof director.setChapter === 'function') {
      director.setChapter(chap.id);
    }
  };

  const handleNextChapter = () => {
    const next = MOVIE_CHAPTERS.find(c => c.id === currentChapter.id + 1);
    if (next) handleJumpToChapter(next);
  };

  const handlePrevChapter = () => {
    const prev = MOVIE_CHAPTERS.find(c => c.id === currentChapter.id - 1);
    if (prev) handleJumpToChapter(prev);
    else setCurrentTime(0);
  };

  const handleTogglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    const director = (window as any).__superBearSubterraneanMovieDirector;
    if (director && typeof director.togglePause === 'function') {
      director.togglePause();
    }
  };

  const handleChangeSpeed = (spd: 1 | 1.5 | 2) => {
    setPlaybackSpeed(spd);
    const director = (window as any).__superBearSubterraneanMovieDirector;
    if (director && typeof director.setSpeed === 'function') {
      director.setSpeed(spd);
    }
  };

  const handleChangeCameraMode = (mode: 'cinematic' | 'action' | 'drone' | 'boss') => {
    setCameraMode(mode);
    const director = (window as any).__superBearSubterraneanMovieDirector;
    if (director && typeof director.setCameraMode === 'function') {
      director.setCameraMode(mode);
    }
  };

  const handleCloseCutscene = () => {
    const director = (window as any).__superBearSubterraneanMovieDirector;
    if (director && typeof director.stop === 'function') {
      director.stop(false);
    }
    onClose();
  };

  // Progress calculations
  const chapterDuration = currentChapter.timeEnd - currentChapter.timeStart;
  const chapterProgress = Math.min(100, Math.max(0, ((currentTime - currentChapter.timeStart) / chapterDuration) * 100));
  const totalProgress = (currentTime / 300) * 100;

  return (
    <div className="fixed inset-0 z-[1100] flex flex-col justify-between pointer-events-auto select-none font-sans">
      
      {/* 1. TOP CINEMATIC LETTERBOX BAR */}
      <div className="w-full bg-slate-950/95 border-b-2 border-amber-500/80 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-2xl backdrop-blur-md shrink-0">
        
        {/* Title & Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 via-orange-500 to-amber-400 p-0.5 shadow-[0_0_20px_rgba(245,158,11,0.5)]">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-xl">
              🌋
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-amber-300 text-sm sm:text-base tracking-wider">
                20:00 BÜYÜK YERALTI DÜNYASI SİNEMATİK FİLMİ
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-600 text-white animate-pulse">
                3D CANLI SİNEMA
              </span>
            </div>
            <div className="text-xs text-slate-300 font-semibold flex items-center gap-2">
              <span className="text-amber-400 font-bold">{currentChapter.title}</span>
              <span className="text-slate-500">•</span>
              <span className="font-mono text-slate-400">[{formatTime(currentTime)} / 05:00]</span>
            </div>
          </div>
        </div>

        {/* 9 Chapters Quick Navigation Pills (1 to 9) */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
          {MOVIE_CHAPTERS.map(chap => {
            const isCur = chap.id === currentChapter.id;
            return (
              <button
                key={chap.id}
                onClick={() => handleJumpToChapter(chap)}
                className={`px-2.5 py-1 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                  isCur 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md scale-105' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={chap.title}
              >
                <span>{chap.avatar}</span>
                <span>{chap.id}</span>
              </button>
            );
          })}
        </div>

        {/* Camera Angle Selector & Close */}
        <div className="flex items-center gap-2">
          {/* Camera Angles */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            {(['cinematic', 'action', 'drone', 'boss'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => handleChangeCameraMode(mode)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase transition cursor-pointer ${
                  cameraMode === mode
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {mode === 'cinematic' ? '🎥 Sinematik' : mode === 'action' ? '⚡ Aksiyon' : mode === 'drone' ? '🛸 Drone' : '👁️ Boss'}
              </button>
            ))}
          </div>

          {/* Skip / Exit Cinematic Button */}
          <button
            onClick={handleCloseCutscene}
            className="px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>Sinematikten Çık</span>
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* 2. CENTER SCREEN: CRYSTAL CLEAR 3D VIEW (No cards blocking the movie!) */}
      <div className="flex-1 pointer-events-none relative flex flex-col justify-between p-6">
        
        {/* Subtle Watermark in Center Top */}
        <div className="self-center px-4 py-1 rounded-full bg-slate-950/60 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs font-black tracking-widest uppercase flex items-center gap-2 shadow-lg">
          <Film className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Bölüm {currentChapter.id} / 9: {currentChapter.badge}</span>
        </div>

        {/* Boss Alert in Corner */}
        <div className="self-end px-3 py-1.5 rounded-xl bg-slate-950/75 backdrop-blur-md border border-red-500/40 text-xs text-red-300 font-bold shadow-lg">
          <span className="text-slate-400 font-normal">Aktif Tehdit: </span>
          <span className="text-red-400 font-black">{currentChapter.boss}</span>
        </div>

      </div>

      {/* 3. BOTTOM CINEMATIC LETTERBOX BAR & SUBTITLE BOX */}
      <div className="w-full bg-slate-950/95 border-t-2 border-amber-500/80 shadow-[0_-20px_50px_rgba(0,0,0,0.9)] backdrop-blur-md shrink-0 flex flex-col">
        
        {/* Timeline Progress Bar (Global 5-Minute Scrub) */}
        <div 
          className="relative w-full h-2 bg-slate-900 cursor-pointer overflow-hidden group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clickX / rect.width;
            const targetSec = Math.min(300, Math.max(0, percentage * 300));
            setCurrentTime(targetSec);
            const targetChap = MOVIE_CHAPTERS.find(c => targetSec >= c.timeStart && targetSec < c.timeEnd) || MOVIE_CHAPTERS[0];
            handleJumpToChapter(targetChap);
          }}
        >
          {/* Chapter markers */}
          {MOVIE_CHAPTERS.map(ch => (
            <div 
              key={ch.id}
              className="absolute top-0 bottom-0 w-0.5 bg-slate-950 z-20"
              style={{ left: `${(ch.timeStart / 300) * 100}%` }}
              title={ch.title}
            />
          ))}

          <div 
            className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 transition-all duration-150"
            style={{ width: `${totalProgress}%` }}
          />
        </div>

        {/* Subtitle & Character Speaking Area */}
        <div className="px-4 sm:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4 max-w-6xl mx-auto w-full">
          
          {/* Speaker Avatar & Dialogue Box */}
          <div className="flex items-center gap-4 flex-1">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-amber-500/60 flex items-center justify-center text-3xl sm:text-4xl shadow-xl shrink-0 animate-bounce">
              {currentChapter.avatar}
            </div>

            <div className="flex flex-col gap-1 text-left">
              <div className="inline-flex items-center gap-2">
                <span 
                  className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border shadow-sm"
                  style={{ 
                    color: currentChapter.speakerColor, 
                    backgroundColor: currentChapter.speakerBg,
                    borderColor: currentChapter.speakerColor
                  }}
                >
                  {currentChapter.speaker}
                </span>
                <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                  (Bölüm {currentChapter.id})
                </span>
              </div>

              <div className="text-sm sm:text-base font-bold text-white leading-relaxed drop-shadow-md">
                "{currentChapter.dialogue}"
              </div>
            </div>
          </div>

          {/* Playback Controls (Previous, Play/Pause, Next Chapter) */}
          <div className="flex items-center gap-3 shrink-0">
            
            <button
              onClick={handlePrevChapter}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title="Önceki Bölüm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleTogglePlay}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer active:scale-95"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Durdur</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Oynat</span>
                </>
              )}
            </button>

            <button
              onClick={handleNextChapter}
              disabled={currentChapter.id === 9}
              className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition cursor-pointer ${
                currentChapter.id === 9
                  ? 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg shadow-orange-600/30'
              }`}
              title="Sonraki Sahneye Geç"
            >
              <span>Sonraki Sahne ➔</span>
            </button>

            {/* Speed Selector */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              {([1, 1.5, 2] as const).map(spd => (
                <button
                  key={spd}
                  onClick={() => handleChangeSpeed(spd)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold transition cursor-pointer ${
                    playbackSpeed === spd
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Mute Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};
