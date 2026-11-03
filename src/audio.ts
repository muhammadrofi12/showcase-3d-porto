// Procedural Web Audio API ambient museum music & interaction sound effects

class GalleryAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private enabled = false;
  private intervalId: number | null = null;
  private chordIndex = 0;

  private ensureContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.92;
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.0001;
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.95;
      this.sfxGain.connect(this.masterGain);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private getNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (this.noiseBuffer) return this.noiseBuffer;
    const length = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    // Warm pink-ish filtered noise for natural air/whoosh/step textures
    let b0 = 0,
      b1 = 0,
      b2 = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.997 * b0 + white * 0.029;
      b1 = 0.985 * b1 + white * 0.032;
      b2 = 0.95 * b2 + white * 0.048;
      data[i] = (b0 + b1 + b2 + white * 0.18) * 0.65;
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  public unlockContext() {
    const ctx = this.ensureContext();
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(next: boolean, silent = false): boolean {
    this.enabled = next;
    if (next) {
      const ctx = this.ensureContext();
      if (ctx && this.musicGain) {
        const now = ctx.currentTime;
        this.musicGain.gain.cancelScheduledValues(now);
        this.musicGain.gain.setValueAtTime(
          Math.max(0.0001, this.musicGain.gain.value),
          now,
        );
        this.musicGain.gain.exponentialRampToValueAtTime(0.18, now + 1.2);
      }
      this.startAmbientLoop();
      if (!silent) this.playClick();
    } else {
      if (this.ctx && this.musicGain) {
        const now = this.ctx.currentTime;
        this.musicGain.gain.cancelScheduledValues(now);
        this.musicGain.gain.setValueAtTime(
          Math.max(0.0001, this.musicGain.gain.value),
          now,
        );
        this.musicGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
      }
      this.stopAmbientLoop();
    }
    return this.enabled;
  }

  public toggle(): boolean {
    return this.setEnabled(!this.enabled);
  }

  public pauseForHiddenTab(hidden: boolean) {
    if (!this.ctx || !this.musicGain || !this.enabled) return;
    const now = this.ctx.currentTime;
    this.musicGain.gain.cancelScheduledValues(now);
    if (hidden) {
      this.musicGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
    } else {
      this.ctx.resume().catch(() => {});
      this.musicGain.gain.exponentialRampToValueAtTime(0.18, now + 0.8);
    }
  }

  private startAmbientLoop() {
    if (this.intervalId !== null) return;
    this.playAmbientChord();
    this.intervalId = window.setInterval(() => {
      if (this.enabled && !document.hidden) {
        this.playAmbientChord();
      }
    }, 4600);
  }

  private stopAmbientLoop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private playAmbientChord() {
    const ctx = this.ensureContext();
    if (!ctx || !this.musicGain || !this.enabled) return;

    // Contemplative warm gallery progressions (Fmaj9 -> Em7 -> Dm9 -> Cmaj9)
    const chords = [
      [174.61, 220.0, 261.63, 329.63, 392.0],
      [164.81, 196.0, 246.94, 293.66, 392.0],
      [146.83, 220.0, 261.63, 329.63, 349.23],
      [130.81, 196.0, 246.94, 293.66, 329.63],
    ];
    const notes = chords[this.chordIndex % chords.length];
    this.chordIndex++;

    const now = ctx.currentTime;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(640, now);
    filter.frequency.exponentialRampToValueAtTime(1100, now + 2.2);
    filter.frequency.exponentialRampToValueAtTime(500, now + 5.2);
    filter.connect(this.musicGain);

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      osc.type = idx === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, now + idx * 0.14);
      osc.detune.setValueAtTime((idx % 2 === 0 ? 1 : -1) * 3.5, now);

      const start = now + idx * 0.12;
      const peak = idx === 0 ? 0.15 : 0.08;
      noteGain.gain.setValueAtTime(0.0001, start);
      noteGain.gain.linearRampToValueAtTime(peak, start + 1.1);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, start + 4.9);

      osc.connect(noteGain);
      noteGain.connect(filter);
      osc.start(start);
      osc.stop(start + 5.0);
    });
  }

  public playClick() {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(680, now);
    osc.frequency.exponentialRampToValueAtTime(290, now + 0.075);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.085);
  }

  // Sound effect when scrolling or switching to a project / artwork
  public playProjectScroll() {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;

    // 1. Tactile wooden gallery footstep (mid-bass body + wood click)
    const stepOsc = ctx.createOscillator();
    const stepGain = ctx.createGain();
    stepOsc.type = "triangle";
    stepOsc.frequency.setValueAtTime(250, now);
    stepOsc.frequency.exponentialRampToValueAtTime(88, now + 0.15);
    stepGain.gain.setValueAtTime(0.24, now);
    stepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    stepOsc.connect(stepGain);
    stepGain.connect(this.sfxGain);
    stepOsc.start(now);
    stepOsc.stop(now + 0.17);

    // 2. Smooth camera pan air swish (filtered noise)
    const noise = ctx.createBufferSource();
    noise.buffer = this.getNoiseBuffer(ctx);
    const swishFilter = ctx.createBiquadFilter();
    swishFilter.type = "bandpass";
    swishFilter.Q.value = 1.6;
    swishFilter.frequency.setValueAtTime(380, now);
    swishFilter.frequency.exponentialRampToValueAtTime(1180, now + 0.15);
    swishFilter.frequency.exponentialRampToValueAtTime(480, now + 0.34);

    const swishGain = ctx.createGain();
    swishGain.gain.setValueAtTime(0.001, now);
    swishGain.gain.linearRampToValueAtTime(0.22, now + 0.12);
    swishGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    noise.connect(swishFilter);
    swishFilter.connect(swishGain);
    swishGain.connect(this.sfxGain);
    noise.start(now);
    noise.stop(now + 0.36);

    // 3. Subtle warm gallery focus-lock harmonic (C5 -> E5)
    [523.25, 659.25].forEach((freq, idx) => {
      const tone = ctx.createOscillator();
      const toneGain = ctx.createGain();
      const t0 = now + 0.06 + idx * 0.065;
      tone.type = "sine";
      tone.frequency.setValueAtTime(freq, t0);
      toneGain.gain.setValueAtTime(0.001, t0);
      toneGain.gain.linearRampToValueAtTime(0.12, t0 + 0.025);
      toneGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.24);
      tone.connect(toneGain);
      toneGain.connect(this.sfxGain!);
      tone.start(t0);
      tone.stop(t0 + 0.25);
    });
  }

  // Sound effect when scrolling into a new Room Overview (menyorot arah ruangan)
  public playRoomScroll() {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;

    // 1. Two gentle museum footsteps entering the hall (0ms & 180ms)
    [0, 0.18].forEach((offset, idx) => {
      const t0 = now + offset;
      const stepOsc = ctx.createOscillator();
      const stepGain = ctx.createGain();
      stepOsc.type = "triangle";
      stepOsc.frequency.setValueAtTime(idx === 0 ? 220 : 245, t0);
      stepOsc.frequency.exponentialRampToValueAtTime(82, t0 + 0.15);
      stepGain.gain.setValueAtTime(0.22, t0);
      stepGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.16);
      stepOsc.connect(stepGain);
      stepGain.connect(this.sfxGain!);
      stepOsc.start(t0);
      stepOsc.stop(t0 + 0.17);
    });

    // 2. Warm architectural room-entry resonance chime (G4 -> D5)
    [392.0, 587.33].forEach((freq, idx) => {
      const t0 = now + 0.05 + idx * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t0);
      gain.gain.setValueAtTime(0.001, t0);
      gain.gain.linearRampToValueAtTime(0.14, t0 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.42);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(t0);
      osc.stop(t0 + 0.44);
    });
  }

  public playStep() {
    this.playProjectScroll();
  }

  // Two-stage cinematic eye-blink sound effect synchronized with the 1.48s blink transition
  public playBlink() {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;

    // Stage 1 (0.0s - 0.52s): Eyelid closing whoosh + descending warm tone
    const closeNoise = ctx.createBufferSource();
    closeNoise.buffer = this.getNoiseBuffer(ctx);
    const closeFilter = ctx.createBiquadFilter();
    closeFilter.type = "bandpass";
    closeFilter.Q.value = 1.4;
    closeFilter.frequency.setValueAtTime(1150, now);
    closeFilter.frequency.exponentialRampToValueAtTime(220, now + 0.5);

    const closeNoiseGain = ctx.createGain();
    closeNoiseGain.gain.setValueAtTime(0.001, now);
    closeNoiseGain.gain.linearRampToValueAtTime(0.32, now + 0.22);
    closeNoiseGain.gain.exponentialRampToValueAtTime(0.008, now + 0.52);

    closeNoise.connect(closeFilter);
    closeFilter.connect(closeNoiseGain);
    closeNoiseGain.connect(this.sfxGain);
    closeNoise.start(now);
    closeNoise.stop(now + 0.54);

    const closeOsc = ctx.createOscillator();
    const closeOscGain = ctx.createGain();
    closeOsc.type = "triangle";
    closeOsc.frequency.setValueAtTime(350, now);
    closeOsc.frequency.exponentialRampToValueAtTime(155, now + 0.5);
    closeOscGain.gain.setValueAtTime(0.001, now);
    closeOscGain.gain.linearRampToValueAtTime(0.2, now + 0.18);
    closeOscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.52);
    closeOsc.connect(closeOscGain);
    closeOscGain.connect(this.sfxGain);
    closeOsc.start(now);
    closeOsc.stop(now + 0.54);

    // Stage 2 (0.62s - 1.38s): Eyelid opening breath + warm awakening shimmer
    const openStart = now + 0.62;
    const openNoise = ctx.createBufferSource();
    openNoise.buffer = this.getNoiseBuffer(ctx);
    const openFilter = ctx.createBiquadFilter();
    openFilter.type = "bandpass";
    openFilter.Q.value = 1.5;
    openFilter.frequency.setValueAtTime(240, openStart);
    openFilter.frequency.exponentialRampToValueAtTime(1250, openStart + 0.68);

    const openNoiseGain = ctx.createGain();
    openNoiseGain.gain.setValueAtTime(0.001, openStart);
    openNoiseGain.gain.linearRampToValueAtTime(0.28, openStart + 0.25);
    openNoiseGain.gain.exponentialRampToValueAtTime(0.001, openStart + 0.74);

    openNoise.connect(openFilter);
    openFilter.connect(openNoiseGain);
    openNoiseGain.connect(this.sfxGain);
    openNoise.start(openStart);
    openNoise.stop(openStart + 0.76);

    [293.66, 440.0, 554.37].forEach((freq, idx) => {
      const t0 = openStart + idx * 0.07;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t0);
      gain.gain.setValueAtTime(0.001, t0);
      gain.gain.linearRampToValueAtTime(0.11, t0 + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.55);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(t0);
      osc.stop(t0 + 0.58);
    });
  }

  public playBook() {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;
    [392, 523.25].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + i * 0.07);
      gain.gain.setValueAtTime(0.14, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.24);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.26);
    });
  }

  public playGreet() {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;
    [440, 554.37, 659.25].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0.14, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.36);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.38);
    });
  }
}

export const galleryAudio = new GalleryAudioEngine();
