const fs = require('fs');

console.log('=== Applying Precise Hub Easel Lowering & Ground Anchoring Patch ===');

// ============================================================================
// PATCH public/game-bundle.js (Lower Hub Art Easels to Ground Y = 0.05)
// ============================================================================
{
  const filePath = 'public/game-bundle.js';
  let content = fs.readFileSync(filePath, 'utf8');

  // Let's check how Hub Easels are created or if we can patch loadRegion("hub") or alignAllObjectsToGround
  // In loadRegion("hub") or populate Hub, we can explicitly force all art Easels to ground level (Y = 0.02)
  const targetHubEaselsLoad = 'alignAllObjectsToGround(this);';
  const replaceHubEaselsLoad = `alignAllObjectsToGround(this);
      // 🔥 CRITICAL FIX: Explicitly drop all art easels and drawing boards to ground level (Y = 0.02) in Hub
      if (this.scene) {
        this.scene.traverse(obj => {
          if (obj && obj.userData && obj.userData.isArtEasel) {
            obj.position.y = 0.02;
          }
          if (obj && obj.name && (obj.name.includes('easel') || obj.name.includes('drawing'))) {
            obj.position.y = 0.02;
          }
        });
      }`;

  if (content.includes(targetHubEaselsLoad)) {
    content = content.replace(targetHubEaselsLoad, replaceHubEaselsLoad);
    console.log('✓ Successfully added hub easel lowering hook in game-bundle.js');
  } else {
    console.warn('⚠️ targetHubEaselsLoad not found in game-bundle.js');
  }

  // Also patch the jw function in game-bundle.js if possible or add a scene traversal in updateHub / loadRegion
  const targetLoadHubRegion = 'else if (r === "hub") {';
  const replaceLoadHubRegion = 'else if (r === "hub") { setTimeout(() => { if (window.__superBearGame && window.__superBearGame.scene) { window.__superBearGame.scene.traverse(o => { if (o && o.userData && o.userData.isArtEasel) o.position.y = 0.02; }); } }, 50);';

  if (content.includes(targetLoadHubRegion)) {
    content = content.replace(targetLoadHubRegion, replaceLoadHubRegion);
    console.log('✓ Added hub region easel ground snap timeout');
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

// ============================================================================
// PATCH public/game-enhancer.js (Force Easels to Ground in alignAllObjectsToGround)
// ============================================================================
{
  const enhancerPath = 'public/game-enhancer.js';
  let content = fs.readFileSync(enhancerPath, 'utf8');

  const targetEnhancerEasels = `    // 4. Art Easels & Display Paintings`;
  const replaceEnhancerEasels = `    // 4. Art Easels & Display Paintings (Forced Ground Snap Y = 0.02)
    if (game.scene) {
      game.scene.traverse(obj => {
        if (obj && (obj.userData && obj.userData.isArtEasel || (obj.name && obj.name.includes('easel')))) {
          obj.position.y = 0.02;
          obj._groundAligned = true;
        }
      });
    }
    if (level.artEasels) {
      level.artEasels.forEach(e => {
        if (!e || !e.mesh) return;
        e.mesh.position.y = 0.02;
        if (e.pos) e.pos.y = 0.02;
        e.mesh._groundAligned = true;
      });
    }`;

  if (content.includes(targetEnhancerEasels)) {
    content = content.replace(targetEnhancerEasels, replaceEnhancerEasels);
    console.log('✓ Patched game-enhancer.js art easels ground snap');
  }

  fs.writeFileSync(enhancerPath, content, 'utf8');
}

console.log('=== Easel Lowering Patch Completed Successfully ===');
