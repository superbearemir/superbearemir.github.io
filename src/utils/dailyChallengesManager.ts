// ========================================================
// SUPER BEAR ADVENTURE - DAILY CHALLENGES MANAGER
// Provides daily tasks that reward players with bonus coins,
// honey gems, and XP upon completing in-game activities.
// ========================================================

import confetti from 'canvas-confetti';

export interface DailyChallenge {
  id: string;
  category: 'honey' | 'enemy' | 'boss' | 'coins' | 'action';
  titleTr: string;
  titleEn: string;
  descTr: string;
  descEn: string;
  icon: string;
  target: number;
  progress: number;
  rewardCoins: number;
  rewardHoneyGems: number;
  rewardXp: number;
  completed: boolean;
  claimed: boolean;
  eventIds: string[];
  enemyType?: string;
}

export interface DailyChallengesState {
  dateKey: string;
  challenges: DailyChallenge[];
  allClearClaimed: boolean;
  allClearRewardCoins: number;
  allClearRewardGems: number;
  allClearRewardXp: number;
}

const STORAGE_KEY = 'super_bear_daily_challenges_v2';

// Pool of possible daily challenges
export const CHALLENGE_POOL: Omit<DailyChallenge, 'progress' | 'completed' | 'claimed'>[] = [
  // 1. Collecting Honey Pots / Honey Gems (User requested)
  {
    id: 'daily_honey_50',
    category: 'honey',
    titleTr: '50 Bal Çömleği / Bal Kristali Topla',
    titleEn: 'Collect 50 Honey Pots / Gems',
    descTr: 'Bölümlerdeki tatlı bal çömleklerini ve parıldayan bal kristallerini topla.',
    descEn: 'Collect sweet honey pots and shimmering honey gems in any level.',
    icon: '🍯',
    target: 50,
    rewardCoins: 350,
    rewardHoneyGems: 3,
    rewardXp: 120,
    eventIds: ['collect_honey_gem', 'collect_honey_pot', 'collect_honey']
  },
  // 2. Specific Enemy: Bees (User requested)
  {
    id: 'daily_defeat_bees',
    category: 'enemy',
    titleTr: '10 Sinirli Arı (Bee) Mağlup Et',
    titleEn: 'Defeat 10 Hostile Bees',
    descTr: 'Orman Tapınağı veya Arı Kovanı\'ndaki vızıldayan arıları pençele.',
    descEn: 'Defeat the hostile bees in the Forest Temple or Beehive.',
    icon: '🐝',
    target: 10,
    rewardCoins: 250,
    rewardHoneyGems: 1,
    rewardXp: 80,
    eventIds: ['kill_bee', 'defeat_bee'],
    enemyType: 'bee'
  },
  // 3. Specific Enemy: Golems (Snow / Space)
  {
    id: 'daily_defeat_golems',
    category: 'enemy',
    titleTr: '6 Kar Golemi veya Taş Muhafız Yok Et',
    titleEn: 'Defeat 6 Golems (Snow/Stone)',
    descTr: 'Kar Vadisi\'ndeki Kar Golemlerini veya Uzay Boyutu\'ndaki canavarları dize getir.',
    descEn: 'Smash snow golems in Snow Valley or stone golems in the Space Dimension.',
    icon: '❄️',
    target: 6,
    rewardCoins: 300,
    rewardHoneyGems: 2,
    rewardXp: 100,
    eventIds: ['kill_snow_golem', 'kill_space_golem'],
    enemyType: 'snow_golem'
  },
  // 4. Specific Enemy: Flower Spitters
  {
    id: 'daily_defeat_flowers',
    category: 'enemy',
    titleTr: '8 Zehir Tüküren Çiçek Temizle',
    titleEn: 'Defeat 8 Flower Spitters',
    descTr: 'Platformlara pusu kuran kırmızı zehirli çiçekleri pençelerinle ez.',
    descEn: 'Eliminate poisonous red flower spitters lurking on jumping platforms.',
    icon: '🌺',
    target: 8,
    rewardCoins: 220,
    rewardHoneyGems: 1,
    rewardXp: 75,
    eventIds: ['kill_flower_spitter'],
    enemyType: 'flower_spitter'
  },
  // 5. Defeat Any Level Boss
  {
    id: 'daily_defeat_boss',
    category: 'boss',
    titleTr: '1 Bölüm Boss\'unu Dize Getir',
    titleEn: 'Defeat 1 Level Boss',
    descTr: 'Koca Ayak, Pelikan Kral, Fenrir veya herhangi bir Boss\'u alt et.',
    descEn: 'Conquer Bigfoot, the Pelican King, Fenrir, or any map boss.',
    icon: '👑',
    target: 1,
    rewardCoins: 500,
    rewardHoneyGems: 4,
    rewardXp: 250,
    eventIds: ['defeat_boss', 'boss_defeat', 'kill_bigfoot_boss', 'kill_pelican_boss', 'kill_corrupted_bear_boss']
  },
  // 6. Collect 100 Gold Coins
  {
    id: 'daily_collect_coins_100',
    category: 'coins',
    titleTr: '100 Parlak Altın Parası Topla',
    titleEn: 'Collect 100 Shiny Gold Coins',
    descTr: 'Parkurlardaki ve gizli patikalardaki altın paraları çantana doldur.',
    descEn: 'Gather gleaming gold coins scattered across platforms and secret paths.',
    icon: '🪙',
    target: 100,
    rewardCoins: 250,
    rewardHoneyGems: 1,
    rewardXp: 60,
    eventIds: ['collect_coin']
  },
  // 7. Perform 30 Jumps
  {
    id: 'daily_jumps_30',
    category: 'action',
    titleTr: '30 Kez Akrobatik Zıplama Yap',
    titleEn: 'Perform 30 Acrobat Jumps',
    descTr: 'Zıplama butonunu kullanarak platformlar arasında çevikçe sıçra.',
    descEn: 'Use the jump button to leap high across obstacles and terrain.',
    icon: '🦘',
    target: 30,
    rewardCoins: 150,
    rewardHoneyGems: 1,
    rewardXp: 50,
    eventIds: ['jump', 'action_jump']
  },
  // 8. Score 2 Goals on Soccer Pitch
  {
    id: 'daily_soccer_goals',
    category: 'action',
    titleTr: 'Futbol Sahasında 2 Gol At',
    titleEn: 'Score 2 Soccer Goals',
    descTr: 'Köy meydanındaki futbol sahasında topa vurarak kaleye gönder.',
    descEn: 'Kick the soccer ball into the net at the village pitch.',
    icon: '⚽',
    target: 2,
    rewardCoins: 200,
    rewardHoneyGems: 1,
    rewardXp: 80,
    eventIds: ['soccer_goal']
  }
];

