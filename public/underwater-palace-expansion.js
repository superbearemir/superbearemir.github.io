// ============================================================================
// 🌊 7. BÖLÜM: ANTİK SU ALTI KRİSTAL SARAYI BİRLEŞİK GENİŞLETMESİ
// - ORİJİNAL ANTİK SU SARAYI KORUNDU (z: 0 -> -540): Mermer sütunlar, su bıçakları, kristaller!
// - 17 YENİ UZUN VE DETAYLI SU ALTI AŞAMASIYLA BİRLEŞTİRİLDİ (z: -560 -> -4350)
// - 10 ÖZEL YENİ DENİZ CANLISI VE ÖZGÜN MEKANİKLER
// - BOSS: BÖLÜMÜN EN SONUNA (17. Aşama Arenası, z: -4220) TAŞINDI:
//     * Dev Neptün Kraken orijinal mor modeli, 8 kolu ve gözleriyle korundu!
//     * Oturduğunda tamamen hareketsiz kalır ve tüm vuruşlardan hasar alır!
//     * Arkasında 8. Bölüm Altın Cenneti ("golden_sanctuary") zafer portalı açılır!
// ============================================================================

(function() {
  'use strict';

  console.log("🌊 [Underwater Palace Combined Extension] Orijinal Saray + 17 Uzun Aşama Başlatılıyor...");

  let underwaterExtensionGroup = null;
  let activeWaterProjectiles = [];
  let underwaterMovingSlabs = [];
  let underwaterCrumblingCrusts = [];
  let underwaterWaterMills = [];
  let underwaterCrystalLasers = [];
  let underwaterFallingIcicles = [];
  let underwaterBubblePads = [];
  let activeKrakenBoss = null;
  let underwaterVictoryPortal = null;
  let totalTime = 0;

  function cleanUpUnderwaterPalaceExtension() {
    if (underwaterExtensionGroup && underwaterExtensionGroup.parent) {
      underwaterExtensionGroup.parent.remove(underwaterExtensionGroup);
    }
    underwaterExtensionGroup = null;
    activeWaterProjectiles = [];
    underwaterMovingSlabs = [];
    underwaterCrumblingCrusts = [];
    underwaterWaterMills = [];
    underwaterCrystalLasers = [];
    underwaterFallingIcicles = [];
    underwaterBubblePads = [];
    activeKrakenBoss = null;
    underwaterVictoryPortal = null;
  }

  // =========================================================================
  // MAIN UNDERWATER PALACE POPULATOR (COMBINED ORIGINAL + 17 EXPANSIVE STAGES)
  // =========================================================================
  window.__populateUnderwaterPalaceExtension = function(game) {
    if (!window.THREE || !game || !game.scene) return;
    const THREE = window.THREE;

    console.log("🌊 [Underwater Palace] Orijinal Saray korunuyor ve 17 yeni aşamayla birleştiriliyor...");
    cleanUpUnderwaterPalaceExtension();

    // Extend level bounds to allow deep traversal down to z: -4600
    if (game.currentLevel) {
      game.currentLevel.bounds = {
        minZ: -4600,
        maxZ: 250,
        minX: -500,
        maxX: 500,
        minY: -60,
        maxY: 450
      };
      if (!game.currentLevel.colliders) game.currentLevel.colliders = [];
      if (!game.currentLevel.enemies) game.currentLevel.enemies = [];
      if (!game.currentLevel.collectibles) game.currentLevel.collectibles = [];
      if (!game.currentLevel.jumpPads) game.currentLevel.jumpPads = [];
      if (!game.currentLevel.checkpoints) game.currentLevel.checkpoints = [];
      if (!game.currentLevel.waterProjectiles) game.currentLevel.waterProjectiles = [];
    }

    // Atmosphere
    game.scene.background = new THREE.Color(0x0284c7);
    game.scene.fog = new THREE.FogExp2(0x0284c7, 0.0035);

    underwaterExtensionGroup = new THREE.Group();
    underwaterExtensionGroup.name = "underwater_palace_17_stages_extension";
    game.scene.add(underwaterExtensionGroup);

    const collidables = game.currentLevel.colliders;
    const enemies = game.currentLevel.enemies;

    // Materials
    const marbleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3, metalness: 0.2 });
    const aquaCrystalMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0891b2, emissiveIntensity: 1.1, transparent: true, opacity: 0.88 });
    const coralPinkMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xe11d48, emissiveIntensity: 0.5 });
    const neonCyanMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 1.2 });
    const pearlWhiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });
    const goldOrnamentMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xd97706, emissiveIntensity: 0.8 });

    function buildOceanPlatform(w, h, d, px, py, pz, mat, isHazard = false) {
      const platGroup = new THREE.Group();
      platGroup.position.set(px, py, pz);
      const stoneMesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat || marbleMat);
      stoneMesh.castShadow = true;
      stoneMesh.receiveShadow = true;
      platGroup.add(stoneMesh);

      if (!isHazard) {
        const rim = new THREE.Mesh(new THREE.BoxGeometry(w * 0.96, 0.1, d * 0.96), neonCyanMat);
        rim.position.y = h / 2 + 0.05;
        platGroup.add(rim);
      }

      underwaterExtensionGroup.add(platGroup);
      collidables.push({
        min: new THREE.Vector3(px - w / 2, py - h / 2, pz - d / 2),
        max: new THREE.Vector3(px + w / 2, py + h / 2 + 0.15, pz + d / 2),
        isToxic: isHazard
      });
      return platGroup;
    }

    function addOceanItem(id, x, y, z, isGem = false) {
      if (typeof window.create3DGoldCoin === 'function' && !isGem) {
        const coin = window.create3DGoldCoin(x, y, z, 25);
        if (coin) underwaterExtensionGroup.add(coin);
      } else {
        const geom = isGem ? new THREE.OctahedronGeometry(0.6) : new THREE.CylinderGeometry(0.4, 0.4, 0.15, 12);
        const mesh = new THREE.Mesh(geom, isGem ? aquaCrystalMat : pearlWhiteMat);
        mesh.position.set(x, y, z);
        underwaterExtensionGroup.add(mesh);
      }
    }

    function addCheckpoint(id, name, x, y, z) {
      const cpMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, emissive: 0x0369a1, emissiveIntensity: 1.0 });
      const cpMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.0, 0.35, 16), cpMat);
      cpMesh.position.set(x, y + 0.18, z);
      underwaterExtensionGroup.add(cpMesh);

      const flag = new THREE.Mesh(new THREE.ConeGeometry(0.4, 2.0, 8), aquaCrystalMat);
      flag.position.set(x, y + 1.35, z);
      underwaterExtensionGroup.add(flag);

      game.currentLevel.checkpoints.push({
        id: id,
        name: name,
        pos: new THREE.Vector3(x, y + 1.5, z)
      });
    }

    function addBubbleJumpPad(x, y, z, boostPower = 28) {
      const padMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0ea5e9, emissiveIntensity: 1.5, transparent: true, opacity: 0.85 });
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.2, 0.4, 16), padMat);
      pad.position.set(x, y + 0.2, z);
      underwaterExtensionGroup.add(pad);

      underwaterBubblePads.push({
        pos: new THREE.Vector3(x, y, z),
        power: boostPower
      });
    }

    // =========================================================================
    // 🌉 BİRLEŞTİRME KÖPRÜSÜ: Orijinal Sarayın Sonu (z: -540, Y: 72) -> 17 Aşamaya Geçiş
    // =========================================================================
    const transBridge = buildOceanPlatform(18, 2.5, 30, 0, 72.0, -555, goldOrnamentMat);
    // Grand Coral Portal Arch
    const archPillarL = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 12, 16), aquaCrystalMat);
    archPillarL.position.set(-8, 78.0, -555);
    underwaterExtensionGroup.add(archPillarL);
    const archPillarR = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 12, 16), aquaCrystalMat);
    archPillarR.position.set(8, 78.0, -555);
    underwaterExtensionGroup.add(archPillarR);
    const archTop = new THREE.Mesh(new THREE.BoxGeometry(18, 1.5, 2.5), coralPinkMat);
    archTop.position.set(0, 84.0, -555);
    underwaterExtensionGroup.add(archTop);

    if (typeof window.createThematicEntranceEasel === 'function') {
      window.createThematicEntranceEasel(
        game,
        1,
        "🌊 Antik Su Altı Kristal Sarayı: 17 Yeni Aşama Geçidi!\nDev Kraken bölümün sonundaki Yüce Arenada seni bekliyor!",
        0,
        74.5,
        -552
      );
    }

    // =========================================================================
    // 17 UZUN VE DETAYLI SU ALTI AŞAMASI (z: -570 -> -4350)
    // =========================================================================

    // 1. Aşama: Antik Mercan Koridoru & Lüminesans Rampalar (z: -570 -> -790, Y: 72 -> 76)
    addCheckpoint("uw_cp_s1", "1. Aşama: Antik Mercan Koridoru & Rampalar", 0, 72.8, -580);
    buildOceanPlatform(24, 2.0, 26, 0, 72.0, -580, marbleMat);
    buildOceanPlatform(16, 1.8, 32, 0, 72.6, -610, aquaCrystalMat);
    buildOceanPlatform(18, 1.8, 32, 4, 73.2, -645, marbleMat);
    buildOceanPlatform(16, 1.8, 32, -4, 73.8, -680, aquaCrystalMat);
    buildOceanPlatform(18, 1.8, 32, 0, 74.4, -715, marbleMat);
    buildOceanPlatform(16, 1.8, 30, 5, 75.0, -750, aquaCrystalMat);
    buildOceanPlatform(22, 2.2, 26, 0, 75.6, -785, marbleMat);
    addOceanItem("uw_c1_0", 0, 75.0, -645, true);
    createLuminescentJellyfish(0, 76.5, -680, enemies, underwaterExtensionGroup);

    // 2. Aşama: Yüzen Su Kabarcığı Adacıkları (z: -790 -> -1010, Y: 76 -> 80)
    addCheckpoint("uw_cp_s2", "2. Aşama: Yüzen Su Kabarcığı Adacıkları", 0, 76.2, -800);
    buildOceanPlatform(20, 2.0, 20, 0, 75.6, -800, marbleMat);
    [-830, -860, -890, -920, -950, -980].forEach((sz, idx) => {
      const sx = (idx % 2 === 0 ? 5.5 : -5.5);
      const sy = 76.2 + idx * 0.7;
      buildOceanPlatform(12, 1.8, 14, sx, sy, sz, aquaCrystalMat);
      addOceanItem("uw_c2_" + idx, sx, sy + 1.8, sz, idx === 2);
    });
    buildOceanPlatform(22, 2.2, 24, 0, 80.8, -1010, marbleMat);
    createHunterShark(0, 81.5, -890, enemies, underwaterExtensionGroup);

    // 3. Aşama: Dönen Deniz Çarkları & Akıntı Koridoru (z: -1010 -> -1230, Y: 80 -> 84)
    addCheckpoint("uw_cp_s3", "3. Aşama: Dönen Deniz Çarkları", 0, 81.5, -1020);
    buildOceanPlatform(22, 2.0, 22, 0, 80.8, -1020, marbleMat);
    buildOceanPlatform(14, 1.8, 30, 0, 81.4, -1050, aquaCrystalMat);
    // Mill 1
    const wm1 = new THREE.Group();
    wm1.position.set(0, 83.0, -1090);
    for (let b = 0; b < 4; b++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(14, 0.4, 2.2), coralPinkMat);
      blade.rotation.y = (b / 4) * Math.PI * 2;
      wm1.add(blade);
    }
    underwaterExtensionGroup.add(wm1);
    underwaterWaterMills.push({ group: wm1, speed: 1.5 });
    buildOceanPlatform(16, 2.0, 22, 0, 82.2, -1090, marbleMat);

    buildOceanPlatform(14, 1.8, 30, -5, 82.8, -1130, aquaCrystalMat);
    // Mill 2
    const wm2 = new THREE.Group();
    wm2.position.set(0, 84.5, -1170);
    for (let b = 0; b < 4; b++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(14, 0.4, 2.2), coralPinkMat);
      blade.rotation.y = (b / 4) * Math.PI * 2;
      wm2.add(blade);
    }
    underwaterExtensionGroup.add(wm2);
    underwaterWaterMills.push({ group: wm2, speed: -1.7 });
    buildOceanPlatform(16, 2.0, 22, 0, 83.6, -1170, marbleMat);
    buildOceanPlatform(22, 2.2, 24, 0, 84.5, -1220, marbleMat);
    createCoralTortoise(0, 85.5, -1130, enemies, underwaterExtensionGroup);

    // 4. Aşama: Eriyip Çözülen Deniz Tabanı Taşları (z: -1230 -> -1450, Y: 84 -> 88)
    addCheckpoint("uw_cp_s4", "4. Aşama: Eriyip Çözülen Deniz Tabanı Taşları", 0, 85.2, -1240);
    buildOceanPlatform(22, 2.0, 22, 0, 84.5, -1240, marbleMat);
    [-1270, -1300, -1330, -1360, -1390, -1420].forEach((cz, cIdx) => {
      const cx = (cIdx % 2 === 0 ? 5.0 : -5.0);
      const cy = 85.0 + cIdx * 0.7;
      const cMesh = new THREE.Mesh(new THREE.BoxGeometry(10, 1.4, 12), pearlWhiteMat);
      cMesh.position.set(cx, cy, cz);
      underwaterExtensionGroup.add(cMesh);
      const coll = {
        min: new THREE.Vector3(cx - 5.0, cy - 0.7, cz - 6.0),
        max: new THREE.Vector3(cx + 5.0, cy + 0.85, cz + 6.0)
      };
      collidables.push(coll);
      underwaterCrumblingCrusts.push({
        mesh: cMesh,
        baseY: cy,
        coll: coll,
        stepped: false,
        dropTimer: 0.8,
        fallSpeed: 0,
        respawnTimer: 0
      });
      addOceanItem("uw_c4_" + cIdx, cx, cy + 1.8, cz);
    });
    buildOceanPlatform(22, 2.2, 24, 0, 89.2, -1450, marbleMat);
    createElectricEel(0, 90.5, -1330, enemies, underwaterExtensionGroup);

    // 5. Aşama: Derin Okyanus Kabarcık Zıplatıcıları (z: -1450 -> -1670, Y: 88 -> 94)
    addCheckpoint("uw_cp_s5", "5. Aşama: Derin Okyanus Kabarcık Zıplatıcıları", 0, 89.8, -1460);
    buildOceanPlatform(22, 2.0, 22, 0, 89.2, -1460, marbleMat);
    addBubbleJumpPad(0, 90.0, -1460, 32);
    buildOceanPlatform(16, 2.0, 20, 0, 97.0, -1500, aquaCrystalMat);
    buildOceanPlatform(14, 1.8, 22, -6, 95.0, -1535, marbleMat);
    addBubbleJumpPad(-6, 96.0, -1535, 30);
    buildOceanPlatform(16, 2.0, 20, 0, 103.0, -1575, aquaCrystalMat);
    buildOceanPlatform(14, 1.8, 22, 6, 101.0, -1610, marbleMat);
    addBubbleJumpPad(6, 102.0, -1610, 30);
    buildOceanPlatform(16, 2.0, 20, 0, 108.0, -1645, aquaCrystalMat);
    buildOceanPlatform(24, 2.2, 24, 0, 94.0, -1675, marbleMat);
    createCrystalCrab(0, 95.0, -1575, enemies, underwaterExtensionGroup);

    // 6. Aşama: Biyo-Işıltılı Denizanası Geçidi (z: -1675 -> -1895, Y: 94 -> 98)
    addCheckpoint("uw_cp_s6", "6. Aşama: Biyo-Işıltılı Denizanası Geçidi", 0, 94.8, -1685);
    buildOceanPlatform(22, 2.0, 22, 0, 94.0, -1685, marbleMat);
    [-1720, -1750, -1780, -1810, -1840, -1870].forEach((jz, jIdx) => {
      const jx = (jIdx % 2 === 0 ? 5.0 : -5.0);
      const jy = 94.5 + jIdx * 0.6;
      buildOceanPlatform(13, 1.8, 16, jx, jy, jz, aquaCrystalMat);
      createLuminescentJellyfish(jx, jy + 3.0, jz, enemies, underwaterExtensionGroup);
      addOceanItem("uw_c6_" + jIdx, jx, jy + 1.8, jz);
    });
    buildOceanPlatform(22, 2.2, 24, 0, 98.2, -1895, marbleMat);
    createSpikePufferfish(0, 99.0, -1780, enemies, underwaterExtensionGroup);

    // 7. Aşama: Dar Mercan Sırtları & Denge Resifleri (z: -1895 -> -2115, Y: 98 -> 102)
    addCheckpoint("uw_cp_s7", "7. Aşama: Dar Mercan Sırtları & Denge Resifleri", 0, 98.8, -1905);
    buildOceanPlatform(22, 2.0, 22, 0, 98.2, -1905, marbleMat);
    buildOceanPlatform(5, 2.0, 36, 0, 98.8, -1940, coralPinkMat);
    buildOceanPlatform(14, 2.0, 14, 0, 99.5, -1975, marbleMat);
    buildOceanPlatform(5, 2.0, 36, -5, 100.2, -2010, coralPinkMat);
    buildOceanPlatform(14, 2.0, 14, -5, 100.8, -2045, marbleMat);
    buildOceanPlatform(5, 2.0, 36, 5, 101.4, -2080, coralPinkMat);
    buildOceanPlatform(22, 2.2, 24, 0, 102.0, -2115, marbleMat);
    createAbyssalAnglerfish(0, 103.0, -2010, enemies, underwaterExtensionGroup);

    // 8. Aşama: Hareketli Antik Su Sarayı Blokları (z: -2115 -> -2335, Y: 102 -> 106)
    addCheckpoint("uw_cp_s8", "8. Aşama: Hareketli Antik Bloklar", 0, 102.8, -2125);
    buildOceanPlatform(22, 2.0, 22, 0, 102.0, -2125, marbleMat);
    [-2160, -2195, -2230, -2265, -2300].forEach((mz, mIdx) => {
      const my = 102.5 + mIdx * 0.7;
      const sMesh = new THREE.Mesh(new THREE.BoxGeometry(10, 1.8, 12), aquaCrystalMat);
      sMesh.position.set(0, my, mz);
      underwaterExtensionGroup.add(sMesh);
      const coll = {
        min: new THREE.Vector3(-5.0, my - 0.9, mz - 6.0),
        max: new THREE.Vector3(5.0, my + 1.05, mz + 6.0)
      };
      collidables.push(coll);
      underwaterMovingSlabs.push({
        mesh: sMesh,
        baseX: 0,
        rangeX: 8.5,
        speed: 1.8 + mIdx * 0.25,
        offset: mIdx * 1.2,
        halfW: 5.0,
        coll: coll
      });
      addOceanItem("uw_c8_" + mIdx, 0, my + 1.8, mz);
    });
    buildOceanPlatform(22, 2.2, 24, 0, 106.2, -2335, marbleMat);
    createToxicInkSquid(0, 107.5, -2230, enemies, underwaterExtensionGroup);

    // 9. Aşama: Düşen Sivri Kristal Sarkıtlar Tüneli (z: -2335 -> -2555, Y: 106 -> 110)
    addCheckpoint("uw_cp_s9", "9. Aşama: Düşen Sivri Kristal Sarkıtlar", 0, 106.8, -2345);
    buildOceanPlatform(22, 2.0, 22, 0, 106.2, -2345, marbleMat);
    [-2375, -2405, -2435, -2465, -2495, -2525].forEach((iz, iIdx) => {
      const ix = (iIdx % 2 === 0 ? 4.5 : -4.5);
      const iy = 106.8 + iIdx * 0.6;
      buildOceanPlatform(12, 1.8, 14, ix, iy, iz, marbleMat);
      const spikeGeo = new THREE.ConeGeometry(1.2, 4.5, 8);
      spikeGeo.rotateX(Math.PI);
      const spikeMesh = new THREE.Mesh(spikeGeo, aquaCrystalMat);
      spikeMesh.position.set(ix, iy + 16, iz);
      underwaterExtensionGroup.add(spikeMesh);
      underwaterFallingIcicles.push({
        mesh: spikeMesh,
        x: ix,
        z: iz,
        targetY: iy + 1.0,
        triggered: false,
        fallSpeed: 0
      });
      addOceanItem("uw_c9_" + iIdx, ix, iy + 1.8, iz);
    });
    buildOceanPlatform(22, 2.2, 24, 0, 110.5, -2555, marbleMat);
    createTritonShaman(0, 112.0, -2435, enemies, underwaterExtensionGroup);

    // 10. Aşama: Girdaplı Su Hortumları Labirenti (z: -2555 -> -2775, Y: 110 -> 114)
    addCheckpoint("uw_cp_s10", "10. Aşama: Girdaplı Su Hortumları", 0, 111.0, -2565);
    buildOceanPlatform(22, 2.0, 22, 0, 110.5, -2565, marbleMat);
    buildOceanPlatform(14, 1.8, 30, -5, 111.2, -2600, aquaCrystalMat);
    buildOceanPlatform(16, 2.0, 20, 5, 112.0, -2635, marbleMat);
    buildOceanPlatform(14, 1.8, 30, -5, 112.8, -2670, aquaCrystalMat);
    buildOceanPlatform(16, 2.0, 20, 5, 113.6, -2705, marbleMat);
    buildOceanPlatform(14, 1.8, 30, 0, 114.2, -2740, aquaCrystalMat);
    buildOceanPlatform(22, 2.2, 24, 0, 115.0, -2775, marbleMat);
    createLeviathanSerpent(0, 116.0, -2670, enemies, underwaterExtensionGroup);

    // 11. Aşama: Yüksek Zıplama Deniz Kabukları (z: -2775 -> -2995, Y: 114 -> 120)
    addCheckpoint("uw_cp_s11", "11. Aşama: Yüksek Zıplama Kabukları", 0, 115.6, -2785);
    buildOceanPlatform(22, 2.0, 22, 0, 115.0, -2785, marbleMat);
    addBubbleJumpPad(0, 115.5, -2785, 32);
    buildOceanPlatform(14, 2.0, 16, 0, 124.0, -2820, aquaCrystalMat);
    buildOceanPlatform(12, 1.8, 14, 6, 122.0, -2855, marbleMat);
    addBubbleJumpPad(6, 123.0, -2855, 30);
    buildOceanPlatform(14, 2.0, 16, 0, 130.0, -2890, aquaCrystalMat);
    buildOceanPlatform(12, 1.8, 14, -6, 128.0, -2925, marbleMat);
    addBubbleJumpPad(-6, 129.0, -2925, 30);
    buildOceanPlatform(14, 2.0, 16, 0, 135.0, -2960, aquaCrystalMat);
    buildOceanPlatform(24, 2.2, 26, 0, 120.0, -2995, marbleMat);
    createCoralTortoise(0, 121.5, -2890, enemies, underwaterExtensionGroup);

    // 12. Aşama: Kristal Lazer Koridoru (z: -2995 -> -3215, Y: 120 -> 124)
    addCheckpoint("uw_cp_s12", "12. Aşama: Kristal Lazer Koridoru", 0, 120.8, -3005);
    buildOceanPlatform(22, 2.0, 22, 0, 120.0, -3005, marbleMat);
    [-3035, -3070, -3105, -3140, -3175].forEach((lz, lIdx) => {
      const ly = 120.6 + lIdx * 0.8;
      buildOceanPlatform(14, 1.8, 18, 0, ly, lz, marbleMat);
      const laserGrp = new THREE.Group();
      laserGrp.position.set(0, ly + 2.0, lz);
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 16), coralPinkMat);
      beam.rotation.z = Math.PI / 2;
      laserGrp.add(beam);
      underwaterExtensionGroup.add(laserGrp);
      underwaterCrystalLasers.push({
        mesh: laserGrp,
        y: ly + 2.0,
        z: lz,
        range: 8.0,
        speed: (lIdx % 2 === 0 ? 2.0 : -2.0)
      });
      addOceanItem("uw_c12_" + lIdx, 0, ly + 1.8, lz, true);
    });
    buildOceanPlatform(22, 2.2, 24, 0, 124.5, -3215, marbleMat);
    createElectricEel(0, 126.0, -3105, enemies, underwaterExtensionGroup);

    // 13. Aşama: Çöken İnci Plakaları & Ters Akıntılar (z: -3215 -> -3435, Y: 124 -> 128)
    addCheckpoint("uw_cp_s13", "13. Aşama: Çöken İnci Plakaları", 0, 125.2, -3225);
    buildOceanPlatform(22, 2.0, 22, 0, 124.5, -3225, marbleMat);
    [-3255, -3285, -3315, -3345, -3375, -3405].forEach((cz, cIdx) => {
      const cx = (cIdx % 2 === 0 ? 5.5 : -5.5);
      const cy = 125.0 + cIdx * 0.7;
      const cMesh = new THREE.Mesh(new THREE.BoxGeometry(10, 1.4, 12), pearlWhiteMat);
      cMesh.position.set(cx, cy, cz);
      underwaterExtensionGroup.add(cMesh);
      const coll = {
        min: new THREE.Vector3(cx - 5.0, cy - 0.7, cz - 6.0),
        max: new THREE.Vector3(cx + 5.0, cy + 0.85, cz + 6.0)
      };
      collidables.push(coll);
      underwaterCrumblingCrusts.push({
        mesh: cMesh,
        baseY: cy,
        coll: coll,
        stepped: false,
        dropTimer: 0.7,
        fallSpeed: 0,
        respawnTimer: 0
      });
      addOceanItem("uw_c13_" + cIdx, cx, cy + 1.8, cz);
    });
    buildOceanPlatform(22, 2.2, 24, 0, 129.5, -3435, marbleMat);
    createHunterShark(0, 131.0, -3315, enemies, underwaterExtensionGroup);

    // 14. Aşama: Batık Antik Kalyon Güvertesi (z: -3435 -> -3655, Y: 128 -> 132)
    addCheckpoint("uw_cp_s14", "14. Aşama: Batık Kalyon Güvertesi", 0, 130.2, -3445);
    buildOceanPlatform(22, 2.0, 22, 0, 129.5, -3445, marbleMat);
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.8 });
    buildOceanPlatform(18, 3.0, 48, 0, 130.5, -3485, woodMat);
    buildOceanPlatform(14, 2.5, 45, 4, 131.5, -3535, woodMat);
    buildOceanPlatform(16, 2.5, 45, -4, 132.5, -3585, woodMat);
    buildOceanPlatform(18, 3.0, 48, 0, 133.5, -3625, woodMat);
    buildOceanPlatform(24, 2.2, 26, 0, 134.0, -3655, marbleMat);
    createToxicInkSquid(0, 135.5, -3535, enemies, underwaterExtensionGroup);

    // 15. Aşama: Derin Okyanus Çukuru & Çift Çarklar [Zorlu] (z: -3655 -> -3875, Y: 132 -> 136)
    addCheckpoint("uw_cp_s15", "15. Aşama: Derin Okyanus Çukuru [Zorlu]", 0, 134.8, -3665);
    buildOceanPlatform(22, 2.0, 22, 0, 134.0, -3665, marbleMat);
    const wm3 = new THREE.Group();
    wm3.position.set(-6, 136.0, -3715);
    for (let b = 0; b < 4; b++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(16, 0.4, 2.5), coralPinkMat);
      blade.rotation.y = (b / 4) * Math.PI * 2;
      wm3.add(blade);
    }
    underwaterExtensionGroup.add(wm3);
    underwaterWaterMills.push({ group: wm3, speed: 2.2 });
    buildOceanPlatform(14, 1.8, 22, -6, 135.0, -3715, marbleMat);
    buildOceanPlatform(12, 1.8, 24, 0, 135.8, -3755, aquaCrystalMat);

    const wm4 = new THREE.Group();
    wm4.position.set(6, 137.5, -3800);
    for (let b = 0; b < 4; b++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(16, 0.4, 2.5), coralPinkMat);
      blade.rotation.y = (b / 4) * Math.PI * 2;
      wm4.add(blade);
    }
    underwaterExtensionGroup.add(wm4);
    underwaterWaterMills.push({ group: wm4, speed: -2.4 });
    buildOceanPlatform(14, 1.8, 22, 6, 136.5, -3800, marbleMat);
    buildOceanPlatform(14, 1.8, 28, 0, 137.2, -3840, aquaCrystalMat);
    buildOceanPlatform(22, 2.2, 24, 0, 138.0, -3875, marbleMat);
    createCrystalCrab(0, 139.0, -3755, enemies, underwaterExtensionGroup);

    // 16. Aşama: Kraliyet Su Muhafızları Zirvesi & Zıplama Rampası (z: -3875 -> -4100, Y: 136 -> 140)
    addCheckpoint("uw_cp_s16", "16. Aşama: Kraliyet Muhafızları Zirvesi", 0, 138.8, -3885);
    buildOceanPlatform(22, 2.0, 22, 0, 138.0, -3885, marbleMat);
    buildOceanPlatform(16, 2.0, 30, 0, 138.8, -3925, aquaCrystalMat);
    buildOceanPlatform(18, 2.0, 30, -5, 139.4, -3970, marbleMat);
    buildOceanPlatform(16, 2.0, 30, 5, 140.0, -4015, aquaCrystalMat);
    buildOceanPlatform(18, 2.0, 30, 0, 140.6, -4060, marbleMat);
    addBubbleJumpPad(0, 141.0, -4060, 34);
    buildOceanPlatform(26, 2.5, 30, 0, 140.0, -4100, goldOrnamentMat);
    createTritonShaman(0, 141.5, -3970, enemies, underwaterExtensionGroup);
    createLeviathanSerpent(0, 142.0, -4060, enemies, underwaterExtensionGroup);

    // 17. Aşama: [BÜYÜK BOSS] BÖLÜMÜN EN SONUNDAKİ YÜCE NEPTÜN KRALLIĞI ARENASI 🌊 (z: -4150 -> -4350)
    const arenaX = 0;
    const arenaY = 140.0;
    const arenaZ = -4220;

    addCheckpoint("uw_cp_s17", "17. Aşama: [BÜYÜK BOSS] Yüce Neptün Arenası 🌊", 0, arenaY + 1.2, -4150);

    // Grand Abyssal Arena Platform
    buildOceanPlatform(72, 4.0, 88, arenaX, arenaY, arenaZ, marbleMat);
    const arenaRim = new THREE.Mesh(new THREE.BoxGeometry(74, 0.2, 90), neonCyanMat);
    arenaRim.position.set(arenaX, arenaY + 2.05, arenaZ);
    underwaterExtensionGroup.add(arenaRim);

    // 12 Sunken Coral & Gold Pillars around arena
    for (let p = 0; p < 12; p++) {
      const angle = (p / 12) * Math.PI * 2;
      const px = arenaX + Math.cos(angle) * 34;
      const pz = arenaZ + Math.sin(angle) * 40;
      buildOceanPlatform(3.5, 26, 3.5, px, arenaY + 13.0, pz, marbleMat);
      const orb = new THREE.Mesh(new THREE.SphereGeometry(2.0, 12, 12), aquaCrystalMat);
      orb.position.set(px, arenaY + 26.5, pz);
      underwaterExtensionGroup.add(orb);
    }

    if (typeof window.createThematicEntranceEasel === 'function') {
      window.createThematicEntranceEasel(
        game,
        0,
        "👑 YÜCE NEPTÜN KRALLIĞI ARENASI!\nDev Kraken yere oturduğunda kafasına zıpla veya yumruk at!\nMağlup ettikten sonra 8. Bölüm Altın Cenneti portalından geç!",
        0,
        arenaY + 2.5,
        arenaZ + 38
      );
    }

    // RELOCATED KRAKEN BOSS AT SECTION END
    activeKrakenBoss = createRelocatedKrakenBoss(arenaX, arenaY, arenaZ, enemies, underwaterExtensionGroup, game);

    // Victory Portal behind Kraken (8. Bölüm Altın Cenneti'ne açılır)
    underwaterVictoryPortal = createUnderwaterVictoryPortal(arenaX, arenaY + 2.2, arenaZ - 44, underwaterExtensionGroup);

    console.log("✅ [Underwater Palace] Orijinal Saray ve 17 Aşama Başarıyla Birleştirildi!");
  };

  // =========================================================================
  // 10 ÖZEL YENİ DENİZ CANLISI MODELİ VE MEKANİĞİ
  // =========================================================================

  function createLuminescentJellyfish(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const grp = new THREE.Group();
    grp.position.set(x, y, z);
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4, emissive: 0x0891b2, emissiveIntensity: 1.2, transparent: true, opacity: 0.85
    });
    const dome = new THREE.Mesh(new THREE.SphereGeometry(1.6, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), domeMat);
    grp.add(dome);
    const tentacleMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    for (let t = 0; t < 6; t++) {
      const ten = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.04, 2.5), tentacleMat);
      const angle = (t / 6) * Math.PI * 2;
      ten.position.set(Math.cos(angle) * 1.0, -1.2, Math.sin(angle) * 1.0);
      grp.add(ten);
    }
    group.add(grp);
    enemies.push({
      id: "jellyfish_" + Math.round(z),
      type: "ocean_jellyfish",
      name: "Parlayan Lüminesans Denizanası 🪼",
      mesh: grp,
      pos: new THREE.Vector3(x, y, z),
      baseY: y,
      hp: 60,
      maxHp: 60,
      attackPower: 12,
      update: function(dt, p, game) {
        this.mesh.position.y = this.baseY + Math.sin(Date.now() * 0.003) * 1.8;
        this.pos.copy(this.mesh.position);
        if (this.pos.distanceTo(p) < 2.5) game.damagePlayer(this.attackPower);
      }
    });
  }

  function createHunterShark(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const grp = new THREE.Group();
    grp.position.set(x, y, z);
    const sharkMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 });
    const body = new THREE.Mesh(new THREE.ConeGeometry(1.2, 4.0, 8), sharkMat);
    body.rotation.x = Math.PI / 2;
    grp.add(body);
    const finMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2 });
    const fin = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.2, 4), finMat);
    fin.position.set(0, 1.0, -0.4);
    grp.add(fin);
    group.add(grp);
    enemies.push({
      id: "hunter_shark_" + Math.round(z),
      type: "hunter_shark",
      name: "Antik Zırhlı Muhafız Köpekbalığı 🦈",
      mesh: grp,
      pos: new THREE.Vector3(x, y, z),
      baseX: x,
      hp: 120,
      maxHp: 120,
      attackPower: 18,
      update: function(dt, p, game) {
        const time = Date.now() * 0.002;
        this.mesh.position.x = this.baseX + Math.sin(time) * 8.0;
        this.pos.copy(this.mesh.position);
        this.mesh.rotation.y = Math.cos(time) > 0 ? Math.PI / 2 : -Math.PI / 2;
        if (this.pos.distanceTo(p) < 3.0) game.damagePlayer(this.attackPower);
      }
    });
  }

  function createCoralTortoise(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const grp = new THREE.Group();
    grp.position.set(x, y, z);
    const shellMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.6 });
    const shell = new THREE.Mesh(new THREE.SphereGeometry(1.8, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2), shellMat);
    grp.add(shell);
    const headMat = new THREE.MeshStandardMaterial({ color: 0x10b981 });
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.6), headMat);
    head.position.set(0, 0.4, 2.0);
    grp.add(head);
    group.add(grp);
    enemies.push({
      id: "coral_tortoise_" + Math.round(z),
      type: "coral_tortoise",
      name: "Mercan Zırhlı Antik Kaplumbağa 🐢",
      mesh: grp,
      pos: new THREE.Vector3(x, y, z),
      baseZ: z,
      hp: 140,
      maxHp: 140,
      attackPower: 14,
      update: function(dt, p, game) {
        this.mesh.position.z = this.baseZ + Math.sin(Date.now() * 0.0015) * 5.0;
        this.pos.copy(this.mesh.position);
        if (this.pos.distanceTo(p) < 2.8) game.damagePlayer(this.attackPower);
      }
    });
  }

  function createElectricEel(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const grp = new THREE.Group();
    grp.position.set(x, y, z);
    const rayMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, emissive: 0x38bdf8, emissiveIntensity: 0.9
    });
    const body = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.3, 3.2), rayMat);
    grp.add(body);
    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.02, 3.5), rayMat);
    tail.rotation.x = Math.PI / 2;
    tail.position.set(0, 0, -3.0);
    grp.add(tail);
    group.add(grp);
    enemies.push({
      id: "electric_eel_" + Math.round(z),
      type: "electric_eel",
      name: "Elektrikli Şok Vatozu ⚡",
      mesh: grp,
      pos: new THREE.Vector3(x, y, z),
      baseX: x,
      baseY: y,
      hp: 90,
      maxHp: 90,
      attackPower: 16,
      update: function(dt, p, game) {
        const t = Date.now() * 0.0025;
        this.mesh.position.x = this.baseX + Math.sin(t) * 7.0;
        this.mesh.position.y = this.baseY + Math.cos(t * 1.5) * 1.2;
        this.pos.copy(this.mesh.position);
        if (this.pos.distanceTo(p) < 3.2) game.damagePlayer(this.attackPower);
      }
    });
  }

  function createCrystalCrab(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const grp = new THREE.Group();
    grp.position.set(x, y, z);
    const crabMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4, roughness: 0.2, metalness: 0.7, emissive: 0x0891b2, emissiveIntensity: 0.6
    });
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.0, 1.8), crabMat);
    body.position.y = 0.5;
    grp.add(body);
    const claw1 = new THREE.Mesh(new THREE.SphereGeometry(0.6), crabMat);
    claw1.position.set(-1.6, 0.6, 1.2);
    grp.add(claw1);
    const claw2 = new THREE.Mesh(new THREE.SphereGeometry(0.6), crabMat);
    claw2.position.set(1.6, 0.6, 1.2);
    grp.add(claw2);
    group.add(grp);
    enemies.push({
      id: "crystal_crab_" + Math.round(z),
      type: "crystal_crab",
      name: "Kristal Kıskaçlı Yengeç 🦀",
      mesh: grp,
      pos: new THREE.Vector3(x, y, z),
      baseX: x,
      hp: 110,
      maxHp: 110,
      attackPower: 15,
      update: function(dt, p, game) {
        this.mesh.position.x = this.baseX + Math.sin(Date.now() * 0.003) * 4.5;
        this.pos.copy(this.mesh.position);
        if (this.pos.distanceTo(p) < 2.5) game.damagePlayer(this.attackPower);
      }
    });
  }

  function createSpikePufferfish(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const grp = new THREE.Group();
    grp.position.set(x, y, z);
    const pufferMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.5 });
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.4, 12, 12), pufferMat);
    grp.add(sphere);
    const spikeMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    for (let s = 0; s < 8; s++) {
      const sp = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.8, 4), spikeMat);
      const angle = (s / 8) * Math.PI * 2;
      sp.position.set(Math.cos(angle) * 1.3, Math.sin(angle) * 0.8, 0);
      grp.add(sp);
    }
    group.add(grp);
    enemies.push({
      id: "pufferfish_" + Math.round(z),
      type: "spike_pufferfish",
      name: "Dikenli Balon Balığı 🐡",
      mesh: grp,
      pos: new THREE.Vector3(x, y, z),
      baseY: y,
      hp: 85,
      maxHp: 85,
      attackPower: 16,
      update: function(dt, p, game) {
        const d = this.pos.distanceTo(p);
        const scale = d < 8.0 ? 1.5 : 1.0;
        this.mesh.scale.set(scale, scale, scale);
        this.mesh.position.y = this.baseY + Math.sin(Date.now() * 0.002) * 1.0;
        this.pos.copy(this.mesh.position);
        if (d < 2.5 * scale) game.damagePlayer(this.attackPower);
      }
    });
  }

  function createAbyssalAnglerfish(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const grp = new THREE.Group();
    grp.position.set(x, y, z);
    const anglerMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.8 });
    const body = new THREE.Mesh(new THREE.SphereGeometry(1.6, 12, 12), anglerMat);
    body.scale.set(1.0, 1.2, 1.5);
    grp.add(body);
    const lureMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const lure = new THREE.Mesh(new THREE.SphereGeometry(0.4), lureMat);
    lure.position.set(0, 2.2, 2.2);
    grp.add(lure);
    group.add(grp);
    enemies.push({
      id: "anglerfish_" + Math.round(z),
      type: "abyssal_anglerfish",
      name: "Derin Uçurum Fener Balığı 🐟💡",
      mesh: grp,
      pos: new THREE.Vector3(x, y, z),
      baseZ: z,
      hp: 130,
      maxHp: 130,
      attackPower: 20,
      update: function(dt, p, game) {
        this.mesh.position.z = this.baseZ + Math.sin(Date.now() * 0.002) * 6.0;
        this.pos.copy(this.mesh.position);
        if (this.pos.distanceTo(p) < 3.2) game.damagePlayer(this.attackPower);
      }
    });
  }

  function createToxicInkSquid(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const grp = new THREE.Group();
    grp.position.set(x, y, z);
    const inkMat = new THREE.MeshStandardMaterial({ color: 0x4c1d95, roughness: 0.3 });
    const mantle = new THREE.Mesh(new THREE.ConeGeometry(1.3, 3.5, 8), inkMat);
    grp.add(mantle);
    group.add(grp);
    enemies.push({
      id: "ink_squid_" + Math.round(z),
      type: "ink_squid",
      name: "Zehirli Mürekkep Balığı 🦑",
      mesh: grp,
      pos: new THREE.Vector3(x, y, z),
      baseX: x,
      hp: 100,
      maxHp: 100,
      attackPower: 14,
      update: function(dt, p, game) {
        this.mesh.position.x = this.baseX + Math.sin(Date.now() * 0.002) * 5.0;
        this.pos.copy(this.mesh.position);
        if (this.pos.distanceTo(p) < 2.6) game.damagePlayer(this.attackPower);
      }
    });
  }

  function createTritonShaman(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const grp = new THREE.Group();
    grp.position.set(x, y, z);
    const tritonMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.5 });
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.5, 2.2, 8), tritonMat);
    torso.position.y = 1.1;
    grp.add(torso);
    const tridentMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xb45309 });
    const trident = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.8), tridentMat);
    trident.position.set(1.0, 1.8, 0.5);
    grp.add(trident);
    group.add(grp);
    enemies.push({
      id: "triton_shaman_" + Math.round(z),
      type: "triton_shaman",
      name: "Antik Triton Mızraklı Şamanı 🧜‍♂️🔱",
      mesh: grp,
      pos: new THREE.Vector3(x, y, z),
      baseY: y,
      hp: 160,
      maxHp: 160,
      attackPower: 18,
      update: function(dt, p, game) {
        this.mesh.rotation.y += dt * 1.2;
        if (this.pos.distanceTo(p) < 3.0) game.damagePlayer(this.attackPower);
      }
    });
  }

  function createLeviathanSerpent(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const grp = new THREE.Group();
    grp.position.set(x, y, z);
    const serpentMat = new THREE.MeshStandardMaterial({
      color: 0x0f766e, emissive: 0x14b8a6, emissiveIntensity: 0.6
    });
    for (let s = 0; s < 5; s++) {
      const seg = new THREE.Mesh(new THREE.SphereGeometry(1.6 - s * 0.2, 10, 10), serpentMat);
      seg.position.set(0, 0, -s * 2.2);
      grp.add(seg);
    }
    group.add(grp);
    enemies.push({
      id: "leviathan_serpent_" + Math.round(z),
      type: "leviathan_serpent",
      name: "Devasa Leviathan Okyanus Yılanı 🐉🌊",
      mesh: grp,
      pos: new THREE.Vector3(x, y, z),
      baseX: x,
      hp: 200,
      maxHp: 200,
      attackPower: 22,
      update: function(dt, p, game) {
        const t = Date.now() * 0.002;
        this.mesh.position.x = this.baseX + Math.sin(t) * 9.0;
        this.pos.copy(this.mesh.position);
        if (this.pos.distanceTo(p) < 4.0) game.damagePlayer(this.attackPower);
      }
    });
  }

  // =========================================================================
  // RELOCATED KRAKEN BOSS & VICTORY PORTAL
  // =========================================================================
  function createRelocatedKrakenBoss(x, y, z, enemies, group, gameInstance) {
    const THREE = window.THREE;
    const krakenGroup = new THREE.Group();
    krakenGroup.name = "boss_ocean_kraken_relocated";
    krakenGroup.position.set(x, y + 18.0, z);

    // Exact Purple Kraken Head/Body
    const krakenMat = new THREE.MeshStandardMaterial({ color: 0x6b21a8, roughness: 0.3 });
    const krakenHead = new THREE.Mesh(new THREE.SphereGeometry(10, 16, 16), krakenMat);
    krakenHead.position.set(0, 0, 0);
    krakenGroup.add(krakenHead);

    // Glowing Yellow Eyes
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });
    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(1.5), eyeMat);
    leftEye.position.set(-3.5, 3, 8.5);
    krakenGroup.add(leftEye);

    const rightEye = new THREE.Mesh(new THREE.SphereGeometry(1.5), eyeMat);
    rightEye.position.set(3.5, 3, 8.5);
    krakenGroup.add(rightEye);

    // 8 Majestic Tentacles
    for (let i = 0; i < 8; i++) {
      const tentacle = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 0.2, 15), krakenMat);
      const angle = (i / 8) * Math.PI * 2;
      tentacle.position.set(Math.cos(angle) * 8, -6, Math.sin(angle) * 8);
      tentacle.rotation.x = Math.PI / 2.5;
      tentacle.rotation.y = -angle;
      krakenGroup.add(tentacle);
    }

    group.add(krakenGroup);

    // Set arena coordinates directly on level for tracking in game-enhancer
    if (gameInstance.currentLevel) {
      gameInstance.currentLevel.kraken = krakenGroup;
      gameInstance.currentLevel.krakenHp = 3;
      gameInstance.currentLevel.krakenState = 'air';
      gameInstance.currentLevel.krakenStateTimer = 16.0;
      gameInstance.currentLevel.krakenArenaX = x;
      gameInstance.currentLevel.krakenArenaY = y;
      gameInstance.currentLevel.krakenArenaZ = z;
      gameInstance.currentLevel.krakenProjectiles = [];
      gameInstance.currentLevel.krakenShootTimer = 2.0;
    }

    const bossData = {
      id: "boss_ocean_kraken",
      type: "ocean_kraken",
      name: "Dev Neptün Kraken (Okyanus Lordu 🦑)",
      mesh: krakenGroup,
      pos: krakenGroup.position,
      basePos: new THREE.Vector3(x, y, z),
      hp: 3,
      maxHp: 3,
      isBoss: true,
      attackPower: 22,
      update: function(dt, p, game) {}
    };
    enemies.push(bossData);
    return bossData;
  }

  function createUnderwaterVictoryPortal(x, y, z, group) {
    const THREE = window.THREE;
    const portalGrp = new THREE.Group();
    portalGrp.name = "underwater_stage17_victory_portal";
    portalGrp.position.set(x, y, z);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.8, 0.5, 16, 32),
      new THREE.MeshStandardMaterial({ color: 0xeab308, emissive: 0xca8a04, emissiveIntensity: 2.0 })
    );
    ring.position.y = 3.8;
    portalGrp.add(ring);

    group.add(portalGrp);

    return {
      mesh: portalGrp,
      pos: new THREE.Vector3(x, y, z),
      targetRegion: "golden_sanctuary"
    };
  }

  // =========================================================================
  // UPDATE TICK LOOP
  // =========================================================================
  function updateUnderwaterPalaceExtension(dt) {
    const game = window.__superBearGame;
    if (!game || game.currentRegion !== 'underwater_palace') return;
    totalTime += dt;

    // Moving Slabs
    underwaterMovingSlabs.forEach(s => {
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
      underwaterCrumblingCrusts.forEach(cp => {
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

    // Water Mills
    underwaterWaterMills.forEach(wm => {
      wm.group.rotation.y += dt * wm.speed;
      if (game.playerPos && wm.group.position.distanceTo(game.playerPos) < 3.5) {
        game.damagePlayer(16);
      }
    });

    // Crystal Lasers
    underwaterCrystalLasers.forEach(cl => {
      cl.mesh.rotation.y += dt * cl.speed;
      if (game.playerPos) {
        const d = Math.hypot(game.playerPos.x - cl.mesh.position.x, game.playerPos.z - cl.z);
        if (d < (cl.range || 8.0) && Math.abs(game.playerPos.y - cl.y) < 1.8) {
          game.damagePlayer(18);
        }
      }
    });

    // Falling Spikes
    if (game.playerPos) {
      underwaterFallingIcicles.forEach(ic => {
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

    // Bubble Jump Pads
    if (game.playerPos && underwaterBubblePads.length > 0) {
      underwaterBubblePads.forEach(bp => {
        const d = Math.hypot(game.playerPos.x - bp.pos.x, game.playerPos.z - bp.pos.z);
        if (d < 2.2 && Math.abs(game.playerPos.y - bp.pos.y) < 1.4) {
          if (game.playerVel) {
            game.playerVel.y = bp.power || 30.0;
            if (window.St && window.St.playJump) window.St.playJump();
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("🫧 Kabarcık Sıçrayışı!", "info");
            }
          }
        }
      });
    }

    // Victory Portal Interaction (Transitions to 8. Golden Sanctuary)
    if (underwaterVictoryPortal && game.playerPos) {
      underwaterVictoryPortal.mesh.rotation.y += dt * 0.9;
      const d = underwaterVictoryPortal.pos.distanceTo(game.playerPos);
      if (d < 5.0) {
        const boss = (game.currentLevel && game.currentLevel.enemies || []).find(e => e && e.id === "boss_ocean_kraken");
        const isBossAlive = (boss && boss.hp > 0) || (game.currentLevel && game.currentLevel.krakenHp > 0);

        if (isBossAlive && !game._bossDefeatedInCurrentRegion) {
          const now = Date.now();
          if (!underwaterVictoryPortal._lastNotice || now - underwaterVictoryPortal._lastNotice > 2500) {
            underwaterVictoryPortal._lastNotice = now;
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("⚠️ Altın Cenneti portalından geçmek için önce Dev Kraken'i yenmelisin! ⚔️", "warning");
            }
          }
        } else {
          if (!underwaterVictoryPortal._triggered) {
            underwaterVictoryPortal._triggered = true;
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("🌀 8. Bölüm: Efsanevi Altın Cenneti'ne Geçiliyor! 🌟", "success");
            }
            if (window.St && window.St.playGoalFanfare) window.St.playGoalFanfare();
            setTimeout(() => {
              game.loadRegion("golden_sanctuary");
            }, 800);
          }
        }
      }
    }
  }

  // Hook into update loop
  const tickerInterval = setInterval(() => {
    if (window.__superBearGame) {
      if (!window.__superBearGame._underwaterTickerHooked) {
        window.__superBearGame._underwaterTickerHooked = true;
        const origUpdate = window.__superBearGame.update;
        window.__superBearGame.update = function(dt, totalTime) {
          origUpdate.call(this, dt, totalTime);
          try {
            updateUnderwaterPalaceExtension(dt);
          } catch(err) {}
        };
      }
      clearInterval(tickerInterval);
    }
  }, 100);

  window.__cleanUpUnderwaterPalaceExtension = cleanUpUnderwaterPalaceExtension;
  window.__updateUnderwaterPalaceExtension = updateUnderwaterPalaceExtension;

  console.log("🌊 [Underwater Palace Combined Extension] Script Loaded!");
})();
