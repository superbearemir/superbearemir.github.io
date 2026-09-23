const fs = require('fs');
const path = require('path');

console.log("🐾 Preparing Grand Expansion of Ayı & Kedi Köyü (Bear & Cat Village)...");

const enhancerPath = path.join(__dirname, 'public', 'game-enhancer.js');
let code = fs.readFileSync(enhancerPath, 'utf8');

// 1. Build the new Animal & NPC Mesh Creators + Lore Tablet Helpers
const newMeshCreatorsCode = `
// =========================================================================
// --- 🐾 NEW FRIENDLY ANIMALS, SCHOLARS & ANCIENT LORE TABLETS ---
// =========================================================================

// 1. 🐻 YAVRU AYICIK POFUDUK (Baby Bear Mesh)
function createBabyBearMesh(THREE) {
  const group = new THREE.Group();
  const furMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.8 });
  const bellyMat = new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.9 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.5 });
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 });

  // Paws
  const pawGeo = new THREE.SphereGeometry(0.18, 10, 10);
  [[-0.25, 0.25], [0.25, 0.25], [-0.25, -0.25], [0.25, -0.25]].forEach(([px, pz]) => {
    const paw = new THREE.Mesh(pawGeo, darkMat);
    paw.scale.set(1.0, 0.6, 1.2);
    paw.position.set(px, 0.1, pz);
    group.add(paw);
  });

  // Chubby baby body
  const bodyGeo = new THREE.SphereGeometry(0.55, 14, 14);
  bodyGeo.scale(0.95, 1.05, 0.9);
  const body = new THREE.Mesh(bodyGeo, furMat);
  body.position.y = 0.65;
  group.add(body);

  // Soft belly patch
  const bellyGeo = new THREE.SphereGeometry(0.38, 12, 12);
  bellyGeo.scale(0.8, 1.0, 0.35);
  const belly = new THREE.Mesh(bellyGeo, bellyMat);
  belly.position.set(0, 0.62, 0.38);
  group.add(belly);

  // Cute Head
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.2, 0.08);
  group.add(headGroup);

  const headGeo = new THREE.SphereGeometry(0.42, 14, 14);
  const head = new THREE.Mesh(headGeo, furMat);
  headGroup.add(head);

  // Snout
  const snoutGeo = new THREE.SphereGeometry(0.22, 10, 10);
  snoutGeo.scale(1.0, 0.8, 1.2);
  const snout = new THREE.Mesh(snoutGeo, bellyMat);
  snout.position.set(0, -0.06, 0.32);
  headGroup.add(snout);

  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), darkMat);
  nose.position.set(0, -0.02, 0.52);
  headGroup.add(nose);

  // Big curious eyes
  [-0.15, 0.15].forEach(ex => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), eyeMat);
    eye.position.set(ex, 0.1, 0.35);
    headGroup.add(eye);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    pupil.position.set(ex + 0.015, 0.12, 0.4);
    headGroup.add(pupil);
  });

  // Round Bear Ears
  [-0.28, 0.28].forEach(side => {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 10), furMat);
    ear.position.set(side, 0.32, 0);
    headGroup.add(ear);
    const inEar = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), bellyMat);
    inEar.position.set(side * 0.95, 0.32, 0.08);
    headGroup.add(inEar);
  });

  return group;
}

// 2. 🦉 BİLGE PERİ BAYKUŞU HEKTOR (Wise Spirit Owl Mesh)
function createOwlMesh(THREE) {
  const group = new THREE.Group();
  const featherMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.7 });
  const breastMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.8 });
  const beakMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 });
  const glowingEyeMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });

  // Body
  const bodyGeo = new THREE.CylinderGeometry(0.3, 0.4, 0.9, 12);
  const body = new THREE.Mesh(bodyGeo, featherMat);
  body.position.y = 0.5;
  group.add(body);

  const breastGeo = new THREE.SphereGeometry(0.32, 10, 10);
  breastGeo.scale(0.8, 1.1, 0.4);
  const breast = new THREE.Mesh(breastGeo, breastMat);
  breast.position.set(0, 0.5, 0.25);
  group.add(breast);

  // Head
  const headGeo = new THREE.SphereGeometry(0.36, 12, 12);
  const head = new THREE.Mesh(headGeo, featherMat);
  head.position.set(0, 1.05, 0);
  group.add(head);

  // Feather Ear Tufts
  [-0.22, 0.22].forEach(tx => {
    const tuft = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.35, 6), featherMat);
    tuft.position.set(tx, 1.35, 0);
    tuft.rotation.z = tx < 0 ? 0.3 : -0.3;
    group.add(tuft);
  });

  // Big Glowing Wise Eyes
  [-0.14, 0.14].forEach(ex => {
    const eyeDisk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.04, 12), new THREE.MeshBasicMaterial({ color: 0x0f172a }));
    eyeDisk.rotation.x = Math.PI / 2;
    eyeDisk.position.set(ex, 1.08, 0.32);
    group.add(eyeDisk);

    const eyePupil = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), glowingEyeMat);
    eyePupil.position.set(ex, 1.08, 0.34);
    group.add(eyePupil);
  });

  // Beak
  const beakGeo = new THREE.ConeGeometry(0.08, 0.2, 8);
  const beak = new THREE.Mesh(beakGeo, beakMat);
  beak.rotation.x = Math.PI / 2.2;
  beak.position.set(0, 0.96, 0.38);
  group.add(beak);

  // Wings folded at sides
  [-0.38, 0.38].forEach(wx => {
    const wing = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.7, 0.35), featherMat);
    wing.position.set(wx, 0.5, -0.05);
    wing.rotation.z = wx < 0 ? -0.15 : 0.15;
    group.add(wing);
  });

  // Perch Talons
  const clawMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
  [-0.15, 0.15].forEach(cx => {
    const talon = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.08, 0.25), clawMat);
    talon.position.set(cx, 0.04, 0.1);
    group.add(talon);
  });

  return group;
}

// 3. 🐢 KADİM KAPLUMBAĞA TONTON TURGUT (Wise Turtle Mesh)
function createTurtleMesh(THREE) {
  const group = new THREE.Group();
  const shellMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.7 });
  const bellyShellMat = new THREE.MeshStandardMaterial({ color: 0xa3e635, roughness: 0.8 });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.6 });
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });

  // Big Sturdy Shell
  const shellGeo = new THREE.SphereGeometry(0.85, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2);
  shellGeo.scale(1.0, 0.65, 1.3);
  const shell = new THREE.Mesh(shellGeo, shellMat);
  shell.position.y = 0.3;
  group.add(shell);

  // Bottom Shell Plastron
  const bottomShell = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.82, 0.15, 14), bellyShellMat);
  bottomShell.scale.set(1.0, 1.0, 1.25);
  bottomShell.position.y = 0.25;
  group.add(bottomShell);

  // Head poking out
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.45, 1.15);
  group.add(headGroup);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.4, 8), skinMat);
  neck.rotation.x = Math.PI / 4;
  neck.position.set(0, -0.05, -0.15);
  headGroup.add(neck);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 10), skinMat);
  head.scale.set(0.9, 0.8, 1.2);
  headGroup.add(head);

  [-0.18, 0.18].forEach(ex => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 6), eyeMat);
    eye.position.set(ex, 0.08, 0.2);
    headGroup.add(eye);
  });

  // 4 Webbed Flippers / Legs
  [[-0.65, 0.65], [0.65, 0.65], [-0.65, -0.65], [0.65, -0.65]].forEach(([lx, lz]) => {
    const flipper = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), skinMat);
    flipper.scale.set(1.4, 0.4, 1.1);
    flipper.position.set(lx, 0.12, lz);
    group.add(flipper);
  });

  return group;
}

// 4. 🦫 NEHİR KUNDUZU KIVRIK (River Beaver Builder Mesh)
function createBeaverMesh(THREE) {
  const group = new THREE.Group();
  const furMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
  const bellyMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 });
  const tailMat = new THREE.MeshStandardMaterial({ color: 0x292524, roughness: 0.9 });
  const toothMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.3 });

  // Body
  const bodyGeo = new THREE.CylinderGeometry(0.35, 0.45, 0.9, 10);
  const body = new THREE.Mesh(bodyGeo, furMat);
  body.position.y = 0.5;
  group.add(body);

  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), bellyMat);
  belly.scale.set(0.8, 1.1, 0.4);
  belly.position.set(0, 0.48, 0.26);
  group.add(belly);

  // Big Flat Paddle Tail
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.08, 0.7), tailMat);
  tail.position.set(0, 0.12, -0.65);
  group.add(tail);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 10, 10), furMat);
  head.position.set(0, 1.05, 0.05);
  group.add(head);

  // Big Front Teeth
  const toothL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.1, 0.04), toothMat);
  toothL.position.set(-0.035, 0.92, 0.35);
  group.add(toothL);
  const toothR = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.1, 0.04), toothMat);
  toothR.position.set(0.035, 0.92, 0.35);
  group.add(toothR);

  // Wooden branch in paws
  const logInHand = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.6, 6), new THREE.MeshStandardMaterial({ color: 0x573a08 }));
  logInHand.rotation.z = Math.PI / 3;
  logInHand.position.set(0, 0.6, 0.4);
  group.add(logInHand);

  return group;
}

// 5. 🐱✨ PARILTILI RUH KEDİSİ ASTRA (Luminous Spirit Guide Cat Mesh)
function createSpiritCatMesh(THREE) {
  const group = new THREE.Group();
  const spiritMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.9,
    transparent: true,
    opacity: 0.88,
    roughness: 0.1
  });
  const haloMat = new THREE.MeshBasicMaterial({ color: 0xa5f3fc, wireframe: true });

  // Body
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.45, 12, 12), spiritMat);
  body.scale.set(0.9, 1.1, 1.2);
  body.position.y = 0.55;
  group.add(body);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), spiritMat);
  head.position.set(0, 1.0, 0.25);
  group.add(head);

  // Pointed Spirit Ears
  [-0.18, 0.18].forEach(ex => {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.3, 8), spiritMat);
    ear.position.set(ex, 1.3, 0.25);
    ear.rotation.z = ex < 0 ? 0.2 : -0.2;
    group.add(ear);
  });

  // Floating Celestial Halo
  const halo = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.04, 8, 16), haloMat);
  halo.rotation.x = Math.PI / 2.2;
  halo.position.set(0, 1.5, 0.25);
  group.add(halo);

  // Curled Spirit Tail
  const tail = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.08, 8, 12, Math.PI * 1.3), spiritMat);
  tail.position.set(0, 0.65, -0.45);
  tail.rotation.y = Math.PI / 2;
  group.add(tail);

  return group;
}

// 6. 📜 KADİM RUNİK TAŞ KİTABE (Ancient Lore Stone Inscription Tablet)
function createAncientLoreTablet(THREE, group, x, y, z, rotY, tabletId, title, inscriptionText) {
  const tabletGroup = new THREE.Group();
  tabletGroup.position.set(x, y, z);
  tabletGroup.rotation.y = rotY;

  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85 });
  const runeGlowMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 1.2,
    roughness: 0.2
  });
  const goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.6, roughness: 0.3 });

  // Stone Stele Base
  const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.4, 1.4), stoneMat);
  baseMesh.position.y = 0.2;
  baseMesh.receiveShadow = true;
  tabletGroup.add(baseMesh);

  // Stele Pillar
  const steleGeo = new THREE.BoxGeometry(1.8, 3.2, 0.45);
  const steleMesh = new THREE.Mesh(steleGeo, stoneMat);
  steleMesh.position.y = 1.9;
  steleMesh.castShadow = true;
  tabletGroup.add(steleMesh);

  // Gold Trim Arch
  const trimMesh = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.15, 0.52), goldTrimMat);
  trimMesh.position.y = 3.55;
  tabletGroup.add(trimMesh);

  // Glowing Rune Carvings
  [-0.5, 0.0, 0.5].forEach((rx, ri) => {
    const runeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.9, 0.06), runeGlowMat);
    runeMesh.position.set(rx, 2.0 + (ri % 2 === 0 ? 0.2 : -0.2), 0.24);
    tabletGroup.add(runeMesh);
  });

  // Floating Runic Star on top
  const starMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.25, 0), runeGlowMat);
  starMesh.position.set(0, 3.9, 0);
  tabletGroup.add(starMesh);

  group.add(tabletGroup);

  // Add to dynamic lore tablets tracking array
  if (!window.__ancientLoreTablets) window.__ancientLoreTablets = [];
  window.__ancientLoreTablets.push({
    id: tabletId,
    title: title,
    text: inscriptionText,
    pos: new THREE.Vector3(x, y + 1.5, z),
    group: tabletGroup,
    starMesh: starMesh
  });

  // Physical collision
  const game = window.__superBearGame;
  if (game && game.currentLevel && game.currentLevel.colliders) {
    game.currentLevel.colliders.push({
      min: new THREE.Vector3(x - 1.0, y, z - 0.7),
      max: new THREE.Vector3(x + 1.0, y + 3.8, z + 0.7),
      isToxic: false,
      isIce: false
    });
  }
}
`;

