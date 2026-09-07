const fs = require("fs");

console.log("🚀 Starting Chapter 13: Yıkılmış Köy & Jokerooms Palyaço Boss patch...");

// ==========================================
// 1. PATCH game-bundle.js
// ==========================================
let bundle = fs.readFileSync("public/game-bundle.js", "utf8");

// A. Regions array
if (!bundle.includes('id: "ruin_village"')) {
  const newRegionObj = `,
  {
    id: "ruin_village",
    titleTr: "13. Bölüm: Yıkılmış Köy (Tehlikeli Parkur)",
    color: "#dc2626",
    icon: "🏚️",
    hasHardcoreMode: !1,
    recommendedLevel: 12,
    isUnlocked: !0,
    description: "Terkedilmiş yıkılmış köyün harabelerinde tehlikeli tabelalara aldırmadan zorlu parkurları geç! Yıkılan çatılar, alev çukurları ve devasa fırlatıcı gayzerleri aşarak Jokerooms Circus Arenası'nda elleri ve ayakları olan Dev Palyaço Boss ile yüzleş!",
    collectiblesFound: 0,
    totalCollectibles: 50,
    bossDefeated: !1,
    hardcoreCompletedNoDamage: !1
  }`;
  
  const jokerRegIdx = bundle.indexOf('id: "jokerooms"');
  if (jokerRegIdx !== -1) {
    const jokerObjEnd = bundle.indexOf("}", bundle.indexOf("hardcoreCompletedNoDamage: !1", jokerRegIdx)) + 1;
    bundle = bundle.substring(0, jokerObjEnd) + newRegionObj + bundle.substring(jokerObjEnd);
    console.log("✅ Added ruin_village to regions array in bundle.");
  }
}

// B. STORY_CHAPTER_DATA
if (!bundle.includes('13. Bölüm: Yıkılmış Köy')) {
  const newChapterObj = `,
  {
    id: "ruin_village",
    chapterNum: 13,
    title: "13. Bölüm: Yıkılmış Köy (Tehlikeli Parkur)",
    target: "Uyarı Tabelalarını Dinleme, Yıkılmış Köy Parkurlarını Geç ve Dev Palyaço Boss'u Yene!",
    desc: "Tabelalarda 'Bu parkurdan sakın geçmeyin, güvensiz!' yazıyor ama biz dinlemiyoruz! Yıkılan çatıların, alev çukurlarının ve dönen bıçakların arasından geçerek Jokerooms Circus Arenası'nda elleri ve ayakları olan Dev Palyaço ile dövüş!",
    icon: "🏚️",
    regionName: "Yıkılmış Köy 🏚️",
    crystalId: "crystal_ruin_village",
    crystalName: "Kutsal Yıkıntı & Cesaret Bal Kristali",
    crystalIcon: "🏚️",
    bossName: "Jokerooms Dev Palyaço Boss (Elleri & Ayakları Var)"
  }`;

  const jokerChapterIdx = bundle.indexOf('chapterNum: 12');
  if (jokerChapterIdx !== -1) {
    const jokerChapterEnd = bundle.indexOf("}", bundle.indexOf('bossName:', jokerChapterIdx)) + 1;
    bundle = bundle.substring(0, jokerChapterEnd) + newChapterObj + bundle.substring(jokerChapterEnd);
    console.log("✅ Added chapter 13 to STORY_CHAPTER_DATA.");
  }
}

// C. storyInfoMap
if (!bundle.includes('ruin_village: { crystalId: "crystal_ruin_village"')) {
  const newInfoMapStr = `,
    ruin_village: { crystalId: "crystal_ruin_village", title: "🏚️ Kutsal Yıkıntı & Cesaret Bal Kristali Kurtarıldı!", desc: "Yıkılmış Köy'ün tehlikeli uyarı tabelalarını dinlemeyip zorlu parkurları geçtin ve Dev Palyaço Boss'u mağlup ettin!", icon: "🏚️", quote: "İnanılmaz bir cesaret! Bütün tehlike uyarılarına rağmen vazgeçmedin ve Jokerooms Palyaço Boss'unu devirdin! Efsanevi Yıkıntı Kahramanı sensin! 🎪🤡💥", quoteAuthor: "🏚️ Yıkılmış Köy Yaşlısı" }`;

  const jokerInfoIdx = bundle.indexOf('jokerooms: { crystalId:');
  if (jokerInfoIdx !== -1) {
    const jokerInfoEnd = bundle.indexOf("}", bundle.indexOf('quoteAuthor:', jokerInfoIdx)) + 1;
    bundle = bundle.substring(0, jokerInfoEnd) + newInfoMapStr + bundle.substring(jokerInfoEnd);
    console.log("✅ Added ruin_village to storyInfoMap.");
  }
}

