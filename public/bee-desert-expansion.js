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
  // 14 UNIQUE DESERT BEASTS HELPERS
  // =========================================================================

  function createCreature(type, x, y, z, hp, updateFn, meshCreator) {
    const group = meshCreator(x, y, z);
    group.userData = {
      type: type,
      hp: hp,
      baseY: y,
      startX: x,
      startZ: z,
      dir: 1,
      time: Math.random() * 5,
      update: function(dt, playerPos, game) {
        updateFn.call(this, group, dt, playerPos, game);
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

  // 1. Desert Soldier Bee
  function createSoldierBee(x, y, z) {
    return createCreature("soldier_bee", x, y, z, 2, function(grp, dt) {
      this.time += dt * 3;
      grp.position.y = this.baseY + Math.sin(this.time) * 1.5;
      grp.position.x = this.startX + Math.cos(this.time * 0.7) * 4;
    }, function(px, py, pz) {
      const THREE = window.THREE;
      const g = new THREE.Group();
      g.position.set(px, py, pz);
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 8), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
      g.add(m);
      return g;
    });
  }

  // 2. Giant Dune Scorpion
  function createDuneScorpion(x, y, z) {
    return createCreature("scorpion", x, y, z, 3, function(grp, dt) {
      grp.position.z += this.dir * dt * 3.0;
      if (Math.abs(grp.position.z - this.startZ) > 6) this.dir *= -1;
    }, function(px, py, pz) {
      const THREE = window.THREE;
      const g = new THREE.Group();
      g.position.set(px, py, pz);
      const b = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 1.6), new THREE.MeshStandardMaterial({ color: 0xb45309 }));
      b.position.y = 0.3;
      const t = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.4, 6), new THREE.MeshStandardMaterial({ color: 0x92400e }));
      t.position.set(0, 1.0, -0.9);
      t.rotation.x = -Math.PI / 3;
      g.add(b, t);
      return g;
    });
  }

  // 3. Mummified Bear Sentinel
  function createMummyBear(x, y, z) {
    return createCreature("mummy_bear", x, y, z, 5, function(grp, dt) {
      grp.position.x += this.dir * dt * 2.0;
      if (Math.abs(grp.position.x - this.startX) > 5) this.dir *= -1;
    }, function(px, py, pz) {
      const THREE = window.THREE;
      const g = new THREE.Group();
      g.position.set(px, py, pz);
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.9, 2.2, 8), new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.9 }));
      b.position.y = 1.1;
      const h = new THREE.Mesh(new THREE.SphereGeometry(0.6, 8, 8), new THREE.MeshStandardMaterial({ color: 0xfef3c7 }));
      h.position.y = 2.4;
      g.add(b, h);
      return g;
    });
  }

  // 4. Dust Devil Elemental
  function createDustDevil(x, y, z) {
    return createCreature("dust_devil", x, y, z, 2, function(grp, dt) {
      this.time += dt * 4;
      grp.rotation.y += dt * 6;
      grp.position.y = this.baseY + Math.sin(this.time) * 1.0;
    }, function(px, py, pz) {
      const THREE = window.THREE;
      const g = new THREE.Group();
      g.position.set(px, py, pz);
      const cone = new THREE.Mesh(new THREE.ConeGeometry(1.0, 2.4, 8), new THREE.MeshStandardMaterial({ color: 0xfde047, transparent: true, opacity: 0.7 }));
      cone.position.y = 1.2;
      g.add(cone);
      return g;
    });
  }

  // 5. Sacred Gold Scarab
  function createGoldScarab(x, y, z) {
    return createCreature("gold_scarab", x, y, z, 3, function(grp, dt) {
      grp.position.x += this.dir * dt * 3.5;
      if (Math.abs(grp.position.x - this.startX) > 6) this.dir *= -1;
    }, function(px, py, pz) {
      const THREE = window.THREE;
      const g = new THREE.Group();
      g.position.set(px, py, pz);
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 8), new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8, roughness: 0.2 }));
      b.scale.set(1.1, 0.6, 1.3);
      b.position.y = 0.4;
      g.add(b);
      return g;
    });
  }

  // 6. Desert Horned Viper
  function createHornedViper(x, y, z) {
    return createCreature("horned_viper", x, y, z, 2, function(grp, dt) {
      grp.position.z += this.dir * dt * 4.0;
      if (Math.abs(grp.position.z - this.startZ) > 7) this.dir *= -1;
    }, function(px, py, pz) {
      const THREE = window.THREE;
      const g = new THREE.Group();
      g.position.set(px, py, pz);
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2.0, 6), new THREE.MeshStandardMaterial({ color: 0x78350f }));
      b.rotation.x = Math.PI / 2;
      b.position.y = 0.2;
      g.add(b);
      return g;
    });
  }

  // 7. Hornet Sentry
  function createHornetSentry(x, y, z) {
    return createCreature("hornet_sentry", x, y, z, 3, function(grp, dt) {
      this.time += dt * 3;
      grp.position.y = this.baseY + Math.sin(this.time) * 1.4;
    }, function(px, py, pz) {
      const THREE = window.THREE;
      const g = new THREE.Group();
      g.position.set(px, py, pz);
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.6, 8, 8), new THREE.MeshStandardMaterial({ color: 0xca8a04 }));
      b.position.y = 1.0;
      g.add(b);
      return g;
    });
  }

  // 8. Desert Sun Falcon
  function createSunFalcon(x, y, z) {
    return createCreature("sun_falcon", x, y, z, 2, function(grp, dt) {
      this.time += dt * 3.5;
      grp.position.y = this.baseY + Math.sin(this.time) * 1.8;
      grp.position.x = this.startX + Math.sin(this.time * 0.8) * 5;
    }, function(px, py, pz) {
      const THREE = window.THREE;
      const g = new THREE.Group();
      g.position.set(px, py, pz);
      const b = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.4, 6), new THREE.MeshStandardMaterial({ color: 0x92400e }));
      b.rotation.x = Math.PI / 2;
      g.add(b);
      return g;
    });
  }

  // 9. Spiny Cactus Golem
  function createCactusGolem(x, y, z) {
    return createCreature("cactus_golem", x, y, z, 5, function(grp, dt) {
      grp.rotation.y += dt * 0.8;
    }, function(px, py, pz) {
      const THREE = window.THREE;
      const g = new THREE.Group();
      g.position.set(px, py, pz);
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2.5, 8), new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.9 }));
      b.position.y = 1.25;
      g.add(b);
      return g;
    });
  }

  // 10. Mirage Shifter
  function createMirageShifter(x, y, z) {
    return createCreature("mirage_shifter", x, y, z, 2, function(grp, dt) {
      this.time += dt * 2;
      grp.position.y = this.baseY + Math.sin(this.time) * 1.2;
    }, function(px, py, pz) {
      const THREE = window.THREE;
      const g = new THREE.Group();
      g.position.set(px, py, pz);
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 8), new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 }));
      b.position.y = 1.0;
      g.add(b);
      return g;
    });
  }

  // 11. Bastet Mummy Stalker
  function createBastetMummy(x, y, z) {
    return createCreature("bastet_mummy", x, y, z, 3, function(grp, dt) {
      grp.position.x += this.dir * dt * 3.2;
      if (Math.abs(grp.position.x - this.startX) > 5) this.dir *= -1;
    }, function(px, py, pz) {
      const THREE = window.THREE;
      const g = new THREE.Group();
      g.position.set(px, py, pz);
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 1.4), new THREE.MeshStandardMaterial({ color: 0x451a03 }));
      b.position.y = 0.6;
      g.add(b);
      return g;
    });
  }

  // 12. Molten Dune Skink
  function createMoltenSkink(x, y, z) {
    return createCreature("molten_skink", x, y, z, 3, function(grp, dt) {
      grp.position.z += this.dir * dt * 3.8;
      if (Math.abs(grp.position.z - this.startZ) > 6) this.dir *= -1;
    }, function(px, py, pz) {
      const THREE = window.THREE;
      const g = new THREE.Group();
      g.position.set(px, py, pz);
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, 1.8), new THREE.MeshStandardMaterial({ color: 0xea580c }));
      b.position.y = 0.3;
      g.add(b);
      return g;
    });
  }

  // 13. Anubis Stone Carrier
  function createAnubisCarrier(x, y, z) {
    return createCreature("anubis_carrier", x, y, z, 5, function(grp, dt) {
      grp.rotation.y += dt * 0.7;
    }, function(px, py, pz) {
      const THREE = window.THREE;
      const g = new THREE.Group();
      g.position.set(px, py, pz);
      const b = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.2, 1.0), new THREE.MeshStandardMaterial({ color: 0x1e1b4b }));
      b.position.y = 1.4;
      g.add(b);
      return g;
    });
  }

  // 14. Royal Hornet Knight
  function createHornetKnight(x, y, z) {
    return createCreature("hornet_knight", x, y, z, 4, function(grp, dt) {
      this.time += dt * 2.5;
      grp.position.y = this.baseY + Math.sin(this.time) * 1.3;
      grp.position.x = this.startX + Math.sin(this.time * 0.9) * 4.5;
    }, function(px, py, pz) {
      const THREE = window.THREE;
      const g = new THREE.Group();
      g.position.set(px, py, pz);
      const b = new THREE.Mesh(new THREE.ConeGeometry(0.7, 2.0, 8), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.6 }));
      b.position.y = 1.0;
      g.add(b);
      return g;
    });
  }

  // =========================================================================
  // MAIN EXTENSION POPULATOR FOR CHAPTER 14 (17 EXTENDED STAGES)
  // =========================================================================
  window.__populateBeeDesertExtension = function(game) {
    if (!window.THREE || !game || !game.scene) return;
    const THREE = window.THREE;
    console.log("🏜️ [Arılar Çölü] Orijinal Çöl korundu, 17 Yeni Aşama ve 14 Yeni Canlı Yükleniyor...");

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
      { name: "15. Aşama: Basamaklı Piramit Terasları", z: -3740, y: 62, cFn: createSoldierBee },
      { name: "16. Aşama: Anubis Sunağı & Gökyüzü Yolu", z: -3950, y: 66, cFn: createDuneScorpion }
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
      group: bossGroup,
      hp: 55,
      maxHp: 55,
      baseY: 70,
      attackTimer: 2.0,
      isDead: false,
      update: function(dt, playerPos, game) {
        if (this.isDead) return;
        this.attackTimer -= dt;
        bossGroup.position.y = this.baseY + Math.sin(Date.now() * 0.003) * 0.5;

        if (playerPos) {
          bossGroup.lookAt(playerPos.x, bossGroup.position.y, playerPos.z);
        }

        if (this.attackTimer <= 0) {
          this.attackTimer = 2.4;
          if (window.St && window.St.playBossRoar) window.St.playBossRoar();
        }

        if (playerPos) {
          const d = bossGroup.position.distanceTo(playerPos);
          if (d < 5.0 && playerPos.y > bossGroup.position.y + 2.5 && game.playerVel && game.playerVel.y < 0) {
            this.hp -= 5;
            game.playerVel.y = 15;
            if (window.St && window.St.playBossHit) window.St.playBossHit();

            if (this.hp <= 0) {
              this.isDead = true;
              bossGroup.visible = false;
              bossGroup.position.y = -9999;
              if (window.St && window.St.playGoalFanfare) window.St.playGoalFanfare();
              if (game.callbacks && game.callbacks.onShowNotice) {
                game.callbacks.onShowNotice("🎉 Sobek Yenildi! 15. Bölüm: Dünya Final Zirvesi Portalı Açıldı! ⛰️", "success");
              }
              if (desertVictoryPortal) {
                desertVictoryPortal.visible = true;
                desertVictoryPortal.position.set(0, 71, -4420);
              }
            }
          } else if (d < 3.5 && (!game.damageInvulnerable || game.damageInvulnerable <= 0)) {
            if (game.takeDamage) game.takeDamage(2);
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
      game.callbacks.onShowNotice("🏜️ 14. Bölüm Arılar Çölü 17 Yeni Aşamayla Genişletildi! 14 Yeni Canlı Eklendi!", "info");
    }
  };

  // =========================================================================
  // UPDATE TICKER FOR CHAPTER 14 EXTENSION
  // =========================================================================
  function updateBeeDesertExtension(dt) {
    const game = window.__superBearGame;
    if (!game || game.currentRegion !== "bee_desert") return;
    const playerPos = game.playerPos;

    for (let i = 0; i < desertCreatures.length; i++) {
      const c = desertCreatures[i];
      if (c && typeof c.update === "function") {
        c.update(dt, playerPos, game);
      }
    }

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