export function getTodayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getTimeUntilDailyReset(): { hours: number; minutes: number; seconds: number; formatted: string } {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const diffMs = Math.max(0, tomorrow.getTime() - now.getTime());
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  const formatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  return { hours, minutes, seconds, formatted };
}

/**
 * Generates today's selected challenges ensuring high quality variety:
 * - Always includes Honey Pots / Gems
 * - Includes a specific enemy hunt (Bees, Golems, or Flowers)
 * - Includes a boss / combat task
 * - Includes an action / coin task
 */
function generateDailySet(seedKey: string): DailyChallenge[] {
  // We guarantee the honey challenge (user requested 50 honey pots)
  const honeyChallenge = CHALLENGE_POOL.find(c => c.id === 'daily_honey_50')!;

  // Pick an enemy challenge (e.g. bees, golems, or flowers)
  const enemyChallenges = CHALLENGE_POOL.filter(c => c.category === 'enemy');
  // Hash seedKey for deterministic rotation across days
  let hash = 0;
  for (let i = 0; i < seedKey.length; i++) {
    hash = (hash * 31 + seedKey.charCodeAt(i)) & 0xffffffff;
  }
  const pickedEnemy = enemyChallenges[Math.abs(hash) % enemyChallenges.length];

  // Pick a boss challenge
  const bossChallenge = CHALLENGE_POOL.find(c => c.category === 'boss')!;

  // Pick action / coin challenge
  const actionChallenges = CHALLENGE_POOL.filter(c => c.category === 'coins' || c.category === 'action');
  const pickedAction = actionChallenges[Math.abs(hash >> 2) % actionChallenges.length];

  const selection = [honeyChallenge, pickedEnemy, bossChallenge, pickedAction];

  return selection.map(item => ({
    ...item,
    progress: 0,
    completed: false,
    claimed: false
  }));
}

