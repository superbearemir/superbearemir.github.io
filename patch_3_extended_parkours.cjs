const fs = require('fs');

console.log('=== Starting 3 Extended Parkours Patch ===');

// ==========================================
// 1. PATCH GAME-BUNDLE.JS (Pelikan Ovaları & Kar Vadisi)
// ==========================================
let bundleCode = fs.readFileSync('public/game-bundle.js', 'utf8');

// Update bounds for pelican_plains and snow_desert
bundleCode = bundleCode.replace(
  'else if (r === "pelican_plains") bounds = { minX: -32, maxX: 32, minZ: -66, maxZ: 52, minY: -2, maxY: 50 };',
  'else if (r === "pelican_plains") bounds = { minX: -70, maxX: 70, minZ: -220, maxZ: 70, minY: -10, maxY: 120 };'
);

bundleCode = bundleCode.replace(
  'else if (r === "snow_desert") bounds = { minX: -32, maxX: 32, minZ: -82, maxZ: 60, minY: -2, maxY: 50 };',
  'else if (r === "snow_desert") bounds = { minX: -70, maxX: 70, minZ: -230, maxZ: 70, minY: -10, maxY: 120 };'
);

// New extended pelican_plains code
const oldPelicanIdx = bundleCode.indexOf('else if(r==="pelican_plains"){');
const oldSnowIdx = bundleCode.indexOf('else if(r==="snow_desert"){');

if (oldPelicanIdx === -1 || oldSnowIdx === -1) {
  console.error('Could not find pelican_plains or snow_desert in bundleCode!');
  process.exit(1);
}

const oldPelican = bundleCode.substring(oldPelicanIdx, oldSnowIdx);

