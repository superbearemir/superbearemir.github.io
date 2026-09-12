import * as THREE from 'three';

/**
 * Creates 3D Mesh Group for Hat / Helmet Slot items
 * Mathematically fitted to Grizzy's head dimensions:
 * Head: SphereGeometry(0.46) at (0, 0, 0), Muzzle at (0, -0.08, 0.38)
 */
export function buildHatMesh(itemId: string, itemColorHex = 0x3b82f6): THREE.Group {
  const group = new THREE.Group();
  group.name = `mesh_hat_${itemId}`;

  const mat = new THREE.MeshStandardMaterial({
    color: itemColorHex,
    roughness: 0.3,
    metalness: itemId.includes('gold') || itemId.includes('crown') || itemId.includes('knight') || itemId.includes('viking') ? 0.85 : 0.2
  });

  const glowMat = new THREE.MeshStandardMaterial({
    color: itemColorHex,
    emissive: itemColorHex,
    emissiveIntensity: 0.6,
    roughness: 0.2
  });

  if (itemId.includes('astronaut') || itemId.includes('astronot') || itemId.includes('mecha') || itemId.includes('visor') || itemId.includes('kask')) {
    // --- FULL SPACE ASTRONAUT HELMET / KASK (Crystal Clear Visor) ---
    // Mathematically fitted around bear head (0.46) - head and face 100% visible inside!
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xbae6fd,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
      roughness: 0.05,
      metalness: 0.1,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.1,
      side: THREE.DoubleSide
    });

    const techGoldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.15
    });

    // Front golden visor frame / face portal ring
    const facePortalRing = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.035, 8, 24), techGoldMat);
    facePortalRing.position.set(0, 0.03, 0.22);
    group.add(facePortalRing);

    // Crystal clear glass bubble visor (Grizzy's face, head, muzzle, ears and eyes are 100% visible inside!)
    const frontVisor = new THREE.Mesh(new THREE.SphereGeometry(0.53, 24, 24), glassMat);
    frontVisor.renderOrder = 10;
    frontVisor.scale.set(1.05, 1.07, 1.16);
    frontVisor.position.set(0, 0.03, 0.03);
    group.add(frontVisor);

    // Collar airtight seal ring at neck
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.045, 8, 24), new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 }));
    collar.rotation.x = Math.PI / 2;
    collar.position.set(0, -0.32, 0.02);
    group.add(collar);

    // Side communication earpieces
    [-0.50, 0.50].forEach((sx) => {
      const earpiece = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.06, 16), techGoldMat);
      earpiece.rotation.z = Math.PI / 2;
      earpiece.position.set(sx, 0.05, 0.02);
      group.add(earpiece);
    });

    // Small comms antenna
    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.32, 8), techGoldMat);
    antenna.position.set(-0.50, 0.24, 0);
    antenna.rotation.z = 0.2;
    group.add(antenna);

  } else if (itemId.includes('wizard') || itemId.includes('büyücü') || itemId.includes('şapkası')) {
    // Wizard Conical Hat - Sits atop head (y = 0.44)
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.95, 16), mat);
    cone.position.set(0, 0.90, 0);
    cone.rotation.z = -0.08;
    group.add(cone);

    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.04, 24), mat);
    brim.position.set(0, 0.44, 0.02);
    group.add(brim);

    const star = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshStandardMaterial({ color: 0xfde047, emissive: 0xf59e0b, emissiveIntensity: 0.8 }));
    star.position.set(0, 0.72, 0.32);
    group.add(star);

  } else if (itemId.includes('crown') || itemId.includes('tacı') || itemId.includes('kral')) {
    // Imperial Golden Crown - Sits atop head
    const crownMat = new THREE.MeshStandardMaterial({ color: itemColorHex || 0xfcb316, metalness: 0.9, roughness: 0.15, emissive: 0xd97706, emissiveIntensity: 0.3 });
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.45, 0.22, 16, 1, true), crownMat);
    ring.position.set(0, 0.54, 0);
    group.add(ring);

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const x = Math.sin(angle) * 0.42;
      const z = Math.cos(angle) * 0.42;

      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.26, 8), crownMat);
      spike.position.set(x, 0.74, z);
      group.add(spike);

      const gemColor = i % 2 === 0 ? 0xef4444 : 0x38bdf8;
      const gem = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), new THREE.MeshStandardMaterial({ color: gemColor, emissive: gemColor, emissiveIntensity: 0.8 }));
      gem.position.set(x, 0.86, z);
      group.add(gem);
    }

  } else if (itemId.includes('cat_ears') || itemId.includes('bunny') || itemId.includes('kedi') || itemId.includes('tavşan')) {
    // Bunny / Cat Ears Headband
    const isBunny = itemId.includes('bunny') || itemId.includes('tavşan');
    const earGeo = new THREE.ConeGeometry(isBunny ? 0.12 : 0.20, isBunny ? 0.65 : 0.38, 16);
    const innerColor = isBunny ? 0xf472b6 : 0xffedd5;
    const innerMat = new THREE.MeshStandardMaterial({ color: innerColor, roughness: 0.4 });

    const band = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.03, 8, 20, Math.PI), new THREE.MeshStandardMaterial({ color: 0x1f2937 }));
    band.position.set(0, 0.44, 0);
    band.rotation.x = Math.PI / 2;
    group.add(band);

    const earL = new THREE.Mesh(earGeo, mat);
    earL.position.set(-0.32, 0.65, 0);
    earL.rotation.z = -0.16;
    group.add(earL);

    const earR = new THREE.Mesh(earGeo, mat);
    earR.position.set(0.32, 0.65, 0);
    earR.rotation.z = 0.16;
    group.add(earR);

    const innerL = new THREE.Mesh(new THREE.ConeGeometry(0.09, isBunny ? 0.48 : 0.26, 12), innerMat);
    innerL.position.set(-0.32, 0.63, 0.04);
    innerL.rotation.z = -0.16;
    group.add(innerL);

    const innerR = new THREE.Mesh(new THREE.ConeGeometry(0.09, isBunny ? 0.48 : 0.26, 12), innerMat);
    innerR.position.set(0.32, 0.63, 0.04);
    innerR.rotation.z = 0.16;
    group.add(innerR);

  } else if (itemId.includes('viking') || itemId.includes('knight') || itemId.includes('samurai') || itemId.includes('helmet') || itemId.includes('miğfer')) {
    // Knight / Viking Combat Helmet - Fits over head
    const helmMat = new THREE.MeshStandardMaterial({ color: itemColorHex || 0x64748b, metalness: 0.85, roughness: 0.25 });
    const helm = new THREE.Mesh(new THREE.SphereGeometry(0.50, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.68), helmMat);
    helm.scale.set(1.04, 1.06, 1.10);
    helm.position.set(0, 0.05, 0.02);
    group.add(helm);

    if (itemId.includes('viking') || itemId.includes('horn') || itemId.includes('boynuz')) {
      const hornMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
      const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.50, 12), hornMat);
      hornL.position.set(-0.46, 0.38, 0);
      hornL.rotation.z = -0.55;
      group.add(hornL);

      const hornR = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.50, 12), hornMat);
      hornR.position.set(0.46, 0.38, 0);
      hornR.rotation.z = 0.55;
      group.add(hornR);
    } else {
      // Crest plume
      const crest = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.30, 0.55), new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.5 }));
      crest.position.set(0, 0.52, 0);
      group.add(crest);
    }

  } else if (itemId.includes('cowboy') || itemId.includes('şerif') || itemId.includes('kovboy')) {
    // Sheriff Cowboy Hat
    const feltMat = new THREE.MeshStandardMaterial({ color: itemColorHex || 0x78350f, roughness: 0.7 });
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.76, 0.04, 24), feltMat);
    brim.scale.set(1.12, 1, 1.30);
    brim.position.set(0, 0.44, 0.02);
    group.add(brim);

    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.42, 0.30, 18), feltMat);
    crown.position.set(0, 0.58, 0.02);
    group.add(crown);

    const starGold = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9 });
    const badge = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.08, 5), starGold);
    badge.rotation.x = Math.PI / 2;
    badge.position.set(0, 0.54, 0.42);
    group.add(badge);

  } else if (itemId.includes('chef') || itemId.includes('aşçı')) {
    // White Chef Toque Hat
    const chefMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.14, 20), chefMat);
    band.position.set(0, 0.48, 0.02);
    group.add(band);

    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.48, 16, 16), chefMat);
    puff.scale.set(1.15, 0.95, 1.15);
    puff.position.set(0, 0.72, 0.02);
    group.add(puff);

  } else if (itemId.includes('halo') || itemId.includes('hale')) {
    // Glowing Angelic Halo
    const haloMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xf59e0b, emissiveIntensity: 0.9 });
    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.05, 12, 32), haloMat);
    halo.rotation.x = Math.PI / 2;
    halo.position.set(0, 0.75, 0);
    group.add(halo);

  } else if (itemId.includes('pumpkin') || itemId.includes('balkabağı')) {
    // Halloween Pumpkin Headpiece
    const pumpkinMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.5, emissive: 0xd97706, emissiveIntensity: 0.4 });
    const pumpkin = new THREE.Mesh(new THREE.SphereGeometry(0.52, 16, 14), pumpkinMat);
    pumpkin.scale.set(1.06, 1.02, 1.12);
    pumpkin.position.set(0, 0.08, 0.02);
    group.add(pumpkin);

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.20, 8), new THREE.MeshStandardMaterial({ color: 0x15803d }));
    stem.position.set(0, 0.66, 0);
    group.add(stem);

  } else {
    // Default Fedora / Cap / Hat
    const baseHat = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.44, 0.28, 20), mat);
    baseHat.position.set(0, 0.56, 0.02);
    group.add(baseHat);

    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.66, 0.04, 24), mat);
    brim.position.set(0, 0.44, 0.02);
    group.add(brim);

    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.07, 20), glowMat);
    band.position.set(0, 0.51, 0.02);
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

  if (itemId.includes('pixel_thug') || itemId.includes('sunglasses') || itemId.includes('gözlük')) {
    const pixelMat = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.1 });
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.20, 0.05), pixelMat);
    group.add(bar);
  } else if (itemId.includes('vr') || itemId.includes('scouter') || itemId.includes('visor') || itemId.includes('vizör')) {
    const visMat = new THREE.MeshStandardMaterial({ color: itemColorHex || 0x06b6d4, emissive: itemColorHex || 0x0284c7, emissiveIntensity: 0.8 });
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.26, 0.12), visMat);
    group.add(visor);
  } else if (itemId.includes('heart')) {
    const pinkMat = new THREE.MeshStandardMaterial({ color: 0xec4899, emissive: 0xdb2777, emissiveIntensity: 0.5 });
    [-0.22, 0.22].forEach(hx => {
      const heart = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.30, 0.05), pinkMat);
      heart.position.set(hx, 0, 0);
      heart.rotation.z = Math.PI / 4;
      group.add(heart);
    });
  } else if (itemId.includes('goggles') || itemId.includes('şnorkel')) {
    const goggleFrame = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.28, 0.10), new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.3 }));
    group.add(goggleFrame);
    const goggleLenses = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.22, 0.12), new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7 }));
    group.add(goggleLenses);
  } else {
    const frameMat = new THREE.MeshStandardMaterial({ color: itemColorHex, roughness: 0.2, metalness: 0.8 });
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.20, 0.06), frameMat);
    group.add(bar);
  }

  return group;
}

