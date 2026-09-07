import { CharacterPalette, CharacterTextureSettings, PatternType } from './types';

// Convert RGB to HEX
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Convert HEX to integer 0xRRGGBB
export function hexToInt(hex: string): number {
  const clean = hex.replace('#', '');
  return parseInt(clean, 16) || 0;
}

// Convert HEX to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

// Calculate color distance (Euclidean in RGB space)
function colorDist(c1: { r: number; g: number; b: number }, c2: { r: number; g: number; b: number }): number {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
}

// Calculate color saturation and luminance
function getSaturation(r: number, g: number, b: number): number {
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  if (max === 0) return 0;
  return (max - min) / max;
}

function getLuminance(r: number, g: number, b: number): number {
  return 0.299 * (r / 255) + 0.587 * (g / 255) + 0.114 * (b / 255);
}

export interface ExtractedImageInfo {
  palette: string[];          // Top 8 distinctive swatches
  dominant: string;
  vibrant: string;
  dark: string;
  light: string;
  accent: string;
  suggestedPalette: CharacterPalette;
}

/**
 * Extracts colors and dominant palettes from an HTMLImageElement or dataUrl
 */
export async function analyzeImageColors(imageSource: HTMLImageElement | string): Promise<ExtractedImageInfo> {
  const img = await loadImageElement(imageSource);
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // Downsample to max 128x128 for high performance analysis
  const maxDim = 128;
  const scale = Math.min(maxDim / img.width, maxDim / img.height, 1);
  const w = Math.max(1, Math.floor(img.width * scale));
  const h = Math.max(1, Math.floor(img.height * scale));
  
  canvas.width = w;
  canvas.height = h;
  ctx.drawImage(img, 0, 0, w, h);

  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  // Sample pixel buckets (quantization)
  const colorCounts: { [key: string]: { r: number; g: number; b: number; count: number; sat: number; lum: number } } = {};
  
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a < 128) continue; // Skip transparent
    
    // Quantize to step of 16
    const r = Math.round(data[i] / 16) * 16;
    const g = Math.round(data[i + 1] / 16) * 16;
    const b = Math.round(data[i + 2] / 16) * 16;
    const key = `${r},${g},${b}`;

    if (!colorCounts[key]) {
      const sat = getSaturation(r, g, b);
      const lum = getLuminance(r, g, b);
      colorCounts[key] = { r, g, b, count: 1, sat, lum };
    } else {
      colorCounts[key].count++;
    }
  }

  const allColors = Object.values(colorCounts).sort((a, b) => b.count - a.count);
  
  // Pick distinct colors for palette
  const distinct: { r: number; g: number; b: number; hex: string; count: number; sat: number; lum: number }[] = [];
  const minDistance = 45; // Threshold to ensure varied colors

  for (const c of allColors) {
    const isFarEnough = distinct.every(d => colorDist(c, d) > minDistance);
    if (isFarEnough) {
      distinct.push({ ...c, hex: rgbToHex(c.r, c.g, c.b) });
    }
    if (distinct.length >= 10) break;
  }

  // Fallback if not enough distinct colors
  if (distinct.length === 0) {
    distinct.push({ r: 139, g: 69, b: 19, hex: '#8B4513', count: 1, sat: 0.8, lum: 0.4 });
  }
  while (distinct.length < 8) {
    const base = distinct[distinct.length - 1];
    const shiftedHex = rgbToHex(
      Math.min(255, base.r + 30),
      Math.min(255, base.g + 30),
      Math.min(255, base.b + 30)
    );
    distinct.push({
      r: Math.min(255, base.r + 30),
      g: Math.min(255, base.g + 30),
      b: Math.min(255, base.b + 30),
      hex: shiftedHex,
      count: 1,
      sat: base.sat,
      lum: Math.min(1, base.lum + 0.1),
    });
  }

  // Dominant color (highest frequency)
  const dominant = distinct[0].hex;

  // Vibrant color (high saturation, medium luminance)
  const vibrantItem = [...distinct].sort((a, b) => (b.sat * (1 - Math.abs(b.lum - 0.5))) - (a.sat * (1 - Math.abs(a.lum - 0.5))))[0];
  const vibrant = vibrantItem ? vibrantItem.hex : dominant;

  // Light color (highest luminance)
  const lightItem = [...distinct].sort((a, b) => b.lum - a.lum)[0];
  const light = lightItem ? lightItem.hex : '#F8FAFC';

  // Dark color (lowest luminance)
  const darkItem = [...distinct].sort((a, b) => a.lum - b.lum)[0];
  const dark = darkItem ? darkItem.hex : '#1E293B';

  // Accent color (contrasts with dominant)
  const dominantRgb = hexToRgb(dominant);
  const accentItem = [...distinct].sort((a, b) => colorDist(dominantRgb, b) - colorDist(dominantRgb, a))[0];
  const accent = accentItem ? accentItem.hex : vibrant;

  // Auto-compose a harmonious character palette
  // 1. Fur color = Dominant or rich vibrant
  const furColor = dominant;
  // 2. Belly color = Lighter tone or vibrant complementary
  const bellyColor = lightItem && lightItem.lum > 0.45 ? lightItem.hex : rgbToHex(
    Math.min(255, dominantRgb.r + 45),
    Math.min(255, dominantRgb.g + 45),
    Math.min(255, dominantRgb.b + 45)
  );
  // 3. Muzzle color = Soft light/neutral tone
  const muzzleColor = distinct[2] ? distinct[2].hex : bellyColor;
  // 4. Ear inner = Vibrant/warm accent
  const earInnerColor = vibrantItem ? vibrantItem.hex : accent;
  // 5. Paw color = Darker grounding tone
  const pawColor = darkItem && darkItem.lum < 0.4 ? darkItem.hex : rgbToHex(
    Math.max(0, dominantRgb.r - 40),
    Math.max(0, dominantRgb.g - 40),
    Math.max(0, dominantRgb.b - 40)
  );
  // 6. Eye color = Dark with specular highlight
  const eyeColor = darkItem ? darkItem.hex : '#111827';
  // 7. Cape color = Vibrant Heroic color
  const capeColor = vibrant;

  const suggestedPalette: CharacterPalette = {
    furColor,
    bellyColor,
    muzzleColor,
    earInnerColor,
    pawColor,
    eyeColor,
    capeColor,
    accentColor: accent,
  };

  return {
    palette: distinct.map(d => d.hex),
    dominant,
    vibrant,
    dark,
    light,
    accent,
    suggestedPalette,
  };
}

