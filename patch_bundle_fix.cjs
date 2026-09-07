const fs = require('fs');

let bundle = fs.readFileSync('public/game-bundle.js', 'utf8');

const regionToAdd = `,  {    id: "dinosaur_world",    titleTr: "Dinozor Dünyası",    color: "#4ade80",    icon: "🦖",    hasHardcoreMode: !1,    recommendedLevel: 9,    isUnlocked: !0,    description: "Devasa T-Rex Boss ve küçük dinozorların bulunduğu tarih öncesi dünya! Parkurları aş ve gücünü kanıtla!",    collectiblesFound: 0,    totalCollectibles: 40,    bossDefeated: !1,    hardcoreCompletedNoDamage: !1  }`;

bundle = bundle.replace('hardcoreCompletedNoDamage: !1  }]', 'hardcoreCompletedNoDamage: !1  }' + regionToAdd + ']');

const chapterToAdd = `,  {    id: "dinosaur_world",    chapterNum: 10,    title: "10. Bölüm: Dinozor Dünyası",    target: "Dev T-Rex Boss'u Yen!",    desc: "Tarih öncesi parkurları geç, küçük dinozorlarla yüzleş ve efsanevi Dev T-Rex Boss ile kapış!",    icon: "🦖",    regionName: "Dinozor Dünyası 🦖",    crystalId: "crystal_dino",    crystalName: "Kutsal Dinozor Bal Kristali",    crystalIcon: "🦖",    bossName: "Dev T-Rex Boss"  }`;

bundle = bundle.replace('bossName: "Kadim Zaman Ejderi & Kozmik Ayı Muhafızı"  }]', 'bossName: "Kadim Zaman Ejderi & Kozmik Ayı Muhafızı"  }' + chapterToAdd + ']');

// Also fix isUnlocked checking
const isUnlockedCheck = '|| (ch.id === "golden_sanctuary" && (storyCrystals || []).includes("crystal_ocean"))';
bundle = bundle.replace(isUnlockedCheck, isUnlockedCheck + '\n                    || (ch.id === "dinosaur_world" && (storyCrystals || []).includes("crystal_time"))');

const isQuestCheck = '|| (ch.id === "golden_sanctuary" && (storyCrystals || []).includes("crystal_ocean") && !(storyCrystals || []).includes("crystal_time"))';
bundle = bundle.replace(isQuestCheck, isQuestCheck + '\n                    || (ch.id === "dinosaur_world" && (storyCrystals || []).includes("crystal_time") && !(storyCrystals || []).includes("crystal_dino"))');

const zMap = ':L==="underwater_palace"&&ie.id==="golden_sanctuary"?{...ie,isUnlocked:!0}:ie';
bundle = bundle.replace(zMap, ':L==="underwater_palace"&&ie.id==="golden_sanctuary"?{...ie,isUnlocked:!0}:L==="golden_sanctuary"&&ie.id==="dinosaur_world"?{...ie,isUnlocked:!0}:ie');

fs.writeFileSync('public/game-bundle.js', bundle);
console.log('game-bundle.js patched thoroughly');
