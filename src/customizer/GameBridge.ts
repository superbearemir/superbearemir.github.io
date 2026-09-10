import * as THREE from 'three';
import { CustomCharacterDesign } from './types';
import { createCompositeTexture, createCapeTexture, hexToInt } from './ImageAnalyzer';
import { SHOP_ITEMS } from '../data/shopItemsData';
import { buildHatMesh, buildFaceMesh, buildBackMesh, buildHandMesh } from './equipmentMeshBuilder';

const STORAGE_KEY_CURRENT = 'super_bear_custom_design_current';
const STORAGE_KEY_PRESETS = 'super_bear_custom_presets_v1';

export function createDefaultDesign(): CustomCharacterDesign {
  return {
    id: 'design_' + Date.now(),
    name: 'Bozayı Şampiyonu',
    createdAt: Date.now(),
    imageSrc: null,
    palette: {
      furColor: '#8B4513',
      bellyColor: '#D2B48C',
      muzzleColor: '#E6D7C3',
      earInnerColor: '#D29B78',
      pawColor: '#6B3B1B',
      eyeColor: '#111827',
      capeColor: '#F59E0B',
      accentColor: '#3B82F6',
    },
    extractedSwatches: [
      '#8B4513', '#D2B48C', '#E6D7C3', '#6B3B1B', '#F59E0B', '#3B82F6', '#10B981', '#EC4899'
    ],
    morphology: {
      headScale: 1.0,
      bodyScale: 1.0,
      chubbyScale: 1.0,
      snoutScale: 1.0,
      earScale: 1.0,
      earType: 'round',
      armScale: 1.0,
      legScale: 1.0,
      overallScale: 1.0,
    },
    textureSettings: {
      mode: 'none',
      patternType: 'none',
      repeat: 2,
      rotation: 0,
      opacity: 0.85,
      blendMode: 'normal',
      decalShape: 'circle',
      decalScale: 1.0,
      applyToCape: true,
      applyToBody: true,
      applyToHead: true,
      applyToLimbs: true,
    },
    materialType: 'standard',
    glowIntensity: 0.6,
    auraType: 'none',
    auraColor: '#FFD700',
    capeEnabled: true,
  };
}

export function getCurrentSavedDesign(): CustomCharacterDesign {
  try {
    const data = localStorage.getItem(STORAGE_KEY_CURRENT);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error loading current design:', e);
  }
  return createDefaultDesign();
}

export function saveCurrentDesign(design: CustomCharacterDesign) {
  try {
    localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(design));
  } catch (e) {
    console.error('Error saving current design:', e);
  }
}

export function loadPresets(): CustomCharacterDesign[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_PRESETS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error loading presets:', e);
  }
  return [];
}

export function savePreset(design: CustomCharacterDesign): CustomCharacterDesign[] {
  const presets = loadPresets();
  const index = presets.findIndex(p => p.id === design.id);
  if (index >= 0) {
    presets[index] = { ...design };
  } else {
    presets.unshift({ ...design });
  }
  try {
    localStorage.setItem(STORAGE_KEY_PRESETS, JSON.stringify(presets));
  } catch (e) {
    console.error('Error saving preset:', e);
  }
  return presets;
}

export function deletePreset(id: string): CustomCharacterDesign[] {
  const presets = loadPresets().filter(p => p.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY_PRESETS, JSON.stringify(presets));
  } catch (e) {
    console.error('Error deleting preset:', e);
  }
  return presets;
}

// Texture cache for game instance
let activeGameFurTexture: THREE.CanvasTexture | null = null;

/**
 * Directly synchronizes custom design with in-game 3D PlayerBear instance
 */
