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
import { ArcadeGamesModal } from '../components/ArcadeGamesModal';
import { DeviceSelectionModal, ControlMode } from '../components/DeviceSelectionModal';
import { TouchDragController } from '../components/TouchDragController';
import { LandscapeOrientationHandler } from '../components/LandscapeOrientationHandler';
import { SaveManagerModal } from '../components/SaveManagerModal';
import { LootBoxModal } from '../components/LootBoxModal';
import { ShoppingBag, Gamepad2 } from 'lucide-react';

export const CustomizerAppOverlay: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDrawingModalOpen, setIsDrawingModalOpen] = useState(false);
  const [isCatShopOpen, setIsCatShopOpen] = useState(false);
  const [isHealthShopOpen, setIsHealthShopOpen] = useState(false);
  const [isTreasureInventoryOpen, setIsTreasureInventoryOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isArcadeGamesOpen, setIsArcadeGamesOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isLootBoxModalOpen, setIsLootBoxModalOpen] = useState(false);

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
  
  // Device Selection Welcome Modal (white background selection on entry)
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(true);
  const [controlMode, setControlMode] = useState<ControlMode>(() => {
    const saved = localStorage.getItem('super_bear_control_mode');
    return (saved === 'mouse' || saved === 'touch') ? saved : 'touch';
  });

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

  // Synchronize modal open status to prevent touch/joystick conflicts
  const isAnyModalOpen =
    isOpen ||
    isDrawingModalOpen ||
    isCatShopOpen ||
    isMapModalOpen ||
    isTrailerOpen ||
    isArcadeGamesOpen ||
    isDeviceModalOpen ||
    isSaveModalOpen ||
    isLootBoxModalOpen;

  useEffect(() => {
    (window as any).__superBearModalOpen = isAnyModalOpen;
    if (isAnyModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [isAnyModalOpen]);

  const handleSelectDeviceMode = (mode: ControlMode) => {
    setControlMode(mode);
    localStorage.setItem('super_bear_control_mode', mode);
    setIsDeviceModalOpen(false);
  };

  useEffect(() => {
    // Expose open helper globally
    (window as unknown as { __openCustomizer?: () => void }).__openCustomizer = () => {
      setIsOpen(true);
    };
    (window as unknown as { __openTrailerModal?: () => void }).__openTrailerModal = () => {
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

    const handleOpenTrailer = () => setIsTrailerOpen(true);
    window.addEventListener('superbear:open-trailer', handleOpenTrailer);

    const handleOpenArcade = () => setIsArcadeGamesOpen(true);
    window.addEventListener('superbear:open-arcade-games', handleOpenArcade);

    const handleOpenSaveModal = () => setIsSaveModalOpen(true);
    window.addEventListener('superbear:open-save-modal', handleOpenSaveModal);

    const handleOpenLootBoxes = () => setIsLootBoxModalOpen(true);
    window.addEventListener('superbear:open-lootboxes', handleOpenLootBoxes);

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
      {/* Space HUD Bar */}
      <SpaceActionHUD
        onOpenDrawingModal={() => setIsDrawingModalOpen(true)}
        onOpenCatShop={() => setIsCatShopOpen(true)}
        onOpenMapModal={() => setIsMapModalOpen(true)}
        onOpenArcade={() => setIsArcadeGamesOpen(true)}
        onOpenSaveModal={() => setIsSaveModalOpen(true)}
        aliensRescued={aliensRescued}
        controlMode={controlMode}
        onOpenDeviceSelector={() => setIsDeviceModalOpen(true)}
      />

      {/* Cat Merchant Proximity Interactive Floating Banner */}
      {isNearCatMerchant && !isCatShopOpen && (
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

      {/* Retro Arcade Proximity Floating Banner - Positioned top-center so it never blocks mobile controls */}
      {isNearArcade && !isArcadeGamesOpen && (
        <div className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-[90] pointer-events-auto animate-in slide-in-from-top-4 duration-200">
          <button
            onClick={() => setIsArcadeGamesOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm border-2 border-purple-300 shadow-2xl backdrop-blur-md flex items-center gap-3 transition transform active:scale-95 hover:scale-105 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center text-lg shadow-inner">
              🕹️
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5 leading-tight">
                <span>Retro Arcade Mini Oyun Salonu</span>
                <span className="px-1.5 py-0.2 bg-slate-950 text-purple-300 rounded text-[10px] font-mono">[E / J Tuşu]</span>
              </div>
              <p className="text-[11px] font-bold text-purple-200 opacity-90">
                "10 Nostaljik Atari Oyunu & 2X Jeton!"
              </p>
            </div>
            <Gamepad2 className="w-5 h-5 text-white animate-bounce ml-1" />
          </button>
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
        onClose={() => setIsArcadeGamesOpen(false)}
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

      {/* 22-Level Map Selector Modal (15 Earth + Red Line + 7 Space) */}
      <MapSelectorModal
        isOpen={isMapModalOpen}
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

      {/* Global Touch / Mouse Drag Controls for All Modes */}
      <TouchDragController
        mode={controlMode}
        onSwitchMode={() => setIsDeviceModalOpen(true)}
      />

      {/* Initial Clean White Entry Screen for Device Selection */}
      <DeviceSelectionModal
        isOpen={isDeviceModalOpen}
        onSelectMode={handleSelectDeviceMode}
      />

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

      {/* Automatic Mobile Landscape Helper */}
      <LandscapeOrientationHandler />
    </>
  );
};
