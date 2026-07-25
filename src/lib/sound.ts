// Motor de sonido sintetizado con Web Audio API — sin archivos de audio.
// Melodía distinta a las otras dos apps de la familia: acá es una escala
// pentatónica de Sol mayor con timbre de "campanita" (onda cuadrada suave +
// segundo armónico), más rápida y juguetona, sin pad grave de fondo.

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone(freq: number, time: number, dur: number, peak: number, type: OscillatorType = "sine") {
  const audio = getCtx();
  if (!audio) return;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.linearRampToValueAtTime(peak, time + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start(time);
  osc.stop(time + dur + 0.05);
}

export function playCorrect() {
  const audio = getCtx();
  if (!audio) return;
  const t = audio.currentTime;
  [587.33, 739.99, 880.0].forEach((freq, i) => tone(freq, t + i * 0.07, 0.2, 0.18, "triangle"));
}

export function playIncorrect() {
  const audio = getCtx();
  if (!audio) return;
  const t = audio.currentTime;
  tone(196, t, 0.25, 0.15, "sawtooth");
}

export function playComplete() {
  const audio = getCtx();
  if (!audio) return;
  const t = audio.currentTime;
  [587.33, 659.25, 739.99, 880.0, 1174.66].forEach((freq, i) =>
    tone(freq, t + i * 0.09, 0.32, 0.16, "triangle")
  );
}

export function playClick() {
  const audio = getCtx();
  if (!audio) return;
  tone(440, audio.currentTime, 0.07, 0.1, "square");
}

// ---------------- Música de fondo ----------------
// Pentatónica de Sol mayor (G A B D E), timbre de "campanita" — onda
// cuadrada suave apagada rápido + un segundo oscilador una octava arriba a
// bajo volumen para dar brillo, sin pad grave sostenido (a diferencia de
// NumiLandia). Tempo más rápido, sensación juguetona/curiosa.

const MELODY = [392.0, 440.0, 493.88, 587.33, 659.25, 587.33, 493.88, 440.0]; // G A B D E D B A
const NOTE_DUR = 0.28;

let musicGain: GainNode | null = null;
let musicPlaying = false;
let schedulerTimer: ReturnType<typeof setTimeout> | null = null;
let nextNoteTime = 0;
let noteIndex = 0;

function ensureMusicGain(audio: AudioContext): GainNode {
  if (!musicGain) {
    musicGain = audio.createGain();
    musicGain.gain.value = 0;
    musicGain.connect(audio.destination);
  }
  return musicGain;
}

function scheduleNote(audio: AudioContext, gain: GainNode, time: number) {
  const freq = MELODY[noteIndex % MELODY.length];
  const osc = audio.createOscillator();
  const shimmer = audio.createOscillator();
  const noteGain = audio.createGain();
  const shimmerGain = audio.createGain();

  osc.type = "square";
  osc.frequency.value = freq;
  shimmer.type = "sine";
  shimmer.frequency.value = freq * 2;
  shimmerGain.gain.value = 0.06;

  noteGain.gain.setValueAtTime(0.0001, time);
  noteGain.gain.linearRampToValueAtTime(0.14, time + 0.02);
  noteGain.gain.setValueAtTime(0.14, time + NOTE_DUR * 0.35);
  noteGain.gain.exponentialRampToValueAtTime(0.0001, time + NOTE_DUR * 0.9);

  osc.connect(noteGain);
  shimmer.connect(shimmerGain);
  shimmerGain.connect(noteGain);
  noteGain.connect(gain);

  osc.start(time);
  shimmer.start(time);
  osc.stop(time + NOTE_DUR + 0.05);
  shimmer.stop(time + NOTE_DUR + 0.05);

  noteIndex++;
}

function schedulerLoop() {
  const audio = ctx;
  if (!audio || !musicGain || !musicPlaying) return;
  while (nextNoteTime < audio.currentTime + 0.3) {
    scheduleNote(audio, musicGain, nextNoteTime);
    nextNoteTime += NOTE_DUR;
  }
  schedulerTimer = setTimeout(schedulerLoop, 100);
}

export function startBackgroundMusic() {
  const audio = getCtx();
  if (!audio || musicPlaying) return;
  musicPlaying = true;

  const gain = ensureMusicGain(audio);
  gain.gain.cancelScheduledValues(audio.currentTime);
  gain.gain.setValueAtTime(gain.gain.value, audio.currentTime);
  gain.gain.linearRampToValueAtTime(1, audio.currentTime + 1.0);

  nextNoteTime = audio.currentTime + 0.1;
  noteIndex = 0;
  schedulerLoop();
}

export function stopBackgroundMusic() {
  musicPlaying = false;
  if (schedulerTimer) clearTimeout(schedulerTimer);
  schedulerTimer = null;

  const audio = ctx;
  if (audio && musicGain) {
    musicGain.gain.cancelScheduledValues(audio.currentTime);
    musicGain.gain.setValueAtTime(musicGain.gain.value, audio.currentTime);
    musicGain.gain.linearRampToValueAtTime(0.0001, audio.currentTime + 0.5);
  }
}

export function isBackgroundMusicPlaying(): boolean {
  return musicPlaying;
}
