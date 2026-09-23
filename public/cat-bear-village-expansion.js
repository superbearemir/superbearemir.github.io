/**
 * ============================================================================
 * GRIZZY'NİN BÜYÜK MACERASI - BÜYÜTÜLEN AYI KEDİ KÖYÜ (GRAND HUB EXPANSION)
 * ============================================================================
 * Özellikler:
 * 1. Zemin ve Çarpışma Desteği: Yerlere değince kusursuz ayakta kalma ve dik duruş fiziği.
 * 2. Devasa Köy Genişlemesi:
 *    - Doğu Sakura Tepeleri & Gökyüzü Seyir Balkonu (Doğu Bölgesi)
 *    - Kuzey Kadim Hayat Ağacı & Spiral Oyuk Kovuk Tüneli (Kuzey Bölgesi)
 *    - Batı Kristal Kedi Tapınağı & Gizli Şelale Mabedi (Batı Bölgesi)
 *    - Güney Nilüfer Su Kordonu, Balıkçı İskelesi & Yel Değirmeni (Güney Bölgesi)
 *    - Arkeolog Kedi Miyase & Mimar Ayı Kazım Atölyeleri
 * 3. Dost Canlıları (Friendly Interactive Creatures):
 *    - 🦉 Bilge Puhu Kuşu Pofu
 *    - 🦔 Minik Kirpi Pıtırcık
 *    - 🐱‍👤 Mistik Işık Kedisi Lunaris
 *    - 🦦 Nehir Samuru Neşeli Çapkın
 *    - 🦌 Altın Boynuzlu Orman Geyiği
 *    - 🦋 Uçuşan Parlak Orman Kelebekleri
 * 4. "Neden Bu Kadar Büyüdü Bu Köy?" Hikaye & Merak Diyalogları
 * 5. 5 Adet Gizli Antik Hikaye Parşömeni & İnteraktif Okuyucu
 * ============================================================================
 */

