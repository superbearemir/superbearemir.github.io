// ============================================================================
// ⛰️ 15. BÖLÜM: DÜNYA FİNAL ZİRVESİ & KIRMIZI ÇİZGİ (EARTH FINAL SUMMIT)
// - DÜNYA SERÜVENİNİN BÜYÜK FİNALİ: 15 TAM AŞAMALI DEVASA 25 DAKİKALIK PARKOUR & COMBAT!
// - 15 Büyük Aşama (Stage 1 -> Stage 15)
// - Yeni Canlılar / Düşmanlar:
//   * Kızıl Gözcü Kaya Golemleri (Crimson Watcher Golems - Yer Sarsıntısı)
//   * Alevli Stratosfer Gargoyle / Wyvern (Flying Sky Wyverns - Havadan Dalış)
//   * Kızıl Kalkanlı Muhafız Şövalyeler (Crimson Shield Sentinels - Kalkan Blokajı)
//   * Moris'in Seçkin Gölge Muhafızları (Elite Shadow Guardians - Çift Hançer)
//   * 🔥 YENİ: Kızıl Magma Canavarı (Magma Beast - Volkanik Hücum Eden Canavar)
//   * 🦅 YENİ: Kanatlı Obsidyen Harpiya (Obsidian Harpy - Havadan Rüzgar Girdabı)
//   * ⚡ YENİ: Stratosfer Yıldırım Ruhu (Thunder Spirit - Dönen Plazma Küresi)
//   * 🛡️ YENİ: Demir Dev Titan Muhafızı (Iron Colossus - Ağır Gürz Darbeleri)
//   * 🗡️ YENİ: Moris Gölge Suikastçısı (Shadow Assassin - Çevik Ninjalar)
// - Gökdelen Tabanı, Zirve Seyir Terası, Çan Kulesi, Ejderha Omurgası & Şampiyon Kapısı!
// - 15. Aşamada 2-Fazlı Epik Moris Boss Düellosu & Galibiyet Portalı!
// ============================================================================

