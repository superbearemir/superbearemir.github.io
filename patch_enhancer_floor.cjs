const fs = require('fs');
let code = fs.readFileSync('public/game-enhancer.js', 'utf8');

const targetStr = `  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.set(0, -1, 0);
  game.currentLevel.mesh.add(floor);`;

const newStr = `  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.set(0, -1, 0);
  game.currentLevel.mesh.add(floor);
  if (game.currentLevel.colliders) {
      game.currentLevel.colliders.push({
          min: new THREE.Vector3(-100, -2, -100),
          max: new THREE.Vector3(100, 0, 100)
      });
  }`;

code = code.replace(targetStr, newStr);

fs.writeFileSync('public/game-enhancer.js', code);
console.log('Floor added to colliders');
