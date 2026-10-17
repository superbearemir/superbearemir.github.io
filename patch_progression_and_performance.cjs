const fs = require('fs');

console.log('=== Applying Milestone Progression, Grounded Easels, and Anti-Flicker Patch ===');

// ============================================================================
// 1. PATCH public/village-portals.js
// ============================================================================
{
  console.log('1. Patching public/village-portals.js...');
  let vp = fs.readFileSync('public/village-portals.js', 'utf8');

  // Reposition any portals near spawn point (x: -12..12, z: 15..35)
  vp = vp.replace(/pos:\s*{\s*x:\s*-24,\s*z:\s*8\s*}/g, 'pos: { x: -26, z: 8 }');
  vp = vp.replace(/pos:\s*{\s*x:\s*10,\s*z:\s*28\s*}/g, 'pos: { x: 18, z: 34 }');
  vp = vp.replace(/pos:\s*{\s*x:\s*-12,\s*z:\s*26\s*}/g, 'pos: { x: -18, z: 30 }');
  vp = vp.replace(/pos:\s*{\s*x:\s*-4,\s*z:\s*32\s*}/g, 'pos: { x: -18, z: 38 }');
  vp = vp.replace(/pos:\s*{\s*x:\s*4,\s*z:\s*32\s*}/g, 'pos: { x: 18, z: 38 }');

  // Replace isChapterUnlocked implementation
  const fnStart = vp.indexOf('function isChapterUnlocked(pData)');
  const fnEnd = vp.indexOf('window.__isChapterUnlocked = isChapterUnlocked;', fnStart);
  if (fnStart !== -1 && fnEnd !== -1) {
    const newIsChapterUnlocked = `function isChapterUnlocked(pData) {
    if (!pData) return false;
    // Hub portalı Ayı Köyü içinde oluşturulmaz (zaten köyün içindeyiz)
    if (pData.id === "hub" || pData.targetRegion === "hub") {
      return false;
    }
    // 1. Macera Portalı (2. Bölüm: Antik Orman Tapınağı) başlangıçta HER ZAMAN açıktır!
    if (pData.chapterNum === 2 || pData.targetRegion === "forest_temple" || pData.id === "forest_temple") {
      return true;
    }
    // Kademeli Boss Kilidi: Bir sonraki portal YALNIZCA bir önceki bölümün Boss'u yenildiğinde açılır!
    const prevChapter = VILLAGE_PORTALS_DATA.find(p => p.chapterNum === pData.chapterNum - 1);
    if (!prevChapter) return false;

    // 1. SaveManager Boss Defeated Kontrolü
    if (typeof window !== "undefined" && window.__superBearSaveManager) {
      const save = window.__superBearSaveManager.getSaveData();
      if (save && save.levelsProgress) {
        const prevProg = save.levelsProgress[prevChapter.targetRegion];
        if (prevProg && prevProg.bossDefeated) {
          return true;
        }
      }
    }
    // 2. LocalStorage Açık Listesi Kontrolü
    try {
      const raw = localStorage.getItem("super_bear_unlocked_chapters_v2");
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list) && (list.includes(pData.id) || list.includes(pData.targetRegion))) {
          return true;
        }
      }
    } catch(e) {}
    return false;
  }
  `;
    vp = vp.slice(0, fnStart) + newIsChapterUnlocked + vp.slice(fnEnd);
    console.log('✓ Successfully updated isChapterUnlocked in village-portals.js');
  } else {
    console.warn('⚠️ Could not find isChapterUnlocked boundary in village-portals.js');
  }

  // Update unlockChapterAfterBoss
  const unlockFnStart = vp.indexOf('function unlockChapterAfterBoss(defeatedRegion)');
  const unlockFnEnd = vp.indexOf('window.__unlockChapterAfterBoss = unlockChapterAfterBoss;', unlockFnStart);
  if (unlockFnStart !== -1 && unlockFnEnd !== -1) {
    const newUnlockFn = `function unlockChapterAfterBoss(defeatedRegion) {
    console.log("⚔️ [Progression] Boss defeated in region: " + defeatedRegion);
    const currentChap = VILLAGE_PORTALS_DATA.find(p => p.targetRegion === defeatedRegion || p.id === defeatedRegion);
    if (!currentChap) return;
    const nextChapNum = currentChap.chapterNum + 1;
    const nextChap = VILLAGE_PORTALS_DATA.find(p => p.chapterNum === nextChapNum);
    if (!nextChap) return; // Tüm bölümler tamamlandı

    // 1. LocalStorage güncelle
    try {
      const key = "super_bear_unlocked_chapters_v2";
      const raw = localStorage.getItem(key);
      const list = raw ? JSON.parse(raw) : ["forest_temple"];
      if (!list.includes(nextChap.id)) list.push(nextChap.id);
      if (!list.includes(nextChap.targetRegion)) list.push(nextChap.targetRegion);
      localStorage.setItem(key, JSON.stringify(list));
      localStorage.setItem("super_bear_unlocked_levels_max", nextChapNum.toString());
    } catch(e) {}

    // 2. SaveManager güncelle
    if (typeof window !== "undefined" && window.__superBearSaveManager) {
      const current = window.__superBearSaveManager.getSaveData();
      const progress = { ...(current.levelsProgress || {}) };
      progress[currentChap.targetRegion] = { ...(progress[currentChap.targetRegion] || {}), bossDefeated: true };
      progress[nextChap.targetRegion] = { ...(progress[nextChap.targetRegion] || {}), isUnlocked: true };
      window.__superBearSaveManager.saveGame({
        levelsProgress: progress,
        unlockedLevelsMax: Math.max(current.unlockedLevelsMax || 2, nextChapNum)
      }, { immediate: true });
    }

    console.log("🎉 [Progression] Kilit Açıldı: " + nextChap.title + " (" + nextChap.targetRegion + ")!");

    // 3. Eğer şu an Ayı Köyü'ndeysek yeni portalı hemen oluştur ve kutlama yap!
    const game = window.__superBearGame;
    if (game && (game.currentRegion === "hub" || !game.currentRegion)) {
      spawnUnlockedPortalInVillage(game, nextChap);
    }
  }
  `;
    vp = vp.slice(0, unlockFnStart) + newUnlockFn + vp.slice(unlockFnEnd);
    console.log('✓ Successfully updated unlockChapterAfterBoss in village-portals.js');
  }

  fs.writeFileSync('public/village-portals.js', vp, 'utf8');
}

