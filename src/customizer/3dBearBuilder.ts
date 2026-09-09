import * as THREE from 'three';
import { CustomCharacterDesign, EarType } from './types';
import { hexToInt } from './ImageAnalyzer';

export interface BuiltBearModel {
  root: THREE.Group;
  bodyMesh: THREE.Mesh;
  bellyMesh: THREE.Mesh;
  headGroup: THREE.Group;
  headMesh: THREE.Mesh;
  muzzleMesh: THREE.Mesh;
  noseMesh: THREE.Mesh;
  leftEyeMesh: THREE.Mesh;
  rightEyeMesh: THREE.Mesh;
  leftEarGroup: THREE.Group;
  rightEarGroup: THREE.Group;
  leftArmGroup: THREE.Group;
  rightArmGroup: THREE.Group;
  leftLegGroup: THREE.Group;
  rightLegGroup: THREE.Group;
  capeGroup: THREE.Group;
  capeMesh: THREE.Mesh | null;
  auraGroup: THREE.Group;
  materials: {
    fur: THREE.MeshStandardMaterial;
    belly: THREE.MeshStandardMaterial;
    muzzle: THREE.MeshStandardMaterial;
    nose: THREE.MeshStandardMaterial;
    eyes: THREE.MeshStandardMaterial;
    innerEar: THREE.MeshStandardMaterial;
    paws: THREE.MeshStandardMaterial;
    cape: THREE.MeshStandardMaterial;
    aura: THREE.PointsMaterial | THREE.MeshBasicMaterial;
  };
  updateDesign: (design: CustomCharacterDesign, furCanvasTexture?: HTMLCanvasElement, capeCanvasTexture?: HTMLCanvasElement) => void;
  setAnimationPose: (pose: 'idle' | 'dance' | 'roar' | 'punch' | 'wave' | 'spin', time: number) => void;
  destroy: () => void;
}