const newPelican = `else if(r==="pelican_plains"){y={ambientColor:165063,sunColor:16777215,fogColor:12248829,skyColor:165063},x.set(0,2,46);const z=new Le({color:1096065}),v=new Le({color:366185}),U=new Le({color:11817737}),N=new Le({color:14742270}),B=new Le({color:165063,transparent:!0,opacity:.82});R(140,2,260,0,-1,-60,B,!0),R(12,1.5,10,0,.5,46,U),R(14,1.2,12,0,.2,46,z),T("pelican_easel_3",2,"Çizim 3: Pelikan Ovaları & Uzatılmış Gök Adaları",-3.5,1.2,44,.2);const A=new kt;A.position.set(3.5,1.2,45);const D=new Me(new Pn(.4,1.2,8),new Le({color:16317180}));A.add(D);const V=new Me(new Pn(.15,.6,6),new Le({color:16096779}));V.rotateX(Math.PI/2),V.position.set(0,.3,.4),A.add(V),e.add(A),c.push({id:"npc_pelican_scout",name:"Kaptan Martı",role:"Gök Adaları Kılavuzu",mesh:A,pos:new Y(3.5,1.2,45),avatarIcon:"🪶",dialogue:["Ahoy cesur ayı! Uzatılmış devasa Gök Adaları parkuruna hoş geldin!","Adalardaki zıplama mantarlarını ve rüzgar akımlarını kullanarak dev kanyonları aş!","En sondaki devasa Gök Arenası’nda Pelikan Lordu seni bekliyor! Trambolinlerden göğe fırlayıp havadayken ona darbeler indir!"]}),S(0,1.4,42,16),b("pelican_start_coin_1",-2,2.5,46),b("pelican_start_coin_2",2,2.5,46),R(14,2,12,0,3,32,z),R(3,8,3,-4,7,32,U);const F=new Me(new Rn(6,.4,.1),new Le({color:16638023}));F.position.set(-4,10,33.6),e.add(F),b("pelican_coin_wind_1",0,5,32),b("pelican_coin_wind_2",3,5,30,!0),S(3.5,4.2,29,17);const j=new kt;j.position.set(0,5.5,32);const te=new Me(new At(.35,8,8),new Le({color:3718648}));j.add(te),e.add(j),o.push({id:"enemy_baby_pelican_1",type:"bee",name:"Yavru Gök Pelikanı",mesh:j,pos:new Y(0,5.5,32),velocity:new Y,hp:35,maxHp:35,attackPower:8,isBoss:!1,attackCooldown:0,state:"patrol",animTimer:0}),R(3,1,3,-6,5.2,25,v),R(3,1,3,-10,6,21,v),R(16,2,14,-10,6,14,N),R(2,6,2,-16,9,18,N),R(2,6,2,-4,9,18,N),R(14,1,2,-10,12,18,N),b("pelican_ruin_gem_1",-10,8.5,14,!0),b("pelican_ruin_gem_2",-15,8.5,12),S(-6,7.2,10,18),R(18,2,16,8,8.5,2,z),T("pelican_easel_4",3,"Çizim 4: Tüküren Kırmızı Çiçekler & Zehir",12,9.7,4,-.4),[{x:5,y:9.7,z:2},{x:10,y:9.7,z:-2}].forEach((le,Re)=>{const Ce=new kt;Ce.position.set(le.x,le.y,le.z);const Ue=new Me(new jt(.12,.12,1.2),new Le({color:1409085}));Ue.position.y=.6,Ce.add(Ue);const ut=new Me(new At(.4,8,8),new Le({color:14427686,emissive:10033947,emissiveIntensity:.3}));ut.position.y=1.2,Ce.add(ut),e.add(Ce),o.push({id:\`flower_enemy_pelican_\${Re}\`,type:"flower_spitter",name:"Tüküren Kırmızı Çiçek",mesh:Ce,pos:new Y(le.x,le.y,le.z),velocity:new Y,hp:45,maxHp:45,attackPower:10,isBoss:!1,attackCooldown:0,state:"idle",animTimer:0})}),S(5,9.7,-4,18),R(14,2,12,0,11,-14,N),b("pelican_cloud_coin_1",-3,13,-14),b("pelican_cloud_coin_2",3,13,-14),b("pelican_cloud_gem",0,13.5,-14,!0),S(0,12.2,-18,17),R(8,1.5,14,0,12.5,-27,U),b("bridge_coin_1",0,14.5,-25),b("bridge_coin_2",0,14.5,-29),R(12,1.5,12,-10,14.0,-38,U),S(-10,15.2,-38,20),R(6,1.2,6,-2,15.5,-46,v),R(6,1.2,6,8,17.0,-54,v),R(14,2,12,0,18.5,-64,N),S(0,19.7,-66,22),R(8,1.5,14,0,21.0,-78,U),b("bridge_ext_coin_1",0,22.5,-75),b("bridge_ext_coin_2",0,22.5,-81),R(6,1.2,6,-8,22.5,-88,v),R(6,1.2,6,8,24.0,-96,v),R(24,2.5,24,0,25.5,-110,N),[{x:-10,z:-100},{x:10,z:-100},{x:-10,z:-120},{x:10,z:-120}].forEach((le,Re)=>{R(4,8,4,le.x,27,le.z,N),S(le.x,31.2,le.z,23),b(\`ext_tower_gem_\${Re}\`,le.x,33,le.z,!0)}),S(-7,27.2,-104,20),S(7,27.2,-104,20),S(0,27.2,-116,20),R(8,1.5,8,-6,28.0,-128,z),R(8,1.5,8,6,30.0,-140,z),R(16,2,14,0,32.0,-152,N),S(0,33.2,-155,25),R(36,2.5,36,0,32.5,-180,N),R(32,.4,32,0,34,-180,z),[{x:-13,z:-167,label:"Kuzeybatı Kulesi"},{x:13,z:-167,label:"Kuzeydoğu Kulesi"},{x:-13,z:-193,label:"Güneybatı Kulesi"},{x:13,z:-193,label:"Güneydoğu Kulesi"}].forEach((le,Re)=>{R(4,8,4,le.x,34,le.z,N),S(le.x,38.2,le.z,23),b(\`tower_gem_\${Re}\`,le.x,40,le.z,!0)}),S(-7,34.2,-174,20),S(7,34.2,-174,20),S(0,34.2,-186,20);const H=new kt;H.position.set(0,36.5,-180),H.scale.set(2.6,2.6,2.6);const I=new Me(new At(.85,16,16),new Le({color:165063,emissive:223649,emissiveIntensity:.35}));H.add(I);const G=new Me(new jt(.28,.38,.9,12),new Le({color:3718648}));G.position.set(0,.7,.5),G.rotateX(.3),H.add(G);const Z=new Me(new At(.45,12,12),new Le({color:165063}));Z.position.set(0,1.1,.75),H.add(Z);const pe=new Le({color:16436245,emissive:14251782,emissiveIntensity:.5}),X=new Me(new Pn(.3,.6,5),pe);X.position.set(0,1.6,.7),X.rotateX(-.2),H.add(X);const C=new yi({color:16711765}),W=new Me(new At(.08,6,6),C);W.position.set(-.22,1.2,1.05),H.add(W);const oe=new Me(new At(.08,6,6),C);oe.position.set(.22,1.2,1.05),H.add(oe);const xe=new Me(new Pn(.4,1.8,10),new Le({color:16347926}));xe.rotateX(Math.PI/2),xe.position.set(0,.9,1.8),H.add(xe);const Se=new Le({color:3718648,emissive:165063,emissiveIntensity:.2}),Q=new Me(new Rn(2.4,.12,1.1),Se);Q.name="boss_left_wing",Q.position.set(-1.6,.3,0),H.add(Q);const ae=new Me(new Rn(2.4,.12,1.1),Se);ae.name="boss_right_wing",ae.position.set(1.6,.3,0),H.add(ae),e.add(H),o.push({id:"boss_pelican_monarch",type:"pelican_boss",name:"Pelikan Ovaları Lordu (Mega Boss)",mesh:H,pos:new Y(0,36.5,-180),velocity:new Y,hp:250,maxHp:250,attackPower:16,isBoss:!0,attackCooldown:0,state:"chase",animTimer:0})}`;

