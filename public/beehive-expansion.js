// ============================================================================
// 🐝 3. BÖLÜM: VIZILDIYAN BAL KOVANI GENİŞLETMESİ (9 YENİ AŞAMA & 6 ÖZEL CANLI)
// - Boss ilk yerinden (z: -142) kaldırıldı, 9. Aşamadaki Kraliyet Taht Zirvesi'ne taşındı!
// - 9 Yeni Aşama:
//     * Aşama 1 (Kolay): Altın Petek Asma Yolları & Bal Köprüsü
//     * Aşama 2 (Kolay): Dev Mumlar & Yüzen Petek Basamakları
//     * Aşama 3 (Kolay): Kraliyet Nektar Şelalesi & Bal Çarkları
//     * Aşama 4 (Orta Zorluk): Hareketli Altıgen Petekler & Bal Fıskiyeleri
//     * Aşama 5 (Orta Zorluk): Dönen İğne Değirmenleri & Kaygan Bal Rampaları
//     * Aşama 6 (Orta Zorluk): Akışkan Bal Labirenti & Kovan Koridoru
//     * Aşama 7 (ULTRA MEGA ZOR): Eriyip Çöken Balmumu Sütunları
//     * Aşama 8 (ULTRA MEGA ZOR): Lazerli Nektar Izgarası & Sarkaç Kaosu
//     * Aşama 9 (ULTRA MEGA ZOR BOSS): Yüce Kraliyet Taht Zirvesi & Dev Mor Ayı (Final Zirve)
// - 6 Özel Yeni Canlı ve Mekanikleri:
//     1. 🐝 Ağır Zırhlı Bal Arısı Tankı (Ön zırh kalkanı, burgu iğne hücumu ve geri itme)
//     2. 🍯 Yapışkan Bal Balçığı (Zıplayan nektar slime, basılınca %65 yavaşlatan yapışkan bal)
//     3. 💥 Patlayıcı Polen Böceği (Hızlı koşan böcek, geri sayımla 5m çapında polen patlaması)
//     4. 🏹 Zehirli İğne Nişancısı Yabanarısı (Yüksek petek tünemi, güdümlü zehir iğneleri)
//     5. 🌪️ Kraliyet Fırtına Kraliçesi (Kanat fırtınasıyla ayıyı köprüden uçuruma iten rüzgar)
//     6. 🛡️ Kovan Rahibi & Nektar Şifacısı (Dostlara dokunulmazlık aurası, bağlayıcı bal ağları)
// ============================================================================
(function() {
  'use strict';

  let hiveExtensionGroup = null;
  let activeHiveProjectiles = [];
  let hiveMovingPlatforms = [];
  let hiveMeltingPillars = [];
  let hiveRotatingSpinners = [];
  let hiveLaserGrids = [];
  let activePurpleBearBoss = null;
  let hiveVictoryPortal = null;
  let hiveCustomCreatures = [];

  // Helper to slow player with sticky honey
  window.__applyStickyHoneySlow = function(duration = 3.0, factor = 0.35) {
    const game = window.__superBearGame;
    if (!game || !game.stats) return;
    if (game._stickySlowTimer > 0) return;
    game._stickySlowTimer = duration;
    const origSpeed = game.stats.moveSpeed || 7.5;
    game.stats.moveSpeed = origSpeed * factor;
    if (game.callbacks && game.callbacks.onShowNotice) {
      game.callbacks.onShowNotice("🍯 Yapışkan Bala Bastın! Yavaşladın! ⚠️", "warning");
    }
    if (window.St && window.St.playDamage) window.St.playDamage();
    game.spawnSparkleParticles(game.playerPos, 16, 0xd97706);

    const checkInterval = setInterval(() => {
      game._stickySlowTimer -= 0.2;
      if (game._stickySlowTimer <= 0) {
        game.stats.moveSpeed = origSpeed;
        clearInterval(checkInterval);
        if (game.callbacks && game.callbacks.onShowNotice) {
          game.callbacks.onShowNotice("✨ Baldan Kurtuldun! Hızın Normale Döndü.", "success");
        }
      }
    }, 200);
  };

  // Main Builder function invoked by game-bundle.js during Ww('beehive')
  window.__populateBeehiveExtension = function(
    sceneGroup, collidables, platforms, enemies, items, easels, npcs,
    checkpoints, addCheckpoint, R, b, S, T,
    honeyGoldMat, honeyAmberMat, toxicHoneyMat, hiveCellMat, purpleRoyalMat, darkStoneMat
  ) {
    if (!window.THREE) return;
    const THREE = window.THREE;
    console.log("🐝 [Beehive Extension] 9 Yeni Aşama ve 6 Özel Canlı Oluşturuluyor...");

    // Remove invisible wall: extend level bounds so player can explore all 9 stages freely
    const gameInstance = window.__superBearGame;
    if (gameInstance && gameInstance.currentLevel && gameInstance.currentLevel.bounds) {
      gameInstance.currentLevel.bounds.minZ = -1200;
      gameInstance.currentLevel.bounds.maxZ = 100;
      gameInstance.currentLevel.bounds.minX = -300;
      gameInstance.currentLevel.bounds.maxX = 300;
      gameInstance.currentLevel.bounds.minY = -50;
      gameInstance.currentLevel.bounds.maxY = 250;
    }

    // Create container group
    hiveExtensionGroup = new THREE.Group();
    hiveExtensionGroup.name = "beehive_9_stages_extension";
    sceneGroup.add(hiveExtensionGroup);

    // Reset local arrays
    activeHiveProjectiles = [];
    hiveMovingPlatforms = [];
    hiveMeltingPillars = [];
    hiveRotatingSpinners = [];
    hiveLaserGrids = [];
    hiveCustomCreatures = [];
    activePurpleBearBoss = null;
    hiveVictoryPortal = null;

    // Additional thematic materials
    const waxCandleMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfde047,
      emissiveIntensity: 0.6,
      roughness: 0.3
    });
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
    const honeyGemMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xeab308,
      emissiveIntensity: 1.2,
      metalness: 0.8
    });

    function buildHivePlatform(w, h, d, px, py, pz, mat, isHazard = false, isClimbable = false, isIce = false) {
      return R(w, h, d, px, py, pz, mat, isHazard, isClimbable, isIce);
    }

    // =========================================================================
    // 🟡 1. AŞAMA (KOLAY): ALTIN PETEK ASMA YOLLARI (z: -165 -> -225, Y: 18 -> 21)
    // =========================================================================
    addCheckpoint("hive_cp_s1", "1. Aşama: Altın Petek Asma Yolları [Kolay]", 0, 18.5, -180);

    buildHivePlatform(20, 2, 20, 0, 17.0, -180, honeyGoldMat);
    buildHivePlatform(18, 0.4, 18, 0, 18.1, -180, hiveCellMat);
    b("hive_coin_s1_0", -4, 19.0, -180, false);
    b("hive_coin_s1_1", 4, 19.0, -180, false);

    // Honeycomb bridge tiles
    for (let i = 0; i < 6; i++) {
      const bz = -196 - (i * 5.0);
      const by = 18.0 + (i * 0.5);
      buildHivePlatform(6.0, 0.8, 4.5, 0, by, bz, honeyAmberMat);
      // Honey drops along edges
      const drop = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), honeyGoldMat);
      drop.position.set((i % 2 === 0 ? -3.2 : 3.2), by + 0.6, bz);
      hiveExtensionGroup.add(drop);
      if (i === 3) b("hive_gem_s1", 0, by + 1.6, bz, true);
    }

    // Creature 1: Ağır Zırhlı Bal Arısı Tankı #1
    createArmoredHornetTank(0, 20.5, -220, enemies, hiveExtensionGroup);

    // =========================================================================
    // 🟡 2. AŞAMA (KOLAY): DEV MUMLAR & YÜZEN PETEKLER (z: -225 -> -285, Y: 21 -> 24)
    // =========================================================================
    addCheckpoint("hive_cp_s2", "2. Aşama: Dev Mumlar & Yüzen Petekler [Kolay]", 0, 21.5, -235);
    buildHivePlatform(16, 2, 14, 0, 20.5, -235, honeyGoldMat);

    // Giant Glowing Beeswax Candles with Flame wicks
    const candleCoords = [
      { x: -4.0, z: -248, h: 4.5, y: 21.2 },
      { x: 3.5, z: -258, h: 5.5, y: 22.0 },
      { x: -3.0, z: -268, h: 6.0, y: 22.8 },
      { x: 2.5, z: -278, h: 6.8, y: 23.5 }
    ];
    candleCoords.forEach((cc, cIdx) => {
      // Candle column platform
      buildHivePlatform(4.5, 1.0, 4.5, cc.x, cc.y, cc.z, waxCandleMat);
      // Flame mesh
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.2, 8), flameMat);
      flame.position.set(cc.x + 1.8, cc.y + 1.2, cc.z);
      hiveExtensionGroup.add(flame);
      // Warm light
      const fLight = new THREE.PointLight(0xf97316, 2.0, 10);
      fLight.position.copy(flame.position);
      hiveExtensionGroup.add(fLight);
      b(`hive_coin_s2_${cIdx}`, cc.x, cc.y + 1.5, cc.z, cIdx === 2);
    });

    // Creature 2: Yapışkan Bal Balçığı #1 & #2 (Honey Slimes)
    createStickyHoneySlime(-3.5, 22.5, -255, enemies, hiveExtensionGroup);
    createStickyHoneySlime(3.5, 23.5, -275, enemies, hiveExtensionGroup);

    // =========================================================================
    // 🟡 3. AŞAMA (KOLAY): KRALİYET NEKTAR ŞELALESİ (z: -285 -> -345, Y: 24 -> 27)
    // =========================================================================
    addCheckpoint("hive_cp_s3", "3. Aşama: Kraliyet Nektar Şelalesi [Kolay]", 0, 24.5, -295);
    buildHivePlatform(16, 2, 14, 0, 23.5, -295, honeyGoldMat);

    // Flowing Golden Honey River below
    buildHivePlatform(40, 1.0, 45, 0, 18.0, -320, toxicHoneyMat, true);

    // Stepping waterwheel pads
    [-308, -318, -328, -338].forEach((wz, wIdx) => {
      const wx = (wIdx % 2 === 0 ? -3.0 : 3.0);
      const wy = 24.5 + wIdx * 0.6;
      buildHivePlatform(4.2, 0.8, 4.2, wx, wy, wz, hiveCellMat);
      // Decorative honey churner
      const churner = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3.5, 8), darkStoneMat);
      churner.position.set(wx, wy + 1.8, wz);
      churner.rotation.x = Math.PI / 2;
      hiveExtensionGroup.add(churner);
      b(`hive_coin_s3_${wIdx}`, wx, wy + 1.2, wz, wIdx === 3);
    });

    // =========================================================================
    // 🟠 4. AŞAMA (ORTA ZORLUK): HAREKETLİ PETEKLER & BAL FISKİYELERİ (z: -345 -> -415, Y: 27 -> 30)
    // =========================================================================
    addCheckpoint("hive_cp_s4", "4. Aşama: Hareketli Altıgen Petekler [Orta]", 0, 27.5, -355);
    buildHivePlatform(14, 2, 12, 0, 26.5, -355, honeyGoldMat);

    // 4 Moving Hexagonal Platforms
    const mZ = [-370, -382, -394, -406];
    mZ.forEach((mz, mIdx) => {
      const my = 27.0 + mIdx * 0.8;
      const mMesh = buildHivePlatform(4.5, 0.8, 4.5, 0, my, mz, hiveCellMat);
      const coll = collidables[collidables.length - 1];
      hiveMovingPlatforms.push({
        mesh: mMesh,
        coll: coll,
        baseX: 0,
        baseY: my,
        baseZ: mz,
        rangeX: 5.5 + (mIdx % 2 === 0 ? 1.0 : -1.0),
        speed: 1.8 + mIdx * 0.2,
        offset: mIdx * 1.5
      });
      b(`hive_coin_s4_${mIdx}`, 0, my + 1.4, mz, mIdx === 2);
    });

    // Creature 3: Patlayıcı Polen Böceği (Bomb Beetle)
    createPollenBombBeetle(0, 28.5, -385, enemies, hiveExtensionGroup);

    // =========================================================================
    // 🟠 5. AŞAMA (ORTA ZORLUK): DÖNEN İĞNE DEĞİRMENLERİ (z: -415 -> -490, Y: 30 -> 33)
    // =========================================================================
    addCheckpoint("hive_cp_s5", "5. Aşama: Dönen İğneler & Bal Rampaları [Orta]", 0, 30.5, -425);
    buildHivePlatform(16, 2, 14, 0, 29.5, -425, honeyGoldMat);

    // Slippery Honey Slide Ramp (Physics: isIce = true)
    buildHivePlatform(8, 0.6, 28, 0, 30.5, -445, toxicHoneyMat, false, false, true);

    // 2 Rotating 4-Arm Needle Mill Spinners
    [-440, -465].forEach((sz, sIdx) => {
      const spinGroup = new THREE.Group();
      spinGroup.position.set(0, 32.5 + sIdx * 1.0, sz);
      const centerHub = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.2, 8), darkStoneMat);
      spinGroup.add(centerHub);

      for (let arm = 0; arm < 4; arm++) {
        const needleArm = new THREE.Mesh(
          new THREE.ConeGeometry(0.3, 5.0, 6),
          new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.8 })
        );
        const ang = (arm / 4) * Math.PI * 2;
        needleArm.position.set(Math.cos(ang) * 2.8, 0, Math.sin(ang) * 2.8);
        needleArm.rotation.z = -Math.PI / 2;
        needleArm.rotation.y = -ang;
        spinGroup.add(needleArm);
      }
      hiveExtensionGroup.add(spinGroup);
      hiveRotatingSpinners.push({ group: spinGroup, speed: (sIdx % 2 === 0 ? 2.2 : -2.2) });
      b(`hive_gem_s5_${sIdx}`, 0, 34.0 + sIdx * 1.0, sz, true);
    });

    // Creature 4: Zehirli İğne Nişancısı Yabanarısı (Sniper Wasp)
    createNeedleSniperWasp(-5.0, 36.0, -450, enemies, hiveExtensionGroup);

    // =========================================================================
    // 🟠 6. AŞAMA (ORTA ZORLUK): AKIŞKAN BAL LABİRENTİ (z: -490 -> -565, Y: 33 -> 36)
    // =========================================================================
    addCheckpoint("hive_cp_s6", "6. Aşama: Akışkan Bal Labirenti [Orta]", 0, 33.5, -495);
    buildHivePlatform(18, 2, 14, 0, 32.5, -495, honeyGoldMat);

    // Labyrinth Corridor with Wax Walls
    buildHivePlatform(12, 1.5, 55, 0, 33.0, -525, honeyAmberMat);
    buildHivePlatform(1.5, 6, 55, -6.0, 36.0, -525, hiveCellMat);
    buildHivePlatform(1.5, 6, 55, 6.0, 36.0, -525, hiveCellMat);

    // Creature 5: Kraliyet Fırtına Kraliçesi (Tempest Queen Bee - Wind Gales!)
    createTempestQueenBee(0, 38.0, -535, enemies, hiveExtensionGroup);

    // =========================================================================
    // 🔴 7. AŞAMA (ULTRA MEGA ZOR): ERİYİP ÇÖKEN BALMUMU SÜTUNLARI (z: -565 -> -645, Y: 36 -> 40)
    // =========================================================================
    addCheckpoint("hive_cp_s7", "7. Aşama: [ULTRA MEGA ZOR] Eriyip Çöken Balmumu Sütunları", 0, 36.5, -575);
    buildHivePlatform(14, 2, 12, 0, 35.5, -575, honeyGoldMat);

    // Super thin melting columns (width 1.3 units, melt after 0.65s!)
    const meltPillars = [
      { x: -3.5, z: -588, y: 36.2 },
      { x: 3.5, z: -598, y: 37.0 },
      { x: -2.0, z: -608, y: 37.8 },
      { x: 2.5, z: -618, y: 38.6 },
      { x: 0.0, z: -628, y: 39.4 }
    ];
    meltPillars.forEach((mp, mIdx) => {
      const pMesh = buildHivePlatform(1.6, 0.6, 1.6, mp.x, mp.y, mp.z, waxCandleMat);
      const coll = collidables[collidables.length - 1];
      hiveMeltingPillars.push({
        mesh: pMesh,
        coll: coll,
        baseY: mp.y,
        stepped: false,
        dropTimer: 0.65, // Ultra fast collapse!
        fallSpeed: 0,
        respawnTimer: 0
      });
      b(`hive_melt_coin_${mIdx}`, mp.x, mp.y + 1.2, mp.z, mIdx === 2);
    });

    // Creature 6: Kovan Rahibi & Nektar Şifacısı (Cleric - Shield + Web)
    createRoyalNectarCleric(0, 41.0, -615, enemies, hiveExtensionGroup);

    // =========================================================================
    // 🔴 8. AŞAMA (ULTRA MEGA ZOR): LAZERLİ NEKTAR IZGARASI & SARKAÇ KAOSU (z: -645 -> -730, Y: 40 -> 44)
    // =========================================================================
    addCheckpoint("hive_cp_s8", "8. Aşama: [ULTRA MEGA ZOR] Lazerli Izgara & Sarkaç Kaosu", 0, 40.5, -650);
    buildHivePlatform(16, 2, 14, 0, 39.5, -650, honeyGoldMat);

    // Sweeping Amber Laser Beams
    [-670, -690, -710].forEach((lz, idx) => {
      buildHivePlatform(12, 1.5, 10, 0, 40.0 + idx * 1.2, lz, hiveCellMat);

      // Rotating Laser
      const laserGeo = new THREE.CylinderGeometry(0.12, 0.12, 11.5, 8);
      const laserMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      const laserMesh = new THREE.Mesh(laserGeo, laserMat);
      laserMesh.rotation.z = Math.PI / 2;
      laserMesh.position.set(0, 41.5 + idx * 1.2, lz);
      hiveExtensionGroup.add(laserMesh);

      hiveLaserGrids.push({
        mesh: laserMesh,
        speed: (idx % 2 === 0 ? 2.4 : -2.4), // Fast rotation!
        y: 41.5 + idx * 1.2,
        z: lz
      });
      b(`hive_ultra_gem_${idx}`, 0, 43.5 + idx * 1.2, lz, true);
    });

    // =========================================================================
    // 🔴 9. AŞAMA (ULTRA MEGA ZOR BOSS): YÜCE KRALİYET TAHT ZİRVESİ & DEV MOR AYI 👑 (z: -730 -> -840, Y: 44)
    // =========================================================================
    addCheckpoint("hive_cp_s9", "9. Aşama: [ULTRA MEGA ZOR BOSS] Kraliyet Bal Zirvesi & Dev Mor Ayı 👑", 0, 44.5, -740);

    const throneArenaZ = -790;
    const throneArenaY = 43.5;
    buildHivePlatform(70, 3, 70, 0, throneArenaY, throneArenaZ, purpleRoyalMat);
    buildHivePlatform(66, 0.4, 66, 0, throneArenaY + 1.6, throneArenaZ, honeyGoldMat);

    // 8 Grand Royal Pillars surrounding the Throne
    for (let p = 0; p < 8; p++) {
      const angle = (p / 8) * Math.PI * 2;
      const px = Math.cos(angle) * 30;
      const pz = throneArenaZ + Math.sin(angle) * 30;
      buildHivePlatform(3.2, 18, 3.2, px, throneArenaY + 9.5, pz, purpleRoyalMat);
      const crownMesh = new THREE.Mesh(new THREE.ConeGeometry(2.0, 2.5, 6), honeyGemMat);
      crownMesh.position.set(px, throneArenaY + 19.5, pz);
      hiveExtensionGroup.add(crownMesh);
      const pLight = new THREE.PointLight(0xfacc15, 2.5, 20);
      pLight.position.set(px, throneArenaY + 20.0, pz);
      hiveExtensionGroup.add(pLight);
    }

    // THE RELOCATED BOSS: 👑 Dev Mor Ayı & Kraliyet Kovan Lordu (Stage 9 Boss)
    activePurpleBearBoss = createRelocatedPurpleBearBoss(0, throneArenaY + 1.6, throneArenaZ + 5, enemies, hiveExtensionGroup);

    // Victory Exit Portal behind the Boss leading to 4. Bölüm (Pelikan Ovaları)
    hiveVictoryPortal = createBeehiveVictoryPortal(0, throneArenaY + 1.6, throneArenaZ - 25, hiveExtensionGroup);

    console.log("✅ [Beehive Extension] 9 Yeni Aşama & 6 Özel Canlı Başarıyla Yerleştirildi!");
  };

  // =========================================================================
  // 6 YENİ CANLI / DÜŞMAN MODELİ VE MEKANİĞİ
  // =========================================================================

  // 1. 🐝 Ağır Zırhlı Bal Arısı Tankı (Front armor shield, drill charge)
  function createArmoredHornetTank(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const tankGroup = new THREE.Group();
    tankGroup.position.set(x, y, z);

    // Heavy Chitin Carapace
    const armorMat = new THREE.MeshStandardMaterial({ color: 0x78350f, metalness: 0.7, roughness: 0.3 });
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 });
    const body = new THREE.Mesh(new THREE.SphereGeometry(1.0, 10, 8), bodyMat);
    body.scale.set(1.2, 0.9, 1.4);
    body.position.y = 1.0;
    tankGroup.add(body);

    // Heavy Shield Plate on front
    const shield = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.4, 0.3), armorMat);
    shield.position.set(0, 1.0, 1.2);
    tankGroup.add(shield);

    // Drill Stinger
    const drill = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.5, 8), armorMat);
    drill.rotation.x = Math.PI / 2;
    drill.position.set(0, 0.9, 1.9);
    tankGroup.add(drill);

    group.add(tankGroup);

    const enemyData = {
      id: "armored_hornet_" + Math.round(z),
      type: "armored_hornet",
      name: "Ağır Zırhlı Bal Arısı Tankı",
      mesh: tankGroup,
      pos: new THREE.Vector3(x, y, z),
      velocity: new THREE.Vector3(),
      hp: 120,
      maxHp: 120,
      attackPower: 16,
      isBoss: false,
      attackCooldown: 2.0,
      animTimer: 0,
      update: function(dt, playerPos, game) {
        this.animTimer += dt;
        drill.rotation.z += dt * 15;
        const dist = this.pos.distanceTo(playerPos);
        if (dist < 18.0) {
          this.mesh.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
          // Charge forward
          if (dist > 2.5) {
            const dir = playerPos.clone().sub(this.pos).normalize();
            this.pos.x += dir.x * dt * 4.5;
            this.pos.z += dir.z * dt * 4.5;
          } else if (this.attackCooldown <= 0) {
            this.attackCooldown = 2.5;
            game.damagePlayer(this.attackPower);
            // Knockback Grizzy
            game.playerVel.x += (playerPos.x - this.pos.x) * 10;
            game.playerVel.z += (playerPos.z - this.pos.z) * 10;
            game.playerVel.y = 6.0;
            if (window.St && window.St.playHammerSlam) window.St.playHammerSlam();
          }
        }
      }
    };
    enemies.push(enemyData);
    hiveCustomCreatures.push(enemyData);
    return enemyData;
  }

  // 2. 🍯 Yapışkan Bal Balçığı (Sticky Honey Slime)
  function createStickyHoneySlime(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const slimeGroup = new THREE.Group();
    slimeGroup.position.set(x, y, z);

    const slimeMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      emissive: 0xb45309,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.9,
      roughness: 0.1
    });

    const blob = new THREE.Mesh(new THREE.SphereGeometry(0.85, 10, 8), slimeMat);
    blob.scale.set(1.2, 0.8, 1.2);
    blob.position.y = 0.65;
    slimeGroup.add(blob);

    // Googly eyes
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const pupMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    [-0.35, 0.35].forEach(ex => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), eyeMat);
      eye.position.set(ex, 0.95, 0.6);
      const pup = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), pupMat);
      pup.position.set(0, 0, 0.14);
      eye.add(pup);
      slimeGroup.add(eye);
    });

    group.add(slimeGroup);

    const enemyData = {
      id: "honey_slime_" + Math.round(z),
      type: "honey_slime",
      name: "Yapışkan Bal Balçığı",
      mesh: slimeGroup,
      pos: new THREE.Vector3(x, y, z),
      baseY: y,
      velocity: new THREE.Vector3(),
      hp: 55,
      maxHp: 55,
      attackPower: 11,
      isBoss: false,
      attackCooldown: 1.5,
      jumpPhase: 0,
      animTimer: 0,
      update: function(dt, playerPos, game) {
        this.animTimer += dt;
        const dist = this.pos.distanceTo(playerPos);
        if (dist < 15.0) {
          this.mesh.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
          this.jumpPhase += dt * 4.0;
          this.pos.y = this.baseY + Math.max(0, Math.sin(this.jumpPhase)) * 1.6;

          // Squish animation
          blob.scale.y = 0.8 + Math.cos(this.jumpPhase) * 0.25;

          if (dist < 2.5 && this.attackCooldown <= 0) {
            this.attackCooldown = 3.0;
            game.damagePlayer(this.attackPower);
            window.__applyStickyHoneySlow(3.0, 0.35); // Slow Grizzy by 65%!
          }
        }
      }
    };
    enemies.push(enemyData);
    hiveCustomCreatures.push(enemyData);
    return enemyData;
  }

  // 3. 💥 Patlayıcı Polen Böceği (Explosive Pollen Bomb Beetle)
  function createPollenBombBeetle(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const bombGroup = new THREE.Group();
    bombGroup.position.set(x, y, z);

    const shellMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 });
    const shell = new THREE.Mesh(new THREE.SphereGeometry(0.75, 10, 8), shellMat);
    shell.position.y = 0.6;
    bombGroup.add(shell);

    // Glowing fuse antenna
    const fuseMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const fuse = new THREE.Mesh(new THREE.SphereGeometry(0.18, 6, 6), fuseMat);
    fuse.position.set(0, 1.35, 0.2);
    bombGroup.add(fuse);

    group.add(bombGroup);

    const enemyData = {
      id: "pollen_bomb_" + Math.round(z),
      type: "pollen_bomb_beetle",
      name: "Patlayıcı Polen Böceği",
      mesh: bombGroup,
      pos: new THREE.Vector3(x, y, z),
      velocity: new THREE.Vector3(),
      hp: 35,
      maxHp: 35,
      attackPower: 20,
      isBoss: false,
      exploding: false,
      fuseTimer: 1.2,
      animTimer: 0,
      update: function(dt, playerPos, game) {
        this.animTimer += dt;
        const dist = this.pos.distanceTo(playerPos);

        if (!this.exploding) {
          if (dist < 14.0) {
            this.mesh.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
            const dir = playerPos.clone().sub(this.pos).normalize();
            this.pos.x += dir.x * dt * 6.5; // Rapid scuttle
            this.pos.z += dir.z * dt * 6.5;

            if (dist < 3.2) {
              this.exploding = true;
              if (game.callbacks && game.callbacks.onShowNotice) {
                game.callbacks.onShowNotice("💣 DİKKAT! Polen Böceği Patlıyor!", "warning");
              }
            }
          }
        } else {
          // Fuse countdown & flashing
          this.fuseTimer -= dt;
          fuseMat.color.setHex((Math.floor(this.animTimer * 15) % 2 === 0) ? 0xffffff : 0xef4444);
          shell.scale.setScalar(1.0 + (1.2 - this.fuseTimer) * 0.4);

          if (this.fuseTimer <= 0) {
            // DETONATE!
            game.spawnSparkleParticles(this.pos, 35, 0xfde047);
            if (window.St && window.St.playHammerSlam) window.St.playHammerSlam();
            if (dist < 5.5) {
              game.damagePlayer(this.attackPower);
              game.playerVel.y = 8.0;
            }
            // Kill beetle
            this.hp = 0;
            this.mesh.visible = false;
          }
        }
      }
    };
    enemies.push(enemyData);
    hiveCustomCreatures.push(enemyData);
    return enemyData;
  }

  // 4. 🏹 Zehirli İğne Nişancısı Yabanarısı (Toxic Needle Sniper Wasp)
  function createNeedleSniperWasp(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const sniperGroup = new THREE.Group();
    sniperGroup.position.set(x, y, z);

    const waspMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.3 });
    const abd = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.6, 6), waspMat);
    abd.rotation.x = Math.PI / 2;
    sniperGroup.add(abd);

    // Glowing Crosshair Aim beam
    const aimBeam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 8, 4),
      new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.6 })
    );
    aimBeam.rotation.x = Math.PI / 2;
    aimBeam.position.z = 4.0;
    sniperGroup.add(aimBeam);

    group.add(sniperGroup);

    const enemyData = {
      id: "sniper_wasp_" + Math.round(z),
      type: "needle_sniper",
      name: "Zehirli İğne Nişancısı",
      mesh: sniperGroup,
      pos: new THREE.Vector3(x, y, z),
      baseY: y,
      velocity: new THREE.Vector3(),
      hp: 50,
      maxHp: 50,
      attackPower: 12,
      isBoss: false,
      attackCooldown: 1.5,
      animTimer: 0,
      update: function(dt, playerPos, game) {
        this.animTimer += dt;
        this.pos.y = this.baseY + Math.sin(this.animTimer * 2.5) * 0.5;

        const dist = this.pos.distanceTo(playerPos);
        if (dist < 26.0) {
          this.mesh.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
          if (this.attackCooldown <= 0) {
            this.attackCooldown = 3.2;
            spawnNeedleDart(this.pos, playerPos, game);
          }
        }
      }
    };
    enemies.push(enemyData);
    hiveCustomCreatures.push(enemyData);
    return enemyData;
  }

  // 5. 🌪️ Kraliyet Fırtına Kraliçesi (Tempest Honey Queen Bee - Wind Gales!)
  function createTempestQueenBee(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const queenGroup = new THREE.Group();
    queenGroup.position.set(x, y, z);

    const queenMat = new THREE.MeshStandardMaterial({ color: 0x7e22ce, emissive: 0x581c87, emissiveIntensity: 0.8 });
    const body = new THREE.Mesh(new THREE.SphereGeometry(1.2, 10, 8), queenMat);
    body.scale.set(1.1, 1.0, 1.6);
    queenGroup.add(body);

    // Crown
    const crown = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.8, 6), new THREE.MeshStandardMaterial({ color: 0xfacc15 }));
    crown.position.set(0, 1.4, 0.4);
    queenGroup.add(crown);

    group.add(queenGroup);

    const enemyData = {
      id: "tempest_queen_" + Math.round(z),
      type: "tempest_queen_bee",
      name: "Kraliyet Fırtına Kraliçesi",
      mesh: queenGroup,
      pos: new THREE.Vector3(x, y, z),
      baseY: y,
      velocity: new THREE.Vector3(),
      hp: 130,
      maxHp: 130,
      attackPower: 14,
      isBoss: false,
      attackCooldown: 2.0,
      animTimer: 0,
      update: function(dt, playerPos, game) {
        this.animTimer += dt;
        this.pos.y = this.baseY + Math.sin(this.animTimer * 2.0) * 0.7;

        const dist = this.pos.distanceTo(playerPos);
        if (dist < 22.0) {
          this.mesh.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
          // Tempest Wind Gust: Pushes Grizzy sideways!
          const windForce = Math.sin(this.animTimer * 3.5) * 4.5 * dt;
          game.playerVel.x += windForce;
          game.spawnSparkleParticles(game.playerPos, 2, 0xa855f7);
        }
      }
    };
    enemies.push(enemyData);
    hiveCustomCreatures.push(enemyData);
    return enemyData;
  }

  // 6. 🛡️ Kovan Rahibi & Nektar Şifacısı (Royal Nectar Cleric - Shields & Web)
  function createRoyalNectarCleric(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const clericGroup = new THREE.Group();
    clericGroup.position.set(x, y, z);

    const robeMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.7 });
    const robe = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.85, 2.5, 8), robeMat);
    robe.position.y = 1.25;
    clericGroup.add(robe);

    const staffOrb = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xeab308, emissiveIntensity: 1.5 })
    );
    staffOrb.position.set(0.7, 2.8, 0.3);
    clericGroup.add(staffOrb);

    group.add(clericGroup);

    const enemyData = {
      id: "nectar_cleric_" + Math.round(z),
      type: "nectar_cleric",
      name: "Kovan Rahibi & Nektar Şifacısı",
      mesh: clericGroup,
      pos: new THREE.Vector3(x, y, z),
      baseY: y,
      velocity: new THREE.Vector3(),
      hp: 110,
      maxHp: 110,
      attackPower: 12,
      isBoss: false,
      attackCooldown: 2.5,
      animTimer: 0,
      update: function(dt, playerPos, game) {
        this.animTimer += dt;
        staffOrb.rotation.y += dt * 4;
        this.pos.y = this.baseY + Math.sin(this.animTimer * 2.5) * 0.4;

        const dist = this.pos.distanceTo(playerPos);
        if (dist < 20.0) {
          this.mesh.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
          if (this.attackCooldown <= 0) {
            this.attackCooldown = 4.0;
            // Shoot sticky web ring that slows/stops Grizzy
            spawnHoneyWebRing(this.pos, playerPos, game);
          }
        }
      }
    };
    enemies.push(enemyData);
    hiveCustomCreatures.push(enemyData);
    return enemyData;
  }

  // =========================================================================
  // 👑 BÜYÜK BOSS: DEV MOR AYI & KRALİYET KOVAN LORDU (Stage 9 Final Boss)
  // =========================================================================
  function createRelocatedPurpleBearBoss(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const bossGroup = new THREE.Group();
    bossGroup.name = "boss_purple_bear_relocated";
    bossGroup.position.set(x, y, z);
    bossGroup.scale.set(3.0, 3.0, 3.0); // Grand Colossus scale

    const bossFurMat = new THREE.MeshStandardMaterial({ color: 0x6b21a8, roughness: 0.55, emissive: 0x3b0764, emissiveIntensity: 0.45 });
    const bossBellyMat = new THREE.MeshStandardMaterial({ color: 0x9333ea, roughness: 0.6 });
    const bossHornMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.8, roughness: 0.3 });

    // Body
    const bBody = new THREE.Mesh(new THREE.SphereGeometry(0.58, 16, 16), bossFurMat);
    bBody.scale.set(1, 1.2, 0.95);
    bBody.position.y = 1.0;
    bossGroup.add(bBody);

    const bBelly = new THREE.Mesh(new THREE.SphereGeometry(0.44, 14, 14), bossBellyMat);
    bBelly.position.set(0, 0.95, 0.38);
    bossGroup.add(bBelly);

    // Head
    const bHead = new THREE.Mesh(new THREE.SphereGeometry(0.48, 16, 16), bossFurMat);
    bHead.position.set(0, 1.75, 0.1);
    bossGroup.add(bHead);

    // Royal Horns
    [-0.25, 0.25].forEach(hx => {
      const horn = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.8, 8), bossHornMat);
      horn.position.set(hx, 2.2, 0.1);
      horn.rotation.z = (hx < 0 ? 0.35 : -0.35);
      bossGroup.add(horn);
    });

    group.add(bossGroup);

    const bossData = {
      id: "boss_purple_bear",
      type: "corrupted_bear_boss",
      name: "Dev Mor Ayı Boss (Kraliyet Kovan Lordu 👑)",
      mesh: bossGroup,
      pos: new THREE.Vector3(x, y, z),
      velocity: new THREE.Vector3(),
      hp: 550,
      maxHp: 550,
      attackPower: 22,
      isBoss: true,
      attackCooldown: 2.0,
      animTimer: 0,
      state: "chase",
      update: function(dt, playerPos, game) {
        this.animTimer += dt;
        const dist = this.pos.distanceTo(playerPos);
        if (dist < 45.0) {
          this.mesh.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
          if (this.attackCooldown <= 0) {
            this.attackCooldown = 3.2;
            const roll = Math.random();
            if (roll < 0.4) {
              // Royal Honey Slam Shockwave
              spawnRockShockwave(this.pos, game, 9.5);
              if (window.St && window.St.playHammerSlam) window.St.playHammerSlam();
            } else if (roll < 0.7) {
              // Sticky Nectar Whirlpool
              window.__applyStickyHoneySlow(3.0, 0.3);
            } else {
              // Honey Spike Barrage
              spawnNeedleDart(this.pos.clone().add(new THREE.Vector3(0, 3, 0)), playerPos, game);
            }
          }
        }
      }
    };
    enemies.push(bossData);
    return bossData;
  }

  // =========================================================================
  // VICTORY EXIT PORTAL TO 4. BÖLÜM (PELİKAN OVALARI)
  // =========================================================================
  function createBeehiveVictoryPortal(x, y, z, group) {
    const THREE = window.THREE;
    const portalGroup = new THREE.Group();
    portalGroup.name = "beehive_stage9_victory_portal";
    portalGroup.position.set(x, y, z);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.5, 0.45, 16, 32),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 1.8 })
    );
    ring.position.y = 3.5;
    portalGroup.add(ring);

    const vortex = new THREE.Mesh(
      new THREE.CircleGeometry(3.2, 32),
      new THREE.MeshBasicMaterial({ color: 0x0284c7, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
    );
    vortex.position.y = 3.5;
    portalGroup.add(vortex);

    group.add(portalGroup);

    return {
      mesh: portalGroup,
      pos: new THREE.Vector3(x, y, z),
      targetRegion: "pelican_plains"
    };
  }

  // =========================================================================
  // PROJECTILES & HAZARDS
  // =========================================================================
  function spawnNeedleDart(fromPos, toPos, game) {
    if (!window.THREE || !game || !game.scene) return;
    const THREE = window.THREE;
    const needle = new THREE.Mesh(
      new THREE.ConeGeometry(0.2, 1.2, 6),
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    needle.position.copy(fromPos);
    game.scene.add(needle);

    const dir = toPos.clone().sub(fromPos).normalize();
    activeHiveProjectiles.push({
      mesh: needle,
      pos: fromPos.clone(),
      dir: dir,
      speed: 16.0,
      life: 2.2,
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

  function spawnHoneyWebRing(fromPos, toPos, game) {
    if (!window.THREE || !game || !game.scene) return;
    const THREE = window.THREE;
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.8, 0.12, 8, 16),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 1.2 })
    );
    ring.position.copy(fromPos);
    ring.rotation.x = Math.PI / 2;
    game.scene.add(ring);

    const dir = toPos.clone().sub(fromPos).normalize();
    activeHiveProjectiles.push({
      mesh: ring,
      pos: fromPos.clone(),
      dir: dir,
      speed: 12.0,
      life: 2.5,
      update: function(dt) {
        this.life -= dt;
        this.pos.add(this.dir.clone().multiplyScalar(this.speed * dt));
        this.mesh.position.copy(this.pos);
        if (game.playerPos && this.pos.distanceTo(game.playerPos) < 2.0) {
          window.__applyStickyHoneySlow(3.5, 0.25);
          this.life = -1;
        }
      }
    });
  }

  function spawnRockShockwave(pos, game, maxR = 8.5) {
    if (!window.THREE || !game || !game.scene) return;
    const THREE = window.THREE;
    const waveMesh = new THREE.Mesh(
      new THREE.RingGeometry(0.8, 1.5, 24),
      new THREE.MeshBasicMaterial({ color: 0xa855f7, side: THREE.DoubleSide })
    );
    waveMesh.rotation.x = -Math.PI / 2;
    waveMesh.position.set(pos.x, pos.y + 0.15, pos.z);
    game.scene.add(waveMesh);

    let radius = 1.0;
    activeHiveProjectiles.push({
      mesh: waveMesh,
      pos: pos.clone(),
      life: 1.2,
      update: function(dt) {
        this.life -= dt;
        radius += dt * 7.5;
        this.mesh.scale.set(radius, radius, 1);
        if (game.playerPos && game.isGrounded) {
          const d = Math.hypot(game.playerPos.x - this.pos.x, game.playerPos.z - this.pos.z);
          if (Math.abs(d - radius) < 1.4) {
            game.damagePlayer(15);
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
  function updateBeehiveExtension(dt) {
    const game = window.__superBearGame;
    if (!game || game.currentRegion !== 'beehive') return;
    totalTime += dt;

    // 1. Moving Platforms (Stage 4)
    hiveMovingPlatforms.forEach(mp => {
      const offX = Math.sin(totalTime * mp.speed + mp.offset) * mp.rangeX;
      mp.mesh.position.x = mp.baseX + offX;
      if (mp.coll) {
        mp.coll.min.x = mp.baseX + offX - 2.25;
        mp.coll.max.x = mp.baseX + offX + 2.25;
      }
    });

    // 2. Melting Pillars (Stage 7 - Ultra Mega Zor)
    if (game.playerPos) {
      hiveMeltingPillars.forEach(cp => {
        if (!cp.stepped) {
          const d = Math.hypot(game.playerPos.x - cp.mesh.position.x, game.playerPos.z - cp.mesh.position.z);
          if (d < 1.6 && Math.abs(game.playerPos.y - cp.baseY) < 1.2) {
            cp.stepped = true;
          }
        } else if (cp.dropTimer > 0) {
          cp.dropTimer -= dt;
          cp.mesh.position.x += (Math.random() - 0.5) * 0.18; // Rapid shaking!
          if (cp.dropTimer <= 0) {
            if (cp.coll) cp.coll.min.y = -999;
          }
        } else {
          cp.fallSpeed += dt * 30.0;
          cp.mesh.position.y -= cp.fallSpeed * dt;
          cp.respawnTimer += dt;
          if (cp.respawnTimer > 4.5) {
            cp.stepped = false;
            cp.dropTimer = 0.65;
            cp.fallSpeed = 0;
            cp.respawnTimer = 0;
            cp.mesh.position.y = cp.baseY;
            if (cp.coll) cp.coll.min.y = cp.baseY - 0.3;
          }
        }
      });
    }

    // 3. Rotating Spinners (Stage 5)
    hiveRotatingSpinners.forEach(rs => {
      rs.group.rotation.y += dt * rs.speed;
      if (game.playerPos && rs.group.position.distanceTo(game.playerPos) < 2.5) {
        game.damagePlayer(14);
      }
    });

    // 4. Laser Grids (Stage 8)
    hiveLaserGrids.forEach(lg => {
      lg.mesh.rotation.y += dt * lg.speed;
      if (game.playerPos) {
        const d = Math.hypot(game.playerPos.x - lg.mesh.position.x, game.playerPos.z - lg.z);
        if (d < 5.8 && Math.abs(game.playerPos.y - lg.y) < 1.5) {
          const pAngle = Math.atan2(game.playerPos.z - lg.z, game.playerPos.x - lg.mesh.position.x);
          let diff = Math.abs(pAngle - lg.mesh.rotation.y) % (Math.PI * 2);
          if (diff < 0.25 || Math.abs(diff - Math.PI) < 0.25) {
            game.damagePlayer(18);
          }
        }
      }
    });

    // 5. Active Projectiles
    for (let i = activeHiveProjectiles.length - 1; i >= 0; i--) {
      const p = activeHiveProjectiles[i];
      p.update(dt);
      if (p.life <= 0) {
        if (p.mesh && p.mesh.parent) p.mesh.parent.remove(p.mesh);
        activeHiveProjectiles.splice(i, 1);
      }
    }

    // 6. Stage 9 Victory Portal Interaction
    if (hiveVictoryPortal && game.playerPos) {
      hiveVictoryPortal.mesh.rotation.y += dt * 0.8;
      const d = hiveVictoryPortal.pos.distanceTo(game.playerPos);
      if (d < 3.8) {
        const isBossAlive = (game.currentLevel && game.currentLevel.enemies || []).some(
          e => e && e.id === "boss_purple_bear" && e.hp > 0
        );
        if (isBossAlive) {
          const now = Date.now();
          if (!hiveVictoryPortal._lastNotice || now - hiveVictoryPortal._lastNotice > 2500) {
            hiveVictoryPortal._lastNotice = now;
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("⚠️ Pelikan Ovaları portalından geçmek için önce Mor Ayı Boss'unu yenmelisin! ⚔️", "warning");
            }
          }
        } else {
          if (!hiveVictoryPortal._triggered) {
            hiveVictoryPortal._triggered = true;
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("🌀 4. Bölüm: Pelikan Ovaları'na Geçiliyor! 🪶", "success");
            }
            setTimeout(() => {
              game.loadRegion("pelican_plains");
            }, 800);
          }
        }
      }
    }
  }

  // =========================================================================
  // CLEANUP & MEMORY DISPOSAL
  // =========================================================================
  function cleanUpBeehiveExtension(game) {
    if (!game) game = window.__superBearGame;
    activeHiveProjectiles.forEach(p => {
      if (p.mesh && p.mesh.parent) p.mesh.parent.remove(p.mesh);
    });
    activeHiveProjectiles = [];

    if (hiveExtensionGroup) {
      hiveExtensionGroup.traverse(obj => {
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
      if (hiveExtensionGroup.parent) hiveExtensionGroup.parent.remove(hiveExtensionGroup);
      hiveExtensionGroup = null;
    }
    hiveMovingPlatforms = [];
    hiveMeltingPillars = [];
    hiveRotatingSpinners = [];
    hiveLaserGrids = [];
    hiveCustomCreatures = [];
    activePurpleBearBoss = null;
    hiveVictoryPortal = null;
    console.log("🧹 [Beehive Extension] Bellek başarıyla temizlendi (Disposed).");
  }

  function initBeehiveTicker() {
    const game = window.__superBearGame;
    if (game && !game._beehiveTickerHooked) {
      game._beehiveTickerHooked = true;
      const origUpdate = game.update;
      game.update = function(dt, totalTime) {
        origUpdate.call(this, dt, totalTime);
        try {
          updateBeehiveExtension(dt);
        } catch(err) {}
      };
    }
  }

  window.addEventListener('superbear:region-changed', (e) => {
    const newReg = e.detail;
    if (newReg !== 'beehive') {
      cleanUpBeehiveExtension();
    }
  });

  const tickerInterval = setInterval(() => {
    if (window.__superBearGame) {
      initBeehiveTicker();
      clearInterval(tickerInterval);
    }
  }, 100);

  window.__cleanUpBeehiveExtension = cleanUpBeehiveExtension;
  window.__updateBeehiveExtension = updateBeehiveExtension;
  console.log("🐝 [Beehive Extension] Script Loaded & Ready!");
})();
