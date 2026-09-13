const fs = require('fs');

console.log("🚀 Starting Patch for Boss Shooting Damage, 3D Overhead HP Bar, Boss Arena Cover Spots, and Audio Fixes...");

// ----------------------------------------------------
// 1. PATCH game-enhancer.js (Universal Helper Functions & Laser Loop)
// ----------------------------------------------------
let enhancerCode = fs.readFileSync('public/game-enhancer.js', 'utf8');

// Insert Universal 3D Overhead HP Bar & Cover Spot Helpers at the top of game-enhancer.js
const helperFunctions = `
// ============================================================
// UNIVERSAL 3D OVERHEAD BOSS HEALTH BAR (BILLBOARD SPRITE)
// ============================================================
window.__create3DOverheadHpBar = function(THREE, bossMesh, bossTitle, maxHp, yOffset = 4.5) {
  if (!bossMesh || !THREE) return null;
  
  // Create Canvas
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  
  const spriteMat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false
  });
  
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(8.5, 2.125, 1.0);
  sprite.position.set(0, yOffset, 0);
  sprite.name = "boss_3d_overhead_hp_bar";
  
  bossMesh.add(sprite);
  
  const hpData = {
    canvas,
    ctx,
    texture,
    sprite,
    bossTitle: bossTitle || "PATRON BOSS",
    maxHp: maxHp || 100,
    currentHp: maxHp || 100,
    yOffset
  };
  
  bossMesh.userData.__overheadHpData = hpData;
  window.__update3DOverheadHpBar(hpData, maxHp, maxHp);
  return hpData;
};

window.__update3DOverheadHpBar = function(hpData, currentHp, maxHp) {
  if (!hpData || !hpData.ctx) return;
  const { canvas, ctx, texture, bossTitle } = hpData;
  hpData.currentHp = currentHp;
  if (maxHp) hpData.maxHp = maxHp;
  const max = hpData.maxHp || 100;
  
  const cur = Math.max(0, currentHp);
  const pct = Math.max(0, Math.min(1, cur / max));
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw glowing pill container
  ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
  ctx.strokeStyle = pct > 0.5 ? '#38bdf8' : pct > 0.25 ? '#facc15' : '#ef4444';
  ctx.lineWidth = 6;
  
  const x = 10, y = 10, w = canvas.width - 20, h = canvas.height - 20, r = 20;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Boss Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('👑 ' + (bossTitle || 'BOSS'), 24, 34);
  
  // HP Numbers Right
  ctx.fillStyle = pct > 0.5 ? '#4ade80' : pct > 0.25 ? '#fde047' : '#f87171';
  ctx.font = 'bold 24px monospace';
  ctx.textAlign = 'right';
  ctx.fillText(Math.ceil(cur) + ' / ' + max + ' HP', canvas.width - 24, 34);
  
  // HP Track
  const trackX = 24, trackY = 64, trackW = canvas.width - 48, trackH = 30;
  ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(trackX, trackY, trackW, trackH, 12);
  else ctx.rect(trackX, trackY, trackW, trackH);
  ctx.fill();
  
  // HP Fill
  if (pct > 0) {
    const fillW = Math.max(14, trackW * pct);
    const grad = ctx.createLinearGradient(trackX, 0, trackX + fillW, 0);
    if (pct > 0.5) {
      grad.addColorStop(0, '#10b981');
      grad.addColorStop(1, '#34d399');
    } else if (pct > 0.25) {
      grad.addColorStop(0, '#f59e0b');
      grad.addColorStop(1, '#facc15');
    } else {
      grad.addColorStop(0, '#dc2626');
      grad.addColorStop(1, '#ef4444');
    }
    ctx.fillStyle = grad;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(trackX, trackY, fillW, trackH, 12);
    else ctx.rect(trackX, trackY, fillW, trackH);
    ctx.fill();
  }
  
  texture.needsUpdate = true;
};

// ============================================================
// UNIVERSAL BOSS ARENA COVER SPOTS ("SAKLANMA YERLERİ")
// ============================================================
window.__addBossArenaCoverSpots = function(THREE, sceneGroup, cx, cy, cz) {
  if (!sceneGroup || !THREE) return;
  
  const coverPositions = [
    { x: cx - 14, z: cz - 12, type: 'pillar', h: 6.5 },
    { x: cx + 14, z: cz - 12, type: 'pillar', h: 6.5 },
    { x: cx - 18, z: cz + 8,  type: 'wall',   h: 4.0, rotY: 0.4 },
    { x: cx + 18, z: cz + 8,  type: 'wall',   h: 4.0, rotY: -0.4 },
    { x: cx - 9,  z: cz + 20, type: 'shield', h: 4.5 },
    { x: cx + 9,  z: cz + 20, type: 'shield', h: 4.5 },
    { x: cx,      z: cz - 24, type: 'ruins',  h: 5.5 },
  ];

  coverPositions.forEach((cp) => {
    const group = new THREE.Group();
    group.position.set(cp.x, cy, cp.z);
    if (cp.rotY) group.rotation.y = cp.rotY;
    
    if (cp.type === 'pillar') {
      // Concrete & Metal Cover Pillar
      const geo = new THREE.CylinderGeometry(1.4, 1.8, cp.h, 12);
      const mat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.4 });
      const pillar = new THREE.Mesh(geo, mat);
      pillar.position.y = cp.h / 2;
      group.add(pillar);
      
      // Top Glowing Beacon Ring
      const ringGeo = new THREE.CylinderGeometry(1.9, 1.5, 0.6, 12);
      const ringMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.6 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = cp.h + 0.3;
      group.add(ring);

      // Cover Signboard
      const signGeo = new THREE.BoxGeometry(2.4, 0.8, 0.2);
      const signMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
      const sign = new THREE.Mesh(signGeo, signMat);
      sign.position.set(0, cp.h - 1.2, 1.5);
      group.add(sign);
    } else if (cp.type === 'wall' || cp.type === 'shield') {
      // Reinforced Shield Barricade Wall
      const wallGeo = new THREE.BoxGeometry(7.0, cp.h, 1.4);
      const wallMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 });
      const wall = new THREE.Mesh(wallGeo, wallMat);
      wall.position.y = cp.h / 2;
      group.add(wall);
      
      // Energy Hazard Line
      const hazardGeo = new THREE.BoxGeometry(7.2, 0.7, 1.5);
      const hazardMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.5 });
      const hazard = new THREE.Mesh(hazardGeo, hazardMat);
      hazard.position.y = cp.h * 0.65;
      group.add(hazard);
    } else {
      // Ancient Ruin Fortress
      const rGeo = new THREE.BoxGeometry(9.0, cp.h, 3.0);
      const rMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 });
      const rMesh = new THREE.Mesh(rGeo, rMat);
      rMesh.position.y = cp.h / 2;
      group.add(rMesh);
    }
    
    group.name = "boss_arena_cover_spot";
    sceneGroup.add(group);
  });
};
`;

