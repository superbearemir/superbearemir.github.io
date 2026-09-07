const fs = require('fs');
let code = fs.readFileSync('public/game-enhancer.js', 'utf8');

// We are replacing populateDinosaurWorld function
const startIndex = code.indexOf('function populateDinosaurWorld');
const endIndex = code.indexOf('}', code.indexOf('function updateSpaceLoop')) + 1;
