// ========================================================
// SUPER BEAR ADVENTURE - PERSISTENT GAME SAVE MANAGER
// Stores Player Progress, Equipped Items, Gold & Honey Balance
// in LocalStorage with Auto-Save, Manual Save, and Export/Import.
// ========================================================

(function() {
  'use strict';

  const SAVE_KEY = 'super_bear_game_save_v1';
  const LEGACY_COINS_KEY = 'super_bear_coins';
  const LEGACY_EQUIPPED_KEY = 'super_bear_equipped_items';
  const LEGACY_PURCHASED_KEY = 'super_bear_purchased_items';
  const LEGACY_LEVELS_MAX_KEY = 'super_bear_unlocked_levels_max';
  const LEGACY_ALIENS_KEY = 'super_bear_aliens_rescued';
  const LEGACY_DESIGN_KEY = 'super_bear_custom_design_current';

  const DEFAULT_SAVE = {
    version: 1,
    lastSaved: Date.now(),
    lastSavedReadable: new Date().toLocaleTimeString(),
    
    // 1. Currency & Balances
    goldBalance: 150,
    honeyGems: 2,
    arcadeTokens: 5,
    
    // 2. Character Progression
    level: 1,
    xp: 0,
    xpToNext: 100,
    maxHp: 100,
    currentHp: 100,
    attackPower: 12,
    defense: 4,
    moveSpeed: 7.5,
    jumpForce: 10.5,
    skillPoints: 2,
    hasDoubleJump: false,
    hasTripleJump: false,
    hasGlide: false,
    hasWallClimb: false,
    hasGroundPound: false,
    hasMagnet: false,
    shieldActive: false,
    shieldCooldown: 0,
    
    // 3. World & Level Progress
    currentRegion: 'hub',
    unlockedLevelsMax: 14,
    levelsProgress: {
      hub: { isUnlocked: true, bossDefeated: false, hardcoreCompletedNoDamage: false },
      forest_temple: { isUnlocked: true, bossDefeated: false, hardcoreCompletedNoDamage: false }
    },
    storyCrystals: [],
    talkedNpcIds: [],
    aliensRescued: 0,
    
    // 4. Equipment & Wardrobe
    equipment: {
      head: null,
      cape: { id: 'cape_basic', name: 'Maceracı Pelerini', slot: 'cape', rarity: 'common', icon: '🧣' },
      weapon: null,
      body: null
    },
    shopEquippedIds: [],
    shopPurchasedIds: [],
    activeSkinId: 'skin_classic',
    unlockedSkinIds: ['skin_classic'],
    
    // 5. Quests & Activities
    quests: [],
    arcadeHighScores: {}
  };

  let cachedSave = null;
  let saveDebounceTimer = null;
  let lastSaveTimestamp = 0;

  /**
   * Reads raw save data from LocalStorage, merging legacy individual keys if needed
   */
  function loadRawSave() {
    try {
      let data = null;
      const json = localStorage.getItem(SAVE_KEY);
      if (json) {
        try {
          data = JSON.parse(json);
        } catch (e) {
          console.warn('[SaveManager] Failed to parse save JSON, falling back to defaults:', e);
        }
      }

      if (!data) {
        data = { ...DEFAULT_SAVE };
      } else {
        // Deep merge with default schema so newly added fields always exist
        data = {
          ...DEFAULT_SAVE,
          ...data,
          equipment: { ...DEFAULT_SAVE.equipment, ...(data.equipment || {}) },
          levelsProgress: { ...DEFAULT_SAVE.levelsProgress, ...(data.levelsProgress || {}) },
          arcadeHighScores: { ...(data.arcadeHighScores || {}) }
        };
      }

      // Check legacy standalone keys and reconcile seamlessly
      const legacyCoins = localStorage.getItem(LEGACY_COINS_KEY);
      if (legacyCoins !== null) {
        const parsedCoins = parseInt(legacyCoins, 10);
        if (!isNaN(parsedCoins) && parsedCoins < 900000) {
          data.goldBalance = parsedCoins;
        }
      }

      const legacyPurchased = localStorage.getItem(LEGACY_PURCHASED_KEY);
      if (legacyPurchased) {
        try {
          const parsed = JSON.parse(legacyPurchased);
          if (Array.isArray(parsed) && parsed.length > 0) {
            data.shopPurchasedIds = Array.from(new Set([...data.shopPurchasedIds, ...parsed]));
          }
        } catch (e) {}
      }

      const legacyEquipped = localStorage.getItem(LEGACY_EQUIPPED_KEY);
      if (legacyEquipped) {
        try {
          const parsed = JSON.parse(legacyEquipped);
          if (Array.isArray(parsed)) {
            data.shopEquippedIds = parsed.filter(id => id !== 'back_royal_cape');
          }
        } catch (e) {}
      }

      const legacyLevelsMax = localStorage.getItem(LEGACY_LEVELS_MAX_KEY);
      if (legacyLevelsMax) {
        const parsedMax = parseInt(legacyLevelsMax, 10);
        if (!isNaN(parsedMax) && parsedMax > data.unlockedLevelsMax) {
          data.unlockedLevelsMax = parsedMax;
        }
      }

      const legacyAliens = localStorage.getItem(LEGACY_ALIENS_KEY);
      if (legacyAliens) {
        const parsedAliens = parseInt(legacyAliens, 10);
        if (!isNaN(parsedAliens) && parsedAliens > data.aliensRescued) {
          data.aliensRescued = parsedAliens;
        }
      }

      cachedSave = data;
      return cachedSave;
    } catch (err) {
      console.error('[SaveManager] Critical error loading save:', err);
      cachedSave = { ...DEFAULT_SAVE };
      return cachedSave;
    }
  }

  /**
   * Synchronously writes save data to LocalStorage and mirrors legacy keys
   */
  function commitSave(saveObj, options = {}) {
    try {
      const now = Date.now();
      saveObj.lastSaved = now;
      saveObj.lastSavedReadable = new Date(now).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      const json = JSON.stringify(saveObj);
      localStorage.setItem(SAVE_KEY, json);

      // Mirror legacy keys for full backward compatibility across all modules
      localStorage.setItem(LEGACY_COINS_KEY, saveObj.goldBalance.toString());
      localStorage.setItem(LEGACY_EQUIPPED_KEY, JSON.stringify(saveObj.shopEquippedIds || []));
      localStorage.setItem(LEGACY_PURCHASED_KEY, JSON.stringify(saveObj.shopPurchasedIds || []));
      localStorage.setItem(LEGACY_LEVELS_MAX_KEY, (saveObj.unlockedLevelsMax || 14).toString());
      localStorage.setItem(LEGACY_ALIENS_KEY, (saveObj.aliensRescued || 0).toString());

      cachedSave = saveObj;
      lastSaveTimestamp = now;

      // Broadcast event so React components, HUD, and 3D scenes know data has been safely stored
      window.dispatchEvent(new CustomEvent('superbear:game-saved', {
        detail: {
          saveData: { ...saveObj },
          showToast: !!options.showToast,
          message: options.message || `💾 Oyun Kaydedildi (${saveObj.goldBalance} Altın)`
        }
      }));

      return true;
    } catch (e) {
      console.error('[SaveManager] Failed to write save to LocalStorage:', e);
      return false;
    }
  }

  /**
   * Save game API with debouncing or immediate option
   */
  function saveGame(updates = {}, options = {}) {
    const current = getSaveData();
    const next = {
      ...current,
      ...updates,
      // If equipment is updated partially, merge it cleanly
      equipment: updates.equipment ? { ...current.equipment, ...updates.equipment } : current.equipment,
      levelsProgress: updates.levelsProgress ? { ...current.levelsProgress, ...updates.levelsProgress } : current.levelsProgress
    };

    // If immediate is requested or beforeunload, commit synchronously right away
    if (options.immediate) {
      if (saveDebounceTimer) clearTimeout(saveDebounceTimer);
      return commitSave(next, options);
    }

    // Otherwise debounce to prevent lag during rapid coin pick-ups
    if (saveDebounceTimer) clearTimeout(saveDebounceTimer);
    cachedSave = next;
    saveDebounceTimer = setTimeout(() => {
      commitSave(cachedSave, options);
    }, 400);

    return true;
  }

  /**
   * Returns in-memory or loaded save data
   */
  function getSaveData() {
    if (!cachedSave) {
      return loadRawSave();
    }
    return cachedSave;
  }

  // Hook into in-game runtime objects when ready
  function syncWithGameEngine() {
    const game = window.__superBearGame;
    if (!game || !game.stats) return;

    const current = getSaveData();
    let changed = false;

    // Check if coins in game are higher or different
    if (typeof game.stats.coins === 'number' && game.stats.coins !== current.goldBalance) {
      current.goldBalance = Math.max(0, game.stats.coins);
      changed = true;
    }
    if (typeof game.stats.honeyGems === 'number' && game.stats.honeyGems !== current.honeyGems) {
      current.honeyGems = game.stats.honeyGems;
      changed = true;
    }
    if (typeof game.stats.level === 'number' && game.stats.level !== current.level) {
      current.level = game.stats.level;
      changed = true;
    }
    if (typeof game.stats.xp === 'number') {
      current.xp = game.stats.xp;
    }
    if (typeof game.stats.currentHp === 'number') {
      current.currentHp = game.stats.currentHp;
    }
    if (typeof game.currentRegion === 'string' && game.currentRegion && game.currentRegion !== current.currentRegion) {
      current.currentRegion = game.currentRegion;
      changed = true;
    }

    const enhancer = window.__superBearSpaceEnhancer;
    if (enhancer && enhancer.getSpaceState) {
      const sp = enhancer.getSpaceState();
      if (sp && typeof sp.aliensRescued === 'number' && sp.aliensRescued !== current.aliensRescued) {
        current.aliensRescued = sp.aliensRescued;
        changed = true;
      }
    }

    if (changed) {
      saveGame(current, { immediate: false });
    }
  }

  // Periodic Auto-Save every 12 seconds
  setInterval(syncWithGameEngine, 12000);

  // Auto-Save when leaving the page or changing tabs
  window.addEventListener('beforeunload', () => {
    syncWithGameEngine();
    commitSave(getSaveData(), { immediate: true });
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      syncWithGameEngine();
      commitSave(getSaveData(), { immediate: true });
    }
  });

  // Export public SaveManager on window.__superBearSaveManager
  window.__superBearSaveManager = {
    getSaveData,
    saveGame,
    
    // Specific helper methods for components & scripts
    getInitialStats(defaultStats) {
      const save = getSaveData();
      return {
        ...defaultStats,
        level: save.level || defaultStats.level || 1,
        xp: save.xp ?? defaultStats.xp ?? 0,
        xpToNext: save.xpToNext || defaultStats.xpToNext || 100,
        maxHp: save.maxHp || defaultStats.maxHp || 100,
        currentHp: save.currentHp || defaultStats.currentHp || 100,
        coins: save.goldBalance ?? defaultStats.coins ?? 150,
        honeyGems: save.honeyGems ?? defaultStats.honeyGems ?? 2,
        skillPoints: save.skillPoints ?? defaultStats.skillPoints ?? 2,
        attackPower: save.attackPower ?? defaultStats.attackPower ?? 12,
        defense: save.defense ?? defaultStats.defense ?? 4,
        moveSpeed: save.moveSpeed ?? defaultStats.moveSpeed ?? 7.5,
        jumpForce: save.jumpForce ?? defaultStats.jumpForce ?? 10.5,
        hasDoubleJump: save.hasDoubleJump ?? defaultStats.hasDoubleJump ?? false,
        hasTripleJump: save.hasTripleJump ?? defaultStats.hasTripleJump ?? false,
        hasGlide: save.hasGlide ?? defaultStats.hasGlide ?? false,
        hasWallClimb: save.hasWallClimb ?? defaultStats.hasWallClimb ?? false,
        hasGroundPound: save.hasGroundPound ?? defaultStats.hasGroundPound ?? false,
        hasMagnet: save.hasMagnet ?? defaultStats.hasMagnet ?? false
      };
    },

    getInitialEquipment(defaultList) {
      const save = getSaveData();
      if (save.equipment && (save.equipment.cape || save.equipment.head || save.equipment.weapon || save.equipment.body)) {
        return {
          head: save.equipment.head || null,
          cape: save.equipment.cape || (defaultList ? defaultList.find(i => i.id === 'cape_basic') : null),
          weapon: save.equipment.weapon || null,
          body: save.equipment.body || null
        };
      }
      return {
        head: null,
        cape: defaultList ? defaultList.find(i => i.id === 'cape_basic') || null : null,
        weapon: null,
        body: null
      };
    },

    getInitialSkin(defaultSkinId = 'skin_classic') {
      const save = getSaveData();
      return save.activeSkinId || defaultSkinId;
    },

    getInitialLevels(defaultLevels) {
      const save = getSaveData();
      if (!defaultLevels || !Array.isArray(defaultLevels)) return defaultLevels;
      if (!save.levelsProgress) return defaultLevels;

      return defaultLevels.map(lvl => {
        const prog = save.levelsProgress[lvl.id];
        if (prog) {
          return {
            ...lvl,
            isUnlocked: prog.isUnlocked !== undefined ? prog.isUnlocked : lvl.isUnlocked,
            bossDefeated: prog.bossDefeated !== undefined ? prog.bossDefeated : lvl.bossDefeated,
            hardcoreCompletedNoDamage: prog.hardcoreCompletedNoDamage !== undefined ? prog.hardcoreCompletedNoDamage : lvl.hardcoreCompletedNoDamage
          };
        }
        return lvl;
      });
    },

    getInitialStoryCrystals() {
      const save = getSaveData();
      return save.storyCrystals || [];
    },

    getRescuedAliens() {
      const save = getSaveData();
      return save.aliensRescued || 0;
    },

    setRescuedAliens(count) {
      saveGame({ aliensRescued: count }, { immediate: false });
    },

    updateGold(coins, honeyGems) {
      const updates = {};
      if (typeof coins === 'number') {
        updates.goldBalance = Math.max(0, Math.floor(coins));
      }
      if (typeof honeyGems === 'number') {
        updates.honeyGems = Math.max(0, Math.floor(honeyGems));
      }

      saveGame(updates, { immediate: false });

      // Sync into game instance if available
      const game = window.__superBearGame;
      if (game && game.stats) {
        if (typeof coins === 'number') game.stats.coins = updates.goldBalance;
        if (typeof honeyGems === 'number') game.stats.honeyGems = updates.honeyGems;
      }

      window.dispatchEvent(new CustomEvent('superbear:coins-updated', {
        detail: {
          coins: updates.goldBalance !== undefined ? updates.goldBalance : getSaveData().goldBalance,
          honeyGems: updates.honeyGems !== undefined ? updates.honeyGems : getSaveData().honeyGems
        }
      }));
    },

    updateEquipped(equipment, shopEquippedIds) {
      const updates = {};
      if (equipment) updates.equipment = equipment;
      if (shopEquippedIds) updates.shopEquippedIds = shopEquippedIds;
      saveGame(updates, { immediate: true });
    },

    onStatsUpdate(stats) {
      if (!stats) return;
      saveGame({
        goldBalance: stats.coins,
        honeyGems: stats.honeyGems,
        level: stats.level,
        xp: stats.xp,
        xpToNext: stats.xpToNext,
        maxHp: stats.maxHp,
        currentHp: stats.currentHp,
        skillPoints: stats.skillPoints,
        attackPower: stats.attackPower,
        defense: stats.defense,
        moveSpeed: stats.moveSpeed,
        jumpForce: stats.jumpForce,
        hasDoubleJump: stats.hasDoubleJump,
        hasTripleJump: stats.hasTripleJump,
        hasGlide: stats.hasGlide,
        hasWallClimb: stats.hasWallClimb,
        hasGroundPound: stats.hasGroundPound,
        hasMagnet: stats.hasMagnet
      }, { immediate: false });
    },

    onBossDefeated(levelId, xpReward, isHardcore) {
      const current = getSaveData();
      const progress = { ...(current.levelsProgress || {}) };
      progress[levelId] = {
        ...(progress[levelId] || {}),
        bossDefeated: true,
        hardcoreCompletedNoDamage: isHardcore || (progress[levelId] && progress[levelId].hardcoreCompletedNoDamage)
      };

      saveGame({
        levelsProgress: progress,
        goldBalance: current.goldBalance + 250,
        xp: current.xp + (xpReward || 500)
      }, { immediate: true, showToast: true, message: `🏆 Boss Yenildi & İlerleme Kaydedildi! (+250 Altın)` });
    },

    onStoryCrystal(crystalId) {
      const current = getSaveData();
      const crystals = Array.isArray(current.storyCrystals) ? [...current.storyCrystals] : [];
      if (!crystals.includes(crystalId)) {
        crystals.push(crystalId);
        saveGame({ storyCrystals: crystals }, { immediate: true, showToast: true, message: '✨ Kutsal Bal Kristali Kaydedildi!' });
      }
    },

    onRegionChange(regionId) {
      saveGame({ currentRegion: regionId }, { immediate: true });
    },

    onSkinChange(skinId) {
      saveGame({ activeSkinId: skinId }, { immediate: true });
    },

    onEquipmentChange(equipment) {
      saveGame({ equipment }, { immediate: true });
    },

    // Manual instant save with UI toast trigger
    manualSave() {
      syncWithGameEngine();
      const current = getSaveData();
      const success = commitSave(current, {
        showToast: true,
        message: `💾 Oyun Başarıyla Kaydedildi! (${current.goldBalance} Altın, Sv. ${current.level})`
      });
      return success;
    },

    // Export save as base64 string
    exportSaveString() {
      syncWithGameEngine();
      const data = getSaveData();
      try {
        const json = JSON.stringify(data);
        return btoa(encodeURIComponent(json));
      } catch (e) {
        return JSON.stringify(data);
      }
    },

    // Import save from string
    importSaveString(saveString) {
      try {
        let json = '';
        try {
          json = decodeURIComponent(atob(saveString));
        } catch (e) {
          json = saveString;
        }
        const parsed = JSON.parse(json);
        if (!parsed || typeof parsed !== 'object') return false;

        commitSave(parsed, { showToast: true, message: '📥 Kayıt Başarıyla Yüklendi! Oyun Yenileniyor...' });
        setTimeout(() => {
          window.location.reload();
        }, 800);
        return true;
      } catch (e) {
        console.error('[SaveManager] Failed to import save:', e);
        return false;
      }
    },

    // Reset save to clean state
    resetSave() {
      const clean = { ...DEFAULT_SAVE, lastSaved: Date.now() };
      commitSave(clean, { showToast: true, message: '🔄 Kayıt Başarıyla Sıfırlandı! Yenileniyor...' });
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  // Initial load on script execution
  loadRawSave();
  console.log('[SaveManager] Initialized with', cachedSave.goldBalance, 'gold and level', cachedSave.level);
})();
