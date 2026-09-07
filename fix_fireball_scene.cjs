const fs = require('fs');
let code = fs.readFileSync('public/game-enhancer.js', 'utf8');

code = code.replace(
    /game\.scene\.add\(fireball\);/g,
    'if (game.currentLevel && game.currentLevel.mesh) { game.currentLevel.mesh.add(fireball); } else { game.scene.add(fireball); }'
);

// We should also ensure that when the region changes, we clear any fireballs
// Since they are added to mesh now, they will clear when the region's sceneGroup is removed!
// But wait, in updateSpaceLoop, the fireballs are updated and removed from game.scene:
code = code.replace(
    /game\.scene\.remove\(fb\.mesh\);/g,
    'if (fb.mesh.parent) fb.mesh.parent.remove(fb.mesh); else game.scene.remove(fb.mesh);'
);

fs.writeFileSync('public/game-enhancer.js', code);
console.log('Fixed fireball parent');
