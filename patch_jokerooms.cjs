const fs = require("fs");

console.log("Starting Jokerooms (12. Bölüm: Şaka Odaları) patch...");

// ==========================================
// 1. PATCH game-bundle.js
// ==========================================
let bundle = fs.readFileSync("public/game-bundle.js", "utf8");

// A. Regions array
if (!bundle.includes('id: "jokerooms"')) {
  const newRegionObj = `,
  {
    id: "jokerooms",
    titleTr: "12. Bölüm: Jokerooms (Şaka Odaları)",
    color: "#eab308",
    icon: "🚪",
    hasHardcoreMode: !1,
    recommendedLevel: 11,
    isUnlocked: !0,
    description: "Sonsuz sarı koridorlar, vızıldayan floresan lambalar, komik şaka tabelaları, kaygan muz kabukları ve sonu olmayan gizemli şaka labirenti!",
    collectiblesFound: 0,
    totalCollectibles: 50,
    bossDefeated: !1,
    hardcoreCompletedNoDamage: !1
  }`;
  
  // Find sugar_world in regions array
  const sugarRegIdx = bundle.indexOf('id: "sugar_world"');
  if (sugarRegIdx !== -1) {
    const sugarObjEnd = bundle.indexOf("}", bundle.indexOf("hardcoreCompletedNoDamage: !1", sugarRegIdx)) + 1;
    bundle = bundle.substring(0, sugarObjEnd) + newRegionObj + bundle.substring(sugarObjEnd);
    console.log("Added jokerooms to regions array in bundle.");
  }
}

// B. STORY_CHAPTER_DATA
if (!bundle.includes('12. Bölüm: Jokerooms')) {
  const newChapterObj = `,
  {
    id: "jokerooms",
    chapterNum: 12,
    title: "12. Bölüm: Jokerooms (Şaka Odaları)",
    target: "Sonsuz Sarı Koridorlar Labirentini Keşfet ve Şaka Kristalini Bul!",
    desc: "Vızıldayan sarı koridorların, gizemli kapıların ve kahkaha seslerinin ardındaki sonu olmayan labirent! Muz kabuklarından kay, komik tabelaları oku, lastik ördekleri topla ve Şakacı Palyaço Gözcüsü'nden 12. Kutsal Şaka Bal Kristali'ni kazan!",
    icon: "🚪",
    regionName: "Jokerooms (Şaka Odaları) 🟡",
    crystalId: "crystal_joker",
    crystalName: "Kutsal Şaka & Kahkaha Bal Kristali",
    crystalIcon: "🟡",
    bossName: "Şakacı Palyaço Gözcüsü & Sonsuz Koridor Muhafızı"
  }`;

  const sugarChapterIdx = bundle.indexOf('chapterNum: 11');
  if (sugarChapterIdx !== -1) {
    const sugarChapterEnd = bundle.indexOf("}", bundle.indexOf('bossName: "Lolipop Boss"', sugarChapterIdx)) + 1;
    bundle = bundle.substring(0, sugarChapterEnd) + newChapterObj + bundle.substring(sugarChapterEnd);
    console.log("Added chapter 12 to STORY_CHAPTER_DATA.");
  }
}

// C. storyInfoMap
if (!bundle.includes('jokerooms: { crystalId: "crystal_joker"')) {
  const newInfoMapStr = `,
    jokerooms: { crystalId: "crystal_joker", title: "🟡 Kutsal Şaka & Kahkaha Bal Kristali Kurtarıldı!", desc: "Jokerooms'un sonu olmayan sonsuz sarı koridorlarında kaybolmadan kahkaha kristaline ulaştın!", icon: "🟡", quote: "Hahaha! Sonsuz sarı koridorlarda bile yolunu kaybetmedin Süper Ayı! Efsanevi Şaka Ustası unvanı senin! 🤡✨", quoteAuthor: "🤡 Şakacı Palyaço Gözcüsü" }`;

  const sugarInfoIdx = bundle.indexOf('sugar_world: { crystalId:');
  if (sugarInfoIdx !== -1) {
    const sugarInfoEnd = bundle.indexOf("}", bundle.indexOf('quoteAuthor: "🍬 Şeker Kraliçesi"', sugarInfoIdx)) + 1;
    bundle = bundle.substring(0, sugarInfoEnd) + newInfoMapStr + bundle.substring(sugarInfoEnd);
    console.log("Added jokerooms to storyInfoMap.");
  }
}

