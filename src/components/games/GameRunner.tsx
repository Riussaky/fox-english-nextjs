"use client";

import Link from "next/link";
import { useState } from "react";
import type { Lesson } from "@/lib/content";
import type { ActivityType } from "@/lib/types";
import type { MascotSrcs } from "@/lib/generated-assets";
import type { BackgroundThemeId } from "./AnimatedBackground";
import { GameBackground } from "./GameBackground";
import { AnimatedMascot } from "@/components/ui/AnimatedMascot";
import { ACTIVITY_META, STARS_PER_ACTIVITY } from "@/lib/activity-types";
import { FlashcardsGame } from "./FlashcardsGame";
import { MemoryGame } from "./MemoryGame";
import { QuizGame } from "./QuizGame";
import { DragMatchGame } from "./DragMatchGame";
import { ScrambleGame } from "./ScrambleGame";
import { playComplete } from "@/lib/sound";
import { launchFireworks } from "@/lib/confetti";
import { saveAttempt } from "@/app/jugar/actions";

const GAME_COMPONENTS: Record<ActivityType, typeof FlashcardsGame> = {
  FLASHCARDS: FlashcardsGame,
  MEMORY: MemoryGame,
  QUIZ: QuizGame,
  DRAG: DragMatchGame,
  SCRAMBLE: ScrambleGame,
};

export function GameRunner({
  levelId,
  lesson,
  activityType,
  backgroundSrc,
  mascotSrcs,
}: {
  levelId: string;
  lesson: Lesson;
  activityType: ActivityType;
  backgroundSrc: string | null;
  mascotSrcs: MascotSrcs;
}) {
  const [stars, setStars] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const GameComponent = GAME_COMPONENTS[activityType];
  const meta = ACTIVITY_META[activityType];

  async function handleFinish(starsEarned: number) {
    setSaving(true);
    setStars(starsEarned);
    playComplete();
    launchFireworks();
    try {
      await saveAttempt({ levelId, lessonId: lesson.id, activityType, starsEarned });
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 py-10">
      <GameBackground src={backgroundSrc} theme={lesson.id as BackgroundThemeId} />

      {stars === null ? (
        <>
          <Link
            href={`/jugar/${levelId}/${lesson.id}`}
            className="fixed top-4 left-4 bg-white/85 backdrop-blur rounded-full px-4 py-1.5 text-sm font-semibold text-kid-ink/70 z-10"
          >
            ← Volver
          </Link>
          <h1 className="text-2xl font-bold text-kid-ink bg-white/85 backdrop-blur rounded-full px-6 py-2 shadow-sm">
            {lesson.icon} {lesson.name} — {meta.label}
          </h1>
          <div className="bg-white/90 backdrop-blur rounded-blob p-6 shadow-lg w-full flex justify-center">
            <GameComponent lesson={lesson} onFinish={handleFinish} />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-4 text-center bg-white/90 backdrop-blur rounded-blob p-8 shadow-lg max-w-sm">
          <AnimatedMascot mood="excited" srcs={mascotSrcs} className="w-24 h-24" />
          <h2 className="text-2xl font-bold text-kid-ink">
            {stars >= 3 ? "¡Perfecto! 🌟" : stars === 2 ? "¡Muy bien! 👍" : "¡Bien hecho! Seguí practicando"}
          </h2>
          <p className="text-kid-ink/60">{meta.label}</p>
          <div className="text-3xl">
            {"⭐".repeat(stars)}
            {"☆".repeat(STARS_PER_ACTIVITY - stars)}
          </div>
          <Link
            href={`/jugar/${levelId}/${lesson.id}`}
            aria-disabled={saving}
            className="rounded-full px-6 py-3 text-lg font-semibold shadow-[0_4px_0_rgba(0,0,0,0.15)] active:translate-y-1 active:shadow-none transition bg-kid-teal text-white hover:bg-kid-teal/90"
          >
            Continuar
          </Link>
        </div>
      )}
    </main>
  );
}
