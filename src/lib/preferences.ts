// Preferencias simples persistidas en localStorage. Sin contexto de React:
// se leen/escriben directo donde hacen falta (sound.ts, speech.ts, UI).

const MUSIC_KEY = "foxenglish-music-enabled";
const VOICE_KEY = "foxenglish-voice-enabled";

function readBool(key: string, fallback: boolean): boolean {
  if (typeof window === "undefined") return fallback;
  const stored = window.localStorage.getItem(key);
  if (stored === null) return fallback;
  return stored === "1";
}

function writeBool(key: string, value: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, value ? "1" : "0");
}

export function isMusicEnabled(): boolean {
  return readBool(MUSIC_KEY, true);
}

export function setMusicEnabled(value: boolean) {
  writeBool(MUSIC_KEY, value);
}

export function isVoiceEnabled(): boolean {
  return readBool(VOICE_KEY, true);
}

export function setVoiceEnabled(value: boolean) {
  writeBool(VOICE_KEY, value);
}
