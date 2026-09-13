const fs = require('fs');

console.log("🛠️ Starting comprehensive patch for Boss Damage, 3D Overhead HP Bars, Arena Cover Spots, and Audio Sync...");

// ----------------------------------------------------
// 1. PATCH public/game-enhancer.js
// ----------------------------------------------------
let enhancerCode = fs.readFileSync('public/game-enhancer.js', 'utf8');

// A) Comprehensive Laser Collision Loop in game-enhancer.js
const oldLaserLoop = `    for (let i = lasers.length - 1; i >= 0; i--) {
      const l = lasers[i];
      l.life += 1;
      l.mesh.position.x += l.dirX * 1.8;
      l.mesh.position.z += l.dirZ * 1.8;

      let laserHit = false;

      // Laser collision with Gold Coin Boss
      if (game.currentLevel && game.currentLevel.goldCoinBoss && game.currentLevel.goldCoinBoss.hp > 0) {
        const boss = game.currentLevel.goldCoinBoss;
        const bCenter = boss.pos.clone().add(new THREE.Vector3(0, 5.0, 0));
        if (l.mesh.position.distanceTo(bCenter) < 6.5) {
          if (!boss.hitInvulnTimer || boss.hitInvulnTimer <= 0) {
            boss.hitInvulnTimer = 0.45;
            boss.hp = Math.max(0, boss.hp - 45);
            if (typeof updateGoldCoinBossHealthBar === 'function') updateGoldCoinBossHealthBar(boss.hp, boss.maxHp);
            if (game.spawnSparkleParticles) game.spawnSparkleParticles(bCenter, 30, 0xfacc15);
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("⚡ PLAZMA LAZERİ İSABET ETTİ! Dev Altın Para Hasar Aldı! (-45 HP) [Kalan: " + Math.ceil(boss.hp) + " / " + boss.maxHp + "]", "success");
            }
          }
          laserHit = true;
        }
      }
      // Laser collision with Clown Boss
      if (!laserHit && game.currentLevel && game.currentLevel.clownBoss && game.currentLevel.clownBoss.hp > 0) {
        const cBoss = game.currentLevel.clownBoss;
        const cCenter = cBoss.pos.clone().add(new THREE.Vector3(0, 4.5, 0));
        if (l.mesh.position.distanceTo(cCenter) < 6.0) {
          cBoss.hp = Math.max(0, cBoss.hp - 80);
          if (game.spawnSparkleParticles) game.spawnSparkleParticles(cCenter, 25, 0xef4444);
          if (game.callbacks && game.callbacks.onShowNotice) {
            game.callbacks.onShowNotice("⚡ PLAZMA LAZERİ İSABET ETTİ! Palyaço Boss Hasar Aldı! (-80 HP) [Kalan: " + Math.ceil(cBoss.hp) + "]", "success");
          }
          laserHit = true;
        }
      }

      if (laserHit || l.life > 40) {
        game.scene.remove(l.mesh);
        lasers.splice(i, 1);
      }
    }`;