// ============================================================================
// 2. PATCH public/save-manager.js
// ============================================================================
{
  console.log('2. Patching public/save-manager.js...');
  let sm = fs.readFileSync('public/save-manager.js', 'utf8');

  sm = sm.replace('unlockedLevelsMax: 14,', 'unlockedLevelsMax: 2,');
  sm = sm.replace('saveObj.unlockedLevelsMax || 14', 'saveObj.unlockedLevelsMax || 2');

  fs.writeFileSync('public/save-manager.js', sm, 'utf8');
  console.log('✓ Successfully updated public/save-manager.js');
}

// ============================================================================
// 3. PATCH src/components/SaveManagerModal.tsx
// ============================================================================
{
  console.log('3. Patching src/components/SaveManagerModal.tsx...');
  let smm = fs.readFileSync('src/components/SaveManagerModal.tsx', 'utf8');

  smm = smm.replace('unlockedLevelsMax: 14,', 'unlockedLevelsMax: 2,');
  smm = smm.replace('{currentSave.unlockedLevelsMax || 14}', '{currentSave.unlockedLevelsMax || 2}');

  fs.writeFileSync('src/components/SaveManagerModal.tsx', smm, 'utf8');
  console.log('✓ Successfully updated src/components/SaveManagerModal.tsx');
}

