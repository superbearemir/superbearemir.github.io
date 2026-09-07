const fs = require("fs");

console.log("🚀 Patching game-enhancer.js with Chapter 13: Yıkılmış Köy & Palyaço Boss...");

let enhancer = fs.readFileSync("public/game-enhancer.js", "utf8");

const ruinVillageCode = `
// =================================----------------------------
// 13. BÖLÜM: YIKILMIŞ KÖY & JOKEROOMS PALYAÇO BOSS (Elleri & Ayakları Var!)
// =================================----------------------------

function create3DWarningSign(THREE, x, y, z, titleText, detailText) {
  const signGroup = new THREE.Group();
  signGroup.position.set(x, y, z);

  // Wooden Post
  const postMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 3.8, 8), postMat);
  post.position.y = 1.9;
  signGroup.add(post);

  // Bright Yellow Warning Board with Red Border
  const boardMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
  const borderMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3, emissive: 0x991b1b, emissiveIntensity: 0.4 });
  
  const board = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.2, 0.25), boardMat);
  board.position.y = 3.2;
  signGroup.add(board);

  const border = new THREE.Mesh(new THREE.BoxGeometry(3.8, 2.4, 0.2), borderMat);
  border.position.set(0, 3.2, -0.05);
  signGroup.add(border);

  // Red Warning Skull / Emblem
  const emblemMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.8 });
  const emblem = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.9, 3), emblemMat);
  emblem.position.set(0, 4.7, 0);
  emblem.rotation.z = Math.PI;
  signGroup.add(emblem);

  signGroup.userData = {
    title: titleText,
    detail: detailText,
    isWarningSign: true
  };

  return signGroup;
}

function createClownBossMesh(THREE) {
  const clownGroup = new THREE.Group();
  clownGroup.name = "clown_boss_group";

  // Materials
  const faceMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  const noseMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.8 });
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1 });
  const mouthMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.2 });
  const suitMat = new THREE.MeshStandardMaterial({ color: 0x9333ea, roughness: 0.4 });
  const polkaMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 });
  const bowtieMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.3 });
  const hairCyanMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.5 });
  const hairRedMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.5 });
  const gloveWhiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
  const shoeRedMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });
  const shoeYellowMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.3 });

  // 1. HEAD
  const head = new THREE.Mesh(new THREE.SphereGeometry(1.6, 20, 20), faceMat);
  head.position.y = 5.2;
  clownGroup.add(head);

  // Big Red Nose 🔴
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 16), noseMat);
  nose.position.set(0, 5.2, 1.45);
  clownGroup.add(nose);

  // Painted Star Eyes
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), eyeMat);
  eyeL.position.set(-0.55, 5.6, 1.35);
  clownGroup.add(eyeL);
  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), eyeMat);
  eyeR.position.set(0.55, 5.6, 1.35);
  clownGroup.add(eyeR);

  // Wide Smiling Red Mouth with Sharp Teeth
  const mouth = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.35, 0.4), mouthMat);
  mouth.position.set(0, 4.6, 1.4);
  clownGroup.add(mouth);

  // Frizzy Afro Hair Tufts
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2;
    const isCyan = i % 2 === 0;
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.65, 10, 10), isCyan ? hairCyanMat : hairRedMat);
    puff.position.set(Math.cos(angle) * 1.5, 5.6 + Math.sin(angle) * 0.4, Math.sin(angle) * 1.5);
    clownGroup.add(puff);
  }

  // Party Cone Hat with Jingle Bell
  const hat = new THREE.Mesh(new THREE.ConeGeometry(0.8, 1.8, 12), polkaMat);
  hat.position.set(0, 6.9, 0);
  hat.rotation.x = -0.15;
  clownGroup.add(hat);

  const bell = new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 10), shoeYellowMat);
  bell.position.set(0, 7.8, -0.2);
  clownGroup.add(bell);

  // 2. TORSO & BOW TIE
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.2, 1.8), suitMat);
  body.position.y = 2.8;
  clownGroup.add(body);

  // Bowtie
  const bowL = new THREE.Mesh(new THREE.ConeGeometry(0.6, 0.8, 4), bowtieMat);
  bowL.position.set(-0.6, 4.1, 1.0);
  bowL.rotation.z = Math.PI / 2;
  clownGroup.add(bowL);

  const bowR = new THREE.Mesh(new THREE.ConeGeometry(0.6, 0.8, 4), bowtieMat);
  bowR.position.set(0.6, 4.1, 1.0);
  bowR.rotation.z = -Math.PI / 2;
  clownGroup.add(bowR);

  const bowCenter = new THREE.Mesh(new THREE.SphereGeometry(0.3, 10, 10), polkaMat);
  bowCenter.position.set(0, 4.1, 1.05);
  clownGroup.add(bowCenter);

  // 3. ELLERİ (ARMS & 5-FINGERED WHITE GLOVED HANDS) - Requirement: "elleri olsun"
  const createGlovedArm = (isLeft) => {
    const armGroup = new THREE.Group();
    armGroup.name = isLeft ? "clown_arm_left" : "clown_arm_right";

    // Shoulder & Arm
    const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 1.8, 10), suitMat);
    sleeve.position.y = -0.9;
    armGroup.add(sleeve);

    // Glove Cuff Ring
    const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.15, 8, 16), gloveWhiteMat);
    cuff.position.y = -1.8;
    cuff.rotation.x = Math.PI / 2;
    armGroup.add(cuff);

    // Palm Hand Mesh
    const palm = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.85, 0.5), gloveWhiteMat);
    palm.position.y = -2.3;
    armGroup.add(palm);

    // 5 Fingers
    for (let f = 0; f < 4; f++) {
      const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.6, 8), gloveWhiteMat);
      finger.position.set(-0.3 + f * 0.2, -2.8, 0);
      armGroup.add(finger);
    }
    // Thumb
    const thumb = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.55, 8), gloveWhiteMat);
    thumb.position.set(isLeft ? 0.45 : -0.45, -2.4, 0.2);
    thumb.rotation.z = isLeft ? -0.6 : 0.6;
    armGroup.add(thumb);

    armGroup.position.set(isLeft ? -1.6 : 1.6, 4.0, 0);
    return armGroup;
  };

  const armL = createGlovedArm(true);
  const armR = createGlovedArm(false);
  clownGroup.add(armL);
  clownGroup.add(armR);

  // 4. AYAKLARI (LEGS & GIANT FLOPPY CLOWN SHOES) - Requirement: "ayakları olsun"
  const createClownLeg = (isLeft) => {
    const legGroup = new THREE.Group();
    legGroup.name = isLeft ? "clown_leg_left" : "clown_leg_right";

    // Pant Leg
    const pant = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 1.8, 10), polkaMat);
    pant.position.y = -0.9;
    legGroup.add(pant);

    // GIANT FLOPPY CLOWN SHOE (KOCAMAN PALYAÇO AYAKKABISI/AYAKLARI)
    const shoeGroup = new THREE.Group();
    shoeGroup.position.set(0, -1.8, 0.5);

    // Heel / Back of shoe
    const shoeBack = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.8, 1.2), shoeRedMat);
    shoeGroup.add(shoeBack);

    // Oversized Bulbous Toe Front
    const shoeToe = new THREE.Mesh(new THREE.SphereGeometry(0.7, 14, 14), shoeRedMat);
    shoeToe.scale.set(1.1, 0.8, 1.5);
    shoeToe.position.set(0, -0.05, 0.9);
    shoeGroup.add(shoeToe);

    // Yellow Shoe Laces & Sole
    const sole = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.2, 2.4), shoeYellowMat);
    sole.position.set(0, -0.45, 0.4);
    shoeGroup.add(sole);

    legGroup.add(shoeGroup);
    legGroup.position.set(isLeft ? -0.8 : 0.8, 1.2, 0);
    return legGroup;
  };

  const legL = createClownLeg(true);
  const legR = createClownLeg(false);
  clownGroup.add(legL);
  clownGroup.add(legR);

  // Scale Boss to Giant Size (3.2x)
  clownGroup.scale.set(3.2, 3.2, 3.2);

  return clownGroup;
}

let ruinVillagePopulated = false;

function populateRuinVillage(game) {
  if (game && game.currentLevel) ensureLevelArrays(game.currentLevel);

  const THREE = window.THREE;
  if (!game || !game.scene) return;

  console.log("🏚️ Initializing 13. Bölüm: Yıkılmış Köy & Jokerooms Palyaço Boss...");

  if (game.currentLevel) {
    if (game.currentLevel.sceneGroup && game.currentLevel.sceneGroup.parent) {
      game.currentLevel.sceneGroup.parent.remove(game.currentLevel.sceneGroup);
    }
    if (game.currentLevel.mesh && game.currentLevel.mesh.parent) {
      game.currentLevel.mesh.parent.remove(game.currentLevel.mesh);
    }
  }

  const ruinGroup = new THREE.Group();
  ruinGroup.name = "ruin_village_level_mesh";
  game.scene.add(ruinGroup);

  game.currentLevel = {
    sceneGroup: ruinGroup,
    mesh: ruinGroup,
    colliders: [],
    collectibles: [],
    enemies: [],
    checkpoints: [],
    spawnPoint: new THREE.Vector3(0, 2.0, 80),
    jumpPads: [],
    warningSigns: [],
    movingPlatforms: [],
    fallingPlatforms: [],
    clownBoss: null
  };

  // Dark Burnt Sky & Dense Ash Fog
  game.scene.background = new THREE.Color(0x2d1313);
  game.scene.fog = new THREE.FogExp2(0x2a1717, 0.015);

  // Materials
  const stoneRuinMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 });
  const darkBrickMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.95 });
  const burntWoodMat = new THREE.MeshStandardMaterial({ color: 0x292524, roughness: 0.9 });
  const lavaMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.8 });
  const acidMat = new THREE.MeshStandardMaterial({ color: 0x84cc16, emissive: 0x4d7c0f, emissiveIntensity: 0.6 });

  // Helper: Create Platform
  const addPlat = (x, y, z, w, h, d, mat = stoneRuinMat) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    ruinGroup.add(mesh);
    game.currentLevel.colliders.push({
      min: new THREE.Vector3(x - w / 2, y - h / 2, z - d / 2),
      max: new THREE.Vector3(x + w / 2, y + h / 2, z + d / 2)
    });
    return mesh;
  };

  // Helper: Warning Sign Add
  const addWarningSign = (x, y, z, title, detail) => {
    const signMesh = create3DWarningSign(THREE, x, y, z, title, detail);
    ruinGroup.add(signMesh);
    game.currentLevel.warningSigns.push({
      mesh: signMesh,
      pos: new THREE.Vector3(x, y, z),
      title: title,
      detail: detail
    });
  };

  // Helper: Jump Pad / Geyser
  const addGeyser = (x, y, z, boostForce = 24) => {
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2.0, 0.8, 16), lavaMat);
    pad.position.set(x, y, z);
    ruinGroup.add(pad);
    const core = new THREE.Mesh(new THREE.SphereGeometry(1.0, 12, 12), new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
    core.position.set(x, y + 0.4, z);
    ruinGroup.add(core);
    game.currentLevel.jumpPads.push({
      pos: new THREE.Vector3(x, y, z),
      boostForce: boostForce
    });
  };

  // -------------------------------------------------------------
  // ZONE 1: ENTRANCE ARCH & ACID SLIME SPRING (z = 90 to 40)
  // -------------------------------------------------------------
  // Spawn platform
  addPlat(0, 1, 80, 20, 2, 20, stoneRuinMat);

  // TABELA 1 (GİRİŞ UYARISI)
  addWarningSign(0, 2.0, 76, "⚠️ UYARI TABELASI 1", "⚠️ BU PARKURDAN SAKIN GEÇMEYİN! BURASI GÜVENSİZ YIKILMIŞ KÖY! İLERİDE ÇÖKEN TAŞLAR VE ASİT ÇUKURUYOR!");

  // Ruined Village Gate Arch
  const archL = new THREE.Mesh(new THREE.BoxGeometry(2, 8, 2), darkBrickMat);
  archL.position.set(-6, 5, 70);
  ruinGroup.add(archL);
  const archR = new THREE.Mesh(new THREE.BoxGeometry(2, 8, 2), darkBrickMat);
  archR.position.set(6, 5, 70);
  ruinGroup.add(archR);
  const archTop = new THREE.Mesh(new THREE.BoxGeometry(14, 2, 2), darkBrickMat);
  archTop.position.set(0, 9, 70);
  ruinGroup.add(archTop);

  // Toxic Acid Floor below
  const acidFloor = new THREE.Mesh(new THREE.BoxGeometry(200, 1, 400), acidMat);
  acidFloor.position.set(0, -6, -50);
  ruinGroup.add(acidFloor);

  // Stepping stones across acid pit (z = 60 to 40)
  addPlat(0, 1.5, 60, 6, 1.5, 6, burntWoodMat);
  addPlat(-5, 2.0, 52, 5, 1.5, 5, stoneRuinMat);
  addPlat(5, 2.5, 44, 5, 1.5, 5, stoneRuinMat);
  addPlat(0, 3.0, 36, 16, 2, 12, stoneRuinMat);

  // Checkpoint 1
  const cp1Pos = new THREE.Vector3(0, 4.2, 36);
  const cp1Visual = createCheckpointVisual(THREE, cp1Pos);
  ruinGroup.add(cp1Visual);
  game.currentLevel.checkpoints.push({ id: 'ruin_cp_1', name: '1. Yıkık Çatılar Girişi', pos: cp1Pos, active: true, mesh: cp1Visual });

  // -------------------------------------------------------------
  // ZONE 2: SLANTED RUINED ROOFS & CHIMNEYS (z = 30 to -30)
  // -------------------------------------------------------------
  // TABELA 2 (ÇATI UYARISI)
  addWarningSign(0, 4.2, 32, "🚨 UYARI TABELASI 2", "🚨 DİKKAT! YIKILAN ÇATILAR VE DÖNEN BIÇAKLAR! SAKIN İLERLEMEYİN, GERİ DÖNÜN!");

  // Slanted Roof 1
  const roof1 = addPlat(-6, 5.0, 22, 12, 1.0, 10, burntWoodMat);
  roof1.rotation.z = 0.2;

  // Narrow Chimney Beam
  addPlat(0, 6.5, 12, 4, 1.2, 10, darkBrickMat);

  // Slanted Roof 2
  const roof2 = addPlat(6, 8.0, 2, 12, 1.0, 10, burntWoodMat);
  roof2.rotation.z = -0.2;

  // Crumbling Chimney Pillar
  addPlat(0, 9.5, -8, 5, 1.5, 5, darkBrickMat);

  // High Observation Ledge
  addPlat(0, 11.0, -20, 18, 2, 16, stoneRuinMat);

  // Checkpoint 2
  const cp2Pos = new THREE.Vector3(0, 12.2, -20);
  const cp2Visual = createCheckpointVisual(THREE, cp2Pos);
  ruinGroup.add(cp2Visual);
  game.currentLevel.checkpoints.push({ id: 'ruin_cp_2', name: '2. Lav Uçurumu İskelesi', pos: cp2Pos, active: false, mesh: cp2Visual });

  // -------------------------------------------------------------
  // ZONE 3: MOLTEN LAVA CHASM & LAUNCH GEYSERS (z = -30 to -100)
  // -------------------------------------------------------------
  // TABELA 3 (LAV UÇURUMU UYARISI)
  addWarningSign(0, 12.2, -24, "⚠️ UYARI TABELASI 3", "⚠️ UYARI: BURADAN SONRASI JOKEROOMS CIRCUS ARENA! GİRMEK ÇOK TEHLİKELİDİR!");

  // Geyser launch pad to clear giant chasm!
  addGeyser(0, 12.2, -20, 26);

  // High Floating Island 1
  addPlat(0, 20.0, -50, 14, 2, 14, stoneRuinMat);

  // Stepping Island 2
  addPlat(-8, 23.0, -66, 6, 1.5, 6, burntWoodMat);

  // Stepping Island 3
  addPlat(8, 26.0, -82, 6, 1.5, 6, burntWoodMat);

  // Checkpoint 3 (Bell Tower Base)
  addPlat(0, 28.0, -98, 18, 2, 16, stoneRuinMat);
  const cp3Pos = new THREE.Vector3(0, 29.2, -98);
  const cp3Visual = createCheckpointVisual(THREE, cp3Pos);
  ruinGroup.add(cp3Visual);
  game.currentLevel.checkpoints.push({ id: 'ruin_cp_3', name: '3. Çan Kulesi Tırmanış Girişi', pos: cp3Pos, active: false, mesh: cp3Visual });

  // -------------------------------------------------------------
  // ZONE 4: TWISTED BELL TOWER SPIRAL (z = -100 to -170)
  // -------------------------------------------------------------
  // Bell Tower Core Pillar
  const towerCore = new THREE.Mesh(new THREE.CylinderGeometry(4, 5, 40, 12), darkBrickMat);
  towerCore.position.set(0, 48.0, -135);
  ruinGroup.add(towerCore);

  // Spiral Steps around Tower
  for (let i = 0; i < 12; i++) {
    const ang = (i / 12) * Math.PI * 2;
    const sx = Math.cos(ang) * 9;
    const sz = -135 + Math.sin(ang) * 9;
    const sy = 29.5 + (i * 1.8);
    addPlat(sx, sy, sz, 4, 1.0, 4, stoneRuinMat);
  }

  // High Summit Launch Platform
  addPlat(0, 52.0, -165, 20, 2, 20, stoneRuinMat);

  // MEGA GEYSER TO LAUNCH INTO JOKEROOMS CIRCUS ARENA!
  addGeyser(0, 53.2, -165, 30);

  // -------------------------------------------------------------
  // ZONE 5: JOKEROOMS CIRCUS GATE & BOSS ARENA (z = -180 to -260)
  // -------------------------------------------------------------
  // Entrance Archway to Circus Arena
  const circusArchL = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.8, 12, 8), darkBrickMat);
  circusArchL.position.set(-10, 62.0, -200);
  ruinGroup.add(circusArchL);
  const circusArchR = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.8, 12, 8), darkBrickMat);
  circusArchR.position.set(10, 62.0, -200);
  ruinGroup.add(circusArchR);
  const circusArchTop = new THREE.Mesh(new THREE.BoxGeometry(22, 2.0, 3.0), lavaMat);
  circusArchTop.position.set(0, 68.0, -200);
  ruinGroup.add(circusArchTop);

  // TABELA 4 (SON UYARI)
  addWarningSign(0, 58.2, -196, "🤡 SON UYARI TABELASI 4", "🤡 SON UYARI: JOKEROOMS CIRCUS ARENASI! DEV PALYAÇO BOSS SENİ BEKLİYOR! KAÇIŞ YOK!");

  // Checkpoint 4 (Boss Arena Entry)
  addPlat(0, 58.0, -200, 24, 2, 16, stoneRuinMat);
  const cp4Pos = new THREE.Vector3(0, 59.2, -200);
  const cp4Visual = createCheckpointVisual(THREE, cp4Pos);
  ruinGroup.add(cp4Visual);
  game.currentLevel.checkpoints.push({ id: 'ruin_cp_4', name: '4. Jokerooms Palyaço Arenası Girişi', pos: cp4Pos, active: false, mesh: cp4Visual });

  // GIANT JOKEROOMS CIRCUS ARENA PLATFORM (z = -245)
  const arenaX = 0, arenaY = 58.0, arenaZ = -245;
  addPlat(arenaX, arenaY, arenaZ, 80, 4, 80, stoneRuinMat);

  // Glowing Circus Floor Ring
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x9333ea, emissive: 0x7e22ce, emissiveIntensity: 0.8 });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(32, 1.2, 12, 32), ringMat);
  ring.position.set(arenaX, arenaY + 2.1, arenaZ);
  ring.rotation.x = Math.PI / 2;
  ruinGroup.add(ring);

  // Position Player at Spawn
  if (game.playerPos) game.playerPos.set(0, 3.0, 80);
  if (game.playerVel) game.playerVel.set(0, 0, 0);

  // -------------------------------------------------------------
  // BOSS: JOKEROOMS DEV PALYAÇO BOSS (Elleri & Ayakları Var!)
  // -------------------------------------------------------------
  const clownBossMesh = createClownBossMesh(THREE);
  const bossPos = new THREE.Vector3(arenaX, arenaY + 2.0, arenaZ);
  clownBossMesh.position.copy(bossPos);
  ruinGroup.add(clownBossMesh);

  game.currentLevel.clownBoss = {
    id: 'boss_joker_clown',
    type: 'joker_clown_boss',
    name: 'Jokerooms Dev Palyaço Boss (Elleri & Ayakları Var 🤡)',
    mesh: clownBossMesh,
    pos: bossPos,
    hp: 1000,
    maxHp: 1000,
    attackPower: 20,
    isBoss: true,
    attackCooldown: 0,
    animTimer: 0,
    deadMessageShown: false
  };

  game.currentLevel.enemies.push(game.currentLevel.clownBoss);

  if (game.callbacks && game.callbacks.onShowNotice) {
    game.callbacks.onShowNotice("🏚️ 13. Bölüm: Yıkılmış Köy! Tabelalardaki uyarılara aldırmadan zorlu parkurları geç!", "success");
  }
}

function teleportToRuinVillage() {
  const game = window.__superBearGame;
  if (!game || !game.scene) return;
  if (game.loadRegion) {
    game.loadRegion('ruin_village');
  } else {
    game.currentRegion = 'ruin_village';
    populateRuinVillage(game);
  }
}

// Window Event Listeners for Ruin Village
window.addEventListener('superbear:teleport-ruin-village', () => {
  teleportToRuinVillage();
});
`;

