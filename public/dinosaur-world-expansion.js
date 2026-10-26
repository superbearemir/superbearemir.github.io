// ============================================================================
// 🦖 9. BÖLÜM: TARİH ÖNCESİ DİNOZOR DÜNYASI UZATILMIŞ GENİŞLETMESİ
// - ORİJİNAL DAĞ / KULE KORUNDU ("dağ gibi bir şey", z: 58 -> -90, Y: 49.2)
// - DAĞIN ZİRVESİNDEN BAŞLAYAN 14 YENİ UZUN VE FARKLI PREHİSTORİK AŞAMA (z: -110 -> -3400)
// - 9 ÖZEL YENİ FARKLI DİNOZOR / TARİH ÖNCESİ CANLI
// - BOSS: BÖLÜMÜN EN SONUNA (14. Aşama Volkanik Dinozor Arenası, z: -3300) TAŞINDI:
//     * Dev T-Rex Boss orijinal modeli, kükremesi ve ezici adımlarıyla korundu!
//     * Arkasında 10. Bölüm: Şeker Dünyası ("sugar_world") zafer portalı açılır!
// ============================================================================

(function() {
  'use strict';

  console.log("🦖 [Dinosaur World Expansion] 14 Yeni Aşama ve 9 Farklı Dinozor Yükleniyor...");

  let dinosaurExtensionGroup = null;
  let activeDinoProjectiles = [];
  let dinoMovingSlabs = [];
  let dinoCrumblingCrusts = [];
  let dinoBoneMills = [];
  let dinoFossilLasers = [];
  let dinoFallingStalactites = [];
  let dinoJumpPads = [];
  let activeTRexBoss = null;
  let dinoVictoryPortal = null;
  let totalTime = 0;

  function cleanUpDinosaurWorldExtension() {
    if (dinosaurExtensionGroup && dinosaurExtensionGroup.parent) {
      dinosaurExtensionGroup.parent.remove(dinosaurExtensionGroup);
    }
    dinosaurExtensionGroup = null;
    activeDinoProjectiles = [];
    dinoMovingSlabs = [];
    dinoCrumblingCrusts = [];
    dinoBoneMills = [];
    dinoFossilLasers = [];
    dinoFallingStalactites = [];
    dinoJumpPads = [];
    activeTRexBoss = null;
    dinoVictoryPortal = null;
  }

  // =========================================================================
  // MAIN DINOSAUR WORLD POPULATOR (14 EXTENDED STAGES)
  // =========================================================================
  window.__populateDinosaurWorldExtension = function(game) {
    if (!window.THREE || !game || !game.scene) return;
    const THREE = window.THREE;

    console.log("🦖 [Dinosaur World] Orijinal Dağ korundu, 14 Yeni Aşama ve 9 Farklı Dinozor Kuruluyor...");
    cleanUpDinosaurWorldExtension();

    // Extend level bounds to allow deep traversal down to z: -3700
    if (game.currentLevel && game.currentLevel.bounds) {
      game.currentLevel.bounds.minZ = -3800;
      game.currentLevel.bounds.maxZ = 200;
      game.currentLevel.bounds.minX = -500;
      game.currentLevel.bounds.maxX = 500;
      game.currentLevel.bounds.minY = -60;
      game.currentLevel.bounds.maxY = 450;
    }

    dinosaurExtensionGroup = new THREE.Group();
    dinosaurExtensionGroup.name = "dinosaur_world_14_stages_extension";
    game.scene.add(dinosaurExtensionGroup);

    const collidables = game.currentLevel.colliders = game.currentLevel.colliders || [];
    const enemies = game.currentLevel.enemies = game.currentLevel.enemies || [];

    // Purge any old premature T-Rex boss at z: -95
    game.currentLevel.enemies = enemies.filter(e => {
      if (e && (e.id === 'boss_trex' || e.type === 'dino_trex_boss')) {
        if (e.mesh && e.mesh.parent) e.mesh.parent.remove(e.mesh);
        return false;
      }
      return true;
    });

    // High quality prehistoric jungle & volcanic rock materials
    const jungleRockMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.85 });
    const mossyStoneMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.9, emissive: 0x14532d, emissiveIntensity: 0.2 });
    const ancientBoneMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.6 });
    const amberCrystalMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.8, transparent: true, opacity: 0.88 });
    const volcanicBasaltMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.8 });
    const magmaEdgeMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 1.2 });

    function buildPrehistoricPlatform(w, h, d, px, py, pz, mat, isHazard = false) {
      const platGroup = new THREE.Group();
      platGroup.position.set(px, py, pz);
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat || jungleRockMat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      platGroup.add(mesh);

      if (!isHazard) {
        const rim = new THREE.Mesh(new THREE.BoxGeometry(w * 0.96, 0.1, d * 0.96), mossyStoneMat);
        rim.position.y = h / 2 + 0.05;
        platGroup.add(rim);
      }

      dinosaurExtensionGroup.add(platGroup);
      collidables.push({
        min: new THREE.Vector3(px - w / 2, py - h / 2, pz - d / 2),
        max: new THREE.Vector3(px + w / 2, py + h / 2 + 0.15, pz + d / 2),
        isToxic: isHazard
      });
      return platGroup;
    }

    function addPrehistoricItem(id, x, y, z, isGem = false) {
      if (typeof window.create3DGoldCoin === 'function' && !isGem) {
        const coin = window.create3DGoldCoin(x, y, z, 30);
        if (coin) dinosaurExtensionGroup.add(coin);
      } else {
        const geom = isGem ? new THREE.OctahedronGeometry(0.65) : new THREE.CylinderGeometry(0.45, 0.45, 0.18, 12);
        const mesh = new THREE.Mesh(geom, isGem ? amberCrystalMat : ancientBoneMat);
        mesh.position.set(x, y, z);
        dinosaurExtensionGroup.add(mesh);
      }
    }

    function addCheckpoint(id, name, x, y, z) {
      const cpMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, emissive: 0x15803d, emissiveIntensity: 1.1 });
      const cpMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.0, 0.35, 16), cpMat);
      cpMesh.position.set(x, y + 0.18, z);
      dinosaurExtensionGroup.add(cpMesh);

      const flag = new THREE.Mesh(new THREE.ConeGeometry(0.4, 2.0, 8), amberCrystalMat);
      flag.position.set(x, y + 1.35, z);
      dinosaurExtensionGroup.add(flag);

      game.currentLevel.checkpoints.push({
        id: id,
        name: name,
        pos: new THREE.Vector3(x, y + 1.5, z)
      });
    }

    function addGeyserJumpPad(x, y, z, boostPower = 28) {
      const padMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x16a34a, emissiveIntensity: 1.5 });
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.2, 0.4, 16), padMat);
      pad.position.set(x, y + 0.2, z);
      dinosaurExtensionGroup.add(pad);

      dinoJumpPads.push({
        pos: new THREE.Vector3(x, y, z),
        power: boostPower
      });
    }

    // =========================================================================
    // 🌉 DAĞIN ZİRVESİNDEN BAĞLANTI (z: -90, Y: 49.2) -> 14 Aşamaya Sarmaşık Köprüsü
    // =========================================================================
    buildPrehistoricPlatform(18, 2.5, 30, 0, 49.2, -105, jungleRockMat);
    // Giant Dino Skull Arch
    const skullPillarL = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 12, 16), ancientBoneMat);
    skullPillarL.position.set(-8, 55.0, -105);
    dinosaurExtensionGroup.add(skullPillarL);
    const skullPillarR = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 12, 16), ancientBoneMat);
    skullPillarR.position.set(8, 55.0, -105);
    dinosaurExtensionGroup.add(skullPillarR);
    const skullTop = new THREE.Mesh(new THREE.BoxGeometry(18, 1.8, 2.8), mossyStoneMat);
    skullTop.position.set(0, 62.0, -105);
    dinosaurExtensionGroup.add(skullTop);

    if (typeof window.createThematicEntranceEasel === 'function') {
      window.createThematicEntranceEasel(
        game,
        3,
        "🦖 Tarih Öncesi Dinozor Dünyası: 14 Yeni Aşama Geçidi!\nDev T-Rex Bossu vadinin sonundaki Volkanik Krallıkta seni bekliyor!",
        0,
        51.5,
        -102
      );
    }

    // =========================================================================
    // 14 UZUN VE FARKLI DİNOZOR AŞAMASI (z: -120 -> -3400)
    // =========================================================================

    // 1. Aşama: Antik Eğrelti Otu Vadisi & Fosil Rampaları (z: -120 -> -330, Y: 49 -> 53)
    addCheckpoint("dino_cp_s1", "1. Aşama: Antik Eğrelti Otu Vadisi", 0, 50.0, -130);
    buildPrehistoricPlatform(24, 2.0, 26, 0, 49.2, -130, jungleRockMat);
    buildPrehistoricPlatform(16, 1.8, 32, 0, 49.8, -160, mossyStoneMat);
    buildPrehistoricPlatform(18, 1.8, 32, 4, 50.4, -195, jungleRockMat);
    buildPrehistoricPlatform(16, 1.8, 32, -4, 51.0, -230, mossyStoneMat);
    buildPrehistoricPlatform(18, 1.8, 32, 0, 51.6, -265, jungleRockMat);
    buildPrehistoricPlatform(16, 1.8, 30, 5, 52.2, -300, ancientBoneMat);
    buildPrehistoricPlatform(22, 2.2, 26, 0, 52.8, -330, jungleRockMat);
    addPrehistoricItem("d_c1_0", 0, 52.5, -195, true);
    createBabyTRexHunter(0, 53.0, -230, enemies, dinosaurExtensionGroup);

    // 2. Aşama: Yüzen Prehistorik Kaya Adacıkları (z: -330 -> -540, Y: 53 -> 57)
    addCheckpoint("dino_cp_s2", "2. Aşama: Yüzen Kaya Adacıkları", 0, 53.4, -340);
    buildPrehistoricPlatform(20, 2.0, 20, 0, 52.8, -340, volcanicBasaltMat);
    [-370, -400, -430, -460, -490, -520].forEach((sz, idx) => {
      const sx = (idx % 2 === 0 ? 5.5 : -5.5);
      const sy = 53.4 + idx * 0.7;
      buildPrehistoricPlatform(12, 1.8, 14, sx, sy, sz, jungleRockMat);
      addPrehistoricItem("d_c2_" + idx, sx, sy + 1.8, sz, idx === 2);
    });
    buildPrehistoricPlatform(22, 2.2, 24, 0, 58.0, -540, mossyStoneMat);
    createGiantPterodactyl(0, 64.0, -430, enemies, dinosaurExtensionGroup);

    // 3. Aşama: Dönen Kemik Değirmenleri Koridoru (z: -540 -> -750, Y: 57 -> 61)
    addCheckpoint("dino_cp_s3", "3. Aşama: Dönen Kemik Değirmenleri", 0, 58.5, -550);
    buildPrehistoricPlatform(22, 2.0, 22, 0, 58.0, -550, jungleRockMat);
    buildPrehistoricPlatform(14, 1.8, 30, 0, 58.6, -580, mossyStoneMat);
    // Bone Mill 1
    const bm1 = new THREE.Group();
    bm1.position.set(0, 60.0, -620);
    for (let b = 0; b < 4; b++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(14, 0.4, 2.2), ancientBoneMat);
      blade.rotation.y = (b / 4) * Math.PI * 2;
      bm1.add(blade);
    }
    dinosaurExtensionGroup.add(bm1);
    dinoBoneMills.push({ group: bm1, speed: 1.5 });
    buildPrehistoricPlatform(16, 2.0, 22, 0, 59.4, -620, volcanicBasaltMat);

    buildPrehistoricPlatform(14, 1.8, 30, -5, 60.0, -660, jungleRockMat);
    // Bone Mill 2
    const bm2 = new THREE.Group();
    bm2.position.set(0, 61.5, -700);
    for (let b = 0; b < 4; b++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(14, 0.4, 2.2), ancientBoneMat);
      blade.rotation.y = (b / 4) * Math.PI * 2;
      bm2.add(blade);
    }
    dinosaurExtensionGroup.add(bm2);
    dinoBoneMills.push({ group: bm2, speed: -1.7 });
    buildPrehistoricPlatform(16, 2.0, 22, 0, 60.8, -700, volcanicBasaltMat);
    buildPrehistoricPlatform(22, 2.2, 24, 0, 61.6, -750, mossyStoneMat);
    createArmoredAnkilosaur(0, 62.5, -660, enemies, dinosaurExtensionGroup);

    // 4. Aşama: Çöken Lav Tortusu Taşları (z: -750 -> -960, Y: 61 -> 65)
    addCheckpoint("dino_cp_s4", "4. Aşama: Çöken Lav Tortusu Taşları", 0, 62.2, -760);
    buildPrehistoricPlatform(22, 2.0, 22, 0, 61.6, -760, jungleRockMat);
    [-790, -820, -850, -880, -910, -940].forEach((cz, cIdx) => {
      const cx = (cIdx % 2 === 0 ? 5.0 : -5.0);
      const cy = 62.0 + cIdx * 0.7;
      const cMesh = new THREE.Mesh(new THREE.BoxGeometry(10, 1.4, 12), volcanicBasaltMat);
      cMesh.position.set(cx, cy, cz);
      dinosaurExtensionGroup.add(cMesh);
      const coll = {
        min: new THREE.Vector3(cx - 5.0, cy - 0.7, cz - 6.0),
        max: new THREE.Vector3(cx + 5.0, cy + 0.85, cz + 6.0)
      };
      collidables.push(coll);
      dinoCrumblingCrusts.push({
        mesh: cMesh,
        baseY: cy,
        coll: coll,
        stepped: false,
        dropTimer: 0.8,
        fallSpeed: 0,
        respawnTimer: 0
      });
      addPrehistoricItem("d_c4_" + cIdx, cx, cy + 1.8, cz);
    });
    buildPrehistoricPlatform(22, 2.2, 24, 0, 66.2, -960, mossyStoneMat);
    createSpikyStegosaur(0, 67.5, -850, enemies, dinosaurExtensionGroup);

    // 5. Aşama: Kükürtlü Gayzer Zıplatıcıları (z: -960 -> -1170, Y: 65 -> 71)
    addCheckpoint("dino_cp_s5", "5. Aşama: Kükürtlü Gayzer Zıplatıcıları", 0, 66.8, -970);
    buildPrehistoricPlatform(22, 2.0, 22, 0, 66.2, -970, jungleRockMat);
    addGeyserJumpPad(0, 67.0, -970, 32);
    buildPrehistoricPlatform(16, 2.0, 20, 0, 74.0, -1010, volcanicBasaltMat);
    buildPrehistoricPlatform(14, 1.8, 22, -6, 72.0, -1045, jungleRockMat);
    addGeyserJumpPad(-6, 73.0, -1045, 30);
    buildPrehistoricPlatform(16, 2.0, 20, 0, 80.0, -1085, volcanicBasaltMat);
    buildPrehistoricPlatform(14, 1.8, 22, 6, 78.0, -1120, jungleRockMat);
    addGeyserJumpPad(6, 79.0, -1120, 30);
    buildPrehistoricPlatform(16, 2.0, 20, 0, 85.0, -1150, volcanicBasaltMat);
    buildPrehistoricPlatform(24, 2.2, 24, 0, 71.0, -1170, mossyStoneMat);
    createSwiftVelociraptor(0, 72.0, -1085, enemies, dinosaurExtensionGroup);

    // 6. Aşama: Pterodaktil Yuvası & Uçurum Terasları (z: -1170 -> -1380, Y: 71 -> 75)
    addCheckpoint("dino_cp_s6", "6. Aşama: Pterodaktil Yuvası", 0, 71.8, -1180);
    buildPrehistoricPlatform(22, 2.0, 22, 0, 71.0, -1180, jungleRockMat);
    [-1210, -1240, -1270, -1300, -1330, -1360].forEach((jz, jIdx) => {
      const jx = (jIdx % 2 === 0 ? 5.0 : -5.0);
      const jy = 71.5 + jIdx * 0.6;
      buildPrehistoricPlatform(13, 1.8, 16, jx, jy, jz, volcanicBasaltMat);
      addPrehistoricItem("d_c6_" + jIdx, jx, jy + 1.8, jz);
    });
    buildPrehistoricPlatform(22, 2.2, 24, 0, 75.2, -1380, mossyStoneMat);
    createThreeHornedTriceratops(0, 76.5, -1270, enemies, dinosaurExtensionGroup);

    // 7. Aşama: Dar Dinozor Omurgası Sırtları (z: -1380 -> -1590, Y: 75 -> 79)
    addCheckpoint("dino_cp_s7", "7. Aşama: Dar Dinozor Omurgası", 0, 75.8, -1390);
    buildPrehistoricPlatform(22, 2.0, 22, 0, 75.2, -1390, jungleRockMat);
    buildPrehistoricPlatform(4, 2.0, 36, 0, 75.8, -1425, ancientBoneMat);
    buildPrehistoricPlatform(12, 2.0, 14, 0, 76.5, -1460, mossyStoneMat);
    buildPrehistoricPlatform(4, 2.0, 36, -5, 77.2, -1495, ancientBoneMat);
    buildPrehistoricPlatform(12, 2.0, 14, -5, 77.8, -1530, mossyStoneMat);
    buildPrehistoricPlatform(4, 2.0, 36, 5, 78.4, -1565, ancientBoneMat);
    buildPrehistoricPlatform(22, 2.2, 24, 0, 79.0, -1590, jungleRockMat);
    createSwampSpinosaur(0, 80.5, -1495, enemies, dinosaurExtensionGroup);

    // 8. Aşama: Hareketli Bazalt Mağara Blokları (z: -1590 -> -1800, Y: 79 -> 83)
    addCheckpoint("dino_cp_s8", "8. Aşama: Hareketli Bazalt Blokları", 0, 79.8, -1600);
    buildPrehistoricPlatform(22, 2.0, 22, 0, 79.0, -1600, volcanicBasaltMat);
    [-1635, -1670, -1705, -1740, -1775].forEach((mz, mIdx) => {
      const my = 79.5 + mIdx * 0.7;
      const sMesh = new THREE.Mesh(new THREE.BoxGeometry(10, 1.8, 12), jungleRockMat);
      sMesh.position.set(0, my, mz);
      dinosaurExtensionGroup.add(sMesh);
      const coll = {
        min: new THREE.Vector3(-5.0, my - 0.9, mz - 6.0),
        max: new THREE.Vector3(5.0, my + 1.05, mz + 6.0)
      };
      collidables.push(coll);
      dinoMovingSlabs.push({
        mesh: sMesh,
        baseX: 0,
        rangeX: 8.5,
        speed: 1.8 + mIdx * 0.25,
        offset: mIdx * 1.2,
        halfW: 5.0,
        coll: coll
      });
      addPrehistoricItem("d_c8_" + mIdx, 0, my + 1.8, mz);
    });
    buildPrehistoricPlatform(22, 2.2, 24, 0, 83.2, -1800, mossyStoneMat);
    createGiantPrehistoricHornet(0, 86.0, -1705, enemies, dinosaurExtensionGroup);

    // 9. Aşama: Düşen Obsidyen Sarkıtlar Tüneli (z: -1800 -> -2010, Y: 83 -> 87)
    addCheckpoint("dino_cp_s9", "9. Aşama: Düşen Obsidyen Sarkıtlar", 0, 83.8, -1810);
    buildPrehistoricPlatform(22, 2.0, 22, 0, 83.2, -1810, jungleRockMat);
    [-1845, -1875, -1905, -1935, -1965, -1995].forEach((iz, iIdx) => {
      const ix = (iIdx % 2 === 0 ? 4.5 : -4.5);
      const iy = 83.8 + iIdx * 0.6;
      buildPrehistoricPlatform(12, 1.8, 14, ix, iy, iz, volcanicBasaltMat);
      const spikeGeo = new THREE.ConeGeometry(1.2, 4.5, 8);
      spikeGeo.rotateX(Math.PI);
      const spikeMesh = new THREE.Mesh(spikeGeo, magmaEdgeMat);
      spikeMesh.position.set(ix, iy + 16, iz);
      dinosaurExtensionGroup.add(spikeMesh);
      dinoFallingStalactites.push({
        mesh: spikeMesh,
        x: ix,
        z: iz,
        targetY: iy + 1.0,
        triggered: false,
        fallSpeed: 0
      });
      addPrehistoricItem("d_c9_" + iIdx, ix, iy + 1.8, iz);
    });
    buildPrehistoricPlatform(22, 2.2, 24, 0, 87.5, -2010, mossyStoneMat);
    createMagmaRockDrake(0, 89.0, -1905, enemies, dinosaurExtensionGroup);

    // 10. Aşama: Bataklık Hortumları & Zehirli Sarmaşıklar (z: -2010 -> -2220, Y: 87 -> 91)
    addCheckpoint("dino_cp_s10", "10. Aşama: Bataklık Sarmaşıkları", 0, 88.0, -2020);
    buildPrehistoricPlatform(22, 2.0, 22, 0, 87.5, -2020, jungleRockMat);
    buildPrehistoricPlatform(14, 1.8, 30, -5, 88.2, -2055, mossyStoneMat);
    buildPrehistoricPlatform(16, 2.0, 20, 5, 89.0, -2090, volcanicBasaltMat);
    buildPrehistoricPlatform(14, 1.8, 30, -5, 89.8, -2125, mossyStoneMat);
    buildPrehistoricPlatform(16, 2.0, 20, 5, 90.6, -2160, volcanicBasaltMat);
    buildPrehistoricPlatform(22, 2.2, 24, 0, 91.5, -2220, jungleRockMat);
    createVenomDilophosaur(0, 93.0, -2125, enemies, dinosaurExtensionGroup);

    // 11. Aşama: Dinozor Kabuğu Zıplama Rampaları (z: -2220 -> -2430, Y: 91 -> 97)
    addCheckpoint("dino_cp_s11", "11. Aşama: Dinozor Zıplama Rampaları", 0, 92.0, -2230);
    buildPrehistoricPlatform(22, 2.0, 22, 0, 91.5, -2230, mossyStoneMat);
    addGeyserJumpPad(0, 92.0, -2230, 32);
    buildPrehistoricPlatform(14, 2.0, 16, 0, 100.0, -2265, volcanicBasaltMat);
    buildPrehistoricPlatform(12, 1.8, 14, 6, 98.0, -2300, jungleRockMat);
    addGeyserJumpPad(6, 99.0, -2300, 30);
    buildPrehistoricPlatform(14, 2.0, 16, 0, 106.0, -2335, volcanicBasaltMat);
    buildPrehistoricPlatform(12, 1.8, 14, -6, 104.0, -2370, jungleRockMat);
    addGeyserJumpPad(-6, 105.0, -2370, 30);
    buildPrehistoricPlatform(14, 2.0, 16, 0, 110.0, -2400, volcanicBasaltMat);
    buildPrehistoricPlatform(24, 2.2, 24, 0, 97.0, -2430, mossyStoneMat);
    createObsidianPachycephalosaur(0, 98.5, -2335, enemies, dinosaurExtensionGroup);

    // 12. Aşama: Lav Akıntıları & Fosil Lazer Koridoru (z: -2430 -> -2640, Y: 97 -> 101)
    addCheckpoint("dino_cp_s12", "12. Aşama: Fosil Lazer Koridoru", 0, 97.8, -2440);
    buildPrehistoricPlatform(22, 2.0, 22, 0, 97.0, -2440, jungleRockMat);
    [-2470, -2505, -2540, -2575, -2610].forEach((lz, lIdx) => {
      const ly = 97.6 + lIdx * 0.8;
      buildPrehistoricPlatform(14, 1.8, 18, 0, ly, lz, volcanicBasaltMat);
      const laserGrp = new THREE.Group();
      laserGrp.position.set(0, ly + 2.0, lz);
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 16), magmaEdgeMat);
      beam.rotation.z = Math.PI / 2;
      laserGrp.add(beam);
      dinosaurExtensionGroup.add(laserGrp);
      dinoFossilLasers.push({
        mesh: laserGrp,
        y: ly + 2.0,
        z: lz,
        range: 8.0,
        speed: (lIdx % 2 === 0 ? 2.0 : -2.0)
      });
      addPrehistoricItem("d_c12_" + lIdx, 0, ly + 1.8, lz, true);
    });
    buildPrehistoricPlatform(22, 2.2, 24, 0, 101.5, -2640, mossyStoneMat);
    createFossilBoneScorpion(0, 103.0, -2540, enemies, dinosaurExtensionGroup);

    // 13. Aşama: Çöken Zırh Plakaları & Ters Magma Rüzgarları (z: -2640 -> -2860, Y: 101 -> 105)
    addCheckpoint("dino_cp_s13", "13. Aşama: Çöken Zırh Plakaları", 0, 102.2, -2650);
    buildPrehistoricPlatform(22, 2.0, 22, 0, 101.5, -2650, jungleRockMat);
    [-2680, -2710, -2740, -2770, -2800, -2830].forEach((cz, cIdx) => {
      const cx = (cIdx % 2 === 0 ? 5.5 : -5.5);
      const cy = 102.0 + cIdx * 0.7;
      const cMesh = new THREE.Mesh(new THREE.BoxGeometry(10, 1.4, 12), ancientBoneMat);
      cMesh.position.set(cx, cy, cz);
      dinosaurExtensionGroup.add(cMesh);
      const coll = {
        min: new THREE.Vector3(cx - 5.0, cy - 0.7, cz - 6.0),
        max: new THREE.Vector3(cx + 5.0, cy + 0.85, cz + 6.0)
      };
      collidables.push(coll);
      dinoCrumblingCrusts.push({
        mesh: cMesh,
        baseY: cy,
        coll: coll,
        stepped: false,
        dropTimer: 0.7,
        fallSpeed: 0,
        respawnTimer: 0
      });
      addPrehistoricItem("d_c13_" + cIdx, cx, cy + 1.8, cz);
    });
    buildPrehistoricPlatform(22, 2.2, 24, 0, 106.5, -2860, volcanicBasaltMat);
    createVolcanicCarnotaurus(0, 108.0, -2770, enemies, dinosaurExtensionGroup);

    // 14. Aşama: [BÜYÜK BOSS] BÖLÜMÜN EN SONUNDAKİ VOLKANİK DİNOZOR KRALLIĞI ARENASI 🦖🌋 (z: -2885 -> -3400)
    const arenaX = 0;
    const arenaY = 105.0;
    const arenaZ = -3280;

    // Prehistoric Bone & Basalt Causeway connecting Stage 13 (-2860) to T-Rex Arena (-3236)
    [
      { x: 0, z: -2890, y: 106.3, w: 16, d: 28, mat: jungleRockMat },
      { x: -3, z: -2920, y: 106.1, w: 14, d: 26, mat: mossyStoneMat },
      { x: 3, z: -2950, y: 105.9, w: 14, d: 26, mat: volcanicBasaltMat },
      { x: 0, z: -2980, y: 105.8, w: 16, d: 28, mat: ancientBoneMat },
      { x: -3, z: -3010, y: 105.7, w: 14, d: 26, mat: jungleRockMat },
      { x: 3, z: -3040, y: 105.6, w: 14, d: 26, mat: mossyStoneMat },
      { x: 0, z: -3070, y: 105.5, w: 18, d: 28, mat: volcanicBasaltMat },
      { x: -3, z: -3100, y: 105.4, w: 14, d: 26, mat: ancientBoneMat },
      { x: 3, z: -3130, y: 105.3, w: 14, d: 26, mat: jungleRockMat },
      { x: 0, z: -3160, y: 105.2, w: 16, d: 28, mat: mossyStoneMat },
      { x: 0, z: -3190, y: 105.1, w: 16, d: 28, mat: ancientBoneMat },
      { x: 0, z: -3220, y: 105.0, w: 22, d: 28, mat: volcanicBasaltMat }
    ].forEach((step, idx) => {
      buildPrehistoricPlatform(step.w, 2.2, step.d, step.x, step.y, step.z, step.mat);
      addPrehistoricItem("d_c14_bridge_" + idx, step.x, step.y + 1.8, step.z, idx % 4 === 0);
    });

    addCheckpoint("dino_cp_s14", "14. Aşama: [BÜYÜK BOSS] Volkanik Dinozor Arenası 🦖🌋", 0, arenaY + 1.2, -3220);

    // Grand Volcanic Caldera Platform for T-Rex
    buildPrehistoricPlatform(72, 4.0, 88, arenaX, arenaY, arenaZ, volcanicBasaltMat);
    const arenaRim = new THREE.Mesh(new THREE.BoxGeometry(74, 0.2, 90), magmaEdgeMat);
    arenaRim.position.set(arenaX, arenaY + 2.05, arenaZ);
    dinosaurExtensionGroup.add(arenaRim);

    // 14 Glowing Volcanic Pillars around Arena
    for (let p = 0; p < 14; p++) {
      const angle = (p / 14) * Math.PI * 2;
      const px = arenaX + Math.cos(angle) * 34;
      const pz = arenaZ + Math.sin(angle) * 40;
      buildPrehistoricPlatform(3.5, 26, 3.5, px, arenaY + 13.0, pz, jungleRockMat);
      const topFire = new THREE.Mesh(new THREE.ConeGeometry(2.0, 4.0, 6), magmaEdgeMat);
      topFire.position.set(px, arenaY + 26.5, pz);
      dinosaurExtensionGroup.add(topFire);
    }

    if (typeof window.createThematicEntranceEasel === 'function') {
      window.createThematicEntranceEasel(
        game,
        3,
        "👑 VOLKANİK DİNOZOR KRALLIĞI ARENASI!\nDev T-Rex Bossu'nu mağlup et ve 10. Bölüm Şeker Dünyası portalından geç!",
        0,
        arenaY + 2.5,
        arenaZ + 38
      );
    }

    // RELOCATED T-REX BOSS AT SECTION END
    activeTRexBoss = createRelocatedTRexBoss(arenaX, arenaY + 2.0, arenaZ, enemies, dinosaurExtensionGroup, game);

    // Victory Portal behind T-Rex (10. Bölüm Şeker Dünyası'na açılır)
    dinoVictoryPortal = createDinoVictoryPortal(arenaX, arenaY + 2.2, arenaZ - 44, dinosaurExtensionGroup);

    console.log("✅ [Dinosaur World] Orijinal Dağ korundu, 14 Yeni Aşama, 13 Farklı Canlı ve Taşınan T-Rex Boss Başarıyla Kuruldu!");
  };

  // =========================================================================
  // 13 ÖZEL YENİ FARKLI DİNOZOR CANLISI VE MEKANİĞİ (HAREKET + ATEŞ ETME)
  // =========================================================================

  function createBabyTRexHunter(x, y, z, enemies, group) {
    createDinoMonster(x, y, z, enemies, group, "T-Rex Avcısı 🦖", 0x15803d, 1.8, 160, 18, "charge", 4, 0xfef08a);
  }

  function createGiantPterodactyl(x, y, z, enemies, group) {
    createDinoMonster(x, y, z, enemies, group, "Uçan Dev Pterodaktil 🦅🦕", 0x0284c7, 1.5, 90, 14, "swoop", 1, 0x38bdf8);
  }

  function createArmoredAnkilosaur(x, y, z, enemies, group) {
    createDinoMonster(x, y, z, enemies, group, "Zırhlı Ankilozor 🐢🛡️", 0x78350f, 2.2, 220, 20, "heavy", 6, 0xd97706);
  }

  function createSpikyStegosaur(x, y, z, enemies, group) {
    createDinoMonster(x, y, z, enemies, group, "Dikenli Stegozor 🦕", 0x047857, 2.0, 190, 18, "patrol", 15, 0x10b981);
  }

  function createSwiftVelociraptor(x, y, z, enemies, group) {
    createDinoMonster(x, y, z, enemies, group, "Hızlı Velosiraptor 🦎💨", 0xb91c1c, 1.3, 110, 16, "sprint", 9, 0xf97316);
  }

  function createThreeHornedTriceratops(x, y, z, enemies, group) {
    createDinoMonster(x, y, z, enemies, group, "Üç Boynuzlu Triseratops 🦏🦕", 0x854d0e, 2.4, 240, 22, "horn", 15, 0xfef08a);
  }

  function createSwampSpinosaur(x, y, z, enemies, group) {
    createDinoMonster(x, y, z, enemies, group, "Bataklık Spinozoru 🐊🦕", 0x0f766e, 2.3, 210, 20, "ambush", 5, 0x2dd4bf);
  }

  function createGiantPrehistoricHornet(x, y, z, enemies, group) {
    createDinoMonster(x, y, z, enemies, group, "Tarih Öncesi Dev Eşek Arısı 🐝🦴", 0xf59e0b, 1.2, 80, 15, "buzz", 12, 0x1e293b);
  }

  function createMagmaRockDrake(x, y, z, enemies, group) {
    createDinoMonster(x, y, z, enemies, group, "Lav Kayası Ejder-Kertenkelesi 🌋🦎", 0xdc2626, 1.9, 180, 19, "magma", 0, 0xfacc15);
  }

  function createVenomDilophosaur(x, y, z, enemies, group) {
    createDinoMonster(x, y, z, enemies, group, "Zehir Yakalı Dilofozor 🦎☣️", 0x65a30d, 1.6, 175, 19, "sprint", 3, 0xa3e635);
  }

  function createObsidianPachycephalosaur(x, y, z, enemies, group) {
    createDinoMonster(x, y, z, enemies, group, "Kafatası Kıran Pakisefalozor 🦕💥", 0x475569, 1.8, 210, 21, "charge", 11, 0xef4444);
  }

  function createFossilBoneScorpion(x, y, z, enemies, group) {
    createDinoMonster(x, y, z, enemies, group, "Fosil Kemik Akrebi 🦂🦴", 0xd6d3d1, 1.6, 190, 20, "patrol", 2, 0xdc2626);
  }

  function createVolcanicCarnotaurus(x, y, z, enemies, group) {
    createDinoMonster(x, y, z, enemies, group, "Boynuzlu Volkan Karnotauru 🦖🔥", 0x991b1b, 2.1, 250, 22, "horn", 17, 0xf97316);
  }

  function createDinoMonster(x, y, z, enemies, group, name, color, size, hp, atk, behavior, archetypeIdx, accentColor) {
    const THREE = window.THREE;
    let grp;
    if (typeof window.__buildDistinctCreatureMesh === 'function') {
      grp = window.__buildDistinctCreatureMesh(THREE, archetypeIdx, {
        primary: color,
        secondary: accentColor || 0xfef08a,
        eye: 0xff3300,
        scale: size * 0.72
      });
    } else {
      grp = new THREE.Group();
      const mat = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.5,
        emissive: color,
        emissiveIntensity: 0.25
      });
      const body = new THREE.Mesh(new THREE.BoxGeometry(size * 1.2, size, size * 1.5), mat);
      body.position.y = size / 2;
      grp.add(body);
    }
    grp.position.set(x, y, z);
    group.add(grp);

    const isFlyer = (behavior === "swoop" || behavior === "buzz");

    enemies.push({
      id: name.toLowerCase().replace(/[^a-z0-9]/g, '_') + "_" + Math.round(z),
      type: "prehistoric_creature",
      name: name,
      mesh: grp,
      pos: new THREE.Vector3(x, y, z),
      baseX: x,
      baseY: y,
      baseZ: z,
      hp: hp,
      maxHp: hp,
      attackPower: atk,
      _combatUpgraded: true,
      _archetype: archetypeIdx,
      _isFlyer: isFlyer,
      _patrolSpeed: behavior === "sprint" ? 5.2 : 3.6,
      _patrolRangeX: 5.2,
      _patrolRangeZ: 2.8,
      _animPhase: Math.random() * 10,
      _projCooldown: 1.0 + Math.random() * 1.4,
      _projInterval: 2.2,
      _projTheme: { color: color, emissive: accentColor || 0xf97316, speed: 17.5, damage: Math.max(10, Math.round(atk * 0.7)), radius: 0.45 },
      update: function(dt, p, game) {
        if (typeof window.__updateCreatureCombatAI === 'function') {
          window.__updateCreatureCombatAI(this, dt, p, game, archetypeIdx);
        }
        if (p && this.pos.distanceTo(p) < (size + 1.2)) {
          game.damagePlayer(this.attackPower);
        }
      }
    });
  }

  // =========================================================================
  // RELOCATED T-REX BOSS & VICTORY PORTAL
  // =========================================================================
  function createRelocatedTRexBoss(x, y, z, enemies, group, gameInstance) {
    const THREE = window.THREE;
    let trexMesh;

    if (typeof window.createDinoMesh === 'function') {
      trexMesh = window.createDinoMesh(THREE, true);
    } else if (typeof window.__buildDistinctCreatureMesh === 'function') {
      trexMesh = window.__buildDistinctCreatureMesh(THREE, 4, {
        primary: 0x166534,
        secondary: 0xef4444,
        eye: 0xfacc15,
        scale: 3.4
      });
    } else {
      trexMesh = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(6, 7, 10), new THREE.MeshStandardMaterial({ color: 0x166534 }));
      body.position.y = 4;
      trexMesh.add(body);
    }

    trexMesh.name = "boss_trex_relocated";
    trexMesh.position.set(x, y, z);
    group.add(trexMesh);

    const bossData = {
      id: "boss_trex",
      type: "dino_trex_boss",
      name: "Volkanik Dev T-Rex Lordu 🦖👑",
      mesh: trexMesh,
      pos: trexMesh.position,
      basePos: new THREE.Vector3(x, y, z),
      hp: 1200,
      maxHp: 1200,
      isBoss: true,
      attackPower: 24,
      attackCooldown: 1.5,
      state: "chase",
      animTimer: 0,
      update: function(dt, p, game) {
        this.animTimer += dt * 3.0;
        this.mesh.position.x = this.basePos.x + Math.sin(this.animTimer * 0.5) * 14.0;
        this.mesh.position.z = this.basePos.z + Math.cos(this.animTimer * 0.35) * 10.0;
        if (p) {
          this.mesh.lookAt(p.x, this.mesh.position.y, p.z);
          this.pos.copy(this.mesh.position);

          this.attackCooldown -= dt;
          const dist = this.pos.distanceTo(p);
          if (dist < 42.0 && this.attackCooldown <= 0) {
            this.attackCooldown = 2.0;
            if (typeof window.__spawnEnemyProjectile === 'function') {
              const mouthPos = this.pos.clone();
              mouthPos.y += 4.2;
              window.__spawnEnemyProjectile(game, mouthPos, p, {
                color: 0xff4500,
                emissive: 0xfacc15,
                speed: 21.0,
                damage: 18,
                radius: 0.75
              });
            }
          }

          if (dist < 6.5) {
            game.damagePlayer(this.attackPower);
          }
        }
      }
    };

    enemies.push(bossData);
    return bossData;
  }

  function createDinoVictoryPortal(x, y, z, group) {
    const THREE = window.THREE;
    const portalGrp = new THREE.Group();
    portalGrp.name = "dino_stage14_victory_portal";
    portalGrp.position.set(x, y, z);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.8, 0.5, 16, 32),
      new THREE.MeshStandardMaterial({ color: 0xec4899, emissive: 0xdb2777, emissiveIntensity: 2.0 })
    );
    ring.position.y = 3.8;
    portalGrp.add(ring);

    group.add(portalGrp);

    return {
      mesh: portalGrp,
      pos: new THREE.Vector3(x, y, z),
      targetRegion: "sugar_world"
    };
  }

  // =========================================================================
  // UPDATE TICK LOOP
  // =========================================================================
  function updateDinosaurWorldExtension(dt) {
    const game = window.__superBearGame;
    if (!game || game.currentRegion !== 'dinosaur_world') return;
    totalTime += dt;

    // Moving Slabs
    dinoMovingSlabs.forEach(s => {
      const offX = Math.sin(totalTime * s.speed + (s.offset || 0)) * s.rangeX;
      s.mesh.position.x = s.baseX + offX;
      if (s.coll) {
        const hw = s.halfW || 5.0;
        s.coll.min.x = s.baseX + offX - hw;
        s.coll.max.x = s.baseX + offX + hw;
      }
    });

    // Crumbling Crusts
    if (game.playerPos) {
      dinoCrumblingCrusts.forEach(cp => {
        if (!cp.stepped) {
          const d = Math.hypot(game.playerPos.x - cp.mesh.position.x, game.playerPos.z - cp.mesh.position.z);
          if (d < 3.2 && Math.abs(game.playerPos.y - cp.baseY) < 1.6) cp.stepped = true;
        } else if (cp.dropTimer > 0) {
          cp.dropTimer -= dt;
          cp.mesh.position.x += (Math.random() - 0.5) * 0.15;
          if (cp.dropTimer <= 0 && cp.coll) cp.coll.min.y = -999;
        } else {
          cp.fallSpeed += dt * 30.0;
          cp.mesh.position.y -= cp.fallSpeed * dt;
          cp.respawnTimer += dt;
          if (cp.respawnTimer > 4.5) {
            cp.stepped = false;
            cp.dropTimer = 0.7;
            cp.fallSpeed = 0;
            cp.respawnTimer = 0;
            cp.mesh.position.y = cp.baseY;
            if (cp.coll) cp.coll.min.y = cp.baseY - 0.7;
          }
        }
      });
    }

    // Bone Mills
    dinoBoneMills.forEach(fm => {
      fm.group.rotation.y += dt * fm.speed;
      if (game.playerPos && fm.group.position.distanceTo(game.playerPos) < 3.5) {
        game.damagePlayer(18);
      }
    });

    // Fossil Lasers
    dinoFossilLasers.forEach(ml => {
      ml.mesh.rotation.y += dt * ml.speed;
      if (game.playerPos) {
        const d = Math.hypot(game.playerPos.x - ml.mesh.position.x, game.playerPos.z - ml.z);
        if (d < (ml.range || 8.0) && Math.abs(game.playerPos.y - ml.y) < 1.8) {
          game.damagePlayer(18);
        }
      }
    });

    // Falling Stalactites
    if (game.playerPos) {
      dinoFallingStalactites.forEach(ic => {
        if (!ic.triggered) {
          const d = Math.hypot(game.playerPos.x - ic.x, game.playerPos.z - ic.z);
          if (d < 4.0) ic.triggered = true;
        } else if (ic.mesh.position.y > ic.targetY) {
          ic.fallSpeed += dt * 35.0;
          ic.mesh.position.y -= ic.fallSpeed * dt;
          if (ic.mesh.position.distanceTo(game.playerPos) < 2.5) {
            game.damagePlayer(18);
          }
        }
      });
    }

    // Geyser Jump Pads
    if (game.playerPos && dinoJumpPads.length > 0) {
      dinoJumpPads.forEach(jp => {
        const d = Math.hypot(game.playerPos.x - jp.pos.x, game.playerPos.z - jp.pos.z);
        if (d < 2.2 && Math.abs(game.playerPos.y - jp.pos.y) < 1.4) {
          if (game.playerVel) {
            game.playerVel.y = jp.power || 30.0;
            if (window.St && window.St.playJump) window.St.playJump();
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("🌿 Prehistorik Gayzer Sıçrayışı!", "info");
            }
          }
        }
      });
    }

    // Victory Portal Interaction (Transitions to 10. Sugar World)
    if (dinoVictoryPortal && game.playerPos) {
      dinoVictoryPortal.mesh.rotation.y += dt * 0.9;
      const d = dinoVictoryPortal.pos.distanceTo(game.playerPos);
      if (d < 5.0) {
        const boss = (game.currentLevel && game.currentLevel.enemies || []).find(e => e && e.id === "boss_trex");
        const isBossAlive = boss && boss.hp > 0;

        if (isBossAlive && !game._bossDefeatedInCurrentRegion) {
          const now = Date.now();
          if (!dinoVictoryPortal._lastNotice || now - dinoVictoryPortal._lastNotice > 2500) {
            dinoVictoryPortal._lastNotice = now;
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("⚠️ Şeker Dünyası portalından geçmek için önce Dev T-Rex Bossu'nu yenmelisin! ⚔️", "warning");
            }
          }
        } else {
          if (!dinoVictoryPortal._triggered) {
            dinoVictoryPortal._triggered = true;
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("🌀 10. Bölüm: Şeker Dünyası'na Geçiliyor! 🍬", "success");
            }
            if (window.St && window.St.playGoalFanfare) window.St.playGoalFanfare();
            setTimeout(() => {
              game.loadRegion("sugar_world");
            }, 800);
          }
        }
      }
    }
  }

  // Hook into update loop
  const tickerInterval = setInterval(() => {
    if (window.__superBearGame) {
      if (!window.__superBearGame._dinoTickerHooked) {
        window.__superBearGame._dinoTickerHooked = true;
        const origUpdate = window.__superBearGame.update;
        window.__superBearGame.update = function(dt, totalTime) {
          origUpdate.call(this, dt, totalTime);
          try {
            updateDinosaurWorldExtension(dt);
          } catch(err) {}
        };
      }
      clearInterval(tickerInterval);
    }
  }, 100);

  window.__cleanUpDinosaurWorldExtension = cleanUpDinosaurWorldExtension;
  window.__updateDinosaurWorldExtension = updateDinosaurWorldExtension;

  console.log("🦖 [Dinosaur World Extension] 14-Stage Fully Extended Script Loaded!");
})();
