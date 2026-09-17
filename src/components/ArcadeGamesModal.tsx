import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Gamepad2, 
  Trophy, 
  Play, 
  RotateCcw, 
  Sparkles, 
  Zap, 
  Award,
  Calendar,
  Flame,
  CheckCircle2,
  Gift
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface ArcadeGamesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardEarned?: (coins: number, tokens: number) => void;
}

export type ArcadeGameId = 
  | 'honey_rush' 
  | 'bubble_jump' 
  | 'target_blaster' 
  | 'retro_runner'
  | 'space_invaders'
  | 'flappy_bear'
  | 'brick_breaker'
  | 'bear_snake'
  | 'meteor_dodge'
  | 'whack_mole';

export interface ArcadeGameMeta {
  id: ArcadeGameId;
  title: string;
  subtitle: string;
  icon: string;
  themeColor: string;
  accentBadge: string;
  description: string;
  rules: string[];
}

export const ARCADE_TRANSLATIONS: Record<string, {
  headerTitle: string;
  gameCount: string;
  gameOfTheDay: string;
  claimDailyGift: string;
  tabDaily: string;
  tabAll: string;
  tabSubtitle: string;
  liveScore: string;
  changeGame: string;
  howToPlay: string;
  gameOver: string;
  highScore: string;
  points: string;
  playBtn: string;
  playAgainBtn: string;
  bonusAdded: string;
  footerTitle: string;
  footerDesc: string;
  closeBtn: string;
  games: Record<ArcadeGameId, {
    title: string;
    subtitle: string;
    badge: string;
    description: string;
    rules: string[];
  }>;
}> = {
  tr: {
    headerTitle: 'SUPER BEAR RETRO ARCADE SALONU',
    gameCount: '10 FARKLI OYUN 🔥',
    gameOfTheDay: 'Günün Oyunu',
    claimDailyGift: 'Günün Hediyesini Al! (+150 🍯)',
    tabDaily: 'Günün Yeni Oyunları (Rotasyon)',
    tabAll: 'Tüm 10 Atari Oyunu',
    tabSubtitle: 'Her Gün Yepyeni Oyunlar & 2X Çifte Kazanç!',
    liveScore: 'Canlı Skor',
    changeGame: '◀ Oyun Değiştir',
    howToPlay: 'Nasıl Oynanır?',
    gameOver: 'Oyun Bitti!',
    highScore: 'En Yüksek Skor',
    points: 'Puan',
    playBtn: 'Oyunu Başlat',
    playAgainBtn: 'Tekrar Oyna',
    bonusAdded: '2X Çifte Ödül Hesabına Eklendi!',
    footerTitle: '🎁 Günlük Atari Ödül Sistemi:',
    footerDesc: 'Her gün atari salonunu ziyaret et, günün 2X oyununu oyna ve bolca Altın ile Atari Jetonu topla!',
    closeBtn: 'Kapat',
    games: {
      honey_rush: {
        title: 'Bal & Altın Koşusu',
        subtitle: 'Hızlı Koşu & Engelden Kaçış',
        badge: 'Refleks & Hız',
        description: 'Ayımızla koşarken dikenli kutulardan ve kayalardan kaçın, parıldayan altın petekleri ve bal kavanozlarını toplayarak rekor kır!',
        rules: ['Boşluk veya Tık: Zıpla', 'Bal Kavanozu: +10 Puan', 'Altın Petek: +25 Puan', 'Çarparsan oyun biter!']
      },
      bubble_jump: {
        title: 'Baloncuk Zıplama & Patlatma',
        subtitle: 'Gökyüzü Baloncuk Trambolini',
        badge: 'Zamanlama & Kombo',
        description: 'Yükselen renkli su baloncuklarının üzerine basarak yukarı zıpla! Baloncukları tam zamanında patlatıp gökyüzü bulutlarına ulaş!',
        rules: ['Sol/Sağ Tuşları veya Mouse: Hareket et', 'Baloncuğa bas: Süper Zıplama', 'Gökkuşağı Balon: +50 Puan', 'Aşağı düşme!']
      },
      space_invaders: {
        title: 'Galaktik Ayı İstilası',
        subtitle: 'Kozmik Atari & Lazer Savaşı',
        badge: 'Kozmik Savaş',
        description: 'Uzay gemini yönlendir, dalga dalga inen mutant uzay arılarını ve UFO patronlarını lazer atışlarıyla patlat!',
        rules: ['Mouse veya Sol/Sağ: Hareket', 'Boşluk veya Tık: Lazer Ateşle', 'Düşman Arı: +20 Puan', 'UFO Boss: +60 Puan']
      },
      flappy_bear: {
        title: 'Uçan Bal Ayısı',
        subtitle: 'Kanat Çırp & Bal Peteği Uçuşu',
        badge: 'Beceri & Uçuş',
        description: 'Küçük peri kanatlarını çırparak bal sütunları ve bambu engelleri arasından süzül! En uzak mesafeye uç!',
        rules: ['Tık veya Boşluk: Kanat Çırp', 'Engellerin arasından geç: +10 Puan', 'Ortadaki Bal: +25 Puan', 'Zemine veya direğe çarpma!']
      },
      brick_breaker: {
        title: 'Bal Tuğlası Kırıcı',
        subtitle: 'Klasik Arkanoid & Enerji Topu',
        badge: 'Retro Kırıcı',
        description: 'Paleti kontrol et, enerji küresini sektirerek renkli bal peteklerini ve şeker tuğlalarını kır!',
        rules: ['Mouse veya Sol/Sağ Tuşlar: Raket', 'Kırılan Her Tuğla: +15 Puan', 'Hepsini temizle: +200 Bonus', 'Topu düşürme!']
      },
      bear_snake: {
        title: 'Çilek Avcısı Piksel Yılan',
        subtitle: 'Efsanevi Yılan & Meyve Ziyafeti',
        badge: 'Nostaljik Yılan',
        description: 'Klasik atari yılanı! Çilekleri topla, uzadıkça uzayan kuyruğuna ve duvarlara çarpmadan devasa bir skora ulaş!',
        rules: ['Ok Tuşları veya WASD: Yön Değiştir', 'Kırmızı Çilek: +10 Puan & Büyüme', 'Altın Ananas: +50 Puan', 'Kuyruğuna çarpma!']
      },
      meteor_dodge: {
        title: 'Meteor Yağmuru Kaçış',
        subtitle: 'Ateşli Göktaşı & Hayatta Kalma',
        badge: 'Hayatta Kalma',
        description: 'Gökyüzünden yağan kızgın lav meteorlarından kaç! Düşen parıldayan uzay elmaslarını kapıp hayatta kal!',
        rules: ['Mouse veya Sol/Sağ: Kaç', 'Uzay Elması: +25 Puan', 'Hayatta Kalınan Her Saniye: +3 Puan', 'Meteordan kaç!']
      },
      whack_mole: {
        title: 'Hırsız Arı & Köstebek Yakala',
        subtitle: 'Refleks & Hızlı Tıklama Poligonu',
        badge: 'Hızlı Refleks',
        description: 'Ağaç kovuklarından ve bal küplerinden kafasını çıkaran yaramaz hırsızlara hemen tıkla, kaçmadan yakala!',
        rules: ['Çıkan Hırsıza Hızlıca Tıkla', 'Normal Hırsız: +20 Puan', 'Altın Kraliçe: +50 Puan', 'Süre: 30 Saniye']
      },
      target_blaster: {
        title: 'Hedef Vurma & Meşe Poligonu',
        subtitle: 'Nişan Al & Bullseye Vuruşu',
        badge: 'Nişancılık & Odak',
        description: 'Ekranda beliren ve hareket eden renkli hedeflere, altın balonlara ve palamutlara tıkla! Zaman dolmadan en yüksek puanı topla!',
        rules: ['Hedefe Tıkla: Vur', 'Merkez Bullseye: +30 Puan', 'Altın Balon: +50 Puan & +3 sn', 'Süre: 30 Saniye']
      },
      retro_runner: {
        title: '8-Bit Piksel Parkur',
        subtitle: 'Klasik Chiptune Engel Yarışı',
        badge: 'Chiptune Klasik',
        description: 'Retro piksel grafiklerle hazırlanan nostaljik atari oyunu! Giderek hızlanan platformlarda zıpla ve en uzun mesafeye koş!',
        rules: ['Boşluk veya Tık: Zıpla', 'Çift Zıplama Destekli', 'Piksel Elmasları: +15 Puan', 'Hız sürekli artar!']
      }
    }
  },
  en: {
    headerTitle: 'SUPER BEAR RETRO ARCADE HALL',
    gameCount: '10 DIFFERENT GAMES 🔥',
    gameOfTheDay: 'Game of the Day',
    claimDailyGift: 'Claim Daily Gift! (+150 🍯)',
    tabDaily: "Today's Games (Rotation)",
    tabAll: 'All 10 Arcade Games',
    tabSubtitle: 'New Daily Lineup & 2X Double Rewards!',
    liveScore: 'Live Score',
    changeGame: '◀ Switch Game',
    howToPlay: 'How to Play?',
    gameOver: 'Game Over!',
    highScore: 'High Score',
    points: 'Pts',
    playBtn: 'Start Game',
    playAgainBtn: 'Play Again',
    bonusAdded: '2X Double Rewards Added to Account!',
    footerTitle: '🎁 Daily Arcade Reward System:',
    footerDesc: 'Visit the arcade daily, play the 2X Game of the Day, and collect Honey Coins and Arcade Tokens!',
    closeBtn: 'Close',
    games: {
      honey_rush: {
        title: 'Honey & Gold Rush',
        subtitle: 'Fast Sprint & Hazard Evasion',
        badge: 'Reflex & Speed',
        description: 'Dash as our hero bear, dodge spiky crates and rocks, and collect radiant honey jars and golden combs!',
        rules: ['Space or Click: Jump', 'Honey Jar: +10 Pts', 'Gold Honeycomb: +25 Pts', 'Collision ends game!']
      },
      bubble_jump: {
        title: 'Bubble Jump & Pop',
        subtitle: 'Sky Bubble Trampoline',
        badge: 'Timing & Combo',
        description: 'Bounce upon rising colorful bubbles! Pop bubbles at the perfect instant to ascend into the clouds!',
        rules: ['Left/Right or Mouse: Move', 'Bounce on Bubble: Super Jump', 'Rainbow Bubble: +50 Pts', "Don't fall!"]
      },
      space_invaders: {
        title: 'Galactic Bear Invaders',
        subtitle: 'Cosmic Arcade & Laser War',
        badge: 'Cosmic Battle',
        description: 'Pilot your starfighter and obliterate invading alien swarms and giant UFO bosses with rapid laser strikes!',
        rules: ['Mouse or Left/Right: Move', 'Space or Click: Fire Laser', 'Alien Bee: +20 Pts', 'UFO Boss: +60 Pts']
      },
      flappy_bear: {
        title: 'Flappy Honey Bear',
        subtitle: 'Wing Flap & Hive Navigation',
        badge: 'Skill & Flight',
        description: 'Flap tiny fairy wings through tight honey pillars and bamboo towers to achieve maximum flight distance!',
        rules: ['Click or Space: Flap Wings', 'Clear Obstacle: +10 Pts', 'Center Honey: +25 Pts', 'Avoid ground and pipes!']
      },
      brick_breaker: {
        title: 'Honey Brick Breaker',
        subtitle: 'Classic Arkanoid & Energy Sphere',
        badge: 'Retro Breaker',
        description: 'Command the bottom paddle, rebound energy spheres, and shatter colorful sugar bricks and honey blocks!',
        rules: ['Mouse or Left/Right: Move Paddle', 'Break Brick: +15 Pts', 'Clear Screen: +200 Bonus', "Don't drop ball!"]
      },
      bear_snake: {
        title: 'Pixel Strawberry Snake',
        subtitle: 'Legendary Snake & Fruit Feast',
        badge: 'Nostalgic Snake',
        description: 'The nostalgic classic! Devour ripe berries, avoid your ever-growing tail and boundary walls to score big!',
        rules: ['Arrow Keys or WASD: Turn', 'Strawberry: +10 Pts & Grow', 'Golden Pineapple: +50 Pts', 'Avoid tail!']
      },
      meteor_dodge: {
        title: 'Meteor Shower Dodge',
        subtitle: 'Fiery Asteroids & Survival',
        badge: 'Survival',
        description: 'Evade raining molten asteroids from deep space and collect glowing stardust diamonds to survive!',
        rules: ['Mouse or Left/Right: Dodge', 'Cosmic Diamond: +25 Pts', 'Each Second Survived: +3 Pts', 'Dodge meteors!']
      },
      whack_mole: {
        title: 'Whack-a-Thief & Mole',
        subtitle: 'Fast Reflex Target Arena',
        badge: 'Fast Reflex',
        description: 'Rapidly strike mischievous thieves popping out of honey barrels and tree hollows before they vanish!',
        rules: ['Click Thief Quickly', 'Normal Thief: +20 Pts', 'Golden Queen: +50 Pts', 'Time: 30 Seconds']
      },
      target_blaster: {
        title: 'Target Blaster & Shooting Range',
        subtitle: 'Aim & Bullseye Mastery',
        badge: 'Precision & Focus',
        description: 'Aim and shoot moving targets, golden bonus balloons, and flying acorns before time expires!',
        rules: ['Click Target: Hit', 'Bullseye Center: +30 Pts', 'Golden Balloon: +50 Pts & +3s', 'Time: 30 Seconds']
      },
      retro_runner: {
        title: '8-Bit Pixel Runner',
        subtitle: 'Classic Chiptune Obstacle Race',
        badge: 'Chiptune Classic',
        description: 'A nostalgic retro pixel run! Leap across accelerating platforms and leap over pits to run the furthest!',
        rules: ['Space or Click: Jump', 'Double Jump Supported', 'Pixel Diamond: +15 Pts', 'Speed accelerates!']
      }
    }
  },
  es: {
    headerTitle: 'SALÓN RETRO ARCADE SUPER BEAR',
    gameCount: '10 JUEGOS DIFERENTES 🔥',
    gameOfTheDay: 'Juego del Día',
    claimDailyGift: '¡Reclamar Regalo Diario! (+150 🍯)',
    tabDaily: 'Juegos de Hoy (Rotación)',
    tabAll: 'Los 10 Juegos Arcade',
    tabSubtitle: '¡Nuevos Juegos Diarios y 2X Recompensa Doble!',
    liveScore: 'Puntuación',
    changeGame: '◀ Cambiar Juego',
    howToPlay: '¿Cómo Jugar?',
    gameOver: '¡Juego Terminado!',
    highScore: 'Récord',
    points: 'Pts',
    playBtn: 'Iniciar Juego',
    playAgainBtn: 'Jugar de Nuevo',
    bonusAdded: '¡Doble Recompensa 2X Agregada!',
    footerTitle: '🎁 Sistema de Premios Arcade:',
    footerDesc: '¡Visita el salón a diario, juega al Juego 2X y acumula monedas de miel y fichas arcade!',
    closeBtn: 'Cerrar',
    games: {
      honey_rush: {
        title: 'Carrera de Miel y Oro',
        subtitle: 'Sprint Rápido y Evasión',
        badge: 'Reflejo y Velocidad',
        description: '¡Corre con nuestro oso, esquiva cajas con púas y rocas, y recoge miel y panales dorados!',
        rules: ['Espacio o Clic: Saltar', 'Tarro de Miel: +10 Pts', 'Panal Dorado: +25 Pts', '¡Chocar termina el juego!']
      },
      bubble_jump: {
        title: 'Salto y Estallido de Burbujas',
        subtitle: 'Trampolín Celestial',
        badge: 'Tiempo y Combo',
        description: '¡Rebota sobre las burbujas de colores y elévate hasta las nubes celestiales!',
        rules: ['Teclas Izq/Der o Ratón: Moverse', 'Pisar Burbuja: Súper Salto', 'Burbuja Arcoíris: +50 Pts', '¡No caigas!']
      },
      space_invaders: {
        title: 'Invasores Galácticos',
        subtitle: 'Batalla Láser Espacial',
        badge: 'Guerra Cósmica',
        description: '¡Pilota tu nave espacial y destruye las hordas alienígenas y jefes OVNI con disparos láser!',
        rules: ['Ratón o Izq/Der: Mover', 'Espacio o Clic: Disparar', 'Abeja Alien: +20 Pts', 'Jefe OVNI: +60 Pts']
      },
      flappy_bear: {
        title: 'Oso Volador de Miel',
        subtitle: 'Vuelo y Esquive de Obstáculos',
        badge: 'Habilidad y Vuelo',
        description: '¡Aletea a través de columnas de miel y tubos de bambú para alcanzar la máxima distancia!',
        rules: ['Clic o Espacio: Aletear', 'Superar Obstáculo: +10 Pts', 'Miel Central: +25 Pts', '¡Evita chocar!']
      },
      brick_breaker: {
        title: 'Rompe Ladrillos de Miel',
        subtitle: 'Arkanoid Clásico y Bola de Energía',
        badge: 'Retro Rompedor',
        description: '¡Controla la pala, rebota la esfera de energía y destruye ladrillos dulces!',
        rules: ['Ratón o Flechas: Mover Pala', 'Ladrillo Roto: +15 Pts', 'Pantalla Limpia: +200 Bonus', '¡No dejes caer la bola!']
      },
      bear_snake: {
        title: 'Serpiente Come Fresas',
        subtitle: 'Serpiente Legendaria y Frutas',
        badge: 'Serpiente Nostálgica',
        description: '¡El clásico arcade! Come fresas, evita tu propia cola creciente y rompe tu récord.',
        rules: ['Flechas o WASD: Girar', 'Fresa: +10 Pts y Crecer', 'Piña Dorada: +50 Pts', '¡No choques tu cola!']
      },
      meteor_dodge: {
        title: 'Esquiva de Meteoros',
        subtitle: 'Asteroides y Supervivencia',
        badge: 'Supervivencia',
        description: '¡Esquiva los meteoros ardientes del espacio exterior y recoge diamantes estelares!',
        rules: ['Ratón o Izq/Der: Esquivar', 'Diamante Cósmico: +25 Pts', 'Por Segundo Vivo: +3 Pts', '¡Esquiva meteoros!']
      },
      whack_mole: {
        title: 'Golpea al Ladrón y Topo',
        subtitle: 'Reflejos y Clics Rápidos',
        badge: 'Reflejo Rápido',
        description: '¡Golpea a los traviesos ladrones que asoman la cabeza por los barriles de miel!',
        rules: ['Clic Rápido al Ladrón', 'Ladrón Normal: +20 Pts', 'Reina Dorada: +50 Pts', 'Tiempo: 30 Segundos']
      },
      target_blaster: {
        title: 'Tiro al Blanco y Polígono',
        subtitle: 'Puntería y Diana',
        badge: 'Puntería y Enfoque',
        description: '¡Apunta y dispara a las dianas móviles, globos dorados y bellotas voladoras!',
        rules: ['Clic en Diana: Acertar', 'Centro Diana: +30 Pts', 'Globo Dorado: +50 Pts y +3s', 'Tiempo: 30 Segundos']
      },
      retro_runner: {
        title: 'Corredor 8-Bit Pixel',
        subtitle: 'Carrera Chiptune Clásica',
        badge: 'Clásico Chiptune',
        description: '¡Salta en plataformas aceleradas y supera abismos en este nostálgico juego pixelado!',
        rules: ['Espacio o Clic: Saltar', 'Doble Salto Disponible', 'Diamante Pixel: +15 Pts', '¡La velocidad aumenta!']
      }
    }
  },
  de: {
    headerTitle: 'SUPER BÄR RETRO-ARCADE-HALLE',
    gameCount: '10 VERSCHIEDENE SPIELE 🔥',
    gameOfTheDay: 'Spiel des Tages',
    claimDailyGift: 'Tagesbelohnung abholen! (+150 🍯)',
    tabDaily: 'Heutige Spiele (Rotation)',
    tabAll: 'Alle 10 Arcade-Spiele',
    tabSubtitle: 'Täglich neue Spiele & 2X Doppel-Belohnung!',
    liveScore: 'Live-Punktestand',
    changeGame: '◀ Spiel Wechseln',
    howToPlay: 'Spielanleitung',
    gameOver: 'Spiel Vorbei!',
    highScore: 'Bester Punktestand',
    points: 'Pkt',
    playBtn: 'Spiel Starten',
    playAgainBtn: 'Erneut Spielen',
    bonusAdded: '2X Doppel-Belohnung Gutgeschrieben!',
    footerTitle: '🎁 Tägliches Arcade-Belohnungssystem:',
    footerDesc: 'Besuche die Spielhalle täglich, spiele das 2X-Spiel und sammle Honigmünzen und Arcade-Tokens!',
    closeBtn: 'Schließen',
    games: {
      honey_rush: {
        title: 'Honig- & Gold-Rausch',
        subtitle: 'Schneller Sprint & Hindernislauf',
        badge: 'Reflex & Tempo',
        description: 'Rase mit unserem Bären, weiche Stachelkisten aus und sammle goldene Honigwaben!',
        rules: ['Leertaste oder Klick: Springen', 'Honigtopf: +10 Pkt', 'Goldwabe: +25 Pkt', 'Kollision beendet das Spiel!']
      },
      bubble_jump: {
        title: 'Blasensprung & Platzen',
        subtitle: 'Himmelsblasen-Trampolin',
        badge: 'Timing & Kombo',
        description: 'Springe auf aufsteigende Seifenblasen und klettere empor bis in die Wolken!',
        rules: ['Pfeiltasten oder Maus: Bewegen', 'Auf Blase springen: Super-Sprung', 'Regenbogenblase: +50 Pkt', 'Nicht abstürzen!']
      },
      space_invaders: {
        title: 'Galaktische Bären-Invasoren',
        subtitle: 'Kosmischer Laser-Krieg',
        badge: 'Weltraum-Schlacht',
        description: 'Steuere dein Raumschiff und vernichte feindliche Alien-Scharen mit Lasern!',
        rules: ['Maus oder Links/Rechts: Bewegen', 'Leertaste/Klick: Schießen', 'Alien-Biene: +20 Pkt', 'UFO-Boss: +60 Pkt']
      },
      flappy_bear: {
        title: 'Fliegender Honigbär',
        subtitle: 'Flügelschlag & Hindernisflug',
        badge: 'Geschick & Flug',
        description: 'Schlage mit den Feenflügeln und gleite durch enge Honigsäulen und Bambusrohre!',
        rules: ['Klick oder Leertaste: Flügelschlag', 'Hindernis passieren: +10 Pkt', 'Mittel-Honig: +25 Pkt', 'Nicht anstoßen!']
      },
      brick_breaker: {
        title: 'Honigziegel-Brecher',
        subtitle: 'Klassischer Arkanoid-Brecher',
        badge: 'Retro-Brecher',
        description: 'Lenke das Paddel, reflektiere die Energiekugel und zerschlage bunte Zuckerziegel!',
        rules: ['Maus oder Pfeiltasten: Paddel', 'Ziegel zerstört: +15 Pkt', 'Feld geräumt: +200 Bonus', 'Ball nicht fallen lassen!']
      },
      bear_snake: {
        title: 'Pixel-Erdbeer-Schlange',
        subtitle: 'Legendäre Schlange & Früchte',
        badge: 'Retro-Schlange',
        description: 'Der Klassiker! Sammle Erdbeeren, weiche deinem langen Schwanz aus und hole den Rekord!',
        rules: ['Pfeiltasten oder WASD: Lenken', 'Erdbeere: +10 Pkt & Wachsen', 'Gold-Ananas: +50 Pkt', 'Schwanz meiden!']
      },
      meteor_dodge: {
        title: 'Meteoriten-Ausweichen',
        subtitle: 'Glühende Asteroiden & Überleben',
        badge: 'Überleben',
        description: 'Weiche herabregnenden Lavameteoriten aus und sammle glitzernde Sternendiamanten!',
        rules: ['Maus oder Links/Rechts: Ausweichen', 'Kosmischer Diamant: +25 Pkt', 'Überlebte Sekunde: +3 Pkt', 'Meteoren ausweichen!']
      },
      whack_mole: {
        title: 'Hau-den-Maulwurf & Dieb',
        subtitle: 'Schnelle Reflexe & Zielklicks',
        badge: 'Schneller Reflex',
        description: 'Treffe die frechen Diebe, die aus den Honigfässern hervorschauen, bevor sie entkommen!',
        rules: ['Schnell auf Dieb klicken', 'Normaler Dieb: +20 Pkt', 'Goldene Königin: +50 Pkt', 'Zeit: 30 Sekunden']
      },
      target_blaster: {
        title: 'Zielschießen & Schießstand',
        subtitle: 'Zielen & Volltreffer',
        badge: 'Präzision & Fokus',
        description: 'Triff bewegliche Zielscheiben, goldene Bonusballons und Eicheln in der Zeit!',
        rules: ['Klick auf Ziel: Treffer', 'Zentrum / Bullseye: +30 Pkt', 'Goldballon: +50 Pkt & +3s', 'Zeit: 30 Sekunden']
      },
      retro_runner: {
        title: '8-Bit Pixel-Läufer',
        subtitle: 'Klassischer Chiptune-Hindernislauf',
        badge: 'Chiptune-Klassiker',
        description: 'Nostalgischer Pixel-Sprint! Springe über Plattformen und Schluchten für die weiteste Distanz!',
        rules: ['Leertaste oder Klick: Springen', 'Doppelsprung verfügbar', 'Pixel-Diamant: +15 Pkt', 'Tempo steigt ständig!']
      }
    }
  },
  it: {
    headerTitle: 'SALA RETRO ARCADE SUPER BEAR',
    gameCount: '10 GIOCHI DIVERSI 🔥',
    gameOfTheDay: 'Gioco del Giorno',
    claimDailyGift: 'Riscatta Regalo del Giorno! (+150 🍯)',
    tabDaily: 'Giochi di Oggi (Rotazione)',
    tabAll: 'Tutti i 10 Giochi Arcade',
    tabSubtitle: 'Nuovi Giochi Ogni Giorno & 2X Doppia Ricompensa!',
    liveScore: 'Punteggio',
    changeGame: '◀ Cambia Gioco',
    howToPlay: 'Come Giocare?',
    gameOver: 'Partita Finita!',
    highScore: 'Punteggio Più Alto',
    points: 'Pti',
    playBtn: 'Inizia Partita',
    playAgainBtn: 'Gioca Ancora',
    bonusAdded: '2X Doppia Ricompensa Aggiunta!',
    footerTitle: '🎁 Sistema Premi Arcade Giornaliero:',
    footerDesc: 'Visita la sala giochi ogni giorno, gioca al Gioco 2X e raccogli monete di miele e gettoni arcade!',
    closeBtn: 'Chiudi',
    games: {
      honey_rush: {
        title: 'Corsa di Miele & Oro',
        subtitle: 'Sprint Rapido & Schivata',
        badge: 'Riflessi & Velocità',
        description: 'Corri col nostro orso, schiva casse con spine e rocce, e raccogli vasi di miele e favi d’oro!',
        rules: ['Spazio o Clic: Salta', 'Vaso di Miele: +10 Pti', 'Favo Dorato: +25 Pti', 'Gli impatti terminano il gioco!']
      },
      bubble_jump: {
        title: 'Salto e Scoppio di Bolle',
        subtitle: 'Trampolino Celeste',
        badge: 'Tempismo & Combo',
        description: 'Rimbalza sulle bolle d’acqua colorate e sali verso le nuvole celesti!',
        rules: ['Tasti Sin/Des o Mouse: Muoviti', 'Salta sulla Bolla: Super Salto', 'Bolla Arcobaleno: +50 Pti', 'Non cadere!']
      },
      space_invaders: {
        title: 'Invasori Galattici',
        subtitle: 'Guerra Laser Cosmica',
        badge: 'Battaglia Spaziale',
        description: 'Pilota la tua astronave e annienta sciami alieni e boss UFO con potenti colpi laser!',
        rules: ['Mouse o Sin/Des: Muovi', 'Spazio o Clic: Spara Laser', 'Ape Aliena: +20 Pti', 'Boss UFO: +60 Pti']
      },
      flappy_bear: {
        title: 'Orso Volante di Miele',
        subtitle: 'Battito d’Ali & Volo tra Colonne',
        badge: 'Abilità & Volo',
        description: 'Batti le ali fatate e plana tra colonne di miele e canne di bambù per volare più lontano possibile!',
        rules: ['Clic o Spazio: Batti le ali', 'Supera Ostacolo: +10 Pti', 'Miele Centrale: +25 Pti', 'Evita il suolo e i tubi!']
      },
      brick_breaker: {
        title: 'Spacca Mattoni di Miele',
        subtitle: 'Arkanoid Classico & Sfera d’Energia',
        badge: 'Retro Breaker',
        description: 'Controlla la racchetta, fai rimbalzare la sfera d’energia e distruggi mattoni di zucchero!',
        rules: ['Mouse o Frecce: Muovi Racchetta', 'Mattone Rotto: +15 Pti', 'Schermo Pulito: +200 Bonus', 'Non far cadere la palla!']
      },
      bear_snake: {
        title: 'Serpente Pixel Mangia Fragole',
        subtitle: 'Serpente Leggendario & Frutta',
        badge: 'Serpente Classico',
        description: 'Il classico arcade! Raccogli fragole, evita la coda che cresce sempre di più e fai il record!',
        rules: ['Frecce o WASD: Direzione', 'Fragola: +10 Pti & Cresci', 'Ananas d’Oro: +50 Pti', 'Evita la coda!']
      },
      meteor_dodge: {
        title: 'Schiva Pioggia di Meteore',
        subtitle: 'Asteroidi Infuocati & Sopravvivenza',
        badge: 'Sopravvivenza',
        description: 'Schiva i meteoriti infuocati che cadono dallo spazio e raccogli diamanti stellari!',
        rules: ['Mouse o Sin/Des: Schiva', 'Diamante Cosmico: +25 Pti', 'Ogni Secondo Vivo: +3 Pti', 'Schiva le meteore!']
      },
      whack_mole: {
        title: 'Colpisci la Talpa e il Ladro',
        subtitle: 'Riflessi Rapidi & Bersagli',
        badge: 'Riflessi Veloci',
        description: 'Colpisci rapidamente i ladruncoli che spuntano dai barili di miele prima che scappino!',
        rules: ['Clic Rapido sul Ladro', 'Ladro Normale: +20 Pti', 'Regina Dorata: +50 Pti', 'Tempo: 30 Secondi']
      },
      target_blaster: {
        title: 'Tiro a Segno & Bersagli',
        subtitle: 'Mira & Centro Perfetto',
        badge: 'Precisione & Mira',
        description: 'Mira e spara ai bersagli in movimento, ai palloncini dorati e alle ghiande prima dello scadere del tempo!',
        rules: ['Clic sul Bersaglio: Colpisci', 'Centro Bersaglio: +30 Pti', 'Palloncino d’Oro: +50 Pti & +3s', 'Tempo: 30 Secondi']
      },
      retro_runner: {
        title: 'Corridore 8-Bit Pixel',
        subtitle: 'Corsa a Ostacoli Chiptune',
        badge: 'Classico Chiptune',
        description: 'Corsa pixel retrò! Salta su piattaforme sempre più veloci e supera i baratri!',
        rules: ['Spazio o Clic: Salta', 'Doppio Salto Disponibile', 'Diamante Pixel: +15 Pti', 'La velocità aumenta!']
      }
    }
  }
};