bundleCode = bundleCode.replace(oldPelican, newPelican);

// New extended snow_desert code
const oldSnowStartIdx = bundleCode.indexOf('else if(r==="snow_desert"){');
const oldSpaceIdx = bundleCode.indexOf('else if(r==="space_realm"){');

if (oldSnowStartIdx === -1 || oldSpaceIdx === -1) {
  console.error('Could not find snow_desert or space_realm in bundleCode!');
  process.exit(1);
}

const oldSnow = bundleCode.substring(oldSnowStartIdx, oldSpaceIdx);

const newSnow = `else if(r==="snow_desert"){y={ambientColor:165063,sunColor:14742270,fogColor:12248829,skyColor:3718648},x.set(0,2,52);const z=new Le({color:16317180}),v=new Le({color:8246268,transparent:!0,opacity:.88}),U=new Le({color:165063,emissive:223649,emissiveIntensity:.4}),N=new Le({color:7877903});new Le({color:413243});const B=new Le({color:16638023}),A=new Le({color:988970});R(140,2,280,0,-2.5,-70,U,!0),R(14,2,12,0,.5,52,z),R(6,1.2,6,-3,1.6,54,N),T("snow_easel_5",4,"Çizim 5: Kar Vadisi, Çöl & Koca Ayak Keşfi",-4,1.6,50,.2);const D=new kt;D.position.set(4,1.6,51);const V=new Me(new Pn(.5,1.3,8),new Le({color:9741240}));D.add(V);const F=new Me(new Pn(.2,.5,6),new Le({color:3359061}));F.rotateX(Math.PI/2),F.position.set(0,.3,.45),D.add(F),e.add(D),c.push({id:"npc_snow_wolf",name:"İhtiyar Buz Kurdu",role:"Kar Vadisi Rehberi",mesh:D,pos:new Y(4,1.6,51),avatarIcon:"🐺",dialogue:["Dondurucu Kar Vadisi’ne hoş geldin cesur ayı! Burası daha önceki hiçbir yere benzemez.","Uzatılmış kaygan buz yolları, uçurumlu kanyonlar ve vadinin derinliklerinde yaşayan Buz Golemleri seni bekliyor.","Vadinin en ucundaki Zirve Çölü Monolitleri’nde efsanevi DEV KOCA AYAK (Bigfoot Yeti) uykusundan uyandı!","Koca Ayak dev adımlarıyla yeri sarsar ve dev kar gülleleri savurur. Dikkatli ol, kaygan zeminde savrulma!"]}),b("snow_camp_coin_1",-2,2.5,52),b("snow_camp_coin_2",2,2.5,52),S(0,1.6,47,16),R(6,1.5,18,0,2.5,36,v,!1,!1,!0),[-2.5,2.5].forEach((ze,qe)=>{R(.8,4,.8,ze,4,36+(qe===0?-4:4),v)}),b("ice_bridge_gem",0,4.8,36,!0),b("ice_bridge_coin_1",0,4.5,42),b("ice_bridge_coin_2",0,4.5,30);const j=new kt;j.position.set(0,4.5,33);const te=new Me(new At(.7,10,10),new Le({color:14870768}));j.add(te);const se=new Me(new At(.45,8,8),new Le({color:9741240}));se.position.y=.9,j.add(se),e.add(j),o.push({id:"enemy_snow_golem_1",type:"snow_golem",name:"Vadi Buz Golemi",mesh:j,pos:new Y(0,4.5,33),velocity:new Y,hp:60,maxHp:60,attackPower:12,isBoss:!1,attackCooldown:0,state:"patrol",animTimer:0}),S(0,3.4,28,17),[{x:-7,y:5.5,z:22,w:5,d:5},{x:7,y:7,z:16,w:5,d:5},{x:-6,y:8.5,z:10,w:4.5,d:4.5},{x:5,y:10,z:4,w:5,d:5}].forEach((ze,qe)=>{R(ze.w,1.8,ze.d,ze.x,ze.y,ze.z,v,!1,!1,!0),b(\`floe_coin_\${qe}\`,ze.x,ze.y+2,ze.z,qe%2===1),qe<3&&S(ze.x,ze.y+1.1,ze.z,18)}),R(20,2.5,20,0,10,-10,z),R(3,8,3,-8,14,-18,v),R(3,8,3,8,14,-18,v),R(14,1.5,2,0,17,-18,z),b("castle_gem_1",-8,19,-18,!0),b("castle_gem_2",8,19,-18,!0),b("castle_coin_mid",0,12.5,-10),[-6,6].forEach((ze,qe)=>{const at=new kt;at.position.set(ze,11.5,-12);const yt=new Me(new jt(.12,.12,1),new Le({color:165063}));yt.position.y=.5,at.add(yt);const xt=new Me(new At(.38,8,8),new Le({color:3718648,emissive:165063,emissiveIntensity:.5}));xt.position.y=1,at.add(xt),e.add(at),o.push({id:\`frost_spitter_\${qe}\`,type:"flower_spitter",name:"Buz Tüküren Bitki",mesh:at,pos:new Y(ze,11.5,-12),velocity:new Y,hp:50,maxHp:50,attackPower:12,isBoss:!1,attackCooldown:0,state:"idle",animTimer:qe*1.5})}),S(0,11.4,-18,19),R(24,2,16,0,12,-32,B),[{x:-9,z:-32,h:10},{x:9,z:-32,h:10}].forEach((ze,qe)=>{R(2.5,ze.h,2.5,ze.x,12+ze.h/2,ze.z,A,!1,!0),b(\`desert_top_gem_\${qe}\`,ze.x,12+ze.h+1.5,ze.z,!0)}),S(0,13.2,-38,20),R(8,1.8,20,0,13.0,-52,v,!1,!1,!0),R(5,1.5,5,-6,14.5,-64,v),R(5,1.5,5,6,16.0,-72,v),R(20,2.5,18,0,17.5,-82,B),S(0,18.7,-85,20),R(6,1.8,6,-8,20.5,-95,v),R(6,1.8,6,8,22.0,-105,v),R(22,2.5,22,0,23.5,-118,z),S(0,24.7,-123,22),[{x:-9,z:-135,h:12},{x:9,z:-135,h:12},{x:-9,z:-150,h:12},{x:9,z:-150,h:12}].forEach((ze,qe)=>{R(2.5,ze.h,2.5,ze.x,24+ze.h/2,ze.z,A,!1,!0),b(\`desert_ext_gem_\${qe}\`,ze.x,24+ze.h+1.5,ze.z,!0)}),R(34,.6,12,0,34.0,-165,v,!1,!1,!0),S(0,34.2,-172,22),R(38,3,38,0,33.5,-195,A),R(34,.5,34,0,35.1,-195,z),R(34,.6,4,0,35.2,-180,v,!1,!1,!0),R(34,.6,4,0,35.2,-210,v,!1,!1,!0),[{x:-14,z:-182},{x:14,z:-182},{x:-14,z:-208},{x:14,z:-208}].forEach((ze,qe)=>{R(3,5,3,ze.x,36,ze.z,A),S(ze.x,38.7,ze.z,22),b(\`totem_coin_\${qe}\`,ze.x,40.5,ze.z,!0)});const I=new kt;I.position.set(0,35.5,-195),I.scale.set(3.2,3.2,3.2);const G=new Le({color:14870768,emissive:9741240,emissiveIntensity:.25}),Z=new Le({color:6583435}),pe=new yi({color:3718648}),X=new Me(new jt(.65,.85,1.4,12),G);X.position.y=1,I.add(X);const C=new Me(new At(.55,12,12),G);C.position.set(0,1.8,.2),I.add(C);const W=new Me(new At(.35,10,10),Z);W.position.set(0,1.75,.5),I.add(W);const oe=new Me(new At(.09,6,6),pe);oe.position.set(-.18,1.85,.75),I.add(oe);const xe=new Me(new At(.09,6,6),pe);xe.position.set(.18,1.85,.75),I.add(xe);const Se=new Le({color:16777215}),Q=new Me(new Pn(.08,.35,6),Se);Q.position.set(-.16,1.55,.75),Q.rotateX(Math.PI),I.add(Q);const ae=new Me(new Pn(.08,.35,6),Se);ae.position.set(.16,1.55,.75),ae.rotateX(Math.PI),I.add(ae);const le=new Le({color:13358561}),Re=new Me(new jt(.28,.35,1.5,8),le);Re.name="bf_arm_left",Re.position.set(-1,.9,.2),Re.rotateZ(.25),I.add(Re);const Ce=new Me(new jt(.28,.35,1.5,8),le);Ce.name="bf_arm_right",Ce.position.set(1,.9,.2),Ce.rotateZ(-.25),I.add(Ce);const Ue=new Le({color:4674921}),ut=new Me(new Rn(.55,.25,1.1),Ue);ut.position.set(-.45,.12,.2),I.add(ut);const Ye=new Me(new Rn(.55,.25,1.1),Ue);Ye.position.set(.45,.12,.2),I.add(Ye);const je=new Le({color:3718648,emissive:165063,emissiveIntensity:.4}),ct=new Me(new jt(.2,.4,2,8),je);ct.name="bf_ice_club",ct.position.set(1.2,.6,.6),ct.rotateX(Math.PI/4),I.add(ct),e.add(I),o.push({id:"boss_bigfoot_titan",type:"bigfoot_boss",name:"Koca Ayak (Bigfoot Yeti Boss)",mesh:I,pos:new Y(0,35.5,-195),velocity:new Y,hp:320,maxHp:320,attackPower:22,isBoss:!0,attackCooldown:0,state:"chase",animTimer:0})}`;

