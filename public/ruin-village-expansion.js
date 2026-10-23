// ============================================================================
// 🏚️ 12. BÖLÜM: YIKILMIŞ KÖY & HARABE SİRK - 15 YENİ AŞAMA & 9 YENİ CANLI
// - Orijinal Yıkılmış Köy seviyesi %100 aynen korundu ("eskisinin üzerine yaz")
// - z: -520 noktasından z: -3850 noktasına uzanan 15 devasa yeni aşama
// - 9 Tamamen Yeni Özel Harabe Canlısı (Özgün 3D modeller ve benzersiz mekanikler)
// - Taşınan Dev Palyaço Boss (15. Aşamada Dev Harabe Sirk Arenasında) & 13. Bölüm Su Mağarası Portalı
// ============================================================================
(function() {
  'use strict';

  let ruinExtensionGroup = null;
  let ruinCreatures = [];
  let ruinJumpPads = [];
  let ruinCheckpoints = [];
  let ruinClownBoss = null;
  let ruinVictoryPortal = null;

  function cleanUpRuinVillageExtension() {
    const game = window.__superBearGame;
    if (ruinExtensionGroup && game && game.scene) {
      game.scene.remove(ruinExtensionGroup);
      ruinExtensionGroup = null;
    }
    ruinCreatures = [];
    ruinJumpPads = [];
    ruinCheckpoints = [];
    ruinClownBoss = null;
    ruinVictoryPortal = null;
  }

  // =========================================================================
  // CREATURE CREATION HELPERS (14 UNIQUE RUIN CREATURES - MOVE & SHOOT)
  // =========================================================================
  function spawnRuinCreature(x, y, z, name, archetypeIdx, primaryHex, secondaryHex, hp, isFlyer) {
    const THREE = window.THREE;
    const game = window.__superBearGame;
    let group;
    if (typeof window.__buildDistinctCreatureMesh === 'function') {
      group = window.__buildDistinctCreatureMesh(THREE, archetypeIdx, {
        primary: primaryHex,
        secondary: secondaryHex,
        eye: 0xff2200,
        scale: 1.28
      });
    } else {
      group = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 1.6, 1.1),
        new THREE.MeshStandardMaterial({ color: primaryHex, roughness: 0.7 })
      );
      body.position.y = 0.9;
      group.add(body);
    }
    group.position.set(x, y, z);

    const enemyObj = {
      id: "ruin_" + archetypeIdx + "_" + Math.round(z),
      type: "ruin_creature_" + archetypeIdx,
      name: name,
      mesh: group,
      pos: new THREE.Vector3(x, y, z),
      baseX: x,
      baseY: y,
      baseZ: z,
      hp: hp * 32,
      maxHp: hp * 32,
      attackPower: 15,
      _combatUpgraded: true,
      _archetype: archetypeIdx,
      _isFlyer: !!isFlyer,
      _patrolSpeed: isFlyer ? 4.5 : 3.8,
      _patrolRangeX: 5.0,
      _patrolRangeZ: 2.8,
      _animPhase: Math.random() * 10,
      _projCooldown: 0.9 + Math.random() * 1.4,
      _projInterval: 2.1,
      _projTheme: {
        color: primaryHex,
        emissive: secondaryHex,
        speed: 18.0,
        damage: 14,
        radius: 0.44
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
            if (gameInst.damagePlayer) gameInst.damagePlayer(15);
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

  function createShadowClownPhantom(x, y, z) {
    return spawnRuinCreature(x, y, z, "Gölge Palyaço Hayaleti 🤡👻", 16, 0x9333ea, 0xfacc15, 3, true);
  }
  function createRustyMarionette(x, y, z) {
    return spawnRuinCreature(x, y, z, "Paslı Kukla Savaşçısı 🪆⚔️", 9, 0x78350f, 0xd97706, 3, false);
  }
  function createCinderRaven(x, y, z) {
    return spawnRuinCreature(x, y, z, "Kor Kanatlı Kül Kuzgunu 🐦‍⬛🔥", 1, 0x1f2937, 0xef4444, 3, true);
  }
  function createRubbleGolem(x, y, z) {
    return spawnRuinCreature(x, y, z, "Yıkıntı Moloz Golemi 🪨💥", 0, 0x52525b, 0xf97316, 5, false);
  }
  function createGasBalloonSpitter(x, y, z) {
    return spawnRuinCreature(x, y, z, "Zehirli Sirk Balonu 🎈☣️", 10, 0x84cc16, 0xa855f7, 3, true);
  }
  function createAutomatonLion(x, y, z) {
    return spawnRuinCreature(x, y, z, "Lanetli Mekanik Sirk Aslanı 🦁⚙️", 4, 0xd97706, 0xef4444, 4, false);
  }
  function createBoneSkitterer(x, y, z) {
    return spawnRuinCreature(x, y, z, "İskelet Akrep Örümceği 🦴🕷️", 7, 0xfef08a, 0xdc2626, 3, false);
  }
  function createFlameAcrobatImp(x, y, z) {
    return spawnRuinCreature(x, y, z, "Ateşbaz İblis Cambaz 🎪🔥", 12, 0xdc2626, 0xfacc15, 3, true);
  }
  function createHauntedArmor(x, y, z) {
    return spawnRuinCreature(x, y, z, "Lanetli Zırhlı Şövalye 🛡️🗡️", 17, 0x334155, 0x38bdf8, 5, false);
  }
  function createCatapultSiegeBrute(x, y, z) {
    return spawnRuinCreature(x, y, z, "Harabe Kuşatma Minotoru 🐂🔨", 11, 0x7c2d12, 0xef4444, 5, false);
  }
  function createCharredMillSpider(x, y, z) {
    return spawnRuinCreature(x, y, z, "Yanmış Değirmen Akrebi 🦂🔥", 2, 0x27272a, 0xf97316, 4, false);
  }
  function createTarPitLeviathan(x, y, z) {
    return spawnRuinCreature(x, y, z, "Kaynar Zift Yılanı 🐍🖤", 5, 0x18181b, 0xef4444, 4, false);
  }
  function createMirrorHallIllusionist(x, y, z) {
    return spawnRuinCreature(x, y, z, "Aynalı Labirent Sihirbazı 🪞🔮", 3, 0x6366f1, 0xf43f5e, 4, true);
  }
  function createBloodBellGargoyle(x, y, z) {
    return spawnRuinCreature(x, y, z, "Kanlı Çan Kulesi Gargoyle'u 🦇🔔", 8, 0x7f1d1d, 0xfacc15, 5, true);
  }

  // =========================================================================
  // MAIN EXTENSION POPULATOR FOR CHAPTER 12 (15 EXTENDED STAGES)
  // =========================================================================
  window.__populateRuinVillageExtension = function(game) {
    if (!window.THREE || !game || !game.scene) return;
    const THREE = window.THREE;
    console.log("🏚️ [Yıkılmış Köy] Orijinal Köy korundu, 15 Yeni Aşama ve 14 Farklı Canlı Yükleniyor...");

    cleanUpRuinVillageExtension();

    if (game.currentLevel && game.currentLevel.bounds) {
      game.currentLevel.bounds.minZ = -4100;
      game.currentLevel.bounds.maxZ = 200;
      game.currentLevel.bounds.minX = -500;
      game.currentLevel.bounds.maxX = 500;
      game.currentLevel.bounds.minY = -60;
      game.currentLevel.bounds.maxY = 400;
    }

    ruinExtensionGroup = new THREE.Group();
    ruinExtensionGroup.name = "ruin_village_15_stages_extension";
    game.scene.add(ruinExtensionGroup);

    const collidables = game.currentLevel.colliders = game.currentLevel.colliders || [];

    // Purge premature exit portal and premature clown boss from original section
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

    // Ruin Materials
    const burntWoodMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.9 });
    const rustIronMat = new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.7, metalness: 0.6 });
    const rubbleStoneMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.95 });
    const bloodStoneMat = new THREE.MeshStandardMaterial({ color: 0x7f1d1d, roughness: 0.8 });
    const crackedBrickMat = new THREE.MeshStandardMaterial({ color: 0x3f3f46, roughness: 0.9 });

    function addPlat(w, h, d, px, py, pz, mat) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat || rubbleStoneMat);
      mesh.position.set(px, py, pz);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      ruinExtensionGroup.add(mesh);

      const collider = {
        minX: px - w / 2, maxX: px + w / 2,
        minY: py - h / 2, maxY: py + h / 2,
        minZ: pz - d / 2, maxZ: pz + d / 2
      };
      collidables.push(collider);
      return mesh;
    }

    function addJumpPad(px, py, pz, boost = 19) {
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.0, 0.4, 16), new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0x991b1b, emissiveIntensity: 0.9 }));
      pad.position.set(px, py, pz);
      ruinExtensionGroup.add(pad);
      ruinJumpPads.push({ pos: new THREE.Vector3(px, py + 0.3, pz), boost: boost });
    }

    function addCheckpoint(px, py, pz, label) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 5, 8), rustIronMat);
      pole.position.set(px, py + 2.5, pz);
      const flag = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.0, 0.1), new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.6 }));
      flag.position.set(px + 0.9, py + 4.2, pz);
      ruinExtensionGroup.add(pole, flag);
      ruinCheckpoints.push({ pos: new THREE.Vector3(px, py + 1.5, pz), label: label, triggered: false, flagMesh: flag });
    }

    // -------------------------------------------------------------------------
    // TRANSITION BRIDGE: Connect original end (z: -500) to Stage 1 (z: -560)
    // -------------------------------------------------------------------------
    addPlat(12, 2, 45, 0, 4, -525, rustIronMat);

    // =========================================================================
    // 15 EXTENDED STAGES (HER AŞAMADA FARKLI BİR HARABE CANLISI!)
    // =========================================================================

    // Stage 1: Yıkık Sirk Halatları (z: -560 to -740)
    addCheckpoint(0, 4, -560, "1. Aşama: Sirk Asma Halatları");
    addPlat(14, 2, 25, 0, 4, -580, burntWoodMat);
    addPlat(6, 2, 16, -7, 6, -630, rustIronMat);
    addPlat(6, 2, 16, 7, 8, -670, rustIronMat);
    addPlat(14, 2, 25, 0, 10, -720, burntWoodMat);
    const m1 = createRustyMarionette(0, 11, -720);
    ruinExtensionGroup.add(m1);
    ruinCreatures.push(m1.userData);

    // Stage 2: Kül ve Moloz Tepeleri (z: -750 to -960)
    addCheckpoint(0, 10, -750, "2. Aşama: Kül ve Moloz Tepeleri");
    addPlat(12, 2, 22, 0, 10, -770, rubbleStoneMat);
    addPlat(7, 2, 14, -8, 12, -820, crackedBrickMat);
    addPlat(7, 2, 14, 8, 14, -860, crackedBrickMat);
    addPlat(14, 2, 24, 0, 16, -910, rubbleStoneMat);
    const r1 = createCinderRaven(0, 20, -880);
    ruinExtensionGroup.add(r1);
    ruinCreatures.push(r1.userData);

    // Stage 3: Alevli Demir Cambaz Kafesleri (z: -970 to -1180)
    addCheckpoint(0, 16, -970, "3. Aşama: Alevli Cambaz Kafesleri");
    addPlat(14, 2, 22, 0, 16, -990, rustIronMat);
    addJumpPad(0, 17, -1000, 22);
    addPlat(8, 2, 14, 0, 28, -1050, burntWoodMat);
    addPlat(8, 2, 14, -9, 30, -1090, rustIronMat);
    addPlat(8, 2, 14, 9, 32, -1130, rustIronMat);
    addPlat(16, 2, 25, 0, 34, -1170, rustIronMat);
    const g1 = createRubbleGolem(0, 35, -1170);
    ruinExtensionGroup.add(g1);
    ruinCreatures.push(g1.userData);

    // Stage 4: Çatlak Taş Kolos Yolu (z: -1190 to -1390)
    addCheckpoint(0, 34, -1190, "4. Aşama: Çatlak Heykel Yolu");
    addPlat(12, 2, 20, 0, 34, -1210, rubbleStoneMat);
    addPlat(6, 2, 12, -7, 32, -1260, crackedBrickMat);
    addPlat(6, 2, 12, 7, 30, -1300, crackedBrickMat);
    addPlat(14, 2, 24, 0, 28, -1350, rubbleStoneMat);
    const p1 = createShadowClownPhantom(0, 29, -1350);
    ruinExtensionGroup.add(p1);
    ruinCreatures.push(p1.userData);

    // Stage 5: Çöken Saat Kulesi Kalıntıları (z: -1400 to -1610)
    addCheckpoint(0, 28, -1400, "5. Aşama: Saat Kulesi Kalıntıları");
    addPlat(14, 2, 22, 0, 28, -1420, rustIronMat);
    addPlat(8, 2, 14, -8, 26, -1470, burntWoodMat);
    addPlat(8, 2, 14, 8, 24, -1510, burntWoodMat);
    addPlat(16, 2, 25, 0, 22, -1560, rustIronMat);
    const b1 = createGasBalloonSpitter(0, 24, -1540);
    ruinExtensionGroup.add(b1);
    ruinCreatures.push(b1.userData);

    // Stage 6: Terk Edilmiş Lunapark Tren Rayları (z: -1620 to -1830)
    addCheckpoint(0, 22, -1620, "6. Aşama: Terk Edilmiş Lunapark Rayları");
    addPlat(14, 2, 20, 0, 22, -1640, rustIronMat);
    addPlat(6, 2, 14, -7, 24, -1690, burntWoodMat);
    addPlat(6, 2, 14, 7, 26, -1730, burntWoodMat);
    addPlat(14, 2, 24, 0, 28, -1780, rustIronMat);
    const l1 = createAutomatonLion(0, 29, -1780);
    ruinExtensionGroup.add(l1);
    ruinCreatures.push(l1.userData);

    // Stage 7: Zehirli Kükürtlü Bataklık Çukurları (z: -1840 to -2050)
    addCheckpoint(0, 28, -1840, "7. Aşama: Kükürtlü Bataklık");
    addPlat(14, 2, 22, 0, 28, -1860, rubbleStoneMat);
    addPlat(6, 2, 10, -6, 26, -1910, crackedBrickMat);
    addPlat(6, 2, 10, 6, 24, -1950, crackedBrickMat);
    addPlat(14, 2, 25, 0, 22, -2000, rubbleStoneMat);
    const s1 = createBoneSkitterer(0, 23, -2000);
    ruinExtensionGroup.add(s1);
    ruinCreatures.push(s1.userData);

    // Stage 8: Dönen Paslı Testereler & Balans Kirişleri (z: -2060 to -2270)
    addCheckpoint(0, 22, -2060, "8. Aşama: Paslı Testere Kirişleri");
    addPlat(14, 2, 20, 0, 22, -2080, rustIronMat);
    addPlat(4, 2, 18, 0, 24, -2130, rustIronMat);
    addPlat(8, 2, 14, -8, 26, -2180, burntWoodMat);
    addPlat(14, 2, 25, 0, 28, -2230, rustIronMat);
    const imp1 = createFlameAcrobatImp(0, 29, -2230);
    ruinExtensionGroup.add(imp1);
    ruinCreatures.push(imp1.userData);

    // Stage 9: Çöken Tonozlar & Mezar Taşları (z: -2280 to -2490)
    addCheckpoint(0, 28, -2280, "9. Aşama: Çöken Tonozlar");
    addPlat(14, 2, 22, 0, 28, -2300, rubbleStoneMat);
    addPlat(7, 2, 12, -7, 30, -2350, crackedBrickMat);
    addPlat(7, 2, 12, 7, 32, -2390, crackedBrickMat);
    addPlat(16, 2, 25, 0, 34, -2440, bloodStoneMat);
    const a1 = createHauntedArmor(0, 35, -2440);
    ruinExtensionGroup.add(a1);
    ruinCreatures.push(a1.userData);

    // Stage 10: Harabe Katapult ve Siperlikler (z: -2500 to -2710)
    addCheckpoint(0, 34, -2500, "10. Aşama: Katapult Siperlikleri");
    addPlat(14, 2, 22, 0, 34, -2520, rustIronMat);
    addPlat(8, 2, 14, -8, 32, -2570, rubbleStoneMat);
    addPlat(8, 2, 14, 8, 30, -2610, rubbleStoneMat);
    addPlat(16, 2, 25, 0, 28, -2660, rustIronMat);
    const brute10 = createCatapultSiegeBrute(0, 29, -2660);
    ruinExtensionGroup.add(brute10);
    ruinCreatures.push(brute10.userData);

    // Stage 11: Yanmış Değirmen Çarkları (z: -2720 to -2930)
    addCheckpoint(0, 28, -2720, "11. Aşama: Yanmış Değirmen Çarkı");
    addPlat(14, 2, 20, 0, 28, -2740, burntWoodMat);
    addPlat(6, 2, 12, -7, 30, -2790, rustIronMat);
    addPlat(6, 2, 12, 7, 32, -2830, rustIronMat);
    addPlat(16, 2, 25, 0, 34, -2880, burntWoodMat);
    const spider11 = createCharredMillSpider(0, 35, -2880);
    ruinExtensionGroup.add(spider11);
    ruinCreatures.push(spider11.userData);

    // Stage 12: Zift Şelalesi & Dönen Bazalt Sütunlar (z: -2940 to -3150)
    addCheckpoint(0, 34, -2940, "12. Aşama: Zift Şelalesi");
    addPlat(14, 2, 22, 0, 34, -2960, rubbleStoneMat);
    addPlat(6, 2, 10, -6, 36, -3010, bloodStoneMat);
    addPlat(6, 2, 10, 6, 38, -3050, bloodStoneMat);
    addPlat(16, 2, 25, 0, 40, -3100, rubbleStoneMat);
    const levi12 = createTarPitLeviathan(0, 41, -3100);
    ruinExtensionGroup.add(levi12);
    ruinCreatures.push(levi12.userData);

    // Stage 13: Lanetli Aynalı Sirk Labirenti (z: -3160 to -3370)
    addCheckpoint(0, 40, -3160, "13. Aşama: Aynalı Sirk Labirenti");
    addPlat(14, 2, 22, 0, 40, -3180, rustIronMat);
    addPlat(7, 2, 14, -8, 42, -3230, crackedBrickMat);
    addPlat(7, 2, 14, 8, 44, -3270, crackedBrickMat);
    addPlat(16, 2, 25, 0, 46, -3320, rustIronMat);
    const illus13 = createMirrorHallIllusionist(0, 47, -3320);
    ruinExtensionGroup.add(illus13);
    ruinCreatures.push(illus13.userData);

    // Stage 14: Kanlı Çan Kulesi Merdiveni (z: -3380 to -3590)
    addCheckpoint(0, 46, -3380, "14. Aşama: Kanlı Çan Kulesi");
    addPlat(16, 2, 25, 0, 46, -3400, bloodStoneMat);
    addJumpPad(0, 47, -3410, 24);
    addPlat(8, 2, 14, 0, 60, -3460, rustIronMat);
    addPlat(8, 2, 14, -8, 56, -3500, rubbleStoneMat);
    addPlat(8, 2, 14, 8, 52, -3540, rubbleStoneMat);
    addPlat(18, 2, 28, 0, 48, -3580, bloodStoneMat);
    const garg14 = createBloodBellGargoyle(0, 50, -3580);
    ruinExtensionGroup.add(garg14);
    ruinCreatures.push(garg14.userData);

    // Stage 15: BÜYÜK HARABE SİRK ARENASI & DEV PALYAÇO BOSS (z: -3630 to -3900)
    addCheckpoint(0, 48, -3630, "15. Aşama: Sirk Arenası - Dev Palyaço Boss");
    addPlat(40, 4, 65, 0, 46, -3770, bloodStoneMat);

    // -------------------------------------------------------------------------
    // RELOCATED BOSS: DEV SİRK PALYAÇOSU (STAGE 15)
    // -------------------------------------------------------------------------
    const bossGroup = new THREE.Group();
    bossGroup.position.set(0, 48, -3790);

    const clownMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
    const collarMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
    const faceMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });

    const torso = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.5, 6, 16), clownMat);
    torso.position.y = 3.5;
    bossGroup.add(torso);

    const collar = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.6, 8, 20), collarMat);
    collar.position.y = 6.6;
    collar.rotation.x = Math.PI / 2;
    bossGroup.add(collar);

    const head = new THREE.Mesh(new THREE.SphereGeometry(2.2, 16, 16), faceMat);
    head.position.y = 9.0;
    bossGroup.add(head);

    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.7, 12, 12), new THREE.MeshStandardMaterial({ color: 0xdc2626 }));
    nose.position.set(0, 9.0, 2.3);
    bossGroup.add(nose);

    const cap = new THREE.Mesh(new THREE.ConeGeometry(1.6, 3.2, 12), new THREE.MeshStandardMaterial({ color: 0x8b5cf6 }));
    cap.position.set(0, 12.2, 0);
    bossGroup.add(cap);

    ruinExtensionGroup.add(bossGroup);

    ruinClownBoss = {
      id: "boss_ruin_clown",
      name: "Dev Sirk Palyaçosu 🤡👑",
      mesh: bossGroup,
      group: bossGroup,
      pos: bossGroup.position,
      hp: 45,
      maxHp: 45,
      isBoss: true,
      baseX: 0,
      baseY: 48,
      baseZ: -3790,
      attackTimer: 1.7,
      isDead: false,
      _combatUpgraded: true,
      update: function(dt, playerPos, gameInst) {
        if (this.isDead || this.hp <= 0) return;
        const t = Date.now() * 0.0025;
        this.attackTimer -= dt;
        bossGroup.position.x = this.baseX + Math.sin(t * 1.1) * 11.0;
        bossGroup.position.z = this.baseZ + Math.cos(t * 0.8) * 9.0;
        bossGroup.position.y = this.baseY + Math.sin(t * 1.5) * 1.0;

        if (playerPos) {
          bossGroup.lookAt(playerPos.x, bossGroup.position.y, playerPos.z);
        }

        if (this.attackTimer <= 0 && playerPos) {
          this.attackTimer = 1.9;
          if (window.St && window.St.playBossRoar) window.St.playBossRoar();
          if (typeof window.__spawnEnemyProjectile === 'function' && bossGroup.position.distanceTo(playerPos) < 42) {
            const fireOrigin = bossGroup.position.clone();
            fireOrigin.y += 6.5;
            window.__spawnEnemyProjectile(gameInst, fireOrigin, playerPos, {
              color: 0x8b5cf6,
              emissive: 0xef4444,
              speed: 20.0,
              damage: 17,
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

            if (this.hp <= 0) {
              this.isDead = true;
              bossGroup.visible = false;
              bossGroup.position.y = -9999;
              if (window.St && window.St.playGoalFanfare) window.St.playGoalFanfare();
              if (gameInst.callbacks && gameInst.callbacks.onShowNotice) {
                gameInst.callbacks.onShowNotice("🎉 Dev Palyaço Boss Yenildi! 13. Bölüm: Su Mağarası Portalı Açıldı! 💧", "success");
              }
              if (ruinVictoryPortal) {
                ruinVictoryPortal.visible = true;
                ruinVictoryPortal.position.set(0, 49, -3860);
              }
            }
          } else if (d < 3.4 && (!gameInst.damageInvulnerable || gameInst.damageInvulnerable <= 0)) {
            if (gameInst.takeDamage) gameInst.takeDamage(2);
          }
        }
      }
    };

    // -------------------------------------------------------------------------
    // VICTORY PORTAL TO CHAPTER 13: WATER CAVE (at z: -3860)
    // -------------------------------------------------------------------------
    const portalGroup = new THREE.Group();
    portalGroup.position.set(0, 49, -3860);

    const pArch = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.5, 8, 20, Math.PI), rustIronMat);
    pArch.position.y = 4;
    const pVortex = new THREE.Mesh(new THREE.PlaneGeometry(6, 7), new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    }));
    pVortex.position.y = 3.5;
    portalGroup.add(pArch, pVortex);
    ruinExtensionGroup.add(portalGroup);
    ruinVictoryPortal = portalGroup;

    if (game.callbacks && game.callbacks.onShowNotice) {
      game.callbacks.onShowNotice("🏚️ 12. Bölüm Yıkılmış Köy 15 Yeni Aşama ve 14 Farklı Hareketli/Ateş Eden Canlıyla Genişletildi!", "info");
    }
  };

  // =========================================================================
  // UPDATE TICKER FOR CHAPTER 12 EXTENSION
  // =========================================================================
  function updateRuinVillageExtension(dt) {
    const game = window.__superBearGame;
    if (!game || game.currentRegion !== "ruin_village") return;
    const playerPos = game.playerPos;

    if (ruinClownBoss && typeof ruinClownBoss.update === "function") {
      ruinClownBoss.update(dt, playerPos, game);
    }

    if (playerPos && ruinJumpPads.length > 0) {
      for (let j = 0; j < ruinJumpPads.length; j++) {
        const pad = ruinJumpPads[j];
        if (Math.abs(playerPos.x - pad.pos.x) < 2.0 && Math.abs(playerPos.z - pad.pos.z) < 2.0 && Math.abs(playerPos.y - pad.pos.y) < 1.6) {
          if (game.playerVel) {
            game.playerVel.y = pad.boost;
            if (window.St && window.St.playDoubleJump) window.St.playDoubleJump();
          }
        }
      }
    }

    if (playerPos && ruinCheckpoints.length > 0) {
      for (let k = 0; k < ruinCheckpoints.length; k++) {
        const cp = ruinCheckpoints[k];
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

    if (playerPos && ruinVictoryPortal && ruinVictoryPortal.visible) {
      const dist = playerPos.distanceTo(ruinVictoryPortal.position);
      if (dist < 3.2 && (!ruinVictoryPortal._triggered)) {
        ruinVictoryPortal._triggered = true;
        if (game.callbacks && game.callbacks.onShowNotice) {
          game.callbacks.onShowNotice("💧 13. Bölüm: Karanlık Su Mağarası'na Geçiliyor...", "success");
        }
        if (window.St && window.St.playPortal) window.St.playPortal();
        setTimeout(() => {
          if (game.loadRegion) game.loadRegion("water_cave");
        }, 800);
      }
    }
  }

  const ticker = setInterval(() => {
    if (window.__superBearGame) {
      if (!window.__superBearGame._ruinTickerHooked) {
        window.__superBearGame._ruinTickerHooked = true;
        const origUpdate = window.__superBearGame.update;
        window.__superBearGame.update = function(dt, totalTime) {
          origUpdate.call(this, dt, totalTime);
          try {
            updateRuinVillageExtension(dt);
          } catch(e) {}
        };
      }
      clearInterval(ticker);
    }
  }, 100);

  window.__cleanUpRuinVillageExtension = cleanUpRuinVillageExtension;
  window.__updateRuinVillageExtension = updateRuinVillageExtension;
  console.log("🏚️ [Ruin Village Extension] 15-Stage Extension Script Loaded!");
})();
