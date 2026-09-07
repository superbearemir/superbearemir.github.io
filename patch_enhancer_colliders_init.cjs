const fs = require('fs');
let code = fs.readFileSync('public/game-enhancer.js', 'utf8');

const targetStr = `if (!game.currentLevel.bounds) game.currentLevel.bounds = { minX: -100, maxX: 100, minZ: -100, maxZ: 100, minY: -5, maxY: 100 };`;

const newStr = `if (!game.currentLevel.bounds) game.currentLevel.bounds = { minX: -100, maxX: 100, minZ: -100, maxZ: 100, minY: -5, maxY: 100 };
if (!game.currentLevel.colliders) game.currentLevel.colliders = [];`;

code = code.replace(targetStr, newStr);

fs.writeFileSync('public/game-enhancer.js', code);
console.log('Colliders initialized');
