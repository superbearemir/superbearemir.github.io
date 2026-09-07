const fs = require('fs');

let bundle = fs.readFileSync('public/game-bundle.js', 'utf8');

const boundsPatch = `  else if (r === "space_realm") bounds = { minX: -65, maxX: 65, minZ: -230, maxZ: 50, minY: -30, maxY: 100 };  else if (r === "dinosaur_world") bounds = { minX: -100, maxX: 100, minZ: -100, maxZ: 100, minY: -5, maxY: 100 };`;
bundle = bundle.replace(`  else if (r === "space_realm") bounds = { minX: -65, maxX: 65, minZ: -230, maxZ: 50, minY: -30, maxY: 100 };`, boundsPatch);

fs.writeFileSync('public/game-bundle.js', bundle);
console.log('game-bundle.js patched bounds');
