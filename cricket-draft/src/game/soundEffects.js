// Web Audio API Sound Generator for Cricket Auction
// 100% synthesized, 0 external audio file dependencies, instant zero-latency playback
// Tailored for high-energy viral Reels / IPL Mega Auction style

class SoundFX {
  constructor() {
    this.ctx = null;
    this.isMuted = true; // Default OFF as requested
    this.soundTheme = 'ipl'; // 'ipl' (Auction Gavel & Cash) or 'esports' (Hype Synth)

    // Check localStorage preference
    try {
      const storedMute = localStorage.getItem('cricket_draft_sfx_muted');
      if (storedMute !== null) {
        this.isMuted = storedMute === 'true';
      }
      const storedTheme = localStorage.getItem('cricket_draft_sound_theme');
      if (storedTheme && storedTheme !== 'apple') {
        this.soundTheme = storedTheme;
      } else {
        this.soundTheme = 'ipl';
      }
    } catch (e) {}
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    try {
      localStorage.setItem('cricket_draft_sfx_muted', String(this.isMuted));
    } catch (e) {}
  }

  toggleMute() {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  setSoundTheme(theme) {
    this.soundTheme = theme;
    try {
      localStorage.setItem('cricket_draft_sound_theme', theme);
    } catch (e) {}
  }

  // 1. BID / CASH SOUND (Satisfying cash register & metallic coin clink)
  playBid() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    if (this.soundTheme === 'ipl') {
      // IPL Cash Register Ding + Gold Coin Clink
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(1046.5, t); // C6
      gain1.gain.setValueAtTime(0.25, t);
      gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(t);
      osc1.stop(t + 0.16);

      // Higher metallic chime (1567.98Hz - G6)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1567.98, t + 0.05);
      gain2.gain.setValueAtTime(0.3, t + 0.05);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(t + 0.05);
      osc2.stop(t + 0.3);
    } else {
      // Esports Rising Voltage Chime
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.exponentialRampToValueAtTime(1320, t + 0.12);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, t);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.22);
    }
  }

  // 2. AUCTION GAVEL KNOCK (Double wooden hammer strike)
  playGavel() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const strike = (startTime, volume = 0.6) => {
      // Low punch wood block
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, startTime);
      osc.frequency.exponentialRampToValueAtTime(45, startTime + 0.14);
      gain.gain.setValueAtTime(volume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.16);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.16);

      // Noise burst transient for realistic wood crack
      const bufferSize = this.ctx.sampleRate * 0.035;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(900, startTime);
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(volume * 0.9, startTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(startTime);
    };

    const t = this.ctx.currentTime;
    strike(t, 0.7); // Knock 1
    strike(t + 0.13, 0.5); // Knock 2 (rebound)
  }

  // 3. TIMER COUNTDOWN TICK (Tension builder)
  playTick(isUrgent = false) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = isUrgent ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(isUrgent ? 1200 : 750, t);
    gain.gain.setValueAtTime(isUrgent ? 0.28 : 0.14, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + (isUrgent ? 0.05 : 0.04));

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + (isUrgent ? 0.05 : 0.04));
  }

  // 4. CARD REVEAL WHOOSH
  playCardReveal() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(950, t + 0.18);
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.26);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.26);
  }

  // 5. PASS / FOLD BUZZER
  playPass() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.linearRampToValueAtTime(130, t + 0.16);
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  // 6. VICTORY FANFARE (Match Winner / Sold)
  playVictory() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [
      { f: 523.25, time: 0, dur: 0.15 },    // C5
      { f: 659.25, time: 0.15, dur: 0.15 }, // E5
      { f: 783.99, time: 0.3, dur: 0.15 },  // G5
      { f: 1046.50, time: 0.45, dur: 0.55 } // C6
    ];

    const t = this.ctx.currentTime;
    notes.forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, t + n.time);
      gain.gain.setValueAtTime(0.3, t + n.time);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.time + n.dur);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + n.time);
      osc.stop(t + n.time + n.dur);
    });
  }
}

export const sfx = new SoundFX();
