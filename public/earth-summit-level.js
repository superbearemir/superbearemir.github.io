// ============================================================================
// ⛰️ 15. BÖLÜM: DÜNYA FİNAL ZİRVESİ & KIRMIZI ÇİZGİ (EARTH FINAL SUMMIT)
// - Dünya serüveninin en son ve en zorlu bölümü!
// - Stratosfer yüksekliği, Kırmızı Çizgi enerji sınırı, kadim dikilitaşlar.
// - Dönen ölümcül testereler, hareketli platformlar, dar uçurum geçitleri.
// - Boss: Mor Ayı (Kardeşimiz Moris) & Dev Tenrex Çekici!
// - Son dünya bölümü olduğu için zafer portalı Ayı Köyü'ne (hub) gönderir!
// ============================================================================

(function() {
  'use strict';

  console.log("⛰️ Loading Earth Final Summit & Red Line Level Engine...");

  let summitGroup = null;
  let activeMorisBoss = null;
  let summitHpBarContainer = null;
  let summitSawblades = [];
  let summitMovingPlatforms = [];
  let summitJumpPads = [];
  let summitCheckpoints = [];
  let summitRedLineBeams = [];
  let victoryPortal = null;

  // Boss HP Bar UI Creator
  function createSummitBossHpBar() {
    if (document.getElementById('summit-boss-hp-container')) return;

    summitHpBarContainer = document.createElement('div');
    summitHpBarContainer.id = 'summit-boss-hp-container';
    summitHpBarContainer.style.position = 'fixed';
    summitHpBarContainer.style.top = '24px';
    summitHpBarContainer.style.left = '50%';
    summitHpBarContainer.style.transform = 'translateX(-50%)';
    summitHpBarContainer.style.zIndex = '9999';
    summitHpBarContainer.style.display = 'none';
    summitHpBarContainer.style.flexDirection = 'column';
    summitHpBarContainer.style.alignItems = 'center';
    summitHpBarContainer.style.gap = '6px';
    summitHpBarContainer.style.pointerEvents = 'none';
    summitHpBarContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif';

    summitHpBarContainer.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px; background: rgba(15, 23, 42, 0.92); border: 2px solid #ef4444; padding: 6px 18px; border-radius: 9999px; box-shadow: 0 10px 25px -5px rgba(239, 68, 68, 0.4);">
        <span style="font-size: 20px;">👑</span>
        <span id="summit-boss-name" style="font-weight: 900; font-size: 14px; color: #f87171; letter-spacing: 0.05em; text-transform: uppercase;">MOR AYI (KARDEŞİMİZ MORİS) - DÜNYA FİNALİ</span>
        <span id="summit-boss-phase" style="font-size: 10px; background: #991b1b; color: #fef2f2; padding: 2px 8px; border-radius: 9999px; font-weight: 800;">1. FAZ</span>
      </div>
      <div style="width: 320px; height: 16px; background: rgba(15, 23, 42, 0.9); border: 2px solid rgba(239, 68, 68, 0.6); border-radius: 9999px; overflow: hidden; position: relative; box-shadow: inset 0 2px 6px rgba(0,0,0,0.8);">
        <div id="summit-boss-hp-fill" style="width: 100%; height: 100%; background: linear-gradient(90deg, #dc2626, #a855f7, #ec4899); border-radius: 9999px; transition: width 0.25s ease-out; box-shadow: 0 0 12px #ef4444;"></div>
        <div id="summit-boss-hp-text" style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; color: #ffffff; text-shadow: 0 1px 3px rgba(0,0,0,0.9);">750 / 750</div>
      </div>
    `;

    document.body.appendChild(summitHpBarContainer);
  }

  function updateSummitBossHp(current, max, phaseText) {
    if (!summitHpBarContainer) createSummitBossHpBar();
    if (!summitHpBarContainer) return;

    if (current <= 0) {
      summitHpBarContainer.style.display = 'none';
      return;
    }

    summitHpBarContainer.style.display = 'flex';
    const fill = document.getElementById('summit-boss-hp-fill');
    const txt = document.getElementById('summit-boss-hp-text');
    const ph = document.getElementById('summit-boss-phase');

    const pct = Math.max(0, Math.min(100, (current / max) * 100));
    if (fill) fill.style.width = pct + '%';
    if (txt) txt.textContent = `${Math.ceil(current)} / ${max}`;
    if (ph && phaseText) ph.textContent = phaseText;
  }

  // 3D Model: Dönen Testere (Spinning Sawblade)
  function createSawbladeMesh(THREE, radius = 2.4, teethCount = 14) {
    const sawGroup = new THREE.Group();
    sawGroup.name = "sawblade_obstacle";

    // Shiny steel saw blade material with red burning inner teeth
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x334155,
      emissiveIntensity: 0.2
    });

    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0xb91c1c,
      emissiveIntensity: 0.6
    });

    const coreDisc = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.82, radius * 0.82, 0.15, 24), steelMat);
    coreDisc.rotation.x = Math.PI / 2;
    sawGroup.add(coreDisc);

    // Glowing energy hub
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.35, radius * 0.35, 0.22, 16), bladeMat);
    hub.rotation.x = Math.PI / 2;
    sawGroup.add(hub);

    // Center axle bolt
    const axle = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.15, radius * 0.15, 0.35, 12), steelMat);
    axle.rotation.x = Math.PI / 2;
    sawGroup.add(axle);

    // Sharp angled saw teeth around edge
    for (let i = 0; i < teethCount; i++) {
      const angle = (i / teethCount) * Math.PI * 2;
      const toothGeo = new THREE.ConeGeometry(radius * 0.22, radius * 0.45, 4);
      const tooth = new THREE.Mesh(toothGeo, bladeMat);
      tooth.position.set(Math.cos(angle) * (radius * 0.9), Math.sin(angle) * (radius * 0.9), 0);
      tooth.rotation.z = angle - Math.PI / 2 + 0.35; // Slanted tooth
      sawGroup.add(tooth);
    }

    return sawGroup;
  }

  // 3D Model: Kadim Dikilitaş (Ancient Monolith / Obelisk)
  function createObeliskMesh(THREE, height = 22, width = 3.6) {
    const obGroup = new THREE.Group();
    obGroup.name = "ancient_obelisk";

    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.3,
      roughness: 0.75
    });

    const runeMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 0.9,
      roughness: 0.3
    });

    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xe11d48,
      emissiveIntensity: 1.2,
      roughness: 0.1,
      metalness: 0.9
    });

    // Tier 1 Base Plinth
    const base = new THREE.Mesh(new THREE.BoxGeometry(width * 1.5, 2.0, width * 1.5), stoneMat);
    base.position.y = 1.0;
    obGroup.add(base);

    // Tier 2 Sub-base
    const subBase = new THREE.Mesh(new THREE.BoxGeometry(width * 1.2, 1.5, width * 1.2), stoneMat);
    subBase.position.y = 2.75;
    obGroup.add(subBase);

    // Main Tapered Obelisk Shaft
    const shaftGeo = new THREE.CylinderGeometry(width * 0.65, width, height, 4);
    const shaft = new THREE.Mesh(shaftGeo, stoneMat);
    shaft.position.y = 3.5 + height / 2;
    shaft.rotation.y = Math.PI / 4;
    obGroup.add(shaft);

    // Carved Red Runic Inset Bands
    [-height * 0.25, 0, height * 0.25].forEach(yOff => {
      const band = new THREE.Mesh(new THREE.BoxGeometry(width * 0.9, 0.4, width * 0.9), runeMat);
      band.position.y = 3.5 + height / 2 + yOff;
      obGroup.add(band);
    });

    // Pyramidion (Top Point)
    const capGeo = new THREE.ConeGeometry(width * 0.65 * Math.SQRT2, width * 1.2, 4);
    const cap = new THREE.Mesh(capGeo, stoneMat);
    cap.position.y = 3.5 + height + (width * 1.2) / 2;
    cap.rotation.y = Math.PI / 4;
    obGroup.add(cap);

    // Floating Rotating Power Crystal above tip
    const crystalGeo = new THREE.OctahedronGeometry(width * 0.4, 0);
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    crystal.position.y = 3.5 + height + width * 1.6;
    crystal.name = "obelisk_crystal";
    obGroup.add(crystal);

    return obGroup;
  }

  // 3D Model: Mor Ayı (Kardeşimiz Moris - Purple Bear Boss)
  function createMorisBossMesh(THREE) {
    const bossGroup = new THREE.Group();
    bossGroup.name = "boss_moris_mesh";

    const purpleFurMat = new THREE.MeshStandardMaterial({
      color: 0x6b21a8,
      roughness: 0.8,
      metalness: 0.15
    });

    const darkPurpleMat = new THREE.MeshStandardMaterial({
      color: 0x3b0764,
      roughness: 0.85
    });

    const bellyFurMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      roughness: 0.85
    });

    const eyeGlowMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const hornGoldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.85,
      roughness: 0.2,
      emissive: 0xb45309,
      emissiveIntensity: 0.4
    });

    const armorMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x581c87,
      emissiveIntensity: 0.4
    });

    // Chubby Powerful Torso
    const torsoGeo = new THREE.SphereGeometry(1.65, 16, 16);
    torsoGeo.scale(1.0, 1.25, 0.95);
    const torso = new THREE.Mesh(torsoGeo, purpleFurMat);
    torso.position.y = 2.4;
    bossGroup.add(torso);

    // Belly Patch
    const bellyGeo = new THREE.SphereGeometry(1.2, 14, 14);
    bellyGeo.scale(0.85, 1.15, 0.4);
    const belly = new THREE.Mesh(bellyGeo, bellyFurMat);
    belly.position.set(0, 2.3, 1.25);
    bossGroup.add(belly);

    // Armored Pauldrons (Shoulders)
    [-1.65, 1.65].forEach(sx => {
      const pauldron = new THREE.Mesh(new THREE.SphereGeometry(0.75, 12, 12), armorMat);
      pauldron.position.set(sx, 3.4, 0);
      pauldron.scale.set(1.1, 0.8, 1.1);
      bossGroup.add(pauldron);
    });

    // Head
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 4.0, 0.2);
    bossGroup.add(headGroup);

    const headGeo = new THREE.SphereGeometry(1.2, 16, 16);
    headGeo.scale(1.0, 0.95, 0.95);
    const head = new THREE.Mesh(headGeo, purpleFurMat);
    headGroup.add(head);

    // Snout
    const snout = new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 12), darkPurpleMat);
    snout.scale.set(1.0, 0.75, 1.1);
    snout.position.set(0, -0.15, 1.1);
    headGroup.add(snout);

    // Black Nose
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), new THREE.MeshStandardMaterial({ color: 0x020617 }));
    nose.position.set(0, 0.05, 1.6);
    headGroup.add(nose);

    // Menacing Red Glowing Eyes
    [-0.38, 0.38].forEach(ex => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), eyeGlowMat);
      eye.position.set(ex, 0.2, 0.95);
      headGroup.add(eye);
    });

    // Bear Ears
    [-0.85, 0.85].forEach((side, i) => {
      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.42, 10, 10), purpleFurMat);
      ear.position.set(side, 0.9, 0);
      headGroup.add(ear);

      const inEar = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 8), darkPurpleMat);
      inEar.position.set(side * 0.9, 0.9, 0.15);
      headGroup.add(inEar);
    });

    // Broken Golden Horn on Left Ear
    const horn = new THREE.Mesh(new THREE.ConeGeometry(0.25, 1.1, 8), hornGoldMat);
    horn.position.set(-0.75, 1.35, 0.1);
    horn.rotation.z = -0.35;
    headGroup.add(horn);

    // Paws & Arms
    const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 2.2, 10), purpleFurMat);
    leftArm.position.set(-1.7, 2.4, 0.2);
    leftArm.rotation.z = 0.25;
    bossGroup.add(leftArm);

    const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 2.2, 10), purpleFurMat);
    rightArm.position.set(1.7, 2.4, 0.2);
    rightArm.rotation.z = -0.25;
    bossGroup.add(rightArm);

    // Legs & Paws
    [-0.85, 0.85].forEach(lx => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 1.8, 10), purpleFurMat);
      leg.position.set(lx, 0.9, 0);
      bossGroup.add(leg);

      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.5, 1.3), darkPurpleMat);
      foot.position.set(lx, 0.25, 0.3);
      bossGroup.add(foot);
    });

    // DEV TENREX SLAM HAMMER (HELD BY RIGHT PAW)
    const hammerGroup = new THREE.Group();
    hammerGroup.name = "moris_slam_hammer";
    hammerGroup.position.set(1.9, 2.2, 0.7);

    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 4.8, 10), armorMat);
    handle.position.set(0, 1.2, 0);
    hammerGroup.add(handle);

    const headMat = new THREE.MeshStandardMaterial({
      color: 0x7c3aed,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0x6b21a8,
      emissiveIntensity: 0.6
    });

    const hammerHead = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.0, 3.2), headMat);
    hammerHead.position.set(0, 3.4, 0);
    hammerGroup.add(hammerHead);

    // Glowing impact cores
    [-1.65, 1.65].forEach(fz => {
      const core = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.12, 16), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
      core.rotation.x = Math.PI / 2;
      core.position.set(0, 3.4, fz);
      hammerGroup.add(core);
    });

    bossGroup.add(hammerGroup);

    return {
      group: bossGroup,
      headGroup: headGroup,
      hammerGroup: hammerGroup
    };
  }

  // ============================================================================
  // POPULATE EARTH SUMMIT LEVEL (15. BÖLÜM: DÜNYA FİNAL ZİRVESİ & KIRMIZI ÇİZGİ)
  // ============================================================================
  function populateEarthSummit(game) {
    if (!game || !game.scene || !window.THREE) return;
    const THREE = window.THREE;

    console.log("⛰️ Populating 15. Bölüm: Dünya Final Zirvesi & Kırmızı Çizgi (Extreme Difficulty)...");

    // Clear previous summit objects if any
    cleanUpEarthSummit(game);

    summitGroup = new THREE.Group();
    summitGroup.name = "earth_summit_level_mesh";
    game.scene.add(summitGroup);

    // Ensure level arrays and expansive bounds so no invisible walls occur
    if (game.currentLevel) {
      game.currentLevel.bounds = {
        minX: -600,
        maxX: 600,
        minZ: -1200,
        maxZ: 200,
        minY: -40,
        maxY: 300
      };
      game.currentLevel.invisibleWallMeshes = [];
      if (!game.currentLevel.colliders) game.currentLevel.colliders = [];
      if (!game.currentLevel.collectibles) game.currentLevel.collectibles = [];
      if (!game.currentLevel.enemies) game.currentLevel.enemies = [];
      if (!game.currentLevel.checkpoints) game.currentLevel.checkpoints = [];
      if (!game.currentLevel.jumpPads) game.currentLevel.jumpPads = [];
      if (!game.currentLevel.movingPlatforms) game.currentLevel.movingPlatforms = [];
      if (!game.currentLevel.spawnPoint) game.currentLevel.spawnPoint = new THREE.Vector3(0, 4.0, 80);
      else game.currentLevel.spawnPoint.set(0, 4.0, 80);
    }

    summitSawblades = [];
    summitMovingPlatforms = [];
    summitJumpPads = [];
    summitCheckpoints = [];
    summitRedLineBeams = [];
    activeMorisBoss = null;
    victoryPortal = null;

    // 1. SKYBOX & ATMOSPHERE (Crimson & Violet Stratosphere Twilight)
    game.scene.background = new THREE.Color(0x1a0515);
    game.scene.fog = new THREE.FogExp2(0x2d0619, 0.0024);

    const summitSun = new THREE.DirectionalLight(0xff7744, 2.2);
    summitSun.position.set(80, 160, 50);
    summitSun.castShadow = true;
    summitGroup.add(summitSun);

    const summitAmbient = new THREE.AmbientLight(0x701a75, 0.95);
    summitGroup.add(summitAmbient);

    // Secondary Rim Light (Red Line glow from North)
    const redLineRim = new THREE.DirectionalLight(0xef4444, 1.8);
    redLineRim.position.set(0, 30, -500);
    summitGroup.add(redLineRim);

    // MATERIALS
    const basaltMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.85, metalness: 0.2 });
    const mountainRockMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 });
    const redCrystalMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xdc2626, emissiveIntensity: 0.9, roughness: 0.2 });
    const goldMetalMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9, roughness: 0.2, emissive: 0xb45309, emissiveIntensity: 0.4 });
    const redLineMat = new THREE.MeshBasicMaterial({ color: 0xff0033 });
    const magmaGlowMat = new THREE.MeshBasicMaterial({ color: 0xff3b30 });

    // HELPER: Solid Platform Builder
    function addSummitBlock(x, y, z, w, h, d, mat, isSolid = true) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat || basaltMat);
      mesh.position.set(x, y, z);
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      summitGroup.add(mesh);

      if (isSolid && game.currentLevel && game.currentLevel.colliders) {
        game.currentLevel.colliders.push({
          min: new THREE.Vector3(x - w / 2, y - h / 2, z - d / 2),
          max: new THREE.Vector3(x + w / 2, y + h / 2, z + d / 2),
          isSummitPlatform: true,
          isFloor: true,
          isGroundPlateau: true
        });
      }
      return mesh;
    }

    // HELPER: Jump Pad (Zıplama Pedi)
    function addSummitJumpPad(x, y, z, power = 22) {
      const padGroup = new THREE.Group();
      padGroup.position.set(x, y, z);

      const base = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.2, 0.4, 16), goldMetalMat);
      base.position.y = 0.2;
      padGroup.add(base);

      const bouncePad = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.25, 16), redCrystalMat);
      bouncePad.position.y = 0.45;
      padGroup.add(bouncePad);

      summitGroup.add(padGroup);

      summitJumpPads.push({
        pos: new THREE.Vector3(x, y + 0.45, z),
        power: power,
        mesh: padGroup
      });
    }

    // HELPER: Checkpoint Builder
    function addSummitCheckpoint(pos, name, isInitial = false) {
      const cpGroup = new THREE.Group();
      cpGroup.position.copy(pos);

      const base = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.0, 0.5, 12), basaltMat);
      base.position.y = 0.25;
      cpGroup.add(base);

      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 5.0, 8), goldMetalMat);
      pole.position.y = 2.6;
      cpGroup.add(pole);

      const flag = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 0.08), new THREE.MeshStandardMaterial({
        color: isInitial ? 0x22c55e : 0xef4444,
        emissive: isInitial ? 0x16a34a : 0xb91c1c,
        emissiveIntensity: 0.8
      }));
      flag.position.set(0.8, 4.4, 0);
      cpGroup.add(flag);

      summitGroup.add(cpGroup);

      summitCheckpoints.push({
        pos: pos.clone().add(new THREE.Vector3(0, 1.0, 0)),
        name: name,
        flag: flag,
        activated: isInitial
      });
    }

    // HELPER: Coin & Gem Spawners
    function addSummitCoin(x, y, z) {
      if (typeof window.b === 'function') {
        window.b(`summit_coin_${Math.round(x)}_${Math.round(z)}`, x, y, z);
      } else {
        const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.1, 12), goldMetalMat);
        coin.rotation.x = Math.PI / 2;
        coin.position.set(x, y, z);
        summitGroup.add(coin);
      }
    }

    function addSummitGem(x, y, z) {
      if (typeof window.b === 'function') {
        window.b(`summit_gem_${Math.round(x)}_${Math.round(z)}`, x, y, z, true);
      } else {
        const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.5, 0), redCrystalMat);
        gem.position.set(x, y, z);
        summitGroup.add(gem);
      }
    }

    // =========================================================================
    // 2. THE RED LINE (KIRMIZI ÇİZGİ) HORIZON BOUNDARY
    // =========================================================================
    const redLineGeo = new THREE.CylinderGeometry(0.6, 0.6, 520, 16);
    const redLineMesh = new THREE.Mesh(redLineGeo, redLineMat);
    redLineMesh.rotation.z = Math.PI / 2;
    redLineMesh.position.set(0, 36, -480);
    summitGroup.add(redLineMesh);
    summitRedLineBeams.push(redLineMesh);

    // Glowing energy barrier pillars shooting into the stratosphere
    for (let lx = -220; lx <= 220; lx += 40) {
      const vBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 120, 8), magmaGlowMat);
      vBeam.position.set(lx, 60, -480);
      summitGroup.add(vBeam);
      summitRedLineBeams.push(vBeam);
    }

    // =========================================================================
    // 3. STAGE 1: ZİRVE ANA KAMPI & DİKİLİTAŞLAR (BASECAMP & MONOLITH RIDGE)
    // =========================================================================
    // Basecamp Platform (Spawn)
    addSummitBlock(0, 2.0, 80, 26, 3.5, 26, basaltMat);
    addSummitCheckpoint(new THREE.Vector3(0, 3.75, 80), "Zirve Ana Kampı", true);

    // Lore Inscription Monolith at Basecamp
    const loreObelisk = createObeliskMesh(THREE, 12, 2.4);
    loreObelisk.position.set(0, 3.75, 90);
    summitGroup.add(loreObelisk);

    // Mountain cliffs flanking basecamp
    addSummitBlock(-18, 5.0, 80, 8, 10, 26, mountainRockMat);
    addSummitBlock(18, 5.0, 80, 8, 10, 26, mountainRockMat);

    // Step Monoliths extending forward (z: 80 -> z: 10)
    const monolithStepCoords = [
      { x: 0, y: 4.5, z: 58, w: 8, d: 8 },
      { x: -9, y: 6.5, z: 42, w: 7, d: 7 },
      { x: 9, y: 8.5, z: 28, w: 7, d: 7 },
      { x: 0, y: 10.5, z: 12, w: 9, d: 9 }
    ];

    monolithStepCoords.forEach((st, idx) => {
      addSummitBlock(st.x, st.y, st.z, st.w, 3.0, st.d, basaltMat);
      addSummitCoin(st.x, st.y + 2.5, st.z);
      if (idx % 2 === 1) addSummitGem(st.x, st.y + 3.0, st.z);

      // Flanking Ancient Obelisks
      const sideOb = createObeliskMesh(THREE, 18 + idx * 2, 2.8);
      sideOb.position.set(st.x > 0 ? st.x + 8 : st.x - 8, st.y, st.z);
      summitGroup.add(sideOb);
    });

    // Jump pad launching across the first deep chasm
    addSummitJumpPad(0, 12.2, 12, 20);

    // =========================================================================
    // 4. STAGE 2: DÖNEN TESTERELER GEÇİDİ (ROTATING SAWBLADES GAUNTLET)
    // =========================================================================
    // Platform 1: Narrow blade runway (z: 0 -> z: -40)
    addSummitBlock(0, 14.0, -15, 6, 2.5, 34, basaltMat);
    addSummitBlock(-6, 18.0, -15, 2.5, 8, 2.5, mountainRockMat);
    addSummitBlock(6, 18.0, -15, 2.5, 8, 2.5, mountainRockMat);

    // Saw 1: Horizontal sliding sawblade across Runway
    const saw1 = createSawbladeMesh(THREE, 2.6, 16);
    saw1.position.set(0, 15.6, -15);
    summitGroup.add(saw1);
    summitSawblades.push({
      mesh: saw1,
      type: 'sliding_x',
      basePos: new THREE.Vector3(0, 15.6, -15),
      amplitude: 3.4,
      speed: 3.2,
      damage: 15,
      radius: 2.5
    });

    // Mid Checkpoint 1
    addSummitBlock(0, 15.5, -42, 10, 3.0, 10, basaltMat);
    addSummitCheckpoint(new THREE.Vector3(0, 17.0, -42), "1. Testereler Geçidi");
    addSummitJumpPad(0, 17.2, -42, 22);

    // Twin Island Platforms with Orbital Sawblades (z: -70)
    addSummitBlock(-12, 19.0, -70, 9, 3.0, 9, basaltMat);
    addSummitBlock(12, 21.0, -70, 9, 3.0, 9, basaltMat);

    // Monoliths in center of islands with orbital spinning saws
    [-12, 12].forEach((ix, sIdx) => {
      const ob = createObeliskMesh(THREE, 16, 2.2);
      ob.position.set(ix, 20.5, -70);
      summitGroup.add(ob);

      const orbSaw = createSawbladeMesh(THREE, 2.4, 14);
      orbSaw.position.set(ix + 2.5, 21.5, -70);
      summitGroup.add(orbSaw);

      summitSawblades.push({
        mesh: orbSaw,
        type: 'orbital',
        centerPos: new THREE.Vector3(ix, 21.5, -70),
        orbitRadius: 3.2,
        speed: sIdx === 0 ? 2.8 : -2.8,
        damage: 15,
        radius: 2.4
      });

      addSummitCoin(ix, 23.0, -70);
    });

    // Moving Platform 1 (z: -100) oscillating side to side (SOLID DYNAMIC COLLISION)
    const platW = 9.0, platH = 2.2, platD = 9.0;
    const movingPlatMesh1 = addSummitBlock(0, 22.0, -100, platW, platH, platD, goldMetalMat, false);

    // Glowing golden-amber hazard border
    const platRimMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const platRim = new THREE.Mesh(new THREE.BoxGeometry(platW + 0.3, 0.35, platD + 0.3), platRimMat);
    platRim.position.y = platH / 2 + 0.05;
    movingPlatMesh1.add(platRim);

    // Glowing thruster light underneath
    const platThruster = new THREE.PointLight(0xf59e0b, 1.8, 12);
    platThruster.position.y = -1.2;
    movingPlatMesh1.add(platThruster);

    // Dynamic moving collider registered in current level
    const movingPlatCollider = {
      min: new THREE.Vector3(-platW / 2, 22.0 - platH / 2, -100 - platD / 2),
      max: new THREE.Vector3(platW / 2, 22.0 + platH / 2, -100 + platD / 2),
      isFloor: true,
      isGroundPlateau: true,
      isSummitPlatform: true,
      isSummitMovingPlatform: true
    };
    if (game.currentLevel && game.currentLevel.colliders) {
      game.currentLevel.colliders.push(movingPlatCollider);
    }

    // Register mesh for Three.js downward raycasting
    if (game._raycastCollidables && !game._raycastCollidables.includes(movingPlatMesh1)) {
      game._raycastCollidables.push(movingPlatMesh1);
    }

    summitMovingPlatforms.push({
      mesh: movingPlatMesh1,
      collider: movingPlatCollider,
      basePos: new THREE.Vector3(0, 22.0, -100),
      currentPos: new THREE.Vector3(0, 22.0, -100),
      prevPos: new THREE.Vector3(0, 22.0, -100),
      amplitude: 8.5,
      speed: 1.6,
      axis: 'x',
      halfSize: { x: platW / 2, y: platH / 2, z: platD / 2 }
    });

    // Pendulum Swinging Sawblade over moving platform chasm
    const pendulumArch = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 14, 8), basaltMat);
    pendulumArch.position.set(0, 31.0, -100);
    pendulumArch.rotation.z = Math.PI / 2;
    summitGroup.add(pendulumArch);

    const sawPendulum = createSawbladeMesh(THREE, 3.0, 18);
    sawPendulum.position.set(0, 24.5, -100);
    summitGroup.add(sawPendulum);
    summitSawblades.push({
      mesh: sawPendulum,
      type: 'pendulum',
      pivotPos: new THREE.Vector3(0, 31.0, -100),
      armLength: 6.5,
      speed: 2.4,
      damage: 15,
      radius: 3.0
    });

    // Mid Checkpoint 2 (z: -130)
    addSummitBlock(0, 23.5, -130, 12, 3.0, 12, basaltMat);
    addSummitCheckpoint(new THREE.Vector3(0, 25.0, -130), "2. Büyük Sarkaç Geçidi");
    addSummitGem(0, 27.5, -130);
    addSummitJumpPad(0, 25.2, -130, 24);

    // =========================================================================
    // 5. STAGE 3: BÜYÜK DİKİLİTAŞ TIRMANIŞ SARMALI (THE MONOLITH SPIRAL)
    // =========================================================================
    // Colossal Central Monolith
    const greatMonolith = createObeliskMesh(THREE, 48, 7.5);
    greatMonolith.position.set(0, 18.0, -210);
    summitGroup.add(greatMonolith);

    // Ascending spiral ledges wrapping around the great monolith (z: -170 -> -250)
    const spiralSteps = 12;
    for (let s = 0; s < spiralSteps; s++) {
      const angle = (s / spiralSteps) * Math.PI * 3.0;
      const radius = 9.5;
      const stepX = Math.cos(angle) * radius;
      const stepZ = -210 + Math.sin(angle) * radius;
      const stepY = 24.0 + s * 1.5;

      addSummitBlock(stepX, stepY, stepZ, 4.5, 1.4, 4.5, basaltMat);
      addSummitCoin(stepX, stepY + 1.8, stepZ);

      // Place spinning sawblades on alternate spiral steps!
      if (s === 3 || s === 7 || s === 10) {
        const spiralSaw = createSawbladeMesh(THREE, 2.0, 12);
        spiralSaw.position.set(stepX, stepY + 1.5, stepZ);
        summitGroup.add(spiralSaw);

        summitSawblades.push({
          mesh: spiralSaw,
          type: 'stationary_spin',
          basePos: new THREE.Vector3(stepX, stepY + 1.5, stepZ),
          speed: 8.0,
          damage: 15,
          radius: 2.0
        });
      }
    }

    // Top Catapult Platform of Spiral (z: -250)
    addSummitBlock(0, 42.5, -250, 10, 2.5, 10, goldMetalMat);
    addSummitCheckpoint(new THREE.Vector3(0, 44.0, -250), "3. Dikilitaş Zirve Fırlatıcı");
    addSummitGem(0, 46.5, -250);

    // Super Catapult Pad launching player toward intermediate pillars
    addSummitJumpPad(0, 44.0, -250, 26);

    // Intermediate Gliding Pillars & Stepping Platforms leading to Arena entrance (z: -270 -> -355)
    addSummitBlock(0, 40.0, -272, 8, 2.5, 8, basaltMat);
    addSummitJumpPad(0, 41.5, -272, 22);

    addSummitBlock(-8, 38.0, -295, 8, 2.5, 8, basaltMat);
    addSummitJumpPad(-8, 39.5, -295, 22);

    addSummitBlock(0, 37.0, -310, 8, 2.5, 8, basaltMat);

    addSummitBlock(8, 36.0, -325, 8, 2.5, 8, basaltMat);
    addSummitJumpPad(8, 37.5, -325, 22);

    addSummitBlock(0, 35.0, -340, 9, 2.5, 9, basaltMat);

    // Stage 3 Checkpoint: Zirve Arenası Girişi
    addSummitBlock(0, 34.0, -355, 12, 2.5, 12, basaltMat);
    addSummitCheckpoint(new THREE.Vector3(0, 35.5, -355), "Zirve Arenası Girişi");
    addSummitGem(0, 38.0, -355);

    // =========================================================================
    // 5.5 SEAMLESS GRAND ENTRANCE CAUSEWAY & BRIDGE (NO INVISIBLE WALL / VOID)
    // =========================================================================
    // Wide, majestic walkway seamlessly connecting z: -355 entrance to the Arena floor
    addSummitBlock(0, 33.4, -366, 10, 2.5, 12, basaltMat);
    addSummitBlock(0, 32.7, -376, 12, 2.5, 12, goldMetalMat);
    addSummitBlock(0, 32.2, -386, 14, 2.5, 12, basaltMat);
    addSummitBlock(0, 32.0, -396, 16, 2.5, 12, basaltMat);

    // Two Grand Ceremonial Gate Obelisks flanking the entrance walkway (leaves center completely open!)
    const leftGateOb = createObeliskMesh(THREE, 20, 2.8);
    leftGateOb.position.set(-8.5, 32.0, -382);
    summitGroup.add(leftGateOb);

    const rightGateOb = createObeliskMesh(THREE, 20, 2.8);
    rightGateOb.position.set(8.5, 32.0, -382);
    summitGroup.add(rightGateOb);

    // Entrance guide lanterns
    [-7.5, 7.5].forEach(gx => {
      const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.8), new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
      lamp.position.set(gx, 34.2, -376);
      summitGroup.add(lamp);

      const lampLight = new THREE.PointLight(0xf59e0b, 2.5, 15);
      lampLight.position.set(gx, 34.8, -376);
      summitGroup.add(lampLight);
    });

    // =========================================================================
    // 6. STAGE 4: APEX THRONE ARENA & KIRMIZI ÇİZGİ (ZİRVE TAHT ARENASI)
    // =========================================================================
    // Colossal Floating Circular Arena at (0, 30.0, -420), top floor at y: 32.05
    const arenaRadius = 36;
    const arenaMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(arenaRadius, arenaRadius + 3, 4.0, 32),
      basaltMat
    );
    arenaMesh.position.set(0, 30.0, -420);
    arenaMesh.receiveShadow = true;
    summitGroup.add(arenaMesh);

    // Downward raycast registration
    if (game) {
      if (!game._raycastCollidables) game._raycastCollidables = [];
      if (!game._raycastCollidables.includes(arenaMesh)) game._raycastCollidables.push(arenaMesh);
    }

    // Solid walkable floor collider with isFloor and isGroundPlateau
    if (game.currentLevel && game.currentLevel.colliders) {
      game.currentLevel.colliders.push({
        min: new THREE.Vector3(-arenaRadius, 28.0, -420 - arenaRadius),
        max: new THREE.Vector3(arenaRadius, 32.25, -420 + arenaRadius),
        isSummitArena: true,
        isFloor: true,
        isGroundPlateau: true,
        isIslandLawn: true,
        isSummitPlatform: true
      });

      // Circular smooth cylinder collider
      game.currentLevel.colliders.push({
        isCylinder: true,
        isRadial: true,
        center: new THREE.Vector2(0, -420),
        radius: arenaRadius + 1.5,
        minY: 28.0,
        maxY: 32.25,
        isFloor: true,
        isGroundPlateau: true,
        isIslandLawn: true,
        isSummitPlatform: true
      });
    }

    // Concentric Arena Floor Inlays
    const innerRing = new THREE.Mesh(
      new THREE.RingGeometry(12, 13.5, 32),
      new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide })
    );
    innerRing.rotation.x = -Math.PI / 2;
    innerRing.position.set(0, 32.05, -420);
    summitGroup.add(innerRing);

    const outerRing = new THREE.Mesh(
      new THREE.RingGeometry(26, 27.5, 32),
      new THREE.MeshBasicMaterial({ color: 0xa855f7, side: THREE.DoubleSide })
    );
    outerRing.rotation.x = -Math.PI / 2;
    outerRing.position.set(0, 32.05, -420);
    summitGroup.add(outerRing);

    // Perimeter Obelisks encircling Arena - ENTRANCE (oIdx = 2) LEFT COMPLETELY OPEN!
    for (let oIdx = 0; oIdx < 8; oIdx++) {
      // Leave South front gateway wide open so player can enter freely!
      if (oIdx === 2) continue;

      const angle = (oIdx / 8) * Math.PI * 2;
      const ox = Math.cos(angle) * (arenaRadius - 2.5);
      const oz = -420 + Math.sin(angle) * (arenaRadius - 2.5);

      const obMesh = createObeliskMesh(THREE, 24, 3.2);
      obMesh.position.set(ox, 32.0, oz);
      summitGroup.add(obMesh);

      // Laser energy beams connecting perimeter obelisks (skip gateway gap around index 2)
      const nextIdx = (oIdx + 1) % 8;
      if (nextIdx !== 2 && oIdx !== 1) {
        const nextAngle = (nextIdx / 8) * Math.PI * 2;
        const nox = Math.cos(nextAngle) * (arenaRadius - 2.5);
        const noz = -420 + Math.sin(nextAngle) * (arenaRadius - 2.5);

        const dx = nox - ox;
        const dz = noz - oz;
        const dist = Math.hypot(dx, dz);

        const laser = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, dist, 8), redLineMat);
        laser.position.set(ox + dx / 2, 44.0, oz + dz / 2);
        laser.rotation.z = Math.PI / 2;
        laser.rotation.y = -Math.atan2(dz, dx);
        summitGroup.add(laser);
      }

      // Health honey pot on alternate perimeter pedestals
      if (oIdx % 2 === 0) {
        addSummitGem(ox * 0.82, 34.0, oz + (oz < -420 ? 4 : -4));
      }
    }

    // =========================================================================
    // 7. BOSS: MOR AYI (KARDEŞİMİZ MORİS - FINAL BOSS)
    // =========================================================================
    const morisData = createMorisBossMesh(THREE);
    morisData.group.position.set(0, 32.0, -440);
    summitGroup.add(morisData.group);

    activeMorisBoss = {
      mesh: morisData.group,
      headGroup: morisData.headGroup,
      hammerGroup: morisData.hammerGroup,
      pos: new THREE.Vector3(0, 32.0, -440),
      spawnPos: new THREE.Vector3(0, 32.0, -440),
      hp: 750,
      maxHp: 750,
      speed: 6.8,
      slamCooldown: 3.5,
      whirlwindCooldown: 9.0,
      isWhirlwinding: false,
      whirlwindTimer: 0,
      isEnraged: false,
      isDead: false,
      animTimer: 0,
      phaseText: "1. FAZ: ZİRVE DÜELLOSU"
    };

    // Welcome announcement for Earth Summit
    if (game.callbacks && game.callbacks.onShowNotice) {
      game.callbacks.onShowNotice("⛰️ 15. Bölüm: Dünya Final Zirvesi & Kırmızı Çizgi! Aşırı tehlikeli parkurlar ve Mor Ayı seni bekliyor!", "warn");
    }
  }

  // ============================================================================
  // UPDATE LOOP (TESTERELER, MOR AYI BOSS AI & COLLISION)
  // ============================================================================
  function updateEarthSummit(game, dt = 0.016) {
    if (!game || game.currentRegion !== 'earth_summit') return;
    const pPos = game.playerPos;
    const THREE = window.THREE;
    if (!pPos || !THREE) return;

    // Continuously enforce expansive level bounds & prevent any invisible walls
    if (game.currentLevel) {
      if (!game.currentLevel.bounds || game.currentLevel.bounds.minZ > -2500) {
        game.currentLevel.bounds = {
          minX: -1500,
          maxX: 1500,
          minZ: -3500,
          maxZ: 800,
          minY: -100,
          maxY: 800
        };
      }
      if (game.currentLevel.invisibleWallMeshes && game.currentLevel.invisibleWallMeshes.length > 0) {
        game.currentLevel.invisibleWallMeshes = [];
      }
    }

    const time = performance.now() / 1000;

    // 1. UPDATE ROTATING SAWBLADES
    for (let i = 0; i < summitSawblades.length; i++) {
      const saw = summitSawblades[i];
      if (!saw || !saw.mesh) continue;

      // Always spin rapidly
      saw.mesh.rotation.z += dt * (saw.speed || 12.0);

      // Trajectory updates
      if (saw.type === 'sliding_x' && saw.basePos) {
        saw.mesh.position.x = saw.basePos.x + Math.sin(time * saw.speed) * saw.amplitude;
      } else if (saw.type === 'orbital' && saw.centerPos) {
        saw.mesh.position.x = saw.centerPos.x + Math.cos(time * saw.speed) * saw.orbitRadius;
        saw.mesh.position.z = saw.centerPos.z + Math.sin(time * saw.speed) * saw.orbitRadius;
      } else if (saw.type === 'pendulum' && saw.pivotPos) {
        const swingAngle = Math.sin(time * saw.speed) * 0.9;
        saw.mesh.position.x = saw.pivotPos.x + Math.sin(swingAngle) * saw.armLength;
        saw.mesh.position.y = saw.pivotPos.y - Math.cos(swingAngle) * saw.armLength;
      }

      // Proximity damage collision with Player
      const dSaw = pPos.distanceTo(saw.mesh.position);
      if (dSaw < (saw.radius || 2.4)) {
        const now = Date.now();
        if (!saw._lastHit || now - saw._lastHit > 1000) {
          saw._lastHit = now;
          if (game.damagePlayer) game.damagePlayer(saw.damage || 15);
          if (typeof window.triggerScreenShake === 'function') window.triggerScreenShake();
          if (window.St && window.St.playDamage) window.St.playDamage();

          if (game.spawnSparkleParticles) {
            game.spawnSparkleParticles(saw.mesh.position, 35, 0xff0000);
            game.spawnSparkleParticles(pPos, 25, 0xfacc15);
          }

          // Knockback radial push
          if (game.playerVel) {
            game.playerVel.y = 10.0;
            const pushDir = pPos.clone().sub(saw.mesh.position).normalize();
            game.playerVel.x = pushDir.x * 16.0;
            game.playerVel.z = pushDir.z * 16.0;
          }

          if (game.callbacks && game.callbacks.onShowNotice) {
            game.callbacks.onShowNotice("⚡ DÖNEN TESTERE DARBESİ! (-15 Can)", "error");
          }
        }
      }
    }

    // 2. UPDATE MOVING PLATFORMS (DYNAMIC COLLISION & PLAYER RIDING)
    for (let m = 0; m < summitMovingPlatforms.length; m++) {
      const plat = summitMovingPlatforms[m];
      if (!plat || !plat.mesh) continue;

      plat.prevPos.copy(plat.currentPos);
      const offset = Math.sin(time * plat.speed) * plat.amplitude;
      if (plat.axis === 'x') {
        plat.currentPos.x = plat.basePos.x + offset;
      } else if (plat.axis === 'z') {
        plat.currentPos.z = plat.basePos.z + offset;
      }
      plat.mesh.position.copy(plat.currentPos);

      const hs = plat.halfSize;

      // 1. Keep Box3 physics collider perfectly in sync with moving platform in world space
      if (plat.collider) {
        plat.collider.min.set(
          plat.currentPos.x - hs.x,
          plat.currentPos.y - hs.y,
          plat.currentPos.z - hs.z
        );
        plat.collider.max.set(
          plat.currentPos.x + hs.x,
          plat.currentPos.y + hs.y,
          plat.currentPos.z + hs.z
        );
      }

      // 2. Player Solid Ground Landing & Platform Carrier
      const platTopY = plat.currentPos.y + hs.y;
      const isPlayerHorizOver = (
        pPos.x >= plat.currentPos.x - hs.x - 0.35 &&
        pPos.x <= plat.currentPos.x + hs.x + 0.35 &&
        pPos.z >= plat.currentPos.z - hs.z - 0.35 &&
        pPos.z <= plat.currentPos.z + hs.z + 0.35
      );

      if (isPlayerHorizOver) {
        const vertDiff = pPos.y - platTopY;
        const isLandingOrStanding = (vertDiff >= -0.95 && vertDiff <= 1.5 && (!game.playerVel || game.playerVel.y <= 0.8));

        if (isLandingOrStanding) {
          // Snap player feet onto platform top so player NEVER clips through
          pPos.y = platTopY;
          if (game.playerVel && game.playerVel.y < 0) {
            game.playerVel.y = 0;
          }
          if (game.isGrounded !== undefined) {
            game.isGrounded = true;
          }
          if (game.jumpCount !== undefined) {
            game.jumpCount = 0;
          }

          // Move player along with the platform
          const dx = plat.currentPos.x - plat.prevPos.x;
          const dz = plat.currentPos.z - plat.prevPos.z;
          pPos.x += dx;
          pPos.z += dz;
        }
      }
    }

    // 3. UPDATE JUMP PADS
    for (let j = 0; j < summitJumpPads.length; j++) {
      const pad = summitJumpPads[j];
      if (!pad) continue;
      const dPad = Math.hypot(pPos.x - pad.pos.x, pPos.z - pad.pos.z);
      if (dPad < 2.5 && Math.abs(pPos.y - pad.pos.y) < 2.0) {
        const now = Date.now();
        if (!pad._lastBounce || now - pad._lastBounce > 600) {
          pad._lastBounce = now;
          if (game.playerVel) game.playerVel.y = pad.power || 22;
          if (game.isGrounded !== undefined) game.isGrounded = false;
          if (window.St && window.St.playDoubleJump) window.St.playDoubleJump();
          if (game.spawnSparkleParticles) {
            game.spawnSparkleParticles(pad.pos, 30, 0xef4444);
          }
        }
      }
    }

    // 4. UPDATE CHECKPOINTS
    for (let c = 0; c < summitCheckpoints.length; c++) {
      const cp = summitCheckpoints[c];
      if (!cp || cp.activated) continue;
      const dCp = pPos.distanceTo(cp.pos);
      if (dCp < 3.2) {
        cp.activated = true;
        if (cp.flag && cp.flag.material) {
          cp.flag.material.color.setHex(0x22c55e);
          cp.flag.material.emissive.setHex(0x16a34a);
        }
        if (game.currentLevel && game.currentLevel.spawnPoint) {
          game.currentLevel.spawnPoint.copy(cp.pos);
        }
        if (window.St && window.St.playHoneyGem) window.St.playHoneyGem();
        if (game.spawnSparkleParticles) game.spawnSparkleParticles(cp.pos, 35, 0x22c55e);
        if (game.callbacks && game.callbacks.onShowNotice) {
          game.callbacks.onShowNotice(`🚩 Kontrol Noktası Kaydedildi: ${cp.name}`, "success");
        }
      }
    }

    // 5. UPDATE RED LINE VISUAL PULSE
    const redPulse = 0.8 + Math.sin(time * 3.5) * 0.3;
    for (let r = 0; r < summitRedLineBeams.length; r++) {
      const beam = summitRedLineBeams[r];
      if (beam && beam.material) {
        if (beam.material.color) beam.material.color.setHex(0xff0033);
      }
    }

    // 6. --- 👑 MOR AYI (MORİS) BOSS AI & COMBAT LOOP ---
    if (activeMorisBoss && !activeMorisBoss.isDead) {
      const boss = activeMorisBoss;
      boss.animTimer += dt * 3.0;

      const distToPlayer = Math.hypot(pPos.x - boss.pos.x, pPos.z - boss.pos.z);
      const inArena = pPos.z < -360 && pPos.z > -470 && Math.abs(pPos.x) < 40;

      // Show Boss Health Bar when in arena
      if (inArena) {
        updateSummitBossHp(boss.hp, boss.maxHp, boss.isEnraged ? "🔥 2. FAZ: ÖFKELİ MORİS" : "1. FAZ: ZİRVE DÜELLOSU");
      } else {
        updateSummitBossHp(0, boss.maxHp);
      }

      // Check Phase Transition to Enraged Mode (< 380 HP)
      if (boss.hp < 380 && !boss.isEnraged) {
        boss.isEnraged = true;
        boss.speed = 9.8;
        boss.slamCooldown = 2.2;
        if (typeof window.triggerScreenShake === 'function') window.triggerScreenShake();
        if (window.St && window.St.playBossRoar) window.St.playBossRoar();
        if (game.callbacks && game.callbacks.onShowNotice) {
          game.callbacks.onShowNotice("🔥 MOR AYI ÖFKELENDİ! Hareket hızı ve çekiç darbeleri iki katına çıktı!", "error");
        }
      }

      if (inArena) {
        // Face Player
        const angleToPlayer = Math.atan2(pPos.x - boss.pos.x, pPos.z - boss.pos.z);
        boss.mesh.rotation.y = angleToPlayer;

        // Boss Movement: Run towards player
        const moveDir = new THREE.Vector3(pPos.x - boss.pos.x, 0, pPos.z - boss.pos.z).normalize();
        if (distToPlayer > 3.6) {
          boss.pos.x += moveDir.x * boss.speed * dt;
          boss.pos.z += moveDir.z * boss.speed * dt;
        }

        // Clamp inside arena bounds
        const arenaDist = Math.hypot(boss.pos.x, boss.pos.z - (-420));
        if (arenaDist > 32.0) {
          const clampAngle = Math.atan2(boss.pos.x, boss.pos.z - (-420));
          boss.pos.x = Math.sin(clampAngle) * 31.0;
          boss.pos.z = -420 + Math.cos(clampAngle) * 31.0;
        }
        boss.mesh.position.copy(boss.pos);

        // Hammer Idle Swing Animation
        if (boss.hammerGroup) {
          boss.hammerGroup.rotation.x = Math.sin(boss.animTimer * 2.0) * 0.35;
        }

        // Boss Attack 1: DEV ÇEKİÇ SLAM (HAMMER SHOCKWAVE)
        boss.slamTimer = (boss.slamTimer || 0) + dt;
        if (boss.slamTimer > boss.slamCooldown) {
          boss.slamTimer = 0;

          // Perform slam leap
          boss.pos.y = 35.5; // Jump up
          setTimeout(() => {
            if (!boss || boss.isDead) return;
            boss.pos.y = 32.0; // Smash down
            if (typeof window.triggerScreenShake === 'function') window.triggerScreenShake();
            if (window.St && window.St.playHammerSlam) window.St.playHammerSlam();
            else if (window.St && window.St.playEnemyHit) window.St.playEnemyHit();

            // Expanding Shockwave ring
            if (game.spawnSparkleParticles) {
              game.spawnSparkleParticles(boss.pos, 45, 0xef4444);
              game.spawnSparkleParticles(boss.pos, 35, 0xa855f7);
            }

            // Damage player if on floor within slam range
            const dSlam = Math.hypot(pPos.x - boss.pos.x, pPos.z - boss.pos.z);
            if (dSlam < 14.0 && Math.abs(pPos.y - 32.0) < 1.4) {
              if (game.damagePlayer) game.damagePlayer(16);
              if (game.playerVel) {
                game.playerVel.y = 11.0;
                game.playerVel.x = (pPos.x - boss.pos.x) * 1.5;
                game.playerVel.z = (pPos.z - boss.pos.z) * 1.5;
              }
              if (game.callbacks && game.callbacks.onShowNotice) {
                game.callbacks.onShowNotice("💥 MOR AYI ÇEKİÇ ŞOKU! Zıplayarak şok dalgasından kaçın!", "error");
              }
            }
          }, 450);
        }

        // Boss Attack 2: Close-Range Claw/Hammer Strike
        if (distToPlayer < 3.8 && Math.abs(pPos.y - boss.pos.y) < 2.5) {
          const now = Date.now();
          if (!boss._lastMelee || now - boss._lastMelee > 1200) {
            boss._lastMelee = now;
            if (game.damagePlayer) game.damagePlayer(14);
            if (typeof window.triggerScreenShake === 'function') window.triggerScreenShake();
            if (game.playerVel) {
              game.playerVel.y = 8.0;
              game.playerVel.x = moveDir.x * 12.0;
              game.playerVel.z = moveDir.z * 12.0;
            }
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("⚔️ Mor Ayı'nın Ezici Çekici Darbesi! (-14 Can)", "warn");
            }
          }
        }

        // PLAYER DAMAGING MORIS (Jump Stomp or Weapon Strike)
        // 1. Jump Stomp on head/shoulders
        if (distToPlayer < 3.8 && pPos.y > boss.pos.y + 3.2 && game.playerVel && game.playerVel.y < 0) {
          const now = Date.now();
          if (!boss._lastStomp || now - boss._lastStomp > 700) {
            boss._lastStomp = now;
            boss.hp = Math.max(0, boss.hp - 35);
            updateSummitBossHp(boss.hp, boss.maxHp);
            if (game.playerVel) game.playerVel.y = 18.0; // High bounce
            if (typeof window.triggerScreenShake === 'function') window.triggerScreenShake();
            if (window.St && window.St.playEnemyHit) window.St.playEnemyHit();
            if (game.spawnSparkleParticles) {
              game.spawnSparkleParticles(boss.pos.clone().add(new THREE.Vector3(0, 4, 0)), 40, 0xfacc15);
            }
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice(`💥 Mor Ayı'nın Kafasına Zıpladın! Kalan Can: ${boss.hp}/${boss.maxHp}`, "success");
            }
          }
        }

        // 2. Weapon / Attack key hit proximity check
        if (game.isAttacking && distToPlayer < 4.8) {
          const now = Date.now();
          if (!boss._lastWeaponHit || now - boss._lastWeaponHit > 500) {
            boss._lastWeaponHit = now;
            const dmg = (game.stats && game.stats.attackPower) ? Math.max(20, game.stats.attackPower * 1.5) : 30;
            boss.hp = Math.max(0, boss.hp - dmg);
            updateSummitBossHp(boss.hp, boss.maxHp);
            if (typeof window.triggerScreenShake === 'function') window.triggerScreenShake();
            if (window.St && window.St.playHammerSlam) window.St.playHammerSlam();
            else if (window.St && window.St.playDamage) window.St.playDamage();
            if (game.spawnSparkleParticles) {
              game.spawnSparkleParticles(boss.pos, 35, 0xef4444);
            }
          }
        }

        // --- BOSS DEFEAT SEQUENCE ---
        if (boss.hp <= 0 && !boss.isDead) {
          boss.isDead = true;
          updateSummitBossHp(0, boss.maxHp);

          // Kneel animation
          boss.mesh.rotation.x = Math.PI / 4;
          boss.pos.y = 31.0;
          boss.mesh.position.copy(boss.pos);

          if (typeof window.triggerScreenShake === 'function') window.triggerScreenShake();
          if (window.St && window.St.playGoalFanfare) window.St.playGoalFanfare();
          if (window.St && window.St.playBossRoar) window.St.playBossRoar();

          if (typeof window.confetti === 'function') {
            window.confetti({ particleCount: 250, spread: 100, origin: { y: 0.5 } });
          }

          // Gold and XP rewards
          if (game.stats) {
            game.stats.coins = (game.stats.coins || 0) + 500;
            game.stats.xp = (game.stats.xp || 0) + 1000;
            game.stats.honeyGems = (game.stats.honeyGems || 0) + 10;
            if (game.callbacks && game.callbacks.onStatsUpdate) game.callbacks.onStatsUpdate(game.stats);
          }

          if (game.callbacks && game.callbacks.onBossDefeated) {
            game.callbacks.onBossDefeated("boss_mor_ayi", "earth_summit", true);
          }

          // Brotherly Dialogue / Victory Popup
          if (game.callbacks && game.callbacks.onShowNotice) {
            game.callbacks.onShowNotice("🐻 Mor Ayı: 'Kardeşim... Başardın! Sonunda gözümdeki karanlık dağıldı. Artık köyümüze dönme vakti! ❤️🏡'", "success");
          }

          // SPAWN THE GRAND GOLDEN RETURN PORTAL TO AYI KÖYÜ (HUB)
          spawnSummitVictoryPortal(game);
        }
      }
    }

    // 7. VICTORY PORTAL ROTATION & PROXIMITY CHECK
    if (victoryPortal && victoryPortal.mesh) {
      victoryPortal.mesh.rotation.y += dt * 2.2;
      victoryPortal.mesh.rotation.z += dt * 1.5;

      const dPortal = pPos.distanceTo(victoryPortal.pos);
      if (dPortal < 3.2 && !victoryPortal.triggered) {
        victoryPortal.triggered = true;
        if (window.St && window.St.playGoalFanfare) window.St.playGoalFanfare();
        if (game.spawnSparkleParticles) game.spawnSparkleParticles(victoryPortal.pos, 50, 0xfacc15);

        if (game.callbacks && game.callbacks.onShowNotice) {
          game.callbacks.onShowNotice("🎉 TEBRİKLER! Tüm Dünya Bölümleri Tamamlandı! Kardeşin Mor Ayı ile birlikte Ayı Köyü'ne Şanlı Dönüş Yaptın! 🏡🐻", "success");
        }

        setTimeout(() => {
          if (game.loadRegion) game.loadRegion('hub');
          else if (game.callbacks && game.callbacks.onSelectRegion) game.callbacks.onSelectRegion('hub');
        }, 1200);
      }
    }
  }

  // Spawn Grand Golden Victory Portal to Ayı Köyü
  function spawnSummitVictoryPortal(game) {
    if (!game || !game.scene || !window.THREE) return;
    const THREE = window.THREE;

    const portalPos = new THREE.Vector3(0, 34.0, -420);
    const portalGroup = new THREE.Group();
    portalGroup.position.copy(portalPos);
    portalGroup.name = "summit_victory_portal_to_hub";

    // Golden Radiant Torus
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xb45309,
      emissiveIntensity: 0.95,
      metalness: 0.9,
      roughness: 0.1
    });

    const torus = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.7, 16, 32), torusMat);
    portalGroup.add(torus);

    // Inner Glowing Vortex
    const vortexMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });
    const vortex = new THREE.Mesh(new THREE.CircleGeometry(3.0, 24), vortexMat);
    portalGroup.add(vortex);

    // Golden Pedestal
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.6, 1.2, 16), torusMat);
    ped.position.y = -2.4;
    portalGroup.add(ped);

    summitGroup.add(portalGroup);

    victoryPortal = {
      mesh: torus,
      group: portalGroup,
      pos: portalPos,
      triggered: false
    };

    // Constant particle sparks around portal
    if (game.spawnSparkleParticles) {
      for (let k = 0; k < 6; k++) {
        setTimeout(() => {
          if (victoryPortal) game.spawnSparkleParticles(portalPos, 35, 0xfacc15);
        }, k * 250);
      }
    }
  }

  // Cleanup helper
  function cleanUpEarthSummit(game) {
    if (summitHpBarContainer) {
      summitHpBarContainer.style.display = 'none';
    }

    if (summitGroup && summitGroup.parent) {
      summitGroup.parent.remove(summitGroup);
    }
    summitGroup = null;
    activeMorisBoss = null;
    victoryPortal = null;
    summitSawblades = [];
    summitMovingPlatforms = [];
    summitJumpPads = [];
    summitCheckpoints = [];
    summitRedLineBeams = [];

    const targetGame = game || window.__superBearGame;
    if (targetGame && targetGame.currentLevel && targetGame.currentLevel.colliders) {
      targetGame.currentLevel.colliders = targetGame.currentLevel.colliders.filter(
        c => !c.isSummitPlatform && !c.isSummitArena && !c.isSummitMovingPlatform
      );
    }
  }

  // Expose to window
  window.__populateEarthSummit = populateEarthSummit;
  window.__updateEarthSummit = updateEarthSummit;
  window.__cleanUpEarthSummit = cleanUpEarthSummit;

  // Region change listener
  window.addEventListener('superbear:region-changed', (e) => {
    const newReg = e.detail;
    const game = window.__superBearGame;
    if (newReg === 'earth_summit') {
      setTimeout(() => {
        populateEarthSummit(game);
      }, 150);
    } else {
      cleanUpEarthSummit(game);
    }
  });

  console.log("⛰️ Earth Final Summit & Red Line Engine loaded successfully!");
})();
