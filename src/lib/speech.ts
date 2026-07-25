// Lectura en voz alta con la Web Speech API del navegador. A diferencia de
// NumiLandia (todo en español), acá hace falta hablar en dos idiomas: las
// instrucciones/chrome en español (es-AR) y el vocabulario en inglés
// (en-US) — por eso `speak()` recibe un segundo parámetro opcional de idioma.

import { isVoiceEnabled } from "@/lib/preferences";

let cachedVoices: SpeechSynthesisVoice[] = [];

function isSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

if (isSupported()) {
  const refresh = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
  refresh();
  window.speechSynthesis.onvoiceschanged = refresh;
}

function pickVoice(lang: "es" | "en"): SpeechSynthesisVoice | undefined {
  if (cachedVoices.length === 0 && isSupported()) {
    cachedVoices = window.speechSynthesis.getVoices();
  }
  if (lang === "en") {
    return (
      cachedVoices.find((v) => v.lang?.toLowerCase() === "en-us") ??
      cachedVoices.find((v) => v.lang?.toLowerCase().startsWith("en")) ??
      undefined
    );
  }
  return (
    cachedVoices.find((v) => v.lang?.toLowerCase() === "es-ar") ??
    cachedVoices.find((v) => v.lang?.toLowerCase().startsWith("es")) ??
    undefined
  );
}

/**
 * @param lang "es" para instrucciones (default), "en" para palabras de vocabulario.
 */
export function speak(text: string, lang: "es" | "en" = "es") {
  if (!isSupported() || !isVoiceEnabled() || !text) return;
  const synth = window.speechSynthesis;
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickVoice(lang);
  if (voice) utterance.voice = voice;
  utterance.lang = voice?.lang ?? (lang === "en" ? "en-US" : "es-ES");
  utterance.rate = lang === "en" ? 0.85 : 0.95;
  utterance.pitch = lang === "en" ? 1.1 : 1.05;
  synth.speak(utterance);
}

export function cancelSpeech() {
  if (!isSupported()) return;
  window.speechSynthesis.cancel();
}
