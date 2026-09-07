const fs = require('fs');
let code = fs.readFileSync('public/game-enhancer.js', 'utf8');

const populateStart = code.indexOf('function populateDinosaurWorld');
const enhanceStart = code.indexOf('function enhanceGame() {');

let cleanCode = code.substring(0, populateStart);

cleanCode += `function createCheckpointVisual(THREE, pos) {
    const cpGroup = new THREE.Group();
    cpGroup.position.copy(pos);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3, 8), new THREE.MeshStandardMaterial({color:0xffffff}));
    pole.position.y = 1.5;
    cpGroup.add(pole);
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1), new THREE.MeshStandardMaterial({color:0x00ff00, side: THREE.DoubleSide}));
    flag.position.set(0.75, 2.5, 0);
    cpGroup.add(flag);
    return cpGroup;
}

function populateDinosaurWorld(game) {
    const THREE = window.THREE;
    if (!game.currentLevel) game.currentLevel = {};
    if (!game.currentLevel.mesh) {
        game.currentLevel.mesh = new THREE.Group();
        game.scene.add(game.currentLevel.mesh);
    }
    
    if (!game.currentLevel.enemies) game.currentLevel.enemies = [];
    if (!game.currentLevel.bounds) game.currentLevel.bounds = { minX: -200, maxX: 200, minZ: -200, maxZ: 200, minY: -10, maxY: 200 };
    if (!game.currentLevel.colliders) game.currentLevel.colliders = [];
    if (!game.currentLevel.fireballs) game.currentLevel.fireballs = [];
    if (!game.currentLevel.checkpoints) game.currentLevel.checkpoints = [];

    game.scene.background = new THREE.Color(0x3b0764); 
    game.scene.fog = new THREE.Fog(0x3b0764, 20, 150);

    const floorGeo = new THREE.BoxGeometry(300, 2, 300);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x2e1065, roughness: 0.9 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(0, -1, 0);
    game.currentLevel.mesh.add(floor);

    game.currentLevel.colliders.push({
        min: new THREE.Vector3(-150, -2, -150),
        max: new THREE.Vector3(150, 0, 150)
    });

    const platMat = new THREE.MeshStandardMaterial({ color: 0x7e22ce, roughness: 0.7 });
    const stepMat = new THREE.MeshStandardMaterial({ color: 0xc084fc, roughness: 0.8 });
    const obstacleMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.5 }); // Yellow obstacles
    const spikeMat = new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.5 }); // Red obstacles

    // Giant Boss Tower (Beautiful place for boss)
    const towerGeo = new THREE.CylinderGeometry(25, 30, 50, 16);
    const tower = new THREE.Mesh(towerGeo, platMat);
    tower.position.set(0, 24, -90);
    game.currentLevel.mesh.add(tower);
    
    game.currentLevel.colliders.push({
        min: new THREE.Vector3(-22, 0, -112),
        max: new THREE.Vector3(22, 49, -68)
    });

    // Checkpoint before Boss
    const cpPos = new THREE.Vector3(0, 49.5, -68);
    const cpVisual = createCheckpointVisual(THREE, cpPos);
    game.currentLevel.mesh.add(cpVisual);
    game.currentLevel.checkpoints.push({ pos: cpPos, active: false });

    // Spawn Point Checkpoint
    game.currentLevel.spawnPoint = new THREE.Vector3(0, 0.5, 60);

    // Obstacles and Steps (Mor Bal theme)
    // Make them progressively harder
    for (let i = 0; i < 28; i++) {
        // Reduced step size to make jumping slightly more precise
        const step = new THREE.Mesh(new THREE.BoxGeometry(6, 1.5, 6), stepMat);
        const stepX = Math.sin(i * 0.4) * 15;
        const stepY = i * 1.8;
        const stepZ = 40 - i * 3.8;
        step.position.set(stepX, stepY, stepZ);
        game.currentLevel.mesh.add(step);
        game.currentLevel.colliders.push({
            min: new THREE.Vector3(step.position.x - 3, step.position.y - 0.75, step.position.z - 3),
            max: new THREE.Vector3(step.position.x + 3, step.position.y + 0.75, step.position.z + 3)
        });

        // Add some random towers as obstacles that block the path
        if (i > 3 && i % 2 === 0) {
            // Rotating/static obstacles
            const ob = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 6, 8), obstacleMat);
            const obOffset = (Math.random() > 0.5 ? 2 : -2);
            ob.position.set(step.position.x + obOffset, step.position.y + 3, step.position.z);
            game.currentLevel.mesh.add(ob);
            game.currentLevel.colliders.push({
                min: new THREE.Vector3(ob.position.x - 1.5, ob.position.y - 3, ob.position.z - 1.5),
                max: new THREE.Vector3(ob.position.x + 1.5, ob.position.y + 3, ob.position.z + 1.5)
            });
        }
        
        // Add toxic/damage obstacles (red spikes) on some steps
        if (i > 8 && i % 3 === 0) {
            const spike = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 8), spikeMat);
            spike.position.set(step.position.x, step.position.y + 1.5, step.position.z);
            game.currentLevel.mesh.add(spike);
            
            // Push toxic collider
            game.currentLevel.colliders.push({
                min: new THREE.Vector3(spike.position.x - 1, spike.position.y - 1, spike.position.z - 1),
                max: new THREE.Vector3(spike.position.x + 1, spike.position.y + 1, spike.position.z + 1),
                isToxic: true // Toxic makes player take damage if touched
            });
        }
    }

    // Mini Dinosaurs
    for(let i=0; i<20; i++) {
        const miniDino = createDinoMesh(THREE, false);
        const pos = new THREE.Vector3((Math.random()-0.5)*140, 0.5, (Math.random()-0.5)*100 + 40);
        miniDino.position.copy(pos);
        game.currentLevel.mesh.add(miniDino);
        
        game.currentLevel.enemies.push({
            id: \`mini_dino_\${i}\`,
            type: 'dino_minion',
            name: 'Küçük Dinozor',
            mesh: miniDino,
            pos: pos,
            velocity: new THREE.Vector3(),
            hp: 100,
            maxHp: 100,
            attackPower: 3,
            isBoss: false,
            attackCooldown: 0,
            state: 'chase',
            animTimer: Math.random() * 10
        });
    }

    // Dev T-Rex Boss
    const trexBoss = createDinoMesh(THREE, true);
    const bossPos = new THREE.Vector3(0, 49, -95);
    trexBoss.position.copy(bossPos);
    game.currentLevel.mesh.add(trexBoss);
    
    game.currentLevel.enemies.push({
        id: 'boss_trex',
        type: 'dino_trex_boss',
        name: 'Dev T-Rex Boss',
        mesh: trexBoss,
        pos: bossPos,
        velocity: new THREE.Vector3(),
        hp: 1000,
        maxHp: 1000,
        attackPower: 15,
        isBoss: true,
        attackCooldown: 0,
        state: 'chase',
        animTimer: 0
    });
}

function updateSpaceLoop() {
  const game = window.__superBearGame;
  if (!game) {
    requestAnimationFrame(updateSpaceLoop);
    return;
  }

  if (game.currentRegion === 'dinosaur_world' && !dinoWorldPopulated) {
      dinoWorldPopulated = true;
      populateDinosaurWorld(game);
  } else if (game.currentRegion !== 'dinosaur_world') {
      dinoWorldPopulated = false;
  }
  
  if (game.currentRegion === 'dinosaur_world' && game.currentLevel && game.currentLevel.enemies) {
      const trex = game.currentLevel.enemies.find(e => e.id === 'boss_trex');
      if (trex && trex.hp <= 0 && !trex.deadMessageShown) {
          trex.deadMessageShown = true;
          if (game.callbacks && game.callbacks.onShowNotice) {
              setTimeout(() => {
                 game.callbacks.onShowNotice("Aferin beni yendin ben seni güçsüz bir ayı sanmıştım ama sen çok cesur ve yeteneklisin aferin");
              }, 1000);
          }
      }

      if (game.playerPos) {
          const pPos = game.playerPos;
          const dt = 0.016; 
          
          game.currentLevel.enemies.forEach(e => {
              if (e.hp <= 0) return;
              
              const dist = e.pos.distanceTo(pPos);
              
              if (e.type === 'dino_trex_boss') {
                  // Only wake up if player is very close (e.g. reached the tower)
                  if (dist < 32) { 
                      e.mesh.rotation.y = Math.atan2(pPos.x - e.pos.x, pPos.z - e.pos.z);
                      
                      if (dist > 8) {
                          const dir = pPos.clone().sub(e.pos).normalize();
                          e.pos.x += dir.x * 2.5 * dt;
                          e.pos.z += dir.z * 2.5 * dt;
                      }
                      
                      // Keep boss on the tower (center: 0, -90, radius: 24)
                      const distToTowerCenter = Math.sqrt(e.pos.x * e.pos.x + (e.pos.z + 90) * (e.pos.z + 90));
                      if (distToTowerCenter > 22) {
                          const angle = Math.atan2(e.pos.x, e.pos.z + 90);
                          e.pos.x = Math.sin(angle) * 22;
                          e.pos.z = -90 + Math.cos(angle) * 22;
                      }

                      if (e.attackCooldown <= 0) {
                          e.attackCooldown = 3.0; // Fireball frequency
                          createFireball(game, e.pos, pPos);
                      } else {
                          e.attackCooldown -= dt;
                      }
                  } else {
                      // Sleep / patrol idle on tower
                      e.attackCooldown = 2.0; 
                  }
              } else if (e.type === 'dino_minion') {
                  if (dist < 40) {
                      e.mesh.rotation.y = Math.atan2(pPos.x - e.pos.x, pPos.z - e.pos.z);
                      if (dist > 2.5) {
                          const dir = pPos.clone().sub(e.pos).normalize();
                          e.pos.x += dir.x * 2.5 * dt; 
                          e.pos.z += dir.z * 2.5 * dt;
                      } else {
                          if (e.attackCooldown <= 0) {
                              e.attackCooldown = 1.2;
                              if (game.damagePlayer) {
                                  game.damagePlayer(3); // -3 can gitsin
                              }
                          }
                      }
                      if (e.attackCooldown > 0) e.attackCooldown -= dt;
                  }
              }
              
              // Only override X and Z, let Y be set by whatever
              e.mesh.position.x = e.pos.x;
              e.mesh.position.z = e.pos.z;
          });

          // Handle Fireballs
          if (game.currentLevel.fireballs) {
              for (let i = game.currentLevel.fireballs.length - 1; i >= 0; i--) {
                  const fb = game.currentLevel.fireballs[i];
                  fb.mesh.position.add(fb.dir.clone().multiplyScalar(fb.speed));
                  fb.life += dt;
                  
                  if (fb.mesh.position.distanceTo(pPos) < 2.5) {
                      if (game.damagePlayer) game.damagePlayer(25); // alev topu boss damage
                      game.scene.remove(fb.mesh);
                      game.currentLevel.fireballs.splice(i, 1);
                      continue;
                  }
                  
                  if (fb.life > 5.0) {
                      game.scene.remove(fb.mesh);
                      game.currentLevel.fireballs.splice(i, 1);
                  }
              }
          }
      }
  }

  if (game && game.scene) {
    if (game.playerPos && game.playerPos.y < 0.1 && (!game.currentRegion || game.currentRegion === 'hub')) {
      if (game.playerVel && game.playerVel.y < 0) game.playerVel.y = 0;
    }
    if (!alienCompanionGroup) {
      alienCompanionGroup = createAlienMesh();
      game.scene.add(alienCompanionGroup);
    }
    if (game.playerPos && alienCompanionGroup && spaceState.companionActive) {
      const pPos = game.playerPos;
      const petPos = alienCompanionGroup.position;
      if (!petState.targetPos) {
        petState.targetPos = pPos.clone();
      }
      const distToPlayer = petPos.distanceTo(pPos);
      if (distToPlayer > 14) {
        const catchUpPos = pPos.clone();
        catchUpPos.x += (Math.random() - 0.5) * 4;
        catchUpPos.y += 1.0;
        catchUpPos.z += (Math.random() - 0.5) * 4;
        petPos.lerp(catchUpPos, 0.08);
        petState.wanderTimer = 0;
      } else {
        petState.wanderTimer += 1;
        if (petState.wanderTimer > 200 || petPos.distanceTo(petState.targetPos) < 1.0) {
          petState.wanderTimer = 0;
          const angle = Math.random() * Math.PI * 2;
          const radius = 3.5 + Math.random() * 4.0;
          const tx = pPos.x + Math.cos(angle) * radius;
          const ty = pPos.y + 0.8 + Math.sin(Date.now() * 0.003) * 0.4;
          const tz = pPos.z + Math.sin(angle) * radius;
          petState.targetPos.set(tx, ty, tz);
        }
        petPos.lerp(petState.targetPos, 0.035);
      }
      petPos.y += Math.sin(Date.now() * 0.005) * 0.012;
      alienCompanionGroup.rotation.y += 0.02;
    }
    for (let i = lasers.length - 1; i >= 0; i--) {
      const l = lasers[i];
      l.life += 1;
      l.mesh.position.x += l.dirX * 1.8;
      l.mesh.position.z += l.dirZ * 1.8;
      if (l.life > 40) {
        game.scene.remove(l.mesh);
        lasers.splice(i, 1);
      }
    }
    const cat = game.scene.getObjectByName('merchant_cat');
    if (cat) {
      const tail = cat.getObjectByName('cat_tail');
      if (tail) {
        tail.rotation.z = Math.sin(Date.now() * 0.005) * 0.25;
      }
      const orb = cat.getObjectByName('cat_shop_icon');
      if (orb) {
        orb.rotation.y += 0.03;
        orb.position.y = 5.8 + Math.sin(Date.now() * 0.004) * 0.2;
      }
      if (game.playerPos) {
        const dist = game.playerPos.distanceTo(cat.position);
        if (dist < 9) {
          window.dispatchEvent(new CustomEvent('superbear:cat-merchant-proximity', { detail: { isNear: true, dist } }));
          if (game.callbacks && game.callbacks.onShowNotice && Date.now() % 4000 < 50) {
            game.callbacks.onShowNotice("🐱 Bakkal Kedi Capitoolos: 'Miyav! Şapkalar, iksirler ve uzaylılar burada! Dükkanı açmak için [E] tuşuna bas!'");
          }
        } else {
          window.dispatchEvent(new CustomEvent('superbear:cat-merchant-proximity', { detail: { isNear: false } }));
        }
      }
    }
    const pelikan = game.scene.getObjectByName('npc_pelican_piko');
    if (pelikan) {
      const leftWing = pelikan.getObjectByName('boss_left_wing');
      const rightWing = pelikan.getObjectByName('boss_right_wing');
      if (leftWing) leftWing.rotation.z = 0.3 + Math.sin(Date.now() * 0.004) * 0.18;
      if (rightWing) rightWing.rotation.z = -0.3 - Math.sin(Date.now() * 0.004) * 0.18;
      const headGroup = pelikan.getObjectByName('pelican_head_group');
      if (headGroup) headGroup.position.y = 3.6 + Math.sin(Date.now() * 0.005) * 0.08;
      const badge = pelikan.getObjectByName('pelican_floating_badge');
      if (badge) {
        badge.rotation.y += 0.03;
        badge.position.y = 5.2 + Math.sin(Date.now() * 0.005) * 0.15;
      }
      if (game.playerPos) {
        const dist = game.playerPos.distanceTo(pelikan.position);
        if (dist < 8) {
          if (game.callbacks && game.callbacks.onShowNotice && Date.now() % 4000 < 50) {
            game.callbacks.onShowNotice("🪶 Tatlış Pelikan Piko: 'Gak gak! Ben Ayı Köyü'nün en sevimli pelikanıyım! Pelikan Ovaları'nda gök adalarına uçabilirsin!'");
          }
        }
      }
    }
    if (game.playerPos && spaceState.currentRegion === 'hub') {
        const barrier = game.scene.getObjectByName('space_travel_barrier');
        if (barrier) {
            const dist = game.playerPos.distanceTo(barrier.position);
            if (dist < 15) {
                if (spaceState.aliensRescued >= 30) {
                    teleportToSpace();
                } else {
                    if (game.callbacks && game.callbacks.onShowNotice && Date.now() % 2000 < 50) {
                        game.callbacks.onShowNotice(\`🔒 Uzaya gitmek için 30 uzaylı topla! (Şu an: \${spaceState.aliensRescued}/30)\`);
                    }
                }
            }
        }
    }
  }

  requestAnimationFrame(updateSpaceLoop);
}
\n`;

cleanCode += code.substring(enhanceStart);

fs.writeFileSync('public/game-enhancer.js', cleanCode);
console.log('Fixed duplicated updateSpaceLoop and improved boss + stairs logic.');
