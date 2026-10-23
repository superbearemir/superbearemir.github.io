// ============================================================================
// 🌟 8. BÖLÜM: EFSANEVİ ALTIN CENNETİ UZATILMIŞ GENİŞLETMESİ
// - ORİJİNAL ALTIN CENNETİ KORUNDU (z: 90 -> -340)
// - 14 YENİ UZUN VE DETAYLI ALTIN AŞAMASI (z: -360 -> -3500)
// - 9 ÖZEL YENİ ALTIN / SEMAVİ CANLI VE DÜŞMAN
// - BOSS: BÖLÜMÜN EN SONUNA (14. Aşama Altın Kolezyumu, z: -3400) TAŞINDI:
//     * İmparator Dev Altın Para Bossu orijinal modeli, taç ve mücevherleriyle korundu!
//     * Arkasında 9. Bölüm: Tarih Öncesi Dinozor Dünyası ("dinosaur_world") zafer portalı açılır!
// ============================================================================

(function() {
  'use strict';

  console.log("🌟 [Golden Sanctuary Expansion] 14 Yeni Aşama ve 9 Yeni Canlı Yükleniyor...");

  let goldenExtensionGroup = null;
  let activeGoldenProjectiles = [];
  let goldenMovingSlabs = [];
  let goldenCrumblingCrusts = [];
  let goldenFireMills = [];
  let goldenLightLasers = [];
  let goldenFallingIcicles = [];
  let goldenJumpPads = [];
  let activeGoldBoss = null;
  let goldenVictoryPortal = null;
  let totalTime = 0;

  function cleanUpGoldenSanctuaryExtension() {
    if (goldenExtensionGroup && goldenExtensionGroup.parent) {
      goldenExtensionGroup.parent.remove(goldenExtensionGroup);
    }
    goldenExtensionGroup = null;
    activeGoldenProjectiles = [];
    goldenMovingSlabs = [];
    goldenCrumblingCrusts = [];
    goldenFireMills = [];
    goldenLightLasers = [];
    goldenFallingIcicles = [];
    goldenJumpPads = [];
    activeGoldBoss = null;
    goldenVictoryPortal = null;
  }

  // =========================================================================
  // MAIN GOLDEN SANCTUARY POPULATOR (14 EXTENDED STAGES)
  // =========================================================================
  window.__populateGoldenSanctuaryExtension = function(game) {
    if (!window.THREE || !game || !game.scene) return;
    const THREE = window.THREE;

    console.log("🌟 [Golden Sanctuary] 14 Yeni Uzun Aşama, 9 Canlı ve Taşınan Altın Boss Kuruluyor...");
    cleanUpGoldenSanctuaryExtension();

    // Extend level bounds to allow deep traversal down to z: -3800
    if (game.currentLevel && game.currentLevel.bounds) {
      game.currentLevel.bounds.minZ = -3900;
      game.currentLevel.bounds.maxZ = 250;
      game.currentLevel.bounds.minX = -500;
      game.currentLevel.bounds.maxX = 500;
      game.currentLevel.bounds.minY = -60;
      game.currentLevel.bounds.maxY = 450;
    }

    goldenExtensionGroup = new THREE.Group();
    goldenExtensionGroup.name = "golden_sanctuary_14_stages_extension";
    game.scene.add(goldenExtensionGroup);

    const collidables = game.currentLevel.colliders = game.currentLevel.colliders || [];
    const enemies = game.currentLevel.enemies = game.currentLevel.enemies || [];

    // Materials
    const polishedGoldMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.92,
      roughness: 0.2,
      emissive: 0x713f12,
      emissiveIntensity: 0.2
    });
    const darkGoldBrickMat = new THREE.MeshStandardMaterial({
      color: 0xca8a04,
      metalness: 0.75,
      roughness: 0.4
    });
    const celestialCrystalMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.85,
      emissive: 0xfacc15,
      emissiveIntensity: 0.4
    });
    const royalAmberMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.6,
      roughness: 0.3
    });
    const glowingSunMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xd97706,
      emissiveIntensity: 1.2
    });

    function buildGoldPlatform(w, h, d, px, py, pz, mat, isHazard = false) {
      const platGroup = new THREE.Group();
      platGroup.position.set(px, py, pz);
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat || polishedGoldMat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      platGroup.add(mesh);

      if (!isHazard) {
        const rim = new THREE.Mesh(new THREE.BoxGeometry(w * 0.96, 0.1, d * 0.96), glowingSunMat);
        rim.position.y = h / 2 + 0.05;
        platGroup.add(rim);
      }

      goldenExtensionGroup.add(platGroup);
      collidables.push({
        min: new THREE.Vector3(px - w / 2, py - h / 2, pz - d / 2),
        max: new THREE.Vector3(px + w / 2, py + h / 2 + 0.15, pz + d / 2),
        isToxic: isHazard
      });
      return platGroup;
    }

    function addGoldItem(id, x, y, z, isGem = false) {
      if (typeof window.create3DGoldCoin === 'function' && !isGem) {
        const coin = window.create3DGoldCoin(x, y, z, 30);
        if (coin) goldenExtensionGroup.add(coin);
      } else {
        const geom = isGem ? new THREE.OctahedronGeometry(0.65) : new THREE.CylinderGeometry(0.45, 0.45, 0.18, 12);
        const mesh = new THREE.Mesh(geom, isGem ? celestialCrystalMat : polishedGoldMat);
        mesh.position.set(x, y, z);
        goldenExtensionGroup.add(mesh);
      }
    }

    function addCheckpoint(id, name, x, y, z) {
      const cpMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 1.1 });
      const cpMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.0, 0.35, 16), cpMat);
      cpMesh.position.set(x, y + 0.18, z);
      goldenExtensionGroup.add(cpMesh);

      const flag = new THREE.Mesh(new THREE.ConeGeometry(0.4, 2.0, 8), celestialCrystalMat);
      flag.position.set(x, y + 1.35, z);
      goldenExtensionGroup.add(flag);

      game.currentLevel.checkpoints.push({
        id: id,
        name: name,
        pos: new THREE.Vector3(x, y + 1.5, z)
      });
    }

    function addSunJumpPad(x, y, z, boostPower = 28) {
      const padMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xeab308, emissiveIntensity: 1.6 });
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.2, 0.4, 16), padMat);
      pad.position.set(x, y + 0.2, z);
      goldenExtensionGroup.add(pad);

      goldenJumpPads.push({
        pos: new THREE.Vector3(x, y, z),
        power: boostPower
      });
    }

    // =========================================================================
    // 🌉 BİRLEŞTİRME KÖPRÜSÜ: Orijinal Cennet (z: -340, Y: 61) -> 14 Aşamaya Geçiş
    // =========================================================================
    buildGoldPlatform(18, 2.5, 30, 0, 61.0, -355, polishedGoldMat);
    // Celestial Gate
    const gatePillarL = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 14, 16), polishedGoldMat);
    gatePillarL.position.set(-8, 68.0, -355);
    goldenExtensionGroup.add(gatePillarL);
    const gatePillarR = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 14, 16), polishedGoldMat);
    gatePillarR.position.set(8, 68.0, -355);
    goldenExtensionGroup.add(gatePillarR);
    const gateTop = new THREE.Mesh(new THREE.BoxGeometry(18, 1.8, 2.8), royalAmberMat);
    gateTop.position.set(0, 75.0, -355);
    goldenExtensionGroup.add(gateTop);

    if (typeof window.createThematicEntranceEasel === 'function') {
      window.createThematicEntranceEasel(
        game,
        2,
        "🌟 Efsanevi Altın Cenneti: 14 Yeni Aşama Geçidi!\nİmparator Dev Altın Para Bossu bölümün sonundaki arenada seni bekliyor!",
        0,
        63.5,
        -352
      );
    }

    // =========================================================================
    // 14 UZUN VE ZENGİN ALTIN AŞAMASI (z: -370 -> -3500)
    // =========================================================================

    // 1. Aşama: Altın Güneş Yolu & Kristal Kemerler (z: -370 -> -580, Y: 61 -> 65)
    addCheckpoint("gold_cp_s1", "1. Aşama: Altın Güneş Yolu & Kemerler", 0, 61.8, -380);
    buildGoldPlatform(24, 2.0, 26, 0, 61.0, -380, polishedGoldMat);
    buildGoldPlatform(16, 1.8, 32, 0, 61.6, -410, darkGoldBrickMat);
    buildGoldPlatform(18, 1.8, 32, 4, 62.2, -445, polishedGoldMat);
    buildGoldPlatform(16, 1.8, 32, -4, 62.8, -480, darkGoldBrickMat);
    buildGoldPlatform(18, 1.8, 32, 0, 63.4, -515, polishedGoldMat);
    buildGoldPlatform(16, 1.8, 30, 5, 64.0, -550, celestialCrystalMat);
    buildGoldPlatform(22, 2.2, 26, 0, 64.6, -580, polishedGoldMat);
    addGoldItem("g_c1_0", 0, 64.0, -445, true);
    createGoldenStoneGolem(0, 65.0, -480, enemies, goldenExtensionGroup);

    // 2. Aşama: Yüzen Som Altın Basamakları (z: -580 -> -790, Y: 65 -> 69)
    addCheckpoint("gold_cp_s2", "2. Aşama: Yüzen Som Altın Basamakları", 0, 65.2, -590);
    buildGoldPlatform(20, 2.0, 20, 0, 64.6, -590, darkGoldBrickMat);
    [-620, -650, -680, -710, -740, -770].forEach((sz, idx) => {
      const sx = (idx % 2 === 0 ? 5.5 : -5.5);
      const sy = 65.2 + idx * 0.7;
      buildGoldPlatform(12, 1.8, 14, sx, sy, sz, polishedGoldMat);
      addGoldItem("g_c2_" + idx, sx, sy + 1.8, sz, idx === 2);
    });
    buildGoldPlatform(22, 2.2, 24, 0, 69.8, -790, polishedGoldMat);
    createSunPhoenix(0, 75.0, -680, enemies, goldenExtensionGroup);

    // 3. Aşama: Dönen Altın Çarklar & Işık Kılıçları (z: -790 -> -1000, Y: 69 -> 73)
    addCheckpoint("gold_cp_s3", "3. Aşama: Dönen Altın Çarklar", 0, 70.5, -800);
    buildGoldPlatform(22, 2.0, 22, 0, 69.8, -800, darkGoldBrickMat);
    buildGoldPlatform(14, 1.8, 30, 0, 70.4, -830, polishedGoldMat);
    // Gold Wheel 1
    const gw1 = new THREE.Group();
    gw1.position.set(0, 72.0, -870);
    for (let b = 0; b < 4; b++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(14, 0.4, 2.2), glowingSunMat);
      blade.rotation.y = (b / 4) * Math.PI * 2;
      gw1.add(blade);
    }
    goldenExtensionGroup.add(gw1);
    goldenFireMills.push({ group: gw1, speed: 1.5 });
    buildGoldPlatform(16, 2.0, 22, 0, 71.2, -870, darkGoldBrickMat);

    buildGoldPlatform(14, 1.8, 30, -5, 71.8, -910, polishedGoldMat);
    // Gold Wheel 2
    const gw2 = new THREE.Group();
    gw2.position.set(0, 73.5, -950);
    for (let b = 0; b < 4; b++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(14, 0.4, 2.2), glowingSunMat);
      blade.rotation.y = (b / 4) * Math.PI * 2;
      gw2.add(blade);
    }
    goldenExtensionGroup.add(gw2);
    goldenFireMills.push({ group: gw2, speed: -1.7 });
    buildGoldPlatform(16, 2.0, 22, 0, 72.6, -950, darkGoldBrickMat);
    buildGoldPlatform(22, 2.2, 24, 0, 73.5, -1000, polishedGoldMat);
    createSacredScorpion(0, 74.5, -910, enemies, goldenExtensionGroup);

    // 4. Aşama: Çöken Safir ve Altın Plakaları (z: -1000 -> -1210, Y: 73 -> 77)
    addCheckpoint("gold_cp_s4", "4. Aşama: Çöken Safir ve Altın Plakalar", 0, 74.2, -1010);
    buildGoldPlatform(22, 2.0, 22, 0, 73.5, -1010, darkGoldBrickMat);
    [-1040, -1070, -1100, -1130, -1160, -1190].forEach((cz, cIdx) => {
      const cx = (cIdx % 2 === 0 ? 5.0 : -5.0);
      const cy = 74.0 + cIdx * 0.7;
      const cMesh = new THREE.Mesh(new THREE.BoxGeometry(10, 1.4, 12), celestialCrystalMat);
      cMesh.position.set(cx, cy, cz);
      goldenExtensionGroup.add(cMesh);
      const coll = {
        min: new THREE.Vector3(cx - 5.0, cy - 0.7, cz - 6.0),
        max: new THREE.Vector3(cx + 5.0, cy + 0.85, cz + 6.0)
      };
      collidables.push(coll);
      goldenCrumblingCrusts.push({
        mesh: cMesh,
        baseY: cy,
        coll: coll,
        stepped: false,
        dropTimer: 0.8,
        fallSpeed: 0,
        respawnTimer: 0
      });
      addGoldItem("g_c4_" + cIdx, cx, cy + 1.8, cz);
    });
    buildGoldPlatform(22, 2.2, 24, 0, 78.2, -1210, polishedGoldMat);
    createHolyLightWisp(0, 80.0, -1100, enemies, goldenExtensionGroup);

    // 5. Aşama: Kutsal Işık Gayzerleri & Yüksek Zıplama (z: -1210 -> -1420, Y: 77 -> 83)
    addCheckpoint("gold_cp_s5", "5. Aşama: Kutsal Işık Gayzerleri", 0, 78.8, -1220);
    buildGoldPlatform(22, 2.0, 22, 0, 78.2, -1220, polishedGoldMat);
    addSunJumpPad(0, 79.0, -1220, 32);
    buildGoldPlatform(16, 2.0, 20, 0, 86.0, -1260, darkGoldBrickMat);
    buildGoldPlatform(14, 1.8, 22, -6, 84.0, -1295, polishedGoldMat);
    addSunJumpPad(-6, 85.0, -1295, 30);
    buildGoldPlatform(16, 2.0, 20, 0, 92.0, -1335, darkGoldBrickMat);
    buildGoldPlatform(14, 1.8, 22, 6, 90.0, -1370, polishedGoldMat);
    addSunJumpPad(6, 91.0, -1370, 30);
    buildGoldPlatform(16, 2.0, 20, 0, 97.0, -1400, darkGoldBrickMat);
    buildGoldPlatform(24, 2.2, 24, 0, 83.0, -1420, polishedGoldMat);
    createSunGuardKnight(0, 84.0, -1335, enemies, goldenExtensionGroup);

    // 6. Aşama: Işıltılı Anka Koridoru (z: -1420 -> -1630, Y: 83 -> 87)
    addCheckpoint("gold_cp_s6", "6. Aşama: Işıltılı Anka Koridoru", 0, 83.8, -1430);
    buildGoldPlatform(22, 2.0, 22, 0, 83.0, -1430, darkGoldBrickMat);
    [-1460, -1490, -1520, -1550, -1580, -1610].forEach((jz, jIdx) => {
      const jx = (jIdx % 2 === 0 ? 5.0 : -5.0);
      const jy = 83.5 + jIdx * 0.6;
      buildGoldPlatform(13, 1.8, 16, jx, jy, jz, polishedGoldMat);
      addGoldItem("g_c6_" + jIdx, jx, jy + 1.8, jz);
    });
    buildGoldPlatform(22, 2.2, 24, 0, 87.2, -1630, polishedGoldMat);
    createGoldButterfly(0, 89.0, -1520, enemies, goldenExtensionGroup);

    // 7. Aşama: Dar Altın Kirişleri & Denge Terasları (z: -1630 -> -1840, Y: 87 -> 91)
    addCheckpoint("gold_cp_s7", "7. Aşama: Dar Altın Kirişleri", 0, 87.8, -1640);
    buildGoldPlatform(22, 2.0, 22, 0, 87.2, -1640, darkGoldBrickMat);
    buildGoldPlatform(4, 2.0, 36, 0, 87.8, -1675, royalAmberMat);
    buildGoldPlatform(12, 2.0, 14, 0, 88.5, -1710, polishedGoldMat);
    buildGoldPlatform(4, 2.0, 36, -5, 89.2, -1745, royalAmberMat);
    buildGoldPlatform(12, 2.0, 14, -5, 89.8, -1780, polishedGoldMat);
    buildGoldPlatform(4, 2.0, 36, 5, 90.4, -1815, royalAmberMat);
    buildGoldPlatform(22, 2.2, 24, 0, 91.0, -1840, polishedGoldMat);
    createGoldSandWyrm(0, 92.5, -1745, enemies, goldenExtensionGroup);

    // 8. Aşama: Hareketli Güneş Sarayı Blokları (z: -1840 -> -2050, Y: 91 -> 95)
    addCheckpoint("gold_cp_s8", "8. Aşama: Hareketli Güneş Blokları", 0, 91.8, -1850);
    buildGoldPlatform(22, 2.0, 22, 0, 91.0, -1850, darkGoldBrickMat);
    [-1885, -1920, -1955, -1990, -2025].forEach((mz, mIdx) => {
      const my = 91.5 + mIdx * 0.7;
      const sMesh = new THREE.Mesh(new THREE.BoxGeometry(10, 1.8, 12), polishedGoldMat);
      sMesh.position.set(0, my, mz);
      goldenExtensionGroup.add(sMesh);
      const coll = {
        min: new THREE.Vector3(-5.0, my - 0.9, mz - 6.0),
        max: new THREE.Vector3(5.0, my + 1.05, mz + 6.0)
      };
      collidables.push(coll);
      goldenMovingSlabs.push({
        mesh: sMesh,
        baseX: 0,
        rangeX: 8.5,
        speed: 1.8 + mIdx * 0.25,
        offset: mIdx * 1.2,
        halfW: 5.0,
        coll: coll
      });
      addGoldItem("g_c8_" + mIdx, 0, my + 1.8, mz);
    });
    buildGoldPlatform(22, 2.2, 24, 0, 95.2, -2050, polishedGoldMat);
    createLightPrism(0, 97.0, -1955, enemies, goldenExtensionGroup);

    // 9. Aşama: Düşen Altın Kristal Sarkıtlar Tüneli (z: -2050 -> -2260, Y: 95 -> 99)
    addCheckpoint("gold_cp_s9", "9. Aşama: Düşen Altın Kristaller", 0, 95.8, -2060);
    buildGoldPlatform(22, 2.0, 22, 0, 95.2, -2060, darkGoldBrickMat);
    [-2095, -2125, -2155, -2185, -2215, -2245].forEach((iz, iIdx) => {
      const ix = (iIdx % 2 === 0 ? 4.5 : -4.5);
      const iy = 95.8 + iIdx * 0.6;
      buildGoldPlatform(12, 1.8, 14, ix, iy, iz, polishedGoldMat);
      const spikeGeo = new THREE.ConeGeometry(1.2, 4.5, 8);
      spikeGeo.rotateX(Math.PI);
      const spikeMesh = new THREE.Mesh(spikeGeo, glowingSunMat);
      spikeMesh.position.set(ix, iy + 16, iz);
      goldenExtensionGroup.add(spikeMesh);
      goldenFallingIcicles.push({
        mesh: spikeMesh,
        x: ix,
        z: iz,
        targetY: iy + 1.0,
        triggered: false,
        fallSpeed: 0
      });
      addGoldItem("g_c9_" + iIdx, ix, iy + 1.8, iz);
    });
    buildGoldPlatform(22, 2.2, 24, 0, 99.5, -2260, polishedGoldMat);
    createCelestialAngel(0, 101.5, -2155, enemies, goldenExtensionGroup);

    // 10. Aşama: Altın Kum Fırtınası & Girdaplı Rampalar (z: -2260 -> -2470, Y: 99 -> 103)
    addCheckpoint("gold_cp_s10", "10. Aşama: Altın Kum Fırtınası", 0, 100.0, -2270);
    buildGoldPlatform(22, 2.0, 22, 0, 99.5, -2270, darkGoldBrickMat);
    buildGoldPlatform(14, 1.8, 30, -5, 100.2, -2305, polishedGoldMat);
    buildGoldPlatform(16, 2.0, 20, 5, 101.0, -2340, darkGoldBrickMat);
    buildGoldPlatform(14, 1.8, 30, -5, 101.8, -2375, polishedGoldMat);
    buildGoldPlatform(16, 2.0, 20, 5, 102.6, -2410, darkGoldBrickMat);
    buildGoldPlatform(22, 2.2, 24, 0, 103.5, -2470, polishedGoldMat);
    createSolarSphinxGuardian(0, 105.0, -2375, enemies, goldenExtensionGroup);

    // 11. Aşama: Yüksek Zıplama Altın Kalkanları (z: -2470 -> -2680, Y: 103 -> 109)
    addCheckpoint("gold_cp_s11", "11. Aşama: Zıplama Kalkanları", 0, 104.0, -2480);
    buildGoldPlatform(22, 2.0, 22, 0, 103.5, -2480, polishedGoldMat);
    addSunJumpPad(0, 104.0, -2480, 32);
    buildGoldPlatform(14, 2.0, 16, 0, 112.0, -2515, darkGoldBrickMat);
    buildGoldPlatform(12, 1.8, 14, 6, 110.0, -2550, polishedGoldMat);
    addSunJumpPad(6, 111.0, -2550, 30);
    buildGoldPlatform(14, 2.0, 16, 0, 118.0, -2585, darkGoldBrickMat);
    buildGoldPlatform(12, 1.8, 14, -6, 116.0, -2620, polishedGoldMat);
    addSunJumpPad(-6, 117.0, -2620, 30);
    buildGoldPlatform(14, 2.0, 16, 0, 122.0, -2650, darkGoldBrickMat);
    buildGoldPlatform(24, 2.2, 24, 0, 109.0, -2680, polishedGoldMat);
    createAmberColossusMinotaur(0, 110.5, -2585, enemies, goldenExtensionGroup);

    // 12. Aşama: Kutsal Işık Lazerleri Izgarası (z: -2680 -> -2890, Y: 109 -> 113)
    addCheckpoint("gold_cp_s12", "12. Aşama: Kutsal Işık Lazerleri", 0, 109.8, -2690);
    buildGoldPlatform(22, 2.0, 22, 0, 109.0, -2690, darkGoldBrickMat);
    [-2720, -2755, -2790, -2825, -2860].forEach((lz, lIdx) => {
      const ly = 109.6 + lIdx * 0.8;
      buildGoldPlatform(14, 1.8, 18, 0, ly, lz, polishedGoldMat);
      const laserGrp = new THREE.Group();
      laserGrp.position.set(0, ly + 2.0, lz);
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 16), glowingSunMat);
      beam.rotation.z = Math.PI / 2;
      laserGrp.add(beam);
      goldenExtensionGroup.add(laserGrp);
      goldenLightLasers.push({
        mesh: laserGrp,
        y: ly + 2.0,
        z: lz,
        range: 8.0,
        speed: (lIdx % 2 === 0 ? 2.0 : -2.0)
      });
      addGoldItem("g_c12_" + lIdx, 0, ly + 1.8, lz, true);
    });
    buildGoldPlatform(22, 2.2, 24, 0, 113.5, -2890, polishedGoldMat);
    createRadiantSeraphArchon(0, 115.0, -2790, enemies, goldenExtensionGroup);

    // 13. Aşama: Eriyip Yenilenen Altın Plakalar (z: -2890 -> -3110, Y: 113 -> 117)
    addCheckpoint("gold_cp_s13", "13. Aşama: Eriyip Yenilenen Altın Plakalar", 0, 114.2, -2900);
    buildGoldPlatform(22, 2.0, 22, 0, 113.5, -2900, darkGoldBrickMat);
    [-2930, -2960, -2990, -3020, -3050, -3080].forEach((cz, cIdx) => {
      const cx = (cIdx % 2 === 0 ? 5.5 : -5.5);
      const cy = 114.0 + cIdx * 0.7;
      const cMesh = new THREE.Mesh(new THREE.BoxGeometry(10, 1.4, 12), celestialCrystalMat);
      cMesh.position.set(cx, cy, cz);
      goldenExtensionGroup.add(cMesh);
      const coll = {
        min: new THREE.Vector3(cx - 5.0, cy - 0.7, cz - 6.0),
        max: new THREE.Vector3(cx + 5.0, cy + 0.85, cz + 6.0)
      };
      collidables.push(coll);
      goldenCrumblingCrusts.push({
        mesh: cMesh,
        baseY: cy,
        coll: coll,
        stepped: false,
        dropTimer: 0.7,
        fallSpeed: 0,
        respawnTimer: 0
      });
      addGoldItem("g_c13_" + cIdx, cx, cy + 1.8, cz);
    });
    buildGoldPlatform(22, 2.2, 24, 0, 118.5, -3110, polishedGoldMat);
    createImperialAnubisPaladin(0, 120.0, -3020, enemies, goldenExtensionGroup);

    // 14. Aşama: [BÜYÜK BOSS] BÖLÜMÜN EN SONUNDAKİ İMPARATORLUK ALTIN KOLEZYUMU 👑 (z: -3150 -> -3500)
    const arenaX = 0;
    const arenaY = 117.0;
    const arenaZ = -3380;

    addCheckpoint("gold_cp_s14", "14. Aşama: [BÜYÜK BOSS] İmparatorluk Altın Kolezyumu 👑", 0, arenaY + 1.2, -3160);

    // Grand Golden Colosseum Arena Platform
    buildGoldPlatform(72, 4.0, 88, arenaX, arenaY, arenaZ, polishedGoldMat);
    const arenaRim = new THREE.Mesh(new THREE.BoxGeometry(74, 0.2, 90), glowingSunMat);
    arenaRim.position.set(arenaX, arenaY + 2.05, arenaZ);
    goldenExtensionGroup.add(arenaRim);

    // 14 Ornate Corinthian Pillars around Colosseum
    for (let p = 0; p < 14; p++) {
      const angle = (p / 14) * Math.PI * 2;
      const px = arenaX + Math.cos(angle) * 34;
      const pz = arenaZ + Math.sin(angle) * 40;
      buildGoldPlatform(3.5, 26, 3.5, px, arenaY + 13.0, pz, darkGoldBrickMat);
      const topOrb = new THREE.Mesh(new THREE.SphereGeometry(2.0, 12, 12), celestialCrystalMat);
      topOrb.position.set(px, arenaY + 26.5, pz);
      goldenExtensionGroup.add(topOrb);
    }

    if (typeof window.createThematicEntranceEasel === 'function') {
      window.createThematicEntranceEasel(
        game,
        2,
        "👑 İMPARATORLUK ALTIN KOLEZYUMU!\nİmparator Dev Altın Para Bossu'nu mağlup et ve 9. Bölüm Dinozor Dünyası portalından geç!",
        0,
        arenaY + 2.5,
        arenaZ + 38
      );
    }

    // RELOCATED GOLD COIN BOSS AT SECTION END
    if (typeof window.createGoldCoinBoss === 'function') {
      const bossData = window.createGoldCoinBoss(game, new THREE.Vector3(arenaX, arenaY + 1.0, arenaZ));
      goldenExtensionGroup.add(bossData.mesh);
      game.currentLevel.goldCoinBoss = bossData;
      activeGoldBoss = bossData;
      if (typeof window.updateGoldCoinBossHealthBar === 'function') {
        window.updateGoldCoinBossHealthBar(0, bossData.maxHp);
      }
    }

    // Victory Portal behind Gold Boss (9. Bölüm Dinozor Dünyası'na açılır)
    goldenVictoryPortal = createGoldenVictoryPortal(arenaX, arenaY + 2.2, arenaZ - 44, goldenExtensionGroup);

    console.log("✅ [Golden Sanctuary] 14 Yeni Aşama, 13 Benzersiz Semavi Canlı ve Taşınan Boss Başarıyla Kuruldu!");
  };

  // =========================================================================
  // 13 ÖZEL YENİ ALTIN / SEMAVİ CANLI VE MERMİ MEKANİĞİ
  // =========================================================================

  function createGoldenStoneGolem(x, y, z, enemies, group) {
    createCelestialCreature(x, y, z, enemies, group, "Altın Taş Golemi 🗿✨", 0xffd700, 0xfef08a, 0, 1.3, 180, 18, 0);
  }
  function createSunPhoenix(x, y, z, enemies, group) {
    createCelestialCreature(x, y, z, enemies, group, "Güneş Ankası 🦅🔥", 0xf59e0b, 0xfde047, 1, 1.2, 105, 14, 4);
  }
  function createSacredScorpion(x, y, z, enemies, group) {
    createCelestialCreature(x, y, z, enemies, group, "Kutsal Altın Akrebi 🦂✨", 0xca8a04, 0xfef08a, 2, 1.2, 135, 16, 0);
  }
  function createHolyLightWisp(x, y, z, enemies, group) {
    createCelestialCreature(x, y, z, enemies, group, "Kutsal Işık Şamanı ☀️🧙‍♂️", 0xeab308, 0x38bdf8, 3, 1.15, 110, 14, 2);
  }
  function createSunGuardKnight(x, y, z, enemies, group) {
    createCelestialCreature(x, y, z, enemies, group, "Güneş Muhafız Şövalyesi 🛡️⚔️", 0xfacc15, 0xffffff, 9, 1.25, 165, 18, 0);
  }
  function createGoldButterfly(x, y, z, enemies, group) {
    createCelestialCreature(x, y, z, enemies, group, "Işıltılı Altın Kelebeği 🦋✨", 0xfbbf24, 0x38bdf8, 12, 1.15, 95, 13, 4);
  }
  function createGoldSandWyrm(x, y, z, enemies, group) {
    createCelestialCreature(x, y, z, enemies, group, "Altın Kum Ejder-Yılanı 🐍✨", 0xd97706, 0xfef08a, 5, 1.25, 150, 16, 1);
  }
  function createLightPrism(x, y, z, enemies, group) {
    createCelestialCreature(x, y, z, enemies, group, "Kristal Işık Prizması 💎✨", 0x38bdf8, 0xfacc15, 8, 1.2, 135, 15, 4);
  }
  function createCelestialAngel(x, y, z, enemies, group) {
    createCelestialCreature(x, y, z, enemies, group, "Semavi Kanatlı Savaşçı 👼⚔️", 0xf8fafc, 0xfacc15, 13, 1.25, 185, 19, 4);
  }
  function createSolarSphinxGuardian(x, y, z, enemies, group) {
    createCelestialCreature(x, y, z, enemies, group, "Güneş Sfenks Panteri 🦁✨", 0xb45309, 0xfde047, 4, 1.25, 175, 18, 1);
  }
  function createAmberColossusMinotaur(x, y, z, enemies, group) {
    createCelestialCreature(x, y, z, enemies, group, "Kehribar Boynuzlu Minotor 🐂✨", 0x92400e, 0xfacc15, 11, 1.3, 195, 19, 0);
  }
  function createRadiantSeraphArchon(x, y, z, enemies, group) {
    createCelestialCreature(x, y, z, enemies, group, "Sekiz Bacaklı Altın Tarantula 🕷️✨", 0xeab308, 0x38bdf8, 7, 1.2, 180, 19, 2);
  }
  function createImperialAnubisPaladin(x, y, z, enemies, group) {
    createCelestialCreature(x, y, z, enemies, group, "İmparatorluk Hilal Muhafızı ⚔️👑", 0xca8a04, 0xffffff, 17, 1.25, 200, 20, 0);
  }

  function createCelestialCreature(x, y, z, enemies, group, name, color, accentColor, variantIdx, scale, hp, atk, moveMode) {
    const THREE = window.THREE;
    const grp = (typeof window.__buildDistinctCreatureMesh === 'function')
      ? window.__buildDistinctCreatureMesh(THREE, variantIdx, { primaryColor: color, accentColor: accentColor, scale: scale })
      : new THREE.Group();
    grp.position.set(x, y, z);
    group.add(grp);

    enemies.push({
      id: "gold_" + variantIdx + "_" + Math.round(z),
      type: "celestial_beast_" + variantIdx,
      name: name,
      mesh: grp,
      pos: new THREE.Vector3(x, y, z),
      baseX: x,
      baseY: y,
      baseZ: z,
      hp: hp,
      maxHp: hp,
      attackPower: atk,
      _moveMode: moveMode,
      _projTheme: { color: color, glow: accentColor, shape: 'crystal', speed: 20, dmg: atk },
      update: function(dt, p, game) {
        if (typeof window.__updateCreatureCombatAI === 'function') {
          window.__updateCreatureCombatAI(this, dt, p, game, variantIdx);
        }
        if (p && this.pos.distanceTo(p) < 2.4) {
          game.damagePlayer(this.attackPower);
        }
      }
    });
  }

  function createGoldenVictoryPortal(x, y, z, group) {
    const THREE = window.THREE;
    const portalGrp = new THREE.Group();
    portalGrp.name = "golden_stage14_victory_portal";
    portalGrp.position.set(x, y, z);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.8, 0.5, 16, 32),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x16a34a, emissiveIntensity: 2.0 })
    );
    ring.position.y = 3.8;
    portalGrp.add(ring);

    group.add(portalGrp);

    return {
      mesh: portalGrp,
      pos: new THREE.Vector3(x, y, z),
      targetRegion: "dinosaur_world"
    };
  }

  // =========================================================================
  // UPDATE TICK LOOP
  // =========================================================================
  function updateGoldenSanctuaryExtension(dt) {
    const game = window.__superBearGame;
    if (!game || game.currentRegion !== 'golden_sanctuary') return;
    totalTime += dt;

    // Moving Slabs
    goldenMovingSlabs.forEach(s => {
      const offX = Math.sin(totalTime * s.speed + (s.offset || 0)) * s.rangeX;
      s.mesh.position.x = s.baseX + offX;
      if (s.coll) {
        const hw = s.halfW || 5.0;
        s.coll.min.x = s.baseX + offX - hw;
        s.coll.max.x = s.baseX + offX + hw;
      }
    });

    // Crumbling Crusts
    if (game.playerPos) {
      goldenCrumblingCrusts.forEach(cp => {
        if (!cp.stepped) {
          const d = Math.hypot(game.playerPos.x - cp.mesh.position.x, game.playerPos.z - cp.mesh.position.z);
          if (d < 3.2 && Math.abs(game.playerPos.y - cp.baseY) < 1.6) cp.stepped = true;
        } else if (cp.dropTimer > 0) {
          cp.dropTimer -= dt;
          cp.mesh.position.x += (Math.random() - 0.5) * 0.15;
          if (cp.dropTimer <= 0 && cp.coll) cp.coll.min.y = -999;
        } else {
          cp.fallSpeed += dt * 30.0;
          cp.mesh.position.y -= cp.fallSpeed * dt;
          cp.respawnTimer += dt;
          if (cp.respawnTimer > 4.5) {
            cp.stepped = false;
            cp.dropTimer = 0.7;
            cp.fallSpeed = 0;
            cp.respawnTimer = 0;
            cp.mesh.position.y = cp.baseY;
            if (cp.coll) cp.coll.min.y = cp.baseY - 0.7;
          }
        }
      });
    }

    // Fire Mills
    goldenFireMills.forEach(fm => {
      fm.group.rotation.y += dt * fm.speed;
      if (game.playerPos && fm.group.position.distanceTo(game.playerPos) < 3.5) {
        game.damagePlayer(18);
      }
    });

    // Light Lasers
    goldenLightLasers.forEach(ml => {
      ml.mesh.rotation.y += dt * ml.speed;
      if (game.playerPos) {
        const d = Math.hypot(game.playerPos.x - ml.mesh.position.x, game.playerPos.z - ml.z);
        if (d < (ml.range || 8.0) && Math.abs(game.playerPos.y - ml.y) < 1.8) {
          game.damagePlayer(18);
        }
      }
    });

    // Falling Spikes
    if (game.playerPos) {
      goldenFallingIcicles.forEach(ic => {
        if (!ic.triggered) {
          const d = Math.hypot(game.playerPos.x - ic.x, game.playerPos.z - ic.z);
          if (d < 4.0) ic.triggered = true;
        } else if (ic.mesh.position.y > ic.targetY) {
          ic.fallSpeed += dt * 35.0;
          ic.mesh.position.y -= ic.fallSpeed * dt;
          if (ic.mesh.position.distanceTo(game.playerPos) < 2.5) {
            game.damagePlayer(18);
          }
        }
      });
    }

    // Sun Jump Pads
    if (game.playerPos && goldenJumpPads.length > 0) {
      goldenJumpPads.forEach(jp => {
        const d = Math.hypot(game.playerPos.x - jp.pos.x, game.playerPos.z - jp.pos.z);
        if (d < 2.2 && Math.abs(game.playerPos.y - jp.pos.y) < 1.4) {
          if (game.playerVel) {
            game.playerVel.y = jp.power || 30.0;
            if (window.St && window.St.playJump) window.St.playJump();
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("✨ Güneş Sıçrayışı!", "info");
            }
          }
        }
      });
    }

    // Victory Portal Interaction (Transitions to 9. Dinosaur World)
    if (goldenVictoryPortal && game.playerPos) {
      goldenVictoryPortal.mesh.rotation.y += dt * 0.9;
      const d = goldenVictoryPortal.pos.distanceTo(game.playerPos);
      if (d < 5.0) {
        const boss = game.currentLevel && game.currentLevel.goldCoinBoss;
        const isBossAlive = boss && boss.hp > 0;

        if (isBossAlive && !game._bossDefeatedInCurrentRegion) {
          const now = Date.now();
          if (!goldenVictoryPortal._lastNotice || now - goldenVictoryPortal._lastNotice > 2500) {
            goldenVictoryPortal._lastNotice = now;
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("⚠️ Dinozor Dünyası portalından geçmek için önce İmparator Altın Para Bossu'nu yenmelisin! ⚔️", "warning");
            }
          }
        } else {
          if (!goldenVictoryPortal._triggered) {
            goldenVictoryPortal._triggered = true;
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("🌀 9. Bölüm: Tarih Öncesi Dinozor Dünyası'na Geçiliyor! 🦖", "success");
            }
            if (window.St && window.St.playGoalFanfare) window.St.playGoalFanfare();
            setTimeout(() => {
              game.loadRegion("dinosaur_world");
            }, 800);
          }
        }
      }
    }
  }

  // Hook into update loop
  const tickerInterval = setInterval(() => {
    if (window.__superBearGame) {
      if (!window.__superBearGame._goldenTickerHooked) {
        window.__superBearGame._goldenTickerHooked = true;
        const origUpdate = window.__superBearGame.update;
        window.__superBearGame.update = function(dt, totalTime) {
          origUpdate.call(this, dt, totalTime);
          try {
            updateGoldenSanctuaryExtension(dt);
          } catch(err) {}
        };
      }
      clearInterval(tickerInterval);
    }
  }, 100);

  window.__cleanUpGoldenSanctuaryExtension = cleanUpGoldenSanctuaryExtension;
  window.__updateGoldenSanctuaryExtension = updateGoldenSanctuaryExtension;

  console.log("🌟 [Golden Sanctuary Extension] 14-Stage Fully Extended Script Loaded!");
})();
