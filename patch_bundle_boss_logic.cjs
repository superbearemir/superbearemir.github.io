const fs = require('fs');

console.log("🛠️ Starting game-bundle.js Boss Auto-Music and 3D Overhead HP Bar Hook Patch...");

let code = fs.readFileSync('public/game-bundle.js', 'utf8');

// Target string in game-bundle.js where active boss is found
const oldActiveBossSnippet = `const x=(this.currentLevel.enemies||[]).find(v=>v.isBoss&&v.hp>0&&v.pos.distanceTo(this.playerPos)<42);x?(S=(b=this.callbacks).onActiveBossChange)==null||S.call(b,{name:x.name,hp:x.hp,maxHp:x.maxHp,type:x.type}):(z=(k=this.callbacks).onActiveBossChange)==null||z.call(k,null);`;

const newActiveBossSnippet = `const x=(this.currentLevel.enemies||[]).find(v=>v.isBoss&&v.hp>0&&v.pos.distanceTo(this.playerPos)<42);
if (x) {
  if (x.mesh && !x.mesh.userData.__overheadHpData && window.__create3DOverheadHpBar && window.THREE) {
    window.__create3DOverheadHpBar(window.THREE, x.mesh, x.name || "PATRON BOSS", x.maxHp || 100, 5.5);
  }
  if (x.mesh && x.mesh.userData.__overheadHpData && window.__update3DOverheadHpBar) {
    window.__update3DOverheadHpBar(x.mesh.userData.__overheadHpData, x.hp, x.maxHp || 100);
  }
  if (typeof St !== "undefined" && St.startMusic && St.currentBgmRegion && !St.currentBgmRegion.includes("boss")) {
    St.startMusic("boss_battle", true);
    if (this.callbacks && this.callbacks.onShowNotice) {
      this.callbacks.onShowNotice("🎵 🔥 HEYECANLI BOSS SAVAŞI MÜZİĞİ BAŞLADI!", "warning");
    }
  }
  (S=(b=this.callbacks).onActiveBossChange)==null||S.call(b,{name:x.name,hp:x.hp,maxHp:x.maxHp,type:x.type});
} else {
  (z=(k=this.callbacks).onActiveBossChange)==null||z.call(k,null);
}`;

if (code.includes(oldActiveBossSnippet)) {
  code = code.replace(oldActiveBossSnippet, newActiveBossSnippet);
  fs.writeFileSync('public/game-bundle.js', code);
  console.log("✅ Successfully patched game-bundle.js active boss detection & auto-music hook!");
} else {
  console.log("⚠️ Could not find exact oldActiveBossSnippet in game-bundle.js, attempting partial match...");
  const altOld = `const x=(this.currentLevel.enemies||[]).find(v=>v.isBoss&&v.hp>0&&v.pos.distanceTo(this.playerPos)<42);`;
  if (code.includes(altOld)) {
    code = code.replace(
      altOld,
      `const x=(this.currentLevel.enemies||[]).find(v=>v.isBoss&&v.hp>0&&v.pos.distanceTo(this.playerPos)<42);
      if(x && x.mesh && !x.mesh.userData.__overheadHpData && window.__create3DOverheadHpBar && window.THREE){
        window.__create3DOverheadHpBar(window.THREE, x.mesh, x.name || "PATRON BOSS", x.maxHp || 100, 5.5);
      }
      if(x && typeof St !== "undefined" && St.startMusic && St.currentBgmRegion && !St.currentBgmRegion.includes("boss")){
        St.startMusic("boss_battle", true);
      }`
    );
    fs.writeFileSync('public/game-bundle.js', code);
    console.log("✅ Successfully patched game-bundle.js with partial match!");
  }
}
