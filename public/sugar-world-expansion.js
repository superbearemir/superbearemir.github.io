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
  // CREATURE CREATION HELPERS (7 UNIQUE SWEET BEASTS)
  // =========================================================================
  function createGummyBear(x, y, z, colorHex = 0xf43f5e) {
    const THREE = window.THREE;
    const group = new THREE.Group();
    group.position.set(x, y, z);

    const bodyMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.9,
      emissive: colorHex,
      emissiveIntensity: 0.2
    });

    // Body
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.9, 1.8, 12), bodyMat);
    body.position.y = 1.0;
    group.add(body);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.8, 14, 14), bodyMat);
    head.position.y = 2.2;
    group.add(head);

    // Ears
    const earGeo = new THREE.SphereGeometry(0.3, 8, 8);
    const earL = new THREE.Mesh(earGeo, bodyMat);
    earL.position.set(-0.6, 2.8, 0);
    const earR = new THREE.Mesh(earGeo, bodyMat);
    earR.position.set(0.6, 2.8, 0);
    group.add(earL, earR);

    // Cute Sugar Eyes & Muzzle
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x111827 });
    [-0.28, 0.28].forEach(ex => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), eyeMat);
      eye.position.set(ex, 2.3, 0.72);
      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), pupilMat);
      pupil.position.set(ex, 2.3, 0.85);
      group.add(eye, pupil);
    });

    // Belly candy badge
    const badge = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.3 }));
    badge.scale.set(1, 1.2, 0.4);
    badge.position.set(0, 1.1, 0.8);
    group.add(badge);

    group.userData = {
      type: "gummy_bear",
      hp: 3,
      maxHp: 3,
      baseY: y,
      startX: x,
      startZ: z,
      jumpTimer: Math.random() * 2,
      direction: 1,
      update: function(dt, playerPos, game) {
        this.jumpTimer += dt;
        // Bounce hop
        const hop = Math.abs(Math.sin(this.jumpTimer * 3.5));
        group.position.y = this.baseY + hop * 1.8;
        group.scale.set(1 + (1 - hop) * 0.2, 1 + hop * 0.25 - (1 - hop) * 0.15, 1 + (1 - hop) * 0.2);

        // Patrol back and forth
        group.position.x += this.direction * dt * 2.2;
        if (Math.abs(group.position.x - this.startX) > 7) {
          this.direction *= -1;
          group.rotation.y = this.direction > 0 ? 0 : Math.PI;
        }

        // Proximity check with player
        if (playerPos) {
          const d = group.position.distanceTo(playerPos);
          if (d < 1.8 && playerPos.y > group.position.y + 1.2 && game.playerVel && game.playerVel.y < 0) {
            // Player jumped on it!
            this.hp--;
            game.playerVel.y = 12;
            if (window.St && window.St.playEnemyHit) window.St.playEnemyHit();
            if (this.hp <= 0) {
              group.visible = false;
              group.position.y = -9999;
            }
          } else if (d < 1.5 && (!game.damageInvulnerable || game.damageInvulnerable <= 0)) {
            // Hurt player
            if (game.takeDamage) game.takeDamage(1);
          }
        }
      }
    };
    return group;
  }

  function createCandyCaneGuard(x, y, z) {
    const THREE = window.THREE;
    const group = new THREE.Group();
    group.position.set(x, y, z);

    const redWhiteMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });

    // Main Body
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.75, 2.2, 10), redWhiteMat);
    body.position.y = 1.3;
    group.add(body);

    // Candy Stripes
    for (let i = 0; i < 4; i++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.08, 6, 12), whiteMat);
      ring.position.y = 0.5 + i * 0.5;
      ring.rotation.x = Math.PI / 2;
      group.add(ring);
    }

    // Helmet & Shield
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.6, 12, 12), whiteMat);
    head.position.y = 2.6;
    group.add(head);

    const spear = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.4, 8), redWhiteMat);
    spear.position.set(0.9, 1.8, 0.4);
    spear.rotation.x = Math.PI / 6;
    group.add(spear);

    const spearTip = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.8, 8), whiteMat);
    spearTip.position.set(0.9, 3.4, 1.3);
    spearTip.rotation.x = Math.PI / 6;
    group.add(spearTip);

    group.userData = {
      type: "cane_guard",
      hp: 4,
      baseY: y,
      startX: x,
      startZ: z,
      chargeTimer: 0,
      isCharging: false,
      chargeDir: 1,
      update: function(dt, playerPos, game) {
        this.chargeTimer += dt;
        if (this.chargeTimer > 3.0) {
          this.chargeTimer = 0;
          this.isCharging = true;
          this.chargeDir = (playerPos && playerPos.z < group.position.z) ? -1 : 1;
        }

        if (this.isCharging) {
          group.position.z += this.chargeDir * dt * 9.0;
          group.rotation.x = 0.25;
          if (Math.abs(group.position.z - this.startZ) > 14) {
            this.isCharging = false;
            group.position.z = this.startZ;
            group.rotation.x = 0;
          }
        } else {
          group.rotation.y += dt * 1.5;
        }

        if (playerPos) {
          const d = group.position.distanceTo(playerPos);
          if (d < 1.9 && playerPos.y > group.position.y + 1.8 && game.playerVel && game.playerVel.y < 0) {
            this.hp -= 2;
            game.playerVel.y = 11;
            if (window.St && window.St.playEnemyHit) window.St.playEnemyHit();
            if (this.hp <= 0) {
              group.visible = false;
              group.position.y = -9999;
            }
          } else if (d < 1.7 && (!game.damageInvulnerable || game.damageInvulnerable <= 0)) {
            if (game.takeDamage) game.takeDamage(1);
          }
        }
      }
    };
    return group;
  }

  function createSugarBee(x, y, z) {
    const THREE = window.THREE;
    const group = new THREE.Group();
    group.position.set(x, y, z);

    // Honeycomb candy body
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 });
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.5 });
    const wingMat = new THREE.MeshStandardMaterial({ color: 0xfbcfe8, transparent: true, opacity: 0.7, roughness: 0.1 });

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.7, 12, 12), bodyMat);
    body.scale.set(1, 1, 1.4);
    group.add(body);

    const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.1, 6, 14), stripeMat);
    stripe.rotation.y = Math.PI / 2;
    group.add(stripe);

    // Wings
    const wingL = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.6), wingMat);
    wingL.position.set(-0.9, 0.6, 0);
    const wingR = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.6), wingMat);
    wingR.position.set(0.9, 0.6, 0);
    group.add(wingL, wingR);

    // Stinger lollipop needle
    const stinger = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.7, 8), new THREE.MeshStandardMaterial({ color: 0xdb2777 }));
    stinger.rotation.x = -Math.PI / 2;
    stinger.position.set(0, 0, 1.2);
    group.add(stinger);

    group.userData = {
      type: "sugar_bee",
      hp: 2,
      baseY: y,
      time: Math.random() * 10,
      wingL, wingR,
      update: function(dt, playerPos, game) {
        this.time += dt * 4;
        wingL.rotation.z = Math.sin(this.time * 6) * 0.6;
        wingR.rotation.z = -Math.sin(this.time * 6) * 0.6;
        group.position.y = this.baseY + Math.sin(this.time * 1.5) * 1.6;
        group.position.x += Math.cos(this.time * 0.8) * dt * 3;

        if (playerPos) {
          const d = group.position.distanceTo(playerPos);
          if (d < 1.6 && playerPos.y > group.position.y + 0.6 && game.playerVel && game.playerVel.y < 0) {
            this.hp--;
            game.playerVel.y = 10;
            if (window.St && window.St.playEnemyHit) window.St.playEnemyHit();
            if (this.hp <= 0) {
              group.visible = false;
              group.position.y = -9999;
            }
          } else if (d < 1.4 && (!game.damageInvulnerable || game.damageInvulnerable <= 0)) {
            if (game.takeDamage) game.takeDamage(1);
          }
        }
      }
    };
    return group;
  }

  function createChocolateLeaper(x, y, z) {
    const THREE = window.THREE;
    const group = new THREE.Group();
    group.position.set(x, y, z);

    const chocMat = new THREE.MeshStandardMaterial({ color: 0x3e1f0e, roughness: 0.2, metalness: 0.1 });
    const creamMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.4 });

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.9, 12, 10), chocMat);
    body.scale.set(1.1, 0.7, 1.2);
    body.position.y = 0.5;
    group.add(body);

    // Big Froggy Eyes
    [-0.5, 0.5].forEach(ox => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8), creamMat);
      eye.position.set(ox, 1.0, 0.6);
      group.add(eye);
    });

    group.userData = {
      type: "choco_frog",
      hp: 3,
      baseY: y,
      timer: Math.random() * 2,
      isAirborne: false,
      vy: 0,
      update: function(dt, playerPos, game) {
        this.timer += dt;
        if (this.timer > 2.5 && !this.isAirborne) {
          this.timer = 0;
          this.isAirborne = true;
          this.vy = 8.5;
        }

        if (this.isAirborne) {
          group.position.y += this.vy * dt;
          this.vy -= 22 * dt;
          if (group.position.y <= this.baseY) {
            group.position.y = this.baseY;
            this.isAirborne = false;
            this.vy = 0;
          }
        }

        if (playerPos) {
          const d = group.position.distanceTo(playerPos);
          if (d < 1.7 && playerPos.y > group.position.y + 0.8 && game.playerVel && game.playerVel.y < 0) {
            this.hp--;
            game.playerVel.y = 11;
            if (window.St && window.St.playEnemyHit) window.St.playEnemyHit();
            if (this.hp <= 0) {
              group.visible = false;
              group.position.y = -9999;
            }
          } else if (d < 1.4 && (!game.damageInvulnerable || game.damageInvulnerable <= 0)) {
            if (game.takeDamage) game.takeDamage(1);
          }
        }
      }
    };
    return group;
  }

  function createPopRockHedgehog(x, y, z) {
    const THREE = window.THREE;
    const group = new THREE.Group();
    group.position.set(x, y, z);

    const sugarPink = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.4 });
    const spineMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.2 });

    const core = new THREE.Mesh(new THREE.SphereGeometry(0.8, 12, 12), sugarPink);
    core.position.y = 0.6;
    group.add(core);

    // Spines radiating
    for (let i = 0; i < 14; i++) {
      const spine = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.7, 6), spineMat);
      const angle = (i / 14) * Math.PI * 2;
      spine.position.set(Math.cos(angle) * 0.7, 0.6 + Math.sin(angle * 2) * 0.3, Math.sin(angle) * 0.7);
      spine.rotation.x = Math.sin(angle);
      spine.rotation.z = -Math.cos(angle);
      group.add(spine);
    }

    group.userData = {
      type: "poprock",
      hp: 2,
      baseY: y,
      rollAngle: 0,
      dir: 1,
      startX: x,
      update: function(dt, playerPos, game) {
        this.rollAngle += dt * 5 * this.dir;
        group.rotation.z = -this.rollAngle;
        group.position.x += this.dir * dt * 3.5;
        if (Math.abs(group.position.x - this.startX) > 6) {
          this.dir *= -1;
        }

        if (playerPos) {
          const d = group.position.distanceTo(playerPos);
          if (d < 1.6 && playerPos.y > group.position.y + 0.9 && game.playerVel && game.playerVel.y < 0) {
            this.hp--;
            game.playerVel.y = 12;
            if (window.St && window.St.playEnemyHit) window.St.playEnemyHit();
            if (this.hp <= 0) {
              group.visible = false;
              group.position.y = -9999;
            }
          } else if (d < 1.4 && (!game.damageInvulnerable || game.damageInvulnerable <= 0)) {
            if (game.takeDamage) game.takeDamage(1);
          }
        }
      }
    };
    return group;
  }

  function createCaramelGolem(x, y, z) {
    const THREE = window.THREE;
    const group = new THREE.Group();
    group.position.set(x, y, z);

    const caramelMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.25,
      metalness: 0.1,
      emissive: 0xb45309,
      emissiveIntensity: 0.3
    });

    // Big bulky torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.2, 1.4), caramelMat);
    torso.position.y = 2.0;
    group.add(torso);

    // Stone candy head
    const head = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.0, 1.0), new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 }));
    head.position.y = 3.6;
    group.add(head);

    // Huge Fists
    [-1.4, 1.4].forEach(fx => {
      const fist = new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 8), caramelMat);
      fist.position.set(fx, 1.6, 0.4);
      group.add(fist);
    });

    group.userData = {
      type: "caramel_golem",
      hp: 6,
      maxHp: 6,
      baseY: y,
      smashTimer: 0,
      update: function(dt, playerPos, game) {
        this.smashTimer += dt;
        group.position.y = this.baseY + Math.abs(Math.sin(this.smashTimer * 2)) * 0.4;
        group.rotation.y += dt * 0.5;

        if (playerPos) {
          const d = group.position.distanceTo(playerPos);
          if (d < 2.2 && playerPos.y > group.position.y + 2.5 && game.playerVel && game.playerVel.y < 0) {
            this.hp -= 2;
            game.playerVel.y = 12;
            if (window.St && window.St.playEnemyHit) window.St.playEnemyHit();
            if (this.hp <= 0) {
              group.visible = false;
              group.position.y = -9999;
            }
          } else if (d < 2.0 && (!game.damageInvulnerable || game.damageInvulnerable <= 0)) {
            if (game.takeDamage) game.takeDamage(1);
          }
        }
      }
    };
    return group;
  }

  function createCottonCandyWisp(x, y, z) {
    const THREE = window.THREE;
    const group = new THREE.Group();
    group.position.set(x, y, z);

    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0x67e8f9,
      roughness: 0.8,
      transparent: true,
      opacity: 0.85,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.4
    });

    // Cloud clusters
    for (let i = 0; i < 5; i++) {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(0.7, 10, 10), cloudMat);
      puff.position.set(Math.sin(i * 1.3) * 0.6, 1.2 + Math.cos(i * 1.5) * 0.3, Math.cos(i * 1.2) * 0.6);
      group.add(puff);
    }

    group.userData = {
      type: "candy_wisp",
      hp: 2,
      baseY: y,
      time: Math.random() * 5,
      update: function(dt, playerPos, game) {
        this.time += dt;
        group.position.y = this.baseY + Math.sin(this.time * 2) * 1.5;
        group.rotation.y += dt * 1.2;

        if (playerPos) {
          const d = group.position.distanceTo(playerPos);
          if (d < 1.8 && playerPos.y > group.position.y + 0.8 && game.playerVel && game.playerVel.y < 0) {
            this.hp--;
            game.playerVel.y = 11;
            if (window.St && window.St.playEnemyHit) window.St.playEnemyHit();
            if (this.hp <= 0) {
              group.visible = false;
              group.position.y = -9999;
            }
          } else if (d < 1.5 && (!game.damageInvulnerable || game.damageInvulnerable <= 0)) {
            if (game.takeDamage) game.takeDamage(1);
          }
        }
      }
    };
    return group;
  }

  // =========================================================================
  // MAIN EXTENSION POPULATOR FOR CHAPTER 10 (14 EXTENDED STAGES)
  // =========================================================================
  window.__populateSugarWorldExtension = function(game) {
    if (!window.THREE || !game || !game.scene) return;
    const THREE = window.THREE;
    console.log("🍬 [Şeker Dünyası] Orijinal Şeker Dünyası korundu, 14 Yeni Aşama ve 7 Yeni Canlı Yükleniyor...");

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
    // 14 EXTENDED STAGES
    // =========================================================================

    // Stage 1: Çilekli Pamuk Şeker Bulutları (z: -560 to -720)
    addCheckpoint(0, 32, -560, "1. Aşama: Pamuk Şeker Bulutları");
    addPlat(14, 2, 25, 0, 32, -580, pinkSugarMat);
    addPlat(8, 2, 16, -10, 34, -620, marshmallowMat);
    addPlat(8, 2, 16, 10, 36, -650, marshmallowMat);
    addPlat(14, 2, 25, 0, 38, -690, pinkSugarMat);
    // Creature 1: Jelibon Ayıcık
    const bear1 = createGummyBear(-2, 39, -690, 0xec4899);
    sugarExtensionGroup.add(bear1);
    sugarCreatures.push(bear1.userData);

    // Stage 2: Dönen Gofret & Karamelli Makaralar (z: -730 to -920)
    addCheckpoint(0, 38, -730, "2. Aşama: Gofret & Karamel Çarkları");
    addPlat(12, 2, 20, 0, 38, -750, waffleMat);
    addPlat(6, 2, 14, -8, 40, -800, caramelMat);
    addPlat(6, 2, 14, 8, 42, -840, caramelMat);
    addPlat(14, 2, 22, 0, 44, -890, waffleMat);
    // Creature 2: Şeker Kamışı Muhafızı
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
    // Creature 3: Uçan Lolipop Arısı
    const bee1 = createSugarBee(0, 65, -1080);
    sugarExtensionGroup.add(bee1);
    sugarCreatures.push(bee1.userData);

    // Stage 4: Patlayan Şeker Kristalleri & Asma Köprüler (z: -1130 to -1320)
    addCheckpoint(0, 62, -1130, "4. Aşama: Şeker Kristalleri");
    addPlat(12, 2, 22, 0, 62, -1150, rainbowMat);
    addPlat(7, 2, 12, -7, 60, -1200, pinkSugarMat);
    addPlat(7, 2, 12, 7, 58, -1240, pinkSugarMat);
    addPlat(14, 2, 24, 0, 56, -1290, rainbowMat);
    // Creature 4: Çikolatalı Kurbağa
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
    // Creature 5: Patlayan Şeker Kirpisi
    const hedge1 = createPopRockHedgehog(0, 49, -1510);
    sugarExtensionGroup.add(hedge1);
    sugarCreatures.push(hedge1.userData);

    // Stage 6: Şeker Kamışı Dikey Sarmal Kulesi (z: -1530 to -1720)
    addCheckpoint(0, 48, -1530, "6. Aşama: Sarmal Şeker Kulesi");
    addPlat(16, 2, 25, 0, 48, -1550, pinkSugarMat);
    // Spiral steps climbing from y: 48 to 72
    for (let s = 0; s < 6; s++) {
      const angle = (s / 6) * Math.PI * 2;
      addPlat(6, 1.5, 6, Math.cos(angle) * 8, 52 + s * 3.5, -1620 + Math.sin(angle) * 8, caramelMat);
    }
    addPlat(16, 2, 25, 0, 74, -1700, pinkSugarMat);
    // Creature 6: Karamel Golemi
    const golem1 = createCaramelGolem(0, 75, -1700);
    sugarExtensionGroup.add(golem1);
    sugarCreatures.push(golem1.userData);

    // Stage 7: Kaygan Meyveli Jöle Rampaları (z: -1730 to -1920)
    addCheckpoint(0, 74, -1730, "7. Aşama: Jöle Rampaları");
    addPlat(14, 2, 20, 0, 74, -1750, mintMat);
    addPlat(8, 2, 18, -8, 70, -1800, blueSugarMat);
    addPlat(8, 2, 18, 8, 66, -1840, blueSugarMat);
    addPlat(16, 2, 25, 0, 62, -1890, mintMat);
    // Creature 7: Pamuk Şeker Perisi
    const wisp1 = createCottonCandyWisp(0, 65, -1890);
    sugarExtensionGroup.add(wisp1);
    sugarCreatures.push(wisp1.userData);

    // Stage 8: Nane Şekeri Dönen Çarkları (z: -1930 to -2120)
    addCheckpoint(0, 62, -1930, "8. Aşama: Nane Şekeri Çarkları");
    addPlat(14, 2, 22, 0, 62, -1950, mintMat);
    addPlat(7, 2, 14, -8, 64, -2000, whiteMat);
    addPlat(7, 2, 14, 8, 66, -2040, mintMat);
    addPlat(14, 2, 24, 0, 68, -2090, mintMat);
    const bear2 = createGummyBear(2, 69, -2090, 0x10b981);
    sugarExtensionGroup.add(bear2);
    sugarCreatures.push(bear2.userData);

    // Stage 9: Çikolatalı Donut Çemberleri (z: -2130 to -2320)
    addCheckpoint(0, 68, -2130, "9. Aşama: Dev Donut Çemberleri");
    addPlat(14, 2, 20, 0, 68, -2150, chocoMat);
    addPlat(8, 2, 14, 0, 66, -2200, waffleMat);
    addJumpPad(0, 67, -2200, 20);
    addPlat(8, 2, 14, 0, 78, -2250, marshmallowMat);
    addPlat(16, 2, 25, 0, 76, -2300, chocoMat);
    const bee2 = createSugarBee(0, 80, -2280);
    sugarExtensionGroup.add(bee2);
    sugarCreatures.push(bee2.userData);

    // Stage 10: Bonbon Kristalleri & Uçan Gofretler (z: -2330 to -2520)
    addCheckpoint(0, 76, -2330, "10. Aşama: Bonbon Kristalleri");
    addPlat(14, 2, 22, 0, 76, -2350, rainbowMat);
    addPlat(6, 2, 12, -9, 74, -2400, pinkSugarMat);
    addPlat(6, 2, 12, 9, 72, -2440, blueSugarMat);
    addPlat(14, 2, 24, 0, 70, -2490, rainbowMat);
    const frog2 = createChocolateLeaper(0, 71, -2490);
    sugarExtensionGroup.add(frog2);
    sugarCreatures.push(frog2.userData);

    // Stage 11: Zencefilli Kurabiye Köyü (z: -2530 to -2720)
    addCheckpoint(0, 70, -2530, "11. Aşama: Kurabiye Köyü");
    addPlat(16, 2, 25, 0, 70, -2550, waffleMat);
    addPlat(8, 2, 14, -8, 66, -2600, caramelMat);
    addPlat(8, 2, 14, 8, 62, -2640, caramelMat);
    addPlat(16, 2, 25, 0, 58, -2690, waffleMat);
    const guard2 = createCandyCaneGuard(0, 59, -2690);
    sugarExtensionGroup.add(guard2);
    sugarCreatures.push(guard2.userData);

    // Stage 12: Eriyik Karamel Lav Havuzları & Dikenli Şekerler (z: -2730 to -2920)
    addCheckpoint(0, 58, -2730, "12. Aşama: Karamel Havuzu");
    addPlat(14, 2, 20, 0, 58, -2750, caramelMat);
    addPlat(6, 2, 10, -7, 56, -2800, pinkSugarMat);
    addPlat(6, 2, 10, 7, 54, -2840, pinkSugarMat);
    addPlat(16, 2, 25, 0, 52, -2890, caramelMat);
    const golem2 = createCaramelGolem(0, 53, -2890);
    sugarExtensionGroup.add(golem2);
    sugarCreatures.push(golem2.userData);

    // Stage 13: Gökkuşağı Macaron Merdivenleri (z: -2930 to -3140)
    addCheckpoint(0, 52, -2930, "13. Aşama: Macaron Merdivenleri");
    addPlat(16, 2, 22, 0, 52, -2950, rainbowMat);
    addPlat(8, 2, 14, -8, 50, -3000, pinkSugarMat);
    addPlat(8, 2, 14, 8, 46, -3040, blueSugarMat);
    addPlat(10, 2, 16, 0, 42, -3090, mintMat);
    addPlat(18, 2, 26, 0, 38, -3140, rainbowMat);
    const wisp2 = createCottonCandyWisp(0, 42, -3140);
    sugarExtensionGroup.add(wisp2);
    sugarCreatures.push(wisp2.userData);

    // Stage 14: BÜYÜK ŞEKER TAHTI ARENASI & LOLİPOP KRALI (z: -3180 to -3480)
    addCheckpoint(0, 38, -3180, "14. Aşama: Şeker Tahtı - Patron Arenası");
    // Colossal candy arena
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

    // Boss Candy Stick Body
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 8, 12), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 }));
    stick.position.y = 4;
    bossGroup.add(stick);

    // Red candy spiral
    for (let r = 0; r < 6; r++) {
      const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.12, 6, 16), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
      stripe.position.y = 1.5 + r * 1.1;
      stripe.rotation.x = Math.PI / 2;
      bossGroup.add(stripe);
    }

    // Gigantic Spiral Candy Head
    const head = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.2, 1.4, 24), new THREE.MeshStandardMaterial({
      color: 0xdb2777,
      emissive: 0x9d174d,
      emissiveIntensity: 0.5,
      roughness: 0.2
    }));
    head.rotation.x = Math.PI / 2;
    head.position.y = 10;
    bossGroup.add(head);

    // Golden Crown
    const crown = new THREE.Mesh(new THREE.ConeGeometry(2.0, 1.8, 6), new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8, roughness: 0.2 }));
    crown.position.set(0, 14.5, 0);
    crown.rotation.x = Math.PI;
    bossGroup.add(crown);

    // Boss Arms & Boxing Candy Gloves
    const armL = new THREE.Mesh(new THREE.BoxGeometry(1.2, 4.0, 1.2), pinkSugarMat);
    armL.position.set(-3.5, 7.5, 0);
    const armR = new THREE.Mesh(new THREE.BoxGeometry(1.2, 4.0, 1.2), pinkSugarMat);
    armR.position.set(3.5, 7.5, 0);
    bossGroup.add(armL, armR);

    sugarExtensionGroup.add(bossGroup);

    sugarCandyBoss = {
      group: bossGroup,
      hp: 40,
      maxHp: 40,
      baseY: 38,
      baseZ: -3340,
      attackCooldown: 2.0,
      phase: 1,
      armL, armR,
      headMesh: head,
      isDead: false,
      update: function(dt, playerPos, game) {
        if (this.isDead) return;

        // Hover & dynamic animation
        this.attackCooldown -= dt;
        bossGroup.position.y = this.baseY + Math.sin(Date.now() * 0.003) * 1.2;
        head.rotation.z += dt * 1.5;
        armL.rotation.x = Math.sin(Date.now() * 0.005) * 0.5;
        armR.rotation.x = -Math.sin(Date.now() * 0.005) * 0.5;

        // Rotate facing player
        if (playerPos) {
          bossGroup.lookAt(playerPos.x, bossGroup.position.y, playerPos.z);
        }

        // Attacks
        if (this.attackCooldown <= 0 && playerPos) {
          this.attackCooldown = 2.2;
          if (window.St && window.St.playBossRoar) window.St.playBossRoar();
          // Summon minor candy minion if under 50% HP
          if (this.hp < 20 && sugarCreatures.length < 25) {
            const minion = createGummyBear(bossGroup.position.x + (Math.random() - 0.5) * 8, 38, bossGroup.position.z + (Math.random() - 0.5) * 8);
            sugarExtensionGroup.add(minion);
            sugarCreatures.push(minion.userData);
          }
        }

        // Damage detection: Player jump on head or spin attack
        if (playerPos) {
          const d = bossGroup.position.distanceTo(playerPos);
          if (d < 4.2 && playerPos.y > bossGroup.position.y + 7.5 && game.playerVel && game.playerVel.y < 0) {
            this.hp -= 5;
            game.playerVel.y = 15;
            if (window.St && window.St.playBossHit) window.St.playBossHit();
            this.headMesh.material.emissiveIntensity = 1.5;
            setTimeout(() => { if (this.headMesh) this.headMesh.material.emissiveIntensity = 0.5; }, 150);

            if (this.hp <= 0) {
              this.isDead = true;
              bossGroup.visible = false;
              bossGroup.position.y = -9999;
              if (window.St && window.St.playGoalFanfare) window.St.playGoalFanfare();
              if (game.callbacks && game.callbacks.onShowNotice) {
                game.callbacks.onShowNotice("🎉 Lolipop Kralı Yenildi! 11. Bölüm: Jokerooms Portalı Açıldı! 🚪", "success");
              }
              if (sugarVictoryPortal) {
                sugarVictoryPortal.visible = true;
                sugarVictoryPortal.position.set(0, 39, -3420);
              }
            }
          } else if (d < 3.2 && (!game.damageInvulnerable || game.damageInvulnerable <= 0)) {
            if (game.takeDamage) game.takeDamage(2);
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

    // Glowing Vortex
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

    // Notice
    if (game.callbacks && game.callbacks.onShowNotice) {
      game.callbacks.onShowNotice("🍭 10. Bölüm Şeker Dünyası 14 Yeni Aşamayla Genişletildi! 7 Yeni Canlı Eklendi!", "info");
    }
  };

  // =========================================================================
  // UPDATE TICKER FOR CHAPTER 10 EXTENSION
  // =========================================================================
  function updateSugarWorldExtension(dt) {
    const game = window.__superBearGame;
    if (!game || game.currentRegion !== "sugar_world") return;
    const playerPos = game.playerPos;

    // Update creatures
    for (let i = 0; i < sugarCreatures.length; i++) {
      const c = sugarCreatures[i];
      if (c && typeof c.update === "function") {
        c.update(dt, playerPos, game);
      }
    }

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
