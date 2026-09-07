const fs = require("fs");
let code = fs.readFileSync("src/game-bundle.js", "utf8");

console.log("Starting 3 regions addition script...");

// 1. Update Zw region array
const oldZwEnd = `    collectiblesFound: 0,
    totalCollectibles: 25,
    bossDefeated: !1,
    hardcoreCompletedNoDamage: !1
  }
];`;

const newZwEnd = `    collectiblesFound: 0,
    totalCollectibles: 25,
    bossDefeated: !1,
    hardcoreCompletedNoDamage: !1
  },
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
  }
];`;

if (!code.includes(oldZwEnd)) {
  console.error("oldZwEnd not found!");
  process.exit(1);
}
code = code.replace(oldZwEnd, newZwEnd);
console.log("Updated Zw array successfully.");

// 2. Update STORY_CHAPTER_DATA
const oldStoryEnd = `    icon: "🌌",
    regionName: "Kozmik Boyut & Zindan 🌌",
    crystalId: "crystal_cosmic",
    crystalName: "Efsanevi Kozmik Galaksi Kristali",
    crystalIcon: "✨",
    bossName: "Galaksi İblisi Kozmik Lord"
  }
];`;

const newStoryEnd = `    icon: "🌌",
    regionName: "Kozmik Boyut & Zindan 🌌",
    crystalId: "crystal_cosmic",
    crystalName: "Efsanevi Kozmik Galaksi Kristali",
    crystalIcon: "✨",
    bossName: "Galaksi İblisi Kozmik Lord"
  },
  {
    id: "volcano_cave",
    chapterNum: 7,
    title: "7. Bölüm: Volkanik Ejderha Mağarası & Kızıl Ignis",
    target: "Lav Vadisindeki Kızıl Ejderha Ignis'i Yık!",
    desc: "Kıpkırmızı akan lav derenin üstündeki bazalt taş platformları ve alev gayzerlerini aş. 6. Kutsal Lav Ateşi Bal Kristali'ni ejderhanın pençesinden kurtar!",
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
    desc: "Işıldayan mercan kayalıkları ve su altı kabarcık zıplatıcıları ile derinliklere in. 7. Kutsal Okyanus Dalgası Bal Kristali'ni krakenin kollarından al!",
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
    desc: "Tüm kristallerin birleştiği sonsuz altın cennetine tırman! Kadim Zaman Ejderi'ni alt ederek Son 8. Kutsal Bal Kristali'ni birleştir ve Evren Şöleni'ni başlat!",
    icon: "🌟",
    regionName: "Altın Cenneti & Zaman Arenası 🌟",
    crystalId: "crystal_time",
    crystalName: "Efsanevi Sonsuz Zaman Bal Kristali",
    crystalIcon: "🌟",
    bossName: "Kadim Zaman Ejderi & Kozmik Ayı Muhafızı"
  }
];`;

if (!code.includes(oldStoryEnd)) {
  console.error("oldStoryEnd not found!");
  process.exit(1);
}
code = code.replace(oldStoryEnd, newStoryEnd);
console.log("Updated STORY_CHAPTER_DATA successfully.");

// 3. Update storyInfoMap in je
const oldStoryInfoMapEnd = `    space_realm: { crystalId: "crystal_cosmic", title: "✨ Efsanevi Kozmik Galaksi Kristali & Boncuk Kurtarıldı!", desc: "Galaksi İblisi Kozmik Lord yenildi! Sevimli Kedi Boncuk kurtarıldı ve evren sonsuz barışa kavuştu!", icon: "🌌", quote: "Miyavvv! Canım Süper Ayı dostum! Beni o karanlık hücreden kurtardın, sen gerçek bir efsanesin! 💖", quoteAuthor: "🐱 Kedi Boncuk" }
  };`;