const newLaserLoop = `    for (let i = lasers.length - 1; i >= 0; i--) {
      const l = lasers[i];
      if (!l || !l.mesh) continue;
      l.life += 1;
      l.mesh.position.x += l.dirX * 1.8;
      l.mesh.position.z += l.dirZ * 1.8;

      let laserHit = false;
      const lPos = l.mesh.position;

      // Helper for laser hit processing
      const processLaserBossHit = (boss, title, hitDist, damageVal, colorHex = 0xef4444) => {
        if (!boss || boss.hp <= 0 || !boss.pos) return false;
        const bPos = boss.pos.clone ? boss.pos.clone() : new THREE.Vector3(boss.pos.x, boss.pos.y, boss.pos.z);
        bPos.y += 3.5;
        if (lPos.distanceTo(bPos) < hitDist) {
          if (!boss.hitInvulnTimer || boss.hitInvulnTimer <= 0) {
            boss.hitInvulnTimer = 0.35;
            boss.hp = Math.max(0, boss.hp - damageVal);
            if (boss.mesh && boss.mesh.userData && boss.mesh.userData.__overheadHpData) {
              window.__update3DOverheadHpBar(boss.mesh.userData.__overheadHpData, boss.hp, boss.maxHp || 100);
            }
            if (game.spawnSparkleParticles) game.spawnSparkleParticles(bPos, 25, colorHex);
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("⚡ KOZMİK LAZER İSABET ETTİ! " + title + " Hasar Aldı! (-" + damageVal + " HP) [Kalan: " + Math.ceil(boss.hp) + " HP]", "success");
            }
          }
          return true;
        }
        return false;
      };

      // 1. Gold Coin Boss
      if (game.currentLevel && game.currentLevel.goldCoinBoss) {
        laserHit = processLaserBossHit(game.currentLevel.goldCoinBoss, "İmparator Altın Para", 7.0, 45, 0xfacc15);
        if (laserHit && typeof updateGoldCoinBossHealthBar === 'function') {
          updateGoldCoinBossHealthBar(game.currentLevel.goldCoinBoss.hp, game.currentLevel.goldCoinBoss.maxHp);
        }
      }
      // 2. Clown Boss
      if (!laserHit && game.currentLevel && game.currentLevel.clownBoss) {
        laserHit = processLaserBossHit(game.currentLevel.clownBoss, "Dev Palyaço Boss", 6.5, 60, 0xef4444);
      }
      // 3. Lollipop Boss
      if (!laserHit && game.currentLevel && game.currentLevel.lollipopBoss) {
        laserHit = processLaserBossHit(game.currentLevel.lollipopBoss, "Lolipop Patronu", 6.0, 35, 0xec4899);
      }
      // 4. Ignis Dragon Boss
      if (!laserHit && game.currentLevel && game.currentLevel.enemies) {
        const dragon = game.currentLevel.enemies.find(e => e.id === 'boss_volcano_dragon');
        if (dragon) laserHit = processLaserBossHit(dragon, "Kızıl Alev Ejderhası Ignis", 7.5, 40, 0xf97316);
      }
      // 5. T-Rex Boss
      if (!laserHit && game.currentLevel && game.currentLevel.enemies) {
        const trex = game.currentLevel.enemies.find(e => e.id === 'boss_dino_trex');
        if (trex) laserHit = processLaserBossHit(trex, "Dev T-Rex Dinozor Boss", 7.0, 35, 0x10b981);
      }
      // 6. Subterranean Drake Boss
      if (!laserHit && typeof drakeBoss !== 'undefined' && drakeBoss) {
        laserHit = processLaserBossHit(drakeBoss, "Derin Yer Suyu Drake", 6.5, 30, 0x06b6d4);
      }
      // 7. Space Bosses (Mor Ayı / Dark Lord)
      if (!laserHit && typeof window.__spaceBossState !== 'undefined' && window.__spaceBossState) {
        const sBoss = window.__spaceBossState;
        if (sBoss && sBoss.hp > 0 && sBoss.pos) {
          laserHit = processLaserBossHit(sBoss, sBoss.title || "Kozmik Uzay Bossu", 6.5, 25, 0xa855f7);
        }
      }
      // 8. Poneix 14-Boss Fusion Titan
      if (!laserHit && typeof fusionBossInstance !== 'undefined' && fusionBossInstance) {
        const fMesh = fusionBossInstance.mesh;
        if (fMesh && fusionBossInstance.hp > 0) {
          const fPos = fMesh.position.clone();
          fPos.y += 5.0;
          if (lPos.distanceTo(fPos) < 10.0) {
            fusionBossInstance.hp = Math.max(0, fusionBossInstance.hp - 20);
            if (fMesh.userData && fMesh.userData.__overheadHpData) {
              window.__update3DOverheadHpBar(fMesh.userData.__overheadHpData, fusionBossInstance.hp, fusionBossInstance.maxHp || 120);
            }
            if (typeof showPoneixBossHp === 'function') {
              showPoneixBossHp(fusionBossInstance.title, fusionBossInstance.hp, fusionBossInstance.maxHp, "⚡ Lazer İsabet Etti! Fusion Titan Zayıflıyor!");
            }
            if (game.spawnSparkleParticles) game.spawnSparkleParticles(lPos.clone(), 30, 0x34d399);
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("⚡ LAZER İSABET ETTİ! 14 Boss Füzyon Titanı Hasar Aldı! (-20 HP)", "success");
            }
            laserHit = true;
          }
        }
      }
      // 9. Phelix Tilki Boss Mecha
      if (!laserHit && typeof foxBossInstance !== 'undefined' && foxBossInstance) {
        const xMesh = foxBossInstance.mesh;
        if (xMesh && foxBossInstance.hp > 0) {
          const xPos = xMesh.position.clone();
          xPos.y += 4.5;
          if (lPos.distanceTo(xPos) < 8.5) {
            foxBossInstance.hp = Math.max(0, foxBossInstance.hp - 25);
            if (xMesh.userData && xMesh.userData.__overheadHpData) {
              window.__update3DOverheadHpBar(xMesh.userData.__overheadHpData, foxBossInstance.hp, foxBossInstance.maxHp || 100);
            }
            if (typeof showFoxBossHp === 'function') {
              showFoxBossHp(foxBossInstance.title, foxBossInstance.hp, foxBossInstance.maxHp, "⚡ Tilki Boss Mecha Lazerle Vuruldu!");
            }
            if (game.spawnSparkleParticles) game.spawnSparkleParticles(lPos.clone(), 25, 0x38bdf8);
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("⚡ LAZER İSABET ETTİ! Tilki Boss Mecha Hasar Aldı! (-25 HP)", "success");
            }
            laserHit = true;
          }
        }
      }

      if (laserHit || l.life > 40) {
        game.scene.remove(l.mesh);
        lasers.splice(i, 1);
      }
    }`;

