// ============================================================================
// 🏜️ 14. BÖLÜM: ARILAR ÇÖLÜ & ANTİK PİRAMİT - 17 YENİ AŞAMA & 14 YENİ CANLI
// - Orijinal Çöl seviyesi %100 aynen korundu ("eskisinin üzerine yaz")
// - z: -750 noktasından z: -4450 noktasına uzanan 17 devasa yeni aşama
// - 14 Tamamen Yeni Özgün Çöl Canlısı (Özgün 3D modeller ve benzersiz mekanikler)
// - Taşınan Dev Çöl Timsahı Sobek Boss (17. Aşamada Piramit Mabedinde) & 15. Bölüm Zirve Portalı
// ============================================================================
(function() {
  'use strict';

  let desertExtensionGroup = null;
  let desertCreatures = [];
  let desertJumpPads = [];
  let desertCheckpoints = [];
  let desertCrocBoss = null;
  let desertVictoryPortal = null;

  function cleanUpBeeDesertExtension() {
    const game = window.__superBearGame;
    if (desertExtensionGroup && game && game.scene) {
      game.scene.remove(desertExtensionGroup);
      desertExtensionGroup = null;
    }
    desertCreatures = [];
    desertJumpPads = [];
    desertCheckpoints = [];
    desertCrocBoss = null;
    desertVictoryPortal = null;
  }

  // =========================================================================
  // 16 UNIQUE DESERT BEASTS HELPERS (MOVE & SHOOT)
  // =========================================================================

  function spawnDesertCreature(x, y, z, name, archetypeIdx, primaryHex, secondaryHex, hp, isFlyer) {
    const THREE = window.THREE;
    const game = window.__superBearGame;
    let group;
    if (typeof window.__buildDistinctCreatureMesh === 'function') {
      group = window.__buildDistinctCreatureMesh(THREE, archetypeIdx, {
        primary: primaryHex,
        secondary: secondaryHex,
        eye: 0xfacc15,
        scale: 1.28
      });
    } else {
      group = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 1.4, 1.4),
        new THREE.MeshStandardMaterial({ color: primaryHex, roughness: 0.5 })
      );
      body.position.y = 0.8;
      group.add(body);
    }
    group.position.set(x, y, z);

    const enemyObj = {
      id: "desert_" + archetypeIdx + "_" + Math.round(z),
      type: "desert_creature_" + archetypeIdx,
      name: name,
      mesh: group,
      pos: new THREE.Vector3(x, y, z),
      baseX: x,
      baseY: y,
      baseZ: z,
      hp: hp * 32,
      maxHp: hp * 32,
      attackPower: 16,
      _combatUpgraded: true,
      _archetype: archetypeIdx,
      _isFlyer: !!isFlyer,
      _patrolSpeed: isFlyer ? 4.6 : 3.9,
      _patrolRangeX: 5.2,
      _patrolRangeZ: 2.8,
      _animPhase: Math.random() * 10,
      _projCooldown: 0.9 + Math.random() * 1.4,
      _projInterval: 2.0,
      _projTheme: {
        color: primaryHex,
        emissive: secondaryHex,
        speed: 18.5,
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
            if (gameInst.damagePlayer) gameInst.damagePlayer(16);
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

  function createSoldierBee(x, y, z) {
    return spawnDesertCreature(x, y, z, "Çöl Asker Eşekarısı 🐝🏜️", 12, 0xd97706, 0x1e293b, 3, true);
  }
  function createDuneScorpion(x, y, z) {
    return spawnDesertCreature(x, y, z, "Dev Kumul Akrebi 🦂🔥", 2, 0xb45309, 0xef4444, 4, false);
  }
  function createMummyBear(x, y, z) {
    return spawnDesertCreature(x, y, z, "Lanetli Mumya Muhafızı 🤕⚱️", 11, 0xfef3c7, 0xd97706, 5, false);
  }
  function createDustDevil(x, y, z) {
    return spawnDesertCreature(x, y, z, "Kum Fırtınası Cin Ruhu 🌪️✨", 3, 0xfde047, 0xea580c, 3, true);
  }
  function createGoldScarab(x, y, z) {
    return spawnDesertCreature(x, y, z, "Kutsal Altın Bokböceği 🪲👑", 6, 0xfacc15, 0x0284c7, 4, false);
  }
  function createHornedViper(x, y, z) {
    return spawnDesertCreature(x, y, z, "Boynuzlu Çöl Engereği 🐍☣️", 5, 0x78350f, 0x84cc16, 3, false);
  }
  function createHornetSentry(x, y, z) {
    return spawnDesertCreature(x, y, z, "Kovan Nöbetçi Bombacısı 🐝💥", 14, 0xca8a04, 0xef4444, 4, true);
  }
  function createSunFalcon(x, y, z) {
    return spawnDesertCreature(x, y, z, "Güneş Tanrısı Horus Şahini 🦅☀️", 1, 0x92400e, 0xfacc15, 3, true);
  }
  function createCactusGolem(x, y, z) {
    return spawnDesertCreature(x, y, z, "Dikenli Kaktüs Golemi 🌵🪨", 0, 0x15803d, 0xfacc15, 5, false);
  }
  function createMirageShifter(x, y, z) {
    return spawnDesertCreature(x, y, z, "Çöl Serabı İllüzyonisti 🔮🌊", 8, 0x38bdf8, 0xfacc15, 3, true);
  }
  function createBastetMummy(x, y, z) {
    return spawnDesertCreature(x, y, z, "Bastet Tapınak Panteri 🐈‍⬛🌙", 4, 0x451a03, 0xfacc15, 4, false);
  }
  function createMoltenSkink(x, y, z) {
    return spawnDesertCreature(x, y, z, "Kızgın Kum Kertenkelesi 🦎🔥", 15, 0xea580c, 0xfef08a, 4, false);
  }
  function createAnubisCarrier(x, y, z) {
    return spawnDesertCreature(x, y, z, "Anubis Çakal Şövalyesi 🐺⚔️", 17, 0x1e1b4b, 0xfacc15, 5, false);
  }
  function createHornetKnight(x, y, z) {
    return spawnDesertCreature(x, y, z, "Kraliyet Kovan Mızrakçısı 🐝🛡️", 9, 0xf59e0b, 0x78350f, 4, true);
  }
  function createPharaohSphinxLancer(x, y, z) {
    return spawnDesertCreature(x, y, z, "Piramit Sfenks Muhafızı 🦁👑", 7, 0xd97706, 0x38bdf8, 5, false);
  }
  function createSolarPyramidColossus(x, y, z) {
    return spawnDesertCreature(x, y, z, "Güneş Sunağı Seraf Arkonu ☀️🔱", 13, 0xfacc15, 0xef4444, 5, true);
  }

  // =========================================================================
  // MAIN EXTENSION POPULATOR FOR CHAPTER 14 (17 EXTENDED STAGES)
  // =========================================================================
  window.__populateBeeDesertExtension = function(game) {
    if (!window.THREE || !game || !game.scene) return;
    const THREE = window.THREE;
    console.log("🏜️ [Arılar Çölü] Orijinal Çöl korundu, 17 Yeni Aşama ve 16 Farklı Canlı Yükleniyor...");

    cleanUpBeeDesertExtension();

    if (game.currentLevel && game.currentLevel.bounds) {
      game.currentLevel.bounds.minZ = -4600;
      game.currentLevel.bounds.maxZ = 200;
      game.currentLevel.bounds.minX = -500;
      game.currentLevel.bounds.maxX = 500;
      game.currentLevel.bounds.minY = -60;
      game.currentLevel.bounds.maxY = 400;
    }

    desertExtensionGroup = new THREE.Group();
    desertExtensionGroup.name = "bee_desert_17_stages_extension";
    game.scene.add(desertExtensionGroup);

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

    // Desert Materials
    const sandStoneMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.9 });
    const goldHieroglyphMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.3, roughness: 0.4 });
    const honeyCombMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 });
    const basaltDarkMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });

    function addPlat(w, h, d, px, py, pz, mat) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat || sandStoneMat);
      mesh.position.set(px, py, pz);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      desertExtensionGroup.add(mesh);

      const collider = {
        minX: px - w / 2, maxX: px + w / 2,
        minY: py - h / 2, maxY: py + h / 2,
        minZ: pz - d / 2, maxZ: pz + d / 2
      };
      collidables.push(collider);
      return mesh;
    }

    function addJumpPad(px, py, pz, boost = 20) {
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.0, 0.4, 16), new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.9 }));
      pad.position.set(px, py, pz);
      desertExtensionGroup.add(pad);
      desertJumpPads.push({ pos: new THREE.Vector3(px, py + 0.3, pz), boost: boost });
    }

    function addCheckpoint(px, py, pz, label) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 5, 8), sandStoneMat);
      pole.position.set(px, py + 2.5, pz);
      const flag = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.0, 0.1), new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.6 }));
      flag.position.set(px + 0.9, py + 4.2, pz);
      desertExtensionGroup.add(pole, flag);
      desertCheckpoints.push({ pos: new THREE.Vector3(px, py + 1.5, pz), label: label, triggered: false, flagMesh: flag });
    }

    // -------------------------------------------------------------------------
    // TRANSITION BRIDGE: Connect original end (z: -750) to Stage 1 (z: -780)
    // -------------------------------------------------------------------------
    addPlat(12, 2, 45, 0, 5, -760, goldHieroglyphMat);

    // =========================================================================
    // 17 EXTENDED STAGES (z: -780 to -4450)
    // =========================================================================

    const stageDefs = [
      { name: "1. Aşama: Kum Tepesi Sırtları", z: -800, y: 6, cFn: createSoldierBee },
      { name: "2. Aşama: Kovan Kanyonu Kemerleri", z: -1010, y: 10, cFn: createDuneScorpion },
      { name: "3. Aşama: Kaktüs Labyrinti", z: -1220, y: 14, cFn: createMummyBear },
      { name: "4. Aşama: Kum Hortumları", z: -1430, y: 18, cFn: createDustDevil },
      { name: "5. Aşama: Mısır Dikilitaşları", z: -1640, y: 22, cFn: createGoldScarab },
      { name: "6. Aşama: Batak Kum Çukurları", z: -1850, y: 26, cFn: createHornedViper },
      { name: "7. Aşama: Firavun Lahit Merdivenleri", z: -2060, y: 30, cFn: createHornetSentry },
      { name: "8. Aşama: Bal Peteği Trambolinleri", z: -2270, y: 34, cFn: createSunFalcon },
      { name: "9. Aşama: Çöl Vahası Adaları", z: -2480, y: 38, cFn: createCactusGolem },
      { name: "10. Aşama: Sfenks Patikası", z: -2690, y: 42, cFn: createMirageShifter },
      { name: "11. Aşama: Güneş Saati Kadranları", z: -2900, y: 46, cFn: createBastetMummy },
      { name: "12. Aşama: Mumya Mezarı Tünelleri", z: -3110, y: 50, cFn: createMoltenSkink },
      { name: "13. Aşama: Akrep Kanyonu Köprüleri", z: -3320, y: 54, cFn: createAnubisCarrier },
      { name: "14. Aşama: Sıcak Bazalt Kayaları", z: -3530, y: 58, cFn: createHornetKnight },
      { name: "15. Aşama: Basamaklı Piramit Terasları", z: -3740, y: 62, cFn: createPharaohSphinxLancer },
      { name: "16. Aşama: Anubis Sunağı & Gökyüzü Yolu", z: -3950, y: 66, cFn: createSolarPyramidColossus }
    ];

    stageDefs.forEach(sd => {
      addCheckpoint(0, sd.y, sd.z + 20, sd.name);
      addPlat(14, 2, 22, 0, sd.y, sd.z, sandStoneMat);
      addPlat(7, 2, 14, -8, sd.y + 2, sd.z - 45, honeyCombMat);
      addPlat(7, 2, 14, 8, sd.y + 4, sd.z - 85, honeyCombMat);
      addPlat(16, 2, 25, 0, sd.y + 4, sd.z - 130, goldHieroglyphMat);

      if (sd.cFn) {
        const c = sd.cFn(0, sd.y + 5, sd.z - 130);
        desertExtensionGroup.add(c);
        desertCreatures.push(c.userData);
      }
    });

    // Stage 17: SOBEK KRALLIĞI & DEV ÇÖL TİMSAHI MABEDİ (z: -4180 to -4450)
    addCheckpoint(0, 70, -4180, "17. Aşama: Sobek Mabedi - Timsah Boss");
    addPlat(42, 4, 75, 0, 68, -4330, goldHieroglyphMat);

    // -------------------------------------------------------------------------
    // RELOCATED BOSS: DEV ÇÖL TİMSAHI SOBEK (STAGE 17)
    // -------------------------------------------------------------------------
    const bossGroup = new THREE.Group();
    bossGroup.position.set(0, 70, -4350);

    const crocMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
    const bellyMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.5 });

    const body = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.6, 9.0), crocMat);
    body.position.y = 1.0;
    bossGroup.add(body);

    const belly = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.4, 8.8), bellyMat);
    belly.position.y = 0.2;
    bossGroup.add(belly);

    const snout = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.9, 4.0), crocMat);
    snout.position.set(0, 1.2, 5.5);
    bossGroup.add(snout);

    desertExtensionGroup.add(bossGroup);

    desertCrocBoss = {
      id: "boss_desert_sobek",
      name: "Dev Çöl Timsahı Sobek 🐊👑",
      mesh: bossGroup,
      group: bossGroup,
      pos: bossGroup.position,
      hp: 55,
      maxHp: 55,
      isBoss: true,
      baseX: 0,
      baseY: 70,
      baseZ: -4350,
      attackTimer: 1.7,
      isDead: false,
      _combatUpgraded: true,
      update: function(dt, playerPos, gameInst) {
        if (this.isDead || this.hp <= 0) return;
        const t = Date.now() * 0.0025;
        this.attackTimer -= dt;
        bossGroup.position.x = this.baseX + Math.sin(t * 1.2) * 12.0;
        bossGroup.position.z = this.baseZ + Math.cos(t * 0.85) * 10.0;
        bossGroup.position.y = this.baseY + Math.sin(t * 1.5) * 0.5;

        if (playerPos) {
          bossGroup.lookAt(playerPos.x, bossGroup.position.y, playerPos.z);
        }

        if (this.attackTimer <= 0 && playerPos) {
          this.attackTimer = 1.9;
          if (window.St && window.St.playBossRoar) window.St.playBossRoar();
          if (typeof window.__spawnEnemyProjectile === 'function' && bossGroup.position.distanceTo(playerPos) < 44) {
            const fireOrigin = bossGroup.position.clone();
            fireOrigin.y += 2.2;
            window.__spawnEnemyProjectile(gameInst, fireOrigin, playerPos, {
              color: 0xfacc15,
              emissive: 0xd97706,
              speed: 21.0,
              damage: 18,
              radius: 0.7
            });
          }
        }

        if (playerPos) {
          const d = bossGroup.position.distanceTo(playerPos);
          if (d < 5.0 && playerPos.y > bossGroup.position.y + 2.2 && gameInst.playerVel && gameInst.playerVel.y < 0) {
            this.hp -= 5;
            gameInst.playerVel.y = 15;
            if (window.St && window.St.playBossHit) window.St.playBossHit();

            if (this.hp <= 0) {
              this.isDead = true;
              bossGroup.visible = false;
              bossGroup.position.y = -9999;
              if (window.St && window.St.playGoalFanfare) window.St.playGoalFanfare();
              if (gameInst.callbacks && gameInst.callbacks.onShowNotice) {
                gameInst.callbacks.onShowNotice("🎉 Sobek Yenildi! 15. Bölüm: Dünya Final Zirvesi Portalı Açıldı! ⛰️", "success");
              }
              if (desertVictoryPortal) {
                desertVictoryPortal.visible = true;
                desertVictoryPortal.position.set(0, 71, -4420);
              }
            }
          } else if (d < 3.5 && (!gameInst.damageInvulnerable || gameInst.damageInvulnerable <= 0)) {
            if (gameInst.takeDamage) gameInst.takeDamage(2);
          }
        }
      }
    };

    // -------------------------------------------------------------------------
    // VICTORY PORTAL TO CHAPTER 15: EARTH SUMMIT (at z: -4420)
    // -------------------------------------------------------------------------
    const portalGroup = new THREE.Group();
    portalGroup.position.set(0, 71, -4420);

    const arch = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.5, 8, 20, Math.PI), goldHieroglyphMat);
    arch.position.y = 4;
    const vortex = new THREE.Mesh(new THREE.PlaneGeometry(6, 7), new THREE.MeshBasicMaterial({
      color: 0xff7744,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    }));
    vortex.position.y = 3.5;
    portalGroup.add(arch, vortex);
    desertExtensionGroup.add(portalGroup);
    desertVictoryPortal = portalGroup;

    if (game.callbacks && game.callbacks.onShowNotice) {
      game.callbacks.onShowNotice("🏜️ 14. Bölüm Arılar Çölü 17 Yeni Aşama ve 16 Farklı Hareketli/Ateş Eden Canlıyla Genişletildi!", "info");
    }
  };

  // =========================================================================
  // UPDATE TICKER FOR CHAPTER 14 EXTENSION
  // =========================================================================
  function updateBeeDesertExtension(dt) {
    const game = window.__superBearGame;
    if (!game || game.currentRegion !== "bee_desert") return;
    const playerPos = game.playerPos;

    if (desertCrocBoss && typeof desertCrocBoss.update === "function") {
      desertCrocBoss.update(dt, playerPos, game);
    }

    if (playerPos && desertJumpPads.length > 0) {
      for (let j = 0; j < desertJumpPads.length; j++) {
        const pad = desertJumpPads[j];
        if (Math.abs(playerPos.x - pad.pos.x) < 2.0 && Math.abs(playerPos.z - pad.pos.z) < 2.0 && Math.abs(playerPos.y - pad.pos.y) < 1.6) {
          if (game.playerVel) {
            game.playerVel.y = pad.boost;
            if (window.St && window.St.playDoubleJump) window.St.playDoubleJump();
          }
        }
      }
    }

    if (playerPos && desertCheckpoints.length > 0) {
      for (let k = 0; k < desertCheckpoints.length; k++) {
        const cp = desertCheckpoints[k];
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

    if (playerPos && desertVictoryPortal && desertVictoryPortal.visible) {
      const dist = playerPos.distanceTo(desertVictoryPortal.position);
      if (dist < 3.2 && (!desertVictoryPortal._triggered)) {
        desertVictoryPortal._triggered = true;
        if (game.callbacks && game.callbacks.onShowNotice) {
          game.callbacks.onShowNotice("⛰️ 15. Bölüm: Dünya Final Zirvesi'ne Geçiliyor...", "success");
        }
        if (window.St && window.St.playPortal) window.St.playPortal();
        setTimeout(() => {
          if (game.loadRegion) game.loadRegion("earth_summit");
        }, 800);
      }
    }
  }

  const ticker = setInterval(() => {
    if (window.__superBearGame) {
      if (!window.__superBearGame._desertTickerHooked) {
        window.__superBearGame._desertTickerHooked = true;
        const origUpdate = window.__superBearGame.update;
        window.__superBearGame.update = function(dt, totalTime) {
          origUpdate.call(this, dt, totalTime);
          try {
            updateBeeDesertExtension(dt);
          } catch(e) {}
        };
      }
      clearInterval(ticker);
    }
  }, 100);

  window.__cleanUpBeeDesertExtension = cleanUpBeeDesertExtension;
  window.__updateBeeDesertExtension = updateBeeDesertExtension;
  console.log("🏜️ [Bee Desert Extension] 17-Stage Extension Script Loaded!");
})();