export function createCustomBear3D(initialDesign?: CustomCharacterDesign): BuiltBearModel {
  const root = new THREE.Group();
  root.name = 'CustomBearRoot';

  // --- 1. Materials ---
  const furMat = new THREE.MeshStandardMaterial({
    color: 0x8b4513,
    roughness: 0.6,
    metalness: 0.05,
  });

  const bellyMat = new THREE.MeshStandardMaterial({
    color: 0xd2b48c,
    roughness: 0.7,
  });

  const muzzleMat = new THREE.MeshStandardMaterial({
    color: 0xe6d7c3,
    roughness: 0.7,
  });

  const noseMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.4,
  });

  const eyeMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    roughness: 0.2,
    metalness: 0.2,
  });

  const innerEarMat = new THREE.MeshStandardMaterial({
    color: 0xd29b78,
    roughness: 0.7,
  });

  const pawMat = new THREE.MeshStandardMaterial({
    color: 0x6b3b1b,
    roughness: 0.6,
  });

  const capeMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.5,
    side: THREE.DoubleSide,
  });

  const auraMat = new THREE.PointsMaterial({
    color: 0xffd700,
    size: 0.12,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
  });

  // --- 2. Body (Torso) ---
  const bodyGeo = new THREE.SphereGeometry(0.55, 24, 24);
  bodyGeo.scale(1, 1.15, 0.9);
  const bodyMesh = new THREE.Mesh(bodyGeo, furMat);
  bodyMesh.position.y = 0.9;
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  root.add(bodyMesh);

  // Belly
  const bellyGeo = new THREE.SphereGeometry(0.42, 20, 20);
  bellyGeo.scale(0.85, 0.95, 0.4);
  const bellyMesh = new THREE.Mesh(bellyGeo, bellyMat);
  bellyMesh.position.set(0, -0.05, 0.35);
  bodyMesh.add(bellyMesh);

  // --- 3. Head ---
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.65, 0.05);
  bodyMesh.add(headGroup);

  const headGeo = new THREE.SphereGeometry(0.46, 24, 24);
  const headMesh = new THREE.Mesh(headGeo, furMat);
  headMesh.castShadow = true;
  headGroup.add(headMesh);

  // Muzzle (Snout)
  const muzzleGeo = new THREE.SphereGeometry(0.24, 20, 20);
  muzzleGeo.scale(1.1, 0.8, 1);
  const muzzleMesh = new THREE.Mesh(muzzleGeo, muzzleMat);
  muzzleMesh.position.set(0, -0.08, 0.32);
  headGroup.add(muzzleMesh);

  // Nose
  const noseGeo = new THREE.SphereGeometry(0.08, 14, 14);
  noseGeo.scale(1.2, 0.8, 1);
  const noseMesh = new THREE.Mesh(noseGeo, noseMat);
  noseMesh.position.set(0, 0.04, 0.22);
  muzzleMesh.add(noseMesh);

  // Left Eye
  const eyeGeo = new THREE.SphereGeometry(0.075, 16, 16);
  const leftEyeMesh = new THREE.Mesh(eyeGeo, eyeMat);
  leftEyeMesh.position.set(-0.16, 0.08, 0.38);
  headGroup.add(leftEyeMesh);

  // Eye reflection dot
  const pupilGeo = new THREE.SphereGeometry(0.025, 8, 8);
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
  leftPupil.position.set(-0.02, 0.025, 0.055);
  leftEyeMesh.add(leftPupil);

  // Right Eye
  const rightEyeMesh = new THREE.Mesh(eyeGeo, eyeMat);
  rightEyeMesh.position.set(0.16, 0.08, 0.38);
  headGroup.add(rightEyeMesh);

  const rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
  rightPupil.position.set(-0.02, 0.025, 0.055);
  rightEyeMesh.add(rightPupil);

  // --- 4. Ears Container Groups ---
  const leftEarGroup = new THREE.Group();
  leftEarGroup.position.set(-0.35, 0.38, 0);
  headGroup.add(leftEarGroup);

  const rightEarGroup = new THREE.Group();
  rightEarGroup.position.set(0.35, 0.38, 0);
  headGroup.add(rightEarGroup);

  function rebuildEars(earType: EarType) {
    // Clear old children
    while (leftEarGroup.children.length > 0) leftEarGroup.remove(leftEarGroup.children[0]);
    while (rightEarGroup.children.length > 0) rightEarGroup.remove(rightEarGroup.children[0]);

    if (earType === 'round') {
      // Classic round bear ears
      const earOuterGeo = new THREE.SphereGeometry(0.16, 16, 16);
      earOuterGeo.scale(1, 1, 0.6);
      const earInnerGeo = new THREE.SphereGeometry(0.1, 14, 14);
      earInnerGeo.scale(1, 1, 0.4);

      const leftEar = new THREE.Mesh(earOuterGeo, furMat);
      leftEar.rotation.z = 0.3;
      const leftInner = new THREE.Mesh(earInnerGeo, innerEarMat);
      leftInner.position.set(0, 0, 0.06);
      leftEar.add(leftInner);
      leftEarGroup.add(leftEar);

      const rightEar = new THREE.Mesh(earOuterGeo, furMat);
      rightEar.rotation.z = -0.3;
      const rightInner = new THREE.Mesh(earInnerGeo, innerEarMat);
      rightInner.position.set(0, 0, 0.06);
      rightEar.add(rightInner);
      rightEarGroup.add(rightEar);
    } else if (earType === 'pointy' || earType === 'cat') {
      // Pointy fox/wolf/cat ears
      const coneGeo = new THREE.ConeGeometry(0.14, 0.32, 16);
      coneGeo.rotateX(Math.PI);
      const innerConeGeo = new THREE.ConeGeometry(0.09, 0.24, 14);
      innerConeGeo.rotateX(Math.PI);

      const leftEar = new THREE.Mesh(coneGeo, furMat);
      leftEar.rotation.set(Math.PI + 0.15, 0, 0.25);
      const leftInner = new THREE.Mesh(innerConeGeo, innerEarMat);
      leftInner.position.set(0, -0.02, 0.04);
      leftEar.add(leftInner);
      leftEarGroup.add(leftEar);

      const rightEar = new THREE.Mesh(coneGeo, furMat);
      rightEar.rotation.set(Math.PI + 0.15, 0, -0.25);
      const rightInner = new THREE.Mesh(innerConeGeo, innerEarMat);
      rightInner.position.set(0, -0.02, 0.04);
      rightEar.add(rightInner);
      rightEarGroup.add(rightEar);
    } else if (earType === 'bunny') {
      // Long cute bunny ears
      const bunnyGeo = new THREE.CylinderGeometry(0.08, 0.05, 0.6, 16);
      bunnyGeo.scale(1, 1, 0.4);
      const innerBunnyGeo = new THREE.CylinderGeometry(0.05, 0.03, 0.45, 14);
      innerBunnyGeo.scale(1, 1, 0.3);

      const leftEar = new THREE.Mesh(bunnyGeo, furMat);
      leftEar.position.y = 0.22;
      leftEar.rotation.set(-0.1, 0, 0.15);
      const leftInner = new THREE.Mesh(innerBunnyGeo, innerEarMat);
      leftInner.position.set(0, 0, 0.03);
      leftEar.add(leftInner);
      leftEarGroup.add(leftEar);

      const rightEar = new THREE.Mesh(bunnyGeo, furMat);
      rightEar.position.y = 0.22;
      rightEar.rotation.set(-0.1, 0, -0.15);
      const rightInner = new THREE.Mesh(innerBunnyGeo, innerEarMat);
      rightInner.position.set(0, 0, 0.03);
      rightEar.add(rightInner);
      rightEarGroup.add(rightEar);
    } else if (earType === 'horns') {
      // Dragon/Demon Horns
      const hornGeo = new THREE.ConeGeometry(0.1, 0.4, 16);
      const hornMat = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.3,
        metalness: 0.6,
      });

      const leftHorn = new THREE.Mesh(hornGeo, hornMat);
      leftHorn.position.set(0, 0.15, 0);
      leftHorn.rotation.set(-0.3, 0, 0.4);
      leftEarGroup.add(leftHorn);

      const rightHorn = new THREE.Mesh(hornGeo, hornMat);
      rightHorn.position.set(0, 0.15, 0);
      rightHorn.rotation.set(-0.3, 0, -0.4);
      rightEarGroup.add(rightHorn);
    }
  }
  rebuildEars('round');

  // --- 5. Arms & Paws ---
  const armLimbGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.45, 14);
  const pawGeo = new THREE.SphereGeometry(0.16, 16, 16);
  pawGeo.scale(1, 0.8, 1.2);

  // Left Arm
  const leftArmGroup = new THREE.Group();
  leftArmGroup.position.set(-0.55, 0.2, 0);
  bodyMesh.add(leftArmGroup);

  const leftArmMesh = new THREE.Mesh(armLimbGeo, furMat);
  leftArmMesh.position.y = -0.2;
  leftArmGroup.add(leftArmMesh);

  const leftPawMesh = new THREE.Mesh(pawGeo, pawMat);
  leftPawMesh.position.set(0, -0.4, 0.05);
  leftArmGroup.add(leftPawMesh);

  // Right Arm
  const rightArmGroup = new THREE.Group();
  rightArmGroup.position.set(0.55, 0.2, 0);
  bodyMesh.add(rightArmGroup);

  const rightArmMesh = new THREE.Mesh(armLimbGeo, furMat);
  rightArmMesh.position.y = -0.2;
  rightArmGroup.add(rightArmMesh);

  const rightPawMesh = new THREE.Mesh(pawGeo, pawMat);
  rightPawMesh.position.set(0, -0.4, 0.05);
  rightArmGroup.add(rightPawMesh);

  // --- 6. Legs & Feet ---
  const legLimbGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.4, 14);
  const footGeo = new THREE.SphereGeometry(0.18, 16, 16);
  footGeo.scale(1, 0.6, 1.4);

  // Left Leg
  const leftLegGroup = new THREE.Group();
  leftLegGroup.position.set(-0.25, -0.5, 0);
  bodyMesh.add(leftLegGroup);

  const leftLegMesh = new THREE.Mesh(legLimbGeo, furMat);
  leftLegMesh.position.y = -0.15;
  leftLegGroup.add(leftLegMesh);

  const leftFootMesh = new THREE.Mesh(footGeo, pawMat);
  leftFootMesh.position.set(0, -0.32, 0.1);
  leftLegGroup.add(leftFootMesh);

  // Right Leg
  const rightLegGroup = new THREE.Group();
  rightLegGroup.position.set(0.25, -0.5, 0);
  bodyMesh.add(rightLegGroup);

  const rightLegMesh = new THREE.Mesh(legLimbGeo, furMat);
  rightLegMesh.position.y = -0.15;
  rightLegGroup.add(rightLegMesh);

  const rightFootMesh = new THREE.Mesh(footGeo, pawMat);
  rightFootMesh.position.set(0, -0.32, 0.1);
  rightLegGroup.add(rightFootMesh);

  // --- 7. Cape ---
  const capeGroup = new THREE.Group();
  capeGroup.position.set(0, 0.35, -0.45);
  bodyMesh.add(capeGroup);

  // Compact hero cape stopping well above the ground
  const capeGeo = new THREE.PlaneGeometry(0.72, 0.62, 8, 8);
  // Curve the cape slightly
  const posAttr = capeGeo.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const y = posAttr.getY(i);
    const z = Math.sin((y + 0.3) * Math.PI) * 0.08;
    posAttr.setZ(i, z);
  }
  capeGeo.computeVertexNormals();

  let capeMesh: THREE.Mesh | null = new THREE.Mesh(capeGeo, capeMat);
  capeMesh.position.set(0, -0.28, -0.06);
  capeMesh.rotation.x = 0.14;
  capeMesh.castShadow = true;
  capeGroup.add(capeMesh);

  // --- 8. Particle Aura System ---
  const auraGroup = new THREE.Group();
  root.add(auraGroup);

  const auraParticleCount = 45;
  const auraGeo = new THREE.BufferGeometry();
  const auraPositions = new Float32Array(auraParticleCount * 3);
  for (let i = 0; i < auraParticleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const rad = 0.5 + Math.random() * 0.7;
    const y = Math.random() * 2.0;
    auraPositions[i * 3] = Math.cos(angle) * rad;
    auraPositions[i * 3 + 1] = y;
    auraPositions[i * 3 + 2] = Math.sin(angle) * rad;
  }
  auraGeo.setAttribute('position', new THREE.BufferAttribute(auraPositions, 3));
  const auraParticles = new THREE.Points(auraGeo, auraMat);
  auraGroup.add(auraParticles);

  // Textures reference
  let currentFurTex: THREE.CanvasTexture | null = null;
  let currentCapeTex: THREE.CanvasTexture | null = null;

  // --- Update Design Method ---
  const updateDesign = (
    design: CustomCharacterDesign,
    furCanvasTexture?: HTMLCanvasElement,
    capeCanvasTexture?: HTMLCanvasElement
  ) => {
    // 1. Update colors
    const p = design.palette;
    furMat.color.setHex(hexToInt(p.furColor));
    bellyMat.color.setHex(hexToInt(p.bellyColor));
    muzzleMat.color.setHex(hexToInt(p.muzzleColor));
    innerEarMat.color.setHex(hexToInt(p.earInnerColor));
    pawMat.color.setHex(hexToInt(p.pawColor));
    eyeMat.color.setHex(hexToInt(p.eyeColor));
    capeMat.color.setHex(hexToInt(p.capeColor));

    // 2. Material types (gold, magma, cyber, glass, shiny, standard)
    const matType = design.materialType;
    if (matType === 'gold') {
      furMat.metalness = 0.85;
      furMat.roughness = 0.2;
      furMat.emissive.setHex(0xb45309);
      furMat.emissiveIntensity = 0.35 * design.glowIntensity;
    } else if (matType === 'magma') {
      furMat.metalness = 0.2;
      furMat.roughness = 0.5;
      furMat.emissive.setHex(0xd97706);
      furMat.emissiveIntensity = 0.65 * design.glowIntensity;
    } else if (matType === 'cyber') {
      furMat.metalness = 0.85;
      furMat.roughness = 0.25;
      furMat.emissive.setHex(hexToInt(p.accentColor || '#06B6D4'));
      furMat.emissiveIntensity = 0.5 * design.glowIntensity;
    } else if (matType === 'shiny') {
      furMat.metalness = 0.6;
      furMat.roughness = 0.2;
      furMat.emissive.setHex(hexToInt(p.furColor));
      furMat.emissiveIntensity = 0.25 * design.glowIntensity;
    } else if (matType === 'glass') {
      furMat.metalness = 0.1;
      furMat.roughness = 0.1;
      furMat.transparent = true;
      furMat.opacity = 0.85;
    } else {
      furMat.metalness = 0.05;
      furMat.roughness = 0.65;
      furMat.emissive.setHex(0x000000);
      furMat.emissiveIntensity = 0;
      furMat.transparent = false;
      furMat.opacity = 1.0;
    }

    // 3. Apply custom textures
    if (furCanvasTexture) {
      if (currentFurTex) currentFurTex.dispose();
      currentFurTex = new THREE.CanvasTexture(furCanvasTexture);
      currentFurTex.wrapS = THREE.RepeatWrapping;
      currentFurTex.wrapT = THREE.RepeatWrapping;
      furMat.map = currentFurTex;
      furMat.needsUpdate = true;
    } else if (design.textureSettings.mode === 'none' && design.textureSettings.patternType === 'none') {
      furMat.map = null;
      furMat.needsUpdate = true;
    }

    if (capeCanvasTexture) {
      if (currentCapeTex) currentCapeTex.dispose();
      currentCapeTex = new THREE.CanvasTexture(capeCanvasTexture);
      capeMat.map = currentCapeTex;
      capeMat.needsUpdate = true;
    } else {
      capeMat.map = null;
      capeMat.needsUpdate = true;
    }

    // 4. Update Morphology Scales
    const m = design.morphology;
    headGroup.scale.set(m.headScale, m.headScale, m.headScale);
    muzzleMesh.scale.set(1.1 * m.snoutScale, 0.8 * m.snoutScale, 1 * m.snoutScale);
    leftEarGroup.scale.set(m.earScale, m.earScale, m.earScale);
    rightEarGroup.scale.set(m.earScale, m.earScale, m.earScale);
    rebuildEars(m.earType);

    bodyMesh.scale.set(m.bodyScale * m.chubbyScale, m.bodyScale, m.bodyScale * m.chubbyScale);
    leftArmGroup.scale.set(m.armScale, m.armScale, m.armScale);
    rightArmGroup.scale.set(m.armScale, m.armScale, m.armScale);
    leftLegGroup.scale.set(m.legScale, m.legScale, m.legScale);
    rightLegGroup.scale.set(m.legScale, m.legScale, m.legScale);
    root.scale.set(m.overallScale, m.overallScale, m.overallScale);

    // 5. Cape visibility
    capeGroup.visible = design.capeEnabled;

    // 6. Aura settings
    if (design.auraType === 'none') {
      auraGroup.visible = false;
    } else {
      auraGroup.visible = true;
      auraMat.color.setHex(hexToInt(design.auraColor || p.accentColor || '#FFD700'));
      auraMat.size = design.auraType === 'fire' ? 0.18 : design.auraType === 'cosmic' ? 0.14 : 0.1;
    }
  };

  // --- Animation Poses ---
  const setAnimationPose = (pose: 'idle' | 'dance' | 'roar' | 'punch' | 'wave' | 'spin', time: number) => {
    // Animate Aura particles upwards
    if (auraGroup.visible) {
      const pos = auraGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < auraParticleCount; i++) {
        let y = pos.getY(i) + 0.02;
        if (y > 2.2) y = 0.2;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
      auraGroup.rotation.y += 0.015;
    }

    // Flap cape slightly
    if (capeMesh) {
      capeMesh.rotation.x = 0.15 + Math.sin(time * 3) * 0.08;
    }

    if (pose === 'idle') {
      const breath = Math.sin(time * 3) * 0.03;
      bodyMesh.position.y = 0.9 + breath;
      bodyMesh.rotation.set(0, 0, 0);
      headGroup.rotation.set(Math.sin(time * 1.5) * 0.04, 0, Math.cos(time * 2) * 0.03);
      leftArmGroup.rotation.set(Math.sin(time * 3) * 0.08, 0, 0.1);
      rightArmGroup.rotation.set(-Math.sin(time * 3) * 0.08, 0, -0.1);
      leftLegGroup.rotation.set(0, 0, 0);
      rightLegGroup.rotation.set(0, 0, 0);
    } else if (pose === 'dance') {
      const beat = time * 8;
      bodyMesh.position.y = 0.9 + Math.abs(Math.sin(beat)) * 0.2;
      bodyMesh.rotation.z = Math.sin(beat) * 0.15;
      bodyMesh.rotation.y = Math.sin(beat * 0.5) * 0.3;
      leftArmGroup.rotation.set(Math.PI * 0.8 + Math.sin(beat) * 0.4, 0, 0.4);
      rightArmGroup.rotation.set(Math.PI * 0.8 - Math.sin(beat) * 0.4, 0, -0.4);
      leftLegGroup.rotation.x = Math.sin(beat) * 0.3;
      rightLegGroup.rotation.x = -Math.sin(beat) * 0.3;
    } else if (pose === 'roar') {
      bodyMesh.rotation.x = -0.2;
      bodyMesh.position.y = 1.0;
      headGroup.rotation.x = -0.3;
      leftArmGroup.rotation.set(Math.PI * 0.75, 0, 0.6);
      rightArmGroup.rotation.set(Math.PI * 0.75, 0, -0.6);
      const shake = Math.sin(time * 40) * 0.03;
      headGroup.position.x = shake;
    } else if (pose === 'punch') {
      const punchCycle = Math.sin(time * 10);
      rightArmGroup.rotation.set(-Math.PI * 0.5 + punchCycle * 0.8, 0, -0.2);
      leftArmGroup.rotation.set(0.4, 0, 0.3);
      bodyMesh.rotation.y = -punchCycle * 0.3;
    } else if (pose === 'wave') {
      bodyMesh.rotation.set(0, 0, 0);
      leftArmGroup.rotation.set(0.1, 0, 0.1);
      rightArmGroup.rotation.set(Math.PI * 0.85, 0, Math.sin(time * 12) * 0.3 - 0.2);
      headGroup.rotation.set(0, 0.15, 0.1);
    } else if (pose === 'spin') {
      bodyMesh.rotation.y = time * 8;
      bodyMesh.position.y = 1.1 + Math.sin(time * 8) * 0.15;
      leftArmGroup.rotation.set(0, 0, 1.2);
      rightArmGroup.rotation.set(0, 0, -1.2);
    }
  };

  const destroy = () => {
    if (currentFurTex) currentFurTex.dispose();
    if (currentCapeTex) currentCapeTex.dispose();
    furMat.dispose();
    bellyMat.dispose();
    muzzleMat.dispose();
    noseMat.dispose();
    eyeMat.dispose();
    innerEarMat.dispose();
    pawMat.dispose();
    capeMat.dispose();
    auraMat.dispose();
  };

  if (initialDesign) {
    updateDesign(initialDesign);
  }

  return {
    root,
    bodyMesh,
    bellyMesh,
    headGroup,
    headMesh,
    muzzleMesh,
    noseMesh,
    leftEyeMesh,
    rightEyeMesh,
    leftEarGroup,
    rightEarGroup,
    leftArmGroup,
    rightArmGroup,
    leftLegGroup,
    rightLegGroup,
    capeGroup,
    capeMesh,
    auraGroup,
    materials: {
      fur: furMat,
      belly: bellyMat,
      muzzle: muzzleMat,
      nose: noseMat,
      eyes: eyeMat,
      innerEar: innerEarMat,
      paws: pawMat,
      cape: capeMat,
      aura: auraMat,
    },
    updateDesign,
    setAnimationPose,
    destroy,
  };
}
