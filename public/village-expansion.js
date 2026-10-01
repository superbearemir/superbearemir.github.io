// ============================================================================
// 🏝️ BÜYÜK DOĞA ADASI & GÜNEY KÖPRÜSÜ (GRAND SAFARI ISLAND & HIGHWAY BRIDGE v4.0)
// - Dağın arkasındaki (kuzeydeki) tüm yapılar kaldırıldı; dağlar ve Mori'nin yeri ana köy olarak korundu!
// - Köyün güneyindeki açık su alanına (Z: 45 to 95) devasa bir Ulu Köprü uzatıldı.
// - Bariyer sınırları genişletildi ve köprünün ardında yepyeni büyüklükte bir ada kuruldu (Z: 95 to 250).
// - Değişik ve yüksek yapılar:
//     * 26m Dev Spiral Deniz Feneri & Seyir Balkonları (Tırmanılabilir!)
//     * 3 Katlı Ahşap Ada Malikanesi & Kademeli Teraslar
//     * Antik Kemerli Su Kemeri & Şelaleli Taş Köşk
//     * Kazıklı Tropik Rıhtım & Balıkçı İskelesi
//     * Yüksek Gözlem Çardağı & Asılı Ahşap Köprüler
// - Gerçek canlılara benzeyen hayvanlar:
//     * Asil Boynuzlu Kızıl Geyikler & Zarif Ceylanlar (Otlayan & Baş Sallayan) 🦌
//     * Çalı Kuyruklu Kızıl Tilki Ailesi (Koklayan & Kuyruk Sallayan) 🦊
//     * Kulaklarını Kıpırdatan Yaban Tavşanları (Zıp Zıp Seken) 🐇
//     * Gölette Süzülen Asil Beyaz Kuğular & Yaban Ördekleri 🦢
//     * Yüksek Kayada Tünemiş Dağ Kartalı 🦅
//     * Suda Yüzen Sevimli Su Samurları 🦦
// - Katı İzolasyon: YALNIZCA Ayı Köyü'nde ('hub') görünür; diğer dünyalarda asla gözükmez!
// - Uzay bölümüne gönderme YOK; sadece huzurlu köy ve açık macera diyarları konuşulur!
// ============================================================================