/**
 * Creates 3D Mesh Group for Hand Slot items (Weapons, Staffs, Shields)
 */
export function buildHandMesh(itemId: string, itemColorHex = 0x3b82f6): THREE.Group {
  const group = new THREE.Group();
  group.name = `mesh_hand_${itemId}`;

  if (itemId.includes('sword') || itemId.includes('kılıç') || itemId.includes('katana') || itemId.includes('lightsaber')) {
    const hilt = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.35, 10), new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.8 }));
    hilt.position.y = 0.15;
    group.add(hilt);

    const guard = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.04, 0.08), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9 }));
    guard.position.y = 0.32;
    group.add(guard);

    const bladeMat = new THREE.MeshStandardMaterial({
      color: itemColorHex || 0x38bdf8,
      metalness: 0.9,
      roughness: 0.15,
      emissive: itemColorHex || 0x0284c7,
      emissiveIntensity: itemId.includes('lightsaber') ? 0.9 : 0.2
    });
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.95, 0.02), bladeMat);
    blade.position.y = 0.82;
    group.add(blade);
  } else if (itemId.includes('staff') || itemId.includes('asa') || itemId.includes('wand')) {
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.2, 12), new THREE.MeshStandardMaterial({ color: 0x78350f }));
    shaft.position.y = 0.6;
    group.add(shaft);

    const orbMat = new THREE.MeshStandardMaterial({ color: itemColorHex, emissive: itemColorHex, emissiveIntensity: 0.9 });
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 14), orbMat);
    orb.position.y = 1.25;
    group.add(orb);
  } else if (itemId.includes('shield') || itemId.includes('kalkan')) {
    const shieldMat = new THREE.MeshStandardMaterial({ color: itemColorHex || 0x3b82f6, metalness: 0.8, roughness: 0.2 });
    const shield = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.06, 18), shieldMat);
    shield.rotation.x = Math.PI / 2;
    shield.position.set(0, 0.2, 0.1);
    group.add(shield);
  } else {
    const tool = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 10), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
    tool.position.y = 0.4;
    group.add(tool);
  }

  return group;
}

