export class AudioManager {
  private static instance: AudioManager;
  
  private voiceAudio: HTMLAudioElement | null = null;
  private quranAudio: HTMLAudioElement | null = null;

  private isMusicMuted: boolean = false;
  
  // Volumes
  private vols = {
    music: 0.35,
    voice: 1.0,
    effects: 0.6,
    quran: 1.0
  };

  private currentTheme: string = 'portal';
  private audioCtx: AudioContext | null = null;
  private bgmInterval: any = null;
  private isBgmPlaying: boolean = false;
  private isDucked: boolean = false;

  private constructor() {
    this.initMutedState();
    this.initVolumesState();
  }

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  private initMutedState() {
    const saved = localStorage.getItem('smarttech_music_muted');
    if (saved === 'true') {
      this.isMusicMuted = true;
    }
  }

  private initVolumesState() {
    try {
      const saved = localStorage.getItem('smarttech_volumes');
      if (saved) {
        this.vols = { ...this.vols, ...JSON.parse(saved) };
      }
    } catch (e) {}
  }

  public getVolumes() {
    return this.vols;
  }

  public setMusicMuted(muted: boolean) {
    this.isMusicMuted = muted;
    localStorage.setItem('smarttech_music_muted', muted.toString());
    if (muted) {
      this.stopBgmLoop();
    } else {
      this.startBgmLoop();
    }
  }

  public toggleMusic() {
    this.setMusicMuted(!this.isMusicMuted);
    return this.isMusicMuted;
  }

  public getIsMusicMuted() {
    return this.isMusicMuted;
  }

