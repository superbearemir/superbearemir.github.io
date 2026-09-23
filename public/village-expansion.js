// ============================================================================
// 🏡 AYI KEDİ KÖYÜ BÜYÜK GENİŞLEME & GİZEMLER MOTORU (GRAND VILLAGE EXPANSION)
// - Devasa Büyüyen Köy Bölgeleri (Doğu Bahçeleri, Batı Çiftliği, Göksel Ağaç, Şelale Grotto)
// - Köylülerin Sorusunun Cevabı ("Neden bu kadar büyüdü bu köy?")
// - 1. Kural: Yerlere Değince Ayakta Kalabilme (Solid Footing & Collision Engine)
// - 2. Kural: 4 Gizli Geçit, 6 Dost Canlısı ve 6 Gizli Hikaye Parşömeni
// ============================================================================

(function() {
  'use strict';

  console.log("🌸 Initializing Ayı Kedi Köyü Grand Expansion & Story Lore Engine...");

  let villageExpansionGroup = null;
  let expansionColliders = [];
  let friendlyCreatures = [];
  let storyScrolls = [];
  let secretPassages = [];
  let windmillBlades = null;
  let skyHawk = null;
  let swimmingOtter = null;
  let bouncingKittens = [];
  let healingTurtle = null;

  // 6 Story Scrolls Definitions
  const SCROLL_LOCATIONS = [
    {
      id: 'scroll_expansion_mystery',
      scrollNumber: 1,
      title: "Genişleyen Toprakların Sırrı",
      pos: { x: 0.0, y: 0.35, z: -14.0 },
      icon: "🏛️",
      color: 0xf59e0b
    },
    {
      id: 'scroll_ancient_pact',
      scrollNumber: 2,
      title: "Ayı ve Kedi Kadim Kardeşlik Paktı",
      pos: { x: -75.0, y: -3.15, z: 12.0 },
      icon: "🌾",
      color: 0x10b981
    },
    {
      id: 'scroll_dimensional_tether',
      scrollNumber: 3,
      title: "Boyutlar Arası Bağlantı ve Kozmik Yankı",
      pos: { x: 42.0, y: 3.2, z: -62.0 },
      icon: "🌊",
      color: 0x06b6d4
    },
    {
      id: 'scroll_celestial_tree',
      scrollNumber: 4,
      title: "Göksel Hayat Ağacı ve Bulut Geçitleri",
      pos: { x: -5.0, y: 19.2, z: -45.0 },
      icon: "☁️",
      color: 0xa855f7
    },
    {
      id: 'scroll_healing_springs',
      scrollNumber: 5,
      title: "Şifalı Bal Pınarları & Bahçeler",
      pos: { x: 68.0, y: 1.85, z: -18.0 },
      icon: "🌸",
      color: 0xf43f5e
    },
    {
      id: 'scroll_underground_prophecy',
      scrollNumber: 6,
      title: "Kadim Yeraltı Kehaneti ve Gelecek Uyarı",
      pos: { x: -14.0, y: 4.2, z: -110.0 },
      icon: "⛰️",
      color: 0xea580c
    }
  ];

  // Helper: Register solid collider
  function addSolidBox(minX, minY, minZ, maxX, maxY, maxZ, isClimbable = false) {
    const col = {
      min: new window.THREE.Vector3(minX, minY, minZ),
      max: new window.THREE.Vector3(maxX, maxY, maxZ),
      isToxic: false,
      isIce: false,
      isClimbable: isClimbable
    };
    expansionColliders.push(col);

    const game = window.__superBearGame;
    if (game && game.currentLevel && game.currentLevel.colliders) {
      game.currentLevel.colliders.push(col);
    }
    return col;
  }

  // --- 3D CREATURE MESH BUILDERS ---

  // 1. Bilge Baykuş (Owl)
  function createOwlMesh(THREE) {
    const group = new THREE.Group();
    const brownMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
    const featherMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.5 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.1, emissive: 0xca8a04, emissiveIntensity: 0.4 });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x09090b });
    const beakMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.3 });

    // Feet / Claws
    const clawMat = new THREE.MeshStandardMaterial({ color: 0x451a03 });
    [-0.2, 0.2].forEach(cx => {
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.35), clawMat);
      foot.position.set(cx, 0.05, 0.05);
      group.add(foot);
    });

    // Body
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 1.0, 12), brownMat);
    body.position.y = 0.6;
    group.add(body);

    // Breast feathers
    const chest = new THREE.Mesh(new THREE.SphereGeometry(0.35, 10, 10), whiteMat);
    chest.scale.set(0.8, 1.1, 0.4);
    chest.position.set(0, 0.6, 0.26);
    group.add(chest);

    // Head Group (rotates)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.25, 0);
    headGroup.name = 'owl_head';

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 14, 14), brownMat);
    headGroup.add(head);

    // Feather Tufts / Horns
    [-0.22, 0.22].forEach(tx => {
      const tuft = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.35, 6), featherMat);
      tuft.position.set(tx, 0.45, 0);
      tuft.rotation.z = tx < 0 ? -0.3 : 0.3;
      headGroup.add(tuft);
    });

    // Big Eyes
    [-0.18, 0.18].forEach(ex => {
      const eyeRing = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.05, 12), whiteMat);
      eyeRing.rotation.x = Math.PI / 2;
      eyeRing.position.set(ex, 0.05, 0.35);
      headGroup.add(eyeRing);

      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), eyeMat);
      eye.position.set(ex, 0.05, 0.38);
      headGroup.add(eye);

      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), pupilMat);
      pupil.position.set(ex, 0.05, 0.46);
      headGroup.add(pupil);
    });

    // Beak
    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.25, 8), beakMat);
    beak.rotation.x = -Math.PI / 2;
    beak.position.set(0, -0.05, 0.46);
    headGroup.add(beak);

    // Scholar Hat / Monocle
    const hatBase = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.06, 12), new THREE.MeshStandardMaterial({ color: 0x1e1b4b }));
    hatBase.position.set(0, 0.42, 0);
    headGroup.add(hatBase);
    const hatTop = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.04, 0.55), new THREE.MeshStandardMaterial({ color: 0x312e81 }));
    hatTop.position.set(0, 0.46, 0);
    headGroup.add(hatTop);

    group.add(headGroup);

    // Wings
    [-0.45, 0.45].forEach(wx => {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.8, 0.5), featherMat);
      wing.position.set(wx, 0.65, 0);
      wing.rotation.z = wx < 0 ? 0.2 : -0.2;
      group.add(wing);
    });

    return group;
  }

  // 2. Su Samuru (Otter)
  function createOtterMesh(THREE) {
    const group = new THREE.Group();
    const furMat = new THREE.MeshStandardMaterial({ color: 0x5c2b08, roughness: 0.6 });
    const bellyMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.7 });
    const noseMat = new THREE.MeshStandardMaterial({ color: 0x09090b });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x0284c7 });

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 1.2, 12), furMat);
    body.rotation.x = Math.PI / 2.8;
    body.position.set(0, 0.35, 0);
    group.add(body);

    const belly = new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 10), bellyMat);
    belly.scale.set(0.8, 1.3, 0.4);
    belly.position.set(0, 0.35, 0.18);
    group.add(belly);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), furMat);
    head.position.set(0, 0.75, 0.38);
    group.add(head);

    const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), bellyMat);
    muzzle.position.set(0, 0.68, 0.58);
    group.add(muzzle);

    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), noseMat);
    nose.position.set(0, 0.72, 0.68);
    group.add(nose);

    [-0.12, 0.12].forEach(ex => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), eyeMat);
      eye.position.set(ex, 0.8, 0.58);
      group.add(eye);

      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), furMat);
      ear.position.set(ex * 1.8, 0.9, 0.35);
      group.add(ear);
    });

    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.8, 8), furMat);
    tail.rotation.x = -Math.PI / 2.2;
    tail.position.set(0, 0.15, -0.65);
    group.add(tail);

    return group;
  }

  // 3. Şifacı Kaplumbağa (Wise Healer Turtle)
  function createTurtleMesh(THREE) {
    const group = new THREE.Group();
    const shellMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0x84cc16, roughness: 0.7 });
    const herbMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.3, emissive: 0x16a34a, emissiveIntensity: 0.5 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x09090b });

    // Giant Shell
    const shell = new THREE.Mesh(new THREE.SphereGeometry(0.85, 14, 14, 0, Math.PI * 2, 0, Math.PI / 2), shellMat);
    shell.position.y = 0.35;
    shell.scale.set(1.2, 0.9, 1.4);
    group.add(shell);

    // Bottom plastron
    const plastron = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.15, 12), new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.7 }));
    plastron.scale.set(1.15, 1.0, 1.35);
    plastron.position.y = 0.35;
    group.add(plastron);

    // Head
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.55, 1.25);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 10, 10), skinMat);
    head.scale.set(0.9, 0.8, 1.2);
    headGroup.add(head);

    // Healer Herb / Flower on Head
    const herb = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), herbMat);
    herb.position.set(0, 0.3, 0);
    headGroup.add(herb);

    [-0.14, 0.14].forEach(ex => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), eyeMat);
      eye.position.set(ex, 0.12, 0.28);
      headGroup.add(eye);
    });
    group.add(headGroup);

    // 4 Flippers / Legs
    [[-0.8, 0.7], [0.8, 0.7], [-0.75, -0.7], [0.75, -0.7]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), skinMat);
      leg.scale.set(1.2, 0.5, 1.5);
      leg.position.set(lx, 0.2, lz);
      group.add(leg);
    });

    return group;
  }

  // 4. Minik Yavru Kedi (Playful Kitten)
  function createKittenMesh(THREE, colorHex = 0xf97316) {
    const group = new THREE.Group();
    const furMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.5 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, emissive: 0x0284c7, emissiveIntensity: 0.3 });
    const noseMat = new THREE.MeshStandardMaterial({ color: 0xf472b6 });

    // Body
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), furMat);
    body.position.y = 0.38;
    body.scale.set(0.9, 0.85, 1.2);
    group.add(body);

    const chest = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 10), whiteMat);
    chest.position.set(0, 0.36, 0.25);
    group.add(chest);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 12), furMat);
    head.position.set(0, 0.65, 0.35);
    group.add(head);

    // Ears
    [-0.16, 0.16].forEach(ex => {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.25, 6), furMat);
      ear.position.set(ex, 0.9, 0.32);
      ear.rotation.z = ex < 0 ? 0.25 : -0.25;
      group.add(ear);
    });

    // Eyes & Nose
    [-0.12, 0.12].forEach(ex => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), eyeMat);
      eye.position.set(ex, 0.68, 0.6);
      group.add(eye);
    });

    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), noseMat);
    nose.position.set(0, 0.62, 0.64);
    group.add(nose);

    // Tail (Wags)
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, 0.45, -0.38);
    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.5, 6), furMat);
    tail.rotation.x = 0.8;
    tailGroup.add(tail);
    tailGroup.name = 'kitten_tail';
    group.add(tailGroup);

    return group;
  }

  // 5. Gözcü Şahin (Sky Hawk Scout)
  function createHawkMesh(THREE) {
    const group = new THREE.Group();
    const featherMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.7 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
    const beakMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.2 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.6 });

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 0.9, 10), featherMat);
    body.position.y = 0.6;
    group.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 10, 10), whiteMat);
    head.position.set(0, 1.1, 0.1);
    group.add(head);

    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.28, 6), beakMat);
    beak.rotation.x = -Math.PI / 2.2;
    beak.position.set(0, 1.05, 0.38);
    group.add(beak);

    [-0.14, 0.14].forEach(ex => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), eyeMat);
      eye.position.set(ex, 1.15, 0.32);
      group.add(eye);
    });

    // Wings
    const wingL = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 0.5), featherMat);
    wingL.position.set(-0.7, 0.8, 0);
    wingL.name = 'hawk_wing_l';
    group.add(wingL);

    const wingR = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 0.5), featherMat);
    wingR.position.set(0.7, 0.8, 0);
    wingR.name = 'hawk_wing_r';
    group.add(wingR);

    return group;
  }

  // 6. Sadık Çiftlik Köpeği (Farm Puppy)
  function createPuppyMesh(THREE) {
    const group = new THREE.Group();
    const furMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.5 });
    const noseMat = new THREE.MeshBasicMaterial({ color: 0x09090b });
    const collarMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.5 });

    // Body
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 0.9, 10), furMat);
    body.rotation.x = Math.PI / 2;
    body.position.set(0, 0.5, 0);
    group.add(body);

    // 4 Paws
    [[-0.25, 0.3], [0.25, 0.3], [-0.25, -0.3], [0.25, -0.3]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.45, 8), furMat);
      leg.position.set(lx, 0.22, lz);
      group.add(leg);
      const paw = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), whiteMat);
      paw.scale.set(1.0, 0.5, 1.3);
      paw.position.set(lx, 0.08, lz + 0.05);
      group.add(paw);
    });

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), furMat);
    head.position.set(0, 0.85, 0.45);
    group.add(head);

    const muzzle = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.22, 0.3), whiteMat);
    muzzle.position.set(0, 0.78, 0.7);
    group.add(muzzle);

    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), noseMat);
    nose.position.set(0, 0.86, 0.86);
    group.add(nose);

    // Droopy Ears
    [-0.32, 0.32].forEach(ex => {
      const ear = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.4, 0.18), darkMat);
      ear.position.set(ex, 0.8, 0.4);
      ear.rotation.z = ex < 0 ? -0.3 : 0.3;
      group.add(ear);
    });

    // Collar
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.06, 8, 16), collarMat);
    collar.rotation.x = Math.PI / 2;
    collar.position.set(0, 0.65, 0.32);
    group.add(collar);

    // Tail (Wags)
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, 0.6, -0.45);
    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.5, 6), furMat);
    tail.rotation.x = -0.9;
    tailGroup.add(tail);
    tailGroup.name = 'dog_tail';
    group.add(tailGroup);

    return group;
  }

  // 7. 3D Glowing Lore Scroll Pedestal
  function createLoreScrollMesh(THREE, scrollDef) {
    const group = new THREE.Group();
    group.position.set(scrollDef.pos.x, scrollDef.pos.y, scrollDef.pos.z);
    group.name = `lore_scroll_${scrollDef.id}`;

    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8, roughness: 0.2 });
    const parchmentMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.4, emissive: 0xd97706, emissiveIntensity: 0.3 });
    const glowMat = new THREE.MeshBasicMaterial({ color: scrollDef.color });

    // Pedestal Base
    const base1 = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.9, 0.3, 16), stoneMat);
    base1.position.y = 0.15;
    group.add(base1);

    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 0.8, 12), stoneMat);
    pillar.position.y = 0.65;
    group.add(pillar);

    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.08, 8, 16), goldMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 1.05;
    group.add(rim);

    // Floating Rotating Scroll Group
    const scrollGroup = new THREE.Group();
    scrollGroup.position.y = 1.45;
    scrollGroup.name = 'floating_scroll';

    // Rolled parchment cylinder
    const parchment = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.75, 12), parchmentMat);
    parchment.rotation.z = Math.PI / 2;
    scrollGroup.add(parchment);

    // Golden Ribbon
    const ribbon = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.15, 12), goldMat);
    ribbon.rotation.z = Math.PI / 2;
    scrollGroup.add(ribbon);

    // Sparkle Energy Orb
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), glowMat);
    orb.position.y = 0.45;
    scrollGroup.add(orb);

    group.add(scrollGroup);

    // Solid base collider for pedestal
    addSolidBox(scrollDef.pos.x - 0.75, scrollDef.pos.y, scrollDef.pos.z - 0.75, scrollDef.pos.x + 0.75, scrollDef.pos.y + 1.1, scrollDef.pos.z + 0.75);

    return group;
  }

  // =========================================================================
  // MASTER BUILD FUNCTION FOR EXPANDED VILLAGE
  // =========================================================================
  function buildVillageExpansion(scene) {
    const THREE = window.THREE;
    if (!THREE) return;

    if (villageExpansionGroup) {
      scene.remove(villageExpansionGroup);
    }

    villageExpansionGroup = new THREE.Group();
    villageExpansionGroup.name = 'expanded_kedi_koyu_master';
    scene.add(villageExpansionGroup);

    if (typeof window.spaceObjects !== 'undefined' && Array.isArray(window.spaceObjects)) {
      window.spaceObjects.push(villageExpansionGroup);
    }

    // Reset tracking lists
    expansionColliders = [];
    friendlyCreatures = [];
    storyScrolls = [];
    secretPassages = [];
    bouncingKittens = [];

    const grassMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.85 });
    const darkGrassMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.9 });
    const stoneCobbleMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
    const darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.8 });
    const roofRedMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.6 });
    const waterMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, transparent: true, opacity: 0.88 });
    const crystalMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.7, roughness: 0.2 });
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, transparent: true, opacity: 0.92, emissive: 0xfef08a, emissiveIntensity: 0.15 });

    // -------------------------------------------------------------------------
    // 1. GRAND CENTRAL PLAZA & MONUMENT OF EXPANDING LANDS (Kadim Köy Meydanı)
    // -------------------------------------------------------------------------
    console.log("🏛️ Building Central Plaza & Monolith of Expansion...");

    // Plaza Cobblestone Platform (Solid Floor: x: -35 to 35, z: -35 to 15, y: 0.05)
    const plazaFloor = new THREE.Mesh(new THREE.BoxGeometry(60, 0.3, 50), stoneCobbleMat);
    plazaFloor.position.set(0, 0.0, -10);
    plazaFloor.receiveShadow = true;
    villageExpansionGroup.add(plazaFloor);
    addSolidBox(-30, -0.5, -35, 30, 0.15, 15);

    // Ancient Monolith of Expansion at x: 0, z: -14
    const monolithGroup = new THREE.Group();
    monolithGroup.position.set(0, 0.15, -14);

    const monoBase = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 4.0, 0.8, 16), stoneCobbleMat);
    monoBase.position.y = 0.4;
    monolithGroup.add(monoBase);
    addSolidBox(-3.6, 0.0, -17.6, 3.6, 0.9, -10.4);

    const monoSpire = new THREE.Mesh(new THREE.BoxGeometry(2.0, 7.5, 2.0), darkWoodMat);
    monoSpire.position.y = 4.2;
    monolithGroup.add(monoSpire);
    addSolidBox(-1.1, 0.8, -15.1, 1.1, 8.0, -12.9);

    const crystalCore = new THREE.Mesh(new THREE.OctahedronGeometry(1.2), crystalMat);
    crystalCore.position.y = 8.6;
    crystalCore.name = 'expansion_crystal_core';
    monolithGroup.add(crystalCore);

    // Inscribed Lore Plaque on Monolith Face
    const plaqueMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8, roughness: 0.3 });
    const plaque = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.2, 0.1), plaqueMat);
    plaque.position.set(0, 3.8, 1.05);
    monolithGroup.add(plaque);

    villageExpansionGroup.add(monolithGroup);

    // -------------------------------------------------------------------------
    // 2. VILLAGE MYSTERY NPCS (People Asking: "Neden bu kadar büyüdü bu köy?")
    // -------------------------------------------------------------------------
    console.log("🐱 Populating Village Mystery NPCs...");

    // A) Köy Muhtarı Tekir 🐱 (Plaza, x: 5, z: -8)
    const muhtarMesh = createFoxMesh(THREE);
    muhtarMesh.position.set(5.5, 0.15, -8.0);
    muhtarMesh.rotation.y = -1.2;
    muhtarMesh.name = 'npc_muhtar_tekir';
    villageExpansionGroup.add(muhtarMesh);
    friendlyCreatures.push({
      id: 'npc_muhtar_tekir',
      name: 'Köy Muhtarı Tekir 🐱',
      role: 'Köy Lideri',
      avatarIcon: '🐱',
      mesh: muhtarMesh,
      pos: muhtarMesh.position,
      dialogue: [
        "Gözlerime inanamıyorum cesur ayı! Birkaç gün önce ufacık bir tepeydi burası...",
        "Neden bu kadar büyüdü Ayı Kedi Köyü? Topraklar her şafakta kendi kendine genişliyor!",
        "Köylüler heyecan ve şaşkınlık içinde! Meydandaki Kadim Monolit'i incele, gerçeği orada fısıldıyorlar!"
      ]
    });

    // B) Bilge Kedi Dedesi 🧙‍♂️ (Plaza Monolith, x: -5, z: -10)
    const dedeMesh = createBunnyMesh(THREE);
    dedeMesh.position.set(-5.5, 0.15, -10.0);
    dedeMesh.rotation.y = 1.0;
    dedeMesh.name = 'npc_bilge_dede';
    villageExpansionGroup.add(dedeMesh);
    friendlyCreatures.push({
      id: 'npc_bilge_dede',
      name: 'Bilge Kedi Dedesi 🧙‍♂️',
      role: 'Kadim Bilgin',
      avatarIcon: '🧙‍♂️',
      mesh: dedeMesh,
      pos: dedeMesh.position,
      dialogue: [
        "Efsaneler der ki; Kahraman Ayı evrendeki boyutların karanlığını temizledikçe, Ayı-Kedi Kalbi uyanır!",
        "Köyümüz işte bu yüzden durmaksızın büyüyor! Her kurtarılan dost toprağımıza bereket katar.",
        "Köyün 4 gizli geçidinde saklanan 6 kutsal parşömeni topla ve tüm hikayeyi tamamla!"
      ]
    });

    // C) Çiftçi Kedi Sarman 🌾 (West Farm, x: -48, z: 5)
    const sarmanMesh = createFoxMesh(THREE);
    sarmanMesh.position.set(-48.0, 0.8, 5.0);
    sarmanMesh.rotation.y = 0.5;
    sarmanMesh.name = 'npc_ciftci_sarman';
    villageExpansionGroup.add(sarmanMesh);
    friendlyCreatures.push({
      id: 'npc_ciftci_sarman',
      name: 'Çiftçi Kedi Sarman 🌾',
      role: 'Baş Çiftçi',
      avatarIcon: '🌾',
      mesh: sarmanMesh,
      pos: sarmanMesh.position,
      dialogue: [
        "Tarlalarımız dün gece iki katına çıktı! Bal petekleri dolup taşıyor!",
        "Değirmenin altındaki gizli mahzene baktın mı? Orada dedelerimizin sakladığı kadim bir parşömen var!",
        "Yere bastığında sağlam duruyorsun değil mi? Köyümüzün her karış toprağı sapasağlamdır!"
      ]
    });

    // -------------------------------------------------------------------------
    // 3. DOĞU SAKURA VE KEDİ BAHÇELERİ (East Blossom Gardens & Sanctuary)
    // -------------------------------------------------------------------------
    console.log("🌸 Building East Blossom Gardens...");

    // East Grassy Plateau (Solid Floor: x: 38 to 110, z: -40 to 35, y: 1.5)
    const eastPlat = new THREE.Mesh(new THREE.BoxGeometry(72, 1.8, 75), grassMat);
    eastPlat.position.set(74, 0.6, -2);
    eastPlat.receiveShadow = true;
    villageExpansionGroup.add(eastPlat);
    addSolidBox(38, -0.5, -40, 110, 1.5, 35);

    // Stone Steps connecting Plaza to East Plateau (x: 34 to 40, z: -10 to -2)
    for (let s = 0; s < 4; s++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(2, 0.4, 8), stoneCobbleMat);
      step.position.set(32 + s * 1.8, 0.2 + s * 0.35, -6);
      villageExpansionGroup.add(step);
      addSolidBox(31 + s * 1.8, 0.0, -10, 33 + s * 1.8, 0.4 + s * 0.35, -2);
    }

    // Sakura Trees in East Garden
    const sakuraLeafMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.6 });
    [[55, -25], [78, -30], [92, -10], [65, 18], [88, 22]].forEach(([sx, sz]) => {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 3.5, 8), darkWoodMat);
      trunk.position.set(sx, 3.25, sz);
      villageExpansionGroup.add(trunk);
      addSolidBox(sx - 0.6, 1.5, sz - 0.6, sx + 0.6, 5.0, sz + 0.6);

      const foliage = new THREE.Mesh(new THREE.SphereGeometry(2.6, 12, 12), sakuraLeafMat);
      foliage.scale.set(1.4, 0.9, 1.4);
      foliage.position.set(sx, 5.8, sz);
      villageExpansionGroup.add(foliage);
    });

    // Japanese Wooden Gazebo (x: 82, z: -18, y: 1.5)
    const gazeboBase = new THREE.Mesh(new THREE.BoxGeometry(10, 0.4, 10), woodMat);
    gazeboBase.position.set(82, 1.7, -18);
    villageExpansionGroup.add(gazeboBase);
    addSolidBox(77, 1.5, -23, 87, 1.9, -13);

    // 4 Gazebo Pillars
    [[-4, -4], [4, -4], [-4, 4], [4, 4]].forEach(([gx, gz]) => {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 4.0, 8), darkWoodMat);
      pillar.position.set(82 + gx, 3.7, -18 + gz);
      villageExpansionGroup.add(pillar);
      addSolidBox(82 + gx - 0.3, 1.7, -18 + gz - 0.3, 82 + gx + 0.3, 5.7, -18 + gz + 0.3);
    });

    // Gazebo Roof
    const gazeboRoof = new THREE.Mesh(new THREE.ConeGeometry(7.5, 2.5, 4), roofRedMat);
    gazeboRoof.rotation.y = Math.PI / 4;
    gazeboRoof.position.set(82, 6.8, -18);
    villageExpansionGroup.add(gazeboRoof);

    // Koi Lotus Spring Pond (x: 65, z: 5, y: 1.5)
    const pondMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, transparent: true, opacity: 0.85 });
    const lotusPond = new THREE.Mesh(new THREE.CylinderGeometry(7, 7, 0.4, 20), pondMat);
    lotusPond.position.set(65, 1.45, 5);
    villageExpansionGroup.add(lotusPond);

    // Playful Kittens in East Garden 🐾
    const kittenMia = createKittenMesh(THREE, 0xf97316);
    kittenMia.position.set(60, 1.5, -12);
    kittenMia.rotation.y = 0.6;
    villageExpansionGroup.add(kittenMia);
    bouncingKittens.push(kittenMia);
    friendlyCreatures.push({
      id: 'npc_kitten_mia',
      name: 'Yavru Kedi Mia 🐾',
      role: 'Neşeli Kedicik',
      avatarIcon: '🐱',
      mesh: kittenMia,
      pos: kittenMia.position,
      dialogue: [
        "Miyav miyav! Çiçeklerin arasında koşmak harika!",
        "Köyümüz her gün büyüyor! Daha çok koşacak alan var!",
        "Su samuru Fındık gölette harika taklalar atıyor, gördün mü?"
      ]
    });

    const kittenPamuk = createKittenMesh(THREE, 0xf8fafc);
    kittenPamuk.position.set(86, 1.9, -15);
    kittenPamuk.rotation.y = -1.2;
    villageExpansionGroup.add(kittenPamuk);
    bouncingKittens.push(kittenPamuk);

    // Swimming Otter in Lotus Pond 🦦
    swimmingOtter = createOtterMesh(THREE);
    swimmingOtter.position.set(65, 1.4, 5);
    villageExpansionGroup.add(swimmingOtter);
    friendlyCreatures.push({
      id: 'npc_otter_findik',
      name: 'Su Samuru Fındık 🦦',
      role: 'Gölet Dansçısı',
      avatarIcon: '🦦',
      mesh: swimmingOtter,
      pos: swimmingOtter.position,
      dialogue: [
        "Cıvık cıvık! Nehir ve gölet suları göksel şifa dolu!",
        "Köy genişledikçe nehrimiz de berraklaştı ve yeni şelaleler doğdu!",
        "Şelalenin arkasındaki gizli mağarayı keşfettin mi? Orada bilge baykuş bekliyor!"
      ]
    });

    // -------------------------------------------------------------------------
    // 4. BATI DEĞİRMENİ VE ALTIN HASAT ÇİFTLİĞİ (West Farm & Giant Windmill)
    // -------------------------------------------------------------------------
    console.log("🌾 Building West Harvest Farm & Rotating Windmill...");

    // West Farm Plateau (Solid Floor: x: -40 to -115, z: -35 to 45, y: 0.8)
    const westPlat = new THREE.Mesh(new THREE.BoxGeometry(75, 1.6, 80), darkGrassMat);
    westPlat.position.set(-77.5, 0.0, 5);
    westPlat.receiveShadow = true;
    villageExpansionGroup.add(westPlat);
    addSolidBox(-115, -0.5, -35, -40, 0.8, 45);

    // Giant 3D Windmill at x: -75, z: 12
    const windmillGroup = new THREE.Group();
    windmillGroup.position.set(-75, 0.8, 12);

    // Tower Body (Hollow with climbable ramp)
    const wmBase = new THREE.Mesh(new THREE.CylinderGeometry(5.0, 6.5, 12, 16), stoneCobbleMat);
    wmBase.position.y = 6.0;
    windmillGroup.add(wmBase);
    addSolidBox(-81, 0.8, 6, -69, 12.8, 18);

    // Upper Overlook Deck (Solid platform at y: 12.8)
    const wmDeck = new THREE.Mesh(new THREE.CylinderGeometry(6.5, 6.5, 0.5, 16), woodMat);
    wmDeck.position.y = 12.0;
    windmillGroup.add(wmDeck);
    addSolidBox(-81.5, 12.0, 5.5, -68.5, 13.0, 18.5);

    // Cap Roof
    const wmRoof = new THREE.Mesh(new THREE.ConeGeometry(5.5, 4.0, 8), roofRedMat);
    wmRoof.position.y = 14.5;
    windmillGroup.add(wmRoof);

    // Rotating Blades Group
    windmillBlades = new THREE.Group();
    windmillBlades.position.set(0, 11.5, 5.2);

    const bladeHub = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.6, 12), darkWoodMat);
    bladeHub.rotation.x = Math.PI / 2;
    windmillBlades.add(bladeHub);

    for (let b = 0; b < 4; b++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(1.2, 9.0, 0.1), woodMat);
      blade.position.set(0, 0, 0);
      blade.rotation.z = (b * Math.PI) / 2;
      windmillBlades.add(blade);
    }
    windmillGroup.add(windmillBlades);

    villageExpansionGroup.add(windmillGroup);

    // GİZLİ GEÇİT 1: Değirmen Altı Gizli Mahzeni (Subterranean Honey Vault at y: -3.5)
    console.log("🗝️ Building Secret Passage 1 (Windmill Subterranean Vault)...");
    const vaultFloor = new THREE.Mesh(new THREE.BoxGeometry(18, 0.4, 18), stoneCobbleMat);
    vaultFloor.position.set(-75, -3.7, 12);
    villageExpansionGroup.add(vaultFloor);
    addSolidBox(-84, -4.0, 3, -66, -3.5, 21);

    // Secret Hatch Door Indicator (Glowing blue glyph on ground near windmill)
    const hatchGlow = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.1, 12), crystalMat);
    hatchGlow.position.set(-75, 0.85, 20);
    villageExpansionGroup.add(hatchGlow);

    secretPassages.push({
      id: 'passage_windmill_vault',
      name: "Değirmen Altı Gizli Mahzeni",
      triggerPos: { x: -75, y: 0.8, z: 20 },
      targetPos: { x: -75, y: -3.3, z: 12 },
      exitPos: { x: -75, y: 1.2, z: 22 },
      radius: 2.5
    });

    // Wise Healer Turtle Tonton (West Farm, x: -60, z: 28) 🐢
    healingTurtle = createTurtleMesh(THREE);
    healingTurtle.position.set(-60, 0.8, 28);
    healingTurtle.rotation.y = 2.4;
    villageExpansionGroup.add(healingTurtle);
    friendlyCreatures.push({
      id: 'npc_turtle_tonton',
      name: 'Şifacı Kaplumbağa Tonton 🐢',
      role: 'Kadim Şifacı',
      avatarIcon: '🐢',
      mesh: healingTurtle,
      pos: healingTurtle.position,
      dialogue: [
        "Aheste aheste selam kahraman ayı... Yüz yıldır bu pınarların başındayım.",
        "Köyümüzün bu kadar büyümesi bir mucize değil; senin kazandığın her zafer toprağa can veriyor!",
        "Yaraların mı var? İşte sana şifalı bal suyu! Canın tamamen yenilendi!"
      ],
      onInteract: () => {
        const game = window.__superBearGame;
        if (game && game.stats) {
          game.stats.currentHp = game.stats.maxHp;
          if (game.callbacks && game.callbacks.onStatsUpdate) game.callbacks.onStatsUpdate(game.stats);
          if (game.callbacks && game.callbacks.onShowNotice) {
            game.callbacks.onShowNotice("💚 Şifacı Kaplumbağa Tonton seni kutsadı! Canın %100 dolduruldu!", "success");
          }
          if (game.spawnSparkleParticles) game.spawnSparkleParticles(game.playerPos, 25, 0x22c55e);
        }
      }
    });

    // Faithful Dog Çakıl (Farm cottage, x: -85, z: -15) 🐶
    const puppyCakil = createPuppyMesh(THREE);
    puppyCakil.position.set(-85, 0.8, -15);
    puppyCakil.rotation.y = 1.2;
    villageExpansionGroup.add(puppyCakil);
    friendlyCreatures.push({
      id: 'npc_puppy_cakil',
      name: 'Sadık Çiftlik Köpeği Çakıl 🐶',
      role: 'Çiftlik Muhafızı',
      avatarIcon: '🐶',
      mesh: puppyCakil,
      pos: puppyCakil.position,
      dialogue: [
        "Hav hav hav! Çiftliğe hoş geldin koca dostum!",
        "Değirmenin arkasındaki altın kabakları gördün mü? Hepsi dev gibi oldu!",
        "Köy büyüdükçe koşacak harika yeni tarlalarımız oldu hav hav!"
      ]
    });

    // -------------------------------------------------------------------------
    // 5. GİZEMLİ ŞELALE VE KRİSTAL GROTTO GEÇİDİ (Mystic Waterfall & Grotto)
    // -------------------------------------------------------------------------
    console.log("🌊 Building Mystic Waterfall & Secret Grotto Passage...");

    // Waterfall Rock Facade (x: 25 to 55, z: -50 to -70, y: 0 to 14)
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 });
    const wfRock = new THREE.Mesh(new THREE.BoxGeometry(30, 14, 20), rockMat);
    wfRock.position.set(40, 7.0, -60);
    villageExpansionGroup.add(wfRock);
    addSolidBox(25, 0.0, -70, 55, 14.0, -50);

    // Cascading Rushing Water Curtain
    const wfWater = new THREE.Mesh(new THREE.BoxGeometry(10, 12, 0.4), waterMat);
    wfWater.position.set(40, 6.0, -49.6);
    wfWater.name = 'waterfall_cascade';
    villageExpansionGroup.add(wfWater);

    // GİZLİ GEÇİT 2: Şelale Arkası Yosunlu Tünel (Stepping Stones at y: 2.5)
    // Stepping stones behind waterfall leading inside
    for (let st = 0; st < 5; st++) {
      const stone = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 0.5, 10), stoneCobbleMat);
      stone.position.set(32 + st * 4, 2.5, -52 - st * 2.5);
      villageExpansionGroup.add(stone);
      addSolidBox(30.5 + st * 4, 0.0, -54 - st * 2.5, 33.5 + st * 4, 2.8, -50 - st * 2.5);
    }

    // High Mountain Lookout Balcony (x: 48, z: -62, y: 8.0)
    const balcony = new THREE.Mesh(new THREE.BoxGeometry(12, 0.6, 12), stoneCobbleMat);
    balcony.position.set(48, 8.0, -62);
    villageExpansionGroup.add(balcony);
    addSolidBox(42, 7.5, -68, 54, 8.3, -56);

    // Wise Owl Scholar Bilgin perched on balcony 🦉
    const owlBilgin = createOwlMesh(THREE);
    owlBilgin.position.set(48, 8.3, -62);
    owlBilgin.rotation.y = -2.2;
    villageExpansionGroup.add(owlBilgin);
    friendlyCreatures.push({
      id: 'npc_owl_bilgin',
      name: 'Bilge Baykuş Bilgin 🦉',
      role: 'Tarihçi & Gözlemci',
      avatarIcon: '🦉',
      mesh: owlBilgin,
      pos: owlBilgin.position,
      dialogue: [
        "Huuu huuu! Şelalenin gizli geçidinden geçerek buraya kadar gelebilen cesur ayı!",
        "Buradan bakınca tüm köyün sınırlarının nasıl genişlediğini görebiliyor musun?",
        "Doğu bahçelerinden batı değirmenine kadar uzanan bu topraklar, boyutların birleştiği kutsal merkezdir!"
      ]
    });

    secretPassages.push({
      id: 'passage_waterfall_grotto',
      name: "Şelale Arkası Kristal Grotto",
      triggerPos: { x: 38, y: 2.5, z: -48 },
      targetPos: { x: 48, y: 8.5, z: -62 },
      exitPos: { x: 38, y: 2.8, z: -46 },
      radius: 3.0
    });

    // -------------------------------------------------------------------------
    // 6. GÖKSEL HAYAT AĞACI VE BULUT GEÇİTLERİ (Celestial Sky Tree & Cloud Walkway)
    // -------------------------------------------------------------------------
    console.log("☁️ Building Celestial Tree of Life & Cloud Walkway...");

    // Giant Tree Trunk at x: -5, z: -25 rising to y: 14
    const treeTrunk = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 5.0, 15, 16), darkWoodMat);
    treeTrunk.position.set(-5, 7.5, -25);
    villageExpansionGroup.add(treeTrunk);
    addSolidBox(-9, 0.0, -29, -1, 15.0, -21);

    // Spiral Wooden Walkway wrapping tree trunk
    for (let sw = 0; sw < 6; sw++) {
      const ang = sw * 0.9;
      const wx = -5 + Math.cos(ang) * 4.5;
      const wz = -25 + Math.sin(ang) * 4.5;
      const wy = 2.0 + sw * 2.0;
      const plank = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.3, 3.0), woodMat);
      plank.position.set(wx, wy, wz);
      plank.rotation.y = -ang;
      villageExpansionGroup.add(plank);
      addSolidBox(wx - 1.8, 0.0, wz - 1.8, wx + 1.8, wy + 0.3, wz + 1.8);
    }

    // Super Jump Pad at top of Tree (x: -5, y: 14.2, z: -21)
    const treeJumpPad = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.3, 12), crystalMat);
    treeJumpPad.position.set(-5, 14.1, -21);
    villageExpansionGroup.add(treeJumpPad);
    addSolidBox(-6.8, 13.5, -22.8, -3.2, 14.3, -19.2);

    // GİZLİ GEÇİT 3: 5 Solid Puffy Cloud Stepping Platforms up to Sky Observatory
    const cloudPositions = [
      { x: -5, y: 15.5, z: -27 },
      { x: -5, y: 16.5, z: -32 },
      { x: -5, y: 17.5, z: -37 },
      { x: -5, y: 18.2, z: -41 },
      { x: -5, y: 18.8, z: -45 }
    ];

    cloudPositions.forEach((cp, idx) => {
      const cloud = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.8, 0.8, 14), cloudMat);
      cloud.position.set(cp.x, cp.y, cp.z);
      villageExpansionGroup.add(cloud);
      addSolidBox(cp.x - 3.5, cp.y - 0.2, cp.z - 3.5, cp.x + 3.5, cp.y + 0.5, cp.z + 3.5);
    });

    // Sky Observatory Dome at x: -5, y: 18.8, z: -45
    const obsDeck = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 5.5, 0.6, 16), woodMat);
    obsDeck.position.set(-5, 18.8, -45);
    villageExpansionGroup.add(obsDeck);
    addSolidBox(-10.5, 18.0, -50.5, 0.5, 19.2, -39.5);

    // Golden Telescope
    const teleBase = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 1.4, 8), stoneCobbleMat);
    teleBase.position.set(-5, 19.8, -43);
    villageExpansionGroup.add(teleBase);

    const teleScope = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 2.2, 8), new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9 }));
    teleScope.rotation.x = 0.5;
    teleScope.position.set(-5, 20.6, -43);
    villageExpansionGroup.add(teleScope);

    // Sky Hawk Scout perched on observatory railing 🦅
    skyHawk = createHawkMesh(THREE);
    skyHawk.position.set(-5, 19.3, -48);
    skyHawk.rotation.y = Math.PI;
    villageExpansionGroup.add(skyHawk);
    friendlyCreatures.push({
      id: 'npc_hawk_ruzgar',
      name: 'Gözcü Şahin Rüzgar 🦅',
      role: 'Gökyüzü Muhafızı',
      avatarIcon: '🦅',
      mesh: skyHawk,
      pos: skyHawk.position,
      dialogue: [
        "Viyyyy! Gökyüzünün en yüksek zirvesine hoş geldin kahraman dostum!",
        "Teleskoptan baktığımda 15 Dünya'nın, Poneix ve Phelix gezegenlerinin köyümüze nasıl bağlandığını görüyorum!",
        "Göklerdeki bu sağlam bulutlar üzerinde yürüyebilmek harika değil mi? Hikaye parşömenini almayı unutma!"
      ]
    });

    secretPassages.push({
      id: 'passage_celestial_clouds',
      name: "Göksel Ağaç & Bulut Gözlemevi",
      triggerPos: { x: -5, y: 14.2, z: -21 },
      targetPos: { x: -5, y: 19.2, z: -45 },
      exitPos: { x: -5, y: 2.0, z: -18 },
      radius: 2.5
    });

    // -------------------------------------------------------------------------
    // 7. SPAWN ALL 6 STORY SCROLLS (Gizli Hikaye Parşömenleri)
    // -------------------------------------------------------------------------
    console.log("📜 Spawning 6 Interactive Story Scrolls across Expanded Village...");
    SCROLL_LOCATIONS.forEach(scrollDef => {
      const scrollMesh = createLoreScrollMesh(THREE, scrollDef);
      villageExpansionGroup.add(scrollMesh);
      storyScrolls.push({
        ...scrollDef,
        mesh: scrollMesh
      });
    });

    console.log(`✅ Ayı Kedi Köyü successfully expanded! ${expansionColliders.length} solid colliders, ${friendlyCreatures.length} friendly NPCs, 4 secret passages and 6 story scrolls ready.`);
  }

  // =========================================================================
  // FRAME UPDATE LOOP (Solid Footing, Animations, Proximity & Interactions)
  // =========================================================================
  function updateVillageExpansionEngine() {
    const game = window.__superBearGame;
    if (!game || !game.playerPos) return;

    const isHub = (!game.currentRegion || game.currentRegion === 'hub');
    if (villageExpansionGroup) {
      villageExpansionGroup.visible = isHub;
    }

    if (!isHub) return;

    const pPos = game.playerPos;
    const now = Date.now();

    // 1. Windmill Blades Rotation
    if (windmillBlades) {
      windmillBlades.rotation.z += 0.015;
    }

    // 2. Crystal Core & Floating Scrolls Spin Animation
    if (villageExpansionGroup) {
      const core = villageExpansionGroup.getObjectByName('expansion_crystal_core');
      if (core) {
        core.rotation.y += 0.02;
        core.rotation.x = Math.sin(now * 0.002) * 0.2;
        core.position.y = 8.6 + Math.sin(now * 0.003) * 0.25;
      }

      storyScrolls.forEach(s => {
        const sc = s.mesh.getObjectByName('floating_scroll');
        if (sc) {
          sc.rotation.y += 0.025;
          sc.position.y = 1.45 + Math.sin(now * 0.003 + s.scrollNumber) * 0.12;
        }
      });
    }

    // 3. Animal Animations (Kittens Bouncing, Otter Swimming, Hawk Wing Flap)
    bouncingKittens.forEach((k, idx) => {
      k.position.y = (idx === 0 ? 1.5 : 1.9) + Math.abs(Math.sin(now * 0.006 + idx * 2)) * 0.35;
      const tail = k.getObjectByName('kitten_tail');
      if (tail) tail.rotation.z = Math.sin(now * 0.01 + idx) * 0.4;
    });

    if (swimmingOtter) {
      const otAng = now * 0.0018;
      swimmingOtter.position.x = 65 + Math.cos(otAng) * 4.2;
      swimmingOtter.position.z = 5 + Math.sin(otAng) * 4.2;
      swimmingOtter.rotation.y = -otAng + Math.PI / 2;
      swimmingOtter.position.y = 1.4 + Math.sin(now * 0.005) * 0.2;
    }

    if (skyHawk) {
      const wL = skyHawk.getObjectByName('hawk_wing_l');
      const wR = skyHawk.getObjectByName('hawk_wing_r');
      if (wL) wL.rotation.z = Math.sin(now * 0.008) * 0.25;
      if (wR) wR.rotation.z = -Math.sin(now * 0.008) * 0.25;
    }

    // 4. Tree Jump Pad Launch (Launches to sky clouds)
    const dTreePad = Math.sqrt(Math.pow(pPos.x - (-5), 2) + Math.pow(pPos.z - (-21), 2));
    if (dTreePad < 2.0 && pPos.y >= 13.5 && pPos.y <= 15.0) {
      if (game.playerVel) {
        game.playerVel.y = 14.0;
        game.playerVel.z = -6.0;
      }
      if (typeof window.St !== 'undefined' && window.St.playJumpPad) window.St.playJumpPad();
      if (game.callbacks && game.callbacks.onShowNotice && now % 2500 < 50) {
        game.callbacks.onShowNotice("☁️ Göksel Zıplama Tahtası! Bulut yollarına fırlatıldın!", "success");
      }
    }

    // 5. BULLETPROOF SOLID FOOTING / GROUND COLLISION RESOLVER (1. Kural: Yerlere Değince Ayakta Kalma)
    for (let i = 0; i < expansionColliders.length; i++) {
      const c = expansionColliders[i];
      if (!c || !c.min || !c.max) continue;

      const pRadius = 0.55;
      if (pPos.x >= c.min.x - pRadius && pPos.x <= c.max.x + pRadius &&
          pPos.z >= c.min.z - pRadius && pPos.z <= c.max.z + pRadius) {
        
        // Solid Floor Landing
        const wasAbove = pPos.y >= c.max.y - 0.7;
        const isFalling = (!game.playerVel || game.playerVel.y <= 0.5);
        if (isFalling && wasAbove && pPos.y <= c.max.y + 0.8) {
          pPos.y = c.max.y;
          if (game.playerVel) game.playerVel.y = 0;
          game.isGrounded = true;
          game.jumpCount = 0;
          break;
        }
      }
    }

    // 6. STORY SCROLL PROXIMITY & INTERACTION CHECK
    let nearScroll = null;
    storyScrolls.forEach(s => {
      const d = Math.sqrt(Math.pow(pPos.x - s.pos.x, 2) + Math.pow(pPos.z - s.pos.z, 2));
      if (d < 3.2 && Math.abs(pPos.y - s.pos.y) < 3.0) {
        nearScroll = s;
      }
    });

    if (nearScroll) {
      if (game.callbacks && game.callbacks.onProximityChange) {
        game.callbacks.onProximityChange({
          type: "lore_scroll",
          name: `📜 [E] "${nearScroll.title}" Oku`,
          scrollId: nearScroll.id
        });
      }
      if (game.inputs && game.inputs.attack && !game.prevAttackKey) {
        window.dispatchEvent(new CustomEvent('superbear:open-lore-scroll', { detail: { scrollId: nearScroll.id } }));
      }
    }

    // 7. FRIENDLY NPCS PROXIMITY & MYSTERY TALK
    friendlyCreatures.forEach(npc => {
      const d = Math.sqrt(Math.pow(pPos.x - npc.pos.x, 2) + Math.pow(pPos.z - npc.pos.z, 2));
      if (d < 4.5 && Math.abs(pPos.y - npc.pos.y) < 2.5) {
        if (game.callbacks && game.callbacks.onShowNotice && now % 3500 < 50) {
          game.callbacks.onShowNotice(`💬 ${npc.name}: '${npc.dialogue[0]}'`, "info");
          if (npc.onInteract && typeof npc.onInteract === 'function') {
            npc.onInteract();
          }
        }
      }
    });
  }

  // Hook into game initialization and region loading
  window.addEventListener('superbear:game-ready', () => {
    const game = window.__superBearGame;
    if (game && game.scene) {
      buildVillageExpansion(game.scene);
    }
  });

  // Re-build when transitioning to Hub
  window.addEventListener('superbear:region-change', (e) => {
    const detail = e.detail;
    if (!detail || detail.region === 'hub') {
      const game = window.__superBearGame;
      if (game && game.scene) {
        buildVillageExpansion(game.scene);
      }
    }
  });

  // Continuous animation loop tick
  function tick() {
    try {
      updateVillageExpansionEngine();
    } catch (e) {
      console.warn("Village expansion tick error:", e);
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Keydown listener for [E] / interact key
  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;
    if (e.code === 'KeyE' || e.key === 'e' || e.key === 'E') {
      const game = window.__superBearGame;
      if (game && game.playerPos) {
        const pPos = game.playerPos;
        storyScrolls.forEach(s => {
          const d = Math.sqrt(Math.pow(pPos.x - s.pos.x, 2) + Math.pow(pPos.z - s.pos.z, 2));
          if (d < 3.5 && Math.abs(pPos.y - s.pos.y) < 3.0) {
            window.dispatchEvent(new CustomEvent('superbear:open-lore-scroll', { detail: { scrollId: s.id } }));
          }
        });
      }
    }
  });

  // Export to window
  window.__buildVillageExpansion = buildVillageExpansion;
  window.__updateVillageExpansionEngine = updateVillageExpansionEngine;

})();
