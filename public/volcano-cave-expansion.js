// ============================================================================
// 🌋 6. BÖLÜM: VOLKANİK EJDERHA MAĞARASI GENİŞLETMESİ
// - 19 YENİ AŞAMA (1-7: Çok Kolay, 8-14: Orta, 15-19: Çok Zorlu)
// - 12 ÖZEL YENİ CANLI VE EŞSİZ MEKANİKLER
// - BOSS YENİLENDİ: Kızıl Alev Ejderhası Ignis artık havada süzülüp devriye geziyor,
//   ağzından alev topları fırlatıyor ve magma şok dalgaları saçıyor!
// - Boss 19. Aşamaya (Yüce Volkanik Kaldera Arenası z: -2150) taşındı!
// ============================================================================
(function() {
  'use strict';

  let volcanoExtensionGroup = null;
  let activeVolcanoProjectiles = [];
  let volcanoMovingSlabs = [];
  let volcanoCrumblingCrusts = [];
  let volcanoFireMills = [];
  let volcanoMagmaLasers = [];
  let volcanoRollingBoulders = [];
  let volcanoFallingEmbers = [];
  let volcanoGeysers = [];
  let activeDragonBoss = null;
  let volcanoVictoryPortal = null;
  let totalTime = 0;

  // Cleanup helper
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
    volcanoRollingBoulders = [];
    volcanoFallingEmbers = [];
    volcanoGeysers = [];
    activeDragonBoss = null;
    volcanoVictoryPortal = null;
  }

  // =========================================================================
  // MAIN VOLCANO CAVE EXTENSION BUILDER
  // =========================================================================
  window.__populateVolcanoCaveExtension = function(game) {
    if (!window.THREE || !game || !game.scene) return;
    const THREE = window.THREE;
    console.log("🌋 [Volcano Cave Extension] 19 Yeni Aşama, 12 Canlı ve Uçan Alev Ejderhası Oluşturuluyor...");

    // Remove old extension group if any
    cleanUpVolcanoCaveExtension();

    // Extend level bounds to allow exploring up to Stage 19 (z: -2300)
    if (game.currentLevel && game.currentLevel.bounds) {
      game.currentLevel.bounds.minZ = -2600;
      game.currentLevel.bounds.maxZ = 160;
      game.currentLevel.bounds.minX = -400;
      game.currentLevel.bounds.maxX = 400;
      game.currentLevel.bounds.minY = -60;
      game.currentLevel.bounds.maxY = 400;
    }

    volcanoExtensionGroup = new THREE.Group();
    volcanoExtensionGroup.name = "volcano_cave_19_stages_expansion";
    game.scene.add(volcanoExtensionGroup);

    const collidables = game.currentLevel.colliders = game.currentLevel.colliders || [];
    const enemies = game.currentLevel.enemies = game.currentLevel.enemies || [];

    // Remove old static dragon boss and premature exit portal if present at z: -176 / -188
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

    // Volcanic Cave Materials
    const basaltMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85, metalness: 0.2 });
    const smoothObsidianMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.2, metalness: 0.8 });
    const magmaGlowMat = new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xea580c, emissiveIntensity: 1.2 });
    const darkLavaRockMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
    const crystalFireMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 1.5 });
    const moltenGoldMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xd97706, emissiveIntensity: 0.8 });

    // Platform builder helper
    function buildBasaltPlatform(w, h, d, px, py, pz, mat, isHazard = false) {
      const platGroup = new THREE.Group();
      platGroup.position.set(px, py, pz);

      const stoneMesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat || basaltMat);
      stoneMesh.castShadow = true;
      stoneMesh.receiveShadow = true;
      platGroup.add(stoneMesh);

      // Glowing magma edge on top
      if (!isHazard) {
        const rim = new THREE.Mesh(new THREE.BoxGeometry(w * 0.95, 0.08, d * 0.95), magmaGlowMat);
        rim.position.y = h / 2 + 0.04;
        platGroup.add(rim);
      }

      volcanoExtensionGroup.add(platGroup);

      // Physics collider
      collidables.push({
        min: new THREE.Vector3(px - w / 2, py - h / 2, pz - d / 2),
        max: new THREE.Vector3(px + w / 2, py + h / 2 + 0.15, pz + d / 2),
        isToxic: isHazard
      });

      return platGroup;
    }

    // Helper: Collectible coin/gem
    function addVolcanoItem(id, x, y, z, isGem = false) {
      if (typeof window.create3DGoldCoin === 'function' && !isGem) {
        const coin = window.create3DGoldCoin(x, y, z, 25);
        if (coin) volcanoExtensionGroup.add(coin);
      } else {
        const geom = isGem ? new THREE.OctahedronGeometry(0.5) : new THREE.CylinderGeometry(0.4, 0.4, 0.15, 12);
        const mesh = new THREE.Mesh(geom, isGem ? crystalFireMat : moltenGoldMat);
        mesh.position.set(x, y, z);
        volcanoExtensionGroup.add(mesh);
      }
    }

    // Helper: Add Checkpoint
    function addCheckpoint(id, name, x, y, z) {
      if (!game.currentLevel.checkpoints) game.currentLevel.checkpoints = [];
      const cpMat = new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xc2410c, emissiveIntensity: 1.0 });
      const cpMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.8, 0.3, 16), cpMat);
      cpMesh.position.set(x, y + 0.15, z);
      volcanoExtensionGroup.add(cpMesh);

      const flag = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.8, 8), crystalFireMat);
      flag.position.set(x, y + 1.2, z);
      volcanoExtensionGroup.add(flag);

      game.currentLevel.checkpoints.push({
        id: id,
        name: name,
        pos: new THREE.Vector3(x, y + 1.5, z)
      });
    }

    // =========================================================================
    // 🌋 ESKİ BOSS YUVASI KAPATILDI (z: -176) & 19 AŞAMAYA GEÇİŞ KÖPRÜSÜ
    // =========================================================================
    const barrierMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9, metalness: 0.3 });
    // Enclosing perimeter battlements
    buildBasaltPlatform(2, 8, 36, -18, 42.0, -176, barrierMat);
    buildBasaltPlatform(2, 8, 36, 18, 42.0, -176, barrierMat);
    buildBasaltPlatform(36, 8, 2, 0, 42.0, -160, barrierMat);

    // Explanatory Banner Easel
    if (typeof window.createThematicEntranceEasel === 'function') {
      window.createThematicEntranceEasel(game, 0, "🌋 Eski Yuva Kapatıldı! Ejderha Ignis 19. Aşamaya (-2150) Taşındı!", 0, 41.5, -168);
    }

    // Broad safe connecting bridge leading directly into Stage 1
    buildBasaltPlatform(12, 1.8, 32, 0, 40.5, -195, basaltMat);

    // =========================================================================
    // 🟢 1-7. AŞAMALAR (ÇOK KOLAY) - GENİŞ VE AFFEDİCİ MAGMA PLATFORMLARI
    // =========================================================================

    // 1. Aşama: Lav Gölü Girişi & Obsidyen Yolu [Çok Kolay] (z: -210 -> -280, Y: 41 -> 43)
    addCheckpoint("volcano_cp_s1", "1. Aşama: Lav Girişi & Obsidyen Yolu [Çok Kolay]", 0, 41.5, -220);
    buildBasaltPlatform(22, 2.5, 24, 0, 40.5, -220, smoothObsidianMat);
    addVolcanoItem("v_c1_0", -4, 42.5, -220);
    addVolcanoItem("v_c1_1", 4, 42.5, -220);

    buildBasaltPlatform(14, 2.0, 36, 0, 41.5, -252, basaltMat);
    addVolcanoItem("v_gem1", 0, 43.5, -252, true);
    // Canlı 1: Magma Semenderi
    createLavaSalamander(0, 42.5, -260, game.currentLevel.enemies, volcanoExtensionGroup);

    // 2. Aşama: Ilık Magma Adacıkları [Çok Kolay] (z: -280 -> -350, Y: 43 -> 45)
    addCheckpoint("volcano_cp_s2", "2. Aşama: Ilık Magma Adacıkları [Çok Kolay]", 0, 43.5, -290);
    buildBasaltPlatform(18, 2.5, 18, 0, 42.5, -290, basaltMat);
    // Geniş ve yakın adacıklar
    [-308, -324, -340].forEach((az, aIdx) => {
      const ax = (aIdx % 2 === 0 ? 3.5 : -3.5);
      buildBasaltPlatform(10, 2.0, 10, ax, 43.2 + aIdx * 0.6, az, basaltMat);
      addVolcanoItem("v_c2_" + aIdx, ax, 45.0 + aIdx * 0.6, az, aIdx === 1);
    });
    // Canlı 2: Alev Kanatlı Mağara Yarasası
    createFirewingBat(0, 47.0, -325, game.currentLevel.enemies, volcanoExtensionGroup);

    // 3. Aşama: Yavaş Yüzen Bazalt Salları [Çok Kolay] (z: -350 -> -420, Y: 45 -> 47)
    addCheckpoint("volcano_cp_s3", "3. Aşama: Yavaş Yüzen Bazalt Salları [Çok Kolay]", 0, 45.5, -360);
    buildBasaltPlatform(18, 2.5, 16, 0, 44.5, -360, basaltMat);
    // 2 Yavaş ve geniş sal
    [-378, -398].forEach((mz, mIdx) => {
      const mMesh = buildBasaltPlatform(9.0, 1.5, 9.0, 0, 45.5 + mIdx * 0.8, mz, smoothObsidianMat);
      volcanoMovingSlabs.push({
        mesh: mMesh,
        coll: collidables[collidables.length - 1],
        baseX: 0,
        baseY: 45.5 + mIdx * 0.8,
        baseZ: mz,
        rangeX: 3.5,
        speed: 1.1,
        offset: mIdx * Math.PI,
        halfW: 4.5
      });
      addVolcanoItem("v_c3_" + mIdx, 0, 47.5 + mIdx * 0.8, mz, true);
    });

    // 4. Aşama: Geniş Köz Köprüsü [Çok Kolay] (z: -420 -> -490, Y: 47 -> 49)
    addCheckpoint("volcano_cp_s4", "4. Aşama: Geniş Köz Köprüsü [Çok Kolay]", 0, 47.5, -430);
    buildBasaltPlatform(20, 2.5, 18, 0, 46.5, -430, basaltMat);
    buildBasaltPlatform(12, 2.0, 44, 0, 47.5, -462, basaltMat);
    // Canlı 3: Obsidyen Lav Golemi
    createObsidianGolem(0, 49.0, -462, game.currentLevel.enemies, volcanoExtensionGroup);

    // 5. Aşama: Hafif Kükürt Bacaları [Çok Kolay] (z: -490 -> -560, Y: 49 -> 51)
    addCheckpoint("volcano_cp_s5", "5. Aşama: Hafif Kükürt Bacaları [Çok Kolay]", 0, 49.5, -500);
    buildBasaltPlatform(18, 2.5, 18, 0, 48.5, -500, basaltMat);
    [-518, -536].forEach((sz, sIdx) => {
      const sx = (sIdx === 0 ? -4.0 : 4.0);
      buildBasaltPlatform(10, 2.0, 10, sx, 49.5 + sIdx * 0.8, sz, basaltMat);
      addVolcanoItem("v_c5_" + sIdx, sx, 51.5 + sIdx * 0.8, sz);
    });

    // 6. Aşama: Parlayan Obsidyen Terasları [Çok Kolay] (z: -560 -> -630, Y: 51 -> 53)
    addCheckpoint("volcano_cp_s6", "6. Aşama: Parlayan Obsidyen Terasları [Çok Kolay]", 0, 51.5, -570);
    buildBasaltPlatform(20, 2.5, 18, 0, 50.5, -570, smoothObsidianMat);
    buildBasaltPlatform(12, 2.0, 38, 0, 51.5, -600, smoothObsidianMat);
    // Canlı 4: Cehennem Akrebi
    createInfernalScorpion(0, 53.0, -600, game.currentLevel.enemies, volcanoExtensionGroup);

    // 7. Aşama: Güvenli Magma Şelalesi Kanyonu [Çok Kolay] (z: -630 -> -710, Y: 53 -> 55)
    addCheckpoint("volcano_cp_s7", "7. Aşama: Magma Şelalesi Kanyonu [Çok Kolay]", 0, 53.5, -640);
    buildBasaltPlatform(22, 2.5, 20, 0, 52.5, -640, basaltMat);
    buildBasaltPlatform(14, 2.0, 45, 0, 53.5, -675, basaltMat);
    addVolcanoItem("v_gem7", 0, 55.5, -675, true);


    // =========================================================================
    // 🟡 8-14. AŞAMALAR (ORTA ZORLUK) - DÖNEN ALEVLER, ÇÖKEN BASAMAKLAR & GAYZERLER
    // =========================================================================

    // 8. Aşama: Aktif Lav Şelalesi & Yüzen Bazalt Taşları [Orta] (z: -710 -> -800, Y: 55 -> 57)
    addCheckpoint("volcano_cp_s8", "8. Aşama: Lav Şelalesi & Yüzen Taşlar [Orta]", 0, 55.5, -720);
    buildBasaltPlatform(18, 2.5, 16, 0, 54.5, -720, basaltMat);
    [-740, -760, -780].forEach((mz, mIdx) => {
      const mMesh = buildBasaltPlatform(6.5, 1.2, 6.5, (mIdx % 2 === 0 ? -3.0 : 3.0), 55.5 + mIdx * 0.7, mz, basaltMat);
      volcanoMovingSlabs.push({
        mesh: mMesh,
        coll: collidables[collidables.length - 1],
        baseX: (mIdx % 2 === 0 ? -3.0 : 3.0),
        baseY: 55.5 + mIdx * 0.7,
        baseZ: mz,
        rangeX: 3.8,
        speed: 1.5,
        offset: mIdx * 1.2,
        halfW: 3.2
      });
      addVolcanoItem("v_c8_" + mIdx, 0, 57.5 + mIdx * 0.7, mz);
    });
    // Canlı 5: Yanardağ Kabuklu Lav Kaplumbağası
    createVolcanicTurtle(0, 57.5, -760, game.currentLevel.enemies, volcanoExtensionGroup);

    // 9. Aşama: Dönen Tekli Ateş Değirmenleri [Orta] (z: -800 -> -890, Y: 57 -> 59)
    addCheckpoint("volcano_cp_s9", "9. Aşama: Dönen Tekli Ateş Değirmenleri [Orta]", 0, 57.5, -810);
    buildBasaltPlatform(18, 2.5, 16, 0, 56.5, -810, basaltMat);

    buildBasaltPlatform(8.0, 1.5, 48, 0, 57.5, -845, basaltMat);
    // Dönen Alev Değirmeni
    const mill9 = new THREE.Group();
    mill9.position.set(0, 59.5, -845);
    for (let i = 0; i < 4; i++) {
      const blade = new THREE.Mesh(new THREE.ConeGeometry(0.35, 2.8, 6), crystalFireMat);
      blade.rotation.z = Math.PI / 2;
      const ang = (i / 4) * Math.PI * 2;
      blade.position.set(Math.cos(ang) * 1.6, Math.sin(ang) * 1.6, 0);
      mill9.add(blade);
    }
    volcanoExtensionGroup.add(mill9);
    volcanoFireMills.push({ group: mill9, speed: 2.2, radius: 2.8 });

    // Canlı 6: Kül Anka Kuşu
    createAshPhoenix(0, 62.0, -850, game.currentLevel.enemies, volcanoExtensionGroup);

    // 10. Aşama: Çöken Magma Kabukları [Orta] (z: -890 -> -980, Y: 59 -> 61)
    addCheckpoint("volcano_cp_s10", "10. Aşama: Çöken Magma Kabukları [Orta]", 0, 59.5, -900);
    buildBasaltPlatform(18, 2.5, 16, 0, 58.5, -900, basaltMat);
    // 4 Çöken kabuk (1.1s zaman)
    [-920, -938, -956].forEach((cz, cIdx) => {
      const cx = (cIdx % 2 === 0 ? -3.0 : 3.0);
      const cy = 59.2 + cIdx * 0.7;
      const cMesh = buildBasaltPlatform(3.5, 0.8, 3.5, cx, cy, cz, darkLavaRockMat);
      volcanoCrumblingCrusts.push({
        mesh: cMesh,
        coll: collidables[collidables.length - 1],
        baseY: cy,
        stepped: false,
        dropTimer: 1.1,
        fallSpeed: 0,
        respawnTimer: 0
      });
      addVolcanoItem("v_c10_" + cIdx, cx, cy + 1.4, cz);
    });

    // 11. Aşama: Püsküren Lav Gayzerleri [Orta] (z: -980 -> -1080, Y: 61 -> 63)
    addCheckpoint("volcano_cp_s11", "11. Aşama: Püsküren Lav Gayzerleri [Orta]", 0, 61.5, -990);
    buildBasaltPlatform(18, 2.5, 16, 0, 60.5, -990, basaltMat);

    buildBasaltPlatform(8.0, 1.5, 52, 0, 61.5, -1030, basaltMat);
    // Gayzer delikleri
    [-1015, -1035, -1055].forEach((gz, gIdx) => {
      const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.2, 0.4, 12), magmaGlowMat);
      hole.position.set((gIdx % 2 === 0 ? -1.8 : 1.8), 62.3, gz);
      volcanoExtensionGroup.add(hole);

      const plume = new THREE.Mesh(new THREE.ConeGeometry(1.2, 4.0, 10), new THREE.MeshBasicMaterial({ color: 0xff4500, transparent: true, opacity: 0.75 }));
      plume.position.set((gIdx % 2 === 0 ? -1.8 : 1.8), 64.5, gz);
      volcanoExtensionGroup.add(plume);
    });
    // Canlı 7: Lav Örümceği
    createMagmaSpider(0, 63.0, -1030, game.currentLevel.enemies, volcanoExtensionGroup);

    // 12. Aşama: Daralan Obsidyen Kirişleri [Orta] (z: -1080 -> -1180, Y: 63 -> 65)
    addCheckpoint("volcano_cp_s12", "12. Aşama: Daralan Obsidyen Kirişleri [Orta]", 0, 63.5, -1090);
    buildBasaltPlatform(18, 2.5, 16, 0, 62.5, -1090, basaltMat);
    buildBasaltPlatform(2.0, 1.0, 55, 0, 63.5, -1130, smoothObsidianMat);
    addVolcanoItem("v_gem12", 0, 65.5, -1130, true);

    // 13. Aşama: Alevli Rüzgar Tüneli [Orta] (z: -1180 -> -1280, Y: 65 -> 67)
    addCheckpoint("volcano_cp_s13", "13. Aşama: Alevli Rüzgar Tüneli [Orta]", 0, 65.5, -1190);
    buildBasaltPlatform(18, 2.5, 16, 0, 64.5, -1190, basaltMat);
    buildBasaltPlatform(8.0, 1.5, 54, 0, 65.5, -1230, basaltMat);
    // Canlı 8: Ateş Hortumu Elementali
    createFireVortex(0, 67.0, -1230, game.currentLevel.enemies, volcanoExtensionGroup);

    // 14. Aşama: Kükürt Dumanı & Zıplama Terasları [Orta] (z: -1280 -> -1390, Y: 67 -> 69)
    addCheckpoint("volcano_cp_s14", "14. Aşama: Kükürt Dumanı & Zıplama Terasları [Orta]", 0, 67.5, -1290);
    buildBasaltPlatform(18, 2.5, 16, 0, 66.5, -1290, basaltMat);
    [-1315, -1340, -1365].forEach((tz, tIdx) => {
      buildBasaltPlatform(8.0, 1.8, 12, (tIdx % 2 === 0 ? 3.0 : -3.0), 67.2 + tIdx * 0.8, tz, basaltMat);
      addVolcanoItem("v_c14_" + tIdx, (tIdx % 2 === 0 ? 3.0 : -3.0), 69.5 + tIdx * 0.8, tz);
    });


    // =========================================================================
    // 🔴 15-19. AŞAMALAR (ÇOK ZORLU & HARDCORE) - ÇİFTLİ DEĞİRMENLER, LAZERLER, ÇIĞ & BOSS
    // =========================================================================

    // 15. Aşama: Kaotik Dönen Çiftli Ateş Değirmenleri [Çok Zorlu] (z: -1390 -> -1530, Y: 69 -> 71)
    addCheckpoint("volcano_cp_s15", "15. Aşama: Çiftli Ateş Değirmenleri [Çok Zorlu]", 0, 69.5, -1400);
    buildBasaltPlatform(20, 2.5, 18, 0, 68.5, -1400, basaltMat);

    buildBasaltPlatform(6.0, 1.5, 60, 0, 69.5, -1450, basaltMat);

    // Çiftli zıt dönen ateş değirmenleri
    const mill15A = new THREE.Group();
    mill15A.position.set(-2.2, 71.5, -1435);
    for (let i = 0; i < 4; i++) {
      const sp = new THREE.Mesh(new THREE.ConeGeometry(0.35, 3.2, 6), crystalFireMat);
      sp.rotation.z = Math.PI / 2;
      const ang = (i / 4) * Math.PI * 2;
      sp.position.set(Math.cos(ang) * 1.8, Math.sin(ang) * 1.8, 0);
      mill15A.add(sp);
    }
    volcanoExtensionGroup.add(mill15A);
    volcanoFireMills.push({ group: mill15A, speed: 2.8, radius: 3.2 });

    const mill15B = new THREE.Group();
    mill15B.position.set(2.2, 71.5, -1465);
    for (let i = 0; i < 4; i++) {
      const sp = new THREE.Mesh(new THREE.ConeGeometry(0.35, 3.2, 6), crystalFireMat);
      sp.rotation.z = Math.PI / 2;
      const ang = (i / 4) * Math.PI * 2;
      sp.position.set(Math.cos(ang) * 1.8, Math.sin(ang) * 1.8, 0);
      mill15B.add(sp);
    }
    volcanoExtensionGroup.add(mill15B);
    volcanoFireMills.push({ group: mill15B, speed: -2.8, radius: 3.2 });

    // Canlı 9: Lav Tazısı
    createLavaHound(0, 71.0, -1460, game.currentLevel.enemies, volcanoExtensionGroup);

    // 16. Aşama: Hızlı Çöken Sivri Bazalt Sütunları [Çok Zorlu] (z: -1530 -> -1680, Y: 71 -> 73)
    addCheckpoint("volcano_cp_s16", "16. Aşama: Hızlı Çöken Bazalt Sütunları [Çok Zorlu]", 0, 71.5, -1540);
    buildBasaltPlatform(20, 2.5, 18, 0, 70.5, -1540, basaltMat);

    // 6 Hızlı çöken sütun (0.55s timer)
    [-1565, -1585, -1605, -1625, -1645].forEach((cz, cIdx) => {
      const cx = (cIdx % 2 === 0 ? -2.8 : 2.8);
      const cy = 71.5 + cIdx * 0.7;
      const cMesh = buildBasaltPlatform(2.4, 0.8, 2.4, cx, cy, cz, darkLavaRockMat);
      volcanoCrumblingCrusts.push({
        mesh: cMesh,
        coll: collidables[collidables.length - 1],
        baseY: cy,
        stepped: false,
        dropTimer: 0.55,
        fallSpeed: 0,
        respawnTimer: 0
      });
      addVolcanoItem("v_c16_" + cIdx, cx, cy + 1.4, cz, cIdx === 2);
    });
    // Canlı 10: Volkan Şamanı & Ateş Rahibi
    createVolcanoShaman(0, 75.0, -1610, game.currentLevel.enemies, volcanoExtensionGroup);

    // 17. Aşama: Yüksek Basınçlı Magma Lazer Izgarası [Çok Zorlu] (z: -1680 -> -1840, Y: 73 -> 75)
    addCheckpoint("volcano_cp_s17", "17. Aşama: Magma Lazer Izgarası [Çok Zorlu]", 0, 73.5, -1690);
    buildBasaltPlatform(20, 2.5, 18, 0, 72.5, -1690, basaltMat);

    buildBasaltPlatform(8.5, 1.5, 65, 0, 73.5, -1745, smoothObsidianMat);

    // 3 Dönen Alev Lazeri
    [-1720, -1745, -1770].forEach((lz, lIdx) => {
      const lMat = new THREE.MeshBasicMaterial({ color: 0xff3300, transparent: true, opacity: 0.85 });
      const lMesh = new THREE.Mesh(new THREE.BoxGeometry(10.0, 0.25, 0.25), lMat);
      lMesh.position.set(0, 75.0, lz);
      volcanoExtensionGroup.add(lMesh);
      volcanoMagmaLasers.push({
        mesh: lMesh,
        speed: (lIdx % 2 === 0 ? 2.5 : -2.8),
        y: 75.0,
        z: lz,
        range: 6.0
      });
    });
    // Canlı 11: Köz Yengeci
    createMoltenCrab(0, 75.0, -1760, game.currentLevel.enemies, volcanoExtensionGroup);

    // 18. Aşama: Şimşekli Magma Çığı & Lav Gülleleri [Ekstrem Zorlu] (z: -1840 -> -2010, Y: 75 -> 77)
    addCheckpoint("volcano_cp_s18", "18. Aşama: Magma Çığı & Lav Gülleleri [Ekstrem]", 0, 75.5, -1850);
    buildBasaltPlatform(22, 2.5, 20, 0, 74.5, -1850, basaltMat);

    // Çığ Kanyonu & Yuvarlanan Lav Gülleleri
    buildBasaltPlatform(11.0, 1.5, 75, 0, 75.5, -1910, darkLavaRockMat);
    for (let bIdx = 0; bIdx < 2; bIdx++) {
      const bGeom = new THREE.SphereGeometry(2.0, 14, 14);
      const bMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, emissive: 0xb91c1c, emissiveIntensity: 1.5 });
      const bMesh = new THREE.Mesh(bGeom, bMat);
      bMesh.position.set((bIdx === 0 ? -2.8 : 2.8), 77.5, -1940 + bIdx * 35);
      volcanoExtensionGroup.add(bMesh);
      volcanoRollingBoulders.push({
        mesh: bMesh,
        baseZ: -1945,
        endZ: -1875,
        speed: 16.0 + bIdx * 4.0,
        z: -1940 + bIdx * 35
      });
    }
    // Canlı 12: Kül Hayaleti & Alev Ruhu
    createAshGhost(0, 78.0, -1930, game.currentLevel.enemies, volcanoExtensionGroup);

    // Tırmanan Dev Bazalt Merdiveni (Zirve Taht Girişi)
    buildBasaltPlatform(16.0, 2.0, 24, 0, 76.5, -1980, basaltMat);
    buildBasaltPlatform(24.0, 2.5, 24, 0, 77.5, -2005, smoothObsidianMat);


    // =========================================================================
    // 👑 19. AŞAMA: [BÜYÜK BOSS ARENASI] YÜCE VOLKANİK KALDERA & ALEV FIRLATAN UÇAN EJDERHA!
    // (z: -2010 -> -2250, Y: 65 -> 80)
    // =========================================================================
    addCheckpoint("volcano_cp_s19", "19. Aşama: [BÜYÜK BOSS] Yüce Volkanik Kaldera 🌋", 0, 66.5, -2035);

    const calderaArenaZ = -2150;
    const calderaArenaY = 64.5;

    // Devasa Kaldera Arenası (85 x 85 birim)
    buildBasaltPlatform(86, 4.0, 86, 0, calderaArenaY, calderaArenaZ, basaltMat);
    buildBasaltPlatform(80, 0.6, 80, 0, calderaArenaY + 2.2, calderaArenaZ, smoothObsidianMat);

    // 12 Devasa Obsidyen Sütunu & Alev Meşaleleri
    for (let p = 0; p < 12; p++) {
      const angle = (p / 12) * Math.PI * 2;
      const px = Math.cos(angle) * 38;
      const pz = calderaArenaZ + Math.sin(angle) * 38;
      buildBasaltPlatform(3.5, 24, 3.5, px, calderaArenaY + 12.0, pz, basaltMat);

      const fireGem = new THREE.Mesh(new THREE.ConeGeometry(2.0, 4.0, 6), crystalFireMat);
      fireGem.position.set(px, calderaArenaY + 25.0, pz);
      volcanoExtensionGroup.add(fireGem);

      const fireLight = new THREE.PointLight(0xff4500, 3.5, 30);
      fireLight.position.set(px, calderaArenaY + 25.5, pz);
      volcanoExtensionGroup.add(fireLight);
    }

    // Taht Bilgi Şövalesi
    if (typeof window.createThematicEntranceEasel === 'function') {
      window.createThematicEntranceEasel(game, 0, "👑 YÜCE VOLKANİK KALDERA!\nAlev Ejderhası Ignis'i mağlup et ve Antik Su Altı Sarayı portalından geç!", 0, calderaArenaY + 2.5, calderaArenaZ - 25);
    }

    // YENİLENMİŞ ALEV FIRLATAN VE UÇAN KIZIL EJDERHA IGNIS BOSS'U
    activeDragonBoss = createFlyingFireDragonBoss(0, calderaArenaY + 6.0, calderaArenaZ, game.currentLevel.enemies, volcanoExtensionGroup);

    // Zafer Portalı: Ejderhanın arkasındaki tahtta (7. Bölüm Antik Su Altı Sarayı)
    volcanoVictoryPortal = createVolcanoVictoryPortal(0, calderaArenaY + 2.2, calderaArenaZ - 32, volcanoExtensionGroup);

    console.log("✅ [Volcano Cave Extension] 19 Yeni Aşama, 12 Canlı ve Uçan Alev Ejderhası Başarıyla Yerleştirildi!");
  };

  // =========================================================================
  // 12 ÖZEL YENİ CANLI / DÜŞMAN MODELLERİ VE MEKANİKLERİ
  // =========================================================================

  // 1. 🦎 Magma Semenderi
  function createLavaSalamander(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const g = new THREE.Group();
    g.position.set(x, y, z);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xd97706, emissive: 0xb45309, emissiveIntensity: 0.6 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 1.8), bodyMat);
    g.add(body);
    const head = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.7, 6), bodyMat);
    head.rotation.x = -Math.PI / 2;
    head.position.set(0, 0.1, 1.1);
    g.add(head);
    group.add(g);

    enemies.push({
      id: "lava_salamander_" + z,
      type: "lava_salamander",
      name: "Magma Semenderi",
      mesh: g,
      pos: new THREE.Vector3(x, y, z),
      velocity: new THREE.Vector3(),
      hp: 45, maxHp: 45, attackPower: 12,
      attackCooldown: 2.2, animTimer: 0,
      update: function(dt, playerPos, gameInstance) {
        this.animTimer += dt;
        g.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
        if (this.pos.distanceTo(playerPos) < 16.0 && this.attackCooldown <= 0) {
          this.attackCooldown = 2.8;
          spawnFireProjectile(this.pos.clone().add(new THREE.Vector3(0, 0.5, 0)), playerPos, 14.0, 12);
        }
      }
    });
  }

  // 2. 🦇 Alev Kanatlı Mağara Yarasası
  function createFirewingBat(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const g = new THREE.Group();
    g.position.set(x, y, z);
    const batMat = new THREE.MeshStandardMaterial({ color: 0x451a03, emissive: 0xef4444, emissiveIntensity: 0.5 });
    const bMesh = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), batMat);
    g.add(bMesh);
    const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 0.4), batMat);
    wingL.position.set(-0.55, 0, 0);
    g.add(wingL);
    const wingR = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 0.4), batMat);
    wingR.position.set(0.55, 0, 0);
    g.add(wingR);
    group.add(g);

    enemies.push({
      id: "firewing_bat_" + z,
      type: "firewing_bat",
      name: "Alev Kanatlı Mağara Yarasası",
      mesh: g,
      pos: new THREE.Vector3(x, y, z),
      baseY: y,
      hp: 35, maxHp: 35, attackPower: 14,
      attackCooldown: 2.0, animTimer: 0,
      update: function(dt, playerPos, gameInstance) {
        this.animTimer += dt;
        wingL.rotation.z = Math.sin(this.animTimer * 12) * 0.5;
        wingR.rotation.z = -Math.sin(this.animTimer * 12) * 0.5;
        this.pos.y = this.baseY + Math.sin(this.animTimer * 3.5) * 1.5;
        const d = this.pos.distanceTo(playerPos);
        if (d < 10.0) {
          const dir = playerPos.clone().sub(this.pos).normalize();
          this.pos.add(dir.multiplyScalar(dt * 4.5));
          if (d < 1.8 && this.attackCooldown <= 0) {
            this.attackCooldown = 1.8;
            gameInstance.damagePlayer(this.attackPower);
          }
        }
      }
    });
  }

  // 3. 🪨 Obsidyen Lav Golemi
  function createObsidianGolem(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const g = new THREE.Group();
    g.position.set(x, y, z);
    const gMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
    const lavaMat = new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xea580c, emissiveIntensity: 1.2 });
    const torso = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.0, 1.2), gMat);
    g.add(torso);
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), lavaMat);
    core.position.set(0, 0.2, 0.5);
    g.add(core);
    group.add(g);

    enemies.push({
      id: "obsidian_golem_" + z,
      type: "obsidian_golem",
      name: "Obsidyen Lav Golemi",
      mesh: g,
      pos: new THREE.Vector3(x, y, z),
      hp: 120, maxHp: 120, attackPower: 22,
      attackCooldown: 3.0, animTimer: 0,
      update: function(dt, playerPos, gameInstance) {
        this.animTimer += dt;
        const d = this.pos.distanceTo(playerPos);
        g.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
        if (d < 14.0 && this.attackCooldown <= 0) {
          this.attackCooldown = 3.2;
          // Magma ground slam
          gameInstance.spawnSparkleParticles(this.pos, 25, 0xf97316);
          if (d < 6.0) {
            gameInstance.damagePlayer(this.attackPower);
            gameInstance.playerVel.y += 8.0;
          }
        }
      }
    });
  }

  // 4. 🦂 Cehennem Akrebi
  function createInfernalScorpion(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const g = new THREE.Group();
    g.position.set(x, y, z);
    const mat = new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.6 });
    const stingerMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 1.5 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 1.4), mat);
    g.add(body);
    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.25, 1.4, 8), mat);
    tail.position.set(0, 0.8, -0.6);
    tail.rotation.x = Math.PI / 4;
    g.add(tail);
    const stinger = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.6, 6), stingerMat);
    stinger.position.set(0, 1.4, -0.9);
    g.add(stinger);
    group.add(g);

    enemies.push({
      id: "infernal_scorpion_" + z,
      type: "infernal_scorpion",
      name: "Cehennem Akrebi",
      mesh: g,
      pos: new THREE.Vector3(x, y, z),
      hp: 60, maxHp: 60, attackPower: 16,
      attackCooldown: 2.2, animTimer: 0,
      update: function(dt, playerPos, gameInstance) {
        this.animTimer += dt;
        g.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
        const d = this.pos.distanceTo(playerPos);
        if (d < 12.0) {
          const dir = playerPos.clone().sub(this.pos).normalize();
          this.pos.add(dir.multiplyScalar(dt * 3.5));
          if (d < 2.0 && this.attackCooldown <= 0) {
            this.attackCooldown = 2.0;
            gameInstance.damagePlayer(this.attackPower);
          }
        }
      }
    });
  }

  // 5. 🐢 Yanardağ Kabuklu Lav Kaplumbağası
  function createVolcanicTurtle(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const g = new THREE.Group();
    g.position.set(x, y, z);
    const shellMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.8 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xea580c, emissiveIntensity: 1.0 });
    const shell = new THREE.Mesh(new THREE.SphereGeometry(0.9, 12, 12), shellMat);
    shell.scale.set(1.1, 0.6, 1.3);
    g.add(shell);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.12, 8, 16), rimMat);
    rim.rotation.x = Math.PI / 2;
    g.add(rim);
    group.add(g);

    enemies.push({
      id: "volcanic_turtle_" + z,
      type: "volcanic_turtle",
      name: "Yanardağ Kabuklu Lav Kaplumbağası",
      mesh: g,
      pos: new THREE.Vector3(x, y, z),
      hp: 85, maxHp: 85, attackPower: 18,
      attackCooldown: 2.0, animTimer: 0, slideSpeed: 0,
      update: function(dt, playerPos, gameInstance) {
        this.animTimer += dt;
        const d = this.pos.distanceTo(playerPos);
        if (d < 14.0) {
          // Slide rapidly towards player
          this.slideSpeed = 8.5;
          const dir = playerPos.clone().sub(this.pos).normalize();
          this.pos.x += dir.x * this.slideSpeed * dt;
          this.pos.z += dir.z * this.slideSpeed * dt;
          g.rotation.y += dt * 10.0;
          if (d < 2.2 && this.attackCooldown <= 0) {
            this.attackCooldown = 2.2;
            gameInstance.damagePlayer(this.attackPower);
            gameInstance.playerVel.add(dir.multiplyScalar(10.0));
          }
        }
      }
    });
  }

  // 6. 🦅 Kül Anka Kuşu
  function createAshPhoenix(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const g = new THREE.Group();
    g.position.set(x, y, z);
    const pMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 1.2 });
    const body = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.2, 8), pMat);
    body.rotation.x = Math.PI / 2;
    g.add(body);
    const wingL = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.6), pMat);
    wingL.position.set(-1.0, 0, 0);
    g.add(wingL);
    const wingR = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.6), pMat);
    wingR.position.set(1.0, 0, 0);
    g.add(wingR);
    group.add(g);

    enemies.push({
      id: "ash_phoenix_" + z,
      type: "ash_phoenix",
      name: "Kül Anka Kuşu",
      mesh: g,
      pos: new THREE.Vector3(x, y, z),
      baseY: y,
      hp: 70, maxHp: 70, attackPower: 16,
      attackCooldown: 2.5, animTimer: 0,
      update: function(dt, playerPos, gameInstance) {
        this.animTimer += dt;
        wingL.rotation.z = Math.sin(this.animTimer * 10) * 0.45;
        wingR.rotation.z = -Math.sin(this.animTimer * 10) * 0.45;
        this.pos.y = this.baseY + Math.sin(this.animTimer * 2.5) * 2.0;
        const d = this.pos.distanceTo(playerPos);
        if (d < 18.0 && this.attackCooldown <= 0) {
          this.attackCooldown = 3.0;
          spawnFireProjectile(this.pos.clone(), playerPos, 16.0, 16);
        }
      }
    });
  }

  // 7. 🕷️ Lav Örümceği
  function createMagmaSpider(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const g = new THREE.Group();
    g.position.set(x, y, z);
    const sMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.7 });
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), sMat);
    g.add(body);
    const eye1 = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), eyeMat);
    eye1.position.set(-0.2, 0.2, 0.45);
    g.add(eye1);
    const eye2 = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), eyeMat);
    eye2.position.set(0.2, 0.2, 0.45);
    g.add(eye2);
    group.add(g);

    enemies.push({
      id: "magma_spider_" + z,
      type: "magma_spider",
      name: "Lav Örümceği",
      mesh: g,
      pos: new THREE.Vector3(x, y, z),
      hp: 65, maxHp: 65, attackPower: 15,
      attackCooldown: 2.0, animTimer: 0,
      update: function(dt, playerPos, gameInstance) {
        this.animTimer += dt;
        const d = this.pos.distanceTo(playerPos);
        g.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
        if (d < 12.0) {
          const dir = playerPos.clone().sub(this.pos).normalize();
          this.pos.add(dir.multiplyScalar(dt * 3.8));
          if (d < 1.8 && this.attackCooldown <= 0) {
            this.attackCooldown = 1.8;
            gameInstance.damagePlayer(this.attackPower);
          }
        }
      }
    });
  }

  // 8. 🌪️ Ateş Hortumu Elementali
  function createFireVortex(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const g = new THREE.Group();
    g.position.set(x, y, z);
    const fMat = new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.8 });
    const cone1 = new THREE.Mesh(new THREE.ConeGeometry(1.2, 2.5, 10), fMat);
    cone1.rotation.x = Math.PI;
    g.add(cone1);
    const cone2 = new THREE.Mesh(new THREE.ConeGeometry(0.8, 1.8, 8), new THREE.MeshBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.9 }));
    cone2.rotation.x = Math.PI;
    cone2.position.y = 0.4;
    g.add(cone2);
    group.add(g);

    enemies.push({
      id: "fire_vortex_" + z,
      type: "fire_vortex",
      name: "Ateş Hortumu Elementali",
      mesh: g,
      pos: new THREE.Vector3(x, y, z),
      baseX: x,
      hp: 90, maxHp: 90, attackPower: 16,
      attackCooldown: 1.5, animTimer: 0,
      update: function(dt, playerPos, gameInstance) {
        this.animTimer += dt;
        g.rotation.y += dt * 8.0;
        this.pos.x = this.baseX + Math.sin(this.animTimer * 2.2) * 3.5;
        const d = this.pos.distanceTo(playerPos);
        if (d < 2.5 && this.attackCooldown <= 0) {
          this.attackCooldown = 1.5;
          gameInstance.damagePlayer(this.attackPower);
          gameInstance.playerVel.x += (Math.random() - 0.5) * 12.0;
          gameInstance.playerVel.y += 6.0;
        }
      }
    });
  }

  // 9. 🐕 Lav Tazısı
  function createLavaHound(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const g = new THREE.Group();
    g.position.set(x, y, z);
    const hMat = new THREE.MeshStandardMaterial({ color: 0x451a03, emissive: 0x7c2d12, emissiveIntensity: 0.8 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 1.8), hMat);
    g.add(body);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.7), hMat);
    head.position.set(0, 0.4, 1.0);
    g.add(head);
    group.add(g);

    enemies.push({
      id: "lava_hound_" + z,
      type: "lava_hound",
      name: "Lav Tazısı",
      mesh: g,
      pos: new THREE.Vector3(x, y, z),
      hp: 110, maxHp: 110, attackPower: 20,
      attackCooldown: 1.8, animTimer: 0,
      update: function(dt, playerPos, gameInstance) {
        this.animTimer += dt;
        g.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
        const d = this.pos.distanceTo(playerPos);
        if (d < 16.0) {
          const dir = playerPos.clone().sub(this.pos).normalize();
          this.pos.add(dir.multiplyScalar(dt * 5.5)); // Fast sprint
          if (d < 2.2 && this.attackCooldown <= 0) {
            this.attackCooldown = 1.8;
            gameInstance.damagePlayer(this.attackPower);
          }
        }
      }
    });
  }

  // 10. 🧙‍♂️ Volkan Şamanı & Ateş Rahibi
  function createVolcanoShaman(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const g = new THREE.Group();
    g.position.set(x, y, z);
    const sMat = new THREE.MeshStandardMaterial({ color: 0x7f1d1d, emissive: 0x991b1b, emissiveIntensity: 0.6 });
    const robe = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.8, 2.0, 10), sMat);
    g.add(robe);
    const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.8, 8), sMat);
    staff.position.set(0.6, 0.3, 0.3);
    g.add(staff);
    const staffOrb = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xf59e0b, emissiveIntensity: 1.5 }));
    staffOrb.position.set(0.6, 1.7, 0.3);
    g.add(staffOrb);
    group.add(g);

    enemies.push({
      id: "volcano_shaman_" + z,
      type: "volcano_shaman",
      name: "Volkan Şamanı & Ateş Rahibi",
      mesh: g,
      pos: new THREE.Vector3(x, y, z),
      hp: 130, maxHp: 130, attackPower: 22,
      attackCooldown: 2.8, animTimer: 0,
      update: function(dt, playerPos, gameInstance) {
        this.animTimer += dt;
        g.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
        const d = this.pos.distanceTo(playerPos);
        if (d < 22.0 && this.attackCooldown <= 0) {
          this.attackCooldown = 3.2;
          // Fire pillar projectile
          spawnFireProjectile(this.pos.clone().add(new THREE.Vector3(0, 1.5, 0)), playerPos, 16.0, 20);
        }
      }
    });
  }

  // 11. 🦀 Köz Yengeci
  function createMoltenCrab(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const g = new THREE.Group();
    g.position.set(x, y, z);
    const cMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.6 });
    const carapace = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.6, 1.2), cMat);
    g.add(carapace);
    const clawL = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.7), cMat);
    clawL.position.set(-0.9, 0.1, 0.7);
    g.add(clawL);
    const clawR = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.7), cMat);
    clawR.position.set(0.9, 0.1, 0.7);
    g.add(clawR);
    group.add(g);

    enemies.push({
      id: "molten_crab_" + z,
      type: "molten_crab",
      name: "Köz Yengeci",
      mesh: g,
      pos: new THREE.Vector3(x, y, z),
      hp: 140, maxHp: 140, attackPower: 18,
      attackCooldown: 2.0, animTimer: 0,
      update: function(dt, playerPos, gameInstance) {
        this.animTimer += dt;
        const d = this.pos.distanceTo(playerPos);
        g.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
        if (d < 12.0) {
          const dir = playerPos.clone().sub(this.pos).normalize();
          this.pos.add(dir.multiplyScalar(dt * 3.2));
          if (d < 2.2 && this.attackCooldown <= 0) {
            this.attackCooldown = 1.8;
            gameInstance.damagePlayer(this.attackPower);
          }
        }
      }
    });
  }

  // 12. 👻 Kül Hayaleti & Alev Ruhu
  function createAshGhost(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const g = new THREE.Group();
    g.position.set(x, y, z);
    const ghostMat = new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.75 });
    const shroud = new THREE.Mesh(new THREE.ConeGeometry(0.7, 1.8, 8), ghostMat);
    shroud.position.y = 0.9;
    g.add(shroud);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), ghostMat);
    head.position.y = 1.8;
    g.add(head);
    group.add(g);

    enemies.push({
      id: "ash_ghost_" + z,
      type: "ash_ghost",
      name: "Kül Hayaleti & Alev Ruhu",
      mesh: g,
      pos: new THREE.Vector3(x, y, z),
      baseY: y,
      hp: 100, maxHp: 100, attackPower: 18,
      attackCooldown: 2.0, animTimer: 0,
      update: function(dt, playerPos, gameInstance) {
        this.animTimer += dt;
        this.pos.y = this.baseY + Math.sin(this.animTimer * 2.8) * 1.2;
        const d = this.pos.distanceTo(playerPos);
        if (d < 15.0) {
          const dir = playerPos.clone().sub(this.pos).normalize();
          this.pos.add(dir.multiplyScalar(dt * 4.2));
          if (d < 2.0 && this.attackCooldown <= 0) {
            this.attackCooldown = 2.0;
            gameInstance.damagePlayer(this.attackPower);
            gameInstance.playerVel.multiplyScalar(0.5); // smoke slow
          }
        }
      }
    });
  }

  // =========================================================================
  // FLYING & FIRE-SHOOTING VOLCANIC DRAGON BOSS (IGNIS)
  // =========================================================================
  function createFlyingFireDragonBoss(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const bossGroup = new THREE.Group();
    bossGroup.name = "boss_volcano_dragon_flying";
    bossGroup.position.set(x, y, z);
    bossGroup.scale.set(3.2, 3.2, 3.2);

    const redDragonMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.5, metalness: 0.4 });
    const bellyMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.6 });
    const hornMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.8 });
    const wingMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, emissive: 0x7f1d1d, emissiveIntensity: 0.5 });
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });

    // Torso
    const torso = new THREE.Mesh(new THREE.ConeGeometry(0.9, 2.6, 10), redDragonMat);
    torso.rotation.x = Math.PI / 2;
    bossGroup.add(torso);

    const belly = new THREE.Mesh(new THREE.SphereGeometry(0.75, 10, 10), bellyMat);
    belly.position.set(0, -0.2, 0.4);
    bossGroup.add(belly);

    // Neck & Head
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 1.2, 8), redDragonMat);
    neck.position.set(0, 0.8, 1.2);
    neck.rotation.x = 0.4;
    bossGroup.add(neck);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.6, 1.2), redDragonMat);
    head.position.set(0, 1.3, 1.8);
    bossGroup.add(head);

    // Horns
    const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.9, 6), hornMat);
    hornL.position.set(-0.35, 1.8, 1.5);
    hornL.rotation.x = -0.3;
    bossGroup.add(hornL);

    const hornR = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.9, 6), hornMat);
    hornR.position.set(0.35, 1.8, 1.5);
    hornR.rotation.x = -0.3;
    bossGroup.add(hornR);

    // Eyes
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 6), eyeMat);
    eyeL.position.set(-0.35, 1.5, 2.1);
    bossGroup.add(eyeL);

    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 6), eyeMat);
    eyeR.position.set(0.35, 1.5, 2.1);
    bossGroup.add(eyeR);

    // Giant Wings
    const wingL = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.12, 1.6), wingMat);
    wingL.name = "dragon_wing_left";
    wingL.position.set(-2.2, 0.6, 0.2);
    bossGroup.add(wingL);

    const wingR = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.12, 1.6), wingMat);
    wingR.name = "dragon_wing_right";
    wingR.position.set(2.2, 0.6, 0.2);
    bossGroup.add(wingR);

    // Tail
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.4, 2.5, 8), redDragonMat);
    tail.rotation.x = -Math.PI / 2;
    tail.position.set(0, 0.1, -1.8);
    bossGroup.add(tail);

    group.add(bossGroup);

    const bossData = {
      id: "boss_volcano_dragon",
      type: "volcano_dragon_boss",
      name: "Kızıl Alev Ejderhası Ignis (Dev Uçan Boss 🌋)",
      mesh: bossGroup,
      pos: new THREE.Vector3(x, y, z),
      spawnPos: new THREE.Vector3(x, y, z),
      basePos: new THREE.Vector3(x, y, z),
      velocity: new THREE.Vector3(),
      hp: 850,
      maxHp: 850,
      attackPower: 26,
      isBoss: true,
      attackCooldown: 2.2,
      slamCooldown: 12.0,
      animTimer: 0,
      patrolAngle: 0,
      state: "fly_patrol",
      update: function(dt, playerPos, gameInstance) {
        this.animTimer += dt;
        this.patrolAngle += dt * 0.7;

        // Wing flapping animation
        const flap = Math.sin(this.animTimer * 6.5) * 0.45;
        wingL.rotation.z = flap;
        wingR.rotation.z = -flap;

        const dist = this.pos.distanceTo(playerPos);

        // Fly patrol in large circular swoop over the caldera
        const hoverY = this.basePos.y + Math.sin(this.animTimer * 2.0) * 3.5;
        const targetX = this.basePos.x + Math.cos(this.patrolAngle) * 16.0;
        const targetZ = this.basePos.z + Math.sin(this.patrolAngle) * 16.0;

        this.pos.x += (targetX - this.pos.x) * dt * 2.0;
        this.pos.y += (hoverY - this.pos.y) * dt * 2.0;
        this.pos.z += (targetZ - this.pos.z) * dt * 2.0;

        // Face player
        bossGroup.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);

        // 1. Fireball Spitting Attack (Every 2.4 seconds)
        if (this.attackCooldown <= 0 && dist < 45.0) {
          this.attackCooldown = 2.4;
          const mouthPos = this.pos.clone().add(new THREE.Vector3(0, 3.5, 3.0));
          spawnFireProjectile(mouthPos, playerPos, 19.0, 24);
          if (window.St && window.St.playBossRoar) window.St.playBossRoar();
          if (gameInstance.callbacks && gameInstance.callbacks.onShowNotice) {
            gameInstance.callbacks.onShowNotice("🔥 Ignis Devasa Alev Topu Fırlattı!", "warning");
          }
        }

        // 2. Periodic Ground Slam Shockwave (Every 11 seconds)
        this.slamCooldown -= dt;
        if (this.slamCooldown <= 0 && dist < 30.0) {
          this.slamCooldown = 11.0;
          gameInstance.spawnSparkleParticles(this.pos, 35, 0xef4444);
          if (window.St && window.St.playHammerSlam) window.St.playHammerSlam();
          if (dist < 12.0) {
            gameInstance.damagePlayer(this.attackPower);
            gameInstance.playerVel.y += 12.0;
          }
        }
      }
    };

    enemies.push(bossData);
    return bossData;
  }

  // =========================================================================
  // FIREBALL PROJECTILE SYSTEM
  // =========================================================================
  function spawnFireProjectile(startPos, targetPos, speed = 18.0, damage = 20) {
    const THREE = window.THREE;
    const pMat = new THREE.MeshStandardMaterial({
      color: 0xff3300,
      emissive: 0xff4500,
      emissiveIntensity: 2.0,
      roughness: 0.2
    });
    const pMesh = new THREE.Mesh(new THREE.SphereGeometry(0.75, 12, 12), pMat);
    pMesh.position.copy(startPos);
    volcanoExtensionGroup.add(pMesh);

    const dir = targetPos.clone().sub(startPos).normalize();
    // Add slight upward arc
    dir.y += 0.08;
    dir.normalize();

    activeVolcanoProjectiles.push({
      mesh: pMesh,
      pos: startPos.clone(),
      vel: dir.multiplyScalar(speed),
      life: 4.5,
      damage: damage,
      update: function(dt) {
        this.life -= dt;
        this.pos.addScaledVector(this.vel, dt);
        this.mesh.position.copy(this.pos);

        const game = window.__superBearGame;
        if (game && game.playerPos) {
          if (this.pos.distanceTo(game.playerPos) < 2.0) {
            this.life = 0;
            game.damagePlayer(this.damage);
            game.playerVel.add(this.vel.clone().multiplyScalar(0.4));
            game.spawnSparkleParticles(this.pos, 20, 0xff4500);
          }
        }
      }
    });
  }

  // =========================================================================
  // VICTORY EXIT PORTAL TO 7. BÖLÜM (ANTİK SU ALTI KRİSTAL SARAYI)
  // =========================================================================
  function createVolcanoVictoryPortal(x, y, z, group) {
    const THREE = window.THREE;
    const portalGroup = new THREE.Group();
    portalGroup.name = "volcano_stage19_victory_portal";
    portalGroup.position.set(x, y, z);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.8, 0.5, 16, 32),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, emissive: 0x0369a1, emissiveIntensity: 1.8 })
    );
    ring.position.y = 3.8;
    portalGroup.add(ring);

    const vortex = new THREE.Mesh(
      new THREE.CircleGeometry(3.5, 32),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
    );
    vortex.position.y = 3.8;
    portalGroup.add(vortex);

    group.add(portalGroup);

    return {
      mesh: portalGroup,
      pos: new THREE.Vector3(x, y, z),
      _triggered: false,
      _lastNotice: 0
    };
  }

  // =========================================================================
  // FRAME UPDATE LOOP FOR HAZARDS, PROJECTILES & PORTAL
  // =========================================================================
  function updateVolcanoCaveExtension(dt) {
    const game = window.__superBearGame;
    if (!game || game.currentRegion !== 'volcano_cave') return;
    totalTime += dt;

    // 1. Moving Basalt Slabs
    volcanoMovingSlabs.forEach(ms => {
      const offX = Math.sin(totalTime * ms.speed + ms.offset) * ms.rangeX;
      ms.mesh.position.x = ms.baseX + offX;
      const hw = ms.halfW || 3.0;
      if (ms.coll) {
        ms.coll.min.x = ms.baseX + offX - hw;
        ms.coll.max.x = ms.baseX + offX + hw;
      }
    });

    // 2. Crumbling Magma Crusts
    if (game.playerPos) {
      volcanoCrumblingCrusts.forEach(cp => {
        if (!cp.stepped) {
          const d = Math.hypot(game.playerPos.x - cp.mesh.position.x, game.playerPos.z - cp.mesh.position.z);
          if (d < 1.8 && Math.abs(game.playerPos.y - cp.baseY) < 1.2) {
            cp.stepped = true;
          }
        } else if (cp.dropTimer > 0) {
          cp.dropTimer -= dt;
          cp.mesh.position.x += (Math.random() - 0.5) * 0.16;
          if (cp.dropTimer <= 0 && cp.coll) {
            cp.coll.min.y = -999;
          }
        } else {
          cp.fallSpeed += dt * 30.0;
          cp.mesh.position.y -= cp.fallSpeed * dt;
          cp.respawnTimer += dt;
          if (cp.respawnTimer > 4.5) {
            cp.stepped = false;
            cp.dropTimer = 0.8;
            cp.fallSpeed = 0;
            cp.respawnTimer = 0;
            cp.mesh.position.y = cp.baseY;
            if (cp.coll) cp.coll.min.y = cp.baseY - 0.4;
          }
        }
      });
    }

    // 3. Rotating Fire Mills
    volcanoFireMills.forEach(fm => {
      fm.group.rotation.y += dt * fm.speed;
      if (game.playerPos && fm.group.position.distanceTo(game.playerPos) < (fm.radius || 2.8)) {
        game.damagePlayer(16);
      }
    });

    // 4. Magma Lasers
    volcanoMagmaLasers.forEach(ml => {
      ml.mesh.rotation.y += dt * ml.speed;
      if (game.playerPos) {
        const sweepDist = ml.range || 6.0;
        const d = Math.hypot(game.playerPos.x - ml.mesh.position.x, game.playerPos.z - ml.z);
        if (d < sweepDist && Math.abs(game.playerPos.y - ml.y) < 1.6) {
          const pAngle = Math.atan2(game.playerPos.z - ml.z, game.playerPos.x - ml.mesh.position.x);
          let diff = Math.abs(pAngle - ml.mesh.rotation.y) % (Math.PI * 2);
          if (diff < 0.28 || Math.abs(diff - Math.PI) < 0.28) {
            game.damagePlayer(18);
          }
        }
      }
    });

    // 5. Rolling Magma Boulders
    volcanoRollingBoulders.forEach(rb => {
      rb.z += dt * rb.speed;
      rb.mesh.position.z = rb.z;
      rb.mesh.rotation.x += dt * 8.0;
      const maxZ = rb.endZ !== undefined ? rb.endZ : -1875;
      if (rb.z > maxZ) rb.z = rb.baseZ;
      if (game.playerPos && rb.mesh.position.distanceTo(game.playerPos) < 2.5) {
        game.damagePlayer(20);
        game.playerVel.z += 14.0;
        game.playerVel.y = 7.0;
      }
    });

    // 6. Active Projectiles
    for (let i = activeVolcanoProjectiles.length - 1; i >= 0; i--) {
      const p = activeVolcanoProjectiles[i];
      p.update(dt);
      if (p.life <= 0) {
        if (p.mesh && p.mesh.parent) p.mesh.parent.remove(p.mesh);
        activeVolcanoProjectiles.splice(i, 1);
      }
    }

    // 7. Victory Portal Interaction
    if (volcanoVictoryPortal && game.playerPos) {
      volcanoVictoryPortal.mesh.rotation.y += dt * 0.8;
      const d = volcanoVictoryPortal.pos.distanceTo(game.playerPos);
      if (d < 4.0) {
        const isBossDefeated = !!(
          game._bossDefeatedInCurrentRegion ||
          (typeof window !== "undefined" && window.__superBossDefeatedRegions && (window.__superBossDefeatedRegions["volcano_cave"] || window.__superBossDefeatedRegions["boss_volcano_dragon"])) ||
          (typeof window !== "undefined" && window.__superBearSaveManager && !!(
            window.__superBearSaveManager.getSaveData()?.levelsProgress?.["volcano_cave"]?.bossDefeated ||
            window.__superBearSaveManager.getSaveData()?.levelsProgress?.["underwater_palace"]?.unlocked
          ))
        );
        const isBossAlive = !isBossDefeated && (game.currentLevel && game.currentLevel.enemies || []).some(
          e => e && e.id === "boss_volcano_dragon" && e.hp > 0 && e.state !== "dead"
        );

        if (isBossAlive) {
          const now = Date.now();
          if (!volcanoVictoryPortal._lastNotice || now - volcanoVictoryPortal._lastNotice > 2500) {
            volcanoVictoryPortal._lastNotice = now;
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("⚠️ Antik Su Altı Sarayı portalından geçmek için önce Kızıl Ejderha Ignis'i yenmelisin! ⚔️", "warning");
            }
          }
        } else {
          if (!volcanoVictoryPortal._triggered) {
            volcanoVictoryPortal._triggered = true;
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("🌀 7. Bölüm: Antik Su Altı Kristal Sarayı'na Geçiliyor! 🌊", "success");
            }
            if (game.spawnSparkleParticles) {
              game.spawnSparkleParticles(volcanoVictoryPortal.pos, 45, 0x38bdf8);
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

  // =========================================================================
  // INIT TICKER
  // =========================================================================
  function initVolcanoTicker() {
    let lastTime = performance.now();
    function tick(now) {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      if (window.__superBearGame && window.__superBearGame.currentRegion === 'volcano_cave') {
        updateVolcanoCaveExtension(dt);
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const tickerInterval = setInterval(() => {
    if (window.__superBearGame) {
      initVolcanoTicker();
      clearInterval(tickerInterval);
    }
  }, 100);

  window.__cleanUpVolcanoCaveExtension = cleanUpVolcanoCaveExtension;
  window.__updateVolcanoCaveExtension = updateVolcanoCaveExtension;

  console.log("🌋 [Volcano Cave Extension] Script Loaded & Ready!");
})();