/**
 * Creates 3D Mesh Group for Back Slot items (Capes, Wings, Jetpacks)
 */
export function buildBackMesh(itemId: string, itemColorHex = 0xf59e0b): THREE.Group {
  const group = new THREE.Group();
  group.name = `mesh_back_${itemId}`;

  if (itemId.includes('wings') || itemId.includes('kanat')) {
    const wingMat = new THREE.MeshStandardMaterial({ color: itemColorHex, emissive: itemColorHex, emissiveIntensity: 0.4, side: THREE.DoubleSide });
    [-0.45, 0.45].forEach((wx, idx) => {
      const wing = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.95, 3), wingMat);
      wing.rotation.z = idx === 0 ? -1.1 : 1.1;
      wing.position.set(wx, 0.25, 0);
      group.add(wing);
    });
  } else if (itemId.includes('jetpack') || itemId.includes('roket')) {
    const rocketMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 });
    [-0.20, 0.20].forEach(rx => {
      const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.65, 14), rocketMat);
      tank.position.set(rx, 0, 0);
      group.add(tank);
      const nozzle = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.18, 12), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
      nozzle.position.set(rx, -0.38, 0);
      group.add(nozzle);
    });
  } else {
    // Classic Hero Cape
    const capeMat = new THREE.MeshStandardMaterial({ color: itemColorHex, side: THREE.DoubleSide, roughness: 0.5 });
    const cape = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 1.1), capeMat);
    cape.position.set(0, -0.28, -0.05);
    cape.rotation.x = 0.15;
    group.add(cape);
  }

  return group;
}

