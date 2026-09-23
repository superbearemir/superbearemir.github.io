import React, { useState, useEffect } from 'react';
import { X, Trophy, Clock, CheckCircle2, Sparkles, RefreshCw, ChevronRight, Zap } from 'lucide-react';
import { dailyChallengesManager, DailyChallenge, DailyChallengesState, getTimeUntilDailyReset } from '../utils/dailyChallengesManager';
import { useLanguage } from '../i18n/LanguageContext';

interface DailyChallengesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMap?: () => void;
}

export const DailyChallengesModal: React.FC<DailyChallengesModalProps> = ({
  isOpen,
  onClose,
  onOpenMap
}) => {
  const { language } = useLanguage();
  const [challengesState, setChallengesState] = useState<DailyChallengesState>(() => dailyChallengesManager.getState());
  const [timeLeft, setTimeLeft] = useState(() => getTimeUntilDailyReset().formatted);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [claimingAllClear, setClaimingAllClear] = useState(false);
  const [justClaimedReward, setJustClaimedReward] = useState<string | null>(null);

  // Subscribe to daily challenges manager updates
  useEffect(() => {
    const unsubscribe = dailyChallengesManager.subscribe((newState) => {
      setChallengesState({ ...newState });
    });
    return unsubscribe;
  }, []);

  // Update countdown every second
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilDailyReset().formatted);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const isTr = language === 'tr';
  const completedCount = challengesState.challenges.filter(c => c.completed).length;
  const totalCount = challengesState.challenges.length;
  const allCompleted = totalCount > 0 && completedCount === totalCount;

  const handleClaim = (challenge: DailyChallenge) => {
    if (!challenge.completed || challenge.claimed || claimingId) return;
    setClaimingId(challenge.id);
    const result = dailyChallengesManager.claimReward(challenge.id);
    if (result.success) {
      setJustClaimedReward(`+${result.coinsAwarded} Altın!`);
      setTimeout(() => setJustClaimedReward(null), 3000);
    }
    setTimeout(() => setClaimingId(null), 400);
  };

  const handleClaimAllClear = () => {
    if (!allCompleted || challengesState.allClearClaimed || claimingAllClear) return;
    setClaimingAllClear(true);
    const result = dailyChallengesManager.claimAllClearReward();
    if (result.success) {
      setJustClaimedReward(`+${result.coinsAwarded} Büyük Bonus Altın!`);
      setTimeout(() => setJustClaimedReward(null), 3500);
    }
    setTimeout(() => setClaimingAllClear(false), 400);
  };

  const handleReroll = () => {
    dailyChallengesManager.rerollChallenges();
  };

  const handleFastTravel = (regionId: string) => {
    onClose();
    if (typeof window !== 'undefined') {
      const game = (window as any).__superBearGame;
      if (game && game.loadRegion) {
        game.loadRegion(regionId);
      } else {
        window.dispatchEvent(new CustomEvent('superbear:open-map-selector'));
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-[99999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 select-none animate-in fade-in duration-200 pointer-events-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-slate-950/95 border-2 border-amber-500/60 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Top Header */}
        <div className="p-3.5 sm:p-5 border-b border-amber-500/30 flex items-center justify-between bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20 border border-yellow-200">
              🎯
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-amber-300">
                  {isTr ? 'Günlük Görevler & Bonuslar' : 'Daily Challenges & Rewards'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 border border-amber-500/40 text-amber-300">
                  {completedCount}/{totalCount}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400">
                {isTr 
                  ? 'Bal topla, düşmanları devir ve bolca bonus altın kazan!'
                  : 'Collect honey, defeat enemies and earn bonus gold!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReroll}
              title={isTr ? 'Görevleri Yenile (Test / Reroll)' : 'Reroll Tasks'}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 transition cursor-pointer border border-slate-700 active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer border border-slate-700 active:scale-95"
              aria-label="Kapat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Status Bar */}
        <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-medium text-slate-400">
              {isTr ? 'Yenilenmeye Kalan:' : 'Refreshes in:'}
            </span>
            <span className="font-mono font-bold text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
              {timeLeft}
            </span>
          </div>

          {justClaimedReward && (
            <div className="flex items-center gap-1 text-[11px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 animate-pulse">
              <Sparkles className="w-3 h-3 text-emerald-300" />
              <span>{justClaimedReward}</span>
            </div>
          )}

          <div className="text-[11px] font-bold text-slate-400">
            {isTr ? 'Tarih:' : 'Date:'} <span className="text-slate-200">{challengesState.dateKey}</span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 p-3 sm:p-5 overflow-y-auto space-y-3.5 overscroll-contain">

          {/* Grand All-Clear Champion Reward Card */}
          <div className={`p-4 rounded-2xl border-2 transition-all relative overflow-hidden ${
            challengesState.allClearClaimed
              ? 'bg-slate-900/80 border-slate-800'
              : allCompleted
              ? 'bg-gradient-to-r from-amber-950/70 via-yellow-950/50 to-slate-900 border-amber-400 shadow-xl shadow-amber-500/10'
              : 'bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/30 border-amber-500/30'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                  challengesState.allClearClaimed
                    ? 'bg-slate-800 text-slate-500 border border-slate-700'
                    : allCompleted
                    ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 shadow-lg animate-bounce'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-black text-amber-300">
                      {isTr ? 'Günün Büyük Şampiyonluk Bonusu' : 'Daily Grand Champion Bonus'}
                    </h4>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/30">
                      {completedCount}/{totalCount}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    {isTr
                      ? 'Tüm 4 günlük görevi bitirince ekstra dev ödül kilidi açılır!'
                      : 'Complete all 4 daily tasks to unlock this massive bonus!'}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/30 text-amber-300 font-black text-[11px]">
                      +{challengesState.allClearRewardCoins} 🪙 Altın
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/30 text-amber-300 font-black text-[11px]">
                      +{challengesState.allClearRewardGems} 🍯 Kristal
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-sky-400/10 border border-sky-400/30 text-sky-300 font-black text-[11px]">
                      +{challengesState.allClearRewardXp} ⚡ XP
                    </span>
                  </div>
                </div>
              </div>

              {/* All-Clear Action Button */}
              <div className="shrink-0 flex items-center justify-end">
                {challengesState.allClearClaimed ? (
                  <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{isTr ? 'Büyük Ödül Alındı' : 'All-Clear Claimed'}</span>
                  </div>
                ) : allCompleted ? (
                  <button
                    onClick={handleClaimAllClear}
                    disabled={claimingAllClear}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/30 border border-yellow-200 hover:brightness-110 active:scale-95 transition transform flex items-center gap-2 cursor-pointer animate-pulse"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isTr ? 'BÜYÜK ÖDÜLÜ AL!' : 'CLAIM GRAND BONUS!'}</span>
                  </button>
                ) : (
                  <div className="w-full sm:w-36 text-right">
                    <div className="text-[10px] font-bold text-slate-400 mb-1">
                      {isTr ? `${totalCount - completedCount} görev kaldı` : `${totalCount - completedCount} tasks remaining`}
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-amber-400 h-full transition-all duration-300 rounded-full"
                        style={{ width: `${(completedCount / Math.max(1, totalCount)) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active Challenges List */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
              <span>{isTr ? 'Bugünün Aktif Görevleri' : 'Today\'s Active Tasks'}</span>
              <span className="text-amber-400 text-[10px]">
                {completedCount} / {totalCount} {isTr ? 'Tamamlandı' : 'Completed'}
              </span>
            </div>

            {challengesState.challenges.map((challenge) => {
              const isClaimed = challenge.claimed;
              const isCompleted = challenge.completed;
              const progressPct = Math.min(100, Math.round((challenge.progress / challenge.target) * 100));

              return (
                <div
                  key={challenge.id}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                    isClaimed
                      ? 'bg-slate-900/60 border-slate-800/80 opacity-75'
                      : isCompleted
                      ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-amber-400/80 shadow-md'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                        isClaimed
                          ? 'bg-slate-800 border border-slate-700 text-slate-500'
                          : isCompleted
                          ? 'bg-amber-500/20 border-2 border-amber-400 text-amber-300 shadow-inner'
                          : 'bg-slate-800/90 border border-slate-700 text-slate-200'
                      }`}>
                        {challenge.icon}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className={`text-xs sm:text-sm font-black ${isCompleted ? 'text-amber-300' : 'text-slate-100'}`}>
                            {isTr ? challenge.titleTr : challenge.titleEn}
                          </h5>
                          {challenge.category === 'honey' && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              🍯 {isTr ? 'Özel İstek' : 'Special'}
                            </span>
                          )}
                          {challenge.category === 'enemy' && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              ⚔️ {isTr ? 'Düşman Avı' : 'Enemy Hunt'}
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {isTr ? challenge.descTr : challenge.descEn}
                        </p>

                        {/* Rewards tags */}
                        <div className="flex items-center gap-1.5 pt-1">
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-extrabold text-[10px]">
                            +{challenge.rewardCoins} 🪙 {isTr ? 'Altın' : 'Coins'}
                          </span>
                          {challenge.rewardHoneyGems > 0 && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-extrabold text-[10px]">
                              +{challenge.rewardHoneyGems} 🍯 {isTr ? 'Kristal' : 'Gems'}
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-md bg-sky-500/10 border border-sky-500/30 text-sky-300 font-extrabold text-[10px]">
                            +{challenge.rewardXp} ⚡ XP
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Action / Status Button */}
                    <div className="shrink-0 flex flex-col items-end gap-1.5">
                      {isClaimed ? (
                        <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-emerald-400 font-black text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{isTr ? 'Alındı' : 'Claimed'}</span>
                        </div>
                      ) : isCompleted ? (
                        <button
                          onClick={() => handleClaim(challenge)}
                          disabled={claimingId === challenge.id}
                          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 border border-yellow-200 transition transform active:scale-95 cursor-pointer flex items-center gap-1.5 animate-pulse"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{isTr ? 'ÖDÜLÜ AL' : 'CLAIM'}</span>
                        </button>
                      ) : (
                        <div className="text-right">
                          <span className="text-xs font-mono font-black text-slate-300">
                            {challenge.progress} / {challenge.target}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span>{isTr ? 'İlerleme:' : 'Progress:'}</span>
                      <span className="font-mono font-bold text-slate-300">
                        {challenge.progress} / {challenge.target} ({progressPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/50">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCompleted
                            ? 'bg-gradient-to-r from-amber-400 to-yellow-300 shadow-sm'
                            : 'bg-gradient-to-r from-sky-500 to-teal-400'
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Level Travel Shortcuts */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="text-[11px] font-black uppercase text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{isTr ? 'Hızlı Bölüm Geçişi (Görevleri Tamamla)' : 'Quick Travel to Complete Tasks'}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => handleFastTravel('hub')}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-left transition active:scale-95 cursor-pointer"
              >
                <div className="text-xs font-black text-slate-200">⚽ Köy Meydanı</div>
                <div className="text-[10px] text-slate-400">Futbol & Altın</div>
              </button>
              <button
                onClick={() => handleFastTravel('beehive')}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-left transition active:scale-95 cursor-pointer"
              >
                <div className="text-xs font-black text-amber-300">🐝 Arı Kovanı</div>
                <div className="text-[10px] text-slate-400">Arılar & Bal Çömleği</div>
              </button>
              <button
                onClick={() => handleFastTravel('forest_temple')}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-left transition active:scale-95 cursor-pointer"
              >
                <div className="text-xs font-black text-emerald-300">🌿 Orman Tapınağı</div>
                <div className="text-[10px] text-slate-400">Çiçekler & Boss</div>
              </button>
              <button
                onClick={() => handleFastTravel('snow_desert')}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-left transition active:scale-95 cursor-pointer"
              >
                <div className="text-xs font-black text-sky-300">❄️ Kar Vadisi</div>
                <div className="text-[10px] text-slate-400">Kar Golemleri</div>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="text-slate-400 text-[11px]">
            {isTr ? 'Görevler her gece 00:00\'da yenilenir.' : 'Tasks refresh daily at midnight.'}
          </div>

          <div className="flex items-center gap-2">
            {onOpenMap && (
              <button
                onClick={() => {
                  onClose();
                  onOpenMap();
                }}
                className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition active:scale-95"
              >
                <span>{isTr ? 'Tüm Haritalar' : 'All Maps'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer"
            >
              {isTr ? 'Tamam' : 'Close'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
