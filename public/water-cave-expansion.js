// ============================================================================
// 💧 13. BÖLÜM: KARANLIK SU MAĞARASI - 14 YENİ AŞAMA & 12 FARKLI CANLI
// - Orijinal Su Mağarası %100 aynen korundu ("eskisinin üzerine yaz")
// - z: -815 noktasından z: -4000 noktasına uzanan 14 devasa yeni aşama
// - 12 Tamamen Farklı Yeni Canlı (Özgün 3D modeller ve benzersiz mekanikler)
// - Taşınan Dev Su Ejderhası Boss (14. Aşamada Yeraltı Mabedinde) & 14. Bölüm Arılar Çölü Portalı
// ============================================================================
(function() {
  'use strict';

  let caveExtensionGroup = null;
  let caveCreatures = [];
  let caveJumpPads = [];
  let caveCheckpoints = [];
  let caveDragonBoss = null;
  let caveVictoryPortal = null;

  function cleanUpWaterCaveExtension() {
    const game = window.__superBearGame;
    if (caveExtensionGroup && game && game.scene) {
      game.scene.remove(caveExtensionGroup);
      caveExtensionGroup = null;
    }
    caveCreatures = [];
    caveJumpPads = [];
    caveCheckpoints = [];
    caveDragonBoss = null;
    caveVictoryPortal = null;
  }

  // =========================================================================
  // 12 UNIQUE WATER CAVE CREATURES
  // =========================================================================

  // 1. Shadow Mole Miner
  function createMoleMiner(x, y, z) {
    const THREE = window.THREE;
    const group = new THREE.Group();
    group.position.set(x, y, z);
    const brownMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.8, 1.6, 10), brownMat);
    body.position.y = 0.8;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), brownMat);
    head.position.y = 1.8;
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.4, 6), new THREE.MeshStandardMaterial({ color: 0xf472b6 }));
    nose.rotation.x = Math.PI / 2;
    nose.position.set(0, 1.8, 0.55);
    const pick = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.4, 0.15), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 }));
    pick.position.set(0.65, 1.0, 0.3);
    group.add(body, head, nose, pick);

    group.userData = {
      type: "mole_miner",
      hp: 3,
      baseY: y,
      startX: x,
      dir: 1,
      update: function(dt, playerPos, game) {
        group.position.x += this.dir * dt * 2.5;
        if (Math.abs(group.position.x - this.startX) > 5) this.dir *= -1;
        if (playerPos) {
          const d = group.position.distanceTo(playerPos);
          if (d < 1.7 && playerPos.y > group.position.y + 1.2 && game.playerVel && game.playerVel.y < 0) {
            this.hp--;
            game.playerVel.y = 11;
            if (window.St && window.St.playEnemyHit) window.St.playEnemyHit();
            if (this.hp <= 0) { group.visible = false; group.position.y = -9999; }
          } else if (d < 1.4 && (!game.damageInvulnerable || game.damageInvulnerable <= 0)) {
            if (game.takeDamage) game.takeDamage(1);
          }
        }
      }
    };
    return group;
  }

  // 2. Luminescent Salamander
  function createLuminescentSalamander(x, y, z) {
    const THREE = window.THREE;
    const group = new THREE.Group();
    group.position.set(x, y, z);
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0891b2, emissiveIntensity: 0.6, roughness: 0.2 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 1.8), blueMat);
    body.position.y = 0.3;
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1.4, 6), blueMat);
    tail.rotation.x = -Math.PI / 2;
    tail.position.set(0, 0.3, -1.5);
    group.add(body, tail);

    group.userData = {
      type: "salamander",
      hp: 2,
      baseY: y,
      time: Math.random() * 5,
      startZ: z,
      dir: 1,
      update: function(dt, playerPos, game) {
        group.position.z += this.dir * dt * 2.8;
        if (Math.abs(group.position.z - this.startZ) > 6) this.dir *= -1;
        if (playerPos) {
          const d = group.position.distanceTo(playerPos);
          if (d < 1.6 && playerPos.y > group.position.y + 0.6 && game.playerVel && game.playerVel.y < 0) {
            this.hp--;
            game.playerVel.y = 10;
            if (window.St && window.St.playEnemyHit) window.St.playEnemyHit();
            if (this.hp <= 0) { group.visible = false; group.position.y = -9999; }
          } else if (d < 1.3 && (!game.damageInvulnerable || game.damageInvulnerable <= 0)) {
            if (game.takeDamage) game.takeDamage(1);
          }
        }
      }
    };
    return group;
  }

  // 3. Abyssal Angler Lurker
  function createAnglerLurker(x, y, z) {
    const THREE = window.THREE;
    const group = new THREE.Group();
    group.position.set(x, y, z);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
    const lureMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.9, 10, 10), bodyMat);
    body.scale.set(1, 0.8, 1.4);
    body.position.y = 1.0;
    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2, 6), bodyMat);
    antenna.position.set(0, 2.0, 0.6);
    antenna.rotation.x = Math.PI / 4;
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), lureMat);
    bulb.position.set(0, 2.4, 1.1);
    group.add(body, antenna, bulb);

    group.userData = {
      type: "angler",
      hp: 3,
      baseY: y,
      time: Math.random() * 5,
      update: function(dt, playerPos, game) {
        this.time += dt;
        group.position.y = this.baseY + Math.sin(this.time * 2) * 1.2;
        if (playerPos) {
          const d = group.position.distanceTo(playerPos);
          if (d < 1.8 && playerPos.y > group.position.y + 0.8 && game.playerVel && game.playerVel.y < 0) {
            this.hp--;
            game.playerVel.y = 11;
            if (window.St && window.St.playEnemyHit) window.St.playEnemyHit();
            if (this.hp <= 0) { group.visible = false; group.position.y = -9999; }
          } else if (d < 1.4 && (!game.damageInvulnerable || game.damageInvulnerable <= 0)) {
            if (game.takeDamage) game.takeDamage(1);
          }
        }
      }
    };
    return group;
  }

  // 4. Crystal Cave Crab
  function createCrystalCrab(x, y, z) {
    const THREE = window.THREE;
    const group = new THREE.Group();
    group.position.set(x, y, z);
    const shellMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.2, metalness: 0.4 });
    const shell = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.1, 0.5, 8), shellMat);
    shell.position.y = 0.3;
    const clawL = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.8), shellMat);
    clawL.position.set(-1.1, 0.4, 0.6);
    const clawR = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.8), shellMat);
    clawR.position.set(1.1, 0.4, 0.6);
    group.add(shell, clawL, clawR);

    group.userData = {
      type: "crystal_crab",
      hp: 3,
      baseY: y,
      startX: x,
      dir: 1,
      update: function(dt, playerPos, game) {
        group.position.x += this.dir * dt * 3.5;
        if (Math.abs(group.position.x - this.startX) > 6) this.dir *= -1;
        if (playerPos) {
          const d = group.position.distanceTo(playerPos);
          if (d < 1.7 && playerPos.y > group.position.y + 0.6 && game.playerVel && game.playerVel.y < 0) {
            this.hp--;
            game.playerVel.y = 11;
            if (window.St && window.St.playEnemyHit) window.St.playEnemyHit();
            if (this.hp <= 0) { group.visible = false; group.position.y = -9999; }
          } else if (d < 1.4 && (!game.damageInvulnerable || game.damageInvulnerable <= 0)) {
            if (game.takeDamage) game.takeDamage(1);
          }
        }
      }
    };
    return group;
  }

  // 5. Cavern Stingray
  function createCavernStingray(x, y, z) {
    const THREE = window.THREE;
    const group = new THREE.Group();
    group.position.set(x, y, z);
    const rayMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, transparent: true, opacity: 0.9 });
    const body = new THREE.Mesh(new THREE.ConeGeometry(1.6, 0.2, 4), rayMat);
    body.rotation.y = Math.PI / 4;
    body.position.y = 1.0;
    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.5, 6), rayMat);
    tail.rotation.x = Math.PI / 2;
    tail.position.set(0, 1.0, -1.8);
    group.add(body, tail);

    group.userData = {
      type: "stingray",
      hp: 2,
      baseY: y,
      time: Math.random() * 5,
      update: function(dt, playerPos, game) {
        this.time += dt;
        group.position.y = this.baseY + Math.sin(this.time * 2) * 1.3;
        group.rotation.z = Math.sin(this.time * 3) * 0.2;
        if (playerPos) {
          const d = group.position.distanceTo(playerPos);
          if (d < 1.8 && playerPos.y > group.position.y + 0.6 && game.playerVel && game.playerVel.y < 0) {
            this.hp--;
            game.playerVel.y = 10;
            if (window.St && window.St.playEnemyHit) window.St.playEnemyHit();
            if (this.hp <= 0) { group.visible = false; group.position.y = -9999; }
          } else if (d < 1.4 && (!game.damageInvulnerable || game.damageInvulnerable <= 0)) {
            if (game.takeDamage) game.takeDamage(1);
          }
        }
      }
    };
    return group;
  }

  // 6. Steam Wraith
  function createSteamWraith(x, y, z) {
    const THREE = window.THREE;
    const group = new THREE.Group();
    group.position.set(x, y, z);
    const steamMat = new THREE.MeshStandardMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.7, emissive: 0x38bdf8, emissiveIntensity: 0.4 });
    const wisp = new THREE.Mesh(new THREE.SphereGeometry(0.8, 10, 10), steamMat);
    wisp.position.y = 1.2;
    group.add(wisp);

    group.userData = {
      type: "steam_wraith",
      hp: 2,
      baseY: y,
      time: Math.random() * 5,
      update: function(dt, playerPos, game) {
        this.time += dt * 2.5;
        group.position.y = this.baseY + Math.sin(this.time) * 1.5;
        group.rotation.y += dt * 1.5;
        if (playerPos) {
          const d = group.position.distanceTo(playerPos);
          if (d < 1.6 && playerPos.y > group.position.y + 0.8 && game.playerVel && game.playerVel.y < 0) {
            this.hp--;
            game.playerVel.y = 11;
            if (window.St && window.St.playEnemyHit) window.St.playEnemyHit();
            if (this.hp <= 0) { group.visible = false; group.position.y = -9999; }
          } else if (d < 1.3 && (!game.damageInvulnerable || game.damageInvulnerable <= 0)) {
            if (game.takeDamage) game.takeDamage(1);
          }
        }
      }
    };
    return group;
  }

  // 7. Emerald Cavern Eel
  function createEmeraldEel(x, y, z) {
    const THREE = window.THREE;
    const group = new THREE.Group();
    group.position.set(x, y, z);
    const eelMat = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.5 });
    for (let s = 0; s < 4; s++) {
      const seg = new THREE.Mesh(new THREE.SphereGeometry(0.5 - s * 0.08, 8, 8), eelMat);
      seg.position.set(0, 0.8, -s * 0.7);
      group.add(seg);
    }

    group.userData = {
      type: "emerald_eel",
      hp: 3,
      baseY: y,
      time: Math.random() * 5,
      startX: x,
      dir: 1,
      update: function(dt, playerPos, game) {
        group.position.x += this.dir * dt * 3.0;
        if (Math.abs(group.position.x - this.startX) > 6) this.dir *= -1;
        if (playerPos) {
          const d = group.position.distanceTo(playerPos);
          if (d < 1.7 && playerPos.y > group.position.y + 0.6 && game.playerVel && game.playerVel.y < 0) {
            this.hp--;
            game.playerVel.y = 11;
            if (window.St && window.St.playEnemyHit) window.St.playEnemyHit();
            if (this.hp <= 0) { group.visible = false; group.position.y = -9999; }
          } else if (d < 1.4 && (!game.damageInvulnerable || game.damageInvulnerable <= 0)) {
            if (game.takeDamage) game.takeDamage(1);
          }
        }
      }
    };
    return group;
  }

  // 8. Echo Bat Drone
  function createEchoBat(x, y, z) {
    const THREE = window.THREE;
    const group = new THREE.Group();
    group.position.set(x, y, z);
    const batMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), batMat);
    const wingL = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.05, 0.5), batMat);
    wingL.position.x = -0.7;
    const wingR = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.05, 0.5), batMat);
    wingR.position.x = 0.7;
    group.add(body, wingL, wingR);

    group.userData = {
      type: "echo_bat",
      hp: 2,
      baseY: y,
      time: Math.random() * 5,
      wingL, wingR,
      update: function(dt, playerPos, game) {
        this.time += dt * 4;
        wingL.rotation.z = Math.sin(this.time * 5) * 0.7;
        wingR.rotation.z = -Math.sin(this.time * 5) * 0.7;
        group.position.y = this.baseY + Math.sin(this.time) * 1.5;
        if (playerPos) {
          const d = group.position.distanceTo(playerPos);
          if (d < 1.6 && playerPos.y > group.position.y + 0.4 && game.playerVel && game.playerVel.y < 0) {
            this.hp--;
            game.playerVel.y = 10;
            if (window.St && window.St.playEnemyHit) window.St.playEnemyHit();
            if (this.hp <= 0) { group.visible = false; group.position.y = -9999; }
          } else if (d < 1.3 && (!game.damageInvulnerable || game.damageInvulnerable <= 0)) {
            if (game.takeDamage) game.takeDamage(1);
          }
        }
      }
    };
    return group;
  }

  // 9. Moss Slime Crawler
  function createMossSlime(x, y, z) {
    const THREE = window.THREE;
    const group = new THREE.Group();
    group.position.set(x, y, z);
    const slimeMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.3, transparent: true, opacity: 0.9 });
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.7, 10, 10), slimeMat);
    body.scale.set(1.2, 0.6, 1.2);
    body.position.y = 0.35;
    group.add(body);

    group.userData = {
      type: "moss_slime",
      hp: 3,
      baseY: y,
      timer: 0,
      startX: x,
      dir: 1,
      update: function(dt, playerPos, game) {
        this.timer += dt * 3;
        group.position.x += this.dir * dt * 2.2;
        group.scale.y = 1.0 + Math.sin(this.timer) * 0.2;
        if (Math.abs(group.position.x - this.startX) > 5) this.dir *= -1;
        if (playerPos) {
          const d = group.position.distanceTo(playerPos);
          if (d < 1.6 && playerPos.y > group.position.y + 0.5 && game.playerVel && game.playerVel.y < 0) {
            this.hp--;
            game.playerVel.y = 11;
            if (window.St && window.St.playEnemyHit) window.St.playEnemyHit();
            if (this.hp <= 0) { group.visible = false; group.position.y = -9999; }
          } else if (d < 1.3 && (!game.damageInvulnerable || game.damageInvulnerable <= 0)) {
            if (game.takeDamage) game.takeDamage(1);
          }
        }
      }
    };
    return group;
  }

  // 10. Armored Placoderm (Prehistoric armored fish)
  function createArmoredFish(x, y, z) {
    const THREE = window.THREE;
    const group = new THREE.Group();
    group.position.set(x, y, z);
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });
    const body = new THREE.Mesh(new THREE.ConeGeometry(0.7, 2.0, 6), ironMat);
    body.rotation.x = Math.PI / 2;
    body.position.y = 1.0;
    group.add(body);

    group.userData = {
      type: "placoderm",
      hp: 4,
      baseY: y,
      startZ: z,
      dir: 1,
      update: function(dt, playerPos, game) {
        group.position.z += this.dir * dt * 3.2;
        if (Math.abs(group.position.z - this.startZ) > 7) this.dir *= -1;
        if (playerPos) {
          const d = group.position.distanceTo(playerPos);
          if (d < 1.8 && playerPos.y > group.position.y + 0.7 && game.playerVel && game.playerVel.y < 0) {
            this.hp -= 2;
            game.playerVel.y = 11;
            if (window.St && window.St.playEnemyHit) window.St.playEnemyHit();
            if (this.hp <= 0) { group.visible = false; group.position.y = -9999; }
          } else if (d < 1.5 && (!game.damageInvulnerable || game.damageInvulnerable <= 0)) {
            if (game.takeDamage) game.takeDamage(1);
          }
        }
      }
    };
    return group;
  }

  // 11. Crystal Jellyfish Floater
  function createCrystalJellyfish(x, y, z) {
    const THREE = window.THREE;
    const group = new THREE.Group();
    group.position.set(x, y, z);
    const jellyMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, transparent: true, opacity: 0.8, emissive: 0x7e22ce, emissiveIntensity: 0.5 });
    const bell = new THREE.Mesh(new THREE.SphereGeometry(0.8, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2), jellyMat);
    bell.rotation.x = Math.PI;
    bell.position.y = 1.4;
    group.add(bell);

    group.userData = {
      type: "jellyfish",
      hp: 2,
      baseY: y,
      time: Math.random() * 5,
      update: function(dt, playerPos, game) {
        this.time += dt * 2;
        group.position.y = this.baseY + Math.sin(this.time) * 1.6;
        if (playerPos) {
          const d = group.position.distanceTo(playerPos);
          if (d < 1.7 && playerPos.y > group.position.y + 0.8 && game.playerVel && game.playerVel.y < 0) {
            this.hp--;
            game.playerVel.y = 11;
            if (window.St && window.St.playEnemyHit) window.St.playEnemyHit();
            if (this.hp <= 0) { group.visible = false; group.position.y = -9999; }
          } else if (d < 1.4 && (!game.damageInvulnerable || game.damageInvulnerable <= 0)) {
            if (game.takeDamage) game.takeDamage(1);
          }
        }
      }
    };
    return group;
  }

  // 12. Cave Troll Fisher
  function createCaveTroll(x, y, z) {
    const THREE = window.THREE;
    const group = new THREE.Group();
    group.position.set(x, y, z);
    const skinMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.0, 1.2), skinMat);
    body.position.y = 1.5;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 8), skinMat);
    head.position.y = 2.8;
    const club = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.4, 2.0, 6), skinMat);
    club.position.set(1.1, 1.6, 0.4);
    group.add(body, head, club);

    group.userData = {
      type: "cave_troll",
      hp: 6,
      baseY: y,
      update: function(dt, playerPos, game) {
        group.rotation.y += dt * 0.7;
        if (playerPos) {
          const d = group.position.distanceTo(playerPos);
          if (d < 2.0 && playerPos.y > group.position.y + 2.0 && game.playerVel && game.playerVel.y < 0) {
            this.hp -= 2;
            game.playerVel.y = 12;
            if (window.St && window.St.playEnemyHit) window.St.playEnemyHit();
            if (this.hp <= 0) { group.visible = false; group.position.y = -9999; }
          } else if (d < 1.8 && (!game.damageInvulnerable || game.damageInvulnerable <= 0)) {
            if (game.takeDamage) game.takeDamage(1);
          }
        }
      }
    };
    return group;
  }

  // =========================================================================
  // MAIN EXTENSION POPULATOR FOR CHAPTER 13 (14 EXTENDED STAGES)
  // =========================================================================
  window.__populateWaterCaveExtension = function(game) {
    if (!window.THREE || !game || !game.scene) return;
    const THREE = window.THREE;
    console.log("💧 [Su Mağarası] Orijinal Mağara korundu, 14 Yeni Aşama ve 12 Farklı Canlı Yükleniyor...");

    cleanUpWaterCaveExtension();

    if (game.currentLevel && game.currentLevel.bounds) {
      game.currentLevel.bounds.minZ = -4300;
      game.currentLevel.bounds.maxZ = 200;
      game.currentLevel.bounds.minX = -500;
      game.currentLevel.bounds.maxX = 500;
      game.currentLevel.bounds.minY = -60;
      game.currentLevel.bounds.maxY = 400;
    }

    caveExtensionGroup = new THREE.Group();
    caveExtensionGroup.name = "water_cave_14_stages_extension";
    game.scene.add(caveExtensionGroup);

    const collidables = game.currentLevel.colliders = game.currentLevel.colliders || [];

    // Purge premature exit portal and premature water dragon from original section
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

    // Cave Materials
    const darkSlateMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
    const biolumCyanMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0891b2, emissiveIntensity: 0.4, roughness: 0.3 });
    const deepAmethystMat = new THREE.MeshStandardMaterial({ color: 0x6b21a8, emissive: 0x581c87, emissiveIntensity: 0.4, roughness: 0.2 });
    const mossStoneMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.8 });
    const crystalPlatMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, transparent: true, opacity: 0.9 });

    function addPlat(w, h, d, px, py, pz, mat) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat || darkSlateMat);
      mesh.position.set(px, py, pz);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      caveExtensionGroup.add(mesh);

      const collider = {
        minX: px - w / 2, maxX: px + w / 2,
        minY: py - h / 2, maxY: py + h / 2,
        minZ: pz - d / 2, maxZ: pz + d / 2
      };
      collidables.push(collider);
      return mesh;
    }

    function addJumpPad(px, py, pz, boost = 20) {
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.0, 0.4, 16), new THREE.MeshStandardMaterial({ color: 0x0ea5e9, emissive: 0x0284c7, emissiveIntensity: 0.9 }));
      pad.position.set(px, py, pz);
      caveExtensionGroup.add(pad);
      caveJumpPads.push({ pos: new THREE.Vector3(px, py + 0.3, pz), boost: boost });
    }

    function addCheckpoint(px, py, pz, label) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 5, 8), darkSlateMat);
      pole.position.set(px, py + 2.5, pz);
      const flag = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.0, 0.1), new THREE.MeshStandardMaterial({ color: 0x0ea5e9, emissive: 0x0284c7, emissiveIntensity: 0.6 }));
      flag.position.set(px + 0.9, py + 4.2, pz);
      caveExtensionGroup.add(pole, flag);
      caveCheckpoints.push({ pos: new THREE.Vector3(px, py + 1.5, pz), label: label, triggered: false, flagMesh: flag });
    }

    // -------------------------------------------------------------------------
    // TRANSITION BRIDGE: Connect original end (z: -815) to Stage 1 (z: -850)
    // -------------------------------------------------------------------------
    addPlat(12, 2, 45, 0, 31, -830, biolumCyanMat);

    // =========================================================================
    // 14 EXTENDED STAGES
    // =========================================================================

    // Stage 1: Biyolüminesans Mantar Ormanı (z: -850 to -1050)
    addCheckpoint(0, 31, -850, "1. Aşama: Mantar Ormanı");
    addPlat(14, 2, 24, 0, 31, -870, mossStoneMat);
    addPlat(7, 2, 14, -8, 33, -920, biolumCyanMat);
    addPlat(7, 2, 14, 8, 35, -960, biolumCyanMat);
    addPlat(16, 2, 25, 0, 37, -1010, mossStoneMat);
    const mole = createMoleMiner(0, 38, -1010);
    caveExtensionGroup.add(mole);
    caveCreatures.push(mole.userData);

    // Stage 2: Kristal Sarkıt Köprüleri (z: -1060 to -1270)
    addCheckpoint(0, 37, -1060, "2. Aşama: Kristal Sarkıt Köprüleri");
    addPlat(12, 2, 20, 0, 37, -1080, crystalPlatMat);
    addPlat(6, 2, 12, -7, 39, -1130, darkSlateMat);
    addPlat(6, 2, 12, 7, 41, -1170, darkSlateMat);
    addPlat(14, 2, 24, 0, 43, -1220, crystalPlatMat);
    const salamander = createLuminescentSalamander(0, 44, -1220);
    caveExtensionGroup.add(salamander);
    caveCreatures.push(salamander.userData);

    // Stage 3: Yeraltı Gayzerleri & Buhar Asansörleri (z: -1280 to -1490)
    addCheckpoint(0, 43, -1280, "3. Aşama: Yeraltı Gayzerleri");
    addPlat(14, 2, 22, 0, 43, -1300, darkSlateMat);
    addJumpPad(0, 44, -1310, 22);
    addPlat(8, 2, 14, 0, 56, -1360, biolumCyanMat);
    addPlat(8, 2, 14, -8, 58, -1400, deepAmethystMat);
    addPlat(8, 2, 14, 8, 60, -1440, deepAmethystMat);
    addPlat(16, 2, 25, 0, 62, -1480, darkSlateMat);
    const angler = createAnglerLurker(0, 64, -1480);
    caveExtensionGroup.add(angler);
    caveCreatures.push(angler.userData);

    // Stage 4: Dönen Su Çarkları & Yosunlu Bloklar (z: -1500 to -1710)
    addCheckpoint(0, 62, -1500, "4. Aşama: Su Çarkları");
    addPlat(12, 2, 20, 0, 62, -1520, mossStoneMat);
    addPlat(6, 2, 12, -7, 60, -1570, darkSlateMat);
    addPlat(6, 2, 12, 7, 58, -1610, darkSlateMat);
    addPlat(14, 2, 24, 0, 56, -1660, mossStoneMat);
    const crab = createCrystalCrab(0, 57, -1660);
    caveExtensionGroup.add(crab);
    caveCreatures.push(crab.userData);

    // Stage 5: Batık Yeraltı Tapınağı Sütunları (z: -1720 to -1930)
    addCheckpoint(0, 56, -1720, "5. Aşama: Batık Tapınak Sütunları");
    addPlat(14, 2, 22, 0, 56, -1740, darkSlateMat);
    addPlat(8, 2, 14, -8, 54, -1790, deepAmethystMat);
    addPlat(8, 2, 14, 8, 52, -1830, deepAmethystMat);
    addPlat(16, 2, 25, 0, 50, -1880, darkSlateMat);
    const ray = createCavernStingray(0, 52, -1880);
    caveExtensionGroup.add(ray);
    caveCreatures.push(ray.userData);

    // Stage 6: Parlayan Ametist Resifleri (z: -1940 to -2150)
    addCheckpoint(0, 50, -1940, "6. Aşama: Ametist Resifleri");
    addPlat(14, 2, 22, 0, 50, -1960, deepAmethystMat);
    addPlat(6, 2, 12, -7, 52, -2010, crystalPlatMat);
    addPlat(6, 2, 12, 7, 54, -2050, crystalPlatMat);
    addPlat(16, 2, 25, 0, 56, -2100, deepAmethystMat);
    const wraith = createSteamWraith(0, 58, -2100);
    caveExtensionGroup.add(wraith);
    caveCreatures.push(wraith.userData);

    // Stage 7: Derin Mağara Uçurum Kalasları (z: -2160 to -2370)
    addCheckpoint(0, 56, -2160, "7. Aşama: Uçurum Kalasları");
    addPlat(12, 2, 20, 0, 56, -2180, darkSlateMat);
    addPlat(5, 2, 12, -6, 54, -2230, mossStoneMat);
    addPlat(5, 2, 12, 6, 52, -2270, mossStoneMat);
    addPlat(14, 2, 24, 0, 50, -2320, darkSlateMat);
    const eel = createEmeraldEel(0, 51, -2320);
    caveExtensionGroup.add(eel);
    caveCreatures.push(eel.userData);

    // Stage 8: Hidrotermal Baca Basamakları (z: -2380 to -2590)
    addCheckpoint(0, 50, -2380, "8. Aşama: Hidrotermal Bacalar");
    addPlat(14, 2, 22, 0, 50, -2400, darkSlateMat);
    addPlat(7, 2, 14, -8, 52, -2450, biolumCyanMat);
    addPlat(7, 2, 14, 8, 54, -2490, biolumCyanMat);
    addPlat(16, 2, 25, 0, 56, -2540, darkSlateMat);
    const bat = createEchoBat(0, 58, -2540);
    caveExtensionGroup.add(bat);
    caveCreatures.push(bat.userData);

    // Stage 9: Kaygan Buzul Sarkıtlar (z: -2600 to -2810)
    addCheckpoint(0, 56, -2600, "9. Aşama: Buzul Sarkıtlar");
    addPlat(14, 2, 20, 0, 56, -2620, crystalPlatMat);
    addPlat(6, 2, 12, -7, 54, -2670, crystalPlatMat);
    addPlat(6, 2, 12, 7, 52, -2710, crystalPlatMat);
    addPlat(16, 2, 25, 0, 50, -2760, crystalPlatMat);
    const slime = createMossSlime(0, 51, -2760);
    caveExtensionGroup.add(slime);
    caveCreatures.push(slime.userData);

    // Stage 10: Yeraltı Akıntı Kanalları (z: -2820 to -3030)
    addCheckpoint(0, 50, -2820, "10. Aşama: Akıntı Kanalları");
    addPlat(14, 2, 22, 0, 50, -2840, darkSlateMat);
    addPlat(8, 2, 14, -8, 48, -2890, mossStoneMat);
    addPlat(8, 2, 14, 8, 46, -2930, mossStoneMat);
    addPlat(16, 2, 25, 0, 44, -2980, darkSlateMat);
    const fish = createArmoredFish(0, 46, -2980);
    caveExtensionGroup.add(fish);
    caveCreatures.push(fish.userData);

    // Stage 11: Köstebek Maden Rayları (z: -3040 to -3250)
    addCheckpoint(0, 44, -3040, "11. Aşama: Maden Rayları");
    addPlat(14, 2, 20, 0, 44, -3060, darkSlateMat);
    addPlat(6, 2, 12, -7, 46, -3110, deepAmethystMat);
    addPlat(6, 2, 12, 7, 48, -3150, deepAmethystMat);
    addPlat(16, 2, 25, 0, 50, -3200, darkSlateMat);
    const jelly = createCrystalJellyfish(0, 52, -3200);
    caveExtensionGroup.add(jelly);
    caveCreatures.push(jelly.userData);

    // Stage 12: Zümrüt Havuz Adacıkları (z: -3260 to -3470)
    addCheckpoint(0, 50, -3260, "12. Aşama: Zümrüt Havuz Adaları");
    addPlat(14, 2, 22, 0, 50, -3280, mossStoneMat);
    addPlat(7, 2, 14, -8, 48, -3330, biolumCyanMat);
    addPlat(7, 2, 14, 8, 46, -3370, biolumCyanMat);
    addPlat(16, 2, 25, 0, 44, -3420, mossStoneMat);
    const troll = createCaveTroll(0, 45, -3420);
    caveExtensionGroup.add(troll);
    caveCreatures.push(troll.userData);

    // Stage 13: Ejderha İni Boğazı (z: -3480 to -3690)
    addCheckpoint(0, 44, -3480, "13. Aşama: Ejderha İni Boğazı");
    addPlat(16, 2, 25, 0, 44, -3500, deepAmethystMat);
    addJumpPad(0, 45, -3510, 22);
    addPlat(8, 2, 14, 0, 58, -3560, darkSlateMat);
    addPlat(8, 2, 14, -8, 54, -3600, crystalPlatMat);
    addPlat(8, 2, 14, 8, 50, -3640, crystalPlatMat);
    addPlat(18, 2, 28, 0, 46, -3680, deepAmethystMat);

    // Stage 14: BÜYÜK SU EJDERHASI YERALTI MABEDİ (z: -3720 to -4000)
    addCheckpoint(0, 46, -3720, "14. Aşama: Ejderha Mabedi - Patron Arenası");
    addPlat(42, 4, 70, 0, 44, -3870, deepAmethystMat);

    // -------------------------------------------------------------------------
    // RELOCATED BOSS: DEV SU EJDERHASI (STAGE 14)
    // -------------------------------------------------------------------------
    const bossGroup = new THREE.Group();
    bossGroup.position.set(0, 46, -3890);

    const dragonMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3, emissive: 0x0369a1, emissiveIntensity: 0.4 });
    const hornMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2 });

    const torso = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.8, 8, 16), dragonMat);
    torso.position.y = 4.5;
    bossGroup.add(torso);

    const head = new THREE.Mesh(new THREE.ConeGeometry(2.0, 4.0, 12), dragonMat);
    head.rotation.x = Math.PI / 2;
    head.position.set(0, 8.5, 2.0);
    bossGroup.add(head);

    // Cyan horns
    [-1.2, 1.2].forEach(hx => {
      const horn = new THREE.Mesh(new THREE.ConeGeometry(0.4, 2.5, 8), hornMat);
      horn.position.set(hx, 10.5, 0.5);
      horn.rotation.z = hx > 0 ? -0.5 : 0.5;
      bossGroup.add(horn);
    });

    caveExtensionGroup.add(bossGroup);

    caveDragonBoss = {
      group: bossGroup,
      hp: 50,
      maxHp: 50,
      baseY: 46,
      attackTimer: 2.0,
      isDead: false,
      update: function(dt, playerPos, game) {
        if (this.isDead) return;
        this.attackTimer -= dt;
        bossGroup.position.y = this.baseY + Math.sin(Date.now() * 0.003) * 1.2;
        bossGroup.rotation.y += dt * 0.6;

        if (playerPos) {
          bossGroup.lookAt(playerPos.x, bossGroup.position.y, playerPos.z);
        }

        if (this.attackTimer <= 0) {
          this.attackTimer = 2.2;
          if (window.St && window.St.playBossRoar) window.St.playBossRoar();
        }

        if (playerPos) {
          const d = bossGroup.position.distanceTo(playerPos);
          if (d < 4.5 && playerPos.y > bossGroup.position.y + 7.0 && game.playerVel && game.playerVel.y < 0) {
            this.hp -= 5;
            game.playerVel.y = 15;
            if (window.St && window.St.playBossHit) window.St.playBossHit();

            if (this.hp <= 0) {
              this.isDead = true;
              bossGroup.visible = false;
              bossGroup.position.y = -9999;
              if (window.St && window.St.playGoalFanfare) window.St.playGoalFanfare();
              if (game.callbacks && game.callbacks.onShowNotice) {
                game.callbacks.onShowNotice("🎉 Dev Su Ejderhası Yenildi! 14. Bölüm: Arılar Çölü Portalı Açıldı! 🏜️", "success");
              }
              if (caveVictoryPortal) {
                caveVictoryPortal.visible = true;
                caveVictoryPortal.position.set(0, 47, -3960);
              }
            }
          } else if (d < 3.2 && (!game.damageInvulnerable || game.damageInvulnerable <= 0)) {
            if (game.takeDamage) game.takeDamage(2);
          }
        }
      }
    };

    // -------------------------------------------------------------------------
    // VICTORY PORTAL TO CHAPTER 14: BEE DESERT (at z: -3960)
    // -------------------------------------------------------------------------
    const portalGroup = new THREE.Group();
    portalGroup.position.set(0, 47, -3960);

    const arch = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.5, 8, 20, Math.PI), deepAmethystMat);
    arch.position.y = 4;
    const vortex = new THREE.Mesh(new THREE.PlaneGeometry(6, 7), new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    }));
    vortex.position.y = 3.5;
    portalGroup.add(arch, vortex);
    caveExtensionGroup.add(portalGroup);
    caveVictoryPortal = portalGroup;

    if (game.callbacks && game.callbacks.onShowNotice) {
      game.callbacks.onShowNotice("💧 13. Bölüm Su Mağarası 14 Yeni Aşamayla Genişletildi! 12 Yeni Canlı Eklendi!", "info");
    }
  };

  // =========================================================================
  // UPDATE TICKER FOR CHAPTER 13 EXTENSION
  // =========================================================================
  function updateWaterCaveExtension(dt) {
    const game = window.__superBearGame;
    if (!game || game.currentRegion !== "water_cave") return;
    const playerPos = game.playerPos;

    for (let i = 0; i < caveCreatures.length; i++) {
      const c = caveCreatures[i];
      if (c && typeof c.update === "function") {
        c.update(dt, playerPos, game);
      }
    }

    if (caveDragonBoss && typeof caveDragonBoss.update === "function") {
      caveDragonBoss.update(dt, playerPos, game);
    }

    if (playerPos && caveJumpPads.length > 0) {
      for (let j = 0; j < caveJumpPads.length; j++) {
        const pad = caveJumpPads[j];
        if (Math.abs(playerPos.x - pad.pos.x) < 2.0 && Math.abs(playerPos.z - pad.pos.z) < 2.0 && Math.abs(playerPos.y - pad.pos.y) < 1.6) {
          if (game.playerVel) {
            game.playerVel.y = pad.boost;
            if (window.St && window.St.playDoubleJump) window.St.playDoubleJump();
          }
        }
      }
    }

    if (playerPos && caveCheckpoints.length > 0) {
      for (let k = 0; k < caveCheckpoints.length; k++) {
        const cp = caveCheckpoints[k];
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

    if (playerPos && caveVictoryPortal && caveVictoryPortal.visible) {
      const dist = playerPos.distanceTo(caveVictoryPortal.position);
      if (dist < 3.2 && (!caveVictoryPortal._triggered)) {
        caveVictoryPortal._triggered = true;
        if (game.callbacks && game.callbacks.onShowNotice) {
          game.callbacks.onShowNotice("🏜️ 14. Bölüm: Arılar Çölü'ne Geçiliyor...", "success");
        }
        if (window.St && window.St.playPortal) window.St.playPortal();
        setTimeout(() => {
          if (game.loadRegion) game.loadRegion("bee_desert");
        }, 800);
      }
    }
  }

  const ticker = setInterval(() => {
    if (window.__superBearGame) {
      if (!window.__superBearGame._caveTickerHooked) {
        window.__superBearGame._caveTickerHooked = true;
        const origUpdate = window.__superBearGame.update;
        window.__superBearGame.update = function(dt, totalTime) {
          origUpdate.call(this, dt, totalTime);
          try {
            updateWaterCaveExtension(dt);
          } catch(e) {}
        };
      }
      clearInterval(ticker);
    }
  }, 100);

  window.__cleanUpWaterCaveExtension = cleanUpWaterCaveExtension;
  window.__updateWaterCaveExtension = updateWaterCaveExtension;
  console.log("💧 [Water Cave Extension] 14-Stage Extension Script Loaded!");
})();
