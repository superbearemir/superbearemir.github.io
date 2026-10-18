// ============================================================================
// 🏛️ 2. BÖLÜM: ANTİK ORMAN TAPINAĞI GENİŞLETMESİ (8 YENİ AŞAMA & 7 ÖZEL CANLI)
// - Boss ilk yerinden kaldırıldı, 8. Aşamadaki büyük arenaya taşındı.
// - 8 Yeni Aşama:
//     * Aşama 1: Antik Asma Köprüler & Yosunlu Geçit
//     * Aşama 2: Sarmaşık Fırtınası & Hareketli Zümrüt Platformlar (Orta Zorluk)
//     * Aşama 3: Zehirli Bataklık & Dikenli Sıçrama Taşları (Orta Zorluk)
//     * Aşama 4: Dönen Dikenli Kütükler & Asılı Bahçeler (Orta Zorluk)
//     * Aşama 5: Gölge Koridoru & Etobur Çiçek Labirenti (Orta Zorluk)
//     * Aşama 6: [HARDCORE] Çöken Antik Sütunlar & Zehir Rüzgarları (Çok Zorlu)
//     * Aşama 7: [HARDCORE] Kadim Şaman Sunağı & Lazerli Totemler (Çok Zorlu)
//     * Aşama 8: [BÜYÜK BOSS] Yüce Doğa Tapınağı & Dev Orman Titanı (Final Zirve)
// - 7 Özel Yeni Canlı ve Mekanikleri:
//     1. 🌿 Sarmaşık Sarıcı Druid: Sarmaşık fırlatır, oyuncuyu 3 saniye dondurur/kilitler!
//     2. 🐸 Zehirli Orman Kurbağası: Zıplar ve zehirli spor halkaları püskürtür.
//     3. 🪨 Antik Taş Muhafız: Kaya kılığında pusuya yatar, yer sarsıntısı şok dalgası yaratır.
//     4. 🦟 Dikenli Yaban Eşekarısı: Havada uçar, havadan dalış yapıp diken iğneleri atar.
//     5. 🐆 Gölge Orman Panteri: %80 kamuflaj ile yaklaşır, yüksek hızla pusuya düşürür.
//     6. 🌺 Etobur Ağız Çiçeği: Çiçek kılığında yerdedir, basılınca 18 hasarla çeneyi kilitler.
//     7. 🧙‍♂️ Kadim Orman Şamanı: Dostlarına dokunulmazlık kalkanı basar, takip eden ruh küreleri atar.
// ============================================================================
(function() {
  'use strict';

  let extensionGroup = null;
  let activeProjectiles = [];
  let movingPlatforms = [];
  let crumblingPlatforms = [];
  let rotatingHazardLogs = [];
  let laserBeams = [];
  let activeTitanBoss = null;
  let victoryExitPortal = null;
  let customCreatures = [];

  // Expose root entanglement helper globally
  window.__entanglePlayer = function(duration = 3.0) {
    const game = window.__superBearGame;
    if (game && typeof game.entanglePlayer === 'function') {
      game.entanglePlayer(duration);
    }
  };

  // Main Builder function invoked by game-bundle.js during Ww('forest_temple')
  window.__populateForestTempleExtension = function(
    sceneGroup, collidables, platforms, enemies, items, easels, npcs,
    checkpoints, addCheckpoint, R, b, S, T, z, v, U, N, vineMat, leafMat, heartMat
  ) {
    if (!window.THREE) return;
    const THREE = window.THREE;
    console.log("🌿 [Forest Temple Extension] 8 Yeni Aşama ve 7 Özel Canlı Oluşturuluyor...");
    // Remove invisible wall: extend level bounds so player can explore all 8 stages freely
    const gameInstance = window.__superBearGame;
    if (gameInstance && gameInstance.currentLevel && gameInstance.currentLevel.bounds) {
      gameInstance.currentLevel.bounds.minZ = -1000;
      gameInstance.currentLevel.bounds.maxZ = 100;
      gameInstance.currentLevel.bounds.minX = -300;
      gameInstance.currentLevel.bounds.maxX = 300;
      gameInstance.currentLevel.bounds.minY = -50;
      gameInstance.currentLevel.bounds.maxY = 250;
    }

    // Create container group
    extensionGroup = new THREE.Group();
    extensionGroup.name = "forest_temple_8_stages_extension";
    sceneGroup.add(extensionGroup);

    // Reset local arrays
    activeProjectiles = [];
    movingPlatforms = [];
    crumblingPlatforms = [];
    rotatingHazardLogs = [];
    laserBeams = [];
    customCreatures = [];
    activeTitanBoss = null;
    victoryExitPortal = null;

    // Common Materials (matching original temple palette)
    const stoneMat = z; // ancient moss stone
    const darkStoneMat = v; // dark temple rock
    const mossMat = N; // lush green moss
    const emeraldGoldMat = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      emissive: 0x166534,
      emissiveIntensity: 0.8,
      roughness: 0.4
    });
    const runeGoldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 1.0,
      metalness: 0.6,
      roughness: 0.3
    });
    const toxicSwampMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b,
      emissive: 0x047857,
      emissiveIntensity: 0.7,
      transparent: true,
      opacity: 0.88,
      roughness: 0.1
    });

    // Helper to spawn extended platform and collider
    function buildExtPlatform(w, h, d, px, py, pz, mat, isHazard = false, isClimbable = false) {
      const p = R(w, h, d, px, py, pz, mat, isHazard, isClimbable);
      return p;
    }

    // =========================================================================
    // 🌉 1. AŞAMA: ANTİK ASMA KÖPRÜLER & YOSUNLU GEÇİT (z: -175 -> -230, Y: 18 -> 21)
    // =========================================================================
    addCheckpoint("ft_cp_s1", "1. Aşama: Antik Asma Köprüler & Geçit", 0, 19.5, -185);

    // Initial connecting terrace
    buildExtPlatform(18, 2, 18, 0, 18.0, -185, stoneMat);
    buildExtPlatform(16, 0.4, 16, 0, 19.1, -185, mossMat);
    b("ft_coin_s1_0", -4, 20.0, -185, false);
    b("ft_coin_s1_1", 4, 20.0, -185, false);

    // Hanging Rope & Vine Bridge segments
    const bridgeY = 19.0;
    for (let i = 0; i < 7; i++) {
      const bz = -196 - (i * 4.2);
      const sag = Math.sin((i / 6) * Math.PI) * 0.8;
      const py = bridgeY - sag;
      buildExtPlatform(4.2, 0.4, 3.2, 0, py, bz, darkStoneMat);
      // Vine ropes on left and right
      const ropeL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.8, 8), vineMat);
      ropeL.position.set(-2.2, py + 1.0, bz);
      ropeL.rotation.z = 0.05;
      extensionGroup.add(ropeL);
      const ropeR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.8, 8), vineMat);
      ropeR.position.set(2.2, py + 1.0, bz);
      ropeR.rotation.z = -0.05;
      extensionGroup.add(ropeR);
      if (i === 3) b("ft_gem_s1", 0, py + 1.6, bz, true);
    }

    // Creature 1: Sarmaşık Sarıcı Druid #1 at end of Stage 1
    createVineEntanglerDruid(0, 19.2, -225, enemies, extensionGroup, vineMat, darkStoneMat);

    // =========================================================================
    // 🌪️ 2. AŞAMA (ORTA ZORLUK): HAREKETLİ ZÜMRÜT PLATFORMLAR (z: -230 -> -290, Y: 21 -> 24)
    // =========================================================================
    addCheckpoint("ft_cp_s2", "2. Aşama: Hareketli Zümrüt Platformlar [Orta]", 0, 21.5, -235);
    buildExtPlatform(14, 2, 12, 0, 20.5, -235, stoneMat);

    // 4 Moving Platforms (Horizontal Sway)
    const mPZ = [-246, -256, -266, -276];
    mPZ.forEach((mpz, idx) => {
      const mpMesh = buildExtPlatform(4.5, 0.8, 4.5, 0, 21.0 + idx * 0.7, mpz, emeraldGoldMat);
      const collObj = collidables[collidables.length - 1];
      movingPlatforms.push({
        mesh: mpMesh,
        coll: collObj,
        baseX: 0,
        baseY: 21.0 + idx * 0.7,
        baseZ: mpz,
        rangeX: 5.5 + (idx % 2 === 0 ? 1.5 : -1.0),
        speed: 1.6 + idx * 0.25,
        offset: idx * 1.5
      });
      b(`ft_coin_s2_${idx}`, 0, 23.0 + idx * 0.7, mpz, idx === 3);
    });

    // Hanging vine thorn pendulums between moving platforms
    [-251, -261, -271].forEach((pz, pIdx) => {
      const pen = new THREE.Group();
      pen.position.set(0, 32.0, pz);
      const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 10, 8), vineMat);
      rope.position.y = -5.0;
      pen.add(rope);
      const spikeBall = new THREE.Mesh(
        new THREE.DodecahedronGeometry(1.2, 0),
        new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.3 })
      );
      spikeBall.position.y = -10.0;
      pen.add(spikeBall);
      extensionGroup.add(pen);
      pen.userData = { swingOffset: pIdx * 1.8 };
      rotatingHazardLogs.push({ type: "pendulum", group: pen });
    });

    // Creature 2: Zehirli Orman Kurbağası #1 & #2
    createSporeFrog(-4.5, 22.0, -255, enemies, extensionGroup);
    createSporeFrog(4.5, 23.5, -275, enemies, extensionGroup);

    // =========================================================================
    // 🧪 3. AŞAMA (ORTA ZORLUK): ZEHİRLİ BATAKLIK & SIÇRAYAN TAŞLAR (z: -290 -> -350, Y: 24 -> 26)
    // =========================================================================
    addCheckpoint("ft_cp_s3", "3. Aşama: Zehirli Bataklık & Sıçrama Taşları [Orta]", 0, 24.5, -290);
    buildExtPlatform(14, 2, 12, 0, 23.5, -290, stoneMat);

    // Vast toxic swamp pool underneath
    buildExtPlatform(48, 1.2, 58, 0, 17.5, -320, toxicSwampMat, true);

    // Alternating sinking lilypad stones
    const lilypads = [
      { x: -3.5, z: -302, y: 24.2 },
      { x: 2.5, z: -310, y: 24.5 },
      { x: -2.0, z: -318, y: 24.8 },
      { x: 3.5, z: -326, y: 25.0 },
      { x: -3.0, z: -334, y: 25.2 },
      { x: 0.0, z: -342, y: 25.5 }
    ];
    lilypads.forEach((lp, lIdx) => {
      buildExtPlatform(3.2, 0.6, 3.2, lp.x, lp.y, lp.z, darkStoneMat);
      const topCap = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.15, 12), mossMat);
      topCap.position.set(lp.x, lp.y + 0.35, lp.z);
      extensionGroup.add(topCap);
      b(`ft_coin_s3_${lIdx}`, lp.x, lp.y + 1.2, lp.z, lIdx === 2);
    });

    // Creature 3: Antik Taş Muhafız (Dormant Rock awakened on approach)
    createMossSentinel(0, 25.5, -345, enemies, extensionGroup, stoneMat);

    // =========================================================================
    // 🌲 4. AŞAMA (ORTA ZORLUK): DÖNEN DİKENLİ KÜTÜKLER & ASILI BAHÇELER (z: -350 -> -410, Y: 26 -> 28)
    // =========================================================================
    addCheckpoint("ft_cp_s4", "4. Aşama: Dönen Dikenli Kütükler [Orta]", 0, 26.5, -355);
    buildExtPlatform(14, 2, 12, 0, 25.5, -355, stoneMat);

    // Rotating Hazard Logs bridging the abyss
    [-370, -390].forEach((lz, lIdx) => {
      buildExtPlatform(5, 2, 5, 0, 26.0 + lIdx * 1.0, lz - 10, stoneMat);

      const logGroup = new THREE.Group();
      logGroup.position.set(0, 26.2 + lIdx * 1.0, lz);
      const logBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.85, 0.85, 16, 12),
        new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 })
      );
      logBody.rotation.x = Math.PI / 2;
      logGroup.add(logBody);

      for (let t = 0; t < 8; t++) {
        const spike = new THREE.Mesh(
          new THREE.ConeGeometry(0.35, 1.2, 6),
          new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 })
        );
        const sAng = (t / 8) * Math.PI * 2;
        spike.position.set(Math.cos(sAng) * 0.9, Math.sin(sAng) * 0.9, (t - 4) * 1.8);
        spike.rotation.z = sAng - Math.PI / 2;
        logGroup.add(spike);
      }
      extensionGroup.add(logGroup);
      rotatingHazardLogs.push({ type: "log", group: logGroup, speed: 1.8 * (lIdx % 2 === 0 ? 1 : -1) });
    });

    // Creature 4: Dikenli Yaban Eşekarısı #1 & #2
    createThornHornet(-4.0, 31.0, -370, enemies, extensionGroup);
    createThornHornet(4.0, 32.0, -390, enemies, extensionGroup);

    // =========================================================================
    // 🐆 5. AŞAMA (ORTA ZORLUK): GÖLGE KORİDORU & ETOBUR ÇİÇEKLER (z: -410 -> -480, Y: 28 -> 31)
    // =========================================================================
    addCheckpoint("ft_cp_s5", "5. Aşama: Gölge Koridoru & Etobur Çiçekler [Orta]", 0, 28.5, -415);
    buildExtPlatform(16, 2, 14, 0, 27.5, -415, stoneMat);

    // Overgrown temple corridor
    buildExtPlatform(10, 1.5, 50, 0, 28.0, -445, stoneMat);
    buildExtPlatform(1.5, 6, 50, -5.5, 31.0, -445, darkStoneMat);
    buildExtPlatform(1.5, 6, 50, 5.5, 31.0, -445, darkStoneMat);
    [-425, -445, -465].forEach(az => {
      buildExtPlatform(12, 1.5, 2, 0, 34.0, az, emeraldGoldMat);
      b(`ft_corridor_coin_${az}`, 0, 29.5, az, false);
    });

    // Creature 5: Gölge Orman Panteri
    createShadowPanther(0, 28.5, -450, enemies, extensionGroup);

    // Creature 6: Etobur Ağız Çiçeği #1 & #2
    createCarnivorousMaw(-2.5, 28.8, -432, enemies, extensionGroup);
    createCarnivorousMaw(2.5, 28.8, -460, enemies, extensionGroup);

    // =========================================================================
    // ⚡ 6. AŞAMA (ÇOK ZORLU / HARDCORE): ÇÖKEN SÜTUNLAR & ZEHİR FIRTINASI (z: -480 -> -550, Y: 31 -> 34)
    // =========================================================================
    addCheckpoint("ft_cp_s6", "6. Aşama: [HARDCORE] Çöken Sütunlar & Zehir Rüzgarları", 0, 31.5, -485);
    buildExtPlatform(14, 2, 12, 0, 30.5, -485, stoneMat);

    const crumbCoords = [
      { x: -3.5, z: -497, y: 31.2, w: 2.2, d: 2.2 },
      { x: 3.5, z: -506, y: 31.8, w: 2.0, d: 2.0 },
      { x: -2.0, z: -515, y: 32.4, w: 1.8, d: 1.8 },
      { x: 2.5, z: -524, y: 33.0, w: 1.8, d: 1.8 },
      { x: 0.0, z: -533, y: 33.6, w: 2.2, d: 2.2 }
    ];
    crumbCoords.forEach((cc, cIdx) => {
      const cMesh = buildExtPlatform(cc.w, 0.6, cc.d, cc.x, cc.y, cc.z, darkStoneMat);
      const coll = collidables[collidables.length - 1];
      crumblingPlatforms.push({
        mesh: cMesh,
        coll: coll,
        baseY: cc.y,
        stepped: false,
        dropTimer: 0.85,
        fallSpeed: 0,
        respawnTimer: 0
      });
      b(`ft_crumb_coin_${cIdx}`, cc.x, cc.y + 1.2, cc.z, cIdx === 2);
    });

    // Elevated Snipers: Sarmaşık Sarıcı Druid #2 & Hornet #3
    createVineEntanglerDruid(-6.0, 35.0, -510, enemies, extensionGroup, vineMat, darkStoneMat);
    createThornHornet(6.0, 36.0, -525, enemies, extensionGroup);

    // =========================================================================
    // 🔮 7. AŞAMA (ÇOK ZORLU / HARDCORE): KADİM ŞAMAN SUNAĞI & LAZERLER (z: -550 -> -630, Y: 34 -> 36)
    // =========================================================================
    addCheckpoint("ft_cp_s7", "7. Aşama: [HARDCORE] Kadim Şaman Sunağı & Totemler", 0, 34.5, -550);
    buildExtPlatform(18, 2, 16, 0, 33.5, -550, stoneMat);

    [-570, -590, -610].forEach((lz, idx) => {
      buildExtPlatform(14, 2, 10, 0, 34.0 + idx * 0.8, lz, stoneMat);
      const totem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.7, 4.0, 8),
        runeGoldMat
      );
      totem.position.set(0, 36.5 + idx * 0.8, lz);
      extensionGroup.add(totem);

      const laserGeo = new THREE.CylinderGeometry(0.12, 0.12, 12.0, 8);
      const laserMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
      const laserMesh = new THREE.Mesh(laserGeo, laserMat);
      laserMesh.rotation.z = Math.PI / 2;
      laserMesh.position.set(0, 36.0 + idx * 0.8, lz);
      extensionGroup.add(laserMesh);

      laserBeams.push({
        mesh: laserMesh,
        speed: (idx % 2 === 0 ? 1.5 : -1.5),
        y: 36.0 + idx * 0.8,
        z: lz
      });
      b(`ft_shaman_gem_${idx}`, 0, 38.5 + idx * 0.8, lz, true);
    });

    // Creature 7: Kadim Orman Şamanı
    createJungleShaman(0, 37.0, -590, enemies, extensionGroup);

    // =========================================================================
    // 👑 8. AŞAMA (SON ZİRVE - BÜYÜK BOSS ARENASI): YÜCE DOĞA TAPINAĞI (z: -630 -> -710, Y: 36)
    // =========================================================================
    addCheckpoint("ft_cp_s8", "8. Aşama: [BÜYÜK BOSS] Orman Titanı Arenası", 0, 36.5, -635);

    const arenaCenterZ = -670;
    const arenaY = 35.5;
    buildExtPlatform(64, 3, 64, 0, arenaY, arenaCenterZ, stoneMat);
    buildExtPlatform(60, 0.4, 60, 0, arenaY + 1.6, arenaCenterZ, mossMat);

    for (let p = 0; p < 8; p++) {
      const angle = (p / 8) * Math.PI * 2;
      const px = Math.cos(angle) * 27;
      const pz = arenaCenterZ + Math.sin(angle) * 27;
      buildExtPlatform(2.8, 16, 2.8, px, arenaY + 8.5, pz, darkStoneMat);
      const band = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.2, 3.0), emeraldGoldMat);
      band.position.set(px, arenaY + 12.0, pz);
      extensionGroup.add(band);
      const brazier = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 0.6, 1.0, 8), runeGoldMat);
      brazier.position.set(px, arenaY + 16.5, pz);
      extensionGroup.add(brazier);
      const torchLight = new THREE.PointLight(0x22c55e, 2.5, 18);
      torchLight.position.set(px, arenaY + 17.5, pz);
      extensionGroup.add(torchLight);
    }

    // THE FINAL BOSS: 🌿 Kadim Orman Titanı & Sarmaşık Efendisi (Stage 8 Grand Boss)
    activeTitanBoss = createAncientForestTitan(0, arenaY + 1.6, arenaCenterZ + 5, enemies, extensionGroup, stoneMat, vineMat, leafMat, heartMat);

    // Victory Exit Portal behind the Boss
    victoryExitPortal = createVictoryBeehivePortal(0, arenaY + 1.6, arenaCenterZ - 22, extensionGroup);

    console.log("✅ [Forest Temple Extension] 8 Aşama & 7 Özel Canlı Başarıyla Yerleştirildi!");
  };

  // =========================================================================
  // CREATURE CREATORS (7 YENİ CANLI MODELİ VE MEKANİĞİ)
  // =========================================================================

  // 1. 🌿 Sarmaşık Sarıcı Druid (Shoots rooting vine projectile!)
  function createVineEntanglerDruid(x, y, z, enemies, group, vineMat, darkStoneMat) {
    const THREE = window.THREE;
    const druidGroup = new THREE.Group();
    druidGroup.position.set(x, y, z);

    const robeMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.8 });
    const robe = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.85, 2.4, 8), robeMat);
    robe.position.y = 1.2;
    druidGroup.add(robe);

    const mask = new THREE.Mesh(
      new THREE.SphereGeometry(0.45, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0x78350f })
    );
    mask.position.y = 2.5;
    druidGroup.add(mask);
    const horns = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.08, 6, 12), vineMat);
    horns.position.set(0, 2.8, 0);
    horns.rotation.x = Math.PI / 2;
    druidGroup.add(horns);

    const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 3.2, 6), darkStoneMat);
    staff.position.set(0.7, 1.8, 0.4);
    staff.rotation.z = -0.15;
    druidGroup.add(staff);
    const staffOrb = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 10, 10),
      new THREE.MeshStandardMaterial({ color: 0x4ade80, emissive: 0x22c55e, emissiveIntensity: 1.5 })
    );
    staffOrb.position.set(0.7, 3.3, 0.4);
    druidGroup.add(staffOrb);

    group.add(druidGroup);

    const enemyData = {
      id: "druid_" + Math.round(z),
      type: "vine_entangler",
      name: "Sarmaşık Sarıcı Orman Druidi",
      mesh: druidGroup,
      pos: new THREE.Vector3(x, y, z),
      velocity: new THREE.Vector3(),
      hp: 60,
      maxHp: 60,
      attackPower: 8,
      isBoss: false,
      attackCooldown: 1.5,
      animTimer: 0,
      update: function(dt, playerPos, game) {
        this.animTimer += dt;
        staffOrb.rotation.y += dt * 3;
        staffOrb.position.y = 3.3 + Math.sin(this.animTimer * 4) * 0.12;

        const dist = this.pos.distanceTo(playerPos);
        if (dist < 18) {
          this.mesh.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
          if (this.attackCooldown <= 0) {
            this.attackCooldown = 4.2;
            spawnRootingVineProjectile(this.pos.clone().add(new THREE.Vector3(0, 2.8, 0)), playerPos, game);
          }
        }
      }
    };
    enemies.push(enemyData);
    customCreatures.push(enemyData);
    return enemyData;
  }

  // 2. 🐸 Zehirli Orman Kurbağası (Spore Frog)
  function createSporeFrog(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const frogGroup = new THREE.Group();
    frogGroup.position.set(x, y, z);

    const frogMat = new THREE.MeshStandardMaterial({ color: 0x4d7c0f, roughness: 0.5 });
    const bellyMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.6 });
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.85, 10, 8), frogMat);
    body.scale.set(1.1, 0.75, 1.3);
    body.position.y = 0.6;
    frogGroup.add(body);

    const belly = new THREE.Mesh(new THREE.SphereGeometry(0.65, 8, 8), bellyMat);
    belly.position.set(0, 0.45, 0.2);
    belly.scale.set(1, 0.5, 1);
    frogGroup.add(belly);

    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    [-0.45, 0.45].forEach(ex => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), eyeMat);
      eye.position.set(ex, 1.05, 0.4);
      frogGroup.add(eye);
    });

    group.add(frogGroup);

    const enemyData = {
      id: "spore_frog_" + Math.round(z),
      type: "spore_frog",
      name: "Zehirli Orman Kurbağası",
      mesh: frogGroup,
      pos: new THREE.Vector3(x, y, z),
      baseY: y,
      velocity: new THREE.Vector3(),
      hp: 45,
      maxHp: 45,
      attackPower: 10,
      isBoss: false,
      attackCooldown: 2.0,
      jumpPhase: 0,
      animTimer: 0,
      update: function(dt, playerPos, game) {
        this.animTimer += dt;
        const dist = this.pos.distanceTo(playerPos);
        if (dist < 16) {
          this.mesh.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
          this.jumpPhase += dt * 3.5;
          const hopY = Math.max(0, Math.sin(this.jumpPhase)) * 1.5;
          this.pos.y = this.baseY + hopY;

          if (dist < 8.0 && this.attackCooldown <= 0) {
            this.attackCooldown = 3.5;
            spawnSporeBurst(this.pos, game);
          }
        }
      }
    };
    enemies.push(enemyData);
    customCreatures.push(enemyData);
    return enemyData;
  }

  // 3. 🪨 Antik Taş Muhafız (Moss Rock Sentinel - Ground Pound)
  function createMossSentinel(x, y, z, enemies, group, stoneMat) {
    const THREE = window.THREE;
    const sentGroup = new THREE.Group();
    sentGroup.position.set(x, y, z);

    const body = new THREE.Mesh(new THREE.DodecahedronGeometry(1.4, 1), stoneMat);
    body.position.y = 1.3;
    sentGroup.add(body);

    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.18, 6, 6), eyeMat);
    eyeL.position.set(-0.45, 1.5, 1.1);
    sentGroup.add(eyeL);
    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.18, 6, 6), eyeMat);
    eyeR.position.set(0.45, 1.5, 1.1);
    sentGroup.add(eyeR);

    group.add(sentGroup);

    const enemyData = {
      id: "moss_sentinel_" + Math.round(z),
      type: "moss_sentinel",
      name: "Antik Taş Kaya Muhafızı",
      mesh: sentGroup,
      pos: new THREE.Vector3(x, y, z),
      baseY: y,
      velocity: new THREE.Vector3(),
      hp: 95,
      maxHp: 95,
      attackPower: 16,
      isBoss: false,
      attackCooldown: 2.5,
      animTimer: 0,
      awakened: false,
      update: function(dt, playerPos, game) {
        this.animTimer += dt;
        const dist = this.pos.distanceTo(playerPos);
        if (dist < 12.0) {
          this.awakened = true;
          this.mesh.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);

          if (this.attackCooldown <= 0) {
            this.attackCooldown = 3.8;
            spawnRockShockwave(this.pos, game);
          }
        }
      }
    };
    enemies.push(enemyData);
    customCreatures.push(enemyData);
    return enemyData;
  }

  // 4. 🦟 Dikenli Yaban Eşekarısı (Thorn Hornet)
  function createThornHornet(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const waspGroup = new THREE.Group();
    waspGroup.position.set(x, y, z);

    const abd = new THREE.Mesh(
      new THREE.ConeGeometry(0.45, 1.6, 8),
      new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.3 })
    );
    abd.rotation.x = Math.PI / 2;
    waspGroup.add(abd);

    const wingMat = new THREE.MeshBasicMaterial({ color: 0xa7f3d0, transparent: true, opacity: 0.65 });
    const wingL = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.45), wingMat);
    wingL.position.set(-0.6, 0.4, 0);
    waspGroup.add(wingL);
    const wingR = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.45), wingMat);
    wingR.position.set(0.6, 0.4, 0);
    waspGroup.add(wingR);

    group.add(waspGroup);

    const enemyData = {
      id: "thorn_hornet_" + Math.round(z),
      type: "thorn_hornet",
      name: "Dikenli Yaban Eşekarısı",
      mesh: waspGroup,
      pos: new THREE.Vector3(x, y, z),
      baseY: y,
      velocity: new THREE.Vector3(),
      hp: 40,
      maxHp: 40,
      attackPower: 9,
      isBoss: false,
      attackCooldown: 1.8,
      animTimer: 0,
      update: function(dt, playerPos, game) {
        this.animTimer += dt;
        wingL.rotation.z = Math.sin(this.animTimer * 40) * 0.4;
        wingR.rotation.z = -Math.sin(this.animTimer * 40) * 0.4;
        this.pos.y = this.baseY + Math.sin(this.animTimer * 3.5) * 0.7;

        const dist = this.pos.distanceTo(playerPos);
        if (dist < 20) {
          this.mesh.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
          if (this.attackCooldown <= 0) {
            this.attackCooldown = 3.0;
            spawnThornNeedleProjectile(this.pos, playerPos, game);
          }
        }
      }
    };
    enemies.push(enemyData);
    customCreatures.push(enemyData);
    return enemyData;
  }

  // 5. 🐆 Gölge Orman Panteri (Camouflaged Shadow Panther)
  function createShadowPanther(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const pantherGroup = new THREE.Group();
    pantherGroup.position.set(x, y, z);

    const pantherMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.3,
      transparent: true,
      opacity: 0.25
    });

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.8, 2.2), pantherMat);
    body.position.y = 0.8;
    pantherGroup.add(body);

    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 6), eyeMat);
    eyeL.position.set(-0.3, 1.1, 1.1);
    pantherGroup.add(eyeL);
    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 6), eyeMat);
    eyeR.position.set(0.3, 1.1, 1.1);
    pantherGroup.add(eyeR);

    group.add(pantherGroup);

    const enemyData = {
      id: "shadow_panther_" + Math.round(z),
      type: "shadow_panther",
      name: "Gölge Orman Panteri",
      mesh: pantherGroup,
      pos: new THREE.Vector3(x, y, z),
      velocity: new THREE.Vector3(),
      hp: 75,
      maxHp: 75,
      attackPower: 15,
      isBoss: false,
      attackCooldown: 2.0,
      stealthRevealed: false,
      animTimer: 0,
      update: function(dt, playerPos, game) {
        this.animTimer += dt;
        const dist = this.pos.distanceTo(playerPos);
        if (dist < 14.0) {
          if (!this.stealthRevealed) {
            this.stealthRevealed = true;
            pantherMat.opacity = 1.0;
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("⚠️ Gölge Panteri Pusuya Yattı! Kaç!", "warning");
            }
          }
          this.mesh.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
          const dir = playerPos.clone().sub(this.pos).normalize();
          this.pos.x += dir.x * dt * 7.5;
          this.pos.z += dir.z * dt * 7.5;

          if (dist < 2.5 && this.attackCooldown <= 0) {
            this.attackCooldown = 2.2;
            game.damagePlayer(this.attackPower);
          }
        }
      }
    };
    enemies.push(enemyData);
    customCreatures.push(enemyData);
    return enemyData;
  }

  // 6. 🌺 Etobur Ağız Çiçeği (Carnivorous Maw Plant - Snapping trap)
  function createCarnivorousMaw(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const mawGroup = new THREE.Group();
    mawGroup.position.set(x, y, z);

    const mouthMat = new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.5 });

    const upperJaw = new THREE.Mesh(new THREE.ConeGeometry(1.2, 1.4, 6), mouthMat);
    upperJaw.rotation.x = Math.PI / 3;
    upperJaw.position.set(0, 1.2, 0);
    mawGroup.add(upperJaw);

    const lowerJaw = new THREE.Mesh(new THREE.ConeGeometry(1.2, 1.4, 6), mouthMat);
    lowerJaw.rotation.x = -Math.PI / 3;
    lowerJaw.position.set(0, 0.4, 0);
    mawGroup.add(lowerJaw);

    group.add(mawGroup);

    const enemyData = {
      id: "carnivorous_maw_" + Math.round(z),
      type: "carnivorous_maw",
      name: "Etobur Ağız Çiçeği",
      mesh: mawGroup,
      pos: new THREE.Vector3(x, y, z),
      velocity: new THREE.Vector3(),
      hp: 70,
      maxHp: 70,
      attackPower: 18,
      isBoss: false,
      attackCooldown: 1.0,
      snapProgress: 0,
      update: function(dt, playerPos, game) {
        const dist = Math.hypot(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
        if (dist < 2.8 && this.attackCooldown <= 0) {
          this.attackCooldown = 2.8;
          upperJaw.rotation.x = 0;
          lowerJaw.rotation.x = 0;
          game.damagePlayer(this.attackPower);
          game.playerVel.z += 8;
          game.playerVel.y = 5;
          setTimeout(() => {
            upperJaw.rotation.x = Math.PI / 3;
            lowerJaw.rotation.x = -Math.PI / 3;
          }, 800);
        }
      }
    };
    enemies.push(enemyData);
    customCreatures.push(enemyData);
    return enemyData;
  }

  // 7. 🧙‍♂️ Kadim Orman Şamanı (Ancient Jungle Shaman - Invulnerability Shields & Wisps)
  function createJungleShaman(x, y, z, enemies, group) {
    const THREE = window.THREE;
    const shamanGroup = new THREE.Group();
    shamanGroup.position.set(x, y, z);

    const robeMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.7 });
    const robe = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.9, 2.5, 8), robeMat);
    robe.position.y = 1.25;
    shamanGroup.add(robe);

    const featherMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
    for (let f = 0; f < 5; f++) {
      const feather = new THREE.Mesh(new THREE.ConeGeometry(0.12, 1.2, 4), featherMat);
      feather.position.set((f - 2) * 0.22, 2.8, 0);
      shamanGroup.add(feather);
    }

    const staff = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 3.8, 8),
      new THREE.MeshStandardMaterial({ color: 0x78350f })
    );
    staff.position.set(0.8, 1.8, 0.4);
    shamanGroup.add(staff);

    const shieldBubble = new THREE.Mesh(
      new THREE.SphereGeometry(6.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.35, wireframe: true })
    );
    shieldBubble.position.y = 2.0;
    shamanGroup.add(shieldBubble);

    group.add(shamanGroup);

    const enemyData = {
      id: "jungle_shaman_" + Math.round(z),
      type: "jungle_shaman",
      name: "Kadim Orman Şamanı",
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
        shieldBubble.rotation.y += dt * 1.5;
        this.pos.y = this.baseY + Math.sin(this.animTimer * 2.5) * 0.5;

        const dist = this.pos.distanceTo(playerPos);
        if (dist < 22.0) {
          this.mesh.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);
          if (this.attackCooldown <= 0) {
            this.attackCooldown = 4.0;
            spawnHomingForestWisp(this.pos, playerPos, game);
          }
        }
      }
    };
    enemies.push(enemyData);
    customCreatures.push(enemyData);
    return enemyData;
  }

  // =========================================================================
  // 👑 BÜYÜK BOSS: KADİM ORMAN TİTANI & SARMAŞIK EFENDİSİ (Stage 8)
  // =========================================================================
  function createAncientForestTitan(x, y, z, enemies, group, stoneMat, vineMat, leafMat, heartMat) {
    const THREE = window.THREE;
    const titanGroup = new THREE.Group();
    titanGroup.name = "boss_ancient_forest_titan";
    titanGroup.position.set(x, y, z);

    // Massive Colossus Trunk Body (3x scale)
    const trunkMesh = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 3.2, 8.5, 12), stoneMat);
    trunkMesh.position.y = 4.25;
    titanGroup.add(trunkMesh);

    // Glowing Emerald Heart Core
    const heartMesh = new THREE.Mesh(new THREE.SphereGeometry(1.6, 16, 16), heartMat);
    heartMesh.position.set(0, 5.0, 1.8);
    titanGroup.add(heartMesh);

    for (let vIdx = 0; vIdx < 12; vIdx++) {
      const angle = (vIdx / 12) * Math.PI * 2;
      const vineCoil = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.35, 8, 20), vineMat);
      vineCoil.position.set(Math.cos(angle) * 0.4, 2.2 + vIdx * 0.55, Math.sin(angle) * 0.4);
      vineCoil.rotation.x = Math.PI / 3;
      vineCoil.rotation.y = angle;
      titanGroup.add(vineCoil);
    }

    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(2.2, 12, 12), stoneMat);
    headMesh.position.y = 9.5;
    titanGroup.add(headMesh);

    const armMat = vineMat;
    const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.5, 7.5, 8), armMat);
    leftArm.position.set(-4.2, 6.5, 1.0);
    leftArm.rotation.z = Math.PI / 4;
    titanGroup.add(leftArm);

    const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.5, 7.5, 8), armMat);
    rightArm.position.set(4.2, 6.5, 1.0);
    rightArm.rotation.z = -Math.PI / 4;
    titanGroup.add(rightArm);

    group.add(titanGroup);

    const bossData = {
      id: "boss_vine_guardian",
      type: "vine_boss",
      name: "Kadim Orman Titanı & Sarmaşık Efendisi (Büyük Boss 🌿)",
      mesh: titanGroup,
      pos: new THREE.Vector3(x, y, z),
      velocity: new THREE.Vector3(),
      hp: 450,
      maxHp: 450,
      attackPower: 18,
      isBoss: true,
      attackCooldown: 2.0,
      animTimer: 0,
      state: "chase",
      update: function(dt, playerPos, game) {
        this.animTimer += dt;
        heartMesh.scale.setScalar(1.0 + Math.sin(this.animTimer * 5) * 0.15);
        leftArm.rotation.x = Math.sin(this.animTimer * 3) * 0.5;
        rightArm.rotation.x = -Math.sin(this.animTimer * 3) * 0.5;

        const dist = this.pos.distanceTo(playerPos);
        if (dist < 45.0) {
          this.mesh.rotation.y = Math.atan2(playerPos.x - this.pos.x, playerPos.z - this.pos.z);

          if (this.attackCooldown <= 0) {
            this.attackCooldown = 3.2;
            const roll = Math.random();
            if (roll < 0.45) {
              spawnRockShockwave(this.pos, game, 9.0);
              if (window.St && window.St.playHammerSlam) window.St.playHammerSlam();
            } else if (roll < 0.75) {
              spawnRootingVineProjectile(this.pos.clone().add(new THREE.Vector3(0, 5, 0)), playerPos, game);
            } else {
              spawnSporeBurst(this.pos, game);
            }
          }
        }
      }
    };
    enemies.push(bossData);
    return bossData;
  }

  // =========================================================================
  // VICTORY EXIT PORTAL TO CHAPTER 3 (BEEHIVE)
  // =========================================================================
  function createVictoryBeehivePortal(x, y, z, group) {
    const THREE = window.THREE;
    const portalGroup = new THREE.Group();
    portalGroup.name = "forest_temple_stage8_victory_portal";
    portalGroup.position.set(x, y, z);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.2, 0.45, 16, 32),
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 1.8,
        metalness: 0.8
      })
    );
    ring.position.y = 3.2;
    portalGroup.add(ring);

    const vortex = new THREE.Mesh(
      new THREE.CircleGeometry(3.0, 32),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
    );
    vortex.position.y = 3.2;
    portalGroup.add(vortex);

    const pilMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
    const pL = new THREE.Mesh(new THREE.BoxGeometry(0.9, 6.5, 0.9), pilMat);
    pL.position.set(-3.2, 3.25, 0);
    portalGroup.add(pL);
    const pR = new THREE.Mesh(new THREE.BoxGeometry(0.9, 6.5, 0.9), pilMat);
    pR.position.set(3.2, 3.25, 0);
    portalGroup.add(pR);

    group.add(portalGroup);

    return {
      mesh: portalGroup,
      pos: new THREE.Vector3(x, y, z),
      targetRegion: "beehive"
    };
  }

  // =========================================================================
  // PROJECTILES & HAZARD SPAWNERS
  // =========================================================================

  // 1. 🌿 ROOTING VINE PROJECTILE (Causes 3-second movement freeze!)
  function spawnRootingVineProjectile(fromPos, toPos, game) {
    if (!window.THREE || !game || !game.scene) return;
    const THREE = window.THREE;
    const projMesh = new THREE.Group();
    const vineMat = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      emissive: 0x22c55e,
      emissiveIntensity: 1.5,
      roughness: 0.4
    });
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.45 + i * 0.1, 0.08, 6, 12), vineMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = (i - 1) * 0.25;
      projMesh.add(ring);
    }
    projMesh.position.copy(fromPos);
    game.scene.add(projMesh);

    const dir = toPos.clone().sub(fromPos).normalize();
    activeProjectiles.push({
      mesh: projMesh,
      pos: fromPos.clone(),
      dir: dir,
      speed: 13.5,
      life: 2.8,
      type: "rooting_vine",
      update: function(dt) {
        this.life -= dt;
        this.pos.add(this.dir.clone().multiplyScalar(this.speed * dt));
        this.mesh.position.copy(this.pos);
        this.mesh.rotation.y += dt * 6;

        if (game.playerPos && this.pos.distanceTo(game.playerPos) < 2.0) {
          if (typeof game.entanglePlayer === 'function') {
            game.entanglePlayer(3.0);
          } else if (typeof window.__entanglePlayer === 'function') {
            window.__entanglePlayer(3.0);
          }
          this.life = -1;
        }
      }
    });
  }

  // 2. 🐸 Toxic Spore Burst
  function spawnSporeBurst(pos, game) {
    if (!window.THREE || !game || !game.scene) return;
    const THREE = window.THREE;
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const sMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0x84cc16, emissive: 0x4d7c0f, emissiveIntensity: 1.2, transparent: true, opacity: 0.8 })
      );
      sMesh.position.set(pos.x, pos.y + 1.0, pos.z);
      game.scene.add(sMesh);
      activeProjectiles.push({
        mesh: sMesh,
        pos: sMesh.position.clone(),
        dir: new THREE.Vector3(Math.cos(angle), 0.2, Math.sin(angle)),
        speed: 6.0,
        life: 2.0,
        type: "spore",
        update: function(dt) {
          this.life -= dt;
          this.pos.add(this.dir.clone().multiplyScalar(this.speed * dt));
          this.mesh.position.copy(this.pos);
          if (game.playerPos && this.pos.distanceTo(game.playerPos) < 1.8) {
            game.damagePlayer(10);
            this.life = -1;
          }
        }
      });
    }
  }

  // 3. 🪨 Expanding Rock Shockwave
  function spawnRockShockwave(pos, game, maxRadius = 7.5) {
    if (!window.THREE || !game || !game.scene) return;
    const THREE = window.THREE;
    const waveMesh = new THREE.Mesh(
      new THREE.RingGeometry(0.8, 1.4, 24),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide })
    );
    waveMesh.rotation.x = -Math.PI / 2;
    waveMesh.position.set(pos.x, pos.y + 0.15, pos.z);
    game.scene.add(waveMesh);

    let radius = 1.0;
    activeProjectiles.push({
      mesh: waveMesh,
      pos: pos.clone(),
      life: 1.2,
      type: "shockwave",
      update: function(dt) {
        this.life -= dt;
        radius += dt * 6.5;
        this.mesh.scale.set(radius, radius, 1);
        if (game.playerPos && game.isGrounded) {
          const d = Math.hypot(game.playerPos.x - this.pos.x, game.playerPos.z - this.pos.z);
          if (Math.abs(d - radius) < 1.4) {
            game.damagePlayer(14);
            game.playerVel.y = 10.0;
          }
        }
      }
    });
  }

  // 4. 🦟 Hornet Thorn Needle
  function spawnThornNeedleProjectile(fromPos, toPos, game) {
    if (!window.THREE || !game || !game.scene) return;
    const THREE = window.THREE;
    const needle = new THREE.Mesh(
      new THREE.ConeGeometry(0.18, 0.9, 6),
      new THREE.MeshBasicMaterial({ color: 0xdc2626 })
    );
    needle.position.copy(fromPos);
    game.scene.add(needle);
    const dir = toPos.clone().sub(fromPos).normalize();
    activeProjectiles.push({
      mesh: needle,
      pos: fromPos.clone(),
      dir: dir,
      speed: 16.0,
      life: 2.2,
      update: function(dt) {
        this.life -= dt;
        this.pos.add(this.dir.clone().multiplyScalar(this.speed * dt));
        this.mesh.position.copy(this.pos);
        if (game.playerPos && this.pos.distanceTo(game.playerPos) < 1.6) {
          game.damagePlayer(9);
          this.life = -1;
        }
      }
    });
  }

  // 5. 🔮 Shaman Homing Wisp
  function spawnHomingForestWisp(fromPos, toPos, game) {
    if (!window.THREE || !game || !game.scene) return;
    const THREE = window.THREE;
    const wisp = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x34d399 })
    );
    wisp.position.copy(fromPos);
    game.scene.add(wisp);
    activeProjectiles.push({
      mesh: wisp,
      pos: fromPos.clone(),
      speed: 8.5,
      life: 3.2,
      update: function(dt) {
        this.life -= dt;
        if (game.playerPos) {
          const targetDir = game.playerPos.clone().sub(this.pos).normalize();
          this.pos.add(targetDir.multiplyScalar(this.speed * dt));
        }
        this.mesh.position.copy(this.pos);
        if (game.playerPos && this.pos.distanceTo(game.playerPos) < 1.8) {
          game.damagePlayer(12);
          this.life = -1;
        }
      }
    });
  }

  // =========================================================================
  // TICK UPDATE LOOP (Moving Platforms, Rotating Hazards, Projectiles, Victory Portal)
  // =========================================================================
  let totalTime = 0;
  function updateForestTempleExtension(dt) {
    const game = window.__superBearGame;
    if (!game || game.currentRegion !== 'forest_temple') return;
    totalTime += dt;

    // 1. Moving Platforms
    movingPlatforms.forEach(mp => {
      const offX = Math.sin(totalTime * mp.speed + mp.offset) * mp.rangeX;
      mp.mesh.position.x = mp.baseX + offX;
      if (mp.coll) {
        mp.coll.min.x = mp.baseX + offX - 2.25;
        mp.coll.max.x = mp.baseX + offX + 2.25;
      }
    });

    // 2. Crumbling Platforms
    if (game.playerPos) {
      crumblingPlatforms.forEach(cp => {
        if (!cp.stepped) {
          const d = Math.hypot(game.playerPos.x - cp.mesh.position.x, game.playerPos.z - cp.mesh.position.z);
          if (d < 1.8 && Math.abs(game.playerPos.y - cp.baseY) < 1.2) {
            cp.stepped = true;
          }
        } else if (cp.dropTimer > 0) {
          cp.dropTimer -= dt;
          cp.mesh.position.x += (Math.random() - 0.5) * 0.15;
          if (cp.dropTimer <= 0) {
            if (cp.coll) cp.coll.min.y = -999;
          }
        } else {
          cp.fallSpeed += dt * 25.0;
          cp.mesh.position.y -= cp.fallSpeed * dt;
          cp.respawnTimer += dt;
          if (cp.respawnTimer > 4.5) {
            cp.stepped = false;
            cp.dropTimer = 0.85;
            cp.fallSpeed = 0;
            cp.respawnTimer = 0;
            cp.mesh.position.y = cp.baseY;
            if (cp.coll) cp.coll.min.y = cp.baseY - 0.3;
          }
        }
      });
    }

    // 3. Rotating Logs & Pendulums
    rotatingHazardLogs.forEach(rh => {
      if (rh.type === "log") {
        rh.group.rotation.x += dt * rh.speed;
        if (game.playerPos && rh.group.position.distanceTo(game.playerPos) < 2.2) {
          game.damagePlayer(12);
        }
      } else if (rh.type === "pendulum") {
        rh.group.rotation.z = Math.sin(totalTime * 2.2 + rh.group.userData.swingOffset) * 0.75;
      }
    });

    // 4. Laser Beams (Stage 7)
    laserBeams.forEach(lb => {
      lb.mesh.rotation.y += dt * lb.speed;
      if (game.playerPos) {
        const d = Math.hypot(game.playerPos.x - lb.mesh.position.x, game.playerPos.z - lb.z);
        if (d < 6.0 && Math.abs(game.playerPos.y - lb.y) < 1.5) {
          const pAngle = Math.atan2(game.playerPos.z - lb.z, game.playerPos.x - lb.mesh.position.x);
          let diff = Math.abs(pAngle - lb.mesh.rotation.y) % (Math.PI * 2);
          if (diff < 0.25 || Math.abs(diff - Math.PI) < 0.25) {
            game.damagePlayer(15);
          }
        }
      }
    });

    // 5. Active Projectiles
    for (let i = activeProjectiles.length - 1; i >= 0; i--) {
      const p = activeProjectiles[i];
      p.update(dt);
      if (p.life <= 0) {
        if (p.mesh && p.mesh.parent) p.mesh.parent.remove(p.mesh);
        activeProjectiles.splice(i, 1);
      }
    }

    // 6. Stage 8 Victory Exit Portal Interaction
    if (victoryExitPortal && game.playerPos) {
      victoryExitPortal.mesh.rotation.y += dt * 0.8;
      const d = victoryExitPortal.pos.distanceTo(game.playerPos);
      if (d < 3.8) {
        const isBossAlive = (game.currentLevel && game.currentLevel.enemies || []).some(
          e => e && e.id === "boss_vine_guardian" && e.hp > 0
        );
        if (isBossAlive) {
          const now = Date.now();
          if (!victoryExitPortal._lastNotice || now - victoryExitPortal._lastNotice > 2500) {
            victoryExitPortal._lastNotice = now;
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("⚠️ Bal Kovanı portalından geçmek için önce Kadim Orman Titanı'nı yenmelisin! ⚔️", "warning");
            }
          }
        } else {
          if (!victoryExitPortal._triggered) {
            victoryExitPortal._triggered = true;
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("🌀 3. Bölüm: Vızıldıyan Bal Kovanı'na Geçiliyor! 🐝", "success");
            }
            setTimeout(() => {
              game.loadRegion("beehive");
            }, 800);
          }
        }
      }
    }
  }

  // =========================================================================
  // CLEANUP & MEMORY DISPOSAL
  // =========================================================================
  function cleanUpForestTempleExtension(game) {
    if (!game) game = window.__superBearGame;
    activeProjectiles.forEach(p => {
      if (p.mesh && p.mesh.parent) p.mesh.parent.remove(p.mesh);
    });
    activeProjectiles = [];

    if (extensionGroup) {
      extensionGroup.traverse(obj => {
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
      if (extensionGroup.parent) extensionGroup.parent.remove(extensionGroup);
      extensionGroup = null;
    }
    movingPlatforms = [];
    crumblingPlatforms = [];
    rotatingHazardLogs = [];
    laserBeams = [];
    customCreatures = [];
    activeTitanBoss = null;
    victoryExitPortal = null;
    console.log("🧹 [Forest Temple Extension] Bellek başarıyla temizlendi (Disposed).");
  }

  function initForestTempleTicker() {
    const game = window.__superBearGame;
    if (game && !game._forestTempleTickerHooked) {
      game._forestTempleTickerHooked = true;
      const origUpdate = game.update;
      game.update = function(dt, totalTime) {
        origUpdate.call(this, dt, totalTime);
        try {
          updateForestTempleExtension(dt);
        } catch(err) {}
      };
    }
  }

  window.addEventListener('superbear:region-changed', (e) => {
    const newReg = e.detail;
    if (newReg !== 'forest_temple') {
      cleanUpForestTempleExtension();
    }
  });

  const tickerInterval = setInterval(() => {
    if (window.__superBearGame) {
      initForestTempleTicker();
      clearInterval(tickerInterval);
    }
  }, 100);

  window.__cleanUpForestTempleExtension = cleanUpForestTempleExtension;
  window.__updateForestTempleExtension = updateForestTempleExtension;
  console.log("🏛️ [Forest Temple Extension] Script Loaded & Ready!");
})();