bundleCode = bundleCode.replace(oldSnow, newSnow);

fs.writeFileSync('public/game-bundle.js', bundleCode, 'utf8');
console.log('Successfully updated game-bundle.js for Pelikan Ovaları and Kar Vadisi!');

// ==========================================
// 2. PATCH GAME-ENHANCER.JS (Yıkılmış Köy)
// ==========================================
let enhancerCode = fs.readFileSync('public/game-enhancer.js', 'utf8');

const idxRIn = enhancerCode.indexOf('function populateRuinVillage');
const idxREnd = enhancerCode.indexOf('function teleportToRuinVillage');

if (idxRIn === -1 || idxREnd === -1) {
  console.error('Could not find populateRuinVillage or teleportToRuinVillage in enhancerCode!');
  process.exit(1);
}

const oldRuinVillage = enhancerCode.substring(idxRIn, idxREnd);

const newRuinVillage = `function populateRuinVillage(game) {
  if (game && game.currentLevel) ensureLevelArrays(game.currentLevel);
  const THREE = window.THREE;
  if (!game || !game.scene) return;

  console.log("🏚️ Initializing 13. Bölüm: Uzatılmış Yıkılmış Köy & Jokerooms Palyaço Boss...");

  if (game.currentLevel) {
    if (game.currentLevel.sceneGroup && game.currentLevel.sceneGroup.parent) {
      game.currentLevel.sceneGroup.parent.remove(game.currentLevel.sceneGroup);
    }
    if (game.currentLevel.mesh && game.currentLevel.mesh.parent) {
      game.currentLevel.mesh.parent.remove(game.currentLevel.mesh);
    }
  }

  const ruinGroup = new THREE.Group();
  ruinGroup.name = "ruin_village_level_mesh";
  game.scene.add(ruinGroup);

  game.currentLevel = {
    sceneGroup: ruinGroup,
    mesh: ruinGroup,
    colliders: [],
    collectibles: [],
    enemies: [],
    checkpoints: [],
    spawnPoint: new THREE.Vector3(0, 2.0, 80),
    jumpPads: [],
    warningSigns: [],
    movingPlatforms: [],
    fallingPlatforms: [],
    clownBoss: null
  };

  // Dark Burnt Sky & Dense Ash Fog
  game.scene.background = new THREE.Color(0x2d1313);
  game.scene.fog = new THREE.FogExp2(0x2a1717, 0.015);

  // Materials
  const stoneRuinMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 });
  const darkBrickMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.95 });
  const burntWoodMat = new THREE.MeshStandardMaterial({ color: 0x292524, roughness: 0.9 });
  const lavaMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.8 });
  const acidMat = new THREE.MeshStandardMaterial({ color: 0x84cc16, emissive: 0x4d7c0f, emissiveIntensity: 0.6 });

  // Helper: Create Platform
  const addPlat = (x, y, z, w, h, d, mat = stoneRuinMat) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    ruinGroup.add(mesh);
    game.currentLevel.colliders.push({
      min: new THREE.Vector3(x - w / 2, y - h / 2, z - d / 2),
      max: new THREE.Vector3(x + w / 2, y + h / 2, z + d / 2)
    });
    return mesh;
  };

  // Helper: Warning Sign Add
  const addWarningSign = (x, y, z, title, detail) => {
    const signMesh = create3DWarningSign(THREE, x, y, z, title, detail);
    ruinGroup.add(signMesh);
    game.currentLevel.warningSigns.push({
      mesh: signMesh,
      pos: new THREE.Vector3(x, y, z),
      title: title,
      detail: detail
    });
  };

  // Helper: Jump Pad / Geyser
  const addGeyser = (x, y, z, boostForce = 32) => {
    const stepRing = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.6, 0.5, 16), stoneRuinMat);
    stepRing.position.set(x, y - 0.25, z);
    ruinGroup.add(stepRing);

    const pad = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.6, 0.9, 16), lavaMat);
    pad.position.set(x, y + 0.2, z);
    ruinGroup.add(pad);

    const core = new THREE.Mesh(new THREE.SphereGeometry(1.2, 12, 12), new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
    core.position.set(x, y + 0.7, z);
    ruinGroup.add(core);

    game.currentLevel.colliders.push({
      min: new THREE.Vector3(x - 3.6, y - 0.6, z - 3.6),
      max: new THREE.Vector3(x + 3.6, y + 0.4, z + 3.6)
    });
    game.currentLevel.jumpPads.push({
      pos: new THREE.Vector3(x, y, z),
      boostForce: boostForce
    });
  };

  // -------------------------------------------------------------
  // ZONE 1: ENTRANCE ARCH & ACID SLIME SPRING (z = 90 to 40)
  // -------------------------------------------------------------
  addPlat(0, 1, 80, 20, 2, 20, stoneRuinMat);
  addWarningSign(0, 2.0, 76, "⚠️ UYARI TABELASI 1", "⚠️ UZATILMIŞ YIKILMIŞ KÖY PARKURUNA HOŞ GELDİNİZ! İLERİDE ÇÖKEN TAŞLAR VE UZUN ASİT KANYONU VAR!");

  const archL = new THREE.Mesh(new THREE.BoxGeometry(2, 8, 2), darkBrickMat);
  archL.position.set(-6, 5, 70);
  ruinGroup.add(archL);
  const archR = new THREE.Mesh(new THREE.BoxGeometry(2, 8, 2), darkBrickMat);
  archR.position.set(6, 5, 70);
  ruinGroup.add(archR);
  const archTop = new THREE.Mesh(new THREE.BoxGeometry(14, 2, 2), darkBrickMat);
  archTop.position.set(0, 9, 70);
  ruinGroup.add(archTop);

  const acidFloor = new THREE.Mesh(new THREE.BoxGeometry(300, 1, 600), acidMat);
  acidFloor.position.set(0, -6, -100);
  ruinGroup.add(acidFloor);

  addPlat(0, 1.5, 60, 6, 1.5, 6, burntWoodMat);
  addPlat(-5, 2.0, 52, 5, 1.5, 5, stoneRuinMat);
  addPlat(5, 2.5, 44, 5, 1.5, 5, stoneRuinMat);
  addPlat(0, 3.0, 36, 16, 2, 12, stoneRuinMat);

  const cp1Pos = new THREE.Vector3(0, 4.2, 36);
  const cp1Visual = createCheckpointVisual(THREE, cp1Pos);
  ruinGroup.add(cp1Visual);
  game.currentLevel.checkpoints.push({ id: 'ruin_cp_1', name: '1. Yıkık Çatılar Girişi', pos: cp1Pos, active: true, mesh: cp1Visual });

  // -------------------------------------------------------------
  // ZONE 2: SLANTED RUINED ROOFS & CHIMNEYS (z = 30 to -30)
  // -------------------------------------------------------------
  addWarningSign(0, 4.2, 32, "🚨 UYARI TABELASI 2", "🚨 DİKKAT! YIKILAN ÇATILAR VE SARKAN BACALAR! ZAMANLAMAYI İYİ AYARLA!");

  const roof1 = addPlat(-6, 5.0, 22, 12, 1.0, 10, burntWoodMat);
  roof1.rotation.z = 0.2;
  addPlat(0, 6.5, 12, 4, 1.2, 10, darkBrickMat);
  const roof2 = addPlat(6, 8.0, 2, 12, 1.0, 10, burntWoodMat);
  roof2.rotation.z = -0.2;
  addPlat(0, 9.5, -8, 5, 1.5, 5, darkBrickMat);
  addPlat(0, 11.0, -20, 18, 2, 16, stoneRuinMat);

  const cp2Pos = new THREE.Vector3(0, 12.2, -20);
  const cp2Visual = createCheckpointVisual(THREE, cp2Pos);
  ruinGroup.add(cp2Visual);
  game.currentLevel.checkpoints.push({ id: 'ruin_cp_2', name: '2. Lav Uçurumu İskelesi', pos: cp2Pos, active: false, mesh: cp2Visual });

  // -------------------------------------------------------------
  // ZONE 3: MOLTEN LAVA CHASM & LAUNCH GEYSERS (z = -30 to -140)
  // -------------------------------------------------------------
  addWarningSign(0, 12.2, -24, "⚠️ UYARI TABELASI 3", "⚠️ UYARI: UZATILMIŞ DEVASA LAV UÇURUMU! GAYZERLERİ KULLANARAK YUKARI TIRMANDIN!");

  addPlat(0, 10.8, -14, 10, 1.8, 8, stoneRuinMat);
  addGeyser(0, 12.2, -20, 32);
  addPlat(0, 14.8, -30, 12, 2.0, 10, stoneRuinMat);
  addPlat(0, 17.5, -40, 12, 2.0, 10, stoneRuinMat);
  addPlat(0, 20.0, -50, 14, 2, 14, stoneRuinMat);
  addPlat(-4, 21.5, -58, 8, 1.8, 8, stoneRuinMat);
  addPlat(-8, 23.0, -66, 8, 1.8, 8, burntWoodMat);
  addPlat(0, 24.5, -74, 10, 2.0, 10, stoneRuinMat);
  addPlat(8, 26.0, -82, 8, 1.8, 8, burntWoodMat);
  addPlat(4, 27.0, -90, 8, 1.8, 8, stoneRuinMat);
  addGeyser(4, 28.2, -90, 34);

  addPlat(-6, 31.0, -104, 10, 2.0, 10, burntWoodMat);
  addPlat(6, 33.0, -118, 10, 2.0, 10, stoneRuinMat);
  addPlat(0, 35.0, -130, 18, 2, 16, stoneRuinMat);

  const cp3Pos = new THREE.Vector3(0, 36.2, -130);
  const cp3Visual = createCheckpointVisual(THREE, cp3Pos);
  ruinGroup.add(cp3Visual);
  game.currentLevel.checkpoints.push({ id: 'ruin_cp_3', name: '3. Uzatılmış Çan Kulesi Tabanı', pos: cp3Pos, active: false, mesh: cp3Visual });

  // -------------------------------------------------------------
  // ZONE 4: TWISTED BELL TOWER & HIGH HIGHWAY (z = -140 to -260)
  // -------------------------------------------------------------
  addPlat(0, 36.5, -140, 16, 2.0, 16, stoneRuinMat);
  addPlat(0, 38.5, -150, 16, 2.0, 16, stoneRuinMat);
  addPlat(0, 40.5, -160, 18, 2.0, 16, stoneRuinMat);

  const towerCore = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 5.5, 55, 16), darkBrickMat);
  towerCore.position.set(0, 58.0, -180);
  ruinGroup.add(towerCore);

  for (let i = 0; i < 22; i++) {
    const ang = (i / 22) * Math.PI * 2.5;
    const sx = Math.cos(ang) * 9.5;
    const sz = -180 + Math.sin(ang) * 9.5;
    const sy = 37.5 + (i * 1.3);
    addPlat(sx, sy, sz, 7, 1.5, 7, stoneRuinMat);
  }

  addPlat(0, 42.0, -180, 16, 2.0, 16, stoneRuinMat);
  addPlat(0, 46.0, -192, 16, 2.0, 16, stoneRuinMat);
  addPlat(0, 50.0, -204, 16, 2.0, 16, stoneRuinMat);
  addPlat(0, 54.0, -216, 18, 2.0, 16, stoneRuinMat);
  addPlat(0, 58.0, -228, 20, 2.0, 16, stoneRuinMat);

  addPlat(0, 62.0, -240, 24, 2.5, 20, stoneRuinMat);
  addGeyser(0, 63.2, -240, 36);

  addPlat(0, 64.0, -252, 20, 2.0, 14, stoneRuinMat);
  addPlat(0, 66.0, -264, 22, 2.0, 14, stoneRuinMat);
  addPlat(0, 68.0, -276, 24, 2.0, 14, stoneRuinMat);

  // -------------------------------------------------------------
  // ZONE 5: JOKEROOMS CIRCUS GATE & BOSS ARENA (z = -280 to -380)
  // -------------------------------------------------------------
  const circusArchL = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2.0, 14, 8), darkBrickMat);
  circusArchL.position.set(-12, 73.0, -290);
  ruinGroup.add(circusArchL);
  const circusArchR = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2.0, 14, 8), darkBrickMat);
  circusArchR.position.set(12, 73.0, -290);
  ruinGroup.add(circusArchR);
  const circusArchTop = new THREE.Mesh(new THREE.BoxGeometry(26, 2.5, 3.5), lavaMat);
  circusArchTop.position.set(0, 80.0, -290);
  ruinGroup.add(circusArchTop);

  addWarningSign(0, 70.2, -286, "🤡 SON UYARI TABELASI 4", "🤡 UZATILMIŞ PARKURUN SONU: JOKEROOMS CIRCUS ARENASI! DEV PALYAÇO BOSS SENİ BEKLİYOR!");

  addPlat(0, 69.0, -290, 30, 2.5, 18, stoneRuinMat);
  const cp4Pos = new THREE.Vector3(0, 70.5, -290);
  const cp4Visual = createCheckpointVisual(THREE, cp4Pos);
  ruinGroup.add(cp4Visual);
  game.currentLevel.checkpoints.push({ id: 'ruin_cp_4', name: '4. Jokerooms Palyaço Arenası Girişi', pos: cp4Pos, active: false, mesh: cp4Visual });

  addGeyser(0, 70.5, -290, 32);

  addPlat(0, 69.0, -302, 30, 2.5, 14, stoneRuinMat);
  addPlat(0, 69.0, -316, 32, 2.5, 14, stoneRuinMat);
  addPlat(0, 68.0, -330, 34, 4.0, 14, stoneRuinMat);
  addPlat(0, 68.0, -344, 34, 4.0, 14, stoneRuinMat);

  const arenaX = 0, arenaY = 68.0, arenaZ = -370;
  addPlat(arenaX, arenaY, arenaZ, 85, 4, 85, stoneRuinMat);

  const ringMat = new THREE.MeshStandardMaterial({ color: 0x9333ea, emissive: 0x7e22ce, emissiveIntensity: 0.8 });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(34, 1.2, 12, 32), ringMat);
  ring.position.set(arenaX, arenaY + 2.1, arenaZ);
  ring.rotation.x = Math.PI / 2;
  ruinGroup.add(ring);

  if (game.playerPos) game.playerPos.set(0, 3.0, 80);
  if (game.playerVel) game.playerVel.set(0, 0, 0);

  // BOSS: JOKEROOMS DEV PALYAÇO BOSS (Same boss type & mesh!)
  const clownBossMesh = createClownBossMesh(THREE);
  const bossPos = new THREE.Vector3(arenaX, arenaY + 2.0, arenaZ);
  clownBossMesh.position.copy(bossPos);
  ruinGroup.add(clownBossMesh);

  game.currentLevel.clownBoss = {
    id: 'boss_joker_clown',
    type: 'joker_clown_boss',
    name: 'Jokerooms Dev Palyaço Boss (Elleri & Ayakları Var 🤡)',
    mesh: clownBossMesh,
    pos: bossPos,
    hp: 1000,
    maxHp: 1000,
    attackPower: 20,
    isBoss: true,
    attackCooldown: 0,
    animTimer: 0,
    deadMessageShown: false
  };
  game.currentLevel.enemies.push(game.currentLevel.clownBoss);

  if (game.callbacks && game.callbacks.onShowNotice) {
    game.callbacks.onShowNotice("🏚️ 13. Bölüm: Yıkılmış Köy! Uzatılmış zorlu parkur ve dev palyaço boss!", "success");
  }
}`;

enhancerCode = enhancerCode.replace(oldRuinVillage, newRuinVillage);

fs.writeFileSync('public/game-enhancer.js', enhancerCode, 'utf8');
console.log('Successfully updated game-enhancer.js for Yıkılmış Köy!');
