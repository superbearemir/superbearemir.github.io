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
    buildSnowPlatform(38, 7, 2, 0, 36.5, -176, iceWallMat, false, false, false);
    T("snow_closed_nest_easel", 4, "❄️ ESKİ BOSS İNİ KAPATILDI!\nKoca Ayak 14. Aşamaya (-1496) Taşındı!\nÖnündeki 14 Zorlu Aşamayı Aş!", 0, 36.0, -186, 0);
    buildSnowPlatform(12, 1.8, 28, 0, 35.0, -208, v, false, false, true);
    buildSnowPlatform(10, 0.4, 28, 0, 36.0, -208, snowWhiteMat, false, false, true);

    // =========================================================================
    // ❄️ 1. AŞAMA: DONMUŞ BUZUL GİRİŞİ & KAYGAN RAMPALAR [Zorlu]
    // =========================================================================
    addCheckpoint("snow_cp_s1", "1. Aşama: Buzul Girişi & Kaygan Rampalar", 0, 36.5, -220);
    buildSnowPlatform(20, 2, 20, 0, 35.0, -220, v, false, false, true);
    buildSnowPlatform(18, 0.4, 18, 0, 36.1, -220, snowWhiteMat);
    b("snow_coin_s1_0", -4, 37.0, -220, false);
    b("snow_coin_s1_1", 4, 37.0, -220, false);
    buildSnowPlatform(8, 1.0, 35, 0, 36.0, -248, iceGlacierMat, false, false, true);
    b("snow_gem_s1", 0, 38.0, -248, true);
    createFrostShardGolem(0, 37.5, -260, enemies, snowExtensionGroup);

    // =========================================================================
    // ❄️ 2. AŞAMA: DÜŞEN SİVRİ BUZ SARKITLARI [Zorlu]
    // =========================================================================
    addCheckpoint("snow_cp_s2", "2. Aşama: Düşen Sivri Buz Sarkıtları", 0, 39.5, -280);
    buildSnowPlatform(16, 2, 14, 0, 38.5, -280, v, false, false, true);
    [-292, -304, -316].forEach((iz, idx) => {
      const ix = (idx % 2 === 0 ? -2.5 : 2.5);
      const iy = 40.0 + idx * 0.8;
      buildSnowPlatform(5.5, 1.0, 5.5, ix, iy, iz, v, false, false, true);
      const icicle = new THREE.Mesh(new THREE.ConeGeometry(0.4, 2.2, 6), frostCrystalMat);
      icicle.rotation.x = Math.PI;
      icicle.position.set(ix, iy + 6.5, iz);
      snowExtensionGroup.add(icicle);
      snowFallingIcicles.push({ mesh: icicle, x: ix, y: iy + 6.5, targetY: iy + 0.5, z: iz, triggered: false, fallSpeed: 0 });
    });
    createArcticAlphaWolf(0, 42.0, -320, enemies, snowExtensionGroup);

    // =========================================================================
    // ❄️ 3. AŞAMA: HAREKETLİ BUZ SALI PLATFORMLARI [Zorlu]
    // =========================================================================
    addCheckpoint("snow_cp_s3", "3. Aşama: Hareketli Buz Salları", 0, 42.5, -340);
    buildSnowPlatform(16, 2, 14, 0, 41.5, -340, v, false, false, true);
    [-355, -367, -379, -391].forEach((mz, mIdx) => {
      const my = 42.0 + mIdx * 0.8;
      const mMesh = buildSnowPlatform(4.8, 1.0, 4.8, 0, my, mz, iceGlacierMat, false, false, true);
      snowMovingFloes.push({
        mesh: mMesh, coll: collidables[collidables.length - 1],
        baseX: 0, baseY: my, baseZ: mz, rangeX: 5.5, speed: 1.8, offset: mIdx * 1.5, halfW: 2.4
      });
    });
    createGlacialTortoise(0, 44.5, -375, enemies, snowExtensionGroup);

    // =========================================================================
    // ❄️ 4. AŞAMA: ÇÖKEN İNCE KAR KÖPRÜLERİ [Zorlu]
    // =========================================================================
    addCheckpoint("snow_cp_s4", "4. Aşama: Çöken İnce Kar Köprüleri", 0, 45.5, -400);
    buildSnowPlatform(14, 2, 12, 0, 44.5, -400, v, false, false, true);
    [
      { x: -3.5, z: -412, y: 45.2 }, { x: 3.5, z: -422, y: 46.0 },
      { x: -2.0, z: -432, y: 46.8 }, { x: 2.5, z: -442, y: 47.6 }
    ].forEach((cs, cIdx) => {
      const cMesh = buildSnowPlatform(2.2, 0.6, 2.2, cs.x, cs.y, cs.z, snowWhiteMat, false, false, true);
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
    [-475, -495].forEach((sz, sIdx) => {
      buildSnowPlatform(6, 1.2, 6, 0, 48.5 + sIdx * 1.0, sz, v, false, false, true);
      const spinGroup = new THREE.Group();
      spinGroup.position.set(0, 50.0 + sIdx * 1.0, sz);
      for (let arm = 0; arm < 4; arm++) {
        const iceSpike = new THREE.Mesh(new THREE.ConeGeometry(0.35, 4.8, 6), frostCrystalMat);
        const ang = (arm / 4) * Math.PI * 2;
        iceSpike.position.set(Math.cos(ang) * 2.6, 0, Math.sin(ang) * 2.6);
        iceSpike.rotation.z = -Math.PI / 2; iceSpike.rotation.y = -ang;
        spinGroup.add(iceSpike);
      }
      snowExtensionGroup.add(spinGroup);
      snowRotatingIceMills.push({ group: spinGroup, speed: 2.2 });
    });
    createFrostBouncingSeal(-3.5, 49.5, -485, enemies, snowExtensionGroup);

    // =========================================================================
    // ❄️ 6. AŞAMA: ÇIĞ YUVARLANAN KAR TOPU KANYONU [Zorlu]
    // =========================================================================
    addCheckpoint("snow_cp_s6", "6. Aşama: Çığ Yuvarlanan Kar Topu Kanyonu", 0, 51.5, -520);
    buildSnowPlatform(18, 2, 14, 0, 50.5, -520, v, false, false, true);
    buildSnowPlatform(9, 1.5, 45, 0, 52.0, -545, iceGlacierMat, false, false, true);
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
    buildSnowPlatform(3.5, 1.0, 40, 0, 55.0, -605, iceGlacierMat, false, false, true);
    createIceHunterSniper(-4.5, 56.5, -605, enemies, snowExtensionGroup);

    // =========================================================================
    // ❄️ 8. AŞAMA: DONMUŞ GAYZER PÜSKÜRTÜCÜLERİ [Zorlu]
    // =========================================================================
    addCheckpoint("snow_cp_s8", "8. Aşama: Donmuş Gayzer Püskürtücüleri", 0, 57.5, -640);
    buildSnowPlatform(16, 2, 14, 0, 56.5, -640, v, false, false, true);
    [-655, -670, -685].forEach((gz, gIdx) => {
      buildSnowPlatform(6, 1.2, 6, (gIdx % 2 === 0 ? -3.0 : 3.0), 58.0 + gIdx * 0.8, gz, iceGlacierMat, false, false, true);
    });
    createFrostVortexElemental(0, 59.0, -670, enemies, snowExtensionGroup);

    // =========================================================================
    // ❄️ 9. AŞAMA: LAZERLİ ANTİK BUZ KRİSTALİ IZGARASI [Zorlu]
    // =========================================================================
    addCheckpoint("snow_cp_s9", "9. Aşama: Lazerli Buz Kristali Izgarası", 0, 60.5, -700);
    buildSnowPlatform(16, 2, 14, 0, 59.5, -700, v, false, false, true);
    [-715, -735].forEach((lz, idx) => {
      buildSnowPlatform(12, 1.5, 10, 0, 61.0 + idx * 1.0, lz, iceGlacierMat, false, false, true);
      const laserMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 11.5, 8), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
      laserMesh.rotation.z = Math.PI / 2; laserMesh.position.set(0, 62.5 + idx * 1.0, lz);
      snowExtensionGroup.add(laserMesh);
      snowFrostLasers.push({ mesh: laserMesh, speed: 2.5, y: 62.5 + idx * 1.0, z: lz });
    });
    createGlacialIceBat(-4.0, 64.0, -725, enemies, snowExtensionGroup);

    // =========================================================================
    // ❄️ 10. AŞAMA: ERİYİP DÜŞEN BUZUL SÜTUNLARI [Zorlu]
    // =========================================================================
    addCheckpoint("snow_cp_s10", "10. Aşama: Eriyip Düşen Buzul Sütunları", 0, 63.5, -760);
    buildSnowPlatform(14, 2, 12, 0, 62.5, -760, v, false, false, true);
    [
      { x: -3.0, z: -772, y: 63.5 }, { x: 3.0, z: -782, y: 64.3 },
      { x: -2.0, z: -792, y: 65.1 }, { x: 2.5, z: -802, y: 65.9 }
    ].forEach((tp, tIdx) => {
      const pMesh = buildSnowPlatform(1.8, 0.6, 1.8, tp.x, tp.y, tp.z, iceGlacierMat, false, false, true);
      snowCrumblingCrusts.push({
        mesh: pMesh, coll: collidables[collidables.length - 1],
        baseY: tp.y, stepped: false, dropTimer: 0.7, fallSpeed: 0, respawnTimer: 0
      });
    });
    createArcticFrostShaman(0, 67.0, -795, enemies, snowExtensionGroup);

    // =========================================================================
    // ❄️ 11. AŞAMA: DEVASA BUZUL SIRTI & FIRTINALI DENGE KİRİŞLERİ
    // =========================================================================
    addCheckpoint("snow_cp_s11", "11. Aşama: Devasa Buzul Sırtı & Fırtına Kirişleri", 0, 66.5, -820);
    buildSnowPlatform(16, 2, 14, 0, 65.5, -820, v, false, false, true);
    buildSnowPlatform(7.5, 1.2, 34, 0, 70.2, -946, iceGlacierMat, false, false, true);
    createArcticAlphaWolf(0, 71.5, -944, enemies, snowExtensionGroup);

    // =========================================================================
    // ❄️ 12. AŞAMA: ERİYİp ÇÖKEN SÜTUNLAR & ÇİFTLİ DEĞİRMENLER
    // =========================================================================
    addCheckpoint("snow_cp_s12", "12. Aşama: Eriyip Çöken Sütunlar & Çiftli Değirmenler", 0, 72.2, -976);
    buildSnowPlatform(16, 2, 14, 0, 71.2, -976, v, false, false, true);
    S(0, 77.2, -1125, 17.5);

    // =========================================================================
    // ❄️ 13. AŞAMA: DONMUŞ ZAMAN KRİSTALLERİ & KAOTİK LAZER LABİRENTİ
    // =========================================================================
    addCheckpoint("snow_cp_s13", "13. Aşama: Donmuş Zaman Kristalleri & Lazer Labirenti", 0, 77.8, -1148);
    buildSnowPlatform(18, 2, 16, 0, 83.0, -1308, v, false, false, true);

    // =========================================================================
    // 👑 14. AŞAMA: [BÜYÜK BOSS ARENASI] YÜCE DONMUŞ TAHT ZİRVESİ & KOCA AYAK YETİ
    // =========================================================================
    addCheckpoint("snow_cp_s14", "14. Aşama: [BÜYÜK BOSS] Yüce Donmuş Taht Zirvesi ❄️", 0, 84.0, -1318);

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

    activeBigfootBoss = createExactBigfootBoss(0, summitArenaY + 1.8, summitArenaZ + 5, enemies, snowExtensionGroup);
    snowVictoryPortal = createSnowVictoryPortal(0, summitArenaY + 1.8, summitArenaZ - 30, snowExtensionGroup);

    console.log("✅ [Snow Desert Extension] 14 Aşama ve Bigfoot Boss Başarıyla Yüklendi!");
  };

  function createFrostShardGolem(x, y, z, enemies, group) {
    const THREE = window.THREE; const g = new THREE.Group(); g.position.set(x, y, z);
    const b = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.2, 1.4), new THREE.MeshStandardMaterial({ color: 0x93c5fd }));
    b.position.y = 1.4; g.add(b); group.add(g);
    enemies.push({ id: "g_" + z, type: "snow_golem", name: "Buzul Golemi", mesh: g, pos: new THREE.Vector3(x,y,z), hp: 140, maxHp: 140, attackPower: 16, update: function(dt, p, game) { if(this.pos.distanceTo(p)<15&&this.pos.distanceTo(p)<2.5) game.damagePlayer(16); } });
  }
  function createArcticAlphaWolf(x, y, z, enemies, group) {
    const THREE = window.THREE; const g = new THREE.Group(); g.position.set(x, y, z);
    const b = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.9, 2.0), new THREE.MeshStandardMaterial({ color: 0xe2e8f0 }));
    b.position.y = 0.8; g.add(b); group.add(g);
    enemies.push({ id: "w_" + z, type: "frost_wolf", name: "Alfa Kurt", mesh: g, pos: new THREE.Vector3(x,y,z), hp: 75, maxHp: 75, attackPower: 14, update: function(dt, p, game) { if(this.pos.distanceTo(p)<15&&this.pos.distanceTo(p)<2.5) { game.damagePlayer(14); window.__freezePlayer(1.2); } } });
  }
  function createGlacialTortoise(x, y, z, enemies, group) {
    const THREE = window.THREE; const g = new THREE.Group(); g.position.set(x, y, z);
    const s = new THREE.Mesh(new THREE.SphereGeometry(1.0, 10, 8), new THREE.MeshStandardMaterial({ color: 0x60a5fa }));
    s.scale.set(1.2, 0.6, 1.2); s.position.y = 0.55; g.add(s); group.add(g);
    enemies.push({ id: "t_" + z, type: "ice_tortoise", name: "Buzul Kaplumbağası", mesh: g, pos: new THREE.Vector3(x,y,z), hp: 110, maxHp: 110, attackPower: 12, update: function() {} });
  }
  function createBlizzardEagle(x, y, z, enemies, group) {
    const THREE = window.THREE; const g = new THREE.Group(); g.position.set(x, y, z);
    const b = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.8, 6), new THREE.MeshStandardMaterial({ color: 0x94a3b8 }));
    b.rotation.x = Math.PI / 2; g.add(b); group.add(g);
    enemies.push({ id: "e_" + z, type: "blizzard_eagle", name: "Buzul Kartalı", mesh: g, pos: new THREE.Vector3(x,y,z), hp: 60, maxHp: 60, attackPower: 12, update: function() {} });
  }
  function createFrostBouncingSeal(x, y, z, enemies, group) {
    const THREE = window.THREE; const g = new THREE.Group(); g.position.set(x, y, z);
    const b = new THREE.Mesh(new THREE.SphereGeometry(1.0, 10, 8), new THREE.MeshStandardMaterial({ color: 0x475569 }));
    b.scale.set(1.1, 0.7, 1.6); b.position.y = 0.55; g.add(b); group.add(g);
    enemies.push({ id: "s_" + z, type: "frost_seal", name: "Kutup Foku", mesh: g, pos: new THREE.Vector3(x,y,z), hp: 85, maxHp: 85, attackPower: 13, update: function() {} });
  }
  function createFrostSnowman(x, y, z, enemies, group) {
    const THREE = window.THREE; const g = new THREE.Group(); g.position.set(x, y, z);
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.85, 8, 8), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    b.position.y = 0.85; g.add(b); group.add(g);
    enemies.push({ id: "sm_" + z, type: "frost_snowman", name: "Kar Adamı", mesh: g, pos: new THREE.Vector3(x,y,z), hp: 70, maxHp: 70, attackPower: 11, update: function() {} });
  }
  function createIceHunterSniper(x, y, z, enemies, group) {
    const THREE = window.THREE; const g = new THREE.Group(); g.position.set(x, y, z);
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.75, 2.2, 8), new THREE.MeshStandardMaterial({ color: 0x334155 }));
    b.position.y = 1.1; g.add(b); group.add(g);
    enemies.push({ id: "ih_" + z, type: "ice_hunter", name: "Buz Avcısı", mesh: g, pos: new THREE.Vector3(x,y,z), hp: 80, maxHp: 80, attackPower: 14, update: function() {} });
  }
  function createFrostVortexElemental(x, y, z, enemies, group) {
    const THREE = window.THREE; const g = new THREE.Group(); g.position.set(x, y, z);
    const c = new THREE.Mesh(new THREE.ConeGeometry(1.2, 3.2, 12, 1, true), new THREE.MeshBasicMaterial({ color: 0xe0f2fe, wireframe: true }));
    c.position.y = 1.6; g.add(c); group.add(g);
    enemies.push({ id: "fv_" + z, type: "frost_vortex", name: "Buz Kasırgası", mesh: g, pos: new THREE.Vector3(x,y,z), hp: 120, maxHp: 120, attackPower: 15, update: function() {} });
  }
  function createGlacialIceBat(x, y, z, enemies, group) {
    const THREE = window.THREE; const g = new THREE.Group(); g.position.set(x, y, z);
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.5, 6, 6), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
    g.add(b); group.add(g);
    enemies.push({ id: "ib_" + z, type: "ice_bat", name: "Buz Yarasası", mesh: g, pos: new THREE.Vector3(x,y,z), hp: 45, maxHp: 45, attackPower: 10, update: function() {} });
  }
  function createArcticFrostShaman(x, y, z, enemies, group) {
    const THREE = window.THREE; const g = new THREE.Group(); g.position.set(x, y, z);
    const r = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.85, 2.4, 8), new THREE.MeshStandardMaterial({ color: 0x0284c7 }));
    r.position.y = 1.2; g.add(r); group.add(g);
    enemies.push({ id: "fs_" + z, type: "frost_shaman", name: "Kutup Şamanı", mesh: g, pos: new THREE.Vector3(x,y,z), hp: 120, maxHp: 120, attackPower: 14, update: function() {} });
  }
  function createExactBigfootBoss(x, y, z, enemies, group) {
    const THREE = window.THREE; const g = new THREE.Group(); g.position.set(x, y, z); g.scale.set(3.4, 3.4, 3.4);
    const t = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.85, 1.4, 12), new THREE.MeshStandardMaterial({ color: 0xe2e8f0 }));
    t.position.y = 1.0; g.add(t); group.add(g);
    const boss = { id: "boss_bigfoot_titan", type: "bigfoot_boss", name: "Koca Ayak Yeti", mesh: g, pos: new THREE.Vector3(x,y,z), hp: 550, maxHp: 550, attackPower: 22, isBoss: true };
    enemies.push(boss); return boss;
  }
  function createSnowVictoryPortal(x, y, z, group) {
    const THREE = window.THREE; const g = new THREE.Group(); g.position.set(x, y, z);
    const r = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.45, 16, 32), new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xc2410c, emissiveIntensity: 1.8 }));
    r.position.y = 3.5; g.add(r); group.add(g);
    return { mesh: g, pos: new THREE.Vector3(x,y,z), targetRegion: "volcano_cave" };
  }
  function spawnSnowball() {}
  function spawnIceArrow() {}

  function updateSnowDesertExtension(dt) {
    const game = window.__superBearGame;
    if (!game || game.currentRegion !== 'snow_desert') return;
    totalTime += dt;
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