// Insert the new mesh creator functions into game-enhancer.js before createFoxMesh
if (!code.includes('function createBabyBearMesh')) {
  const insertIdx = code.indexOf('function createFoxMesh(');
  if (insertIdx !== -1) {
    code = code.substring(0, insertIdx) + newMeshCreatorsCode + '\n\n' + code.substring(insertIdx);
    console.log("✅ Added new animal, spirit cat and lore tablet mesh builders to game-enhancer.js");
  } else {
    console.error("Could not find function createFoxMesh in game-enhancer.js");
  }
}

// 2. Now enrich buildExpandedKediKoyu with all new districts, secret passages, friendly animals, and lore NPCs
const newVillageDistrictsCode = `
  // =========================================================================
  // 🌟 A) BÜYÜK AYI & KEDİ MEYDANI (CENTRAL EXPANDED TOWN PLAZA & GRAND FOUNTAIN)
  // =========================================================================
  const plazaMat = new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.75 });
  const fountainWaterMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, transparent: true, opacity: 0.85 });
  const goldTrim = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.3 });

  // Grand Mosaic Cobblestone Plaza (Single surface sitting slightly on terrain at y: 0.05)
  const plazaMesh = new THREE.Mesh(new THREE.CylinderGeometry(16, 16, 0.1, 32), plazaMat);
  plazaMesh.position.set(0, 0.05, 0);
  plazaMesh.receiveShadow = true;
  villageGroup.add(plazaMesh);

  // Central Ornamental Tiered Magic Fountain (x: 0, z: 0)
  const fountainBase = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 5.0, 0.8, 20), plazaMat);
  fountainBase.position.set(0, 0.4, 0);
  villageGroup.add(fountainBase);

  const fountainPool = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.2, 0.6, 20), fountainWaterMat);
  fountainPool.position.set(0, 0.6, 0);
  villageGroup.add(fountainPool);

  const fountainSpire = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.9, 3.2, 12), plazaMat);
  fountainSpire.position.set(0, 2.0, 0);
  villageGroup.add(fountainSpire);

  const fountainTopOrb = new THREE.Mesh(new THREE.SphereGeometry(0.7, 14, 14), createGlowMat(0x38bdf8, 0x67e8f9));
  fountainTopOrb.position.set(0, 3.8, 0);
  villageGroup.add(fountainTopOrb);

  // Physical fountain collider (Solid obstacle)
  if (gameRef && gameRef.currentLevel && gameRef.currentLevel.colliders) {
    gameRef.currentLevel.colliders.push({
      min: new THREE.Vector3(-4.5, 0, -4.5),
      max: new THREE.Vector3(4.5, 1.2, 4.5),
      isToxic: false,
      isIce: false
    });
  }

  // 4 Grand Plaza Streetlamps & Flower Planters around the circle
  [0, Math.PI/2, Math.PI, Math.PI*1.5].forEach((ang, li) => {
    const lx = Math.cos(ang) * 12;
    const lz = Math.sin(ang) * 12;

    const lampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 3.6, 8), darkRockMat);
    lampPole.position.set(lx, 1.8, lz);
    villageGroup.add(lampPole);

    const lampLantern = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.6), createGlowMat(0xfde047, 0xfacc15));
    lampLantern.position.set(lx, 3.8, lz);
    villageGroup.add(lampLantern);

    // Planter
    const planter = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 0.9, 0.6, 8), darkRockMat);
    planter.position.set(lx * 0.85, 0.3, lz * 0.85);
    villageGroup.add(planter);

    const bush = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 8), pineLeafMat);
    bush.position.set(lx * 0.85, 0.7, lz * 0.85);
    villageGroup.add(bush);
  });

  // =========================================================================
  // 🌸 B) KEDİ ÇİÇEK BAHÇELERİ & DİNLENME ÇAYIRI (EAST BLOSSOM GARDENS: x: 42..72, z: -10..18)
  // =========================================================================
  const sakuraLeafMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.6 });
  const yarnMat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.9 });
  const catTreeMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.8 });

  // 3 Cherry Blossom / Sakura Trees
  [{ x: 46, z: -4 }, { x: 62, z: 8 }, { x: 54, z: -16 }].forEach((treePos, ti) => {
    const sTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.45, 3.8, 8), woodMat);
    sTrunk.position.set(treePos.x, 1.9, treePos.z);
    villageGroup.add(sTrunk);

    const sCrown = new THREE.Mesh(new THREE.SphereGeometry(2.4, 10, 10), sakuraLeafMat);
    sCrown.scale.set(1.2, 0.9, 1.2);
    sCrown.position.set(treePos.x, 4.4, treePos.z);
    villageGroup.add(sCrown);
  });

  // Cat Scratching Posts & Activity Towers (x: 52, z: 2)
  const post1 = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 3.2, 10), catTreeMat);
  post1.position.set(52, 1.6, 2);
  villageGroup.add(post1);

  const postPlatform = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.25, 12), sandMat);
  postPlatform.position.set(52, 3.2, 2);
  villageGroup.add(postPlatform);

  // Big Yarn Ball
  const yarnBall = new THREE.Mesh(new THREE.SphereGeometry(0.8, 12, 12), yarnMat);
  yarnBall.position.set(56, 0.8, -2);
  villageGroup.add(yarnBall);

  // 🐻 YAVRU AYICIK POFUDUK NPC (Playing in the blossom garden!)
  const babyBear = createBabyBearMesh(THREE);
  babyBear.position.set(48, 0.05, 4);
  babyBear.rotation.y = -Math.PI / 4;
  babyBear.name = 'npc_baby_bear_pofuduk';
  villageGroup.add(babyBear);

  villageNpcsList.push({
    id: 'npc_baby_bear_pofuduk',
    name: 'Yavru Ayıcık Pofuduk 🐻✨',
    role: 'Meraklı Köy Yavrusu',
    avatarIcon: '🐻',
    mesh: babyBear,
    pos: babyBear.position,
    dialogue: [
      "Miyav! Yani... Grrrr! Dede, köyümüz dün küçücüktü, şimdi devasa bir masal krallığı oldu!",
      "Neden bu kadar büyüdü bu köy biliyor musun cesur ayı abi? Muhtar dedem dedi ki: Sen kötülere karşı kazandıkça köyün koruma aurası genişliyormuş!",
      "Çiçek bahçelerindeki pembe ağaçların altında oynamaya bayılıyorum!"
    ]
  });

  // =========================================================================
  // 🔮 C) KOZMİK GÖZLEMEVİ & YILDIZ BİLGELİK KULESİ (SOUTH-EAST: x: 55..75, z: 35..65)
  // =========================================================================
  const observatoryMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.6 });
  const brassMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.25 });
  const cosmicGlowMat = createGlowMat(0x6366f1, 0xa855f7);

  // Observatory Raised Hill Terrace (Single elevated box: x: 62, y: 1.5, z: 50)
  const OBS_Y = 3.0;
  const obsTerrace = new THREE.Mesh(new THREE.BoxGeometry(18, OBS_Y, 18), darkRockMat);
  obsTerrace.position.set(62, OBS_Y / 2, 50);
  obsTerrace.receiveShadow = true;
  villageGroup.add(obsTerrace);

  if (gameRef && gameRef.currentLevel && gameRef.currentLevel.colliders) {
    gameRef.currentLevel.colliders.push({
      min: new THREE.Vector3(53, 0, 41),
      max: new THREE.Vector3(71, OBS_Y, 59),
      isToxic: false,
      isIce: false
    });
  }

  // Stone Access Steps leading up to Observatory (x: 50..53, z: 50)
  for (let st = 0; st < 6; st++) {
    const stepMesh = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.5, 4.0), roadCobbleMat);
    stepMesh.position.set(49 + st * 0.8, (st + 1) * 0.5, 50);
    villageGroup.add(stepMesh);
    if (gameRef && gameRef.currentLevel && gameRef.currentLevel.colliders) {
      gameRef.currentLevel.colliders.push({
        min: new THREE.Vector3(48 + st * 0.8, 0, 48),
        max: new THREE.Vector3(50 + st * 0.8, (st + 1) * 0.5, 52),
        isToxic: false,
        isIce: false
      });
    }
  }

  // Observatory Dome Tower (on top of terrace)
  const domeBase = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 6.0, 4.5, 16), observatoryMat);
  domeBase.position.set(62, OBS_Y + 2.25, 50);
  villageGroup.add(domeBase);

  const domeRoof = new THREE.Mesh(new THREE.SphereGeometry(5.4, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), cosmicGlowMat);
  domeRoof.position.set(62, OBS_Y + 4.5, 50);
  villageGroup.add(domeRoof);

  // Giant Brass Starlight Telescope poking out of dome
  const telescope = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.55, 6.5, 12), brassMat);
  telescope.position.set(62, OBS_Y + 5.5, 52);
  telescope.rotation.x = Math.PI / 3.5;
  villageGroup.add(telescope);

  // ASTROLOG KEDİ LUNA NPC 🔮🐱 (Stands on the Observatory Terrace)
  const astrologerCat = buildCatMesh(0x4338ca, 0xfde047, 0xa855f7, 0xf59e0b);
  astrologerCat.position.set(57, OBS_Y, 46);
  astrologerCat.rotation.y = -Math.PI / 3;
  astrologerCat.name = 'npc_astrolog_luna';
  villageGroup.add(astrologerCat);

  villageNpcsList.push({
    id: 'npc_astrolog_luna',
    name: 'Astrolog Kedi Luna 🔮🐱',
    role: 'Kozmik Gökyüzü Bilgesi',
    avatarIcon: '🔮',
    mesh: astrologerCat,
    pos: astrologerCat.position,
    dialogue: [
      "Yıldızların ışığı adına selamlar Süper Ayı! Gözlemevimden gökyüzü haritasını inceliyorum miyav!",
      "Köylüler 'Neden bu kadar büyüdü bu köy?' diye soruyor... Sebebi açık: Kozmik İmparator'un yaydığı karanlık dalgalara karşı köyümüzün koruyucu kalkanı kendini genişletiyor!",
      "Yıldız kulesine tırman ve tüm köyün ışıldayan güzelliğini seyret!"
    ]
  });

  // =========================================================================
  // 🌲 D) ANTİK MEŞE & DOĞA RUHU KORULUĞU (SOUTH-WEST: x: -55..-75, z: 35..65)
  // =========================================================================
  const ancientBarkMat = new THREE.MeshStandardMaterial({ color: 0x3f2e18, roughness: 0.95 });
  const mossFoliageMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.8 });

  // Colossal Elder Oak Tree Trunk
  const elderTrunk = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 3.8, 9.0, 12), ancientBarkMat);
  elderTrunk.position.set(-62, 4.5, 48);
  villageGroup.add(elderTrunk);

  const elderCrown = new THREE.Mesh(new THREE.SphereGeometry(6.5, 14, 14), mossFoliageMat);
  elderCrown.scale.set(1.4, 0.9, 1.4);
  elderCrown.position.set(-62, 10.0, 48);
  villageGroup.add(elderCrown);

  if (gameRef && gameRef.currentLevel && gameRef.currentLevel.colliders) {
    gameRef.currentLevel.colliders.push({
      min: new THREE.Vector3(-66, 0, 44),
      max: new THREE.Vector3(-58, 14, 52),
      isToxic: false,
      isIce: false
    });
  }

  // 🦉 BİLGE PERİ BAYKUŞU HEKTOR NPC (Perched on a wooden branch of the Elder Oak)
  const owlHektor = createOwlMesh(THREE);
  owlHektor.position.set(-58, 2.2, 46);
  owlHektor.rotation.y = -Math.PI / 2.5;
  owlHektor.name = 'npc_owl_hektor';
  villageGroup.add(owlHektor);

  villageNpcsList.push({
    id: 'npc_owl_hektor',
    name: 'Bilge Peri Baykuşu Hektor 🦉',
    role: 'Kadim Doğa Muhafızı',
    avatarIcon: '🦉',
    mesh: owlHektor,
    pos: owlHektor.position,
    dialogue: [
      "Huu huu! Antik Meşe'nin gölgesine hoş geldin genç ayı kahraman!",
      "Yüzlerce yıldır bu topraklardayım... İnsanlar 'Köy neden bir gecede böylesine devasa bir krallığa dönüştü?' diye hayret ediyor.",
      "Kadim kehanet gerçekleşti: Ayıların cesareti ile kedilerin zekası birleştiğinde orman genişler, sular berraklaşır ve köy kötülüğü yener!"
    ]
  });

  // =========================================================================
  // 🌊 E) BAL SAHİLİ, SU DEĞİRMENİ & NEHİR DELTASI (SOUTH RIVER: x: -60..60, z: 20..35)
  // =========================================================================
  // 3D Animated Wooden Waterwheel beside the river bridge (x: -24, y: 1.8, z: 24)
  const waterwheelGroup = new THREE.Group();
  waterwheelGroup.position.set(-24, 1.8, 24);
  const wheelHub = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.2, 8), darkWoodMat);
  wheelHub.rotation.x = Math.PI / 2;
  waterwheelGroup.add(wheelHub);

  for (let pd = 0; pd < 8; pd++) {
    const pAng = pd * (Math.PI / 4);
    const paddle = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.4, 0.6), woodMat);
    paddle.position.set(Math.cos(pAng) * 1.2, Math.sin(pAng) * 1.2, 0);
    paddle.rotation.z = pAng;
    waterwheelGroup.add(paddle);
  }
  waterwheelGroup.name = 'village_waterwheel';
  villageGroup.add(waterwheelGroup);

  // 🐢 KADİM KAPLUMBAĞA TONTON TURGUT NPC (Resting peacefully by the riverbank)
  const turtleTurgut = createTurtleMesh(THREE);
  turtleTurgut.position.set(6, 0.05, 28);
  turtleTurgut.rotation.y = Math.PI / 4;
  turtleTurgut.name = 'npc_turtle_turgut';
  villageGroup.add(turtleTurgut);

  villageNpcsList.push({
    id: 'npc_turtle_turgut',
    name: 'Kadim Kaplumbağa Tonton Turgut 🐢',
    role: 'Nehir Deltası Yaşlısı',
    avatarIcon: '🐢',
    mesh: turtleTurgut,
    pos: turtleTurgut.position,
    dialogue: [
      "Yavaşşşça selamlar kahraman ayı... Üç yüz yaşındayım, köyün bu denli büyüdüğünü hiç görmemiştim!",
      "Neden bu kadar büyüdü bu köy biliyor musun? Çünkü kadim nehirler yerin altındaki kutsal bal kaynaklarına bağlandı!",
      "Sularımız artık şifalı ve berrak. Nehir boyunca yüz veya nilüfer yapraklarının üstünde zıpla!"
    ]
  });

  // 🦫 NEHİR KUNDUZU KIVRIK NPC (Building wooden river piers)
  const beaverKivrik = createBeaverMesh(THREE);
  beaverKivrik.position.set(-20, 0.05, 26);
  beaverKivrik.rotation.y = -Math.PI / 3;
  beaverKivrik.name = 'npc_beaver_kivrik';
  villageGroup.add(beaverKivrik);

  villageNpcsList.push({
    id: 'npc_beaver_kivrik',
    name: 'Nehir Kunduzu Kıvrık 🦫',
    role: 'Usta Köprü Mimarı',
    avatarIcon: '🦫',
    mesh: beaverKivrik,
    pos: beaverKivrik.position,
    dialogue: [
      "Tak tak tak! Odunları çakıyorum, yeni köprüler kuruyorum!",
      "Herkes 'Köy neden durmaksızın genişliyor?' diye soruyor. Genişleyecek tabii! Süper Ayı dünyaları kurtarırken biz de ona yakışır bir başkent inşa ediyoruz!",
      "Su değirmeninin arkasındaki gizli tahta iskeleden nehre atlayabilirsin!"
    ]
  });

  // =========================================================================
  // 🌀 F) GİZLİ GEÇİTLER & PORTALLAR (SECRET PASSAGES & SHORTCUTS)
  // =========================================================================
  // 1. Şelale Arkası Gizli Kristal Geçidi (Behind Grand Waterfall: x: -62, z: -32)
  const waterfallGrotto = new THREE.Group();
  waterfallGrotto.position.set(-62, 0, -32);

  const grottoArch = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.6, 8, 16), createGlowMat(0x38bdf8, 0x0284c7));
  grottoArch.position.set(0, 3.2, 0);
  waterfallGrotto.add(grottoArch);

  // Hidden Glowing Chest inside Waterfall Grotto
  const grottoChest = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.0, 1.0), goldTrim);
  grottoChest.position.set(0, 0.6, -3.0);
  waterfallGrotto.add(grottoChest);

  villageGroup.add(waterfallGrotto);

  // 🐱✨ PARILTILI RUH KEDİSİ ASTRA NPC (Guards the waterfall secret passage)
  const spiritCatAstra = createSpiritCatMesh(THREE);
  spiritCatAstra.position.set(-56, 0.5, -28);
  spiritCatAstra.rotation.y = Math.PI / 4;
  spiritCatAstra.name = 'npc_spirit_cat_astra';
  villageGroup.add(spiritCatAstra);

  villageNpcsList.push({
    id: 'npc_spirit_cat_astra',
    name: 'Parıltılı Ruh Kedisi Astra 🐱✨',
    role: 'Gizli Geçitler Rehberi',
    avatarIcon: '✨',
    mesh: spiritCatAstra,
    pos: spiritCatAstra.position,
    dialogue: [
      "Mırrr... Ben bu köyün kadim koruyucu ruhuyum Süper Ayı!",
      "İnsanlar ve hayvanlar hayretle soruyor: 'Küçük kasabamız nasıl bu kadar devasa bir krallık oldu?'",
      "Köyümüz, senin kalbindeki cesaretle büyüdü! Arkamdaki şelale perdesinin içinden geç; orada antik kristal geçidi ve gizli hazineler seni bekliyor!"
    ]
  });

  // 2. Kadim Kedi Ağaç Tüneli (Fast-Travel Shortcut Stump between Blossom Garden & River Dock)
  const warpStump1 = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.9, 1.4, 12), darkWoodMat);
  warpStump1.position.set(58, 0.7, 0);
  villageGroup.add(warpStump1);

  const warpPortal1 = new THREE.Mesh(new THREE.CircleGeometry(1.3, 16), createGlowMat(0xa855f7, 0xec4899));
  warpPortal1.rotation.x = -Math.PI / 2;
  warpPortal1.position.set(58, 1.42, 0);
  villageGroup.add(warpPortal1);

  // Destination Tree Stump at South River Dock (x: -16, z: 32)
  const warpStump2 = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.9, 1.4, 12), darkWoodMat);
  warpStump2.position.set(-16, 0.7, 32);
  villageGroup.add(warpStump2);

  const warpPortal2 = new THREE.Mesh(new THREE.CircleGeometry(1.3, 16), createGlowMat(0xa855f7, 0xec4899));
  warpPortal2.rotation.x = -Math.PI / 2;
  warpPortal2.position.set(-16, 1.42, 32);
  villageGroup.add(warpPortal2);

  // Register Warp Portals in window
  window.__villageWarpStumps = [
    { pos: new THREE.Vector3(58, 1.5, 0), target: new THREE.Vector3(-16, 2.0, 32), name: "Kedi Bahçesi -> Nehir İskelesi Tüneli" },
    { pos: new THREE.Vector3(-16, 1.5, 32), target: new THREE.Vector3(58, 2.0, 0), name: "Nehir İskelesi -> Kedi Bahçesi Tüneli" }
  ];

  // =========================================================================
  // 📜 G) 5 GİZLİ MESAJ & KADİM RUNİK KİTABELER (ANCIENT LORE STONE INSCRIPTIONS)
  // =========================================================================
  // 1. Merkez Meydan Kitabesi (x: -8, z: 6)
  createAncientLoreTablet(
    THREE, villageGroup, -8, 0, 6, 0.4,
    'lore_tablet_1_growth',
    '📜 Kadim Kitabe I: Köyün Büyük Büyümesi',
    'Bir zamanlar bu vadi sadece birkaç ahşap kulübeden ibaretti. Ne zaman ki Kozmik Kristal ormana düştü, toprağın kadim ruhu uyandı. Ayı ve kedi halkının ortak cesaretiyle köyümüz kötülüğe karşı devasa bir kaleye dönüştü!'
  );

  // 2. Kedi Çiçek Bahçesi Kitabesi (x: 64, z: -10)
  createAncientLoreTablet(
    THREE, villageGroup, 64, 0, -10, -0.6,
    'lore_tablet_2_friendship',
    '📜 Kadim Kitabe II: Bin Yıllık Kardeşlik',
    'Kedilerin çevik zekası ile ayıların sarsılmaz cesareti birleştiğinde evrende hiçbir karanlık güç bu birliği bozamaz. Bu dostluk sürdükçe köyümüz sonsuza dek büyüyecek ve korunacaktır.'
  );

  // 3. Şelale Arkası Gizli Geçit Kitabesi (x: -64, z: -36)
  createAncientLoreTablet(
    THREE, villageGroup, -64, 0, -36, 0.2,
    'lore_tablet_3_waterfall',
    '📜 Kadim Kitabe III: Şelalenin Gizemi',
    'Akan suların arkasındaki kristal oda, kadim ataların bıraktığı kutsal ışık kaynağını saklar. Bu ışığa dokunan cesur ayı, karanlık dünyaların zehrine karşı güç kazanır.'
  );

  // 4. Kozmik Gözlemevi Kitabesi (x: 66, z: 44)
  createAncientLoreTablet(
    THREE, villageGroup, 66, OBS_Y, 44, -Math.PI / 4,
    'lore_tablet_4_cosmos',
    '📜 Kadim Kitabe IV: Yıldızların Kehaneti',
    'Jokerooms ve Gölge Boyutunun gölgeleri evreni tehdit ediyor. Ayı ve Kedi Köyü, yaklaşan bu büyük kozmik savaşa karşı tüm masum canlıların sığınacağı son kutsal kaledir.'
  );

  // 5. Antik Meşe Ağacı Kitabesi (x: -58, z: 54)
  createAncientLoreTablet(
    THREE, villageGroup, -58, 0, 54, Math.PI / 3,
    'lore_tablet_5_nature',
    '📜 Kadim Kitabe V: Doğanın Sonsuz Sevgisi',
    'Bu topraklara barış ve adalet getiren Süper Ayı, tüm canlıların kalbinde ebedi bir efsane olarak anılacaktır. Kalbindeki iyilik en karanlık zindanları bile aydınlatır.'
  );
`;

