// ===================================================================
// GRIZZY'NIN BÜYÜK MACERASI - PONEİX GEZEGENİ BÖLÜMLERİ (YEŞİL ÇİZGİ)
// 7 DEVASA, ÇOK UZUN VE ZORLU PLATFORM BÖLÜMÜ, TİLKİ SİNEMATİĞİ & 14 BOSS FÜZYONU
// ===================================================================

(function() {
  console.log("🪐 Initializing Enhanced Poneix Gezegeni Motoru (Devasa Uzunluk & Sağlam Parkurlar)...");

  const PONEIX_LEVEL_MAP = {
    'poneix_1_crash_valley': 'poneix_level_1',
    'poneix_level_1': 'poneix_level_1',
    'poneix_2_crystal_canyon': 'poneix_level_2',
    'poneix_level_2': 'poneix_level_2',
    'poneix_3_cyber_ruins': 'poneix_level_3',
    'poneix_level_3': 'poneix_level_3',
    'poneix_4_magma_ocean': 'poneix_level_4',
    'poneix_level_4': 'poneix_level_4',
    'poneix_5_sky_citadel': 'poneix_level_5',
    'poneix_level_5': 'poneix_level_5',
    'poneix_6_chimera_core': 'poneix_level_6',
    'poneix_level_6': 'poneix_level_6',
    'poneix_7_fusion_boss': 'poneix_level_7',
    'poneix_level_7': 'poneix_level_7',
  };

  const PONEIX_LEVEL_IDS = Object.keys(PONEIX_LEVEL_MAP);

  let currentPoneixLevelId = null;
  let poneixSceneGroup = null;
  let poneixCameraShake = 0;
  let damageIframeTimer = 0;
  let activeCheckpointPos = null;

  // Boss & Cutscene states
  let fusionBossInstance = null;
  let isCutscenePlaying = false;
  let cutsceneObjects = [];

  const animatedObjects = [];
  const poneixShockwaves = [];
  const movingPlatforms = [];
  const laserHazards = [];

  // --- TOP BOSS HEALTH BAR UI (PONEİX FUSION TITAN) ---
  let poneixBossHpContainer = document.getElementById('poneix-boss-hp-container');
  if (!poneixBossHpContainer) {
    poneixBossHpContainer = document.createElement('div');
    poneixBossHpContainer.id = 'poneix-boss-hp-container';
    poneixBossHpContainer.style.position = 'absolute';
    poneixBossHpContainer.style.top = '36px';
    poneixBossHpContainer.style.left = '50%';
    poneixBossHpContainer.style.transform = 'translateX(-50%)';
    poneixBossHpContainer.style.width = '540px';
    poneixBossHpContainer.style.maxWidth = '92vw';
    poneixBossHpContainer.style.backgroundColor = 'rgba(6, 78, 59, 0.95)';
    poneixBossHpContainer.style.border = '2px solid #34d399';
    poneixBossHpContainer.style.borderRadius = '16px';
    poneixBossHpContainer.style.padding = '10px 16px';
    poneixBossHpContainer.style.display = 'none';
    poneixBossHpContainer.style.zIndex = '1000';
    poneixBossHpContainer.style.boxShadow = '0 0 35px rgba(52, 211, 153, 0.65), 0 4px 25px rgba(0,0,0,0.9)';
    poneixBossHpContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif';

    const poneixBossHeader = document.createElement('div');
    poneixBossHeader.style.display = 'flex';
    poneixBossHeader.style.justifyContent = 'space-between';
    poneixBossHeader.style.alignItems = 'center';
    poneixBossHeader.style.marginBottom = '6px';

    const poneixBossTitle = document.createElement('div');
    poneixBossTitle.id = 'poneix-boss-title';
    poneixBossTitle.style.fontWeight = '900';
    poneixBossTitle.style.fontSize = '14px';
    poneixBossTitle.style.color = '#a7f3d0';
    poneixBossTitle.style.display = 'flex';
    poneixBossTitle.style.alignItems = 'center';
    poneixBossTitle.style.gap = '8px';
    poneixBossTitle.innerHTML = '👑 14 DÜNYA BİRLEŞİK FÜZYON BOSSU (CHIMERA TITAN)';

    const poneixBossHpText = document.createElement('div');
    poneixBossHpText.id = 'poneix-boss-hp-text';
    poneixBossHpText.style.fontWeight = '800';
    poneixBossHpText.style.fontSize = '13px';
    poneixBossHpText.style.color = '#34d399';
    poneixBossHpText.innerText = '100 / 100';

    poneixBossHeader.appendChild(poneixBossTitle);
    poneixBossHeader.appendChild(poneixBossHpText);

    const poneixBossHpTrack = document.createElement('div');
    poneixBossHpTrack.style.width = '100%';
    poneixBossHpTrack.style.height = '14px';
    poneixBossHpTrack.style.backgroundColor = '#064e3b';
    poneixBossHpTrack.style.borderRadius = '8px';
    poneixBossHpTrack.style.overflow = 'hidden';
    poneixBossHpTrack.style.border = '1px solid rgba(52, 211, 153, 0.5)';
    poneixBossHpTrack.style.position = 'relative';

    const poneixBossHpFill = document.createElement('div');
    poneixBossHpFill.id = 'poneix-boss-hp-fill';
    poneixBossHpFill.style.width = '100%';
    poneixBossHpFill.style.height = '100%';
    poneixBossHpFill.style.background = 'linear-gradient(90deg, #10b981, #34d399, #f59e0b, #ef4444)';
    poneixBossHpFill.style.borderRadius = '7px';
    poneixBossHpFill.style.transition = 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)';

    poneixBossHpTrack.appendChild(poneixBossHpFill);

    const poneixBossStatus = document.createElement('div');
    poneixBossStatus.id = 'poneix-boss-status';
    poneixBossStatus.style.fontSize = '11px';
    poneixBossStatus.style.color = '#fef08a';
    poneixBossStatus.style.marginTop = '4px';
    poneixBossStatus.style.fontWeight = '700';
    poneixBossStatus.style.textAlign = 'center';
    poneixBossStatus.innerText = '⚡ 14 Dünya Patronunun Gücü Birleşti! Zayıf Noktaları Vur!';

    poneixBossHpContainer.appendChild(poneixBossHeader);
    poneixBossHpContainer.appendChild(poneixBossHpTrack);
    poneixBossHpContainer.appendChild(poneixBossStatus);
    document.body.appendChild(poneixBossHpContainer);
  }

  function showPoneixBossHp(title, hp, maxHp, statusText) {
    if (!poneixBossHpContainer) return;
    poneixBossHpContainer.style.display = 'block';
    const titleEl = document.getElementById('poneix-boss-title');
    const textEl = document.getElementById('poneix-boss-hp-text');
    const fillEl = document.getElementById('poneix-boss-hp-fill');
    const statEl = document.getElementById('poneix-boss-status');

    if (titleEl && title) titleEl.innerHTML = title;
    const pct = Math.max(0, Math.min(100, (hp / maxHp) * 100));
    if (fillEl) fillEl.style.width = pct + '%';
    if (textEl) textEl.innerText = `${Math.max(0, Math.ceil(hp))} / ${maxHp}`;
    if (statEl && statusText) statEl.innerText = statusText;
  }

  function hidePoneixBossHp() {
    if (poneixBossHpContainer) poneixBossHpContainer.style.display = 'none';
  }

  // --- CINEMATIC LETTERBOXING, TABLET HUD & DIALOGUE SUBTITLES OVERLAY ---
  let cutsceneContainer = document.getElementById('poneix-cutscene-overlay');
  let cutsceneAdvanceFn = null;

  if (!cutsceneContainer) {
    cutsceneContainer = document.createElement('div');
    cutsceneContainer.id = 'poneix-cutscene-overlay';
    cutsceneContainer.style.position = 'fixed';
    cutsceneContainer.style.inset = '0';
    cutsceneContainer.style.pointerEvents = 'auto';
    cutsceneContainer.style.zIndex = '1100';
    cutsceneContainer.style.display = 'none';
    cutsceneContainer.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    cutsceneContainer.style.userSelect = 'none';

    // Top Cinematic Header
    const topBar = document.createElement('div');
    topBar.id = 'cutscene-top-bar';
    topBar.style.position = 'absolute';
    topBar.style.top = '0';
    topBar.style.left = '0';
    topBar.style.right = '0';
    topBar.style.height = '68px';
    topBar.style.backgroundColor = 'rgba(2, 6, 23, 0.94)';
    topBar.style.borderBottom = '2px solid #10b981';
    topBar.style.display = 'flex';
    topBar.style.alignItems = 'center';
    topBar.style.justifyContent = 'space-between';
    topBar.style.padding = '0 24px';
    topBar.style.backdropFilter = 'blur(10px)';
    topBar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.7)';

    topBar.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 24px; filter: drop-shadow(0 0 8px #34d399);">🚀</span>
        <div>
          <div style="font-weight: 900; color: #34d399; font-size: 15px; letter-spacing: 1px; text-transform: uppercase;">
            PONEİX GEZEGENİ HİKAYESİ — 1. BÖLÜM: UZAY GEMİSİ KOKPİTİ
          </div>
          <div style="font-size: 12px; color: #94a3b8; font-weight: 600;">
            Grizzy ve Tilki'nin uzay gemisindeki yüzleşmesi & Çarpışma Sinematiği
          </div>
        </div>
      </div>
      <button id="skip-cutscene-btn" style="pointer-events: auto; background: rgba(16, 185, 129, 0.2); border: 1.5px solid #34d399; color: #a7f3d0; font-weight: 800; font-size: 12px; padding: 7px 18px; border-radius: 9999px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s ease; box-shadow: 0 0 12px rgba(16, 185, 129, 0.3);">
        <span>Sinematiği Geç</span>
        <span>⏭️</span>
      </button>
    `;

    // Center Tablet Hologram HUD Modal
    const tabletModal = document.createElement('div');
    tabletModal.id = 'cutscene-tablet-modal';
    tabletModal.style.position = 'absolute';
    tabletModal.style.top = '45%';
    tabletModal.style.left = '50%';
    tabletModal.style.transform = 'translate(-50%, -50%) scale(0.95)';
    tabletModal.style.width = '520px';
    tabletModal.style.maxWidth = '90vw';
    tabletModal.style.background = 'linear-gradient(135deg, rgba(30, 27, 75, 0.95), rgba(69, 10, 10, 0.96))';
    tabletModal.style.border = '3px solid #ef4444';
    tabletModal.style.borderRadius = '24px';
    tabletModal.style.padding = '24px 28px';
    tabletModal.style.textAlign = 'center';
    tabletModal.style.display = 'none';
    tabletModal.style.boxShadow = '0 0 50px rgba(239, 68, 68, 0.8), 0 8px 32px rgba(0,0,0,0.9)';
    tabletModal.style.zIndex = '1150';
    tabletModal.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';

    tabletModal.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 8px;">
        <span style="font-size: 28px; animation: pulse 1s infinite;">🚨</span>
        <span style="font-size: 13px; font-weight: 900; color: #fca5a5; letter-spacing: 2px; text-transform: uppercase;">
          KOKPİT TABLETİ & ACİL ALARM PROTOKOLÜ
        </span>
      </div>
      <div style="font-size: 22px; font-weight: 900; color: #fef2f2; margin: 12px 0 8px 0; text-shadow: 0 0 15px rgba(239, 68, 68, 0.9); line-height: 1.4;">
        ⚠️ GEMİ YERYÜZÜNE 5 SANİYE SONRA ÇAKILACAK!
      </div>
      <div style="font-size: 14px; color: #fecaca; font-weight: 600; margin-bottom: 16px;">
        Motor reaktörleri devre dışı kaldı! İtici çekirdek patlamak üzere!
      </div>
      <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
        <div style="background: rgba(15, 23, 42, 0.9); border: 2px solid #ef4444; border-radius: 16px; padding: 10px 28px; display: inline-flex; align-items: baseline; gap: 8px;">
          <span style="font-size: 13px; color: #cbd5e1; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Kalan Süre:</span>
          <span id="tablet-countdown-digit" style="font-size: 44px; font-weight: 900; color: #ef4444; font-family: monospace; text-shadow: 0 0 20px #ef4444;">5</span>
          <span style="font-size: 14px; color: #ef4444; font-weight: 800;">sn</span>
        </div>
      </div>
    `;

    // Bottom Dialogue & Subtitles Bar
    const bottomBar = document.createElement('div');
    bottomBar.id = 'cutscene-bottom-bar';
    bottomBar.style.position = 'absolute';
    bottomBar.style.bottom = '0';
    bottomBar.style.left = '0';
    bottomBar.style.right = '0';
    bottomBar.style.minHeight = '145px';
    bottomBar.style.backgroundColor = 'rgba(2, 6, 23, 0.96)';
    bottomBar.style.borderTop = '2.5px solid #10b981';
    bottomBar.style.display = 'flex';
    bottomBar.style.flexDirection = 'column';
    bottomBar.style.alignItems = 'center';
    bottomBar.style.justifyContent = 'center';
    bottomBar.style.padding = '18px 28px';
    bottomBar.style.boxShadow = '0 -15px 35px rgba(0,0,0,0.85)';
    bottomBar.style.backdropFilter = 'blur(12px)';

    const dialogueContentWrap = document.createElement('div');
    dialogueContentWrap.style.width = '100%';
    dialogueContentWrap.style.maxWidth = '920px';
    dialogueContentWrap.style.display = 'flex';
    dialogueContentWrap.style.alignItems = 'center';
    dialogueContentWrap.style.gap = '20px';

    const avatarBox = document.createElement('div');
    avatarBox.id = 'cutscene-avatar-box';
    avatarBox.style.width = '70px';
    avatarBox.style.height = '70px';
    avatarBox.style.borderRadius = '20px';
    avatarBox.style.backgroundColor = 'rgba(15, 23, 42, 0.9)';
    avatarBox.style.border = '2.5px solid #34d399';
    avatarBox.style.display = 'flex';
    avatarBox.style.alignItems = 'center';
    avatarBox.style.justifyContent = 'center';
    avatarBox.style.fontSize = '36px';
    avatarBox.style.flexShrink = '0';
    avatarBox.style.boxShadow = '0 0 20px rgba(52, 211, 153, 0.4)';
    avatarBox.innerHTML = '🐻';

    const textContentCol = document.createElement('div');
    textContentCol.style.flex = '1';
    textContentCol.style.display = 'flex';
    textContentCol.style.flexDirection = 'column';
    textContentCol.style.gap = '6px';

    const speakerBadge = document.createElement('div');
    speakerBadge.id = 'cutscene-speaker-badge';
    speakerBadge.style.display = 'inline-flex';
    speakerBadge.style.alignItems = 'center';
    speakerBadge.style.gap = '8px';
    speakerBadge.style.fontSize = '14px';
    speakerBadge.style.fontWeight = '900';
    speakerBadge.style.color = '#34d399';
    speakerBadge.style.letterSpacing = '1px';
    speakerBadge.style.textTransform = 'uppercase';
    speakerBadge.innerText = '🐻 GRIZZY';

    const subtitleBox = document.createElement('div');
    subtitleBox.id = 'cutscene-subtitle-box';
    subtitleBox.style.color = '#f8fafc';
    subtitleBox.style.fontSize = '18px';
    subtitleBox.style.lineHeight = '1.6';
    subtitleBox.style.fontWeight = '700';
    subtitleBox.style.textShadow = '0 2px 4px rgba(0,0,0,0.8)';
    subtitleBox.innerText = 'Yükleniyor...';

    textContentCol.appendChild(speakerBadge);
    textContentCol.appendChild(subtitleBox);

    const actionCol = document.createElement('div');
    actionCol.style.display = 'flex';
    actionCol.style.flexDirection = 'column';
    actionCol.style.alignItems = 'center';
    actionCol.style.gap = '8px';
    actionCol.style.flexShrink = '0';

    const advanceBtn = document.createElement('button');
    advanceBtn.id = 'cutscene-advance-btn';
    advanceBtn.style.pointerEvents = 'auto';
    advanceBtn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
    advanceBtn.style.border = 'none';
    advanceBtn.style.color = '#ffffff';
    advanceBtn.style.fontWeight = '800';
    advanceBtn.style.fontSize = '13px';
    advanceBtn.style.padding = '8px 18px';
    advanceBtn.style.borderRadius = '9999px';
    advanceBtn.style.cursor = 'pointer';
    advanceBtn.style.display = 'flex';
    advanceBtn.style.alignItems = 'center';
    advanceBtn.style.gap = '6px';
    advanceBtn.style.boxShadow = '0 4px 14px rgba(16, 185, 129, 0.4)';
    advanceBtn.style.whiteSpace = 'nowrap';
    advanceBtn.innerHTML = `<span>Devam Et</span><span>▶</span>`;

    const progressTrack = document.createElement('div');
    progressTrack.style.width = '90px';
    progressTrack.style.height = '5px';
    progressTrack.style.backgroundColor = 'rgba(255,255,255,0.15)';
    progressTrack.style.borderRadius = '9999px';
    progressTrack.style.overflow = 'hidden';

    const progressBar = document.createElement('div');
    progressBar.id = 'cutscene-progress-bar';
    progressBar.style.width = '0%';
    progressBar.style.height = '100%';
    progressBar.style.backgroundColor = '#34d399';
    progressBar.style.borderRadius = '9999px';
    progressBar.style.transition = 'width 0.1s linear';

    progressTrack.appendChild(progressBar);
    actionCol.appendChild(advanceBtn);
    actionCol.appendChild(progressTrack);

    dialogueContentWrap.appendChild(avatarBox);
    dialogueContentWrap.appendChild(textContentCol);
    dialogueContentWrap.appendChild(actionCol);
    bottomBar.appendChild(dialogueContentWrap);

    cutsceneContainer.appendChild(topBar);
    cutsceneContainer.appendChild(tabletModal);
    cutsceneContainer.appendChild(bottomBar);
    document.body.appendChild(cutsceneContainer);

    advanceBtn.onclick = (e) => {
      e.stopPropagation();
      if (typeof cutsceneAdvanceFn === 'function') cutsceneAdvanceFn();
    };

    bottomBar.onclick = () => {
      if (typeof cutsceneAdvanceFn === 'function') cutsceneAdvanceFn();
    };

    const skipBtn = topBar.querySelector('#skip-cutscene-btn');
    if (skipBtn) {
      skipBtn.onclick = (e) => {
        e.stopPropagation();
        if (typeof window.__endPoneixCutscene === 'function') {
          window.__endPoneixCutscene();
        }
      };
    }
  }

  // --- WHITE/ORANGE EXPLOSION FLASH OVERLAY ---
  let flashOverlay = document.getElementById('poneix-explosion-flash');
  if (!flashOverlay) {
    flashOverlay = document.createElement('div');
    flashOverlay.id = 'poneix-explosion-flash';
    flashOverlay.style.position = 'fixed';
    flashOverlay.style.inset = '0';
    flashOverlay.style.backgroundColor = '#ffffff';
    flashOverlay.style.opacity = '0';
    flashOverlay.style.pointerEvents = 'none';
    flashOverlay.style.zIndex = '1200';
    flashOverlay.style.transition = 'opacity 0.15s ease-out';
    document.body.appendChild(flashOverlay);
  }

  function triggerExplosionFlash() {
    if (!flashOverlay) return;
    flashOverlay.style.backgroundColor = '#fff7ed';
    flashOverlay.style.opacity = '0.98';
    setTimeout(() => {
      flashOverlay.style.opacity = '0';
    }, 450);
  }

  // --- 3-SECOND BLACKOUT OVERLAY ---
  let blackoutOverlay = document.getElementById('poneix-blackout-overlay');
  if (!blackoutOverlay) {
    blackoutOverlay = document.createElement('div');
    blackoutOverlay.id = 'poneix-blackout-overlay';
    blackoutOverlay.style.position = 'fixed';
    blackoutOverlay.style.inset = '0';
    blackoutOverlay.style.backgroundColor = '#000000';
    blackoutOverlay.style.opacity = '0';
    blackoutOverlay.style.pointerEvents = 'none';
    blackoutOverlay.style.zIndex = '1250';
    blackoutOverlay.style.transition = 'opacity 0.4s ease-in-out';
    document.body.appendChild(blackoutOverlay);
  }

  // --- GENERAL 3D COLLIDERS & PLATFORM HELPERS ---
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

  // Robust Grounded Platform where top surface is ALWAYS exactly at `topY`
  function addGroundedPlatform(game, scene, config) {
    const THREE = window.THREE;
    const {
      x = 0, topY = 0, z = 0,
      w = 10, h = 3.5, d = 10,
      color = 0x10b981,
      emissive = 0x064e3b,
      roughness = 0.35,
      metalness = 0.4,
      shape = 'box' // 'box', 'cylinder', 'hex'
    } = config;

    const group = new THREE.Group();
    const centerY = topY - h / 2;
    group.position.set(x, centerY, z);

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

    // Glowing Neon Rim
    if (shape === 'cylinder' || shape === 'hex') {
      const rimGeo = new THREE.TorusGeometry(w / 2, 0.14, 8, 24);
      const rimMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = h / 2;
      group.add(rim);
    } else {
      const edgeGeo = new THREE.BoxGeometry(w + 0.1, 0.18, d + 0.1);
      const edgeMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
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

  // Dynamic Moving Platform
  function addMovingPlatform(game, scene, config) {
    const THREE = window.THREE;
    const {
      x = 0, topY = 0, z = 0,
      w = 9, h = 2.2, d = 9,
      axis = 'x',
      dist = 12,
      speed = 1.5,
      color = 0x34d399,
      emissive = 0x059669
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

  // Spinning Laser Hazard
  function addLaserHazard(game, scene, config) {
    const THREE = window.THREE;
    const {
      x = 0, topY = 0, z = 0,
      length = 20,
      rotSpeed = 1.2,
      color = 0xef4444
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

  function addJumpPad(game, scene, x, topY, z, force = 28, color = 0x10b981) {
    const THREE = window.THREE;
    const padGroup = new THREE.Group();
    padGroup.position.set(x, topY, z);

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(2.4, 2.8, 0.4, 18),
      new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.4, metalness: 0.8 })
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
    const arrowMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
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

  // Firmly Grounded Checkpoint with Tall Flagpole, Glowing Banner, Sky Beacon and Crystal
  function addCheckpoint(game, scene, x, topY, z, name = "Poneix Kontrol Noktası", isActive = false) {
    const THREE = window.THREE;
    const cpGroup = new THREE.Group();
    cpGroup.name = "checkpoint_group_" + name.replace(/\s+/g, '_');
    cpGroup.position.set(x, topY, z);

    // 1. Circular Foundation Base
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(2.6, 3.0, 0.4, 18),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5, metalness: 0.8 })
    );
    base.position.y = 0.2;
    base.receiveShadow = true;
    cpGroup.add(base);

    // 2. Tall Metallic Flagpole (4.5m tall)
    const poleMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 4.5, 12), poleMat);
    pole.position.y = 2.45;
    cpGroup.add(pole);

    // 3. Glowing Banner / Flag (Red inactive, Green active)
    const bannerMat = new THREE.MeshStandardMaterial({
      color: isActive ? 0x22c55e : 0xef4444,
      emissive: isActive ? 0x16a34a : 0xb91c1c,
      emissiveIntensity: 0.9,
      roughness: 0.3
    });
    const banner = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 0.08), bannerMat);
    banner.name = "flag_mesh";
    banner.userData = { isBanner: true };
    banner.position.set(0.85, 4.0, 0);
    cpGroup.add(banner);

    // 4. Glowing Runic Crystal on Top
    const crystalMat = new THREE.MeshStandardMaterial({
      color: isActive ? 0x34d399 : 0xf87171,
      emissive: isActive ? 0x10b981 : 0xdc2626,
      emissiveIntensity: isActive ? 0.95 : 0.4,
      roughness: 0.1,
      metalness: 0.9
    });
    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.7, 0), crystalMat);
    crystal.position.y = 4.8;
    cpGroup.add(crystal);

    // 5. Glowing Runic Ring
    const haloMat = new THREE.MeshBasicMaterial({ color: isActive ? 0x34d399 : 0xf87171 });
    const halo = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.08, 8, 20), haloMat);
    halo.position.y = 4.8;
    halo.rotation.x = Math.PI / 2;
    cpGroup.add(halo);

    // 6. Sky Beacon Light Column (Transparent glowing beam shooting up into the sky)
    const beamGeo = new THREE.CylinderGeometry(0.25, 0.25, 35, 12);
    const beamMat = new THREE.MeshBasicMaterial({
      color: isActive ? 0x34d399 : 0xf87171,
      transparent: true,
      opacity: isActive ? 0.35 : 0.15
    });
    const skyBeam = new THREE.Mesh(beamGeo, beamMat);
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
      haloMesh: halo,
      beamMesh: skyBeam,
      meshGroup: cpGroup
    };

    if (!game.currentLevel.checkpoints) game.currentLevel.checkpoints = [];
    game.currentLevel.checkpoints.push(cpData);

    animatedObjects.push({
      mesh: crystal,
      update: () => {
        crystal.rotation.y += 0.03;
        crystal.rotation.x += 0.015;
        halo.rotation.z += 0.035;
        banner.rotation.y = Math.sin(Date.now() * 0.004) * 0.15;
      }
    });

    return cpData;
  }

  function addExitPortal(game, scene, x, topY, z, targetRegion, title = "Sonraki Poneix Bölümü") {
    const THREE = window.THREE;
    const portalGroup = new THREE.Group();
    portalGroup.position.set(x, topY + 2.8, z);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.8, 0.6, 16, 36),
      new THREE.MeshStandardMaterial({
        color: 0x34d399,
        emissive: 0x10b981,
        emissiveIntensity: 0.9,
        metalness: 0.8
      })
    );
    portalGroup.add(ring);

    const vortex = new THREE.Mesh(
      new THREE.CircleGeometry(3.5, 32),
      new THREE.MeshBasicMaterial({
        color: 0x059669,
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
        color: 0x34d399,
        emissive: 0x059669,
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

  function addHoneyGem(game, scene, x, topY, z) {
    const THREE = window.THREE;
    const gem = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.85, 0),
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
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

  // --- 3D FOX (TİLKİ) MODEL BUILDER (BİPEDAL, KOKPİT PİLOTU) ---
  function create3DFoxModel(THREE) {
    const foxGroup = new THREE.Group();
    foxGroup.name = "cutscene_fox";

    const orangeMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.6 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
    const vestMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.3 });

    // Upright Torso
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.7, 1.1), orangeMat);
    body.position.y = 1.15;
    foxGroup.add(body);

    // Pilot Vest / Harness
    const vest = new THREE.Mesh(new THREE.BoxGeometry(1.36, 1.2, 1.16), vestMat);
    vest.position.set(0, 1.25, 0);
    foxGroup.add(vest);

    // White Chest Fur
    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.1, 0.15), whiteMat);
    chest.position.set(0, 1.2, 0.6);
    foxGroup.add(chest);

    // Head Group
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 2.3, 0.1);

    const head = new THREE.Mesh(new THREE.BoxGeometry(1.35, 1.15, 1.25), orangeMat);
    headGroup.add(head);

    // Cheeks
    const cheekL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.5, 0.6), whiteMat);
    cheekL.position.set(-0.68, -0.15, 0.2);
    headGroup.add(cheekL);
    const cheekR = cheekL.clone();
    cheekR.position.x = 0.68;
    headGroup.add(cheekR);

    // Pointy Fox Snout
    const snout = new THREE.Mesh(new THREE.ConeGeometry(0.48, 1.1, 8), whiteMat);
    snout.rotation.x = -Math.PI / 2;
    snout.position.set(0, -0.12, 0.95);
    headGroup.add(snout);

    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), blackMat);
    nose.position.set(0, 0.08, 1.5);
    headGroup.add(nose);

    // Cunning Eyes
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), eyeMat);
    eyeL.position.set(-0.35, 0.15, 0.65);
    headGroup.add(eyeL);
    const eyeR = eyeL.clone();
    eyeR.position.x = 0.35;
    headGroup.add(eyeR);

    // Long Pointy Ears with Black Tips
    const earL = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.95, 6), orangeMat);
    earL.position.set(-0.55, 0.85, 0);
    earL.rotation.z = 0.18;
    headGroup.add(earL);

    const earTipL = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.45, 6), blackMat);
    earTipL.position.set(-0.62, 1.12, 0);
    earTipL.rotation.z = 0.18;
    headGroup.add(earTipL);

    const earR = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.95, 6), orangeMat);
    earR.position.set(0.55, 0.85, 0);
    earR.rotation.z = -0.18;
    headGroup.add(earR);

    const earTipR = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.45, 6), blackMat);
    earTipR.position.set(0.62, 1.12, 0);
    earTipR.rotation.z = -0.18;
    headGroup.add(earTipR);

    foxGroup.add(headGroup);

    // Arms
    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.2, 0.42), orangeMat);
    armL.position.set(-0.85, 1.1, 0.1);
    foxGroup.add(armL);

    const pawL = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.35, 0.44), blackMat);
    pawL.position.set(-0.85, 0.4, 0.1);
    foxGroup.add(pawL);

    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.2, 0.42), orangeMat);
    armR.position.set(0.85, 1.1, 0.1);
    foxGroup.add(armR);

    const pawR = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.35, 0.44), blackMat);
    pawR.position.set(0.85, 0.4, 0.1);
    foxGroup.add(pawR);

    // Legs & Boots
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.85, 0.5), blackMat);
    legL.position.set(-0.38, 0.35, 0.05);
    foxGroup.add(legL);

    const legR = legL.clone();
    legR.position.x = 0.38;
    foxGroup.add(legR);

    // Bushy Fox Tail
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, 0.8, -0.6);

    const tailBase = new THREE.Mesh(new THREE.ConeGeometry(0.55, 1.8, 8), orangeMat);
    tailBase.rotation.x = -Math.PI / 3.2;
    tailBase.position.set(0, 0.5, -0.6);
    tailGroup.add(tailBase);

    const tailTip = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.75, 8), whiteMat);
    tailTip.rotation.x = -Math.PI / 3.2;
    tailTip.position.set(0, 1.1, -1.2);
    tailGroup.add(tailTip);

    foxGroup.add(tailGroup);

    return { foxGroup, headGroup, armL, armR, tailGroup };
  }

  // --- 3D CUTSCENE GRIZZY BEAR BUILDER ---
  function createCutsceneGrizzy(THREE) {
    const grizzyGroup = new THREE.Group();
    grizzyGroup.name = "cutscene_grizzy";

    const furMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
    const bellyMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.65 });
    const muzzleMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.5 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.2 });

    // Torso / Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.9, 1.4), furMat);
    body.position.y = 1.15;
    grizzyGroup.add(body);

    // Warm belly patch
    const belly = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.35, 0.2), bellyMat);
    belly.position.set(0, 1.1, 0.68);
    grizzyGroup.add(belly);

    // Head Group
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 2.3, 0.1);

    const head = new THREE.Mesh(new THREE.BoxGeometry(1.45, 1.35, 1.35), furMat);
    headGroup.add(head);

    // Snout / Muzzle
    const snout = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.6, 0.65), muzzleMat);
    snout.position.set(0, -0.15, 0.85);
    headGroup.add(snout);

    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), blackMat);
    nose.position.set(0, 0.05, 1.2);
    headGroup.add(nose);

    // Eyes
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), blackMat);
    eyeL.position.set(-0.35, 0.2, 0.72);
    headGroup.add(eyeL);
    const eyeR = eyeL.clone();
    eyeR.position.x = 0.35;
    headGroup.add(eyeR);

    // Ears
    const earL = new THREE.Mesh(new THREE.SphereGeometry(0.32, 8, 8), furMat);
    earL.position.set(-0.65, 0.7, 0);
    headGroup.add(earL);
    const earR = earL.clone();
    earR.position.x = 0.65;
    headGroup.add(earR);

    grizzyGroup.add(headGroup);

    // Arms
    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.48, 1.25, 0.48), furMat);
    armL.position.set(-1.05, 1.1, 0.1);
    grizzyGroup.add(armL);

    const armR = armL.clone();
    armR.position.x = 1.05;
    grizzyGroup.add(armR);

    // Feet
    const footL = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.4, 0.85), furMat);
    footL.position.set(-0.48, 0.2, 0.15);
    grizzyGroup.add(footL);

    const footR = footL.clone();
    footR.position.x = 0.48;
    grizzyGroup.add(footR);

    return { grizzyGroup, headGroup, armL, armR, body };
  }

  // --- 3D SPACESHIP COCKPIT INTERIOR BUILDER ---
  function createSpaceshipInterior(THREE) {
    const cabin = new THREE.Group();
    cabin.name = "spaceship_interior";

    // Ambient light inside cockpit
    const cabinAmbLight = new THREE.AmbientLight(0xffffff, 1.6);
    cabin.add(cabinAmbLight);

    const cabinDirLight = new THREE.DirectionalLight(0xe0f2fe, 1.8);
    cabinDirLight.position.set(0, 8, 4);
    cabin.add(cabinDirLight);

    // 1. Metallic Sci-Fi Floor
    const floorGeo = new THREE.BoxGeometry(18, 0.4, 24);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.85,
      roughness: 0.3
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(0, 0, 0);
    cabin.add(floor);

    // Neon floor runners
    const runnerMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    for (let z = -8; z <= 8; z += 4) {
      const runner = new THREE.Mesh(new THREE.BoxGeometry(16, 0.05, 0.18), runnerMat);
      runner.position.set(0, 0.22, z);
      cabin.add(runner);
    }
    const centerStripe = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 20), new THREE.MeshBasicMaterial({ color: 0x06b6d4 }));
    centerStripe.position.set(0, 0.22, 0);
    cabin.add(centerStripe);

    // 2. Bulkhead Walls & Ceiling
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.35 });

    // Left Bulkhead Wall
    const wallL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 7.0, 24), wallMat);
    wallL.position.set(-9.0, 3.5, 0);
    cabin.add(wallL);

    // Right Bulkhead Wall with airlock doorway
    const wallR_front = new THREE.Mesh(new THREE.BoxGeometry(0.8, 7.0, 10), wallMat);
    wallR_front.position.set(9.0, 3.5, -6.5);
    cabin.add(wallR_front);

    const wallR_back = new THREE.Mesh(new THREE.BoxGeometry(0.8, 7.0, 6), wallMat);
    wallR_back.position.set(9.0, 3.5, 8.5);
    cabin.add(wallR_back);

    // Rear Bulkhead Wall
    const wallBack = new THREE.Mesh(new THREE.BoxGeometry(18, 7.0, 0.8), wallMat);
    wallBack.position.set(0, 3.5, 12.0);
    cabin.add(wallBack);

    // Ceiling
    const ceiling = new THREE.Mesh(new THREE.BoxGeometry(18, 0.4, 24), wallMat);
    ceiling.position.set(0, 7.0, 0);
    cabin.add(ceiling);

    const overheadLight = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 18), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    overheadLight.position.set(0, 6.78, 0);
    cabin.add(overheadLight);

    // 3. Emergency Red Beacon Siren on Ceiling
    const beaconGroup = new THREE.Group();
    beaconGroup.position.set(0, 6.5, -3);
    const beaconDomeMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0x7f1d1d,
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: 0.85
    });
    const beaconDome = new THREE.Mesh(new THREE.SphereGeometry(0.65, 16, 16), beaconDomeMat);
    beaconGroup.add(beaconDome);
    cabin.add(beaconGroup);

    const emergencyLight = new THREE.PointLight(0xef4444, 0, 35);
    emergencyLight.position.set(0, 5.8, -3);
    cabin.add(emergencyLight);

    // 4. Front Cockpit Canopy & Viewport (Looking at Poneix & Space)
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.25,
      roughness: 0.1,
      metalness: 0.95
    });
    const windshield = new THREE.Mesh(new THREE.PlaneGeometry(17.5, 6.5), glassMat);
    windshield.position.set(0, 3.5, -11.9);
    cabin.add(windshield);

    const frameMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 });
    const strutL = new THREE.Mesh(new THREE.BoxGeometry(0.7, 7.0, 0.7), frameMat);
    strutL.position.set(-5.0, 3.5, -11.6);
    strutL.rotation.z = -0.15;
    cabin.add(strutL);
    const strutR = strutL.clone();
    strutR.position.x = 5.0;
    strutR.rotation.z = 0.15;
    cabin.add(strutR);

    // Outer Planet Poneix visible in space ahead
    const planetMesh = new THREE.Mesh(
      new THREE.SphereGeometry(26, 32, 32),
      new THREE.MeshStandardMaterial({
        color: 0x059669,
        emissive: 0x047857,
        emissiveIntensity: 0.5,
        roughness: 0.7
      })
    );
    planetMesh.position.set(8, 8, -55);
    cabin.add(planetMesh);

    // Distant Stars outside
    const starsGroup = new THREE.Group();
    for (let i = 0; i < 90; i++) {
      const star = new THREE.Mesh(new THREE.SphereGeometry(0.14, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      star.position.set(
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 50 + 6,
        -35 - Math.random() * 45
      );
      starsGroup.add(star);
    }
    cabin.add(starsGroup);

    // 5. Pilot Dashboard & Control Consoles
    const dash = new THREE.Mesh(new THREE.BoxGeometry(15.0, 1.4, 3.4), wallMat);
    dash.position.set(0, 1.25, -9.0);
    dash.rotation.x = -0.25;
    cabin.add(dash);

    // Glowing Dash Displays
    const screenMat1 = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const scr1 = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 1.2), screenMat1);
    scr1.position.set(-4.0, 1.6, -7.8);
    scr1.rotation.x = -0.45;
    cabin.add(scr1);

    const screenMat2 = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const scr2 = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 1.2), screenMat2);
    scr2.position.set(4.0, 1.6, -7.8);
    scr2.rotation.x = -0.45;
    cabin.add(scr2);

    // Chairs
    const chairMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.5 });
    const chairGrizzy = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.2, 1.8), chairMat);
    chairGrizzy.position.set(-3.5, 0.8, -4.5);
    cabin.add(chairGrizzy);

    const chairFox = chairGrizzy.clone();
    chairFox.position.x = 3.5;
    cabin.add(chairFox);

    // 6. Central Holographic Tablet Stand
    const tabletStand = new THREE.Group();
    tabletStand.position.set(0, 1.3, -6.6);

    const standPole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 1.3, 12), frameMat);
    standPole.position.y = 0.45;
    tabletStand.add(standPole);

    const tabletFrame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.6, 0.12), frameMat);
    tabletFrame.position.set(0, 1.25, 0);
    tabletFrame.rotation.x = -0.35;
    tabletStand.add(tabletFrame);

    const tabletScreenMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const tabletScreen = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 1.3), tabletScreenMat);
    tabletScreen.position.set(0, 1.25, 0.07);
    tabletScreen.rotation.x = -0.35;
    tabletStand.add(tabletScreen);

    cabin.add(tabletStand);

    // 7. Escape Pod Airlock Bay (Right Wall)
    const airlockBay = new THREE.Group();
    airlockBay.position.set(9.0, 0, 1.0);

    const hazardMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.4 });
    const hazardPlatform = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.42, 6.5), hazardMat);
    hazardPlatform.position.set(1.5, 0, 0);
    airlockBay.add(hazardPlatform);

    // The Escape Pod (Kaçış Kapsülü)
    const escapePodGroup = new THREE.Group();
    escapePodGroup.position.set(2.0, 2.2, 0);

    const podMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.85, roughness: 0.25 });
    const podHull = new THREE.Mesh(new THREE.CapsuleGeometry(1.15, 2.8, 8, 16), podMat);
    podHull.rotation.x = Math.PI / 2;
    escapePodGroup.add(podHull);

    const podCanopyMat = new THREE.MeshStandardMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.75, metalness: 0.9 });
    const podCanopy = new THREE.Mesh(new THREE.SphereGeometry(1.0, 16, 16), podCanopyMat);
    podCanopy.scale.set(0.9, 0.62, 1.35);
    podCanopy.position.set(0, 0.65, 0.55);
    escapePodGroup.add(podCanopy);

    const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.85, 1.1, 16), new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 }));
    nozzle.rotation.x = Math.PI / 2;
    nozzle.position.set(0, 0, -2.4);
    escapePodGroup.add(nozzle);

    const podFlame = new THREE.Mesh(new THREE.ConeGeometry(0.7, 3.2, 12), new THREE.MeshBasicMaterial({ color: 0xf97316 }));
    podFlame.rotation.x = -Math.PI / 2;
    podFlame.position.set(0, 0, -4.2);
    podFlame.visible = false;
    escapePodGroup.add(podFlame);

    airlockBay.add(escapePodGroup);
    cabin.add(airlockBay);

    // Cabin Interior Spotlight
    const cabinLight = new THREE.PointLight(0x38bdf8, 2.8, 38);
    cabinLight.position.set(0, 4.8, -2);
    cabin.add(cabinLight);

    return {
      cabin,
      planetMesh,
      tabletStand,
      tabletScreen,
      tabletScreenMat,
      screenMat1,
      screenMat2,
      escapePodGroup,
      podFlame,
      beaconDomeMat,
      emergencyLight,
      cabinLight
    };
  }

  // --- 3D FALLING SPACESHIP (EXTERIOR SHOT DÜŞÜŞ MODELİ) ---
  function createFallingSpaceship(THREE) {
    const ship = new THREE.Group();
    ship.name = "falling_spaceship";

    const hullMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.3 });
    const cone = new THREE.Mesh(new THREE.ConeGeometry(3.2, 11.0, 16), hullMat);
    cone.rotation.x = Math.PI / 2 + 0.3; // plunging nose-down
    ship.add(cone);

    const glassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.85 });
    const canopy = new THREE.Mesh(new THREE.SphereGeometry(1.6, 16, 16), glassMat);
    canopy.position.set(0, 1.2, 1.0);
    canopy.scale.set(0.85, 0.65, 1.5);
    ship.add(canopy);

    const wingMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 });
    const wingL = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.25, 3.5), wingMat);
    wingL.position.set(-3.5, 0.2, -1.0);
    wingL.rotation.y = 0.25;
    ship.add(wingL);

    const wingR = wingL.clone();
    wingR.position.x = 3.5;
    wingR.rotation.y = -0.25;
    ship.add(wingR);

    // Roaring engine fire & black smoke trail
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
    const flame = new THREE.Mesh(new THREE.ConeGeometry(1.6, 6.5, 12), flameMat);
    flame.rotation.x = -Math.PI / 2 + 0.3;
    flame.position.set(0, 0, -8.0);
    ship.add(flame);

    const smokeGroup = new THREE.Group();
    const smokeMat = new THREE.MeshBasicMaterial({ color: 0x1e293b, transparent: true, opacity: 0.8 });
    for (let s = 0; s < 5; s++) {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(1.4 + s * 0.4, 8, 8), smokeMat);
      puff.position.set((Math.random() - 0.5) * 1.5, s * 1.2, -9.0 - s * 2.8);
      smokeGroup.add(puff);
    }
    ship.add(smokeGroup);

    return { ship, flame, smokeGroup };
  }

  // --- 3D CRASHED SPACESHIP WRECKAGE (SUPER BEAR ADVENTURE ENKAZI) ---
  function createCrashedWreckage(THREE) {
    const wreck = new THREE.Group();
    wreck.name = "crashed_spaceship_wreckage";
    wreck.position.set(0, 0.1, -8.0);

    const hullMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.4 });
    const brokenMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.6 });
    const scorchMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.95 });

    // Blast crater ground scorch
    const blastCrater = new THREE.Mesh(new THREE.CylinderGeometry(8.5, 10.0, 0.25, 24), scorchMat);
    blastCrater.position.set(0, 0.1, 0);
    wreck.add(blastCrater);

    // Broken fuselage half-buried in the crater ground
    const mainHull = new THREE.Mesh(new THREE.ConeGeometry(3.2, 9.5, 12), hullMat);
    mainHull.rotation.set(-Math.PI / 3.2, 0.3, 0.4);
    mainHull.position.set(0, 2.2, 0);
    wreck.add(mainHull);

    // Cockpit broken glass frame
    const brokenGlassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3, transparent: true, opacity: 0.45 });
    const glass = new THREE.Mesh(new THREE.SphereGeometry(1.4, 8, 8), brokenGlassMat);
    glass.position.set(0.5, 2.4, 1.2);
    wreck.add(glass);

    // Broken snapped wing
    const wingSnap = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.35, 2.6), brokenMat);
    wingSnap.rotation.set(0.4, 0.6, -0.6);
    wingSnap.position.set(-4.5, 1.1, 1.2);
    wreck.add(wingSnap);

    // Fractured smoking engine
    const engine = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.5, 3.2, 12), brokenMat);
    engine.rotation.set(Math.PI / 2.3, 0.3, -0.4);
    engine.position.set(3.8, 1.0, -1.0);
    wreck.add(engine);

    // Glowing embers inside the engine
    const emberMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
    const ember = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 8), emberMat);
    ember.position.set(3.8, 1.0, 0.6);
    wreck.add(ember);

    const emberLight = new THREE.PointLight(0xf97316, 2.5, 18);
    emberLight.position.set(0, 2.5, 0);
    wreck.add(emberLight);

    return wreck;
  }

  // --- AUDIO SYNTHESIZER FOR CUTSCENE (BEAT, BEEP & SIRENS) ---
  function playCutsceneTone(freq = 660, dur = 0.12, type = 'sine') {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!window.__poneixAudioCtx) window.__poneixAudioCtx = new AudioCtx();
      const ctx = window.__poneixAudioCtx;
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

  // --- CUTSCENE RUNNER (SPACESHIP INTERIOR, FOX DIALOGUE, CRASH & SUPER BEAR ADVENTURE WAKE-UP) ---
  function playFoxCrashAnimation(game, onComplete) {
    if (!game || !game.scene || !window.THREE) {
      if (onComplete) onComplete();
      return;
    }

    const THREE = window.THREE;
    isCutscenePlaying = true;
    cutsceneObjects = [];

    // Reset blackout and flash overlays
    if (blackoutOverlay) {
      blackoutOverlay.style.opacity = '0';
      blackoutOverlay.style.transition = 'opacity 0.4s ease-in-out';
    }
    if (flashOverlay) flashOverlay.style.opacity = '0';

    // Show cutscene container HUD
    cutsceneContainer.style.display = 'block';

    const tabletModal = document.getElementById('cutscene-tablet-modal');
    const tabletCountdownDigit = document.getElementById('tablet-countdown-digit');
    const subBox = document.getElementById('cutscene-subtitle-box');
    const avatarBox = document.getElementById('cutscene-avatar-box');
    const speakerBadge = document.getElementById('cutscene-speaker-badge');
    const progressBar = document.getElementById('cutscene-progress-bar');
    const bottomBar = document.getElementById('cutscene-bottom-bar');

    if (tabletModal) tabletModal.style.display = 'none';

    // Root cutscene 3D group for cockpit interior (high in the sky, far from ground)
    const cutsceneGroup = new THREE.Group();
    cutsceneGroup.name = "poneix_cutscene_group";
    cutsceneGroup.position.set(0, 120, -100);
    game.scene.add(cutsceneGroup);
    cutsceneObjects.push(cutsceneGroup);

    // Build the Spaceship Bridge Interior
    const interior = createSpaceshipInterior(THREE);
    cutsceneGroup.add(interior.cabin);

    // Build Grizzy (The Player Bear) inside Cockpit
    const grizzy = createCutsceneGrizzy(THREE);
    grizzy.grizzyGroup.position.set(-2.4, 0.2, -4.5);
    grizzy.grizzyGroup.rotation.y = 0.4;
    interior.cabin.add(grizzy.grizzyGroup);

    // Build the Fox (Tilki) standing inside Cockpit
    const fox = create3DFoxModel(THREE);
    fox.foxGroup.position.set(2.4, 0.2, -4.5);
    fox.foxGroup.rotation.y = -0.5;
    interior.cabin.add(fox.foxGroup);

    // Build Falling Spaceship for exterior crash shot (initially hidden)
    const falling = createFallingSpaceship(THREE);
    falling.ship.visible = false;
    game.scene.add(falling.ship);
    cutsceneObjects.push(falling.ship);

    // Hide normal gameplay player bear during cutscene
    if (game.playerBear && game.playerBear.root) {
      game.playerBear.root.visible = false;
    }

    // Camera targets for cutscene director
    const cutsceneCamTarget = {
      pos: new THREE.Vector3(0, 123.6, -97.5),
      look: new THREE.Vector3(0, 122.2, -106.0)
    };

    // --- CRUCIAL CAMERA HOOK: OVERRIDE game.update CAMERA SO IT NEVER LERPS TO CRATER FLOOR ---
    const origGameUpdate = game.update;
    game.update = function(delta, time) {
      if (isCutscenePlaying) {
        if (this.inputs) {
          this.inputs.forward = false;
          this.inputs.backward = false;
          this.inputs.left = false;
          this.inputs.right = false;
          this.inputs.jump = false;
          this.inputs.attack = false;
          this.inputs.roll = false;
        }
        if (typeof this.joystickX !== 'undefined') this.joystickX = 0;
        if (typeof this.joystickY !== 'undefined') this.joystickY = 0;
        if (this.playerVel) this.playerVel.set(0, 0, 0);
        if (this.playerBear && this.playerBear.root) {
          this.playerBear.root.visible = false;
        }
      }

      // Run normal updates
      origGameUpdate.call(this, delta, time);

      // Enforce cutscene camera angles directly before render
      if (isCutscenePlaying && this.camera && cutsceneCamTarget.pos && cutsceneCamTarget.look) {
        this.camera.position.copy(cutsceneCamTarget.pos);
        if (poneixCameraShake > 0) {
          this.camera.position.x += (Math.random() - 0.5) * poneixCameraShake;
          this.camera.position.y += (Math.random() - 0.5) * poneixCameraShake;
          this.camera.position.z += (Math.random() - 0.5) * poneixCameraShake;
        }
        this.camera.lookAt(cutsceneCamTarget.look.x, cutsceneCamTarget.look.y, cutsceneCamTarget.look.z);
      }
    };

    let lastBeepSec = -1;

    // --- TIMELINE OF THE CINEMATIC (SUPER BEAR ADVENTURE DIRECTED) ---
    const steps = [
      // Adım 1: Kokpit İçi - Grizzy konuşur (Yakın Çekim)
      {
        duration: 7.0,
        avatar: '🐻',
        speaker: '🐻 GRIZZY (PİLOT)',
        speakerColor: '#34d399',
        badgeBg: 'rgba(16, 185, 129, 0.15)',
        borderColor: '#10b981',
        text: "<span style='color:#f8fafc; font-size:19px; font-weight:800;'>\"Tilki! Motorlardan çok tuhaf sesler geliyor ve rota göstergeleri kilitlendi! Neler oluyor orada, bir baksana?!\"</span>",
        onStart: () => {
          if (tabletModal) tabletModal.style.display = 'none';
          cutsceneCamTarget.pos.set(-0.8, 122.8, -101.5);
          cutsceneCamTarget.look.set(-2.4, 122.0, -104.5);
          if (window.St && window.St.playDialogueChirp) window.St.playDialogueChirp();
          playCutsceneTone(480, 0.15, 'sine');
        },
        onTick: (t) => {
          grizzy.headGroup.rotation.y = Math.sin(t * 3.0) * 0.25;
          grizzy.armR.rotation.x = Math.sin(t * 3.5) * 0.45 - 0.3;
          fox.tailGroup.rotation.z = Math.sin(t * 4.0) * 0.3;
        }
      },
      // Adım 2: Kokpit İçi - Tilki konuşur (Tilki Yakın Çekim)
      {
        duration: 6.8,
        avatar: '🦊',
        speaker: '🦊 TİLKİ (KURNAZ HIRSIZ)',
        speakerColor: '#fb923c',
        badgeBg: 'rgba(249, 115, 22, 0.15)',
        borderColor: '#f97316',
        text: "<span style='color:#f8fafc; font-size:19px; font-weight:800;'>\"Hehe... Merak etme koca ayı, her şey tıkır tıkır işliyor! Hatta tam da planladığım gibi...\"</span>",
        onStart: () => {
          cutsceneCamTarget.pos.set(0.8, 122.8, -101.5);
          cutsceneCamTarget.look.set(2.4, 122.0, -104.5);
          if (window.St && window.St.playDialogueChirp) window.St.playDialogueChirp();
          playCutsceneTone(580, 0.15, 'sine');
        },
        onTick: (t) => {
          fox.headGroup.rotation.y = Math.sin(t * 3.0) * 0.25 - 0.2;
          fox.tailGroup.rotation.z = Math.sin(t * 7.0) * 0.5;
          fox.armL.rotation.x = Math.sin(t * 4.0) * 0.3;
        }
      },
      // Adım 3: Kokpit Geniş Çekim - Grizzy şaşkınlık ve öfkeyle uyarır
      {
        duration: 7.0,
        avatar: '🐻',
        speaker: '🐻 GRIZZY (ŞAŞKIN)',
        speakerColor: '#34d399',
        badgeBg: 'rgba(16, 185, 129, 0.15)',
        borderColor: '#10b981',
        text: "<span style='color:#f8fafc; font-size:19px; font-weight:800;'>\"Ne planı?! Geminin kontrol panelini neden kilitledin?! Rotayı Poneix atmosferine doğru çevirmişsin!\"</span>",
        onStart: () => {
          cutsceneCamTarget.pos.set(0, 123.5, -98.0);
          cutsceneCamTarget.look.set(0, 122.0, -105.0);
          if (window.St && window.St.playDialogueChirp) window.St.playDialogueChirp();
          playCutsceneTone(440, 0.18, 'sawtooth');
        },
        onTick: (t) => {
          grizzy.armL.rotation.x = -0.8 + Math.sin(t * 4) * 0.3;
          grizzy.armR.rotation.x = -0.8 + Math.sin(t * 4 + 1) * 0.3;
          fox.foxGroup.rotation.y = -0.5 + Math.sin(t * 2) * 0.15;
        }
      },
      // Adım 4: Tilki gerçeği itiraf eder (Hain Tebessüm)
      {
        duration: 7.5,
        avatar: '🦊',
        speaker: '🦊 TİLKİ (HAİN PLAN)',
        speakerColor: '#fb923c',
        badgeBg: 'rgba(249, 115, 22, 0.15)',
        borderColor: '#f97316',
        text: "<span style='color:#f8fafc; font-size:19px; font-weight:800;'>\"Dünya'daki 14 büyük patronun tüm güç çekirdeklerini bu gemide topladım! Poneix'teki o kadim füzyon gücünü tek başıma ele geçireceğim! Seninle işim bitti koca ayı!\"</span>",
        onStart: () => {
          cutsceneCamTarget.pos.set(1.0, 122.8, -102.0);
          cutsceneCamTarget.look.set(2.4, 122.0, -104.5);
          if (window.St && window.St.playDialogueChirp) window.St.playDialogueChirp();
          playCutsceneTone(620, 0.18, 'triangle');
        },
        onTick: (t) => {
          fox.headGroup.rotation.y = Math.sin(t * 4) * 0.3;
          fox.tailGroup.rotation.z = Math.sin(t * 8) * 0.6;
          fox.armR.rotation.x = -0.7 + Math.sin(t * 5) * 0.2;
        }
      },
      // Adım 5: Kokpit Tableti & 5 Saniyelik Acil Geri Sayım
      {
        duration: 6.0,
        avatar: '📱',
        speaker: '🚨 KOKPİT TABLETİ & ACİL ALARM PROTOKOLÜ',
        speakerColor: '#ef4444',
        badgeBg: 'rgba(239, 68, 68, 0.25)',
        borderColor: '#ef4444',
        text: "<span style='color:#fef2f2; font-size:20px; font-weight:900;'>\"⚠️ DİKKAT: GEMİ YERYÜZÜNE 5 SANİYE SONRA ÇAKILACAK!\"</span><br><span style='color:#fca5a5; font-size:15px; font-weight:700;'>İtici reaktörler aşırı yüklendi! Çarpışmaya son saniyeler!</span>",
        onStart: () => {
          cutsceneCamTarget.pos.set(0, 122.8, -103.8);
          cutsceneCamTarget.look.set(0, 122.0, -106.6);
          if (tabletModal) {
            tabletModal.style.display = 'block';
            tabletModal.style.transform = 'translate(-50%, -50%) scale(1)';
          }
          interior.tabletScreenMat.color.setHex(0xef4444);
          interior.screenMat1.color.setHex(0xef4444);
          interior.screenMat2.color.setHex(0xef4444);
          playCutsceneTone(880, 0.35, 'square');
          if (window.St && window.St.playDamage) window.St.playDamage();
        },
        onTick: (t) => {
          // Sirens flashing and rotating
          const flashPhase = Math.sin(t * 14);
          interior.emergencyLight.intensity = flashPhase > 0 ? 4.0 : 0.2;
          interior.beaconDomeMat.emissiveIntensity = flashPhase > 0 ? 1.2 : 0.1;

          // Tablet countdown logic from 5 down to 1
          const remainingSec = Math.max(1, Math.ceil(5.2 - t));
          if (tabletCountdownDigit) {
            tabletCountdownDigit.innerText = remainingSec;
          }

          if (remainingSec !== lastBeepSec) {
            lastBeepSec = remainingSec;
            playCutsceneTone(remainingSec === 1 ? 1100 : 780, 0.14, 'square');
            poneixCameraShake = 0.8;
          }

          // Planet gets visibly closer outside windshield
          interior.planetMesh.position.z += 0.12;
        }
      },
      // Adım 6: Tilki Kaçış Kapsülüne biner ("Görüşürüz ezik hahaha") & Fırlar
      {
        duration: 5.5,
        avatar: '🦊',
        speaker: '🦊 TİLKİ (KAÇIŞ KAPSÜLÜ)',
        speakerColor: '#fb923c',
        badgeBg: 'rgba(249, 115, 22, 0.25)',
        borderColor: '#f97316',
        text: "<span style='color:#f8fafc; font-size:22px; font-weight:900;'>\"Görüşürüz ezik hahaha!\"</span><br><span style='color:#fdba74; font-size:15px; font-weight:700;'>Tilki kaçış kapsülünün kapağını kilitledi ve iticileri ateşledi!</span>",
        onStart: () => {
          if (tabletModal) tabletModal.style.display = 'none';
          cutsceneCamTarget.pos.set(4.0, 123.5, -97.0);
          cutsceneCamTarget.look.set(10.0, 122.2, -100.5);

          // Move fox into the escape capsule window
          fox.foxGroup.position.set(10.5, 2.2, 0.8);
          fox.foxGroup.rotation.y = -Math.PI / 2;
          fox.foxGroup.scale.set(0.5, 0.5, 0.5);
          interior.podFlame.visible = true;

          playCutsceneTone(740, 0.2, 'sawtooth');
          if (window.St && window.St.playDialogueChirp) window.St.playDialogueChirp();
        },
        onTick: (t) => {
          interior.podFlame.scale.y = 1.0 + Math.sin(t * 20) * 0.3;
          if (t > 1.8) {
            interior.escapePodGroup.position.x += 0.35;
            interior.escapePodGroup.position.z -= 0.45;
            interior.escapePodGroup.position.y += 0.12;
            fox.foxGroup.position.copy(interior.escapePodGroup.position);
            fox.foxGroup.position.x += 8.5;
          }
        }
      },
      // Adım 7: Kokpit Kontrolden Çıkar & Düşüşe Geçer
      {
        duration: 3.5,
        avatar: '🐻',
        speaker: '🐻 GRIZZY (PANİK)',
        speakerColor: '#ef4444',
        badgeBg: 'rgba(239, 68, 68, 0.25)',
        borderColor: '#ef4444',
        text: "<span style='color:#fef2f2; font-size:22px; font-weight:900;'>\"HAYIR! KONTROLLER KİLİTLİ! DÜŞÜYORUZZZZ! TUTUNMAM LAZIM!\"</span>",
        onStart: () => {
          cutsceneCamTarget.pos.set(0, 123.0, -100.0);
          cutsceneCamTarget.look.set(0, 122.0, -107.0);
          poneixCameraShake = 2.5;
          playCutsceneTone(320, 0.4, 'sawtooth');
          if (window.St && window.St.playDamage) window.St.playDamage();
        },
        onTick: (t) => {
          grizzy.armL.rotation.x = -1.5 + Math.sin(t * 12) * 0.4;
          grizzy.armR.rotation.x = -1.5 + Math.sin(t * 12 + 1) * 0.4;
          poneixCameraShake = 2.0;
        }
      },
      // Adım 8: ÇARPIŞMA ANI (DIŞ KAMERA - GEMİNİN KRATERE ÇAKILMASI!)
      {
        duration: 3.2,
        avatar: '💥',
        speaker: '💥 ÇARPIŞMA & İNFİLAK',
        speakerColor: '#f59e0b',
        badgeBg: 'rgba(245, 158, 11, 0.25)',
        borderColor: '#f59e0b',
        text: "<span style='color:#fef3c7; font-size:24px; font-weight:900;'>💥 BÜYÜK PATLAMA!</span><br><span style='color:#fed7aa; font-size:16px; font-weight:700;'>Uzay gemisi Poneix kraterine şiddetle çakıldı!</span>",
        onStart: () => {
          // Switch to Level 1 Crater exterior view!
          interior.cabin.visible = false;
          falling.ship.visible = true;
          falling.ship.position.set(0, 65, -15);

          cutsceneCamTarget.pos.set(0, 18.0, 24.0);
          cutsceneCamTarget.look.set(0, 2.0, -6.0);
        },
        onTick: (t) => {
          // Ship plummets from the sky towards the crater
          if (t < 1.8) {
            const pct = t / 1.8;
            falling.ship.position.y = 65 - pct * 63.5;
            falling.ship.position.z = -15 + pct * 9.0;
            falling.ship.rotation.z = Math.sin(t * 8) * 0.3;
          } else if (t >= 1.8 && falling.ship.visible) {
            // Impact moment!
            falling.ship.visible = false;
            triggerExplosionFlash();
            poneixCameraShake = 8.0;

            // Spawn permanent wreckage in the crater
            const wreckage = createCrashedWreckage(THREE);
            game.scene.add(wreckage);
            if (poneixSceneGroup) poneixSceneGroup.add(wreckage);

            if (window.St && window.St.playHammerSlam) window.St.playHammerSlam();
            if (window.St && window.St.playBossRoar) window.St.playBossRoar();
            playCutsceneTone(100, 0.8, 'sawtooth');
          }
        }
      },
      // Adım 9: Ekran 3 Saniyeliğine Kararır (Blackout)
      {
        duration: 3.0,
        avatar: '🌑',
        speaker: '🌑 KARANLIK & SESSİZLİK',
        speakerColor: '#94a3b8',
        badgeBg: 'rgba(15, 23, 42, 0.6)',
        borderColor: '#475569',
        text: "<span style='color:#cbd5e1; font-size:18px; font-weight:700; font-style:italic;'>...(Bilinç kararır... 3 saniyelik derin bir sessizlik)...</span>",
        onStart: () => {
          if (blackoutOverlay) {
            blackoutOverlay.style.transition = 'opacity 0.25s ease-in';
            blackoutOverlay.style.opacity = '1';
          }
          if (bottomBar) bottomBar.style.opacity = '0.7';

          // Move cutscene Grizzy down to the ground of Level 1 crater, lying knocked out
          cutsceneGroup.position.set(0, 0, 0);
          grizzy.grizzyGroup.position.set(0, 0.35, 0);
          grizzy.grizzyGroup.rotation.set(-Math.PI / 2, 0, 0.3); // lying down
          fox.foxGroup.visible = false;

          // Position camera at ground level in front of Grizzy
          cutsceneCamTarget.pos.set(0, 2.2, 5.8);
          cutsceneCamTarget.look.set(0, 1.1, 0);
        },
        onTick: (t) => {
          if (blackoutOverlay) blackoutOverlay.style.opacity = '1';
        }
      },
      // Adım 10: Uyanış (Super Bear Adventure Tarzı - "Burası da neresi... Neyse, hadi başlayalım!")
      {
        duration: 7.5,
        avatar: '🐻',
        speaker: '🐻 GRIZZY (UYANDI)',
        speakerColor: '#34d399',
        badgeBg: 'rgba(16, 185, 129, 0.25)',
        borderColor: '#34d399',
        text: "<span style='color:#f8fafc; font-size:21px; font-weight:900;'>\"Burası da neresi... Neyse, hadi başlayalım!\"</span><br><span style='color:#a7f3d0; font-size:15px; font-weight:700;'>Grizzy kraterdeki enkazın içinden ayağa kalktı. Macera ve intikam başlıyor!</span>",
        onStart: () => {
          // Fade in smoothly from blackout
          if (blackoutOverlay) {
            blackoutOverlay.style.transition = 'opacity 1.6s ease-out';
            blackoutOverlay.style.opacity = '0';
          }
          if (bottomBar) bottomBar.style.opacity = '1';

          cutsceneCamTarget.pos.set(0, 2.2, 5.8);
          cutsceneCamTarget.look.set(0, 1.1, 0);

          if (window.St && window.St.playDialogueChirp) window.St.playDialogueChirp();
          playCutsceneTone(520, 0.25, 'sine');
        },
        onTick: (t) => {
          // Super Bear Adventure wake-up animation:
          // 0 - 2.5s: rolls over, sits up, rubs dizzy head with arm
          // 2.5s+: stands upright on feet, shakes off dust
          if (t < 2.5) {
            const wakePct = t / 2.5;
            grizzy.grizzyGroup.rotation.x = -Math.PI / 2 + wakePct * (Math.PI / 2);
            grizzy.grizzyGroup.position.y = 0.35 + wakePct * 0.65;
            grizzy.armL.rotation.x = -1.3; // rubbing head
            grizzy.headGroup.rotation.z = Math.sin(t * 6) * 0.2; // dizzy wobble
          } else {
            grizzy.grizzyGroup.rotation.x = 0;
            grizzy.grizzyGroup.position.y = 1.0;
            grizzy.armL.rotation.x = Math.sin(t * 3) * 0.25;
            grizzy.armR.rotation.x = Math.sin(t * 3 + 1) * 0.25;
            grizzy.headGroup.rotation.y = Math.sin(t * 2) * 0.3;
          }
        }
      }
    ];

    let currentStepIdx = 0;
    let stepTime = 0;

    function advanceToNextStep() {
      if (!isCutscenePlaying) return;
      currentStepIdx++;
      stepTime = 0;
      if (currentStepIdx >= steps.length) {
        endCutsceneAndStartGame();
      } else {
        setupStepUI(steps[currentStepIdx]);
      }
    }

    cutsceneAdvanceFn = advanceToNextStep;

    const onKeyDown = (e) => {
      if (isCutscenePlaying) {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          e.stopPropagation();
          advanceToNextStep();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown, true);

    function setupStepUI(step) {
      if (!step) return;
      if (subBox) subBox.innerHTML = step.text;
      if (avatarBox) {
        avatarBox.innerHTML = step.avatar;
        avatarBox.style.borderColor = step.borderColor;
        avatarBox.style.boxShadow = `0 0 20px ${step.borderColor}66`;
      }
      if (speakerBadge) {
        speakerBadge.innerText = step.speaker;
        speakerBadge.style.color = step.speakerColor;
        speakerBadge.style.backgroundColor = step.badgeBg;
        speakerBadge.style.padding = '4px 12px';
        speakerBadge.style.borderRadius = '8px';
      }
      if (progressBar) progressBar.style.width = '0%';
      if (step.onStart) step.onStart();
    }

    // Initialize first step
    setupStepUI(steps[0]);

    function cutsceneLoop() {
      if (!isCutscenePlaying) return;
      const current = steps[currentStepIdx];
      if (!current) {
        endCutsceneAndStartGame();
        return;
      }

      stepTime += 0.016;
      if (progressBar) {
        const pct = Math.min(100, (stepTime / current.duration) * 100);
        progressBar.style.width = `${pct}%`;
      }

      if (current.onTick) current.onTick(stepTime);

      if (stepTime >= current.duration) {
        currentStepIdx++;
        stepTime = 0;
        if (currentStepIdx >= steps.length) {
          endCutsceneAndStartGame();
          return;
        } else {
          setupStepUI(steps[currentStepIdx]);
        }
      }

      if (isCutscenePlaying) {
        requestAnimationFrame(cutsceneLoop);
      }
    }

    requestAnimationFrame(cutsceneLoop);

    window.__endPoneixCutscene = () => {
      endCutsceneAndStartGame();
    };

    function endCutsceneAndStartGame() {
      isCutscenePlaying = false;
      cutsceneAdvanceFn = null;
      window.removeEventListener('keydown', onKeyDown, true);

      // Restore original game.update
      game.update = origGameUpdate;

      // Hide all overlays
      if (cutsceneContainer) cutsceneContainer.style.display = 'none';
      if (tabletModal) tabletModal.style.display = 'none';
      if (blackoutOverlay) blackoutOverlay.style.opacity = '0';
      if (flashOverlay) flashOverlay.style.opacity = '0';

      // Clean up 3D cutscene group
      if (cutsceneGroup.parent) cutsceneGroup.parent.remove(cutsceneGroup);
      if (falling.ship.parent) falling.ship.parent.remove(falling.ship);

      // Ensure persistent wreckage in the crater
      if (!game.scene.getObjectByName("crashed_spaceship_wreckage")) {
        const wreckage = createCrashedWreckage(THREE);
        game.scene.add(wreckage);
        if (poneixSceneGroup) poneixSceneGroup.add(wreckage);
      }

      // Restore full player bear & controls
      if (game.playerBear && game.playerBear.root) {
        game.playerBear.root.visible = true;
      }
      if (game.playerPos) game.playerPos.set(0, 1.0, 0);
      if (game.playerVel) game.playerVel.set(0, 0, 0);

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

      // Reset camera to standard game follow position
      if (game.camera) {
        game.camera.position.set(0, 3.5, 7.5);
        game.camera.lookAt(0, 1.5, 0);
      }

      if (game.callbacks && game.callbacks.onShowNotice) {
        game.callbacks.onShowNotice("🎮 Kontroller sende! Kraterdeki enkazı arkanda bırakıp Poneix Vadisi'ni keşfet!", "success");
      }

      if (onComplete) onComplete();
    }
  }

  // --- 14-BOSS CHIMERA TITAN 3D MODEL BUILDER ---
  function create14BossChimeraModel(THREE) {
    const chimera = new THREE.Group();
    const dinoMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 });
    const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 4.0, 4.5, 12), dinoMat);
    pelvis.position.y = 5.0;
    chimera.add(pelvis);

    const legL = new THREE.Mesh(new THREE.BoxGeometry(1.8, 5.5, 2.2), dinoMat);
    legL.position.set(-2.8, 2.75, 0);
    chimera.add(legL);

    const legR = legL.clone();
    legR.position.x = 2.8;
    chimera.add(legR);

    const magmaMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xd97706,
      emissiveIntensity: 0.7,
      roughness: 0.4
    });
    const chest = new THREE.Mesh(new THREE.BoxGeometry(6.5, 6.0, 5.0), magmaMat);
    chest.position.set(0, 9.5, 0);
    chimera.add(chest);

    const hornMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.3 });
    const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.8, 3.8, 8), hornMat);
    hornL.position.set(-2.2, 14.5, 0.5);
    hornL.rotation.z = -0.5;
    hornL.rotation.x = -0.3;
    chimera.add(hornL);

    const hornR = hornL.clone();
    hornR.position.x = 2.2;
    hornR.rotation.z = 0.5;
    chimera.add(hornR);

    const wingMat = new THREE.MeshStandardMaterial({ color: 0xd97706, side: THREE.DoubleSide, metalness: 0.5 });
    const wingGroupL = new THREE.Group();
    wingGroupL.position.set(-3.2, 11.5, -2.0);
    const wingMeshL = new THREE.Mesh(new THREE.BoxGeometry(10.0, 0.3, 5.5), wingMat);
    wingMeshL.position.x = -4.5;
    wingGroupL.add(wingMeshL);
    chimera.add(wingGroupL);

    const wingGroupR = new THREE.Group();
    wingGroupR.position.set(3.2, 11.5, -2.0);
    const wingMeshR = new THREE.Mesh(new THREE.BoxGeometry(10.0, 0.3, 5.5), wingMat);
    wingMeshR.position.x = 4.5;
    wingGroupR.add(wingMeshR);
    chimera.add(wingGroupR);

    const stingerMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xeab308,
      emissiveIntensity: 0.9
    });
    const stinger = new THREE.Mesh(new THREE.ConeGeometry(1.2, 4.5, 8), stingerMat);
    stinger.rotation.x = -Math.PI / 2.2;
    stinger.position.set(0, 4.2, -4.8);
    chimera.add(stinger);

    const candyMat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.3 });
    const candyHammerArm = new THREE.Group();
    candyHammerArm.position.set(3.8, 9.5, 1.2);
    const armBar = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 6.0, 8), candyMat);
    armBar.rotation.x = Math.PI / 3;
    candyHammerArm.add(armBar);

    const candyHead = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 3.2, 16), candyMat);
    candyHead.position.set(0, -2.5, 2.5);
    candyHammerArm.add(candyHead);
    chimera.add(candyHammerArm);

    const iceMat = new THREE.MeshStandardMaterial({ color: 0x93c5fd, roughness: 0.1, transparent: true, opacity: 0.85 });
    for (let i = 0; i < 5; i++) {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.7, 3.0, 6), iceMat);
      spike.position.set(0, 7.5 + i * 1.3, -2.8);
      spike.rotation.x = -0.5;
      chimera.add(spike);
    }

    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.8, metalness: 0.9 });
    const halo = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.35, 12, 24), goldMat);
    halo.position.set(0, 15.5, 0);
    halo.rotation.x = Math.PI / 2;
    chimera.add(halo);

    const mask = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.5, 0.6), new THREE.MeshStandardMaterial({ color: 0xfef08a }));
    mask.position.set(0, 12.5, 2.6);
    chimera.add(mask);

    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    eyeL.position.set(-0.7, 12.7, 3.0);
    chimera.add(eyeL);

    const eyeR = eyeL.clone();
    eyeR.position.x = 0.7;
    chimera.add(eyeR);

    const orbGroup = new THREE.Group();
    const orbMat = new THREE.MeshBasicMaterial({ color: 0xa855f7 });
    for (let o = 0; o < 3; o++) {
      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.8, 12, 12), orbMat);
      const angle = (o / 3) * Math.PI * 2;
      orb.position.set(Math.sin(angle) * 5.5, 11.0, Math.cos(angle) * 5.5);
      orbGroup.add(orb);
    }
    chimera.add(orbGroup);

    return {
      chimeraGroup: chimera,
      wingGroupL,
      wingGroupR,
      candyHammerArm,
      orbGroup,
      halo
    };
  }

  // --- 7 DEVASA, ÇOK UZUN VE ZORLU PONEİX GEZEGENİ BÖLÜMÜ (ANTİK SU ALTI SARAYI DERİNLİĞİNDE) ---

  // LEVEL 1: Poneix Çarpışma Vadisi & Magma Yarığı 💥 (850 METRE KESİNTİSİZ PARKURLU VADİ)
  function buildPoneixLevel1(game, scene) {
    const THREE = window.THREE;

    // AŞAMA 1: Orijinal Krater Başlangıç Alanı (Z = 0, topY = 0)
    const craterMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.85 });
    const craterFloor = new THREE.Mesh(new THREE.CylinderGeometry(28, 30, 3, 32), craterMat);
    craterFloor.position.set(0, -1.5, 0);
    scene.add(craterFloor);
    addBoxCollider(game, -28, -3, -28, 28, 0, 28);

    // Duman tüten uzay aracı enkazı
    const wreckMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
    const wingWreck = new THREE.Mesh(new THREE.BoxGeometry(12, 0.4, 5), wreckMat);
    wingWreck.position.set(-8, 1.2, 5);
    wingWreck.rotation.set(0.3, 0.4, 0.5);
    scene.add(wingWreck);

    const engineWreck = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2.0, 4, 16), wreckMat);
    engineWreck.position.set(6, 1.5, -4);
    engineWreck.rotation.z = Math.PI / 2.5;
    scene.add(engineWreck);

    for (let s = 0; s < 6; s++) {
      const smoke = new THREE.Mesh(
        new THREE.SphereGeometry(1.2 + Math.random() * 0.8, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.6 })
      );
      smoke.position.set(-6 + Math.random() * 4, 2 + Math.random() * 3, 4 + Math.random() * 4);
      scene.add(smoke);
      animatedObjects.push({
        mesh: smoke,
        update: () => {
          smoke.position.y += 0.02;
          if (smoke.position.y > 10) smoke.position.y = 2;
        }
      });
    }

    addTalkingPoneixNPC(game, scene, {
      name: "Hayatta Kalan Robot Bip-7",
      role: "Uzay Aracı Navigatörü",
      pos: new THREE.Vector3(4, 0, 4),
      dialogue: [
        "Bip-bop! Grizzy, hayattasın! Büyük bir patlama oldu!",
        "Tilki kaçış kapsülüyle kanyona doğru kaçtı!",
        "14 Dünya bossunun enerjisini birleştirip Gezegen Çekirdeğinde devasa bir canavar yaratıyor!",
        "Bu vadi 850 metre uzunluğunda ve kesintisiz zümrüt platformlarla döşendi! Yoldaki yeşil bayraklı kontrol noktalarını takip et!"
      ]
    });

    addCheckpoint(game, scene, 0, 0, -8, "1. Bölüm: Çarpışma Krateri Başlangıcı", true);

    // AŞAMA 2: Krater İçi Sık Volkanik Bazalt & Zümrüt Basamakları (Z: -16 dan -150 ye, adım aralığı 9-11 birim)
    for (let i = 1; i <= 14; i++) {
      const pz = -16 - (i - 1) * 9.5;
      const px = Math.sin(i * 0.9) * 7.5;
      const py = 0.5 + i * 1.1;
      const pw = 9.5;
      addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: pw, h: 3.5, d: pw, shape: i % 2 === 0 ? 'hex' : 'cylinder', color: 0x064e3b });
      addCoin(game, scene, px, py, pz);
      if (i % 3 === 0) addCoin(game, scene, px + 2, py, pz);
    }

    // AŞAMA 3: 1. Lav Yarığı Meydanı (Z: -155, topY: 16)
    addGroundedPlatform(game, scene, { x: 0, topY: 16, z: -155, w: 26, h: 4, d: 26, shape: 'cylinder', color: 0x064e3b });
    addCheckpoint(game, scene, 0, 16, -155, "1. Lav Yarığı Kontrol Noktası");
    addLaserHazard(game, scene, { x: 0, topY: 16, z: -155, length: 20, rotSpeed: 1.5, color: 0xef4444 });
    addHoneyGem(game, scene, 0, 16, -150);

    // AŞAMA 4: Hareketli Zümrüt Plazma Köprüleri & Sık Ara Adalar (Z: -168 to -290)
    for (let j = 1; j <= 12; j++) {
      const pz = -168 - (j - 1) * 10.5;
      const px = (j % 2 === 0 ? 5 : -5) * (j % 4 === 0 ? 0 : 1);
      const py = 16.5 + j * 0.8;
      if (j === 3 || j === 8) {
        addMovingPlatform(game, scene, { x: px, topY: py, z: pz, w: 9.5, h: 2.2, d: 9.5, axis: 'x', dist: 8, speed: 1.4, color: 0x34d399 });
      } else {
        addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 9.5, h: 3.5, d: 9.5, color: 0x059669 });
      }
      addCoin(game, scene, px, py, pz);
      if (j === 6) {
        addLaserHazard(game, scene, { x: px, topY: py, z: pz, length: 14, rotSpeed: -1.6, color: 0xf59e0b });
      }
    }

    // AŞAMA 5: 2. Orta Vadi Kalesi & Kontrol Meydanı (Z: -300, topY: 26)
    addGroundedPlatform(game, scene, { x: 0, topY: 26, z: -300, w: 28, h: 5, d: 28, shape: 'cylinder', color: 0x064e3b, metalness: 0.8 });
    addCheckpoint(game, scene, 0, 26, -300, "2. Orta Vadi Kalesi Checkpoint");
    addHoneyGem(game, scene, 0, 26, -294);

    // AŞAMA 6: Heliks Zümrüt Tırmanış Merdivenleri (Z: -312 to -485, adım aralığı 9.5)
    for (let k = 1; k <= 18; k++) {
      const pz = -312 - (k - 1) * 9.5;
      const px = Math.sin(k * 0.8) * 8.5;
      const py = 27 + k * 1.15;
      addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 9.5, h: 3.5, d: 9.5, shape: 'hex', color: 0x10b981 });
      addCoin(game, scene, px, py, pz);
    }

    // AŞAMA 7: 3. Zirve Fırlatma Meydanı & Süper Zıplama Rampası (Z: -495, topY: 48)
    addGroundedPlatform(game, scene, { x: 0, topY: 48, z: -495, w: 26, h: 4, d: 26, shape: 'cylinder', color: 0x064e3b });
    addCheckpoint(game, scene, 0, 48, -495, "3. Zirve Fırlatma Meydanı");
    addLaserHazard(game, scene, { x: 0, topY: 48, z: -495, length: 20, rotSpeed: 2.0, color: 0x38bdf8 });
    addJumpPad(game, scene, 0, 48, -495, 30, 0x10b981);

    // Landing deck after jump pad
    addGroundedPlatform(game, scene, { x: 0, topY: 56, z: -525, w: 22, h: 4, d: 22, color: 0x059669 });
    addCoin(game, scene, 0, 56, -525);

    // AŞAMA 8: Havada Yüksek İrtifa Ada Zinciri & Sık Geçişler (Z: -538 to -765)
    for (let m = 1; m <= 22; m++) {
      const pz = -538 - (m - 1) * 10.5;
      const px = Math.cos(m * 0.75) * 8.0;
      const py = 57 + m * 1.0;
      if (m === 7 || m === 15) {
        addMovingPlatform(game, scene, { x: px, topY: py, z: pz, w: 10, h: 2.2, d: 10, axis: 'x', dist: 9, speed: 1.5, color: 0x34d399 });
      } else {
        addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 10, h: 4, d: 10, shape: 'hex', color: 0x059669 });
      }
      addCoin(game, scene, px, py, pz);
      if (m % 2 === 0) addCoin(game, scene, px + 2, py, pz);
    }

    // AŞAMA 9: 4. Vadi Çıkış Zirvesi & 2. Bölüm Portalı (Z: -785, topY: 82)
    addGroundedPlatform(game, scene, { x: 0, topY: 82, z: -785, w: 34, h: 5, d: 34, shape: 'cylinder', color: 0x064e3b, metalness: 0.9, roughness: 0.2 });
    addCheckpoint(game, scene, 0, 82, -777, "4. Vadi Çıkış Zirvesi");
    for (let c = 0; c < 12; c++) {
      const ang = (c / 12) * Math.PI * 2;
      addCoin(game, scene, Math.sin(ang) * 11, 82, -785 + Math.cos(ang) * 11);
    }
    addHoneyGem(game, scene, 0, 82, -785);
    addHoneyGem(game, scene, 0, 82, -779);

    addExitPortal(game, scene, 0, 82, -797, "poneix_2_crystal_canyon", "2. Bölüm: Zümrüt & Plazma Kristal Kanyonu");

    setTimeout(() => {
      playFoxCrashAnimation(game);
    }, 400);
  }

  // LEVEL 2: Zümrüt & Plazma Kristal Kanyonu 💎 (1050 METRE KESİNTİSİZ PARKURLU KANYON)
  function buildPoneixLevel2(game, scene) {
    const THREE = window.THREE;

    // AŞAMA 1: Giriş Kristal Meydanı (Z: 0, topY: 0)
    addGroundedPlatform(game, scene, { x: 0, topY: 0, z: 0, w: 30, h: 4, d: 30, shape: 'cylinder', color: 0x059669, metalness: 0.8 });
    addCheckpoint(game, scene, 0, 0, 0, "2. Bölüm: Kristal Kanyon Girişi", true);

    addTalkingPoneixNPC(game, scene, {
      name: "Kaşif Orion",
      role: "Plazma Kanyon Rehberi",
      pos: new THREE.Vector3(-6, 0, -4),
      dialogue: [
        "Selam Grizzy! Zümrüt & Plazma Kristal Kanyonu tam 1050 metre uzunluğundadır!",
        "Tüm kristal platformlar birbirine yakın, sağlam ve kesintisiz tasarlandı!",
        "Önünde dönen çift lazerler, devasa heliks tırmanış kulesi ve havada zıplama rampaları var!",
        "Kontrol noktalarında bayrakların yeşile dönmesini sağla ve zirveye ulaş!"
      ]
    });

    // AŞAMA 2: Uçurum Kristal Prizmaları & Sık Ara Basamaklar (Z: -15 to -155)
    for (let i = 1; i <= 15; i++) {
      const pz = -15 - (i - 1) * 9.5;
      const px = Math.sin(i * 0.85) * 8.0;
      const py = 1.0 + i * 1.1;
      addGroundedPlatform(game, scene, {
        x: px, topY: py, z: pz,
        w: 9.5, h: 3.5, d: 9.5,
        shape: 'hex',
        color: 0x10b981,
        emissive: 0x059669,
        metalness: 0.7
      });
      addCoin(game, scene, px, py, pz);
      if (i % 3 === 0) addCoin(game, scene, px + 2, py, pz);
    }

    // AŞAMA 3: 1. Plazma Lazer Meydanı (Z: -165, topY: 18)
    addGroundedPlatform(game, scene, { x: 0, topY: 18, z: -165, w: 26, h: 4, d: 26, shape: 'cylinder', color: 0x064e3b, metalness: 0.8 });
    addCheckpoint(game, scene, 0, 18, -165, "1. Plazma Lazer Meydanı");
    addLaserHazard(game, scene, { x: 0, topY: 18, z: -165, length: 20, rotSpeed: 1.6, color: 0xef4444 });
    addHoneyGem(game, scene, 0, 18, -160);

    // AŞAMA 4: Senkronize Hareketli Zümrüt Plakaları & Dinlenme Adaları (Z: -178 to -310)
    for (let j = 1; j <= 13; j++) {
      const pz = -178 - (j - 1) * 10.2;
      const px = (j % 2 === 0 ? 6 : -6) * (j % 3 === 0 ? 0 : 1);
      const py = 18.5 + j * 0.8;
      if (j === 4 || j === 9) {
        addMovingPlatform(game, scene, { x: px, topY: py, z: pz, w: 9.5, h: 2.2, d: 9.5, axis: 'x', dist: 8, speed: 1.5, color: 0x34d399 });
      } else {
        addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 9.5, h: 3.5, d: 9.5, color: 0x059669 });
      }
      addCoin(game, scene, px, py, pz);
      if (j === 7) {
        addLaserHazard(game, scene, { x: px, topY: py, z: pz, length: 14, rotSpeed: -1.8, color: 0xa855f7 });
      }
    }

    // AŞAMA 5: 2. Kanyon Kontrol Kalesi (Z: -320, topY: 29)
    addGroundedPlatform(game, scene, { x: 0, topY: 29, z: -320, w: 28, h: 5, d: 28, shape: 'cylinder', color: 0x064e3b, metalness: 0.8 });
    addCheckpoint(game, scene, 0, 29, -320, "2. Kristal Kanyon Checkpoint");
    addHoneyGem(game, scene, 0, 29, -320);

    // AŞAMA 6: Devasa Heliks Kristal Tırmanış Kulesi (Z: -332 to -535)
    for (let k = 1; k <= 20; k++) {
      const pz = -332 - (k - 1) * 10.0;
      const px = Math.sin(k * 0.75) * 8.5;
      const py = 30 + k * 1.3;
      addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 9.5, h: 3.5, d: 9.5, shape: 'hex', color: 0x10b981 });
      addCoin(game, scene, px, py, pz);
    }

    // AŞAMA 7: 3. Gözlemevi Zirvesi & Geyser Fırlatma İstasyonu 1 (Z: -545, topY: 57)
    addGroundedPlatform(game, scene, { x: 0, topY: 57, z: -545, w: 26, h: 4, d: 26, shape: 'cylinder', color: 0x064e3b });
    addCheckpoint(game, scene, 0, 57, -545, "3. Gözlemevi Fırlatma İstasyonu");
    addLaserHazard(game, scene, { x: 0, topY: 57, z: -545, length: 20, rotSpeed: 2.0, color: 0x38bdf8 });
    addJumpPad(game, scene, 0, 57, -545, 30, 0x10b981);

    // Landing deck after jump pad
    addGroundedPlatform(game, scene, { x: 0, topY: 65, z: -575, w: 22, h: 4, d: 22, color: 0x10b981 });
    addCoin(game, scene, 0, 65, -575);

    // AŞAMA 8: Havada Kristal Ada Zinciri (Z: -588 to -780)
    for (let m = 1; m <= 19; m++) {
      const pz = -588 - (m - 1) * 10.2;
      const px = Math.cos(m * 0.8) * 8.0;
      const py = 66 + m * 1.0;
      addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 10, h: 3.5, d: 10, color: 0x059669 });
      addCoin(game, scene, px, py, pz);
    }

    // 4. Havada Kristal Ada Checkpoint
    addGroundedPlatform(game, scene, { x: 0, topY: 86, z: -795, w: 24, h: 4, d: 24, color: 0x10b981 });
    addCheckpoint(game, scene, 0, 86, -795, "4. Havada Kristal Ada Checkpoint");
    addHoneyGem(game, scene, 0, 86, -795);

    // AŞAMA 9: Yüksek İrtifa Hareketli Kristal Şeritler (Z: -808 to -955)
    for (let n = 1; n <= 14; n++) {
      const pz = -808 - (n - 1) * 10.5;
      const px = Math.sin(n * 0.7) * 7.5;
      const py = 87 + n * 0.65;
      if (n === 4 || n === 10) {
        addMovingPlatform(game, scene, { x: px, topY: py, z: pz, w: 9.5, h: 2.2, d: 9.5, axis: 'x', dist: 8, speed: 1.5, color: 0x34d399 });
      } else {
        addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 9.5, h: 3.5, d: 9.5, color: 0x064e3b });
      }
      addCoin(game, scene, px, py, pz);
      if (n === 7) {
        addLaserHazard(game, scene, { x: px, topY: py, z: pz, length: 16, rotSpeed: 2.0, color: 0xef4444 });
      }
    }

    // AŞAMA 10: Kadim Zümrüt Zirve Tapınağı & 3. Bölüm Portalı (Z: -975, topY: 96)
    addGroundedPlatform(game, scene, { x: 0, topY: 96, z: -975, w: 36, h: 5, d: 36, shape: 'cylinder', color: 0x064e3b, metalness: 0.9, roughness: 0.2 });
    addCheckpoint(game, scene, 0, 96, -967, "5. Kadim Kristal Tapınak Zirvesi");
    for (let c = 0; c < 16; c++) {
      const ang = (c / 16) * Math.PI * 2;
      addCoin(game, scene, Math.sin(ang) * 12, 96, -975 + Math.cos(ang) * 12);
    }
    addHoneyGem(game, scene, 0, 96, -975);
    addHoneyGem(game, scene, 0, 96, -969);

    addExitPortal(game, scene, 0, 96, -987, "poneix_3_cyber_ruins", "3. Bölüm: Antik Phoenix Sibernetik Tapınağı");
  }

  // LEVEL 3: Antik Phoenix Sibernetik Tapınağı 🏛️ (1000 METRE KESİNTİSİZ PARKURLU)
  function buildPoneixLevel3(game, scene) {
    const THREE = window.THREE;

    addGroundedPlatform(game, scene, { x: 0, topY: 0, z: 0, w: 30, h: 4, d: 30, color: 0x0f172a, metalness: 0.9, roughness: 0.3 });
    addCheckpoint(game, scene, 0, 0, 0, "3. Bölüm: Sibernetik Tapınak Girişi", true);

    addTalkingPoneixNPC(game, scene, {
      name: "Siber Muhafız Unit-7",
      role: "Tapınak Koruyucusu",
      pos: new THREE.Vector3(5, 0, -4),
      dialogue: [
        "UYARI: Tilki tapınak ana veri tabanına sızdı!",
        "1000 metrelik sibernetik labirentte kuantum veri plakaları ve 4 kollu lazer matrisleri aktif!",
        "Tüm platformlar sık ve dengeli yerleştirildi! Yeşil kontrol noktalarını aktif ederek ana reaktör zirvesine ulaş!"
      ]
    });

    // 1. Siber Izgara Adımları (Z: -15 to -155, adım aralığı 9.5)
    for (let i = 1; i <= 15; i++) {
      const pz = -15 - (i - 1) * 9.5;
      const px = Math.sin(i * 0.8) * 8.0;
      const py = 1.0 + i * 1.15;
      addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 9.5, h: 3.5, d: 9.5, color: 0x1e293b, emissive: 0x0284c7 });
      addCoin(game, scene, px, py, pz);
    }

    // 2. Kuantum Veri Meydanı (Z: -165, topY: 19)
    addGroundedPlatform(game, scene, { x: 0, topY: 19, z: -165, w: 26, h: 4, d: 26, color: 0x0f172a });
    addCheckpoint(game, scene, 0, 19, -165, "1. Kuantum Veri Meydanı");
    addLaserHazard(game, scene, { x: 0, topY: 19, z: -165, length: 20, rotSpeed: 1.6, color: 0x38bdf8 });
    addHoneyGem(game, scene, 0, 19, -160);

    // 3. Hareketli Kuantum Plakaları & Sık Bağlantılar (Z: -178 to -315)
    for (let j = 1; j <= 14; j++) {
      const pz = -178 - (j - 1) * 10.0;
      const px = (j % 2 === 0 ? 6 : -6) * (j % 3 === 0 ? 0 : 1);
      const py = 19.5 + j * 0.8;
      if (j === 4 || j === 9) {
        addMovingPlatform(game, scene, { x: px, topY: py, z: pz, w: 9.5, h: 2.2, d: 9.5, axis: 'x', dist: 8, speed: 1.5, color: 0x0284c7 });
      } else {
        addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 9.5, h: 3.5, d: 9.5, color: 0x0f172a });
      }
      addCoin(game, scene, px, py, pz);
    }

    // 4. Tapınak Fırlatma İstasyonu (Z: -325, topY: 31)
    addGroundedPlatform(game, scene, { x: 0, topY: 31, z: -325, w: 26, h: 4, d: 26, color: 0x0f172a });
    addCheckpoint(game, scene, 0, 31, -325, "2. Tapınak Fırlatma İstasyonu");
    addJumpPad(game, scene, 0, 31, -325, 30, 0x38bdf8);

    // Landing deck after jump pad
    addGroundedPlatform(game, scene, { x: 0, topY: 42, z: -355, w: 22, h: 4, d: 22, color: 0x1e293b });
    addCoin(game, scene, 0, 42, -355);

    // 5. Yüksek Sütunlar & Lazer Matrisi (Z: -368 to -530)
    for (let k = 1; k <= 16; k++) {
      const pz = -368 - (k - 1) * 10.2;
      const px = Math.sin(k * 0.8) * 8.0;
      const py = 43 + k * 1.3;
      addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 10, h: 4, d: 10, color: 0x1e293b });
      addCoin(game, scene, px, py, pz);
      if (k === 8) {
        addLaserHazard(game, scene, { x: px, topY: py, z: pz, length: 16, rotSpeed: 2.0, color: 0xef4444 });
      }
    }

    // 6. Orta Kuantum Çekirdeği Checkpoint (Z: -545, topY: 66)
    addGroundedPlatform(game, scene, { x: 0, topY: 66, z: -545, w: 26, h: 4, d: 26, color: 0x0f172a });
    addCheckpoint(game, scene, 0, 66, -545, "3. Kuantum Çekirdek Meydanı");
    addHoneyGem(game, scene, 0, 66, -545);
    addJumpPad(game, scene, 0, 66, -545, 30, 0x10b981);

    // Landing deck
    addGroundedPlatform(game, scene, { x: 0, topY: 76, z: -575, w: 22, h: 4, d: 22, color: 0x0f172a });
    addCoin(game, scene, 0, 76, -575);

    // 7. Yüksek İrtifa Siber Köprü (Z: -588 to -880)
    for (let m = 1; m <= 28; m++) {
      const pz = -588 - (m - 1) * 10.4;
      const px = Math.cos(m * 0.7) * 8.0;
      const py = 77 + m * 0.6;
      if (m === 7 || m === 18) {
        addMovingPlatform(game, scene, { x: px, topY: py, z: pz, w: 9.5, h: 2.2, d: 9.5, axis: 'x', dist: 8, speed: 1.6, color: 0x0284c7 });
      } else {
        addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 9.5, h: 3.5, d: 9.5, color: 0x0f172a });
      }
      addCoin(game, scene, px, py, pz);
      if (m === 14) {
        addCheckpoint(game, scene, px, py, pz, "4. Yüksek Kule Checkpoint");
      }
    }

    // 8. Son Portal Meydanı (Z: -900, topY: 94)
    addGroundedPlatform(game, scene, { x: 0, topY: 94, z: -900, w: 34, h: 5, d: 34, color: 0x0f172a, metalness: 0.9 });
    addCheckpoint(game, scene, 0, 94, -892, "5. Siber Tapınak Zirvesi");
    for (let c = 0; c < 12; c++) {
      const ang = (c / 12) * Math.PI * 2;
      addCoin(game, scene, Math.sin(ang) * 11, 94, -900 + Math.cos(ang) * 11);
    }
    addHoneyGem(game, scene, 0, 94, -900);

    addExitPortal(game, scene, 0, 94, -912, "poneix_4_magma_ocean", "4. Bölüm: Kızıl Magma Okyanusu & Yüzen Bazaltlar");
  }

  // LEVEL 4: Kızıl Magma Okyanusu & Yüzen Bazaltlar 🌋 (1150 METRE KESİNTİSİZ PARKURLU)
  function buildPoneixLevel4(game, scene) {
    const THREE = window.THREE;

    const lavaMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xd97706, emissiveIntensity: 0.9 });
    const lavaSea = new THREE.Mesh(new THREE.PlaneGeometry(1600, 1600), lavaMat);
    lavaSea.rotation.x = -Math.PI / 2;
    lavaSea.position.y = -8;
    scene.add(lavaSea);

    addGroundedPlatform(game, scene, { x: 0, topY: 0, z: 0, w: 30, h: 4, d: 30, shape: 'hex', color: 0x292524, roughness: 0.9 });
    addCheckpoint(game, scene, 0, 0, 0, "4. Bölüm: Magma Okyanusu Girişi", true);

    // 1. Kısım: Magma Üstü Bazalt Adımları (Z: -15 to -165, adım aralığı 9.5)
    for (let i = 1; i <= 16; i++) {
      const pz = -15 - (i - 1) * 9.5;
      const px = Math.sin(i * 0.8) * 8.0;
      const py = 1.0 + i * 1.15;
      addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 9.5, h: 4, d: 9.5, shape: 'hex', color: 0x44403c });
      addCoin(game, scene, px, py, pz);
    }

    addGroundedPlatform(game, scene, { x: 0, topY: 20, z: -175, w: 26, h: 4, d: 26, shape: 'cylinder', color: 0x292524 });
    addCheckpoint(game, scene, 0, 20, -175, "1. Volkanik Gaz Krateri");
    addLaserHazard(game, scene, { x: 0, topY: 20, z: -175, length: 20, rotSpeed: 1.8, color: 0xef4444 });
    addHoneyGem(game, scene, 0, 20, -170);

    // 2. Kısım: Hareketli Lav Platformları & Sık Dinlenme Adaları (Z: -188 to -335)
    for (let j = 1; j <= 14; j++) {
      const pz = -188 - (j - 1) * 10.2;
      const px = (j % 2 === 0 ? 6 : -6) * (j % 3 === 0 ? 0 : 1);
      const py = 20.5 + j * 0.8;
      if (j === 4 || j === 10) {
        addMovingPlatform(game, scene, { x: px, topY: py, z: pz, w: 9.5, h: 2.2, d: 9.5, axis: 'x', dist: 8, speed: 1.6, color: 0xf97316 });
      } else {
        addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 9.5, h: 3.5, d: 9.5, color: 0x292524 });
      }
      addCoin(game, scene, px, py, pz);
    }

    addGroundedPlatform(game, scene, { x: 0, topY: 33, z: -345, w: 26, h: 4, d: 26, color: 0x292524 });
    addCheckpoint(game, scene, 0, 33, -345, "2. Magma Zıplama Rampası 1");
    addJumpPad(game, scene, 0, 33, -345, 30, 0xf97316);

    // Landing deck
    addGroundedPlatform(game, scene, { x: 0, topY: 44, z: -375, w: 22, h: 4, d: 22, color: 0x44403c });
    addCoin(game, scene, 0, 44, -375);

    // 3. Kısım: Magma Nehri Üzeri Yüzen Adalar (Z: -388 to -590)
    for (let m = 1; m <= 20; m++) {
      const pz = -388 - (m - 1) * 10.2;
      const px = Math.sin(m * 0.75) * 8.5;
      const py = 45 + m * 1.15;
      addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 10, h: 4, d: 10, color: 0x44403c });
      addCoin(game, scene, px, py, pz);
    }

    addGroundedPlatform(game, scene, { x: 0, topY: 69, z: -605, w: 26, h: 4, d: 26, color: 0x292524 });
    addCheckpoint(game, scene, 0, 69, -605, "3. Magma Havza Zirvesi");
    addLaserHazard(game, scene, { x: 0, topY: 69, z: -605, length: 20, rotSpeed: 2.0, color: 0xef4444 });
    addJumpPad(game, scene, 0, 69, -605, 30, 0xef4444);

    // Landing deck
    addGroundedPlatform(game, scene, { x: 0, topY: 79, z: -635, w: 22, h: 4, d: 22, color: 0x292524 });
    addCoin(game, scene, 0, 79, -635);

    // 4. Kısım: Yüksek Lav Şelalesi Parkuru (Z: -648 to -950)
    for (let n = 1; n <= 29; n++) {
      const pz = -648 - (n - 1) * 10.4;
      const px = Math.cos(n * 0.75) * 8.0;
      const py = 80 + n * 0.55;
      if (n === 8 || n === 20) {
        addMovingPlatform(game, scene, { x: px, topY: py, z: pz, w: 9.5, h: 2.2, d: 9.5, axis: 'x', dist: 8, speed: 1.6, color: 0xf97316 });
      } else {
        addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 9.5, h: 3.5, d: 9.5, color: 0x292524 });
      }
      addCoin(game, scene, px, py, pz);
      if (n === 15) {
        addCheckpoint(game, scene, px, py, pz, "4. Lav Şelalesi Checkpoint");
      }
    }

    addGroundedPlatform(game, scene, { x: 0, topY: 97, z: -970, w: 36, h: 5, d: 36, color: 0x292524 });
    addCheckpoint(game, scene, 0, 97, -962, "5. Magma Krater Zirvesi");
    for (let c = 0; c < 12; c++) {
      const ang = (c / 12) * Math.PI * 2;
      addCoin(game, scene, Math.sin(ang) * 11, 97, -970 + Math.cos(ang) * 11);
    }
    addHoneyGem(game, scene, 0, 97, -970);

    addExitPortal(game, scene, 0, 97, -982, "poneix_5_sky_citadel", "5. Bölüm: Poneix Göksel Hisarı & Enerji Kuleleri");
  }

  // LEVEL 5: Poneix Göksel Hisarı & Enerji Kuleleri ⚡ (1250 METRE KESİNTİSİZ PARKURLU)
  function buildPoneixLevel5(game, scene) {
    const THREE = window.THREE;

    addGroundedPlatform(game, scene, { x: 0, topY: 0, z: 0, w: 30, h: 4, d: 30, shape: 'cylinder', color: 0x0284c7, metalness: 0.8, roughness: 0.2 });
    addCheckpoint(game, scene, 0, 0, 0, "5. Bölüm: Göksel Hisar Girişi", true);

    addTalkingPoneixNPC(game, scene, {
      name: "Hisar Muhafızı Kaelen",
      role: "Gök Şehri Savunucusu",
      pos: new THREE.Vector3(-5, 0, -4),
      dialogue: [
        "Grizzy! Tilki yukarıdaki Füzyon Laboratuvarına kapandı!",
        "1250 metrelik devasa gökyüzü rotasında tüm platformlar sık ve dengeli dizildi!",
        "Kontrol bayraklarını aktif ederek bulutların üzerine tırman!"
      ]
    });

    // 1. Kısım: Göksel Hisar Basamakları (Z: -15 to -175, adım aralığı 9.5)
    for (let i = 1; i <= 17; i++) {
      const pz = -15 - (i - 1) * 9.5;
      const px = Math.sin(i * 0.8) * 8.0;
      const py = 1.0 + i * 1.4;
      addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 10, h: 3.5, d: 10, shape: 'cylinder', color: 0x38bdf8, metalness: 0.8 });
      addCoin(game, scene, px, py, pz);
    }

    addGroundedPlatform(game, scene, { x: 0, topY: 26, z: -185, w: 26, h: 4, d: 26, color: 0x0369a1 });
    addCheckpoint(game, scene, 0, 26, -185, "1. Bulut Üstü Hisar Checkpoint");
    addLaserHazard(game, scene, { x: 0, topY: 26, z: -185, length: 20, rotSpeed: 1.8, color: 0x38bdf8 });
    addHoneyGem(game, scene, 0, 26, -180);

    // 2. Kısım: Enerji Köprüleri & Hareketli Asansörler (Z: -198 to -345)
    for (let j = 1; j <= 14; j++) {
      const pz = -198 - (j - 1) * 10.2;
      const px = (j % 2 === 0 ? 6 : -6) * (j % 3 === 0 ? 0 : 1);
      const py = 26.5 + j * 0.6;
      if (j === 4 || j === 10) {
        addMovingPlatform(game, scene, { x: px, topY: py, z: pz, w: 9.5, h: 2.2, d: 9.5, axis: 'x', dist: 8, speed: 1.6, color: 0x0284c7 });
      } else {
        addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 9.5, h: 3.5, d: 9.5, color: 0x0284c7 });
      }
      addCoin(game, scene, px, py, pz);
    }

    addGroundedPlatform(game, scene, { x: 0, topY: 36, z: -355, w: 24, h: 4, d: 24, color: 0x0284c7 });
    addCheckpoint(game, scene, 0, 36, -355, "2. Gökyüzü Fırlatıcı Rampası 1");
    addJumpPad(game, scene, 0, 36, -355, 30, 0x10b981);

    // Landing deck
    addGroundedPlatform(game, scene, { x: 0, topY: 48, z: -385, w: 22, h: 4, d: 22, color: 0x38bdf8 });
    addCoin(game, scene, 0, 48, -385);

    // 3. Kısım: Yüksek İrtifa Spiral Kule (Z: -398 to -615)
    for (let k = 1; k <= 21; k++) {
      const pz = -398 - (k - 1) * 10.2;
      const px = Math.sin(k * 0.75) * 8.5;
      const py = 49 + k * 1.5;
      addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 10, h: 4, d: 10, color: 0x38bdf8 });
      addCoin(game, scene, px, py, pz);
    }

    addGroundedPlatform(game, scene, { x: 0, topY: 82, z: -625, w: 26, h: 4, d: 26, color: 0x0369a1 });
    addCheckpoint(game, scene, 0, 82, -625, "3. Zirve Gök Gözlemevi");
    addLaserHazard(game, scene, { x: 0, topY: 82, z: -625, length: 20, rotSpeed: -2.0, color: 0x38bdf8 });
    addJumpPad(game, scene, 0, 82, -625, 30, 0x38bdf8);

    // Landing deck
    addGroundedPlatform(game, scene, { x: 0, topY: 92, z: -655, w: 22, h: 4, d: 22, color: 0x0284c7 });
    addCoin(game, scene, 0, 92, -655);

    // 4. Kısım: Bulut Üstü Doruk Yürüyüşü (Z: -668 to -1010)
    for (let m = 1; m <= 33; m++) {
      const pz = -668 - (m - 1) * 10.4;
      const px = Math.cos(m * 0.7) * 8.0;
      const py = 93 + m * 0.5;
      if (m === 8 || m === 22) {
        addMovingPlatform(game, scene, { x: px, topY: py, z: pz, w: 9.5, h: 2.2, d: 9.5, axis: 'x', dist: 8, speed: 1.6, color: 0x0284c7 });
      } else {
        addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 9.5, h: 3.5, d: 9.5, color: 0x0284c7 });
      }
      addCoin(game, scene, px, py, pz);
      if (m === 16) {
        addCheckpoint(game, scene, px, py, pz, "4. Hisar Doruk Checkpoint");
      }
    }

    addGroundedPlatform(game, scene, { x: 0, topY: 110, z: -1030, w: 36, h: 5, d: 36, color: 0x0284c7, metalness: 0.9 });
    addCheckpoint(game, scene, 0, 110, -1022, "5. Göksel Hisar Zirve Portalı");
    for (let c = 0; c < 12; c++) {
      const ang = (c / 12) * Math.PI * 2;
      addCoin(game, scene, Math.sin(ang) * 11, 110, -1030 + Math.cos(ang) * 11);
    }
    addHoneyGem(game, scene, 0, 110, -1030);

    addExitPortal(game, scene, 0, 110, -1042, "poneix_6_chimera_core", "6. Bölüm: 14 Boss Klonlama & Füzyon Reaktörü");
  }

  // LEVEL 6: 14 Boss Klonlama & Füzyon Reaktörü 🧪 (1150 METRE KESİNTİSİZ PARKURLU)
  function buildPoneixLevel6(game, scene) {
    const THREE = window.THREE;

    addGroundedPlatform(game, scene, { x: 0, topY: 0, z: 0, w: 36, h: 4, d: 36, color: 0x064e3b, metalness: 0.9, roughness: 0.3 });
    addCheckpoint(game, scene, 0, 0, 8, "6. Bölüm: Füzyon Laboratuvarı Girişi", true);

    const tubeMat = new THREE.MeshStandardMaterial({ color: 0x34d399, roughness: 0.1, transparent: true, opacity: 0.65 });
    for (let b = 0; b < 14; b++) {
      const side = b < 7 ? -1 : 1;
      const row = b % 7;
      const tx = side * 13;
      const tz = 8 - row * 5.5;

      const tube = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 5.0, 16), tubeMat);
      tube.position.set(tx, 2.5, tz);
      scene.add(tube);

      const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.7, 8, 8),
        new THREE.MeshBasicMaterial({ color: b % 2 === 0 ? 0xf59e0b : 0x10b981 })
      );
      core.position.set(tx, 2.5, tz);
      scene.add(core);

      animatedObjects.push({
        mesh: core,
        update: () => {
          core.position.y = 2.5 + Math.sin(Date.now() * 0.006 + b) * 0.4;
        }
      });
    }

    addTalkingPoneixNPC(game, scene, {
      name: "Genetik Mühendisi",
      role: "Laboratuvar Başasistanı",
      pos: new THREE.Vector3(0, 0, 0),
      dialogue: [
        "Aman tanrım! Tilki 14 Dünya bossunun tüm DNA ve güçlerini birleştirdi!",
        "Reaktör labirentinden geçerek Apex Arenasına kaçtı!",
        "Tüm reaktör köprülerini ve fırlatıcıları kullanarak Apex kapısına ulaş!"
      ]
    });

    // 1. Kısım: Reaktör Soğutma Boruları & Köprüler (Z: -15 to -175)
    for (let i = 1; i <= 17; i++) {
      const pz = -15 - (i - 1) * 9.5;
      const px = Math.sin(i * 0.8) * 8.0;
      const py = 1.0 + i * 1.35;
      addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 10, h: 3.5, d: 10, color: 0x059669, emissive: 0x34d399 });
      addCoin(game, scene, px, py, pz);
    }

    addGroundedPlatform(game, scene, { x: 0, topY: 25, z: -185, w: 26, h: 4, d: 26, color: 0x064e3b });
    addCheckpoint(game, scene, 0, 25, -185, "1. Füzyon Çekirdek Köprüsü");
    addLaserHazard(game, scene, { x: 0, topY: 25, z: -185, length: 20, rotSpeed: 1.8, color: 0xef4444 });
    addHoneyGem(game, scene, 0, 25, -180);

    // 2. Kısım: Plazma Tüpleri & Hareketli Manyetik Bloklar (Z: -198 to -345)
    for (let j = 1; j <= 14; j++) {
      const pz = -198 - (j - 1) * 10.2;
      const px = (j % 2 === 0 ? 6 : -6) * (j % 3 === 0 ? 0 : 1);
      const py = 25.5 + j * 0.6;
      if (j === 4 || j === 10) {
        addMovingPlatform(game, scene, { x: px, topY: py, z: pz, w: 9.5, h: 2.2, d: 9.5, axis: 'x', dist: 8, speed: 1.6, color: 0x34d399 });
      } else {
        addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 9.5, h: 3.5, d: 9.5, color: 0x064e3b });
      }
      addCoin(game, scene, px, py, pz);
    }

    addGroundedPlatform(game, scene, { x: 0, topY: 35, z: -355, w: 24, h: 4, d: 24, color: 0x064e3b });
    addCheckpoint(game, scene, 0, 35, -355, "2. Reaktör Fırlatma Rampası 1");
    addJumpPad(game, scene, 0, 35, -355, 30, 0x10b981);

    // Landing deck
    addGroundedPlatform(game, scene, { x: 0, topY: 46, z: -385, w: 22, h: 4, d: 22, color: 0x059669 });
    addCoin(game, scene, 0, 46, -385);

    // 3. Kısım: Yüksek Reaktör Kuleleri (Z: -398 to -630)
    for (let k = 1; k <= 23; k++) {
      const pz = -398 - (k - 1) * 10.2;
      const px = Math.sin(k * 0.75) * 8.5;
      const py = 47 + k * 1.5;
      addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 10, h: 4, d: 10, color: 0x059669 });
      addCoin(game, scene, px, py, pz);
    }

    addGroundedPlatform(game, scene, { x: 0, topY: 83, z: -645, w: 26, h: 4, d: 26, color: 0x064e3b });
    addCheckpoint(game, scene, 0, 83, -645, "3. Plazma Reaktör Checkpoint");
    addLaserHazard(game, scene, { x: 0, topY: 83, z: -645, length: 20, rotSpeed: 2.2, color: 0xa855f7 });
    addJumpPad(game, scene, 0, 83, -645, 30, 0x34d399);

    // Landing deck
    addGroundedPlatform(game, scene, { x: 0, topY: 93, z: -675, w: 22, h: 4, d: 22, color: 0x064e3b });
    addCoin(game, scene, 0, 93, -675);

    // 4. Kısım: Apex Giriş Yolu & Son Reaktör Kapısı (Z: -688 to -1030)
    for (let m = 1; m <= 33; m++) {
      const pz = -688 - (m - 1) * 10.4;
      const px = Math.cos(m * 0.7) * 8.0;
      const py = 94 + m * 0.5;
      if (m === 8 || m === 22) {
        addMovingPlatform(game, scene, { x: px, topY: py, z: pz, w: 9.5, h: 2.2, d: 9.5, axis: 'x', dist: 8, speed: 1.6, color: 0x34d399 });
      } else {
        addGroundedPlatform(game, scene, { x: px, topY: py, z: pz, w: 9.5, h: 3.5, d: 9.5, color: 0x064e3b });
      }
      addCoin(game, scene, px, py, pz);
      if (m === 16) {
        addCheckpoint(game, scene, px, py, pz, "4. Son Reaktör Kapısı Checkpoint");
      }
    }

    addGroundedPlatform(game, scene, { x: 0, topY: 110, z: -1050, w: 36, h: 5, d: 36, color: 0x064e3b, metalness: 0.9 });
    addCheckpoint(game, scene, 0, 110, -1042, "5. Apex Arenası Giriş Portalı");
    for (let c = 0; c < 12; c++) {
      const ang = (c / 12) * Math.PI * 2;
      addCoin(game, scene, Math.sin(ang) * 11, 110, -1050 + Math.cos(ang) * 11);
    }
    addHoneyGem(game, scene, 0, 110, -1050);

    addExitPortal(game, scene, 0, 110, -1062, "poneix_7_fusion_boss", "7. BÖLÜM (FİNAL): 14 DÜNYA BİRLEŞİK BOSS APEX ARENASI");
  }

  // LEVEL 7: BİRLEŞİK 14 DÜNYA BOSSU APEX ARENASI 👑 (FINAL BOSS DEVASA ARENA)
  function buildPoneixLevel7(game, scene) {
    const THREE = window.THREE;

    addGroundedPlatform(game, scene, { x: 0, topY: 0, z: 0, w: 90, h: 5, d: 90, shape: 'cylinder', color: 0x064e3b, roughness: 0.7, metalness: 0.4 });

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(44.0, 0.8, 16, 48),
      new THREE.MeshBasicMaterial({ color: 0x34d399 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.2;
    scene.add(ring);

    addCheckpoint(game, scene, 0, 0, 36, "Füzyon Apex Arenası", true);

    const perches = [
      { x: -32, z: 0 },
      { x: 32, z: 0 },
      { x: 0, z: -32 },
      { x: 0, z: 32 }
    ];

    perches.forEach(p => {
      addGroundedPlatform(game, scene, { x: p.x, topY: 5.0, z: p.z, w: 10, h: 3, d: 10, color: 0x10b981 });
      addJumpPad(game, scene, p.x, 5.0, p.z, 32, 0x34d399);
      addCoin(game, scene, p.x, 5.0, p.z);
    });

    const bossData = create14BossChimeraModel(THREE);
    bossData.chimeraGroup.position.set(0, 0, -16);
    scene.add(bossData.chimeraGroup);

    fusionBossInstance = {
      model: bossData,
      mesh: bossData.chimeraGroup,
      hp: 120,
      maxHp: 120,
      title: '👑 KADİM 14 DÜNYA BİRLEŞİK FÜZYON BOSSU (CHIMERA TITAN)',
      attackTimer: 3.2,
      currentAttack: 'Volkan Lav Dalgası',
      hitCooldown: 0,
      isDead: false
    };

    showPoneixBossHp(fusionBossInstance.title, 120, 120, "⚡ 14 Dünya Patronunun Gücü Birleşti! Zayıf Noktaları Vur!");

    if (game.callbacks && game.callbacks.onShowNotice) {
      game.callbacks.onShowNotice("👑 14 DÜNYA BİRLEŞİK FÜZYON BOSSU UYANDI! Zıplayarak kafasına vur ve şok dalgalarından kaç!", "error");
    }
  }

  // --- TALKING NPC HELPER ---
  function addTalkingPoneixNPC(game, scene, config) {
    const THREE = window.THREE;
    const npcGroup = new THREE.Group();
    npcGroup.position.copy(config.pos);

    const suitMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.5 });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.9, 1.8, 16), suitMat);
    body.position.y = 0.9;
    npcGroup.add(body);

    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.85, 16, 16), new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.9 }));
    helmet.position.y = 2.2;
    npcGroup.add(helmet);

    scene.add(npcGroup);

    animatedObjects.push({
      mesh: npcGroup,
      update: () => {
        const game = window.__superBearGame;
        if (game && game.playerPos) {
          const dist = game.playerPos.distanceTo(npcGroup.position);
          if (dist < 5.5) {
            npcGroup.lookAt(game.playerPos.x, npcGroup.position.y, game.playerPos.z);
          }
        }
      }
    });

    if (!game.currentLevel.npcs) game.currentLevel.npcs = [];
    game.currentLevel.npcs.push({
      mesh: npcGroup,
      pos: config.pos,
      name: config.name,
      role: config.role,
      dialogue: config.dialogue
    });
  }

  // --- DAMAGE & SHOCKWAVE SYSTEM ---
  function spawnPoneixShockwave(scene, pos, color = 0x34d399) {
    const THREE = window.THREE;
    const ringGeo = new THREE.TorusGeometry(1.5, 0.45, 12, 36);
    const ringMat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.9 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.set(pos.x, pos.y + 0.2, pos.z);
    scene.add(ringMesh);

    poneixShockwaves.push({
      mesh: ringMesh,
      x: pos.x,
      y: pos.y,
      z: pos.z,
      radius: 1.5,
      maxRadius: 38.0,
      speed: 0.8
    });
  }

  function damagePlayer(game, amount = 20) {
    if (damageIframeTimer > 0) return;
    damageIframeTimer = 0.8;
    if (game.damagePlayer) {
      game.damagePlayer(amount);
    } else if (typeof game.playerHealth === 'number') {
      game.playerHealth = Math.max(0, game.playerHealth - amount);
    }
  }

  // --- UNIVERSAL PONEIX LEVEL LOADER ---
  function loadPoneixLevel(rawLevelId) {
    console.log("🪐 [Poneix Gezegeni Seviyesi] Yükleniyor: " + rawLevelId);
    const game = window.__superBearGame;
    if (!game || !game.scene) {
      console.warn("⚠️ Game scene not ready, deferring loadPoneixLevel...");
      setTimeout(() => loadPoneixLevel(rawLevelId), 300);
      return;
    }

    if (typeof window.__superBearPurgeScene === 'function') {
      window.__superBearPurgeScene(game);
    }
    if (window.__superBearPhelixLevels && window.__superBearPhelixLevels.cleanUpPhelixRealm) {
      window.__superBearPhelixLevels.cleanUpPhelixRealm(game);
    }
    cleanUpPoneixRealm(game);

    currentPoneixLevelId = rawLevelId;
    const THREE = window.THREE;
    poneixSceneGroup = new THREE.Group();
    poneixSceneGroup.name = "poneix_realm_container_" + rawLevelId;
    game.scene.add(poneixSceneGroup);

    game.currentRegion = rawLevelId;
    game.currentLevel = {
      regionId: rawLevelId,
      sceneGroup: poneixSceneGroup,
      spawnPoint: new THREE.Vector3(0, 0.5, 0),
      colliders: [],
      jumpPads: [],
      collectibles: [],
      checkpoints: [],
      enemies: [],
      npcs: [],
      movingPlatforms: [],
      lighting: {
        ambientColor: 0x065f46,
        sunColor: 0x34d399,
        fogColor: 0x022c22,
        skyColor: 0x022c22
      }
    };

    activeCheckpointPos = new THREE.Vector3(0, 0.5, 0);

    if (game.scene) {
      game.scene.background = new THREE.Color(0x022c22);
      game.scene.fog = new THREE.FogExp2(0x064e3b, 0.0010);
    }

    if (game.playerPos) {
      game.playerPos.set(0, 0.5, 0);
    }
    if (game.playerVel) {
      game.playerVel.set(0, 0, 0);
    }

    const mapped = PONEIX_LEVEL_MAP[rawLevelId] || rawLevelId;
    switch(mapped) {
      case 'poneix_level_1':
        buildPoneixLevel1(game, poneixSceneGroup);
        break;
      case 'poneix_level_2':
        buildPoneixLevel2(game, poneixSceneGroup);
        break;
      case 'poneix_level_3':
        buildPoneixLevel3(game, poneixSceneGroup);
        break;
      case 'poneix_level_4':
        buildPoneixLevel4(game, poneixSceneGroup);
        break;
      case 'poneix_level_5':
        buildPoneixLevel5(game, poneixSceneGroup);
        break;
      case 'poneix_level_6':
        buildPoneixLevel6(game, poneixSceneGroup);
        break;
      case 'poneix_level_7':
        buildPoneixLevel7(game, poneixSceneGroup);
        break;
      default:
        buildPoneixLevel1(game, poneixSceneGroup);
        break;
    }

    if (game.callbacks && game.callbacks.onRegionChange) {
      game.callbacks.onRegionChange(rawLevelId);
    }

    window.dispatchEvent(new CustomEvent('superbear:poneix-level-changed', {
      detail: { levelId: rawLevelId }
    }));
  }

  function cleanUpPoneixRealm(game) {
    if (!game) game = window.__superBearGame;
    hidePoneixBossHp();
    isCutscenePlaying = false;
    if (cutsceneContainer) cutsceneContainer.style.display = 'none';

    if (poneixSceneGroup && poneixSceneGroup.parent) {
      poneixSceneGroup.parent.remove(poneixSceneGroup);
      poneixSceneGroup = null;
    }

    animatedObjects.length = 0;
    poneixShockwaves.length = 0;
    movingPlatforms.length = 0;
    laserHazards.length = 0;
    fusionBossInstance = null;
  }

  // --- PONEİX TICK LOOP ---
  function updatePoneixLoop() {
    requestAnimationFrame(updatePoneixLoop);

    const game = window.__superBearGame;
    if (!game || !game.playerPos) return;
    const pPos = game.playerPos;

    if (isCutscenePlaying) {
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
      if (game.playerBear && game.playerBear.root) {
        game.playerBear.root.visible = false;
      }
    }

    if (damageIframeTimer > 0) damageIframeTimer -= 0.016;

    // Void Fall check with Checkpoint Respawn
    if (PONEIX_LEVEL_MAP[game.currentRegion]) {
      if (pPos.y < -35.0) {
        damagePlayer(game, 20);
        const respawnTarget = activeCheckpointPos || (game.currentLevel && game.currentLevel.spawnPoint);
        if (respawnTarget) {
          pPos.copy(respawnTarget);
          pPos.y += 0.8;
        } else {
          pPos.set(0, 1.0, 0);
        }
        if (game.playerVel) game.playerVel.set(0, 0, 0);
        if (game.callbacks && game.callbacks.onShowNotice) {
          game.callbacks.onShowNotice("🪐 Kanyondan düştün! Son kontrol noktasına geri döndün.", "error");
        }
      }
    }

    if (poneixCameraShake > 0) {
      poneixCameraShake -= 0.04;
      if (game.camera) {
        game.camera.position.x += (Math.random() - 0.5) * poneixCameraShake;
        game.camera.position.y += (Math.random() - 0.5) * poneixCameraShake;
      }
    }

    // Moving Platforms update & push player
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

    // Laser Hazards update & collision check
    for (let l = 0; l < laserHazards.length; l++) {
      const lz = laserHazards[l];
      lz.angle += lz.rotSpeed * 0.016;
      lz.group.rotation.y = lz.angle;

      const dHoriz = Math.hypot(pPos.x - lz.pos.x, pPos.z - lz.pos.z);
      if (dHoriz < lz.length / 2 && Math.abs(pPos.y - lz.pos.y) < 1.4) {
        const playerAngle = Math.atan2(pPos.x - lz.pos.x, pPos.z - lz.pos.z);
        let diff = Math.abs((playerAngle - lz.angle + Math.PI) % (Math.PI * 2) - Math.PI);
        if (diff > Math.PI / 2) diff = Math.abs(diff - Math.PI);

        if (diff < 0.25 && !game.isRolling) {
          damagePlayer(game, 15);
          if (game.callbacks && game.callbacks.onShowNotice) {
            game.callbacks.onShowNotice("⚡ Lazer Bariyerine Çarptın! (-15 Can)", "warn");
          }
        }
      }
    }

    for (let i = 0; i < animatedObjects.length; i++) {
      if (animatedObjects[i].update) animatedObjects[i].update();
    }

    for (let s = poneixShockwaves.length - 1; s >= 0; s--) {
      const sw = poneixShockwaves[s];
      sw.radius += sw.speed;
      const scale = sw.radius / 1.5;
      sw.mesh.scale.set(scale, scale, scale);
      sw.mesh.material.opacity = Math.max(0, 1.0 - (sw.radius / sw.maxRadius));

      const dist = Math.hypot(pPos.x - sw.x, pPos.z - sw.z);
      if (Math.abs(dist - sw.radius) < 2.2 && Math.abs(pPos.y - sw.y) < 2.4) {
        damagePlayer(game, 25);
      }

      if (sw.radius >= sw.maxRadius) {
        if (sw.mesh.parent) sw.mesh.parent.remove(sw.mesh);
        poneixShockwaves.splice(s, 1);
      }
    }

    // Jump pads collision trigger
    if (game.currentLevel && game.currentLevel.jumpPads) {
      ((game.currentLevel && game.currentLevel.jumpPads) || []).forEach(pad => {
        const d = Math.hypot(pPos.x - pad.pos.x, pPos.z - pad.pos.z);
        if (d < (pad.radius || 3.0) && Math.abs(pPos.y - pad.pos.y) < 2.2 && game.playerVel.y <= 4.0) {
          game.playerVel.y = pad.force || pad.boostForce || 28;
          game.isGrounded = false;
          game.jumpCount = 1;
          if (window.St && window.St.playJump) window.St.playJump();
          if (game.spawnSparkleParticles) game.spawnSparkleParticles(pad.pos, 16, 0x34d399);
        }
      });
    }

    // Collectibles pick up
    if (game.currentLevel && game.currentLevel.collectibles) {
      ((game.currentLevel && game.currentLevel.collectibles) || []).forEach(col => {
        if (!col.collected && pPos.distanceTo(col.pos) < 2.4) {
          col.collected = true;
          col.mesh.visible = false;
          if (col.type === 'coin') {
            if (game.stats) game.stats.coins += col.value || 1;
            if (window.St && window.St.playCoin) window.St.playCoin();
          } else if (col.type === 'honey_gem') {
            if (game.stats) {
              game.stats.honeyGems = (game.stats.honeyGems || 0) + 1;
              game.stats.coins += col.value || 5;
            }
            if (window.St && window.St.playHoneyGem) window.St.playHoneyGem();
          }
          if (game.callbacks && game.callbacks.onStatsUpdate) game.callbacks.onStatsUpdate(game.stats);
          if (game.spawnSparkleParticles) game.spawnSparkleParticles(col.pos, 10, 0x34d399);
        }
      });
    }

    // Checkpoint activation & safe ground recording
    if (game.currentLevel && game.currentLevel.checkpoints) {
      ((game.currentLevel && game.currentLevel.checkpoints) || []).forEach(cp => {
        if (!cp.active && pPos.distanceTo(cp.pos) < cp.radius) {
          ((game.currentLevel && game.currentLevel.checkpoints) || []).forEach(c => {
            c.active = false;
            if (c.crystalMesh && c.crystalMesh.material) {
              c.crystalMesh.material.emissiveIntensity = 0.3;
              c.crystalMesh.material.emissive.setHex(0xdc2626);
              c.crystalMesh.material.color.setHex(0xf87171);
            }
            if (c.bannerMesh && c.bannerMesh.material) {
              c.bannerMesh.material.color.setHex(0xef4444);
              c.bannerMesh.material.emissive.setHex(0xb91c1c);
            }
            if (c.haloMesh && c.haloMesh.material) {
              c.haloMesh.material.color.setHex(0xf87171);
            }
            if (c.beamMesh && c.beamMesh.material) {
              c.beamMesh.material.color.setHex(0xf87171);
              c.beamMesh.material.opacity = 0.15;
            }
          });

          cp.active = true;
          if (game.currentLevel.spawnPoint) game.currentLevel.spawnPoint.copy(cp.pos);
          activeCheckpointPos = cp.pos.clone();

          if (cp.crystalMesh && cp.crystalMesh.material) {
            cp.crystalMesh.material.emissiveIntensity = 0.95;
            cp.crystalMesh.material.emissive.setHex(0x10b981);
            cp.crystalMesh.material.color.setHex(0x34d399);
          }
          if (cp.bannerMesh && cp.bannerMesh.material) {
            cp.bannerMesh.material.color.setHex(0x22c55e);
            cp.bannerMesh.material.emissive.setHex(0x16a34a);
          }
          if (cp.haloMesh && cp.haloMesh.material) {
            cp.haloMesh.material.color.setHex(0x34d399);
          }
          if (cp.beamMesh && cp.beamMesh.material) {
            cp.beamMesh.material.color.setHex(0x34d399);
            cp.beamMesh.material.opacity = 0.45;
          }

          if (window.St && window.St.playHoneyGem) window.St.playHoneyGem();
          if (game.spawnSparkleParticles) game.spawnSparkleParticles(cp.pos, 30, 0x10b981);
          if (game.callbacks && game.callbacks.onShowNotice) {
            game.callbacks.onShowNotice("🚩 Kontrol Noktası Aktif: " + cp.name, "success");
          }
        }
      });
    }

    // Exit portal collision
    if (game.currentLevel && game.currentLevel.nextPortal) {
      const portal = game.currentLevel.nextPortal;
      if (pPos.distanceTo(portal.pos) < portal.radius) {
        console.log("🪐 Portala girildi: " + portal.targetRegion);
        if (game.loadRegion) {
          game.loadRegion(portal.targetRegion);
        }
      }
    }

    // FUSION BOSS AI IN LEVEL 7
    if (fusionBossInstance && !fusionBossInstance.isDead && poneixSceneGroup) {
      const b = fusionBossInstance;
      const bMesh = b.mesh;
      const distToBoss = pPos.distanceTo(bMesh.position);

      b.attackTimer -= 0.016;
      if (b.attackTimer <= 0) {
        b.attackTimer = 3.8;

        const attacks = [
          { name: "🌋 Volkan Lav Dalgası!", status: "🌋 Ignis Lav Şok Dalgası! Zıpla!", color: 0xef4444 },
          { name: "🦖 T-Rex Yıkıcı Depremi!", status: "🦖 Dinozor Titanyum Depremi! Kaç!", color: 0x22c55e },
          { name: "🐝 Zehirli Arı İğneleri!", status: "🐝 Kraliçe Arı İğne Yağmuru!", color: 0xfacc15 },
          { name: "❄️ Buzul Donması!", status: "❄️ Kar Tilkisi Buzul Dalgası!", color: 0x93c5fd },
          { name: "🌟 14 Patronun Kutsal Füzyon Patlaması!", status: "🌟 14 Bossun Birleşik Kozmik Işını!", color: 0x34d399 }
        ];
        const chosen = attacks[Math.floor(Math.random() * attacks.length)];
        b.currentAttack = chosen.name;
        poneixCameraShake = 1.8;
        spawnPoneixShockwave(poneixSceneGroup, bMesh.position, chosen.color);

        showPoneixBossHp(b.title, b.hp, b.maxHp, chosen.status);

        if (distToBoss < 32.0 && pPos.y < 5.0) {
          damagePlayer(game, 20);
        }
      }

      if (b.model.wingGroupL && b.model.wingGroupR) {
        const flap = Math.sin(Date.now() * 0.008) * 0.4;
        b.model.wingGroupL.rotation.z = flap;
        b.model.wingGroupR.rotation.z = -flap;
      }

      if (b.model.halo) b.model.halo.rotation.z += 0.03;
      if (b.model.orbGroup) b.model.orbGroup.rotation.y += 0.04;

      b.hitCooldown -= 0.016;
      if ((game.isAttacking || game.isRolling || pPos.distanceTo(bMesh.position) < 9.0) && b.hitCooldown <= 0) {
        if (pPos.distanceTo(bMesh.position) < 10.0) {
          b.hitCooldown = 0.45;
          b.hp -= 10;
          poneixCameraShake = 1.2;

          showPoneixBossHp(b.title, b.hp, b.maxHp, "⚡ Başarılı Vuruş! 14 Bossun Birleşik Gücü Zayıflıyor!");

          if (game.callbacks && game.callbacks.onShowNotice) {
            game.callbacks.onShowNotice("💥 14 BOSS FÜZYONUNA HASAR VERİLDİ! (-10 HP)", "success");
          }

          if (b.hp <= 0) {
            b.isDead = true;
            bMesh.visible = false;
            hidePoneixBossHp();

            for (let sp = 0; sp < 14; sp++) {
              const spirit = new window.THREE.Mesh(
                new window.THREE.SphereGeometry(1.2, 12, 12),
                new window.THREE.MeshBasicMaterial({ color: 0x34d399 })
              );
              spirit.position.copy(bMesh.position);
              poneixSceneGroup.add(spirit);
              const ang = (sp / 14) * Math.PI * 2;
              animatedObjects.push({
                mesh: spirit,
                update: () => {
                  spirit.position.y += 0.15;
                  spirit.position.x += Math.sin(ang) * 0.1;
                  spirit.position.z += Math.cos(ang) * 0.1;
                }
              });
            }

            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("🏆 TEBRİKLER! 14 Dünya Bossunun Füzyonu Arındırıldı! Poneix Gezegeni Kurtarıldı!", "success");
            }

            if (typeof window.confetti === 'function') {
              window.confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
            }
          }
        }
      }
    }
  }

  // --- ATTACH GLOBAL HOOKS ---
  window.__superBearPoneixLevels = {
    loadPoneixLevel,
    cleanUpPoneixRealm,
    playFoxCrashAnimation,
    PONEIX_LEVEL_MAP,
    PONEIX_LEVEL_IDS
  };

  requestAnimationFrame(updatePoneixLoop);

  function hookIntoGame() {
    const game = window.__superBearGame;
    if (game) {
      const originalLoad = game.loadRegion;
      game.loadRegion = function(regionId) {
        if (PONEIX_LEVEL_MAP[regionId]) {
          loadPoneixLevel(regionId);
          return;
        }
        cleanUpPoneixRealm(game);
        if (originalLoad) {
          return originalLoad.call(this, regionId);
        }
      };
      console.log("🪐 Poneix Gezegeni Motoru başarıyla game.loadRegion sistemine bağlandı!");
    } else {
      setTimeout(hookIntoGame, 200);
    }
  }
  hookIntoGame();

})();
