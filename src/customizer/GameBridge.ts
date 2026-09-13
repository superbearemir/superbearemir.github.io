import * as THREE from 'three';
import { CustomCharacterDesign } from './types';
import { createCompositeTexture, createCapeTexture, hexToInt } from './ImageAnalyzer';
import { SHOP_ITEMS } from '../data/shopItemsData';
import { buildHatMesh, buildFaceMesh, buildBackMesh, buildHandMesh, buildBodyOutfitMesh } from './equipmentMeshBuilder';

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

export function normalizeDesign(input?: Partial<CustomCharacterDesign> | null): CustomCharacterDesign {
  const def = createDefaultDesign();
  if (!input || typeof input !== 'object') return def;

  const raw = input as any;

  return {
    ...def,
    ...raw,
    id: typeof raw.id === 'string' && raw.id ? raw.id : def.id,
    name: typeof raw.name === 'string' && raw.name ? raw.name : def.name,
    createdAt: typeof raw.createdAt === 'number' ? raw.createdAt : def.createdAt,
    imageSrc: raw.imageSrc ?? def.imageSrc,
    palette: {
      furColor: raw.palette?.furColor || def.palette.furColor,
      bellyColor: raw.palette?.bellyColor || def.palette.bellyColor,
      muzzleColor: raw.palette?.muzzleColor || def.palette.muzzleColor,
      earInnerColor: raw.palette?.earInnerColor || def.palette.earInnerColor,
      pawColor: raw.palette?.pawColor || def.palette.pawColor,
      eyeColor: raw.palette?.eyeColor || def.palette.eyeColor,
      capeColor: raw.palette?.capeColor || def.palette.capeColor,
      accentColor: raw.palette?.accentColor || def.palette.accentColor,
    },
    extractedSwatches: Array.isArray(raw.extractedSwatches) && raw.extractedSwatches.length > 0
      ? raw.extractedSwatches
      : def.extractedSwatches,
    morphology: {
      headScale: typeof raw.morphology?.headScale === 'number' ? raw.morphology.headScale : def.morphology.headScale,
      bodyScale: typeof raw.morphology?.bodyScale === 'number' ? raw.morphology.bodyScale : def.morphology.bodyScale,
      chubbyScale: typeof raw.morphology?.chubbyScale === 'number' ? raw.morphology.chubbyScale : def.morphology.chubbyScale,
      snoutScale: typeof raw.morphology?.snoutScale === 'number' ? raw.morphology.snoutScale : def.morphology.snoutScale,
      earScale: typeof raw.morphology?.earScale === 'number' ? raw.morphology.earScale : def.morphology.earScale,
      earType: raw.morphology?.earType || def.morphology.earType,
      armScale: typeof raw.morphology?.armScale === 'number' ? raw.morphology.armScale : def.morphology.armScale,
      legScale: typeof raw.morphology?.legScale === 'number' ? raw.morphology.legScale : def.morphology.legScale,
      overallScale: typeof raw.morphology?.overallScale === 'number' ? raw.morphology.overallScale : def.morphology.overallScale,
    },
    textureSettings: {
      mode: raw.textureSettings?.mode || def.textureSettings.mode,
      patternType: raw.textureSettings?.patternType || def.textureSettings.patternType,
      repeat: typeof raw.textureSettings?.repeat === 'number' ? raw.textureSettings.repeat : def.textureSettings.repeat,
      rotation: typeof raw.textureSettings?.rotation === 'number' ? raw.textureSettings.rotation : def.textureSettings.rotation,
      opacity: typeof raw.textureSettings?.opacity === 'number' ? raw.textureSettings.opacity : def.textureSettings.opacity,
      blendMode: raw.textureSettings?.blendMode || def.textureSettings.blendMode,
      decalShape: raw.textureSettings?.decalShape || def.textureSettings.decalShape,
      decalScale: typeof raw.textureSettings?.decalScale === 'number' ? raw.textureSettings.decalScale : def.textureSettings.decalScale,
      applyToCape: typeof raw.textureSettings?.applyToCape === 'boolean' ? raw.textureSettings.applyToCape : def.textureSettings.applyToCape,
      applyToBody: typeof raw.textureSettings?.applyToBody === 'boolean' ? raw.textureSettings.applyToBody : def.textureSettings.applyToBody,
      applyToHead: typeof raw.textureSettings?.applyToHead === 'boolean' ? raw.textureSettings.applyToHead : def.textureSettings.applyToHead,
      applyToLimbs: typeof raw.textureSettings?.applyToLimbs === 'boolean' ? raw.textureSettings.applyToLimbs : def.textureSettings.applyToLimbs,
    },
    materialType: raw.materialType || def.materialType,
    glowIntensity: typeof raw.glowIntensity === 'number' ? raw.glowIntensity : def.glowIntensity,
    auraType: raw.auraType || def.auraType,
    auraColor: raw.auraColor || def.auraColor,
    capeEnabled: typeof raw.capeEnabled === 'boolean' ? raw.capeEnabled : def.capeEnabled,
    notes: raw.notes,
  };
}

