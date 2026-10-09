// ============================================================================
// 🌀 NEŞELİ AYI KÖYÜ 15 BÖLÜM PORTAL MERKEZİ (VILLAGE PORTAL SANCTUARY v1.0)
// - Ayı Köyü'nün (hub) her yerine özenle yerleştirilmiş 15 tematik bölüm portalı!
// - Portallar ASLA havada durmaz; tam zemin yüksekliğine (`groundY`) sabitlenmiştir.
// - Dağların içine veya karmaşık köşelere konulmaz; köy meydanı ve açık yeşil çayırlarda dururlar.
// - YALNIZCA Ayı Köyü'nde ('hub') aktiftir; diğer bölümlerde asla görünmez!
// - Her bölümün kendine has tematik zemin süslemesi ve önünde yüksek çözünürlüklü ahşap tabelası vardır.
//   (Örn: 15. Bölüm Arılar Çölü önünde gerçek çöl kumu, kaktüs ve "15. Bölüm: Arılar Çölü" tabelası)
// ============================================================================

(function() {
  'use strict';

  console.log("🌀 Loading Neşeli Ayı Köyü 15 Bölüm Portalları Sistemi...");

  let villagePortalsGroup = null;
  let activePortalsList = [];
  let isPortalsBuilt = false;

  // 15 Bölümün Eksiksiz Veri Haritası
  const VILLAGE_PORTALS_DATA = [
    {
      id: "hub",
      chapterNum: 1,
      targetRegion: "hub",
      title: "1. BÖLÜM: AYI KÖYÜ",
      subtitle: "🏡 Neşeli Ayı Köyü & Meydan Anıtı",
      icon: "🐻",
      pos: { x: 0, z: 10 },
      yaw: 0,
      archColor: 0x94a3b8,
      vortexColor: 0xf59e0b,
      lightColor: 0xfde047,
      themeType: "village"
    },
    {
      id: "forest_temple",
      chapterNum: 2,
      targetRegion: "forest_temple",
      title: "2. BÖLÜM: ORMAN TAPINAĞI",
      subtitle: "🌿 Sarmaşıklı Muhafız & Zehir Havuzu",
      icon: "🌲",
      pos: { x: -14, z: -14 },
      yaw: Math.PI * 0.25,
      archColor: 0x15803d,
      vortexColor: 0x22c55e,
      lightColor: 0x4ade80,
      themeType: "forest"
    },
    {
      id: "beehive",
      chapterNum: 3,
      targetRegion: "beehive",
      title: "3. BÖLÜM: BAL KOVANI",
      subtitle: "🐝 Zırhlı Mor Ayı & Dev Kovan Labirenti",
      icon: "🐝",
      pos: { x: 14, z: -14 },
      yaw: -Math.PI * 0.25,
      archColor: 0xd97706,
      vortexColor: 0xf59e0b,
      lightColor: 0xfde047,
      themeType: "beehive"
    },
    {
      id: "pelican_plains",
      chapterNum: 4,
      targetRegion: "pelican_plains",
      title: "4. BÖLÜM: PELİKAN OVALARI",
      subtitle: "🪶 Gök Adaları & Fırtına Pelikan Lordu",
      icon: "🪽",
      pos: { x: 26, z: -4 },
      yaw: -Math.PI * 0.45,
      archColor: 0x0284c7,
      vortexColor: 0x38bdf8,
      lightColor: 0x7dd3fc,
      themeType: "pelican"
    },
    {
      id: "snow_desert",
      chapterNum: 5,
      targetRegion: "snow_desert",
      title: "5. BÖLÜM: KAR VADİSİ",
      subtitle: "❄️ Buz Kanyonu & Dev Koca Ayak Yeti",
      icon: "❄️",
      pos: { x: 26, z: 10 },
      yaw: -Math.PI * 0.6,
      archColor: 0x38bdf8,
      vortexColor: 0x67e8f9,
      lightColor: 0xe0f2fe,
      themeType: "snow"
    },
    {
      id: "space_realm",
      chapterNum: 6,
      targetRegion: "space_realm",
      title: "6. BÖLÜM: KOZMİK BOYUT",
      subtitle: "🌌 Galaksi İblisi & Boncuk'u Kurtar!",
      icon: "🪐",
      pos: { x: 6, z: -22 },
      yaw: 0,
      archColor: 0x7c3aed,
      vortexColor: 0xc084fc,
      lightColor: 0xe9d5ff,
      themeType: "space"
    },
    {
      id: "volcano_cave",
      chapterNum: 7,
      targetRegion: "volcano_cave",
      title: "7. BÖLÜM: VOLKAN MAĞARASI",
      subtitle: "🌋 Kızıl Ejderha Ignis & Lav Vadisi",
      icon: "🔥",
      pos: { x: -6, z: -22 },
      yaw: 0,
      archColor: 0xb91c1c,
      vortexColor: 0xf97316,
      lightColor: 0xfca5a5,
      themeType: "volcano"
    },
    {
      id: "underwater_palace",
      chapterNum: 8,
      targetRegion: "underwater_palace",
      title: "8. BÖLÜM: SU ALTI SARAYI",
      subtitle: "🌊 Dev Neptün Kraken & Mercan Resifi",
      icon: "🐚",
      pos: { x: 18, z: 20 },
      yaw: -Math.PI * 0.75,
      archColor: 0x0891b2,
      vortexColor: 0x06b6d4,
      lightColor: 0x67e8f9,
      themeType: "underwater"
    },
    {
      id: "golden_sanctuary",
      chapterNum: 9,
      targetRegion: "golden_sanctuary",
      title: "9. BÖLÜM: ALTIN CENNETİ",
      subtitle: "🌟 Kadim Zaman Ejderi & 24K Altın Mabed",
      icon: "👑",
      pos: { x: 10, z: 28 },
      yaw: Math.PI,
      archColor: 0xeab308,
      vortexColor: 0xfacc15,
      lightColor: 0xfef08a,
      themeType: "gold"
    },
    {
      id: "dinosaur_world",
      chapterNum: 10,
      targetRegion: "dinosaur_world",
      title: "10. BÖLÜM: DİNOZOR DÜNYASI",
      subtitle: "🦖 Dev T-Rex Boss & Tarih Öncesi Kanyon",
      icon: "🦖",
      pos: { x: -12, z: 26 },
      yaw: Math.PI * 0.8,
      archColor: 0xb45309,
      vortexColor: 0xd97706,
      lightColor: 0xfde68a,
      themeType: "dino"
    },
    {
      id: "sugar_world",
      chapterNum: 11,
      targetRegion: "sugar_world",
      title: "11. BÖLÜM: ŞEKER DÜNYASI",
      subtitle: "🍬 Lolipop Boss & Çilekli Şeker Evleri",
      icon: "🍭",
      pos: { x: -18, z: 16 },
      yaw: Math.PI * 0.6,
      archColor: 0xdb2777,
      vortexColor: 0xf472b6,
      lightColor: 0xfbcfe8,
      themeType: "sugar"
    },
    {
      id: "jokerooms",
      chapterNum: 12,
      targetRegion: "jokerooms",
      title: "12. BÖLÜM: JOKEROOMS",
      subtitle: "🚪 Sonsuz Sarı Koridorlar & Şakacı Palyaço",
      icon: "🎪",
      pos: { x: -18, z: 2 },
      yaw: Math.PI * 0.5,
      archColor: 0xeab308,
      vortexColor: 0xfde047,
      lightColor: 0xfef08a,
      themeType: "joker"
    },
    {
      id: "ruin_village",
      chapterNum: 13,
      targetRegion: "ruin_village",
      title: "13. BÖLÜM: YIKILMIŞ KÖY",
      subtitle: "🏚️ Harabe Sirk Arenası & Dev Palyaço",
      icon: "🧱",
      pos: { x: -18, z: -8 },
      yaw: Math.PI * 0.4,
      archColor: 0x475569,
      vortexColor: 0xef4444,
      lightColor: 0xfca5a5,
      themeType: "ruin"
    },
    {
      id: "water_cave",
      chapterNum: 14,
      targetRegion: "water_cave",
      title: "14. BÖLÜM: KARANLIK SU MAĞARASI",
      subtitle: "💧 Dev Su Ejderhası & Yeraltı Mabedi",
      icon: "💎",
      pos: { x: -4, z: 32 },
      yaw: Math.PI,
      archColor: 0x1e293b,
      vortexColor: 0x0ea5e9,
      lightColor: 0x38bdf8,
      themeType: "water_cave"
    },
    {
      id: "bee_desert",
      chapterNum: 15,
      targetRegion: "bee_desert",
      title: "15. BÖLÜM: ARILAR ÇÖLÜ",
      subtitle: "🏜️ Antik Piramit & Kovan Çölü",
      icon: "🏜️",
      pos: { x: 4, z: 32 },
      yaw: Math.PI,
      archColor: 0xb45309,
      vortexColor: 0xf59e0b,
      lightColor: 0xfef08a,
      themeType: "bee_desert"
    }
  ];

  // Helper: Get exact ground elevation at (x, z) in Ayı Köyü
  function getVillageGroundY(x, z) {
    let groundY = 0.0;
    // East hill plateau (x: 19.5 to 64.5, z: -20 to 20)
    if (x >= 19.5 && x <= 64.5 && z >= -20 && z <= 20) {
      groundY = 2.0;
    }
    // North raised terrace (x: -17.5 to 17.5, z: -60 to -30)
    else if (x >= -17.5 && x <= 17.5 && z >= -60 && z <= -30) {
      groundY = 3.0;
    }
    // Central cobblestone square (x: -15 to 15, z: -15 to 15)
    else if (Math.abs(x) <= 15 && Math.abs(z) <= 15) {
      groundY = 0.0;
    }
    return groundY;
  }

  // Helper: Create ultra-sharp canvas texture for 3D Signboards
  function createSignboardCanvasTexture(pData) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Background Wood Planks Style
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#3e2723');
    grad.addColorStop(0.5, '#4e342e');
    grad.addColorStop(1, '#271714');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    // Wood Plank Lines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 85); ctx.lineTo(512, 85);
    ctx.moveTo(0, 170); ctx.lineTo(512, 170);
    ctx.stroke();

    // Themed Glowing Border
    ctx.strokeStyle = '#' + pData.vortexColor.toString(16).padStart(6, '0');
    ctx.lineWidth = 10;
    ctx.strokeRect(10, 10, 492, 236);

    // Inner Golden Inset
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(18, 18, 476, 220);

    // Decorative corner rivets
    ctx.fillStyle = '#f59e0b';
    [
      [24, 24], [488, 24], [24, 232], [488, 232]
    ].forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // Header Tag: Icon + Chapter Number
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fde047';
    ctx.shadowColor = 'rgba(0,0,0,0.85)';
    ctx.shadowBlur = 8;
    ctx.font = "bold 32px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText(`${pData.icon}  ${pData.chapterNum}. BÖLÜM  ${pData.icon}`, 256, 56);

    // Main Title
    ctx.fillStyle = '#ffffff';
    ctx.font = "bold 38px 'Segoe UI', system-ui, sans-serif";
    // Strip redundant "X. BÖLÜM: " prefix for cleaner, punchier board display
    const cleanTitle = pData.title.replace(/^\d+\.\s*BÖLÜM:\s*/i, '');
    ctx.fillText(cleanTitle, 256, 120);

    // Subtitle Tag
    ctx.fillStyle = '#cbd5e1';
    ctx.font = "bold 20px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText(pData.subtitle, 256, 168);

    // Bottom Action Prompt
    ctx.fillStyle = '#4ade80';
    ctx.font = "bold 18px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText("🌀 Adım At ve Maceraya Başla! 🌀", 256, 218);

    const tex = new window.THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  // Build a distinct themed signboard
  function buildThemedSignboard(THREE, pData) {
    const signGroup = new THREE.Group();
    signGroup.name = "signboard_" + pData.id;

    const woodPostMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.8 });
    const postGeo = new THREE.CylinderGeometry(0.08, 0.09, 1.8, 8);

    // Left & Right Wooden Posts
    const postL = new THREE.Mesh(postGeo, woodPostMat);
    postL.position.set(-1.15, 0.9, 0);
    postL.castShadow = true;
    signGroup.add(postL);

    const postR = new THREE.Mesh(postGeo, woodPostMat);
    postR.position.set(1.15, 0.9, 0);
    postR.castShadow = true;
    signGroup.add(postR);

    // Signboard plank
    const signTex = createSignboardCanvasTexture(pData);
    const signBoardMat = new THREE.MeshStandardMaterial({
      map: signTex,
      roughness: 0.45,
      metalness: 0.15
    });
    const signWoodBackMat = new THREE.MeshStandardMaterial({ color: 0x2b1810, roughness: 0.9 });
    const boardMats = [
      signWoodBackMat, signWoodBackMat, signWoodBackMat, signWoodBackMat,
      signBoardMat, signWoodBackMat
    ];

    const signBoard = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.35, 0.08), boardMats);
    signBoard.position.set(0, 1.35, 0.02);
    signBoard.castShadow = true;
    signGroup.add(signBoard);

    // Signboard roof cap
    const capMat = new THREE.MeshStandardMaterial({ color: 0x1f140e, roughness: 0.7 });
    const capMesh = new THREE.Mesh(new THREE.BoxGeometry(2.65, 0.12, 0.22), capMat);
    capMesh.position.set(0, 2.06, 0.02);
    signGroup.add(capMesh);

    return signGroup;
  }

  // Build the complete themed environment dressing for each chapter
  function buildThemedDecor(THREE, pData) {
    const decorGroup = new THREE.Group();
    decorGroup.name = "decor_" + pData.id;

    const t = pData.themeType;

    if (t === "bee_desert") {
      // 15. BÖLÜM: ARILAR ÇÖLÜ (Kullanıcının isteği: önünde biraz kum, kaktüs ve tabela!)
      const sandMat = new THREE.MeshStandardMaterial({
        color: 0xeab308,
        roughness: 0.95,
        emissive: 0xca8a04,
        emissiveIntensity: 0.15
      });
      // Kumul Tepesi (Real Desert Sand Bed)
      const sandDune = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 4.4, 0.25, 20), sandMat);
      sandDune.position.set(0, 0.12, 0.6);
      sandDune.receiveShadow = true;
      decorGroup.add(sandDune);

      // İkinci Dalgalı Kum Katmanı
      const sandDuneFront = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 3.4, 0.22, 16), sandMat);
      sandDuneFront.position.set(0, 0.14, 1.6);
      sandDuneFront.receiveShadow = true;
      decorGroup.add(sandDuneFront);

      // Çöl Taşları / Kumtaşı Blokları
      const stoneMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.8 });
      [-2.4, 2.3].forEach((sx, sidx) => {
        const b = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.45, 0.7), stoneMat);
        b.position.set(sx, 0.22, 0.8 + sidx * 0.4);
        b.rotation.y = sidx * 0.5;
        decorGroup.add(b);
      });

      // Mini Çöl Kaktüsü (Yeşil gövde ve kollar)
      const cactusMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 });
      const cactus = new THREE.Group();
      cactus.position.set(2.2, 0, 1.4);
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 1.3, 8), cactusMat);
      stem.position.y = 0.65;
      cactus.add(stem);
      const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.45, 6), cactusMat);
      armL.position.set(-0.25, 0.7, 0);
      armL.rotation.z = Math.PI / 3;
      cactus.add(armL);
      const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.45, 6), cactusMat);
      armR.position.set(0.25, 0.85, 0);
      armR.rotation.z = -Math.PI / 3;
      cactus.add(armR);
      decorGroup.add(cactus);

      // Mini Piramit Taşı (Piramit Zirvesi Obeliski)
      const pyrMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6, metalness: 0.3 });
      const miniPyr = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.7, 4), pyrMat);
      miniPyr.position.set(-2.0, 0.35, 1.5);
      miniPyr.rotation.y = Math.PI / 4;
      decorGroup.add(miniPyr);

    } else if (t === "village") {
      // 1. Ayı Köyü Başlangıç Mabedi: Çiçek tarhları ve köy çiti
      const cobbleMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8 });
      const plazaBase = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 4.0, 0.2, 20), cobbleMat);
      plazaBase.position.y = 0.1;
      decorGroup.add(plazaBase);

      const flowerMatR = new THREE.MeshStandardMaterial({ color: 0xef4444 });
      const flowerMatY = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
      const stemMat = new THREE.MeshStandardMaterial({ color: 0x16a34a });
      [-2.2, 2.2].forEach((fx) => {
        const planter = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.35, 0.6), cobbleMat);
        planter.position.set(fx, 0.18, 0.8);
        decorGroup.add(planter);
        for (let i = 0; i < 3; i++) {
          const fl = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), (i % 2 === 0) ? flowerMatR : flowerMatY);
          fl.position.set(fx - 0.35 + i * 0.35, 0.45, 0.8);
          decorGroup.add(fl);
        }
      });

    } else if (t === "forest") {
      // 2. Orman Tapınağı: Yosunlu taşlar, sarmaşıklar ve mantarlar
      const mossMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.9 });
      const mBase = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.9, 0.22, 16), mossMat);
      mBase.position.y = 0.11;
      decorGroup.add(mBase);

      const mushMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0x991b1b, emissiveIntensity: 0.3 });
      const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
      [-2.1, 2.1].forEach((mx, idx) => {
        const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.45, 8), whiteMat);
        stalk.position.set(mx, 0.22, 0.9 + idx * 0.3);
        decorGroup.add(stalk);
        const cap = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.28, 8), mushMat);
        cap.position.set(mx, 0.5, 0.9 + idx * 0.3);
        decorGroup.add(cap);
      });

    } else if (t === "beehive") {
      // 3. Bal Kovanı: Altın petek döşemeleri ve bal çömlekleri
      const hexMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4, emissive: 0xd97706, emissiveIntensity: 0.25 });
      const hBase = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 4.0, 0.22, 6), hexMat);
      hBase.position.y = 0.11;
      decorGroup.add(hBase);

      // Bal Çömleği
      const potMat = new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.6 });
      const pot = new THREE.Mesh(new THREE.SphereGeometry(0.35, 10, 10), potMat);
      pot.position.set(-2.0, 0.35, 0.9);
      decorGroup.add(pot);
      const drip = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), hexMat);
      drip.position.set(-2.0, 0.65, 0.9);
      decorGroup.add(drip);

    } else if (t === "pelican") {
      // 4. Pelikan Ovaları: Gök mavisi mermer ve bulut kümeleri
      const skyMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
      const pBase = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.9, 0.22, 16), skyMat);
      pBase.position.y = 0.11;
      decorGroup.add(pBase);

      const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, transparent: true, opacity: 0.9 });
      [-2.0, 2.0].forEach((cx) => {
        const cloud = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), cloudMat);
        cloud.position.set(cx, 0.3, 0.8);
        decorGroup.add(cloud);
      });

    } else if (t === "snow") {
      // 5. Kar Vadisi: Donmuş buzul döşemesi ve buz sarkıtları
      const iceMat = new THREE.MeshStandardMaterial({ color: 0x93c5fd, roughness: 0.1, transparent: true, opacity: 0.85 });
      const sBase = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.9, 0.22, 16), iceMat);
      sBase.position.y = 0.11;
      decorGroup.add(sBase);

      const crystalMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.5 });
      [-1.9, 1.9].forEach((ix) => {
        const icicle = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.8, 5), crystalMat);
        icicle.position.set(ix, 0.4, 0.8);
        decorGroup.add(icicle);
      });

    } else if (t === "space") {
      // 6. Kozmik Boyut: Gezegen halkası ve karanlık nebula kaidesi
      const voidMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.2, metalness: 0.8 });
      const spBase = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.9, 0.22, 20), voidMat);
      spBase.position.y = 0.11;
      decorGroup.add(spBase);

      const ringMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0x7c3aed, emissiveIntensity: 0.8 });
      const orbRing = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.08, 8, 24), ringMat);
      orbRing.position.set(-2.0, 0.7, 0.8);
      orbRing.rotation.x = Math.PI / 3;
      decorGroup.add(orbRing);

    } else if (t === "volcano") {
      // 7. Volkan Mağarası: Kıpkırmızı lav yarıkları ve lav kayaları
      const basaltMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.9 });
      const vBase = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.9, 0.22, 16), basaltMat);
      vBase.position.y = 0.11;
      decorGroup.add(vBase);

      const magmaMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xf97316, emissiveIntensity: 1.2 });
      [-1.8, 1.8].forEach((vx) => {
        const horn = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.85, 6), magmaMat);
        horn.position.set(vx, 0.42, 0.8);
        decorGroup.add(horn);
      });

    } else if (t === "underwater") {
      // 8. Su Altı Sarayı: Mercan resifleri ve deniz kabukları
      const seaMat = new THREE.MeshStandardMaterial({ color: 0x0891b2, roughness: 0.2 });
      const uBase = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.9, 0.22, 16), seaMat);
      uBase.position.y = 0.11;
      decorGroup.add(uBase);

      const coralMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xe11d48, emissiveIntensity: 0.5 });
      const coral = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.14, 8, 12), coralMat);
      coral.position.set(2.0, 0.45, 0.8);
      decorGroup.add(coral);

    } else if (t === "gold") {
      // 9. Altın Cenneti: 24K parlatılmış altın zemin ve dikilitaşlar
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.9, roughness: 0.1, emissive: 0xca8a04, emissiveIntensity: 0.3 });
      const gBase = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.9, 0.22, 20), goldMat);
      gBase.position.y = 0.11;
      decorGroup.add(gBase);

      [-2.0, 2.0].forEach((gx) => {
        const obelisk = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.9, 0.3), goldMat);
        obelisk.position.set(gx, 0.45, 0.8);
        decorGroup.add(obelisk);
      });

    } else if (t === "dino") {
      // 10. Dinozor Dünyası: Tarih öncesi toprak ve dinozor kemikleri
      const dirtMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
      const dBase = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.9, 0.22, 16), dirtMat);
      dBase.position.y = 0.11;
      decorGroup.add(dBase);

      const boneMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.4 });
      const bone = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.9, 8), boneMat);
      bone.position.set(-1.8, 0.25, 0.9);
      bone.rotation.z = Math.PI / 4;
      decorGroup.add(bone);

    } else if (t === "sugar") {
      // 11. Şeker Dünyası: Çilekli pembe şeker kreması ve lolipoplar
      const icingMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.3 });
      const sgBase = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.9, 0.22, 16), icingMat);
      sgBase.position.y = 0.11;
      decorGroup.add(sgBase);

      const caneMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0x991b1b, emissiveIntensity: 0.2 });
      [-1.9, 1.9].forEach((cx, idx) => {
        const lolly = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.15, 12), caneMat);
        lolly.position.set(cx, 0.65, 0.8 + idx * 0.2);
        lolly.rotation.x = Math.PI / 2;
        decorGroup.add(lolly);
      });

    } else if (t === "joker") {
      // 12. Jokerooms: Sarı damalı fayanslar ve şaka ördeği
      const tileMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.2 });
      const jBase = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.9, 0.22, 16), tileMat);
      jBase.position.y = 0.11;
      decorGroup.add(jBase);

      const duckMat = new THREE.MeshStandardMaterial({ color: 0xfde047 });
      const duck = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8), duckMat);
      duck.position.set(2.0, 0.35, 0.9);
      decorGroup.add(duck);

    } else if (t === "ruin") {
      // 13. Yıkılmış Köy: Yıkık antik taş sütun parçaları
      const ruinMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 });
      const rBase = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.9, 0.22, 16), ruinMat);
      rBase.position.y = 0.11;
      decorGroup.add(rBase);

      const colFrag = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 0.7, 8), ruinMat);
      colFrag.position.set(-1.9, 0.35, 0.8);
      colFrag.rotation.z = 0.2;
      decorGroup.add(colFrag);

    } else if (t === "water_cave") {
      // 14. Karanlık Su Mağarası: Islak kayrak taşı ve mavi mağara kristalleri
      const caveMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
      const cBase = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.9, 0.22, 16), caveMat);
      cBase.position.y = 0.11;
      decorGroup.add(cBase);

      const cryMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0ea5e9, emissiveIntensity: 0.8 });
      [-1.8, 1.8].forEach((cx) => {
        const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.35, 0), cryMat);
        gem.position.set(cx, 0.38, 0.8);
        decorGroup.add(gem);
      });
    }

    return decorGroup;
  }

  // Create an individual Complete Level Portal with Pedestal, Arch, Vortex, Sign & Decor
  function createIndividualVillagePortal(THREE, game, pData) {
    const portalMaster = new THREE.Group();
    portalMaster.name = "village_portal_sanctuary_" + pData.id;

    // Tam Zemin Yüksekliğini Hesapla (ASLA havada durmaz!)
    const groundY = getVillageGroundY(pData.pos.x, pData.pos.z);
    portalMaster.position.set(pData.pos.x, groundY, pData.pos.z);
    portalMaster.rotation.y = pData.yaw;

    // 1. Ana Taşıyıcı Kaide (Solid Pedestal directly touching the ground at Y = 0)
    const pedMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.75,
      metalness: 0.2
    });
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 3.3, 0.45, 18), pedMat);
    ped.position.y = 0.22;
    ped.receiveShadow = true;
    portalMaster.add(ped);

    // 2. İki Görkemli Portal Sütunu (Arch Pillars)
    const archMat = new THREE.MeshStandardMaterial({
      color: pData.archColor,
      roughness: 0.3,
      metalness: 0.6,
      emissive: pData.vortexColor,
      emissiveIntensity: 0.25
    });
    const pillarGeo = new THREE.BoxGeometry(0.7, 4.8, 0.7);

    const leftPillar = new THREE.Mesh(pillarGeo, archMat);
    leftPillar.position.set(-1.8, 2.4, 0);
    leftPillar.castShadow = true;
    portalMaster.add(leftPillar);

    const rightPillar = new THREE.Mesh(pillarGeo, archMat);
    rightPillar.position.set(1.8, 2.4, 0);
    rightPillar.castShadow = true;
    portalMaster.add(rightPillar);

    // Üst Kemer Kirişi (Top Arch Lintel)
    const topBeam = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.7, 0.7), archMat);
    topBeam.position.set(0, 4.8, 0);
    topBeam.castShadow = true;
    portalMaster.add(topBeam);

    // Üst Kemer Tacı (Crown Arch Capstone)
    const capMat = new THREE.MeshStandardMaterial({
      color: pData.vortexColor,
      emissive: pData.vortexColor,
      emissiveIntensity: 0.6,
      roughness: 0.2
    });
    const capstone = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.8, 4), capMat);
    capstone.position.set(0, 5.5, 0);
    capstone.rotation.y = Math.PI / 4;
    portalMaster.add(capstone);

    // 3. Dönen Büyülü Girdap (Swirling Magical Vortex)
    const vortexGeo = new THREE.CircleGeometry(1.8, 32);
    const vortexMat = new THREE.MeshStandardMaterial({
      color: pData.vortexColor,
      emissive: pData.vortexColor,
      emissiveIntensity: 1.4,
      transparent: true,
      opacity: 0.86,
      side: THREE.DoubleSide
    });
    const vortex = new THREE.Mesh(vortexGeo, vortexMat);
    vortex.position.set(0, 2.4, 0);
    portalMaster.add(vortex);

    // 4. Parlak Portal Işığı (Atmospheric Point Light)
    const pLight = new THREE.PointLight(pData.lightColor, 2.4, 15);
    pLight.position.set(0, 2.8, 0.5);
    portalMaster.add(pLight);

    // 5. Bölüme Özel Tematik Zemin Süslemeleri (Örn: Çöl kumu, kaktüs vb.)
    const themedDecor = buildThemedDecor(THREE, pData);
    portalMaster.add(themedDecor);

    // 6. Ahşap Tematik Bilgi Tabelası (Signboard right in front of the platform!)
    const signboard = buildThemedSignboard(THREE, pData);
    // Tabelayı portalın 2.8m önüne yerleştiriyoruz (Oyuncu yaklaşırken rahatça okuyabilsin)
    signboard.position.set(0, 0, 2.8);
    portalMaster.add(signboard);

    // 7. Etkileşim ve Işınlanma Mantığı
    portalMaster.userData = {
      pData: pData,
      vortexMesh: vortex,
      update: () => {
        vortex.rotation.z += 0.025;

        if (game && game.playerPos) {
          // Portal merkezine dünya koordinatlarında mesafe ölçümü
          const portalWorldPos = new THREE.Vector3();
          portalMaster.getWorldPosition(portalWorldPos);
          const dist = game.playerPos.distanceTo(portalWorldPos);

          if (dist < 2.4 && !portalMaster._cooldown) {
            portalMaster._cooldown = true;

            if (pData.targetRegion === 'hub') {
              if (game.callbacks && game.callbacks.onShowNotice) {
                game.callbacks.onShowNotice("🏡 Neşeli Ayı Köyü Meydanı'ndasın! Köyü keşfet ve dilediğin portala gir!", "info");
              }
              if (typeof window.St !== 'undefined' && window.St.playCoin) window.St.playCoin();
              setTimeout(() => { portalMaster._cooldown = false; }, 3000);
              return;
            }

            // Diğer 14 Bölüme Geçiş
            if (typeof window.St !== 'undefined' && window.St.playPowerup) window.St.playPowerup();
            if (game.callbacks && game.callbacks.onShowNotice) {
              game.callbacks.onShowNotice(`🌀 ${pData.title} Geçidine Girildi...`, "success");
            }
            if (game.spawnSparkleParticles) {
              game.spawnSparkleParticles(game.playerPos, 45, pData.vortexColor);
            }

            setTimeout(() => {
              if (game.loadRegion) {
                game.loadRegion(pData.targetRegion);
              } else if (game.callbacks && game.callbacks.onSelectRegion) {
                game.callbacks.onSelectRegion(pData.targetRegion);
              }
              setTimeout(() => { portalMaster._cooldown = false; }, 4000);
            }, 350);
          }
        }
      }
    };

    return portalMaster;
  }

  // Build and inject all 15 portals into Ayı Köyü
  function buildAllVillagePortals(game) {
    if (!game || !game.scene || !window.THREE) return;
    const THREE = window.THREE;

    // Strictly ensure this ONLY exists in 'hub'
    if (game.currentRegion && game.currentRegion !== 'hub') {
      removeAllVillagePortals(game);
      return;
    }

    if (villagePortalsGroup && villagePortalsGroup.parent) {
      game.scene.remove(villagePortalsGroup);
    }

    console.log("🌀 Building 15 Themed Level Portals across Ayı Köyü (ground-aligned)...");
    villagePortalsGroup = new THREE.Group();
    villagePortalsGroup.name = "all_village_15_portals_group";
    activePortalsList = [];

    VILLAGE_PORTALS_DATA.forEach((pData) => {
      const pMesh = createIndividualVillagePortal(THREE, game, pData);
      villagePortalsGroup.add(pMesh);
      activePortalsList.push(pMesh);
    });

    game.scene.add(villagePortalsGroup);
    isPortalsBuilt = true;

    // Clean up any old glitched floating portal meshes from legacy code
    cleanupOldGlitchedPortals(game);
  }

  // Remove portals when leaving hub
  function removeAllVillagePortals(game) {
    if (!game) game = window.__superBearGame;
    if (villagePortalsGroup && villagePortalsGroup.parent) {
      villagePortalsGroup.parent.remove(villagePortalsGroup);
    }
    villagePortalsGroup = null;
    activePortalsList = [];
    isPortalsBuilt = false;
  }
  window.__removeVillageLevelPortals = removeAllVillagePortals;

  // Clean up any legacy or rogue floating portal rings (e.g. at z = -45 or inside mountains)
  function cleanupOldGlitchedPortals(game) {
    if (!game || !game.scene) return;
    const toRemove = [];
    game.scene.traverse((obj) => {
      if (obj && obj.name && (
        obj.name.startsWith('cave_exit_portal_') ||
        obj.name === 'level_return_portal_to_hub' ||
        obj.name === 'victory_portal_hub'
      ) && game.currentRegion === 'hub') {
        toRemove.push(obj);
      }
    });
    toRemove.forEach((obj) => {
      if (obj.parent) obj.parent.remove(obj);
    });
  }

  // Animation & distance check loop
  function updateVillagePortals(game) {
    if (!game) return;
    if (game.currentRegion !== 'hub') {
      if (isPortalsBuilt) {
        removeAllVillagePortals(game);
      }
      return;
    }

    if (!isPortalsBuilt || !villagePortalsGroup || !villagePortalsGroup.parent) {
      buildAllVillagePortals(game);
      return;
    }

    for (let i = 0; i < activePortalsList.length; i++) {
      const p = activePortalsList[i];
      if (p && p.userData && typeof p.userData.update === 'function') {
        p.userData.update();
      }
    }
  }

  // Listen to region transitions
  window.addEventListener('superbear:region-changed', (e) => {
    const newReg = e.detail;
    const game = window.__superBearGame;
    if (newReg === 'hub') {
      setTimeout(() => {
        buildAllVillagePortals(game);
      }, 100);
    } else {
      removeAllVillagePortals(game);
    }
  });

  // Main ticker hook
  function initVillagePortalsEngine() {
    const game = window.__superBearGame;
    if (game && game.scene && window.THREE) {
      if (game.currentRegion === 'hub' || !game.currentRegion) {
        buildAllVillagePortals(game);
      }

      // Hook game update loop safely
      const origUpdate = game.update;
      if (origUpdate && !game._villagePortalsHooked) {
        game._villagePortalsHooked = true;
        game.update = function(dt, totalTime) {
          origUpdate.call(this, dt, totalTime);
          try {
            updateVillagePortals(this);
          } catch (err) {}
        };
      }
    } else {
      setTimeout(initVillagePortalsEngine, 300);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVillagePortalsEngine);
  } else {
    initVillagePortalsEngine();
  }
})();
