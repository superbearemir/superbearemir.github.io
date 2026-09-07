export type EarType = 'round' | 'pointy' | 'bunny' | 'horns' | 'cat';
export type TextureMode = 'none' | 'wrap' | 'decal' | 'pattern';
export type PatternType = 'none' | 'stripes' | 'spots' | 'hexagons' | 'circuit' | 'camo' | 'stars' | 'gradient';
export type MaterialType = 'standard' | 'shiny' | 'gold' | 'magma' | 'cyber' | 'glass' | 'rainbow';
export type AuraType = 'none' | 'sparkles' | 'fire' | 'cosmic' | 'lightning' | 'honey';
export type BlendMode = 'normal' | 'overlay' | 'multiply' | 'screen' | 'difference';

export interface CharacterMorphology {
  headScale: number;      // 0.7 - 1.4
  bodyScale: number;      // 0.7 - 1.4
  chubbyScale: number;    // 0.7 - 1.5
  snoutScale: number;     // 0.6 - 1.5
  earScale: number;       // 0.6 - 1.8
  earType: EarType;
  armScale: number;       // 0.7 - 1.4
  legScale: number;       // 0.7 - 1.4
  overallScale: number;   // 0.7 - 1.3
}

export interface CharacterPalette {
  furColor: string;       // hex e.g. "#8B4513"
  bellyColor: string;     // hex e.g. "#D2B48C"
  muzzleColor: string;    // hex e.g. "#E6D7C3"
  earInnerColor: string;  // hex e.g. "#D29B78"
  pawColor: string;       // hex e.g. "#6B3B1B"
  eyeColor: string;       // hex e.g. "#111111"
  capeColor: string;      // hex e.g. "#F59E0B"
  accentColor: string;    // hex e.g. "#3B82F6"
}

export interface CharacterTextureSettings {
  mode: TextureMode;
  patternType: PatternType;
  repeat: number;         // 1 - 8
  rotation: number;       // 0 - 360
  opacity: number;        // 0.1 - 1.0
  blendMode: BlendMode;
  decalShape: 'circle' | 'shield' | 'heart' | 'star' | 'square';
  decalScale: number;     // 0.5 - 2.0
  applyToCape: boolean;
  applyToBody: boolean;
  applyToHead: boolean;
  applyToLimbs: boolean;
}

export interface CustomCharacterDesign {
  id: string;
  name: string;
  createdAt: number;
  imageSrc: string | null;           // Base64 or URL of source image
  imageName?: string;
  palette: CharacterPalette;
  extractedSwatches: string[];       // All extracted colors from image
  morphology: CharacterMorphology;
  textureSettings: CharacterTextureSettings;
  materialType: MaterialType;
  glowIntensity: number;             // 0 - 1
  auraType: AuraType;
  auraColor: string;
  capeEnabled: boolean;
  notes?: string;
}

export interface SampleImagePreset {
  id: string;
  title: string;
  category: string;
  icon: string;
  dataUrl: string;
  description: string;
}
