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
  let isHubActive = false;

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
    // YAPI 1: 26 METRE DEV SPİRAL DENİZ FENERİ & SEYİR BALKONU (LIGHTHOUSE)
    // Konum: x: 0, z: 220 (Adanın en yüksek güney burun noktası)
    // ------------------------------------------------------------------------
    console.log("🗼 Building 26m Grand Spiral Coastal Lighthouse with Rotating Light...");
    const lighthouseGrp = new THREE.Group();
    lighthouseGrp.position.set(0, 1.6, 220);

    // Octagonal Stone Base (Height 6m)
    const lhBase = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 6.4, 6.0, 8), stoneBrickMat);
    lhBase.position.y = 3.0;
    lighthouseGrp.add(lhBase);
    addSolidBox(-5.5, 1.6, 214.5, 5.5, 7.6, 225.5);

    // Tapered Cylindrical Tower with Red/White Bands (Height 16m)
    for (let band = 0; band < 4; band++) {
      const bandMat = band % 2 === 0 ? lighthouseWhite : lighthouseRed;
      const bMesh = new THREE.Mesh(new THREE.CylinderGeometry(4.2 - band * 0.35, 4.6 - band * 0.35, 4.0, 16), bandMat);
      bMesh.position.y = 8.0 + band * 4.0;
      lighthouseGrp.add(bMesh);
      addSolidBox(-4.0, 7.6 + band * 4.0, 216, 4.0, 11.6 + band * 4.0, 224);
    }

    // Walkable Upper Balcony Platform (Y = 22m, Radius 5m)
    const lhBalcony = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 4.8, 0.8, 16), darkStoneMat);
    lhBalcony.position.y = 22.4;
    lighthouseGrp.add(lhBalcony);
    addSolidBox(-4.8, 23.6, 215.2, 4.8, 24.4, 224.8);

    // Glass Lantern Room (Height 4m)
    const lhLanternRoom = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.2, 3.8, 16), glassDomeMat);
    lhLanternRoom.position.y = 24.8;
    lighthouseGrp.add(lhLanternRoom);

    // Rotating Glowing Light Beacon inside Lantern Room
    const lhBeacon = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.2, 0.8), lanternGlowMat);
    lhBeacon.position.y = 24.8;
    lighthouseGrp.add(lhBeacon);
    animatedStructures.push({ type: 'lighthouse_beam', mesh: lhBeacon });

    // Conical Copper Cupola Roof & Spire Peak (Y = 26 to 30m)
    const lhRoof = new THREE.Mesh(new THREE.ConeGeometry(3.6, 3.5, 16), tealRoofMat);
    lhRoof.position.y = 28.5;
    lighthouseGrp.add(lhRoof);

    // External Stone Stairs winding to Level 1 terrace (Y=1.6 to Y=7.6)
    for (let st = 0; st < 9; st++) {
      const sY = 1.6 + st * 0.65;
      const sZ = 214 - st * 0.8;
      const step = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.6, 1.1), stoneBrickMat);
      step.position.set(5.5, sY - 1.6, sZ - 220);
      lighthouseGrp.add(step);
      addSolidBox(4.3, sY - 0.3, sZ - 0.6, 6.7, sY + 0.35, sZ + 0.6);
    }

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
    stag.position.set(-18, 1.6, 138);
    stag.rotation.y = 0.6;
    villageExpansionGroup.add(stag);
    animatedAnimals.push({ type: 'deer', mesh: stag, baseY: 1.6, speed: 1.4 });

    // B) ZARİF DAĞ CEYLANI (REALISTIC GAZELLE / DOE) 🦌
    const gazelle = createRealisticGazelle(THREE);
    gazelle.position.set(-14, 1.6, 144);
    gazelle.rotation.y = -0.4;
    villageExpansionGroup.add(gazelle);
    animatedAnimals.push({ type: 'gazelle', mesh: gazelle, baseY: 1.6, speed: 1.6 });

    // C) KIZIL TİLKİ & YAVRUSU (REALISTIC RED FOX WITH BUSHY WHITE-TIPPED TAIL) 🦊
    const fox = createRealisticFox(THREE);
    fox.position.set(20, 1.6, 140);
    fox.rotation.y = -0.8;
    villageExpansionGroup.add(fox);
    animatedAnimals.push({ type: 'fox', mesh: fox, baseY: 1.6, speed: 2.2 });

    const babyFox = createRealisticFox(THREE, 0.65);
    babyFox.position.set(23, 1.6, 142);
    babyFox.rotation.y = -0.5;
    villageExpansionGroup.add(babyFox);
    animatedAnimals.push({ type: 'fox', mesh: babyFox, baseY: 1.6, speed: 2.5 });

    // D) YABAN TAVŞANLARI (REALISTIC WILD HARES / COTTONTAIL RABBITS) 🐇
    [
      { x: -28, z: 180 },
      { x: -25, z: 184 },
      { x: 18, z: 185 }
    ].forEach((rp, idx) => {
      const hare = createRealisticHare(THREE);
      hare.position.set(rp.x, 1.6, rp.z);
      hare.rotation.y = Math.random() * Math.PI * 2;
      villageExpansionGroup.add(hare);
      animatedAnimals.push({ type: 'hare', mesh: hare, baseY: 1.6, animOffset: idx * 1.5 });
    });

    // E) KRALİYET BEYAZ KUĞULARI (REALISTIC SWANS GLIDING IN LAGOON) 🦢
    [
      { x: -4, z: 144, rot: 0.2 },
      { x: 4, z: 146, rot: -0.4 }
    ].forEach((sp, sIdx) => {
      const swan = createRealisticSwan(THREE);
      swan.position.set(sp.x, 1.45, sp.z);
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
    otter.position.set(0, 1.4, 150);
    villageExpansionGroup.add(otter);
    animatedAnimals.push({ type: 'otter', mesh: otter });

    // ========================================================================
    // 5. DOĞA ADASI KILAVUZU & DİYALOGLAR (NPCS - NO SPACE REFERENCES!)
    // ========================================================================
    const openRealms = getOpenRegionsList();
    const openRealmsSummary = openRealms.join(", ");

    // A) Baş Korucu Doğa Ayısı Barni 🌲🐻 (Ada Girişinde, x: 5, z: 102)
    const rangerMesh = createBearCitizenMesh(THREE, 0x78350f);
    rangerMesh.position.set(5, 1.6, 102);
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
    captainCat.position.set(5, 1.6, 215);
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
        // Hopping motion
        const hopCycle = Math.abs(Math.sin((time + anim.animOffset) * 4.0));
        anim.mesh.position.y = anim.baseY + hopCycle * 0.25;
      } else if (anim.type === 'swan') {
        // Smooth gliding in the lagoon
        const ang = time * 0.4 + anim.sIdx * Math.PI;
        anim.mesh.position.x = anim.centerX + Math.cos(ang) * anim.radius;
        anim.mesh.position.z = anim.centerZ + Math.sin(ang) * anim.radius;
        anim.mesh.rotation.y = -ang + Math.PI / 2;
        anim.mesh.position.y = 1.45 + Math.sin(time * 2.0) * 0.03; // Floating bob
      } else if (anim.type === 'eagle') {
        const head = anim.mesh.getObjectByName('eagle_head');
        if (head) {
          head.rotation.y = Math.sin(time * 0.8) * 0.4; // Surveying island from perch
        }
      } else if (anim.type === 'otter') {
        const ang = time * 0.9;
        anim.mesh.position.x = Math.sin(ang) * 5.0;
        anim.mesh.position.z = 145 + Math.cos(ang) * 5.0;
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
