const fs = require("fs");
let code = fs.readFileSync("public/game-bundle.js", "utf8");

console.log("Starting proper 3 regions addition script...");

// 1. Add 3 regions to regions array
let regIdx = code.indexOf("id: \"space_realm\"");
let regEnd = code.indexOf("];", regIdx);
if (regEnd !== -1 && !code.includes("volcano_cave")) {
  const newRegionsStr = `,
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
  
  // Find the end of space_realm object inside regions array
  let spaceRealmObjEnd = code.lastIndexOf("hardcoreCompletedNoDamage: !1", regEnd);
  let insertPos = code.indexOf("}", spaceRealmObjEnd) + 1;
  code = code.substring(0, insertPos) + newRegionsStr + code.substring(insertPos);
  console.log("Regions array updated successfully.");
}

// 2. Add chapters 7, 8, 9 to STORY_CHAPTER_DATA
let storyIdx = code.indexOf("STORY_CHAPTER_DATA = [");
let storyEnd = code.indexOf("];", storyIdx);
if (storyEnd !== -1 && !code.includes("7. Bölüm: Volkanik Ejderha")) {
  const newChaptersStr = `,
  {
    id: "volcano_cave",
    chapterNum: 7,
    title: "7. Bölüm: Volkanik Ejderha Mağarası & Kızıl Ignis",
    target: "Lav Vadisindeki Kızıl Ejderha Ignis'i Yık!",
    desc: "Kıpkırmızı akan lav derenin üstündeki bazalt taş platformları, devasa hareketli kolonları ve alev gayzerlerini aş. 6. Kutsal Lav Ateşi Bal Kristali'ni ejderhanın pençesinden kurtar! Mağaranın sonunda Ignis ile destansı bir savaş seni bekliyor.",
    icon: "🌋",
    regionName: "Volkanik Ejderha Mağarası 🌋",
    crystalId: "crystal_volcano",
    crystalName: "Kutsal Lav Ateşi Bal Kristali",
    crystalIcon: "🔴",
    bossName: "Kızıl Alev Ejderhası Ignis"
  },
  {
    id: "underwater_palace",
    chapterNum: 8,
    title: "8. Bölüm: Antik Su Altı Sarayı & Dev Neptün Kraken",
    target: "Okyanus Zindanındaki Dev Neptün Kraken'i Alt Et!",
    desc: "Işıldayan mercan kayalıkları, zorlu su akıntıları ve su altı kabarcık zıplatıcıları ile labirent gibi derinliklere in. 7. Kutsal Okyanus Dalgası Bal Kristali'ni krakenin kollarından al! Dev Kraken'in su altı arena savaşına hazırlan.",
    icon: "🌊",
    regionName: "Antik Su Altı Kristal Sarayı 🌊",
    crystalId: "crystal_ocean",
    crystalName: "Kutsal Okyanus Dalgası Bal Kristali",
    crystalIcon: "🌊",
    bossName: "Dev Neptün Kraken & Derin Su Lordu"
  },
  {
    id: "golden_sanctuary",
    chapterNum: 9,
    title: "9. Bölüm: Efsanevi Altın Cenneti & Zaman Ejderi",
    target: "Zaman Arenasındaki Kadim Zaman Ejderini Yık!",
    desc: "Tüm kristallerin birleştiği sonsuz altın cennetine tırman! Hareket eden ışık platformları ve yerçekimsiz bölgeleri aş! Kadim Zaman Ejderi'ni alt ederek Son 8. Kutsal Bal Kristali'ni birleştir ve Evren Şöleni'ni başlat!",
    icon: "🌟",
    regionName: "Altın Cenneti & Zaman Arenası 🌟",
    crystalId: "crystal_time",
    crystalName: "Efsanevi Sonsuz Zaman Bal Kristali",
    crystalIcon: "🌟",
    bossName: "Kadim Zaman Ejderi & Kozmik Ayı Muhafızı"
  }`;

  let cosmicObjEnd = code.lastIndexOf("bossName: \"Galaksi İblisi Kozmik Lord\"", storyEnd);
  let insertPos = code.indexOf("}", cosmicObjEnd) + 1;
  code = code.substring(0, insertPos) + newChaptersStr + code.substring(insertPos);
  console.log("STORY_CHAPTER_DATA updated successfully.");
}

// 3. Update storyInfoMap
let infoMapIdx = code.indexOf("const storyInfoMap = {");
let infoMapEnd = code.indexOf("};", infoMapIdx);
if (infoMapEnd !== -1 && !code.includes("volcano_cave: { crystalId: \"crystal_volcano\"")) {
  const newInfoMapStr = `,
    volcano_cave: { crystalId: "crystal_volcano", title: "🔴 Kutsal Lav Ateşi Bal Kristali Kurtarıldı!", desc: "Volkanik Ejderha Mağarası'ndaki Kızıl Alev Ejderhası Ignis mağlup edildi! Lav şelalelerinin ateşi dindi.", icon: "🌋", quote: "Roaar! Alevler senin cesur yüreğinin karşısında pes etti kahraman ayı!", quoteAuthor: "🌋 Ejderha Mağarası Muhafızı" },
    underwater_palace: { crystalId: "crystal_ocean", title: "🌊 Kutsal Okyanus Dalgası Bal Kristali Kurtarıldı!", desc: "Antik Su Altı Kristal Sarayı'ndaki Dev Neptün Kraken yenildi! Okyanusun suları berraklaştı.", icon: "🌊", quote: "Miyav-gurur! Su altı sarayının ışığı yeniden parıldıyor!", quoteAuthor: "🪸 Dalgıç Kedi Dobby" },
    golden_sanctuary: { crystalId: "crystal_time", title: "🌟 Kutsal Sonsuz Zaman Bal Kristali & Büyük Şölen!", desc: "Efsanevi Altın Cenneti Zaman Arenası'ndaki Kadim Zaman Ejderi mağlup edildi! Tüm 8 Kutsal Bal Kristali birleşti!", icon: "🌟", quote: "Zamanın ve mekânın ötesindeki en büyük kahraman Süper Ayı! Evren sana minnettar! 👑🐻✨", quoteAuthor: "🌟 Sonsuz Işık Koruyucusu Aether" }`;
  
  let spaceInfoEnd = code.lastIndexOf("quoteAuthor: \"🐱 Kedi Boncuk\"", infoMapEnd);
  let insertPos = code.indexOf("}", spaceInfoEnd) + 1;
  code = code.substring(0, insertPos) + newInfoMapStr + code.substring(insertPos);
  console.log("storyInfoMap updated successfully.");
}

// 4. Update je unlock sequence
let oldJeUnlock = `:L==="snow_desert"&&ie.id==="space_realm"?{...ie,isUnlocked:!0}:ie))`;
let newJeUnlock = `:L==="snow_desert"&&ie.id==="space_realm"?{...ie,isUnlocked:!0}:L==="space_realm"&&ie.id==="volcano_cave"?{...ie,isUnlocked:!0}:L==="volcano_cave"&&ie.id==="underwater_palace"?{...ie,isUnlocked:!0}:L==="underwater_palace"&&ie.id==="golden_sanctuary"?{...ie,isUnlocked:!0}:ie));
  if (L === "golden_sanctuary") {
    const K = { id: "cape_infinite_time", name: "Sonsuz Zaman & Işık Pelerini", slot: "cape", rarity: "legendary", icon: "🌟", stats: { defense: 35, speed: 5, maxHp: 100 }, meshType: "cape", color: "#eab308", unlocked: !0, description: "Tüm 8 Kutsal Bal Kristali'ni birleştirerek evrenin şampiyonu olan Süper Ayı'nın pelerini!" };
    p(ie => [...ie.filter(ue => ue.id !== K.id), K]);
    Ce("🎉 BÜYÜK EFSANEVİ ZAFER! Tüm 8 Bal Kristali Kurtarıldı ve Sonsuz Zaman Pelerini Kazandın!");
  }`;

if (code.includes(oldJeUnlock) && !code.includes("golden_sanctuary")) {
  code = code.replace(oldJeUnlock, newJeUnlock);
  console.log("je unlock sequence updated successfully.");
}

// 5. Update spawnBossPortalForCurrentRegion
let oldPortal = `:this.currentRegion==="space_realm"&&(targetRegion="hub",targetName="Ana Merkez Vadisi (Tebrikler!)",portalPos=bossPos?bossPos.clone().add(new Y(0,0,-18)):new Y(0,20,-198))`;
let newPortal = `:this.currentRegion==="space_realm"?(targetRegion="volcano_cave",targetName="Volkanik Ejderha Mağarası",portalPos=bossPos?bossPos.clone().add(new Y(0,0,-18)):new Y(0,20,-198))
:this.currentRegion==="volcano_cave"?(targetRegion="underwater_palace",targetName="Antik Su Altı Kristal Sarayı",portalPos=bossPos?bossPos.clone().add(new Y(0,0,-18)):new Y(0,18,-145))
:this.currentRegion==="underwater_palace"?(targetRegion="golden_sanctuary",targetName="Efsanevi Altın Cenneti & Zaman Arenası",portalPos=bossPos?bossPos.clone().add(new Y(0,0,-18)):new Y(0,20,-155))
:this.currentRegion==="golden_sanctuary"&&(targetRegion="hub",targetName="Ana Merkez Vadisi (Büyük Zafer!)",portalPos=bossPos?bossPos.clone().add(new Y(0,0,-18)):new Y(0,24,-175))`;

if (code.includes(oldPortal)) {
  code = code.replace(oldPortal, newPortal);
  console.log("spawnBossPortalForCurrentRegion updated successfully.");
}

// 6. Update StoryBookModal counts and unlock conditions
code = code.replace(`const totalCrystalsCount = 5;`, `const totalCrystalsCount = 8;`);
code = code.replace(`"💎 Kutsal Bal Kristalleri (", collectedCount, "/5)"`, `"💎 Kutsal Bal Kristalleri (", collectedCount, "/8)"`);

let oldModalUnlock = `|| (ch.id === "space_realm" && (storyCrystals || []).includes("crystal_snow"))
                    || currentRegionId === ch.id;`;
let newModalUnlock = `|| (ch.id === "space_realm" && (storyCrystals || []).includes("crystal_snow"))
                    || (ch.id === "volcano_cave" && (storyCrystals || []).includes("crystal_cosmic"))
                    || (ch.id === "underwater_palace" && (storyCrystals || []).includes("crystal_volcano"))
                    || (ch.id === "golden_sanctuary" && (storyCrystals || []).includes("crystal_ocean"))
                    || currentRegionId === ch.id;`;

if (code.includes(oldModalUnlock) && !code.includes("crystal_volcano")) {
  code = code.replace(oldModalUnlock, newModalUnlock);
  console.log("StoryBookModal isUnlocked updated successfully.");
}

let oldActiveStr = `!(storyCrystals || []).includes("crystal_cosmic"))`;
let newActiveStr = `!(storyCrystals || []).includes("crystal_cosmic")) ||
                    (ch.id === "volcano_cave" && (storyCrystals || []).includes("crystal_cosmic") && !(storyCrystals || []).includes("crystal_volcano")) ||
                    (ch.id === "underwater_palace" && (storyCrystals || []).includes("crystal_volcano") && !(storyCrystals || []).includes("crystal_ocean")) ||
                    (ch.id === "golden_sanctuary" && (storyCrystals || []).includes("crystal_ocean") && !(storyCrystals || []).includes("crystal_time"))`;

if (code.includes(oldActiveStr) && !code.includes("crystal_volcano")) {
  code = code.replace(oldActiveStr, newActiveStr);
  console.log("StoryBookModal isCurrentActive updated successfully.");
}

fs.writeFileSync("public/game-bundle.js", code, "utf8");
console.log("Proper 3 regions addition script completed!");