/**
 * Loads an image from string (URL/base64) or returns existing HTMLImageElement
 */
export function loadImageElement(source: HTMLImageElement | string): Promise<HTMLImageElement> {
  if (typeof source !== 'string') {
    if (source.complete) return Promise.resolve(source);
    return new Promise((resolve, reject) => {
      source.onload = () => resolve(source);
      source.onerror = reject;
    });
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Resim yüklenemedi: ' + e));
    img.src = source;
  });
}

/**
 * Procedural pattern generator with image colors
 */
export function generateProceduralPattern(
  patternType: PatternType,
  colors: CharacterPalette,
  size = 512
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Background color
  ctx.fillStyle = colors.furColor;
  ctx.fillRect(0, 0, size, size);

  if (patternType === 'stripes') {
    // Tiger / Zebra stripes
    ctx.fillStyle = colors.accentColor || colors.pawColor;
    ctx.beginPath();
    const count = 12;
    const stripeW = size / count;
    for (let i = 0; i < count; i++) {
      const x = i * stripeW;
      ctx.moveTo(x, 0);
      ctx.bezierCurveTo(x + 20, size * 0.3, x - 20, size * 0.7, x + 10, size);
      ctx.lineTo(x + stripeW * 0.45, size);
      ctx.bezierCurveTo(x + stripeW * 0.45 - 20, size * 0.7, x + stripeW * 0.45 + 20, size * 0.3, x + stripeW * 0.45, 0);
      ctx.closePath();
    }
    ctx.fill();
  } else if (patternType === 'spots') {
    // Leopard / Dalmatian spots
    const spotColor = colors.accentColor || colors.pawColor;
    const innerColor = colors.bellyColor;
    const spotCount = 35;
    for (let i = 0; i < spotCount; i++) {
      const cx = (Math.sin(i * 99) * 0.5 + 0.5) * size;
      const cy = (Math.cos(i * 77) * 0.5 + 0.5) * size;
      const r = 12 + (i % 5) * 6;

      ctx.fillStyle = spotColor;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = innerColor;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (patternType === 'hexagons') {
    // Honeycomb pattern
    ctx.strokeStyle = colors.accentColor;
    ctx.lineWidth = 4;
    const hexRadius = 32;
    const h = hexRadius * Math.sqrt(3);
    const w = hexRadius * 2;
    for (let y = -hexRadius; y < size + hexRadius * 2; y += h) {
      let row = Math.floor(y / h);
      for (let x = -hexRadius; x < size + hexRadius * 2; x += w * 1.5) {
        const cx = x + (row % 2 === 0 ? 0 : w * 0.75);
        drawHexagon(ctx, cx, y, hexRadius);
      }
    }
  } else if (patternType === 'circuit') {
    // Cyberpunk circuit lines
    ctx.strokeStyle = colors.accentColor;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    for (let i = 0; i < 16; i++) {
      const y = (i / 16) * size;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(size * 0.3, y);
      ctx.lineTo(size * 0.45, y + 30);
      ctx.lineTo(size * 0.8, y + 30);
      ctx.lineTo(size, y + (i % 2 === 0 ? 60 : -30));
      ctx.stroke();

      // Node dots
      ctx.fillStyle = colors.bellyColor;
      ctx.beginPath();
      ctx.arc(size * 0.45, y + 30, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (patternType === 'camo') {
    // Military / Forest camo patches
    const camoColors = [colors.bellyColor, colors.pawColor, colors.accentColor];
    for (let c = 0; c < camoColors.length; c++) {
      ctx.fillStyle = camoColors[c];
      for (let i = 0; i < 8; i++) {
        const cx = (Math.sin(i * 3 + c * 7) * 0.5 + 0.5) * size;
        const cy = (Math.cos(i * 5 + c * 4) * 0.5 + 0.5) * size;
        ctx.beginPath();
        ctx.arc(cx, cy, 40 + (i % 4) * 20, 0, Math.PI * 2);
        ctx.arc(cx + 30, cy - 20, 30, 0, Math.PI * 2);
        ctx.arc(cx - 25, cy + 25, 35, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (patternType === 'stars') {
    // Starfield & Constellations
    ctx.fillStyle = colors.accentColor;
    for (let i = 0; i < 60; i++) {
      const sx = (Math.sin(i * 13) * 0.5 + 0.5) * size;
      const sy = (Math.cos(i * 29) * 0.5 + 0.5) * size;
      const r = (i % 3 === 0) ? 5 : 2.5;
      drawStar(ctx, sx, sy, 5, r * 2, r);
    }
  } else if (patternType === 'gradient') {
    // Multi-color dynamic radial/linear gradient
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, colors.furColor);
    grad.addColorStop(0.5, colors.accentColor);
    grad.addColorStop(1, colors.bellyColor);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }

  return canvas;
}

function drawHexagon(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const px = x + r * Math.cos(angle);
    const py = y + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
}

/**
 * Creates a tiled composite canvas texture from uploaded image and settings
 */
export async function createCompositeTexture(
  imageSource: HTMLImageElement | string | null,
  palette: CharacterPalette,
  settings: CharacterTextureSettings,
  size = 512
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // 1. Base color
  ctx.fillStyle = palette.furColor;
  ctx.fillRect(0, 0, size, size);

  // If procedural pattern is selected
  if (settings.patternType !== 'none') {
    const patternCanvas = generateProceduralPattern(settings.patternType, palette, size);
    ctx.save();
    ctx.globalAlpha = settings.opacity;
    ctx.drawImage(patternCanvas, 0, 0);
    ctx.restore();
  }

  // If user uploaded an image and mode is wrap/decal
  if (imageSource && (settings.mode === 'wrap' || settings.mode === 'decal')) {
    try {
      const img = await loadImageElement(imageSource);
      ctx.save();
      ctx.globalAlpha = settings.opacity;
      
      // Set blend mode
      if (settings.blendMode !== 'normal') {
        ctx.globalCompositeOperation = settings.blendMode;
      }

      if (settings.mode === 'wrap') {
        // Tiled wrap with repeat and rotation
        const repeat = Math.max(1, settings.repeat);
        const cellW = size / repeat;
        const cellH = size / repeat;
        
        ctx.translate(size / 2, size / 2);
        ctx.rotate((settings.rotation * Math.PI) / 180);
        ctx.translate(-size / 2, -size / 2);

        for (let ix = -1; ix <= repeat + 1; ix++) {
          for (let iy = -1; iy <= repeat + 1; iy++) {
            ctx.drawImage(img, ix * cellW, iy * cellH, cellW, cellH);
          }
        }
      } else if (settings.mode === 'decal') {
        // Centered badge / emblem
        const scale = settings.decalScale;
        const dw = size * 0.6 * scale;
        const dh = size * 0.6 * scale;
        const dx = (size - dw) / 2;
        const dy = (size - dh) / 2;

        ctx.save();
        ctx.translate(size / 2, size / 2);
        ctx.rotate((settings.rotation * Math.PI) / 180);
        ctx.translate(-size / 2, -size / 2);

        // Apply clip shape
        ctx.beginPath();
        if (settings.decalShape === 'circle') {
          ctx.arc(size / 2, size / 2, dw / 2, 0, Math.PI * 2);
        } else if (settings.decalShape === 'heart') {
          const hx = size / 2;
          const hy = size / 2 - dh * 0.1;
          const hr = dw * 0.35;
          ctx.moveTo(hx, hy + hr);
          ctx.bezierCurveTo(hx, hy, hx - hr, hy, hx - hr, hy + hr * 0.7);
          ctx.bezierCurveTo(hx - hr, hy + hr * 1.4, hx, hy + hr * 1.8, hx, hy + hr * 2.2);
          ctx.bezierCurveTo(hx, hy + hr * 1.8, hx + hr, hy + hr * 1.4, hx + hr, hy + hr * 0.7);
          ctx.bezierCurveTo(hx + hr, hy, hx, hy, hx, hy + hr);
        } else if (settings.decalShape === 'star') {
          drawStar(ctx, size / 2, size / 2, 5, dw / 2, dw / 4);
        } else if (settings.decalShape === 'shield') {
          const sw = dw * 0.45;
          const sh = dh * 0.5;
          ctx.moveTo(size / 2 - sw, size / 2 - sh);
          ctx.lineTo(size / 2 + sw, size / 2 - sh);
          ctx.lineTo(size / 2 + sw, size / 2 + sh * 0.3);
          ctx.quadraticCurveTo(size / 2, size / 2 + sh, size / 2, size / 2 + sh);
          ctx.quadraticCurveTo(size / 2, size / 2 + sh, size / 2 - sw, size / 2 + sh * 0.3);
          ctx.closePath();
        } else {
          ctx.rect(dx, dy, dw, dh);
        }
        ctx.clip();

        // Draw image inside clip
        ctx.drawImage(img, dx, dy, dw, dh);
        
        // Border for decal badge
        ctx.strokeStyle = palette.accentColor || '#F59E0B';
        ctx.lineWidth = 8;
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();
    } catch (err) {
      console.warn('Failed to draw custom texture:', err);
    }
  }

  return canvas;
}

/**
 * Creates high resolution cape texture with image artwork and ornate borders
 */
export async function createCapeTexture(
  imageSource: HTMLImageElement | string | null,
  palette: CharacterPalette,
  characterName: string,
  width = 512,
  height = 512
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Background cape satin gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, palette.capeColor);
  bgGrad.addColorStop(1, palette.pawColor || '#1E293B');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Golden / Royal trim border
  ctx.strokeStyle = palette.accentColor || '#FBBF24';
  ctx.lineWidth = 14;
  ctx.strokeRect(10, 10, width - 20, height - 20);

  // Inner ornate dashed border
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.strokeRect(22, 22, width - 44, height - 44);
  ctx.setLineDash([]);

  // Draw uploaded artwork in the center of the cape
  if (imageSource) {
    try {
      const img = await loadImageElement(imageSource);
      const margin = 40;
      const artW = width - margin * 2;
      const artH = height * 0.7;
      const artY = margin;

      ctx.save();
      // Rounded clipping rect for artwork
      ctx.beginPath();
      const r = 24;
      ctx.moveTo(margin + r, artY);
      ctx.lineTo(margin + artW - r, artY);
      ctx.quadraticCurveTo(margin + artW, artY, margin + artW, artY + r);
      ctx.lineTo(margin + artW, artY + artH - r);
      ctx.quadraticCurveTo(margin + artW, artY + artH, margin + artW - r, artY + artH);
      ctx.lineTo(margin + r, artY + artH);
      ctx.quadraticCurveTo(margin, artY + artH, margin, artY + artH - r);
      ctx.lineTo(margin, artY + r);
      ctx.quadraticCurveTo(margin, artY, margin + r, artY);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(img, margin, artY, artW, artH);
      ctx.restore();

      // Artwork border
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 4;
      ctx.stroke();
    } catch {
      // ignore
    }
  }

  // Banner at the bottom with character name
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(30, height - 85, width - 60, 55);
  ctx.strokeStyle = palette.accentColor || '#FBBF24';
  ctx.lineWidth = 3;
  ctx.strokeRect(30, height - 85, width - 60, 55);

  ctx.fillStyle = '#FDE68A';
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(characterName.toUpperCase(), width / 2, height - 58);

  return canvas;
}

/**
 * Built-in Preset Inspiration Images
 */
export const SAMPLE_PRESET_IMAGES: {
  id: string;
  title: string;
  category: string;
  icon: string;
  description: string;
  palette: CharacterPalette;
  pattern: PatternType;
  earType: 'round' | 'pointy' | 'bunny' | 'horns' | 'cat';
  material: 'standard' | 'shiny' | 'gold' | 'magma' | 'cyber' | 'glass';
  aura: 'none' | 'sparkles' | 'fire' | 'cosmic' | 'lightning' | 'honey';
}[] = [
  {
    id: 'cyber_neon',
    title: 'Siber Neon Ayı (Cyberpunk)',
    category: 'Gelecek',
    icon: '⚡',
    description: 'Siber devre desenli, parlayan neon çizgili ve turkuaz/mor auralı mecha savaşçı.',
    palette: {
      furColor: '#0F172A',
      bellyColor: '#06B6D4',
      muzzleColor: '#38BDF8',
      earInnerColor: '#EC4899',
      pawColor: '#1E1B4B',
      eyeColor: '#22D3EE',
      capeColor: '#8B5CF6',
      accentColor: '#06B6D4',
    },
    pattern: 'circuit',
    earType: 'cat',
    material: 'cyber',
    aura: 'lightning',
  },
  {
    id: 'fire_tiger',
    title: 'Alevli Kaplan Bozayı (Flame Tiger)',
    category: 'Vahşi Doğa',
    icon: '🔥',
    description: 'Ateşli kaplan çizgileri, kızıl-turuncu kürk ve alev aurası.',
    palette: {
      furColor: '#EA580C',
      bellyColor: '#FEF08A',
      muzzleColor: '#FED7AA',
      earInnerColor: '#DC2626',
      pawColor: '#451A03',
      eyeColor: '#F59E0B',
      capeColor: '#B91C1C',
      accentColor: '#18181B',
    },
    pattern: 'stripes',
    earType: 'pointy',
    material: 'magma',
    aura: 'fire',
  },
  {
    id: 'cosmic_galaxy',
    title: 'Kozmik Galaksi Panda (Cosmic Void)',
    category: 'Uzay',
    icon: '🌌',
    description: 'Yıldız takımyıldızları, parıldayan derin uzay renkleri ve mor kozmik ışıma.',
    palette: {
      furColor: '#1E1B4B',
      bellyColor: '#C084FC',
      muzzleColor: '#E9D5FF',
      earInnerColor: '#F43F5E',
      pawColor: '#090514',
      eyeColor: '#A855F7',
      capeColor: '#6366F1',
      accentColor: '#38BDF8',
    },
    pattern: 'stars',
    earType: 'round',
    material: 'shiny',
    aura: 'cosmic',
  },
  {
    id: 'royal_honey',
    title: 'Kraliyet Altın Bal Şövalyesi (Honey Knight)',
    category: 'Efsanevi',
    icon: '👑',
    description: 'Petek desenleri, altın zırh kaplama ve bal taneleri aurası.',
    palette: {
      furColor: '#D97706',
      bellyColor: '#FDE68A',
      muzzleColor: '#FEF3C7',
      earInnerColor: '#F59E0B',
      pawColor: '#78350F',
      eyeColor: '#451A03',
      capeColor: '#F59E0B',
      accentColor: '#FCD34D',
    },
    pattern: 'hexagons',
    earType: 'horns',
    material: 'gold',
    aura: 'honey',
  },
  {
    id: 'forest_camo',
    title: 'Kamuflajlı Orman Komandosu (Forest Ranger)',
    category: 'Taktik',
    icon: '🌲',
    description: 'Doğal kamuflaj desenli, vahşi orman tonları ve tilki kulaklı maceracı.',
    palette: {
      furColor: '#3F6212',
      bellyColor: '#A3E635',
      muzzleColor: '#D9F99D',
      earInnerColor: '#65A30D',
      pawColor: '#14532D',
      eyeColor: '#15803D',
      capeColor: '#166534',
      accentColor: '#1C1917',
    },
    pattern: 'camo',
    earType: 'pointy',
    material: 'standard',
    aura: 'sparkles',
  },
  {
    id: 'cute_bunny_cub',
    title: 'Sevimli Çilek Tavşan Ayı (Strawberry Bunny)',
    category: 'Sevimli',
    icon: '🍓',
    description: 'Uzun tavşan kulaklı, pembe çilek desenli ve parıldayan tatlı kahraman.',
    palette: {
      furColor: '#F472B6',
      bellyColor: '#FDF2F8',
      muzzleColor: '#FCE7F3',
      earInnerColor: '#FB7185',
      pawColor: '#9D174D',
      eyeColor: '#DB2777',
      capeColor: '#EC4899',
      accentColor: '#FDA4AF',
    },
    pattern: 'spots',
    earType: 'bunny',
    material: 'standard',
    aura: 'sparkles',
  }
];
