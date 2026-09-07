const fs = require('fs');
let code = fs.readFileSync('public/game-enhancer.js', 'utf8');

code = code.replace(
    'const cpPos = new THREE.Vector3(0, 50, -68);',
    'const cpPos = new THREE.Vector3(0, 49.5, -68);'
);

fs.writeFileSync('public/game-enhancer.js', code);
console.log('Checkpoint adjusted.');
