"use client";

import { useEffect, useState } from "react";
import { startBackgroundMusic, stopBackgroundMusic } from "@/lib/sound";
import { cancelSpeech } from "@/lib/speech";
import {
  isMusicEnabled,
  isVoiceEnabled,
  setMusicEnabled,
  setVoiceEnabled,
} from "@/lib/preferences";

export function SoundControls() {
  const [musicOn, setMusicOn] = useState(true);
  const [voiceOn, setVoiceOn] = useState(true);

  useEffect(() => {
    const music = isMusicEnabled();
    const voice = isVoiceEnabled();
    setMusicOn(music);
    setVoiceOn(voice);
    if (music) startBackgroundMusic();
    return () => stopBackgroundMusic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleMusic() {
    const next = !musicOn;
    setMusicOn(next);
    setMusicEnabled(next);
    if (next) startBackgroundMusic();
    else stopBackgroundMusic();
  }

  function toggleVoice() {
    const next = !voiceOn;
    setVoiceOn(next);
    setVoiceEnabled(next);
    if (!next) cancelSpeech();
  }

  return (
    <div className="fixed bottom-4 right-4 z-20 flex gap-2">
      <button
        onClick={toggleMusic}
        aria-label={musicOn ? "Silenciar música" : "Activar música"}
        className="h-12 w-12 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center text-xl"
      >
        {musicOn ? "🎵" : "🔇"}
      </button>
      <button
        onClick={toggleVoice}
        aria-label={voiceOn ? "Silenciar voz" : "Activar voz"}
        className="h-12 w-12 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center text-xl"
      >
        {voiceOn ? "🔊" : "🔈"}
      </button>
    </div>
  );
}
