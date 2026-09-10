import * as THREE from 'three';

/**
 * Creates 3D Mesh Group for Hat Slot items (50+ variations)
 */
export function buildHatMesh(itemId: string, itemColorHex = 0x3b82f6): THREE.Group {
  const group = new THREE.Group();
  group.name = `mesh_hat_${itemId}`;

  const mat = new THREE.MeshStandardMaterial({
    color: itemColorHex,
    roughness: 0.3,
    metalness: itemId.includes('gold') || itemId.includes('crown') || itemId.includes('knight') || itemId.includes('viking') ? 0.8 : 0.2
  });

  const glowMat = new THREE.MeshStandardMaterial({
    color: itemColorHex,
    emissive: itemColorHex,
    emissiveIntensity: 0.6,
    roughness: 0.2
  });

  if (itemId.includes('wizard') || itemId.includes('şapkası')) {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.48, 1.0, 16), mat);
    cone.position.y = 0.5;
    cone.rotation.z = -0.08;
    group.add(cone);

    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.78, 0.05, 24), mat);
    brim.position.y = 0.02;
    group.add(brim);

    const star = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshStandardMaterial({ color: 0xfde047, emissive: 0xf59e0b, emissiveIntensity: 0.8 }));
    star.position.set(0, 0.3, 0.4);
    group.add(star);
  } else if (itemId.includes('crown') || itemId.includes('tacı')) {
    const crownMat = new THREE.MeshStandardMaterial({ color: itemColorHex || 0xfcb316, metalness: 0.9, roughness: 0.15, emissive: itemColorHex || 0xd97706, emissiveIntensity: 0.3 });
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.48, 0.28, 16, 1, true), crownMat);
    ring.position.y = 0.14;
    group.add(ring);

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const x = Math.sin(angle) * 0.44;
      const z = Math.cos(angle) * 0.44;

      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.3, 8), crownMat);
      spike.position.set(x, 0.38, z);
      group.add(spike);

      const gemColor = i % 2 === 0 ? 0xef4444 : 0x38bdf8;
      const gem = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), new THREE.MeshStandardMaterial({ color: gemColor, emissive: gemColor, emissiveIntensity: 0.8 }));
      gem.position.set(x, 0.52, z);
      group.add(gem);
    }
  } else if (itemId.includes('cat_ears') || itemId.includes('bunny') || itemId.includes('hood') || itemId.includes('maskot')) {
    const earGeo = new THREE.ConeGeometry(itemId.includes('bunny') ? 0.15 : 0.24, itemId.includes('bunny') ? 0.7 : 0.45, 16);
    const innerColor = itemId.includes('bunny') ? 0xf472b6 : 0xffedd5;
    const innerMat = new THREE.MeshStandardMaterial({ color: innerColor, roughness: 0.4 });

    const earL = new THREE.Mesh(earGeo, mat);
    earL.position.set(-0.38, 0.28, 0);
    earL.rotation.z = -0.18;
    group.add(earL);

    const earR = new THREE.Mesh(earGeo, mat);
    earR.position.set(0.38, 0.28, 0);
    earR.rotation.z = 0.18;
    group.add(earR);

    const innerL = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.32, 12), innerMat);
    innerL.position.set(-0.38, 0.26, 0.05);
    innerL.rotation.z = -0.18;
    group.add(innerL);

    const innerR = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.32, 12), innerMat);
    innerR.position.set(0.38, 0.26, 0.05);
    innerR.rotation.z = 0.18;
    group.add(innerR);
  } else if (itemId.includes('viking') || itemId.includes('knight') || itemId.includes('samurai') || itemId.includes('helmet') || itemId.includes('miğferi')) {
    const helmMat = new THREE.MeshStandardMaterial({ color: itemColorHex, metalness: 0.85, roughness: 0.25 });
    const helm = new THREE.Mesh(new THREE.SphereGeometry(0.54, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.65), helmMat);
    helm.position.y = 0.12;
    group.add(helm);

    if (itemId.includes('viking') || itemId.includes('horns') || itemId.includes('boynuz')) {
      const hornMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
      const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.55, 12), hornMat);
      hornL.position.set(-0.52, 0.42, 0);
      hornL.rotation.z = -0.55;
      group.add(hornL);

      const hornR = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.55, 12), hornMat);
      hornR.position.set(0.52, 0.42, 0);
      hornR.rotation.z = 0.55;
      group.add(hornR);
    } else {
      // Plume crest / visor
      const crest = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.35, 0.6), new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.5 }));
      crest.position.set(0, 0.55, 0);
      group.add(crest);
    }
  } else if (itemId.includes('astronaut') || itemId.includes('mecha') || itemId.includes('visor')) {
    const glassMat = new THREE.MeshStandardMaterial({
      color: itemColorHex || 0x38bdf8,
      transparent: true,
      opacity: 0.75,
      metalness: 0.85,
      roughness: 0.1,
      emissive: itemColorHex || 0x0284c7,
      emissiveIntensity: 0.35
    });
    // Fitted snugly over the bear's head
    const visor = new THREE.Mesh(new THREE.SphereGeometry(0.52, 24, 24), glassMat);
    visor.position.set(0, 0.05, 0.02);
    group.add(visor);

    const collarRing = new THREE.Mesh(new THREE.TorusGeometry(0.53, 0.06, 8, 28), new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 }));
    collarRing.rotation.x = Math.PI / 2;
    collarRing.position.set(0, -0.35, 0.02);
    group.add(collarRing);

    const earCoverL = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.1, 14), new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7 }));
    earCoverL.rotation.z = Math.PI / 2;
    earCoverL.position.set(-0.48, 0.05, 0.02);
    group.add(earCoverL);

    const earCoverR = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.1, 14), new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7 }));
    earCoverR.rotation.z = Math.PI / 2;
    earCoverR.position.set(0.48, 0.05, 0.02);
    group.add(earCoverR);
  } else if (itemId.includes('cowboy') || itemId.includes('şerif')) {
    // Wild West Sheriff Cowboy Hat
    const feltMat = new THREE.MeshStandardMaterial({ color: itemColorHex || 0x78350f, roughness: 0.7 });
    const leatherBand = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.4 });
    const starGold = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9, roughness: 0.2 });

    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.82, 0.04, 24), feltMat);
    brim.scale.set(1.15, 1, 1.35);
    brim.rotation.x = 0.06;
    brim.position.set(0, 0.02, 0.02);
    group.add(brim);

    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.40, 0.46, 0.32, 18), feltMat);
    crown.position.set(0, 0.18, 0.02);
    group.add(crown);

    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.47, 0.47, 0.06, 18), leatherBand);
    band.position.set(0, 0.07, 0.02);
    group.add(band);

    const badge = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.1, 5), starGold);
    badge.rotation.x = Math.PI / 2;
    badge.position.set(0, 0.10, 0.49);
    group.add(badge);
  } else if (itemId.includes('pirate') || itemId.includes('korsan')) {
    // Pirate Captain Tricorn Hat
    const tricornMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.5 });
    const goldTrim = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.25 });

    const tricorn = new THREE.Mesh(new THREE.ConeGeometry(0.82, 0.32, 3), tricornMat);
    tricorn.rotation.x = Math.PI;
    tricorn.position.set(0, 0.16, 0.02);
    group.add(tricorn);

    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), new THREE.MeshStandardMaterial({ color: 0xf8fafc }));
    skull.position.set(0, 0.12, 0.42);
    group.add(skull);

    const trim = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.03, 6, 24), goldTrim);
    trim.rotation.x = Math.PI / 2;
    trim.position.set(0, 0.02, 0.02);
    group.add(trim);
  } else if (itemId.includes('chef') || itemId.includes('aşçı')) {
    // Master Chef Tall Toque
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.5 });

    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.47, 0.14, 20), redMat);
    band.position.set(0, 0.07, 0.02);
    group.add(band);

    const puff = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.46, 0.45, 20), whiteMat);
    puff.position.set(0, 0.34, 0.02);
    group.add(puff);

    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.58, 16, 12), whiteMat);
    dome.scale.set(1, 0.45, 1);
    dome.position.set(0, 0.55, 0.02);
    group.add(dome);
  } else if (itemId.includes('top_hat') || itemId.includes('silindir')) {
    // Gentleman Top Hat
    const silkMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.3 });
    const satinRibbon = new THREE.MeshStandardMaterial({ color: itemColorHex || 0xef4444, roughness: 0.4 });

    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.74, 0.74, 0.04, 24), silkMat);
    brim.position.set(0, 0.02, 0.02);
    group.add(brim);

    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.45, 0.65, 20), silkMat);
    tube.position.set(0, 0.34, 0.02);
    group.add(tube);

    const ribbon = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.1, 20), satinRibbon);
    ribbon.position.set(0, 0.08, 0.02);
    group.add(ribbon);
  } else if (itemId.includes('fedora') || itemId.includes('fötr')) {
    // Detective Fedora
    const feltMat = new THREE.MeshStandardMaterial({ color: itemColorHex || 0x52525b, roughness: 0.6 });
    const bandMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.3 });

    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.75, 0.04, 22), feltMat);
    brim.scale.set(1.08, 1, 1.25);
    brim.position.set(0, 0.02, 0.03);
    group.add(brim);

    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.47, 0.28, 20), feltMat);
    crown.position.set(0, 0.16, 0.02);
    group.add(crown);

    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.06, 20), bandMat);
    band.position.set(0, 0.06, 0.02);
    group.add(band);
  } else if (itemId.includes('cap') || itemId.includes('şapka') || itemId.includes('beanie')) {
    // Sport / Baseball / Beanie Cap
    const capMat = new THREE.MeshStandardMaterial({ color: itemColorHex || 0x2563eb, roughness: 0.4 });
    const visorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 });

    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.50, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.55), capMat);
    dome.position.set(0, 0.04, 0.02);
    group.add(dome);

    const peak = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.04, 0.42), visorMat);
    peak.position.set(0, 0.03, 0.48);
    peak.rotation.x = 0.12;
    group.add(peak);

    const topButton = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), visorMat);
    topButton.position.set(0, 0.35, 0.02);
    group.add(topButton);
  } else if (itemId.includes('sombrero')) {
    // Mexican Festive Sombrero
    const strawMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 });
    const colorfulMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.5 });

    const wideBrim = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 0.95, 0.06, 24), strawMat);
    wideBrim.position.set(0, 0.03, 0.02);
    group.add(wideBrim);

    const peak = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.55, 18), colorfulMat);
    peak.position.set(0, 0.32, 0.02);
    group.add(peak);
  } else if (itemId.includes('santa') || itemId.includes('noel')) {
    // Santa Christmas Hat
    const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });
    const furWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });

    const furTrim = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.08, 10, 24), furWhite);
    furTrim.rotation.x = Math.PI / 2;
    furTrim.position.set(0, 0.04, 0.02);
    group.add(furTrim);

    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.44, 0.75, 16), redMat);
    cone.position.set(0, 0.38, -0.05);
    cone.rotation.x = -0.35;
    group.add(cone);

    const pompom = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), furWhite);
    pompom.position.set(0, 0.65, -0.32);
    group.add(pompom);
  } else if (itemId.includes('halo')) {
    const haloMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xf59e0b, emissiveIntensity: 0.9 });
    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.06, 12, 32), haloMat);
    halo.rotation.x = Math.PI / 2;
    halo.position.y = 0.65;
    group.add(halo);
  } else if (itemId.includes('pumpkin')) {
    const pumpkinMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.5, emissive: 0xd97706, emissiveIntensity: 0.4 });
    const pumpkin = new THREE.Mesh(new THREE.SphereGeometry(0.56, 16, 14), pumpkinMat);
    pumpkin.scale.set(1.1, 0.95, 1.1);
    pumpkin.position.y = 0.18;
    group.add(pumpkin);

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.22, 8), new THREE.MeshStandardMaterial({ color: 0x15803d }));
    stem.position.y = 0.7;
    group.add(stem);
  } else {
    // Default styled hat (fedora / top hat / cap)
    const baseHat = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.5, 0.35, 20), mat);
    baseHat.position.y = 0.18;
    group.add(baseHat);

    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.05, 24), mat);
    brim.position.y = 0.03;
    group.add(brim);

    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.51, 0.51, 0.08, 20), glowMat);
    band.position.y = 0.12;
    group.add(band);
  }

  return group;
}