(function() {
  'use strict';

  console.log("🏝️ Loading Grand Safari Island & South Highway Bridge Expansion v4.0...");

  let villageExpansionGroup = null;
  let expansionColliders = [];
  let animatedAnimals = [];
  let friendlyCreatures = [];
  let animatedStructures = [];
  let islandCollectibles = [];
  let isHubActive = false;

  // Global safe fallback for create3DGoldCoin so it can never throw ReferenceError
  if (typeof window !== 'undefined' && !window.create3DGoldCoin) {
    window.create3DGoldCoin = function(x, y, z, val = 25) {
      if (typeof window.createSleekRoundGoldCoin === 'function') {
        return window.createSleekRoundGoldCoin(x, y, z, val);
      }
    };
  }

  // Helper: Retrieve only the currently unlocked/open regions (NO space references!)
  function getOpenRegionsList() {
    try {
      const sm = window.__superBearSaveManager;
      const save = sm && sm.getSave ? sm.getSave() : null;
      const maxLevel = (save && save.unlockedLevelsMax) || 1;
      const progress = (save && save.levelsProgress) || {};

      const regionNames = {
        forest_temple: 'Antik Orman Tapınağı 🌲',
        beehive: 'Vızıldayan Bal Kovanı 🐝',
        pelican_plains: 'Pelikan Ovaları 🪶',
        snow_desert: 'Kar Çölü ❄️',
        volcano_cave: 'Volkanik Lav Mağarası 🌋',
        underwater_palace: 'Batık Su Sarayı 🌊',
        golden_sanctuary: 'Altın Piramit Tapınağı 🏛️',
        dinosaur_world: 'Dinozorlar Diyarı 🦖',
        sugar_world: 'Şeker Dünyası 🍭',
        jokerooms: 'Sirk & Palyaço Diyarı 🎪',
        ruin_village: 'Harabe Köy 🏚️',
        water_cave: 'Kristal Su Mağarası 💎',
        bee_desert: 'Arı Kanyonu & Çölü 🏜️'
      };

      const orderedKeys = [
        'forest_temple', 'beehive', 'pelican_plains', 'snow_desert',
        'volcano_cave', 'underwater_palace', 'golden_sanctuary',
        'dinosaur_world', 'sugar_world', 'jokerooms', 'ruin_village',
        'water_cave', 'bee_desert'
      ];

      const openList = [];
      orderedKeys.forEach((key, index) => {
        if (progress[key]?.isUnlocked || (index + 1) <= maxLevel) {
          openList.push(regionNames[key] || key);
        }
      });

      if (openList.length > 0) return openList;
    } catch (e) {}
    return ['Antik Orman Tapınağı 🌲', 'Vızıldayan Bal Kovanı 🐝'];
  }

  // Register physical collision box ONLY for hub
  function addSolidBox(minX, minY, minZ, maxX, maxY, maxZ, isClimbable = false) {
    const THREE = window.THREE;
    if (!THREE) return null;

    const col = {
      min: new THREE.Vector3(minX, minY, minZ),
      max: new THREE.Vector3(maxX, maxY, maxZ),
      isToxic: false,
      isIce: false,
      isClimbable: isClimbable,
      isVillageExpansionCollider: true
    };
    expansionColliders.push(col);

    const game = window.__superBearGame;
    if (game && game.currentLevel && game.currentLevel.colliders && isHubActive) {
      game.currentLevel.colliders.push(col);
    }
    return col;
  }

  // --------------------------------------------------------------------------
  // MASTER BUILD FUNCTION
  // --------------------------------------------------------------------------
  function buildVillageExpansion(scene) {
    const THREE = window.THREE;
    if (!THREE || !scene) return;

    // Clean previous group completely
    if (villageExpansionGroup) {
      try {
        if (villageExpansionGroup.parent) {
          villageExpansionGroup.parent.remove(villageExpansionGroup);
        }
      } catch (e) {}
      villageExpansionGroup = null;
    }

    const game = window.__superBearGame;
    if (game && game.currentLevel && game.currentLevel.colliders) {
      game.currentLevel.colliders = game.currentLevel.colliders.filter(c => !c.isVillageExpansionCollider);
    }
    expansionColliders = [];
    animatedAnimals = [];
    friendlyCreatures = [];
    animatedStructures = [];
    islandCollectibles = [];

    // Check region
    const currentRegion = (game && game.currentRegion) || 'hub';
    if (currentRegion !== 'hub') {
      isHubActive = false;
      return;
    }
    isHubActive = true;

    villageExpansionGroup = new THREE.Group();
    villageExpansionGroup.name = 'village_safari_island_expansion';
    scene.add(villageExpansionGroup);

    // ========================================================================
    // MATERIALS
    // ========================================================================
    const stoneBrickMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.85 });
    const darkStoneMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 });
    const woodPlankMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
    const darkBeamMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.85 });
    const terracottaRoofMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.6 });
    const tealRoofMat = new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.55 });
    const royalBlueMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.6 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8, roughness: 0.25 });
    const lighthouseRed = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.5 });
    const lighthouseWhite = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
    const islandGrassMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.85 });
    const islandSandMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.9 });
    const waterDeepMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, transparent: true, opacity: 0.88, metalness: 0.2 });
    const lanternGlowMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xf59e0b, emissiveIntensity: 1.0 });
    const glassDomeMat = new THREE.MeshStandardMaterial({ color: 0xbae6fd, transparent: true, opacity: 0.6, roughness: 0.1 });
    const ropeMat = new THREE.MeshStandardMaterial({ color: 0xca8a04, roughness: 0.9 });

    // ========================================================================
    // 1. GÜNEY SU KANALI VE ULU ASMA KÖPRÜ (SOUTH WATERWAY & HIGHWAY BRIDGE)
    // Starts at village shore (Z: 44) and stretches across the water to Island (Z: 96)
    // Length: 52 meters! Width: 7.5 meters!
    // ========================================================================
    console.log("🌉 Building Grand South Highway Bridge across the water (Z: 44 to 96)...");

    const bridgeGrp = new THREE.Group();
    bridgeGrp.name = 'south_highway_bridge';

    // Massive Water Basin under the bridge (Z: 44 to 96, X: -60 to 60)
    const bridgeWater = new THREE.Mesh(new THREE.BoxGeometry(140, 0.4, 60), waterDeepMat);
    bridgeWater.position.set(0, -0.4, 70);
    bridgeGrp.add(bridgeWater);

    // Stone Portal Gate on Village Shore (Z: 44)
    const gateNorth = createArchGate(THREE, stoneBrickMat, darkStoneMat, goldMat, lanternGlowMat);
    gateNorth.position.set(0, 0, 44);
    bridgeGrp.add(gateNorth);
    addSolidBox(-5.5, 0, 42.5, -3.5, 7.5, 45.5);
    addSolidBox(3.5, 0, 42.5, 5.5, 7.5, 45.5);
    addSolidBox(-5.0, 6.0, 42.5, 5.0, 7.8, 45.5);

    // Stone Portal Gate on Island Shore (Z: 96)
    const gateSouth = createArchGate(THREE, stoneBrickMat, darkStoneMat, goldMat, lanternGlowMat);
    gateSouth.position.set(0, 0.8, 96);
    bridgeGrp.add(gateSouth);
    addSolidBox(-5.5, 0.8, 94.5, -3.5, 8.3, 97.5);
    addSolidBox(3.5, 0.8, 94.5, 5.5, 8.3, 97.5);
    addSolidBox(-5.0, 6.8, 94.5, 5.0, 8.6, 97.5);

    // Main Bridge Deck (Length 52m, Width 7.4m, Elevation Y: 1.4 to 1.8)
    const deckMesh = new THREE.Mesh(new THREE.BoxGeometry(7.4, 0.5, 52), woodPlankMat);
    deckMesh.position.set(0, 1.4, 70);
    deckMesh.receiveShadow = true;
    bridgeGrp.add(deckMesh);
    addSolidBox(-3.7, 0, 44, 3.7, 1.7, 96);

    // Safety Side Parapets / Railings
    [-3.6, 3.6].forEach(rx => {
      const railMesh = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.2, 52), darkBeamMat);
      railMesh.position.set(rx, 2.1, 70);
      bridgeGrp.add(railMesh);
      addSolidBox(rx - 0.25, 1.5, 44, rx + 0.25, 2.8, 96);
    });

    // Lantern Lamp Posts every 10 meters
    for (let lz = 50; lz <= 90; lz += 10) {
      [-3.7, 3.7].forEach(lx => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 2.6, 8), darkBeamMat);
        post.position.set(lx, 2.6, lz);
        bridgeGrp.add(post);

        const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), lanternGlowMat);
        lantern.position.set(lx, 4.0, lz);
        bridgeGrp.add(lantern);
      });
    }

    // Heavy Stone Piers in the water
    [58, 82].forEach(pz => {
      const pier = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.8, 6.0, 10), stoneBrickMat);
      pier.position.set(0, -1.2, pz);
      bridgeGrp.add(pier);
    });

    // Suspension Catenary Cables
    [-3.7, 3.7].forEach(cx => {
      const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 52, 6), ropeMat);
      cable.position.set(cx, 3.8, 70);
      cable.rotation.x = Math.PI / 2;
      bridgeGrp.add(cable);
    });

    villageExpansionGroup.add(bridgeGrp);

    // ========================================================================
    // 2. YEPYENİ BÜYÜKLÜKTE DOĞA ADASI (GRAND SAFARI ISLAND TERRAIN)
    // Z: 95 to 250, X: -85 to +85 (Devasa Yeşil Ada, Kumlu Sahil & Lagün)
    // ========================================================================
    console.log("🏝️ Sculpting Gigantic Safari Island Landmass (Z: 95 to 250)...");

    const islandTerrainGrp = new THREE.Group();
    islandTerrainGrp.name = 'grand_island_terrain';

    // A) Golden Sand Coastal Beach Rim (Low border surrounding the island)
    const sandBeach = new THREE.Mesh(new THREE.BoxGeometry(175, 1.0, 155), islandSandMat);
    sandBeach.position.set(0, 0.2, 172);
    sandBeach.receiveShadow = true;
    islandTerrainGrp.add(sandBeach);
    addSolidBox(-87, -0.5, 95, 87, 0.7, 250);

    // B) Main Lush Green Island Plateaus (Y = 1.6, Size: 155m x 135m)
    const mainLawn = new THREE.Mesh(new THREE.BoxGeometry(155, 1.2, 135), islandGrassMat);
    mainLawn.position.set(0, 1.0, 172);
    mainLawn.receiveShadow = true;
    islandTerrainGrp.add(mainLawn);
    addSolidBox(-77, 0, 104, 77, 1.65, 240);

    // C) Paved Stone Promenade leading from the bridge into the island center
    const stonePath = new THREE.Mesh(new THREE.BoxGeometry(9.0, 0.2, 90), stoneBrickMat);
    stonePath.position.set(0, 1.62, 150);
    stonePath.receiveShadow = true;
    islandTerrainGrp.add(stonePath);

    // D) Inland Sparkling Lagoon / Water Spring (x: 0, z: 145)
    const lagoonPool = new THREE.Mesh(new THREE.CylinderGeometry(14, 15, 0.8, 24), waterDeepMat);
    lagoonPool.position.set(0, 1.35, 145);
    islandTerrainGrp.add(lagoonPool);

    // Lilypads in the lagoon
    [[-6, 140], [5, 142], [-4, 150], [7, 148]].forEach(([lx, lz]) => {
      const lily = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.04, 8), new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 }));
      lily.position.set(lx, 1.66, lz);
      islandTerrainGrp.add(lily);
    });

    // E) Rocky Forest Hills on West & East Borders of Island
    const hillConfigs = [
      { x: -62, z: 135, r: 16, h: 14 },
      { x: -65, z: 195, r: 18, h: 18 },
      { x: 62, z: 135, r: 16, h: 14 },
      { x: 65, z: 195, r: 18, h: 18 },
      { x: 0, z: 235, r: 24, h: 22 } // Grand southern cliff
    ];

    hillConfigs.forEach(h => {
      const hill = new THREE.Mesh(new THREE.ConeGeometry(h.r, h.h, 12), darkStoneMat);
      hill.position.set(h.x, h.h / 2 + 1.0, h.z);
      islandTerrainGrp.add(hill);
      addSolidBox(h.x - h.r * 0.7, 1.0, h.z - h.r * 0.7, h.x + h.r * 0.7, h.h * 0.75 + 1.0, h.z + h.r * 0.7);

      // Lush foliage on hilltops
      const bush = new THREE.Mesh(new THREE.SphereGeometry(h.r * 0.45, 8, 8), islandGrassMat);
      bush.position.set(h.x, h.h * 0.8 + 1.0, h.z);
      islandTerrainGrp.add(bush);
    });

    // Flowering Shade Trees on Island Meadow
    const treeLocs = [
      [-32, 125], [-24, 168], [28, 125], [26, 172],
      [-20, 215], [22, 215], [42, 160], [-40, 160]
    ];
    treeLocs.forEach(([tx, tz]) => {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 4.0, 8), darkBeamMat);
      trunk.position.y = 2.0;
      tree.add(trunk);
      addSolidBox(tx - 0.5, 1.6, tz - 0.5, tx + 0.5, 5.0, tz + 0.5);

      const crown = new THREE.Mesh(new THREE.SphereGeometry(2.8, 10, 10), new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.7 }));
      crown.position.y = 5.2;
      tree.add(crown);

      tree.position.set(tx, 1.6, tz);
      islandTerrainGrp.add(tree);
    });

    villageExpansionGroup.add(islandTerrainGrp);

    // ========================================================================
    // 3. YÜKSEK VE DEĞİŞİK YAPILAR (UNIQUE HIGH ARCHITECTURAL STRUCTURES)
    // ========================================================================

    // ------------------------------------------------------------------------
    // YAPI 1: 26 METRE DEV SPİRAL DENİZ FENERİ, İÇ MERDİVENLER VE SEYİR BALKONU (LIGHTHOUSE)
    // Konum: x: 0, z: 220 (Adanın en yüksek güney burun noktası)
    // Oyuncu fenerin giriş merdivenlerinden doğrudan içeri girip, iç spiral merdivenlerle
    // 4 kat boyunca dışarı pencerelerden bakabilir, en tepeye (26m) çıkıp 360° panoramik
    // seyir terasından dürbünle tüm adayı ve denizi izleyebilir!
    // ------------------------------------------------------------------------
    console.log("🗼 Building 26m Grand Enterable Spiral Coastal Lighthouse & Summit Observatory...");
    const lighthouseGrp = new THREE.Group();
    lighthouseGrp.position.set(0, 1.6, 220);

    // 1. GRAND ENTRANCE STAIRCASE (Kusursuz kademeli giriş merdivenleri)
    // Starts at island path (Z: 207.2, Y: 1.65) and ascends smoothly up to the Lighthouse Entrance Arch (Z: 214.5, Y: 3.15)
    for (let st = 0; st < 8; st++) {
      const sZ = 207.2 + st * 0.95;
      const sY = 1.65 + st * 0.22;
      const stepMesh = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.28, 1.1), stoneBrickMat);
      stepMesh.position.set(0, sY - 1.6, sZ - 220);
      lighthouseGrp.add(stepMesh);

      // Gold-trimmed stair step nosing
      const nosing = new THREE.Mesh(new THREE.BoxGeometry(4.62, 0.08, 0.08), goldMat);
      nosing.position.set(0, sY - 1.6 + 0.12, sZ - 220 - 0.52);
      lighthouseGrp.add(nosing);

      // Solid Step Physical Collider
      addSolidBox(-2.3, sY - 0.15, sZ - 0.55, 2.3, sY + 0.28, sZ + 0.55);
    }

    // Polished Brass Handrails on both sides of entrance stairs
    [-2.35, 2.35].forEach(hx => {
      const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 7.8, 8), goldMat);
      rail.position.set(hx, 1.35, -9.2);
      rail.rotation.x = Math.PI / 11;
      lighthouseGrp.add(rail);

      // Support posts for handrail
      for (let hp = 0; hp < 4; hp++) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.95, 6), darkBeamMat);
        post.position.set(hx, 0.55 + hp * 0.42, -12.4 + hp * 2.3);
        lighthouseGrp.add(post);
      }
    });

    // Welcoming Grand Nautical Entrance Lampposts at the foot of stairs (Z = 206.8)
    [-2.45, 2.45].forEach(px => {
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 0.7), darkStoneMat);
      plinth.position.set(px, 0.4, -13.2);
      lighthouseGrp.add(plinth);

      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 2.6, 8), darkBeamMat);
      post.position.set(px, 1.7, -13.2);
      lighthouseGrp.add(post);

      const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), lanternGlowMat);
      lantern.position.set(px, 3.1, -13.2);
      lighthouseGrp.add(lantern);
    });

    // 2. GRAND ARCHED ENTRANCE DOORWAY (Z: 214.8 / local Z: -5.2)
    // Left & Right Carved Stone Pillars (Aralık 3.8m: Oyuncu tamamen engelsiz girer)
    [-2.0, 2.0].forEach(px => {
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.8, 4.4, 0.9), darkStoneMat);
      pillar.position.set(px, 3.4, -5.2);
      lighthouseGrp.add(pillar);

      const pCap = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.25, 1.05), goldMat);
      pCap.position.set(px, 5.65, -5.2);
      lighthouseGrp.add(pCap);

      const wLantern = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 8), lanternGlowMat);
      wLantern.position.set(px, 4.2, -4.6);
      lighthouseGrp.add(wLantern);
    });

    // Archway Top Beam / Lintel spanning across
    const archLintel = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.85, 1.0), darkStoneMat);
    archLintel.position.set(0, 5.6, -5.2);
    lighthouseGrp.add(archLintel);

    // Carved Signboard above the entrance
    const signBoard = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.65, 0.15), woodPlankMat);
    signBoard.position.set(0, 5.6, -4.65);
    lighthouseGrp.add(signBoard);

    // Doorway Ceiling Arch
    const doorArch = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 1.9, 0.9, 16, 1, false, 0, Math.PI), darkStoneMat);
    doorArch.rotation.z = Math.PI / 2;
    doorArch.position.set(0, 5.15, -5.2);
    lighthouseGrp.add(doorArch);

    // Two Carved Oak Door Leaves swung wide OPEN into the interior walls
    [-1.75, 1.75].forEach((dx, dIdx) => {
      const doorLeaf = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.4, 1.6), woodMat);
      doorLeaf.position.set(dx, 3.1, -4.3);
      doorLeaf.rotation.y = dIdx === 0 ? 0.35 : -0.35;
      lighthouseGrp.add(doorLeaf);

      const dHandle = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), goldMat);
      dHandle.position.set(dx + (dIdx === 0 ? 0.1 : -0.1), 3.1, -4.3);
      lighthouseGrp.add(dHandle);
    });

    // Ornate Welcoming Red & Gold Runner leading straight through the door
    const runner = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.04, 7.5), new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.8 }));
    runner.position.set(0, 1.48, -4.0);
    lighthouseGrp.add(runner);

    // 3. CONTINUOUS THRESHOLD AND INTERIOR FLOOR (SIFIR BOŞLUK - KESİNTİSİZ TABAN!)
    // Doorway threshold platform (Z: 214.0 to 216.5, Y = 3.15)
    addSolidBox(-2.3, 1.6, 214.0, 2.3, 3.15, 216.5);
    // Interior Ground Floor (Z: 216.0 to 224.8, Y = 3.15)
    addSolidBox(-4.6, 1.6, 216.0, 4.6, 3.15, 224.8);

    // Interior visual stone floor
    const lhFloor = new THREE.Mesh(new THREE.CylinderGeometry(5.0, 5.0, 0.4, 24), darkStoneMat);
    lhFloor.position.y = 1.35;
    lighthouseGrp.add(lhFloor);

    // Decorative Compass Rose Inlay in floor center
    const compassRose = new THREE.Mesh(new THREE.CircleGeometry(2.0, 8), goldMat);
    compassRose.rotation.x = -Math.PI / 2;
    compassRose.position.set(0, 1.56, 0);
    lighthouseGrp.add(compassRose);

    // 4. HOLLOW OCTAGONAL BASE WALLS (KAPININ ÖNÜ AÇIK, YANLAR VE ARKA SAĞLAM TAŞ DUVAR!)
    // We construct 7 distinct stone wall panels leaving the NORTH entrance side completely OPEN!
    const octRadius = 5.6;
    for (let ow = 1; ow < 8; ow++) {
      const wAngle = (ow / 8) * Math.PI * 2 + Math.PI / 8;
      // Skip North door opening
      const panelX = Math.sin(wAngle) * octRadius;
      const panelZ = Math.cos(wAngle) * octRadius;

      const wallPanel = new THREE.Mesh(new THREE.BoxGeometry(4.4, 5.8, 0.85), stoneBrickMat);
      wallPanel.position.set(panelX, 4.3, panelZ);
      wallPanel.rotation.y = wAngle + Math.PI / 2;
      lighthouseGrp.add(wallPanel);
    }

    // Exterior decorative stone plinth base rim
    for (let ow = 1; ow < 8; ow++) {
      const wAngle = (ow / 8) * Math.PI * 2 + Math.PI / 8;
      const rimX = Math.sin(wAngle) * (octRadius + 0.35);
      const rimZ = Math.cos(wAngle) * (octRadius + 0.35);

      const rimPanel = new THREE.Mesh(new THREE.BoxGeometry(4.6, 1.2, 0.6), darkStoneMat);
      rimPanel.position.set(rimX, 1.8, rimZ);
      rimPanel.rotation.y = wAngle + Math.PI / 2;
      lighthouseGrp.add(rimPanel);
    }

    // Base Physical Wall Colliders (Doorway between X: -1.9 and +1.9 is 100% CLEAR!)
    addSolidBox(-5.6, 1.6, 214.2, -1.9, 7.6, 216.5); // Front left
    addSolidBox(1.9, 1.6, 214.2, 5.6, 7.6, 216.5);  // Front right
    addSolidBox(-1.9, 5.2, 214.2, 1.9, 7.6, 216.5);  // Above door lintel
    addSolidBox(-5.8, 1.6, 216.0, -3.8, 7.6, 224.5); // West wall
    addSolidBox(3.8, 1.6, 216.0, 5.8, 7.6, 224.5);  // East wall
    addSolidBox(-4.8, 1.6, 223.5, 4.8, 7.6, 225.8); // South back wall

    // Interior Warm Lanterns & Torch Sconces inside the Ground Floor
    [-2.8, 2.8].forEach(wx => {
      const wallTorch = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), lanternGlowMat);
      wallTorch.position.set(wx, 3.4, 0);
      lighthouseGrp.add(wallTorch);
    });

    // Fener İçi Yaylı Zıplama Pedi (Fast jump pad inside ground floor)
    const jumpPadRing = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.1, 0.22, 16), goldMat);
    jumpPadRing.position.set(1.6, 1.58, -2.0);
    lighthouseGrp.add(jumpPadRing);

    const jumpPadCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.25, 16), new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.8 }));
    jumpPadCenter.position.set(1.6, 1.62, -2.0);
    lighthouseGrp.add(jumpPadCenter);

    if (game && game.currentLevel && game.currentLevel.jumpPads && isHubActive) {
      game.currentLevel.jumpPads.push({
        pos: new THREE.Vector3(1.6, 3.2, 218.0),
        boostForce: 24,
        label: "Fener İç Asansör Hava Akımı"
      });
    }

    // Signpost at the foot of the spiral staircase
    const stairSign = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.8, 0.1), woodPlankMat);
    stairSign.position.set(-1.8, 2.8, -2.5);
    stairSign.rotation.y = 0.5;
    lighthouseGrp.add(stairSign);

    // 5. HOLLOW TAPERED TOWER SHAFT (Y = 7.6 to Y = 23.6) WITH LARGE OBSERVATION WINDOWS
    for (let band = 0; band < 4; band++) {
      const bandMat = band % 2 === 0 ? lighthouseWhite : lighthouseRed;
      const bOuterR = 4.4 - band * 0.28;
      const bMesh = new THREE.Mesh(new THREE.CylinderGeometry(bOuterR - 0.25, bOuterR, 4.0, 24, 1, true), bandMat);
      bMesh.material.side = THREE.DoubleSide;
      bMesh.position.y = 8.0 + band * 4.0;
      lighthouseGrp.add(bMesh);

      // Hollow Wall Colliders for each band (Interior remains completely walkable!)
      const bMinY = 7.6 + band * 4.0;
      const bMaxY = 11.6 + band * 4.0;
      addSolidBox(-4.4, bMinY, 216.2, -3.2, bMaxY, 223.8); // West
      addSolidBox(3.2, bMinY, 216.2, 4.4, bMaxY, 223.8);  // East
      addSolidBox(-3.5, bMinY, 215.5, 3.5, bMaxY, 216.8); // North
      addSolidBox(-3.5, bMinY, 223.2, 3.5, bMaxY, 224.5); // South
    }

    // 4 LARGE ARCHED OBSERVATION WINDOWS & VIEWING BALCONIES (DIŞARI BAKMA PENCERELERİ)
    // Her katta dışarıyı, denizi ve köyü seyretmek için geniş kemerli pencereler!
    const observationWindows = [
      { y: 9.0, dir: 'north', pos: [0, 9.0 - 1.6, -4.2], rotY: 0, label: 'Köy & Ulu Köprü Manzarası' },
      { y: 13.0, dir: 'east', pos: [4.0, 13.0 - 1.6, 0], rotY: -Math.PI / 2, label: 'Balıkçı İskelesi & Doğu Denizi' },
      { y: 17.5, dir: 'south', pos: [0, 17.5 - 1.6, 3.8], rotY: Math.PI, label: 'Derin Açık Okyanus & Ufuk' },
      { y: 21.0, dir: 'west', pos: [-3.6, 21.0 - 1.6, 0], rotY: Math.PI / 2, label: 'Ada Malikanesi & Çiçekli Tepeler' }
    ];

    observationWindows.forEach(win => {
      const winGrp = new THREE.Group();
      winGrp.position.set(win.pos[0], win.pos[1], win.pos[2]);
      winGrp.rotation.y = win.rotY;

      // Stone window frame & sill
      const sill = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.28, 0.8), darkStoneMat);
      sill.position.y = -0.9;
      winGrp.add(sill);

      // Brass Guard Rail to safely look outside
      const guardRail = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.2, 8), goldMat);
      guardRail.rotation.z = Math.PI / 2;
      guardRail.position.set(0, -0.35, 0.2);
      winGrp.add(guardRail);

      // Window Arch Frame
      const wArch = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.28, 0.8), darkStoneMat);
      wArch.position.y = 1.0;
      winGrp.add(wArch);

      // Hanging Warm Lantern at window
      const wLamp = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), lanternGlowMat);
      wLamp.position.set(0, 0.8, -0.2);
      winGrp.add(wLamp);

      lighthouseGrp.add(winGrp);
    });

    // 6. CENTRAL PILLAR & WINDING SPIRAL STAIRCASE (Spiraling smoothly all the way up to 26m Summit!)
    const lhPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 21.5, 16), darkStoneMat);
    lhPillar.position.y = 12.0;
    lighthouseGrp.add(lhPillar);
    addSolidBox(-0.65, 2.5, 219.35, 0.65, 23.6, 220.65);

    // Pillar Brass Rings every 4 meters
    for (let pr = 0; pr < 5; pr++) {
      const ringMesh = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.05, 8, 20), goldMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = 3.5 + pr * 4.2;
      lighthouseGrp.add(ringMesh);
    }

    // 52 GENTLE SPIRAL STEPS (Her basamak ~0.39m yükselir - çok rahat tırmanılır!)
    const numSpiralSteps = 52;
    const spiralRevs = 2.7;
    for (let s = 0; s < numSpiralSteps; s++) {
      const frac = s / (numSpiralSteps - 1);
      const ang = frac * Math.PI * 2 * spiralRevs;
      const curY = 3.15 + frac * 20.45; // Smooth ascent from Y: 3.15 to Y: 23.6
      const rad = 2.0;
      const sx = Math.sin(ang) * rad;
      const sz = Math.cos(ang) * rad;

      // Wooden spiral step plank with brass trim
      const stepMesh = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.22, 1.15), woodPlankMat);
      stepMesh.position.set(sx, curY - 1.6, sz);
      stepMesh.rotation.y = ang + Math.PI / 2;
      lighthouseGrp.add(stepMesh);

      // Gold step nosing
      const sNosing = new THREE.Mesh(new THREE.BoxGeometry(2.12, 0.06, 0.08), goldMat);
      sNosing.position.set(sx, curY - 1.6 + 0.09, sz);
      sNosing.rotation.y = ang + Math.PI / 2;
      lighthouseGrp.add(sNosing);

      // Solid Step Physical Collider (Çok kademeli, oyuncuyu asla geriye itmez)
      addSolidBox(
        sx - 0.95, curY - 0.08, 220 + sz - 0.95,
        sx + 0.95, curY + 0.28, 220 + sz + 0.95
      );

      // Glowing Wall Torch Lantern every 4 steps along the spiral
      if (s % 4 === 0) {
        const wallAng = ang + 0.35;
        const lx = Math.sin(wallAng) * 3.4;
        const lz = Math.cos(wallAng) * 3.4;
        const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), lanternGlowMat);
        lamp.position.set(lx, curY - 1.6 + 1.1, lz);
        lighthouseGrp.add(lamp);
      }
    }

    // 7. WALKABLE 360° PANORAMIC OBSERVATION BALCONY (Y = 23.6m, Radius 5.5m)
    // Walkable floor platform (Merdiven çıkışı hariç tüm çevre yürünebilir!)
    const lhBalcony = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 5.1, 0.5, 24), darkStoneMat);
    lhBalcony.position.y = 22.0;
    lighthouseGrp.add(lhBalcony);

    // Balcony Colliders arranged in 4 perimeter quadrants (MERDİVEN ÇIKIŞINDA KAFANIN ÇARPMAMASI İÇİN AÇIKLIK!)
    addSolidBox(-5.4, 23.2, 214.6, 5.4, 23.7, 217.5); // North deck
    addSolidBox(2.2, 23.2, 217.5, 5.4, 23.7, 223.5);  // East deck
    addSolidBox(-5.4, 23.2, 222.5, 5.4, 23.7, 225.4); // South deck
    addSolidBox(-5.4, 23.2, 217.5, -1.8, 23.7, 223.5); // West deck

    // Ornate Safety Perimeter Railings (Height 1.4m, keeps player safe while observing!)
    addSolidBox(-5.4, 23.7, 214.5, 5.4, 25.2, 215.3); // North railing
    addSolidBox(-5.4, 23.7, 224.7, 5.4, 25.2, 225.5); // South railing
    addSolidBox(4.8, 23.7, 214.8, 5.5, 25.2, 225.2);  // East railing
    addSolidBox(-5.5, 23.7, 214.8, -4.8, 25.2, 225.2); // West railing

    // Visual Railing Posts and Rings
    for (let rp = 0; rp < 18; rp++) {
      const rAng = (rp / 18) * Math.PI * 2;
      const rx = Math.sin(rAng) * 5.2;
      const rz = Math.cos(rAng) * 5.2;
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.4, 6), darkBeamMat);
      post.position.set(rx, 23.0, rz);
      lighthouseGrp.add(post);

      const finial = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), goldMat);
      finial.position.set(rx, 23.75, rz);
      lighthouseGrp.add(finial);
    }
    const railRing = new THREE.Mesh(new THREE.TorusGeometry(5.2, 0.06, 8, 28), goldMat);
    railRing.rotation.x = Math.PI / 2;
    railRing.position.y = 23.7;
    lighthouseGrp.add(railRing);

    // 8. 4 PANORAMIC VIEWING TELESCOPES (🔭 4 Yöne Bakan Seyir Dürbünleri)
    const telescopeDirections = [
      { x: 0, z: -4.5, rotY: 0, label: "Kedi Köyü & Ulu Köprü Manzarası" },
      { x: 4.5, z: 0, rotY: -Math.PI / 2, label: "Doğu Limanı & Sonsuz Deniz" },
      { x: 0, z: 4.5, rotY: Math.PI, label: "Güney Okyanus Ufku" },
      { x: -4.5, z: 0, rotY: Math.PI / 2, label: "Ada Malikanesi & Çiçekli Yamaçlar" }
    ];

    telescopeDirections.forEach(td => {
      const telGrp = new THREE.Group();
      telGrp.position.set(td.x, 22.2, td.z);
      telGrp.rotation.y = td.rotY;

      const tTripod = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.3, 4), darkBeamMat);
      tTripod.position.y = 0.65;
      telGrp.add(tTripod);

      const tBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 1.4, 8), goldMat);
      tBarrel.rotation.x = Math.PI / 3.2;
      tBarrel.position.set(0, 1.35, 0.2);
      telGrp.add(tBarrel);

      const tLens = new THREE.Mesh(new THREE.CircleGeometry(0.15, 12), new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.6 }));
      tLens.position.set(0, 1.95, -0.15);
      telGrp.add(tLens);

      lighthouseGrp.add(telGrp);
    });

    // 9. GLASS LANTERN ROOM & ROTATING BEACON (Y = 24.2 to 28.5)
    const lhLanternRoom = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 3.0, 3.6, 16), glassDomeMat);
    lhLanternRoom.position.y = 24.1;
    lighthouseGrp.add(lhLanternRoom);

    // Rotating Glowing Light Beacon
    const lhBeacon = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.2, 0.8), lanternGlowMat);
    lhBeacon.position.y = 24.1;
    lighthouseGrp.add(lhBeacon);
    animatedStructures.push({ type: 'lighthouse_beam', mesh: lhBeacon });

    // Conical Teal Copper Roof with Weather Vane and Nautical Pennant (Y = 26 to 32m)
    const lhRoof = new THREE.Mesh(new THREE.ConeGeometry(3.5, 3.4, 16), tealRoofMat);
    lhRoof.position.y = 27.6;
    lighthouseGrp.add(lhRoof);

    const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 3.0, 8), goldMat);
    spire.position.y = 29.9;
    lighthouseGrp.add(spire);

    const vane = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.35, 0.08), goldMat);
    vane.position.y = 31.1;
    lighthouseGrp.add(vane);

    // Nautical Pennant Flag flapping at the summit
    const pennantFlag = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.8, 3), new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 }));
    pennantFlag.rotation.z = Math.PI / 2;
    pennantFlag.position.set(0.9, 31.5, 0);
    lighthouseGrp.add(pennantFlag);

    villageExpansionGroup.add(lighthouseGrp);

    // ------------------------------------------------------------------------
    // YAPI 2: 3 KATLI AHŞAP ADA MALİKANESİ & KADEMELİ TERASLAR (ISLAND CHALET)
    // Konum: x: -42, z: 155 (Geniş çiçekli ahşap teraslar ve kule)
    // ------------------------------------------------------------------------
    console.log("🏡 Building 3-Tiered Alpine Island Chalet Manor (x: -42, z: 155)...");
    const chaletGrp = new THREE.Group();
    chaletGrp.position.set(-42, 1.6, 155);

    // Ground Floor (13m x 11m x 4.5m)
    const chGF = new THREE.Mesh(new THREE.BoxGeometry(13, 4.5, 11), stoneBrickMat);
    chGF.position.y = 2.25;
    chaletGrp.add(chGF);
    addSolidBox(-48.5, 1.6, 149.5, -35.5, 6.1, 160.5);

    // Floor 1 Wrap-Around Verandah Deck (Y = 6.1, Walkable terrace!)
    const chDeck = new THREE.Mesh(new THREE.BoxGeometry(15, 0.5, 13), woodPlankMat);
    chDeck.position.y = 4.75;
    chaletGrp.add(chDeck);
    addSolidBox(-49.5, 6.1, 148.5, -34.5, 6.5, 161.5);

    // Outdoor Wooden Steps leading to Floor 1 Deck
    for (let cs = 0; cs < 7; cs++) {
      const cY = 1.6 + cs * 0.64;
      const cZ = 148 - cs * 0.85;
      const cStep = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.5, 1.0), woodPlankMat);
      cStep.position.set(4.5, cY - 1.6, cZ - 155);
      chaletGrp.add(cStep);
      addSolidBox(-39, cY - 0.3, cZ - 0.5, -36, cY + 0.35, cZ + 0.5);
    }

    // Floor 2 Timber Log Body (10m x 8m x 4m)
    const chF2 = new THREE.Mesh(new THREE.BoxGeometry(10, 4.0, 8), darkBeamMat);
    chF2.position.y = 6.8;
    chaletGrp.add(chF2);
    addSolidBox(-47, 6.5, 151, -37, 10.5, 159);

    // Tier 1 Eaves Sloped Roof
    const chRoof1 = new THREE.Mesh(new THREE.ConeGeometry(9.5, 2.5, 4), terracottaRoofMat);
    chRoof1.rotation.y = Math.PI / 4;
    chRoof1.position.y = 9.8;
    chaletGrp.add(chRoof1);

    // Floor 3 Lookout Tower Loft (6m x 5m x 3.5m)
    const chF3 = new THREE.Mesh(new THREE.BoxGeometry(6, 3.5, 5), woodPlankMat);
    chF3.position.y = 11.5;
    chaletGrp.add(chF3);
    addSolidBox(-45, 10.5, 152.5, -39, 14.0, 157.5);

    // Top Crest Peak Roof
    const chRoof2 = new THREE.Mesh(new THREE.ConeGeometry(5.5, 2.8, 4), terracottaRoofMat);
    chRoof2.rotation.y = Math.PI / 4;
    chRoof2.position.y = 14.5;
    chaletGrp.add(chRoof2);

    villageExpansionGroup.add(chaletGrp);

    // ------------------------------------------------------------------------
    // YAPI 3: ANTİK KEMERLİ SU KEMERİ & ŞELALELİ TAŞ KÖŞK (AQUEDUCT & KEEP)
    // Konum: x: 42, z: 155 (Üzerinde yürünebilir 12m yüksek taş kemerler!)
    // ------------------------------------------------------------------------
    console.log("🏛️ Building Walkable Arched Aqueduct & Waterfall Keep (x: 42, z: 155)...");
    const aqueductGrp = new THREE.Group();
    aqueductGrp.position.set(42, 1.6, 155);

    // Aqueduct High Stone Pier Arches (Walkable upper conduit at Y = 8.5m)
    const aqWalkway = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.8, 28), stoneBrickMat);
    aqWalkway.position.set(0, 7.6, 0);
    aqueductGrp.add(aqWalkway);
    addSolidBox(40.2, 9.6, 141, 43.8, 10.2, 169);

    // 4 Grand Arch Pillars
    [-10, -3.5, 3.5, 10].forEach(pz => {
      const pil = new THREE.Mesh(new THREE.BoxGeometry(3.0, 7.6, 2.0), darkStoneMat);
      pil.position.set(0, 3.8, pz);
      aqueductGrp.add(pil);
      addSolidBox(40.5, 1.6, 155 + pz - 1.0, 43.5, 9.6, 155 + pz + 1.0);
    });

    // Waterfall cascading from aqueduct terminus into lower pool
    const waterfallMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 7.2), waterDeepMat);
    waterfallMesh.position.set(0, 4.0, -14.1);
    aqueductGrp.add(waterfallMesh);

    // Lower Splash Pool
    const splashPool = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 5.0, 0.6, 16), waterDeepMat);
    splashPool.position.set(0, 0.3, -15);
    aqueductGrp.add(splashPool);

    villageExpansionGroup.add(aqueductGrp);

    // ------------------------------------------------------------------------
    // YAPI 4: KAZIKLI TROPİK RIHTIM & BALIKÇI İSKELESİ (STILT HARBOR PIER)
    // Konum: x: 38, z: 210 (Gölün güneydoğu kıyısında ahşap kazıklı iskele)
    // ------------------------------------------------------------------------
    console.log("⚓ Building Elevated Stilt Harbor Pier & Fishing Boardwalk...");
    const harborGrp = new THREE.Group();
    harborGrp.position.set(38, 1.6, 210);

    // Heavy Timber Stilts
    [[-4, -4], [4, -4], [-4, 4], [4, 4]].forEach(([px, pz]) => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 4.5, 8), darkBeamMat);
      pole.position.set(px, 1.5, pz);
      harborGrp.add(pole);
    });

    // Elevated Boardwalk Deck (Size: 14m x 14m, Y = 3.2m)
    const harborDeck = new THREE.Mesh(new THREE.BoxGeometry(14, 0.5, 14), woodPlankMat);
    harborDeck.position.set(0, 1.5, 0);
    harborGrp.add(harborDeck);
    addSolidBox(31, 2.8, 203, 45, 3.4, 217);

    // Moored Little Sailboat
    const boatBody = new THREE.Mesh(new THREE.ConeGeometry(1.8, 4.5, 4), darkBeamMat);
    boatBody.rotation.x = Math.PI / 2;
    boatBody.position.set(8.5, -0.2, 0);
    harborGrp.add(boatBody);

    const boatMast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.5, 6), darkBeamMat);
    boatMast.position.set(8.5, 1.8, 0);
    harborGrp.add(boatMast);

    const boatSail = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 2.5), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8, side: THREE.DoubleSide }));
    boatSail.position.set(9.2, 2.0, 0);
    harborGrp.add(boatSail);

    villageExpansionGroup.add(harborGrp);

    // ========================================================================
    // 4. GERÇEK CANLILARA BENZEYEN HAYVANLAR (REALISTIC ANIMALS SAFARI)
    // Gerçekçi anatomik oranlar, doğal kürk renkleri ve canlı animasyonlar!
    // ========================================================================
    console.log("🦌 Spawning Realistic Animal Wildlife on the Island...");

    // A) ASİL KIZIL GEYİK (REALISTIC RED DEER STAG WITH BRANCHING ANTLERS) 🦌
    const stag = createRealisticStag(THREE);
    stag.position.set(-18, 1.68, 138);
    stag.rotation.y = 0.6;
    villageExpansionGroup.add(stag);
    animatedAnimals.push({ type: 'deer', mesh: stag, baseY: 1.68, speed: 1.4 });

    // B) ZARİF DAĞ CEYLANI (REALISTIC GAZELLE / DOE) 🦌
    const gazelle = createRealisticGazelle(THREE);
    gazelle.position.set(-14, 1.68, 144);
    gazelle.rotation.y = -0.4;
    villageExpansionGroup.add(gazelle);
    animatedAnimals.push({ type: 'gazelle', mesh: gazelle, baseY: 1.68, speed: 1.6 });

    // C) KIZIL TİLKİ & YAVRUSU (REALISTIC RED FOX WITH BUSHY WHITE-TIPPED TAIL) 🦊
    const fox = createRealisticFox(THREE);
    fox.position.set(20, 1.68, 140);
    fox.rotation.y = -0.8;
    villageExpansionGroup.add(fox);
    animatedAnimals.push({ type: 'fox', mesh: fox, baseY: 1.68, speed: 2.2 });

    const babyFox = createRealisticFox(THREE, 0.65);
    babyFox.position.set(23, 1.68, 142);
    babyFox.rotation.y = -0.5;
    villageExpansionGroup.add(babyFox);
    animatedAnimals.push({ type: 'fox', mesh: babyFox, baseY: 1.68, speed: 2.5 });

    // D) YABAN TAVŞANLARI (REALISTIC WILD HARES / COTTONTAIL RABBITS) 🐇
    [
      { x: -28, z: 180 },
      { x: -25, z: 184 },
      { x: 18, z: 185 }
    ].forEach((rp, idx) => {
      const hare = createRealisticHare(THREE);
      hare.position.set(rp.x, 1.68, rp.z);
      hare.rotation.y = Math.random() * Math.PI * 2;
      villageExpansionGroup.add(hare);
      animatedAnimals.push({ type: 'hare', mesh: hare, baseY: 1.68, animOffset: idx * 1.5 });
    });

    // E) KRALİYET BEYAZ KUĞULARI (REALISTIC SWANS GLIDING IN LAGOON) 🦢
    [
      { x: -4, z: 144, rot: 0.2 },
      { x: 4, z: 146, rot: -0.4 }
    ].forEach((sp, sIdx) => {
      const swan = createRealisticSwan(THREE);
      swan.position.set(sp.x, 1.76, sp.z);
      swan.rotation.y = sp.rot;
      villageExpansionGroup.add(swan);
      animatedAnimals.push({ type: 'swan', mesh: swan, centerX: sp.x, centerZ: sp.z, radius: 4.5, sIdx: sIdx });
    });

    // F) KAYA KARTALI (REALISTIC MOUNTAIN EAGLE PERCHED ON HIGH ROCK) 🦅
    const eagle = createRealisticEagle(THREE);
    eagle.position.set(-62, 15.2, 135);
    eagle.rotation.y = 1.2;
    villageExpansionGroup.add(eagle);
    animatedAnimals.push({ type: 'eagle', mesh: eagle });

    // G) SU SAMURLARI (REALISTIC OTTERS PLAYING IN WATER) 🦦
    const otter = createRealisticOtter(THREE);
    otter.position.set(0, 1.72, 150);
    villageExpansionGroup.add(otter);
    animatedAnimals.push({ type: 'otter', mesh: otter });

    // ========================================================================
    // 5. DOĞA ADASI KILAVUZU & DİYALOGLAR (NPCS - NO SPACE REFERENCES!)
    // ========================================================================
    const openRealms = getOpenRegionsList();
    const openRealmsSummary = openRealms.join(", ");

    // A) Baş Korucu Doğa Ayısı Barni 🌲🐻 (Ada Girişinde, x: 5, z: 102)
    const rangerMesh = createBearCitizenMesh(THREE, 0x78350f);
    rangerMesh.position.set(5, 1.68, 102);
    rangerMesh.rotation.y = Math.PI - 0.2;
    villageExpansionGroup.add(rangerMesh);
    friendlyCreatures.push({
      id: 'npc_korucu_barni',
      name: 'Korucu Doğa Ayısı Barni 🌲🐻',
      role: 'Ada Muhafızı',
      avatarIcon: '🌲',
      mesh: rangerMesh,
      pos: rangerMesh.position,
      dialogue: [
        `Ulu Köprü'yü aşıp yeni Büyük Doğa Adası'na hoş geldin cesur ayı!`,
        `Köyümüzün dağları, Mori'nin gizli inleri ve evleri ana merkezimizde huzurla duruyor. Biz de güneydeki açık sulara bu yemyeşil dev adayı kazandırdık!`,
        `Burada asil kızıl geyikler, çalı kuyruklu tilkiler, gölette süzülen beyaz kuğular ve 26 metrelik Deniz Feneri seni bekliyor!`,
        `Köyümüzde sadece şu an açık olan macera kapıları konuşuluyor: 【 ${openRealmsSummary} 】! İyi gezintiler dilerim!`
      ]
    });

    // B) Denizci Kedi Kaptan Miço ⚓🐱 (Deniz Feneri Girişinde, x: 5, z: 215)
    const captainCat = createKittenCitizenMesh(THREE, 0x38bdf8);
    captainCat.position.set(5, 1.68, 215);
    captainCat.rotation.y = -Math.PI / 2;
    villageExpansionGroup.add(captainCat);
    friendlyCreatures.push({
      id: 'npc_kaptan_mico',
      name: 'Denizci Kedi Kaptan Miço ⚓🐱',
      role: 'Fener Bekçisi',
      avatarIcon: '⚓',
      mesh: captainCat,
      pos: captainCat.position,
      dialogue: [
        `Miyav! 26 metre yüksekliğindeki bu dev Deniz Feneri'nin taş basamaklarından balkona çıkabilirsin!`,
        `En üst balkondan baktığında hem ana köyün dağlarını hem de açık macera dünyalarımızın parıldayan kapılarını görebilirsin!`,
        `Göletimizdeki asil kuğuları ve çayırlardaki geyikleri rahatsız etmeden adanın tadını çıkar miyav!`
      ]
    });

    // ========================================================================
    // 5. YEPYENİ ŞIK VE PARLAK YUVARLAK ALTINLAR & LEZZETLİ YEMEKLER
    // (SLEEK ROUND GOLD COINS & INTERACTIVE FOOD SPREAD ACROSS THE ISLAND)
    // Yuvarlak, ışıl ışıl parlayan kabartmalı altın sikkeler, taze dağ elmaları,
    // çıtır köy ekmekleri, ızgara balıklar, kremalı pastalar ve saf bal kavanozları!
    // ========================================================================
    console.log("🪙 Scattering Sleek Round Gold Coins & Fresh Island Food Items...");

    function createSleekRoundGoldCoin(x, y, z, val = 25, label = '🪙 Parlak Altın Sikke') {
      const coinGroup = new THREE.Group();
      coinGroup.position.set(x, y, z);

      // Sleek Round Gold Cylinder Core with Beveled Chamfer
      const coreMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.38, 0.38, 0.08, 24),
        goldMat
      );
      coreMesh.rotation.x = Math.PI / 2;
      coinGroup.add(coreMesh);

      // Outer Torus Rim for high-polish round coin look
      const rimMesh = new THREE.Mesh(
        new THREE.TorusGeometry(0.36, 0.045, 10, 24),
        goldMat
      );
      coinGroup.add(rimMesh);

      // Embossed Star / Paw relief in center (on both faces)
      [-0.046, 0.046].forEach(sideZ => {
        const star = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 6, 6),
          new THREE.MeshStandardMaterial({
            color: 0xfffbeb,
            metalness: 0.95,
            roughness: 0.15,
            emissive: 0xf59e0b,
            emissiveIntensity: 0.45
          })
        );
        star.scale.set(1.0, 1.0, 0.22);
        star.position.set(0, 0, sideZ);
        coinGroup.add(star);
      });

      villageExpansionGroup.add(coinGroup);

      const colItem = {
        id: `island_coin_${x}_${z}`,
        type: 'coin',
        name: label,
        val: val,
        pos: new THREE.Vector3(x, y, z),
        mesh: coinGroup,
        collected: false,
        baseY: y
      };
      islandCollectibles.push(colItem);

      if (game && game.currentLevel && game.currentLevel.collectibles && isHubActive) {
        game.currentLevel.collectibles.push({
          type: 'coin',
          value: val,
          pos: new THREE.Vector3(x, y, z),
          mesh: coinGroup,
          collected: false
        });
      }
    }
    window.createSleekRoundGoldCoin = createSleekRoundGoldCoin;
    window.create3DGoldCoin = createSleekRoundGoldCoin;

    function createInteractiveFoodItem(type, x, y, z) {
      const foodGroup = new THREE.Group();
      foodGroup.position.set(x, y, z);
      let name = '🍎 Taze Köy Elması';
      let heal = 25;
      let val = 15;

      if (type === 'apple') {
        name = '🍎 Kırmızı Yayla Elması';
        heal = 25;
        val = 15;
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 12), new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.35 }));
        foodGroup.add(body);
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.15, 6), darkBeamMat);
        stem.position.set(0, 0.24, 0);
        foodGroup.add(stem);
        const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.08), new THREE.MeshStandardMaterial({ color: 0x16a34a }));
        leaf.position.set(0.08, 0.26, 0);
        foodGroup.add(leaf);
      } else if (type === 'bread') {
        name = '🍞 Taze Köy Fırın Ekmeği';
        heal = 30;
        val = 20;
        const loaf = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.6, 12), new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 }));
        loaf.rotation.z = Math.PI / 2;
        foodGroup.add(loaf);
      } else if (type === 'fish') {
        name = '🐟 Taze Izgara Göl Balığı';
        heal = 35;
        val = 25;
        const spit = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.85, 6), woodPlankMat);
        spit.rotation.z = Math.PI / 3;
        foodGroup.add(spit);
        const body = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.55, 8), new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.4, metalness: 0.6 }));
        body.rotation.z = -Math.PI / 6;
        foodGroup.add(body);
      } else if (type === 'cake') {
        name = '🍰 Çilekli Kremalı Pasta';
        heal = 45;
        val = 35;
        const wedge = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.28, 0.45), new THREE.MeshStandardMaterial({ color: 0xfdf4ff, roughness: 0.5 }));
        foodGroup.add(wedge);
        const icing = new THREE.Mesh(new THREE.BoxGeometry(0.47, 0.08, 0.47), new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.3 }));
        icing.position.y = 0.16;
        foodGroup.add(icing);
        const berry = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), new THREE.MeshStandardMaterial({ color: 0xbe123c }));
        berry.position.y = 0.25;
        foodGroup.add(berry);
      } else if (type === 'honey_jar') {
        name = '🍯 Saf Yayla Balı Kavanozu';
        heal = 60;
        val = 50;
        const jar = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.4, 12), new THREE.MeshStandardMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.85, roughness: 0.2 }));
        foodGroup.add(jar);
        const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.08, 12), darkBeamMat);
        lid.position.y = 0.22;
        foodGroup.add(lid);
      }

      villageExpansionGroup.add(foodGroup);

      const colItem = {
        id: `island_food_${type}_${x}_${z}`,
        type: 'food',
        name: name,
        heal: heal,
        val: val,
        isFood: true,
        pos: new THREE.Vector3(x, y, z),
        mesh: foodGroup,
        collected: false,
        baseY: y
      };
      islandCollectibles.push(colItem);

      if (game && game.currentLevel && game.currentLevel.collectibles && isHubActive) {
        game.currentLevel.collectibles.push({
          type: 'coin',
          isFood: true,
          name: name,
          heal: heal,
          value: val,
          pos: new THREE.Vector3(x, y, z),
          mesh: foodGroup,
          collected: false
        });
      }
    }

    // A) DENİZ FENERİ ETRAFI, GİRİŞİ, İÇİ VE 26M SEYİR ZİRVESİ 🗼
    createSleekRoundGoldCoin(0, 2.0, 208.5, 25, '🪙 Fener Giriş Basamak Altını');
    createSleekRoundGoldCoin(0, 3.4, 215.0, 30, '🪙 Fener Ana Kapı Altını');
    createSleekRoundGoldCoin(1.8, 13.5, 220, 35, '🪙 Fener İçi Spiral Merdiven Altını');
    createInteractiveFoodItem('apple', -1.8, 13.5, 220); // Merdiven ortası mola elması
    createSleekRoundGoldCoin(-3.0, 24.2, 220, 50, '👑 Fener Zirvesi Seyir Altını');
    createSleekRoundGoldCoin(3.0, 24.2, 220, 50, '👑 Fener Zirvesi Seyir Altını');
    createSleekRoundGoldCoin(0, 24.2, 224.0, 50, '👑 Fener Zirvesi Seyir Altını');
    createInteractiveFoodItem('honey_jar', 2.0, 24.2, 216.5); // Zirve bal ödülü!
    createInteractiveFoodItem('cake', -2.0, 24.2, 216.5); // Zirve pasta ödülü!

    // B) ADA DAĞ MALİKANESİ & TERASLAR 🏡
    createSleekRoundGoldCoin(-42, 6.5, 155, 35, '🏡 Dağ Evi Teras Altını');
    createSleekRoundGoldCoin(-35, 1.8, 150, 25, '🏡 Bahçe Yolu Altını');
    createInteractiveFoodItem('bread', -40, 6.5, 158);
    createInteractiveFoodItem('apple', -46, 1.8, 152);

    // C) KIZIL GEYİK VE CEYLAN HUZUR ÇAYIRI 🦌
    createSleekRoundGoldCoin(-18, 1.8, 142, 30, '🦌 Asil Geyik Çayır Altını');
    createInteractiveFoodItem('apple', -14, 1.8, 135);
    createInteractiveFoodItem('cake', -22, 1.8, 145);

    // D) KUĞU VE ÖRDEK BÜYÜLÜ GÖLETİ 🦆
    createSleekRoundGoldCoin(35, 1.8, 145, 30, '🦆 Kuğu Göleti Altını');
    createInteractiveFoodItem('bread', 30, 1.8, 140);
    createInteractiveFoodItem('honey_jar', 40, 1.8, 150);

    // E) GÜNEY BALIKÇI İSKELESİ & KUM SAHİL 🏖️
    createSleekRoundGoldCoin(38, 3.6, 210, 35, '⚓ Balıkçı İskelesi Altını');
    createInteractiveFoodItem('fish', 42, 3.6, 208);
    createSleekRoundGoldCoin(-30, 0.8, 105, 30, '🏖️ Kum Sahil Altını');
    createInteractiveFoodItem('fish', -25, 0.8, 108);

    // F) ULU ASMA KÖPRÜ BOYUNCA 🌉
    createSleekRoundGoldCoin(0, 1.8, 55, 25, '🌉 Ulu Köprü Altını');
    createSleekRoundGoldCoin(0, 1.8, 70, 25, '🌉 Ulu Köprü Altını');
    createSleekRoundGoldCoin(0, 1.8, 85, 25, '🌉 Ulu Köprü Altını');
    createInteractiveFoodItem('bread', 2.0, 1.8, 70);

    // G) VOLEYBOL & TENİS KORTU TERASI 🏐
    createSleekRoundGoldCoin(20, 2.4, -24, 25, '🏐 Kort Kenarı Altını');
    createSleekRoundGoldCoin(36, 2.4, -24, 25, '🏐 Kort Kenarı Altını');
    createSleekRoundGoldCoin(20, 2.4, -6, 25, '🏐 Kort Kenarı Altını');
    createSleekRoundGoldCoin(36, 2.4, -6, 25, '🏐 Kort Kenarı Altını');
    createInteractiveFoodItem('apple', 28, 2.4, -26);
    createInteractiveFoodItem('cake', 37, 2.4, -15);

    console.log(`✅ Grand Safari Island Expansion v4.0 loaded! Colliders active: ${expansionColliders.length}`);
  }

  // ==========================================================================
  // ANATOMICALLY REALISTIC ANIMAL 3D MESH BUILDERS
  // ==========================================================================

  // 1. ASİL KIZIL GEYİK (REALISTIC RED DEER STAG)
  function createRealisticStag(THREE) {
    const grp = new THREE.Group();
    const coatMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.7 }); // Rich russet brown
    const bellyMat = new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.8 }); // Light fawn
    const antlerMat = new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.5 }); // Bone antler
    const hoofMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.4 });
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x09090b });

    // Torso (Realistic contoured barrel chest & flank)
    const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.48, 1.6, 10), coatMat);
    chest.rotation.x = Math.PI / 2;
    chest.position.set(0, 1.4, 0);
    grp.add(chest);

    // Slender 4 Legs with Joint Angles & Hooves
    const legCoords = [
      [-0.32, 0.55], [0.32, 0.55], // Front legs
      [-0.32, -0.55], [0.32, -0.55] // Hind legs
    ];
    legCoords.forEach(([lx, lz]) => {
      const upperLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.09, 0.8, 6), coatMat);
      upperLeg.position.set(lx, 1.0, lz);
      grp.add(upperLeg);

      const lowerLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.8, 6), coatMat);
      lowerLeg.position.set(lx, 0.4, lz);
      grp.add(lowerLeg);

      const hoof = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.14), hoofMat);
      hoof.position.set(lx, 0.06, lz + 0.02);
      grp.add(hoof);
    });

    // Neck (Elegantly angled upwards)
    const neckGrp = new THREE.Group();
    neckGrp.position.set(0, 1.6, 0.65);
    neckGrp.name = 'deer_neck';

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.38, 0.9, 8), coatMat);
    neck.rotation.x = -Math.PI / 4;
    neck.position.set(0, 0.3, 0.25);
    neckGrp.add(neck);

    // Head & Tapered Muzzle
    const head = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.65, 8), coatMat);
    head.rotation.x = -Math.PI / 3;
    head.position.set(0, 0.65, 0.55);
    neckGrp.add(head);

    // Eyes
    [-0.14, 0.14].forEach(ex => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), eyeMat);
      eye.position.set(ex, 0.72, 0.58);
      neckGrp.add(eye);

      // Ears
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.3, 4), coatMat);
      ear.rotation.z = ex > 0 ? -0.5 : 0.5;
      ear.rotation.x = -0.3;
      ear.position.set(ex * 1.5, 0.85, 0.45);
      neckGrp.add(ear);
    });

    // Realistic 8-Point Branching Antlers 🦌
    [-0.18, 0.18].forEach((ax, sIdx) => {
      const mainBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.9, 6), antlerMat);
      mainBeam.rotation.z = sIdx === 0 ? 0.35 : -0.35;
      mainBeam.rotation.x = -0.4;
      mainBeam.position.set(ax, 1.15, 0.35);
      neckGrp.add(mainBeam);

      // Antler tines (Brow & Trez tines)
      [0.25, 0.55].forEach(th => {
        const tine = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 0.35, 4), antlerMat);
        tine.rotation.z = sIdx === 0 ? -0.5 : 0.5;
        tine.rotation.x = 0.4;
        tine.position.set(ax + (sIdx === 0 ? -0.1 : 0.1), 0.9 + th, 0.42);
        neckGrp.add(tine);
      });
    });

    grp.add(neckGrp);

    // Small White-Tipped Tail
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.25, 4), bellyMat);
    tail.rotation.x = Math.PI / 3;
    tail.position.set(0, 1.45, -0.85);
    grp.add(tail);

    return grp;
  }

  // 2. ZARİF CEYLAN (REALISTIC GAZELLE / DOE)
  function createRealisticGazelle(THREE) {
    const grp = new THREE.Group();
    const coatMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.65 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.8 });

    const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.38, 1.3, 8), coatMat);
    chest.rotation.x = Math.PI / 2;
    chest.position.set(0, 1.1, 0);
    grp.add(chest);

    [[-0.24, 0.45], [0.24, 0.45], [-0.24, -0.45], [0.24, -0.45]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 1.1, 6), coatMat);
      leg.position.set(lx, 0.55, lz);
      grp.add(leg);
    });

    const neckGrp = new THREE.Group();
    neckGrp.position.set(0, 1.2, 0.5);
    neckGrp.name = 'gazelle_neck';

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 0.7, 6), coatMat);
    neck.rotation.x = -Math.PI / 4;
    neck.position.set(0, 0.25, 0.2);
    neckGrp.add(neck);

    const head = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.5, 6), coatMat);
    head.rotation.x = -Math.PI / 3;
    head.position.set(0, 0.55, 0.45);
    neckGrp.add(head);

    // Delicate horns
    [-0.08, 0.08].forEach(hx => {
      const horn = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.4, 4), new THREE.MeshStandardMaterial({ color: 0x27272a }));
      horn.rotation.x = -0.5;
      horn.position.set(hx, 0.8, 0.35);
      neckGrp.add(horn);
    });

    grp.add(neckGrp);
    return grp;
  }

  // 3. KIZIL TİLKİ (REALISTIC RED FOX WITH BUSHY WHITE TAIL) 🦊
  function createRealisticFox(THREE, scale = 1.0) {
    const grp = new THREE.Group();
    grp.scale.set(scale, scale, scale);

    const orangeMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.6 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4 });

    // Sleek Fox Body
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.9, 8), orangeMat);
    body.rotation.x = Math.PI / 2;
    body.position.set(0, 0.5, 0);
    grp.add(body);

    // White Chest Bib
    const bib = new THREE.Mesh(new THREE.SphereGeometry(0.2, 6, 6), whiteMat);
    bib.position.set(0, 0.55, 0.35);
    grp.add(bib);

    // 4 Slender Legs with black stockings
    [[-0.15, 0.3], [0.15, 0.3], [-0.15, -0.3], [0.15, -0.3]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.5, 6), darkMat);
      leg.position.set(lx, 0.25, lz);
      grp.add(leg);
    });

    // Fox Head & Pointed Muzzle
    const headGrp = new THREE.Group();
    headGrp.position.set(0, 0.65, 0.45);
    headGrp.name = 'fox_head';

    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), orangeMat);
    headGrp.add(skull);

    const muzzle = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.35, 6), whiteMat);
    muzzle.rotation.x = -Math.PI / 2;
    muzzle.position.set(0, -0.04, 0.2);
    headGrp.add(muzzle);

    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.04, 4, 4), darkMat);
    nose.position.set(0, -0.04, 0.36);
    headGrp.add(nose);

    // Pointed Triangular Ears with black backs
    [-0.12, 0.12].forEach(ex => {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.24, 4), darkMat);
      ear.position.set(ex, 0.2, 0);
      headGrp.add(ear);
    });

    grp.add(headGrp);

    // Big Bushy Tail with Snowy White Tip!
    const tailGrp = new THREE.Group();
    tailGrp.position.set(0, 0.5, -0.45);
    tailGrp.name = 'fox_tail';

    const tailMain = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.18, 0.5, 6), orangeMat);
    tailMain.rotation.x = Math.PI / 3;
    tailMain.position.set(0, 0.15, -0.2);
    tailGrp.add(tailMain);

    const tailTip = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.3, 6), whiteMat);
    tailTip.rotation.x = Math.PI / 3;
    tailTip.position.set(0, 0.32, -0.38);
    tailGrp.add(tailTip);

    grp.add(tailGrp);

    return grp;
  }

  // 4. YABAN TAVŞANI (REALISTIC WILD HARE) 🐇
  function createRealisticHare(THREE) {
    const grp = new THREE.Group();
    const furMat = new THREE.MeshStandardMaterial({ color: 0xa8a29e, roughness: 0.6 }); // Fawn/grey fur
    const earInnerMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.5 });

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 8), furMat);
    body.position.set(0, 0.24, 0);
    body.scale.set(0.9, 1.0, 1.3);
    grp.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), furMat);
    head.position.set(0, 0.38, 0.22);
    grp.add(head);

    // Long alert ears
    [-0.08, 0.08].forEach(ex => {
      const ear = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.32, 0.04), furMat);
      ear.position.set(ex, 0.62, 0.18);
      ear.rotation.x = -0.15;
      grp.add(ear);

      const inner = new THREE.Mesh(new THREE.PlaneGeometry(0.04, 0.22), earInnerMat);
      inner.position.set(ex, 0.62, 0.21);
      inner.rotation.x = -0.15;
      grp.add(inner);
    });

    // Fluffy puff tail
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    puff.position.set(0, 0.24, -0.3);
    grp.add(puff);

    return grp;
  }

  // 5. BEYAZ KUĞU (REALISTIC SWAN GLIDING ON WATER) 🦢
  function createRealisticSwan(THREE) {
    const grp = new THREE.Group();
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.4 });
    const billMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4 }); // Orange bill
    const blackKnobMat = new THREE.MeshStandardMaterial({ color: 0x18181b });

    // Floating Body
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.35, 10, 10), whiteMat);
    body.scale.set(0.8, 0.6, 1.4);
    body.position.y = 0.15;
    grp.add(body);

    // Graceful Long S-Neck
    const neckMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.75, 8), whiteMat);
    neckMesh.position.set(0, 0.5, 0.35);
    neckMesh.rotation.x = 0.2;
    grp.add(neckMesh);

    // Head & Curved Crown
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), whiteMat);
    head.position.set(0, 0.85, 0.42);
    grp.add(head);

    // Orange Bill
    const bill = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.22, 6), billMat);
    bill.rotation.x = -Math.PI / 2;
    bill.position.set(0, 0.82, 0.56);
    grp.add(bill);

    // Black Basal Knob
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.04, 4, 4), blackKnobMat);
    knob.position.set(0, 0.86, 0.48);
    grp.add(knob);

    return grp;
  }

  // 6. KAYA KARTALI (REALISTIC MOUNTAIN EAGLE) 🦅
  function createRealisticEagle(THREE) {
    const grp = new THREE.Group();
    const darkFeather = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.6 });
    const goldHead = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 });
    const yellowBeak = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 });

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 0.7, 8), darkFeather);
    body.position.y = 0.45;
    grp.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), goldHead);
    head.position.set(0, 0.85, 0.05);
    head.name = 'eagle_head';
    grp.add(head);

    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.2, 4), yellowBeak);
    beak.rotation.x = -Math.PI / 2;
    beak.position.set(0, 0.82, 0.22);
    head.add(beak);

    // Folded Wings
    [-0.3, 0.3].forEach(wx => {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.65, 0.4), darkFeather);
      wing.position.set(wx, 0.45, -0.05);
      grp.add(wing);
    });

    return grp;
  }

  // 7. SU SAMURU (REALISTIC OTTER) 🦦
  function createRealisticOtter(THREE) {
    const grp = new THREE.Group();
    const sleekFur = new THREE.MeshStandardMaterial({ color: 0x5c2b08, roughness: 0.4 });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.8, 8), sleekFur);
    body.rotation.x = Math.PI / 2;
    body.position.y = 0.1;
    grp.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), sleekFur);
    head.position.set(0, 0.12, 0.45);
    grp.add(head);

    return grp;
  }

  // Helper Gate
  function createArchGate(THREE, stoneMat, darkMat, goldMat, lanternMat) {
    const grp = new THREE.Group();
    [-4.5, 4.5].forEach(px => {
      const p = new THREE.Mesh(new THREE.BoxGeometry(2.0, 7.5, 2.5), stoneMat);
      p.position.set(px, 3.75, 0);
      grp.add(p);

      const cap = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.8, 2.8), darkMat);
      cap.position.set(px, 7.8, 0);
      grp.add(cap);

      const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), lanternMat);
      lantern.position.set(px, 5.0, 1.4);
      grp.add(lantern);
    });

    const lintel = new THREE.Mesh(new THREE.BoxGeometry(11, 1.6, 2.2), stoneMat);
    lintel.position.set(0, 6.8, 0);
    grp.add(lintel);

    const crest = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.4, 0.4), goldMat);
    crest.position.set(0, 7.8, 1.1);
    grp.add(crest);

    return grp;
  }

  function createBearCitizenMesh(THREE, colorHex) {
    const grp = new THREE.Group();
    const furMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.7 });
    const muzzleMat = new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.6 });

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 1.4, 10), furMat);
    body.position.y = 0.8;
    grp.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.48, 10, 10), furMat);
    head.position.set(0, 1.75, 0.05);
    grp.add(head);

    const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 8), muzzleMat);
    muzzle.position.set(0, 1.65, 0.42);
    grp.add(muzzle);

    [-0.32, 0.32].forEach(ex => {
      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.16, 6, 6), furMat);
      ear.position.set(ex, 2.2, 0);
      grp.add(ear);
    });

    return grp;
  }

  function createKittenCitizenMesh(THREE, colorHex) {
    const grp = new THREE.Group();
    const furMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.6 });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.42, 1.1, 8), furMat);
    body.position.y = 0.65;
    grp.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 8, 8), furMat);
    head.position.set(0, 1.35, 0);
    grp.add(head);

    [-0.18, 0.18].forEach(ex => {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.28, 4), furMat);
      ear.position.set(ex, 1.7, 0);
      grp.add(ear);
    });

    return grp;
  }

  // --------------------------------------------------------------------------
  // PER-FRAME UPDATE LOOP & RIGID REGION SCOPING
  // --------------------------------------------------------------------------
  function updateVillageExpansionEngine() {
    const game = window.__superBearGame;
    if (!game || !game.scene) return;

    const currentRegion = game.currentRegion || 'hub';

    // STRICT ISOLATION: Sadece Ayı Köyü'nde ('hub') görünmeli!
    if (currentRegion !== 'hub') {
      if (villageExpansionGroup) {
        villageExpansionGroup.visible = false;
        if (villageExpansionGroup.parent) {
          villageExpansionGroup.parent.remove(villageExpansionGroup);
        }
      }
      if (game.currentLevel && game.currentLevel.colliders) {
        game.currentLevel.colliders = game.currentLevel.colliders.filter(c => !c.isVillageExpansionCollider);
      }
      isHubActive = false;
      return;
    }

    // Returning to hub: restore visibility & attach
    if (!isHubActive || !villageExpansionGroup || !villageExpansionGroup.parent) {
      isHubActive = true;
      if (!villageExpansionGroup) {
        buildVillageExpansion(game.scene);
      } else {
        game.scene.add(villageExpansionGroup);
        villageExpansionGroup.visible = true;
        if (game.currentLevel && game.currentLevel.colliders) {
          expansionColliders.forEach(c => {
            if (!game.currentLevel.colliders.includes(c)) {
              game.currentLevel.colliders.push(c);
            }
          });
        }
      }
    }

    if (villageExpansionGroup) {
      villageExpansionGroup.visible = true;
    }

    const now = Date.now();
    const time = now * 0.001;

    // 1. Animate structures (Lighthouse beam rotation)
    animatedStructures.forEach(item => {
      if (item.type === 'lighthouse_beam' && item.mesh) {
        item.mesh.rotation.y += 0.03;
      }
    });

    // 2. Animate realistic animals with natural lifelike movements!
    animatedAnimals.forEach(anim => {
      if (anim.type === 'deer') {
        const neck = anim.mesh.getObjectByName('deer_neck');
        if (neck) {
          neck.rotation.x = Math.sin(time * 1.2) * 0.15; // Grazing / lifting head
        }
      } else if (anim.type === 'gazelle') {
        const neck = anim.mesh.getObjectByName('gazelle_neck');
        if (neck) {
          neck.rotation.x = Math.sin(time * 1.5) * 0.12;
        }
      } else if (anim.type === 'fox') {
        const tail = anim.mesh.getObjectByName('fox_tail');
        if (tail) {
          tail.rotation.y = Math.sin(time * 3.5) * 0.35; // Wagging bushy tail
        }
        const head = anim.mesh.getObjectByName('fox_head');
        if (head) {
          head.rotation.y = Math.sin(time * 1.8) * 0.2; // Sniffing side to side
        }
      } else if (anim.type === 'hare') {
        // Hopping motion - always landing cleanly on the grassy surface
        const hopCycle = Math.abs(Math.sin((time + anim.animOffset) * 4.0));
        anim.mesh.position.y = (anim.baseY || 1.68) + hopCycle * 0.35;
      } else if (anim.type === 'swan') {
        // Smooth gliding on lagoon water surface
        const ang = time * 0.4 + anim.sIdx * Math.PI;
        anim.mesh.position.x = anim.centerX + Math.cos(ang) * anim.radius;
        anim.mesh.position.z = anim.centerZ + Math.sin(ang) * anim.radius;
        anim.mesh.rotation.y = -ang + Math.PI / 2;
        anim.mesh.position.y = 1.76 + Math.sin(time * 2.0) * 0.03; // Floating bob on top of water
      } else if (anim.type === 'eagle') {
        const head = anim.mesh.getObjectByName('eagle_head');
        if (head) {
          head.rotation.y = Math.sin(time * 0.8) * 0.4; // Surveying island from perch
        }
      } else if (anim.type === 'otter') {
        const ang = time * 0.9;
        anim.mesh.position.x = Math.sin(ang) * 5.0;
        anim.mesh.position.z = 145 + Math.cos(ang) * 5.0;
        anim.mesh.position.y = 1.72 + Math.sin(time * 3.0) * 0.04; // Swimming on water surface
        anim.mesh.rotation.y = ang;
      }
    });

    // 3. Footing & Collision Check (Smooth and solid landing on bridge and structures)
    if (game.playerPos) {
      const pPos = game.playerPos;
      const pRadius = 0.55;

      for (let i = 0; i < expansionColliders.length; i++) {
        const c = expansionColliders[i];
        if (!c || !c.min || !c.max) continue;

        if (pPos.x >= c.min.x - pRadius && pPos.x <= c.max.x + pRadius &&
            pPos.z >= c.min.z - pRadius && pPos.z <= c.max.z + pRadius) {
          const wasAbove = pPos.y >= c.max.y - 0.75;
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

      // 4. Proximity Talks with Friendly Creatures
      friendlyCreatures.forEach(npc => {
        const d = Math.sqrt(Math.pow(pPos.x - npc.pos.x, 2) + Math.pow(pPos.z - npc.pos.z, 2));
        if (d < 4.8 && Math.abs(pPos.y - npc.pos.y) < 2.5) {
          if (game.callbacks && game.callbacks.onShowNotice && now % 3500 < 50) {
            game.callbacks.onShowNotice(`💬 ${npc.name}: '${npc.dialogue[0]}'`, "info");
          }
        }
      });

      // 5. Lighthouse Summit Observation Check & Telescopes (26m Observation Deck at x: 0, z: 220, y >= 23.0)
      const dSummit = Math.hypot(pPos.x - 0, pPos.z - 220);
      if (dSummit < 5.6 && pPos.y >= 23.0) {
        if (!window.__lighthouseSummitVisited) {
          window.__lighthouseSummitVisited = true;
          if (game.callbacks && game.callbacks.onShowNotice) {
            game.callbacks.onShowNotice("🗼 TEBRİKLER! Deniz Feneri Zirvesine Çıktın! (26 Metre Seyir Terasından Tüm Ada ve Okyanus Görünüyor!) 🔭", "success");
          }
          if (typeof St !== 'undefined' && St.playGoalFanfare) St.playGoalFanfare();
        }

        // Telescopes Proximity Notice
        const telescopePoints = [
          { x: 0, z: 215.5, label: "🔭 Panoramik Dürbün: Kedi Köyü, Ulu Köprü ve Yüce Dağlar Manzarası!" },
          { x: 4.5, z: 220.0, label: "🔭 Doğu Dürbünü: Balıkçı İskelesi, Gemiler ve Sonsuz Okyanus!" },
          { x: 0, z: 224.5, label: "🔭 Ufuk Dürbünü: Masmavi Güney Açık Deniz Ufku!" },
          { x: -4.5, z: 220.0, label: "🔭 Ada Dürbünü: Kademeli Ahşap Malikane ve Çiçekli Tepeler!" }
        ];

        telescopePoints.forEach(tp => {
          const dt = Math.hypot(pPos.x - tp.x, pPos.z - tp.z);
          if (dt < 2.0 && now % 4000 < 60) {
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice(tp.label, "info");
            }
          }
        });
      }

      // Lighthouse Entrance Notice
      const dEntrance = Math.hypot(pPos.x - 0, pPos.z - 215.0);
      if (dEntrance < 2.4 && pPos.y >= 2.6 && pPos.y <= 4.5) {
        if (!window.__lighthouseEnteredNotice) {
          window.__lighthouseEnteredNotice = true;
          if (game.callbacks && game.callbacks.onShowNotice) {
            game.callbacks.onShowNotice("🗼 Akdeniz Deniz Feneri'ne Girdin! İç döner merdivenle zirveye tırmanabilirsin! ⬆️", "info");
          }
        }
      }

      // 6. Island Collectibles Animation & Proximity Pickup (Sleek Round Coins & Food Items)
      islandCollectibles.forEach((col, idx) => {
        if (col.collected) {
          if (col.mesh) {
            col.mesh.visible = false;
            if (col.mesh.parent) col.mesh.parent.remove(col.mesh);
          }
          return;
        }
        if (!col.mesh) return;

        // Smooth rotation and floating hover sine wave
        col.mesh.rotation.y += 0.04;
        col.mesh.position.y = (col.baseY || 1.8) + Math.sin(time * 3.2 + idx * 0.75) * 0.12;

        const dCol = pPos.distanceTo(col.pos);
        if (dCol < 1.7) {
          col.collected = true;
          col.mesh.visible = false;
          if (col.mesh.parent) col.mesh.parent.remove(col.mesh);
          if (game.scene) game.scene.remove(col.mesh);

          if (col.isFood) {
            if (game.stats) {
              game.stats.currentHp = Math.min(game.stats.maxHp || 100, (game.stats.currentHp || 100) + col.heal);
              game.stats.coins = (game.stats.coins || 0) + col.val;
              game.stats.xp = (game.stats.xp || 0) + col.val * 2;
            }
            if (typeof St !== 'undefined' && St.playPowerup) St.playPowerup();
            if (game.spawnSparkleParticles) game.spawnSparkleParticles(col.pos, 16, 0x4ade80);
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice(`😋 ${col.name} Tüketildi! (+${col.heal} Can, +${col.val} Altın)`, "success");
            }
          } else {
            if (game.stats) {
              game.stats.coins = (game.stats.coins || 0) + col.val;
              game.stats.xp = (game.stats.xp || 0) + 25;
            }
            if (typeof St !== 'undefined' && St.playCoin) St.playCoin();
            if (game.spawnSparkleParticles) game.spawnSparkleParticles(col.pos, 16, 0xfacc15);
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice(`${col.name} Alındı! (+${col.val} Altın)`, "info");
            }
          }
          if (game.callbacks && game.callbacks.onStatsUpdate) {
            game.callbacks.onStatsUpdate(game.stats);
          }
        }
      });
    }
  }

  // Listen to region transitions and game ready
  window.addEventListener('superbear:game-ready', () => {
    const game = window.__superBearGame;
    if (game && game.scene) {
      buildVillageExpansion(game.scene);
    }
  });

  window.addEventListener('superbear:region-changed', (e) => {
    const regionId = (e.detail && e.detail.region) || e.detail;
    const game = window.__superBearGame;
    if (regionId === 'hub') {
      if (game && game.scene) {
        buildVillageExpansion(game.scene);
      }
    } else {
      if (villageExpansionGroup && villageExpansionGroup.parent) {
        villageExpansionGroup.parent.remove(villageExpansionGroup);
        villageExpansionGroup.visible = false;
      }
      if (game && game.currentLevel && game.currentLevel.colliders) {
        game.currentLevel.colliders = game.currentLevel.colliders.filter(c => !c.isVillageExpansionCollider);
      }
      isHubActive = false;
    }
  });

  // Ticker
  let _tickRunning = false;
  function tick() {
    _tickRunning = true;
    try {
      updateVillageExpansionEngine();
    } catch (err) {
      console.warn("Village expansion tick error:", err);
    }
    requestAnimationFrame(tick);
  }

  if (!_tickRunning) {
    tick();
  }

  window.__buildVillageExpansion = buildVillageExpansion;
  window.__updateVillageExpansionEngine = updateVillageExpansionEngine;

})();