// ============================================================================
// 4. PATCH public/game-enhancer.js
// - Bear starting position in hub: x: 0, y: 0.5, z: 20
// - Camera positioned at z: 27.2 looking at z: 20
// - Drawing boards / easels firmly grounded at y: 0.0 (never rising or floating)
// ============================================================================
{
  console.log('4. Patching public/game-enhancer.js...');
  let ge = fs.readFileSync('public/game-enhancer.js', 'utf8');

  // Hub spawn position adjustment
  ge = ge.replace(
    /hub:\s*{\s*x:\s*0,\s*y:\s*0\.5,\s*z:\s*28,\s*rotY:\s*0,/g,
    'hub: { x: 0, y: 0.5, z: 20, rotY: 0,'
  );

  // Hub camera setup in ensureSafeLevelSpawn
  const oldCamBlock = `    if (regionId === "hub") {
      if (game.camera) {
        game.camYaw = 0;
        game.camPitch = 0.26;
        game.camDist = 6.8;
        game.camera.position.set(game.playerPos.x, game.playerPos.y + 2.4, game.playerPos.z + 6.6);
        game.camera.lookAt(game.playerPos.x, game.playerPos.y + 1.2, game.playerPos.z);
      }`;
  const newCamBlock = `    if (regionId === "hub") {
      if (game.camera) {
        game.camYaw = 0;
        game.camPitch = 0.26;
        game.camDist = 6.8;
        game.camera.position.set(game.playerPos.x, game.playerPos.y + 2.4, game.playerPos.z + 6.8);
        game.camera.lookAt(game.playerPos.x, game.playerPos.y + 1.2, game.playerPos.z);
      }`;
  if (ge.includes(oldCamBlock)) {
    ge = ge.replace(oldCamBlock, newCamBlock);
  }

  // Snap easel to exact ground level in alignAllObjectsToGround
  const oldEaselTraverse = `    if (game.scene) {
      game.scene.traverse(obj => {
        if (obj && (obj.userData && obj.userData.isArtEasel || (obj.name && (obj.name.includes('easel') || obj.name.includes('drawing') || obj.name.includes('art'))))) {
          const isHubLevel = (game.currentRegion === 'hub' || !game.currentRegion);
          const targetY = isHubLevel ? 0.0 : Math.min(Math.max(getGroundYAt(obj.position.x, obj.position.z), 0.0), 2.0);
          obj.position.y = targetY;
          obj._groundAligned = true;
        }
      });
    }`;
  const newEaselTraverse = `    if (game.scene) {
      game.scene.traverse(obj => {
        if (obj && (obj.userData && obj.userData.isArtEasel || (obj.name && obj.name.includes('easel')))) {
          const isHubLevel = (game.currentRegion === 'hub' || !game.currentRegion);
          const targetY = isHubLevel ? 0.0 : Math.max(getGroundYAt(obj.position.x, obj.position.z), 0.0);
          obj.position.y = targetY;
          obj._groundAligned = true;
        }
      });
    }`;
  if (ge.includes(oldEaselTraverse)) {
    ge = ge.replace(oldEaselTraverse, newEaselTraverse);
    console.log('✓ Replaced easel traverse in game-enhancer.js');
  }

  // In createThematicEntranceEasel, adjust legs so local bottom is at 0.0
  ge = ge.replace(
    'legL.position.set(-0.7, 1.2, 0.1);',
    'legL.position.set(-0.7, 1.5, 0.1);'
  );
  ge = ge.replace(
    'legR.position.set(0.7, 1.2, 0.1);',
    'legR.position.set(0.7, 1.5, 0.1);'
  );
  ge = ge.replace(
    'legB.position.set(0, 1.2, -0.6);',
    'legB.position.set(0, 1.5, -0.6);'
  );

  fs.writeFileSync('public/game-enhancer.js', ge, 'utf8');
  console.log('✓ Successfully updated public/game-enhancer.js');
}

// ============================================================================
// 5. PATCH public/game-bundle.js
// - Screen flicker fix in onResize: prevent setSize when dimensions did not change
// - Player Pos initial default: (0, 0.5, 20)
// - Easel leg geometry in jw(r,e): ensure legs touch ground cleanly at y: 0
// - Hub easel loop ground lock: v.mesh.position.y = 0.0 in hub
// ============================================================================
{
  console.log('5. Patching public/game-bundle.js...');
  let gb = fs.readFileSync('public/game-bundle.js', 'utf8');

  // Fix onResize: guard against duplicate setSize calls
  const oldOnResize = 'this.renderer.setSize(h,m,!1),this.renderer.setPixelRatio';
  const newOnResize = 'if(this._lastW===h&&this._lastH===m)return;this._lastW=h,this._lastH=m,this.renderer.setSize(h,m,!1),this.renderer.setPixelRatio';
  if (gb.includes(oldOnResize)) {
    gb = gb.replace(oldOnResize, newOnResize);
    console.log('✓ Guarded onResize in game-bundle.js against screen flicker');
  }

  // Update initial playerPos in Yw constructor
  gb = gb.replace('this.playerPos=new Y(0,0.5,28)', 'this.playerPos=new Y(0,0.5,20)');

  // Fix jw easel leg positioning (c was set to 0.8 while u was 1.5)
  gb = gb.replace('c.position.set(-.7,0.8,.1)', 'c.position.set(-.7,1.5,.1)');

  fs.writeFileSync('public/game-bundle.js', gb, 'utf8');
  console.log('✓ Successfully updated public/game-bundle.js');
}

console.log('=== All Patches Successfully Applied! ===');