export async function syncDesignToGameInstance(design: CustomCharacterDesign) {
  saveCurrentDesign(design);

  // Generate textures for fur and cape if needed
  let furCanvas: HTMLCanvasElement | undefined;
  let capeCanvas: HTMLCanvasElement | undefined;

  if (design.textureSettings.mode !== 'none' || design.textureSettings.patternType !== 'none' || design.imageSrc) {
    furCanvas = await createCompositeTexture(design.imageSrc, design.palette, design.textureSettings);
  }

  if (design.capeEnabled) {
    capeCanvas = await createCapeTexture(design.imageSrc, design.palette, design.name);
  }

  // Check if global game engine instance exists
  const game = (window as unknown as { __superBearGame?: any }).__superBearGame;
  if (game && game.playerBear) {
    const pb = game.playerBear;
    const p = design.palette;

    // 1. Update skin materials
    if (pb.furMat) pb.furMat.color.setHex(hexToInt(p.furColor));
    if (pb.bellyMat) pb.bellyMat.color.setHex(hexToInt(p.bellyColor));
    if (pb.muzzleMat) pb.muzzleMat.color.setHex(hexToInt(p.muzzleColor));
    if (pb.pawMat) pb.pawMat.color.setHex(hexToInt(p.pawColor));
    if (pb.earInnerMat) pb.earInnerMat.color.setHex(hexToInt(p.earInnerColor));
    if (pb.eyeMat) pb.eyeMat.color.setHex(hexToInt(p.eyeColor));

    // 2. Material Shader properties (metalness, roughness, emissive)
    if (pb.furMat) {
      const matType = design.materialType;
      if (matType === 'gold') {
        pb.furMat.metalness = 0.85;
        pb.furMat.roughness = 0.2;
        pb.furMat.emissive.setHex(0xb45309);
        pb.furMat.emissiveIntensity = 0.35 * design.glowIntensity;
      } else if (matType === 'magma') {
        pb.furMat.metalness = 0.2;
        pb.furMat.roughness = 0.5;
        pb.furMat.emissive.setHex(0xd97706);
        pb.furMat.emissiveIntensity = 0.65 * design.glowIntensity;
      } else if (matType === 'cyber') {
        pb.furMat.metalness = 0.85;
        pb.furMat.roughness = 0.25;
        pb.furMat.emissive.setHex(hexToInt(p.accentColor || '#06B6D4'));
        pb.furMat.emissiveIntensity = 0.5 * design.glowIntensity;
      } else if (matType === 'shiny') {
        pb.furMat.metalness = 0.6;
        pb.furMat.roughness = 0.2;
        pb.furMat.emissive.setHex(hexToInt(p.furColor));
        pb.furMat.emissiveIntensity = 0.25 * design.glowIntensity;
      } else if (matType === 'glass') {
        pb.furMat.metalness = 0.1;
        pb.furMat.roughness = 0.1;
        pb.furMat.transparent = true;
        pb.furMat.opacity = 0.85;
      } else {
        pb.furMat.metalness = 0.05;
        pb.furMat.roughness = 0.65;
        pb.furMat.emissive.setHex(0x000000);
        pb.furMat.emissiveIntensity = 0;
        pb.furMat.transparent = false;
        pb.furMat.opacity = 1.0;
      }

      // 3. Fur Texture Map
      if (furCanvas) {
        if (activeGameFurTexture) activeGameFurTexture.dispose();
        activeGameFurTexture = new THREE.CanvasTexture(furCanvas);
        activeGameFurTexture.wrapS = THREE.RepeatWrapping;
        activeGameFurTexture.wrapT = THREE.RepeatWrapping;
        pb.furMat.map = activeGameFurTexture;
        pb.furMat.needsUpdate = true;
      } else if (design.textureSettings.mode === 'none' && design.textureSettings.patternType === 'none') {
        if (activeGameFurTexture) activeGameFurTexture.dispose();
        activeGameFurTexture = null;
        pb.furMat.map = null;
        pb.furMat.needsUpdate = true;
      }
    }

    // 4. Update Morphology Scale
    const m = design.morphology;
    if (m) {
      if (pb.head) pb.head.scale.set(m.headScale, m.headScale, m.headScale);
      if (pb.body) pb.body.scale.set(m.bodyScale * m.chubbyScale, m.bodyScale, m.bodyScale * m.chubbyScale);
      if (pb.root) pb.root.scale.set(m.overallScale, m.overallScale, m.overallScale);
      if (pb.leftArm) pb.leftArm.scale.set(m.armScale, m.armScale, m.armScale);
      if (pb.rightArm) pb.rightArm.scale.set(m.armScale, m.armScale, m.armScale);
      if (pb.leftLeg) pb.leftLeg.scale.set(m.legScale, m.legScale, m.legScale);
      if (pb.rightLeg) pb.rightLeg.scale.set(m.legScale, m.legScale, m.legScale);
    }

    // 5. Cape visibility - Ensure only ONE cape exists! If backContainer has an equipped item, hide pb.capeGroup
    if (pb.capeGroup) {
      const backContainer = pb.root ? pb.root.getObjectByName('player_back_container') : null;
      const hasBackEquipped = backContainer && backContainer.children && backContainer.children.length > 0;
      pb.capeGroup.visible = !hasBackEquipped && design.capeEnabled;
    }
  }

  // Broadcast custom event so any UI/Audio updates
  window.dispatchEvent(new CustomEvent('superbear:custom-design-applied', { detail: design }));
}

/**
 * Synchronizes equipped items from Cat Merchant Shop (hats, crowns, glasses, cat ears, skins, aura)
 */
