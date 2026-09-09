
function ensureLevelArrays(level) {
    if (!level) return;
    if (!level.enemies) level.enemies = [];
    if (!level.npcs) level.npcs = [];
    if (!level.artEasels) level.artEasels = [];
    if (!level.checkpoints) level.checkpoints = [];
    if (!level.colliders) level.colliders = [];
    if (!level.collectibles) level.collectibles = [];
    if (!level.jumpPads) level.jumpPads = [];
    if (!level.movingPlatforms) level.movingPlatforms = [];
    if (!level.fireballs) level.fireballs = [];
}

// --- GLOBAL POPULATION FLAGS ---
var dinoWorldPopulated = false;
var volcanoCavePopulated = false;
var underwaterPalacePopulated = false;
var sugarWorldPopulated = false;
var jokeroomsPopulated = false;
var ruinVillagePopulated = false;
var goldenSanctuaryPopulated = false;
var waterCavePopulated = false;
var beeDesertPopulated = false;

// --- UNIVERSAL LEVEL CLEANUP & PURGE FUNCTION (PREVENTS LEVELS FROM OVERLAPPING/MERGING) ---
window.__superBearPurgeScene = function(game) {
    if (!game) game = window.__superBearGame;
    if (!game || !game.scene) return;
    console.log("🧹 [Universal Purge] Deep cleaning previous scene objects, colliders and states...");
    if (game._returnPortals) {
        game._returnPortals.forEach(p => { if (p && p.parent) p.parent.remove(p); });
        game._returnPortals = [];
    }


    // 1. Clean up Space Realm if active
    if (window.__superBearSpaceLevels && typeof window.__superBearSpaceLevels.cleanUpSpaceRealm === 'function') {
        window.__superBearSpaceLevels.cleanUpSpaceRealm(game);
    }
    // 1b. Clean up Poneix Realm if active
    if (window.__superBearPoneixLevels && typeof window.__superBearPoneixLevels.cleanUpPoneixRealm === 'function') {
        window.__superBearPoneixLevels.cleanUpPoneixRealm(game);
    }
    // 1c. Clean up Phelix Realm if active
    if (window.__superBearPhelixLevels && typeof window.__superBearPhelixLevels.cleanUpPhelixRealm === 'function') {
        window.__superBearPhelixLevels.cleanUpPhelixRealm(game);
    }

    // 2. Hide all boss health bars
    if (typeof hideAllBossHealthBars === 'function') {
        hideAllBossHealthBars();
    }

    // 3. Reset all population flags
    dinoWorldPopulated = false;
    volcanoCavePopulated = false;
    underwaterPalacePopulated = false;
    sugarWorldPopulated = false;
    jokeroomsPopulated = false;
    ruinVillagePopulated = false;
    goldenSanctuaryPopulated = false;
    waterCavePopulated = false;
    beeDesertPopulated = false;

    // 4. Clean up currentLevel objects & colliders
    if (game.currentLevel) {
        if (game.currentLevel.mesh && game.currentLevel.mesh.parent) {
            game.currentLevel.mesh.parent.remove(game.currentLevel.mesh);
        }
        if (game.currentLevel.sceneGroup && game.currentLevel.sceneGroup.parent) {
            game.currentLevel.sceneGroup.parent.remove(game.currentLevel.sceneGroup);
        }
        if (game.currentLevel.invisibleWallMeshes && Array.isArray(game.currentLevel.invisibleWallMeshes)) {
            ((game.currentLevel && game.currentLevel.invisibleWallMeshes) || []).forEach(m => {
                if (m && m.parent) m.parent.remove(m);
            });
        }
        game.currentLevel.colliders = [];
        game.currentLevel.jumpPads = [];
        game.currentLevel.collectibles = [];
        game.currentLevel.checkpoints = [];
        game.currentLevel.enemies = [];
        game.currentLevel.npcs = [];
        game.currentLevel.movingPlatforms = [];
        game.currentLevel.artEasels = [];
        game.currentLevel.fireballs = [];
        game.currentLevel.invisibleWallMeshes = [];
        game.currentLevel.nextPortal = null;
    }

    // 5. Remove any leftover region meshes directly attached to scene
    if (game.scene && game.scene.children) {
        const toRemove = [];
        game.scene.children.forEach(child => {
            if (!child) return;
            // Never remove the player bear or primary world lights
            if (game.playerBear && (child === game.playerBear.root || child.name === 'player_bear')) return;
            if (child === game.ambientLight || child === game.sunLight || child === game.camera) return;
            if (child.name === 'merchant_cat') return;

            const name = child.name || '';
            if (
                name.startsWith('level_return_portal_') ||
                name.startsWith('space_') ||
                name.startsWith('cosmic_') ||
                name.startsWith('chunk_') ||
                name.startsWith('portal_') ||
                name.startsWith('checkpoint_') ||
                name.startsWith('jumppad_') ||
                name.startsWith('coin_') ||
                name.startsWith('npc_') ||
                name.startsWith('boss_') ||
                name.startsWith('laser_') ||
                name.startsWith('drone_') ||
                name.includes('jokerooms') ||
                name.includes('sugar') ||
                name.includes('volcano') ||
                name.includes('underwater') ||
                name.includes('dino') ||
                name.includes('ruin_village') ||
                name.includes('golden_sanctuary') ||
                name.includes('water_cave') ||
                name.includes('bee_desert') ||
                name.includes('earth_summit') ||
                name.includes('starfield') ||
                name.includes('asteroid') ||
                child.userData?.isLevelMesh ||
                child.userData?.isSpaceObject
            ) {
                toRemove.push(child);
            }
        });

        toRemove.forEach(c => {
            if (c.parent) c.parent.remove(c);
            else game.scene.remove(c);
        });
    }
};

// --- GOLD COIN BOSS HEALTH BAR UI ---
const goldCoinHpContainer = document.createElement('div');
goldCoinHpContainer.id = 'gold-coin-boss-hp-container';
goldCoinHpContainer.style.position = 'absolute';
goldCoinHpContainer.style.top = '36px';
goldCoinHpContainer.style.left = '50%';
goldCoinHpContainer.style.transform = 'translateX(-50%)';
goldCoinHpContainer.style.width = '420px';
goldCoinHpContainer.style.maxWidth = '85vw';
goldCoinHpContainer.style.backgroundColor = 'rgba(15, 23, 42, 0.85)';
goldCoinHpContainer.style.border = '2px solid #eab308';
goldCoinHpContainer.style.borderRadius = '14px';
goldCoinHpContainer.style.padding = '8px 12px';
goldCoinHpContainer.style.display = 'none';
goldCoinHpContainer.style.zIndex = '1000';
goldCoinHpContainer.style.boxShadow = '0 0 25px rgba(234, 179, 8, 0.45), 0 4px 15px rgba(0,0,0,0.8)';
goldCoinHpContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif';

const goldCoinHpTitle = document.createElement('div');
goldCoinHpTitle.style.display = 'flex';
goldCoinHpTitle.style.justifyContent = 'space-between';
goldCoinHpTitle.style.alignItems = 'center';
goldCoinHpTitle.style.color = '#fef08a';
goldCoinHpTitle.style.fontSize = '12px';
goldCoinHpTitle.style.fontWeight = 'bold';
goldCoinHpTitle.style.marginBottom = '6px';
goldCoinHpTitle.style.textShadow = '0 1px 3px rgba(0,0,0,0.8)';
goldCoinHpTitle.innerHTML = '<span>👑 İMPARATOR DEV ALTIN PARA</span><span id="gold-coin-hp-text">900 / 900</span>';
goldCoinHpContainer.appendChild(goldCoinHpTitle);

const goldCoinHpBarBg = document.createElement('div');
goldCoinHpBarBg.style.width = '100%';
goldCoinHpBarBg.style.height = '14px';
goldCoinHpBarBg.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
goldCoinHpBarBg.style.borderRadius = '8px';
goldCoinHpBarBg.style.overflow = 'hidden';
goldCoinHpBarBg.style.border = '1px solid rgba(234, 179, 8, 0.3)';

const goldCoinHpFill = document.createElement('div');
goldCoinHpFill.id = 'gold-coin-hp-fill';
goldCoinHpFill.style.width = '100%';
goldCoinHpFill.style.height = '100%';
goldCoinHpFill.style.background = 'linear-gradient(90deg, #ca8a04, #eab308, #fde047)';
goldCoinHpFill.style.borderRadius = '8px';
goldCoinHpFill.style.transition = 'width 0.25s ease-out, background 0.3s';
goldCoinHpBarBg.appendChild(goldCoinHpFill);
goldCoinHpContainer.appendChild(goldCoinHpBarBg);
document.body.appendChild(goldCoinHpContainer);

function updateGoldCoinBossHealthBar(hp, maxHp = 3000) {
  if (!goldCoinHpContainer) return;
  if (hp <= 0) {
    goldCoinHpContainer.style.display = 'none';
  } else {
    goldCoinHpContainer.style.display = 'block';
    const pct = Math.max(0, Math.min(100, (hp / maxHp) * 100));
    goldCoinHpFill.style.width = pct + '%';
    const hpText = document.getElementById('gold-coin-hp-text');
    let phaseBadge = '👑 [1. Faz: Altın Zırh]';
    if (pct <= 35) {
      phaseBadge = '⚡ [3. Faz: Altın Kıyamet]';
    } else if (pct <= 70) {
      phaseBadge = '🔥 [2. Faz: Altın Öfke]';
    }
    if (hpText) hpText.innerText = Math.max(0, Math.ceil(hp)) + ' / ' + maxHp + ' ' + phaseBadge;
    if (pct <= 35) {
      goldCoinHpFill.style.background = 'linear-gradient(90deg, #b91c1c, #ef4444, #f87171)';
      goldCoinHpContainer.style.borderColor = '#ef4444';
      goldCoinHpContainer.style.boxShadow = '0 0 25px rgba(239, 68, 68, 0.7)';
    } else if (pct <= 70) {
      goldCoinHpFill.style.background = 'linear-gradient(90deg, #ea580c, #f97316, #fb923c)';
      goldCoinHpContainer.style.borderColor = '#f97316';
      goldCoinHpContainer.style.boxShadow = '0 0 20px rgba(249, 115, 22, 0.6)';
    } else {
      goldCoinHpFill.style.background = 'linear-gradient(90deg, #ca8a04, #eab308, #fde047)';
      goldCoinHpContainer.style.borderColor = '#eab308';
      goldCoinHpContainer.style.boxShadow = '0 0 25px rgba(234, 179, 8, 0.45)';
    }
  }
}

console.log("🚀 Space Galaxy & Drawings Game Enhancer Loaded!");

// --- KRAKEN HEALTH BAR UI ---
const krakenHpContainer = document.createElement('div');
krakenHpContainer.id = 'kraken-hp-container';
krakenHpContainer.style.position = 'absolute';
krakenHpContainer.style.top = '40px';
krakenHpContainer.style.left = '50%';
krakenHpContainer.style.transform = 'translateX(-50%)';
krakenHpContainer.style.width = '400px';
krakenHpContainer.style.maxWidth = '80vw';
krakenHpContainer.style.height = '24px';
krakenHpContainer.style.backgroundColor = 'rgba(0,0,0,0.7)';
krakenHpContainer.style.border = '2px solid #a855f7';
krakenHpContainer.style.borderRadius = '12px';
krakenHpContainer.style.display = 'none'; // hidden by default
krakenHpContainer.style.zIndex = '1000';
krakenHpContainer.style.boxShadow = '0 0 15px rgba(168, 85, 247, 0.6)';
krakenHpContainer.style.overflow = 'hidden';

const krakenHpFill = document.createElement('div');
krakenHpFill.id = 'kraken-hp-fill';
krakenHpFill.style.width = '100%';
krakenHpFill.style.height = '100%';
krakenHpFill.style.backgroundColor = '#a855f7';
krakenHpFill.style.transition = 'width 0.3s ease-out, background-color 0.3s';
krakenHpFill.style.boxShadow = 'inset 0 0 10px rgba(255, 255, 255, 0.5)';

const krakenHpLabel = document.createElement('div');
krakenHpLabel.innerText = 'DEV KRAKEN';
krakenHpLabel.style.position = 'absolute';
krakenHpLabel.style.width = '100%';
krakenHpLabel.style.textAlign = 'center';
krakenHpLabel.style.color = '#fff';
krakenHpLabel.style.fontWeight = 'bold';
krakenHpLabel.style.fontFamily = 'sans-serif';
krakenHpLabel.style.top = '2px';
krakenHpLabel.style.fontSize = '14px';
krakenHpLabel.style.textShadow = '1px 1px 3px #000';
krakenHpLabel.style.pointerEvents = 'none';

krakenHpContainer.appendChild(krakenHpFill);
krakenHpContainer.appendChild(krakenHpLabel);

// Sadece document hazir oldugunda ekle
if (document.body) {
    document.body.appendChild(krakenHpContainer);
} else {
    window.addEventListener('DOMContentLoaded', () => document.body.appendChild(krakenHpContainer));
}

function updateKrakenHealthBar(hp, maxHp) {
    if (!krakenHpContainer) return;
    if (hp <= 0) {
        krakenHpContainer.style.display = 'none';
    } else {
        krakenHpContainer.style.display = 'block';
        const pct = (hp / maxHp) * 100;
        krakenHpFill.style.width = pct + '%';
        
        if (pct <= 35) {
            krakenHpFill.style.backgroundColor = '#ef4444'; // red
            krakenHpContainer.style.borderColor = '#ef4444';
            krakenHpContainer.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.6)';
        } else {
            krakenHpFill.style.backgroundColor = '#a855f7'; // purple
            krakenHpContainer.style.borderColor = '#a855f7';
            krakenHpContainer.style.boxShadow = '0 0 15px rgba(168, 85, 247, 0.6)';
        }
    }
}


// --- LOLLIPOP BOSS HEALTH BAR UI ---
const lollipopBossHpContainer = document.createElement('div');
lollipopBossHpContainer.id = 'lollipop-boss-hp-container';
lollipopBossHpContainer.style.position = 'absolute';
lollipopBossHpContainer.style.top = '44px';
lollipopBossHpContainer.style.left = '50%';
lollipopBossHpContainer.style.transform = 'translateX(-50%)';
lollipopBossHpContainer.style.width = '420px';
lollipopBossHpContainer.style.maxWidth = '85vw';
lollipopBossHpContainer.style.backgroundColor = 'rgba(15, 23, 42, 0.85)';
lollipopBossHpContainer.style.border = '2px solid #db2777';
lollipopBossHpContainer.style.borderRadius = '14px';
lollipopBossHpContainer.style.padding = '8px 12px';
lollipopBossHpContainer.style.display = 'none'; // hidden by default
lollipopBossHpContainer.style.zIndex = '1000';
lollipopBossHpContainer.style.boxShadow = '0 0 25px rgba(219, 39, 119, 0.6), 0 4px 15px rgba(0,0,0,0.8)';
lollipopBossHpContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif';

const lollipopBossHpTitle = document.createElement('div');
lollipopBossHpTitle.style.display = 'flex';
lollipopBossHpTitle.style.justifyContent = 'space-between';
lollipopBossHpTitle.style.alignItems = 'center';
lollipopBossHpTitle.style.color = '#fbcfe8';
lollipopBossHpTitle.style.fontSize = '12px';
lollipopBossHpTitle.style.fontWeight = 'bold';
lollipopBossHpTitle.style.marginBottom = '6px';
lollipopBossHpTitle.style.textShadow = '0 1px 3px rgba(0,0,0,0.8)';
lollipopBossHpTitle.innerHTML = '<span>🍭 LOLİPOP PATRONU</span><span id="lollipop-boss-hp-text">35 / 35</span>';
lollipopBossHpContainer.appendChild(lollipopBossHpTitle);

const lollipopBossHpBarBg = document.createElement('div');
lollipopBossHpBarBg.style.width = '100%';
lollipopBossHpBarBg.style.height = '14px';
lollipopBossHpBarBg.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
lollipopBossHpBarBg.style.borderRadius = '8px';
lollipopBossHpBarBg.style.overflow = 'hidden';
lollipopBossHpBarBg.style.border = '1px solid rgba(219, 39, 119, 0.3)';

const lollipopBossHpFill = document.createElement('div');
lollipopBossHpFill.id = 'lollipop-boss-hp-fill';
lollipopBossHpFill.style.width = '100%';
lollipopBossHpFill.style.height = '100%';
lollipopBossHpFill.style.background = 'linear-gradient(90deg, #db2777, #ec4899, #fbcfe8)';
lollipopBossHpFill.style.borderRadius = '8px';
lollipopBossHpFill.style.transition = 'width 0.25s ease-out, background 0.3s';
lollipopBossHpBarBg.appendChild(lollipopBossHpFill);
lollipopBossHpContainer.appendChild(lollipopBossHpBarBg);

if (document.body) {
    document.body.appendChild(lollipopBossHpContainer);
} else {
    window.addEventListener('DOMContentLoaded', () => document.body.appendChild(lollipopBossHpContainer));
}

function updateLollipopBossHealthBar(hp, maxHp) {
    if (!lollipopBossHpContainer) return;
    if (hp <= 0) {
        lollipopBossHpContainer.style.display = 'none';
    } else {
        lollipopBossHpContainer.style.display = 'block';
        const pct = Math.max(0, Math.min(100, (hp / maxHp) * 100));
        lollipopBossHpFill.style.width = pct + '%';
        
        const hpText = document.getElementById('lollipop-boss-hp-text');
        let phaseBadge = '🍬 [Şeker Kalkanı]';
        if (pct <= 35) {
            phaseBadge = '🔥 [Öfkeli Şeker Kıyameti]';
        } else if (pct <= 70) {
            phaseBadge = '⚡ [Hızlı Şeker Yağmuru]';
        }
        if (hpText) {
            hpText.innerText = `${Math.max(0, Math.ceil(hp))} / ${maxHp} ${phaseBadge}`;
        }

        if (pct <= 35) {
            lollipopBossHpFill.style.background = 'linear-gradient(90deg, #b91c1c, #ef4444, #f87171)';
            lollipopBossHpContainer.style.borderColor = '#ef4444';
            lollipopBossHpContainer.style.boxShadow = '0 0 25px rgba(239, 68, 68, 0.7)';
        } else if (pct <= 70) {
            lollipopBossHpFill.style.background = 'linear-gradient(90deg, #ea580c, #f97316, #fb923c)';
            lollipopBossHpContainer.style.borderColor = '#f97316';
            lollipopBossHpContainer.style.boxShadow = '0 0 20px rgba(249, 115, 22, 0.6)';
        } else {
            lollipopBossHpFill.style.background = 'linear-gradient(90deg, #db2777, #ec4899, #fbcfe8)';
            lollipopBossHpContainer.style.borderColor = '#db2777';
            lollipopBossHpContainer.style.boxShadow = '0 0 25px rgba(219, 39, 119, 0.6)';
        }
    }
}


// --- 15. BÖLÜM: SU MAĞARASI DEV SU EJDERHASI (ABYSSAL DRAGON) HEALTH BAR UI ---
const waterDragonHpContainer = document.createElement('div');
waterDragonHpContainer.id = 'water-dragon-hp-container';
waterDragonHpContainer.style.position = 'absolute';
waterDragonHpContainer.style.top = '44px';
waterDragonHpContainer.style.left = '50%';
waterDragonHpContainer.style.transform = 'translateX(-50%)';
waterDragonHpContainer.style.width = '450px';
waterDragonHpContainer.style.maxWidth = '88vw';
waterDragonHpContainer.style.backgroundColor = 'rgba(2, 6, 23, 0.9)';
waterDragonHpContainer.style.border = '2px solid #06b6d4';
waterDragonHpContainer.style.borderRadius = '14px';
waterDragonHpContainer.style.padding = '8px 14px';
waterDragonHpContainer.style.display = 'none'; // hidden by default
waterDragonHpContainer.style.zIndex = '1000';
waterDragonHpContainer.style.boxShadow = '0 0 30px rgba(6, 182, 212, 0.7), 0 4px 20px rgba(0,0,0,0.9)';
waterDragonHpContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif';

const waterDragonHpTitle = document.createElement('div');
waterDragonHpTitle.style.display = 'flex';
waterDragonHpTitle.style.justifyContent = 'space-between';
waterDragonHpTitle.style.alignItems = 'center';
waterDragonHpTitle.style.color = '#e0f2fe';
waterDragonHpTitle.style.fontSize = '12px';
waterDragonHpTitle.style.fontWeight = 'bold';
waterDragonHpTitle.style.marginBottom = '6px';
waterDragonHpTitle.style.textShadow = '0 1px 4px rgba(0,0,0,0.9)';
waterDragonHpTitle.innerHTML = '<span>🐉 DEV SU EJDERHASI (HYDROS)</span><span id="water-dragon-hp-text">45 / 45 🌊 [Karanlık Girdap Kalkanı]</span>';
waterDragonHpContainer.appendChild(waterDragonHpTitle);

const waterDragonHpBarBg = document.createElement('div');
waterDragonHpBarBg.style.width = '100%';
waterDragonHpBarBg.style.height = '14px';
waterDragonHpBarBg.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
waterDragonHpBarBg.style.borderRadius = '8px';
waterDragonHpBarBg.style.overflow = 'hidden';
waterDragonHpBarBg.style.border = '1px solid rgba(6, 182, 212, 0.4)';

const waterDragonHpFill = document.createElement('div');
waterDragonHpFill.id = 'water-dragon-hp-fill';
waterDragonHpFill.style.width = '100%';
waterDragonHpFill.style.height = '100%';
waterDragonHpFill.style.background = 'linear-gradient(90deg, #0284c7, #06b6d4, #38bdf8)';
waterDragonHpFill.style.borderRadius = '8px';
waterDragonHpFill.style.transition = 'width 0.25s ease-out, background 0.3s';
waterDragonHpBarBg.appendChild(waterDragonHpFill);
waterDragonHpContainer.appendChild(waterDragonHpBarBg);

if (document.body) {
    document.body.appendChild(waterDragonHpContainer);
} else {
    window.addEventListener('DOMContentLoaded', () => document.body.appendChild(waterDragonHpContainer));
}

function updateWaterDragonHealthBar(hp, maxHp = 45) {
    if (!waterDragonHpContainer) return;
    if (hp <= 0) {
        waterDragonHpContainer.style.display = 'none';
    } else {
        waterDragonHpContainer.style.display = 'block';
        const pct = Math.max(0, Math.min(100, (hp / maxHp) * 100));
        waterDragonHpFill.style.width = pct + '%';
        
        const hpText = document.getElementById('water-dragon-hp-text');
        let phaseBadge = '🌊 [Karanlık Girdap Kalkanı]';
        if (pct <= 35) {
            phaseBadge = '🔥 [Aydınlatan Öfkeli Kıyamet]';
        } else if (pct <= 70) {
            phaseBadge = '⚡ [Aydınlatan Alev Yağmuru]';
        }
        if (hpText) {
            hpText.innerText = `${Math.max(0, Math.ceil(hp))} / ${maxHp} ${phaseBadge}`;
        }

        if (pct <= 35) {
            waterDragonHpFill.style.background = 'linear-gradient(90deg, #ea580c, #ef4444, #f87171)';
            waterDragonHpContainer.style.borderColor = '#ef4444';
            waterDragonHpContainer.style.boxShadow = '0 0 30px rgba(239, 68, 68, 0.8), 0 0 10px #f97316';
        } else if (pct <= 70) {
            waterDragonHpFill.style.background = 'linear-gradient(90deg, #0284c7, #38bdf8, #f59e0b)';
            waterDragonHpContainer.style.borderColor = '#38bdf8';
            waterDragonHpContainer.style.boxShadow = '0 0 25px rgba(56, 189, 248, 0.7)';
        } else {
            waterDragonHpFill.style.background = 'linear-gradient(90deg, #0284c7, #06b6d4, #38bdf8)';
            waterDragonHpContainer.style.borderColor = '#06b6d4';
            waterDragonHpContainer.style.boxShadow = '0 0 30px rgba(6, 182, 212, 0.7)';
        }
    }
}

// --- 15. BÖLÜM: DEV ÇÖL TİMSAHI (SOBEK) CAN BARI ---
const desertCrocodileHpContainer = document.createElement('div');
desertCrocodileHpContainer.id = 'desert-crocodile-hp-container';
desertCrocodileHpContainer.style.position = 'fixed';
desertCrocodileHpContainer.style.top = '16px';
desertCrocodileHpContainer.style.left = '50%';
desertCrocodileHpContainer.style.transform = 'translateX(-50%)';
desertCrocodileHpContainer.style.width = 'min(92vw, 460px)';
desertCrocodileHpContainer.style.backgroundColor = 'rgba(26, 17, 3, 0.92)';
desertCrocodileHpContainer.style.border = '2px solid #f59e0b';
desertCrocodileHpContainer.style.borderRadius = '14px';
desertCrocodileHpContainer.style.padding = '8px 14px';
desertCrocodileHpContainer.style.display = 'none'; // hidden by default
desertCrocodileHpContainer.style.zIndex = '1000';
desertCrocodileHpContainer.style.boxShadow = '0 0 30px rgba(245, 158, 11, 0.75), 0 4px 20px rgba(0,0,0,0.9)';
desertCrocodileHpContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif';

const desertCrocodileHpTitle = document.createElement('div');
desertCrocodileHpTitle.style.display = 'flex';
desertCrocodileHpTitle.style.justifyContent = 'space-between';
desertCrocodileHpTitle.style.alignItems = 'center';
desertCrocodileHpTitle.style.color = '#fef3c7';
desertCrocodileHpTitle.style.fontSize = '12px';
desertCrocodileHpTitle.style.fontWeight = 'bold';
desertCrocodileHpTitle.style.marginBottom = '6px';
desertCrocodileHpTitle.style.textShadow = '0 1px 4px rgba(0,0,0,0.9)';
desertCrocodileHpTitle.innerHTML = '<span>🐊 DEV ÇÖL TİMSAHI (SOBEK)</span><span id="desert-crocodile-hp-text">50 / 50 🏜️ [Antik Zırh & Kum Kabuğu]</span>';
desertCrocodileHpContainer.appendChild(desertCrocodileHpTitle);

const desertCrocodileHpBarBg = document.createElement('div');
desertCrocodileHpBarBg.style.width = '100%';
desertCrocodileHpBarBg.style.height = '14px';
desertCrocodileHpBarBg.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
desertCrocodileHpBarBg.style.borderRadius = '8px';
desertCrocodileHpBarBg.style.overflow = 'hidden';
desertCrocodileHpBarBg.style.border = '1px solid rgba(245, 158, 11, 0.4)';

const desertCrocodileHpFill = document.createElement('div');
desertCrocodileHpFill.id = 'desert-crocodile-hp-fill';
desertCrocodileHpFill.style.width = '100%';
desertCrocodileHpFill.style.height = '100%';
desertCrocodileHpFill.style.background = 'linear-gradient(90deg, #d97706, #f59e0b, #eab308)';
desertCrocodileHpFill.style.borderRadius = '8px';
desertCrocodileHpFill.style.transition = 'width 0.25s ease-out, background 0.3s';
desertCrocodileHpBarBg.appendChild(desertCrocodileHpFill);
desertCrocodileHpContainer.appendChild(desertCrocodileHpBarBg);

if (document.body) {
    document.body.appendChild(desertCrocodileHpContainer);
} else {
    window.addEventListener('DOMContentLoaded', () => document.body.appendChild(desertCrocodileHpContainer));
}

function updateDesertCrocodileHealthBar(hp, maxHp = 50) {
    if (!desertCrocodileHpContainer) return;
    if (hp <= 0) {
        desertCrocodileHpContainer.style.display = 'none';
    } else {
        desertCrocodileHpContainer.style.display = 'block';
        const pct = Math.max(0, Math.min(100, (hp / maxHp) * 100));
        desertCrocodileHpFill.style.width = pct + '%';
        
        const hpText = document.getElementById('desert-crocodile-hp-text');
        let phaseBadge = '🏜️ [Antik Zırh & Kum Kabuğu]';
        if (pct <= 35) {
            phaseBadge = '🔥 [Kıyamet Kum Fırtınası]';
        } else if (pct <= 70) {
            phaseBadge = '⚡ [Öfkeli Çöl Isırığı & Kuyruk Darbesi]';
        }
        if (hpText) {
            hpText.innerText = `${Math.max(0, Math.ceil(hp))} / ${maxHp} ${phaseBadge}`;
        }

        if (pct <= 35) {
            desertCrocodileHpFill.style.background = 'linear-gradient(90deg, #b91c1c, #dc2626, #ef4444)';
            desertCrocodileHpContainer.style.borderColor = '#ef4444';
            desertCrocodileHpContainer.style.boxShadow = '0 0 30px rgba(239, 68, 68, 0.85), 0 0 10px #f97316';
        } else if (pct <= 70) {
            desertCrocodileHpFill.style.background = 'linear-gradient(90deg, #ea580c, #f59e0b, #eab308)';
            desertCrocodileHpContainer.style.borderColor = '#f59e0b';
            desertCrocodileHpContainer.style.boxShadow = '0 0 25px rgba(245, 158, 11, 0.8)';
        } else {
            desertCrocodileHpFill.style.background = 'linear-gradient(90deg, #d97706, #f59e0b, #eab308)';
            desertCrocodileHpContainer.style.borderColor = '#f59e0b';
            desertCrocodileHpContainer.style.boxShadow = '0 0 30px rgba(245, 158, 11, 0.75)';
        }
    }
}

// --- CENTRAL HIDE ALL BOSS HEALTH BARS HELPER ---
function hideAllBossHealthBars() {
    if (typeof updateGoldCoinBossHealthBar === 'function') updateGoldCoinBossHealthBar(0);
    if (typeof updateKrakenHealthBar === 'function') updateKrakenHealthBar(0, 100);
    if (typeof updateLollipopBossHealthBar === 'function') updateLollipopBossHealthBar(0, 35);
    if (typeof updateWaterDragonHealthBar === 'function') updateWaterDragonHealthBar(0, 45);
    if (typeof updateDesertCrocodileHealthBar === 'function') updateDesertCrocodileHealthBar(0, 50);
    if (typeof goldCoinHpContainer !== 'undefined' && goldCoinHpContainer) goldCoinHpContainer.style.display = 'none';
    if (typeof krakenHpContainer !== 'undefined' && krakenHpContainer) krakenHpContainer.style.display = 'none';
    if (typeof lollipopBossHpContainer !== 'undefined' && lollipopBossHpContainer) lollipopBossHpContainer.style.display = 'none';
    if (typeof waterDragonHpContainer !== 'undefined' && waterDragonHpContainer) waterDragonHpContainer.style.display = 'none';
    if (typeof desertCrocodileHpContainer !== 'undefined' && desertCrocodileHpContainer) desertCrocodileHpContainer.style.display = 'none';
}
window.hideAllBossHealthBars = hideAllBossHealthBars;

// --- SCREEN SHAKE SYSTEM ---
const style = document.createElement('style');
style.innerHTML = `
  @keyframes krakenScreenShake {
    0% { transform: translate(1px, 1px) rotate(0deg); }
    10% { transform: translate(-3px, -4px) rotate(-1deg); }
    20% { transform: translate(-5px, 0px) rotate(2deg); }
    30% { transform: translate(5px, 4px) rotate(0deg); }
    40% { transform: translate(3px, -3px) rotate(2deg); }
    50% { transform: translate(-3px, 4px) rotate(-1deg); }
    60% { transform: translate(-5px, 3px) rotate(0deg); }
    70% { transform: translate(5px, 3px) rotate(-2deg); }
    80% { transform: translate(-3px, -3px) rotate(1deg); }
    90% { transform: translate(3px, 4px) rotate(0deg); }
    100% { transform: translate(1px, -2px) rotate(-1deg); }
  }
  .kraken-shake {
    animation: krakenScreenShake 0.6s cubic-bezier(.36,.07,.19,.97) both;
  }
`;
document.head.appendChild(style);

function triggerScreenShake() {
    const root = document.getElementById('root');
    if (root) {
        root.classList.remove('kraken-shake');
        void root.offsetWidth; // trigger reflow
        root.classList.add('kraken-shake');
        setTimeout(() => {
            root.classList.remove('kraken-shake');
        }, 600);
    }
}


// --- KRAKEN AUDIO SYSTEM ---
let krakenAudioCtx = null;
function initKrakenAudio() {
    if (!krakenAudioCtx) {
        try {
            krakenAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn("AudioContext not supported");
        }
    }
    if (krakenAudioCtx && krakenAudioCtx.state === 'suspended') {
        krakenAudioCtx.resume();
    }
}

function playKrakenSound(type) {
    initKrakenAudio();
    if (!krakenAudioCtx) return;
    
    const osc = krakenAudioCtx.createOscillator();
    const gain = krakenAudioCtx.createGain();
    osc.connect(gain);
    gain.connect(krakenAudioCtx.destination);
    
    const now = krakenAudioCtx.currentTime;
    
    if (type === 'shoot') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
    } else if (type === 'ground') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.4);
        gain.gain.setValueAtTime(0.7, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
    } else if (type === 'warn') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(700, now + 0.2);
        osc.frequency.linearRampToValueAtTime(200, now + 0.8);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.4, now + 0.2);
        gain.gain.linearRampToValueAtTime(0, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
    }
}


let spaceState = {
  aliensRescued: 0,
  maxAliens: 30,
  companionActive: true,
  currentRegion: 'hub',
  lairUnlocked: false
};

let spaceObjects = [];
let lasers = [];
let sprayDecals = [];
let alienCompanionGroup = null;
let playerBearRef = null;
let gameRef = null;

function notifySpaceState() {
  window.dispatchEvent(new CustomEvent('superbear:space-state-update', { detail: { ...spaceState } }));
}

// Helper to create glowing materials
function createGlowMat(colorHex, emissiveHex = colorHex, opacity = 1) {
  return new window.THREE.MeshStandardMaterial({
    color: colorHex,
    emissive: emissiveHex,
    emissiveIntensity: 0.6,
    roughness: 0.2,
    metalness: 0.3,
    transparent: opacity < 1,
    opacity: opacity
  });
}

// Build a super cute, highly detailed 3D Pelican Model
function createCutePelicanMesh(THREE, isBoss = false) {
  const pelicanGroup = new THREE.Group();
  pelicanGroup.name = isBoss ? 'cute_pelican_boss' : 'cute_pelican_piko';

  // Materials
  const featherWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
  const featherChest = new THREE.MeshStandardMaterial({ color: 0xfff1f2, roughness: 0.5 });
  const featherSkyBlue = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.4 });
  const orangeBeak = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.3, metalness: 0.1 });
  const pouchMat = new THREE.MeshStandardMaterial({ color: 0xfb923c, roughness: 0.4, transparent: true, opacity: 0.95 });
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1 });
  const highlightMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
  const cheekMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.4 });
  const sailorNavy = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.3 });
  const sailorGold = createGlowMat(0xfcb316, 0xfde047);
  const woodDockMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });

  // 1. Plump Body (Gövde)
  const bodyGeo = new THREE.SphereGeometry(1.4, 20, 20);
  const bodyMesh = new THREE.Mesh(bodyGeo, featherWhite);
  bodyMesh.scale.set(1.0, 1.15, 1.3);
  bodyMesh.position.y = 1.6;
  pelicanGroup.add(bodyMesh);

  // Soft Chest Patch
  const chestGeo = new THREE.SphereGeometry(1.0, 16, 16);
  const chestMesh = new THREE.Mesh(chestGeo, featherChest);
  chestMesh.scale.set(0.95, 1.1, 0.6);
  chestMesh.position.set(0, 1.5, -0.8);
  pelicanGroup.add(chestMesh);

  // 2. Pelican Curved S-Neck
  const neckGeo = new THREE.CylinderGeometry(0.5, 0.75, 1.4, 16);
  const neckMesh = new THREE.Mesh(neckGeo, featherWhite);
  neckMesh.position.set(0, 2.7, -0.4);
  neckMesh.rotation.x = -0.25;
  pelicanGroup.add(neckMesh);

  // 3. Cute Head (Kafa)
  const headGroup = new THREE.Group();
  headGroup.name = 'pelican_head_group';
  headGroup.position.set(0, 3.6, -0.6);

  const headGeo = new THREE.SphereGeometry(1.0, 20, 20);
  const headMesh = new THREE.Mesh(headGeo, featherWhite);
  headGroup.add(headMesh);

  // Cute Feather Tuft / Crest on back of head (Ibik)
  for (let i = 0; i < 3; i++) {
    const tuftGeo = new THREE.ConeGeometry(0.18, 0.6, 8);
    const tuft = new THREE.Mesh(tuftGeo, featherWhite);
    tuft.position.set((i - 1) * 0.2, 0.95, 0.5);
    tuft.rotation.x = 0.5 + i * 0.1;
    headGroup.add(tuft);
  }

  // 4. UNMISTAKABLE PELICAN POUCH BEAK (KESE GAGA)
  const upperBeakGeo = new THREE.BoxGeometry(0.65, 0.22, 2.4);
  const upperBeak = new THREE.Mesh(upperBeakGeo, orangeBeak);
  upperBeak.position.set(0, -0.05, -1.4);
  headGroup.add(upperBeak);

  // Beak Hook at tip
  const hookGeo = new THREE.ConeGeometry(0.12, 0.35, 8);
  const hook = new THREE.Mesh(hookGeo, orangeBeak);
  hook.position.set(0, -0.15, -2.55);
  hook.rotation.x = Math.PI;
  headGroup.add(hook);

  // Giant Pelikan Pouch (Pelikan Kese Torbası) - Deep curved pouch under beak!
  const pouchGeo = new THREE.SphereGeometry(0.75, 16, 16);
  const pouchMesh = new THREE.Mesh(pouchGeo, pouchMat);
  pouchMesh.name = 'pelican_pouch';
  pouchMesh.scale.set(0.75, 1.35, 1.9);
  pouchMesh.position.set(0, -0.65, -1.1);
  headGroup.add(pouchMesh);

  // 5. Cute Kawaii Eyes & Rosy Cheeks
  const eyeGeo = new THREE.SphereGeometry(0.22, 14, 14);
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(-0.52, 0.2, -0.6);
  headGroup.add(eyeL);

  const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
  eyeR.position.set(0.52, 0.2, -0.6);
  headGroup.add(eyeR);

  // Pupil Highlight Specks for Kawaii Look
  const highlightGeo = new THREE.SphereGeometry(0.08, 8, 8);
  const highL = new THREE.Mesh(highlightGeo, highlightMat);
  highL.position.set(-0.58, 0.26, -0.76);
  headGroup.add(highL);

  const highR = new THREE.Mesh(highlightGeo, highlightMat);
  highR.position.set(0.58, 0.26, -0.76);
  headGroup.add(highR);

  // Rosy Cheeks
  const cheekGeo = new THREE.SphereGeometry(0.2, 12, 12);
  const cheekL = new THREE.Mesh(cheekGeo, cheekMat);
  cheekL.scale.set(1.0, 0.6, 0.4);
  cheekL.position.set(-0.75, -0.1, -0.5);
  headGroup.add(cheekL);

  const cheekR = new THREE.Mesh(cheekGeo, cheekMat);
  cheekR.scale.set(1.0, 0.6, 0.4);
  cheekR.position.set(0.75, -0.1, -0.5);
  headGroup.add(cheekR);

  // 6. Cute Sailor Captain Cap (Kaptan Şapkası)
  const capGroup = new THREE.Group();
  capGroup.position.set(0, 0.95, -0.1);

  const capBaseGeo = new THREE.CylinderGeometry(0.7, 0.75, 0.35, 16);
  const capBase = new THREE.Mesh(capBaseGeo, sailorNavy);
  capGroup.add(capBase);

  const capBrimGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.08, 16);
  const capBrim = new THREE.Mesh(capBrimGeo, sailorNavy);
  capBrim.position.set(0, -0.18, -0.15);
  capBrim.rotation.x = 0.2;
  capGroup.add(capBrim);

  const capGoldBand = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.08, 16), sailorGold);
  capGoldBand.position.y = -0.1;
  capGroup.add(capGoldBand);

  // Small White Feather on Cap
  const featherBadge = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.5, 8), featherWhite);
  featherBadge.position.set(0, 0.3, -0.65);
  featherBadge.rotation.x = -0.4;
  capGroup.add(featherBadge);

  headGroup.add(capGroup);
  pelicanGroup.add(headGroup);

  // 7. Fluffy Wings (Left & Right)
  const wingGroupL = new THREE.Group();
  wingGroupL.name = 'boss_left_wing';
  wingGroupL.position.set(-1.2, 1.8, 0);

  const wingMeshL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.4, 2.0), featherWhite);
  wingMeshL.position.set(-0.3, -0.2, 0.2);
  wingMeshL.rotation.z = 0.3;
  wingGroupL.add(wingMeshL);

  const wingTipL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.8, 1.2), featherSkyBlue);
  wingTipL.position.set(-0.5, -0.7, 0.6);
  wingTipL.rotation.z = 0.4;
  wingGroupL.add(wingTipL);

  pelicanGroup.add(wingGroupL);

  const wingGroupR = new THREE.Group();
  wingGroupR.name = 'boss_right_wing';
  wingGroupR.position.set(1.2, 1.8, 0);

  const wingMeshR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.4, 2.0), featherWhite);
  wingMeshR.position.set(0.3, -0.2, 0.2);
  wingMeshR.rotation.z = -0.3;
  wingGroupR.add(wingMeshR);

  const wingTipR = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.8, 1.2), featherSkyBlue);
  wingTipR.position.set(0.5, -0.7, 0.6);
  wingTipR.rotation.z = -0.4;
  wingGroupR.add(wingTipR);

  pelicanGroup.add(wingGroupR);

  // 8. Fan Tail (Kuyruk)
  const tailGroup = new THREE.Group();
  tailGroup.position.set(0, 1.5, 1.2);
  for (let t = -2; t <= 2; t++) {
    const tFeather = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.9, 8), featherWhite);
    tFeather.position.set(t * 0.2, 0.2, t * 0.05);
    tFeather.rotation.x = 1.1;
    tFeather.rotation.y = t * 0.15;
    tailGroup.add(tFeather);
  }
  pelicanGroup.add(tailGroup);

  // 9. Webbed Orange Feet (Perdeli Ayaklar)
  const footL = new THREE.Group();
  footL.position.set(-0.55, 0.3, -0.2);
  const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.7, 8), orangeBeak);
  footL.add(legL);
  const webL = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.06, 0.8), orangeBeak);
  webL.position.set(0, -0.35, -0.2);
  footL.add(webL);
  pelicanGroup.add(footL);

  const footR = new THREE.Group();
  footR.position.set(0.55, 0.3, -0.2);
  const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.7, 8), orangeBeak);
  footR.add(legR);
  const webR = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.06, 0.8), orangeBeak);
  webR.position.set(0, -0.35, -0.2);
  footR.add(webR);
  pelicanGroup.add(footR);

  // 10. If NPC (not boss), put on wooden pier with bucket of fish & floating badge!
  if (!isBoss) {
    const pierGeo = new THREE.BoxGeometry(3.5, 0.4, 3.5);
    const pierMesh = new THREE.Mesh(pierGeo, woodDockMat);
    pierMesh.position.set(0, -0.2, 0);
    pelicanGroup.add(pierMesh);

    // Fish Bucket
    const bucketGeo = new THREE.CylinderGeometry(0.4, 0.3, 0.7, 12);
    const bucketMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.4 });
    const bucket = new THREE.Mesh(bucketGeo, bucketMat);
    bucket.position.set(-1.2, 0.35, -0.6);
    pelicanGroup.add(bucket);

    // Fresh Fish inside bucket
    const fishGeo = new THREE.ConeGeometry(0.12, 0.5, 8);
    const fishMat = createGlowMat(0x0284c7, 0x38bdf8);
    const fish1 = new THREE.Mesh(fishGeo, fishMat);
    fish1.position.set(-1.2, 0.7, -0.6);
    fish1.rotation.z = 0.5;
    pelicanGroup.add(fish1);

    const fish2 = new THREE.Mesh(fishGeo, fishMat);
    fish2.position.set(-1.05, 0.65, -0.7);
    fish2.rotation.z = -0.3;
    pelicanGroup.add(fish2);

    // Floating 3D Badge Overhead
    const badgeGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const badgeMat = createGlowMat(0x38bdf8, 0x7dd3fc);
    const badge = new THREE.Mesh(badgeGeo, badgeMat);
    badge.name = 'pelican_floating_badge';
    badge.position.set(0, 5.2, 0);
    pelicanGroup.add(badge);
  }

  return pelicanGroup;
}

// Add platform with optional collision bounds
function addPlatform(parent, x, y, z, w, h, d, color, opacity = 1) {
  const geo = new window.THREE.BoxGeometry(w, h, d);
  const mat = createGlowMat(color, color, opacity);
  const mesh = new window.THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  if (parent && parent.add) { parent.add(mesh); }
  spaceObjects.push(mesh);

  // Always add collision bounds
  if (gameRef && gameRef.currentLevel && gameRef.currentLevel.collisionBounds) {
    gameRef.currentLevel.collisionBounds.push({
      min: { x: x - w / 2, y: y - h / 2, z: z - d / 2 },
      max: { x: x + w / 2, y: y + h / 2, z: z + d / 2 }
    });
  }
  return mesh;
}

// Build 3D Green Alien Companion
function createAlienMesh() {
  const group = new window.THREE.Group();
  
  // Alien Head
  const headGeo = new window.THREE.SphereGeometry(0.5, 16, 16);
  const headMat = createGlowMat(0x10b981, 0x059669); // Emerald Green
  const head = new window.THREE.Mesh(headGeo, headMat);
  group.add(head);

  // Big Eyes
  const eyeGeo = new window.THREE.SphereGeometry(0.18, 12, 12);
  const eyeMat = new window.THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.1 });
  
  const leftEye = new window.THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.18, 0.1, 0.4);
  group.add(leftEye);

  const rightEye = new window.THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.18, 0.1, 0.4);
  group.add(rightEye);

  // Antennae
  const antGeo = new window.THREE.CylinderGeometry(0.03, 0.03, 0.4, 8);
  const antMat = createGlowMat(0x34d399, 0x10b981);
  
  const antLeft = new window.THREE.Mesh(antGeo, antMat);
  antLeft.position.set(-0.25, 0.55, 0);
  antLeft.rotation.z = -0.3;
  group.add(antLeft);

  const antRight = new window.THREE.Mesh(antGeo, antMat);
  antRight.position.set(0.25, 0.55, 0);
  antRight.rotation.z = 0.3;
  group.add(antRight);

  // Antenna Orbs
  const orbGeo = new window.THREE.SphereGeometry(0.09, 8, 8);
  const orbMat = createGlowMat(0x6ee7b7, 0x34d399);
  
  const orbL = new window.THREE.Mesh(orbGeo, orbMat);
  orbL.position.set(-0.35, 0.75, 0);
  group.add(orbL);

  const orbR = new window.THREE.Mesh(orbGeo, orbMat);
  orbR.position.set(0.35, 0.75, 0);
  group.add(orbR);

  // Small Body
  const bodyGeo = new window.THREE.CylinderGeometry(0.2, 0.3, 0.5, 12);
  const body = new window.THREE.Mesh(bodyGeo, headMat);
  body.position.y = -0.4;
  group.add(body);

  group.scale.set(0.8, 0.8, 0.8);
  return group;
}

// Build 3D Space Galaxy Hub & 6 Planets from Drawing 1 & 2
function buildSpaceGalaxyWorld(scene) {
  if (!scene || !scene.add) return;
  console.log("🌌 Building 3D Space Galaxy Hub & Drawings Features...");

  const spaceHubGroup = new window.THREE.Group();
  spaceHubGroup.position.set(0, 1000, 0); // Ayı köyü üstü
  scene.add(spaceHubGroup);
  spaceObjects.push(spaceHubGroup);

  // Massive ground platform for the space area (Thicker and larger for visibility)
  addPlatform(spaceHubGroup, 0, -10, 0, 800, 10, 800, 0x1e293b); // Massive floor (relative to group)
  
  // Add a point light to make it visible
  const platformLight = new window.THREE.PointLight(0xffffff, 2, 2000);
  platformLight.position.set(0, 50, 0); // relative to group
  spaceHubGroup.add(platformLight);
  spaceObjects.push(platformLight);
  
  // Base platform
  addPlatform(spaceHubGroup, 0, 0, 0, 60, 4, 60, 0x475569); // Base platform (relative to group)

  // Castle Steps to climb up (Larger steps for easier climbing)
  for (let i = 0; i < 15; i++) {
    addPlatform(spaceHubGroup, 0, 0 + i * 2, 30 + i * 2, 30, 2, 8, 0x94a3b8);
  }

  // 2. Central Wormhole Portal
  const holeGeo = new window.THREE.TorusGeometry(12, 2.5, 16, 48);
  const holeMat = createGlowMat(0x7e22ce, 0x9333ea);
  const holeMesh = new window.THREE.Mesh(holeGeo, holeMat);
  holeMesh.rotation.x = Math.PI / 2;
  holeMesh.position.set(0, 20, 0); // Relative to group
  spaceHubGroup.add(holeMesh);

  // Accretion Disk particles
  const particleGeo = new window.THREE.BufferGeometry();
  const particleCount = 200;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const rad = 14 + Math.random() * 12;
    positions[i * 3] = Math.cos(angle) * rad;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 3;
    positions[i * 3 + 2] = Math.sin(angle) * rad;
  }
  particleGeo.setAttribute('position', new window.THREE.BufferAttribute(positions, 3));
  const particleMat = new window.THREE.PointsMaterial({
    color: 0xc084fc,
    size: 0.8,
    transparent: true,
    opacity: 0.8
  });
  const accretionDisk = new window.THREE.Points(particleGeo, particleMat);
  accretionDisk.position.set(0, 20, 0); // Relative to group
  spaceHubGroup.add(accretionDisk);

  // 3. Meteoritler & Krater Gezegeni
  const craterX = -60, craterY = 1030, craterZ = 0;
  addPlatform(scene, craterX, craterY, craterZ, 35, 3, 35, 0x991b1b);
  
  // Add crater rocks & steppable lava platforms
  for (let i = 0; i < 6; i++) {
    const rx = craterX + (Math.random() - 0.5) * 24;
    const rz = craterZ + (Math.random() - 0.5) * 24;
    addPlatform(scene, rx, craterY + 2, rz, 6, 4, 6, 0xef4444);
  }
  // Ascending steppable lava stepping platforms
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const px = craterX + Math.cos(angle) * 16;
    const pz = craterZ + Math.sin(angle) * 16;
    addPlatform(scene, px, craterY + 1.5 + i * 1.5, pz, 7, 2, 7, 0xf97316);
  }

  // 4. Galaksi Merkezi (Cyan Core)
  const galX = 60, galY = 1030, galZ = 0;
  addPlatform(scene, galX, galY, galZ, 35, 3, 35, 0x0891b2);
  
  // Floating Cyan Crystal Stars
  for (let i = 0; i < 5; i++) {
    const cx = galX + (Math.random() - 0.5) * 20;
    const cz = galZ + (Math.random() - 0.5) * 20;
    const cryGeo = new window.THREE.OctahedronGeometry(2);
    const cryMat = createGlowMat(0x06b6d4, 0x22d3ee);
    const cryMesh = new window.THREE.Mesh(cryGeo, cryMat);
    cryMesh.position.set(cx, galY + 5 + i * 2, cz);
    scene.add(cryMesh);
    spaceObjects.push(cryMesh);
  }

  // 5. Yeşil Yaşam Gezegeni
  const greenX = 0, greenY = 1040, greenZ = -80;
  addPlatform(scene, greenX, greenY, greenZ, 45, 3, 45, 0x059669);

  // Friendly Alien NPCs
  for (let i = 0; i < 3; i++) {
    const alien = createAlienMesh();
    alien.position.set(greenX - 10 + i * 10, greenY + 2.5, greenZ - 5);
    scene.add(alien);
    spaceObjects.push(alien);
  }

  // 6. Mor Ayı'nın İni
  const lairX = 0, lairY = 1060, lairZ = -160;
  addPlatform(scene, lairX, lairY, lairZ, 50, 4, 50, 0x581c87);

  // Glowing Purple Pillars
  for (let i = 0; i < 4; i++) {
    const px = lairX + (i < 2 ? -20 : 20);
    const pz = lairZ + (i % 2 === 0 ? -20 : 20);
    const pilGeo = new window.THREE.CylinderGeometry(2, 2.5, 18, 12);
    const pilMat = createGlowMat(0xa855f7, 0xc084fc);
    const pillar = new window.THREE.Mesh(pilGeo, pilMat);
    pillar.position.set(px, lairY + 9, pz);
    scene.add(pillar);
    spaceObjects.push(pillar);
  }

  // Boss Avatar
  const bossGroup = new window.THREE.Group();
  bossGroup.position.set(lairX, lairY + 5, lairZ);
  const bossBody = new window.THREE.Mesh(
    new window.THREE.SphereGeometry(4, 16, 16),
    createGlowMat(0x7e22ce, 0xa855f7)
  );
  bossGroup.add(bossBody);

  const crown = new window.THREE.Mesh(
    new window.THREE.ConeGeometry(2, 3, 5),
    createGlowMat(0xf59e0b, 0xfcd34d)
  );
  crown.position.y = 4.5;
  bossGroup.add(crown);

  scene.add(bossGroup);
  spaceObjects.push(bossGroup);

  // 7. Flying Saucer Rocket
  const saucerGroup = new window.THREE.Group();
  saucerGroup.position.set(40, 1035, -10);
  
  const ringMesh = new window.THREE.Mesh(
    new window.THREE.CylinderGeometry(8, 8, 1, 24),
    createGlowMat(0x0284c7, 0x38bdf8)
  );
  saucerGroup.add(ringMesh);

  const domeMesh = new window.THREE.Mesh(
    new window.THREE.SphereGeometry(4, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    createGlowMat(0x38bdf8, 0x7dd3fc, 0.6)
  );
  domeMesh.position.y = 0.5;
  saucerGroup.add(domeMesh);

  scene.add(saucerGroup);
  spaceObjects.push(saucerGroup);

  // 8. Interactive Drawing Pedestal
  const bannerGroup = new window.THREE.Group();
  bannerGroup.position.set(0, 1022, 20);

  const standMesh = new window.THREE.Mesh(
    new window.THREE.CylinderGeometry(0.5, 1, 4, 12),
    createGlowMat(0x3b82f6, 0x60a5fa)
  );
  standMesh.position.y = 2;
  bannerGroup.add(standMesh);

  const canvasBoard = new window.THREE.Mesh(
    new window.THREE.BoxGeometry(6, 4, 0.4),
    createGlowMat(0xf59e0b, 0xfcd34d)
  );
  canvasBoard.position.set(0, 5, 0);
  bannerGroup.add(canvasBoard);
  
  // Village Border Wooden Fence & Stone Gateway (Central path open to mountains)
  const barrierFenceGroup = new window.THREE.Group();
  barrierFenceGroup.position.set(0, 0, -50);
  
  const fenceMat = new window.THREE.MeshStandardMaterial({ color: 0x5c2b08, roughness: 0.8 });
  const stonePillarMat = new window.THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.85 });

  // Gateway Stone Pillars (Sol ve Sağ Giriş Sütunları)
  [-5, 5].forEach(gx => {
    const pillar = new window.THREE.Mesh(new window.THREE.CylinderGeometry(0.5, 0.6, 4.5, 8), stonePillarMat);
    pillar.position.set(gx, 2.25, 0);
    barrierFenceGroup.add(pillar);

    // Lantern on top
    const lamp = new window.THREE.Mesh(new window.THREE.BoxGeometry(0.5, 0.7, 0.5), createGlowMat(0xf59e0b, 0xfcd34d));
    lamp.position.set(gx, 4.8, 0);
    barrierFenceGroup.add(lamp);
  });

  // Gateway Overhead Wooden Beam & Sign (Dağlar Geçidi Takı)
  const gateBeam = new window.THREE.Mesh(new window.THREE.BoxGeometry(11, 0.7, 0.7), fenceMat);
  gateBeam.position.set(0, 4.4, 0);
  barrierFenceGroup.add(gateBeam);

  const gateSignCanvas = document.createElement('canvas');
  gateSignCanvas.width = 512;
  gateSignCanvas.height = 120;
  const gsCtx = gateSignCanvas.getContext('2d');
  if (gsCtx) {
    gsCtx.fillStyle = '#451a03';
    gsCtx.fillRect(0, 0, 512, 120);
    gsCtx.strokeStyle = '#f59e0b';
    gsCtx.lineWidth = 6;
    gsCtx.strokeRect(4, 4, 504, 112);
    gsCtx.fillStyle = '#ffffff';
    gsCtx.font = 'bold 24px sans-serif';
    gsCtx.textAlign = 'center';
    gsCtx.fillText('🏔️ KUZEY DAĞLARI GEÇİDİ ➔', 256, 48);
    gsCtx.fillStyle = '#fef08a';
    gsCtx.font = '18px sans-serif';
    gsCtx.fillText('Moris\'in Gizli Dağ İni İleride!', 256, 92);
  }
  const gateSignTex = new window.THREE.CanvasTexture(gateSignCanvas);
  const gateSignMesh = new window.THREE.Mesh(new window.THREE.PlaneGeometry(5.0, 1.2), new window.THREE.MeshBasicMaterial({ map: gateSignTex }));
  gateSignMesh.position.set(0, 4.4, 0.4);
  barrierFenceGroup.add(gateSignMesh);

  // Wooden Fences Spanning Left & Right
  for (let fx = 6; fx <= 50; fx += 4) {
    const postR = new window.THREE.Mesh(new window.THREE.CylinderGeometry(0.15, 0.18, 2.2, 6), fenceMat);
    postR.position.set(fx, 1.1, 0);
    barrierFenceGroup.add(postR);

    const railR = new window.THREE.Mesh(new window.THREE.BoxGeometry(4.0, 0.2, 0.15), fenceMat);
    railR.position.set(fx - 2, 1.4, 0);
    barrierFenceGroup.add(railR);

    const postL = new window.THREE.Mesh(new window.THREE.CylinderGeometry(0.15, 0.18, 2.2, 6), fenceMat);
    postL.position.set(-fx, 1.1, 0);
    barrierFenceGroup.add(postL);

    const railL = new window.THREE.Mesh(new window.THREE.BoxGeometry(4.0, 0.2, 0.15), fenceMat);
    railL.position.set(-fx + 2, 1.4, 0);
    barrierFenceGroup.add(railL);
  }

  scene.add(barrierFenceGroup);
  spaceObjects.push(barrierFenceGroup);

  // Cosmic Stargate Portal Pad & Terminal (Dedicated space travel pad on the side)
  const hubTabel = new window.THREE.Mesh(
      new window.THREE.CylinderGeometry(2.5, 3.0, 0.6, 16),
      createGlowMat(0x0284c7, 0x38bdf8)
  );
  hubTabel.position.set(-18, 0.3, -48); // Positioned safely on the west side
  scene.add(hubTabel);
  spaceObjects.push(hubTabel);

  // Glowing Stargate Ring on Pad
  const gateRing = new window.THREE.Mesh(
      new window.THREE.TorusGeometry(2.2, 0.2, 8, 24),
      createGlowMat(0x38bdf8, 0x7dd3fc)
  );
  gateRing.rotation.x = Math.PI / 2;
  gateRing.position.set(-18, 0.65, -48);
  scene.add(gateRing);
  spaceObjects.push(gateRing);
  
  // Bakkal Kedi (Standing Cat Merchant Capitoolos) - Fully Visible 3D Shop & Model in front of the Northern Mountains
  const bakkal = new window.THREE.Group();
  bakkal.position.set(7, 0.2, -30); // Elevated and positioned in open flat space right in front of the Northern Mountain path
  bakkal.rotation.y = Math.PI; // Facing south towards village center & approaching player
  
  // Materials
  const furMat = new window.THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.45 }); // Warm Orange / Ginger Fur
  const pawMat = new window.THREE.MeshStandardMaterial({ color: 0xfffbeb, roughness: 0.5 }); // White Paws
  const bellyMat = new window.THREE.MeshStandardMaterial({ color: 0xfff8e7, roughness: 0.55 }); // Creamy White Belly
  const pinkMat = new window.THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.35 }); // Pink nose & inner ear
  const eyeMat = new window.THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1 }); // Dark Eye
  const eyeShineMat = new window.THREE.MeshBasicMaterial({ color: 0xffffff }); // Eye highlight
  const goldMat = createGlowMat(0xfcb316, 0xfde047); // Gold Bell / Coins
  const woodDeckMat = new window.THREE.MeshStandardMaterial({ color: 0x5c2b08, roughness: 0.75 }); // Dark Wood Deck
  const woodMat = new window.THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.65 }); // Warm Wood Counter
  const awningMat1 = new window.THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 }); // Amber Stripe
  const awningMat2 = new window.THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.5 }); // Cream Stripe
  const collarMat = new window.THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3 }); // Red collar

  // 0. Wooden Shop Floor Deck & Overhead Canopy (Ensures it is never buried in terrain)
  const deckMesh = new window.THREE.Mesh(new window.THREE.BoxGeometry(6.2, 0.4, 5.4), woodDeckMat);
  deckMesh.position.set(0, 0.2, -0.4);
  bakkal.add(deckMesh);

  // 4 Wooden Pillars for Canopy
  [[-2.8, -2.8], [2.8, -2.8], [-2.8, 2.0], [2.8, 2.0]].forEach(([cx, cz]) => {
    const post = new window.THREE.Mesh(new window.THREE.CylinderGeometry(0.12, 0.14, 5.0, 8), woodDeckMat);
    post.position.set(cx, 2.7, cz);
    bakkal.add(post);
  });

  // Striped Market Canopy Roof
  const roofGroup = new window.THREE.Group();
  roofGroup.position.set(0, 5.3, -0.4);
  for (let s = -3; s <= 3; s++) {
    const stripe = new window.THREE.Mesh(
      new window.THREE.BoxGeometry(0.9, 0.25, 5.6),
      s % 2 === 0 ? awningMat1 : awningMat2
    );
    stripe.position.set(s * 0.9, 0, 0);
    roofGroup.add(stripe);
  }
  bakkal.add(roofGroup);

  // Hanging Lanterns on Front Pillars
  [[-2.8, -2.8], [2.8, -2.8]].forEach(([lx, lz]) => {
    const lantern = new window.THREE.Mesh(new window.THREE.BoxGeometry(0.4, 0.6, 0.4), createGlowMat(0xf59e0b, 0xfef08a));
    lantern.position.set(lx, 4.4, lz);
    bakkal.add(lantern);
  });

  // 1. Standing Legs & Cute White Paws
  const legGeo = new window.THREE.CylinderGeometry(0.36, 0.42, 1.3, 12);
  const legL = new window.THREE.Mesh(legGeo, furMat);
  legL.position.set(-0.6, 0.95, 0);
  bakkal.add(legL);

  const pawL = new window.THREE.Mesh(new window.THREE.SphereGeometry(0.38, 12, 12), pawMat);
  pawL.scale.set(1.0, 0.6, 1.2);
  pawL.position.set(-0.6, 0.45, -0.2);
  bakkal.add(pawL);

  const legR = new window.THREE.Mesh(legGeo, furMat);
  legR.position.set(0.6, 0.95, 0);
  bakkal.add(legR);

  const pawR = new window.THREE.Mesh(new window.THREE.SphereGeometry(0.38, 12, 12), pawMat);
  pawR.scale.set(1.0, 0.6, 1.2);
  pawR.position.set(0.6, 0.45, -0.2);
  bakkal.add(pawR);

  // 2. Standing Chubby Body & Creamy White Belly
  const bodyGeo = new window.THREE.CylinderGeometry(0.95, 1.15, 2.1, 16);
  const bodyMesh = new window.THREE.Mesh(bodyGeo, furMat);
  bodyMesh.position.y = 2.4;
  bakkal.add(bodyMesh);

  const bellyGeo = new window.THREE.SphereGeometry(0.85, 16, 16);
  const bellyMesh = new window.THREE.Mesh(bellyGeo, bellyMat);
  bellyMesh.scale.set(0.95, 1.15, 0.6);
  bellyMesh.position.set(0, 2.3, -0.65); // Facing forward
  bakkal.add(bellyMesh);

  // 3. Red Collar with Golden Bell
  const collarGeo = new window.THREE.TorusGeometry(0.95, 0.14, 12, 24);
  const collarMesh = new window.THREE.Mesh(collarGeo, collarMat);
  collarMesh.rotation.x = Math.PI / 2;
  collarMesh.position.y = 3.35;
  bakkal.add(collarMesh);

  const bellGeo = new window.THREE.SphereGeometry(0.24, 12, 12);
  const bellMesh = new window.THREE.Mesh(bellGeo, goldMat);
  bellMesh.position.set(0, 3.2, -1.05);
  bakkal.add(bellMesh);

  // 4. Arms & Paws Resting on Wooden Counter Table
  const armGeo = new window.THREE.CylinderGeometry(0.24, 0.24, 1.2, 12);
  const armL = new window.THREE.Mesh(armGeo, furMat);
  armL.position.set(-1.05, 2.5, -0.5);
  armL.rotation.x = -0.9;
  armL.rotation.z = 0.25;
  bakkal.add(armL);

  const frontPawL = new window.THREE.Mesh(new window.THREE.SphereGeometry(0.26, 12, 12), pawMat);
  frontPawL.position.set(-0.9, 1.95, -1.1);
  bakkal.add(frontPawL);

  const armR = new window.THREE.Mesh(armGeo, furMat);
  armR.position.set(1.05, 2.5, -0.5);
  armR.rotation.x = -0.9;
  armR.rotation.z = -0.25;
  bakkal.add(armR);

  const frontPawR = new window.THREE.Mesh(new window.THREE.SphereGeometry(0.26, 12, 12), pawMat);
  frontPawR.position.set(0.9, 1.95, -1.1);
  bakkal.add(frontPawR);

  // 5. Cute Head & Muzzle
  const headGeo = new window.THREE.SphereGeometry(1.15, 20, 20);
  const headMesh = new window.THREE.Mesh(headGeo, furMat);
  headMesh.position.set(0, 4.3, 0);
  bakkal.add(headMesh);

  const muzzleGeo = new window.THREE.SphereGeometry(0.55, 16, 16);
  const muzzleMesh = new window.THREE.Mesh(muzzleGeo, bellyMat);
  muzzleMesh.scale.set(1.1, 0.7, 0.85);
  muzzleMesh.position.set(0, 4.05, -0.95);
  bakkal.add(muzzleMesh);

  // Pink Nose
  const noseGeo = new window.THREE.SphereGeometry(0.15, 12, 12);
  const noseMesh = new window.THREE.Mesh(noseGeo, pinkMat);
  noseMesh.position.set(0, 4.2, -1.45);
  bakkal.add(noseMesh);

  // Eyes with Cute White Highlights
  const eyeGeo = new window.THREE.SphereGeometry(0.2, 12, 12);
  const eyeL = new window.THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(-0.45, 4.45, -1.05);
  bakkal.add(eyeL);

  const eyeShineL = new window.THREE.Mesh(new window.THREE.SphereGeometry(0.06, 8, 8), eyeShineMat);
  eyeShineL.position.set(-0.40, 4.52, -1.2);
  bakkal.add(eyeShineL);

  const eyeR = new window.THREE.Mesh(eyeGeo, eyeMat);
  eyeR.position.set(0.45, 4.45, -1.05);
  bakkal.add(eyeR);

  const eyeShineR = new window.THREE.Mesh(new window.THREE.SphereGeometry(0.06, 8, 8), eyeShineMat);
  eyeShineR.position.set(0.50, 4.52, -1.2);
  bakkal.add(eyeShineR);

  // Whiskers (Left & Right)
  const whiskerGeo = new window.THREE.CylinderGeometry(0.02, 0.02, 0.9, 6);
  const whiskerMat = new window.THREE.MeshBasicMaterial({ color: 0xffffff });
  
  for (let i = -1; i <= 1; i++) {
    const wL = new window.THREE.Mesh(whiskerGeo, whiskerMat);
    wL.rotation.z = Math.PI / 2 + i * 0.22;
    wL.position.set(-0.85, 4.05 + i * 0.1, -1.1);
    bakkal.add(wL);

    const wR = new window.THREE.Mesh(whiskerGeo, whiskerMat);
    wR.rotation.z = Math.PI / 2 - i * 0.22;
    wR.position.set(0.85, 4.05 + i * 0.1, -1.1);
    bakkal.add(wR);
  }

  // 6. Pointy Ears with Pink Inner
  const earGeo = new window.THREE.ConeGeometry(0.5, 1.0, 16);
  const earL = new window.THREE.Mesh(earGeo, furMat);
  earL.position.set(-0.7, 5.35, -0.1);
  earL.rotation.z = -0.2;
  bakkal.add(earL);

  const earInnerGeo = new window.THREE.ConeGeometry(0.32, 0.75, 16);
  const earInnerL = new window.THREE.Mesh(earInnerGeo, pinkMat);
  earInnerL.position.set(-0.7, 5.3, -0.16);
  earInnerL.rotation.z = -0.2;
  bakkal.add(earInnerL);

  const earR = new window.THREE.Mesh(earGeo, furMat);
  earR.position.set(0.7, 5.35, -0.1);
  earR.rotation.z = 0.2;
  bakkal.add(earR);

  const earInnerR = new window.THREE.Mesh(earInnerGeo, pinkMat);
  earInnerR.position.set(0.7, 5.3, -0.16);
  earInnerR.rotation.z = 0.2;
  bakkal.add(earInnerR);

  // 7. Expressive Wiggling Tail
  const tailGroup = new window.THREE.Group();
  tailGroup.position.set(0, 1.6, 1.0);
  const tailGeo = new window.THREE.CylinderGeometry(0.18, 0.1, 1.7, 12);
  const tailMesh = new window.THREE.Mesh(tailGeo, furMat);
  tailMesh.position.set(0, 0.75, 0.4);
  tailMesh.rotation.x = 0.6;
  tailGroup.add(tailMesh);
  tailGroup.name = 'cat_tail';
  bakkal.add(tailGroup);

  // 8. Sturdy Wooden Merchant Shop Counter Table in front of the cat
  const counterGeo = new window.THREE.BoxGeometry(4.8, 1.6, 1.5);
  const counterMesh = new window.THREE.Mesh(counterGeo, woodMat);
  counterMesh.position.set(0, 1.15, -1.45);
  bakkal.add(counterMesh);

  // Counter Top Plank (Slightly larger lip)
  const counterTop = new window.THREE.Mesh(new window.THREE.BoxGeometry(5.1, 0.2, 1.7), woodDeckMat);
  counterTop.position.set(0, 1.95, -1.45);
  bakkal.add(counterTop);

  // Items Displayed on Top of Counter
  // Mini Golden Honey Jar
  const jarGeo = new window.THREE.CylinderGeometry(0.26, 0.26, 0.55, 12);
  const jarMat = createGlowMat(0xd97706, 0xf59e0b);
  const jarMesh = new window.THREE.Mesh(jarGeo, jarMat);
  jarMesh.position.set(-1.4, 2.3, -1.45);
  bakkal.add(jarMesh);

  // Mini Glowing Potion Bottle
  const potionGeo = new window.THREE.SphereGeometry(0.22, 12, 12);
  const potionMat = createGlowMat(0x06b6d4, 0x22d3ee);
  const potionMesh = new window.THREE.Mesh(potionGeo, potionMat);
  potionMesh.position.set(-0.5, 2.25, -1.45);
  bakkal.add(potionMesh);

  // Gold Coin Pile & Sacks
  const coinGeo = new window.THREE.CylinderGeometry(0.28, 0.28, 0.18, 12);
  const coinMesh = new window.THREE.Mesh(coinGeo, goldMat);
  coinMesh.position.set(0.45, 2.15, -1.45);
  bakkal.add(coinMesh);

  // Mini Wizard Hat Display
  const miniHatGeo = new window.THREE.ConeGeometry(0.32, 0.65, 12);
  const hatMat = createGlowMat(0x4338ca, 0x6366f1);
  const miniHat = new window.THREE.Mesh(miniHatGeo, hatMat);
  miniHat.position.set(1.4, 2.35, -1.45);
  bakkal.add(miniHat);

  // Front Signboard on the Table: "🐱 CAPITOOLOS BAKKAL"
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 512;
  signCanvas.height = 128;
  const sCtx = signCanvas.getContext('2d');
  if (sCtx) {
    sCtx.fillStyle = '#451a03';
    sCtx.fillRect(0, 0, 512, 128);
    sCtx.strokeStyle = '#f59e0b';
    sCtx.lineWidth = 6;
    sCtx.strokeRect(4, 4, 504, 120);
    sCtx.fillStyle = '#fef08a';
    sCtx.font = 'bold 28px sans-serif';
    sCtx.textAlign = 'center';
    sCtx.fillText('🐱 CAPI BAKKALI 🛍️', 256, 52);
    sCtx.fillStyle = '#ffffff';
    sCtx.font = '20px sans-serif';
    sCtx.fillText('[E] Kostüm & Özel Eşyalar Dükkanı', 256, 96);
  }
  const signTex = new window.THREE.CanvasTexture(signCanvas);
  const signMesh = new window.THREE.Mesh(
    new window.THREE.PlaneGeometry(3.6, 0.9),
    new window.THREE.MeshBasicMaterial({ map: signTex })
  );
  signMesh.position.set(0, 1.15, -2.22); // Attached to front of the table facing the customer
  signMesh.rotation.y = Math.PI; // Face outwards toward player
  bakkal.add(signMesh);

  // 9. Floating 3D Shop Icon / Sparkling Orb above the shop
  const shopOrbGeo = new window.THREE.SphereGeometry(0.5, 16, 16);
  const shopOrbMat = createGlowMat(0xf59e0b, 0xfde047);
  const shopOrb = new window.THREE.Mesh(shopOrbGeo, shopOrbMat);
  shopOrb.position.set(0, 6.4, -0.4);
  shopOrb.name = 'cat_shop_icon';
  bakkal.add(shopOrb);

  bakkal.name = 'merchant_cat';
  scene.add(bakkal);
  spaceObjects.push(bakkal);

  // =========================================================================
  // --- 2. RETRO ARCADE MİNİ OYUN SALONU KABİNİ (Arcade Station) ---
  // Positioned at (-11, 0.2, -22)
  // =========================================================================
  const arcadeStation = new window.THREE.Group();
  arcadeStation.position.set(-11, 0.2, -22);
  arcadeStation.rotation.y = 0.4;
  arcadeStation.name = 'retro_arcade_cabinet';

  const arcadeBodyMat = new window.THREE.MeshStandardMaterial({ color: 0x3b0764, roughness: 0.4 });
  const arcadePurpleNeon = createGlowMat(0xa855f7, 0xc084fc);
  const arcadeScreenMat = new window.THREE.MeshStandardMaterial({ color: 0x1e1b4b, emissive: 0x312e81, emissiveIntensity: 0.8 });
  const cyberPlatformMat = new window.THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.7 });
  const cyanGlowMat = createGlowMat(0x06b6d4, 0x38bdf8);
  const yellowGoldMat = createGlowMat(0xf59e0b, 0xfde047);

  // Double Arcade Cabinets Side by Side
  [-1.1, 1.1].forEach((cx, idx) => {
    const cab = new window.THREE.Group();
    cab.position.x = cx;

    const baseBox = new window.THREE.Mesh(new window.THREE.BoxGeometry(1.8, 4.2, 2.0), arcadeBodyMat);
    baseBox.position.y = 2.1;
    cab.add(baseBox);

    [-0.92, 0.92].forEach(sx => {
      const strip = new window.THREE.Mesh(new window.THREE.BoxGeometry(0.08, 4.3, 2.05), arcadePurpleNeon);
      strip.position.set(sx, 2.15, 0);
      cab.add(strip);
    });

    const crt = new window.THREE.Mesh(new window.THREE.PlaneGeometry(1.4, 1.3), arcadeScreenMat);
    crt.position.set(0, 2.6, 1.02);
    cab.add(crt);

    const shelf = new window.THREE.Mesh(new window.THREE.BoxGeometry(1.7, 0.3, 0.9), cyberPlatformMat);
    shelf.position.set(0, 1.7, 1.25);
    shelf.rotation.x = -0.3;
    cab.add(shelf);

    const stick = new window.THREE.Mesh(new window.THREE.CylinderGeometry(0.04, 0.04, 0.35, 8), cyberPlatformMat);
    stick.position.set(-0.35, 1.95, 1.25);
    cab.add(stick);

    const stickBall = new window.THREE.Mesh(new window.THREE.SphereGeometry(0.1, 8, 8), idx === 0 ? cyanGlowMat : yellowGoldMat);
    stickBall.position.set(-0.35, 2.15, 1.25);
    cab.add(stickBall);

    const marquee = new window.THREE.Mesh(new window.THREE.BoxGeometry(1.7, 0.6, 0.4), arcadePurpleNeon);
    marquee.position.set(0, 4.0, 0.9);
    cab.add(marquee);

    arcadeStation.add(cab);
  });

  const arcadeCanvas = document.createElement('canvas');
  arcadeCanvas.width = 512;
  arcadeCanvas.height = 140;
  const aCtx = arcadeCanvas.getContext('2d');
  if (aCtx) {
    aCtx.fillStyle = '#2e1065';
    aCtx.fillRect(0, 0, 512, 140);
    aCtx.strokeStyle = '#c084fc';
    aCtx.lineWidth = 6;
    aCtx.strokeRect(4, 4, 504, 132);
    aCtx.fillStyle = '#f43f5e';
    aCtx.font = 'bold 30px sans-serif';
    aCtx.textAlign = 'center';
    aCtx.fillText('🕹️ SUPER BEAR ARCADE 🎮', 256, 50);
    aCtx.fillStyle = '#fde047';
    aCtx.font = 'bold 22px sans-serif';
    aCtx.fillText('[E Tuşu] 4 Yeni Mini Oyun Oyna!', 256, 95);
    aCtx.fillStyle = '#e9d5ff';
    aCtx.font = '16px sans-serif';
    aCtx.fillText('Bal Koşusu • Baloncuk • Asteroit • Kartlar', 256, 126);
  }
  const arcadeTex = new window.THREE.CanvasTexture(arcadeCanvas);
  const marqueeSign = new window.THREE.Mesh(
    new window.THREE.PlaneGeometry(4.0, 1.2),
    new window.THREE.MeshBasicMaterial({ map: arcadeTex })
  );
  marqueeSign.position.set(0, 4.8, 0.85);
  arcadeStation.add(marqueeSign);

  const arcIconGeo = new window.THREE.BoxGeometry(0.8, 0.6, 0.2);
  const arcIconMesh = new window.THREE.Mesh(arcIconGeo, arcadePurpleNeon);
  arcIconMesh.position.set(0, 5.8, 0.8);
  arcIconMesh.name = 'arcade_cabinet_icon';
  arcadeStation.add(arcIconMesh);

  scene.add(arcadeStation);
  spaceObjects.push(arcadeStation);

  // Tatlış Pelikan Piko (Standing Pelican NPC near pond in Ayı Köyü)
  const pelikanPiko = createCutePelicanMesh(window.THREE, false);
  pelikanPiko.position.set(-14, 0.2, 6); // Positioned by the pond in Ayı Köyü
  pelikanPiko.rotation.y = 0.6; // Facing towards spawn area
  pelikanPiko.name = 'npc_pelican_piko';
  scene.add(pelikanPiko);
  spaceObjects.push(pelikanPiko);
  
  // Interactive Barrier Detection Trigger (Mounted on Cosmic Stargate pad at x: -18, z: -48)
  hubTabel.name = 'space_travel_barrier';
  
  if (gameRef && gameRef.currentLevel && gameRef.currentLevel.colliders) {
      const THREE = window.THREE;
      // West and East fence colliders (Central gateway x: -5 to +5 is open to the mountains)
      gameRef.currentLevel.colliders.push({
          min: new THREE.Vector3(-55, 0, -51),
          max: new THREE.Vector3(-5.5, 3, -49),
          isToxic: false,
          isIce: false
      });
      gameRef.currentLevel.colliders.push({
          min: new THREE.Vector3(5.5, 0, -51),
          max: new THREE.Vector3(55, 3, -49),
          isToxic: false,
          isIce: false
      });
  }

  scene.add(bannerGroup);
  spaceObjects.push(bannerGroup);

  // Build Expanded Kedi Köyü (Volleyball Court, River, Fishing Ponds & Animals: Fox, Bunny, Giraffe)
  buildExpandedKediKoyu(scene);

  notifySpaceState();

}

// --- EXPANDED KEDİ KÖYÜ (CAT VILLAGE), ANIMALS, VOLLEYBALL & RIVER/FISHING ---
let villageVolleyball = null;
let villageVolleyballVel = { x: 0, y: 0, z: 0 };
let villageFishList = [];
let villageNpcsList = [];
let trainingDummy = null;
let trainingDummyWobble = 0;
let trainingDummyCooldown = 0;
let trainingJumpPad = null;
let trainingBullseye = null;

function buildExpandedKediKoyu(scene) {
  const THREE = window.THREE;
  if (!THREE) return;

  console.log("🐱 Expanding Kedi Köyü (Volleyball Court, River, Fishing Ponds & Animals)...");

  const villageGroup = new THREE.Group();
  villageGroup.name = 'expanded_kedi_koyu';
  scene.add(villageGroup);
  spaceObjects.push(villageGroup);

  // Materials
  const sandMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.9 });
  const waterMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, transparent: true, opacity: 0.85, metalness: 0.2 });
  const deepWaterMat = new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.2, transparent: true, opacity: 0.9 });
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
  const grassHillMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });

  // 1. VOLEYBOL SAHASI (Volleyball Court) at (x: 28, y: 0.05, z: -15)
  const courtGeo = new THREE.BoxGeometry(18, 0.2, 26);
  const courtMesh = new THREE.Mesh(courtGeo, sandMat);
  courtMesh.position.set(28, 0.05, -15);
  courtMesh.receiveShadow = true;
  villageGroup.add(courtMesh);

  // Court Border Lines (White)
  const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const lineHoriz = new THREE.Mesh(new THREE.BoxGeometry(18.2, 0.22, 0.3), lineMat);
  lineHoriz.position.set(28, 0.06, -15);
  villageGroup.add(lineHoriz);

  // Volleyball Net Poles (Left & Right)
  const poleGeo = new THREE.CylinderGeometry(0.15, 0.15, 4.5, 12);
  const poleL = new THREE.Mesh(poleGeo, woodMat);
  poleL.position.set(18.8, 2.25, -15);
  villageGroup.add(poleL);

  const poleR = new THREE.Mesh(poleGeo, woodMat);
  poleR.position.set(37.2, 2.25, -15);
  villageGroup.add(poleR);

  // Net Mesh Across
  const netGeo = new THREE.BoxGeometry(18.2, 2.0, 0.1);
  const netMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, transparent: true, opacity: 0.75, wireframe: true });
  const netMesh = new THREE.Mesh(netGeo, netMat);
  netMesh.position.set(28, 3.2, -15);
  villageGroup.add(netMesh);

  // Net Top Tape
  const tapeMesh = new THREE.Mesh(new THREE.BoxGeometry(18.2, 0.2, 0.15), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  tapeMesh.position.set(28, 4.2, -15);
  villageGroup.add(tapeMesh);

  // 3D Interactive Volleyball Ball
  const ballGroup = new THREE.Group();
  const ballGeo = new THREE.SphereGeometry(0.9, 20, 20);
  const ballMat = createGlowMat(0x38bdf8, 0xfde047);
  const ballMesh = new THREE.Mesh(ballGeo, ballMat);
  ballGroup.add(ballMesh);
  ballGroup.position.set(28, 1.2, -15);
  villageGroup.add(ballGroup);
  villageVolleyball = ballGroup;

  // 2. AKAN NEHİR & KÜÇÜK GÖLETLER (Flowing River & Fishing Ponds)
  const riverGeo = new THREE.BoxGeometry(85, 0.15, 12);
  const riverMesh = new THREE.Mesh(riverGeo, waterMat);
  riverMesh.position.set(0, 0.04, 22);
  riverMesh.rotation.y = -0.1;
  riverMesh.name = 'village_flowing_river';
  villageGroup.add(riverMesh);

  // River Bank Rocks
  const rockMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.9 });
  for (let i = -35; i <= 35; i += 7) {
    const rock1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.8 + Math.random() * 0.6), rockMat);
    rock1.position.set(i, 0.4, 28 + (Math.random() - 0.5) * 1.5);
    villageGroup.add(rock1);

    const rock2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.7 + Math.random() * 0.5), rockMat);
    rock2.position.set(i, 0.4, 16 + (Math.random() - 0.5) * 1.5);
    villageGroup.add(rock2);
  }

  // Wooden Arched Bridges over River
  [-14, 16].forEach(bx => {
    const bridgeGroup = new THREE.Group();
    bridgeGroup.position.set(bx, 0.8, 22);
    bridgeGroup.rotation.y = -0.1;

    const deckMesh = new THREE.Mesh(new THREE.BoxGeometry(6, 0.4, 14), woodMat);
    bridgeGroup.add(deckMesh);

    for (let side of [-2.8, 2.8]) {
      const railMesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.2, 14), woodMat);
      railMesh.position.set(side, 0.8, 0);
      bridgeGroup.add(railMesh);
    }
    villageGroup.add(bridgeGroup);
  });

  // Small Fishing Ponds
  const pond1Geo = new THREE.CylinderGeometry(8, 8, 0.2, 24);
  const pond1Mesh = new THREE.Mesh(pond1Geo, deepWaterMat);
  pond1Mesh.position.set(-26, 0.04, -8);
  pond1Mesh.name = 'fishing_pond_1';
  villageGroup.add(pond1Mesh);

  const pond1Rim = new THREE.Mesh(new THREE.TorusGeometry(8.2, 0.6, 12, 24), grassHillMat);
  pond1Rim.rotation.x = Math.PI / 2;
  pond1Rim.position.set(-26, 0.2, -8);
  villageGroup.add(pond1Rim);

  const pond2Mesh = new THREE.Mesh(new THREE.CylinderGeometry(7, 7, 0.2, 24), waterMat);
  pond2Mesh.position.set(-10, 0.04, 38);
  pond2Mesh.name = 'fishing_pond_2';
  villageGroup.add(pond2Mesh);

  // 3D SWIMMING FISH IN RIVER & PONDS
  const fishColors = [0xf97316, 0xeab308, 0x06b6d4, 0xef4444, 0xa855f7];
  villageFishList = [];

  for (let i = 0; i < 4; i++) {
    const fish = createFishMesh(THREE, fishColors[i % fishColors.length]);
    fish.position.set(-25 + i * 16, 0.3, 22);
    villageGroup.add(fish);
    villageFishList.push({
      mesh: fish,
      baseX: -25 + i * 16,
      baseZ: 22,
      radius: 4,
      speed: 0.02 + i * 0.005,
      phase: i * 1.5
    });
  }

  for (let i = 0; i < 2; i++) {
    const fish = createFishMesh(THREE, fishColors[(i + 2) % fishColors.length]);
    fish.position.set(-26 + i * 2, 0.3, -8 + i * 2);
    villageGroup.add(fish);
    villageFishList.push({
      mesh: fish,
      baseX: -26,
      baseZ: -8,
      radius: 5,
      speed: 0.015,
      phase: i * 3.14
    });
  }

  // 3. ANIMAL NPCS (FOX, BUNNY, GIRAFFE)
  villageNpcsList = [];

  // A) Tilki Kurnaz Rüstem 🦊
  const foxMesh = createFoxMesh(THREE);
  foxMesh.position.set(-18, 0.2, 10);
  foxMesh.rotation.y = 0.8;
  foxMesh.name = 'npc_fox_rustem';
  villageGroup.add(foxMesh);
  villageNpcsList.push({
    id: 'npc_fox_rustem',
    name: 'Tilki Kurnaz Rüstem 🦊',
    role: 'Kurnaz Gezgin',
    avatarIcon: '🦊',
    mesh: foxMesh,
    pos: foxMesh.position,
    dialogue: [
      "Selamün aleyküm genç kahraman ayı! Kedi Köyü'ne hoş geldin!",
      "Burası sadece kedilerin değil, biz tilki, tavşan ve zürafaların da neşeyle yaşadığı harika bir yer!",
      "Kedi Köyü nehrinde ve göletlerde nefis balıklar yüzüyor. Oltanı kap ve balık tutma görevlerini tamamla miyav!"
    ]
  });

  // B) Tavşan Zıpzıp Pamuk 🐰
  const bunnyMesh = createBunnyMesh(THREE);
  bunnyMesh.position.set(22, 0.2, -12);
  bunnyMesh.rotation.y = -0.6;
  bunnyMesh.name = 'npc_bunny_pamuk';
  villageGroup.add(bunnyMesh);
  villageNpcsList.push({
    id: 'npc_bunny_pamuk',
    name: 'Tavşan Zıpzıp Pamuk 🐰',
    role: 'Voleybol Şampiyonu',
    avatarIcon: '🐰',
    mesh: bunnyMesh,
    pos: bunnyMesh.position,
    dialogue: [
      "Zıp zıp zıp! Voleybol sahasına hoş geldin cesur ayı!",
      "Işıltılı voleybol topuna kafa veya ayak vurarak zıplatmayı denedin mi?",
      "Kedi dostlarımla her gün voleybol turnuvası düzenliyoruz, sen de katıl!"
    ]
  });

  // C) Zürafa Uzunboy Zeki 🦒
  const giraffeMesh = createGiraffeMesh(THREE);
  giraffeMesh.position.set(12, 0.2, 30);
  giraffeMesh.rotation.y = 2.8;
  giraffeMesh.name = 'npc_giraffe_zeki';
  villageGroup.add(giraffeMesh);
  villageNpcsList.push({
    id: 'npc_giraffe_zeki',
    name: 'Zürafa Uzunboy Zeki 🦒',
    role: 'Köprü Muhafızı',
    avatarIcon: '🦒',
    mesh: giraffeMesh,
    pos: giraffeMesh.position,
    dialogue: [
      "Yukarıdan merhaba cesur ayı! Uzun boyum sayesinde nehrin tüm balıklarını görebiliyorum!",
      "Nehrin berrak sularında yüzen Altın Nehir Balıklarını ve Dev Koi Balıklarını kaçırma!",
      "Oltanı nehre fırlat ve en büyük balığı yakala!"
    ]
  });

  // 4. KEDİ KÖYÜ SINIR DAĞLARI & MORİS'İN GİZLİ İNİ (Dağ Zirvesi, Kütük Karyola, Ot Yatağı, Petekler, Bal Fıçıları & Okunan Notlar)
  buildMorisSecretDenAndMountains(THREE, villageGroup);

  // 5. ACEMİ AYI ALIŞTIRMA PARKURU (Bakkal Kedi'nin Yanındaki Yeni Başlayanlar İçin Eğitim Alanı)
  buildBeginnerTrainingGround(THREE, villageGroup);
}

// Global reference for Moris's diary desk in Kedi Köyü (Beyond the barrier in Mountain 3)
let morisDiaryDeskPos = new THREE.Vector3(12.0, 7.6, -75.0);
let isMorisDiaryOpen = false;

function buildMorisSecretDenAndMountains(THREE, villageGroup) {
  const rockMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.85, metalness: 0.1 });
  const snowMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x5c2b08, roughness: 0.8 });
  const strawMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.9 });
  const honeyGoldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2, metalness: 0.3, emissive: 0xb45309, emissiveIntensity: 0.4 });
  const waxMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.6 });
  const pineLeafMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.8 });

  // Helper to add REAL physical collider to level
  function addDenCollider(minX, minY, minZ, maxX, maxY, maxZ, climbable = false) {
    const game = window.__superBearGame;
    if (!game || !game.currentLevel) return;
    if (!game.currentLevel.colliders) game.currentLevel.colliders = [];
    game.currentLevel.colliders.push({
      min: new THREE.Vector3(minX, minY, minZ),
      max: new THREE.Vector3(maxX, maxY, maxZ),
      isToxic: false,
      isIce: false,
      isClimbable: climbable
    });
  }

  // A) BORDER MOUNTAIN RANGE BEYOND THE BARRIERS ("Bariyerlerin bi tık ilerilerine dağlar ekle")
  // The barrier gateway is at z: -50. Mountains are placed from z: -68 to -135 across the northern horizon.
  const mountainCenters = [
    // Front Layer - Majestic peaks directly past the barrier
    { x: -55, y: 15, z: -72, r: 24, h: 32 },
    { x: -22, y: 17, z: -82, r: 25, h: 36 },
    { x: 12, y: 16, z: -76, r: 26, h: 36 }, // Mountain with Moris's Secret Mountain Cave & Lair!
    { x: 48, y: 16, z: -72, r: 24, h: 34 },
    { x: 80, y: 18, z: -68, r: 26, h: 36 },
    // Back Layer - Towering alpine summits with eternal snow
    { x: -40, y: 25, z: -115, r: 36, h: 50 },
    { x: 0, y: 28, z: -130, r: 42, h: 58 },
    { x: 42, y: 26, z: -120, r: 38, h: 52 }
  ];

  mountainCenters.forEach((m, mIdx) => {
    // Rocky mountain base
    const mtGeo = new THREE.ConeGeometry(m.r, m.h, 12);
    const mt = new THREE.Mesh(mtGeo, rockMat);
    mt.position.set(m.x, m.y, m.z);
    villageGroup.add(mt);

    // Snow-capped peak (Karlı dağ zirvesi)
    const snowGeo = new THREE.ConeGeometry(m.r * 0.46, m.h * 0.35, 12);
    const snow = new THREE.Mesh(snowGeo, snowMat);
    snow.position.set(m.x, m.y + m.h * 0.33, m.z);
    villageGroup.add(snow);

    // ADD REAL PHYSICAL COLLIDER FOR MOUNTAIN PEAK & BASE
    addDenCollider(m.x - m.r * 0.72, 0, m.z - m.r * 0.72, m.x + m.r * 0.72, m.y + m.h * 0.55, m.z + m.r * 0.72);

    // Pine trees on slopes
    for (let t = 0; t < 4; t++) {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 2, 6), woodMat);
      trunk.position.y = 1;
      tree.add(trunk);
      const foliage = new THREE.Mesh(new THREE.ConeGeometry(1.5, 3.8, 7), pineLeafMat);
      foliage.position.y = 3;
      tree.add(foliage);
      const angle = t * 1.57;
      const tx = m.x + Math.sin(angle) * (m.r * 0.65);
      const tz = m.z + Math.cos(angle) * (m.r * 0.65);
      tree.position.set(tx, 1.0, tz);
      villageGroup.add(tree);

      // ADD REAL PHYSICAL COLLIDERS FOR PINE TREE TRUNK & CANOPY
      addDenCollider(tx - 0.5, 0, tz - 0.5, tx + 0.5, 2.5, tz + 0.5);
      addDenCollider(tx - 1.6, 2.0, tz - 1.6, tx + 1.6, 5.5, tz + 1.6);
    }
  });

  // Mountain trail signpost right beyond the barrier gateway (x: 2.0, z: -51.5)
  const signGroup = new THREE.Group();
  signGroup.position.set(3.5, 0.0, -51.5);
  const signPole = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 3.2, 8), woodMat);
  signPole.position.y = 1.6;
  signGroup.add(signPole);
  const signBoard = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.2, 0.3), woodMat);
  signBoard.position.set(0, 2.6, 0);
  signGroup.add(signBoard);

  const signCanvas = document.createElement('canvas');
  signCanvas.width = 512;
  signCanvas.height = 180;
  const sCtx = signCanvas.getContext('2d');
  if (sCtx) {
    sCtx.fillStyle = '#78350f';
    sCtx.fillRect(0, 0, 512, 180);
    sCtx.strokeStyle = '#fef08a';
    sCtx.lineWidth = 8;
    sCtx.strokeRect(6, 6, 500, 168);
    sCtx.fillStyle = '#ffffff';
    sCtx.font = 'bold 28px sans-serif';
    sCtx.textAlign = 'center';
    sCtx.fillText('🏔️ MORİS\'İN DAĞ İNİ ➔', 256, 60);
    sCtx.fillStyle = '#fef08a';
    sCtx.font = '22px sans-serif';
    sCtx.fillText('Mor Ayı\'nın Gizli Notları & Sığınağı', 256, 105);
    sCtx.fillStyle = '#38bdf8';
    sCtx.font = '18px sans-serif';
    sCtx.fillText('Taş Basamakları Tırman!', 256, 145);
  }
  const signTex = new THREE.CanvasTexture(signCanvas);
  const signFace = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.0), new THREE.MeshBasicMaterial({ map: signTex }));
  signFace.position.set(0, 2.6, 0.17);
  signGroup.add(signFace);
  villageGroup.add(signGroup);

  // Natural Stone Climbing Steps leading from barrier to Mountain 3 Cave
  const steps = [
    { x: 0.0, y: 0.6, z: -52.5, w: 7.0, d: 4.5 },
    { x: 2.5, y: 1.8, z: -56.5, w: 6.5, d: 4.5 },
    { x: 5.0, y: 3.2, z: -60.5, w: 6.5, d: 4.5 },
    { x: 7.5, y: 4.6, z: -64.5, w: 6.0, d: 4.5 },
    { x: 9.8, y: 6.0, z: -68.5, w: 6.0, d: 4.5 },
    { x: 11.5, y: 7.2, z: -72.5, w: 6.5, d: 4.5 },
    // Cave entrance terrace / plateau at (12, 7.6, -76)
    { x: 12.0, y: 7.6, z: -76.0, w: 20.0, d: 18.0 },
    // Higher Mountain Pass Path & Scenic Summit Plateau
    { x: 12.0, y: 9.8, z: -83.0, w: 9.0, d: 5.5 },
    { x: 11.0, y: 12.2, z: -89.0, w: 9.0, d: 5.5 },
    { x: 10.0, y: 14.6, z: -95.0, w: 9.5, d: 6.0 },
    // Alpine Summit Overlook Terrace (Karlı Zirve Manzara Noktası)
    { x: 9.0, y: 16.8, z: -103.0, w: 20.0, d: 16.0 }
  ];

  steps.forEach((st, idx) => {
    const stepMesh = new THREE.Mesh(new THREE.BoxGeometry(st.w, 1.0, st.d), rockMat);
    stepMesh.position.set(st.x, st.y - 0.5, st.z);
    villageGroup.add(stepMesh);

    // Register real 3D solid & climbable collider for climbing steps
    addDenCollider(st.x - st.w / 2, 0.0, st.z - st.d / 2, st.x + st.w / 2, st.y + 0.3, st.z + st.d / 2, true);

    if (idx < 6) {
      // Step boundary torch
      const torch = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 6), woodMat);
      torch.position.set(st.x + st.w * 0.45, st.y + 0.6, st.z);
      villageGroup.add(torch);
      const flame = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), new THREE.MeshBasicMaterial({ color: 0xf97316 }));
      flame.position.set(st.x + st.w * 0.45, st.y + 1.3, st.z);
      villageGroup.add(flame);
    }
  });

  // B) MORİS'İN GİZLİ SIĞINAĞI / MAĞARASI (CAVE CAVERN AT (12.0, 7.2, -76.0))
  // Cave Walls and Curved Natural Cavern Roof
  const caveFloor = new THREE.Mesh(new THREE.BoxGeometry(14, 0.5, 12), rockMat);
  caveFloor.position.set(12.0, 7.2, -76.0);
  villageGroup.add(caveFloor);

  // Cave Arch & Sign above entrance
  const archL = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 5, 8), woodMat);
  archL.position.set(6.5, 9.6, -70.0);
  villageGroup.add(archL);
  const archR = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 5, 8), woodMat);
  archR.position.set(17.5, 9.6, -70.0);
  villageGroup.add(archR);
  const archTop = new THREE.Mesh(new THREE.BoxGeometry(12, 0.8, 0.8), woodMat);
  archTop.position.set(12.0, 12.2, -70.0);
  villageGroup.add(archTop);

  // Cave Nameplate Banner
  const caveBannerCanvas = document.createElement('canvas');
  caveBannerCanvas.width = 512;
  caveBannerCanvas.height = 140;
  const cbCtx = caveBannerCanvas.getContext('2d');
  if (cbCtx) {
    cbCtx.fillStyle = '#451a03';
    cbCtx.fillRect(0, 0, 512, 140);
    cbCtx.strokeStyle = '#f59e0b';
    cbCtx.lineWidth = 6;
    cbCtx.strokeRect(4, 4, 504, 132);
    cbCtx.fillStyle = '#fef08a';
    cbCtx.font = 'bold 30px sans-serif';
    cbCtx.textAlign = 'center';
    cbCtx.fillText('🐻‍❄️ MORİS\'İN GİZLİ DAĞ İNİ', 256, 55);
    cbCtx.fillStyle = '#ffffff';
    cbCtx.font = '20px sans-serif';
    cbCtx.fillText('Kırık Boynuzlu Ayı\'nın Dağ Sığınağı', 256, 100);
  }
  const caveBannerTex = new THREE.CanvasTexture(caveBannerCanvas);
  const caveBanner = new THREE.Mesh(new THREE.PlaneGeometry(6.0, 1.6), new THREE.MeshBasicMaterial({ map: caveBannerTex }));
  caveBanner.position.set(12.0, 12.8, -69.5);
  villageGroup.add(caveBanner);

  // Cave Roof Dome & Back Wall
  const caveRoof = new THREE.Mesh(new THREE.SphereGeometry(8.5, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), rockMat);
  caveRoof.position.set(12.0, 7.2, -76.0);
  villageGroup.add(caveRoof);

  // Cave Warm Lantern / Firelight & Purple Ambient Glow
  const caveLight = new THREE.PointLight(0xf59e0b, 2.5, 18);
  caveLight.position.set(12.0, 11.0, -76.0);
  villageGroup.add(caveLight);

  const purpleCrystalLight = new THREE.PointLight(0xa855f7, 1.8, 12);
  purpleCrystalLight.position.set(7.5, 9.0, -78.0);
  villageGroup.add(purpleCrystalLight);

  // Glowing Purple Crystals on the Cave Wall (Moris'in mistik mor kristali)
  const crystalMat = new THREE.MeshStandardMaterial({ color: 0xc084fc, emissive: 0x9333ea, emissiveIntensity: 0.6, roughness: 0.2 });
  for (let cr = 0; cr < 3; cr++) {
    const cMesh = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.9, 6), crystalMat);
    cMesh.position.set(6.2 + cr * 0.3, 8.2 + cr * 0.2, -78.5);
    cMesh.rotation.z = -0.4 + cr * 0.2;
    villageGroup.add(cMesh);
  }

  // C) YATTIĞI YER: KÜTÜK KARYOLA & YUMUŞAK OT YATAĞI ("Yattığı yer orada kalsın")
  const bedGroup = new THREE.Group();
  bedGroup.position.set(8.0, 7.6, -79.0);

  // 4 Thick Corner Logs (Kütük Ayaklar)
  const logGeo = new THREE.CylinderGeometry(0.28, 0.32, 1.8, 8);
  [[-1.8, -1.2], [1.8, -1.2], [-1.8, 1.2], [1.8, 1.2]].forEach(pos => {
    const post = new THREE.Mesh(logGeo, woodMat);
    post.position.set(pos[0], 0.9, pos[1]);
    bedGroup.add(post);
  });

  // Bed Log Frame Rails (Kütük Kenarlıklar)
  const longLogGeo = new THREE.CylinderGeometry(0.24, 0.24, 4.0, 8);
  const railF = new THREE.Mesh(longLogGeo, woodMat);
  railF.rotation.z = Math.PI / 2;
  railF.position.set(0, 0.7, 1.2);
  bedGroup.add(railF);

  const railB = railF.clone();
  railB.position.set(0, 0.7, -1.2);
  bedGroup.add(railB);

  // Headboard logs (Kütük Başlık)
  for (let hb = 0; hb < 3; hb++) {
    const headLog = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2.6, 8), woodMat);
    headLog.rotation.x = Math.PI / 2;
    headLog.position.set(-1.8, 0.8 + hb * 0.4, 0);
    bedGroup.add(headLog);
  }

  // Soft Straw Mattress (Yumuşak Ot Yatağı & Saman Şiltesi)
  const mattress = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.65, 2.3), strawMat);
  mattress.position.set(0, 0.9, 0);
  bedGroup.add(mattress);

  // Straw Pillow (Yumuşak Ot Yastık)
  const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.35, 1.8), waxMat);
  pillow.position.set(-1.3, 1.35, 0);
  bedGroup.add(pillow);

  // Warm Wool Blanket / Purple Bear Pelt (Moris'in Mor Yatak Örtüsü)
  const blanket = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 2.2), new THREE.MeshStandardMaterial({ color: 0x7e22ce, roughness: 0.9 }));
  blanket.position.set(0.5, 1.28, 0);
  bedGroup.add(blanket);

  villageGroup.add(bedGroup);

  // Solid bed collider
  addDenCollider(5.8, 7.5, -80.5, 10.2, 9.8, -77.5);

  // D) İÇTİĞİ BALLAR ORADA KALSIN (BOŞ & DOLU BAL ÇÖMLEKLERİ, PETEK RAFI, FIÇILAR)
  // Wooden Honeycomb Stand (Petek Bal Rafı)
  const shelfGroup = new THREE.Group();
  shelfGroup.position.set(16.5, 7.6, -79.0);

  const shelfPostL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.2, 1.2), woodMat);
  shelfPostL.position.set(-1.2, 1.6, 0);
  shelfGroup.add(shelfPostL);
  const shelfPostR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.2, 1.2), woodMat);
  shelfPostR.position.set(1.2, 1.6, 0);
  shelfGroup.add(shelfPostR);

  // 3 Shelves
  [0.8, 1.8, 2.8].forEach((sy, sIdx) => {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.15, 1.2), woodMat);
    plank.position.set(0, sy, 0);
    shelfGroup.add(plank);

    // Glowing Honeycomb Frames (Altın Petek Çerçeveleri)
    for (let h = -0.8; h <= 0.8; h += 0.55) {
      const comb = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.65, 0.12), honeyGoldMat);
      comb.position.set(h, sy + 0.38, (sIdx % 2 === 0 ? 0.15 : -0.15));
      comb.rotation.y = 0.1;
      shelfGroup.add(comb);

      // Honey jar beside combs
      const jar = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.35, 10), honeyGoldMat);
      jar.position.set(h + 0.2, sy + 0.22, 0);
      shelfGroup.add(jar);
    }
  });

  villageGroup.add(shelfGroup);

  // Stacked Wooden Honey Barrels with Overflowing Golden Honey ("İçtiği ballar orada kalsın")
  const barrelPositions = [
    { x: 17.0, y: 7.6, z: -75.0, rot: 0 },
    { x: 18.2, y: 7.6, z: -76.2, rot: 0 },
    { x: 17.6, y: 9.0, z: -75.6, rot: Math.PI / 2 } // Top stacked barrel
  ];

  barrelPositions.forEach(bp => {
    const bGroup = new THREE.Group();
    bGroup.position.set(bp.x, bp.y, bp.z);
    bGroup.rotation.x = bp.rot;

    const bMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.72, 1.4, 14), woodMat);
    bMesh.position.y = 0.7;
    bGroup.add(bMesh);

    // Barrel Metal Hoops
    const hoopMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
    [-0.3, 0.3].forEach(hy => {
      const hoop = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.04, 8, 16), hoopMat);
      hoop.rotation.x = Math.PI / 2;
      hoop.position.y = 0.7 + hy;
      bGroup.add(hoop);
    });

    // Overflowing Golden Honey from Top
    const honeyTop = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.1, 14), honeyGoldMat);
    honeyTop.position.y = 1.42;
    bGroup.add(honeyTop);

    villageGroup.add(bGroup);
  });

  // Moris'in Yatağının Yanında İçtiği Boş/Dolu Bal Çömlekleri & Bal Damlaları
  const clayPotMat = new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.7 });
  const honeyPots = [
    { x: 6.2, y: 7.6, z: -77.5, scale: 0.38, hasDrip: true },
    { x: 6.8, y: 7.6, z: -76.8, scale: 0.32, hasDrip: true },
    { x: 10.4, y: 7.6, z: -80.0, scale: 0.42, hasDrip: false }
  ];
  honeyPots.forEach(hp => {
    const pot = new THREE.Mesh(new THREE.SphereGeometry(hp.scale, 10, 10), clayPotMat);
    pot.position.set(hp.x, hp.y + hp.scale * 0.8, hp.z);
    villageGroup.add(pot);

    const rim = new THREE.Mesh(new THREE.CylinderGeometry(hp.scale * 0.5, hp.scale * 0.6, 0.15, 10), clayPotMat);
    rim.position.set(hp.x, hp.y + hp.scale * 1.5, hp.z);
    villageGroup.add(rim);

    // Golden honey puddle/drip
    const puddle = new THREE.Mesh(new THREE.CylinderGeometry(hp.scale * 0.8, hp.scale * 0.8, 0.04, 8), honeyGoldMat);
    puddle.position.set(hp.x + 0.15, hp.y + 0.02, hp.z + 0.15);
    villageGroup.add(puddle);
  });

  // Solid honey storage collider
  addDenCollider(15.0, 7.5, -80.0, 19.5, 10.5, -74.0);

  // E) CARVED STONE DESK & 3 READABLE DIARY NOTES (Moris'in Gizli Notları Masada)
  const deskGroup = new THREE.Group();
  deskGroup.position.set(12.0, 7.6, -75.0);

  // Stone table base & tabletop
  const tableBase = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.9, 1.4, 10), rockMat);
  tableBase.position.y = 0.7;
  deskGroup.add(tableBase);

  const tabletop = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.9, 0.25, 14), rockMat);
  tabletop.position.y = 1.5;
  deskGroup.add(tabletop);

  // 3 Glowing Open Diary Pages (3 Günlük Notu)
  const parchmentMat = new THREE.MeshStandardMaterial({
    color: 0xfef3c7,
    roughness: 0.5,
    emissive: 0xfef08a,
    emissiveIntensity: 0.35
  });

  const pageNotes = [
    { rot: -0.4, x: -0.7, z: 0.1, label: 'Not 1' },
    { rot: 0.0, x: 0.0, z: -0.5, label: 'Not 2' },
    { rot: 0.4, x: 0.7, z: 0.1, label: 'Not 3' }
  ];

  pageNotes.forEach(pn => {
    const page = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.04, 0.9), parchmentMat);
    page.position.set(pn.x, 1.66, pn.z);
    page.rotation.y = pn.rot;
    deskGroup.add(page);

    // Quill pen & ink pot
    const ink = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.18, 8), new THREE.MeshBasicMaterial({ color: 0x0f172a }));
    ink.position.set(pn.x + 0.35, 1.7, pn.z);
    deskGroup.add(ink);
  });

  // Floating Diary Icon Marker (Interactive indicator)
  const diaryMarker = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xfacc15, wireframe: true })
  );
  diaryMarker.position.set(0, 2.6, 0);
  diaryMarker.name = 'moris_diary_floating_marker';
  deskGroup.add(diaryMarker);

  villageGroup.add(deskGroup);

  // Solid desk collider
  addDenCollider(10.2, 7.5, -76.8, 13.8, 9.8, -73.2);
}

// Interactive proximity handler for Moris's Diary Notes in Kedi Köyü
function updateMorisSecretDenInteraction(game) {
  if (!game || !game.playerPos) return;

  const distToDesk = game.playerPos.distanceTo(morisDiaryDeskPos);

  if (distToDesk < 4.2) {
    // Show on-screen notice if not already reading
    if (Date.now() % 3500 < 60) {
      if (game.callbacks && game.callbacks.onShowNotice) {
        game.callbacks.onShowNotice("📜 Moris'in Gizli Günlüğü Masada! [E / Tıkla: 3 Notu Oku]", "info");
      }
    }

    // Trigger dialogue if player presses attack/jump or on direct approach once
    if (!isMorisDiaryOpen && (game.isAttacking || game.inputs.attack || distToDesk < 2.4)) {
      isMorisDiaryOpen = true;
      openMorisSecretDiary(game);
    }
  } else {
    isMorisDiaryOpen = false;
  }
}

function openMorisSecretDiary(game) {
  if (!game || !game.callbacks || !game.callbacks.onDialogueOpen) return;

  const diaryData = {
    npcId: "moris_secret_diary",
    npcName: "Moris'in Gizli Günlüğü 📜",
    npcRole: "Kırık Boynuzlu Ayı'nın Gizli Notları",
    avatarIcon: "🐻‍❄️",
    dialogue: [
      "📜 GÜNLÜK NOTU 1 (Sığınağım ve Huzur): Kedi Köyü halkı beni anlamadı... Tek başıma sınır dağlarının bu yüksek tepesine gizli inimi oydum. Kendi ellerimle kestiğim kütük karyolamı, ormandan topladığım yumuşak ot yatağımı seviyorum. Raflardaki petek ballarım ve fıçılardaki taze ballar bana sonsuz güç veriyor!",
      "📜 GÜNLÜK NOTU 2 (Kırık Boynuzun Acı Sırrı): Sağ boynuzum neden mi kırık? Dark Lord ile o karanlık kalede kozmik güç için savaştım! Devasa çekicimi taşa vururken boynuzum bir kayaya çarpıp paramparça oldu... Sol boynuzum ise hala altın gibi parlıyor ve uzayın kozmik enerjisini emiyor!",
      "📜 GÜNLÜK NOTU 3 (Tutsak Sarı Kuş Badem): O sevimli sarı kanatlı kuşu (Badem) uzaydaki 7. Bölüm Kozmik Kolezyumu'ndaki altın kafese kilitledim. Eğer Grizzy onu kurtarmak istiyorsa, önce uzayın tüm engellerini geçmeli ve benim yerleri sarsan dev kozmik çekicimle yüzleşmeli!"
    ]
  };

  game.callbacks.onDialogueOpen(diaryData);
}

// =========================================================================
// --- 5. ACEMİ AYI ALIŞTIRMA PARKURU (BEGINNER TRAINING GROUND BY TONTON FIRINCI'S BAKERY HOUSE) ---
// =========================================================================
function buildBeginnerTrainingGround(THREE, villageGroup) {
  console.log("🥋 Building Beginner Training Ground next to Tonton Fırıncı's Bakery House...");

  const sandMat = new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.9 });
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
  const darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.8 });
  const strawMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.85 });
  const clothRedMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.6 });
  const clothWhiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7, roughness: 0.3 });
  const goldMat = createGlowMat(0xfacc15, 0xfef08a);

  function addTrainingCollider(minX, minY, minZ, maxX, maxY, maxZ) {
    const game = window.__superBearGame;
    if (!game || !game.currentLevel) return;
    if (!game.currentLevel.colliders) game.currentLevel.colliders = [];
    game.currentLevel.colliders.push({
      min: new THREE.Vector3(minX, minY, minZ),
      max: new THREE.Vector3(maxX, maxY, maxZ),
      isToxic: false,
      isIce: false
    });
  }

  // 1. Training Ground Sandy Courtyard (Located at x: -28, z: -4 right beside Tonton Fırıncı's Bakery at x: -38, z: -7)
  const courtMesh = new THREE.Mesh(new THREE.BoxGeometry(16, 0.15, 16), sandMat);
  courtMesh.position.set(-28, 0.075, -4);
  courtMesh.receiveShadow = true;
  villageGroup.add(courtMesh);

  // Border fence logs around training ring
  const borderFenceL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 16, 8), woodMat);
  borderFenceL.rotation.x = Math.PI / 2;
  borderFenceL.position.set(-36, 0.3, -4);
  villageGroup.add(borderFenceL);

  const borderFenceB = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 16, 8), woodMat);
  borderFenceB.rotation.z = Math.PI / 2;
  borderFenceB.position.set(-28, 0.3, 4);
  villageGroup.add(borderFenceB);

  // 2. Entrance Archway & Sign
  const archGroup = new THREE.Group();
  archGroup.position.set(-20, 0, -4);

  const post1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 3.6, 8), darkWoodMat);
  post1.position.set(0, 1.8, -2.5);
  archGroup.add(post1);
  const post2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 3.6, 8), darkWoodMat);
  post2.position.set(0, 1.8, 2.5);
  archGroup.add(post2);

  const topBeam = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 6.0), darkWoodMat);
  topBeam.position.set(0, 3.6, 0);
  archGroup.add(topBeam);

  // Canvas billboard
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 512;
  signCanvas.height = 140;
  const sCtx = signCanvas.getContext('2d');
  if (sCtx) {
    sCtx.fillStyle = '#b45309';
    sCtx.fillRect(0, 0, 512, 140);
    sCtx.strokeStyle = '#fde047';
    sCtx.lineWidth = 6;
    sCtx.strokeRect(4, 4, 504, 132);
    sCtx.fillStyle = '#ffffff';
    sCtx.font = 'bold 28px sans-serif';
    sCtx.textAlign = 'center';
    sCtx.fillText('🥋 ACEMİ AYI ALIŞTIRMA PARKURU 🎯', 256, 50);
    sCtx.fillStyle = '#fde047';
    sCtx.font = '20px sans-serif';
    sCtx.fillText('🍞 Tonton Fırıncı Yanı Antrenman Sahası', 256, 95);
  }
  const signTex = new THREE.CanvasTexture(signCanvas);
  const signMesh = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 1.3), new THREE.MeshBasicMaterial({ map: signTex }));
  signMesh.rotation.y = -Math.PI / 2;
  signMesh.position.set(-0.35, 3.6, 0);
  archGroup.add(signMesh);

  villageGroup.add(archGroup);

  // 3. Straw Training Dummy (Saman Vurma Kuklası) at x: -26, z: -8
  const dummyGroup = new THREE.Group();
  dummyGroup.position.set(-26, 0, -8);

  // Base pole & spring
  const dPole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 1.2, 8), darkWoodMat);
  dPole.position.y = 0.6;
  dummyGroup.add(dPole);

  const dSpring = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.06, 8, 16), metalMat);
  dSpring.rotation.x = Math.PI / 2;
  dSpring.position.y = 1.1;
  dummyGroup.add(dSpring);

  // Straw Sack Body
  const dBody = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.45, 1.5, 12), strawMat);
  dBody.position.y = 1.9;
  dummyGroup.add(dBody);

  // Target Bullseye on Dummy Chest
  const dTarget = new THREE.Mesh(new THREE.CircleGeometry(0.3, 16), clothRedMat);
  dTarget.position.set(0, 2.0, 0.46);
  dummyGroup.add(dTarget);
  const dTargetC = new THREE.Mesh(new THREE.CircleGeometry(0.12, 16), clothWhiteMat);
  dTargetC.position.set(0, 2.0, 0.47);
  dummyGroup.add(dTargetC);

  // Outstretched wooden arms
  const dArm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.8, 8), darkWoodMat);
  dArm.rotation.z = Math.PI / 2;
  dArm.position.set(0, 2.3, 0);
  dummyGroup.add(dArm);

  // Straw Head & Hat
  const dHead = new THREE.Mesh(new THREE.SphereGeometry(0.35, 10, 10), strawMat);
  dHead.position.y = 2.9;
  dummyGroup.add(dHead);

  const dHat = new THREE.Mesh(new THREE.ConeGeometry(0.65, 0.35, 12), clothRedMat);
  dHat.position.y = 3.25;
  dummyGroup.add(dHat);

  dummyGroup.name = "training_dummy";
  villageGroup.add(dummyGroup);
  trainingDummy = dummyGroup;

  // Solid collider for dummy base
  addTrainingCollider(-26.6, 0, -8.6, -25.4, 3.2, -7.4);

  // 4. Multi-tier Jumping Logs (Zıplama & Çift Zıplama Kütükleri)
  const jumpLogs = [
    { x: -24, y: 1.2, z: -2, r: 0.9, h: 1.2 },
    { x: -23, y: 2.3, z: 1, r: 0.9, h: 2.3 },
    { x: -26, y: 3.5, z: 2, r: 0.9, h: 3.5 },
    { x: -29, y: 4.8, z: 2, r: 0.9, h: 4.8 }
  ];

  jumpLogs.forEach((log) => {
    const logMesh = new THREE.Mesh(new THREE.CylinderGeometry(log.r, log.r * 1.05, log.h, 12), woodMat);
    logMesh.position.set(log.x, log.h / 2, log.z);
    villageGroup.add(logMesh);

    // Tree rings top texture
    const topCap = new THREE.Mesh(new THREE.CircleGeometry(log.r * 0.92, 12), new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.8 }));
    topCap.rotation.x = -Math.PI / 2;
    topCap.position.set(log.x, log.h + 0.01, log.z);
    villageGroup.add(topCap);

    // Register solid box collider for each jump log
    addTrainingCollider(log.x - log.r, 0, log.z - log.r, log.x + log.r, log.h, log.z + log.r);

    // Golden reward coin floating above each log
    const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.08, 14), goldMat);
    coin.rotation.x = Math.PI / 2;
    coin.position.set(log.x, log.h + 0.85, log.z);
    villageGroup.add(coin);
  });

  // 5. Spring Jump Pad (Zıplama Yay Tahtası) at x: -31, z: 1
  const padGroup = new THREE.Group();
  padGroup.position.set(-31, 0, 1);

  const padBase = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 0.3, 16), darkWoodMat);
  padBase.position.y = 0.15;
  padGroup.add(padBase);

  const padSpring = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.14, 8, 20), metalMat);
  padSpring.rotation.x = Math.PI / 2;
  padSpring.position.y = 0.45;
  padGroup.add(padSpring);

  const padTop = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.2, 16), new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.4 }));
  padTop.position.y = 0.65;
  padGroup.add(padTop);

  villageGroup.add(padGroup);
  trainingJumpPad = padGroup;

  // 6. Ground Pound Target Bullseye at x: -30, z: -4
  const targetGroup = new THREE.Group();
  targetGroup.position.set(-30, 0.1, -4);

  const ring1 = new THREE.Mesh(new THREE.CircleGeometry(1.8, 24), clothRedMat);
  ring1.rotation.x = -Math.PI / 2;
  targetGroup.add(ring1);

  const ring2 = new THREE.Mesh(new THREE.CircleGeometry(1.2, 24), clothWhiteMat);
  ring2.rotation.x = -Math.PI / 2;
  ring2.position.y = 0.01;
  targetGroup.add(ring2);

  const ring3 = new THREE.Mesh(new THREE.CircleGeometry(0.6, 24), clothRedMat);
  ring3.rotation.x = -Math.PI / 2;
  ring3.position.y = 0.02;
  targetGroup.add(ring3);

  const centerStar = new THREE.Mesh(new THREE.CircleGeometry(0.25, 6), goldMat);
  centerStar.rotation.x = -Math.PI / 2;
  centerStar.position.y = 0.03;
  targetGroup.add(centerStar);

  villageGroup.add(targetGroup);
  trainingBullseye = targetGroup;

  // 7. Interactive Tutorial Signs
  function createTutSign(x, z, textTitle, textDesc) {
    const sGroup = new THREE.Group();
    sGroup.position.set(x, 0, z);
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.0, 6), darkWoodMat);
    p.position.y = 1.0;
    sGroup.add(p);
    const b = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.1, 0.15), darkWoodMat);
    b.position.set(0, 1.8, 0);
    sGroup.add(b);

    const tc = document.createElement('canvas');
    tc.width = 256;
    tc.height = 120;
    const ctx = tc.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(0, 0, 256, 120);
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(textTitle, 128, 45);
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px sans-serif';
      ctx.fillText(textDesc, 128, 85);
    }
    const tTex = new THREE.CanvasTexture(tc);
    const f = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.9), new THREE.MeshBasicMaterial({ map: tTex }));
    f.position.set(0, 1.8, 0.09);
    sGroup.add(f);
    villageGroup.add(sGroup);
  }

  createTutSign(-24, -10.5, "🐾 PENÇE VURUŞU", "Sol Tık / Boşluk ile vur!");
  createTutSign(-21, -2.5, "🦘 ÇİFT ZIPLAMA", "Havadayken tekrar Zıpla!");
  createTutSign(-31, -8.5, "💥 YERE ÇARPMA", "Havadayken E / Aşağı tuşu!");

  // 8. Antrenör Kedi Pamuk NPC 🐱🥋 (Standing directly beside Tonton Fırıncı 🍞🐻)
  const coachCat = createCoachCatMesh(THREE);
  coachCat.position.set(-34, 0, -6);
  coachCat.rotation.y = Math.PI / 4;
  villageGroup.add(coachCat);

  villageNpcsList.push({
    id: 'npc_coach_cat_pamuk',
    name: 'Antrenör Kedi Pamuk 🥋',
    role: 'Dövüş & Zıplama Eğitmeni',
    avatarIcon: '🐱',
    mesh: coachCat,
    pos: coachCat.position,
    dialogue: [
      "Miyav! Hoş geldin cesur ayı! Tonton Fırıncı'nın sıcacık fırın evinin yanındaki bu parkur senin alıştırma alanın!",
      "Saman kuklama sol tık ile pençe at, kütüklere çift zıpla, yay tahtasıyla havalan!",
      "Kırmızı-beyaz hedef tahtasının üstündeyken havadayken yere sertçe çarp!",
      "Tonton Fırıncı'dan lezzetli bal ekmeğini kap ve antrenmanını tamamlayıp maceralara atıl!"
    ]
  });
}

// 3D Model for Coach Cat (Antrenör Kedi Pamuk 🐱🥋)
function createCoachCatMesh(THREE) {
  const group = new THREE.Group();
  const furMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 }); // White cat
  const pinkMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.4 });
  const beltMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 }); // Black Belt
  const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 }); // Red Headband
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.2 }); // Green Eyes

  // Body
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 1.2, 12), furMat);
  body.position.y = 0.8;
  group.add(body);

  // Black Belt
  const belt = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.08, 8, 16), beltMat);
  belt.rotation.x = Math.PI / 2;
  belt.position.y = 0.75;
  group.add(belt);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 12, 12), furMat);
  head.position.y = 1.7;
  group.add(head);

  // Red Karate Headband
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.06, 8, 16), redMat);
  band.rotation.x = Math.PI / 2;
  band.position.y = 1.82;
  group.add(band);

  // Ears
  [[-0.22, 0.22], [0.22, -0.22]].forEach(pos => {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.3, 4), furMat);
    ear.position.set(pos[0], 2.1, 0);
    ear.rotation.z = pos[1] * 0.4;
    group.add(ear);
    const inner = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.2, 4), pinkMat);
    inner.position.set(pos[0], 2.08, 0.04);
    group.add(inner);
  });

  // Eyes & Nose
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), eyeMat);
  eyeL.position.set(-0.16, 1.75, 0.38);
  group.add(eyeL);
  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), eyeMat);
  eyeR.position.set(0.16, 1.75, 0.38);
  group.add(eyeR);

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.06, 4), pinkMat);
  nose.rotation.x = Math.PI / 2;
  nose.position.set(0, 1.62, 0.42);
  group.add(nose);

  // Tail
  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.9, 8), furMat);
  tail.position.set(0, 0.6, -0.45);
  tail.rotation.x = -0.6;
  group.add(tail);

  return group;
}

// Interaction handler for Beginner Training Ground
function updateBeginnerTrainingInteraction(game) {
  if (!game || !game.playerPos) return;
  const pPos = game.playerPos;

  // 1. Training Dummy Hit & Wobble Physics at (-26, 0, -8)
  if (trainingDummy) {
    if (trainingDummyCooldown > 0) trainingDummyCooldown -= 0.016;
    const dDummy = pPos.distanceTo(new window.THREE.Vector3(-26, 0, -8));

    // Player attacks dummy
    if (game.isAttacking && dDummy < 3.2 && trainingDummyCooldown <= 0) {
      trainingDummyCooldown = 0.35;
      trainingDummyWobble = 0.55;
      if (game.spawnSparkleParticles) {
        game.spawnSparkleParticles(new window.THREE.Vector3(-26, 2.0, -8), 12, 0xfacc15);
      }
      if (typeof St !== "undefined" && St.playPunch) St.playPunch();
      if (game.callbacks && game.callbacks.onShowNotice) {
        game.callbacks.onShowNotice("🎯 TAM İSABET! Pençe Vuruşu Başarılı! (+5 XP)", "success");
      }
    }

    // Wobble decay
    if (trainingDummyWobble > 0.01) {
      trainingDummy.rotation.z = Math.sin(Date.now() * 0.025) * trainingDummyWobble;
      trainingDummyWobble *= 0.93;
    } else {
      trainingDummy.rotation.z = 0;
    }
  }

  // 2. Training Spring Jump Pad at (-31, 0, 1)
  if (trainingJumpPad) {
    const dPad = Math.sqrt((pPos.x - (-31)) ** 2 + (pPos.z - 1) ** 2);
    if (dPad < 1.6 && pPos.y >= 0 && pPos.y <= 1.8) {
      game.playerVel.y = 1.35;
      if (game.spawnSparkleParticles) {
        game.spawnSparkleParticles(new window.THREE.Vector3(-31, 0.8, 1), 16, 0x38bdf8);
      }
      if (game.callbacks && game.callbacks.onShowNotice && Date.now() % 2200 < 50) {
        game.callbacks.onShowNotice("🦘 YÜKSEK SIÇRAMA! Havadayken Boşluk ile Çift Zıpla!", "success");
      }
    }
  }

  // 3. Training Ground Pound Bullseye Target at (-30, 0.1, -4)
  if (trainingBullseye) {
    const dTarget = Math.sqrt((pPos.x - (-30)) ** 2 + (pPos.z - (-4)) ** 2);
    if (dTarget < 2.0 && pPos.y <= 0.8 && (game.isGroundPounding || (game.playerVel && game.playerVel.y < -0.4))) {
      if (game.spawnSparkleParticles) {
        game.spawnSparkleParticles(new window.THREE.Vector3(-30, 0.3, -4), 20, 0xef4444);
      }
      if (game.callbacks && game.callbacks.onShowNotice && Date.now() % 2200 < 50) {
        game.callbacks.onShowNotice("💥 MÜKEMMEL YERE ÇARPMA! Hedefi Tam Ortadan Vurdun!", "success");
      }
    }
  }
}

// --- 3D FOX MESH CREATOR (Tilki Kurnaz Rüstem) ---
function createFoxMesh(THREE) {
  const group = new THREE.Group();
  const orangeMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.5 });
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
  const blackMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 });
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1 });

  const bodyGeo = new THREE.CylinderGeometry(0.5, 0.6, 1.2, 14);
  const body = new THREE.Mesh(bodyGeo, orangeMat);
  body.position.y = 1.0;
  group.add(body);

  const chestGeo = new THREE.SphereGeometry(0.42, 12, 12);
  const chest = new THREE.Mesh(chestGeo, whiteMat);
  chest.scale.set(0.8, 1.1, 0.4);
  chest.position.set(0, 1.0, 0.35);
  group.add(chest);

  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.8, 0.1);
  group.add(headGroup);

  const headGeo = new THREE.SphereGeometry(0.5, 16, 16);
  const head = new THREE.Mesh(headGeo, orangeMat);
  headGroup.add(head);

  const muzzleGeo = new THREE.ConeGeometry(0.28, 0.6, 12);
  const muzzle = new THREE.Mesh(muzzleGeo, whiteMat);
  muzzle.rotation.x = -Math.PI / 2;
  muzzle.position.set(0, -0.1, 0.45);
  headGroup.add(muzzle);

  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), blackMat);
  nose.position.set(0, -0.1, 0.75);
  headGroup.add(nose);

  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), eyeMat);
  eyeL.position.set(-0.2, 0.1, 0.38);
  headGroup.add(eyeL);

  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), eyeMat);
  eyeR.position.set(0.2, 0.1, 0.38);
  headGroup.add(eyeR);

  for (let side of [-0.28, 0.28]) {
    const earGeo = new THREE.ConeGeometry(0.2, 0.6, 12);
    const ear = new THREE.Mesh(earGeo, orangeMat);
    ear.position.set(side, 0.45, 0);
    ear.rotation.z = side < 0 ? 0.2 : -0.2;
    headGroup.add(ear);

    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.25, 12), blackMat);
    tip.position.set(side * 1.1, 0.6, 0);
    tip.rotation.z = side < 0 ? 0.2 : -0.2;
    headGroup.add(tip);
  }

  const tailGroup = new THREE.Group();
  tailGroup.position.set(0, 0.6, -0.4);
  const tailGeo = new THREE.ConeGeometry(0.35, 1.2, 14);
  const tail = new THREE.Mesh(tailGeo, orangeMat);
  tail.rotation.x = -1.2;
  tailGroup.add(tail);

  const tailTip = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.4, 12), whiteMat);
  tailTip.position.set(0, -0.5, 0.4);
  tailTip.rotation.x = -1.2;
  tailGroup.add(tailTip);

  tailGroup.name = 'fox_tail';
  group.add(tailGroup);

  return group;
}

// --- 3D BUNNY MESH CREATOR (Tavşan Zıpzıp Pamuk) ---
function createBunnyMesh(THREE) {
  const group = new THREE.Group();
  const pinkWhiteMat = new THREE.MeshStandardMaterial({ color: 0xfce7f3, roughness: 0.6 });
  const innerEarMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.4 });
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x831843, roughness: 0.2 });

  const bodyGeo = new THREE.SphereGeometry(0.65, 16, 16);
  bodyGeo.scale(0.9, 1.1, 0.9);
  const body = new THREE.Mesh(bodyGeo, pinkWhiteMat);
  body.position.y = 0.7;
  group.add(body);

  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.4, 0.05);
  group.add(headGroup);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 16), pinkWhiteMat);
  headGroup.add(head);

  for (let side of [-0.2, 0.2]) {
    const earGeo = new THREE.CylinderGeometry(0.1, 0.12, 1.1, 12);
    const ear = new THREE.Mesh(earGeo, pinkWhiteMat);
    ear.position.set(side, 0.8, -0.05);
    ear.rotation.z = side < 0 ? -0.25 : 0.25;
    headGroup.add(ear);

    const innerEar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.9, 12), innerEarMat);
    innerEar.position.set(side, 0.8, 0.02);
    innerEar.rotation.z = side < 0 ? -0.25 : 0.25;
    headGroup.add(innerEar);
  }

  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), eyeMat);
  eyeL.position.set(-0.18, 0.05, 0.38);
  headGroup.add(eyeL);

  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), eyeMat);
  eyeR.position.set(0.18, 0.05, 0.38);
  headGroup.add(eyeR);

  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), innerEarMat);
  nose.position.set(0, -0.02, 0.42);
  headGroup.add(nose);

  const tail = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), pinkWhiteMat);
  tail.position.set(0, 0.4, -0.55);
  group.add(tail);

  return group;
}

// --- 3D GIRAFFE MESH CREATOR (Zürafa Uzunboy Zeki) ---
function createGiraffeMesh(THREE) {
  const group = new THREE.Group();
  const yellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.6 });
  const spotMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.7 });
  const hornMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.5 });

  const bodyGeo = new THREE.BoxGeometry(1.2, 1.4, 2.2);
  const body = new THREE.Mesh(bodyGeo, yellowMat);
  body.position.set(0, 1.8, 0);
  group.add(body);

  const legGeo = new THREE.CylinderGeometry(0.18, 0.15, 2.0, 10);
  [[-0.4, 0.8], [0.4, 0.8], [-0.4, -0.8], [0.4, -0.8]].forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(legGeo, yellowMat);
    leg.position.set(lx, 1.0, lz);
    group.add(leg);

    const hoof = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.3, 10), hornMat);
    hoof.position.set(lx, 0.15, lz);
    group.add(hoof);
  });

  const neckGeo = new THREE.CylinderGeometry(0.3, 0.45, 3.8, 12);
  const neck = new THREE.Mesh(neckGeo, yellowMat);
  neck.position.set(0, 4.0, 0.8);
  neck.rotation.x = -0.2;
  group.add(neck);

  const headGroup = new THREE.Group();
  headGroup.position.set(0, 5.8, 1.2);
  group.add(headGroup);

  const headGeo = new THREE.BoxGeometry(0.6, 0.6, 1.0);
  const head = new THREE.Mesh(headGeo, yellowMat);
  headGroup.add(head);

  for (let side of [-0.18, 0.18]) {
    const horn = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8), hornMat);
    horn.position.set(side, 0.45, -0.1);
    headGroup.add(horn);

    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), hornMat);
    knob.position.set(side, 0.7, -0.1);
    headGroup.add(knob);
  }

  for (let i = 0; i < 8; i++) {
    const spot = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.35, 0.35), spotMat);
    const sideX = (i % 2 === 0 ? 0.61 : -0.61);
    spot.position.set(sideX, 1.8 + (Math.sin(i) * 0.4), (i % 4 - 1.5) * 0.4);
    group.add(spot);
  }

  return group;
}

// --- 3D FISH MESH CREATOR ---
function createFishMesh(THREE, colorHex = 0xf97316) {
  const group = new THREE.Group();
  const fishMat = createGlowMat(colorHex, 0xfde047);

  const bodyGeo = new THREE.SphereGeometry(0.4, 12, 12);
  bodyGeo.scale(0.5, 0.8, 1.6);
  const body = new THREE.Mesh(bodyGeo, fishMat);
  group.add(body);

  const tailGeo = new THREE.ConeGeometry(0.3, 0.6, 8);
  const tail = new THREE.Mesh(tailGeo, fishMat);
  tail.rotation.x = Math.PI / 2;
  tail.position.set(0, 0, -0.8);
  group.add(tail);

  const finGeo = new THREE.ConeGeometry(0.18, 0.4, 8);
  const fin = new THREE.Mesh(finGeo, fishMat);
  fin.position.set(0, 0.35, 0);
  group.add(fin);

  return group;
}

// --- FISHING MECHANIC ---
function triggerFishing() {
  const game = window.__superBearGame;
  if (!game) return;

  const pPos = game.playerPos || { x: 0, y: 0, z: 0 };
  const distRiver = Math.abs(pPos.z - 22);
  const distPond1 = Math.hypot(pPos.x - (-26), pPos.z - (-8));
  const distPond2 = Math.hypot(pPos.x - (-10), pPos.z - 38);

  if (distRiver > 18 && distPond1 > 16 && distPond2 > 16) {
    if (game.callbacks && game.callbacks.onShowNotice) {
      game.callbacks.onShowNotice("🌊 Balık tutmak için Kedi Köyü Nehrine veya Gölete yaklaşmalısın!", "warn");
    }
    return;
  }

  if (game.callbacks && game.callbacks.onShowNotice) {
    game.callbacks.onShowNotice("🎣 Olta suya atıldı... Balık bekleniyor... 🌊", "info");
  }

  if (typeof St !== "undefined" && St.playJump) St.playJump();

  setTimeout(() => {
    const isBigKoi = Math.random() < 0.35;
    const fishName = isBigKoi ? "🐟 Dev Parlak Koi Balığı" : "🎣 Altın Nehir Balığı";
    const rewardXp = isBigKoi ? 80 : 40;
    const rewardCoins = isBigKoi ? 50 : 25;

    if (typeof St !== "undefined" && St.playGoalFanfare) St.playGoalFanfare();

    if (game.stats) {
      game.stats.coins = (game.stats.coins || 0) + rewardCoins;
      game.stats.xp = (game.stats.xp || 0) + rewardXp;
      if (game.callbacks && game.callbacks.onStatsUpdate) game.callbacks.onStatsUpdate(game.stats);
    }

    if (game.callbacks && game.callbacks.onShowNotice) {
      game.callbacks.onShowNotice(`🎉 HARİKA! ${fishName} YAKALANDI! (+${rewardXp} XP, +${rewardCoins} Altın)`, "success");
    }

    if (game.callbacks && game.callbacks.onQuestProgress) {
      game.callbacks.onQuestProgress("obj-fish-2", 1);
      game.callbacks.onQuestProgress("obj-fish-3", 1);
      game.callbacks.onQuestProgress("catch_fish", 1);
    }
  }, 1400);
}

// Teleport Dash Mechanic
function teleportDash() {
  const game = window.__superBearGame;
  if (!game || !game.playerBear) return;

  const rotY = game.playerRotY || 0;
  const dirX = Math.sin(rotY) * 15;
  const dirZ = Math.cos(rotY) * 15;

  if (game.playerPos) {
    game.playerPos.x += dirX;
    game.playerPos.z += dirZ;
  }

  // Spawn starburst particle ring
  if (game.scene) {
    const burstGeo = new window.THREE.BufferGeometry();
    const count = 30;
    const posArr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      posArr[i * 3] = (Math.random() - 0.5) * 6;
      posArr[i * 3 + 1] = (Math.random() - 0.5) * 6;
      posArr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    burstGeo.setAttribute('position', new window.THREE.BufferAttribute(posArr, 3));
    const burstMat = new window.THREE.PointsMaterial({ color: 0x22d3ee, size: 0.6 });
    const pMesh = new window.THREE.Points(burstGeo, burstMat);
    pMesh.position.copy(game.playerPos);
    game.scene.add(pMesh);

    setTimeout(() => {
      game.scene.remove(pMesh);
    }, 800);
  }
}

// Shoot Plasma Laser
function shootLaser() {
  const game = window.__superBearGame;
  if (!game || !game.playerBear || !game.scene) return;

  const rotY = game.playerRotY || 0;
  const startPos = game.playerPos.clone();
  startPos.y += 1.5;

  const laserGeo = new window.THREE.SphereGeometry(0.6, 12, 12);
  const laserMat = createGlowMat(0xec4899, 0xf43f5e);
  const laserMesh = new window.THREE.Mesh(laserGeo, laserMat);
  laserMesh.position.copy(startPos);

  game.scene.add(laserMesh);

  const dirX = Math.sin(rotY);
  const dirZ = Math.cos(rotY);

  lasers.push({
    mesh: laserMesh,
    dirX: dirX,
    dirZ: dirZ,
    life: 0
  });
}

// Spray Paint System
function sprayPaint(colorType, shapeType, textVal) {
  const game = window.__superBearGame;
  if (!game || !game.scene || !game.playerPos) return;

  const THREE = window.THREE || window.parent.THREE;
  if (!THREE) return;

  const pPos = game.playerPos.clone();

  // Retrieve current settings fallback
  const settings = window.__superBearSpaceEnhancer?.currentSpraySettings || {};
  const activeColor = colorType || settings.color || 'green';
  const activeShape = shapeType || settings.shape || 'circle';
  const activeText = textVal !== undefined ? textVal : (settings.text || '');

  // Create temporary canvas
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Clear background (transparent)
  ctx.clearRect(0, 0, 256, 256);

  // Map color key to HEX string
  const colorMap = {
    green: '#10b981',
    purple: '#9333ea',
    gold: '#f59e0b',
    red: '#ef4444',
    blue: '#3b82f6',
    pink: '#ec4899',
    orange: '#f97316',
    white: '#ffffff',
    cyan: '#06b6d4',
    lime: '#84cc16',
    yellow: '#eab308',
    magenta: '#d946ef',
    teal: '#14b8a6',
    brown: '#78350f',
    black: '#111827',
    indigo: '#6366f1'
  };
  const colorHexStr = colorMap[activeColor] || '#10b981';

  // Draw Glow under-layer
  ctx.shadowBlur = 15;
  ctx.shadowColor = colorHexStr;

  ctx.fillStyle = colorHexStr;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 6;

  // Draw Shape
  ctx.beginPath();
  const cx = 128;
  const cy = 128;

  if (activeShape === 'square') {
    ctx.rect(32, 32, 192, 192);
    ctx.fill();
    ctx.stroke();
  } else if (activeShape === 'star') {
    const spikes = 5;
    const outerRadius = 90;
    const innerRadius = 40;
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (activeShape === 'heart') {
    const w = 170;
    const h = 170;
    const topCurveHeight = h * 0.3;
    ctx.moveTo(cx, cy + h / 2 - 15);
    ctx.bezierCurveTo(
      cx - w / 2, cy - h / 2 + topCurveHeight,
      cx - w / 2, cy - h / 2,
      cx, cy - h / 2 + topCurveHeight
    );
    ctx.bezierCurveTo(
      cx, cy - h / 2,
      cx + w / 2, cy - h / 2,
      cx + w / 2, cy - h / 2 + topCurveHeight
    );
    ctx.bezierCurveTo(
      cx + w / 2, cy + h / 2 - topCurveHeight,
      cx, cy + h / 2,
      cx, cy + h / 2 - 15
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (activeShape === 'badge') {
    ctx.moveTo(cx, 32);
    ctx.lineTo(210, 32);
    ctx.lineTo(210, 120);
    ctx.quadraticCurveTo(210, 210, cx, 230);
    ctx.quadraticCurveTo(46, 210, 46, 120);
    ctx.lineTo(46, 32);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (activeShape === 'triangle') {
    ctx.moveTo(cx, 38);
    ctx.lineTo(cx + 95, 218);
    ctx.lineTo(cx - 95, 218);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (activeShape === 'diamond') {
    ctx.moveTo(cx, 32);
    ctx.lineTo(cx + 95, cy);
    ctx.lineTo(cx, cy + 95);
    ctx.lineTo(cx - 95, cy);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (activeShape === 'crescent') {
    ctx.arc(cx - 15, cy, 90, -Math.PI / 2, Math.PI / 2, false);
    ctx.arc(cx + 15, cy, 90, Math.PI / 2, -Math.PI / 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (activeShape === 'ring') {
    ctx.arc(cx, cy, 90, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.stroke();
    // Inner hole
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(cx, cy, 45, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    // Draw inner stroke boundary
    ctx.beginPath();
    ctx.arc(cx, cy, 45, 0, Math.PI * 2, true);
    ctx.stroke();
  } else if (activeShape === 'flower') {
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const px = cx + Math.cos(angle) * 50;
      const py = cy + Math.sin(angle) * 50;
      ctx.beginPath();
      ctx.arc(px, py, 45, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    // center bud
    ctx.beginPath();
    ctx.arc(cx, cy, 35, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.stroke();
  } else if (activeShape === 'cross') {
    ctx.rect(cx - 25, cy - 90, 50, 180);
    ctx.rect(cx - 90, cy - 25, 180, 50);
    ctx.fill();
    ctx.stroke();
  } else {
    // Default circle
    ctx.arc(cx, cy, 90, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // Draw Text on top
  if (activeText && activeText.trim() !== '') {
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#000000';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#000000';

    const cleanText = activeText.substring(0, 16);
    ctx.strokeText(cleanText, cx, cy);
    ctx.fillText(cleanText, cx, cy);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;

  const decalMat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide
  });

  const decalGeo = new THREE.PlaneGeometry(3.6, 3.6);
  const decalMesh = new THREE.Mesh(decalGeo, decalMat);
  decalMesh.rotation.x = -Math.PI / 2;
  decalMesh.position.set(pPos.x, pPos.y + 0.08, pPos.z);

  game.scene.add(decalMesh);
  sprayDecals.push(decalMesh);

  if (game.spawnSparkleParticles) {
    const rawHex = parseInt(colorHexStr.replace('#', '0x'));
    game.spawnSparkleParticles(decalMesh.position, 15, rawHex);
  }

  if (sprayDecals.length > 25) {
    const oldest = sprayDecals.shift();
    if (oldest) {
      if (oldest.material) {
        if (oldest.material.map) oldest.material.map.dispose();
        oldest.material.dispose();
      }
      if (oldest.geometry) oldest.geometry.dispose();
      game.scene.remove(oldest);
    }
  }
}

// Toggle Alien Companion
function toggleAlienCompanion(active) {
  spaceState.companionActive = active !== undefined ? active : !spaceState.companionActive;
  if (alienCompanionGroup) {
    alienCompanionGroup.visible = spaceState.companionActive;
  }
  notifySpaceState();
}

// Teleport Directly to Space Hub
function teleportToSpace() {
  const game = window.__superBearGame;
  if (game && game.playerPos) {
    // Ayı Köyü'nün tepesinde güvenli bir yüksek irtifa noktası (y: 1000)
    game.playerPos.set(0, 1000, 0); 
    game.currentRegion = 'space_castle'; // Set region on game instance
    spaceState.currentRegion = 'space_castle'; // Set region on local state
    console.log("🚀 Teleporting to Space Castle");
    if (game.playerVel) game.playerVel.set(0, 0, 0);
    if (game.callbacks && game.callbacks.onShowNotice) {
      game.callbacks.onShowNotice("🚀 10. Bölüm: Uzay Kalesi'ne Işınlandın!");
    }
  }
}

let petState = {
  targetPos: null,
  wanderTimer: 0
};

// Main Frame Loop Update

dinoWorldPopulated = false;

function createDinoMesh(THREE, isBoss = false) {
  const dinoGroup = new THREE.Group();
  dinoGroup.name = isBoss ? 'dev_trex_boss' : 'mini_dino';
  
  // Materials
  const skinGreen = new THREE.MeshStandardMaterial({ color: isBoss ? 0xef4444 : 0x22c55e, roughness: 0.7 });
  const bellyYellow = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.8 });
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 });
  
  // Body
  const bodyGeo = new THREE.BoxGeometry(1.2, 1.8, 1.5);
  const body = new THREE.Mesh(bodyGeo, skinGreen);
  body.position.y = 1;
  dinoGroup.add(body);
  
  // Head
  const headGeo = new THREE.BoxGeometry(1.4, 1.4, 1.8);
  const head = new THREE.Mesh(headGeo, skinGreen);
  head.position.set(0, 2.2, 0.5);
  dinoGroup.add(head);
  
  // Jaw
  const jawGeo = new THREE.BoxGeometry(1.2, 0.4, 1.6);
  const jaw = new THREE.Mesh(jawGeo, bellyYellow);
  jaw.position.set(0, 1.6, 0.6);
  dinoGroup.add(jaw);
  
  // Eyes
  const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), eyeMat);
  eyeL.position.set(-0.75, 2.4, 0.8);
  dinoGroup.add(eyeL);
  
  const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), eyeMat);
  eyeR.position.set(0.75, 2.4, 0.8);
  dinoGroup.add(eyeR);
  
  // Tail
  const tailGeo = new THREE.BoxGeometry(0.8, 0.6, 1.8);
  const tail = new THREE.Mesh(tailGeo, skinGreen);
  tail.position.set(0, 0.6, -1.2);
  tail.rotation.x = -0.3;
  dinoGroup.add(tail);
  
  // Legs
  const legGeo = new THREE.BoxGeometry(0.6, 1.0, 0.8);
  const legL = new THREE.Mesh(legGeo, skinGreen);
  legL.position.set(-0.5, 0.5, 0);
  dinoGroup.add(legL);
  
  const legR = new THREE.Mesh(legGeo, skinGreen);
  legR.position.set(0.5, 0.5, 0);
  dinoGroup.add(legR);
  
  // Tiny Arms
  const armGeo = new THREE.BoxGeometry(0.3, 0.6, 0.3);
  const armL = new THREE.Mesh(armGeo, skinGreen);
  armL.position.set(-0.7, 1.4, 0.6);
  armL.rotation.x = 0.5;
  dinoGroup.add(armL);
  
  const armR = new THREE.Mesh(armGeo, skinGreen);
  armR.position.set(0.7, 1.4, 0.6);
  armR.rotation.x = 0.5;
  dinoGroup.add(armR);

  if (isBoss) {
      dinoGroup.scale.set(4, 4, 4);
  }

  return dinoGroup;
}


function createFireball(game, pos, targetPos) {
    if (!game || !pos || !targetPos) return;
    const THREE = window.THREE;
    const fireballGeo = new THREE.SphereGeometry(1.5, 8, 8);
    const fireballMat = new THREE.MeshBasicMaterial({ color: 0xff3300 });
    const fireball = new THREE.Mesh(fireballGeo, fireballMat);
    fireball.position.copy(pos);
    fireball.position.y += 2.5;
    if (game.currentLevel && game.currentLevel.mesh) { game.currentLevel.mesh.add(fireball); } else { game.scene.add(fireball); }

    const dir = targetPos.clone().sub(fireball.position).normalize();
    
    if (!game.currentLevel.fireballs) game.currentLevel.fireballs = [];
    game.currentLevel.fireballs.push({
        mesh: fireball,
        dir: dir,
        life: 0,
        speed: 0.6 // increased speed
    });
}



function createCheckpointVisual(THREE, pos, isInitial = false) {
    const cpGroup = new THREE.Group();
    cpGroup.name = "checkpoint_group";
    cpGroup.position.copy(pos);

    // Stone / metal circular base platform
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 0.35, 16), baseMat);
    base.position.y = 0.17;
    base.receiveShadow = true;
    cpGroup.add(base);

    // Glowing boundary ring
    const ringMat = new THREE.MeshBasicMaterial({ color: isInitial ? 0x22c55e : 0xfacc15 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.09, 8, 24), ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.36;
    cpGroup.add(ring);

    // Silver flagpole
    const poleMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.8, roughness: 0.2 });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3.8, 8), poleMat);
    pole.position.y = 1.9;
    pole.castShadow = true;
    cpGroup.add(pole);

    // Flag banner cloth (Red when unvisited, Vibrant Emerald Green when visited/active!)
    const flagMat = new THREE.MeshStandardMaterial({
        color: isInitial ? 0x22c55e : 0xef4444,
        emissive: isInitial ? 0x16a34a : 0xb91c1c,
        emissiveIntensity: 0.8,
        side: THREE.DoubleSide
    });
    const flag = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.9, 0.06), flagMat);
    flag.name = 'flag_mesh';
    flag.userData = { isBanner: true };
    flag.position.set(0.75, 3.1, 0);
    flag.castShadow = true;
    cpGroup.add(flag);

    // Glowing Top Orb
    const orbMat = new THREE.MeshBasicMaterial({ color: isInitial ? 0x4ade80 : 0xfacc15 });
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), orbMat);
    orb.position.set(0, 3.9, 0);
    cpGroup.add(orb);

    // Point Light for dramatic checkpoint glow
    const cpLight = new THREE.PointLight(isInitial ? 0x22c55e : 0xef4444, 2.0, 10);
    cpLight.position.set(0, 3.3, 0);
    cpGroup.add(cpLight);

    cpGroup.userData = { banner: flag, orb: orb, light: cpLight, ring: ring };
    return cpGroup;
}

function updateAndActivateCheckpoint(game, cp) {
    if (!game || !game.currentLevel || !cp || !cp.pos) return;
    const pPos = game.playerPos;
    if (!pPos) return;

    const dHoriz = Math.hypot(pPos.x - cp.pos.x, pPos.z - cp.pos.z);
    const dVert = Math.abs(pPos.y - cp.pos.y);
    const isNearby = (dHoriz < 4.2 && dVert < 4.5) || pPos.distanceTo(cp.pos) < 4.5;

    // Animate active flag waving slightly
    const cpMesh = cp.mesh || cp.meshGroup;
    if (cpMesh) {
        if (cpMesh.userData && cpMesh.userData.orb) {
            cpMesh.userData.orb.rotation.y += 0.04;
        }
        if (cp.active) {
            const flag = (cpMesh.userData && cpMesh.userData.banner) || cpMesh.getObjectByName('flag_mesh');
            if (flag) {
                flag.rotation.y = Math.sin(Date.now() * 0.006) * 0.15;
            }
        }
    }

    if (isNearby && !cp.active) {
        // Deactivate all other checkpoints & reset flag to red
        (game.currentLevel.checkpoints || []).forEach(other => {
            other.active = false;
            const oMesh = other.mesh || other.meshGroup;
            if (oMesh) {
                oMesh.traverse(c => {
                    if (c.isMesh && (c.name === 'flag_mesh' || (c.userData && c.userData.isBanner) || (oMesh.userData && oMesh.userData.banner === c))) {
                        if (c.material) {
                            if (c.material.color) c.material.color.setHex(0xef4444);
                            if (c.material.emissive) c.material.emissive.setHex(0xb91c1c);
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
                    if (oMesh.userData.light) {
                        if (oMesh.userData.light.color) oMesh.userData.light.color.setHex(0xef4444);
                    }
                }
            }
        });

        // Activate this checkpoint
        cp.active = true;
        if (game.currentLevel.spawnPoint) game.currentLevel.spawnPoint.copy(cp.pos);
        if (game.spawnSparkleParticles) game.spawnSparkleParticles(cp.pos, 35, 0x22c55e);
        if (typeof St !== "undefined" && St.playHoneyGem) St.playHoneyGem();

        // Turn this flag GREEN
        if (cpMesh) {
            cpMesh.traverse(c => {
                if (c.isMesh && (c.name === 'flag_mesh' || (c.userData && c.userData.isBanner) || (cpMesh.userData && cpMesh.userData.banner === c))) {
                    if (c.material) {
                        if (c.material.color) c.material.color.setHex(0x22c55e);
                        if (c.material.emissive) c.material.emissive.setHex(0x16a34a);
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
                if (cpMesh.userData.light) {
                    if (cpMesh.userData.light.color) cpMesh.userData.light.color.setHex(0x22c55e);
                }
            }
        }

        if (game.callbacks && game.callbacks.onShowNotice) {
            game.callbacks.onShowNotice("🚩 Checkpoint Kaydedildi: " + (cp.name || "Kontrol Noktası"), "success");
        }
    }
}

volcanoCavePopulated = false;

function createFlyingMagmaDrakeMesh(THREE) {
  const drake = new THREE.Group();
  drake.name = 'flying_magma_drake';

  const scaleRedMat = new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.5 });
  const magmaOrangeMat = new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xea580c, emissiveIntensity: 0.8 });
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xfef08a, emissiveIntensity: 1.2 });
  const wingMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, emissive: 0x991b1b, emissiveIntensity: 0.5, side: THREE.DoubleSide });

  // Body
  const body = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.6, 6), scaleRedMat);
  body.rotation.x = Math.PI / 2;
  drake.add(body);

  // Head
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.6, 0.9), scaleRedMat);
  head.position.set(0, 0.3, 0.9);
  drake.add(head);

  // Magma Eyes
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), eyeMat);
  eyeL.position.set(-0.35, 0.4, 1.1);
  drake.add(eyeL);
  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), eyeMat);
  eyeR.position.set(0.35, 0.4, 1.1);
  drake.add(eyeR);

  // Flapping Wings
  const wingL = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.0), wingMat);
  wingL.name = 'drake_wing_l';
  wingL.position.set(-1.0, 0.2, 0);
  wingL.rotation.x = Math.PI / 2;
  drake.add(wingL);

  const wingR = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.0), wingMat);
  wingR.name = 'drake_wing_r';
  wingR.position.set(1.0, 0.2, 0);
  wingR.rotation.x = Math.PI / 2;
  drake.add(wingR);

  // Glowing Fire Core
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), magmaOrangeMat);
  core.position.set(0, 0, 0);
  drake.add(core);

  drake.scale.set(1.6, 1.6, 1.6);
  return drake;
}

function createDragonMesh(THREE, isBoss = true) {
  const dragon = new THREE.Group();
  dragon.name = isBoss ? 'boss_ignis_dragon' : 'magma_drake';

  const scaleRedMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.6, metalness: 0.3 });
  const magmaOrangeMat = new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xea580c, emissiveIntensity: 0.6 });
  const goldHornMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xd97706, emissiveIntensity: 0.8 });
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfacc15, emissiveIntensity: 1.0 });
  const darkClawMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.8 });

  // Main Body Torso
  const bodyGeo = new THREE.BoxGeometry(2.2, 2.0, 3.2);
  const body = new THREE.Mesh(bodyGeo, scaleRedMat);
  body.position.y = 2.2;
  dragon.add(body);

  // Fiery Belly
  const bellyGeo = new THREE.BoxGeometry(1.8, 1.4, 2.8);
  const belly = new THREE.Mesh(bellyGeo, magmaOrangeMat);
  belly.position.set(0, 1.8, 0.2);
  dragon.add(belly);

  // Neck
  const neckGeo = new THREE.BoxGeometry(1.2, 1.8, 1.2);
  const neck = new THREE.Mesh(neckGeo, scaleRedMat);
  neck.position.set(0, 3.2, 1.2);
  neck.rotation.x = -0.4;
  dragon.add(neck);

  // Dragon Head
  const headGeo = new THREE.BoxGeometry(1.6, 1.2, 2.2);
  const head = new THREE.Mesh(headGeo, scaleRedMat);
  head.position.set(0, 4.2, 2.0);
  dragon.add(head);

  // Dragon Snout / Jaw
  const jawGeo = new THREE.BoxGeometry(1.4, 0.6, 1.8);
  const jaw = new THREE.Mesh(jawGeo, magmaOrangeMat);
  jaw.position.set(0, 3.7, 2.4);
  dragon.add(jaw);

  // Glowing Dragon Horns
  const hornGeo = new THREE.ConeGeometry(0.3, 1.6, 6);
  const hornL = new THREE.Mesh(hornGeo, goldHornMat);
  hornL.position.set(-0.7, 5.2, 1.4);
  hornL.rotation.set(-0.5, 0, -0.4);
  dragon.add(hornL);

  const hornR = new THREE.Mesh(hornGeo, goldHornMat);
  hornR.position.set(0.7, 5.2, 1.4);
  hornR.rotation.set(-0.5, 0, 0.4);
  dragon.add(hornR);

  // Glowing Magma Eyes
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), eyeMat);
  eyeL.position.set(-0.85, 4.4, 2.2);
  dragon.add(eyeL);

  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), eyeMat);
  eyeR.position.set(0.85, 4.4, 2.2);
  dragon.add(eyeR);

  // Back Spikes
  for (let i = 0; i < 4; i++) {
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.9, 4), goldHornMat);
    spike.position.set(0, 3.3, 1.0 - i * 0.9);
    spike.rotation.x = -0.3;
    dragon.add(spike);
  }

  // Giant Wings
  const wingShapeMat = new THREE.MeshStandardMaterial({ color: 0xea580c, emissive: 0xc2410c, emissiveIntensity: 0.5, side: THREE.DoubleSide });
  const wingBoneGeo = new THREE.BoxGeometry(0.4, 0.4, 3.5);
  const wingL = new THREE.Group();
  wingL.name = 'dragon_wing_left';
  wingL.position.set(-1.2, 3.0, 0);
  const wingBoneL = new THREE.Mesh(wingBoneGeo, scaleRedMat);
  wingBoneL.position.set(-1.6, 0.6, 0);
  wingBoneL.rotation.y = 0.5;
  wingL.add(wingBoneL);
  const wingFlapL = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.2), wingShapeMat);
  wingFlapL.position.set(-1.8, 0, -0.6);
  wingFlapL.rotation.x = Math.PI / 2;
  wingL.add(wingFlapL);
  dragon.add(wingL);

  const wingR = new THREE.Group();
  wingR.name = 'dragon_wing_right';
  wingR.position.set(1.2, 3.0, 0);
  const wingBoneR = new THREE.Mesh(wingBoneGeo, scaleRedMat);
  wingBoneR.position.set(1.6, 0.6, 0);
  wingBoneR.rotation.y = -0.5;
  wingR.add(wingBoneR);
  const wingFlapR = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.2), wingShapeMat);
  wingFlapR.position.set(1.8, 0, -0.6);
  wingFlapR.rotation.x = Math.PI / 2;
  wingR.add(wingFlapR);
  dragon.add(wingR);

  // Legs & Claws
  const legGeo = new THREE.BoxGeometry(0.8, 1.6, 1.0);
  const legPositions = [
    [-1.0, 0.8, 1.0],
    [1.0, 0.8, 1.0],
    [-1.1, 0.8, -1.0],
    [1.1, 0.8, -1.0]
  ];
  legPositions.forEach(([lx, ly, lz]) => {
    const leg = new THREE.Mesh(legGeo, scaleRedMat);
    leg.position.set(lx, ly, lz);
    dragon.add(leg);
    const claw = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 0.9), darkClawMat);
    claw.position.set(lx, ly - 0.7, lz + 0.3);
    dragon.add(claw);
  });

  // Long Spiked Dragon Tail
  const tailGroup = new THREE.Group();
  tailGroup.name = 'dragon_tail';
  tailGroup.position.set(0, 1.8, -1.6);
  const tailSegment1 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.9, 2.2), scaleRedMat);
  tailSegment1.position.z = -1.0;
  tailSegment1.rotation.x = -0.2;
  tailGroup.add(tailSegment1);
  const tailSegment2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 2.0), scaleRedMat);
  tailSegment2.position.set(0, 0.4, -2.8);
  tailSegment2.rotation.x = 0.2;
  tailGroup.add(tailSegment2);
  const tailTip = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.2, 4), goldHornMat);
  tailTip.position.set(0, 0.8, -4.0);
  tailTip.rotation.x = -Math.PI / 2;
  tailGroup.add(tailTip);
  dragon.add(tailGroup);

  if (isBoss) {
    dragon.scale.set(4.0, 4.0, 4.0);
  }

  return dragon;
}

function populateVolcanoCave(game) {
    if (game && game.currentLevel) ensureLevelArrays(game.currentLevel);

    const THREE = window.THREE;
    if (!game.currentLevel) game.currentLevel = {};
    if (game.currentLevel.sceneGroup) {
        game.currentLevel.mesh = game.currentLevel.sceneGroup;
    } else if (!game.currentLevel.mesh) {
        game.currentLevel.mesh = new THREE.Group();
        game.scene.add(game.currentLevel.mesh);
    }

    // Clean up any default invisible wall meshes from previous initialization
    if (game.currentLevel.invisibleWallMeshes && Array.isArray(game.currentLevel.invisibleWallMeshes)) {
        (game.currentLevel.invisibleWallMeshes || []).forEach(mesh => {
            if (mesh && mesh.parent) mesh.parent.remove(mesh);
        });
        game.currentLevel.invisibleWallMeshes = [];
    }

    // Clean up narrow boundary colliders that may block path
    if (game.currentLevel.colliders && Array.isArray(game.currentLevel.colliders)) {
        game.currentLevel.colliders = game.currentLevel.colliders.filter(c => {
            if (!c || !c.min || !c.max) return false;
            const w = Math.abs(c.max.x - c.min.x);
            const d = Math.abs(c.max.z - c.min.z);
            if (w > 50 && d < 15 && (Math.abs(c.min.z - 35) < 5 || Math.abs(c.max.z - 35) < 5 || Math.abs(c.min.z + 35) < 5 || Math.abs(c.max.z + 35) < 5)) {
                return false;
            }
            if (d > 50 && w < 15 && (Math.abs(c.min.x - 35) < 5 || Math.abs(c.max.x - 35) < 5 || Math.abs(c.min.x + 35) < 5 || Math.abs(c.max.x + 35) < 5)) {
                return false;
            }
            return true;
        });
    } else {
        game.currentLevel.colliders = [];
    }

    game.currentLevel.enemies = [];
    game.currentLevel.collectibles = [];
    game.currentLevel.jumpPads = [];
    game.currentLevel.checkpoints = [];
    game.currentLevel.fireballs = [];
    game.currentLevel.npcs = [];
    game.currentLevel.fireBars = [];
    game.currentLevel.flameVents = [];
    game.currentLevel.magmaMeteors = [];
    game.currentLevel.nextMeteorTimer = 2.5;
    game.currentLevel.healingCrystals = [];

    game.currentLevel.bounds = { minX: -220, maxX: 220, minZ: -280, maxZ: 200, minY: -30, maxY: 220 };

    game.scene.background = new THREE.Color(0x2a0404);
    game.scene.fog = new THREE.Fog(0x2a0404, 30, 240);

    // 1. Ambient Lava Sea (Toxic Floor at bottom)
    const lavaFloorGeo = new THREE.BoxGeometry(450, 2, 450);
    const lavaFloorMat = new THREE.MeshStandardMaterial({
        color: 0xdc2626,
        emissive: 0xb91c1c,
        emissiveIntensity: 0.8,
        roughness: 0.3
    });
    const lavaFloor = new THREE.Mesh(lavaFloorGeo, lavaFloorMat);
    lavaFloor.position.set(0, -1, 0);
    game.currentLevel.mesh.add(lavaFloor);

    // Toxic damage when falling into lava sea
    game.currentLevel.colliders.push({
        min: new THREE.Vector3(-220, -5, -220),
        max: new THREE.Vector3(220, 0, 220),
        isToxic: true
    });

    // Materials for Basalt Platforms & Magma
    const basaltMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85, metalness: 0.2 });
    const basaltEdgeMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
    const magmaGlowMat = new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xea580c, emissiveIntensity: 0.9 });
    const lavaWaterfallMat = new THREE.MeshStandardMaterial({ color: 0xff3300, emissive: 0xff4500, emissiveIntensity: 1.2, roughness: 0.2 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xeab308, emissiveIntensity: 0.6 });
    const gemMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 0.9 });

    // Helper: Add solid steppable basalt platform with decorative magma rim and physics collider
    function createSteppablePlatform(x, y, z, w, h, d) {
        const platGroup = new THREE.Group();
        platGroup.position.set(x, y, z);

        // Main solid stone slab
        const stoneMesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), basaltMat);
        stoneMesh.castShadow = true;
        stoneMesh.receiveShadow = true;
        platGroup.add(stoneMesh);

        // Glowing magma edge/inlay
        const rimMesh = new THREE.Mesh(new THREE.BoxGeometry(w * 0.94, 0.1, d * 0.94), magmaGlowMat);
        rimMesh.position.y = h / 2 + 0.05;
        platGroup.add(rimMesh);

        // Basalt pillars underneath
        const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.3, h + 6, 8), basaltEdgeMat);
        p1.position.set(-w / 3.2, -h / 2 - 2.5, -d / 3.2);
        platGroup.add(p1);
        const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.3, h + 6, 8), basaltEdgeMat);
        p2.position.set(w / 3.2, -h / 2 - 2.5, d / 3.2);
        platGroup.add(p2);

        game.currentLevel.mesh.add(platGroup);

        // Exact physics collider registration
        game.currentLevel.colliders.push({
            min: new THREE.Vector3(x - w / 2, y - h / 2, z - d / 2),
            max: new THREE.Vector3(x + w / 2, y + h / 2 + 0.15, z + d / 2)
        });

        return platGroup;
    }

    // Helper: Add collectible coin or gem
    function addCollectible(id, x, y, z, isGem = false) {
        const itemGroup = new THREE.Group();
        itemGroup.position.set(x, y, z);
        const mesh = new THREE.Mesh(
            isGem ? new THREE.OctahedronGeometry(0.65) : new THREE.CylinderGeometry(0.45, 0.45, 0.18, 12),
            isGem ? gemMat : goldMat
        );
        if (!isGem) mesh.rotation.x = Math.PI / 2;
        itemGroup.add(mesh);
        game.currentLevel.mesh.add(itemGroup);
        game.currentLevel.collectibles.push({
            id: id,
            type: isGem ? 'honey_gem' : 'coin',
            mesh: itemGroup,
            pos: new THREE.Vector3(x, y, z),
            collected: false,
            value: isGem ? 25 : 5
        });
    }

    // Helper: Add Jump Pad (Magma Geyser)
    function addJumpPad(x, y, z, boostForce = 22) {
        const padGroup = new THREE.Group();
        padGroup.position.set(x, y, z);
        const base = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.4, 0.6, 16), basaltEdgeMat);
        base.position.y = 0.3;
        padGroup.add(base);
        const center = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.4, 16), magmaGlowMat);
        center.position.y = 0.55;
        padGroup.add(center);
        game.currentLevel.mesh.add(padGroup);
        game.currentLevel.jumpPads.push({
            mesh: padGroup,
            pos: new THREE.Vector3(x, y, z),
            boostForce: boostForce
        });
    }

    // Helper: Add Spinning Fire Bar Hazard (Dönen Alev Çubuğu)
    function addFireBar(x, y, z, orbCount = 4, radius = 4.2, speed = 1.8) {
        const barGroup = new THREE.Group();
        barGroup.position.set(x, y, z);

        // Center Pillar Suture
        const centralPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 2.5, 8), basaltEdgeMat);
        barGroup.add(centralPillar);

        const orbMeshes = [];
        const flameMat = new THREE.MeshStandardMaterial({ color: 0xff4500, emissive: 0xff2200, emissiveIntensity: 1.5 });

        for (let i = 1; i <= orbCount; i++) {
            const dist = (i / orbCount) * radius;
            const orb = new THREE.Mesh(new THREE.SphereGeometry(0.45, 8, 8), flameMat);
            orb.position.set(dist, 1.2, 0);
            barGroup.add(orb);
            orbMeshes.push(orb);

            // Opposite wing
            const orbOpp = new THREE.Mesh(new THREE.SphereGeometry(0.45, 8, 8), flameMat);
            orbOpp.position.set(-dist, 1.2, 0);
            barGroup.add(orbOpp);
            orbMeshes.push(orbOpp);
        }

        game.currentLevel.mesh.add(barGroup);
        game.currentLevel.fireBars.push({
            mesh: barGroup,
            pos: new THREE.Vector3(x, y, z),
            orbCount: orbCount,
            radius: radius,
            speed: speed,
            orbs: orbMeshes
        });
    }

    // Helper: Add Erupting Magma Flame Vent (Patlayan Alev Menfezi)
    function addFlameVent(x, y, z) {
        const ventGroup = new THREE.Group();
        ventGroup.position.set(x, y, z);

        const rim = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.6, 0.5, 12), basaltEdgeMat);
        rim.position.y = 0.25;
        ventGroup.add(rim);

        const ventCore = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.3, 12), magmaGlowMat);
        ventCore.position.y = 0.35;
        ventGroup.add(ventCore);

        // Flame Column Mesh
        const flameColMat = new THREE.MeshStandardMaterial({
            color: 0xff3300,
            emissive: 0xff4500,
            emissiveIntensity: 1.4,
            transparent: true,
            opacity: 0.0
        });
        const flameCol = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.3, 6.0, 12), flameColMat);
        flameCol.position.y = 3.35;
        ventGroup.add(flameCol);

        game.currentLevel.mesh.add(ventGroup);
        game.currentLevel.flameVents.push({
            mesh: ventGroup,
            flameCol: flameCol,
            pos: new THREE.Vector3(x, y, z),
            timer: Math.random() * 3.0,
            state: 'idle', // idle -> warning -> erupting
            eruptDuration: 1.4,
            cycleDuration: 3.6
        });
    }

    // 2. Cascading Lava Waterfalls (Lav Şelaleleri)
    // Left Giant Lava Waterfall (Sol Lav Şelalesi)
    const leftFallWall = new THREE.Mesh(new THREE.BoxGeometry(18, 65, 8), basaltEdgeMat);
    leftFallWall.position.set(-42, 30, 0);
    game.currentLevel.mesh.add(leftFallWall);
    const leftFallFlow = new THREE.Mesh(new THREE.BoxGeometry(14, 63, 2), lavaWaterfallMat);
    leftFallFlow.position.set(-42, 29, 4.2);
    game.currentLevel.mesh.add(leftFallFlow);

    // Right Giant Lava Waterfall (Sağ Lav Şelalesi)
    const rightFallWall = new THREE.Mesh(new THREE.BoxGeometry(18, 65, 8), basaltEdgeMat);
    rightFallWall.position.set(42, 30, -25);
    game.currentLevel.mesh.add(rightFallWall);
    const rightFallFlow = new THREE.Mesh(new THREE.BoxGeometry(14, 63, 2), lavaWaterfallMat);
    rightFallFlow.position.set(42, 29, -20.8);
    game.currentLevel.mesh.add(rightFallFlow);

    // Center Summit Mega Lava Falls (Zirve Lav Şelalesi)
    const summitFallWall = new THREE.Mesh(new THREE.BoxGeometry(60, 80, 10), basaltEdgeMat);
    summitFallWall.position.set(0, 40, -180);
    game.currentLevel.mesh.add(summitFallWall);
    const summitFallFlow = new THREE.Mesh(new THREE.BoxGeometry(50, 78, 2), lavaWaterfallMat);
    summitFallFlow.position.set(0, 39, -174.8);
    game.currentLevel.mesh.add(summitFallFlow);

    // 3. Basılabilen Platformlar (Spacious Steppable Platforms Path across Lava Falls)
    // Spawn Base Platform
    game.currentLevel.spawnPoint = new THREE.Vector3(0, 2.0, 70);
    createSteppablePlatform(0, 0.8, 70, 28, 2.0, 28);

    // Checkpoint 1 (Spawn Checkpoint)
    const cp1Pos = new THREE.Vector3(0, 2.0, 70);
    const cp1Visual = createCheckpointVisual(THREE, cp1Pos);
    game.currentLevel.mesh.add(cp1Visual);
    game.currentLevel.checkpoints.push({ id: 'volcano_cp_1', name: '1. Lav Şelaleleri Vadisi Girişi', pos: cp1Pos, active: true, mesh: cp1Visual });

    // Section 1 Platforms: Stepping smoothly across lower lava river towards Left Lava Waterfall
    // 1st Pillar / Platform (z = 54)
    createSteppablePlatform(0, 1.8, 54, 16, 2.0, 14);
    addCollectible('volcano_c_1', 0, 3.5, 54);

    // Stepping Stone 1 -> 2
    createSteppablePlatform(-4, 2.7, 47, 14, 1.8, 12);

    // 2nd Pillar / Platform (z = 40)
    createSteppablePlatform(-8, 3.6, 40, 16, 2.0, 14);
    addCollectible('volcano_c_2', -8, 5.2, 40);

    // Stepping Stone 2 -> 3
    createSteppablePlatform(-13, 4.5, 33, 14, 1.8, 12);

    // 3rd Platform: Left Lava Waterfall Observation Terrace (z = 26) with Spinning Fire Bar!
    createSteppablePlatform(-18, 5.4, 26, 20, 2.2, 18);
    addCollectible('volcano_gem_1', -18, 7.4, 26, true);
    addFireBar(-18, 6.4, 26, 4, 4.5, 1.8);

    // Stepping Stone 3 -> 4
    createSteppablePlatform(-13, 6.4, 19, 14, 1.8, 12);

    // 4th Platform: Stepping Stone towards Central Arch (z = 12) with Erupting Flame Vent!
    createSteppablePlatform(-7, 7.4, 12, 16, 2.0, 14);
    addCollectible('volcano_c_3', -7, 9.2, 12);
    addFlameVent(-7, 8.4, 12);

    // Stepping Stone 4 -> 5
    createSteppablePlatform(-3, 8.4, 6, 14, 1.8, 12);

    // 5th Platform: Central Arch Platform with Geyser Jump Pad (z = 0)
    createSteppablePlatform(0, 9.4, 0, 18, 2.2, 16);
    addJumpPad(0, 10.7, 0, 20);
    addCollectible('volcano_c_4', 0, 11.4, 0);

    // Stepping Stone 5 -> 6 (Direct easy bridge to 6th Pillar!)
    createSteppablePlatform(5, 10.8, -6, 14, 2.0, 12);

    // Section 2 Platforms: Ascending across Mid Lava Falls & Right Waterfall Ledge
    // 6th Pillar / Platform (z = -12)
    createSteppablePlatform(10, 12.2, -12, 18, 2.2, 16);
    addCollectible('volcano_c_5', 10, 14.0, -12);

    // Stepping Stone 6 -> 7
    createSteppablePlatform(15, 13.6, -18, 14, 2.0, 12);

    // 7th Platform: Right Lava Waterfall Observation Terrace (z = -25) with Spinning Fire Bar!
    createSteppablePlatform(20, 15.0, -25, 20, 2.2, 18);
    addCollectible('volcano_gem_2', 20, 17.0, -25, true);
    addFireBar(20, 16.0, -25, 4, 4.5, -1.9);

    // Stepping Stone 7 -> 8
    createSteppablePlatform(15, 16.5, -32, 14, 2.0, 12);

    // 8th Platform (z = -39) with Erupting Flame Vent!
    createSteppablePlatform(9, 18.0, -39, 16, 2.0, 14);
    addCollectible('volcano_c_6', 9, 19.8, -39);
    addFlameVent(9, 19.0, -39);

    // Stepping Stone 8 -> 9
    createSteppablePlatform(4, 19.5, -45, 14, 2.0, 12);

    // 9th Platform: Mid-Mountain Checkpoint Platform with Geyser Jump Pad (z = -52)
    createSteppablePlatform(0, 21.0, -52, 22, 2.2, 20);
    addJumpPad(0, 22.3, -52, 22);
    addCollectible('volcano_gem_3', 0, 23.2, -52, true);

    const cp2Pos = new THREE.Vector3(0, 22.5, -52);
    const cp2Visual = createCheckpointVisual(THREE, cp2Pos);
    game.currentLevel.mesh.add(cp2Visual);
    game.currentLevel.checkpoints.push({ id: 'volcano_cp_2', name: '2. Lav Şelalesi Tırmanış İskelesi', pos: cp2Pos, active: false, mesh: cp2Visual });

    // Section 3 Platforms: High Magma Stepping Pillars
    // Stepping Stone 9 -> 10
    createSteppablePlatform(-5, 22.6, -59, 14, 2.0, 12);

    // 10th Platform (z = -66)
    createSteppablePlatform(-10, 24.2, -66, 16, 2.0, 14);
    addCollectible('volcano_c_7', -10, 26.0, -66);

    // Stepping Stone 10 -> 11
    createSteppablePlatform(-14, 25.7, -73, 14, 2.0, 12);

    // 11th Platform (z = -80) with Spinning Fire Bar!
    createSteppablePlatform(-17, 27.2, -80, 20, 2.2, 18);
    addCollectible('volcano_gem_4', -17, 29.2, -80, true);
    addFireBar(-17, 28.2, -80, 5, 4.8, 2.0);

    // Stepping Stone 11 -> 12
    createSteppablePlatform(-12, 28.9, -87, 14, 2.0, 12);

    // 12th Platform (z = -94) with Erupting Flame Vent!
    createSteppablePlatform(-7, 30.6, -94, 16, 2.0, 14);
    addCollectible('volcano_c_8', -7, 32.4, -94);
    addFlameVent(-7, 31.6, -94);

    // Stepping Stone 12 -> 13
    createSteppablePlatform(-3, 32.3, -101, 14, 2.0, 12);

    // 13th Platform (z = -108): High Summit Launch Platform with MEGA Geyser & Healing Crystal!
    createSteppablePlatform(0, 33.5, -108, 22, 2.2, 20);
    addCollectible('volcano_gem_5', 0, 35.5, -108, true);
    
    // 🌟 DEV ZİRVE FIRLATICI GAYZERİ (Mega Geyser to effortlessly launch into Arena!)
    addJumpPad(0, 34.8, -108, 26);

    // 💖 KUTSAL LAV ŞİFA KRİSTALİ (Full Health Restore before Boss Fight!)
    const healCrystalGroup = new THREE.Group();
    healCrystalGroup.position.set(5.5, 35.2, -108);
    const healMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.8), new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 1.2 }));
    healCrystalGroup.add(healMesh);
    game.currentLevel.mesh.add(healCrystalGroup);
    game.currentLevel.healingCrystals.push({
        mesh: healCrystalGroup,
        pos: new THREE.Vector3(5.5, 35.2, -108),
        collected: false
    });

    // 4. Görkemli Ejderha Köprüsü ve Basamak Rampası (Grand Dragon Stairway Ramp into Arena)
    // Step 1
    createSteppablePlatform(0, 34.8, -118, 18, 2.0, 12);
    // Step 2
    createSteppablePlatform(0, 36.2, -126, 20, 2.0, 12);
    // Step 3
    createSteppablePlatform(0, 37.6, -134, 22, 2.0, 12);
    // Step 4 (Giriş Kemeri Önü)
    createSteppablePlatform(0, 38.8, -142, 24, 2.0, 12);

    // Flaming Dragon Entrance Arch Pillars (Alevli Ejderha Giriş Kapısı)
    const archColL = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.8, 12, 8), basaltEdgeMat);
    archColL.position.set(-10, 42.0, -142);
    game.currentLevel.mesh.add(archColL);
    const archColR = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.8, 12, 8), basaltEdgeMat);
    archColR.position.set(10, 42.0, -142);
    game.currentLevel.mesh.add(archColR);
    const archTop = new THREE.Mesh(new THREE.BoxGeometry(22, 2.0, 3.0), basaltMat);
    archTop.position.set(0, 48.0, -142);
    game.currentLevel.mesh.add(archTop);
    const archGlow = new THREE.Mesh(new THREE.SphereGeometry(1.4, 12, 12), magmaGlowMat);
    archGlow.position.set(0, 49.5, -142);
    game.currentLevel.mesh.add(archGlow);

    // Section 4: Grand Summit Ignis Dragon Arena Platform (z = -176)
    const arenaX = 0, arenaY = 38.5, arenaZ = -176;
    const arenaW = 80, arenaH = 4.0, arenaD = 80;
    createSteppablePlatform(arenaX, arenaY, arenaZ, arenaW, arenaH, arenaD);

    // Checkpoint 3 (Boss Arena Checkpoint)
    const cp3Pos = new THREE.Vector3(0, 40.8, -144);
    const cp3Visual = createCheckpointVisual(THREE, cp3Pos);
    game.currentLevel.mesh.add(cp3Visual);
    game.currentLevel.checkpoints.push({ id: 'volcano_cp_3', name: '3. Kızıl Ejderha Ignis Zirve Arenası', pos: cp3Pos, active: false, mesh: cp3Visual });

    // Decorative Dragon Arena Pillars & Torches
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const px = arenaX + Math.cos(angle) * 34;
        const pz = arenaZ + Math.sin(angle) * 34;
        const colMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.0, 16, 8), basaltEdgeMat);
        colMesh.position.set(px, arenaY + 8, pz);
        game.currentLevel.mesh.add(colMesh);
        const torchMesh = new THREE.Mesh(new THREE.SphereGeometry(1.0, 8, 8), magmaGlowMat);
        torchMesh.position.set(px, arenaY + 16.5, pz);
        game.currentLevel.mesh.add(torchMesh);
    }

    // Friendly NPC: Lav Kedisi Kor (Ateş Kedisi 🔥🐱)
    const npcMesh = new THREE.Group();
    const npcBody = new THREE.Mesh(new THREE.SphereGeometry(0.8, 12, 12), magmaGlowMat);
    npcBody.position.y = 0.8;
    npcMesh.add(npcBody);
    const npcHead = new THREE.Mesh(new THREE.SphereGeometry(0.6, 12, 12), magmaGlowMat);
    npcHead.position.y = 1.8;
    npcMesh.add(npcHead);
    npcMesh.position.set(-6, 2.0, 68);
    game.currentLevel.mesh.add(npcMesh);
    game.currentLevel.npcs.push({
        id: 'npc_magma_cat',
        name: 'Kor (Lav & Alev Kedisi 🔥🐱)',
        role: 'Volkan Kaşifi & Rehber',
        pos: new THREE.Vector3(-6, 2.0, 68),
        mesh: npcMesh,
        avatarIcon: '🔥',
        dialogue: [
            "Miyav! Volkanik Ejderha Mağarası ve Lav Şelalelerine hoş geldin Süper Ayı!",
            "Kızıl Ejderha Ignis zirvedeki arenada 6. Kutsal Bal Kristalini saklıyor.",
            "⚠️ Dikkat et! Yolda gökten düşen lav meteorları, dönen alev çubukları, alev püskürten menfezler ve uçan magma ejdercikleri var!",
            "Zirveye yaklaştığında 13. platformdaki Dev Gayzeri kullanarak veya Ejderha Merdivenlerinden arenaya doğrudan çıkabilirsin!"
        ]
    });

    // Uçan Magma Ejdercikleri (Flying Magma Drakes patrolling hazards)
    const drake1Mesh = createFlyingMagmaDrakeMesh(THREE);
    drake1Mesh.position.set(-10, 9.5, 33);
    game.currentLevel.mesh.add(drake1Mesh);
    game.currentLevel.enemies.push({
        id: 'drake_hazard_1',
        type: 'flying_magma_drake',
        name: 'Uçan Magma Ejderciği 🦇🔥',
        mesh: drake1Mesh,
        pos: new THREE.Vector3(-10, 9.5, 33),
        originPos: new THREE.Vector3(-10, 9.5, 33),
        hp: 50,
        maxHp: 50,
        attackPower: 10,
        attackCooldown: 2.0,
        animTimer: 0
    });

    const drake2Mesh = createFlyingMagmaDrakeMesh(THREE);
    drake2Mesh.position.set(14, 18.5, -20);
    game.currentLevel.mesh.add(drake2Mesh);
    game.currentLevel.enemies.push({
        id: 'drake_hazard_2',
        type: 'flying_magma_drake',
        name: 'Alev Kanatlı Magma Ejderciği 🦇🔥',
        mesh: drake2Mesh,
        pos: new THREE.Vector3(14, 18.5, -20),
        originPos: new THREE.Vector3(14, 18.5, -20),
        hp: 50,
        maxHp: 50,
        attackPower: 10,
        attackCooldown: 2.5,
        animTimer: 1.5
    });

    const drake3Mesh = createFlyingMagmaDrakeMesh(THREE);
    drake3Mesh.position.set(-12, 31.0, -75);
    game.currentLevel.mesh.add(drake3Mesh);
    game.currentLevel.enemies.push({
        id: 'drake_hazard_3',
        type: 'flying_magma_drake',
        name: 'Kızgın Volkan Ejderciği 🦇🔥',
        mesh: drake3Mesh,
        pos: new THREE.Vector3(-12, 31.0, -75),
        originPos: new THREE.Vector3(-12, 31.0, -75),
        hp: 50,
        maxHp: 50,
        attackPower: 10,
        attackCooldown: 3.0,
        animTimer: 3.0
    });

    // Dragon Boss: Kızıl Alev Ejderhası Ignis
    const dragonBoss = createDragonMesh(THREE, true);
    const dragonPos = new THREE.Vector3(0, 40.5, -176);
    dragonBoss.position.copy(dragonPos);
    dragonBoss.rotation.y = Math.PI; // Face towards entering player
    game.currentLevel.mesh.add(dragonBoss);

    game.currentLevel.enemies.push({
        id: 'boss_volcano_dragon',
        type: 'volcano_dragon_boss',
        name: 'Kızıl Alev Ejderhası Ignis (Dev Boss 🌋)',
        mesh: dragonBoss,
        pos: dragonPos,
        velocity: new THREE.Vector3(),
        hp: 800,
        maxHp: 800,
        attackPower: 18,
        isBoss: true,
        attackCooldown: 0,
        state: 'chase',
        animTimer: 0
    });
}


underwaterPalacePopulated = false;

function populateUnderwaterPalace(game) {
    if (game && game.currentLevel) ensureLevelArrays(game.currentLevel);

    if (!game || !game.scene || !window.THREE) return;
    const THREE = window.THREE;

    if (!game.currentLevel) game.currentLevel = {};
    if (game.currentLevel.sceneGroup) {
        game.currentLevel.mesh = game.currentLevel.sceneGroup;
    } else if (!game.currentLevel.mesh) {
        game.currentLevel.mesh = new THREE.Group();
        game.scene.add(game.currentLevel.mesh);
    }

    // Reset old meshes
    if (game.currentLevel.mesh && game.currentLevel.mesh.children) {
        const toRemove = [];
        ((game.currentLevel.mesh && game.currentLevel.mesh.children) || []).forEach(c => {
            if (c.name !== 'region_portal') toRemove.push(c);
        });
        toRemove.forEach(c => game.currentLevel.mesh.remove(c));
    }

    game.currentLevel.enemies = [];
    game.currentLevel.collectibles = [];
    game.currentLevel.jumpPads = [];
    game.currentLevel.checkpoints = [];
    game.currentLevel.npcs = [];
    game.currentLevel.colliders = [];
    game.currentLevel.movingPlatforms = [];
    game.currentLevel.waterBlades = [];
    game.currentLevel.jellyfishes = [];
    game.currentLevel.waterMeteors = [];
    game.currentLevel.nextMeteorTimer = 2.0;

    game.currentLevel.bounds = { minX: -500, maxX: 500, minZ: -600, maxZ: 300, minY: -30, maxY: 300 };

    // Water Palace environment - Radiant Ocean Blue Sky
    game.scene.background = new THREE.Color(0x0284c7);
    game.scene.fog = new THREE.Fog(0x38bdf8, 30, 260);

    // Deep Ocean Floor (Toxic/Reset)
    const oceanFloorGeo = new THREE.BoxGeometry(1000, 2, 1000);
    const oceanFloorMat = new THREE.MeshStandardMaterial({ color: 0x000a14, roughness: 0.9 });
    const floor = new THREE.Mesh(oceanFloorGeo, oceanFloorMat);
    floor.position.set(0, -6, 0);
    game.currentLevel.mesh.add(floor);
    
    // Materials
    const marbleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.2, metalness: 0.2 });
    const darkMarbleMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.3 });
    const crystalMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0891b2, emissiveIntensity: 0.6, transparent: true, opacity: 0.8 });
    const hazardMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 1.2 });

    // Helper: Static Platform
    function createPlatform(x, y, z, w, h, d, colorMat = marbleMat) {
        const plat = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), colorMat);
        plat.position.set(x, y, z);
        plat.receiveShadow = true;
        plat.castShadow = true;
        game.currentLevel.mesh.add(plat);
        game.currentLevel.colliders.push({
            min: new THREE.Vector3(x - w / 2, y - h / 2, z - d / 2),
            max: new THREE.Vector3(x + w / 2, y + h / 2, z + d / 2)
        });
        return plat;
    }

    // Helper: Moving Platform
    function createMovingPlatform(x, y, z, w, h, d, moveVec, speed) {
        const platGroup = new THREE.Group();
        platGroup.position.set(x, y, z);
        const plat = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), darkMarbleMat);
        plat.position.set(0,0,0);
        platGroup.add(plat);
        game.currentLevel.mesh.add(platGroup);
        
        // Add a visual glow
        const glow = new THREE.Mesh(new THREE.BoxGeometry(w+0.2, h+0.2, d+0.2), new THREE.MeshBasicMaterial({color: 0x0ea5e9, transparent:true, opacity: 0.3}));
        platGroup.add(glow);

        game.currentLevel.movingPlatforms.push({
            mesh: platGroup,
            basePos: new THREE.Vector3(x, y, z),
            moveVec: moveVec,
            speed: speed,
            w: w, h: h, d: d,
            timer: Math.random() * Math.PI * 2,
            currentPos: new THREE.Vector3(x, y, z)
        });
    }

    // Helper: Spinning Water Blade
    function addWaterBlade(x, y, z, radius, speed) {
        const bladeGroup = new THREE.Group();
        bladeGroup.position.set(x, y, z);
        
        const center = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 2, 8), darkMarbleMat);
        bladeGroup.add(center);

        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const blade = new THREE.Mesh(new THREE.BoxGeometry(radius, 0.2, 0.5), hazardMat);
            blade.position.x = Math.cos(angle) * (radius / 2);
            blade.position.z = Math.sin(angle) * (radius / 2);
            blade.rotation.y = -angle;
            bladeGroup.add(blade);
        }

        game.currentLevel.mesh.add(bladeGroup);
        game.currentLevel.waterBlades.push({
            mesh: bladeGroup,
            pos: new THREE.Vector3(x, y, z),
            radius: radius,
            speed: speed
        });
    }

    // Helper: Geyser (Jump Pad)
    function addGeyser(x, y, z, boostForce) {
        const pad = new THREE.Mesh(new THREE.CylinderGeometry(2, 2.5, 1, 16), crystalMat);
        pad.position.set(x, y, z);
        game.currentLevel.mesh.add(pad);
        
        const core = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 1.2, 16), new THREE.MeshBasicMaterial({color: 0xffffff}));
        core.position.set(x, y, z);
        game.currentLevel.mesh.add(core);

        game.currentLevel.jumpPads.push({
            pos: new THREE.Vector3(x, y, z),
            boostForce: boostForce
        });
    }

    // Helper: Visual Checkpoint
    function addCheckpoint(x, y, z, id, name) {
        const cpGroup = new THREE.Group();
        cpGroup.position.set(x, y, z);
        
        // Base pad
        const cpBase = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.4, 16), new THREE.MeshStandardMaterial({ color: 0x555555 }));
        cpGroup.add(cpBase);
        
        // Flag pole
        const cpPole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3, 8), new THREE.MeshStandardMaterial({ color: 0xcccccc }));
        cpPole.position.y = 1.5;
        cpGroup.add(cpPole);
        
        // Flag cloth (Red by default)
        const cpFlagCloth = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.1), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
        cpFlagCloth.position.set(0.6, 2.5, 0);
        cpGroup.add(cpFlagCloth);
        
        game.currentLevel.mesh.add(cpGroup);
        
        game.currentLevel.checkpoints.push({
            id: id,
            name: name,
            pos: new THREE.Vector3(x, y + 1, z),
            active: false,
            mesh: cpGroup
        });
    }

    // --- HARDCORE 10 MINUTE OBSTACLE COURSE ---
    
    // SECTION 1: Spawn & Warmup
    createPlatform(0, 0, 0, 16, 2, 16);
    game.currentLevel.spawnPoint = new THREE.Vector3(0, 2, 0);

    createPlatform(0, 0, -18, 8, 2, 8);
    createPlatform(0, 0, -28, 6, 2, 6); // Extra platform
    createPlatform(0, 0, -38, 6, 2, 6);
    createPlatform(2.5, 0.5, -46, 5, 2, 5); // Extra platform
    createPlatform(5, 1, -54, 4, 2, 4);
    createPlatform(10, 1.5, -62, 5, 2, 5); // Extra platform
    createPlatform(15, 2, -70, 4, 2, 4);
    createPlatform(20, 2.5, -78, 6, 2, 6); // Extra platform
    createPlatform(25, 3, -86, 8, 2, 8);
    addWaterBlade(25, 4.5, -86, 6, 1.2); // First hazard

    // SECTION 2: The Moving Gap (Long chasm)
    createPlatform(25, 3, -96, 6, 2, 6); // Extra platform
    createPlatform(20, 3, -106, 10, 2, 10);
    addCheckpoint(20, 4, -106, 'cp_uw_0', 'Hareketli Uçurum Önü');
    
    // Move on X axis (Closer Z gaps)
    createMovingPlatform(10, 3, -118, 8, 2, 8, new THREE.Vector3(-15, 0, 0), 0.75);
    createPlatform(0, 3.5, -128, 6, 2, 6); // Static safe spot
    createMovingPlatform(-10, 4, -138, 8, 2, 8, new THREE.Vector3(15, 0, 0), 1.0);
    createPlatform(0, 4.5, -148, 6, 2, 6);
    addCheckpoint(0, 5.5, -148, 'cp_uw_0_5', 'Uçurum Dinlenme Noktası');
    createMovingPlatform(10, 5, -158, 8, 2, 8, new THREE.Vector3(-20, 0, 0), 1.25);
    
    // Save Point 1
    createPlatform(0, 5.5, -168, 6, 2, 6); // Extra platform
    createPlatform(-10, 6, -178, 12, 2, 12);
    addCheckpoint(-10, 7, -178, 'cp_uw_1', 'Karanlık Uçurum Çıkışı');

    // SECTION 3: The Grand Staircase
    createPlatform(-10, 6, -188, 6, 2, 6); // Extra platform
    
    // A long majestic staircase up to y=60 instead of geysers
    for (let i = 1; i <= 25; i++) {
        const stepY = 6 + (i * 2.16); // 54 total height
        const stepZ = -188 - (i * 3.4); // 85 total distance
        
        // Add a few water blades as hazards on some larger steps
        if (i === 9 || i === 18) {
            createPlatform(-10, stepY, stepZ, 10, 1.5, 10);
            addWaterBlade(-10, stepY + 1.5, stepZ, 6, 1.2 * (i % 2 === 0 ? 1 : -1));
        } else {
            createPlatform(-10, stepY, stepZ, 6, 1.5, 6, crystalMat); // Crystal steps
        }
    }

    createPlatform(-10, 60, -273, 16, 2, 16);
    addCheckpoint(-10, 61, -273, 'cp_uw_2', 'Zirve Platformu');

    // SECTION 4: The Blade Corridor (with more platforms between them)
    createPlatform(-10, 60, -285, 6, 2, 6); // Extra platform
    createPlatform(-10, 60, -297, 6, 2, 6);
    addWaterBlade(-10, 61.5, -297, 7, 1.7);
    createPlatform(-10, 60, -309, 6, 2, 6); // Extra platform
    createPlatform(-10, 60, -321, 6, 2, 6);
    addWaterBlade(-10, 61.5, -321, 7, -1.7);
    createPlatform(-10, 60, -333, 6, 2, 6); // Extra platform
    createPlatform(-10, 60, -345, 6, 2, 6);
    addWaterBlade(-10, 61.5, -345, 7, 2.0);

    createPlatform(-10, 60, -357, 8, 2, 8); // Extra platform
    createPlatform(-10, 60, -370, 12, 2, 12);
    addCheckpoint(-10, 61, -370, 'cp_uw_2_5', 'Hareketli Labirent Önü');

    // SECTION 5: Giant Moving Maze (with static rest stops)
    createPlatform(-10, 60, -382, 6, 2, 6); // Rest stop
    createMovingPlatform(-25, 60, -394, 10, 2, 10, new THREE.Vector3(35, 0, 0), 0.5);
    createPlatform(0, 60, -406, 6, 2, 6); // Rest stop
    createMovingPlatform(10, 60, -418, 10, 2, 10, new THREE.Vector3(-35, 0, 0), 0.6);
    createPlatform(-10, 61, -430, 6, 2, 6);
    addCheckpoint(-10, 62, -430, 'cp_uw_2_6', 'Labirent Dinlenme Noktası');
    createMovingPlatform(-25, 62, -442, 10, 2, 10, new THREE.Vector3(35, 0, 0), 0.75);
    createPlatform(0, 63, -454, 6, 2, 6); // Rest stop
    createMovingPlatform(10, 64, -466, 10, 2, 10, new THREE.Vector3(-35, 0, 0), 0.9);
    createPlatform(-10, 64, -478, 6, 2, 6); // Rest stop

    createPlatform(-10, 64, -490, 12, 2, 12);
    addCheckpoint(-10, 65, -490, 'cp_uw_3', 'Son Düzlük (Kraken Arena Girişi)');

    // SECTION 6: The Falling Crystal Meteors Path
    // A long narrow path to the final palace where blue meteors rain down
    createPlatform(-10, 64, -480, 6, 2, 60);

    // Final Grand Palace (Kraken Arena)
    createPlatform(-10, 64, -540, 60, 2, 60);

    // Palace Pillars
    for(let i=0; i<4; i++) {
        for(let j=0; j<4; j++) {
            if (i===0 || i===3 || j===0 || j===3) {
                const px = -10 - 25 + (i * 16.6);
                const pz = -540 - 25 + (j * 16.6);
                const pillar = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 30, 8), darkMarbleMat);
                pillar.position.set(px, 79, pz);
                game.currentLevel.mesh.add(pillar);
                
                const orb = new THREE.Mesh(new THREE.SphereGeometry(3, 8, 8), crystalMat);
                orb.position.set(px, 95, pz);
                game.currentLevel.mesh.add(orb);
            }
        }
    }

    // A giant glowing crystal representing the goal
    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(4), crystalMat);
    crystal.position.set(-10, 72, -540);
    game.currentLevel.mesh.add(crystal);

    // 🦑 GIANT KRAKEN BOSS
    game.currentLevel.krakenProjectiles = [];
    game.currentLevel.krakenShootTimer = 2.0;
    
    // Boss State
    game.currentLevel.krakenState = 'air';
                  game.currentLevel.krakenStateTimer = 20.0;
                  if(typeof playKrakenSound==='function') playKrakenSound('warn');
    game.currentLevel.krakenHp = 3;
    game.currentLevel.krakenTargetY = 85;

    const krakenGroup = new THREE.Group();
    // Head/Body
    const krakenMat = new THREE.MeshStandardMaterial({color: 0x6b21a8, roughness: 0.3});
    const krakenHead = new THREE.Mesh(new THREE.SphereGeometry(10, 16, 16), krakenMat);
    krakenHead.position.set(0, 0, 0);
    krakenGroup.add(krakenHead);
    
    // Eyes
    const eyeMat = new THREE.MeshBasicMaterial({color: 0xfde047});
    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(1.5), eyeMat);
    leftEye.position.set(-3.5, 3, 8.5);
    krakenGroup.add(leftEye);
    const rightEye = new THREE.Mesh(new THREE.SphereGeometry(1.5), eyeMat);
    rightEye.position.set(3.5, 3, 8.5);
    krakenGroup.add(rightEye);
    
    // Tentacles
    for(let i=0; i<8; i++) {
        const tentacle = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 0.2, 15), krakenMat);
        const angle = (i/8) * Math.PI * 2;
        tentacle.position.set(Math.cos(angle)*8, -6, Math.sin(angle)*8);
        tentacle.rotation.x = Math.PI / 2.5;
        tentacle.rotation.y = -angle;
        krakenGroup.add(tentacle);
    }
    
    krakenGroup.position.set(-10, 85, -570);
    game.currentLevel.mesh.add(krakenGroup);
    game.currentLevel.kraken = krakenGroup;
}
function populateDinosaurWorld(game) {
    if (game && game.currentLevel) ensureLevelArrays(game.currentLevel);

    const THREE = window.THREE;
    if (!game.currentLevel) game.currentLevel = {};
    if (game.currentLevel.sceneGroup) {
        game.currentLevel.mesh = game.currentLevel.sceneGroup;
    } else if (!game.currentLevel.mesh) {
        game.currentLevel.mesh = new THREE.Group();
        game.scene.add(game.currentLevel.mesh);
    }
    
    if (!game.currentLevel.enemies) game.currentLevel.enemies = [];
    if (!game.currentLevel.bounds) game.currentLevel.bounds = { minX: -200, maxX: 200, minZ: -200, maxZ: 200, minY: -10, maxY: 200 };
    if (!game.currentLevel.colliders) game.currentLevel.colliders = [];
    if (!game.currentLevel.fireballs) game.currentLevel.fireballs = [];
    if (!game.currentLevel.checkpoints) game.currentLevel.checkpoints = [];

    game.scene.background = new THREE.Color(0x3b0764); 
    game.scene.fog = new THREE.Fog(0x3b0764, 20, 150);

    const floorGeo = new THREE.BoxGeometry(300, 2, 300);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x2e1065, roughness: 0.9 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(0, -1, 0);
    game.currentLevel.mesh.add(floor);

    game.currentLevel.colliders.push({
        min: new THREE.Vector3(-150, -2, -150),
        max: new THREE.Vector3(150, 0, 150)
    });

    const platMat = new THREE.MeshStandardMaterial({ color: 0x7e22ce, roughness: 0.7 });
    const stepMat = new THREE.MeshStandardMaterial({ color: 0xc084fc, roughness: 0.8 });
    const obstacleMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.5 }); // Yellow obstacles
    const spikeMat = new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.5 }); // Red obstacles

    // Giant Boss Tower & Grand Arena Platform (Spacious & Solid Battlefield)
    const towerGeo = new THREE.CylinderGeometry(28, 32, 50, 24);
    const tower = new THREE.Mesh(towerGeo, platMat);
    tower.position.set(0, 24, -90);
    game.currentLevel.mesh.add(tower);

    // Grand Boss Arena Floor Disc (Solid circular platform at Y: 49.2)
    const arenaTopGeo = new THREE.CylinderGeometry(30, 30, 2.0, 32);
    const arenaTop = new THREE.Mesh(arenaTopGeo, stepMat);
    arenaTop.position.set(0, 48.2, -90);
    arenaTop.receiveShadow = true;
    game.currentLevel.mesh.add(arenaTop);

    // Entrance Bridge connecting step 27 to Boss Arena (Z: -60 to -75, Y: 48.6 to 49.2)
    const bridgeGeo = new THREE.BoxGeometry(16, 2.0, 16);
    const bridge = new THREE.Mesh(bridgeGeo, platMat);
    bridge.position.set(-6, 48.2, -66);
    game.currentLevel.mesh.add(bridge);

    const bridgeRampGeo = new THREE.BoxGeometry(14, 1.8, 12);
    const bridgeRamp = new THREE.Mesh(bridgeRampGeo, stepMat);
    bridgeRamp.position.set(0, 48.4, -72);
    game.currentLevel.mesh.add(bridgeRamp);

    // Arena Outer Curb / Railing Blocks
    const curbMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.6 });
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
        if (angle > Math.PI * 0.35 && angle < Math.PI * 0.65) continue; // Leave opening for entrance bridge
        const curb = new THREE.Mesh(new THREE.BoxGeometry(4, 1.2, 2), curbMat);
        curb.position.set(Math.cos(angle) * 29, 49.8, -90 + Math.sin(angle) * 29);
        curb.rotation.y = -angle;
        game.currentLevel.mesh.add(curb);
    }
    
    // Boss Arena Floor Colliders (Full Solid Landing Area)
    game.currentLevel.colliders.push({
        min: new THREE.Vector3(-32, 46.0, -122),
        max: new THREE.Vector3(32, 49.4, -58)
    });

    // Entrance Bridge Collider connecting smoothly from step 27
    game.currentLevel.colliders.push({
        min: new THREE.Vector3(-18, 46.0, -76),
        max: new THREE.Vector3(8, 49.4, -56)
    });

    // Checkpoint before Boss
    const cpPos = new THREE.Vector3(0, 49.8, -68);
    const cpVisual = createCheckpointVisual(THREE, cpPos);
    game.currentLevel.mesh.add(cpVisual);
    game.currentLevel.checkpoints.push({ pos: cpPos, active: false });

    // Spawn Point Checkpoint
    game.currentLevel.spawnPoint = new THREE.Vector3(0, 0.5, 60);

    // Obstacles and Steps (Mor Bal theme)
    // Make them progressively harder
    for (let i = 0; i < 28; i++) {
        // Step size
        const step = new THREE.Mesh(new THREE.BoxGeometry(6, 1.5, 6), stepMat);
        const stepX = Math.sin(i * 0.4) * 15;
        const stepY = i * 1.8;
        const stepZ = 40 - i * 3.8;
        step.position.set(stepX, stepY, stepZ);
        game.currentLevel.mesh.add(step);
        game.currentLevel.colliders.push({
            min: new THREE.Vector3(step.position.x - 3, step.position.y - 0.75, step.position.z - 3),
            max: new THREE.Vector3(step.position.x + 3, step.position.y + 0.75, step.position.z + 3)
        });

        // Add some random towers as obstacles that block the path
        if (i > 3 && i % 2 === 0) {
            // Rotating/static obstacles
            const ob = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 6, 8), obstacleMat);
            const obOffset = (Math.random() > 0.5 ? 2 : -2);
            ob.position.set(step.position.x + obOffset, step.position.y + 3, step.position.z);
            game.currentLevel.mesh.add(ob);
            game.currentLevel.colliders.push({
                min: new THREE.Vector3(ob.position.x - 1.5, ob.position.y - 3, ob.position.z - 1.5),
                max: new THREE.Vector3(ob.position.x + 1.5, ob.position.y + 3, ob.position.z + 1.5)
            });
        }
        
        // Add toxic/damage obstacles (red spikes) on some steps
        if (i > 8 && i % 3 === 0) {
            const spike = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 8), spikeMat);
            spike.position.set(step.position.x, step.position.y + 1.5, step.position.z);
            game.currentLevel.mesh.add(spike);
            
            // Push toxic collider
            game.currentLevel.colliders.push({
                min: new THREE.Vector3(spike.position.x - 1, spike.position.y - 1, spike.position.z - 1),
                max: new THREE.Vector3(spike.position.x + 1, spike.position.y + 1, spike.position.z + 1),
                isToxic: true // Toxic makes player take damage if touched
            });
        }
    }

    // Mini Dinosaurs
    for(let i=0; i<20; i++) {
        const miniDino = createDinoMesh(THREE, false);
        const pos = new THREE.Vector3((Math.random()-0.5)*140, 0.5, (Math.random()-0.5)*100 + 40);
        miniDino.position.copy(pos);
        game.currentLevel.mesh.add(miniDino);
        
        game.currentLevel.enemies.push({
            id: `mini_dino_${i}`,
            type: 'dino_minion',
            name: 'Küçük Dinozor',
            mesh: miniDino,
            pos: pos,
            velocity: new THREE.Vector3(),
            hp: 100,
            maxHp: 100,
            attackPower: 3,
            isBoss: false,
            attackCooldown: 0,
            state: 'chase',
            animTimer: Math.random() * 10
        });
    }

    // Dev T-Rex Boss
    const trexBoss = createDinoMesh(THREE, true);
    const bossPos = new THREE.Vector3(0, 49, -95);
    trexBoss.position.copy(bossPos);
    game.currentLevel.mesh.add(trexBoss);
    
    game.currentLevel.enemies.push({
        id: 'boss_trex',
        type: 'dino_trex_boss',
        name: 'Dev T-Rex Boss',
        mesh: trexBoss,
        pos: bossPos,
        velocity: new THREE.Vector3(),
        hp: 1000,
        maxHp: 1000,
        attackPower: 15,
        isBoss: true,
        attackCooldown: 0,
        state: 'chase',
        animTimer: 0
    });
}

sugarWorldPopulated = false;
let playerSlowTimer = 0;

function populateSugarWorld(game) {
    if (!game || !game.scene || !window.THREE) return;
    const THREE = window.THREE;

    if (!game.currentLevel) game.currentLevel = {};
    ensureLevelArrays(game.currentLevel);

    // Clear all lists to avoid old leftovers
    game.currentLevel.enemies = [];
    game.currentLevel.collectibles = [];
    game.currentLevel.checkpoints = [];
    game.currentLevel.npcs = [];
    game.currentLevel.artEasels = [];
    game.currentLevel.jumpPads = [];
    game.currentLevel.movingPlatforms = [];
    game.currentLevel.waterBlades = [];
    game.currentLevel.mushrooms = [];
    game.currentLevel.spikes = [];
    game.currentLevel.sugarProjectiles = [];
    game.currentLevel.houses = [];
    game.currentLevel.lollipops = [];
    game.currentLevel.colliders = [];
    
    // Remove old mesh from the scene to prevent overlaying duplicate structures
    if (game.currentLevel.mesh) {
        if (game.currentLevel.mesh.parent) game.currentLevel.mesh.parent.remove(game.currentLevel.mesh);
        else if (game.scene) game.scene.remove(game.currentLevel.mesh);
    }

    game.currentLevel.mesh = new THREE.Group();
    game.currentLevel.mesh.name = "sugar_world_mesh";
    game.scene.add(game.currentLevel.mesh);
    
    // Expanded boundary depth to allow a very long parkour level without hitting invisible boundary checks
    game.currentLevel.bounds = { minX: -400, maxX: 400, minZ: -750, maxZ: 150, minY: -30, maxY: 600 };

    // Pink Sky & fog ("pembe hava")
    game.scene.background = new THREE.Color(0xfbcfe8); 
    game.scene.fog = new THREE.Fog(0xfbcfe8, 15, 220);

    // Fluffy pink candy clouds at the bottom ("altı pembe")
    const cloudMat = new THREE.MeshStandardMaterial({ 
        color: 0xf472b6, 
        roughness: 0.9, 
        transparent: true, 
        opacity: 0.85 
    });
    for (let i = 0; i < 40; i++) {
        const cloudGroup = new THREE.Group();
        const cx = (Math.random() - 0.5) * 220;
        const cz = (Math.random() - 0.5) * 240 - 20;
        const cy = -14 - Math.random() * 8;
        cloudGroup.position.set(cx, cy, cz);
        
        const numBlobs = 3 + Math.floor(Math.random() * 5);
        for (let j = 0; j < numBlobs; j++) {
            const size = 7 + Math.random() * 9;
            const blob = new THREE.Mesh(new THREE.SphereGeometry(size, 8, 8), cloudMat);
            blob.position.set(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 10
            );
            cloudGroup.add(blob);
        }
        game.currentLevel.mesh.add(cloudGroup);
    }

    // Massive Glowing 3D Rainbow Arching in the Sky ("gökkuşağı")
    const rainbowColors = [0xef4444, 0xf97316, 0xeab308, 0x10b981, 0x3b82f6, 0xa855f7];
    for (let r = 0; r < rainbowColors.length; r++) {
        const color = rainbowColors[r];
        const radius = 100 + r * 3;
        const steps = 60;
        for (let s = 0; s <= steps; s++) {
            const t = s / steps;
            const angle = Math.PI * t; // 0 to 180 degrees
            const rx = Math.cos(angle) * radius;
            const ry = Math.sin(angle) * radius - 20;
            const rz = -35 + (r * 0.4);
            
            const segment = new THREE.Mesh(
                new THREE.BoxGeometry(8, 2.2, 2.5),
                new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.85 })
            );
            segment.position.set(rx, ry, rz);
            segment.rotation.z = angle + Math.PI/2;
            game.currentLevel.mesh.add(segment);
        }
    }

    // Helper to create solid platform with standard collider boundaries
    function createStaticPlatform(x, y, z, w, h, d, color = 0xdb2777) {
        const mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.4, metalness: 0.1 });
        const plat = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
        plat.position.set(x, y, z);
        game.currentLevel.mesh.add(plat);
        game.currentLevel.colliders.push({
            min: new THREE.Vector3(x - w/2 - 0.7, y - h/2 - 0.6, z - d/2 - 0.7),
            max: new THREE.Vector3(x + w/2 + 0.7, y + h/2 + 0.6, z + d/2 + 0.7)
        });
        return plat;
    }

    // Helper to create a fake/unstable/holographic trap platform (NO COLLIDER - falls through)
    function createFakePlatform(x, y, z, w, h, d, color = 0xdb2777) {
        const mat = new THREE.MeshStandardMaterial({ 
            color: color, 
            roughness: 0.1, 
            metalness: 0.15,
            transparent: true,
            opacity: 0.8 // Looks fully solid to trick players but is slightly translucent
        });
        const plat = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
        plat.position.set(x, y, z);
        
        // Glowing overlay lines to hint it's unstable or special
        const wireGeo = new THREE.BoxGeometry(w + 0.05, h + 0.05, d + 0.05);
        const wireMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e, wireframe: true, transparent: true, opacity: 0.3 });
        const wire = new THREE.Mesh(wireGeo, wireMat);
        plat.add(wire);

        game.currentLevel.mesh.add(plat);
        return plat;
    }

    // Helper to register moving platforms
    const platMat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.5 });
    function createMovingPlatform(x, y, z, w, h, d, moveVec, speed) {
        const platGroup = new THREE.Group();
        platGroup.position.set(x, y, z);
        const plat = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), platMat);
        platGroup.add(plat);
        game.currentLevel.mesh.add(platGroup);
        game.currentLevel.movingPlatforms.push({
            mesh: platGroup,
            basePos: new THREE.Vector3(x, y, z),
            moveVec: moveVec,
            speed: speed,
            w: w, h: h, d: d,
            timer: Math.random() * Math.PI * 2,
            currentPos: new THREE.Vector3(x, y, z)
        });
    }

    // Helper to register geyser jump pads
    function createJumpPad(x, y, z, boostForce = 22) {
        const padGroup = new THREE.Group();
        padGroup.position.set(x, y, z);
        const base = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.9, 0.5, 12), new THREE.MeshStandardMaterial({ color: 0xdb2777 }));
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.3, 12), new THREE.MeshStandardMaterial({ color: 0xfdf2f8, emissive: 0xec4899, emissiveIntensity: 0.6 }));
        cap.position.y = 0.3;
        padGroup.add(base, cap);
        game.currentLevel.mesh.add(padGroup);
        game.currentLevel.jumpPads.push({
            pos: new THREE.Vector3(x, y + 0.3, z),
            boostForce: boostForce
        });
    }

    // Helper to register hazard spikes
    function createSpike(x, y, z) {
        const spike = new THREE.Mesh(new THREE.ConeGeometry(1.1, 3.2, 8), new THREE.MeshStandardMaterial({ color: 0xbe185d, roughness: 0.3, metalness: 0.2 }));
        spike.position.set(x, y + 1.6, z);
        game.currentLevel.mesh.add(spike);
        game.currentLevel.spikes.push({ pos: new THREE.Vector3(x, y + 1.6, z), radius: 1.6 });
    }

    // --- TRACKS & PARKOUR LEVEL DESIGN ("zorlu parkurlar") ---

    // 1. Starting Platform (Spawn)
    const spawnY = 10;
    createStaticPlatform(0, spawnY, 70, 16, 2, 16, 0xf472b6);
    game.currentLevel.spawnPoint = new THREE.Vector3(0, spawnY + 1.5, 70);

    const startCpPos = new THREE.Vector3(0, spawnY + 1.1, 74);
    const startCpVisual = createCheckpointVisual(THREE, startCpPos);
    game.currentLevel.mesh.add(startCpVisual);
    game.currentLevel.checkpoints.push({ pos: startCpPos, active: true, name: "Sihirli Pembe Geçit", mesh: startCpVisual });

    // 2. Floating Macaron Steps (Optimized with comfortable size 7 and 12-unit jump distances!)
    createStaticPlatform(0, 11, 62, 7, 1.5, 7, 0xec4899);
    createStaticPlatform(0, 12, 50, 7, 1.5, 7, 0xf43f5e);
    createStaticPlatform(0, 12.5, 38, 7, 1.5, 7, 0xd946ef);
    createStaticPlatform(0, 13, 26, 7, 1.5, 7, 0xdb2777);

    // 3. THE LONG SOLID PLATFORM (Now fully solid and playable!)
    // Spans beautifully straight from z=20 to z=-15, fully solid so you can cross it easily!
    createStaticPlatform(0, 13, 2, 6, 1.2, 36, 0xdb2777);

    // Visual helper warning sign next to the fake bridge
    const signGroup = new THREE.Group();
    signGroup.position.set(0, 13, 23);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.2, 8), new THREE.MeshStandardMaterial({ color: 0x78350f }));
    post.position.y = 1.6;
    const board = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.0, 0.3), new THREE.MeshStandardMaterial({ color: 0xbe185d, roughness: 0.1 }));
    board.position.set(0, 3.2, 0);
    signGroup.add(post, board);
    game.currentLevel.mesh.add(signGroup);

    // 3 Solid Bypass Sweet Macarons on the sides to bypass the fake bridge safely
    createStaticPlatform(-7.5, 13.2, 15, 3.2, 1.2, 3.2, 0x10b981); // Green bypass left
    createStaticPlatform(7.5, 12.8, 2, 3.2, 1.2, 3.2, 0xf59e0b);   // Gold bypass right
    createStaticPlatform(-7.5, 13.2, -11, 3.2, 1.2, 3.2, 0x06b6d4); // Cyan bypass left

    // 4. Launch Pad Geyser Pillar
    createStaticPlatform(0, 12.5, -28, 5, 2, 5, 0x10b981);
    createJumpPad(0, 13.5, -28, 25); // Launching the player high up and forward!

    // 5. High-Altitude Wafer Sky Platform
    createStaticPlatform(0, 24, -43, 8, 1.5, 8, 0xf59e0b); // Safe golden high-point landing

    // Checkpoint 1.5: Wafer Sky High Point (Yeni Eklenen Kontrol Noktası!)
    const cp1_5Pos = new THREE.Vector3(0, 24 + 1.1, -41);
    const cp1_5Visual = createCheckpointVisual(THREE, cp1_5Pos);
    game.currentLevel.mesh.add(cp1_5Visual);
    game.currentLevel.checkpoints.push({ pos: cp1_5Pos, active: false, name: "Yüksek Gofret Geçidi", mesh: cp1_5Visual });

    // 6. Descending Floating Candy Step (Now a sequence of hard static precision candy steps!)
    createStaticPlatform(-8, 22.5, -57, 7, 1.2, 7, 0xeab308);
    createStaticPlatform(5, 18.5, -66, 7, 1.2, 7, 0xef4444);  // expanded red sweet step
    createStaticPlatform(0, 16.5, -73, 7, 1.2, 7, 0xf97316);  // expanded orange sweet step
    createStaticPlatform(-5, 14.5, -78, 7, 1.2, 7, 0xeab308); // expanded yellow sweet step

    // 7. Checkpoint 2: The Cotton Candy Oasis
    const checkpoint2Y = 16.5;
    createStaticPlatform(0, checkpoint2Y, -85, 12, 2, 12, 0x6366f1);
    
    const cp2Pos = new THREE.Vector3(0, checkpoint2Y + 1.1, -82);
    const cp2Visual = createCheckpointVisual(THREE, cp2Pos);
    game.currentLevel.mesh.add(cp2Visual);
    game.currentLevel.checkpoints.push({ pos: cp2Pos, active: false, name: "Şeker Tepesi Zirvesi", mesh: cp2Visual });

    // 8. Narrow Candy Cane Ridge (Dangerous Bridge with Spikes)
    createStaticPlatform(0, 16, -102, 7, 1.5, 16, 0xffffff); // comfortable white bridge
    createSpike(0, 16.7, -102); // spike in the middle of the walk

    // 9. Tiny lateral logs
    createStaticPlatform(-4.5, 15.5, -116, 7, 1.5, 7, 0xef4444);
    createStaticPlatform(4.5, 15, -126, 7, 1.5, 7, 0xf97316);

    // 10. Final approach walkway to Checkpoint 3
    createStaticPlatform(0, 14.5, -138, 7, 1.5, 12, 0xffffff);
    createSpike(0, 15.2, -138);

    // 11. Checkpoint 3: The Golden Toffee Castle Gate (New stage checkpoints!)
    const checkpoint3Y = 18;
    createStaticPlatform(0, checkpoint3Y, -152, 14, 2, 14, 0xec4899);
    const cp3Pos = new THREE.Vector3(0, checkpoint3Y + 1.1, -149);
    const cp3Visual = createCheckpointVisual(THREE, cp3Pos);
    game.currentLevel.mesh.add(cp3Visual);
    game.currentLevel.checkpoints.push({ pos: cp3Pos, active: false, name: "Karamel Kalesi Girişi", mesh: cp3Visual });

    // Intermediate steps to easily reach the 2nd climbing staircase (Spiral Sweet Tower)
    createStaticPlatform(0, 18.5, -161, 7, 1.2, 7, 0xf59e0b); // Intermediate Step A
    createStaticPlatform(-3, 19.0, -170, 7, 1.2, 7, 0x10b981); // Intermediate Step B

    // 12. NEW SECTION: The Spiral Sweet Tower (2nd climbing staircase)
    // Spiral steps climbing around a giant central lollipop stick spire
    createStaticPlatform(0, 24, -180, 2.5, 18, 2.5, 0xf59e0b); // central lollipop stick
    createStaticPlatform(-5.5, 19.5, -180, 7, 1, 7, 0xef4444);  // spiral step 1
    createStaticPlatform(0, 21.5, -174.5, 7, 1, 7, 0xf97316); // spiral step 2
    createStaticPlatform(5.5, 23.5, -180, 7, 1, 7, 0xeab308);  // spiral step 3
    createStaticPlatform(0, 25.5, -185.5, 7, 1, 7, 0x10b981); // spiral step 4
    createStaticPlatform(-5.5, 27.5, -180, 7, 1, 7, 0x06b6d4); // spiral step 5
    createStaticPlatform(0, 29.5, -174.5, 7, 1, 7, 0x6366f1);  // spiral step 6

    // Checkpoint 3.5: Spiral Candy Tower High Point (Yeni Eklenen Kontrol Noktası!)
    const cp3_5Pos = new THREE.Vector3(0, 29.5 + 1.1, -172);
    const cp3_5Visual = createCheckpointVisual(THREE, cp3_5Pos);
    game.currentLevel.mesh.add(cp3_5Visual);
    game.currentLevel.checkpoints.push({ pos: cp3_5Pos, active: false, name: "Sarmal Şeker Tepesi", mesh: cp3_5Visual });

    // Intermediate steps to safely exit Checkpoint 3.5 towards Section 13
    createStaticPlatform(-2, 29.5, -180, 7, 1.2, 7, 0xa855f7); // Intermediate Step C
    createStaticPlatform(-4, 29.0, -188, 7, 1.2, 7, 0x0ea5e9); // Intermediate Step D

    // 13. DIFFICULT STATIC CHOCOLATE PARKOUR (Replaced moving biscuit maze!)
    // A highly challenging zig-zag pattern of candy-covered tight ropes with candy spikes!
    createStaticPlatform(-5, 29, -195, 7, 1.0, 7, 0xec4899); // expanded step
    createStaticPlatform(-2, 30, -202, 7, 1.2, 7, 0xffffff);    // expanded white bridge beam
    createSpike(-2, 30.7, -202);                                   // Spike right in the middle!
    createStaticPlatform(4, 31, -209, 7, 1.2, 7, 0xdb2777);     // Another expanded bridge beam
    createSpike(4, 31.7, -209);                                    // Another spike!
    createStaticPlatform(-2, 32, -216, 7, 1.2, 7, 0x10b981);  // expanded green landing step
    createStaticPlatform(0, 31, -222, 7, 1.2, 7, 0x0ea5e9);   // expanded blue landing step

    // Intermediate step to safely reach Checkpoint 4
    createStaticPlatform(0, 30.5, -227, 7, 1.2, 7, 0xfcd34d); // Intermediate Step E

    // 14. Checkpoint 4: The Neon Candy Palace Entrance
    const checkpoint4Y = 30;
    createStaticPlatform(0, checkpoint4Y, -232, 12, 2, 12, 0x06b6d4);
    const cp4Pos = new THREE.Vector3(0, checkpoint4Y + 1.1, -229);
    const cp4Visual = createCheckpointVisual(THREE, cp4Pos);
    game.currentLevel.mesh.add(cp4Visual);
    game.currentLevel.checkpoints.push({ pos: cp4Pos, active: false, name: "Lolipop Saray Kapısı", mesh: cp4Visual });

    // 15. NEW EXTENDED PARKOUR STAGE: The Marshmallow Cascades (Bölüm Uzatma!)
    // Marshmallow floating islands requiring absolute precision jumps
    createStaticPlatform(-4, 29, -248, 7, 1.5, 7, 0xfdf2f8);  // Expanded Marshmallow 1
    createStaticPlatform(4, 27.5, -258, 7, 1.2, 7, 0xfbcfe8); // Expanded Marshmallow 2
    createStaticPlatform(-2, 26, -268, 7, 1.5, 7, 0xf9a8d4);  // Expanded Marshmallow 3

    // Intermediate platform to comfortably transition to the bridge
    createStaticPlatform(-1, 25.5, -278, 7, 1.2, 7, 0xf97316); // Intermediate Step F

    // 16. The Ultra-Narrow Gummy Worm Bridge (with multiple spikes!)
    createStaticPlatform(0, 25, -288, 7, 1.2, 24, 0x10b981); // Comfortable bridge
    createSpike(0, 25.7, -280); // spike 1
    createSpike(0, 25.7, -288); // spike 2
    createSpike(0, 25.7, -296); // spike 3

    // Intermediate step to make reaching Checkpoint 4.5 super safe
    createStaticPlatform(0, 25, -306, 7, 1.2, 7, 0xa855f7); // Intermediate Step G

    // 17. Checkpoint 4.5: Gofret Saray Avlusu (Saray Önü Köprüsü)
    const checkpoint4_5Y = 25;
    createStaticPlatform(0, checkpoint4_5Y, -312, 10, 2, 10, 0xa855f7);
    const cp4_5Pos = new THREE.Vector3(0, checkpoint4_5Y + 1.1, -309);
    const cp4_5Visual = createCheckpointVisual(THREE, cp4_5Pos);
    game.currentLevel.mesh.add(cp4_5Visual);
    game.currentLevel.checkpoints.push({ pos: cp4_5Pos, active: false, name: "Gofret Saray Avlusu", mesh: cp4_5Visual });

    // 18. JELLY BEAN STEPPING STONES (Yeni Zor Parkur!)
    // Extremely small colorful jelly beans placed at challenging angles!
    createStaticPlatform(3, 26, -322, 7, 1.2, 7, 0xec4899);  // Expanded Pink bean (brought closer)
    createStaticPlatform(-3, 27.5, -332, 7, 1.2, 7, 0x8b5cf6); // Expanded Purple bean (brought closer)
    createStaticPlatform(4, 29, -342, 7, 1.2, 7, 0x3b82f6);  // Expanded Blue bean (brought closer)
    createStaticPlatform(-1, 30.5, -352, 7, 1.2, 7, 0xeab308); // Expanded Yellow bean (brought closer)

    // Intermediate steps to safely reach the 2nd spiral tower (Peppermint Spire)
    createStaticPlatform(-2, 31.0, -363, 7, 1.2, 7, 0xec4899); // Intermediate Step H
    createStaticPlatform(0, 31.5, -374, 7, 1.2, 7, 0x3b82f6);  // Intermediate Step I

    // 19. PEPPERMINT SPIRAL SPIRE (Döner Kule Tırmanışı!)
    createStaticPlatform(0, 38, -385, 2.5, 24, 2.5, 0xf97316);   // Central peppermint stick spire
    createStaticPlatform(-4, 32, -385, 7, 1, 7, 0xef4444);    // Spire step 1
    createStaticPlatform(0, 34, -381, 7, 1, 7, 0xffffff);    // Spire step 2
    createStaticPlatform(4, 36, -385, 7, 1, 7, 0x10b981);    // Spire step 3
    createStaticPlatform(0, 38, -389, 7, 1, 7, 0x3b82f6);    // Spire step 4

    // 20. Checkpoint 5: Gofret Kule Zirvesi
    const checkpoint5Y = 39;
    createStaticPlatform(0, checkpoint5Y, -406, 8, 2, 8, 0xdb2777);
    const cp5Pos = new THREE.Vector3(0, checkpoint5Y + 1.1, -404);
    const cp5Visual = createCheckpointVisual(THREE, cp5Pos);
    game.currentLevel.mesh.add(cp5Visual);
    game.currentLevel.checkpoints.push({ pos: cp5Pos, active: false, name: "Gofret Kule Zirvesi", mesh: cp5Visual });

    // 21. GUMMY DROP TIGHTROPES & SLIDES (Zor Zikzak Köprüler!)
    createStaticPlatform(-4, 36, -420, 7, 1.2, 8, 0xffffff);   // Comfortable bridge 1
    createSpike(-4, 36.7, -420);
    createStaticPlatform(4, 33, -432, 7, 1.2, 8, 0xec4899);    // Comfortable bridge 2
    createSpike(4, 33.7, -432);
    createStaticPlatform(-2, 30, -444, 7, 1.2, 8, 0x10b981);   // Comfortable bridge 3
    createSpike(-2, 30.7, -444);

    // 22. Grand Ceremonial Sugar Staircase & Launch Pad to the Boss Arena (Super Easy and Safe!)
    createStaticPlatform(0, 28, -458, 12, 1.5, 12, 0xdb2777); // Massive launching platform (12x12) so player never falls!
    createJumpPad(0, 29.0, -458, 25); // Launching the player high and far!

    // Stepped ceremonial safety platforms - forming an unbreakable connection to the Boss Arena!
    createStaticPlatform(0, 26, -471, 14, 1.5, 14, 0xec4899);   // Grand Step 1 (Pink Candy)
    createStaticPlatform(0, 23.5, -484, 14, 1.5, 14, 0x8b5cf6);  // Grand Step 2 (Purple Candy)
    createStaticPlatform(0, 21.5, -497, 14, 1.5, 14, 0x3b82f6);  // Grand Step 3 (Blue Candy - overlaps the arena entrance!)

    // 23. Elegant Normal-Sized Boss Arena (Chocolate Cookie Arena - Pushed way back to z = -510)
    const arenaY = 21;
    const arenaZ = -510;
    createStaticPlatform(0, arenaY, arenaZ, 30, 2.2, 30, 0x78350f); // Elegant dark chocolate cookie crust

    // Boss Arena Entry Checkpoint
    const bossCpPos = new THREE.Vector3(0, arenaY + 1.2, arenaZ + 12);
    const bossCpVisual = createCheckpointVisual(THREE, bossCpPos);
    game.currentLevel.mesh.add(bossCpVisual);
    game.currentLevel.checkpoints.push({ pos: bossCpPos, active: false, name: "Lolipop Patron Arenası", mesh: bossCpVisual });


    // --- LOLLIPOP BOSS WITH HANDS AND FEET ("elleri ve ayakları olan lolilop boss") ---
    const bossGroup = new THREE.Group();
    bossGroup.position.set(0, arenaY + 1, arenaZ);
    bossGroup.scale.set(1.5, 1.5, 1.5); // Elegant and prominent boss size (1.5x) rather than Titanic scale!

    // Body stick
    const stickGeo = new THREE.CylinderGeometry(0.7, 0.7, 6, 12);
    const stickMat = new THREE.MeshStandardMaterial({ color: 0xfdf2f8, roughness: 0.4 });
    const stick = new THREE.Mesh(stickGeo, stickMat);
    stick.position.y = 3;
    bossGroup.add(stick);

    // Candy Cane Spiral Stripes
    for (let k = 0; k < 5; k++) {
        const stripeGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.6, 12);
        const stripeMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
        const stripe = new THREE.Mesh(stripeGeo, stripeMat);
        stripe.position.y = 1 + k * 1.1;
        stripe.rotation.y = k * 0.4;
        bossGroup.add(stripe);
    }

    // Big Sphere Head
    const headGeo = new THREE.SphereGeometry(3.5, 24, 24);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xdb2777, emissive: 0x9d174d, roughness: 0.1 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 8;
    bossGroup.add(head);

    // Sweet Head Swirl
    const swirlGeo = new THREE.TorusGeometry(2.2, 0.4, 8, 24);
    const swirlMat = new THREE.MeshStandardMaterial({ color: 0xfdf2f8 });
    const swirl = new THREE.Mesh(swirlGeo, swirlMat);
    swirl.position.set(0, 8, 2.5);
    bossGroup.add(swirl);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.4, 8, 8);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x111827 });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-1.1, 8.5, 3.2);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(1.1, 8.5, 3.2);
    bossGroup.add(leftEye, rightEye);

    // Angry Eyebrows (Kızgın Kaşlar!)
    const eyebrowMat = new THREE.MeshStandardMaterial({ color: 0x111827 });
    const leftEyebrowGeo = new THREE.BoxGeometry(1.0, 0.25, 0.3);
    const leftEyebrow = new THREE.Mesh(leftEyebrowGeo, eyebrowMat);
    leftEyebrow.position.set(-1.0, 9.1, 3.25);
    leftEyebrow.rotation.z = -0.35; // Slanted inwards
    
    const rightEyebrowGeo = new THREE.BoxGeometry(1.0, 0.25, 0.3);
    const rightEyebrow = new THREE.Mesh(rightEyebrowGeo, eyebrowMat);
    rightEyebrow.position.set(1.0, 9.1, 3.25);
    rightEyebrow.rotation.z = 0.35; // Slanted inwards
    bossGroup.add(leftEyebrow, rightEyebrow);

    // Frowning Angry Mouth (Somurtan Kızgın Ağız!)
    const smileGeo = new THREE.TorusGeometry(0.8, 0.18, 6, 12, Math.PI);
    const smileMat = new THREE.MeshStandardMaterial({ color: 0x111827 });
    const smile = new THREE.Mesh(smileGeo, smileMat);
    smile.position.set(0, 7.3, 3.2);
    smile.rotation.x = 0; // Curve facing downwards (Frown)
    bossGroup.add(smile);

    // Hands (Gloves & Arms)
    const armMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 });
    const gloveMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });

    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-3.2, 7.5, 0);
    const leftArmCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 3, 8), armMat);
    leftArmCyl.position.y = -1.5;
    leftArmCyl.rotation.z = Math.PI / 4;
    leftArmGroup.add(leftArmCyl);

    const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.7, 12, 12), gloveMat);
    leftHand.position.set(-1.2, -2.5, 0);
    leftArmGroup.add(leftHand);
    bossGroup.add(leftArmGroup);

    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(3.2, 7.5, 0);
    const rightArmCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 3, 8), armMat);
    rightArmCyl.position.y = -1.5;
    rightArmCyl.rotation.z = -Math.PI / 4;
    rightArmGroup.add(rightArmCyl);

    const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.7, 12, 12), gloveMat);
    rightHand.position.set(1.2, -2.5, 0);
    rightArmGroup.add(rightHand);
    bossGroup.add(rightArmGroup);

    // Feet & Legs (Leg stick & sweet shoes)
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.3 });

    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(-1.5, 0, 0);
    const leftLegCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 2.5, 8), stickMat);
    leftLegCyl.position.y = -1.25;
    leftLegGroup.add(leftLegCyl);

    const leftFoot = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 2), shoeMat);
    leftFoot.position.set(0, -2.5, 0.4);
    leftLegGroup.add(leftFoot);
    bossGroup.add(leftLegGroup);

    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(1.5, 0, 0);
    const rightLegCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 2.5, 8), stickMat);
    rightLegCyl.position.y = -1.25;
    rightLegGroup.add(rightLegCyl);

    const rightFoot = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 2), shoeMat);
    rightFoot.position.set(0, -2.5, 0.4);
    rightLegGroup.add(rightFoot);
    bossGroup.add(rightLegGroup);

    game.currentLevel.mesh.add(bossGroup);

    game.currentLevel.lollipopBoss = {
        mesh: bossGroup,
        pos: new THREE.Vector3(0, arenaY + 1, arenaZ),
        hp: 35,
        maxHp: 35,
        attackCooldown: 1.8,
        leftArm: leftArmGroup,
        rightArm: rightArmGroup,
        leftLeg: leftLegGroup,
        rightLeg: rightLegGroup
    };

    if (game.callbacks && game.callbacks.onShowNotice) {
        game.callbacks.onShowNotice("🌈 Gökkuşağı Dünyası! Zorlu parkurları geçerek Elleri ve Ayakları olan Lolipop Patronu yenin!", "success");
    }
}

function teleportToSugarWorld() {
    const game = window.__superBearGame;
    if (!game || !game.scene) return;
    if (game.loadRegion) {
        game.loadRegion('sugar_world');
    } else {
        game.currentRegion = 'sugar_world';
        populateSugarWorld(game);
    }
}


// ============================================================================
// 12. BÖLÜM: JOKEROOMS (ŞAKA ODALARI) - SONSUZ SARI KORİDORLAR LABİRENTİ
// ============================================================================
jokeroomsPopulated = false;
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

// Hilarious unique jokes database for 3D Wall Signs (Tablolar) in Jokerooms
const JOKEROOMS_TABLO_JOKES = [
    { title: "📜 TABLO: HIZLI AYI BİLGELİĞİ", text: "Sarı koridorlarda koşarken arkana bakma! Gölgen bile senin kadar tatlı bir ayı görünce şaşırıyor! 🐻💨" },
    { title: "📜 TABLO: FLORESAN SESİ", text: "Bzzzz... Bzzzz... Bu flöresan lamba aslında uzaylıların gizli bal tarifini mırıldanıyor! 💡🐝" },
    { title: "📜 TABLO: SÜPER MUZ TEORİSİ", text: "Muz kabukları yerçekimini geçici olarak iptal eden sihirli nesnelerdir! Bas ve fırla! 🍌🚀" },
    { title: "📜 TABLO: KAHKAHA KURAMI", text: "Bu labirentten çıkmanın en hızlı yolu 3 kere kendi etrafında dönüp 'BAL NEREDE?' diye bağırmaktır! 🍯" },
    { title: "📜 TABLO: ŞANS TABLOSU", text: "Dikkat: Bu tabloya [E] ile bakan oyuncuların tatlılık puanı %500 arttı! 🍀🐻" },
    { title: "📜 TABLO: AYI ATASÖZÜ", text: "Eski bir ayı atasözü der ki: 'Sarı koridorda kaybolan ayı, sonunda en büyük bal kovasını bulur!' 🐾🍯" },
    { title: "📜 TABLO: BOYA UYARISI", text: "Lütfen duvarları yalamayınız, limonlu dondurma aromalı değildir! 🍋😂" },
    { title: "📜 TABLO: PALYAÇO FISILTISI", text: "Şakacı Palyaço diyor ki: 'Lastik ördekleri toplayan kahraman ayılar asla yalnız kalmaz!' 🐥🤡" },
    { title: "📜 TABLO: RED DOOR EFSANESİ", text: "ÖNEMLİ BİLGİ: 2000 metreyi katettiğinde parlak KIRMIZI ÇIKIŞ KAPISI belirecek! Sakın kaçırma! 🔴🚪" },
    { title: "📜 TABLO: DİSKO KAÇAMAĞI", text: "İleride gizli bir şaka disko odası var! Ayı dansı yapmayı unutma! 🪩🕺" },
    { title: "📜 TABLO: GÖRÜNMEZ BAL", text: "Tebrikler! 100 gram görünmez şaka balı kazandınız. Tadı tamamen hayal gücün kadar lezzetli! 🍯✨" },
    { title: "📜 TABLO: PUSULA ŞAKASI", text: "Pusula burada sürekli kendi etrafında dönüyor çünkü sizin gibi harika bir ayıyı takip etmek istiyor! 🧭" },
    { title: "📜 TABLO: LASTİK ÖRDEK DİPLOMASİSİ", text: "Cik cik! Lastik ördekler sana şaka yapmaya hazırlanıyor. Cik diye cevap ver! 🐥" },
    { title: "📜 TABLO: SAHTE ÇIKIŞ KILAVUZU", text: "Ahşap 'ÇIKIŞ' kapıları seni başka sarı koridora ışınlar. Gerçek kurtuluş 2000m sonrasındaki KIZIL KAPIDA! 🔴" },
    { title: "📜 TABLO: YERÇEKİMİ ŞAKASI", text: "Tavana doğru bak ve el salla! Tavan da sana el sallıyor olabilir! ☁️👋" },
    { title: "📜 TABLO: REKOR TABLOSU", text: "Şu ana kadar 2000 metreyi aşan tek canlı cesur Süper Ayı! Rekora doğru koş! 🏃‍♂️🏆" }
];

// Helper to trigger escape sequence when player uses Red Exit Door
function triggerRedDoorEscape(game, redDoor) {
    if (!game || !game.currentLevel || game.currentLevel._redDoorEscaped) return;
    game.currentLevel._redDoorEscaped = true;

    if (window.St && window.St.playGoalFanfare) window.St.playGoalFanfare();
    if (game.spawnSparkleParticles) {
        game.spawnSparkleParticles(redDoor ? redDoor.pos : game.playerPos, 90, 0xef4444);
        game.spawnSparkleParticles(game.playerPos, 60, 0xfacc15);
    }
    if (game.addCoins) game.addCoins(250);
    if (game.addExp) game.addExp(600);

    if (game.callbacks && game.callbacks.onShowNotice) {
        game.callbacks.onShowNotice("🏆 TEBRİKLER! 2000 Metrelik Jokerooms Labirentinden Başarıyla Kurtuldun! Kırmızı Kapıdan Ayı Köyü'ne dönüyorsun... 🔴🐻 (+250 Altın, +600 XP)", "success");
    }

    setTimeout(() => {
        if (game.loadRegion) {
            game.loadRegion("hub");
        } else if (game.callbacks && game.callbacks.onSelectRegion) {
            game.callbacks.onSelectRegion("hub");
        }
    }, 1200);
}

// 3D Red Exit Door Creator (Appears after 2000m)
function createRedExitDoor(game, chunkGroup, worldX, worldZ, lx = 0, ly = 0, lz = 0) {
    const THREE = window.THREE;
    const doorGroup = new THREE.Group();
    doorGroup.position.set(lx, ly, lz);

    // Glowing Red Frame
    const frameGeo = new THREE.BoxGeometry(3.6, 5.2, 0.6);
    const frameMat = new THREE.MeshStandardMaterial({
        color: 0xdc2626,
        emissive: 0xef4444,
        emissiveIntensity: 1.5,
        roughness: 0.2,
        metalness: 0.8
    });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    frameMesh.position.y = 2.6;
    doorGroup.add(frameMesh);

    // Inner Glowing Crimson Portal
    const portalGeo = new THREE.PlaneGeometry(2.6, 4.4);
    const portalMat = new THREE.MeshStandardMaterial({
        color: 0xf87171,
        emissive: 0xdc2626,
        emissiveIntensity: 2.8,
        side: THREE.DoubleSide
    });
    const portalMesh = new THREE.Mesh(portalGeo, portalMat);
    portalMesh.position.set(0, 2.6, 0.05);
    doorGroup.add(portalMesh);

    // Gold Door Handle
    const handleGeo = new THREE.SphereGeometry(0.25, 12, 12);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xeab308 });
    const handleMesh = new THREE.Mesh(handleGeo, handleMat);
    handleMesh.position.set(0.9, 2.5, 0.2);
    doorGroup.add(handleMesh);

    // Floating Red Exit Sign Board
    const signBoardGeo = new THREE.BoxGeometry(4.4, 1.2, 0.3);
    const signBoardMat = new THREE.MeshStandardMaterial({
        color: 0x991b1b,
        emissive: 0xef4444,
        emissiveIntensity: 1.2,
        roughness: 0.3
    });
    const signBoard = new THREE.Mesh(signBoardGeo, signBoardMat);
    signBoard.position.set(0, 5.8, 0);
    doorGroup.add(signBoard);

    // Glowing Badge on Sign
    const badgeGeo = new THREE.SphereGeometry(0.45, 12, 12);
    const badgeMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff2222, emissiveIntensity: 2.5 });
    const badge = new THREE.Mesh(badgeGeo, badgeMat);
    badge.position.set(0, 5.8, 0.25);
    doorGroup.add(badge);

    // Intense Red Point Light illuminating corridor
    const redLight = new THREE.PointLight(0xef4444, 4.5, 30);
    redLight.position.set(0, 3.0, 1.0);
    doorGroup.add(redLight);

    if (chunkGroup) {
        chunkGroup.add(doorGroup);
    } else if (game && game.currentLevel && game.currentLevel.mesh) {
        game.currentLevel.mesh.add(doorGroup);
    }

    const worldPos = new THREE.Vector3(worldX + lx, ly, worldZ + lz);

    const redDoorObj = {
        pos: worldPos,
        mesh: doorGroup,
        portalMesh: portalMesh,
        light: redLight
    };

    if (game && game.currentLevel) {
        game.currentLevel.redExitDoor = redDoorObj;
        if (!game.currentLevel.redDoors) game.currentLevel.redDoors = [];
        game.currentLevel.redDoors.push(redDoorObj);
    }

    return redDoorObj;
}

// Master Jokerooms interaction handler
function handleJokeroomsInteract(game) {
    if (!game || game.currentRegion !== "jokerooms" || !game.playerPos) return false;
    const pPos = game.playerPos;

    // 0. Red Exit Doors Check (Return to Ayı Köyü)
    if (game.currentLevel) {
        const doors = game.currentLevel.redDoors || (game.currentLevel.redExitDoor ? [game.currentLevel.redExitDoor] : []);
        for (const redDoor of doors) {
            if (pPos.distanceTo(redDoor.pos) < 7.0) {
                triggerRedDoorEscape(game, redDoor);
                return true;
            }
        }
    }

    // 1. Joke Signs Check (Funny Tables / Boards)
    if (game.currentLevel && game.currentLevel.jokeSigns) {
        let signFound = false;
        (game.currentLevel.jokeSigns || []).forEach(sign => {
            if (!signFound && pPos.distanceTo(sign.pos) < 5.0) {
                signFound = true;
                if (window.St && window.St.playDialogueChirp) window.St.playDialogueChirp(1.2);
                if (game.spawnSparkleParticles) game.spawnSparkleParticles(sign.pos, 20, 0xfacc15);
                if (game.callbacks && game.callbacks.onShowNotice) {
                    game.callbacks.onShowNotice(`${sign.title}: "${sign.text}"`, "info");
                }
            }
        });
        if (signFound) return true;
    }

    // 2. Clown Guardian / Joke Boss Check
    const clown = game.currentLevel && game.currentLevel.clownNpc;
    if (clown && pPos.distanceTo(clown.pos) < 6.5) {
        clown.talkCount = (clown.talkCount || 0) + 1;
        const jokeIdx = clown.talkCount % JOKEROOMS_JOKES.length;
        const jokeText = JOKEROOMS_JOKES[jokeIdx];
        if (game.callbacks && game.callbacks.onShowNotice) {
            game.callbacks.onShowNotice(jokeText, "warning");
        }
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
        return true;
    }

    // 3. Jack-in-the-Box Check
    if (game.currentLevel && game.currentLevel.jokeBoxes) {
        let boxOpened = false;
        (game.currentLevel.jokeBoxes || []).forEach(box => {
            if (!boxOpened && !box.opened && pPos.distanceTo(box.pos) < 4.0) {
                boxOpened = true;
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
        if (boxOpened) return true;
    }

    return false;
}

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
    if (game && game.currentLevel) ensureLevelArrays(game.currentLevel);

    const THREE = window.THREE;
    if (!game || !game.scene) return;
    
    console.log("🟡 Initializing 12. Bölüm: Jokerooms (Şaka Odaları)...");

    if (game.currentLevel) {
        if (game.currentLevel.sceneGroup && game.currentLevel.sceneGroup.parent) {
            game.currentLevel.sceneGroup.parent.remove(game.currentLevel.sceneGroup);
        }
        if (game.currentLevel.mesh && game.currentLevel.mesh.parent) {
            game.currentLevel.mesh.parent.remove(game.currentLevel.mesh);
        }
    }
    
    const jokeroomsGroup = new THREE.Group();
    jokeroomsGroup.name = "jokerooms_level_mesh";
    game.scene.add(jokeroomsGroup);

    game.currentLevel = {
        sceneGroup: jokeroomsGroup,
        mesh: jokeroomsGroup,
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
    const chunkColliders = [];
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

    // Carpet Floor Collider (Allows player to stand/walk on ground)
    chunkColliders.push({
        min: new THREE.Vector3(worldX - CHUNK_SIZE / 2, -1.0, worldZ - CHUNK_SIZE / 2),
        max: new THREE.Vector3(worldX + CHUNK_SIZE / 2, 0.0, worldZ + CHUNK_SIZE / 2),
        chunkKey: cx + "," + cz
    });
    
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
    
    // Red Exit Door Spawner past 2000 meters (Allows returning to Ayı Köyü)
    const distFromOrigin = Math.sqrt(cx * cx + cz * cz) * 24;
    if (jokeroomsSteps >= 2000 || distFromOrigin >= 800) {
        if (hash % 3 === 0 || roomType === 1 || roomType === 5) {
            createRedExitDoor(game, chunkGroup, worldX, worldZ, 0, 0, -8);
            create3DJokeSign(chunkGroup, worldX, worldZ, 4.2, 2.5, -7.8, "🔴 AYI KÖYÜNE DÖNÜŞ", "2000m geçildi! Bu Kırmızı Kapıdan içeri girerek veya [E] basarak Ayı Köyü'ne dönebilirsin!");
        }
    }
    
    // Register colliders
    if (game.currentLevel && game.currentLevel.colliders) chunkColliders.forEach(c => game.currentLevel.colliders.push(c));
    
    return chunkGroup;
}

// 3D Joke Sign on Wall
function create3DJokeSign(chunkGroup, worldX, worldZ, lx, ly, lz, defaultTitle, defaultText) {
    const THREE = window.THREE;
    const signGroup = new THREE.Group();
    signGroup.position.set(lx, ly, lz);
    
    // Outer wooden frame
    const frameGeo = new THREE.BoxGeometry(3.2, 1.8, 0.12);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.6 });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    signGroup.add(frame);

    // Inner white canvas board
    const boardGeo = new THREE.BoxGeometry(2.9, 1.5, 0.16);
    const boardMat = new THREE.MeshStandardMaterial({ color: 0xfffbea, roughness: 0.25 });
    const board = new THREE.Mesh(boardGeo, boardMat);
    signGroup.add(board);

    // Gold emblem badge
    const badgeGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.18, 16);
    const badgeMat = new THREE.MeshStandardMaterial({ color: 0xeab308, emissive: 0xca8a04, emissiveIntensity: 0.8 });
    const badge = new THREE.Mesh(badgeGeo, badgeMat);
    badge.rotation.x = Math.PI / 2;
    badge.position.set(0, 0.45, 0.08);
    signGroup.add(badge);
    
    chunkGroup.add(signGroup);

    // Pick unique hilarious joke for this board location
    const absX = Math.floor(worldX + lx);
    const absZ = Math.floor(worldZ + lz);
    const jokeIdx = Math.abs((absX * 73 + absZ * 91 + 17)) % JOKEROOMS_TABLO_JOKES.length;
    const jokeObj = JOKEROOMS_TABLO_JOKES[jokeIdx];

    const finalTitle = defaultTitle || jokeObj.title;
    const finalText = defaultText || jokeObj.text;
    
    const game = window.__superBearGame;
    if (game && game.currentLevel && game.currentLevel.jokeSigns) {
        game.currentLevel.jokeSigns.push({
            pos: new THREE.Vector3(worldX + lx, ly, worldZ + lz),
            title: finalTitle,
            text: finalText
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
    if (game.loadRegion) {
        game.loadRegion('jokerooms');
    } else {
        game.currentRegion = 'jokerooms';
        populateJokerooms(game);
    }
}

// Keyboard interactions for [E] & [B] in Jokerooms
window.addEventListener('keydown', (e) => {
    const game = window.__superBearGame;
    if (!game || game.currentRegion !== 'jokerooms' || !game.playerPos) return;
    const key = e.key.toUpperCase();
    if (key === 'E' || key === 'B') {
        handleJokeroomsInteract(game);
    }
});
// Window Teleport Event Listener
window.addEventListener('superbear:teleport-jokerooms', () => {
    teleportToJokerooms();
});
window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyB' || e.key === 'b' || e.key === 'B') {
        const game = window.__superBearGame;
        if (game && game.currentRegion === 'sugar_world' && game.playerPos) {
            const pPos = game.playerPos;
            let spoken = false;
            if (game.currentLevel && game.currentLevel.houses) {
                (game.currentLevel.houses || []).forEach((house, idx) => {
                    if (house.pos.distanceTo(pPos) < 7.0) {
                        spoken = true;
                        const messages = [
                            "🏡 Şeker Evi 1: 'Çıtır pıtır kurabiyelerimiz taptaze! Hoş geldin Süper Ayı!'",
                            "🏡 Şeker Evi 2: 'Zirvedeki Lolipop Boss hepimizin şekerini çaldı, yardım et!'",
                            "🏡 Şeker Evi 3: 'Merdivenleri tırmanırken dikkat et, pamuk şekerler kaykıktır!'",
                            "🏡 Şeker Evi 4: 'Sakın düşme, aşağısı tamamen sıcak çikolata nehri!'",
                            "🏡 Şeker Evi 5: 'Şekerci Dükkanı: En tatlı reçeller burada yapılır!'",
                            "🏡 Şeker Evi 6: 'Kahraman ayı, kasabamızın son umudu sensin!'"
                        ];
                        if (game.callbacks && game.callbacks.onShowNotice) {
                            game.callbacks.onShowNotice(messages[idx] || "🏡 Şeker Evi: 'Merhaba yolcu!'", "info");
                        }
                    }
                });
            }
            if (!spoken && game.currentLevel && game.currentLevel.lollipops) {
                (game.currentLevel.lollipops || []).forEach((lolly, idx) => {
                    if (lolly.pos.distanceTo(pPos) < 6.0) {
                        spoken = true;
                        const lollyMessages = [
                            "🍭 Lolipop Muhafızı 1: 'Çıtır lezzet! Parkurun tepesindeki patron bize şeker patlağı atıyor!'",
                            "🍭 Lolipop Muhafızı 2: 'Zirveye çıkmak için dev sütunlara ve merdivenlere zıpla!'",
                            "🍭 Lolipop Muhafızı 3: 'Şeker patlağına yakalanırsan 3 saniye yavaşlarsın, dikkatli ol!'",
                            "🍭 Lolipop Muhafızı 4: 'Gökkuşağı gökyüzü ve pembe yerler bizim evimizdir!'",
                            "🍭 Lolipop Muhafızı 5: 'Bize [B] tuşu ile konuşarak güç verdin, teşekkürler!'",
                            "🍭 Lolipop Muhafızı 6: 'Hadi o Lolipop Boss'u alt et ve krallığı kurtar!'"
                        ];
                        if (game.callbacks && game.callbacks.onShowNotice) {
                            game.callbacks.onShowNotice(lollyMessages[idx] || "🍭 Lolipop: 'Tatlı günler!'", "info");
                        }
                    }
                });
            }
        }
    }
});

window.addEventListener('superbear:teleport-sugar', () => {
    teleportToSugarWorld();
});

function updateSpaceLoop() {
  const game = window.__superBearGame;
  if (!game) {
    requestAnimationFrame(updateSpaceLoop);
    return;
  }

  // Super Bear Adventure Chapter Banner UI (Disabled per user request)
  function showSbaChapterBanner(icon, title, subtitle) {
    try {
      const container = document.getElementById('sba-chapter-banner-container');
      if (container) container.remove();
    } catch(e) {}
  }

  // Authentic Return Portal Mesh to Ayı Köyü
  function addLevelReturnPortal(game, px, py, pz) {
    if (!game || !game.scene || !window.THREE) return;
    const THREE = window.THREE;
    const portalGroup = new THREE.Group();
    portalGroup.name = 'level_return_portal_to_hub';
    portalGroup.position.set(px, py, pz);

    const ringGeo = new THREE.TorusGeometry(1.8, 0.28, 16, 32);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.2,
      roughness: 0.2
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 1.9;
    portalGroup.add(ring);

    const vortexGeo = new THREE.CircleGeometry(1.6, 32);
    const vortexMat = new THREE.MeshBasicMaterial({
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide
    });
    const vortex = new THREE.Mesh(vortexGeo, vortexMat);
    vortex.position.y = 1.9;
    portalGroup.add(vortex);

    const ped = new THREE.Mesh(
      new THREE.CylinderGeometry(2.4, 2.8, 0.4, 16),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 })
    );
    ped.position.y = 0.2;
    portalGroup.add(ped);

    game.scene.add(portalGroup);

    portalGroup.userData = {
      update: () => {
        ring.rotation.z += 0.03;
        vortex.rotation.z -= 0.02;
        if (game.playerPos && game.currentRegion !== 'hub') {
          const dist = game.playerPos.distanceTo(portalGroup.position);
          if (dist < 2.5) {
            game.loadRegion('hub');
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("🏡 Ayı Köyü'ne güvenle geri döndün!", "info");
            }
          }
        }
      }
    };
    if (!game._returnPortals) game._returnPortals = [];
    game._returnPortals.push(portalGroup);
  }

  // Exact Coordinates & Safety Spawns for Every Region
  const SAFE_SPAWNS = {
    hub: { x: 0, y: 0.2, z: 5, rotY: 0, title: "1. BÖLÜM: AYI VE KEDİ KÖYÜ", sub: "Maceranın Başladığı Huzurlu Köy Meydanı", icon: "🏡" },
    forest_temple: { x: 0, y: 1.5, z: 25, rotY: 0, title: "2. BÖLÜM: ANTİK ORMAN TAPINAĞI", sub: "Sarmaşıklar ve Zehirli Spor Kanyonu", icon: "🍃" },
    beehive: { x: 0, y: 1.5, z: 42, rotY: 0, title: "3. BÖLÜM: VIZILDIYAN BAL KOVANI", sub: "Altın Bal Petekleri ve Arı Kraliçesi Labirenti", icon: "🐝" },
    pelican_plains: { x: 0, y: 2.0, z: 46, rotY: 0, title: "4. BÖLÜM: PELİKAN OVALARI & GÖK ADALARI", sub: "Rüzgarlı Bulut Köprüleri ve Gök Tapınağı", icon: "🪶" },
    snow_desert: { x: 0, y: 2.0, z: 52, rotY: 0, title: "5. BÖLÜM: KAR VADİSİ & DONMUŞ ÇÖL", sub: "Buzul Sarkıtları ve Koca Ayak Zirvesi", icon: "❄️" },
    volcano_cave: { x: 0, y: 2.5, z: 70, rotY: 0, title: "6. BÖLÜM: VOLKANİK EJDERHA MAĞARASI", sub: "Kızgın Magma Şelaleleri ve Lav Parkurları", icon: "🌋" },
    underwater_palace: { x: 0, y: 2.0, z: 0, rotY: 0, title: "7. BÖLÜM: ANTİK SU ALTI KRİSTAL SARAYI", sub: "Biolüminesans Mercanlar ve Derin Deniz Yolları", icon: "🌊" },
    golden_sanctuary: { x: 0, y: 2.2, z: 90, rotY: 0, title: "8. BÖLÜM: EFSANEVİ ALTIN CENNETİ", sub: "Güneş Mabedi ve Görkemli Altın Heykeller", icon: "🌟" },
    dinosaur_world: { x: 0, y: 1.8, z: 60, rotY: 0, title: "9. BÖLÜM: DİNOZOR DÜNYASI", sub: "Prehistorik Vadiler ve T-Rex Gözlem Kulesi", icon: "🦖" },
    sugar_world: { x: 0, y: 11.5, z: 70, rotY: 0, title: "10. BÖLÜM: ŞEKER DÜNYASI & LOLİPOP KRALLIĞI", sub: "Pamuk Şeker Bulutları ve Marshmallow Atlama Pedleri", icon: "🍬" },
    jokerooms: { x: 0, y: 1.2, z: 0, rotY: 0, title: "11. BÖLÜM: JOKEROOMS ŞAKA ODALARI", sub: "Sonsuz Sarı Labirent, Muz Kabukları ve Gizemli Odalar", icon: "🚪" },
    ruin_village: { x: 0, y: 2.8, z: 80, rotY: 0, title: "12. BÖLÜM: YIKILMIŞ KÖY & SİRK HARABELERİ", sub: "Asit Nehri ve Terk Edilmiş Sirk Parkuru", icon: "🏚️" },
    water_cave: { x: 0, y: 4.8, z: 60, rotY: 0, title: "13. BÖLÜM: KARANLIK SU MAĞARASI", sub: "Mavi Göletler, Mağara Sarkıtları ve Su Ejderhası", icon: "💧" },
    bee_desert: { x: 0, y: 3.2, z: 60, rotY: 0, title: "14. BÖLÜM: ARI ÇÖLÜ & ANTİK PİRAMİT", sub: "Sonsuz Kum Tepeleri ve Antik Firavun Piramidi", icon: "🏜️" },
    space_realm: { x: 0, y: 2.0, z: 25, rotY: 0, title: "15. BÖLÜM: KOZMİK BOYUT & BÜYÜK BOSSLAR", sub: "Yıldız Geçitleri ve Final Kozmik Savaş Arenası", icon: "🌌" },
  };

  function ensureSafeLevelSpawn(game, regionId, isFollowup = false) {
    if (!game) return;
    const THREE = window.THREE;
    if (!THREE) return;

    const info = SAFE_SPAWNS[regionId] || { x: 0, y: 2.0, z: 0, rotY: 0, title: regionId, sub: "Yeni Bölüm", icon: "🌟" };

    if (game.currentLevel) {
      if (!game.currentLevel.spawnPoint) game.currentLevel.spawnPoint = new THREE.Vector3();
      game.currentLevel.spawnPoint.set(info.x, info.y, info.z);
    }

    if (game.playerPos) {
      game.playerPos.set(info.x, info.y, info.z);
    }
    if (game.playerVel) {
      game.playerVel.set(0, 0, 0);
    }
    game.playerRotY = info.rotY || 0;

    if (game.playerBear && game.playerBear.root) {
      game.playerBear.root.position.copy(game.playerPos);
      game.playerBear.root.rotation.y = game.playerRotY;
      game.playerBear.root.visible = true;
    }

    if (regionId === "hub") {
      if (game.camera) {
        game.camYaw = 0;
        game.camPitch = 0.2;
        game.camDist = 6.0;
        game.camera.position.set(0, 2.5, 11);
        game.camera.lookAt(0, 1.0, -10);
      }
      // Remove any artificial spawn colliders that could cause bear to float in mid air in the hub
      if (game.currentLevel && game.currentLevel.colliders) {
        game.currentLevel.colliders = game.currentLevel.colliders.filter(c => !c.isSpawnBase && !(c.min && c.min.x === -14 && c.max && Math.abs(c.max.y - 1.4) < 0.2));
      }
    } else {
      if (game.camera) {
        game.camYaw = Math.PI;
        game.camPitch = 0.22;
        game.camDist = 6.2;
        game.camera.position.set(info.x, info.y + 2.6, info.z + 6.2);
        game.camera.lookAt(info.x, info.y + 1.2, info.z - 5.0);
      }
      // Solid base collider under spawn platform for non-hub levels only
      if (game.currentLevel) {
        if (!game.currentLevel.colliders) game.currentLevel.colliders = [];
        const hasBase = game.currentLevel.colliders.some(c => c && c.isSpawnBase);
        if (!hasBase) {
          game.currentLevel.colliders.push({
            min: new THREE.Vector3(info.x - 16, info.y - 3.5, info.z - 16),
            max: new THREE.Vector3(info.x + 16, info.y - 0.05, info.z + 16),
            isSpawnBase: true
          });
        }
      }
    }

    if (regionId !== "hub" && !isFollowup) {
      addLevelReturnPortal(game, info.x, info.y, info.z + 7.5);
    }
  }

  // Enhanced Region Transition & Safe Level Spawner Hook
  if (!game._regionCleanupHookInstalled && game.loadRegion) {
    game._regionCleanupHookInstalled = true;
    const origLoadRegion = game.loadRegion;
    game.loadRegion = function(regionId) {
      console.log("🧹 Region transition: loading " + regionId + " (deep cleaning previous region)...");
      if (typeof window.__superBearPurgeScene === 'function') {
        window.__superBearPurgeScene(this);
      }
      dinoWorldPopulated = false;
      volcanoCavePopulated = false;
      underwaterPalacePopulated = false;
      sugarWorldPopulated = false;
      jokeroomsPopulated = false;
      ruinVillagePopulated = false;
      goldenSanctuaryPopulated = false;
      waterCavePopulated = false;
      beeDesertPopulated = false;

      const res = origLoadRegion.call(this, regionId);

      // Synchronously populate custom region objects
      if (regionId === 'volcano_cave') {
        volcanoCavePopulated = true;
        populateVolcanoCave(this);
      } else if (regionId === 'underwater_palace') {
        underwaterPalacePopulated = true;
        populateUnderwaterPalace(this);
      } else if (regionId === 'golden_sanctuary') {
        goldenSanctuaryPopulated = true;
        populateGoldenSanctuary(this);
      } else if (regionId === 'dinosaur_world') {
        dinoWorldPopulated = true;
        populateDinosaurWorld(this);
      } else if (regionId === 'sugar_world') {
        sugarWorldPopulated = true;
        populateSugarWorld(this);
      } else if (regionId === 'jokerooms') {
        jokeroomsPopulated = true;
        populateJokerooms(this);
      } else if (regionId === 'ruin_village') {
        ruinVillagePopulated = true;
        populateRuinVillage(this);
      } else if (regionId === 'water_cave') {
        waterCavePopulated = true;
        populateWaterCave(this);
      } else if (regionId === 'bee_desert') {
        beeDesertPopulated = true;
        populateBeeDesert(this);
      }

      // Ensure player and camera spawn safely inside the map
      ensureSafeLevelSpawn(this, regionId, false);

      setTimeout(() => {
        if (this.currentRegion === regionId) {
          ensureSafeLevelSpawn(this, regionId, true);
        }
      }, 60);

      setTimeout(() => {
        if (this.currentRegion === regionId) {
          ensureSafeLevelSpawn(this, regionId, true);
        }
      }, 180);

      return res;
    };
  }

  // Return Portals Animation & Touch Handler
  if (game._returnPortals && game._returnPortals.length > 0) {
    for (let i = game._returnPortals.length - 1; i >= 0; i--) {
      const p = game._returnPortals[i];
      if (p && p.parent && p.userData && typeof p.userData.update === 'function') {
        p.userData.update();
      } else if (!p || !p.parent) {
        game._returnPortals.splice(i, 1);
      }
    }
  }

  // Universal Fall Protection: If player drops below floor, safely respawn at start
  if (game.playerPos && game.currentLevel && !window.__isParkourActive) {
    const r = game.currentRegion || 'hub';
    const minY = (r === 'water_cave' || r === 'underwater_palace') ? -35.0 :
                 (r === 'space_realm') ? -30.0 :
                 (r === 'sugar_world') ? -5.0 :
                 (r === 'volcano_cave') ? -10.0 : -15.0;
    if (game.playerPos.y < minY) {
      if (typeof ensureSafeLevelSpawn === 'function') {
        ensureSafeLevelSpawn(game, r, true);
      } else if (game.currentLevel.spawnPoint) {
        game.playerPos.copy(game.currentLevel.spawnPoint);
        if (game.playerVel) game.playerVel.set(0, 0, 0);
      }
      if (game.callbacks && game.callbacks.onShowNotice) {
        game.callbacks.onShowNotice("✨ Güvenli başlangıç platformuna geri getirildin!", "info");
      }
    }
  }

  // If in Hub (Ayı Köyü), guarantee all boss health bars remain hidden
  if (game.currentRegion === 'hub' || !game.currentRegion) {
      if (typeof hideAllBossHealthBars === 'function') hideAllBossHealthBars();
  }

  // --- 13. BÖLÜM: YIKILMIŞ KÖY (RUIN VILLAGE) POPULATION TRIGGER ---
  
  // --- 14. BÖLÜM: EFSANEVİ ALTIN CENNETİ & ALTIN PARA BOSSU POPULATION TRIGGER ---
  if (game.currentRegion === 'golden_sanctuary' && !goldenSanctuaryPopulated) {
      goldenSanctuaryPopulated = true;
      populateGoldenSanctuary(game);
  } else if (game.currentRegion !== 'golden_sanctuary') {
      goldenSanctuaryPopulated = false;
      if (typeof updateGoldCoinBossHealthBar === 'function') updateGoldCoinBossHealthBar(0, 900);
  }

  // --- 14. BÖLÜM: EFSANEVİ ALTIN CENNETİ LOOP & GOLD COIN BOSS COMBAT ---
  if (game.currentRegion === 'golden_sanctuary' && game.currentLevel) {
      const pPos = game.playerPos;
      const dt = 0.016;

      // Respawn if fallen into golden abyss (below y = -10)
      if (pPos && game.currentLevel.spawnPoint) {
          if (pPos.y < -10.0) {
              game.playerPos.copy(game.currentLevel.spawnPoint);
              if (game.playerVel) game.playerVel.set(0, 0, 0);
              if (game.callbacks && game.callbacks.onShowNotice) {
                  game.callbacks.onShowNotice("✨ Göksel bulutlardan süzüldün! Son altın kayıt noktasından devam ediyorsun.", "warn");
              }
          }
      }

      // Checkpoints activation
      if (pPos && game.currentLevel.checkpoints) {
          (game.currentLevel.checkpoints || []).forEach(cp => {
              updateAndActivateCheckpoint(game, cp);
          });
      }

      // Moving Platforms Update for Golden Sanctuary (Solid Collision & Carrying Physics)
      if (game.currentLevel.movingPlatforms && game.currentLevel.movingPlatforms.length > 0) {
          if (!game.currentLevel.colliders) game.currentLevel.colliders = [];
          game.currentLevel.colliders = game.currentLevel.colliders.filter(c => !c.isGoldMoving);
          (game.currentLevel.movingPlatforms || []).forEach(plat => {
              if (!plat) return;
              if (!plat.basePos) plat.basePos = plat.currentPos ? plat.currentPos.clone() : (plat.startPos ? plat.startPos.clone() : new THREE.Vector3());
              if (!plat.currentPos) plat.currentPos = plat.basePos.clone();
              if (!plat.prevPos) plat.prevPos = plat.currentPos.clone();
              if (!plat.moveVec) plat.moveVec = new THREE.Vector3();

              plat.prevPos.copy(plat.currentPos);
              plat.timer = (plat.timer || 0) + dt * (plat.speed || 1);
              const offset = Math.sin(plat.timer);
              plat.currentPos.x = plat.basePos.x + plat.moveVec.x * offset;
              plat.currentPos.y = plat.basePos.y + plat.moveVec.y * offset;
              plat.currentPos.z = plat.basePos.z + plat.moveVec.z * offset;
              if (plat.mesh) plat.mesh.position.copy(plat.currentPos);

              const pw = plat.w || (plat.size ? plat.size.x : 10);
              const ph = plat.h || (plat.size ? plat.size.y : 1.8);
              const pd = plat.d || (plat.size ? plat.size.z : 10);
              const hx = pw / 2;
              const hy = ph / 2;
              const hz = pd / 2;

              // Register solid AABB collider
              game.currentLevel.colliders.push({
                  min: new THREE.Vector3(plat.currentPos.x - hx, plat.currentPos.y - hy, plat.currentPos.z - hz),
                  max: new THREE.Vector3(plat.currentPos.x + hx, plat.currentPos.y + hy, plat.currentPos.z + hz),
                  isGoldMoving: true
              });

              // Player ride & carry physics
              if (pPos) {
                  const platTopY = plat.currentPos.y + hy;
                  const dx = plat.currentPos.x - plat.prevPos.x;
                  const dy = plat.currentPos.y - plat.prevPos.y;
                  const dz = plat.currentPos.z - plat.prevPos.z;

                  const isPlayerOnPlat = (
                      pPos.x >= plat.currentPos.x - hx - 0.4 &&
                      pPos.x <= plat.currentPos.x + hx + 0.4 &&
                      pPos.z >= plat.currentPos.z - hz - 0.4 &&
                      pPos.z <= plat.currentPos.z + hz + 0.4 &&
                      pPos.y >= platTopY - 0.8 &&
                      pPos.y <= platTopY + 1.2
                  );

                  if (isPlayerOnPlat) {
                      const isJumping = (game.playerVel && game.playerVel.y > 0.2) || game.inputs.jump;
                      if (!isJumping) {
                          pPos.x += dx;
                          pPos.z += dz;
                          if (dy > 0 || pPos.y < platTopY + 0.15) {
                              pPos.y = platTopY;
                              if (game.playerVel && game.playerVel.y < 0) game.playerVel.y = 0;
                          }
                          if (game.isGrounded !== undefined) game.isGrounded = true;
                          if (game.jumpCount !== undefined) game.jumpCount = 0;
                      }
                  }
              }
          });
      }

      // --- 👑 İMPARATOR DEV ALTIN PARA BOSSU GELİŞMİŞ SAVAŞ YAPAY ZEKASI & 3 FAZ ---
      if (game.currentLevel.goldCoinBoss) {
        const boss = game.currentLevel.goldCoinBoss;
        if (boss.hp > 0 && pPos) {
          boss.animTimer = (boss.animTimer || 0) + dt * 4.8;
          if (boss.hitInvulnTimer === undefined) boss.hitInvulnTimer = 0;
          if (boss.hitInvulnTimer > 0) boss.hitInvulnTimer -= dt;

          const dist = boss.pos.distanceTo(pPos);
          const dXZ = Math.sqrt((pPos.x - boss.pos.x) ** 2 + (pPos.z - boss.pos.z) ** 2);

          // Update Phase Logic
          const hpPct = boss.hp / boss.maxHp;
          if (hpPct <= 0.35) {
            boss.phase = 3;
            if (boss.phaseAnnounced < 3) {
              boss.phaseAnnounced = 3;
              if (game.callbacks && game.callbacks.onShowNotice) {
                game.callbacks.onShowNotice("⚡ İMPARATOR ALTIN PARA: 3. FAZ! Yıkılmaz hazinemi vermem! ALTIN METEOR FIRTINASI!", "warn");
              }
              if (game.spawnSparkleParticles) {
                game.spawnSparkleParticles(boss.pos.clone().add(new THREE.Vector3(0, 6, 0)), 60, 0xef4444);
              }
            }
          } else if (hpPct <= 0.70) {
            boss.phase = 2;
            if (boss.phaseAnnounced < 2) {
              boss.phaseAnnounced = 2;
              if (game.callbacks && game.callbacks.onShowNotice) {
                game.callbacks.onShowNotice("🔥 İMPARATOR ALTIN PARA: 2. FAZ! Altın Öfke uyandı! Şok dalgalarımdan kaçamazsın!", "warn");
              }
              if (game.spawnSparkleParticles) {
                game.spawnSparkleParticles(boss.pos.clone().add(new THREE.Vector3(0, 6, 0)), 45, 0xf97316);
              }
            }
          }

          // Health bar update: ONLY display when player is near boss arena (end of section)
          if (typeof updateGoldCoinBossHealthBar === 'function') {
            if (dist < 85 || pPos.z <= -280) {
              updateGoldCoinBossHealthBar(boss.hp, boss.maxHp);
            } else {
              updateGoldCoinBossHealthBar(0, boss.maxHp);
            }
          }

          // Damage Helper Function for Gold Boss
          const applyDamageToGoldBoss = (amount, attackName) => {
            if (boss.hp <= 0 || boss.hitInvulnTimer > 0) return;
            boss.hitInvulnTimer = 0.55; // Solid invulnerability cooldown between hits
            boss.hp = Math.max(0, boss.hp - amount);
            if (typeof updateGoldCoinBossHealthBar === 'function') updateGoldCoinBossHealthBar(boss.hp, boss.maxHp);
            if (game.spawnSparkleParticles) {
              game.spawnSparkleParticles(boss.pos.clone().add(new THREE.Vector3(0, 5.0, 0)), 35, 0xfacc15);
              game.spawnSparkleParticles(pPos, 20, 0xffffff);
            }
            // Flash red on hit
            if (boss.mesh) {
              boss.mesh.traverse(child => {
                if (child.isMesh && child.material && child.material.emissive) {
                  const orig = child.material.emissive.getHex();
                  child.material.emissive.setHex(0xff2200);
                  setTimeout(() => {
                    if (child && child.material && child.material.emissive) {
                      child.material.emissive.setHex(orig);
                    }
                  }, 220);
                }
              });
            }
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("💥 " + attackName + "! Dev Altın Para Hasar Aldı! (-" + amount + " HP) [Kalan: " + Math.ceil(boss.hp) + " / " + boss.maxHp + "]", "success");
            }
          };

          // Aura mini-coin rotation (faster in higher phases)
          const auraRing = boss.mesh.getObjectByName('coin_aura_ring');
          if (auraRing) {
            auraRing.rotation.y += (boss.phase === 3 ? 5.5 : (boss.phase === 2 ? 3.5 : 2.0)) * dt;
          }

          // 1. Chasing / Walking AI
          if (dist < 85) {
            // Rotate facing player
            boss.mesh.rotation.y = Math.atan2(pPos.x - boss.pos.x, pPos.z - boss.pos.z);

            // Active Walk towards Player (within Arena radius 36)
            const chaseSpeed = boss.phase === 3 ? 6.2 : (boss.phase === 2 ? 5.4 : 4.6);
            if (dist > 5.8) {
              const dir = pPos.clone().sub(boss.pos).normalize();
              boss.pos.x += dir.x * chaseSpeed * dt;
              boss.pos.z += dir.z * chaseSpeed * dt;

              // Constrain inside circular Colosseum arena (center: 0, -340, radius: 36)
              const dArena = Math.sqrt(boss.pos.x * boss.pos.x + (boss.pos.z - (-340)) ** 2);
              if (dArena > 36) {
                const aAng = Math.atan2(boss.pos.z - (-340), boss.pos.x);
                boss.pos.x = Math.cos(aAng) * 36;
                boss.pos.z = -340 + Math.sin(aAng) * 36;
              }
            }

            // Sync mesh position with stepping bounce
            boss.mesh.position.x = boss.pos.x;
            boss.mesh.position.z = boss.pos.z;
            boss.mesh.position.y = boss.pos.y + Math.abs(Math.sin(boss.animTimer * 2.2)) * 0.4;

            // Leg Walking Strides Animation
            const legL = boss.mesh.getObjectByName('coin_leg_left');
            const legR = boss.mesh.getObjectByName('coin_leg_right');
            if (legL) {
              legL.rotation.x = Math.sin(boss.animTimer * 2.2) * 0.7;
              legL.position.y = 2.2 + Math.max(0, Math.sin(boss.animTimer * 2.2)) * 0.45;
            }
            if (legR) {
              legR.rotation.x = -Math.sin(boss.animTimer * 2.2) * 0.7;
              legR.position.y = 2.2 + Math.max(0, -Math.sin(boss.animTimer * 2.2)) * 0.45;
            }

            // Arm Walking Swing & Punching Gestures
            const armL = boss.mesh.getObjectByName('coin_arm_left');
            const armR = boss.mesh.getObjectByName('coin_arm_right');
            if (armL) armL.rotation.x = -Math.sin(boss.animTimer * 2.2) * 0.65;
            if (armR) armR.rotation.x = Math.sin(boss.animTimer * 2.2) * 0.65;

            // 2. Ranged Attack: Fırlatılan Dönen Altın Paralar (Phase 1, 2, 3)
            if (boss.attackCooldown <= 0) {
              boss.attackCooldown = boss.phase === 3 ? 1.8 : 2.4;
              const handPos1 = boss.pos.clone().add(new THREE.Vector3(
                Math.sin(boss.mesh.rotation.y + 0.8) * 4.5,
                6.5,
                Math.cos(boss.mesh.rotation.y + 0.8) * 4.5
              ));
              const handPos2 = boss.pos.clone().add(new THREE.Vector3(
                Math.sin(boss.mesh.rotation.y - 0.8) * 4.5,
                6.5,
                Math.cos(boss.mesh.rotation.y - 0.8) * 4.5
              ));
              createFireball(game, handPos1, pPos);
              createFireball(game, handPos2, pPos);
              if (boss.phase >= 2) {
                // Triple coin in phase 2 & 3
                createFireball(game, boss.pos.clone().add(new THREE.Vector3(0, 9.5, 0)), pPos);
              }
            } else {
              boss.attackCooldown -= dt;
            }

            // 3. Phase 2 & 3 Special: Dev Altın Zıplama & Şok Dalgası (Golden Shockwave Stomp)
            if (boss.phase >= 2) {
              if (boss.shockwaveTimer === undefined) boss.shockwaveTimer = 4.5;
              boss.shockwaveTimer -= dt;
              if (boss.shockwaveTimer <= 0) {
                boss.shockwaveTimer = boss.phase === 3 ? 3.6 : 4.8;
                // Emit Shockwave notice & particles
                if (game.spawnSparkleParticles) {
                  for (let s = 0; s < 36; s++) {
                    const ang = (s / 36) * Math.PI * 2;
                    const spPos = boss.pos.clone().add(new THREE.Vector3(Math.cos(ang) * 12, 0.5, Math.sin(ang) * 12));
                    game.spawnSparkleParticles(spPos, 4, 0xfacc15);
                  }
                }
                // Check if player is on ground within shockwave reach (radius 26)
                if (dist < 26 && pPos.y < boss.pos.y + 2.0) {
                  if (game.damagePlayer) game.damagePlayer(22);
                  if (game.callbacks && game.callbacks.onShowNotice) {
                    game.callbacks.onShowNotice("⚠️ ALTIN ŞOK DALGASI! Yere basıyordun, üzerinden zıpla! (-22 Can)", "warn");
                  }
                }
              }
            }

            // 4. Phase 3 Special: Altın Meteor Fırtınası (Golden Meteor Storm)
            if (boss.phase === 3) {
              if (boss.meteorTimer === undefined) boss.meteorTimer = 3.0;
              boss.meteorTimer -= dt;
              if (boss.meteorTimer <= 0) {
                boss.meteorTimer = 2.8;
                const meteorTarget = pPos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 12, 0, (Math.random() - 0.5) * 12));
                const meteorOrigin = meteorTarget.clone().add(new THREE.Vector3(0, 30, 0));
                createFireball(game, meteorOrigin, meteorTarget);
                if (game.spawnSparkleParticles) game.spawnSparkleParticles(meteorTarget, 20, 0xfacc15);
              }
            }

            // 5. Melee Stomp / Heavy Golden Fist Attack on Player
            if (!boss.meleeCooldown) boss.meleeCooldown = 0;
            if (dist < 6.8 && boss.meleeCooldown <= 0) {
              boss.meleeCooldown = 1.6;
              const meleeDmg = boss.phase === 3 ? 28 : (boss.phase === 2 ? 24 : 20);
              if (game.damagePlayer) game.damagePlayer(meleeDmg);
              if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos, 25, 0xfacc15);
              if (game.callbacks && game.callbacks.onShowNotice) {
                game.callbacks.onShowNotice("💰 Dev Altın Yumruk İsabet Etti! (-" + meleeDmg + " Can)", "warn");
              }
            } else if (boss.meleeCooldown > 0) {
              boss.meleeCooldown -= dt;
            }
          }

          // 6. HIT DETECTION ON BOSS (TÜM SALDIRILAR, VURUŞLAR VE KAFASINA BASMA)
          // A) Zıplayarak / Havadan Kafasına Basma veya Ground Pound (Stomp from Above)
          if (dXZ < 7.5 && pPos.y >= boss.pos.y + 2.5 && pPos.y <= boss.pos.y + 18.0) {
            if ((game.playerVel && game.playerVel.y < 3.0) || game.isGroundPounding || !game.isGrounded) {
              if (game.playerVel) game.playerVel.y = 28; // Güçlü yukarı zıplama
              applyDamageToGoldBoss(110, "KAFASINA BASTIN");
            }
          }

          // B) Yakın Dövüş / Yumruk / Silah / Takla / Saldırı (Melee, Attack, Spin, Roll)
          const isPlayerAttacking = game.isAttacking || (game.attackTimer && game.attackTimer > 0) || game.isRolling || game.isGroundPounding || (game.inputs && game.inputs.attack);
          if (dXZ < 9.0 && Math.abs(pPos.y - boss.pos.y) < 11.0 && isPlayerAttacking) {
            applyDamageToGoldBoss(75, "ALTIN VURUŞ");
          }

          // 7. Boss Defeat Sequence
          if (boss.hp <= 0 && !boss.deadMessageShown) {
            boss.deadMessageShown = true;
            boss.mesh.visible = false;
            if (typeof updateGoldCoinBossHealthBar === 'function') updateGoldCoinBossHealthBar(0, boss.maxHp);
            // Shower of gold coins and fireworks
            if (game.spawnSparkleParticles) {
              for (let c = 0; c < 8; c++) {
                setTimeout(() => {
                  game.spawnSparkleParticles(boss.pos, 45, 0xfacc15);
                }, c * 140);
              }
            }
            if (game.gainCoins) game.gainCoins(750);
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("🎉 EFSANEVİ ALTIN ZAFERİ! İmparator Altın Para Bossu Mağlup Edildi! 8. Kutsal Altın Bal Kristali Kurtarıldı!", "success");
            }
            // Spawn Victory Portal back to Hub / Dinosaur World
            if (game.spawnBossPortalForCurrentRegion) {
              game.spawnBossPortalForCurrentRegion(boss.pos);
            }
          }
        }
      }
  }

  // --- 15. BÖLÜM: SU MAĞARASI (WATER CAVE) POPULATION TRIGGER ---
  if (game.currentRegion === 'water_cave' && !waterCavePopulated) {
      waterCavePopulated = true;
      populateWaterCave(game);
  } else if (game.currentRegion !== 'water_cave') {
      waterCavePopulated = false;
      if (typeof updateWaterDragonHealthBar === 'function') updateWaterDragonHealthBar(0);
  }

  // --- 15. BÖLÜM: SU MAĞARASI LOOP & KÖSTEBEKLER & DEV SU EJDERHASI COMBAT ---
  if (game.currentRegion === 'water_cave' && game.currentLevel) {
      const pPos = game.playerPos;
      const dt = 0.016;
      const THREE = window.THREE;

      // 1. Dynamic Player Cavern Lantern Light in the Dark
      if (pPos && game.scene) {
        let playerLight = game.scene.getObjectByName('player_cavern_lantern_light');
        if (!playerLight) {
          playerLight = new THREE.PointLight(0x38bdf8, 2.6, 28);
          playerLight.name = 'player_cavern_lantern_light';
          game.scene.add(playerLight);
        }
        playerLight.position.set(pPos.x, pPos.y + 1.8, pPos.z);
      }

      // 2. Respawn if fallen into deep dark water abyss (below y = -8)
      if (pPos && game.currentLevel.spawnPoint) {
          if (pPos.y < -8.0) {
              game.playerPos.copy(game.currentLevel.spawnPoint);
              if (game.playerVel) game.playerVel.set(0, 0, 0);
              if (game.spawnSparkleParticles) game.spawnSparkleParticles(game.currentLevel.spawnPoint, 30, 0x06b6d4);
              if (game.callbacks && game.callbacks.onShowNotice) {
                  game.callbacks.onShowNotice("🌊 Karanlık mağara sularına düştün! Son kontrol noktasına ışınlandın.", "warn");
              }
          }
      }

      // 3. Checkpoints Activation
      if (pPos && game.currentLevel.checkpoints) {
          (game.currentLevel.checkpoints || []).forEach(cp => {
              updateAndActivateCheckpoint(game, cp);
          });
      }

      // 4. Moving Platforms Update for Water Cave
      if (game.currentLevel.movingPlatforms && game.currentLevel.movingPlatforms.length > 0) {
          if (!game.currentLevel.colliders) game.currentLevel.colliders = [];
          game.currentLevel.colliders = game.currentLevel.colliders.filter(c => !c.isWaterCaveMoving);
          (game.currentLevel.movingPlatforms || []).forEach(plat => {
              if (!plat) return;
              if (!plat.basePos) plat.basePos = plat.currentPos ? plat.currentPos.clone() : new THREE.Vector3();
              if (!plat.currentPos) plat.currentPos = plat.basePos.clone();
              if (!plat.moveVec) plat.moveVec = new THREE.Vector3();
              plat.timer = (plat.timer || 0) + dt * (plat.speed || 1);
              const offset = Math.sin(plat.timer);
              plat.currentPos.x = plat.basePos.x + plat.moveVec.x * offset;
              plat.currentPos.y = plat.basePos.y + plat.moveVec.y * offset;
              plat.currentPos.z = plat.basePos.z + plat.moveVec.z * offset;
              if (plat.mesh) plat.mesh.position.copy(plat.currentPos);
              if (plat.size) {
                  const hx = plat.size.x / 2;
                  const hy = plat.size.y / 2;
                  const hz = plat.size.z / 2;
                  game.currentLevel.colliders.push({
                      min: new THREE.Vector3(plat.currentPos.x - hx, plat.currentPos.y - hy, plat.currentPos.z - hz),
                      max: new THREE.Vector3(plat.currentPos.x + hx, plat.currentPos.y + hy, plat.currentPos.z + hz),
                      isWaterCaveMoving: true
                  });
              }
          });
      }

      // 5. Water Geyser Jump Pads (Fluid launch trajectory with cooldown & sound)
      if (pPos && game.currentLevel.jumpPads) {
          ((game.currentLevel && game.currentLevel.jumpPads) || []).forEach(pad => {
              const dPad = Math.sqrt((pPos.x - pad.pos.x) ** 2 + (pPos.z - pad.pos.z) ** 2);
              if (dPad < 3.8 && Math.abs(pPos.y - pad.pos.y) < 2.8) {
                  if (game.playerVel) {
                      const now = Date.now();
                      if (!pad._lastTrigger || now - pad._lastTrigger > 400) {
                          pad._lastTrigger = now;
                          const powerY = pad.boostForce || pad.jumpPower || 28;
                          const powerZ = pad.forwardForce || pad.forwardPower || 0;
                          game.playerVel.y = powerY;
                          if (powerZ !== 0) {
                              game.playerVel.z = powerZ;
                          }
                          if (game.isGrounded !== undefined) game.isGrounded = false;
                          if (window.St && window.St.playJump) window.St.playJump();
                          if (game.spawnSparkleParticles) game.spawnSparkleParticles(pad.pos, 30, 0x38bdf8);
                          if (game.callbacks && game.callbacks.onShowNotice && (!pad._lastNotice || now - pad._lastNotice > 2500)) {
                              pad._lastNotice = now;
                              game.callbacks.onShowNotice("🌊 Güçlü Su Gayzeri Seni İleriye Fırlattı!", "info");
                          }
                      }
                  }
              }
          });
      }

      // 6. 3D Animated Moles (Köstebekler) Idle Animation & Dialogue
      if (game.currentLevel.moles && game.currentLevel.moles.length > 0) {
          game.currentLevel.moleAnimTime = (game.currentLevel.moleAnimTime || 0) + dt * 3.5;
          ((game.currentLevel && game.currentLevel.moles) || []).forEach(mole => {
              if (mole && mole.head) {
                  mole.head.rotation.x = Math.sin(game.currentLevel.moleAnimTime + (mole.group.position.x * 0.2)) * 0.12;
              }
              if (mole && mole.pawL && mole.pawR) {
                  mole.pawL.rotation.x = Math.sin(game.currentLevel.moleAnimTime * 1.5) * 0.35;
                  mole.pawR.rotation.x = -Math.sin(game.currentLevel.moleAnimTime * 1.5) * 0.35;
              }

              // Proximity Dialogue Trigger for Captain Mole
              if (pPos && mole.name === "Kaptan Kazıcı") {
                  const dMole = Math.sqrt((pPos.x - mole.group.position.x) ** 2 + (pPos.z - mole.group.position.z) ** 2);
                  if (dMole < 8.0 && !game.currentLevel.moleSpoken) {
                      game.currentLevel.moleSpoken = true;
                      if (game.callbacks && game.callbacks.onShowNotice) {
                          game.callbacks.onShowNotice("🐾 Köstebek Kaptan Kazıcı: 'Onu yenebilirsin, güveniyorum sana!'", "success");
                      }
                      if (game.spawnSparkleParticles) {
                          game.spawnSparkleParticles(mole.group.position.clone().add(new THREE.Vector3(0, 4, 0)), 30, 0xfacc15);
                      }
                  }
              }
          });
      }

      // 7. --- 🐉 DEV SU EJDERHASI (HYDROS) BOSS COMBAT & AYDINLATAN ALEV TOPLARI ---
      if (game.currentLevel.waterDragonBoss) {
          const boss = game.currentLevel.waterDragonBoss;
          if (boss.hp > 0 && pPos) {
              boss.animTimer = (boss.animTimer || 0) + dt * 3.0;

              const dist = boss.pos.distanceTo(pPos);
              const dXZ = Math.sqrt((pPos.x - boss.pos.x) ** 2 + (pPos.z - boss.pos.z) ** 2);

              // Health Bar Update: ONLY show when in proximity of the boss arena / end of the level
              if (dist < 90 || pPos.z <= -680) {
                  updateWaterDragonHealthBar(boss.hp, boss.maxHp);
              } else {
                  updateWaterDragonHealthBar(0, boss.maxHp);
              }

              // Wings Flapping & Body Motion
              if (boss.wingL && boss.wingR) {
                  boss.wingL.rotation.z = Math.PI / 2.5 + Math.sin(boss.animTimer * 2.8) * 0.45;
                  boss.wingR.rotation.z = -Math.PI / 2.5 - Math.sin(boss.animTimer * 2.8) * 0.45;
              }
              if (boss.tail) {
                  boss.tail.rotation.y = Math.sin(boss.animTimer * 1.8) * 0.4;
              }
              if (boss.jaw) {
                  boss.jaw.rotation.x = Math.max(0, Math.sin(boss.animTimer * 2.0)) * 0.4;
              }

              // Rotate Boss Mesh towards Player in Arena
              const angleToPlayer = Math.atan2(pPos.x - boss.pos.x, pPos.z - boss.pos.z);
              boss.mesh.rotation.y = angleToPlayer;

              // Phase Updates
              const hpPct = boss.hp / boss.maxHp;
              if (hpPct <= 0.35 && boss.phaseAnnounced < 3) {
                  boss.phaseAnnounced = 3;
                  boss.phase = 3;
                  if (game.callbacks && game.callbacks.onShowNotice) {
                      game.callbacks.onShowNotice("🔥 DEV SU EJDERHASI: 3. FAZ! Aydınlatan Öfkeli Alev Kıyameti!", "warn");
                  }
                  if (game.spawnSparkleParticles) {
                      game.spawnSparkleParticles(boss.pos.clone().add(new THREE.Vector3(0, 8, 0)), 50, 0xef4444);
                  }
              } else if (hpPct <= 0.70 && boss.phaseAnnounced < 2) {
                  boss.phaseAnnounced = 2;
                  boss.phase = 2;
                  if (game.callbacks && game.callbacks.onShowNotice) {
                      game.callbacks.onShowNotice("⚡ DEV SU EJDERHASI: 2. FAZ! Aydınlatan Alev Yağmuru!", "warn");
                  }
                  if (game.spawnSparkleParticles) {
                      game.spawnSparkleParticles(boss.pos.clone().add(new THREE.Vector3(0, 8, 0)), 40, 0xf97316);
                  }
              }

              // --- AYDINLATAN ALEV TOPLARI FIRLATMA (Illuminating Fireballs) ---
              if (boss.attackCooldown <= 0 && dist < 90.0) {
                  boss.attackCooldown = boss.phase === 3 ? 1.2 : (boss.phase === 2 ? 1.8 : 2.4);

                  // Create illuminating fireball that dynamically lights up the cave!
                  const mouthPos = boss.pos.clone().add(new THREE.Vector3(
                      Math.sin(angleToPlayer) * 4.0,
                      8.5,
                      Math.cos(angleToPlayer) * 4.0
                  ));

                  const fireDir = pPos.clone().add(new THREE.Vector3(0, 1.2, 0)).sub(mouthPos).normalize();

                  // Fireball Mesh
                  const fbGeo = new THREE.SphereGeometry(1.4, 12, 12);
                  const fbMat = new THREE.MeshStandardMaterial({
                      color: 0xff4500,
                      emissive: 0xff7700,
                      emissiveIntensity: 3.2,
                      roughness: 0.1
                  });
                  const fbMesh = new THREE.Mesh(fbGeo, fbMat);
                  fbMesh.position.copy(mouthPos);
                  game.currentLevel.sceneGroup.add(fbMesh);

                  // Intense attached PointLight that actively illuminates the dark cave as it flies!
                  const fbLight = new THREE.PointLight(0xff6600, 6.5, 55);
                  fbLight.position.copy(mouthPos);
                  game.currentLevel.sceneGroup.add(fbLight);

                  game.currentLevel.illuminatingFireballs.push({
                      mesh: fbMesh,
                      light: fbLight,
                      pos: mouthPos.clone(),
                      dir: fireDir,
                      speed: 28.0,
                      life: 4.5
                  });

                  if (game.callbacks && game.callbacks.onShowNotice && Math.random() < 0.3) {
                      game.callbacks.onShowNotice("🔥 Ejderha alev topu fırlattı! Mağaranın aydınlığını takip et!", "info");
                  }
              } else {
                  boss.attackCooldown -= dt;
              }

              // Damage Dragon on Head/Crown Jump Stomp
              if (dXZ < 7.0 && pPos.y > (boss.pos.y + 6.5) && game.playerVel && game.playerVel.y < 0) {
                  game.playerVel.y = 18.0;
                  boss.hp = Math.max(0, boss.hp - 5);
                  updateWaterDragonHealthBar(boss.hp, boss.maxHp);
                  triggerScreenShake();
                  if (game.spawnSparkleParticles) {
                      game.spawnSparkleParticles(boss.pos.clone().add(new THREE.Vector3(0, 9, 0)), 35, 0x38bdf8);
                  }
                  if (game.callbacks && game.callbacks.onShowNotice) {
                      game.callbacks.onShowNotice(`⚔️ EJDERHA EZİLDİ! Dev Su Ejderhası Hasar Aldı! (${boss.hp}/${boss.maxHp})`, "success");
                  }
              }

              // Damage Dragon on Attack/Laser
              const isPlayerAttacking = game.isAttacking || (game.attackTimer && game.attackTimer > 0) || game.isRolling || (game.inputs && game.inputs.attack);
              if (dXZ < 9.5 && Math.abs(pPos.y - boss.pos.y) < 10.0 && isPlayerAttacking) {
                  if (!boss.hitCooldown || boss.hitCooldown <= 0) {
                      boss.hitCooldown = 0.35;
                      boss.hp = Math.max(0, boss.hp - 3);
                      updateWaterDragonHealthBar(boss.hp, boss.maxHp);
                      triggerScreenShake();
                      if (game.spawnSparkleParticles) {
                          game.spawnSparkleParticles(boss.pos.clone().add(new THREE.Vector3(0, 6, 0)), 25, 0x06b6d4);
                      }
                  }
              }
              if (boss.hitCooldown > 0) boss.hitCooldown -= dt;

              // --- 8. EJDERHA ÖLÜNCE 'AFFERİNN' REPLİĞİ & ZAFER ---
              if (boss.hp <= 0 && !boss.deadMessageShown) {
                  boss.deadMessageShown = true;
                  boss.mesh.visible = false;
                  updateWaterDragonHealthBar(0, boss.maxHp);

                  // Final Defeat Dialogue & Exact User Quote
                  if (game.callbacks && game.callbacks.onShowNotice) {
                      game.callbacks.onShowNotice("🐉 Dev Su Ejderhası: 'Afferinn... Gerçekten çok güçlüymüşsün Süper Ayı... Afferinn!'", "success");
                  }

                  triggerScreenShake();

                  // Golden and water fireworks
                  if (game.spawnSparkleParticles) {
                      for (let k = 0; k < 10; k++) {
                          setTimeout(() => {
                              game.spawnSparkleParticles(boss.pos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 10, Math.random() * 8, (Math.random() - 0.5) * 10)), 50, 0x38bdf8);
                              game.spawnSparkleParticles(boss.pos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 10, Math.random() * 8, (Math.random() - 0.5) * 10)), 50, 0xfacc15);
                          }, k * 160);
                      }
                  }

                  if (game.gainCoins) game.gainCoins(600);

                  // Spawn Victory Portal back to Hub
                  const portalPos = new THREE.Vector3(0, 31.0, -750);
                  const portalMesh = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.7, 12, 24), new THREE.MeshStandardMaterial({
                      color: 0x38bdf8,
                      emissive: 0x0284c7,
                      emissiveIntensity: 1.5
                  }));
                  portalMesh.position.copy(portalPos);
                  portalMesh.name = "victory_portal_hub";
                  game.currentLevel.sceneGroup.add(portalMesh);

                  const pLight = new THREE.PointLight(0x38bdf8, 3.5, 25);
                  pLight.position.copy(portalPos);
                  game.currentLevel.sceneGroup.add(pLight);
              }
          }

          // Stepping into Victory Portal back to Bear Village (Ayı Köyü)
          if (boss.deadMessageShown && pPos) {
              const dPortal = pPos.distanceTo(new THREE.Vector3(0, 31.0, -750));
              if (dPortal < 4.5 && !boss._portalUsed) {
                  boss._portalUsed = true;
                  hideAllBossHealthBars();
                  if (game.callbacks && game.callbacks.onShowNotice) {
                      game.callbacks.onShowNotice("🌀 Zafer Portalı: Ayı Köyü'ne dönülüyor...", "success");
                  }
                  if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos, 45, 0x38bdf8);
                  setTimeout(() => {
                      hideAllBossHealthBars();
                      if (game.loadRegion) game.loadRegion('hub');
                      else if (game.callbacks && game.callbacks.onSelectRegion) game.callbacks.onSelectRegion('hub');
                  }, 600);
              }
          }
      }

      // 8. Update Illuminating Fireballs Flying & Collisions
      if (game.currentLevel.illuminatingFireballs && game.currentLevel.illuminatingFireballs.length > 0) {
          const toRemove = [];
          ((game.currentLevel && game.currentLevel.illuminatingFireballs) || []).forEach((fb, idx) => {
              fb.life -= dt;
              fb.pos.addScaledVector(fb.dir, dt * fb.speed);
              if (fb.mesh) fb.mesh.position.copy(fb.pos);
              if (fb.light) fb.light.position.copy(fb.pos);

              // Check collision with ground or player
              let hit = false;
              if (pPos) {
                  const dPlayer = fb.pos.distanceTo(pPos);
                  if (dPlayer < 3.2) {
                      hit = true;
                      if (game.damagePlayer) game.damagePlayer(1);
                      triggerScreenShake();
                      if (game.playerVel) {
                          game.playerVel.y = 8.0;
                          game.playerVel.x += fb.dir.x * 12.0;
                          game.playerVel.z += fb.dir.z * 12.0;
                      }
                  }
              }

              if (fb.pos.y <= 29.2 || fb.life <= 0) {
                  hit = true;
              }

              if (hit) {
                  toRemove.push(idx);
                  if (game.spawnSparkleParticles) {
                      game.spawnSparkleParticles(fb.pos, 30, 0xff6600);
                      game.spawnSparkleParticles(fb.pos, 20, 0x38bdf8);
                  }
                  if (fb.mesh && fb.mesh.parent) fb.mesh.parent.remove(fb.mesh);
                  if (fb.light && fb.light.parent) fb.light.parent.remove(fb.light);
              }
          });

          for (let i = toRemove.length - 1; i >= 0; i--) {
              game.currentLevel.illuminatingFireballs.splice(toRemove[i], 1);
          }
      }
  }

  // --- 15. BÖLÜM: ARILARIN ÇÖLÜ (BEE DESERT) POPULATION TRIGGER ---
  if (game.currentRegion === 'bee_desert' && !beeDesertPopulated) {
      beeDesertPopulated = true;
      populateBeeDesert(game);
  } else if (game.currentRegion !== 'bee_desert') {
      beeDesertPopulated = false;
      if (typeof updateDesertCrocodileHealthBar === 'function') updateDesertCrocodileHealthBar(0);
  }

  // --- 15. BÖLÜM: ARILARIN ÇÖLÜ & PİRAMİT LABİRENTİ & DEV TİMSAH (SOBEK) LOOP ---
  if (game.currentRegion === 'bee_desert' && game.currentLevel) {
      const pPos = game.playerPos;
      const dt = 0.016;
      const THREE = window.THREE;

      // 1. Dynamic Desert Sun Flare & Lantern Light
      if (pPos && game.scene) {
        let playerSunLight = game.scene.getObjectByName('player_desert_sun_light');
        if (!playerSunLight) {
          playerSunLight = new THREE.PointLight(0xf59e0b, 2.4, 30);
          playerSunLight.name = 'player_desert_sun_light';
          game.scene.add(playerSunLight);
        }
        playerSunLight.position.set(pPos.x, pPos.y + 2.0, pPos.z);
      }

      // 2. Respawn if fallen into endless quicksand canyon (below y = -10)
      if (pPos && game.currentLevel.spawnPoint) {
          if (pPos.y < -10.0) {
              game.playerPos.copy(game.currentLevel.spawnPoint);
              if (game.playerVel) game.playerVel.set(0, 0, 0);
              if (game.spawnSparkleParticles) game.spawnSparkleParticles(game.currentLevel.spawnPoint, 30, 0xf59e0b);
              if (game.callbacks && game.callbacks.onShowNotice) {
                  game.callbacks.onShowNotice("🏜️ Çöl kumullarının derinliklerine düştün! Son kontrol noktasına ışınlandın.", "warn");
              }
          }
      }

      // 3. Checkpoints Activation
      if (pPos && game.currentLevel.checkpoints) {
          (game.currentLevel.checkpoints || []).forEach(cp => {
              updateAndActivateCheckpoint(game, cp);
          });
      }

      // 4. Moving Sandstone Platforms Update (Çöl Yavaş Hareketli Platformları & Oyuncuyu Taşıma Fiziği)
      if (game.currentLevel.movingPlatforms && game.currentLevel.movingPlatforms.length > 0) {
          if (!game.currentLevel.colliders) game.currentLevel.colliders = [];
          game.currentLevel.colliders = game.currentLevel.colliders.filter(c => !c.isBeeDesertMoving);
          (game.currentLevel.movingPlatforms || []).forEach(plat => {
              if (!plat) return;
              if (!plat.basePos) plat.basePos = plat.currentPos ? plat.currentPos.clone() : new THREE.Vector3();
              if (!plat.currentPos) plat.currentPos = plat.basePos.clone();
              if (!plat.prevPos) plat.prevPos = plat.currentPos.clone();
              if (!plat.moveVec) plat.moveVec = new THREE.Vector3();

              plat.prevPos.copy(plat.currentPos);
              // Yavaş ve yumuşak hız çarpanı (ör. 0.65)
              plat.timer = (plat.timer || 0) + dt * (plat.speed || 0.65);
              const offset = Math.sin(plat.timer);
              plat.currentPos.x = plat.basePos.x + plat.moveVec.x * offset;
              plat.currentPos.y = plat.basePos.y + plat.moveVec.y * offset;
              plat.currentPos.z = plat.basePos.z + plat.moveVec.z * offset;
              if (plat.mesh) plat.mesh.position.copy(plat.currentPos);

              const pw = plat.size ? plat.size.x : (plat.w || 6.5);
              const ph = plat.size ? plat.size.y : (plat.h || 1.5);
              const pd = plat.size ? plat.size.z : (plat.d || 6.5);
              const hx = pw / 2;
              const hy = ph / 2;
              const hz = pd / 2;

              game.currentLevel.colliders.push({
                  min: new THREE.Vector3(plat.currentPos.x - hx, plat.currentPos.y - hy, plat.currentPos.z - hz),
                  max: new THREE.Vector3(plat.currentPos.x + hx, plat.currentPos.y + hy, plat.currentPos.z + hz),
                  isBeeDesertMoving: true
              });

              // Oyuncu platformun üzerindeyken birlikte hareket etsin (Kaymayı önler)
              if (pPos) {
                  const platTopY = plat.currentPos.y + hy;
                  const dx = plat.currentPos.x - plat.prevPos.x;
                  const dy = plat.currentPos.y - plat.prevPos.y;
                  const dz = plat.currentPos.z - plat.prevPos.z;

                  const isPlayerOnPlat = (
                      pPos.x >= plat.currentPos.x - hx - 0.4 &&
                      pPos.x <= plat.currentPos.x + hx + 0.4 &&
                      pPos.z >= plat.currentPos.z - hz - 0.4 &&
                      pPos.z <= plat.currentPos.z + hz + 0.4 &&
                      pPos.y >= platTopY - 0.6 &&
                      pPos.y <= platTopY + 1.2
                  );

                  if (isPlayerOnPlat) {
                      const isJumping = (game.playerVel && game.playerVel.y > 0.2) || game.inputs.jump;
                      if (!isJumping) {
                          pPos.x += dx;
                          pPos.z += dz;
                          if (dy > 0 || pPos.y < platTopY + 0.15) {
                              pPos.y += dy;
                          }
                          if (game.isGrounded !== undefined) game.isGrounded = true;
                      }
                  }
              }
          });
      }

      // 5. Spinning Sandstone & Blade Obstacles
      if (game.currentLevel.spinningObstacles && game.currentLevel.spinningObstacles.length > 0) {
          ((game.currentLevel && game.currentLevel.spinningObstacles) || []).forEach(obs => {
              if (obs.mesh) {
                  obs.mesh.rotation.y += dt * (obs.speed || 2.0);
              }
              if (pPos && obs.pos) {
                  const dObs = Math.sqrt((pPos.x - obs.pos.x) ** 2 + (pPos.z - obs.pos.z) ** 2);
                  if (dObs < (obs.radius || 3.0) && Math.abs(pPos.y - obs.pos.y) < 2.5) {
                      const now = Date.now();
                      if (!obs._lastHit || now - obs._lastHit > 1200) {
                          obs._lastHit = now;
                          if (game.damagePlayer) game.damagePlayer(1);
                          triggerScreenShake();
                          if (game.playerVel) {
                              game.playerVel.y = 9.0;
                              const pushAngle = Math.atan2(pPos.z - obs.pos.z, pPos.x - obs.pos.x);
                              game.playerVel.x = Math.cos(pushAngle) * 14.0;
                              game.playerVel.z = Math.sin(pushAngle) * 14.0;
                          }
                          if (game.callbacks && game.callbacks.onShowNotice) {
                              game.callbacks.onShowNotice("⚠️ Dönen kum tuzağına çarptın!", "warn");
                          }
                      }
                  }
              }
          });
      }

      // 6. Desert Sand Geyser Jump Pads
      if (pPos && game.currentLevel.jumpPads) {
          ((game.currentLevel && game.currentLevel.jumpPads) || []).forEach(pad => {
              const dPad = Math.sqrt((pPos.x - pad.pos.x) ** 2 + (pPos.z - pad.pos.z) ** 2);
              if (dPad < 3.8 && Math.abs(pPos.y - pad.pos.y) < 2.8) {
                  if (game.playerVel) {
                      const now = Date.now();
                      if (!pad._lastTrigger || now - pad._lastTrigger > 400) {
                          pad._lastTrigger = now;
                          const powerY = pad.boostForce || pad.jumpPower || 26;
                          const powerZ = pad.forwardForce || pad.forwardPower || 0;
                          game.playerVel.y = powerY;
                          if (powerZ !== 0) {
                              game.playerVel.z = powerZ;
                          }
                          if (game.isGrounded !== undefined) game.isGrounded = false;
                          if (window.St && window.St.playJump) window.St.playJump();
                          if (game.spawnSparkleParticles) game.spawnSparkleParticles(pad.pos, 30, 0xf59e0b);
                          if (game.callbacks && game.callbacks.onShowNotice && (!pad._lastNotice || now - pad._lastNotice > 2500)) {
                              pad._lastNotice = now;
                              game.callbacks.onShowNotice("💨 Güçlü Çöl Kum Gayzeri Seni Havaya Fırlattı!", "info");
                          }
                      }
                  }
              }
          });
      }

      // 7. Interactive Portals & Teleporters (Pyramid Entrance, Exit Guide, Labyrinth Exit)
      if (pPos && game.currentLevel.portals) {
          ((game.currentLevel && game.currentLevel.portals) || []).forEach(portal => {
              const dPortal = pPos.distanceTo(portal.pos);
              if (dPortal < 4.0) {
                  const now = Date.now();
                  if (!portal._lastUsed || now - portal._lastUsed > 2000) {
                      portal._lastUsed = now;
                      if (game.playerPos && portal.targetPos) {
                          game.playerPos.copy(portal.targetPos);
                          if (game.playerVel) game.playerVel.set(0, 0, 0);
                          if (game.spawnSparkleParticles) {
                              game.spawnSparkleParticles(portal.pos, 40, 0xfacc15);
                              game.spawnSparkleParticles(portal.targetPos, 40, 0xfacc15);
                          }
                          if (game.callbacks && game.callbacks.onShowNotice) {
                              game.callbacks.onShowNotice(portal.message || "🌀 Işınlandın!", "success");
                          }
                      }
                  }
              }
          });
      }

      // 8. Desert Bees Patrol & Buzzing Wing Animation & Attack Loop
      if (game.currentLevel.bees && game.currentLevel.bees.length > 0) {
          const bAnimTime = Date.now() * 0.035;
          ((game.currentLevel && game.currentLevel.bees) || []).forEach(bee => {
              if (bee.wingL && bee.wingR) {
                  bee.wingL.rotation.z = Math.sin(bAnimTime * 4.0) * 0.7;
                  bee.wingR.rotation.z = -Math.sin(bAnimTime * 4.0) * 0.7;
              }
              if (bee.mesh && bee.basePos) {
                  bee.hoverTimer = (bee.hoverTimer || 0) + dt * (bee.speed || 1.8);
                  const hoverY = Math.sin(bee.hoverTimer * 2.0) * 0.8;
                  const hoverX = Math.cos(bee.hoverTimer) * (bee.patrolRadius || 3.0);
                  bee.mesh.position.set(bee.basePos.x + hoverX, bee.basePos.y + hoverY, bee.basePos.z);
                  
                  // Proximity Sting Attack
                  if (pPos) {
                      const dBee = pPos.distanceTo(bee.mesh.position);
                      if (dBee < 2.5) {
                          const now = Date.now();
                          if (!bee._lastSting || now - bee._lastSting > 1500) {
                              bee._lastSting = now;
                              if (game.damagePlayer) game.damagePlayer(1);
                              triggerScreenShake();
                              if (game.playerVel) {
                                  game.playerVel.y = 7.0;
                                  const pushAngle = Math.atan2(pPos.z - bee.mesh.position.z, pPos.x - bee.mesh.position.x);
                                  game.playerVel.x = Math.cos(pushAngle) * 10.0;
                                  game.playerVel.z = Math.sin(pushAngle) * 10.0;
                              }
                              if (game.callbacks && game.callbacks.onShowNotice) {
                                  game.callbacks.onShowNotice("🐝 Çöl Arısı İğnesi! Dikkat et!", "warn");
                              }
                          }
                      }
                  }
              }
          });
      }

      // 9. --- 🐊 DEV ÇÖL TİMSAHI (SOBEK) BOSS COMBAT & AI LOOP ---
      if (game.currentLevel.crocodileBoss) {
          const boss = game.currentLevel.crocodileBoss;
          if (boss.hp > 0 && pPos) {
              boss.animTimer = (boss.animTimer || 0) + dt * 3.0;
              const dBoss = Math.sqrt((pPos.x - boss.pos.x) ** 2 + (pPos.z - boss.pos.z) ** 2);

              // Show Boss Can Bar when in Arena (Z < -790)
              if (pPos.z < -790 && dBoss < 85.0) {
                  updateDesertCrocodileHealthBar(boss.hp, boss.maxHp);
              } else {
                  updateDesertCrocodileHealthBar(0, boss.maxHp);
              }

              // Phase transitions
              if (boss.hp <= 15) {
                  boss.phase = 3;
              } else if (boss.hp <= 35) {
                  boss.phase = 2;
              } else {
                  boss.phase = 1;
              }

              // Leg and Tail animations
              if (boss.legs && boss.legs.length >= 4) {
                  const legSwing = Math.sin(boss.animTimer * 2.5) * 0.35;
                  boss.legs[0].rotation.x = legSwing;
                  boss.legs[1].rotation.x = -legSwing;
                  boss.legs[2].rotation.x = -legSwing;
                  boss.legs[3].rotation.x = legSwing;
              }
              if (boss.tailSegments && boss.tailSegments.length > 0) {
                  boss.tailSegments.forEach((seg, idx) => {
                      seg.rotation.y = Math.sin(boss.animTimer * 3.0 + idx * 0.5) * 0.25;
                  });
              }

              // AI State Machine & Movement
              boss.attackCooldown = (boss.attackCooldown || 0) - dt;
              if (dBoss < 70.0 && pPos.z < -800) {
                  // Face player
                  const targetAngle = Math.atan2(pPos.x - boss.pos.x, pPos.z - boss.pos.z);
                  let currentAngle = boss.mesh.rotation.y;
                  let diff = targetAngle - currentAngle;
                  while (diff < -Math.PI) diff += Math.PI * 2;
                  while (diff > Math.PI) diff -= Math.PI * 2;
                  boss.mesh.rotation.y += diff * dt * 3.5;

                  // Move towards player
                  if (dBoss > 9.0) {
                      const moveSpeed = boss.phase === 3 ? 14.0 : (boss.phase === 2 ? 10.0 : 7.0);
                      boss.pos.x += Math.sin(targetAngle) * moveSpeed * dt;
                      boss.pos.z += Math.cos(targetAngle) * moveSpeed * dt;
                      boss.pos.y = 4.0 + Math.sin(boss.animTimer * 4.0) * 0.4;
                  }

                  // Jaw bite animation
                  if (boss.jaw) {
                      if (dBoss < 18.0) {
                          boss.jaw.rotation.x = 0.4 + Math.abs(Math.sin(boss.animTimer * 5.0)) * 0.6;
                      } else {
                          boss.jaw.rotation.x = 0.15;
                      }
                  }

                  // Attack: Bite / Shockwave
                  if (dBoss < 12.0 && boss.attackCooldown <= 0) {
                      boss.attackCooldown = boss.phase === 3 ? 1.4 : 2.2;
                      if (game.damagePlayer) game.damagePlayer(1);
                      triggerScreenShake();
                      if (game.playerVel) {
                          game.playerVel.y = 12.0;
                          game.playerVel.x = Math.sin(targetAngle) * 18.0;
                          game.playerVel.z = Math.cos(targetAngle) * 18.0;
                      }
                      if (game.spawnSparkleParticles) {
                          game.spawnSparkleParticles(boss.pos.clone().add(new THREE.Vector3(0, 3, 0)), 40, 0xf59e0b);
                      }
                      if (game.callbacks && game.callbacks.onShowNotice) {
                          game.callbacks.onShowNotice("🐊 Dev Çöl Timsahı: 'KUM VE ÇÖLÜN HÂKİMİ BENİM!'", "warn");
                      }
                  }

                  // Special Phase 2 & 3: Sand Shockwave / Bee Swarm
                  if (boss.phase >= 2 && boss.attackCooldown <= 0.4 && Math.random() < 0.05) {
                      if (game.spawnSparkleParticles) {
                          for (let ring = 0; ring < 12; ring++) {
                              const rAngle = (ring / 12) * Math.PI * 2;
                              const rx = boss.pos.x + Math.cos(rAngle) * 12;
                              const rz = boss.pos.z + Math.sin(rAngle) * 12;
                              game.spawnSparkleParticles(new THREE.Vector3(rx, 4.0, rz), 15, 0xf59e0b);
                          }
                      }
                  }
              }

              if (boss.mesh) {
                  boss.mesh.position.copy(boss.pos);
              }

              // Check Player Damaging Boss (Jump Stomp / Paws / Lasers)
              if (dBoss < 8.5 && Math.abs(pPos.y - (boss.pos.y + 4.5)) < 3.2 && game.playerVel && game.playerVel.y < 0) {
                  const now = Date.now();
                  if (!boss._lastStomp || now - boss._lastStomp > 800) {
                      boss._lastStomp = now;
                      boss.hp = Math.max(0, boss.hp - 10);
                      updateDesertCrocodileHealthBar(boss.hp, boss.maxHp);
                      game.playerVel.y = 18.0; // High bounce
                      triggerScreenShake();
                      if (window.St && window.St.playEnemyHit) window.St.playEnemyHit();
                      if (game.spawnSparkleParticles) {
                          game.spawnSparkleParticles(boss.pos.clone().add(new THREE.Vector3(0, 4, 0)), 40, 0xfacc15);
                      }
                      if (game.callbacks && game.callbacks.onShowNotice) {
                          game.callbacks.onShowNotice(`💥 Dev Timsahın Üzerine Zıpladın! Kalan Can: ${boss.hp}/${boss.maxHp}`, "success");
                      }
                  }
              }
          }

          // Boss Defeat Sequence
          if (boss.hp <= 0 && !boss.isDead) {
              boss.isDead = true;
              updateDesertCrocodileHealthBar(0, boss.maxHp);
              
              if (!boss.deadMessageShown) {
                  boss.deadMessageShown = true;
                  if (boss.mesh) {
                      boss.mesh.rotation.z = Math.PI; // Flip over
                      boss.pos.y = 2.0;
                      boss.mesh.position.copy(boss.pos);
                  }

                  if (game.callbacks && game.callbacks.onShowNotice) {
                      game.callbacks.onShowNotice("🐊 Dev Çöl Timsahı Alt Edildi! 15. Bölüm Kutsal Kristali ve Firavun Çöl Zırhı Açıldı!", "success");
                  }

                  triggerScreenShake();

                  // Golden and Amber fireworks
                  if (game.spawnSparkleParticles) {
                      for (let k = 0; k < 12; k++) {
                          setTimeout(() => {
                              game.spawnSparkleParticles(boss.pos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 12, Math.random() * 10, (Math.random() - 0.5) * 12)), 50, 0xf59e0b);
                              game.spawnSparkleParticles(boss.pos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 12, Math.random() * 10, (Math.random() - 0.5) * 12)), 50, 0xfacc15);
                          }, k * 160);
                      }
                  }

                  if (game.gainCoins) game.gainCoins(800);

                  // Spawn Victory Portal back to Hub
                  const portalPos = new THREE.Vector3(0, 4.0, -850);
                  const portalMesh = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.7, 12, 24), new THREE.MeshStandardMaterial({
                      color: 0xf59e0b,
                      emissive: 0xd97706,
                      emissiveIntensity: 1.6
                  }));
                  portalMesh.position.copy(portalPos);
                  portalMesh.name = "victory_portal_bee_desert";
                  game.currentLevel.sceneGroup.add(portalMesh);

                  const pLight = new THREE.PointLight(0xf59e0b, 3.5, 25);
                  pLight.position.copy(portalPos);
                  game.currentLevel.sceneGroup.add(pLight);
              }
          }

          // Stepping into Victory Portal back to Bear Village (Ayı Köyü)
          if (boss.deadMessageShown && pPos) {
              const dPortal = pPos.distanceTo(new THREE.Vector3(0, 4.0, -850));
              if (dPortal < 4.5 && !boss._portalUsed) {
                  boss._portalUsed = true;
                  hideAllBossHealthBars();
                  if (game.callbacks && game.callbacks.onShowNotice) {
                      game.callbacks.onShowNotice("🌀 Zafer Portalı: Ayı Köyü'ne dönülüyor...", "success");
                  }
                  if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos, 45, 0xf59e0b);
                  setTimeout(() => {
                      hideAllBossHealthBars();
                      if (game.loadRegion) game.loadRegion('hub');
                      else if (game.callbacks && game.callbacks.onSelectRegion) game.callbacks.onSelectRegion('hub');
                  }, 600);
              }
          }
      }
  }

  // --- 10. BÖLÜM: DİNOZOR DÜNYASI (DINOSAUR WORLD) POPULATION TRIGGER ---
  if (game.currentRegion === 'dinosaur_world' && !dinoWorldPopulated) {
      dinoWorldPopulated = true;
      populateDinosaurWorld(game);
  } else if (game.currentRegion !== 'dinosaur_world') {
      dinoWorldPopulated = false;
  }
  if (game.currentRegion === 'ruin_village' && !ruinVillagePopulated) {
      ruinVillagePopulated = true;
      populateRuinVillage(game);
  } else if (game.currentRegion !== 'ruin_village') {
      ruinVillagePopulated = false;
  }

  // --- 13. BÖLÜM: YIKILMIŞ KÖY (RUIN VILLAGE) LOOP & WARNING SIGNS & CLOWN BOSS ---
  if (game.currentRegion === 'ruin_village' && game.currentLevel) {
      const pPos = game.playerPos;
      const dt = 0.016;

      // Reset / Death handling if fallen in acid pit
      if (pPos && game.currentLevel.spawnPoint) {
          const deathY = -4.0;
          if (pPos.y < deathY) {
              game.playerPos.copy(game.currentLevel.spawnPoint);
              if (game.playerVel) game.playerVel.set(0,0,0);
              if (game.callbacks && game.callbacks.onShowNotice) {
                  game.callbacks.onShowNotice("☣️ Asit çukuruna düştün! Son kayıt noktasından başlıyorsun.", "warn");
              }
          }
      }

      // Checkpoints activation
      if (pPos && game.currentLevel.checkpoints) {
          (game.currentLevel.checkpoints || []).forEach(cp => {
              updateAndActivateCheckpoint(game, cp);
          });
      }

      // Slow Moving Platforms & Elevators Update for Ruin Village
      if (game.currentLevel.movingPlatforms && game.currentLevel.movingPlatforms.length > 0) {
          if (!game.currentLevel.colliders) game.currentLevel.colliders = [];
          game.currentLevel.colliders = game.currentLevel.colliders.filter(c => !c.isMoving);
          (game.currentLevel.movingPlatforms || []).forEach(plat => {
              if (!plat) return;
              if (!plat.basePos) plat.basePos = plat.currentPos ? plat.currentPos.clone() : (plat.startPos ? plat.startPos.clone() : new THREE.Vector3());
              if (!plat.currentPos) plat.currentPos = plat.basePos.clone();
              if (!plat.moveVec) plat.moveVec = new THREE.Vector3();
              plat.timer = (plat.timer || 0) + dt * (plat.speed || 0.7);
              const offset = Math.sin(plat.timer);
              plat.currentPos.x = plat.basePos.x + plat.moveVec.x * offset;
              plat.currentPos.y = plat.basePos.y + plat.moveVec.y * offset;
              plat.currentPos.z = plat.basePos.z + plat.moveVec.z * offset;
              if (plat.mesh) {
                  plat.mesh.position.copy(plat.currentPos);
              }
              // Push moving collider
              game.currentLevel.colliders.push({
                  isMoving: true,
                  min: new THREE.Vector3(plat.currentPos.x - plat.w / 2, plat.currentPos.y - plat.h / 2, plat.currentPos.z - plat.d / 2),
                  max: new THREE.Vector3(plat.currentPos.x + plat.w / 2, plat.currentPos.y + plat.h / 2, plat.currentPos.z + plat.d / 2)
              });
              // Player standing on moving platform smooth carrying
              if (pPos && Math.abs(pPos.x - plat.currentPos.x) < (plat.w / 2 + 0.6) &&
                  Math.abs(pPos.z - plat.currentPos.z) < (plat.d / 2 + 0.6) &&
                  pPos.y >= plat.currentPos.y + plat.h / 2 - 0.2 &&
                  pPos.y <= plat.currentPos.y + plat.h / 2 + 1.2) {
                  const cosDelta = Math.cos(plat.timer) * dt * (plat.speed || 0.7);
                  pPos.x += plat.moveVec.x * cosDelta;
                  pPos.y += plat.moveVec.y * cosDelta;
                  pPos.z += plat.moveVec.z * cosDelta;
              }
          });
      }

      // Geysers / Jump Pads (Boosted with Stepping & Forward Motion)
      if (pPos && game.currentLevel.jumpPads) {
          (game.currentLevel.jumpPads || []).forEach(pad => {
              const dPad = Math.sqrt((pPos.x - pad.pos.x) ** 2 + (pPos.z - pad.pos.z) ** 2);
              if (dPad < 4.8 && Math.abs(pPos.y - pad.pos.y) < 3.5) {
                  if (game.playerVel) {
                      game.playerVel.y = Math.max(pad.boostForce || 32, 32);
                      if (game.currentRegion === 'ruin_village') {
                          game.playerVel.z = -22; // Push forward smoothly toward next basamak
                      }
                      if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos, 24, 0xfacc15);
                      if (game.callbacks && game.callbacks.onShowNotice && (!pad._lastNotice || Date.now() - pad._lastNotice > 2500)) {
                          pad._lastNotice = Date.now();
                          game.callbacks.onShowNotice("🚀 Yıkıntı Gayzeri & Basamak Yükseltici Seni YUKARI VE İLERİ Fırlattı!", "success");
                      }
                  }
              }
          });
      }

      // Warning Signs Proximity
      if (pPos && game.currentLevel.warningSigns) {
        (game.currentLevel.warningSigns || []).forEach(sign => {
          if (pPos.distanceTo(sign.pos) < 6.0) {
            if (game.callbacks && game.callbacks.onShowNotice && Date.now() % 3500 < 50) {
              game.callbacks.onShowNotice(`📜 ${sign.title}: '${sign.detail}'`, "warn");
            }
          }
        });
      }

      // Rotating Ice Step Update in Snow Desert Boss Arena
      if (game.currentRegion === 'snow_desert' && game.scene) {
        const rotIce = game.scene.getObjectByName("rotating_snow_boss_ice_step");
        if (rotIce) {
          rotIce.rotation.y += 0.5 * dt;
          const ang = rotIce.rotation.y;
          const cx = 0, cy = 38.2, cz = -195;
          if (!game.currentLevel.colliders) game.currentLevel.colliders = [];
          game.currentLevel.colliders = game.currentLevel.colliders.filter(c => !c.isRotIce);
          const offsets = [-14, -10, -6, -2, 2, 6, 10, 14];
          offsets.forEach(off => {
            const px = cx + Math.cos(ang) * off;
            const pz = cz + Math.sin(ang) * off;
            game.currentLevel.colliders.push({
              isRotIce: true,
              isMoving: true,
              min: new THREE.Vector3(px - 2.5, cy - 0.7, pz - 2.5),
              max: new THREE.Vector3(px + 2.5, cy + 0.7, pz + 2.5)
            });
          });
          if (pPos && Math.abs(pPos.y - (cy + 0.6)) < 1.2) {
            const dx = pPos.x - cx;
            const dz = pPos.z - cz;
            const r = Math.sqrt(dx * dx + dz * dz);
            if (r <= 16.5) {
              const curAng = Math.atan2(dz, dx);
              const newAng = curAng + 0.5 * dt;
              pPos.x = cx + Math.cos(newAng) * r;
              pPos.z = cz + Math.sin(newAng) * r;
            }
          }
        }
      }

      // Clown Boss Loop - Active Walking & Chasing AI & Animated Combat
      if (game.currentLevel.clownBoss) {
        const boss = game.currentLevel.clownBoss;
        if (boss.hp > 0 && pPos) {
          boss.animTimer = (boss.animTimer || 0) + dt * 4.5;
          const dist = boss.pos.distanceTo(pPos);

          // 1. Walking and Moving towards Player
          if (dist < 60) {
            // Rotate facing player
            boss.mesh.rotation.y = Math.atan2(pPos.x - boss.pos.x, pPos.z - boss.pos.z);

            // Active Walk / Chase Movement (stays inside circus ring around arena center: 0, -370)
            if (dist > 5.5) {
              const dir = pPos.clone().sub(boss.pos).normalize();
              const chaseSpeed = 4.2;
              boss.pos.x += dir.x * chaseSpeed * dt;
              boss.pos.z += dir.z * chaseSpeed * dt;

              // Constrain within circus arena bounds (radius: 35)
              const dArena = Math.sqrt(boss.pos.x * boss.pos.x + (boss.pos.z - (-370)) ** 2);
              if (dArena > 35) {
                const aAng = Math.atan2(boss.pos.z - (-370), boss.pos.x);
                boss.pos.x = Math.cos(aAng) * 35;
                boss.pos.z = -370 + Math.sin(aAng) * 35;
              }
            }

            // Sync mesh position with slight stepping bounce
            boss.mesh.position.x = boss.pos.x;
            boss.mesh.position.z = boss.pos.z;
            boss.mesh.position.y = boss.pos.y + Math.abs(Math.sin(boss.animTimer * 2.0)) * 0.35;

            // Leg Walking Strides Animation (natural alternating stride)
            const legL = boss.mesh.getObjectByName('clown_leg_left');
            const legR = boss.mesh.getObjectByName('clown_leg_right');
            if (legL) {
              legL.rotation.x = Math.sin(boss.animTimer * 2.0) * 0.6;
              legL.position.y = 1.7 + Math.max(0, Math.sin(boss.animTimer * 2.0)) * 0.4;
            }
            if (legR) {
              legR.rotation.x = -Math.sin(boss.animTimer * 2.0) * 0.6;
              legR.position.y = 1.7 + Math.max(0, -Math.sin(boss.animTimer * 2.0)) * 0.4;
            }

            // Arm Walking Swing & Punch Animation
            const armL = boss.mesh.getObjectByName('clown_arm_left');
            const armR = boss.mesh.getObjectByName('clown_arm_right');
            if (armL) armL.rotation.x = -Math.sin(boss.animTimer * 2.0) * 0.55;
            if (armR) armR.rotation.x = Math.sin(boss.animTimer * 2.0) * 0.55;

            // 2. Ranged Fireball / Circus Magic Attack (shot from the hands/head, NOT between legs!)
            if (boss.attackCooldown <= 0) {
              boss.attackCooldown = 2.2;
              const handPos = boss.pos.clone().add(new THREE.Vector3(
                Math.sin(boss.mesh.rotation.y + 0.5) * 5.0,
                14.0,
                Math.cos(boss.mesh.rotation.y + 0.5) * 5.0
              ));
              createFireball(game, handPos, pPos);
              if (game.callbacks && game.callbacks.onShowNotice && Math.random() < 0.35) {
                game.callbacks.onShowNotice("🤡 JOKEROOMS PALYAÇO: Hahaha! Ayaklarımla üstüne geliyorum! Kaçamazsın!", "warn");
              }
            } else {
              boss.attackCooldown -= dt;
            }

            // 3. Melee Stomp / Slap Attack when close
            if (!boss.meleeCooldown) boss.meleeCooldown = 0;
            if (dist < 6.5 && boss.meleeCooldown <= 0) {
              boss.meleeCooldown = 1.8;
              if (game.damagePlayer) game.damagePlayer(boss.attackPower);
              if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos, 20, 0xdc2626);
              if (game.callbacks && game.callbacks.onShowNotice) {
                game.callbacks.onShowNotice("🤡 Palyaço'nun Dev Tokadı İsabet Etti! (-20 Can)", "warn");
              }
            } else if (boss.meleeCooldown > 0) {
              boss.meleeCooldown -= dt;
            }
          }

          // Hit detection on clown boss (jump on head from above)
          if (dist < 8.0 && pPos.y > boss.pos.y + 3.5 && pPos.y < boss.pos.y + 14.0) {
            if (game.playerVel && game.playerVel.y < 0) {
              game.playerVel.y = 24; // Bounce high
              boss.hp -= 100;
              if (game.spawnSparkleParticles) game.spawnSparkleParticles(boss.pos, 30, 0xef4444);
              if (boss.hp <= 0) {
                boss.mesh.visible = false;
                if (!boss.deadMessageShown) {
                  boss.deadMessageShown = true;
                  if (game.callbacks && game.callbacks.onShowNotice) {
                    game.callbacks.onShowNotice("🏆 JOKEROOMS PALYAÇO BOSS MAĞLUP EDİLDİ! 🏚️ 13. Kutsal Yıkıntı & Cesaret Bal Kristali Kurtarıldı!", "success");
                  }
                  if (game.gainCoins) game.gainCoins(500);
                  if (game.gainXp) game.gainXp(800);
                  if (game.spawnBossPortalForCurrentRegion) {
                    game.spawnBossPortalForCurrentRegion(boss.pos);
                  }
                }
              } else {
                if (game.callbacks && game.callbacks.onShowNotice) {
                  game.callbacks.onShowNotice(`💥 Dev Palyaço'ya Vurdun! Kalan Can: ${boss.hp}/${boss.maxHp}`, "success");
                }
              }
            }
          }
        } else if (boss.hp <= 0 && !boss.deadMessageShown) {
          boss.deadMessageShown = true;
          if (game.callbacks && game.callbacks.onShowNotice) {
            game.callbacks.onShowNotice("🏆 JOKEROOMS PALYAÇO BOSS MAĞLUP EDİLDİ! 🏚️ 13. Kutsal Yıkıntı & Cesaret Bal Kristali Kurtarıldı!", "success");
          }
          if (game.gainCoins) game.gainCoins(500);
          if (game.gainXp) game.gainXp(800);
          if (game.spawnBossPortalForCurrentRegion) {
            game.spawnBossPortalForCurrentRegion(boss.pos);
          }
        }
      }
  }

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
                      game.callbacks.onShowNotice(`🟡 Jokerooms Derinliği: ${curMeter} metre katettin! ${curMeter >= 2000 ? "🔴 Kırmızı Kapı koridorda belirdi!" : "Çıkış 2000m ötede!"}`, "info");
                  }
              }

              // 2000 Meters Milestone Check for Kırmızı Çıkış Kapısı
              if (jokeroomsSteps >= 2000 && (!game.currentLevel._redDoorUnlocked || !game.currentLevel.redExitDoor)) {
                  game.currentLevel._redDoorUnlocked = true;
                  if (game.callbacks && game.callbacks.onShowNotice) {
                      game.callbacks.onShowNotice("🚨 EFSANEVİ KEŞİF! 2000 Metreyi Geçtin! 🎉 KIRMIZI ÇIKIŞ KAPISI KORİDORLARDA BELİRDİ! Bölümden kurtulabilirsin! 🔴🚪", "success");
                  }
                  if (window.St && window.St.playGoalFanfare) window.St.playGoalFanfare();

                  const rotY = game.playerRotY || 0;
                  const spawnX = Math.round((pPos.x - Math.sin(rotY) * 22) / 6) * 6;
                  const spawnZ = Math.round((pPos.z - Math.cos(rotY) * 22) / 6) * 6;
                  createRedExitDoor(game, null, spawnX, 0, spawnZ);
              }
          }
      }
      
      // 3. Flickering Fluorescent Lights Animation
      jokeroomsFlickerTimer += dt;
      if (game.currentLevel.flickerLights) {
          (game.currentLevel.flickerLights || []).forEach(fl => {
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
          (game.currentLevel.rubberDucks || []).forEach(duck => {
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
          (game.currentLevel.bananaPeels || []).forEach(peel => {
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
          (game.currentLevel.trickDoors || []).forEach(door => {
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

      // 8. Red Exit Doors & Proximity Prompt Updates (Teleport back to Ayı Köyü)
      let currentProximity = null;

      if (game.currentLevel) {
          const doors = game.currentLevel.redDoors || (game.currentLevel.redExitDoor ? [game.currentLevel.redExitDoor] : []);
          for (const redDoor of doors) {
              const dist = pPos.distanceTo(redDoor.pos);
              if (dist < 8.0) {
                  currentProximity = { type: "red_door", name: "🔴 Kırmızı Çıkış Kapısı (Ayı Köyü) [E]" };
                  if (!game.currentLevel._redDoorNoticeShown || Date.now() - game.currentLevel._redDoorNoticeShown > 7000) {
                      game.currentLevel._redDoorNoticeShown = Date.now();
                      if (game.callbacks && game.callbacks.onShowNotice) {
                          game.callbacks.onShowNotice("🔴 KIRMIZI ÇIKIŞ KAPISI! 2000 metreyi geçtin! Ayı Köyü'ne dönmek için [E] tuşuna bas veya kapıdan içeri adım at! 🐻✨", "success");
                      }
                  }
                  if (dist < 2.4) {
                      triggerRedDoorEscape(game, redDoor);
                      break;
                  }
              }
          }
      }

      if (!currentProximity && game.currentLevel && game.currentLevel.jokeSigns) {
          const nearSign = (game.currentLevel.jokeSigns || []).find(sign => pPos.distanceTo(sign.pos) < 4.5);
          if (nearSign) {
              currentProximity = { type: "sign", name: `${nearSign.title} [E]` };
          }
      }

      if (!currentProximity && game.currentLevel && game.currentLevel.clownNpc) {
          if (pPos.distanceTo(game.currentLevel.clownNpc.pos) < 6.0) {
              currentProximity = { type: "npc", name: "Şakacı Palyaço [E]" };
          }
      }

      if (game.callbacks && game.callbacks.onProximityChange) {
          game.callbacks.onProximityChange(currentProximity);
      }
  }

  if (game.currentRegion === 'sugar_world' && !sugarWorldPopulated) {
      sugarWorldPopulated = true;
      populateSugarWorld(game);
  } else if (game.currentRegion !== 'sugar_world') {
      sugarWorldPopulated = false;
      if (typeof updateLollipopBossHealthBar === 'function') updateLollipopBossHealthBar(0, 35);
  }

  if (game.currentRegion === 'sugar_world' && game.currentLevel) {
      const dt = 0.016;
      const pPos = game.playerPos;
      const THREE = window.THREE;

      if (playerSlowTimer > 0) {
          playerSlowTimer -= dt;
          if (game.playerVel) {
              game.playerVel.x *= 0.82;
              game.playerVel.z *= 0.82;
          }
      }

      // Checkpoint Trigger System for Sugar World
      if (pPos && game.currentLevel.checkpoints) {
          (game.currentLevel.checkpoints || []).forEach(cp => {
              updateAndActivateCheckpoint(game, cp);
          });
      }

      if (pPos && game.currentLevel.spawnPoint) {
          // Prevent mid-air resets on long jumps by setting a safe minimum death height
          const deathY = Math.min(game.currentLevel.spawnPoint.y - 12, 2.5);
          if (pPos.y < deathY) {
              game.playerPos.copy(game.currentLevel.spawnPoint);
              if (game.playerVel) game.playerVel.set(0,0,0);
              if (game.callbacks && game.callbacks.onShowNotice) {
                  game.callbacks.onShowNotice("🍬 Şeker nehrine düştün! Son kontrol noktasından başlıyorsun.", "warn");
              }
              if (game.currentLevel.lollipopBoss) {
                  updateLollipopBossHealthBar(0, 35); // Hide HP bar on respawn
              }
          }
      }

      // 1. Moving Platforms Updates & Collision Carrying for Sugar World
      if (game.currentLevel.movingPlatforms && game.currentLevel.movingPlatforms.length > 0) {
          if (!game.currentLevel.colliders) game.currentLevel.colliders = [];
          game.currentLevel.colliders = game.currentLevel.colliders.filter(c => !c.isSugarMoving);
          (game.currentLevel.movingPlatforms || []).forEach(plat => {
              if (!plat) return;
              if (!plat.basePos) plat.basePos = plat.currentPos ? plat.currentPos.clone() : (plat.startPos ? plat.startPos.clone() : new THREE.Vector3());
              if (!plat.currentPos) plat.currentPos = plat.basePos.clone();
              if (!plat.moveVec) plat.moveVec = new THREE.Vector3();
              plat.timer = (plat.timer || 0) + dt * (plat.speed || 0.7);
              const offset = Math.sin(plat.timer);
              plat.currentPos.x = plat.basePos.x + plat.moveVec.x * offset;
              plat.currentPos.y = plat.basePos.y + plat.moveVec.y * offset;
              plat.currentPos.z = plat.basePos.z + plat.moveVec.z * offset;
              if (plat.mesh) {
                  plat.mesh.position.copy(plat.currentPos);
              }
              // Push moving collider
              game.currentLevel.colliders.push({
                  isSugarMoving: true,
                  min: new THREE.Vector3(plat.currentPos.x - plat.w / 2, plat.currentPos.y - plat.h / 2, plat.currentPos.z - plat.d / 2),
                  max: new THREE.Vector3(plat.currentPos.x + plat.w / 2, plat.currentPos.y + plat.h / 2, plat.currentPos.z + plat.d / 2)
              });
              // Player standing on moving platform smooth carrying
              if (pPos && Math.abs(pPos.x - plat.currentPos.x) < (plat.w / 2 + 0.6) &&
                  Math.abs(pPos.z - plat.currentPos.z) < (plat.d / 2 + 0.6) &&
                  pPos.y >= plat.currentPos.y + plat.h / 2 - 0.2 &&
                  pPos.y <= plat.currentPos.y + plat.h / 2 + 1.2) {
                  const cosDelta = Math.cos(plat.timer) * dt * (plat.speed || 0.7);
                  pPos.x += plat.moveVec.x * cosDelta;
                  pPos.y += plat.moveVec.y * cosDelta;
                  pPos.z += plat.moveVec.z * cosDelta;
              }
          });
      }

      // 2. Geysers (Jump Pads) for Sugar World
      if (pPos && game.currentLevel.jumpPads) {
          (game.currentLevel.jumpPads || []).forEach(pad => {
              const dPad = Math.sqrt((pPos.x - pad.pos.x) ** 2 + (pPos.z - pad.pos.z) ** 2);
              if (dPad < 2.5 && Math.abs(pPos.y - pad.pos.y) < 2.0) {
                  if (game.playerVel) {
                      game.playerVel.y = pad.boostForce || 22;
                      // Dynamic forward launch physics for the final leap of faith to the Boss Arena!
                      if (pad.pos.z < -420) {
                          game.playerVel.z = -26; // Accelerate the player forward perfectly onto the arena at z = -510!
                          game.playerVel.y = 26; // High altitude launch
                          if (game.callbacks && game.callbacks.onShowNotice) {
                              game.callbacks.onShowNotice("🚀 DEV JUMP! Lolipop Patron Arenası'na Fırlatıldın!", "success");
                          }
                      } else if (pad.pos.z < -320) {
                          // Standard jump pad handling
                          game.playerVel.z = -18;
                      }
                      if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos, 14, 0x0ea5e9);
                  }
              }
          });
      }

      // 3. Spike Hazards for Sugar World
      if (pPos && game.currentLevel.spikes) {
          (game.currentLevel.spikes || []).forEach(spike => {
              const dist = Math.sqrt((pPos.x - spike.pos.x)**2 + (pPos.z - spike.pos.z)**2);
              if (dist < spike.radius + 1.0 && Math.abs(pPos.y - spike.pos.y) < 3.0) {
                  if (game.playerHp > 0) {
                      if (!game.lastDamageTime || (Date.now() - game.lastDamageTime > 1000)) {
                          game.playerHp -= 5;
                          game.lastDamageTime = Date.now();
                          if (game.callbacks && game.callbacks.onHpChange) game.callbacks.onHpChange(game.playerHp, 100);
                          if (game.playerVel) {
                              game.playerVel.y = 25; // Big bounce
                          }
                      }
                  }
              }
          });
      }

      const boss = game.currentLevel.lollipopBoss;
      if (boss && boss.hp > 0 && pPos) {
          // Face the player directly so the angry face is always visible
          boss.mesh.lookAt(new THREE.Vector3(pPos.x, boss.mesh.position.y, pPos.z));
          
          // Dynamic limb animation! (Swinging arms and legs)
          const time = Date.now() * 0.0035;
          if (boss.leftArm) {
              boss.leftArm.rotation.z = Math.sin(time) * 0.4 + 0.3;
              boss.leftArm.rotation.x = Math.cos(time) * 0.3;
          }
          if (boss.rightArm) {
              boss.rightArm.rotation.z = -Math.sin(time) * 0.4 - 0.3;
              boss.rightArm.rotation.x = -Math.cos(time) * 0.3;
          }
          if (boss.leftLeg) {
              boss.leftLeg.rotation.x = Math.sin(time * 1.5) * 0.4;
          }
          if (boss.rightLeg) {
              boss.rightLeg.rotation.x = -Math.sin(time * 1.5) * 0.4;
          }

          const distToBoss = boss.pos.distanceTo(pPos);

          if (distToBoss < 35) {
              // Show and update Lollipop Boss HP Bar
              updateLollipopBossHealthBar(boss.hp, boss.maxHp || 35);

              boss.attackCooldown -= dt;
              if (boss.attackCooldown <= 0) {
                  boss.attackCooldown = 2.5;
                  
                  const projGeo = new THREE.SphereGeometry(1.2, 8, 8);
                  const projMat = new THREE.MeshStandardMaterial({ color: 0xec4899, emissive: 0xdb2777, transparent: true, opacity: 0.9 });
                  const proj = new THREE.Mesh(projGeo, projMat);
                  proj.position.copy(boss.pos);
                  proj.position.y += 4;
                  game.currentLevel.mesh.add(proj);

                  const target = pPos.clone();
                  target.y += 1.0;
                  const dir = new THREE.Vector3().subVectors(target, proj.position).normalize();
                  
                  if (!game.currentLevel.sugarProjectiles) game.currentLevel.sugarProjectiles = [];
                  game.currentLevel.sugarProjectiles.push({
                      mesh: proj,
                      vel: dir.multiplyScalar(28),
                      life: 3.0
                  });

                  if (game.callbacks && game.callbacks.onShowNotice) {
                      game.callbacks.onShowNotice("🍬 Lolipop Boss: 'Şeker Patlağı!'", "warn");
                  }
              }
          } else {
              // Hide HP bar if far away
              if (lollipopBossHpContainer) lollipopBossHpContainer.style.display = 'none';
          }

          // Moderate hit detection for the Lollipop Boss (1.5x scaled)
          if (distToBoss < 5.0 && pPos.y > boss.pos.y + 1 && pPos.y < boss.pos.y + 12) {
              if (game.playerVel && game.playerVel.y < 0) {
                  game.playerVel.y = 22;
                  boss.hp -= 1;
                  if (game.spawnSparkleParticles) game.spawnSparkleParticles(boss.pos, 25, 0xec4899);

                  // Update HP bar instantly upon receiving damage
                  updateLollipopBossHealthBar(boss.hp, boss.maxHp || 35);

                   if (boss.hp <= 0) {
                      boss.mesh.visible = false;
                      updateLollipopBossHealthBar(0, boss.maxHp || 35);
                      if (game.callbacks && game.callbacks.onShowNotice) {
                          game.callbacks.onShowNotice("🍭 Lolipop Boss: 'Daha çok bölüm var... Beni yendin ama onları yenebilecek misin? Hhahahahahahahahaaha!'", "warn");
                          setTimeout(() => {
                              if (game.callbacks && game.callbacks.onShowNotice) {
                                  game.callbacks.onShowNotice("✨ TEBRİKLER! Lolipop Boss Mağlup Edildi! Zafer Portalı Açıldı! ✨", "success");
                              }
                          }, 2600);
                      }

                      // Spawn victory portal back to Bear Village / Hub
                      if (!boss._victoryPortalCreated && game.currentLevel && game.currentLevel.mesh) {
                          boss._victoryPortalCreated = true;
                          const portalPos = new THREE.Vector3(0, 32.0, -520);
                          const portalMesh = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.7, 12, 24), new THREE.MeshStandardMaterial({
                              color: 0xec4899,
                              emissive: 0xdb2777,
                              emissiveIntensity: 1.8
                          }));
                          portalMesh.position.copy(portalPos);
                          portalMesh.name = "sugar_victory_portal";
                          game.currentLevel.mesh.add(portalMesh);

                          const pLight = new THREE.PointLight(0xec4899, 3.5, 25);
                          pLight.position.copy(portalPos);
                          game.currentLevel.mesh.add(pLight);
                      }
                  } else {
                      if (game.callbacks && game.callbacks.onShowNotice) {
                          game.callbacks.onShowNotice(`💥 Lolipop Boss Vuruldu! Kalan Can: ${boss.hp}`, "success");
                      }
                  }
              }
          }

          // Stepping into Sugar World Victory Portal back to Bear Village
          if (boss.hp <= 0 && pPos) {
              const dPortal = pPos.distanceTo(new THREE.Vector3(0, 32.0, -520));
              if (dPortal < 4.5 && !boss._portalUsed) {
                  boss._portalUsed = true;
                  hideAllBossHealthBars();
                  if (game.callbacks && game.callbacks.onShowNotice) {
                      game.callbacks.onShowNotice("🌀 Zafer Portalı: Ayı Köyü'ne dönülüyor...", "success");
                  }
                  if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos, 45, 0xec4899);
                  setTimeout(() => {
                      hideAllBossHealthBars();
                      if (game.loadRegion) game.loadRegion('hub');
                      else if (game.callbacks && game.callbacks.onSelectRegion) game.callbacks.onSelectRegion('hub');
                  }, 600);
              }
          }
      } else {
          // Hide HP bar if boss doesn't exist or is dead
          if (typeof updateLollipopBossHealthBar === 'function') {
              updateLollipopBossHealthBar(0, 35);
          }
          if (lollipopBossHpContainer && lollipopBossHpContainer.style.display !== 'none') {
              lollipopBossHpContainer.style.display = 'none';
          }
      }

      if (game.currentLevel.sugarProjectiles) {
          for (let i = game.currentLevel.sugarProjectiles.length - 1; i >= 0; i--) {
              let sp = game.currentLevel.sugarProjectiles[i];
              sp.life -= dt;
              if (sp.mesh) {
                  sp.mesh.position.addScaledVector(sp.vel, dt);
                  sp.mesh.rotation.x += 4 * dt;
              }

              if (pPos && sp.mesh) {
                  const dist = sp.mesh.position.distanceTo(pPos);
                  if (dist < 2.2) {
                      if (game.damagePlayer) game.damagePlayer(10);
                      playerSlowTimer = 3.0; // 3 saniye yavaşlasın
                      if (game.callbacks && game.callbacks.onShowNotice) {
                          game.callbacks.onShowNotice("🍬 Şeker Patlağına Yakalandın! Karakterin 3 saniye yavaşladı!", "warn");
                      }
                      if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos, 15, 0xf43f5e);
                      sp.life = 0;
                  }
              }

              if (sp.life <= 0) {
                  if (sp.mesh && sp.mesh.parent) sp.mesh.parent.remove(sp.mesh);
                  game.currentLevel.sugarProjectiles.splice(i, 1);
              }
          }
      }
  }

  if (game.currentRegion === 'volcano_cave' && !volcanoCavePopulated) {
      volcanoCavePopulated = true;
      populateVolcanoCave(game);
  } else if (game.currentRegion !== 'volcano_cave') {
      volcanoCavePopulated = false;
  }

  
  if (game.currentRegion === 'underwater_palace' && !underwaterPalacePopulated) {
      underwaterPalacePopulated = true;
      populateUnderwaterPalace(game);
  } else if (game.currentRegion !== 'underwater_palace') {
      underwaterPalacePopulated = false;
  }

  // Handle Underwater Palace Reset and Interactions
  // Handle Underwater Palace Physics and Hazards
  if (game.currentRegion === 'underwater_palace' && game.currentLevel) {
      const dt = 0.016;
      const pPos = game.playerPos;
      const THREE = window.THREE;

      // 1. Moving Platforms
      if (game.currentLevel.movingPlatforms) {
          (game.currentLevel.movingPlatforms || []).forEach(plat => {
              if (!plat) return;
              if (!plat.basePos) plat.basePos = plat.currentPos ? plat.currentPos.clone() : (plat.startPos ? plat.startPos.clone() : new THREE.Vector3());
              if (!plat.currentPos) plat.currentPos = plat.basePos.clone();
              if (!plat.moveVec) plat.moveVec = new THREE.Vector3();
              plat.timer = (plat.timer || 0) + dt * (plat.speed || 1);
              const offset = Math.sin(plat.timer);
              plat.currentPos.x = plat.basePos.x + plat.moveVec.x * offset;
              plat.currentPos.y = plat.basePos.y + plat.moveVec.y * offset;
              plat.currentPos.z = plat.basePos.z + plat.moveVec.z * offset;
              if (plat.mesh) {
                  plat.mesh.position.copy(plat.currentPos);
              }
              // Update collider (assuming it is found in colliders array)
              // Wait, the collider for moving platforms is static. We must dynamically update colliders.
              // Actually it's easier to just push/update them here.
          });
          // Update moving platform colliders
          if (!game.currentLevel._movingCollidersInitialized) {
               game.currentLevel._movingCollidersInitialized = true;
               // We don't add them to colliders array initially, we handle them dynamically
          }
          // Remove old moving colliders
          game.currentLevel.colliders = game.currentLevel.colliders.filter(c => !c.isMoving);
          // Add new ones
          (game.currentLevel.movingPlatforms || []).forEach(plat => {
              game.currentLevel.colliders.push({
                  isMoving: true,
                  min: new THREE.Vector3(plat.currentPos.x - plat.w/2, plat.currentPos.y - plat.h/2, plat.currentPos.z - plat.d/2),
                  max: new THREE.Vector3(plat.currentPos.x + plat.w/2, plat.currentPos.y + plat.h/2, plat.currentPos.z + plat.d/2)
              });
              
              // If player is standing on it (roughly), move player too!
              if (pPos) {
                  const dx = Math.abs(pPos.x - plat.currentPos.x);
                  const dz = Math.abs(pPos.z - plat.currentPos.z);
                  const dy = pPos.y - (plat.currentPos.y + plat.h/2);
                  if (dx < plat.w/2 && dz < plat.d/2 && dy >= 0 && dy < 1.0) {
                      const deltaX = (plat.moveVec.x * Math.cos(plat.timer) * dt * plat.speed);
                      const deltaY = (plat.moveVec.y * Math.cos(plat.timer) * dt * plat.speed);
                      const deltaZ = (plat.moveVec.z * Math.cos(plat.timer) * dt * plat.speed);
                      pPos.x += deltaX;
                      pPos.y += deltaY;
                      pPos.z += deltaZ;
                  }
              }
          });
      }

      // 2. Spinning Water Blades
      if (game.currentLevel.waterBlades) {
          (game.currentLevel.waterBlades || []).forEach(blade => {
              if (blade.mesh) {
                  blade.mesh.rotation.y += blade.speed * dt;
              }
              // Damage check
              if (pPos) {
                  const dist = Math.sqrt((pPos.x - blade.pos.x)**2 + (pPos.z - blade.pos.z)**2);
                  if (dist < blade.radius && Math.abs(pPos.y - blade.pos.y) < 1.5) {
                      // Hit!
                      if (game.playerHp > 0) {
                           game.playerHp -= 2;
                           if (game.callbacks && game.callbacks.onHpChange) game.callbacks.onHpChange(game.playerHp, 100);
                           // Knockback
                           if (game.playerVel) {
                               game.playerVel.y = 15;
                               game.playerVel.x = (pPos.x - blade.pos.x) * 2;
                               game.playerVel.z = (pPos.z - blade.pos.z) * 2;
                           }
                      }
                  }
              }
          });
      }

      // 2.5 Mushroom Hazards
      if (pPos && game.currentLevel.mushrooms) {
          (game.currentLevel.mushrooms || []).forEach(mush => {
              const dist = Math.sqrt((pPos.x - mush.pos.x)**2 + (pPos.z - mush.pos.z)**2);
              if (dist < mush.radius && Math.abs(pPos.y - mush.pos.y) < 2.0) {
                  // Hit!
                  if (game.playerHp > 0) {
                       // Only damage if we haven't damaged recently (basic throttle)
                       if (!game.lastDamageTime || (Date.now() - game.lastDamageTime > 1000)) {
                           game.playerHp -= 5; // Revert to 5 to make it noticeable
                           game.lastDamageTime = Date.now();
                           if (game.callbacks && game.callbacks.onHpChange) game.callbacks.onHpChange(game.playerHp, 100);
                           if (game.playerVel) {
                               game.playerVel.y = 20; // Big bounce
                           }
                       }
                  }
              }
          });
      }

      // 2.6 Spike Hazards
      if (pPos && game.currentLevel.spikes) {
          (game.currentLevel.spikes || []).forEach(spike => {
              const dist = Math.sqrt((pPos.x - spike.pos.x)**2 + (pPos.z - spike.pos.z)**2);
              // Increased height check
              if (dist < spike.radius + 1.0 && Math.abs(pPos.y - spike.pos.y) < 3.0) {
                  // Hit!
                  if (game.playerHp > 0) {
                       if (!game.lastDamageTime || (Date.now() - game.lastDamageTime > 1000)) {
                           game.playerHp -= 5;
                           game.lastDamageTime = Date.now();
                           if (game.callbacks && game.callbacks.onHpChange) game.callbacks.onHpChange(game.playerHp, 100);
                           if (game.playerVel) {
                               game.playerVel.y = 25; // Big bounce
                           }
                       }
                  }
              }
          });
      }

      // 3. Geysers (Jump Pads)
      if (pPos && game.currentLevel.jumpPads) {
          (game.currentLevel.jumpPads || []).forEach(pad => {
              const dPad = Math.sqrt((pPos.x - pad.pos.x) ** 2 + (pPos.z - pad.pos.z) ** 2);
              if (dPad < 2.5 && Math.abs(pPos.y - pad.pos.y) < 2.0) {
                  if (game.playerVel) {
                      game.playerVel.y = pad.boostForce || 22;
                      if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos, 14, 0x0ea5e9);
                  }
              }
          });
      }

      // 4. Falling Water Meteors on Narrow Bridge
      game.currentLevel.nextMeteorTimer -= dt;
      if (game.currentLevel.nextMeteorTimer <= 0) {
          game.currentLevel.nextMeteorTimer = 0.5 + Math.random() * 1.0;
          const mx = -10 + (Math.random() - 0.5) * 8;
          const mz = -450 - Math.random() * 60; // Spawn over the narrow bridge
          
          const meteorGeo = new THREE.SphereGeometry(1.5, 8, 8);
          const meteorMat = new THREE.MeshStandardMaterial({color: 0x0284c7, emissive: 0x0369a1, transparent: true, opacity: 0.8});
          const meteor = new THREE.Mesh(meteorGeo, meteorMat);
          meteor.position.set(mx, 120, mz);
          game.currentLevel.mesh.add(meteor);
          
          game.currentLevel.waterMeteors.push({
              mesh: meteor,
              life: 5.0
          });
      }

      if (game.currentLevel.waterMeteors) {
          for (let i = game.currentLevel.waterMeteors.length - 1; i >= 0; i--) {
              let m = game.currentLevel.waterMeteors[i];
              m.life -= dt;
              if (m.mesh) m.mesh.position.y -= 40 * dt; // Fall fast
              
              if (pPos && m.mesh) {
                  const dist = pPos.distanceTo(m.mesh.position);
                  if (dist < 3.0) {
                      if (game.playerHp > 0) game.playerHp -= 20;
                      if (game.callbacks && game.callbacks.onHpChange) game.callbacks.onHpChange(game.playerHp, 100);
                      if (game.spawnSparkleParticles) game.spawnSparkleParticles(m.mesh.position, 10, 0x0284c7);
                      m.life = 0; // Destroy
                  }
              }

              if (m.life <= 0) {
                  if (m.mesh && m.mesh.parent) m.mesh.parent.remove(m.mesh);
                  game.currentLevel.waterMeteors.splice(i, 1);
              }
          }
      }

      
      // Update Kraken HP Bar
      if (game.currentLevel && game.currentLevel.kraken && pPos && pPos.z < -460) {
          if (typeof updateKrakenHealthBar === 'function') updateKrakenHealthBar(game.currentLevel.krakenHp, 3);
      } else {
          if (typeof updateKrakenHealthBar === 'function') updateKrakenHealthBar(0, 3);
      }
      
      // 🦑 Kraken Boss Logic

      if (game.currentLevel.kraken && pPos && game.currentLevel.krakenHp > 0) {
          const time = Date.now() * 0.001;
          
          // State Machine
          game.currentLevel.krakenStateTimer -= dt;
          if (game.currentLevel.krakenState === 'air') {
              game.currentLevel.krakenTargetY = 85; // Hover high
              if (game.currentLevel.krakenStateTimer <= 0) {
                  game.currentLevel.krakenState = 'ground';
                  if(typeof playKrakenSound==='function') playKrakenSound('ground');
                  if(typeof triggerScreenShake==='function') triggerScreenShake();
                  game.currentLevel.krakenStateTimer = 10.0;
                  if (game.callbacks && game.callbacks.onShowNotice) game.callbacks.onShowNotice("🦑 Kraken yoruldu, yere iniyor! Kafasına zıpla!", "success");
              }
          } else {
              // ground state (vulnerable)
              game.currentLevel.krakenTargetY = 66; // Close to the floor (64)
              if (game.currentLevel.krakenStateTimer <= 0) {
                  game.currentLevel.krakenState = 'air';
                  game.currentLevel.krakenStateTimer = 20.0;
                  if(typeof playKrakenSound==='function') playKrakenSound('warn');
                  if (game.callbacks && game.callbacks.onShowNotice) game.callbacks.onShowNotice("🦑 Kraken tekrar havalandı!", "warn");
              }
          }

          // Smooth Y movement (lerp)
          game.currentLevel.kraken.position.y += (game.currentLevel.krakenTargetY - game.currentLevel.kraken.position.y) * dt * 2.0;
          
          // Move side to side (hovering)
          game.currentLevel.kraken.position.x = -10 + Math.sin(time * 0.8) * 20;
          
          // Face player
          game.currentLevel.kraken.lookAt(pPos.x, game.currentLevel.kraken.position.y, pPos.z);

          // Shoot ONLY if in air and player is near arena
          if (game.currentLevel.krakenState === 'air' && pPos.z < -460) {
              game.currentLevel.krakenShootTimer -= dt;
              if (game.currentLevel.krakenShootTimer <= 0) {
                  game.currentLevel.krakenShootTimer = 1.5; // Fire rate
                  if(typeof playKrakenSound==='function') playKrakenSound('shoot');
                  
                  const projGeo = new THREE.SphereGeometry(2, 8, 8);
                  const projMat = new THREE.MeshStandardMaterial({color: 0x38bdf8, emissive: 0x0284c7, transparent: true, opacity: 0.9});
                  const proj = new THREE.Mesh(projGeo, projMat);
                  
                  proj.position.copy(game.currentLevel.kraken.position);
                  proj.position.y -= 5; // Shoot from below eyes
                  
                  const target = pPos.clone();
                  target.y += 1.0; 
                  const dir = new THREE.Vector3().subVectors(target, proj.position).normalize();
                  const speed = 40;
                  const vel = dir.multiplyScalar(speed);
                  
                  game.currentLevel.mesh.add(proj);
                  game.currentLevel.krakenProjectiles.push({
                      mesh: proj,
                      vel: vel,
                      life: 3.5
                  });
              }
          }
          
          // Player attack logic (Jump on head when grounded)
          if (game.currentLevel.krakenState === 'ground') {
              const dx = pPos.x - game.currentLevel.kraken.position.x;
              const dz = pPos.z - game.currentLevel.kraken.position.z;
              const distToKraken = Math.sqrt(dx*dx + dz*dz);
              
              // If player is above kraken head and falling
              if (distToKraken < 14.0 && pPos.y > game.currentLevel.kraken.position.y + 4) {
                  if (game.playerVel && game.playerVel.y < 0) { 
                      game.playerVel.y = 25; // Bounce off heavily
                      game.currentLevel.krakenHp -= 1;
                      if (game.spawnSparkleParticles) game.spawnSparkleParticles(game.currentLevel.kraken.position, 30, 0x6b21a8);
                      
                      if (game.currentLevel.krakenHp <= 0) {
                          // Dead!
                          game.currentLevel.kraken.visible = false;
                          if (game.callbacks && game.callbacks.onShowNotice) game.callbacks.onShowNotice("✨ KRAKEN MAĞLUP EDİLDİ! TEBRİKLER! ✨", "success");
                      } else {
                          if (game.callbacks && game.callbacks.onShowNotice) game.callbacks.onShowNotice(`💥 VURDUN! Kalan Can: ${game.currentLevel.krakenHp}`, "success");
                          // Instantly force it back to air
                          game.currentLevel.krakenState = 'air';
                  game.currentLevel.krakenStateTimer = 20.0;
                  if(typeof playKrakenSound==='function') playKrakenSound('warn');
                      }
                  }
              }
          }
      }

      // Update Kraken Projectiles (Fixed Damage Hitbox)
      if (game.currentLevel.krakenProjectiles) {
          for (let i = game.currentLevel.krakenProjectiles.length - 1; i >= 0; i--) {
              let p = game.currentLevel.krakenProjectiles[i];
              p.life -= dt;
              if (p.mesh) {
                  p.mesh.position.x += p.vel.x * dt;
                  p.mesh.position.y += p.vel.y * dt;
                  p.mesh.position.z += p.vel.z * dt;
                  p.mesh.rotation.x += 5 * dt;
                  p.mesh.rotation.y += 5 * dt;
              }
              
              if (pPos && p.mesh) {
                  const dx = pPos.x - p.mesh.position.x;
                  const dy = pPos.y - p.mesh.position.y;
                  const dz = pPos.z - p.mesh.position.z;
                  const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
                  if (dist < 4.5) { // Hit! (Increased hitbox from 3.0 to 4.5)
                      if (game.playerHp > 0) {
                          game.playerHp -= 6;
                          if (game.callbacks && game.callbacks.onHpChange) game.callbacks.onHpChange(game.playerHp, 100);
                          if (game.spawnSparkleParticles) game.spawnSparkleParticles(p.mesh.position, 15, 0x0ea5e9);
                          
                          if (game.playerVel) {
                              game.playerVel.y = 15;
                              game.playerVel.x += p.vel.x * 0.3;
                              game.playerVel.z += p.vel.z * 0.3;
                          }
                      }
                      p.life = 0;
                  }
              }

              if (p.life <= 0) {
                  if (p.mesh && p.mesh.parent) p.mesh.parent.remove(p.mesh);
                  game.currentLevel.krakenProjectiles.splice(i, 1);
              }
          }
      }

      // 5. Visual Checkpoints logic
      if (pPos && game.currentLevel.checkpoints) {
          (game.currentLevel.checkpoints || []).forEach(cp => {
              updateAndActivateCheckpoint(game, cp);
          });
      }

      // 6. Death / Reset mechanic
      if (pPos) {
          // Calculate fall threshold based on spawnPoint height (since they climb very high)
          const deathY = game.currentLevel.spawnPoint.y - 15; // If they fall 15 units below their checkpoint, reset
          
          if (pPos.y < deathY) {
              game.playerPos.copy(game.currentLevel.spawnPoint);
              if (game.playerVel) game.playerVel.set(0,0,0);
              if (game.callbacks && game.callbacks.onShowNotice) {
                  game.callbacks.onShowNotice("💦 Mavi sulara düştün! Son noktadan başlıyorsun.", "warn");
              }
          }
      }
  }
// Handle Volcano Cave (Lav Şelaleleri & Kızıl Ignis Boss + Tehlikeler)
  if (game.currentRegion === 'volcano_cave' && game.currentLevel) {
      const dt = 0.016;
      const pPos = game.playerPos;
      const THREE = window.THREE;

      // 1. Jump Pads / Magma Geysers interaction
      if (pPos && game.currentLevel.jumpPads) {
          (game.currentLevel.jumpPads || []).forEach(pad => {
              const dPad = Math.sqrt((pPos.x - pad.pos.x) ** 2 + (pPos.z - pad.pos.z) ** 2);
              if (dPad < 2.5 && Math.abs(pPos.y - pad.pos.y) < 1.8) {
                  if (game.playerVel) {
                      game.playerVel.y = pad.boostForce || 22;
                      if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos, 14, 0xff7700);
                      if (pad.boostForce >= 25 && game.callbacks && game.callbacks.onShowNotice) {
                          game.callbacks.onShowNotice("🚀 Zirve Gayzeri Seni Ejderha Arenasına Fırlattı!", "success");
                      }
                  }
              }
          });
      }

      // 2. Healing Crystals Interaction
      if (pPos && game.currentLevel.healingCrystals) {
          (game.currentLevel.healingCrystals || []).forEach(hc => {
              if (hc.collected) return;
              if (hc.mesh) {
                  hc.mesh.rotation.y += 0.04;
                  hc.mesh.position.y = hc.pos.y + Math.sin(Date.now() * 0.004) * 0.2;
              }
              const dHc = hc.pos.distanceTo(pPos);
              if (dHc < 2.5) {
                  hc.collected = true;
                  if (hc.mesh && hc.mesh.parent) hc.mesh.parent.remove(hc.mesh);
                  if (game.playerHp !== undefined) game.playerHp = 100;
                  if (game.callbacks && game.callbacks.onHpChange) game.callbacks.onHpChange(100, 100);
                  if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos, 20, 0x10b981);
                  if (game.callbacks && game.callbacks.onShowNotice) {
                      game.callbacks.onShowNotice("💖 Kutsal Lav Şifa Kristali! Canın %100 Yenilendi!", "success");
                  }
              }
          });
      }

      // 3. Checkpoints interaction
      if (pPos && game.currentLevel.checkpoints) {
          (game.currentLevel.checkpoints || []).forEach(cp => {
              updateAndActivateCheckpoint(game, cp);
          });
      }

      // 4. Collectibles interaction
      if (pPos && game.currentLevel.collectibles) {
          (game.currentLevel.collectibles || []).forEach(item => {
              if (item.collected) return;
              if (item.mesh) item.mesh.rotation.y += 0.05;
              const dItem = item.pos.distanceTo(pPos);
              if (dItem < 2.2) {
                  item.collected = true;
                  if (item.mesh && item.mesh.parent) item.mesh.parent.remove(item.mesh);
                  if (item.type === 'honey_gem') {
                      if (game.gainHoneyGems) game.gainHoneyGems(item.value || 1);
                      if (game.callbacks && game.callbacks.onShowNotice) {
                          game.callbacks.onShowNotice("💎 Kutsal Lav Bal Mücevheri Bulundu! (+25 Puan)", "success");
                      }
                  } else {
                      if (game.gainCoins) game.gainCoins(item.value || 5);
                  }
                  if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos, 8, 0xffaa00);
              }
          });
      }

      // 5. TEHLİKE 1: Dönen Alev Çubukları (Spinning Magma Fire Bars)
      if (game.currentLevel.fireBars && THREE) {
          (game.currentLevel.fireBars || []).forEach(fb => {
              if (fb.mesh) fb.mesh.rotation.y += dt * fb.speed;
              if (pPos) {
                  const rad = fb.mesh.rotation.y;
                  for (let i = 1; i <= fb.orbCount; i++) {
                      const dist = (i / fb.orbCount) * fb.radius;
                      // Positive wing orb position
                      const ox1 = fb.pos.x + Math.cos(rad) * dist;
                      const oz1 = fb.pos.z - Math.sin(rad) * dist;
                      const oy1 = fb.pos.y + 1.2;
                      const d1 = Math.sqrt((pPos.x - ox1)**2 + (pPos.y - oy1)**2 + (pPos.z - oz1)**2);

                      // Opposite wing orb position
                      const ox2 = fb.pos.x - Math.cos(rad) * dist;
                      const oz2 = fb.pos.z + Math.sin(rad) * dist;
                      const oy2 = fb.pos.y + 1.2;
                      const d2 = Math.sqrt((pPos.x - ox2)**2 + (pPos.y - oy2)**2 + (pPos.z - oz2)**2);

                      if (d1 < 1.1 || d2 < 1.1) {
                          if (game.damagePlayer) game.damagePlayer(10);
                          if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos, 8, 0xff2200);
                          if (game.callbacks && game.callbacks.onShowNotice) {
                              game.callbacks.onShowNotice("🔥 Dönen Alev Çubuğuna Çarptın! (-10 Can)", "warn");
                          }
                          break;
                      }
                  }
              }
          });
      }

      // 6. TEHLİKE 2: Patlayan Alev Menfezleri (Erupting Magma Flame Vents)
      if (game.currentLevel.flameVents) {
          (game.currentLevel.flameVents || []).forEach(fv => {
              fv.timer = (fv.timer || 0) + dt;
              const cycle = fv.timer % fv.cycleDuration;
              if (cycle > fv.cycleDuration - fv.eruptDuration) {
                  // Erupting
                  if (fv.flameCol && fv.flameCol.material) {
                      fv.flameCol.material.opacity = 0.85;
                      fv.flameCol.scale.y = 1.0 + Math.sin(Date.now() * 0.02) * 0.15;
                  }
                  if (pPos) {
                      const dVent = Math.sqrt((pPos.x - fv.pos.x)**2 + (pPos.z - fv.pos.z)**2);
                      if (dVent < 1.8 && pPos.y >= fv.pos.y && pPos.y <= fv.pos.y + 6.0) {
                          if (game.damagePlayer) game.damagePlayer(12);
                          if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos, 10, 0xff4500);
                          if (game.callbacks && game.callbacks.onShowNotice) {
                              game.callbacks.onShowNotice("🌋 Patlayan Lav Gayzerine Bastın! (-12 Can)", "warn");
                          }
                      }
                  }
              } else if (cycle > fv.cycleDuration - fv.eruptDuration - 0.7) {
                  // Warning glow
                  if (fv.flameCol && fv.flameCol.material) {
                      fv.flameCol.material.opacity = 0.25;
                      fv.flameCol.scale.y = 0.3;
                  }
              } else {
                  // Idle
                  if (fv.flameCol && fv.flameCol.material) {
                      fv.flameCol.material.opacity = 0.0;
                  }
              }
          });
      }

      // 7. TEHLİKE 3: Gökten Düşen Lav Meteorları (Falling Magma Meteors)
      if (THREE && pPos) {
          if (game.currentLevel.nextMeteorTimer === undefined) game.currentLevel.nextMeteorTimer = 2.5;
          game.currentLevel.nextMeteorTimer -= dt;

          if (game.currentLevel.nextMeteorTimer <= 0) {
              game.currentLevel.nextMeteorTimer = 2.8 + Math.random() * 1.5;
              // Target coordinate in the vicinity of player (on nearby platform path)
              const offsetX = (Math.random() - 0.5) * 16;
              const offsetZ = (Math.random() - 0.5) * 16;
              const targetX = pPos.x + offsetX;
              const targetZ = pPos.z + offsetZ;
              const targetY = pPos.y;

              // Create warning indicator decal on ground
              const warnRing = new THREE.Mesh(
                  new THREE.RingGeometry(0.8, 2.4, 16),
                  new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide, transparent: true, opacity: 0.8 })
              );
              warnRing.rotation.x = -Math.PI / 2;
              warnRing.position.set(targetX, targetY + 0.1, targetZ);
              game.currentLevel.mesh.add(warnRing);

              // Create falling fiery meteor rock
              const meteorMesh = new THREE.Mesh(
                  new THREE.DodecahedronGeometry(1.2),
                  new THREE.MeshStandardMaterial({ color: 0x450a0a, emissive: 0xff3700, emissiveIntensity: 1.6 })
              );
              meteorMesh.position.set(targetX, targetY + 45, targetZ);
              game.currentLevel.mesh.add(meteorMesh);

              if (game.currentLevel.magmaMeteors) {
                  game.currentLevel.magmaMeteors.push({
                      warnRing: warnRing,
                      meteorMesh: meteorMesh,
                      targetPos: new THREE.Vector3(targetX, targetY, targetZ),
                      posY: targetY + 45,
                      speed: 38,
                      life: 1.5
                  });
              }
          }

          // Update active falling meteors
          if (game.currentLevel.magmaMeteors) {
              for (let i = game.currentLevel.magmaMeteors.length - 1; i >= 0; i--) {
                  const m = game.currentLevel.magmaMeteors[i];
                  m.posY -= m.speed * dt;
                  m.meteorMesh.position.y = m.posY;
                  m.meteorMesh.rotation.x += 0.1;
                  m.meteorMesh.rotation.y += 0.15;

                  // Pulse warning ring
                  if (m.warnRing && m.warnRing.material) {
                      m.warnRing.scale.setScalar(1.0 + Math.sin(Date.now() * 0.015) * 0.15);
                  }

                  if (m.posY <= m.targetPos.y + 0.5) {
                      // Impact! Explosion effect
                      if (game.spawnSparkleParticles) game.spawnSparkleParticles(m.targetPos, 16, 0xff3300);

                      // Distance check to player
                      const distToImpact = m.targetPos.distanceTo(pPos);
                      if (distToImpact < 3.6) {
                          if (game.damagePlayer) game.damagePlayer(14);
                          if (game.playerVel) game.playerVel.y = 8;
                          if (game.callbacks && game.callbacks.onShowNotice) {
                              game.callbacks.onShowNotice("💥 Düşen Lav Meteoru Çarptı! (-14 Can)", "warn");
                          }
                      }

                      // Cleanup meshes
                      if (m.warnRing && m.warnRing.parent) m.warnRing.parent.remove(m.warnRing);
                      if (m.meteorMesh && m.meteorMesh.parent) m.meteorMesh.parent.remove(m.meteorMesh);
                      game.currentLevel.magmaMeteors.splice(i, 1);
                  }
              }
          }
      }

      // 8. TEHLİKE 4: Uçan Magma Ejdercikleri AI (Flying Magma Drakes)
      if (game.currentLevel.enemies) {
          (game.currentLevel.enemies || []).forEach(en => {
              if (en.type === 'flying_magma_drake' && en.hp > 0) {
                  en.animTimer = (en.animTimer || 0) + dt * 5.0;

                  // Wing flapping animation
                  const wL = en.mesh.getObjectByName('drake_wing_l');
                  const wR = en.mesh.getObjectByName('drake_wing_r');
                  if (wL) wL.rotation.z = Math.sin(en.animTimer) * 0.45;
                  if (wR) wR.rotation.z = -Math.sin(en.animTimer) * 0.45;

                  // Sinusoidal patrol movement
                  if (en.originPos) {
                      en.pos.x = en.originPos.x + Math.sin(en.animTimer * 0.4) * 4.5;
                      en.pos.y = en.originPos.y + Math.cos(en.animTimer * 0.6) * 1.2;
                      en.pos.z = en.originPos.z + Math.cos(en.animTimer * 0.3) * 3.0;
                      en.mesh.position.copy(en.pos);
                  }

                  if (pPos) {
                      const dDrake = en.pos.distanceTo(pPos);
                      // Face player
                      en.mesh.rotation.y = Math.atan2(pPos.x - en.pos.x, pPos.z - en.pos.z);

                      // Shoot mini fireball when close
                      en.attackCooldown = (en.attackCooldown || 2.0) - dt;
                      if (dDrake < 22 && en.attackCooldown <= 0) {
                          en.attackCooldown = 3.2;
                          createFireball(game, en.pos, pPos);
                          if (game.callbacks && game.callbacks.onShowNotice && Math.random() < 0.25) {
                              game.callbacks.onShowNotice("🦇 Magma Ejderciği Ateş Püskürttü!", "info");
                          }
                      }

                      // Check player attack collision
                      if (game.isAttacking && dDrake < 3.2) {
                          en.hp -= 30;
                          if (game.spawnSparkleParticles) game.spawnSparkleParticles(en.pos, 10, 0xff7700);
                          if (en.hp <= 0) {
                              if (en.mesh && en.mesh.parent) en.mesh.parent.remove(en.mesh);
                              if (game.gainCoins) game.gainCoins(15);
                              if (game.gainXp) game.gainXp(25);
                              if (game.callbacks && game.callbacks.onShowNotice) {
                                  game.callbacks.onShowNotice("💥 Magma Ejderciği Etkisiz Hale Getirildi! (+15 Altın)", "success");
                              }
                          }
                      }
                  }
              }
          });
      }

      // 9. Boss Ignis Dragon Loop
      if (game.currentLevel.enemies) {
          const dragon = (game.currentLevel.enemies || []).find(e => e.id === 'boss_volcano_dragon');
          if (dragon) {
              // Flap wings animation
              dragon.animTimer = (dragon.animTimer || 0) + dt * 4.0;
              const wingL = dragon.mesh.getObjectByName('dragon_wing_left');
              const wingR = dragon.mesh.getObjectByName('dragon_wing_right');
              if (wingL) wingL.rotation.z = Math.sin(dragon.animTimer) * 0.35;
              if (wingR) wingR.rotation.z = -Math.sin(dragon.animTimer) * 0.35;

              // Tail sway animation
              const tail = dragon.mesh.getObjectByName('dragon_tail');
              if (tail) tail.rotation.y = Math.sin(dragon.animTimer * 0.8) * 0.25;

              // Defeat condition
              if (dragon.hp <= 0 && !dragon.deadMessageShown) {
                  dragon.deadMessageShown = true;
                  if (game.callbacks && game.callbacks.onShowNotice) {
                      game.callbacks.onShowNotice("🏆 Kızıl Alev Ejderhası Ignis Mağlup Edildi! 🔴 6. Kutsal Lav Ateşi Bal Kristali Kurtarıldı!", "success");
                  }
                  if (game.gainCoins) game.gainCoins(400);
                  if (game.gainXp) game.gainXp(600);
                  if (game.spawnBossPortalForCurrentRegion) {
                      game.spawnBossPortalForCurrentRegion(dragon.pos);
                  }
              }

              // Awake & Fireball mechanics
              if (pPos && dragon.hp > 0) {
                  const dist = dragon.pos.distanceTo(pPos);
                  if (dist < 45) {
                      dragon.mesh.rotation.y = Math.atan2(pPos.x - dragon.pos.x, pPos.z - dragon.pos.z);
                      if (dragon.attackCooldown <= 0) {
                          dragon.attackCooldown = 2.6; // Fireball interval
                          createFireball(game, dragon.pos, pPos);
                          if (game.callbacks && game.callbacks.onShowNotice && Math.random() < 0.3) {
                              game.callbacks.onShowNotice("🔥 Kızıl Ignis: Roaaar! Mağaramı terk et!", "warn");
                          }
                      } else {
                          dragon.attackCooldown -= dt;
                      }
                  } else {
                      dragon.attackCooldown = 2.0;
                  }
              }
          }
      }
  }
  
  if (game.currentRegion === 'dinosaur_world' && game.currentLevel && game.currentLevel.enemies) {
      const trex = (game.currentLevel.enemies || []).find(e => e.id === 'boss_trex');
      if (trex && trex.hp <= 0 && !trex.deadMessageShown) {
          trex.deadMessageShown = true;
          if (game.callbacks && game.callbacks.onShowNotice) {
              setTimeout(() => {
                 game.callbacks.onShowNotice("Aferin beni yendin ben seni güçsüz bir ayı sanmıştım ama sen çok cesur ve yeteneklisin aferin");
              }, 1000);
          }
      }

      if (game.playerPos) {
          const pPos = game.playerPos;
          const dt = 0.016; 
          
          (game.currentLevel.enemies || []).forEach(e => {
              if (e.hp <= 0) return;
              
              const dist = e.pos.distanceTo(pPos);
              
              if (e.type === 'dino_trex_boss') {
                  // Only wake up if player is very close (e.g. reached the tower)
                  if (dist < 32) { 
                      e.mesh.rotation.y = Math.atan2(pPos.x - e.pos.x, pPos.z - e.pos.z);
                      
                      if (dist > 8) {
                          const dir = pPos.clone().sub(e.pos).normalize();
                          e.pos.x += dir.x * 2.5 * dt;
                          e.pos.z += dir.z * 2.5 * dt;
                      }
                      
                      // Keep boss on the tower (center: 0, -90, radius: 24)
                      const distToTowerCenter = Math.sqrt(e.pos.x * e.pos.x + (e.pos.z + 90) * (e.pos.z + 90));
                      if (distToTowerCenter > 22) {
                          const angle = Math.atan2(e.pos.x, e.pos.z + 90);
                          e.pos.x = Math.sin(angle) * 22;
                          e.pos.z = -90 + Math.cos(angle) * 22;
                      }

                      if (e.attackCooldown <= 0) {
                          e.attackCooldown = 3.0; // Fireball frequency
                          createFireball(game, e.pos, pPos);
                      } else {
                          e.attackCooldown -= dt;
                      }
                  } else {
                      // Sleep / patrol idle on tower
                      e.attackCooldown = 2.0; 
                  }
              } else if (e.type === 'dino_minion') {
                  if (dist < 40) {
                      e.mesh.rotation.y = Math.atan2(pPos.x - e.pos.x, pPos.z - e.pos.z);
                      if (dist > 2.5) {
                          const dir = pPos.clone().sub(e.pos).normalize();
                          e.pos.x += dir.x * 2.5 * dt; 
                          e.pos.z += dir.z * 2.5 * dt;
                      } else {
                          if (e.attackCooldown <= 0) {
                              e.attackCooldown = 1.2;
                              if (game.damagePlayer) {
                                  game.damagePlayer(3); // -3 can gitsin
                              }
                          }
                      }
                      if (e.attackCooldown > 0) e.attackCooldown -= dt;
                  }
              }
              
              // Only override X and Z, let Y be set by whatever
              e.mesh.position.x = e.pos.x;
              e.mesh.position.z = e.pos.z;
          });

          // Handle Fireballs
          if (game.currentLevel.fireballs) {
              for (let i = game.currentLevel.fireballs.length - 1; i >= 0; i--) {
                  const fb = game.currentLevel.fireballs[i];
                  if (fb && fb.mesh && fb.mesh.position && fb.dir) { fb.mesh.position.add(fb.dir.clone().multiplyScalar(fb.speed)); }
                  fb.life += dt;
                  
                  if (fb.mesh.position.distanceTo(pPos) < 2.5) {
                      if (game.damagePlayer) game.damagePlayer(25); // alev topu boss damage
                      if (fb.mesh.parent) fb.mesh.parent.remove(fb.mesh); else game.scene.remove(fb.mesh);
                      game.currentLevel.fireballs.splice(i, 1);
                      continue;
                  }
                  
                  if (fb.life > 5.0) {
                      if (fb.mesh.parent) fb.mesh.parent.remove(fb.mesh); else game.scene.remove(fb.mesh);
                      game.currentLevel.fireballs.splice(i, 1);
                  }
              }
          }
      }
  }

  if (game && game.scene) {
    if (game.playerPos && game.playerPos.y < 0.1 && (!game.currentRegion || game.currentRegion === 'hub')) {
      if (game.playerVel && game.playerVel.y < 0) game.playerVel.y = 0;
    }
    if (!alienCompanionGroup) {
      alienCompanionGroup = createAlienMesh();
      game.scene.add(alienCompanionGroup);
    }
    if (game.playerPos && alienCompanionGroup && spaceState.companionActive) {
      const pPos = game.playerPos;
      const petPos = alienCompanionGroup.position;
      if (!petState.targetPos) {
        petState.targetPos = pPos.clone();
      }
      const distToPlayer = petPos.distanceTo(pPos);
      if (distToPlayer > 14) {
        const catchUpPos = pPos.clone();
        catchUpPos.x += (Math.random() - 0.5) * 4;
        catchUpPos.y += 1.0;
        catchUpPos.z += (Math.random() - 0.5) * 4;
        petPos.lerp(catchUpPos, 0.08);
        petState.wanderTimer = 0;
      } else {
        petState.wanderTimer += 1;
        if (petState.wanderTimer > 200 || petPos.distanceTo(petState.targetPos) < 1.0) {
          petState.wanderTimer = 0;
          const angle = Math.random() * Math.PI * 2;
          const radius = 3.5 + Math.random() * 4.0;
          const tx = pPos.x + Math.cos(angle) * radius;
          const ty = pPos.y + 0.8 + Math.sin(Date.now() * 0.003) * 0.4;
          const tz = pPos.z + Math.sin(angle) * radius;
          petState.targetPos.set(tx, ty, tz);
        }
        petPos.lerp(petState.targetPos, 0.035);
      }
      petPos.y += Math.sin(Date.now() * 0.005) * 0.012;
      alienCompanionGroup.rotation.y += 0.02;
    }
    for (let i = lasers.length - 1; i >= 0; i--) {
      const l = lasers[i];
      l.life += 1;
      l.mesh.position.x += l.dirX * 1.8;
      l.mesh.position.z += l.dirZ * 1.8;

      let laserHit = false;

      // Laser collision with Gold Coin Boss
      if (game.currentLevel && game.currentLevel.goldCoinBoss && game.currentLevel.goldCoinBoss.hp > 0) {
        const boss = game.currentLevel.goldCoinBoss;
        const bCenter = boss.pos.clone().add(new THREE.Vector3(0, 5.0, 0));
        if (l.mesh.position.distanceTo(bCenter) < 6.5) {
          if (!boss.hitInvulnTimer || boss.hitInvulnTimer <= 0) {
            boss.hitInvulnTimer = 0.45;
            boss.hp = Math.max(0, boss.hp - 45);
            if (typeof updateGoldCoinBossHealthBar === 'function') updateGoldCoinBossHealthBar(boss.hp, boss.maxHp);
            if (game.spawnSparkleParticles) game.spawnSparkleParticles(bCenter, 30, 0xfacc15);
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice("⚡ PLAZMA LAZERİ İSABET ETTİ! Dev Altın Para Hasar Aldı! (-45 HP) [Kalan: " + Math.ceil(boss.hp) + " / " + boss.maxHp + "]", "success");
            }
          }
          laserHit = true;
        }
      }
      // Laser collision with Clown Boss
      if (!laserHit && game.currentLevel && game.currentLevel.clownBoss && game.currentLevel.clownBoss.hp > 0) {
        const cBoss = game.currentLevel.clownBoss;
        const cCenter = cBoss.pos.clone().add(new THREE.Vector3(0, 4.5, 0));
        if (l.mesh.position.distanceTo(cCenter) < 6.0) {
          cBoss.hp = Math.max(0, cBoss.hp - 80);
          if (game.spawnSparkleParticles) game.spawnSparkleParticles(cCenter, 25, 0xef4444);
          if (game.callbacks && game.callbacks.onShowNotice) {
            game.callbacks.onShowNotice("⚡ PLAZMA LAZERİ İSABET ETTİ! Palyaço Boss Hasar Aldı! (-80 HP) [Kalan: " + Math.ceil(cBoss.hp) + "]", "success");
          }
          laserHit = true;
        }
      }

      if (laserHit || l.life > 40) {
        game.scene.remove(l.mesh);
        lasers.splice(i, 1);
      }
    }
    const isHub = (!game.currentRegion || game.currentRegion === 'hub');
    const isSpaceCastle = (game.currentRegion === 'space_castle');
    const showSpaceHub = isHub || isSpaceCastle;

    if (typeof spaceObjects !== 'undefined' && Array.isArray(spaceObjects)) {
      spaceObjects.forEach(obj => {
        if (obj && obj.name === 'expanded_kedi_koyu') {
          obj.visible = isHub;
        } else if (obj) {
          obj.visible = showSpaceHub;
        }
      });
    }

    // Universal Void Fall Protection & Respawn
    if (game.playerPos) {
      if (!window.__lastGroundedSafePos) {
        window.__lastGroundedSafePos = new window.THREE.Vector3(0, 1.5, 0);
      }
      if (game.isGrounded && game.playerPos.y >= -1.0 && Math.abs(game.playerPos.x) < 500 && Math.abs(game.playerPos.z) < 500) {
        window.__lastGroundedSafePos.copy(game.playerPos);
      }

      // Universal void fall rescue threshold
      if (game.playerPos.y < -15.0) {
        let respawnTarget = (game.currentLevel && game.currentLevel.spawnPoint)
          ? game.currentLevel.spawnPoint.clone()
          : (window.__lastGroundedSafePos ? window.__lastGroundedSafePos.clone() : new window.THREE.Vector3(0, 1.5, 0));

        game.playerPos.copy(respawnTarget);
        game.playerPos.y += 1.2;
        if (game.playerVel) game.playerVel.set(0, 0, 0);
        if (game.isGrounded !== undefined) game.isGrounded = true;
        if (game.jumpCount !== undefined) game.jumpCount = 0;

        if (game.spawnSparkleParticles) {
          game.spawnSparkleParticles(game.playerPos, 20, 0x38bdf8);
        }
        if (game.callbacks && game.callbacks.onShowNotice) {
          game.callbacks.onShowNotice("✨ Boşluktan Güvenli Zemine Işınlandın!", "info");
        }
      }
    }

    const cat = game.scene.getObjectByName('merchant_cat');
    if (!isHub) {
      if (cat) cat.visible = false;
      window.dispatchEvent(new CustomEvent('superbear:cat-merchant-proximity', { detail: { isNear: false } }));
    } else if (cat) {
      cat.visible = true;
      const tail = cat.getObjectByName('cat_tail');
      if (tail) {
        tail.rotation.z = Math.sin(Date.now() * 0.005) * 0.25;
      }
      const orb = cat.getObjectByName('cat_shop_icon');
      if (orb) {
        orb.rotation.y += 0.03;
        orb.position.y = 6.4 + Math.sin(Date.now() * 0.004) * 0.2;
      }
      if (game.playerPos) {
        const dist = game.playerPos.distanceTo(cat.position);
        if (dist < 8.5) {
          window.dispatchEvent(new CustomEvent('superbear:cat-merchant-proximity', { detail: { isNear: true, dist } }));
        } else {
          window.dispatchEvent(new CustomEvent('superbear:cat-merchant-proximity', { detail: { isNear: false } }));
        }
      }
    } else {
      window.dispatchEvent(new CustomEvent('superbear:cat-merchant-proximity', { detail: { isNear: false } }));
    }

    const pelikan = game.scene.getObjectByName('npc_pelican_piko');
    if (pelikan) {
      pelikan.visible = isHub;
      if (isHub) {
        const leftWing = pelikan.getObjectByName('boss_left_wing');
        const rightWing = pelikan.getObjectByName('boss_right_wing');
        if (leftWing) leftWing.rotation.z = 0.3 + Math.sin(Date.now() * 0.004) * 0.18;
        if (rightWing) rightWing.rotation.z = -0.3 - Math.sin(Date.now() * 0.004) * 0.18;
        const headGroup = pelikan.getObjectByName('pelican_head_group');
        if (headGroup) headGroup.position.y = 3.6 + Math.sin(Date.now() * 0.005) * 0.08;
        const badge = pelikan.getObjectByName('pelican_floating_badge');
        if (badge) {
          badge.rotation.y += 0.03;
          badge.position.y = 5.2 + Math.sin(Date.now() * 0.005) * 0.15;
        }
        if (game.playerPos) {
          const dist = game.playerPos.distanceTo(pelikan.position);
          if (dist < 8) {
            if (game.callbacks && game.callbacks.onShowNotice && Date.now() % 4000 < 50) {
              game.callbacks.onShowNotice("🪶 Tatlış Pelikan Piko: 'Gak gak! Ben Ayı Köyü'nün en sevimli pelikanıyım! Pelikan Ovaları'nda gök adalarına uçabilirsin!'");
            }
          }
        }
      }
    }

    // --- 🕹️ RETRO ARCADE MİNİ OYUN KABİNİ PROXIMITY & ANIMATION ---
    const aCabinet = game.scene.getObjectByName('retro_arcade_cabinet');
    if (!isHub) {
      if (aCabinet) aCabinet.visible = false;
      window.dispatchEvent(new CustomEvent('superbear:arcade-proximity', { detail: { isNear: false } }));
    } else if (aCabinet) {
      aCabinet.visible = true;
      const aIcon = aCabinet.getObjectByName('arcade_cabinet_icon');
      if (aIcon) {
        aIcon.rotation.y += 0.03;
        aIcon.position.y = 5.8 + Math.sin(Date.now() * 0.005) * 0.15;
      }
      if (game.playerPos) {
        const dist = game.playerPos.distanceTo(aCabinet.position);
        if (dist < 4.5) {
          window.dispatchEvent(new CustomEvent('superbear:arcade-proximity', { detail: { isNear: true, dist } }));
        } else {
          window.dispatchEvent(new CustomEvent('superbear:arcade-proximity', { detail: { isNear: false } }));
        }
      }
    } else {
      window.dispatchEvent(new CustomEvent('superbear:arcade-proximity', { detail: { isNear: false } }));
    }

    // =========================================================================
    // --- 🏊 KÜRESEL SUDA YÜZME MEKANİĞİ (Global Swimming Physics Engine) ---
    // =========================================================================
    if (game.playerPos) {
      const pPos = game.playerPos;
      const pVel = game.playerVel || { x: 0, y: 0, z: 0 };
      
      // Determine if player is inside any body of water:
      // 1. Ayı Köyü River: x in [-45, 45], z in [14, 32], y in [-2.0, 0.85] (ONLY in Hub and NOT in parkour)
      const inVillageRiver = (isHub && pPos.x >= -45 && pPos.x <= 45 && pPos.z >= 14 && pPos.z <= 32 && pPos.y <= 0.85 && pPos.y >= -2.0);
      // 2. Fishing Pond 1: near (-26, -8)
      const dPond1 = Math.sqrt((pPos.x + 26) * (pPos.x + 26) + (pPos.z + 8) * (pPos.z + 8));
      const inPond1 = (isHub && dPond1 <= 9.0 && pPos.y <= 0.85 && pPos.y >= -2.0);
      // 3. Fishing Pond 2: near (-10, 38)
      const dPond2 = Math.sqrt((pPos.x + 10) * (pPos.x + 10) + (pPos.z - 38) * (pPos.z - 38));
      const inPond2 = (isHub && dPond2 <= 8.0 && pPos.y <= 0.85 && pPos.y >= -2.0);
      // 4. Level-defined water surfaces
      const inLevelWater = (game.currentLevel && game.currentLevel.waterLevel !== undefined && pPos.y <= game.currentLevel.waterLevel + 0.3 && pPos.y >= game.currentLevel.waterLevel - 3.0);

      const inWater = Boolean(inVillageRiver || inPond1 || inPond2 || inLevelWater);

      if (inWater) {
        let waterSurfaceY = 0.6;
        if (inLevelWater && game.currentLevel) {
          waterSurfaceY = game.currentLevel.waterLevel;
        }

        if (!game._isSwimmingActive) {
          game._isSwimmingActive = true;
          if (game.spawnSparkleParticles) {
            game.spawnSparkleParticles(pPos, 22, 0x38bdf8);
          }
          if (window.St && typeof window.St.playWaterSplash === 'function') {
            window.St.playWaterSplash();
          }
          if (game.callbacks && game.callbacks.onShowNotice) {
            game.callbacks.onShowNotice("🏊 Suya Girdin! Yüzme Modu Aktif (Boşluk Tuşu: Kulaç At / Zıpla)", "info");
          }
        }

        // Buoyancy float force: gently push toward water surface
        const depth = waterSurfaceY - pPos.y;
        if (depth > 0.1) {
          pVel.y = Math.min(0.28, pVel.y + 0.065);
        } else if (depth < -0.1) {
          pVel.y = Math.max(-0.08, pVel.y - 0.02);
        } else {
          // Floating wave wobble
          pVel.y = Math.sin(Date.now() * 0.005) * 0.025;
        }

        // Water resistance & drag
        pVel.x *= 0.94;
        pVel.z *= 0.94;

        // Visual water ripples & droplets
        if (Math.random() < 0.35 && game.spawnSparkleParticles) {
          game.spawnSparkleParticles(pPos, 2, 0x7dd3fc);
        }

        // Animate swimming bear body (horizontal tilt)
        const playerObj = game.scene.getObjectByName('player_bear') || game.playerMesh;
        if (playerObj) {
          playerObj.rotation.x = 0.55; // Lean forward to paddle
        }
      } else {
        game._lastSwimTrackPos = null;
        if (game._isSwimmingActive) {
          game._isSwimmingActive = false;
          if (game.spawnSparkleParticles) {
            game.spawnSparkleParticles(pPos, 14, 0xbae6fd);
          }
          const playerObj = game.scene.getObjectByName('player_bear') || game.playerMesh;
          if (playerObj) {
            playerObj.rotation.x = 0; // Restore upright posture
          }
        }
      }
    }

    const barrier = game.scene.getObjectByName('space_travel_barrier');
    if (barrier) {
      barrier.visible = isHub;
      if (isHub && game.playerPos) {
        const dist = game.playerPos.distanceTo(barrier.position);
        if (dist < 4.0) {
          if (spaceState.aliensRescued >= 30) {
            teleportToSpace();
          } else {
            if (game.callbacks && game.callbacks.onShowNotice && Date.now() % 2000 < 50) {
              game.callbacks.onShowNotice(`🔒 Uzaya gitmek için 30 uzaylı topla! (Şu an: ${spaceState.aliensRescued}/30)`);
            }
          }
        }
      }
    }

    // --- EXPANDED KEDİ KÖYÜ INTERACTIVES (Volleyball, Animals, Swimming Fish) ---
    if (isHub && game.playerPos) {
      // 1. Interactive Volleyball Physics & Player Hit
      if (villageVolleyball) {
        villageVolleyball.position.x += villageVolleyballVel.x;
        villageVolleyball.position.y += villageVolleyballVel.y;
        villageVolleyball.position.z += villageVolleyballVel.z;

        villageVolleyballVel.x *= 0.92;
        villageVolleyballVel.z *= 0.92;
        villageVolleyballVel.y -= 0.015; // Gravity

        if (villageVolleyball.position.y < 1.0) {
          villageVolleyball.position.y = 1.0;
          villageVolleyballVel.y *= -0.65; // Bounce
        }

        // Bounds limit
        if (villageVolleyball.position.x < 15) villageVolleyball.position.x = 15;
        if (villageVolleyball.position.x > 40) villageVolleyball.position.x = 40;
        if (villageVolleyball.position.z < -28) villageVolleyball.position.z = -28;
        if (villageVolleyball.position.z > -2) villageVolleyball.position.z = -2;

        const dBall = game.playerPos.distanceTo(villageVolleyball.position);
        if (dBall < 2.5) {
          const dirX = (villageVolleyball.position.x - game.playerPos.x) * 0.3;
          const dirZ = (villageVolleyball.position.z - game.playerPos.z) * 0.3;
          villageVolleyballVel.x = dirX || 0.2;
          villageVolleyballVel.z = dirZ || 0.2;
          villageVolleyballVel.y = 0.45;

          if (typeof St !== "undefined" && St.playBallKick) St.playBallKick();
          if (game.callbacks && game.callbacks.onShowNotice && Date.now() % 2000 < 50) {
            game.callbacks.onShowNotice("🏐 VOLEYBOL MAÇI! Harika Pas! (+20 XP)", "success");
          }
          if (game.callbacks && game.callbacks.onQuestProgress) {
            game.callbacks.onQuestProgress("voleybol_top_sektir", 1);
          }
        }
      }

      // 2. 3D Swimming Fish Animation
      if (villageFishList.length > 0) {
        const tNow = Date.now() * 0.002;
        (villageFishList || []).forEach(fish => {
          fish.phase += fish.speed;
          fish.mesh.position.x = fish.baseX + Math.cos(fish.phase) * fish.radius;
          fish.mesh.position.z = fish.baseZ + Math.sin(fish.phase) * fish.radius;
          fish.mesh.rotation.y = -fish.phase + Math.PI / 2;
          fish.mesh.position.y = 0.25 + Math.sin(tNow + fish.phase) * 0.15;
        });
      }

      // 3. Animal NPCs Proximity & Talk Check (Fox, Bunny, Giraffe)
      if (villageNpcsList.length > 0) {
        (villageNpcsList || []).forEach(npc => {
          const dNpc = game.playerPos.distanceTo(npc.pos);
          if (dNpc < 6.5) {
            if (game.callbacks && game.callbacks.onShowNotice && Date.now() % 3500 < 50) {
              game.callbacks.onShowNotice(`💬 ${npc.name}: '${npc.dialogue[0]}'`, "info");
            }
          }
        });
      }

      // 4. Moris'in Gizli Dağ İni & 3 Okunabilir Günlük Notu
      updateMorisSecretDenInteraction(game);

      // 5. Acemi Ayı Alıştırma Parkuru (Kukla Vurma, Yay Tahtası & Hedefe Çarpma)
      updateBeginnerTrainingInteraction(game);
    }

    // =========================================================================
    // --- GENEL FİZİK, KAKTÜS HASARI (4 CAN) & TÜM OBJELERİN/HAYVANLARIN İÇİNE GİRMEME KORUMASI ---
    // =========================================================================
    if (game && game.playerPos && game.currentLevel) {
      const pPos = game.playerPos;
      const pVel = game.playerVel;
      const playerRadius = 0.65;
      const now = Date.now();

      // 1. Kaktüs Hasar Mekaniği (-4 Can) & Katı Çarpışma
      if (game.currentLevel.cacti && game.currentLevel.cacti.length > 0) {
        ((game.currentLevel && game.currentLevel.cacti) || []).forEach(cactus => {
          const dx = pPos.x - cactus.pos.x;
          const dz = pPos.z - cactus.pos.z;
          const hDist = Math.sqrt(dx * dx + dz * dz);
          const minCactusDist = (cactus.radius || 1.6) + playerRadius;
          const yDiff = pPos.y - cactus.pos.y;

          if (hDist < minCactusDist && Math.abs(yDiff) < (cactus.height || 5.2) * 0.65) {
            // Anti-clipping: Kaktüsün içine girmeyi engelle ve oyuncuyu dışarı it
            if (hDist > 0.001) {
              pPos.x = cactus.pos.x + (dx / hDist) * minCactusDist;
              pPos.z = cactus.pos.z + (dz / hDist) * minCactusDist;
            }

            // Kaktüse deyince tam 4 can kaybetme
            if (!game._lastCactusDamageTime || now - game._lastCactusDamageTime > 750) {
              game._lastCactusDamageTime = now;
              
              if (game.stats) {
                game.stats.currentHp = Math.max(0, game.stats.currentHp - 4);
                if (game.callbacks && game.callbacks.onStatsUpdate) {
                  game.callbacks.onStatsUpdate(game.stats);
                }
              }

              if (window.St && window.St.playDamage) window.St.playDamage();
              if (game.spawnSparkleParticles) {
                game.spawnSparkleParticles(pPos, 14, 0xef4444);
              }

              if (game.callbacks && game.callbacks.onShowNotice) {
                game.callbacks.onShowNotice("🌵 Dikenli Kaktüse Değdin! (-4 Can Kaybettin)", "warn");
              }

              // Can bittiğinde kontrol noktasına dönüş
              if (game.stats && game.stats.currentHp <= 0) {
                if (game.callbacks && game.callbacks.onShowNotice) {
                  game.callbacks.onShowNotice("💀 Kaktüs dikenleri canını bitirdi! Yeniden doğuyorsun...", "warn");
                }
                if (game.currentLevel.spawnPoint) {
                  pPos.copy(game.currentLevel.spawnPoint);
                }
                if (pVel) pVel.set(0, 0, 0);
                if (game.stats) {
                  game.stats.currentHp = game.stats.maxHp || 100;
                  if (game.callbacks && game.callbacks.onStatsUpdate) {
                    game.callbacks.onStatsUpdate(game.stats);
                  }
                }
              }
            }
          }
        });
      }

      // 2. Tüm Hayvanlar ve NPC'lerin İçine Girmeyi Engelleme (Anti-Clipping)
      const allNpcs = [
        ...((game.currentLevel && game.currentLevel.npcs) || []),
        ...(typeof villageNpcsList !== 'undefined' && Array.isArray(villageNpcsList) ? villageNpcsList : [])
      ];

      allNpcs.forEach(npc => {
        if (!npc || !npc.pos) return;
        const dx = pPos.x - npc.pos.x;
        const dz = pPos.z - npc.pos.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        const solidDist = (npc.radius || 1.3) + playerRadius;
        const yDiff = Math.abs(pPos.y - npc.pos.y);

        if (dist < solidDist && yDiff < 3.2 && dist > 0.001) {
          pPos.x = npc.pos.x + (dx / dist) * solidDist;
          pPos.z = npc.pos.z + (dz / dist) * solidDist;
          if (pVel) {
            const dot = pVel.x * dx + pVel.z * dz;
            if (dot < 0) {
              pVel.x *= 0.5;
              pVel.z *= 0.5;
            }
          }
        }
      });

      // 3. Tüm Düşmanların ve Bossların İçine Girmeyi Engelleme
      if (game.currentLevel.enemies && game.currentLevel.enemies.length > 0) {
        ((game.currentLevel && game.currentLevel.enemies) || []).forEach(enemy => {
          if (!enemy || enemy.hp <= 0 || !enemy.pos) return;
          const dx = pPos.x - enemy.pos.x;
          const dz = pPos.z - enemy.pos.z;
          const dist = Math.sqrt(dx * dx + dz * dz);
          const enemySolidDist = (enemy.radius || (enemy.isBoss ? 3.2 : 1.25)) + playerRadius;
          const yDiff = Math.abs(pPos.y - enemy.pos.y);

          if (dist < enemySolidDist && yDiff < (enemy.isBoss ? 5.5 : 3.0) && dist > 0.001) {
            pPos.x = enemy.pos.x + (dx / dist) * enemySolidDist;
            pPos.z = enemy.pos.z + (dz / dist) * enemySolidDist;
            if (pVel) {
              pVel.x *= 0.4;
              pVel.z *= 0.4;
            }
          }
        });
      }

      // 4. Çöl Timsahı Boss'unun İçine Girmeyi Engelleme
      if (game.currentLevel.crocodileBoss && game.currentLevel.crocodileBoss.hp > 0) {
        const croc = game.currentLevel.crocodileBoss;
        const dx = pPos.x - croc.pos.x;
        const dz = pPos.z - croc.pos.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        const crocSolidDist = 4.2 + playerRadius;
        const yDiff = Math.abs(pPos.y - croc.pos.y);

        if (dist < crocSolidDist && yDiff < 6.0 && dist > 0.001) {
          pPos.x = croc.pos.x + (dx / dist) * crocSolidDist;
          pPos.z = croc.pos.z + (dz / dist) * crocSolidDist;
          if (pVel) {
            pVel.x *= 0.2;
            pVel.z *= 0.2;
          }
        }
      }
    }
  }

  requestAnimationFrame(updateSpaceLoop);
}


// =================================----------------------------
// 13. BÖLÜM: YIKILMIŞ KÖY & JOKEROOMS PALYAÇO BOSS (Elleri & Ayakları Var!)
// =================================----------------------------

function create3DWarningSign(THREE, x, y, z, titleText, detailText) {
  const signGroup = new THREE.Group();
  signGroup.position.set(x, y, z);

  // Wooden Post
  const postMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 3.8, 8), postMat);
  post.position.y = 1.9;
  signGroup.add(post);

  // Bright Yellow Warning Board with Red Border
  const boardMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
  const borderMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3, emissive: 0x991b1b, emissiveIntensity: 0.4 });
  
  const board = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.2, 0.25), boardMat);
  board.position.y = 3.2;
  signGroup.add(board);

  const border = new THREE.Mesh(new THREE.BoxGeometry(3.8, 2.4, 0.2), borderMat);
  border.position.set(0, 3.2, -0.05);
  signGroup.add(border);

  // Red Warning Skull / Emblem
  const emblemMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.8 });
  const emblem = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.9, 3), emblemMat);
  emblem.position.set(0, 4.7, 0);
  emblem.rotation.z = Math.PI;
  signGroup.add(emblem);

  signGroup.userData = {
    title: titleText,
    detail: detailText,
    isWarningSign: true
  };

  return signGroup;
}

function createClownBossMesh(THREE) {
  const clownGroup = new THREE.Group();
  clownGroup.name = "clown_boss_group";

  // Materials - Clean circus clown palette without any misplaced orange parts between feet
  const faceMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  const noseMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.8 });
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1 });
  const mouthMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.2 });
  const suitMat = new THREE.MeshStandardMaterial({ color: 0x7e22ce, roughness: 0.4 });
  const stripedLegMat = new THREE.MeshStandardMaterial({ color: 0x9333ea, roughness: 0.4 });
  const polkaMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 });
  const bowtieMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.3 });
  const hairCyanMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.5 });
  const hairRedMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.5 });
  const gloveWhiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
  const shoeRedMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });
  const shoeYellowMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.3 });

  // 1. HEAD
  const head = new THREE.Mesh(new THREE.SphereGeometry(1.6, 20, 20), faceMat);
  head.position.y = 5.2;
  clownGroup.add(head);

  // Big Red Nose 🔴
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 16), noseMat);
  nose.position.set(0, 5.2, 1.45);
  clownGroup.add(nose);

  // Painted Star Eyes
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), eyeMat);
  eyeL.position.set(-0.55, 5.6, 1.35);
  clownGroup.add(eyeL);
  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), eyeMat);
  eyeR.position.set(0.55, 5.6, 1.35);
  clownGroup.add(eyeR);

  // Wide Smiling Red Mouth with Sharp Teeth
  const mouth = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.35, 0.4), mouthMat);
  mouth.position.set(0, 4.6, 1.4);
  clownGroup.add(mouth);

  // Frizzy Afro Hair Tufts
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2;
    const isCyan = i % 2 === 0;
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.65, 10, 10), isCyan ? hairCyanMat : hairRedMat);
    puff.position.set(Math.cos(angle) * 1.5, 5.6 + Math.sin(angle) * 0.4, Math.sin(angle) * 1.5);
    clownGroup.add(puff);
  }

  // Party Cone Hat with Jingle Bell
  const hat = new THREE.Mesh(new THREE.ConeGeometry(0.8, 1.8, 12), polkaMat);
  hat.position.set(0, 6.9, 0);
  hat.rotation.x = -0.15;
  clownGroup.add(hat);
  const bell = new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 10), shoeYellowMat);
  bell.position.set(0, 7.8, -0.2);
  clownGroup.add(bell);

  // 2. TORSO & BOW TIE (Neat jacket ending at y = 1.6, leaving pure open space between legs)
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.6, 1.6), suitMat);
  body.position.y = 3.0;
  clownGroup.add(body);

  // Bowtie
  const bowL = new THREE.Mesh(new THREE.ConeGeometry(0.6, 0.8, 4), bowtieMat);
  bowL.position.set(-0.6, 4.1, 1.0);
  bowL.rotation.z = Math.PI / 2;
  clownGroup.add(bowL);
  const bowR = new THREE.Mesh(new THREE.ConeGeometry(0.6, 0.8, 4), bowtieMat);
  bowR.position.set(0.6, 4.1, 1.0);
  bowR.rotation.z = -Math.PI / 2;
  clownGroup.add(bowR);
  const bowCenter = new THREE.Mesh(new THREE.SphereGeometry(0.3, 10, 10), polkaMat);
  bowCenter.position.set(0, 4.1, 1.05);
  clownGroup.add(bowCenter);

  // 3. ELLERİ (ARMS & 5-FINGERED WHITE GLOVED HANDS)
  const createGlovedArm = (isLeft) => {
    const armGroup = new THREE.Group();
    armGroup.name = isLeft ? "clown_arm_left" : "clown_arm_right";

    const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 1.8, 10), suitMat);
    sleeve.position.y = -0.9;
    armGroup.add(sleeve);

    const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.15, 8, 16), gloveWhiteMat);
    cuff.position.y = -1.8;
    cuff.rotation.x = Math.PI / 2;
    armGroup.add(cuff);

    const palm = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.85, 0.5), gloveWhiteMat);
    palm.position.y = -2.3;
    armGroup.add(palm);

    for (let f = 0; f < 4; f++) {
      const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.6, 8), gloveWhiteMat);
      finger.position.set(-0.3 + f * 0.2, -2.8, 0);
      armGroup.add(finger);
    }

    const thumb = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.55, 8), gloveWhiteMat);
    thumb.position.set(isLeft ? 0.45 : -0.45, -2.4, 0.2);
    thumb.rotation.z = isLeft ? -0.6 : 0.6;
    armGroup.add(thumb);

    armGroup.position.set(isLeft ? -1.6 : 1.6, 4.0, 0);
    return armGroup;
  };
  const armL = createGlovedArm(true);
  const armR = createGlovedArm(false);
  clownGroup.add(armL);
  clownGroup.add(armR);

  // 4. AYAKLARI (CLEANLY SEPARATED LEGS & GIANT FLOPPY CLOWN SHOES - NO ORANGE IN BETWEEN)
  const createClownLeg = (isLeft) => {
    const legGroup = new THREE.Group();
    legGroup.name = isLeft ? "clown_leg_left" : "clown_leg_right";

    // Clean Purple Circus Trousers
    const pant = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 1.8, 10), stripedLegMat);
    pant.position.y = -0.9;
    legGroup.add(pant);

    // GIANT FLOPPY CLOWN SHOE
    const shoeGroup = new THREE.Group();
    shoeGroup.position.set(0, -1.8, 0.5);

    // Heel / Back of shoe
    const shoeBack = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.8, 1.2), shoeRedMat);
    shoeGroup.add(shoeBack);

    // Oversized Bulbous Toe Front
    const shoeToe = new THREE.Mesh(new THREE.SphereGeometry(0.7, 14, 14), shoeRedMat);
    shoeToe.scale.set(1.1, 0.8, 1.5);
    shoeToe.position.set(0, -0.05, 0.9);
    shoeGroup.add(shoeToe);

    // Yellow Shoe Laces & Sole
    const sole = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.2, 2.4), shoeYellowMat);
    sole.position.set(0, -0.45, 0.4);
    shoeGroup.add(sole);

    legGroup.add(shoeGroup);
    // Well separated on X axis (-1.1 and +1.1) for clean, unobstructed gap
    legGroup.position.set(isLeft ? -1.1 : 1.1, 1.7, 0);
    return legGroup;
  };
  const legL = createClownLeg(true);
  const legR = createClownLeg(false);
  clownGroup.add(legL);
  clownGroup.add(legR);

  // Scale Boss to Giant Size (3.2x)
  clownGroup.scale.set(3.2, 3.2, 3.2);
  return clownGroup;
}
ruinVillagePopulated = false;

function populateRuinVillage(game) {
  if (game && game.currentLevel) ensureLevelArrays(game.currentLevel);
  const THREE = window.THREE;
  if (!game || !game.scene) return;

  console.log("🏚️ Initializing 13. Bölüm: Uzatılmış Yıkılmış Köy & Jokerooms Palyaço Boss...");

  if (game.currentLevel) {
    if (game.currentLevel.sceneGroup && game.currentLevel.sceneGroup.parent) {
      game.currentLevel.sceneGroup.parent.remove(game.currentLevel.sceneGroup);
    }
    if (game.currentLevel.mesh && game.currentLevel.mesh.parent) {
      game.currentLevel.mesh.parent.remove(game.currentLevel.mesh);
    }
  }

  const ruinGroup = new THREE.Group();
  ruinGroup.name = "ruin_village_level_mesh";
  game.scene.add(ruinGroup);

  game.currentLevel = {
    sceneGroup: ruinGroup,
    mesh: ruinGroup,
    colliders: [],
    collectibles: [],
    enemies: [],
    checkpoints: [],
    spawnPoint: new THREE.Vector3(0, 2.0, 80),
    jumpPads: [],
    warningSigns: [],
    movingPlatforms: [],
    fallingPlatforms: [],
    clownBoss: null
  };

  // Dark Burnt Sky & Dense Ash Fog
  game.scene.background = new THREE.Color(0x2d1313);
  game.scene.fog = new THREE.FogExp2(0x2a1717, 0.015);

  // Materials
  const stoneRuinMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 });
  const darkBrickMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.95 });
  const burntWoodMat = new THREE.MeshStandardMaterial({ color: 0x292524, roughness: 0.9 });
  const lavaMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.8 });
  const acidMat = new THREE.MeshStandardMaterial({ color: 0x84cc16, emissive: 0x4d7c0f, emissiveIntensity: 0.6 });

  // Helper: Create Platform
  const addPlat = (x, y, z, w, h, d, mat = stoneRuinMat) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    ruinGroup.add(mesh);
    game.currentLevel.colliders.push({
      min: new THREE.Vector3(x - w / 2, y - h / 2, z - d / 2),
      max: new THREE.Vector3(x + w / 2, y + h / 2, z + d / 2)
    });
    return mesh;
  };

  // Helper: Warning Sign Add
  const addWarningSign = (x, y, z, title, detail) => {
    const signMesh = create3DWarningSign(THREE, x, y, z, title, detail);
    ruinGroup.add(signMesh);
    game.currentLevel.warningSigns.push({
      mesh: signMesh,
      pos: new THREE.Vector3(x, y, z),
      title: title,
      detail: detail
    });
  };

  // Helper: Jump Pad / Geyser
  const addGeyser = (x, y, z, boostForce = 32) => {
    const stepRing = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.6, 0.5, 16), stoneRuinMat);
    stepRing.position.set(x, y - 0.25, z);
    ruinGroup.add(stepRing);

    const pad = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.6, 0.9, 16), lavaMat);
    pad.position.set(x, y + 0.2, z);
    ruinGroup.add(pad);

    const core = new THREE.Mesh(new THREE.SphereGeometry(1.2, 12, 12), new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
    core.position.set(x, y + 0.7, z);
    ruinGroup.add(core);

    game.currentLevel.colliders.push({
      min: new THREE.Vector3(x - 3.6, y - 0.6, z - 3.6),
      max: new THREE.Vector3(x + 3.6, y + 0.4, z + 3.6)
    });
    game.currentLevel.jumpPads.push({
      pos: new THREE.Vector3(x, y, z),
      boostForce: boostForce
    });
  };

  // -------------------------------------------------------------
  // ZONE 1: ENTRANCE ARCH & ACID SLIME SPRING (z = 90 to 40)
  // -------------------------------------------------------------
  addPlat(0, 1, 80, 20, 2, 20, stoneRuinMat);
  addWarningSign(0, 2.0, 76, "⚠️ UYARI TABELASI 1", "⚠️ UZATILMIŞ YIKILMIŞ KÖY PARKURUNA HOŞ GELDİNİZ! İLERİDE ÇÖKEN TAŞLAR VE UZUN ASİT KANYONU VAR!");

  const archL = new THREE.Mesh(new THREE.BoxGeometry(2, 8, 2), darkBrickMat);
  archL.position.set(-6, 5, 70);
  ruinGroup.add(archL);
  const archR = new THREE.Mesh(new THREE.BoxGeometry(2, 8, 2), darkBrickMat);
  archR.position.set(6, 5, 70);
  ruinGroup.add(archR);
  const archTop = new THREE.Mesh(new THREE.BoxGeometry(14, 2, 2), darkBrickMat);
  archTop.position.set(0, 9, 70);
  ruinGroup.add(archTop);

  const acidFloor = new THREE.Mesh(new THREE.BoxGeometry(300, 1, 600), acidMat);
  acidFloor.position.set(0, -6, -100);
  ruinGroup.add(acidFloor);

  addPlat(0, 1.5, 60, 6, 1.5, 6, burntWoodMat);
  addPlat(-5, 2.0, 52, 5, 1.5, 5, stoneRuinMat);
  addPlat(5, 2.5, 44, 5, 1.5, 5, stoneRuinMat);
  addPlat(0, 3.0, 36, 16, 2, 12, stoneRuinMat);

  const cp1Pos = new THREE.Vector3(0, 4.2, 36);
  const cp1Visual = createCheckpointVisual(THREE, cp1Pos);
  ruinGroup.add(cp1Visual);
  game.currentLevel.checkpoints.push({ id: 'ruin_cp_1', name: '1. Yıkık Çatılar Girişi', pos: cp1Pos, active: true, mesh: cp1Visual });

  // -------------------------------------------------------------
  // ZONE 2: SLANTED RUINED ROOFS & CHIMNEYS (z = 30 to -30)
  // -------------------------------------------------------------
  addWarningSign(0, 4.2, 32, "🚨 UYARI TABELASI 2", "🚨 DİKKAT! YIKILAN ÇATILAR VE SARKAN BACALAR! ZAMANLAMAYI İYİ AYARLA!");

  const roof1 = addPlat(-6, 5.0, 22, 12, 1.0, 10, burntWoodMat);
  roof1.rotation.z = 0.2;
  addPlat(0, 6.5, 12, 4, 1.2, 10, darkBrickMat);
  const roof2 = addPlat(6, 8.0, 2, 12, 1.0, 10, burntWoodMat);
  roof2.rotation.z = -0.2;
  addPlat(0, 9.5, -8, 5, 1.5, 5, darkBrickMat);
  addPlat(0, 11.0, -20, 18, 2, 16, stoneRuinMat);

  const cp2Pos = new THREE.Vector3(0, 12.2, -20);
  const cp2Visual = createCheckpointVisual(THREE, cp2Pos);
  ruinGroup.add(cp2Visual);
  game.currentLevel.checkpoints.push({ id: 'ruin_cp_2', name: '2. Lav Uçurumu İskelesi', pos: cp2Pos, active: false, mesh: cp2Visual });

  // -------------------------------------------------------------
  // ZONE 3: MOLTEN LAVA CHASM & LAUNCH GEYSERS (z = -30 to -140)
  // -------------------------------------------------------------
  addWarningSign(0, 12.2, -24, "⚠️ UYARI TABELASI 3", "⚠️ UYARI: UZATILMIŞ DEVASA LAV UÇURUMU! GAYZERLERİ KULLANARAK YUKARI TIRMANDIN!");

  addPlat(0, 10.8, -14, 10, 1.8, 8, stoneRuinMat);
  addGeyser(0, 12.2, -20, 32);
  addPlat(0, 14.8, -30, 12, 2.0, 10, stoneRuinMat);
  addPlat(0, 17.5, -40, 12, 2.0, 10, stoneRuinMat);
  addPlat(0, 20.0, -50, 14, 2, 14, stoneRuinMat);
  addPlat(-4, 21.5, -58, 8, 1.8, 8, stoneRuinMat);
  addPlat(-8, 23.0, -66, 8, 1.8, 8, burntWoodMat);
  addPlat(0, 24.5, -74, 10, 2.0, 10, stoneRuinMat);
  addPlat(8, 26.0, -82, 8, 1.8, 8, burntWoodMat);
  addPlat(4, 27.0, -90, 8, 1.8, 8, stoneRuinMat);
  addGeyser(4, 28.2, -90, 34);

  addPlat(-6, 31.0, -104, 10, 2.0, 10, burntWoodMat);
  addPlat(6, 33.0, -118, 10, 2.0, 10, stoneRuinMat);
  addPlat(0, 35.0, -130, 18, 2, 16, stoneRuinMat);

  const cp3Pos = new THREE.Vector3(0, 36.2, -130);
  const cp3Visual = createCheckpointVisual(THREE, cp3Pos);
  ruinGroup.add(cp3Visual);
  game.currentLevel.checkpoints.push({ id: 'ruin_cp_3', name: '3. Uzatılmış Çan Kulesi Tabanı', pos: cp3Pos, active: false, mesh: cp3Visual });

  // -------------------------------------------------------------
  // ZONE 4: TWISTED BELL TOWER & HIGH HIGHWAY (z = -140 to -260)
  // -------------------------------------------------------------
  addPlat(0, 36.5, -140, 16, 2.0, 16, stoneRuinMat);
  addPlat(0, 38.5, -150, 16, 2.0, 16, stoneRuinMat);
  addPlat(0, 40.5, -160, 18, 2.0, 16, stoneRuinMat);

  const towerCore = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 5.5, 55, 16), darkBrickMat);
  towerCore.position.set(0, 58.0, -180);
  ruinGroup.add(towerCore);

  for (let i = 0; i < 22; i++) {
    const ang = (i / 22) * Math.PI * 2.5;
    const sx = Math.cos(ang) * 9.5;
    const sz = -180 + Math.sin(ang) * 9.5;
    const sy = 37.5 + (i * 1.3);
    addPlat(sx, sy, sz, 7, 1.5, 7, stoneRuinMat);
  }

  addPlat(0, 42.0, -180, 16, 2.0, 16, stoneRuinMat);
  addPlat(0, 46.0, -192, 16, 2.0, 16, stoneRuinMat);
  addPlat(0, 50.0, -204, 16, 2.0, 16, stoneRuinMat);
  addPlat(0, 54.0, -216, 18, 2.0, 16, stoneRuinMat);
  addPlat(0, 58.0, -228, 20, 2.0, 16, stoneRuinMat);

  addPlat(0, 62.0, -240, 24, 2.5, 20, stoneRuinMat);
  addGeyser(0, 63.2, -240, 36);

  addPlat(0, 64.0, -252, 20, 2.0, 14, stoneRuinMat);
  addPlat(0, 66.0, -264, 22, 2.0, 14, stoneRuinMat);
  addPlat(0, 68.0, -276, 24, 2.0, 14, stoneRuinMat);

  // -------------------------------------------------------------
  // ZONE 5: JOKEROOMS CIRCUS GATE & BOSS ARENA (z = -280 to -380)
  // -------------------------------------------------------------
  const circusArchL = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2.0, 14, 8), darkBrickMat);
  circusArchL.position.set(-12, 73.0, -290);
  ruinGroup.add(circusArchL);
  const circusArchR = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2.0, 14, 8), darkBrickMat);
  circusArchR.position.set(12, 73.0, -290);
  ruinGroup.add(circusArchR);
  const circusArchTop = new THREE.Mesh(new THREE.BoxGeometry(26, 2.5, 3.5), lavaMat);
  circusArchTop.position.set(0, 80.0, -290);
  ruinGroup.add(circusArchTop);

  addWarningSign(0, 70.2, -286, "🤡 SON UYARI TABELASI 4", "🤡 UZATILMIŞ PARKURUN SONU: JOKEROOMS CIRCUS ARENASI! DEV PALYAÇO BOSS SENİ BEKLİYOR!");

  addPlat(0, 69.0, -290, 30, 2.5, 18, stoneRuinMat);
  const cp4Pos = new THREE.Vector3(0, 70.5, -290);
  const cp4Visual = createCheckpointVisual(THREE, cp4Pos);
  ruinGroup.add(cp4Visual);
  game.currentLevel.checkpoints.push({ id: 'ruin_cp_4', name: '4. Jokerooms Palyaço Arenası Girişi', pos: cp4Pos, active: false, mesh: cp4Visual });

  addGeyser(0, 70.5, -290, 32);

  addPlat(0, 69.0, -302, 30, 2.5, 14, stoneRuinMat);
  addPlat(0, 69.0, -316, 32, 2.5, 14, stoneRuinMat);
  addPlat(0, 68.0, -330, 34, 4.0, 14, stoneRuinMat);
  addPlat(0, 68.0, -344, 34, 4.0, 14, stoneRuinMat);

  const arenaX = 0, arenaY = 68.0, arenaZ = -370;
  addPlat(arenaX, arenaY, arenaZ, 85, 4, 85, stoneRuinMat);

  const ringMat = new THREE.MeshStandardMaterial({ color: 0x9333ea, emissive: 0x7e22ce, emissiveIntensity: 0.8 });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(34, 1.2, 12, 32), ringMat);
  ring.position.set(arenaX, arenaY + 2.1, arenaZ);
  ring.rotation.x = Math.PI / 2;
  ruinGroup.add(ring);

  if (game.playerPos) game.playerPos.set(0, 3.0, 80);
  if (game.playerVel) game.playerVel.set(0, 0, 0);

  // BOSS: JOKEROOMS DEV PALYAÇO BOSS (Same boss type & mesh!)
  const clownBossMesh = createClownBossMesh(THREE);
  const bossPos = new THREE.Vector3(arenaX, arenaY + 2.0, arenaZ);
  clownBossMesh.position.copy(bossPos);
  ruinGroup.add(clownBossMesh);

  game.currentLevel.clownBoss = {
    id: 'boss_joker_clown',
    type: 'joker_clown_boss',
    name: 'Jokerooms Dev Palyaço Boss (Elleri & Ayakları Var 🤡)',
    mesh: clownBossMesh,
    pos: bossPos,
    hp: 1000,
    maxHp: 1000,
    attackPower: 20,
    isBoss: true,
    attackCooldown: 0,
    animTimer: 0,
    deadMessageShown: false
  };
  game.currentLevel.enemies.push(game.currentLevel.clownBoss);

  if (game.callbacks && game.callbacks.onShowNotice) {
    game.callbacks.onShowNotice("🏚️ 13. Bölüm: Yıkılmış Köy! Uzatılmış zorlu parkur ve dev palyaço boss!", "success");
  }
}function teleportToRuinVillage() {
  const game = window.__superBearGame;
  if (!game || !game.scene) return;
  if (game.loadRegion) {
    game.loadRegion('ruin_village');
  } else {
    game.currentRegion = 'ruin_village';
    populateRuinVillage(game);
  }
}

// Window Event Listeners for Ruin Village
window.addEventListener('superbear:teleport-ruin-village', () => {
  teleportToRuinVillage();
});



// =========================================================================
// 🌟 14. BÖLÜM: EFSANEVİ ALTIN CENNETİ & DEV ALTIN PARA BOSSU (ELLERİ VE AYAKLARI VAR)
// =========================================================================

function createGoldCoinBoss(game, pos) {
  const THREE = window.THREE;
  const bossGroup = new THREE.Group();
  bossGroup.name = "gold_coin_boss_group";
  bossGroup.position.copy(pos);

  // Materials
  const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    metalness: 0.95,
    roughness: 0.22,
    emissive: 0x5a4100,
    emissiveIntensity: 0.25
  });
  const darkGoldMat = new THREE.MeshStandardMaterial({
    color: 0xca8a04,
    metalness: 0.9,
    roughness: 0.35
  });
  const crownGoldMat = new THREE.MeshStandardMaterial({
    color: 0xffe066,
    metalness: 0.98,
    roughness: 0.15
  });
  const rubyMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0xdc2626,
    emissiveIntensity: 0.7,
    roughness: 0.1
  });
  const sapphireMat = new THREE.MeshStandardMaterial({
    color: 0x3b82f6,
    emissive: 0x1d4ed8,
    emissiveIntensity: 0.7,
    roughness: 0.1
  });
  const diamondMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.85,
    roughness: 0.05
  });
  const eyeGlowMat = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    emissive: 0xff2222,
    emissiveIntensity: 0.95
  });

  // --- 1. MAIN COIN BODY (Standing Vertically as a Giant Circular Coin) ---
  // Cylinder standing upright along Z/Y
  const coinGeo = new THREE.CylinderGeometry(4.2, 4.2, 1.2, 32);
  coinGeo.rotateX(Math.PI / 2); // Stand upright
  const coinMesh = new THREE.Mesh(coinGeo, goldMaterial);
  coinMesh.position.y = 5.2;
  coinMesh.castShadow = true;
  bossGroup.add(coinMesh);

  // Coin Reeded Rim / Outer Border
  const rimGeo = new THREE.TorusGeometry(4.25, 0.28, 16, 32);
  const rimMesh = new THREE.Mesh(rimGeo, darkGoldMat);
  rimMesh.position.y = 5.2;
  bossGroup.add(rimMesh);

  // Front Coin Relief (Embossed 5-Pointed Star & Insignia)
  const starGeo = new THREE.CylinderGeometry(0.1, 2.2, 0.25, 5);
  starGeo.rotateX(Math.PI / 2);
  const starFront = new THREE.Mesh(starGeo, crownGoldMat);
  starFront.position.set(0, 5.2, 0.65);
  bossGroup.add(starFront);

  const starBack = new THREE.Mesh(starGeo, crownGoldMat);
  starBack.position.set(0, 5.2, -0.65);
  bossGroup.add(starBack);

  // Face on Front: Glowing Eyes & Grinning Mouth
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), eyeGlowMat);
  eyeL.position.set(-1.1, 6.0, 0.72);
  bossGroup.add(eyeL);

  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), eyeGlowMat);
  eyeR.position.set(1.1, 6.0, 0.72);
  bossGroup.add(eyeR);

  // Eyebrows
  const browL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.16, 0.1), darkGoldMat);
  browL.position.set(-1.1, 6.45, 0.75);
  browL.rotation.z = -0.3;
  bossGroup.add(browL);

  const browR = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.16, 0.1), darkGoldMat);
  browR.position.set(1.1, 6.45, 0.75);
  browR.rotation.z = 0.3;
  bossGroup.add(browR);

  // Smiling Golden Mouth
  const mouthGeo = new THREE.TorusGeometry(0.85, 0.14, 8, 16, Math.PI);
  mouthGeo.rotateZ(Math.PI);
  const mouth = new THREE.Mesh(mouthGeo, darkGoldMat);
  mouth.position.set(0, 4.4, 0.72);
  bossGroup.add(mouth);

  // --- 2. IMPERIAL RUBY CROWN (Weak point for jumping from above) ---
  const crownBase = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.0, 0.8, 16), crownGoldMat);
  crownBase.position.set(0, 9.6, 0);
  bossGroup.add(crownBase);

  // Crown Prongs & Jewels
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const px = Math.cos(angle) * 1.8;
    const pz = Math.sin(angle) * 1.8;
    
    // Prong Spike
    const prong = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.4, 8), crownGoldMat);
    prong.position.set(px, 10.4, pz);
    bossGroup.add(prong);

    // Jewel on top of prong
    const jewelGeo = new THREE.SphereGeometry(0.26, 8, 8);
    const jewelMat = i % 2 === 0 ? rubyMat : sapphireMat;
    const jewel = new THREE.Mesh(jewelGeo, jewelMat);
    jewel.position.set(px, 11.1, pz);
    bossGroup.add(jewel);
  }

  // Giant Center Diamond on Crown Peak
  const centerDiamond = new THREE.Mesh(new THREE.OctahedronGeometry(0.65, 0), diamondMat);
  centerDiamond.position.set(0, 10.8, 0);
  bossGroup.add(centerDiamond);

  // --- 3. ARMS & HANDS (ELLER & KOLLAR - Clenched Golden Gauntlets) ---
  // Left Shoulder & Arm
  const shoulderL = new THREE.Mesh(new THREE.SphereGeometry(0.85, 12, 12), crownGoldMat);
  shoulderL.position.set(-4.5, 6.2, 0);
  bossGroup.add(shoulderL);

  const armLGroup = new THREE.Group();
  armLGroup.name = "coin_arm_left";
  armLGroup.position.set(-4.5, 6.2, 0);

  const armLMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.45, 3.2, 12), goldMaterial);
  armLMesh.position.y = -1.6;
  armLGroup.add(armLMesh);

  // Clenched Golden Fist / Gauntlet
  const fistL = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.3, 1.4), darkGoldMat);
  fistL.position.y = -3.4;
  fistL.castShadow = true;
  armLGroup.add(fistL);
  bossGroup.add(armLGroup);

  // Right Shoulder & Arm
  const shoulderR = new THREE.Mesh(new THREE.SphereGeometry(0.85, 12, 12), crownGoldMat);
  shoulderR.position.set(4.5, 6.2, 0);
  bossGroup.add(shoulderR);

  const armRGroup = new THREE.Group();
  armRGroup.name = "coin_arm_right";
  armRGroup.position.set(4.5, 6.2, 0);

  const armRMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.45, 3.2, 12), goldMaterial);
  armRMesh.position.y = -1.6;
  armRGroup.add(armRMesh);

  // Clenched Golden Fist / Gauntlet
  const fistR = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.3, 1.4), darkGoldMat);
  fistR.position.y = -3.4;
  fistR.castShadow = true;
  armRGroup.add(fistR);
  bossGroup.add(armRGroup);

  // --- 4. LEGS & FEET (AYAKLAR & BACAKLAR - Armored Golden Boots) ---
  // Left Leg
  const legLGroup = new THREE.Group();
  legLGroup.name = "coin_leg_left";
  legLGroup.position.set(-1.8, 2.2, 0);

  const legLMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.5, 2.6, 12), goldMaterial);
  legLMesh.position.y = -1.1;
  legLGroup.add(legLMesh);

  // Armored Gold Boot
  const bootL = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.9, 2.2), crownGoldMat);
  bootL.position.set(0, -2.4, 0.4);
  bootL.castShadow = true;
  legLGroup.add(bootL);
  bossGroup.add(legLGroup);

  // Right Leg
  const legRGroup = new THREE.Group();
  legRGroup.name = "coin_leg_right";
  legRGroup.position.set(1.8, 2.2, 0);

  const legRMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.5, 2.6, 12), goldMaterial);
  legRMesh.position.y = -1.1;
  legRGroup.add(legRMesh);

  // Armored Gold Boot
  const bootR = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.9, 2.2), crownGoldMat);
  bootR.position.set(0, -2.4, 0.4);
  bootR.castShadow = true;
  legRGroup.add(bootR);
  bossGroup.add(legRGroup);

  // --- 5. ORBITING AURA MINI-COINS ---
  const auraRing = new THREE.Group();
  auraRing.name = "coin_aura_ring";
  auraRing.position.y = 5.2;
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const miniCoin = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.15, 16), crownGoldMat);
    miniCoin.position.set(Math.cos(angle) * 5.8, 0, Math.sin(angle) * 5.8);
    miniCoin.rotation.x = Math.PI / 2;
    miniCoin.rotation.z = angle;
    auraRing.add(miniCoin);
  }
  bossGroup.add(auraRing);

  // Shadow Light for Boss
  const bossLight = new THREE.PointLight(0xfde047, 2.5, 20);
  bossLight.position.set(0, 6, 0);
  bossGroup.add(bossLight);

  return {
    mesh: bossGroup,
    pos: pos.clone(),
    maxHp: 3000,
    hp: 3000,
    phase: 1,
    phaseAnnounced: 1,
    shockwaveTimer: 4.5,
    meteorTimer: 3.2,
    hitInvulnTimer: 0,
    attackPower: 26,
    attackCooldown: 2.2,
    meleeCooldown: 1.2,
    animTimer: 0,
    deadMessageShown: false
  };
}

function populateGoldenSanctuary(game) {
  if (game && game.currentLevel) ensureLevelArrays(game.currentLevel);
  const THREE = window.THREE;
  if (!game || !game.scene) return;

  console.log("🌟 Initializing 14. Bölüm: Efsanevi Altın Cenneti & Dev Altın Para Bossu...");

  if (game.currentLevel) {
    if (game.currentLevel.sceneGroup && game.currentLevel.sceneGroup.parent) {
      game.currentLevel.sceneGroup.parent.remove(game.currentLevel.sceneGroup);
    }
    if (game.currentLevel.mesh && game.currentLevel.mesh.parent) {
      game.currentLevel.mesh.parent.remove(game.currentLevel.mesh);
    }
  }

  const sanctuaryGroup = new THREE.Group();
  sanctuaryGroup.name = "golden_sanctuary_level_mesh";
  game.scene.add(sanctuaryGroup);

  game.currentLevel = {
    sceneGroup: sanctuaryGroup,
    mesh: sanctuaryGroup,
    colliders: [],
    collectibles: [],
    enemies: [],
    checkpoints: [],
    spawnPoint: new THREE.Vector3(0, 2.0, 90),
    jumpPads: [],
    warningSigns: [],
    movingPlatforms: [],
    fallingPlatforms: [],
    goldCoinBoss: null
  };

  // Radiant Golden Sunset & Heavenly Atmosphere
  game.scene.background = new THREE.Color(0x38220f);
  game.scene.fog = new THREE.FogExp2(0x452b14, 0.008);

  // Materials
  const polishedGoldMat = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    metalness: 0.92,
    roughness: 0.2,
    emissive: 0x713f12,
    emissiveIntensity: 0.2
  });
  const darkGoldBrickMat = new THREE.MeshStandardMaterial({
    color: 0xca8a04,
    metalness: 0.75,
    roughness: 0.4
  });
  const royalAmberMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.6,
    roughness: 0.3
  });
  const celestialCrystalMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    metalness: 0.9,
    roughness: 0.1,
    transparent: true,
    opacity: 0.85,
    emissive: 0xfacc15,
    emissiveIntensity: 0.35
  });
  const pillarWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xfef9c3,
    roughness: 0.45,
    metalness: 0.3
  });

  // Optimized High-Performance Lighting (Vastly reduced GPU shader load for 60 FPS)
  const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.6);
  sunLight.position.set(40, 80, 50);
  sanctuaryGroup.add(sunLight);

  const ambientLight = new THREE.AmbientLight(0xfef08a, 0.75);
  sanctuaryGroup.add(ambientLight);

  // 4 Strategic Key Point Lights for Atmosphere (Replaces 25+ per-object lights)
  const entranceKeyLight = new THREE.PointLight(0xf59e0b, 1.8, 45);
  entranceKeyLight.position.set(0, 16, 85);
  sanctuaryGroup.add(entranceKeyLight);

  const liftKeyLight = new THREE.PointLight(0xfacc15, 1.8, 45);
  liftKeyLight.position.set(0, 28, -40);
  sanctuaryGroup.add(liftKeyLight);

  const towerKeyLight = new THREE.PointLight(0xf59e0b, 1.8, 50);
  towerKeyLight.position.set(0, 52, -200);
  sanctuaryGroup.add(towerKeyLight);

  const colosseumKeyLight = new THREE.PointLight(0xfef08a, 2.2, 70);
  colosseumKeyLight.position.set(0, 68, -340);
  sanctuaryGroup.add(colosseumKeyLight);

  // Helper for adding solid platform colliders
  function addSolidBox(x, y, z, w, h, d, material, parent = sanctuaryGroup) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y, z);
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    parent.add(mesh);
    game.currentLevel.colliders.push({
      min: new THREE.Vector3(x - w / 2, y - h / 2, z - d / 2),
      max: new THREE.Vector3(x + w / 2, y + h / 2, z + d / 2)
    });
    return mesh;
  }

  // Helper for Golden Corinthian Pillars (Optimized: No heavy PointLight per pillar)
  function addGoldenPillar(x, y, z, height = 14, radius = 1.2) {
    const pillarGroup = new THREE.Group();
    pillarGroup.position.set(x, y, z);

    // Base
    const base = new THREE.Mesh(new THREE.BoxGeometry(radius * 2.8, 1.2, radius * 2.8), polishedGoldMat);
    base.position.y = 0.6;
    pillarGroup.add(base);

    // Shaft
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 16), pillarWhiteMat);
    shaft.position.y = height / 2 + 1.2;
    pillarGroup.add(shaft);

    // Capital (Ornate Top)
    const cap = new THREE.Mesh(new THREE.BoxGeometry(radius * 3.0, 1.4, radius * 3.0), polishedGoldMat);
    cap.position.y = height + 1.9;
    pillarGroup.add(cap);

    // Glowing Eternal Flame (Emissive mesh, zero point light lag)
    const flameMesh = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.4, 8), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
    flameMesh.position.y = height + 3.0;
    pillarGroup.add(flameMesh);

    sanctuaryGroup.add(pillarGroup);

    // Add collision for the pillar
    game.currentLevel.colliders.push({
      min: new THREE.Vector3(x - radius * 1.4, y, z - radius * 1.4),
      max: new THREE.Vector3(x + radius * 1.4, y + height + 2.5, z + radius * 1.4)
    });
  }

  // Helper for Golden Jump Pad / Geyser
  function addGoldJumpPad(x, y, z, boostForce = 35, forwardForce = -26) {
    const padGroup = new THREE.Group();
    padGroup.position.set(x, y, z);

    const padBase = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.8, 0.6, 16), darkGoldBrickMat);
    padGroup.add(padBase);

    const padCore = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.8, 16), celestialCrystalMat);
    padCore.position.y = 0.2;
    padGroup.add(padCore);

    sanctuaryGroup.add(padGroup);

    game.currentLevel.jumpPads.push({
      pos: new THREE.Vector3(x, y + 0.5, z),
      boostForce,
      forwardForce
    });
  }

  // Helper for Warning / Guidance Sign
  function addSign(x, y, z, title, detail) {
    const signGroup = new THREE.Group();
    signGroup.position.set(x, y, z);

    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.6), darkGoldBrickMat);
    post.position.y = 1.3;
    signGroup.add(post);

    const board = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.2, 0.15), polishedGoldMat);
    board.position.y = 2.2;
    signGroup.add(board);

    sanctuaryGroup.add(signGroup);

    game.currentLevel.warningSigns.push({
      pos: new THREE.Vector3(x, y, z),
      title,
      detail
    });
  }

  // Helper for Checkpoint Flag
  function addCheckpoint(x, y, z, index, name) {
    const isInitial = index === 0;
    const cpGroup = new THREE.Group();
    cpGroup.name = "checkpoint_group_gold_" + index;
    cpGroup.position.set(x, y, z);

    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 0.35, 16), darkGoldBrickMat);
    base.position.y = 0.17;
    cpGroup.add(base);

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 4.5), darkGoldBrickMat);
    pole.position.y = 2.25;
    cpGroup.add(pole);

    const flagGeo = new THREE.BoxGeometry(1.6, 1.0, 0.08);
    const flagMat = new THREE.MeshStandardMaterial({
      color: isInitial ? 0x22c55e : 0xef4444,
      emissive: isInitial ? 0x16a34a : 0xb91c1c,
      emissiveIntensity: 0.8,
      side: THREE.DoubleSide
    });
    const flag = new THREE.Mesh(flagGeo, flagMat);
    flag.name = 'flag_mesh';
    flag.userData = { isBanner: true };
    flag.position.set(0.8, 3.8, 0);
    cpGroup.add(flag);

    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), new THREE.MeshBasicMaterial({ color: isInitial ? 0x4ade80 : 0xfacc15 }));
    orb.position.set(0, 4.6, 0);
    cpGroup.add(orb);

    const cpLight = new THREE.PointLight(isInitial ? 0x22c55e : 0xef4444, 1.8, 15);
    cpLight.position.set(0, 4.2, 0);
    cpGroup.add(cpLight);

    cpGroup.userData = { banner: flag, orb: orb, light: cpLight };
    sanctuaryGroup.add(cpGroup);

    game.currentLevel.checkpoints.push({
      index,
      name,
      pos: new THREE.Vector3(x, y + 1.2, z),
      active: isInitial,
      mesh: cpGroup,
      meshGroup: cpGroup
    });
  }

  // =========================================================================
  // --- 1. AŞAMA: GİRİŞ TAPINAĞI & ALTIN SÜTUNLAR (Z: 90 -> 20) ---
  // =========================================================================
  // Başlangıç Meydanı
  addSolidBox(0, 0, 90, 16, 2.0, 16, darkGoldBrickMat);
  addCheckpoint(0, 1.0, 90, 0, "Giriş Tapınağı");
  addSign(0, 1.0, 96, "Altın Cenneti Girişi", "Göklerdeki kadim altın sarayına hoş geldin! İlerideki parkurdan Boss Arenasına ulaş!");

  // Tapınak Zafer Kapısı
  addGoldenPillar(-6, 1.0, 90, 12, 1.1);
  addGoldenPillar(6, 1.0, 90, 12, 1.1);
  addSolidBox(0, 14.5, 90, 16, 2.0, 3.5, polishedGoldMat); // Arch Beam

  // Adım Adım Yükselen Altın Basamaklar (Parkur 1)
  addSolidBox(0, 2.0, 74, 10, 1.8, 8, polishedGoldMat);
  addSolidBox(-4.5, 4.5, 60, 7, 1.8, 7, darkGoldBrickMat);
  addSolidBox(4.5, 7.0, 46, 7, 1.8, 7, polishedGoldMat);
  addSolidBox(0, 9.5, 32, 8, 1.8, 8, darkGoldBrickMat);
  addSolidBox(0, 12.0, 18, 12, 2.0, 12, polishedGoldMat);

  // 1. Zıplama Gayzeri & 2. Checkpoint
  addCheckpoint(0, 13.0, 18, 1, "Uçan Çarklar Girişi");
  addGoldJumpPad(0, 13.0, 14, 34, -28);

  // =========================================================================
  // --- 2. AŞAMA: UÇAN ALTIN ÇARKLAR & HAREKETLİ ASANSÖRLER (Z: 10 -> -50) ---
  // =========================================================================
  // Dönen Altın Platformlar ve Sütun Adaları (Karşıya Rahat Geçiş Köprüsü)
  // 1. Giriş Geçiş Sütun Adası
  addSolidBox(-7, 14.0, 6, 9, 2.0, 9, polishedGoldMat);
  addGoldenPillar(-7, 15.0, 6, 7, 0.85);

  // 2. Sol Sütun Adası
  addSolidBox(-14, 16.0, -6, 10, 2.0, 10, royalAmberMat);
  addGoldenPillar(-14, 17.0, -6, 8, 0.9);

  // 3. ORTA GEÇİŞ SÜTUN ADASI (Karşıya geçiş için eklenen sağlam orta sütun)
  addSolidBox(0, 17.5, -14, 10, 2.0, 10, darkGoldBrickMat);
  addGoldenPillar(0, 18.5, -14, 8, 0.9);

  // 4. Sağ Sütun Adası
  addSolidBox(14, 19.0, -22, 10, 2.0, 10, polishedGoldMat);
  addGoldenPillar(14, 20.0, -22, 8, 0.9);

  // 5. İleri Bağlantı Sütun Adası
  addSolidBox(7, 20.5, -30, 9, 2.0, 9, royalAmberMat);
  addGoldenPillar(7, 21.5, -30, 7, 0.85);

  // 6. Asansör Öncesi Rampa Meydanı & Kontrol Noktası
  addSolidBox(0, 22.0, -38, 12, 2.0, 12, darkGoldBrickMat);
  addCheckpoint(0, 23.0, -38, "gold_lift_prep", "Altın Asansör Meydanı");
  addGoldJumpPad(0, 23.0, -41, 32, -26);

  // Güvenli Geçiş ve Ulaşım Bloğu
  addSolidBox(0, 23.0, -49, 8, 2.0, 8, polishedGoldMat);

  // Hareketli Yatay Asansör Platformu (Z ekseninde yavaş ve dengeli gidip gelir)
  const movingPlatMesh = new THREE.Mesh(new THREE.BoxGeometry(10, 1.8, 10), polishedGoldMat);
  movingPlatMesh.position.set(0, 24.0, -65);
  sanctuaryGroup.add(movingPlatMesh);

  game.currentLevel.movingPlatforms.push({
    mesh: movingPlatMesh,
    basePos: new THREE.Vector3(0, 24.0, -65),
    startPos: new THREE.Vector3(0, 24.0, -55),
    endPos: new THREE.Vector3(0, 24.0, -75),
    currentPos: new THREE.Vector3(0, 24.0, -65),
    moveVec: new THREE.Vector3(0, 0, 10),
    w: 10,
    h: 1.8,
    d: 10,
    timer: 0,
    speed: 0.5 // Yavaşlatılmış, konforlu hız
  });

  // Karşı tarafa geçiş bloğu
  addSolidBox(0, 25.0, -81, 8, 2.0, 8, darkGoldBrickMat);

  // =========================================================================
  // --- 3. AŞAMA: KRİSTAL GÖKYÜZÜ KÖPRÜSÜ & DİKEY ASANSÖR (Z: -90 -> -160) ---
  // =========================================================================
  // Köprü Başlangıç Platformu
  addSolidBox(0, 26.0, -92, 14, 2.0, 14, darkGoldBrickMat);
  addCheckpoint(0, 27.0, -92, 2, "Kristal Gökyüzü Köprüsü");
  addGoldenPillar(-5.5, 27.0, -92, 10, 0.85);
  addGoldenPillar(5.5, 27.0, -92, 10, 0.85);

  // Kristal Köprü Dilimleri (Şeffaf Parlak Altın Yol)
  addSolidBox(0, 27.0, -112, 6, 1.4, 20, celestialCrystalMat);
  addSolidBox(-3.5, 28.5, -112, 0.6, 1.6, 20, polishedGoldMat); // Sol Korkuluk
  addSolidBox(3.5, 28.5, -112, 0.6, 1.6, 20, polishedGoldMat);  // Sağ Korkuluk

  addSolidBox(0, 29.0, -138, 10, 2.0, 10, royalAmberMat);
  addSign(0, 30.0, -135, "Dikey Altın Asansör", "Yukarıdaki Altın Kule basamaklarına çıkmak için asansöre bin!");

  // Dikey Hareketli Asansör (Y ekseninde yükselip iner)
  const vertPlatMesh = new THREE.Mesh(new THREE.BoxGeometry(7, 1.5, 7), polishedGoldMat);
  vertPlatMesh.position.set(0, 32.0, -155);
  sanctuaryGroup.add(vertPlatMesh);

  game.currentLevel.movingPlatforms.push({
    mesh: vertPlatMesh,
    basePos: new THREE.Vector3(0, 37.0, -155),
    startPos: new THREE.Vector3(0, 30.0, -155),
    endPos: new THREE.Vector3(0, 44.0, -155),
    currentPos: new THREE.Vector3(0, 37.0, -155),
    moveVec: new THREE.Vector3(0, 7.0, 0),
    w: 7,
    h: 1.5,
    d: 7,
    timer: 0,
    speed: 0.75
  });

  // =========================================================================
  // --- 4. AŞAMA: KULE BASAMAKLARI & DEV ATLAMA GAYZERİ (Z: -175 -> -260) ---
  // =========================================================================
  // Altın Kule Kaidesi
  addSolidBox(0, 44.0, -178, 16, 2.5, 16, darkGoldBrickMat);
  addCheckpoint(0, 45.5, -178, 3, "Altın Kule Zirvesi");

  // Kule Spiral Basamakları
  addSolidBox(10, 47.0, -192, 8, 1.8, 8, polishedGoldMat);
  addSolidBox(0, 50.0, -204, 8, 1.8, 8, royalAmberMat);
  addSolidBox(-10, 53.0, -216, 8, 1.8, 8, polishedGoldMat);
  addSolidBox(0, 56.0, -228, 12, 2.0, 12, darkGoldBrickMat);

  // Dev Atlatıcı (Mega Gayzer -> Arena Girişine Fırlatır)
  addSign(0, 57.0, -224, "KOLOKYUM ATLAMA RAMPASI", "Bu rampa seni doğrudan İmparator Altın Para Boss Arenasına fırlatır! Hazır ol!");
  addGoldJumpPad(0, 57.0, -230, 42, -38);

  // =========================================================================
  // --- 5. AŞAMA: KADİM ALTIN KOLOKYUM & İMPARATOR PARA BOSSU (Z: -340) ---
  // =========================================================================
  // Arena Köprüsü
  addSolidBox(0, 60.0, -285, 10, 2.0, 30, polishedGoldMat);
  addCheckpoint(0, 61.0, -272, 4, "İmparator Kolokyumu Girişi");

  // Devasa Dairesel Altın Arena Platformu (Yarıçap: 42, Y: 60, Z: -340)
  const arenaGeo = new THREE.CylinderGeometry(42, 44, 4.0, 36);
  const arenaMesh = new THREE.Mesh(arenaGeo, darkGoldBrickMat);
  arenaMesh.position.set(0, 59.0, -340);
  arenaMesh.receiveShadow = true;
  sanctuaryGroup.add(arenaMesh);

  // Arena Taban Çarpışma Kutusu
  game.currentLevel.colliders.push({
    min: new THREE.Vector3(-42, 57.0, -382),
    max: new THREE.Vector3(42, 61.2, -298)
  });

  // Arena İç Desen Çemberi
  const arenaInnerGeo = new THREE.CylinderGeometry(38, 38, 0.3, 32);
  const arenaInnerMesh = new THREE.Mesh(arenaInnerGeo, polishedGoldMat);
  arenaInnerMesh.position.set(0, 61.1, -340);
  sanctuaryGroup.add(arenaInnerMesh);

  // 12 Devasa Altın Sütun ve Meşaleler
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const px = Math.cos(angle) * 40;
    const pz = -340 + Math.sin(angle) * 40;
    addGoldenPillar(px, 61.0, pz, 16, 1.4);
  }

  // Arena Altın Hazine Sandıkları (Dekoratif ve Ödül)
  const chestPositions = [
    [-24, 61.0, -340], [24, 61.0, -340],
    [-18, 61.0, -365], [18, 61.0, -365],
    [0, 61.0, -375]
  ];
  chestPositions.forEach(([cx, cy, cz]) => {
    const chestGroup = new THREE.Group();
    chestGroup.position.set(cx, cy, cz);
    const box = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.6, 1.8), polishedGoldMat);
    box.position.y = 0.8;
    chestGroup.add(box);
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 2.4, 12, 1, false, 0, Math.PI), royalAmberMat);
    lid.rotation.z = Math.PI / 2;
    lid.position.set(0, 1.6, 0);
    chestGroup.add(lid);
    sanctuaryGroup.add(chestGroup);
  });

  // --- İMPARATOR DEV ALTIN PARA BOSSU'NU OLUŞTUR ---
  const bossData = createGoldCoinBoss(game, new THREE.Vector3(0, 61.0, -340));
  sanctuaryGroup.add(bossData.mesh);
  game.currentLevel.goldCoinBoss = bossData;

  // Başlangıçta Boss Can Barını Gizle (Yalnızca bölüm sonundaki arenaya yaklaşıldığında açılacak)
  updateGoldCoinBossHealthBar(0, bossData.maxHp);

  // Spawn Player at Start
  if (game.playerPos) {
    game.playerPos.set(0, 3.0, 90);
    if (game.playerVel) game.playerVel.set(0, 0, 0);
  }

  if (game.callbacks && game.callbacks.onShowNotice) {
    game.callbacks.onShowNotice("🌟 Efsanevi Altın Cenneti'ne Giriş Yaptın! Parkuru geçip İmparator Altın Para Bossu'nu alt et!", "success");
  }
}

function teleportToDinosaurWorld() {
  const game = window.__superBearGame;
  if (!game || !game.scene) return;
  if (game.loadRegion) {
    game.loadRegion('dinosaur_world');
  } else {
    game.currentRegion = 'dinosaur_world';
    populateDinosaurWorld(game);
  }
}
window.addEventListener('superbear:teleport-dino', () => {
  teleportToDinosaurWorld();
});
window.addEventListener('superbear:teleport-dinosaur-world', () => {
  teleportToDinosaurWorld();
});

function teleportToGoldenSanctuary() {
  const game = window.__superBearGame;
  if (!game || !game.scene) return;
  if (game.loadRegion) {
    game.loadRegion('golden_sanctuary');
  } else {
    game.currentRegion = 'golden_sanctuary';
    populateGoldenSanctuary(game);
  }
}

// Window Event Listener for Golden Sanctuary
window.addEventListener('superbear:teleport-golden-sanctuary', () => {
  teleportToGoldenSanctuary();
});

// =========================================================================
// --- 15. BÖLÜM: KARANLIK SU MAĞARASI, KÖSTEBEKLER & DEV SU EJDERHASI ---
// =========================================================================

function create3DMole(THREE, name = "Köstebek", role = "Kazıcı", options = {}) {
  const moleGroup = new THREE.Group();
  moleGroup.name = "mole_npc_" + name;

  // Dirt mound / Molehill base
  const moundGeo = new THREE.ConeGeometry(3.2, 1.4, 16);
  const moundMat = new THREE.MeshStandardMaterial({
    color: 0x3f220f,
    roughness: 0.95,
    bumpScale: 0.1
  });
  const mound = new THREE.Mesh(moundGeo, moundMat);
  mound.position.y = 0.7;
  moleGroup.add(mound);

  // Mole Body (Round Furry Cylinder/Sphere)
  const bodyGeo = new THREE.SphereGeometry(1.6, 16, 16);
  bodyGeo.scale(1.0, 1.3, 1.0);
  const furMat = new THREE.MeshStandardMaterial({
    color: 0x451a03,
    roughness: 0.9
  });
  const body = new THREE.Mesh(bodyGeo, furMat);
  body.position.y = 2.4;
  moleGroup.add(body);

  // Mole Head
  const headGroup = new THREE.Group();
  headGroup.name = "mole_head";
  headGroup.position.set(0, 3.8, 0.4);

  const headGeo = new THREE.SphereGeometry(1.1, 14, 14);
  const headMesh = new THREE.Mesh(headGeo, furMat);
  headGroup.add(headMesh);

  // Pink Snout / Nose
  const snoutGeo = new THREE.ConeGeometry(0.4, 0.7, 12);
  const snoutMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.5 });
  const snout = new THREE.Mesh(snoutGeo, snoutMat);
  snout.rotation.x = Math.PI / 2;
  snout.position.set(0, -0.1, 1.2);
  headGroup.add(snout);

  const noseTip = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
  noseTip.position.set(0, -0.1, 1.55);
  headGroup.add(noseTip);

  // Eyes (Beady black eyes)
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), eyeMat);
  eyeL.position.set(-0.45, 0.35, 0.9);
  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), eyeMat);
  eyeR.position.set(0.45, 0.35, 0.9);
  headGroup.add(eyeL);
  headGroup.add(eyeR);

  // Cute Mole Ears
  const earGeo = new THREE.SphereGeometry(0.3, 8, 8);
  const earL = new THREE.Mesh(earGeo, furMat);
  earL.position.set(-0.95, 0.6, 0.1);
  const earR = new THREE.Mesh(earGeo, furMat);
  earR.position.set(0.95, 0.6, 0.1);
  headGroup.add(earL);
  headGroup.add(earR);

  // Yellow Miner Helmet (Baret)
  const helmetGeo = new THREE.SphereGeometry(1.2, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
  const helmetMat = new THREE.MeshStandardMaterial({
    color: options.helmetColor || 0xfacc15,
    metalness: 0.4,
    roughness: 0.3
  });
  const helmet = new THREE.Mesh(helmetGeo, helmetMat);
  helmet.position.set(0, 0.35, 0);
  headGroup.add(helmet);

  const helmetRim = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.35, 0.12, 16), helmetMat);
  helmetRim.position.set(0, 0.35, 0);
  headGroup.add(helmetRim);

  // Working Miner Headlamp (Glows & Lights up Cave!)
  const lampGeo = new THREE.CylinderGeometry(0.3, 0.38, 0.4, 12);
  const lampMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8 });
  const lamp = new THREE.Mesh(lampGeo, lampMat);
  lamp.rotation.x = Math.PI / 2;
  lamp.position.set(0, 0.6, 1.2);
  headGroup.add(lamp);

  const bulbGeo = new THREE.SphereGeometry(0.24, 8, 8);
  const bulbMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9 });
  const bulb = new THREE.Mesh(bulbGeo, bulbMat);
  bulb.position.set(0, 0.6, 1.4);
  headGroup.add(bulb);

  const headlampLight = new THREE.PointLight(0x38bdf8, 2.5, 20);
  headlampLight.position.set(0, 0.6, 2.0);
  headGroup.add(headlampLight);

  moleGroup.add(headGroup);

  // Mole Digging Claws / Paws
  const clawMat = new THREE.MeshStandardMaterial({ color: 0xd6d3d1, metalness: 0.3, roughness: 0.4 });
  const pawL = new THREE.Group();
  pawL.name = "mole_paw_left";
  pawL.position.set(-1.4, 2.2, 0.8);
  const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 1.1, 8), furMat);
  armL.rotation.z = Math.PI / 4;
  pawL.add(armL);
  for (let i = -1; i <= 1; i++) {
    const claw = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.5, 6), clawMat);
    claw.rotation.x = Math.PI / 2;
    claw.position.set(i * 0.2 - 0.2, -0.4, 0.5);
    pawL.add(claw);
  }
  moleGroup.add(pawL);

  const pawR = new THREE.Group();
  pawR.name = "mole_paw_right";
  pawR.position.set(1.4, 2.2, 0.8);
  const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 1.1, 8), furMat);
  armR.rotation.z = -Math.PI / 4;
  pawR.add(armR);
  for (let i = -1; i <= 1; i++) {
    const claw = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.5, 6), clawMat);
    claw.rotation.x = Math.PI / 2;
    claw.position.set(i * 0.2 + 0.2, -0.4, 0.5);
    pawR.add(claw);
  }
  moleGroup.add(pawR);

  // Floating Indicator Tag
  const tagGeo = new THREE.PlaneGeometry(3.8, 0.9);
  const tagMat = new THREE.MeshBasicMaterial({
    color: 0x0284c7,
    transparent: true,
    opacity: 0.85,
    side: THREE.DoubleSide
  });
  const tag = new THREE.Mesh(tagGeo, tagMat);
  tag.position.set(0, 5.8, 0);
  moleGroup.add(tag);

  return {
    group: moleGroup,
    head: headGroup,
    pawL,
    pawR,
    name,
    role,
    dialogue: options.dialogue || [
      "Onu yenebilirsin, güveniyorum sana!"
    ]
  };
}

function create3DWaterDragon(game, pos) {
  const THREE = window.THREE;
  const dragonGroup = new THREE.Group();
  dragonGroup.name = "water_dragon_boss_group";
  dragonGroup.position.copy(pos);

  // Materials
  const scaleMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.7,
    roughness: 0.3,
    emissive: 0x0284c7,
    emissiveIntensity: 0.25
  });
  const underbellyMat = new THREE.MeshStandardMaterial({
    color: 0x0891b2,
    metalness: 0.4,
    roughness: 0.2,
    emissive: 0x06b6d4,
    emissiveIntensity: 0.6
  });
  const crystalMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    metalness: 0.9,
    roughness: 0.1,
    transparent: true,
    opacity: 0.85,
    emissive: 0x0284c7,
    emissiveIntensity: 0.9
  });
  const wingSkinMat = new THREE.MeshStandardMaterial({
    color: 0x0c4a6e,
    roughness: 0.5,
    transparent: true,
    opacity: 0.92,
    side: THREE.DoubleSide,
    emissive: 0x075985,
    emissiveIntensity: 0.3
  });

  // Massive Serpentine Body & Torso
  const bodyMesh = new THREE.Mesh(new THREE.SphereGeometry(4.8, 18, 18), scaleMat);
  bodyMesh.scale.set(1.0, 1.2, 1.8);
  bodyMesh.position.y = 5.0;
  dragonGroup.add(bodyMesh);

  // Underbelly plates
  const bellyMesh = new THREE.Mesh(new THREE.SphereGeometry(4.4, 16, 16), underbellyMat);
  bellyMesh.scale.set(0.85, 1.1, 1.7);
  bellyMesh.position.set(0, 4.0, 0.4);
  dragonGroup.add(bellyMesh);

  // Spines along back
  for (let i = -3; i <= 3; i++) {
    const spine = new THREE.Mesh(new THREE.ConeGeometry(0.6, 2.2, 6), crystalMat);
    spine.rotation.x = -0.3;
    spine.position.set(0, 8.5 + Math.cos(i * 0.5) * 0.5, i * 1.6);
    dragonGroup.add(spine);
  }

  // Neck & Head
  const neckGroup = new THREE.Group();
  neckGroup.name = "dragon_neck";
  neckGroup.position.set(0, 7.5, 4.0);

  const neckGeo = new THREE.CylinderGeometry(2.0, 2.8, 5.0, 12);
  const neck = new THREE.Mesh(neckGeo, scaleMat);
  neck.rotation.x = Math.PI / 4;
  neck.position.set(0, 1.8, 1.4);
  neckGroup.add(neck);

  // Dragon Head Group
  const headGroup = new THREE.Group();
  headGroup.name = "dragon_head";
  headGroup.position.set(0, 3.8, 3.4);

  const skull = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.8, 4.8), scaleMat);
  skull.position.set(0, 0, 0);
  headGroup.add(skull);

  const snout = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.0, 4.2), scaleMat);
  snout.position.set(0, -0.4, 3.5);
  headGroup.add(snout);

  // Glowing Crystal Horns
  const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.7, 4.5, 8), crystalMat);
  hornL.rotation.set(-Math.PI / 3, 0, -0.4);
  hornL.position.set(-1.8, 1.6, -1.2);
  headGroup.add(hornL);

  const hornR = new THREE.Mesh(new THREE.ConeGeometry(0.7, 4.5, 8), crystalMat);
  hornR.rotation.set(-Math.PI / 3, 0, 0.4);
  hornR.position.set(1.8, 1.6, -1.2);
  headGroup.add(hornR);

  // Glowing Eyes
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.45, 10, 10), eyeMat);
  eyeL.position.set(-1.7, 0.6, 1.8);
  headGroup.add(eyeL);
  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.45, 10, 10), eyeMat);
  eyeR.position.set(1.7, 0.6, 1.8);
  headGroup.add(eyeR);

  // Open Lower Jaw
  const jaw = new THREE.Group();
  jaw.name = "dragon_jaw";
  jaw.position.set(0, -1.2, 1.5);
  const jawMesh = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.2, 4.0), scaleMat);
  jawMesh.position.set(0, 0, 1.8);
  jaw.add(jawMesh);
  headGroup.add(jaw);

  // Inner Throat Glowing Light (Illumination source for fireballs)
  const throatLight = new THREE.PointLight(0xff6600, 4.0, 30);
  throatLight.position.set(0, -0.4, 3.8);
  headGroup.add(throatLight);

  neckGroup.add(headGroup);
  dragonGroup.add(neckGroup);

  // Massive Wings
  const wingL = new THREE.Group();
  wingL.name = "dragon_wing_left";
  wingL.position.set(-3.5, 7.5, 0);

  const wingBoneL = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.7, 18, 8), scaleMat);
  wingBoneL.rotation.z = Math.PI / 2.5;
  wingBoneL.position.set(-8.5, 3.5, 0);
  wingL.add(wingBoneL);

  const wingCanvasL = new THREE.Mesh(new THREE.PlaneGeometry(16, 12), wingSkinMat);
  wingCanvasL.rotation.x = Math.PI / 2;
  wingCanvasL.position.set(-8.5, 2.0, 3.0);
  wingL.add(wingCanvasL);
  dragonGroup.add(wingL);

  const wingR = new THREE.Group();
  wingR.name = "dragon_wing_right";
  wingR.position.set(3.5, 7.5, 0);

  const wingBoneR = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.7, 18, 8), scaleMat);
  wingBoneR.rotation.z = -Math.PI / 2.5;
  wingBoneR.position.set(8.5, 3.5, 0);
  wingR.add(wingBoneR);

  const wingCanvasR = new THREE.Mesh(new THREE.PlaneGeometry(16, 12), wingSkinMat);
  wingCanvasR.rotation.x = Math.PI / 2;
  wingCanvasR.position.set(8.5, 2.0, 3.0);
  wingR.add(wingCanvasR);
  dragonGroup.add(wingR);

  // Animated Dragon Tail
  const tailGroup = new THREE.Group();
  tailGroup.name = "dragon_tail";
  tailGroup.position.set(0, 5.0, -5.0);

  let prevTail = tailGroup;
  for (let t = 0; t < 5; t++) {
    const seg = new THREE.Group();
    seg.position.set(0, -0.4, -3.2);
    const segMesh = new THREE.Mesh(new THREE.CylinderGeometry(2.2 - t * 0.35, 2.6 - t * 0.35, 3.5, 10), scaleMat);
    segMesh.rotation.x = Math.PI / 2;
    seg.add(segMesh);

    const tailSpine = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.8, 6), crystalMat);
    tailSpine.position.set(0, 1.6, 0);
    seg.add(tailSpine);

    prevTail.add(seg);
    prevTail = seg;
  }
  dragonGroup.add(tailGroup);

  return {
    mesh: dragonGroup,
    pos: pos.clone(),
    maxHp: 45,
    hp: 45,
    phase: 1,
    phaseAnnounced: 1,
    attackCooldown: 2.4,
    animTimer: 0,
    deadMessageShown: false,
    throatLight,
    wingL,
    wingR,
    neck: neckGroup,
    head: headGroup,
    jaw,
    tail: tailGroup
  };
}

function populateWaterCave(game) {
  if (game && game.currentLevel) ensureLevelArrays(game.currentLevel);
  const THREE = window.THREE;
  if (!game || !game.scene) return;

  console.log("🌊 Initializing 15. Bölüm: Karanlık Su Mağarası, Köstebekler & Dev Su Ejderhası...");

  if (game.currentLevel) {
    if (game.currentLevel.sceneGroup && game.currentLevel.sceneGroup.parent) {
      game.currentLevel.sceneGroup.parent.remove(game.currentLevel.sceneGroup);
    }
    if (game.currentLevel.mesh && game.currentLevel.mesh.parent) {
      game.currentLevel.mesh.parent.remove(game.currentLevel.mesh);
    }
  }

  const caveGroup = new THREE.Group();
  caveGroup.name = "water_cave_level_mesh";
  game.scene.add(caveGroup);

  game.currentLevel = {
    sceneGroup: caveGroup,
    mesh: caveGroup,
    colliders: [],
    collectibles: [],
    enemies: [],
    checkpoints: [],
    spawnPoint: new THREE.Vector3(0, 4.0, 60),
    jumpPads: [],
    warningSigns: [],
    movingPlatforms: [],
    fallingPlatforms: [],
    waterBlades: [],
    moles: [],
    waterDragonBoss: null,
    illuminatingFireballs: [],
    bounds: { minX: -500, maxX: 500, minZ: -950, maxZ: 150, minY: -40, maxY: 300 }
  };

  // Atmospheric Celestial Blue Fog & Background
  game.scene.background = new THREE.Color(0x0284c7);
  game.scene.fog = new THREE.FogExp2(0x38bdf8, 0.002);

  // Materials
  const slateMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.75,
    metalness: 0.25
  });
  const darkBasaltMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.55,
    metalness: 0.45,
    emissive: 0x0369a1,
    emissiveIntensity: 0.15
  });
  const cyanCrystalMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    metalness: 0.9,
    roughness: 0.12,
    transparent: true,
    opacity: 0.92,
    emissive: 0x0284c7,
    emissiveIntensity: 0.9
  });
  const goldOreMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    metalness: 0.95,
    roughness: 0.2,
    emissive: 0xd97706,
    emissiveIntensity: 0.6
  });
  const woodPlankMat = new THREE.MeshStandardMaterial({
    color: 0x78350f,
    roughness: 0.85
  });
  const abyssalWaterMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    emissive: 0x0369a1,
    emissiveIntensity: 0.6,
    roughness: 0.08,
    metalness: 0.85,
    transparent: true,
    opacity: 0.82
  });
  const lilypadMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x059669,
    emissiveIntensity: 0.5,
    roughness: 0.35
  });

  // Cavern Ambient & Directional Lighting
  const caveAmbient = new THREE.AmbientLight(0x0284c7, 0.45);
  caveGroup.add(caveAmbient);

  const caveRimLight = new THREE.DirectionalLight(0x38bdf8, 0.75);
  caveRimLight.position.set(0, 80, -300);
  caveGroup.add(caveRimLight);

  // Subterranean Abyssal Water Floor (z: 100 -> -900, y: -10)
  const lakeGeo = new THREE.PlaneGeometry(800, 1100);
  const lakeMesh = new THREE.Mesh(lakeGeo, abyssalWaterMat);
  lakeMesh.rotation.x = -Math.PI / 2;
  lakeMesh.position.set(0, -10.0, -400);
  lakeMesh.receiveShadow = true;
  caveGroup.add(lakeMesh);

  // Stylized Architectural Platform Helper (Beveled organic rock platform with glowing crystal rim)
  function addArchitecturalPlatform(x, y, z, w, h, d, mat = darkBasaltMat, hasCrystalRim = true) {
    const platGroup = new THREE.Group();
    platGroup.position.set(x, y, z);

    // Main Rock Core
    const core = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    core.castShadow = true;
    core.receiveShadow = true;
    platGroup.add(core);

    if (hasCrystalRim) {
      // Glowing Cyan Trim on Top Edge
      const trimTop = new THREE.Mesh(new THREE.BoxGeometry(w + 0.3, 0.25, d + 0.3), cyanCrystalMat);
      trimTop.position.y = h / 2 + 0.1;
      platGroup.add(trimTop);

      // Small glowing crystal shards on corner
      const shard = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.2, 5), cyanCrystalMat);
      shard.position.set(w / 2 - 0.6, h / 2 + 0.6, d / 2 - 0.6);
      shard.rotation.z = -0.2;
      platGroup.add(shard);
    }

    caveGroup.add(platGroup);
    game.currentLevel.colliders.push({
      min: new THREE.Vector3(x - (w + 0.3) / 2, y - h / 2, z - (d + 0.3) / 2),
      max: new THREE.Vector3(x + (w + 0.3) / 2, y + h / 2 + 0.25, z + (d + 0.3) / 2)
    });
    return platGroup;
  }

  // Cylindrical Stepping Stone Platform (Organic natural cave feel)
  function addSteppingStone(x, y, z, radius = 3.5, height = 2.0, mat = slateMat) {
    const stoneGroup = new THREE.Group();
    stoneGroup.position.set(x, y, z);

    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.95, radius, height, 16), mat);
    cyl.castShadow = true;
    cyl.receiveShadow = true;
    stoneGroup.add(cyl);

    const rim = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.98, radius * 0.98, 0.2, 16), cyanCrystalMat);
    rim.position.y = height / 2 + 0.1;
    stoneGroup.add(rim);

    // Small bioluminescent mushroom / crystal accent
    const spore = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), cyanCrystalMat);
    spore.position.set(radius * 0.5, height / 2 + 0.35, 0);
    stoneGroup.add(spore);

    caveGroup.add(stoneGroup);
    game.currentLevel.colliders.push({
      min: new THREE.Vector3(x - radius, y - height / 2, z - radius),
      max: new THREE.Vector3(x + radius, y + height / 2 + 0.2, z + radius)
    });
    return stoneGroup;
  }

  // Glowing Stalactite Helper
  function addStalactite(x, y, z, height = 18, radius = 2.4) {
    const geo = new THREE.ConeGeometry(radius, height, 10);
    const mesh = new THREE.Mesh(geo, darkBasaltMat);
    mesh.rotation.x = Math.PI;
    mesh.position.set(x, y, z);
    caveGroup.add(mesh);

    // Glowing tip
    const tip = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.4, 8, 8), cyanCrystalMat);
    tip.position.set(x, y - height / 2, z);
    caveGroup.add(tip);

    const glow = new THREE.PointLight(0x38bdf8, 1.8, 22);
    glow.position.set(x, y - height / 2, z);
    caveGroup.add(glow);
  }

  // Checkpoint Helper
  function addCheckpoint(x, y, z, id, name) {
    const isInitial = id === 'start' || id === '0' || id === 0;
    const cpGroup = new THREE.Group();
    cpGroup.name = 'checkpoint_group_water_' + id;
    cpGroup.position.set(x, y, z);

    const base = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.6, 0.6, 16), darkBasaltMat);
    base.position.y = 0.3;
    cpGroup.add(base);

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 5.0, 8), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 }));
    pole.position.y = 2.5;
    cpGroup.add(pole);

    const flagMat = new THREE.MeshStandardMaterial({
      color: isInitial ? 0x22c55e : 0xef4444,
      emissive: isInitial ? 0x16a34a : 0xb91c1c,
      emissiveIntensity: 0.8,
      side: THREE.DoubleSide
    });
    const flag = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 0.08), flagMat);
    flag.name = 'flag_mesh';
    flag.userData = { isBanner: true };
    flag.position.set(0.8, 4.3, 0);
    cpGroup.add(flag);

    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.5), cyanCrystalMat);
    crystal.position.set(0, 5.2, 0);
    cpGroup.add(crystal);

    const light = new THREE.PointLight(isInitial ? 0x22c55e : 0xef4444, 1.8, 15);
    light.position.set(0, 4.5, 0);
    cpGroup.add(light);

    cpGroup.userData = { banner: flag, orb: crystal, light: light };
    caveGroup.add(cpGroup);
    game.currentLevel.checkpoints.push({
      id: 'water_cave_cp_' + id,
      name: name,
      pos: new THREE.Vector3(x, y + 1.2, z),
      active: isInitial,
      mesh: cpGroup,
      meshGroup: cpGroup
    });
  }

  // Water Geyser Jump Pad Helper
  function addWaterGeyserPad(x, y, z, jumpPower = 28, forwardPower = -20) {
    const padGroup = new THREE.Group();
    padGroup.position.set(x, y, z);

    const rim = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.45, 12, 24), darkBasaltMat);
    rim.rotation.x = Math.PI / 2;
    padGroup.add(rim);

    const waterCore = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 0.5, 16), cyanCrystalMat);
    padGroup.add(waterCore);

    const padLight = new THREE.PointLight(0x38bdf8, 3.2, 20);
    padLight.position.y = 1.2;
    padGroup.add(padLight);

    caveGroup.add(padGroup);
    game.currentLevel.jumpPads.push({
      pos: new THREE.Vector3(x, y + 0.5, z),
      jumpPower: jumpPower,
      boostForce: jumpPower,
      forwardPower: forwardPower,
      forwardForce: forwardPower
    });
  }

  // Guiding Water Gem Collectible
  function addWaterGem(x, y, z) {
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.65), cyanCrystalMat);
    gem.position.set(x, y, z);
    caveGroup.add(gem);
    game.currentLevel.collectibles.push({
      mesh: gem,
      pos: new THREE.Vector3(x, y, z),
      type: "honey",
      collected: false,
      value: 1
    });
  }

  // =========================================================================
  // --- 1. AŞAMA: KARANLIK GİRİŞ & PARILDAYAN MAĞARA GÖLETLERİ (Z: +60 -> -55) ---
  // =========================================================================
  // Başlangıç Platformu (Zarif Tapınak Avlusu)
  addArchitecturalPlatform(0, 3.0, 60, 16, 2.5, 16, darkBasaltMat, true);
  addCheckpoint(0, 4.5, 60, 1, "Karanlık Giriş Göleti");

  // Giriş Kemeri ve Fenerler
  const archL = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.2, 12, 10), darkBasaltMat);
  archL.position.set(-7, 9.0, 60);
  caveGroup.add(archL);
  const archR = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.2, 12, 10), darkBasaltMat);
  archR.position.set(7, 9.0, 60);
  caveGroup.add(archR);

  const archBeam = new THREE.Mesh(new THREE.BoxGeometry(16, 1.5, 2.5), darkBasaltMat);
  archBeam.position.set(0, 15.0, 60);
  caveGroup.add(archBeam);

  const archLantern = new THREE.PointLight(0x38bdf8, 3.0, 24);
  archLantern.position.set(0, 13.5, 60);
  caveGroup.add(archLantern);

  // [İLK PLATFORMDAN AKICI GEÇİŞ]: Doğal kavisli organik taşlar (mesafeler 5-7 birim, zıplama mükemmel)
  addSteppingStone(0, 3.2, 48, 3.8, 2.0, slateMat);
  addWaterGem(0, 5.0, 48);

  addSteppingStone(3.5, 3.6, 36, 3.6, 2.0, darkBasaltMat);
  addWaterGem(3.5, 5.4, 36);

  addSteppingStone(-3.0, 4.0, 24, 3.6, 2.0, slateMat);
  addWaterGem(-3.0, 5.8, 24);

  addSteppingStone(3.0, 4.4, 12, 3.6, 2.0, cyanCrystalMat);
  addWaterGem(3.0, 6.2, 12);

  addSteppingStone(-2.5, 4.8, 0, 3.6, 2.0, slateMat);
  addWaterGem(-2.5, 6.6, 0);

  addSteppingStone(2.5, 5.2, -12, 3.6, 2.0, darkBasaltMat);
  addWaterGem(2.5, 7.0, -12);

  addSteppingStone(0, 5.6, -24, 4.0, 2.0, cyanCrystalMat);
  addWaterGem(0, 7.4, -24);

  addSteppingStone(-3.0, 6.0, -36, 3.8, 2.0, slateMat);
  addWaterGem(-3.0, 7.8, -36);

  // 1. Dinlenme & Giriş Zirve Platformu
  addArchitecturalPlatform(0, 6.5, -50, 12, 2.2, 12, darkBasaltMat, true);

  // Sarkıtlar ve Çevre Işıkları
  addStalactite(-14, 26, 40, 20, 2.6);
  addStalactite(14, 26, 15, 22, 2.8);
  addStalactite(-12, 28, -20, 24, 3.0);
  addStalactite(12, 28, -45, 22, 2.8);

  // =========================================================================
  // --- 2. AŞAMA: YERALTI KRİSTAL ŞELALESİ & SARKIT PARKURU (Z: -65 -> -190) ---
  // =========================================================================
  // Şelale Dinlenme Kaidesi & Kontrol Noktası
  addArchitecturalPlatform(0, 7.0, -66, 12, 2.5, 12, darkBasaltMat, true);
  addCheckpoint(0, 8.5, -66, "moving_pillars_start", "Hareketli Kristal Sütunlar Önü");

  // [KULLANICI TALEBİ]: Hareketli platforma atlamayı kolaylaştıran zarif geçiş basamağı
  addSteppingStone(0, 7.5, -77, 3.4, 2.0, cyanCrystalMat);
  addWaterGem(0, 9.2, -77);

  // 1. Hareketli Kristal Platform (Geniş 8x8, şık parıltılı, hız dengeli 0.45)
  const movPlat1 = new THREE.Mesh(new THREE.BoxGeometry(8.5, 1.8, 8.5), cyanCrystalMat);
  caveGroup.add(movPlat1);
  game.currentLevel.movingPlatforms.push({
    mesh: movPlat1,
    size: new THREE.Vector3(8.5, 1.8, 8.5),
    basePos: new THREE.Vector3(0, 8.2, -90),
    currentPos: new THREE.Vector3(0, 8.2, -90),
    moveVec: new THREE.Vector3(4.5, 0, 0),
    w: 8.5, h: 1.8, d: 8.5,
    timer: 0, speed: 0.45
  });

  // Ara Dinlenme & Geçiş Sütunu
  addSteppingStone(0, 8.8, -102, 3.8, 2.0, slateMat);
  addWaterGem(0, 10.5, -102);

  // Orta Ada ve Checkpoint
  addArchitecturalPlatform(0, 9.5, -116, 12, 2.5, 12, darkBasaltMat, true);
  addCheckpoint(0, 11.0, -116, "moving_pillars_mid", "Orta Kristal Dinlenme Sütunu");

  // 2. Hareketli platforma geçiş basamağı
  addSteppingStone(0, 10.2, -128, 3.4, 2.0, cyanCrystalMat);
  addWaterGem(0, 11.8, -128);

  // 2. Hareketli Kristal Platform (Geniş 8.5x8.5)
  const movPlat2 = new THREE.Mesh(new THREE.BoxGeometry(8.5, 1.8, 8.5), cyanCrystalMat);
  caveGroup.add(movPlat2);
  game.currentLevel.movingPlatforms.push({
    mesh: movPlat2,
    size: new THREE.Vector3(8.5, 1.8, 8.5),
    basePos: new THREE.Vector3(0, 11.0, -140),
    currentPos: new THREE.Vector3(0, 11.0, -140),
    moveVec: new THREE.Vector3(-4.5, 0, 0),
    w: 8.5, h: 1.8, d: 8.5,
    timer: Math.PI / 2, speed: 0.45
  });

  // Şelale Gayzerine Geçiş Bloğu
  addSteppingStone(0, 11.8, -152, 3.8, 2.0, slateMat);
  addWaterGem(0, 13.5, -152);

  // Şelale Gayzer Kaidesi (Yükseltici Gayzer)
  addArchitecturalPlatform(0, 12.5, -164, 10, 2.0, 10, slateMat, true);
  addWaterGeyserPad(0, 13.8, -164, 28, -20);
  addSteppingStone(0, 16.5, -178, 4.2, 2.0, cyanCrystalMat);
  addWaterGem(0, 18.2, -178);

  // Şelale Zirvesi Checkpoint 2 (Zarif Kristal Teras)
  addArchitecturalPlatform(0, 19.5, -192, 16, 2.5, 16, darkBasaltMat, true);
  addCheckpoint(0, 21.0, -192, 2, "Yeraltı Kristal Şelalesi Zirvesi");

  // =========================================================================
  // --- 3. AŞAMA: KÖSTEBEKLER TÜNELİ & GİZLİ KÖSTEBEK KAMPI (Z: -200 -> -305) ---
  // =========================================================================
  // Köstebek Tüneli Giriş Parkuru (Doğal madenci taşları & raylar)
  addSteppingStone(3.5, 20.0, -206, 3.6, 2.0, cyanCrystalMat);
  addWaterGem(3.5, 21.8, -206);

  addSteppingStone(-3.0, 20.6, -218, 3.6, 2.0, slateMat);
  addWaterGem(-3.0, 22.4, -218);

  addSteppingStone(3.0, 21.2, -230, 3.6, 2.0, darkBasaltMat);
  addWaterGem(3.0, 23.0, -230);

  addSteppingStone(-2.5, 21.8, -242, 3.6, 2.0, cyanCrystalMat);
  addWaterGem(-2.5, 23.6, -242);

  addSteppingStone(0, 22.2, -254, 4.2, 2.0, slateMat);
  addWaterGem(0, 24.0, -254);

  // Maden Tüneli Giriş Kapısı
  const mineArch = new THREE.Mesh(new THREE.BoxGeometry(12, 1.2, 2.0), woodPlankMat);
  mineArch.position.set(0, 27.5, -260);
  caveGroup.add(mineArch);

  // Gizli Köstebek Köyü Kaidesi (Detaylı Maden Kampı: 34x34)
  addArchitecturalPlatform(0, 22.0, -285, 34, 3.0, 34, darkBasaltMat, true);
  addCheckpoint(0, 23.5, -285, 3, "Gizli Köstebekler Kampı & Tünel");

  // Maden Rayları & Vagon Detayları
  const railL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 26), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 }));
  railL.position.set(-4, 23.6, -285);
  caveGroup.add(railL);

  const railR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 26), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 }));
  railR.position.set(-2, 23.6, -285);
  caveGroup.add(railR);

  // Altın / Kristal Maden Vagonu
  const cart = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.4, 3.0), woodPlankMat);
  cart.position.set(-3, 24.5, -290);
  caveGroup.add(cart);

  const cartOre = new THREE.Mesh(new THREE.DodecahedronGeometry(0.9), goldOreMat);
  cartOre.position.set(-3, 25.4, -290);
  caveGroup.add(cartOre);

  // 3D KÖSTEBEKLERİ OLUŞTUR & YERLEŞTİR
  // 1. Köstebek Kaptan Kazıcı (Ana Konuşmacı NPC)
  const moleCaptain = create3DMole(THREE, "Kaptan Kazıcı", "Lider", {
    helmetColor: 0xfacc15,
    dialogue: [
      "🐾 Köstebek Kaptan Kazıcı: 'Hey Süper Ayı! Bu karanlık mağara çok derin ve tehlikeli...'",
      "🐾 Köstebek Kaptan Kazıcı: 'İlerideki Dev Su Ejderhası tüm mağarayı titretiyor!'",
      "🐾 Köstebek Kaptan Kazıcı: 'Ağzından etrafı aydınlatan alev topları fırlatıyor!'",
      "🐾 Köstebek Kaptan Kazıcı: 'Onu yenebilirsin, güveniyorum sana!'"
    ]
  });
  moleCaptain.group.position.set(0, 23.5, -280);
  caveGroup.add(moleCaptain.group);
  game.currentLevel.moles.push(moleCaptain);

  // 2. Köstebek Çekiç (Tünel Kazıcısı)
  const moleWorker1 = create3DMole(THREE, "Köstebek Çekiç", "Madenci", {
    helmetColor: 0xef4444,
    dialogue: ["🐾 Köstebek Çekiç: 'Biz tünelleri sağlamlaştırıyoruz, sen ejderhayı durdur! Güveniyoruz sana!'"]
  });
  moleWorker1.group.position.set(-9, 23.5, -292);
  moleWorker1.group.rotation.y = 0.5;
  caveGroup.add(moleWorker1.group);
  game.currentLevel.moles.push(moleWorker1);

  // 3. Köstebek Fener (Işık Gözcüsü)
  const moleWorker2 = create3DMole(THREE, "Köstebek Fener", "Gözcü", {
    helmetColor: 0x3b82f6,
    dialogue: ["🐾 Köstebek Fener: 'Ejderha alev topları fırlatınca karanlık mağara ışıldıyor! O aydınlığı kullanarak parkuru aş!'"]
  });
  moleWorker2.group.position.set(9, 23.5, -292);
  moleWorker2.group.rotation.y = -0.5;
  caveGroup.add(moleWorker2.group);
  game.currentLevel.moles.push(moleWorker2);

  // Köstebek Kamp Ateşi / Feneri
  const campLight = new THREE.PointLight(0xf59e0b, 3.8, 25);
  campLight.position.set(0, 26.0, -285);
  caveGroup.add(campLight);

  // =========================================================================
  // --- 4. AŞAMA: DÖNEN SU ÇARKALARI & BİYO-NİLÜFERLER (Z: -310 -> -430) ---
  // =========================================================================
  // Nilüfer Parkuru Giriş İskelesi
  addArchitecturalPlatform(0, 22.5, -315, 10, 2.0, 10, woodPlankMat, true);

  // Yüzen Biyolojik Nilüfer Platformları (Doğal estetik nilüfer yaprakları)
  function addLilypad(x, y, z, radius = 4.2) {
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.8, 16), lilypadMat);
    pad.position.set(x, y, z);
    pad.receiveShadow = true;
    caveGroup.add(pad);
    game.currentLevel.colliders.push({
      min: new THREE.Vector3(x - radius, y - 0.4, z - radius),
      max: new THREE.Vector3(x + radius, y + 0.4, z + radius)
    });

    const flower = new THREE.Mesh(new THREE.SphereGeometry(0.75, 8, 8), cyanCrystalMat);
    flower.position.set(x, y + 0.6, z);
    caveGroup.add(flower);

    const fLight = new THREE.PointLight(0x06b6d4, 1.8, 14);
    fLight.position.set(x, y + 1.2, z);
    caveGroup.add(fLight);
  }

  addLilypad(-5, 23.0, -332, 4.2);
  addWaterGem(-5, 24.8, -332);

  addLilypad(5, 23.5, -348, 4.2);
  addWaterGem(5, 25.3, -348);

  addLilypad(0, 24.0, -364, 4.5);
  addWaterGem(0, 25.8, -364);

  addLilypad(-5, 24.5, -380, 4.2);
  addWaterGem(-5, 26.3, -380);

  addLilypad(4, 24.8, -396, 4.2);
  addWaterGem(4, 26.6, -396);

  // Checkpoint 4 (Nilüfer Geçidi Zirve Adası)
  addArchitecturalPlatform(0, 25.0, -418, 16, 2.5, 16, darkBasaltMat, true);
  addCheckpoint(0, 26.5, -418, 4, "Biyo-Işıltılı Nilüferler Geçidi");

  // =========================================================================
  // --- 5. AŞAMA: DERİN SU UÇURUMU GAYZERLERİ & KRİSTAL KULELER (Z: -418 -> -550) ---
  // =========================================================================
  // Checkpoint 4 çıkışı bağlantı nilüferi
  addLilypad(0, 25.2, -428, 4.5);
  addWaterGem(0, 26.8, -428);

  // 1. Gayzer Başlangıç Platformu (Geniş & Rahat Basamak)
  addArchitecturalPlatform(0, 25.5, -440, 10, 2.0, 10, slateMat, true);
  addWaterGeyserPad(0, 26.8, -440, 30, -22);

  // Havada Duran Kristal Kule 1 (Geniş 12x12 Kule & Ara Basamak)
  addSteppingStone(0, 28.5, -452, 4.5, 2.0, cyanCrystalMat);
  addWaterGem(0, 30.2, -452);
  addArchitecturalPlatform(0, 25.0, -466, 12, 10.0, 12, cyanCrystalMat, true); // Üst yüzey Y = 30.0
  addWaterGeyserPad(0, 30.8, -466, 30, -22);

  // Havada Duran Kristal Kule 2 (Geniş 12x12 Kule & Ara Basamak)
  addSteppingStone(0, 31.5, -479, 4.5, 2.0, cyanCrystalMat);
  addWaterGem(0, 33.2, -479);
  addArchitecturalPlatform(0, 26.5, -494, 12, 11.0, 12, cyanCrystalMat, true); // Üst yüzey Y = 32.0
  addWaterGeyserPad(0, 32.8, -494, 30, -22);

  // Havada Duran Kristal Kule 3 (Geniş 12x12 Kule & Ara Basamak)
  addSteppingStone(0, 33.0, -507, 4.5, 2.0, cyanCrystalMat);
  addWaterGem(0, 34.8, -507);
  addArchitecturalPlatform(0, 27.5, -520, 12, 12.0, 12, slateMat, true); // Üst yüzey Y = 33.5
  addWaterGeyserPad(0, 34.3, -520, 28, -20);

  // Checkpoint 5 Geçiş Köprü Basamağı
  addSteppingStone(0, 34.5, -534, 5.0, 2.0, cyanCrystalMat);
  addWaterGem(0, 36.2, -534);

  // Uçurum Zirvesi Checkpoint 5
  addArchitecturalPlatform(0, 35.0, -548, 18, 2.5, 18, darkBasaltMat, true);
  addCheckpoint(0, 36.5, -548, 5, "Derin Su Uçurumu Zirvesi");

  // =========================================================================
  // --- 6. AŞAMA: KADİM EJDERHA MABEDİ YOLU & TÖRENSEL KÖPRÜ (Z: -548 -> -685) ---
  // =========================================================================
  // Checkpoint 5 çıkış bağlantısı
  addSteppingStone(0, 34.8, -560, 4.5, 2.0, cyanCrystalMat);
  addWaterGem(0, 36.5, -560);

  // Törensel Ejderha Köprüsü Parçaları (Geniş, güvenli ve akıcı geçiş)
  addArchitecturalPlatform(0, 34.0, -575, 14, 2.5, 24, slateMat, true);
  addWaterGem(0, 35.8, -575);

  addArchitecturalPlatform(0, 33.5, -592, 14, 2.5, 14, cyanCrystalMat, true);
  addWaterGem(0, 35.2, -592);

  addArchitecturalPlatform(0, 33.0, -608, 16, 2.5, 22, darkBasaltMat, true);
  addWaterGem(0, 34.8, -608);

  addArchitecturalPlatform(0, 32.5, -625, 16, 2.5, 14, cyanCrystalMat, true);
  addWaterGem(0, 34.2, -625);

  addArchitecturalPlatform(0, 32.0, -642, 18, 2.5, 22, slateMat, true);
  addWaterGem(0, 33.8, -642);

  addArchitecturalPlatform(0, 31.8, -659, 18, 2.5, 14, cyanCrystalMat, true);
  addWaterGem(0, 33.5, -659);

  // Kadim Ejderha Mabedi Kapısı Checkpoint 6
  addArchitecturalPlatform(0, 31.5, -675, 22, 2.5, 20, darkBasaltMat, true);
  addCheckpoint(0, 33.0, -675, 6, "Kadim Su Ejderhası Mabedi Kapısı");

  // Devasa Ejderha Kafatası Giriş Kemeri
  const gateArch = new THREE.Mesh(new THREE.TorusGeometry(9.5, 1.8, 12, 24, Math.PI), darkBasaltMat);
  gateArch.position.set(0, 32.5, -685);
  caveGroup.add(gateArch);

  // Mabed Kapısı Gayzeri (Arenaya fırlatılmak isteyenler için opsiyonel hızlı fırlatma)
  addWaterGeyserPad(0, 32.8, -685, 28, -28);

  // Meşaleler (Mavi alevli antik sütunlar)
  const torchL = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.8, 6, 8), darkBasaltMat);
  torchL.position.set(-9, 34.5, -675);
  caveGroup.add(torchL);
  const torchLightL = new THREE.PointLight(0x06b6d4, 4.0, 25);
  torchLightL.position.set(-9, 38.0, -675);
  caveGroup.add(torchLightL);

  const torchR = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.8, 6, 8), darkBasaltMat);
  torchR.position.set(9, 34.5, -675);
  caveGroup.add(torchR);
  const torchLightR = new THREE.PointLight(0x06b6d4, 4.0, 25);
  torchLightR.position.set(9, 38.0, -675);
  caveGroup.add(torchLightR);

  // =========================================================================
  // --- BOSS ARENA GEÇİŞ PLATFORMLARI & BÜYÜK EJDERHA YOLU (Z: -685 -> -740) ---
  // =========================================================================
  // 1. Kapı Çıkışı Ejderha Pisti
  addArchitecturalPlatform(0, 31.0, -696, 18, 2.5, 16, slateMat, true);
  addWaterGem(0, 32.8, -696);

  // Meşaleler 2
  const torchL2 = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.8, 6, 8), darkBasaltMat);
  torchL2.position.set(-8, 33.5, -700);
  caveGroup.add(torchL2);
  const torchLightL2 = new THREE.PointLight(0x06b6d4, 3.5, 22);
  torchLightL2.position.set(-8, 37.0, -700);
  caveGroup.add(torchLightL2);

  const torchR2 = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.8, 6, 8), darkBasaltMat);
  torchR2.position.set(8, 33.5, -700);
  caveGroup.add(torchR2);
  const torchLightR2 = new THREE.PointLight(0x06b6d4, 3.5, 22);
  torchLightR2.position.set(8, 37.0, -700);
  caveGroup.add(torchLightR2);

  // 2. Büyük Ejderha Yolu Orta Platformu
  addArchitecturalPlatform(0, 30.5, -712, 20, 2.5, 18, darkBasaltMat, true);
  addWaterGem(0, 32.2, -712);

  // 3. Arenaya Bağlanan Kristal Taç Platformu
  addArchitecturalPlatform(0, 30.0, -726, 22, 2.5, 16, slateMat, true);
  addWaterGem(0, 31.8, -726);

  // 4. Arena Giriş Eşiği (Doğrudan Arena Silindirine Kesintisiz Kilitlenen Platform)
  addArchitecturalPlatform(0, 29.5, -738, 26, 2.5, 14, cyanCrystalMat, true);
  addWaterGem(0, 31.2, -738);

  // Meşaleler 3 (Arena Giriş Kapısı)
  const torchL3 = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.0, 7, 8), darkBasaltMat);
  torchL3.position.set(-11, 33.0, -735);
  caveGroup.add(torchL3);
  const torchLightL3 = new THREE.PointLight(0x38bdf8, 4.5, 28);
  torchLightL3.position.set(-11, 37.0, -735);
  caveGroup.add(torchLightL3);

  const torchR3 = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.0, 7, 8), darkBasaltMat);
  torchR3.position.set(11, 33.0, -735);
  caveGroup.add(torchR3);
  const torchLightR3 = new THREE.PointLight(0x38bdf8, 4.5, 28);
  torchLightR3.position.set(11, 37.0, -735);
  caveGroup.add(torchLightR3);

  // =========================================================================
  // --- 7. AŞAMA: DEV SU EJDERHASI (HYDROS) BÜYÜK ARENASI (Z: -720 -> -840) ---
  // =========================================================================
  // Devasa Dairesel Abyssal Ejderha Arenası Platformu (Yarıçap: 45, Z: -780, Y: 30)
  const arenaMesh = new THREE.Mesh(new THREE.CylinderGeometry(45, 48, 4.0, 36), darkBasaltMat);
  arenaMesh.position.set(0, 29.0, -780);
  arenaMesh.receiveShadow = true;
  caveGroup.add(arenaMesh);

  // Arena Taban Çarpışma Kutusu
  game.currentLevel.colliders.push({
    min: new THREE.Vector3(-45, 27.0, -825),
    max: new THREE.Vector3(45, 31.2, -735)
  });

  // Arena İç Su Kristali Halka Deseni
  const innerRing = new THREE.Mesh(new THREE.CylinderGeometry(38, 38, 0.4, 32), cyanCrystalMat);
  innerRing.position.set(0, 31.1, -780);
  caveGroup.add(innerRing);

  // Arena Çevresi 8 Devasa Kristal Dikilitaş (Obelisk)
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const ox = Math.cos(angle) * 42;
    const oz = -780 + Math.sin(angle) * 42;

    const obelisk = new THREE.Mesh(new THREE.ConeGeometry(2.0, 18, 6), cyanCrystalMat);
    obelisk.position.set(ox, 39.0, oz);
    caveGroup.add(obelisk);

    const oLight = new THREE.PointLight(0x38bdf8, 2.5, 25);
    oLight.position.set(ox, 42.0, oz);
    caveGroup.add(oLight);
  }

  // --- DEV SU EJDERHASI BOSS'UNU OLUŞTUR ---
  const dragonBoss = create3DWaterDragon(game, new THREE.Vector3(0, 32.0, -790));
  caveGroup.add(dragonBoss.mesh);
  game.currentLevel.waterDragonBoss = dragonBoss;

  // Başlangıçta Boss Can Barını Gizle (Yalnızca bölüm sonundaki arenaya yaklaşıldığında açılacak)
  updateWaterDragonHealthBar(0, dragonBoss.maxHp);

  // Spawn Player at Start
  if (game.playerPos) {
    game.playerPos.set(0, 4.5, 60);
    if (game.playerVel) game.playerVel.set(0, 0, 0);
  }

  if (game.callbacks && game.callbacks.onShowNotice) {
    game.callbacks.onShowNotice("🌊 Karanlık Su Mağarası'na Giriş Yaptın! Köstebeklerle tanışıp Dev Su Ejderhası'nı alt et!", "success");
  }
}

function teleportToWaterCave() {
  const game = window.__superBearGame;
  if (!game || !game.scene) return;
  if (game.loadRegion) {
    game.loadRegion('water_cave');
  } else {
    game.currentRegion = 'water_cave';
    populateWaterCave(game);
  }
}

// Window Event Listener for Water Cave
window.addEventListener('superbear:teleport-water-cave', () => {
  teleportToWaterCave();
});

// =========================================================================
// --- 15. BÖLÜM: ARILARIN ÇÖLÜ & PİRAMİT LABİRENTİ & DEV TİMSAH (SOBEK) ---
// =========================================================================

function create3DDesertBee(pos, isScout = true) {
  const THREE = window.THREE;
  const beeGroup = new THREE.Group();

  const stripeYellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4, emissive: 0xca8a04, emissiveIntensity: 0.3 });
  const blackFuzzMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.8 });
  const wingMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.65, roughness: 0.1 });
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 0.8 });

  // Abdomen (Yellow with black stripes)
  const abdomen = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.75, 1.5, 12), stripeYellowMat);
  abdomen.rotation.x = Math.PI / 2;
  beeGroup.add(abdomen);

  const blackStripe1 = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.68, 0.35, 12), blackFuzzMat);
  blackStripe1.position.set(0, 0, -0.3);
  blackStripe1.rotation.x = Math.PI / 2;
  beeGroup.add(blackStripe1);

  const blackStripe2 = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.76, 0.35, 12), blackFuzzMat);
  blackStripe2.position.set(0, 0, 0.3);
  blackStripe2.rotation.x = Math.PI / 2;
  beeGroup.add(blackStripe2);

  // Stinger
  const stinger = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.7, 8), blackFuzzMat);
  stinger.position.set(0, 0, 1.05);
  stinger.rotation.x = -Math.PI / 2;
  beeGroup.add(stinger);

  // Thorax & Head
  const thorax = new THREE.Mesh(new THREE.SphereGeometry(0.65, 12, 12), blackFuzzMat);
  thorax.position.set(0, 0, -0.9);
  beeGroup.add(thorax);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.48, 12, 12), blackFuzzMat);
  head.position.set(0, 0.1, -1.5);
  beeGroup.add(head);

  // Eyes
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), eyeMat);
  eyeL.position.set(-0.32, 0.25, -1.7);
  beeGroup.add(eyeL);
  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), eyeMat);
  eyeR.position.set(0.32, 0.25, -1.7);
  beeGroup.add(eyeR);

  // Antennae
  const antL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.6, 6), blackFuzzMat);
  antL.position.set(-0.2, 0.6, -1.6);
  antL.rotation.z = -0.3;
  beeGroup.add(antL);
  const antR = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.6, 6), blackFuzzMat);
  antR.position.set(0.2, 0.6, -1.6);
  antR.rotation.z = 0.3;
  beeGroup.add(antR);

  // Wings (Translucent cyan/gold)
  const wingL = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 0.7), wingMat);
  wingL.position.set(-0.9, 0.7, -0.7);
  beeGroup.add(wingL);
  const wingR = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 0.7), wingMat);
  wingR.position.set(0.9, 0.7, -0.7);
  beeGroup.add(wingR);

  beeGroup.position.copy(pos);

  return {
    mesh: beeGroup,
    basePos: pos.clone(),
    wingL,
    wingR,
    speed: 1.5 + Math.random() * 0.8,
    hoverTimer: Math.random() * Math.PI * 2,
    patrolRadius: 3.5 + Math.random() * 2.5
  };
}

function create3DCrocodileBoss(game, pos) {
  const THREE = window.THREE;
  const crocGroup = new THREE.Group();
  crocGroup.name = "desert_crocodile_boss";

  // Materials
  const scalySkinMat = new THREE.MeshStandardMaterial({
    color: 0x166534,
    roughness: 0.65,
    metalness: 0.25
  });
  const yellowBellyMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.5,
    metalness: 0.15
  });
  const goldArmorMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    metalness: 0.85,
    roughness: 0.2,
    emissive: 0xb45309,
    emissiveIntensity: 0.4
  });
  const toothMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.2
  });
  const eyeMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0xdc2626,
    emissiveIntensity: 1.2
  });
  const cyanGemMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    emissive: 0x0891b2,
    emissiveIntensity: 1.0,
    metalness: 0.7
  });

  // 1. Massive Armored Body / Torso
  const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(6.4, 3.2, 11.0), scalySkinMat);
  bodyMesh.position.set(0, 2.2, 0);
  crocGroup.add(bodyMesh);

  const bellyMesh = new THREE.Mesh(new THREE.BoxGeometry(5.8, 1.0, 10.4), yellowBellyMat);
  bellyMesh.position.set(0, 0.8, 0);
  crocGroup.add(bellyMesh);

  // Dorsal Armored Scutes (Spikes along spine)
  for (let z = -4.5; z <= 4.5; z += 1.6) {
    const scuteL = new THREE.Mesh(new THREE.ConeGeometry(0.65, 1.4, 4), goldArmorMat);
    scuteL.position.set(-1.4, 4.2, z);
    scuteL.rotation.y = Math.PI / 4;
    crocGroup.add(scuteL);

    const scuteR = new THREE.Mesh(new THREE.ConeGeometry(0.65, 1.4, 4), goldArmorMat);
    scuteR.position.set(1.4, 4.2, z);
    scuteR.rotation.y = Math.PI / 4;
    crocGroup.add(scuteR);

    const scuteCenter = new THREE.Mesh(new THREE.ConeGeometry(0.75, 1.8, 4), goldArmorMat);
    scuteCenter.position.set(0, 4.4, z);
    scuteCenter.rotation.y = Math.PI / 4;
    crocGroup.add(scuteCenter);
  }

  // 2. Head Group & Snout
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 2.4, 6.0);
  crocGroup.add(headGroup);

  // Upper Snout
  const upperSnout = new THREE.Mesh(new THREE.BoxGeometry(4.6, 1.8, 6.4), scalySkinMat);
  upperSnout.position.set(0, 0.4, 2.6);
  headGroup.add(upperSnout);

  // Pharaoh Golden Crest / Crown on Head
  const crown = new THREE.Mesh(new THREE.BoxGeometry(4.8, 1.6, 3.2), goldArmorMat);
  crown.position.set(0, 1.8, 0.8);
  headGroup.add(crown);

  const crownGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.8), cyanGemMat);
  crownGem.position.set(0, 2.8, 1.2);
  headGroup.add(crownGem);

  // Upper Teeth (Ivory cones)
  for (let i = -2.0; i <= 2.0; i += 0.8) {
    const toothL = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.7, 6), toothMat);
    toothL.position.set(-2.1, -0.6, 1.0 + Math.abs(i) * 0.8);
    toothL.rotation.x = Math.PI;
    headGroup.add(toothL);

    const toothR = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.7, 6), toothMat);
    toothR.position.set(2.1, -0.6, 1.0 + Math.abs(i) * 0.8);
    toothR.rotation.x = Math.PI;
    headGroup.add(toothR);
  }

  // Glowing Fiery Eyes
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 12), eyeMat);
  eyeL.position.set(-1.8, 1.4, 1.6);
  headGroup.add(eyeL);

  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 12), eyeMat);
  eyeR.position.set(1.8, 1.4, 1.6);
  headGroup.add(eyeR);

  // 3. Articulated Lower Jaw (Snapping mechanism)
  const jawGroup = new THREE.Group();
  jawGroup.position.set(0, -0.4, 0.5);
  headGroup.add(jawGroup);

  const lowerJawMesh = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.2, 6.2), yellowBellyMat);
  lowerJawMesh.position.set(0, -0.4, 2.6);
  jawGroup.add(lowerJawMesh);

  // Lower Teeth
  for (let i = -1.8; i <= 1.8; i += 0.7) {
    const lToothL = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.7, 6), toothMat);
    lToothL.position.set(-2.0, 0.4, 1.2 + Math.abs(i) * 0.8);
    jawGroup.add(lToothL);

    const lToothR = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.7, 6), toothMat);
    lToothR.position.set(2.0, 0.4, 1.2 + Math.abs(i) * 0.8);
    jawGroup.add(lToothR);
  }

  // 4. Sturdy Walking Legs (Front Left, Front Right, Back Left, Back Right)
  const legs = [];
  const legPositions = [
    { x: -3.4, y: 1.5, z: 3.5 }, // FL
    { x: 3.4, y: 1.5, z: 3.5 },  // FR
    { x: -3.4, y: 1.5, z: -3.5 },// BL
    { x: 3.4, y: 1.5, z: -3.5 }  // BR
  ];

  legPositions.forEach((lPos) => {
    const legG = new THREE.Group();
    legG.position.set(lPos.x, lPos.y, lPos.z);

    const thigh = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.2, 1.8), scalySkinMat);
    thigh.position.set(0, -0.6, 0);
    legG.add(thigh);

    const foot = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.6, 2.4), goldArmorMat);
    foot.position.set(0, -1.8, 0.4);
    legG.add(foot);

    crocGroup.add(legG);
    legs.push(legG);
  });

  // 5. Multi-Segment Whipping Tail
  const tailSegments = [];
  let prevTail = crocGroup;
  let prevZ = -5.5;

  for (let s = 0; s < 4; s++) {
    const tGroup = new THREE.Group();
    tGroup.position.set(0, 2.0, s === 0 ? prevZ : -2.8);
    
    const width = 5.0 - s * 1.1;
    const tMesh = new THREE.Mesh(new THREE.BoxGeometry(width, 2.6 - s * 0.5, 3.2), scalySkinMat);
    tMesh.position.set(0, 0, -1.4);
    tGroup.add(tMesh);

    // Tail Spine
    const spine = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.5, 4), goldArmorMat);
    spine.position.set(0, 1.6 - s * 0.2, -1.4);
    spine.rotation.y = Math.PI / 4;
    tGroup.add(spine);

    prevTail.add(tGroup);
    prevTail = tGroup;
    tailSegments.push(tGroup);
  }

  crocGroup.position.copy(pos);

  return {
    mesh: crocGroup,
    pos: pos.clone(),
    hp: 50,
    maxHp: 50,
    attackPower: 18,
    isBoss: true,
    state: "patrol",
    attackCooldown: 0,
    animTimer: 0,
    phase: 1,
    jaw: jawGroup,
    legs,
    tailSegments,
    head: headGroup
  };
}

function populateBeeDesert(game) {
  if (game && game.currentLevel) ensureLevelArrays(game.currentLevel);
  const THREE = window.THREE;
  if (!game || !game.scene) return;

  console.log("🏜️ Initializing 15. Bölüm: Arıların Çölü, Antik Piramit & Dev Çöl Timsahı (Sobek)...");

  if (game.currentLevel) {
    if (game.currentLevel.sceneGroup && game.currentLevel.sceneGroup.parent) {
      game.currentLevel.sceneGroup.parent.remove(game.currentLevel.sceneGroup);
    }
    if (game.currentLevel.mesh && game.currentLevel.mesh.parent) {
      game.currentLevel.mesh.parent.remove(game.currentLevel.mesh);
    }
  }

  const desertGroup = new THREE.Group();
  desertGroup.name = "bee_desert_level_mesh";
  game.scene.add(desertGroup);

  game.currentLevel = {
    sceneGroup: desertGroup,
    mesh: desertGroup,
    colliders: [],
    collectibles: [],
    enemies: [],
    checkpoints: [],
    spawnPoint: new THREE.Vector3(0, 4.0, 60),
    jumpPads: [],
    warningSigns: [],
    movingPlatforms: [],
    spinningObstacles: [],
    bees: [],
    portals: [],
    crocodileBoss: null
  };

  // 1. Desert Atmosphere, Lighting & Sun
  game.scene.background = new THREE.Color(0xfef08a);
  game.scene.fog = new THREE.FogExp2(0xfde047, 0.0022);

  const desertSun = new THREE.DirectionalLight(0xfffbeb, 1.8);
  desertSun.position.set(60, 140, 60);
  desertSun.castShadow = true;
  desertGroup.add(desertSun);

  const desertAmbient = new THREE.AmbientLight(0xd97706, 0.85);
  desertGroup.add(desertAmbient);

  // Common Materials
  const sandstoneMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.85, metalness: 0.1 });
  const goldSandstoneMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.7, metalness: 0.25 });
  const darkSandstoneMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.9 });
  const oasisWaterMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.1, metalness: 0.6, transparent: true, opacity: 0.85 });
  const goldMetalMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9, roughness: 0.15, emissive: 0xb45309, emissiveIntensity: 0.4 });
  const cactusMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 });
  const palmTrunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
  const palmLeafMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.5 });
  const hieroglyphMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.7, emissive: 0x78350f, emissiveIntensity: 0.3 });

  function addBlock(x, y, z, w, h, d, mat) {
    if (mat) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      mesh.position.set(x, y, z);
      desertGroup.add(mesh);
    }
    if (game.currentLevel && game.currentLevel.colliders) {
      game.currentLevel.colliders.push({
        min: new THREE.Vector3(x - w / 2, y - h / 2, z - d / 2),
        max: new THREE.Vector3(x + w / 2, y + h / 2, z + d / 2)
      });
    }
  }

  function addPalmTree(px, py, pz) {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 8, 8), palmTrunkMat);
    trunk.position.set(px, py + 4, pz);
    desertGroup.add(trunk);

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const leaf = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.2, 1.2), palmLeafMat);
      leaf.position.set(px + Math.cos(angle) * 2.2, py + 8.2, pz + Math.sin(angle) * 2.2);
      leaf.rotation.y = angle;
      leaf.rotation.z = 0.35;
      desertGroup.add(leaf);
    }
  }

  function addCactus(cx, cy, cz) {
    const main = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 5, 8), cactusMat);
    main.position.set(cx, cy + 2.5, cz);
    desertGroup.add(main);

    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 2.5, 8), cactusMat);
    armL.position.set(cx - 1.2, cy + 3.0, cz);
    armL.rotation.z = Math.PI / 4;
    desertGroup.add(armL);

    const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 2.5, 8), cactusMat);
    armR.position.set(cx + 1.2, cy + 3.5, cz);
    armR.rotation.z = -Math.PI / 4;
    desertGroup.add(armR);

    // Register cactus obstacle for exact 4 damage and solid pushback
    if (game.currentLevel) {
      if (!game.currentLevel.cacti) game.currentLevel.cacti = [];
      game.currentLevel.cacti.push({
        pos: new THREE.Vector3(cx, cy + 2.5, cz),
        radius: 1.6,
        height: 5.2
      });

      // Add solid collision box so player CANNOT walk through or clip inside the cactus
      if (game.currentLevel.colliders) {
        game.currentLevel.colliders.push({
          min: new THREE.Vector3(cx - 1.1, cy, cz - 1.1),
          max: new THREE.Vector3(cx + 1.1, cy + 5.2, cz + 1.1)
        });
      }
    }
  }

  function addCheckpoint(pos, name, isInitial = false) {
    const cpGroup = new THREE.Group();
    cpGroup.name = "checkpoint_group_desert";
    cpGroup.position.copy(pos);

    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.0, 0.5, 12), goldSandstoneMat);
    base.position.set(0, 0.25, 0);
    cpGroup.add(base);

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 5.2, 8), goldMetalMat);
    pole.position.set(0, 2.7, 0);
    cpGroup.add(pole);

    const flag = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 0.08), new THREE.MeshStandardMaterial({
      color: isInitial ? 0x22c55e : 0xef4444,
      emissive: isInitial ? 0x16a34a : 0xb91c1c,
      emissiveIntensity: 0.8,
      side: THREE.DoubleSide
    }));
    flag.name = 'flag_mesh';
    flag.userData = { isBanner: true };
    flag.position.set(0.8, 4.5, 0);
    cpGroup.add(flag);

    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), new THREE.MeshBasicMaterial({ color: isInitial ? 0x4ade80 : 0xfacc15 }));
    orb.position.set(0, 5.4, 0);
    cpGroup.add(orb);

    const light = new THREE.PointLight(isInitial ? 0x22c55e : 0xef4444, 1.8, 15);
    light.position.set(0, 4.6, 0);
    cpGroup.add(light);

    cpGroup.userData = { banner: flag, orb: orb, light: light };
    desertGroup.add(cpGroup);
    game.currentLevel.checkpoints.push({
      pos: pos.clone(),
      name,
      active: isInitial,
      mesh: cpGroup,
      meshGroup: cpGroup
    });
  }

  // =========================================================================
  // --- ALAN 1: BAŞLANGIÇ VAHASI & ZORLU ÇÖL PARKURU (Z: 70 -> -360) ---
  // =========================================================================

  // 1. Oasis Starting Hub
  addBlock(0, 0, 60, 32, 4, 32, sandstoneMat);
  const oasisWater = new THREE.Mesh(new THREE.CylinderGeometry(6.5, 6.5, 0.4, 16), oasisWaterMat);
  oasisWater.position.set(-6, 2.1, 60);
  desertGroup.add(oasisWater);

  addPalmTree(-8, 2.0, 68);
  addPalmTree(8, 2.0, 68);
  addPalmTree(-10, 2.0, 52);
  addCactus(10, 2.0, 52);

  // Nomad NPC (Bedevi Gezgin)
  const nomadG = new THREE.Group();
  nomadG.position.set(6, 2.0, 56);
  const nBody = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.0, 3.0, 8), darkSandstoneMat);
  nBody.position.set(0, 1.5, 0);
  nomadG.add(nBody);
  const nHead = new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 8), new THREE.MeshStandardMaterial({ color: 0xfef08a }));
  nHead.position.set(0, 3.4, 0);
  nomadG.add(nHead);
  const nTurban = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.25, 8, 12), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
  nTurban.position.set(0, 3.6, 0);
  nTurban.rotation.x = Math.PI / 2;
  nomadG.add(nTurban);
  desertGroup.add(nomadG);

  addCheckpoint(new THREE.Vector3(0, 2.0, 60), "1. Çöl Vahası Başlangıcı");

  // 2. Comfortable Parkour Section 1 (Short Sandstone Pillars & Stepping Platforms)
  // Stepping Stone from Oasis
  addBlock(0, 1.0, 45, 6, 2, 6, sandstoneMat);

  // Pillar 1 (Kısa ve Geniş)
  addBlock(0, 1.5, 30, 8, 3.0, 8, sandstoneMat);
  addCactus(0, 3.0, 30);

  // Moving Platform 1 (Left-Right - Yavaş ve Dengeli)
  const p1Mesh = new THREE.Mesh(new THREE.BoxGeometry(7, 1.2, 7), goldSandstoneMat);
  p1Mesh.position.set(0, 3.5, 10);
  desertGroup.add(p1Mesh);
  game.currentLevel.movingPlatforms.push({
    mesh: p1Mesh,
    basePos: new THREE.Vector3(0, 3.5, 10),
    currentPos: new THREE.Vector3(0, 3.5, 10),
    moveVec: new THREE.Vector3(8, 0, 0),
    size: new THREE.Vector3(7, 1.2, 7),
    speed: 0.55,
    timer: 0
  });

  // Pillar 2 (Kısaltılmış & Rahat Zıplama)
  addBlock(-8, 2.0, -15, 7, 6.0, 7, sandstoneMat);
  addCheckpoint(new THREE.Vector3(-8, 5.2, -15), "2. Kum Sütunları & Kaktüs Kaidesi");

  // Pillar 3 (Kısaltılmış & Dengeli)
  addBlock(8, 3.0, -35, 7, 8.0, 7, sandstoneMat);

  // Moving Platform 2 (Up-Down - Yavaş ve Dengeli)
  const p2Mesh = new THREE.Mesh(new THREE.BoxGeometry(7, 1.2, 7), goldSandstoneMat);
  p2Mesh.position.set(0, 7.0, -60);
  desertGroup.add(p2Mesh);
  game.currentLevel.movingPlatforms.push({
    mesh: p2Mesh,
    basePos: new THREE.Vector3(0, 7.0, -60),
    currentPos: new THREE.Vector3(0, 7.0, -60),
    moveVec: new THREE.Vector3(0, 1.5, 0),
    size: new THREE.Vector3(7, 1.2, 7),
    speed: 0.50,
    timer: 1.0
  });

  // Pillar 4 (Kısaltılmış & Geniş Sütun - Pervane Kaldırıldı)
  const pillar4 = addBlock(0, 4.0, -90, 12, 10, 12, darkSandstoneMat);
  addCheckpoint(new THREE.Vector3(0, 9.5, -90), "3. Kum Gayzeri & Sütun Zirvesi");

  // İlerletici Geniş Bağlantı Platformları (Pervane yerine rahat geçiş yolları)
  addBlock(0, 5.0, -112, 10, 8.0, 10, sandstoneMat);
  addBlock(0, 5.0, -132, 12, 8.0, 10, goldSandstoneMat);

  // Sand Geyser Jump Pad 1 (Opsiyonel Fırlatıcı)
  const geyser1 = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.6, 0.6, 12), goldMetalMat);
  geyser1.position.set(0, 9.2, -90);
  desertGroup.add(geyser1);
  const g1Light = new THREE.PointLight(0xf59e0b, 2.5, 12);
  g1Light.position.set(0, 10.5, -90);
  desertGroup.add(g1Light);
  game.currentLevel.jumpPads.push({
    pos: new THREE.Vector3(0, 9.2, -90),
    boostForce: 20,
    forwardForce: -16
  });

  // Checkpoint 2 Island (Sfenks & Kaktüs Geçidi - Alçak ve Rahat İniş)
  addBlock(0, 4.0, -150, 26, 8, 26, sandstoneMat);
  addPalmTree(-7, 8.0, -145);
  addPalmTree(7, 8.0, -145);
  addCactus(-6, 8.0, -158);
  addCactus(6, 8.0, -158);
  addCheckpoint(new THREE.Vector3(0, 8.0, -150), "4. Sfenks & Kaktüs Geçidi");

  // Parkour Section 2 (Kısaltılmış Sütunlar & Kolay Geçişli Kum Platformları)
  addBlock(-5, 5.0, -172, 9, 8.0, 9, sandstoneMat);
  addBlock(-10, 4.5, -190, 9, 9.0, 9, sandstoneMat);
  addBlock(0, 5.0, -208, 9, 8.0, 9, goldSandstoneMat);
  addBlock(10, 5.0, -225, 9, 10.0, 9, sandstoneMat);
  addBlock(5, 5.0, -242, 9, 8.0, 9, sandstoneMat);
  addBlock(0, 5.5, -260, 10, 11.0, 10, goldSandstoneMat);
  addCheckpoint(new THREE.Vector3(0, 11.2, -260), "5. Altın Kum Sütunları Zirvesi");

  addBlock(0, 6.5, -278, 10, 9.0, 10, sandstoneMat);

  // Moving Platform 3 (Yavaş ve Dengeli)
  const p3Mesh = new THREE.Mesh(new THREE.BoxGeometry(8, 1.2, 8), goldSandstoneMat);
  p3Mesh.position.set(0, 10.5, -295);
  desertGroup.add(p3Mesh);
  game.currentLevel.movingPlatforms.push({
    mesh: p3Mesh,
    basePos: new THREE.Vector3(0, 10.5, -295),
    currentPos: new THREE.Vector3(0, 10.5, -295),
    moveVec: new THREE.Vector3(5, 1.0, 0),
    size: new THREE.Vector3(8, 1.2, 8),
    speed: 0.50,
    timer: 0
  });

  addBlock(0, 5.5, -315, 12, 8.0, 12, goldSandstoneMat);

  // Checkpoint 3 (Büyük Piramit Ön Meydanı)
  addBlock(0, 0, -350, 50, 8, 40, sandstoneMat);
  addPalmTree(-18, 4.0, -345);
  addPalmTree(18, 4.0, -345);
  addCheckpoint(new THREE.Vector3(0, 4.0, -340), "6. Büyük Piramit Ön Meydanı");

  // Add Flying Bee Scouts in Canyon (Alçaltılmış uçuş irtifası)
  const beePositions = [
    new THREE.Vector3(0, 5.0, 20),
    new THREE.Vector3(-8, 7.0, -20),
    new THREE.Vector3(8, 9.0, -45),
    new THREE.Vector3(0, 11.0, -110),
    new THREE.Vector3(-10, 12.0, -200),
    new THREE.Vector3(10, 13.0, -240),
    new THREE.Vector3(0, 6.0, -330)
  ];
  beePositions.forEach(bPos => {
    const bee = create3DDesertBee(bPos);
    desertGroup.add(bee.mesh);
    game.currentLevel.bees.push(bee);
  });

  // =========================================================================
  // --- ALAN 2: DEVASA ANTİK PİRAMİT & GİRİŞ KAPISI (Z: -360 -> -520) ---
  // =========================================================================

  // Stepped Pyramid Structure (6 Grand Tiers)
  const pyramidTiers = [
    { size: 90, h: 8, y: 4.0 },
    { size: 76, h: 8, y: 12.0 },
    { size: 62, h: 8, y: 20.0 },
    { size: 48, h: 8, y: 28.0 },
    { size: 34, h: 8, y: 36.0 },
    { size: 20, h: 8, y: 44.0 }
  ];

  pyramidTiers.forEach((tier, idx) => {
    const pMesh = new THREE.Mesh(new THREE.BoxGeometry(tier.size, tier.h, tier.size), idx % 2 === 0 ? sandstoneMat : goldSandstoneMat);
    pMesh.position.set(0, tier.y, -440);
    desertGroup.add(pMesh);
    game.currentLevel.colliders.push({
      min: new THREE.Vector3(-tier.size / 2, tier.y - tier.h / 2, -440 - tier.size / 2),
      max: new THREE.Vector3(tier.size / 2, tier.y + tier.h / 2, -440 + tier.size / 2)
    });
  });

  // Golden Apex (Pyramidion)
  const apex = new THREE.Mesh(new THREE.ConeGeometry(10, 14, 4), goldMetalMat);
  apex.position.set(0, 55.0, -440);
  apex.rotation.y = Math.PI / 4;
  desertGroup.add(apex);

  const apexLight = new THREE.PointLight(0xfacc15, 3.5, 40);
  apexLight.position.set(0, 58.0, -440);
  desertGroup.add(apexLight);

  // Grand Front Entrance Facade (Z: -385)
  const archL = new THREE.Mesh(new THREE.BoxGeometry(4, 14, 6), darkSandstoneMat);
  archL.position.set(-6, 7.0, -385);
  desertGroup.add(archL);

  const archR = new THREE.Mesh(new THREE.BoxGeometry(4, 14, 6), darkSandstoneMat);
  archR.position.set(6, 7.0, -385);
  desertGroup.add(archR);

  const archTop = new THREE.Mesh(new THREE.BoxGeometry(16, 4, 6), goldSandstoneMat);
  archTop.position.set(0, 14.0, -385);
  desertGroup.add(archTop);

  // Entrance Guardian Sphinx Statues
  const sphinxL = new THREE.Mesh(new THREE.BoxGeometry(3.5, 6.0, 7.0), goldSandstoneMat);
  sphinxL.position.set(-14, 3.0, -375);
  desertGroup.add(sphinxL);

  const sphinxR = new THREE.Mesh(new THREE.BoxGeometry(3.5, 6.0, 7.0), goldSandstoneMat);
  sphinxR.position.set(14, 3.0, -375);
  desertGroup.add(sphinxR);

  // Glowing Entrance Portal into the Pyramid Labyrinth Dimension
  const entPortalMesh = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.6, 12, 24), new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    emissive: 0xd97706,
    emissiveIntensity: 1.8
  }));
  entPortalMesh.position.set(0, 5.0, -388);
  desertGroup.add(entPortalMesh);

  const entPortalLight = new THREE.PointLight(0xf59e0b, 3.0, 20);
  entPortalLight.position.set(0, 5.0, -388);
  desertGroup.add(entPortalLight);

  // Register Entrance Portal (Teleports to Labyrinth Chamber 1 at Z: -565)
  game.currentLevel.portals.push({
    pos: new THREE.Vector3(0, 4.0, -388),
    targetPos: new THREE.Vector3(0, 14.0, -565),
    message: "🏛️ Antik Piramit İçindeki Gizemli Labirente Giriş Yaptın!"
  });

  // =========================================================================
  // --- ALAN 3: PİRAMİTİN ARKASINDAKİ ÇIKIŞ GÖSTERGESİ (Z: -530) ---
  // (Kullanıcı Talebi: Yönü bulamıyorlarsa piramitin arkasında çıkış gösterilsin)
  // =========================================================================

  addBlock(0, 0, -530, 36, 6, 24, sandstoneMat);

  // Illuminated Hieroglyphic Billboard & Guidance Sign
  const guideBoard = new THREE.Mesh(new THREE.BoxGeometry(16, 8, 1.2), hieroglyphMat);
  guideBoard.position.set(0, 7.0, -530);
  desertGroup.add(guideBoard);

  const guideFrame = new THREE.Mesh(new THREE.BoxGeometry(17.2, 9.2, 0.8), goldMetalMat);
  guideFrame.position.set(0, 7.0, -530.2);
  desertGroup.add(guideFrame);

  // Glowing Directional Arrows
  const arrow1 = new THREE.Mesh(new THREE.ConeGeometry(1.6, 3.5, 4), goldMetalMat);
  arrow1.position.set(-5.0, 7.0, -528.8);
  arrow1.rotation.z = -Math.PI / 2;
  desertGroup.add(arrow1);

  const arrow2 = new THREE.Mesh(new THREE.ConeGeometry(1.6, 3.5, 4), goldMetalMat);
  arrow2.position.set(5.0, 7.0, -528.8);
  arrow2.rotation.z = -Math.PI / 2;
  desertGroup.add(arrow2);

  const guideLight = new THREE.PointLight(0xfacc15, 3.5, 25);
  guideLight.position.set(0, 8.0, -526);
  desertGroup.add(guideLight);

  // Direct Bypass Portal for players who explore behind the pyramid
  const bypassPortalMesh = new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.5, 12, 24), new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    emissive: 0x16a34a,
    emissiveIntensity: 1.5
  }));
  bypassPortalMesh.position.set(0, 4.0, -536);
  desertGroup.add(bypassPortalMesh);

  addCheckpoint(new THREE.Vector3(0, 3.5, -525), "7. Piramit Arkası Rehber & Gizli Geçit");

  // Register Bypass Portal directly to Boss Arena (Z: -825)
  game.currentLevel.portals.push({
    pos: new THREE.Vector3(0, 4.0, -536),
    targetPos: new THREE.Vector3(0, 4.0, -825),
    message: "🧭 Piramit Arkası Gizli Çıkış Geçidi: Doğrudan Timsah Arenası'na Geçtin!"
  });

  // =========================================================================
  // --- ALAN 4: PİRAMİT İÇİ ANTİK LABİRENT BOYUTU (Z: -560 -> -785, Y: 12 -> 24) ---
  // =========================================================================

  // Labyrinth Floor Base
  addBlock(0, 10.0, -675, 70, 4, 230, darkSandstoneMat);
  // Labyrinth Ceiling
  addBlock(0, 26.0, -675, 70, 2, 230, sandstoneMat);

  // Outer Walls
  addBlock(-34, 18.0, -675, 2, 16, 230, sandstoneMat);
  addBlock(34, 18.0, -675, 2, 16, 230, sandstoneMat);
  addBlock(0, 18.0, -560, 68, 16, 2, sandstoneMat);
  addBlock(0, 18.0, -790, 68, 16, 2, sandstoneMat);

  // Internal Labyrinth Maze Walls (Twisting Corridors with Guidance Signs)
  // Wall 1: Center Divider
  addBlock(0, 18.0, -600, 36, 16, 3, sandstoneMat);
  // Wall 2: Left Corridor
  addBlock(-16, 18.0, -640, 3, 16, 70, sandstoneMat);
  // Wall 3: Right Corridor
  addBlock(16, 18.0, -670, 3, 16, 80, sandstoneMat);
  // Wall 4: Turning Baffle
  addBlock(-4, 18.0, -710, 26, 16, 3, sandstoneMat);
  // Wall 5: Exit Corridor Divider
  addBlock(8, 18.0, -750, 3, 16, 50, sandstoneMat);

  // Labyrinth Midpoint Checkpoint
  addCheckpoint(new THREE.Vector3(0, 12.0, -675), "8. Piramit İçi Labirent Kalbi");

  // Labyrinth Torches & Illuminated Guides
  const torchPositions = [
    new THREE.Vector3(0, 16.0, -575),
    new THREE.Vector3(-14, 16.0, -610),
    new THREE.Vector3(14, 16.0, -640),
    new THREE.Vector3(-14, 16.0, -680),
    new THREE.Vector3(6, 16.0, -720),
    new THREE.Vector3(0, 16.0, -760)
  ];
  torchPositions.forEach((tPos) => {
    const tMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 3.0, 8), goldMetalMat);
    tMesh.position.copy(tPos);
    desertGroup.add(tMesh);

    const tLight = new THREE.PointLight(0xf59e0b, 2.8, 22);
    tLight.position.set(tPos.x, tPos.y + 1.8, tPos.z);
    desertGroup.add(tLight);
  });

  // Labyrinth Bee Guards
  const labBees = [
    new THREE.Vector3(12, 16.0, -620),
    new THREE.Vector3(-12, 16.0, -690),
    new THREE.Vector3(0, 16.0, -740)
  ];
  labBees.forEach(bPos => {
    const bee = create3DDesertBee(bPos);
    desertGroup.add(bee.mesh);
    game.currentLevel.bees.push(bee);
  });

  // Checkpoint 9 (Piramit Labirenti Çıkış Kapısı)
  addCheckpoint(new THREE.Vector3(0, 12.0, -775), "9. Piramit Labirenti Çıkış Kapısı");

  // Labyrinth Exit Sand Geyser Jump Pad
  const labGeyser = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 3.0, 0.8, 12), goldMetalMat);
  labGeyser.position.set(0, 12.4, -775);
  desertGroup.add(labGeyser);
  game.currentLevel.jumpPads.push({
    pos: new THREE.Vector3(0, 12.4, -775),
    boostForce: 20,
    forwardForce: -10
  });

  // Labyrinth Exit Portal (Teleports to Boss Oasis Arena at Z: -825)
  const exitPortalMesh = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.6, 12, 24), new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 1.8
  }));
  exitPortalMesh.position.set(0, 14.0, -786);
  desertGroup.add(exitPortalMesh);

  const exitPortalLight = new THREE.PointLight(0x38bdf8, 3.0, 20);
  exitPortalLight.position.set(0, 14.0, -786);
  desertGroup.add(exitPortalLight);

  game.currentLevel.portals.push({
    pos: new THREE.Vector3(0, 12.0, -785),
    targetPos: new THREE.Vector3(0, 4.0, -825),
    message: "☀️ Piramit Labirentini Başarıyla Geçtin! Karşında Dev Timsah Arenası!"
  });

  // =========================================================================
  // --- ALAN 5: PİRAMİT ARDI VAHA & DEV TİMSAH BOSS (SOBEK) ARENASI (Z: -820 -> -960) ---
  // =========================================================================

  // Checkpoint 10: Timsah Boss Vaha Arenası Girişi
  addCheckpoint(new THREE.Vector3(0, 4.2, -835), "10. Vaha Timsah Arenası Girişi");

  // Massive Circular Oasis Arena Ground (Radius: 60)
  const arenaMesh = new THREE.Mesh(new THREE.CylinderGeometry(60, 64, 8, 32), sandstoneMat);
  arenaMesh.position.set(0, 0, -890);
  desertGroup.add(arenaMesh);
  game.currentLevel.colliders.push({
    min: new THREE.Vector3(-60, -4.0, -950),
    max: new THREE.Vector3(60, 4.0, -830)
  });

  // Central Oasis Water Basin
  const bossPool = new THREE.Mesh(new THREE.CylinderGeometry(26, 26, 0.4, 24), oasisWaterMat);
  bossPool.position.set(0, 4.1, -890);
  desertGroup.add(bossPool);

  // Surrounding Palm Trees & Ancient Obelisks
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const ox = Math.cos(angle) * 48;
    const oz = -890 + Math.sin(angle) * 48;

    addPalmTree(ox, 4.0, oz);

    const obelisk = new THREE.Mesh(new THREE.ConeGeometry(2.4, 20, 4), goldSandstoneMat);
    obelisk.position.set(Math.cos(angle + 0.3) * 52, 14.0, -890 + Math.sin(angle + 0.3) * 52);
    obelisk.rotation.y = Math.PI / 4;
    desertGroup.add(obelisk);

    const oLight = new THREE.PointLight(0xf59e0b, 2.5, 25);
    oLight.position.set(Math.cos(angle + 0.3) * 52, 20.0, -890 + Math.sin(angle + 0.3) * 52);
    desertGroup.add(oLight);
  }

  // --- DEV ÇÖL TİMSAHI BOSS (SOBEK) OLUŞTUR ---
  const crocodileBoss = create3DCrocodileBoss(game, new THREE.Vector3(0, 4.0, -890));
  desertGroup.add(crocodileBoss.mesh);
  game.currentLevel.crocodileBoss = crocodileBoss;

  // Başlangıçta can barını gizle
  updateDesertCrocodileHealthBar(0, crocodileBoss.maxHp);

  // Spawn Player at Start Oasis
  if (game.playerPos) {
    game.playerPos.set(0, 4.5, 60);
    if (game.playerVel) game.playerVel.set(0, 0, 0);
  }

  if (game.callbacks && game.callbacks.onShowNotice) {
    game.callbacks.onShowNotice("🏜️ 15. Bölüm: Arıların Çölü'ne Giriş Yaptın! Parkurları aşıp Piramit ve Dev Timsah'a ulaş!", "success");
  }
}

function teleportToBeeDesert() {
  const game = window.__superBearGame;
  if (!game || !game.scene) return;
  if (game.loadRegion) {
    game.loadRegion('bee_desert');
  } else {
    game.currentRegion = 'bee_desert';
    populateBeeDesert(game);
  }
}

// Window Event Listener for Bee Desert
window.addEventListener('superbear:teleport-bee-desert', () => {
  teleportToBeeDesert();
});

function enhanceGame() {
  const game = window.__superBearGame;
  if (!game || !game.scene || !window.THREE) {
    setTimeout(enhanceGame, 500);
    return;
  }

  // Hook damageEnemy to enforce exact 15 damage for minion dinos and restrict portal spawn to boss defeat only
  if (game.damageEnemy && !game._damageEnemyHooked) {
      game._damageEnemyHooked = true;
      const originalDamageEnemy = game.damageEnemy.bind(game);
      game.damageEnemy = function(enemy, damage) {
          if (enemy && enemy.type === 'dino_minion') {
              damage = 15;
          }
          const originalSpawnPortal = game.spawnBossPortalForCurrentRegion;
          if (enemy && !enemy.isBoss) {
              game.spawnBossPortalForCurrentRegion = function() {};
          }
          try {
              originalDamageEnemy(enemy, damage);
          } finally {
              game.spawnBossPortalForCurrentRegion = originalSpawnPortal;
          }
      };
  }

  // Prevent enemies/bosses from pushing the player around with knockback
  if (game.damagePlayer && !game._damagePlayerHooked) {
      game._damagePlayerHooked = true;
      const originalDamagePlayer = game.damagePlayer.bind(game);
      game.damagePlayer = function(amount) {
          const oldVx = game.playerVel ? game.playerVel.x : 0;
          const oldVz = game.playerVel ? game.playerVel.z : 0;
          originalDamagePlayer(amount);
          if (game.playerVel) {
              game.playerVel.x = oldVx;
              game.playerVel.z = oldVz;
          }
      };
  }

  // Add solid enemy collision so player cannot pass through them and they don't push player
  if (game.update && !game._enemyCollisionHooked) {
      game._enemyCollisionHooked = true;
      const originalUpdate = game.update.bind(game);
      game.update = function(dt, time) {
          originalUpdate(dt, time);
          if (game.currentLevel && game.currentLevel.enemies && game.playerPos) {
              ((game.currentLevel && game.currentLevel.enemies) || []).forEach(enemy => {
                  if (enemy.hp > 0 && enemy.pos) {
                      const dist = enemy.pos.distanceTo(game.playerPos);
                      const minDist = enemy.isBoss ? 4.5 : 2.2;
                      if (dist < minDist) {
                          const pushDir = game.playerPos.clone().sub(enemy.pos);
                          pushDir.y = 0;
                          if (pushDir.lengthSq() > 0.001) {
                              pushDir.normalize();
                              game.playerPos.add(pushDir.multiplyScalar((minDist - dist) * 0.25));
                          }
                      }
                  }
              });
          }
      };
  }

  gameRef = game;
  console.log("🎮 Game Instance Found! Applying 3D Drawings Features...");

  buildSpaceGalaxyWorld(game.scene);
  updateSpaceLoop();

  // Jump helper function
function triggerJump() {
  const game = window.__superBearGame;
  if (game) {
    if (typeof game.handleJump === 'function') {
      game.handleJump();
      return;
    }
    if (game.inputs) {
      game.inputs.jump = true;
      setTimeout(() => {
        if (game && game.inputs) game.inputs.jump = false;
      }, 60);
    }
  }
  try {
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', key: ' ' }));
    setTimeout(() => {
      window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space', key: ' ' }));
    }, 60);
  } catch(err) {}
}

function triggerEmote(type) {
  const game = window.__superBearGame;
  if (!game) return;
  const pPos = game.playerPos;
  if (!pPos) return;
  const bear = game.playerBear;

  // Ensure game has emote update patch if not already present
  if (!game.__emotePatched && game.update) {
    game.__emotePatched = true;
    const origUpdate = game.update;
    game.update = function(dt, time) {
      origUpdate.call(this, dt, time);
      if (this.activeEmote && this.playerBear && this.playerBear.root) {
        this.activeEmote.timer -= dt;
        const bearRoot = this.playerBear.root;
        const eType = this.activeEmote.type;
        
        if (eType === 'laugh') {
          bearRoot.rotation.x = Math.sin(time * 20) * 0.15;
          bearRoot.position.y = this.playerPos.y + Math.abs(Math.sin(time * 15)) * 0.3;
        } else if (eType === 'dance') {
          bearRoot.rotation.y = this.playerRotY + Math.sin(time * 12) * 1.2;
          bearRoot.position.y = this.playerPos.y + Math.abs(Math.sin(time * 12)) * 0.5;
        } else if (eType === 'sleep') {
          bearRoot.rotation.z = Math.PI / 2;
          bearRoot.position.y = this.playerPos.y + 0.15;
          if (!bear.pillowMesh && game.scene) {
            const pillowGroup = new THREE.Group();
            const pillowGeo = new THREE.BoxGeometry(0.8, 0.25, 0.6);
            const pillowMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.8 });
            const pMesh = new THREE.Mesh(pillowGeo, pillowMat);
            pillowGroup.add(pMesh);
            pillowGroup.position.set(0, 0.2, 0.6);
            bearRoot.add(pillowGroup);
            bear.pillowMesh = pillowGroup;
          } else if (bear.pillowMesh) {
            bear.pillowMesh.visible = true;
          }
        } else if (eType === 'star') {
          bearRoot.rotation.y += dt * 4;
          bearRoot.position.y = this.playerPos.y + Math.abs(Math.sin(time * 12)) * 0.7;
        } else if (eType === 'ghost') {
          bearRoot.position.y = this.playerPos.y + 0.5 + Math.sin(time * 6) * 0.4;
          bearRoot.rotation.z = Math.sin(time * 8) * 0.15;
        } else if (eType === 'guitar') {
          bearRoot.rotation.x = Math.sin(time * 18) * 0.4;
          bearRoot.rotation.y += dt * 2;
        } else if (eType === 'cat') {
          bearRoot.position.y = this.playerPos.y + Math.abs(Math.sin(time * 14)) * 0.5;
          bearRoot.rotation.z = Math.sin(time * 14) * 0.2;
        } else if (eType === 'pizza') {
          bearRoot.rotation.y += dt * 5;
          bearRoot.position.y = this.playerPos.y + Math.abs(Math.sin(time * 10)) * 0.4;
        } else if (eType === 'freeze') {
          bearRoot.rotation.y = 0;
          bearRoot.position.y = this.playerPos.y;
          bearRoot.scale.set(1.05, 1.05, 1.05);
        } else if (eType === 'fire') {
          bearRoot.rotation.x = Math.sin(time * 25) * 0.2;
          bearRoot.position.y = this.playerPos.y + Math.abs(Math.sin(time * 20)) * 0.3;
        } else if (eType === 'cool') {
          bearRoot.rotation.x = -0.2;
          bearRoot.position.y = this.playerPos.y + 0.3;
        } else if (eType === 'unicorn') {
          bearRoot.rotation.y += dt * 6;
          bearRoot.position.y = this.playerPos.y + Math.abs(Math.sin(time * 10)) * 0.8;
        } else if (eType === 'lightning') {
          bearRoot.position.x = this.playerPos.x + (Math.random() - 0.5) * 0.8;
          bearRoot.position.z = this.playerPos.z + (Math.random() - 0.5) * 0.8;
        } else if (eType === 'diamond') {
          bearRoot.rotation.y += dt * 3;
          bearRoot.position.y = this.playerPos.y + 0.6 + Math.sin(time * 5) * 0.3;
        } else if (eType === 'ninja') {
          bearRoot.rotation.x = time * 12;
          bearRoot.position.y = this.playerPos.y + Math.abs(Math.sin(time * 8)) * 1.2;
        } else if (eType === 'robot') {
          bearRoot.rotation.y = Math.floor(time * 6) * (Math.PI / 2);
          bearRoot.position.y = this.playerPos.y + (Math.floor(time * 4) % 2) * 0.25;
        } else if (eType === 'dragon') {
          bearRoot.rotation.x = 0.3 + Math.sin(time * 10) * 0.2;
          bearRoot.rotation.y = Math.sin(time * 6) * 0.5;
        } else if (eType === 'balloon') {
          bearRoot.position.y = this.playerPos.y + 1.5 + Math.sin(time * 3) * 0.5;
          bearRoot.rotation.z = Math.sin(time * 4) * 0.1;
        } else if (eType === 'honey') {
          bearRoot.rotation.x = Math.abs(Math.sin(time * 6)) * 0.5;
          bearRoot.position.y = this.playerPos.y;
        } else if (eType === 'coffee') {
          bearRoot.position.x = this.playerPos.x + Math.sin(time * 35) * 0.3;
          bearRoot.position.z = this.playerPos.z + Math.cos(time * 35) * 0.3;
        } else if (eType === 'bomb') {
          const s = 1 + Math.sin(time * 16) * 0.25;
          bearRoot.scale.set(s, 2 - s, s);
          bearRoot.position.y = this.playerPos.y + Math.abs(Math.sin(time * 16)) * 0.6;
        } else if (eType === 'ninja_cat') {
          bearRoot.visible = Math.floor(time * 12) % 2 === 0;
          bearRoot.position.y = this.playerPos.y + 0.4;
        } else if (eType === 'lion') {
          const s = 1.1 + Math.sin(time * 8) * 0.15;
          bearRoot.scale.setScalar(s);
          bearRoot.rotation.y = Math.sin(time * 8) * 0.3;
        }

        if (this.activeEmote.timer <= 0) {
          bearRoot.rotation.x = 0;
          bearRoot.rotation.z = 0;
          bearRoot.scale.set(1, 1, 1);
          bearRoot.visible = true;
          bearRoot.position.y = this.playerPos.y;
          if (bear.pillowMesh) bear.pillowMesh.visible = false;
          this.activeEmote = null;
        }
      }
    };
  }

  if (type === 'laugh') {
    game.activeEmote = { type: 'laugh', timer: 2.5 };
    if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos.clone().add(new THREE.Vector3(0, 1.8, 0)), 25, 0xfacc15);
    if (window.St && window.St.playHoneyGem) window.St.playHoneyGem();
    if (game.callbacks && game.callbacks.onShowNotice) game.callbacks.onShowNotice("😆 Grizzly neşeyle gülüyor ve gülücükler saçıyor!", "success");
  } else if (type === 'dance') {
    game.activeEmote = { type: 'dance', timer: 3.5 };
    if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos.clone().add(new THREE.Vector3(0, 1.5, 0)), 30, 0x38bdf8);
    if (window.St && window.St.playJump) window.St.playJump();
    if (game.callbacks && game.callbacks.onShowNotice) game.callbacks.onShowNotice("🕺 Grizzly ritmik bir şekilde dans ediyor ve zıplıyor!", "info");
  } else if (type === 'crown') {
    if (bear && bear.root) {
      if (!bear.crownMesh) {
        const crownGroup = new THREE.Group();
        const baseGeo = new THREE.CylinderGeometry(0.35, 0.4, 0.25, 8);
        const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 });
        const baseMesh = new THREE.Mesh(baseGeo, goldMat);
        crownGroup.add(baseMesh);
        for (let i = 0; i < 5; i++) {
          const peakGeo = new THREE.ConeGeometry(0.1, 0.25, 4);
          const peakMesh = new THREE.Mesh(peakGeo, goldMat);
          const ang = (i / 5) * Math.PI * 2;
          peakMesh.position.set(Math.cos(ang) * 0.3, 0.2, Math.sin(ang) * 0.3);
          crownGroup.add(peakMesh);
        }
        crownGroup.position.set(0, 1.7, 0);
        bear.root.add(crownGroup);
        bear.crownMesh = crownGroup;
      } else {
        bear.crownMesh.visible = !bear.crownMesh.visible;
      }
    }
    if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos.clone().add(new THREE.Vector3(0, 2.2, 0)), 35, 0xf59e0b);
    if (window.St && window.St.playHammerSlam) window.St.playHammerSlam();
    if (game.callbacks && game.callbacks.onShowNotice) game.callbacks.onShowNotice("👑 Kral Tacı Grizzly'nin kafasına yerleştirildi! Efsanevi altın aura aktif!", "success");
  } else if (type === 'sleep') {
    game.activeEmote = { type: 'sleep', timer: 4.0 };
    if (game.spawnSparkleParticles) {
      for (let i = 0; i < 15; i++) {
        game.spawnSparkleParticles(pPos.clone().add(new THREE.Vector3((Math.random()-0.5)*1.5, 1.2 + i*0.1, (Math.random()-0.5)*1.5)), 1, 0x94a3b8);
      }
    }
    if (game.callbacks && game.callbacks.onShowNotice) game.callbacks.onShowNotice("💤 Grizzly yere uzandı ve tatlı bir uykuya daldı (Zzz)...", "info");
  } else if (type === 'rocket') {
    game.playerVel.y = 28;
    if (game.spawnSparkleParticles) {
      for (let i = 0; i < 50; i++) {
        const ang = (i / 50) * Math.PI * 2;
        const dist = Math.random() * 3.5;
        const expPos = pPos.clone().add(new THREE.Vector3(Math.cos(ang) * dist, 0.3, Math.sin(ang) * dist));
        game.spawnSparkleParticles(expPos, 2, i % 2 === 0 ? 0xef4444 : 0xf59e0b);
      }
    }
    if (window.St && window.St.playHammerSlam) window.St.playHammerSlam();
    if (game.callbacks && game.callbacks.onShowNotice) game.callbacks.onShowNotice("🚀 Dev patlama ve roket kuvvetiyle gökyüzüne fırladın!", "success");
  } else if (type === 'heart') {
    if (game.spawnSparkleParticles) {
      for (let i = 0; i < 40; i++) {
        const heartPos = pPos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 2.5, Math.random() * 2.5, (Math.random() - 0.5) * 2.5));
        game.spawnSparkleParticles(heartPos, 1, 0xf43f5e);
      }
    }
    if (window.St && window.St.playHoneyGem) window.St.playHoneyGem();
    if (game.callbacks && game.callbacks.onShowNotice) game.callbacks.onShowNotice("❤️ Etrafa sevgi dolu kalpler ve tatlılık saçılıyor!", "success");
  } else if (type === 'star') {
    game.activeEmote = { type: 'star', timer: 3.0 };
    if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos.clone().add(new THREE.Vector3(0, 2, 0)), 35, 0xfacc15);
    if (window.St && window.St.playLevelUp) window.St.playLevelUp();
    if (game.callbacks && game.callbacks.onShowNotice) game.callbacks.onShowNotice("🌟 Süper Yıldız aurası aktif! Altın pırıltılar saçıyorsun!", "success");
  } else if (type === 'ghost') {
    game.activeEmote = { type: 'ghost', timer: 3.0 };
    if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos.clone().add(new THREE.Vector3(0, 1.5, 0)), 20, 0xc084fc);
    if (window.St && window.St.playJump) window.St.playJump();
    if (game.callbacks && game.callbacks.onShowNotice) game.callbacks.onShowNotice("👻 Hayalet gibi titreşiyorsun ve gizemli sesler çıkarıyorsun!", "info");
  } else if (type === 'guitar') {
    game.activeEmote = { type: 'guitar', timer: 3.5 };
    if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos.clone().add(new THREE.Vector3(0, 1.5, 0)), 25, 0xf43f5e);
    if (window.St && window.St.playBossRoar) window.St.playBossRoar();
    if (game.callbacks && game.callbacks.onShowNotice) game.callbacks.onShowNotice("🎸 Rockstar Grizzly sahneyi sallıyor! Solo vakti!", "success");
  } else if (type === 'cat') {
    game.activeEmote = { type: 'cat', timer: 3.0 };
    if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos.clone().add(new THREE.Vector3(0, 1.4, 0)), 20, 0xf97316);
    if (window.St && window.St.playHoneyGem) window.St.playHoneyGem();
    if (game.callbacks && game.callbacks.onShowNotice) game.callbacks.onShowNotice("🐱 Miyav! Kedi dostumuz gibi neşeyle zıplıyorsun!", "success");
  } else if (type === 'pizza') {
    game.activeEmote = { type: 'pizza', timer: 3.0 };
    if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos.clone().add(new THREE.Vector3(0, 1.5, 0)), 25, 0xeab308);
    if (window.St && window.St.playJump) window.St.playJump();
    if (game.callbacks && game.callbacks.onShowNotice) game.callbacks.onShowNotice("🍕 Lezzetli bir pizza ziyafeti çekiyorsun!", "success");
  } else if (type === 'freeze') {
    game.activeEmote = { type: 'freeze', timer: 3.0 };
    if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos.clone().add(new THREE.Vector3(0, 1.5, 0)), 30, 0x38bdf8);
    if (window.St && window.St.playDamage) window.St.playDamage();
    if (game.callbacks && game.callbacks.onShowNotice) game.callbacks.onShowNotice("❄️ Buz kristalleriyle donarak dondurucu bir aura oluşturdun!", "info");
  } else if (type === 'fire') {
    game.activeEmote = { type: 'fire', timer: 3.0 };
    if (game.spawnSparkleParticles) {
      for (let i = 0; i < 35; i++) {
        game.spawnSparkleParticles(pPos.clone().add(new THREE.Vector3((Math.random()-0.5)*2, Math.random()*2, (Math.random()-0.5)*2)), 1, 0xef4444);
      }
    }
    if (window.St && window.St.playHammerSlam) window.St.playHammerSlam();
    if (game.callbacks && game.callbacks.onShowNotice) game.callbacks.onShowNotice("🔥 Alevler içinde yanıyorsun! Magma gücü aktif!", "success");
  } else if (type === 'cool') {
    game.activeEmote = { type: 'cool', timer: 3.0 };
    if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos.clone().add(new THREE.Vector3(0, 2, 0)), 20, 0x64748b);
    if (window.St && window.St.playJump) window.St.playJump();
    if (game.callbacks && game.callbacks.onShowNotice) game.callbacks.onShowNotice("🕶️ Son derece havalı ve tarz duruyorsun!", "success");
  } else if (type === 'unicorn') {
    game.activeEmote = { type: 'unicorn', timer: 3.5 };
    if (game.spawnSparkleParticles) {
      for (let i = 0; i < 40; i++) {
        const col = i % 3 === 0 ? 0xf43f5e : i % 3 === 1 ? 0xa855f7 : 0x38bdf8;
        game.spawnSparkleParticles(pPos.clone().add(new THREE.Vector3((Math.random()-0.5)*2, Math.random()*2.5, (Math.random()-0.5)*2)), 1, col);
      }
    }
    if (window.St && window.St.playLevelUp) window.St.playLevelUp();
    if (game.callbacks && game.callbacks.onShowNotice) game.callbacks.onShowNotice("🦄 Gökkuşağı renklerinde sihirli Unicorn aurası!", "success");
  } else if (type === 'lightning') {
    game.activeEmote = { type: 'lightning', timer: 2.5 };
    if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos.clone().add(new THREE.Vector3(0, 1.8, 0)), 30, 0xfacc15);
    if (window.St && window.St.playDoubleJump) window.St.playDoubleJump();
    if (game.callbacks && game.callbacks.onShowNotice) game.callbacks.onShowNotice("⚡ Şimşek hızıyla elektrik kıvılcımları saçıyorsun!", "success");
  } else if (type === 'diamond') {
    game.activeEmote = { type: 'diamond', timer: 3.0 };
    if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos.clone().add(new THREE.Vector3(0, 2.2, 0)), 40, 0x38bdf8);
    if (window.St && window.St.playLevelUp) window.St.playLevelUp();
    if (game.callbacks && game.callbacks.onShowNotice) game.callbacks.onShowNotice("💎 Elmas gibi parıldayan göz kamaştırıcı aura!", "success");
  } else if (type === 'ninja') {
    game.activeEmote = { type: 'ninja', timer: 2.5 };
    if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos.clone().add(new THREE.Vector3(0, 1.5, 0)), 25, 0x334155);
    if (window.St && window.St.playRoll) window.St.playRoll();
    if (game.callbacks && game.callbacks.onShowNotice) game.callbacks.onShowNotice("🥷 Havada kusursuz bir ninja taklası atıyorsun!", "success");
  } else if (type === 'robot') {
    game.activeEmote = { type: 'robot', timer: 3.0 };
    if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos.clone().add(new THREE.Vector3(0, 1.5, 0)), 25, 0x94a3b8);
    if (window.St && window.St.playHammerSlam) window.St.playHammerSlam();
    if (game.callbacks && game.callbacks.onShowNotice) game.callbacks.onShowNotice("🤖 Mekanik robotik dans modülü aktif!", "info");
  } else if (type === 'dragon') {
    game.activeEmote = { type: 'dragon', timer: 3.0 };
    if (game.spawnSparkleParticles) {
      for (let i = 0; i < 35; i++) {
        game.spawnSparkleParticles(pPos.clone().add(new THREE.Vector3((Math.random()-0.5)*2, Math.random()*2, (Math.random()-0.5)*2)), 1, 0xef4444);
      }
    }
    if (window.St && window.St.playBossRoar) window.St.playBossRoar();
    if (game.callbacks && game.callbacks.onShowNotice) game.callbacks.onShowNotice("🐉 Ejderha kükremesi ve alev nefesi!", "success");
  } else if (type === 'balloon') {
    game.activeEmote = { type: 'balloon', timer: 3.5 };
    if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos.clone().add(new THREE.Vector3(0, 2.5, 0)), 20, 0xf43f5e);
    if (window.St && window.St.playJump) window.St.playJump();
    if (game.callbacks && game.callbacks.onShowNotice) game.callbacks.onShowNotice("🎈 Renkli balonla gökyüzüne doğru süzülüyorsun!", "success");
  } else if (type === 'honey') {
    game.activeEmote = { type: 'honey', timer: 3.0 };
    if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos.clone().add(new THREE.Vector3(0, 1.2, 0)), 25, 0xf59e0b);
    if (window.St && window.St.playHoneyGem) window.St.playHoneyGem();
    if (game.callbacks && game.callbacks.onShowNotice) game.callbacks.onShowNotice("🍯 Tatlı bal kavanozu ziyafeti çekiyorsun!", "success");
  } else if (type === 'coffee') {
    game.activeEmote = { type: 'coffee', timer: 2.5 };
    if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos.clone().add(new THREE.Vector3(0, 1.5, 0)), 30, 0x78350f);
    if (window.St && window.St.playJump) window.St.playJump();
    if (game.callbacks && game.callbacks.onShowNotice) game.callbacks.onShowNotice("☕ Kafein yüklemesi! Süper hızda koşturuyorsun!", "success");
  } else if (type === 'bomb') {
    game.activeEmote = { type: 'bomb', timer: 2.5 };
    if (game.spawnSparkleParticles) {
      for (let i = 0; i < 40; i++) {
        game.spawnSparkleParticles(pPos.clone().add(new THREE.Vector3((Math.random()-0.5)*2.5, Math.random()*2, (Math.random()-0.5)*2.5)), 2, 0xef4444);
      }
    }
    if (window.St && window.St.playHammerSlam) window.St.playHammerSlam();
    if (game.callbacks && game.callbacks.onShowNotice) game.callbacks.onShowNotice("💣 Karikatür tarzı zıplayan bomba animasyonu!", "warning");
  } else if (type === 'ninja_cat') {
    game.activeEmote = { type: 'ninja_cat', timer: 3.0 };
    if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos.clone().add(new THREE.Vector3(0, 1.5, 0)), 20, 0x1e293b);
    if (window.St && window.St.playRoll) window.St.playRoll();
    if (game.callbacks && game.callbacks.onShowNotice) game.callbacks.onShowNotice("🐱‍👤 Gölge ninja kedi gibi ortadan kaybolup ışınlanıyorsun!", "success");
  } else if (type === 'lion') {
    game.activeEmote = { type: 'lion', timer: 3.0 };
    if (game.spawnSparkleParticles) game.spawnSparkleParticles(pPos.clone().add(new THREE.Vector3(0, 2, 0)), 30, 0xd97706);
    if (window.St && window.St.playBossRoar) window.St.playBossRoar();
    if (game.callbacks && game.callbacks.onShowNotice) game.callbacks.onShowNotice("🦁 Görkemli aslan kükremesi ve lider aurası!", "success");
  }
}

  // =========================================================================
  // 🌋 20:00 SUBTERRANEAN WORLD 3D CINEMATIC MOVIE DIRECTOR ENGINE (9 CHAPTERS)
  // =========================================================================

  var subterraneanMovieState = {
    isActive: false,
    currentChapter: 1,
    elapsedTime: 0,
    playbackSpeed: 1,
    isPaused: false,
    cameraMode: 'cinematic', // 'cinematic' | 'action' | 'drone' | 'boss'
    activeSceneGroup: null,
    movieAnimFrame: null,
    audioCtx: null,
    actorBear: null,
    actorCat: null,
    actorBoss: null,
    origGameUpdate: null,
    camTargetPos: null,
    camLookTarget: null
  };

  var MOVIE_CHAPTER_DATA = [
    {
      id: 1,
      title: "1. BÖLÜM: YERİN YARILDIĞI AN & MAGMA DÜŞÜŞÜ",
      subtitle: "Köyün zemini aniden 10 şiddetinde depremle çatlıyor! Süper Ayı dipsiz uçuruma yuvarlanıyor...",
      dialogue: "SÜPER AYI: 'Dur bir dakika... Zemin titriyor! HERKES TUTUNSUN, YER YARILIYOR!'",
      timeStart: 0,
      timeEnd: 35,
      camPos: { x: 0, y: 122, z: -22 },
      camTarget: { x: 0, y: 110, z: -45 },
      theme: "earthquake"
    },
    {
      id: 2,
      title: "2. BÖLÜM: MAGMA SOLUCANLARI & KOR TÜNELLER",
      subtitle: "Duvarları delen 30 metrelik dev Lav Solucanları tünellerden fırlıyor!",
      dialogue: "KEDİ BONCUK: 'Aman Tanrım! 1800 derece sıcaklıkta dev bir Lav Solucanı duvardan fırladı! KAÇ!'",
      timeStart: 35,
      timeEnd: 70,
      camPos: { x: 18, y: 120, z: -25 },
      camTarget: { x: 0, y: 112, z: -45 },
      theme: "magma"
    },
    {
      id: 3,
      title: "3. BÖLÜM: KRALİÇE KÖSTEBEK & BUHARLI MATKAP MADENLERİ",
      subtitle: "Köstebeklerin devasa buhar makineleri ve raylı maden vagonları savaşı!",
      dialogue: "KRALİÇE KÖSTEBEK: 'Biz yeraltının efendileriyiz! Matkap ordusu, bu davetsiz misafiri durdurun!'",
      timeStart: 70,
      timeEnd: 105,
      camPos: { x: -20, y: 120, z: -24 },
      camTarget: { x: 0, y: 110, z: -45 },
      theme: "drills"
    },
    {
      id: 4,
      title: "4. BÖLÜM: BİYOLÜMİNESANS KRİSTAL MAĞARALARI",
      subtitle: "Karanlığı aydınlatan dev neon kuvarslar ve yerçekimsiz yeraltı kristalleri...",
      dialogue: "SÜPER AYI: 'İnanılmaz... Bu kristaller yerçekimini büküyor! Havada süzülüyorum!'",
      timeStart: 105,
      timeEnd: 140,
      camPos: { x: 0, y: 124, z: -20 },
      camTarget: { x: 0, y: 112, z: -45 },
      theme: "crystals"
    },
    {
      id: 5,
      title: "5. BÖLÜM: KADİM DİNOZOR VE CANAVAR FOSİL MEZARLIĞI",
      subtitle: "Milyonlarca yıllık T-Rex iskeletlerinin içinden geçen kemik asma köprüler!",
      dialogue: "KEDİ BONCUK: 'Burası tarih öncesi bir ejderha mezarlığı! Kemik köprülerden dikkatli geç!'",
      timeStart: 140,
      timeEnd: 175,
      camPos: { x: 22, y: 122, z: -24 },
      camTarget: { x: 0, y: 112, z: -45 },
      theme: "fossils"
    },
    {
      id: 6,
      title: "6. BÖLÜM: DEV ZEHİRLİ MANTAR ORMANI & SPOR FIRTINASI",
      subtitle: "15 metrelik dev şapkalı mantarlar ve havada uçuşan parlayan zehir sporları...",
      dialogue: "MANTAR KRALİÇESİ: 'Ormanımızın derinliklerine hoş geldiniz... Bu trambolin mantarlar sizi fırlatacak!'",
      timeStart: 175,
      timeEnd: 210,
      camPos: { x: -18, y: 122, z: -22 },
      camTarget: { x: 0, y: 112, z: -45 },
      theme: "mushrooms"
    },
    {
      id: 7,
      title: "7. BÖLÜM: OBSİDYEN LAV ŞELALELERİ & TİTAN DEMİRHANESİ",
      subtitle: "Simsiyah obsidyen kayalarından akan kızgın lav şelaleleri ve efsanevi Magma Kılıcı!",
      dialogue: "TİTAN DEMİRCİSİ: 'Çeliği lavda döveriz! İşte gezegenin en güçlü kılıcı: MAGMA BIÇAĞI!'",
      timeStart: 210,
      timeEnd: 245,
      camPos: { x: 18, y: 120, z: -24 },
      camTarget: { x: 0, y: 112, z: -45 },
      theme: "forge"
    },
    {
      id: 8,
      title: "8. BÖLÜM: KAYIP YERALTI MEDENİYETİ ANTİK TAPINAĞI",
      subtitle: "Yerin binlerce metre altına gömülmüş altın sütunlu antik bir şehir!",
      dialogue: "KADİM NÖBETÇİ: 'Yalnızca layık olanlar altın piramidin kapısından geçebilir!'",
      timeStart: 245,
      timeEnd: 275,
      camPos: { x: 0, y: 124, z: -20 },
      camTarget: { x: 0, y: 112, z: -45 },
      theme: "ancient"
    },
    {
      id: 9,
      title: "9. BÖLÜM: ÇEKİRDEK İMPARATORU & TİTAN LEVIATHAN BOSS",
      subtitle: "Gezegenin kalbindeki devasa Kozmik Abis Yaratığı uyanıyor! 20:00'de Hazır Ol!",
      dialogue: "KOZMİK LEVIATHAN: 'KİMSİNİZ SİZ KÜÇÜK YARATIKLAR?! BU DÜNYA BENİM ÇEKİRDEĞİMDİR!'",
      timeStart: 275,
      timeEnd: 300,
      camPos: { x: 0, y: 126, z: -18 },
      camTarget: { x: 0, y: 114, z: -45 },
      theme: "leviathan"
    }
  ];

  // Helper to play synthesized movie orchestral soundtrack & SFX
  function playMovieCinematicAudio(theme) {
    try {
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!subterraneanMovieState.audioCtx) {
        subterraneanMovieState.audioCtx = new AudioCtx();
      }
      var ctx = subterraneanMovieState.audioCtx;
      if (ctx.state === 'suspended') ctx.resume();
      var now = ctx.currentTime;

      // Heavy cinematic drum hit
      var drumOsc = ctx.createOscillator();
      var drumGain = ctx.createGain();
      drumOsc.type = 'triangle';
      drumOsc.frequency.setValueAtTime(140, now);
      drumOsc.frequency.exponentialRampToValueAtTime(30, now + 0.8);
      drumGain.gain.setValueAtTime(0.45, now);
      drumGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      drumOsc.connect(drumGain);
      drumGain.connect(ctx.destination);
      drumOsc.start(now);
      drumOsc.stop(now + 0.8);

      // Heroic synth chord note
      var brassOsc = ctx.createOscillator();
      var brassGain = ctx.createGain();
      brassOsc.type = 'sawtooth';
      var noteFreq = theme === 'crystals' ? 587 : theme === 'leviathan' ? 146 : theme === 'magma' ? 220 : 330;
      brassOsc.frequency.setValueAtTime(noteFreq, now + 0.05);
      brassOsc.frequency.linearRampToValueAtTime(noteFreq * 1.5, now + 1.2);
      brassGain.gain.setValueAtTime(0.25, now + 0.05);
      brassGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      brassOsc.connect(brassGain);
      brassGain.connect(ctx.destination);
      brassOsc.start(now + 0.05);
      brassOsc.stop(now + 1.2);
    } catch(e) {}
  }

  // Helper: Create 3D Super Bear Model for Cutscenes
  function createCutscene3DBear(THREE) {
    var bear = new THREE.Group();
    bear.name = "cutscene_grizzy_bear";

    var furMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
    var snoutMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.5 });
    var eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    var shirtMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.6 });

    // Body
    var body = new THREE.Mesh(new THREE.SphereGeometry(1.8, 16, 16), shirtMat);
    body.position.y = 2.0;
    bear.add(body);

    // Head Group
    var headGroup = new THREE.Group();
    headGroup.position.set(0, 3.8, 0);

    var head = new THREE.Mesh(new THREE.SphereGeometry(1.4, 16, 16), furMat);
    headGroup.add(head);

    var snout = new THREE.Mesh(new THREE.SphereGeometry(0.7, 12, 12), snoutMat);
    snout.position.set(0, -0.2, 1.1);
    headGroup.add(snout);

    var nose = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), eyeMat);
    nose.position.set(0, 0, 1.7);
    headGroup.add(nose);

    var eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), eyeMat);
    var eyeR = eyeL.clone();
    eyeL.position.set(-0.45, 0.4, 1.2);
    eyeR.position.set(0.45, 0.4, 1.2);
    headGroup.add(eyeL);
    headGroup.add(eyeR);

    var earL = new THREE.Mesh(new THREE.SphereGeometry(0.45, 8, 8), furMat);
    var earR = earL.clone();
    earL.position.set(-1.0, 1.1, 0.1);
    earR.position.set(1.0, 1.1, 0.1);
    headGroup.add(earL);
    headGroup.add(earR);

    bear.add(headGroup);
    bear.headGroup = headGroup;

    // Arms / Paws
    var pawL = new THREE.Mesh(new THREE.SphereGeometry(0.6, 10, 10), furMat);
    var pawR = pawL.clone();
    pawL.position.set(-2.0, 2.2, 0.4);
    pawR.position.set(2.0, 2.2, 0.4);
    bear.add(pawL);
    bear.add(pawR);
    bear.pawL = pawL;
    bear.pawR = pawR;

    return bear;
  }

  // Helper: Create 3D Cat Boncuk Model for Cutscenes
  function createCutscene3DCat(THREE) {
    var cat = new THREE.Group();
    cat.name = "cutscene_cat_boncuk";

    var furMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.6 });
    var whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    var eyeMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    var noseMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });

    // Body
    var body = new THREE.Mesh(new THREE.SphereGeometry(1.2, 14, 14), furMat);
    body.position.y = 1.4;
    cat.add(body);

    // Head
    var headGroup = new THREE.Group();
    headGroup.position.set(0, 2.7, 0);

    var head = new THREE.Mesh(new THREE.SphereGeometry(1.0, 14, 14), furMat);
    headGroup.add(head);

    var muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.45, 10, 10), whiteMat);
    muzzle.position.set(0, -0.2, 0.8);
    headGroup.add(muzzle);

    var nose = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), noseMat);
    nose.position.set(0, -0.1, 1.2);
    headGroup.add(nose);

    var eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), eyeMat);
    var eyeR = eyeL.clone();
    eyeL.position.set(-0.35, 0.25, 0.85);
    eyeR.position.set(0.35, 0.25, 0.85);
    headGroup.add(eyeL);
    headGroup.add(eyeR);

    // Pointy Cat Ears
    var earGeo = new THREE.ConeGeometry(0.35, 0.7, 4);
    var earL = new THREE.Mesh(earGeo, furMat);
    var earR = earL.clone();
    earL.position.set(-0.6, 0.9, 0);
    earL.rotation.z = 0.3;
    earR.position.set(0.6, 0.9, 0);
    earR.rotation.z = -0.3;
    headGroup.add(earL);
    headGroup.add(earR);

    cat.add(headGroup);
    cat.headGroup = headGroup;

    return cat;
  }

  // Build high-detail 3D scene set pieces for the current chapter
  function buildMovieChapter3DScene(game, chapterId) {
    if (subterraneanMovieState.activeSceneGroup) {
      game.scene.remove(subterraneanMovieState.activeSceneGroup);
      subterraneanMovieState.activeSceneGroup = null;
    }

    var THREE = window.THREE;
    var group = new THREE.Group();
    group.name = "subterranean_movie_scene_" + chapterId;
    
    // Set fixed high-altitude stage position in clear sky
    var stageX = 0;
    var stageY = 110;
    var stageZ = -45;
    group.position.set(stageX, stageY, stageZ);

    // 1. Ultra-Bright Dedicated Cutscene Lights
    var ambLight = new THREE.AmbientLight(0xffffff, 2.6);
    group.add(ambLight);

    var dirLight = new THREE.DirectionalLight(0xfff7ed, 3.0);
    dirLight.position.set(15, 30, 25);
    group.add(dirLight);

    var themeColors = [0xff4500, 0xf97316, 0xeab308, 0x06b6d4, 0xa855f7, 0x10b981, 0xef4444, 0xf59e0b, 0x9333ea];
    var pointLight = new THREE.PointLight(themeColors[chapterId - 1] || 0xffffff, 4.0, 80);
    pointLight.position.set(0, 15, 0);
    group.add(pointLight);

    // 2. Primary 3D Floating Stage Island
    var platMat = new THREE.MeshStandardMaterial({
      color: chapterId === 2 || chapterId === 7 ? 0x270707 : chapterId === 4 ? 0x082f49 : chapterId === 8 ? 0x451a03 : 0x1e293b,
      roughness: 0.5,
      metalness: 0.3
    });
    var platGeo = new THREE.CylinderGeometry(20, 24, 5, 32);
    var platform = new THREE.Mesh(platGeo, platMat);
    platform.position.set(0, -2.5, 0);
    group.add(platform);

    // Glowing stage rim
    var rimMat = new THREE.MeshBasicMaterial({ color: themeColors[chapterId - 1] || 0xf59e0b });
    var rimGeo = new THREE.TorusGeometry(20, 0.4, 8, 32);
    var rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.set(0, 0.05, 0);
    group.add(rim);

    // 3. Actors: Super Bear & Cat Boncuk
    var bearActor = createCutscene3DBear(THREE);
    bearActor.position.set(-4, 0, 4);
    group.add(bearActor);
    subterraneanMovieState.actorBear = bearActor;

    var catActor = createCutscene3DCat(THREE);
    catActor.position.set(4, 0, 4);
    group.add(catActor);
    subterraneanMovieState.actorCat = catActor;

    // 4. Chapter Specific 3D Models & Bosses
    if (chapterId === 1) {
      // CHAPTER 1: Village Ground Rupture & Glowing Lava Fissures
      var crackGrid = new THREE.Mesh(
        new THREE.PlaneGeometry(38, 38, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xff3b00, wireframe: true })
      );
      crackGrid.rotation.x = -Math.PI / 2;
      crackGrid.position.set(0, 0.1, 0);
      group.add(crackGrid);

      // Shaking Village Wooden Houses falling in
      for (var h = 0; h < 5; h++) {
        var ang = (h / 5) * Math.PI * 2;
        var house = new THREE.Mesh(
          new THREE.BoxGeometry(4.5, 4.5, 4.5),
          new THREE.MeshStandardMaterial({ color: 0xa16207, roughness: 0.6 })
        );
        var roof = new THREE.Mesh(
          new THREE.ConeGeometry(3.5, 2.5, 4),
          new THREE.MeshStandardMaterial({ color: 0xdc2626 })
        );
        roof.position.y = 3.5;
        roof.rotation.y = Math.PI / 4;
        house.add(roof);

        house.position.set(Math.cos(ang) * 13, 2, Math.sin(ang) * 13);
        house.rotation.z = (Math.random() - 0.5) * 0.4;
        group.add(house);
      }
      subterraneanMovieState.actorBoss = null;
    } 
    else if (chapterId === 2) {
      // CHAPTER 2: 30-Meter Giant Magma Leviathan Worm
      var wormGroup = new THREE.Group();
      wormGroup.position.set(0, 2, -10);

      for (var s = 0; s < 14; s++) {
        var segSize = 3.6 - s * 0.18;
        var seg = new THREE.Mesh(
          new THREE.SphereGeometry(segSize, 14, 14),
          new THREE.MeshStandardMaterial({
            color: s === 0 ? 0xdc2626 : s % 2 === 0 ? 0xf97316 : 0xb91c1c,
            roughness: 0.3,
            metalness: 0.3
          })
        );
        seg.position.set(Math.sin(s * 0.5) * 3.5, s * 2.5, Math.cos(s * 0.5) * 3.5);
        wormGroup.add(seg);
      }

      // Glowing Magma Eyes & Fangs
      var headSeg = wormGroup.children[0];
      var eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 8), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
      var eyeR = eyeL.clone();
      eyeL.position.set(-1.4, 1.8, 2.4);
      eyeR.position.set(1.4, 1.8, 2.4);
      headSeg.add(eyeL);
      headSeg.add(eyeR);

      var fangL = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.8, 6), new THREE.MeshStandardMaterial({ color: 0xffffff }));
      var fangR = fangL.clone();
      fangL.rotation.x = Math.PI / 1.5;
      fangL.position.set(-1.0, -1.0, 2.8);
      fangR.rotation.x = Math.PI / 1.5;
      fangR.position.set(1.0, -1.0, 2.8);
      headSeg.add(fangL);
      headSeg.add(fangR);

      group.add(wormGroup);
      subterraneanMovieState.actorBoss = wormGroup;
    } 
    else if (chapterId === 3) {
      // CHAPTER 3: Steampunk Mole Mine & Drill Tank
      var tankGroup = new THREE.Group();
      tankGroup.position.set(0, 2, -8);

      var tankBody = new THREE.Mesh(new THREE.BoxGeometry(9, 4.5, 7), new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.2 }));
      var drillHead = new THREE.Mesh(new THREE.ConeGeometry(3.0, 7.5, 16), new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9, roughness: 0.1 }));
      drillHead.rotation.x = Math.PI / 2;
      drillHead.position.set(0, 0, 7.0);

      // Steam Chimney
      var chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 4, 8), new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8 }));
      chimney.position.set(-2.5, 4, -1.5);
      tankBody.add(chimney);

      // Queen Mole in Cockpit
      var moleHead = new THREE.Mesh(new THREE.SphereGeometry(1.6, 12, 12), new THREE.MeshStandardMaterial({ color: 0x713f12 }));
      moleHead.position.set(0, 3.5, 0);
      var goggles = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.25, 8, 16), new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.9 }));
      goggles.position.set(0, 0.2, 1.4);
      moleHead.add(goggles);
      var crown = new THREE.Mesh(new THREE.ConeGeometry(1.0, 1.2, 5), new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9 }));
      crown.position.set(0, 1.8, 0);
      moleHead.add(crown);
      tankBody.add(moleHead);

      tankGroup.add(tankBody);
      tankGroup.add(drillHead);
      tankGroup.drillHead = drillHead;

      group.add(tankGroup);
      subterraneanMovieState.actorBoss = tankGroup;
    } 
    else if (chapterId === 4) {
      // CHAPTER 4: Bioluminescent Crystal Caverns & Quartz Golem
      var crystalGroup = new THREE.Group();
      crystalGroup.position.set(0, 0, -8);

      for (var c = 0; c < 22; c++) {
        var cAng = (c / 22) * Math.PI * 2;
        var cDist = 8 + (c % 3) * 4.5;
        var cryGeo = new THREE.ConeGeometry(1.2 + (c % 2) * 0.7, 8 + (c % 4) * 2.5, 6);
        var cryMat = new THREE.MeshBasicMaterial({
          color: c % 3 === 0 ? 0x06b6d4 : c % 3 === 1 ? 0xa855f7 : 0x10b981
        });
        var cryMesh = new THREE.Mesh(cryGeo, cryMat);
        cryMesh.position.set(Math.cos(cAng) * cDist, 2 + (c % 3) * 2, Math.sin(cAng) * cDist);
        cryMesh.rotation.x = (Math.random() - 0.5) * 0.5;
        cryMesh.rotation.z = (Math.random() - 0.5) * 0.5;
        crystalGroup.add(cryMesh);
      }

      // Tall Quartz Golem
      var golem = new THREE.Mesh(new THREE.BoxGeometry(4.5, 7, 3), new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.6, roughness: 0.2 }));
      golem.position.set(0, 4.5, 0);
      var coreGlow = new THREE.Mesh(new THREE.SphereGeometry(1.2, 10, 10), new THREE.MeshBasicMaterial({ color: 0x00ffff }));
      coreGlow.position.set(0, 1.0, 1.5);
      golem.add(coreGlow);
      crystalGroup.add(golem);

      group.add(crystalGroup);
      subterraneanMovieState.actorBoss = crystalGroup;
    } 
    else if (chapterId === 5) {
      // CHAPTER 5: Prehistoric Dragon & T-Rex Fossil Skeletal Cemetery
      var fossilGroup = new THREE.Group();
      fossilGroup.position.set(0, 2, -10);

      var skull = new THREE.Mesh(new THREE.BoxGeometry(7, 5, 9), new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.5 }));
      skull.position.set(0, 5, 0);

      // Glowing Eye Sockets
      var sEyeL = new THREE.Mesh(new THREE.SphereGeometry(0.6, 8, 8), new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
      var sEyeR = sEyeL.clone();
      sEyeL.position.set(-2.0, 1.0, 3.5);
      sEyeR.position.set(2.0, 1.0, 3.5);
      skull.add(sEyeL);
      skull.add(sEyeR);
      fossilGroup.add(skull);

      // Ribcage tunnel arches
      for (var rib = 0; rib < 7; rib++) {
        var ribArch = new THREE.Mesh(new THREE.TorusGeometry(7, 0.7, 8, 16, Math.PI), new THREE.MeshStandardMaterial({ color: 0xe2e8f0 }));
        ribArch.rotation.x = Math.PI;
        ribArch.position.set(0, 1, -10 + rib * 3.5);
        fossilGroup.add(ribArch);
      }

      group.add(fossilGroup);
      subterraneanMovieState.actorBoss = fossilGroup;
    } 
    else if (chapterId === 6) {
      // CHAPTER 6: Toxic Giant Bouncing Mushroom Forest
      var mushGroup = new THREE.Group();
      mushGroup.position.set(0, 0, -8);

      for (var m = 0; m < 9; m++) {
        var mAng = (m / 9) * Math.PI * 2;
        var mDist = 9 + (m % 3) * 4;
        var mStem = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.5, 11, 10), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 }));
        mStem.position.set(Math.cos(mAng) * mDist, 5.5, Math.sin(mAng) * mDist);
        
        var mCap = new THREE.Mesh(new THREE.SphereGeometry(4.0, 14, 14, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({
          color: m % 2 === 0 ? 0x9333ea : 0x059669,
          roughness: 0.3
        }));
        mCap.position.set(Math.cos(mAng) * mDist, 11, Math.sin(mAng) * mDist);

        // Glowing Dots on cap
        for (var dot = 0; dot < 4; dot++) {
          var dMesh = new THREE.Mesh(new THREE.SphereGeometry(0.4, 6, 6), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
          dMesh.position.set((dot - 1.5) * 1.5, 1.8, (dot % 2) * 1.5);
          mCap.add(dMesh);
        }

        mushGroup.add(mStem);
        mushGroup.add(mCap);
      }

      group.add(mushGroup);
      subterraneanMovieState.actorBoss = mushGroup;
    } 
    else if (chapterId === 7) {
      // CHAPTER 7: Obsidian Lava Falls & Titan Forge Anvil
      var forgeGroup = new THREE.Group();
      forgeGroup.position.set(0, 0, -10);

      var anvil = new THREE.Mesh(new THREE.BoxGeometry(5.5, 3.5, 3), new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.95, roughness: 0.15 }));
      anvil.position.set(0, 2.5, 0);
      forgeGroup.add(anvil);

      // Floating Flaming Magma Sword
      var sword = new THREE.Mesh(new THREE.BoxGeometry(1.0, 8.0, 0.4), new THREE.MeshBasicMaterial({ color: 0xff4500 }));
      sword.position.set(0, 7.5, 0);
      sword.rotation.z = Math.PI / 4;
      forgeGroup.add(sword);
      forgeGroup.sword = sword;

      // Cascading Glowing Lava Falls Backdrop
      var fallGeo = new THREE.PlaneGeometry(45, 30);
      var fallMat = new THREE.MeshBasicMaterial({ color: 0xff3b00, side: THREE.DoubleSide });
      var falls = new THREE.Mesh(fallGeo, fallMat);
      falls.position.set(0, 12, -18);
      forgeGroup.add(falls);

      group.add(forgeGroup);
      subterraneanMovieState.actorBoss = forgeGroup;
    } 
    else if (chapterId === 8) {
      // CHAPTER 8: Ancient Sunken Golden Civilization & Sentinel Statues
      var templeGroup = new THREE.Group();
      templeGroup.position.set(0, 0, -12);

      var pyramid = new THREE.Mesh(new THREE.ConeGeometry(14, 16, 4), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.6, roughness: 0.3 }));
      pyramid.rotation.y = Math.PI / 4;
      pyramid.position.set(0, 8, 0);
      templeGroup.add(pyramid);

      // Laser Sentinel Pillars
      for (var p = -1; p <= 1; p += 2) {
        var pillar = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.2, 12, 8), new THREE.MeshStandardMaterial({ color: 0x78350f }));
        pillar.position.set(p * 9, 6, 8);
        var laserEye = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
        laserEye.position.set(0, 5, 1.2);
        pillar.add(laserEye);
        templeGroup.add(pillar);
      }

      group.add(templeGroup);
      subterraneanMovieState.actorBoss = templeGroup;
    } 
    else if (chapterId === 9) {
      // CHAPTER 9: Final 60-Meter Cosmic Abyss Leviathan Boss
      var levGroup = new THREE.Group();
      levGroup.position.set(0, 7, -12);

      // Huge Horned Leviathan Head
      var head = new THREE.Mesh(new THREE.SphereGeometry(6.5, 18, 18), new THREE.MeshStandardMaterial({ color: 0x3b0764, roughness: 0.2, metalness: 0.6 }));
      var hornL = new THREE.Mesh(new THREE.ConeGeometry(1.6, 8, 8), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8 }));
      var hornR = hornL.clone();
      hornL.rotation.z = -Math.PI / 3;
      hornL.position.set(-4.5, 4.5, 0);
      hornR.rotation.z = Math.PI / 3;
      hornR.position.set(4.5, 4.5, 0);
      head.add(hornL);
      head.add(hornR);

      // 4 Glowing Ruby Eyes
      for (var re = 0; re < 4; re++) {
        var rEye = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
        rEye.position.set((re - 1.5) * 2.2, 1.5, 5.5);
        head.add(rEye);
      }

      levGroup.add(head);

      // Massive Coiling Cosmic Body Rings
      for (var b = 1; b <= 9; b++) {
        var bSeg = new THREE.Mesh(
          new THREE.TorusGeometry(7 + b * 1.8, 2.0, 12, 24),
          new THREE.MeshStandardMaterial({ color: b % 2 === 0 ? 0x9333ea : 0xdc2626, roughness: 0.3 })
        );
        bSeg.rotation.x = Math.PI / 2;
        bSeg.position.set(0, -b * 2.6, 0);
        levGroup.add(bSeg);
      }

      group.add(levGroup);
      subterraneanMovieState.actorBoss = levGroup;
    }

    game.scene.add(group);
    subterraneanMovieState.activeSceneGroup = group;
  }

  // --- Start Movie Cutscene in Game Engine ---
  function startSubterraneanMovieTrailer(initialChapterId) {
    var game = gameRef || window.__superBearGame;
    if (!game || !game.scene || !game.camera) {
      console.warn("⚠️ Game not initialized for movie trailer!");
      return;
    }

    var THREE = window.THREE;
    var targetChapId = initialChapterId || 1;
    subterraneanMovieState.isActive = true;
    subterraneanMovieState.isPaused = false;
    subterraneanMovieState.currentChapter = targetChapId;
    var chap = MOVIE_CHAPTER_DATA[targetChapId - 1];
    subterraneanMovieState.elapsedTime = chap.timeStart;

    console.log("🎬 [20:00 Movie Director] Starting 3D Subterranean Cutscene Trailer at Chapter " + targetChapId);

    // Hide gameplay player bear during movie cutscene
    if (game.playerBear && game.playerBear.root) {
      game.playerBear.root.visible = false;
    }

    // Build the 3D scene set
    buildMovieChapter3DScene(game, targetChapId);

    // Camera target vectors
    subterraneanMovieState.camTargetPos = new THREE.Vector3(chap.camPos.x, chap.camPos.y, chap.camPos.z);
    subterraneanMovieState.camLookTarget = new THREE.Vector3(chap.camTarget.x, chap.camTarget.y, chap.camTarget.z);

    // Hook main game update loop so camera is locked to cinematic director
    if (!subterraneanMovieState.origGameUpdate) {
      subterraneanMovieState.origGameUpdate = game.update;
    }

    game.update = function(dt, time) {
      if (game.camera && subterraneanMovieState.camTargetPos && subterraneanMovieState.camLookTarget) {
        game.camera.position.lerp(subterraneanMovieState.camTargetPos, 0.08);
        game.camera.lookAt(subterraneanMovieState.camLookTarget);
      }
    };

    // Start movie audio
    playMovieCinematicAudio(chap.theme);

    // Broadcast state to React UI
    window.dispatchEvent(new CustomEvent('superbear:movie-chapter-change', {
      detail: { chapter: chap, currentTime: subterraneanMovieState.elapsedTime }
    }));

    // Start animation loop for camera & actors
    runSubterraneanMovieLoop(game);
  }

  // Animation update loop for movie cinematic camera and action
  function runSubterraneanMovieLoop(game) {
    if (subterraneanMovieState.movieAnimFrame) {
      cancelAnimationFrame(subterraneanMovieState.movieAnimFrame);
    }

    function movieTick() {
      if (!subterraneanMovieState.isActive) return;

      var THREE = window.THREE;
      var chap = MOVIE_CHAPTER_DATA[subterraneanMovieState.currentChapter - 1];

      // Lock player inputs during cinematic cutscene (hands-free movie mode)
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

      if (!subterraneanMovieState.isPaused) {
        subterraneanMovieState.elapsedTime += (0.016 * subterraneanMovieState.playbackSpeed);

        // Periodically notify UI of precise time
        if (Math.random() < 0.2) {
          window.dispatchEvent(new CustomEvent('superbear:movie-time-update', {
            detail: { currentTime: subterraneanMovieState.elapsedTime }
          }));
        }

        // Check if chapter progressed
        if (subterraneanMovieState.elapsedTime >= chap.timeEnd) {
          if (subterraneanMovieState.currentChapter < 9) {
            subterraneanMovieState.currentChapter++;
            var nextChap = MOVIE_CHAPTER_DATA[subterraneanMovieState.currentChapter - 1];
            buildMovieChapter3DScene(game, subterraneanMovieState.currentChapter);
            playMovieCinematicAudio(nextChap.theme);
            window.dispatchEvent(new CustomEvent('superbear:movie-chapter-change', {
              detail: { chapter: nextChap, currentTime: subterraneanMovieState.elapsedTime }
            }));
          } else {
            subterraneanMovieState.elapsedTime = 300;
            subterraneanMovieState.isPaused = true;
          }
        }
      }

      var t = subterraneanMovieState.elapsedTime;
      var cMode = subterraneanMovieState.cameraMode;

      // Dynamic Camera Path Director
      if (subterraneanMovieState.camTargetPos && subterraneanMovieState.camLookTarget) {
        var baseCenter = { x: 0, y: 110, z: -45 };
        
        if (cMode === 'cinematic') {
          // Smooth sweeping cinematic dolly orbit around the stage
          var orbitRadius = 24;
          var orbitAngle = t * 0.3;
          subterraneanMovieState.camTargetPos.set(
            baseCenter.x + Math.sin(orbitAngle) * orbitRadius,
            baseCenter.y + 12 + Math.sin(t * 0.6) * 3,
            baseCenter.z + Math.cos(orbitAngle) * orbitRadius
          );
          subterraneanMovieState.camLookTarget.set(baseCenter.x, baseCenter.y + 3, baseCenter.z);
        } else if (cMode === 'action') {
          // Low-angle close-up hero action camera
          subterraneanMovieState.camTargetPos.set(baseCenter.x + Math.sin(t * 0.8) * 8, baseCenter.y + 3.5, baseCenter.z + 14);
          subterraneanMovieState.camLookTarget.set(baseCenter.x, baseCenter.y + 4, baseCenter.z - 6);
        } else if (cMode === 'drone') {
          // Top-down bird's-eye drone sweep
          subterraneanMovieState.camTargetPos.set(baseCenter.x + Math.sin(t * 0.2) * 25, baseCenter.y + 35, baseCenter.z + Math.cos(t * 0.2) * 25);
          subterraneanMovieState.camLookTarget.set(baseCenter.x, baseCenter.y, baseCenter.z);
        } else if (cMode === 'boss') {
          // Dramatic close-up on the boss/enemy
          subterraneanMovieState.camTargetPos.set(baseCenter.x, baseCenter.y + 7, baseCenter.z + 10);
          subterraneanMovieState.camLookTarget.set(baseCenter.x, baseCenter.y + 6, baseCenter.z - 8);
        }

        // Camera shake on roars/earthquakes
        if (chap.id === 1 || chap.id === 2 || chap.id === 9) {
          subterraneanMovieState.camTargetPos.x += (Math.random() - 0.5) * 0.2;
          subterraneanMovieState.camTargetPos.y += (Math.random() - 0.5) * 0.2;
        }
      }

      // Animate 3D Actors
      if (subterraneanMovieState.actorBear) {
        var bear = subterraneanMovieState.actorBear;
        bear.rotation.y = Math.sin(t * 2) * 0.35 + 0.3;
        if (bear.headGroup) bear.headGroup.rotation.y = Math.sin(t * 3) * 0.4;
        if (bear.pawL && bear.pawR) {
          bear.pawL.position.y = 2.2 + Math.sin(t * 5) * 0.5;
          bear.pawR.position.y = 2.2 + Math.cos(t * 5) * 0.5;
        }
      }

      if (subterraneanMovieState.actorCat) {
        var cat = subterraneanMovieState.actorCat;
        cat.rotation.y = -Math.sin(t * 2.5) * 0.35 - 0.3;
        if (cat.headGroup) cat.headGroup.rotation.y = -Math.sin(t * 3.5) * 0.3;
      }

      if (subterraneanMovieState.actorBoss) {
        var boss = subterraneanMovieState.actorBoss;
        if (chap.id === 2) {
          // Magma Worm swaying & lunging
          boss.rotation.y = Math.sin(t * 1.5) * 0.5;
          boss.position.y = 2 + Math.sin(t * 2.2) * 2;
        } else if (chap.id === 3 && boss.drillHead) {
          // Drill Tank spinning drill bit
          boss.drillHead.rotation.z += 0.4;
          boss.position.x = Math.sin(t * 1.2) * 3;
        } else if (chap.id === 4) {
          // Floating crystal rotations
          boss.rotation.y = t * 0.2;
        } else if (chap.id === 7 && boss.sword) {
          // Floating Flaming Sword spinning
          boss.sword.rotation.y = t * 2.0;
          boss.sword.position.y = 7.5 + Math.sin(t * 3.0) * 0.8;
        } else if (chap.id === 9) {
          // Leviathan cosmic breathing & pulsating
          boss.rotation.y = t * 0.4;
          boss.position.y = 7 + Math.sin(t * 1.8) * 3;
        }
      }

      subterraneanMovieState.movieAnimFrame = requestAnimationFrame(movieTick);
    }

    subterraneanMovieState.movieAnimFrame = requestAnimationFrame(movieTick);
  }

  // Stop Movie Mode and restore gameplay
  function stopSubterraneanMovieTrailer() {
    var game = gameRef || window.__superBearGame;
    subterraneanMovieState.isActive = false;
    subterraneanMovieState.isPaused = false;
    if (subterraneanMovieState.movieAnimFrame) {
      cancelAnimationFrame(subterraneanMovieState.movieAnimFrame);
    }

    console.log("🎬 [20:00 Movie Director] Stopped Movie Mode.");

    // Restore gameplay bear
    if (game && game.playerBear && game.playerBear.root) {
      game.playerBear.root.visible = true;
    }

    // Restore original game update function
    if (game && subterraneanMovieState.origGameUpdate) {
      game.update = subterraneanMovieState.origGameUpdate;
      subterraneanMovieState.origGameUpdate = null;
    }

    // Remove cutscene 3D scene from Three.js scene
    if (game && game.scene && subterraneanMovieState.activeSceneGroup) {
      game.scene.remove(subterraneanMovieState.activeSceneGroup);
      subterraneanMovieState.activeSceneGroup = null;
    }

    window.dispatchEvent(new CustomEvent('superbear:movie-stopped'));
  }

  // Helper to jump to a specific chapter
  function setSubterraneanMovieChapter(chapterId) {
    var game = gameRef || window.__superBearGame;
    if (!game) return;
    var targetId = Math.max(1, Math.min(9, chapterId));
    subterraneanMovieState.currentChapter = targetId;
    var chap = MOVIE_CHAPTER_DATA[targetId - 1];
    subterraneanMovieState.elapsedTime = chap.timeStart;
    subterraneanMovieState.isPaused = false;

    buildMovieChapter3DScene(game, targetId);
    playMovieCinematicAudio(chap.theme);

    window.dispatchEvent(new CustomEvent('superbear:movie-chapter-change', {
      detail: { chapter: chap, currentTime: chap.timeStart }
    }));
  }

  // Helper to set playback speed
  function setSubterraneanMovieSpeed(speed) {
    subterraneanMovieState.playbackSpeed = speed;
  }

  // Helper to toggle pause
  function toggleSubterraneanMoviePause() {
    subterraneanMovieState.isPaused = !subterraneanMovieState.isPaused;
    return subterraneanMovieState.isPaused;
  }

  // Helper to set camera mode
  function setSubterraneanMovieCameraMode(mode) {
    subterraneanMovieState.cameraMode = mode;
  }

  // Expose Movie Director globally
  window.__superBearSubterraneanMovieDirector = {
    start: startSubterraneanMovieTrailer,
    stop: stopSubterraneanMovieTrailer,
    setChapter: setSubterraneanMovieChapter,
    setSpeed: setSubterraneanMovieSpeed,
    togglePause: toggleSubterraneanMoviePause,
    setCameraMode: setSubterraneanMovieCameraMode,
    getState: function() { return subterraneanMovieState; }
  };

  // --- 20:00 SUBTERRANEAN WORLD GROUND RUPTURE & ABYSS FALL SEQUENCE ---
  function triggerSubterraneanRupture() {
    startSubterraneanMovieTrailer(1);
  }

  // Expose global enhancer controller API for React HUD
  window.__superBearSpaceEnhancer = {
    triggerJump,
    triggerEmote,
    teleportDash,
    shootLaser,
    sprayPaint,
    toggleAlienCompanion,
    teleportToSpace,
    teleportToSugarWorld,
    teleportToJokerooms,
    teleportToRuinVillage,
    teleportToDinosaurWorld,
    teleportToGoldenSanctuary,
    teleportToWaterCave,
    teleportToBeeDesert,
    triggerSubterraneanRupture,
    openCatShop: () => window.dispatchEvent(new CustomEvent('superbear:open-cat-shop')),
    openArcade: () => window.dispatchEvent(new CustomEvent('superbear:open-arcade-games')),
    updateAliensRescued: (count) => {
        spaceState.aliensRescued = Math.min(spaceState.maxAliens, spaceState.aliensRescued + count);
        if (spaceState.aliensRescued >= spaceState.maxAliens) {
            spaceState.lairUnlocked = true;
        }
        notifySpaceState();
        if (gameRef && gameRef.callbacks && gameRef.callbacks.onShowNotice) {
            gameRef.callbacks.onShowNotice(`👽 ${count} Uzaylı Kurtarıldı! Toplam: (${spaceState.aliensRescued}/${spaceState.maxAliens})`);
        }
    },
    getSpaceState: () => ({ ...spaceState })
  };
}

enhanceGame();
