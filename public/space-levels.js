// ===================================================================
// GRIZZY'NIN BÜYÜK MACERASI - 7 ZORLU UZAY BOYUTU & KOZMİK BOSSLAR
// ===================================================================

(function() {
  console.log("🚀 Initializing Grizzy'nin Büyük Macerası - Zorlu Uzay Boyutları Motoru...");

  const SPACE_LEVEL_MAP = {
    'space_1_stardust': 'space_level_1',
    'space_2_nebula': 'space_level_2',
    'space_2_crystal': 'space_level_2',
    'space_3_plasma': 'space_level_3',
    'space_3_gas_giant': 'space_level_3',
    'space_4_lunar': 'space_level_4',
    'space_4_asteroid_belt': 'space_level_4',
    'space_5_supernova': 'space_level_5',
    'space_5_nebula_ruins': 'space_5_supernova',
    'space_6_darklord': 'space_level_6',
    'space_6_dark_lord': 'space_level_6',
    'space_7_mor_ayi': 'space_level_7',
    'space_7_purple_bear': 'space_level_7',
    'space_level_1': 'space_level_1',
    'space_level_2': 'space_level_2',
    'space_level_3': 'space_level_3',
    'space_level_4': 'space_level_4',
    'space_level_5': 'space_level_5',
    'space_level_6': 'space_level_6',
    'space_level_7': 'space_level_7',
    'space_realm': 'space_level_1'
  };

  const SPACE_LEVEL_IDS = Object.keys(SPACE_LEVEL_MAP);

  let currentSpaceLevelId = null;
  let spaceSceneGroup = null;
  let spaceDialogueStep = 0;
  let isSpaceDialogueActive = false;
  let morAyiBoss = null;
  let darkLordBoss = null;
  let currentLevelBoss = null;
  let goldenKeyMesh = null;
  let isKeyCollected = false;
  let bademBirdMesh = null;
  let isBademRescued = false;
  let cageMesh = null;
  let cageDoorMesh = null;
  let damageIframeTimer = 0;

  // Active hazards and animated objects in space
  const animatedObjects = [];
  const spaceHazards = [];
  const spaceShockwaves = [];
  let spaceCameraShake = 0;
  const speedBoostRings = [];
  const rotatingGears = [];
  const solarFlares = [];
  let blackHoleVortex = null;

  // 3D Expanding Shockwave Effect on Ground
  function spawnGroundShockwave(scene, pos, color = 0xec4899) {
    if (!scene || !window.THREE) return;
    const THREE = window.THREE;
    const ringGeo = new THREE.TorusGeometry(1.2, 0.45, 12, 36);
    const ringMat = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.95
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.set(pos.x, pos.y + 0.2, pos.z);
    scene.add(ringMesh);

    spaceShockwaves.push({
      mesh: ringMesh,
      x: pos.x,
      y: pos.y,
      z: pos.z,
      radius: 1.2,
      maxRadius: 32.0,
      speed: 0.72
    });
  }

  // --- DYNAMIC SPACE BOSS HEALTH BAR UI (TOP SCREEN) ---
  const spaceBossHpContainer = document.createElement('div');
  spaceBossHpContainer.id = 'space-boss-hp-container';
  spaceBossHpContainer.style.position = 'absolute';
  spaceBossHpContainer.style.top = '36px';
  spaceBossHpContainer.style.left = '50%';
  spaceBossHpContainer.style.transform = 'translateX(-50%)';
  spaceBossHpContainer.style.width = '460px';
  spaceBossHpContainer.style.maxWidth = '88vw';
  spaceBossHpContainer.style.backgroundColor = 'rgba(15, 23, 42, 0.92)';
  spaceBossHpContainer.style.border = '2px solid #a855f7';
  spaceBossHpContainer.style.borderRadius = '14px';
  spaceBossHpContainer.style.padding = '8px 14px';
  spaceBossHpContainer.style.display = 'none';
  spaceBossHpContainer.style.zIndex = '1000';
  spaceBossHpContainer.style.boxShadow = '0 0 25px rgba(168, 85, 247, 0.5), 0 4px 15px rgba(0,0,0,0.8)';
  spaceBossHpContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif';

  const spaceBossHpTitle = document.createElement('div');
  spaceBossHpTitle.style.color = '#e2e8f0';
  spaceBossHpTitle.style.fontSize = '13px';
  spaceBossHpTitle.style.fontWeight = '800';
  spaceBossHpTitle.style.letterSpacing = '0.5px';
  spaceBossHpTitle.style.textTransform = 'uppercase';
  spaceBossHpTitle.style.marginBottom = '6px';
  spaceBossHpTitle.style.display = 'flex';
  spaceBossHpTitle.style.justifyContent = 'space-between';
  spaceBossHpTitle.style.alignItems = 'center';

  const spaceBossHpBarOuter = document.createElement('div');
  spaceBossHpBarOuter.style.width = '100%';
  spaceBossHpBarOuter.style.height = '12px';
  spaceBossHpBarOuter.style.backgroundColor = '#1e1b4b';
  spaceBossHpBarOuter.style.borderRadius = '6px';
  spaceBossHpBarOuter.style.overflow = 'hidden';
  spaceBossHpBarOuter.style.border = '1px solid rgba(168, 85, 247, 0.4)';

  const spaceBossHpBarInner = document.createElement('div');
  spaceBossHpBarInner.style.width = '100%';
  spaceBossHpBarInner.style.height = '100%';
  spaceBossHpBarInner.style.background = 'linear-gradient(90deg, #ec4899, #a855f7, #6366f1)';
  spaceBossHpBarInner.style.transition = 'width 0.15s ease-out';
  spaceBossHpBarInner.style.boxShadow = '0 0 10px rgba(236, 72, 153, 0.6)';

  spaceBossHpBarOuter.appendChild(spaceBossHpBarInner);
  spaceBossHpContainer.appendChild(spaceBossHpTitle);
  spaceBossHpContainer.appendChild(spaceBossHpBarOuter);

  if (document.body) {
    document.body.appendChild(spaceBossHpContainer);
  } else {
    window.addEventListener('DOMContentLoaded', () => document.body.appendChild(spaceBossHpContainer));
  }

  function showSpaceBossHp(titleText, currentHp, maxHp, barColor = 'linear-gradient(90deg, #ec4899, #a855f7, #6366f1)') {
    spaceBossHpContainer.style.display = 'block';
    const percent = Math.max(0, Math.min(100, (currentHp / maxHp) * 100));
    spaceBossHpTitle.innerHTML = `<span>${titleText}</span><span style="color:#c084fc; font-weight:700;">${Math.max(0, Math.ceil(currentHp))} / ${maxHp} HP</span>`;
    spaceBossHpBarInner.style.width = `${percent}%`;
    spaceBossHpBarInner.style.background = barColor;
  }

  function hideSpaceBossHp() {
    spaceBossHpContainer.style.display = 'none';
  }

  // --- PLAYER DAMAGE & RESPAWN SYSTEM FOR HIGH STAKES ---
  function damagePlayer(game, amount, knockback = null) {
    if (!game || !game.stats) return;
    if (damageIframeTimer > 0) return;

    damageIframeTimer = 1.0; // 1 second invulnerability
    const defense = game.stats.defense || 0;
    const actualDmg = Math.max(6, amount - Math.floor(defense * 0.4));
    game.stats.currentHp = Math.max(0, (game.stats.currentHp || 100) - actualDmg);

    if (game.callbacks && game.callbacks.onStatsUpdate) {
      game.callbacks.onStatsUpdate(game.stats);
    }
    if (game.callbacks && game.callbacks.onShowNotice) {
      game.callbacks.onShowNotice(`💥 Hasar Aldın! -${actualDmg} HP`, "error");
    }

    // Particle burst
    if (game.playerPos && game.spawnSparkleParticles) {
      game.spawnSparkleParticles(game.playerPos, 16, 0xef4444);
    }

    // Knockback
    if (knockback && game.playerVel) {
      game.playerVel.x += knockback.x * 12;
      game.playerVel.y += 6.5;
      game.playerVel.z += knockback.z * 12;
    }

    // Respawn on Death
    if (game.stats.currentHp <= 0) {
      game.stats.currentHp = game.stats.maxHp;
      if (game.callbacks && game.callbacks.onStatsUpdate) {
        game.callbacks.onStatsUpdate(game.stats);
      }
      respawnPlayerAtCheckpoint(game, "⚠️ Canın bitti! Kontrol noktasından yeniden başladın.");
    }
  }

  function respawnPlayerAtCheckpoint(game, message) {
    if (!game) return;
    let target = new window.THREE.Vector3(0, 1.5, 0);
    if (game.currentLevel && game.currentLevel.checkpoints) {
      const activeCp = game.currentLevel.checkpoints.find(cp => cp.active);
      if (activeCp) target = activeCp.pos.clone().add(new window.THREE.Vector3(0, 1.5, 0));
      else if (game.currentLevel.spawnPoint) target = game.currentLevel.spawnPoint.clone();
    }
    if (game.playerPos) game.playerPos.copy(target);
    if (game.playerVel) game.playerVel.set(0, 0, 0);
    damageIframeTimer = 1.5;
    if (game.callbacks && game.callbacks.onShowNotice) {
      game.callbacks.onShowNotice(message, "warn");
    }
  }

  // --- HELMET CREATOR HELPER FOR ALL TALKING CREATURES ---
  function createAstronautHelmet(parentMesh, headYOffset = 1.4, radius = 0.95) {
    if (!window.THREE) return;
    const THREE = window.THREE;

    const helmetGroup = new THREE.Group();
    helmetGroup.name = "astro_helmet";

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transmission: 0.95,
      opacity: 0.2,
      transparent: true,
      depthWrite: false,
      roughness: 0.05,
      metalness: 0.05,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      side: THREE.DoubleSide
    });
    const glassSphere = new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 24), glassMat);
    glassSphere.renderOrder = 10;
    glassSphere.position.y = headYOffset;
    helmetGroup.add(glassSphere);

    const collarMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.85,
      roughness: 0.25
    });
    const collarMesh = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.82, radius * 0.92, 0.25, 20), collarMat);
    collarMesh.position.y = headYOffset - radius * 0.78;
    helmetGroup.add(collarMesh);

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.2
    });
    const leftPort = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.2, 12), goldMat);
    leftPort.rotation.z = Math.PI / 2;
    leftPort.position.set(-radius * 0.85, headYOffset - 0.2, 0);
    helmetGroup.add(leftPort);

    const rightPort = leftPort.clone();
    rightPort.position.x = radius * 0.85;
    helmetGroup.add(rightPort);

    const antennaRod = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.7, 8), collarMat);
    antennaRod.position.set(radius * 0.55, headYOffset + radius * 0.7, 0);
    antennaRod.rotation.z = -0.25;
    helmetGroup.add(antennaRod);

    const beaconMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const beaconOrb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), beaconMat);
    beaconOrb.position.set(radius * 0.65, headYOffset + radius * 0.98, 0);
    helmetGroup.add(beaconOrb);

    parentMesh.add(helmetGroup);
    return helmetGroup;
  }

  // --- HELPER TO ADD COLLIDER TO LEVEL ---
  function addBoxCollider(game, minX, minY, minZ, maxX, maxY, maxZ, isToxic = false, isIce = false) {
    if (!game || !game.currentLevel) return;
    if (!game.currentLevel.colliders) game.currentLevel.colliders = [];
    const THREE = window.THREE;
    const collider = {
      min: new THREE.Vector3(minX, minY, minZ),
      max: new THREE.Vector3(maxX, maxY, maxZ),
      isToxic: !!isToxic,
      isIce: !!isIce
    };
    game.currentLevel.colliders.push(collider);
    return collider;
  }

  // --- HELPER TO ADD COIN ---
  function addCoin(game, scene, x, y, z, isHoney = false) {
    if (!window.THREE) return;
    const THREE = window.THREE;
    if (!game.currentLevel.collectibles) game.currentLevel.collectibles = [];

    const coinGroup = new THREE.Group();
    if (isHoney) {
      const geo = new THREE.OctahedronGeometry(0.38, 0);
      const mat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.8,
        roughness: 0.1,
        metalness: 0.3
      });
      const mesh = new THREE.Mesh(geo, mat);
      coinGroup.add(mesh);
    } else {
      const geo = new THREE.CylinderGeometry(0.32, 0.32, 0.09, 14);
      geo.rotateX(Math.PI / 2);
      const mat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        emissive: 0xca8a04,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2
      });
      const mesh = new THREE.Mesh(geo, mat);
      coinGroup.add(mesh);
    }

    coinGroup.position.set(x, y, z);
    scene.add(coinGroup);

    game.currentLevel.collectibles.push({
      id: "space_col_" + Math.random().toString(36).substr(2, 9),
      type: isHoney ? "honey_gem" : "coin",
      mesh: coinGroup,
      pos: new THREE.Vector3(x, y, z),
      collected: false,
      value: isHoney ? 25 : 5
    });
  }

  // --- HELPER TO ADD JUMP PAD ---
  function addJumpPad(game, scene, x, y, z, force = 24, color = 0x38bdf8) {
    if (!window.THREE) return;
    const THREE = window.THREE;
    if (!game.currentLevel.jumpPads) game.currentLevel.jumpPads = [];

    const padGroup = new THREE.Group();
    padGroup.position.set(x, y, z);

    const baseMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 1.6, 0.35, 18),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 })
    );
    padGroup.add(baseMesh);

    const padMat = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.9,
      roughness: 0.2
    });
    const energyMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.15, 18), padMat);
    energyMesh.position.y = 0.2;
    padGroup.add(energyMesh);

    scene.add(padGroup);

    game.currentLevel.jumpPads.push({
      mesh: padGroup,
      pos: new THREE.Vector3(x, y, z),
      boostForce: force
    });

    addBoxCollider(game, x - 1.4, y - 0.2, z - 1.4, x + 1.4, y + 0.4, z + 1.4);
  }

  // --- HELPER TO ADD CHECKPOINT ---
  function addCheckpoint(game, scene, x, y, z, name = "Kozmik Nokta", isInitial = false) {
    if (!window.THREE) return;
    const THREE = window.THREE;
    if (!game.currentLevel.checkpoints) game.currentLevel.checkpoints = [];

    const cpGroup = new THREE.Group();
    cpGroup.name = "checkpoint_group_space";
    cpGroup.position.set(x, y, z);

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(1.8, 2.0, 0.35, 16),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.3 })
    );
    base.position.y = 0.17;
    base.receiveShadow = true;
    cpGroup.add(base);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.1, 0.1, 12, 24),
      new THREE.MeshBasicMaterial({ color: isInitial ? 0x22c55e : 0xfacc15 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.36;
    cpGroup.add(ring);

    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.09, 3.6, 8),
      new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.9, roughness: 0.2 })
    );
    pole.position.y = 1.8;
    pole.castShadow = true;
    cpGroup.add(pole);

    const flagMat = new THREE.MeshStandardMaterial({
      color: isInitial ? 0x22c55e : 0xef4444,
      emissive: isInitial ? 0x16a34a : 0xb91c1c,
      emissiveIntensity: 0.8,
      side: THREE.DoubleSide
    });
    const flag = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.9, 0.06), flagMat);
    flag.name = 'flag_mesh';
    flag.userData = { isBanner: true };
    flag.position.set(0.75, 2.9, 0);
    flag.castShadow = true;
    cpGroup.add(flag);

    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 14, 14),
      new THREE.MeshBasicMaterial({ color: isInitial ? 0x4ade80 : 0xfacc15 })
    );
    orb.position.set(0, 3.7, 0);
    cpGroup.add(orb);

    const cpLight = new THREE.PointLight(isInitial ? 0x22c55e : 0xef4444, 1.8, 12);
    cpLight.position.set(0, 3.2, 0);
    cpGroup.add(cpLight);

    cpGroup.userData = { banner: flag, orb: orb, ring: ring, light: cpLight };
    scene.add(cpGroup);

    game.currentLevel.checkpoints.push({
      id: "cp_" + Math.random().toString(36).substr(2, 6),
      name: name,
      pos: new THREE.Vector3(x, y, z),
      active: isInitial,
      mesh: cpGroup,
      meshGroup: cpGroup
    });
  }

  // --- HELPER TO ADD EXIT PORTAL ---
  function addExitPortal(game, scene, x, y, z, targetRegion, title = "Sonraki Bölüm") {
    if (!window.THREE) return;
    const THREE = window.THREE;

    const portalGroup = new THREE.Group();
    portalGroup.position.set(x, y, z);

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(2.6, 2.9, 0.4, 20),
      new THREE.MeshStandardMaterial({ color: 0x1e1b4b, metalness: 0.8, roughness: 0.2 })
    );
    portalGroup.add(base);

    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x6d28d9,
      emissiveIntensity: 0.9,
      roughness: 0.2
    });
    const ringMesh = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.22, 16, 32), ringMat);
    ringMesh.position.y = 2.4;
    portalGroup.add(ringMesh);

    const vortexMesh = new THREE.Mesh(
      new THREE.CircleGeometry(1.6, 32),
      new THREE.MeshBasicMaterial({ color: 0xc084fc, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
    );
    vortexMesh.position.y = 2.4;
    portalGroup.add(vortexMesh);

    scene.add(portalGroup);

    game.currentLevel.nextPortal = {
      targetRegion: targetRegion,
      pos: new THREE.Vector3(x, y, z),
      mesh: portalGroup,
      ringMesh: ringMesh,
      vortexMesh: vortexMesh,
      regionName: title,
      promptShown: false,
      triggered: false
    };

    addBoxCollider(game, x - 2.6, y - 0.2, z - 2.6, x + 2.6, y + 0.4, z + 2.6);
  }

  // ===================================================================
  // --- DYNAMIC HAZARDS & HIGH-CHALLENGE OBSTACLES ---
  // ===================================================================

  // 1. ROTATING LASER BARRIER (DEALS HIGH DAMAGE & KNOCKBACK IF TOUCHED)
  function addRotatingLaserBarrier(game, scene, x, y, z, length = 12, speed = 0.025, colorHex = 0xef4444, isDouble = true) {
    const THREE = window.THREE;
    const barrierGroup = new THREE.Group();
    barrierGroup.position.set(x, y, z);

    // Central Pillar Emitter
    const emitterPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.45, 2.0, 12),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 })
    );
    emitterPole.position.y = 1.0;
    barrierGroup.add(emitterPole);

    const glowCore = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 12, 12),
      new THREE.MeshBasicMaterial({ color: colorHex })
    );
    glowCore.position.y = 1.4;
    barrierGroup.add(glowCore);

    // Laser Beam Meshes
    const beamGeo = new THREE.CylinderGeometry(0.08, 0.08, length, 8);
    beamGeo.rotateZ(Math.PI / 2);
    const beamMat = new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0.9 });
    
    const beam1 = new THREE.Mesh(beamGeo, beamMat);
    beam1.position.y = 1.4;
    barrierGroup.add(beam1);

    let beam2 = null;
    if (isDouble) {
      const beamGeo2 = new THREE.CylinderGeometry(0.08, 0.08, length, 8);
      beamGeo2.rotateX(Math.PI / 2);
      beam2 = new THREE.Mesh(beamGeo2, beamMat);
      beam2.position.y = 1.4;
      barrierGroup.add(beam2);
    }

    scene.add(barrierGroup);

    let currentAngle = 0;
    const halfLen = length / 2;

    spaceHazards.push({
      update: () => {
        currentAngle += speed;
        barrierGroup.rotation.y = currentAngle;

        // Collision detection with player
        if (!game || !game.playerPos) return;
        const pPos = game.playerPos;
        const dy = Math.abs(pPos.y - (y + 1.4));
        if (dy < 1.6) {
          const dx = pPos.x - x;
          const dz = pPos.z - z;
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist < halfLen) {
            // Angle between player and center
            const pAngle = Math.atan2(dx, dz);
            // Check beam 1
            const diff1 = Math.abs((pAngle - currentAngle) % Math.PI);
            const nearBeam1 = diff1 < 0.18 || Math.abs(diff1 - Math.PI) < 0.18;
            let nearBeam2 = false;
            if (isDouble) {
              const diff2 = Math.abs((pAngle - (currentAngle + Math.PI / 2)) % Math.PI);
              nearBeam2 = diff2 < 0.18 || Math.abs(diff2 - Math.PI) < 0.18;
            }

            if (nearBeam1 || nearBeam2) {
              const knockDir = new THREE.Vector3(dx, 0, dz).normalize();
              damagePlayer(game, 22, knockDir);
            }
          }
        }
      }
    });
  }

  // 2. OSCILLATING MOVING PLATFORM (DYNAMICALLY GLIDES SLOWLY & SMOOTHLY WITH COMFORTABLE PAUSES)
  function addMovingOscillatingPlatform(game, scene, p1, p2, speed = 0.005, width = 7.0, depth = 7.0, colorHex = 0x6366f1) {
    const THREE = window.THREE;
    const platGroup = new THREE.Group();
    platGroup.position.copy(p1);

    const slabMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.3
    });
    const slab = new THREE.Mesh(new THREE.BoxGeometry(width, 1.8, depth), slabMat);
    platGroup.add(slab);

    const rimMat = new THREE.MeshBasicMaterial({ color: colorHex });
    const rim = new THREE.Mesh(new THREE.BoxGeometry(width + 0.4, 0.25, depth + 0.4), rimMat);
    rim.position.y = 0.9;
    platGroup.add(rim);

    // Neon Thrust Thrusters Underneath
    const thrusterMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    for (let tx = -1; tx <= 1; tx += 2) {
      for (let tz = -1; tz <= 1; tz += 2) {
        const th = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 0.8, 8), thrusterMat);
        th.position.set(tx * (width * 0.35), -1.1, tz * (depth * 0.35));
        platGroup.add(th);
      }
    }

    scene.add(platGroup);

    const collider = addBoxCollider(
      game,
      p1.x - width / 2, p1.y - 0.9, p1.z - depth / 2,
      p1.x + width / 2, p1.y + 0.9, p1.z + depth / 2
    );

    let angle = 0;
    // Cap speed to be very slow and comfortable for easy jumping (user: "hızlı giden platformlar çok hızlı yavaş olsun zıplıyamıyorum")
    const actualSpeed = Math.min(speed, 0.0052);
    let prevPos = p1.clone();

    animatedObjects.push({
      mesh: platGroup,
      update: () => {
        angle += actualSpeed;
        // Smooth cosine ease: slows down gently at both ends giving plenty of time to board/exit
        const t = (1 - Math.cos(angle)) * 0.5;

        const curX = p1.x + (p2.x - p1.x) * t;
        const curY = p1.y + (p2.y - p1.y) * t;
        const curZ = p1.z + (p2.z - p1.z) * t;
        platGroup.position.set(curX, curY, curZ);

        // Update box collider bounds
        if (collider) {
          collider.min.set(curX - width / 2, curY - 0.9, curZ - depth / 2);
          collider.max.set(curX + width / 2, curY + 0.9, curZ + depth / 2);
        }

        // Carry player reliably if standing on top of moving platform
        if (game && game.playerPos) {
          const p = game.playerPos;
          const onTop = (
            p.x >= curX - (width / 2 + 0.6) && p.x <= curX + (width / 2 + 0.6) &&
            p.z >= curZ - (depth / 2 + 0.6) && p.z <= curZ + (depth / 2 + 0.6) &&
            p.y >= (curY + 0.1) && p.y <= (curY + 2.8)
          );
          if (onTop) {
            const deltaX = curX - prevPos.x;
            const deltaY = curY - prevPos.y;
            const deltaZ = curZ - prevPos.z;
            p.x += deltaX;
            p.y += deltaY;
            p.z += deltaZ;
          }
        }
        prevPos.set(curX, curY, curZ);
      }
    });
  }

  // 3. PATROLLING ALIEN DRONE (CIRCLES OVERHEAD AND ZAPS GRIZZY)
  function addPatrollingAlienDrone(game, scene, centerPos, radius = 8.0, speed = 0.025, colorHex = 0xec4899) {
    const THREE = window.THREE;
    const droneGroup = new THREE.Group();
    droneGroup.position.copy(centerPos);

    const saucer = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.8, 0.4, 16),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 })
    );
    droneGroup.add(saucer);

    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 16, 16),
      new THREE.MeshBasicMaterial({ color: colorHex })
    );
    dome.position.y = 0.3;
    droneGroup.add(dome);

    const eyeLight = new THREE.PointLight(colorHex, 2.5, 10);
    eyeLight.position.y = -0.4;
    droneGroup.add(eyeLight);

    scene.add(droneGroup);

    let angle = Math.random() * Math.PI * 2;
    let hp = 45;
    let isDroneDead = false;

    spaceHazards.push({
      update: () => {
        if (isDroneDead) return;
        angle += speed;
        const curX = centerPos.x + Math.sin(angle) * radius;
        const curY = centerPos.y + Math.sin(angle * 2.5) * 0.8;
        const curZ = centerPos.z + Math.cos(angle) * radius;
        droneGroup.position.set(curX, curY, curZ);
        droneGroup.rotation.y += 0.03;

        if (!game || !game.playerPos) return;
        const dist = game.playerPos.distanceTo(droneGroup.position);

        // Player attacks drone
        if (game.isAttacking && dist < 3.8) {
          hp -= 25;
          if (game.spawnSparkleParticles) game.spawnSparkleParticles(droneGroup.position, 12, colorHex);
          if (hp <= 0) {
            isDroneDead = true;
            droneGroup.visible = false;
            addCoin(game, scene, curX, curY, curZ, true);
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("🛸 Uzay Dronu İmha Edildi! (+25 Bal Parası)", "success");
            }
          }
          return;
        }

        // Drone shocks player
        if (dist < 2.6) {
          const knockDir = game.playerPos.clone().sub(droneGroup.position).normalize();
          damagePlayer(game, 18, knockDir);
        }
      }
    });
  }

  // 4. PERIODIC PLASMA GEYSER (ERUPTS PILLAR OF HOT FIRE)
  function addPlasmaGeyser(game, scene, x, y, z, radius = 2.4, interval = 3.5, colorHex = 0x06b6d4) {
    const THREE = window.THREE;
    const ventBase = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.9, radius * 1.1, 0.4, 16),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 })
    );
    ventBase.position.set(x, y + 0.2, z);
    scene.add(ventBase);

    // Flame column
    const flameMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.85
    });
    const flamePillar = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.7, radius * 0.5, 9.0, 16), flameMat);
    flamePillar.position.set(x, y + 4.7, z);
    flamePillar.visible = false;
    scene.add(flamePillar);

    let timer = 0;
    let isErupting = false;

    spaceHazards.push({
      update: () => {
        timer += 0.016;
        if (timer >= interval) {
          timer = 0;
          isErupting = !isErupting;
          flamePillar.visible = isErupting;
        }

        if (isErupting) {
          flamePillar.rotation.y += 0.05;
          if (game && game.playerPos) {
            const p = game.playerPos;
            const distXZ = Math.sqrt((p.x - x) ** 2 + (p.z - z) ** 2);
            if (distXZ < radius && p.y >= y && p.y <= y + 9.5) {
              const knock = new THREE.Vector3(0, 1, 0);
              damagePlayer(game, 24, knock);
            }
          }
        }
      }
    });
  }

  // --- TALKING SPACE NPC CREATOR WITH ASTRONAUT HELMET ---
  function createTalkingSpaceNPC(game, scene, config) {
    const THREE = window.THREE;
    const npcGroup = new THREE.Group();
    npcGroup.position.copy(config.pos);
    npcGroup.name = "space_npc_" + config.id;

    // Body
    const bodyMat = new THREE.MeshStandardMaterial({
      color: config.suitColor || 0x3b82f6,
      roughness: 0.4,
      metalness: 0.5
    });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 1.4, 16), bodyMat);
    body.position.y = 1.0;
    npcGroup.add(body);

    // Head
    const headMat = new THREE.MeshStandardMaterial({
      color: config.headColor || 0xd97706,
      roughness: 0.8
    });
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 16), headMat);
    head.position.y = 1.95;
    npcGroup.add(head);

    // EARS
    const earMat = headMat;
    const leftEar = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 10), earMat);
    leftEar.position.set(-0.38, 2.38, 0);
    npcGroup.add(leftEar);
    const rightEar = leftEar.clone();
    rightEar.position.x = 0.38;
    npcGroup.add(rightEar);

    // Eyes
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), eyeMat);
    leftEye.position.set(-0.16, 2.05, 0.48);
    npcGroup.add(leftEye);
    const rightEye = leftEye.clone();
    rightEye.position.x = 0.16;
    npcGroup.add(rightEye);

    // OXYGEN BACKPACK TANK
    const tankMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 });
    const tank1 = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.9, 12), tankMat);
    tank1.position.set(-0.2, 1.1, -0.62);
    npcGroup.add(tank1);
    const tank2 = tank1.clone();
    tank2.position.x = 0.2;
    npcGroup.add(tank2);

    // HELMET
    createAstronautHelmet(npcGroup, 1.95, 0.85);

    // 💬 PROMPT SPRITE
    const promptCanvas = document.createElement('canvas');
    promptCanvas.width = 128;
    promptCanvas.height = 128;
    const ctx = promptCanvas.getContext('2d');
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.beginPath();
    ctx.arc(64, 64, 56, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.font = 'bold 58px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('💬', 64, 64);

    const promptTex = new THREE.CanvasTexture(promptCanvas);
    const promptSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: promptTex, transparent: true }));
    promptSprite.position.set(0, 3.5, 0);
    promptSprite.scale.set(1.4, 1.4, 1.4);
    npcGroup.add(promptSprite);

    scene.add(npcGroup);

    if (game && game.currentLevel && game.currentLevel.npcs) {
      game.currentLevel.npcs.push({
        id: config.id,
        name: config.name,
        role: config.role,
        avatarIcon: config.avatarIcon || '👨‍🚀',
        mesh: npcGroup,
        dialogue: config.dialogue,
        pos: config.pos
      });
    }

    return npcGroup;
  }

  // --- DARK LORD BOSS (LEVEL 6) ---
    function spawnSpaceLevelBoss(game, scene, config) {
    const THREE = window.THREE;
    const bossGroup = new THREE.Group();
    bossGroup.position.copy(config.pos);
    bossGroup.name = "space_level_boss_" + config.type;

    const bodyMat = new THREE.MeshStandardMaterial({
      color: config.color,
      roughness: 0.4,
      metalness: 0.8,
      emissive: config.color,
      emissiveIntensity: 0.25
    });

    const glowEyeMat = new THREE.MeshBasicMaterial({ color: 0xff0055 });

    // Main torso
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.8, 3.2, 16), bodyMat);
    torso.position.y = 1.6;
    bossGroup.add(torso);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 16), bodyMat);
    head.position.set(0, 3.8, 0);
    bossGroup.add(head);

    // Glowing Visor / Eyes
    const visor = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.4, 0.8), glowEyeMat);
    visor.position.set(0, 3.8, 0.8);
    bossGroup.add(visor);

    // Floating Energy Crown
    const crown = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.12, 8, 24), new THREE.MeshBasicMaterial({ color: config.color }));
    crown.rotation.x = Math.PI / 2;
    crown.position.set(0, 5.0, 0);
    bossGroup.add(crown);

    // Shoulders & Arms
    const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 2.5, 12), bodyMat);
    leftArm.position.set(-2.0, 2.2, 0);
    leftArm.rotation.z = 0.4;
    bossGroup.add(leftArm);

    const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 2.5, 12), bodyMat);
    rightArm.position.set(2.0, 2.2, 0);
    rightArm.rotation.z = -0.4;
    bossGroup.add(rightArm);

    scene.add(bossGroup);

    return {
      name: config.name || config.title,
      title: config.title,
      mesh: bossGroup,
      hp: config.hp,
      maxHp: config.hp,
      color: config.color,
      barColor: config.barColor || 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6)',
      attackTimer: 0,
      hitCooldown: 0,
      isDead: false
    };
  }

