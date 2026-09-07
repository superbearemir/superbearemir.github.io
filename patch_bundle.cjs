const fs = require('fs');

let bundle = fs.readFileSync('public/game-bundle.js', 'utf8');

// 1. Add region to Zw
const regionToAdd = `,  {    id: "dinosaur_world",    titleTr: "Dinozor Dünyası",    color: "#4ade80",    icon: "🦖",    hasHardcoreMode: !1,    recommendedLevel: 9,    isUnlocked: !0,    description: "Devasa T-Rex Boss ve küçük dinozorların bulunduğu tarih öncesi dünya! Parkurları aş ve gücünü kanıtla!",    collectiblesFound: 0,    totalCollectibles: 40,    bossDefeated: !1,    hardcoreCompletedNoDamage: !1  }`;

bundle = bundle.replace(/hardcoreCompletedNoDamage: !1  }\];/, `hardcoreCompletedNoDamage: !1  }${regionToAdd}];`);

// 2. Add chapter to STORY_CHAPTER_DATA
const chapterToAdd = `,  {    id: "dinosaur_world",    chapterNum: 10,    title: "10. Bölüm: Dinozor Dünyası",    target: "Dev T-Rex Boss'u Yen!",    desc: "Tarih öncesi parkurları geç, küçük dinozorlarla yüzleş ve efsanevi Dev T-Rex Boss ile kapış!",    icon: "🦖",    regionName: "Dinozor Dünyası 🦖",    crystalId: "crystal_dino",    crystalName: "Kutsal Dinozor Bal Kristali",    crystalIcon: "🦖",    bossName: "Dev T-Rex Boss"  }`;

bundle = bundle.replace(/bossName: "Kadim Zaman Ejderi & Kozmik Ayı Muhafızı"  }\];/, `bossName: "Kadim Zaman Ejderi & Kozmik Ayı Muhafızı"  }${chapterToAdd}];`);

// 3. Add to storyInfoMap
const storyInfoToAdd = `,    dinosaur_world: { crystalId: "crystal_dino", title: "🦖 Kutsal Dinozor Bal Kristali Kurtarıldı!", desc: "Dinozor Dünyası'ndaki Dev T-Rex Boss mağlup edildi! Küçük dinozorlar artık barış içinde.", icon: "🦖", quote: "Aferin beni yendin ben seni güçsüz bir ayı sanmıştım ama sen çok cesur ve yeteneklisin aferin", quoteAuthor: "🦖 Dev T-Rex Boss" }`;

bundle = bundle.replace(/quoteAuthor: "🌟 Sonsuz Işık Koruyucusu Aether" }};/, `quoteAuthor: "🌟 Sonsuz Işık Koruyucusu Aether" }${storyInfoToAdd}};`);

fs.writeFileSync('public/game-bundle.js', bundle);
console.log('game-bundle.js patched');
