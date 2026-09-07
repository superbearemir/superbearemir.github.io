const fs = require('fs');
let code = fs.readFileSync('public/game-enhancer.js', 'utf8');

// Find the first instance of function createFireball
const firstCreateFireball = code.indexOf('function createFireball');
// Find the second instance
const secondCreateFireball = code.indexOf('function createFireball', firstCreateFireball + 1);

// We need to cut out the first instance.
// It ends just before the second instance (or some whitespace before it).
if (firstCreateFireball !== -1 && secondCreateFireball !== -1) {
    code = code.substring(0, firstCreateFireball) + code.substring(secondCreateFireball);
    fs.writeFileSync('public/game-enhancer.js', code);
    console.log('Fixed duplicate createFireball');
} else {
    console.log('Could not find two instances of createFireball');
}