const newStoryInfoMapEnd = `    space_realm: { crystalId: "crystal_cosmic", title: "✨ Efsanevi Kozmik Galaksi Kristali & Boncuk Kurtarıldı!", desc: "Galaksi İblisi Kozmik Lord yenildi! Sevimli Kedi Boncuk kurtarıldı!", icon: "🌌", quote: "Miyavvv! Canım Süper Ayı dostum! Beni o karanlık hücreden kurtardın, ama kehanet bitmedi!", quoteAuthor: "🐱 Kedi Boncuk" },
    volcano_cave: { crystalId: "crystal_volcano", title: "🔴 Kutsal Lav Ateşi Bal Kristali Kurtarıldı!", desc: "Volkanik Ejderha Mağarası'ndaki Kızıl Alev Ejderhası Ignis mağlup edildi! Lav şelalelerinin ateşi dindi.", icon: "🌋", quote: "Roaar! Alevler senin cesur yüreğinin karşısında pes etti kahraman ayı!", quoteAuthor: "🌋 Ejderha Mağarası Muhafızı" },
    underwater_palace: { crystalId: "crystal_ocean", title: "🌊 Kutsal Okyanus Dalgası Bal Kristali Kurtarıldı!", desc: "Antik Su Altı Kristal Sarayı'ndaki Dev Neptün Kraken yenildi! Okyanusun suları berraklaştı.", icon: "🌊", quote: "Miyav-gurur! Su altı sarayının ışığı yeniden parıldıyor!", quoteAuthor: "🪸 Dalgıç Kedi Dobby" },
    golden_sanctuary: { crystalId: "crystal_time", title: "🌟 Kutsal Sonsuz Zaman Bal Kristali & Büyük Şölen!", desc: "Efsanevi Altın Cenneti Zaman Arenası'ndaki Kadim Zaman Ejderi mağlup edildi! Tüm 8 Kutsal Bal Kristali birleşti!", icon: "🌟", quote: "Zamanın ve mekânın ötesindeki en büyük kahraman Süper Ayı! Evren sana minnettar! 👑🐻✨", quoteAuthor: "🌟 Sonsuz Işık Koruyucusu Aether" }
  };`;

if (!code.includes(oldStoryInfoMapEnd)) {
  console.error("oldStoryInfoMapEnd not found!");
  process.exit(1);
}
code = code.replace(oldStoryInfoMapEnd, newStoryInfoMapEnd);
console.log("Updated storyInfoMap successfully.");

// 4. Update je unlock sequence
const oldJeUnlock = `:L==="snow_desert"&&ie.id==="space_realm"?{...ie,isUnlocked:!0}:ie))`;
const newJeUnlock = `:L==="snow_desert"&&ie.id==="space_realm"?{...ie,isUnlocked:!0}:L==="space_realm"&&ie.id==="volcano_cave"?{...ie,isUnlocked:!0}:L==="volcano_cave"&&ie.id==="underwater_palace"?{...ie,isUnlocked:!0}:L==="underwater_palace"&&ie.id==="golden_sanctuary"?{...ie,isUnlocked:!0}:ie));
  if (L === "golden_sanctuary") {
    const K = { id: "cape_infinite_time", name: "Sonsuz Zaman & Işık Pelerini", slot: "cape", rarity: "legendary", icon: "🌟", stats: { defense: 35, speed: 5, maxHp: 100 }, meshType: "cape", color: "#eab308", unlocked: !0, description: "Tüm 8 Kutsal Bal Kristali'ni birleştirerek evrenin şampiyonu olan Süper Ayı'nın pelerini!" };
    p(ie => [...ie.filter(ue => ue.id !== K.id), K]);
    Ce("🎉 BÜYÜK EFSANEVİ ZAFER! Tüm 8 Bal Kristali Kurtarıldı ve Sonsuz Zaman Pelerini Kazandın!");
  }`;

if (!code.includes(oldJeUnlock)) {
  console.error("oldJeUnlock not found!");
  process.exit(1);
}
code = code.replace(oldJeUnlock, newJeUnlock);
console.log("Updated je unlock sequence successfully.");

// 5. Update spawnBossPortalForCurrentRegion
const oldPortalSequence = `:this.currentRegion==="space_realm"&&(targetRegion="hub",targetName="Ana Merkez Vadisi (Tebrikler!)",portalPos=bossPos?bossPos.clone().add(new Y(0,0,-18)):new Y(0,20,-198))`;

const newPortalSequence = `:this.currentRegion==="space_realm"?(targetRegion="volcano_cave",targetName="Volkanik Ejderha Mağarası",portalPos=bossPos?bossPos.clone().add(new Y(0,0,-18)):new Y(0,20,-198))
:this.currentRegion==="volcano_cave"?(targetRegion="underwater_palace",targetName="Antik Su Altı Kristal Sarayı",portalPos=bossPos?bossPos.clone().add(new Y(0,0,-18)):new Y(0,18,-145))
:this.currentRegion==="underwater_palace"?(targetRegion="golden_sanctuary",targetName="Efsanevi Altın Cenneti & Zaman Arenası",portalPos=bossPos?bossPos.clone().add(new Y(0,0,-18)):new Y(0,20,-155))
:this.currentRegion==="golden_sanctuary"&&(targetRegion="hub",targetName="Ana Merkez Vadisi (Büyük Zafer!)",portalPos=bossPos?bossPos.clone().add(new Y(0,0,-18)):new Y(0,24,-175))`;

if (!code.includes(oldPortalSequence)) {
  console.error("oldPortalSequence not found!");
  process.exit(1);
}
code = code.replace(oldPortalSequence, newPortalSequence);
console.log("Updated spawnBossPortalForCurrentRegion successfully.");

