import React, { useState, useEffect } from 'react';
import { CharacterStudioModal } from './CharacterStudioModal';
import { syncDesignToGameInstance, getCurrentSavedDesign } from './GameBridge';
import { CustomCharacterDesign } from './types';
import { DrawingInspectorModal } from '../components/DrawingInspectorModal';
import { SpaceActionHUD } from '../components/SpaceActionHUD';
import { CatMerchantShopModal } from '../components/CatMerchantShopModal';
import { HealthConsumablesShopModal } from '../components/HealthConsumablesShopModal';
import { TreasureInventoryModal } from '../components/TreasureInventoryModal';
import { SpaceBossDialogueOverlay } from '../components/SpaceBossDialogueOverlay';
import { MapSelectorModal } from '../components/MapSelectorModal';
import { UndergroundTrailerModal } from '../components/UndergroundTrailerModal';
import { ArcadeGamesModal, ArcadeGameId } from '../components/ArcadeGamesModal';
import { TouchDragController } from '../components/TouchDragController';
import { LandscapeOrientationHandler } from '../components/LandscapeOrientationHandler';
import { SaveManagerModal } from '../components/SaveManagerModal';
import { LootBoxModal } from '../components/LootBoxModal';
import { CountryLanguageModal } from '../components/CountryLanguageModal';
import { OpeningCinematicModal } from '../components/OpeningCinematicModal';
import { useLanguage } from '../i18n/LanguageContext';
import { ShoppingBag, Gamepad2, Globe, Target, Footprints, Sparkles, Award } from 'lucide-react';

