import React from 'react';
import { Smartphone, Tablet, Monitor, Laptop, Mouse, Move, CheckCircle2, Sparkles, ChevronRight, Gamepad2, ArrowRight } from 'lucide-react';

export type ControlMode = 'touch' | 'mouse';

interface DeviceSelectionModalProps {
  isOpen: boolean;
  onSelectMode: (mode: ControlMode) => void;
  currentMode?: ControlMode;
  onClose?: () => void;
  canClose?: boolean;
}

export const DeviceSelectionModal: React.FC<DeviceSelectionModalProps> = ({
  isOpen,
  onSelectMode,
  currentMode = 'touch',
  onClose,
  canClose = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      {/* Crisp White Background Container as explicitly requested */}
      <div className="bg-white text-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl border-4 border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-300">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-6 py-6 text-white text-center relative shadow-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider mb-2 border border-white/30">
            <Sparkles className="w-3.5 h-3.5 text-yellow-200 animate-pulse" />
            <span>Süper Ayı Macerası • Hoş Geldin!</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-sm">
            Nasıl Oynamak İstersin?
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 font-medium max-w-lg mx-auto mt-1">
            Cihazını seçerek en akıcı kontrol deneyimiyle oyna. İstediğin zaman değiştirebilirsin!
          </p>
        </div>

        {/* Selection Cards Grid */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            
            {/* OPTION 1: MOBİL / TABLET (DOKUNMATİK) */}
            <div
              onClick={() => onSelectMode('touch')}
              className={`group relative rounded-3xl p-5 sm:p-6 border-3 transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-xl transform hover:-translate-y-1 ${
                currentMode === 'touch'
                  ? 'border-emerald-500 bg-emerald-50/60 ring-4 ring-emerald-500/20 shadow-lg'
                  : 'border-slate-200 bg-slate-50/80 hover:border-emerald-400 hover:bg-emerald-50/30'
              }`}
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black shadow-sm">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>MOBİL / TABLET</span>
                </span>
                {currentMode === 'touch' && (
                  <span className="flex items-center gap-1 text-emerald-600 text-xs font-black bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Seçili Mod</span>
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Dokunmatik Ekran
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Telefon ve tablet kullanıcıları için parmakla kaydırmalı sezgisel kontrol.
                </p>
              </div>

              {/* Visual Devices Illustration (Tablet + Phone + Finger Drag Gesture) */}
              <div className="my-5 py-4 px-3 rounded-2xl bg-white border border-slate-200/80 shadow-inner flex items-center justify-center gap-4">
                {/* Tablet Mockup */}
                <div className="w-16 h-22 rounded-xl bg-slate-800 border-2 border-slate-700 p-1 flex flex-col justify-between items-center shadow-md group-hover:scale-105 transition-transform">
                  <div className="w-2 h-0.5 rounded-full bg-slate-600"></div>
                  <div className="w-full h-14 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white">
                    <Tablet className="w-6 h-6" />
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                </div>

                {/* Gesture Indicator */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-pulse shadow-sm">
                    <Move className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black text-emerald-700 mt-1">
                    Parmağınla Sürükle
                  </span>
                </div>

                {/* Smartphone Mockup */}
                <div className="w-11 h-20 rounded-xl bg-slate-800 border-2 border-slate-700 p-1 flex flex-col justify-between items-center shadow-md group-hover:scale-105 transition-transform">
                  <div className="w-2 h-0.5 rounded-full bg-slate-600"></div>
                  <div className="w-full h-13 rounded-lg bg-gradient-to-tr from-teal-500 to-sky-400 flex items-center justify-center text-white">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="w-1 h-1 rounded-full bg-slate-600"></div>
                </div>
              </div>

              {/* Feature Bullets */}
              <div className="space-y-2 text-xs text-slate-600 mb-5">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-600 font-black">✓</span>
                  <span>Ekrana dokunup sürükleyerek <strong>sağa, sola, arkaya ve öne</strong> yönlendir</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-600 font-black">✓</span>
                  <span className="text-emerald-700 font-bold">⚡ Kasmayan 60 FPS Akıcı Mod: Tablet & telefonlarda donmayı önleyen özel optimizasyon</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-600 font-black">✓</span>
                  <span>Dokunmatik zıplama tuşu ve sanal joystick desteği</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-600 font-black">✓</span>
                  <span>Retro Arcade mini oyunlarında parmakla sürükleme</span>
                </div>
              </div>

              {/* Select Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectMode('touch');
                }}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 group-hover:scale-[1.02] transition cursor-pointer"
              >
                <span>📱 Telefon & Tablet Seç</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* OPTION 2: BİLGİSAYAR (KLAVYE & FARE) */}
            <div
              onClick={() => onSelectMode('mouse')}
              className={`group relative rounded-3xl p-5 sm:p-6 border-3 transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-xl transform hover:-translate-y-1 ${
                currentMode === 'mouse'
                  ? 'border-indigo-500 bg-indigo-50/60 ring-4 ring-indigo-500/20 shadow-lg'
                  : 'border-slate-200 bg-slate-50/80 hover:border-indigo-400 hover:bg-indigo-50/30'
              }`}
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-black shadow-sm">
                  <Monitor className="w-3.5 h-3.5" />
                  <span>BİLGİSAYAR / PC</span>
                </span>
                {currentMode === 'mouse' && (
                  <span className="flex items-center gap-1 text-indigo-600 text-xs font-black bg-indigo-100 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Seçili Mod</span>
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Klavye & Fare ile Oyna
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Masaüstü ve dizüstü bilgisayarlar için tam klavye ve fare hassasiyeti.
                </p>
              </div>

              {/* Visual Devices Illustration (Monitor + Laptop + Mouse) */}
              <div className="my-5 py-4 px-3 rounded-2xl bg-white border border-slate-200/80 shadow-inner flex items-center justify-center gap-4">
                {/* Desktop Screen Mockup */}
                <div className="w-20 h-18 rounded-lg bg-slate-800 border-2 border-slate-700 p-1 flex flex-col justify-between items-center shadow-md group-hover:scale-105 transition-transform">
                  <div className="w-full h-12 rounded bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white">
                    <Monitor className="w-6 h-6" />
                  </div>
                  <div className="w-4 h-1 rounded-full bg-slate-600"></div>
                </div>

                {/* Mouse Drag Indicator */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center animate-pulse shadow-sm">
                    <Mouse className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black text-indigo-700 mt-1">
                    Fareyle Sürükle
                  </span>
                </div>

                {/* Laptop Mockup */}
                <div className="w-18 h-18 rounded-lg bg-slate-800 border-2 border-slate-700 p-1 flex flex-col justify-between items-center shadow-md group-hover:scale-105 transition-transform">
                  <div className="w-full h-11 rounded bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div className="w-full h-2 rounded bg-slate-700 flex items-center justify-center">
                    <div className="w-3 h-0.5 bg-slate-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Feature Bullets */}
              <div className="space-y-2 text-xs text-slate-600 mb-5">
                <div className="flex items-start gap-2">
                  <span className="text-indigo-600 font-black">✓</span>
                  <span>Fare ile ekranda sürükleyerek <strong>sağa, sola ve arkaya</strong> yönlendir</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-indigo-600 font-black">✓</span>
                  <span><strong>WASD</strong> veya Yön Tuşlarıyla hareket, <strong>Space</strong> ile zıplama</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-indigo-600 font-black">✓</span>
                  <span><strong>E</strong> (Dükkan), <strong>J</strong> (Arcade), <strong>M</strong> (Harita) kısayolları</span>
                </div>
              </div>

              {/* Select Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectMode('mouse');
                }}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 group-hover:scale-[1.02] transition cursor-pointer"
              >
                <span>💻 Bilgisayar Seç</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Bottom Footer Info */}
          <div className="pt-2 text-center flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-600 font-medium">
              <Gamepad2 className="w-4 h-4 text-amber-500" />
              <span>Oyun içi ekranın üstündeki butondan kontrol modunu istediğin an değiştirebilirsin.</span>
            </div>
            {canClose && onClose && (
              <button
                onClick={onClose}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 underline cursor-pointer"
              >
                Kapat ve Oyuna Dön
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
