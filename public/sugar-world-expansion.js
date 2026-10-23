// ============================================================================
// 🍬 10. BÖLÜM: ŞEKER DÜNYASI & LOLİPOP KRALLIĞI - 14 YENİ AŞAMA & 7 YENİ CANLI
// - Orijinal Şeker Dünyası seviyesi %100 aynen korundu ("eskisinin üzerine yaz")
// - z: -520 noktasından z: -3500 noktasına uzanan 14 devasa yeni aşama
// - 7 Tamamen Yeni Özel Şeker Canlısı (Özgün 3D modeller ve benzersiz mekanikler)
// - Taşınan Lolipop Patronu (14. Aşamada Dev Taht Arenasında) & 11. Bölüm Jokerooms Geçiş Portalı
// ============================================================================
(function() {
  'use strict';

  let sugarExtensionGroup = null;
  let sugarCreatures = [];
  let sugarMovingPlatforms = [];
  let sugarHazardPits = [];
  let sugarJumpPads = [];
  let sugarCheckpoints = [];
  let sugarCollectibles = [];
  let sugarCandyBoss = null;
  let sugarVictoryPortal = null;
  let bossHpBarContainer = null;
  let bossHpFill = null;
  let bossHpText = null;

  function cleanUpSugarWorldExtension() {
    const game = window.__superBearGame;
    if (sugarExtensionGroup && game && game.scene) {
      game.scene.remove(sugarExtensionGroup);
      sugarExtensionGroup = null;
    }
    if (bossHpBarContainer && bossHpBarContainer.parentNode) {
      bossHpBarContainer.parentNode.removeChild(bossHpBarContainer);
      bossHpBarContainer = null;
    }
    sugarCreatures = [];
    sugarMovingPlatforms = [];
    sugarHazardPits = [];
    sugarJumpPads = [];
    sugarCheckpoints = [];
    sugarCollectibles = [];
    sugarCandyBoss = null;
    sugarVictoryPortal = null;
  }

  // =========================================================================
  // CREATURE CREATION HELPERS (13 UNIQUE SWEET BEASTS - MOVE & SHOOT)
  // =========================================================================
  function spawnSugarCreature(x, y, z, name, archetypeIdx, primaryHex, secondaryHex, hp, isFlyer) {
    const THREE = window.THREE;
    const game = window.__superBearGame;
    let group;
    if (typeof window.__buildDistinctCreatureMesh === 'function') {
      group = window.__buildDistinctCreatureMesh(THREE, archetypeIdx, {
        primary: primaryHex,
        secondary: secondaryHex,
        eye: 0xffffff,
        scale: 1.25
      });
    } else {
      group = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.SphereGeometry(0.9, 12, 12),
        new THREE.MeshStandardMaterial({ color: primaryHex, roughness: 0.25 })
      );
      body.position.y = 1.0;
      group.add(body);
    }
    group.position.set(x, y, z);

    const enemyObj = {
      id: "sugar_" + archetypeIdx + "_" + Math.round(z),
      type: "sugar_creature_" + archetypeIdx,
      name: name,
      mesh: group,
      pos: new THREE.Vector3(x, y, z),
      baseX: x,
      baseY: y,
      baseZ: z,
      hp: hp * 30,
      maxHp: hp * 30,
      attackPower: 14,
      _combatUpgraded: true,
      _archetype: archetypeIdx,
      _isFlyer: !!isFlyer,
      _patrolSpeed: isFlyer ? 4.4 : 3.6,
      _patrolRangeX: 5.0,
      _patrolRangeZ: 2.8,
      _animPhase: Math.random() * 10,
      _projCooldown: 0.9 + Math.random() * 1.4,
      _projInterval: 2.2,
      _projTheme: {
        color: primaryHex,
        emissive: secondaryHex,
        speed: 17.5,
        damage: 12,
        radius: 0.42
      },
      update: function(dt, playerPos, gameInst) {
        if (this.hp <= 0) return;
        if (typeof window.__updateCreatureCombatAI === 'function') {
          window.__updateCreatureCombatAI(this, dt, playerPos, gameInst, archetypeIdx);
        }
        if (playerPos) {
          const d = this.pos.distanceTo(playerPos);
          if (d < 2.0 && playerPos.y > this.pos.y + 1.2 && gameInst.playerVel && gameInst.playerVel.y < 0) {
            this.hp -= 35;
            gameInst.playerVel.y = 12;
            if (window.St && window.St.playEnemyHit) window.St.playEnemyHit();
            if (this.hp <= 0) {
              group.visible = false;
              this.pos.y = -9999;
              group.position.y = -9999;
            }
          } else if (d < 1.65) {
            if (gameInst.damagePlayer) gameInst.damagePlayer(14);
            else if (gameInst.takeDamage) gameInst.takeDamage(1);
          }
        }
      }
    };

    group.userData = enemyObj;
    if (game && game.currentLevel && Array.isArray(game.currentLevel.enemies)) {
      game.currentLevel.enemies.push(enemyObj);
    }
    return group;
  }

  function createGummyBear(x, y, z, colorHex = 0xf43f5e) {
    return spawnSugarCreature(x, y, z, "Jelibon Savaşçı Ayıcık 🍬🐻", 11, colorHex, 0xfef08a, 3, false);
  }
  function createCandyCaneGuard(x, y, z) {
    return spawnSugarCreature(x, y, z, "Şeker Kamışı Mızrakçısı 🍭🛡️", 9, 0xef4444, 0xffffff, 4, false);
  }
  function createSugarBee(x, y, z) {
    return spawnSugarCreature(x, y, z, "Uçan Lolipop Eşekarısı 🐝🍭", 12, 0xf59e0b, 0xf472b6, 3, true);
  }
  function createChocolateLeaper(x, y, z) {
    return spawnSugarCreature(x, y, z, "Çikolatalı Sıçrayan Canavar 🍫🐸", 4, 0x451a03, 0xfef08a, 3, false);
  }
  function createPopRockHedgehog(x, y, z) {
    return spawnSugarCreature(x, y, z, "Patlayan Kristal Şeker Akrebi 💥🦂", 7, 0xec4899, 0xa855f7, 3, false);
  }
  function createCaramelGolem(x, y, z) {
    return spawnSugarCreature(x, y, z, "Eriyik Karamel Golemi 🍯🪨", 0, 0xd97706, 0xfef08a, 6, false);
  }
  function createCottonCandyWisp(x, y, z) {
    return spawnSugarCreature(x, y, z, "Pamuk Şeker Bulut Serafı ☁️✨", 8, 0x67e8f9, 0xf472b6, 3, true);
  }
  function createPeppermintScorpion(x, y, z) {
    return spawnSugarCreature(x, y, z, "Nane Şekeri Kristal Akrebi 🌿🦂", 2, 0x10b981, 0xffffff, 4, false);
  }
  function createGlazedDonutRoller(x, y, z) {
    return spawnSugarCreature(x, y, z, "Çikolata Soslu Zırhlı Donut 🍩🛡️", 6, 0x78350f, 0xf472b6, 4, false);
  }
  function createSourWormSerpent(x, y, z) {
    return spawnSugarCreature(x, y, z, "Ekşi Jelibon Solucan Ejderi 🐛🌈", 5, 0xa855f7, 0x4ade80, 4, false);
  }
  function createGingerbreadPaladin(x, y, z) {
    return spawnSugarCreature(x, y, z, "Zencefilli Kurabiye Şövalyesi 🍪⚔️", 17, 0xb45309, 0xffffff, 5, false);
  }
  function createMoltenToffeeDrake(x, y, z) {
    return spawnSugarCreature(x, y, z, "Kaynar Toffee Ejderhası 🔥🍬", 1, 0xea580c, 0xfde047, 5, true);
  }
  function createMacaronSeraph(x, y, z) {
    return spawnSugarCreature(x, y, z, "Gökkuşağı Macaron Büyücüsü 🧁🔮", 3, 0xdb2777, 0x38bdf8, 4, true);
  }

  // =========================================================================
  // MAIN EXTENSION POPULATOR FOR CHAPTER 10 (14 EXTENDED STAGES)
  // =========================================================================
  window.__populateSugarWorldExtension = function(game) {
    if (!window.THREE || !game || !game.scene) return;
    const THREE = window.THREE;
    console.log("🍬 [Şeker Dünyası] Orijinal Şeker Dünyası korundu, 14 Yeni Aşama ve 13 Farklı Canlı Yükleniyor...");

    cleanUpSugarWorldExtension();

    // Expand bounds so player can traverse deep to z: -3600
    if (game.currentLevel && game.currentLevel.bounds) {
      game.currentLevel.bounds.minZ = -3800;
      game.currentLevel.bounds.maxZ = 200;
      game.currentLevel.bounds.minX = -500;
      game.currentLevel.bounds.maxX = 500;
      game.currentLevel.bounds.minY = -60;
      game.currentLevel.bounds.maxY = 400;
    }

    sugarExtensionGroup = new THREE.Group();
    sugarExtensionGroup.name = "sugar_world_14_stages_extension";
    game.scene.add(sugarExtensionGroup);

    const collidables = game.currentLevel.colliders = game.currentLevel.colliders || [];

    // Purge premature exit portal and premature boss from original section
    if (game.scene) {
      const toRemove = [];
      game.scene.traverse(obj => {
        if (obj && obj.userData && (obj.userData.isExitPortal || obj.userData.isCaveExitPortal)) {
          toRemove.push(obj);
        }
      });
      toRemove.forEach(obj => {
        if (obj.parent) obj.parent.remove(obj);
      });
    }

    // Sugar Materials
    const pinkSugarMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.3 });
    const blueSugarMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3 });
    const waffleMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.7 });
    const marshmallowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, emissive: 0xfdf2f8, emissiveIntensity: 0.2 });
    const chocoMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.4 });
    const rainbowMat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.1 });
    const mintMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3 });
    const caramelMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.4, roughness: 0.2 });

    function addPlat(w, h, d, px, py, pz, mat, isBounce = false) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat || pinkSugarMat);
      mesh.position.set(px, py, pz);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      sugarExtensionGroup.add(mesh);

      const collider = {
        minX: px - w / 2, maxX: px + w / 2,
        minY: py - h / 2, maxY: py + h / 2,
        minZ: pz - d / 2, maxZ: pz + d / 2,
        isBounce: isBounce
      };
      collidables.push(collider);
      return mesh;
    }

    function addJumpPad(px, py, pz, boost = 18) {
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.0, 0.4, 16), new THREE.MeshStandardMaterial({ color: 0xec4899, emissive: 0xbe185d, emissiveIntensity: 0.8 }));
      pad.position.set(px, py, pz);
      sugarExtensionGroup.add(pad);
      sugarJumpPads.push({ pos: new THREE.Vector3(px, py + 0.3, pz), boost: boost });
    }

    function addCheckpoint(px, py, pz, label) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 5, 8), new THREE.MeshStandardMaterial({ color: 0xffffff }));
      pole.position.set(px, py + 2.5, pz);
      const flag = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.0, 0.1), new THREE.MeshStandardMaterial({ color: 0xec4899, emissive: 0xdb2777, emissiveIntensity: 0.5 }));
      flag.position.set(px + 0.9, py + 4.2, pz);
      sugarExtensionGroup.add(pole, flag);
      sugarCheckpoints.push({ pos: new THREE.Vector3(px, py + 1.5, pz), label: label, triggered: false, flagMesh: flag });
    }

    function addLollipopDeco(px, py, pz, color = 0xef4444, height = 7) {
      const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, height, 8), new THREE.MeshStandardMaterial({ color: 0xffffff }));
      stick.position.set(px, py + height / 2, pz);
      const head = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.5, 16), new THREE.MeshStandardMaterial({ color: color, roughness: 0.2 }));
      head.rotation.x = Math.PI / 2;
      head.position.set(px, py + height, pz);
      sugarExtensionGroup.add(stick, head);
    }

    // -------------------------------------------------------------------------
    // TRANSITION BRIDGE: Connect original end (z: -500) to Stage 1 (z: -560)
    // -------------------------------------------------------------------------
    addPlat(12, 2, 40, 0, 31, -520, rainbowMat);
    addLollipopDeco(-7, 32, -520, 0xec4899);
    addLollipopDeco(7, 32, -520, 0x06b6d4);

    // =========================================================================
    // 14 EXTENDED STAGES (HER AŞAMADA FARKLI BİR CANLI!)
    // =========================================================================

    // Stage 1: Çilekli Pamuk Şeker Bulutları (z: -560 to -720)
    addCheckpoint(0, 32, -560, "1. Aşama: Pamuk Şeker Bulutları");
    addPlat(14, 2, 25, 0, 32, -580, pinkSugarMat);
    addPlat(8, 2, 16, -10, 34, -620, marshmallowMat);
    addPlat(8, 2, 16, 10, 36, -650, marshmallowMat);
    addPlat(14, 2, 25, 0, 38, -690, pinkSugarMat);
    const bear1 = createGummyBear(-2, 39, -690, 0xec4899);
    sugarExtensionGroup.add(bear1);
    sugarCreatures.push(bear1.userData);

    // Stage 2: Dönen Gofret & Karamelli Makaralar (z: -730 to -920)
    addCheckpoint(0, 38, -730, "2. Aşama: Gofret & Karamel Çarkları");
    addPlat(12, 2, 20, 0, 38, -750, waffleMat);
    addPlat(6, 2, 14, -8, 40, -800, caramelMat);
    addPlat(6, 2, 14, 8, 42, -840, caramelMat);
    addPlat(14, 2, 22, 0, 44, -890, waffleMat);
    const guard1 = createCandyCaneGuard(0, 45, -890);
    sugarExtensionGroup.add(guard1);
    sugarCreatures.push(guard1.userData);

    // Stage 3: Zıplayan Sakız Trambolinleri & Bal Şelalesi (z: -930 to -1120)
    addCheckpoint(0, 44, -930, "3. Aşama: Sakız Trambolinleri");
    addPlat(12, 2, 20, 0, 44, -950, pinkSugarMat);
    addJumpPad(0, 45, -960, 22);
    addPlat(8, 2, 16, 0, 56, -1010, blueSugarMat);
    addPlat(8, 2, 16, -10, 58, -1050, marshmallowMat);
    addPlat(8, 2, 16, 10, 60, -1080, marshmallowMat);
    addPlat(14, 2, 24, 0, 62, -1110, blueSugarMat);
    const bee1 = createSugarBee(0, 65, -1080);
    sugarExtensionGroup.add(bee1);
    sugarCreatures.push(bee1.userData);

    // Stage 4: Patlayan Şeker Kristalleri & Asma Köprüler (z: -1130 to -1320)
    addCheckpoint(0, 62, -1130, "4. Aşama: Şeker Kristalleri");
    addPlat(12, 2, 22, 0, 62, -1150, rainbowMat);
    addPlat(7, 2, 12, -7, 60, -1200, pinkSugarMat);
    addPlat(7, 2, 12, 7, 58, -1240, pinkSugarMat);
    addPlat(14, 2, 24, 0, 56, -1290, rainbowMat);
    const frog1 = createChocolateLeaper(0, 57, -1290);
    sugarExtensionGroup.add(frog1);
    sugarCreatures.push(frog1.userData);

    // Stage 5: Çikolata Nehri & Marshmallow Basamakları (z: -1330 to -1520)
    addCheckpoint(0, 56, -1330, "5. Aşama: Marshmallow Geçidi");
    addPlat(14, 2, 20, 0, 56, -1350, chocoMat);
    addPlat(6, 2, 10, -6, 54, -1390, marshmallowMat);
    addPlat(6, 2, 10, 6, 52, -1430, marshmallowMat);
    addPlat(6, 2, 10, -5, 50, -1470, marshmallowMat);
    addPlat(14, 2, 25, 0, 48, -1510, chocoMat);
    const hedge1 = createPopRockHedgehog(0, 49, -1510);
    sugarExtensionGroup.add(hedge1);
    sugarCreatures.push(hedge1.userData);

    // Stage 6: Şeker Kamışı Dikey Sarmal Kulesi (z: -1530 to -1720)
    addCheckpoint(0, 48, -1530, "6. Aşama: Sarmal Şeker Kulesi");
    addPlat(16, 2, 25, 0, 48, -1550, pinkSugarMat);
    for (let s = 0; s < 6; s++) {
      const angle = (s / 6) * Math.PI * 2;
      addPlat(6, 1.5, 6, Math.cos(angle) * 8, 52 + s * 3.5, -1620 + Math.sin(angle) * 8, caramelMat);
    }
    addPlat(16, 2, 25, 0, 74, -1700, pinkSugarMat);
    const golem1 = createCaramelGolem(0, 75, -1700);
    sugarExtensionGroup.add(golem1);
    sugarCreatures.push(golem1.userData);

    // Stage 7: Kaygan Meyveli Jöle Rampaları (z: -1730 to -1920)
    addCheckpoint(0, 74, -1730, "7. Aşama: Jöle Rampaları");
    addPlat(14, 2, 20, 0, 74, -1750, mintMat);
    addPlat(8, 2, 18, -8, 70, -1800, blueSugarMat);
    addPlat(8, 2, 18, 8, 66, -1840, blueSugarMat);
    addPlat(16, 2, 25, 0, 62, -1890, mintMat);
    const wisp1 = createCottonCandyWisp(0, 65, -1890);
    sugarExtensionGroup.add(wisp1);
    sugarCreatures.push(wisp1.userData);

    // Stage 8: Nane Şekeri Dönen Çarkları (z: -1930 to -2120)
    addCheckpoint(0, 62, -1930, "8. Aşama: Nane Şekeri Çarkları");
    addPlat(14, 2, 22, 0, 62, -1950, mintMat);
    addPlat(7, 2, 14, -8, 64, -2000, marshmallowMat);
    addPlat(7, 2, 14, 8, 66, -2040, mintMat);
    addPlat(14, 2, 24, 0, 68, -2090, mintMat);
    const scorp8 = createPeppermintScorpion(0, 69, -2090);
    sugarExtensionGroup.add(scorp8);
    sugarCreatures.push(scorp8.userData);

    // Stage 9: Çikolatalı Donut Çemberleri (z: -2130 to -2320)
    addCheckpoint(0, 68, -2130, "9. Aşama: Dev Donut Çemberleri");
    addPlat(14, 2, 20, 0, 68, -2150, chocoMat);
    addPlat(8, 2, 14, 0, 66, -2200, waffleMat);
    addJumpPad(0, 67, -2200, 20);
    addPlat(8, 2, 14, 0, 78, -2250, marshmallowMat);
    addPlat(16, 2, 25, 0, 76, -2300, chocoMat);
    const donut9 = createGlazedDonutRoller(0, 77, -2300);
    sugarExtensionGroup.add(donut9);
    sugarCreatures.push(donut9.userData);

    // Stage 10: Bonbon Kristalleri & Uçan Gofretler (z: -2330 to -2520)
    addCheckpoint(0, 76, -2330, "10. Aşama: Bonbon Kristalleri");
    addPlat(14, 2, 22, 0, 76, -2350, rainbowMat);
    addPlat(6, 2, 12, -9, 74, -2400, pinkSugarMat);
    addPlat(6, 2, 12, 9, 72, -2440, blueSugarMat);
    addPlat(14, 2, 24, 0, 70, -2490, rainbowMat);
    const worm10 = createSourWormSerpent(0, 71, -2490);
    sugarExtensionGroup.add(worm10);
    sugarCreatures.push(worm10.userData);

    // Stage 11: Zencefilli Kurabiye Köyü (z: -2530 to -2720)
    addCheckpoint(0, 70, -2530, "11. Aşama: Kurabiye Köyü");
    addPlat(16, 2, 25, 0, 70, -2550, waffleMat);
    addPlat(8, 2, 14, -8, 66, -2600, caramelMat);
    addPlat(8, 2, 14, 8, 62, -2640, caramelMat);
    addPlat(16, 2, 25, 0, 58, -2690, waffleMat);
    const paladin11 = createGingerbreadPaladin(0, 59, -2690);
    sugarExtensionGroup.add(paladin11);
    sugarCreatures.push(paladin11.userData);

    // Stage 12: Eriyik Karamel Lav Havuzları & Dikenli Şekerler (z: -2730 to -2920)
    addCheckpoint(0, 58, -2730, "12. Aşama: Karamel Havuzu");
    addPlat(14, 2, 20, 0, 58, -2750, caramelMat);
    addPlat(6, 2, 10, -7, 56, -2800, pinkSugarMat);
    addPlat(6, 2, 10, 7, 54, -2840, pinkSugarMat);
    addPlat(16, 2, 25, 0, 52, -2890, caramelMat);
    const drake12 = createMoltenToffeeDrake(0, 55, -2890);
    sugarExtensionGroup.add(drake12);
    sugarCreatures.push(drake12.userData);

    // Stage 13: Gökkuşağı Macaron Merdivenleri (z: -2930 to -3140)
    addCheckpoint(0, 52, -2930, "13. Aşama: Macaron Merdivenleri");
    addPlat(16, 2, 22, 0, 52, -2950, rainbowMat);
    addPlat(8, 2, 14, -8, 50, -3000, pinkSugarMat);
    addPlat(8, 2, 14, 8, 46, -3040, blueSugarMat);
    addPlat(10, 2, 16, 0, 42, -3090, mintMat);
    addPlat(18, 2, 26, 0, 38, -3140, rainbowMat);
    const seraph13 = createMacaronSeraph(0, 41, -3140);
    sugarExtensionGroup.add(seraph13);
    sugarCreatures.push(seraph13.userData);

    // Stage 14: BÜYÜK ŞEKER TAHTI ARENASI & LOLİPOP KRALI (z: -3180 to -3480)
    addCheckpoint(0, 38, -3180, "14. Aşama: Şeker Tahtı - Patron Arenası");
    addPlat(36, 4, 60, 0, 36, -3320, goldMat);
    addLollipopDeco(-16, 38, -3300, 0xec4899, 10);
    addLollipopDeco(16, 38, -3300, 0x06b6d4, 10);
    addLollipopDeco(-16, 38, -3340, 0xf59e0b, 10);
    addLollipopDeco(16, 38, -3340, 0x10b981, 10);

    // -------------------------------------------------------------------------
    // RELOCATED BOSS: DEV LOLİPOP KRALI (STAGE 14)
    // -------------------------------------------------------------------------
    const bossGroup = new THREE.Group();
    bossGroup.position.set(0, 38, -3340);

    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 8, 12), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 }));
    stick.position.y = 4;
    bossGroup.add(stick);

    for (let r = 0; r < 6; r++) {
      const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.12, 6, 16), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
      stripe.position.y = 1.5 + r * 1.1;
      stripe.rotation.x = Math.PI / 2;
      bossGroup.add(stripe);
    }

    const head = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.2, 1.4, 24), new THREE.MeshStandardMaterial({
      color: 0xdb2777,
      emissive: 0x9d174d,
      emissiveIntensity: 0.5,
      roughness: 0.2
    }));
    head.rotation.x = Math.PI / 2;
    head.position.y = 10;
    bossGroup.add(head);

    const crown = new THREE.Mesh(new THREE.ConeGeometry(2.0, 1.8, 6), new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8, roughness: 0.2 }));
    crown.position.set(0, 14.5, 0);
    crown.rotation.x = Math.PI;
    bossGroup.add(crown);

    const armL = new THREE.Mesh(new THREE.BoxGeometry(1.2, 4.0, 1.2), pinkSugarMat);
    armL.position.set(-3.5, 7.5, 0);
    const armR = new THREE.Mesh(new THREE.BoxGeometry(1.2, 4.0, 1.2), pinkSugarMat);
    armR.position.set(3.5, 7.5, 0);
    bossGroup.add(armL, armR);

    sugarExtensionGroup.add(bossGroup);

    sugarCandyBoss = {
      id: "boss_sugar_king",
      name: "Dev Lolipop Kralı 🍭👑",
      mesh: bossGroup,
      group: bossGroup,
      pos: bossGroup.position,
      hp: 40,
      maxHp: 40,
      isBoss: true,
      baseX: 0,
      baseY: 38,
      baseZ: -3340,
      attackCooldown: 1.6,
      phase: 1,
      armL, armR,
      headMesh: head,
      isDead: false,
      _combatUpgraded: true,
      update: function(dt, playerPos, gameInst) {
        if (this.isDead || this.hp <= 0) {
          if (!this.isDead) {
            this.isDead = true;
            bossGroup.visible = false;
            bossGroup.position.y = -9999;
            if (sugarVictoryPortal) {
              sugarVictoryPortal.visible = true;
              sugarVictoryPortal.position.set(0, 39, -3420);
            }
          }
          return;
        }

        const t = Date.now() * 0.0025;
        this.attackCooldown -= dt;
        bossGroup.position.x = this.baseX + Math.sin(t) * 10.0;
        bossGroup.position.z = this.baseZ + Math.cos(t * 0.7) * 8.0;
        bossGroup.position.y = this.baseY + Math.sin(t * 1.4) * 1.2;
        head.rotation.z += dt * 1.8;
        armL.rotation.x = Math.sin(t * 2.5) * 0.6;
        armR.rotation.x = -Math.sin(t * 2.5) * 0.6;

        if (playerPos) {
          bossGroup.lookAt(playerPos.x, bossGroup.position.y, playerPos.z);
        }

        if (this.attackCooldown <= 0 && playerPos) {
          this.attackCooldown = 1.9;
          if (window.St && window.St.playBossRoar) window.St.playBossRoar();
          if (typeof window.__spawnEnemyProjectile === 'function' && bossGroup.position.distanceTo(playerPos) < 42) {
            const fireOrigin = bossGroup.position.clone();
            fireOrigin.y += 6.5;
            window.__spawnEnemyProjectile(gameInst, fireOrigin, playerPos, {
              color: 0xec4899,
              emissive: 0xfde047,
              speed: 19.5,
              damage: 16,
              radius: 0.65
            });
          }
        }

        if (playerPos) {
          const d = bossGroup.position.distanceTo(playerPos);
          if (d < 4.5 && playerPos.y > bossGroup.position.y + 6.5 && gameInst.playerVel && gameInst.playerVel.y < 0) {
            this.hp -= 5;
            gameInst.playerVel.y = 15;
            if (window.St && window.St.playBossHit) window.St.playBossHit();
            this.headMesh.material.emissiveIntensity = 1.5;
            setTimeout(() => { if (this.headMesh) this.headMesh.material.emissiveIntensity = 0.5; }, 150);

            if (this.hp <= 0) {
              this.isDead = true;
              bossGroup.visible = false;
              bossGroup.position.y = -9999;
              if (window.St && window.St.playGoalFanfare) window.St.playGoalFanfare();
              if (gameInst.callbacks && gameInst.callbacks.onShowNotice) {
                gameInst.callbacks.onShowNotice("🎉 Lolipop Kralı Yenildi! 11. Bölüm: Jokerooms Portalı Açıldı! 🚪", "success");
              }
              if (sugarVictoryPortal) {
                sugarVictoryPortal.visible = true;
                sugarVictoryPortal.position.set(0, 39, -3420);
              }
            }
          } else if (d < 3.4 && (!gameInst.damageInvulnerable || gameInst.damageInvulnerable <= 0)) {
            if (gameInst.takeDamage) gameInst.takeDamage(2);
          }
        }
      }
    };

    // -------------------------------------------------------------------------
    // VICTORY PORTAL TO CHAPTER 11: JOKEROOMS (at z: -3420)
    // -------------------------------------------------------------------------
    const portalGroup = new THREE.Group();
    portalGroup.position.set(0, 39, -3420);

    const archMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.2 });
    const archL = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 8, 12), archMat);
    archL.position.x = -3.5;
    const archR = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 8, 12), archMat);
    archR.position.x = 3.5;
    const archTop = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.5, 8, 20, Math.PI), archMat);
    archTop.position.y = 4;
    portalGroup.add(archL, archR, archTop);

    const vortex = new THREE.Mesh(new THREE.PlaneGeometry(6, 7), new THREE.MeshBasicMaterial({
      color: 0xfde047,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    }));
    vortex.position.y = 3.5;
    portalGroup.add(vortex);

    sugarExtensionGroup.add(portalGroup);
    sugarVictoryPortal = portalGroup;

    if (game.callbacks && game.callbacks.onShowNotice) {
      game.callbacks.onShowNotice("🍭 10. Bölüm Şeker Dünyası 14 Yeni Aşama ve 13 Farklı Hareketli/Ateş Eden Canlıyla Genişletildi!", "info");
    }
  };

  // =========================================================================
  // UPDATE TICKER FOR CHAPTER 10 EXTENSION
  // =========================================================================
  function updateSugarWorldExtension(dt) {
    const game = window.__superBearGame;
    if (!game || game.currentRegion !== "sugar_world") return;
    const playerPos = game.playerPos;

    // Update Boss
    if (sugarCandyBoss && typeof sugarCandyBoss.update === "function") {
      sugarCandyBoss.update(dt, playerPos, game);
    }

    // Jump pads
    if (playerPos && sugarJumpPads.length > 0) {
      for (let j = 0; j < sugarJumpPads.length; j++) {
        const pad = sugarJumpPads[j];
        if (Math.abs(playerPos.x - pad.pos.x) < 2.0 && Math.abs(playerPos.z - pad.pos.z) < 2.0 && Math.abs(playerPos.y - pad.pos.y) < 1.6) {
          if (game.playerVel) {
            game.playerVel.y = pad.boost;
            if (window.St && window.St.playDoubleJump) window.St.playDoubleJump();
          }
        }
      }
    }

    // Checkpoints
    if (playerPos && sugarCheckpoints.length > 0) {
      for (let k = 0; k < sugarCheckpoints.length; k++) {
        const cp = sugarCheckpoints[k];
        if (!cp.triggered && playerPos.distanceTo(cp.pos) < 4.0) {
          cp.triggered = true;
          if (game.currentLevel) game.currentLevel.spawnPoint = cp.pos.clone();
          if (cp.flagMesh) cp.flagMesh.material.color.setHex(0x22c55e);
          if (game.callbacks && game.callbacks.onShowNotice) {
            game.callbacks.onShowNotice(`🚩 Kontrol Noktası: ${cp.label}`, "success");
          }
          if (window.St && window.St.playCheckpoint) window.St.playCheckpoint();
        }
      }
    }

    // Victory Portal Trigger
    if (playerPos && sugarVictoryPortal && sugarVictoryPortal.visible) {
      const dist = playerPos.distanceTo(sugarVictoryPortal.position);
      if (dist < 3.2 && (!sugarVictoryPortal._triggered)) {
        sugarVictoryPortal._triggered = true;
        if (game.callbacks && game.callbacks.onShowNotice) {
          game.callbacks.onShowNotice("🚪 11. Bölüm: Jokerooms'a Geçiliyor...", "success");
        }
        if (window.St && window.St.playPortal) window.St.playPortal();
        setTimeout(() => {
          if (game.loadRegion) game.loadRegion("jokerooms");
        }, 800);
      }
    }
  }

  // Hook into game loop
  const ticker = setInterval(() => {
    if (window.__superBearGame) {
      if (!window.__superBearGame._sugarTickerHooked) {
        window.__superBearGame._sugarTickerHooked = true;
        const origUpdate = window.__superBearGame.update;
        window.__superBearGame.update = function(dt, totalTime) {
          origUpdate.call(this, dt, totalTime);
          try {
            updateSugarWorldExtension(dt);
          } catch(e) {}
        };
      }
      clearInterval(ticker);
    }
  }, 100);

  window.__cleanUpSugarWorldExtension = cleanUpSugarWorldExtension;
  window.__updateSugarWorldExtension = updateSugarWorldExtension;
  console.log("🍭 [Sugar World Extension] 14-Stage Extension Script Loaded!");
})();
