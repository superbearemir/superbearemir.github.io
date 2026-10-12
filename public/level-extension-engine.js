// Level Extension Engine - Removed completely per user request
(function() {
  'use strict';

  function cleanupAllLevelExtensions(game) {
    // 1. Remove DOM HUD and Speech Bubbles
    const hud = document.getElementById('caged-rescue-hud');
    if (hud) hud.remove();
    const bubble = document.getElementById('cat-speech-bubble-ext');
    if (bubble) bubble.remove();

    // 2. Remove Three.js objects
    const targetGame = game || window.__superBearGame;
    if (targetGame && targetGame.scene) {
      const extGroup = targetGame.scene.getObjectByName('ultra_level_extension_group');
      if (extGroup && extGroup.parent) {
        extGroup.parent.remove(extGroup);
      }
      const barrier = targetGame.scene.getObjectByName('boss_arena_locked_barrier');
      if (barrier && barrier.parent) {
        barrier.parent.remove(barrier);
      }
      if (targetGame.currentLevel && targetGame.currentLevel.colliders) {
        targetGame.currentLevel.colliders = targetGame.currentLevel.colliders.filter(function(c) {
          return !c.isExtensionCollider;
        });
      }
    }
  }

  window.__removeLevelExtension = cleanupAllLevelExtensions;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      cleanupAllLevelExtensions();
    });
  } else {
    cleanupAllLevelExtensions();
  }
})();
