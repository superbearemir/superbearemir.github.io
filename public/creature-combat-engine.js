// ============================================================================
// ⚔️ EVRENSEL 3D CANLI MODEL, HAREKET VE MERMİ SAVAŞ MOTORU (CREATURE COMBAT ENGINE)
// - Tüm bölümlerdeki canlıların birbirinden tamamen farklı, çok parçalı 3D modellere
//   sahip olmasını sağlar (Kanatlı, Boynuzlu, Kıskaçlı, Zırhlı, Asalı, Çok Bacaklı vb.)
// - Her canlının kendi platformunda aktif olarak hareket etmesini (devriye, takip,
//   zıplama, süzülme, kanat/bacak animasyonu) garanti eder.
// - Her canlının oyuncuya doğru tematik 3D mermiler (buz mızrağı, lav topu, güneş
//   ışını, zehir küresi, şeker bombası, gölge kafatası, yıldırım, plazma) ateşlemesini sağlar.
// ============================================================================
(function() {
  'use strict';

  const activeEngineProjectiles = [];
  let sharedProjGeos = null;

  function ensureSharedGeometries(THREE) {
    if (sharedProjGeos) return sharedProjGeos;
    sharedProjGeos = {
      orb: new THREE.SphereGeometry(0.48, 10, 10),
      aura: new THREE.SphereGeometry(0.72, 8, 8),
      spear: new THREE.ConeGeometry(0.28, 1.4, 6),
      ring: new THREE.TorusGeometry(0.55, 0.1, 6, 14),
      crystal: new THREE.OctahedronGeometry(0.55, 0),
      tail: new THREE.ConeGeometry(0.22, 0.9, 6)
    };
    return sharedProjGeos;
  }

  // Bölgeye göre mermi teması
  const REGION_PROJECTILE_THEMES = {
    forest_temple:     { color: 0x22c55e, glow: 0x84cc16, shape: 'spear',   speed: 17, dmg: 10 },
    beehive:           { color: 0xfacc15, glow: 0xf59e0b, shape: 'spear',   speed: 18, dmg: 11 },
    pelican_plains:    { color: 0x38bdf8, glow: 0x0284c7, shape: 'orb',     speed: 17, dmg: 11 },
    snow_desert:       { color: 0x93c5fd, glow: 0x38bdf8, shape: 'spear',   speed: 19, dmg: 12, freeze: false },
    volcano_cave:      { color: 0xef4444, glow: 0xf97316, shape: 'orb',     speed: 20, dmg: 14 },
    underwater_palace: { color: 0x06b6d4, glow: 0x38bdf8, shape: 'ring',    speed: 18, dmg: 13 },
    golden_sanctuary:  { color: 0xfacc15, glow: 0xfef08a, shape: 'crystal', speed: 20, dmg: 14 },
    dinosaur_world:    { color: 0x84cc16, glow: 0xef4444, shape: 'orb',     speed: 19, dmg: 14 },
    sugar_world:       { color: 0xec4899, glow: 0xf472b6, shape: 'orb',     speed: 18, dmg: 12 },
    jokerooms:         { color: 0xa855f7, glow: 0xef4444, shape: 'crystal', speed: 19, dmg: 13 },
    ruin_village:      { color: 0xdc2626, glow: 0x9333ea, shape: 'crystal', speed: 19, dmg: 14 },
    water_cave:        { color: 0x0ea5e9, glow: 0x10b981, shape: 'ring',    speed: 19, dmg: 14 },
    bee_desert:        { color: 0xf59e0b, glow: 0xd97706, shape: 'spear',   speed: 20, dmg: 15 },
    earth_summit:      { color: 0xef4444, glow: 0xa855f7, shape: 'crystal', speed: 22, dmg: 16 }
  };

  // =========================================================================
  // 18 FARKLI ÇOK PARÇALI 3D CANLI ARKETİPİ OLUŞTURUCU
  // =========================================================================
  window.__buildDistinctCreatureMesh = function(THREE, variantIndex, opts = {}) {
    const idx = Math.abs(Math.floor(variantIndex || 0)) % 18;
    const primaryHex = opts.primaryColor || [
      0xef4444, 0x3b82f6, 0x10b981, 0xf59e0b, 0x8b5cf6, 0x06b6d4,
      0xec4899, 0x84cc16, 0xea580c, 0x14b8a6, 0xeab308, 0x6366f1,
      0xd946ef, 0x22c55e, 0xf43f5e, 0x0ea5e9, 0xa855f7, 0xf97316
    ][idx];
    const accentHex = opts.accentColor || [
      0xfacc15, 0x38bdf8, 0xa3e635, 0xfef08a, 0xe879f9, 0x67e8f9,
      0xfde047, 0x4ade80, 0xfdba74, 0x5eead4, 0xffffff, 0x93c5fd,
      0xf0abfc, 0x86efac, 0xfda4af, 0x7dd3fc, 0xc4b5fd, 0xfed7aa
    ][idx];
    const scale = opts.scale || 1.0;

    const root = new THREE.Group();
    root.scale.set(scale, scale, scale);

    const bodyMat = new THREE.MeshStandardMaterial({
      color: primaryHex,
      roughness: 0.35,
      metalness: 0.25,
      emissive: primaryHex,
      emissiveIntensity: 0.22
    });
    const accentMat = new THREE.MeshStandardMaterial({
      color: accentHex,
      roughness: 0.2,
      metalness: 0.6,
      emissive: accentHex,
      emissiveIntensity: 0.45
    });
    const darkArmorMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.4,
      metalness: 0.75
    });
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0xdc2626 });

    const animParts = {
      wings: [],
      legs: [],
      arms: [],
      tail: null,
      head: null,
      spinners: []
    };

    // Yardımcı göz ekleyici
    function addEyes(parent, y, z, spread = 0.28, radius = 0.14) {
      [-spread, spread].forEach(ex => {
        const e = new THREE.Mesh(new THREE.SphereGeometry(radius, 8, 8), eyeMat);
        e.position.set(ex, y, z);
        const p = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.55, 6, 6), pupilMat);
        p.position.set(ex, y, z + radius * 0.7);
        parent.add(e, p);
      });
    }

    switch (idx) {
      case 0: {
        // 0: Zırhlı Boynuzlu Dev Golem (Torso + Omuzluklar + Boynuzlu Miğfer + 2 Dev Çekiç Kol + 2 Bacak)
        const torso = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.6, 1.1), bodyMat);
        torso.position.y = 1.6;
        root.add(torso);
        const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), accentMat);
        core.position.set(0, 1.6, 0.58);
        root.add(core);
        animParts.spinners.push(core);

        const head = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.85, 0.9), darkArmorMat);
        head.position.y = 2.85;
        addEyes(head, 0.05, 0.46, 0.24, 0.13);
        [-0.42, 0.42].forEach(hx => {
          const horn = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.75, 6), accentMat);
          horn.position.set(hx, 0.6, 0);
          horn.rotation.z = hx > 0 ? -0.35 : 0.35;
          head.add(horn);
        });
        root.add(head);
        animParts.head = head;

        [-1.05, 1.05].forEach(ax => {
          const armGrp = new THREE.Group();
          armGrp.position.set(ax, 2.1, 0);
          const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.42, 8, 8), accentMat);
          const forearm = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.2, 0.45), bodyMat);
          forearm.position.y = -0.65;
          const fist = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.65, 0.65), darkArmorMat);
          fist.position.set(0, -1.25, 0.15);
          armGrp.add(shoulder, forearm, fist);
          root.add(armGrp);
          animParts.arms.push(armGrp);
        });
        [-0.45, 0.45].forEach(lx => {
          const leg = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.9, 0.6), darkArmorMat);
          leg.position.set(lx, 0.45, 0);
          root.add(leg);
          animParts.legs.push(leg);
        });
        break;
      }

      case 1: {
        // 1: Çift Kanatlı Gökyüzü Ejderi / Wyvern (Uzun Gövde + Boyun + Ejder Başı + 2 Geniş Kanat + Dikenli Kuyruk)
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.42, 2.2, 8), bodyMat);
        body.rotation.x = Math.PI / 2;
        body.position.y = 1.6;
        root.add(body);

        const head = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.2, 6), bodyMat);
        head.rotation.x = Math.PI / 2;
        head.position.set(0, 1.95, 1.35);
        addEyes(head, 0.2, 0.1, 0.22, 0.12);
        root.add(head);
        animParts.head = head;

        [-1, 1].forEach(side => {
          const wingGrp = new THREE.Group();
          wingGrp.position.set(side * 0.5, 1.85, 0.1);
          const wingInner = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.08, 1.1), accentMat);
          wingInner.position.x = side * 0.85;
          const wingTip = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.2, 4), bodyMat);
          wingTip.rotation.z = side * -Math.PI / 2;
          wingTip.position.set(side * 1.9, 0, -0.1);
          wingGrp.add(wingInner, wingTip);
          root.add(wingGrp);
          animParts.wings.push(wingGrp);
        });

        const tail = new THREE.Mesh(new THREE.ConeGeometry(0.32, 1.8, 6), accentMat);
        tail.rotation.x = -Math.PI / 2;
        tail.position.set(0, 1.5, -1.7);
        root.add(tail);
        animParts.tail = tail;
        break;
      }

      case 2: {
        // 2: Dev Kıskaçlı İmparator Akrep (Zırhlı Sırt + 6 Eklem Bacak + 2 Kıskaç Kol + Kıvrık Zehir İğneli Kuyruk)
        const carapace = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.65, 2.1), bodyMat);
        carapace.position.y = 0.7;
        root.add(carapace);
        addEyes(carapace, 0.22, 1.05, 0.32, 0.13);

        for (let i = 0; i < 3; i++) {
          [-1, 1].forEach(side => {
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.06, 1.1, 6), darkArmorMat);
            leg.position.set(side * 0.85, 0.45, -0.6 + i * 0.6);
            leg.rotation.z = side * 0.55;
            root.add(leg);
            animParts.legs.push(leg);
          });
        }
        [-0.75, 0.75].forEach(cx => {
          const pincerGrp = new THREE.Group();
          pincerGrp.position.set(cx, 0.8, 1.1);
          const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.0, 6), accentMat);
          arm.rotation.x = Math.PI / 2;
          arm.position.z = 0.4;
          const claw = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.09, 6, 10, Math.PI * 1.3), darkArmorMat);
          claw.rotation.x = Math.PI / 2;
          claw.position.z = 0.95;
          pincerGrp.add(arm, claw);
          root.add(pincerGrp);
          animParts.arms.push(pincerGrp);
        });
        const tailGrp = new THREE.Group();
        tailGrp.position.set(0, 0.9, -0.95);
        const seg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 1.3, 6), bodyMat);
        seg1.position.set(0, 0.6, -0.3);
        seg1.rotation.x = -0.5;
        const stinger = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.75, 6), accentMat);
        stinger.position.set(0, 1.35, -0.1);
        stinger.rotation.x = Math.PI / 3;
        tailGrp.add(seg1, stinger);
        root.add(tailGrp);
        animParts.tail = tailGrp;
        break;
      }

      case 3: {
        // 3: Kadim Büyücü Şaman & Dönen Kristal Asa (Cübbe + Maskeli Kafa + Tüy Tacı + Parlayan Küreli Asa)
        const robe = new THREE.Mesh(new THREE.ConeGeometry(0.95, 2.3, 10), bodyMat);
        robe.position.y = 1.15;
        root.add(robe);

        const mask = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.48, 0.95, 8), darkArmorMat);
        mask.position.y = 2.55;
        addEyes(mask, 0.05, 0.48, 0.2, 0.13);
        for (let c = -1; c <= 1; c++) {
          const feather = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.85, 5), accentMat);
          feather.position.set(c * 0.28, 0.75, 0);
          feather.rotation.z = -c * 0.25;
          mask.add(feather);
        }
        root.add(mask);
        animParts.head = mask;

        const staffGrp = new THREE.Group();
        staffGrp.position.set(0.95, 1.5, 0.4);
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.8, 6), darkArmorMat);
        const orb = new THREE.Mesh(new THREE.OctahedronGeometry(0.38, 0), accentMat);
        orb.position.y = 1.55;
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.06, 6, 14), accentMat);
        ring.position.y = 1.55;
        staffGrp.add(pole, orb, ring);
        root.add(staffGrp);
        animParts.arms.push(staffGrp);
        animParts.spinners.push(ring);
        break;
      }

      case 4: {
        // 4: Dört Ayaklı Yırtıcı Kurt / Panter / Raptor (Kaslı Gövde + Sivri Çene + 4 Koşan Bacak + Sırt Yüzgeci + Kuyruk)
        const torso = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.85, 2.1), bodyMat);
        torso.position.y = 1.05;
        root.add(torso);

        const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.45, 1.7), accentMat);
        ridge.position.set(0, 1.6, -0.1);
        root.add(ridge);

        const head = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.7, 0.95), bodyMat);
        head.position.set(0, 1.55, 1.25);
        addEyes(head, 0.12, 0.48, 0.22, 0.11);
        [-0.25, 0.25].forEach(ex => {
          const ear = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.45, 4), accentMat);
          ear.position.set(ex, 0.55, -0.1);
          head.add(ear);
        });
        root.add(head);
        animParts.head = head;

        [[-0.42, 0.7], [0.42, 0.7], [-0.42, -0.7], [0.42, -0.7]].forEach(([lx, lz]) => {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.95, 6), darkArmorMat);
          leg.position.set(lx, 0.48, lz);
          root.add(leg);
          animParts.legs.push(leg);
        });

        const tail = new THREE.Mesh(new THREE.ConeGeometry(0.22, 1.3, 6), accentMat);
        tail.rotation.x = -Math.PI / 2.6;
        tail.position.set(0, 1.2, -1.45);
        root.add(tail);
        animParts.tail = tail;
        break;
      }

      case 5: {
        // 5: Çok Halkalı Kıvrılan Ejder-Yılan / Leviathan / Wurm (6 Boğumlu Gövde + Boynuzlu Kafa + Çatal Dil)
        for (let s = 0; s < 5; s++) {
          const r = 0.68 - s * 0.08;
          const seg = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 10), s % 2 === 0 ? bodyMat : accentMat);
          seg.position.set(0, 0.75 + (s === 0 ? 0.5 : 0), 0.9 - s * 0.75);
          if (s === 0) {
            addEyes(seg, 0.2, r * 0.85, 0.26, 0.13);
            [-0.35, 0.35].forEach(hx => {
              const fin = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.7, 5), accentMat);
              fin.position.set(hx, 0.55, -0.1);
              fin.rotation.z = hx > 0 ? -0.4 : 0.4;
              seg.add(fin);
            });
            animParts.head = seg;
          } else {
            animParts.legs.push(seg);
          }
          root.add(seg);
        }
        break;
      }

      case 6: {
        // 6: Dikenli Zırhlı Kaplumbağa / Ankilozor Tankı (Kubbe Kabuk + Kristal Sırt Dikenleri + Kafa + 4 Fil Ayağı + Topuz Kuyruk)
        const dome = new THREE.Mesh(new THREE.SphereGeometry(1.35, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2), bodyMat);
        dome.position.y = 0.65;
        root.add(dome);

        for (let i = 0; i < 6; i++) {
          const ang = (i / 6) * Math.PI * 2;
          const spike = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.75, 5), accentMat);
          spike.position.set(Math.cos(ang) * 0.75, 1.65, Math.sin(ang) * 0.75);
          spike.rotation.z = -Math.cos(ang) * 0.35;
          spike.rotation.x = Math.sin(ang) * 0.35;
          root.add(spike);
        }

        const head = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.6, 0.85), darkArmorMat);
        head.position.set(0, 0.95, 1.55);
        addEyes(head, 0.1, 0.44, 0.22, 0.11);
        root.add(head);
        animParts.head = head;

        [[-0.85, 0.85], [0.85, 0.85], [-0.85, -0.85], [0.85, -0.85]].forEach(([lx, lz]) => {
          const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.7, 8), darkArmorMat);
          foot.position.set(lx, 0.35, lz);
          root.add(foot);
          animParts.legs.push(foot);
        });

        const clubTail = new THREE.Mesh(new THREE.DodecahedronGeometry(0.42, 0), accentMat);
        clubTail.position.set(0, 0.85, -1.65);
        root.add(clubTail);
        animParts.tail = clubTail;
        break;
      }

      case 7: {
        // 7: 8 Bacaklı Kristal Dul Örümcek / Tarantula (Karın Küresi + Göğüs + 8 Eklem Bacak + Zehir Dişleri)
        const thorax = new THREE.Mesh(new THREE.SphereGeometry(0.65, 10, 10), darkArmorMat);
        thorax.position.set(0, 0.85, 0.45);
        addEyes(thorax, 0.18, 0.58, 0.22, 0.12);
        root.add(thorax);
        animParts.head = thorax;

        const abdomen = new THREE.Mesh(new THREE.SphereGeometry(0.95, 12, 12), bodyMat);
        abdomen.scale.set(1.0, 0.85, 1.25);
        abdomen.position.set(0, 1.05, -0.75);
        const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.45, 0), accentMat);
        gem.position.set(0, 0.85, 0);
        abdomen.add(gem);
        root.add(abdomen);
        animParts.spinners.push(gem);

        for (let l = 0; l < 4; l++) {
          [-1, 1].forEach(side => {
            const legGrp = new THREE.Group();
            legGrp.position.set(side * 0.55, 0.85, 0.6 - l * 0.42);
            const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 1.15, 6), accentMat);
            upper.rotation.z = side * 0.85;
            upper.position.set(side * 0.45, -0.15, 0);
            legGrp.add(upper);
            root.add(legGrp);
            animParts.legs.push(legGrp);
          });
        }
        break;
      }

      case 8: {
        // 8: Semavi Prizma Serafim / Dönen Halka Meleği (Merkez Kristal + 2 Dönen Altın Halka + 4 Işık Kanadı)
        const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.85, 0), bodyMat);
        core.position.y = 2.0;
        addEyes(core, 0.1, 0.65, 0.25, 0.13);
        root.add(core);
        animParts.head = core;

        const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.1, 8, 24), accentMat);
        ring1.position.y = 2.0;
        const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.65, 0.08, 8, 24), darkArmorMat);
        ring2.position.y = 2.0;
        ring2.rotation.x = Math.PI / 2;
        root.add(ring1, ring2);
        animParts.spinners.push(ring1, ring2);

        [-1, 1].forEach(side => {
          const w = new THREE.Mesh(new THREE.ConeGeometry(0.55, 1.9, 4), accentMat);
          w.position.set(side * 1.4, 2.2, -0.2);
          w.rotation.z = side * -Math.PI / 3;
          root.add(w);
          animParts.wings.push(w);
        });
        break;
      }

      case 9: {
        // 9: Kraliyet Kalkanlı & Mızraklı Şövalye Muhafız (Zırh Gövde + Sorguçlu Miğfer + Kalkan + Uzun Mızrak + 2 Bacak)
        const armor = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.55, 1.6, 8), bodyMat);
        armor.position.y = 1.5;
        root.add(armor);

        const helm = new THREE.Mesh(new THREE.SphereGeometry(0.55, 10, 10), darkArmorMat);
        helm.position.y = 2.65;
        addEyes(helm, 0.0, 0.48, 0.2, 0.11);
        const plume = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.65, 0.9), accentMat);
        plume.position.set(0, 0.6, -0.1);
        helm.add(plume);
        root.add(helm);
        animParts.head = helm;

        // Kalkan (Sol)
        const shield = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.45, 0.95), accentMat);
        shield.position.set(-0.85, 1.55, 0.35);
        root.add(shield);
        animParts.arms.push(shield);

        // Mızrak (Sağ)
        const lanceGrp = new THREE.Group();
        lanceGrp.position.set(0.85, 1.6, 0.2);
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.6, 6), darkArmorMat);
        shaft.rotation.x = Math.PI / 2.2;
        const tip = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.75, 6), accentMat);
        tip.rotation.x = Math.PI / 2.2;
        tip.position.set(0, 0.15, 1.35);
        lanceGrp.add(shaft, tip);
        root.add(lanceGrp);
        animParts.arms.push(lanceGrp);

        [-0.35, 0.35].forEach(lx => {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.18, 0.85, 6), darkArmorMat);
          leg.position.set(lx, 0.42, 0);
          root.add(leg);
          animParts.legs.push(leg);
        });
        break;
      }

      case 10: {
        // 10: Dokunaçlı Ahtapot / Mürekkep Balığı / Kraken Yavrusu (Konik Manto Baş + 8 Kıvrımlı Dokunaç + Parlayan Gözler)
        const mantle = new THREE.Mesh(new THREE.ConeGeometry(0.95, 2.2, 10), bodyMat);
        mantle.position.y = 2.1;
        addEyes(mantle, -0.45, 0.75, 0.35, 0.16);
        root.add(mantle);
        animParts.head = mantle;

        for (let t = 0; t < 8; t++) {
          const ang = (t / 8) * Math.PI * 2;
          const tent = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.04, 1.35, 6), accentMat);
          tent.position.set(Math.cos(ang) * 0.65, 0.65, Math.sin(ang) * 0.65);
          tent.rotation.z = -Math.cos(ang) * 0.4;
          tent.rotation.x = Math.sin(ang) * 0.4;
          root.add(tent);
          animParts.legs.push(tent);
        }
        break;
      }

      case 11: {
        // 11: Çift Topuzlu Minotor / Boğa Savaşçısı (Geniş Göğüs + Boğa Kafası & Kıvrık Boynuzlar + Çift Balta)
        const chest = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.5, 1.1), bodyMat);
        chest.position.y = 1.65;
        root.add(chest);

        const bullHead = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.85, 1.1), darkArmorMat);
        bullHead.position.set(0, 2.65, 0.25);
        addEyes(bullHead, 0.12, 0.56, 0.25, 0.12);
        const noseRing = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.05, 6, 12), accentMat);
        noseRing.position.set(0, -0.2, 0.6);
        bullHead.add(noseRing);
        [-0.55, 0.55].forEach(hx => {
          const horn = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.95, 6), accentMat);
          horn.position.set(hx, 0.35, 0.1);
          horn.rotation.z = hx > 0 ? -Math.PI / 3 : Math.PI / 3;
          bullHead.add(horn);
        });
        root.add(bullHead);
        animParts.head = bullHead;

        [-1.05, 1.05].forEach(ax => {
          const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.2, 1.3, 6), bodyMat);
          arm.position.set(ax, 1.6, 0.3);
          arm.rotation.x = Math.PI / 4;
          root.add(arm);
          animParts.arms.push(arm);
        });
        [-0.45, 0.45].forEach(lx => {
          const hoof = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.3, 0.95, 6), darkArmorMat);
          hoof.position.set(lx, 0.48, 0);
          root.add(hoof);
          animParts.legs.push(hoof);
        });
        break;
      }

      case 12: {
        // 12: Uçan Zırhlı Eşek Arısı / Kovan Dronu (Çizgili Karın + İğne + 4 Saydam Kanat + Antenli Baş)
        const abdomen = new THREE.Mesh(new THREE.SphereGeometry(0.75, 12, 10), bodyMat);
        abdomen.scale.set(0.9, 0.9, 1.45);
        abdomen.position.set(0, 1.65, -0.35);
        root.add(abdomen);

        for (let st = -1; st <= 1; st++) {
          const band = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.09, 6, 14), darkArmorMat);
          band.position.set(0, 1.65, -0.35 + st * 0.32);
          root.add(band);
        }

        const stinger = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.8, 6), accentMat);
        stinger.rotation.x = -Math.PI / 2;
        stinger.position.set(0, 1.65, -1.55);
        root.add(stinger);

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 10, 10), darkArmorMat);
        head.position.set(0, 1.75, 0.75);
        addEyes(head, 0.08, 0.42, 0.22, 0.13);
        root.add(head);
        animParts.head = head;

        [-1, 1].forEach(side => {
          const wing = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.05, 0.65), accentMat);
          wing.position.set(side * 0.95, 2.15, -0.1);
          root.add(wing);
          animParts.wings.push(wing);
        });
        break;
      }

      case 13: {
        // 13: Elektrikli Vatoz / Manta Ray / Hayalet Süzülücü (Geniş Elmas Kanat Gövde + Parlayan Sırt Çekirdeği + Kamçı Kuyruk)
        const disc = new THREE.Mesh(new THREE.ConeGeometry(1.65, 0.45, 4), bodyMat);
        disc.rotation.y = Math.PI / 4;
        disc.position.y = 1.6;
        addEyes(disc, 0.25, 0.75, 0.38, 0.13);
        root.add(disc);

        [-1, 1].forEach(side => {
          const fin = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.12, 1.1), accentMat);
          fin.position.set(side * 1.35, 1.6, 0);
          root.add(fin);
          animParts.wings.push(fin);
        });

        const whip = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.02, 2.2, 6), accentMat);
        whip.rotation.x = Math.PI / 2;
        whip.position.set(0, 1.55, -1.75);
        root.add(whip);
        animParts.tail = whip;
        break;
      }

      case 14: {
        // 14: Derin Uçurum Fener Balığı / Koca Çeneli Canavar (Küre Gövde + Sivri Dişli Alt Çene + Işıklı Fener Anteni + Yüzgeçler)
        const body = new THREE.Mesh(new THREE.SphereGeometry(1.05, 12, 12), bodyMat);
        body.scale.set(1.0, 1.1, 1.3);
        body.position.y = 1.55;
        addEyes(body, 0.35, 0.9, 0.38, 0.15);
        root.add(body);
        animParts.head = body;

        const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2, 6), darkArmorMat);
        stalk.position.set(0, 2.55, 0.85);
        stalk.rotation.x = Math.PI / 4;
        const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.32, 8, 8), accentMat);
        lantern.position.set(0, 2.95, 1.35);
        root.add(stalk, lantern);
        animParts.spinners.push(lantern);

        [-1.05, 1.05].forEach(fx => {
          const fin = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.45, 0.12), accentMat);
          fin.position.set(fx, 1.5, 0.1);
          root.add(fin);
          animParts.wings.push(fin);
        });
        break;
      }

      case 15: {
        // 15: Üç Boynuzlu Seratops / Zırhlı Gergedan (Kalkanlı Baş + 3 Uzun Boynuz + Ağır Gövde + 4 Bacak)
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.35, 1.15, 2.2), bodyMat);
        body.position.y = 1.15;
        root.add(body);

        const frill = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 0.2, 8), accentMat);
        frill.rotation.x = Math.PI / 2.3;
        frill.position.set(0, 1.85, 0.95);
        root.add(frill);

        const snout = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.75, 1.0), bodyMat);
        snout.position.set(0, 1.35, 1.45);
        addEyes(snout, 0.2, 0.45, 0.28, 0.12);
        [-0.32, 0.32].forEach(hx => {
          const h = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.95, 6), darkArmorMat);
          h.rotation.x = Math.PI / 3;
          h.position.set(hx, 0.55, 0.35);
          snout.add(h);
        });
        const noseHorn = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.55, 6), accentMat);
        noseHorn.rotation.x = Math.PI / 2.5;
        noseHorn.position.set(0, 0.35, 0.55);
        snout.add(noseHorn);
        root.add(snout);
        animParts.head = snout;

        [[-0.52, 0.75], [0.52, 0.75], [-0.52, -0.75], [0.52, -0.75]].forEach(([lx, lz]) => {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.9, 6), darkArmorMat);
          leg.position.set(lx, 0.45, lz);
          root.add(leg);
          animParts.legs.push(leg);
        });
        break;
      }

      case 16: {
        // 16: Mekanik Kukla Soytarı / Çift Bıçaklı Otomaton (Silindir Gövde + Soytarı Şapkası + 2 Dönen Testere/Bıçak Kol)
        const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.45, 1.65, 8), bodyMat);
        torso.position.y = 1.45;
        root.add(torso);

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.52, 10, 10), accentMat);
        head.position.y = 2.6;
        addEyes(head, 0.05, 0.46, 0.2, 0.12);
        [-0.4, 0.4].forEach(cx => {
          const jesterHorn = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.85, 6), bodyMat);
          jesterHorn.position.set(cx, 0.65, 0);
          jesterHorn.rotation.z = cx > 0 ? -0.45 : 0.45;
          head.add(jesterHorn);
        });
        root.add(head);
        animParts.head = head;

        [-0.95, 0.95].forEach(ax => {
          const blade = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.09, 6, 8), darkArmorMat);
          blade.position.set(ax, 1.55, 0.45);
          blade.rotation.y = Math.PI / 2;
          root.add(blade);
          animParts.spinners.push(blade);
          animParts.arms.push(blade);
        });
        break;
      }

      default: {
        // 17: Anubis Çakal Savaşçısı / Firavun Muhafızı (Atletik Zırh + Uzun Çakal Kulakları + Çift Hilal Kılıç)
        const torso = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.65, 0.85), bodyMat);
        torso.position.y = 1.55;
        root.add(torso);

        const collar = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.12, 6, 14), accentMat);
        collar.rotation.x = Math.PI / 2;
        collar.position.y = 2.35;
        root.add(collar);

        const jackalHead = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.7, 0.95), darkArmorMat);
        jackalHead.position.set(0, 2.75, 0.15);
        addEyes(jackalHead, 0.1, 0.48, 0.2, 0.11);
        [-0.24, 0.24].forEach(ex => {
          const ear = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.85, 4), accentMat);
          ear.position.set(ex, 0.7, -0.1);
          jackalHead.add(ear);
        });
        root.add(jackalHead);
        animParts.head = jackalHead;

        [-0.85, 0.85].forEach(ax => {
          const khopesh = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.08, 6, 12, Math.PI), accentMat);
          khopesh.position.set(ax, 1.65, 0.55);
          khopesh.rotation.y = Math.PI / 2;
          root.add(khopesh);
          animParts.arms.push(khopesh);
        });
        [-0.35, 0.35].forEach(lx => {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.16, 0.9, 6), darkArmorMat);
          leg.position.set(lx, 0.45, 0);
          root.add(leg);
          animParts.legs.push(leg);
        });
        break;
      }
    }

    root.userData._animParts = animParts;
    root.userData._upgradedMultiPart = true;
    return root;
  };

  // =========================================================================
  // MERMİ ATEŞLEME SİSTEMİ (HER CANLI OYUNCUYA DOĞRU 3D MERMİ ATAR)
  // =========================================================================
  window.__spawnEnemyProjectile = function(game, fromPos, targetPos, customTheme) {
    if (!window.THREE || !game || !game.scene || !fromPos || !targetPos) return;
    if (activeEngineProjectiles.length > 45) return; // FPS koruması

    const THREE = window.THREE;
    const geos = ensureSharedGeometries(THREE);
    const region = game.currentRegion || 'forest_temple';
    const theme = Object.assign({}, REGION_PROJECTILE_THEMES[region] || REGION_PROJECTILE_THEMES.forest_temple, customTheme || {});

    const projGrp = new THREE.Group();
    projGrp.position.set(fromPos.x, fromPos.y + 1.35, fromPos.z);

    const coreMat = new THREE.MeshStandardMaterial({
      color: theme.color,
      emissive: theme.glow || theme.color,
      emissiveIntensity: 1.6,
      roughness: 0.15
    });
    const auraMat = new THREE.MeshBasicMaterial({
      color: theme.glow || theme.color,
      transparent: true,
      opacity: 0.45,
      wireframe: true
    });

    const coreGeo = geos[theme.shape] || geos.orb;
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    if (theme.shape === 'spear') {
      coreMesh.rotation.x = Math.PI / 2;
    }
    projGrp.add(coreMesh);

    const auraMesh = new THREE.Mesh(geos.aura, auraMat);
    projGrp.add(auraMesh);

    const aimTarget = new THREE.Vector3(targetPos.x, targetPos.y + 0.9, targetPos.z);
    const dir = new THREE.Vector3().subVectors(aimTarget, projGrp.position);
    if (dir.lengthSq() < 0.001) dir.set(0, 0, 1);
    dir.normalize();

    projGrp.lookAt(aimTarget);
    (game.currentLevel && game.currentLevel.mesh ? game.currentLevel.mesh : game.scene).add(projGrp);

    activeEngineProjectiles.push({
      mesh: projGrp,
      aura: auraMesh,
      dir: dir,
      speed: theme.speed || 18.0,
      damage: theme.dmg || 12,
      freeze: !!theme.freeze,
      life: 3.4,
      region: region
    });
  };

  // =========================================================================
  // CANLI HAREKET, ANİMASYON VE ATEŞ ETME GÜNCELLEYİCİSİ
  // =========================================================================
  window.__updateCreatureCombatAI = function(enemy, dt, playerPos, game, indexSeed = 0) {
    if (!enemy || !enemy.mesh || enemy.hp <= 0) return;
    const THREE = window.THREE;
    if (!THREE) return;

    // Başlangıç koordinatlarını kaydet
    if (enemy._initBase === undefined) {
      enemy._initBase = true;
      const startVec = enemy.pos || enemy.mesh.position;
      enemy.baseX = enemy.baseX !== undefined ? enemy.baseX : ( enemy.startX !== undefined ? enemy.startX : startVec.x );
      enemy.baseY = enemy.baseY !== undefined ? enemy.baseY : startVec.y;
      enemy.baseZ = enemy.baseZ !== undefined ? enemy.baseZ : ( enemy.startZ !== undefined ? enemy.startZ : startVec.z );
      if (!enemy.pos) enemy.pos = enemy.mesh.position.clone();
      enemy._aiClock = (indexSeed * 1.73) % 10;
      enemy._shootTimer = 1.2 + (indexSeed % 5) * 0.45;
      enemy._moveMode = enemy._moveMode || (indexSeed % 5); // 0: X-devriye, 1: Z-devriye, 2: Sekiz çizme, 3: Zıplayarak devriye, 4: Uçarak süzülme
      enemy._patrolSpeed = enemy._patrolSpeed || (2.0 + (indexSeed % 4) * 0.45);
      enemy._patrolRange = enemy._patrolRange || (4.2 + (indexSeed % 3) * 1.1);
    }

    enemy._aiClock += dt * enemy._patrolSpeed;
    const t = enemy._aiClock;

    const prevX = enemy.mesh.position.x;
    const prevZ = enemy.mesh.position.z;

    const distToPlayer = playerPos ? enemy.mesh.position.distanceTo(playerPos) : 999;

    // 1. AKTİF HAREKET (Platform sınırları içinde devriye + oyuncu yaklaşınca manevra)
    let targetX = enemy.baseX;
    let targetY = enemy.baseY;
    let targetZ = enemy.baseZ;

    const rng = enemy._patrolRange;
    if (enemy._moveMode === 0) {
      targetX = enemy.baseX + Math.sin(t) * rng;
      targetZ = enemy.baseZ + Math.cos(t * 0.5) * (rng * 0.35);
      targetY = enemy.baseY + Math.abs(Math.sin(t * 2.2)) * 0.35;
    } else if (enemy._moveMode === 1) {
      targetZ = enemy.baseZ + Math.sin(t) * rng;
      targetX = enemy.baseX + Math.cos(t * 0.6) * (rng * 0.4);
      targetY = enemy.baseY + Math.abs(Math.cos(t * 2.0)) * 0.35;
    } else if (enemy._moveMode === 2) {
      targetX = enemy.baseX + Math.sin(t) * rng;
      targetZ = enemy.baseZ + Math.sin(t * 2.0) * (rng * 0.55);
      targetY = enemy.baseY + Math.sin(t * 2.5) * 0.45;
    } else if (enemy._moveMode === 3) {
      targetX = enemy.baseX + Math.cos(t * 0.85) * rng;
      targetZ = enemy.baseZ + Math.sin(t * 0.85) * (rng * 0.5);
      targetY = enemy.baseY + Math.abs(Math.sin(t * 3.2)) * 1.45;
    } else {
      targetX = enemy.baseX + Math.sin(t * 0.9) * (rng * 1.1);
      targetZ = enemy.baseZ + Math.cos(t * 0.7) * (rng * 0.6);
      targetY = enemy.baseY + 0.8 + Math.sin(t * 2.4) * 1.15;
    }

    // Oyuncu menzildeyse oyuncuya doğru hafifçe hamle yap (ama platformdan düşmemek için base noktasından en fazla rng+2.2 uzaklaş)
    if (playerPos && distToPlayer < 24 && distToPlayer > 2.2) {
      const pullX = Math.max(-2.2, Math.min(2.2, (playerPos.x - enemy.baseX) * 0.25));
      const pullZ = Math.max(-2.2, Math.min(2.2, (playerPos.z - enemy.baseZ) * 0.25));
      targetX += pullX;
      targetZ += pullZ;
    }

    enemy.mesh.position.set(targetX, targetY, targetZ);
    if (enemy.pos && enemy.pos !== enemy.mesh.position) {
      enemy.pos.copy(enemy.mesh.position);
    }

    // 2. YÖN DÖNDÜRME (Oyuncu yakınsa oyuncuya bak, değilse gidiş yönüne bak)
    if (playerPos && distToPlayer < 32) {
      const lookYaw = Math.atan2(playerPos.x - enemy.mesh.position.x, playerPos.z - enemy.mesh.position.z);
      enemy.mesh.rotation.y = lookYaw;
    } else {
      const dx = enemy.mesh.position.x - prevX;
      const dz = enemy.mesh.position.z - prevZ;
      if (dx * dx + dz * dz > 0.0001) {
        enemy.mesh.rotation.y = Math.atan2(dx, dz);
      }
    }

    // 3. UZUV / KANAT / KUYRUK ANİMASYONU
    const parts = enemy.mesh.userData && enemy.mesh.userData._animParts;
    if (parts) {
      if (parts.wings && parts.wings.length > 0) {
        parts.wings.forEach((w, wi) => {
          w.rotation.z = (wi % 2 === 0 ? 1 : -1) * Math.sin(t * 4.8) * 0.52;
        });
      }
      if (parts.legs && parts.legs.length > 0) {
        parts.legs.forEach((l, li) => {
          l.rotation.x = Math.sin(t * 3.8 + li * 1.1) * 0.45;
        });
      }
      if (parts.arms && parts.arms.length > 0) {
        parts.arms.forEach((a, ai) => {
          a.rotation.x = Math.sin(t * 3.0 + ai * Math.PI) * 0.38;
        });
      }
      if (parts.tail) {
        parts.tail.rotation.y = Math.sin(t * 3.5) * 0.4;
      }
      if (parts.spinners && parts.spinners.length > 0) {
        parts.spinners.forEach(s => {
          s.rotation.y += dt * 3.2;
          s.rotation.z += dt * 1.8;
        });
      }
    }

    // 4. MERMİ ATEŞLEME (Oyuncu 30 birim mesafedeyse düzenli ateş et)
    if (playerPos && distToPlayer < 30.0 && distToPlayer > 2.2) {
      enemy._shootTimer -= dt;
      if (enemy._shootTimer <= 0) {
        enemy._shootTimer = 2.2 + (indexSeed % 4) * 0.45;
        window.__spawnEnemyProjectile(game, enemy.mesh.position, playerPos, enemy._projTheme);
      }
    }
  };

  // =========================================================================
  // OTOMATİK CANLI ÇEŞİTLENDİRME VE SAVAŞ ENTEGRASYON TARAYICISI
  // - Bölümlerdeki tek küp/küre olan veya sabit duran canlıları otomatik olarak
  //   benzersiz çok parçalı 3D modellere dönüştürür, hareket ve ateş etme ekler.
  // =========================================================================
  const ARCHETYPE_TITLES = [
    "Zırhlı Boynuzlu Golem 🗿",
    "Gökyüzü Wyvern Ejderi 🐉",
    "İmparator Kıskaç Akrebi 🦂",
    "Kadim Kristal Şamanı 🧙‍♂️",
    "Kızıl Pençe Yırtıcısı 🐺",
    "Boğumlu Leviathan Yılanı 🐍",
    "Dikenli Ankilozor Tankı 🐢",
    "Sekiz Bacaklı Kristal Tarantula 🕷️",
    "Semavi Prizma Serafimi ✨",
    "Kraliyet Mızraklı Şövalyesi 🛡️",
    "Derin Uçurum Kraken Gözcüsü 🦑",
    "Çift Baltalı Minotor Savaşçısı 🐂",
    "Zırhlı Kovan Dronu 🐝",
    "Elektrikli Fırtına Vatozu ⚡",
    "Fenerli Uçurum Canavarı 🐟",
    "Üç Boynuzlu Seratops 🦏",
    "Testere Kollu Kukla Otomaton 🎭",
    "Anubis Hilal Muhafızı ⚔️"
  ];

  function upgradeAndDiversifyLevelEnemies(game) {
    if (!game || !game.currentLevel || !window.THREE) return;
    const THREE = window.THREE;
    const enemies = game.currentLevel.enemies;
    if (!Array.isArray(enemies)) return;

    enemies.forEach((en, idx) => {
      if (!en) return;
      const enType = String(en.type || '').toLowerCase();
      const enId = String(en.id || '').toLowerCase();
      const enName = String(en.name || '').toLowerCase();
      if (
        en.isBoss ||
        enType.includes('boss') ||
        enType.includes('kraken') ||
        enId.includes('boss') ||
        enName.includes('boss') ||
        enName.includes('patron') ||
        enName.includes('kral') ||
        enName.includes('lord') ||
        (en.maxHp && en.maxHp >= 200)
      ) {
        return;
      }
      if (en._combatEngineHooked) return;
      en._combatEngineHooked = true;

      // Eğer canlının modeli sadece 1-3 basit parçadan oluşuyorsa veya aynı şablonsa, benzersiz çok parçalı 3D model ile zenginleştir!
      if (en.mesh && !en.mesh.userData._upgradedMultiPart && en.type !== 'dino_minion') {
        const childCount = en.mesh.children ? en.mesh.children.length : 0;
        if (childCount <= 4 || en.type === 'volcano_creature' || en.type === 'celestial_creature' || en.type === 'prehistoric_creature') {
          let primaryColor = null;
          if (en.mesh.children && en.mesh.children[0] && en.mesh.children[0].material && en.mesh.children[0].material.color) {
            primaryColor = en.mesh.children[0].material.color.getHex();
          }
          // Mevcut alt parçaları temizle ve benzersiz 18 arketipten birini yerleştir
          while (en.mesh.children.length > 0) {
            en.mesh.remove(en.mesh.children[0]);
          }
          const multiModel = window.__buildDistinctCreatureMesh(THREE, idx, {
            primaryColor: primaryColor,
            scale: 1.05
          });
          en.mesh.add(multiModel);
          en.mesh.userData._animParts = multiModel.userData._animParts;
          en.mesh.userData._upgradedMultiPart = true;

          // İsim tekrarı varsa benzersiz alt unvan ekle
          const archTitle = ARCHETYPE_TITLES[idx % ARCHETYPE_TITLES.length];
          if (!en.name || en.name.indexOf('#') === -1) {
            en.name = `${en.name || archTitle} (${archTitle.split(' ')[0]})`;
          }
        }
      }

      // Orijinal update fonksiyonunu koruyarak üzerine hareket, animasyon ve mermi ateşleme ekle
      const origUpdate = en.update;
      en.update = function(dt, p, g) {
        if (this.hp <= 0) return;
        if (typeof origUpdate === 'function') {
          try { origUpdate.call(this, dt, p, g); } catch (e) {}
        }
        window.__updateCreatureCombatAI(this, dt, p, g, idx);
        // Yakın temas hasarı kontrolü
        if (p && this.mesh && this.mesh.position.distanceTo(p) < 2.3) {
          if (g && typeof g.damagePlayer === 'function') {
            g.damagePlayer(this.attackPower || 12);
          }
        }
      };
    });
  }

  // =========================================================================
  // EVRENSEL BÖLÜM YOLU & BOŞLUK KÖPRÜLEME SİSTEMİ (TÜM BÖLÜMLER İÇİN)
  // - Platformlar arası ulaşılamayan uzak mesafeleri (gapZ > 7.5 veya dy > 3.0)
  //   otomatik tespit eder ve bölge temasına uygun 3D aşama platformları yerleştirir.
  // - Eksik Vector3 min/max collider'larını onarır ve checkpoint altlarını destekler.
  // =========================================================================
  const REGION_PLATFORM_THEMES = {
    snow_desert:       { top: 0xdbeafe, trim: 0x38bdf8, glow: 0x00ffff },
    volcano_cave:      { top: 0x451a03, trim: 0x9a3412, glow: 0xff4500 },
    underwater_palace: { top: 0x0e7490, trim: 0x06b6d4, glow: 0x22d3ee },
    forest_temple:     { top: 0x3f6212, trim: 0x65a30d, glow: 0x84cc16 },
    beehive:           { top: 0xf59e0b, trim: 0xd97706, glow: 0xfde047 },
    pelican_plains:    { top: 0xd97706, trim: 0xb45309, glow: 0xfbbf24 },
    golden_sanctuary:  { top: 0xfbbf24, trim: 0xd97706, glow: 0xfef08a },
    dinosaur_world:    { top: 0x57534e, trim: 0x78716c, glow: 0x84cc16 },
    sugar_world:       { top: 0xf472b6, trim: 0xec4899, glow: 0xfbcfe8 },
    ruin_village:      { top: 0x78716c, trim: 0x57534e, glow: 0x34d399 },
    water_cave:        { top: 0x0284c7, trim: 0x0369a1, glow: 0x38bdf8 },
    bee_desert:        { top: 0xeab308, trim: 0xca8a04, glow: 0xfef08a },
    earth_summit:      { top: 0x4f46e5, trim: 0x4338ca, glow: 0x818cf8 }
  };

  window.__ensureContinuousLevelPath = function(game, forceNow = false) {
    if (!game || !game.currentLevel || !window.THREE) return;
    const lvl = game.currentLevel;

    const region = game.currentRegion || '';
    if (!region || region === 'village' || region === 'hub') return;

    const colliders = lvl.colliders;
    if (!Array.isArray(colliders) || colliders.length === 0) return;

    // İlk 2 kare boyunca genişletme (expansion) scriptlerinin sahneyi kurmasını bekle
    if (!forceNow) {
      lvl._pathVerifyTicks = (lvl._pathVerifyTicks || 0) + 1;
      if (lvl._pathVerifyTicks < 3) return;
      if (lvl._lastVerifiedColliderCount === colliders.length) return;
    }

    const THREE = window.THREE;
    const targetParent = lvl.mesh || game.scene;

    // Eğer daha önce otomatik köprü eklendiyse ve sahneye yeni aşamalar yüklendiyse eski köprüleri temizle
    if (lvl._autoBridgeGroup && lvl._autoBridgeGroup.parent) {
      lvl._autoBridgeGroup.parent.remove(lvl._autoBridgeGroup);
    }
    lvl._autoBridgeGroup = new THREE.Group();
    lvl._autoBridgeGroup.name = "auto_continuous_path_bridges";
    if (targetParent) targetParent.add(lvl._autoBridgeGroup);

    for (let i = colliders.length - 1; i >= 0; i--) {
      if (colliders[i] && colliders[i]._isAutoBridge) {
        colliders.splice(i, 1);
      }
    }

    const theme = REGION_PLATFORM_THEMES[region] || { top: 0x64748b, trim: 0x475569, glow: 0x38bdf8 };

    const platMat = new THREE.MeshStandardMaterial({
      color: theme.top,
      roughness: 0.35,
      metalness: 0.2
    });
    const trimMat = new THREE.MeshStandardMaterial({
      color: theme.trim,
      emissive: theme.glow,
      emissiveIntensity: 0.45,
      roughness: 0.25
    });

    function spawnBridgePlatform(x, topY, z, w, h, d) {
      const cy = topY - h / 2;
      const grp = new THREE.Group();
      grp.position.set(x, cy, z);

      const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), platMat);
      baseMesh.castShadow = true;
      baseMesh.receiveShadow = true;
      grp.add(baseMesh);

      const trimMesh = new THREE.Mesh(new THREE.BoxGeometry(w + 0.24, Math.min(0.32, h * 0.25), d + 0.24), trimMat);
      trimMesh.position.y = h * 0.32;
      grp.add(trimMesh);

      lvl._autoBridgeGroup.add(grp);

      const minX = x - w / 2, maxX = x + w / 2;
      const minY = topY - h,  maxY = topY;
      const minZ = z - d / 2, maxZ = z + d / 2;
      colliders.push({
        min: new THREE.Vector3(minX, minY, minZ),
        max: new THREE.Vector3(maxX, maxY, maxZ),
        minX, maxX, minY, maxY, minZ, maxZ,
        _isAutoBridge: true
      });
    }

    // 1. Tüm collider'larda THREE.Vector3 min/max bulunduğundan emin ol
    for (let i = 0; i < colliders.length; i++) {
      const c = colliders[i];
      if (!c) continue;
      if ((!c.min || !c.max) && c.minX !== undefined && c.maxX !== undefined) {
        c.min = new THREE.Vector3(c.minX, c.minY, c.minZ);
        c.max = new THREE.Vector3(c.maxX, c.maxY, c.maxZ);
      }
    }

    // 2. Tüm kayıt noktalarının (checkpoint) altında sağlam bir platform olduğundan emin ol
    if (Array.isArray(lvl.checkpoints)) {
      lvl.checkpoints.forEach(cp => {
        if (!cp || !cp.pos) return;
        const px = cp.pos.x, py = cp.pos.y, pz = cp.pos.z;
        let hasFloor = false;
        for (let i = 0; i < colliders.length; i++) {
          const c = colliders[i];
          if (!c || c.isToxic) continue;
          const minX = c.min ? c.min.x : c.minX;
          const maxX = c.max ? c.max.x : c.maxX;
          const maxY = c.max ? c.max.y : c.maxY;
          const minZ = c.min ? c.min.z : c.minZ;
          const maxZ = c.max ? c.max.z : c.maxZ;
          if (px >= minX - 1.5 && px <= maxX + 1.5 && pz >= minZ - 1.5 && pz <= maxZ + 1.5 && Math.abs(py - maxY) <= 4.5) {
            hasFloor = true;
            break;
          }
        }
        if (!hasFloor) {
          spawnBridgePlatform(px, py, pz, 12, 2.0, 12);
        }
      });
    }

    // 3. Yürünebilir platformları Z sırasına göre diz (başlangıçtan Boss arenasına doğru)
    const walkable = [];
    for (let i = 0; i < colliders.length; i++) {
      const c = colliders[i];
      if (!c || c.isToxic) continue;
      const minX = c.min ? c.min.x : c.minX;
      const maxX = c.max ? c.max.x : c.maxX;
      const minY = c.min ? c.min.y : c.minY;
      const maxY = c.max ? c.max.y : c.maxY;
      const minZ = c.min ? c.min.z : c.minZ;
      const maxZ = c.max ? c.max.z : c.maxZ;
      if (minX === undefined || maxZ === undefined) continue;

      const w = maxX - minX;
      const h = maxY - minY;
      const d = maxZ - minZ;
      const cx = (minX + maxX) * 0.5;
      // Sadece yürünebilir platformları al (yüksek duvarları ve çok uzaktaki dekorları hariç tut)
      if (h < 8.5 && w >= 1.2 && d >= 1.2 && Math.abs(cx) <= 28) {
        walkable.push({
          cx,
          topY: maxY,
          cz: (minZ + maxZ) * 0.5,
          minX, maxX, minY, maxY, minZ, maxZ, w, h, d
        });
      }
    }

    if (walkable.length < 2) {
      lvl._lastVerifiedColliderCount = colliders.length;
      return;
    }
    walkable.sort((a, b) => b.maxZ - a.maxZ);

    let frontier = Object.assign({}, walkable[0]);
    let bridgedCount = 0;

    for (let i = 1; i < walkable.length; i++) {
      const curr = walkable[i];
      const gapZ = frontier.minZ - curr.maxZ;
      const dx = Math.abs(curr.cx - frontier.cx);
      const dy = curr.topY - frontier.topY;

      // Eğer iki aşama arasında zıplanamayacak kadar Z boşluğu, yatay mesafe veya dikey uçurum varsa köprüle!
      const needsBridgeZ = gapZ > 7.5;
      const needsBridgeDiag = gapZ > 3.5 && Math.hypot(gapZ, dx) > 9.5;
      const needsBridgeClimb = gapZ >= -1.0 && dy > 3.2;

      if (needsBridgeZ || needsBridgeDiag || needsBridgeClimb) {
        const effectiveGapZ = Math.max(0.1, gapZ);
        const stepsByZ = Math.ceil(effectiveGapZ / 7.0);
        const stepsByDiag = Math.ceil(Math.hypot(effectiveGapZ, dx) / 7.5);
        const stepsByY = dy > 0 ? Math.ceil(dy / 2.2) : Math.ceil(Math.abs(dy) / 4.5);
        const totalSteps = Math.max(2, stepsByZ, stepsByDiag, stepsByY);
        const numNewPlats = totalSteps - 1;

        for (let s = 1; s <= numNewPlats; s++) {
          const frac = s / totalSteps;
          const bx = frontier.cx + (curr.cx - frontier.cx) * frac;
          const by = frontier.topY + (curr.topY - frontier.topY) * frac;
          const bz = frontier.minZ - effectiveGapZ * frac;
          spawnBridgePlatform(bx, by, bz, 9.5, 1.8, 8.2);
          bridgedCount++;
        }
      }

      // Frontier güncellemesi
      if (curr.minZ < frontier.minZ) {
        if (Math.abs(curr.minZ - frontier.minZ) < 3.0) {
          frontier.cx = (frontier.cx + curr.cx) * 0.5;
          frontier.topY = Math.max(frontier.topY, curr.topY);
          frontier.minZ = curr.minZ;
        } else {
          frontier = Object.assign({}, curr);
        }
      } else if (Math.abs(curr.minZ - frontier.minZ) < 3.0) {
        frontier.cx = (frontier.cx + curr.cx) * 0.5;
      }
    }

    lvl._lastVerifiedColliderCount = colliders.length;
    if (bridgedCount > 0) {
      console.log(`🌉 [Path Engine] ${region} bölümünde ${bridgedCount} ara geçiş platformu eklendi.`);
    }
  };

  // Ana oyun döngüsüne bağlan ve mermileri + canlıları + kesintisiz yolları güncelle
  function updateEngineTick(dt) {
    const game = window.__superBearGame;
    if (!game || !game.scene) return;

    // Bölüm değiştiğinde mermileri temizle
    if (game._lastProjRegion !== game.currentRegion) {
      game._lastProjRegion = game.currentRegion;
      for (let i = activeEngineProjectiles.length - 1; i >= 0; i--) {
        const pr = activeEngineProjectiles[i];
        if (pr.mesh && pr.mesh.parent) pr.mesh.parent.remove(pr.mesh);
      }
      activeEngineProjectiles.length = 0;
    }

    window.__ensureContinuousLevelPath(game);
    upgradeAndDiversifyLevelEnemies(game);

    const pPos = game.playerPos;
    for (let i = activeEngineProjectiles.length - 1; i >= 0; i--) {
      const proj = activeEngineProjectiles[i];
      proj.life -= dt;
      proj.mesh.position.addScaledVector(proj.dir, proj.speed * dt);
      if (proj.aura) {
        proj.aura.rotation.x += dt * 5.0;
        proj.aura.rotation.y += dt * 5.0;
      }

      if (pPos && proj.mesh.position.distanceTo(pPos) < 1.85) {
        if (typeof game.damagePlayer === 'function') {
          game.damagePlayer(proj.damage || 12);
        } else if (typeof game.takeDamage === 'function') {
          game.takeDamage(1);
        }
        if (proj.freeze && typeof window.__freezePlayer === 'function') {
          window.__freezePlayer(1.2);
        }
        proj.life = 0;
      }

      if (proj.life <= 0) {
        if (proj.mesh && proj.mesh.parent) proj.mesh.parent.remove(proj.mesh);
        activeEngineProjectiles.splice(i, 1);
      }
    }
  }

  const hookInterval = setInterval(() => {
    if (window.__superBearGame) {
      if (!window.__superBearGame._creatureCombatEngineHooked) {
        window.__superBearGame._creatureCombatEngineHooked = true;
        const origUpdate = window.__superBearGame.update;
        window.__superBearGame.update = function(dt, totalTime) {
          origUpdate.call(this, dt, totalTime);
          try {
            updateEngineTick(dt);
          } catch (err) {}
        };
      }
      clearInterval(hookInterval);
    }
  }, 80);

  console.log("⚔️ [Creature Combat & Path Engine] 18 Çok Parçalı 3D Canlı Arketipi, Devriye AI, Mermi ve Kesintisiz Platform Köprüleme Sistemi Yüklendi!");
})();