// 6. Update StoryBookModal counts and unlock mapping
const oldTotalCrystals = `const totalCrystalsCount = 5;`;
const newTotalCrystals = `const totalCrystalsCount = 8;`;
code = code.replace(oldTotalCrystals, newTotalCrystals);

const oldCrystalsTab = `"💎 Kutsal Bal Kristalleri (", collectedCount, "/5)"`;
const newCrystalsTab = `"💎 Kutsal Bal Kristalleri (", collectedCount, "/8)"`;
code = code.replace(oldCrystalsTab, newCrystalsTab);

const oldModalIsUnlocked = `|| (ch.id === "space_realm" && (storyCrystals || []).includes("crystal_snow"))
                    || currentRegionId === ch.id;`;

const newModalIsUnlocked = `|| (ch.id === "space_realm" && (storyCrystals || []).includes("crystal_snow"))
                    || (ch.id === "volcano_cave" && (storyCrystals || []).includes("crystal_cosmic"))
                    || (ch.id === "underwater_palace" && (storyCrystals || []).includes("crystal_volcano"))
                    || (ch.id === "golden_sanctuary" && (storyCrystals || []).includes("crystal_ocean"))
                    || currentRegionId === ch.id;`;

if (!code.includes(oldModalIsUnlocked)) {
  console.error("oldModalIsUnlocked not found!");
  process.exit(1);
}
code = code.replace(oldModalIsUnlocked, newModalIsUnlocked);

const targetActiveStr = `!(storyCrystals || []).includes("crystal_cosmic"))`;
const replaceActiveStr = `!(storyCrystals || []).includes("crystal_cosmic")) ||
                    (ch.id === "volcano_cave" && (storyCrystals || []).includes("crystal_cosmic") && !(storyCrystals || []).includes("crystal_volcano")) ||
                    (ch.id === "underwater_palace" && (storyCrystals || []).includes("crystal_volcano") && !(storyCrystals || []).includes("crystal_ocean")) ||
                    (ch.id === "golden_sanctuary" && (storyCrystals || []).includes("crystal_ocean") && !(storyCrystals || []).includes("crystal_time"))`;

if (!code.includes(targetActiveStr)) {
  console.error("targetActiveStr not found!");
  process.exit(1);
}
code = code.replace(targetActiveStr, replaceActiveStr);

// 7. Update Quests array $w
const oldQuestsEnd = `{    id: "boss_space_warden",    title: "Boncuk Kediyi Kurtar! 🐱🚀",    target: 1,    progress: 0,    completed: !1,    rewardXp: 500,    rewardCoins: 300,    icon: "🌌",    description: "Kozmik Boyuttaki gardiyanı alt et, kafesi kır ve Boncuk'u kurtar!"  }`;

const newQuestsEnd = `{    id: "boss_space_warden",    title: "Boncuk Kediyi Kurtar! 🐱🚀",    target: 1,    progress: 0,    completed: !1,    rewardXp: 500,    rewardCoins: 300,    icon: "🌌",    description: "Kozmik Boyuttaki gardiyanı alt et, kafesi kır ve Boncuk'u kurtar!"  },
  {    id: "boss_volcano_dragon",    title: "Kızıl Ejderha Ignis'i Yık 🌋",    target: 1,    progress: 0,    completed: !1,    rewardXp: 600,    rewardCoins: 400,    icon: "🌋",    description: "Volkanik Ejderha Mağarası'ndaki Kızıl Alev Ejderhası Ignis'i mağlup et."  },
  {    id: "boss_ocean_kraken",    title: "Dev Neptün Kraken'i Devir 🌊",    target: 1,    progress: 0,    completed: !1,    rewardXp: 750,    rewardCoins: 500,    icon: "🌊",    description: "Antik Su Altı Kristal Sarayı'ndaki Derin Su Krakeni'ni alt et."  },
  {    id: "boss_time_chronos",    title: "Kadim Zaman Ejderini Yık & Evreni Kurtar 🌟",    target: 1,    progress: 0,    completed: !1,    rewardXp: 1000,    rewardCoins: 800,    icon: "🌟",    description: "Efsanevi Altın Cenneti Zaman Arenası'ndaki Kadim Zaman Ejderi'ni devirerek 8 Kutsal Kristali tamamla!"  }`;

if (!code.includes(oldQuestsEnd)) {
  console.error("oldQuestsEnd not found!");
  process.exit(1);
}
code = code.replace(oldQuestsEnd, newQuestsEnd);
console.log("Updated quests array successfully.");

// Write code back
fs.writeFileSync("src/game-bundle.js", code, "utf8");
console.log("Phase 1 updates complete!");
