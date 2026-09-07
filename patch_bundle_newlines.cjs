const fs = require('fs');
let bundle = fs.readFileSync('public/game-bundle.js', 'utf8');

const regionToAdd = `,
  {
    id: "dinosaur_world",
    titleTr: "Dinozor Dünyası",
    color: "#4ade80",
    icon: "🦖",
    hasHardcoreMode: !1,
    recommendedLevel: 9,
    isUnlocked: !0,
    description: "Devasa T-Rex Boss ve küçük dinozorların bulunduğu tarih öncesi dünya! Parkurları aş ve gücünü kanıtla!",
    collectiblesFound: 0,
    totalCollectibles: 40,
    bossDefeated: !1,
    hardcoreCompletedNoDamage: !1
  }`;

bundle = bundle.replace('hardcoreCompletedNoDamage: !1\n  }\n];', 'hardcoreCompletedNoDamage: !1\n  }' + regionToAdd + '\n];');

const chapterToAdd = `,
  {
    id: "dinosaur_world",
    chapterNum: 10,
    title: "10. Bölüm: Dinozor Dünyası",
    target: "Dev T-Rex Boss'u Yen!",
    desc: "Tarih öncesi parkurları geç, küçük dinozorlarla yüzleş ve efsanevi Dev T-Rex Boss ile kapış!",
    icon: "🦖",
    regionName: "Dinozor Dünyası 🦖",
    crystalId: "crystal_dino",
    crystalName: "Kutsal Dinozor Bal Kristali",
    crystalIcon: "🦖",
    bossName: "Dev T-Rex Boss"
  }`;

bundle = bundle.replace('bossName: "Kadim Zaman Ejderi & Kozmik Ayı Muhafızı"\n  }\n];', 'bossName: "Kadim Zaman Ejderi & Kozmik Ayı Muhafızı"\n  }' + chapterToAdd + '\n];');

fs.writeFileSync('public/game-bundle.js', bundle);
console.log('Patched newlines!');
