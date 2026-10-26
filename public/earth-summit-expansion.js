// ============================================================================
// ⛰️ 15. BÖLÜM: DÜNYA FİNAL ZİRVESİ & KIRMIZI ÇİZGİ - 18 YENİ AŞAMA & 16 YENİ CANLI
// - Orijinal 15 aşama %100 aynen korundu ("eskisinin üzerine yaz")
// - z: -2640 noktasından z: -6400 noktasına uzanan 18 devasa yeni aşama
// - 16 Tamamen Yeni Zirve Canlısı (Özgün 3D modeller ve benzersiz mekanikler)
// - Taşınan Moris Son Boss (18. Aşamada Göksel Kırmızı Çizgi Tahtında) & Şampiyonluk Portalı
// ============================================================================
(function() {
  'use strict';

  let summitExtGroup = null;
  let summitExtCreatures = [];
  let summitExtJumpPads = [];
  let summitExtCheckpoints = [];
  let summitExtMorisBoss = null;
  let summitExtVictoryPortal = null;

  function cleanUpEarthSummitExtension() {
    const game = window.__superBearGame;
    if (summitExtGroup && game && game.scene) {
      game.scene.remove(summitExtGroup);
      summitExtGroup = null;
    }
    summitExtCreatures = [];
    summitExtJumpPads = [];
    summitExtCheckpoints = [];
    summitExtMorisBoss = null;
    summitExtVictoryPortal = null;
  }

  // =========================================================================
  // 17 UNIQUE SUMMIT CREATURE GENERATOR HELPERS (MOVE & SHOOT)
  // =========================================================================
  function spawnSummitCreature(x, y, z, name, archetypeIdx, primaryHex, secondaryHex, hp, isFlyer) {
    const THREE = window.THREE;
    const game = window.__superBearGame;
    let group;
    if (typeof window.__buildDistinctCreatureMesh === 'function') {
      group = window.__buildDistinctCreatureMesh(THREE, archetypeIdx, {
        primary: primaryHex,
        secondary: secondaryHex,
        eye: 0xef4444,
        scale: 1.32
      });
    } else {
      group = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 1.8, 1.2),
        new THREE.MeshStandardMaterial({ color: primaryHex, roughness: 0.4 })
      );
      body.position.y = 1.0;
      group.add(body);
    }
    group.position.set(x, y, z);

    const enemyObj = {
      id: "summit_ext_" + archetypeIdx + "_" + Math.round(z),
      type: "summit_ext_creature_" + archetypeIdx,
      name: name,
      mesh: group,
      pos: new THREE.Vector3(x, y, z),
      baseX: x,
      baseY: y,
      baseZ: z,
      hp: hp * 35,
      maxHp: hp * 35,
      attackPower: 18,
      _combatUpgraded: true,
      _archetype: archetypeIdx,
      _isFlyer: !!isFlyer,
      _patrolSpeed: isFlyer ? 4.8 : 4.1,
      _patrolRangeX: 5.2,
      _patrolRangeZ: 2.8,
      _animPhase: Math.random() * 10,
      _projCooldown: 0.8 + Math.random() * 1.3,
      _projInterval: 1.95,
      _projTheme: {
        color: primaryHex,
        emissive: secondaryHex,
        speed: 19.5,
        damage: 16,
        radius: 0.46
      },
      update: function(dt, playerPos, gameInst) {
        if (this.hp <= 0) return;
        if (typeof window.__updateCreatureCombatAI === 'function') {
          window.__updateCreatureCombatAI(this, dt, playerPos, gameInst, archetypeIdx);
        }
        if (playerPos) {
          const d = this.pos.distanceTo(playerPos);
          if (d < 2.1 && playerPos.y > this.pos.y + 1.2 && gameInst.playerVel && gameInst.playerVel.y < 0) {
            this.hp -= 40;
            gameInst.playerVel.y = 13;
            if (window.St && window.St.playEnemyHit) window.St.playEnemyHit();
            if (this.hp <= 0) {
              group.visible = false;
              this.pos.y = -9999;
              group.position.y = -9999;
            }
          } else if (d < 1.7) {
            if (gameInst.damagePlayer) gameInst.damagePlayer(18);
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

  function createPlasmaWatcher(x, y, z) {
    return spawnSummitCreature(x, y, z, "Stratosfer Plazma Gözcüsü 👁️⚡", 10, 0xef4444, 0xfacc15, 3, true);
  }
  function createCrimsonDrake(x, y, z) {
    return spawnSummitCreature(x, y, z, "Kızıl Lav Ejderhası 🐉🔥", 1, 0x991b1b, 0xf97316, 4, true);
  }
  function createLightningKnight(x, y, z) {
    return spawnSummitCreature(x, y, z, "Kozmik Şimşek Şövalyesi ⚡🛡️", 9, 0x3b82f6, 0x67e8f9, 5, false);
  }
  function createFrostLeopard(x, y, z) {
    return spawnSummitCreature(x, y, z, "Zirve Buzul Panteri 🐆❄️", 4, 0xe0f2fe, 0x38bdf8, 4, false);
  }
  function createColossusWarden(x, y, z) {
    return spawnSummitCreature(x, y, z, "Antik Titan Baş Muhafızı 🗿💥", 0, 0x334155, 0xef4444, 6, false);
  }
  function createRedLineAssassin(x, y, z) {
    return spawnSummitCreature(x, y, z, "Kırmızı Çizgi Suikastçısı 🗡️🔴", 16, 0xdc2626, 0x1e293b, 4, false);
  }
  function createAuraSorcerer(x, y, z) {
    return spawnSummitCreature(x, y, z, "Kozmik Aura Büyücüsü 🔮✨", 3, 0x7c3aed, 0xc084fc, 4, true);
  }
  function createQueenHarpy(x, y, z) {
    return spawnSummitCreature(x, y, z, "Stratosfer Harpiya Kraliçesi 🦅🌪️", 12, 0x475569, 0xf43f5e, 4, true);
  }
  function createMeteorGolem(x, y, z) {
    return spawnSummitCreature(x, y, z, "Meteorit Zırhlı Golem ☄️🪨", 6, 0x1c1917, 0xf97316, 6, false);
  }
  function createCrimsonMinotaur(x, y, z) {
    return spawnSummitCreature(x, y, z, "Kızıl Zirve Minotoru 🐂🔥", 11, 0x7f1d1d, 0xfacc15, 6, false);
  }
  function createShadowwingGargoyle(x, y, z) {
    return spawnSummitCreature(x, y, z, "Gölge Kanat Gargoyle 🦇🌑", 8, 0x1e293b, 0xef4444, 4, true);
  }
  function createPolarisWisp(x, y, z) {
    return spawnSummitCreature(x, y, z, "Kutup Yıldızı Serafı 🌟❄️", 13, 0x67e8f9, 0xffffff, 4, true);
  }
  function createShieldbearer(x, y, z) {
    return spawnSummitCreature(x, y, z, "Obsidyen Kalkan Muhafızı 🛡️🖤", 15, 0x0f172a, 0xef4444, 5, false);
  }
  function createCrystalSerpent(x, y, z) {
    return spawnSummitCreature(x, y, z, "Kızıl Kristal Engereği 🐍💎", 5, 0xb91c1c, 0xfacc15, 4, false);
  }
  function createStormGiantHand(x, y, z) {
    return spawnSummitCreature(x, y, z, "Fırtına Devi Akrep Kolosu 🦂⚡", 2, 0x475569, 0x38bdf8, 5, false);
  }
  function createMorisPraetorian(x, y, z) {
    return spawnSummitCreature(x, y, z, "Moris Kraliyet Elit Muhafızı 👑⚔️", 17, 0x701a75, 0xef4444, 6, false);
  }
  function createCelestialArchangelChampion(x, y, z) {
    return spawnSummitCreature(x, y, z, "Göksel Şampiyonluk Başmeleği 🪽🔥", 14, 0xfacc15, 0xef4444, 6, true);
  }

  // =========================================================================
  // MAIN EXTENSION POPULATOR FOR CHAPTER 15 (18 EXTENDED STAGES)
  // =========================================================================
  window.__populateEarthSummitExtension = function(game) {
    if (!window.THREE || !game || !game.scene) return;
    const THREE = window.THREE;
    console.log("⛰️ [Dünya Zirvesi] Orijinal 15 Aşama korundu, 18 Yeni Aşama ve 17 Farklı Canlı Yükleniyor...");

    cleanUpEarthSummitExtension();

    // Expand bounds deeply to z: -6800, y: 300
    if (game.currentLevel && game.currentLevel.bounds) {
      game.currentLevel.bounds.minZ = -7000;
      game.currentLevel.bounds.maxZ = 200;
      game.currentLevel.bounds.minX = -600;
      game.currentLevel.bounds.maxX = 600;
      game.currentLevel.bounds.minY = -60;
      game.currentLevel.bounds.maxY = 500;
    }

    summitExtGroup = new THREE.Group();
    summitExtGroup.name = "earth_summit_18_stages_extension";
    game.scene.add(summitExtGroup);

    const collidables = game.currentLevel.colliders = game.currentLevel.colliders || [];

    // Purge original premature Moris boss and premature portal from z: -2640 so they move to Stage 18
    if (game.scene) {
      const toRemove = [];
      game.scene.traverse(obj => {
        if (obj && (obj.name === "mor_ayi_boss_mesh" || (obj.userData && obj.userData.isVictoryPortal))) {
          toRemove.push(obj);
        }
      });
      toRemove.forEach(obj => {
        if (obj.parent) obj.parent.remove(obj);
      });
    }

    // High quality Celestial & Obsidian Summit Materials
    const obsidianMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.8 });
    const crimsonLineMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 0.8 });
    const cosmicPurpleMat = new THREE.MeshStandardMaterial({ color: 0x581c87, roughness: 0.3 });
    const celestialGoldMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8, roughness: 0.2 });

    function addPlat(w, h, d, px, py, pz, mat) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat || obsidianMat);
      mesh.position.set(px, py, pz);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      summitExtGroup.add(mesh);

      const collider = {
        min: new THREE.Vector3(px - w / 2, py - h / 2, pz - d / 2),
        max: new THREE.Vector3(px + w / 2, py + h / 2 + 0.15, pz + d / 2),
        minX: px - w / 2, maxX: px + w / 2,
        minY: py - h / 2, maxY: py + h / 2,
        minZ: pz - d / 2, maxZ: pz + d / 2
      };
      collidables.push(collider);
      return mesh;
    }

    function addJumpPad(px, py, pz, boost = 22) {
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.0, 0.4, 16), crimsonLineMat);
      pad.position.set(px, py, pz);
      summitExtGroup.add(pad);
      summitExtJumpPads.push({ pos: new THREE.Vector3(px, py + 0.3, pz), boost: boost });
    }

    function addCheckpoint(px, py, pz, label) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 5, 8), obsidianMat);
      pole.position.set(px, py + 2.5, pz);
      const flag = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.0, 0.1), crimsonLineMat);
      flag.position.set(px + 0.9, py + 4.2, pz);
      summitExtGroup.add(pole, flag);
      summitExtCheckpoints.push({ pos: new THREE.Vector3(px, py + 1.5, pz), label: label, triggered: false, flagMesh: flag });
    }

    // -------------------------------------------------------------------------
    // TRANSITION BRIDGE: Connect original Stage 15 (z: -2640) to Stage 1 of Extension (z: -2720)
    // -------------------------------------------------------------------------
    addPlat(14, 2, 80, 0, 51.5, -2680, crimsonLineMat);

    // =========================================================================
    // 18 EXTENDED STAGES (z: -2740 to -6500)
    // =========================================================================
    const summitStages = [
      { name: "1. Aşama: Stratosfer Plazma Koridoru", z: -2760, y: 54, cFn: createPlasmaWatcher },
      { name: "2. Aşama: Lav Ejderi Kanyonu", z: -2970, y: 60, cFn: createCrimsonDrake },
      { name: "3. Aşama: Şimşek Şövalyesi Arenası", z: -3180, y: 66, cFn: createLightningKnight },
      { name: "4. Aşama: Kar Leoparı Sırtı", z: -3390, y: 72, cFn: createFrostLeopard },
      { name: "5. Aşama: Titan Kolos Geçidi", z: -3600, y: 78, cFn: createColossusWarden },
      { name: "6. Aşama: Kırmızı Çizgi Siperleri", z: -3810, y: 84, cFn: createRedLineAssassin },
      { name: "7. Aşama: Büyücü Kule Basamakları", z: -4020, y: 90, cFn: createAuraSorcerer },
      { name: "8. Aşama: Harpiya Rüzgar Tüneli", z: -4230, y: 96, cFn: createQueenHarpy },
      { name: "9. Aşama: Meteorit Çöküntüsü", z: -4440, y: 102, cFn: createMeteorGolem },
      { name: "10. Aşama: Minotor Labirenti", z: -4650, y: 108, cFn: createCrimsonMinotaur },
      { name: "11. Aşama: Gargoyle Kulesi", z: -4860, y: 114, cFn: createShadowwingGargoyle },
      { name: "12. Aşama: Kutup Yıldızı Yolu", z: -5070, y: 120, cFn: createPolarisWisp },
      { name: "13. Aşama: Obsidyen Kalkan Falanksı", z: -5280, y: 126, cFn: createShieldbearer },
      { name: "14. Aşama: Kristal Yılan Sarmalı", z: -5490, y: 132, cFn: createCrystalSerpent },
      { name: "15. Aşama: Fırtına Devinin Pençesi", z: -5700, y: 138, cFn: createStormGiantHand },
      { name: "16. Aşama: Moris Elit Muhafız Barikatı", z: -5910, y: 144, cFn: createMorisPraetorian },
      { name: "17. Aşama: Göksel Şampiyonluk Rampası", z: -6120, y: 152, cFn: createCelestialArchangelChampion }
    ];

    summitStages.forEach(st => {
      addCheckpoint(0, st.y, st.z + 20, st.name);
      addPlat(14, 2, 24, 0, st.y, st.z, obsidianMat);
      addPlat(8, 2, 14, -8, st.y + 3, st.z - 45, cosmicPurpleMat);
      addPlat(8, 2, 14, 8, st.y + 6, st.z - 90, cosmicPurpleMat);
      addPlat(16, 2, 26, 0, st.y + 6, st.z - 135, crimsonLineMat);

      if (st.cFn) {
        const c = st.cFn(0, st.y + 7, st.z - 135);
        summitExtGroup.add(c);
        summitExtCreatures.push(c.userData);
      }
    });

    // Stage 18: GÖKSEL KIRMIZI ÇİZGİ TAHT ARENASI & MORİS BÜYÜK FİNAL BOSS (z: -6350 to -6650)
    addCheckpoint(0, 160, -6350, "18. Aşama: Kırmızı Çizgi Zirvesi - Moris Büyük Final!");
    addPlat(48, 5, 80, 0, 158, -6500, celestialGoldMat);

    // -------------------------------------------------------------------------
    // RELOCATED ULTIMATE FINAL BOSS: MORİS (STAGE 18 - Orijinal Model & Tenrex Çekici)
    // -------------------------------------------------------------------------
    let bossGroup;
    let morisParts = null;

    if (typeof window.__createMorisBossMesh === 'function') {
      const mData = window.__createMorisBossMesh(THREE);
      bossGroup = mData.group;
      morisParts = mData.parts || bossGroup.userData;
    } else {
      bossGroup = new THREE.Group();
      const morisFur = new THREE.MeshStandardMaterial({ color: 0x6b21a8, roughness: 0.75 });
      const armorMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.25 });
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85, roughness: 0.2 });
      const eyeMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 1.8 });
      const torso = new THREE.Mesh(new THREE.BoxGeometry(2.6, 3.4, 2.2), morisFur);
      torso.position.y = 3.2;
      bossGroup.add(torso);
      const chestArmor = new THREE.Mesh(new THREE.BoxGeometry(2.7, 1.8, 0.4), armorMat);
      chestArmor.position.set(0, 3.4, 1.15);
      bossGroup.add(chestArmor);
      const head = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.6, 1.7), morisFur);
      head.position.set(0, 5.3, 0.2);
      bossGroup.add(head);
      [-0.4, 0.4].forEach(ex => {
        const eye = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.15, 0.1), eyeMat);
        eye.position.set(ex, 5.4, 1.06);
        bossGroup.add(eye);
      });
      const hammerHead = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 2.6), goldMat);
      hammerHead.position.set(1.8, 4.6, 2.8);
      bossGroup.add(hammerHead);
    }

    bossGroup.position.set(0, 160, -6520);
    summitExtGroup.add(bossGroup);

    summitExtMorisBoss = {
      id: "boss_summit_moris",
      name: "Kırmızı Çizgi Hakimi Moris 🐻👑",
      mesh: bossGroup,
      group: bossGroup,
      parts: morisParts,
      pos: bossGroup.position,
      hp: 100,
      maxHp: 100,
      isBoss: true,
      baseX: 0,
      baseY: 160,
      baseZ: -6520,
      attackTimer: 1.6,
      isDead: false,
      _combatUpgraded: true,
      update: function(dt, playerPos, gameInst) {
        if (this.isDead || this.hp <= 0) return;
        const t = Date.now() * 0.0025;
        this.attackTimer -= dt;
        bossGroup.position.x = this.baseX + Math.sin(t * 1.2) * 14.0;
        bossGroup.position.z = this.baseZ + Math.cos(t * 0.85) * 10.0;
        bossGroup.position.y = this.baseY + Math.sin(t * 1.5) * 0.5;

        if (this.parts) {
          if (this.parts.legL) this.parts.legL.rotation.x = Math.sin(t * 3.0) * 0.6;
          if (this.parts.legR) this.parts.legR.rotation.x = -Math.sin(t * 3.0) * 0.6;
          if (this.parts.armRGroup) this.parts.armRGroup.rotation.x = Math.sin(t * 2.5) * 0.5;
          if (this.parts.rageAura) {
            this.parts.rageAura.material.opacity = this.hp <= 50 ? 0.55 : 0.0;
          }
        }

        if (playerPos) {
          bossGroup.lookAt(playerPos.x, bossGroup.position.y, playerPos.z);
        }

        if (this.attackTimer <= 0 && playerPos) {
          this.attackTimer = 1.7;
          if (window.St && window.St.playBossRoar) window.St.playBossRoar();
          if (typeof window.__spawnEnemyProjectile === 'function' && bossGroup.position.distanceTo(playerPos) < 46) {
            const fireOrigin = bossGroup.position.clone();
            fireOrigin.y += 5.0;
            window.__spawnEnemyProjectile(gameInst, fireOrigin, playerPos, {
              color: 0xef4444,
              emissive: 0xa855f7,
              speed: 22.0,
              damage: 20,
              radius: 0.75
            });
          }
        }

        if (playerPos) {
          const d = bossGroup.position.distanceTo(playerPos);
          if (d < 5.5 && playerPos.y > bossGroup.position.y + 4.5 && gameInst.playerVel && gameInst.playerVel.y < 0) {
            this.hp -= 10;
            gameInst.playerVel.y = 18;
            if (window.St && window.St.playBossHit) window.St.playBossHit();

            if (this.hp <= 0) {
              this.isDead = true;
              bossGroup.visible = false;
              bossGroup.position.y = -9999;
              if (window.St && window.St.playGoalFanfare) window.St.playGoalFanfare();
              if (gameInst.callbacks && gameInst.callbacks.onShowNotice) {
                gameInst.callbacks.onShowNotice("🏆 MORİS YENİLDİ! EVRENSEL ŞAMPİYONLUK KUPASI KAZANILDI! AYI KÖYÜ PORTALI AÇIK! 🎉", "success");
              }
              if (summitExtVictoryPortal) {
                summitExtVictoryPortal.visible = true;
                summitExtVictoryPortal.position.set(0, 161, -6590);
              }
            }
          } else if (d < 3.5 && (!gameInst.damageInvulnerable || gameInst.damageInvulnerable <= 0)) {
            if (gameInst.takeDamage) gameInst.takeDamage(2);
          }
        }
      }
    };

    // -------------------------------------------------------------------------
    // VICTORY PORTAL TO VILLAGE HUB (at z: -6590)
    // -------------------------------------------------------------------------
    const portalGroup = new THREE.Group();
    portalGroup.position.set(0, 161, -6590);

    const arch = new THREE.Mesh(new THREE.TorusGeometry(4.0, 0.6, 8, 24, Math.PI), celestialGoldMat);
    arch.position.y = 4.5;
    const vortex = new THREE.Mesh(new THREE.PlaneGeometry(7, 8), new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    }));
    vortex.position.y = 4.0;
    portalGroup.add(arch, vortex);
    summitExtGroup.add(portalGroup);
    summitExtVictoryPortal = portalGroup;

    if (game.callbacks && game.callbacks.onShowNotice) {
      game.callbacks.onShowNotice("⛰️ 15. Bölüm Dünya Zirvesi 18 Yeni Aşama ve 17 Farklı Hareketli/Ateş Eden Canlıyla Genişletildi!", "info");
    }
  };

  // =========================================================================
  // UPDATE TICKER FOR CHAPTER 15 EXTENSION
  // =========================================================================
  function updateEarthSummitExtension(dt) {
    const game = window.__superBearGame;
    if (!game || game.currentRegion !== "earth_summit") return;
    const playerPos = game.playerPos;

    if (summitExtMorisBoss && typeof summitExtMorisBoss.update === "function") {
      summitExtMorisBoss.update(dt, playerPos, game);
    }

    if (playerPos && summitExtJumpPads.length > 0) {
      for (let j = 0; j < summitExtJumpPads.length; j++) {
        const pad = summitExtJumpPads[j];
        if (Math.abs(playerPos.x - pad.pos.x) < 2.0 && Math.abs(playerPos.z - pad.pos.z) < 2.0 && Math.abs(playerPos.y - pad.pos.y) < 1.6) {
          if (game.playerVel) {
            game.playerVel.y = pad.boost;
            if (window.St && window.St.playDoubleJump) window.St.playDoubleJump();
          }
        }
      }
    }

    if (playerPos && summitExtCheckpoints.length > 0) {
      for (let k = 0; k < summitExtCheckpoints.length; k++) {
        const cp = summitExtCheckpoints[k];
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

    if (playerPos && summitExtVictoryPortal && summitExtVictoryPortal.visible) {
      const dist = playerPos.distanceTo(summitExtVictoryPortal.position);
      if (dist < 3.5 && (!summitExtVictoryPortal._triggered)) {
        summitExtVictoryPortal._triggered = true;
        if (game.callbacks && game.callbacks.onShowNotice) {
          game.callbacks.onShowNotice("🏆 Şampiyonluk Kutlaması! Neşeli Ayı Köyü'ne Dönülüyor...", "success");
        }
        if (window.St && window.St.playPortal) window.St.playPortal();
        setTimeout(() => {
          if (game.loadRegion) game.loadRegion("hub");
        }, 800);
      }
    }
  }

  const ticker = setInterval(() => {
    if (window.__superBearGame) {
      if (!window.__superBearGame._summitExtTickerHooked) {
        window.__superBearGame._summitExtTickerHooked = true;
        const origUpdate = window.__superBearGame.update;
        window.__superBearGame.update = function(dt, totalTime) {
          origUpdate.call(this, dt, totalTime);
          try {
            updateEarthSummitExtension(dt);
          } catch(e) {}
        };
      }
      clearInterval(ticker);
    }
  }, 100);

  window.__cleanUpEarthSummitExtension = cleanUpEarthSummitExtension;
  window.__updateEarthSummitExtension = updateEarthSummitExtension;
  console.log("⛰️ [Earth Summit Extension] 18-Stage Extension Script Loaded!");
})();