/**
 * Creates 3D Mesh Group for Face Slot items
 */
export function buildFaceMesh(itemId: string, itemColorHex = 0x0f172a): THREE.Group {
  const group = new THREE.Group();
  group.name = `mesh_face_${itemId}`;

  const frameMat = new THREE.MeshStandardMaterial({ color: itemColorHex, roughness: 0.2, metalness: 0.8 });
  const lensMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.1, transparent: true, opacity: 0.85 });

  if (itemId.includes('pixel_thug')) {
    const pixelMat = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.1 });
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.22, 0.06), pixelMat);
    group.add(bar);
  } else if (itemId.includes('vr') || itemId.includes('scouter') || itemId.includes('visor') || itemId.includes('vizörü')) {
    const visMat = new THREE.MeshStandardMaterial({ color: itemColorHex || 0x06b6d4, emissive: itemColorHex || 0x0284c7, emissiveIntensity: 0.8 });
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.3, 0.16), visMat);
    group.add(visor);
  } else if (itemId.includes('heart')) {
    const pinkMat = new THREE.MeshStandardMaterial({ color: 0xec4899, emissive: 0xdb2777, emissiveIntensity: 0.5 });
    const heartL = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.34, 0.06), pinkMat);
    heartL.position.set(-0.25, 0, 0);
    heartL.rotation.z = Math.PI / 4;
    group.add(heartL);

    const heartR = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.34, 0.06), pinkMat);
    heartR.position.set(0.25, 0, 0);
    heartR.rotation.z = Math.PI / 4;
    group.add(heartR);
  } else if (itemId.includes('monocle') || itemId.includes('dürbünü')) {
    const goldMat = new THREE.MeshStandardMaterial({ color: itemColorHex || 0xf59e0b, metalness: 0.9, roughness: 0.1 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.03, 12, 20), goldMat);
    ring.position.set(0.25, 0, 0);
    group.add(ring);
  } else if (itemId.includes('goggles') || itemId.includes('swimming') || itemId.includes('şnorkel')) {
    // 3D Diving Goggles with Snorkel
    const goggleFrame = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.32, 0.12), new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.3 }));
    group.add(goggleFrame);

    const goggleLenses = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.24, 0.14), new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7, roughness: 0.1 }));
    group.add(goggleLenses);

    // Snorkel tube
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
    const snorkelTube = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.7, 12), tubeMat);
    snorkelTube.position.set(0.48, 0.18, 0.05);
    snorkelTube.rotation.z = -0.15;
    group.add(snorkelTube);

    const snorkelTip = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
    snorkelTip.position.set(0.54, 0.52, 0.05);
    group.add(snorkelTip);
  } else if (itemId.includes('ninja')) {
    // Ninja Stealth Face Wrap
    const ninjaMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 });
    const wrap = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.45, 0.2), ninjaMat);
    wrap.position.set(0, -0.14, 0.05);
    group.add(wrap);
  } else if (itemId.includes('mask') || itemId.includes('oni') || itemId.includes('maskesi')) {
    const maskMat = new THREE.MeshStandardMaterial({ color: itemColorHex, roughness: 0.3, metalness: 0.4 });
    const mask = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.4, 0.15), maskMat);
    mask.position.set(0, -0.15, 0.1);
    group.add(mask);
  } else if (itemId.includes('mustache') || itemId.includes('bıyığı')) {
    const stacheMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.8 });
    const stacheL = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.38, 8), stacheMat);
    stacheL.position.set(-0.16, -0.22, 0.1);
    stacheL.rotation.z = Math.PI / 2.5;
    group.add(stacheL);

    const stacheR = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.38, 8), stacheMat);
    stacheR.position.set(0.16, -0.22, 0.1);
    stacheR.rotation.z = -Math.PI / 2.5;
    group.add(stacheR);
  } else {
    // Standard sunglasses
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.08, 0.08), frameMat);
    group.add(bar);

    const lensL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.26, 0.05), lensMat);
    lensL.position.set(-0.25, -0.08, 0);
    group.add(lensL);

    const lensR = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.26, 0.05), lensMat);
    lensR.position.set(0.25, -0.08, 0);
    group.add(lensR);
  }

  return group;
}

