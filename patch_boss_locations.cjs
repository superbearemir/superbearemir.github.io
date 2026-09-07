const fs = require('fs');

console.log('=== Patching Boss Locations & AI Center ===');

let bundleCode = fs.readFileSync('public/game-bundle.js', 'utf8');

// 1. Fix Pelican Boss AI flight orbit center from old (0,15,-46) to new (0,36.5,-180)
const oldPelicanAiCenter = 'else if(v.type==="pelican_boss"){const N=new Y(0,15,-46)';
const newPelicanAiCenter = 'else if(v.type==="pelican_boss"){const N=new Y(0,36.5,-180)';

if (!bundleCode.includes(oldPelicanAiCenter)) {
  console.error('Could not find oldPelicanAiCenter in bundleCode!');
  process.exit(1);
}

bundleCode = bundleCode.replace(oldPelicanAiCenter, newPelicanAiCenter);
console.log('✓ Updated Pelican Boss AI flight center to (0, 36.5, -180)');

// 2. Fix portal fallback positions in spawnBossPortalForCurrentRegion
const oldPelicanPortal = 'this.currentRegion==="pelican_plains"?(targetRegion="snow_desert",targetName="Karlı Dağlar & Donmuş Çöl",portalPos=bossPos?bossPos.clone().add(new Y(0,0,-12)):new Y(0,17.5,-58))';
const newPelicanPortal = 'this.currentRegion==="pelican_plains"?(targetRegion="snow_desert",targetName="Karlı Dağlar & Donmuş Çöl",portalPos=bossPos?bossPos.clone().add(new Y(0,0,-12)):new Y(0,38,-192))';

if (bundleCode.includes(oldPelicanPortal)) {
  bundleCode = bundleCode.replace(oldPelicanPortal, newPelicanPortal);
  console.log('✓ Updated pelican_plains portal fallback location');
}

const oldSnowPortal = 'this.currentRegion==="snow_desert"?(targetRegion="beehive",targetName="Vızıldıyan Bal Kovanı",portalPos=bossPos?bossPos.clone().add(new Y(0,0,-12)):new Y(0,15.5,-76))';
const newSnowPortal = 'this.currentRegion==="snow_desert"?(targetRegion="beehive",targetName="Vızıldıyan Bal Kovanı",portalPos=bossPos?bossPos.clone().add(new Y(0,0,-12)):new Y(0,37,-208))';

if (bundleCode.includes(oldSnowPortal)) {
  bundleCode = bundleCode.replace(oldSnowPortal, newSnowPortal);
  console.log('✓ Updated snow_desert portal fallback location');
}

// Add ruin_village portal handling in spawnBossPortalForCurrentRegion if needed
const oldJokeroomsPortal = 'this.currentRegion==="jokerooms"&&(targetRegion="hub",targetName="Ana Merkez Vadisi (Büyük Zafer!)",portalPos=bossPos?bossPos.clone().add(new Y(0,0,-18)):new Y(0,24,-175))';
const newJokeroomsPortal = 'this.currentRegion==="jokerooms"?(targetRegion="ruin_village",targetName="13. Bölüm: Yıkılmış Köy",portalPos=bossPos?bossPos.clone().add(new Y(0,0,-18)):new Y(0,24,-175)):this.currentRegion==="ruin_village"&&(targetRegion="hub",targetName="Ana Merkez Vadisi (Tüm Krallıklar Kurtarıldı!)",portalPos=bossPos?bossPos.clone().add(new Y(0,0,-18)):new Y(0,70,-382))';

if (bundleCode.includes(oldJokeroomsPortal)) {
  bundleCode = bundleCode.replace(oldJokeroomsPortal, newJokeroomsPortal);
  console.log('✓ Updated jokerooms & ruin_village portal progression');
}

fs.writeFileSync('public/game-bundle.js', bundleCode, 'utf8');
console.log('Successfully updated game-bundle.js boss coordinates and AI centers!');
