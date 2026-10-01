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
    const woodMat = woodPlankMat;
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
    // Z: 95 to 260, X: -88 to +88 (Devasa Yeşil Ada, Kumlu Sahil & Lagün)
    // ========================================================================
    console.log("🏝️ Sculpting Gigantic Safari Island Landmass (Z: 95 to 260)...");

    const islandTerrainGrp = new THREE.Group();
    islandTerrainGrp.name = 'grand_island_terrain';

    // A) Global Ocean Floor & Sea Basin Bed (Prevents any void falling across entire hub!)
    addSolidBox(-350, -10.0, -150, 350, 0.4, 400);

    // B) Golden Sand Coastal Beach Rim (Low border surrounding the island)
    const sandBeach = new THREE.Mesh(new THREE.BoxGeometry(205, 1.6, 195), islandSandMat);
    sandBeach.position.set(0, -0.1, 175);
    sandBeach.receiveShadow = true;
    islandTerrainGrp.add(sandBeach);
    addSolidBox(-105, -3.0, 75, 105, 0.7, 285);

    // C) Main Lush Green Island Plateau (Y = 1.65, Split into 3 sections with clean borders to eliminate mesh overlapping/flickering)
    // West Lawn (Left of Promenade Path, X: -94 to -4.8)
    const westLawn = new THREE.Mesh(new THREE.BoxGeometry(89.2, 2.0, 175), islandGrassMat);
    westLawn.position.set(-49.4, 0.65, 175);
    westLawn.receiveShadow = true;
    islandTerrainGrp.add(westLawn);

    // East North Lawn (North of Lake, X: +4.8 to 88, Z: 87.5 to 132.5)
    const eastNorthLawn = new THREE.Mesh(new THREE.BoxGeometry(83.2, 2.0, 45), islandGrassMat);
    eastNorthLawn.position.set(46.4, 0.65, 110.0);
    eastNorthLawn.receiveShadow = true;
    islandTerrainGrp.add(eastNorthLawn);

    // East South Lawn (South of Lake, X: +4.8 to 88, Z: 167.5 to 262.5)
    const eastSouthLawn = new THREE.Mesh(new THREE.BoxGeometry(83.2, 2.0, 95), islandGrassMat);
    eastSouthLawn.position.set(46.4, 0.65, 215.0);
    eastSouthLawn.receiveShadow = true;
    islandTerrainGrp.add(eastSouthLawn);

    // East Far Lawn (East of Lake, X: 52 to 88, Z: 132.5 to 167.5)
    const eastFarLawn = new THREE.Mesh(new THREE.BoxGeometry(36, 2.0, 35), islandGrassMat);
    eastFarLawn.position.set(70.0, 0.65, 150.0);
    eastFarLawn.receiveShadow = true;
    islandTerrainGrp.add(eastFarLawn);

    addSolidBox(-94, -2.0, 85, 94, 1.65, 268);

    // D) Paved Stone Promenade leading from the bridge into the island center and lighthouse (Clean, wide & elevated at Y = 1.66)
    const stonePath = new THREE.Mesh(new THREE.BoxGeometry(9.0, 0.32, 120), stoneBrickMat);
    stonePath.position.set(0, 1.50, 160);
    stonePath.receiveShadow = true;
    islandTerrainGrp.add(stonePath);
    addSolidBox(-4.8, 1.0, 95, 4.8, 1.66, 215);

    // D2) Branching Paved Walkway leading to the Royal Swan & Lily Lake (X: 4.5 to 22, Z: 150)
    const lakePath = new THREE.Mesh(new THREE.BoxGeometry(16.0, 0.32, 4.2), stoneBrickMat);
    lakePath.position.set(12.5, 1.50, 150);
    lakePath.receiveShadow = true;
    islandTerrainGrp.add(lakePath);
    addSolidBox(4.5, 1.0, 147.8, 20.5, 1.66, 152.2);

    // E) KRALİYET KUĞU VE NİLÜFER CENNET GÖLETİ (ROYAL SWAN & WATER LILY LAKE GARDEN)
    // Konum: x: 36, z: 150 (Oyulmuş açık gölet havzası, pürüzsüz berrak su ve göl üzerinde yüzen kuğular)
    console.log("🦢 Sculpting Picturesque Royal Swan Lake Garden & Wooden Viewing Pier (x: 36, z: 150)...");
    const lakeGroup = new THREE.Group();
    lakeGroup.position.set(36, 0, 150);

    // 1. Sandy Shoreline Basin Rim
    const lakeSandRim = new THREE.Mesh(new THREE.CylinderGeometry(15.5, 16.5, 0.3, 32), islandSandMat);
    lakeSandRim.position.y = 1.35;
    lakeSandRim.receiveShadow = true;
    lakeGroup.add(lakeSandRim);

    // 2. Sparkling Crystal Blue Lake Water Surface (Y = 1.65, Depth = 0.40m)
    const lakeWaterSurface = new THREE.Mesh(
      new THREE.CylinderGeometry(14.2, 14.8, 0.40, 32),
      waterDeepMat
    );
    lakeWaterSurface.position.y = 1.45; // top face = 1.65m
    lakeWaterSurface.receiveShadow = true;
    lakeGroup.add(lakeWaterSurface);
    addSolidBox(21.0, 0.8, 134.0, 52.0, 1.65, 166.0);

    // 3. Natural River Pebble & Cobblestone Lake Embankment
    for (let rk = 0; rk < 24; rk++) {
      const rkAngle = (rk / 24) * Math.PI * 2;
      const rkDist = 14.6 + (Math.sin(rk * 3) * 0.8);
      const rkX = Math.cos(rkAngle) * rkDist;
      const rkZ = Math.sin(rkAngle) * rkDist;
      const rkScale = 0.6 + (Math.abs(Math.sin(rk * 2)) * 0.7);

      const pebble = new THREE.Mesh(new THREE.DodecahedronGeometry(rkScale, 1), darkStoneMat);
      pebble.position.set(rkX, 1.55, rkZ);
      pebble.rotation.set(rk * 0.4, rk * 0.7, rk * 0.2);
      lakeGroup.add(pebble);
    }

    // 4. Wooden Scenic Viewing Pier & Benches (X: -16 to -6 local -> X: 20 to 30 world)
    const pierDeck = new THREE.Mesh(new THREE.BoxGeometry(10.0, 0.30, 4.6), woodPlankMat);
    pierDeck.position.set(-11.0, 1.50, 0); // top face = 1.65m
    pierDeck.receiveShadow = true;
    lakeGroup.add(pierDeck);
    addSolidBox(20.0, 1.0, 147.5, 30.5, 1.65, 152.5);

    // Pier Support Pilings in water
    [[-15, -2.0], [-15, 2.0], [-11, -2.0], [-11, 2.0], [-7, -2.0], [-7, 2.0]].forEach(([px, pz]) => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 1.8, 8), darkBeamMat);
      pole.position.set(px, 0.8, pz);
      lakeGroup.add(pole);
    });

    // Twin Brass Lanterns at the Pier Tip
    [[-6.8, -2.0], [-6.8, 2.0]].forEach(([lx, lz]) => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 2.2, 6), darkBeamMat);
      post.position.set(lx, 2.5, lz);
      lakeGroup.add(post);

      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 8), lanternGlowMat);
      lamp.position.set(lx, 3.5, lz);
      lakeGroup.add(lamp);
    });

    // Wooden Lakeview Bench on the pier
    const lakeBench = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.4, 0.6), woodPlankMat);
    lakeBench.position.set(-10.0, 1.95, -1.6);
    lakeGroup.add(lakeBench);

    // 5. Blooming Lotus Flowers & Lily Pads (Floating on water surface)
    const lilyFlowerMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.4 });
    const lilyWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const lilyPadMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 });

    const lilypadLocations = [
      { x: -3, z: -5, isPink: true },
      { x: 4, z: -6, isPink: false },
      { x: 7, z: 2, isPink: true },
      { x: -2, z: 8, isPink: false },
      { x: 5, z: 6, isPink: true },
      { x: -7, z: 4, isPink: true },
      { x: 2, z: -8, isPink: false }
    ];

    lilypadLocations.forEach(lp => {
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.04, 10), lilyPadMat);
      pad.position.set(lp.x, 1.50, lp.z);
      lakeGroup.add(pad);

      // Lotus Flower
      const petalMat = lp.isPink ? lilyFlowerMat : lilyWhiteMat;
      const flower = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.45, 6), petalMat);
      flower.position.set(lp.x, 1.65, lp.z);
      flower.rotation.x = Math.PI;
      lakeGroup.add(flower);

      const core = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), goldMat);
      core.position.set(lp.x, 1.58, lp.z);
      lakeGroup.add(core);
    });

    // 6. Lakeshore Reeds & Bulrushes (Sazlıklar ve Kamışlar)
    const reedStemMat = new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.6 });
    const reedCattailMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });

    const reedClusters = [
      { x: 10, z: -8 }, { x: 12, z: -4 }, { x: 9, z: 8 }, { x: -4, z: 12 }, { x: 6, z: 10 }
    ];

    reedClusters.forEach(rc => {
      for (let r = 0; r < 5; r++) {
        const rx = rc.x + (Math.random() - 0.5) * 1.5;
        const rz = rc.z + (Math.random() - 0.5) * 1.5;
        const stemH = 1.6 + Math.random() * 0.8;

        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, stemH, 4), reedStemMat);
        stem.position.set(rx, 1.5 + stemH / 2, rz);
        stem.rotation.z = (Math.random() - 0.5) * 0.15;
        lakeGroup.add(stem);

        const cattail = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.4, 6), reedCattailMat);
        cattail.position.set(rx, 1.5 + stemH - 0.2, rz);
        lakeGroup.add(cattail);
      }
    });

    // 7. Scenic Weeping Willow Trees by the Lake Shore
    [
      { x: 12, z: -10 },
      { x: 11, z: 11 }
    ].forEach(wt => {
      const willow = new THREE.Group();
      willow.position.set(wt.x, 1.6, wt.z);

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 4.5, 8), darkBeamMat);
      trunk.position.y = 2.25;
      trunk.rotation.z = -0.12;
      willow.add(trunk);

      const crown = new THREE.Mesh(new THREE.SphereGeometry(3.5, 10, 10), new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.7 }));
      crown.position.set(0, 5.0, 0);
      crown.scale.set(1.1, 0.8, 1.1);
      willow.add(crown);

      // Hanging foliage strands
      for (let f = 0; f < 8; f++) {
        const fa = (f / 8) * Math.PI * 2;
        const fx = Math.cos(fa) * 2.6;
        const fz = Math.sin(fa) * 2.6;
        const strand = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.18, 3.2, 5), new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.8 }));
        strand.position.set(fx, 3.4, fz);
        willow.add(strand);
      }

      lakeGroup.add(willow);
    });

    islandTerrainGrp.add(lakeGroup);

    // E) Rocky Forest Hills on Far Outer Borders of Island (Kept far away from lighthouse at Z: 220!)
    const hillConfigs = [
      { x: -68, z: 135, r: 14, h: 12 },
      { x: -70, z: 205, r: 14, h: 14 },
      { x: 68, z: 135, r: 14, h: 12 },
      { x: 70, z: 205, r: 14, h: 14 },
      { x: 0, z: 270, r: 14, h: 14 } // Far South Cliff far behind the lighthouse
    ];

    hillConfigs.forEach(h => {
      const hill = new THREE.Mesh(new THREE.ConeGeometry(h.r, h.h, 12), darkStoneMat);
      hill.position.set(h.x, h.h / 2 + 1.0, h.z);
      islandTerrainGrp.add(hill);
      addSolidBox(h.x - h.r * 0.5, 1.0, h.z - h.r * 0.5, h.x + h.r * 0.5, h.h * 0.75 + 1.0, h.z + h.r * 0.5);

      // Lush foliage on hilltops
      const bush = new THREE.Mesh(new THREE.SphereGeometry(h.r * 0.45, 8, 8), islandGrassMat);
      bush.position.set(h.x, h.h * 0.8 + 1.0, h.z);
      islandTerrainGrp.add(bush);
    });

    // Flowering Shade Trees on Island Meadow
    const treeLocs = [
      [-32, 125], [-24, 168], [28, 125], [26, 172],
      [-24, 215], [24, 215], [42, 160], [-40, 160]
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
    // YAPI 1: 26 METRE DEV DIŞTAN DÖNERLİ MERDİVENLİ DENİZ FENERİ (EXTERIOR SPIRAL LIGHTHOUSE)
    // Konum: x: 0, z: 220 (Adanın en yüksek güney burun noktası)
    // Merdivenler doğrudan zemin seviyesindeki taş basamaklardan (Y = 1.65m) başlar,
    // kule dış cephesini 2.5 tur sararak en üst 360° seyir terasına (26m) kadar kesintisiz uzanır!
    // Giriş katı açık ve ferah tasarlanmıştır; içeri girildiğinde asla takılma yaşanmaz!
    // ------------------------------------------------------------------------
    console.log("🗼 Building 26m Grand Exterior Spiral Coastal Lighthouse & Summit Observatory...");
    const lighthouseGrp = new THREE.Group();
    lighthouseGrp.position.set(0, 1.65, 220);

    // 1. SOLID STONE FOUNDATION & BASE PLINTH (Y = 1.65 to 4.8)
    const baseOctGeo = new THREE.CylinderGeometry(4.6, 5.2, 3.2, 16);
    const baseOctMesh = new THREE.Mesh(baseOctGeo, darkStoneMat);
    baseOctMesh.position.y = 1.6;
    baseOctMesh.receiveShadow = true;
    lighthouseGrp.add(baseOctMesh);

    const plinthCurb = new THREE.Mesh(new THREE.CylinderGeometry(5.0, 5.3, 0.6, 16), stoneBrickMat);
    plinthCurb.position.y = 0.3;
    lighthouseGrp.add(plinthCurb);

    // Foundation Base Colliders (South/East/West back support)
    addSolidBox(-4.8, 1.4, 218.5, 4.8, 4.8, 224.8);
    addSolidBox(-4.8, 1.4, 216.0, -3.2, 4.8, 224.0);
    addSolidBox(3.2, 1.4, 216.0, 4.8, 4.8, 224.0);

    // 2. OPEN GROUND-FLOOR MARITIME LODGE (Açık, Ferah ve Asla Takılma Olmayan Zemin Salonu)
    // Solid interior floor at ground level
    addSolidBox(-3.5, 1.4, 216.0, 3.5, 1.70, 223.5);

    // Grand Arched Doorway frame (Z: 215.2, X: 0)
    const archFrameMat = stoneBrickMat;
    const archL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.2, 0.8), archFrameMat);
    archL.position.set(-2.0, 1.6, -4.8);
    lighthouseGrp.add(archL);
    const archR = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.2, 0.8), archFrameMat);
    archR.position.set(2.0, 1.6, -4.8);
    lighthouseGrp.add(archR);
    const archTop = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.7, 0.9), archFrameMat);
    archTop.position.set(0, 3.2, -4.8);
    lighthouseGrp.add(archTop);

    // Interior Warm Details: Captain's Wheel, Nautical Bench & Lantern
    const capWheel = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.08, 6, 12), darkBeamMat);
    capWheel.position.set(0, 2.2, 3.0);
    lighthouseGrp.add(capWheel);

    const intBench = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.4, 0.6), woodPlankMat);
    intBench.position.set(0, 0.25, 2.8);
    lighthouseGrp.add(intBench);

    const intLantern = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), lanternGlowMat);
    intLantern.position.set(0, 2.6, 0);
    lighthouseGrp.add(intLantern);

    // 3. CENTRAL SOLID TOWER SHAFT (Tapered Cylinder from Y: 4.8 to Y: 23.6)
    for (let band = 0; band < 4; band++) {
      const bandMat = band % 2 === 0 ? lighthouseWhite : lighthouseRed;
      const bBottomR = 4.2 - band * 0.22;
      const bTopR = 3.98 - band * 0.22;
      const bHeight = 4.5;
      const bMesh = new THREE.Mesh(new THREE.CylinderGeometry(bTopR, bBottomR, bHeight, 24), bandMat);
      bMesh.position.y = 5.2 + band * 4.5;
      bMesh.receiveShadow = true;
      lighthouseGrp.add(bMesh);

      // Gold ornamental moulding ring at each band transition
      const ringMoulding = new THREE.Mesh(new THREE.TorusGeometry(bTopR + 0.12, 0.08, 8, 24), goldMat);
      ringMoulding.rotation.x = Math.PI / 2;
      ringMoulding.position.y = 7.45 + band * 4.5;
      lighthouseGrp.add(ringMoulding);
    }

    // Central Tower Core Physical Collider (Radius ~3.2m above Y: 4.8, keeping center solid)
    addSolidBox(-3.3, 4.8, 216.7, 3.3, 23.6, 223.3);

    // 4. GROUND-LEVEL SEAMLESS ENTRANCE STEPS (Z = 209 to 215, Y = 1.65 to 2.25)
    // EN ALTTAN BAŞLAYAN 3 KADEMELİ GENİŞ TAŞ GİRİŞ MERDİVENLERİ:
    // Step -2: Ground Approach Promenade Pad (Y = 1.65 to 1.70)
    const padMesh1 = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.2, 3.5), stoneBrickMat);
    padMesh1.position.set(0, 0.1, -9.0);
    padMesh1.receiveShadow = true;
    lighthouseGrp.add(padMesh1);
    addSolidBox(-3.4, 1.4, 209.2, 3.4, 1.75, 212.4);

    // Step -1: Middle Stone Step (Y = 1.95)
    const padMesh2 = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.3, 2.2), stoneBrickMat);
    padMesh2.position.set(0, 0.3, -6.8);
    padMesh2.receiveShadow = true;
    lighthouseGrp.add(padMesh2);
    addSolidBox(-2.8, 1.4, 212.0, 2.8, 2.00, 214.2);

    // Step 0: Spiral Start Landing Platform (Y = 2.25)
    const padMesh3 = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.3, 2.0), stoneBrickMat);
    padMesh3.position.set(0, 0.6, -5.0);
    padMesh3.receiveShadow = true;
    lighthouseGrp.add(padMesh3);
    addSolidBox(-2.4, 1.4, 213.8, 2.4, 2.30, 215.8);

    // Twin Brass Lampposts at Entrance Ground Pad
    [-3.0, 3.0].forEach(lx => {
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.5, 0.65), darkStoneMat);
      plinth.position.set(lx, 0.25, -9.6);
      lighthouseGrp.add(plinth);

      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 2.4, 8), darkBeamMat);
      post.position.set(lx, 1.45, -9.6);
      lighthouseGrp.add(post);

      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8), lanternGlowMat);
      lamp.position.set(lx, 2.75, -9.6);
      lighthouseGrp.add(lamp);
    });

    // 5. GRAND EXTERIOR SPIRAL STAIRCASE (KULE DIŞINI SARAN 72 BASAMAKLI DEV DÖNER MERDİVEN)
    // Doğrudan zemin giriş platformundan (Y = 2.25m) başlayıp kuleyi 2.5 tur sararak
    // en tepedeki 360° seyir balkonuna (Y = 23.6m) kadar kesintisiz, geniş ve tırmanması son derece rahat!
    const numExteriorSteps = 72;
    const spiralTurns = 2.5;

    for (let s = 0; s < numExteriorSteps; s++) {
      const frac = s / (numExteriorSteps - 1);
      const angle = frac * Math.PI * 2 * spiralTurns;
      const stepWorldY = 2.25 + frac * 21.35; // Starts at Y = 2.25m smoothly up to Y = 23.6m
      const stepLocalY = stepWorldY - 1.65;

      const towerRadiusAtY = 4.3 - (frac * 0.70);
      const stepMidRadius = towerRadiusAtY + 1.45; // Center of step plank
      const outerRailRadius = towerRadiusAtY + 2.75; // Outer edge of safety railing

      const sx = Math.sin(angle) * stepMidRadius;
      const sz = -Math.cos(angle) * stepMidRadius;

      // A) Wide Heavy Wood Step Plank (Width: 3.2m, Depth: 1.35m, Height: 0.22m)
      const stepPlank = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.22, 1.35), woodPlankMat);
      stepPlank.position.set(sx, stepLocalY, sz);
      stepPlank.rotation.y = angle;
      stepPlank.receiveShadow = true;
      lighthouseGrp.add(stepPlank);

      // Gold Safety Nosing along the front tread
      const stepNosing = new THREE.Mesh(new THREE.BoxGeometry(3.22, 0.07, 0.09), goldMat);
      stepNosing.position.set(sx, stepLocalY + 0.1, sz);
      stepNosing.rotation.y = angle;
      lighthouseGrp.add(stepNosing);

      // B) Heavy Cast-Iron Cantilever Diagonal Support Bracket into the stone wall
      if (s > 1) {
        const bracket = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 1.9, 6), darkBeamMat);
        bracket.position.set(sx * 0.76, stepLocalY - 0.55, sz * 0.76);
        bracket.rotation.z = Math.sin(angle) * 0.65;
        bracket.rotation.x = -Math.cos(angle) * 0.65;
        lighthouseGrp.add(bracket);
      }

      // C) Outer Safety Guard Railing (Outer Post & Top Rail Segment - Only from step 3 upwards so entrance is open!)
      const railPosX = Math.sin(angle) * outerRailRadius;
      const railPosZ = -Math.cos(angle) * outerRailRadius;

      if (s >= 2) {
        const railPost = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.4, 6), darkBeamMat);
        railPost.position.set(railPosX, stepLocalY + 0.7, railPosZ);
        lighthouseGrp.add(railPost);

        const railPostCap = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 6), goldMat);
        railPostCap.position.set(railPosX, stepLocalY + 1.4, railPosZ);
        lighthouseGrp.add(railPostCap);

        const topRailSegment = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.45, 6), goldMat);
        topRailSegment.position.set(railPosX, stepLocalY + 1.35, railPosZ);
        topRailSegment.rotation.y = angle + Math.PI / 2;
        lighthouseGrp.add(topRailSegment);
      }

      // D) Solid Step Physical Collider (Generous box collider with height overlap for buttery-smooth walking)
      const worldStepX = sx;
      const worldStepZ = 220 + sz;
      addSolidBox(
        worldStepX - 1.65, stepWorldY - 0.20, worldStepZ - 1.65,
        worldStepX + 1.65, stepWorldY + 0.40, worldStepZ + 1.65
      );

      // E) Outer perimeter boundary collider (only from step 3 to prevent slipping off edge)
      if (s >= 3) {
        addSolidBox(
          railPosX - 0.45, stepWorldY + 0.2, 220 + railPosZ - 0.45,
          railPosX + 0.45, stepWorldY + 1.8, 220 + railPosZ + 0.45
        );
      }

      // F) Glowing Nautical Lantern every 3 steps along the exterior spiral
      if (s % 3 === 0) {
        const lanternMesh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), lanternGlowMat);
        lanternMesh.position.set(railPosX, stepLocalY + 1.7, railPosZ);
        lighthouseGrp.add(lanternMesh);
      }
    }

    // 6. INTERMEDIATE SCENIC REST BALCONIES (2 KADEMELİ SEYİR VE SOLUKLANMA TERASI)
    // Lookout 1 (Y = 9.2m): North View (Köy & Köprü Manzarası)
    const lookout1Geo = new THREE.CylinderGeometry(2.6, 2.8, 0.4, 12, 1, false, 0, Math.PI);
    const lookout1 = new THREE.Mesh(lookout1Geo, darkStoneMat);
    lookout1.position.set(0, 7.55, -4.8);
    lookout1.rotation.y = Math.PI;
    lighthouseGrp.add(lookout1);
    addSolidBox(-2.5, 9.0, 213.0, 2.5, 9.45, 216.0);

    const bench1 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.4, 0.5), woodPlankMat);
    bench1.position.set(0, 7.95, -4.4);
    lighthouseGrp.add(bench1);
    createSleekRoundGoldCoin(0, 9.8, 214.2, 25, '🗼 Deniz Feneri 1. Seyir Altını');

    // Lookout 2 (Y = 16.4m): South-East View (Açık Okyanus & Liman Manzarası)
    const lookout2 = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.8, 0.4, 12), darkStoneMat);
    lookout2.position.set(4.4, 14.75, 2.5);
    lighthouseGrp.add(lookout2);
    addSolidBox(2.2, 16.2, 220.5, 6.4, 16.65, 224.8);

    createSleekRoundGoldCoin(4.4, 17.0, 222.5, 30, '🗼 Deniz Feneri 2. Seyir Altını');

    // 7. TOP 360° SUMMIT OBSERVATION DECK (Y = 23.6m, Radius 5.6m)
    const summitBalcony = new THREE.Mesh(new THREE.CylinderGeometry(5.6, 5.2, 0.55, 24), darkStoneMat);
    summitBalcony.position.y = 21.95;
    summitBalcony.receiveShadow = true;
    lighthouseGrp.add(summitBalcony);

    // Full 360° Walkable Deck Colliders
    addSolidBox(-5.5, 23.2, 214.5, 5.5, 23.75, 225.5);

    // Perimeter Outer Wrought-Iron Safety Balustrade (Height 1.4m)
    addSolidBox(-5.5, 23.7, 224.8, 5.5, 25.2, 225.6); // South rail
    addSolidBox(5.0, 23.7, 215.2, 5.6, 25.2, 225.2);  // East rail
    addSolidBox(-5.6, 23.7, 215.2, -5.0, 25.2, 225.2); // West rail
    addSolidBox(-5.5, 23.7, 214.5, -2.4, 25.2, 215.3); // North rail left
    addSolidBox(2.4, 23.7, 214.5, 5.5, 25.2, 215.3);  // North rail right

    // Decorative Railing Posts and Rings around the summit
    for (let rp = 0; rp < 18; rp++) {
      const rAng = (rp / 18) * Math.PI * 2;
      if (rp === 9 || rp === 10) continue; // Entrance gap

      const rx = Math.sin(rAng) * 5.3;
      const rz = Math.cos(rAng) * 5.3;
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.4, 6), darkBeamMat);
      post.position.set(rx, 22.95, rz);
      lighthouseGrp.add(post);

      const finial = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), goldMat);
      finial.position.set(rx, 23.7, rz);
      lighthouseGrp.add(finial);
    }
    const railRing = new THREE.Mesh(new THREE.TorusGeometry(5.3, 0.06, 8, 28), goldMat);
    railRing.rotation.x = Math.PI / 2;
    railRing.position.y = 23.65;
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
      telGrp.position.set(td.x, 22.25, td.z);
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
    lhLanternRoom.position.y = 24.05;
    lighthouseGrp.add(lhLanternRoom);

    // Rotating Glowing Light Beacon
    const lhBeacon = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.2, 0.8), lanternGlowMat);
    lhBeacon.position.y = 24.05;
    lighthouseGrp.add(lhBeacon);
    animatedStructures.push({ type: 'lighthouse_beam', mesh: lhBeacon });

    // Conical Teal Copper Roof with Weather Vane and Nautical Pennant (Y = 26 to 32m)
    const lhRoof = new THREE.Mesh(new THREE.ConeGeometry(3.5, 3.4, 16), tealRoofMat);
    lhRoof.position.y = 27.55;
    lighthouseGrp.add(lhRoof);

    const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 3.0, 8), goldMat);
    spire.position.y = 29.85;
    lighthouseGrp.add(spire);

    const vane = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.35, 0.08), goldMat);
    vane.position.y = 31.05;
    lighthouseGrp.add(vane);

    const pennantFlag = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.8, 3), new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 }));
    pennantFlag.rotation.z = Math.PI / 2;
    pennantFlag.position.set(0.9, 31.45, 0);
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

    // E) KRALİYET BEYAZ KUĞULARI VE RENKLİ YABAN ÖRDEKLERİ (REALISTIC SWANS & DUCKS IN LAKE GARDEN) 🦢🦆
    // Swims gracefully inside the Royal Swan Lake (Center: X: 36, Z: 150)
    [
      { x: 33, z: 147, rot: 0.2, radius: 5.8 },
      { x: 39, z: 153, rot: -0.4, radius: 6.4 }
    ].forEach((sp, sIdx) => {
      const swan = createRealisticSwan(THREE);
      swan.position.set(sp.x, 1.56, sp.z);
      swan.rotation.y = sp.rot;
      villageExpansionGroup.add(swan);
      animatedAnimals.push({ type: 'swan', mesh: swan, centerX: 36, centerZ: 150, radius: sp.radius, sIdx: sIdx });
    });

    // Yeşilbaş Yaban Ördekleri & Sevimli Sarı Yavru Ördekler (Mallard Ducks & Yellow Ducklings) 🦆
    [
      { x: 34.5, z: 152, isMallard: true, scale: 1.0, speed: 0.6, radius: 4.2, offset: 0 },
      { x: 37.8, z: 148, isMallard: true, scale: 0.95, speed: 0.55, radius: 4.8, offset: Math.PI },
      { x: 34.0, z: 153, isMallard: false, scale: 0.45, speed: 0.6, radius: 3.8, offset: 0.3 },
      { x: 34.5, z: 153.5, isMallard: false, scale: 0.42, speed: 0.6, radius: 3.5, offset: 0.5 },
      { x: 38.2, z: 149, isMallard: false, scale: 0.45, speed: 0.55, radius: 4.4, offset: Math.PI + 0.3 },
      { x: 38.6, z: 149.5, isMallard: false, scale: 0.42, speed: 0.55, radius: 4.1, offset: Math.PI + 0.5 }
    ].forEach((dp, dIdx) => {
      const duck = createRealisticDuck(THREE, dp.isMallard, dp.scale);
      duck.position.set(dp.x, 1.54, dp.z);
      villageExpansionGroup.add(duck);
      animatedAnimals.push({
        type: 'duck',
        mesh: duck,
        centerX: 36,
        centerZ: 150,
        radius: dp.radius,
        speed: dp.speed,
        offset: dp.offset,
        dIdx: dIdx
      });
    });

    // F) KAYA KARTALI (REALISTIC MOUNTAIN EAGLE PERCHED ON HIGH ROCK) 🦅
    const eagle = createRealisticEagle(THREE);
    eagle.position.set(-62, 15.2, 135);
    eagle.rotation.y = 1.2;
    villageExpansionGroup.add(eagle);
    animatedAnimals.push({ type: 'eagle', mesh: eagle });

    // G) SU SAMURLARI (REALISTIC OTTERS PLAYING IN WATER) 🦦
    const otter = createRealisticOtter(THREE);
    otter.position.set(36, 1.52, 150);
    villageExpansionGroup.add(otter);
    animatedAnimals.push({ type: 'otter', mesh: otter, centerX: 36, centerZ: 150 });

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

  // 5B. YABAN ÖRDEĞİ & SARI YAVRU ÖRDEKLER (REALISTIC MALLARD & DUCKLINGS) 🦆
  function createRealisticDuck(THREE, isMallard = true, scale = 1.0) {
    const grp = new THREE.Group();
    grp.scale.setScalar(scale);

    const bodyMat = isMallard
      ? new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.6 }) // Mallard gray/brown body
      : new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.4 }); // Yellow duckling

    const headMat = isMallard
      ? new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.3, metalness: 0.2 }) // Emerald green head
      : new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 }); // Yellow duckling head

    const billMat = isMallard
      ? new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.3 }) // Yellow-orange bill
      : new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4 });

    const chestMat = isMallard
      ? new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.7 }) // Chestnut brown chest
      : bodyMat;

    // Body
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 8), bodyMat);
    body.scale.set(0.75, 0.55, 1.15);
    body.position.y = 0.12;
    grp.add(body);

    // Chestnut Breast
    if (isMallard) {
      const chest = new THREE.Mesh(new THREE.SphereGeometry(0.18, 6, 6), chestMat);
      chest.position.set(0, 0.16, 0.14);
      grp.add(chest);
    }

    // Duck Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), headMat);
    head.position.set(0, 0.32, 0.2);
    grp.add(head);

    // Neck ring
    if (isMallard) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.02, 6, 12), new THREE.MeshStandardMaterial({ color: 0xffffff }));
      ring.rotation.x = Math.PI / 2;
      ring.position.set(0, 0.24, 0.18);
      grp.add(ring);
    }

    // Duck Flat Bill
    const bill = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.04, 0.14), billMat);
    bill.position.set(0, 0.3, 0.3);
    grp.add(bill);

    // Wing Speculum (Blue flash on mallard wings)
    if (isMallard) {
      [-0.18, 0.18].forEach(wx => {
        const wing = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 0.28), new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.3 }));
        wing.position.set(wx, 0.14, -0.05);
        grp.add(wing);
      });
    }

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
        // Hopping motion - always landing cleanly on the grassy surface (Y = 1.65)
        const hopCycle = Math.abs(Math.sin((time + anim.animOffset) * 4.0));
        anim.mesh.position.y = 1.65 + hopCycle * 0.35;
      } else if (anim.type === 'swan') {
        // Smooth gliding on lake water surface (Y = 1.65)
        const ang = time * 0.35 + anim.sIdx * Math.PI;
        anim.mesh.position.x = (anim.centerX || 36) + Math.cos(ang) * anim.radius;
        anim.mesh.position.z = (anim.centerZ || 150) + Math.sin(ang) * anim.radius;
        anim.mesh.rotation.y = -ang + Math.PI / 2;
        anim.mesh.position.y = 1.66 + Math.sin(time * 2.0) * 0.025; // Floating bob on top of water
      } else if (anim.type === 'duck') {
        // Paddling ducks and ducklings circling the lake (Y = 1.65)
        const ang = time * (anim.speed || 0.6) + (anim.offset || 0);
        anim.mesh.position.x = (anim.centerX || 36) + Math.sin(ang) * anim.radius;
        anim.mesh.position.z = (anim.centerZ || 150) + Math.cos(ang) * anim.radius;
        anim.mesh.rotation.y = ang + Math.PI / 2;
        anim.mesh.position.y = 1.65 + Math.sin(time * 3.0 + anim.dIdx) * 0.02; // Gentle paddling bob
      } else if (anim.type === 'eagle') {
        const head = anim.mesh.getObjectByName('eagle_head');
        if (head) {
          head.rotation.y = Math.sin(time * 0.8) * 0.4; // Surveying island from perch
        }
      } else if (anim.type === 'otter') {
        const ang = time * 0.8;
        anim.mesh.position.x = (anim.centerX || 36) + Math.sin(ang) * 6.5;
        anim.mesh.position.z = (anim.centerZ || 150) + Math.cos(ang) * 6.5;
        anim.mesh.position.y = 1.64 + Math.sin(time * 3.0) * 0.03; // Swimming on water surface
        anim.mesh.rotation.y = ang;
      }
    });

    // 3. Footing & Collision Check (Smooth and solid landing on stairs, balconies, bridges and structures)
    if (game.playerPos) {
      const pPos = game.playerPos;
      const pRadius = 0.65;
      let highestGroundY = -9999;

      for (let i = 0; i < expansionColliders.length; i++) {
        const c = expansionColliders[i];
        if (!c || !c.min || !c.max || c.isToxic || c.isClimbable) continue;

        if (pPos.x >= c.min.x - pRadius && pPos.x <= c.max.x + pRadius &&
            pPos.z >= c.min.z - pRadius && pPos.z <= c.max.z + pRadius) {
          const wasAbove = pPos.y >= c.max.y - 0.95;
          if (wasAbove && pPos.y <= c.max.y + 1.15) {
            if (c.max.y > highestGroundY) {
              highestGroundY = c.max.y;
            }
          }
        }
      }

      if (highestGroundY > -9000 && (!game.playerVel || game.playerVel.y <= 0.3)) {
        pPos.y = highestGroundY;
        if (game.playerVel && game.playerVel.y < 0) game.playerVel.y = 0;
        game.isGrounded = true;
        game.jumpCount = 0;
      }

      // 3.B Anti-Void Safe Catch (Never fall into the void near the island or hub waters!)
      if (pPos.z >= 45 && pPos.y < 0.4) {
        pPos.y = 0.5; // Walk/swim on water surface
        if (game.playerVel && game.playerVel.y < 0) game.playerVel.y = 0;
        game.isGrounded = true;
      }

      // Hard safety net: If somehow pushed below -3.0, smoothly teleport to island entrance
      if (pPos.y < -3.0 && (isHubActive || (game.currentRegion === 'hub'))) {
        pPos.set(0, 1.8, 110);
        if (game.playerVel) game.playerVel.set(0, 0, 0);
        game.isGrounded = true;
        if (game.callbacks && game.callbacks.onShowNotice) {
          game.callbacks.onShowNotice("🌊 Dalgalar seni güvenli kumsala taşıdı!", "info");
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

      // Lighthouse Entrance & Spiral Stairs Notice
      const dEntrance = Math.hypot(pPos.x - 0, pPos.z - 213.0);
      if (dEntrance < 3.8 && pPos.y >= 1.6 && pPos.y <= 4.5) {
        if (!window.__lighthouseEnteredNotice) {
          window.__lighthouseEnteredNotice = true;
          if (game.callbacks && game.callbacks.onShowNotice) {
            game.callbacks.onShowNotice("🗼 Akdeniz Deniz Feneri Dış Döner Merdivenleri! Zirveye tırmanıp 360° manzarayı izleyebilirsin! ⬆️", "info");
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

  // Bulletproof initialization helper
  function ensureExpansionInitialized() {
    const game = window.__superBearGame;
    if (game && game.scene) {
      const region = game.currentRegion || 'hub';
      if (region === 'hub') {
        if (!villageExpansionGroup || !villageExpansionGroup.parent) {
          buildVillageExpansion(game.scene);
        }
      }
    }
  }

  // Listen to region transitions and game ready
  window.addEventListener('superbear:game-ready', () => {
    ensureExpansionInitialized();
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

  // Ensure initialization runs immediately & recurrently as safety net
  ensureExpansionInitialized();
  setInterval(ensureExpansionInitialized, 250);

  window.__ensureExpansionInitialized = ensureExpansionInitialized;
  window.__buildVillageExpansion = buildVillageExpansion;
  window.__updateVillageExpansionEngine = updateVillageExpansionEngine;

})();
