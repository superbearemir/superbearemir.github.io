import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Rocket, 
  Zap, 
  Smile, 
  Paintbrush, 
  Lock, 
  Unlock, 
  Globe, 
  Clock, 
  Star,
  Layers,
  ChevronRight,
  ShieldAlert,
  Play
} from 'lucide-react';

interface DrawingInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTeleportToSpace?: () => void;
  aliensRescued?: number;
}

export const DrawingInspectorModal: React.FC<DrawingInspectorModalProps> = ({
  isOpen,
  onClose,
  onTeleportToSpace,
  aliensRescued = 0,
}) => {
  const [activeTab, setActiveTab] = useState<'drawing1' | 'drawing2' | 'drawing3'>('drawing1');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-slate-900/95 border border-purple-500/40 rounded-3xl shadow-2xl shadow-purple-900/30 text-white overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-900/60 via-slate-900 to-indigo-900/60 border-b border-purple-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-600/30 border border-purple-400/50 rounded-2xl text-purple-300 shadow-inner">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider">
                  🎨 Orijinal Çizim Tasarımları
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Oyuna Aktarıldı
                </span>
              </div>
              <h2 className="text-xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-amber-200">
                Kullanıcı Çizim Güncellemeleri & Uzay Haritası
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700/60"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 pt-3 gap-3">
          <button
            onClick={() => setActiveTab('drawing1')}
            className={`flex items-center gap-2 px-5 py-3 font-bold text-sm rounded-t-2xl transition border-t border-x ${
              activeTab === 'drawing1'
                ? 'bg-slate-900 border-purple-500/50 text-purple-300 shadow-lg'
                : 'bg-slate-950/40 border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Rocket className="w-4 h-4 text-purple-400" />
            <span>19.00 EN BÜYÜK Güncelleme (Uzay Bölümü)</span>
          </button>

          <button
            onClick={() => setActiveTab('drawing2')}
            className={`flex items-center gap-2 px-5 py-3 font-bold text-sm rounded-t-2xl transition border-t border-x ${
              activeTab === 'drawing2'
                ? 'bg-slate-900 border-purple-500/50 text-purple-300 shadow-lg'
                : 'bg-slate-950/40 border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>02.00 Güncellemesi (Köyler Birleşiyor & Mor Ayı)</span>
          </button>

          <button
            onClick={() => setActiveTab('drawing3')}
            className={`flex items-center gap-2 px-5 py-3 font-bold text-sm rounded-t-2xl transition border-t border-x ${
              activeTab === 'drawing3'
                ? 'bg-slate-900 border-yellow-500/50 text-yellow-300 shadow-lg'
                : 'bg-slate-950/40 border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-yellow-400" />
            <span>12. Bölüm: Jokerooms (Backrooms)</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'drawing1' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Banner */}
              <div className="relative p-6 rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/40 overflow-hidden shadow-xl">
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 mb-2">
                      <Clock className="w-3.5 h-3.5" /> 19.00 EN BÜYÜK GÜNCELLEME!
                    </span>
                    <h3 className="text-2xl font-black text-white">
                      Yeni Bölüm: Uzay Galaksi Hub & Gezegenler
                    </h3>
                    <p className="text-sm text-purple-200/80 mt-1 max-w-2xl">
                      Çiziminde belirttiğin 6 özel uzay orbu/gezegen türü, Işınlanma & Ateş Mekaniği, Dost Canlısı Uzaylı ve Mor Ayı'nın İni görevi oyuna eklendi.
                    </p>
                  </div>

                  {onTeleportToSpace && (
                    <button
                      onClick={() => {
                        onTeleportToSpace();
                        onClose();
                      }}
                      className="px-6 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold rounded-2xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 border border-purple-400/40 transition hover:scale-105 active:scale-95"
                    >
                      <Play className="w-5 h-5 fill-current" />
                      <span>Uzay Bölümüne Git!</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 6 Space Elements Breakdown from Drawing 1 */}
              <div>
                <h4 className="text-lg font-bold text-slate-200 mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400" />
                  <span>Çizimdeki 6 Uzay Elemanı & Gezegen Türleri</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Item 1 */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-orange-500/30 hover:border-orange-500/60 transition">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-orange-600/30 border border-orange-500/50 flex items-center justify-center text-orange-400 text-lg font-bold">
                        ☄️
                      </div>
                      <div>
                        <h5 className="font-bold text-orange-200 text-sm">Meteoritler & Krater Gezegeni</h5>
                        <p className="text-xs text-slate-400">Turuncu Volkanik Lav Gezegeni</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Kraterli zeminler, dönen meteor taşları ve sıçrayan lav platformları içerir.
                    </p>
                  </div>

                  {/* Item 2 */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-purple-500/30 hover:border-purple-500/60 transition">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-400 text-lg font-bold">
                        🕳️
                      </div>
                      <div>
                        <h5 className="font-bold text-purple-200 text-sm">Kara Delik & Solucan Deliği</h5>
                        <p className="text-xs text-slate-400">Mor Parçacıklı Uzay Portalı</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Yutucu çekim kuvvetine sahip koyu mor döner portal halkası ve uzay tozu efekti.
                    </p>
                  </div>

                  {/* Item 3 */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-cyan-500/30 hover:border-cyan-500/60 transition">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-cyan-600/30 border border-cyan-500/50 flex items-center justify-center text-cyan-400 text-lg font-bold">
                        🌌
                      </div>
                      <div>
                        <h5 className="font-bold text-cyan-200 text-sm">Galaksi Merkezi</h5>
                        <p className="text-xs text-slate-400">Mavi Parlayan Yıldız Çekirdeği</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Süzülen mavi uzay kristalleri, yerçekimsiz sıçrama havuzları ve uzay enerji orbları.
                    </p>
                  </div>

                  {/* Item 4 */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-amber-500/30 hover:border-amber-500/60 transition">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-amber-400 text-lg font-bold">
                        🌙
                      </div>
                      <div>
                        <h5 className="font-bold text-amber-200 text-sm">Aydan Düşen Parçalar</h5>
                        <p className="text-xs text-slate-400">Gümüş / Koyu Ay Asteroidleri</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Uzayda parkur yapabileceğin süzülen ay kayaları ve meteor patikaları.
                    </p>
                  </div>

                  {/* Item 5 */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-500/30 hover:border-emerald-500/60 transition">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 text-lg font-bold">
                        👽
                      </div>
                      <div>
                        <h5 className="font-bold text-emerald-200 text-sm">Yeşil Yaşam Gezegeni</h5>
                        <p className="text-xs text-slate-400">Dost Canlısı Uzaylı Adası</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Sevimli yeşil uzaylı yoldaşın doğduğu parlak yeşil kristal ada.
                    </p>
                  </div>

                  {/* Item 6 */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-pink-500/30 hover:border-pink-500/60 transition">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-pink-600/30 border border-pink-500/50 flex items-center justify-center text-pink-400 text-lg font-bold">
                        🐻‍❄️
                      </div>
                      <div>
                        <h5 className="font-bold text-pink-200 text-sm">Mor Ayı'nın İni (Lair)</h5>
                        <p className="text-xs text-slate-400">Gizemli Mor Şato Arenası</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      30 Uzaylıyı kurtardığında açılan efsanevi Mor Ayı Boss arenası!
                    </p>
                  </div>
                </div>
              </div>

              {/* New Mechanics & Locked Quest */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Mechanics Card */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-indigo-500/30 space-y-3">
                  <h4 className="font-bold text-indigo-300 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-indigo-400" />
                    <span>Yeni Mekanikler (Çizimden)</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px] border border-indigo-500/30">T</span>
                      <div>
                        <strong className="text-indigo-200">Işınlanma (Teleport Dash):</strong> İleri doğru ışın hızıyla sıçra ve arkanda yıldız tozu bırak.
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 font-mono text-[10px] border border-pink-500/30">F</span>
                      <div>
                        <strong className="text-pink-200">Lazer Ateş Etme:</strong> Uzay enerjisi patlaması fırlat.
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] border border-emerald-500/30">R</span>
                      <div>
                        <strong className="text-emerald-200">Dost Canlısı Uzaylı Yoldaş:</strong> Sevimli yeşil uzaylı arkadaşın seni takip eder ve yön gösterir.
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Alien Quest Progress */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-purple-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-purple-300 flex items-center gap-2">
                      {aliensRescued >= 30 ? (
                        <Unlock className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Lock className="w-5 h-5 text-amber-400" />
                      )}
                      <span>30 Uzaylı Kurtarma Görevi</span>
                    </h4>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      {aliensRescued} / 30
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    Uzay adalarındaki kafesleri kırarak uzaylı dostlarımızı kurtar! 30 uzaylıyı kurtardığında <strong className="text-purple-300">Mor Ayı'nın İni</strong> açılır.
                  </p>

                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
                    <div 
                      className="bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (aliensRescued / 30) * 100)}%` }}
                    />
                  </div>
                </div>

              </div>

            </div>
          )}

          {activeTab === 'drawing2' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Banner */}
              <div className="relative p-6 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-purple-950/80 border border-emerald-500/40 overflow-hidden shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-2">
                      <Globe className="w-3.5 h-3.5" /> 02.00 GÜNCELLEMESİ (KAÇIRMA!)
                    </span>
                    <h3 className="text-2xl font-black text-white">
                      Ayrı Köyler Birleşiyor & Yeni Emote & Sprey Boyalar!
                    </h3>
                    <p className="text-sm text-emerald-200/80 mt-1 max-w-2xl">
                      Çizim 2'deki kesintisiz gökkuşağı uzay köprüleri, Sprey boyama sprey kutuları, Shrek galaksi yolculuğu ve Mor Ayı aura dalgaları oyunda aktif.
                    </p>
                  </div>
                </div>
              </div>

              {/* Drawing 2 Elements */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Element 1 */}
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-emerald-500/30 space-y-2">
                  <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 w-fit">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-emerald-200">Ayrı Köyler Birleşiyor!</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Tüm adalar ve köyler devasa ışık köprüleriyle birbirine bağlandı. Yükleme ekranı olmadan dünyalar arasında akıcı geçiş yapabilirsin!
                  </p>
                </div>

                {/* Element 2 */}
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-purple-500/30 space-y-2">
                  <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 w-fit">
                    <Paintbrush className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-purple-200">Yeni Emote & Sprey Boya</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Yeşil Sprey, Mor Sprey ve Altın Sprey ile 3D dünyadaki duvarlara ve zeminlere uzaylı ve ayı grafitileri çizebilirsin! (Tuş: V)
                  </p>
                </div>

                {/* Element 3 */}
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-amber-500/30 space-y-2">
                  <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 w-fit">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-amber-200">Shrek'i Başka Galaksiye Götürüyor</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Uzay Hub'ındaki Shrek Roketi ve uzay gemisi ile Shrek'i diğer galaksilere taşıyan eğlenceli 3D animasyon sahnesi!
                  </p>
                </div>

              </div>

              {/* Mor Ayı Lair Spotlight */}
              <div className="p-6 rounded-3xl bg-slate-950/90 border border-purple-500/50 flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-purple-900/50 border border-purple-400/50 flex items-center justify-center text-4xl shadow-inner shrink-0">
                  🔮
                </div>
                <div>
                  <h4 className="text-lg font-black text-purple-200 mb-1">
                    Mor Ayı'nın İni (Mor Aurası & Işınları)
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Çiziminde yer alan Mor Ayı'nın İni, etrafında yükselen mor enerji ışınları ve mistik galaksi efektleriyle 3D olarak inşa edildi.
                  </p>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'drawing3' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="relative p-6 rounded-3xl bg-gradient-to-r from-yellow-950/80 via-slate-900 to-amber-950/80 border border-yellow-500/40 overflow-hidden shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 mb-2">
                      <ShieldAlert className="w-3.5 h-3.5" /> JOKEROOMS GÜNCELLEMESİ
                    </span>
                    <h3 className="text-2xl font-black text-white">
                      Yeni Bölüm: Jokerooms (Backrooms)
                    </h3>
                    <p className="text-sm text-yellow-200/80 mt-1 max-w-2xl">
                      Backrooms'un ikonik sarı duvarlı, tekinsiz koridor estetiği oyuna eklendi. Yaratık yok, sadece sonsuz sarı koridorlar ve komik yazılar var.
                    </p>
                  </div>
                  
                  <button
                    onClick={() => {
                      // Call the teleport function globally if available
                      if (window.__superBearSpaceEnhancer && window.__superBearSpaceEnhancer.teleportToJokerooms) {
                        window.__superBearSpaceEnhancer.teleportToJokerooms();
                        onClose();
                      } else {
                        // Fallback: alert or try raw teleport
                        alert("Jokerooms'a ışınlanılıyor...");
                        window.location.reload(); // Simple refresh to ensure game state picks it up
                      }
                    }}
                    className="px-6 py-3.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-extrabold rounded-2xl shadow-lg flex items-center justify-center gap-2 border border-amber-400/40 transition hover:scale-105 active:scale-95"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span>Jokerooms'a Git!</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950/90 border-t border-purple-500/30 flex items-center justify-between">
          <div className="text-xs text-purple-300/80 font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Kullanıcının 2 Adet Çizimi %100 Başarıyla 3D Oyuna Aktarıldı</span>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl transition border border-slate-700"
          >
            Anladım, Oyuna Dön
          </button>
        </div>

      </div>
    </div>
  );
};