if (!enhancerCode.includes('window.__create3DOverheadHpBar')) {
  enhancerCode = helperFunctions + "\n" + enhancerCode;
}

fs.writeFileSync('public/game-enhancer.js', enhancerCode);
console.log("✅ Updated public/game-enhancer.js with Universal 3D Overhead HP Bar & Cover Spot helpers!");

// ----------------------------------------------------
// 2. PATCH game-bundle.js (Music Engine, Playlist & Boss Music Trigger)
// ----------------------------------------------------
let bundleCode = fs.readFileSync('public/game-bundle.js', 'utf8');

// Update playlist tracks list in VA component
bundleCode = bundleCode.replace(
  'children:"12 Parça"',
  'children:"15 Parça (Boss Müzikleri)"'
);

// Add boss battle tracks to playlist array A in game-bundle.js
const oldPlaylistArray = `{id:"retro_arcade",title:"8-Bit Retro Parkur 🎮",genre:"Chiptune Klasik Atari"}`;
const newPlaylistArray = `{id:"retro_arcade",title:"8-Bit Retro Parkur 🎮",genre:"Chiptune Klasik Atari"},
    {id:"boss_battle",title:"🔥 HYPER BOSS BATTALION",genre:"Heyecanlı & Epik Boss Savaşı"},
    {id:"boss_fury",title:"⚔️ DEVRASA PATRON SAVAŞI",genre:"Sert Rock & Tekno Boss Vuruşu"},
    {id:"cosmic_boss",title:"🌌 KOZMİK BOSS TEHLİKESİ",genre:"Görkemli Uzay Synth Boss"}`;

