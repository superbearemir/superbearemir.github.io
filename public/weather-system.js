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
      this.cycleIntervalSeconds = 75; // Auto weather shift every 75s
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
      }

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

  // Auto initialize on DOMContentLoaded or immediate
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => weatherEngine.init());
  } else {
    weatherEngine.init();
  }

})();
