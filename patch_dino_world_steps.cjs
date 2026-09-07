const fs = require('fs');
let code = fs.readFileSync('public/game-enhancer.js', 'utf8');

code = code.replace(
    'step.position.set(Math.sin(i * 0.4) * 18, i * 2, 40 - i * 4);',
    'step.position.set(Math.sin(i * 0.4) * 18, i * 2, 40 - i * 4.2);'
);

fs.writeFileSync('public/game-enhancer.js', code);
console.log('Steps adjusted.');
