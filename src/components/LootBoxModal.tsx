import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Package,
  Gift,
  Crown,
  Trophy,
  Sparkles,
  Zap,
  Repeat,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Coins,
  ChevronRight,
  Flame,
  Shield,
  Eye,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  SHOP_ITEMS,
  ShopItem,
  ItemRarity,
  RARITY_INFO,
  LOOT_BOX_PACKAGES,
  LootBoxPackage
} from '../data/shopItemsData';

interface LootBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerGold: number;
  onGoldChange?: (newGold: number) => void;
  purchasedIds: string[];
  onItemsPurchased?: (newPurchasedIds: string[]) => void;
}

interface OpenedItemResult {
  item: ShopItem;
  isDuplicate: boolean;
  refundGold: number;
}

export const LootBoxModal: React.FC<LootBoxModalProps> = ({
  isOpen,
  onClose,
  playerGold,
  onGoldChange,
  purchasedIds,
  onItemsPurchased
}) => {
  // Current modal state: 'select' | 'opening' | 'revealing' | 'summary'
  const [stage, setStage] = useState<'select' | 'opening' | 'revealing' | 'summary'>('select');
  const [activePackage, setActivePackage] = useState<LootBoxPackage | null>(null);
  
  // Results of the box opening
  const [results, setResults] = useState<OpenedItemResult[]>([]);
  const [currentRevealIndex, setCurrentRevealIndex] = useState<number>(0);
  const [chestShakePhase, setChestShakePhase] = useState<'idle' | 'shaking' | 'burst'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Audio Context for synthetic sound effects (Web Audio API)
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playChestRumbleSound = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(60, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {}
  }, [getAudioContext]);

  const playChestBurstSound = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      // Burst noise / explosion pop
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.2, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      noise.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start();
    } catch (e) {}
  }, [getAudioContext]);

  const playRarityFanfare = useCallback((rarity: ItemRarity) => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const playTone = (freq: number, start: number, duration: number, type: OscillatorType = 'sine', vol = 0.15) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(vol, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration);
      };

      if (rarity === 'legendary' || rarity === 'mythic') {
        // Triumphant fanfare
        playTone(523.25, now, 0.25, 'triangle', 0.2);       // C5
        playTone(659.25, now + 0.1, 0.25, 'triangle', 0.2); // E5
        playTone(783.99, now + 0.2, 0.25, 'triangle', 0.2); // G5
        playTone(1046.50, now + 0.32, 0.8, 'triangle', 0.25); // C6
      } else if (rarity === 'epic') {
        // Magic crystal chord
        playTone(440, now, 0.2, 'sine', 0.18);
        playTone(554.37, now + 0.08, 0.2, 'sine', 0.18);
        playTone(659.25, now + 0.16, 0.5, 'sine', 0.2);
      } else if (rarity === 'rare') {
        playTone(440, now, 0.2, 'sine', 0.15);
        playTone(587.33, now + 0.1, 0.4, 'sine', 0.15);
      } else {
        playTone(330, now, 0.25, 'sine', 0.1);
      }
    } catch (e) {}
  }, [getAudioContext]);

  // Roll a single item based on chest package drop rates
  const rollSingleItem = useCallback((pkg: LootBoxPackage, forceGuaranteeTier?: 'epic' | 'legendary'): ShopItem => {
    // 1. Determine rarity
    let chosenRarity: ItemRarity = 'common';

    if (forceGuaranteeTier === 'legendary') {
      chosenRarity = 'legendary';
    } else if (forceGuaranteeTier === 'epic') {
      chosenRarity = Math.random() < 0.35 ? 'legendary' : 'epic';
    } else {
      const rand = Math.random() * 100;
      let cumulative = 0;
      const r = pkg.rates;

      if (rand < (cumulative += r.mythic)) {
        chosenRarity = 'mythic';
      } else if (rand < (cumulative += r.legendary)) {
        chosenRarity = 'legendary';
      } else if (rand < (cumulative += r.epic)) {
        chosenRarity = 'epic';
      } else if (rand < (cumulative += r.rare)) {
        chosenRarity = 'rare';
      } else {
        chosenRarity = 'common';
      }
    }

    // 2. Filter available items by this rarity from master SHOP_ITEMS list
    let pool = SHOP_ITEMS.filter(item => item.rarity === chosenRarity);
    if (pool.length === 0) {
      pool = SHOP_ITEMS; // fallback
    }

    // 3. Pick random item from pool
    const selected = pool[Math.floor(Math.random() * pool.length)];
    return selected;
  }, []);

  // Open the selected package
  const handleOpenPackage = (pkg: LootBoxPackage) => {
    setErrorMessage(null);

    // Check gold
    if (playerGold < pkg.price) {
      setErrorMessage(`Yetersiz Altın! Bu kutuyu açmak için ${pkg.price} Altına ihtiyacın var. Mevcut Altının: ${playerGold}`);
      return;
    }

    // Deduct gold
    const newGold = playerGold - pkg.price;
    if (onGoldChange) {
      onGoldChange(newGold);
    }
    // Sync to global save manager
    const sm = (window as any).__superBearSaveManager;
    if (sm && typeof sm.updateGold === 'function') {
      sm.updateGold(newGold);
    }

    setActivePackage(pkg);
    setChestShakePhase('shaking');
    setStage('opening');
    playChestRumbleSound();

    // Roll items
    const rolledResults: OpenedItemResult[] = [];
    const currentOwned = new Set(purchasedIds);
    const updatedOwned = [...purchasedIds];

    for (let i = 0; i < pkg.count; i++) {
      // Check for bundle guarantee on the last or designated item
      let forceTier: 'epic' | 'legendary' | undefined = undefined;
      if (pkg.id === 'legendary_5_box' && i === 0) {
        forceTier = 'legendary'; // Guaranteed at least 1 legendary
      } else if (pkg.id === 'bundle_15_box' && i === 0) {
        forceTier = 'epic'; // Guaranteed at least 1 epic or higher
      }

      const item = rollSingleItem(pkg, forceTier);
      const isDuplicate = currentOwned.has(item.id);

      let refundGold = 0;
      if (isDuplicate) {
        // Consolation reward for duplicate
        const rank = RARITY_INFO[item.rarity]?.rank || 1;
        refundGold = 35 + rank * 25; // 60 to 160 refund
      } else {
        currentOwned.add(item.id);
        updatedOwned.push(item.id);
      }

      rolledResults.push({
        item,
        isDuplicate,
        refundGold
      });
    }

    // Process total refunds if any duplicates occurred
    const totalRefund = rolledResults.reduce((sum, r) => sum + r.refundGold, 0);
    if (totalRefund > 0) {
      const goldWithRefund = newGold + totalRefund;
      if (onGoldChange) onGoldChange(goldWithRefund);
      if (sm && typeof sm.updateGold === 'function') sm.updateGold(goldWithRefund);
    }

    // Persist new items
    if (onItemsPurchased && updatedOwned.length > purchasedIds.length) {
      onItemsPurchased(updatedOwned);
      localStorage.setItem('super_bear_purchased_items', JSON.stringify(updatedOwned));
      if (sm && typeof sm.saveGame === 'function') {
        sm.saveGame({ shopPurchasedIds: updatedOwned }, { immediate: true });
      }
    }

    // Animation timing: Shaking for 1.4s -> Burst -> Reveal
    setTimeout(() => {
      setChestShakePhase('burst');
      playChestBurstSound();

      setTimeout(() => {
        setResults(rolledResults);
        setCurrentRevealIndex(0);
        setStage('revealing');
        setChestShakePhase('idle');
        playRarityFanfare(rolledResults[0].item.rarity);
      }, 550);
    }, 1300);
  };

  // Move to next item or show summary
  const handleNextReveal = () => {
    if (currentRevealIndex + 1 < results.length) {
      const nextIdx = currentRevealIndex + 1;
      setCurrentRevealIndex(nextIdx);
      playRarityFanfare(results[nextIdx].item.rarity);
    } else {
      setStage('summary');
    }
  };

  const handleShowAllImmediately = () => {
    setStage('summary');
  };

  const handleResetToSelect = () => {
    setStage('select');
    setActivePackage(null);
    setResults([]);
    setCurrentRevealIndex(0);
    setChestShakePhase('idle');
    setErrorMessage(null);
  };

  if (!isOpen) return null;

  const currentItem = results[currentRevealIndex];
  const totalRefundAmount = results.reduce((acc, curr) => acc + curr.refundGold, 0);
  const newItemsCount = results.filter(r => !r.isDuplicate).length;
  const duplicateItemsCount = results.filter(r => r.isDuplicate).length;

  return (
    <div
      id="lootbox-modal-overlay"
      className="fixed inset-0 z-[120] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-1.5 sm:p-4 animate-in fade-in duration-200"
    >
      {/* Floating Direct Close Button */}
      <button
        onClick={onClose}
        aria-label="Pencereyi Kapat"
        className="fixed top-2 right-2 sm:top-4 sm:right-4 z-[250] min-w-[46px] min-h-[46px] p-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black shadow-2xl border-2 border-rose-300 flex items-center justify-center transition active:scale-90 cursor-pointer"
        title="Kapat"
      >
        <X className="w-7 h-7 stroke-[3]" />
      </button>

      <div
        id="lootbox-modal-container"
        className="relative w-full max-w-4xl bg-slate-900 border-2 border-amber-500/70 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] sm:max-h-[92vh]"
      >
        {/* Pinned Sticky Modal Header */}
        <div className="sticky top-0 z-40 px-3 sm:px-5 py-3 sm:py-4 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-slate-950 flex items-center justify-between border-b-2 border-amber-400/50 shrink-0 shadow-md">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-slate-950 border-2 border-amber-200 flex items-center justify-center text-xl sm:text-2xl shadow-lg animate-bounce shrink-0">
              🎁
            </div>
            <div>
              <h2 className="text-base sm:text-2xl font-black tracking-wider text-slate-950 flex items-center gap-2 line-clamp-1">
                ŞANS KUTULARI & SANDIKLAR
              </h2>
              <p className="text-xs font-bold text-slate-900/90 hidden sm:block">
                300 Farklı Kostüm & Ekipmanı Topla | Nadir, Süper Ender ve Efsanevi Eşyalar!
              </p>
            </div>
          </div>

          {/* Right Status (Gold Balance & Close) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-slate-950/90 border border-amber-400 text-amber-300 text-xs sm:text-sm font-black shadow-inner">
              <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-spin" />
              <span>{playerGold.toLocaleString('tr-TR')} 🟡</span>
            </div>

            <button
              onClick={onClose}
              className="min-w-[40px] min-h-[40px] rounded-xl bg-slate-950/90 hover:bg-rose-600 text-white flex items-center justify-center transition border border-amber-300/40 cursor-pointer active:scale-95"
              title="Kapat"
            >
              <X className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col">
          {/* Error Message Toast */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-900/60 border border-red-500/80 text-red-200 text-xs sm:text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* =================================================================== */}
          {/* 1. SELECTION STAGE: 4 CHEST PACKAGES ALIGNED VERTICALLY (ALT ALTA)   */}
          {/* =================================================================== */}
          {stage === 'select' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="text-sm font-bold text-slate-300">
                  Açmak istediğin kutu paketini seç (Kutulardan aynı eşyalar da çıkabilir, teselli altını verilir!):
                </div>
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> 4 Farklı Grup
                </div>
              </div>

              {/* 4 Packages Stacked Vertically (Alt Alta Hizalanmış) */}
              <div className="flex flex-col gap-3.5">
                {LOOT_BOX_PACKAGES.map((pkg) => {
                  const canAfford = playerGold >= pkg.price;
                  const isEfsaneviTier = pkg.isLegendaryTier;

                  return (
                    <div
                      key={pkg.id}
                      id={`lootbox-card-${pkg.id}`}
                      className={`relative p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        isEfsaneviTier
                          ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/80 hover:border-amber-400 shadow-lg shadow-amber-950/30'
                          : 'bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-slate-700 hover:border-sky-400 shadow-md'
                      }`}
                    >
                      {/* Badge if present */}
                      {pkg.badge && (
                        <div className="absolute -top-2.5 left-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] font-black tracking-wider uppercase shadow-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-slate-950" />
                          {pkg.badge}
                        </div>
                      )}

                      {/* Left: Icon and Details */}
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-xl shrink-0 border-2 bg-gradient-to-br ${pkg.themeGradient} ${
                            isEfsaneviTier ? 'border-amber-300 animate-pulse' : 'border-slate-600'
                          }`}
                        >
                          {pkg.icon}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base sm:text-lg font-black text-white">
                              {pkg.name}
                            </h3>
                            <span className="text-xs font-extrabold text-amber-400">
                              ({pkg.subtitle})
                            </span>
                          </div>

                          <p className="text-xs text-slate-400 mt-0.5 max-w-md">
                            {pkg.guaranteeText}
                          </p>

                          {/* Mini Drop Rates Bar */}
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            {pkg.rates.legendary > 0 && (
                              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black">
                                👑 %{pkg.rates.legendary} Efsanevi
                              </span>
                            )}
                            {pkg.rates.epic > 0 && (
                              <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-black">
                                ⚡ %{pkg.rates.epic} Süper Ender
                              </span>
                            )}
                            {pkg.rates.rare > 0 && (
                              <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-black">
                                💎 %{pkg.rates.rare} Ender
                              </span>
                            )}
                            {pkg.rates.common > 0 && (
                              <span className="px-2 py-0.5 rounded-md bg-slate-700 text-slate-300 text-[10px] font-bold">
                                ☘️ %{pkg.rates.common} Yaygın
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Price & Open Button */}
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end shrink-0 border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
                        <div className="text-right">
                          <div className="flex items-center gap-1.5 text-lg font-black text-amber-400 justify-end">
                            <Coins className="w-5 h-5 text-amber-400" />
                            <span>{pkg.price.toLocaleString('tr-TR')} 🟡</span>
                          </div>
                          {pkg.originalPrice && (
                            <div className="text-[11px] text-slate-500 line-through font-bold">
                              {pkg.originalPrice} 🟡
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleOpenPackage(pkg)}
                          disabled={!canAfford}
                          className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm tracking-wide flex items-center gap-2 shadow-lg transition transform active:scale-95 cursor-pointer ${
                            canAfford
                              ? isEfsaneviTier
                                ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500 text-slate-950 hover:brightness-110 shadow-amber-500/30'
                                : 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white hover:brightness-110 shadow-sky-500/30'
                              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                          }`}
                        >
                          <Gift className="w-4 h-4" />
                          <span>{canAfford ? 'KUTUYU AÇ' : 'YETERSİZ ALTIN'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* 2. OPENING ANIMATION STAGE: 3D-STYLE SHAKING & BURSTING CHEST      */}
          {/* =================================================================== */}
          {stage === 'opening' && activePackage && (
            <div className="flex-1 flex flex-col items-center justify-center py-10 relative overflow-hidden">
              {/* Radial Light Rays Backdrop */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-transparent blur-3xl animate-spin" style={{ animationDuration: '6s' }} />
              </div>

              {/* Shaking Chest Graphic */}
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-40 h-40 sm:w-48 sm:h-48 rounded-3xl border-4 flex items-center justify-center text-7xl sm:text-8xl shadow-2xl transition-all duration-300 relative ${
                    activePackage.isLegendaryTier
                      ? 'border-amber-400 bg-gradient-to-b from-amber-500 via-orange-600 to-amber-800 shadow-amber-500/50'
                      : 'border-sky-400 bg-gradient-to-b from-blue-500 via-indigo-600 to-purple-800 shadow-sky-500/50'
                  } ${
                    chestShakePhase === 'shaking'
                      ? 'animate-[bounce_0.25s_infinite] scale-105'
                      : chestShakePhase === 'burst'
                      ? 'scale-125 brightness-150 rotate-6'
                      : 'scale-100'
                  }`}
                >
                  {activePackage.icon}

                  {/* Sparkle effects radiating */}
                  {chestShakePhase === 'shaking' && (
                    <div className="absolute -inset-4 rounded-3xl border-2 border-amber-300/60 animate-ping" />
                  )}
                </div>

                <div className="mt-6 text-center">
                  <h3 className="text-xl sm:text-2xl font-black text-amber-300 tracking-widest uppercase animate-pulse">
                    {chestShakePhase === 'burst' ? '💥 KUTU PATLIYOR...' : '⏳ KUTU AÇILIYOR...'}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 mt-1">
                    {activePackage.name} • {activePackage.count} Adet Eşya Paketi
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* 3. REVEALING STAGE: DRAMATIC ITEM POP-UP & RARITY GLOW             */}
          {/* =================================================================== */}
          {stage === 'revealing' && currentItem && (
            <div className="flex-1 flex flex-col items-center justify-center py-4 relative">
              {/* Rarity Aura Glow */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-35"
                style={{
                  background: `radial-gradient(circle, ${RARITY_INFO[currentItem.item.rarity]?.color || '#f59e0b'} 0%, transparent 65%)`
                }}
              />

              <div className="relative z-10 flex flex-col items-center max-w-lg w-full text-center">
                {/* Step indicator if multiple items */}
                {results.length > 1 && (
                  <div className="mb-3 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-black text-slate-300">
                    Açılan Eşya: {currentRevealIndex + 1} / {results.length}
                  </div>
                )}

                {/* Duplicate or New Badge */}
                <div className="mb-3">
                  {currentItem.isDuplicate ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/50 text-xs font-black animate-pulse">
                      <Repeat className="w-3.5 h-3.5" />
                      <span>🔁 TEKRAR ÇIKTI! (+{currentItem.refundGold} 🟡 Teselli İadesi)</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 text-xs font-black animate-bounce">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>✨ YENİ EŞYA AÇILDI! (Envanterine Eklendi)</span>
                    </div>
                  )}
                </div>

                {/* Item Card Pop-up */}
                <div
                  className={`w-full p-6 rounded-3xl border-2 bg-slate-950/80 backdrop-blur-md shadow-2xl flex flex-col items-center transition-all transform scale-100 ${
                    RARITY_INFO[currentItem.item.rarity]?.border || 'border-amber-500'
                  }`}
                  style={{
                    boxShadow: `0 0 35px ${RARITY_INFO[currentItem.item.rarity]?.glowColor || 'rgba(245,158,11,0.5)'}`
                  }}
                >
                  {/* Item Icon Box */}
                  <div
                    className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl mb-4 border-2 shadow-xl"
                    style={{
                      backgroundColor: `${currentItem.item.color}25`,
                      borderColor: currentItem.item.color || '#f59e0b'
                    }}
                  >
                    {currentItem.item.category === 'hats' && '🎩'}
                    {currentItem.item.category === 'face' && '👓'}
                    {currentItem.item.category === 'back' && '🧣'}
                    {currentItem.item.category === 'skins' && '🐻'}
                    {currentItem.item.category === 'hand' && '⚔️'}
                    {currentItem.item.category === 'auras' && '✨'}
                    {currentItem.item.category === 'potions' && '🧪'}
                  </div>

                  {/* Rarity Pill */}
                  <div className="mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black border uppercase tracking-wider ${
                        RARITY_INFO[currentItem.item.rarity]?.badgeBg
                      } ${RARITY_INFO[currentItem.item.rarity]?.badgeText} ${
                        RARITY_INFO[currentItem.item.rarity]?.border
                      }`}
                    >
                      {currentItem.item.rarity === 'legendary' && '👑 EFSANEVİ'}
                      {currentItem.item.rarity === 'epic' && '⚡ SÜPER ENDER'}
                      {currentItem.item.rarity === 'rare' && '💎 ENDER'}
                      {currentItem.item.rarity === 'common' && '☘️ YAYGIN'}
                      {currentItem.item.rarity === 'mythic' && '🌟 MİTİK'}
                    </span>
                  </div>

                  {/* Item Name */}
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                    {currentItem.item.name}
                  </h3>

                  {/* Category & Slot */}
                  <div className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wide">
                    Kategori: {currentItem.item.category} • Yuva: {currentItem.item.slot}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 mt-2 max-w-sm">
                    {currentItem.item.description}
                  </p>

                  {/* Stats if available */}
                  {currentItem.item.stats && (
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-3 pt-3 border-t border-slate-800 w-full">
                      {currentItem.item.stats.attack && (
                        <span className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-black">
                          ⚔️ +{currentItem.item.stats.attack} Saldırı
                        </span>
                      )}
                      {currentItem.item.stats.defense && (
                        <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-black">
                          🛡️ +{currentItem.item.stats.defense} Savunma
                        </span>
                      )}
                      {currentItem.item.stats.maxHp && (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black">
                          ❤️ +{currentItem.item.stats.maxHp} Can
                        </span>
                      )}
                      {currentItem.item.stats.speed && (
                        <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black">
                          ⚡ +{currentItem.item.stats.speed} Hız
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions: Next Reveal or Show All */}
                <div className="flex items-center gap-3 mt-5 w-full justify-center">
                  {results.length > 1 && currentRevealIndex + 1 < results.length && (
                    <button
                      onClick={handleShowAllImmediately}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition"
                    >
                      ⚡ Hepsini Hızlıca Göster
                    </button>
                  )}

                  <button
                    onClick={handleNextReveal}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/30 cursor-pointer active:scale-95 transition"
                  >
                    <span>
                      {currentRevealIndex + 1 < results.length
                        ? `Sıradaki Eşya (${currentRevealIndex + 2}/${results.length})`
                        : 'Sonuçları Gör'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* 4. SUMMARY STAGE: FULL REVEAL GRID WITH DUPLICATES & NEW BADGES    */}
          {/* =================================================================== */}
          {stage === 'summary' && activePackage && (
            <div className="flex-1 flex flex-col gap-4">
              {/* Summary Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <span>🎉 KUTU AÇILIMI TAMAMLANDI!</span>
                    <span className="text-xs font-bold text-amber-400">({activePackage.name})</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {newItemsCount} Yeni Eşya Açıldı • {duplicateItemsCount} Tekrar Eden Eşya
                  </p>
                </div>

                {totalRefundAmount > 0 && (
                  <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/60 text-amber-300 text-xs font-black flex items-center gap-1.5 shadow-sm">
                    <Coins className="w-4 h-4 text-amber-400" />
                    <span>+{totalRefundAmount} 🟡 Teselli Altını Hesabına Eklendi!</span>
                  </div>
                )}
              </div>

              {/* Grid of all won items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 overflow-y-auto max-h-[50vh] p-1">
                {results.map((res, idx) => {
                  const rInfo = RARITY_INFO[res.item.rarity];

                  return (
                    <div
                      key={`${res.item.id}-${idx}`}
                      className={`p-3.5 rounded-2xl border bg-slate-950/90 flex items-center gap-3 transition ${
                        rInfo?.border || 'border-slate-800'
                      }`}
                    >
                      {/* Icon */}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 border"
                        style={{
                          backgroundColor: `${res.item.color}20`,
                          borderColor: res.item.color
                        }}
                      >
                        {res.item.category === 'hats' && '🎩'}
                        {res.item.category === 'face' && '👓'}
                        {res.item.category === 'back' && '🧣'}
                        {res.item.category === 'skins' && '🐻'}
                        {res.item.category === 'hand' && '⚔️'}
                        {res.item.category === 'auras' && '✨'}
                        {res.item.category === 'potions' && '🧪'}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[9px] font-black px-1.5 py-0.5 rounded border uppercase ${rInfo?.badgeBg} ${rInfo?.badgeText} ${rInfo?.border}`}
                          >
                            {rInfo?.label || 'Eşya'}
                          </span>

                          {res.isDuplicate ? (
                            <span className="text-[9px] font-bold text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/30">
                              🔁 +{res.refundGold}🟡
                            </span>
                          ) : (
                            <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                              ✨ YENİ
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs font-black text-white truncate mt-1">
                          {res.item.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 capitalize">
                          {res.item.category} • {res.item.slot}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between border-t border-slate-800 pt-3 mt-auto">
                <button
                  onClick={handleResetToSelect}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 border border-slate-700 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Başka Kutu Aç</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenPackage(activePackage)}
                    disabled={playerGold < activePackage.price}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-lg shadow-amber-500/30 disabled:opacity-50 cursor-pointer active:scale-95 transition"
                  >
                    <Gift className="w-4 h-4" />
                    <span>Yeniden Aç ({activePackage.price} 🟡)</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs sm:text-sm font-black transition cursor-pointer"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
