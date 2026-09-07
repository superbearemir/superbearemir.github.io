const fs = require('fs');
let code = fs.readFileSync('public/game-enhancer.js', 'utf8');

const dinoCode = `
let dinoWorldPopulated = false;

function createDinoMesh(THREE, isBoss = false) {
  const dinoGroup = new THREE.Group();
  dinoGroup.name = isBoss ? 'dev_trex_boss' : 'mini_dino';
  
  // Materials
  const skinGreen = new THREE.MeshStandardMaterial({ color: isBoss ? 0xef4444 : 0x22c55e, roughness: 0.7 });
  const bellyYellow = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.8 });
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 });
  
  // Body
  const bodyGeo = new THREE.BoxGeometry(1.2, 1.8, 1.5);
  const body = new THREE.Mesh(bodyGeo, skinGreen);
  body.position.y = 1;
  dinoGroup.add(body);
  
  // Head
  const headGeo = new THREE.BoxGeometry(1.4, 1.4, 1.8);
  const head = new THREE.Mesh(headGeo, skinGreen);
  head.position.set(0, 2.2, 0.5);
  dinoGroup.add(head);
  
  // Jaw
  const jawGeo = new THREE.BoxGeometry(1.2, 0.4, 1.6);
  const jaw = new THREE.Mesh(jawGeo, bellyYellow);
  jaw.position.set(0, 1.6, 0.6);
  dinoGroup.add(jaw);
  
  // Eyes
  const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), eyeMat);
  eyeL.position.set(-0.75, 2.4, 0.8);
  dinoGroup.add(eyeL);
  
  const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), eyeMat);
  eyeR.position.set(0.75, 2.4, 0.8);
  dinoGroup.add(eyeR);
  
  // Tail
  const tailGeo = new THREE.BoxGeometry(0.8, 0.6, 1.8);
  const tail = new THREE.Mesh(tailGeo, skinGreen);
  tail.position.set(0, 0.6, -1.2);
  tail.rotation.x = -0.3;
  dinoGroup.add(tail);
  
  // Legs
  const legGeo = new THREE.BoxGeometry(0.6, 1.0, 0.8);
  const legL = new THREE.Mesh(legGeo, skinGreen);
  legL.position.set(-0.5, 0.5, 0);
  dinoGroup.add(legL);
  
  const legR = new THREE.Mesh(legGeo, skinGreen);
  legR.position.set(0.5, 0.5, 0);
  dinoGroup.add(legR);
  
  // Tiny Arms
  const armGeo = new THREE.BoxGeometry(0.3, 0.6, 0.3);
  const armL = new THREE.Mesh(armGeo, skinGreen);
  armL.position.set(-0.7, 1.4, 0.6);
  armL.rotation.x = 0.5;
  dinoGroup.add(armL);
  
  const armR = new THREE.Mesh(armGeo, skinGreen);
  armR.position.set(0.7, 1.4, 0.6);
  armR.rotation.x = 0.5;
  dinoGroup.add(armR);

  if (isBoss) {
      dinoGroup.scale.set(4, 4, 4);
  }

  return dinoGroup;
}

function populateDinosaurWorld(game) {
  const THREE = window.THREE;
  if (!game.currentLevel) game.currentLevel = {};
  if (!game.currentLevel.mesh) {
      game.currentLevel.mesh = new THREE.Group();
      game.scene.add(game.currentLevel.mesh);
  }
  
  if (!game.currentLevel.enemies) game.currentLevel.enemies = [];
  if (!game.currentLevel.bounds) game.currentLevel.bounds = { minX: -100, maxX: 100, minZ: -100, maxZ: 100, minY: -5, maxY: 100 };
  
  // Lighting & Environment
  game.scene.background = new THREE.Color(0xfde047);
  game.scene.fog = new THREE.Fog(0xfde047, 20, 100);

  // Big prehistoric floor
  const floorGeo = new THREE.BoxGeometry(200, 2, 200);
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x4d7c0f, roughness: 1.0 });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.set(0, -1, 0);
  game.currentLevel.mesh.add(floor);
  
  // Add some parkour platforms
  const platMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
  for(let i=0; i<15; i++) {
      const plat = new THREE.Mesh(new THREE.BoxGeometry(6, 1, 6), platMat);
      plat.position.set((Math.random()-0.5)*80, Math.random()*15 + 2, (Math.random()-0.5)*80);
      game.currentLevel.mesh.add(plat);
      
      // Check if bounds array exists
      if (game.currentLevel.boundsArray) {
          game.currentLevel.boundsArray.push({
              min: new THREE.Vector3(plat.position.x - 3, plat.position.y - 0.5, plat.position.z - 3),
              max: new THREE.Vector3(plat.position.x + 3, plat.position.y + 0.5, plat.position.z + 3)
          });
      }
  }

  // Mini Dinosaurs
  for(let i=0; i<10; i++) {
      const miniDino = createDinoMesh(THREE, false);
      const pos = new THREE.Vector3((Math.random()-0.5)*100, 0.5, (Math.random()-0.5)*100);
      miniDino.position.copy(pos);
      game.currentLevel.mesh.add(miniDino);
      
      game.currentLevel.enemies.push({
          id: \`mini_dino_\${i}\`,
          type: 'dino_minion',
          name: 'Küçük Dinozor',
          mesh: miniDino,
          pos: pos,
          velocity: new THREE.Vector3(),
          hp: 80,
          maxHp: 80,
          attackPower: 15,
          isBoss: false,
          attackCooldown: 0,
          state: 'chase',
          animTimer: Math.random() * 10
      });
  }

  // Dev T-Rex Boss
  const trexBoss = createDinoMesh(THREE, true);
  const bossPos = new THREE.Vector3(0, 2, -60);
  trexBoss.position.copy(bossPos);
  game.currentLevel.mesh.add(trexBoss);
  
  game.currentLevel.enemies.push({
      id: 'boss_trex',
      type: 'dino_trex_boss',
      name: 'Dev T-Rex Boss',
      mesh: trexBoss,
      pos: bossPos,
      velocity: new THREE.Vector3(),
      hp: 1200,
      maxHp: 1200,
      attackPower: 45,
      isBoss: true,
      attackCooldown: 0,
      state: 'chase',
      animTimer: 0
  });
  
  // Custom defeat logic hook via overriding or listening to defeat...
  // Wait, the original game bundle sends a notice via game.callbacks.onShowNotice.
  // We can just poll for boss death in updateSpaceLoop.
}
`;

// Insert the code before updateSpaceLoop
code = code.replace('function updateSpaceLoop() {', dinoCode + '\nfunction updateSpaceLoop() {');

// Inject the check into updateSpaceLoop
const hookCode = `
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
    }
`;

code = code.replace('function updateSpaceLoop() {', 'function updateSpaceLoop() {\n' + hookCode);

fs.writeFileSync('public/game-enhancer.js', code);
console.log('Patched game-enhancer.js');
