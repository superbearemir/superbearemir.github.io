// ============================================================================
// 🪶 4. BÖLÜM: PELİKAN OVALARI GENİŞLETMESİ (8 YENİ AŞAMA & 7 ÖZEL CANLI)
// - Boss ilk yuvasından kaldırıldı, 8. Aşamadaki Yüce Gök Zirvesi Arenası'na taşındı!
// - Pelikan Boss'un orijinal şekli, gövdesi, gagası, kanatları ve tacı birebir aynı korundu!
// - 8 Yeni Aşama:
//     * 1-2. Aşamalar (Kolay): Gök Adaları, Rüzgar Asma Yolu & Zıplama Pedleri
//     * 3-4. Aşamalar (Orta Zorluk): Hareketli Bulutlar, Tüy Değirmenleri & Rüzgar Kanyonu
//     * 5-6. Aşamalar (Zorlu): Çöken Gökyüzü Çıkıntıları, Dar Kirişler & Dalış Vadisi
//     * 7-8. Aşamalar (ÇOK AMA ÇOK ZORLU): Fırtına Şimşekleri, Kaybolan Bulutlar & Pelikan Lordu Zirvesi!
// - 7 Özel Yeni Canlı ve Mekanikleri:
//     1. 🦅 Gökdoğan Avcı Kartalı (Yüksekten pike yapıp pençeleriyle havadan dalış)
//     2. 🪶 Pelikan Tüyü Kasırga Şamanı (Platformlar arasında gezen mini hortumlar üretir)
//     3. 🦩 Zehirli Bataklık Flamingosu (Tek ayak üstünde durur, pembe zehir balçığı püskürtür)
//     4. 🦉 Antik Gök Baykuşu Muhafızı (Süpersonik baykuş çığlığıyla 2.5s kontrolleri şaşırtır)
//     5. 🦆 Zırhlı Çekiç Gagalı Ördek (Ağır pirinç gaga ile yere vurup şok dalgası yaratır)
//     6. 🕊️ Girdap Yutan Akbaba (Gökten tüy hançerleri yağdırarak daire çizer)
//     7. ☁️ Bulut Ruhu Elektrik Kuşu (Dönen elektrik şimşek arkları saçar)
// ============================================================================
(function() {
  'use strict';

  let pelicanExtensionGroup = null;
  let activePelicanProjectiles = [];
  let pelicanMovingClouds = [];
  let pelicanCrumblingLedges = [];
  let pelicanTornadoes = [];
  let pelicanLightningBeams = [];
  let activePelicanBoss = null;
  let pelicanVictoryPortal = null;
  let pelicanCustomCreatures = [];

  // Helper for feather updraft jump pad
  window.__triggerFeatherUpdraft = function(forceY = 16.0) {
    const game = window.__superBearGame;
    if (!game || !game.playerVel) return;
    game.playerVel.y = forceY;
    game.isGrounded = false;
    if (window.St && window.St.playJump) window.St.playJump();
    game.spawnSparkleParticles(game.playerPos, 20, 0x38bdf8);
    if (game.callbacks && game.callbacks.onShowNotice) {
      game.callbacks.onShowNotice("🪶 Pelikan Tüyü Rüzgar Akımı! Süper Süzülme! 💨", "info");
    }
  };

  // Main Builder function invoked by game-bundle.js during Ww('pelican_plains')
  window.__populatePelicanPlainsExtension = function(
    sceneGroup, collidables, platforms, enemies, items, easels, npcs,
    checkpoints, addCheckpoint, R, b, S, T, z, v, U, N, B
  ) {
    if (!window.THREE) return;
    const THREE = window.THREE;
    console.log("🪶 [Pelican Plains Extension] 8 Yeni Aşama ve 7 Özel Canlı Oluşturuluyor...");

    // Remove invisible wall: extend level bounds so player can explore all 8 stages freely
    const gameInstance = window.__superBearGame;
    if (gameInstance && gameInstance.currentLevel && gameInstance.currentLevel.bounds) {
      gameInstance.currentLevel.bounds.minZ = -1200;
      gameInstance.currentLevel.bounds.maxZ = 120;
      gameInstance.currentLevel.bounds.minX = -300;
      gameInstance.currentLevel.bounds.maxX = 300;
      gameInstance.currentLevel.bounds.minY = -50;
      gameInstance.currentLevel.bounds.maxY = 300;
    }

    // Create container group
    pelicanExtensionGroup = new THREE.Group();
    pelicanExtensionGroup.name = "pelican_plains_8_stages_extension";
    sceneGroup.add(pelicanExtensionGroup);

    // Reset local arrays
    activePelicanProjectiles = [];
    pelicanMovingClouds = [];
    pelicanCrumblingLedges = [];
    pelicanTornadoes = [];
    pelicanLightningBeams = [];
    pelicanCustomCreatures = [];
    activePelicanBoss = null;
    pelicanVictoryPortal = null;

    // Atmospheric Materials matching Pelican Plains
    const cloudWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.95
    });
    const skyCyanMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      roughness: 0.3
    });
    const stormGoldMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xd97706,
      emissiveIntensity: 1.0,
      metalness: 0.6
    });

    function buildSkyPlatform(w, h, d, px, py, pz, mat, isHazard = false, isClimbable = false, isIce = false) {
      return R(w, h, d, px, py, pz, mat, isHazard, isClimbable, isIce);
    }

    // =========================================================================
    // 🪶 1. AŞAMA (KOLAY): GÖK ADALARI & RÜZGAR AKIMI YOLU (z: -200 -> -260, Y: 35 -> 39)
    // =========================================================================
    addCheckpoint("pelican_cp_s1", "1. Aşama: Gök Adaları & Rüzgar Yolu [Kolay]", 0, 35.5, -210);

    buildSkyPlatform(20, 2, 20, 0, 34.0, -210, N);
    buildSkyPlatform(18, 0.4, 18, 0, 35.1, -210, z);
    b("pelican_coin_s1_0", -4, 36.0, -210, false);
    b("pelican_coin_s1_1", 4, 36.0, -210, false);

    // Floating Stepping Islands
    for (let i = 0; i < 5; i++) {
      const iz = -222 - (i * 7.0);
      const iy = 35.0 + (i * 0.8);
      const ix = (i % 2 === 0 ? -3.0 : 3.0);
      buildSkyPlatform(6.0, 1.2, 5.5, ix, iy, iz, U);
      // Updraft Jump Pad on 3rd island
      if (i === 2) {
        createFeatherJumpPad(ix, iy + 0.6, iz, pelicanExtensionGroup);
        b("pelican_gem_s1", ix, iy + 4.5, iz, true);
      }
    }

    // Creature 1: Gökdoğan Avcı Kartalı (Dive Harrier)
    createSkyHunterFalcon(0, 42.0, -250, enemies, pelicanExtensionGroup);

    // =========================================================================
    // 🪶 2. AŞAMA (KOLAY): ZIPLAMA PEDLERİ & YÜZEN BULUTLAR (z: -260 -> -320, Y: 39 -> 44)
    // =========================================================================
    addCheckpoint("pelican_cp_s2", "2. Aşama: Pelikan Tüyü Zıplama Pedleri [Kolay]", 0, 40.0, -270);
    buildSkyPlatform(16, 2, 14, 0, 39.0, -270, N);

    // Puffy Cloud Steps
    [-282, -294, -306].forEach((cz, cIdx) => {
      const cx = (cIdx % 2 === 0 ? 3.5 : -3.5);
      const cy = 40.5 + cIdx * 1.0;
      buildSkyPlatform(5.5, 1.2, 5.5, cx, cy, cz, cloudWhiteMat);
      b(`pelican_coin_s2_${cIdx}`, cx, cy + 1.2, cz, cIdx === 1);
    });
    // Feather Updraft pad linking into Stage 3
    createFeatherJumpPad(0, 43.0, -315, pelicanExtensionGroup);

    // Creature 2: Zehirli Bataklık Flamingosu (Marsh Flamingo)
    createToxicMarshFlamingo(-3.5, 41.5, -285, enemies, pelicanExtensionGroup);
    createToxicMarshFlamingo(3.5, 43.0, -305, enemies, pelicanExtensionGroup);

    // =========================================================================
    // 🪶 3. AŞAMA (ORTA ZORLUK): HAREKETLİ BULUTLAR & TÜY DEĞİRMENLERİ (z: -320 -> -390, Y: 44 -> 48)
    // =========================================================================
    addCheckpoint("pelican_cp_s3", "3. Aşama: Hareketli Bulut Platformları [Orta]", 0, 44.5, -330);
    buildSkyPlatform(16, 2, 14, 0, 43.5, -330, N);

    // 4 Moving Cloud Platforms
    const mZ = [-345, -357, -369, -381];
    mZ.forEach((mz, mIdx) => {
      const my = 44.0 + mIdx * 0.9;
      const mMesh = buildSkyPlatform(5.0, 1.0, 5.0, 0, my, mz, cloudWhiteMat);
      const coll = collidables[collidables.length - 1];
      pelicanMovingClouds.push({
        mesh: mMesh,
        coll: coll,
        baseX: 0,
        baseY: my,
        baseZ: mz,
        rangeX: 6.0 + (mIdx % 2 === 0 ? 1.5 : -1.5),
        speed: 1.8 + mIdx * 0.2,
        offset: mIdx * 1.4
      });
      b(`pelican_coin_s3_${mIdx}`, 0, my + 1.4, mz, mIdx === 2);
    });

    // Creature 3: Zırhlı Çekiç Gagalı Ördek (Hammer-Beak Duck)
    createHammerBeakDuck(0, 45.0, -365, enemies, pelicanExtensionGroup);

    // =========================================================================
    // 🪶 4. AŞAMA (ORTA ZORLUK): RÜZGAR KANYONU & HORTUMLAR (z: -390 -> -465, Y: 48 -> 53)
    // =========================================================================
    addCheckpoint("pelican_cp_s4", "4. Aşama: Rüzgar Kanyonu & Hortumlar [Orta]", 0, 48.5, -400);
    buildSkyPlatform(16, 2, 14, 0, 47.5, -400, N);

    // Stone canyon bridge with crosswinds
    buildSkyPlatform(8, 1.5, 50, 0, 49.0, -430, U);
    buildSkyPlatform(1.5, 5, 50, -4.5, 51.5, -430, v);
    buildSkyPlatform(1.5, 5, 50, 4.5, 51.5, -430, v);

    // Creature 4: Pelikan Tüyü Kasırga Şamanı (Summons tornadoes!)
    createFeatherTempestShaman(0, 50.0, -435, enemies, pelicanExtensionGroup);

    // =========================================================================
    // 🪶 5. AŞAMA (ZORLU): ÇÖKEN GÖKYÜZÜ ÇIKINTILARI (z: -465 -> -545, Y: 53 -> 58)
    // =========================================================================
    addCheckpoint("pelican_cp_s5", "5. Aşama: [ZORLU] Çöken Gökyüzü Çıkıntıları", 0, 53.5, -475);
    buildSkyPlatform(14, 2, 12, 0, 52.5, -475, N);

    // Crumbling Sky Rocks (collapse after 0.75s)
    const crumbLedges = [
      { x: -3.5, z: -488, y: 53.5 },
      { x: 3.5, z: -498, y: 54.3 },
      { x: -2.5, z: -508, y: 55.1 },
      { x: 3.0, z: -518, y: 55.9 },
      { x: 0.0, z: -528, y: 56.7 }
    ];
    crumbLedges.forEach((cl, cIdx) => {
      const lMesh = buildSkyPlatform(2.0, 0.6, 2.0, cl.x, cl.y, cl.z, z);
      const coll = collidables[collidables.length - 1];
      pelicanCrumblingLedges.push({
        mesh: lMesh,
        coll: coll,
        baseY: cl.y,
        stepped: false,
        dropTimer: 0.75,
        fallSpeed: 0,
        respawnTimer: 0
      });
      b(`pelican_crumb_coin_${cIdx}`, cl.x, cl.y + 1.2, cl.z, cIdx === 2);
    });

    // Creature 5: Girdap Yutan Akbaba (Vortex Vulture)
    createVortexVulture(-4.5, 58.0, -510, enemies, pelicanExtensionGroup);

    // =========================================================================
    // 🪶 6. AŞAMA (ZORLU): GÖKDOĞAN DALIŞ VADİSİ & DAR KİRİŞLER (z: -545 -> -630, Y: 58 -> 63)
    // =========================================================================
    addCheckpoint("pelican_cp_s6", "6. Aşama: [ZORLU] Dalış Vadisi & Dar Kirişler", 0, 58.5, -555);
    buildSkyPlatform(16, 2, 14, 0, 57.5, -555, N);

    // Razor-thin beams over thunderstorm abyss (width 1.4 units)
    buildSkyPlatform(1.4, 0.6, 28, 0, 58.5, -575, z);
    buildSkyPlatform(4.5, 1.2, 4.5, 0, 59.5, -592, U);
    buildSkyPlatform(1.4, 0.6, 28, 0, 60.5, -610, z);

    // Creature 6: Antik Gök Baykuşu Muhafızı (Inverts controls!)
    createSkyOwlSentinel(0, 61.0, -592, enemies, pelicanExtensionGroup);

    // =========================================================================
    // 🪶 7. AŞAMA (ÇOK AMA ÇOK ZORLU): FIRTINA ŞİMŞEKLERİ & KAYBOLAN BULUTLAR (z: -630 -> -720, Y: 63 -> 68)
    // =========================================================================
    addCheckpoint("pelican_cp_s7", "7. Aşama: [ÇOK ZORLU] Fırtına Şimşekleri & Bulutlar", 0, 63.5, -640);
    buildSkyPlatform(16, 2, 14, 0, 62.5, -640, N);

    // Rotating Lightning Beams
    [-660, -680, -700].forEach((lz, idx) => {
      buildSkyPlatform(12, 1.5, 10, 0, 63.5 + idx * 1.2, lz, cloudWhiteMat);

      const laserGeo = new THREE.CylinderGeometry(0.12, 0.12, 11.0, 8);
      const laserMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const laserMesh = new THREE.Mesh(laserGeo, laserMat);
      laserMesh.rotation.z = Math.PI / 2;
      laserMesh.position.set(0, 65.0 + idx * 1.2, lz);
      pelicanExtensionGroup.add(laserMesh);

      pelicanLightningBeams.push({
        mesh: laserMesh,
        speed: (idx % 2 === 0 ? 2.5 : -2.5),
        y: 65.0 + idx * 1.2,
        z: lz
      });
      b(`pelican_lightning_gem_${idx}`, 0, 67.0 + idx * 1.2, lz, true);
    });

    // Creature 7: Bulut Ruhu Elektrik Kuşu (Thunderbird)
    createStormThunderbird(0, 67.0, -680, enemies, pelicanExtensionGroup);

    // =========================================================================
    // 👑 8. AŞAMA (BÜYÜK BOSS ARENASI): YÜCE GÖK ZİRVESİ & PELİKAN LORDU (z: -720 -> -840, Y: 68)
    // =========================================================================
    addCheckpoint("pelican_cp_s8", "8. Aşama: [BÜYÜK BOSS] Yüce Gök Zirvesi Arenası", 0, 68.5, -735);

    const peakArenaZ = -780;
    const peakArenaY = 67.5;
    buildSkyPlatform(68, 3, 68, 0, peakArenaY, peakArenaZ, N);
    buildSkyPlatform(64, 0.4, 64, 0, peakArenaY + 1.6, peakArenaZ, z);

    // 8 Grand Sky Monolith Pillars with Cyan Torches
    for (let p = 0; p < 8; p++) {
      const angle = (p / 8) * Math.PI * 2;
      const px = Math.cos(angle) * 29;
      const pz = peakArenaZ + Math.sin(angle) * 29;
      buildSkyPlatform(2.8, 16, 2.8, px, peakArenaY + 8.5, pz, U);
      const obelisk = new THREE.Mesh(new THREE.ConeGeometry(1.5, 2.5, 4), stormGoldMat);
      obelisk.position.set(px, peakArenaY + 17.5, pz);
      pelicanExtensionGroup.add(obelisk);
      const torch = new THREE.PointLight(0x38bdf8, 2.5, 20);
      torch.position.set(px, peakArenaY + 18.0, pz);
      pelicanExtensionGroup.add(torch);
    }

    // THE RELOCATED ICONIC PELICAN BOSS (Exact same shape, beak, body, head, crown, wings!)
    activePelicanBoss = createExactPelicanBoss(0, peakArenaY + 1.6, peakArenaZ + 5, enemies, pelicanExtensionGroup);

    // Victory Exit Portal behind the Boss leading to 5. Bölüm (Karlı Dağlar / Kar Vadisi)
    pelicanVictoryPortal = createPelicanVictoryPortal(0, peakArenaY + 1.6, peakArenaZ - 25, pelicanExtensionGroup);

    console.log("✅ [Pelican Plains Extension] 8 Aşama & 7 Özel Canlı Başarıyla Yerleştirildi!");
  };

  // =========================================================================
  // FEATHER UPDRAFT JUMP PAD
  // =========================================================================
  function createFeatherJumpPad(x, y, z, group) {
    const THREE = window.THREE;
    const padGroup = new THREE.Group();
    padGroup.position.set(x, y, z);

    const ring = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 1.8, 0.3, 16),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 1.2 })
    );
    padGroup.add(ring);

    // Feather icon mesh
    const feather = new THREE.Mesh(
      new THREE.ConeGeometry(0.4, 1.4, 6),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    feather.rotation.z = Math.PI / 4;
    feather.position.y = 0.5;
    padGroup.add(feather);

    group.add(padGroup);

    padGroup.userData = { isFeatherPad: true, x: x, y: y, z: z };
    return padGroup;
  }

  // =========================================================================
  // 7 YENİ CANLI / DÜŞMAN MODELİ VE MEKANİĞİ
  // =========================================================================

  // 1. 🦅 Gökdoğan Avcı Kartalı (Sky Hunter Falcon - Dive strike)
  function createSkyHunterFalcon(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const falconGroup = new THREE.Group();
    falconGroup.position.set(x, y, z);

    const fMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.4 });
    const bMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b });

    const body = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.8, 6), fMat);
    body.rotation.x = Math.PI / 2;
    falconGroup.add(body);

    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.6, 4), bMat);
    beak.rotation.x = -Math.PI / 2;
    beak.position.set(0, 0, 1.2);
    falconGroup.add(beak);

    // Wings
    const wingMat = new THREE.MeshStandardMaterial({ color: 0x451a03 });
    const wL = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.8), wingMat);
    wL.position.set(-1.2, 0.2, 0);
    falconGroup.add(wL);
    const wR = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.8), wingMat);
    wR.position.set(1.2, 0.2, 0);
    falconGroup.add(wR);

    group.add(falconGroup);

    const enemyData = {
      id: "sky_falcon_" + Math.round(z),
      type: "sky_falcon",
      name: "Gökdoğan Avcı Kartalı",
      mesh: falconGroup,
      pos: new THREE.Vector3(x, y, z),
      spawnPos: new THREE.Vector3(x, y, z),
      basePos: new THREE.Vector3(x, y, z),
      baseY: y,
      velocity: new THREE.Vector3(),
      hp: 65,
      maxHp: 65,
      attackPower: 14,
      isBoss: false,
      attackCooldown: 2.0,
      animTimer: 0,
      diving: false,
      update: function(dt, playerPos, game) {
        this.animTimer += dt;
        wL.rotation.z = Math.sin(this.animTimer * 20) * 0.35;
        wR.rotation.z = -Math.sin(this.animTimer * 20) * 0.35;

        const dist = this.pos.distanceTo(playerPos);
        if (dist < 22.0) {
          this.mesh.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
          // Dive bomb!
          if (this.attackCooldown <= 0) {
            this.attackCooldown = 3.5;
            this.diving = true;
          }
          if (this.diving) {
            const dir = playerPos.clone().sub(this.pos).normalize();
            this.pos.add(dir.multiplyScalar(dt * 12.0));
            if (dist < 2.2) {
              game.damagePlayer(this.attackPower);
              this.diving = false;
              this.pos.y = this.baseY;
            }
          } else {
            this.pos.y = this.baseY + Math.sin(this.animTimer * 3) * 0.8;
          }
        }
      }
    };
    enemies.push(enemyData);
    pelicanCustomCreatures.push(enemyData);
    return enemyData;
  }

  // 2. 🦩 Zehirli Bataklık Flamingosu (Toxic Marsh Flamingo)
  function createToxicMarshFlamingo(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const flamGroup = new THREE.Group();
    flamGroup.position.set(x, y, z);

    const pinkMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.5 });
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });

    // Single standing leg
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.0, 6), legMat);
    leg.position.y = 1.0;
    flamGroup.add(leg);

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.65, 8, 8), pinkMat);
    body.scale.set(0.9, 0.8, 1.2);
    body.position.y = 2.2;
    flamGroup.add(body);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 1.4, 6), pinkMat);
    neck.position.set(0, 3.0, 0.5);
    neck.rotation.x = -0.3;
    flamGroup.add(neck);

    group.add(flamGroup);

    const enemyData = {
      id: "flamingo_" + Math.round(z),
      type: "toxic_flamingo",
      name: "Zehirli Bataklık Flamingosu",
      mesh: flamGroup,
      pos: new THREE.Vector3(x, y, z),
      velocity: new THREE.Vector3(),
      hp: 50,
      maxHp: 50,
      attackPower: 11,
      isBoss: false,
      attackCooldown: 1.5,
      animTimer: 0,
      update: function(dt, playerPos, game) {
        this.animTimer += dt;
        const dist = this.pos.distanceTo(playerPos);
        if (dist < 18.0) {
          this.mesh.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
          if (this.attackCooldown <= 0) {
            this.attackCooldown = 3.2;
            spawnToxicMudGlob(this.pos.clone().add(new THREE.Vector3(0, 3.2, 0)), playerPos, game);
          }
        }
      }
    };
    enemies.push(enemyData);
    pelicanCustomCreatures.push(enemyData);
    return enemyData;
  }

  // 3. 🦆 Zırhlı Çekiç Gagalı Ördek (Hammer-Beak Duck)
  function createHammerBeakDuck(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const duckGroup = new THREE.Group();
    duckGroup.position.set(x, y, z);

    const duckMat = new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.4 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 });

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.9, 10, 8), duckMat);
    body.position.y = 0.85;
    duckGroup.add(body);

    // Heavy Anvil Hammer Beak
    const beak = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 1.4), brassMat);
    beak.position.set(0, 0.9, 1.2);
    duckGroup.add(beak);

    group.add(duckGroup);

    const enemyData = {
      id: "hammer_duck_" + Math.round(z),
      type: "hammer_duck",
      name: "Zırhlı Çekiç Gagalı Ördek",
      mesh: duckGroup,
      pos: new THREE.Vector3(x, y, z),
      velocity: new THREE.Vector3(),
      hp: 95,
      maxHp: 95,
      attackPower: 16,
      isBoss: false,
      attackCooldown: 2.2,
      animTimer: 0,
      update: function(dt, playerPos, game) {
        this.animTimer += dt;
        const dist = this.pos.distanceTo(playerPos);
        if (dist < 16.0) {
          this.mesh.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
          if (dist > 2.8) {
            const dir = playerPos.clone().sub(this.pos).normalize();
            this.pos.x += dir.x * dt * 4.0;
            this.pos.z += dir.z * dt * 4.0;
          } else if (this.attackCooldown <= 0) {
            this.attackCooldown = 3.0;
            // Slam anvil beak!
            game.damagePlayer(this.attackPower);
            spawnSkyShockwave(this.pos, game, 8.0);
            if (window.St && window.St.playHammerSlam) window.St.playHammerSlam();
          }
        }
      }
    };
    enemies.push(enemyData);
    pelicanCustomCreatures.push(enemyData);
    return enemyData;
  }

  // 4. 🪶 Pelikan Tüyü Kasırga Şamanı (Feather Tempest Shaman - Tornadoes)
  function createFeatherTempestShaman(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const shamanGroup = new THREE.Group();
    shamanGroup.position.set(x, y, z);

    const featherMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.6 });
    const robe = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.9, 2.4, 8), featherMat);
    robe.position.y = 1.2;
    shamanGroup.add(robe);

    const staffOrb = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, emissive: 0x38bdf8, emissiveIntensity: 1.5 })
    );
    staffOrb.position.set(0.7, 2.7, 0.3);
    shamanGroup.add(staffOrb);

    group.add(shamanGroup);

    const enemyData = {
      id: "tempest_shaman_" + Math.round(z),
      type: "tempest_shaman",
      name: "Kasırga Şamanı",
      mesh: shamanGroup,
      pos: new THREE.Vector3(x, y, z),
      baseY: y,
      velocity: new THREE.Vector3(),
      hp: 110,
      maxHp: 110,
      attackPower: 12,
      isBoss: false,
      attackCooldown: 2.0,
      animTimer: 0,
      update: function(dt, playerPos, game) {
        this.animTimer += dt;
        staffOrb.rotation.y += dt * 4;
        this.pos.y = this.baseY + Math.sin(this.animTimer * 2.5) * 0.4;

        const dist = this.pos.distanceTo(playerPos);
        if (dist < 22.0) {
          this.mesh.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
          if (this.attackCooldown <= 0) {
            this.attackCooldown = 4.2;
            spawnMiniCyclone(this.pos, playerPos, game);
          }
        }
      }
    };
    enemies.push(enemyData);
    pelicanCustomCreatures.push(enemyData);
    return enemyData;
  }

  // 5. 🕊️ Girdap Yutan Akbaba (Vortex Vulture)
  function createVortexVulture(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const vultureGroup = new THREE.Group();
    vultureGroup.position.set(x, y, z);

    const vMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
    const bMat = new THREE.MeshStandardMaterial({ color: 0xd97706 });

    const body = new THREE.Mesh(new THREE.ConeGeometry(0.55, 2.0, 6), vMat);
    body.rotation.x = Math.PI / 2;
    vultureGroup.add(body);

    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.9, 4), bMat);
    beak.rotation.x = -Math.PI / 2;
    beak.position.set(0, -0.2, 1.4);
    vultureGroup.add(beak);

    group.add(vultureGroup);

    const enemyData = {
      id: "vulture_" + Math.round(z),
      type: "vortex_vulture",
      name: "Girdap Yutan Akbaba",
      mesh: vultureGroup,
      pos: new THREE.Vector3(x, y, z),
      baseY: y,
      velocity: new THREE.Vector3(),
      hp: 75,
      maxHp: 75,
      attackPower: 13,
      isBoss: false,
      attackCooldown: 1.8,
      animTimer: 0,
      update: function(dt, playerPos, game) {
        this.animTimer += dt;
        this.pos.y = this.baseY + Math.sin(this.animTimer * 3) * 0.8;

        const dist = this.pos.distanceTo(playerPos);
        if (dist < 24.0) {
          this.mesh.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
          if (this.attackCooldown <= 0) {
            this.attackCooldown = 3.0;
            spawnFeatherDagger(this.pos, playerPos, game);
          }
        }
      }
    };
    enemies.push(enemyData);
    pelicanCustomCreatures.push(enemyData);
    return enemyData;
  }

  // 6. 🦉 Antik Gök Baykuşu Muhafızı (Sky Owl Sentinel - Inverts controls!)
  function createSkyOwlSentinel(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const owlGroup = new THREE.Group();
    owlGroup.position.set(x, y, z);

    const oMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.6 });
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.75, 1.8, 8), oMat);
    body.position.y = 0.9;
    owlGroup.add(body);

    // Glowing Owl Eyes
    [-0.25, 0.25].forEach(ex => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), eyeMat);
      eye.position.set(ex, 1.4, 0.55);
      owlGroup.add(eye);
    });

    group.add(owlGroup);

    const enemyData = {
      id: "owl_sentinel_" + Math.round(z),
      type: "sky_owl_sentinel",
      name: "Antik Gök Baykuşu",
      mesh: owlGroup,
      pos: new THREE.Vector3(x, y, z),
      velocity: new THREE.Vector3(),
      hp: 90,
      maxHp: 90,
      attackPower: 12,
      isBoss: false,
      attackCooldown: 2.5,
      animTimer: 0,
      update: function(dt, playerPos, game) {
        this.animTimer += dt;
        const dist = this.pos.distanceTo(playerPos);
        if (dist < 18.0) {
          this.mesh.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
          if (this.attackCooldown <= 0) {
            this.attackCooldown = 4.5;
            // Supersonic screech wave!
            spawnScreechWave(this.pos, game);
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("🦉 Baykuş Çığlığı! Başın Döndü! 💫", "warning");
            }
          }
        }
      }
    };
    enemies.push(enemyData);
    pelicanCustomCreatures.push(enemyData);
    return enemyData;
  }

  // 7. ☁️ Bulut Ruhu Elektrik Kuşu (Storm Cloud Thunderbird)
  function createStormThunderbird(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const tGroup = new THREE.Group();
    tGroup.position.set(x, y, z);

    const elecMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.5,
      roughness: 0.1
    });

    const body = new THREE.Mesh(new THREE.SphereGeometry(1.0, 10, 8), elecMat);
    body.scale.set(1.1, 0.9, 1.5);
    tGroup.add(body);

    const halo = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.08, 6, 20), elecMat);
    halo.rotation.x = Math.PI / 2;
    tGroup.add(halo);

    group.add(tGroup);

    const enemyData = {
      id: "thunderbird_" + Math.round(z),
      type: "thunderbird",
      name: "Bulut Ruhu Elektrik Kuşu",
      mesh: tGroup,
      pos: new THREE.Vector3(x, y, z),
      baseY: y,
      velocity: new THREE.Vector3(),
      hp: 125,
      maxHp: 125,
      attackPower: 16,
      isBoss: false,
      attackCooldown: 2.0,
      animTimer: 0,
      update: function(dt, playerPos, game) {
        this.animTimer += dt;
        halo.rotation.z += dt * 3;
        this.pos.y = this.baseY + Math.sin(this.animTimer * 2.8) * 0.6;

        const dist = this.pos.distanceTo(playerPos);
        if (dist < 22.0) {
          this.mesh.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
          if (this.attackCooldown <= 0) {
            this.attackCooldown = 3.5;
            spawnElectricLightningBolt(this.pos, playerPos, game);
          }
        }
      }
    };
    enemies.push(enemyData);
    pelicanCustomCreatures.push(enemyData);
    return enemyData;
  }

  // =========================================================================
  // 👑 BÜYÜK BOSS: PELİKAN OVALARI LORDU (Exact Same Shape, Relocated to Stage 8 Peak!)
  // =========================================================================
  function createExactPelicanBoss(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const bossGroup = new THREE.Group();
    bossGroup.name = "boss_pelican_monarch_relocated";
    bossGroup.position.set(x, y, z);
    bossGroup.scale.set(3.0, 3.0, 3.0); // Majestic boss scale

    // Exact Materials from original code
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, emissive: 0x0369a1, emissiveIntensity: 0.35 });
    const neckMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8 });
    const crownMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xd97706, emissiveIntensity: 0.5 });
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const beakMat = new THREE.MeshStandardMaterial({ color: 0xf97316 });
    const wingMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.2 });

    // 1. Torso
    const torso = new THREE.Mesh(new THREE.SphereGeometry(0.85, 16, 16), bodyMat);
    bossGroup.add(torso);

    // 2. Neck
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.38, 0.9, 12), neckMat);
    neck.position.set(0, 0.7, 0.5);
    neck.rotation.x = 0.3;
    bossGroup.add(neck);

    // 3. Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.45, 12, 12), bodyMat);
    head.position.set(0, 1.1, 0.75);
    bossGroup.add(head);

    // 4. Crown
    const crown = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.6, 5), crownMat);
    crown.position.set(0, 1.6, 0.7);
    crown.rotation.x = -0.2;
    bossGroup.add(crown);

    // 5. Piercing Eyes
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), eyeMat);
    eyeL.position.set(-0.22, 1.2, 1.05);
    bossGroup.add(eyeL);
    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), eyeMat);
    eyeR.position.set(0.22, 1.2, 1.05);
    bossGroup.add(eyeR);

    // 6. Giant Pelican Beak
    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.8, 10), beakMat);
    beak.rotation.x = Math.PI / 2;
    beak.position.set(0, 0.9, 1.8);
    bossGroup.add(beak);

    // 7. Wings
    const wingL = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 1.1), wingMat);
    wingL.name = "boss_left_wing";
    wingL.position.set(-1.6, 0.3, 0);
    bossGroup.add(wingL);

    const wingR = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 1.1), wingMat);
    wingR.name = "boss_right_wing";
    wingR.position.set(1.6, 0.3, 0);
    bossGroup.add(wingR);

    group.add(bossGroup);

    const bossData = {
      id: "boss_pelican_monarch",
      type: "pelican_boss",
      name: "Pelikan Ovaları Lordu (Mega Boss 🪶)",
      mesh: bossGroup,
      pos: new THREE.Vector3(x, y, z),
      velocity: new THREE.Vector3(),
      hp: 500,
      maxHp: 500,
      attackPower: 20,
      isBoss: true,
      attackCooldown: 2.0,
      animTimer: 0,
      state: "chase",
      update: function(dt, playerPos, game) {
        this.animTimer += dt;
        // Wing Flapping Animation
        wingL.rotation.z = Math.sin(this.animTimer * 4) * 0.45;
        wingR.rotation.z = -Math.sin(this.animTimer * 4) * 0.45;

        const dist = this.pos.distanceTo(playerPos);
        if (dist < 45.0) {
          this.mesh.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
          if (this.attackCooldown <= 0) {
            this.attackCooldown = 3.2;
            const roll = Math.random();
            if (roll < 0.45) {
              // Sky Dive Slam Shockwave
              spawnSkyShockwave(this.pos, game, 9.5);
              if (window.St && window.St.playBossRoar) window.St.playBossRoar();
            } else if (roll < 0.75) {
              // Feather Blade Barrage
              spawnFeatherDagger(this.pos.clone().add(new THREE.Vector3(0, 3, 0)), playerPos, game);
            } else {
              // Wing Gale Gust
              game.playerVel.x += (Math.random() - 0.5) * 14.0;
              game.damagePlayer(12);
            }
          }
        }
      }
    };
    enemies.push(bossData);
    return bossData;
  }

  // =========================================================================
  // VICTORY EXIT PORTAL TO 5. BÖLÜM (KAR VADİSİ / SNOW DESERT)
  // =========================================================================
  function createPelicanVictoryPortal(x, y, z, group) {
    const THREE = window.THREE;
    const portalGroup = new THREE.Group();
    portalGroup.name = "pelican_stage8_victory_portal";
    portalGroup.position.set(x, y, z);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.5, 0.45, 16, 32),
      new THREE.MeshStandardMaterial({ color: 0x93c5fd, emissive: 0x3b82f6, emissiveIntensity: 1.8 })
    );
    ring.position.y = 3.5;
    portalGroup.add(ring);

    const vortex = new THREE.Mesh(
      new THREE.CircleGeometry(3.2, 32),
      new THREE.MeshBasicMaterial({ color: 0x60a5fa, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
    );
    vortex.position.y = 3.5;
    portalGroup.add(vortex);

    group.add(portalGroup);

    return {
      mesh: portalGroup,
      pos: new THREE.Vector3(x, y, z),
      targetRegion: "snow_desert"
    };
  }

  // =========================================================================
  // PROJECTILES & HAZARD SPAWNERS
  // =========================================================================
  function spawnToxicMudGlob(fromPos, toPos, game) {
    if (!window.THREE || !game || !game.scene) return;
    const THREE = window.THREE;
    const mud = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xf472b6, emissive: 0xdb2777, emissiveIntensity: 1.2 })
    );
    mud.position.copy(fromPos);
    game.scene.add(mud);

    const dir = toPos.clone().sub(fromPos).normalize();
    activePelicanProjectiles.push({
      mesh: mud,
      pos: fromPos.clone(),
      dir: dir,
      speed: 13.0,
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

  function spawnMiniCyclone(fromPos, toPos, game) {
    if (!window.THREE || !game || !game.scene) return;
    const THREE = window.THREE;
    const cyclone = new THREE.Mesh(
      new THREE.ConeGeometry(0.8, 2.2, 12, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xbae6fd, transparent: true, opacity: 0.65, wireframe: true })
    );
    cyclone.position.copy(fromPos);
    cyclone.rotation.x = Math.PI;
    game.scene.add(cyclone);

    const dir = toPos.clone().sub(fromPos).normalize();
    activePelicanProjectiles.push({
      mesh: cyclone,
      pos: fromPos.clone(),
      dir: dir,
      speed: 8.5,
      life: 3.5,
      update: function(dt) {
        this.life -= dt;
        this.pos.add(this.dir.clone().multiplyScalar(this.speed * dt));
        this.mesh.position.copy(this.pos);
        this.mesh.rotation.y += dt * 10;
        if (game.playerPos && this.pos.distanceTo(game.playerPos) < 2.2) {
          game.damagePlayer(12);
          game.playerVel.y = 12.0; // Toss in air
          this.life = -1;
        }
      }
    });
  }

  function spawnFeatherDagger(fromPos, toPos, game) {
    if (!window.THREE || !game || !game.scene) return;
    const THREE = window.THREE;
    const dagger = new THREE.Mesh(
      new THREE.ConeGeometry(0.18, 1.2, 6),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    dagger.position.copy(fromPos);
    game.scene.add(dagger);

    const dir = toPos.clone().sub(fromPos).normalize();
    activePelicanProjectiles.push({
      mesh: dagger,
      pos: fromPos.clone(),
      dir: dir,
      speed: 17.0,
      life: 2.2,
      update: function(dt) {
        this.life -= dt;
        this.pos.add(this.dir.clone().multiplyScalar(this.speed * dt));
        this.mesh.position.copy(this.pos);
        if (game.playerPos && this.pos.distanceTo(game.playerPos) < 1.8) {
          game.damagePlayer(12);
          this.life = -1;
        }
      }
    });
  }

  function spawnScreechWave(pos, game) {
    if (!window.THREE || !game || !game.scene) return;
    const THREE = window.THREE;
    const wave = new THREE.Mesh(
      new THREE.RingGeometry(0.5, 1.2, 24),
      new THREE.MeshBasicMaterial({ color: 0xfacc15, side: THREE.DoubleSide })
    );
    wave.rotation.x = -Math.PI / 2;
    wave.position.set(pos.x, pos.y + 0.2, pos.z);
    game.scene.add(wave);

    let r = 0.5;
    activePelicanProjectiles.push({
      mesh: wave,
      pos: pos.clone(),
      life: 1.5,
      update: function(dt) {
        this.life -= dt;
        r += dt * 8.0;
        this.mesh.scale.set(r, r, 1);
        if (game.playerPos) {
          const d = Math.hypot(game.playerPos.x - this.pos.x, game.playerPos.z - this.pos.z);
          if (Math.abs(d - r) < 1.4) {
            game.damagePlayer(8);
          }
        }
      }
    });
  }

  function spawnElectricLightningBolt(fromPos, toPos, game) {
    if (!window.THREE || !game || !game.scene) return;
    const THREE = window.THREE;
    const bolt = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 6, 6),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    bolt.position.copy(fromPos);
    game.scene.add(bolt);

    const dir = toPos.clone().sub(fromPos).normalize();
    activePelicanProjectiles.push({
      mesh: bolt,
      pos: fromPos.clone(),
      dir: dir,
      speed: 15.0,
      life: 2.0,
      update: function(dt) {
        this.life -= dt;
        this.pos.add(this.dir.clone().multiplyScalar(this.speed * dt));
        this.mesh.position.copy(this.pos);
        if (game.playerPos && this.pos.distanceTo(game.playerPos) < 1.8) {
          game.damagePlayer(15);
          this.life = -1;
        }
      }
    });
  }

  function spawnSkyShockwave(pos, game, maxR = 9.0) {
    if (!window.THREE || !game || !game.scene) return;
    const THREE = window.THREE;
    const waveMesh = new THREE.Mesh(
      new THREE.RingGeometry(0.8, 1.6, 24),
      new THREE.MeshBasicMaterial({ color: 0x0284c7, side: THREE.DoubleSide })
    );
    waveMesh.rotation.x = -Math.PI / 2;
    waveMesh.position.set(pos.x, pos.y + 0.15, pos.z);
    game.scene.add(waveMesh);

    let radius = 1.0;
    activePelicanProjectiles.push({
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
  function updatePelicanPlainsExtension(dt) {
    const game = window.__superBearGame;
    if (!game || game.currentRegion !== 'pelican_plains') return;
    totalTime += dt;

    // 1. Feather Updraft Pads interaction check
    if (game.playerPos && pelicanExtensionGroup) {
      pelicanExtensionGroup.traverse(obj => {
        if (obj && obj.userData && obj.userData.isFeatherPad) {
          const d = Math.hypot(game.playerPos.x - obj.userData.x, game.playerPos.z - obj.userData.z);
          if (d < 1.8 && Math.abs(game.playerPos.y - obj.userData.y) < 1.2) {
            window.__triggerFeatherUpdraft(16.0);
          }
        }
      });
    }

    // 2. Moving Clouds (Stage 3)
    pelicanMovingClouds.forEach(mp => {
      const offX = Math.sin(totalTime * mp.speed + mp.offset) * mp.rangeX;
      mp.mesh.position.x = mp.baseX + offX;
      if (mp.coll) {
        mp.coll.min.x = mp.baseX + offX - 2.5;
        mp.coll.max.x = mp.baseX + offX + 2.5;
      }
    });

    // 3. Crumbling Ledges (Stage 5)
    if (game.playerPos) {
      pelicanCrumblingLedges.forEach(cp => {
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

    // 4. Lightning Beams (Stage 7)
    pelicanLightningBeams.forEach(lb => {
      lb.mesh.rotation.y += dt * lb.speed;
      if (game.playerPos) {
        const d = Math.hypot(game.playerPos.x - lb.mesh.position.x, game.playerPos.z - lb.z);
        if (d < 5.5 && Math.abs(game.playerPos.y - lb.y) < 1.5) {
          const pAngle = Math.atan2(game.playerPos.z - lb.z, game.playerPos.x - lb.mesh.position.x);
          let diff = Math.abs(pAngle - lb.mesh.rotation.y) % (Math.PI * 2);
          if (diff < 0.25 || Math.abs(diff - Math.PI) < 0.25) {
            game.damagePlayer(16);
          }
        }
      }
    });

    // 5. Active Projectiles
    for (let i = activePelicanProjectiles.length - 1; i >= 0; i--) {
      const p = activePelicanProjectiles[i];
      p.update(dt);
      if (p.life <= 0) {
        if (p.mesh && p.mesh.parent) p.mesh.parent.remove(p.mesh);
        activePelicanProjectiles.splice(i, 1);
      }
    }

    // 6. Stage 8 Victory Portal Interaction
    if (pelicanVictoryPortal && game.playerPos) {
      pelicanVictoryPortal.mesh.rotation.y += dt * 0.8;
      const d = pelicanVictoryPortal.pos.distanceTo(game.playerPos);
      if (d < 3.8) {
        const isBossAlive = (game.currentLevel && game.currentLevel.enemies || []).some(
          e => e && e.id === "boss_pelican_monarch" && e.hp > 0
        );
        if (isBossAlive) {
          const now = Date.now();
          if (!pelicanVictoryPortal._lastNotice || now - pelicanVictoryPortal._lastNotice > 2500) {
            pelicanVictoryPortal._lastNotice = now;
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("⚠️ Kar Vadisi portalından geçmek için önce Pelikan Lordu'nu yenmelisin! ⚔️", "warning");
            }
          }
        } else {
          if (!pelicanVictoryPortal._triggered) {
            pelicanVictoryPortal._triggered = true;
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("🌀 5. Bölüm: Karlı Dağlar & Kar Vadisi'ne Geçiliyor! ❄️", "success");
            }
            setTimeout(() => {
              game.loadRegion("snow_desert");
            }, 800);
          }
        }
      }
    }
  }

  // =========================================================================
  // CLEANUP & MEMORY DISPOSAL
  // =========================================================================
  function cleanUpPelicanPlainsExtension(game) {
    if (!game) game = window.__superBearGame;
    activePelicanProjectiles.forEach(p => {
      if (p.mesh && p.mesh.parent) p.mesh.parent.remove(p.mesh);
    });
    activePelicanProjectiles = [];

    if (pelicanExtensionGroup) {
      pelicanExtensionGroup.traverse(obj => {
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
      if (pelicanExtensionGroup.parent) pelicanExtensionGroup.parent.remove(pelicanExtensionGroup);
      pelicanExtensionGroup = null;
    }
    pelicanMovingClouds = [];
    pelicanCrumblingLedges = [];
    pelicanTornadoes = [];
    pelicanLightningBeams = [];
    pelicanCustomCreatures = [];
    activePelicanBoss = null;
    pelicanVictoryPortal = null;
    console.log("🧹 [Pelican Plains Extension] Bellek başarıyla temizlendi (Disposed).");
  }

  function initPelicanTicker() {
    const game = window.__superBearGame;
    if (game && !game._pelicanTickerHooked) {
      game._pelicanTickerHooked = true;
      const origUpdate = game.update;
      game.update = function(dt, totalTime) {
        origUpdate.call(this, dt, totalTime);
        try {
          updatePelicanPlainsExtension(dt);
        } catch(err) {}
      };
    }
  }

  window.addEventListener('superbear:region-changed', (e) => {
    const newReg = e.detail;
    if (newReg !== 'pelican_plains') {
      cleanUpPelicanPlainsExtension();
    }
  });

  const tickerInterval = setInterval(() => {
    if (window.__superBearGame) {
      initPelicanTicker();
      clearInterval(tickerInterval);
    }
  }, 100);

  window.__cleanUpPelicanPlainsExtension = cleanUpPelicanPlainsExtension;
  window.__updatePelicanPlainsExtension = updatePelicanPlainsExtension;
  console.log("🪶 [Pelican Plains Extension] Script Loaded & Ready!");
})();
