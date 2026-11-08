import { VoiceConfig, CharacterType, Emotion } from './types';

export class VoiceManager {
  private static getCharacterSettings(character: CharacterType, emotion: Emotion = 'neutral') {
    let pitch = 1;
    let rate = 0.9; // Base rate, slightly slower for kids

    // Default child voice (Tia / Player)
    pitch = 1.3;
    rate = 0.9;

    // Adjust based on emotion
    switch (emotion) {
      case 'excited':
      case 'celebrate':
      case 'surprised':
        pitch += 0.2;
        rate += 0.1;
        break;
      case 'calm':
      case 'gentle':
        pitch -= 0.1;
        rate -= 0.1;
        break;
      case 'concerned':
        pitch -= 0.2;
        rate -= 0.15;
        break;
    }

    return { pitch, rate };
  }

  static speak(config: VoiceConfig, onEnd?: () => void) {
    if (!('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    window.speechSynthesis.cancel();

    // Minor text replacements for better natural Egyptian pronunciation via TTS if needed
    let textToSpeak = config.text
      .replace(/إيه/g, 'إِيه') // Add phonetic helpers if needed, but modern engines handle standard spelling well
      .replace(/دلوقتي/g, 'دِلْوَقْتِي');

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = config.language || 'ar-EG';
    
    const settings = this.getCharacterSettings(config.character, config.emotion);
    utterance.pitch = config.pitch || settings.pitch;
    utterance.rate = config.speed || settings.rate;

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    const voices = window.speechSynthesis.getVoices();
    const arabicVoices = voices.filter(v => v.lang.startsWith('ar'));
    const egyptianVoice = arabicVoices.find(v => v.lang === 'ar-EG');
    
    if (egyptianVoice) {
      utterance.voice = egyptianVoice;
    } else if (arabicVoices.length > 0) {
      utterance.voice = arabicVoices[0];
    }

    window.speechSynthesis.speak(utterance);
  }

  static stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

// Pre-load voices
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}
