import React, { useState } from 'react';
import { Save, CheckCircle2, RotateCcw, Copy, Download, Upload, Shield, Coins, Sparkles, X, Heart, Globe, Award } from 'lucide-react';
import { useGameSave } from '../utils/saveManager';

interface SaveManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SaveManagerModal: React.FC<SaveManagerModalProps> = ({ isOpen, onClose }) => {
  const { saveData, manualSave, exportSave, importSave, resetSave } = useGameSave();
  const [copied, setCopied] = useState(false);
  const [importInput, setImportInput] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const currentSave = saveData || {
    goldBalance: 150,
    honeyGems: 2,
    level: 1,
    xp: 0,
    currentHp: 100,
    maxHp: 100,
    currentRegion: 'hub',
    unlockedLevelsMax: 14,
    aliensRescued: 0,
    lastSavedReadable: 'Şimdi',
    shopEquippedIds: ['back_royal_cape']
  };

  const handleManualSave = () => {
    const success = manualSave();
    if (success) {
      setSaveFeedback('✅ Tüm ilerleme, altınlar ve kuşanılan eşyalar başarıyla kaydedildi!');
      setTimeout(() => setSaveFeedback(null), 3500);
    }
  };

  const handleCopyExport = () => {
    const code = exportSave();
    if (code) {
      navigator.clipboard.writeText(code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }).catch(() => {
        // Fallback prompt
        window.prompt('Kayıt Kodunuz (Kopyalayın):', code);
      });
    }
  };

  const handleExecuteImport = () => {
    if (!importInput.trim()) return;
    const success = importSave(importInput.trim());
    if (!success) {
      alert('Geçersiz kayıt kodu! Lütfen geçerli bir kod yapıştırın.');
    }
  };

  const handleExecuteReset = () => {
    resetSave();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 select-none">
      {/* Floating Direct Close Button */}
      <button
        onClick={onClose}
        aria-label="Pencereyi Kapat"
        className="fixed top-2 right-2 sm:top-4 sm:right-4 z-[250] min-w-[46px] min-h-[46px] p-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black shadow-2xl border-2 border-rose-300 flex items-center justify-center transition active:scale-90 cursor-pointer"
        title="Kapat"
      >
        <X className="w-7 h-7 stroke-[3]" />
      </button>

      <div className="relative w-full max-w-xl bg-slate-900 border-2 border-emerald-500/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] sm:max-h-[92vh] animate-in zoom-in-95 duration-200 text-slate-100">
        
        {/* Pinned Sticky Header */}
        <div className="sticky top-0 z-40 px-3 sm:px-5 py-3 sm:py-4 bg-gradient-to-r from-emerald-900/90 via-teal-900/90 to-slate-900 border-b border-emerald-500/30 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-xl shadow-inner shrink-0">
              💾
            </div>
            <div>
              <h2 className="font-black text-base sm:text-xl text-white tracking-wide flex items-center gap-2">
                Oyun Kayıt & İlerleme
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-400/50 text-emerald-200 hidden xs:inline-block">
                  Yerel Hafıza
                </span>
              </h2>
              <p className="text-xs text-emerald-300/80 hidden sm:block">
                Altınlar, kuşanılan eşyalar ve bölüm ilerlemeleriniz otomatik korunur.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-w-[40px] min-h-[40px] rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center transition active:scale-95 cursor-pointer border border-slate-700"
            title="Kapat"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 overscroll-contain">
          
          {/* Feedback banner */}
          {saveFeedback && (
            <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-400 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{saveFeedback}</span>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
            {/* Gold Balance */}
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-amber-500/30 flex flex-col justify-between">
              <div className="flex items-center justify-between text-amber-400 text-xs font-bold">
                <span>Altın Bakiyesi</span>
                <Coins className="w-4 h-4" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-300 mt-1">
                {currentSave.goldBalance} 🪙
              </div>
              <div className="text-[10px] text-amber-200/60 mt-0.5">Harcanabilir Para</div>
            </div>

            {/* Honey Gems */}
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-yellow-500/30 flex flex-col justify-between">
              <div className="flex items-center justify-between text-yellow-400 text-xs font-bold">
                <span>Bal Kristali</span>
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-yellow-300 mt-1">
                {currentSave.honeyGems || 2} 🍯
              </div>
              <div className="text-[10px] text-yellow-200/60 mt-0.5">Nadir Kristal</div>
            </div>

            {/* Hero Level */}
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-cyan-500/30 flex flex-col justify-between col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-cyan-400 text-xs font-bold">
                <span>Kahraman</span>
                <Award className="w-4 h-4" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-cyan-300 mt-1">
                Sv. {currentSave.level || 1}
              </div>
              <div className="text-[10px] text-cyan-200/60 mt-0.5">{currentSave.xp || 0} XP Kazanıldı</div>
            </div>

            {/* Region / Map */}
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-teal-500/30 flex flex-col justify-between">
              <div className="flex items-center justify-between text-teal-400 text-xs font-bold">
                <span>Mevcut Bölge</span>
                <Globe className="w-4 h-4" />
              </div>
              <div className="text-sm font-black text-teal-200 mt-1 truncate capitalize">
                {currentSave.currentRegion || 'hub'}
              </div>
              <div className="text-[10px] text-teal-200/60 mt-0.5">{currentSave.unlockedLevelsMax || 14} Bölüm Açık</div>
            </div>

            {/* Rescued Aliens */}
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-purple-500/30 flex flex-col justify-between">
              <div className="flex items-center justify-between text-purple-400 text-xs font-bold">
                <span>Kurtarılan Uzaylı</span>
                <span>👽</span>
              </div>
              <div className="text-xl font-black text-purple-200 mt-1">
                {currentSave.aliensRescued || 0} / 30
              </div>
              <div className="text-[10px] text-purple-200/60 mt-0.5">Kozmik İlerleme</div>
            </div>

            {/* Health */}
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-rose-500/30 flex flex-col justify-between col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-rose-400 text-xs font-bold">
                <span>Can Durumu</span>
                <Heart className="w-4 h-4" />
              </div>
              <div className="text-xl font-black text-rose-300 mt-1">
                {currentSave.currentHp || 100} / {currentSave.maxHp || 100}
              </div>
              <div className="text-[10px] text-rose-200/60 mt-0.5">Sağlık Puanı</div>
            </div>
          </div>

          {/* Equipped items summary */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                <span>Kuşanılan Eşyalar & Kostümler</span>
              </div>
              <span className="text-[11px] text-indigo-300 font-mono">
                {currentSave.shopEquippedIds?.length || 1} Eşya Aktif
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(currentSave.shopEquippedIds || ['back_royal_cape']).map((id: string) => (
                <span
                  key={id}
                  className="px-2.5 py-1 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-200 text-xs font-bold flex items-center gap-1"
                >
                  <span>✨</span>
                  <span>{id.replace(/^([a-z]+_)/, '').replace(/_/g, ' ')}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Last Saved info badge */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs">
            <div className="flex items-center gap-2 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Son Otomatik Kayıt Zamanı:</span>
            </div>
            <span className="font-mono font-black text-emerald-200">
              {currentSave.lastSavedReadable || 'Şimdi'}
            </span>
          </div>

          {/* Import Code Input (Toggleable) */}
          {showImportBox && (
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-indigo-500/50 space-y-2.5 animate-in slide-in-from-top-2 duration-150">
              <div className="text-xs font-bold text-indigo-300">
                📥 Kayıt Kodunu Yapıştırın:
              </div>
              <textarea
                value={importInput}
                onChange={(e) => setImportInput(e.target.value)}
                placeholder="Buraya kopyalanan kayıt kodunu yapıştırın..."
                className="w-full h-20 p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs font-mono resize-none focus:outline-none focus:border-indigo-400"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowImportBox(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Vazgeç
                </button>
                <button
                  onClick={handleExecuteImport}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black"
                >
                  Kaydı Geri Yükle
                </button>
              </div>
            </div>
          )}

          {/* Reset Confirmation (Toggleable) */}
          {showResetConfirm && (
            <div className="p-3.5 rounded-2xl bg-rose-950/90 border border-rose-500 space-y-2 animate-in fade-in duration-150">
              <div className="font-black text-xs text-rose-200">
                ⚠️ Dikkat: Kayıt Sıfırlanacak!
              </div>
              <p className="text-[11px] text-rose-300">
                Tüm altınlarınız, kuşanılan eşyalarınız ve açılan bölümler varsayılan başlangıç değerlerine (150 Altın, 1. Seviye) döndürülecektir. Devam etmek istiyor musunuz?
              </p>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  İptal
                </button>
                <button
                  onClick={handleExecuteReset}
                  className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-lg"
                >
                  Evet, Sıfırla
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyExport}
              title="Kayıt dosyasını kopyalayarak başka tarayıcıya veya cihaza aktarın"
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-indigo-400" />
              <span>{copied ? 'Kopyalandı! ✔' : 'Kayıt Kodunu Kopyala'}</span>
            </button>

            <button
              onClick={() => setShowImportBox(prev => !prev)}
              title="Başka cihazdan veya yedekten kayıt kodu yükleyin"
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Yedek Yükle</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowResetConfirm(true)}
              title="Kayıt dosyasını sıfırla"
              className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/50 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleManualSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition transform active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Şimdi Kaydet</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
