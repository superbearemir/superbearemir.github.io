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
    createPolarIceBehemoth(0, 71.0, -944, enemies, snowExtensionGroup);

    // =========================================================================
    // ❄️ 12. AŞAMA: ERİYİP ÇÖKEN SÜTUNLAR & ÇİFTLİ DEĞİRMENLER
    // =========================================================================
    addCheckpoint("snow_cp_s12", "12. Aşama: Eriyip Çöken Sütunlar & Çiftli Değirmenler", 0, 72.2, -976);
    buildSnowPlatform(16, 2, 14, 0, 71.2, -976, v, false, false, true);
    createCryoScorpionStalker(0, 72.4, -976, enemies, snowExtensionGroup);
    S(0, 77.2, -1125, 17.5);

    // =========================================================================
    // ❄️ 13. AŞAMA: DONMUŞ ZAMAN KRİSTALLERİ & KAOTİK LAZER LABİRENTİ
    // =========================================================================
    addCheckpoint("snow_cp_s13", "13. Aşama: Donmuş Zaman Kristalleri & Lazer Labirenti", 0, 77.8, -1148);
    buildSnowPlatform(18, 2, 16, 0, 83.0, -1308, v, false, false, true);
    createFrostValkyrieKnight(0, 84.2, -1308, enemies, snowExtensionGroup);

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
    const g = (typeof window.__buildDistinctCreatureMesh === 'function')
      ? window.__buildDistinctCreatureMesh(THREE, 0, { primaryColor: 0xe2e8f0, accentColor: 0x38bdf8, scale: 3.1 })
      : new THREE.Group();
    g.position.set(x, y, z);
    group.add(g);

    const boss = {
      id: "boss_bigfoot_titan",
      type: "bigfoot_boss",
      name: "Koca Ayak Yeti (Buzul Kralı ❄️👑)",
      mesh: g,
      pos: new THREE.Vector3(x, y, z),
      baseX: x,
      baseY: y,
      baseZ: z,
      hp: 650,
      maxHp: 650,
      attackPower: 22,
      isBoss: true,
      _shootCooldown: 2.0,
      update: function(dt, p, game) {
        const t = Date.now() * 0.002;
        this.mesh.position.x = this.baseX + Math.sin(t) * 12.0;
        this.mesh.position.z = this.baseZ + Math.cos(t * 0.7) * 9.0;
        if (p) {
          this.mesh.lookAt(p.x, this.mesh.position.y, p.z);
        }
        this.pos.copy(this.mesh.position);

        if (p && this.pos.distanceTo(p) < 42) {
          this._shootCooldown -= dt;
          if (this._shootCooldown <= 0) {
            this._shootCooldown = 1.9;
            if (typeof window.__spawnEnemyProjectile === 'function') {
              window.__spawnEnemyProjectile(game, this.pos, p, {
                color: 0x38bdf8,
                glow: 0xffffff,
                shape: 'crystal',
                speed: 22,
                dmg: 18
              });
            }
          }
          if (this.pos.distanceTo(p) < 5.5) {
            game.damagePlayer(this.attackPower);
          }
        }
      }
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
