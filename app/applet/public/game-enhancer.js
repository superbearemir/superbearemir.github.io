console.log("Game Enhancer loaded");

let addedObjects = [];

function addPlatform(scene, level, x, y, z, w, h, d, color, opacity = 1) {
    const geo = new window.THREE.BoxGeometry(w, h, d);
    const mat = new window.THREE.MeshStandardMaterial({ 
        color: color, 
        transparent: opacity < 1, 
        opacity: opacity 
    });
    const mesh = new window.THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    scene.add(mesh);
    addedObjects.push(mesh);
    
    if(level && level.collisionBounds) {
        level.collisionBounds.push({
            min: {x: x - w/2, y: y - h/2, z: z - d/2},
            max: {x: x + w/2, y: y + h/2, z: z + d/2}
        });
    }
}

function clearAddedObjects(scene) {
    addedObjects.forEach(obj => scene.remove(obj));
    addedObjects = [];
}

function populateVolcanoCave(scene, level) {
    // Main path
    addPlatform(scene, level, 0, -1, 0, 40, 1, 200, 0x550000);
    // Lava sides
    addPlatform(scene, level, -30, -2, 0, 20, 2, 200, 0x8b0000);
    addPlatform(scene, level, 30, -2, 0, 20, 2, 200, 0x8b0000);
    
    // Thermal platforms
    for(let i=0; i<10; i++) {
        addPlatform(scene, level, (i%2===0?-15:15), i*5, -i*20, 10, 1, 10, 0x444444);
    }
    
    // Boss area
    addPlatform(scene, level, 0, 0, -220, 60, 2, 60, 0x220000);
    
    // Boss "Magma Dragon"
    const bossGroup = new window.THREE.Group();
    bossGroup.position.set(0, 5, -220);
    const body = new window.THREE.Mesh(new window.THREE.SphereGeometry(5), new window.THREE.MeshStandardMaterial({color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 1}));
    bossGroup.add(body);
    scene.add(bossGroup);
    addedObjects.push(bossGroup);
}

function populateUnderwaterPalace(scene, level) {
    // Water ground
    addPlatform(scene, level, 0, -2, 0, 200, 2, 200, 0x0077be);
    // Floating coral/crystal platforms
    for(let i=0; i<20; i++) {
        addPlatform(scene, level, Math.random()*100-50, Math.random()*20, Math.random()*100-50, 8, 2, 8, 0xadd8e6, 0.7);
    }
}

function populateGoldenSanctuary(scene, level) {
    // Gold ground
    addPlatform(scene, level, 0, -2, 0, 200, 2, 200, 0xffd700);
    // Floating golden platforms
    for(let i=0; i<20; i++) {
        addPlatform(scene, level, Math.random()*100-50, Math.random()*20, Math.random()*100-50, 12, 2, 12, 0xffff00);
    }
}

function populateRegion(region, game) {
    console.log("Populating region:", region);
    const scene = game.scene;
    const currentLevel = game.currentLevel;
    
    clearAddedObjects(scene);
    
    if (region === "volcano_cave") populateVolcanoCave(scene, currentLevel);
    else if (region === "underwater_palace") populateUnderwaterPalace(scene, currentLevel);
    else if (region === "golden_sanctuary") populateGoldenSanctuary(scene, currentLevel);
}

let lastRegion = "";
function checkRegion() {
  const game = window.__superBearGame;
  if (game && game.currentRegion !== lastRegion) {
    lastRegion = game.currentRegion;
    console.log("Region changed to:", lastRegion);
    
    // Access restricted to < 1M coins
    if ((game.coins || 0) < 1000000) {
        if (["volcano_cave", "underwater_palace", "golden_sanctuary"].includes(lastRegion)) {
            populateRegion(lastRegion, game);
        }
    } else {
        console.log("Access denied to", lastRegion, "- Need < 1M coins.");
    }
  }
  setTimeout(checkRegion, 500);
}

function enhanceGame() {
  const game = window.__superBearGame;
  if (!game || !game.scene) {
    setTimeout(enhanceGame, 1000);
    return;
  }
  console.log("Game instance found, enhancing levels...");
  
  // Start region observer
  checkRegion();
}