/**
 * Creates 3D Mesh Group for Back Slot items (Wings, Capes, Jetpacks, Shields)
 */
export function buildBackMesh(itemId: string, itemColorHex = 0xf59e0b): THREE.Group {
  const group = new THREE.Group();
  group.name = `mesh_back_${itemId}`;

  const mainMat = new THREE.MeshStandardMaterial({ color: itemColorHex, roughness: 0.4, side: THREE.DoubleSide });

  if (itemId.includes('wings') || itemId.includes('kanatları') || itemId.includes('kanat')) {
    const wingMat = new THREE.MeshStandardMaterial({
      color: itemColorHex || 0xf8fafc,
      roughness: 0.3,
      emissive: itemColorHex || 0x000000,
      emissiveIntensity: 0.6,
      side: THREE.DoubleSide
    });

    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.quadraticCurveTo(0.7, 0.9, 1.4, 0.7);
    wingShape.quadraticCurveTo(1.1, 0.2, 0.8, -0.5);
    wingShape.quadraticCurveTo(0.4, -0.3, 0, 0);

    const wingGeo = new THREE.ShapeGeometry(wingShape);

    const wingL = new THREE.Mesh(wingGeo, wingMat);
    wingL.position.set(-0.15, 0, 0);
    wingL.rotation.y = -Math.PI / 5;
    group.add(wingL);

    const wingR = new THREE.Mesh(wingGeo, wingMat);
    wingR.scale.set(-1, 1, 1);
    wingR.position.set(0.15, 0, 0);
    wingR.rotation.y = Math.PI / 5;
    group.add(wingR);
  } else if (itemId.includes('jetpack') || itemId.includes('rocket') || itemId.includes('iticisi')) {
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.85, roughness: 0.2 });
    const fireMat = new THREE.MeshStandardMaterial({ color: itemColorHex || 0xf97316, emissive: itemColorHex || 0xef4444, emissiveIntensity: 0.9 });

    const tankL = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.75, 14), metalMat);
    tankL.position.set(-0.28, 0, 0);
    group.add(tankL);

    const tankR = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.75, 14), metalMat);
    tankR.position.set(0.28, 0, 0);
    group.add(tankR);

    const flameL = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.45, 10), fireMat);
    flameL.position.set(-0.28, -0.55, 0);
    flameL.rotation.x = Math.PI;
    group.add(flameL);

    const flameR = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.45, 10), fireMat);
    flameR.position.set(0.28, -0.55, 0);
    flameR.rotation.x = Math.PI;
    group.add(flameR);
  } else if (itemId.includes('shield') || itemId.includes('kalkanı')) {
    const shieldMat = new THREE.MeshStandardMaterial({ color: itemColorHex || 0xeab308, metalness: 0.85, roughness: 0.2 });
    const shield = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.08, 20), shieldMat);
    shield.rotation.x = Math.PI / 2;
    group.add(shield);
  } else if (itemId.includes('backpack') || itemId.includes('çanta')) {
    // Explorer / Carrot Backpack
    const bagMat = new THREE.MeshStandardMaterial({ color: itemColorHex || 0xf97316, roughness: 0.6 });
    const bag = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.75, 0.35), bagMat);
    bag.position.set(0, -0.15, 0);
    group.add(bag);

    // Cute Carrot peaking out
    const carrotCone = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.35, 10), new THREE.MeshStandardMaterial({ color: 0xf97316 }));
    carrotCone.position.set(0.12, 0.25, 0.05);
    carrotCone.rotation.z = 0.2;
    group.add(carrotCone);

    const carrotGreens = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.15, 8), new THREE.MeshStandardMaterial({ color: 0x22c55e }));
    carrotGreens.position.set(0.15, 0.42, 0.05);
    group.add(carrotGreens);
  } else {
    // Flowing Cape - High-waist hero cape that never touches the ground
    const capeGeo = new THREE.PlaneGeometry(0.72, 0.62, 6, 8);
    const cape = new THREE.Mesh(capeGeo, mainMat);
    cape.position.set(0, -0.22, 0);
    cape.rotation.x = 0.16;
    group.add(cape);
  }

  return group;
}

