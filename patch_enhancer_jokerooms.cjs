const fs = require("fs");

let enhancer = fs.readFileSync("public/game-enhancer.js", "utf8");

// Prepare the comprehensive Jokerooms implementation
const jokeroomsCode = `
// ============================================================================
// 12. BÖLÜM: JOKEROOMS (ŞAKA ODALARI) - SONSUZ SARI KORİDORLAR LABİRENTİ
// ============================================================================
let jokeroomsPopulated = false;
let jokeroomsActiveChunks = new Map(); // key: "cx,cz", value: chunkGroup
let jokeroomsLastChunk = { cx: 999999, cz: 999999 };
let jokeroomsSteps = 0;
let jokeroomsLastPos = null;
let jokeroomsFlickerTimer = 0;
let jokeroomsBananaCooldown = 0;
let jokeroomsCrystalCollected = false;

// Deterministic hash for chunk generation
function jokeroomsHash(cx, cz) {
    let h = (cx * 73856093) ^ (cz * 19349663) ^ 83492791;
    h = (h ^ (h >> 13)) * 1274126177;
    return Math.abs(h ^ (h >> 16));
}

// Jokes database for interactive wall signs & clown NPC
const JOKEROOMS_JOKES = [
    "🤡 Şakacı: 'Ayılar neden kış uykusuna yatar? Çünkü kimse onlara çalar saat hediye etmedi!'",
    "🍌 Muz Kabuğu: 'Bana basarsan hız rekoru kırarsın ama popon biraz acıyabilir!'",
    "📜 Tabela: 'Dikkat! Bu koridor dün sağa dönüyordu, bugün düz gidiyor, yarın yok!'",
    "🚪 Kapı: 'ÇIKIŞ KAPISI (Şaka yaptık, çıkış yok! Burası sonsuz Jokerooms!)'",
    "🐥 Lastik Ördek: 'Vak vak! Sarı duvarlar sarı tüylerime çok yakıştı!'",
    "🎁 Şaka Kutusu: 'Kutuyu açarsan içinden ne çıkar? Bal mı, yaylı palyaço mu?'",
    "📜 Tabela: 'Floresan Lambalar: %100 Doğal Bzzzz sesi üretir!'",
    "🤡 Şakacı: 'Süper Ayı neden uzaya gitti? Yıldızları bal damlası sanıp yalamak için!'",
    "📜 Tabela: 'Tebrikler! Bu tabelayı okurken 3 saniye kaybettiniz!'",
    "🪩 Parti Odası: 'Sonsuz labirentte kaybolduysan en azından dans et! 🕺💃'"
];

function populateJokerooms(game) {
    const THREE = window.THREE;
    if (!game || !game.scene) return;
    
    console.log("🟡 Initializing 12. Bölüm: Jokerooms (Şaka Odaları)...");

    if (!game.currentLevel) game.currentLevel = {};
    if (game.currentLevel.mesh) {
        game.scene.remove(game.currentLevel.mesh);
    }
    
    game.currentLevel = {
        mesh: new THREE.Group(),
        colliders: [],
        collectibles: [],
        enemies: [],
        checkpoints: [],
        spawnPoint: new THREE.Vector3(0, 1.2, 0),
        bananaPeels: [],
        rubberDucks: [],
        jokeBoxes: [],
        trickDoors: [],
        jokeSigns: [],
        flickerLights: [],
        clownNpc: null
    };
    game.scene.add(game.currentLevel.mesh);
    
    // Atmospheric yellow liminal theme
    game.scene.background = new THREE.Color(0xd97706);
    game.scene.fog = new THREE.FogExp2(0xca8a04, 0.028);
    
    // Reset runtime tracking
    jokeroomsActiveChunks.clear();
    jokeroomsLastChunk = { cx: 999999, cz: 999999 };
    jokeroomsSteps = 0;
    jokeroomsLastPos = game.playerPos ? game.playerPos.clone() : new THREE.Vector3(0, 1.2, 0);
    jokeroomsCrystalCollected = (game.storyCrystals || []).includes("crystal_joker");
    
    // Position player
    if (game.playerPos) game.playerPos.set(0, 1.2, 0);
    if (game.playerVel) game.playerVel.set(0, 0, 0);
    
    // Generate initial 5x5 chunks around start
    updateJokeroomsChunks(game, 0, 0, true);
    
    if (game.callbacks && game.callbacks.onShowNotice) {
        game.callbacks.onShowNotice("🚪 12. Bölüm: Jokerooms (Şaka Odaları)! Sarı koridorlarda sonsuz kahkaha labirenti başladı!", "success");
    }
}

// Generate single modular chunk
function createJokeroomsChunk(game, cx, cz) {
    const THREE = window.THREE;
    const CHUNK_SIZE = 24;
    const WALL_HEIGHT = 5.6;
    const WALL_THICK = 0.6;
    const chunkGroup = new THREE.Group();
    chunkGroup.name = "chunk_" + cx + "_" + cz;
    
    const worldX = cx * CHUNK_SIZE;
    const worldZ = cz * CHUNK_SIZE;
    chunkGroup.position.set(worldX, 0, worldZ);
    
    const hash = jokeroomsHash(cx, cz);
    const roomType = (cx === 0 && cz === 0) ? 0 : (hash % 9);
    
    // Shared materials
    const carpetMat = new THREE.MeshStandardMaterial({
        color: 0xca8a04,
        roughness: 0.95,
        metalness: 0.05
    });
    
    const wallMat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        roughness: 0.7,
        metalness: 0.1
    });

    const ceilingMat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        roughness: 0.9
    });

    const trimMat = new THREE.MeshStandardMaterial({
        color: 0x854d0e,
        roughness: 0.6
    });

    // 1. Carpet Floor
    const floorGeo = new THREE.BoxGeometry(CHUNK_SIZE, 0.4, CHUNK_SIZE);
    const floor = new THREE.Mesh(floorGeo, carpetMat);
    floor.position.set(0, -0.2, 0);
    floor.receiveShadow = true;
    chunkGroup.add(floor);
    
    // 2. Ceiling
    const ceilingGeo = new THREE.BoxGeometry(CHUNK_SIZE, 0.3, CHUNK_SIZE);
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.position.set(0, WALL_HEIGHT + 0.15, 0);
    chunkGroup.add(ceiling);
    
    // 3. Fluorescent Light Fixture
    const lightBoxGeo = new THREE.BoxGeometry(4.0, 0.2, 1.4);
    const lightMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xfef08a,
        emissiveIntensity: 1.2
    });
    const lightBox = new THREE.Mesh(lightBoxGeo, lightMat);
    lightBox.position.set(0, WALL_HEIGHT - 0.05, 0);
    chunkGroup.add(lightBox);
    
    const pointLight = new THREE.PointLight(0xfef08a, 0.85, 28);
    pointLight.position.set(0, WALL_HEIGHT - 0.5, 0);
    chunkGroup.add(pointLight);
    
    if (hash % 4 === 0 && game.currentLevel.flickerLights) {
        game.currentLevel.flickerLights.push({
            light: pointLight,
            mesh: lightBox,
            baseIntensity: 0.85,
            flickerPhase: Math.random() * 10
        });
    }

    const chunkColliders = [];
    
    const addWall = (wx, wz, wWidth, wDepth, angle = 0) => {
        const wGeo = new THREE.BoxGeometry(wWidth, WALL_HEIGHT, wDepth);
        const wall = new THREE.Mesh(wGeo, wallMat);
        wall.position.set(wx, WALL_HEIGHT / 2, wz);
        wall.rotation.y = angle;
        wall.castShadow = true;
        wall.receiveShadow = true;
        chunkGroup.add(wall);
        
        // Baseboard trim
        const trimGeo = new THREE.BoxGeometry(wWidth + 0.05, 0.35, wDepth + 0.05);
        const trim = new THREE.Mesh(trimGeo, trimMat);
        trim.position.set(wx, 0.18, wz);
        trim.rotation.y = angle;
        chunkGroup.add(trim);
        
        // Store global bounding box for collisions
        const absX = worldX + wx;
        const absZ = worldZ + wz;
        const halfW = (angle === 0 ? wWidth : wDepth) / 2;
        const halfD = (angle === 0 ? wDepth : wWidth) / 2;
        
        const col = {
            min: new THREE.Vector3(absX - halfW, 0, absZ - halfD),
            max: new THREE.Vector3(absX + halfW, WALL_HEIGHT, absZ + halfD),
            chunkKey: cx + "," + cz
        };
        chunkColliders.push(col);
    };

    // 4. Corridor Layout based on Room Type
    // Keep passages open to adjacent chunks (at x=0, z=0 crossings)
    if (roomType === 0) {
        // Starter Room: 4 open archways, welcome signs, ducks
        addWall(-9, -9, 6, WALL_THICK);
        addWall(-9, -9, WALL_THICK, 6);
        addWall(9, -9, 6, WALL_THICK);
        addWall(9, -9, WALL_THICK, 6);
        addWall(-9, 9, 6, WALL_THICK);
        addWall(-9, 9, WALL_THICK, 6);
        addWall(9, 9, 6, WALL_THICK);
        addWall(9, 9, WALL_THICK, 6);
        
        // Welcome Sign Board
        create3DJokeSign(chunkGroup, worldX, worldZ, 0, 2.5, -8.6, "🚪 JOKEROOMS - ŞAKA ODALARI", "Sonsuz sarı koridorlara hoş geldin! Çıkış yok, bol kahkaha var! [E] tuşu ile tabelaları oku.");
        
        // Starter rubber ducks & coins
        createRubberDuck(game, chunkGroup, worldX, worldZ, -4, 0.6, -4);
        createRubberDuck(game, chunkGroup, worldX, worldZ, 4, 0.6, 4);
        createBananaPeel(game, chunkGroup, worldX, worldZ, 0, 0.1, 5);
        
    } else if (roomType === 1) {
        // Straight North-South Corridor with Pillars
        addWall(-6, 0, WALL_THICK, CHUNK_SIZE);
        addWall(6, 0, WALL_THICK, CHUNK_SIZE);
        
        create3DJokeSign(chunkGroup, worldX, worldZ, -5.6, 2.5, 0, "📜 FLORESAN SESİ", "Bzzzz... Bzzzz... Sarı lambanın sesi sana huzur veriyor mu? [E]");
        createRubberDuck(game, chunkGroup, worldX, worldZ, 0, 0.6, -4);
        createRubberDuck(game, chunkGroup, worldX, worldZ, 0, 0.6, 4);
        createBananaPeel(game, chunkGroup, worldX, worldZ, 0, 0.1, 0);

    } else if (roomType === 2) {
        // East-West Corridor with side alcoves
        addWall(0, -6, CHUNK_SIZE, WALL_THICK);
        addWall(0, 6, CHUNK_SIZE, WALL_THICK);
        
        createBananaPeel(game, chunkGroup, worldX, worldZ, -5, 0.1, 0);
        createBananaPeel(game, chunkGroup, worldX, worldZ, 5, 0.1, 0);
        createJackInTheBox(game, chunkGroup, worldX, worldZ, 0, 0.5, -5.2);
        create3DJokeSign(chunkGroup, worldX, worldZ, 0, 2.5, 5.6, "🍌 KAYGAN ZEMİN", "Muz kabukları Süper Ayı'ya turbo hız kazandırır! Üstüne bas ve kay!");

    } else if (roomType === 3) {
        // Crossroads + Center Joke Box
        addWall(-7, -7, 6, 6);
        addWall(7, -7, 6, 6);
        addWall(-7, 7, 6, 6);
        addWall(7, 7, 6, 6);
        
        createJackInTheBox(game, chunkGroup, worldX, worldZ, 0, 0.5, 0);
        createRubberDuck(game, chunkGroup, worldX, worldZ, -4, 0.6, 0);
        createRubberDuck(game, chunkGroup, worldX, worldZ, 4, 0.6, 0);
        create3DJokeSign(chunkGroup, worldX, worldZ, 0, 2.5, -6.6, "🤡 ŞAKA KUTUSU", "Ortadaki şaka kutusuna yaklaş ve [E] ile aç! İçinde ne saklı?");

    } else if (roomType === 4) {
        // Squeaky Duck Paradise Room
        addWall(-8, 0, WALL_THICK, 12);
        addWall(8, 0, WALL_THICK, 12);
        addWall(0, -8, 12, WALL_THICK);
        addWall(0, 8, 12, WALL_THICK);
        
        for (let di = -4; di <= 4; di += 4) {
            for (let dj = -4; dj <= 4; dj += 4) {
                createRubberDuck(game, chunkGroup, worldX, worldZ, di, 0.6, dj);
            }
        }
        create3DJokeSign(chunkGroup, worldX, worldZ, 0, 2.5, -7.6, "🐥 ÖRDEK CENNETİ", "Sarı lastik ördekler cikliyor! Hepsini topla, altınları kap!");

    } else if (roomType === 5) {
        // Trick Door Room ("Fake Exit")
        addWall(-7, -5, 6, WALL_THICK);
        addWall(7, -5, 6, WALL_THICK);
        addWall(-7, 5, 6, WALL_THICK);
        addWall(7, 5, 6, WALL_THICK);
        
        createTrickDoor(game, chunkGroup, worldX, worldZ, 0, 0, -5);
        create3DJokeSign(chunkGroup, worldX, worldZ, 4.5, 2.5, -4.6, "🚪 SAHTE ÇIKIŞ", "'ÇIKIŞ' yazan kapıya dokunursan ne olur? Dene ve gör!");

    } else if (roomType === 6) {
        // Secret Joke Disco Party Room
        createDiscoPartyRoom(game, chunkGroup, worldX, worldZ);
        create3DJokeSign(chunkGroup, worldX, worldZ, 0, 2.5, -9, "🪩 ŞAKA PARTİSİ", "Tebrikler! Gizli disko odasını buldun! Müzikle dans et!");

    } else if (roomType === 7) {
        // The Clown / Joker Altar (The entity with 12th Crystal)
        addWall(-8, -8, 6, 6);
        addWall(8, -8, 6, 6);
        addWall(-8, 8, 6, 6);
        addWall(8, 8, 6, 6);
        
        createClownGuardian(game, chunkGroup, worldX, worldZ, 0, 1.8, 0);
        create3DJokeSign(chunkGroup, worldX, worldZ, 0, 2.5, -7.5, "👑 ŞAKACI PALYAÇO", "Jokerooms'un neşeli koruyucusu! Onunla konuş ve 12. Kutsal Şaka Bal Kristali'ni al!");

    } else {
        // Winding L-Corridor
        addWall(-5, -5, 10, WALL_THICK);
        addWall(5, 5, 10, WALL_THICK);
        addWall(5, -5, WALL_THICK, 10);
        
        createBananaPeel(game, chunkGroup, worldX, worldZ, -2, 0.1, -2);
        createRubberDuck(game, chunkGroup, worldX, worldZ, 2, 0.6, 2);
        create3DJokeSign(chunkGroup, worldX, worldZ, -4.6, 2.5, 0, "📜 LABİRENT NOTU", "Sonsuz koridorlarda her köşe başında yeni bir şaka seni bekliyor!");
    }
    
    // Register colliders
    chunkColliders.forEach(c => game.currentLevel.colliders.push(c));
    
    return chunkGroup;
}

// 3D Joke Sign on Wall
function create3DJokeSign(chunkGroup, worldX, worldZ, lx, ly, lz, title, text) {
    const THREE = window.THREE;
    const signGroup = new THREE.Group();
    signGroup.position.set(lx, ly, lz);
    
    const boardGeo = new THREE.BoxGeometry(2.8, 1.4, 0.15);
    const boardMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const board = new THREE.Mesh(boardGeo, boardMat);
    signGroup.add(board);
    
    const frameGeo = new THREE.BoxGeometry(3.0, 1.6, 0.1);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.7 });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.z = -0.04;
    signGroup.add(frame);
    
    // Text badge icon
    const iconGeo = new THREE.SphereGeometry(0.28, 8, 8);
    const iconMat = new THREE.MeshStandardMaterial({ color: 0xeab308, emissive: 0xca8a04 });
    const iconMesh = new THREE.Mesh(iconGeo, iconMat);
    iconMesh.position.set(0, 0.4, 0.12);
    signGroup.add(iconMesh);
    
    chunkGroup.add(signGroup);
    
    const game = window.__superBearGame;
    if (game && game.currentLevel && game.currentLevel.jokeSigns) {
        game.currentLevel.jokeSigns.push({
            pos: new THREE.Vector3(worldX + lx, ly, worldZ + lz),
            title: title,
            text: text
        });
    }
}

// 3D Squeaky Rubber Duck
function createRubberDuck(game, chunkGroup, worldX, worldZ, lx, ly, lz) {
    const THREE = window.THREE;
    const duckGroup = new THREE.Group();
    duckGroup.position.set(lx, ly, lz);
    
    const duckMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.2 });
    const beakMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
    
    // Body
    const bodyGeo = new THREE.SphereGeometry(0.45, 12, 12);
    bodyGeo.scale(1.2, 0.9, 1.0);
    const body = new THREE.Mesh(bodyGeo, duckMat);
    duckGroup.add(body);
    
    // Head
    const headGeo = new THREE.SphereGeometry(0.3, 10, 10);
    const head = new THREE.Mesh(headGeo, duckMat);
    head.position.set(0.3, 0.35, 0);
    duckGroup.add(head);
    
    // Beak
    const beakGeo = new THREE.ConeGeometry(0.12, 0.25, 8);
    beakGeo.rotateZ(-Math.PI / 2);
    const beak = new THREE.Mesh(beakGeo, beakMat);
    beak.position.set(0.6, 0.32, 0);
    duckGroup.add(beak);
    
    // Eyes
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), eyeMat);
    eyeL.position.set(0.45, 0.45, 0.15);
    duckGroup.add(eyeL);
    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), eyeMat);
    eyeR.position.set(0.45, 0.45, -0.15);
    duckGroup.add(eyeR);
    
    chunkGroup.add(duckGroup);
    
    if (game && game.currentLevel && game.currentLevel.rubberDucks) {
        game.currentLevel.rubberDucks.push({
            pos: new THREE.Vector3(worldX + lx, ly, worldZ + lz),
            mesh: duckGroup,
            collected: false,
            baseY: ly,
            phase: Math.random() * Math.PI * 2
        });
    }
}

// 3D Banana Peel Hazard (Turbo Slide)
function createBananaPeel(game, chunkGroup, worldX, worldZ, lx, ly, lz) {
    const THREE = window.THREE;
    const peelGroup = new THREE.Group();
    peelGroup.position.set(lx, ly, lz);
    
    const peelMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.5 });
    const tipMat = new THREE.MeshStandardMaterial({ color: 0x713f12, roughness: 0.8 });
    
    for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const stripGeo = new THREE.BoxGeometry(0.6, 0.04, 0.2);
        const strip = new THREE.Mesh(stripGeo, peelMat);
        strip.position.set(Math.cos(angle) * 0.35, 0.02, Math.sin(angle) * 0.35);
        strip.rotation.y = -angle;
        peelGroup.add(strip);
    }
    
    const center = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), tipMat);
    center.position.y = 0.08;
    peelGroup.add(center);
    
    chunkGroup.add(peelGroup);
    
    if (game && game.currentLevel && game.currentLevel.bananaPeels) {
        game.currentLevel.bananaPeels.push({
            pos: new THREE.Vector3(worldX + lx, ly, worldZ + lz),
            mesh: peelGroup
        });
    }
}

// 3D Jack-in-the-Box
function createJackInTheBox(game, chunkGroup, worldX, worldZ, lx, ly, lz) {
    const THREE = window.THREE;
    const boxGroup = new THREE.Group();
    boxGroup.position.set(lx, ly, lz);
    
    const boxGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 });
    const box = new THREE.Mesh(boxGeo, boxMat);
    boxGroup.add(box);
    
    // Crank
    const crankGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.4);
    const crankMat = new THREE.MeshStandardMaterial({ color: 0xfacc15 });
    const crank = new THREE.Mesh(crankGeo, crankMat);
    crank.rotation.z = Math.PI / 2;
    crank.position.set(0.7, 0.2, 0);
    boxGroup.add(crank);
    
    chunkGroup.add(boxGroup);
    
    if (game && game.currentLevel && game.currentLevel.jokeBoxes) {
        game.currentLevel.jokeBoxes.push({
            pos: new THREE.Vector3(worldX + lx, ly, worldZ + lz),
            mesh: boxGroup,
            crank: crank,
            opened: false
        });
    }
}

// 3D Trick Door ("Fake Exit")
function createTrickDoor(game, chunkGroup, worldX, worldZ, lx, ly, lz) {
    const THREE = window.THREE;
    const doorGroup = new THREE.Group();
    doorGroup.position.set(lx, ly, lz);
    
    const frameGeo = new THREE.BoxGeometry(2.4, 4.4, 0.4);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6 });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.y = 2.2;
    doorGroup.add(frame);
    
    const doorGeo = new THREE.BoxGeometry(1.8, 3.8, 0.2);
    const doorMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
    const door = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(0, 2.1, 0.05);
    doorGroup.add(door);
    
    // "ÇIKIŞ" Sign above door
    const signGeo = new THREE.BoxGeometry(1.6, 0.6, 0.1);
    const signMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x15803d });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(0, 4.2, 0.2);
    doorGroup.add(sign);
    
    chunkGroup.add(doorGroup);
    
    if (game && game.currentLevel && game.currentLevel.trickDoors) {
        game.currentLevel.trickDoors.push({
            pos: new THREE.Vector3(worldX + lx, ly, worldZ + lz),
            mesh: doorGroup
        });
    }
}

// 3D Secret Disco Joke Party Room
function createDiscoPartyRoom(game, chunkGroup, worldX, worldZ) {
    const THREE = window.THREE;
    
    // Disco Ball
    const ballGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const ballMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.95, roughness: 0.1 });
    const discoBall = new THREE.Mesh(ballGeo, ballMat);
    discoBall.position.set(0, 4.2, 0);
    chunkGroup.add(discoBall);
    
    // Disco floor light tiles
    const colors = [0xef4444, 0x3b82f6, 0x10b981, 0xf59e0b, 0x8b5cf6, 0xec4899];
    for (let x = -6; x <= 6; x += 3) {
        for (let z = -6; z <= 6; z += 3) {
            const tileMat = new THREE.MeshStandardMaterial({
                color: colors[Math.floor(Math.random() * colors.length)],
                emissive: colors[Math.floor(Math.random() * colors.length)],
                emissiveIntensity: 0.6
            });
            const tile = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.05, 2.6), tileMat);
            tile.position.set(x, 0.05, z);
            chunkGroup.add(tile);
        }
    }
    
    // Party Balloons
    for (let i = 0; i < 5; i++) {
        const balloonGeo = new THREE.SphereGeometry(0.6, 10, 10);
        balloonGeo.scale(1, 1.25, 1);
        const balloonMat = new THREE.MeshStandardMaterial({ color: colors[i % colors.length] });
        const balloon = new THREE.Mesh(balloonGeo, balloonMat);
        balloon.position.set((Math.random() - 0.5) * 8, 2.5 + Math.random() * 1.5, (Math.random() - 0.5) * 8);
        chunkGroup.add(balloon);
    }
}

// 3D Şakacı Palyaço Gözcüsü (Entity with 12th Crystal)
function createClownGuardian(game, chunkGroup, worldX, worldZ, lx, ly, lz) {
    const THREE = window.THREE;
    const clownGroup = new THREE.Group();
    clownGroup.position.set(lx, ly, lz);
    
    // Head
    const headGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.4 });
    const head = new THREE.Mesh(headGeo, headMat);
    clownGroup.add(head);
    
    // Big Red Clown Nose
    const noseGeo = new THREE.SphereGeometry(0.28, 12, 12);
    const noseMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, roughness: 0.2 });
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.position.set(0, 0, 0.75);
    clownGroup.add(nose);
    
    // Rainbow Afro Hair
    const hairColors = [0xef4444, 0x3b82f6, 0x10b981, 0xfacc15, 0xa855f7];
    for (let i = 0; i < 8; i++) {
        const hairGeo = new THREE.SphereGeometry(0.38, 8, 8);
        const hairMat = new THREE.MeshStandardMaterial({ color: hairColors[i % hairColors.length] });
        const puff = new THREE.Mesh(hairGeo, hairMat);
        const ang = (i / 8) * Math.PI * 2;
        puff.position.set(Math.cos(ang) * 0.75, 0.5 + Math.sin(ang) * 0.3, Math.sin(ang) * 0.75);
        clownGroup.add(puff);
    }
    
    // Jester Hat
    const hatGeo = new THREE.ConeGeometry(0.5, 1.1, 8);
    const hatMat = new THREE.MeshStandardMaterial({ color: 0xfacc15 });
    const hat = new THREE.Mesh(hatGeo, hatMat);
    hat.position.set(0, 1.2, 0);
    clownGroup.add(hat);
    
    // Floating Crystal (12. Kutsal Bal Kristali)
    const crystalGeo = new THREE.OctahedronGeometry(0.65, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        emissive: 0xeab308,
        emissiveIntensity: 0.9,
        roughness: 0.1
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    crystalMesh.position.set(0, 2.4, 0);
    clownGroup.add(crystalMesh);
    
    chunkGroup.add(clownGroup);
    
    if (game && game.currentLevel) {
        game.currentLevel.clownNpc = {
            pos: new THREE.Vector3(worldX + lx, ly, worldZ + lz),
            mesh: clownGroup,
            crystalMesh: crystalMesh,
            talkCount: 0
        };
    }
}

// Update Active Chunks around Player Position
function updateJokeroomsChunks(game, currentCx, currentCz, force = false) {
    if (!force && jokeroomsLastChunk.cx === currentCx && jokeroomsLastChunk.cz === currentCz) {
        return;
    }
    jokeroomsLastChunk = { cx: currentCx, cz: currentCz };
    
    const THREE = window.THREE;
    const RADIUS = 2; // 5x5 chunks around player
    const neededKeys = new Set();
    
    for (let dx = -RADIUS; dx <= RADIUS; dx++) {
        for (let dz = -RADIUS; dz <= RADIUS; dz++) {
            const cx = currentCx + dx;
            const cz = currentCz + dz;
            const key = cx + "," + cz;
            neededKeys.add(key);
            
            if (!jokeroomsActiveChunks.has(key)) {
                const chunkGroup = createJokeroomsChunk(game, cx, cz);
                game.currentLevel.mesh.add(chunkGroup);
                jokeroomsActiveChunks.set(key, chunkGroup);
            }
        }
    }
    
    // Remove out-of-range chunks
    for (const [key, chunkGroup] of jokeroomsActiveChunks.entries()) {
        if (!neededKeys.has(key)) {
            game.currentLevel.mesh.remove(chunkGroup);
            jokeroomsActiveChunks.delete(key);
            
            // Clean up colliders
            if (game.currentLevel && game.currentLevel.colliders) {
                game.currentLevel.colliders = game.currentLevel.colliders.filter(c => c.chunkKey !== key);
            }
        }
    }
}

function teleportToJokerooms() {
    const game = window.__superBearGame;
    if (!game || !game.scene) return;
    
    game.currentRegion = 'jokerooms';
    populateJokerooms(game);
}

// Keyboard interactions for [E] & [B] in Jokerooms
window.addEventListener('keydown', (e) => {
    const game = window.__superBearGame;
    if (!game || game.currentRegion !== 'jokerooms' || !game.playerPos) return;
    
    const key = e.key.toUpperCase();
    const pPos = game.playerPos;
    
    if (key === 'E' || key === 'B') {
        let interacted = false;
        
        // 1. Joke Signs Check
        if (game.currentLevel && game.currentLevel.jokeSigns) {
            game.currentLevel.jokeSigns.forEach(sign => {
                if (pPos.distanceTo(sign.pos) < 5.0) {
                    interacted = true;
                    if (game.callbacks && game.callbacks.onShowNotice) {
                        game.callbacks.onShowNotice(\`\${sign.title}: '\${sign.text}'\`, "info");
                    }
                }
            });
        }
        
        // 2. Clown Guardian / Joke Boss Check
        const clown = game.currentLevel && game.currentLevel.clownNpc;
        if (!interacted && clown && pPos.distanceTo(clown.pos) < 6.5) {
            interacted = true;
            clown.talkCount++;
            
            const jokeIdx = clown.talkCount % JOKEROOMS_JOKES.length;
            const jokeText = JOKEROOMS_JOKES[jokeIdx];
            
            if (game.callbacks && game.callbacks.onShowNotice) {
                game.callbacks.onShowNotice(jokeText, "warning");
            }
            
            // Award 12th Crystal if not yet collected
            if (!jokeroomsCrystalCollected) {
                jokeroomsCrystalCollected = true;
                if (!game.storyCrystals) game.storyCrystals = [];
                if (!game.storyCrystals.includes("crystal_joker")) {
                    game.storyCrystals.push("crystal_joker");
                }
                
                if (game.spawnSparkleParticles) {
                    game.spawnSparkleParticles(clown.pos, 40, 0xfacc15);
                }
                
                if (game.callbacks && game.callbacks.onBossDefeated) {
                    game.callbacks.onBossDefeated("clown_joker_boss", "jokerooms", true);
                }
                
                setTimeout(() => {
                    if (game.callbacks && game.callbacks.onShowNotice) {
                        game.callbacks.onShowNotice("🎉 TEBRİKLER! 12. Kutsal Şaka & Kahkaha Bal Kristali Kurtarıldı! Jokerooms Efsanevi Şakacısı Oldun! 🤡🟡✨", "success");
                    }
                }, 1200);
            }
        }
        
        // 3. Jack-in-the-Box Check
        if (!interacted && game.currentLevel && game.currentLevel.jokeBoxes) {
            game.currentLevel.jokeBoxes.forEach(box => {
                if (!box.opened && pPos.distanceTo(box.pos) < 4.0) {
                    interacted = true;
                    box.opened = true;
                    if (box.crank) box.crank.rotation.x += Math.PI * 4;
                    
                    if (game.spawnSparkleParticles) {
                        game.spawnSparkleParticles(box.pos, 25, 0xef4444);
                    }
                    if (game.addCoins) game.addCoins(30);
                    
                    if (game.callbacks && game.callbacks.onShowNotice) {
                        game.callbacks.onShowNotice("🎁 BOINGG! Şaka Kutusu Patladı! Yaylı Palyaço Çıktı! (+30 Altın & +50 XP)", "success");
                    }
                }
            });
        }
    }
});

// Window Teleport Event Listener
window.addEventListener('superbear:teleport-jokerooms', () => {
    teleportToJokerooms();
});
`;

