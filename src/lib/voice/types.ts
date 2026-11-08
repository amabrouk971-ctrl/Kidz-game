export type Emotion = 'happy' | 'excited' | 'curious' | 'surprised' | 'calm' | 'encouraging' | 'proud' | 'playful' | 'gentle' | 'concerned' | 'neutral' | 'celebrate' | 'hint';

export type CharacterType = 'player' | 'tia' | string;

export interface VoiceConfig {
  character: CharacterType;
  text: string;
  language?: string;
  emotion?: Emotion;
  speed?: number;
  pitch?: number;
}