/**
 * Creates 3D Mesh Group for Hand Slot items (Weapons, Wands, Gloves, Tools, Blasters)
 */
export function buildHandMesh(itemId: string, itemColorHex = 0x38bdf8): THREE.Group {
  const group = new THREE.Group();
  group.name = `mesh_hand_${itemId}`;

  if (itemId.includes('lightsaber') || itemId.includes('katana') || itemId.includes('sword') || itemId.includes('kılıcı') || itemId.includes('excalibur')) {
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.2 });
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.35, 14), handleMat);
    handle.position.y = 0.18;
    group.add(handle);

    const guard = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.04, 0.1), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9 }));
    guard.position.y = 0.35;
    group.add(guard);

    const isLight = itemId.includes('lightsaber') || itemId.includes('lazer');
    const bladeMat = new THREE.MeshStandardMaterial({
      color: itemColorHex,
      emissive: isLight ? itemColorHex : 0x000000,
      emissiveIntensity: isLight ? 0.9 : 0,
      metalness: 0.8,
      roughness: 0.2
    });

    const blade = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.0, 14), bladeMat);
    blade.position.y = 0.85;
    group.add(blade);
  } else if (itemId.includes('wand') || itemId.includes('staff') || itemId.includes('asası') || itemId.includes('değneği')) {
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.1, 14), woodMat);
    shaft.position.y = 0.55;
    group.add(shaft);

    const orbMat = new THREE.MeshStandardMaterial({ color: itemColorHex, emissive: itemColorHex, emissiveIntensity: 0.9 });
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.18, 14, 14), orbMat);
    orb.position.y = 1.15;
    group.add(orb);
  } else if (itemId.includes('hammer') || itemId.includes('balyozu') || itemId.includes('mjolnir') || itemId.includes('çekici')) {
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.0, 12), new THREE.MeshStandardMaterial({ color: 0x57534e, metalness: 0.6 }));
    shaft.position.y = 0.5;
    group.add(shaft);

    const headMat = new THREE.MeshStandardMaterial({ color: itemColorHex || 0x64748b, metalness: 0.85, roughness: 0.2 });
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.35, 0.35), headMat);
    head.position.y = 0.95;
    group.add(head);
  } else if (itemId.includes('axe') || itemId.includes('baltası')) {
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.95, 10), new THREE.MeshStandardMaterial({ color: 0x78350f }));
    shaft.position.y = 0.48;
    group.add(shaft);

    const bladeMat = new THREE.MeshStandardMaterial({ color: itemColorHex || 0x94a3b8, metalness: 0.9, roughness: 0.2 });
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.35, 0.05), bladeMat);
    blade.position.set(0.18, 0.8, 0);
    group.add(blade);
  } else if (itemId.includes('boxing')) {
    const gloveMat = new THREE.MeshStandardMaterial({ color: itemColorHex || 0xdc2626, roughness: 0.3 });
    const glove = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), gloveMat);
    glove.scale.set(1.0, 1.25, 1.0);
    glove.position.y = 0.22;
    group.add(glove);
  } else if (itemId.includes('carrot') || itemId.includes('havuç')) {
    // Giant Gold/Orange Champion Carrot
    const carrotMat = new THREE.MeshStandardMaterial({ color: itemColorHex || 0xf97316, roughness: 0.3, emissive: 0xea580c, emissiveIntensity: 0.3 });
    const carrotBody = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.85, 14), carrotMat);
    carrotBody.position.y = 0.45;
    carrotBody.rotation.x = Math.PI;
    group.add(carrotBody);

    const greenMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.4 });
    for (let i = 0; i < 3; i++) {
      const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.3, 8), greenMat);
      leaf.position.set(Math.sin(i * 2.1) * 0.08, 0.95, Math.cos(i * 2.1) * 0.08);
      leaf.rotation.z = Math.sin(i * 2.1) * 0.3;
      group.add(leaf);
    }
  } else {
    // Generic stylish handheld tool
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 10), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
    handle.position.y = 0.4;
    group.add(handle);

    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), new THREE.MeshStandardMaterial({ color: itemColorHex, emissive: itemColorHex, emissiveIntensity: 0.6 }));
    tip.position.y = 0.82;
    group.add(tip);
  }

  return group;
}

