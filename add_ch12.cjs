const fs = require("fs");

let bundle = fs.readFileSync("public/game-bundle.js", "utf8");

const sugarChapterIdx = bundle.indexOf('chapterNum: 11');
if (sugarChapterIdx !== -1 && !bundle.includes('chapterNum: 12')) {
  const sugarEnd = bundle.indexOf("}", sugarChapterIdx) + 1;
  const newChapter = `,
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
  bundle = bundle.substring(0, sugarEnd) + newChapter + bundle.substring(sugarEnd);
  console.log("Added chapter 12 to STORY_CHAPTER_DATA!");
}

fs.writeFileSync("public/game-bundle.js", bundle, "utf8");
console.log("Updated game-bundle.js with Chapter 12.");