function createDarkLordBoss(game, scene, spawnPos) {
    const THREE = window.THREE;
    const bossGroup = new THREE.Group();
    bossGroup.position.copy(spawnPos);
    bossGroup.name = "dark_lord_boss";

    const blackMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.9, metalness: 0.1 });
    const redEyeMat = new THREE.MeshBasicMaterial({ color: 0xff002b });

    const body = new THREE.Mesh(new THREE.SphereGeometry(1.6, 20, 20), blackMat);
    body.position.y = 1.8;
    body.scale.set(1.1, 1.2, 1.0);
    bossGroup.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(1.2, 20, 20), blackMat);
    head.position.set(0, 3.4, 0.2);
    bossGroup.add(head);

    const leftEar = new THREE.Mesh(new THREE.SphereGeometry(0.42, 12, 12), blackMat);
    leftEar.position.set(-0.95, 4.3, 0);
    bossGroup.add(leftEar);
    const rightEar = leftEar.clone();
    rightEar.position.x = 0.95;
    bossGroup.add(rightEar);

    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), redEyeMat);
    leftEye.position.set(-0.4, 3.6, 1.18);
    bossGroup.add(leftEye);
    const rightEye = leftEye.clone();
    rightEye.position.x = 0.4;
    bossGroup.add(rightEye);

    const eyeLight = new THREE.PointLight(0xff002b, 3, 14);
    eyeLight.position.set(0, 3.6, 1.5);
    bossGroup.add(eyeLight);

    const snout = new THREE.Mesh(new THREE.SphereGeometry(0.45, 14, 14), blackMat);
    snout.position.set(0, 3.1, 1.15);
    bossGroup.add(snout);

    const leftPaw = new THREE.Mesh(new THREE.SphereGeometry(0.6, 12, 12), blackMat);
    leftPaw.position.set(-1.5, 1.8, 0.4);
    bossGroup.add(leftPaw);
    const rightPaw = leftPaw.clone();
    rightPaw.position.x = 1.5;
    bossGroup.add(rightPaw);

    const leftFoot = new THREE.Mesh(new THREE.SphereGeometry(0.65, 12, 12), blackMat);
    leftFoot.position.set(-0.8, 0.4, 0.2);
    bossGroup.add(leftFoot);
    const rightFoot = leftFoot.clone();
    rightFoot.position.x = 0.8;
    bossGroup.add(rightFoot);

    // Floating Crimson Crown of Dark Energy
    const crownRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.8, 0.1, 8, 20),
      new THREE.MeshBasicMaterial({ color: 0xdc2626 })
    );
    crownRing.rotation.x = Math.PI / 2;
    crownRing.position.set(0, 4.7, 0.2);
    bossGroup.add(crownRing);

    scene.add(bossGroup);

    return {
      name: "Dark Lord",
      title: "⚔️ BOSS: KARA DELİK HÜKÜMDARI DARK LORD",
      mesh: bossGroup,
      hp: 450,
      maxHp: 450,
      attackCooldown: 1.5,
      shockwaveTimer: 0,
      spawnPos: spawnPos.clone(),
      isDead: false
    };
  }

  // --- MOR AYI / MORİS FINAL BOSS (LEVEL 7) ---
  function createMorAyiBoss(game, scene, spawnPos) {
    const THREE = window.THREE;
    const bossGroup = new THREE.Group();
    bossGroup.position.copy(spawnPos);
    bossGroup.name = "mor_ayi_boss";

    const purpleFurMat = new THREE.MeshStandardMaterial({
      color: 0x6b21a8,
      roughness: 0.7,
      metalness: 0.25
    });
    const darkPurpleMat = new THREE.MeshStandardMaterial({
      color: 0x3b0764,
      roughness: 0.85
    });

    const body = new THREE.Mesh(new THREE.SphereGeometry(1.85, 20, 20), purpleFurMat);
    body.position.y = 2.0;
    body.scale.set(1.25, 1.35, 1.15);
    bossGroup.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(1.45, 20, 20), purpleFurMat);
    head.position.set(0, 3.85, 0.25);
    bossGroup.add(head);

    const leftEar = new THREE.Mesh(new THREE.SphereGeometry(0.52, 12, 12), purpleFurMat);
    leftEar.position.set(-1.15, 4.85, 0);
    bossGroup.add(leftEar);
    const rightEar = leftEar.clone();
    rightEar.position.x = 1.15;
    bossGroup.add(rightEar);

    // 1. SOL SAĞLAM ALTIN BOYNUZ (TALL, MAJESTIC, SWEEPING WITH CELESTIAL RUNE RINGS)
    const goldHornMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0xd97706,
      emissiveIntensity: 0.4
    });
    const leftHorn = new THREE.Mesh(new THREE.ConeGeometry(0.48, 2.7, 16), goldHornMat);
    leftHorn.position.set(0.95, 5.4, 0.15);
    leftHorn.rotation.set(0.2, 0, -0.32);
    bossGroup.add(leftHorn);

    // 3 Golden Starlight Rune Bands around left horn
    for (let r = 0; r < 3; r++) {
      const runeRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.40 - r * 0.08, 0.05, 8, 16),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
      );
      runeRing.position.set(0.95, 4.6 + r * 0.5, 0.15);
      runeRing.rotation.x = Math.PI / 2;
      bossGroup.add(runeRing);
    }

    // 2. SAĞ KIRIK BOYNUZ (FRACTURED, SHATTERED JAGGED CUT WITH GLOWING COSMIC MAGMA)
    const brokenHornBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.46, 0.5, 0.9, 14),
      goldHornMat
    );
    brokenHornBase.position.set(-0.95, 4.6, 0.15);
    brokenHornBase.rotation.set(0.2, 0, 0.32);
    bossGroup.add(brokenHornBase);

    // Jagged angled fracture face
    const fractureCutMat = new THREE.MeshBasicMaterial({ color: 0xff00aa });
    const fractureCut = new THREE.Mesh(new THREE.ConeGeometry(0.44, 0.4, 6), fractureCutMat);
    fractureCut.position.set(-0.95, 5.0, 0.15);
    fractureCut.rotation.set(-0.5, 0.3, 0.7);
    bossGroup.add(fractureCut);

    // Sizzling cosmic energy marrow at break point
    const marrowGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.38, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xec4899 })
    );
    marrowGlow.position.set(-0.95, 5.18, 0.15);
    bossGroup.add(marrowGlow);

    // Hovering broken horn shards & hot embers
    for (let s = 0; s < 4; s++) {
      const shard = new THREE.Mesh(
        new THREE.TetrahedronGeometry(0.14),
        new THREE.MeshBasicMaterial({ color: s % 2 === 0 ? 0xf59e0b : 0xf43f5e })
      );
      shard.position.set(-0.95 + (s - 1.5) * 0.22, 5.4 + (s % 2) * 0.2, 0.15 + (s - 1) * 0.1);
      bossGroup.add(shard);
    }

    // Glowing intense purple eyes
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), eyeMat);
    leftEye.position.set(-0.48, 4.05, 1.4);
    bossGroup.add(leftEye);
    const rightEye = leftEye.clone();
    rightEye.position.x = 0.48;
    bossGroup.add(rightEye);

    const snout = new THREE.Mesh(new THREE.SphereGeometry(0.55, 14, 14), darkPurpleMat);
    snout.position.set(0, 3.55, 1.35);
    bossGroup.add(snout);

    const leftPaw = new THREE.Mesh(new THREE.SphereGeometry(0.68, 12, 12), purpleFurMat);
    leftPaw.position.set(-1.65, 2.1, 0.5);
    bossGroup.add(leftPaw);

    const rightPaw = new THREE.Mesh(new THREE.SphereGeometry(0.68, 12, 12), purpleFurMat);
    rightPaw.position.set(1.65, 2.1, 0.5);
    bossGroup.add(rightPaw);

    // GIANT TENREX SLAM HAMMER GROUP (HELD IN RIGHT HAND)
    const hammerGroup = new THREE.Group();
    hammerGroup.name = "moris_hammer_group";
    hammerGroup.position.set(1.9, 1.9, 0.6);

    const hammerHandle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 4.4, 10),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.2 })
    );
    hammerHandle.position.set(0, 1.2, 0);
    hammerGroup.add(hammerHandle);

    const hammerHead = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 1.8, 2.8),
      new THREE.MeshStandardMaterial({
        color: 0x7c3aed,
        metalness: 0.9,
        roughness: 0.2,
        emissive: 0x4c1d95,
        emissiveIntensity: 0.6
      })
    );
    hammerHead.position.set(0, 3.2, 0);
    hammerGroup.add(hammerHead);

    // Glowing impact cores on hammer strike faces
    [-1.42, 1.42].forEach(faceZ => {
      const core = new THREE.Mesh(
        new THREE.CylinderGeometry(0.62, 0.62, 0.1, 14),
        new THREE.MeshBasicMaterial({ color: 0xec4899 })
      );
      core.rotation.x = Math.PI / 2;
      core.position.set(0, 3.2, faceZ);
      hammerGroup.add(core);
    });

    bossGroup.add(hammerGroup);

    const leftFoot = new THREE.Mesh(new THREE.SphereGeometry(0.72, 12, 12), purpleFurMat);
    leftFoot.position.set(-0.95, 0.5, 0.3);
    bossGroup.add(leftFoot);
    const rightFoot = leftFoot.clone();
    rightFoot.position.x = 0.95;
    bossGroup.add(rightFoot);

    scene.add(bossGroup);

    return {
      name: "Moris (Kırık Boynuzlu Mor Ayı)",
      title: "👑 FİNAL BOSS: KIRIK BOYNUZLU MORİS & DEV ÇEKİÇ",
      mesh: bossGroup,
      hp: 650,
      maxHp: 650,
      state: 'dialogue_wait', // Waits on his throne until player enters arena and speaks!
      attackCooldown: 1.5,
      slamCooldown: 3.2,
      leapCooldown: 7.0,
      hitCooldown: 0,
      isEnraged: false,
      spawnPos: spawnPos.clone(),
      isDead: false,
      walkTimer: 0,
      idleTimer: 0,
      slamWindup: 0,
      body,
      head,
      leftPaw,
      rightPaw,
      leftFoot,
      rightFoot,
      hammerGroup
    };
  }

  // --- CAGE & BADEM RESCUE CREATOR (LEVEL 7) ---
  function createCageAndBadem(game, scene, cagePos) {
    const THREE = window.THREE;
    const cGroup = new THREE.Group();
    cGroup.position.copy(cagePos);
    cGroup.name = "badem_prison_cage";

    const goldMetalMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.2
    });

    const baseDisk = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.6, 0.4, 24), goldMetalMat);
    baseDisk.position.y = 0.2;
    cGroup.add(baseDisk);

    const topDome = new THREE.Mesh(new THREE.SphereGeometry(2.4, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), goldMetalMat);
    topDome.position.y = 4.2;
    cGroup.add(topDome);

    const barMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.95 });
    for (let i = 0; i < 14; i++) {
      const angle = (i / 14) * Math.PI * 2;
      const bx = Math.sin(angle) * 2.2;
      const bz = Math.cos(angle) * 2.2;
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.0, 8), barMat);
      bar.position.set(bx, 2.2, bz);
      cGroup.add(bar);
    }

    const lockMesh = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.9, 0.4), goldMetalMat);
    lockMesh.position.set(0, 2.2, 2.3);
    cGroup.add(lockMesh);

    // BADEM BIRD
    const birdGroup = new THREE.Group();
    birdGroup.position.set(0, 1.8, 0);

    const birdBodyMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.5 });
    const birdBody = new THREE.Mesh(new THREE.SphereGeometry(0.45, 14, 14), birdBodyMat);
    birdGroup.add(birdBody);

    const birdHeadMat = new THREE.MeshStandardMaterial({ color: 0x0284c7 });
    const birdHead = new THREE.Mesh(new THREE.SphereGeometry(0.32, 14, 14), birdHeadMat);
    birdHead.position.set(0, 0.42, 0.2);
    birdGroup.add(birdHead);

    const wingMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
    const leftWing = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.35, 0.6), wingMat);
    leftWing.position.set(-0.48, 0.05, 0);
    birdGroup.add(leftWing);
    const rightWing = leftWing.clone();
    rightWing.position.x = 0.48;
    birdGroup.add(rightWing);

    const beakMat = new THREE.MeshStandardMaterial({ color: 0xf97316 });
    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.35, 8), beakMat);
    beak.rotation.x = Math.PI / 2;
    beak.position.set(0, 0.4, 0.55);
    birdGroup.add(beak);

    cGroup.add(birdGroup);
    scene.add(cGroup);

    cageMesh = cGroup;
    cageDoorMesh = lockMesh;
    bademBirdMesh = birdGroup;

    addBoxCollider(game, cagePos.x - 2.6, cagePos.y, cagePos.z - 2.6, cagePos.x + 2.6, cagePos.y + 5.0, cagePos.z + 2.6);
  }

  // --- SPAWN GOLDEN KEY AFTER DEFEATING MOR AYI ---
  function spawnGoldenKey(scene, pos) {
    const THREE = window.THREE;
    const keyGroup = new THREE.Group();
    keyGroup.position.set(pos.x, pos.y + 1.2, pos.z);
    keyGroup.name = "golden_cage_key";

    const keyMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xeab308,
      emissiveIntensity: 0.9,
      metalness: 0.9,
      roughness: 0.2
    });

    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.12, 12, 24), keyMat);
    ring.position.y = 0.8;
    keyGroup.add(ring);

    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.2, 8), keyMat);
    shaft.position.y = 0.0;
    keyGroup.add(shaft);

    const bit = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 0.35), keyMat);
    bit.position.set(0, -0.4, 0.2);
    keyGroup.add(bit);

    const aura = new THREE.PointLight(0xfacc15, 3, 8);
    aura.position.y = 0.5;
    keyGroup.add(aura);

    scene.add(keyGroup);
    goldenKeyMesh = keyGroup;
    isKeyCollected = false;
  }

  // --- UNLOCK CAGE ACTION TRIGGERED BY [B] KEY ---
  function tryUnlockCage() {
    const game = window.__superBearGame;
    if (!game) return;

    if (!isKeyCollected) {
      if (game.callbacks && game.callbacks.onShowNotice) {
        game.callbacks.onShowNotice("🔒 Kafes kilitli! Önce Mor Ayı'yı yenip Altın Anahtarı almalısın!", "warn");
      }
      return;
    }

    if (isBademRescued) {
      if (game.callbacks && game.callbacks.onShowNotice) {
        game.callbacks.onShowNotice("✨ Badem zaten kurtarıldı ve gökyüzünde sevinçle uçuyor!", "info");
      }
      return;
    }

    if (!cageMesh) return;
    const pPos = game.playerPos;
    if (pPos.distanceTo(cageMesh.position) > 8.0) {
      if (game.callbacks && game.callbacks.onShowNotice) {
        game.callbacks.onShowNotice("⚠️ Kafese daha yakın olmalısın!", "warn");
      }
      return;
    }

    isBademRescued = true;
    if (cageDoorMesh) cageDoorMesh.visible = false;
    if (cageMesh) {
      cageMesh.position.y -= 100;
    }

    window.dispatchEvent(new CustomEvent('superbear:badem-rescued'));
    if (game.callbacks && game.callbacks.onShowNotice) {
      game.callbacks.onShowNotice("🎉 Badem Kurtarıldı! 🪐 YEŞİL ÇİZGİ AÇILDI: Poneix Gezegeni Geçidi Belirdi!", "success");
    }

    // Spawn Green Line Portal to Poneix Gezegeni
    if (spaceSceneGroup && window.THREE) {
      const THREE = window.THREE;
      const greenPortalGroup = new THREE.Group();
      greenPortalGroup.position.set(0, 28.5, -236);
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(3.5, 0.5, 16, 32),
        new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x34d399, emissiveIntensity: 1.0 })
      );
      ring.rotation.y = 0;
      greenPortalGroup.add(ring);
      spaceSceneGroup.add(greenPortalGroup);

      animatedObjects.push({
        mesh: ring,
        update: () => { ring.rotation.z += 0.04; }
      });

      if (game.currentLevel) {
        game.currentLevel.nextPortal = {
          pos: new THREE.Vector3(0, 28.5, -236),
          targetRegion: "poneix_1_crash_valley",
          title: "🪐 Poneix Gezegeni (Yeşil Çizgi)",
          radius: 4.0
        };
      }
    }
  }

  // --- MOR AYI DIALOGUE SEQUENCE (LEVEL 7) ---
  const MORIS_DIALOGUES = [
    {
      step: 'mor_ayi_speech',
      speaker: "Mor Ayı (Moris)",
      speakerAvatar: "🦹",
      speakerRole: "Kırık Boynuzlu Kozmik Düşman",
      text: "Demek buraya kadar geldin Grizzy... Tüm o tehlikeli lazerleri ve asteroitleri aştın!",
      isMorAyi: true
    },
    {
      step: 'mor_ayi_speech',
      speaker: "Mor Ayı (Moris)",
      speakerAvatar: "🦹",
      speakerRole: "Kırık Boynuzlu Kozmik Düşman",
      text: "Kardeşimi (Dark Lord) devirdin ama beni asla yenemezsin! Bu kozmik evren benim!",
      isMorAyi: true
    },
    {
      step: 'player_speech',
      speaker: "Süper Ayı (Grizzy)",
      speakerAvatar: "🐻",
      speakerRole: "Kahraman & Dostumuz",
      text: "Kafese kapattığın sevimli kuşumuz Badem'i serbest bırak Moris! Artık bu çılgınlığa bir son vermelisin!",
      isMorAyi: false
    },
    {
      step: 'mor_ayi_speech',
      speaker: "Mor Ayı (Moris)",
      speakerAvatar: "🦹",
      speakerRole: "Kırık Boynuzlu Kozmik Düşman",
      text: "Kafesteki bu sarı kuşu (Badem) bana borçlusunuz! Kozmik çekicimle seni uzayın sonsuzluğuna fırlatacağım! GÜCÜMÜ GÖR!",
      isMorAyi: true
    }
  ];

  function triggerMorAyiDialogueSequence() {
    const game = window.__superBearGame;
    if (!game) return;

    isSpaceDialogueActive = true;
    spaceDialogueStep = 1;

    const currentLine = MORIS_DIALOGUES[0];
    window.dispatchEvent(new CustomEvent('superbear:space-dialogue', {
      detail: {
        isOpen: true,
        ...currentLine
      }
    }));

    if (game.callbacks && game.callbacks.onDialogueOpen) {
      game.callbacks.onDialogueOpen({
        npcId: "boss_mor_ayi",
        npcName: "Mor Ayı (Moris)",
        npcRole: "Kırık Boynuzlu Kozmik Düşman",
        avatarIcon: "🦹",
        dialogue: MORIS_DIALOGUES.map(d => `${d.speaker}: ${d.text}`)
      });
    }
  }

  function advanceSpaceDialogue() {
    const game = window.__superBearGame;
    if (!game) return;

    spaceDialogueStep++;
    if (spaceDialogueStep <= MORIS_DIALOGUES.length) {
      const currentLine = MORIS_DIALOGUES[spaceDialogueStep - 1];
      window.dispatchEvent(new CustomEvent('superbear:space-dialogue', {
        detail: {
          isOpen: true,
          ...currentLine
        }
      }));
    } else {
      isSpaceDialogueActive = false;
      window.dispatchEvent(new CustomEvent('superbear:space-dialogue', {
        detail: { isOpen: false }
      }));
      if (game.callbacks && game.callbacks.onDialogueOpen) {
        game.callbacks.onDialogueOpen(null);
      }
      if (morAyiBoss) {
        morAyiBoss.state = 'active';
        if (game.callbacks && game.callbacks.onShowNotice) {
          game.callbacks.onShowNotice("⚔️ SAVAŞ BAŞLADI! Mor Ayı'nın dev çekicinden ve şok dalgalarından zıplayarak kaç!", "error");
        }
      }
    }
  }

  // --- CREATE COSMIC STARFIELD & GALAXY SKYBOX ---
  function createCosmicStarfield(scene, skyColor = 0x0284c7, fogColor = 0x38bdf8, giantColor = 0x6366f1, ringColor = 0xa855f7) {
    if (!window.THREE) return;
    const THREE = window.THREE;

    const starfieldGroup = new THREE.Group();
    starfieldGroup.name = "cosmic_starfield_system";

    const starCount = 4000;
    const starGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const starPalette = [
      new THREE.Color(0xffffff),
      new THREE.Color(0x38bdf8),
      new THREE.Color(0xfde047),
      new THREE.Color(0xc084fc),
      new THREE.Color(0xf472b6),
      new THREE.Color(0x60a5fa),
      new THREE.Color(0x4ade80),
      new THREE.Color(0xfbbf24)
    ];

    for (let i = 0; i < starCount; i++) {
      const radius = 220 + Math.random() * 580;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const color = starPalette[Math.floor(Math.random() * starPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      fog: false
    });

    // Vibrant Celestial Sky Dome
    const skyDomeGeo = new THREE.SphereGeometry(650, 32, 24);
    const skyDomeMat = new THREE.MeshBasicMaterial({
      color: skyColor,
      side: THREE.BackSide,
      depthWrite: false
    });
    const skyDome = new THREE.Mesh(skyDomeGeo, skyDomeMat);
    starfieldGroup.add(skyDome);

    const starPoints = new THREE.Points(starGeometry, starMaterial);
    starfieldGroup.add(starPoints);

    if (scene && window.__superBearGame && window.__superBearGame.scene) {
      window.__superBearGame.scene.background = new THREE.Color(skyColor);
      window.__superBearGame.scene.fog = new THREE.FogExp2(fogColor, 0.001);
    }

    // Gas Giant with Rings
    const gasGiantGroup = new THREE.Group();
    gasGiantGroup.position.set(160, 90, -260);

    const planetMesh = new THREE.Mesh(
      new THREE.SphereGeometry(26, 24, 24),
      new THREE.MeshStandardMaterial({
        color: giantColor,
        emissive: giantColor,
        emissiveIntensity: 0.35,
        roughness: 0.6
      })
    );
    gasGiantGroup.add(planetMesh);

    const ringMesh = new THREE.Mesh(
      new THREE.RingGeometry(34, 52, 32),
      new THREE.MeshBasicMaterial({
        color: ringColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65
      })
    );
    ringMesh.rotation.x = Math.PI / 2.6;
    ringMesh.rotation.y = 0.2;
    gasGiantGroup.add(ringMesh);
    starfieldGroup.add(gasGiantGroup);

    // Glowing Crimson Moon
    const redMoon = new THREE.Mesh(
      new THREE.SphereGeometry(14, 18, 18),
      new THREE.MeshStandardMaterial({
        color: 0xf43f5e,
        emissive: 0x881337,
        emissiveIntensity: 0.6,
        roughness: 0.8
      })
    );
    redMoon.position.set(-200, 110, -180);
    starfieldGroup.add(redMoon);

    scene.add(starfieldGroup);

    animatedObjects.push({
      mesh: starfieldGroup,
      update: () => {
        starfieldGroup.rotation.y += 0.0003;
        starfieldGroup.rotation.x += 0.0001;
        gasGiantGroup.rotation.y += 0.001;
      }
    });

    return starfieldGroup;
  }

  // --- UNIQUE MECHANIC 1: SPEED BOOST LAUNCH RING (LEVEL 1) ---
  function addSpeedBoostRing(game, scene, x, y, z, forwardBoost = 0.55) {
    const THREE = window.THREE;
    const ringGroup = new THREE.Group();
    ringGroup.position.set(x, y, z);

    const ringGeo = new THREE.TorusGeometry(3.6, 0.35, 12, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringGroup.add(ringMesh);

    // Chevron indicators inside
    for (let c = 0; c < 3; c++) {
      const chev = new THREE.Mesh(
        new THREE.ConeGeometry(0.3, 1.2, 4),
        new THREE.MeshBasicMaterial({ color: 0x67e8f9 })
      );
      chev.position.set(0, 0, (c - 1) * 0.8);
      chev.rotation.x = -Math.PI / 2;
      ringGroup.add(chev);
    }

    scene.add(ringGroup);

    animatedObjects.push({
      mesh: ringGroup,
      update: () => {
        ringGroup.rotation.z += 0.03;
      }
    });

    speedBoostRings.push({
      x, y, z,
      radius: 4.2,
      forwardBoost,
      cooldown: 0
    });
  }

  // --- UNIQUE MECHANIC 2: BOUNCY CRYSTAL MUSHROOM TRAMPOLINE (LEVEL 2) ---
  function addBouncyCrystalMushroom(game, scene, x, y, z, bounceVelocity = 1.35, color = 0xd946ef) {
    const THREE = window.THREE;
    const mGroup = new THREE.Group();
    mGroup.position.set(x, y, z);

    // Glowing crystal stem
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.8, 3.5, 8),
      new THREE.MeshStandardMaterial({ color: 0x4a044e, roughness: 0.5 })
    );
    stem.position.y = 1.75;
    mGroup.add(stem);

    // Bouncy crystal cap
    const capMat = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.7,
      roughness: 0.2
    });
    const cap = new THREE.Mesh(
      new THREE.SphereGeometry(3.2, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      capMat
    );
    cap.position.y = 3.5;
    mGroup.add(cap);

    // Glowing perimeter ring
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.2, 0.2, 8, 24),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 3.5;
    mGroup.add(ring);

    scene.add(mGroup);
    addBoxCollider(game, x - 3.2, y, z - 3.2, x + 3.2, y + 4.2, z + 3.2);

    animatedObjects.push({
      mesh: mGroup,
      update: () => {
        cap.scale.y = 1.0 + Math.sin(Date.now() * 0.005) * 0.08;
      }
    });

    // Register trampoline hazard/sensor
    spaceHazards.push({
      type: 'trampoline',
      x, y: y + 4.0, z,
      radius: 3.5,
      bounce: bounceVelocity
    });
  }

  // --- UNIQUE MECHANIC 3: ROTATING INDUSTRIAL PLASMA GEAR (LEVEL 3) ---
  function addRotatingGearPlatform(game, scene, x, y, z, radius = 6.5, rotSpeed = 0.015) {
    const THREE = window.THREE;
    const gearGroup = new THREE.Group();
    gearGroup.position.set(x, y, z);

    const gearMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.25
    });

    // Central hub disc
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 2.0, 24), gearMat);
    disc.position.y = -1.0;
    gearGroup.add(disc);

    // Gear teeth around edge
    const teethCount = 8;
    for (let t = 0; t < teethCount; t++) {
      const angle = (t / teethCount) * Math.PI * 2;
      const tooth = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 2.0, 2.4),
        gearMat
      );
      tooth.position.set(
        Math.sin(angle) * (radius + 0.8),
        -1.0,
        Math.cos(angle) * (radius + 0.8)
      );
      tooth.rotation.y = angle;
      gearGroup.add(tooth);
    }

    // Glowing cyan plasma core
    const core = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.4, radius * 0.4, 0.1, 16),
      new THREE.MeshBasicMaterial({ color: 0x06b6d4 })
    );
    core.position.y = 0.05;
    gearGroup.add(core);

    scene.add(gearGroup);
    addBoxCollider(game, x - radius, y - 2.0, z - radius, x + radius, y, z + radius);

    rotatingGears.push({
      mesh: gearGroup,
      speed: rotSpeed
    });

    animatedObjects.push({
      mesh: gearGroup,
      update: () => {
        gearGroup.rotation.y += rotSpeed;
      }
    });
  }

  // --- UNIQUE MECHANIC 4: ERUPTING SOLAR FLARE GEYSER (LEVEL 5) ---
  function addEruptingSolarGeyser(game, scene, x, y, z, height = 20) {
    const THREE = window.THREE;
    const flareMat = new THREE.MeshBasicMaterial({
      color: 0xff5500,
      transparent: true,
      opacity: 0.8
    });
    const flameGeo = new THREE.CylinderGeometry(1.6, 2.4, height, 12);
    const flameMesh = new THREE.Mesh(flameGeo, flareMat);
    flameMesh.position.set(x, y + height / 2, z);
    flameMesh.scale.set(0.1, 0.1, 0.1);
    scene.add(flameMesh);

    solarFlares.push({
      mesh: flameMesh,
      x, y, z,
      height,
      phase: Math.random() * Math.PI * 2,
      erupting: false
    });
  }

  // --- UNIQUE MECHANIC 5: SWIRLING BLACK HOLE VORTEX (LEVEL 6) ---
  function addBlackHoleVortexDisc(game, scene, x, y, z, radius = 24) {
    const THREE = window.THREE;
    const vGroup = new THREE.Group();
    vGroup.position.set(x, y, z);

    // Event horizon sphere (pure pitch black)
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 0.28, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    vGroup.add(core);

    // Accretion disk rings
    const diskMat = new THREE.MeshBasicMaterial({
      color: 0xdc2626,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75
    });
    const disk = new THREE.Mesh(
      new THREE.RingGeometry(radius * 0.35, radius, 32),
      diskMat
    );
    disk.rotation.x = Math.PI / 2;
    vGroup.add(disk);

    // Second inner swirling ring
    const innerRing = new THREE.Mesh(
      new THREE.RingGeometry(radius * 0.3, radius * 0.6, 24),
      new THREE.MeshBasicMaterial({ color: 0xfbbf24, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
    );
    innerRing.rotation.x = Math.PI / 2;
    vGroup.add(innerRing);

    scene.add(vGroup);

    blackHoleVortex = {
      group: vGroup,
      disk,
      innerRing,
      x, y, z,
      radius
    };

    animatedObjects.push({
      mesh: vGroup,
      update: () => {
        disk.rotation.z += 0.015;
        innerRing.rotation.z -= 0.025;
      }
    });
  }

  // ===================================================================
  // --- 7 ZORLU UZAY BÖLÜMÜNÜN İNŞA EDİLMESİ ---
  // ===================================================================

  // --- LEVEL 1: YILDIZ TOZU (ZORLU ASTEROİT PARKURU & HIZLANDIRICI HALKALAR) ---
  function buildSpaceLevel1(game, scene) {
    const THREE = window.THREE;
    createCosmicStarfield(scene, 0x0284c7, 0x38bdf8, 0x6366f1, 0xa855f7);

    const baseMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8, metalness: 0.3 });
    const mainBase = new THREE.Mesh(new THREE.CylinderGeometry(15, 17, 3, 24), baseMat);
    mainBase.position.set(0, -1.5, 0);
    scene.add(mainBase);
    addBoxCollider(game, -15, -3, -15, 15, 0, 15);

    const rimMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const rim = new THREE.Mesh(new THREE.TorusGeometry(15.2, 0.3, 12, 32), rimMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.05;
    scene.add(rim);

    // Floating orbital satellite decor
    const satGroup = new THREE.Group();
    satGroup.position.set(-18, 12, -8);
    const satBody = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.5, 3.5), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 }));
    satGroup.add(satBody);
    const solarL = new THREE.Mesh(new THREE.BoxGeometry(7, 0.1, 2.2), new THREE.MeshBasicMaterial({ color: 0x0284c7 }));
    solarL.position.x = -4.8;
    satGroup.add(solarL);
    const solarR = solarL.clone();
    solarR.position.x = 4.8;
    satGroup.add(solarR);
    scene.add(satGroup);
    animatedObjects.push({
      mesh: satGroup,
      update: () => {
        satGroup.rotation.y += 0.006;
        satGroup.rotation.z += 0.003;
      }
    });

    createTalkingSpaceNPC(game, scene, {
      id: "astro_cat_maya",
      name: "Kozmo Kedi Maya",
      role: "Uzay İstasyonu Rehberi",
      avatarIcon: "🐱‍🚀",
      suitColor: 0x6366f1,
      headColor: 0xf59e0b,
      pos: new THREE.Vector3(-4, 0, -3),
      dialogue: [
        "Miyav! Hoş geldin Grizzy! 1. Bölüm: YILDIZ TOZU ASTEROİT KUŞAĞI!",
        "Mavi gökyüzü altında asteroitler arası geçiş için Hızlandırıcı Halkaları (Mavi Halka) kullan!",
        "Platformların hızları ayarlandı, artık sakin ve rahat zıplayabilirsin!",
        "Aşağıdaki kozmik boşluğa düşersen canın yanar. 3 Kere Zıplama gücünü unutma!"
      ]
    });

    // Patrolling Drone in Spawn Sector
    addPatrollingAlienDrone(game, scene, new THREE.Vector3(0, 4.5, -12), 7.0, 0.025, 0x38bdf8);

    // 1. First series of stepping rocks
    const meteorMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.7 });
    const p1 = [
      { x: 0, y: 2.5, z: -19, r: 5.5 },
      { x: 5, y: 5.0, z: -30, r: 5.5 },
      { x: -4, y: 7.5, z: -41, r: 5.5 },
      { x: 3, y: 10.0, z: -52, r: 5.5 }
    ];

    p1.forEach((m) => {
      const rock = new THREE.Mesh(new THREE.CylinderGeometry(m.r, m.r * 1.1, 2.8, 16), meteorMat);
      rock.position.set(m.x, m.y - 1.4, m.z);
      scene.add(rock);
      addBoxCollider(game, m.x - m.r, m.y - 2.8, m.z - m.r, m.x + m.r, m.y, m.z + m.r);
      for (let c = 0; c < 5; c++) {
        const angle = (c / 5) * Math.PI * 2;
        addCoin(game, scene, m.x + Math.sin(angle) * (m.r * 0.65), m.y + 1.2, m.z + Math.cos(angle) * (m.r * 0.65), c === 0);
      }
    });

    // UNIQUE MECHANIC: Speed Boost Ring #1
    addSpeedBoostRing(game, scene, 3, 11.5, -57, 0.52);

    // 2. Moving Space Platform #1 (gentle speed 0.0055 for comfortable jumping)
    addMovingOscillatingPlatform(
      game, scene,
      new THREE.Vector3(3, 11.5, -61),
      new THREE.Vector3(-2, 13.5, -72),
      0.0055, 6.5, 6.5, 0x0284c7
    );

    // 3. Central Laser Obstacle Platform (Hub Rock)
    const hubRock = new THREE.Mesh(new THREE.CylinderGeometry(8.5, 9.0, 3.2, 20), meteorMat);
    hubRock.position.set(0, 15.5, -83);
    scene.add(hubRock);
    addBoxCollider(game, -8.5, 13.5, -91.5, 8.5, 17.1, -74.5);
    addCheckpoint(game, scene, 0, 17.1, -83, "Lazerli Asteroit İstasyonu", false);
    addJumpPad(game, scene, 0, 17.1, -80, 22, 0x0284c7);

    // ROTATING DUAL LASER BARRIER ON HUB ROCK (Must time jump!)
    addRotatingLaserBarrier(game, scene, 0, 17.1, -83, 13.0, 0.024, 0xef4444, true);

    // Intermediate stepping rock
    const intermediateRock = new THREE.Mesh(new THREE.CylinderGeometry(6.0, 6.6, 2.8, 16), meteorMat);
    intermediateRock.position.set(-4, 18.0, -96);
    scene.add(intermediateRock);
    addBoxCollider(game, -10, 16.6, -102, 2, 19.4, -90);
    addCoin(game, scene, -4, 20.6, -96, true);

    // UNIQUE MECHANIC: Speed Boost Ring #2
    addSpeedBoostRing(game, scene, -4, 19.5, -101, 0.55);

    // 4. Moving Space Platform #2 (gentle speed 0.0055)
    addMovingOscillatingPlatform(
      game, scene,
      new THREE.Vector3(-3, 21.0, -106),
      new THREE.Vector3(3, 23.5, -117),
      0.0055, 6.5, 6.5, 0x06b6d4
    );

    // 5. Higher Rock Chain with Drone
    const p2 = [
      { x: 4, y: 25.5, z: -127, r: 6.0 },
      { x: -3, y: 28.5, z: -138, r: 6.0 },
      { x: 3, y: 31.5, z: -149, r: 6.0 }
    ];

    p2.forEach((m, idx) => {
      const rock = new THREE.Mesh(new THREE.CylinderGeometry(m.r, m.r * 1.1, 2.8, 16), meteorMat);
      rock.position.set(m.x, m.y - 1.4, m.z);
      scene.add(rock);
      addBoxCollider(game, m.x - m.r, m.y - 2.8, m.z - m.r, m.x + m.r, m.y, m.z + m.r);
      for (let c = 0; c < 6; c++) {
        const angle = (c / 6) * Math.PI * 2;
        addCoin(game, scene, m.x + Math.sin(angle) * (m.r * 0.65), m.y + 1.2, m.z + Math.cos(angle) * (m.r * 0.65), c < 2);
      }
      if (idx === 1) {
        addRotatingLaserBarrier(game, scene, m.x, m.y, m.z, 9.5, 0.028, 0x38bdf8, false);
      }
      addJumpPad(game, scene, m.x, m.y, m.z, 22, 0x38bdf8);
    });

    addPatrollingAlienDrone(game, scene, new THREE.Vector3(0, 34, -138), 6.5, 0.025, 0x0284c7);

    // 6. Sector 3 Station & Checkpoint (z: -168)
    const stationIsland = new THREE.Mesh(new THREE.CylinderGeometry(11, 12.5, 3.5, 22), baseMat);
    stationIsland.position.set(0, 34.5, -168);
    scene.add(stationIsland);
    addBoxCollider(game, -11, 32.5, -179, 11, 36.5, -157);
    addCheckpoint(game, scene, 0, 36.5, -168, "Asteroit İkmal İstasyonu", false);
    addJumpPad(game, scene, 0, 36.5, -165, 22, 0x0284c7);

    for (let c = 0; c < 8; c++) {
      const angle = (c / 8) * Math.PI * 2;
      addCoin(game, scene, Math.sin(angle) * 7.5, 37.7, -168 + Math.cos(angle) * 7.5, c % 2 === 0);
    }

    // Side secret cosmic honey treasure rock
    const secretRock = new THREE.Mesh(new THREE.CylinderGeometry(5.0, 5.5, 2.5, 14), meteorMat);
    secretRock.position.set(16, 35.0, -168);
    scene.add(secretRock);
    addBoxCollider(game, 11, 33.5, -173, 21, 36.5, -163);
    addCoin(game, scene, 16, 37.5, -168, true);

    // 7. Sector 4: Deep Asteroid Canyon & Slow Magnetic Platform #3
    addMovingOscillatingPlatform(
      game, scene,
      new THREE.Vector3(0, 37.0, -182),
      new THREE.Vector3(-4, 39.5, -198),
      0.005, 7.0, 7.0, 0x0284c7
    );

    // Stepping asteroids in deep canyon
    const p3 = [
      { x: 3, y: 41.5, z: -212, r: 6.0 },
      { x: -3, y: 44.0, z: -224, r: 6.0 },
      { x: 4, y: 46.5, z: -236, r: 6.0 }
    ];

    p3.forEach((m, idx) => {
      const rock = new THREE.Mesh(new THREE.CylinderGeometry(m.r, m.r * 1.1, 2.8, 16), meteorMat);
      rock.position.set(m.x, m.y - 1.4, m.z);
      scene.add(rock);
      addBoxCollider(game, m.x - m.r, m.y - 2.8, m.z - m.r, m.x + m.r, m.y, m.z + m.r);
      for (let c = 0; c < 5; c++) {
        const angle = (c / 5) * Math.PI * 2;
        addCoin(game, scene, m.x + Math.sin(angle) * (m.r * 0.6), m.y + 1.2, m.z + Math.cos(angle) * (m.r * 0.6), c === 0);
      }
      if (idx === 1) {
        addRotatingLaserBarrier(game, scene, m.x, m.y, m.z, 10.0, 0.026, 0xef4444, false);
      }
      addJumpPad(game, scene, m.x, m.y, m.z, 22, 0x38bdf8);
    });

    addPatrollingAlienDrone(game, scene, new THREE.Vector3(0, 48, -224), 7.0, 0.022, 0x06b6d4);

    // Mid-spire checkpoint
    const midSpire = new THREE.Mesh(new THREE.CylinderGeometry(9.0, 10.0, 3.5, 20), baseMat);
    midSpire.position.set(0, 49.0, -252);
    scene.add(midSpire);
    addBoxCollider(game, -9.0, 47.0, -261, 9.0, 51.0, -243);
    addCheckpoint(game, scene, 0, 51.0, -252, "Kozmik İleri Karakol", false);
    addRotatingLaserBarrier(game, scene, 0, 51.0, -252, 12.0, 0.024, 0x38bdf8, true);

    // UNIQUE MECHANIC: Speed Boost Ring #3
    addSpeedBoostRing(game, scene, 0, 52.0, -260, 0.58);

    // 8. Sector 5: Grand Final Ascent & Slow Gliding Ferry #4
    addMovingOscillatingPlatform(
      game, scene,
      new THREE.Vector3(0, 52.5, -266),
      new THREE.Vector3(4, 55.0, -284),
      0.005, 7.0, 7.0, 0x38bdf8
    );

    const stepFinal = new THREE.Mesh(new THREE.CylinderGeometry(6.5, 7.2, 3.0, 16), meteorMat);
    stepFinal.position.set(-2, 57.0, -298);
    scene.add(stepFinal);
    addBoxCollider(game, -8.5, 55.5, -304.5, 4.5, 58.5, -291.5);
    addJumpPad(game, scene, -2, 58.5, -298, 24, 0x38bdf8);

    // 9. Grand Final Destination Island (z: -325)
    const finalIsland = new THREE.Mesh(new THREE.CylinderGeometry(17, 19, 4, 24), baseMat);
    finalIsland.position.set(0, 60.0, -325);
    scene.add(finalIsland);
    addBoxCollider(game, -17, 58.0, -342, 17, 62.0, -308);

    for (let c = 0; c < 14; c++) {
      const angle = (c / 14) * Math.PI * 2;
      addCoin(game, scene, Math.sin(angle) * 12, 63.2, -325 + Math.cos(angle) * 12, c % 3 === 0);
    }

    currentLevelBoss = spawnSpaceLevelBoss(game, scene, {
      name: "Kozmik Siber Nöbetçi",
      title: "🤖 BOSS: KOZMİK SİBER NÖBETÇİ",
      hp: 80,
      pos: new THREE.Vector3(0, 62.0, -320),
      color: 0x38bdf8,
      barColor: 'linear-gradient(90deg, #0284c7, #38bdf8, #60a5fa)',
      type: 'sentinel'
    });
    addExitPortal(game, scene, 0, 62.0, -325, "space_2_nebula", "Uzay 2. Bölüm: Neon Nebulası");
  }

  // --- LEVEL 2: NEON NEBULASI & KRİSTAL KULE (DİKEY TIRMANIŞ & KRİSTAL TRAMBOLİNLERİ) ---
  function buildSpaceLevel2(game, scene) {
    const THREE = window.THREE;
    createCosmicStarfield(scene, 0x581c87, 0x701a75, 0xd946ef, 0xec4899);

    const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.6, metalness: 0.4 });
    const mainBase = new THREE.Mesh(new THREE.CylinderGeometry(15, 17, 3, 24), baseMat);
    mainBase.position.set(0, -1.5, 0);
    scene.add(mainBase);
    addBoxCollider(game, -15, -3, -15, 15, 0, 15);

    // Decorative Glowing Crystal Spires
    [-18, 18].forEach(sx => {
      const spire = new THREE.Mesh(
        new THREE.ConeGeometry(2.4, 18, 6),
        new THREE.MeshStandardMaterial({ color: 0xd946ef, emissive: 0xa21caf, emissiveIntensity: 0.6, roughness: 0.2 })
      );
      spire.position.set(sx, 7.5, -4);
      scene.add(spire);
    });

    createTalkingSpaceNPC(game, scene, {
      id: "astro_pilot_barni",
      name: "Uzay Pilotu Barni",
      role: "Nebula Kaşifi",
      avatarIcon: "🐻‍🚀",
      suitColor: 0xdb2777,
      headColor: 0x8b5cf6,
      pos: new THREE.Vector3(3, 0, -4),
      dialogue: [
        "Vay canına Grizzy! 2. Bölüm: NEON NEBULASI & KRİSTAL KULE!",
        "Gökyüzü eflatun-mor nebula gazlarıyla ışıldıyor!",
        "Yüksek basamaklara tırmanmak için parlayan Pembe Kristal Trambolinlerin üzerine zıpla!",
        "Platformların hızları yavaşlatıldı, rahatça kristal kuleye tırman!"
      ]
    });

    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0xd946ef,
      emissive: 0xa21caf,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.7
    });

    // Ascending spiral platforms (hexagonal crystals)
    const spiral = [
      { x: -4, y: 2.5, z: -19, r: 5.5 },
      { x: 4, y: 5.0, z: -30, r: 5.5 },
      { x: -3, y: 7.5, z: -41, r: 5.5 },
      { x: 3, y: 10.0, z: -52, r: 5.5 }
    ];

    spiral.forEach(p => {
      const isl = new THREE.Mesh(new THREE.CylinderGeometry(p.r, p.r * 1.1, 2.5, 6), crystalMat);
      isl.position.set(p.x, p.y - 1.25, p.z);
      scene.add(isl);
      addBoxCollider(game, p.x - p.r, p.y - 2.5, p.z - p.r, p.x + p.r, p.y, p.z + p.r);
      for (let c = 0; c < 5; c++) {
        const angle = (c / 5) * Math.PI * 2;
        addCoin(game, scene, p.x + Math.sin(angle) * (p.r * 0.65), p.y + 1.2, p.z + Math.cos(angle) * (p.r * 0.65), c === 0);
      }
    });

    // UNIQUE MECHANIC: Bouncy Crystal Mushroom Trampoline #1
    addBouncyCrystalMushroom(game, scene, 3, 10.0, -52, 1.35, 0xd946ef);

    // Moving neon crystal platform (gentle speed 0.0055)
    addMovingOscillatingPlatform(
      game, scene,
      new THREE.Vector3(3, 11.5, -61),
      new THREE.Vector3(-2, 13.5, -72),
      0.0055, 6.5, 6.5, 0xd946ef
    );

    // Mid tower with 4-way rotating laser gate
    const midTower = new THREE.Mesh(new THREE.CylinderGeometry(8.5, 9.0, 3.5, 20), crystalMat);
    midTower.position.set(0, 16.0, -83);
    scene.add(midTower);
    addBoxCollider(game, -8.5, 14.0, -91.5, 8.5, 17.8, -74.5);
    addCheckpoint(game, scene, 0, 17.8, -83, "Kristal Nebula İstasyonu");
    addJumpPad(game, scene, 0, 17.8, -80, 22, 0xec4899);

    // 4-Way Rotating Deadly Laser Cross
    addRotatingLaserBarrier(game, scene, 0, 17.8, -83, 13.0, 0.03, 0xec4899, true);

    // Patrolling Drone
    addPatrollingAlienDrone(game, scene, new THREE.Vector3(0, 22, -83), 7.5, 0.028, 0xd946ef);

    // Stepping crystal
    const stepCrystal = new THREE.Mesh(new THREE.CylinderGeometry(6.0, 6.6, 2.5, 6), crystalMat);
    stepCrystal.position.set(4, 18.5, -96);
    scene.add(stepCrystal);
    addBoxCollider(game, -2, 17.0, -102, 10, 19.8, -90);
    addCoin(game, scene, 4, 21.0, -96, true);

    // UNIQUE MECHANIC: Bouncy Crystal Mushroom Trampoline #2
    addBouncyCrystalMushroom(game, scene, 4, 18.5, -96, 1.35, 0x06b6d4);

    // Moving Platform #2 to peak (gentle speed 0.0055)
    addMovingOscillatingPlatform(
      game, scene,
      new THREE.Vector3(3, 22.0, -106),
      new THREE.Vector3(-3, 24.5, -117),
      0.0055, 6.5, 6.5, 0xec4899
    );

    // High steps
    const highSteps = [
      { x: -4, y: 27.0, z: -128, r: 6.0 },
      { x: 3, y: 30.5, z: -140, r: 6.0 },
      { x: -2, y: 33.5, z: -151, r: 6.0 }
    ];

    highSteps.forEach((p, idx) => {
      const isl = new THREE.Mesh(new THREE.CylinderGeometry(p.r, p.r * 1.1, 2.5, 6), crystalMat);
      isl.position.set(p.x, p.y - 1.25, p.z);
      scene.add(isl);
      addBoxCollider(game, p.x - p.r, p.y - 2.5, p.z - p.r, p.x + p.r, p.y, p.z + p.r);
      addJumpPad(game, scene, p.x, p.y, p.z, 22, 0xec4899);
      if (idx === 0) {
        addRotatingLaserBarrier(game, scene, p.x, p.y, p.z, 9.0, 0.028, 0xef4444, false);
      }
    });

    // Mid Sanctuary Peak & Checkpoint 2 (z: -169)
    const midPeak = new THREE.Mesh(new THREE.CylinderGeometry(11, 12.5, 3.5, 22), baseMat);
    midPeak.position.set(0, 36.5, -169);
    scene.add(midPeak);
    addBoxCollider(game, -11, 34.5, -180, 11, 38.5, -158);
    addCheckpoint(game, scene, 0, 38.5, -169, "Nebula Kristal Mabedi", false);
    addJumpPad(game, scene, 0, 38.5, -166, 22, 0xec4899);

    for (let c = 0; c < 8; c++) {
      const angle = (c / 8) * Math.PI * 2;
      addCoin(game, scene, Math.sin(angle) * 7.5, 39.7, -169 + Math.cos(angle) * 7.5, c % 2 === 0);
    }

    // Side secret crystal honey cache
    const secretCrystal = new THREE.Mesh(new THREE.CylinderGeometry(5.0, 5.5, 2.5, 6), crystalMat);
    secretCrystal.position.set(-16, 37.0, -169);
    scene.add(secretCrystal);
    addBoxCollider(game, -21, 35.5, -174, -11, 38.5, -164);
    addCoin(game, scene, -16, 39.5, -169, true);

    // UNIQUE MECHANIC: Bouncy Crystal Mushroom Trampoline #3
    addBouncyCrystalMushroom(game, scene, 0, 38.5, -174, 1.38, 0xd946ef);

    // Moving Platform #3 through deep purple nebula (gentle speed 0.005)
    addMovingOscillatingPlatform(
      game, scene,
      new THREE.Vector3(0, 39.0, -183),
      new THREE.Vector3(4, 41.5, -200),
      0.005, 7.0, 7.0, 0xd946ef
    );

    // Ascending neon crystal towers
    const p3 = [
      { x: -3, y: 43.5, z: -214, r: 6.0 },
      { x: 3, y: 46.0, z: -226, r: 6.0 },
      { x: -4, y: 48.5, z: -238, r: 6.0 }
    ];

    p3.forEach((p, idx) => {
      const isl = new THREE.Mesh(new THREE.CylinderGeometry(p.r, p.r * 1.1, 2.5, 6), crystalMat);
      isl.position.set(p.x, p.y - 1.25, p.z);
      scene.add(isl);
      addBoxCollider(game, p.x - p.r, p.y - 2.5, p.z - p.r, p.x + p.r, p.y, p.z + p.r);
      for (let c = 0; c < 5; c++) {
        const angle = (c / 5) * Math.PI * 2;
        addCoin(game, scene, p.x + Math.sin(angle) * (p.r * 0.6), p.y + 1.2, p.z + Math.cos(angle) * (p.r * 0.6), c === 0);
      }
      if (idx === 1) {
        addRotatingLaserBarrier(game, scene, p.x, p.y, p.z, 10.0, 0.026, 0xec4899, true);
      }
      addJumpPad(game, scene, p.x, p.y, p.z, 22, 0xd946ef);
    });

    addPatrollingAlienDrone(game, scene, new THREE.Vector3(0, 50, -226), 7.0, 0.022, 0xec4899);

    // Checkpoint 3 Spire
    const midSpire2 = new THREE.Mesh(new THREE.CylinderGeometry(9.0, 10.0, 3.5, 20), crystalMat);
    midSpire2.position.set(0, 51.0, -254);
    scene.add(midSpire2);
    addBoxCollider(game, -9.0, 49.0, -263, 9.0, 53.0, -245);
    addCheckpoint(game, scene, 0, 53.0, -254, "Yıldız Kristali Kulesi", false);
    addRotatingLaserBarrier(game, scene, 0, 53.0, -254, 12.0, 0.024, 0xd946ef, true);

    // UNIQUE MECHANIC: Bouncy Crystal Mushroom Trampoline #4
    addBouncyCrystalMushroom(game, scene, 0, 53.0, -260, 1.4, 0x06b6d4);

    // Moving Platform #4 (gentle speed 0.005)
    addMovingOscillatingPlatform(
      game, scene,
      new THREE.Vector3(0, 54.5, -268),
      new THREE.Vector3(-4, 57.0, -288),
      0.005, 7.0, 7.0, 0xec4899
    );

    const stepFinal2 = new THREE.Mesh(new THREE.CylinderGeometry(6.5, 7.2, 3.0, 16), crystalMat);
    stepFinal2.position.set(3, 59.0, -302);
    scene.add(stepFinal2);
    addBoxCollider(game, -3.5, 57.5, -308.5, 9.5, 60.5, -295.5);
    addJumpPad(game, scene, 3, 60.5, -302, 24, 0xd946ef);

    // Grand Final Nebula Citadel (z: -330)
    const peak = new THREE.Mesh(new THREE.CylinderGeometry(17, 19, 4, 24), baseMat);
    peak.position.set(0, 62.0, -330);
    scene.add(peak);
    addBoxCollider(game, -17, 60.0, -347, 17, 64.0, -313);

    for (let c = 0; c < 14; c++) {
      const angle = (c / 14) * Math.PI * 2;
      addCoin(game, scene, Math.sin(angle) * 12, 65.2, -330 + Math.cos(angle) * 12, c % 3 === 0);
    }

    currentLevelBoss = spawnSpaceLevelBoss(game, scene, {
      name: "Neon Nebula Kristalloidi",
      title: "💎 BOSS: NEON NEBULA KRİSTALLOİDİ",
      hp: 100,
      pos: new THREE.Vector3(0, 64.0, -325),
      color: 0xa855f7,
      barColor: 'linear-gradient(90deg, #9333ea, #a855f7, #c084fc)',
      type: 'crystal'
    });
    addExitPortal(game, scene, 0, 64.0, -330, "space_3_plasma", "Uzay 3. Bölüm: Kozmik Plazma Geçidi");
  }

  // --- LEVEL 3: PLAZMA GEÇİDİ & DÖNEN DİŞLİLER (ALEVLİ PLAZMA GEYSERLERİ & DEV DİŞLİLER) ---
  function buildSpaceLevel3(game, scene) {
    const THREE = window.THREE;
    createCosmicStarfield(scene, 0x0f172a, 0x1e293b, 0x0284c7, 0x06b6d4);

    const baseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5, metalness: 0.8 });
    const mainBase = new THREE.Mesh(new THREE.CylinderGeometry(15, 17, 3, 24), baseMat);
    mainBase.position.set(0, -1.5, 0);
    scene.add(mainBase);
    addBoxCollider(game, -15, -3, -15, 15, 0, 15);

    // Decorative Heavy Industrial Plasma Conduits
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0891b2, emissiveIntensity: 0.4, metalness: 0.8 });
    [-17, 17].forEach(px => {
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 20, 12), pipeMat);
      pipe.position.set(px, 8, -5);
      pipe.rotation.z = Math.PI / 6 * (px > 0 ? 1 : -1);
      scene.add(pipe);
    });

    createTalkingSpaceNPC(game, scene, {
      id: "astro_owl_hektor",
      name: "Bilge Baykuş Hektor",
      role: "Plazma Mühendisi",
      avatarIcon: "🦉‍🚀",
      suitColor: 0x2563eb,
      headColor: 0x64748b,
      pos: new THREE.Vector3(-4, 0, -3),
      dialogue: [
        "Huu! 3. Bölüm: KOZMİK PLAZMA REAKTÖRÜ & DÖNEN DİŞLİLER!",
        "Koyu mavi endüstriyel gökyüzü altında dev plazma çarkları dönüyor!",
        "Dönen dev plazma dişlilerinin üzerine bastığında dişlinin yönünü takip et!",
        "Platform hızları yavaşlatıldı, rahatça dengeni sağlayabilirsin!"
      ]
    });

    // 1. Initial platforms with plasma geyser
    const p1 = [
      { x: 0, y: 2.5, z: -19, r: 5.5 },
      { x: 5, y: 5.0, z: -30, r: 5.5 },
      { x: -4, y: 7.5, z: -41, r: 5.5 },
      { x: 3, y: 10.0, z: -52, r: 5.5 }
    ];

    p1.forEach((p, idx) => {
      const plat = new THREE.Mesh(new THREE.BoxGeometry(p.r * 2, 2.5, p.r * 2), baseMat);
      plat.position.set(p.x, p.y - 1.25, p.z);
      scene.add(plat);
      addBoxCollider(game, p.x - p.r, p.y - 2.5, p.z - p.r, p.x + p.r, p.y, p.z + p.r);
      if (idx === 1) {
        addPlasmaGeyser(game, scene, p.x, p.y, p.z, 2.0, 3.0, 0x06b6d4);
      }
      if (idx === 2) {
        addJumpPad(game, scene, p.x, p.y, p.z, 22, 0x3b82f6);
      }
    });

    // UNIQUE MECHANIC: Rotating Industrial Plasma Gear #1
    addRotatingGearPlatform(game, scene, 0, 11.5, -61, 7.5, 0.016, 0x0284c7);

    // High Speed Magnetic Moving Platform (calibrated to gentle speed 0.0055)
    addMovingOscillatingPlatform(
      game, scene,
      new THREE.Vector3(3, 13.5, -68),
      new THREE.Vector3(-2, 14.5, -76),
      0.0055, 6.5, 6.5, 0x3b82f6
    );

    // Checkpoint platform with rotating plasma barrier
    const platMid = new THREE.Mesh(new THREE.CylinderGeometry(8.5, 9.0, 3.0, 18), baseMat);
    platMid.position.set(0, 16.0, -83);
    scene.add(platMid);
    addBoxCollider(game, -8.5, 14.0, -91.5, 8.5, 17.5, -74.5);
    addCheckpoint(game, scene, 0, 17.5, -83, "Plazma Reaktör Merkezi");
    addJumpPad(game, scene, 0, 17.5, -80, 22, 0x3b82f6);

    addRotatingLaserBarrier(game, scene, 0, 17.5, -83, 13.0, 0.024, 0x06b6d4, true);
    addPlasmaGeyser(game, scene, 0, 17.5, -83, 2.2, 4.0, 0x3b82f6);

    // Stepping platform
    const stepPlat = new THREE.Mesh(new THREE.BoxGeometry(12, 2.5, 12), baseMat);
    stepPlat.position.set(-4, 18.5, -96);
    scene.add(stepPlat);
    addBoxCollider(game, -10, 17.0, -102, 2, 19.8, -90);
    addJumpPad(game, scene, -4, 19.8, -96, 22, 0x3b82f6);

    // UNIQUE MECHANIC: Rotating Industrial Plasma Gear #2
    addRotatingGearPlatform(game, scene, 0, 21.0, -112, 7.5, -0.018, 0x06b6d4);

    // Moving Platform #2 (gentle speed 0.005)
    addMovingOscillatingPlatform(
      game, scene,
      new THREE.Vector3(-3, 23.5, -118),
      new THREE.Vector3(3, 25.5, -125),
      0.005, 6.5, 6.5, 0x06b6d4
    );

    // Stepping boxes with drones
    const p2 = [
      { x: 4, y: 27.0, z: -128, r: 6.0 },
      { x: -3, y: 30.5, z: -140, r: 6.0 },
      { x: 2, y: 33.5, z: -151, r: 6.0 }
    ];

    p2.forEach(p => {
      const plat = new THREE.Mesh(new THREE.BoxGeometry(p.r * 2, 2.5, p.r * 2), baseMat);
      plat.position.set(p.x, p.y - 1.25, p.z);
      scene.add(plat);
      addBoxCollider(game, p.x - p.r, p.y - 2.5, p.z - p.r, p.x + p.r, p.y, p.z + p.r);
      addJumpPad(game, scene, p.x, p.y, p.z, 22, 0x3b82f6);
    });

    addPatrollingAlienDrone(game, scene, new THREE.Vector3(-3, 35, -140), 6.5, 0.024, 0x3b82f6);

    // Mid-Plasma Substation Checkpoint 2 (z: -169)
    const midSubstation = new THREE.Mesh(new THREE.CylinderGeometry(11, 12.5, 3.5, 22), baseMat);
    midSubstation.position.set(0, 36.5, -169);
    scene.add(midSubstation);
    addBoxCollider(game, -11, 34.5, -180, 11, 38.5, -158);
    addCheckpoint(game, scene, 0, 38.5, -169, "Plazma Reaktör Alt İstasyonu", false);
    addJumpPad(game, scene, 0, 38.5, -166, 22, 0x06b6d4);

    for (let c = 0; c < 8; c++) {
      const angle = (c / 8) * Math.PI * 2;
      addCoin(game, scene, Math.sin(angle) * 7.5, 39.7, -169 + Math.cos(angle) * 7.5, c % 2 === 0);
    }

    // Side secret plasma chamber
    const secretPlat = new THREE.Mesh(new THREE.BoxGeometry(10, 2.5, 10), baseMat);
    secretPlat.position.set(16, 37.0, -169);
    scene.add(secretPlat);
    addBoxCollider(game, 11, 35.5, -174, 21, 38.5, -164);
    addCoin(game, scene, 16, 39.5, -169, true);

    // UNIQUE MECHANIC: Rotating Industrial Plasma Gear #3
    addRotatingGearPlatform(game, scene, 0, 39.0, -183, 8.0, 0.016, 0x3b82f6);

    // Moving Platform #3 (gentle speed 0.005)
    addMovingOscillatingPlatform(
      game, scene,
      new THREE.Vector3(0, 41.0, -192),
      new THREE.Vector3(-4, 42.5, -204),
      0.005, 7.0, 7.0, 0x06b6d4
    );

    // Stepping plasma reactors
    const p3 = [
      { x: 3, y: 43.5, z: -214, r: 6.0 },
      { x: -3, y: 46.0, z: -226, r: 6.0 },
      { x: 4, y: 48.5, z: -238, r: 6.0 }
    ];

    p3.forEach((p, idx) => {
      const plat = new THREE.Mesh(new THREE.BoxGeometry(p.r * 2, 2.5, p.r * 2), baseMat);
      plat.position.set(p.x, p.y - 1.25, p.z);
      scene.add(plat);
      addBoxCollider(game, p.x - p.r, p.y - 2.5, p.z - p.r, p.x + p.r, p.y, p.z + p.r);
      for (let c = 0; c < 5; c++) {
        const angle = (c / 5) * Math.PI * 2;
        addCoin(game, scene, p.x + Math.sin(angle) * (p.r * 0.6), p.y + 1.2, p.z + Math.cos(angle) * (p.r * 0.6), c === 0);
      }
      if (idx === 1) {
        addPlasmaGeyser(game, scene, p.x, p.y, p.z, 2.2, 3.5, 0x06b6d4);
      }
      addJumpPad(game, scene, p.x, p.y, p.z, 22, 0x3b82f6);
    });

    addPatrollingAlienDrone(game, scene, new THREE.Vector3(0, 50, -226), 7.0, 0.022, 0x3b82f6);

    // Checkpoint 3 Core Spire
    const midSpire3 = new THREE.Mesh(new THREE.CylinderGeometry(9.0, 10.0, 3.5, 20), baseMat);
    midSpire3.position.set(0, 51.0, -254);
    scene.add(midSpire3);
    addBoxCollider(game, -9.0, 49.0, -263, 9.0, 53.0, -245);
    addCheckpoint(game, scene, 0, 53.0, -254, "Yüksek Voltaj Çekirdeği", false);
    addRotatingLaserBarrier(game, scene, 0, 53.0, -254, 12.0, 0.024, 0x06b6d4, true);

    // Moving Platform #4 (gentle speed 0.005)
    addMovingOscillatingPlatform(
      game, scene,
      new THREE.Vector3(0, 54.5, -268),
      new THREE.Vector3(4, 57.0, -288),
      0.005, 7.0, 7.0, 0x3b82f6
    );

    const stepFinal3 = new THREE.Mesh(new THREE.BoxGeometry(13, 2.5, 13), baseMat);
    stepFinal3.position.set(-3, 59.0, -302);
    scene.add(stepFinal3);
    addBoxCollider(game, -9.5, 57.5, -308.5, 3.5, 60.5, -295.5);
    addJumpPad(game, scene, -3, 60.5, -302, 24, 0x3b82f6);

    // Grand Plasma Core Peak (z: -330)
    const finalIsland = new THREE.Mesh(new THREE.CylinderGeometry(17, 19, 4, 24), baseMat);
    finalIsland.position.set(0, 62.0, -330);
    scene.add(finalIsland);
    addBoxCollider(game, -17, 60.0, -347, 17, 64.0, -313);

    for (let c = 0; c < 14; c++) {
      const angle = (c / 14) * Math.PI * 2;
      addCoin(game, scene, Math.sin(angle) * 12, 65.2, -330 + Math.cos(angle) * 12, c % 3 === 0);
    }

    currentLevelBoss = spawnSpaceLevelBoss(game, scene, {
      name: "Plazma Dişli Devi",
      title: "⚙️ BOSS: PLAZMA DİŞLİ DEVİ",
      hp: 120,
      pos: new THREE.Vector3(0, 64.0, -325),
      color: 0xf59e0b,
      barColor: 'linear-gradient(90deg, #d97706, #f59e0b, #fbbf24)',
      type: 'gear_golem'
    });
    addExitPortal(game, scene, 0, 64.0, -330, "space_4_lunar", "Uzay 4. Bölüm: Ay Krateri Harabeleri");
  }

  // --- LEVEL 4: AY KRATERİ (METEOR FIRTINASI & ÇÖKMÜŞ AY MODÜLÜ) ---
  function buildSpaceLevel4(game, scene) {
    const THREE = window.THREE;
    createCosmicStarfield(scene, 0x1e293b, 0x334155, 0x94a3b8, 0xcfd8dc);

    const baseMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9, metalness: 0.2 });
    const mainBase = new THREE.Mesh(new THREE.CylinderGeometry(15, 17, 3, 24), baseMat);
    mainBase.position.set(0, -1.5, 0);
    scene.add(mainBase);
    addBoxCollider(game, -15, -3, -15, 15, 0, 15);

    // Decorative Crashed Apollo Lunar Lander (LEM)
    const lemGroup = new THREE.Group();
    lemGroup.position.set(-16, 0, 0);
    const lemBody = new THREE.Mesh(
      new THREE.OctahedronGeometry(2.5, 0),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9, roughness: 0.3 })
    );
    lemBody.position.y = 2.8;
    lemGroup.add(lemBody);
    const lemCabin = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 1.8, 2.0, 8),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 })
    );
    lemCabin.position.y = 4.6;
    lemGroup.add(lemCabin);
    for (let l = 0; l < 4; l++) {
      const legAng = (l / 4) * Math.PI * 2;
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.6), new THREE.MeshStandardMaterial({ color: 0xfacc15 }));
      leg.position.set(Math.sin(legAng) * 2.0, 1.2, Math.cos(legAng) * 2.0);
      leg.rotation.z = Math.sin(legAng) * 0.4;
      leg.rotation.x = Math.cos(legAng) * 0.4;
      lemGroup.add(leg);
    }
    scene.add(lemGroup);

    // Alien Monolith on opposite rim
    const monolith = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 7.5, 3.2),
      new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.1, metalness: 0.9, emissive: 0x38bdf8, emissiveIntensity: 0.2 })
    );
    monolith.position.set(16, 3.75, 0);
    scene.add(monolith);

    createTalkingSpaceNPC(game, scene, {
      id: "astro_fox_lora",
      name: "Nebula Tilkisi Lora",
      role: "Ay Arkeoloğu",
      avatarIcon: "🦊‍🚀",
      suitColor: 0xe0e7ff,
      headColor: 0xf97316,
      pos: new THREE.Vector3(4, 0, -3),
      dialogue: [
        "Kaskımın telsiziyle seni buldum! Burası 4. Bölüm: AY KRATERİ HARABELERİ!",
        "Sol tarafta tarihi bir Ay İniş Modülü (LEM) ve sağda gizemli bir uzay monoliti var!",
        "Platformların hızları ayarlandı, sakin ve dengeli zıplayabilirsin!",
        "5. Bölümdeki Süpernova Kanyonu ve 6. Bölümdeki korkunç DARK LORD'a yaklaşıyorsun!"
      ]
    });

    const p1 = [
      { x: -4, y: 2.5, z: -19, r: 5.5 },
      { x: 4, y: 5.0, z: -30, r: 5.5 },
      { x: -3, y: 7.5, z: -41, r: 5.5 },
      { x: 3, y: 10.0, z: -52, r: 5.5 }
    ];

    p1.forEach((p, idx) => {
      const crater = new THREE.Mesh(new THREE.CylinderGeometry(p.r, p.r * 1.15, 2.8, 16), baseMat);
      crater.position.set(p.x, p.y - 1.4, p.z);
      scene.add(crater);
      addBoxCollider(game, p.x - p.r, p.y - 2.8, p.z - p.r, p.x + p.r, p.y, p.z + p.r);
      if (idx === 1) {
        addRotatingLaserBarrier(game, scene, p.x, p.y, p.z, 9.5, 0.026, 0xf59e0b, false);
      }
      addJumpPad(game, scene, p.x, p.y, p.z, 24, 0x64748b);
    });

    // Moving Lunar Platform (gentle speed 0.0055)
    addMovingOscillatingPlatform(
      game, scene,
      new THREE.Vector3(3, 11.5, -61),
      new THREE.Vector3(-2, 13.5, -72),
      0.0055, 6.5, 6.5, 0x94a3b8
    );

    // Central Lunar Temple Platform
    const temple = new THREE.Mesh(new THREE.CylinderGeometry(8.5, 9.0, 3.2, 20), baseMat);
    temple.position.set(0, 16.0, -83);
    scene.add(temple);
    addBoxCollider(game, -8.5, 14.0, -91.5, 8.5, 17.6, -74.5);
    addCheckpoint(game, scene, 0, 17.6, -83, "Antik Ay Tapınağı");
    addJumpPad(game, scene, 0, 17.6, -80, 22, 0x94a3b8);

    addRotatingLaserBarrier(game, scene, 0, 17.6, -83, 13.0, 0.032, 0xef4444, true);
    addPatrollingAlienDrone(game, scene, new THREE.Vector3(0, 22, -83), 7.5, 0.028, 0x94a3b8);

    // Intermediate crater platform
    const stepCrater = new THREE.Mesh(new THREE.CylinderGeometry(6.0, 6.6, 2.8, 16), baseMat);
    stepCrater.position.set(4, 18.5, -96);
    scene.add(stepCrater);
    addBoxCollider(game, -2, 17.0, -102, 10, 19.8, -90);
    addJumpPad(game, scene, 4, 19.8, -96, 22, 0x64748b);

    // Moving Platform #2 (gentle speed 0.0055)
    addMovingOscillatingPlatform(
      game, scene,
      new THREE.Vector3(3, 22.0, -106),
      new THREE.Vector3(-3, 24.5, -117),
      0.0055, 6.5, 6.5, 0x64748b
    );

    const p2 = [
      { x: -4, y: 27.0, z: -128, r: 6.0 },
      { x: 3, y: 30.5, z: -140, r: 6.0 },
      { x: -2, y: 33.5, z: -151, r: 6.0 }
    ];
    p2.forEach(p => {
      const crater = new THREE.Mesh(new THREE.CylinderGeometry(p.r, p.r * 1.15, 2.8, 16), baseMat);
      crater.position.set(p.x, p.y - 1.4, p.z);
      scene.add(crater);
      addBoxCollider(game, p.x - p.r, p.y - 2.8, p.z - p.r, p.x + p.r, p.y, p.z + p.r);
      addJumpPad(game, scene, p.x, p.y, p.z, 24, 0x64748b);
    });

    // Mid Lunar Observatory Station & Checkpoint 2 (z: -169)
    const midObs = new THREE.Mesh(new THREE.CylinderGeometry(11, 12.5, 3.5, 22), baseMat);
    midObs.position.set(0, 36.5, -169);
    scene.add(midObs);
    addBoxCollider(game, -11, 34.5, -180, 11, 38.5, -158);
    addCheckpoint(game, scene, 0, 38.5, -169, "Ay Gözlemevi İstasyonu", false);
    addJumpPad(game, scene, 0, 38.5, -166, 24, 0x64748b);

    for (let c = 0; c < 8; c++) {
      const angle = (c / 8) * Math.PI * 2;
      addCoin(game, scene, Math.sin(angle) * 7.5, 39.7, -169 + Math.cos(angle) * 7.5, c % 2 === 0);
    }

    // Side secret lunar honey cache
    const secretLunar = new THREE.Mesh(new THREE.CylinderGeometry(5.0, 5.5, 2.5, 14), baseMat);
    secretLunar.position.set(-16, 37.0, -169);
    scene.add(secretLunar);
    addBoxCollider(game, -21, 35.5, -174, -11, 38.5, -164);
    addCoin(game, scene, -16, 39.5, -169, true);

    // Moving Shuttle #3 across deep lunar ravine (gentle speed 0.005)
    addMovingOscillatingPlatform(
      game, scene,
      new THREE.Vector3(0, 39.0, -183),
      new THREE.Vector3(4, 41.5, -200),
      0.005, 7.0, 7.0, 0x64748b
    );

    // Stepping crater stones
    const p3 = [
      { x: -3, y: 43.5, z: -214, r: 6.0 },
      { x: 3, y: 46.0, z: -226, r: 6.0 },
      { x: -4, y: 48.5, z: -238, r: 6.0 }
    ];

    p3.forEach(p => {
      const crater = new THREE.Mesh(new THREE.CylinderGeometry(p.r, p.r * 1.15, 2.8, 16), baseMat);
      crater.position.set(p.x, p.y - 1.4, p.z);
      scene.add(crater);
      addBoxCollider(game, p.x - p.r, p.y - 2.8, p.z - p.r, p.x + p.r, p.y, p.z + p.r);
      for (let c = 0; c < 5; c++) {
        const angle = (c / 5) * Math.PI * 2;
        addCoin(game, scene, p.x + Math.sin(angle) * (p.r * 0.6), p.y + 1.2, p.z + Math.cos(angle) * (p.r * 0.6), c === 0);
      }
      addJumpPad(game, scene, p.x, p.y, p.z, 22, 0x64748b);
    });

    addPatrollingAlienDrone(game, scene, new THREE.Vector3(0, 50, -226), 7.0, 0.025, 0x64748b);

    // Checkpoint 3 Ancient Temple Spire
    const midSpire4 = new THREE.Mesh(new THREE.CylinderGeometry(9.0, 10.0, 3.5, 20), baseMat);
    midSpire4.position.set(0, 51.0, -254);
    scene.add(midSpire4);
    addBoxCollider(game, -9.0, 49.0, -263, 9.0, 53.0, -245);
    addCheckpoint(game, scene, 0, 53.0, -254, "Kadim Ay Tapınağı", false);
    addRotatingLaserBarrier(game, scene, 0, 53.0, -254, 12.0, 0.026, 0x94a3b8, true);

    // Moving Shuttle #4
    addMovingOscillatingPlatform(
      game, scene,
      new THREE.Vector3(0, 54.5, -268),
      new THREE.Vector3(-4, 57.0, -288),
      0.0048, 7.0, 7.0, 0x94a3b8
    );

    const stepFinal4 = new THREE.Mesh(new THREE.CylinderGeometry(6.5, 7.2, 3.0, 16), baseMat);
    stepFinal4.position.set(3, 59.0, -302);
    scene.add(stepFinal4);
    addBoxCollider(game, -3.5, 57.5, -308.5, 9.5, 60.5, -295.5);
    addJumpPad(game, scene, 3, 60.5, -302, 24, 0x64748b);

    // Grand Lunar Summit (z: -330)
    const finalIsland = new THREE.Mesh(new THREE.CylinderGeometry(17, 19, 4, 24), baseMat);
    finalIsland.position.set(0, 62.0, -330);
    scene.add(finalIsland);
    addBoxCollider(game, -17, 60.0, -347, 17, 64.0, -313);

    for (let c = 0; c < 14; c++) {
      const angle = (c / 14) * Math.PI * 2;
      addCoin(game, scene, Math.sin(angle) * 12, 65.2, -330 + Math.cos(angle) * 12, c % 3 === 0);
    }

    currentLevelBoss = spawnSpaceLevelBoss(game, scene, {
      name: "Ay Krateri Meteor Behemoth",
      title: "🌑 BOSS: AY KRATERİ METEOR BEHEMOTH",
      hp: 140,
      pos: new THREE.Vector3(0, 64.0, -325),
      color: 0x94a3b8,
      barColor: 'linear-gradient(90deg, #475569, #94a3b8, #cbd5e1)',
      type: 'meteor'
    });
    addExitPortal(game, scene, 0, 64.0, -330, "space_5_supernova", "Uzay 5. Bölüm: Süpernova Kanyonu");
  }

  // --- LEVEL 5: SÜPERNOVA KANYONU (LAVLI DİSKLER & GÜNEŞ PATLAMASI GEYSERLERİ) ---
  function buildSpaceLevel5(game, scene) {
    const THREE = window.THREE;
    createCosmicStarfield(scene, 0x7f1d1d, 0x991b1b, 0xf97316, 0xfacc15);

    const baseMat = new THREE.MeshStandardMaterial({ color: 0x431407, roughness: 0.6, metalness: 0.4 });
    const mainBase = new THREE.Mesh(new THREE.CylinderGeometry(15, 17, 3, 24), baseMat);
    mainBase.position.set(0, -1.5, 0);
    scene.add(mainBase);
    addBoxCollider(game, -15, -3, -15, 15, 0, 15);

    createTalkingSpaceNPC(game, scene, {
      id: "astro_penguin_puki",
      name: "Kozmik Penguen Puki",
      role: "Süpernova Muhafızı",
      avatarIcon: "🐧‍🚀",
      suitColor: 0xea580c,
      headColor: 0x1e293b,
      pos: new THREE.Vector3(-3, 0, -4),
      dialogue: [
        "Vak vak! Burası 5. Bölüm: SÜPERNOVA KANYONU & GÜNEŞ PATLAMALARI!",
        "Kırmızı akkor alev gökyüzü altında lav geyserleri püskürüyor!",
        "Püsküren Güneş Fırtınalarının arasından zamanlamanı yaparak geç!",
        "Platform hızları yavaşlatıldı, Dark Lord'un Kalesine giden son geçidi aş!"
      ]
    });

    const lavaDiskMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0xc2410c,
      emissiveIntensity: 0.7,
      roughness: 0.3
    });

    const p1 = [
      { x: 0, y: 2.5, z: -19, r: 5.5 },
      { x: -4, y: 5.0, z: -30, r: 5.5 },
      { x: 4, y: 7.5, z: -41, r: 5.5 },
      { x: -3, y: 10.0, z: -52, r: 5.5 }
    ];

    p1.forEach((p, idx) => {
      const disk = new THREE.Mesh(new THREE.CylinderGeometry(p.r, p.r * 1.1, 2.5, 18), lavaDiskMat);
      disk.position.set(p.x, p.y - 1.25, p.z);
      scene.add(disk);
      addBoxCollider(game, p.x - p.r, p.y - 2.5, p.z - p.r, p.x + p.r, p.y, p.z + p.r);
      if (idx === 1) {
        addPlasmaGeyser(game, scene, p.x, p.y, p.z, 2.2, 3.0, 0xf97316);
      }
      addJumpPad(game, scene, p.x, p.y, p.z, 22, 0xf97316);
    });

    // UNIQUE MECHANIC: Erupting Solar Geyser #1
    addEruptingSolarGeyser(game, scene, 0, 10.0, -56, 12.0, 0xf97316);

    // Moving Lava Shuttle (gentle speed 0.0055)
    addMovingOscillatingPlatform(
      game, scene,
      new THREE.Vector3(-2, 11.5, -61),
      new THREE.Vector3(3, 13.5, -72),
      0.0055, 6.5, 6.5, 0xf97316
    );

    // Central Supernova Station
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(8.5, 9.0, 3.0, 20), lavaDiskMat);
    hub.position.set(0, 16.0, -83);
    scene.add(hub);
    addBoxCollider(game, -8.5, 14.0, -91.5, 8.5, 17.5, -74.5);
    addCheckpoint(game, scene, 0, 17.5, -83, "Süpernova Çekirdeği");
    addJumpPad(game, scene, 0, 17.5, -80, 22, 0xf97316);

    addRotatingLaserBarrier(game, scene, 0, 17.5, -83, 13.0, 0.024, 0xef4444, true);
    addPatrollingAlienDrone(game, scene, new THREE.Vector3(0, 22, -83), 7.5, 0.024, 0xf97316);

    // Intermediate lava disk
    const stepDisk = new THREE.Mesh(new THREE.CylinderGeometry(6.0, 6.6, 2.5, 18), lavaDiskMat);
    stepDisk.position.set(4, 18.5, -96);
    scene.add(stepDisk);
    addBoxCollider(game, -2, 17.0, -102, 10, 19.8, -90);
    addJumpPad(game, scene, 4, 19.8, -96, 22, 0xf97316);

    // UNIQUE MECHANIC: Erupting Solar Geyser #2
    addEruptingSolarGeyser(game, scene, 0, 20.0, -101, 14.0, 0xef4444);

    // Moving Platform #2 (gentle speed 0.0055)
    addMovingOscillatingPlatform(
      game, scene,
      new THREE.Vector3(3, 22.0, -106),
      new THREE.Vector3(-3, 24.5, -117),
      0.0055, 6.5, 6.5, 0xea580c
    );

    const p2 = [
      { x: -4, y: 27.0, z: -128, r: 6.0 },
      { x: 3, y: 30.5, z: -140, r: 6.0 },
      { x: -2, y: 33.5, z: -151, r: 6.0 }
    ];
    p2.forEach(p => {
      const disk = new THREE.Mesh(new THREE.CylinderGeometry(p.r, p.r * 1.1, 2.5, 18), lavaDiskMat);
      disk.position.set(p.x, p.y - 1.25, p.z);
      scene.add(disk);
      addBoxCollider(game, p.x - p.r, p.y - 2.5, p.z - p.r, p.x + p.r, p.y, p.z + p.r);
      addJumpPad(game, scene, p.x, p.y, p.z, 22, 0xf97316);
      addRotatingLaserBarrier(game, scene, p.x, p.y, p.z, 9.5, 0.035, 0xef4444, false);
    });

    // Mid Supernova Crucible Station & Checkpoint 2 (z: -169)
    const midCrucible = new THREE.Mesh(new THREE.CylinderGeometry(11, 12.5, 3.5, 22), baseMat);
    midCrucible.position.set(0, 36.5, -169);
    scene.add(midCrucible);
    addBoxCollider(game, -11, 34.5, -180, 11, 38.5, -158);
    addCheckpoint(game, scene, 0, 38.5, -169, "Süpernova İkmal Ocağı", false);
    addJumpPad(game, scene, 0, 38.5, -166, 22, 0xf97316);

    for (let c = 0; c < 8; c++) {
      const angle = (c / 8) * Math.PI * 2;
      addCoin(game, scene, Math.sin(angle) * 7.5, 39.7, -169 + Math.cos(angle) * 7.5, c % 2 === 0);
    }

    // Side secret molten honey cache
    const secretMagma = new THREE.Mesh(new THREE.CylinderGeometry(5.0, 5.5, 2.5, 14), lavaDiskMat);
    secretMagma.position.set(16, 37.0, -169);
    scene.add(secretMagma);
    addBoxCollider(game, 11, 35.5, -174, 21, 38.5, -164);
    addCoin(game, scene, 16, 39.5, -169, true);

    // Moving Lava Barge #3 across deep magma fissure (gentle speed 0.005)
    addMovingOscillatingPlatform(
      game, scene,
      new THREE.Vector3(0, 39.0, -183),
      new THREE.Vector3(-4, 41.5, -200),
      0.005, 7.0, 7.0, 0xea580c
    );

    // Stepping magma discs
    const p3 = [
      { x: 3, y: 43.5, z: -214, r: 6.0 },
      { x: -3, y: 46.0, z: -226, r: 6.0 },
      { x: 4, y: 48.5, z: -238, r: 6.0 }
    ];

    p3.forEach((p, idx) => {
      const disk = new THREE.Mesh(new THREE.CylinderGeometry(p.r, p.r * 1.1, 2.5, 18), lavaDiskMat);
      disk.position.set(p.x, p.y - 1.25, p.z);
      scene.add(disk);
      addBoxCollider(game, p.x - p.r, p.y - 2.5, p.z - p.r, p.x + p.r, p.y, p.z + p.r);
      for (let c = 0; c < 5; c++) {
        const angle = (c / 5) * Math.PI * 2;
        addCoin(game, scene, p.x + Math.sin(angle) * (p.r * 0.6), p.y + 1.2, p.z + Math.cos(angle) * (p.r * 0.6), c === 0);
      }
      if (idx === 1) {
        addPlasmaGeyser(game, scene, p.x, p.y, p.z, 2.2, 3.5, 0xf97316);
      }
      addJumpPad(game, scene, p.x, p.y, p.z, 22, 0xf97316);
    });

    addPatrollingAlienDrone(game, scene, new THREE.Vector3(0, 50, -226), 7.0, 0.022, 0xef4444);

    // Checkpoint 3 Inferno Spire
    const midSpire5 = new THREE.Mesh(new THREE.CylinderGeometry(9.0, 10.0, 3.5, 20), baseMat);
    midSpire5.position.set(0, 51.0, -254);
    scene.add(midSpire5);
    addBoxCollider(game, -9.0, 49.0, -263, 9.0, 53.0, -245);
    addCheckpoint(game, scene, 0, 53.0, -254, "Ateş Kanyonu Hisarı", false);
    addRotatingLaserBarrier(game, scene, 0, 53.0, -254, 12.0, 0.024, 0xef4444, true);

    // Moving Lava Barge #4 (gentle speed 0.005)
    addMovingOscillatingPlatform(
      game, scene,
      new THREE.Vector3(0, 54.5, -268),
      new THREE.Vector3(4, 57.0, -288),
      0.005, 7.0, 7.0, 0xf97316
    );

    const stepFinal5 = new THREE.Mesh(new THREE.CylinderGeometry(6.5, 7.2, 3.0, 18), lavaDiskMat);
    stepFinal5.position.set(-3, 59.0, -302);
    scene.add(stepFinal5);
    addBoxCollider(game, -9.5, 57.5, -308.5, 3.5, 60.5, -295.5);
    addJumpPad(game, scene, -3, 60.5, -302, 24, 0xf97316);

    // Grand Obsidian Fortress Gate (z: -330)
    const finalIsland = new THREE.Mesh(new THREE.CylinderGeometry(17, 19, 4, 24), baseMat);
    finalIsland.position.set(0, 62.0, -330);
    scene.add(finalIsland);
    addBoxCollider(game, -17, 60.0, -347, 17, 64.0, -313);

    for (let c = 0; c < 14; c++) {
      const angle = (c / 14) * Math.PI * 2;
      addCoin(game, scene, Math.sin(angle) * 12, 65.2, -330 + Math.cos(angle) * 12, c % 3 === 0);
    }

    currentLevelBoss = spawnSpaceLevelBoss(game, scene, {
      name: "Süpernova Güneş Lordu",
      title: "🔥 BOSS: SÜPERNOVA GÜNEŞ LORDU",
      hp: 160,
      pos: new THREE.Vector3(0, 64.0, -325),
      color: 0xef4444,
      barColor: 'linear-gradient(90deg, #dc2626, #ef4444, #f87171)',
      type: 'solar'
    });
    addExitPortal(game, scene, 0, 64.0, -330, "space_6_darklord", "Uzay 6. Bölüm: Kara Delik Kalesi & Dark Lord");
  }

  // --- LEVEL 6: KARA DELİK KALESİ & DARK LORD (BÜYÜK BOSS ARENASI) ---
  function buildSpaceLevel6(game, scene) {
    const THREE = window.THREE;
    createCosmicStarfield(scene, 0x18181b, 0x27272a, 0x7f1d1d, 0xdc2626);

    const baseMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.7, metalness: 0.4 });
    const darkCrystalMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      roughness: 0.3,
      metalness: 0.8,
      emissive: 0x450a0a,
      emissiveIntensity: 0.4
    });

    // 1. Sector 1: Fortress Arrival Base
    const arrivalBase = new THREE.Mesh(new THREE.CylinderGeometry(13, 15, 3, 24), baseMat);
    arrivalBase.position.set(0, -1.5, 0);
    scene.add(arrivalBase);
    addBoxCollider(game, -13, -3, -13, 13, 0, 13);

    // UNIQUE MECHANIC: Swirling Black Hole Vortex Disc above the arrival gate
    addBlackHoleVortexDisc(game, scene, 0, 18.0, 0, 8.0, 0xdc2626);

    createTalkingSpaceNPC(game, scene, {
      id: "astro_guard_nova",
      name: "Yıldız Muhafızı Nova",
      role: "Karanlık Savunucusu",
      avatarIcon: "🛡️‍🚀",
      suitColor: 0x475569,
      headColor: 0x0f172a,
      pos: new THREE.Vector3(0, 0, -5),
      dialogue: [
        "Dur cesur Grizzy! Kaskını sıkı tut! Kara Delik Kalesi'nin derinliklerinde DARK LORD seni bekliyor!",
        "Tepede dönen kara delik vorteksine dikkat et! Platform hızları ayarlandı, dengeni koru!",
        "Hisar köprüsünü geçmeli, dönen lazer bariyerlerini aşmalı ve taht odasına ulaşmalısın!",
        "Dark Lord'un 450 Canı var! Yere vurduğunda kırmızı şok dalgası yayar, üzerinden zıplamalısın! Sana inanıyoruz!"
      ]
    });

    // Stepping obsidian pillars
    const p1 = [
      { x: 0, y: 2.0, z: -18, r: 5.5 },
      { x: -4, y: 4.5, z: -29, r: 5.5 },
      { x: 4, y: 7.0, z: -40, r: 5.5 }
    ];

    p1.forEach((p, idx) => {
      const disk = new THREE.Mesh(new THREE.CylinderGeometry(p.r, p.r * 1.1, 2.5, 18), darkCrystalMat);
      disk.position.set(p.x, p.y - 1.25, p.z);
      scene.add(disk);
      addBoxCollider(game, p.x - p.r, p.y - 2.5, p.z - p.r, p.x + p.r, p.y, p.z + p.r);
      for (let c = 0; c < 5; c++) {
        const angle = (c / 5) * Math.PI * 2;
        addCoin(game, scene, p.x + Math.sin(angle) * (p.r * 0.6), p.y + 1.2, p.z + Math.cos(angle) * (p.r * 0.6), c === 0);
      }
      if (idx === 1) {
        addRotatingLaserBarrier(game, scene, p.x, p.y, p.z, 9.0, 0.024, 0xdc2626, false);
      }
      addJumpPad(game, scene, p.x, p.y, p.z, 22, 0xdc2626);
    });

    // Sector 2: First Slow Gliding Shadow Ferry (gentle speed 0.005)
    addMovingOscillatingPlatform(
      game, scene,
      new THREE.Vector3(-2, 8.5, -50),
      new THREE.Vector3(3, 10.5, -66),
      0.005, 7.0, 7.0, 0xdc2626
    );

    // Fortress Outpost & Checkpoint 1
    const outpost = new THREE.Mesh(new THREE.CylinderGeometry(9.0, 10.0, 3.0, 20), baseMat);
    outpost.position.set(0, 12.0, -78);
    scene.add(outpost);
    addBoxCollider(game, -9.0, 10.0, -87.0, 9.0, 13.5, -69.0);
    addCheckpoint(game, scene, 0, 13.5, -78, "Kara Hisar İleri Karakolu", false);
    addRotatingLaserBarrier(game, scene, 0, 13.5, -78, 12.0, 0.024, 0xef4444, true);

    // Sector 3: Stepping Basalt Rocks & Second Shadow Ferry
    const p2 = [
      { x: 3, y: 15.0, z: -92, r: 5.5 },
      { x: -3, y: 17.5, z: -104, r: 5.5 }
    ];
    p2.forEach(p => {
      const disk = new THREE.Mesh(new THREE.CylinderGeometry(p.r, p.r * 1.1, 2.5, 18), darkCrystalMat);
      disk.position.set(p.x, p.y - 1.25, p.z);
      scene.add(disk);
      addBoxCollider(game, p.x - p.r, p.y - 2.5, p.z - p.r, p.x + p.r, p.y, p.z + p.r);
      addJumpPad(game, scene, p.x, p.y, p.z, 22, 0xdc2626);
    });

    // Gentle speed 0.005
    addMovingOscillatingPlatform(
      game, scene,
      new THREE.Vector3(0, 19.5, -116),
      new THREE.Vector3(4, 21.5, -134),
      0.005, 7.0, 7.0, 0xdc2626
    );

    const stepGate = new THREE.Mesh(new THREE.CylinderGeometry(6.0, 6.6, 2.5, 18), darkCrystalMat);
    stepGate.position.set(-2, 23.0, -146);
    scene.add(stepGate);
    addBoxCollider(game, -8, 21.5, -152, 4, 24.5, -140);
    addJumpPad(game, scene, -2, 24.5, -146, 24, 0xdc2626);

    // Sector 4: Citadel Gates & Checkpoint 2 (Inactive initially until reached)
    const gateIsland = new THREE.Mesh(new THREE.CylinderGeometry(10, 11, 3.5, 22), baseMat);
    gateIsland.position.set(0, 26.0, -162);
    scene.add(gateIsland);
    addBoxCollider(game, -10, 24.0, -172, 10, 28.0, -152);
    addCheckpoint(game, scene, 0, 28.0, -162, "Dark Lord Taht Salonu Girişi", false);
    addJumpPad(game, scene, 0, 28.0, -160, 24, 0xdc2626);

    // Sector 5: Grand Dark Lord Arena (Centered at z = -195)
    const arenaMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      roughness: 0.8,
      metalness: 0.3
    });

    const arena = new THREE.Mesh(new THREE.CylinderGeometry(30, 32, 4, 32), arenaMat);
    arena.position.set(0, 26.0, -195);
    scene.add(arena);
    addBoxCollider(game, -30, 24.0, -225, 30, 28.0, -165);

    const rimMat = new THREE.MeshBasicMaterial({ color: 0xdc2626 });
    const rim = new THREE.Mesh(new THREE.TorusGeometry(30.2, 0.4, 16, 32), rimMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.set(0, 28.05, -195);
    scene.add(rim);

    // Gothic Pillars with Red Torches
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4 });
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const px = Math.sin(angle) * 26;
      const pz = -195 + Math.cos(angle) * 26;
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.6, 12, 12), pillarMat);
      pillar.position.set(px, 34, pz);
      scene.add(pillar);
      addBoxCollider(game, px - 1.6, 28, pz - 1.6, px + 1.6, 40, pz + 1.6);

      const torch = new THREE.PointLight(0xff002b, 2.5, 12);
      torch.position.set(px, 40.5, pz);
      scene.add(torch);
    }

    // Dark Lord Boss Entity (Centered in Grand Arena at y = 28.0)
    darkLordBoss = createDarkLordBoss(game, scene, new THREE.Vector3(0, 28.0, -200));
    showSpaceBossHp(darkLordBoss.title, darkLordBoss.hp, darkLordBoss.maxHp, 'linear-gradient(90deg, #dc2626, #ef4444, #7f1d1d)');

    // 2 Patrolling Shadow Drones in Arena
    addPatrollingAlienDrone(game, scene, new THREE.Vector3(-14, 33, -195), 7.0, 0.03, 0xff002b);
    addPatrollingAlienDrone(game, scene, new THREE.Vector3(14, 33, -195), 7.0, -0.03, 0xff002b);

    for (let c = 0; c < 18; c++) {
      const angle = (c / 18) * Math.PI * 2;
      addCoin(game, scene, Math.sin(angle) * 20, 29.2, -195 + Math.cos(angle) * 20, c % 3 === 0);
    }
  }

  // --- LEVEL 7: FINAL KOZMİK ARENA & KIRIK BOYNUZLU MOR AYI ---
  function buildSpaceLevel7(game, scene) {
    const THREE = window.THREE;
    createCosmicStarfield(scene, 0x3b0764, 0x581c87, 0xa855f7, 0xe879f9);

    const baseMat = new THREE.MeshStandardMaterial({ color: 0x3b0764, roughness: 0.6, metalness: 0.5 });
    const amethystMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x581c87,
      emissiveIntensity: 0.5
    });

    // 1. Sector 1: Starlight Arrival Gateway
    const arrivalBase = new THREE.Mesh(new THREE.CylinderGeometry(13, 15, 3, 24), baseMat);
    arrivalBase.position.set(0, -1.5, 0);
    scene.add(arrivalBase);
    addBoxCollider(game, -13, -3, -13, 13, 0, 13);

    // UNIQUE MECHANIC: Celestial Speed Boost Ring launching player onto the Bifrost Bridge
    addSpeedBoostRing(game, scene, 0, 1.8, -8, 0xe879f9);

    createTalkingSpaceNPC(game, scene, {
      id: "astro_lion_leo",
      name: "Kaptan Leo",
      role: "Kozmik İttifak Lideri",
      avatarIcon: "🦁‍🚀",
      suitColor: 0x9333ea,
      headColor: 0xfacc15,
      pos: new THREE.Vector3(0, 0, -5),
      dialogue: [
        "İşte geldik Grizzy! Kasklarımız sayesinde kozmik boşlukta nefes alabiliyoruz!",
        "Kozmik Bifrost köprüsünü geç ve efsanevi Kozmik Kolezyum'a ulaş!",
        "İlerideki tahtta tek boynuzu kırık kardeşimiz MORIS MOR AYI duruyor! Çekiciyle yerleri sarsar!",
        "Sevimli sarı kanatlı kuşumuz Badem'i arkadaki altın kafese hapsetti! Yaklaştığında kader konuşması başlayacak!"
      ]
    });

    // Stepping amethyst discs along Celestial Bifrost
    const p1 = [
      { x: 0, y: 2.0, z: -18, r: 5.5 },
      { x: 4, y: 4.5, z: -29, r: 5.5 },
      { x: -4, y: 7.0, z: -40, r: 5.5 }
    ];

    p1.forEach((p, idx) => {
      const disk = new THREE.Mesh(new THREE.CylinderGeometry(p.r, p.r * 1.1, 2.5, 18), amethystMat);
      disk.position.set(p.x, p.y - 1.25, p.z);
      scene.add(disk);
      addBoxCollider(game, p.x - p.r, p.y - 2.5, p.z - p.r, p.x + p.r, p.y, p.z + p.r);
      for (let c = 0; c < 5; c++) {
        const angle = (c / 5) * Math.PI * 2;
        addCoin(game, scene, p.x + Math.sin(angle) * (p.r * 0.6), p.y + 1.2, p.z + Math.cos(angle) * (p.r * 0.6), c === 0);
      }
      if (idx === 1) {
        addRotatingLaserBarrier(game, scene, p.x, p.y, p.z, 9.0, 0.024, 0xa855f7, false);
      }
      addJumpPad(game, scene, p.x, p.y, p.z, 22, 0xa855f7);
    });

    // Sector 2: Slow Astral Ferry #1 (gentle speed 0.005)
    addMovingOscillatingPlatform(
      game, scene,
      new THREE.Vector3(2, 8.5, -50),
      new THREE.Vector3(-3, 10.5, -66),
      0.005, 7.0, 7.0, 0xec4899
    );

    // Altar of Awakening & Checkpoint 1
    const altar = new THREE.Mesh(new THREE.CylinderGeometry(9.0, 10.0, 3.0, 20), baseMat);
    altar.position.set(0, 12.0, -78);
    scene.add(altar);
    addBoxCollider(game, -9.0, 10.0, -87.0, 9.0, 13.5, -69.0);
    addCheckpoint(game, scene, 0, 13.5, -78, "Yıldız Altarı İstasyonu", false);
    addRotatingLaserBarrier(game, scene, 0, 13.5, -78, 12.0, 0.024, 0xa855f7, true);

    // Sector 3: Stepping Amethyst Discs & Slow Astral Ferry #2
    const p2 = [
      { x: -3, y: 15.0, z: -92, r: 5.5 },
      { x: 3, y: 17.5, z: -104, r: 5.5 }
    ];
    p2.forEach(p => {
      const disk = new THREE.Mesh(new THREE.CylinderGeometry(p.r, p.r * 1.1, 2.5, 18), amethystMat);
      disk.position.set(p.x, p.y - 1.25, p.z);
      scene.add(disk);
      addBoxCollider(game, p.x - p.r, p.y - 2.5, p.z - p.r, p.x + p.r, p.y, p.z + p.r);
      addJumpPad(game, scene, p.x, p.y, p.z, 22, 0xa855f7);
    });

    // Gentle speed 0.005
    addMovingOscillatingPlatform(
      game, scene,
      new THREE.Vector3(0, 19.5, -116),
      new THREE.Vector3(-4, 21.5, -134),
      0.005, 7.0, 7.0, 0xec4899
    );

    const stepColosseum = new THREE.Mesh(new THREE.CylinderGeometry(6.0, 6.6, 2.5, 18), amethystMat);
    stepColosseum.position.set(2, 23.0, -146);
    scene.add(stepColosseum);
    addBoxCollider(game, -4, 21.5, -152, 8, 24.5, -140);
    addJumpPad(game, scene, 2, 24.5, -146, 24, 0xa855f7);

    // Sector 4: Colosseum Gates & Checkpoint 2 (Inactive initially until reached)
    const colosseumGate = new THREE.Mesh(new THREE.CylinderGeometry(10, 11, 3.5, 22), baseMat);
    colosseumGate.position.set(0, 26.0, -162);
    scene.add(colosseumGate);
    addBoxCollider(game, -10, 24.0, -172, 10, 28.0, -152);
    addCheckpoint(game, scene, 0, 28.0, -162, "Kozmik Kolezyum Kapısı", false);
    addJumpPad(game, scene, 0, 28.0, -160, 24, 0xec4899);

    // Sector 5: Grand Final Colosseum (Centered at z = -200)
    const colosseumMat = new THREE.MeshStandardMaterial({
      color: 0x2e1065,
      roughness: 0.4,
      metalness: 0.6
    });

    const arena = new THREE.Mesh(new THREE.CylinderGeometry(36, 40, 4, 36), colosseumMat);
    arena.position.set(0, 26.0, -200);
    scene.add(arena);
    addBoxCollider(game, -36, 24.0, -236, 36, 28.0, -164);

    const goldRing = new THREE.Mesh(
      new THREE.TorusGeometry(36.2, 0.45, 16, 36),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9, roughness: 0.2 })
    );
    goldRing.rotation.x = Math.PI / 2;
    goldRing.position.set(0, 28.05, -200);
    scene.add(goldRing);

    // Colosseum Pillars
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const px = Math.sin(angle) * 32;
      const pz = -200 + Math.cos(angle) * 32;
      const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(1.4, 1.8, 14, 14),
        new THREE.MeshStandardMaterial({ color: 0x581c87, metalness: 0.8 })
      );
      pillar.position.set(px, 35, pz);
      scene.add(pillar);
      addBoxCollider(game, px - 1.8, 28, pz - 1.8, px + 1.8, 42, pz + 1.8);
    }

    // Mor Ayı Final Boss (600 HP, Centered at y = 28.0, z = -205)
    morAyiBoss = createMorAyiBoss(game, scene, new THREE.Vector3(0, 28.0, -205));
    showSpaceBossHp(morAyiBoss.title, morAyiBoss.hp, morAyiBoss.maxHp);

    // Badem's Prison Cage at z = -228, y = 28.0
    createCageAndBadem(game, scene, new THREE.Vector3(0, 28.0, -228));

    for (let c = 0; c < 24; c++) {
      const angle = (c / 24) * Math.PI * 2;
      addCoin(game, scene, Math.sin(angle) * 24, 29.2, -200 + Math.cos(angle) * 24, c % 2 === 0);
    }
  }

  // --- CLEANUP SPACE REALM ---
  function cleanUpSpaceRealm(game) {
    if (!game) game = window.__superBearGame;
    if (!game || !game.scene) return;

    hideSpaceBossHp();

    if (spaceSceneGroup) {
      if (spaceSceneGroup.parent) {
        spaceSceneGroup.parent.remove(spaceSceneGroup);
      }
      spaceSceneGroup = null;
    }

    const starfield = game.scene.getObjectByName("cosmic_starfield_system");
    if (starfield && starfield.parent) {
      starfield.parent.remove(starfield);
    }

    animatedObjects.length = 0;
    spaceHazards.length = 0;
    spaceShockwaves.length = 0;
    speedBoostRings.length = 0;
    rotatingGears.length = 0;
    solarFlares.length = 0;
    blackHoleVortex = null;
    spaceCameraShake = 0;

    morAyiBoss = null;
    darkLordBoss = null;
    goldenKeyMesh = null;
    isKeyCollected = false;
    cageMesh = null;
    cageDoorMesh = null;
    bademBirdMesh = null;
    isBademRescued = false;
    isSpaceDialogueActive = false;
    spaceDialogueStep = 0;
  }

  // --- UNIVERSAL SPACE LEVEL LOADER ---
  function loadSpaceLevel(rawLevelId) {
    console.log("🌌 [Zorlu Uzay Seviyesi] Yükleniyor: " + rawLevelId);
    const game = window.__superBearGame;
    if (!game || !game.scene) {
      console.warn("⚠️ Game scene not ready yet, deferring loadSpaceLevel...");
      setTimeout(() => loadSpaceLevel(rawLevelId), 300);
      return;
    }

    // 1. Deep universal purge of previous scene to prevent any merging!
    if (typeof window.__superBearPurgeScene === 'function') {
      window.__superBearPurgeScene(game);
    } else {
      cleanUpSpaceRealm(game);
    }

    currentSpaceLevelId = rawLevelId;
    const THREE = window.THREE;
    spaceSceneGroup = new THREE.Group();
    spaceSceneGroup.name = "space_realm_container_" + rawLevelId;
    game.scene.add(spaceSceneGroup);

    game.currentRegion = rawLevelId;
    game.currentLevel = {
      regionId: rawLevelId,
      sceneGroup: spaceSceneGroup,
      spawnPoint: new THREE.Vector3(0, 1.5, 3),
      colliders: [],
      jumpPads: [],
      collectibles: [],
      checkpoints: [],
      enemies: [],
      npcs: [],
      movingPlatforms: [],
      lighting: {
        ambientColor: 0x93c5fd,
        sunColor: 0x60a5fa,
        fogColor: 0x38bdf8,
        skyColor: 0x0284c7
      }
    };

    if (game.scene) {
      game.scene.background = new THREE.Color(0x0284c7);
      game.scene.fog = new THREE.FogExp2(0x38bdf8, 0.001);
    }

    if (game.playerPos) {
      game.playerPos.set(0, 1.5, 3);
    }
    if (game.playerVel) {
      game.playerVel.set(0, 0, 0);
    }

    // Build specific space level
    const mapped = SPACE_LEVEL_MAP[rawLevelId] || rawLevelId;
    switch(mapped) {
      case 'space_level_1':
        buildSpaceLevel1(game, spaceSceneGroup);
        break;
      case 'space_level_2':
        buildSpaceLevel2(game, spaceSceneGroup);
        break;
      case 'space_level_3':
        buildSpaceLevel3(game, spaceSceneGroup);
        break;
      case 'space_level_4':
        buildSpaceLevel4(game, spaceSceneGroup);
        break;
      case 'space_level_5':
        buildSpaceLevel5(game, spaceSceneGroup);
        break;
      case 'space_level_6':
        buildSpaceLevel6(game, spaceSceneGroup);
        break;
      case 'space_level_7':
        buildSpaceLevel7(game, spaceSceneGroup);
        break;
      default:
        buildSpaceLevel1(game, spaceSceneGroup);
        break;
    }

    if (game.callbacks && game.callbacks.onRegionChange) {
      game.callbacks.onRegionChange(rawLevelId);
    }

    window.dispatchEvent(new CustomEvent('superbear:space-level-changed', {
      detail: { levelId: rawLevelId }
    }));
  }

  // --- TICK LOOP FOR SPACE HAZARDS, PLATFORMS & BOSS AI ---
  function updateSpaceLevelsLoop() {
    requestAnimationFrame(updateSpaceLevelsLoop);

    const game = window.__superBearGame;
    if (!game || !game.playerPos) return;
    const pPos = game.playerPos;

    // Decrement iframe timer
    if (damageIframeTimer > 0) {
      damageIframeTimer -= 0.016;
    }

    // 1. VOID FALL CHECK (HIGH STAKES: FALLING OFF PLATFORMS DEALS DAMAGE)
    if (SPACE_LEVEL_MAP[game.currentRegion]) {
      if (pPos.y < -25.0) {
        damagePlayer(game, 25);
        respawnPlayerAtCheckpoint(game, "🌌 Kozmik boşluğa düştün! Kontrol noktasına ışınlandın.");
      }
    }

    // 1b. DYNAMIC CHECKPOINT ACTIVATION (Only activates when player touches it!)
    if (game.currentLevel && game.currentLevel.checkpoints && Array.isArray(game.currentLevel.checkpoints)) {
      ((game.currentLevel && game.currentLevel.checkpoints) || []).forEach(cp => {
        if (!cp || !cp.pos) return;
        const cpMesh = cp.mesh || cp.meshGroup;
        if (cpMesh && cpMesh.userData) {
          if (cpMesh.userData.orb) cpMesh.userData.orb.rotation.y += 0.03;
          if (cp.active && cpMesh.userData.banner) {
            cpMesh.userData.banner.rotation.y = Math.sin(Date.now() * 0.006) * 0.15;
          }
        }
        const dHoriz = Math.hypot(pPos.x - cp.pos.x, pPos.z - cp.pos.z);
        const dVert = Math.abs(pPos.y - cp.pos.y);
        const isNearby = (dHoriz < 4.2 && dVert < 4.5) || pPos.distanceTo(cp.pos) < 4.5;
        if (!cp.active && isNearby) {
          ((game.currentLevel && game.currentLevel.checkpoints) || []).forEach(other => {
            other.active = false;
            const oMesh = other.mesh || other.meshGroup;
            if (oMesh) {
              oMesh.traverse(child => {
                if (child.isMesh && (child.name === 'flag_mesh' || (child.userData && child.userData.isBanner) || (oMesh.userData && oMesh.userData.banner === child))) {
                  if (child.material) {
                    if (child.material.color) child.material.color.setHex(0xef4444);
                    if (child.material.emissive) child.material.emissive.setHex(0xb91c1c);
                  }
                }
              });
              if (oMesh.userData) {
                if (oMesh.userData.banner && oMesh.userData.banner.material) {
                  if (oMesh.userData.banner.material.color) oMesh.userData.banner.material.color.setHex(0xef4444);
                  if (oMesh.userData.banner.material.emissive) oMesh.userData.banner.material.emissive.setHex(0xb91c1c);
                }
                if (oMesh.userData.orb && oMesh.userData.orb.material && oMesh.userData.orb.material.color) {
                  oMesh.userData.orb.material.color.setHex(0xfacc15);
                }
                if (oMesh.userData.ring && oMesh.userData.ring.material && oMesh.userData.ring.material.color) {
                  oMesh.userData.ring.material.color.setHex(0xfacc15);
                }
                if (oMesh.userData.light && oMesh.userData.light.color) {
                  oMesh.userData.light.color.setHex(0xef4444);
                }
              }
            }
          });
          cp.active = true;
          if (game.currentLevel.spawnPoint) game.currentLevel.spawnPoint.copy(cp.pos);
          if (cpMesh) {
            cpMesh.traverse(child => {
              if (child.isMesh && (child.name === 'flag_mesh' || (child.userData && child.userData.isBanner) || (cpMesh.userData && cpMesh.userData.banner === child))) {
                if (child.material) {
                  if (child.material.color) child.material.color.setHex(0x22c55e);
                  if (child.material.emissive) child.material.emissive.setHex(0x16a34a);
                }
              }
            });
            if (cpMesh.userData) {
              if (cpMesh.userData.banner && cpMesh.userData.banner.material) {
                if (cpMesh.userData.banner.material.color) cpMesh.userData.banner.material.color.setHex(0x22c55e);
                if (cpMesh.userData.banner.material.emissive) cpMesh.userData.banner.material.emissive.setHex(0x16a34a);
              }
              if (cpMesh.userData.orb && cpMesh.userData.orb.material && cpMesh.userData.orb.material.color) {
                cpMesh.userData.orb.material.color.setHex(0x4ade80);
              }
              if (cpMesh.userData.ring && cpMesh.userData.ring.material && cpMesh.userData.ring.material.color) {
                cpMesh.userData.ring.material.color.setHex(0x22c55e);
              }
              if (cpMesh.userData.light && cpMesh.userData.light.color) {
                cpMesh.userData.light.color.setHex(0x22c55e);
              }
            }
          }
          if (game.spawnSparkleParticles) game.spawnSparkleParticles(cp.pos, 35, 0x22c55e);
          if (typeof St !== "undefined" && St.playHoneyGem) St.playHoneyGem();
          if (game.callbacks && game.callbacks.onShowNotice) {
            game.callbacks.onShowNotice(`🚩 KONTROL NOKTASI AKTİF: ${cp.name}`, "success");
          }
        }
      });
    }

    // 2. UPDATE ANIMATED OBJECTS & MOVING PLATFORMS
    for (let i = 0; i < animatedObjects.length; i++) {
      if (animatedObjects[i] && animatedObjects[i].update) {
        animatedObjects[i].update();
      }
    }

    // 3. UPDATE SPACE HAZARDS (LASERS, DRONES, GEYSERS, TRAMPOLINES)
    for (let i = 0; i < spaceHazards.length; i++) {
      const h = spaceHazards[i];
      if (h && h.update) {
        h.update();
      }
      if (h && h.type === 'trampoline') {
        const dTram = Math.sqrt((pPos.x - h.x) * (pPos.x - h.x) + (pPos.z - h.z) * (pPos.z - h.z));
        if (dTram < h.radius && pPos.y >= h.y - 1.0 && pPos.y <= h.y + 2.5) {
          game.playerVel.y = h.bounce || 1.35;
          if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos, 16, 0x38bdf8);
          if (game.callbacks && game.callbacks.onShowNotice && Date.now() % 2000 < 50) {
            game.callbacks.onShowNotice("🍄 KRİSTAL TRAMBOLİN! Yükseğe Fırlatıldın!", "success");
          }
        }
      }
    }

    // 3b. SPEED BOOST RINGS (LEVEL 1)
    speedBoostRings.forEach(ring => {
      if (ring.cooldown > 0) ring.cooldown -= 0.016;
      const dRing = Math.sqrt((pPos.x - ring.x) ** 2 + (pPos.y - ring.y) ** 2 + (pPos.z - ring.z) ** 2);
      if (dRing < ring.radius && ring.cooldown <= 0) {
        ring.cooldown = 1.2;
        game.playerVel.z -= 0.52;
        game.playerVel.y = 0.28;
        if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos, 16, 0x38bdf8);
        if (game.callbacks && game.callbacks.onShowNotice) {
          game.callbacks.onShowNotice("🚀 HIZLANDIRICI HALKA AKTİF! İleri Fırlatıldın!", "success");
        }
      }
    });

    // 3c. SOLAR FLARES (LEVEL 5)
    solarFlares.forEach(flare => {
      flare.phase += 0.045;
      const s = Math.sin(flare.phase);
      if (s > 0.5) {
        flare.mesh.scale.set(1.0, (s - 0.5) * 2.5, 1.0);
        flare.mesh.visible = true;
        const dFlare = Math.sqrt((pPos.x - flare.x) ** 2 + (pPos.z - flare.z) ** 2);
        if (dFlare < 3.2 && pPos.y >= flare.y && pPos.y <= flare.y + flare.height) {
          const knock = new THREE.Vector3(pPos.x - flare.x, 2.5, pPos.z - flare.z).normalize();
          damagePlayer(game, 25, knock);
        }
      } else {
        flare.mesh.scale.set(0.1, 0.1, 0.1);
        flare.mesh.visible = false;
      }
    });

    // 3d. BLACK HOLE VORTEX GRAVITATIONAL PULL (LEVEL 6)
    if (blackHoleVortex) {
      const dV = Math.sqrt((pPos.x - blackHoleVortex.x) ** 2 + (pPos.z - blackHoleVortex.z) ** 2);
      if (dV < blackHoleVortex.radius && pPos.y < blackHoleVortex.y + 16.0) {
        const pullDir = new THREE.Vector3(blackHoleVortex.x - pPos.x, 0, blackHoleVortex.z - pPos.z).normalize();
        pPos.x += pullDir.x * 0.045;
        pPos.z += pullDir.z * 0.045;
      }
    }

        // UNIVERSAL SPACE LEVEL BOSS (LEVELS 1-5)
    if (currentLevelBoss && !currentLevelBoss.isDead) {
      const bMesh = currentLevelBoss.mesh;
      const dist = pPos.distanceTo(bMesh.position);

      if (dist < 34.0) {
        showSpaceBossHp(currentLevelBoss.title, currentLevelBoss.hp, currentLevelBoss.maxHp, currentLevelBoss.barColor);
      }

      bMesh.rotation.y = Math.atan2(pPos.x - bMesh.position.x, pPos.z - bMesh.position.z);

      if (dist < 28.0 && dist > 3.6) {
        const dir = pPos.clone().sub(bMesh.position).normalize();
        bMesh.position.x += dir.x * 0.09;
        bMesh.position.z += dir.z * 0.09;
      }

      currentLevelBoss.attackTimer = (currentLevelBoss.attackTimer || 0) + 0.016;
      if (currentLevelBoss.attackTimer > 3.2 && dist < 24.0) {
        currentLevelBoss.attackTimer = 0;
        spawnSpaceShockwave(spaceSceneGroup || scene, bMesh.position, currentLevelBoss.color);
        if (game.callbacks && game.callbacks.onShowNotice) {
          game.callbacks.onShowNotice(`⚠️ ${currentLevelBoss.title} Şok Dalgası Yaydı! ZIPLA!`, "warn");
        }
      }

      if (dist < 3.4) {
        const knock = pPos.clone().sub(bMesh.position).normalize();
        damagePlayer(game, 22, knock);
      }

      currentLevelBoss.hitCooldown = (currentLevelBoss.hitCooldown || 0) - 0.016;
      if (game.isAttacking && dist < 5.6 && currentLevelBoss.hitCooldown <= 0) {
        currentLevelBoss.hitCooldown = 0.32;
        currentLevelBoss.hp -= 15;
        showSpaceBossHp(currentLevelBoss.title, currentLevelBoss.hp, currentLevelBoss.maxHp, currentLevelBoss.barColor);
        if (game.spawnSparkleParticles) game.spawnSparkleParticles(bMesh.position, 14, currentLevelBoss.color);

        if (currentLevelBoss.hp <= 0) {
          currentLevelBoss.isDead = true;
          bMesh.visible = false;
          hideSpaceBossHp();
          if (game.spawnSparkleParticles) {
            for (let i = 0; i < 24; i++) {
              game.spawnSparkleParticles(bMesh.position, 10, 0xfacc15);
            }
          }
          if (game.callbacks && game.callbacks.onShowNotice) {
            game.callbacks.onShowNotice(`🎉 ${currentLevelBoss.title} MAĞLUP EDİLDİ! Portal Açıldı!`, "success");
          }
        }
      }
    }

    // 4. LEVEL 6 DARK LORD BOSS AI & EXPANDING SHOCKWAVE ATTACK
    if ((currentSpaceLevelId === 'space_6_darklord' || currentSpaceLevelId === 'space_6_dark_lord' || currentSpaceLevelId === 'space_level_6') && darkLordBoss && !darkLordBoss.isDead) {
      const bMesh = darkLordBoss.mesh;
      const dist = pPos.distanceTo(bMesh.position);
      bMesh.rotation.y = Math.atan2(pPos.x - bMesh.position.x, pPos.z - bMesh.position.z);

      // Boss Movement
      if (dist < 26.0 && dist > 3.8) {
        const dir = pPos.clone().sub(bMesh.position).normalize();
        bMesh.position.x += dir.x * 0.12;
        bMesh.position.z += dir.z * 0.12;
      }

      // Shockwave ring attack timer
      darkLordBoss.shockwaveTimer += 0.016;
      if (darkLordBoss.shockwaveTimer > 3.8 && dist < 25.0) {
        darkLordBoss.shockwaveTimer = 0;
        if (game.callbacks && game.callbacks.onShowNotice) {
          game.callbacks.onShowNotice("⚠️ Dark Lord Zemin Şok Dalgası Yaydı! ZIPLA!", "warn");
        }
        // If player is on the ground within 20m, takes damage!
        if (dist < 20.0 && pPos.y < (bMesh.position.y + 1.5)) {
          const knock = pPos.clone().sub(bMesh.position).normalize();
          damagePlayer(game, 26, knock);
        }
      }

      // Close combat hit on player
      if (dist < 3.8) {
        const knock = pPos.clone().sub(bMesh.position).normalize();
        damagePlayer(game, 24, knock);
      }

      // Player attacks Dark Lord (Bölüm 21 - takes 5 HP per hit smoothly)
      darkLordBoss.hitCooldown = (darkLordBoss.hitCooldown || 0) - 0.016;
      if (game.isAttacking && dist < 5.2 && darkLordBoss.hitCooldown <= 0) {
        darkLordBoss.hitCooldown = 0.32;
        darkLordBoss.hp -= 5;
        showSpaceBossHp(darkLordBoss.title, darkLordBoss.hp, darkLordBoss.maxHp, 'linear-gradient(90deg, #dc2626, #ef4444, #7f1d1d)');
        if (game.spawnSparkleParticles) game.spawnSparkleParticles(bMesh.position, 16, 0xff002b);

        if (darkLordBoss.hp <= 0) {
          darkLordBoss.isDead = true;
          bMesh.visible = false;
          hideSpaceBossHp();
          addExitPortal(game, spaceSceneGroup, 0, bMesh.position.y, bMesh.position.z - 15, "space_7_mor_ayi", "Uzay 7. Bölüm: Final Kozmik Arena & Mor Ayı");
          if (game.callbacks && game.callbacks.onShowNotice) {
            game.callbacks.onShowNotice("🎉 DARK LORD MAĞLUP EDİLDİ! Final 7. Bölüm Portalı Açıldı!", "success");
          }
        }
      }
    }

    // CAMERA SHAKE & GROUND SHOCKWAVE PROCESSING
    if (spaceCameraShake > 0) {
      spaceCameraShake -= 0.035;
      if (game.camera) {
        game.camera.position.x += (Math.random() - 0.5) * 1.6 * spaceCameraShake;
        game.camera.position.y += (Math.random() - 0.5) * 1.3 * spaceCameraShake;
      }
    }

    // Process active expanding shockwaves
    for (let i = spaceShockwaves.length - 1; i >= 0; i--) {
      const sw = spaceShockwaves[i];
      sw.radius += sw.speed;
      sw.mesh.scale.set(sw.radius, sw.radius, 1);
      sw.mesh.material.opacity = Math.max(0, 1 - (sw.radius / sw.maxRadius));

      // Player collision with shockwave on ground
      const dSw = Math.sqrt((pPos.x - sw.x) * (pPos.x - sw.x) + (pPos.z - sw.z) * (pPos.z - sw.z));
      if (Math.abs(dSw - sw.radius) < 2.4 && pPos.y < (sw.y + 1.8)) {
        const knock = new THREE.Vector3(pPos.x - sw.x, 3.8, pPos.z - sw.z).normalize();
        damagePlayer(game, 28, knock);
        if (game.callbacks && game.callbacks.onShowNotice && Date.now() % 1800 < 50) {
          game.callbacks.onShowNotice("💥 YER SARSINTISI ŞOK DALGASINA YAKALANDIN! ZIPLA!", "error");
        }
      }

      if (sw.radius >= sw.maxRadius) {
        if (sw.mesh.parent) sw.mesh.parent.remove(sw.mesh);
        spaceShockwaves.splice(i, 1);
      }
    }

    // 5. LEVEL 7 MOR AYI / MORİS FINAL BOSS AI & DYNAMIC ACTIVE COMBAT
    if (morAyiBoss && !morAyiBoss.isDead) {
      const distToMorAyi = pPos.distanceTo(morAyiBoss.mesh.position);
      const bMesh = morAyiBoss.mesh;

      // Moris stays in place during dialogue wait and breathes menacingly
      if (morAyiBoss.state === 'dialogue_wait') {
        bMesh.rotation.y = Math.atan2(pPos.x - bMesh.position.x, pPos.z - bMesh.position.z);
        morAyiBoss.idleTimer = (morAyiBoss.idleTimer || 0) + 0.035;
        const it = morAyiBoss.idleTimer;
        if (morAyiBoss.body) morAyiBoss.body.position.y = 2.0 + Math.sin(it) * 0.08;
        if (morAyiBoss.head) morAyiBoss.head.position.y = 3.85 + Math.sin(it) * 0.05;
        if (morAyiBoss.hammerGroup) morAyiBoss.hammerGroup.rotation.z = Math.sin(it) * 0.06;

        // Player approaches into the arena: trigger dialogue sequence
        if ((pPos.z < -180 || distToMorAyi < 24.0) && spaceDialogueStep === 0 && !isSpaceDialogueActive) {
          triggerMorAyiDialogueSequence();
        }

        // If player attacks Moris during waiting, wake him immediately
        if (game.isAttacking && distToMorAyi < 6.0) {
          morAyiBoss.state = 'active';
          isSpaceDialogueActive = false;
          window.dispatchEvent(new CustomEvent('superbear:space-dialogue', { detail: { isOpen: false } }));
        }
      }

      if (morAyiBoss.state === 'active') {
        bMesh.rotation.y = Math.atan2(pPos.x - bMesh.position.x, pPos.z - bMesh.position.z);

        const isEnraged = morAyiBoss.hp < (morAyiBoss.maxHp * 0.5);
        const baseSpeed = isEnraged ? 0.19 : 0.13;

        // DYNAMIC RUNNING & WALKING ANIMATION
        morAyiBoss.walkTimer = (morAyiBoss.walkTimer || 0) + (isEnraged ? 0.22 : 0.16);
        const wt = morAyiBoss.walkTimer;

        if (morAyiBoss.leftFoot && morAyiBoss.rightFoot) {
          morAyiBoss.leftFoot.position.z = Math.sin(wt) * 0.75;
          morAyiBoss.rightFoot.position.z = -Math.sin(wt) * 0.75;
        }
        if (morAyiBoss.body && morAyiBoss.head) {
          morAyiBoss.body.position.y = 2.0 + Math.abs(Math.sin(wt * 2)) * 0.3;
          morAyiBoss.head.position.y = 3.85 + Math.abs(Math.sin(wt * 2)) * 0.18;
        }

        // Active Pursuit Movement towards player
        if (distToMorAyi > 4.2 && (!morAyiBoss.isLeaping)) {
          const dir = pPos.clone().sub(bMesh.position).normalize();
          bMesh.position.x += dir.x * baseSpeed;
          bMesh.position.z += dir.z * baseSpeed;

          if (morAyiBoss.leftPaw && morAyiBoss.slamWindup <= 0) {
            morAyiBoss.leftPaw.position.z = -Math.sin(wt) * 0.45;
          }
        }

        // Gravitational vortex pull in enraged mode
        if (isEnraged && distToMorAyi < 26.0) {
          const pullDir = bMesh.position.clone().sub(pPos).normalize();
          pPos.x += pullDir.x * 0.05;
          pPos.z += pullDir.z * 0.05;
        }

        // LEAP ATTACK (Every 7 seconds Moris leaps into the air and crashes down)
        morAyiBoss.leapCooldown = (morAyiBoss.leapCooldown || 7.0) - 0.016;
        if (morAyiBoss.leapCooldown <= 0 && distToMorAyi > 9.0 && pPos.z < -165 && !morAyiBoss.isLeaping) {
          morAyiBoss.isLeaping = true;
          morAyiBoss.leapTime = 0;
          morAyiBoss.leapStart = bMesh.position.clone();
          morAyiBoss.leapTarget = new THREE.Vector3(pPos.x, 28.0, pPos.z);
          morAyiBoss.leapCooldown = isEnraged ? 5.5 : 8.0;
          if (game.callbacks && game.callbacks.onShowNotice) {
            game.callbacks.onShowNotice("☄️ MORİS HAVAYA SIÇRADI! KAÇ!", "warn");
          }
        }

        if (morAyiBoss.isLeaping) {
          morAyiBoss.leapTime += 0.035;
          const t = Math.min(1.0, morAyiBoss.leapTime);
          bMesh.position.x = THREE.MathUtils.lerp(morAyiBoss.leapStart.x, morAyiBoss.leapTarget.x, t);
          bMesh.position.z = THREE.MathUtils.lerp(morAyiBoss.leapStart.z, morAyiBoss.leapTarget.z, t);
          bMesh.position.y = 28.0 + Math.sin(t * Math.PI) * 11.0;

          if (t >= 1.0) {
            morAyiBoss.isLeaping = false;
            bMesh.position.y = 28.0;
            // Impact! Shake ground & spawn shockwave
            spaceCameraShake = 1.9;
            spawnGroundShockwave(spaceSceneGroup, bMesh.position, 0xf43f5e);
            if (distToMorAyi < 12.0 && pPos.y < 30.0) {
              damagePlayer(game, 32, pPos.clone().sub(bMesh.position).normalize());
            }
          }
        }

        // HAMMER SLAM ATTACK (WITH WIND-UP, VIOLENT SCREEN SHAKE & EXPANDING 3D SHOCKWAVE)
        morAyiBoss.slamCooldown -= 0.016;

        // Wind-up: Lift hammer high over head
        if (morAyiBoss.slamCooldown < 0.75 && morAyiBoss.slamCooldown > 0 && !morAyiBoss.isLeaping) {
          if (morAyiBoss.hammerGroup) {
            morAyiBoss.hammerGroup.rotation.x = -Math.PI / 1.5;
            morAyiBoss.hammerGroup.rotation.z = -0.3;
          }
          if (game.spawnSparkleParticles && Math.random() < 0.4) {
            game.spawnSparkleParticles(bMesh.position, 4, 0xec4899);
          }
        }

        // Impact Slam!
        if (morAyiBoss.slamCooldown <= 0) {
          morAyiBoss.slamCooldown = isEnraged ? 2.6 : 3.8;
          if (morAyiBoss.hammerGroup) {
            morAyiBoss.hammerGroup.rotation.x = Math.PI / 3;
            morAyiBoss.hammerGroup.rotation.z = 0;
          }

          // 1. VIOLENT CAMERA SHAKE (YERİ SARSMA)
          spaceCameraShake = 1.7;

          // 2. EXPANDING 3D SHOCKWAVE RING ON FLOOR
          spawnGroundShockwave(spaceSceneGroup, new THREE.Vector3(bMesh.position.x, 28.0, bMesh.position.z), 0xec4899);

          if (game.callbacks && game.callbacks.onShowNotice) {
            game.callbacks.onShowNotice("🔨 MORİS ÇEKİÇLE YERİ SARSTI! ZIPLA VE ŞOK DALGASINDAN KAÇ!", "error");
          }

          // Direct hammer impact area
          if (distToMorAyi < 24.0 && pPos.y < 30.0) {
            const knock = pPos.clone().sub(bMesh.position).normalize();
            damagePlayer(game, 30, knock);
          }
        }

        // Melee contact damage
        if (distToMorAyi < 4.2) {
          const knock = pPos.clone().sub(bMesh.position).normalize();
          damagePlayer(game, 25, knock);
        }

        // Player attacks Mor Ayı (Bölüm 22 - takes 5 HP per hit smoothly)
        morAyiBoss.hitCooldown = (morAyiBoss.hitCooldown || 0) - 0.016;
        if (game.isAttacking && distToMorAyi < 6.0 && morAyiBoss.hitCooldown <= 0) {
          morAyiBoss.hitCooldown = 0.32;
          morAyiBoss.hp -= 5;
          showSpaceBossHp(morAyiBoss.title, morAyiBoss.hp, morAyiBoss.maxHp);
          if (game.spawnSparkleParticles) game.spawnSparkleParticles(bMesh.position, 18, 0xec4899);

          if (morAyiBoss.hp <= 0) {
            morAyiBoss.isDead = true;
            bMesh.visible = false;
            hideSpaceBossHp();
            spawnGoldenKey(spaceSceneGroup, bMesh.position);
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("🏆 MORİS YENİLDİ! Altın Anahtar Düştü, Badem'i Kurtar!", "success");
            }
          }
        }
      }
    }

    // 6. Collect Golden Key
    if (goldenKeyMesh && !isKeyCollected) {
      goldenKeyMesh.rotation.y += 0.04;
      if (pPos.distanceTo(goldenKeyMesh.position) < 3.5) {
        isKeyCollected = true;
        goldenKeyMesh.visible = false;
        window.dispatchEvent(new CustomEvent('superbear:key-dropped'));
        if (game.callbacks && game.callbacks.onShowNotice) {
          game.callbacks.onShowNotice("🗝️ Altın Kafes Anahtarı Alındı! Kafese yaklaş ve B'ye bas!", "success");
        }
      }
    }

    // 7. Near Cage Check
    if (cageMesh) {
      const distToCage = pPos.distanceTo(cageMesh.position);
      window.dispatchEvent(new CustomEvent('superbear:near-cage', {
        detail: { isNear: distToCage < 8.0 }
      }));
    }

    // 8. Rescued Badem Fly Animation
    if (isBademRescued && bademBirdMesh) {
      const time = Date.now() * 0.005;
      bademBirdMesh.position.set(
        pPos.x + Math.sin(time) * 3.5,
        pPos.y + 3.8 + Math.cos(time * 2) * 0.6,
        pPos.z + Math.cos(time) * 3.5
      );
      bademBirdMesh.rotation.y = time + Math.PI / 2;
    }
  }

  // --- ATTACH GLOBAL HELPERS ---
  window.__superBearSpaceLevels = {
    loadSpaceLevel,
    cleanUpSpaceRealm,
    getSpaceSceneGroup: () => spaceSceneGroup,
    advanceSpaceDialogue,
    tryUnlockCage,
    SPACE_LEVEL_MAP,
    SPACE_LEVEL_IDS
  };

  window.addEventListener('superbear:load-space-level', (e) => {
    const detail = e.detail;
    if (detail && detail.levelId) {
      loadSpaceLevel(detail.levelId);
    }
  });

  requestAnimationFrame(updateSpaceLevelsLoop);

  // Hook into game.loadRegion
  function hookIntoGame() {
    const game = window.__superBearGame;
    if (game) {
      game.advanceSpaceDialogue = advanceSpaceDialogue;
      game.tryUnlockCage = tryUnlockCage;

      const originalLoad = game.loadRegion;
      game.loadRegion = function(regionId) {
        if (SPACE_LEVEL_MAP[regionId]) {
          loadSpaceLevel(regionId);
          return;
        }
        // When going back to Earth level (hub, dino_world, etc.), clean up space realm
        cleanUpSpaceRealm(game);
        if (originalLoad) {
          return originalLoad.call(this, regionId);
        }
      };
    } else {
      setTimeout(hookIntoGame, 200);
    }
  }
  hookIntoGame();

})();
