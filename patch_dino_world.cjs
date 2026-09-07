const fs = require('fs');
let code = fs.readFileSync('public/game-enhancer.js', 'utf8');

const populateStart = code.indexOf('function populateDinosaurWorld(game) {');
const populateEnd = code.indexOf('}', code.indexOf('function updateSpaceLoop() {')) + 1;

let newCode = code.substring(0, populateStart) + `
function createFireball(game, pos, targetPos) {
    const THREE = window.THREE;
    const fireballGeo = new THREE.SphereGeometry(1.5, 8, 8);
    const fireballMat = new THREE.MeshBasicMaterial({ color: 0xff3300 });
    const fireball = new THREE.Mesh(fireballGeo, fireballMat);
    fireball.position.copy(pos);
    fireball.position.y += 2.5;
    game.scene.add(fireball);

    const dir = targetPos.clone().sub(fireball.position).normalize();
    
    if (!game.currentLevel.fireballs) game.currentLevel.fireballs = [];
    game.currentLevel.fireballs.push({
        mesh: fireball,
        dir: dir,
        life: 0,
        speed: 0.6 // increased speed
    });
}

function createCheckpointVisual(THREE, pos) {
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

    // Giant Boss Tower
    const towerGeo = new THREE.CylinderGeometry(25, 30, 50, 16);
    const tower = new THREE.Mesh(towerGeo, platMat);
    tower.position.set(0, 24, -90);
    game.currentLevel.mesh.add(tower);
    
    game.currentLevel.colliders.push({
        min: new THREE.Vector3(-22, 0, -112),
        max: new THREE.Vector3(22, 49, -68)
    });

    // Checkpoint before Boss
    const cpPos = new THREE.Vector3(0, 50, -68);
    const cpVisual = createCheckpointVisual(THREE, cpPos);
    game.currentLevel.mesh.add(cpVisual);
    game.currentLevel.checkpoints.push({ pos: cpPos, active: false });

    // Spawn Point Checkpoint
    game.currentLevel.spawnPoint = new THREE.Vector3(0, 0.5, 60);

    // Obstacles and Steps (Mor Bal theme)
    for (let i = 0; i < 25; i++) {
        const step = new THREE.Mesh(new THREE.BoxGeometry(8, 1.5, 8), stepMat);
        step.position.set(Math.sin(i * 0.4) * 18, i * 2, 40 - i * 4);
        game.currentLevel.mesh.add(step);
        game.currentLevel.colliders.push({
            min: new THREE.Vector3(step.position.x - 4, step.position.y - 0.75, step.position.z - 4),
            max: new THREE.Vector3(step.position.x + 4, step.position.y + 0.75, step.position.z + 4)
        });

        // Add some random towers as obstacles
        if (i % 3 === 0) {
            const ob = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 10, 8), obstacleMat);
            ob.position.set(step.position.x + (Math.random() > 0.5 ? 5 : -5), step.position.y + 5, step.position.z);
            game.currentLevel.mesh.add(ob);
            game.currentLevel.colliders.push({
                min: new THREE.Vector3(ob.position.x - 2, ob.position.y - 5, ob.position.z - 2),
                max: new THREE.Vector3(ob.position.x + 2, ob.position.y + 5, ob.position.z + 2)
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
    const bossPos = new THREE.Vector3(0, 50, -95);
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
        attackPower: 15, // Fireball attack power is handled separately
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
                  if (dist < 100) { 
                      e.mesh.rotation.y = Math.atan2(pPos.x - e.pos.x, pPos.z - e.pos.z);
                      
                      if (dist > 8) {
                          const dir = pPos.clone().sub(e.pos).normalize();
                          e.pos.x += dir.x * 2.5 * dt;
                          e.pos.z += dir.z * 2.5 * dt;
                      }

                      if (e.attackCooldown <= 0) {
                          e.attackCooldown = 3.0; // Fireball frequency
                          createFireball(game, e.pos, pPos);
                      } else {
                          e.attackCooldown -= dt;
                      }
                  }
              } else if (e.type === 'dino_minion') {
                  if (dist < 50) {
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
              
              // Only override X and Z, let Y be set by whatever (it doesn't have gravity so it stays on platform)
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

` + code.substring(populateEnd);

fs.writeFileSync('public/game-enhancer.js', newCode);
console.log('Dino world logic updated.');
