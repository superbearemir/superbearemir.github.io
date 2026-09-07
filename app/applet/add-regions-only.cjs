const fs = require("fs");
let code = fs.readFileSync("src/game-bundle.js", "utf8");

console.log("Adding 3 regions to regions array...");

let spaceRealmRegionIdx = code.indexOf('id: "space_realm",\n    titleTr: "Final Kozmik Boyut"');
if (spaceRealmRegionIdx === -1) {
  spaceRealmRegionIdx = code.indexOf('id:"space_realm",');
}

if (spaceRealmRegionIdx !== -1) {
  let endObj = code.indexOf('hardcoreCompletedNoDamage: !1\n  }', spaceRealmRegionIdx);
  if (endObj === -1) endObj = code.indexOf('hardcoreCompletedNoDamage:!1}', spaceRealmRegionIdx);
  
  if (endObj !== -1) {
    let insertPos = endObj + 'hardcoreCompletedNoDamage: !1\n  }'.length;
    
    const newRegions = `,
  {
    id: "volcano_cave",
    titleTr: "Volkanik Ejderha Mağarası & Lav Şelaleleri",
    color: "#ef4444",
    icon: "🌋",
    hasHardcoreMode: !0,
    recommendedLevel: 6,
    isUnlocked: !0,
    description: "Akıcı lav nehirleri, bazalt basamaklar, alev gayzerleri ve Kızıl Ejderha Ignis'in koruduğu 6. Kutsal Bal Kristali!",
    collectiblesFound: 0,
    totalCollectibles: 28,
    bossDefeated: !1,
    hardcoreCompletedNoDamage: !1
  },
  {
    id: "underwater_palace",
    titleTr: "Antik Su Altı Kristal Sarayı",
    color: "#06b6d4",
    icon: "🌊",
    hasHardcoreMode: !1,
    recommendedLevel: 7,
    isUnlocked: !0,
    description: "Lüminesans mercan kayalıkları, antik Neptün sütunları, su kabarcık zıplatıcıları ve Dev Kraken'in tutsak ettiği 7. Kristal!",
    collectiblesFound: 0,
    totalCollectibles: 30,
    bossDefeated: !1,
    hardcoreCompletedNoDamage: !1
  },
  {
    id: "golden_sanctuary",
    titleTr: "Efsanevi Altın Cenneti & Zaman Arenası",
    color: "#eab308",
    icon: "🌟",
    hasHardcoreMode: !1,
    recommendedLevel: 8,
    isUnlocked: !0,
    description: "Sonsuz gökyüzündeki altın tapınak, zaman çarkları, gökkuşağı hız yolları ve Kadim Zaman Ejderi'nin sakladığı Son 8. Kristal!",
    collectiblesFound: 0,
    totalCollectibles: 35,
    bossDefeated: !1,
    hardcoreCompletedNoDamage: !1
  }`;
  
    if (!code.includes('id: "volcano_cave",\n    titleTr: "Volkanik Ejderha Mağarası')) {
      code = code.substring(0, insertPos) + newRegions + code.substring(insertPos);
      fs.writeFileSync("src/game-bundle.js", code, "utf8");
      console.log("Successfully added 3 regions to regions array!");
    } else {
      console.log("Regions already exist in regions array.");
    }
  } else {
    console.error("Could not find end of space_realm object in regions array.");
  }
} else {
  console.error("Could not find space_realm region index.");
}
