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
  // CREATURE CREATION HELPERS (9 UNIQUE RUIN CREATURES)
  // =========================================================================

  // 1. Shadow Clown Phantom (Teleporting spectral jester)
  function createShadowClownPhantom(x, y, z) {
    const THREE = window.THREE;
    const group = new THREE.Group();
    group.position.set(x, y, z);

    const ghostMat = new THREE.MeshStandardMaterial({
      color: 0x9333ea,
      emissive: 0x581c87,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.85
    });

    const body = new THREE.Mesh(new THREE.ConeGeometry(0.7, 2.0, 8), ghostMat);
    body.position.y = 1.0;
    group.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.55, 10, 10), new THREE.MeshStandardMaterial({ color: 0xf1f5f9 }));
    head.position.y = 2.2;
    group.add(head);

    // Jester cap horns
    [-0.4, 0.4].forEach(hx => {
      const horn = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.8, 6), ghostMat);
      horn.position.set(hx, 2.8, 0);
      horn.rotation.z = hx > 0 ? -0.4 : 0.4;
      group.add(horn);
    });

    group.userData = {
      type: "clown_phantom",
      hp: 3,
      baseY: y,
      startX: x,
      startZ: z,
      teleportTimer: 0,
      update: function(dt, playerPos, game) {
        this.teleportTimer += dt;
        group.position.y = this.baseY + Math.sin(this.teleportTimer * 3) * 0.6;
        group.rotation.y += dt * 2.0;

        // Teleport every 3.5s
        if (this.teleportTimer > 3.5) {
          this.teleportTimer = 0;
          const angle = Math.random() * Math.PI * 2;
          group.position.x = this.startX + Math.cos(angle) * 5;
          group.position.z = this.startZ + Math.sin(angle) * 5;
        }

        if (playerPos) {
          const d = group.position.distanceTo(playerPos);
          if (d < 1.8 && playerPos.y > group.position.y + 1.2 && game.playerVel && game.playerVel.y < 0) {
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

  // 2. Rusty Marionette (Jerky puppet warrior)
  function createRustyMarionette(x, y, z) {
    const THREE = window.THREE;
    const group = new THREE.Group();
    group.position.set(x, y, z);

    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
    const rustMat = new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.5, roughness: 0.7 });

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.4, 0.5), woodMat);
    torso.position.y = 1.2;
    group.add(torso);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.45, 8, 8), woodMat);
    head.position.y = 2.2;
    group.add(head);

    // Rusty cleaver arm
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.2, 0.3), rustMat);
    arm.position.set(0.6, 1.2, 0.4);
    arm.rotation.x = Math.PI / 4;
    group.add(arm);

    group.userData = {
      type: "marionette",
      hp: 3,
      baseY: y,
      time: Math.random() * 5,
      dir: 1,
      startX: x,
      update: function(dt, playerPos, game) {
        this.time += dt * 4;
        group.rotation.y = Math.sin(this.time) * 0.4;
        group.position.x += this.dir * dt * 2.2;
        if (Math.abs(group.position.x - this.startX) > 5) {
          this.dir *= -1;
        }

        if (playerPos) {
          const d = group.position.distanceTo(playerPos);
          if (d < 1.7 && playerPos.y > group.position.y + 1.4 && game.playerVel && game.playerVel.y < 0) {
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

  // 3. Cinder Raven (Fiery dive-bombing bird)
  function createCinderRaven(x, y, z) {
    const THREE = window.THREE;
    const group = new THREE.Group();
    group.position.set(x, y, z);

    const ashMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.9 });
    const fireMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 0.8 });

    const body = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.2, 6), ashMat);
    body.rotation.x = Math.PI / 2;
    group.add(body);

    const wingL = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.05, 0.6), fireMat);
    wingL.position.x = -0.8;
    const wingR = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.05, 0.6), fireMat);
    wingR.position.x = 0.8;
    group.add(wingL, wingR);

    group.userData = {
      type: "cinder_raven",
      hp: 2,
      baseY: y,
      time: Math.random() * 5,
      wingL, wingR,
      update: function(dt, playerPos, game) {
        this.time += dt * 3;
        wingL.rotation.z = Math.sin(this.time * 6) * 0.6;
        wingR.rotation.z = -Math.sin(this.time * 6) * 0.6;
        group.position.y = this.baseY + Math.sin(this.time * 1.5) * 1.8;
        group.position.x += Math.cos(this.time) * dt * 3.5;

        if (playerPos) {
          const d = group.position.distanceTo(playerPos);
          if (d < 1.6 && playerPos.y > group.position.y + 0.4 && game.playerVel && game.playerVel.y < 0) {
            this.hp--;
            game.playerVel.y = 10;
            if (window.St && window.St.playEnemyHit) window.St.playEnemyHit();
            if (this.hp <= 0) {
              group.visible = false;
              group.position.y = -9999;
            }
          } else if (d < 1.3 && (!game.damageInvulnerable || game.damageInvulnerable <= 0)) {
            if (game.takeDamage) game.takeDamage(1);
          }
        }
      }
    };
    return group;
  }

  // 4. Rubble Golem (Stonework colossus)
  function createRubbleGolem(x, y, z) {
    const THREE = window.THREE;
    const group = new THREE.Group();
    group.position.set(x, y, z);

    const rockMat = new THREE.MeshStandardMaterial({ color: 0x52525b, roughness: 0.95 });
    const lavaVein = new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xea580c, emissiveIntensity: 0.6 });

    const torso = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.8, 1.4), rockMat);
    torso.position.y = 1.6;
    group.add(torso);

    const crack = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.4, 1.45), lavaVein);
    crack.position.y = 1.6;
    group.add(crack);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.8, 0.9), rockMat);
    head.position.y = 2.9;
    group.add(head);

    group.userData = {
      type: "rubble_golem",
      hp: 5,
      baseY: y,
      stompTimer: 0,
      update: function(dt, playerPos, game) {
        this.stompTimer += dt;
        group.position.y = this.baseY + Math.abs(Math.sin(this.stompTimer * 2)) * 0.3;

        if (playerPos) {
          const d = group.position.distanceTo(playerPos);
          if (d < 2.0 && playerPos.y > group.position.y + 2.0 && game.playerVel && game.playerVel.y < 0) {
            this.hp -= 2;
            game.playerVel.y = 12;
            if (window.St && window.St.playEnemyHit) window.St.playEnemyHit();
            if (this.hp <= 0) {
              group.visible = false;
              group.position.y = -9999;
            }
          } else if (d < 1.8 && (!game.damageInvulnerable || game.damageInvulnerable <= 0)) {
            if (game.takeDamage) game.takeDamage(1);
          }
        }
      }
    };
    return group;
  }

  // 5. Gas Balloon Spitter (Floating toxic cloud spitter)
  function createGasBalloonSpitter(x, y, z) {
    const THREE = window.THREE;
    const group = new THREE.Group();
    group.position.set(x, y, z);

    const gasMat = new THREE.MeshStandardMaterial({
      color: 0x84cc16,
      emissive: 0x4d7c0f,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.85
    });

    const balloon = new THREE.Mesh(new THREE.SphereGeometry(1.0, 12, 12), gasMat);
    balloon.scale.set(1, 1.3, 1);
    balloon.position.y = 1.5;
    group.add(balloon);

    const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.08, 6, 10), new THREE.MeshBasicMaterial({ color: 0x14532d }));
    mouth.position.set(0, 1.2, 0.9);
    group.add(mouth);

    group.userData = {
      type: "gas_balloon",
      hp: 2,
      baseY: y,
      time: Math.random() * 5,
      update: function(dt, playerPos, game) {
        this.time += dt;
        group.position.y = this.baseY + Math.sin(this.time * 2) * 1.4;

        if (playerPos) {
          const d = group.position.distanceTo(playerPos);
          if (d < 1.7 && playerPos.y > group.position.y + 1.2 && game.playerVel && game.playerVel.y < 0) {
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

  // 6. Cursed Automaton Lion (Mechanical brass lion)
  function createAutomatonLion(x, y, z) {
    const THREE = window.THREE;
    const group = new THREE.Group();
    group.position.set(x, y, z);

    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.7, roughness: 0.3 });
    const maneMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.0, 2.0), brassMat);
    body.position.y = 0.8;
    group.add(body);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.9), brassMat);
    head.position.set(0, 1.4, 1.1);
    group.add(head);

    const mane = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.3, 6, 12), maneMat);
    mane.position.set(0, 1.4, 0.8);
    group.add(mane);

    group.userData = {
      type: "auto_lion",
      hp: 4,
      baseY: y,
      startX: x,
      dir: 1,
      update: function(dt, playerPos, game) {
        group.position.x += this.dir * dt * 3.8;
        if (Math.abs(group.position.x - this.startX) > 6) {
          this.dir *= -1;
          group.rotation.y = this.dir > 0 ? 0 : Math.PI;
        }

        if (playerPos) {
          const d = group.position.distanceTo(playerPos);
          if (d < 1.9 && playerPos.y > group.position.y + 1.2 && game.playerVel && game.playerVel.y < 0) {
            this.hp -= 2;
            game.playerVel.y = 11;
            if (window.St && window.St.playEnemyHit) window.St.playEnemyHit();
            if (this.hp <= 0) {
              group.visible = false;
              group.position.y = -9999;
            }
          } else if (d < 1.6 && (!game.damageInvulnerable || game.damageInvulnerable <= 0)) {
            if (game.takeDamage) game.takeDamage(1);
          }
        }
      }
    };
    return group;
  }

  // 7. Bone Skitterer (Fast skeletal crawler)
  function createBoneSkitterer(x, y, z) {
    const THREE = window.THREE;
    const group = new THREE.Group();
    group.position.set(x, y, z);

    const boneMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.6 });

    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.6, 8, 8), boneMat);
    skull.position.y = 0.6;
    group.add(skull);

    // Bone legs
    for (let l = 0; l < 4; l++) {
      const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.0, 6), boneMat);
      legL.position.set(-0.7, 0.3, -0.4 + l * 0.3);
      legL.rotation.z = Math.PI / 4;
      const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.0, 6), boneMat);
      legR.position.set(0.7, 0.3, -0.4 + l * 0.3);
      legR.rotation.z = -Math.PI / 4;
      group.add(legL, legR);
    }

    group.userData = {
      type: "bone_skitterer",
      hp: 2,
      baseY: y,
      startZ: z,
      dir: 1,
      update: function(dt, playerPos, game) {
        group.position.z += this.dir * dt * 4.5;
        if (Math.abs(group.position.z - this.startZ) > 7) {
          this.dir *= -1;
        }

        if (playerPos) {
          const d = group.position.distanceTo(playerPos);
          if (d < 1.5 && playerPos.y > group.position.y + 0.6 && game.playerVel && game.playerVel.y < 0) {
            this.hp--;
            game.playerVel.y = 11;
            if (window.St && window.St.playEnemyHit) window.St.playEnemyHit();
            if (this.hp <= 0) {
              group.visible = false;
              group.position.y = -9999;
            }
          } else if (d < 1.3 && (!game.damageInvulnerable || game.damageInvulnerable <= 0)) {
            if (game.takeDamage) game.takeDamage(1);
          }
        }
      }
    };
    return group;
  }

  // 8. Flame Acrobat Imp (Fire-flipping demon)
  function createFlameAcrobatImp(x, y, z) {
    const THREE = window.THREE;
    const group = new THREE.Group();
    group.position.set(x, y, z);

    const impMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, emissive: 0x991b1b, emissiveIntensity: 0.5 });

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.65, 10, 10), impMat);
    body.position.y = 0.8;
    group.add(body);

    const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.6, 6), impMat);
    hornL.position.set(-0.35, 1.4, 0);
    const hornR = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.6, 6), impMat);
    hornR.position.set(0.35, 1.4, 0);
    group.add(hornL, hornR);

    group.userData = {
      type: "flame_imp",
      hp: 3,
      baseY: y,
      flipAngle: 0,
      startX: x,
      dir: 1,
      update: function(dt, playerPos, game) {
        this.flipAngle += dt * 5;
        group.rotation.x = this.flipAngle;
        group.position.x += this.dir * dt * 3.2;
        if (Math.abs(group.position.x - this.startX) > 6) {
          this.dir *= -1;
        }

        if (playerPos) {
          const d = group.position.distanceTo(playerPos);
          if (d < 1.6 && playerPos.y > group.position.y + 0.8 && game.playerVel && game.playerVel.y < 0) {
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

  // 9. Haunted Knight Armor (Living steel suit)
  function createHauntedArmor(x, y, z) {
    const THREE = window.THREE;
    const group = new THREE.Group();
    group.position.set(x, y, z);

    const steelMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.3 });
    const blueVisor = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    const cuirass = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.6, 0.9), steelMat);
    cuirass.position.y = 1.6;
    group.add(cuirass);

    const helm = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), steelMat);
    helm.position.y = 2.8;
    group.add(helm);

    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.15, 0.1), blueVisor);
    visor.position.set(0, 2.8, 0.42);
    group.add(visor);

    group.userData = {
      type: "haunted_armor",
      hp: 5,
      baseY: y,
      update: function(dt, playerPos, game) {
        group.rotation.y += dt * 0.8;

        if (playerPos) {
          const d = group.position.distanceTo(playerPos);
          if (d < 1.9 && playerPos.y > group.position.y + 2.0 && game.playerVel && game.playerVel.y < 0) {
            this.hp -= 2;
            game.playerVel.y = 12;
            if (window.St && window.St.playEnemyHit) window.St.playEnemyHit();
            if (this.hp <= 0) {
              group.visible = false;
              group.position.y = -9999;
            }
          } else if (d < 1.6 && (!game.damageInvulnerable || game.damageInvulnerable <= 0)) {
            if (game.takeDamage) game.takeDamage(1);
          }
        }
      }
    };
    return group;
  }

  // =========================================================================
  // MAIN EXTENSION POPULATOR FOR CHAPTER 12 (15 EXTENDED STAGES)
  // =========================================================================
  window.__populateRuinVillageExtension = function(game) {
    if (!window.THREE || !game || !game.scene) return;
    const THREE = window.THREE;
    console.log("🏚️ [Yıkılmış Köy] Orijinal Köy korundu, 15 Yeni Aşama ve 9 Yeni Canlı Yükleniyor...");

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
    // 15 EXTENDED STAGES
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
    const g2 = createRubbleGolem(0, 29, -2660);
    ruinExtensionGroup.add(g2);
    ruinCreatures.push(g2.userData);

    // Stage 11: Yanmış Değirmen Çarkları (z: -2720 to -2930)
    addCheckpoint(0, 28, -2720, "11. Aşama: Yanmış Değirmen Çarkı");
    addPlat(14, 2, 20, 0, 28, -2740, burntWoodMat);
    addPlat(6, 2, 12, -7, 30, -2790, rustIronMat);
    addPlat(6, 2, 12, 7, 32, -2830, rustIronMat);
    addPlat(16, 2, 25, 0, 34, -2880, burntWoodMat);
    const m2 = createRustyMarionette(0, 35, -2880);
    ruinExtensionGroup.add(m2);
    ruinCreatures.push(m2.userData);

    // Stage 12: Zift Şelalesi & Dönen Bazalt Sütunlar (z: -2940 to -3150)
    addCheckpoint(0, 34, -2940, "12. Aşama: Zift Şelalesi");
    addPlat(14, 2, 22, 0, 34, -2960, rubbleStoneMat);
    addPlat(6, 2, 10, -6, 36, -3010, bloodStoneMat);
    addPlat(6, 2, 10, 6, 38, -3050, bloodStoneMat);
    addPlat(16, 2, 25, 0, 40, -3100, rubbleStoneMat);
    const s2 = createBoneSkitterer(0, 41, -3100);
    ruinExtensionGroup.add(s2);
    ruinCreatures.push(s2.userData);

    // Stage 13: Lanetli Aynalı Sirk Labirenti (z: -3160 to -3370)
    addCheckpoint(0, 40, -3160, "13. Aşama: Aynalı Sirk Labirenti");
    addPlat(14, 2, 22, 0, 40, -3180, rustIronMat);
    addPlat(7, 2, 14, -8, 42, -3230, crackedBrickMat);
    addPlat(7, 2, 14, 8, 44, -3270, crackedBrickMat);
    addPlat(16, 2, 25, 0, 46, -3320, rustIronMat);
    const p2 = createShadowClownPhantom(0, 47, -3320);
    ruinExtensionGroup.add(p2);
    ruinCreatures.push(p2.userData);

    // Stage 14: Kanlı Çan Kulesi Merdiveni (z: -3380 to -3590)
    addCheckpoint(0, 46, -3380, "14. Aşama: Kanlı Çan Kulesi");
    addPlat(16, 2, 25, 0, 46, -3400, bloodStoneMat);
    addJumpPad(0, 47, -3410, 24);
    addPlat(8, 2, 14, 0, 60, -3460, rustIronMat);
    addPlat(8, 2, 14, -8, 56, -3500, rubbleStoneMat);
    addPlat(8, 2, 14, 8, 52, -3540, rubbleStoneMat);
    addPlat(18, 2, 28, 0, 48, -3580, bloodStoneMat);
    const a2 = createHauntedArmor(0, 49, -3580);
    ruinExtensionGroup.add(a2);
    ruinCreatures.push(a2.userData);

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

    // Red clown nose
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.7, 12, 12), new THREE.MeshStandardMaterial({ color: 0xdc2626 }));
    nose.position.set(0, 9.0, 2.3);
    bossGroup.add(nose);

    // Jester cap
    const cap = new THREE.Mesh(new THREE.ConeGeometry(1.6, 3.2, 12), new THREE.MeshStandardMaterial({ color: 0x8b5cf6 }));
    cap.position.set(0, 12.2, 0);
    bossGroup.add(cap);

    ruinExtensionGroup.add(bossGroup);

    ruinClownBoss = {
      group: bossGroup,
      hp: 45,
      maxHp: 45,
      baseY: 48,
      attackTimer: 2.0,
      isDead: false,
      update: function(dt, playerPos, game) {
        if (this.isDead) return;
        this.attackTimer -= dt;
        bossGroup.position.y = this.baseY + Math.sin(Date.now() * 0.003) * 1.0;
        bossGroup.rotation.y += dt * 0.8;

        if (playerPos) {
          bossGroup.lookAt(playerPos.x, bossGroup.position.y, playerPos.z);
        }

        if (this.attackTimer <= 0) {
          this.attackTimer = 2.4;
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
                game.callbacks.onShowNotice("🎉 Dev Palyaço Boss Yenildi! 13. Bölüm: Su Mağarası Portalı Açıldı! 💧", "success");
              }
              if (ruinVictoryPortal) {
                ruinVictoryPortal.visible = true;
                ruinVictoryPortal.position.set(0, 49, -3860);
              }
            }
          } else if (d < 3.2 && (!game.damageInvulnerable || game.damageInvulnerable <= 0)) {
            if (game.takeDamage) game.takeDamage(2);
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
      game.callbacks.onShowNotice("🏚️ 12. Bölüm Yıkılmış Köy 15 Yeni Aşamayla Genişletildi! 9 Yeni Canlı Eklendi!", "info");
    }
  };

  // =========================================================================
  // UPDATE TICKER FOR CHAPTER 12 EXTENSION
  // =========================================================================
  function updateRuinVillageExtension(dt) {
    const game = window.__superBearGame;
    if (!game || game.currentRegion !== "ruin_village") return;
    const playerPos = game.playerPos;

    for (let i = 0; i < ruinCreatures.length; i++) {
      const c = ruinCreatures[i];
      if (c && typeof c.update === "function") {
        c.update(dt, playerPos, game);
      }
    }

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