enhancerCode = enhancerCode.replace(oldLaserLoop, newLaserLoop);

// Attach 3D Overhead HP Bar & Cover Spots to Gold Coin Boss in game-enhancer.js
const goldBossInitMarker = `game.currentLevel.mesh.add(bossGroup);
    game.currentLevel.goldCoinBoss = {
        mesh: bossGroup,
        pos: bossPos,
        hp: 3000,
        maxHp: 3000,
        hitInvulnTimer: 0,
        deadMessageShown: false
    };`;

const goldBossInitReplacement = `game.currentLevel.mesh.add(bossGroup);
    game.currentLevel.goldCoinBoss = {
        mesh: bossGroup,
        pos: bossPos,
        hp: 3000,
        maxHp: 3000,
        hitInvulnTimer: 0,
        deadMessageShown: false
    };
    if (window.__create3DOverheadHpBar) {
        window.__create3DOverheadHpBar(window.THREE, bossGroup, "İmparator Altın Para", 3000, 8.5);
    }
    if (window.__addBossArenaCoverSpots) {
        window.__addBossArenaCoverSpots(window.THREE, game.currentLevel.mesh, bossPos.x, bossPos.y, bossPos.z);
    }`;

enhancerCode = enhancerCode.replace(goldBossInitMarker, goldBossInitReplacement);

fs.writeFileSync('public/game-enhancer.js', enhancerCode);
console.log("✅ Updated public/game-enhancer.js with comprehensive laser boss collision & 3D overhead bar logic!");

// ----------------------------------------------------
// 2. PATCH public/space-levels.js
// ----------------------------------------------------
let spaceCode = fs.readFileSync('public/space-levels.js', 'utf8');

// In space-levels.js, attach 3D Overhead HP Bar & Cover Spots to Mor Ayı Boss and Dark Lord Boss
const oldMorAyiInit = `morAyiBoss = {
      mesh: bossGroup,
      pos: bossPos,
      hp: 150,
      maxHp: 150,
      title: "👑 DEV MOR AYI BOSS (HARDCORE PATRONU)",
      hitCooldown: 0
    };`;

const newMorAyiInit = `morAyiBoss = {
      mesh: bossGroup,
      pos: bossPos,
      hp: 150,
      maxHp: 150,
      title: "👑 DEV MOR AYI BOSS (HARDCORE PATRONU)",
      hitCooldown: 0
    };
    if (window.__create3DOverheadHpBar && window.THREE) {
      window.__create3DOverheadHpBar(window.THREE, bossGroup, "Dev Mor Ayı Boss", 150, 6.5);
    }
    if (window.__addBossArenaCoverSpots && window.THREE && game.currentLevel) {
      window.__addBossArenaCoverSpots(window.THREE, game.currentLevel.mesh || game.scene, bossPos.x, bossPos.y, bossPos.z);
    }`;

spaceCode = spaceCode.replace(oldMorAyiInit, newMorAyiInit);

const oldDarkLordInit = `darkLordBoss = {
      mesh: bossGroup,
      pos: bossPos,
      hp: 200,
      maxHp: 200,
      title: "👑 KARANLIK LORT (DARK LORD) UZAY BOSSU",
      hitCooldown: 0
    };`;

const newDarkLordInit = `darkLordBoss = {
      mesh: bossGroup,
      pos: bossPos,
      hp: 200,
      maxHp: 200,
      title: "👑 KARANLIK LORT (DARK LORD) UZAY BOSSU",
      hitCooldown: 0
    };
    if (window.__create3DOverheadHpBar && window.THREE) {
      window.__create3DOverheadHpBar(window.THREE, bossGroup, "Karanlık Lort Uzay Bossu", 200, 7.5);
    }
    if (window.__addBossArenaCoverSpots && window.THREE && game.currentLevel) {
      window.__addBossArenaCoverSpots(window.THREE, game.currentLevel.mesh || game.scene, bossPos.x, bossPos.y, bossPos.z);
    }`;

spaceCode = spaceCode.replace(oldDarkLordInit, newDarkLordInit);

