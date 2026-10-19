// ============================================================================
// 🌋 6. BÖLÜM: VOLKANİK EJDERHA MAĞARASI GENİŞLETMESİ (8 ZORLU AŞAMA & 10 ÖZEL CANLI)
// - Boss (Kızıl Alev Ejderhası Ignis) ilk yerinden kaldırıldı, 8. Aşamadaki Yüce Obsidyen Zirvesi'ne taşındı!
// - Boss'un tüm özellikleri, şekli, HP ve saldırıları birebir aynı korundu!
// - 8 Çok Zorlu Aşama & Özel Platformlar:
//     * 1. Aşama: Obsidyen Lav Girişi & Kayan Bazalt Blokları [Çok Zorlu]
//     * 2. Aşama: 2 Saniye Bekleyince Patlayan Magma Platformları [Çok Zorlu]
//     * 3. Aşama: Püsküren Patlayan Alev Gayzerleri [Çok Zorlu]
//     * 4. Aşama: Lav Şelalesi Ateş Köprüleri & Dönen Ateş Değirmenleri [Çok Zorlu]
//     * 5. Aşama: Eriyip Çöken Kırmızı Sıcak Kömür Platformları [Çok Zorlu]
//     * 6. Aşama: Magma Lav Tüneli & Ateş Topu Yağmuru [Çok Zorlu]
//     * 7. Aşama: Kızgın Ejderha Alev Kanyonu & Lazer Izgaraları [Çok Zorlu]
//     * 8. Aşama: [BÜYÜK BOSS ARENASI] Yüce Obsidyen Zirvesi & Kızıl Alev Ejderhası Ignis!
// - 10 Özel Yeni Canlı ve Mekanikleri:
//     1. 🐉 Magma Yavru Ejderhası (Ateş nefesi üfler)
//     2. 🦖 Obsidyen Lav Ejderhası T-Rex (Yere vurup lav dalgası yayar)
//     3. 🔥 Kızıl Alev Drake (Hızlı uçup havadan ateş topu atar)
//     4. 🌋 Volkanik Magma Golemi (Yumruk atınca etrafa lav pınarları fışkırtır)
//     5. 🦇 Obsidyen Ateş Yarasası (Tavandan dalış yapıp yakar)
//     6. 🦎 Lav Kertenkelesi Salamander (Hızlı koşan ateşli yaratık)
//     7. 🧙‍♂️ Ateş Şamanı & Lav Ruhu (Kalkan açar ve güdümlü ateş küreleri fırlatır)
//     8. 🦅 Anka Alev Kuşu (Kanat çırparak sıcak rüzgar fırtınası yaratır)
//     9. 🦂 Magma Akrebi (Kuyruğundan lav iğnesi fırlatır)
//     10. 🐉 Zırhlı Obsidyen Ejderha Muhafızı (Yüksek zırhlı ve güçlü alev darbesi vurur)
// ============================================================================