export function getCurrentSavedDesign(): CustomCharacterDesign {
  try {
    const data = localStorage.getItem(STORAGE_KEY_CURRENT);
    if (data) {
      const parsed = JSON.parse(data);
      return normalizeDesign(parsed);
    }
  } catch (e) {
    console.error('Error loading current design:', e);
  }
  return createDefaultDesign();
}

export function saveCurrentDesign(design: CustomCharacterDesign) {
  try {
    localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(normalizeDesign(design)));
  } catch (e) {
    console.error('Error saving current design:', e);
  }
}

export function loadPresets(): CustomCharacterDesign[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_PRESETS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.map(p => normalizeDesign(p));
      }
    }
  } catch (e) {
    console.error('Error loading presets:', e);
  }
  return [];
}

export function savePreset(design: CustomCharacterDesign): CustomCharacterDesign[] {
  const normalized = normalizeDesign(design);
  const presets = loadPresets();
  const index = presets.findIndex(p => p.id === normalized.id);
  if (index >= 0) {
    presets[index] = { ...normalized };
  } else {
    presets.unshift({ ...normalized });
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
export async function syncDesignToGameInstance(rawDesign: CustomCharacterDesign) {
  const design = normalizeDesign(rawDesign);
  saveCurrentDesign(design);

  // Generate textures for fur and cape if needed
  let furCanvas: HTMLCanvasElement | undefined;
  let capeCanvas: HTMLCanvasElement | undefined;

  if (design.textureSettings && (design.textureSettings.mode !== 'none' || design.textureSettings.patternType !== 'none' || design.imageSrc)) {
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
      } else if (!design.textureSettings || (design.textureSettings.mode === 'none' && design.textureSettings.patternType === 'none')) {
        if (activeGameFurTexture) activeGameFurTexture.dispose();
        activeGameFurTexture = null;
        pb.furMat.map = null;
        pb.furMat.needsUpdate = true;
      }
    }

    // 4. Update Morphology Scale
    const m = design.morphology;
    if (m) {
      if (pb.head) pb.head.scale.set(m.headScale ?? 1, m.headScale ?? 1, m.headScale ?? 1);
      if (pb.body) pb.body.scale.set((m.bodyScale ?? 1) * (m.chubbyScale ?? 1), m.bodyScale ?? 1, (m.bodyScale ?? 1) * (m.chubbyScale ?? 1));
      if (pb.root) pb.root.scale.set(m.overallScale ?? 1, m.overallScale ?? 1, m.overallScale ?? 1);
      if (pb.leftArm) pb.leftArm.scale.set(m.armScale ?? 1, m.armScale ?? 1, m.armScale ?? 1);
      if (pb.rightArm) pb.rightArm.scale.set(m.armScale ?? 1, m.armScale ?? 1, m.armScale ?? 1);
      if (pb.leftLeg) pb.leftLeg.scale.set(m.legScale ?? 1, m.legScale ?? 1, m.legScale ?? 1);
      if (pb.rightLeg) pb.rightLeg.scale.set(m.legScale ?? 1, m.legScale ?? 1, m.legScale ?? 1);
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

  // Clean up any previously misplaced containers across the scene graph to prevent ghost equipment
  const containerNames = [
    'player_hat_container',
    'player_face_container',
    'player_back_container',
    'player_hand_container',
    'player_outfit_container'
  ];

  containerNames.forEach(cName => {
    const existing = root.getObjectByName(cName);
    if (existing && existing.parent) {
      existing.parent.remove(existing);
    }
  });

  // Determine correct parent nodes for realistic attachment
  const hatParent = pb.head || (pb.body && pb.body.children ? pb.body.children.find((c: any) => c.isGroup) : null) || root;
  const faceParent = pb.head || hatParent;
  const backParent = pb.body || root;
  const handParent = pb.rightArm || root;
  const outfitParent = pb.body || root;

  // Create slot containers with precise offsets
  const hatContainer = new THREE.Group();
  hatContainer.name = 'player_hat_container';
  if (hatParent === pb.head || hatParent !== root) {
    hatContainer.position.set(0, 0, 0);
  } else {
    hatContainer.position.set(0, 1.25, 0);
  }
  hatParent.add(hatContainer);

  const faceContainer = new THREE.Group();
  faceContainer.name = 'player_face_container';
  if (faceParent === pb.head || faceParent !== root) {
    faceContainer.position.set(0, 0.05, 0.42);
  } else {
    faceContainer.position.set(0, 1.35, 0.38);
  }
  faceParent.add(faceContainer);

  const backContainer = new THREE.Group();
  backContainer.name = 'player_back_container';
  if (backParent === pb.body || backParent !== root) {
    backContainer.position.set(0, 0.1, -0.42);
  } else {
    backContainer.position.set(0, 0.7, -0.42);
  }
  backParent.add(backContainer);

  const handContainer = new THREE.Group();
  handContainer.name = 'player_hand_container';
  if (handParent === pb.rightArm || handParent !== root) {
    handContainer.position.set(0, -0.38, 0.12);
  } else {
    handContainer.position.set(0.45, 0.5, 0.25);
  }
  handParent.add(handContainer);

  const outfitContainer = new THREE.Group();
  outfitContainer.name = 'player_outfit_container';
  if (outfitParent === pb.body || outfitParent !== root) {
    outfitContainer.position.set(0, 0, 0);
  } else {
    outfitContainer.position.set(0, 0.9, 0);
  }
  outfitParent.add(outfitContainer);

  const currentDesign = normalizeDesign(getCurrentSavedDesign());
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
      } else if (itemData.slot === 'skin' || itemData.effectType?.startsWith('skin_')) {
        hasSkinItem = true;
        // Attach tailored 3D outfit mesh
        outfitContainer.add(buildBodyOutfitMesh(id, colorInt));

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
      } else if (itemData.slot === 'aura' || itemData.effectType === 'aura') {
        hasAuraItem = true;
        currentDesign.auraType = itemData.effectValue?.auraType || (id.includes('fire') ? 'fire' : id.includes('cosmic') ? 'cosmic' : 'sparkles');
        currentDesign.auraColor = itemData.color || '#facc15';
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
  if (!currentDesign.morphology) {
    currentDesign.morphology = { ...createDefaultDesign().morphology };
  }
  if (!hasScaleItem) {
    currentDesign.morphology.overallScale = 1.0;
    currentDesign.morphology.chubbyScale = 1.0;
  }
  if (!currentDesign.palette) {
    currentDesign.palette = { ...createDefaultDesign().palette };
  }
  if (!hasSkinItem && !equippedIds.includes('hat_crown')) {
    currentDesign.materialType = 'standard';
    currentDesign.palette.furColor = '#8b4513';
    currentDesign.palette.bellyColor = '#d2b48c';
  }

  syncDesignToGameInstance(currentDesign);
}