(function () {
  'use strict';

  console.log("🌸 Loading Ayı Kedi Köyü Grand Expansion Module...");

  let activeExpansionGroup = null;
  let activeRegion = null;
  let customColliders = [];
  let interactiveScrolls = [];
  let animatedCreatures = [];
  let butterflyParticles = [];
  let readScrolls = {};

  // Read saved scrolls from localStorage
  try {
    const saved = localStorage.getItem('superbear_read_lore_scrolls');
    if (saved) readScrolls = JSON.parse(saved);
  } catch (e) {
    readScrolls = {};
  }

  // ==========================================================================
  // 1. 5 ADET GİZLİ ANTİK HİKAYE PARŞÖMENİ METİNLERİ
  // ==========================================================================
  const LORE_SCROLLS = [
    {
      id: "scroll_mystery_growth",
      title: "📜 Kadim Parşömen I: Kutsal Toprağın Uyanışı ve Köyün Büyümesi",
      location: "Kadim Hayat Ağacı Zirvesi",
      icon: "🌳",
      pos: { x: -45, y: 22.5, z: -35 },
      rewardCoins: 100,
      rewardHoney: 5,
      rewardXp: 150,
      pages: [
        "Kadim yazıtta şöyle der: 'Ayı Kedi Köyü sıradan bir vadi değildir. Bu toprakların derinliklerinde, bin yıldır uyuyan Kadim Bal Kristali Çekirdeği yatar.'",
        "'Grizzy evrendeki maceralara atıldıkça ve portalları açtıkça, kadim çekirdek uyandı ve saf doğa enerjisi toprağı sardı. Köy bir gecede göğe yükselen ulu ağaçlarla, kristal şelalelerle ve sakura korularıyla genişledi.'",
        "'Köylüler şaşkınlıkla 'Neden bu kadar büyüdük?' diye sorarken, bilgelik şunu fısıldar: Gerçek dostluk ve cesaret her zaman çevresini bereketle büyütür!'"
      ]
    },
    {
      id: "scroll_ancient_alliance",
      title: "📜 Kadim Parşömen II: Ayı ve Kedi İttifakının Ebedi Yemini",
      location: "Batı Kristal Mabedi - Şelale Arkası",
      icon: "🐱",
      pos: { x: -62, y: 5.2, z: 12 },
      rewardCoins: 100,
      rewardHoney: 5,
      rewardXp: 150,
      pages: [
        "'Bin yıl önce karanlık gölgeler ormanı tehdit ettiğinde, Yüce Ayı Klanı ile Çevik Kedi Muhafızları bu kutsal şelalenin ardında bir araya geldi.'",
        "'Ayıların sarsılmaz gücü ve Kedilerin keskin zekası birleştiğinde, karanlık defedildi ve bu vadi ebedi barışın yuvası ilan edildi.'",
        "'Bu mabetteki mavi kristaller, iki türün ebedi dostluğunun ve birbirlerine verdikleri koruma sözünün sönmeyen ışığıdır.'"
      ]
    },
    {
      id: "scroll_cosmic_prophecy",
      title: "📜 Kadim Parşömen III: Kozmik İblis ve Yıldız Portalları Kehaneti",
      location: "Doğu Sakura Seyir Balkonu",
      icon: "🌸",
      pos: { x: 55, y: 24.2, z: -25 },
      rewardCoins: 100,
      rewardHoney: 5,
      rewardXp: 150,
      pages: [
        "'Gökyüzü yıldızlarla kaplıyken gök kubbeden bir ses yankılandı: Uzayın derinliklerindeki Kozmik İmparator, gezegenlerin tatlı nektarını ve ballarını çalmak için harekete geçecek.'",
        "'Fakat cesur kalpli altın ayıcık, dostlarının desteğiyle 15 dünyayı, uzay boyutlarını ve Poneix/Phelix gezegenlerini aşarak karanlığı yenecektir.'",
        "'Bu seyir kulesinden göğe bakan her göz, evrenin koruyucusunun ayak seslerini duyar!'"
      ]
    },
    {
      id: "scroll_guardian_creatures",
      title: "📜 Kadim Parşömen IV: Kutsal Vadi Canlıları ve Doğa Bağı",
      location: "Güney Nilüfer Kordonu Su Çarkı",
      icon: "🦦",
      pos: { x: -18, y: 3.5, z: 48 },
      rewardCoins: 100,
      rewardHoney: 5,
      rewardXp: 150,
      pages: [
        "'Vadinin bereketli sularında yaşayan Nehir Samurları, ağaç dallarında tüneyen Bilge Puhu Kuşları ve korularda dolaşan Altın Geyikler sıradan hayvanlar değildir.'",
        "'Onlar doğanın canlı rehberleridir. Kalbinde kötülük taşımayan her yolcuya yol gösterir, neşeli şarkılarıyla yorgunluğu alırlar.'",
        "'Onlara sevgiyle yaklaşan her ayı, sonsuz doğa koruması ve şifa ile ödüllendirilir.'"
      ]
    },
    {
      id: "scroll_architect_dream",
      title: "📜 Kadim Parşömen V: Mimar Kazım'ın Büyük Köy Vizyonu",
      location: "Arkeolog Miyase & Mimar Kazım Köşkü",
      icon: "🏛️",
      pos: { x: 38, y: 4.8, z: 25 },
      rewardCoins: 100,
      rewardHoney: 5,
      rewardXp: 150,
      pages: [
        "'Mimar Ayı Kazım'ın günlüğünden: 'Her sabah uyandığımda köyün yeni bir sokağa, yeni bir köprüye kavuştuğunu görüyorum.'",
        "'Bu sadece ahşap ve taştan ibaret değil; burası tüm hayvan dostlarımızın şarkılar söylediği, voleybol oynadığı, barış içinde yaşadığı bir sığınak.'",
        "'Ayı Kedi Köyü sonsuza dek yaşamaya ve tüm yorgun kahramanlara sıcak bir kucak açmaya devam edecek!'"
      ]
    }
  ];

  // ==========================================================================
  // 2. HELPER TO REGISTER LEVEL COLLIDERS (SOLID GROUND & WALLS)
  // ==========================================================================
  function registerCollider(game, minX, minY, minZ, maxX, maxY, maxZ, options = {}) {
    const THREE = window.THREE;
    if (!THREE || !game || !game.currentLevel) return;

    if (!game.currentLevel.colliders) game.currentLevel.colliders = [];
    if (!game.currentLevel.collisionBounds) game.currentLevel.collisionBounds = [];

    const collider = {
      min: new THREE.Vector3(minX, minY, minZ),
      max: new THREE.Vector3(maxX, maxY, maxZ),
      isGround: options.isGround !== false,
      isClimbable: !!options.climbable,
      isIce: !!options.isIce,
      isToxic: !!options.isToxic,
      isExpansionCollider: true
    };

    game.currentLevel.colliders.push(collider);
    customColliders.push(collider);
    return collider;
  }

  // ==========================================================================
  // 3. MASTER BUILD EXPANDED VILLAGE FUNCTION
  // ==========================================================================
  function buildGrandVillageExpansion(game) {
    const THREE = window.THREE;
    if (!THREE || !game || !game.scene) return;

    console.log("🏰 Building Grand Ayı Kedi Köyü (Highlands, Hollow World Tree, Crystal Shrine, Boardwalks & Friendly Fauna)...");

    // Clean previous if any
    if (activeExpansionGroup && activeExpansionGroup.parent) {
      activeExpansionGroup.parent.remove(activeExpansionGroup);
    }
    activeExpansionGroup = new THREE.Group();
    activeExpansionGroup.name = 'grand_village_expansion_master';
    game.scene.add(activeExpansionGroup);

    // Clean colliders
    if (game.currentLevel && game.currentLevel.colliders) {
      game.currentLevel.colliders = game.currentLevel.colliders.filter(c => !c.isExpansionCollider);
    }
    customColliders = [];
    interactiveScrolls = [];
    animatedCreatures = [];
    butterflyParticles = [];

    // Base materials
    const grassMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.8 });
    const darkGrassMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.85 });
    const sakuraPinkMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.6 });
    const sakuraDeepMat = new THREE.MeshStandardMaterial({ color: 0xdb2777, roughness: 0.65 });
    const woodPlankMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.75 });
    const lightWoodMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.7 });
    const darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.85 });
    const stoneBrickMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8, metalness: 0.1 });
    const whiteMarbleMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.4 });
    const crystalMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.3, emissive: 0x0284c7, emissiveIntensity: 0.6 });
    const amethystMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.15, metalness: 0.4, emissive: 0x7e22ce, emissiveIntensity: 0.7 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.2, metalness: 0.85, emissive: 0xb45309, emissiveIntensity: 0.3 });
    const glowingRuneMat = new THREE.MeshStandardMaterial({ color: 0x67e8f9, emissive: 0x06b6d4, emissiveIntensity: 0.9 });
    const waterMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.1, transparent: true, opacity: 0.85, metalness: 0.2 });
    const ropeMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.9 });
    const roofRedMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.6 });
    const roofBlueMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.6 });

    // ------------------------------------------------------------------------
    // A) BÜYÜTÜLEN KÖY TEMEL TOPRAK VE TEPELERİ (EXPANDED SOLID TERRAIN)
    // ------------------------------------------------------------------------
    // East Highlands Base
    const eastHill = new THREE.Mesh(new THREE.BoxGeometry(70, 4, 70), grassMat);
    eastHill.position.set(55, 1.8, -25);
    eastHill.receiveShadow = true;
    activeExpansionGroup.add(eastHill);
    registerCollider(game, 20, 0, -60, 90, 3.8, 10);

    // East Higher Terrace
    const eastTerrace = new THREE.Mesh(new THREE.BoxGeometry(45, 6, 45), darkGrassMat);
    eastTerrace.position.set(60, 6.5, -28);
    eastTerrace.receiveShadow = true;
    activeExpansionGroup.add(eastTerrace);
    registerCollider(game, 37.5, 3.8, -50.5, 82.5, 9.5, -5.5);

    // Northwest Highlands Base (Under Ancient World Tree)
    const nwHill = new THREE.Mesh(new THREE.BoxGeometry(60, 4, 60), grassMat);
    nwHill.position.set(-45, 1.8, -35);
    nwHill.receiveShadow = true;
    activeExpansionGroup.add(nwHill);
    registerCollider(game, -75, 0, -65, -15, 3.8, -5);

    // Southwest Sanctuary Plateau
    const swPlateau = new THREE.Mesh(new THREE.BoxGeometry(50, 3.5, 50), grassMat);
    swPlateau.position.set(-50, 1.5, 20);
    swPlateau.receiveShadow = true;
    activeExpansionGroup.add(swPlateau);
    registerCollider(game, -75, 0, -5, -25, 3.25, 45);

    // South River Basin Expansion
    const southMeadow = new THREE.Mesh(new THREE.BoxGeometry(90, 2, 50), grassMat);
    southMeadow.position.set(0, 0.8, 50);
    southMeadow.receiveShadow = true;
    activeExpansionGroup.add(southMeadow);
    registerCollider(game, -45, 0, 25, 45, 1.8, 75);

    // ------------------------------------------------------------------------
    // B) DOĞU SAKURA BAHÇELERİ & GÖKYÜZÜ SEYİR KULESİ (EAST SAKURA SKY TOWER)
    // ------------------------------------------------------------------------
    // Sakura Trees in East Garden
    const sakuraCoords = [
      { x: 42, z: -10, s: 1.2 }, { x: 50, z: -8, s: 1.4 }, { x: 68, z: -12, s: 1.1 },
      { x: 40, z: -38, s: 1.3 }, { x: 74, z: -35, s: 1.5 }, { x: 52, z: -48, s: 1.3 },
      { x: 65, z: -45, s: 1.2 }
    ];

    sakuraCoords.forEach((coord, idx) => {
      const treeGrp = new THREE.Group();
      treeGrp.position.set(coord.x, 3.8, coord.z);
      treeGrp.scale.set(coord.s, coord.s, coord.s);

      // Trunk
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.55, 4.5, 8), darkWoodMat);
      trunk.position.y = 2.25;
      trunk.castShadow = true;
      treeGrp.add(trunk);

      // Sakura Foliage Spheres
      const crown1 = new THREE.Mesh(new THREE.SphereGeometry(2.4, 10, 10), idx % 2 === 0 ? sakuraPinkMat : sakuraDeepMat);
      crown1.position.set(0, 4.8, 0);
      treeGrp.add(crown1);

      const crown2 = new THREE.Mesh(new THREE.SphereGeometry(1.6, 8, 8), sakuraPinkMat);
      crown2.position.set(-1.2, 4.2, 0.8);
      treeGrp.add(crown2);

      const crown3 = new THREE.Mesh(new THREE.SphereGeometry(1.8, 8, 8), sakuraPinkMat);
      crown3.position.set(1.1, 4.5, -0.7);
      treeGrp.add(crown3);

      activeExpansionGroup.add(treeGrp);
      registerCollider(game, coord.x - 0.6, 3.8, coord.z - 0.6, coord.x + 0.6, 7.8, coord.z + 0.6);
    });

    // Tall Pagoda Sky Tower (Spiral Stairs to Summit)
    const towerX = 55, towerZ = -25;
    const towerGrp = new THREE.Group();
    towerGrp.position.set(towerX, 9.5, towerZ);

    // Base Stone Pillars
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const px = Math.cos(angle) * 5;
      const pz = Math.sin(angle) * 5;
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(1.2, 16, 1.2), stoneBrickMat);
      pillar.position.set(px, 8, pz);
      towerGrp.add(pillar);
    }

    // Floors at Y=5, Y=10, Y=15
    [5, 10, 15].forEach((fy, fIdx) => {
      const floor = new THREE.Mesh(new THREE.BoxGeometry(11 - fIdx * 1.5, 0.6, 11 - fIdx * 1.5), woodPlankMat);
      floor.position.y = fy;
      floor.receiveShadow = true;
      towerGrp.add(floor);

      const worldY = 9.5 + fy;
      const sz = (11 - fIdx * 1.5) / 2;
      registerCollider(game, towerX - sz, worldY - 0.3, towerZ - sz, towerX + sz, worldY + 0.4, towerZ + sz);

      // Roof rim
      const roof = new THREE.Mesh(new THREE.ConeGeometry(9 - fIdx * 1.5, 1.8, 4), roofRedMat);
      roof.position.y = fy + 3.8;
      roof.rotation.y = Math.PI / 4;
      towerGrp.add(roof);
    });

    // Climbable Spiral Wood Steps around the Pagoda
    for (let step = 0; step < 24; step++) {
      const angle = step * 0.45;
      const rad = 4.2;
      const stepY = step * 0.62;
      const stepMesh = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.3, 1.2), lightWoodMat);
      stepMesh.position.set(Math.cos(angle) * rad, stepY, Math.sin(angle) * rad);
      stepMesh.rotation.y = -angle + Math.PI / 2;
      towerGrp.add(stepMesh);

      const worldStepY = 9.5 + stepY;
      const worldStepX = towerX + Math.cos(angle) * rad;
      const worldStepZ = towerZ + Math.sin(angle) * rad;
      registerCollider(game, worldStepX - 1.1, worldStepY - 0.2, worldStepZ - 1.1, worldStepX + 1.1, worldStepY + 0.35, worldStepZ + 1.1);
    }

    // Summit Sky Balcony Trampoline
    const summitJumpPad = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 0.4, 16), crystalMat);
    summitJumpPad.position.set(0, 15.3, 0);
    towerGrp.add(summitJumpPad);

    activeExpansionGroup.add(towerGrp);

    // ------------------------------------------------------------------------
    // C) KUZEY KADİM HAYAT AĞACI & OYUK KOVUK TÜNELİ (HOLLOW WORLD TREE)
    // ------------------------------------------------------------------------
    const treeX = -45, treeZ = -35;
    const worldTreeGrp = new THREE.Group();
    worldTreeGrp.position.set(treeX, 3.8, treeZ);

    // Giant Hollow Trunk (Inner cylinder cutout feel)
    const trunkGeo = new THREE.CylinderGeometry(4.8, 6.5, 24, 16, 1, true);
    const trunkMesh = new THREE.Mesh(trunkGeo, darkWoodMat);
    trunkMesh.position.y = 12;
    trunkMesh.castShadow = true;
    worldTreeGrp.add(trunkMesh);

    // Tree Core Solid Floor at Ground
    const treeFloor = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.5, 0.8, 16), grassMat);
    treeFloor.position.y = 0.4;
    worldTreeGrp.add(treeFloor);
    registerCollider(game, treeX - 4.5, 3.8, treeZ - 4.5, treeX + 4.5, 4.6, treeZ + 4.5);

    // Spiral Wooden Trunk Ramp inside the Tree to Sky Canopy
    for (let s = 0; s < 28; s++) {
      const angle = s * 0.35;
      const rad = 3.6;
      const stepY = s * 0.65;
      const step = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.35, 1.4), lightWoodMat);
      step.position.set(Math.cos(angle) * rad, stepY + 0.5, Math.sin(angle) * rad);
      step.rotation.y = -angle + Math.PI / 2;
      worldTreeGrp.add(step);

      const worldSY = 3.8 + stepY + 0.5;
      const worldSX = treeX + Math.cos(angle) * rad;
      const worldSZ = treeZ + Math.sin(angle) * rad;
      registerCollider(game, worldSX - 1.0, worldSY - 0.2, worldSZ - 1.0, worldSX + 1.0, worldSY + 0.4, worldSZ + 1.0);
    }

    // Top Sky Canopy Terrace
    const canopyPlatform = new THREE.Mesh(new THREE.CylinderGeometry(9.0, 8.5, 1.2, 20), woodPlankMat);
    canopyPlatform.position.y = 18.5;
    canopyPlatform.receiveShadow = true;
    worldTreeGrp.add(canopyPlatform);
    registerCollider(game, treeX - 8.5, 3.8 + 18.0, treeZ - 8.5, treeX + 8.5, 3.8 + 19.5, treeZ + 8.5);

    // Lush Emerald Foliage Clouds on Top
    const foliage1 = new THREE.Mesh(new THREE.SphereGeometry(7.5, 14, 14), grassMat);
    foliage1.position.set(0, 24, 0);
    worldTreeGrp.add(foliage1);

    const foliage2 = new THREE.Mesh(new THREE.SphereGeometry(5.5, 12, 12), darkGrassMat);
    foliage2.position.set(-4, 22, 3);
    worldTreeGrp.add(foliage2);

    const foliage3 = new THREE.Mesh(new THREE.SphereGeometry(5.8, 12, 12), grassMat);
    foliage3.position.set(4, 23, -3);
    worldTreeGrp.add(foliage3);

    // Ancient Luminescent Honey Lanterns hanging from branches
    for (let l = 0; l < 5; l++) {
      const ang = (l / 5) * Math.PI * 2;
      const lantern = new THREE.Mesh(new THREE.DodecahedronGeometry(0.7), crystalMat);
      lantern.position.set(Math.cos(ang) * 7.5, 17.5, Math.sin(ang) * 7.5);
      worldTreeGrp.add(lantern);
    }

    activeExpansionGroup.add(worldTreeGrp);

    // ------------------------------------------------------------------------
    // D) BATI KRİSTAL KEDİ TAPINAĞI & ŞELALE GİZLİ MABEDİ (CRYSTAL CAT SHRINE)
    // ------------------------------------------------------------------------
    const shrineX = -60, shrineZ = 15;
    const shrineGrp = new THREE.Group();
    shrineGrp.position.set(shrineX, 3.25, shrineZ);

    // Temple Marble Base
    const shrineBase = new THREE.Mesh(new THREE.BoxGeometry(22, 1.2, 26), whiteMarbleMat);
    shrineBase.position.y = 0.6;
    shrineBase.receiveShadow = true;
    shrineGrp.add(shrineBase);
    registerCollider(game, shrineX - 11, 3.25, shrineZ - 13, shrineX + 11, 4.45, shrineZ + 13);

    // Temple Arched Cat Pillars & Cat Ears Roof
    for (let side = -1; side <= 1; side += 2) {
      for (let zOff = -8; zOff <= 8; zOff += 8) {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.75, 7.5, 12), whiteMarbleMat);
        pillar.position.set(side * 8.5, 4.35, zOff);
        shrineGrp.add(pillar);
      }
    }

    // Temple Pediment with Cat Face Relief
    const templeRoof = new THREE.Mesh(new THREE.BoxGeometry(20, 1.2, 24), whiteMarbleMat);
    templeRoof.position.y = 8.6;
    shrineGrp.add(templeRoof);

    // Giant Cat Ears on Temple Roof
    const earL = new THREE.Mesh(new THREE.ConeGeometry(2.5, 4.5, 4), whiteMarbleMat);
    earL.position.set(-6, 11.2, 6);
    earL.rotation.y = Math.PI / 4;
    shrineGrp.add(earL);

    const earR = new THREE.Mesh(new THREE.ConeGeometry(2.5, 4.5, 4), whiteMarbleMat);
    earR.position.set(6, 11.2, 6);
    earR.rotation.y = Math.PI / 4;
    shrineGrp.add(earR);

    // Golden Cat Altar & Glowing Amethyst Spire in Center
    const altar = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.5, 1.8, 16), goldMat);
    altar.position.set(0, 1.5, -4);
    shrineGrp.add(altar);

    const amethystSpire = new THREE.Mesh(new THREE.OctahedronGeometry(1.4), amethystMat);
    amethystSpire.position.set(0, 3.4, -4);
    amethystSpire.name = 'shrine_amethyst_crystal';
    shrineGrp.add(amethystSpire);

    // Secret Room Behind Water Curtain in Shrine
    const waterCurtain = new THREE.Mesh(new THREE.PlaneGeometry(8, 7.5), waterMat);
    waterCurtain.position.set(0, 4.35, -12);
    waterCurtain.rotation.y = Math.PI;
    shrineGrp.add(waterCurtain);

    // Hidden Grotto Behind Water Curtain
    const secretRoom = new THREE.Mesh(new THREE.BoxGeometry(14, 0.8, 10), stoneBrickMat);
    secretRoom.position.set(0, 0.4, -17);
    shrineGrp.add(secretRoom);
    registerCollider(game, shrineX - 7, 3.25, shrineZ - 22, shrineX + 7, 4.45, shrineZ - 12);

    // Secret Golden Chest in the Grotto
    const goldenChest = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.2, 1.2), goldMat);
    goldenChest.position.set(0, 1.4, -18);
    shrineGrp.add(goldenChest);

    activeExpansionGroup.add(shrineGrp);

    // ------------------------------------------------------------------------
    // E) GÜNEY NİLÜFER SU KORDONU & DÖNEN YEL DEĞİRMENİ (WATERWAYS & WINDMILL)
    // ------------------------------------------------------------------------
    // Boardwalk along River
    const boardwalkX = -10, boardwalkZ = 45;
    const boardwalk = new THREE.Mesh(new THREE.BoxGeometry(75, 0.6, 6), woodPlankMat);
    boardwalk.position.set(boardwalkX, 1.9, boardwalkZ);
    boardwalk.receiveShadow = true;
    activeExpansionGroup.add(boardwalk);
    registerCollider(game, boardwalkX - 37.5, 0, boardwalkZ - 3, boardwalkX + 37.5, 2.2, boardwalkZ + 3);

    // Giant Bouncing Lily Pads across the River
    const lilyPadCoords = [
      { x: -28, z: 28 }, { x: -14, z: 24 }, { x: 0, z: 28 }, { x: 14, z: 24 }, { x: 28, z: 28 }
    ];

    lilyPadCoords.forEach((lp, idx) => {
      const lily = new THREE.Group();
      lily.position.set(lp.x, 0.25, lp.z);
      lily.name = `lily_pad_${idx}`;

      const pad = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 0.3, 16), darkGrassMat);
      pad.receiveShadow = true;
      lily.add(pad);

      const flower = new THREE.Mesh(new THREE.DodecahedronGeometry(0.6), sakuraPinkMat);
      flower.position.set(0.8, 0.35, 0.8);
      lily.add(flower);

      activeExpansionGroup.add(lily);
      registerCollider(game, lp.x - 2.2, 0, lp.z - 2.2, lp.x + 2.2, 0.55, lp.z + 2.2);
    });

    // Turning Windmill (Yel Değirmeni)
    const windmillX = -32, windmillZ = 52;
    const windmillGrp = new THREE.Group();
    windmillGrp.position.set(windmillX, 1.8, windmillZ);

    // Windmill Body
    const wmBody = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 4.5, 14, 12), whiteMarbleMat);
    wmBody.position.y = 7;
    wmBody.castShadow = true;
    windmillGrp.add(wmBody);
    registerCollider(game, windmillX - 4.5, 1.8, windmillZ - 4.5, windmillX + 4.5, 16.0, windmillZ + 4.5);

    // Conical Roof
    const wmRoof = new THREE.Mesh(new THREE.ConeGeometry(4.8, 4, 12), roofBlueMat);
    wmRoof.position.y = 16;
    windmillGrp.add(wmRoof);

    // Rotating Blades Hub
    const bladeHub = new THREE.Group();
    bladeHub.position.set(0, 12.5, 3.6);
    bladeHub.name = 'windmill_blades_group';

    const hubCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.6, 8), darkWoodMat);
    hubCenter.rotation.x = Math.PI / 2;
    bladeHub.add(hubCenter);

    for (let b = 0; b < 4; b++) {
      const bladeArm = new THREE.Group();
      bladeArm.rotation.z = (b / 4) * Math.PI * 2;

      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.3, 8.5, 0.2), lightWoodMat);
      arm.position.y = 4.25;
      bladeArm.add(arm);

      const sail = new THREE.Mesh(new THREE.BoxGeometry(1.6, 6.5, 0.05), whiteMarbleMat);
      sail.position.set(0.9, 4.8, 0.05);
      bladeArm.add(sail);

      bladeHub.add(bladeArm);
    }

    windmillGrp.add(bladeHub);
    activeExpansionGroup.add(windmillGrp);

    // ------------------------------------------------------------------------
    // F) YENİ KÖY EVLERİ (ARKEOLOG MİYASE & MİMAR KAZIM ATÖLYELERİ)
    // ------------------------------------------------------------------------
    // 1. Arkeolog Kedi Miyase'nin Antika Evi (x: 36, z: 22)
    const houseMiyase = buildCottageHouse(THREE, {
      x: 36, y: 1.8, z: 22,
      w: 12, h: 7, d: 10,
      wallColor: 0xfef3c7,
      roofColor: 0x0284c7,
      label: "Arkeolog Kedi Miyase Antika Köşkü"
    }, game);
    activeExpansionGroup.add(houseMiyase);

    // 2. Mimar Ayı Kazım'ın Çizim & Heykel Atölyesi (x: 18, z: -42)
    const houseKazim = buildCottageHouse(THREE, {
      x: 18, y: 3.8, z: -42,
      w: 14, h: 7.5, d: 11,
      wallColor: 0xffedd5,
      roofColor: 0xd97706,
      label: "Mimar Ayı Kazım Mimari Atölyesi"
    }, game);
    activeExpansionGroup.add(houseKazim);

    // ------------------------------------------------------------------------
    // G) DOST CANLILARI (FRIENDLY INTERACTIVE CREATURES)
    // ------------------------------------------------------------------------
    spawnFriendlyFauna(THREE, activeExpansionGroup, game);

    // ------------------------------------------------------------------------
    // H) 5 ADET GİZLİ ANTİK PARŞÖMEN VE DİYALOG TETİKLEYİCİLERİ
    // ------------------------------------------------------------------------
    spawnLoreScrolls(THREE, activeExpansionGroup, game);

    console.log("✅ Grand Ayı Kedi Köyü successfully constructed with all wonders!");
  }

  // ==========================================================================
  // HELPER: BUILD ENTERABLE COTTAGE HOUSE WITH REAL COLLIDERS
  // ==========================================================================
  function buildCottageHouse(THREE, cfg, game) {
    const group = new THREE.Group();
    group.position.set(cfg.x, cfg.y, cfg.z);

    const wallMat = new THREE.MeshStandardMaterial({ color: cfg.wallColor, roughness: 0.8 });
    const roofMat = new THREE.MeshStandardMaterial({ color: cfg.roofColor, roughness: 0.6 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.85 });

    // Stone Foundation
    const foundation = new THREE.Mesh(new THREE.BoxGeometry(cfg.w, 0.6, cfg.d), stoneMat);
    foundation.position.y = 0.3;
    foundation.receiveShadow = true;
    group.add(foundation);

    // Walls
    const walls = new THREE.Mesh(new THREE.BoxGeometry(cfg.w - 0.4, cfg.h - 1, cfg.d - 0.4), wallMat);
    walls.position.y = (cfg.h - 1) / 2 + 0.6;
    walls.castShadow = true;
    walls.receiveShadow = true;
    group.add(walls);

    // Peaked Roof
    const roof = new THREE.Mesh(new THREE.ConeGeometry(Math.max(cfg.w, cfg.d) * 0.78, 3.8, 4), roofMat);
    roof.position.y = cfg.h + 1.6;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    group.add(roof);

    // Door Frame
    const door = new THREE.Mesh(new THREE.BoxGeometry(2.4, 4.2, 0.4), woodMat);
    door.position.set(0, 2.4, cfg.d / 2);
    group.add(door);

    // Lantern above door
    const lantern = new THREE.Mesh(new THREE.OctahedronGeometry(0.4), new THREE.MeshStandardMaterial({ color: 0xfde047, emissive: 0xf59e0b, emissiveIntensity: 0.8 }));
    lantern.position.set(0, 4.8, cfg.d / 2 + 0.4);
    group.add(lantern);

    // Register Solid House Colliders
    registerCollider(
      game,
      cfg.x - cfg.w / 2, cfg.y, cfg.z - cfg.d / 2,
      cfg.x + cfg.w / 2, cfg.y + cfg.h + 3.0, cfg.z + cfg.d / 2
    );

    return group;
  }

  // ==========================================================================
  // SPAWN FRIENDLY CREATURES (DOST CANLILARI)
  // ==========================================================================
  function spawnFriendlyFauna(THREE, group, game) {
    // 1. Bilge Puhu Kuşu Pofu 🦉 (Hayat Ağacı Dalında)
    const owlGrp = new THREE.Group();
    owlGrp.position.set(-42, 22.8, -32);
    owlGrp.name = 'creature_owl_pofu';

    const owlBody = new THREE.Mesh(new THREE.CapsuleGeometry(0.55, 0.9, 8, 12), new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 }));
    owlGrp.add(owlBody);

    const owlHead = new THREE.Mesh(new THREE.SphereGeometry(0.45, 10, 10), new THREE.MeshStandardMaterial({ color: 0x92400e }));
    owlHead.position.set(0, 0.7, 0.1);
    owlHead.name = 'owl_head';
    owlGrp.add(owlHead);

    // Big Eyes
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const eyePupilMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    [-0.18, 0.18].forEach(x => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), eyeMat);
      eye.position.set(x, 0.75, 0.48);
      owlGrp.add(eye);
      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), eyePupilMat);
      pupil.position.set(x, 0.75, 0.59);
      owlGrp.add(pupil);
    });

    group.add(owlGrp);
    animatedCreatures.push({ type: 'owl', group: owlGrp, head: owlHead, startY: 22.8 });

    // Register Owl NPC
    registerVillageNPC(game, {
      id: 'npc_owl_pofu',
      name: 'Bilge Puhu Kuşu Pofu 🦉',
      role: 'Kadim Ağaç Gözcüsü',
      avatarIcon: '🦉',
      pos: owlGrp.position,
      dialogue: [
        "Huu huu! Hoş geldin cesur ayı Grizzy! Köyün bu denli genişlemesi seni de şaşırttı değil mi?",
        "Toprağın altındaki Kadim Çekirdek uyandı... Dağlar ve nehirler senin cesaretine yanıt verdi!",
        "Şelalenin ardındaki gizli kristal mabedi ve Doğu Sakura Kulesi'ndeki gizli parşömenleri keşfetmeyi unutma huu huu!"
      ]
    });

    // 2. Minik Kirpi Pıtırcık 🦔 (Meyve Bahçesinde)
    const hedgehogGrp = new THREE.Group();
    hedgehogGrp.position.set(45, 3.8, -16);
    hedgehogGrp.name = 'creature_hedgehog_pitircik';

    const hBody = new THREE.Mesh(new THREE.SphereGeometry(0.5, 10, 8), new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.9 }));
    hBody.scale.set(0.9, 0.75, 1.2);
    hedgehogGrp.add(hBody);

    const hSpikes = new THREE.Mesh(new THREE.ConeGeometry(0.6, 0.8, 8), new THREE.MeshStandardMaterial({ color: 0x451a03 }));
    hSpikes.position.set(0, 0.35, -0.2);
    hSpikes.rotation.x = -0.6;
    hedgehogGrp.add(hSpikes);

    // Apple on back
    const apple = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), new THREE.MeshStandardMaterial({ color: 0xdc2626 }));
    apple.position.set(0, 0.6, -0.25);
    hedgehogGrp.add(apple);

    group.add(hedgehogGrp);
    animatedCreatures.push({ type: 'hedgehog', group: hedgehogGrp, baseX: 45, baseZ: -16 });

    registerVillageNPC(game, {
      id: 'npc_hedgehog_pitircik',
      name: 'Minik Kirpi Pıtırcık 🦔',
      role: 'Meyve Bahçesi Sakini',
      avatarIcon: '🦔',
      pos: hedgehogGrp.position,
      dialogue: [
        "Pıtır pıtır! Merhaba koca ayı dostum! Sırtımdaki kırmızı elmayı gördün mü?",
        "Köyümüz o kadar büyüdü ki, artık her köşe başında taze meyve ağaçları ve bal çilekleri yetişiyor!",
        "İnsanlar 'Bu köy neden bir gecede iki katına çıktı?' diye konuşuyor... Bence senin gibi iyi kalpli kahramanlar sayesinde oldu!"
      ]
    });

    // 3. Mistik Işık Kedisi Lunaris 🐱‍👤 (Kristal Mabette)
    const lunarisGrp = new THREE.Group();
    lunarisGrp.position.set(-60, 4.45, 11);
    lunarisGrp.name = 'creature_light_cat_lunaris';

    const lunarisBody = new THREE.Mesh(new THREE.CapsuleGeometry(0.4, 0.8, 8, 12), new THREE.MeshStandardMaterial({
      color: 0xe0f2fe,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.6,
      roughness: 0.2
    }));
    lunarisBody.position.y = 0.5;
    lunarisGrp.add(lunarisBody);

    // Glowing Cat Ears
    const earMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.9 });
    const lEarL = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.45, 4), earMat);
    lEarL.position.set(-0.25, 1.2, 0.05);
    lunarisGrp.add(lEarL);
    const lEarR = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.45, 4), earMat);
    lEarR.position.set(0.25, 1.2, 0.05);
    lunarisGrp.add(lEarR);

    group.add(lunarisGrp);
    animatedCreatures.push({ type: 'lunaris', group: lunarisGrp, startY: 4.45 });

    registerVillageNPC(game, {
      id: 'npc_light_cat_lunaris',
      name: 'Mistik Işık Kedisi Lunaris 🐱‍👤',
      role: 'Kristal Mabedi Koruyucusu',
      avatarIcon: '✨',
      pos: lunarisGrp.position,
      dialogue: [
        "Miyavv... Hoş geldin Grizzy. Ben bu kutsal vadinin ışık muhafızıyım.",
        "Köyün büyümesi bir tesadüf değil. Bin yıl önceki ebedi ittifak yemini yeniden alevlendi.",
        "Ardımdaki su perdesinin içinden geçebilirsin... Orada kadim altın sandık ve kehanet parşömeni seni bekliyor."
      ]
    });

    // 4. Nehir Samuru Neşeli Çapkın 🦦 (Nilüfer Kordonunda)
    const otterGrp = new THREE.Group();
    otterGrp.position.set(-8, 0.5, 36);
    otterGrp.name = 'creature_otter_capkin';

    const otterBody = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 1.1, 8, 10), new THREE.MeshStandardMaterial({ color: 0x5c2b08, roughness: 0.6 }));
    otterBody.rotation.z = Math.PI / 4;
    otterGrp.add(otterBody);

    group.add(otterGrp);
    animatedCreatures.push({ type: 'otter', group: otterGrp, startY: 0.5 });

    registerVillageNPC(game, {
      id: 'npc_otter_capkin',
      name: 'Nehir Samuru Neşeli Çapkın 🦦',
      role: 'Nilüfer Kordonu Yüzücüsü',
      avatarIcon: '🦦',
      pos: otterGrp.position,
      dialogue: [
        "Şapır şupur! Nehir hiç bu kadar coşkulu ve balık dolu olmamıştı!",
        "Genişleyen su yolları sayesinde yeni nilüfer adacıkları oluştu. Üstlerinde zıplamayı denedin mi?",
        "Yel değirmeninin yanındaki iskeleden oltanı atarsan Altın Koi Balığı bile tutabilirsin!"
      ]
    });

    // 5. Altın Boynuzlu Orman Geyiği 🦌 (Doğu Korusu)
    const deerGrp = new THREE.Group();
    deerGrp.position.set(62, 9.5, -42);
    deerGrp.name = 'creature_golden_deer';

    const deerBody = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 2.2), new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.7 }));
    deerBody.position.y = 1.6;
    deerGrp.add(deerBody);

    const deerNeck = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.4, 0.8), new THREE.MeshStandardMaterial({ color: 0xb45309 }));
    deerNeck.position.set(0, 2.6, 0.9);
    deerNeck.rotation.x = 0.3;
    deerGrp.add(deerNeck);

    // Golden Antlers
    const hornMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85, roughness: 0.2, emissive: 0xb45309, emissiveIntensity: 0.4 });
    const hornL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 1.4, 6), hornMat);
    hornL.position.set(-0.35, 3.8, 1.1);
    hornL.rotation.z = -0.4;
    deerGrp.add(hornL);

    const hornR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 1.4, 6), hornMat);
    hornR.position.set(0.35, 3.8, 1.1);
    hornR.rotation.z = 0.4;
    deerGrp.add(hornR);

    group.add(deerGrp);
    animatedCreatures.push({ type: 'deer', group: deerGrp, startY: 9.5 });

    registerVillageNPC(game, {
      id: 'npc_golden_deer',
      name: 'Altın Boynuzlu Koruyucu Geyik 🦌',
      role: 'Doğu Korusu Asil Rehberi',
      avatarIcon: '🦌',
      pos: deerGrp.position,
      dialogue: [
        "Asil Grizzy... Ayı Kedi Köyü'nün kalbi artık tüm canlılara kucak açacak kadar genişledi.",
        "Bu tepelerden gün batımını izlediğinde, doğanın sunduğu huzuru hissedeceksin.",
        "Tepeye çıkan spiral merdivenlerin ardındaki seyir kulesinde kadim bir kehanet parşömeni saklıdır..."
      ]
    });

    // 6. Uçuşan Parlak Kelebekler 🦋
    const butterflyMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
    for (let b = 0; b < 12; b++) {
      const wing = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.35), butterflyMat);
      wing.position.set(
        (Math.random() - 0.5) * 60,
        2.5 + Math.random() * 4,
        (Math.random() - 0.5) * 60
      );
      group.add(wing);
      butterflyParticles.push({
        mesh: wing,
        basePos: wing.position.clone(),
        phase: Math.random() * Math.PI * 2,
        speed: 1.5 + Math.random() * 1.5
      });
    }
  }

  // ==========================================================================
  // HELPER: REGISTER NPC INTO LEVEL
  // ==========================================================================
  function registerVillageNPC(game, npcDef) {
    if (!game || !game.currentLevel) return;
    if (!game.currentLevel.npcs) game.currentLevel.npcs = [];

    // Check if already registered
    const existing = game.currentLevel.npcs.find(n => n.id === npcDef.id);
    if (!existing) {
      game.currentLevel.npcs.push({
        id: npcDef.id,
        name: npcDef.name,
        role: npcDef.role,
        avatarIcon: npcDef.avatarIcon || "🐾",
        pos: npcDef.pos,
        dialogue: npcDef.dialogue
      });
    }
  }

  // ==========================================================================
  // SPAWN 5 LORE SCROLLS
  // ==========================================================================
  function spawnLoreScrolls(THREE, group, game) {
    LORE_SCROLLS.forEach(scroll => {
      const scrollGrp = new THREE.Group();
      scrollGrp.position.set(scroll.pos.x, scroll.pos.y, scroll.pos.z);
      scrollGrp.name = scroll.id;

      // Golden Scroll Mesh
      const parchmentMat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        roughness: 0.3,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.7
      });
      const woodCapMat = new THREE.MeshStandardMaterial({ color: 0x78350f });

      const scrollBody = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.4, 12), parchmentMat);
      scrollBody.rotation.z = Math.PI / 2;
      scrollGrp.add(scrollBody);

      [-0.75, 0.75].forEach(x => {
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.2, 12), woodCapMat);
        cap.position.x = x;
        cap.rotation.z = Math.PI / 2;
        scrollGrp.add(cap);
      });

      // Floating Glow Ring
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xfacc15, wireframe: true });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.04, 8, 16), ringMat);
      ring.name = 'scroll_glow_ring';
      scrollGrp.add(ring);

      group.add(scrollGrp);
      interactiveScrolls.push({
        def: scroll,
        group: scrollGrp,
        ring: ring
      });
    });
  }

  // ==========================================================================
  // 4. PER-FRAME UPDATE (GROUNDING & CREATURE ANIMATIONS & PROXIMITY)
  // ==========================================================================
  function updateGrandVillageExpansion(game) {
    if (!game || !game.scene) return;
    const currentRegion = game.currentRegion || 'hub';

    if (currentRegion !== 'hub') {
      if (activeExpansionGroup && activeExpansionGroup.parent) {
        activeExpansionGroup.parent.remove(activeExpansionGroup);
        activeExpansionGroup = null;
        activeRegion = null;
      }
      return;
    }

    // Build if not exists
    if (activeRegion !== 'hub' || !activeExpansionGroup || !activeExpansionGroup.parent) {
      activeRegion = 'hub';
      buildGrandVillageExpansion(game);
    }

    const time = Date.now() * 0.001;

    // 1. ANIMATE CREATURES
    animatedCreatures.forEach(c => {
      if (c.type === 'owl' && c.head) {
        c.head.rotation.y = Math.sin(time * 1.5) * 0.75;
      } else if (c.type === 'hedgehog') {
        c.group.position.x = c.baseX + Math.sin(time * 0.8) * 1.8;
        c.group.rotation.y = Math.sin(time * 0.8) > 0 ? 0 : Math.PI;
      } else if (c.type === 'lunaris') {
        c.group.position.y = c.startY + Math.sin(time * 2.5) * 0.12;
      } else if (c.type === 'otter') {
        c.group.position.y = c.startY + Math.sin(time * 3.0) * 0.08;
      } else if (c.type === 'deer') {
        c.group.position.y = c.startY + Math.sin(time * 1.2) * 0.04;
      }
    });

    // 2. ANIMATE BUTTERFLIES
    butterflyParticles.forEach(b => {
      b.mesh.position.x = b.basePos.x + Math.sin(time * b.speed + b.phase) * 2.5;
      b.mesh.position.y = b.basePos.y + Math.sin(time * (b.speed * 1.5) + b.phase) * 0.8;
      b.mesh.position.z = b.basePos.z + Math.cos(time * b.speed + b.phase) * 2.5;
      b.mesh.rotation.y += 0.05;
    });

    // 3. ANIMATE WINDMILL
    if (activeExpansionGroup) {
      const blades = activeExpansionGroup.getObjectByName('windmill_blades_group');
      if (blades) {
        blades.rotation.z += 0.015;
      }
      const crystal = activeExpansionGroup.getObjectByName('shrine_amethyst_crystal');
      if (crystal) {
        crystal.rotation.y += 0.02;
        crystal.rotation.x = Math.sin(time * 2.0) * 0.2;
      }
    }

    // 4. ANIMATE LORE SCROLLS & CHECK PROXIMITY
    const pPos = game.playerPos;
    if (!pPos) return;

    interactiveScrolls.forEach(scrollItem => {
      const sGrp = scrollItem.group;
      const def = scrollItem.def;
      sGrp.rotation.y += 0.02;
      sGrp.position.y = def.pos.y + Math.sin(time * 3.0) * 0.15;

      const dist = Math.hypot(pPos.x - def.pos.x, pPos.z - def.pos.z);
      const isHeightMatch = Math.abs(pPos.y - def.pos.y) < 3.5;

      if (dist < 3.2 && isHeightMatch) {
        const isInteracting = window.__isEKeyPressed || window.__isSpaceKeyPressed ||
          (game.inputs && (game.inputs.attack || game.inputs.interact || game.inputs.jump));

        if (isInteracting || dist < 2.0) {
          triggerReadScroll(game, def);
        }
      }
    });

    // 5. SOLID GROUNDING & UPRIGHT STANCE ENFORCER
    enforcePlayerSolidGrounding(game);
  }

  // ==========================================================================
  // 5. GROUNDING ENFORCER: STANDING UPRIGHT WHEN TOUCHING GROUND
  // ==========================================================================
  function enforcePlayerSolidGrounding(game) {
    if (!game || !game.playerPos || !game.playerBear || !game.playerBear.root) return;

    const pPos = game.playerPos;
    const pVel = game.playerVel;

    // Check if player is near base ground (y <= 0.2) or on colliders
    if (pPos.y <= 0.15 && pVel.y <= 0) {
      pPos.y = 0.1;
      pVel.y = 0;
      game.isGrounded = true;
      game.jumpCount = 0;

      // Ensure upright standing posture (reset tilt/roll)
      if (!game.isRolling && !game.isGroundPounding) {
        if (game.playerBear.body) {
          game.playerBear.body.rotation.z = 0;
          game.playerBear.body.rotation.x = 0;
        }
      }
    }

    // Reset pitch and roll when grounded
    if (game.isGrounded && !game.isRolling && !game.isGroundPounding) {
      if (game.playerBear.body) {
        game.playerBear.body.rotation.z *= 0.8;
      }
    }
  }

  // ==========================================================================
  // 6. TRIGGER LORE SCROLL STORY MODAL
  // ==========================================================================
  let lastScrollReadTime = 0;
  function triggerReadScroll(game, scrollDef) {
    const now = Date.now();
    if (now - lastScrollReadTime < 2500) return;
    lastScrollReadTime = now;

    const isFirstRead = !readScrolls[scrollDef.id];
    readScrolls[scrollDef.id] = true;
    try {
      localStorage.setItem('superbear_read_lore_scrolls', JSON.stringify(readScrolls));
    } catch (e) {}

    // Play reward effects if first read
    if (isFirstRead && game.stats) {
      game.stats.coins = (game.stats.coins || 0) + scrollDef.rewardCoins;
      game.stats.honeyGems = (game.stats.honeyGems || 0) + scrollDef.rewardHoney;
      game.stats.xp = (game.stats.xp || 0) + scrollDef.rewardXp;
      if (game.callbacks && game.callbacks.onStatsUpdate) {
        game.callbacks.onStatsUpdate(game.stats);
      }
      if (window.St && window.St.playHoneyGem) window.St.playHoneyGem();
      if (game.spawnSparkleParticles) {
        game.spawnSparkleParticles(game.playerPos, 20, 0xfacc15);
      }
    }

    // Show Dialogue / Story Modal
    if (game.callbacks && game.callbacks.onDialogueOpen) {
      game.callbacks.onDialogueOpen({
        npcId: scrollDef.id,
        npcName: scrollDef.title,
        npcRole: `${scrollDef.location} - Antik Hikaye Yazıtı`,
        avatarIcon: scrollDef.icon,
        dialogue: scrollDef.pages
      });
    } else if (game.showDialogue) {
      game.showDialogue(
        scrollDef.title,
        scrollDef.pages.join("\n\n"),
        scrollDef.icon
      );
    }
  }

  // ==========================================================================
  // HOOK INTO GAME RUNTIME LOOP
  // ==========================================================================
  function initModuleHook() {
    let _lastCatBearTick = 0;

    function tick() {
      let nextDelay = 0;

      try {
        const game = window.__superBearGame;
        if (!game || !game.scene || (game.currentRegion && game.currentRegion !== 'hub')) {
          nextDelay = 300;
          return;
        }

        const now = performance.now();
        const isMob = (typeof navigator !== "undefined" && (
          /android|tablet|ipad|iphone|ipod|wv|appcreator24/i.test(navigator.userAgent) ||
          (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ||
          navigator.maxTouchPoints > 0
        ));
        if (now - _lastCatBearTick < (isMob ? 33.3 : 20)) {
          nextDelay = 0;
          return;
        }
        _lastCatBearTick = now;

        if (game.isPaused || window.__superBearPaused || window.__superBearModalOpen || (typeof document !== 'undefined' && document.hidden)) {
          nextDelay = 150;
          return;
        }

        updateGrandVillageExpansion(game);
      } catch (err) {
        console.warn("Cat-bear village expansion error:", err);
      } finally {
        if (nextDelay > 0) {
          setTimeout(tick, nextDelay);
        } else {
          requestAnimationFrame(tick);
        }
      }
    }

    requestAnimationFrame(tick);
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initModuleHook();
  } else {
    window.addEventListener('DOMContentLoaded', initModuleHook);
  }

  // Export
  window.__grandVillageExpansion = {
    build: buildGrandVillageExpansion,
    LORE_SCROLLS: LORE_SCROLLS,
    triggerReadScroll: triggerReadScroll
  };

})();