// Replace previous populateJokerooms / teleportToJokerooms block
const startIdx = enhancer.indexOf("function populateJokerooms");
const endIdx = enhancer.indexOf("window.addEventListener('keydown', (e) => {", startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    enhancer = enhancer.substring(0, startIdx) + jokeroomsCode + enhancer.substring(endIdx);
    console.log("Replaced populateJokerooms in enhancer successfully.");
} else {
    console.log("Could not find start/end index, let's append jokeroomsCode!");
    enhancer += jokeroomsCode;
}

// Now let's update updateSpaceLoop to include Jokerooms loop handlers
const loopCheckStr = "if (game.currentRegion === 'sugar_world' && !sugarWorldPopulated)";
const jokeroomsLoopStr = `
  // --- 12. BÖLÜM: JOKEROOMS (ŞAKA ODALARI) ENDLESS LABYRINTH LOOP ---
  if (game.currentRegion === 'jokerooms' && !jokeroomsPopulated) {
      jokeroomsPopulated = true;
      populateJokerooms(game);
  } else if (game.currentRegion !== 'jokerooms') {
      jokeroomsPopulated = false;
  }

  if (game.currentRegion === 'jokerooms' && game.currentLevel && game.playerPos) {
      const dt = 0.016;
      const pPos = game.playerPos;
      const CHUNK_SIZE = 24;
      
      // 1. Dynamic Endless Chunk Update
      const curCx = Math.floor((pPos.x + CHUNK_SIZE / 2) / CHUNK_SIZE);
      const curCz = Math.floor((pPos.z + CHUNK_SIZE / 2) / CHUNK_SIZE);
      updateJokeroomsChunks(game, curCx, curCz);
      
      // 2. Track Endless Exploration Distance & Steps
      if (jokeroomsLastPos) {
          const stepDist = pPos.distanceTo(jokeroomsLastPos);
          if (stepDist > 0.1 && stepDist < 5.0) {
              jokeroomsSteps += stepDist;
              jokeroomsLastPos.copy(pPos);
              
              // Milestone notices every 100 meters
              const curMeter = Math.floor(jokeroomsSteps);
              if (curMeter > 0 && curMeter % 100 === 0 && (!game._lastNotifiedMeter || game._lastNotifiedMeter !== curMeter)) {
                  game._lastNotifiedMeter = curMeter;
                  if (game.callbacks && game.callbacks.onShowNotice) {
                      game.callbacks.onShowNotice(\`🟡 Jokerooms Derinliği: \${curMeter} metre sonsuz sarı koridoru keşfettin! 🚪🤡\`, "info");
                  }
              }
          }
      }
      
      // 3. Flickering Fluorescent Lights Animation
      jokeroomsFlickerTimer += dt;
      if (game.currentLevel.flickerLights) {
          game.currentLevel.flickerLights.forEach(fl => {
              const noise = Math.sin(jokeroomsFlickerTimer * 12 + fl.flickerPhase);
              if (noise > 0.82) {
                  fl.light.intensity = 0.15; // flicker dip
              } else {
                  fl.light.intensity = fl.baseIntensity;
              }
          });
      }
      
      // 4. Rubber Duck Collectibles (Floating, Bobbing & Squeaking)
      if (game.currentLevel.rubberDucks) {
          const nowSec = Date.now() * 0.003;
          game.currentLevel.rubberDucks.forEach(duck => {
              if (!duck.collected && duck.mesh) {
                  duck.mesh.position.y = duck.baseY + Math.sin(nowSec + duck.phase) * 0.15;
                  duck.mesh.rotation.y += 0.02;
                  
                  if (pPos.distanceTo(duck.pos) < 1.8) {
                      duck.collected = true;
                      duck.mesh.visible = false;
                      if (game.spawnSparkleParticles) game.spawnSparkleParticles(duck.pos, 15, 0xfacc15);
                      if (game.addCoins) game.addCoins(15);
                      if (game.addExp) game.addExp(30);
                      if (game.callbacks && game.callbacks.onShowNotice) {
                          game.callbacks.onShowNotice("🐥 Cik cik! Şakacı Sarı Lastik Ördek Toplandı! (+15 Altın, +30 XP)", "success");
                      }
                  }
              }
          });
      }
      
      // 5. Banana Peel Hazards (Turbo Cartoon Slip & Slide)
      if (jokeroomsBananaCooldown > 0) {
          jokeroomsBananaCooldown -= dt;
      } else if (game.currentLevel.bananaPeels) {
          game.currentLevel.bananaPeels.forEach(peel => {
              if (pPos.distanceTo(peel.pos) < 1.5) {
                  jokeroomsBananaCooldown = 2.0; // Cooldown
                  if (game.playerVel) {
                      // Apply intense slide boost forward
                      const slideSpeed = 28;
                      const rotY = game.playerRotY || 0;
                      game.playerVel.x = -Math.sin(rotY) * slideSpeed;
                      game.playerVel.z = -Math.cos(rotY) * slideSpeed;
                      game.playerVel.y = 5;
                  }
                  if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos, 20, 0xfde047);
                  if (game.callbacks && game.callbacks.onShowNotice) {
                      game.callbacks.onShowNotice("🍌 VIINNN! Muz kabuğuna bastın ve süpersonik kaydın! 💨", "warn");
                  }
              }
          });
      }
      
      // 6. Trick Door (Fake Exit Teleport)
      if (game.currentLevel.trickDoors) {
          game.currentLevel.trickDoors.forEach(door => {
              if (pPos.distanceTo(door.pos) < 2.0) {
                  // Teleport to a random corridor chunk
                  const randDist = (Math.random() > 0.5 ? 1 : -1) * (48 + Math.floor(Math.random() * 48));
                  pPos.x += randDist;
                  pPos.z += randDist;
                  if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos, 30, 0x3b82f6);
                  if (game.callbacks && game.callbacks.onShowNotice) {
                      game.callbacks.onShowNotice("🚪 SAHTE ÇIKIŞ! Şakalandın! Başka bir sarı odaya ışınlandın! 🎉", "warn");
                  }
              }
          });
      }
      
      // 7. Clown Guardian / Joker Rotation & Float
      const clown = game.currentLevel.clownNpc;
      if (clown && clown.mesh) {
          clown.mesh.rotation.y += dt * 0.8;
          clown.mesh.position.y = 1.8 + Math.sin(Date.now() * 0.003) * 0.25;
          if (clown.crystalMesh && !jokeroomsCrystalCollected) {
              clown.crystalMesh.rotation.y += dt * 2.0;
          } else if (clown.crystalMesh && jokeroomsCrystalCollected) {
              clown.crystalMesh.visible = false;
          }
      }
  }
`;

if (!enhancer.includes("12. BÖLÜM: JOKEROOMS (ŞAKA ODALARI) ENDLESS LABYRINTH LOOP")) {
    enhancer = enhancer.replace(loopCheckStr, jokeroomsLoopStr + "\n  " + loopCheckStr);
    console.log("Added jokerooms loop to updateSpaceLoop in enhancer.");
}

fs.writeFileSync("public/game-enhancer.js", enhancer, "utf8");
console.log("game-enhancer.js updated successfully!");
