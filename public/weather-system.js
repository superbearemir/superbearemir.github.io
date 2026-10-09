/**
 * Super Bear Dynamic Atmospheric Weather Engine v1.0
 * Adds rich, immersive, dynamic weather (Rain, Snow, Dense Fog, Thunderstorms, Mystic Particles, Volcanic Embers, Bubbles, Desert Dust)
 * across all 15 Classic Earth Worlds and Space Realms.
 */

(function() {
  'use strict';

  // Weather Definition Profiles
  const WEATHER_PROFILES = {
    clear: {
      id: 'clear',
      nameTr: 'Güneşli & Berrak',
      nameEn: 'Clear & Sunny',
      icon: '☀️',
      fogMultiplier: 0.7,
      ambientMultiplier: 1.15,
      sunMultiplier: 1.2,
      particleType: 'none'
    },
    rain: {
      id: 'rain',
      nameTr: 'Yağmur & Çiseleme',
      nameEn: 'Rain & Drizzle',
      icon: '🌧️',
      fogMultiplier: 1.4,
      ambientMultiplier: 0.75,
      sunMultiplier: 0.7,
      fogColorShift: 0x5a6d7c,
      particleType: 'rain'
    },
    snow: {
      id: 'snow',
      nameTr: 'Lapa Lapa Kar',
      nameEn: 'Snow & Flurries',
      icon: '❄️',
      fogMultiplier: 1.3,
      ambientMultiplier: 0.95,
      sunMultiplier: 0.85,
      fogColorShift: 0xc9dbe9,
      particleType: 'snow'
    },
    fog: {
      id: 'fog',
      nameTr: 'Yoğun Atmosferik Sis',
      nameEn: 'Dense Misty Fog',
      icon: '🌫️',
      fogMultiplier: 2.4,
      ambientMultiplier: 0.85,
      sunMultiplier: 0.65,
      particleType: 'fog'
    },
    storm: {
      id: 'storm',
      nameTr: 'Fırtına & Şimşek',
      nameEn: 'Thunderstorm & Lightning',
      icon: '⚡',
      fogMultiplier: 1.8,
      ambientMultiplier: 0.6,
      sunMultiplier: 0.5,
      fogColorShift: 0x334155,
      particleType: 'storm'
    },
    mystic: {
      id: 'mystic',
      nameTr: 'Büyülü Atmosfer',
      nameEn: 'Mystic Particles',
      icon: '✨',
      fogMultiplier: 1.0,
      ambientMultiplier: 1.05,
      sunMultiplier: 1.05,
      particleType: 'mystic'
    }
  };

  // Region-specific default weather configurations & available weather playlist
  const REGION_WEATHER_CONFIG = {
    hub: {
      defaultWeather: 'clear',
      allowedWeathers: ['clear', 'rain', 'fog', 'mystic'],
      mysticType: 'pollen',
      mysticColor: 0xfef08a,
      name: 'Ayı & Kedi Köyü'
    },
    forest_temple: {
      defaultWeather: 'rain',
      allowedWeathers: ['rain', 'fog', 'storm', 'mystic'],
      mysticType: 'spores',
      mysticColor: 0x86efac,
      name: 'Antik Orman Tapınağı'
    },
    beehive: {
      defaultWeather: 'mystic',
      allowedWeathers: ['mystic', 'fog', 'clear'],
      mysticType: 'honey',
      mysticColor: 0xfbbf24,
      name: 'Vızıldayan Bal Kovanı'
    },
    pelican_plains: {
      defaultWeather: 'clear',
      allowedWeathers: ['clear', 'fog', 'rain', 'storm'],
      mysticType: 'wind',
      mysticColor: 0xbae6fd,
      name: 'Pelikan Ovaları'
    },
    snow_desert: {
      defaultWeather: 'snow',
      allowedWeathers: ['snow', 'storm', 'fog', 'clear'],
      mysticType: 'frost',
      mysticColor: 0xe0f2fe,
      name: 'Kar Vadisi & Donmuş Çöl'
    },
    volcano_cave: {
      defaultWeather: 'mystic',
      allowedWeathers: ['mystic', 'fog', 'storm'],
      mysticType: 'embers',
      mysticColor: 0xf97316,
      name: 'Volkanik Ejderha Mağarası'
    },
    underwater_palace: {
      defaultWeather: 'mystic',
      allowedWeathers: ['mystic', 'fog', 'clear'],
      mysticType: 'bubbles',
      mysticColor: 0x38bdf8,
      name: 'Antik Su Altı Kristal Sarayı'
    },
    golden_sanctuary: {
      defaultWeather: 'mystic',
      allowedWeathers: ['mystic', 'clear', 'fog'],
      mysticType: 'gold_dust',
      mysticColor: 0xfacc15,
      name: 'Efsanevi Altın Cenneti'
    },
    dinosaur_world: {
      defaultWeather: 'rain',
      allowedWeathers: ['rain', 'storm', 'fog', 'mystic'],
      mysticType: 'amber',
      mysticColor: 0xd97706,
      name: 'Dinozor Dünyası'
    },
    sugar_world: {
      defaultWeather: 'mystic',
      allowedWeathers: ['mystic', 'clear', 'snow', 'fog'],
      mysticType: 'candy',
      mysticColor: 0xf472b6,
      name: 'Şeker Dünyası'
    },
    jokerooms: {
      defaultWeather: 'fog',
      allowedWeathers: ['fog', 'mystic', 'clear'],
      mysticType: 'confetti',
      mysticColor: 0xfacc15,
      name: 'Jokerooms Palyaço Boyutu'
    },
    ruin_village: {
      defaultWeather: 'rain',
      allowedWeathers: ['rain', 'storm', 'fog', 'clear'],
      mysticType: 'ash',
      mysticColor: 0x94a3b8,
      name: 'Yıkılmış Köy'
    },
    water_cave: {
      defaultWeather: 'rain',
      allowedWeathers: ['rain', 'mystic', 'fog'],
      mysticType: 'droplets',
      mysticColor: 0x67e8f9,
      name: 'Karanlık Su Mağarası'
    },
    bee_desert: {
      defaultWeather: 'mystic',
      allowedWeathers: ['mystic', 'clear', 'storm', 'fog'],
      mysticType: 'sand',
      mysticColor: 0xfcd34d,
      name: 'Arı Çölü & Vaha'
    },
    space_realm: {
      defaultWeather: 'mystic',
      allowedWeathers: ['mystic', 'storm', 'clear'],
      mysticType: 'stardust',
      mysticColor: 0xc084fc,
      name: 'Kozmik Uzay Boyutu'
    }
  };

  class DynamicWeatherSystem {
    constructor() {
      this.currentWeather = 'clear';
      this.currentRegion = 'hub';
      this.isAutoCycleEnabled = true;
      this.cycleIntervalSeconds = 900; // Auto weather shift every 15 minutes (900s)
      this.lastCycleTime = Date.now();
      
      this.weatherGroup = null;
      this.rainMesh = null;
      this.snowMesh = null;
      this.mysticMesh = null;
      this.fogCloudsGroup = null;
      
      this.rainPositions = null;
      this.snowPositions = null;
      this.mysticPositions = null;
      this.snowVelocities = null;
      this.mysticVelocities = null;
      
      this.lightningActive = false;
      this.lightningTimer = 0;
      this.nextLightningTime = Date.now() + 5000;
      
      this.baseAmbientColor = 0xffffff;
      this.baseSunColor = 0xffffff;
      this.baseFogColor = 0x88bbff;
      this.baseFogDensity = 0.02;

      // ======================================================================
      // 15-DAKİKA GÜNDÜZ / 15-DAKİKA GECE DÖNGÜSÜ (15-MIN DAY / NIGHT CELESTIAL ENGINE)
      // Gündüz: Parlayan Güneş, Mavi Gökyüzü ve Büyülü Gökkuşağı!
      // Akşam / Gece: Hilal/Dolunay Ay, Parıldayan 1500 Yıldız ve Kayan Meteorlar!
      // ======================================================================
      this.dayCycleDuration = 900; // 15 dakika Gündüz (900 saniye)
      this.nightCycleDuration = 900; // 15 dakika Akşam / Gece (900 saniye)
      this.totalDayNightCycle = 1800; // 30 dakika toplam periyot
      this.dayNightTime = 0; // Geçen toplam döngü süresi (saniye)
      this.isNight = false;
      this.dayNightCycleEnabled = true;

      this.celestialGroup = null;
      this.sunGroup = null;
      this.moonGroup = null;
      this.starsMesh = null;
      this.starsMat = null;
      this.rainbowGroup = null;
      this.rainbowMaterials = [];
      this.rainbowOpacity = 0.0;
      this.rainbowActive = false;
      this.lastRainbowNoticeTime = 0;
      this.lastDayNightNoticePhase = '';

      // Kayan Meteorlar (Shooting Stars)
      this.meteorsGroup = null;
      this.activeMeteors = [];
      this.nextMeteorTime = Date.now() + 4000;

      this.initialized = false;
    }

    init() {
      if (this.initialized) return;
      this.initialized = true;

      // Listen for region changes
      window.addEventListener('superbear:region-changed', (e) => {
        const region = e.detail?.region || (window.__superBearGame && window.__superBearGame.currentRegion);
        if (region) this.onRegionChange(region);
      });

      // Periodic check in case game initialized late
      const checkTimer = setInterval(() => {
        const game = window.__superBearGame;
        if (game && game.scene && window.THREE) {
          clearInterval(checkTimer);
          this.buildParticleMeshes(game);
          if (game.currentRegion) {
            this.onRegionChange(game.currentRegion);
          }
        }
      }, 500);

      // Start global weather loop
      this.lastFrameTime = performance.now();
      this._boundRenderLoop = this.renderLoop.bind(this);
      requestAnimationFrame(this._boundRenderLoop);
    }

    buildParticleMeshes(game) {
      if (!window.THREE || !game || !game.scene) return;
      const THREE = window.THREE;

      if (this.weatherGroup) {
        try { game.scene.remove(this.weatherGroup); } catch(e) {}
      }

      this.weatherGroup = new THREE.Group();
      this.weatherGroup.name = 'superbear_dynamic_weather_system';
      game.scene.add(this.weatherGroup);

      // 1. RAIN SYSTEM (1500 line streaks)
      const rainCount = 1400;
      const rainGeo = new THREE.BufferGeometry();
      const rainPos = new Float32Array(rainCount * 3);
      for (let i = 0; i < rainCount; i++) {
        rainPos[i * 3 + 0] = (Math.random() - 0.5) * 80;
        rainPos[i * 3 + 1] = Math.random() * 45 - 2;
        rainPos[i * 3 + 2] = (Math.random() - 0.5) * 80;
      }
      rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
      this.rainPositions = rainPos;

      const rainMat = new THREE.PointsMaterial({
        color: 0x93c5fd,
        size: 0.35,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      this.rainMesh = new THREE.Points(rainGeo, rainMat);
      this.rainMesh.visible = false;
      this.weatherGroup.add(this.rainMesh);

      // 2. SNOW SYSTEM (1200 soft snowflakes)
      const snowCount = 1200;
      const snowGeo = new THREE.BufferGeometry();
      const snowPos = new Float32Array(snowCount * 3);
      this.snowVelocities = new Float32Array(snowCount * 3);
      for (let i = 0; i < snowCount; i++) {
        snowPos[i * 3 + 0] = (Math.random() - 0.5) * 80;
        snowPos[i * 3 + 1] = Math.random() * 45 - 2;
        snowPos[i * 3 + 2] = (Math.random() - 0.5) * 80;
        this.snowVelocities[i * 3 + 0] = (Math.random() - 0.5) * 1.5;
        this.snowVelocities[i * 3 + 1] = -(1.5 + Math.random() * 2.5);
        this.snowVelocities[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
      }
      snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPos, 3));
      this.snowPositions = snowPos;

      const snowMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.55,
        transparent: true,
        opacity: 0.85,
        depthWrite: false
      });
      this.snowMesh = new THREE.Points(snowGeo, snowMat);
      this.snowMesh.visible = false;
      this.weatherGroup.add(this.snowMesh);

      // 3. MYSTIC PARTICLES (Embers, Bubbles, Spores, Pollen, Golden Dust, Stardust)
      const mysticCount = 900;
      const mysticGeo = new THREE.BufferGeometry();
      const mysticPos = new Float32Array(mysticCount * 3);
      this.mysticVelocities = new Float32Array(mysticCount * 3);
      for (let i = 0; i < mysticCount; i++) {
        mysticPos[i * 3 + 0] = (Math.random() - 0.5) * 70;
        mysticPos[i * 3 + 1] = Math.random() * 35;
        mysticPos[i * 3 + 2] = (Math.random() - 0.5) * 70;
        this.mysticVelocities[i * 3 + 0] = (Math.random() - 0.5) * 0.8;
        this.mysticVelocities[i * 3 + 1] = (Math.random() - 0.3) * 1.2;
        this.mysticVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
      }
      mysticGeo.setAttribute('position', new THREE.BufferAttribute(mysticPos, 3));
      this.mysticPositions = mysticPos;

      const mysticMat = new THREE.PointsMaterial({
        color: 0xfef08a,
        size: 0.65,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      this.mysticMesh = new THREE.Points(mysticGeo, mysticMat);
      this.mysticMesh.visible = false;
      this.weatherGroup.add(this.mysticMesh);

      // 4. VOLUMETRIC FOG CLOUDS (Soft drifting atmosphere clouds)
      this.fogCloudsGroup = new THREE.Group();
      this.fogCloudsGroup.name = 'superbear_fog_clouds';
      const cloudMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.12,
        depthWrite: false
      });
      const cloudGeo = new THREE.SphereGeometry(6, 6, 6);
      for (let i = 0; i < 16; i++) {
        const cloud = new THREE.Mesh(cloudGeo, cloudMat);
        const angle = (i / 16) * Math.PI * 2;
        const radius = 22 + Math.random() * 18;
        cloud.position.set(Math.cos(angle) * radius, 2 + Math.random() * 8, Math.sin(angle) * radius);
        cloud.scale.set(1.8 + Math.random(), 0.6 + Math.random() * 0.4, 1.8 + Math.random());
        this.fogCloudsGroup.add(cloud);
      }
      this.fogCloudsGroup.visible = false;
      this.weatherGroup.add(this.fogCloudsGroup);

      // 5. CELESTIAL SKY OBJECTS (SUN, MOON, STARS, RAINBOW, METEORS)
      this.buildCelestialMeshes(game);
    }

    buildCelestialMeshes(game) {
      if (!window.THREE || !game || !game.scene) return;
      const THREE = window.THREE;

      if (this.celestialGroup) {
        try { game.scene.remove(this.celestialGroup); } catch(e) {}
      }

      this.celestialGroup = new THREE.Group();
      this.celestialGroup.name = 'superbear_celestial_sky_system';
      game.scene.add(this.celestialGroup);

      // A) GÜNEŞ (THE RADIANT GOLDEN SUN ☀️)
      this.sunGroup = new THREE.Group();
      this.sunGroup.name = 'celestial_sun_group';

      // 1. Core Sun Orb
      const sunCoreGeo = new THREE.SphereGeometry(6.5, 24, 24);
      const sunCoreMat = new THREE.MeshBasicMaterial({ color: 0xfffbeb, fog: false });
      const sunCore = new THREE.Mesh(sunCoreGeo, sunCoreMat);
      this.sunGroup.add(sunCore);

      // 2. Glowing Solar Corona
      const sunCoronaGeo = new THREE.SphereGeometry(11.0, 16, 16);
      const sunCoronaMat = new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        depthWrite: false,
        fog: false
      });
      const sunCorona = new THREE.Mesh(sunCoronaGeo, sunCoronaMat);
      this.sunGroup.add(sunCorona);

      // 3. Golden Sunburst Rays Ring
      const sunRayGeo = new THREE.RingGeometry(8.0, 18.0, 24);
      const sunRayMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
        fog: false
      });
      const sunRay = new THREE.Mesh(sunRayGeo, sunRayMat);
      this.sunGroup.add(sunRay);
      this.celestialGroup.add(this.sunGroup);

      // B) AY (THE MYSTICAL SILVER MOON 🌙)
      this.moonGroup = new THREE.Group();
      this.moonGroup.name = 'celestial_moon_group';

      // 1. Pearl Moon Core
      const moonCoreGeo = new THREE.SphereGeometry(5.2, 24, 24);
      const moonCoreMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc, fog: false });
      const moonCore = new THREE.Mesh(moonCoreGeo, moonCoreMat);
      this.moonGroup.add(moonCore);

      // 2. Ethereal Cyan Moonlight Halo
      const moonHaloGeo = new THREE.SphereGeometry(8.8, 16, 16);
      const moonHaloMat = new THREE.MeshBasicMaterial({
        color: 0x93c5fd,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        depthWrite: false,
        fog: false
      });
      const moonHalo = new THREE.Mesh(moonHaloGeo, moonHaloMat);
      this.moonGroup.add(moonHalo);
      this.celestialGroup.add(this.moonGroup);

      // C) YILDIZLAR (1200 PARILTI DOLU GECE YILDIZI ✨)
      const starCount = 1200;
      const starGeo = new THREE.BufferGeometry();
      const starPos = new Float32Array(starCount * 3);
      const starCols = new Float32Array(starCount * 3);

      for (let i = 0; i < starCount; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0) * 0.46; // Üst yarıküre kubbesi
        const dist = 80 + Math.random() * 30; // 80-110m (sis içinde kaybolmaz)

        starPos[i * 3 + 0] = dist * Math.sin(phi) * Math.cos(theta);
        starPos[i * 3 + 1] = Math.max(12, dist * Math.cos(phi));
        starPos[i * 3 + 2] = dist * Math.sin(phi) * Math.sin(theta);

        const hue = Math.random();
        if (hue < 0.6) {
          starCols[i * 3] = 1.0; starCols[i * 3 + 1] = 1.0; starCols[i * 3 + 2] = 1.0;
        } else if (hue < 0.8) {
          starCols[i * 3] = 0.7; starCols[i * 3 + 1] = 0.92; starCols[i * 3 + 2] = 1.0;
        } else {
          starCols[i * 3] = 1.0; starCols[i * 3 + 1] = 0.92; starCols[i * 3 + 0.68];
        }
      }

      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      starGeo.setAttribute('color', new THREE.BufferAttribute(starCols, 3));
      this.starsMat = new THREE.PointsMaterial({
        size: 1.4,
        vertexColors: true,
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false
      });
      this.starsMesh = new THREE.Points(starGeo, this.starsMat);
      this.celestialGroup.add(this.starsMesh);

      // D) GÖKKUŞAĞI (7 RENKLİ BÜYÜLÜ GÖKKUŞAĞI KUBBESİ 🌈 - GÜNDÜZLERİ AÇILIR)
      this.rainbowGroup = new THREE.Group();
      this.rainbowGroup.name = 'celestial_rainbow_group';
      this.rainbowMaterials = [];

      const rainbowColors = [
        0xef4444, // Kırmızı
        0xf97316, // Turuncu
        0xfacc15, // Sarı
        0x22c55e, // Yeşil
        0x06b6d4, // Turkuaz
        0x3b82f6, // Mavi
        0xa855f7  // Mor
      ];

      rainbowColors.forEach((colorHex, idx) => {
        const radius = 68 + idx * 1.5;
        const torusGeo = new THREE.TorusGeometry(radius, 1.6, 10, 48, Math.PI);
        const torusMat = new THREE.MeshBasicMaterial({
          color: colorHex,
          transparent: true,
          opacity: 0.0,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
          depthWrite: false,
          fog: false // Sisten etkilenmez, gündüz pırıl pırıl parlar!
        });
        const band = new THREE.Mesh(torusGeo, torusMat);
        this.rainbowMaterials.push(torusMat);
        this.rainbowGroup.add(band);
      });

      this.rainbowGroup.position.set(0, 3, -35);
      this.rainbowGroup.rotation.x = 0.08;
      this.celestialGroup.add(this.rainbowGroup);

      // E) METEORLAR (GECE KAYAN PARLAK YILDIZLAR & METEORLAR 💫)
      this.meteorsGroup = new THREE.Group();
      this.meteorsGroup.name = 'celestial_meteors_group';
      this.celestialGroup.add(this.meteorsGroup);
      this.activeMeteors = [];
    }

    spawnMeteor() {
      if (!window.THREE || !this.meteorsGroup) return;
      const THREE = window.THREE;

      // Gece göğünün görünür kubbesinde, oyuncunun ön-üst hizasında kayar
      const startX = (Math.random() - 0.5) * 80;
      const startY = 32 + Math.random() * 20;
      const startZ = -15 + (Math.random() - 0.5) * 60;

      const dirX = (Math.random() - 0.5) * 45 + (Math.random() > 0.5 ? 20 : -20);
      const dirY = -(20 + Math.random() * 16);
      const dirZ = (Math.random() - 0.5) * 40;

      const meteorGroup = new THREE.Group();
      meteorGroup.position.set(startX, startY, startZ);

      // 1. Parlak Ak Kor Meteor Başlığı
      const headGeo = new THREE.SphereGeometry(1.4, 8, 8);
      const headMat = new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false });
      const headMesh = new THREE.Mesh(headGeo, headMat);
      meteorGroup.add(headMesh);

      // 1.B Alev Halesi
      const haloGeo = new THREE.SphereGeometry(2.4, 8, 8);
      const haloMat = new THREE.MeshBasicMaterial({
        color: (Math.random() > 0.5 ? 0xfbbf24 : 0x38bdf8),
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      meteorGroup.add(haloMesh);

      // 2. Işıltılı Uzun Alev Kuyruğu
      const tailLength = 18.0 + Math.random() * 12.0;
      const tailGeo = new THREE.CylinderGeometry(0.18, 1.5, tailLength, 8);
      const tailMat = new THREE.MeshBasicMaterial({
        color: (Math.random() > 0.5 ? 0x93c5fd : 0xfde047),
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false
      });
      const tailMesh = new THREE.Mesh(tailGeo, tailMat);
      tailMesh.position.y = tailLength / 2;
      tailMesh.rotation.x = Math.PI / 2;
      meteorGroup.add(tailMesh);

      // Uçuş yörüngesine çevir
      const vDir = new THREE.Vector3(dirX, dirY, dirZ).normalize();
      meteorGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), vDir);

      this.meteorsGroup.add(meteorGroup);
      this.activeMeteors.push({
        group: meteorGroup,
        vx: dirX * 1.8,
        vy: dirY * 1.8,
        vz: dirZ * 1.8,
        life: 1.8 + Math.random() * 0.6,
        maxLife: 1.8 + Math.random() * 0.6,
        tailMat: tailMat,
        headMat: headMat,
        haloMat: haloMat
      });
    }

    updateDayNight(dt, timestamp, game) {
      if (!this.dayNightCycleEnabled) return;
      const THREE = window.THREE;

      // İlerleme: 900 saniye (15 dk) Gündüz + 900 saniye (15 dk) Gece = 1800 saniye
      this.dayNightTime += dt;
      const cycleSec = this.dayNightTime % this.totalDayNightCycle;
      const isNightNow = (cycleSec >= this.dayCycleDuration);

      // Gündüz / Gece Değişim Bildirimi
      if (isNightNow !== this.isNight) {
        this.isNight = isNightNow;
        if (game.callbacks && game.callbacks.onShowNotice) {
          if (isNightNow) {
            game.callbacks.onShowNotice("🌙 Akşam Oldu! Ay, Yıldızlar ve Parlak Kayan Meteor Yağmuru Başladı! ☄️", "info");
          } else {
            game.callbacks.onShowNotice("☀️ Gün Ağardı! Güneş Doğdu ve Büyülü Gökkuşağı Gökyüzünde Açıldı! 🌈", "info");
          }
        }
        window.dispatchEvent(new CustomEvent('superbear:daynight-cycle', {
          detail: { isNight: isNightNow, cycleSec, total: this.totalDayNightCycle }
        }));
      }

      // --- 1. GÜNEŞ VE AY YÖRÜNGE HESABI ---
      const celestialRadius = 75;
      if (!isNightNow) {
        // GÜNDÜZ FAZI (0 to 900s)
        const dayT = cycleSec / this.dayCycleDuration; // 0 to 1
        const sunAngle = dayT * Math.PI;
        const sunX = Math.cos(sunAngle) * celestialRadius;
        const sunY = Math.max(12, Math.sin(sunAngle) * 55 + 14);
        const sunZ = -25;

        if (this.sunGroup) {
          this.sunGroup.position.set(sunX, sunY, sunZ);
          this.sunGroup.visible = true;
          this.sunGroup.rotation.z += dt * 0.2; // Yavaşça dönen güneş halesi
        }
        if (this.moonGroup) {
          this.moonGroup.visible = false;
        }

        // Yıldızlar gündüz sönük
        if (this.starsMat) {
          this.starsMat.opacity = Math.max(0.0, this.starsMat.opacity - dt * 0.25);
        }

        // GÖKKUŞAĞI FAZI (Gündüz vakti daima gökkuşağı açık ve ışıl ışıl!)
        this.rainbowOpacity = Math.min(0.95, this.rainbowOpacity + dt * 0.35);
        this.rainbowActive = true;
        this.rainbowMaterials.forEach(m => { m.opacity = this.rainbowOpacity; });

      } else {
        // GECE FAZI (900 to 1800s)
        const nightT = (cycleSec - this.dayCycleDuration) / this.nightCycleDuration; // 0 to 1
        const moonAngle = nightT * Math.PI;
        const moonX = Math.cos(moonAngle) * celestialRadius;
        const moonY = Math.max(12, Math.sin(moonAngle) * 52 + 14);
        const moonZ = 25;

        if (this.moonGroup) {
          this.moonGroup.position.set(moonX, moonY, moonZ);
          this.moonGroup.visible = true;
        }
        if (this.sunGroup) {
          this.sunGroup.visible = false;
        }

        // Yıldızlar geceleri parıldar
        if (this.starsMat) {
          this.starsMat.opacity = Math.min(0.95, this.starsMat.opacity + dt * 0.25);
          this.starsMat.size = 1.3 + Math.sin(timestamp * 0.003) * 0.3; // Parıltı kıpırtısı
        }

        // Gökkuşağı geceleri tamamen kapalı
        this.rainbowOpacity = Math.max(0.0, this.rainbowOpacity - dt * 0.35);
        this.rainbowMaterials.forEach(m => { m.opacity = this.rainbowOpacity; });
        this.rainbowActive = false;

        // KAYAN METEOR YAĞMURU (Akşam/Gece her 0.9-1.8 saniyede bir gökten meteorlar kayar!)
        const now = Date.now();
        if (now > this.nextMeteorTime) {
          this.spawnMeteor();
          if (Math.random() > 0.4) {
            setTimeout(() => this.spawnMeteor(), 250); // Çifte meteor!
          }
          if (Math.random() > 0.7) {
            setTimeout(() => this.spawnMeteor(), 500); // 3'lü meteor seli!
          }
          this.nextMeteorTime = now + 900 + Math.random() * 1100;
        }
      }

      // --- 2. AKTİF METEORLARIN HAREKETİ VE SÖNMESİ ---
      for (let i = this.activeMeteors.length - 1; i >= 0; i--) {
        const met = this.activeMeteors[i];
        met.life -= dt;
        met.group.position.x += met.vx * dt;
        met.group.position.y += met.vy * dt;
        met.group.position.z += met.vz * dt;

        const lifeRatio = Math.max(0, met.life / met.maxLife);
        if (met.tailMat) met.tailMat.opacity = lifeRatio * 0.95;
        if (met.headMat) met.headMat.opacity = lifeRatio;
        if (met.haloMat) met.haloMat.opacity = lifeRatio * 0.85;

        if (met.life <= 0) {
          if (this.meteorsGroup) this.meteorsGroup.remove(met.group);
          this.activeMeteors.splice(i, 1);
        }
      }

      // --- 3. GÖKYÜZÜ VE IŞIK ATMOSFERİ ENTEGRASYONU ---
      if (this.currentRegion === 'hub' && game.scene) {
        // Şafak (ilk 60s) ve Günbatımı (840-900s) yumuşak geçişleri
        let dayWeight = 1.0;
        if (cycleSec < 60) {
          dayWeight = cycleSec / 60; // Gündoğumu
        } else if (cycleSec < 840) {
          dayWeight = 1.0; // Tam gündüz
        } else if (cycleSec < 900) {
          dayWeight = 1.0 - (cycleSec - 840) / 60; // Günbatımı
        } else if (cycleSec < 960) {
          dayWeight = 0.0; // Geceye geçiş
        } else if (cycleSec < 1740) {
          dayWeight = 0.0; // Tam gece
        } else {
          dayWeight = (cycleSec - 1740) / 60; // Sabaha geçiş
        }

        // Gökyüzü arka plan rengi
        const daySky = new THREE.Color(0x38bdf8); // Parlak maviş gökyüzü
        const sunsetSky = new THREE.Color(0xf97316); // Akşam günbatımı turuncusu
        const nightSky = new THREE.Color(0x030712); // Derin kozmik gece laciverti

        let currentSky = new THREE.Color();
        if (dayWeight >= 0.95) {
          currentSky.copy(daySky);
        } else if (dayWeight <= 0.05) {
          currentSky.copy(nightSky);
        } else if (cycleSec >= 840 && cycleSec < 960) {
          currentSky.copy(sunsetSky).lerp(nightSky, 1.0 - dayWeight);
        } else {
          currentSky.copy(nightSky).lerp(daySky, dayWeight);
        }

        if (game.scene.background && game.scene.background.isColor) {
          game.scene.background.copy(currentSky);
        } else {
          game.scene.background = currentSky.clone();
        }

        // Sis rengi
        if (game.scene.fog && game.scene.fog.color) {
          const dayFog = new THREE.Color(0xa7f3d0);
          const nightFog = new THREE.Color(0x0f172a);
          game.scene.fog.color.copy(nightFog).lerp(dayFog, dayWeight);
        }

        // Güneş/Ay Işığı ve Ortam Işığı şiddeti
        const profile = WEATHER_PROFILES[this.currentWeather] || WEATHER_PROFILES.clear;
        const weatherAmb = profile.ambientMultiplier || 1.0;
        const weatherSun = profile.sunMultiplier || 1.0;

        if (game.ambientLight) {
          const ambDay = 1.05 * weatherAmb;
          const ambNight = 0.46 * weatherAmb;
          game.ambientLight.intensity = ambNight + (ambDay - ambNight) * dayWeight;
        }
        if (game.sunLight) {
          const sunDay = 1.25 * weatherSun;
          const moonNight = 0.42 * weatherSun;
          game.sunLight.intensity = moonNight + (sunDay - moonNight) * dayWeight;
          if (dayWeight < 0.2) {
            game.sunLight.color.setHex(0x93c5fd); // Ay ışığı
          } else {
            game.sunLight.color.setHex(0xfffbeb); // Güneş ışığı
          }
        }
      }
    }

    onRegionChange(regionId) {
      this.currentRegion = regionId;
      const config = REGION_WEATHER_CONFIG[regionId] || {
        defaultWeather: 'clear',
        allowedWeathers: ['clear', 'rain', 'fog', 'mystic'],
        mysticType: 'stardust',
        mysticColor: 0x93c5fd,
        name: regionId
      };

      // Set initial region weather
      this.setWeather(config.defaultWeather, false);

      // Update mystic particle color & behavior per region
      if (this.mysticMesh && this.mysticMesh.material && config.mysticColor) {
        this.mysticMesh.material.color.setHex(config.mysticColor);
        if (config.mysticType === 'embers') {
          this.mysticMesh.material.size = 0.85;
        } else if (config.mysticType === 'bubbles') {
          this.mysticMesh.material.size = 0.95;
        } else if (config.mysticType === 'gold_dust' || config.mysticType === 'honey') {
          this.mysticMesh.material.size = 0.7;
        } else {
          this.mysticMesh.material.size = 0.55;
        }
      }
    }

    setWeather(weatherId, notify = true) {
      if (!WEATHER_PROFILES[weatherId]) weatherId = 'clear';
      this.currentWeather = weatherId;
      this.lastCycleTime = Date.now();

      const profile = WEATHER_PROFILES[weatherId];
      const regionConfig = REGION_WEATHER_CONFIG[this.currentRegion] || {};

      // Toggle particle meshes
      if (this.rainMesh) {
        this.rainMesh.visible = (weatherId === 'rain' || weatherId === 'storm');
      }
      if (this.snowMesh) {
        this.snowMesh.visible = (weatherId === 'snow' || (weatherId === 'storm' && this.currentRegion === 'snow_desert'));
      }
      if (this.mysticMesh) {
        this.mysticMesh.visible = (weatherId === 'mystic' || (weatherId === 'clear' && ['beehive', 'volcano_cave', 'golden_sanctuary', 'space_realm'].includes(this.currentRegion)));
      }
      if (this.fogCloudsGroup) {
        this.fogCloudsGroup.visible = (weatherId === 'fog' || weatherId === 'storm');
      }

      // Adjust lighting and fog
      this.applyWeatherLighting(profile);

      // Dispatch event to UI & Audio
      if (notify) {
        window.dispatchEvent(new CustomEvent('superbear:weather-changed', {
          detail: {
            weather: weatherId,
            profile: profile,
            region: this.currentRegion,
            regionName: regionConfig.name || this.currentRegion
          }
        }));

        const game = window.__superBearGame;
        if (game && game.callbacks && game.callbacks.onShowNotice) {
          game.callbacks.onShowNotice(
            `${profile.icon} Hava Durumu: ${profile.nameTr}`,
            'info'
          );
        }
      }
    }

    applyWeatherLighting(profile) {
      const game = window.__superBearGame;
      if (!game || !game.scene) return;

      const THREE = window.THREE;
      if (!THREE) return;

      // Update fog density
      if (game.scene.fog) {
        const baseDensity = (this.currentRegion === 'space_realm' ? 0.015 : 0.02);
        game.scene.fog.density = baseDensity * profile.fogMultiplier;
        if (profile.fogColorShift) {
          game.scene.fog.color.setHex(profile.fogColorShift);
        }
      }

      // Ambient light intensity modifier
      if (game.ambientLight) {
        game.ambientLight.intensity = (profile.ambientMultiplier || 1.0);
      }
      if (game.sunLight) {
        game.sunLight.intensity = (profile.sunMultiplier || 1.0);
      }
    }

    cycleNextWeather() {
      const config = REGION_WEATHER_CONFIG[this.currentRegion] || {
        allowedWeathers: ['clear', 'rain', 'fog', 'mystic']
      };
      const list = config.allowedWeathers || ['clear', 'rain', 'fog', 'mystic'];
      const currentIndex = list.indexOf(this.currentWeather);
      const nextIndex = (currentIndex + 1) % list.length;
      this.setWeather(list[nextIndex], true);
    }

    toggleAutoCycle(enabled) {
      if (enabled === undefined) {
        this.isAutoCycleEnabled = !this.isAutoCycleEnabled;
      } else {
        this.isAutoCycleEnabled = !!enabled;
      }
      return this.isAutoCycleEnabled;
    }

    renderLoop(timestamp) {
      const scheduleNext = (delay) => {
        if (delay) setTimeout(this._boundRenderLoop, delay);
        else requestAnimationFrame(this._boundRenderLoop);
      };

      const game = window.__superBearGame;
      if (!game || !game.scene || !this.weatherGroup) {
        scheduleNext(300);
        return;
      }

      if (game.isPaused || window.__superBearPaused || window.__superBearModalOpen || (typeof document !== 'undefined' && document.hidden)) {
        scheduleNext(200);
        return;
      }

      const isMob = (typeof navigator !== "undefined" && (
        /android|tablet|ipad|iphone|ipod|wv|appcreator24/i.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ||
        navigator.maxTouchPoints > 0
      ));
      if (timestamp - this.lastFrameTime < (isMob ? 33.3 : 16.6)) {
        scheduleNext();
        return;
      }

      scheduleNext();

      const dt = Math.min((timestamp - this.lastFrameTime) / 1000, 0.1);
      this.lastFrameTime = timestamp;

      // Auto weather cycle timer
      if (this.isAutoCycleEnabled && Date.now() - this.lastCycleTime > this.cycleIntervalSeconds * 1000) {
        this.cycleNextWeather();
      }

      // Center weather group around player or camera
      const centerPos = game.playerPos || (game.camera && game.camera.position);
      if (centerPos) {
        this.weatherGroup.position.set(centerPos.x, centerPos.y, centerPos.z);
        if (this.celestialGroup) {
          this.celestialGroup.position.set(centerPos.x, 0, centerPos.z);
        }
      }

      // 15 Dakika Gündüz / 15 Dakika Gece Gökyüzü Motoru (Güneş, Ay, Yıldızlar, Gökkuşağı, Kayan Meteorlar)
      this.updateDayNight(dt, timestamp, game);

      // 1. UPDATE RAIN PARTICLES
      if (this.rainMesh && this.rainMesh.visible && this.rainPositions) {
        const pos = this.rainPositions;
        const count = pos.length / 3;
        const rainSpeed = (this.currentWeather === 'storm' ? 42 : 28);
        const windX = (this.currentWeather === 'storm' ? -8 : -2);

        for (let i = 0; i < count; i++) {
          pos[i * 3 + 1] -= rainSpeed * dt;
          pos[i * 3 + 0] += windX * dt;

          if (pos[i * 3 + 1] < -5) {
            pos[i * 3 + 1] = 40 + Math.random() * 5;
            pos[i * 3 + 0] = (Math.random() - 0.5) * 80;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 80;
          }
        }
        this.rainMesh.geometry.attributes.position.needsUpdate = true;
      }

      // 2. UPDATE SNOW PARTICLES
      if (this.snowMesh && this.snowMesh.visible && this.snowPositions) {
        const pos = this.snowPositions;
        const vels = this.snowVelocities;
        const count = pos.length / 3;
        const time = timestamp * 0.002;
        const stormMult = (this.currentWeather === 'storm' ? 2.5 : 1.0);

        for (let i = 0; i < count; i++) {
          const flutter = Math.sin(time + i) * 0.8 * stormMult;
          pos[i * 3 + 0] += (vels[i * 3 + 0] + flutter) * dt * stormMult;
          pos[i * 3 + 1] += vels[i * 3 + 1] * dt * stormMult;
          pos[i * 3 + 2] += (vels[i * 3 + 2] + Math.cos(time + i * 0.7) * 0.6) * dt;

          if (pos[i * 3 + 1] < -5) {
            pos[i * 3 + 1] = 40 + Math.random() * 5;
            pos[i * 3 + 0] = (Math.random() - 0.5) * 80;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 80;
          }
        }
        this.snowMesh.geometry.attributes.position.needsUpdate = true;
      }

      // 3. UPDATE MYSTIC PARTICLES
      if (this.mysticMesh && this.mysticMesh.visible && this.mysticPositions) {
        const pos = this.mysticPositions;
        const vels = this.mysticVelocities;
        const count = pos.length / 3;
        const time = timestamp * 0.0015;
        const config = REGION_WEATHER_CONFIG[this.currentRegion] || {};
        const isRising = (config.mysticType === 'embers' || config.mysticType === 'bubbles');

        for (let i = 0; i < count; i++) {
          if (isRising) {
            pos[i * 3 + 1] += (1.8 + Math.abs(vels[i * 3 + 1])) * dt;
            pos[i * 3 + 0] += Math.sin(time + i) * 0.5 * dt;
            pos[i * 3 + 2] += Math.cos(time + i) * 0.5 * dt;
            if (pos[i * 3 + 1] > 35) {
              pos[i * 3 + 1] = -2;
              pos[i * 3 + 0] = (Math.random() - 0.5) * 70;
              pos[i * 3 + 2] = (Math.random() - 0.5) * 70;
            }
          } else {
            pos[i * 3 + 0] += (vels[i * 3 + 0] + Math.sin(time + i * 0.5) * 0.4) * dt;
            pos[i * 3 + 1] += Math.sin(time * 0.8 + i) * 0.3 * dt;
            pos[i * 3 + 2] += (vels[i * 3 + 2] + Math.cos(time + i * 0.5) * 0.4) * dt;
          }
        }
        this.mysticMesh.geometry.attributes.position.needsUpdate = true;
      }

      // 4. UPDATE FOG CLOUDS
      if (this.fogCloudsGroup && this.fogCloudsGroup.visible) {
        this.fogCloudsGroup.rotation.y += dt * 0.04;
      }

      // 5. LIGHTNING FLASH SIMULATION IN STORMS
      if (this.currentWeather === 'storm') {
        const now = Date.now();
        if (!this.lightningActive && now > this.nextLightningTime) {
          this.lightningActive = true;
          this.lightningTimer = 0.12; // 120ms flash
          this.nextLightningTime = now + 5000 + Math.random() * 8000;
          
          if (game.ambientLight) game.ambientLight.intensity = 2.8;
          if (game.sunLight) game.sunLight.intensity = 3.5;
        } else if (this.lightningActive) {
          this.lightningTimer -= dt;
          if (this.lightningTimer <= 0) {
            this.lightningActive = false;
            const profile = WEATHER_PROFILES['storm'];
            if (game.ambientLight) game.ambientLight.intensity = profile.ambientMultiplier;
            if (game.sunLight) game.sunLight.intensity = profile.sunMultiplier;
          }
        }
      }
    }

    getCurrentWeather() {
      return {
        id: this.currentWeather,
        profile: WEATHER_PROFILES[this.currentWeather] || WEATHER_PROFILES.clear,
        region: this.currentRegion,
        isAutoCycle: this.isAutoCycleEnabled
      };
    }

    getAllWeathers() {
      return Object.values(WEATHER_PROFILES);
    }
  }

  // Expose global instance
  const weatherEngine = new DynamicWeatherSystem();
  window.__superBearWeatherSystem = weatherEngine;
  window.__setDayNightTime = (seconds) => { weatherEngine.dayNightTime = seconds; };
  window.__toggleDayNight = () => {
    weatherEngine.dayNightTime = weatherEngine.isNight ? 0 : 900;
  };
  window.__setDayTime = (isNight) => {
    weatherEngine.dayNightTime = isNight ? 900 : 0;
  };

  // Auto initialize on DOMContentLoaded or immediate
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => weatherEngine.init());
  } else {
    weatherEngine.init();
  }

})();
