"use client";

import { useEffect, useState } from "react";
import type { Lesson, Word } from "@/lib/content";
import { WordIcon } from "@/components/ui/WordIcon";
import { shuffle, starsForScore } from "@/lib/utils";
import { speak } from "@/lib/speech";
import { playClick, playCorrect, playIncorrect } from "@/lib/sound";

interface Letter {
  ch: string;
  id: number;
}

// Igual que en los otros juegos: nada de shuffle() en el render inicial
// (server y primer render de cliente tienen que coincidir para evitar un
// error de hidratación) — el orden real se arma en un useEffect post-mount.
function buildLetters(en: string, randomize: boolean): Letter[] {
  const letters = en.toLowerCase().split("").map((ch, i) => ({ ch, id: i }));
  return randomize ? shuffle(letters) : letters;
}

/** Port de renderScramble en ingles-kids-app/app.js — tocar letras para armar la palabra. */
export function ScrambleGame({ lesson, onFinish }: { lesson: Lesson; onFinish: (stars: number) => void }) {
  const [words, setWords] = useState<Word[]>(lesson.words);
  const [index, setIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [shake, setShake] = useState(false);
  const [correctFlash, setCorrectFlash] = useState(false);

  const word = words[index];
  const [letters, setLetters] = useState<Letter[]>(() => buildLetters(words[0].en, false));
  const [slots, setSlots] = useState<(Letter | null)[]>(() => new Array(words[0].en.length).fill(null));

  useEffect(() => {
    const shuffled = shuffle(lesson.words);
    setWords(shuffled);
    setLetters(buildLetters(shuffled[0].en, true));
    setSlots(new Array(shuffled[0].en.length).fill(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function usedIds(): Set<number> {
    return new Set(slots.filter((s): s is Letter => s !== null).map((s) => s.id));
  }

  function onLetterClick(letter: Letter) {
    if (usedIds().has(letter.id)) return;
    const emptyIdx = slots.findIndex((s) => s === null);
    if (emptyIdx === -1) return;
    const nextSlots = [...slots];
    nextSlots[emptyIdx] = letter;
    setSlots(nextSlots);
    playClick();

    if (nextSlots.every((s) => s !== null)) {
      checkWord(nextSlots as Letter[]);
    }
  }

  function onSlotClick(idx: number) {
    if (!slots[idx]) return;
    const next = [...slots];
    next[idx] = null;
    setSlots(next);
  }

  function checkWord(filled: Letter[]) {
    const attempt = filled.map((s) => s.ch).join("");
    if (attempt === word.en.toLowerCase()) {
      playCorrect();
      speak(word.en, "en");
      setCorrectFlash(true);
      setTimeout(() => {
        setCorrectFlash(false);
        const next = index + 1;
        if (next < words.length) {
          setIndex(next);
          setLetters(buildLetters(words[next].en, true));
          setSlots(new Array(words[next].en.length).fill(null));
        } else {
          onFinish(starsForScore(mistakes, words.length));
        }
      }, 900);
    } else {
      playIncorrect();
      setMistakes((m) => m + 1);
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setSlots(new Array(word.en.length).fill(null));
      }, 500);
    }
  }

  const used = usedIds();

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      <p className="text-sm font-semibold text-kid-ink/70 bg-white/90 backdrop-blur rounded-full px-4 py-1.5 shadow-sm">
        Palabra {index + 1} de {words.length}
      </p>
      <div className="w-20 h-20">
        <WordIcon icon={word.icon} />
      </div>
      <p className="text-kid-ink/80 font-semibold bg-white/90 backdrop-blur rounded-full px-4 py-1.5 shadow-sm">
        Pista: <b>&quot;{word.es}&quot;</b>
      </p>

      <div className={`flex gap-2 flex-wrap justify-center ${shake ? "animate-wobble" : ""} ${correctFlash ? "animate-pop" : ""}`}>
        {slots.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSlotClick(i)}
            className={`w-10 h-12 rounded-lg border-2 flex items-center justify-center text-xl font-bold uppercase ${
              s ? "bg-kid-teal text-white border-kid-teal" : "bg-white/60 border-kid-ink/20"
            }`}
          >
            {s?.ch ?? ""}
          </button>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap justify-center">
        {letters.map((l) => (
          <button
            key={l.id}
            type="button"
            disabled={used.has(l.id)}
            onClick={() => onLetterClick(l)}
            className={`w-10 h-10 rounded-full bg-kid-purple text-white font-bold uppercase shadow-md ${
              used.has(l.id) ? "invisible" : ""
            }`}
          >
            {l.ch}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setSlots(new Array(word.en.length).fill(null))}
        className="text-sm text-kid-ink/60 underline bg-white/85 backdrop-blur rounded-full px-3 py-1 shadow-sm"
      >
        🧹 Borrar
      </button>
    </div>
  );
}