/**
 * Creates 3D Mesh Group for Aura Slot items
 */
export function buildAuraMesh(itemId: string, itemColorHex = 0xf59e0b): THREE.Group {
  const group = new THREE.Group();
  group.name = `mesh_aura_${itemId}`;

  const ringMat = new THREE.MeshStandardMaterial({
    color: itemColorHex,
    emissive: itemColorHex,
    emissiveIntensity: 0.9,
    transparent: true,
    opacity: 0.75,
    side: THREE.DoubleSide
  });

  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.04, 8, 32), ringMat);
  ring1.rotation.x = Math.PI / 2;
  group.add(ring1);

  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.03, 8, 32), ringMat);
  ring2.rotation.x = Math.PI / 2.5;
  ring2.position.y = 0.4;
  group.add(ring2);

  return group;
}

/**
 * Creates 3D Mesh Group for Body / Outfit Slot items (Skins, Costumes & Armors)
 * Fitted to wrap perfectly around the bear's torso & belly.
 */
export function buildBodyOutfitMesh(itemId: string, itemColorHex = 0x3b82f6): THREE.Group {
  const group = new THREE.Group();
  group.name = `mesh_outfit_${itemId}`;

  if (itemId.includes('astronaut') || itemId.includes('astronot') || itemId.includes('space')) {
    // NASA / Space Explorer Suit
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.35, metalness: 0.1 });
    const techMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.7, roughness: 0.2 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.15 });

    // Torso suit shell
    const torsoSuit = new THREE.Mesh(new THREE.SphereGeometry(0.74, 20, 20), whiteMat);
    torsoSuit.scale.set(1.02, 1.16, 0.98);
    group.add(torsoSuit);

    // Life support chest module
    const chestPack = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.45, 0.18), techMat);
    chestPack.position.set(0, 0.05, 0.48);
    group.add(chestPack);

    // Mission patch badge
    const badge = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.03, 16), goldMat);
    badge.rotation.x = Math.PI / 2;
    badge.position.set(-0.16, 0.16, 0.58);
    group.add(badge);

    // Status lights
    const lightG = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), new THREE.MeshBasicMaterial({ color: 0x22c55e }));
    lightG.position.set(0.14, 0.16, 0.58);
    group.add(lightG);
    const lightB = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    lightB.position.set(0.14, 0.06, 0.58);
    group.add(lightB);

    // Shoulder rings
    [-0.56, 0.56].forEach(sx => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.05, 8, 16), techMat);
      ring.position.set(sx, 0.22, 0);
      ring.rotation.y = Math.PI / 2;
      group.add(ring);
    });
  } else if (itemId.includes('knight') || itemId.includes('şövalye') || itemId.includes('bronze') || itemId.includes('armor')) {
    // Knight Breastplate & Pauldrons
    const armorColor = itemId.includes('gold') ? 0xf59e0b : itemId.includes('bronze') ? 0xb45309 : 0x64748b;
    const plateMat = new THREE.MeshStandardMaterial({ color: armorColor, metalness: 0.85, roughness: 0.25 });
    const trimMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9, roughness: 0.15 });

    // Cuirass
    const cuirass = new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.74, 0.85, 18), plateMat);
    cuirass.position.set(0, 0.02, 0);
    group.add(cuirass);

    // Center chest crest
    const crest = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.42, 0.12), trimMat);
    crest.position.set(0, 0.12, 0.46);
    group.add(crest);

    // Shoulder Pauldrons
    [-0.65, 0.65].forEach((px, idx) => {
      const pauldron = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), plateMat);
      pauldron.rotation.z = idx === 0 ? 0.35 : -0.35;
      pauldron.position.set(px, 0.32, 0);
      group.add(pauldron);
    });
  } else if (itemId.includes('doctor') || itemId.includes('doktor')) {
    // White Doctor Lab Coat & Stethoscope
    const coatMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.5 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 });

    // Coat shell
    const coat = new THREE.Mesh(new THREE.SphereGeometry(0.74, 20, 20), coatMat);
    coat.scale.set(1.02, 1.18, 0.98);
    group.add(coat);

    // Inner blue shirt collar
    const innerShirt = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.35, 3), blueMat);
    innerShirt.position.set(0, 0.28, 0.46);
    group.add(innerShirt);

    // Stethoscope around neck
    const stethTubing = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.03, 8, 20, Math.PI), metalMat);
    stethTubing.position.set(0, 0.28, 0.35);
    stethTubing.rotation.x = 0.4;
    group.add(stethTubing);

    const chestPiece = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.03, 14), metalMat);
    chestPiece.rotation.x = Math.PI / 2;
    chestPiece.position.set(0.12, 0.02, 0.5);
    group.add(chestPiece);
  } else if (itemId.includes('detective') || itemId.includes('dedektif')) {
    // Trenchcoat with Double-Breasted Buttons and Tie
    const trenchMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 });
    const tieMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.4 });
    const buttonMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.3 });

    const coat = new THREE.Mesh(new THREE.SphereGeometry(0.74, 20, 20), trenchMat);
    coat.scale.set(1.02, 1.18, 0.98);
    group.add(coat);

    // Necktie
    const tie = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.38, 0.04), tieMat);
    tie.position.set(0, 0.16, 0.48);
    group.add(tie);

    // Double-breasted buttons
    [-0.14, 0.14].forEach(bx => {
      [0.05, -0.12, -0.28].forEach(by => {
        const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.02, 10), buttonMat);
        btn.rotation.x = Math.PI / 2;
        btn.position.set(bx, by, 0.48);
        group.add(btn);
      });
    });
  } else if (itemId.includes('chef') || itemId.includes('aşçı')) {
    // Chef Double-Breasted Jacket with Red Neckerchief
    const jacketMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
    const scarfMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });
    const btnMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });

    const jacket = new THREE.Mesh(new THREE.SphereGeometry(0.74, 20, 20), jacketMat);
    jacket.scale.set(1.02, 1.18, 0.98);
    group.add(jacket);

    // Red Scarf
    const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.06, 8, 18), scarfMat);
    scarf.rotation.x = Math.PI / 2.3;
    scarf.position.set(0, 0.35, 0.3);
    group.add(scarf);

    // Buttons
    [-0.12, 0.12].forEach(bx => {
      [0.15, 0.0, -0.15].forEach(by => {
        const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.02, 10), btnMat);
        btn.rotation.x = Math.PI / 2;
        btn.position.set(bx, by, 0.48);
        group.add(btn);
      });
    });
  } else if (itemId.includes('pirate') || itemId.includes('korsan')) {
    // Pirate Captain Coat with Gold Trim and Crimson Sash
    const coatMat = new THREE.MeshStandardMaterial({ color: 0x450a0a, roughness: 0.5 });
    const sashMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85, roughness: 0.2 });

    const coat = new THREE.Mesh(new THREE.SphereGeometry(0.74, 20, 20), coatMat);
    coat.scale.set(1.02, 1.18, 0.98);
    group.add(coat);

    // Waist Sash
    const sash = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.08, 8, 24), sashMat);
    sash.rotation.x = Math.PI / 2;
    sash.position.set(0, -0.22, 0);
    group.add(sash);

    // Golden Buckle
    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.06), goldMat);
    buckle.position.set(0, -0.22, 0.5);
    group.add(buckle);
  } else if (itemId.includes('cyber') || itemId.includes('ninja')) {
    // Futuristic Cyber Suit with Glowing Circuitry
    const cyberSuitMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.25, metalness: 0.8 });
    const neonMat = new THREE.MeshStandardMaterial({ color: itemColorHex || 0x06b6d4, emissive: itemColorHex || 0x06b6d4, emissiveIntensity: 0.9 });

    const suit = new THREE.Mesh(new THREE.SphereGeometry(0.74, 20, 20), cyberSuitMat);
    suit.scale.set(1.02, 1.18, 0.98);
    group.add(suit);

    // Glowing Neon Core
    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.04, 16), neonMat);
    core.rotation.x = Math.PI / 2;
    core.position.set(0, 0.12, 0.48);
    group.add(core);

    // Neon stripes
    [-0.25, 0.25].forEach(sx => {
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.45, 0.04), neonMat);
      stripe.position.set(sx, -0.05, 0.46);
      group.add(stripe);
    });
  } else {
    // Default Adventurer Tunic & Belt
    const tunicMat = new THREE.MeshStandardMaterial({ color: itemColorHex || 0x1d4ed8, roughness: 0.5 });
    const beltMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.4 });
    const buckleMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85, roughness: 0.2 });

    const tunic = new THREE.Mesh(new THREE.SphereGeometry(0.73, 20, 20), tunicMat);
    tunic.scale.set(1.01, 1.16, 0.97);
    group.add(tunic);

    const belt = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.06, 8, 24), beltMat);
    belt.rotation.x = Math.PI / 2;
    belt.position.set(0, -0.2, 0);
    group.add(belt);

    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.05), buckleMat);
    buckle.position.set(0, -0.2, 0.48);
    group.add(buckle);
  }

  return group;
}