// D. Region unlock chain
const oldUnlock = `L==="dinosaur_world"&&ie.id==="sugar_world"?{...ie,isUnlocked:!0}:ie))`;
const newUnlock = `L==="dinosaur_world"&&ie.id==="sugar_world"?{...ie,isUnlocked:!0}:L==="sugar_world"&&ie.id==="jokerooms"?{...ie,isUnlocked:!0}:ie));
  if (L === "jokerooms") {
    const K = { id: "hat_jester_master", name: "Efsanevi Jokerooms Şakacı Şapkası & Pelerini", slot: "hat", rarity: "legendary", icon: "🤡", stats: { speed: 10, maxHp: 150, defense: 40 }, meshType: "hat", color: "#facc15", unlocked: !0, description: "Sonsuz sarı şaka labirentini keşfeden Süper Ayı'nın efsanevi kahkaha tacı!" };
    p(ie => [...ie.filter(ue => ue.id !== K.id), K]);
    Ce("🎉 BÜYÜK ŞAKA ZAFERİ! Jokerooms Labirenti Keşfedildi ve Efsanevi Şakacı Şapkası Kazandın!");
  }`;

if (bundle.includes(oldUnlock) && !bundle.includes('ie.id==="jokerooms"')) {
  bundle = bundle.replace(oldUnlock, newUnlock);
  console.log("Updated unlock chain for jokerooms.");
}

// E. StoryBookModal total crystals count and unlock conditions
bundle = bundle.replace(/const totalCrystalsCount = \d+;/, `const totalCrystalsCount = 12;`);
bundle = bundle.replace(/"💎 Kutsal Bal Kristalleri \(", collectedCount, "\/\d+\)"/, `"💎 Kutsal Bal Kristalleri (", collectedCount, "/12)"`);

const oldModalCheck = `|| (ch.id === "sugar_world" && (storyCrystals || []).includes("crystal_dino"))
                    || currentRegionId === ch.id;`;
const newModalCheck = `|| (ch.id === "sugar_world" && (storyCrystals || []).includes("crystal_dino"))
                    || (ch.id === "jokerooms" && (storyCrystals || []).includes("crystal_sugar"))
                    || currentRegionId === ch.id;`;

if (bundle.includes(oldModalCheck)) {
  bundle = bundle.replace(oldModalCheck, newModalCheck);
  console.log("Updated StoryBookModal unlock check.");
} else {
  // If sugar_world was not previously in the modal unlock list, let's insert both
  const oldDinoModalCheck = `|| (ch.id === "dinosaur_world" && (storyCrystals || []).includes("crystal_time"))
                    || currentRegionId === ch.id;`;
  const newDinoModalCheck = `|| (ch.id === "dinosaur_world" && (storyCrystals || []).includes("crystal_time"))
                    || (ch.id === "sugar_world" && (storyCrystals || []).includes("crystal_dino"))
                    || (ch.id === "jokerooms" && (storyCrystals || []).includes("crystal_sugar"))
                    || currentRegionId === ch.id;`;
  if (bundle.includes(oldDinoModalCheck)) {
    bundle = bundle.replace(oldDinoModalCheck, newDinoModalCheck);
    console.log("Updated StoryBookModal with sugar_world & jokerooms.");
  }
}

// F. Ww(r) bounds
const oldBounds = `else if (r === "volcano_cave" || r === "underwater_palace" || r === "golden_sanctuary" || r === "sugar_world") bounds = { minX: -180, maxX: 180, minZ: -250, maxZ: 180, minY: -30, maxY: 160 };`;
const newBounds = `else if (r === "volcano_cave" || r === "underwater_palace" || r === "golden_sanctuary" || r === "sugar_world") bounds = { minX: -180, maxX: 180, minZ: -250, maxZ: 180, minY: -30, maxY: 160 };  else if (r === "jokerooms") bounds = { minX: -500, maxX: 500, minZ: -500, maxZ: 500, minY: -10, maxY: 100 };`;

if (bundle.includes(oldBounds) && !bundle.includes('r === "jokerooms") bounds')) {
  bundle = bundle.replace(oldBounds, newBounds);
  console.log("Updated Ww(r) bounds for jokerooms.");
}

fs.writeFileSync("public/game-bundle.js", bundle, "utf8");
console.log("game-bundle.js updated successfully!");