bundleCode = bundleCode.replace(oldPlaylistArray, newPlaylistArray);

// Update trackKeys in Vw constructor
const oldTrackKeys = `this.trackKeys=["hub","boncuk_cat","forest_temple","beehive","pelican_plains","snow_desert","space_realm","cyber_city","crystal_chimes","hero_march","night_breeze","retro_arcade"];`;
const newTrackKeys = `this.trackKeys=["hub","boncuk_cat","forest_temple","beehive","pelican_plains","snow_desert","space_realm","cyber_city","crystal_chimes","hero_march","night_breeze","retro_arcade","boss_battle","boss_fury","cosmic_boss"];`;

bundleCode = bundleCode.replace(oldTrackKeys, newTrackKeys);

// Ensure AudioContext resumes in initContext
bundleCode = bundleCode.replace(
  'if(this.ctx&&this.ctx.state==="suspended"){this.ctx.resume().catch(()=>{});}',
  'if(this.ctx){if(this.ctx.state==="suspended")this.ctx.resume().catch(()=>{});}'
);

// Inject boss battle track note patterns into music definitions in startMusic
const oldMusicDefs = `retro_arcade:{bpm:152,leadWave:"sawtooth",bassWave:"triangle",
        melody:[523.25,659.25,783.99,1046.5,783.99,659.25,523.25,392,440,554.37,659.25,880,659.25,554.37,440,329.63],
        bass:[130.81,164.81,196,261.63,110,138.59,164.81,220],
        chords:[[261.63,329.63,392],[220,277.18,329.63],[174.61,220,261.63],[196,246.94,293.66]]}`;

const newMusicDefs = `retro_arcade:{bpm:152,leadWave:"sawtooth",bassWave:"triangle",
        melody:[523.25,659.25,783.99,1046.5,783.99,659.25,523.25,392,440,554.37,659.25,880,659.25,554.37,440,329.63],
        bass:[130.81,164.81,196,261.63,110,138.59,164.81,220],
        chords:[[261.63,329.63,392],[220,277.18,329.63],[174.61,220,261.63],[196,246.94,293.66]]},
      boss_battle:{bpm:158,leadWave:"sawtooth",bassWave:"sawtooth",
        melody:[440,466.16,523.25,587.33,659.25,587.33,523.25,466.16,440,523.25,659.25,783.99,880,783.99,659.25,523.25],
        bass:[110,116.54,130.81,146.83,110,130.81,146.83,164.81],
        chords:[[220,261.63,329.63,440],[233.08,277.18,349.23,466.16],[261.63,329.63,392,523.25],[196,246.94,293.66,392]]},
      boss_fury:{bpm:162,leadWave:"sawtooth",bassWave:"square",
        melody:[523.25,587.33,659.25,783.99,880,1046.5,880,783.99,659.25,783.99,880,1046.5,1174.66,1046.5,880,783.99],
        bass:[130.81,146.83,164.81,196,220,261.63,220,196],
        chords:[[261.63,329.63,392,523.25],[293.66,349.23,440,587.33],[329.63,392,493.88,659.25],[220,261.63,329.63,440]]},
      cosmic_boss:{bpm:150,leadWave:"square",bassWave:"sawtooth",
        melody:[392,440,523.25,659.25,783.99,880,1046.5,880,783.99,659.25,523.25,440,392,523.25,659.25,783.99],
        bass:[98,110,130.81,164.81,196,220,261.63,196],
        chords:[[196,246.94,293.66,392],[220,261.63,329.63,440],[261.63,329.63,392,523.25],[174.61,220,261.63,349.23]]}`;

bundleCode = bundleCode.replace(oldMusicDefs, newMusicDefs);

fs.writeFileSync('public/game-bundle.js', bundleCode);
console.log("✅ Updated public/game-bundle.js with Boss Battle tracks and playlist!");

console.log("🎉 All core boss patch files updated successfully!");
