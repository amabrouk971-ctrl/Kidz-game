import { VoiceManager } from '../lib/voice/VoiceManager';
import { CharacterType, Emotion } from '../lib/voice/types';
import { audioManager } from '../lib/audio/AudioManager';

export const playSound = (type: 'success' | 'error' | 'click' | 'reward' | 'bubble' | 'star') => {
  if (type === 'error') {
    audioManager.playEffect('retry');
  } else {
    audioManager.playEffect(type);
  }
};

export const speak = (
  text: string, 
  onEnd?: () => void, 
  character: CharacterType = 'tia', 
  emotion: Emotion = 'neutral'
) => {
  VoiceManager.speak({ text, character, emotion }, onEnd);
};

export const stopSpeech = () => {
  VoiceManager.stop();
};