export function syncShopEquipmentsToGameInstance(equippedIds: string[]) {
  if (!equippedIds) return;
  const game = (window as unknown as { __superBearGame?: any }).__superBearGame;
  if (!game || !game.playerBear) return;

  const pb = game.playerBear;
  const root = pb.root || game.scene;
  if (!root) return;

  // 1. Determine parent nodes for realistic attachment:
  // If playerBear has head, attach hat and face items to pb.head so they move with head rotation
  const hatParent = pb.head || root;
  const faceParent = pb.head || root;
  const backParent = pb.body || root;
  const handParent = pb.rightArm || root;

  // 2. Find or create slot containers
  let hatContainer = hatParent.getObjectByName('player_hat_container');
  if (!hatContainer) {
    hatContainer = new THREE.Group();
    hatContainer.name = 'player_hat_container';
    if (pb.head) {
      hatContainer.position.set(0, 0.42, 0.05);
    } else {
      hatContainer.position.set(0, 1.55, 0.05);
    }
    hatParent.add(hatContainer);
  }

  let faceContainer = faceParent.getObjectByName('player_face_container');
  if (!faceContainer) {
    faceContainer = new THREE.Group();
    faceContainer.name = 'player_face_container';
    if (pb.head) {
      faceContainer.position.set(0, -0.05, 0.45);
    } else {
      faceContainer.position.set(0, 1.35, 0.38);
    }
    faceParent.add(faceContainer);
  }

  let backContainer = backParent.getObjectByName('player_back_container');
  if (!backContainer) {
    backContainer = new THREE.Group();
    backContainer.name = 'player_back_container';
    if (pb.body) {
      backContainer.position.set(0, 0.1, -0.42);
    } else {
      backContainer.position.set(0, 0.7, -0.42);
    }
    backParent.add(backContainer);
  }

  let handContainer = handParent.getObjectByName('player_hand_container');
  if (!handContainer) {
    handContainer = new THREE.Group();
    handContainer.name = 'player_hand_container';
    if (pb.rightArm) {
      handContainer.position.set(0, -0.38, 0.15);
    } else {
      handContainer.position.set(0.45, 0.5, 0.25);
    }
    handParent.add(handContainer);
  }

  // Clear existing accessories inside containers
  [hatContainer, faceContainer, backContainer, handContainer].forEach(container => {
    if (container && container.children) {
      while (container.children.length > 0) {
        container.remove(container.children[0]);
      }
    }
  });

  const currentDesign = getCurrentSavedDesign();
  let hasAuraItem = false;
  let hasSkinItem = false;
  let hasScaleItem = false;

  (equippedIds || []).forEach(id => {
    const itemData = SHOP_ITEMS.find(item => item.id === id);
    const colorInt = itemData?.color ? hexToInt(itemData.color) : 0xf59e0b;

    if (itemData) {
      if (itemData.slot === 'hat' && hatContainer) {
        hatContainer.add(buildHatMesh(id, colorInt));
      } else if (itemData.slot === 'face' && faceContainer) {
        faceContainer.add(buildFaceMesh(id, colorInt));
      } else if (itemData.slot === 'back' && backContainer) {
        backContainer.add(buildBackMesh(id, colorInt));
        currentDesign.capeEnabled = true;
      } else if (itemData.slot === 'hand' && handContainer) {
        handContainer.add(buildHandMesh(id, colorInt));
      } else if (itemData.slot === 'aura' || itemData.effectType === 'aura') {
        hasAuraItem = true;
        currentDesign.auraType = itemData.effectValue?.auraType || (id.includes('fire') ? 'fire' : id.includes('cosmic') ? 'cosmic' : 'sparkles');
        currentDesign.auraColor = itemData.color || '#facc15';
      } else if (itemData.slot === 'skin' || itemData.effectType?.startsWith('skin_')) {
        hasSkinItem = true;
        if (id.includes('gold') || itemData.effectType === 'skin_gold') {
          currentDesign.materialType = 'gold';
          currentDesign.palette.furColor = '#f59e0b';
          currentDesign.palette.bellyColor = '#fef08a';
        } else if (id.includes('magma') || itemData.effectType === 'skin_magma') {
          currentDesign.materialType = 'magma';
          currentDesign.palette.furColor = '#b91c1c';
          currentDesign.palette.bellyColor = '#f97316';
        } else if (id.includes('cyber') || itemData.effectType === 'skin_cyber') {
          currentDesign.materialType = 'cyber';
          currentDesign.palette.furColor = '#0284c7';
          currentDesign.palette.bellyColor = '#38bdf8';
        } else {
          currentDesign.materialType = 'shiny';
          if (itemData.color) currentDesign.palette.furColor = itemData.color;
        }
      }
    } else {
      // Legacy item checks fallback
      if (id === 'hat_wizard' && hatContainer) {
        hasAuraItem = true;
        currentDesign.auraType = 'cosmic';
        currentDesign.auraColor = '#3b82f6';
        hatContainer.add(buildHatMesh('hat_wizard', 0x3b82f6));
      } else if (id === 'hat_crown' && hatContainer) {
        hasSkinItem = true;
        currentDesign.materialType = 'gold';
        hatContainer.add(buildHatMesh('hat_crown', 0xfcb316));
      } else if (id === 'hat_glasses' && faceContainer) {
        faceContainer.add(buildFaceMesh('hat_glasses', 0x0f172a));
      } else if (id === 'hat_cat_ears' && hatContainer) {
        hatContainer.add(buildHatMesh('hat_cat_ears', 0xf59e0b));
      }
    }
  });

  if (!hasAuraItem) {
    currentDesign.auraType = 'none';
  }
  if (!hasScaleItem) {
    currentDesign.morphology.overallScale = 1.0;
    currentDesign.morphology.chubbyScale = 1.0;
  }
  if (!hasSkinItem && !equippedIds.includes('hat_crown')) {
    currentDesign.materialType = 'standard';
    currentDesign.palette.furColor = '#8b4513';
    currentDesign.palette.bellyColor = '#d2b48c';
  }

  syncDesignToGameInstance(currentDesign);
}