// D. Region unlock chain & rewards
const oldUnlockJoker = `L==="sugar_world"&&ie.id==="jokerooms"?{...ie,isUnlocked:!0}:ie));`;
const newUnlockRuin = `L==="sugar_world"&&ie.id==="jokerooms"?{...ie,isUnlocked:!0}:L==="jokerooms"&&ie.id==="ruin_village"?{...ie,isUnlocked:!0}:ie));
  if (L === "ruin_village") {
    const K13 = { id: "hat_ruin_hero", name: "Efsanevi Yıkılmış Köy Savaşçısı Pelerini & Kaskı", slot: "hat", rarity: "legendary", icon: "🏚️", stats: { speed: 12, maxHp: 200, defense: 50 }, meshType: "hat", color: "#dc2626", unlocked: !0, description: "Yıkılmış Köy'ün tehlikeli parkurlarını aşıp Dev Palyaço'yu yenen kahramanın efsanevi zırhı!" };
    p(ie => [...ie.filter(ue => ue.id !== K13.id), K13]);
    Ce("🎉 EFSANEVİ PARKUR ZAFERİ! Yıkılmış Köy Geçildi, Jokerooms Palyaço Boss Yenildi ve Efsanevi Yıkıntılar Kaskı Kazandın!");
  }`;

if (bundle.includes(oldUnlockJoker) && !bundle.includes('ie.id==="ruin_village"')) {
  bundle = bundle.replace(oldUnlockJoker, newUnlockRuin);
  console.log("✅ Updated unlock chain for ruin_village.");
}

// E. StoryBookModal total crystals count and unlock conditions
bundle = bundle.replace(/const totalCrystalsCount = \d+;/g, `const totalCrystalsCount = 13;`);
bundle = bundle.replace(/collectedCount, "\/\d+"\)/g, 'collectedCount, "/13")');

const oldModalCheck12 = `|| (ch.id === "jokerooms" && (storyCrystals || []).includes("crystal_sugar"))
                    || currentRegionId === ch.id;`;
const newModalCheck13 = `|| (ch.id === "jokerooms" && (storyCrystals || []).includes("crystal_sugar"))
                    || (ch.id === "ruin_village" && (storyCrystals || []).includes("crystal_joker"))
                    || currentRegionId === ch.id;`;

if (bundle.includes(oldModalCheck12)) {
  bundle = bundle.replace(oldModalCheck12, newModalCheck13);
  console.log("✅ Updated StoryBookModal unlock check for ruin_village.");
}

// F. Bounds for ruin_village
const oldJokerBounds = `else if (r === "jokerooms") bounds = { minX: -500, maxX: 500, minZ: -500, maxZ: 500, minY: -10, maxY: 100 };`;
const newRuinBounds = `else if (r === "jokerooms") bounds = { minX: -500, maxX: 500, minZ: -500, maxZ: 500, minY: -10, maxY: 100 };  else if (r === "ruin_village") bounds = { minX: -600, maxX: 600, minZ: -600, maxZ: 600, minY: -20, maxY: 300 };`;

if (bundle.includes(oldJokerBounds) && !bundle.includes('r === "ruin_village") bounds')) {
  bundle = bundle.replace(oldJokerBounds, newRuinBounds);
  console.log("✅ Updated Ww(r) bounds for ruin_village.");
}

fs.writeFileSync("public/game-bundle.js", bundle, "utf8");
console.log("🎉 game-bundle.js updated successfully!");