export const BASE_ARCADE_GAMES_LIST: { id: ArcadeGameId; icon: string; themeColor: string }[] = [
  { id: 'honey_rush', icon: '🍯', themeColor: 'from-amber-500 to-yellow-600' },
  { id: 'bubble_jump', icon: '🫧', themeColor: 'from-cyan-500 to-blue-600' },
  { id: 'space_invaders', icon: '🚀', themeColor: 'from-violet-600 to-fuchsia-600' },
  { id: 'flappy_bear', icon: '🐝', themeColor: 'from-yellow-500 to-amber-600' },
  { id: 'brick_breaker', icon: '🧱', themeColor: 'from-pink-500 to-rose-600' },
  { id: 'bear_snake', icon: '🐍', themeColor: 'from-emerald-500 to-teal-600' },
  { id: 'meteor_dodge', icon: '☄️', themeColor: 'from-orange-500 to-red-600' },
  { id: 'whack_mole', icon: '🦔', themeColor: 'from-lime-500 to-green-600' },
  { id: 'target_blaster', icon: '🎯', themeColor: 'from-rose-500 to-red-600' },
  { id: 'retro_runner', icon: '👾', themeColor: 'from-purple-500 to-indigo-600' }
];

export function getLocalizedArcadeGames(lang: string): ArcadeGameMeta[] {
  const trans = ARCADE_TRANSLATIONS[lang] || ARCADE_TRANSLATIONS.tr;
  return BASE_ARCADE_GAMES_LIST.map(base => {
    const gTrans = trans.games[base.id] || ARCADE_TRANSLATIONS.tr.games[base.id];
    return {
      id: base.id,
      icon: base.icon,
      themeColor: base.themeColor,
      title: gTrans.title,
      subtitle: gTrans.subtitle,
      accentBadge: gTrans.badge,
      description: gTrans.description,
      rules: gTrans.rules
    };
  });
}

