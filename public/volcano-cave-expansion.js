// ============================================================================
// 🌋 6. BÖLÜM: VOLKANİK EJDERHA MAĞARASI UZATILMIŞ GENİŞLETMESİ
// - 19 UZUN, DETAYLI VE ZENGİN MAGMA AŞAMASI (z: -180 -> -3800)
//     * 1-7. Aşamalar [Çok Kolay]: Geniş, güvenli obsidyen ve bazalt platformlar, rahat geçişler.
//     * 8-14. Aşamalar [Orta Zorluk]: Hareketli lav salları, dönen alev değirmenleri, çöken magma plakaları.
//     * 15-19. Aşamalar [Çok Zorlu / Hardcore]: Magma lazerleri, dar obsidyen kirişleri, eriyen basamaklar, kayan lav gülleleri!
// - 12 ÖZEL YENİ VOLKANİK CANLI (Özgün 3D modeller ve mekanikler)
// - BOSS: Kızıl Alev Ejderhası Ignis
//     * Yeri 19. Aşamadaki Yüce Volkanik Kaldera Arenası'na (z: -3650) taşındı!
//     * Havada süzülür, alev topları fırlatır, yere indiğinde şok dalgaları saçarak savunmasız kalır!
//     * Mağlup edildiğinde 7. Bölüm Antik Su Altı Kristal Sarayı portalı açılır!
// ============================================================================

