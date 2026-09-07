const fs = require('fs');
let code = fs.readFileSync('public/game-enhancer.js', 'utf8');

code = code.replace(
    'const bossPos = new THREE.Vector3(0, 50, -95);',
    'const bossPos = new THREE.Vector3(0, 49, -95);'
);

fs.writeFileSync('public/game-enhancer.js', code);
console.log('Boss Y adjusted.');
