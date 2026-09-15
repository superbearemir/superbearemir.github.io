// ============================================================================
// 🏕️ SUPER BEAR ADVENTURE - HER BÖLÜME ÖZEL EŞSİZ GİZLİ DİNLENME YERLERİ VE SANDIKLAR
// (Completely Unique Themed Architecture, Shapes, Entrances & Secret Boxes for Every Level)
// - Uzay Boyutları: Uçan Anti-Yerçekimi Platformları & Kozmik Yıldız Sığınağı
// - Phelix Gezegeni: Batık Şeffaf Cam Su Altı Tünelleri & Okyanus Gözlem Kubbesi
// - Poneix Gezegeni: Biyolüminesans Uzaylı Kök Sığınağı & Siber Rün Mabedi
// - Jokerooms: Başlangıç Duvarlarının Ardında Havada Asılı VIP Liminal Oda
// - Klasik Dünyalar: Her birine özgü mağara, iglo, ağaç kovuğu, donut, vb.
// ============================================================================

(function() {
  'use strict';

  // Load saved chest states from localStorage
  let savedChests = {};
  try {
    const raw = localStorage.getItem('superbear_sanctuary_chests');
    if (raw) savedChests = JSON.parse(raw);
  } catch (e) {}

  window.__secretSanctuaryChests = savedChests || {};

  // Comprehensive base definitions for world regions
  const SANCTUARY_DEFS = {
    // 11. JOKEROOMS
    jokerooms: {
      title: "11. BÖLÜM: JOKEROOMS",
      sanctuaryName: "🚪 Havada Asılı Gizli Liminal Dinlenme Odası",
      desc: "Sarı labirent duvarlarının üzerinde, havada asılı gizli bir VIP oda! Floresan ışıklar, CRT televizyon ve kadife puf!",
      pos: { x: 0.0, y: 5.6, z: -16.0 },
      stepsStart: { x: 0.0, y: 1.2, z: -3.5 },
      chestOffset: { x: 0, y: 0.25, z: -1.0 },
      chestTitle: "Jokerin Havada Asılı Neon Sürpriz Kutusu",
      rewardCoins: 260,
      rewardHoney: 85,
      rewardXp: 450,
      primaryColor: 0xc026d3,
      secondaryColor: 0xfacc15,
      theme: 'jokerooms_floating'
    },

    // 14. ARI ÇÖLÜ
    bee_desert: {
      title: "14. BÖLÜM: ARI ÇÖLÜ",
      sanctuaryName: "🏜️ Oyma Kumtaşı Kanyon Mağarası & Bedevi Çadırı",
      desc: "Kanyon kayalıklarına oyulmuş gölgeli bir mağara, çizgili Arap çadırı, hurma ağacı ve şifalı çöl suyu!",
      pos: { x: 26.0, y: 3.2, z: 45.0 },
      chestOffset: { x: 0, y: 0.25, z: -1.2 },
      chestTitle: "Antik Firavun Skarab Sandığı",
      rewardCoins: 260,
      rewardHoney: 80,
      rewardXp: 450,
      primaryColor: 0xd97706,
      secondaryColor: 0x10b981,
      theme: 'desert_cave'
    },

    // 9. DİNOZOR DÜNYASI
    dinosaur_world: {
      title: "9. BÖLÜM: DİNOZOR DÜNYASI",
      sanctuaryName: "🦖 Dev Fosil Kaburga Mağarası & T-Rex Yuvası",
      desc: "Dev dinozor kaburga kemiklerinin örttüğü ilkel bir sığınak! Kırık dinozor yumurtaları ve parıldayan kehribar!",
      pos: { x: -28.0, y: 1.8, z: 42.0 },
      chestOffset: { x: 0, y: 0.25, z: -1.2 },
      chestTitle: "Fosil & Kehribar Zırhlı Dino Sandığı",
      rewardCoins: 250,
      rewardHoney: 75,
      rewardXp: 420,
      primaryColor: 0xb45309,
      secondaryColor: 0xfacc15,
      theme: 'dino_ribcage'
    },

    // 10. ŞEKER DÜNYASI
    sugar_world: {
      title: "10. BÖLÜM: ŞEKER DÜNYASI",
      sanctuaryName: "🍬 Havada Uçan Dev Şeker Hamuru Donut & Marshmallow Köşkü",
      desc: "Platformların üzerinde havada süzülen dev çilekli donut terası, marshmallow puf koltukları ve sıcak çikolata fincanı!",
      pos: { x: 24.0, y: 12.0, z: 50.0 },
      chestOffset: { x: 0, y: 0.25, z: -1.0 },
      chestTitle: "Karamelli Kraliyet Şeker Kutusu",
      rewardCoins: 240,
      rewardHoney: 90,
      rewardXp: 400,
      primaryColor: 0xf43f5e,
      secondaryColor: 0xec4899,
      theme: 'sugar_donut'
    },

    // 6. VOLKAN MAĞARASI
    volcano_cave: {
      title: "6. BÖLÜM: VOLKANİK EJDERHA MAĞARASI",
      sanctuaryName: "🌋 Obsidyen Taş Gözü & Mavi Ateş Mabedi",
      desc: "Karanlık obsidyen kayalarına oyulmuş, serin mavi ejderha ateşi mangallarıyla korunan gizli sığınak!",
      pos: { x: -26.0, y: 2.5, z: 52.0 },
      chestOffset: { x: 0, y: 0.25, z: -1.2 },
      chestTitle: "Kızgın Ejderha Obsidyen Sandığı",
      rewardCoins: 270,
      rewardHoney: 85,
      rewardXp: 460,
      primaryColor: 0xef4444,
      secondaryColor: 0x38bdf8,
      theme: 'volcano_grotto'
    },

    // 7. SU ALTI SARAYI
    underwater_palace: {
      title: "7. BÖLÜM: SU ALTI KRİSTAL SARAYI",
      sanctuaryName: "🌊 Batık Dev İstiridye Mabedi & Mercan Kubbesi",
      desc: "Dev deniz kabuğunun içinde sedef yatak, mercan dalları ve etrafta süzülen biolüminesans ışık kabarcıkları!",
      pos: { x: 25.0, y: 2.0, z: -18.0 },
      chestOffset: { x: 0, y: 0.25, z: -1.0 },
      chestTitle: "Batık Kraliyet İstiridye Sandığı",
      rewardCoins: 250,
      rewardHoney: 85,
      rewardXp: 440,
      primaryColor: 0x06b6d4,
      secondaryColor: 0xa855f7,
      theme: 'underwater_clam'
    },

    // 8. ALTIN CENNETİ
    golden_sanctuary: {
      title: "8. BÖLÜM: EFSANEVİ ALTIN CENNETİ",
      sanctuaryName: "🌟 Göksel Bulut Adası & Dönen Güneş Halkası Çardağı",
      desc: "Altın bulutların üzerinde süzülen mermer sütunlu antik köşk, dönen kutsal güneş halkası ve altın divan!",
      pos: { x: -28.0, y: 2.4, z: 70.0 },
      chestOffset: { x: 0, y: 0.25, z: -1.2 },
      chestTitle: "Güneş Kanatlı Kutsal Altın Sandık",
      rewardCoins: 300,
      rewardHoney: 100,
      rewardXp: 500,
      primaryColor: 0xfacc15,
      secondaryColor: 0xffffff,
      theme: 'gold_gazebo'
    },

    // 13. KARANLIK SU MAĞARASI
    water_cave: {
      title: "13. BÖLÜM: KARANLIK SU MAĞARASI",
      sanctuaryName: "💧 İçi Boş Ametist Jeot Kovuğu & Şifa Pınarı",
      desc: "Ametist kristalinden oyulmuş parıldayan mor jeot kovuğu, şifalı berrak su göleti ve kristal banklar!",
      pos: { x: -25.0, y: 4.8, z: 42.0 },
      chestOffset: { x: 0, y: 0.25, z: -1.2 },
      chestTitle: "Ametist Jeot Kristal Sandığı",
      rewardCoins: 240,
      rewardHoney: 75,
      rewardXp: 420,
      primaryColor: 0xa855f7,
      secondaryColor: 0x38bdf8,
      theme: 'amethyst_geode'
    },

    // 12. YIKILMIŞ KÖY
    ruin_village: {
      title: "12. BÖLÜM: YIKILMIŞ KÖY",
      sanctuaryName: "🏚️ Terk Edilmiş Taş Gözetleme Kulesi & Şömine",
      desc: "Sarmaşıklarla kaplı taş kule harabesinde çıtırdayan tuğla şömine, tahta zemin, harita ve kamp yatağı!",
      pos: { x: 26.0, y: 2.8, z: 60.0 },
      chestOffset: { x: 0, y: 0.25, z: -1.2 },
      chestTitle: "Kadim Muhafız Rün Sandığı",
      rewardCoins: 250,
      rewardHoney: 80,
      rewardXp: 430,
      primaryColor: 0x3b82f6,
      secondaryColor: 0xf97316,
      theme: 'ruin_tower'
    },

    // 5. KAR VADİSİ
    snow_desert: {
      title: "5. BÖLÜM: KAR VADİSİ",
      sanctuaryName: "❄️ Buzul İglo & Buharlı Sıcak Termal Kaplıca",
      desc: "Turkuaz buzul buzundan oyulmuş kubbeli bir iglo, içinde buharlı doğal sıcak kaplıca göleti ve ayı postu!",
      pos: { x: -24.0, y: 2.0, z: 36.0 },
      chestOffset: { x: 0, y: 0.25, z: -1.2 },
      chestTitle: "Kutup Şafağı Buzul Sandığı",
      rewardCoins: 240,
      rewardHoney: 75,
      rewardXp: 420,
      primaryColor: 0x06b6d4,
      secondaryColor: 0xf97316,
      theme: 'snow_igloo'
    },

    // 2. ORMAN TAPINAĞI
    forest_temple: {
      title: "2. BÖLÜM: ANTİK ORMAN TAPINAĞI",
      sanctuaryName: "🍃 Asırlık Meşe Ağacı Kovuğu & Ateşböceği Yuvası",
      desc: "Dev bir meşe ağacının gövdesine oyulmuş gizli oda! Duvarlarda parlayan mantarlar, yonca yatağı ve ateşböcekleri!",
      pos: { x: 22.0, y: 1.5, z: 12.0 },
      chestOffset: { x: 0, y: 0.25, z: -1.2 },
      chestTitle: "Zümrüt Orman Ruhu Sandığı",
      rewardCoins: 220,
      rewardHoney: 70,
      rewardXp: 380,
      primaryColor: 0x22c55e,
      secondaryColor: 0xfacc15,
      theme: 'hollow_tree'
    },

    // 3. BAL KOVANI
    beehive: {
      title: "3. BÖLÜM: VIZILDIYAN BAL KOVANI",
      sanctuaryName: "🐝 Altıgen Bal Petek Hücresi & Saf Nektar Odası",
      desc: "Kovan duvarına oyulmuş kusursuz bir altıgen balmumu hücresi, damlayan saf nektar pınarı ve bal puf koltuğu!",
      pos: { x: -22.0, y: 1.5, z: 26.0 },
      chestOffset: { x: 0, y: 0.25, z: -1.2 },
      chestTitle: "Kraliçe Arı Altın Bal Sandığı",
      rewardCoins: 230,
      rewardHoney: 75,
      rewardXp: 400,
      primaryColor: 0xeab308,
      secondaryColor: 0xf59e0b,
      theme: 'hex_honeycomb'
    },

    // 4. PELİKAN OVALARI
    pelican_plains: {
      title: "4. BÖLÜM: PELİKAN OVALARI",
      sanctuaryName: "🪶 Gökyüzü Tüy Yuvası & Bulut Çardağı",
      desc: "Gök adasında pamuksu bir bulut üzerine kurulmuş hasır dal ve beyaz pelikan tüyleriyle kaplı havadar bir yuva!",
      pos: { x: 24.0, y: 2.0, z: 30.0 },
      chestOffset: { x: 0, y: 0.25, z: -1.2 },
      chestTitle: "Gökkuşağı Rüzgar Sandığı",
      rewardCoins: 240,
      rewardHoney: 80,
      rewardXp: 420,
      primaryColor: 0x38bdf8,
      secondaryColor: 0xec4899,
      theme: 'sky_nest'
    },

    // 15. KOZMİK BOYUT & TÜM UZAY BOYUTLARI (Uçan Anti-Yerçekimi Platformları)
    space_realm: {
      title: "15. BÖLÜM: KOZMİK UZAY BOYUTU",
      sanctuaryName: "🌌 Anti-Yerçekimi Uçan Platformlar & Starlight Sığınağı",
      desc: "Boşlukta süzülen anti-yerçekimi atlama diskleri, starlight enerji kalkanı, manyetik havada asılı yatak!",
      pos: { x: -28.0, y: 6.8, z: -24.0 },
      stepsStart: { x: -14.0, y: 1.2, z: -10.0 },
      chestOffset: { x: 0, y: 0.25, z: -1.2 },
      chestTitle: "Kozmik Anti-Yerçekimi Yıldız Sandığı",
      rewardCoins: 350,
      rewardHoney: 120,
      rewardXp: 600,
      primaryColor: 0x8b5cf6,
      secondaryColor: 0x06b6d4,
      theme: 'space_floating_platforms'
    },

    // PHELİX GEZEGENİ BÖLÜMLERİ (Batık Cam Su Altı Tünelleri & Okyanus Gözlem Kubbesi)
    phelix_default: {
      title: "PHELİX GEZEGENİ (MAVİ ÇİZGİ)",
      sanctuaryName: "🌊 Batık Cam Su Altı Tüneli & Okyanus Gözlem Sığınağı",
      desc: "Okyanus derinliklerine inen şeffaf cam su altı tüneli, yüzen mercan balıkları, basınç hava kilitleri ve su altı kubbesi!",
      pos: { x: 22.0, y: -0.5, z: -12.0 },
      tunnelStart: { x: 12.0, y: 0.0, z: -5.0 },
      chestOffset: { x: 0, y: 0.25, z: -1.2 },
      chestTitle: "Phelix Hidro-Kristal Okyanus Sandığı",
      rewardCoins: 280,
      rewardHoney: 90,
      rewardXp: 480,
      primaryColor: 0x0284c7,
      secondaryColor: 0x38bdf8,
      theme: 'phelix_underwater_tunnel'
    },

    // PONEİX GEZEGENİ BÖLÜMLERİ (Biyolüminesans Uzaylı Kök Sığınağı & Siber Rün Mabedi)
    poneix_default: {
      title: "PONEİX GEZEGENİ (YEŞİL ÇİZGİ)",
      sanctuaryName: "🌿 Biyolüminesans Uzaylı Kök Sığınağı & Siber Rün Mabedi",
      desc: "Kıvrılan uzaylı köklerinin taşıdığı organik sığınak, parlayan zümrüt rün dikitleri ve uzaylı şifa sporu!",
      pos: { x: -24.0, y: 1.8, z: 18.0 },
      chestOffset: { x: 0, y: 0.25, z: -1.2 },
      chestTitle: "Poneix Kadim Uzaylı Rün Sandığı",
      rewardCoins: 280,
      rewardHoney: 90,
      rewardXp: 480,
      primaryColor: 0x10b981,
      secondaryColor: 0x34d399,
      theme: 'poneix_alien_sanctuary'
    }
  };

  // Explicit mapping for all Space level variations
  const spaceTitles = [
    "1. Yıldız Tozu Patikası", "2. Kristal Bulutsu", "3. Plazma Girdabı",
    "4. Ay Kraterleri", "5. Süpernova Harabeleri", "6. Karanlık Lord Kalesi", "7. Mor Ayı Kozmik Çekirdeği"
  ];
  for (let s = 1; s <= 7; s++) {
    const sKey = 'space_level_' + s;
    SANCTUARY_DEFS[sKey] = {
      title: `UZAY BOYUTU ${s}: ${spaceTitles[s-1] || 'Kozmik Sektör'}`,
      sanctuaryName: "🌌 Anti-Yerçekimi Uçan Platformlar & Starlight Sığınağı",
      desc: "Boşlukta süzülen anti-yerçekimi atlama diskleri, starlight enerji kalkanı, manyetik havada asılı yatak!",
      pos: { x: -26.0, y: 6.8, z: -22.0 },
      stepsStart: { x: -14.0, y: 1.2, z: -10.0 },
      chestOffset: { x: 0, y: 0.25, z: -1.2 },
      chestTitle: `Kozmik ${s}. Boyut Yıldız Sandığı`,
      rewardCoins: 300 + s * 20,
      rewardHoney: 80 + s * 10,
      rewardXp: 500 + s * 30,
      primaryColor: 0x8b5cf6,
      secondaryColor: 0x06b6d4,
      theme: 'space_floating_platforms'
    };
  }
  // Named space aliases
  SANCTUARY_DEFS['space_1_stardust'] = SANCTUARY_DEFS['space_level_1'];
  SANCTUARY_DEFS['space_2_nebula'] = SANCTUARY_DEFS['space_level_2'];
  SANCTUARY_DEFS['space_2_crystal'] = SANCTUARY_DEFS['space_level_2'];
  SANCTUARY_DEFS['space_3_plasma'] = SANCTUARY_DEFS['space_level_3'];
  SANCTUARY_DEFS['space_3_gas_giant'] = SANCTUARY_DEFS['space_level_3'];
  SANCTUARY_DEFS['space_4_lunar'] = SANCTUARY_DEFS['space_level_4'];
  SANCTUARY_DEFS['space_4_asteroid_belt'] = SANCTUARY_DEFS['space_level_4'];
  SANCTUARY_DEFS['space_5_supernova'] = SANCTUARY_DEFS['space_level_5'];
  SANCTUARY_DEFS['space_5_nebula_ruins'] = SANCTUARY_DEFS['space_level_5'];
  SANCTUARY_DEFS['space_6_darklord'] = SANCTUARY_DEFS['space_level_6'];
  SANCTUARY_DEFS['space_6_dark_lord'] = SANCTUARY_DEFS['space_level_6'];
  SANCTUARY_DEFS['space_7_mor_ayi'] = SANCTUARY_DEFS['space_level_7'];
  SANCTUARY_DEFS['space_7_purple_bear'] = SANCTUARY_DEFS['space_level_7'];

  // Explicit mapping for all Phelix level variations (9 levels)
  const phelixTitles = [
    "1. Vaha Başlangıç Pınarı", "2. Neon Sınır Vadisi", "3. Kül Vadisi & Harabeler",
    "4. Titanyum Kanyonu", "5. Fırtınanın Gözü", "6. Siber Boşluk",
    "7. İlkel Kalıntılar", "8. Yörünge Kuşağı", "9. Phelix Gezegeni Çekirdeği"
  ];
  for (let p = 1; p <= 9; p++) {
    const pKey = 'phelix_level_' + p;
    SANCTUARY_DEFS[pKey] = {
      title: `PHELİX ${p}. BÖLÜM: ${phelixTitles[p-1] || 'Okyanus Sektörü'}`,
      sanctuaryName: "🌊 Batık Cam Su Altı Tüneli & Okyanus Gözlem Sığınağı",
      desc: "Okyanus derinliklerine inen şeffaf cam su altı tüneli, yüzen mercan balıkları, basınç hava kilitleri ve su altı kubbesi!",
      pos: { x: 22.0, y: -0.5, z: -12.0 },
      tunnelStart: { x: 12.0, y: 0.0, z: -5.0 },
      chestOffset: { x: 0, y: 0.25, z: -1.2 },
      chestTitle: `Phelix ${p}. Bölüm Hidro-Kristal Sandığı`,
      rewardCoins: 280 + p * 15,
      rewardHoney: 85 + p * 8,
      rewardXp: 480 + p * 25,
      primaryColor: 0x0284c7,
      secondaryColor: 0x38bdf8,
      theme: 'phelix_underwater_tunnel'
    };
  }
  // Named Phelix aliases
  SANCTUARY_DEFS['phelix_1_oases'] = SANCTUARY_DEFS['phelix_level_1'];
  SANCTUARY_DEFS['phelix_2_neon_verge'] = SANCTUARY_DEFS['phelix_level_2'];
  SANCTUARY_DEFS['phelix_3_ashen_vale'] = SANCTUARY_DEFS['phelix_level_3'];
  SANCTUARY_DEFS['phelix_4_titanium_canyon'] = SANCTUARY_DEFS['phelix_level_4'];
  SANCTUARY_DEFS['phelix_5_eye_of_tempest'] = SANCTUARY_DEFS['phelix_level_5'];
  SANCTUARY_DEFS['phelix_6_cyber_void'] = SANCTUARY_DEFS['phelix_level_6'];
  SANCTUARY_DEFS['phelix_7_primal_relics'] = SANCTUARY_DEFS['phelix_level_7'];
  SANCTUARY_DEFS['phelix_8_orbital_belt'] = SANCTUARY_DEFS['phelix_level_8'];
  SANCTUARY_DEFS['phelix_9_core_boss'] = SANCTUARY_DEFS['phelix_level_9'];

  // Explicit mapping for all Poneix level variations (7 levels)
  const poneixTitles = [
    "1. Krater İniş Vadisi", "2. Kristal Kanyonu", "3. Siber Harabeler",
    "4. Magma Okyanusu", "5. Gök Kalesi", "6. Kimera Çekirdeği", "7. Füzyon Arenası"
  ];
  for (let po = 1; po <= 7; po++) {
    const poKey = 'poneix_level_' + po;
    SANCTUARY_DEFS[poKey] = {
      title: `PONEİX ${po}. BÖLÜM: ${poneixTitles[po-1] || 'Uzaylı Sektör'}`,
      sanctuaryName: "🌿 Biyolüminesans Uzaylı Kök Sığınağı & Siber Rün Mabedi",
      desc: "Kıvrılan uzaylı köklerinin taşıdığı organik sığınak, parlayan zümrüt rün dikitleri ve uzaylı şifa sporu!",
      pos: { x: -24.0, y: 1.8, z: 18.0 },
      chestOffset: { x: 0, y: 0.25, z: -1.2 },
      chestTitle: `Poneix ${po}. Bölüm Kadim Rün Sandığı`,
      rewardCoins: 280 + po * 20,
      rewardHoney: 85 + po * 10,
      rewardXp: 480 + po * 30,
      primaryColor: 0x10b981,
      secondaryColor: 0x34d399,
      theme: 'poneix_alien_sanctuary'
    };
  }
  // Named Poneix aliases
  SANCTUARY_DEFS['poneix_1_crash_valley'] = SANCTUARY_DEFS['poneix_level_1'];
  SANCTUARY_DEFS['poneix_2_crystal_canyon'] = SANCTUARY_DEFS['poneix_level_2'];
  SANCTUARY_DEFS['poneix_3_cyber_ruins'] = SANCTUARY_DEFS['poneix_level_3'];
  SANCTUARY_DEFS['poneix_4_magma_ocean'] = SANCTUARY_DEFS['poneix_level_4'];
  SANCTUARY_DEFS['poneix_5_sky_citadel'] = SANCTUARY_DEFS['poneix_level_5'];
  SANCTUARY_DEFS['poneix_6_chimera_core'] = SANCTUARY_DEFS['poneix_level_6'];
  SANCTUARY_DEFS['poneix_7_fusion_boss'] = SANCTUARY_DEFS['poneix_level_7'];

  // Smart definition resolver for any level
  function resolveSanctuaryDef(regionKey) {
    if (!regionKey) return null;
    if (SANCTUARY_DEFS[regionKey]) return SANCTUARY_DEFS[regionKey];

    // Fuzzy matching
    if (regionKey.startsWith('space_') || regionKey.includes('space')) {
      return SANCTUARY_DEFS['space_realm'];
    }
    if (regionKey.startsWith('phelix_') || regionKey.includes('phelix')) {
      return SANCTUARY_DEFS['phelix_default'];
    }
    if (regionKey.startsWith('poneix_') || regionKey.includes('poneix')) {
      return SANCTUARY_DEFS['poneix_default'];
    }
    return null;
  }

  let activeSanctuaryGroup = null;
  let activeRegionKey = null;
  let lastRestHealTime = 0;
  let lastNoticeTime = 0;

  // Helper for registering physical floor colliders
  function registerCollider(game, minV, maxV) {
    if (!game || !game.currentLevel) return;
    if (!game.currentLevel.colliders) game.currentLevel.colliders = [];
    game.currentLevel.colliders.push({
      isSanctuaryCollider: true,
      min: minV,
      max: maxV
    });
  }

  // ==========================================================================
  // INDIVIDUAL UNIQUE BUILDERS FOR EVERY SINGLE ARCHITECTURAL THEME
  // ==========================================================================

  // 1. JOKEROOMS: Floating Suspended VIP Room behind the start maze walls
  function buildJokeroomsFloatingRoom(THREE, def, root, animElements, game) {
    const stepMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.6 });
    const stepRimMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.8 });
    const steps = [
      { x: 0, y: 1.8, z: -5.0, w: 2.0, h: 0.35, d: 1.8 },
      { x: 0, y: 2.8, z: -8.0, w: 2.0, h: 0.35, d: 1.8 },
      { x: 0, y: 3.8, z: -11.0, w: 2.2, h: 0.35, d: 1.8 },
      { x: 0, y: 4.8, z: -13.5, w: 2.4, h: 0.35, d: 1.8 }
    ];

    steps.forEach((s) => {
      const stepMesh = new THREE.Mesh(new THREE.BoxGeometry(s.w, s.h, s.d), stepMat);
      stepMesh.position.set(s.x, s.y - def.pos.y, s.z - def.pos.z);
      root.add(stepMesh);

      const rim = new THREE.Mesh(new THREE.BoxGeometry(s.w + 0.1, 0.08, s.d + 0.1), stepRimMat);
      rim.position.copy(stepMesh.position);
      rim.position.y += 0.18;
      root.add(rim);

      registerCollider(game,
        new THREE.Vector3(s.x - s.w/2, s.y - 0.2, s.z - s.d/2),
        new THREE.Vector3(s.x + s.w/2, s.y + 0.3, s.z + s.d/2)
      );

      const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xeab308, emissiveIntensity: 0.6 }));
      beacon.position.set(stepMesh.position.x, stepMesh.position.y - 0.7, stepMesh.position.z);
      root.add(beacon);
    });

    const roomW = 7.0, roomH = 4.2, roomD = 6.0;
    const floorMesh = new THREE.Mesh(new THREE.BoxGeometry(roomW, 0.45, roomD),
      new THREE.MeshStandardMaterial({ color: 0xca8a04, roughness: 0.8 }));
    floorMesh.position.set(0, 0.22, 0);
    root.add(floorMesh);

    registerCollider(game,
      new THREE.Vector3(def.pos.x - roomW/2, def.pos.y - 0.2, def.pos.z - roomD/2),
      new THREE.Vector3(def.pos.x + roomW/2, def.pos.y + 0.48, def.pos.z + roomD/2)
    );

    const wallMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.9 });
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(roomW, roomH, 0.35), wallMat);
    backWall.position.set(0, roomH/2 + 0.45, -roomD/2);
    root.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, roomH, roomD), wallMat);
    leftWall.position.set(-roomW/2, roomH/2 + 0.45, 0);
    root.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, roomH, roomD), wallMat);
    rightWall.position.set(roomW/2, roomH/2 + 0.45, 0);
    root.add(rightWall);

    const ceiling = new THREE.Mesh(new THREE.BoxGeometry(roomW, 0.3, roomD),
      new THREE.MeshStandardMaterial({ color: 0xfef9c3, roughness: 0.9 }));
    ceiling.position.set(0, roomH + 0.45, 0);
    root.add(ceiling);

    // Hanging Fluorescent Tube Light
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.8, 8),
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfffae0, emissiveIntensity: 1.8, roughness: 0.1 }));
    tube.rotation.z = Math.PI / 2;
    tube.position.set(0, roomH - 0.4, 0);
    root.add(tube);
    animElements.push({ type: 'fluorescent', mesh: tube });

    const roomLight = new THREE.PointLight(0xfef08a, 2.5, 12);
    roomLight.position.set(0, roomH - 0.6, 0);
    root.add(roomLight);

    // Retro CRT Television
    const tvGroup = new THREE.Group();
    tvGroup.position.set(-2.2, 0.45, -1.8);
    const crate = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 0.7), new THREE.MeshStandardMaterial({ color: 0x1e3a8a }));
    crate.position.y = 0.35;
    tvGroup.add(crate);

    const tvBody = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.85, 0.8), new THREE.MeshStandardMaterial({ color: 0x27272a }));
    tvBody.position.y = 1.1;
    tvGroup.add(tvBody);

    const tvScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.65, 0.55),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 1.4 }));
    tvScreen.position.set(0, 1.1, 0.41);
    tvGroup.add(tvScreen);
    root.add(tvGroup);
    animElements.push({ type: 'crt_static', mesh: tvScreen });

    // Cozy Magenta Velvet Beanbag Sofa
    const beanbag = new THREE.Mesh(new THREE.SphereGeometry(0.95, 16, 12),
      new THREE.MeshStandardMaterial({ color: 0xa21caf, roughness: 0.7 }));
    beanbag.scale.set(1.4, 0.65, 1.2);
    beanbag.position.set(1.8, 0.65, -1.2);
    root.add(beanbag);

    // Floating question mark over chest
    const qmark = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.08, 8, 16, Math.PI * 1.5),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xfacc15, emissiveIntensity: 1.5 }));
    qmark.position.set(def.chestOffset.x, 2.5, def.chestOffset.z);
    root.add(qmark);
    animElements.push({ type: 'spin_y', mesh: qmark });
  }

  // 2. SPACE DIMENSIONS: Anti-Gravity Floating Jump Platforms & Cosmic Forcefield Island
  function buildSpaceFloatingPlatformsSanctuary(THREE, def, root, animElements, game) {
    // A series of elevated floating anti-gravity jump platforms leading up into space!
    const stepPlatforms = [
      { x: -14.0, y: 1.6, z: -10.0, r: 1.6, color: 0x0284c7 },
      { x: -18.0, y: 3.0, z: -13.5, r: 1.8, color: 0x38bdf8 },
      { x: -21.5, y: 4.4, z: -17.0, r: 1.9, color: 0x6366f1 },
      { x: -24.5, y: 5.6, z: -20.5, r: 2.1, color: 0x8b5cf6 }
    ];

    stepPlatforms.forEach((p, idx) => {
      const stepGroup = new THREE.Group();
      const localX = p.x - def.pos.x;
      const localY = p.y - def.pos.y;
      const localZ = p.z - def.pos.z;
      stepGroup.position.set(localX, localY, localZ);

      // Dark titanium anti-gravity disk
      const diskGeo = new THREE.CylinderGeometry(p.r, p.r * 1.15, 0.35, 16);
      const diskMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2 });
      const disk = new THREE.Mesh(diskGeo, diskMat);
      stepGroup.add(disk);

      // Glowing anti-gravity emitter ring on perimeter
      const ring = new THREE.Mesh(new THREE.TorusGeometry(p.r + 0.08, 0.12, 8, 24),
        new THREE.MeshStandardMaterial({ color: p.color, emissive: p.color, emissiveIntensity: 1.6 }));
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.12;
      stepGroup.add(ring);

      // Anti-gravity repulsion beacon below
      const beacon = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.4, 8),
        new THREE.MeshStandardMaterial({ color: p.color, emissive: p.color, emissiveIntensity: 1.2, transparent: true, opacity: 0.85 }));
      beacon.rotation.x = Math.PI;
      beacon.position.y = -0.8;
      stepGroup.add(beacon);

      root.add(stepGroup);

      // Register step collider
      registerCollider(game,
        new THREE.Vector3(p.x - p.r, p.y - 0.3, p.z - p.r),
        new THREE.Vector3(p.x + p.r, p.y + 0.45, p.z + p.r)
      );

      // Gentle anti-gravity floating bob
      animElements.push({
        type: 'hover_y',
        mesh: stepGroup,
        origY: localY,
        phase: idx * 0.9
      });
    });

    // B. Main Anti-Gravity Floating Sanctum Island (Octagon Platform)
    const mainR = 5.2;
    const mainFloor = new THREE.Mesh(
      new THREE.CylinderGeometry(mainR, mainR * 1.1, 0.55, 8),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.92, roughness: 0.15 })
    );
    mainFloor.position.y = 0.27;
    root.add(mainFloor);

    registerCollider(game,
      new THREE.Vector3(def.pos.x - mainR, def.pos.y - 0.2, def.pos.z - mainR),
      new THREE.Vector3(def.pos.x + mainR, def.pos.y + 0.55, def.pos.z + mainR)
    );

    // Outer Glowing Hex Rim
    const mainRim = new THREE.Mesh(new THREE.TorusGeometry(mainR + 0.1, 0.16, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 1.8 }));
    mainRim.rotation.x = Math.PI / 2;
    mainRim.position.y = 0.5;
    root.add(mainRim);

    // Starlight Cosmic Forcefield Dome (Protects the resting area)
    const domeGeo = new THREE.SphereGeometry(mainR - 0.2, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.52);
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      emissive: 0x6366f1,
      emissiveIntensity: 0.9,
      transparent: true,
      opacity: 0.6
    });
    const forceDome = new THREE.Mesh(domeGeo, domeMat);
    forceDome.position.y = 0.27;
    root.add(forceDome);
    animElements.push({ type: 'spin_y', mesh: forceDome });

    // Rotating Anti-Gravity Gyroscope Ring System Overhead
    const gyroGroup = new THREE.Group();
    gyroGroup.position.set(0, 4.2, 0);

    const gyro1 = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.1, 10, 32),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 1.5 }));
    gyroGroup.add(gyro1);
    const gyro2 = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.08, 10, 24),
      new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0x7e22ce, emissiveIntensity: 1.5 }));
    gyro2.rotation.x = Math.PI / 3;
    gyroGroup.add(gyro2);
    root.add(gyroGroup);
    animElements.push({ type: 'spin_y', mesh: gyroGroup });

    // Anti-Gravity Magnetic Hover Bed (Floats in the air with no legs!)
    const hoverBedGroup = new THREE.Group();
    hoverBedGroup.position.set(2.4, 0.85, 1.2);

    const bedBase = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.25, 1.6),
      new THREE.MeshStandardMaterial({ color: 0x1e1b4b, metalness: 0.8 }));
    hoverBedGroup.add(bedBase);

    const bedMattress = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.35, 1.4),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.4, emissive: 0x0284c7, emissiveIntensity: 0.4 }));
    bedMattress.position.y = 0.25;
    hoverBedGroup.add(bedMattress);

    const bedGlowRing = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.08, 8, 16),
      new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x06b6d4, emissiveIntensity: 2.0 }));
    bedGlowRing.rotation.x = Math.PI / 2;
    bedGlowRing.position.y = -0.2;
    hoverBedGroup.add(bedGlowRing);

    root.add(hoverBedGroup);
    animElements.push({ type: 'hover_y', mesh: hoverBedGroup, origY: 0.85, phase: 1.5 });

    // Cosmic Plasma Core (Corner terminal)
    const plasmaCol = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 2.2, 12),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 }));
    plasmaCol.position.set(-2.6, 1.1, -1.8);
    root.add(plasmaCol);

    const plasmaOrb = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xeab308, emissiveIntensity: 2.0 }));
    plasmaOrb.position.set(-2.6, 2.3, -1.8);
    root.add(plasmaOrb);
    animElements.push({ type: 'glow_pulse', mesh: plasmaOrb });

    const pLight = new THREE.PointLight(0x38bdf8, 3.0, 14);
    pLight.position.set(0, 3.2, 0);
    root.add(pLight);
  }

  // 3. PHELIX PLANET: Submerged Glass Underwater Tunnel & Sunken Observation Dome
  function buildPhelixUnderwaterTunnelSanctuary(THREE, def, root, animElements, game) {
    // A. Submerged Glass Tunnel Walkway leading from the island into the ocean depths
    const tunnelLength = 12.0;
    const tunnelRadius = 2.4;

    // Glass Arch Tunnel (Half-Cylinder Arched Roof)
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.08,
      metalness: 0.1,
      transparent: true,
      opacity: 0.38,
      side: THREE.DoubleSide
    });

    const tunnelGeo = new THREE.CylinderGeometry(tunnelRadius, tunnelRadius, tunnelLength, 16, 1, true, 0, Math.PI);
    const tunnelMesh = new THREE.Mesh(tunnelGeo, glassMat);
    tunnelMesh.rotation.z = Math.PI / 2;
    tunnelMesh.rotation.y = Math.PI / 2;
    tunnelMesh.position.set(0, 0.2, 0);
    root.add(tunnelMesh);

    // Walkable Non-Slip Metal Floor inside the tunnel
    const floorGeo = new THREE.BoxGeometry(3.6, 0.35, tunnelLength);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.4 });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.set(0, 0.18, 0);
    root.add(floorMesh);

    registerCollider(game,
      new THREE.Vector3(def.pos.x - 1.9, def.pos.y - 0.2, def.pos.z - tunnelLength/2),
      new THREE.Vector3(def.pos.x + 1.9, def.pos.y + 0.45, def.pos.z + tunnelLength/2)
    );

    // Titanium Bulkhead Structural Rings along the tunnel
    const bulkheadMat = new THREE.MeshStandardMaterial({ color: 0x0f766e, metalness: 0.85, roughness: 0.25 });
    for (let r = 0; r <= 4; r++) {
      const bz = -tunnelLength/2 + (r / 4) * tunnelLength;
      const bRing = new THREE.Mesh(new THREE.TorusGeometry(tunnelRadius + 0.08, 0.16, 8, 24, Math.PI), bulkheadMat);
      bRing.position.set(0, 0.2, bz);
      root.add(bRing);

      // Pressure valve / gauge on bulkhead
      const gauge = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.08, 8),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xeab308, emissiveIntensity: 0.8 }));
      gauge.rotation.x = Math.PI / 2;
      gauge.position.set(-tunnelRadius * 0.7, 1.4, bz);
      root.add(gauge);
    }

    // B. Sunken Ocean Observation Dome at the end of the tunnel
    const domeCenterZ = -tunnelLength/2 - 3.8;
    const domeR = 5.2;

    // Circular Glass Dome
    const obsDome = new THREE.Mesh(
      new THREE.SphereGeometry(domeR, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.52),
      glassMat
    );
    obsDome.position.set(0, 0.2, domeCenterZ);
    root.add(obsDome);

    // Circular Dome Floor
    const domeFloor = new THREE.Mesh(
      new THREE.CylinderGeometry(domeR, domeR, 0.35, 24),
      floorMat
    );
    domeFloor.position.set(0, 0.18, domeCenterZ);
    root.add(domeFloor);

    registerCollider(game,
      new THREE.Vector3(def.pos.x - domeR, def.pos.y - 0.2, def.pos.z + domeCenterZ - domeR),
      new THREE.Vector3(def.pos.x + domeR, def.pos.y + 0.45, def.pos.z + domeCenterZ + domeR)
    );

    // Sunken Nautical Rest Lounge: Curved Waterproof Leather Sofa with Brass Trim
    const sofa = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.55, 1.4),
      new THREE.MeshStandardMaterial({ color: 0x0891b2, roughness: 0.5 }));
    sofa.position.set(0, 0.55, domeCenterZ + 2.2);
    root.add(sofa);

    const backrest = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.8, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.6 }));
    backrest.position.set(0, 0.95, domeCenterZ + 2.8);
    root.add(backrest);

    // Emergency Submarine Oxygen Dispenser
    const oxyTank = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.8, 12),
      new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.8, metalness: 0.8 }));
    oxyTank.position.set(-3.2, 0.95, domeCenterZ);
    root.add(oxyTank);

    // 3D Swimming Coral Reef Fish circling around outside the glass!
    const fishMat1 = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.3 }); // Clownfish orange
    const fishMat2 = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.3 }); // Blue tang
    for (let f = 0; f < 5; f++) {
      const fishGroup = new THREE.Group();
      const body = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.65, 6), f % 2 === 0 ? fishMat1 : fishMat2);
      body.rotation.x = Math.PI / 2;
      fishGroup.add(body);

      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.35, 0.2), f % 2 === 0 ? fishMat1 : fishMat2);
      tail.position.z = -0.4;
      fishGroup.add(tail);

      fishGroup.position.set(0, 1.8 + (f % 3) * 0.6, domeCenterZ);
      root.add(fishGroup);

      animElements.push({
        type: 'swim_circle',
        mesh: fishGroup,
        centerX: 0,
        centerZ: domeCenterZ,
        radius: 6.2 + (f % 2) * 1.5,
        phase: (f / 5) * Math.PI * 2
      });
    }

    // Floating Bioluminescent Deep-Sea Bubble Streams
    for (let b = 0; b < 6; b++) {
      const bubble = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0x67e8f9, emissive: 0x06b6d4, emissiveIntensity: 1.6, transparent: true, opacity: 0.8 }));
      bubble.position.set(-1.2 + (b % 3) * 1.2, 0.8 + (b * 0.4), domeCenterZ - 1.5 + (b % 2) * 1.8);
      root.add(bubble);
      animElements.push({ type: 'bubble_float', mesh: bubble, origY: bubble.position.y });
    }

    // Atmospheric Aqua Underwater Pointlight
    const uLight = new THREE.PointLight(0x38bdf8, 2.8, 14);
    uLight.position.set(0, 3.2, domeCenterZ);
    root.add(uLight);
  }

  // 4. PONEIX PLANET: Bioluminescent Alien Treehouse & Cyber-Rune Obelisk Sanctuary
  function buildPoneixAlienSanctuary(THREE, def, root, animElements, game) {
    // Organic Alien Moss & Bio-Plateau Platform
    const floorR = 5.2;
    const floorMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(floorR, floorR * 1.15, 0.45, 16),
      new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.95 })
    );
    floorMesh.position.y = 0.22;
    root.add(floorMesh);

    registerCollider(game,
      new THREE.Vector3(def.pos.x - floorR, def.pos.y - 0.2, def.pos.z - floorR),
      new THREE.Vector3(def.pos.x + floorR, def.pos.y + 0.45, def.pos.z + floorR)
    );

    // Twisting Alien Tree Roots framing the platform perimeter
    const rootMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.9 });
    for (let r = 0; r < 6; r++) {
      const angle = (r / 6) * Math.PI * 2;
      const rx = Math.cos(angle) * (floorR - 0.4);
      const rz = Math.sin(angle) * (floorR - 0.4);

      const rTorus = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.28, 8, 12, Math.PI * 0.8), rootMat);
      rTorus.rotation.z = Math.PI / 4;
      rTorus.rotation.y = angle;
      rTorus.position.set(rx, 0.8, rz);
      root.add(rTorus);
    }

    // 4 Ancient Alien Obelisks with Glowing Emerald Glyph Inlays
    const obeliskMat = new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.5, metalness: 0.4 });
    const glyphMat = new THREE.MeshStandardMaterial({ color: 0x34d399, emissive: 0x10b981, emissiveIntensity: 1.8 });

    [
      { x: -3.2, z: -2.4 }, { x: 3.2, z: -2.4 },
      { x: -3.4, z: 2.0 }, { x: 3.4, z: 2.0 }
    ].forEach((ob) => {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.55, 3.8, 6), obeliskMat);
      col.position.set(ob.x, 1.9, ob.z);
      root.add(col);

      // Glowing Rune Inset
      const runeRing = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.08, 6, 12), glyphMat);
      runeRing.rotation.x = Math.PI / 2;
      runeRing.position.set(ob.x, 2.4, ob.z);
      root.add(runeRing);
      animElements.push({ type: 'glow_pulse', mesh: runeRing });
    });

    // Bioluminescent Fungal Spore Canopy Overhead
    const canopy = new THREE.Mesh(
      new THREE.SphereGeometry(3.8, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.45),
      new THREE.MeshStandardMaterial({ color: 0x047857, emissive: 0x065f46, emissiveIntensity: 0.6, roughness: 0.7 })
    );
    canopy.position.set(0, 3.8, -0.6);
    root.add(canopy);

    // Glowing Alien Spore Pods hanging under canopy
    for (let s = 0; s < 4; s++) {
      const ang = (s / 4) * Math.PI * 2;
      const pod = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), glyphMat);
      pod.position.set(Math.cos(ang) * 2.2, 3.2, Math.sin(ang) * 2.2 - 0.6);
      root.add(pod);
      animElements.push({ type: 'glow_pulse', mesh: pod });
    }

    // Alien Bio-Rest Pod (Comfortable glowing moss bed)
    const bioPod = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.4, 0.4, 12),
      new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.8, emissive: 0x059669, emissiveIntensity: 0.5 }));
    bioPod.position.set(0, 0.45, 1.4);
    root.add(bioPod);

    // Alien Cyber Diagnostic Terminal
    const term = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.4, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 }));
    term.position.set(-2.2, 0.9, -1.8);
    root.add(term);

    const termScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.6), glyphMat);
    termScreen.position.set(-2.2, 1.1, -1.39);
    root.add(termScreen);

    const pLight = new THREE.PointLight(0x34d399, 2.5, 12);
    pLight.position.set(0, 2.4, 0);
    root.add(pLight);
  }

  // 5. BEE DESERT: Carved Sandstone Canyon Cave & Bedouin Tent
  function buildDesertCaveSanctuary(THREE, def, root, animElements, game) {
    const floor = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 5.8, 0.45, 24),
      new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.95 }));
    floor.position.y = 0.22;
    root.add(floor);

    registerCollider(game,
      new THREE.Vector3(def.pos.x - 5.5, def.pos.y - 0.2, def.pos.z - 5.5),
      new THREE.Vector3(def.pos.x + 5.5, def.pos.y + 0.45, def.pos.z + 5.5)
    );

    const rockMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.9 });
    for (let r = 0; r < 7; r++) {
      const angle = Math.PI * 0.7 + (r / 6) * (Math.PI * 0.9);
      const rx = Math.cos(angle) * 4.6;
      const rz = Math.sin(angle) * 4.6;
      const rH = 3.5 + (r % 3) * 0.8;
      const boulder = new THREE.Mesh(new THREE.DodecahedronGeometry(1.6, 1), rockMat);
      boulder.scale.set(1.4, rH, 1.4);
      boulder.position.set(rx, rH * 0.7, rz);
      root.add(boulder);
    }

    const tentPoleMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
    const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 3.4, 8), tentPoleMat);
    p1.position.set(-2.8, 1.7, 1.8);
    root.add(p1);
    const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 3.4, 8), tentPoleMat);
    p2.position.set(2.8, 1.7, 1.8);
    root.add(p2);

    const tent = new THREE.Mesh(new THREE.ConeGeometry(4.2, 1.6, 4),
      new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.9 }));
    tent.rotation.y = Math.PI / 4;
    tent.position.set(0, 3.6, -0.6);
    root.add(tent);

    const rug = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.08, 3.0),
      new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.9 }));
    rug.position.set(0, 0.48, 0.6);
    root.add(rug);

    const firePit = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.16, 8, 16),
      new THREE.MeshStandardMaterial({ color: 0x78350f }));
    firePit.rotation.x = Math.PI / 2;
    firePit.position.set(0, 0.48, -2.2);
    root.add(firePit);

    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.85, 8),
      new THREE.MeshStandardMaterial({ color: 0xff6600, emissive: 0xff4400, emissiveIntensity: 2.0 }));
    flame.position.set(0, 0.9, -2.2);
    root.add(flame);
    animElements.push({ type: 'flame', mesh: flame });

    const fLight = new THREE.PointLight(0xff7700, 2.5, 10);
    fLight.position.set(0, 1.2, -2.2);
    root.add(fLight);

    const oasis = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.15, 16),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, metalness: 0.5, transparent: true, opacity: 0.85 }));
    oasis.position.set(-2.4, 0.48, 0.2);
    root.add(oasis);
  }

  // 6. DINOSAUR WORLD: Giant Prehistoric Fossil Ribcage Cavern
  function buildDinoRibcageSanctuary(THREE, def, root, animElements, game) {
    const floor = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 5.8, 0.45, 24),
      new THREE.MeshStandardMaterial({ color: 0x3f2e23, roughness: 0.95 }));
    floor.position.y = 0.22;
    root.add(floor);

    registerCollider(game,
      new THREE.Vector3(def.pos.x - 5.5, def.pos.y - 0.2, def.pos.z - 5.5),
      new THREE.Vector3(def.pos.x + 5.5, def.pos.y + 0.45, def.pos.z + 5.5)
    );

    const boneMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.8 });
    for (let i = 0; i < 6; i++) {
      const ribZ = -2.4 + i * 0.95;
      const ribTorus = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.22, 10, 24, Math.PI), boneMat);
      ribTorus.position.set(0, 0.4, ribZ);
      root.add(ribTorus);
    }

    const spine = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 6.2), boneMat);
    spine.position.set(0, 4.0, 0);
    root.add(spine);

    const nestMat = new THREE.MeshStandardMaterial({ color: 0x2e5630, roughness: 0.9 });
    const nestRing = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.4, 8, 16), nestMat);
    nestRing.rotation.x = Math.PI / 2;
    nestRing.position.set(0, 0.45, 0.8);
    root.add(nestRing);

    const egg = new THREE.Mesh(new THREE.SphereGeometry(0.75, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xfde047, emissive: 0xd97706, emissiveIntensity: 0.6 }));
    egg.scale.set(0.85, 1.25, 0.85);
    egg.position.set(1.4, 1.1, 0.6);
    root.add(egg);

    const amberMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.9,
      roughness: 0.2, transparent: true, opacity: 0.85
    });
    const amberStone1 = new THREE.Mesh(new THREE.ConeGeometry(0.6, 2.2, 6), amberMat);
    amberStone1.position.set(-2.8, 1.1, -1.8);
    root.add(amberStone1);
    animElements.push({ type: 'glow_pulse', mesh: amberStone1 });
  }

  // 7. SUGAR WORLD: Giant Floating Glazed Donut & Marshmallow Pavilion
  function buildSugarDonutSanctuary(THREE, def, root, animElements, game) {
    const donut = new THREE.Mesh(new THREE.TorusGeometry(3.6, 1.4, 16, 32),
      new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.6 }));
    donut.rotation.x = Math.PI / 2;
    donut.position.y = 0.4;
    root.add(donut);

    const frosting = new THREE.Mesh(new THREE.TorusGeometry(3.6, 1.25, 16, 32),
      new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.4 }));
    frosting.rotation.x = Math.PI / 2;
    frosting.position.y = 0.85;
    root.add(frosting);

    const centerFloor = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 2.8, 0.4, 24),
      new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.7 }));
    centerFloor.position.y = 0.35;
    root.add(centerFloor);

    registerCollider(game,
      new THREE.Vector3(def.pos.x - 5.0, def.pos.y - 0.2, def.pos.z - 5.0),
      new THREE.Vector3(def.pos.x + 5.0, def.pos.y + 0.6, def.pos.z + 5.0)
    );

    const caneMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    for (let c = 0; c < 4; c++) {
      const angle = (c / 4) * Math.PI * 2;
      const cane = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 3.8, 12), caneMat);
      cane.position.set(Math.cos(angle) * 3.2, 1.9, Math.sin(angle) * 3.2);
      root.add(cane);
    }

    const roof = new THREE.Mesh(new THREE.ConeGeometry(4.0, 1.4, 8),
      new THREE.MeshStandardMaterial({ color: 0xa7f3d0, roughness: 0.7 }));
    roof.position.set(0, 4.2, 0);
    root.add(roof);

    const mPouf1 = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.9, 0.5, 16),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.5 }));
    mPouf1.position.set(-1.8, 0.55, 1.4);
    root.add(mPouf1);
    const mPouf2 = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.9, 0.5, 16),
      new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.5 }));
    mPouf2.position.set(1.8, 0.55, 1.4);
    root.add(mPouf2);

    const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.6, 1.2, 16),
      new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.3 }));
    mug.position.set(0, 0.9, -2.4);
    root.add(mug);
  }

  // 8. VOLCANO CAVE: Obsidian Grotto & Mystical Blue Fire Haven
  function buildVolcanoGrottoSanctuary(THREE, def, root, animElements, game) {
    const floor = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 5.6, 0.5, 24),
      new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.95 }));
    floor.position.y = 0.25;
    root.add(floor);

    registerCollider(game,
      new THREE.Vector3(def.pos.x - 5.5, def.pos.y - 0.2, def.pos.z - 5.5),
      new THREE.Vector3(def.pos.x + 5.5, def.pos.y + 0.45, def.pos.z + 5.5)
    );

    const obsMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.1, metalness: 0.8 });
    const archLeft = new THREE.Mesh(new THREE.ConeGeometry(1.2, 4.8, 6), obsMat);
    archLeft.position.set(-3.5, 2.4, -0.5);
    root.add(archLeft);
    const archRight = new THREE.Mesh(new THREE.ConeGeometry(1.2, 4.8, 6), obsMat);
    archRight.position.set(3.5, 2.4, -0.5);
    root.add(archRight);

    const archTop = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.8, 1.4), obsMat);
    archTop.position.set(0, 4.2, -0.5);
    root.add(archTop);

    const brazierMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.8 });
    [-2.2, 2.2].forEach(bx => {
      const brazier = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.3, 1.1, 12), brazierMat);
      brazier.position.set(bx, 0.8, 0.8);
      root.add(brazier);

      const blueFlame = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.75, 8),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 2.2 }));
      blueFlame.position.set(bx, 1.6, 0.8);
      root.add(blueFlame);
      animElements.push({ type: 'flame', mesh: blueFlame });

      const bLight = new THREE.PointLight(0x38bdf8, 2.0, 8);
      bLight.position.set(bx, 1.8, 0.8);
      root.add(bLight);
    });

    const bench = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.4, 1.1),
      new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.8 }));
    bench.position.set(0, 0.65, 1.6);
    root.add(bench);
  }

  // 9. UNDERWATER PALACE: Sunken Giant Clam Grotto & Bioluminescent Coral
  function buildUnderwaterClamSanctuary(THREE, def, root, animElements, game) {
    const floor = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 5.6, 0.45, 24),
      new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.9 }));
    floor.position.y = 0.22;
    root.add(floor);

    registerCollider(game,
      new THREE.Vector3(def.pos.x - 5.5, def.pos.y - 0.2, def.pos.z - 5.5),
      new THREE.Vector3(def.pos.x + 5.5, def.pos.y + 0.45, def.pos.z + 5.5)
    );

    const shellMat = new THREE.MeshStandardMaterial({ color: 0xe0e7ff, roughness: 0.3, metalness: 0.3 });
    const clamBottom = new THREE.Mesh(new THREE.SphereGeometry(2.4, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.45), shellMat);
    clamBottom.scale.set(1.4, 0.3, 1.2);
    clamBottom.position.set(0, 0.35, 1.2);
    root.add(clamBottom);

    const clamTop = new THREE.Mesh(new THREE.SphereGeometry(2.4, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.45), shellMat);
    clamTop.rotation.x = Math.PI * 0.75;
    clamTop.scale.set(1.4, 0.3, 1.2);
    clamTop.position.set(0, 1.8, 2.4);
    root.add(clamTop);

    const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.48, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x38bdf8, emissiveIntensity: 1.2 }));
    pearl.position.set(0, 0.85, 1.2);
    root.add(pearl);
    animElements.push({ type: 'spin_y', mesh: pearl });

    const coralMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.8 });
    for (let c = 0; c < 5; c++) {
      const angle = Math.PI * 0.6 + (c / 4) * Math.PI * 0.8;
      const coral = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.45, 3.2, 8), coralMat);
      coral.position.set(Math.cos(angle) * 4.2, 1.6, Math.sin(angle) * 4.2);
      root.add(coral);
    }

    for (let b = 0; b < 4; b++) {
      const bubble = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x06b6d4, emissiveIntensity: 1.5, transparent: true, opacity: 0.8 }));
      bubble.position.set(-1.8 + b * 1.2, 2.4 + (b % 2) * 0.6, -0.8);
      root.add(bubble);
      animElements.push({ type: 'bubble_float', mesh: bubble, origY: bubble.position.y });
    }
  }

  // 10. GOLDEN SANCTUARY: Floating Cloud Gazebo Island & Sun Halo
  function buildGoldGazeboSanctuary(THREE, def, root, animElements, game) {
    const cloudCluster = new THREE.Group();
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 });
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(2.2, 1), cloudMat);
      puff.position.set(Math.cos(angle) * 3.6, 0.1, Math.sin(angle) * 3.6);
      cloudCluster.add(puff);
    }
    root.add(cloudCluster);

    const floor = new THREE.Mesh(new THREE.CylinderGeometry(4.4, 4.4, 0.35, 24),
      new THREE.MeshStandardMaterial({ color: 0xfef08a, metalness: 0.6, roughness: 0.3 }));
    floor.position.y = 0.25;
    root.add(floor);

    registerCollider(game,
      new THREE.Vector3(def.pos.x - 4.6, def.pos.y - 0.2, def.pos.z - 4.6),
      new THREE.Vector3(def.pos.x + 4.6, def.pos.y + 0.45, def.pos.z + 4.6)
    );

    const colMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const goldCapMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9, roughness: 0.2 });
    for (let c = 0; c < 6; c++) {
      const angle = (c / 6) * Math.PI * 2;
      const colX = Math.cos(angle) * 3.6;
      const colZ = Math.sin(angle) * 3.6;

      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 3.8, 12), colMat);
      col.position.set(colX, 2.0, colZ);
      root.add(col);

      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.2, 12), goldCapMat);
      cap.position.set(colX, 3.9, colZ);
      root.add(cap);
    }

    const halo = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.18, 12, 32),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xeab308, emissiveIntensity: 1.2 }));
    halo.rotation.x = Math.PI / 2;
    halo.position.set(0, 4.2, 0);
    root.add(halo);
    animElements.push({ type: 'spin_y', mesh: halo });

    const divan = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.5, 1.4),
      new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.6 }));
    divan.position.set(0, 0.6, 1.6);
    root.add(divan);
  }

  // 11. WATER CAVE: Hollow Amethyst Geode Cavern & Healing Spring
  function buildAmethystGeodeSanctuary(THREE, def, root, animElements, game) {
    const floor = new THREE.Mesh(new THREE.CylinderGeometry(5.0, 5.4, 0.45, 24),
      new THREE.MeshStandardMaterial({ color: 0x3b0764, roughness: 0.8 }));
    floor.position.y = 0.22;
    root.add(floor);

    registerCollider(game,
      new THREE.Vector3(def.pos.x - 5.2, def.pos.y - 0.2, def.pos.z - 5.2),
      new THREE.Vector3(def.pos.x + 5.2, def.pos.y + 0.45, def.pos.z + 5.2)
    );

    const geodeMat = new THREE.MeshStandardMaterial({ color: 0x581c87, roughness: 0.4 });
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7, emissive: 0x7e22ce, emissiveIntensity: 0.9,
      roughness: 0.2, metalness: 0.6
    });

    for (let g = 0; g < 9; g++) {
      const angle = Math.PI * 0.6 + (g / 8) * Math.PI * 0.8;
      const gx = Math.cos(angle) * 4.4;
      const gz = Math.sin(angle) * 4.4;

      const rockPillar = new THREE.Mesh(new THREE.ConeGeometry(1.2, 4.2, 6), geodeMat);
      rockPillar.position.set(gx, 2.1, gz);
      root.add(rockPillar);

      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.6, 5), crystalMat);
      spike.rotation.x = 0.4;
      spike.rotation.y = angle;
      spike.position.set(gx * 0.85, 1.8, gz * 0.85);
      root.add(spike);
    }

    const spring = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.2, 16),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.6, roughness: 0.1 }));
    spring.position.set(0, 0.35, 0.8);
    root.add(spring);
  }

  // 12. RUIN VILLAGE: Ruined Medieval Stone Watchtower & Warm Fireplace
  function buildRuinTowerSanctuary(THREE, def, root, animElements, game) {
    const floor = new THREE.Mesh(new THREE.CylinderGeometry(5.0, 5.4, 0.45, 24),
      new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.95 }));
    floor.position.y = 0.22;
    root.add(floor);

    registerCollider(game,
      new THREE.Vector3(def.pos.x - 5.2, def.pos.y - 0.2, def.pos.z - 5.2),
      new THREE.Vector3(def.pos.x + 5.2, def.pos.y + 0.45, def.pos.z + 5.2)
    );

    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 });
    for (let w = 0; w < 8; w++) {
      const angle = Math.PI * 0.65 + (w / 7) * Math.PI * 1.35;
      const block = new THREE.Mesh(new THREE.BoxGeometry(1.8, 3.6, 0.8), stoneMat);
      block.rotation.y = -angle;
      block.position.set(Math.cos(angle) * 4.4, 1.8, Math.sin(angle) * 4.4);
      root.add(block);
    }

    const chimney = new THREE.Mesh(new THREE.BoxGeometry(2.4, 4.4, 1.2),
      new THREE.MeshStandardMaterial({ color: 0x7f1d1d, roughness: 0.9 }));
    chimney.position.set(0, 2.2, -3.8);
    root.add(chimney);

    const hearthHole = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.2, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x18181b }));
    hearthHole.position.set(0, 0.8, -3.3);
    root.add(hearthHole);

    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.75, 8),
      new THREE.MeshStandardMaterial({ color: 0xff6600, emissive: 0xff4500, emissiveIntensity: 2.2 }));
    flame.position.set(0, 0.75, -3.2);
    root.add(flame);
    animElements.push({ type: 'flame', mesh: flame });

    const fLight = new THREE.PointLight(0xff7700, 2.5, 10);
    fLight.position.set(0, 1.2, -3.0);
    root.add(fLight);

    const bed = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.35, 2.6),
      new THREE.MeshStandardMaterial({ color: 0x713f12, roughness: 0.8 }));
    bed.position.set(-2.4, 0.42, 0.6);
    root.add(bed);
  }

  // 13. SNOW DESERT: Glacial Ice Igloo & Natural Steaming Hot Spring
  function buildSnowIglooSanctuary(THREE, def, root, animElements, game) {
    const floor = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 5.6, 0.45, 24),
      new THREE.MeshStandardMaterial({ color: 0xe0f2fe, roughness: 0.4 }));
    floor.position.y = 0.22;
    root.add(floor);

    registerCollider(game,
      new THREE.Vector3(def.pos.x - 5.5, def.pos.y - 0.2, def.pos.z - 5.5),
      new THREE.Vector3(def.pos.x + 5.5, def.pos.y + 0.45, def.pos.z + 5.5)
    );

    const iceMat = new THREE.MeshStandardMaterial({
      color: 0xbae6fd, roughness: 0.1, metalness: 0.2,
      transparent: true, opacity: 0.75
    });
    const iglooDome = new THREE.Mesh(
      new THREE.SphereGeometry(4.8, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.52),
      iceMat
    );
    iglooDome.position.set(0, 0.22, 0);
    root.add(iglooDome);

    const spring = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 1.8, 0.3, 16),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, metalness: 0.3 }));
    spring.position.set(0, 0.4, 0.8);
    root.add(spring);

    const firePit = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.14, 8, 16),
      new THREE.MeshStandardMaterial({ color: 0x475569 }));
    firePit.rotation.x = Math.PI / 2;
    firePit.position.set(0, 0.48, -2.4);
    root.add(firePit);

    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.7, 8),
      new THREE.MeshStandardMaterial({ color: 0xff6600, emissive: 0xff4500, emissiveIntensity: 2.0 }));
    flame.position.set(0, 0.85, -2.4);
    root.add(flame);
    animElements.push({ type: 'flame', mesh: flame });

    const bench = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.4, 1.0),
      new THREE.MeshStandardMaterial({ color: 0x78350f }));
    bench.position.set(2.4, 0.55, -0.4);
    root.add(bench);
  }

  // 14. FOREST TEMPLE: Ancient Hollow Oak Tree Trunk
  function buildHollowTreeSanctuary(THREE, def, root, animElements, game) {
    const floor = new THREE.Mesh(new THREE.CylinderGeometry(5.0, 5.4, 0.45, 24),
      new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.95 }));
    floor.position.y = 0.22;
    root.add(floor);

    registerCollider(game,
      new THREE.Vector3(def.pos.x - 5.2, def.pos.y - 0.2, def.pos.z - 5.2),
      new THREE.Vector3(def.pos.x + 5.2, def.pos.y + 0.45, def.pos.z + 5.2)
    );

    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(4.4, 4.8, 4.8, 16, 1, true, 0, Math.PI * 1.5),
      new THREE.MeshStandardMaterial({ color: 0x3d2817, roughness: 0.9 })
    );
    trunk.position.set(0, 2.6, 0);
    root.add(trunk);

    const mushMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 1.4, roughness: 0.3
    });
    for (let m = 0; m < 5; m++) {
      const angle = Math.PI * 0.7 + (m / 4) * Math.PI * 0.6;
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 8), mushMat);
      cap.scale.set(1, 0.45, 1);
      cap.position.set(Math.cos(angle) * 3.8, 1.2 + (m % 3) * 0.6, Math.sin(angle) * 3.8);
      root.add(cap);
    }

    const clover = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.15, 2.4),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.8 }));
    clover.position.set(0, 0.48, 0.8);
    root.add(clover);
  }

  // 15. BEEHIVE: True Hexagonal Honeycomb Wax Chamber
  function buildHexHoneycombSanctuary(THREE, def, root, animElements, game) {
    const floor = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 5.6, 0.45, 6),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.6 }));
    floor.position.y = 0.22;
    root.add(floor);

    registerCollider(game,
      new THREE.Vector3(def.pos.x - 5.5, def.pos.y - 0.2, def.pos.z - 5.5),
      new THREE.Vector3(def.pos.x + 5.5, def.pos.y + 0.45, def.pos.z + 5.5)
    );

    const waxMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24, roughness: 0.4, transparent: true, opacity: 0.85
    });
    const hexWall = new THREE.Mesh(
      new THREE.CylinderGeometry(4.8, 5.0, 4.2, 6, 1, true, 0, Math.PI * 1.65),
      waxMat
    );
    hexWall.position.set(0, 2.3, 0);
    root.add(hexWall);

    const fountain = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.4, 0.6, 6),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.1, metalness: 0.5 }));
    fountain.position.set(0, 0.55, -2.2);
    root.add(fountain);

    const honeyOrb = new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 1.2 }));
    honeyOrb.position.set(0, 1.3, -2.2);
    root.add(honeyOrb);
    animElements.push({ type: 'spin_y', mesh: honeyOrb });

    const lounge1 = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.45, 6),
      new THREE.MeshStandardMaterial({ color: 0xd97706 }));
    lounge1.position.set(-2.0, 0.5, 0.8);
    root.add(lounge1);
    const lounge2 = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.45, 6),
      new THREE.MeshStandardMaterial({ color: 0xd97706 }));
    lounge2.position.set(2.0, 0.5, 0.8);
    root.add(lounge2);
  }

  // 16. PELICAN PLAINS: Sky Feather Nest atop Billowing Cloud
  function buildSkyNestSanctuary(THREE, def, root, animElements, game) {
    const cloudCluster = new THREE.Group();
    const cMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 });
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2;
      const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(2.4, 1), cMat);
      puff.position.set(Math.cos(angle) * 3.4, 0.1, Math.sin(angle) * 3.4);
      cloudCluster.add(puff);
    }
    root.add(cloudCluster);

    const nestRim = new THREE.Mesh(new THREE.TorusGeometry(4.5, 0.45, 10, 24),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 }));
    nestRim.rotation.x = Math.PI / 2;
    nestRim.position.y = 0.5;
    root.add(nestRim);

    const turf = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.2, 0.4, 24),
      new THREE.MeshStandardMaterial({ color: 0xf0fdf4, roughness: 0.7 }));
    turf.position.y = 0.3;
    root.add(turf);

    registerCollider(game,
      new THREE.Vector3(def.pos.x - 4.5, def.pos.y - 0.2, def.pos.z - 4.5),
      new THREE.Vector3(def.pos.x + 4.5, def.pos.y + 0.45, def.pos.z + 4.5)
    );

    const featherMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
    for (let f = 0; f < 5; f++) {
      const angle = Math.PI * 0.7 + (f / 4) * Math.PI * 0.6;
      const feather = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.2, 0.08), featherMat);
      feather.rotation.y = -angle;
      feather.rotation.x = -0.25;
      feather.position.set(Math.cos(angle) * 4.0, 1.8, Math.sin(angle) * 4.0);
      root.add(feather);
    }

    const bath = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 0.8, 0.8, 16),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 }));
    bath.position.set(0, 0.65, 1.4);
    root.add(bath);
  }

  // ==========================================================================
  // BESPOKE 3D CHEST BUILDER (Theme-Specific Materials, Shapes & Lid Opening)
  // ==========================================================================
  function buildThemedChestMesh(THREE, def, animElements) {
    const chestGroup = new THREE.Group();
    chestGroup.name = 'sanctuary_secret_chest_group';
    chestGroup.position.set(def.chestOffset.x, 0.45 + def.chestOffset.y, def.chestOffset.z);

    let baseColor = 0x78350f;
    let rimColor = 0xfacc15;
    let lockColor = def.secondaryColor || 0x38bdf8;

    if (def.theme === 'jokerooms_floating') {
      baseColor = 0x701a75;
      rimColor = 0xfacc15;
    } else if (def.theme === 'space_floating_platforms') {
      baseColor = 0x1e1b4b;
      rimColor = 0x38bdf8;
      lockColor = 0xc084fc;
    } else if (def.theme === 'phelix_underwater_tunnel') {
      baseColor = 0x0369a1;
      rimColor = 0x67e8f9;
      lockColor = 0x38bdf8;
    } else if (def.theme === 'poneix_alien_sanctuary') {
      baseColor = 0x064e3b;
      rimColor = 0x34d399;
      lockColor = 0x10b981;
    } else if (def.theme === 'desert_cave') {
      baseColor = 0xd97706;
      rimColor = 0xfef08a;
    } else if (def.theme === 'dino_ribcage') {
      baseColor = 0x451a03;
      rimColor = 0xfef3c7;
    } else if (def.theme === 'sugar_donut') {
      baseColor = 0x059669;
      rimColor = 0xf472b6;
    } else if (def.theme === 'volcano_grotto') {
      baseColor = 0x18181b;
      rimColor = 0xef4444;
    } else if (def.theme === 'underwater_clam') {
      baseColor = 0x0284c7;
      rimColor = 0xe0e7ff;
    } else if (def.theme === 'gold_gazebo') {
      baseColor = 0xeab308;
      rimColor = 0xffffff;
    } else if (def.theme === 'amethyst_geode') {
      baseColor = 0x6b21a8;
      rimColor = 0x38bdf8;
    } else if (def.theme === 'ruin_tower') {
      baseColor = 0x3f3f46;
      rimColor = 0x60a5fa;
    } else if (def.theme === 'snow_igloo') {
      baseColor = 0x0284c7;
      rimColor = 0xa5f3fc;
    } else if (def.theme === 'hollow_tree') {
      baseColor = 0x14532d;
      rimColor = 0x4ade80;
    } else if (def.theme === 'hex_honeycomb') {
      baseColor = 0xb45309;
      rimColor = 0xfef08a;
    } else if (def.theme === 'sky_nest') {
      baseColor = 0x0284c7;
      rimColor = 0xf472b6;
    }

    // Chest Body Box
    const baseGeo = new THREE.BoxGeometry(1.6, 0.75, 1.1);
    const baseMat = new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.4,
      metalness: def.theme.includes('space') || def.theme.includes('phelix') ? 0.8 : 0.25
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = 0.375;
    chestGroup.add(baseMesh);

    // Decorative corner trims
    const rimMat = new THREE.MeshStandardMaterial({
      color: rimColor,
      metalness: 0.8,
      roughness: 0.25,
      emissive: rimColor,
      emissiveIntensity: 0.25
    });
    const rimL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.76, 1.12), rimMat);
    rimL.position.set(-0.76, 0.375, 0);
    chestGroup.add(rimL);
    const rimR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.76, 1.12), rimMat);
    rimR.position.set(0.76, 0.375, 0);
    chestGroup.add(rimR);

    // Hinged Lid Group
    const lidGroup = new THREE.Group();
    lidGroup.name = 'sanctuary_chest_lid_group';
    lidGroup.position.set(0, 0.75, -0.55);

    const lidGeo = new THREE.CylinderGeometry(0.55, 0.55, 1.62, 16, 1, false, 0, Math.PI);
    const lidMesh = new THREE.Mesh(lidGeo, baseMat);
    lidMesh.rotation.z = Math.PI / 2;
    lidMesh.rotation.x = Math.PI;
    lidMesh.position.set(0, 0, 0.55);
    lidGroup.add(lidMesh);

    const lockMesh = new THREE.Mesh(new THREE.DodecahedronGeometry(0.24, 0),
      new THREE.MeshStandardMaterial({ color: lockColor, emissive: lockColor, emissiveIntensity: 1.2, roughness: 0.2 }));
    lockMesh.position.set(0, 0.08, 1.12);
    lidGroup.add(lockMesh);

    chestGroup.add(lidGroup);

    // 3D Floating Interaction Prompt Diamond
    const promptGroup = new THREE.Group();
    promptGroup.name = 'sanctuary_chest_prompt_group';
    promptGroup.position.set(0, 1.9, 0);

    const promptMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.35, 0),
      new THREE.MeshStandardMaterial({ color: def.primaryColor, emissive: def.primaryColor, emissiveIntensity: 1.5 }));
    promptGroup.add(promptMesh);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.06, 8, 16),
      new THREE.MeshStandardMaterial({ color: rimColor, emissive: rimColor, emissiveIntensity: 1.2 }));
    ring.rotation.x = Math.PI / 2;
    promptGroup.add(ring);

    chestGroup.add(promptGroup);

    return { chestGroup, lidGroup, promptGroup, promptMesh };
  }

  // ==========================================================================
  // SANCTUARY MESH MASTER BUILDER
  // ==========================================================================
  function buildSanctuaryMesh(THREE, def, game) {
    const root = new THREE.Group();
    root.name = 'secret_sanctuary_root_' + def.regionKey;
    root.position.set(def.pos.x, def.pos.y, def.pos.z);

    const animElements = [];

    // Call individual unique architectural builders!
    switch (def.theme) {
      case 'jokerooms_floating':
        buildJokeroomsFloatingRoom(THREE, def, root, animElements, game);
        break;
      case 'space_floating_platforms':
        buildSpaceFloatingPlatformsSanctuary(THREE, def, root, animElements, game);
        break;
      case 'phelix_underwater_tunnel':
        buildPhelixUnderwaterTunnelSanctuary(THREE, def, root, animElements, game);
        break;
      case 'poneix_alien_sanctuary':
        buildPoneixAlienSanctuary(THREE, def, root, animElements, game);
        break;
      case 'desert_cave':
        buildDesertCaveSanctuary(THREE, def, root, animElements, game);
        break;
      case 'dino_ribcage':
        buildDinoRibcageSanctuary(THREE, def, root, animElements, game);
        break;
      case 'sugar_donut':
        buildSugarDonutSanctuary(THREE, def, root, animElements, game);
        break;
      case 'volcano_grotto':
        buildVolcanoGrottoSanctuary(THREE, def, root, animElements, game);
        break;
      case 'underwater_clam':
        buildUnderwaterClamSanctuary(THREE, def, root, animElements, game);
        break;
      case 'gold_gazebo':
        buildGoldGazeboSanctuary(THREE, def, root, animElements, game);
        break;
      case 'amethyst_geode':
        buildAmethystGeodeSanctuary(THREE, def, root, animElements, game);
        break;
      case 'ruin_tower':
        buildRuinTowerSanctuary(THREE, def, root, animElements, game);
        break;
      case 'snow_igloo':
        buildSnowIglooSanctuary(THREE, def, root, animElements, game);
        break;
      case 'hollow_tree':
        buildHollowTreeSanctuary(THREE, def, root, animElements, game);
        break;
      case 'hex_honeycomb':
        buildHexHoneycombSanctuary(THREE, def, root, animElements, game);
        break;
      case 'sky_nest':
        buildSkyNestSanctuary(THREE, def, root, animElements, game);
        break;
      default:
        buildDesertCaveSanctuary(THREE, def, root, animElements, game);
    }

    // Add Themed Secret Chest to the sanctuary
    const chestData = buildThemedChestMesh(THREE, def, animElements);
    root.add(chestData.chestGroup);

    let animClock = 0;
    const isOpened = !!window.__secretSanctuaryChests[def.regionKey];
    let lidProgress = isOpened ? 1.0 : 0.0;

    root.userData = {
      def: def,
      lidGroup: chestData.lidGroup,
      promptGroup: chestData.promptGroup,
      update: function(dt = 0.016) {
        animClock += dt;

        // Prompt icon bounce & spin
        if (chestData.promptGroup && chestData.promptGroup.visible) {
          chestData.promptGroup.rotation.y += 0.04;
          chestData.promptMesh.position.y = Math.sin(animClock * 3.5) * 0.12;
        }

        // Custom theme animations
        animElements.forEach(item => {
          if (!item.mesh) return;
          if (item.type === 'spin_y') {
            item.mesh.rotation.y += dt * 1.5;
          } else if (item.type === 'flame') {
            item.mesh.scale.y = 0.85 + Math.sin(animClock * 12) * 0.15;
          } else if (item.type === 'glow_pulse') {
            if (item.mesh.material) {
              item.mesh.material.emissiveIntensity = 0.8 + Math.sin(animClock * 4) * 0.4;
            }
          } else if (item.type === 'bubble_float') {
            item.mesh.position.y = item.origY + Math.sin(animClock * 2.5 + item.mesh.position.x) * 0.25;
          } else if (item.type === 'hover_y') {
            item.mesh.position.y = item.origY + Math.sin(animClock * 2.2 + (item.phase || 0)) * 0.25;
          } else if (item.type === 'swim_circle') {
            const angle = animClock * 0.8 + item.phase;
            item.mesh.position.x = item.centerX + Math.cos(angle) * item.radius;
            item.mesh.position.z = item.centerZ + Math.sin(angle) * item.radius;
            item.mesh.rotation.y = -angle + Math.PI / 2;
          } else if (item.type === 'fluorescent') {
            if (Math.random() < 0.02) {
              item.mesh.material.emissiveIntensity = 0.8;
              setTimeout(() => { item.mesh.material.emissiveIntensity = 1.8; }, 50);
            }
          }
        });

        // Smooth Lid Opening Animation
        if (window.__secretSanctuaryChests[def.regionKey]) {
          if (chestData.promptGroup) chestData.promptGroup.visible = false;
          if (lidProgress < 1.0) {
            lidProgress = Math.min(1.0, lidProgress + 0.08);
            if (chestData.lidGroup) {
              chestData.lidGroup.rotation.x = -lidProgress * (Math.PI * 0.65);
            }
          }
        }
      }
    };

    return root;
  }

  // ==========================================================================
  // CHEST REWARD & OPENING HANDLER
  // ==========================================================================
  function openSanctuarySecretChest(game, regionKey, def) {
    if (!game || !regionKey || !def) return;
    if (window.__secretSanctuaryChests[regionKey]) return;

    window.__secretSanctuaryChests[regionKey] = true;
    try {
      localStorage.setItem('superbear_sanctuary_chests', JSON.stringify(window.__secretSanctuaryChests));
    } catch (e) {}

    // Swing lid & hide prompt
    if (activeSanctuaryGroup && activeSanctuaryGroup.userData) {
      const lid = activeSanctuaryGroup.userData.lidGroup;
      if (lid) lid.rotation.x = -Math.PI * 0.65;
      const prompt = activeSanctuaryGroup.userData.promptGroup;
      if (prompt) prompt.visible = false;
    }

    // Rewards & Full HP Heal
    const rewardCoins = def.rewardCoins || 250;
    const rewardHoney = def.rewardHoney || 80;
    const rewardXp = def.rewardXp || 400;

    if (game.stats) {
      game.stats.coins = (game.stats.coins || 0) + rewardCoins;
      game.stats.honeyGems = (game.stats.honeyGems || 0) + rewardHoney;
      game.stats.xp = (game.stats.xp || 0) + rewardXp;
      game.stats.currentHp = game.stats.maxHp || 100;
      if (game.callbacks && game.callbacks.onStatsUpdate) {
        game.callbacks.onStatsUpdate(game.stats);
      }
    }
    if (typeof game.coins === 'number') game.coins += rewardCoins;
    if (typeof game.honeyCount === 'number') game.honeyCount += rewardHoney;
    if (typeof game.score === 'number') game.score += rewardXp * 2;
    if (typeof game.updateUI === 'function') game.updateUI();

    // Audio
    if (typeof St !== "undefined" && typeof St.playLevelWin === "function") {
      try { St.playLevelWin(); } catch (e) {}
    }
    if (game.playSound) {
      try { game.playSound('fanfare') || game.playSound('treasure') || game.playSound('coin'); } catch (e) {}
    }

    const boxWorldPos = new window.THREE.Vector3(
      def.pos.x + def.chestOffset.x,
      def.pos.y + 1.2,
      def.pos.z + def.chestOffset.z
    );

    if (game.spawnSparkleParticles && window.THREE) {
      game.spawnSparkleParticles(boxWorldPos, 50, def.primaryColor);
      game.spawnSparkleParticles(boxWorldPos, 30, def.secondaryColor);
    }

    // Save game
    if (window.__superBearSaveManager) {
      window.__superBearSaveManager.saveGame(
        {
          goldBalance: (game.stats && game.stats.coins) || 100,
          honeyGems: (game.stats && game.stats.honeyGems) || 50
        },
        {
          immediate: true,
          showToast: true,
          message: `🎁 ${def.chestTitle} Keşfedildi! (+${rewardCoins} Altın, +${rewardHoney} Bal)`
        }
      );
    }

    // Notices & Dialogue
    if (game.callbacks && game.callbacks.onShowNotice) {
      game.callbacks.onShowNotice(`🎁 ${def.chestTitle} AÇILDI! (+${rewardCoins} Altın, +${rewardHoney} Bal Kristali, +${rewardXp} XP, Tam Can!) ✨`, "success");
    } else if (game.showNotification) {
      game.showNotification(`🎁 ${def.chestTitle} Açıldı! +${rewardCoins} Altın, +${rewardHoney} Bal!`);
    }

    if (game.showDialogue) {
      game.showDialogue(
        `${def.chestTitle} 🎁`,
        `${def.sanctuaryName} içerisindeki gizli sandığı açtın!

Kazanılan: +${rewardCoins} Altın, +${rewardHoney} Şifalı Bal ve +${rewardXp} Tecrübe Puanı! Canın tamamen tazelendi. 🍯✨`,
        "💎"
      );
    }
  }

  // ==========================================================================
  // PER-FRAME SANCTUARY MAINTAINER
  // ==========================================================================
  window.__maintainSecretSanctuaries = function(game) {
    if (!game || !game.scene || !window.THREE) return;
    const currentRegion = game.currentRegion || 'hub';

    // Hub is already serviced by Grand Waterfall Grotto
    if (currentRegion === 'hub') {
      if (activeSanctuaryGroup) {
        if (activeSanctuaryGroup.parent) activeSanctuaryGroup.parent.remove(activeSanctuaryGroup);
        activeSanctuaryGroup = null;
        activeRegionKey = null;
      }
      return;
    }

    const def = resolveSanctuaryDef(currentRegion);
    if (!def) return;

    // Build sanctuary if region changed or not in scene
    if (activeRegionKey !== currentRegion || !activeSanctuaryGroup || !activeSanctuaryGroup.parent) {
      if (activeSanctuaryGroup && activeSanctuaryGroup.parent) {
        activeSanctuaryGroup.parent.remove(activeSanctuaryGroup);
      }

      // Clean out previous region's sanctuary colliders
      if (game.currentLevel && game.currentLevel.colliders) {
        game.currentLevel.colliders = game.currentLevel.colliders.filter(c => !c.isSanctuaryCollider);
      }

      def.regionKey = currentRegion;
      activeSanctuaryGroup = buildSanctuaryMesh(window.THREE, def, game);
      game.scene.add(activeSanctuaryGroup);
      activeRegionKey = currentRegion;
    }

    // Run custom animations
    if (activeSanctuaryGroup && activeSanctuaryGroup.userData && typeof activeSanctuaryGroup.userData.update === 'function') {
      activeSanctuaryGroup.userData.update(0.016);
    }

    // Player Proximity, Resting Healing, and Chest Interactions
    const pPos = game.playerPos;
    if (!pPos) return;

    const distToSanctuary = Math.hypot(pPos.x - def.pos.x, pPos.z - def.pos.z);
    const now = Date.now();

    // 1. DİNLENME YERİ / HEALING AURA
    if (distToSanctuary < 6.5 && Math.abs(pPos.y - def.pos.y) < 4.2) {
      if (now - lastRestHealTime > 500) {
        lastRestHealTime = now;
        if (game.stats && (game.stats.currentHp || 0) < (game.stats.maxHp || 100)) {
          game.stats.currentHp = Math.min(game.stats.maxHp || 100, (game.stats.currentHp || 100) + 4);
          if (game.callbacks && game.callbacks.onStatsUpdate) {
            game.callbacks.onStatsUpdate(game.stats);
          }
          if (game.spawnSparkleParticles && window.THREE) {
            game.spawnSparkleParticles(pPos, 6, 0x22c55e);
          }
        }
      }

      // Atmospheric notice
      if (now - lastNoticeTime > 14000) {
        lastNoticeTime = now;
        if (game.callbacks && game.callbacks.onShowNotice) {
          game.callbacks.onShowNotice(`🏕️ ${def.sanctuaryName}: Güvenli Dinlenme Yerindesin! Canın yenileniyor... ✨`, "success");
        }
      }
    }

    // 2. SECRET BOX PROXIMITY & INTERACTION
    const boxWorldX = def.pos.x + def.chestOffset.x;
    const boxWorldZ = def.pos.z + def.chestOffset.z;
    const distToBox = Math.hypot(pPos.x - boxWorldX, pPos.z - boxWorldZ);
    const isBoxOpened = !!window.__secretSanctuaryChests[currentRegion];

    if (!isBoxOpened && distToBox < 4.5) {
      const isVeryClose = distToBox < 2.85;
      const isInteracting = window.__isEKeyPressed || window.__isSpaceKeyPressed ||
        (game.inputs && (game.inputs.attack || game.inputs.interact || game.inputs.jump)) ||
        game.isAttacking;

      if (isVeryClose || isInteracting) {
        openSanctuarySecretChest(game, currentRegion, def);
      }
    }
  };

  // Global exports
  window.__openSanctuarySecretChest = openSanctuarySecretChest;
  window.__SANCTUARY_DEFS = SANCTUARY_DEFS;

  // Global Pointer Listener for clicks on secret box
  if (typeof window !== 'undefined') {
    window.addEventListener('pointerdown', () => {
      const game = window.__superBearGame;
      if (!game || !game.playerPos) return;
      const r = game.currentRegion || 'hub';
      if (r === 'hub') return;
      const def = resolveSanctuaryDef(r);
      if (!def) return;
      const boxX = def.pos.x + def.chestOffset.x;
      const boxZ = def.pos.z + def.chestOffset.z;
      const d = Math.hypot(game.playerPos.x - boxX, game.playerPos.z - boxZ);
      if (d < 4.8 && !window.__secretSanctuaryChests[r]) {
        openSanctuarySecretChest(game, r, def);
      }
    });
  }

})();
