"use client";

import { useState } from "react";
import type { Lesson } from "@/lib/content";
import { WordIcon } from "@/components/ui/WordIcon";
import { KidButton } from "@/components/ui/Button";
import { speak } from "@/lib/speech";
import { playClick } from "@/lib/sound";

/** Port de renderFlashcards en ingles-kids-app/app.js — flip card, navegar, escuchar. */
export function FlashcardsGame({ lesson, onFinish }: { lesson: Lesson; onFinish: (stars: number) => void }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const word = lesson.words[index];
  const isLast = index === lesson.words.length - 1;

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      <p className="text-sm font-semibold text-kid-ink/60">
        Tarjeta {index + 1} de {lesson.words.length}
      </p>

      <div
        className={`flip-card w-64 h-72 cursor-pointer ${flipped ? "flipped" : ""}`}
        onClick={() => setFlipped((f) => !f)}
      >
        <div className="flip-card-inner relative w-full h-full">
          <div className="flip-card-face absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-blob bg-white shadow-lg p-4">
            <div className="w-24 h-24">
              <WordIcon icon={word.icon} />
            </div>
            <p className="text-2xl font-bold text-kid-ink">{word.en}</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                speak(word.en, "en");
              }}
              className="text-sm font-semibold text-kid-teal underline"
            >
              🔊 Escuchar
            </button>
          </div>
          <div className="flip-card-face flip-card-back absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-blob bg-kid-teal text-white shadow-lg p-4">
            <p className="text-3xl font-bold">{word.es}</p>
            <p className="text-lg opacity-80">= {word.en}</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-kid-ink/50">Tocá la tarjeta para voltearla</p>

      <div className="flex items-center gap-3">
        <KidButton
          type="button"
          variant="ghost"
          disabled={index === 0}
          onClick={() => {
            playClick();
            setIndex((i) => i - 1);
            setFlipped(false);
          }}
        >
          ←
        </KidButton>
        {isLast ? (
          <KidButton type="button" onClick={() => onFinish(3)}>
            ¡Terminar! 🎉
          </KidButton>
        ) : (
          <KidButton
            type="button"
            variant="ghost"
            onClick={() => {
              playClick();
              setIndex((i) => i + 1);
              setFlipped(false);
            }}
          >
            →
          </KidButton>
        )}
      </div>
    </div>
  );
}
