// ========================================================
// TypeScript Interface & React Hook for Game Save Management
// ========================================================

import { useState, useEffect, useCallback } from 'react';

export interface SuperBearSaveData {
  version: number;
  lastSaved: number;
  lastSavedReadable: string;

  // 1. Currency & Balances
  goldBalance: number;
  honeyGems: number;
  arcadeTokens: number;

  // 2. Character Progression
  level: number;
  xp: number;
  xpToNext: number;
  maxHp: number;
  currentHp: number;
  attackPower: number;
  defense: number;
  moveSpeed: number;
  jumpForce: number;
  skillPoints: number;
  hasDoubleJump: boolean;
  hasTripleJump: boolean;
  hasGlide: boolean;
  hasWallClimb: boolean;
  hasGroundPound: boolean;
  hasMagnet: boolean;
  shieldActive: boolean;
  shieldCooldown: number;

  // 3. World & Level Progress
  currentRegion: string;
  unlockedLevelsMax: number;
  levelsProgress: Record<string, {
    isUnlocked?: boolean;
    bossDefeated?: boolean;
    hardcoreCompletedNoDamage?: boolean;
    stars?: number;
  }>;
  storyCrystals: string[];
  talkedNpcIds: string[];
  aliensRescued: number;

  // 4. Equipment & Wardrobe
  equipment: {
    head: any;
    cape: any;
    weapon: any;
    body: any;
  };
  shopEquippedIds: string[];
  shopPurchasedIds: string[];
  activeSkinId: string;
  unlockedSkinIds: string[];

  // 5. Quests & Activities
  quests: any[];
  arcadeHighScores: Record<string, number>;
}

declare global {
  interface Window {
    __superBearSaveManager?: {
      getSaveData: () => SuperBearSaveData;
      saveGame: (updates?: Partial<SuperBearSaveData>, options?: { immediate?: boolean; showToast?: boolean; message?: string }) => boolean;
      getInitialStats: (defaultStats: any) => any;
      getInitialEquipment: (defaultList: any[]) => any;
      getInitialSkin: (defaultSkinId?: string) => string;
      getInitialLevels: (defaultLevels: any[]) => any[];
      getInitialStoryCrystals: () => string[];
      getRescuedAliens: () => number;
      setRescuedAliens: (count: number) => void;
      updateGold: (coins?: number, honeyGems?: number) => void;
      updateEquipped: (equipment?: any, shopEquippedIds?: string[]) => void;
      onStatsUpdate: (stats: any) => void;
      onBossDefeated: (levelId: string, xpReward?: number, isHardcore?: boolean) => void;
      onStoryCrystal: (crystalId: string) => void;
      onRegionChange: (regionId: string) => void;
      onSkinChange: (skinId: string) => void;
      onEquipmentChange: (equipment: any) => void;
      manualSave: () => boolean;
      exportSaveString: () => string;
      importSaveString: (saveString: string) => boolean;
      resetSave: () => void;
    };
  }
}

export function getSaveManager() {
  return typeof window !== 'undefined' ? window.__superBearSaveManager : undefined;
}

export function useGameSave() {
  const [saveData, setSaveData] = useState<SuperBearSaveData | null>(() => {
    const sm = getSaveManager();
    return sm ? sm.getSaveData() : null;
  });

  const [lastSaveToast, setLastSaveToast] = useState<{ message: string; timestamp: number } | null>(null);

  useEffect(() => {
    const handleSaved = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.saveData) {
        setSaveData({ ...detail.saveData });
      }
      if (detail && detail.showToast && detail.message) {
        const ts = detail.timestamp || Date.now();
        setLastSaveToast({ message: detail.message, timestamp: ts });
        setTimeout(() => {
          setLastSaveToast((prev) => (prev && prev.timestamp === ts ? null : prev));
        }, 3500);
      }
    };

    window.addEventListener('superbear:game-saved', handleSaved);
    return () => {
      window.removeEventListener('superbear:game-saved', handleSaved);
    };
  }, []);

  const manualSave = useCallback(() => {
    const sm = getSaveManager();
    if (sm) {
      return sm.manualSave();
    }
    return false;
  }, []);

  const updateGold = useCallback((coins?: number, honeyGems?: number) => {
    const sm = getSaveManager();
    if (sm) sm.updateGold(coins, honeyGems);
  }, []);

  const exportSave = useCallback(() => {
    const sm = getSaveManager();
    return sm ? sm.exportSaveString() : '';
  }, []);

  const importSave = useCallback((str: string) => {
    const sm = getSaveManager();
    return sm ? sm.importSaveString(str) : false;
  }, []);

  const resetSave = useCallback(() => {
    const sm = getSaveManager();
    if (sm) sm.resetSave();
  }, []);

  return {
    saveData,
    lastSaveToast,
    manualSave,
    updateGold,
    exportSave,
    importSave,
    resetSave
  };
}
