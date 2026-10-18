// ============================================================================
// ❄️ 5. BÖLÜM: KARLI DAĞLAR & KAR VADİSİ GENİŞLETMESİ (14 ZORLU AŞAMA & 10 ÖZEL CANLI)
// - Boss ilk yerinden kaldırıldı, 14. Aşamadaki Yüce Donmuş Taht Zirvesi'ne taşındı!
// - Koca Ayak (Bigfoot Yeti) Boss'un tüm özellikleri, şekli ve buz gürzü birebir aynı korundu!
// - 14 Zorlu Aşama:
//     * 1. Aşama: Donmuş Buzul Girişi & Kaygan Rampalar [Zorlu]
//     * 2. Aşama: Düşen Sivri Buz Sarkıtları [Zorlu]
//     * 3. Aşama: Hareketli Donmuş Buz Salı Platformları [Zorlu]
//     * 4. Aşama: Çöken İnce Kar Köprüleri [Zorlu]
//     * 5. Aşama: Dönen Sivri Buz Değirmenleri [Zorlu]
//     * 6. Aşama: Çığ Yuvarlanan Kar Topu Kanyonu [Zorlu]
//     * 7. Aşama: Fırtınalı Kar Kasırgası Geçidi [Zorlu]
//     * 8. Aşama: Donmuş Gayzer Püskürtücüleri [Zorlu]
//     * 9. Aşama: Lazerli Antik Buz Kristali Izgarası [Zorlu]
//     * 10. Aşama: Eriyip Düşen Buzul Sütunları [Zorlu]
//     * 11. Aşama: Dar Kar Sırtı & Denge Kirişleri [Zorlu]
//     * 12. Aşama: Donmuş Zaman Küpleri & Zıplama Tuzakları [Zorlu]
//     * 13. Aşama: Şimşekli Kutup Fırtınası Zirvesi [Zorlu]
//     * 14. Aşama: [BÜYÜK BOSS ARENASI] Yüce Donmuş Taht Zirvesi & Koca Ayak Yeti!
// - 10 Özel Yeni Canlı ve Mekanikleri:
//     1. ❄️ Kar Canavarı Buzul Golemi (Yeri dövüp buz çatlağı şoku yayar)
//     2. 🐺 Kutup Avcısı Alfa Kurdu (Ulur, dondurucu ısırıkla ayıyı yavaşlatır)
//     3. 🧊 Donmuş Buzul Kabuğu Kaplumbağası (Kabuğuna çekilip buzda kayarak çarpar)
//     4. 🦅 Buzul Fırtınası Kartalı (Gökten dalış yapıp kar fırtınası üfler)
//     5. 🦭 Şişman Kutup Foku (Buz yokuşlarından göbeğiyle kayıp ayıyı devirir)
//     6. ☃️ Yaramaz Kar Adamı (Seri kartopu yağmuruyla ayıyı geri iter)
//     7. 🏹 Buz Oku Kutup Avcısı (Ayıyı 1.5 saniye donduran kristal buz okları atar)
//     8. 🌪️ Buz Kasırgası Elementali (Platformlar arasında gezen tipi hortumu)
//     9. 🦇 Donmuş Mağara Buz Yarasası (Tavandan düşen sivri buz sarkıtları döker)
//     10. 🧙‍♂️ Kutup Şamanı & Donmuş Ruh (Buz kalkanı açar ve takip eden kar küreleri fırlatır)
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

  // Helper to freeze player in place for duration
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

  // Main Builder function invoked by game-bundle.js during Ww('snow_desert')
  window.__populateSnowDesertExtension = function(
    sceneGroup, collidables, platforms, enemies, items, easels, npcs,
    checkpoints, addCheckpoint, R, b, S, T, z, v, U, N, B, A
  ) {
    if (!window.THREE) return;
    const THREE = window.THREE;
    console.log("❄️ [Snow Desert Extension] 14 Zorlu Aşama ve 10 Özel Canlı Oluşturuluyor...");

    // Remove invisible wall: extend level bounds so player can explore all 14 stages freely
    const gameInstance = window.__superBearGame;
    if (gameInstance && gameInstance.currentLevel && gameInstance.currentLevel.bounds) {
      gameInstance.currentLevel.bounds.minZ = -1400;
      gameInstance.currentLevel.bounds.maxZ = 120;
      gameInstance.currentLevel.bounds.minX = -300;
      gameInstance.currentLevel.bounds.maxX = 300;
      gameInstance.currentLevel.bounds.minY = -50;
      gameInstance.currentLevel.bounds.maxY = 300;
    }

    // Create container group
    snowExtensionGroup = new THREE.Group();
    snowExtensionGroup.name = "snow_desert_14_stages_extension";
    sceneGroup.add(snowExtensionGroup);

    // Reset local arrays
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

    // Atmospheric Materials
    const iceGlacierMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.35,
      roughness: 0.05,
      metalness: 0.1,
      transparent: true,
      opacity: 0.92
    });
    const snowWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.9
    });
    const frostCrystalMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.0,
      metalness: 0.5
    });

    function buildSnowPlatform(w, h, d, px, py, pz, mat, isHazard = false, isClimbable = false, isIce = true) {
      return R(w, h, d, px, py, pz, mat, isHazard, isClimbable, isIce);
    }

    // =========================================================================
    // ❄️ 1. AŞAMA: DONMUŞ BUZUL GİRİŞİ & KAYGAN RAMPALAR [Zorlu] (z: -210 -> -270, Y: 36 -> 39)
    // =========================================================================
    addCheckpoint("snow_cp_s1", "1. Aşama: Buzul Girişi & Kaygan Rampalar", 0, 36.5, -220);
    buildSnowPlatform(20, 2, 20, 0, 35.0, -220, v, false, false, true);
    buildSnowPlatform(18, 0.4, 18, 0, 36.1, -220, snowWhiteMat);
    b("snow_coin_s1_0", -4, 37.0, -220, false);
    b("snow_coin_s1_1", 4, 37.0, -220, false);

    // Slippery ice ramps leading downhill then climbing
    buildSnowPlatform(8, 1.0, 35, 0, 36.0, -248, iceGlacierMat, false, false, true);
    b("snow_gem_s1", 0, 38.0, -248, true);

    // Creature 1: Kar Canavarı Buzul Golemi
    createFrostShardGolem(0, 37.5, -260, enemies, snowExtensionGroup);

    // =========================================================================
    // ❄️ 2. AŞAMA: DÜŞEN SİVRİ BUZ SARKITLARI [Zorlu] (z: -270 -> -330, Y: 39 -> 42)
    // =========================================================================
    addCheckpoint("snow_cp_s2", "2. Aşama: Düşen Sivri Buz Sarkıtları", 0, 39.5, -280);
    buildSnowPlatform(16, 2, 14, 0, 38.5, -280, v, false, false, true);

    // Hanging Stalactite icicles that drop when Grizzy approaches
    [-292, -304, -316].forEach((iz, idx) => {
      const ix = (idx % 2 === 0 ? -2.5 : 2.5);
      const iy = 40.0 + idx * 0.8;
      buildSnowPlatform(5.5, 1.0, 5.5, ix, iy, iz, v, false, false, true);

      // Hanging Icicle trap
      const icicle = new THREE.Mesh(new THREE.ConeGeometry(0.4, 2.2, 6), frostCrystalMat);
      icicle.rotation.x = Math.PI;
      icicle.position.set(ix, iy + 6.5, iz);
      snowExtensionGroup.add(icicle);
      snowFallingIcicles.push({
        mesh: icicle,
        x: ix,
        y: iy + 6.5,
        targetY: iy + 0.5,
        z: iz,
        triggered: false,
        fallSpeed: 0
      });
      b(`snow_coin_s2_${idx}`, ix, iy + 1.2, iz, idx === 1);
    });

    // Creature 2: Kutup Avcısı Alfa Kurdu
    createArcticAlphaWolf(0, 42.0, -320, enemies, snowExtensionGroup);

    // =========================================================================
    // ❄️ 3. AŞAMA: HAREKETLİ BUZ SALI PLATFORMLARI [Zorlu] (z: -330 -> -390, Y: 42 -> 45)
    // =========================================================================
    addCheckpoint("snow_cp_s3", "3. Aşama: Hareketli Buz Salları", 0, 42.5, -340);
    buildSnowPlatform(16, 2, 14, 0, 41.5, -340, v, false, false, true);

    // 4 Moving Ice Floes
    const mZ = [-355, -367, -379, -391];
    mZ.forEach((mz, mIdx) => {
      const my = 42.0 + mIdx * 0.8;
      const mMesh = buildSnowPlatform(4.8, 1.0, 4.8, 0, my, mz, iceGlacierMat, false, false, true);
      const coll = collidables[collidables.length - 1];
      snowMovingFloes.push({
        mesh: mMesh,
        coll: coll,
        baseX: 0,
        baseY: my,
        baseZ: mz,
        rangeX: 5.5 + (mIdx % 2 === 0 ? 1.5 : -1.5),
        speed: 1.8 + mIdx * 0.2,
        offset: mIdx * 1.5
      });
      b(`snow_coin_s3_${mIdx}`, 0, my + 1.4, mz, mIdx === 2);
    });

    // Creature 3: Donmuş Buzul Kabuğu Kaplumbağası
    createGlacialTortoise(0, 44.5, -375, enemies, snowExtensionGroup);

    // =========================================================================
    // ❄️ 4. AŞAMA: ÇÖKEN İNCE KAR KÖPRÜLERİ [Zorlu] (z: -390 -> -450, Y: 45 -> 48)
    // =========================================================================
    addCheckpoint("snow_cp_s4", "4. Aşama: Çöken İnce Kar Köprüleri", 0, 45.5, -400);
    buildSnowPlatform(14, 2, 12, 0, 44.5, -400, v, false, false, true);

    // Thin collapsing snow crusts (fall after 0.75s!)
    const crumbSteps = [
      { x: -3.5, z: -412, y: 45.2 },
      { x: 3.5, z: -422, y: 46.0 },
      { x: -2.0, z: -432, y: 46.8 },
      { x: 2.5, z: -442, y: 47.6 }
    ];
    crumbSteps.forEach((cs, cIdx) => {
      const cMesh = buildSnowPlatform(2.2, 0.6, 2.2, cs.x, cs.y, cs.z, snowWhiteMat, false, false, true);
      const coll = collidables[collidables.length - 1];
      snowCrumblingCrusts.push({
        mesh: cMesh,
        coll: coll,
        baseY: cs.y,
        stepped: false,
        dropTimer: 0.75,
        fallSpeed: 0,
        respawnTimer: 0
      });
      b(`snow_crumb_coin_${cIdx}`, cs.x, cs.y + 1.2, cs.z, cIdx === 1);
    });

    // Creature 4: Buzul Fırtınası Kartalı
    createBlizzardEagle(0, 49.0, -430, enemies, snowExtensionGroup);

    // =========================================================================
    // ❄️ 5. AŞAMA: DÖNEN SİVRİ BUZ DEĞİRMENLERİ [Zorlu] (z: -450 -> -510, Y: 48 -> 51)
    // =========================================================================
    addCheckpoint("snow_cp_s5", "5. Aşama: Dönen Buz Değirmenleri", 0, 48.5, -460);
    buildSnowPlatform(16, 2, 14, 0, 47.5, -460, v, false, false, true);

    // 2 Rotating 4-arm icicle spinners
    [-475, -495].forEach((sz, sIdx) => {
      buildSnowPlatform(6, 1.2, 6, 0, 48.5 + sIdx * 1.0, sz, v, false, false, true);
      const spinGroup = new THREE.Group();
      spinGroup.position.set(0, 50.0 + sIdx * 1.0, sz);
      for (let arm = 0; arm < 4; arm++) {
        const iceSpike = new THREE.Mesh(new THREE.ConeGeometry(0.35, 4.8, 6), frostCrystalMat);
        const ang = (arm / 4) * Math.PI * 2;
        iceSpike.position.set(Math.cos(ang) * 2.6, 0, Math.sin(ang) * 2.6);
        iceSpike.rotation.z = -Math.PI / 2;
        iceSpike.rotation.y = -ang;
        spinGroup.add(iceSpike);
      }
      snowExtensionGroup.add(spinGroup);
      snowRotatingIceMills.push({ group: spinGroup, speed: (sIdx % 2 === 0 ? 2.2 : -2.2) });
      b(`snow_gem_s5_${sIdx}`, 0, 52.0 + sIdx * 1.0, sz, true);
    });

    // Creature 5: Şişman Kutup Foku (Frost Bouncing Seal)
    createFrostBouncingSeal(-3.5, 49.5, -485, enemies, snowExtensionGroup);

    // =========================================================================
    // ❄️ 6. AŞAMA: ÇIĞ YUVARLANAN KAR TOPU KANYONU [Zorlu] (z: -510 -> -570, Y: 51 -> 54)
    // =========================================================================
    addCheckpoint("snow_cp_s6", "6. Aşama: Çığ Yuvarlanan Kar Topu Kanyonu", 0, 51.5, -520);
    buildSnowPlatform(18, 2, 14, 0, 50.5, -520, v, false, false, true);

    // Long icy canyon slope
    buildSnowPlatform(9, 1.5, 45, 0, 52.0, -545, iceGlacierMat, false, false, true);
    buildSnowPlatform(1.5, 5, 45, -5.0, 54.0, -545, z);
    buildSnowPlatform(1.5, 5, 45, 5.0, 54.0, -545, z);

    // Avalanche Snow Boulders rolling down
    for (let bIdx = 0; bIdx < 2; bIdx++) {
      const bMesh = new THREE.Mesh(new THREE.SphereGeometry(1.4, 10, 10), snowWhiteMat);
      bMesh.position.set((bIdx === 0 ? -2.0 : 2.0), 53.5, -565 + bIdx * 20);
      snowExtensionGroup.add(bMesh);
      snowAvalancheBoulders.push({
        mesh: bMesh,
        baseZ: -565,
        speed: 14.0 + bIdx * 3.0,
        z: -565 + bIdx * 20
      });
    }

    // Creature 6: Yaramaz Kar Adamı (Snowball thrower)
    createFrostSnowman(0, 53.0, -555, enemies, snowExtensionGroup);

    // =========================================================================
    // ❄️ 7. AŞAMA: FIRTINALI KAR KASIRGASI GEÇİDİ [Zorlu] (z: -570 -> -630, Y: 54 -> 57)
    // =========================================================================
    addCheckpoint("snow_cp_s7", "7. Aşama: Fırtınalı Kar Kasırgası Geçidi", 0, 54.5, -580);
    buildSnowPlatform(16, 2, 14, 0, 53.5, -580, v, false, false, true);

    // Narrow bridge with high crosswinds
    buildSnowPlatform(3.5, 1.0, 40, 0, 55.0, -605, iceGlacierMat, false, false, true);

    // Creature 7: Buz Oku Kutup Avcısı (Sniper that freezes player!)
    createIceHunterSniper(-4.5, 56.5, -605, enemies, snowExtensionGroup);

    // =========================================================================
    // ❄️ 8. AŞAMA: DONMUŞ GAYZER PÜSKÜRTÜCÜLERİ [Zorlu] (z: -630 -> -690, Y: 57 -> 60)
    // =========================================================================
    addCheckpoint("snow_cp_s8", "8. Aşama: Donmuş Gayzer Püskürtücüleri", 0, 57.5, -640);
    buildSnowPlatform(16, 2, 14, 0, 56.5, -640, v, false, false, true);

    [-655, -670, -685].forEach((gz, gIdx) => {
      buildSnowPlatform(6, 1.2, 6, (gIdx % 2 === 0 ? -3.0 : 3.0), 58.0 + gIdx * 0.8, gz, iceGlacierMat, false, false, true);
      b(`snow_coin_s8_${gIdx}`, (gIdx % 2 === 0 ? -3.0 : 3.0), 60.0 + gIdx * 0.8, gz, gIdx === 1);
    });

    // Creature 8: Buz Kasırgası Elementali (Wandering blizzard whirlwind)
    createFrostVortexElemental(0, 59.0, -670, enemies, snowExtensionGroup);

    // =========================================================================
    // ❄️ 9. AŞAMA: LAZERLİ ANTİK BUZ KRİSTALİ IZGARASI [Zorlu] (z: -690 -> -750, Y: 60 -> 63)
    // =========================================================================
    addCheckpoint("snow_cp_s9", "9. Aşama: Lazerli Buz Kristali Izgarası", 0, 60.5, -700);
    buildSnowPlatform(16, 2, 14, 0, 59.5, -700, v, false, false, true);

    // Cyan Frost Lasers
    [-715, -735].forEach((lz, idx) => {
      buildSnowPlatform(12, 1.5, 10, 0, 61.0 + idx * 1.0, lz, iceGlacierMat, false, false, true);

      const laserGeo = new THREE.CylinderGeometry(0.12, 0.12, 11.5, 8);
      const laserMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const laserMesh = new THREE.Mesh(laserGeo, laserMat);
      laserMesh.rotation.z = Math.PI / 2;
      laserMesh.position.set(0, 62.5 + idx * 1.0, lz);
      snowExtensionGroup.add(laserMesh);

      snowFrostLasers.push({
        mesh: laserMesh,
        speed: (idx % 2 === 0 ? 2.5 : -2.5),
        y: 62.5 + idx * 1.0,
        z: lz
      });
      b(`snow_gem_s9_${idx}`, 0, 64.5 + idx * 1.0, lz, true);
    });

    // Creature 9: Donmuş Mağara Buz Yarasası
    createGlacialIceBat(-4.0, 64.0, -725, enemies, snowExtensionGroup);

    // =========================================================================
    // ❄️ 10. AŞAMA: ERİYİP DÜŞEN BUZUL SÜTUNLARI [Zorlu] (z: -750 -> -810, Y: 63 -> 66)
    // =========================================================================
    addCheckpoint("snow_cp_s10", "10. Aşama: Eriyip Düşen Buzul Sütunları", 0, 63.5, -760);
    buildSnowPlatform(14, 2, 12, 0, 62.5, -760, v, false, false, true);

    const thinPillars = [
      { x: -3.0, z: -772, y: 63.5 },
      { x: 3.0, z: -782, y: 64.3 },
      { x: -2.0, z: -792, y: 65.1 },
      { x: 2.5, z: -802, y: 65.9 }
    ];
    thinPillars.forEach((tp, tIdx) => {
      const pMesh = buildSnowPlatform(1.8, 0.6, 1.8, tp.x, tp.y, tp.z, iceGlacierMat, false, false, true);
      const coll = collidables[collidables.length - 1];
      snowCrumblingCrusts.push({
        mesh: pMesh,
        coll: coll,
        baseY: tp.y,
        stepped: false,
        dropTimer: 0.7,
        fallSpeed: 0,
        respawnTimer: 0
      });
      b(`snow_pillar_coin_${tIdx}`, tp.x, tp.y + 1.2, tp.z, tIdx === 2);
    });

    // Creature 10: Kutup Şamanı & Donmuş Ruh
    createArcticFrostShaman(0, 67.0, -795, enemies, snowExtensionGroup);

    // =========================================================================
    // ❄️ 11. AŞAMA: DAR KAR SIRTI & DENGE KİRİŞLERİ [Zorlu] (z: -810 -> -870, Y: 66 -> 68)
    // =========================================================================
    addCheckpoint("snow_cp_s11", "11. Aşama: Dar Kar Sırtı & Denge Kirişleri", 0, 66.5, -820);
    buildSnowPlatform(16, 2, 14, 0, 65.5, -820, v, false, false, true);

    // 1.3 unit narrow ridge
    buildSnowPlatform(1.3, 0.6, 45, 0, 66.8, -845, snowWhiteMat, false, false, true);
    b("snow_ridge_gem", 0, 68.5, -845, true);

    // =========================================================================
    // ❄️ 12. AŞAMA: DONMUŞ ZAMAN KÜPLERİ & TUZAKLAR [Zorlu] (z: -870 -> -930, Y: 68 -> 70)
    // =========================================================================
    addCheckpoint("snow_cp_s12", "12. Aşama: Donmuş Zaman Küpleri", 0, 68.5, -880);
    buildSnowPlatform(16, 2, 14, 0, 67.5, -880, v, false, false, true);

    [-895, -910, -925].forEach((kz, kIdx) => {
      buildSnowPlatform(4.5, 1.0, 4.5, (kIdx % 2 === 0 ? 3.0 : -3.0), 68.5 + kIdx * 0.8, kz, frostCrystalMat, false, false, true);
      b(`snow_time_coin_${kIdx}`, (kIdx % 2 === 0 ? 3.0 : -3.0), 70.5 + kIdx * 0.8, kz, kIdx === 1);
    });

    // =========================================================================
    // ❄️ 13. AŞAMA: ŞİMŞEKLİ KUTUP FIRTINASI ZİRVESİ [Zorlu] (z: -930 -> -1000, Y: 70 -> 72)
    // =========================================================================
    addCheckpoint("snow_cp_s13", "13. Aşama: Şimşekli Fırtına Zirvesi", 0, 70.5, -940);
    buildSnowPlatform(18, 2, 16, 0, 69.5, -940, v, false, false, true);

    // Steep climbing terraces to final summit
    buildSnowPlatform(8, 2, 12, 0, 70.5, -960, iceGlacierMat, false, false, true);
    buildSnowPlatform(8, 2, 12, 0, 71.5, -980, iceGlacierMat, false, false, true);

    // =========================================================================
    // 👑 14. AŞAMA: [BÜYÜK BOSS ARENASI] YÜCE DONMUŞ TAHT ZİRVESİ & KOCA AYAK YETİ (z: -1000 -> -1140, Y: 72)
    // =========================================================================
    addCheckpoint("snow_cp_s14", "14. Aşama: [BÜYÜK BOSS] Yüce Donmuş Taht Zirvesi ❄️", 0, 72.5, -1020);

    const summitArenaZ = -1080;
    const summitArenaY = 71.5;
    buildSnowPlatform(72, 3, 72, 0, summitArenaY, summitArenaZ, v, false, false, true);
    buildSnowPlatform(68, 0.4, 68, 0, summitArenaY + 1.6, summitArenaZ, snowWhiteMat);

    // 8 Grand Ice Monolith Obelisks with Blue Torches
    for (let p = 0; p < 8; p++) {
      const angle = (p / 8) * Math.PI * 2;
      const px = Math.cos(angle) * 31;
      const pz = summitArenaZ + Math.sin(angle) * 31;
      buildSnowPlatform(3.0, 18, 3.0, px, summitArenaY + 9.5, pz, z, false, false, false);
      const crystalTop = new THREE.Mesh(new THREE.ConeGeometry(1.6, 2.8, 6), frostCrystalMat);
      crystalTop.position.set(px, summitArenaY + 19.5, pz);
      snowExtensionGroup.add(crystalTop);
      const torch = new THREE.PointLight(0x38bdf8, 2.5, 22);
      torch.position.set(px, summitArenaY + 20.0, pz);
      snowExtensionGroup.add(torch);
    }

    // THE RELOCATED ICONIC BIGFOOT YETI BOSS (Exact same appearance, fur, teeth, club!)
    activeBigfootBoss = createExactBigfootBoss(0, summitArenaY + 1.6, summitArenaZ + 5, enemies, snowExtensionGroup);

    // Victory Exit Portal behind the Boss leading to 6. Bölüm (Volkanik Ejderha Mağarası)
    snowVictoryPortal = createSnowVictoryPortal(0, summitArenaY + 1.6, summitArenaZ - 25, snowExtensionGroup);

    console.log("✅ [Snow Desert Extension] 14 Zorlu Aşama & 10 Özel Canlı Başarıyla Yerleştirildi!");
  };

  // =========================================================================
  // 10 YENİ CANLI / DÜŞMAN MODELİ VE MEKANİĞİ
  // =========================================================================

  // 1. ❄️ Kar Canavarı Buzul Golemi (Ground slam frost shockwave)
  function createFrostShardGolem(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const golemGroup = new THREE.Group();
    golemGroup.position.set(x, y, z);

    const iceMat = new THREE.MeshStandardMaterial({ color: 0x93c5fd, roughness: 0.2 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.2, 1.4), iceMat);
    body.position.y = 1.4;
    golemGroup.add(body);

    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.2, 6, 6), eyeMat);
    eye.position.set(0, 2.0, 0.75);
    golemGroup.add(eye);

    group.add(golemGroup);

    const enemyData = {
      id: "frost_golem_" + Math.round(z),
      type: "snow_golem",
      name: "Buzul Golemi",
      mesh: golemGroup,
      pos: new THREE.Vector3(x, y, z),
      velocity: new THREE.Vector3(),
      hp: 140,
      maxHp: 140,
      attackPower: 16,
      isBoss: false,
      attackCooldown: 2.0,
      animTimer: 0,
      update: function(dt, playerPos, game) {
        this.animTimer += dt;
        const dist = this.pos.distanceTo(playerPos);
        if (dist < 18.0) {
          this.mesh.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
          if (dist > 3.0) {
            const dir = playerPos.clone().sub(this.pos).normalize();
            this.pos.x += dir.x * dt * 3.8;
            this.pos.z += dir.z * dt * 3.8;
          } else if (this.attackCooldown <= 0) {
            this.attackCooldown = 3.2;
            game.damagePlayer(this.attackPower);
            spawnSnowShockwave(this.pos, game, 8.5);
            if (window.St && window.St.playHammerSlam) window.St.playHammerSlam();
          }
        }
      }
    };
    enemies.push(enemyData);
    snowCustomCreatures.push(enemyData);
    return enemyData;
  }

  // 2. 🐺 Kutup Avcısı Alfa Kurdu (Freezing pounce)
  function createArcticAlphaWolf(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const wolfGroup = new THREE.Group();
    wolfGroup.position.set(x, y, z);

    const furMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.6 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.9, 2.0), furMat);
    body.position.y = 0.8;
    wolfGroup.add(body);

    const head = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.0, 6), furMat);
    head.rotation.x = -Math.PI / 2;
    head.position.set(0, 1.1, 1.1);
    wolfGroup.add(head);

    group.add(wolfGroup);

    const enemyData = {
      id: "frost_wolf_" + Math.round(z),
      type: "frost_wolf",
      name: "Kutup Avcısı Alfa Kurdu",
      mesh: wolfGroup,
      pos: new THREE.Vector3(x, y, z),
      velocity: new THREE.Vector3(),
      hp: 75,
      maxHp: 75,
      attackPower: 14,
      isBoss: false,
      attackCooldown: 2.0,
      animTimer: 0,
      update: function(dt, playerPos, game) {
        this.animTimer += dt;
        const dist = this.pos.distanceTo(playerPos);
        if (dist < 18.0) {
          this.mesh.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
          // High speed sprint
          const dir = playerPos.clone().sub(this.pos).normalize();
          this.pos.x += dir.x * dt * 7.0;
          this.pos.z += dir.z * dt * 7.0;

          if (dist < 2.5 && this.attackCooldown <= 0) {
            this.attackCooldown = 3.0;
            game.damagePlayer(this.attackPower);
            window.__freezePlayer(1.2); // Freezing bite!
          }
        }
      }
    };
    enemies.push(enemyData);
    snowCustomCreatures.push(enemyData);
    return enemyData;
  }

  // 3. 🧊 Donmuş Buzul Kabuğu Kaplumbağası (Curling slide)
  function createGlacialTortoise(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const tortGroup = new THREE.Group();
    tortGroup.position.set(x, y, z);

    const shellMat = new THREE.MeshStandardMaterial({ color: 0x60a5fa, metalness: 0.3, roughness: 0.1 });
    const shell = new THREE.Mesh(new THREE.SphereGeometry(1.0, 10, 8), shellMat);
    shell.scale.set(1.2, 0.6, 1.2);
    shell.position.y = 0.55;
    tortGroup.add(shell);

    group.add(tortGroup);

    const enemyData = {
      id: "ice_tortoise_" + Math.round(z),
      type: "ice_tortoise",
      name: "Buzul Kaplumbağası",
      mesh: tortGroup,
      pos: new THREE.Vector3(x, y, z),
      velocity: new THREE.Vector3(),
      hp: 110,
      maxHp: 110,
      attackPower: 12,
      isBoss: false,
      attackCooldown: 2.0,
      animTimer: 0,
      sliding: false,
      slideDir: new THREE.Vector3(),
      update: function(dt, playerPos, game) {
        this.animTimer += dt;
        const dist = this.pos.distanceTo(playerPos);
        if (!this.sliding) {
          if (dist < 14.0 && this.attackCooldown <= 0) {
            this.attackCooldown = 4.0;
            this.sliding = true;
            this.slideDir = playerPos.clone().sub(this.pos).normalize();
          }
        } else {
          // Slide like curling stone
          this.pos.add(this.slideDir.clone().multiplyScalar(dt * 11.0));
          shell.rotation.y += dt * 10;
          if (dist < 2.5) {
            game.damagePlayer(this.attackPower);
            game.playerVel.x += this.slideDir.x * 10;
            game.playerVel.z += this.slideDir.z * 10;
            this.sliding = false;
          }
          if (this.animTimer % 2.5 < 0.1) this.sliding = false;
        }
      }
    };
    enemies.push(enemyData);
    snowCustomCreatures.push(enemyData);
    return enemyData;
  }

  // 4. 🦅 Buzul Fırtınası Kartalı (Blizzard Eagle)
  function createBlizzardEagle(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const eagleGroup = new THREE.Group();
    eagleGroup.position.set(x, y, z);

    const featherMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.5 });
    const body = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.8, 6), featherMat);
    body.rotation.x = Math.PI / 2;
    eagleGroup.add(body);

    group.add(eagleGroup);

    const enemyData = {
      id: "blizzard_eagle_" + Math.round(z),
      type: "blizzard_eagle",
      name: "Buzul Kartalı",
      mesh: eagleGroup,
      pos: new THREE.Vector3(x, y, z),
      baseY: y,
      velocity: new THREE.Vector3(),
      hp: 60,
      maxHp: 60,
      attackPower: 12,
      isBoss: false,
      attackCooldown: 2.0,
      animTimer: 0,
      update: function(dt, playerPos, game) {
        this.animTimer += dt;
        this.pos.y = this.baseY + Math.sin(this.animTimer * 3.0) * 0.8;
        const dist = this.pos.distanceTo(playerPos);
        if (dist < 20.0) {
          this.mesh.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
          if (this.attackCooldown <= 0) {
            this.attackCooldown = 3.2;
            spawnSnowball(this.pos, playerPos, game);
          }
        }
      }
    };
    enemies.push(enemyData);
    snowCustomCreatures.push(enemyData);
    return enemyData;
  }

  // 5. 🦭 Şişman Kutup Foku (Bouncing Seal)
  function createFrostBouncingSeal(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const sealGroup = new THREE.Group();
    sealGroup.position.set(x, y, z);

    const sealMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.3 });
    const body = new THREE.Mesh(new THREE.SphereGeometry(1.0, 10, 8), sealMat);
    body.scale.set(1.1, 0.7, 1.6);
    body.position.y = 0.55;
    sealGroup.add(body);

    group.add(sealGroup);

    const enemyData = {
      id: "frost_seal_" + Math.round(z),
      type: "frost_seal",
      name: "Şişman Kutup Foku",
      mesh: sealGroup,
      pos: new THREE.Vector3(x, y, z),
      velocity: new THREE.Vector3(),
      hp: 85,
      maxHp: 85,
      attackPower: 13,
      isBoss: false,
      attackCooldown: 2.0,
      animTimer: 0,
      update: function(dt, playerPos, game) {
        this.animTimer += dt;
        const dist = this.pos.distanceTo(playerPos);
        if (dist < 15.0) {
          this.mesh.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
          // Belly bounce slide
          const dir = playerPos.clone().sub(this.pos).normalize();
          this.pos.x += dir.x * dt * 5.5;
          this.pos.z += dir.z * dt * 5.5;
          if (dist < 2.5 && this.attackCooldown <= 0) {
            this.attackCooldown = 2.5;
            game.damagePlayer(this.attackPower);
            game.playerVel.y = 7.0;
          }
        }
      }
    };
    enemies.push(enemyData);
    snowCustomCreatures.push(enemyData);
    return enemyData;
  }

  // 6. ☃️ Yaramaz Kar Adamı (Snowman)
  function createFrostSnowman(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const smGroup = new THREE.Group();
    smGroup.position.set(x, y, z);

    const snowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
    const b1 = new THREE.Mesh(new THREE.SphereGeometry(0.85, 8, 8), snowMat);
    b1.position.y = 0.85;
    smGroup.add(b1);
    const b2 = new THREE.Mesh(new THREE.SphereGeometry(0.6, 8, 8), snowMat);
    b2.position.y = 1.9;
    smGroup.add(b2);

    const carrot = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.6, 4), new THREE.MeshBasicMaterial({ color: 0xf97316 }));
    carrot.rotation.x = Math.PI / 2;
    carrot.position.set(0, 1.9, 0.7);
    smGroup.add(carrot);

    group.add(smGroup);

    const enemyData = {
      id: "snowman_" + Math.round(z),
      type: "frost_snowman",
      name: "Yaramaz Kar Adamı",
      mesh: smGroup,
      pos: new THREE.Vector3(x, y, z),
      velocity: new THREE.Vector3(),
      hp: 70,
      maxHp: 70,
      attackPower: 11,
      isBoss: false,
      attackCooldown: 1.5,
      animTimer: 0,
      update: function(dt, playerPos, game) {
        this.animTimer += dt;
        const dist = this.pos.distanceTo(playerPos);
        if (dist < 20.0) {
          this.mesh.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
          if (this.attackCooldown <= 0) {
            this.attackCooldown = 2.8;
            spawnSnowball(this.pos.clone().add(new THREE.Vector3(0, 1.9, 0)), playerPos, game);
          }
        }
      }
    };
    enemies.push(enemyData);
    snowCustomCreatures.push(enemyData);
    return enemyData;
  }

  // 7. 🏹 Buz Oku Kutup Avcısı (Ice Shard Hunter - Freezing arrows)
  function createIceHunterSniper(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const hGroup = new THREE.Group();
    hGroup.position.set(x, y, z);

    const coatMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.75, 2.2, 8), coatMat);
    body.position.y = 1.1;
    hGroup.add(body);

    const bow = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.06, 6, 12, Math.PI), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    bow.position.set(0.6, 1.4, 0.4);
    bow.rotation.y = Math.PI / 2;
    hGroup.add(bow);

    group.add(hGroup);

    const enemyData = {
      id: "ice_hunter_" + Math.round(z),
      type: "ice_hunter",
      name: "Buz Oku Kutup Avcısı",
      mesh: hGroup,
      pos: new THREE.Vector3(x, y, z),
      velocity: new THREE.Vector3(),
      hp: 80,
      maxHp: 80,
      attackPower: 14,
      isBoss: false,
      attackCooldown: 2.0,
      animTimer: 0,
      update: function(dt, playerPos, game) {
        this.animTimer += dt;
        const dist = this.pos.distanceTo(playerPos);
        if (dist < 24.0) {
          this.mesh.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
          if (this.attackCooldown <= 0) {
            this.attackCooldown = 3.6;
            spawnIceArrow(this.pos.clone().add(new THREE.Vector3(0, 1.4, 0)), playerPos, game);
          }
        }
      }
    };
    enemies.push(enemyData);
    snowCustomCreatures.push(enemyData);
    return enemyData;
  }

  // 8. 🌪️ Buz Kasırgası Elementali (Frost Vortex Elemental)
  function createFrostVortexElemental(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const vGroup = new THREE.Group();
    vGroup.position.set(x, y, z);

    const vMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.65, wireframe: true });
    const cone = new THREE.Mesh(new THREE.ConeGeometry(1.2, 3.2, 12, 1, true), vMat);
    cone.position.y = 1.6;
    vGroup.add(cone);

    group.add(vGroup);

    const enemyData = {
      id: "frost_vortex_" + Math.round(z),
      type: "frost_vortex",
      name: "Buz Kasırgası",
      mesh: vGroup,
      pos: new THREE.Vector3(x, y, z),
      baseX: x,
      velocity: new THREE.Vector3(),
      hp: 120,
      maxHp: 120,
      attackPower: 15,
      isBoss: false,
      animTimer: 0,
      update: function(dt, playerPos, game) {
        this.animTimer += dt;
        cone.rotation.y += dt * 12;
        // Wander across bridge
        this.pos.x = this.baseX + Math.sin(this.animTimer * 2.0) * 4.5;
        const dist = this.pos.distanceTo(playerPos);
        if (dist < 2.5) {
          game.damagePlayer(this.attackPower);
          game.playerVel.y = 11.0;
        }
      }
    };
    enemies.push(enemyData);
    snowCustomCreatures.push(enemyData);
    return enemyData;
  }

  // 9. 🦇 Donmuş Mağara Buz Yarasası (Ice Bat)
  function createGlacialIceBat(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const batGroup = new THREE.Group();
    batGroup.position.set(x, y, z);

    const bMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 6, 6), bMat);
    batGroup.add(body);

    group.add(batGroup);

    const enemyData = {
      id: "ice_bat_" + Math.round(z),
      type: "ice_bat",
      name: "Buz Yarasası",
      mesh: batGroup,
      pos: new THREE.Vector3(x, y, z),
      baseY: y,
      velocity: new THREE.Vector3(),
      hp: 45,
      maxHp: 45,
      attackPower: 10,
      isBoss: false,
      attackCooldown: 1.5,
      animTimer: 0,
      update: function(dt, playerPos, game) {
        this.animTimer += dt;
        this.pos.y = this.baseY + Math.sin(this.animTimer * 4.0) * 0.7;
        const dist = this.pos.distanceTo(playerPos);
        if (dist < 18.0) {
          this.mesh.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
          if (this.attackCooldown <= 0) {
            this.attackCooldown = 3.0;
            spawnSnowball(this.pos, playerPos, game);
          }
        }
      }
    };
    enemies.push(enemyData);
    snowCustomCreatures.push(enemyData);
    return enemyData;
  }

  // 10. 🧙‍♂️ Kutup Şamanı & Donmuş Ruh (Frost Shaman)
  function createArcticFrostShaman(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const shGroup = new THREE.Group();
    shGroup.position.set(x, y, z);

    const sMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.6 });
    const robe = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.85, 2.4, 8), sMat);
    robe.position.y = 1.2;
    shGroup.add(robe);

    const staffOrb = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 1.5 })
    );
    staffOrb.position.set(0.7, 2.7, 0.3);
    shGroup.add(staffOrb);

    group.add(shGroup);

    const enemyData = {
      id: "frost_shaman_" + Math.round(z),
      type: "frost_shaman",
      name: "Kutup Şamanı",
      mesh: shGroup,
      pos: new THREE.Vector3(x, y, z),
      baseY: y,
      velocity: new THREE.Vector3(),
      hp: 120,
      maxHp: 120,
      attackPower: 14,
      isBoss: false,
      attackCooldown: 2.0,
      animTimer: 0,
      update: function(dt, playerPos, game) {
        this.animTimer += dt;
        staffOrb.rotation.y += dt * 3;
        this.pos.y = this.baseY + Math.sin(this.animTimer * 2.5) * 0.4;
        const dist = this.pos.distanceTo(playerPos);
        if (dist < 22.0) {
          this.mesh.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
          if (this.attackCooldown <= 0) {
            this.attackCooldown = 4.0;
            spawnIceArrow(this.pos, playerPos, game);
          }
        }
      }
    };
    enemies.push(enemyData);
    snowCustomCreatures.push(enemyData);
    return enemyData;
  }

  // =========================================================================
  // 👑 BÜYÜK BOSS: KOCA AYAK (BIGFOOT YETI - Exact shape, relocated to Stage 14!)
  // =========================================================================
  function createExactBigfootBoss(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const bossGroup = new THREE.Group();
    bossGroup.name = "boss_bigfoot_titan_relocated";
    bossGroup.position.set(x, y, z);
    bossGroup.scale.set(3.4, 3.4, 3.4); // Grand Yeti scale

    // Exact Materials from original code
    const furMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, emissive: 0x94a3b8, emissiveIntensity: 0.25 });
    const faceMat = new THREE.MeshStandardMaterial({ color: 0x64748b });
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const toothMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const armMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1 });
    const footMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
    const clubMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.4 });

    // Torso
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.85, 1.4, 12), furMat);
    torso.position.y = 1.0;
    bossGroup.add(torso);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 12), furMat);
    head.position.set(0, 1.8, 0.2);
    bossGroup.add(head);

    // Face / Snout
    const face = new THREE.Mesh(new THREE.SphereGeometry(0.35, 10, 10), faceMat);
    face.position.set(0, 1.75, 0.5);
    bossGroup.add(face);

    // Eyes
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 6), eyeMat);
    eyeL.position.set(-0.18, 1.85, 0.75);
    bossGroup.add(eyeL);
    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 6), eyeMat);
    eyeR.position.set(0.18, 1.85, 0.75);
    bossGroup.add(eyeR);

    // Horns / Teeth
    [-0.16, 0.16].forEach(tx => {
      const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.35, 6), toothMat);
      tooth.position.set(tx, 1.55, 0.75);
      tooth.rotation.x = Math.PI;
      bossGroup.add(tooth);
    });

    // Arms
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.35, 1.5, 8), armMat);
    armL.name = "bf_arm_left";
    armL.position.set(-1.0, 0.9, 0.2);
    armL.rotation.z = 0.25;
    bossGroup.add(armL);

    const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.35, 1.5, 8), armMat);
    armR.name = "bf_arm_right";
    armR.position.set(1.0, 0.9, 0.2);
    armR.rotation.z = -0.25;
    bossGroup.add(armR);

    // Legs
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.25, 1.1), footMat);
    legL.position.set(-0.45, 0.12, 0.2);
    bossGroup.add(legL);
    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.25, 1.1), footMat);
    legR.position.set(0.45, 0.12, 0.2);
    bossGroup.add(legR);

    // Ice Club Weapon
    const club = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.4, 2.0, 8), clubMat);
    club.name = "bf_ice_club";
    club.position.set(1.2, 0.6, 0.6);
    club.rotation.x = Math.PI / 4;
    bossGroup.add(club);

    group.add(bossGroup);

    const bossData = {
      id: "boss_bigfoot_titan",
      type: "bigfoot_boss",
      name: "Koca Ayak (Bigfoot Yeti Boss ❄️)",
      mesh: bossGroup,
      pos: new THREE.Vector3(x, y, z),
      spawnPos: new THREE.Vector3(x, y, z),
      basePos: new THREE.Vector3(x, y, z),
      velocity: new THREE.Vector3(),
      hp: 550,
      maxHp: 550,
      attackPower: 22,
      isBoss: true,
      attackCooldown: 2.0,
      animTimer: 0,
      state: "chase"
    };
    enemies.push(bossData);
    return bossData;
  }

  // =========================================================================
  // VICTORY EXIT PORTAL TO 6. BÖLÜM (VOLKANİK EJDERHA MAĞARASI)
  // =========================================================================
  function createSnowVictoryPortal(x, y, z, group) {
    const THREE = window.THREE;
    const portalGroup = new THREE.Group();
    portalGroup.name = "snow_stage14_victory_portal";
    portalGroup.position.set(x, y, z);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.5, 0.45, 16, 32),
      new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xc2410c, emissiveIntensity: 1.8 })
    );
    ring.position.y = 3.5;
    portalGroup.add(ring);

    const vortex = new THREE.Mesh(
      new THREE.CircleGeometry(3.2, 32),
      new THREE.MeshBasicMaterial({ color: 0xea580c, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
    );
    vortex.position.y = 3.5;
    portalGroup.add(vortex);

    group.add(portalGroup);

    return {
      mesh: portalGroup,
      pos: new THREE.Vector3(x, y, z),
      targetRegion: "volcano_cave"
    };
  }

  // =========================================================================
  // PROJECTILES & HAZARD SPAWNERS
  // =========================================================================
  function spawnSnowball(fromPos, toPos, game) {
    if (!window.THREE || !game || !game.scene) return;
    const THREE = window.THREE;
    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    ball.position.copy(fromPos);
    game.scene.add(ball);

    const dir = toPos.clone().sub(fromPos).normalize();
    activeSnowProjectiles.push({
      mesh: ball,
      pos: fromPos.clone(),
      dir: dir,
      speed: 14.0,
      life: 2.5,
      update: function(dt) {
        this.life -= dt;
        this.pos.add(this.dir.clone().multiplyScalar(this.speed * dt));
        this.mesh.position.copy(this.pos);
        if (game.playerPos && this.pos.distanceTo(game.playerPos) < 1.8) {
          game.damagePlayer(11);
          this.life = -1;
        }
      }
    });
  }

  function spawnIceArrow(fromPos, toPos, game) {
    if (!window.THREE || !game || !game.scene) return;
    const THREE = window.THREE;
    const arrow = new THREE.Mesh(
      new THREE.ConeGeometry(0.16, 1.2, 6),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    arrow.position.copy(fromPos);
    game.scene.add(arrow);

    const dir = toPos.clone().sub(fromPos).normalize();
    activeSnowProjectiles.push({
      mesh: arrow,
      pos: fromPos.clone(),
      dir: dir,
      speed: 18.0,
      life: 2.2,
      update: function(dt) {
        this.life -= dt;
        this.pos.add(this.dir.clone().multiplyScalar(this.speed * dt));
        this.mesh.position.copy(this.pos);
        if (game.playerPos && this.pos.distanceTo(game.playerPos) < 1.8) {
          game.damagePlayer(14);
          window.__freezePlayer(1.5); // Freeze Grizzy!
          this.life = -1;
        }
      }
    });
  }

  function spawnSnowShockwave(pos, game, maxR = 9.0) {
    if (!window.THREE || !game || !game.scene) return;
    const THREE = window.THREE;
    const waveMesh = new THREE.Mesh(
      new THREE.RingGeometry(0.8, 1.6, 24),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide })
    );
    waveMesh.rotation.x = -Math.PI / 2;
    waveMesh.position.set(pos.x, pos.y + 0.15, pos.z);
    game.scene.add(waveMesh);

    let radius = 1.0;
    activeSnowProjectiles.push({
      mesh: waveMesh,
      pos: pos.clone(),
      life: 1.2,
      update: function(dt) {
        this.life -= dt;
        radius += dt * 8.0;
        this.mesh.scale.set(radius, radius, 1);
        if (game.playerPos && game.isGrounded) {
          const d = Math.hypot(game.playerPos.x - this.pos.x, game.playerPos.z - this.pos.z);
          if (Math.abs(d - radius) < 1.4) {
            game.damagePlayer(16);
            game.playerVel.y = 11.0;
          }
        }
      }
    });
  }

  // =========================================================================
  // UPDATE TICK LOOP
  // =========================================================================
  let totalTime = 0;
  function updateSnowDesertExtension(dt) {
    const game = window.__superBearGame;
    if (!game || game.currentRegion !== 'snow_desert') return;
    totalTime += dt;

    // 1. Moving Ice Floes (Stage 3)
    snowMovingFloes.forEach(mp => {
      const offX = Math.sin(totalTime * mp.speed + mp.offset) * mp.rangeX;
      mp.mesh.position.x = mp.baseX + offX;
      if (mp.coll) {
        mp.coll.min.x = mp.baseX + offX - 2.4;
        mp.coll.max.x = mp.baseX + offX + 2.4;
      }
    });

    // 2. Crumbling Ice Crusts (Stage 4 & Stage 10)
    if (game.playerPos) {
      snowCrumblingCrusts.forEach(cp => {
        if (!cp.stepped) {
          const d = Math.hypot(game.playerPos.x - cp.mesh.position.x, game.playerPos.z - cp.mesh.position.z);
          if (d < 1.6 && Math.abs(game.playerPos.y - cp.baseY) < 1.2) {
            cp.stepped = true;
          }
        } else if (cp.dropTimer > 0) {
          cp.dropTimer -= dt;
          cp.mesh.position.x += (Math.random() - 0.5) * 0.16;
          if (cp.dropTimer <= 0) {
            if (cp.coll) cp.coll.min.y = -999;
          }
        } else {
          cp.fallSpeed += dt * 28.0;
          cp.mesh.position.y -= cp.fallSpeed * dt;
          cp.respawnTimer += dt;
          if (cp.respawnTimer > 4.5) {
            cp.stepped = false;
            cp.dropTimer = 0.75;
            cp.fallSpeed = 0;
            cp.respawnTimer = 0;
            cp.mesh.position.y = cp.baseY;
            if (cp.coll) cp.coll.min.y = cp.baseY - 0.3;
          }
        }
      });
    }

    // 3. Rotating Ice Mills (Stage 5)
    snowRotatingIceMills.forEach(rs => {
      rs.group.rotation.y += dt * rs.speed;
      if (game.playerPos && rs.group.position.distanceTo(game.playerPos) < 2.8) {
        game.damagePlayer(15);
      }
    });

    // 4. Avalanche Snow Boulders (Stage 6)
    snowAvalancheBoulders.forEach(ab => {
      ab.z += dt * ab.speed;
      ab.mesh.position.z = ab.z;
      ab.mesh.rotation.x += dt * 8.0;
      if (ab.z > -520) ab.z = ab.baseZ;
      if (game.playerPos && ab.mesh.position.distanceTo(game.playerPos) < 2.4) {
        game.damagePlayer(18);
        game.playerVel.z += 12.0;
        game.playerVel.y = 6.0;
      }
    });

    // 5. Falling Icicles (Stage 2)
    if (game.playerPos) {
      snowFallingIcicles.forEach(ic => {
        if (!ic.triggered) {
          const d = Math.hypot(game.playerPos.x - ic.x, game.playerPos.z - ic.z);
          if (d < 3.2) ic.triggered = true;
        } else if (ic.mesh.position.y > ic.targetY) {
          ic.fallSpeed += dt * 35.0;
          ic.mesh.position.y -= ic.fallSpeed * dt;
          if (ic.mesh.position.distanceTo(game.playerPos) < 1.8) {
            game.damagePlayer(16);
            window.__freezePlayer(1.0);
          }
        }
      });
    }

    // 6. Frost Lasers (Stage 9)
    snowFrostLasers.forEach(fl => {
      fl.mesh.rotation.y += dt * fl.speed;
      if (game.playerPos) {
        const d = Math.hypot(game.playerPos.x - fl.mesh.position.x, game.playerPos.z - fl.z);
        if (d < 5.8 && Math.abs(game.playerPos.y - fl.y) < 1.5) {
          const pAngle = Math.atan2(game.playerPos.z - fl.z, game.playerPos.x - fl.mesh.position.x);
          let diff = Math.abs(pAngle - fl.mesh.rotation.y) % (Math.PI * 2);
          if (diff < 0.25 || Math.abs(diff - Math.PI) < 0.25) {
            game.damagePlayer(16);
          }
        }
      }
    });

    // 7. Active Projectiles
    for (let i = activeSnowProjectiles.length - 1; i >= 0; i--) {
      const p = activeSnowProjectiles[i];
      p.update(dt);
      if (p.life <= 0) {
        if (p.mesh && p.mesh.parent) p.mesh.parent.remove(p.mesh);
        activeSnowProjectiles.splice(i, 1);
      }
    }

    // 8. Stage 14 Victory Portal Interaction
    if (snowVictoryPortal && game.playerPos) {
      snowVictoryPortal.mesh.rotation.y += dt * 0.8;
      const d = snowVictoryPortal.pos.distanceTo(game.playerPos);
      if (d < 3.8) {
        const isBossAlive = (game.currentLevel && game.currentLevel.enemies || []).some(
          e => e && e.id === "boss_bigfoot_titan" && e.hp > 0
        );
        if (isBossAlive) {
          const now = Date.now();
          if (!snowVictoryPortal._lastNotice || now - snowVictoryPortal._lastNotice > 2500) {
            snowVictoryPortal._lastNotice = now;
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("⚠️ Volkanik Ejderha Mağarası portalından geçmek için önce Koca Ayak'ı yenmelisin! ⚔️", "warning");
            }
          }
        } else {
          if (!snowVictoryPortal._triggered) {
            snowVictoryPortal._triggered = true;
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("🌀 6. Bölüm: Volkanik Ejderha Mağarası'na Geçiliyor! 🌋", "success");
            }
            setTimeout(() => {
              game.loadRegion("volcano_cave");
            }, 800);
          }
        }
      }
    }
  }

  // =========================================================================
  // CLEANUP & MEMORY DISPOSAL
  // =========================================================================
  function cleanUpSnowDesertExtension(game) {
    if (!game) game = window.__superBearGame;
    activeSnowProjectiles.forEach(p => {
      if (p.mesh && p.mesh.parent) p.mesh.parent.remove(p.mesh);
    });
    activeSnowProjectiles = [];

    if (snowExtensionGroup) {
      snowExtensionGroup.traverse(obj => {
        if (obj.geometry && typeof obj.geometry.dispose === 'function') obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => {
              if (m.map && typeof m.map.dispose === 'function') m.map.dispose();
              if (typeof m.dispose === 'function') m.dispose();
            });
          } else {
            if (obj.material.map && typeof obj.material.map.dispose === 'function') obj.material.map.dispose();
            if (typeof obj.material.dispose === 'function') obj.material.dispose();
          }
        }
        if (obj.isLight && typeof obj.dispose === 'function') obj.dispose();
      });
      if (snowExtensionGroup.parent) snowExtensionGroup.parent.remove(snowExtensionGroup);
      snowExtensionGroup = null;
    }
    snowMovingFloes = [];
    snowCrumblingCrusts = [];
    snowRotatingIceMills = [];
    snowFrostLasers = [];
    snowAvalancheBoulders = [];
    snowFallingIcicles = [];
    snowCustomCreatures = [];
    activeBigfootBoss = null;
    snowVictoryPortal = null;
    console.log("🧹 [Snow Desert Extension] Bellek başarıyla temizlendi (Disposed).");
  }

  function initSnowTicker() {
    const game = window.__superBearGame;
    if (game && !game._snowDesertTickerHooked) {
      game._snowDesertTickerHooked = true;
      const origUpdate = game.update;
      game.update = function(dt, totalTime) {
        origUpdate.call(this, dt, totalTime);
        try {
          updateSnowDesertExtension(dt);
        } catch(err) {}
      };
    }
  }

  window.addEventListener('superbear:region-changed', (e) => {
    const newReg = e.detail;
    if (newReg !== 'snow_desert') {
      cleanUpSnowDesertExtension();
    }
  });

  const tickerInterval = setInterval(() => {
    if (window.__superBearGame) {
      initSnowTicker();
      clearInterval(tickerInterval);
    }
  }, 100);

  window.__cleanUpSnowDesertExtension = cleanUpSnowDesertExtension;
  window.__updateSnowDesertExtension = updateSnowDesertExtension;
  console.log("❄️ [Snow Desert Extension] Script Loaded & Ready!");
})();