// Replace inside buildExpandedKediKoyu right after building beginner training ground
const targetMarker = 'buildBeginnerTrainingGround(THREE, villageGroup);';
if (code.includes(targetMarker)) {
  const markerIdx = code.indexOf(targetMarker);
  const endIdx = markerIdx + targetMarker.length;
  code = code.substring(0, endIdx) + '\n' + newVillageDistrictsCode + code.substring(endIdx);
  console.log("✅ Inserted Grand Expanded Village Districts, NPCs, Secret Passages and Lore Tablets into buildExpandedKediKoyu!");
} else {
  console.error("Could not find buildBeginnerTrainingGround in game-enhancer.js");
}

// 3. Now add update interactions in the village loop for lore tablets, warp tree shortcuts, waterwheel animation & NPC dialogue
const newVillageUpdateCode = `
      // --- EXPANDED VILLAGE DYNAMIC ANIMATIONS & INTERACTIONS ---
      // A. Waterwheel continuous rotation
      const ww = game.scene.getObjectByName('village_waterwheel');
      if (ww) {
        ww.rotation.z += 0.015;
      }

      // B. Fast-Travel Tree Shortcut Stumps (Kedi Ağaç Tünelleri)
      if (window.__villageWarpStumps && Array.isArray(window.__villageWarpStumps)) {
        if (!game._warpStumpCooldown || game._warpStumpCooldown <= 0) {
          window.__villageWarpStumps.forEach(stump => {
            if (game.playerPos.distanceTo(stump.pos) < 1.8) {
              game.playerPos.copy(stump.target);
              game.playerVel.set(0, 0, 0);
              game._warpStumpCooldown = 3.0; // 3 second cooldown
              if (game.callbacks && game.callbacks.onShowNotice) {
                game.callbacks.onShowNotice(\`🌀 KADİM KEDİ TÜNELİ: \${stump.name} ile Işınlandın! ✨\`, "success");
              }
              if (typeof window.St !== 'undefined' && window.St.playHoneyGem) {
                window.St.playHoneyGem();
              }
            }
          });
        } else {
          game._warpStumpCooldown -= 0.016;
        }
      }

      // C. Ancient Lore Stone Tablets (5 Gizli Mesaj & Kitabeler)
      if (window.__ancientLoreTablets && Array.isArray(window.__ancientLoreTablets)) {
        window.__ancientLoreTablets.forEach(tablet => {
          if (tablet.starMesh) {
            tablet.starMesh.rotation.y += 0.03;
            tablet.starMesh.position.y = 3.9 + Math.sin(Date.now() * 0.003) * 0.12;
          }
          const distToTablet = game.playerPos.distanceTo(tablet.pos);
          if (distToTablet < 3.2) {
            if (Date.now() % 3500 < 50) {
              if (game.callbacks && game.callbacks.onShowNotice) {
                game.callbacks.onShowNotice(\`📜 \${tablet.title} [E / Tıkla: Oku]\`, "info");
              }
            }
            if (game.isAttacking || (game.inputs && game.inputs.attack) || distToTablet < 1.8) {
              if (!game._lastLoreTabletRead || Date.now() - game._lastLoreTabletRead > 2500) {
                game._lastLoreTabletRead = Date.now();
                if (game.callbacks && game.callbacks.onDialogueOpen) {
                  game.callbacks.onDialogueOpen({
                    npcId: tablet.id,
                    npcName: tablet.title,
                    npcRole: "Kadim Ayı & Kedi Krallığı Yazıtı",
                    avatarIcon: "📜",
                    dialogue: [
                      tablet.text,
                      "💡 KÖYLÜLERİN MERAKI: 'Köyümüz neden bu kadar büyüdü?' sorusunun sırrı bu kutsal taşlarda saklıdır. Her zaferin köyümüzü daha da yüceltecek!"
                    ]
                  });
                }
              }
            }
          }
        });
      }
`;

// Insert newVillageUpdateCode into update loop right after updateBeginnerTrainingInteraction
const updateTargetMarker = 'updateBeginnerTrainingInteraction(game);';
if (code.includes(updateTargetMarker)) {
  const uIdx = code.indexOf(updateTargetMarker);
  const uEndIdx = uIdx + updateTargetMarker.length;
  code = code.substring(0, uEndIdx) + '\n' + newVillageUpdateCode + code.substring(uEndIdx);
  console.log("✅ Added update interactions for lore tablets, shortcuts, and waterwheel to village loop!");
} else {
  console.error("Could not find updateBeginnerTrainingInteraction in game-enhancer.js");
}

fs.writeFileSync(enhancerPath, code, 'utf8');
console.log("🎉 Successfully updated game-enhancer.js with Grand Bear & Cat Village Expansion!");