(function() {
  'use strict';

  let summitGroup = null;
  let activeMorisBoss = null;
  let victoryPortal = null;
  let summitHpBarContainer = null;
  let summitHpBarFill = null;
  let summitHpBarLabel = null;

  // Active Dynamic Level Elements
  let summitSawblades = [];
  let summitMovingPlatforms = [];
  let summitCrumblingPlatforms = [];
  let summitLaserTraps = [];
  let summitWindZones = [];
  let summitJumpPads = [];
  let summitCheckpoints = [];
  let summitRedLineBeams = [];
  let summitEnemies = [];
  let summitComets = [];

  // ============================================================================
  // HUD BOSS HP BAR HELPER
  // ============================================================================
  function ensureSummitHpBar() {
    if (summitHpBarContainer) return;
    const existing = document.getElementById('summit-moris-hp-container');
    if (existing) {
      summitHpBarContainer = existing;
      summitHpBarFill = document.getElementById('summit-moris-hp-fill');
      summitHpBarLabel = document.getElementById('summit-moris-hp-label');
      return;
    }

    const c = document.createElement('div');
    c.id = 'summit-moris-hp-container';
    c.style.position = 'fixed';
    c.style.top = '18px';
    c.style.left = '50%';
    c.style.transform = 'translateX(-50%)';
    c.style.width = 'min(440px, 86vw)';
    c.style.zIndex = '9999';
    c.style.background = 'rgba(15, 23, 42, 0.92)';
    c.style.border = '2px solid #ef4444';
    c.style.borderRadius = '14px';
    c.style.padding = '10px 14px';
    c.style.boxShadow = '0 0 25px rgba(239, 68, 68, 0.5), inset 0 0 15px rgba(0,0,0,0.8)';
    c.style.display = 'none';
    c.style.flexDirection = 'column';
    c.style.gap = '6px';
    c.style.pointerEvents = 'none';
    c.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

    const topRow = document.createElement('div');
    topRow.style.display = 'flex';
    topRow.style.justifyContent = 'space-between';
    topRow.style.alignItems = 'center';

    const titleEl = document.createElement('div');
    titleEl.id = 'summit-moris-hp-label';
    titleEl.style.color = '#fef08a';
    titleEl.style.fontWeight = '900';
    titleEl.style.fontSize = '14px';
    titleEl.style.textShadow = '0 2px 4px rgba(0,0,0,0.9)';
    titleEl.innerText = '👑 MOR AYI (MORİS) - DÜNYA FİNAL DÜELLOSU';

    topRow.appendChild(titleEl);
    c.appendChild(topRow);

    const track = document.createElement('div');
    track.style.width = '100%';
    track.style.height = '14px';
    track.style.background = 'rgba(0, 0, 0, 0.7)';
    track.style.borderRadius = '7px';
    track.style.overflow = 'hidden';
    track.style.border = '1px solid rgba(255,255,255,0.15)';

    const fill = document.createElement('div');
    fill.id = 'summit-moris-hp-fill';
    fill.style.width = '100%';
    fill.style.height = '100%';
    fill.style.background = 'linear-gradient(90deg, #dc2626, #ef4444, #f59e0b)';
    fill.style.transition = 'width 0.2s ease-out';
    fill.style.borderRadius = '7px';
    track.appendChild(fill);
    c.appendChild(track);

    document.body.appendChild(c);
    summitHpBarContainer = c;
    summitHpBarFill = fill;
    summitHpBarLabel = titleEl;
  }

  function updateSummitBossHp(current, max, phaseText = '') {
    ensureSummitHpBar();
    if (!summitHpBarContainer) return;
    if (current <= 0) {
      summitHpBarContainer.style.display = 'none';
      return;
    }
    summitHpBarContainer.style.display = 'flex';
    const pct = Math.max(0, Math.min(100, (current / max) * 100));
    if (summitHpBarFill) summitHpBarFill.style.width = pct + '%';
    if (summitHpBarLabel) {
      summitHpBarLabel.innerText = phaseText || `👑 MOR AYI (MORİS) - ${current}/${max} HP`;
    }
  }

  // ============================================================================
  // 3D MESH GENERATORS (SAWBLADES, OBELISKS & CREATURES)
  // ============================================================================

  // 1. Dönen Testere (Rotating Sawblade)
  function createSawbladeMesh(THREE, radius = 2.4, teethCount = 14) {
    const sawGroup = new THREE.Group();
    sawGroup.name = "summit_sawblade";

    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.95,
      roughness: 0.2,
      emissive: 0xef4444,
      emissiveIntensity: 0.4
    });

    const teethMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xdc2626,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.1
    });

    const disc = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.82, radius * 0.82, 0.16, 24), metalMat);
    disc.rotation.x = Math.PI / 2;
    sawGroup.add(disc);

    const hub = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.26, radius * 0.26, 0.28, 16), teethMat);
    hub.rotation.x = Math.PI / 2;
    sawGroup.add(hub);

    for (let t = 0; t < teethCount; t++) {
      const angle = (t / teethCount) * Math.PI * 2;
      const tooth = new THREE.Mesh(new THREE.ConeGeometry(radius * 0.22, radius * 0.45, 3), teethMat);
      tooth.position.set(Math.cos(angle) * radius * 0.9, Math.sin(angle) * radius * 0.9, 0);
      tooth.rotation.z = angle - Math.PI / 2;
      sawGroup.add(tooth);
    }

    return sawGroup;
  }

  // 2. Antik Kızıl Dikilitaş / Monolith
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
      emissiveIntensity: 1.2
    });

    const shaftGeo = new THREE.CylinderGeometry(width * 0.65, width, height, 4);
    const shaft = new THREE.Mesh(shaftGeo, stoneMat);
    shaft.position.y = height / 2;
    shaft.rotation.y = Math.PI / 4;
    obGroup.add(shaft);

    const capGeo = new THREE.ConeGeometry(width * 0.65, width * 1.2, 4);
    const cap = new THREE.Mesh(capGeo, runeMat);
    cap.position.y = height + (width * 1.2) / 2;
    cap.rotation.y = Math.PI / 4;
    obGroup.add(cap);

    for (let r = 1; r <= 3; r++) {
      const ringGeo = new THREE.BoxGeometry(width * 0.88, 0.28, width * 0.88);
      const runeRing = new THREE.Mesh(ringGeo, runeMat);
      runeRing.position.y = (height / 4) * r;
      runeRing.rotation.y = Math.PI / 4;
      obGroup.add(runeRing);
    }

    return obGroup;
  }

  // 3. Kızıl Gözcü Kaya Golemi (Crimson Watcher Golem)
  function createCrimsonGolemMesh(THREE) {
    const golemGroup = new THREE.Group();
    golemGroup.name = "crimson_golem";

    const rockMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9, metalness: 0.2 });
    const coreMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 1.8 });

    const torso = new THREE.Mesh(new THREE.DodecahedronGeometry(1.6, 1), rockMat);
    torso.position.y = 2.4;
    golemGroup.add(torso);

    const core = new THREE.Mesh(new THREE.SphereGeometry(0.7, 12, 12), coreMat);
    core.position.set(0, 2.4, 0.6);
    golemGroup.add(core);

    const head = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.9, 1.1), rockMat);
    head.position.set(0, 3.8, 0.2);
    golemGroup.add(head);

    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.1), coreMat);
    eyeL.position.set(-0.25, 3.85, 0.8);
    golemGroup.add(eyeL);
    const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.1), coreMat);
    eyeR.position.set(0.25, 3.85, 0.8);
    golemGroup.add(eyeR);

    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.2, 0.8), rockMat);
    armL.position.set(-1.8, 2.0, 0);
    golemGroup.add(armL);

    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.2, 0.8), rockMat);
    armR.position.set(1.8, 2.0, 0);
    golemGroup.add(armR);

    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.6, 0.9), rockMat);
    legL.position.set(-0.7, 0.8, 0);
    golemGroup.add(legL);

    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.6, 0.9), rockMat);
    legR.position.set(0.7, 0.8, 0);
    golemGroup.add(legR);

    golemGroup.userData = { armL, armR, legL, legR, head, core };
    return golemGroup;
  }

  // 4. Alevli Stratosfer Gargoyle / Wyvern (Flying Sky Wyvern)
  function createSkyWyvernMesh(THREE) {
    const wyvernGroup = new THREE.Group();
    wyvernGroup.name = "sky_wyvern";

    const skinMat = new THREE.MeshStandardMaterial({ color: 0x4c0519, roughness: 0.6, metalness: 0.3 });
    const wingMat = new THREE.MeshStandardMaterial({ color: 0x9f1239, roughness: 0.5, side: THREE.DoubleSide });
    const flameMat = new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xea580c, emissiveIntensity: 1.5 });

    const body = new THREE.Mesh(new THREE.ConeGeometry(0.7, 2.4, 8), skinMat);
    body.rotation.x = -Math.PI / 2.3;
    body.position.y = 1.2;
    wyvernGroup.add(body);

    const head = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.2, 6), skinMat);
    head.rotation.x = Math.PI / 2.3;
    head.position.set(0, 1.6, 1.2);
    wyvernGroup.add(head);

    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), flameMat);
    eyeL.position.set(-0.25, 1.7, 1.5);
    wyvernGroup.add(eyeL);
    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), flameMat);
    eyeR.position.set(0.25, 1.7, 1.5);
    wyvernGroup.add(eyeR);

    const wingL = new THREE.Group();
    wingL.position.set(-0.5, 1.4, 0.2);
    const wingMeshL = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 1.2), wingMat);
    wingMeshL.position.x = -1.2;
    wingL.add(wingMeshL);
    wyvernGroup.add(wingL);

    const wingR = new THREE.Group();
    wingR.position.set(0.5, 1.4, 0.2);
    const wingMeshR = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 1.2), wingMat);
    wingMeshR.position.x = 1.2;
    wingR.add(wingMeshR);
    wyvernGroup.add(wingR);

    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.3, 2.2, 6), skinMat);
    tail.rotation.x = Math.PI / 2.6;
    tail.position.set(0, 0.8, -1.4);
    wyvernGroup.add(tail);

    wyvernGroup.userData = { wingL, wingR, head, body };
    return wyvernGroup;
  }

  // 5. Kızıl Kalkanlı Muhafız Şövalye (Crimson Shield Sentinel)
  function createCrimsonSentinelMesh(THREE) {
    const sentGroup = new THREE.Group();
    sentGroup.name = "crimson_sentinel";

    const armorMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.2 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 0.9 });

    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.85, 1.8, 8), armorMat);
    torso.position.y = 1.8;
    sentGroup.add(torso);

    const helm = new THREE.Mesh(new THREE.SphereGeometry(0.6, 8, 8), armorMat);
    helm.position.y = 3.0;
    sentGroup.add(helm);

    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.14, 0.3), redMat);
    visor.position.set(0, 3.0, 0.5);
    sentGroup.add(visor);

    const shield = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.8, 1.2), redMat);
    shield.position.set(-1.1, 1.8, 0.5);
    sentGroup.add(shield);

    const spear = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.4, 6), armorMat);
    spear.position.set(1.1, 2.2, 0.3);
    spear.rotation.x = Math.PI / 6;
    sentGroup.add(spear);

    sentGroup.userData = { torso, helm, shield, spear };
    return sentGroup;
  }

  // 6. Moris'in Seçkin Gölge Muhafızı (Elite Shadow Guardian)
  function createShadowGuardianMesh(THREE) {
    const shadowGroup = new THREE.Group();
    shadowGroup.name = "shadow_guardian";

    const shadowMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.3, metalness: 0.8 });
    const violetMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0x9333ea, emissiveIntensity: 1.4 });

    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.65, 1.2, 4, 8), shadowMat);
    body.position.y = 1.8;
    shadowGroup.add(body);

    const cowl = new THREE.Mesh(new THREE.SphereGeometry(0.55, 8, 8), shadowMat);
    cowl.position.y = 2.8;
    shadowGroup.add(cowl);

    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.08, 0.1), violetMat);
    eyeL.position.set(-0.2, 2.85, 0.48);
    shadowGroup.add(eyeL);
    const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.08, 0.1), violetMat);
    eyeR.position.set(0.2, 2.85, 0.48);
    shadowGroup.add(eyeR);

    const daggerL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.1, 0.18), violetMat);
    daggerL.position.set(-1.0, 1.6, 0.4);
    daggerL.rotation.x = Math.PI / 4;
    shadowGroup.add(daggerL);

    const daggerR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.1, 0.18), violetMat);
    daggerR.position.set(1.0, 1.6, 0.4);
    daggerR.rotation.x = Math.PI / 4;
    shadowGroup.add(daggerR);

    shadowGroup.userData = { body, cowl, daggerL, daggerR };
    return shadowGroup;
  }

  // 7. 🔥 YENİ CANLI 1: Kızıl Magma Canavarı (Magma Beast)
  function createMagmaBeastMesh(THREE) {
    const beastGroup = new THREE.Group();
    beastGroup.name = "magma_beast";

    const crustMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.95, metalness: 0.3 });
    const lavaMat = new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xea580c, emissiveIntensity: 2.2 });

    // Volcanic quadruped body
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.3, 3.2), crustMat);
    body.position.y = 1.3;
    beastGroup.add(body);

    // Glowing magma spine plates
    for (let s = -1; s <= 1; s++) {
      const plate = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.9, 4), lavaMat);
      plate.position.set(0, 2.2, s * 0.9);
      beastGroup.add(plate);
    }

    // Heavy horned head
    const head = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.1, 1.4), crustMat);
    head.position.set(0, 1.8, 2.1);
    beastGroup.add(head);

    const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.2, 1.1, 4), lavaMat);
    hornL.position.set(-0.6, 2.5, 2.2);
    hornL.rotation.z = 0.35;
    beastGroup.add(hornL);

    const hornR = new THREE.Mesh(new THREE.ConeGeometry(0.2, 1.1, 4), lavaMat);
    hornR.position.set(0.6, 2.5, 2.2);
    hornR.rotation.z = -0.35;
    beastGroup.add(hornR);

    // 4 Sturdy rock legs
    const legFL = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.1, 0.6), crustMat);
    legFL.position.set(-1.0, 0.55, 1.1);
    beastGroup.add(legFL);

    const legFR = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.1, 0.6), crustMat);
    legFR.position.set(1.0, 0.55, 1.1);
    beastGroup.add(legFR);

    const legBL = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.1, 0.6), crustMat);
    legBL.position.set(-1.0, 0.55, -1.1);
    beastGroup.add(legBL);

    const legBR = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.1, 0.6), crustMat);
    legBR.position.set(1.0, 0.55, -1.1);
    beastGroup.add(legBR);

    beastGroup.userData = { body, head, legFL, legFR, legBL, legBR };
    return beastGroup;
  }

  // 8. 🦅 YENİ CANLI 2: Kanatlı Obsidyen Harpiya (Obsidian Harpy)
  function createObsidianHarpyMesh(THREE) {
    const harpyGroup = new THREE.Group();
    harpyGroup.name = "obsidian_harpy";

    const obsidianMat = new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.3, metalness: 0.85 });
    const featherMat = new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.5, side: THREE.DoubleSide });
    const rubyMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 2.0 });

    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.7, 1.9, 8), obsidianMat);
    torso.position.y = 1.4;
    harpyGroup.add(torso);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.48, 8, 8), obsidianMat);
    head.position.set(0, 2.5, 0.2);
    harpyGroup.add(head);

    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.65, 4), rubyMat);
    beak.rotation.x = Math.PI / 2;
    beak.position.set(0, 2.4, 0.7);
    harpyGroup.add(beak);

    const wingL = new THREE.Group();
    wingL.position.set(-0.55, 1.7, 0);
    const wingMeshL = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.1, 1.1), featherMat);
    wingMeshL.position.x = -1.3;
    wingL.add(wingMeshL);
    harpyGroup.add(wingL);

    const wingR = new THREE.Group();
    wingR.position.set(0.55, 1.7, 0);
    const wingMeshR = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.1, 1.1), featherMat);
    wingMeshR.position.x = 1.3;
    wingR.add(wingMeshR);
    harpyGroup.add(wingR);

    harpyGroup.userData = { torso, head, wingL, wingR };
    return harpyGroup;
  }

  // 9. ⚡ YENİ CANLI 3: Stratosfer Yıldırım Ruhu (Thunder Spirit)
  function createThunderSpiritMesh(THREE) {
    const spiritGroup = new THREE.Group();
    spiritGroup.name = "thunder_spirit";

    const plasmaMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 2.5,
      roughness: 0.1
    });

    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xeab308,
      emissiveIntensity: 2.0,
      roughness: 0.2
    });

    const core = new THREE.Mesh(new THREE.SphereGeometry(0.85, 16, 16), plasmaMat);
    core.position.y = 1.6;
    spiritGroup.add(core);

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.12, 8, 24), ringMat);
    ring1.position.y = 1.6;
    spiritGroup.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.09, 8, 24), plasmaMat);
    ring2.position.y = 1.6;
    ring2.rotation.x = Math.PI / 2;
    spiritGroup.add(ring2);

    spiritGroup.userData = { core, ring1, ring2 };
    return spiritGroup;
  }

  // 10. 🛡️ YENİ CANLI 4: Demir Dev Titan Muhafızı (Iron Colossus)
  function createIronColossusMesh(THREE) {
    const titanGroup = new THREE.Group();
    titanGroup.name = "iron_colossus";

    const ironMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.95, roughness: 0.2 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.3, emissive: 0xb45309, emissiveIntensity: 0.4 });
    const glowMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 2.0 });

    const torso = new THREE.Mesh(new THREE.BoxGeometry(2.6, 3.2, 1.8), ironMat);
    torso.position.y = 3.2;
    titanGroup.add(torso);

    const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.4, 0.4), brassMat);
    chestPlate.position.set(0, 3.5, 1.0);
    titanGroup.add(chestPlate);

    const head = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.2, 1.3), ironMat);
    head.position.set(0, 5.2, 0);
    titanGroup.add(head);

    const visor = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.2, 0.3), glowMat);
    visor.position.set(0, 5.2, 0.7);
    titanGroup.add(visor);

    // Pauldrons
    const pauldronL = new THREE.Mesh(new THREE.SphereGeometry(0.9, 8, 8), brassMat);
    pauldronL.position.set(-1.8, 4.4, 0);
    titanGroup.add(pauldronL);
    const pauldronR = new THREE.Mesh(new THREE.SphereGeometry(0.9, 8, 8), brassMat);
    pauldronR.position.set(1.8, 4.4, 0);
    titanGroup.add(pauldronR);

    // Giant War Hammer
    const hammerHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 4.4, 8), ironMat);
    hammerHandle.position.set(2.2, 3.2, 0.5);
    hammerHandle.rotation.x = Math.PI / 4;
    titanGroup.add(hammerHandle);

    const hammerHead = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 2.2), brassMat);
    hammerHead.position.set(2.2, 4.6, 1.8);
    titanGroup.add(hammerHead);

    const legL = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.2, 1.1), ironMat);
    legL.position.set(-0.8, 1.1, 0);
    titanGroup.add(legL);

    const legR = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.2, 1.1), ironMat);
    legR.position.set(0.8, 1.1, 0);
    titanGroup.add(legR);

    titanGroup.userData = { torso, head, pauldronL, pauldronR, hammerHandle, hammerHead, legL, legR };
    return titanGroup;
  }

  // 11. 🗡️ YENİ CANLI 5: Moris Gölge Suikastçısı (Shadow Assassin)
  function createMorisAssassinMesh(THREE) {
    const ninjaGroup = new THREE.Group();
    ninjaGroup.name = "moris_assassin";

    const suitMat = new THREE.MeshStandardMaterial({ color: 0x4c0519, roughness: 0.4, metalness: 0.6 });
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xdc2626, emissiveIntensity: 1.8 });

    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.55, 1.1, 4, 8), suitMat);
    body.position.y = 1.6;
    ninjaGroup.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), suitMat);
    head.position.y = 2.5;
    ninjaGroup.add(head);

    // Fox Ears
    const earL = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 4), bladeMat);
    earL.position.set(-0.35, 3.0, 0);
    ninjaGroup.add(earL);
    const earR = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 4), bladeMat);
    earR.position.set(0.35, 3.0, 0);
    ninjaGroup.add(earR);

    // Dual Daggers
    const dL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.3, 0.22), bladeMat);
    dL.position.set(-0.9, 1.4, 0.5);
    dL.rotation.x = Math.PI / 3;
    ninjaGroup.add(dL);

    const dR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.3, 0.22), bladeMat);
    dR.position.set(0.9, 1.4, 0.5);
    dR.rotation.x = Math.PI / 3;
    ninjaGroup.add(dR);

    ninjaGroup.userData = { body, head, dL, dR };
    return ninjaGroup;
  }

  // 12. Mor Ayı (Kardeşimiz Moris) Boss Mesh
  function createMorisBossMesh(THREE) {
    const bossGroup = new THREE.Group();
    bossGroup.name = "moris_summit_boss";

    const furMat = new THREE.MeshStandardMaterial({ color: 0x6b21a8, roughness: 0.75, metalness: 0.1 });
    const armorMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.25 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85, roughness: 0.2, emissive: 0xb45309, emissiveIntensity: 0.35 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 1.8 });

    const torso = new THREE.Mesh(new THREE.BoxGeometry(2.6, 3.4, 2.2), furMat);
    torso.position.y = 3.2;
    bossGroup.add(torso);

    const chestArmor = new THREE.Mesh(new THREE.BoxGeometry(2.7, 1.8, 0.4), armorMat);
    chestArmor.position.set(0, 3.4, 1.15);
    bossGroup.add(chestArmor);

    const head = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.6, 1.7), furMat);
    head.position.set(0, 5.3, 0.2);
    bossGroup.add(head);

    const snout = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.8), furMat);
    snout.position.set(0, 4.9, 1.2);
    bossGroup.add(snout);

    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.18, 6, 6), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
    nose.position.set(0, 5.1, 1.65);
    bossGroup.add(nose);

    const earL = new THREE.Mesh(new THREE.SphereGeometry(0.35, 6, 6), furMat);
    earL.position.set(-0.8, 6.1, 0.1);
    bossGroup.add(earL);
    const earR = new THREE.Mesh(new THREE.SphereGeometry(0.35, 6, 6), furMat);
    earR.position.set(0.8, 6.1, 0.1);
    bossGroup.add(earR);

    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.15, 0.1), eyeMat);
    eyeL.position.set(-0.4, 5.4, 1.06);
    bossGroup.add(eyeL);
    const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.15, 0.1), eyeMat);
    eyeR.position.set(0.4, 5.4, 1.06);
    bossGroup.add(eyeR);

    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.9, 2.8, 0.9), furMat);
    armL.position.set(-1.8, 3.0, 0);
    bossGroup.add(armL);

    const armRGroup = new THREE.Group();
    armRGroup.position.set(1.8, 4.2, 0);
    const armRMesh = new THREE.Mesh(new THREE.BoxGeometry(0.9, 2.8, 0.9), furMat);
    armRMesh.position.y = -1.2;
    armRGroup.add(armRMesh);

    // Moris's Colossal Tenrex War Hammer
    const hammerHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 4.8, 8), armorMat);
    hammerHandle.position.set(0, -1.2, 1.2);
    hammerHandle.rotation.x = Math.PI / 3;
    armRGroup.add(hammerHandle);

    const hammerHead = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 2.6), goldMat);
    hammerHead.position.set(0, 0.4, 2.8);
    armRGroup.add(hammerHead);
    bossGroup.add(armRGroup);

    const legL = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.0, 1.1), furMat);
    legL.position.set(-0.8, 1.0, 0);
    bossGroup.add(legL);
    const legR = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.0, 1.1), furMat);
    legR.position.set(0.8, 1.0, 0);
    bossGroup.add(legR);

    const rageAura = new THREE.Mesh(
      new THREE.SphereGeometry(3.8, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xef4444, wireframe: true, transparent: true, opacity: 0.0 })
    );
    rageAura.position.y = 3.6;
    bossGroup.add(rageAura);

    bossGroup.userData = { armRGroup, legL, legR, head, hammerHead, rageAura, eyeL, eyeR };
    return { group: bossGroup, parts: bossGroup.userData };
  }

  // ============================================================================
  // MASTER POPULATE EARTH SUMMIT (15 FULL STAGES, 25-MINUTE ADVENTURE)
  // ============================================================================
  function populateEarthSummit(game) {
    if (!game || !game.scene || !window.THREE) return;
    const THREE = window.THREE;

    console.log("⛰️ Populating 15. Bölüm: Dünya Final Zirvesi & Kırmızı Çizgi (15-Stage Epic Finale)...");

    cleanUpEarthSummit(game);

    summitGroup = new THREE.Group();
    summitGroup.name = "earth_summit_level_mesh";
    game.scene.add(summitGroup);

    // Expansive Level Bounds - Never clamp or restrict player!
    if (game.currentLevel) {
      game.currentLevel.bounds = {
        minX: -5000,
        maxX: 5000,
        minZ: -5000,
        maxZ: 5000,
        minY: -300,
        maxY: 1500,
        disabled: true
      };
      game.currentLevel.invisibleWallMeshes = [];
      if (!game.currentLevel.colliders) game.currentLevel.colliders = [];
      if (!game.currentLevel.collectibles) game.currentLevel.collectibles = [];
      if (!game.currentLevel.enemies) game.currentLevel.enemies = [];
      if (!game.currentLevel.checkpoints) game.currentLevel.checkpoints = [];
      if (!game.currentLevel.jumpPads) game.currentLevel.jumpPads = [];
      if (!game.currentLevel.movingPlatforms) game.currentLevel.movingPlatforms = [];
      
      // Starting Spawn Point at Basecamp
      if (!game.currentLevel.spawnPoint) game.currentLevel.spawnPoint = new THREE.Vector3(0, 4.0, 90);
      else game.currentLevel.spawnPoint.set(0, 4.0, 90);
    }

    // Reset Arrays
    summitSawblades = [];
    summitMovingPlatforms = [];
    summitCrumblingPlatforms = [];
    summitLaserTraps = [];
    summitWindZones = [];
    summitJumpPads = [];
    summitCheckpoints = [];
    summitRedLineBeams = [];
    summitEnemies = [];
    summitComets = [];
    activeMorisBoss = null;
    victoryPortal = null;

    // Atmospheric Crimson & Twilight Lighting
    game.scene.background = new THREE.Color(0x1a0515);
    game.scene.fog = new THREE.FogExp2(0x2d0619, 0.0016);

    const summitSun = new THREE.DirectionalLight(0xff7744, 2.2);
    summitSun.position.set(120, 220, 60);
    summitSun.castShadow = true;
    summitGroup.add(summitSun);

    const summitAmbient = new THREE.AmbientLight(0x701a75, 0.95);
    summitGroup.add(summitAmbient);

    const redLineRim = new THREE.DirectionalLight(0xef4444, 2.0);
    redLineRim.position.set(0, 40, -1800);
    summitGroup.add(redLineRim);

    // Master Materials
    const basaltMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.85, metalness: 0.25 });
    const mountainRockMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 });
    const redCrystalMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xdc2626, emissiveIntensity: 0.9, roughness: 0.2 });
    const goldMetalMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9, roughness: 0.2, emissive: 0xb45309, emissiveIntensity: 0.4 });
    const crumblingMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.95, emissive: 0x7f1d1d, emissiveIntensity: 0.35 });
    const redLineMat = new THREE.MeshBasicMaterial({ color: 0xff0033 });
    const dragonBoneMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.8, metalness: 0.1 });

    // Helper Builders
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

    function addSummitMovingPlatform(x, y, z, w, d, axis = 'x', amplitude = 12.0, speed = 1.4) {
      const platGroup = new THREE.Group();
      platGroup.position.set(x, y, z);

      const platMesh = new THREE.Mesh(new THREE.BoxGeometry(w, 1.8, d), goldMetalMat);
      platMesh.receiveShadow = true;
      platGroup.add(platMesh);

      const border = new THREE.Mesh(new THREE.BoxGeometry(w + 0.3, 0.4, d + 0.3), redCrystalMat);
      border.position.y = 0.8;
      platGroup.add(border);

      summitGroup.add(platGroup);

      const hs = new THREE.Vector3(w / 2, 0.9, d / 2);
      const colliderObj = {
        min: new THREE.Vector3(x - hs.x, y - hs.y, z - hs.z),
        max: new THREE.Vector3(x + hs.x, y + hs.y, z + hs.z),
        isSummitMovingPlatform: true,
        isFloor: true
      };

      if (game.currentLevel && game.currentLevel.colliders) {
        game.currentLevel.colliders.push(colliderObj);
      }

      summitMovingPlatforms.push({
        mesh: platGroup,
        basePos: new THREE.Vector3(x, y, z),
        currentPos: new THREE.Vector3(x, y, z),
        prevPos: new THREE.Vector3(x, y, z),
        axis: axis,
        amplitude: amplitude,
        speed: speed,
        halfSize: hs,
        collider: colliderObj
      });
      return platGroup;
    }

    function addSummitCrumblingPlatform(x, y, z, w = 6.0, d = 6.0) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, 1.4, d), crumblingMat);
      mesh.position.set(x, y, z);
      summitGroup.add(mesh);

      const ring = new THREE.Mesh(new THREE.BoxGeometry(w + 0.2, 0.25, d + 0.2), redCrystalMat);
      ring.position.y = 0.65;
      mesh.add(ring);

      const collider = {
        min: new THREE.Vector3(x - w / 2, y - 0.7, z - d / 2),
        max: new THREE.Vector3(x + w / 2, y + 0.7, z + d / 2),
        isFloor: true,
        isCrumblingFloor: true
      };
      if (game.currentLevel && game.currentLevel.colliders) {
        game.currentLevel.colliders.push(collider);
      }

      summitCrumblingPlatforms.push({
        mesh: mesh,
        basePos: new THREE.Vector3(x, y, z),
        w: w,
        d: d,
        state: 'idle',
        timer: 0,
        fallSpeed: 0,
        collider: collider
      });
      return mesh;
    }

    function addSummitLaserTrap(x, y, z, length = 18.0, rotSpeed = 1.8, beamCount = 4) {
      const trapGroup = new THREE.Group();
      trapGroup.position.set(x, y, z);

      const pylon = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.1, 2.4, 8), basaltMat);
      pylon.position.y = 1.2;
      trapGroup.add(pylon);

      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.65, 12, 12), redCrystalMat);
      orb.position.y = 2.4;
      trapGroup.add(orb);

      const beamsGroup = new THREE.Group();
      beamsGroup.position.y = 2.4;
      trapGroup.add(beamsGroup);

      for (let b = 0; b < beamCount; b++) {
        const beamMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, length, 8), redLineMat);
        beamMesh.rotation.z = Math.PI / 2;
        beamMesh.position.x = length / 2;
        const beamArm = new THREE.Group();
        beamArm.rotation.y = (b / beamCount) * Math.PI * 2;
        beamArm.add(beamMesh);
        beamsGroup.add(beamArm);
      }

      summitGroup.add(trapGroup);

      summitLaserTraps.push({
        group: trapGroup,
        beams: beamsGroup,
        centerPos: new THREE.Vector3(x, y + 2.4, z),
        rotSpeed: rotSpeed,
        length: length,
        beamCount: beamCount,
        angle: 0
      });
      return trapGroup;
    }

    function addSummitWindZone(minX, maxX, minY, maxY, minZ, maxZ, forceX = 14.0) {
      summitWindZones.push({
        min: new THREE.Vector3(minX, minY, minZ),
        max: new THREE.Vector3(maxX, maxY, maxZ),
        forceX: forceX
      });
    }

    function addSummitJumpPad(x, y, z, power = 22) {
      const padGroup = new THREE.Group();
      padGroup.position.set(x, y, z);

      const base = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 0.4, 16), basaltMat);
      padGroup.add(base);

      const spring = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.25, 16), redCrystalMat);
      spring.position.y = 0.25;
      padGroup.add(spring);

      summitGroup.add(padGroup);

      summitJumpPads.push({
        pos: new THREE.Vector3(x, y + 0.3, z),
        power: power
      });
      return padGroup;
    }

    function addSummitCheckpoint(pos, name, isInitial = false) {
      const cpGroup = new THREE.Group();
      cpGroup.position.copy(pos);

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.4, 0.14, 8, 24),
        new THREE.MeshStandardMaterial({
          color: isInitial ? 0x10b981 : 0xef4444,
          emissive: isInitial ? 0x059669 : 0xdc2626,
          emissiveIntensity: 1.5
        })
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.2;
      cpGroup.add(ring);

      summitGroup.add(cpGroup);

      summitCheckpoints.push({
        pos: pos.clone(),
        name: name,
        active: isInitial,
        mesh: cpGroup,
        ring: ring
      });

      if (game.currentLevel && game.currentLevel.checkpoints) {
        game.currentLevel.checkpoints.push({
          pos: pos.clone(),
          name: name,
          active: isInitial,
          mesh: cpGroup
        });
      }
    }

    function addSummitCoin(x, y, z) {
      const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.12, 12), goldMetalMat);
      coin.position.set(x, y, z);
      coin.rotation.z = Math.PI / 2;
      summitGroup.add(coin);
      if (game.currentLevel && game.currentLevel.collectibles) {
        game.currentLevel.collectibles.push({
          pos: new THREE.Vector3(x, y, z),
          type: "coin",
          value: 10,
          mesh: coin,
          collected: false
        });
      }
    }

    function spawnSummitEnemy(type, x, y, z, patrolRange = 12.0) {
      let meshObj = null;
      let hp = 45;
      let damage = 14;

      if (type === 'golem') {
        meshObj = createCrimsonGolemMesh(THREE);
        hp = 70;
        damage = 18;
      } else if (type === 'wyvern') {
        meshObj = createSkyWyvernMesh(THREE);
        hp = 40;
        damage = 14;
      } else if (type === 'sentinel') {
        meshObj = createCrimsonSentinelMesh(THREE);
        hp = 60;
        damage = 16;
      } else if (type === 'shadow_guard') {
        meshObj = createShadowGuardianMesh(THREE);
        hp = 50;
        damage = 16;
      } else if (type === 'magma_beast') {
        meshObj = createMagmaBeastMesh(THREE);
        hp = 85;
        damage = 20;
      } else if (type === 'obsidian_harpy') {
        meshObj = createObsidianHarpyMesh(THREE);
        hp = 55;
        damage = 18;
      } else if (type === 'thunder_spirit') {
        meshObj = createThunderSpiritMesh(THREE);
        hp = 45;
        damage = 16;
      } else if (type === 'iron_colossus') {
        meshObj = createIronColossusMesh(THREE);
        hp = 120;
        damage = 25;
      } else if (type === 'moris_assassin') {
        meshObj = createMorisAssassinMesh(THREE);
        hp = 65;
        damage = 22;
      }

      if (!meshObj) return;
      meshObj.position.set(x, y, z);
      summitGroup.add(meshObj);

      summitEnemies.push({
        type: type,
        mesh: meshObj,
        pos: meshObj.position,
        basePos: new THREE.Vector3(x, y, z),
        patrolRange: patrolRange,
        hp: hp,
        maxHp: hp,
        damage: damage,
        state: 'patrol',
        animTime: Math.random() * 10,
        lastAttackTime: 0,
        lastHitTime: 0,
        isDead: false
      });
    }

    // =========================================================================
    // 🚩 THE 15 EPIC STAGES OF EARTH SUMMIT
    // =========================================================================

    // =========================================================================
    // AŞAMA 1: STRATOSFER EŞİĞİ & KADİM DİKİLİTAŞ SIRTI (z: 100 -> -60)
    // =========================================================================
    addSummitBlock(0, 2.0, 90, 28, 3.5, 28, basaltMat);
    addSummitCheckpoint(new THREE.Vector3(0, 3.75, 90), "1. Aşama: Stratosfer Başlangıç Kampı", true);

    const loreObelisk = createObeliskMesh(THREE, 14, 2.8);
    loreObelisk.position.set(0, 3.75, 102);
    summitGroup.add(loreObelisk);

    addSummitBlock(-18, 6.0, 90, 10, 12, 28, mountainRockMat);
    addSummitBlock(18, 6.0, 90, 10, 12, 28, mountainRockMat);

    const stage1Steps = [
      { x: 0, y: 3.5, z: 66, w: 8, d: 8, crumble: false },
      { x: -5, y: 5.0, z: 50, w: 7, d: 7, crumble: false },
      { x: 5, y: 7.0, z: 34, w: 6, d: 6, crumble: true },
      { x: 0, y: 9.0, z: 18, w: 8, d: 8, crumble: false },
      { x: -7, y: 11.5, z: 2, w: 6, d: 6, crumble: true },
      { x: 7, y: 14.0, z: -14, w: 7, d: 7, crumble: false },
      { x: 0, y: 16.5, z: -30, w: 8, d: 8, crumble: false }
    ];

    stage1Steps.forEach((st, idx) => {
      if (st.crumble) addSummitCrumblingPlatform(st.x, st.y, st.z, st.w, st.d);
      else addSummitBlock(st.x, st.y, st.z, st.w, 3.0, st.d, basaltMat);
      addSummitCoin(st.x, st.y + 2.5, st.z);
    });

    spawnSummitEnemy('golem', -12, 6.0, 50, 8);
    spawnSummitEnemy('golem', 12, 11.0, 14, 8);

    addSummitJumpPad(7, 16.5, -30, 22);

    addSummitBlock(0, 17.0, -60, 14, 3.0, 14, basaltMat);
    addSummitCheckpoint(new THREE.Vector3(0, 18.5, -60), "1. Aşama Sonu: Dikilitaş Sırtı Zirvesi");

    // =========================================================================
    // AŞAMA 2: DÖNEN TESTERELER KANYONU & LAZERLER (z: -80 -> -260)
    // =========================================================================
    addSummitBlock(0, 18.0, -100, 6, 2.5, 48, basaltMat);

    const saw1 = createSawbladeMesh(THREE, 2.8, 16);
    saw1.position.set(0, 19.8, -100);
    summitGroup.add(saw1);
    summitSawblades.push({
      mesh: saw1,
      type: 'sliding_x',
      basePos: new THREE.Vector3(0, 19.8, -100),
      amplitude: 5.5,
      speed: 3.2,
      damage: 18,
      radius: 2.8
    });

    addSummitLaserTrap(0, 19.0, -135, 18.0, 1.4, 2);

    addSummitBlock(0, 21.0, -170, 16, 3.0, 16, basaltMat);
    spawnSummitEnemy('wyvern', -6, 26.0, -170, 12);
    spawnSummitEnemy('wyvern', 6, 26.0, -170, 12);

    addSummitBlock(-7, 23.0, -210, 6, 2.5, 42, basaltMat);
    addSummitBlock(7, 23.0, -210, 6, 2.5, 42, basaltMat);

    const saw2 = createSawbladeMesh(THREE, 2.8, 16);
    saw2.position.set(0, 25.0, -210);
    summitGroup.add(saw2);
    summitSawblades.push({
      mesh: saw2,
      type: 'sliding_x',
      basePos: new THREE.Vector3(0, 25.0, -210),
      amplitude: 7.2,
      speed: 3.6,
      damage: 18,
      radius: 2.8
    });

    addSummitLaserTrap(0, 24.0, -235, 16.0, -1.6, 2);

    addSummitBlock(0, 26.0, -260, 14, 3.0, 14, basaltMat);
    addSummitCheckpoint(new THREE.Vector3(0, 27.5, -260), "2. Aşama: Testereler Kanyonu Zirvesi");

    // =========================================================================
    // AŞAMA 3: KADİM GÖK KALESİ & KIZIL ŞAFAK DİNLENME ŞALESİ (z: -280 -> -420)
    // =========================================================================
    addSummitBlock(0, 28.0, -290, 14, 3.0, 20, basaltMat);

    // Dinlenme Yeri Güvenli Giriş Patikası
    addSummitBlock(-7, 29.0, -292, 6, 2.5, 6, basaltMat);
    addSummitBlock(-12, 32.0, -294, 6, 2.5, 6, basaltMat);
    addSummitBlock(-16, 35.0, -295, 6, 2.5, 6, basaltMat);
    addSummitBlock(-20, 37.5, -296, 6, 2.5, 6, basaltMat);
    addSummitBlock(-25, 38.5, -298, 6, 2.5, 6, goldMetalMat);

    addSummitCheckpoint(new THREE.Vector3(-36.0, 40.0, -300.0), "3. Aşama: Kızıl Şafak Dinlenme Şalesi & Moris Otağı");

    // Ara Bağlantı Köprüsü
    addSummitBlock(0, 29.2, -312, 10, 2.5, 8, basaltMat);

    const castleArchL = createObeliskMesh(THREE, 22, 3.2);
    castleArchL.position.set(-10, 29.5, -315);
    summitGroup.add(castleArchL);

    const castleArchR = createObeliskMesh(THREE, 22, 3.2);
    castleArchR.position.set(10, 29.5, -315);
    summitGroup.add(castleArchR);

    addSummitCrumblingPlatform(0, 30.5, -325, 7, 7);
    addSummitCrumblingPlatform(-6, 32.0, -345, 6, 6);
    addSummitCrumblingPlatform(6, 33.5, -365, 6, 6);
    addSummitCrumblingPlatform(0, 35.0, -385, 7, 7);

    spawnSummitEnemy('sentinel', -6, 33.0, -345, 6);
    spawnSummitEnemy('sentinel', 6, 34.5, -365, 6);

    addSummitBlock(0, 36.0, -410, 16, 3.0, 16, basaltMat);
    addSummitCheckpoint(new THREE.Vector3(0, 37.5, -410), "3. Aşama Sonu: Gök Kalesi Harabeleri");
    addSummitJumpPad(0, 37.5, -410, 24);

    // =========================================================================
    // AŞAMA 4: STRATOSFER FIRTINA GEÇİDİ & RÜZGAR AKIMLARI (z: -430 -> -620)
    // =========================================================================
    addSummitBlock(0, 42.0, -450, 8, 2.5, 30, basaltMat);
    addSummitWindZone(-15, 15, 40, 50, -480, -430, 12.0);

    addSummitMovingPlatform(0, 44.0, -490, 8, 8, 'x', 14.0, 1.6);
    addSummitMovingPlatform(0, 46.0, -525, 8, 8, 'x', -14.0, 1.8);

    addSummitBlock(0, 47.0, -560, 14, 3.0, 22, basaltMat);
    addSummitWindZone(-15, 15, 45, 55, -580, -540, -14.0);
    spawnSummitEnemy('wyvern', -5, 52.0, -560, 10);
    spawnSummitEnemy('wyvern', 5, 52.0, -560, 10);

    const windSaw = createSawbladeMesh(THREE, 3.2, 18);
    windSaw.position.set(0, 50.0, -580);
    summitGroup.add(windSaw);
    summitSawblades.push({
      mesh: windSaw,
      type: 'sliding_x',
      basePos: new THREE.Vector3(0, 50.0, -580),
      amplitude: 8.5,
      speed: 4.2,
      damage: 20,
      radius: 3.2
    });

    addSummitBlock(0, 50.0, -620, 16, 3.0, 16, basaltMat);
    addSummitCheckpoint(new THREE.Vector3(0, 51.5, -620), "4. Aşama: Fırtına Geçidi Zirvesi");
    addSummitJumpPad(0, 51.5, -620, 22);

    // =========================================================================
    // AŞAMA 5: GÖKDELEN YOLU & 90M TİTAN DİKİLİTAŞI (z: -630 -> -880)
    // (Zorluklar: Ateşli Sarkaç, Magma Canavarı, Lazerler ve Uçan Harpiyalar!)
    // =========================================================================
    addSummitBlock(0, 50.5, -645, 14, 3.0, 16, basaltMat);
    addSummitCoin(0, 53.0, -645);

    // Zorluk: Köprü üzerinde sarkaç testere
    const bridgeSaw = createSawbladeMesh(THREE, 2.6, 14);
    bridgeSaw.position.set(0, 52.0, -645);
    summitGroup.add(bridgeSaw);
    summitSawblades.push({
      mesh: bridgeSaw,
      type: 'sliding_x',
      basePos: new THREE.Vector3(0, 52.0, -645),
      amplitude: 5.5,
      speed: 3.8,
      damage: 18,
      radius: 2.6
    });

    // Zorluk: Dönen hareketli zemin ve Magma Canavarı
    addSummitMovingPlatform(0, 50.8, -675, 12, 12, 'x', 8.0, 1.5);
    spawnSummitEnemy('magma_beast', 0, 53.0, -675, 6);

    // Gökdelen Yaklaşım Kapısı
    addSummitBlock(0, 51.0, -705, 18, 3.5, 20, basaltMat);
    addSummitCheckpoint(new THREE.Vector3(0, 52.8, -705), "5. Aşama Girişi: Gökdelen Yaklaşım Kapısı");
    addSummitLaserTrap(0, 52.0, -705, 14.0, 1.6, 2);

    const approachPillarL = createObeliskMesh(THREE, 30, 3.5);
    approachPillarL.position.set(-11, 51.0, -705);
    summitGroup.add(approachPillarL);
    const approachPillarR = createObeliskMesh(THREE, 30, 3.5);
    approachPillarR.position.set(11, 51.0, -705);
    summitGroup.add(approachPillarR);

    // Çöken Köprü ve Harpiya Saldırısı
    addSummitCrumblingPlatform(0, 51.2, -730, 12, 12);
    spawnSummitEnemy('obsidian_harpy', 0, 56.0, -730, 10);
    addSummitJumpPad(0, 52.5, -730, 20);

    // 🏙️ Dev Gökdelen Taban Meydanı
    addSummitBlock(0, 51.0, -750, 44, 4.0, 44, basaltMat);
    addSummitCheckpoint(new THREE.Vector3(0, 53.0, -750), "5. Aşama: Dev Gökdelen Tabanı");

    const titanMonolith = createObeliskMesh(THREE, 90, 14.0);
    titanMonolith.position.set(0, 48.0, -750);
    summitGroup.add(titanMonolith);

    // Gökdelen Dikey Ekspres Gayzeri
    addSummitJumpPad(14, 53.0, -750, 46);

    // Spiral Tırmanış Basamakları
    const spiralStepCount = 16;
    for (let sp = 0; sp < spiralStepCount; sp++) {
      const angle = (sp / spiralStepCount) * Math.PI * 3.5;
      const radius = 16.0;
      const stepX = Math.cos(angle) * radius;
      const stepZ = -750 + Math.sin(angle) * radius;
      const stepY = 53.0 + sp * 1.8;

      if (sp % 4 === 2) {
        addSummitCrumblingPlatform(stepX, stepY, stepZ, 7.5, 7.5);
      } else {
        addSummitBlock(stepX, stepY, stepZ, 7.5, 2.0, 7.5, basaltMat);
      }
      addSummitCoin(stepX, stepY + 2.2, stepZ);

      if (sp === 5 || sp === 11) {
        const spiralSaw = createSawbladeMesh(THREE, 2.0, 12);
        spiralSaw.position.set(stepX, stepY + 1.8, stepZ);
        summitGroup.add(spiralSaw);
        summitSawblades.push({
          mesh: spiralSaw,
          type: 'stationary_spin',
          basePos: new THREE.Vector3(stepX, stepY + 1.8, stepZ),
          speed: 6.0,
          damage: 14,
          radius: 2.0
        });
      }
    }

    // 🌟 Gökdelen Zirve Seyir Terası
    addSummitBlock(0, 81.0, -795, 20, 3.0, 20, goldMetalMat);
    addSummitCheckpoint(new THREE.Vector3(0, 83.0, -795), "5B. Gökdelen Zirve Seyir Terası");
    addSummitJumpPad(0, 83.0, -795, 24);
    spawnSummitEnemy('golem', -5, 83.0, -795, 6);
    spawnSummitEnemy('wyvern', 5, 88.0, -795, 10);

    addSummitMovingPlatform(0, 78.0, -840, 12, 12, 'y', 14.0, 1.2);

    addSummitBlock(0, 72.0, -880, 18, 3.0, 18, basaltMat);
    addSummitCheckpoint(new THREE.Vector3(0, 73.5, -880), "5. Aşama Sonu: Titan Dikilitaş Zirvesi");
    addSummitJumpPad(0, 73.5, -880, 26);

    // =========================================================================
    // AŞAMA 6: KIRMIZI ÇİZGİ UÇURUMU & GÖLGE MUHAFIZLARI (z: -900 -> -1050)
    // =========================================================================
    addSummitBlock(0, 70.0, -905, 12, 2.5, 16, basaltMat);
    addSummitBlock(0, 68.0, -930, 12, 2.5, 36, basaltMat);
    addSummitLaserTrap(0, 69.0, -960, 20.0, 1.5, 4);

    addSummitMovingPlatform(-8, 64.0, -1000, 8, 8, 'z', 16.0, 1.8);
    addSummitMovingPlatform(8, 60.0, -1030, 8, 8, 'x', 14.0, 2.0);

    addSummitBlock(0, 56.0, -1050, 16, 3.0, 24, basaltMat);
    addSummitCheckpoint(new THREE.Vector3(0, 57.5, -1050), "6. Aşama: Kırmızı Çizgi Uçurumu");
    spawnSummitEnemy('shadow_guard', 0, 58.0, -1050, 8);

    // =========================================================================
    // AŞAMA 7: PLAZMA KANYONU & OBSİDYEN ASMA KÖPRÜLERİ (z: -1060 -> -1220)
    // =========================================================================
    for (let c = 1; c <= 4; c++) {
      const pz = -1060 - c * 32;
      const px = (c % 2 === 0 ? 8 : -8);
      const py = 56 - c * 1.5;
      addSummitBlock(px, py, pz, 10, 2.5, 18, basaltMat);
      addSummitCoin(px, py + 2.5, pz);
      if (c === 2) {
        addSummitLaserTrap(px, py + 1.5, pz, 14.0, 2.0, 3);
      }
      if (c === 3) {
        spawnSummitEnemy('obsidian_harpy', px, py + 5.0, pz, 10);
      }
    }

    addSummitMovingPlatform(0, 50.0, -1190, 10, 10, 'y', 8.0, 1.6);
    addSummitBlock(0, 48.0, -1220, 18, 3.0, 18, basaltMat);
    addSummitCheckpoint(new THREE.Vector3(0, 49.5, -1220), "7. Aşama: Plazma Kanyonu Zirvesi");
    addSummitJumpPad(0, 49.5, -1220, 24);

    // =========================================================================
    // AŞAMA 8: DÖNEN ÇEKİÇLER & SALLANAN SARKAÇ GÜLLELER LABİRENTİ (z: -1230 -> -1400)
    // =========================================================================
    addSummitBlock(0, 48.0, -1260, 14, 3.0, 40, basaltMat);

    // 2 Tane dev sallanan sarkaç testere
    const heavySaw1 = createSawbladeMesh(THREE, 3.6, 20);
    heavySaw1.position.set(0, 50.0, -1250);
    summitGroup.add(heavySaw1);
    summitSawblades.push({
      mesh: heavySaw1,
      type: 'sliding_x',
      basePos: new THREE.Vector3(0, 50.0, -1250),
      amplitude: 7.0,
      speed: 4.0,
      damage: 22,
      radius: 3.6
    });

    const heavySaw2 = createSawbladeMesh(THREE, 3.6, 20);
    heavySaw2.position.set(0, 50.0, -1275);
    summitGroup.add(heavySaw2);
    summitSawblades.push({
      mesh: heavySaw2,
      type: 'sliding_x',
      basePos: new THREE.Vector3(0, 50.0, -1275),
      amplitude: -7.0,
      speed: 4.2,
      damage: 22,
      radius: 3.6
    });

    addSummitMovingPlatform(0, 48.0, -1310, 10, 10, 'z', 16.0, 1.8);

    addSummitBlock(0, 49.0, -1350, 18, 3.0, 26, basaltMat);
    // YENİ CANAVAR: Demir Dev Titan Muhafızı!
    spawnSummitEnemy('iron_colossus', 0, 51.0, -1350, 8);

    addSummitBlock(0, 49.5, -1400, 16, 3.0, 16, basaltMat);
    addSummitCheckpoint(new THREE.Vector3(0, 51.0, -1400), "8. Aşama: Dönen Çekiçler Labirenti");
    addSummitJumpPad(0, 51.0, -1400, 25);

    // =========================================================================
    // AŞAMA 9: ÇÖKEN KRİSTAL SÜTUNLAR & YILDIRIM GEÇİDİ (z: -1410 -> -1580)
    // =========================================================================
    const pillarPositions = [
      { x: -5, y: 50.0, z: -1430 },
      { x: 5, y: 51.0, z: -1455 },
      { x: -6, y: 52.0, z: -1480 },
      { x: 6, y: 53.0, z: -1505 },
      { x: 0, y: 54.0, z: -1530 },
      { x: -5, y: 55.0, z: -1555 }
    ];

    pillarPositions.forEach((pos, idx) => {
      addSummitCrumblingPlatform(pos.x, pos.y, pos.z, 7.0, 7.0);
      addSummitCoin(pos.x, pos.y + 2.5, pos.z);
      if (idx === 2 || idx === 4) {
        // YENİ CANAVAR: Stratosfer Yıldırım Ruhu!
        spawnSummitEnemy('thunder_spirit', pos.x, pos.y + 4.0, pos.z, 8);
      }
    });

    addSummitBlock(0, 56.0, -1580, 18, 3.0, 18, basaltMat);
    addSummitCheckpoint(new THREE.Vector3(0, 57.5, -1580), "9. Aşama: Yıldırım Geçidi Sütunları");
    addSummitJumpPad(0, 57.5, -1580, 26);

    // =========================================================================
    // AŞAMA 10: KADİM TİTAN ÇAN KULESİ & DİKEY RÜZGAR BACASI (z: -1590 -> -1770)
    // =========================================================================
    addSummitBlock(0, 56.0, -1630, 24, 4.0, 24, basaltMat);

    // 65 Metrelik Devasa Çan Kulesi Yapısı
    const bellTowerL = createObeliskMesh(THREE, 60, 4.5);
    bellTowerL.position.set(-12, 56.0, -1630);
    summitGroup.add(bellTowerL);
    const bellTowerR = createObeliskMesh(THREE, 60, 4.5);
    bellTowerR.position.set(12, 56.0, -1630);
    summitGroup.add(bellTowerR);

    // Çan Kulesi İçinde Süper Dikey Rüzgar Bacası
    addSummitJumpPad(0, 58.0, -1630, 42); // Oyuncuyu kulenin 95m irtifasına fırlatır!

    addSummitBlock(0, 95.0, -1670, 14, 2.5, 14, goldMetalMat);
    addSummitCoin(0, 97.5, -1670);
    spawnSummitEnemy('wyvern', 0, 100.0, -1670, 12);

    addSummitMovingPlatform(0, 92.0, -1710, 10, 10, 'z', 14.0, 1.8);

    addSummitBlock(0, 88.0, -1770, 18, 3.5, 18, basaltMat);
    addSummitCheckpoint(new THREE.Vector3(0, 89.8, -1770), "10. Aşama: Titan Çan Kulesi Zirvesi");
    addSummitJumpPad(0, 89.8, -1770, 26);

    // =========================================================================
    // AŞAMA 11: OBSİDYEN EJDERHA OMURGASI & MAGMA GAYZERLERİ (z: -1780 -> -1960)
    // =========================================================================
    for (let b = 1; b <= 7; b++) {
      const pz = -1780 - b * 24;
      const px = Math.sin(b * 1.2) * 9.0;
      const py = 86 - b * 3.5;
      // Ejderha Omurga Kemiği Platformu
      const boneBlock = addSummitBlock(px, py, pz, 7.5, 2.2, 14.0, dragonBoneMat);
      addSummitCoin(px, py + 2.5, pz);

      if (b === 3 || b === 6) {
        spawnSummitEnemy('magma_beast', px, py + 2.0, pz, 6);
      }
      if (b === 4) {
        addSummitLaserTrap(px, py + 1.8, pz, 16.0, -2.0, 3);
      }
    }

    addSummitBlock(0, 60.0, -1960, 20, 3.5, 20, basaltMat);
    addSummitCheckpoint(new THREE.Vector3(0, 61.8, -1960), "11. Aşama: Ejderha Omurgası Sırtı");
    addSummitJumpPad(0, 61.8, -1960, 24);

    // =========================================================================
    // AŞAMA 12: MORİS AĞIR MUHAFIZ KIŞLASI & TOPÇU SİPERLERİ (z: -1970 -> -2150)
    // =========================================================================
    addSummitBlock(0, 58.0, -2010, 18, 3.0, 60, basaltMat);
    spawnSummitEnemy('sentinel', -4, 60.0, -1990, 8);
    spawnSummitEnemy('sentinel', 4, 60.0, -2020, 8);
    // YENİ CANAVAR: Moris Gölge Suikastçısı!
    spawnSummitEnemy('moris_assassin', 0, 60.0, -2035, 10);

    addSummitMovingPlatform(0, 56.0, -2070, 10, 10, 'x', 12.0, 1.8);
    addSummitMovingPlatform(0, 55.0, -2105, 10, 10, 'z', 12.0, 2.0);

    addSummitBlock(0, 54.0, -2150, 20, 3.5, 20, basaltMat);
    addSummitCheckpoint(new THREE.Vector3(0, 55.8, -2150), "12. Aşama: Moris Ağır Kışlası");
    addSummitJumpPad(0, 55.8, -2150, 26);

    // =========================================================================
    // AŞAMA 13: STRATOSFERİK YÜKSEK İRTİFA SIÇRAMA ZİRVESİ (z: -2160 -> -2360)
    // =========================================================================
    addSummitBlock(0, 68.0, -2200, 14, 2.8, 14, goldMetalMat);
    addSummitLaserTrap(0, 69.5, -2200, 22.0, 2.2, 4);

    addSummitMovingPlatform(-9, 66.0, -2240, 8, 8, 'y', 10.0, 1.6);
    addSummitMovingPlatform(9, 64.0, -2280, 8, 8, 'x', 14.0, 2.2);

    addSummitBlock(0, 62.0, -2320, 12, 2.5, 16, basaltMat);
    spawnSummitEnemy('iron_colossus', 0, 64.5, -2320, 6);

    addSummitBlock(0, 58.0, -2360, 20, 3.5, 20, basaltMat);
    addSummitCheckpoint(new THREE.Vector3(0, 59.8, -2360), "13. Aşama: Yüksek İrtifa Sıçrama Zirvesi");
    addSummitJumpPad(0, 59.8, -2360, 26);

    // =========================================================================
    // AŞAMA 14: KIRMIZI ÇİZGİ EŞİĞİ & BÜYÜK ŞAMPİYON KAPISI (z: -2370 -> -2560)
    // (Final Öncesi Hazırlık Meydanı: Can Yenileyici Şifa Pınarı & Altın Paralar)
    // =========================================================================
    addSummitBlock(0, 54.0, -2410, 16, 3.0, 50, basaltMat);

    // 2 Anıtsal Kızıl Dikilitaş Şampiyon Kapısı
    const champPillarL = createObeliskMesh(THREE, 40, 4.0);
    champPillarL.position.set(-14, 54.0, -2440);
    summitGroup.add(champPillarL);
    const champPillarR = createObeliskMesh(THREE, 40, 4.0);
    champPillarR.position.set(14, 54.0, -2440);
    summitGroup.add(champPillarR);

    // Kırmızı Çizgi Ufuk Işını
    const redHorizon = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 900, 16), redLineMat);
    redHorizon.rotation.z = Math.PI / 2;
    redHorizon.position.set(0, 52, -2640);
    summitGroup.add(redHorizon);
    summitRedLineBeams.push(redHorizon);

    // Büyük Hazırlık Meydanı
    addSummitBlock(0, 52.0, -2520, 36, 4.0, 60, basaltMat);
    addSummitCheckpoint(new THREE.Vector3(0, 54.0, -2520), "14. Aşama: Kırmızı Çizgi Eşiği & Şampiyon Meydanı");

    // Şifa Kristali Çeşmesi (Meydanın merkezinde)
    const healFountain = new THREE.Mesh(
      new THREE.CylinderGeometry(2.4, 2.6, 1.2, 16),
      new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0891b2, emissiveIntensity: 1.2, transparent: true, opacity: 0.85 })
    );
    healFountain.position.set(0, 54.6, -2520);
    summitGroup.add(healFountain);

    for (let c = 0; c < 8; c++) {
      const ang = (c / 8) * Math.PI * 2;
      addSummitCoin(Math.cos(ang) * 9.0, 55.5, -2520 + Math.sin(ang) * 9.0);
    }

    // Arenaya Uzanan Görkemli Giriş Köprüsü (z: -2550 -> -2595)
    addSummitBlock(0, 51.0, -2570, 16, 3.0, 40, basaltMat);
    addSummitJumpPad(0, 52.5, -2570, 22);

    // =========================================================================
    // AŞAMA 15: APEX TAHT ARENASI & 2-FAZLI MOR AYI (MORİS) BÜYÜK FİNAL DÜELLOSU!
    // (z: -2590 -> -2720, Merkez: z = -2640)
    // =========================================================================
    const arenaRadius = 50;
    const arenaMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(arenaRadius, arenaRadius + 4, 6.0, 36),
      basaltMat
    );
    arenaMesh.position.set(0, 48.0, -2640);
    arenaMesh.receiveShadow = true;
    summitGroup.add(arenaMesh);

    // Arena Floor Collider
    if (game.currentLevel && game.currentLevel.colliders) {
      game.currentLevel.colliders.push({
        min: new THREE.Vector3(-arenaRadius, 45.0, -2640 - arenaRadius),
        max: new THREE.Vector3(arenaRadius, 52.0, -2640 + arenaRadius),
        isSummitArena: true,
        isFloor: true,
        isGroundPlateau: true,
        isIslandLawn: true,
        isSummitPlatform: true
      });
      game.currentLevel.colliders.push({
        isCylinder: true,
        isRadial: true,
        center: new THREE.Vector2(0, -2640),
        radius: arenaRadius + 2.0,
        yMin: 45.0,
        yMax: 54.0
      });
    }

    addSummitCheckpoint(new THREE.Vector3(0, 51.5, -2600), "15. Aşama: Apex Taht Arenası (Final Düello)");

    // 8 Grand Flaming Pillars around the Arena Rim
    for (let a = 0; a < 8; a++) {
      const pAngle = (a / 8) * Math.PI * 2;
      const px = Math.cos(pAngle) * (arenaRadius - 4.0);
      const pz = -2640 + Math.sin(pAngle) * (arenaRadius - 4.0);

      const pillar = createObeliskMesh(THREE, 26, 3.6);
      pillar.position.set(px, 50.0, pz);
      summitGroup.add(pillar);

      const flame = new THREE.Mesh(new THREE.ConeGeometry(1.1, 2.8, 8), new THREE.MeshBasicMaterial({ color: 0xff3b30 }));
      flame.position.set(px, 76.0, pz);
      summitGroup.add(flame);
    }

    // SPAWN MOR AYI (MORİS) BOSS IN ARENA CENTER
    const morisData = createMorisBossMesh(THREE);
    morisData.group.position.set(0, 51.5, -2640);
    summitGroup.add(morisData.group);

    activeMorisBoss = {
      group: morisData.group,
      parts: morisData.parts,
      pos: morisData.group.position,
      hp: 850,
      maxHp: 850,
      speed: 5.0,
      isEnraged: false,
      animTimer: 0,
      attackCooldown: 1.5,
      isAttacking: false,
      lastHitTime: 0,
      isDead: false,
      meteorTimer: 0
    };

    console.log("✅ Earth Summit 15 FULL Stages Successfully Populated!");
  }

  // ============================================================================
  // UPDATE LOOP (CRUMBLING, LASERS, WIND, ENEMIES & 2-PHASE MORIS BOSS)
  // ============================================================================
  function updateEarthSummit(game, dt = 0.016) {
    if (!game || game.currentRegion !== 'earth_summit') return;
    const pPos = game.playerPos;
    const THREE = window.THREE;
    if (!pPos || !THREE) return;

    const time = performance.now() / 1000;

    // Şifa Pınarı İyileştirmesi (14. Aşama Meydanı z: -2520 civarı)
    if (Math.hypot(pPos.x, pPos.z - (-2520)) < 3.2 && Math.abs(pPos.y - 54.0) < 2.0) {
      if (game.stats && game.stats.currentHp < game.stats.maxHp) {
        game.stats.currentHp = game.stats.maxHp;
        if (game.callbacks && game.callbacks.onStatsUpdate) game.callbacks.onStatsUpdate(game.stats);
        if (game.callbacks && game.callbacks.onShowNotice && !game._lastHealNotice) {
          game._lastHealNotice = true;
          game.callbacks.onShowNotice("✨ Kutsal Şifa Kristali Canını Tamamen Doldurdu! (100 HP)", "success");
        }
      }
    } else {
      game._lastHealNotice = false;
    }

    // 1. UPDATE CRUMBLING PLATFORMS
    for (let c = 0; c < summitCrumblingPlatforms.length; c++) {
      const cp = summitCrumblingPlatforms[c];
      if (!cp || !cp.mesh) continue;

      if (cp.state === 'idle') {
        const dX = Math.abs(pPos.x - cp.basePos.x);
        const dZ = Math.abs(pPos.z - cp.basePos.z);
        const isStandingOn = (dX < cp.w / 2 && dZ < cp.d / 2 && Math.abs(pPos.y - (cp.basePos.y + 0.7)) < 1.0);

        if (isStandingOn) {
          cp.state = 'shaking';
          cp.timer = 0;
          if (window.St && window.St.playWoodCreak) window.St.playWoodCreak();
        }
      } else if (cp.state === 'shaking') {
        cp.timer += dt;
        cp.mesh.position.x = cp.basePos.x + (Math.random() - 0.5) * 0.25;
        cp.mesh.position.z = cp.basePos.z + (Math.random() - 0.5) * 0.25;

        if (cp.timer > 1.5) {
          cp.state = 'falling';
          cp.fallSpeed = 0;
          if (cp.collider) {
            cp.collider.min.y = -999;
            cp.collider.max.y = -999;
          }
          if (game.spawnSparkleParticles) {
            game.spawnSparkleParticles(cp.basePos, 25, 0xef4444);
          }
        }
      } else if (cp.state === 'falling') {
        cp.fallSpeed += dt * 32.0;
        cp.mesh.position.y -= cp.fallSpeed * dt;
        cp.timer += dt;

        if (cp.timer > 4.5) {
          cp.state = 'respawning';
          cp.mesh.position.copy(cp.basePos);
          cp.mesh.scale.set(0.01, 0.01, 0.01);
          if (cp.collider) {
            cp.collider.min.y = cp.basePos.y - 0.7;
            cp.collider.max.y = cp.basePos.y + 0.7;
          }
        }
      } else if (cp.state === 'respawning') {
        cp.mesh.scale.lerp(new THREE.Vector3(1, 1, 1), dt * 6.0);
        if (cp.mesh.scale.x > 0.95) {
          cp.mesh.scale.set(1, 1, 1);
          cp.state = 'idle';
          cp.timer = 0;
        }
      }
    }

    // 2. UPDATE ROTATING LASER TRAPS
    for (let l = 0; l < summitLaserTraps.length; l++) {
      const trap = summitLaserTraps[l];
      if (!trap || !trap.beams) continue;

      trap.angle += trap.rotSpeed * dt;
      trap.beams.rotation.y = trap.angle;

      const dCenter = Math.hypot(pPos.x - trap.centerPos.x, pPos.z - trap.centerPos.z);
      if (dCenter < trap.length && Math.abs(pPos.y - trap.centerPos.y) < 1.8) {
        const playerAngle = Math.atan2(pPos.z - trap.centerPos.z, pPos.x - trap.centerPos.x);
        for (let b = 0; b < trap.beamCount; b++) {
          const bAngle = trap.angle + (b / trap.beamCount) * Math.PI * 2;
          let diff = Math.abs(playerAngle - bAngle) % (Math.PI * 2);
          if (diff > Math.PI) diff = Math.PI * 2 - diff;

          if (diff < 0.18) {
            const now = Date.now();
            if (!trap._lastHit || now - trap._lastHit > 900) {
              trap._lastHit = now;
              if (game.damagePlayer) game.damagePlayer(14);
              if (window.St && window.St.playLaserHit) window.St.playLaserHit();
              if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos, 30, 0xff0033);
              if (game.playerVel) {
                game.playerVel.y = 12.0;
                game.playerVel.x = Math.cos(playerAngle) * 14.0;
                game.playerVel.z = Math.sin(playerAngle) * 14.0;
              }
              if (game.callbacks && game.callbacks.onShowNotice) {
                game.callbacks.onShowNotice("⚡ KIZIL LAZER TUZAĞI DARBESİ! (-14 Can)", "error");
              }
            }
          }
        }
      }
    }

    // 3. UPDATE WIND GUST ZONES
    for (let w = 0; w < summitWindZones.length; w++) {
      const zone = summitWindZones[w];
      if (!zone) continue;

      const inZone = (
        pPos.x >= zone.min.x && pPos.x <= zone.max.x &&
        pPos.y >= zone.min.y && pPos.y <= zone.max.y &&
        pPos.z >= zone.min.z && pPos.z <= zone.max.z
      );

      if (inZone) {
        pPos.x += zone.forceX * dt;
        if (Math.random() < 0.25 && game.spawnSparkleParticles) {
          game.spawnSparkleParticles(pPos, 3, 0x38bdf8);
        }
      }
    }

    // 4. UPDATE MOVING PLATFORMS
    for (let m = 0; m < summitMovingPlatforms.length; m++) {
      const plat = summitMovingPlatforms[m];
      if (!plat || !plat.mesh) continue;

      plat.prevPos.copy(plat.currentPos);
      const offset = Math.sin(time * plat.speed) * plat.amplitude;

      if (plat.axis === 'x') plat.currentPos.x = plat.basePos.x + offset;
      else if (plat.axis === 'z') plat.currentPos.z = plat.basePos.z + offset;
      else if (plat.axis === 'y') plat.currentPos.y = plat.basePos.y + offset;

      plat.mesh.position.copy(plat.currentPos);

      const hs = plat.halfSize;
      if (plat.collider) {
        plat.collider.min.set(plat.currentPos.x - hs.x, plat.currentPos.y - hs.y, plat.currentPos.z - hs.z);
        plat.collider.max.set(plat.currentPos.x + hs.x, plat.currentPos.y + hs.y, plat.currentPos.z + hs.z);
      }

      const platTopY = plat.currentPos.y + hs.y;
      const isPlayerHorizOver = (
        pPos.x >= plat.currentPos.x - hs.x - 0.35 &&
        pPos.x <= plat.currentPos.x + hs.x + 0.35 &&
        pPos.z >= plat.currentPos.z - hs.z - 0.35 &&
        pPos.z <= plat.currentPos.z + hs.z + 0.35
      );

      if (isPlayerHorizOver) {
        const vertDiff = pPos.y - platTopY;
        if (vertDiff >= -0.95 && vertDiff <= 1.5 && (!game.playerVel || game.playerVel.y <= 0.8)) {
          pPos.y = platTopY;
          if (game.playerVel && game.playerVel.y < 0) game.playerVel.y = 0;
          if (game.isGrounded !== undefined) game.isGrounded = true;
          if (game.jumpCount !== undefined) game.jumpCount = 0;

          pPos.x += plat.currentPos.x - plat.prevPos.x;
          pPos.y += plat.currentPos.y - plat.prevPos.y;
          pPos.z += plat.currentPos.z - plat.prevPos.z;
        }
      }
    }

    // 5. UPDATE ROTATING SAWBLADES
    for (let i = 0; i < summitSawblades.length; i++) {
      const saw = summitSawblades[i];
      if (!saw || !saw.mesh) continue;

      saw.mesh.rotation.z += saw.speed * dt;

      if (saw.type === 'sliding_x') {
        const offset = Math.sin(time * saw.speed * 0.7) * saw.amplitude;
        saw.mesh.position.x = saw.basePos.x + offset;
      }

      const dSaw = pPos.distanceTo(saw.mesh.position);
      if (dSaw < (saw.radius || 2.5) + 0.6) {
        const now = Date.now();
        if (!saw._lastHit || now - saw._lastHit > 800) {
          saw._lastHit = now;
          if (game.damagePlayer) game.damagePlayer(saw.damage || 16);
          if (window.St && window.St.playDamage) window.St.playDamage();
          if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos, 20, 0xef4444);

          if (game.playerVel) {
            game.playerVel.y = 10.0;
            const pushDir = pPos.clone().sub(saw.mesh.position).normalize();
            game.playerVel.x = pushDir.x * 14.0;
            game.playerVel.z = pushDir.z * 14.0;
          }
          if (game.callbacks && game.callbacks.onShowNotice) {
            game.callbacks.onShowNotice("⚠️ KIZIL TESTERE DARBESİ! (-16 Can)", "error");
          }
        }
      }
    }

    // 6. UPDATE ENEMIES (ALL TYPES & NEW CREATURES)
    for (let e = 0; e < summitEnemies.length; e++) {
      const enemy = summitEnemies[e];
      if (!enemy || enemy.isDead || !enemy.mesh) continue;

      enemy.animTime += dt * 3.0;
      const dPlayer = pPos.distanceTo(enemy.pos);
      const isPlayerAttacking = game.isAttacking || (game.inputs && game.inputs.attack);

      // Animation by enemy type
      if (enemy.type === 'golem') {
        if (enemy.mesh.userData && enemy.mesh.userData.armL) {
          enemy.mesh.userData.armL.rotation.x = Math.sin(enemy.animTime) * 0.6;
          enemy.mesh.userData.armR.rotation.x = -Math.sin(enemy.animTime) * 0.6;
        }
      } else if (enemy.type === 'wyvern') {
        if (enemy.mesh.userData && enemy.mesh.userData.wingL) {
          const flap = Math.sin(enemy.animTime * 4.0) * 0.5;
          enemy.mesh.userData.wingL.rotation.z = 0.2 + flap;
          enemy.mesh.userData.wingR.rotation.z = -0.2 - flap;
        }
      } else if (enemy.type === 'magma_beast') {
        if (enemy.mesh.userData && enemy.mesh.userData.legFL) {
          const legSwing = Math.sin(enemy.animTime * 5.0) * 0.5;
          enemy.mesh.userData.legFL.rotation.x = legSwing;
          enemy.mesh.userData.legFR.rotation.x = -legSwing;
          enemy.mesh.userData.legBL.rotation.x = -legSwing;
          enemy.mesh.userData.legBR.rotation.x = legSwing;
        }
      } else if (enemy.type === 'obsidian_harpy') {
        if (enemy.mesh.userData && enemy.mesh.userData.wingL) {
          const flap = Math.sin(enemy.animTime * 6.0) * 0.6;
          enemy.mesh.userData.wingL.rotation.z = 0.3 + flap;
          enemy.mesh.userData.wingR.rotation.z = -0.3 - flap;
        }
      } else if (enemy.type === 'thunder_spirit') {
        if (enemy.mesh.userData && enemy.mesh.userData.ring1) {
          enemy.mesh.userData.ring1.rotation.x += dt * 3.5;
          enemy.mesh.userData.ring2.rotation.y += dt * 4.2;
          enemy.pos.y = enemy.basePos.y + Math.sin(enemy.animTime * 2.0) * 0.6;
        }
      } else if (enemy.type === 'iron_colossus') {
        if (enemy.mesh.userData && enemy.mesh.userData.hammerHandle) {
          enemy.mesh.userData.hammerHandle.rotation.x = Math.PI / 4 + Math.sin(enemy.animTime * 1.5) * 0.4;
        }
      } else if (enemy.type === 'moris_assassin') {
        if (enemy.mesh.userData && enemy.mesh.userData.dL) {
          enemy.mesh.userData.dL.rotation.z = Math.sin(enemy.animTime * 4.0) * 0.5;
          enemy.mesh.userData.dR.rotation.z = -Math.sin(enemy.animTime * 4.0) * 0.5;
        }
      }

      // Aggro Chase or Patrol
      if (dPlayer < 20.0) {
        enemy.state = 'chase';
        const dir = pPos.clone().sub(enemy.pos).normalize();
        enemy.mesh.lookAt(pPos.x, enemy.pos.y, pPos.z);
        const moveSpeed = (
          enemy.type === 'moris_assassin' ? 5.2 :
          enemy.type === 'magma_beast' ? 4.8 :
          enemy.type === 'shadow_guard' ? 4.4 :
          enemy.type === 'obsidian_harpy' ? 4.0 :
          enemy.type === 'iron_colossus' ? 2.2 : 3.0
        ) * dt;
        enemy.pos.x += dir.x * moveSpeed;
        enemy.pos.z += dir.z * moveSpeed;
      } else {
        enemy.state = 'patrol';
        const patrolOffset = Math.sin(time * 1.2) * enemy.patrolRange;
        enemy.pos.x = enemy.basePos.x + patrolOffset;
      }

      // Check Player Attack Hit on Enemy
      if (dPlayer < 3.4 && isPlayerAttacking) {
        const now = Date.now();
        if (now - enemy.lastHitTime > 350) {
          enemy.lastHitTime = now;
          enemy.hp -= 25;
          if (window.St && window.St.playEnemyHit) window.St.playEnemyHit();
          if (game.spawnSparkleParticles) game.spawnSparkleParticles(enemy.pos, 25, 0xef4444);

          const pushBack = enemy.pos.clone().sub(pPos).normalize();
          enemy.pos.x += pushBack.x * 2.5;
          enemy.pos.z += pushBack.z * 2.5;

          if (enemy.hp <= 0) {
            enemy.isDead = true;
            summitGroup.remove(enemy.mesh);
            if (window.St && window.St.playCoin) window.St.playCoin();
            if (game.spawnSparkleParticles) game.spawnSparkleParticles(enemy.pos, 45, 0xfacc15);
            addSummitCoin(enemy.pos.x, enemy.pos.y + 0.8, enemy.pos.z);
          }
        }
      }

      // Check Enemy Damage to Player
      if (dPlayer < 2.5 && !enemy.isDead) {
        const now = Date.now();
        if (now - enemy.lastAttackTime > 1200) {
          enemy.lastAttackTime = now;
          if (game.damagePlayer) game.damagePlayer(enemy.damage);
          if (window.St && window.St.playDamage) window.St.playDamage();
          if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos, 20, 0xef4444);

          if (game.playerVel) {
            game.playerVel.y = 8.0;
            const pushDir = pPos.clone().sub(enemy.pos).normalize();
            game.playerVel.x = pushDir.x * 12.0;
            game.playerVel.z = pushDir.z * 12.0;
          }
        }
      }
    }

    // 7. UPDATE JUMP PADS
    for (let j = 0; j < summitJumpPads.length; j++) {
      const pad = summitJumpPads[j];
      if (!pad) continue;
      const dPad = Math.hypot(pPos.x - pad.pos.x, pPos.z - pad.pos.z);
      if (dPad < 2.8 && Math.abs(pPos.y - pad.pos.y) < 2.2) {
        const now = Date.now();
        if (!pad._lastBounce || now - pad._lastBounce > 600) {
          pad._lastBounce = now;
          if (game.playerVel) game.playerVel.y = pad.power || 22;
          if (game.isGrounded !== undefined) game.isGrounded = false;
          if (window.St && window.St.playDoubleJump) window.St.playDoubleJump();
          if (game.spawnSparkleParticles) game.spawnSparkleParticles(pad.pos, 25, 0xef4444);
        }
      }
    }

    // 8. UPDATE CHECKPOINTS & RED BEAMS
    for (let c = 0; c < summitCheckpoints.length; c++) {
      const cp = summitCheckpoints[c];
      if (!cp) continue;
      const dCp = Math.hypot(pPos.x - cp.pos.x, pPos.z - cp.pos.z);
      if (dCp < 3.2 && Math.abs(pPos.y - cp.pos.y) < 2.5) {
        if (!cp.active) {
          summitCheckpoints.forEach(item => { item.active = false; });
          cp.active = true;
          if (game.currentLevel && game.currentLevel.spawnPoint) {
            game.currentLevel.spawnPoint.copy(cp.pos);
          }
          if (window.St && window.St.playCheckpoint) window.St.playCheckpoint();
          if (game.spawnSparkleParticles) game.spawnSparkleParticles(cp.pos, 40, 0x10b981);
          if (game.callbacks && game.callbacks.onShowNotice) {
            game.callbacks.onShowNotice(`🏁 Kontrol Noktası Kaydedildi: ${cp.name}`, "success");
          }
        }
      }
    }

    // 9. UPDATE 2-PHASE MOR AYI (MORİS) BOSS IN STAGE 15 ARENA
    if (activeMorisBoss && !activeMorisBoss.isDead) {
      const boss = activeMorisBoss;
      boss.animTimer += dt * 3.5;

      const distToPlayer = Math.hypot(pPos.x - boss.pos.x, pPos.z - boss.pos.z);
      // Arena bounds at z: -2640, radius 50
      const inArena = pPos.z < -2560 && pPos.z > -2720 && Math.abs(pPos.x) < 55;

      if (inArena) {
        // Enrage transition (Phase 2 at < 50% HP)
        if (boss.hp < 425 && !boss.isEnraged) {
          boss.isEnraged = true;
          boss.speed = 6.8;
          if (boss.parts && boss.parts.rageAura) {
            boss.parts.rageAura.material.opacity = 0.55;
          }
          if (window.St && window.St.playBossRoar) window.St.playBossRoar();
          if (game.callbacks && game.callbacks.onShowNotice) {
            game.callbacks.onShowNotice("🔥 2. FAZ: MORİS ÖFKEYE KAPILDI! Meteor Yağmuru Başlıyor!", "warning");
          }
        }

        updateSummitBossHp(boss.hp, boss.maxHp, boss.isEnraged ? "🔥 2. FAZ: ÖFKELİ MORİS (METEORLAR)" : "1. FAZ: ZİRVE DÜELLOSU");

        boss.group.lookAt(pPos.x, boss.pos.y, pPos.z);
        if (distToPlayer > 3.8) {
          const dir = pPos.clone().sub(boss.pos).normalize();
          boss.pos.x += dir.x * boss.speed * dt;
          boss.pos.z += dir.z * boss.speed * dt;
        }

        if (boss.parts && boss.parts.legL) {
          boss.parts.legL.rotation.x = Math.sin(boss.animTimer * 1.5) * 0.6;
          boss.parts.legR.rotation.x = -Math.sin(boss.animTimer * 1.5) * 0.6;
        }

        // Hammer Attack
        boss.attackCooldown -= dt;
        if (boss.attackCooldown <= 0 && distToPlayer < 7.5) {
          boss.attackCooldown = boss.isEnraged ? 2.2 : 3.2;
          if (boss.parts && boss.parts.armRGroup) {
            boss.parts.armRGroup.rotation.x = -Math.PI / 1.5;
            setTimeout(() => {
              if (boss.parts && boss.parts.armRGroup) {
                boss.parts.armRGroup.rotation.x = Math.PI / 3;
                if (window.St && window.St.playGroundPound) window.St.playGroundPound();
                if (game.spawnSparkleParticles) {
                  game.spawnSparkleParticles(boss.pos, 45, 0xef4444);
                }
                const distNow = Math.hypot(pPos.x - boss.pos.x, pPos.z - boss.pos.z);
                if (distNow < 6.8) {
                  if (game.damagePlayer) game.damagePlayer(boss.isEnraged ? 28 : 20);
                  if (game.playerVel) {
                    game.playerVel.y = 12.0;
                    const pDir = pPos.clone().sub(boss.pos).normalize();
                    game.playerVel.x = pDir.x * 18.0;
                    game.playerVel.z = pDir.z * 18.0;
                  }
                }
                setTimeout(() => {
                  if (boss.parts && boss.parts.armRGroup) boss.parts.armRGroup.rotation.x = 0;
                }, 350);
              }
            }, 300);
          }
        }

        // Phase 2 Meteor Shower
        if (boss.isEnraged) {
          boss.meteorTimer += dt;
          if (boss.meteorTimer > 2.6) {
            boss.meteorTimer = 0;
            const meteorX = pPos.x + (Math.random() - 0.5) * 14.0;
            const meteorZ = pPos.z + (Math.random() - 0.5) * 14.0;
            if (game.spawnSparkleParticles) {
              game.spawnSparkleParticles(new THREE.Vector3(meteorX, 52.0, meteorZ), 45, 0xff0000);
            }
            if (Math.hypot(pPos.x - meteorX, pPos.z - meteorZ) < 3.4) {
              if (game.damagePlayer) game.damagePlayer(16);
            }
          }
        }

        // Player Attack Hit on Boss
        const isPlayerAttacking = game.isAttacking || (game.inputs && game.inputs.attack);
        if (distToPlayer < 4.2 && isPlayerAttacking) {
          const now = Date.now();
          if (now - boss.lastHitTime > 400) {
            boss.lastHitTime = now;
            boss.hp -= 35;
            if (window.St && window.St.playBossHit) window.St.playBossHit();
            if (game.spawnSparkleParticles) game.spawnSparkleParticles(boss.pos, 35, 0xef4444);

            if (boss.hp <= 0) {
              boss.isDead = true;
              updateSummitBossHp(0, boss.maxHp);
              summitGroup.remove(boss.group);

              if (window.St && window.St.playGoalFanfare) window.St.playGoalFanfare();
              if (game.spawnSparkleParticles) {
                game.spawnSparkleParticles(boss.pos, 80, 0xfacc15);
                game.spawnSparkleParticles(boss.pos, 60, 0xef4444);
              }

              if (game.callbacks && game.callbacks.onBossDefeated) {
                game.callbacks.onBossDefeated("boss_mor_ayi", "earth_summit", true);
              }

              if (game.callbacks && game.callbacks.onShowNotice) {
                game.callbacks.onShowNotice("🐻 Mor Ayı: 'Kardeşim... Başardın! Sonunda gözümdeki karanlık dağıldı. Artık köyümüze dönme vakti! ❤️🏡'", "success");
              }

              spawnSummitVictoryPortal(game);
            }
          }
        }
      } else {
        updateSummitBossHp(0, boss.maxHp);
      }
    }

    // 10. UPDATE VICTORY PORTAL
    if (victoryPortal && victoryPortal.mesh) {
      victoryPortal.mesh.rotation.y += dt * 2.2;
      victoryPortal.mesh.rotation.z += dt * 1.5;

      const dPortal = pPos.distanceTo(victoryPortal.pos);
      if (dPortal < 3.4 && !victoryPortal.triggered) {
        victoryPortal.triggered = true;
        if (window.St && window.St.playPortal) window.St.playPortal();
        if (game.spawnSparkleParticles) game.spawnSparkleParticles(victoryPortal.pos, 60, 0xfacc15);
        if (game.callbacks && game.callbacks.onShowNotice) {
          game.callbacks.onShowNotice("🎉 15. BÖLÜM TAMAMLANDI! TÜM DÜNYA SERÜVENİNİ BİTİRDİN!", "success");
        }
        setTimeout(() => {
          if (game.loadRegion) game.loadRegion('hub');
        }, 1500);
      }
    }
  }

  function spawnSummitVictoryPortal(game) {
    if (!game || !game.scene || !window.THREE) return;
    const THREE = window.THREE;
    const portalPos = new THREE.Vector3(0, 53.0, -2640);

    const portalGroup = new THREE.Group();
    portalGroup.position.copy(portalPos);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.4, 0.35, 16, 32),
      new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        emissive: 0xeab308,
        emissiveIntensity: 2.2,
        metalness: 0.9,
        roughness: 0.1
      })
    );
    portalGroup.add(ring);

    const vortex = new THREE.Mesh(
      new THREE.CircleGeometry(2.2, 32),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
    );
    portalGroup.add(vortex);

    summitGroup.add(portalGroup);

    victoryPortal = {
      mesh: portalGroup,
      pos: portalPos,
      triggered: false
    };
  }

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
    summitCrumblingPlatforms = [];
    summitLaserTraps = [];
    summitWindZones = [];
    summitJumpPads = [];
    summitCheckpoints = [];
    summitRedLineBeams = [];
    summitEnemies = [];
    summitComets = [];

    const targetGame = game || window.__superBearGame;
    if (targetGame && targetGame.currentLevel && targetGame.currentLevel.colliders) {
      targetGame.currentLevel.colliders = targetGame.currentLevel.colliders.filter(
        c => !c.isSummitPlatform && !c.isSummitMovingPlatform && !c.isCrumblingFloor && !c.isSummitArena
      );
    }
  }

  window.__populateEarthSummit = populateEarthSummit;
  window.__updateEarthSummit = updateEarthSummit;
  window.__cleanUpEarthSummit = cleanUpEarthSummit;

  console.log("⛰️ Earth Summit Level (15 Stages, 5 New Creatures & Enhanced Hazards) Ready!");
})();