  private getAudioContext(): AudioContext | null {
    try {
      if (!this.audioCtx) {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtxClass) {
          this.audioCtx = new AudioCtxClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
      return this.audioCtx;
    } catch {
      return null;
    }
  }

  public init() {
    // Call this on first interaction to unlock audio
    this.getAudioContext();
    if (!this.isMusicMuted) {
      this.startBgmLoop();
    }
  }

  public playTheme(themeName: string) {
    if (themeName === 'quran') {
      this.stopMusic();
      return;
    }

    this.currentTheme = themeName;
    if (!this.isMusicMuted) {
      this.startBgmLoop();
    }
  }

  public stopMusic() {
    this.stopBgmLoop();
  }

  private startBgmLoop() {
    if (this.isMusicMuted || this.currentTheme === 'quran') {
      return;
    }

    if (this.isBgmPlaying) return;
    this.isBgmPlaying = true;

    // Pleasant pentatonic scales for soft background melody
    const scales: Record<string, number[]> = {
      portal: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25], // C Major pentatonic
      swimming: [220.00, 261.63, 293.66, 349.23, 392.00, 440.00], // Gentle underwater
      learning: [261.63, 293.66, 329.63, 392.00, 523.25, 587.33], // Bright curious
      adventure: [293.66, 329.63, 369.99, 440.00, 493.88, 587.33] // Cheerful quest
    };

    let step = 0;
    this.bgmInterval = setInterval(() => {
      if (this.isMusicMuted || !this.isBgmPlaying) return;
      const ctx = this.getAudioContext();
      if (!ctx || ctx.state === 'suspended') return;

      const scale = scales[this.currentTheme] || scales.portal;
      const freq = scale[step % scale.length];
      step++;

      // Play soft warm chime note
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const currentVol = (this.isDucked ? this.vols.music * 0.2 : this.vols.music) * 0.08;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(Math.max(0.001, currentVol), now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.7);
      } catch (e) {}
    }, 1200);
  }

  private stopBgmLoop() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  public setVolumes(music: number, voice: number, effects: number, quran: number) {
    this.vols = { music, voice, effects, quran };
    localStorage.setItem('smarttech_volumes', JSON.stringify(this.vols));
    if (this.voiceAudio) this.voiceAudio.volume = voice;
    if (this.quranAudio) this.quranAudio.volume = quran;
  }

  private duckMusic() {
    this.isDucked = true;
  }

  private unduckMusic() {
    this.isDucked = false;
  }

  public playVoice(url: string, onEnded?: () => void) {
    if (this.voiceAudio) {
      this.voiceAudio.pause();
    }
    this.voiceAudio = new Audio(url);
    this.voiceAudio.volume = this.vols.voice;
    
    this.duckMusic();

    this.voiceAudio.onended = () => {
      this.unduckMusic();
      if (onEnded) onEnded();
    };

    this.voiceAudio.play().catch(e => {
      this.unduckMusic();
      if (onEnded) onEnded();
    });
  }

  public stopVoice() {
    if (this.voiceAudio) {
      this.voiceAudio.pause();
      this.unduckMusic();
    }
  }

  // --- Web Audio Synthesized Pure Sound Effects (No network, zero 404s) ---

  public playSynthesizedClick() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.04);

      const vol = 0.22 * this.vols.effects;
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  public playSynthesizedSuccess() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        const startTime = now + idx * 0.08;
        const vol = 0.28 * this.vols.effects;
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(vol, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.45);
      });
    } catch {}
  }

  public playSynthesizedReward() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Majestic celebratory fanfare
      const notes = [392.00, 523.25, 659.25, 783.99, 1046.50]; // G4, C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const startTime = now + idx * 0.11;
        osc.frequency.setValueAtTime(freq, startTime);

        const isLast = idx === notes.length - 1;
        const duration = isLast ? 0.9 : 0.35;
        const vol = (isLast ? 0.35 : 0.25) * this.vols.effects;

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(vol, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration + 0.05);
      });
    } catch {}
  }

  public playSynthesizedRetry() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.28);

      const vol = 0.25 * this.vols.effects;
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    } catch {}
  }

  public playSynthesizedStar() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [1174.66, 1760.00].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const startTime = now + idx * 0.06;
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.25 * this.vols.effects, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.4);
      });
    } catch {}
  }

  public playSynthesizedApplause(durationSeconds: number = 2.2) {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // 1. Celebratory melodic fanfare arpeggio
      const fanfareNotes = [523.25, 659.25, 783.99, 1046.50];
      fanfareNotes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        const startTime = now + idx * 0.1;
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.28 * this.vols.effects, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.55);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.6);
      });

      // 2. Procedural rhythmic crowd hand clapping bursts
      const sampleRate = ctx.sampleRate;
      const bufferLength = Math.floor(sampleRate * 0.05); // 50ms noise burst
      const noiseBuffer = ctx.createBuffer(1, bufferLength, sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferLength; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const totalClaps = 30;
      for (let i = 0; i < totalClaps; i++) {
        const clapTime = now + (i / totalClaps) * durationSeconds * 0.85 + (Math.random() * 0.08);
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = noiseBuffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(950 + Math.random() * 650, clapTime);
        filter.Q.setValueAtTime(2.2, clapTime);

        const clapGain = ctx.createGain();
        const clapVolume = (0.16 + Math.random() * 0.22) * this.vols.effects;
        clapGain.gain.setValueAtTime(clapVolume, clapTime);
        clapGain.gain.exponentialRampToValueAtTime(0.001, clapTime + 0.048);

        noiseSource.connect(filter);
        filter.connect(clapGain);
        clapGain.connect(ctx.destination);

        noiseSource.start(clapTime);
        noiseSource.stop(clapTime + 0.05);
      }
    } catch {}
  }

  public playApplause() {
    this.playSynthesizedApplause(2.4);
  }

  public playEffect(type: 'success' | 'click' | 'reward' | 'retry' | 'applause' | 'star' | 'bubble') {
    switch (type) {
      case 'applause':
        this.playApplause();
        break;
      case 'success':
        this.playSynthesizedSuccess();
        break;
      case 'reward':
        this.playSynthesizedReward();
        break;
      case 'retry':
        this.playSynthesizedRetry();
        break;
      case 'star':
        this.playSynthesizedStar();
        break;
      case 'bubble':
      case 'click':
      default:
        this.playSynthesizedClick();
        break;
    }
  }

  public playQuran(url: string, onEnded?: () => void) {
    this.stopMusic();
    this.stopVoice();

    if (this.quranAudio) {
      this.quranAudio.pause();
    }

    if (!url) {
      if (onEnded) onEnded();
      return;
    }

    this.quranAudio = new Audio(url);
    this.quranAudio.volume = this.vols.quran;
    
    this.quranAudio.onended = () => {
      if (onEnded) onEnded();
    };

    this.quranAudio.play().catch(e => {
      if (onEnded) onEnded();
    });
  }
  
  public stopQuran() {
    if (this.quranAudio) {
      this.quranAudio.pause();
    }
  }
}

export const audioManager = AudioManager.getInstance();