// Update 3D Overhead HP bar in Mor Ayı hit function in space-levels.js
spaceCode = spaceCode.replace(
  `morAyiBoss.hp -= 5;\n          showSpaceBossHp(morAyiBoss.title, morAyiBoss.hp, morAyiBoss.maxHp);`,
  `morAyiBoss.hp -= 15;\n          showSpaceBossHp(morAyiBoss.title, morAyiBoss.hp, morAyiBoss.maxHp);\n          if (morAyiBoss.mesh && morAyiBoss.mesh.userData && morAyiBoss.mesh.userData.__overheadHpData) window.__update3DOverheadHpBar(morAyiBoss.mesh.userData.__overheadHpData, morAyiBoss.hp, morAyiBoss.maxHp);`
);

fs.writeFileSync('public/space-levels.js', spaceCode);
console.log("✅ Updated public/space-levels.js with 3D Overhead HP Bar & Cover Spots!");

// ----------------------------------------------------
// 3. PATCH public/poneix-levels.js
// ----------------------------------------------------
let poneixCode = fs.readFileSync('public/poneix-levels.js', 'utf8');

const oldFusionInit = `fusionBossInstance = {
      mesh: bossGroup,
      pos: bossPos,
      hp: 120,
      maxHp: 120,
      title: "👑 14 DÜNYA BİRLEŞİK FÜZYON BOSSU (CHIMERA TITAN)",
      isDead: false
    };`;

const newFusionInit = `fusionBossInstance = {
      mesh: bossGroup,
      pos: bossPos,
      hp: 120,
      maxHp: 120,
      title: "👑 14 DÜNYA BİRLEŞİK FÜZYON BOSSU (CHIMERA TITAN)",
      isDead: false
    };
    if (window.__create3DOverheadHpBar && THREE) {
      window.__create3DOverheadHpBar(THREE, bossGroup, "14 Boss Fusion Titan", 120, 11.5);
    }
    if (window.__addBossArenaCoverSpots && THREE && sceneGroup) {
      window.__addBossArenaCoverSpots(THREE, sceneGroup, bossPos.x, bossPos.y, bossPos.z);
    }`;

poneixCode = poneixCode.replace(oldFusionInit, newFusionInit);

// Update overhead bar in hit function
poneixCode = poneixCode.replace(
  `showPoneixBossHp(b.title, b.hp, b.maxHp, "⚡ Başarılı Vuruş! 14 Bossun Birleşik Gücü Zayıflıyor!");`,
  `showPoneixBossHp(b.title, b.hp, b.maxHp, "⚡ Başarılı Vuruş! 14 Bossun Birleşik Gücü Zayıflıyor!");\n          if (b.mesh && b.mesh.userData && b.mesh.userData.__overheadHpData) window.__update3DOverheadHpBar(b.mesh.userData.__overheadHpData, b.hp, b.maxHp);`
);

fs.writeFileSync('public/poneix-levels.js', poneixCode);
console.log("✅ Updated public/poneix-levels.js with 3D Overhead HP Bar & Cover Spots!");

// ----------------------------------------------------
// 4. PATCH public/phelix-levels.js
// ----------------------------------------------------
let phelixCode = fs.readFileSync('public/phelix-levels.js', 'utf8');

const oldFoxInit = `foxBossInstance = {
      mesh: root,
      pos: bossPos,
      hp: 100,
      maxHp: 100,
      title: "🦊 TİLKİ BOSS (PHELİX SAVAŞ MECHASI)",
      isDead: false
    };`;

const newFoxInit = `foxBossInstance = {
      mesh: root,
      pos: bossPos,
      hp: 100,
      maxHp: 100,
      title: "🦊 TİLKİ BOSS (PHELİX SAVAŞ MECHASI)",
      isDead: false
    };
    if (window.__create3DOverheadHpBar && THREE) {
      window.__create3DOverheadHpBar(THREE, root, "Tilki Boss Savaş Mechasi", 100, 8.5);
    }
    if (window.__addBossArenaCoverSpots && THREE && sceneGroup) {
      window.__addBossArenaCoverSpots(THREE, sceneGroup, bossPos.x, bossPos.y, bossPos.z);
    }`;

phelixCode = phelixCode.replace(oldFoxInit, newFoxInit);

// Update overhead bar in fox hit function
phelixCode = phelixCode.replace(
  `showFoxBossHp(b.title, b.hp, b.maxHp, "💥 Tilki Boss Mecha Hasar Aldı! (-15 HP)");`,
  `showFoxBossHp(b.title, b.hp, b.maxHp, "💥 Tilki Boss Mecha Hasar Aldı! (-15 HP)");\n          if (b.mesh && b.mesh.userData && b.mesh.userData.__overheadHpData) window.__update3DOverheadHpBar(b.mesh.userData.__overheadHpData, b.hp, b.maxHp);`
);

fs.writeFileSync('public/phelix-levels.js', phelixCode);
console.log("✅ Updated public/phelix-levels.js with 3D Overhead HP Bar & Cover Spots!");

console.log("🎉 Complete Boss Patch Finished Successfully!");
