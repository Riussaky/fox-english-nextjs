"use client";

import { useEffect, useRef, useState } from "react";
import type { Lesson, Word } from "@/lib/content";
import { WordIcon } from "@/components/ui/WordIcon";
import { shuffle, starsForScore } from "@/lib/utils";
import { speak } from "@/lib/speech";
import { playClick } from "@/lib/sound";

interface MemCard {
  id: number;
  pairId: number;
  type: "icon" | "text";
  word: Word;
}

// Igual que en QuizGame: el orden aleatorio se arma en un useEffect (solo
// cliente) para que el primer render coincida entre servidor y cliente y
// React no tire un error de hidratación.
function buildCards(words: Word[], randomize: boolean): MemCard[] {
  const chosen = (randomize ? shuffle(words) : words).slice(0, 6);
  const built: MemCard[] = [];
  chosen.forEach((w, i) => {
    built.push({ id: i * 2, pairId: i, type: "icon", word: w });
    built.push({ id: i * 2 + 1, pairId: i, type: "text", word: w });
  });
  return randomize ? shuffle(built) : built;
}

/** Port de renderMemory en ingles-kids-app/app.js — 6 parejas ícono+palabra. */
export function MemoryGame({ lesson, onFinish }: { lesson: Lesson; onFinish: (stars: number) => void }) {
  const [cards, setCards] = useState<MemCard[]>(() => buildCards(lesson.words, false));
  useEffect(() => {
    setCards(buildCards(lesson.words, true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [lock, setLock] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const totalPairs = cards.length / 2;

  // Se dispara desde un efecto que reacciona al `matched` ya confirmado por
  // React, no calculado "a mano" antes de setMatched (misma razón que en
  // DragMatchGame: leer el tamaño del set del closure justo antes de
  // actualizarlo puede quedar desactualizado si hay varias actualizaciones
  // en el mismo batch). El ref evita que dispare onFinish más de una vez.
  const finishedRef = useRef(false);
  useEffect(() => {
    if (cards.length > 0 && matched.size === cards.length && !finishedRef.current) {
      finishedRef.current = true;
      const t = setTimeout(() => onFinish(starsForScore(mistakes, totalPairs)), 400);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matched, cards.length]);

  function onCardClick(id: number) {
    if (lock || matched.has(id) || flipped.includes(id)) return;
    playClick();

    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }

    const nextFlipped = [...flipped, id];
    setFlipped(nextFlipped);
    setLock(true);

    const a = cards.find((c) => c.id === flipped[0])!;
    const b = cards.find((c) => c.id === id)!;

    if (a.pairId === b.pairId && a.type !== b.type) {
      speak(a.word.en, "en");
      setTimeout(() => {
        setMatched((prev) => {
          const next = new Set(prev);
          next.add(a.id);
          next.add(b.id);
          return next;
        });
        setFlipped([]);
        setLock(false);
      }, 200);
    } else {
      setMistakes((m) => m + 1);
      setTimeout(() => {
        setFlipped([]);
        setLock(false);
      }, 800);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg">
      <p className="text-sm font-semibold text-kid-ink/60">
        Encontrá la pareja: imagen + palabra ({matched.size / 2}/{totalPairs})
      </p>
      <div className="grid grid-cols-4 gap-3">
        {cards.map((c) => {
          const isFaceUp = flipped.includes(c.id) || matched.has(c.id);
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onCardClick(c.id)}
              className={`flip-card w-16 h-16 sm:w-20 sm:h-20 ${isFaceUp ? "flipped" : ""} ${matched.has(c.id) ? "opacity-60" : ""}`}
            >
              <div className="flip-card-inner relative w-full h-full">
                <div className="flip-card-face absolute inset-0 rounded-xl bg-kid-purple flex items-center justify-center text-2xl">
                  ❓
                </div>
                <div className="flip-card-face flip-card-back absolute inset-0 rounded-xl bg-white shadow p-1 flex items-center justify-center">
                  {c.type === "icon" ? (
                    <div className="w-full h-full">
                      <WordIcon icon={c.word.icon} />
                    </div>
                  ) : (
                    <span className="text-xs sm:text-sm font-bold text-kid-ink text-center">{c.word.en}</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