/**
 * Creates 3D Mesh Group for Body / Outfit Slot items (Skins, Costumes & Armors)
 * Tailored to match Bear Torso: SphereGeometry(0.55) scale(1, 1.15, 0.9)
 */
export function buildBodyOutfitMesh(itemId: string, itemColorHex = 0x3b82f6): THREE.Group {
  const group = new THREE.Group();
  group.name = `mesh_outfit_${itemId}`;

  if (itemId.includes('astronaut') || itemId.includes('astronot') || itemId.includes('space') || itemId.includes('uzay')) {
    // --- NASA SPACE EXPLORER SUIT ---
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35, metalness: 0.15 });
    const techMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.7, roughness: 0.2 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.15 });

    // Torso suit shell - snugly fits around bear body
    const torsoSuit = new THREE.Mesh(new THREE.SphereGeometry(0.565, 24, 24), whiteMat);
    torsoSuit.scale.set(1.01, 1.155, 0.91);
    group.add(torsoSuit);

    // Life support chest module
    const chestPack = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.36, 0.14), techMat);
    chestPack.position.set(0, 0.05, 0.44);
    group.add(chestPack);

    // Mission badge
    const badge = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.02, 16), goldMat);
    badge.rotation.x = Math.PI / 2;
    badge.position.set(-0.14, 0.14, 0.52);
    group.add(badge);

    // Status lights
    const lightG = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), new THREE.MeshBasicMaterial({ color: 0x22c55e }));
    lightG.position.set(0.12, 0.14, 0.52);
    group.add(lightG);

    // Shoulder joint rings
    [-0.48, 0.48].forEach(sx => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.04, 8, 16), techMat);
      ring.position.set(sx, 0.20, 0);
      ring.rotation.y = Math.PI / 2;
      group.add(ring);
    });

  } else if (itemId.includes('knight') || itemId.includes('şövalye') || itemId.includes('armor') || itemId.includes('zırh')) {
    // --- KNIGHT BREASTPLATE & PAULDRONS ---
    const armorColor = itemId.includes('gold') || itemId.includes('altın') ? 0xf59e0b : 0x64748b;
    const plateMat = new THREE.MeshStandardMaterial({ color: armorColor, metalness: 0.85, roughness: 0.25 });
    const trimMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9, roughness: 0.15 });

    const cuirass = new THREE.Mesh(new THREE.SphereGeometry(0.565, 24, 24), plateMat);
    cuirass.scale.set(1.01, 1.155, 0.91);
    group.add(cuirass);

    const crest = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.36, 0.10), trimMat);
    crest.position.set(0, 0.10, 0.44);
    group.add(crest);

    // Shoulder Pauldrons
    [-0.50, 0.50].forEach((px, idx) => {
      const pauldron = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), plateMat);
      pauldron.rotation.z = idx === 0 ? 0.35 : -0.35;
      pauldron.position.set(px, 0.28, 0);
      group.add(pauldron);
    });

  } else if (itemId.includes('doctor') || itemId.includes('doktor')) {
    // --- DOCTOR LAB COAT & STETHOSCOPE ---
    const coatMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.5 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 });

    const coat = new THREE.Mesh(new THREE.SphereGeometry(0.565, 24, 24), coatMat);
    coat.scale.set(1.01, 1.155, 0.91);
    group.add(coat);

    const innerShirt = new THREE.Mesh(new THREE.ConeGeometry(0.20, 0.30, 3), blueMat);
    innerShirt.position.set(0, 0.24, 0.42);
    group.add(innerShirt);

    const steth = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.025, 8, 20, Math.PI), metalMat);
    steth.position.set(0, 0.24, 0.32);
    steth.rotation.x = 0.4;
    group.add(steth);

  } else if (itemId.includes('detective') || itemId.includes('dedektif')) {
    // --- TRENCHCOAT WITH TIE & BUTTONS ---
    const trenchMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 });
    const tieMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.4 });
    const btnMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.3 });

    const coat = new THREE.Mesh(new THREE.SphereGeometry(0.565, 24, 24), trenchMat);
    coat.scale.set(1.01, 1.155, 0.91);
    group.add(coat);

    const tie = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.32, 0.03), tieMat);
    tie.position.set(0, 0.14, 0.44);
    group.add(tie);

    [-0.10, 0.10].forEach(bx => {
      [0.06, -0.08, -0.22].forEach(by => {
        const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.02, 10), btnMat);
        btn.rotation.x = Math.PI / 2;
        btn.position.set(bx, by, 0.44);
        group.add(btn);
      });
    });

  } else if (itemId.includes('chef') || itemId.includes('aşçı')) {
    // --- CHEF UNIFORM WITH RED SCARF ---
    const jacketMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
    const scarfMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });

    const jacket = new THREE.Mesh(new THREE.SphereGeometry(0.565, 24, 24), jacketMat);
    jacket.scale.set(1.01, 1.155, 0.91);
    group.add(jacket);

    const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.30, 0.05, 8, 18), scarfMat);
    scarf.rotation.x = Math.PI / 2.3;
    scarf.position.set(0, 0.28, 0.26);
    group.add(scarf);

  } else if (itemId.includes('pirate') || itemId.includes('korsan')) {
    // --- PIRATE CAPTAIN JACKET & GOLD BUCKLE SASH ---
    const coatMat = new THREE.MeshStandardMaterial({ color: 0x450a0a, roughness: 0.5 });
    const sashMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85 });

    const coat = new THREE.Mesh(new THREE.SphereGeometry(0.565, 24, 24), coatMat);
    coat.scale.set(1.01, 1.155, 0.91);
    group.add(coat);

    const sash = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.06, 8, 24), sashMat);
    sash.rotation.x = Math.PI / 2;
    sash.position.set(0, -0.16, 0);
    group.add(sash);

    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 0.05), goldMat);
    buckle.position.set(0, -0.16, 0.44);
    group.add(buckle);

  } else if (itemId.includes('cyber') || itemId.includes('ninja')) {
    // --- CYBER NINJA BATTLESUIT ---
    const cyberMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.25, metalness: 0.8 });
    const neonMat = new THREE.MeshStandardMaterial({ color: itemColorHex || 0x06b6d4, emissive: itemColorHex || 0x06b6d4, emissiveIntensity: 0.9 });

    const suit = new THREE.Mesh(new THREE.SphereGeometry(0.565, 24, 24), cyberMat);
    suit.scale.set(1.01, 1.155, 0.91);
    group.add(suit);

    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.03, 16), neonMat);
    core.rotation.x = Math.PI / 2;
    core.position.set(0, 0.10, 0.44);
    group.add(core);

  } else {
    // --- STANDARD TAILORED ADVENTURER TUNIC ---
    const tunicMat = new THREE.MeshStandardMaterial({ color: itemColorHex || 0x1d4ed8, roughness: 0.5 });
    const beltMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.4 });
    const buckleMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85, roughness: 0.2 });

    const tunic = new THREE.Mesh(new THREE.SphereGeometry(0.565, 24, 24), tunicMat);
    tunic.scale.set(1.01, 1.155, 0.91);
    group.add(tunic);

    const belt = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.05, 8, 24), beltMat);
    belt.rotation.x = Math.PI / 2;
    belt.position.set(0, -0.16, 0);
    group.add(belt);

    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.10, 0.04), buckleMat);
    buckle.position.set(0, -0.16, 0.44);
    group.add(buckle);
  }

  return group;
}
