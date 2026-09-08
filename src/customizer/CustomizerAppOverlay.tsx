import React, { useState, useEffect } from 'react';
import { CharacterStudioModal } from './CharacterStudioModal';
import { syncDesignToGameInstance, getCurrentSavedDesign } from './GameBridge';
import { CustomCharacterDesign } from './types';
import { DrawingInspectorModal } from '../components/DrawingInspectorModal';
import { SpaceActionHUD } from '../components/SpaceActionHUD';
import { CatMerchantShopModal } from '../components/CatMerchantShopModal';
import { SpaceBossDialogueOverlay } from '../components/SpaceBossDialogueOverlay';
import { MapSelectorModal } from '../components/MapSelectorModal';
import { UndergroundTrailerModal } from '../components/UndergroundTrailerModal';
import { ArcadeGamesModal } from '../components/ArcadeGamesModal';
import { DeviceSelectionModal, ControlMode } from '../components/DeviceSelectionModal';
import { TouchDragController } from '../components/TouchDragController';
import { ShoppingBag, Gamepad2 } from 'lucide-react';

export const CustomizerAppOverlay: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDrawingModalOpen, setIsDrawingModalOpen] = useState(false);
  const [isCatShopOpen, setIsCatShopOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isArcadeGamesOpen, setIsArcadeGamesOpen] = useState(false);
  
  // Device Selection Welcome Modal (white background selection on entry)
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(true);
  const [controlMode, setControlMode] = useState<ControlMode>(() => {
    const saved = localStorage.getItem('super_bear_control_mode');
    return (saved === 'mouse' || saved === 'touch') ? saved : 'touch';
  });

  const [isNearCatMerchant, setIsNearCatMerchant] = useState(false);
  const [isNearArcade, setIsNearArcade] = useState(false);

  const [aliensRescued, setAliensRescued] = useState(0);
  const [, setActiveDesign] = useState<CustomCharacterDesign>(getCurrentSavedDesign);

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

    const handleOpenMapSelector = () => setIsMapModalOpen(true);
    window.addEventListener('superbear:open-map-selector', handleOpenMapSelector);

    const handleOpenTrailer = () => setIsTrailerOpen(true);
    window.addEventListener('superbear:open-trailer', handleOpenTrailer);

    const handleOpenArcade = () => setIsArcadeGamesOpen(true);
    window.addEventListener('superbear:open-arcade-games', handleOpenArcade);

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
      } else if (e.code === 'KeyB' || e.key === 'b' || e.key === 'B' || e.code === 'KeyE' || e.key === 'e' || e.key === 'E') {
        if (isNearArcade) {
          setIsArcadeGamesOpen(true);
        } else {
          setIsCatShopOpen((prev) => !prev);
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
      window.removeEventListener('superbear:open-map-selector', handleOpenMapSelector);
      window.removeEventListener('superbear:open-trailer', handleOpenTrailer);
      window.removeEventListener('superbear:open-arcade-games', handleOpenArcade);
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

  return (
    <>
      {/* Space HUD Bar */}
      <SpaceActionHUD
        onOpenDrawingModal={() => setIsDrawingModalOpen(true)}
        onOpenCatShop={() => setIsCatShopOpen(true)}
        onOpenMapModal={() => setIsMapModalOpen(true)}
        aliensRescued={aliensRescued}
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

      {/* Retro Arcade Proximity Floating Banner - ONLY shown when standing next to Arcade Machine */}
      {isNearArcade && !isArcadeGamesOpen && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[85] pointer-events-auto animate-in slide-in-from-bottom-4 duration-200">
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
    </>
  );
};