(function() {
  'use strict';

  let volcanoExtensionGroup = null;
  let activeVolcanoProjectiles = [];
  let volcanoDelayPlatforms = [];
  let volcanoGeysers = [];
  let volcanoFireMills = [];
  let volcanoCrumblingCrusts = [];
  let volcanoLavaFloes = [];
  let volcanoCustomCreatures = [];
  let activeVolcanoBoss = null;
  let volcanoVictoryPortal = null;
  let volcanoPopulated = false;

  // Helper to burn/damage player with fire effect
  window.__volcanoBurnPlayer = function(dmg = 20) {
    const game = window.__superBearGame;
    if (!game || game._isVolcanoBurned) return;
    game._isVolcanoBurned = true;
    game.damagePlayer(dmg);
    game.spawnSparkleParticles(game.playerPos, 30, 0xf97316);
    if (game.callbacks && game.callbacks.onShowNotice) {
      game.callbacks.onShowNotice("🔥 MAGMA YANIĞI! Ateş Hasarı Aldın! 🌋", "warning");
    }
    setTimeout(() => {
      game._isVolcanoBurned = false;
    }, 1200);
  };

  function buildDragonMesh(bodyColor, wingColor, eyeColor) {
    const THREE = window.THREE;
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.3, metalness: 0.6 });
    const wingMat = new THREE.MeshStandardMaterial({ color: wingColor, roughness: 0.4, emissive: 0x9a3412, emissiveIntensity: 0.4 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor, emissive: eyeColor, emissiveIntensity: 1.0 });

    // Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 2.0), bodyMat);
    torso.position.y = 0.9;
    torso.castShadow = true;
    group.add(torso);

    // Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 1.1), bodyMat);
    head.position.set(0, 1.6, 1.2);
    head.castShadow = true;
    group.add(head);

    // Eyes
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), eyeMat);
    eyeL.position.set(-0.3, 1.8, 1.5);
    group.add(eyeL);
    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), eyeMat);
    eyeR.position.set(0.3, 1.8, 1.5);
    group.add(eyeR);

    // Wings
    const wingL = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.1, 1.2), wingMat);
    wingL.position.set(-1.3, 1.4, 0);
    wingL.rotation.z = 0.2;
    group.add(wingL);
    const wingR = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.1, 1.2), wingMat);
    wingR.position.set(1.3, 1.4, 0);
    wingR.rotation.z = -0.2;
    group.add(wingR);

    // Tail
    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.3, 2.5, 8), bodyMat);
    tail.position.set(0, 0.8, -1.6);
    tail.rotation.x = Math.PI / 4;
    group.add(tail);

    return group;
  }

  window.__populateVolcanoDragonExtension = function(
    sceneGroup, collidables, platforms, enemies, items, easels, npcs,
    checkpoints, addCheckpoint, R, b, S, T, z, v, U, N, B, A
  ) {
    if (!window.THREE) return;
    const THREE = window.THREE;
    if (volcanoPopulated) return;
    volcanoPopulated = true;

    console.log("🌋 [Volcano Dragon Extension] 8 Zorlu Aşama ve 10 Özel Canlı Oluşturuluyor...");

    const gameInstance = window.__superBearGame;
    if (gameInstance && gameInstance.currentLevel && gameInstance.currentLevel.bounds) {
      gameInstance.currentLevel.bounds.minZ = -1300;
      gameInstance.currentLevel.bounds.maxZ = 120;
      gameInstance.currentLevel.bounds.minX = -350;
      gameInstance.currentLevel.bounds.maxX = 350;
      gameInstance.currentLevel.bounds.minY = -50;
      gameInstance.currentLevel.bounds.maxY = 350;
    }

    volcanoExtensionGroup = new THREE.Group();
    volcanoExtensionGroup.name = "volcano_cave_8_stages_extension";
    sceneGroup.add(volcanoExtensionGroup);

    activeVolcanoProjectiles = [];
    volcanoDelayPlatforms = [];
    volcanoGeysers = [];
    volcanoFireMills = [];
    volcanoCrumblingCrusts = [];
    volcanoLavaFloes = [];
    volcanoCustomCreatures = [];
    activeVolcanoBoss = null;
    volcanoVictoryPortal = null;

    // Materials
    const obsidianMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.2, metalness: 0.8 });
    const magmaCoreMat = new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xea580c, emissiveIntensity: 0.9, roughness: 0.1 });
    const redHotMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, emissive: 0xb91c1c, emissiveIntensity: 0.8, roughness: 0.3 });
    const basaltMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.5, metalness: 0.4 });
    const dragonGoldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.7, roughness: 0.2, metalness: 0.9 });

    // Helper for stage platform
    function addVolcanoPlatform(x, y, zPos, w, h, d, mat = obsidianMat) {
      const geo = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, zPos);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      volcanoExtensionGroup.add(mesh);
      collidables.push({
        min: new THREE.Vector3(x - w / 2, y - h / 2, zPos - d / 2),
        max: new THREE.Vector3(x + w / 2, y + h / 2, zPos + d / 2)
      });
      return mesh;
    }

    // =========================================================================
    // 8 ZORLU AŞAMA & ÖZEL PLATFORMLAR (z: -100 to -1200)
    // =========================================================================

    // --- AŞAMA 1: Obsidyen Lav Girişi & Kayan Bazalt Blokları (z: -100 -> -240) ---
    addCheckpoint("volcano_ext_cp_1", "1. Aşama: Obsidyen Lav Girişi", 0, 3, -120);
    [
      {x: 0, y: 1.5, z: -150, w: 10, h: 1.2, d: 14},
      {x: -6, y: 2.2, z: -180, w: 6, h: 1.2, d: 8},
      {x: 6, y: 3.0, z: -210, w: 6, h: 1.2, d: 8},
      {x: 0, y: 3.8, z: -240, w: 12, h: 1.2, d: 14}
    ].forEach((p, idx) => {
      addVolcanoPlatform(p.x, p.y, p.z, p.w, p.h, p.d, basaltMat);
      if (idx % 2 === 0) S(p.x, p.y + 1, p.z, 20);
      b(`volcano_gem_1_${idx}`, p.x, p.y + 2.2, p.z, true);
    });

    // --- AŞAMA 2: 2 Saniye Bekleyince Patlayan Magma Platformları (z: -260 -> -400) ---
    addCheckpoint("volcano_ext_cp_2", "2. Aşama: Patlayan Magma Platformları", 0, 4, -270);
    for (let i = 0; i < 4; i++) {
      const zPos = -290 - i * 35;
      const xPos = (i % 2 === 0) ? -5 : 5;
      const mesh = addVolcanoPlatform(xPos, 4.5 + i * 0.4, zPos, 5.5, 1.0, 5.5, redHotMat);
      volcanoDelayPlatforms.push({
        mesh: mesh,
        baseY: 4.5 + i * 0.4,
        zPos: zPos,
        xPos: xPos,
        stepped: false,
        timer: 2.0,
        exploded: false,
        collIndex: collidables.length - 1
      });
      S(xPos, 5.5 + i * 0.4, zPos, 21);
    }

    // --- AŞAMA 3: Püsküren Patlayan Alev Gayzerleri (z: -420 -> -560) ---
    addCheckpoint("volcano_ext_cp_3", "3. Aşama: Püsküren Alev Gayzerleri", 0, 5, -430);
    [
      {x: 0, z: -460}, {x: -8, z: -500}, {x: 8, z: -540}, {x: 0, z: -560}
    ].forEach((g, idx) => {
      addVolcanoPlatform(g.x, 6, g.z, 8, 1.2, 8, obsidianMat);
      const geyserGroup = new THREE.Group();
      geyserGroup.position.set(g.x, 7, g.z);
      const core = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 0.6, 12), magmaCoreMat);
      geyserGroup.add(core);
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 4.0, 8), redHotMat);
      pillar.position.y = 2.0;
      geyserGroup.add(pillar);
      volcanoExtensionGroup.add(geyserGroup);
      volcanoGeysers.push({ group: geyserGroup, pos: new THREE.Vector3(g.x, 7, g.z), timer: idx * 0.8, active: false });
      b(`volcano_gem_3_${idx}`, g.x, 8.5, g.z, true);
    });

    // --- AŞAMA 4: Lav Şelalesi & Dönen Ateş Değirmenleri (z: -580 -> -720) ---
    addCheckpoint("volcano_ext_cp_4", "4. Aşama: Dönen Ateş Değirmenleri", 0, 7, -590);
    [
      {x: 0, z: -620}, {x: -6, z: -670}, {x: 6, z: -720}
    ].forEach((m, idx) => {
      addVolcanoPlatform(m.x, 8, m.z, 9, 1.2, 9, basaltMat);
      const millGroup = new THREE.Group();
      millGroup.position.set(m.x, 9.5, m.z);
      const blade1 = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.3, 0.8), magmaCoreMat);
      const blade2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 6.0), magmaCoreMat);
      millGroup.add(blade1);
      millGroup.add(blade2);
      volcanoExtensionGroup.add(millGroup);
      volcanoFireMills.push({ group: millGroup, speed: 2.5 + idx * 0.5 });
      S(m.x, 9.5, m.z, 22);
    });

    // --- AŞAMA 5: Eriyip Çöken Kırmızı Sıcak Kömür Platformları (z: -740 -> -860) ---
    addCheckpoint("volcano_ext_cp_5", "5. Aşama: Çöken Sıcak Kömür Köprüleri", 0, 9, -750);
    for (let c = 0; c < 5; c++) {
      const zPos = -780 - c * 25;
      const xPos = (c % 2 === 0)? -4 : 4;
      const mesh = addVolcanoPlatform(xPos, 10, zPos, 5, 0.8, 5, redHotMat);
      volcanoCrumblingCrusts.push({
        mesh: mesh,
        baseY: 10,
        stepped: false,
        dropTimer: 0.6,
        fallSpeed: 0,
        respawnTimer: 0,
        collIndex: collidables.length - 1
      });
      b(`volcano_gem_5_${c}`, xPos, 11.2, zPos, true);
    }

    // --- AŞAMA 6: Magma Lav Tüneli & Ateş Topu Yağmuru (z: -880 -> -980) ---
    addCheckpoint("volcano_ext_cp_6", "6. Aşama: Magma Tüneli & Ateş Yağmuru", 0, 11, -890);
    [
      {x: 0, z: -920}, {x: -5, z: -950}, {x: 5, z: -980}
    ].forEach((t, idx) => {
      addVolcanoPlatform(t.x, 12, t.z, 10, 1.2, 12, obsidianMat);
      S(t.x, 13.2, t.z, 23);
      b(`volcano_gem_6_${idx}`, t.x, 14, t.z, true);
    });

    // --- AŞAMA 7: Kızgın Ejderha Alev Kanyonu & Lazer Izgaraları (z: -1000 -> -1080) ---
    addCheckpoint("volcano_ext_cp_7", "7. Aşama: Ejderha Alev Kanyonu", 0, 13, -1010);
    addVolcanoPlatform(0, 14, -1040, 14, 1.5, 14, basaltMat);
    addVolcanoPlatform(0, 14, -1070, 14, 1.5, 14, obsidianMat);
    S(0, 15.5, -1055, 24);

    // --- AŞAMA 8: [BÜYÜK BOSS ARENASI] Yüce Obsidyen Zirvesi & Kızıl Alev Ejderhası Ignis! (z: -1100) ---
    addCheckpoint("volcano_ext_cp_8", "8. Aşama: [BOSS ARENASI] Yüce Obsidyen Zirvesi 🌋", 0, 15, -1090);
    const arenaMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.1, metalness: 0.9, emissive: 0x451a03 });
    const arena = new THREE.Mesh(new THREE.CylinderGeometry(32, 34, 2.5, 32), arenaMat);
    arena.position.set(0, 14, -1120);
    arena.receiveShadow = true;
    volcanoExtensionGroup.add(arena);
    collidables.push({
      min: new THREE.Vector3(-32, 12.75, -1152),
      max: new THREE.Vector3(32, 15.25, -1088)
    });
    S(0, 15.5, -1120, 25);

    // Relocate Red Flame Dragon Ignis Boss to Arena
    const bossGroup = buildDragonMesh(0x7c2d12, 0xea580c, 0xfef08a);
    bossGroup.position.set(0, 15.2, -1120);
    bossGroup.scale.set(2.2, 2.2, 2.2);
    volcanoExtensionGroup.add(bossGroup);

    activeVolcanoBoss = {
      id: "boss_volcano_ignis",
      type: "volcano_boss",
      name: "Kızıl Alev Ejderhası Ignis (Yüce Boss 🌋)",
      mesh: bossGroup,
      pos: new THREE.Vector3(0, 15.2, -1120),
      velocity: new THREE.Vector3(),
      hp: 500,
      maxHp: 500,
      attackPower: 22,
      isBoss: true,
      attackCooldown: 0,
      state: "chase",
      animTimer: 0
    };
    enemies.push(activeVolcanoBoss);

    // Victory Portal behind the boss leading to 7. Bölüm (underwater_palace)
    const portalGroup = new THREE.Group();
    portalGroup.position.set(0, 16.5, -1155);
    const ringMesh = new THREE.Mesh(
      new THREE.TorusGeometry(3.2, 0.35, 16, 32),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 1.0 })
    );
    portalGroup.add(ringMesh);
    const vortexMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.85 });
    const vortexMesh = new THREE.Mesh(new THREE.CircleGeometry(3.0, 32), vortexMat);
    portalGroup.add(vortexMesh);
    volcanoExtensionGroup.add(portalGroup);

    volcanoVictoryPortal = {
      mesh: portalGroup,
      vortexMesh: vortexMesh,
      pos: new THREE.Vector3(0, 16.5, -1155),
      targetRegion: "underwater_palace",
      regionName: "7. Bölüm: Antik Su Altı Kristal Sarayı"
    };
    gameInstance.currentLevel.nextPortal = volcanoVictoryPortal;

    // =========================================================================
    // 10 ÖZEL VOLKANİK CANLI & EJDERHA
    // =========================================================================
    const creatureSpawns = [
      {pos: new THREE.Vector3(-4, 3, -160), name: "Magma Yavru Ejderhası 🐉", type: "magma_dragon", hp: 60, ap: 10},
      {pos: new THREE.Vector3(4, 3, -200), name: "Obsidyen Lav T-Rex 🦖", type: "lava_trex", hp: 120, ap: 16},
      {pos: new THREE.Vector3(-6, 5, -280), name: "Kızıl Alev Drake 🔥", type: "flame_drake", hp: 80, ap: 12},
      {pos: new THREE.Vector3(6, 6, -340), name: "Volkanik Magma Golemi 🌋", type: "magma_golem", hp: 160, ap: 18},
      {pos: new THREE.Vector3(0, 8, -450), name: "Obsidyen Ateş Yarasası 🦇", type: "fire_bat", hp: 50, ap: 9},
      {pos: new THREE.Vector3(-7, 9, -520), name: "Lav Kertenkelesi Salamander 🦎", type: "salamander", hp: 70, ap: 11},
      {pos: new THREE.Vector3(7, 10, -650), name: "Ateş Şamanı & Lav Ruhu 🧙‍♂️", type: "fire_shaman", hp: 90, ap: 14},
      {pos: new THREE.Vector3(0, 11, -760), name: "Anka Alev Kuşu 🦅", type: "phoenix_bird", hp: 110, ap: 15},
      {pos: new THREE.Vector3(-5, 12, -880), name: "Magma Akrebi 🦂", type: "magma_scorpion", hp: 85, ap: 13},
      {pos: new THREE.Vector3(5, 13, -980), name: "Zırhlı Obsidyen Ejderha Muhafızı 🛡️🐉", type: "armored_dragon", hp: 200, ap: 20}
    ];

    creatureSpawns.forEach((cs, idx) => {
      const cMesh = buildDragonMesh(0x9a3412, 0xc2410c, 0xfef08a);
      cMesh.position.copy(cs.pos);
      cMesh.scale.set(0.9, 0.9, 0.9);
      volcanoExtensionGroup.add(cMesh);

      const enemyObj = {
        id: `volcano_creature_${idx}`,
        type: cs.type,
        name: cs.name,
        mesh: cMesh,
        pos: cs.pos.clone(),
        velocity: new THREE.Vector3(),
        hp: cs.hp,
        maxHp: cs.hp,
        attackPower: cs.ap,
        isBoss: false,
        attackCooldown: 0,
        state: "chase",
        animTimer: idx * 0.5
      };
      enemies.push(enemyObj);
      volcanoCustomCreatures.push(enemyObj);
    });

    console.log("🌋 [Volcano Dragon Extension] Tüm 8 aşama, platformlar, yaratıklar ve Ignis Boss başarıyla yerleştirildi!");
  };

  // TICKER UPDATE LOOP
  let totalTime = 0;
  function updateVolcanoExtension(dt) {
    const game = window.__superBearGame;
    if (!game || game.currentRegion !== 'volcano_cave') return;
    totalTime += dt;

    // 1. Delay Magma Platforms (Stage 2): Explodes after 2 seconds when stepped on
    if (game.playerPos) {
      volcanoDelayPlatforms.forEach(dp => {
        if (!dp.exploded) {
          const d = Math.hypot(game.playerPos.x - dp.xPos, game.playerPos.z - dp.zPos);
          if (d < 2.5 && Math.abs(game.playerPos.y - dp.baseY) < 1.5) {
            dp.stepped = true;
          }
          if (dp.stepped) {
            dp.timer -= dt;
            // Flash color warning
            if (dp.mesh.material) {
              dp.mesh.material.emissive.setHex(Math.floor(totalTime * 8) % 2 === 0 ? 0xffffff : 0xb91c1c);
            }
            if (dp.timer <= 0) {
              dp.exploded = true;
              game.damagePlayer(15);
              game.spawnSparkleParticles(dp.mesh.position, 25, 0xf97316);
              // Drop collidable
              if (game.currentLevel && game.currentLevel.collidables && game.currentLevel.collidables[dp.collIndex]) {
                game.currentLevel.collidables[dp.collIndex].min.y = -999;
              }
              dp.mesh.position.y -= 10; // fall into lava
            }
          }
        }
      });
    }

    // 2. Geysers (Stage 3)
    volcanoGeysers.forEach(g => {
      g.timer += dt;
      if (g.timer > 3.0) {
        g.timer = 0;
        g.active = !g.active;
        g.group.scale.y = g.active ? 2.2 : 1.0;
      }
      if (g.active && game.playerPos && g.pos.distanceTo(game.playerPos) < 3.0) {
        window.__volcanoBurnPlayer(18);
        game.playerVel.y = 12.0;
      }
    });

    // 3. Rotating Fire Mills (Stage 4)
    volcanoFireMills.forEach(fm => {
      fm.group.rotation.y += dt * fm.speed;
      if (game.playerPos && fm.group.position.distanceTo(game.playerPos) < 3.2) {
        window.__volcanoBurnPlayer(15);
      }
    });

    // 4. Crumbling Crusts (Stage 5)
    if (game.playerPos) {
      volcanoCrumblingCrusts.forEach(cc => {
        if (!cc.stepped) {
          const d = Math.hypot(game.playerPos.x - cc.mesh.position.x, game.playerPos.z - cc.mesh.position.z);
          if (d < 2.0 && Math.abs(game.playerPos.y - cc.baseY) < 1.2) {
            cc.stepped = true;
          }
        } else if (cc.dropTimer > 0) {
          cc.dropTimer -= dt;
          cc.mesh.position.x += (Math.random() - 0.5) * 0.2;
          if (cc.dropTimer <= 0) {
            if (game.currentLevel && game.currentLevel.collidables && game.currentLevel.collidables[cc.collIndex]) {
              game.currentLevel.collidables[cc.collIndex].min.y = -999;
            }
          }
        } else {
          cc.fallSpeed += dt * 30.0;
          cc.mesh.position.y -= cc.fallSpeed * dt;
          cc.respawnTimer += dt;
          if (cc.respawnTimer > 5.0) {
            cc.stepped = false;
            cc.dropTimer = 0.6;
            cc.fallSpeed = 0;
            cc.respawnTimer = 0;
            cc.mesh.position.y = cc.baseY;
            if (game.currentLevel && game.currentLevel.collidables && game.currentLevel.collidables[cc.collIndex]) {
              game.currentLevel.collidables[cc.collIndex].min.y = cc.baseY - 0.4;
            }
          }
        }
      });
    }

    // Portal rotation
    if (volcanoVictoryPortal && volcanoVictoryPortal.vortexMesh) {
      volcanoVictoryPortal.vortexMesh.rotation.z += dt * 2.5;
    }
  }

  function cleanUpVolcanoExtension() {
    if (volcanoExtensionGroup) {
      volcanoExtensionGroup.traverse(obj => {
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
      });
      if (volcanoExtensionGroup.parent) volcanoExtensionGroup.parent.remove(volcanoExtensionGroup);
      volcanoExtensionGroup = null;
    }
    volcanoDelayPlatforms = [];
    volcanoGeysers = [];
    volcanoFireMills = [];
    volcanoCrumblingCrusts = [];
    volcanoCustomCreatures = [];
    activeVolcanoBoss = null;
    volcanoVictoryPortal = null;
    volcanoPopulated = false;
    console.log("🧹 [Volcano Dragon Extension] Bellek temizlendi.");
  }

  function initVolcanoTicker() {
    const game = window.__superBearGame;
    if (game && !game._volcanoDragonTickerHooked) {
      game._volcanoDragonTickerHooked = true;
      const origUpdate = game.update;
      game.update = function(dt, totalTime) {
        origUpdate.call(this, dt, totalTime);
        try {
          updateVolcanoExtension(dt);
        } catch(err) {}
      };

      // Also auto-populate if currently in volcano_cave
      if (game.currentRegion === 'volcano_cave' && !volcanoPopulated && game.scene) {
        window.__populateVolcanoDragonExtension(
          game.scene, game.currentLevel.collidables, game.currentLevel.platforms,
          game.currentLevel.enemies, game.currentLevel.items, game.currentLevel.easels,
          game.currentLevel.npcs, game.currentLevel.checkpoints,
          (id, name, x, y, z) => game.currentLevel.checkpoints.push({id, name, pos: new window.THREE.Vector3(x, y, z)}),
          () => {}, () => {}, () => {}, () => {}, {}, {}, {}, {}, {}, {}
        );
      }
    }
  }

  window.addEventListener('superbear:region-changed', (e) => {
    const newReg = e.detail;
    if (newReg === 'volcano_cave') {
      setTimeout(() => {
        const game = window.__superBearGame;
        if (game && game.scene && !volcanoPopulated) {
          window.__populateVolcanoDragonExtension(
            game.scene, game.currentLevel.collidables, game.currentLevel.platforms,
            game.currentLevel.enemies, game.currentLevel.items, game.currentLevel.easels,
            game.currentLevel.npcs, game.currentLevel.checkpoints,
            (id, name, x, y, z) => game.currentLevel.checkpoints.push({id, name, pos: new window.THREE.Vector3(x, y, z)}),
            () => {}, () => {}, () => {}, () => {}, {}, {}, {}, {}, {}, {}
          );
        }
      }, 500);
    } else {
      cleanUpVolcanoExtension();
    }
  });

  const tickerInterval = setInterval(() => {
    if (window.__superBearGame) {
      initVolcanoTicker();
      clearInterval(tickerInterval);
    }
  }, 100);

  window.__cleanUpVolcanoExtension = cleanUpVolcanoExtension;
  window.__updateVolcanoExtension = updateVolcanoExtension;
  console.log("🌋 [Volcano Dragon Extension] Script Loaded & Ready!");
})();
