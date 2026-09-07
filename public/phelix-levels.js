// ===================================================================
// GRIZZY'NIN BÜYÜK MACERASI - PHELİX GEZEGENİ (MAVİ ÇİZGİ)
// 9 DEVASA BÖLÜM, TİLKİ GEMİSİ LAZER SALDIRISI & PARAŞÜT SİNEMATİĞİ, TİLKİ BOSS
// ===================================================================

(function() {
  console.log("🔷 Initializing Phelix Gezegeni Engine (Mavi Çizgi, 9 Bölüm & Tilki Boss)...");

  const PHELIX_LEVEL_MAP = {
    'phelix_1_oases': 'phelix_level_1',
    'phelix_level_1': 'phelix_level_1',
    'phelix_2_neon_verge': 'phelix_level_2',
    'phelix_level_2': 'phelix_level_2',
    'phelix_3_ashen_vale': 'phelix_level_3',
    'phelix_level_3': 'phelix_level_3',
    'phelix_4_titanium_canyon': 'phelix_level_4',
    'phelix_level_4': 'phelix_level_4',
    'phelix_5_eye_of_tempest': 'phelix_level_5',
    'phelix_level_5': 'phelix_level_5',
    'phelix_6_cyber_void': 'phelix_level_6',
    'phelix_level_6': 'phelix_level_6',
    'phelix_7_primal_relics': 'phelix_level_7',
    'phelix_level_7': 'phelix_level_7',
    'phelix_8_orbital_belt': 'phelix_level_8',
    'phelix_level_8': 'phelix_level_8',
    'phelix_9_core_boss': 'phelix_level_9',
    'phelix_level_9': 'phelix_level_9',
  };

  const PHELIX_LEVEL_IDS = Object.keys(PHELIX_LEVEL_MAP);

  let currentPhelixLevelId = null;
  let phelixSceneGroup = null;
  let phelixCameraShake = 0;
  let damageIframeTimer = 0;
  let activeCheckpointPos = null;

  // Boss & Cutscene states
  let foxBossInstance = null;
  let isPhelixCutscenePlaying = false;
  let phelixCutsceneObjects = [];

  const animatedObjects = [];
  const phelixShockwaves = [];
  const movingPlatforms = [];
  const laserHazards = [];

  // --- TOP BOSS HEALTH BAR UI (TİLKİ BOSS) ---
  let foxBossHpContainer = document.getElementById('phelix-boss-hp-container');
  if (!foxBossHpContainer) {
    foxBossHpContainer = document.createElement('div');
    foxBossHpContainer.id = 'phelix-boss-hp-container';
    foxBossHpContainer.style.position = 'absolute';
    foxBossHpContainer.style.top = '36px';
    foxBossHpContainer.style.left = '50%';
    foxBossHpContainer.style.transform = 'translateX(-50%)';
    foxBossHpContainer.style.width = '540px';
    foxBossHpContainer.style.maxWidth = '92vw';
    foxBossHpContainer.style.backgroundColor = 'rgba(8, 47, 73, 0.95)';
    foxBossHpContainer.style.border = '2px solid #38bdf8';
    foxBossHpContainer.style.borderRadius = '16px';
    foxBossHpContainer.style.padding = '10px 16px';
    foxBossHpContainer.style.display = 'none';
    foxBossHpContainer.style.zIndex = '1000';
    foxBossHpContainer.style.boxShadow = '0 0 35px rgba(56, 189, 248, 0.65), 0 4px 25px rgba(0,0,0,0.9)';
    foxBossHpContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif';

    const bossHeader = document.createElement('div');
    bossHeader.style.display = 'flex';
    bossHeader.style.justifyContent = 'space-between';
    bossHeader.style.alignItems = 'center';
    bossHeader.style.marginBottom = '6px';

    const bossTitle = document.createElement('div');
    bossTitle.id = 'phelix-boss-title';
    bossTitle.style.fontWeight = '900';
    bossTitle.style.fontSize = '14px';
    bossTitle.style.color = '#bae6fd';
    bossTitle.style.display = 'flex';
    bossTitle.style.alignItems = 'center';
    bossTitle.style.gap = '8px';
    bossTitle.innerHTML = '🦊 FİNAL BOSS: TİLKİ BOSS (MECHA WARLORD)';

    const bossHpText = document.createElement('div');
    bossHpText.id = 'phelix-boss-hp-text';
    bossHpText.style.fontWeight = '800';
    bossHpText.style.fontSize = '13px';
    bossHpText.style.color = '#38bdf8';
    bossHpText.innerText = '100 / 100';

    bossHeader.appendChild(bossTitle);
    bossHeader.appendChild(bossHpText);

    const hpTrack = document.createElement('div');
    hpTrack.style.width = '100%';
    hpTrack.style.height = '14px';
    hpTrack.style.backgroundColor = '#0c4a6e';
    hpTrack.style.borderRadius = '8px';
    hpTrack.style.overflow = 'hidden';
    hpTrack.style.border = '1px solid rgba(56, 189, 248, 0.5)';

    const hpFill = document.createElement('div');
    hpFill.id = 'phelix-boss-hp-fill';
    hpFill.style.width = '100%';
    hpFill.style.height = '100%';
    hpFill.style.background = 'linear-gradient(90deg, #0284c7, #38bdf8, #f59e0b, #ef4444)';
    hpFill.style.borderRadius = '7px';
    hpFill.style.transition = 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)';

    hpTrack.appendChild(hpFill);

    const bossStatus = document.createElement('div');
    bossStatus.id = 'phelix-boss-status';
    bossStatus.style.fontSize = '11px';
    bossStatus.style.color = '#fef08a';
    bossStatus.style.marginTop = '4px';
    bossStatus.style.fontWeight = '700';
    bossStatus.style.textAlign = 'center';
    bossStatus.innerText = '⚡ Tilki Boss Savaş Robotunu Kullanıyor! Lazerlerden Kaç ve Kafasına Zıpla!';

    foxBossHpContainer.appendChild(bossHeader);
    foxBossHpContainer.appendChild(hpTrack);
    foxBossHpContainer.appendChild(bossStatus);
    document.body.appendChild(foxBossHpContainer);
  }

  function showFoxBossHp(title, hp, maxHp, statusText) {
    if (!foxBossHpContainer) return;
    foxBossHpContainer.style.display = 'block';
    const titleEl = document.getElementById('phelix-boss-title');
    const textEl = document.getElementById('phelix-boss-hp-text');
    const fillEl = document.getElementById('phelix-boss-hp-fill');
    const statEl = document.getElementById('phelix-boss-status');

    if (titleEl && title) titleEl.innerHTML = title;
    const pct = Math.max(0, Math.min(100, (hp / maxHp) * 100));
    if (fillEl) fillEl.style.width = pct + '%';
    if (textEl) textEl.innerText = `${Math.max(0, Math.ceil(hp))} / ${maxHp}`;
    if (statEl && statusText) statEl.innerText = statusText;
  }

  function hideFoxBossHp() {
    if (foxBossHpContainer) foxBossHpContainer.style.display = 'none';
  }

  // --- AUDIO SYNTHESIZER ---
  function playAudioTone(freq = 600, dur = 0.12, type = 'sine') {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!window.__phelixAudioCtx) window.__phelixAudioCtx = new AudioCtx();
      const ctx = window.__phelixAudioCtx;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch (e) {}
  }

  // --- CINEMATIC OVERLAY ---
  let phelixCutsceneContainer = document.getElementById('phelix-cutscene-overlay');
  let phelixAdvanceFn = null;

  if (!phelixCutsceneContainer) {
    phelixCutsceneContainer = document.createElement('div');
    phelixCutsceneContainer.id = 'phelix-cutscene-overlay';
    phelixCutsceneContainer.style.position = 'fixed';
    phelixCutsceneContainer.style.inset = '0';
    phelixCutsceneContainer.style.pointerEvents = 'auto';
    phelixCutsceneContainer.style.zIndex = '1100';
    phelixCutsceneContainer.style.display = 'none';
    phelixCutsceneContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    phelixCutsceneContainer.style.userSelect = 'none';

    // Top Header
    const topBar = document.createElement('div');
    topBar.id = 'phelix-top-bar';
    topBar.style.position = 'absolute';
    topBar.style.top = '0';
    topBar.style.left = '0';
    topBar.style.right = '0';
    topBar.style.height = '68px';
    topBar.style.backgroundColor = 'rgba(2, 6, 23, 0.94)';
    topBar.style.borderBottom = '2px solid #38bdf8';
    topBar.style.display = 'flex';
    topBar.style.alignItems = 'center';
    topBar.style.justifyContent = 'space-between';
    topBar.style.padding = '0 24px';
    topBar.style.backdropFilter = 'blur(10px)';

    topBar.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 24px;">🔷</span>
        <div>
          <div style="font-weight: 900; color: #38bdf8; font-size: 15px; letter-spacing: 1px;">
            PHELİX GEZEGENİ — 1. BÖLÜM SİNEMATİĞİ: TİLKİ SALDIRISI & PARAŞÜT İNİŞİ
          </div>
          <div style="font-size: 12px; color: #94a3b8; font-weight: 600;">
            Grizzy'nin sakin yolculuğu, Tilki'nin pusu lazerleri ve paraşütle Vahalara iniş!
          </div>
        </div>
      </div>
      <button id="phelix-skip-btn" style="background: rgba(56, 189, 248, 0.2); border: 1.5px solid #38bdf8; color: #bae6fd; font-weight: 800; font-size: 12px; padding: 7px 18px; border-radius: 9999px; cursor: pointer;">
        Sinematiği Geç ⏭️
      </button>
    `;

    // Bottom Subtitle Box
    const bottomBar = document.createElement('div');
    bottomBar.id = 'phelix-bottom-bar';
    bottomBar.style.position = 'absolute';
    bottomBar.style.bottom = '0';
    bottomBar.style.left = '0';
    bottomBar.style.right = '0';
    bottomBar.style.minHeight = '145px';
    bottomBar.style.backgroundColor = 'rgba(2, 6, 23, 0.96)';
    bottomBar.style.borderTop = '2.5px solid #38bdf8';
    bottomBar.style.display = 'flex';
    bottomBar.style.flexDirection = 'column';
    bottomBar.style.alignItems = 'center';
    bottomBar.style.justifyContent = 'center';
    bottomBar.style.padding = '18px 28px';
    bottomBar.style.boxShadow = '0 -15px 35px rgba(0,0,0,0.85)';

    const progressTrack = document.createElement('div');
    progressTrack.style.position = 'absolute';
    progressTrack.style.top = '0';
    progressTrack.style.left = '0';
    progressTrack.style.right = '0';
    progressTrack.style.height = '4px';
    progressTrack.style.backgroundColor = '#1e293b';

    const progressBar = document.createElement('div');
    progressBar.id = 'phelix-cutscene-progress';
    progressBar.style.width = '0%';
    progressBar.style.height = '100%';
    progressBar.style.backgroundColor = '#38bdf8';
    progressBar.style.transition = 'width 0.1s linear';
    progressTrack.appendChild(progressBar);
    bottomBar.appendChild(progressTrack);

    const contentWrap = document.createElement('div');
    contentWrap.style.display = 'flex';
    contentWrap.style.alignItems = 'center';
    contentWrap.style.gap = '20px';
    contentWrap.style.width = '100%';
    contentWrap.style.maxWidth = '880px';

    const avatarBox = document.createElement('div');
    avatarBox.id = 'phelix-avatar-box';
    avatarBox.style.width = '64px';
    avatarBox.style.height = '64px';
    avatarBox.style.borderRadius = '18px';
    avatarBox.style.backgroundColor = '#0369a1';
    avatarBox.style.border = '2px solid #38bdf8';
    avatarBox.style.display = 'flex';
    avatarBox.style.alignItems = 'center';
    avatarBox.style.justifyContent = 'center';
    avatarBox.style.fontSize = '34px';
    avatarBox.style.flexShrink = '0';
    contentWrap.appendChild(avatarBox);

    const textCol = document.createElement('div');
    textCol.style.flex = '1';

    const speakerBadge = document.createElement('div');
    speakerBadge.id = 'phelix-speaker-badge';
    speakerBadge.style.display = 'inline-flex';
    speakerBadge.style.alignItems = 'center';
    speakerBadge.style.padding = '3px 12px';
    speakerBadge.style.borderRadius = '9999px';
    speakerBadge.style.fontWeight = '900';
    speakerBadge.style.fontSize = '12px';
    speakerBadge.style.letterSpacing = '1px';
    speakerBadge.style.marginBottom = '6px';
    textCol.appendChild(speakerBadge);

    const subtitleBox = document.createElement('div');
    subtitleBox.id = 'phelix-subtitle-box';
    subtitleBox.style.color = '#f8fafc';
    subtitleBox.style.fontSize = '16px';
    subtitleBox.style.fontWeight = '700';
    subtitleBox.style.lineHeight = '1.5';
    textCol.appendChild(subtitleBox);

    contentWrap.appendChild(textCol);

    const advanceBtn = document.createElement('button');
    advanceBtn.id = 'phelix-advance-btn';
    advanceBtn.style.background = 'linear-gradient(135deg, #0284c7, #38bdf8)';
    advanceBtn.style.color = '#0c4a6e';
    advanceBtn.style.fontWeight = '900';
    advanceBtn.style.fontSize = '13px';
    advanceBtn.style.padding = '12px 20px';
    advanceBtn.style.borderRadius = '14px';
    advanceBtn.style.border = 'none';
    advanceBtn.style.cursor = 'pointer';
    advanceBtn.innerText = 'Devam Et ➔';
    contentWrap.appendChild(advanceBtn);

    bottomBar.appendChild(contentWrap);

    phelixCutsceneContainer.appendChild(topBar);
    phelixCutsceneContainer.appendChild(bottomBar);
    document.body.appendChild(phelixCutsceneContainer);

    advanceBtn.onclick = (e) => {
      e.stopPropagation();
      if (typeof phelixAdvanceFn === 'function') phelixAdvanceFn();
    };
    bottomBar.onclick = () => {
      if (typeof phelixAdvanceFn === 'function') phelixAdvanceFn();
    };
    const skipBtn = topBar.querySelector('#phelix-skip-btn');
    if (skipBtn) {
      skipBtn.onclick = (e) => {
        e.stopPropagation();
        if (typeof window.__endPhelixCutscene === 'function') window.__endPhelixCutscene();
      };
    }
  }

  // Flash overlay
  let phelixFlash = document.getElementById('phelix-flash');
  if (!phelixFlash) {
    phelixFlash = document.createElement('div');
    phelixFlash.id = 'phelix-flash';
    phelixFlash.style.position = 'fixed';
    phelixFlash.style.inset = '0';
    phelixFlash.style.backgroundColor = '#ffffff';
    phelixFlash.style.opacity = '0';
    phelixFlash.style.pointerEvents = 'none';
    phelixFlash.style.zIndex = '1200';
    phelixFlash.style.transition = 'opacity 0.15s ease-out';
    document.body.appendChild(phelixFlash);
  }

  function triggerPhelixFlash(color = '#ffffff') {
    if (!phelixFlash) return;
    phelixFlash.style.backgroundColor = color;
    phelixFlash.style.opacity = '0.95';
    setTimeout(() => { phelixFlash.style.opacity = '0'; }, 300);
  }

  // --- COLLIDERS & PLATFORMS ---
  function addBoxCollider(game, minX, minY, minZ, maxX, maxY, maxZ, opts = {}) {
    if (!game || !game.currentLevel) return null;
    if (!game.currentLevel.colliders) game.currentLevel.colliders = [];
    const collider = {
      min: new window.THREE.Vector3(minX, minY, minZ),
      max: new window.THREE.Vector3(maxX, maxY, maxZ),
      isToxic: !!opts.isToxic,
      isClimbable: !!opts.isClimbable
    };
    game.currentLevel.colliders.push(collider);
    return collider;
  }

  function addGroundedPlatform(game, scene, config) {
    const THREE = window.THREE;
    const {
      x = 0, topY = 0, z = 0,
      w = 10, h = 3.5, d = 10,
      color = 0x0284c7,
      emissive = 0x0369a1,
      roughness = 0.35,
      metalness = 0.4,
      shape = 'box'
    } = config;

    const group = new THREE.Group();
    group.position.set(x, topY - h / 2, z);

    let mainGeo;
    if (shape === 'cylinder') {
      mainGeo = new THREE.CylinderGeometry(w / 2, w / 2 * 1.08, h, 24);
    } else if (shape === 'hex') {
      mainGeo = new THREE.CylinderGeometry(w / 1.7, w / 1.7 * 1.08, h, 6);
    } else {
      mainGeo = new THREE.BoxGeometry(w, h, d);
    }

    const mainMat = new THREE.MeshStandardMaterial({
      color: color,
      emissive: emissive,
      emissiveIntensity: 0.4,
      roughness: roughness,
      metalness: metalness
    });

    const mesh = new THREE.Mesh(mainGeo, mainMat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);

    // Glowing Cyan/Blue Neon Rim
    if (shape === 'cylinder' || shape === 'hex') {
      const rimGeo = new THREE.TorusGeometry(w / 2, 0.14, 8, 24);
      const rimMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = h / 2;
      group.add(rim);
    } else {
      const edgeGeo = new THREE.BoxGeometry(w + 0.1, 0.18, d + 0.1);
      const edgeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const edgeMesh = new THREE.Mesh(edgeGeo, edgeMat);
      edgeMesh.position.y = h / 2;
      group.add(edgeMesh);
    }

    scene.add(group);

    const collider = addBoxCollider(
      game,
      x - w / 2, topY - h, z - d / 2,
      x + w / 2, topY, z + d / 2
    );

    return { group, mesh, collider, topY };
  }

  function addMovingPlatform(game, scene, config) {
    const THREE = window.THREE;
    const {
      x = 0, topY = 0, z = 0,
      w = 9, h = 2.2, d = 9,
      axis = 'x',
      dist = 12,
      speed = 1.5,
      color = 0x38bdf8,
      emissive = 0x0284c7
    } = config;

    const plat = addGroundedPlatform(game, scene, { x, topY, z, w, h, d, color, emissive, metalness: 0.8 });

    const movingItem = {
      group: plat.group,
      collider: plat.collider,
      basePos: new THREE.Vector3(x, topY - h / 2, z),
      topY,
      axis,
      dist,
      speed,
      w, h, d
    };

    movingPlatforms.push(movingItem);
    return movingItem;
  }

  function addLaserHazard(game, scene, config) {
    const THREE = window.THREE;
    const {
      x = 0, topY = 0, z = 0,
      length = 20,
      rotSpeed = 1.2,
      color = 0x38bdf8
    } = config;

    const hazardGroup = new THREE.Group();
    hazardGroup.position.set(x, topY + 0.8, z);

    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 1.0, 2.0, 12),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 })
    );
    hazardGroup.add(hub);

    const beamGeo = new THREE.CylinderGeometry(0.18, 0.18, length, 8);
    const beamMat = new THREE.MeshBasicMaterial({ color: color });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.rotation.z = Math.PI / 2;
    hazardGroup.add(beam);

    scene.add(hazardGroup);

    const hazard = {
      group: hazardGroup,
      pos: new THREE.Vector3(x, topY + 0.8, z),
      length,
      rotSpeed,
      angle: 0
    };

    laserHazards.push(hazard);
    return hazard;
  }

  function addJumpPad(game, scene, x, topY, z, force = 28, color = 0x38bdf8) {
    const THREE = window.THREE;
    const padGroup = new THREE.Group();
    padGroup.position.set(x, topY, z);

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(2.4, 2.8, 0.4, 18),
      new THREE.MeshStandardMaterial({ color: 0x082f49, roughness: 0.4, metalness: 0.8 })
    );
    base.position.y = 0.2;
    padGroup.add(base);

    const spring = new THREE.Mesh(
      new THREE.CylinderGeometry(1.8, 2.0, 0.35, 18),
      new THREE.MeshBasicMaterial({ color: color })
    );
    spring.position.y = 0.48;
    padGroup.add(spring);

    const arrowGeo = new THREE.ConeGeometry(0.9, 1.4, 8);
    const arrowMat = new THREE.MeshBasicMaterial({ color: 0xbae6fd });
    const arrow = new THREE.Mesh(arrowGeo, arrowMat);
    arrow.position.y = 1.4;
    padGroup.add(arrow);

    scene.add(padGroup);

    if (!game.currentLevel.jumpPads) game.currentLevel.jumpPads = [];
    const padData = {
      pos: new THREE.Vector3(x, topY + 0.5, z),
      force: force,
      boostForce: force,
      radius: 3.0
    };
    game.currentLevel.jumpPads.push(padData);

    animatedObjects.push({
      mesh: arrow,
      update: () => {
        arrow.position.y = 1.4 + Math.sin(Date.now() * 0.007) * 0.25;
        arrow.rotation.y += 0.04;
      }
    });

    return padData;
  }

  function addCheckpoint(game, scene, x, topY, z, name = "Phelix Kontrol Noktası", isActive = false) {
    const THREE = window.THREE;
    const cpGroup = new THREE.Group();
    cpGroup.position.set(x, topY, z);

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(2.6, 3.0, 0.4, 18),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5, metalness: 0.8 })
    );
    base.position.y = 0.2;
    cpGroup.add(base);

    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.14, 4.5, 12),
      new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9 })
    );
    pole.position.y = 2.45;
    cpGroup.add(pole);

    const bannerMat = new THREE.MeshStandardMaterial({
      color: isActive ? 0x0284c7 : 0xef4444,
      emissive: isActive ? 0x0369a1 : 0xb91c1c,
      emissiveIntensity: 0.9
    });
    const banner = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 0.08), bannerMat);
    banner.position.set(0.85, 4.0, 0);
    cpGroup.add(banner);

    const crystalMat = new THREE.MeshStandardMaterial({
      color: isActive ? 0x38bdf8 : 0xf87171,
      emissive: isActive ? 0x0284c7 : 0xdc2626,
      emissiveIntensity: isActive ? 0.95 : 0.4
    });
    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.7, 0), crystalMat);
    crystal.position.y = 4.8;
    cpGroup.add(crystal);

    const beamMat = new THREE.MeshBasicMaterial({
      color: isActive ? 0x38bdf8 : 0xf87171,
      transparent: true,
      opacity: isActive ? 0.35 : 0.15
    });
    const skyBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 35, 12), beamMat);
    skyBeam.position.y = 20.0;
    cpGroup.add(skyBeam);

    scene.add(cpGroup);

    const cpData = {
      pos: new THREE.Vector3(x, topY + 0.8, z),
      radius: 4.5,
      name: name,
      active: isActive,
      crystalMesh: crystal,
      bannerMesh: banner,
      beamMesh: skyBeam
    };

    if (!game.currentLevel.checkpoints) game.currentLevel.checkpoints = [];
    game.currentLevel.checkpoints.push(cpData);

    animatedObjects.push({
      mesh: crystal,
      update: () => {
        crystal.rotation.y += 0.03;
        crystal.rotation.x += 0.015;
      }
    });

    return cpData;
  }

  function addExitPortal(game, scene, x, topY, z, targetRegion, title = "Sonraki Phelix Bölümü") {
    const THREE = window.THREE;
    const portalGroup = new THREE.Group();
    portalGroup.position.set(x, topY + 2.8, z);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.8, 0.6, 16, 36),
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.9,
        metalness: 0.8
      })
    );
    portalGroup.add(ring);

    const vortex = new THREE.Mesh(
      new THREE.CircleGeometry(3.5, 32),
      new THREE.MeshBasicMaterial({
        color: 0x0369a1,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      })
    );
    portalGroup.add(vortex);
    scene.add(portalGroup);

    animatedObjects.push({
      mesh: ring,
      update: () => {
        ring.rotation.z += 0.03;
        vortex.rotation.z -= 0.05;
      }
    });

    game.currentLevel.nextPortal = {
      pos: new THREE.Vector3(x, topY + 2.8, z),
      targetRegion: targetRegion,
      regionName: title,
      title: title,
      radius: 4.8
    };
  }

  function addCoin(game, scene, x, topY, z) {
    const THREE = window.THREE;
    const coin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.55, 0.14, 12),
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.6,
        metalness: 0.9,
        roughness: 0.2
      })
    );
    coin.rotation.x = Math.PI / 2;
    coin.position.set(x, topY + 1.2, z);
    scene.add(coin);

    if (!game.currentLevel.collectibles) game.currentLevel.collectibles = [];
    const item = {
      mesh: coin,
      pos: new THREE.Vector3(x, topY + 1.2, z),
      collected: false,
      value: 1,
      type: 'coin'
    };
    game.currentLevel.collectibles.push(item);

    animatedObjects.push({
      mesh: coin,
      update: () => {
        if (!item.collected) {
          coin.rotation.z += 0.04;
          coin.position.y = topY + 1.2 + Math.sin(Date.now() * 0.005 + x) * 0.18;
        }
      }
    });
  }

  function addPhelixStarGem(game, scene, x, topY, z) {
    const THREE = window.THREE;
    const gem = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.85, 0),
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.8,
        metalness: 0.9,
        roughness: 0.1
      })
    );
    gem.position.set(x, topY + 1.5, z);
    scene.add(gem);

    if (!game.currentLevel.collectibles) game.currentLevel.collectibles = [];
    const item = {
      mesh: gem,
      pos: new THREE.Vector3(x, topY + 1.5, z),
      collected: false,
      value: 5,
      type: 'honey_gem'
    };
    game.currentLevel.collectibles.push(item);

    animatedObjects.push({
      mesh: gem,
      update: () => {
        if (!item.collected) {
          gem.rotation.y += 0.05;
          gem.rotation.x += 0.03;
          gem.position.y = topY + 1.5 + Math.sin(Date.now() * 0.006 + x) * 0.22;
        }
      }
    });
  }

  
  // --- 3D HIGH-DETAIL MODELS ---

  // FOX (TILKI) MODEL
  function createDetailedFoxModel(THREE, scale = 1.0) {
    const fox = new THREE.Group();
    fox.name = "detailed_fox_model";

    const orangeMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.5, metalness: 0.1 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const visorMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    // Fox Head
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.2 * scale, 0);

    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.7 * scale, 16, 16), orangeMat);
    headGroup.add(skull);

    // Fox Pointy Snout
    const snout = new THREE.Mesh(new THREE.ConeGeometry(0.35 * scale, 0.9 * scale, 12), whiteMat);
    snout.rotation.x = Math.PI / 2;
    snout.position.set(0, -0.15 * scale, 0.7 * scale);
    headGroup.add(snout);

    // Black Nose Tip
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.12 * scale, 8, 8), darkMat);
    nose.position.set(0, -0.15 * scale, 1.15 * scale);
    headGroup.add(nose);

    // Fox Eyes
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.12 * scale, 8, 8), eyeMat);
    eyeL.position.set(-0.28 * scale, 0.15 * scale, 0.55 * scale);
    headGroup.add(eyeL);
    const eyeR = eyeL.clone();
    eyeR.position.x = 0.28 * scale;
    headGroup.add(eyeR);

    // Tactical Cyber-Visor / Eye-Piece
    const visor = new THREE.Mesh(new THREE.TorusGeometry(0.22 * scale, 0.05 * scale, 8, 16, Math.PI), visorMat);
    visor.rotation.x = Math.PI / 2;
    visor.position.set(-0.28 * scale, 0.15 * scale, 0.58 * scale);
    headGroup.add(visor);

    // Fox Big Pointy Ears
    const earGeo = new THREE.ConeGeometry(0.32 * scale, 0.8 * scale, 6);
    const earL = new THREE.Mesh(earGeo, orangeMat);
    earL.position.set(-0.45 * scale, 0.75 * scale, 0);
    earL.rotation.z = 0.35;
    headGroup.add(earL);

    const earTipL = new THREE.Mesh(new THREE.ConeGeometry(0.18 * scale, 0.35 * scale, 6), darkMat);
    earTipL.position.set(0, 0.25 * scale, 0);
    earL.add(earTipL);

    const earR = new THREE.Mesh(earGeo, orangeMat);
    earR.position.set(0.45 * scale, 0.75 * scale, 0);
    earR.rotation.z = -0.35;
    headGroup.add(earR);

    const earTipR = new THREE.Mesh(new THREE.ConeGeometry(0.18 * scale, 0.35 * scale, 6), darkMat);
    earTipR.position.set(0, 0.25 * scale, 0);
    earR.add(earTipR);

    fox.add(headGroup);

    // Fox Body & Pilot Vest
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.5 * scale, 0.65 * scale, 1.1 * scale, 12), darkMat);
    body.position.set(0, 0.5 * scale, 0);
    fox.add(body);

    const chestFur = new THREE.Mesh(new THREE.SphereGeometry(0.45 * scale, 12, 12), whiteMat);
    chestFur.position.set(0, 0.6 * scale, 0.25 * scale);
    fox.add(chestFur);

    // Arms / Paws
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.16 * scale, 0.18 * scale, 0.8 * scale, 8), orangeMat);
    armL.position.set(-0.6 * scale, 0.5 * scale, 0.3 * scale);
    armL.rotation.x = Math.PI / 3;
    armL.rotation.z = -0.3;
    fox.add(armL);

    const armR = armL.clone();
    armR.position.x = 0.6 * scale;
    armR.rotation.z = 0.3;
    fox.add(armR);

    // Fox Bushy Tail
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.35 * scale, 1.2 * scale, 8), orangeMat);
    tail.position.set(0, 0.4 * scale, -0.6 * scale);
    tail.rotation.x = -Math.PI / 3;
    const tailTip = new THREE.Mesh(new THREE.ConeGeometry(0.22 * scale, 0.45 * scale, 8), whiteMat);
    tailTip.position.set(0, 0.45 * scale, 0);
    tail.add(tailTip);
    fox.add(tail);

    fox.headGroup = headGroup;
    return fox;
  }

  // GRIZZY BEAR MODEL
  function createDetailedGrizzyModel(THREE, scale = 1.0) {
    const bear = new THREE.Group();
    bear.name = "detailed_grizzy_model";

    const furMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8, metalness: 0.05 });
    const muzzleMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.9 });
    const innerEarMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.6 });

    // Head
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.2 * scale, 0);

    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.85 * scale, 16, 16), furMat);
    headGroup.add(skull);

    // Snout / Muzzle
    const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.48 * scale, 12, 12), muzzleMat);
    muzzle.position.set(0, -0.15 * scale, 0.65 * scale);
    muzzle.scale.set(1.1, 0.8, 1.0);
    headGroup.add(muzzle);

    // Big Cute Black Nose
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.18 * scale, 8, 8), darkMat);
    nose.position.set(0, -0.05 * scale, 1.05 * scale);
    headGroup.add(nose);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.12 * scale, 8, 8);
    const eyeL = new THREE.Mesh(eyeGeo, darkMat);
    eyeL.position.set(-0.32 * scale, 0.22 * scale, 0.72 * scale);
    headGroup.add(eyeL);
    const eyeR = eyeL.clone();
    eyeR.position.x = 0.32 * scale;
    headGroup.add(eyeR);

    // Round Ears
    const earGeo = new THREE.SphereGeometry(0.35 * scale, 12, 12);
    const earL = new THREE.Mesh(earGeo, furMat);
    earL.position.set(-0.65 * scale, 0.7 * scale, 0);
    const inEarL = new THREE.Mesh(new THREE.SphereGeometry(0.2 * scale, 8, 8), innerEarMat);
    inEarL.position.set(0, 0, 0.15 * scale);
    earL.add(inEarL);
    headGroup.add(earL);

    const earR = new THREE.Mesh(earGeo, furMat);
    earR.position.set(0.65 * scale, 0.7 * scale, 0);
    const inEarR = new THREE.Mesh(new THREE.SphereGeometry(0.2 * scale, 8, 8), innerEarMat);
    inEarR.position.set(0, 0, 0.15 * scale);
    earR.add(inEarR);
    headGroup.add(earR);

    // Pilot Headset
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.88 * scale, 0.08 * scale, 8, 20, Math.PI), darkMat);
    band.rotation.x = -Math.PI / 2;
    band.position.set(0, 0.45 * scale, 0);
    headGroup.add(band);

    const headphoneMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.7 });
    const hpL = new THREE.Mesh(new THREE.CylinderGeometry(0.32 * scale, 0.32 * scale, 0.25 * scale, 12), headphoneMat);
    hpL.rotation.z = Math.PI / 2;
    hpL.position.set(-0.85 * scale, 0.45 * scale, 0);
    headGroup.add(hpL);
    const hpR = hpL.clone();
    hpR.position.x = 0.85 * scale;
    headGroup.add(hpR);

    bear.add(headGroup);

    // Bear Body
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.95 * scale, 16, 16), furMat);
    body.position.set(0, 0.3 * scale, 0);
    body.scale.set(1.0, 1.2, 0.9);
    bear.add(body);

    const tummy = new THREE.Mesh(new THREE.SphereGeometry(0.7 * scale, 12, 12), muzzleMat);
    tummy.position.set(0, 0.3 * scale, 0.45 * scale);
    tummy.scale.set(0.9, 1.0, 0.5);
    bear.add(tummy);

    // Paws / Arms steering
    const armGeo = new THREE.CylinderGeometry(0.25 * scale, 0.28 * scale, 0.9 * scale, 10);
    const armL = new THREE.Mesh(armGeo, furMat);
    armL.position.set(-0.75 * scale, 0.4 * scale, 0.45 * scale);
    armL.rotation.x = Math.PI / 3;
    armL.rotation.z = -0.4;
    bear.add(armL);

    const armR = armL.clone();
    armR.position.x = 0.75 * scale;
    armR.rotation.z = 0.4;
    bear.add(armR);

    bear.headGroup = headGroup;
    bear.armL = armL;
    bear.armR = armR;
    return bear;
  }

  // GRIZZY SPACESHP WITH DETAILED COCKPIT INTERIOR
  function createDetailedGrizzySpaceship(THREE) {
    const ship = new THREE.Group();
    ship.name = "grizzy_detailed_spaceship";

    const hullBlueMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8, roughness: 0.25 });
    const hullCyanMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.6, roughness: 0.3 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.2 });
    const glowBlueMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const glowRedMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });

    // Streamlined Fuselage & Cockpit Tub
    const hullGroup = new THREE.Group();

    // Main curved hull
    const mainHull = new THREE.Mesh(new THREE.ConeGeometry(3.6, 9.5, 20), hullBlueMat);
    mainHull.rotation.x = Math.PI / 2;
    hullGroup.add(mainHull);

    // Twin Wings with neon wingtip fins
    const wingGeo = new THREE.BoxGeometry(5.5, 0.25, 3.2);
    const wingL = new THREE.Mesh(wingGeo, hullBlueMat);
    wingL.position.set(-3.8, -0.2, -1.2);
    wingL.rotation.y = 0.25;
    wingL.rotation.z = 0.08;
    hullGroup.add(wingL);

    const finL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.8, 2.0), hullCyanMat);
    finL.position.set(-6.2, 0.6, -1.2);
    hullGroup.add(finL);

    const wingR = wingL.clone();
    wingR.position.x = 3.8;
    wingR.rotation.y = -0.25;
    wingR.rotation.z = -0.08;
    hullGroup.add(wingR);

    const finR = finL.clone();
    finR.position.x = 6.2;
    hullGroup.add(finR);

    // Rear Dual Jet Thrusters
    const thrusterL = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 2.4, 16), metalMat);
    thrusterL.rotation.x = Math.PI / 2;
    thrusterL.position.set(-1.4, 0, -4.8);
    hullGroup.add(thrusterL);

    const flameL = new THREE.Mesh(new THREE.ConeGeometry(0.65, 3.5, 12), glowBlueMat);
    flameL.rotation.x = -Math.PI / 2;
    flameL.position.set(-1.4, 0, -6.8);
    hullGroup.add(flameL);

    const thrusterR = thrusterL.clone();
    thrusterR.position.x = 1.4;
    hullGroup.add(thrusterR);

    const flameR = flameL.clone();
    flameR.position.x = 1.4;
    hullGroup.add(flameR);

    ship.add(hullGroup);

    // COCKPIT INTERIOR
    const cockpitGroup = new THREE.Group();
    cockpitGroup.position.set(0, 0.8, 0.9);

    // Cockpit Floor
    const floor = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.3, 16), metalMat);
    floor.position.set(0, -0.4, 0);
    cockpitGroup.add(floor);

    // Pilot Bucket Seat
    const seatMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
    const seatBase = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.4, 1.6), seatMat);
    seatBase.position.set(0, -0.2, 0);
    cockpitGroup.add(seatBase);

    const seatBack = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.2, 0.35), seatMat);
    seatBack.position.set(0, 0.8, -0.7);
    cockpitGroup.add(seatBack);

    // Grizzy Bear Sitting in Pilot Seat!
    const grizzy = createDetailedGrizzyModel(THREE, 0.9);
    grizzy.position.set(0, 0.2, -0.1);
    cockpitGroup.add(grizzy);

    // Glowing Holographic Dashboard Console
    const dashBase = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.7, 0.8), metalMat);
    dashBase.position.set(0, 0.35, 1.05);
    dashBase.rotation.x = -0.25;
    cockpitGroup.add(dashBase);

    // Radar Screen / Hologram Display
    const hudMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const hudScreen = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.55), hudMat);
    hudScreen.position.set(0, 0.65, 0.9);
    hudScreen.rotation.x = -0.3;
    cockpitGroup.add(hudScreen);

    // Blinking Warning Alarm LED Lights
    const alarmLedL = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), glowRedMat);
    alarmLedL.position.set(-0.7, 0.65, 0.95);
    cockpitGroup.add(alarmLedL);

    const alarmLedR = alarmLedL.clone();
    alarmLedR.position.x = 0.7;
    cockpitGroup.add(alarmLedR);

    // Dual Flight Control Sticks
    const stickMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8 });
    const stickL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.6, 8), stickMat);
    stickL.position.set(-0.45, 0.4, 0.65);
    stickL.rotation.x = 0.2;
    cockpitGroup.add(stickL);

    const stickR = stickL.clone();
    stickR.position.x = 0.45;
    cockpitGroup.add(stickR);

    // Eject Lever
    const ejectHandle = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.06, 8, 12), new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
    ejectHandle.position.set(0, -0.1, 0.6);
    cockpitGroup.add(ejectHandle);

    ship.add(cockpitGroup);

    // TRANSPARENT GLASS CANOPY
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xbae6fd,
      transparent: true,
      opacity: 0.28,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.9,
      ior: 1.5,
      side: THREE.DoubleSide
    });
    const canopy = new THREE.Mesh(new THREE.SphereGeometry(1.85, 24, 24), glassMat);
    canopy.position.set(0, 0.75, 0.7);
    canopy.scale.set(0.95, 0.95, 1.5);
    ship.add(canopy);

    ship.grizzy = grizzy;
    ship.canopy = canopy;
    ship.cockpitGroup = cockpitGroup;
    ship.alarmLedL = alarmLedL;
    ship.alarmLedR = alarmLedR;
    ship.flameL = flameL;
    ship.flameR = flameR;

    return ship;
  }

  // FOX WARSHIP
  function createDetailedFoxWarship(THREE) {
    const warship = new THREE.Group();
    warship.name = "fox_detailed_warship";

    const hullRedMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.85, roughness: 0.2 });
    const hullDarkMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.25 });
    const laserGlowMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });

    // Fuselage
    const hull = new THREE.Mesh(new THREE.ConeGeometry(3.5, 11.0, 16), hullRedMat);
    hull.rotation.x = Math.PI / 2;
    warship.add(hull);

    // Swept Forward Battle Wings
    const wingGeo = new THREE.BoxGeometry(6.2, 0.3, 3.8);
    const wingL = new THREE.Mesh(wingGeo, hullDarkMat);
    wingL.position.set(-4.2, 0.1, -1.0);
    wingL.rotation.y = -0.3;
    wingL.rotation.z = -0.1;
    warship.add(wingL);

    const wingR = wingL.clone();
    wingR.position.x = 4.2;
    wingR.rotation.y = 0.3;
    wingR.rotation.z = 0.1;
    warship.add(wingR);

    // Heavy Plasma Railguns
    const gunGeo = new THREE.CylinderGeometry(0.35, 0.45, 4.5, 12);
    const gunL = new THREE.Mesh(gunGeo, hullDarkMat);
    gunL.rotation.x = Math.PI / 2;
    gunL.position.set(-6.8, 0.3, 0.5);
    const gunMuzzleL = new THREE.Mesh(new THREE.SphereGeometry(0.38, 8, 8), laserGlowMat);
    gunMuzzleL.position.set(0, 2.3, 0);
    gunL.add(gunMuzzleL);
    warship.add(gunL);

    const gunR = gunL.clone();
    gunR.position.x = 6.8;
    warship.add(gunR);

    // Battle Cockpit
    const cockpitBase = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.8, 2.2), hullDarkMat);
    cockpitBase.position.set(0, 0.9, 0.8);
    warship.add(cockpitBase);

    // 3D Fox Model in Warship!
    const fox = createDetailedFoxModel(THREE, 0.95);
    fox.position.set(0, 1.2, 0.8);
    warship.add(fox);

    // Rear Dual Afterburners
    const afterburnerMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
    const flameL = new THREE.Mesh(new THREE.ConeGeometry(1.1, 5.0, 12), afterburnerMat);
    flameL.rotation.x = -Math.PI / 2;
    flameL.position.set(-1.5, 0, -6.5);
    warship.add(flameL);

    const flameR = flameL.clone();
    flameR.position.x = 1.5;
    warship.add(flameR);

    warship.fox = fox;
    warship.gunL = gunL;
    warship.gunR = gunR;
    warship.flameL = flameL;
    warship.flameR = flameR;

    return warship;
  }

  // DETAILED PARACHUTE RIG
  function createDetailedParachuteRig(THREE) {
    const chuteRig = new THREE.Group();
    chuteRig.name = "grizzy_parachute_rig";

    // Animated Parachute Canopy
    const canopyGroup = new THREE.Group();
    canopyGroup.position.set(0, 6.5, 0);

    // Striped Vibrant Canopy (Cyan, Gold)
    const canopyMatCyan = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4, side: THREE.DoubleSide });
    const canopyMatGold = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4, side: THREE.DoubleSide });

    const canopyMain = new THREE.Mesh(
      new THREE.SphereGeometry(4.8, 24, 16, 0, Math.PI * 2, 0, Math.PI / 1.8),
      canopyMatCyan
    );
    canopyGroup.add(canopyMain);

    // Gold stripes & top vent ring
    const ventRing = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.25, 8, 20), canopyMatGold);
    ventRing.rotation.x = Math.PI / 2;
    ventRing.position.y = 4.8;
    canopyGroup.add(ventRing);

    const rimRing = new THREE.Mesh(new THREE.TorusGeometry(4.8, 0.15, 8, 32), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    rimRing.rotation.x = Math.PI / 2;
    rimRing.position.y = 0;
    canopyGroup.add(rimRing);

    chuteRig.add(canopyGroup);

    // 8 White Suspension Rigging Cords
    const cordMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let c = 0; c < 8; c++) {
      const angle = (c / 8) * Math.PI * 2;
      const rx = Math.sin(angle) * 4.6;
      const rz = Math.cos(angle) * 4.6;

      const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 6.6, 6), cordMat);
      cord.position.set(rx * 0.5, 3.3, rz * 0.5);
      cord.lookAt(new THREE.Vector3(rx, 6.5, rz));
      chuteRig.add(cord);
    }

    // Grizzy Bear in 4-Point Parachute Harness
    const grizzy = createDetailedGrizzyModel(THREE, 1.0);
    grizzy.position.set(0, 0.2, 0);

    // 4-Point Harness Straps
    const harnessMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
    const strapL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.2, 0.08), harnessMat);
    strapL.position.set(-0.35, 0.4, 0.5);
    strapL.rotation.z = -0.15;
    grizzy.add(strapL);

    const strapR = strapL.clone();
    strapR.position.x = 0.35;
    strapR.rotation.z = 0.15;
    grizzy.add(strapR);

    chuteRig.add(grizzy);

    chuteRig.canopyGroup = canopyGroup;
    chuteRig.grizzy = grizzy;

    return chuteRig;
  }

  // FOX BOSS MECH MODEL IN LEVEL 9
  function createFoxBossMechModel(THREE) {
    const root = new THREE.Group();
    root.name = "fox_boss_mech";

    // Heavy Mech Chassis
    const mechBodyMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.85, roughness: 0.2 });
    const armorOrangeMat = new THREE.MeshStandardMaterial({ color: 0xf97316, metalness: 0.7, roughness: 0.3 });
    const glowBlueMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    const mechBody = new THREE.Mesh(new THREE.BoxGeometry(5.2, 4.2, 4.2), mechBodyMat);
    mechBody.position.y = 3.8;
    root.add(mechBody);

    const chestArmor = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.5, 0.6), armorOrangeMat);
    chestArmor.position.set(0, 3.8, 2.15);
    root.add(chestArmor);

    // Glowing Power Core Reactor
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.9, 16, 16), glowBlueMat);
    core.position.set(0, 3.8, 2.3);
    root.add(core);

    // Open Boss Cockpit on Top with FULL 3D FOX!
    const cockpitRing = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.2, 1.0, 16), armorOrangeMat);
    cockpitRing.position.set(0, 6.0, 0.4);
    root.add(cockpitRing);

    const foxBossModel = createDetailedFoxModel(THREE, 1.4);
    foxBossModel.position.set(0, 6.4, 0.4);
    root.add(foxBossModel);

    // Heavy Dual Laser / Plasma Cannons
    const gunMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9 });
    const canonL = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.7, 5.5, 16), gunMat);
    canonL.rotation.x = Math.PI / 2;
    canonL.position.set(-3.8, 4.5, 1.5);
    const canonTipL = new THREE.Mesh(new THREE.SphereGeometry(0.6, 12, 12), glowBlueMat);
    canonTipL.position.set(0, 2.8, 0);
    canonL.add(canonTipL);
    root.add(canonL);

    const canonR = canonL.clone();
    canonR.position.x = 3.8;
    root.add(canonR);

    // Heavy Mech Legs
    const legL = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.4, 1.8), mechBodyMat);
    legL.position.set(-2.2, 1.7, 0);
    root.add(legL);

    const legR = legL.clone();
    legR.position.x = 2.2;
    root.add(legR);

    return { root, canonL, canonR, foxBossModel };
  }

  // 1. BOLUM SINEMATIGI: TILKI GEMISI LAZER SALDIRISI & PARASUTLU INIS
  function playPhelixFoxCinematic(game, onComplete) {
    if (!game || !game.scene || !window.THREE) {
      if (onComplete) onComplete();
      return;
    }

    const THREE = window.THREE;
    isPhelixCutscenePlaying = true;
    phelixCutsceneObjects = [];

    // Hide gameplay player bear during cinematic
    if (game.playerBear && game.playerBear.root) {
      game.playerBear.root.visible = false;
    }

    phelixCutsceneContainer.style.display = 'block';

    const subBox = document.getElementById('phelix-subtitle-box');
    const avatarBox = document.getElementById('phelix-avatar-box');
    const speakerBadge = document.getElementById('phelix-speaker-badge');
    const progressBar = document.getElementById('phelix-cutscene-progress');

    // 3D Scene root for cinematic
    const cutsceneGroup = new THREE.Group();
    cutsceneGroup.name = "phelix_cinematic_group";
    cutsceneGroup.position.set(0, 90, -40);
    game.scene.add(cutsceneGroup);
    phelixCutsceneObjects.push(cutsceneGroup);

    // 1. Grizzy's Detailed Spaceship with Cockpit & Grizzy inside
    const ourShip = createDetailedGrizzySpaceship(THREE);
    ourShip.position.set(0, 0, 0);
    cutsceneGroup.add(ourShip);

    // 2. Fox's Detailed Aggressive Warship with Fox inside
    const foxShip = createDetailedFoxWarship(THREE);
    foxShip.position.set(0, 4.5, -24);
    foxShip.visible = false;
    cutsceneGroup.add(foxShip);

    // 3. Laser Beams from Fox's cannons
    const laserBeams = [];
    for (let lb = 0; lb < 6; lb++) {
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 8.0, 8), new THREE.MeshBasicMaterial({ color: 0xf43f5e }));
      beam.rotation.x = Math.PI / 2;
      beam.visible = false;
      cutsceneGroup.add(beam);
      laserBeams.push(beam);
    }

    // 4. Parachute Rig with Grizzy
    const parachuteRig = createDetailedParachuteRig(THREE);
    parachuteRig.visible = false;
    game.scene.add(parachuteRig);
    phelixCutsceneObjects.push(parachuteRig);

    // Explosion Particle Spark Burst
    const sparksGroup = new THREE.Group();
    sparksGroup.visible = false;
    for (let sp = 0; sp < 25; sp++) {
      const spark = new THREE.Mesh(new THREE.SphereGeometry(0.3, 6, 6), new THREE.MeshBasicMaterial({ color: 0xf97316 }));
      spark.position.set((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4);
      sparksGroup.add(spark);
    }
    cutsceneGroup.add(sparksGroup);

    // Camera target vectors
    const camTarget = {
      pos: new THREE.Vector3(0, 92, -28),
      look: new THREE.Vector3(0, 90, -40)
    };

    // Control camera during cutscene
    const origUpdate = game.update;
    game.update = function(dt, time) {
      if (game.camera) {
        game.camera.position.lerp(camTarget.pos, 0.08);
        game.camera.lookAt(camTarget.look);
      }
    };

    // Cutscene Steps
    const steps = [
      // 1. Gemi Surusu & Huzur
      {
        duration: 5.5,
        avatar: '🐻',
        speaker: '🐻 GRIZZY (PİLOT KOKPİTİNDE)',
        speakerColor: '#38bdf8',
        badgeBg: 'rgba(2, 132, 199, 0.3)',
        borderColor: '#38bdf8',
        text: `<span style='color:#bae6fd; font-size:18px;'>&ldquo;Lalalala~ Gemiyi sürmek ne kadar da huzurlu! Phelix Gezegeni vahalarına yaklaşıyoruz... Mavi kristal göller, sakin esintiler... Oh be, sonunda kafamı dinleyeceğim harika bir gün!&rdquo;</span>`,
        onStart: () => {
          ourShip.visible = true;
          foxShip.visible = false;
          camTarget.pos.set(0, 92.5, -31);
          camTarget.look.set(0, 91.0, -39.5);
          playAudioTone(440, 0.25, 'sine');
        },
        onTick: (t) => {
          ourShip.rotation.z = Math.sin(t * 2.5) * 0.06;
          ourShip.position.y = Math.sin(t * 2) * 0.3;
          if (ourShip.grizzy && ourShip.grizzy.headGroup) {
            ourShip.grizzy.headGroup.rotation.y = Math.sin(t * 3) * 0.35;
          }
        }
      },
      // 2. Tilki Arkadan Savas Gemisiyle Gelir!
      {
        duration: 7.0,
        avatar: '🦊',
        speaker: '🦊 TİLKİ (AVCI SAVAŞ GEMİSİNDEN)',
        speakerColor: '#f97316',
        badgeBg: 'rgba(234, 88, 12, 0.3)',
        borderColor: '#f97316',
        text: `<span style='color:#fed7aa; font-size:18px;'>&ldquo;BZZZT! Telsiz Frekansı Kilitlendi! Hahaha! Beni atlattığını mı sandın koca ayı?! Seni ta uzayın derinliklerinden beri takip ediyorum! Phelix in tüm kadim sırları benim olacak! Sen ise bu hurda gemiyle toza dönüşeceksin!&rdquo;</span>`,
        onStart: () => {
          foxShip.visible = true;
          camTarget.pos.set(7, 96, -18);
          camTarget.look.set(0, 92, -36);
          playAudioTone(280, 0.4, 'sawtooth');
        },
        onTick: (t) => {
          foxShip.position.z = -24 + Math.sin(t * 2) * 2;
          foxShip.rotation.z = Math.sin(t * 3.5) * 0.12;
          if (foxShip.fox && foxShip.fox.headGroup) {
            foxShip.fox.headGroup.rotation.y = Math.sin(t * 5) * 0.25;
          }
        }
      },
      // 3. Tilki Lazer Atsin & Motorlar Patlasin!
      {
        duration: 5.0,
        avatar: '💥',
        speaker: '⚡ TİLKİ SAVAŞ GEMİSİ: LAZER SALDIRISI!',
        speakerColor: '#ef4444',
        badgeBg: 'rgba(239, 68, 68, 0.3)',
        borderColor: '#ef4444',
        text: `<span style='color:#fca5a5; font-size:18px;'>&ldquo;Al bakalım plazma lazerlerimi! PEW PEW PEW! Kaçamazsın koca ayı!&rdquo;<br>⚠️ Motorlara doğrudan isabet! Alarm sistemleri devreye girdi!</span>`,
        onStart: () => {
          camTarget.pos.set(8, 93, -32);
          camTarget.look.set(0, 91, -39);
          triggerPhelixFlash('#ef4444');
          playAudioTone(160, 0.35, 'sawtooth');
          sparksGroup.visible = true;
        },
        onTick: (t) => {
          phelixCameraShake = 1.4;
          laserBeams.forEach((b, idx) => {
            b.visible = true;
            b.position.set((idx - 2.5) * 1.4, (idx % 2) * 0.8, -18 + ((t * 24 + idx * 5) % 20));
          });
          ourShip.rotation.z = Math.sin(t * 14) * 0.3;
          if (ourShip.alarmLedL && ourShip.alarmLedR) {
            const blink = Math.sin(t * 20) > 0;
            ourShip.alarmLedL.visible = blink;
            ourShip.alarmLedR.visible = blink;
          }
        }
      },
      // 4. Kokpitteki Grizzy: "Haha ben bu sefer kanmam Tilki!"
      {
        duration: 6.5,
        avatar: '🐻',
        speaker: '🐻 GRIZZY: "BEN BU SEFER KANMAM TİLKİ!"',
        speakerColor: '#38bdf8',
        badgeBg: 'rgba(2, 132, 199, 0.3)',
        borderColor: '#38bdf8',
        text: `<span style='color:#f8fafc; font-size:20px; font-weight:900;'>&ldquo;Haha! Ben bu sefer kanmam Tilki! Bu sefer beni alt edemedin! Poneix teki numaranı unutmadım, her zaman bir B planım vardır! Fırlatma kolu hazır!&rdquo;</span>`,
        onStart: () => {
          laserBeams.forEach(b => b.visible = false);
          sparksGroup.visible = false;
          camTarget.pos.set(0, 91.8, -36.8);
          camTarget.look.set(0, 91.2, -39.0);
          playAudioTone(520, 0.25, 'sine');
        },
        onTick: (t) => {
          ourShip.rotation.z = Math.sin(t * 6) * 0.08;
          if (ourShip.grizzy && ourShip.grizzy.headGroup) {
            ourShip.grizzy.headGroup.rotation.y = 0;
            ourShip.grizzy.headGroup.rotation.x = Math.sin(t * 6) * 0.15;
          }
        }
      },
      // 5. Parasut Acilmasi & Suzulerek Yere Inis!
      {
        duration: 7.5,
        avatar: '🪂',
        speaker: '🪂 PARASÜT İNİŞİ & VAHALARA VARIŞ',
        speakerColor: '#38bdf8',
        badgeBg: 'rgba(56, 189, 248, 0.3)',
        borderColor: '#38bdf8',
        text: `<span style='color:#bae6fd; font-size:18px;'>*ÇAAAK!* Fırlatma koltuğu devreye girdi! Gemi gökyüzünde patlarken devasa paraşüt açıldı! Grizzy Phelix Vahaları nın başlangıç platformuna süzülerek güvenle iniyor!</span>`,
        onStart: () => {
          triggerPhelixFlash('#f97316');
          ourShip.visible = false;
          foxShip.visible = false;
          parachuteRig.visible = true;
          parachuteRig.position.set(0, 65, 0);

          camTarget.pos.set(0, 45, 24);
          camTarget.look.set(0, 30, 0);

          playAudioTone(660, 0.45, 'sine');
        },
        onTick: (t) => {
          const pct = Math.min(1.0, t / 6.0);
          parachuteRig.position.y = 65 - pct * 64.5;
          parachuteRig.rotation.z = Math.sin(t * 2.5) * 0.12;
          parachuteRig.rotation.y = t * 0.3;

          if (parachuteRig.canopyGroup) {
            const scale = Math.min(1.0, 0.2 + t * 1.5);
            parachuteRig.canopyGroup.scale.set(scale, scale, scale);
          }

          camTarget.look.set(0, parachuteRig.position.y + 2.5, 0);
          camTarget.pos.set(Math.sin(t * 0.6) * 16, parachuteRig.position.y + 12, Math.cos(t * 0.6) * 16 + 4);
        }
      },
      // 6. Yere Inis & Baslama
      {
        duration: 4.5,
        avatar: '🐻',
        speaker: '🐻 GRIZZY: "VAHALAR BENİ BEKLER!"',
        speakerColor: '#38bdf8',
        badgeBg: 'rgba(2, 132, 199, 0.3)',
        borderColor: '#38bdf8',
        text: `<span style='color:#f8fafc; font-size:19px; font-weight:900;'>&ldquo;Mükemmel iniş! İşte Phelix Vahaları! Şimdi bu uzun parkurları aşıp o kurnaz Tilki yi Gezegen Çekirdeği nde alt edeceğim! Hadi başlayalım!&rdquo;</span>`,
        onStart: () => {
          parachuteRig.visible = false;
          if (game.playerBear && game.playerBear.root) {
            game.playerBear.root.visible = true;
            game.playerBear.root.position.set(0, 0.5, 0);
          }
          if (game.playerPos) game.playerPos.set(0, 0.5, 0);
          camTarget.pos.set(0, 3.5, 7.5);
          camTarget.look.set(0, 1.5, 0);
          playAudioTone(580, 0.35, 'sine');
        },
        onTick: (t) => {}
      }
    ];

    let stepIdx = 0;
    let stepTime = 0;

    function applyStep(s) {
      if (avatarBox) avatarBox.innerText = s.avatar;
      if (speakerBadge) {
        speakerBadge.innerText = s.speaker;
        speakerBadge.style.color = s.speakerColor;
        speakerBadge.style.backgroundColor = s.badgeBg;
      }
      if (subBox) subBox.innerHTML = s.text;
      if (progressBar) progressBar.style.width = '0%';
      if (s.onStart) s.onStart();
    }

    applyStep(steps[0]);

    phelixAdvanceFn = () => {
      stepIdx++;
      if (stepIdx >= steps.length) {
        finishCinematic();
      } else {
        stepTime = 0;
        applyStep(steps[stepIdx]);
      }
    };

    function cinematicLoop() {
      if (!isPhelixCutscenePlaying) return;
      const cur = steps[stepIdx];
      if (!cur) {
        finishCinematic();
        return;
      }
      stepTime += 0.016;
      if (progressBar) {
        progressBar.style.width = `${Math.min(100, (stepTime / cur.duration) * 100)}%`;
      }
      if (cur.onTick) cur.onTick(stepTime);

      if (stepTime >= cur.duration) {
        phelixAdvanceFn();
      } else {
        requestAnimationFrame(cinematicLoop);
      }
    }
    requestAnimationFrame(cinematicLoop);

    window.__endPhelixCutscene = finishCinematic;

    function finishCinematic() {
      isPhelixCutscenePlaying = false;
      phelixAdvanceFn = null;
      game.update = origUpdate;

      if (phelixCutsceneContainer) phelixCutsceneContainer.style.display = 'none';

      phelixCutsceneObjects.forEach(obj => {
        if (obj && obj.parent) obj.parent.remove(obj);
      });
      phelixCutsceneObjects.length = 0;

      if (game.playerBear && game.playerBear.root) game.playerBear.root.visible = true;
      if (game.playerPos) game.playerPos.set(0, 0.5, 0);
      if (game.playerVel) game.playerVel.set(0, 0, 0);

      if (game.camera) {
        game.camera.position.set(0, 3.5, 7.5);
        game.camera.lookAt(0, 1.5, 0);
      }

      if (game.callbacks && game.callbacks.onShowNotice) {
        game.callbacks.onShowNotice("🎮 Kontroller sende! Phelix Vahaları ndaki uzun parkurları aşmaya başla!", "success");
      }

      if (onComplete) onComplete();
    }
  }


  // ===================================================================
  // 9 DEVASA, TAMAMEN FARKLI VE EŞSİZ PHELİX GEZEGENİ BÖLÜMLERİ
  // ===================================================================

  // BÖLÜM 1: Phelix Vahaları (The Oases of Phelix) - Yüzen Kristal Nilüferler & Su Parkurları 🌴💧
  function buildPhelixLevel1(game, scene) {
    const THREE = window.THREE;

    // Aşama 1: Vaha Başlangıç Adası (Z: 0)
    addGroundedPlatform(game, scene, { x: 0, topY: 0, z: 0, w: 26, h: 4, d: 26, shape: 'cylinder', color: 0x0284c7 });
    addCheckpoint(game, scene, 0, 0, -6, "1. Vaha Başlangıç Pınarı", true);
    addCoin(game, scene, 0, 0, 0);

    // Palmiyeler & Nilüferler
    const palmGeo = new THREE.CylinderGeometry(0.3, 0.5, 5, 8);
    const palmMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x10b981 });
    for (let p = 0; p < 4; p++) {
      const ang = (p / 4) * Math.PI * 2;
      const trunk = new THREE.Mesh(palmGeo, palmMat);
      trunk.position.set(Math.sin(ang) * 9, 2.5, Math.cos(ang) * 9);
      scene.add(trunk);
      const top = new THREE.Mesh(new THREE.ConeGeometry(2.5, 2.0, 8), leafMat);
      top.position.set(Math.sin(ang) * 9, 5.5, Math.cos(ang) * 9);
      scene.add(top);
    }

    // Aşama 2: Yüzen Lotus & Mavi Nilüfer Basamakları
    for (let i = 1; i <= 14; i++) {
      const pz = -16 - (i - 1) * 9.5;
      const px = Math.sin(i * 0.9) * 7.5;
      const py = 0.5 + i * 1.1;
      const pw = 9.5;
      addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: pw, h: 3.5, d: pw, shape: i % 2 === 0 ? 'hex' : 'cylinder', color: 0x0369a1 });
      addCoin(game, scene, px, py, pz);
      if (i % 3 === 0) addCoin(game, scene, px + 2, py, pz);
    }

    // Aşama 3: 1. Su & Plazma Şelalesi Meydanı
    addGroundedPlatform(game, scene, { x: 0, topY: 16, z: -155, w: 26, h: 4, d: 26, shape: 'cylinder', color: 0x0284c7 });
    addCheckpoint(game, scene, 0, 16, -155, "1. Su Şelalesi Kontrol Noktası");
    addLaserHazard(game, scene, { x: 0, topY: 16, z: -155, length: 20, rotSpeed: 1.5, color: 0x38bdf8 });
    addPhelixStarGem(game, scene, 0, 16, -150);

    // Aşama 4: Hareketli Kristal Vaha Köprüleri
    for (let j = 1; j <= 12; j++) {
      const pz = -168 - (j - 1) * 10.5;
      const px = (j % 2 === 0 ? 5 : -5) * (j % 4 === 0 ? 0 : 1);
      const py = 16.5 + j * 0.8;
      if (j === 3 || j === 8) {
        addMovingPlatform(game, scene, { x: px, topY: py, z: pz, w: 9.5, h: 2.2, d: 9.5, axis: 'x', dist: 8, speed: 1.4, color: 0x38bdf8 });
      } else {
        addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 9.5, h: 3.5, d: 9.5, color: 0x0284c7 });
      }
      addCoin(game, scene, px, py, pz);
    }

    // Aşama 5: 2. Vaha Antik Tapınak Kalıntısı Meydanı
    addGroundedPlatform(game, scene, { x: 0, topY: 26, z: -300, w: 28, h: 5, d: 28, shape: 'cylinder', color: 0x0284c7, metalness: 0.8 });
    addCheckpoint(game, scene, 0, 26, -300, "2. Antik Vaha Tapınağı");
    addPhelixStarGem(game, scene, 0, 26, -294);

    // Aşama 6: Heliks Su Basamakları
    for (let k = 1; k <= 18; k++) {
      const pz = -312 - (k - 1) * 9.5;
      const px = Math.sin(k * 0.8) * 8.5;
      const py = 27 + k * 1.15;
      addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 9.5, h: 3.5, d: 9.5, shape: 'hex', color: 0x0369a1 });
      addCoin(game, scene, px, py, pz);
    }

    // Aşama 7: 3. Zirve Sıçrama Rampası
    addGroundedPlatform(game, scene, { x: 0, topY: 48, z: -495, w: 26, h: 4, d: 26, shape: 'cylinder', color: 0x0284c7 });
    addCheckpoint(game, scene, 0, 48, -495, "3. Zirve Fırlatma Meydanı");
    addJumpPad(game, scene, 0, 48, -495, 30, 0x38bdf8);

    addGroundedPlatform(game, scene, { x: 0, topY: 56, z: -525, w: 22, h: 4, d: 22, color: 0x0284c7 });
    addCoin(game, scene, 0, 56, -525);

    // Aşama 8: Gökyüzü Vaha Takımadaları
    for (let m = 1; m <= 22; m++) {
      const pz = -538 - (m - 1) * 10.5;
      const px = Math.cos(m * 0.75) * 8.0;
      const py = 57 + m * 1.0;
      if (m === 7 || m === 15) {
        addMovingPlatform(game, scene, { x: px, topY: py, z: pz, w: 10, h: 2.2, d: 10, axis: 'x', dist: 9, speed: 1.5, color: 0x38bdf8 });
      } else {
        addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 10, h: 4, d: 10, shape: 'hex', color: 0x0369a1 });
      }
      addCoin(game, scene, px, py, pz);
    }

    // Aşama 9: Vaha Piramidi Zirvesi & Bölüm 2 Portalı
    addGroundedPlatform(game, scene, { x: 0, topY: 82, z: -785, w: 34, h: 5, d: 34, shape: 'cylinder', color: 0x0284c7, metalness: 0.9, roughness: 0.2 });
    addCheckpoint(game, scene, 0, 82, -777, "4. Vaha Çıkış Zirvesi");
    for (let c = 0; c < 12; c++) {
      const ang = (c / 12) * Math.PI * 2;
      addCoin(game, scene, Math.sin(ang) * 11, 82, -785 + Math.cos(ang) * 11);
    }
    addPhelixStarGem(game, scene, 0, 82, -785);
    addExitPortal(game, scene, 0, 82, -797, "phelix_2_neon_verge", "2. BÖLÜM: NEON SINIRI (NEON VERGE)");
  }

  // BÖLÜM 2: Neon Sınırı (Neon Verge) - Siber Şehir Gökdelen Çatıları & Dikey Asansörler ⚡🏙️
  function buildPhelixLevel2(game, scene) {
    const THREE = window.THREE;
    // Siber Şehir İniş Meydanı
    addGroundedPlatform(game, scene, { x: 0, topY: 0, z: 0, w: 28, h: 4, d: 28, color: 0x3b0764, metalness: 0.8, roughness: 0.2 });
    addCheckpoint(game, scene, 0, 0, -6, "1. Siber Çatı Meydanı", true);
    addCoin(game, scene, 0, 0, 0);

    // Gökdelen Çatısı Atlama Hattı (Farklı Yükseklikte Kare Gökdelenler & Dikey/Yatay Asansörler)
    const skyscraperHeights = [4, 8, 14, 20, 26, 32, 38, 44, 50, 56];
    skyscraperHeights.forEach((h, idx) => {
      const pz = -18 - idx * 24;
      const px = (idx % 2 === 0 ? 7 : -7);
      // Gökdelen gövdesi
      addGroundedPlatform(game, scene, { x: px, topY: h, z: pz, w: 14, h: h + 10, d: 14, color: 0x581c87, metalness: 0.6 });
      addCoin(game, scene, px, h, pz);
      addCoin(game, scene, px, h + 2, pz);

      // Çatılar arası Dikey ve Yatay Siber Asansörler
      if (idx % 2 === 0) {
        addMovingPlatform(game, scene, { x: 0, topY: h - 2, z: pz + 12, w: 8, h: 1.5, d: 8, axis: 'y', dist: 5, speed: 1.8, color: 0xec4899 });
      } else {
        addMovingPlatform(game, scene, { x: 0, topY: h - 2, z: pz + 12, w: 8, h: 1.5, d: 8, axis: 'x', dist: 8, speed: 2.2, color: 0x06b6d4 });
      }

      if (idx === 4) {
        addLaserHazard(game, scene, { x: px, topY: h, z: pz, length: 18, rotSpeed: 2.0, color: 0xec4899 });
      }
    });

    // Ara Kontrol Noktası: Neon Televizyon Kulesi
    addGroundedPlatform(game, scene, { x: 0, topY: 62, z: -270, w: 32, h: 6, d: 32, color: 0x7e22ce, metalness: 0.9 });
    addCheckpoint(game, scene, 0, 62, -270, "2. Neon Verici Kulesi");
    addPhelixStarGem(game, scene, 0, 62, -264);
    addJumpPad(game, scene, 0, 62, -270, 36, 0xec4899);

    // İkinci Bölüm: Yüksek İrtifa Siber Kirişler ve Dar Neon Köprüleri
    for (let k = 1; k <= 16; k++) {
      const pz = -305 - (k - 1) * 18;
      const px = Math.sin(k * 1.1) * 10;
      const py = 75 + k * 1.5;
      const isNarrow = k % 3 === 0;
      addGroundedPlatform(game, scene, {
        x: px,
        topY: py,
        z: pz,
        w: isNarrow ? 4 : 11,
        h: 3,
        d: isNarrow ? 16 : 11,
        color: isNarrow ? 0x06b6d4 : 0x9333ea,
        metalness: 0.7
      });
      addCoin(game, scene, px, py, pz);
    }

    // Neon Çıkış Terminali
    addGroundedPlatform(game, scene, { x: 0, topY: 105, z: -620, w: 36, h: 6, d: 36, color: 0x3b0764, metalness: 0.9, roughness: 0.1 });
    addCheckpoint(game, scene, 0, 105, -610, "3. Neon Sınır Çıkış Zirvesi");
    addPhelixStarGem(game, scene, 0, 105, -620);
    addExitPortal(game, scene, 0, 105, -634, "phelix_3_ashen_vale", "3. BÖLÜM: KÜL VADİSİ (THE ASHEN VALE)");
  }

  // BÖLÜM 3: Kül Vadisi (The Ashen Vale) - Lav Havzaları & Çift Şeritli Bazalt Patikaları 🌋🔥
  function buildPhelixLevel3(game, scene) {
    const THREE = window.THREE;
    // Volkanik Başlangıç Krateri
    addGroundedPlatform(game, scene, { x: 0, topY: 0, z: 0, w: 26, h: 4, d: 26, shape: 'hex', color: 0x1c1917, roughness: 0.9 });
    addCheckpoint(game, scene, 0, 0, -6, "1. Kül Krateri Girişi", true);
    addCoin(game, scene, 0, 0, 0);

    // Çift Şeritli Yol Ayrımı (Sol: Yüksek Risk Altın Yolu, Sağ: Güvenli Basamaklar)
    for (let i = 1; i <= 15; i++) {
      const pz = -16 - (i - 1) * 14;
      const pyLeft = i * 1.6;
      const pyRight = i * 1.1;

      // Sol Şerit (Hareketli Lav Blokları)
      if (i % 2 === 0) {
        addMovingPlatform(game, scene, { x: -8, topY: pyLeft, z: pz, w: 7, h: 2, d: 7, axis: 'z', dist: 5, speed: 2.0, color: 0xdc2626 });
      } else {
        addGroundedPlatform(game, scene, { x: -8, topY: pyLeft, z: pz, w: 7, h: 3, d: 7, color: 0x991b1b });
      }
      addCoin(game, scene, -8, pyLeft, pz);

      // Sağ Şerit (Geniş Bazalt Sütunları)
      addGroundedPlatform(game, scene, { x: 8, topY: pyRight, z: pz, w: 10, h: 4, d: 10, shape: 'hex', color: 0x292524 });
      addCoin(game, scene, 8, pyRight, pz);

      // Dönen Alev Lazerleri
      if (i === 7 || i === 13) {
        addLaserHazard(game, scene, { x: 0, topY: (pyLeft + pyRight) / 2, z: pz, length: 22, rotSpeed: 2.2, color: 0xf97316 });
      }
    }

    // Orta Birleşme Noktası: Magma Fırını
    addGroundedPlatform(game, scene, { x: 0, topY: 30, z: -240, w: 32, h: 5, d: 32, shape: 'cylinder', color: 0x7c2d12, metalness: 0.5 });
    addCheckpoint(game, scene, 0, 30, -240, "2. Magma Fırını Mihrabı");
    addPhelixStarGem(game, scene, 0, 30, -234);
    addJumpPad(game, scene, 0, 30, -240, 38, 0xf97316); // Magma Geyser Jump

    // İkinci Aşama: Batıp Çıkan Erimiş Lav Sütunları
    for (let j = 1; j <= 18; j++) {
      const pz = -275 - (j - 1) * 15;
      const px = Math.sin(j * 0.95) * 10;
      const py = 45 + j * 1.4;
      if (j % 3 === 0) {
        addMovingPlatform(game, scene, { x: px, topY: py, z: pz, w: 9, h: 2.5, d: 9, axis: 'y', dist: 6, speed: 2.4, color: 0xea580c });
      } else {
        addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 9.5, h: 4, d: 9.5, shape: 'hex', color: 0x44403c });
      }
      addCoin(game, scene, px, py, pz);
    }

    // Volkan Çıkış Krateri
    addGroundedPlatform(game, scene, { x: 0, topY: 78, z: -570, w: 36, h: 6, d: 36, shape: 'cylinder', color: 0x1c1917, roughness: 0.8 });
    addCheckpoint(game, scene, 0, 78, -560, "3. Anka Zirvesi Çıkışı");
    addPhelixStarGem(game, scene, 0, 78, -570);
    addExitPortal(game, scene, 0, 78, -584, "phelix_4_titanium_canyon", "4. BÖLÜM: TİTANYUM KANYONU (TITANIUM CANYON)");
  }

  // BÖLÜM 4: Titanyum Kanyonu (Titanium Canyon) - Sanayi Dişlileri & Vinçli Konveyörler 🏗️⚙️
  function buildPhelixLevel4(game, scene) {
    const THREE = window.THREE;
    // Maden Vinci Ana Güvertesi
    addGroundedPlatform(game, scene, { x: 0, topY: 0, z: 0, w: 26, h: 4, d: 26, color: 0x475569, metalness: 0.8 });
    addCheckpoint(game, scene, 0, 0, -6, "1. Vinç İskelesi", true);
    addCoin(game, scene, 0, 0, 0);

    // Zig-Zag Şeklinde İlerleyen Sanayi Konveyör Platformları
    for (let i = 1; i <= 16; i++) {
      const pz = -16 - (i - 1) * 14;
      const px = (i % 2 === 0 ? 8 : -8);
      const py = i * 1.5;
      // Konveyör bandı platformu
      addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 12, h: 2.5, d: 8, color: 0x64748b, metalness: 0.7 });
      addCoin(game, scene, px, py, pz);

      // Ortada sallanan sanayi vinci asma platformu
      if (i % 2 === 1) {
        addMovingPlatform(game, scene, { x: 0, topY: py + 1.5, z: pz + 7, w: 8, h: 1.8, d: 8, axis: 'x', dist: 7, speed: 1.9, color: 0xeab308 });
      }
    }

    // Orta Asansör Meydanı
    addGroundedPlatform(game, scene, { x: 0, topY: 32, z: -250, w: 30, h: 5, d: 30, color: 0x334155, metalness: 0.9 });
    addCheckpoint(game, scene, 0, 32, -250, "2. Ağır Sanayi Asansörü");
    addPhelixStarGem(game, scene, 0, 32, -244);
    addJumpPad(game, scene, 0, 32, -250, 34, 0x38bdf8);

    // Kanyon Geçişi: Çapraz Manyetik Raylar & Havada Asılı Çelik Kirişler
    for (let k = 1; k <= 18; k++) {
      const pz = -285 - (k - 1) * 15;
      const px = Math.cos(k * 0.8) * 11;
      const py = 46 + k * 1.3;
      if (k % 4 === 0) {
        addMovingPlatform(game, scene, { x: px, topY: py, z: pz, w: 10, h: 2.2, d: 10, axis: 'y', dist: 7, speed: 2.0, color: 0xf59e0b });
      } else {
        addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 9, h: 3.5, d: 12, color: 0x475569, metalness: 0.85 });
      }
      addCoin(game, scene, px, py, pz);
    }

    // Titanyum Kanyon Çıkış Fabrikası
    addGroundedPlatform(game, scene, { x: 0, topY: 78, z: -580, w: 36, h: 6, d: 36, color: 0x1e293b, metalness: 0.95 });
    addCheckpoint(game, scene, 0, 78, -570, "3. Titanyum Çıkış Fabrikası");
    addPhelixStarGem(game, scene, 0, 78, -580);
    addExitPortal(game, scene, 0, 78, -594, "phelix_5_eye_of_tempest", "5. BÖLÜM: FIRTINA GÖZÜ (EYE OF THE TEMPEST)");
  }

  // BÖLÜM 5: Fırtına Gözü (Eye of the Tempest) - Göğe Yükselen Spiral Kasırga Kulesi 🌀⚡
  function buildPhelixLevel5(game, scene) {
    const THREE = window.THREE;
    // Fırtına Sığınağı Tabanı
    addGroundedPlatform(game, scene, { x: 0, topY: 0, z: 0, w: 26, h: 4, d: 26, shape: 'cylinder', color: 0x0369a1 });
    addCheckpoint(game, scene, 0, 0, -6, "1. Kasırga Sığınağı", true);
    addCoin(game, scene, 0, 0, 0);

    // Devasa Spiral Merdiven (Ortadaki fırtına ekseninde 360 derece dönerek gökyüzüne tırmanış)
    const spiralRadius = 14.0;
    for (let i = 1; i <= 28; i++) {
      const angle = (i * 0.38);
      const px = Math.sin(angle) * spiralRadius;
      const pz = -14 - i * 8.5;
      const py = i * 2.0;

      if (i % 6 === 0) {
        addMovingPlatform(game, scene, { x: px, topY: py, z: pz, w: 8, h: 2, d: 8, axis: 'x', dist: 6, speed: 2.2, color: 0x38bdf8 });
      } else {
        addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 8.5, h: 3, d: 8.5, shape: 'cylinder', color: 0x0284c7 });
      }
      addCoin(game, scene, px, py, pz);

      if (i === 12 || i === 22) {
        addLaserHazard(game, scene, { x: px, topY: py, z: pz, length: 18, rotSpeed: 2.5, color: 0x60a5fa });
      }
    }

    // Bulutüstü Gözlem Meydanı
    addGroundedPlatform(game, scene, { x: 0, topY: 62, z: -270, w: 30, h: 5, d: 30, shape: 'cylinder', color: 0x075985, metalness: 0.8 });
    addCheckpoint(game, scene, 0, 62, -270, "2. Kasırga Gözü Zirve Meydanı");
    addPhelixStarGem(game, scene, 0, 62, -264);
    addJumpPad(game, scene, 0, 62, -270, 36, 0x60a5fa);

    // İkinci Kasırga Kolu: Rüzgar Fıskiyeli Atlama Adaları
    for (let k = 1; k <= 18; k++) {
      const pz = -300 - (k - 1) * 14;
      const px = Math.cos(k * 0.75) * 12;
      const py = 76 + k * 1.4;
      addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 9, h: 3, d: 9, shape: 'cylinder', color: 0x0369a1 });
      addCoin(game, scene, px, py, pz);
    }

    // Fırtına Zirvesi Çıkışı
    addGroundedPlatform(game, scene, { x: 0, topY: 108, z: -580, w: 36, h: 6, d: 36, shape: 'cylinder', color: 0x0c4a6e, metalness: 0.9 });
    addCheckpoint(game, scene, 0, 108, -570, "3. Fırtına Zirve Portalı");
    addPhelixStarGem(game, scene, 0, 108, -580);
    addExitPortal(game, scene, 0, 108, -594, "phelix_6_cyber_void", "6. BÖLÜM: SİBER KIYAMET (CYBER VOID)");
  }

  // BÖLÜM 6: Siber Kıyamet (Cyber Void) - Kuantum Matrisi & Hologram Blokları 💻🌐
  function buildPhelixLevel6(game, scene) {
    const THREE = window.THREE;
    // Dijital Veri Girişi
    addGroundedPlatform(game, scene, { x: 0, topY: 0, z: 0, w: 26, h: 4, d: 26, color: 0x064e3b, metalness: 0.8 });
    addCheckpoint(game, scene, 0, 0, -6, "1. Matris Anahtarı", true);
    addCoin(game, scene, 0, 0, 0);

    // Holografik Yeşil Piksel Kareleri & Şifreli Basamaklar
    for (let i = 1; i <= 20; i++) {
      const pz = -16 - (i - 1) * 12;
      const px = ((i % 3) - 1) * 8; // -8, 0, +8
      const py = i * 1.5;

      if (i % 4 === 0) {
        addMovingPlatform(game, scene, { x: px, topY: py, z: pz, w: 7.5, h: 1.8, d: 7.5, axis: 'x', dist: 7, speed: 2.2, color: 0x34d399 });
      } else {
        addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 8, h: 3, d: 8, color: 0x059669, roughness: 0.3 });
      }
      addCoin(game, scene, px, py, pz);

      if (i % 5 === 0) {
        addLaserHazard(game, scene, { x: px, topY: py, z: pz, length: 16, rotSpeed: 2.4, color: 0x10b981 });
      }
    }

    // Veri Çekirdeği Checkpoint
    addGroundedPlatform(game, scene, { x: 0, topY: 35, z: -270, w: 30, h: 5, d: 30, color: 0x065f46, metalness: 0.9 });
    addCheckpoint(game, scene, 0, 35, -270, "2. Kod Bellek Havuzu");
    addPhelixStarGem(game, scene, 0, 35, -264);
    addJumpPad(game, scene, 0, 35, -270, 34, 0x34d399);

    // Kuantum Tüneli: Yüksek Hızlı Lazerli Veri Köprüleri
    for (let k = 1; k <= 18; k++) {
      const pz = -300 - (k - 1) * 14;
      const px = Math.sin(k * 1.2) * 9;
      const py = 50 + k * 1.3;
      addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 8.5, h: 3, d: 8.5, color: 0x10b981 });
      addCoin(game, scene, px, py, pz);
    }

    // Siber Çıkış Terminali
    addGroundedPlatform(game, scene, { x: 0, topY: 80, z: -580, w: 36, h: 6, d: 36, color: 0x022c22, metalness: 0.95 });
    addCheckpoint(game, scene, 0, 80, -570, "3. Siber Güvenlik Duvarı Çıkışı");
    addPhelixStarGem(game, scene, 0, 80, -580);
    addExitPortal(game, scene, 0, 80, -594, "phelix_7_primal_relics", "7. BÖLÜM: KADİM KALINTILAR (THE PRIMAL RELICS)");
  }

  // BÖLÜM 7: Kadim Kalıntılar (The Primal Relics) - Göksel Mermer Sütunlar & Güneş Sunakları 🏛️✨
  function buildPhelixLevel7(game, scene) {
    const THREE = window.THREE;
    // Antik Tapınak İskelesi
    addGroundedPlatform(game, scene, { x: 0, topY: 0, z: 0, w: 26, h: 4, d: 26, shape: 'cylinder', color: 0xd97706, metalness: 0.4, roughness: 0.6 });
    addCheckpoint(game, scene, 0, 0, -6, "1. Kadim Mermer Kapı", true);
    addCoin(game, scene, 0, 0, 0);

    // Yüzen Altın Güneş Sunakları & Dairesel Mermer Basamaklar
    for (let i = 1; i <= 18; i++) {
      const pz = -16 - (i - 1) * 13;
      const px = Math.sin(i * 0.7) * 9.5;
      const py = i * 1.5;
      addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 9, h: 3.5, d: 9, shape: 'cylinder', color: 0xb45309, roughness: 0.5 });
      addCoin(game, scene, px, py, pz);

      if (i % 3 === 0) {
        addMovingPlatform(game, scene, { x: -px, topY: py + 1.2, z: pz + 6, w: 8, h: 2, d: 8, axis: 'x', dist: 8, speed: 1.6, color: 0xfbbf24 });
      }
    }

    // Güneş Saati Ana Meydanı
    addGroundedPlatform(game, scene, { x: 0, topY: 34, z: -260, w: 32, h: 5, d: 32, shape: 'cylinder', color: 0x78350f, metalness: 0.7 });
    addCheckpoint(game, scene, 0, 34, -260, "2. Kadim Güneş Saati Mihrabı");
    addPhelixStarGem(game, scene, 0, 34, -254);
    addJumpPad(game, scene, 0, 34, -260, 36, 0xfbbf24);

    // Göksel Piramit Tırmanışı
    for (let k = 1; k <= 20; k++) {
      const pz = -295 - (k - 1) * 14;
      const px = Math.cos(k * 0.8) * 10;
      const py = 50 + k * 1.4;
      addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 9.5, h: 4, d: 9.5, shape: 'hex', color: 0xd97706 });
      addCoin(game, scene, px, py, pz);
    }

    // Kadim Kalıntılar Zirve Portalı
    addGroundedPlatform(game, scene, { x: 0, topY: 85, z: -600, w: 36, h: 6, d: 36, shape: 'cylinder', color: 0x451a03, metalness: 0.85 });
    addCheckpoint(game, scene, 0, 85, -590, "3. Göksel Yıldız Tapınağı");
    addPhelixStarGem(game, scene, 0, 85, -600);
    addExitPortal(game, scene, 0, 85, -614, "phelix_8_orbital_belt", "8. BÖLÜM: YÖRÜNGE KUŞAĞI (THE ORBITAL BELT)");
  }

  // BÖLÜM 8: Yörünge Kuşağı (The Orbital Belt) - Sıfır Yerçekimi Asteroit Takımadaları 🛰️🌌
  function buildPhelixLevel8(game, scene) {
    const THREE = window.THREE;
    // Uzay İstasyonu İskelesi
    addGroundedPlatform(game, scene, { x: 0, topY: 0, z: 0, w: 28, h: 4, d: 28, shape: 'cylinder', color: 0x1e1b4b, metalness: 0.9, roughness: 0.2 });
    addCheckpoint(game, scene, 0, 0, -6, "1. Yörünge Hava Kilidi", true);
    addCoin(game, scene, 0, 0, 0);

    // Yörüngede Dönen 3 Boyutlu Asteroit Kümeleri ve Süper Fırlatıcılar
    for (let i = 1; i <= 18; i++) {
      const pz = -16 - (i - 1) * 16;
      const px = Math.sin(i * 0.9) * 12;
      const py = i * 2.0;

      if (i % 3 === 0) {
        addMovingPlatform(game, scene, { x: px, topY: py, z: pz, w: 9, h: 2.5, d: 9, axis: 'x', dist: 10, speed: 2.2, color: 0x818cf8 });
      } else {
        addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 10, h: 4, d: 10, shape: 'hex', color: 0x312e81, metalness: 0.8 });
      }
      addCoin(game, scene, px, py, pz);

      if (i % 5 === 0) {
        addJumpPad(game, scene, px, py, pz, 30, 0x818cf8);
      }
    }

    // Uydu Savunma İstasyonu
    addGroundedPlatform(game, scene, { x: 0, topY: 44, z: -320, w: 34, h: 6, d: 34, shape: 'cylinder', color: 0x312e81, metalness: 0.95 });
    addCheckpoint(game, scene, 0, 44, -320, "2. Uydu Savunma Zırhı");
    addPhelixStarGem(game, scene, 0, 44, -314);
    addJumpPad(game, scene, 0, 44, -320, 42, 0xec4899); // Super Orbital Boost!

    // İkinci Asteroit Kuşağı: Kozmik Güneş Panelleri & Yüzen Plazma Kayanlıkları
    for (let k = 1; k <= 18; k++) {
      const pz = -360 - (k - 1) * 16;
      const px = Math.cos(k * 0.85) * 12;
      const py = 60 + k * 1.6;
      addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 10, h: 4, d: 10, color: 0x4338ca, metalness: 0.85 });
      addCoin(game, scene, px, py, pz);
    }

    // Çekirdek Kapısı Giriş Güvertesi
    addGroundedPlatform(game, scene, { x: 0, topY: 96, z: -680, w: 38, h: 6, d: 38, shape: 'cylinder', color: 0x0f172a, metalness: 0.95, roughness: 0.1 });
    addCheckpoint(game, scene, 0, 96, -670, "3. Çekirdek Giriş Hava Kilidi");
    addPhelixStarGem(game, scene, 0, 96, -680);
    addExitPortal(game, scene, 0, 96, -694, "phelix_9_core_boss", "9. BÖLÜM (BÜYÜK FİNAL): PHELİX ÇEKİRDEĞİ & TİLKİ BOSS");
  }

  // BÖLÜM 9: Phelix Çekirdeği (The Core of Phelix) & TİLKİ BOSS 👑🦊
  function buildPhelixLevel9(game, scene) {
    const THREE = window.THREE;

    // Devasa Çekirdek Boss Arenası
    addGroundedPlatform(game, scene, { x: 0, topY: 0, z: 0, w: 90, h: 5, d: 90, shape: 'cylinder', color: 0x082f49, roughness: 0.6, metalness: 0.6 });

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(44.0, 0.8, 16, 48),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.2;
    scene.add(ring);

    addCheckpoint(game, scene, 0, 0, 36, "Phelix Çekirdek Arenası", true);

    // Zıplama Tünelleri
    const perches = [
      { x: -32, z: 0 },
      { x: 32, z: 0 },
      { x: 0, z: -32 },
      { x: 0, z: 32 }
    ];
    perches.forEach(p => {
      addGroundedPlatform(game, scene, { x: p.x, topY: 5.0, z: p.z, w: 10, h: 3, d: 10, color: 0x0284c7 });
      addJumpPad(game, scene, p.x, 5.0, p.z, 32, 0x38bdf8);
      addCoin(game, scene, p.x, 5.0, p.z);
    });

    // 3D Tilki Boss Mecha Model
    const mech = createFoxBossMechModel(THREE);
    mech.root.position.set(0, 0, -18);
    scene.add(mech.root);

    foxBossInstance = {
      model: mech,
      mesh: mech.root,
      hp: 100,
      maxHp: 100,
      title: '👑 FİNAL BOSS: TİLKİ BOSS (FOX EMPEROR)',
      attackTimer: 3.0,
      currentAttack: 'Lazer Yaylım Ateşi',
      hitCooldown: 0,
      isDead: false
    };

    showFoxBossHp(foxBossInstance.title, 100, 100, "⚡ Tilki Boss Savaş Robotunu Kullanıyor! Lazerlerden Kaç ve Kafasına Vur!");

    if (game.callbacks && game.callbacks.onShowNotice) {
      game.callbacks.onShowNotice("🦊 TİLKİ BOSS İLE BÜYÜK FİNAL! Phelix Çekirdeği'ni kurtarmak için saldır!", "error");
    }
  }

  // --- LEVEL LOADER & CLEANUP ---
  function loadPhelixLevel(rawLevelId) {
    const game = window.__superBearGame;
    if (!game || !game.scene || !window.THREE) return;

    // Clean up base game level and other realms to prevent overlapping!
    if (game.currentLevel && game.currentLevel.sceneGroup && game.scene) {
      game.scene.remove(game.currentLevel.sceneGroup);
    }
    if (window.__superBearPoneixLevels && window.__superBearPoneixLevels.cleanUpPoneixRealm) {
      window.__superBearPoneixLevels.cleanUpPoneixRealm(game);
    }
    if (window.__superBearSpaceLevels && window.__superBearSpaceLevels.cleanUpSpaceRealm) {
      window.__superBearSpaceLevels.cleanUpSpaceRealm(game);
    }
    cleanUpPhelixRealm(game);
    currentPhelixLevelId = rawLevelId;

    const THREE = window.THREE;
    phelixSceneGroup = new THREE.Group();
    phelixSceneGroup.name = "phelix_level_root";
    game.scene.add(phelixSceneGroup);

    game.currentRegion = rawLevelId;
    game.currentLevel = {
      id: rawLevelId,
      name: "Phelix Gezegeni",
      colliders: [],
      checkpoints: [],
      collectibles: [],
      jumpPads: [],
      npcs: [],
      movingPlatforms: [],
      lighting: {
        ambientColor: 0x075985,
        sunColor: 0x38bdf8,
        fogColor: 0x082f49,
        skyColor: 0x082f49
      }
    };

    activeCheckpointPos = new THREE.Vector3(0, 0.5, 0);

    if (game.scene) {
      game.scene.background = new THREE.Color(0x082f49);
      game.scene.fog = new THREE.FogExp2(0x075985, 0.0010);
    }

    if (game.playerPos) game.playerPos.set(0, 0.5, 0);
    if (game.playerVel) game.playerVel.set(0, 0, 0);

    const mapped = PHELIX_LEVEL_MAP[rawLevelId] || rawLevelId;
    switch(mapped) {
      case 'phelix_level_1':
        buildPhelixLevel1(game, phelixSceneGroup);
        // Play the requested Fox Attack & Parachute cinematic on level 1!
        playPhelixFoxCinematic(game);
        break;
      case 'phelix_level_2':
        buildPhelixLevel2(game, phelixSceneGroup);
        break;
      case 'phelix_level_3':
        buildPhelixLevel3(game, phelixSceneGroup);
        break;
      case 'phelix_level_4':
        buildPhelixLevel4(game, phelixSceneGroup);
        break;
      case 'phelix_level_5':
        buildPhelixLevel5(game, phelixSceneGroup);
        break;
      case 'phelix_level_6':
        buildPhelixLevel6(game, phelixSceneGroup);
        break;
      case 'phelix_level_7':
        buildPhelixLevel7(game, phelixSceneGroup);
        break;
      case 'phelix_level_8':
        buildPhelixLevel8(game, phelixSceneGroup);
        break;
      case 'phelix_level_9':
        buildPhelixLevel9(game, phelixSceneGroup);
        break;
      default:
        buildPhelixLevel1(game, phelixSceneGroup);
        break;
    }

    if (game.callbacks && game.callbacks.onRegionChange) {
      game.callbacks.onRegionChange(rawLevelId);
    }
  }

  function cleanUpPhelixRealm(game) {
    if (!game) game = window.__superBearGame;
    hideFoxBossHp();
    isPhelixCutscenePlaying = false;
    if (phelixCutsceneContainer) phelixCutsceneContainer.style.display = 'none';

    // Remove any cutscene objects
    phelixCutsceneObjects.forEach(obj => {
      if (obj && obj.parent) obj.parent.remove(obj);
    });
    phelixCutsceneObjects.length = 0;

    if (phelixSceneGroup && phelixSceneGroup.parent) {
      phelixSceneGroup.parent.remove(phelixSceneGroup);
      phelixSceneGroup = null;
    }

    // Clean up any remaining objects by name in the scene
    if (game && game.scene) {
      const toRemove = [];
      game.scene.traverse(child => {
        if (child.name && (child.name.startsWith("phelix_") || child.name.startsWith("checkpoint_group_"))) {
          toRemove.push(child);
        }
      });
      toRemove.forEach(c => {
        if (c.parent) c.parent.remove(c);
      });
    }

    animatedObjects.length = 0;
    phelixShockwaves.length = 0;
    movingPlatforms.length = 0;
    laserHazards.length = 0;
    foxBossInstance = null;

    if (game && game.playerBear && game.playerBear.root) {
      game.playerBear.root.visible = true;
    }
  }

  function damagePlayer(game, amount = 15) {
    if (damageIframeTimer > 0) return;
    damageIframeTimer = 1.0;
    phelixCameraShake = 0.8;
    triggerPhelixFlash('#ef4444');
    playAudioTone(150, 0.25, 'sawtooth');

    if (game.playerBear && game.playerBear.root) {
      game.playerBear.root.position.y += 1.2;
    }
    if (game.playerVel) {
      game.playerVel.y = 12.0;
    }
    if (game.callbacks && game.callbacks.onShowNotice) {
      game.callbacks.onShowNotice("💥 HASAR ALDIN! (" + amount + ")", "error");
    }
  }

  // --- TICK LOOP ---
  function updatePhelixLoop() {
    requestAnimationFrame(updatePhelixLoop);

    const game = window.__superBearGame;
    if (!game || !game.playerPos) return;
    const pPos = game.playerPos;

    if (isPhelixCutscenePlaying) {
      if (game.inputs) {
        game.inputs.forward = false;
        game.inputs.backward = false;
        game.inputs.left = false;
        game.inputs.right = false;
        game.inputs.jump = false;
        game.inputs.attack = false;
        game.inputs.roll = false;
      }
      if (typeof game.joystickX !== 'undefined') game.joystickX = 0;
      if (typeof game.joystickY !== 'undefined') game.joystickY = 0;
      if (game.playerVel) game.playerVel.set(0, 0, 0);
      if (game.playerBear && game.playerBear.root) game.playerBear.root.visible = false;
    }

    if (damageIframeTimer > 0) damageIframeTimer -= 0.016;

    // Void Fall check
    if (PHELIX_LEVEL_MAP[game.currentRegion]) {
      if (pPos.y < -12.0) {
        damagePlayer(game, 15);
        const respawnTarget = activeCheckpointPos || (game.currentLevel && game.currentLevel.spawnPoint);
        if (respawnTarget) {
          pPos.copy(respawnTarget);
          pPos.y += 1.2;
        } else {
          pPos.set(0, 1.5, 0);
        }
        if (game.playerVel) game.playerVel.set(0, 0, 0);
        if (game.isGrounded !== undefined) game.isGrounded = true;
        if (game.jumpCount !== undefined) game.jumpCount = 0;
        if (game.spawnSparkleParticles) {
          game.spawnSparkleParticles(pPos, 20, 0x38bdf8);
        }
        if (game.callbacks && game.callbacks.onShowNotice) {
          game.callbacks.onShowNotice("🔷 Boşluğa düştün! Son kontrol noktasına geri ışınlandın.", "info");
        }
      }
    }

    if (phelixCameraShake > 0) {
      phelixCameraShake -= 0.04;
      if (game.camera) {
        game.camera.position.x += (Math.random() - 0.5) * phelixCameraShake;
        game.camera.position.y += (Math.random() - 0.5) * phelixCameraShake;
      }
    }

    // Moving Platforms
    const nowSec = Date.now() * 0.001;
    for (let m = 0; m < movingPlatforms.length; m++) {
      const mp = movingPlatforms[m];
      const offset = Math.sin(nowSec * mp.speed) * mp.dist;
      const newPos = mp.basePos.clone();
      newPos[mp.axis] += offset;

      const delta = newPos.clone().sub(mp.group.position);
      mp.group.position.copy(newPos);

      if (mp.collider) {
        mp.collider.min.set(newPos.x - mp.w / 2, mp.topY - mp.h, newPos.z - mp.d / 2);
        mp.collider.max.set(newPos.x + mp.w / 2, mp.topY, newPos.z + mp.d / 2);
      }

      if (
        pPos.x >= newPos.x - mp.w / 2 - 0.5 &&
        pPos.x <= newPos.x + mp.w / 2 + 0.5 &&
        pPos.z >= newPos.z - mp.d / 2 - 0.5 &&
        pPos.z <= newPos.z + mp.d / 2 + 0.5 &&
        Math.abs(pPos.y - mp.topY) < 0.8
      ) {
        pPos.add(delta);
      }
    }

    // Laser Hazards
    for (let l = 0; l < laserHazards.length; l++) {
      const lz = laserHazards[l];
      lz.angle += lz.rotSpeed * 0.016;
      lz.group.rotation.y = lz.angle;

      const dHoriz = Math.hypot(pPos.x - lz.pos.x, pPos.z - lz.pos.z);
      if (dHoriz < lz.length / 2 && Math.abs(pPos.y - lz.pos.y) < 1.4) {
        damagePlayer(game, 15);
      }
    }

    // Animated objects
    for (let a = 0; a < animatedObjects.length; a++) {
      if (animatedObjects[a].update) animatedObjects[a].update();
    }

    // Jump pads
    if (game.currentLevel && game.currentLevel.jumpPads) {
      ((game.currentLevel && game.currentLevel.jumpPads) || []).forEach(pad => {
        const d = Math.hypot(pPos.x - pad.pos.x, pPos.z - pad.pos.z);
        if (d < (pad.radius || 3.0) && Math.abs(pPos.y - pad.pos.y) < 2.2 && game.playerVel.y <= 4.0) {
          game.playerVel.y = pad.force || 30;
          game.isGrounded = false;
          game.jumpCount = 1;
          playAudioTone(750, 0.2, 'sine');
          if (window.St && window.St.playJump) window.St.playJump();
        }
      });
    }

    // Collectibles
    if (game.currentLevel && game.currentLevel.collectibles) {
      ((game.currentLevel && game.currentLevel.collectibles) || []).forEach(col => {
        if (!col.collected && pPos.distanceTo(col.pos) < 2.4) {
          col.collected = true;
          col.mesh.visible = false;
          if (game.stats) game.stats.coins += col.value || 1;
          playAudioTone(880, 0.15, 'sine');
          if (window.St && window.St.playCoin) window.St.playCoin();
          if (game.callbacks && game.callbacks.onStatsUpdate) game.callbacks.onStatsUpdate(game.stats);
        }
      });
    }

    // Checkpoints
    if (game.currentLevel && game.currentLevel.checkpoints) {
      ((game.currentLevel && game.currentLevel.checkpoints) || []).forEach(cp => {
        if (!cp.active && pPos.distanceTo(cp.pos) < cp.radius) {
          ((game.currentLevel && game.currentLevel.checkpoints) || []).forEach(c => {
            c.active = false;
            if (c.bannerMesh && c.bannerMesh.material) c.bannerMesh.material.color.setHex(0xef4444);
          });
          cp.active = true;
          activeCheckpointPos = cp.pos.clone();
          if (cp.bannerMesh && cp.bannerMesh.material) cp.bannerMesh.material.color.setHex(0x0284c7);
          playAudioTone(920, 0.2, 'sine');
          if (game.callbacks && game.callbacks.onShowNotice) {
            game.callbacks.onShowNotice("🚩 Kontrol Noktası: " + cp.name, "success");
          }
        }
      });
    }

    // Exit portal
    if (game.currentLevel && game.currentLevel.nextPortal) {
      const portal = game.currentLevel.nextPortal;
      if (pPos.distanceTo(portal.pos) < portal.radius) {
        if (game.loadRegion) game.loadRegion(portal.targetRegion);
      }
    }

    // TİLKİ BOSS AI IN LEVEL 9
    if (foxBossInstance && !foxBossInstance.isDead && phelixSceneGroup) {
      const b = foxBossInstance;
      const bMesh = b.mesh;
      const distToBoss = pPos.distanceTo(bMesh.position);

      b.attackTimer -= 0.016;
      if (b.attackTimer <= 0) {
        b.attackTimer = 3.2;
        phelixCameraShake = 1.4;
        playAudioTone(220, 0.35, 'sawtooth');
        showFoxBossHp(b.title, b.hp, b.maxHp, "⚡ Tilki Boss Çift Namlulu Lazer Ateşledi! Zıpla!");

        if (distToBoss < 28.0 && pPos.y < 4.0) {
          damagePlayer(game, 20);
        }
      }

      b.hitCooldown -= 0.016;
      if ((game.isAttacking || game.isRolling || pPos.distanceTo(bMesh.position) < 8.0) && b.hitCooldown <= 0) {
        if (pPos.distanceTo(bMesh.position) < 8.5) {
          b.hitCooldown = 0.45;
          b.hp -= 15;
          phelixCameraShake = 1.0;
          playAudioTone(400, 0.2, 'square');
          showFoxBossHp(b.title, b.hp, b.maxHp, "💥 Tilki Boss Mecha Hasar Aldı! (-15 HP)");

          if (game.callbacks && game.callbacks.onShowNotice) {
            game.callbacks.onShowNotice("💥 TİLKİ BOSSA HASAR VERİLDİ! (-15 HP)", "success");
          }

          if (b.hp <= 0) {
            b.isDead = true;
            bMesh.visible = false;
            hideFoxBossHp();
            triggerPhelixFlash('#38bdf8');
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("🏆 TEBRİKLER! Tilki Boss Alt Edildi! Phelix Gezegeni Tamamen Kurtarıldı!", "success");
            }
            if (typeof window.confetti === 'function') {
              window.confetti({ particleCount: 180, spread: 95, origin: { y: 0.6 } });
            }
          }
        }
      }
    }
  }

  // --- HOOKS ---
  window.__superBearPhelixLevels = {
    loadPhelixLevel,
    cleanUpPhelixRealm,
    playPhelixFoxCinematic,
    PHELIX_LEVEL_MAP,
    PHELIX_LEVEL_IDS
  };

  requestAnimationFrame(updatePhelixLoop);

  function hookIntoGame() {
    const game = window.__superBearGame;
    if (game) {
      const origLoad = game.loadRegion;
      game.loadRegion = function(regionId) {
        if (PHELIX_LEVEL_MAP[regionId]) {
          loadPhelixLevel(regionId);
          return;
        }
        cleanUpPhelixRealm(game);
        if (origLoad) return origLoad.call(this, regionId);
      };
      console.log("🔷 Phelix Gezegeni Motoru game.loadRegion sistemine bağlandı!");
    } else {
      setTimeout(hookIntoGame, 200);
    }
  }
  hookIntoGame();

})();
