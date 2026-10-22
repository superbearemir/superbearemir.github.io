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
  // 16 UNIQUE SUMMIT CREATURE GENERATOR HELPERS
  // =========================================================================
  function createSummitCreature(type, x, y, z, hp, updateFn, meshCreator) {
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
          if (d < 1.9 && playerPos.y > group.position.y + 0.9 && game.playerVel && game.playerVel.y < 0) {
            this.hp -= 2;
            game.playerVel.y = 12;
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

  // 1. Stratosfer Plazma Gözcüsü (Plasma Sky Watcher)
  function createPlasmaWatcher(x, y, z) {
    return createSummitCreature("plasma_watcher", x, y, z, 3, function(grp, dt) {
      this.time += dt * 3;
      grp.position.y = this.baseY + Math.sin(this.time) * 1.5;
    }, function(px, py, pz) {
      const THREE = window.THREE;
      const g = new THREE.Group();
      g.position.set(px, py, pz);
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.8, 12, 12), new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 0.8 }));
      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), new THREE.MeshBasicMaterial({ color: 0x000000 }));
      pupil.position.z = 0.7;
      g.add(eye, pupil);
      return g;
    });
  }

  // 2. Kızıl Lav Ejdercik (Crimson Drake Hatchling)
  function createCrimsonDrake(x, y, z) {
    return createSummitCreature("crimson_drake", x, y, z, 4, function(grp, dt) {
      this.time += dt * 4;
      grp.position.y = this.baseY + Math.sin(this.time) * 1.6;
      grp.position.x = this.startX + Math.sin(this.time * 0.8) * 4;
    }, function(px, py, pz) {
      const THREE = window.THREE;
      const g = new THREE.Group();
      g.position.set(px, py, pz);
      const b = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.6, 6), new THREE.MeshStandardMaterial({ color: 0x991b1b }));
      b.rotation.x = Math.PI / 2;
      g.add(b);
      return g;
    });
  }

  // 3. Kozmik Şimşek Şövalyesi (Cosmic Lightning Knight)
  function createLightningKnight(x, y, z) {
    return createSummitCreature("lightning_knight", x, y, z, 5, function(grp, dt) {
      grp.rotation.y += dt * 1.2;
    }, function(px, py, pz) {
      const THREE = window.THREE;
      const g = new THREE.Group();
      g.position.set(px, py, pz);
      const b = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.0, 0.8), new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.8 }));
      b.position.y = 1.0;
      g.add(b);
      return g;
    });
  }

  // 4. Zirve Kar Leoparı (Summit Frost Leopard)
  function createFrostLeopard(x, y, z) {
    return createSummitCreature("frost_leopard", x, y, z, 4, function(grp, dt) {
      grp.position.z += this.dir * dt * 4.2;
      if (Math.abs(grp.position.z - this.startZ) > 7) this.dir *= -1;
    }, function(px, py, pz) {
      const THREE = window.THREE;
      const g = new THREE.Group();
      g.position.set(px, py, pz);
      const b = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.7, 2.0), new THREE.MeshStandardMaterial({ color: 0xe0f2fe }));
      b.position.y = 0.5;
      g.add(b);
      return g;
    });
  }

  // 5. Antik Titan Baş Muhafızı (Ancient Colossus Warden)
  function createColossusWarden(x, y, z) {
    return createSummitCreature("colossus_warden", x, y, z, 7, function(grp, dt) {
      grp.rotation.y += dt * 0.6;
    }, function(px, py, pz) {
      const THREE = window.THREE;
      const g = new THREE.Group();
      g.position.set(px, py, pz);
      const b = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.8, 1.4), new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 }));
      b.position.y = 1.6;
      g.add(b);
      return g;
    });
  }

  // 6. Kızıl Çizgi Hançercisi (Red Line Assassin)
  function createRedLineAssassin(x, y, z) {
    return createSummitCreature("red_line_assassin", x, y, z, 3, function(grp, dt) {
      grp.position.x += this.dir * dt * 4.0;
      if (Math.abs(grp.position.x - this.startX) > 6) this.dir *= -1;
    }, function(px, py, pz) {
      const THREE = window.THREE;
      const g = new THREE.Group();
      g.position.set(px, py, pz);
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 2.0, 6), new THREE.MeshStandardMaterial({ color: 0xdc2626 }));
      b.position.y = 1.0;
      g.add(b);
      return g;
    });
  }

  // 7. Aura Büyücüsü (Aura Sorcerer)
  function createAuraSorcerer(x, y, z) {
    return createSummitCreature("aura_sorcerer", x, y, z, 3, function(grp, dt) {
      this.time += dt * 2.5;
      grp.position.y = this.baseY + Math.sin(this.time) * 1.3;
    }, function(px, py, pz) {
      const THREE = window.THREE;
      const g = new THREE.Group();
      g.position.set(px, py, pz);
      const b = new THREE.Mesh(new THREE.ConeGeometry(0.8, 2.4, 8), new THREE.MeshStandardMaterial({ color: 0x7c3aed }));
      b.position.y = 1.2;
      g.add(b);
      return g;
    });
  }

  // 8. Stratosfer Harpiya Kraliçesi (Queen Harpy)
  function createQueenHarpy(x, y, z) {
    return createSummitCreature("queen_harpy", x, y, z, 4, function(grp, dt) {
      this.time += dt * 3.5;
      grp.position.y = this.baseY + Math.sin(this.time) * 1.8;
      grp.position.x = this.startX + Math.sin(this.time * 0.9) * 4.5;
    }, function(px, py, pz) {
      const THREE = window.THREE;
      const g = new THREE.Group();
      g.position.set(px, py, pz);
      const b = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.8, 6), new THREE.MeshStandardMaterial({ color: 0x475569 }));
      b.position.y = 1.0;
      g.add(b);
      return g;
    });
  }

  // 9. Meteorite Golemi (Meteor Golem)
  function createMeteorGolem(x, y, z) {
    return createSummitCreature("meteor_golem", x, y, z, 6, function(grp, dt) {
      grp.rotation.x += dt * 3;
      grp.position.z += this.dir * dt * 3.5;
      if (Math.abs(grp.position.z - this.startZ) > 7) this.dir *= -1;
    }, function(px, py, pz) {
      const THREE = window.THREE;
      const g = new THREE.Group();
      g.position.set(px, py, pz);
      const b = new THREE.Mesh(new THREE.SphereGeometry(1.0, 8, 8), new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.9 }));
      b.position.y = 1.0;
      g.add(b);
      return g;
    });
  }

  // 10. Kızıl Boğa Canavarı (Crimson Minotaur)
  function createCrimsonMinotaur(x, y, z) {
    return createSummitCreature("minotaur", x, y, z, 6, function(grp, dt) {
      grp.position.x += this.dir * dt * 3.8;
      if (Math.abs(grp.position.x - this.startX) > 6) this.dir *= -1;
    }, function(px, py, pz) {
      const THREE = window.THREE;
      const g = new THREE.Group();
      g.position.set(px, py, pz);
      const b = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.4, 1.2), new THREE.MeshStandardMaterial({ color: 0x7f1d1d }));
      b.position.y = 1.3;
      g.add(b);
      return g;
    });
  }

  // 11. Gölge Kanat Gargoyle (Shadowwing Gargoyle)
  function createShadowwingGargoyle(x, y, z) {
    return createSummitCreature("gargoyle", x, y, z, 4, function(grp, dt) {
      this.time += dt * 3;
      grp.position.y = this.baseY + Math.sin(this.time) * 1.5;
    }, function(px, py, pz) {
      const THREE = window.THREE;
      const g = new THREE.Group();
      g.position.set(px, py, pz);
      const b = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.4, 0.8), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
      b.position.y = 0.8;
      g.add(b);
      return g;
    });
  }

  // 12. Kutup Yıldızı Ruhu (Polaris Wisp)
  function createPolarisWisp(x, y, z) {
    return createSummitCreature("polaris_wisp", x, y, z, 3, function(grp, dt) {
      this.time += dt * 2.5;
      grp.position.y = this.baseY + Math.sin(this.time) * 1.2;
    }, function(px, py, pz) {
      const THREE = window.THREE;
      const g = new THREE.Group();
      g.position.set(px, py, pz);
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 8), new THREE.MeshStandardMaterial({ color: 0x67e8f9, emissive: 0x06b6d4, emissiveIntensity: 0.6 }));
      b.position.y = 1.0;
      g.add(b);
      return g;
    });
  }

  // 13. Obsidyen Kalkan Taşıyıcısı (Obsidian Shieldbearer)
  function createShieldbearer(x, y, z) {
    return createSummitCreature("shieldbearer", x, y, z, 5, function(grp, dt) {
      grp.rotation.y += dt * 0.8;
    }, function(px, py, pz) {
      const THREE = window.THREE;
      const g = new THREE.Group();
      g.position.set(px, py, pz);
      const b = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.2, 0.6), new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 }));
      b.position.y = 1.2;
      g.add(b);
      return g;
    });
  }

  // 14. Kızıl Kristal Yılanı (Crimson Crystal Serpent)
  function createCrystalSerpent(x, y, z) {
    return createSummitCreature("serpent", x, y, z, 4, function(grp, dt) {
      grp.position.z += this.dir * dt * 3.5;
      if (Math.abs(grp.position.z - this.startZ) > 7) this.dir *= -1;
    }, function(px, py, pz) {
      const THREE = window.THREE;
      const g = new THREE.Group();
      g.position.set(px, py, pz);
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 2.5, 6), new THREE.MeshStandardMaterial({ color: 0xb91c1c }));
      b.rotation.x = Math.PI / 2;
      b.position.y = 0.3;
      g.add(b);
      return g;
    });
  }

  // 15. Fırtına Devinin Eli (Storm Giant Hand)
  function createStormGiantHand(x, y, z) {
    return createSummitCreature("giant_hand", x, y, z, 5, function(grp, dt) {
      this.time += dt * 2.8;
      grp.position.y = this.baseY + Math.abs(Math.sin(this.time)) * 1.6;
    }, function(px, py, pz) {
      const THREE = window.THREE;
      const g = new THREE.Group();
      g.position.set(px, py, pz);
      const b = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.6, 1.6), new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.5 }));
      b.position.y = 0.5;
      g.add(b);
      return g;
    });
  }

  // 16. Moris Kraliyet Elit Muhafızı (Moris Supreme Praetorian)
  function createMorisPraetorian(x, y, z) {
    return createSummitCreature("moris_praetorian", x, y, z, 6, function(grp, dt) {
      grp.rotation.y += dt * 1.5;
      grp.position.x += this.dir * dt * 3.2;
      if (Math.abs(grp.position.x - this.startX) > 5) this.dir *= -1;
    }, function(px, py, pz) {
      const THREE = window.THREE;
      const g = new THREE.Group();
      g.position.set(px, py, pz);
      const b = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, 1.0), new THREE.MeshStandardMaterial({ color: 0x701a75, emissive: 0x4a044e, emissiveIntensity: 0.5 }));
      b.position.y = 1.2;
      g.add(b);
      return g;
    });
  }

  // =========================================================================
  // MAIN EXTENSION POPULATOR FOR CHAPTER 15 (18 EXTENDED STAGES)
  // =========================================================================
  window.__populateEarthSummitExtension = function(game) {
    if (!window.THREE || !game || !game.scene) return;
    const THREE = window.THREE;
    console.log("⛰️ [Dünya Zirvesi] Orijinal 15 Aşama korundu, 18 Yeni Aşama ve 16 Yeni Canlı Yükleniyor...");

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
      { name: "17. Aşama: Göksel Şampiyonluk Rampası", z: -6120, y: 152, cFn: createPlasmaWatcher }
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
    // RELOCATED ULTIMATE FINAL BOSS: MORİS (STAGE 18)
    // -------------------------------------------------------------------------
    const bossGroup = new THREE.Group();
    bossGroup.position.set(0, 160, -6520);

    const morisFur = new THREE.MeshStandardMaterial({ color: 0x7e22ce, roughness: 0.8 });
    const redAura = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 1.0 });

    const torso = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.8, 7, 16), morisFur);
    torso.position.y = 4.0;
    bossGroup.add(torso);

    const head = new THREE.Mesh(new THREE.SphereGeometry(2.2, 14, 14), morisFur);
    head.position.y = 9.0;
    bossGroup.add(head);

    // Red Crown of Chaos
    const crown = new THREE.Mesh(new THREE.ConeGeometry(1.8, 2.5, 6), redAura);
    crown.rotation.x = Math.PI;
    crown.position.set(0, 12.5, 0);
    bossGroup.add(crown);

    // Glowing Red Eyes
    [-0.7, 0.7].forEach(ex => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), redAura);
      eye.position.set(ex, 9.2, 2.0);
      bossGroup.add(eye);
    });

    summitExtGroup.add(bossGroup);

    summitExtMorisBoss = {
      group: bossGroup,
      hp: 100,
      maxHp: 100,
      baseY: 160,
      attackTimer: 2.0,
      isDead: false,
      update: function(dt, playerPos, game) {
        if (this.isDead) return;
        this.attackTimer -= dt;
        bossGroup.position.y = this.baseY + Math.sin(Date.now() * 0.003) * 1.0;

        if (playerPos) {
          bossGroup.lookAt(playerPos.x, bossGroup.position.y, playerPos.z);
        }

        if (this.attackTimer <= 0) {
          this.attackTimer = 2.0;
          if (window.St && window.St.playBossRoar) window.St.playBossRoar();
        }

        if (playerPos) {
          const d = bossGroup.position.distanceTo(playerPos);
          if (d < 5.0 && playerPos.y > bossGroup.position.y + 7.0 && game.playerVel && game.playerVel.y < 0) {
            this.hp -= 10;
            game.playerVel.y = 16;
            if (window.St && window.St.playBossHit) window.St.playBossHit();

            if (this.hp <= 0) {
              this.isDead = true;
              bossGroup.visible = false;
              bossGroup.position.y = -9999;
              if (window.St && window.St.playGoalFanfare) window.St.playGoalFanfare();
              if (game.callbacks && game.callbacks.onShowNotice) {
                game.callbacks.onShowNotice("🏆 MORİS YENİLDİ! EVRENSEL ŞAMPİYONLUK KUPASI KAZANILDI! AYI KÖYÜ PORTALI AÇIK! 🎉", "success");
              }
              if (summitExtVictoryPortal) {
                summitExtVictoryPortal.visible = true;
                summitExtVictoryPortal.position.set(0, 161, -6590);
              }
            }
          } else if (d < 3.5 && (!game.damageInvulnerable || game.damageInvulnerable <= 0)) {
            if (game.takeDamage) game.takeDamage(2);
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
      game.callbacks.onShowNotice("⛰️ 15. Bölüm Dünya Zirvesi 18 Yeni Aşamayla Genişletildi! 16 Yeni Canlı Eklendi!", "info");
    }
  };

  // =========================================================================
  // UPDATE TICKER FOR CHAPTER 15 EXTENSION
  // =========================================================================
  function updateEarthSummitExtension(dt) {
    const game = window.__superBearGame;
    if (!game || game.currentRegion !== "earth_summit") return;
    const playerPos = game.playerPos;

    for (let i = 0; i < summitExtCreatures.length; i++) {
      const c = summitExtCreatures[i];
      if (c && typeof c.update === "function") {
        c.update(dt, playerPos, game);
      }
    }

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