class DailyChallengesManager {
  private state: DailyChallengesState;
  private listeners: Set<(state: DailyChallengesState) => void> = new Set();
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.setupEventListeners();
    this.exposeGlobal();
  }

  private loadState(): DailyChallengesState {
    const today = getTodayKey();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DailyChallengesState;
        if (parsed && parsed.dateKey === today && Array.isArray(parsed.challenges) && parsed.challenges.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[DailyChallenges] Error loading state from storage:', e);
    }

    // New day or first run: initialize fresh challenges
    const newState: DailyChallengesState = {
      dateKey: today,
      challenges: generateDailySet(today),
      allClearClaimed: false,
      allClearRewardCoins: 600,
      allClearRewardGems: 5,
      allClearRewardXp: 300
    };
    this.persistState(newState);
    return newState;
  }

  private persistState(state: DailyChallengesState) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('[DailyChallenges] Error saving state:', e);
    }
  }

  private notify() {
    this.listeners.forEach(fn => fn(this.state));
    window.dispatchEvent(new CustomEvent('superbear:daily-challenges-updated', {
      detail: { state: this.state }
    }));
  }

  public subscribe(listener: (state: DailyChallengesState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  public getState(): DailyChallengesState {
    // Check if day changed
    const today = getTodayKey();
    if (this.state.dateKey !== today) {
      this.state = this.loadState();
      this.notify();
    }
    return this.state;
  }

  public getPendingClaimsCount(): number {
    const s = this.getState();
    let count = 0;
    for (const c of s.challenges) {
      if (c.completed && !c.claimed) count++;
    }
    if (this.isAllCompleted() && !s.allClearClaimed) count++;
    return count;
  }

  public isAllCompleted(): boolean {
    const s = this.getState();
    return s.challenges.length > 0 && s.challenges.every(c => c.completed);
  }

  public isAllClaimed(): boolean {
    const s = this.getState();
    return s.challenges.length > 0 && s.challenges.every(c => c.claimed) && s.allClearClaimed;
  }

  /**
   * Records progress towards daily tasks.
   * Can be invoked from in-game events, player actions, or direct calls.
   */
  public recordProgress(eventId: string, amount: number = 1, metadata?: { enemyType?: string; isBoss?: boolean }) {
    if (amount <= 0) return;
    const today = getTodayKey();
    if (this.state.dateKey !== today) {
      this.state = this.loadState();
    }

    let modified = false;
    const newlyCompleted: DailyChallenge[] = [];

    this.state.challenges = this.state.challenges.map(c => {
      // Check if challenge is already completed
      if (c.completed) return c;

      // Check matching
      let matches = false;

      // 1. Direct event matching
      if (c.eventIds.includes(eventId)) {
        matches = true;
      }
      // 2. Honey gems / honey pots matching
      else if (c.category === 'honey' && (eventId.includes('honey') || eventId.includes('gem'))) {
        matches = true;
      }
      // 3. Enemy defeat matching
      else if (c.category === 'enemy') {
        if (c.enemyType && metadata?.enemyType && metadata.enemyType.toLowerCase() === c.enemyType.toLowerCase()) {
          matches = true;
        } else if (c.enemyType && eventId.toLowerCase().includes(c.enemyType.toLowerCase())) {
          matches = true;
        } else if (!c.enemyType && (eventId.startsWith('kill_') || eventId.startsWith('defeat_'))) {
          matches = true;
        }
      }
      // 4. Boss defeat matching
      else if (c.category === 'boss' && (metadata?.isBoss || eventId.includes('boss') || eventId === 'defeat_boss')) {
        matches = true;
      }
      // 5. Jump matching
      else if (c.category === 'action' && eventId === 'jump' && c.id === 'daily_jumps_30') {
        matches = true;
      }

      if (matches) {
        const nextProg = Math.min(c.target, c.progress + amount);
        if (nextProg !== c.progress) {
          modified = true;
          const isNowCompleted = nextProg >= c.target;
          if (isNowCompleted && !c.completed) {
            newlyCompleted.push({ ...c, progress: nextProg, completed: true });
          }
          return {
            ...c,
            progress: nextProg,
            completed: isNowCompleted
          };
        }
      }

      return c;
    });

    if (modified) {
      this.persistState(this.state);
      this.notify();

      // Show notice for newly completed tasks
      newlyCompleted.forEach(nc => {
        this.triggerChimeSound();
        const noticeMsg = `🎯 Günlük Görev Tamamlandı: "${nc.titleTr}"! (+${nc.rewardCoins} Bonus Altın)`;
        if (typeof window !== 'undefined') {
          const game = (window as any).__superBearGame;
          if (game && game.callbacks && game.callbacks.onShowNotice) {
            game.callbacks.onShowNotice(noticeMsg, 'success');
          }
          window.dispatchEvent(new CustomEvent('superbear:challenge-completed', { detail: nc }));
        }
      });
    }
  }

  /**
   * Claims reward for a specific challenge.
   * Awards bonus coins, honey gems, and XP directly to the player stats & save game.
   */
  public claimReward(challengeId: string): { success: boolean; coinsAwarded: number; gemsAwarded: number; xpAwarded: number } {
    const today = getTodayKey();
    if (this.state.dateKey !== today) {
      this.state = this.loadState();
    }

    const challenge = this.state.challenges.find(c => c.id === challengeId);
    if (!challenge) return { success: false, coinsAwarded: 0, gemsAwarded: 0, xpAwarded: 0 };
    if (!challenge.completed || challenge.claimed) return { success: false, coinsAwarded: 0, gemsAwarded: 0, xpAwarded: 0 };

    challenge.claimed = true;
    this.persistState(this.state);
    this.notify();

    // Award rewards
    this.awardToPlayer(challenge.rewardCoins, challenge.rewardHoneyGems, challenge.rewardXp);
    this.triggerRewardEffects(challenge.rewardCoins);

    return {
      success: true,
      coinsAwarded: challenge.rewardCoins,
      gemsAwarded: challenge.rewardHoneyGems,
      xpAwarded: challenge.rewardXp
    };
  }

  /**
   * Claims the grand All-Clear bonus when all daily challenges are completed.
   */
  public claimAllClearReward(): { success: boolean; coinsAwarded: number; gemsAwarded: number } {
    if (!this.isAllCompleted() || this.state.allClearClaimed) {
      return { success: false, coinsAwarded: 0, gemsAwarded: 0 };
    }

    this.state.allClearClaimed = true;
    this.persistState(this.state);
    this.notify();

    const coins = this.state.allClearRewardCoins;
    const gems = this.state.allClearRewardGems;
    const xp = this.state.allClearRewardXp;

    this.awardToPlayer(coins, gems, xp);
    this.triggerRewardEffects(coins, true);

    return { success: true, coinsAwarded: coins, gemsAwarded: gems };
  }

  /**
   * Rerolls daily challenges (handy for testing or daily reset).
   */
  public rerollChallenges() {
    const today = getTodayKey();
    const randomSuffix = Math.floor(Math.random() * 10000).toString();
    const newChallenges = generateDailySet(`${today}-${randomSuffix}`);

    this.state = {
      dateKey: today,
      challenges: newChallenges,
      allClearClaimed: false,
      allClearRewardCoins: 600,
      allClearRewardGems: 5,
      allClearRewardXp: 300
    };
    this.persistState(this.state);
    this.notify();
    this.triggerChimeSound();
  }

  private awardToPlayer(coins: number, gems: number = 0, xp: number = 0) {
    if (typeof window === 'undefined') return;

    const game = (window as any).__superBearGame;
    const sm = (window as any).__superBearSaveManager;

    let updatedCoins = 0;
    let updatedGems = 0;

    if (game && game.stats) {
      game.stats.coins = (game.stats.coins || 0) + coins;
      if (gems > 0) game.stats.honeyGems = (game.stats.honeyGems || 0) + gems;
      if (xp > 0) {
        game.stats.xp = (game.stats.xp || 0) + xp;
        if (game.checkLevelUp) game.checkLevelUp();
      }
      if (game.callbacks && game.callbacks.onStatsUpdate) {
        game.callbacks.onStatsUpdate(game.stats);
      }
      updatedCoins = game.stats.coins;
      updatedGems = game.stats.honeyGems;
    }

    if (sm) {
      const cur = sm.getSaveData ? sm.getSaveData() : null;
      const targetCoins = cur ? cur.goldBalance + coins : updatedCoins;
      const targetGems = cur ? cur.honeyGems + gems : updatedGems;
      sm.updateGold(targetCoins, targetGems);
      sm.saveGame({ goldBalance: targetCoins, honeyGems: targetGems }, { immediate: true });
      updatedCoins = targetCoins;
      updatedGems = targetGems;
    }

    // Broadcast coins updated
    window.dispatchEvent(new CustomEvent('superbear:coins-updated', {
      detail: { coins: updatedCoins, honeyGems: updatedGems }
    }));
  }

  private triggerRewardEffects(coins: number, isGrand: boolean = false) {
    // 1. Confetti
    try {
      if (isGrand) {
        confetti({
          particleCount: 160,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#f59e0b', '#10b981', '#38bdf8', '#fbbf24', '#ec4899']
        });
      } else {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#fbbf24', '#eab308']
        });
      }
    } catch (e) {
      // Ignore if confetti fails
    }

    // 2. Synthesize audio chime
    this.playFanfareSound(isGrand);

    // 3. Show In-Game HUD Notice
    if (typeof window !== 'undefined') {
      const game = (window as any).__superBearGame;
      if (game && game.callbacks && game.callbacks.onShowNotice) {
        const msg = isGrand
          ? `🏆 GÜNÜN BÜYÜK ŞAMPİYONLUK ÖDÜLÜ ALINDI! (+${coins} Altın & +5 Bal Kristali! ✨)`
          : `🪙 +${coins} Bonus Altın Çantana Eklendi!`;
        game.callbacks.onShowNotice(msg, 'success');
      }
    }
  }

  private playFanfareSound(isGrand: boolean) {
    try {
      if (!this.audioCtx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) this.audioCtx = new AudioCtx();
      }
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // Play joyful arpeggio
      const notes = isGrand ? [523.25, 659.25, 783.99, 1046.5, 1318.5] : [587.33, 739.99, 880.0, 1174.66];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.2, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.3);
      });
    } catch (e) {
      // Audio fallback silent
    }
  }

  private triggerChimeSound() {
    try {
      if (!this.audioCtx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) this.audioCtx = new AudioCtx();
      }
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const ctx = this.audioCtx;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.15);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {}
  }

  private setupEventListeners() {
    if (typeof window === 'undefined') return;

    // Listen to quest / action progress emitted across the application
    window.addEventListener('superbear:quest-progress', (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail.id === 'string') {
        this.recordProgress(detail.id, detail.amount || 1, {
          enemyType: detail.enemyType,
          isBoss: detail.isBoss
        });
      }
    });

    // Listen to jump event
    window.addEventListener('superbear:player-jump', () => {
      this.recordProgress('jump', 1);
    });

    // Listen to boss defeat event
    window.addEventListener('superbear:boss-defeated', (e: Event) => {
      const detail = (e as CustomEvent).detail;
      this.recordProgress('defeat_boss', 1, { isBoss: true, enemyType: detail?.bossId });
    });
  }

  private exposeGlobal() {
    if (typeof window !== 'undefined') {
      (window as any).__superBearDailyChallenges = {
        getState: () => this.getState(),
        recordProgress: (eventId: string, amount?: number, metadata?: any) => this.recordProgress(eventId, amount, metadata),
        onProgress: (eventId: string, amount?: number, metadata?: any) => this.recordProgress(eventId, amount, metadata),
        claimReward: (id: string) => this.claimReward(id),
        claimAllClearReward: () => this.claimAllClearReward(),
        reroll: () => this.rerollChallenges(),
        getPendingCount: () => this.getPendingClaimsCount()
      };
    }
  }
}

// Global Singleton
export const dailyChallengesManager = new DailyChallengesManager();