export const CustomizerAppOverlay: React.FC = () => {
  const { language, country, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isDrawingModalOpen, setIsDrawingModalOpen] = useState(false);
  const [isCatShopOpen, setIsCatShopOpen] = useState(false);
  const [isHealthShopOpen, setIsHealthShopOpen] = useState(false);
  const [isTreasureInventoryOpen, setIsTreasureInventoryOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isArcadeGamesOpen, setIsArcadeGamesOpen] = useState(false);
  const [selectedArcadeGame, setSelectedArcadeGame] = useState<ArcadeGameId>('target_blaster');
  const [arcadeAutoStart, setArcadeAutoStart] = useState(false);
  const [arcadeSubZone, setArcadeSubZone] = useState<'target_blaster' | 'retro_runner' | 'general' | null>(null);
  const [rewardToast, setRewardToast] = useState<{ message: string; coins: number; tokens: number } | null>(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isLootBoxModalOpen, setIsLootBoxModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isCinematicOpen, setIsCinematicOpen] = useState(() => {
    try {
      return localStorage.getItem('superbear_intro_seen') !== 'true';
    } catch(e) { return true; }
  });

  const [purchasedIds, setPurchasedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('super_bear_purchased_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  const [playerStats, setPlayerStats] = useState(() => {
    if (typeof window !== 'undefined' && (window as any).__superBearSaveManager) {
      const save = (window as any).__superBearSaveManager.getSaveData();
      return {
        coins: save.goldBalance ?? 150,
        currentHp: save.currentHp ?? 100,
        maxHp: save.maxHp ?? 100,
        honeyGems: save.honeyGems ?? 2
      };
    }
    return { coins: 150, currentHp: 100, maxHp: 100, honeyGems: 2 };
  });
  
  // Locked to Mobile and Tablet touch mode
  const controlMode = 'touch';

  const [isNearCatMerchant, setIsNearCatMerchant] = useState(false);
  const [isNearArcade, setIsNearArcade] = useState(false);

  const [aliensRescued, setAliensRescued] = useState(() => {
    if (typeof window !== 'undefined' && (window as any).__superBearSaveManager) {
      return (window as any).__superBearSaveManager.getRescuedAliens();
    }
    try {
      const s = localStorage.getItem('super_bear_aliens_rescued');
      return s ? parseInt(s, 10) : 0;
    } catch(e) { return 0; }
  });
  const [, setActiveDesign] = useState<CustomCharacterDesign>(getCurrentSavedDesign);

  const [isExternalModalOpen, setIsExternalModalOpen] = useState(false);

  useEffect(() => {
    const checkExternalModal = () => {
      const isBodyOpen = document.body.classList.contains('modal-open');
      const isWindowOpen = !!(window as any).__superBearModalOpen;
      setIsExternalModalOpen(isBodyOpen || isWindowOpen);
    };

    const interval = setInterval(checkExternalModal, 100);
    return () => clearInterval(interval);
  }, []);

  // Synchronize modal open status to prevent touch/joystick conflicts
  const isAnyModalOpen =
    isOpen ||
    isDrawingModalOpen ||
    isCatShopOpen ||
    isHealthShopOpen ||
    isTreasureInventoryOpen ||
    isMapModalOpen ||
    isTrailerOpen ||
    isArcadeGamesOpen ||
    isSaveModalOpen ||
    isLootBoxModalOpen ||
    isLanguageModalOpen ||
    isCinematicOpen ||
    isExternalModalOpen;

  useEffect(() => {
    (window as any).__superBearModalOpen = isAnyModalOpen;
    if (isAnyModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [isAnyModalOpen]);

  useEffect(() => {
    localStorage.setItem('super_bear_control_mode', 'touch');
  }, []);

  useEffect(() => {
    // Expose open helper globally
    (window as unknown as { __openCustomizer?: () => void }).__openCustomizer = () => {
      setIsOpen(true);
    };
    (window as unknown as { __openTrailerModal?: () => void }).__openTrailerModal = () => {
      setIsMapModalOpen(false);
      setIsTrailerOpen(true);
    };
    (window as any).__openArcadeGames = () => {
      setIsArcadeGamesOpen(true);
    };

    // Listen for custom open events
    const handleOpenEvent = () => setIsOpen(true);
    window.addEventListener('superbear:open-customizer', handleOpenEvent);

    const handleInspectDrawingEvent = () => setIsDrawingModalOpen(true);
    window.addEventListener('superbear:inspect-drawing', handleInspectDrawingEvent);

    const handleOpenCatShop = () => setIsCatShopOpen(true);
    window.addEventListener('superbear:open-cat-shop', handleOpenCatShop);

    const handleOpenHealthShop = () => setIsHealthShopOpen(true);
    window.addEventListener('superbear:open-health-shop', handleOpenHealthShop);

    const handleOpenTreasureInventory = () => setIsTreasureInventoryOpen(true);
    window.addEventListener('superbear:open-treasure-inventory', handleOpenTreasureInventory);

    const handleOpenMapSelector = () => setIsMapModalOpen(true);
    window.addEventListener('superbear:open-map-selector', handleOpenMapSelector);

    const handleOpenTrailer = () => {
      setIsMapModalOpen(false);
      setIsTrailerOpen(true);
    };
    window.addEventListener('superbear:open-trailer', handleOpenTrailer);

    const handleCloseMapSelector = () => setIsMapModalOpen(false);
    window.addEventListener('superbear:close-map-selector', handleCloseMapSelector);

    const handleOpenArcade = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.gameId) {
        setSelectedArcadeGame(detail.gameId as ArcadeGameId);
        setArcadeAutoStart(Boolean(detail.autoStart));
      }
      setIsArcadeGamesOpen(true);
    };
    window.addEventListener('superbear:open-arcade-games', handleOpenArcade);

    const handleOpenSaveModal = () => setIsSaveModalOpen(true);
    window.addEventListener('superbear:open-save-modal', handleOpenSaveModal);

    const handleOpenLootBoxes = () => setIsLootBoxModalOpen(true);
    window.addEventListener('superbear:open-lootboxes', handleOpenLootBoxes);

    const handleOpenLanguageModal = () => setIsLanguageModalOpen(true);
    window.addEventListener('superbear:open-language-modal', handleOpenLanguageModal);
    (window as any).__openLanguageModal = handleOpenLanguageModal;

    const handleOpenIntroCinematic = () => setIsCinematicOpen(true);
    window.addEventListener('superbear:open-intro-cinematic', handleOpenIntroCinematic);
    (window as any).__openIntroCinematic = handleOpenIntroCinematic;

    const handleShopPurchase = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && Array.isArray(detail.purchasedIds)) {
        setPurchasedIds(detail.purchasedIds);
      }
    };
    window.addEventListener('superbear:shop-purchase', handleShopPurchase);

    const handleCoinsUpdated = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail.coins === 'number') {
        setPlayerStats(prev => ({
          ...prev,
          coins: detail.coins,
          honeyGems: typeof detail.honeyGems === 'number' ? detail.honeyGems : prev.honeyGems
        }));
      }
    };
    window.addEventListener('superbear:coins-updated', handleCoinsUpdated);

    // Proximity events
    const handleCatMerchantProximity = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail.isNear === 'boolean') {
        setIsNearCatMerchant(detail.isNear);
      }
    };
    window.addEventListener('superbear:cat-merchant-proximity', handleCatMerchantProximity);

    const handleArcadeProximity = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail.isNear === 'boolean') {
        setIsNearArcade(detail.isNear);
        if (detail.subZone) {
          setArcadeSubZone(detail.subZone);
        } else if (!detail.isNear) {
          setArcadeSubZone(null);
        }
      }
    };
    window.addEventListener('superbear:arcade-proximity', handleArcadeProximity);

    const handleSpaceStateUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail.aliensRescued === 'number') {
        setAliensRescued(detail.aliensRescued);
      }
    };
    const handleRegionChange = () => {
      setIsNearCatMerchant(false);
      setIsNearArcade(false);
      setArcadeSubZone(null);
    };
    window.addEventListener('superbear:region-change', handleRegionChange);
    window.addEventListener('superbear:space-state-update', handleSpaceStateUpdate);

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.code === 'KeyH' || e.key === 'h' || e.key === 'H') {
        setIsTrailerOpen((prev) => !prev);
      } else if (e.code === 'KeyM' || e.key === 'm' || e.key === 'M') {
        setIsMapModalOpen((prev) => !prev);
      } else if (e.code === 'KeyE' || e.key === 'e' || e.key === 'E') {
        if (isNearArcade) {
          if (arcadeSubZone === 'target_blaster') {
            setSelectedArcadeGame('target_blaster');
            setArcadeAutoStart(true);
          } else if (arcadeSubZone === 'retro_runner') {
            setSelectedArcadeGame('retro_runner');
            setArcadeAutoStart(true);
          }
          setIsArcadeGamesOpen(true);
        } else if (isNearCatMerchant) {
          setIsCatShopOpen(true);
        }
      } else if (e.code === 'KeyC' || e.key === 'c' || e.key === 'C') {
        setIsOpen((prev) => !prev);
      } else if (e.code === 'KeyJ' || e.key === 'j' || e.key === 'J') {
        setIsArcadeGamesOpen((prev) => !prev);
      } else if (e.code === 'KeyT' || e.key === 't' || e.key === 'T') {
        const enhancer = (window as any).__superBearSpaceEnhancer;
        if (enhancer && enhancer.teleportDash) enhancer.teleportDash();
      } else if (e.code === 'KeyF' || e.key === 'f' || e.key === 'F') {
        const enhancer = (window as any).__superBearSpaceEnhancer;
        if (enhancer && enhancer.shootLaser) enhancer.shootLaser();
      } else if (e.code === 'KeyV' || e.key === 'v' || e.key === 'V') {
        const enhancer = (window as any).__superBearSpaceEnhancer;
        if (enhancer && enhancer.sprayPaint) {
          const settings = enhancer.currentSpraySettings || {};
          enhancer.sprayPaint(settings.color, settings.shape, settings.text);
        }
      } else if (e.code === 'KeyR' || e.key === 'r' || e.key === 'R') {
        const enhancer = (window as any).__superBearSpaceEnhancer;
        if (enhancer && enhancer.toggleAlienCompanion) enhancer.toggleAlienCompanion();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // When game engine is ready, apply current saved design
    const handleGameReady = () => {
      const saved = getCurrentSavedDesign();
      if (saved) {
        setTimeout(() => {
          syncDesignToGameInstance(saved);
        }, 300);
      }
    };
    window.addEventListener('superbear:game-ready', handleGameReady);

    setTimeout(() => {
      const saved = getCurrentSavedDesign();
      if (saved) {
        syncDesignToGameInstance(saved);
      }
    }, 1000);

    return () => {
      window.removeEventListener('superbear:open-customizer', handleOpenEvent);
      window.removeEventListener('superbear:inspect-drawing', handleInspectDrawingEvent);
      window.removeEventListener('superbear:open-cat-shop', handleOpenCatShop);
      window.removeEventListener('superbear:open-health-shop', handleOpenHealthShop);
      window.removeEventListener('superbear:open-treasure-inventory', handleOpenTreasureInventory);
      window.removeEventListener('superbear:open-map-selector', handleOpenMapSelector);
      window.removeEventListener('superbear:open-trailer', handleOpenTrailer);
      window.removeEventListener('superbear:open-arcade-games', handleOpenArcade);
      window.removeEventListener('superbear:open-save-modal', handleOpenSaveModal);
      window.removeEventListener('superbear:open-lootboxes', handleOpenLootBoxes);
      window.removeEventListener('superbear:open-language-modal', handleOpenLanguageModal);
      window.removeEventListener('superbear:shop-purchase', handleShopPurchase);
      window.removeEventListener('superbear:coins-updated', handleCoinsUpdated);
      window.removeEventListener('superbear:cat-merchant-proximity', handleCatMerchantProximity);
      window.removeEventListener('superbear:arcade-proximity', handleArcadeProximity);
      window.removeEventListener('superbear:space-state-update', handleSpaceStateUpdate);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('superbear:game-ready', handleGameReady);
    };
  }, [isNearArcade]);

  const handleApplyDesign = (design: CustomCharacterDesign) => {
    setActiveDesign(design);
    syncDesignToGameInstance(design);
  };

  const handleTeleportToSpace = () => {
    const enhancer = (window as any).__superBearSpaceEnhancer;
    if (enhancer && enhancer.teleportToSpace) enhancer.teleportToSpace();
  };

  const handleConsumeFood = (healAmount: number, cost: number, itemName: string) => {
    const game = (window as any).__superBearGame;
    if (game && game.stats) {
      game.stats.currentHp = Math.min(game.stats.maxHp, game.stats.currentHp + healAmount);
      game.stats.coins = Math.max(0, game.stats.coins - cost);
      if (game.callbacks && game.callbacks.onStatsUpdate) {
        game.callbacks.onStatsUpdate(game.stats);
      }
      if (typeof window !== 'undefined' && (window as any).__superBearSaveManager) {
        (window as any).__superBearSaveManager.updateGold(game.stats.coins);
      }
      setPlayerStats({
        coins: game.stats.coins,
        currentHp: game.stats.currentHp,
        maxHp: game.stats.maxHp,
        honeyGems: game.stats.honeyGems || 2
      });
    }
  };

  const gameStats = (() => {
    const game = (window as any).__superBearGame;
    if (game && game.stats) {
      return {
        coins: game.stats.coins ?? playerStats.coins,
        currentHp: game.stats.currentHp ?? playerStats.currentHp,
        maxHp: game.stats.maxHp ?? playerStats.maxHp,
        honeyGems: game.stats.honeyGems ?? playerStats.honeyGems
      };
    }
    return playerStats;
  })();

  return (
    <>
      {/* Space HUD Bar - Automatically hidden when any modal or menu is active */}
      {!isAnyModalOpen && (
        <SpaceActionHUD
          onOpenDrawingModal={() => setIsDrawingModalOpen(true)}
          onOpenCatShop={() => setIsCatShopOpen(true)}
          onOpenMapModal={() => setIsMapModalOpen(true)}
          onOpenArcade={() => setIsArcadeGamesOpen(true)}
          onOpenSaveModal={() => setIsSaveModalOpen(true)}
          aliensRescued={aliensRescued}
          controlMode="touch"
        />
      )}

      {/* Cat Merchant Proximity Interactive Floating Banner */}
      {!isAnyModalOpen && isNearCatMerchant && !isCatShopOpen && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[85] pointer-events-auto animate-in slide-in-from-bottom-4 duration-200">
          <button
            onClick={() => setIsCatShopOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm border-2 border-amber-300 shadow-2xl backdrop-blur-md flex items-center gap-3 transition transform active:scale-95 hover:scale-105 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center text-lg shadow-inner">
              🐱
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5 leading-tight">
                <span>Bakkal Kedi Capi</span>
                <span className="px-1.5 py-0.2 bg-slate-950 text-amber-300 rounded text-[10px] font-mono">[E Tuşu]</span>
              </div>
              <p className="text-[11px] font-bold text-slate-900 opacity-90">
                "Miyav! Dükkanı Açmak İçin Tıkla!"
              </p>
            </div>
            <ShoppingBag className="w-5 h-5 text-slate-950 animate-bounce ml-1" />
          </button>
        </div>
      )}

      {/* Central Arcade Zone Proximity Interactive Floating Banner Hub */}
      {!isAnyModalOpen && isNearArcade && !isArcadeGamesOpen && (
        <div className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-[90] pointer-events-auto animate-in slide-in-from-top-4 duration-200 max-w-[95vw]">
          <div className="bg-slate-950/90 border-2 border-purple-500/80 rounded-2xl shadow-2xl p-2 sm:p-2.5 backdrop-blur-xl flex flex-col sm:flex-row items-center gap-2">
            
            {/* Target Practice Quick Action */}
            <button
              onClick={() => {
                setSelectedArcadeGame('target_blaster');
                setArcadeAutoStart(true);
                setIsArcadeGamesOpen(true);
              }}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-xs border border-rose-300 shadow-md flex items-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <Target className="w-4 h-4 text-rose-200 animate-pulse" />
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <span>🎯 Hedef Poligonu</span>
                  <span className="px-1 py-0.2 bg-slate-900 text-rose-300 rounded text-[9px] font-mono">Hızlı Başla</span>
                </div>
                <div className="text-[10px] text-rose-200 opacity-90 font-bold">Nişan Al & Altın Kazan</div>
              </div>
            </button>

            {/* Obstacle Course Quick Action */}
            <button
              onClick={() => {
                setSelectedArcadeGame('retro_runner');
                setArcadeAutoStart(true);
                setIsArcadeGamesOpen(true);
              }}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-black text-xs border border-amber-300 shadow-md flex items-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <Footprints className="w-4 h-4 text-amber-200 animate-bounce" />
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <span>🏃 Engelli Parkur</span>
                  <span className="px-1 py-0.2 bg-slate-900 text-amber-300 rounded text-[9px] font-mono">Hızlı Başla</span>
                </div>
                <div className="text-[10px] text-amber-200 opacity-90 font-bold">Engelleri Aş & Hızlan</div>
              </div>
            </button>

            {/* Full Arcade Zone Game Catalog */}
            <button
              onClick={() => {
                setSelectedArcadeGame('target_blaster');
                setArcadeAutoStart(false);
                setIsArcadeGamesOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs border border-purple-300 shadow-md flex items-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <Gamepad2 className="w-4 h-4 text-cyan-300" />
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <span>🕹️ Tüm 10 Mini Oyun</span>
                  <span className="px-1 py-0.2 bg-slate-900 text-purple-300 rounded text-[9px] font-mono">[E / J]</span>
                </div>
                <div className="text-[10px] text-purple-200 opacity-90 font-bold">Arcade Salonu & 2X Gün</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Floating Reward Toast */}
      {rewardToast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[130] pointer-events-none animate-in slide-in-from-top-4 duration-200">
          <div className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-black text-sm border-2 border-yellow-200 shadow-2xl flex items-center gap-2.5">
            <Award className="w-5 h-5 text-slate-950 animate-bounce" />
            <span>{rewardToast.message}</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-950 text-amber-300 text-xs">
              +{rewardToast.coins} 🍯 | +{rewardToast.tokens} 🎟️
            </span>
          </div>
        </div>
      )}

      {/* Cat Merchant Shop Modal */}
      <CatMerchantShopModal
        isOpen={isCatShopOpen}
        onClose={() => setIsCatShopOpen(false)}
      />

      {/* Health & Consumables Shop Modal */}
      <HealthConsumablesShopModal
        isOpen={isHealthShopOpen}
        onClose={() => setIsHealthShopOpen(false)}
        coins={gameStats.coins}
        currentHp={gameStats.currentHp}
        maxHp={gameStats.maxHp}
        onConsumeFood={handleConsumeFood}
      />

      {/* Treasure & Collected Items Inventory Modal */}
      <TreasureInventoryModal
        isOpen={isTreasureInventoryOpen}
        onClose={() => setIsTreasureInventoryOpen(false)}
        coins={gameStats.coins}
        honeyGems={gameStats.honeyGems}
      />

      {/* Arcade Games Modal */}
      <ArcadeGamesModal
        isOpen={isArcadeGamesOpen}
        initialGameId={selectedArcadeGame}
        autoStart={arcadeAutoStart}
        onRewardEarned={(coins, tokens) => {
          setRewardToast({
            message: 'Tebrikler! Mini Oyun Ödülü Kazanıldı!',
            coins,
            tokens
          });
          setTimeout(() => setRewardToast(null), 3500);
        }}
        onClose={() => {
          setIsArcadeGamesOpen(false);
          setArcadeAutoStart(false);
        }}
      />

      {/* Drawing Inspector Modal */}
      <DrawingInspectorModal
        isOpen={isDrawingModalOpen}
        onClose={() => setIsDrawingModalOpen(false)}
        onTeleportToSpace={handleTeleportToSpace}
        aliensRescued={aliensRescued}
      />

      {/* 3D Character Studio Modal */}
      <CharacterStudioModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onApplyDesign={handleApplyDesign}
      />

      {/* Space 7 Mor Ayı Giant Dialogue & Badem Rescue Overlay */}
      <SpaceBossDialogueOverlay />

      {/* 22-Level Map Selector Modal (Hidden immediately when Trailer opens) */}
      <MapSelectorModal
        isOpen={isMapModalOpen && !isTrailerOpen}
        onClose={() => setIsMapModalOpen(false)}
      />

      {/* Save & Game Progress Manager Modal */}
      <SaveManagerModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
      />

      {/* 5-Minute 20:00 Subterranean World Update Trailer Modal */}
      <UndergroundTrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        onTriggerEarthquakeInGame={() => {
          const enhancer = (window as any).__superBearSpaceEnhancer;
          if (enhancer && enhancer.triggerSubterraneanRupture) {
            enhancer.triggerSubterraneanRupture();
          }
        }}
      />

      {/* Global Mobile / Tablet Touch Controls (Hidden during Studio and any active modal) */}
      {!isAnyModalOpen && (
        <TouchDragController
          mode="touch"
        />
      )}

      {/* Standalone Loot Box Opening Modal with 4 Bundles & Shaking Animations */}
      <LootBoxModal
        isOpen={isLootBoxModalOpen}
        onClose={() => setIsLootBoxModalOpen(false)}
        playerGold={playerStats.coins}
        onGoldChange={(newGold) => {
          setPlayerStats(prev => ({ ...prev, coins: newGold }));
        }}
        purchasedIds={purchasedIds}
        onItemsPurchased={(newItems) => {
          setPurchasedIds(newItems);
        }}
      />

      {/* Country and Language Selector Modal */}
      <CountryLanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
      />

      {/* Opening Animated Cutscene Movie Modal */}
      <OpeningCinematicModal
        isOpen={isCinematicOpen}
        onClose={() => setIsCinematicOpen(false)}
      />

      {/* Automatic Mobile Landscape Helper */}
      <LandscapeOrientationHandler />
    </>
  );
};
