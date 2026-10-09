// ============================================================================
// 🐾 ULTRA BÖLÜM UZATMA, 30+30 ZORLU PLATFORM, KEDİ KAFESİ & 10 AYI KURTARMA SİSTEMİ
// - Bütün macera bölümlerini devasa boyutta uzatır (Yamuk yamuk 30 zorlu platform!).
// - 30 platform sonunda BÜYÜK KARE PLATFORM ve kafeste KEDİ dostumuz bulunur.
// - Kedi konuşur: "Miyav! Yanımdaki tehlikeli yoldan ilerle, orada altın anahtarım var!"
// - Yan tarafa uzanan 30 platformluk ZORLU ANAHTAR PARKURU sonunda ALTIN ANAHTAR!
// - Anahtar alınıp geri dönüldüğünde kedi kurtarılır.
// - Her bölümde toplam 10 tutsak ayı ve kedi bulunur.
// - 10 ayı ve dost kurtarılmadan BOSS ARENASI AÇILMAZ (Kilitli Enerji Bariyeri).
// - 10 ayı kurtarılınca Boss kapısı görkemli havai fişeklerle açılır!
// ============================================================================

(function() {
  'use strict';

  console.log("🐾 Loading Ultra Level Extension & Caged Bear Rescue Engine v2.0...");

  let extensionGroup = null;
  let activeLevelRescuedCount = 0;
  const activeLevelTotalCages = 10;
  let activeLevelKeyCollected = false;
  let activeLevelCatFreed = false;
  let activeBarrierMesh = null;
  let activeLevelCages = [];
  let currentExtendedRegion = null;
  let hudElement = null;
  let catSpeechBubbleEl = null;

  // Level Konfigürasyonları (Bütün 14 Macera Bölümü)
  const REGION_EXTENSION_CONFIGS = {
    forest_temple: {
      name: "Antik Orman Tapınağı",
      color: 0x15803d,
      accentColor: 0x4ade80,
      startAnchor: { x: 0, y: 22, z: -105 },
      bossBarrierPos: { x: 0, y: 20, z: -130 },
      bossBarrierSize: { w: 20, h: 14 },
      branchSide: 1, // 1: Sağa doğru, -1: Sola doğru
      matType: 'forest'
    },
    beehive: {
      name: "Devasa Bal Kovanı",
      color: 0xd97706,
      accentColor: 0xfbbf24,
      startAnchor: { x: 0, y: 16, z: -108 },
      bossBarrierPos: { x: 0, y: 17, z: -120 },
      bossBarrierSize: { w: 22, h: 14 },
      branchSide: -1,
      matType: 'honey'
    },
    pelican_plains: {
      name: "Pelikan Ovaları & Gök Adaları",
      color: 0x0284c7,
      accentColor: 0x38bdf8,
      startAnchor: { x: 0, y: 32, z: -152 },
      bossBarrierPos: { x: 0, y: 34, z: -165 },
      bossBarrierSize: { w: 22, h: 14 },
      branchSide: 1,
      matType: 'sky'
    },
    snow_desert: {
      name: "Dondurucu Kar Vadisi",
      color: 0x38bdf8,
      accentColor: 0x93c5fd,
      startAnchor: { x: 0, y: 32, z: -156 },
      bossBarrierPos: { x: 0, y: 34, z: -170 },
      bossBarrierSize: { w: 22, h: 14 },
      branchSide: -1,
      matType: 'snow'
    },
    space_realm: {
      name: "Kozmik Boyut & Zindan",
      color: 0x7c3aed,
      accentColor: 0xc084fc,
      startAnchor: { x: 0, y: 31, z: -128 },
      bossBarrierPos: { x: 0, y: 21, z: -155 },
      bossBarrierSize: { w: 26, h: 16 },
      branchSide: 1,
      matType: 'space'
    },
    volcano_cave: {
      name: "Volkanik Ejderha Mağarası",
      color: 0xb91c1c,
      accentColor: 0xf97316,
      startAnchor: { x: 0, y: 34, z: -108 },
      bossBarrierPos: { x: 0, y: 42, z: -142 },
      bossBarrierSize: { w: 24, h: 14 },
      branchSide: -1,
      matType: 'volcano'
    },
    underwater_palace: {
      name: "Antik Su Altı Kristal Sarayı",
      color: 0x0891b2,
      accentColor: 0x06b6d4,
      startAnchor: { x: 0, y: 25, z: -450 },
      bossBarrierPos: { x: 0, y: 80, z: -550 },
      bossBarrierSize: { w: 26, h: 18 },
      branchSide: 1,
      matType: 'water'
    },
    golden_sanctuary: {
      name: "Efsanevi Altın Cenneti",
      color: 0xeab308,
      accentColor: 0xfacc15,
      startAnchor: { x: 0, y: 15, z: -170 },
      bossBarrierPos: { x: 0, y: 14, z: -200 },
      bossBarrierSize: { w: 22, h: 14 },
      branchSide: 1,
      matType: 'gold'
    },
    dinosaur_world: {
      name: "Dinozor Dünyası",
      color: 0xb45309,
      accentColor: 0xd97706,
      startAnchor: { x: 0, y: 49.8, z: -65 },
      bossBarrierPos: { x: 0, y: 49.5, z: -80 },
      bossBarrierSize: { w: 24, h: 14 },
      branchSide: -1,
      matType: 'dino'
    },
    sugar_world: {
      name: "Şeker Dünyası",
      color: 0xdb2777,
      accentColor: 0xf472b6,
      startAnchor: { x: 0, y: 14, z: -115 },
      bossBarrierPos: { x: 0, y: 12, z: -145 },
      bossBarrierSize: { w: 22, h: 14 },
      branchSide: 1,
      matType: 'sugar'
    },
    jokerooms: {
      name: "Jokerooms (Şaka Odaları)",
      color: 0xeab308,
      accentColor: 0xfde047,
      startAnchor: { x: 0, y: 12, z: -210 },
      bossBarrierPos: { x: 0, y: 11, z: -245 },
      bossBarrierSize: { w: 24, h: 14 },
      branchSide: -1,
      matType: 'joker'
    },
    ruin_village: {
      name: "Yıkılmış Köy Harabeleri",
      color: 0x475569,
      accentColor: 0xef4444,
      startAnchor: { x: 0, y: 10, z: -370 },
      bossBarrierPos: { x: 0, y: 8, z: -400 },
      bossBarrierSize: { w: 26, h: 15 },
      branchSide: 1,
      matType: 'ruin'
    },
    water_cave: {
      name: "Karanlık Su Mağarası",
      color: 0x1e293b,
      accentColor: 0x38bdf8,
      startAnchor: { x: 0, y: 28, z: -680 },
      bossBarrierPos: { x: 0, y: 30, z: -740 },
      bossBarrierSize: { w: 26, h: 16 },
      branchSide: -1,
      matType: 'water_cave'
    },
    bee_desert: {
      name: "Arıların Çölü & Antik Piramit",
      color: 0xb45309,
      accentColor: 0xf59e0b,
      startAnchor: { x: 0, y: 12, z: -620 },
      bossBarrierPos: { x: 0, y: 10, z: -675 },
      bossBarrierSize: { w: 26, h: 16 },
      branchSide: 1,
      matType: 'desert'
    }
  };

  // Helper: Physical solid collider registrator
  function registerSolidBox(game, minX, minY, minZ, maxX, maxY, maxZ, isJumpPad = false, boostForce = 18) {
    if (!game || !game.currentLevel) return;
    if (!game.currentLevel.colliders) game.currentLevel.colliders = [];

    const THREE = window.THREE;
    const col = {
      min: new THREE.Vector3(minX, minY, minZ),
      max: new THREE.Vector3(maxX, maxY, maxZ),
      isBox3Obstacle: true,
      isToxic: false,
      isJumpPad: isJumpPad,
      boostForce: boostForce,
      isExtensionCollider: true
    };
    game.currentLevel.colliders.push(col);
    return col;
  }

  // Create UI HUD for Rescued Bears and Key indicator
  function createRescueHUD() {
    if (hudElement) return;

    hudElement = document.createElement('div');
    hudElement.id = 'superbear-rescue-hud';
    hudElement.style.position = 'fixed';
    hudElement.style.top = '16px';
    hudElement.style.right = '16px';
    hudElement.style.zIndex = '9999';
    hudElement.style.display = 'none';
    hudElement.style.flexDirection = 'column';
    hudElement.style.gap = '6px';
    hudElement.style.padding = '12px 16px';
    hudElement.style.backgroundColor = 'rgba(15, 23, 42, 0.92)';
    hudElement.style.border = '2px solid rgba(245, 158, 11, 0.7)';
    hudElement.style.borderRadius = '16px';
    hudElement.style.backdropFilter = 'blur(10px)';
    hudElement.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.6)';
    hudElement.style.color = '#ffffff';
    hudElement.style.fontFamily = "system-ui, -apple-system, sans-serif";
    hudElement.style.pointerEvents = 'none';
    hudElement.style.transition = 'all 0.3s ease';

    document.body.appendChild(hudElement);

    // Floating speech bubble element for the cat
    catSpeechBubbleEl = document.createElement('div');
    catSpeechBubbleEl.id = 'superbear-cat-speech-bubble';
    catSpeechBubbleEl.style.position = 'fixed';
    catSpeechBubbleEl.style.bottom = '85px';
    catSpeechBubbleEl.style.left = '50%';
    catSpeechBubbleEl.style.transform = 'translateX(-50%)';
    catSpeechBubbleEl.style.zIndex = '9999';
    catSpeechBubbleEl.style.display = 'none';
    catSpeechBubbleEl.style.backgroundColor = 'rgba(15, 23, 42, 0.94)';
    catSpeechBubbleEl.style.border = '2px solid #facc15';
    catSpeechBubbleEl.style.borderRadius = '20px';
    catSpeechBubbleEl.style.padding = '14px 22px';
    catSpeechBubbleEl.style.maxWidth = '500px';
    catSpeechBubbleEl.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.7)';
    catSpeechBubbleEl.style.color = '#ffffff';
    catSpeechBubbleEl.style.fontFamily = "system-ui, -apple-system, sans-serif";
    catSpeechBubbleEl.style.textAlign = 'center';
    catSpeechBubbleEl.style.pointerEvents = 'none';
    catSpeechBubbleEl.style.animation = 'catFloat 2s ease-in-out infinite alternate';

    document.body.appendChild(catSpeechBubbleEl);
    updateRescueHUD();
  }

  function showCatSpeechBubble(text, duration = 4500) {
    if (!catSpeechBubbleEl) return;
    catSpeechBubbleEl.innerHTML = text;
    catSpeechBubbleEl.style.display = 'block';
    if (catSpeechBubbleEl._hideTimer) clearTimeout(catSpeechBubbleEl._hideTimer);
    catSpeechBubbleEl._hideTimer = setTimeout(() => {
      if (catSpeechBubbleEl) catSpeechBubbleEl.style.display = 'none';
    }, duration);
  }

  function updateRescueHUD() {
    if (!hudElement) return;
    const game = window.__superBearGame;
    if (!game || game.currentRegion === 'hub' || !game.currentRegion) {
      hudElement.style.display = 'none';
      return;
    }

    hudElement.style.display = 'flex';
    const isUnlocked = activeLevelRescuedCount >= activeLevelTotalCages;
    const keyStatusText = activeLevelKeyCollected 
      ? '<span style="color:#4ade80;">🗝️ Altın Anahtar: Var ✅</span>' 
      : (activeLevelCatFreed ? '<span style="color:#94a3b8;">🗝️ Anahtar: Kullanıldı</span>' : '<span style="color:#ef4444;">🗝️ Altın Anahtar: Yok ❌</span>');

    hudElement.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 14px;">
        <span style="font-weight: 800; font-size: 13px; color: #facc15; display: flex; align-items: center; gap: 6px;">
          🐻 Tutsak Ayı & Kedi:
        </span>
        <span style="font-weight: 900; font-size: 14px; color: ${isUnlocked ? '#4ade80' : '#ffffff'}; font-family: monospace;">
          ${activeLevelRescuedCount} / ${activeLevelTotalCages}
        </span>
      </div>
      <div style="width: 100%; height: 9px; background: rgba(51, 65, 85, 0.85); border-radius: 5px; overflow: hidden; margin: 2px 0;">
        <div style="width: ${(activeLevelRescuedCount / activeLevelTotalCages) * 100}%; height: 100%; background: ${isUnlocked ? 'linear-gradient(90deg, #22c55e, #4ade80)' : 'linear-gradient(90deg, #f59e0b, #eab308)'}; transition: width 0.4s ease;"></div>
      </div>
      <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; font-weight: 700; gap: 8px;">
        <span>${keyStatusText}</span>
        <span style="color: ${isUnlocked ? '#4ade80' : '#ef4444'};">${isUnlocked ? '⚔️ Boss Kapısı Açık!' : '🔒 Boss: Kilitli'}</span>
      </div>
    `;
  }

  // 3D Model: Iron Cage with bars and padlock
  function createIronCage(THREE, size = 2.4, color = 0x475569) {
    const cage = new THREE.Group();
    cage.name = "iron_cage_container";

    const metalMat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.3,
      metalness: 0.8
    });
    const lockMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0xd97706,
      emissiveIntensity: 0.4
    });

    // Base slab
    const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(size, 0.25, size), metalMat);
    baseMesh.position.y = 0.125;
    baseMesh.castShadow = true;
    cage.add(baseMesh);

    // Roof slab
    const roofMesh = new THREE.Mesh(new THREE.BoxGeometry(size, 0.25, size), metalMat);
    roofMesh.position.y = 2.35;
    roofMesh.castShadow = true;
    cage.add(roofMesh);

    // Vertical Iron Bars
    const barGeo = new THREE.CylinderGeometry(0.045, 0.045, 2.1, 8);
    const half = size / 2 - 0.12;

    const barPositions = [
      // Front
      [-half, half], [-half * 0.4, half], [half * 0.4, half], [half, half],
      // Back
      [-half, -half], [-half * 0.4, -half], [half * 0.4, -half], [half, -half],
      // Left
      [-half, 0],
      // Right
      [half, 0]
    ];

    barPositions.forEach(([bx, bz]) => {
      const bar = new THREE.Mesh(barGeo, metalMat);
      bar.position.set(bx, 1.25, bz);
      bar.castShadow = true;
      cage.add(bar);
    });

    // Golden Padlock on front
    const lockMesh = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.45, 0.14), lockMat);
    lockMesh.position.set(0, 1.25, half + 0.08);
    cage.add(lockMesh);

    const shackle = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.035, 8, 16, Math.PI), lockMat);
    shackle.position.set(0, 1.5, half + 0.08);
    cage.add(shackle);

    cage.userData = {
      base: baseMesh,
      roof: roofMesh,
      lock: lockMesh,
      isCage: true
    };

    return cage;
  }

  // 3D Model: Trapped Cat (cute stylized model)
  function createTrappedCat(THREE, furColor = 0xf59e0b) {
    const cat = new THREE.Group();
    cat.name = "trapped_cat_friend";

    const furMat = new THREE.MeshStandardMaterial({ color: furColor, roughness: 0.6 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const earInnerMat = new THREE.MeshStandardMaterial({ color: 0xf472b6 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.1 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });

    // Body
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.48, 12, 12), furMat);
    body.scale.set(0.9, 1.1, 0.9);
    body.position.y = 0.55;
    cat.add(body);

    // Belly
    const belly = new THREE.Mesh(new THREE.SphereGeometry(0.32, 10, 10), whiteMat);
    belly.scale.set(0.8, 1.0, 0.4);
    belly.position.set(0, 0.5, 0.32);
    cat.add(belly);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.38, 14, 14), furMat);
    head.scale.set(1.1, 0.95, 1.0);
    head.position.set(0, 1.05, 0.1);
    cat.add(head);

    // Ears
    [-0.22, 0.22].forEach(ex => {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.3, 4), furMat);
      ear.position.set(ex, 1.35, 0.1);
      ear.rotation.z = ex > 0 ? -0.3 : 0.3;
      cat.add(ear);

      const inEar = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.22, 4), earInnerMat);
      inEar.position.set(ex, 1.35, 0.13);
      inEar.rotation.z = ex > 0 ? -0.3 : 0.3;
      cat.add(inEar);
    });

    // Eyes
    [-0.14, 0.14].forEach(ex => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), eyeMat);
      eye.position.set(ex, 1.12, 0.38);
      cat.add(eye);

      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), darkMat);
      pupil.position.set(ex, 1.12, 0.44);
      cat.add(pupil);
    });

    // Muzzle & Nose
    const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), whiteMat);
    muzzle.position.set(0, 0.98, 0.4);
    cat.add(muzzle);

    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 6), earInnerMat);
    nose.position.set(0, 1.02, 0.48);
    cat.add(nose);

    // Tail
    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.5, 6), furMat);
    tail.position.set(0, 0.45, -0.42);
    tail.rotation.x = -0.7;
    cat.add(tail);

    cat.userData = {
      update: (time) => {
        head.rotation.y = Math.sin(time * 2.5) * 0.18;
        tail.rotation.z = Math.sin(time * 5) * 0.35;
      }
    };

    return cat;
  }

  // 3D Model: Trapped Bear
  function createTrappedBear(THREE, furColor = 0x854d0e) {
    const bear = new THREE.Group();
    bear.name = "trapped_bear_friend";

    const furMat = new THREE.MeshStandardMaterial({ color: furColor, roughness: 0.7 });
    const bellyMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 12), furMat);
    body.position.y = 0.6;
    bear.add(body);

    const belly = new THREE.Mesh(new THREE.SphereGeometry(0.38, 10, 10), bellyMat);
    belly.scale.set(0.85, 0.95, 0.35);
    belly.position.set(0, 0.55, 0.36);
    bear.add(belly);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 12, 12), furMat);
    head.position.set(0, 1.2, 0.08);
    bear.add(head);

    // Round Bear Ears
    [-0.28, 0.28].forEach(ex => {
      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), furMat);
      ear.position.set(ex, 1.5, 0.08);
      bear.add(ear);
    });

    // Snout
    const snout = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), bellyMat);
    snout.position.set(0, 1.15, 0.38);
    bear.add(snout);

    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), darkMat);
    nose.position.set(0, 1.22, 0.52);
    bear.add(nose);

    bear.userData = {
      update: (time) => {
        head.rotation.y = Math.sin(time * 2) * 0.15;
      }
    };

    return bear;
  }

  // 3D Model: Golden Cage Key
  function createGoldenKey(THREE) {
    const keyGrp = new THREE.Group();
    keyGrp.name = "golden_cage_key";

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.8
    });

    // Bow Ring
    const bow = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.09, 8, 20), goldMat);
    bow.position.y = 1.0;
    bow.castShadow = true;
    keyGrp.add(bow);

    // Stem
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.1, 8), goldMat);
    stem.position.y = 0.45;
    stem.castShadow = true;
    keyGrp.add(stem);

    // Teeth
    const t1 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 0.08), goldMat);
    t1.position.set(0.16, 0.15, 0);
    keyGrp.add(t1);

    const t2 = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.12, 0.08), goldMat);
    t2.position.set(0.12, -0.05, 0);
    keyGrp.add(t2);

    // Radiant Light
    const kLight = new THREE.PointLight(0xfde047, 3.0, 12);
    kLight.position.set(0, 0.6, 0);
    keyGrp.add(kLight);

    // Vertical Celestial Beam
    const beamGeo = new THREE.CylinderGeometry(0.15, 0.4, 8.0, 8);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.y = 4.0;
    keyGrp.add(beam);

    keyGrp.userData = {
      update: (time) => {
        keyGrp.rotation.y += 0.035;
        keyGrp.position.y = keyGrp.userData.baseY + Math.sin(time * 3.5) * 0.25;
      }
    };

    return keyGrp;
  }

  // Create Themed Platform Material
  function getThemedPlatformMaterial(THREE, matType, color, accentColor) {
    return new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.65,
      metalness: 0.25,
      emissive: accentColor,
      emissiveIntensity: 0.15
    });
  }

  // Build the complete 30-platform approach + Big Square + 30-platform Key route
  function buildLevelExtensionPath(game, cfg) {
    if (!game || !game.scene || !window.THREE) return;
    const THREE = window.THREE;

    console.log(`🐾 Building 30+30 Ultra Platforms & Caged Cat Rescue for: ${cfg.name}...`);

    extensionGroup = new THREE.Group();
    extensionGroup.name = "ultra_level_extension_group";

    activeLevelCages = [];
    activeLevelRescuedCount = 0;
    activeLevelKeyCollected = false;
    activeLevelCatFreed = false;

    // Expand currentLevel bounds so physics clamp never stops the player
    if (game.currentLevel && game.currentLevel.bounds) {
      game.currentLevel.bounds.minX = -800;
      game.currentLevel.bounds.maxX = 800;
      game.currentLevel.bounds.minZ = -1400;
      game.currentLevel.bounds.maxZ = 800;
      game.currentLevel.bounds.maxY = 500;
    }

    const platMat = getThemedPlatformMaterial(THREE, cfg.matType, cfg.color, cfg.accentColor);
    const accentMat = new THREE.MeshStandardMaterial({
      color: cfg.accentColor,
      emissive: cfg.accentColor,
      emissiveIntensity: 0.5,
      roughness: 0.3
    });

    const start = cfg.startAnchor;

    // =========================================================================
    // 1. ROUTE 1: 30 ZORLU, YAMUK YAMUK (WINDING & ZIG-ZAG) PARKOUR PLATFORMU
    // =========================================================================
    let currentX = start.x;
    let currentY = start.y;
    let currentZ = start.z;

    for (let i = 1; i <= 30; i++) {
      // Yamuk yamuk, dalgalı, eğimli ve zikzaklı hesap
      const wave = Math.sin(i * 0.92);
      const curveX = wave * (6.0 + (i % 4) * 2.4);
      const stepZ = -(i * 4.8);
      const stepY = start.y + Math.sin(i * 0.65) * 3.4 + (i * 0.36);

      const posX = start.x + curveX;
      const posY = stepY;
      const posZ = start.z + stepZ;

      currentX = posX;
      currentY = posY;
      currentZ = posZ;

      // Boyutlar (Zorluk için değişken ölçüler)
      const pWidth = Math.max(2.0, 3.4 - (i % 3) * 0.5);
      const pDepth = Math.max(2.0, 3.4 - (i % 2) * 0.4);
      const pHeight = 0.8;

      const platMesh = new THREE.Mesh(
        new THREE.BoxGeometry(pWidth, pHeight, pDepth),
        (i % 5 === 0) ? accentMat : platMat
      );
      platMesh.position.set(posX, posY, posZ);
      platMesh.castShadow = true;
      platMesh.receiveShadow = true;
      extensionGroup.add(platMesh);

      // Register solid collider for safe footing
      registerSolidBox(
        game,
        posX - pWidth / 2, posY - pHeight / 2, posZ - pDepth / 2,
        posX + pWidth / 2, posY + pHeight / 2, posZ + pDepth / 2
      );

      // Zıplama trambolini (Jump Pad) her 7 platformda bir
      if (i % 7 === 0) {
        const jPad = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.1, 0.25, 12), accentMat);
        jPad.position.set(posX, posY + pHeight / 2 + 0.12, posZ);
        extensionGroup.add(jPad);

        registerSolidBox(
          game,
          posX - 0.9, posY + pHeight / 2, posZ - 0.9,
          posX + 0.9, posY + pHeight / 2 + 0.35, posZ + 0.9,
          true,
          22
        );
      }
    }

    // =========================================================================
    // 2. BÜYÜK KARE PLATFORM & KAFESTEKİ KEDİ (BIG SQUARE PLATFORM & CAGED CAT)
    // =========================================================================
    const sqX = currentX;
    const sqY = currentY + 0.5;
    const sqZ = currentZ - 13.0;

    const sqSize = 20.0;
    const sqHeight = 1.8;

    const bigSquare = new THREE.Mesh(
      new THREE.BoxGeometry(sqSize, sqHeight, sqSize),
      platMat
    );
    bigSquare.position.set(sqX, sqY, sqZ);
    bigSquare.castShadow = true;
    bigSquare.receiveShadow = true;
    extensionGroup.add(bigSquare);

    // Decorative perimeter tiles on big square
    const borderMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const borderFrame = new THREE.Mesh(new THREE.BoxGeometry(sqSize + 0.6, 0.3, sqSize + 0.6), borderMat);
    borderFrame.position.set(sqX, sqY - sqHeight / 2 + 0.15, sqZ);
    extensionGroup.add(borderFrame);

    registerSolidBox(
      game,
      sqX - sqSize / 2, sqY - sqHeight / 2, sqZ - sqSize / 2,
      sqX + sqSize / 2, sqY + sqHeight / 2, sqZ + sqSize / 2
    );

    // Elevated pedestal for the cage
    const cagePed = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 3.0, 0.6, 16), accentMat);
    const cageBaseY = sqY + sqHeight / 2 + 0.3;
    cagePed.position.set(sqX, cageBaseY, sqZ);
    extensionGroup.add(cagePed);

    registerSolidBox(
      game,
      sqX - 2.6, cageBaseY - 0.3, sqZ - 2.6,
      sqX + 2.6, cageBaseY + 0.3, sqZ + 2.6
    );

    // Iron Cage #1 (Main Caged Cat)
    const mainCage = createIronCage(THREE, 2.6, 0x475569);
    mainCage.position.set(sqX, cageBaseY + 0.3, sqZ);
    extensionGroup.add(mainCage);

    const trappedCat = createTrappedCat(THREE, 0xf59e0b);
    trappedCat.position.set(sqX, cageBaseY + 0.5, sqZ);
    extensionGroup.add(trappedCat);

    // Checkpoint flag on the Big Square so falling off doesn't restart from beginning
    const flagMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x16a34a, emissiveIntensity: 0.6 });
    const flagPole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.8, 8), borderMat);
    flagPole.position.set(sqX - 7.5, cageBaseY + 1.9, sqZ - 7.5);
    extensionGroup.add(flagPole);
    const flagMesh = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.8, 0.05), flagMat);
    flagMesh.position.set(sqX - 6.8, cageBaseY + 3.2, sqZ - 7.5);
    extensionGroup.add(flagMesh);

    // Auto-register checkpoint on the Big Square
    if (game.currentLevel && game.currentLevel.checkpoints) {
      game.currentLevel.checkpoints.push({
        id: "cp_big_square_cat",
        name: "Büyük Kare Platform (Tutsak Kedi)",
        pos: new THREE.Vector3(sqX, cageBaseY + 0.6, sqZ + 4.0),
        active: false,
        mesh: flagMesh
      });
    }

    // Interactive Cage Object Controller
    const catCageObj = {
      id: "caged_cat_main",
      type: "cat_key_quest",
      pos: new THREE.Vector3(sqX, cageBaseY + 0.5, sqZ),
      cageMesh: mainCage,
      creatureMesh: trappedCat,
      isRescued: false,
      lastTalkTime: 0,
      update: (game, time) => {
        if (trappedCat.userData && typeof trappedCat.userData.update === 'function') {
          trappedCat.userData.update(time);
        }

        if (catCageObj.isRescued) return;

        if (game.playerPos) {
          const dist = game.playerPos.distanceTo(catCageObj.pos);
          if (dist < 4.2) {
            const now = Date.now();

            if (!activeLevelKeyCollected) {
              // Player does not have key yet -> Cat asks for help!
              if (now - catCageObj.lastTalkTime > 3000) {
                catCageObj.lastTalkTime = now;
                
                showCatSpeechBubble(`
                  <div style="font-weight: 800; font-size: 15px; color: #facc15; margin-bottom: 4px;">🐱 Tutsak Kedi Dostumuz:</div>
                  <div style="font-size: 13.5px; line-height: 1.4;">"Miyav! Lütfen beni kurtar! <strong>Benim yanımdaki platformdan ilerle, orada altın anahtarım var!</strong>" 🗝️</div>
                `, 4000);

                if (game.callbacks && game.callbacks.onShowNotice) {
                  game.callbacks.onShowNotice('🐱 Kedi: "Miyav! Benim yanımdaki platformdan ilerle, orada altın anahtarım var!" 🗝️', 'warn');
                }

                // If user dialogue modal exists, can open on dialogue
                if (game.callbacks && game.callbacks.onDialogueOpen && !window.__superBearModalOpen) {
                  game.callbacks.onDialogueOpen({
                    npcName: "Pamuk (Kafesteki Tutsak Kedi 🐱)",
                    npcRole: "Yardım Bekleyen Dost",
                    avatarIcon: "🐱",
                    dialogue: [
                      "Miyav! Lütfen beni bu kafesten kurtar cesur Süper Ayı! 😿",
                      "Benim yanımdaki tehlikeli platformlardan ilerle, orada altın anahtarım var! 🗝️",
                      "30 zorlu platformu aşıp anahtarı getirirsen kafesimi açabilirsin miyav!"
                    ]
                  });
                }

                if (typeof window.St !== 'undefined' && window.St.playDialogueChirp) {
                  window.St.playDialogueChirp(1.6);
                }
                if (game.spawnSparkleParticles) {
                  game.spawnSparkleParticles(catCageObj.pos, 15, 0xfacc15);
                }
              }
            } else {
              // Player HAS the key -> UNLOCK CAGE!
              catCageObj.isRescued = true;
              activeLevelCatFreed = true;
              activeLevelRescuedCount++;
              updateRescueHUD();

              if (mainCage.parent) mainCage.parent.remove(mainCage);

              showCatSpeechBubble(`
                <div style="font-weight: 800; font-size: 16px; color: #4ade80; margin-bottom: 4px;">🎉 KEDİ DOSTUMUZ KURTARILDI!</div>
                <div style="font-size: 14px;">"Miyavvv! Çok teşekkürler Süper Ayı, sayende özgürüm!" 🐾✨ (+150 XP, +100 Altın)</div>
              `, 5000);

              if (typeof window.St !== 'undefined' && window.St.playPowerup) {
                window.St.playPowerup();
              }
              if (game.spawnSparkleParticles) {
                game.spawnSparkleParticles(catCageObj.pos, 60, 0x4ade80);
              }
              if (game.callbacks && game.callbacks.onShowNotice) {
                game.callbacks.onShowNotice('🎉 KEDİ DOSTUMUZ KURTARILDI! "Miyavvv! Çok teşekkürler Süper Ayı!" (+100 Altın, +150 XP)', 'success');
              }

              // Happy jump animation for freed cat
              trappedCat.position.y += 0.8;
              setTimeout(() => { trappedCat.position.y -= 0.8; }, 200);

              checkIfAllRescuedAndUnlockBoss(game);
            }
          }
        }
      }
    };
    activeLevelCages.push(catCageObj);

    // =========================================================================
    // 3. ROUTE 2: YANA DOĞRU UZANAN 30 PLATFORMLUK ZORLU ANAHTAR PARKURU
    // =========================================================================
    const sideDir = cfg.branchSide || 1; // 1: Sağa doğru, -1: Sola doğru
    let keyPathX = sqX;
    let keyPathY = sqY + sqHeight / 2;
    let keyPathZ = sqZ;

    for (let k = 1; k <= 30; k++) {
      // Yana doğru kıvrılarak yükselen zorlu parkur
      const kDist = k * 4.6;
      const kCurveZ = Math.sin(k * 0.82) * 5.4;
      const kElev = Math.sin(k * 0.52) * 3.0 + (k * 0.38);

      const kX = sqX + (sideDir * (12.0 + kDist));
      const kY = sqY + kElev;
      const kZ = sqZ + kCurveZ;

      keyPathX = kX;
      keyPathY = kY;
      keyPathZ = kZ;

      const kW = Math.max(2.0, 3.2 - (k % 3) * 0.5);
      const kD = Math.max(2.0, 3.2 - (k % 2) * 0.4);
      const kH = 0.7;

      const kMesh = new THREE.Mesh(
        new THREE.BoxGeometry(kW, kH, kD),
        (k % 6 === 0) ? accentMat : platMat
      );
      kMesh.position.set(kX, kY, kZ);
      kMesh.castShadow = true;
      kMesh.receiveShadow = true;
      extensionGroup.add(kMesh);

      registerSolidBox(
        game,
        kX - kW / 2, kY - kH / 2, kZ - kD / 2,
        kX + kW / 2, kY + kH / 2, kZ + kD / 2
      );

      // Bazı platformlarda altın sikke veya zıplama trambolini
      if (k % 4 === 0) {
        const coinMarker = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.08, 12), accentMat);
        coinMarker.position.set(kX, kY + kH / 2 + 0.6, kZ);
        coinMarker.rotation.x = Math.PI / 2;
        extensionGroup.add(coinMarker);
      }
    }

    // =========================================================================
    // 4. 30. ANAHTAR PLATFORMU & ALTIN ANAHTAR SUNAĞI (GOLDEN KEY ALTAR)
    // =========================================================================
    const altarMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(3.5, 4.0, 1.2, 16),
      accentMat
    );
    altarMesh.position.set(keyPathX, keyPathY, keyPathZ);
    altarMesh.receiveShadow = true;
    extensionGroup.add(altarMesh);

    registerSolidBox(
      game,
      keyPathX - 3.5, keyPathY - 0.6, keyPathZ - 3.5,
      keyPathX + 3.5, keyPathY + 0.6, keyPathZ + 3.5
    );

    const goldenKey = createGoldenKey(THREE);
    const keyY = keyPathY + 0.6 + 0.8;
    goldenKey.position.set(keyPathX, keyY, keyPathZ);
    goldenKey.userData.baseY = keyY;
    extensionGroup.add(goldenKey);

    const keyObj = {
      pos: new THREE.Vector3(keyPathX, keyY, keyPathZ),
      mesh: goldenKey,
      isCollected: false,
      update: (game, time) => {
        if (keyObj.isCollected) return;

        if (goldenKey.userData && typeof goldenKey.userData.update === 'function') {
          goldenKey.userData.update(time);
        }

        if (game.playerPos) {
          const dist = game.playerPos.distanceTo(keyObj.pos);
          if (dist < 2.8) {
            keyObj.isCollected = true;
            activeLevelKeyCollected = true;
            updateRescueHUD();

            if (goldenKey.parent) goldenKey.parent.remove(goldenKey);

            if (typeof window.St !== 'undefined' && window.St.playHoneyGem) {
              window.St.playHoneyGem();
            }
            if (game.spawnSparkleParticles) {
              game.spawnSparkleParticles(keyObj.pos, 55, 0xfacc15);
            }
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice('🗝️ ALTIN KAFES ANAHTARI ALINDI! Kedi dostunun yanına dön ve kafesini aç!', 'success');
            }
            showCatSpeechBubble(`
              <div style="font-weight: 800; font-size: 15px; color: #facc15;">🗝️ ALTIN KAFES ANAHTARI ALINDI!</div>
              <div style="font-size: 13px;">Şimdi geri dönüp Büyük Kare Platformdaki kedi dostunun kafesini açabilirsin!</div>
            `, 4000);
          }
        }
      }
    };
    activeLevelCages.push(keyObj);

    // =========================================================================
    // 5. 9 ADET DİĞER TUTSAK AYI KAFESLERİ (Toplam 10 Kurtarma Hedefi!)
    // =========================================================================
    for (let cIdx = 1; cIdx <= 9; cIdx++) {
      let cX, cY, cZ;
      if (cIdx <= 4) {
        const stepNum = cIdx * 6;
        const wave = Math.sin(stepNum * 0.92);
        cX = start.x + wave * (6.0 + (stepNum % 4) * 2.4) + ((cIdx % 2 === 0) ? 3.6 : -3.6);
        cY = start.y + Math.sin(stepNum * 0.65) * 3.4 + (stepNum * 0.36) + 0.4;
        cZ = start.z - (stepNum * 4.8);
      } else if (cIdx <= 7) {
        const kStep = (cIdx - 4) * 7;
        cX = sqX + (sideDir * (12.0 + kStep * 4.6)) + ((cIdx % 2 === 0) ? 3.4 : -3.4);
        cY = sqY + Math.sin(kStep * 0.52) * 3.0 + (kStep * 0.38) + 0.4;
        cZ = sqZ + Math.sin(kStep * 0.82) * 5.4;
      } else {
        // Büyük Kare Platformun sol ve sağ köşelerinde
        cX = sqX + (cIdx === 8 ? -7.0 : 7.0);
        cY = sqY + sqHeight / 2 + 0.25;
        cZ = sqZ + 7.0;
      }

      // Stand platform
      const pStand = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.0, 0.4, 12), platMat);
      pStand.position.set(cX, cY - 0.2, cZ);
      extensionGroup.add(pStand);
      registerSolidBox(game, cX - 1.8, cY - 0.4, cZ - 1.8, cX + 1.8, cY, cZ + 1.8);

      const bearCage = createIronCage(THREE, 2.2, 0x64748b);
      bearCage.position.set(cX, cY, cZ);
      extensionGroup.add(bearCage);

      const bearMesh = createTrappedBear(THREE, (cIdx % 2 === 0) ? 0x78350f : 0x92400e);
      bearMesh.position.set(cX, cY + 0.2, cZ);
      extensionGroup.add(bearMesh);

      const otherCageObj = {
        id: `caged_bear_${cIdx}`,
        type: "bear_cage",
        pos: new THREE.Vector3(cX, cY + 0.5, cZ),
        cageMesh: bearCage,
        creatureMesh: bearMesh,
        isRescued: false,
        update: (game, time) => {
          if (bearMesh.userData && typeof bearMesh.userData.update === 'function') {
            bearMesh.userData.update(time);
          }

          if (otherCageObj.isRescued) return;

          if (game.playerPos) {
            const dist = game.playerPos.distanceTo(otherCageObj.pos);
            if (dist < 3.0) {
              otherCageObj.isRescued = true;
              activeLevelRescuedCount++;
              updateRescueHUD();

              if (bearCage.parent) bearCage.parent.remove(bearCage);

              if (typeof window.St !== 'undefined' && window.St.playCoin) {
                window.St.playCoin();
              }
              if (game.spawnSparkleParticles) {
                game.spawnSparkleParticles(otherCageObj.pos, 35, 0xfacc15);
              }
              if (game.callbacks && game.callbacks.onShowNotice) {
                game.callbacks.onShowNotice(`🐻 Ayı Dostumuz Kurtarıldı! (${activeLevelRescuedCount} / ${activeLevelTotalCages})`, "info");
              }

              checkIfAllRescuedAndUnlockBoss(game);
            }
          }
        }
      };
      activeLevelCages.push(otherCageObj);
    }

    // =========================================================================
    // 6. BOSS ARENASI KİLİTLİ ENERJİ BARİYERİ (BOSS ARENA LOCKED BARRIER)
    // =========================================================================
    buildBossArenaBarrier(game, cfg);

    game.scene.add(extensionGroup);
    currentExtendedRegion = game.currentRegion;
    updateRescueHUD();
  }

  // Boss Arena Kilitli Bariyeri
  function buildBossArenaBarrier(game, cfg) {
    if (!cfg.bossBarrierPos || !window.THREE) return;
    const THREE = window.THREE;

    const bPos = cfg.bossBarrierPos;
    const bSize = cfg.bossBarrierSize || { w: 22, h: 14 };

    const barrierMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xd97706,
      emissiveIntensity: 1.6,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide
    });

    const bMesh = new THREE.Mesh(new THREE.BoxGeometry(bSize.w, bSize.h, 1.4), barrierMat);
    bMesh.position.set(bPos.x, bPos.y + bSize.h / 2, bPos.z);
    bMesh.name = "boss_arena_locked_barrier";
    extensionGroup.add(bMesh);
    activeBarrierMesh = bMesh;

    // Glowing border pillars
    const pilMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
    const pL = new THREE.Mesh(new THREE.BoxGeometry(1.8, bSize.h + 2, 1.8), pilMat);
    pL.position.set(bPos.x - bSize.w / 2, bPos.y + bSize.h / 2, bPos.z);
    extensionGroup.add(pL);

    const pR = new THREE.Mesh(new THREE.BoxGeometry(1.8, bSize.h + 2, 1.8), pilMat);
    pR.position.set(bPos.x + bSize.w / 2, bPos.y + bSize.h / 2, bPos.z);
    extensionGroup.add(pR);

    // Kilitli Bariyer Çarpışma / Geri İtme Mantığı
    const barrierObj = {
      pos: new THREE.Vector3(bPos.x, bPos.y + bSize.h / 2, bPos.z),
      size: bSize,
      lastWarnTime: 0,
      update: (game, time) => {
        if (!activeBarrierMesh || !activeBarrierMesh.parent) return;

        // Nabız gibi parıldama efekti
        barrierMat.opacity = 0.65 + Math.sin(time * 6) * 0.18;

        if (game.playerPos) {
          const dx = Math.abs(game.playerPos.x - bPos.x);
          const dz = Math.abs(game.playerPos.z - bPos.z);

          if (dx < bSize.w / 2 + 1.2 && dz < 2.5) {
            if (activeLevelRescuedCount < activeLevelTotalCages) {
              // Geri it ve uyar!
              if (game.playerVel) {
                game.playerVel.z = 8.0;
              }
              game.playerPos.z = bPos.z + 3.2;

              const now = Date.now();
              if (now - barrierObj.lastWarnTime > 2500) {
                barrierObj.lastWarnTime = now;
                if (game.callbacks && game.callbacks.onShowNotice) {
                  game.callbacks.onShowNotice(`⚠️ KİLİTLİ BOSS KAPISI! Bu bölümdeki 10 tutsak ayı & kedi dostunu kurtarmadan Boss ile savaşamazsın! (${activeLevelRescuedCount} / ${activeLevelTotalCages})`, "warn");
                }
                if (game.spawnSparkleParticles) {
                  game.spawnSparkleParticles(game.playerPos, 20, 0xef4444);
                }
              }
            }
          }
        }
      }
    };
    activeLevelCages.push(barrierObj);
  }

  // 10 Dostun Tümü Kurtarıldığında Boss Kapısını Açar!
  function checkIfAllRescuedAndUnlockBoss(game) {
    if (activeLevelRescuedCount >= activeLevelTotalCages) {
      if (activeBarrierMesh && activeBarrierMesh.parent) {
        if (game.spawnSparkleParticles) {
          game.spawnSparkleParticles(activeBarrierMesh.position, 80, 0x4ade80);
          game.spawnSparkleParticles(activeBarrierMesh.position, 80, 0xfacc15);
        }
        activeBarrierMesh.parent.remove(activeBarrierMesh);
        activeBarrierMesh = null;
      }

      if (typeof window.St !== 'undefined' && window.St.playGoalFanfare) {
        window.St.playGoalFanfare();
      }
      if (game.callbacks && game.callbacks.onShowNotice) {
        game.callbacks.onShowNotice("🏆 EFSANEVİ BAŞARI! 10 AYI & KEDİ KURTARILDI! BÖLÜM BOSS ARENASI AÇILDI! ⚔️", "success");
      }
      showCatSpeechBubble(`
        <div style="font-weight: 800; font-size: 16px; color: #4ade80; margin-bottom: 4px;">🏆 10 TUTSAK DOSTUMUZ KURTARILDI!</div>
        <div style="font-size: 14px;">Bölüm Boss Arenası'nın kilitli kapısı açıldı! Şimdi Boss ile savaşa hazırsın! ⚔️</div>
      `, 6000);
      updateRescueHUD();
    }
  }

  // Clean up extensions when leaving level
  function removeLevelExtension() {
    const game = window.__superBearGame;
    if (extensionGroup && extensionGroup.parent) {
      extensionGroup.parent.remove(extensionGroup);
    }
    extensionGroup = null;
    activeLevelCages = [];
    activeBarrierMesh = null;
    currentExtendedRegion = null;
    activeLevelRescuedCount = 0;
    activeLevelKeyCollected = false;
    activeLevelCatFreed = false;

    // Clean up extension colliders
    if (game && game.currentLevel && game.currentLevel.colliders) {
      game.currentLevel.colliders = game.currentLevel.colliders.filter(c => !c.isExtensionCollider);
    }

    if (hudElement) {
      hudElement.style.display = 'none';
    }
    if (catSpeechBubbleEl) {
      catSpeechBubbleEl.style.display = 'none';
    }
  }
  window.__removeLevelExtension = removeLevelExtension;

  // Level Kontrolü ve Enjeksiyonu
  function checkAndExtendLevel(game) {
    if (!game || !game.currentRegion) return;
    const reg = game.currentRegion;

    // Ayı Köyü (hub) macera bölümü değil, merkez köydür; uzatma yalnızca bölümlere uygulanır!
    if (reg === 'hub') {
      if (extensionGroup) removeLevelExtension();
      return;
    }

    let cfg = REGION_EXTENSION_CONFIGS[reg];
    if (!cfg) {
      // Dinamik Fallback Konfigürasyonu
      cfg = {
        name: reg,
        color: 0x3b82f6,
        accentColor: 0x60a5fa,
        startAnchor: { x: 0, y: 15, z: -120 },
        bossBarrierPos: { x: 0, y: 15, z: -150 },
        bossBarrierSize: { w: 22, h: 14 },
        branchSide: 1,
        matType: 'sky'
      };
    }

    if (currentExtendedRegion === reg && extensionGroup && extensionGroup.parent) {
      return;
    }

    removeLevelExtension();
    buildLevelExtensionPath(game, cfg);
  }

  // Frame Update Loop Hook
  function updateLevelExtensions(game) {
    if (!game) return;
    if (game.currentRegion === 'hub') return;

    const time = performance.now() / 1000;
    for (let i = 0; i < activeLevelCages.length; i++) {
      const obj = activeLevelCages[i];
      if (obj && typeof obj.update === 'function') {
        obj.update(game, time);
      }
    }
  }

  // Listen to region transitions
  window.addEventListener('superbear:region-changed', (e) => {
    const newReg = e.detail;
    const game = window.__superBearGame;
    if (newReg === 'hub') {
      removeLevelExtension();
    } else {
      setTimeout(() => {
        checkAndExtendLevel(game);
      }, 180);
    }
  });

  // Engine Initializer
  function initLevelExtensionEngine() {
    createRescueHUD();

    const game = window.__superBearGame;
    if (game && game.scene && window.THREE) {
      if (game.currentRegion && game.currentRegion !== 'hub') {
        checkAndExtendLevel(game);
      }

      const origUpdate = game.update;
      if (origUpdate && !game._levelExtensionHooked) {
        game._levelExtensionHooked = true;
        game.update = function(dt, totalTime) {
          origUpdate.call(this, dt, totalTime);
          try {
            updateLevelExtensions(this);
          } catch (err) {}
        };
      }
    } else {
      setTimeout(initLevelExtensionEngine, 300);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLevelExtensionEngine);
  } else {
    initLevelExtensionEngine();
  }
})();
