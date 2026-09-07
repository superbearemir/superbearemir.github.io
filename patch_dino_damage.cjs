const fs = require('fs');
let code = fs.readFileSync('public/game-enhancer.js', 'utf8');

const hookStr = `function enhanceGame() {
  const game = window.__superBearGame;
  if (!game || !game.scene || !window.THREE) {
    setTimeout(enhanceGame, 500);
    return;
  }`;

const newHookStr = `function enhanceGame() {
  const game = window.__superBearGame;
  if (!game || !game.scene || !window.THREE) {
    setTimeout(enhanceGame, 500);
    return;
  }

  // Hook damageEnemy to enforce exact 15 damage for minion dinos
  if (game.damageEnemy && !game._damageEnemyHooked) {
      game._damageEnemyHooked = true;
      const originalDamageEnemy = game.damageEnemy.bind(game);
      game.damageEnemy = function(enemy, damage) {
          if (enemy && enemy.type === 'dino_minion') {
              damage = 15;
          }
          originalDamageEnemy(enemy, damage);
      };
  }`;

code = code.replace(hookStr, newHookStr);

fs.writeFileSync('public/game-enhancer.js', code);
console.log('Damage hooked.');