(function() {
  'use strict';

  console.log("🌋 [Volcano Cave Expansion] 19 Uzun Aşama, 12 Canlı ve Uçan Alev Ejderhası Başlatılıyor...");

  let volcanoExtensionGroup = null;
  let activeVolcanoProjectiles = [];
  let volcanoMovingSlabs = [];
  let volcanoCrumblingCrusts = [];
  let volcanoFireMills = [];
  let volcanoMagmaLasers = [];
  let volcanoFallingEmbers = [];
  let volcanoJumpPads = [];
  let activeDragonBoss = null;
  let volcanoVictoryPortal = null;
  let totalTime = 0;

  function cleanUpVolcanoCaveExtension() {
    if (volcanoExtensionGroup && volcanoExtensionGroup.parent) {
      volcanoExtensionGroup.parent.remove(volcanoExtensionGroup);
    }
    volcanoExtensionGroup = null;
    activeVolcanoProjectiles = [];
    volcanoMovingSlabs = [];
    volcanoCrumblingCrusts = [];
    volcanoFireMills = [];
    volcanoMagmaLasers = [];
    volcanoFallingEmbers = [];
    volcanoJumpPads = [];
    activeDragonBoss = null;
    volcanoVictoryPortal = null;
  }

  // =========================================================================
  // MAIN VOLCANO CAVE POPULATOR (19 EXTENDED STAGES)
  // =========================================================================
  window.__populateVolcanoCaveExtension = function(game) {
    if (!window.THREE || !game || !game.scene) return;
    const THREE = window.THREE;

    console.log("🌋 [Volcano Cave Expansion] 19 Uzun Aşama, 12 Canlı ve Uçan Alev Ejderhası Oluşturuluyor...");
    cleanUpVolcanoCaveExtension();

    // Extend boundaries to allow extensive 19-stage travel down to z: -4000
    if (game.currentLevel && game.currentLevel.bounds) {
      game.currentLevel.bounds.minZ = -4100;
      game.currentLevel.bounds.maxZ = 200;
      game.currentLevel.bounds.minX = -500;
      game.currentLevel.bounds.maxX = 500;
      game.currentLevel.bounds.minY = -80;
      game.currentLevel.bounds.maxY = 450;
    }

    volcanoExtensionGroup = new THREE.Group();
    volcanoExtensionGroup.name = "volcano_cave_19_stages_extension";
    game.scene.add(volcanoExtensionGroup);

    const collidables = game.currentLevel.colliders = game.currentLevel.colliders || [];
    const enemies = game.currentLevel.enemies = game.currentLevel.enemies || [];

    // Purge any old static dragon boss and premature exit portal
    game.currentLevel.enemies = enemies.filter(e => {
      if (e && (e.id === 'boss_volcano_dragon' || e.type === 'volcano_dragon_boss')) {
        if (e.mesh && e.mesh.parent) e.mesh.parent.remove(e.mesh);
        return false;
      }
      return true;
    });

    if (game.scene) {
      const oldPortal = game.scene.getObjectByName('cave_exit_portal_underwater_palace');
      if (oldPortal && oldPortal.parent) oldPortal.parent.remove(oldPortal);
      if (game.currentLevel.mesh) {
        const oldP2 = game.currentLevel.mesh.getObjectByName('cave_exit_portal_underwater_palace');
        if (oldP2 && oldP2.parent) oldP2.parent.remove(oldP2);
      }
    }

    // High quality volcanic materials
    const basaltMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85, metalness: 0.2 });
    const smoothObsidianMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.2, metalness: 0.8 });
    const magmaGlowMat = new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xea580c, emissiveIntensity: 1.2 });
    const crystalFireMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 1.5 });
    const moltenGoldMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xd97706, emissiveIntensity: 0.8 });

    function buildBasaltPlatform(w, h, d, px, py, pz, mat, isHazard = false) {
      const platGroup = new THREE.Group();
      platGroup.position.set(px, py, pz);
      const stoneMesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat || basaltMat);
      stoneMesh.castShadow = true;
      stoneMesh.receiveShadow = true;
      platGroup.add(stoneMesh);

      if (!isHazard) {
        const rim = new THREE.Mesh(new THREE.BoxGeometry(w * 0.96, 0.08, d * 0.96), magmaGlowMat);
        rim.position.y = h / 2 + 0.04;
        platGroup.add(rim);
      }

      volcanoExtensionGroup.add(platGroup);
      collidables.push({
        min: new THREE.Vector3(px - w / 2, py - h / 2, pz - d / 2),
        max: new THREE.Vector3(px + w / 2, py + h / 2 + 0.15, pz + d / 2),
        isToxic: isHazard
      });
      return platGroup;
    }

    function addVolcanoItem(id, x, y, z, isGem = false) {
      if (typeof window.create3DGoldCoin === 'function' && !isGem) {
        const coin = window.create3DGoldCoin(x, y, z, 25);
        if (coin) volcanoExtensionGroup.add(coin);
      } else {
        const geom = isGem ? new THREE.OctahedronGeometry(0.55) : new THREE.CylinderGeometry(0.4, 0.4, 0.15, 12);
        const mesh = new THREE.Mesh(geom, isGem ? crystalFireMat : moltenGoldMat);
        mesh.position.set(x, y, z);
        volcanoExtensionGroup.add(mesh);
      }
    }

    function addCheckpoint(id, name, x, y, z) {
      if (!game.currentLevel.checkpoints) game.currentLevel.checkpoints = [];
      const cpMat = new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xc2410c, emissiveIntensity: 1.0 });
      const cpMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.0, 0.35, 16), cpMat);
      cpMesh.position.set(x, y + 0.18, z);
      volcanoExtensionGroup.add(cpMesh);

      const flag = new THREE.Mesh(new THREE.ConeGeometry(0.4, 2.0, 8), crystalFireMat);
      flag.position.set(x, y + 1.35, z);
      volcanoExtensionGroup.add(flag);

      game.currentLevel.checkpoints.push({
        id: id,
        name: name,
        pos: new THREE.Vector3(x, y + 1.5, z)
      });
    }

    function addMagmaJumpPad(x, y, z, boostPower = 28) {
      const padMat = new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xea580c, emissiveIntensity: 1.5 });
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.2, 0.4, 16), padMat);
      pad.position.set(x, y + 0.2, z);
      volcanoExtensionGroup.add(pad);

      volcanoJumpPads.push({
        pos: new THREE.Vector3(x, y, z),
        power: boostPower
      });
    }

    // =========================================================================
    // 🌋 19 UZUN AŞAMA (HER AŞAMA 7-12 PLATFORM VE GENİŞLETİLMİŞ MACERA)
    // =========================================================================

    // 1-7. AŞAMALAR [ÇOK KOLAY & UZUN]: Geniş platformlar, rahat mesafeler
    // -------------------------------------------------------------------------
    // 1. Aşama: Lav Gölü Girişi & Obsidyen Yolu (z: -180 -> -360)
    addCheckpoint("volcano_cp_s1", "1. Aşama: Lav Girişi & Obsidyen Yolu [Çok Kolay]", 0, 41.5, -190);
    buildBasaltPlatform(24, 2.5, 26, 0, 40.5, -190, smoothObsidianMat);
    buildBasaltPlatform(16, 2.0, 30, 0, 41.0, -220, basaltMat);
    buildBasaltPlatform(18, 2.0, 30, 3, 41.5, -250, smoothObsidianMat);
    buildBasaltPlatform(16, 2.0, 30, -3, 42.0, -280, basaltMat);
    buildBasaltPlatform(18, 2.0, 30, 0, 42.5, -310, smoothObsidianMat);
    buildBasaltPlatform(16, 2.0, 30, 4, 43.0, -340, basaltMat);
    buildBasaltPlatform(22, 2.5, 24, 0, 43.5, -365, smoothObsidianMat);
    addVolcanoItem("v_c1_0", 0, 44.5, -250);
    addVolcanoItem("v_gem1", 0, 45.0, -310, true);
    createLavaSalamander(0, 44.0, -280, enemies, volcanoExtensionGroup);

    // 2. Aşama: Ilık Magma Adacıkları (z: -365 -> -550)
    addCheckpoint("volcano_cp_s2", "2. Aşama: Ilık Magma Adacıkları [Çok Kolay]", 0, 44.0, -375);
    buildBasaltPlatform(22, 2.5, 22, 0, 43.5, -375, basaltMat);
    const s2Steps = [-400, -425, -450, -475, -500, -525];
    s2Steps.forEach((az, aIdx) => {
      const ax = (aIdx % 2 === 0 ? 5.0 : -5.0);
      const ay = 44.0 + aIdx * 0.6;
      buildBasaltPlatform(12, 2.0, 14, ax, ay, az, smoothObsidianMat);
      addVolcanoItem("v_c2_" + aIdx, ax, ay + 1.8, az, aIdx === 2);
    });
    buildBasaltPlatform(22, 2.5, 24, 0, 47.6, -550, basaltMat);
    createFirewingBat(0, 52.0, -450, enemies, volcanoExtensionGroup);

    // 3. Aşama: Yüzen Magma Salları (z: -550 -> -730)
    addCheckpoint("volcano_cp_s3", "3. Aşama: Yüzen Magma Salları [Çok Kolay]", 0, 48.0, -560);
    buildBasaltPlatform(22, 2.5, 22, 0, 47.5, -560, smoothObsidianMat);
    [-590, -625, -660, -695].forEach((mz, mIdx) => {
      const my = 48.0 + mIdx * 0.6;
      const mMesh = new THREE.Mesh(new THREE.BoxGeometry(12, 1.8, 14), basaltMat);
      mMesh.position.set(0, my, mz);
      volcanoExtensionGroup.add(mMesh);
      const coll = {
        min: new THREE.Vector3(-6.0, my - 0.9, mz - 7.0),
        max: new THREE.Vector3(6.0, my + 1.05, mz + 7.0)
      };
      collidables.push(coll);
      volcanoMovingSlabs.push({
        mesh: mMesh,
        baseX: 0,
        rangeX: 6.0,
        speed: 1.2 + mIdx * 0.2,
        offset: mIdx * 1.5,
        halfW: 6.0,
        coll: coll
      });
      addVolcanoItem("v_c3_" + mIdx, 0, my + 1.8, mz);
    });
    buildBasaltPlatform(22, 2.5, 24, 0, 50.8, -730, smoothObsidianMat);
    createMagmaCrawler(0, 52.0, -660, enemies, volcanoExtensionGroup);

    // 4. Aşama: Geniş Köz Sırtları (z: -730 -> -910)
    addCheckpoint("volcano_cp_s4", "4. Aşama: Geniş Köz Sırtları [Çok Kolay]", 0, 51.5, -740);
    buildBasaltPlatform(22, 2.5, 22, 0, 51.0, -740, basaltMat);
    buildBasaltPlatform(8, 2.0, 36, 0, 51.5, -775, smoothObsidianMat);
    buildBasaltPlatform(14, 2.0, 14, 0, 52.0, -805, basaltMat);
    buildBasaltPlatform(8, 2.0, 36, -5, 52.5, -835, smoothObsidianMat);
    buildBasaltPlatform(14, 2.0, 14, -5, 53.0, -865, basaltMat);
    buildBasaltPlatform(8, 2.0, 36, 5, 53.5, -895, smoothObsidianMat);
    buildBasaltPlatform(22, 2.5, 24, 0, 54.0, -925, basaltMat);
    createFlameImp(0, 55.5, -835, enemies, volcanoExtensionGroup);

    // 5. Aşama: Ilık Alev Gayzerleri (z: -925 -> -1100)
    addCheckpoint("volcano_cp_s5", "5. Aşama: Alev Gayzerleri [Çok Kolay]", 0, 54.5, -935);
    buildBasaltPlatform(22, 2.5, 22, 0, 54.0, -935, smoothObsidianMat);
    [-965, -995, -1025, -1055, -1085].forEach((gz, gIdx) => {
      const gx = (gIdx % 2 === 0 ? 5.5 : -5.5);
      const gy = 54.5 + gIdx * 0.7;
      buildBasaltPlatform(13, 2.0, 16, gx, gy, gz, basaltMat);
      addVolcanoItem("v_c5_" + gIdx, gx, gy + 1.8, gz, gIdx === 2);
    });
    buildBasaltPlatform(22, 2.5, 24, 0, 58.0, -1115, smoothObsidianMat);
    createVolcanoGolem(0, 59.5, -1025, enemies, volcanoExtensionGroup);

    // 6. Aşama: Parlayan Obsidyen Terasları (z: -1115 -> -1300)
    addCheckpoint("volcano_cp_s6", "6. Aşama: Parlayan Obsidyen Terasları [Çok Kolay]", 0, 58.5, -1125);
    buildBasaltPlatform(22, 2.5, 22, 0, 58.0, -1125, basaltMat);
    [-1155, -1185, -1215, -1245, -1275].forEach((tz, tIdx) => {
      const tx = (tIdx % 2 === 0 ? 6.0 : -6.0);
      const ty = 58.5 + tIdx * 0.7;
      buildBasaltPlatform(14, 2.0, 16, tx, ty, tz, smoothObsidianMat);
      addVolcanoItem("v_c6_" + tIdx, tx, ty + 1.8, tz);
    });
    buildBasaltPlatform(22, 2.5, 24, 0, 62.2, -1305, basaltMat);
    createMagmaWurm(0, 63.5, -1215, enemies, volcanoExtensionGroup);

    // 7. Aşama: Lav Şelalesi Geçidi (z: -1305 -> -1490)
    addCheckpoint("volcano_cp_s7", "7. Aşama: Lav Şelalesi Geçidi [Çok Kolay]", 0, 62.8, -1315);
    buildBasaltPlatform(22, 2.5, 22, 0, 62.2, -1315, smoothObsidianMat);
    buildBasaltPlatform(16, 2.0, 32, 0, 62.8, -1345, basaltMat);
    buildBasaltPlatform(18, 2.0, 32, 4, 63.5, -1380, smoothObsidianMat);
    buildBasaltPlatform(16, 2.0, 32, -4, 64.2, -1415, basaltMat);
    buildBasaltPlatform(18, 2.0, 32, 0, 64.8, -1450, smoothObsidianMat);
    buildBasaltPlatform(24, 2.5, 24, 0, 65.5, -1490, basaltMat);
    createBlazeElemental(0, 67.0, -1380, enemies, volcanoExtensionGroup);

    // 8-14. AŞAMALAR [ORTA ZORLUK]: Hareketli platformlar, değirmenler, zamanlama
    // -------------------------------------------------------------------------
    // 8. Aşama: Çapraz Lav Salları (z: -1490 -> -1680)
    addCheckpoint("volcano_cp_s8", "8. Aşama: Çapraz Lav Salları [Orta]", 0, 66.0, -1500);
    buildBasaltPlatform(22, 2.5, 22, 0, 65.5, -1500, smoothObsidianMat);
    [-1535, -1570, -1605, -1640].forEach((mz, mIdx) => {
      const my = 66.0 + mIdx * 0.7;
      const mMesh = new THREE.Mesh(new THREE.BoxGeometry(10, 1.8, 12), basaltMat);
      mMesh.position.set(0, my, mz);
      volcanoExtensionGroup.add(mMesh);
      const coll = {
        min: new THREE.Vector3(-5.0, my - 0.9, mz - 6.0),
        max: new THREE.Vector3(5.0, my + 1.05, mz + 6.0)
      };
      collidables.push(coll);
      volcanoMovingSlabs.push({
        mesh: mMesh,
        baseX: 0,
        rangeX: 8.0,
        speed: 1.8 + mIdx * 0.25,
        offset: mIdx * 1.2,
        halfW: 5.0,
        coll: coll
      });
      addVolcanoItem("v_c8_" + mIdx, 0, my + 1.8, mz, mIdx === 2);
    });
    buildBasaltPlatform(22, 2.5, 24, 0, 69.0, -1680, smoothObsidianMat);
    createObsidianScorpion(0, 70.0, -1605, enemies, volcanoExtensionGroup);

    // 9. Aşama: Dönen Alev Değirmenleri Koridoru (z: -1680 -> -1870)
    addCheckpoint("volcano_cp_s9", "9. Aşama: Dönen Alev Değirmenleri Koridoru [Orta]", 0, 69.5, -1690);
    buildBasaltPlatform(22, 2.5, 22, 0, 69.0, -1690, basaltMat);
    // Fire Mill 1
    const fm1 = new THREE.Group();
    fm1.position.set(0, 71.0, -1740);
    for (let b = 0; b < 4; b++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(14, 0.4, 2.0), crystalFireMat);
      blade.rotation.y = (b / 4) * Math.PI * 2;
      fm1.add(blade);
    }
    volcanoExtensionGroup.add(fm1);
    volcanoFireMills.push({ group: fm1, speed: 1.6 });
    buildOceanBasalt(16, 2.0, 22, 0, 70.0, -1740);

    buildOceanBasalt(14, 1.8, 30, -5, 71.0, -1780);

    // Fire Mill 2
    const fm2 = new THREE.Group();
    fm2.position.set(0, 72.8, -1825);
    for (let b = 0; b < 4; b++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(14, 0.4, 2.0), crystalFireMat);
      blade.rotation.y = (b / 4) * Math.PI * 2;
      fm2.add(blade);
    }
    volcanoExtensionGroup.add(fm2);
    volcanoFireMills.push({ group: fm2, speed: -1.8 });
    buildOceanBasalt(16, 2.0, 22, 0, 72.0, -1825);

    buildBasaltPlatform(22, 2.5, 24, 0, 73.0, -1870, smoothObsidianMat);
    createLavaSalamander(0, 74.0, -1780, enemies, volcanoExtensionGroup);

    function buildOceanBasalt(w, h, d, px, py, pz) {
      return buildBasaltPlatform(w, h, d, px, py, pz, basaltMat);
    }

    // 10. Aşama: Çöken Magma Sütunları (z: -1870 -> -2060)
    addCheckpoint("volcano_cp_s10", "10. Aşama: Çöken Magma Sütunları [Orta]", 0, 73.5, -1880);
    buildBasaltPlatform(22, 2.5, 22, 0, 73.0, -1880, basaltMat);
    [-1910, -1940, -1970, -2000, -2030].forEach((cz, cIdx) => {
      const cx = (cIdx % 2 === 0 ? 5.5 : -5.5);
      const cy = 73.5 + cIdx * 0.7;
      const cMesh = new THREE.Mesh(new THREE.BoxGeometry(10, 1.4, 12), smoothObsidianMat);
      cMesh.position.set(cx, cy, cz);
      volcanoExtensionGroup.add(cMesh);
      const coll = {
        min: new THREE.Vector3(cx - 5.0, cy - 0.7, cz - 6.0),
        max: new THREE.Vector3(cx + 5.0, cy + 0.85, cz + 6.0)
      };
      collidables.push(coll);
      volcanoCrumblingCrusts.push({
        mesh: cMesh,
        baseY: cy,
        coll: coll,
        stepped: false,
        dropTimer: 0.8,
        fallSpeed: 0,
        respawnTimer: 0
      });
      addVolcanoItem("v_c10_" + cIdx, cx, cy + 1.8, cz);
    });
    buildBasaltPlatform(22, 2.5, 24, 0, 77.2, -2060, basaltMat);
    createLavaShaman(0, 78.5, -1970, enemies, volcanoExtensionGroup);

    // 11. Aşama: Düşen Alev Sarkıtları Tüneli (z: -2060 -> -2250)
    addCheckpoint("volcano_cp_s11", "11. Aşama: Alev Sarkıtları [Orta]", 0, 77.8, -2070);
    buildBasaltPlatform(22, 2.5, 22, 0, 77.2, -2070, smoothObsidianMat);
    [-2100, -2130, -2160, -2190, -2220].forEach((iz, iIdx) => {
      const ix = (iIdx % 2 === 0 ? 4.5 : -4.5);
      const iy = 77.8 + iIdx * 0.7;
      buildBasaltPlatform(12, 1.8, 14, ix, iy, iz, basaltMat);
      // Falling Ember above
      const spikeGeo = new THREE.ConeGeometry(1.2, 4.0, 8);
      spikeGeo.rotateX(Math.PI);
      const spikeMesh = new THREE.Mesh(spikeGeo, crystalFireMat);
      spikeMesh.position.set(ix, iy + 16, iz);
      volcanoExtensionGroup.add(spikeMesh);
      volcanoFallingEmbers.push({
        mesh: spikeMesh,
        x: ix,
        z: iz,
        targetY: iy + 1.0,
        triggered: false,
        fallSpeed: 0
      });
      addVolcanoItem("v_c11_" + iIdx, ix, iy + 1.8, iz);
    });
    buildBasaltPlatform(22, 2.5, 24, 0, 81.5, -2250, smoothObsidianMat);
    createEmberDrakelet(0, 83.0, -2160, enemies, volcanoExtensionGroup);

    // 12. Aşama: Lav Gayzer Tırmanışı (z: -2250 -> -2440)
    addCheckpoint("volcano_cp_s12", "12. Aşama: Lav Gayzer Tırmanışı [Orta]", 0, 82.0, -2260);
    buildBasaltPlatform(22, 2.5, 22, 0, 81.5, -2260, basaltMat);
    addMagmaJumpPad(0, 82.0, -2260, 32);
    buildBasaltPlatform(14, 2.0, 16, 0, 90.0, -2295, smoothObsidianMat);
    buildBasaltPlatform(12, 1.8, 14, 6, 88.0, -2325, basaltMat);
    addMagmaJumpPad(6, 89.0, -2325, 30);
    buildBasaltPlatform(14, 2.0, 16, 0, 96.0, -2360, smoothObsidianMat);
    buildBasaltPlatform(12, 1.8, 14, -6, 94.0, -2395, basaltMat);
    addMagmaJumpPad(-6, 95.0, -2395, 30);
    buildBasaltPlatform(14, 2.0, 16, 0, 101.0, -2425, smoothObsidianMat);
    buildBasaltPlatform(22, 2.5, 24, 0, 85.5, -2455, basaltMat);
    createExplodingMagmaBubble(0, 87.0, -2360, enemies, volcanoExtensionGroup);

    // 13. Aşama: Lav Hortumu Tüneli (z: -2455 -> -2645)
    addCheckpoint("volcano_cp_s13", "13. Aşama: Lav Hortumu Tüneli [Orta]", 0, 86.0, -2465);
    buildBasaltPlatform(22, 2.5, 22, 0, 85.5, -2465, smoothObsidianMat);
    buildBasaltPlatform(14, 1.8, 30, -5, 86.2, -2500, basaltMat);
    buildBasaltPlatform(16, 2.0, 20, 5, 87.0, -2535, smoothObsidianMat);
    buildBasaltPlatform(14, 1.8, 30, -5, 87.8, -2570, basaltMat);
    buildBasaltPlatform(16, 2.0, 20, 5, 88.6, -2605, smoothObsidianMat);
    buildBasaltPlatform(22, 2.5, 24, 0, 89.5, -2645, basaltMat);
    createBasaltArmorKnight(0, 91.0, -2550, enemies, volcanoExtensionGroup);

    // 14. Aşama: Lav Şamanı Mabedi (z: -2645 -> -2835)
    addCheckpoint("volcano_cp_s14", "14. Aşama: Lav Şamanı Mabedi [Orta]", 0, 90.0, -2655);
    buildBasaltPlatform(22, 2.5, 22, 0, 89.5, -2655, smoothObsidianMat);
    buildBasaltPlatform(14, 1.8, 30, 0, 90.2, -2690, basaltMat);
    buildBasaltPlatform(16, 2.0, 22, 5, 91.0, -2725, smoothObsidianMat);
    buildBasaltPlatform(14, 1.8, 30, -5, 91.8, -2760, basaltMat);
    buildBasaltPlatform(16, 2.0, 22, 0, 92.6, -2795, smoothObsidianMat);
    buildBasaltPlatform(22, 2.5, 24, 0, 93.5, -2835, basaltMat);
    createLavaShaman(0, 95.0, -2740, enemies, volcanoExtensionGroup);

    // 15-19. AŞAMALAR [ÇOK ZORLU / HARDCORE]: Lazerler, dar kirişler, kaldera tırmanışı
    // -------------------------------------------------------------------------
    // 15. Aşama: Magma Lazer Izgarası (z: -2835 -> -3030)
    addCheckpoint("volcano_cp_s15", "15. Aşama: Magma Lazer Izgarası [Zorlu & Uzun]", 0, 94.0, -2845);
    buildBasaltPlatform(22, 2.5, 22, 0, 93.5, -2845, smoothObsidianMat);
    [-2875, -2910, -2945, -2980, -3015].forEach((lz, lIdx) => {
      const ly = 94.0 + lIdx * 0.8;
      buildBasaltPlatform(12, 1.8, 16, 0, ly, lz, basaltMat);
      // Rotating Magma Laser
      const laserGrp = new THREE.Group();
      laserGrp.position.set(0, ly + 2.0, lz);
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 16), crystalFireMat);
      beam.rotation.z = Math.PI / 2;
      laserGrp.add(beam);
      volcanoExtensionGroup.add(laserGrp);
      volcanoMagmaLasers.push({
        mesh: laserGrp,
        y: ly + 2.0,
        z: lz,
        range: 8.0,
        speed: (lIdx % 2 === 0 ? 2.2 : -2.2)
      });
      addVolcanoItem("v_c15_" + lIdx, 0, ly + 1.8, lz, true);
    });
    buildBasaltPlatform(22, 2.5, 24, 0, 98.2, -3045, smoothObsidianMat);
    createObsidianScorpion(0, 99.5, -2945, enemies, volcanoExtensionGroup);

    // 16. Aşama: Eriyip Düşen Sütunlar (z: -3045 -> -3240)
    addCheckpoint("volcano_cp_s16", "16. Aşama: Eriyip Düşen Sütunlar [Hardcore]", 0, 98.8, -3055);
    buildBasaltPlatform(22, 2.5, 22, 0, 98.2, -3055, basaltMat);
    const s16CrumbleZ = [-3085, -3115, -3145, -3175, -3205];
    s16CrumbleZ.forEach((cz, cIdx) => {
      const cx = (cIdx % 2 === 0 ? 5.0 : -5.0);
      const cy = 98.8 + cIdx * 0.7;
      const cMesh = new THREE.Mesh(new THREE.BoxGeometry(9, 1.4, 11), smoothObsidianMat);
      cMesh.position.set(cx, cy, cz);
      volcanoExtensionGroup.add(cMesh);
      const coll = {
        min: new THREE.Vector3(cx - 4.5, cy - 0.7, cz - 5.5),
        max: new THREE.Vector3(cx + 4.5, cy + 0.85, cz + 5.5)
      };
      collidables.push(coll);
      volcanoCrumblingCrusts.push({
        mesh: cMesh,
        baseY: cy,
        coll: coll,
        stepped: false,
        dropTimer: 0.65,
        fallSpeed: 0,
        respawnTimer: 0
      });
      addVolcanoItem("v_c16_" + cIdx, cx, cy + 1.8, cz);
    });
    buildBasaltPlatform(22, 2.5, 24, 0, 102.5, -3240, basaltMat);
    createEmberDrakelet(0, 104.0, -3145, enemies, volcanoExtensionGroup);

    // 17. Aşama: Dar Obsidyen Kirişleri & Denge Tırmanışı (z: -3240 -> -3430)
    addCheckpoint("volcano_cp_s17", "17. Aşama: Dar Obsidyen Kirişleri [Çok Zorlu]", 0, 103.0, -3250);
    buildBasaltPlatform(22, 2.5, 22, 0, 102.5, -3250, smoothObsidianMat);
    buildBasaltPlatform(4, 2.0, 36, 0, 103.2, -3285, basaltMat);
    buildBasaltPlatform(12, 2.0, 12, 0, 104.0, -3315, smoothObsidianMat);
    buildBasaltPlatform(4, 2.0, 36, -4, 104.8, -3345, basaltMat);
    buildBasaltPlatform(12, 2.0, 12, -4, 105.6, -3375, smoothObsidianMat);
    buildBasaltPlatform(4, 2.0, 36, 4, 106.4, -3405, basaltMat);
    buildBasaltPlatform(22, 2.5, 24, 0, 107.0, -3435, smoothObsidianMat);
    createBasaltArmorKnight(0, 108.5, -3345, enemies, volcanoExtensionGroup);

    // 18. Aşama: Şimşekli Magma Zirvesi & Zıplama Rampası (z: -3435 -> -3630)
    addCheckpoint("volcano_cp_s18", "18. Aşama: Şimşekli Magma Zirvesi [Hardcore]", 0, 107.5, -3445);
    buildBasaltPlatform(22, 2.5, 22, 0, 107.0, -3445, basaltMat);
    buildBasaltPlatform(14, 2.0, 28, 0, 107.8, -3480, smoothObsidianMat);
    buildBasaltPlatform(16, 2.0, 28, -5, 108.6, -3520, basaltMat);
    buildBasaltPlatform(14, 2.0, 28, 5, 109.4, -3560, smoothObsidianMat);
    addMagmaJumpPad(0, 110.0, -3560, 34);
    buildBasaltPlatform(26, 2.5, 28, 0, 110.0, -3630, moltenGoldMat);
    createBlazeElemental(0, 111.0, -3520, enemies, volcanoExtensionGroup);

    // 19. Aşama: [BÜYÜK BOSS] Yüce Volkanik Kaldera 🌋 (z: -3650 -> -3850, Y: 110.0)
    const calderaArenaZ = -3720;
    const calderaArenaY = 110.0;

    addCheckpoint("volcano_cp_s19", "19. Aşama: [BÜYÜK BOSS] Yüce Volkanik Kaldera 🌋", 0, calderaArenaY + 1.2, -3650);

    // Grand Caldera Platform
    buildBasaltPlatform(68, 4.0, 84, 0, calderaArenaY, calderaArenaZ, smoothObsidianMat);
    const lavaEdge = new THREE.Mesh(new THREE.BoxGeometry(70, 0.2, 86), magmaGlowMat);
    lavaEdge.position.set(0, calderaArenaY + 2.05, calderaArenaZ);
    volcanoExtensionGroup.add(lavaEdge);

    // 14 Glowing Basalt Pillars around Caldera
    for (let p = 0; p < 14; p++) {
      const angle = (p / 14) * Math.PI * 2;
      const px = Math.cos(angle) * 36;
      const pz = calderaArenaZ + Math.sin(angle) * 42;
      buildBasaltPlatform(3.5, 28, 3.5, px, calderaArenaY + 14.0, pz, smoothObsidianMat);
      const flameTop = new THREE.Mesh(new THREE.ConeGeometry(2.0, 4.5, 6), crystalFireMat);
      flameTop.position.set(px, calderaArenaY + 28.5, pz);
      volcanoExtensionGroup.add(flameTop);
    }

    if (typeof window.createThematicEntranceEasel === 'function') {
      window.createThematicEntranceEasel(
        game,
        0,
        "👑 YÜCE VOLKANİK KALDERA!\nKızıl Ejderha Ignis'i mağlup et ve Antik Su Altı Sarayı'na açılan portaldan geç!",
        0,
        calderaArenaY + 2.5,
        calderaArenaZ + 36
      );
    }

    // FLYING FLAME DRAGON BOSS (Aşama 19'a taşındı!)
    activeDragonBoss = createFlyingFlameDragonBoss(0, calderaArenaY + 3.0, calderaArenaZ + 10, enemies, volcanoExtensionGroup);

    // Victory Portal behind Dragon: Leads to 7. Bölüm Antik Su Altı Kristal Sarayı
    volcanoVictoryPortal = createVolcanoVictoryPortal(0, calderaArenaY + 2.3, calderaArenaZ - 42, volcanoExtensionGroup);

    console.log("✅ [Volcano Cave Extension] 19 Aşama ve Uçan Ejderha Boss Arenası (Aşama 19) Başarıyla Kuruldu!");
  };

  // =========================================================================
  // 12 ÖZEL YENİ VOLKANİK CANLI (ÖZGÜN 3D MODELLER VE MEKANİKLER)
  // =========================================================================

  function createLavaSalamander(x, y, z, e, g) {
    createVolcanoMonster(x, y, z, e, g, "Lava Salamander 🦎🔥", 0xef4444, 1.2, 90, 12, "crawl");
  }

  function createFirewingBat(x, y, z, e, g) {
    createVolcanoMonster(x, y, z, e, g, "Firewing Bat 🦇🔥", 0xdc2626, 1.4, 70, 10, "swoop");
  }

  function createMagmaCrawler(x, y, z, e, g) {
    createVolcanoMonster(x, y, z, e, g, "Magma Crawler 🕷️🔥", 0xf97316, 1.3, 100, 13, "patrol");
  }

  function createFlameImp(x, y, z, e, g) {
    createVolcanoMonster(x, y, z, e, g, "Flame Imp 👺🔥", 0xb91c1c, 1.1, 80, 14, "hop");
  }

  function createVolcanoGolem(x, y, z, e, g) {
    createVolcanoMonster(x, y, z, e, g, "Volcano Golem 🗿🔥", 0x451a03, 2.2, 180, 18, "stomp");
  }

  function createMagmaWurm(x, y, z, e, g) {
    createVolcanoMonster(x, y, z, e, g, "Magma Wurm 🪱🔥", 0xea580c, 1.8, 130, 15, "breach");
  }

  function createBlazeElemental(x, y, z, e, g) {
    createVolcanoMonster(x, y, z, e, g, "Blaze Elemental 🔮🔥", 0xfacc15, 1.5, 120, 16, "spin");
  }

  function createObsidianScorpion(x, y, z, e, g) {
    createVolcanoMonster(x, y, z, e, g, "Obsidian Scorpion 🦂", 0x18181b, 1.4, 140, 17, "lunge");
  }

  function createLavaShaman(x, y, z, e, g) {
    createVolcanoMonster(x, y, z, e, g, "Lava Shaman 🧙‍♂️🔥", 0x7c2d12, 1.6, 160, 18, "cast");
  }

  function createEmberDrakelet(x, y, z, e, g) {
    createVolcanoMonster(x, y, z, e, g, "Ember Drakelet 🐲🔥", 0xef4444, 1.7, 150, 17, "puff");
  }

  function createExplodingMagmaBubble(x, y, z, e, g) {
    createVolcanoMonster(x, y, z, e, g, "Exploding Magma Bubble 💥", 0xf97316, 1.5, 95, 20, "pulse");
  }

  function createBasaltArmorKnight(x, y, z, e, g) {
    createVolcanoMonster(x, y, z, e, g, "Basalt Armor Knight 🛡️⚔️", 0x334155, 2.0, 200, 20, "heavy");
  }

  function createVolcanoMonster(x, y, z, enemies, group, name, color, size, hp, atk, behavior) {
    const THREE = window.THREE;
    const grp = new THREE.Group();
    grp.position.set(x, y, z);

    const mat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.4,
      emissive: color,
      emissiveIntensity: 0.4
    });

    const body = new THREE.Mesh(new THREE.BoxGeometry(size, size, size), mat);
    body.position.y = size / 2;
    grp.add(body);

    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const eye1 = new THREE.Mesh(new THREE.SphereGeometry(size * 0.15), eyeMat);
    eye1.position.set(-size * 0.25, size * 0.7, size * 0.45);
    grp.add(eye1);
    const eye2 = new THREE.Mesh(new THREE.SphereGeometry(size * 0.15), eyeMat);
    eye2.position.set(size * 0.25, size * 0.7, size * 0.45);
    grp.add(eye2);

    group.add(grp);

    enemies.push({
      id: name.toLowerCase().replace(/[^a-z0-9]/g, '_') + "_" + Math.round(z),
      type: "volcano_creature",
      name: name,
      mesh: grp,
      pos: new THREE.Vector3(x, y, z),
      baseX: x,
      baseY: y,
      baseZ: z,
      hp: hp,
      maxHp: hp,
      attackPower: atk,
      update: function(dt, p, game) {
        const time = Date.now() * 0.002;
        if (behavior === "swoop") {
          this.mesh.position.y = this.baseY + Math.sin(time * 2.0) * 2.5;
          this.mesh.position.x = this.baseX + Math.cos(time) * 4.0;
        } else if (behavior === "hop") {
          this.mesh.position.y = this.baseY + Math.abs(Math.sin(time * 3.0)) * 2.0;
        } else if (behavior === "spin") {
          this.mesh.rotation.y += dt * 3.0;
        } else {
          this.mesh.position.x = this.baseX + Math.sin(time) * 4.5;
        }
        this.pos.copy(this.mesh.position);

        if (this.pos.distanceTo(p) < (size + 1.2)) {
          game.damagePlayer(this.attackPower);
        }
      }
    });
  }

  // =========================================================================
  // FLYING FLAME DRAGON BOSS (KIZIL ALEV EJDERHASI IGNIS)
  // =========================================================================
  function createFlyingFlameDragonBoss(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const bossGrp = new THREE.Group();
    bossGrp.name = "boss_volcano_dragon_flying";
    bossGrp.position.set(x, y, z);
    bossGrp.scale.set(3.8, 3.8, 3.8);

    const redMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, emissive: 0x7f1d1d, emissiveIntensity: 0.5 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xd97706, emissiveIntensity: 0.8 });

    // Dragon Body
    const body = new THREE.Mesh(new THREE.ConeGeometry(1.6, 6.0, 8), redMat);
    body.rotation.x = Math.PI / 2;
    bossGrp.add(body);

    // Dragon Head & Horns
    const head = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.4, 2.4), redMat);
    head.position.set(0, 1.2, 3.2);
    bossGrp.add(head);

    const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1.8, 4), goldMat);
    hornL.position.set(-0.7, 2.2, 2.8);
    hornL.rotation.x = -0.4;
    bossGrp.add(hornL);

    const hornR = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1.8, 4), goldMat);
    hornR.position.set(0.7, 2.2, 2.8);
    hornR.rotation.x = -0.4;
    bossGrp.add(hornR);

    // Dragon Wings
    const wingGeo = new THREE.BoxGeometry(6.0, 0.15, 3.2);
    const wingL = new THREE.Mesh(wingGeo, goldMat);
    wingL.position.set(-3.5, 1.2, 0);
    bossGrp.add(wingL);

    const wingR = new THREE.Mesh(wingGeo, goldMat);
    wingR.position.set(3.5, 1.2, 0);
    bossGrp.add(wingR);

    group.add(bossGrp);

    const bossData = {
      id: "boss_volcano_dragon",
      type: "volcano_dragon_boss",
      name: "Kızıl Alev Ejderhası Ignis 🔥🐉",
      mesh: bossGrp,
      wingL: wingL,
      wingR: wingR,
      pos: bossGrp.position,
      basePos: new THREE.Vector3(x, y, z),
      hp: 1500,
      maxHp: 1500,
      state: "flying",
      shootCooldown: 2.2,
      groundCooldown: 12.0,
      isBoss: true,
      attackPower: 26,
      update: function(dt, p, game) {
        const time = Date.now() * 0.001;
        this.wingL.rotation.z = Math.sin(time * 6.0) * 0.45;
        this.wingR.rotation.z = -Math.sin(time * 6.0) * 0.45;

        this.groundCooldown -= dt;
        if (this.groundCooldown <= 0) {
          this.state = this.state === "flying" ? "ground" : "flying";
          this.groundCooldown = this.state === "flying" ? 14.0 : 7.0;
          if (this.state === "ground" && game.callbacks && game.callbacks.onShowNotice) {
            game.callbacks.onShowNotice("🔥 Ignis yere indi ve şok dalgası yayıyor! Saldır! 💥", "warning");
          }
        }

        if (this.state === "flying") {
          const targetY = this.basePos.y + 14.0 + Math.sin(time * 2.0) * 2.5;
          this.mesh.position.y += (targetY - this.mesh.position.y) * dt * 2.0;
          this.mesh.position.x = this.basePos.x + Math.sin(time * 0.8) * 16.0;
          this.mesh.position.z = this.basePos.z + Math.cos(time * 0.8) * 10.0;
          this.mesh.lookAt(p.x, this.mesh.position.y, p.z);

          this.shootCooldown -= dt;
          if (this.shootCooldown <= 0) {
            this.shootCooldown = 2.0;
            spawnDragonFireball(this.mesh.position, p, game);
          }
        } else {
          // Ground state
          this.mesh.position.y += (this.basePos.y - this.mesh.position.y) * dt * 3.0;
          this.mesh.lookAt(p.x, this.basePos.y, p.z);
        }

        this.pos.copy(this.mesh.position);

        if (this.pos.distanceTo(p) < 10.0) {
          game.damagePlayer(this.attackPower);
        }
      }
    };

    enemies.push(bossData);
    return bossData;
  }

  function spawnDragonFireball(fromPos, toPos, game) {
    const THREE = window.THREE;
    const fireballMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xf97316,
      emissiveIntensity: 2.0
    });
    const fb = new THREE.Mesh(new THREE.SphereGeometry(1.4, 8, 8), fireballMat);
    fb.position.copy(fromPos);
    fb.position.y += 2.0;
    (game.currentLevel.mesh || game.scene).add(fb);

    const dir = new THREE.Vector3().subVectors(toPos, fb.position).normalize();
    activeVolcanoProjectiles.push({
      mesh: fb,
      dir: dir,
      speed: 30.0,
      life: 4.0
    });
  }

  function createVolcanoVictoryPortal(x, y, z, group) {
    const THREE = window.THREE;
    const portalGrp = new THREE.Group();
    portalGrp.name = "volcano_victory_portal";
    portalGrp.position.set(x, y, z);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.8, 0.5, 16, 32),
      new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0891b2, emissiveIntensity: 2.0 })
    );
    ring.position.y = 3.8;
    portalGrp.add(ring);

    group.add(portalGrp);

    return {
      mesh: portalGrp,
      pos: new THREE.Vector3(x, y, z),
      targetRegion: "underwater_palace"
    };
  }

  // =========================================================================
  // UPDATE TICK LOOP
  // =========================================================================
  function updateVolcanoCaveExtension(dt) {
    const game = window.__superBearGame;
    if (!game || game.currentRegion !== 'volcano_cave') return;
    totalTime += dt;

    // Moving Slabs
    volcanoMovingSlabs.forEach(s => {
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
      volcanoCrumblingCrusts.forEach(cp => {
        if (!cp.stepped) {
          const d = Math.hypot(game.playerPos.x - cp.mesh.position.x, game.playerPos.z - cp.mesh.position.z);
          if (d < 3.0 && Math.abs(game.playerPos.y - cp.baseY) < 1.6) cp.stepped = true;
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
    volcanoFireMills.forEach(fm => {
      fm.group.rotation.y += dt * fm.speed;
      if (game.playerPos && fm.group.position.distanceTo(game.playerPos) < 3.5) {
        game.damagePlayer(18);
      }
    });

    // Magma Lasers
    volcanoMagmaLasers.forEach(ml => {
      ml.mesh.rotation.y += dt * ml.speed;
      if (game.playerPos) {
        const d = Math.hypot(game.playerPos.x - ml.mesh.position.x, game.playerPos.z - ml.z);
        if (d < (ml.range || 8.0) && Math.abs(game.playerPos.y - ml.y) < 1.8) {
          game.damagePlayer(20);
        }
      }
    });

    // Falling Embers
    if (game.playerPos) {
      volcanoFallingEmbers.forEach(em => {
        if (!em.triggered) {
          const d = Math.hypot(game.playerPos.x - em.x, game.playerPos.z - em.z);
          if (d < 4.0) em.triggered = true;
        } else if (em.mesh.position.y > em.targetY) {
          em.fallSpeed += dt * 35.0;
          em.mesh.position.y -= em.fallSpeed * dt;
          if (em.mesh.position.distanceTo(game.playerPos) < 2.5) {
            game.damagePlayer(20);
          }
        }
      });
    }

    // Magma Jump Pads
    if (game.playerPos && volcanoJumpPads.length > 0) {
      volcanoJumpPads.forEach(jp => {
        const d = Math.hypot(game.playerPos.x - jp.pos.x, game.playerPos.z - jp.pos.z);
        if (d < 2.2 && Math.abs(game.playerPos.y - jp.pos.y) < 1.4) {
          if (game.playerVel) {
            game.playerVel.y = jp.power || 30.0;
            if (window.St && window.St.playJump) window.St.playJump();
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("🌋 Magma Gayzer Sıçrayışı!", "info");
            }
          }
        }
      });
    }

    // Fireball Projectiles
    for (let i = activeVolcanoProjectiles.length - 1; i >= 0; i--) {
      const proj = activeVolcanoProjectiles[i];
      proj.life -= dt;
      proj.mesh.position.addScaledVector(proj.dir, proj.speed * dt);

      if (game.playerPos && proj.mesh.position.distanceTo(game.playerPos) < 2.5) {
        game.damagePlayer(20);
        proj.life = 0;
      }

      if (proj.life <= 0) {
        if (proj.mesh.parent) proj.mesh.parent.remove(proj.mesh);
        activeVolcanoProjectiles.splice(i, 1);
      }
    }

    // Victory Portal Interaction (Transitions to 7. Antik Su Altı Kristal Sarayı)
    if (volcanoVictoryPortal && game.playerPos) {
      volcanoVictoryPortal.mesh.rotation.y += dt * 0.9;
      const d = volcanoVictoryPortal.pos.distanceTo(game.playerPos);
      if (d < 5.0) {
        const boss = (game.currentLevel && game.currentLevel.enemies || []).find(e => e && e.id === "boss_volcano_dragon");
        const isBossAlive = boss && boss.hp > 0;

        if (isBossAlive && !game._bossDefeatedInCurrentRegion) {
          const now = Date.now();
          if (!volcanoVictoryPortal._lastNotice || now - volcanoVictoryPortal._lastNotice > 2500) {
            volcanoVictoryPortal._lastNotice = now;
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("⚠️ Portaldan geçmek için önce Kızıl Ejderha Ignis'i yenmelisin! ⚔️", "warning");
            }
          }
        } else {
          if (!volcanoVictoryPortal._triggered) {
            volcanoVictoryPortal._triggered = true;
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("🌀 7. Bölüm: Antik Su Altı Kristal Sarayı'na Geçiliyor! 🌊", "success");
            }
            if (window.St && window.St.playGoalFanfare) window.St.playGoalFanfare();
            setTimeout(() => {
              game.loadRegion("underwater_palace");
            }, 800);
          }
        }
      }
    }
  }

  // Hook into game engine update loop
  const tickerInterval = setInterval(() => {
    if (window.__superBearGame) {
      if (!window.__superBearGame._volcanoTickerHooked) {
        window.__superBearGame._volcanoTickerHooked = true;
        const origUpdate = window.__superBearGame.update;
        window.__superBearGame.update = function(dt, totalTime) {
          origUpdate.call(this, dt, totalTime);
          try {
            updateVolcanoCaveExtension(dt);
          } catch(err) {}
        };
      }
      clearInterval(tickerInterval);
    }
  }, 100);

  window.__cleanUpVolcanoCaveExtension = cleanUpVolcanoCaveExtension;
  window.__updateVolcanoCaveExtension = updateVolcanoCaveExtension;

  console.log("🌋 [Volcano Cave Extension] 19-Stage Fully Extended Script Loaded!");
})();
