const fs = require('fs');
let code = fs.readFileSync('public/game-enhancer.js', 'utf8');

code = code.replace(
    'if (!game.currentLevel.mesh) {\n        game.currentLevel.mesh = new THREE.Group();\n        game.scene.add(game.currentLevel.mesh);\n    }',
    'if (game.currentLevel.sceneGroup) {\n        game.currentLevel.mesh = game.currentLevel.sceneGroup;\n    } else if (!game.currentLevel.mesh) {\n        game.currentLevel.mesh = new THREE.Group();\n        game.scene.add(game.currentLevel.mesh);\n    }'
);

fs.writeFileSync('public/game-enhancer.js', code);
console.log('Fixed');