// Insert ruinVillageCode into game-enhancer.js before enhanceGame() call or API
if (!enhancer.includes('13. BÖLÜM: YIKILMIŞ KÖY')) {
  const insertPos = enhancer.indexOf('function enhanceGame()');
  if (insertPos !== -1) {
    enhancer = enhancer.substring(0, insertPos) + ruinVillageCode + "\n\n" + enhancer.substring(insertPos);
    console.log("✅ Added populateRuinVillage & Clown Boss code to game-enhancer.js");
  }
}

// Expose teleportToRuinVillage in window.__superBearSpaceEnhancer
if (!enhancer.includes('teleportToRuinVillage')) {
  const jokeroomsExpose = 'teleportToJokerooms,';
  const newRuinExpose = 'teleportToJokerooms,\n    teleportToRuinVillage,';
  if (enhancer.includes(jokeroomsExpose)) {
    enhancer = enhancer.replace(jokeroomsExpose, newRuinExpose);
    console.log("✅ Exposed teleportToRuinVillage in __superBearSpaceEnhancer API.");
  }
}

// Proximity Warning Signs check loop inside updateSpaceLoop
const warningCheckCode = `
    // Ruin Village Warning Signs & Clown Boss Loop
    if (game.currentRegion === 'ruin_village' && game.currentLevel) {
      const pPos = game.playerPos;
      const dt = 0.016;

      // Warning Signs Proximity
      if (pPos && game.currentLevel.warningSigns) {
        (game.currentLevel.warningSigns || []).forEach(sign => {
          if (pPos.distanceTo(sign.pos) < 6.0) {
            if (game.callbacks && game.callbacks.onShowNotice && Date.now() % 3500 < 50) {
              game.callbacks.onShowNotice(\`📜 \${sign.title}: '\${sign.detail}'\`, "warn");
            }
          }
        });
      }

      // Clown Boss Loop
      if (game.currentLevel.clownBoss) {
        const boss = game.currentLevel.clownBoss;
        if (boss.hp > 0 && pPos) {
          boss.animTimer = (boss.animTimer || 0) + dt * 4.0;

          // Swing Gloved Hands Animation
          const armL = boss.mesh.getObjectByName('clown_arm_left');
          const armR = boss.mesh.getObjectByName('clown_arm_right');
          if (armL) armL.rotation.z = Math.sin(boss.animTimer) * 0.4;
          if (armR) armR.rotation.z = -Math.sin(boss.animTimer) * 0.4;

          // Stomp Giant Red Feet Animation
          const legL = boss.mesh.getObjectByName('clown_leg_left');
          const legR = boss.mesh.getObjectByName('clown_leg_right');
          if (legL) legL.position.y = 1.2 + Math.sin(boss.animTimer * 1.5) * 0.3;
          if (legR) legR.position.y = 1.2 - Math.sin(boss.animTimer * 1.5) * 0.3;

          const dist = boss.pos.distanceTo(pPos);
          if (dist < 45) {
            boss.mesh.rotation.y = Math.atan2(pPos.x - boss.pos.x, pPos.z - boss.pos.z);

            if (boss.attackCooldown <= 0) {
              boss.attackCooldown = 2.4;
              createFireball(game, boss.pos, pPos);
              if (game.callbacks && game.callbacks.onShowNotice && Math.random() < 0.3) {
                game.callbacks.onShowNotice("🤡 JOKEROOMS PALYAÇO: Hahaha! Parkurları geçtin ama ellerimden ve ayaklarımdan kaçamazsın!", "warn");
              }
            } else {
              boss.attackCooldown -= dt;
            }
          }
        } else if (boss.hp <= 0 && !boss.deadMessageShown) {
          boss.deadMessageShown = true;
          if (game.callbacks && game.callbacks.onShowNotice) {
            game.callbacks.onShowNotice("🏆 JOKEROOMS PALYAÇO BOSS MAĞLUP EDİLDİ! 🏚️ 13. Kutsal Yıkıntı & Cesaret Bal Kristali Kurtarıldı!", "success");
          }
          if (game.gainCoins) game.gainCoins(500);
          if (game.gainXp) game.gainXp(800);
          if (game.spawnBossPortalForCurrentRegion) {
            game.spawnBossPortalForCurrentRegion(boss.pos);
          }
        }
      }
    }
`;

if (!enhancer.includes('Ruin Village Warning Signs & Clown Boss Loop')) {
  const loopPos = enhancer.indexOf('requestAnimationFrame(updateSpaceLoop);');
  if (loopPos !== -1) {
    enhancer = enhancer.substring(0, loopPos) + warningCheckCode + "\n  " + enhancer.substring(loopPos);
    console.log("✅ Added Warning Signs & Clown Boss loop to updateSpaceLoop.");
  }
}

fs.writeFileSync("public/game-enhancer.js", enhancer, "utf8");
console.log("🎉 game-enhancer.js updated successfully!");