export const ArcadeGamesModal: React.FC<ArcadeGamesModalProps> = ({
  isOpen,
  onClose,
  onRewardEarned
}) => {
  const { language } = useLanguage();
  const [selectedGame, setSelectedGame] = useState<ArcadeGameId>('space_invaders');
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [activeTab, setActiveTab] = useState<'daily' | 'all' | 'rewards'>('daily');
  const [dailyClaimed, setDailyClaimed] = useState(false);

  const t = ARCADE_TRANSLATIONS[language] || ARCADE_TRANSLATIONS.tr;
  const allLocalizedGames = getLocalizedArcadeGames(language);

  // Daily seed calculations
  const now = new Date();
  const todayDayNumber = Math.floor((now.getTime() - new Date(2026, 0, 1).getTime()) / 86400000);
  const dateLocaleMap: Record<string, string> = {
    tr: 'tr-TR',
    en: 'en-US',
    es: 'es-ES',
    de: 'de-DE',
    it: 'it-IT'
  };
  const todayDateStr = new Intl.DateTimeFormat(dateLocaleMap[language] || 'tr-TR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }).format(now);

  // Today's featured Game of the Day (2x bonus rewards!)
  const featuredGameIndex = Math.abs(todayDayNumber) % allLocalizedGames.length;
  const featuredGame = allLocalizedGames[featuredGameIndex];

  // Daily 4-game rotation lineup
  const dailyRotationGames = [
    allLocalizedGames[featuredGameIndex],
    allLocalizedGames[(featuredGameIndex + 2) % allLocalizedGames.length],
    allLocalizedGames[(featuredGameIndex + 5) % allLocalizedGames.length],
    allLocalizedGames[(featuredGameIndex + 7) % allLocalizedGames.length]
  ];

  const [highScores, setHighScores] = useState<Record<string, number>>({});

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Audio Context helper for arcade sound effects
  const playSound = (freq = 440, type: OscillatorType = 'sine', duration = 0.1) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('super_bear_arcade_highscores');
      if (saved) setHighScores(JSON.parse(saved));

      const lastClaim = localStorage.getItem('sba_arcade_daily_claim_date');
      const todayKey = now.toISOString().slice(0, 10);
      if (lastClaim === todayKey) {
        setDailyClaimed(true);
      }
    } catch (e) {}
  }, [isOpen]);

  const claimDailyReward = () => {
    if (dailyClaimed) return;
    try {
      const todayKey = now.toISOString().slice(0, 10);
      localStorage.setItem('sba_arcade_daily_claim_date', todayKey);
      setDailyClaimed(true);

      const savedCoins = localStorage.getItem('super_bear_coins');
      const curCoins = savedCoins ? parseInt(savedCoins, 10) : 0;
      const nextCoins = curCoins + 150;
      localStorage.setItem('super_bear_coins', nextCoins.toString());

      const savedTokens = localStorage.getItem('super_bear_arcade_tokens');
      const curTokens = savedTokens ? parseInt(savedTokens, 10) : 0;
      localStorage.setItem('super_bear_arcade_tokens', (curTokens + 5).toString());

      if (typeof window !== 'undefined' && (window as any).__superBearSaveManager) {
        (window as any).__superBearSaveManager.updateGold(nextCoins);
      }
      window.dispatchEvent(new CustomEvent('superbear:coins-updated', { detail: { coins: nextCoins } }));
      playSound(587.33, 'triangle', 0.25);
    } catch (e) {}
  };

  const recordScore = (finalScore: number) => {
    setScore(finalScore);
    setGameOver(true);
    setIsPlaying(false);

    setHighScores(prev => {
      const currentHigh = prev[selectedGame] || 0;
      if (finalScore > currentHigh) {
        const nextScores = { ...prev, [selectedGame]: finalScore };
        try {
          localStorage.setItem('super_bear_arcade_highscores', JSON.stringify(nextScores));
        } catch (e) {}
        return nextScores;
      }
      return prev;
    });

    // 2X Bonus if today's featured game!
    const isTodayFeatured = selectedGame === featuredGame.id;
    const multiplier = isTodayFeatured ? 2 : 1;
    const earnedCoins = Math.max(10, Math.floor((finalScore / 2) * multiplier));
    const earnedTokens = Math.max(2, Math.floor((finalScore / 12) * multiplier));

    try {
      const savedCoins = localStorage.getItem('super_bear_coins');
      const curCoins = savedCoins ? parseInt(savedCoins, 10) : 0;
      const nextCoins = curCoins + earnedCoins;
      localStorage.setItem('super_bear_coins', nextCoins.toString());

      const savedTokens = localStorage.getItem('super_bear_arcade_tokens');
      const curTokens = savedTokens ? parseInt(savedTokens, 10) : 0;
      localStorage.setItem('super_bear_arcade_tokens', (curTokens + earnedTokens).toString());

      if (typeof window !== 'undefined' && (window as any).__superBearSaveManager) {
        (window as any).__superBearSaveManager.updateGold(nextCoins);
      }
      window.dispatchEvent(new CustomEvent('superbear:coins-updated', { detail: { coins: nextCoins } }));
    } catch (e) {}

    if (onRewardEarned) {
      onRewardEarned(earnedCoins, earnedTokens);
    }
  };

  // MINI-GAME ENGINE DISPATCH
  useEffect(() => {
    if (!isPlaying) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 680;
    canvas.height = 380;
    const width = canvas.width;
    const height = canvas.height;

    let active = true;

    // --- 1: HONEY RUSH ---
    if (selectedGame === 'honey_rush') {
      let px = 60;
      let py = height - 60;
      let pVy = 0;
      let isGrounded = true;
      let currentScore = 0;
      let obstacles: { x: number; w: number; h: number; type: 'spike' | 'box' }[] = [];
      let items: { x: number; y: number; type: 'jar' | 'comb'; collected?: boolean }[] = [];
      let speed = 5.2;
      let frame = 0;

      const jump = () => {
        if (isGrounded) {
          pVy = -11.5;
          isGrounded = false;
          playSound(440, 'triangle', 0.1);
        }
      };

      const handleKey = (e: KeyboardEvent) => {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
          e.preventDefault();
          jump();
        }
      };
      window.addEventListener('keydown', handleKey);
      canvas.onclick = jump;

      const loop = () => {
        if (!active) return;
        frame++;
        ctx.clearRect(0, 0, width, height);

        // Ground & Sky
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#334155';
        ctx.fillRect(0, height - 30, width, 30);

        // Physics
        pVy += 0.6;
        py += pVy;
        if (py >= height - 60) {
          py = height - 60;
          pVy = 0;
          isGrounded = true;
        }

        // Spawn
        if (frame % 75 === 0) {
          obstacles.push({
            x: width + 20,
            w: 24,
            h: 28 + Math.random() * 15,
            type: Math.random() < 0.5 ? 'spike' : 'box'
          });
        }
        if (frame % 90 === 0) {
          items.push({
            x: width + 20,
            y: height - 80 - Math.random() * 70,
            type: Math.random() < 0.3 ? 'comb' : 'jar'
          });
        }

        // Draw Bear
        ctx.font = '32px sans-serif';
        ctx.fillText('🐻', px - 12, py + 24);

        // Obstacles
        for (let i = obstacles.length - 1; i >= 0; i--) {
          const obs = obstacles[i];
          obs.x -= speed;
          ctx.fillStyle = obs.type === 'spike' ? '#ef4444' : '#b45309';
          ctx.fillRect(obs.x, height - 30 - obs.h, obs.w, obs.h);

          if (obs.x < px + 22 && obs.x + obs.w > px - 5 && py + 24 > height - 30 - obs.h) {
            active = false;
            recordScore(currentScore);
            return;
          }
          if (obs.x < -40) obstacles.splice(i, 1);
        }

        // Items
        for (let i = items.length - 1; i >= 0; i--) {
          const it = items[i];
          it.x -= speed;
          ctx.font = '22px sans-serif';
          ctx.fillText(it.type === 'jar' ? '🍯' : '🐝', it.x, it.y);

          if (Math.hypot(px - it.x, py - it.y) < 32) {
            const pts = it.type === 'comb' ? 25 : 10;
            currentScore += pts;
            setScore(currentScore);
            playSound(it.type === 'comb' ? 659 : 523, 'sine', 0.1);
            items.splice(i, 1);
          }
          if (it.x < -30) items.splice(i, 1);
        }

        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`🍯 Skor: ${currentScore}`, 20, 36);

        animFrameIdRef.current = requestAnimationFrame(loop);
      };
      loop();

      return () => {
        active = false;
        window.removeEventListener('keydown', handleKey);
      };
    }

    // --- 2: BUBBLE JUMP ---
    else if (selectedGame === 'bubble_jump') {
      let bearX = width / 2;
      let bearY = height - 80;
      let bearVy = -7;
      let currentScore = 0;
      let bubbles: { x: number; y: number; r: number; color: string; isGold?: boolean }[] = [];

      for (let i = 0; i < 7; i++) {
        bubbles.push({
          x: 60 + Math.random() * (width - 120),
          y: 60 + i * 50,
          r: 28,
          color: i % 2 === 0 ? '#38bdf8' : '#a855f7',
          isGold: i === 0
        });
      }

      const handleMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        bearX = ((e.clientX - rect.left) / rect.width) * width;
      };
      canvas.addEventListener('mousemove', handleMove);

      const loop = () => {
        if (!active) return;
        ctx.clearRect(0, 0, width, height);

        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, '#0284c7');
        skyGrad.addColorStop(1, '#0f172a');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        bearVy += 0.28;
        bearY += bearVy;

        bubbles.forEach(b => {
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fillStyle = b.isGold ? 'rgba(250, 204, 21, 0.45)' : 'rgba(56, 189, 248, 0.35)';
          ctx.fill();
          ctx.strokeStyle = b.isGold ? '#facc15' : '#7dd3fc';
          ctx.lineWidth = 3;
          ctx.stroke();

          if (bearVy > 0 && Math.hypot(bearX - b.x, bearY - b.y) < b.r + 14) {
            bearVy = -9.5;
            const pts = b.isGold ? 30 : 10;
            currentScore += pts;
            setScore(currentScore);
            playSound(520, 'sine', 0.1);

            b.y = Math.random() * 30 - 20;
            b.x = 40 + Math.random() * (width - 80);
            b.isGold = Math.random() < 0.25;
          }
        });

        if (bearY < 120) {
          const diff = 120 - bearY;
          bearY = 120;
          bubbles.forEach(b => {
            b.y += diff;
            if (b.y > height + 20) {
              b.y = -20;
              b.x = 40 + Math.random() * (width - 80);
            }
          });
        }

        ctx.font = '36px sans-serif';
        ctx.fillText('🐻', bearX - 18, bearY);

        if (bearY > height + 30) {
          active = false;
          recordScore(currentScore);
          return;
        }

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`🫧 Baloncuk Skoru: ${currentScore}`, 20, 36);

        animFrameIdRef.current = requestAnimationFrame(loop);
      };
      loop();

      return () => {
        active = false;
        canvas.removeEventListener('mousemove', handleMove);
      };
    }

    // --- 3: SPACE INVADERS (GALAGA STYLE) ---
    else if (selectedGame === 'space_invaders') {
      let playerX = width / 2;
      let playerVx = 0;
      let bullets: { x: number; y: number }[] = [];
      let enemies: { x: number; y: number; alive: boolean; isUfo?: boolean }[] = [];
      let enemyVx = 1.4;
      let currentScore = 0;
      let fireCooldown = 0;

      // Spawn fleet
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 7; c++) {
          enemies.push({
            x: 90 + c * 75,
            y: 50 + r * 45,
            alive: true,
            isUfo: r === 0 && c === 3
          });
        }
      }

      const handleMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        playerX = ((e.clientX - rect.left) / rect.width) * width;
      };
      const shoot = () => {
        if (fireCooldown <= 0) {
          bullets.push({ x: playerX, y: height - 55 });
          fireCooldown = 12;
          playSound(650, 'sawtooth', 0.08);
        }
      };

      canvas.addEventListener('mousemove', handleMove);
      canvas.addEventListener('click', shoot);
      const handleKey = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
          e.preventDefault();
          shoot();
        }
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') playerVx = -5;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') playerVx = 5;
      };
      const handleKeyUp = (e: KeyboardEvent) => {
        if (['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD'].includes(e.code)) playerVx = 0;
      };
      window.addEventListener('keydown', handleKey);
      window.addEventListener('keyup', handleKeyUp);

      const loop = () => {
        if (!active) return;
        ctx.clearRect(0, 0, width, height);
        if (fireCooldown > 0) fireCooldown--;

        playerX += playerVx;
        playerX = Math.max(30, Math.min(width - 30, playerX));

        // Space background
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, width, height);

        // Move Enemies
        let hitEdge = false;
        enemies.forEach(e => {
          if (e.alive) {
            e.x += enemyVx;
            if (e.x < 30 || e.x > width - 30) hitEdge = true;
          }
        });
        if (hitEdge) {
          enemyVx *= -1.05;
          enemies.forEach(e => {
            if (e.alive) e.y += 18;
          });
        }

        // Bullets
        ctx.fillStyle = '#38bdf8';
        for (let i = bullets.length - 1; i >= 0; i--) {
          const b = bullets[i];
          b.y -= 7.5;
          ctx.fillRect(b.x - 2, b.y - 8, 4, 16);

          // Hit enemies
          for (const e of enemies) {
            if (e.alive && Math.hypot(b.x - e.x, b.y - e.y) < 22) {
              e.alive = false;
              bullets.splice(i, 1);
              const pts = e.isUfo ? 60 : 20;
              currentScore += pts;
              setScore(currentScore);
              playSound(e.isUfo ? 880 : 350, 'triangle', 0.12);
              break;
            }
          }
          if (b.y < -20) bullets.splice(i, 1);
        }

        // Draw enemies
        let livingCount = 0;
        enemies.forEach(e => {
          if (e.alive) {
            livingCount++;
            ctx.font = '26px sans-serif';
            ctx.fillText(e.isUfo ? '🛸' : '👾', e.x - 13, e.y + 10);

            // Reached bottom?
            if (e.y >= height - 70) {
              active = false;
              recordScore(currentScore);
              return;
            }
          }
        });

        // Respawn wave if all dead
        if (livingCount === 0) {
          currentScore += 100;
          setScore(currentScore);
          enemies.forEach((e, idx) => {
            e.alive = true;
            e.y = 50 + Math.floor(idx / 7) * 45;
          });
          enemyVx = 1.6;
        }

        // Draw player spaceship
        ctx.font = '34px sans-serif';
        ctx.fillText('🚀', playerX - 17, height - 35);

        ctx.fillStyle = '#a855f7';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`🚀 Galaksi Skoru: ${currentScore}`, 20, 36);

        animFrameIdRef.current = requestAnimationFrame(loop);
      };
      loop();

      return () => {
        active = false;
        canvas.removeEventListener('mousemove', handleMove);
        canvas.removeEventListener('click', shoot);
        window.removeEventListener('keydown', handleKey);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }

    // --- 4: FLAPPY BEAR ---
    else if (selectedGame === 'flappy_bear') {
      let bearY = height / 2;
      let bearVy = 0;
      let currentScore = 0;
      let pipes: { x: number; topH: number; bottomY: number; passed?: boolean }[] = [];
      let frame = 0;

      const flap = () => {
        bearVy = -6.5;
        playSound(480, 'sine', 0.08);
      };
      canvas.onclick = flap;
      const handleKey = (e: KeyboardEvent) => {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
          e.preventDefault();
          flap();
        }
      };
      window.addEventListener('keydown', handleKey);

      const loop = () => {
        if (!active) return;
        frame++;
        ctx.clearRect(0, 0, width, height);

        // Sky & Honey Pillars
        ctx.fillStyle = '#065f46';
        ctx.fillRect(0, 0, width, height);

        bearVy += 0.32;
        bearY += bearVy;

        if (frame % 85 === 0) {
          const gap = 110;
          const topH = 40 + Math.random() * (height - gap - 90);
          pipes.push({
            x: width + 20,
            topH,
            bottomY: topH + gap
          });
        }

        // Draw pipes
        for (let i = pipes.length - 1; i >= 0; i--) {
          const p = pipes[i];
          p.x -= 3.2;

          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(p.x, 0, 48, p.topH);
          ctx.fillRect(p.x, p.bottomY, 48, height - p.bottomY);

          // Collision
          const bearX = 100;
          if (bearX + 14 > p.x && bearX - 14 < p.x + 48) {
            if (bearY - 12 < p.topH || bearY + 12 > p.bottomY) {
              active = false;
              recordScore(currentScore);
              return;
            }
          }

          if (!p.passed && p.x + 48 < bearX) {
            p.passed = true;
            currentScore += 10;
            setScore(currentScore);
            playSound(600, 'triangle', 0.1);
          }

          if (p.x < -60) pipes.splice(i, 1);
        }

        // Bear with wings
        ctx.font = '32px sans-serif';
        ctx.fillText('🐻', 85, bearY + 10);

        if (bearY > height + 20 || bearY < -20) {
          active = false;
          recordScore(currentScore);
          return;
        }

        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`🐝 Flappy Skoru: ${currentScore}`, 20, 36);

        animFrameIdRef.current = requestAnimationFrame(loop);
      };
      loop();

      return () => {
        active = false;
        window.removeEventListener('keydown', handleKey);
      };
    }

    // --- 5: BRICK BREAKER ---
    else if (selectedGame === 'brick_breaker') {
      let paddleX = width / 2 - 45;
      let paddleW = 90;
      let ballX = width / 2;
      let ballY = height - 70;
      let ballVx = 3.5 * (Math.random() < 0.5 ? 1 : -1);
      let ballVy = -4.0;
      let currentScore = 0;

      let bricks: { x: number; y: number; w: number; h: number; color: string; alive: boolean }[] = [];
      const colors = ['#f43f5e', '#ec4899', '#a855f7', '#3b82f6'];
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 9; c++) {
          bricks.push({
            x: 35 + c * 68,
            y: 50 + r * 28,
            w: 60,
            h: 20,
            color: colors[r],
            alive: true
          });
        }
      }

      const handleMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const mx = ((e.clientX - rect.left) / rect.width) * width;
        paddleX = Math.max(0, Math.min(width - paddleW, mx - paddleW / 2));
      };
      canvas.addEventListener('mousemove', handleMove);

      const loop = () => {
        if (!active) return;
        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(0, 0, width, height);

        ballX += ballVx;
        ballY += ballVy;

        // Bounce walls
        if (ballX < 10 || ballX > width - 10) {
          ballVx *= -1;
          playSound(300, 'sine', 0.05);
        }
        if (ballY < 10) {
          ballVy *= -1;
          playSound(300, 'sine', 0.05);
        }

        // Paddle hit
        if (ballY + 8 >= height - 35 && ballY - 8 <= height - 20) {
          if (ballX >= paddleX && ballX <= paddleX + paddleW) {
            ballVy = -Math.abs(ballVy);
            const hitRatio = (ballX - (paddleX + paddleW / 2)) / (paddleW / 2);
            ballVx = hitRatio * 5.0;
            playSound(520, 'triangle', 0.08);
          }
        }

        // Bricks hit
        let remaining = 0;
        bricks.forEach(b => {
          if (b.alive) {
            remaining++;
            ctx.fillStyle = b.color;
            ctx.fillRect(b.x, b.y, b.w, b.h);

            if (ballX > b.x && ballX < b.x + b.w && ballY > b.y && ballY < b.y + b.h) {
              b.alive = false;
              ballVy *= -1;
              currentScore += 15;
              setScore(currentScore);
              playSound(660, 'sine', 0.08);
            }
          }
        });

        // Clear bonus
        if (remaining === 0) {
          currentScore += 200;
          setScore(currentScore);
          active = false;
          recordScore(currentScore);
          return;
        }

        // Fell down
        if (ballY > height + 20) {
          active = false;
          recordScore(currentScore);
          return;
        }

        // Draw Paddle
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(paddleX, height - 35, paddleW, 14);

        // Draw Ball
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ec4899';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`🧱 Tuğla Skoru: ${currentScore}`, 20, 36);

        animFrameIdRef.current = requestAnimationFrame(loop);
      };
      loop();

      return () => {
        active = false;
        canvas.removeEventListener('mousemove', handleMove);
      };
    }

    // --- 6: BEAR SNAKE ---
    else if (selectedGame === 'bear_snake') {
      const gridSize = 20;
      let snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
      let dir = { x: 1, y: 0 };
      let food = { x: 15, y: 10, isGold: false };
      let currentScore = 0;
      let frame = 0;

      const spawnFood = () => {
        food = {
          x: Math.floor(Math.random() * (width / gridSize - 2)) + 1,
          y: Math.floor(Math.random() * (height / gridSize - 2)) + 1,
          isGold: Math.random() < 0.25
        };
      };

      const handleKey = (e: KeyboardEvent) => {
        if ((e.code === 'ArrowUp' || e.code === 'KeyW') && dir.y === 0) {
          e.preventDefault(); dir = { x: 0, y: -1 };
        } else if ((e.code === 'ArrowDown' || e.code === 'KeyS') && dir.y === 0) {
          e.preventDefault(); dir = { x: 0, y: 1 };
        } else if ((e.code === 'ArrowLeft' || e.code === 'KeyA') && dir.x === 0) {
          e.preventDefault(); dir = { x: -1, y: 0 };
        } else if ((e.code === 'ArrowRight' || e.code === 'KeyD') && dir.x === 0) {
          e.preventDefault(); dir = { x: 1, y: 0 };
        }
      };
      window.addEventListener('keydown', handleKey);

      const loop = () => {
        if (!active) return;
        frame++;

        // Update every 8 frames
        if (frame % 8 === 0) {
          const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

          // Wall collision
          if (head.x < 0 || head.x >= width / gridSize || head.y < 0 || head.y >= height / gridSize) {
            active = false;
            recordScore(currentScore);
            return;
          }

          // Self collision
          for (const s of snake) {
            if (s.x === head.x && s.y === head.y) {
              active = false;
              recordScore(currentScore);
              return;
            }
          }

          snake.unshift(head);

          // Eat food
          if (head.x === food.x && head.y === food.y) {
            const pts = food.isGold ? 50 : 10;
            currentScore += pts;
            setScore(currentScore);
            playSound(food.isGold ? 780 : 520, 'triangle', 0.1);
            spawnFood();
          } else {
            snake.pop();
          }
        }

        // Draw
        ctx.fillStyle = '#064e3b';
        ctx.fillRect(0, 0, width, height);

        // Draw food
        ctx.font = '20px sans-serif';
        ctx.fillText(food.isGold ? '🍍' : '🍓', food.x * gridSize, (food.y + 1) * gridSize - 2);

        // Draw snake
        snake.forEach((s, idx) => {
          if (idx === 0) {
            ctx.fillText('🐻', s.x * gridSize, (s.y + 1) * gridSize - 2);
          } else {
            ctx.fillStyle = '#10b981';
            ctx.fillRect(s.x * gridSize + 2, s.y * gridSize + 2, gridSize - 4, gridSize - 4);
          }
        });

        ctx.fillStyle = '#a7f3d0';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`🐍 Yılan Skoru: ${currentScore}`, 20, 36);

        animFrameIdRef.current = requestAnimationFrame(loop);
      };
      loop();

      return () => {
        active = false;
        window.removeEventListener('keydown', handleKey);
      };
    }

    // --- 7: METEOR DODGE ---
    else if (selectedGame === 'meteor_dodge') {
      let playerX = width / 2;
      let meteors: { x: number; y: number; r: number; vy: number }[] = [];
      let stars: { x: number; y: number; vy: number }[] = [];
      let currentScore = 0;
      let frame = 0;

      const handleMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        playerX = ((e.clientX - rect.left) / rect.width) * width;
      };
      canvas.addEventListener('mousemove', handleMove);

      const loop = () => {
        if (!active) return;
        frame++;
        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = '#2d0606';
        ctx.fillRect(0, 0, width, height);

        if (frame % 30 === 0) {
          meteors.push({
            x: 20 + Math.random() * (width - 40),
            y: -20,
            r: 16 + Math.random() * 12,
            vy: 4.0 + Math.random() * 3.5
          });
        }
        if (frame % 60 === 0) {
          stars.push({
            x: 20 + Math.random() * (width - 40),
            y: -20,
            vy: 2.8
          });
        }

        // Draw stars
        for (let i = stars.length - 1; i >= 0; i--) {
          const st = stars[i];
          st.y += st.vy;
          ctx.font = '24px sans-serif';
          ctx.fillText('⭐', st.x - 12, st.y);

          if (Math.hypot(playerX - st.x, height - 40 - st.y) < 30) {
            currentScore += 25;
            setScore(currentScore);
            playSound(680, 'sine', 0.1);
            stars.splice(i, 1);
          }
          if (st.y > height + 20) stars.splice(i, 1);
        }

        // Draw meteors
        for (let i = meteors.length - 1; i >= 0; i--) {
          const m = meteors[i];
          m.y += m.vy;
          ctx.font = '28px sans-serif';
          ctx.fillText('☄️', m.x - 14, m.y);

          if (Math.hypot(playerX - m.x, height - 40 - m.y) < m.r + 14) {
            active = false;
            recordScore(currentScore);
            return;
          }
          if (m.y > height + 20) {
            currentScore += 5;
            setScore(currentScore);
            meteors.splice(i, 1);
          }
        }

        // Player Bear
        ctx.font = '34px sans-serif';
        ctx.fillText('🐻', playerX - 17, height - 25);

        ctx.fillStyle = '#f87171';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`☄️ Kaçış Skoru: ${currentScore}`, 20, 36);

        animFrameIdRef.current = requestAnimationFrame(loop);
      };
      loop();

      return () => {
        active = false;
        canvas.removeEventListener('mousemove', handleMove);
      };
    }

    // --- 8: WHACK A MOLE / THIEF ---
    else if (selectedGame === 'whack_mole') {
      let currentScore = 0;
      let timeLeft = 30;
      let holes: { x: number; y: number; hasMole: boolean; isQueen: boolean; moleTimer: number }[] = [];

      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          holes.push({
            x: 160 + c * 180,
            y: 90 + r * 100,
            hasMole: false,
            isQueen: false,
            moleTimer: 0
          });
        }
      }

      const timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          active = false;
          recordScore(currentScore);
        }
      }, 1000);

      const handleClick = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const mx = ((e.clientX - rect.left) / rect.width) * width;
        const my = ((e.clientY - rect.top) / rect.height) * height;

        holes.forEach(h => {
          if (h.hasMole && Math.hypot(mx - h.x, my - (h.y - 10)) < 45) {
            const pts = h.isQueen ? 50 : 20;
            currentScore += pts;
            setScore(currentScore);
            playSound(h.isQueen ? 800 : 450, 'triangle', 0.12);
            h.hasMole = false;
          }
        });
      };
      canvas.addEventListener('click', handleClick);

      let frame = 0;
      const loop = () => {
        if (!active) return;
        frame++;
        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = '#14532d';
        ctx.fillRect(0, 0, width, height);

        // Random popup
        if (frame % 45 === 0) {
          const emptyHoles = holes.filter(h => !h.hasMole);
          if (emptyHoles.length > 0) {
            const chosen = emptyHoles[Math.floor(Math.random() * emptyHoles.length)];
            chosen.hasMole = true;
            chosen.isQueen = Math.random() < 0.25;
            chosen.moleTimer = 65;
          }
        }

        // Draw holes
        holes.forEach(h => {
          ctx.beginPath();
          ctx.ellipse(h.x, h.y + 15, 45, 18, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#052e16';
          ctx.fill();

          if (h.hasMole) {
            h.moleTimer--;
            if (h.moleTimer <= 0) h.hasMole = false;
            ctx.font = '42px sans-serif';
            ctx.fillText(h.isQueen ? '👑🐝' : '🦝', h.x - 22, h.y + 10);
          }
        });

        ctx.fillStyle = '#4ade80';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`🦝 Yakalama: ${currentScore}`, 20, 36);
        ctx.fillStyle = timeLeft < 7 ? '#ef4444' : '#facc15';
        ctx.fillText(`⏱️ Kalan Süre: ${timeLeft}s`, width - 190, 36);

        animFrameIdRef.current = requestAnimationFrame(loop);
      };
      loop();

      return () => {
        active = false;
        clearInterval(timerInterval);
        canvas.removeEventListener('click', handleClick);
      };
    }

    // --- 9: TARGET BLASTER ---
    else if (selectedGame === 'target_blaster') {
      let currentScore = 0;
      let timeLeft = 30;
      let targets: { x: number; y: number; r: number; vx: number; isGold?: boolean }[] = [];

      const spawnTarget = () => {
        targets.push({
          x: Math.random() < 0.5 ? -20 : width + 20,
          y: 70 + Math.random() * (height - 140),
          r: 22 + Math.random() * 12,
          vx: (Math.random() * 2.5 + 1.5) * (Math.random() < 0.5 ? 1 : -1),
          isGold: Math.random() < 0.25
        });
      };
      for (let i = 0; i < 4; i++) spawnTarget();

      const timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          active = false;
          recordScore(currentScore);
        }
      }, 1000);

      const handleClick = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const mx = ((e.clientX - rect.left) / rect.width) * width;
        const my = ((e.clientY - rect.top) / rect.height) * height;

        for (let i = targets.length - 1; i >= 0; i--) {
          const t = targets[i];
          if (Math.hypot(mx - t.x, my - t.y) < t.r) {
            const pts = t.isGold ? 40 : 15;
            currentScore += pts;
            setScore(currentScore);
            playSound(t.isGold ? 784 : 523, 'triangle', 0.12);
            targets.splice(i, 1);
            spawnTarget();
            break;
          }
        }
      };
      canvas.addEventListener('click', handleClick);

      const loop = () => {
        if (!active) return;
        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = '#450a0a';
        ctx.fillRect(0, 0, width, height);

        targets.forEach(t => {
          t.x += t.vx;
          if (t.x < -30 || t.x > width + 30) t.vx *= -1;

          ctx.beginPath();
          ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
          ctx.fillStyle = t.isGold ? '#eab308' : '#dc2626';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(t.x, t.y, t.r * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        });

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`🎯 Skor: ${currentScore}`, 20, 36);
        ctx.fillStyle = timeLeft < 8 ? '#ef4444' : '#fde047';
        ctx.fillText(`⏱️ Kalan Süre: ${timeLeft}s`, width - 190, 36);

        animFrameIdRef.current = requestAnimationFrame(loop);
      };
      loop();

      return () => {
        active = false;
        clearInterval(timerInterval);
        canvas.removeEventListener('click', handleClick);
      };
    }

    // --- 10: RETRO RUNNER ---
    else {
      let px = 50;
      let py = height - 60;
      let pVy = 0;
      let isGrounded = true;
      let currentScore = 0;
      let obstacles: { x: number; w: number; h: number }[] = [];
      let speed = 5.2;
      let frame = 0;

      const jump = () => {
        if (isGrounded) {
          pVy = -11.0;
          isGrounded = false;
          playSound(330, 'sawtooth', 0.1);
        }
      };
      const handleKey = (e: KeyboardEvent) => {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
          e.preventDefault();
          jump();
        }
      };
      window.addEventListener('keydown', handleKey);
      canvas.onclick = jump;

      const loop = () => {
        if (!active) return;
        frame++;
        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, height - 30);
        ctx.lineTo(width, height - 30);
        ctx.stroke();

        pVy += 0.58;
        py += pVy;
        if (py >= height - 60) {
          py = height - 60;
          pVy = 0;
          isGrounded = true;
        }

        if (frame % 60 === 0) {
          obstacles.push({ x: width + 10, w: 20, h: 32 });
          currentScore += 5;
          setScore(currentScore);
        }

        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(px, py, 26, 30);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(px + 14, py + 6, 6, 6);

        for (let i = obstacles.length - 1; i >= 0; i--) {
          const obs = obstacles[i];
          obs.x -= speed;
          ctx.fillStyle = '#ec4899';
          ctx.fillRect(obs.x, height - 30 - obs.h, obs.w, obs.h);

          if (obs.x < px + 26 && obs.x + obs.w > px && py + 30 > height - 30 - obs.h) {
            active = false;
            recordScore(currentScore);
            return;
          }
          if (obs.x < -30) obstacles.splice(i, 1);
        }

        ctx.fillStyle = '#e879f9';
        ctx.font = 'bold 20px monospace';
        ctx.fillText(`👾 PIXEL SCORE: ${currentScore}`, 20, 36);

        animFrameIdRef.current = requestAnimationFrame(loop);
      };
      loop();

      return () => {
        active = false;
        window.removeEventListener('keydown', handleKey);
      };
    }

  }, [isPlaying, selectedGame]);

  if (!isOpen) return null;

  const currentMeta = allLocalizedGames.find(g => g.id === selectedGame) || allLocalizedGames[0];
  const isSelectedGameDaily = selectedGame === featuredGame.id;

  const displayGames = activeTab === 'daily' 
    ? dailyRotationGames 
    : allLocalizedGames;

  return (
    <div 
      className="fixed inset-0 z-[125] flex items-center justify-center p-1.5 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-5xl bg-slate-900/95 border-2 border-purple-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] sm:max-h-[92vh] text-slate-100">
        
        {/* Sticky Header with Daily Rotation Badge */}
        <div className="p-3 sm:p-5 bg-gradient-to-r from-purple-800 via-indigo-700 to-purple-900 text-white flex flex-wrap items-center justify-between gap-3 border-b-2 border-purple-400/50 shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-slate-950 border-2 border-purple-300 flex items-center justify-center text-xl sm:text-2xl shadow-xl animate-pulse shrink-0">
              🕹️
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-2xl font-black tracking-wider text-white">
                  {t.headerTitle}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs border border-amber-300 shadow">
                  {t.gameCount}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-purple-200 mt-0.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-amber-300" />
                <span>{todayDateStr}</span>
                <span className="text-purple-400">•</span>
                <span className="text-amber-300 font-bold">{t.gameOfTheDay}: {featuredGame.title} (2X!)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!dailyClaimed && (
              <button
                onClick={claimDailyReward}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <Gift className="w-4 h-4 animate-bounce" />
                <span>{t.claimDailyGift}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="min-w-[42px] min-h-[42px] p-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black flex items-center justify-center transition active:scale-95 cursor-pointer border-2 border-rose-300 shadow-md"
              title={t.closeBtn}
              aria-label={t.closeBtn}
            >
              <X className="w-6 h-6 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="px-4 py-2.5 bg-slate-950/70 border-b border-purple-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-4 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'daily'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 border border-purple-400'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.tabDaily}</span>
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 border border-purple-400'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5 text-cyan-300" />
              <span>{t.tabAll}</span>
            </button>
          </div>

          <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5 hidden sm:flex">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>{t.tabSubtitle}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-3 sm:p-5 overflow-y-auto space-y-4 flex-1 overscroll-contain">
          
          {/* Game Selection Grid */}
          {!isPlaying ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-2 sm:gap-2.5">
              {displayGames.map(g => {
                const isSel = selectedGame === g.id;
                const hs = highScores[g.id] || 0;
                const isFeatured = g.id === featuredGame.id;

                return (
                  <button
                    key={g.id}
                    disabled={isPlaying}
                    onClick={() => {
                      setSelectedGame(g.id);
                      setGameOver(false);
                      setScore(0);
                    }}
                    className={`p-2.5 sm:p-3 rounded-2xl border-2 text-left transition transform duration-150 flex flex-col justify-between relative overflow-hidden ${
                      isSel
                        ? 'border-purple-400 bg-purple-950/60 shadow-lg shadow-purple-500/20 scale-[1.02]'
                        : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/50 opacity-85 hover:opacity-100 cursor-pointer'
                    } ${isPlaying ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    {isFeatured && (
                      <span className="absolute top-0 right-0 px-2 py-0.5 bg-gradient-to-l from-amber-400 to-yellow-500 text-slate-950 font-black text-[9px] rounded-bl-lg shadow">
                        ⭐ 2X
                      </span>
                    )}

                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-2xl">{g.icon}</span>
                      <span className="text-[9px] font-bold text-purple-300 px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-800/50">
                        {g.accentBadge}
                      </span>
                    </div>

                    <h4 className="font-black text-sm text-white leading-tight">{g.title}</h4>
                    
                    <div className="mt-2 flex items-center justify-between text-[11px] font-bold">
                      <div className="text-amber-300 flex items-center gap-1">
                        <Trophy className="w-3 h-3 text-amber-400" />
                        <span>{hs}</span>
                      </div>
                      {isFeatured && (
                        <span className="text-[10px] text-amber-400 font-black">2X 🍯</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-between p-2.5 sm:p-3 bg-purple-950/70 border border-purple-500/40 rounded-2xl shrink-0 animate-in fade-in duration-150">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl sm:text-3xl">{currentMeta.icon}</span>
                <div>
                  <div className="font-black text-sm sm:text-base text-white flex items-center gap-2">
                    <span>{currentMeta.title}</span>
                    {isSelectedGameDaily && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px]">
                        2X
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-amber-300 font-bold">
                    {t.liveScore}: {score} {t.points}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setGameOver(false);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-200 border border-purple-400/40 text-xs font-bold transition active:scale-95 cursor-pointer"
              >
                {t.changeGame}
              </button>
            </div>
          )}

          {/* Game Screen Canvas or Intro Box */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-purple-500/40 bg-slate-950 flex items-center justify-center min-h-[260px] sm:min-h-[380px]">
            {isPlaying ? (
              <canvas
                ref={canvasRef}
                className="w-full h-[260px] sm:h-[380px] max-w-[680px] cursor-pointer touch-none"
              />
            ) : (
              <div className="p-8 text-center max-w-lg space-y-4 animate-in zoom-in-95 duration-200">
                <div className="text-6xl animate-bounce">{currentMeta.icon}</div>
                <div>
                  <div className="flex items-center justify-center gap-2">
                    <h3 className="text-2xl font-black text-white">{currentMeta.title}</h3>
                    {isSelectedGameDaily && (
                      <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-black rounded-lg text-xs">
                        🌟 2X
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-purple-300 mt-1 font-semibold">{currentMeta.subtitle}</p>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {currentMeta.description}
                </p>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1 text-left inline-block w-full">
                  <div className="font-black text-purple-300 mb-1 flex items-center gap-1.5">
                    <Gamepad2 className="w-4 h-4" />
                    <span>{t.howToPlay}</span>
                  </div>
                  {currentMeta.rules.map((rule, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-purple-400">•</span>
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>

                {gameOver && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 font-black text-sm flex items-center justify-center gap-3">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span>{t.gameOver} {score} {t.points}!</span>
                    <span className="text-emerald-400 text-xs">
                      {isSelectedGameDaily ? `(${t.bonusAdded})` : ''}
                    </span>
                  </div>
                )}

                <div>
                  <button
                    onClick={() => {
                      setIsPlaying(true);
                      setGameOver(false);
                      setScore(0);
                    }}
                    className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 hover:from-purple-400 hover:to-indigo-400 text-white font-black text-base shadow-xl flex items-center gap-2 mx-auto transition transform active:scale-95 cursor-pointer"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span>{gameOver ? t.playAgainBtn : t.playBtn}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">{t.footerTitle}</span>
            <span>{t.footerDesc}</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition cursor-pointer border border-slate-700"
          >
            {t.closeBtn}
          </button>
        </div>

      </div>
    </div>
  );
};
