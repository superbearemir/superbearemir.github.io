// ============================================================================
// ❄️ 5. BÖLÜM: KARLI DAĞLAR & KAR VADİSİ GENİŞLETMESİ (14 ZORLU AŞAMA & 10 ÖZEL CANLI)
// - Boss 14. Aşamada (Yüce Donmuş Taht Zirvesi z: -1496) yer almaktadır.
// - 14 Zorlu Aşama ve 10 Özel Canlı
// ============================================================================
(function() {
  'use strict';

  let snowExtensionGroup = null;
  let activeSnowProjectiles = [];
  let snowMovingFloes = [];
  let snowCrumblingCrusts = [];
  let snowRotatingIceMills = [];
  let snowFrostLasers = [];
  let snowAvalancheBoulders = [];
  let snowFallingIcicles = [];
  let activeBigfootBoss = null;
  let snowVictoryPortal = null;
  let snowCustomCreatures = [];
  let totalTime = 0;

  window.__freezePlayer = function(duration = 1.5) {
    const game = window.__superBearGame;
    if (!game || !game.playerVel) return;
    if (game._isFrozenInIce) return;
    game._isFrozenInIce = true;
    const origSpeed = game.stats.moveSpeed || 7.5;
    game.stats.moveSpeed = 0;
    game.playerVel.x = 0;
    game.playerVel.z = 0;
    if (window.St && window.St.playDamage) window.St.playDamage();
    game.spawnSparkleParticles(game.playerPos, 25, 0x38bdf8);
    if (game.callbacks && game.callbacks.onShowNotice) {
      game.callbacks.onShowNotice("🧊 BUZ TUTTUN! 1.5 Saniye Kıpırdayamazsın! ❄️", "warning");
    }
    setTimeout(() => {
      game.stats.moveSpeed = origSpeed;
      game._isFrozenInIce = false;
      game.spawnSparkleParticles(game.playerPos, 18, 0x93c5fd);
    }, duration * 1000);
  };

  window.__populateSnowDesertExtension = function(
    sceneGroup, collidables, platforms, enemies, items, easels, npcs,
    checkpoints, addCheckpoint, R, b, S, T, z, v, U, N, B, A
  ) {
    if (!window.THREE) return;
    const THREE = window.THREE;
    console.log("❄️ [Snow Desert Extension] 14 Zorlu Aşama ve 10 Özel Canlı Oluşturuluyor...");

    const gameInstance = window.__superBearGame;
    if (gameInstance && gameInstance.currentLevel && gameInstance.currentLevel.bounds) {
      gameInstance.currentLevel.bounds.minZ = -2200;
      gameInstance.currentLevel.bounds.maxY = 350;
      gameInstance.currentLevel.bounds.maxZ = 120;
      gameInstance.currentLevel.bounds.minX = -300;
      gameInstance.currentLevel.bounds.maxX = 300;
      gameInstance.currentLevel.bounds.minY = -50;
      gameInstance.currentLevel.bounds.maxY = 300;
    }

    snowExtensionGroup = new THREE.Group();
    snowExtensionGroup.name = "snow_desert_14_stages_extension";
    sceneGroup.add(snowExtensionGroup);

    activeSnowProjectiles = [];
    snowMovingFloes = [];
    snowCrumblingCrusts = [];
    snowRotatingIceMills = [];
    snowFrostLasers = [];
    snowAvalancheBoulders = [];
    snowFallingIcicles = [];
    snowCustomCreatures = [];
    activeBigfootBoss = null;
    snowVictoryPortal = null;

    const iceGlacierMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.35,
      roughness: 0.05,
      metalness: 0.1,
      transparent: true,
      opacity: 0.92
    });
    const snowWhiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.9 });
    const frostCrystalMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.0,
      metalness: 0.5
    });

    let snowIceBoxes = [];
    function buildSnowPlatform(w, h, d, px, py, pz, mat, isHazard = false, isClimbable = false, isIce = true) {
      const mesh = R(w, h, d, px, py, pz, mat, isHazard, isClimbable, isIce);
      if (isIce && !isHazard) {
        snowIceBoxes.push({
          minX: px - w / 2, maxX: px + w / 2,
          minZ: pz - d / 2, maxZ: pz + d / 2,
          topY: py + h / 2
        });
      }
      return mesh;
    }

    // =========================================================================
    // ❄️ ESKİ BOSS İNİ KAPATILDI (z: -195) & 14 AŞAMAYA GEÇİŞ KÖPRÜSÜ
    // =========================================================================
    const iceWallMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.85
    });
    buildSnowPlatform(2, 7, 38, -19, 36.5, -195, iceWallMat, false, false, false);
    buildSnowPlatform(2, 7, 38, 19, 36.5, -195, iceWallMat, false, false, false);
    T("snow_closed_nest_easel", 4, "❄️ ESKİ BOSS İNİ KAPATILDI!\nKoca Ayak 14. Aşamaya (-1420) Taşındı!\nÖnündeki 14 Zorlu Aşamayı Aş!", 0, 36.0, -186, 0);
    buildSnowPlatform(14, 1.8, 36, 0, 35.0, -205, v, false, false, true);
    buildSnowPlatform(12, 0.4, 36, 0, 36.0, -205, snowWhiteMat, false, false, true);

    // =========================================================================
    // ❄️ 1. AŞAMA: DONMUŞ BUZUL GİRİŞİ & KAYGAN RAMPALAR [Zorlu]
    // =========================================================================
    addCheckpoint("snow_cp_s1", "1. Aşama: Buzul Girişi & Kaygan Rampalar", 0, 36.5, -220);
    buildSnowPlatform(20, 2, 20, 0, 35.0, -220, v, false, false, true);
    buildSnowPlatform(18, 0.4, 18, 0, 36.1, -220, snowWhiteMat);
    b("snow_coin_s1_0", -4, 37.0, -220, false);
    b("snow_coin_s1_1", 4, 37.0, -220, false);
    buildSnowPlatform(9, 1.2, 38, 0, 36.2, -248, iceGlacierMat, false, false, true);
    buildSnowPlatform(12, 1.5, 12, 0, 37.4, -270, v, false, false, true);
    b("snow_gem_s1", 0, 38.5, -248, true);
    createFrostShardGolem(0, 38.0, -260, enemies, snowExtensionGroup);

    // =========================================================================
    // ❄️ 2. AŞAMA: DÜŞEN SİVRİ BUZ SARKITLARI [Zorlu]
    // =========================================================================
    addCheckpoint("snow_cp_s2", "2. Aşama: Düşen Sivri Buz Sarkıtları", 0, 39.5, -280);
    buildSnowPlatform(16, 2, 14, 0, 38.5, -280, v, false, false, true);
    [-292, -302, -312, -322, -331].forEach((iz, idx) => {
      const ix = (idx % 2 === 0 ? -2.2 : 2.2);
      const iy = 39.2 + idx * 0.5;
      buildSnowPlatform(7.5, 1.2, 7.5, ix, iy, iz, v, false, false, true);
      if (idx < 3) {
        const icicle = new THREE.Mesh(new THREE.ConeGeometry(0.4, 2.2, 6), frostCrystalMat);
        icicle.rotation.x = Math.PI;
        icicle.position.set(ix, iy + 6.5, iz);
        snowExtensionGroup.add(icicle);
        snowFallingIcicles.push({ mesh: icicle, x: ix, y: iy + 6.5, targetY: iy + 0.5, z: iz, triggered: false, fallSpeed: 0 });
      }
    });
    createArcticAlphaWolf(0, 42.0, -322, enemies, snowExtensionGroup);

    // =========================================================================
    // ❄️ 3. AŞAMA: HAREKETLİ BUZ SALI PLATFORMLARI [Zorlu]
    // =========================================================================
    addCheckpoint("snow_cp_s3", "3. Aşama: Hareketli Buz Salları", 0, 42.5, -340);
    buildSnowPlatform(16, 2, 14, 0, 41.5, -340, v, false, false, true);
    [-353, -363, -373, -383, -392].forEach((mz, mIdx) => {
      const my = 42.0 + mIdx * 0.55;
      const mMesh = buildSnowPlatform(6.8, 1.2, 6.8, 0, my, mz, iceGlacierMat, false, false, true);
      snowMovingFloes.push({
        mesh: mMesh, coll: collidables[collidables.length - 1],
        baseX: 0, baseY: my, baseZ: mz, rangeX: 4.2, speed: 1.6, offset: mIdx * 1.3, halfW: 3.4
      });
    });
    createGlacialTortoise(0, 44.5, -373, enemies, snowExtensionGroup);

    // =========================================================================
    // ❄️ 4. AŞAMA: ÇÖKEN İNCE KAR KÖPRÜLERİ [Zorlu]
    // =========================================================================
    addCheckpoint("snow_cp_s4", "4. Aşama: Çöken İnce Kar Köprüleri", 0, 45.5, -400);
    buildSnowPlatform(14, 2, 12, 0, 44.5, -400, v, false, false, true);
    [
      { x: -2.5, z: -411, y: 45.0 }, { x: 2.5, z: -420, y: 45.6 },
      { x: -2.0, z: -429, y: 46.2 }, { x: 2.0, z: -438, y: 46.8 },
      { x: 0.0, z: -448, y: 47.2 }
    ].forEach((cs) => {
      const cMesh = buildSnowPlatform(6.2, 1.0, 6.5, cs.x, cs.y, cs.z, snowWhiteMat, false, false, true);
      snowCrumblingCrusts.push({
        mesh: cMesh, coll: collidables[collidables.length - 1],
        baseY: cs.y, stepped: false, dropTimer: 0.75, fallSpeed: 0, respawnTimer: 0
      });
    });
    createBlizzardEagle(0, 49.0, -430, enemies, snowExtensionGroup);

    // =========================================================================
    // ❄️ 5. AŞAMA: DÖNEN SİVRİ BUZ DEĞİRMENLERİ [Zorlu]
    // =========================================================================
    addCheckpoint("snow_cp_s5", "5. Aşama: Dönen Buz Değirmenleri", 0, 48.5, -460);
    buildSnowPlatform(16, 2, 14, 0, 47.5, -460, v, false, false, true);
    [-474, -486, -498, -509].forEach((sz, sIdx) => {
      buildSnowPlatform(8.5, 1.2, 8.5, 0, 48.2 + sIdx * 0.6, sz, v, false, false, true);
      if (sIdx === 0 || sIdx === 2) {
        const spinGroup = new THREE.Group();
        spinGroup.position.set(0, 49.8 + sIdx * 0.6, sz);
        for (let arm = 0; arm < 4; arm++) {
          const iceSpike = new THREE.Mesh(new THREE.ConeGeometry(0.35, 4.8, 6), frostCrystalMat);
          const ang = (arm / 4) * Math.PI * 2;
          iceSpike.position.set(Math.cos(ang) * 2.6, 0, Math.sin(ang) * 2.6);
          iceSpike.rotation.z = -Math.PI / 2; iceSpike.rotation.y = -ang;
          spinGroup.add(iceSpike);
        }
        snowExtensionGroup.add(spinGroup);
        snowRotatingIceMills.push({ group: spinGroup, speed: 2.2 });
      }
    });
    createFrostBouncingSeal(-2.5, 49.8, -486, enemies, snowExtensionGroup);

    // =========================================================================
    // ❄️ 6. AŞAMA: ÇIĞ YUVARLANAN KAR TOPU KANYONU [Zorlu]
    // =========================================================================
    addCheckpoint("snow_cp_s6", "6. Aşama: Çığ Yuvarlanan Kar Topu Kanyonu", 0, 51.5, -520);
    buildSnowPlatform(18, 2, 14, 0, 50.5, -520, v, false, false, true);
    buildSnowPlatform(10, 1.5, 50, 0, 52.0, -550, iceGlacierMat, false, false, true);
    for (let bIdx = 0; bIdx < 2; bIdx++) {
      const bMesh = new THREE.Mesh(new THREE.SphereGeometry(1.4, 10, 10), snowWhiteMat);
      bMesh.position.set((bIdx === 0 ? -2.0 : 2.0), 53.5, -565 + bIdx * 20);
      snowExtensionGroup.add(bMesh);
      snowAvalancheBoulders.push({ mesh: bMesh, baseZ: -565, speed: 14.0, z: -565 + bIdx * 20 });
    }
    createFrostSnowman(0, 53.0, -555, enemies, snowExtensionGroup);

    // =========================================================================
    // ❄️ 7. AŞAMA: FIRTINALI KAR KASIRGASI GEÇİDİ [Zorlu]
    // =========================================================================
    addCheckpoint("snow_cp_s7", "7. Aşama: Fırtınalı Kar Kasırgası Geçidi", 0, 54.5, -580);
    buildSnowPlatform(16, 2, 14, 0, 53.5, -580, v, false, false, true);
    buildSnowPlatform(6.5, 1.2, 48, 0, 55.0, -610, iceGlacierMat, false, false, true);
    createIceHunterSniper(-2.0, 56.5, -610, enemies, snowExtensionGroup);

    // =========================================================================
    // ❄️ 8. AŞAMA: DONMUŞ GAYZER PÜSKÜRTÜCÜLERİ [Zorlu]
    // =========================================================================
    addCheckpoint("snow_cp_s8", "8. Aşama: Donmuş Gayzer Püskürtücüleri", 0, 57.5, -640);
    buildSnowPlatform(16, 2, 14, 0, 56.5, -640, v, false, false, true);
    [-653, -664, -675, -687].forEach((gz, gIdx) => {
      buildSnowPlatform(7.5, 1.2, 8.0, (gIdx % 2 === 0 ? -2.2 : 2.2), 57.3 + gIdx * 0.6, gz, iceGlacierMat, false, false, true);
    });
    createFrostVortexElemental(0, 59.0, -670, enemies, snowExtensionGroup);

    // =========================================================================
    // ❄️ 9. AŞAMA: LAZERLİ ANTİK BUZ KRİSTALİ IZGARASI [Zorlu]
    // =========================================================================
    addCheckpoint("snow_cp_s9", "9. Aşama: Lazerli Buz Kristali Izgarası", 0, 60.5, -700);
    buildSnowPlatform(16, 2, 14, 0, 59.5, -700, v, false, false, true);
    [-714, -728, -744].forEach((lz, idx) => {
      buildSnowPlatform(12, 1.5, 11, 0, 60.4 + idx * 0.7, lz, iceGlacierMat, false, false, true);
      if (idx < 2) {
        const laserMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 11.5, 8), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
        laserMesh.rotation.z = Math.PI / 2; laserMesh.position.set(0, 62.0 + idx * 0.7, lz);
        snowExtensionGroup.add(laserMesh);
        snowFrostLasers.push({ mesh: laserMesh, speed: 2.5, y: 62.0 + idx * 0.7, z: lz });
      }
    });
    createGlacialIceBat(-3.0, 63.5, -728, enemies, snowExtensionGroup);

    // =========================================================================
    // ❄️ 10. AŞAMA: ERİYİP DÜŞEN BUZUL SÜTUNLARI [Zorlu]
    // =========================================================================
    addCheckpoint("snow_cp_s10", "10. Aşama: Eriyip Düşen Buzul Sütunları", 0, 63.5, -760);
    buildSnowPlatform(14, 2, 12, 0, 62.5, -760, v, false, false, true);
    [
      { x: -2.2, z: -771, y: 63.1 }, { x: 2.2, z: -781, y: 63.7 },
      { x: -2.0, z: -791, y: 64.3 }, { x: 2.0, z: -801, y: 64.9 },
      { x: 0.0, z: -810, y: 65.2 }
    ].forEach((tp) => {
      const pMesh = buildSnowPlatform(6.0, 1.0, 6.5, tp.x, tp.y, tp.z, iceGlacierMat, false, false, true);
      snowCrumblingCrusts.push({
        mesh: pMesh, coll: collidables[collidables.length - 1],
        baseY: tp.y, stepped: false, dropTimer: 0.7, fallSpeed: 0, respawnTimer: 0
      });
    });
    createArcticFrostShaman(0, 66.5, -791, enemies, snowExtensionGroup);

    // =========================================================================
    // ❄️ 11. AŞAMA: DEVASA BUZUL SIRTI & FIRTINALI DENGE KİRİŞLERİ
    // =========================================================================
    addCheckpoint("snow_cp_s11", "11. Aşama: Devasa Buzul Sırtı & Fırtına Kirişleri", 0, 66.5, -820);
    buildSnowPlatform(16, 2, 14, 0, 65.5, -820, v, false, false, true);
    buildSnowPlatform(8.5, 1.4, 24, 0, 66.2, -838, iceGlacierMat, false, false, true);
    buildSnowPlatform(12, 1.6, 14, -2.5, 67.0, -856, v, false, false, true);
    b("snow_coin_s11_0", -2.5, 68.5, -856, false);
    [-870, -882, -894].forEach((mz, idx) => {
      const my = 67.6 + idx * 0.6;
      const floe = buildSnowPlatform(7.5, 1.2, 8.0, (idx % 2 === 0 ? 2.0 : -2.0), my, mz, iceGlacierMat, false, false, true);
      snowMovingFloes.push({
        mesh: floe, coll: collidables[collidables.length - 1],
        baseX: 0, baseY: my, baseZ: mz, rangeX: 3.5, speed: 1.5, offset: idx * 1.2, halfW: 3.75
      });
    });
    buildSnowPlatform(12, 1.6, 16, 0, 69.5, -910, v, false, false, true);
    b("snow_gem_s11", 0, 71.2, -910, true);
    buildSnowPlatform(9.5, 1.5, 48, 0, 70.4, -942, iceGlacierMat, false, false, true);
    createPolarIceBehemoth(0, 71.3, -942, enemies, snowExtensionGroup);

    // =========================================================================
    // ❄️ 12. AŞAMA: ERİYİP ÇÖKEN SÜTUNLAR & ÇİFTLİ DEĞİRMENLER
    // =========================================================================
    addCheckpoint("snow_cp_s12", "12. Aşama: Eriyip Çöken Sütunlar & Çiftli Değirmenler", 0, 72.2, -976);
    buildSnowPlatform(16, 2, 16, 0, 71.2, -976, v, false, false, true);
    createCryoScorpionStalker(0, 72.4, -976, enemies, snowExtensionGroup);
    [
      { x: -2.5, z: -992, y: 71.8, w: 8.5, d: 10 },
      { x: 2.5, z: -1006, y: 72.4, w: 8.5, d: 10 },
      { x: 0.0, z: -1022, y: 73.0, w: 12, d: 14 },
      { x: 0.0, z: -1040, y: 73.7, w: 10, d: 14 },
      { x: -2.0, z: -1058, y: 74.4, w: 9, d: 14 },
      { x: 2.0, z: -1076, y: 75.1, w: 9, d: 14 },
      { x: 0.0, z: -1094, y: 75.8, w: 11, d: 14 },
      { x: 0.0, z: -1112, y: 76.4, w: 10, d: 14 },
      { x: 0.0, z: -1128, y: 77.0, w: 14, d: 16 }
    ].forEach((st, idx) => {
      buildSnowPlatform(st.w, 1.5, st.d, st.x, st.y, st.z, idx % 2 === 0 ? iceGlacierMat : v, false, false, true);
      if (idx === 3 || idx === 6) {
        const spinGroup = new THREE.Group();
        spinGroup.position.set(st.x, st.y + 1.8, st.z);
        for (let arm = 0; arm < 4; arm++) {
          const iceSpike = new THREE.Mesh(new THREE.ConeGeometry(0.35, 4.8, 6), frostCrystalMat);
          const ang = (arm / 4) * Math.PI * 2;
          iceSpike.position.set(Math.cos(ang) * 2.6, 0, Math.sin(ang) * 2.6);
          iceSpike.rotation.z = -Math.PI / 2; iceSpike.rotation.y = -ang;
          spinGroup.add(iceSpike);
        }
        snowExtensionGroup.add(spinGroup);
        snowRotatingIceMills.push({ group: spinGroup, speed: idx === 3 ? 2.0 : -2.0 });
      }
      if (idx % 2 === 1) b("snow_coin_s12_" + idx, st.x, st.y + 1.8, st.z, idx === 5);
    });
    S(0, 77.9, -1128, 17.5);

    // =========================================================================
    // ❄️ 13. AŞAMA: DONMUŞ ZAMAN KRİSTALLERİ & KAOTİK LAZER LABİRENTİ
    // =========================================================================
    addCheckpoint("snow_cp_s13", "13. Aşama: Donmuş Zaman Kristalleri & Lazer Labirenti", 0, 78.6, -1148);
    buildSnowPlatform(18, 2, 16, 0, 77.6, -1148, v, false, false, true);
    [
      { x: 0.0, z: -1166, y: 78.2, w: 12, d: 14, laser: true },
      { x: -2.5, z: -1184, y: 78.8, w: 10, d: 14, laser: false },
      { x: 2.5, z: -1202, y: 79.4, w: 10, d: 14, laser: true },
      { x: 0.0, z: -1222, y: 80.1, w: 9, d: 18, laser: false },
      { x: 0.0, z: -1244, y: 80.8, w: 12, d: 18, laser: true },
      { x: -2.0, z: -1266, y: 81.5, w: 10, d: 16, laser: false },
      { x: 2.0, z: -1286, y: 82.2, w: 10, d: 16, laser: false }
    ].forEach((st, idx) => {
      buildSnowPlatform(st.w, 1.5, st.d, st.x, st.y, st.z, idx % 2 === 0 ? iceGlacierMat : v, false, false, true);
      if (st.laser) {
        const laserMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 11.0, 8), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
        laserMesh.rotation.z = Math.PI / 2;
        laserMesh.position.set(st.x, st.y + 1.8, st.z);
        snowExtensionGroup.add(laserMesh);
        snowFrostLasers.push({ mesh: laserMesh, speed: idx % 2 === 0 ? 2.2 : -2.2, y: st.y + 1.8, z: st.z });
      }
      b("snow_coin_s13_" + idx, st.x, st.y + 1.8, st.z, idx === 4);
    });
    buildSnowPlatform(18, 2, 18, 0, 83.0, -1308, v, false, false, true);
    createFrostValkyrieKnight(0, 84.2, -1308, enemies, snowExtensionGroup);

    // =========================================================================
    // 👑 14. AŞAMA: [BÜYÜK BOSS ARENASI] YÜCE DONMUŞ TAHT ZİRVESİ & KOCA AYAK YETİ
    // =========================================================================
    addCheckpoint("snow_cp_s14", "14. Aşama: [BÜYÜK BOSS] Yüce Donmuş Taht Zirvesi ❄️", 0, 84.5, -1324);
    buildSnowPlatform(16, 2.0, 16, 0, 83.3, -1324, v, false, false, true);
    // Grand Royal Ice Causeway Bridge leading directly into the Boss Arena (-1332 to -1382)
    buildSnowPlatform(14, 2.0, 54, 0, 83.5, -1356, iceGlacierMat, false, false, true);
    buildSnowPlatform(12, 0.4, 54, 0, 84.6, -1356, snowWhiteMat, false, false, true);

    const summitArenaZ = -1420;
    const summitArenaY = 83.5;

    buildSnowPlatform(82, 3.5, 82, 0, summitArenaY, summitArenaZ, v, false, false, true);
    buildSnowPlatform(78, 0.5, 78, 0, summitArenaY + 1.8, summitArenaZ, snowWhiteMat);

    for (let p = 0; p < 10; p++) {
      const angle = (p / 10) * Math.PI * 2;
      const px = Math.cos(angle) * 35;
      const pz = summitArenaZ + Math.sin(angle) * 35;
      buildSnowPlatform(3.2, 22, 3.2, px, summitArenaY + 11.0, pz, z, false, false, false);
      const crystalTop = new THREE.Mesh(new THREE.ConeGeometry(1.8, 3.5, 6), frostCrystalMat);
      crystalTop.position.set(px, summitArenaY + 22.5, pz);
      snowExtensionGroup.add(crystalTop);
    }

    T("snow_throne_easel", 4, "👑 YÜCE DONMUŞ TAHT ZİRVESİ!\nKoca Ayak Yeti'yi mağlup et ve Volkanik Ejderha Mağarası'na açılan portaldan geç!", 0, summitArenaY + 2.0, summitArenaZ - 20, 0);

    activeBigfootBoss = createExactBigfootBoss(0, summitArenaY + 2.0, summitArenaZ + 5, enemies, snowExtensionGroup);
    snowVictoryPortal = createSnowVictoryPortal(0, summitArenaY + 1.8, summitArenaZ - 30, snowExtensionGroup);

    console.log("✅ [Snow Desert Extension] 14 Aşama, 13 Benzersiz Buz Canlısı ve Bigfoot Boss Başarıyla Yüklendi!");
  };

  function spawnArcticCreature(x, y, z, enemies, group, variantIdx, idPrefix, name, primaryColor, accentColor, hp, atk, moveMode) {
    const THREE = window.THREE;
    const g = (typeof window.__buildDistinctCreatureMesh === 'function')
      ? window.__buildDistinctCreatureMesh(THREE, variantIdx, { primaryColor, accentColor, scale: 1.05 })
      : new THREE.Group();
    g.position.set(x, y, z);
    group.add(g);

    const enemyObj = {
      id: idPrefix + "_" + Math.round(z),
      type: "arctic_beast_" + variantIdx,
      name: name,
      mesh: g,
      pos: new THREE.Vector3(x, y, z),
      baseX: x,
      baseY: y,
      baseZ: z,
      hp: hp,
      maxHp: hp,
      attackPower: atk,
      _moveMode: moveMode,
      _projTheme: { color: primaryColor, glow: accentColor, shape: variantIdx % 2 === 0 ? 'spear' : 'orb', speed: 19, dmg: atk },
      update: function(dt, p, game) {
        if (typeof window.__updateCreatureCombatAI === 'function') {
          window.__updateCreatureCombatAI(this, dt, p, game, variantIdx);
        }
        if (p && this.pos.distanceTo(p) < 2.4) {
          game.damagePlayer(this.attackPower);
        }
      }
    };
    enemies.push(enemyObj);
    return enemyObj;
  }

  function createFrostShardGolem(x, y, z, enemies, group) {
    return spawnArcticCreature(x, y, z, enemies, group, 0, "golem", "Buzul Kristal Golemi 🗿❄️", 0x38bdf8, 0xe0f2fe, 140, 15, 0);
  }
  function createArcticAlphaWolf(x, y, z, enemies, group) {
    return spawnArcticCreature(x, y, z, enemies, group, 4, "wolf", "Kutup Alfa Kurdu 🐺❄️", 0xcbd5e1, 0x38bdf8, 95, 14, 1);
  }
  function createGlacialTortoise(x, y, z, enemies, group) {
    return spawnArcticCreature(x, y, z, enemies, group, 6, "tortoise", "Dikenli Buzul Kaplumbağası 🐢🧊", 0x0284c7, 0x7dd3fc, 130, 14, 0);
  }
  function createBlizzardEagle(x, y, z, enemies, group) {
    return spawnArcticCreature(x, y, z, enemies, group, 1, "eagle", "Fırtına Buz Kartalı 🦅❄️", 0x64748b, 0xbae6fd, 85, 13, 4);
  }
  function createFrostBouncingSeal(x, y, z, enemies, group) {
    return spawnArcticCreature(x, y, z, enemies, group, 14, "seal", "Zırhlı Kutup Foku 🦭🧊", 0x475569, 0x38bdf8, 100, 13, 3);
  }
  function createFrostSnowman(x, y, z, enemies, group) {
    return spawnArcticCreature(x, y, z, enemies, group, 16, "snowman", "Sihirli Kar Otomatonu ⛄❄️", 0xf8fafc, 0x0ea5e9, 95, 13, 2);
  }
  function createIceHunterSniper(x, y, z, enemies, group) {
    return spawnArcticCreature(x, y, z, enemies, group, 9, "sniper", "Kutup Mızrak Avcısı 🏹❄️", 0x1e3a8a, 0x67e8f9, 110, 15, 0);
  }
  function createFrostVortexElemental(x, y, z, enemies, group) {
    return spawnArcticCreature(x, y, z, enemies, group, 8, "vortex", "Buzul Prizma Elementali 🌪️❄️", 0x06b6d4, 0xffffff, 125, 15, 4);
  }
  function createGlacialIceBat(x, y, z, enemies, group) {
    return spawnArcticCreature(x, y, z, enemies, group, 12, "icebat", "Çift Kanatlı Buz Yarasası 🦇❄️", 0x312e81, 0x38bdf8, 80, 12, 4);
  }
  function createArcticFrostShaman(x, y, z, enemies, group) {
    return spawnArcticCreature(x, y, z, enemies, group, 3, "shaman", "Kutup Kristal Şamanı 🧙‍♂️❄️", 0x0369a1, 0xfef08a, 130, 15, 2);
  }
  function createPolarIceBehemoth(x, y, z, enemies, group) {
    return spawnArcticCreature(x, y, z, enemies, group, 11, "behemoth", "Boynuzlu Kutup Minotoru 🐂❄️", 0x1e40af, 0x93c5fd, 155, 16, 1);
  }
  function createCryoScorpionStalker(x, y, z, enemies, group) {
    return spawnArcticCreature(x, y, z, enemies, group, 2, "cryoscorp", "Buzul Kıskaç Akrebi 🦂❄️", 0x0e7490, 0xa5f3fc, 145, 16, 0);
  }
  function createFrostValkyrieKnight(x, y, z, enemies, group) {
    return spawnArcticCreature(x, y, z, enemies, group, 17, "valkyrie", "Donmuş Taht Muhafızı 🛡️❄️", 0x1d4ed8, 0xfacc15, 165, 17, 2);
  }

  function createExactBigfootBoss(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const I = new THREE.Group();
    I.name = "boss_bigfoot_titan_relocated";
    I.position.set(x, y, z);
    I.scale.set(3.2, 3.2, 3.2);

    // Exact original Koca Ayak (Bigfoot Yeti Boss) materials & geometry from game-bundle.js
    const G = new THREE.MeshStandardMaterial({ color: 14870768, emissive: 9741240, emissiveIntensity: 0.25 });
    const Z = new THREE.MeshStandardMaterial({ color: 6583435 });
    const pe = new THREE.MeshBasicMaterial({ color: 3718648 });
    const Se = new THREE.MeshStandardMaterial({ color: 16777215 });
    const le = new THREE.MeshStandardMaterial({ color: 13358561 });
    const Ue = new THREE.MeshStandardMaterial({ color: 4674921 });
    const je = new THREE.MeshStandardMaterial({ color: 3718648, emissive: 165063, emissiveIntensity: 0.4 });

    // Torso
    const X = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.85, 1.4, 12), G);
    X.position.y = 1.0;
    I.add(X);

    // Head
    const C = new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 12), G);
    C.position.set(0, 1.8, 0.2);
    I.add(C);

    // Snout
    const W = new THREE.Mesh(new THREE.SphereGeometry(0.35, 10, 10), Z);
    W.position.set(0, 1.75, 0.5);
    I.add(W);

    // Glowing Ice Eyes
    const oe = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 6), pe);
    oe.position.set(-0.18, 1.85, 0.75);
    I.add(oe);
    const xe = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 6), pe);
    xe.position.set(0.18, 1.85, 0.75);
    I.add(xe);

    // White Fangs
    const Q = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.35, 6), Se);
    Q.position.set(-0.16, 1.55, 0.75);
    Q.rotateX(Math.PI);
    I.add(Q);
    const ae = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.35, 6), Se);
    ae.position.set(0.16, 1.55, 0.75);
    ae.rotateX(Math.PI);
    I.add(ae);

    // Left & Right Arms
    const Re = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.35, 1.5, 8), le);
    Re.name = "bf_arm_left";
    Re.position.set(-1.0, 0.9, 0.2);
    Re.rotateZ(0.25);
    I.add(Re);

    const Ce = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.35, 1.5, 8), le);
    Ce.name = "bf_arm_right";
    Ce.position.set(1.0, 0.9, 0.2);
    Ce.rotateZ(-0.25);
    I.add(Ce);

    // Bigfoot Feet
    const ut = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.25, 1.1), Ue);
    ut.position.set(-0.45, 0.12, 0.2);
    I.add(ut);
    const Ye = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.25, 1.1), Ue);
    Ye.position.set(0.45, 0.12, 0.2);
    I.add(Ye);

    // Giant Ice Club
    const ct = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.4, 2.0, 8), je);
    ct.name = "bf_ice_club";
    ct.position.set(1.2, 0.6, 0.6);
    ct.rotateX(Math.PI / 4);
    I.add(ct);

    group.add(I);

    const boss = {
      id: "boss_bigfoot_titan",
      type: "bigfoot_boss",
      name: "Koca Ayak (Bigfoot Yeti Boss)",
      mesh: I,
      pos: new THREE.Vector3(x, y, z),
      velocity: new THREE.Vector3(),
      baseX: x,
      baseY: y,
      baseZ: z,
      hp: 320,
      maxHp: 320,
      attackPower: 22,
      isBoss: true,
      attackCooldown: 0,
      state: "chase",
      animTimer: 0
    };
    enemies.push(boss);
    return boss;
  }

  function createSnowVictoryPortal(x, y, z, group) {
    const THREE = window.THREE;
    const g = new THREE.Group();
    g.position.set(x, y, z);
    const r = new THREE.Mesh(
      new THREE.TorusGeometry(3.5, 0.45, 16, 32),
      new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xc2410c, emissiveIntensity: 1.8 })
    );
    r.position.y = 3.5;
    g.add(r);
    group.add(g);
    return { mesh: g, pos: new THREE.Vector3(x, y, z), targetRegion: "volcano_cave" };
  }

  function updateSnowDesertExtension(dt) {
    const game = window.__superBearGame;
    if (!game || game.currentRegion !== 'snow_desert') return;
    totalTime += dt;

    // Moving Ice Floes
    snowMovingFloes.forEach(s => {
      const offX = Math.sin(totalTime * s.speed + (s.offset || 0)) * s.rangeX;
      s.mesh.position.x = s.baseX + offX;
      if (s.coll && s.coll.min && s.coll.max) {
        const hw = s.halfW || 2.4;
        s.coll.min.x = s.baseX + offX - hw;
        s.coll.max.x = s.baseX + offX + hw;
      }
    });

    // Rotating Ice Mills
    snowRotatingIceMills.forEach(rm => {
      rm.group.rotation.y += dt * rm.speed;
      if (game.playerPos && rm.group.position.distanceTo(game.playerPos) < 3.0) {
        game.damagePlayer(15);
      }
    });

    // Frost Lasers
    snowFrostLasers.forEach(fl => {
      fl.mesh.rotation.y += dt * fl.speed;
      if (game.playerPos && Math.hypot(game.playerPos.x - fl.mesh.position.x, game.playerPos.z - fl.z) < 5.5 && Math.abs(game.playerPos.y - fl.y) < 1.6) {
        game.damagePlayer(16);
      }
    });

    // Victory Portal Check
    if (snowVictoryPortal && game.playerPos && snowVictoryPortal.pos.distanceTo(game.playerPos) < 4.5) {
      const boss = (game.currentLevel && game.currentLevel.enemies || []).find(e => e && e.id === "boss_bigfoot_titan");
      if (!boss || boss.hp <= 0) {
        if (!snowVictoryPortal._triggered) {
          snowVictoryPortal._triggered = true;
          if (game.callbacks && game.callbacks.onShowNotice) game.callbacks.onShowNotice("🌀 Volkanik Ejderha Mağarası'na Geçiliyor! 🌋", "success");
          setTimeout(() => { game.loadRegion("volcano_cave"); }, 800);
        }
      }
    }
  }

  const tickerInterval = setInterval(() => {
    if (window.__superBearGame) {
      if (!window.__superBearGame._snowDesertTickerHooked) {
        window.__superBearGame._snowDesertTickerHooked = true;
        const origUpdate = window.__superBearGame.update;
        window.__superBearGame.update = function(dt, totalTime) {
          origUpdate.call(this, dt, totalTime);
          try { updateSnowDesertExtension(dt); } catch(err) {}
        };
      }
      clearInterval(tickerInterval);
    }
  }, 100);
})();
