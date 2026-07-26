import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getActiveChild } from "@/lib/active-child";
import { getChildStarsMap, lessonStars } from "@/lib/progress";
import { findLevel } from "@/lib/content";
import { MAX_LESSON_STARS } from "@/lib/activity-types";
import { GameBackground } from "@/components/games/GameBackground";
import { getGeneratedAssetAnyExt } from "@/lib/generated-assets";

export default async function LevelPage({ params }: { params: Promise<{ levelId: string }> }) {
  const { levelId } = await params;
  const child = await getActiveChild();
  if (!child) redirect("/perfiles");

  const level = findLevel(levelId);
  if (!level) notFound();

  const starsMap = await getChildStarsMap(child.id);
  const backgroundSrc = getGeneratedAssetAnyExt("backgrounds/home");

  return (
    <main className="min-h-screen flex flex-col items-center gap-6 px-4 py-12">
      <GameBackground src={backgroundSrc} theme="home" />

      <Link href="/jugar" className="self-start bg-white/85 backdrop-blur rounded-full px-4 py-1.5 text-sm font-semibold text-kid-ink/70">
        ← Volver
      </Link>

      <h1 className="text-3xl font-bold text-kid-ink bg-white/85 backdrop-blur rounded-full px-6 py-2 shadow-sm">
        {level.name}
      </h1>
      <p className="text-kid-ink/70 bg-white/85 backdrop-blur rounded-blob px-5 py-2 shadow-sm text-center max-w-sm">
        {level.subtitle} Elegí una lección para empezar.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
        {level.lessons.map((lesson) => {
          const earned = lessonStars(starsMap, level.id, lesson.id);
          return (
            <Link
              key={lesson.id}
              href={`/jugar/${level.id}/${lesson.id}`}
              className="flex flex-col gap-2 rounded-blob bg-white/90 backdrop-blur p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
            >
              <span className="text-xl font-bold text-kid-ink">{lesson.name}</span>
              <span className="text-xs font-semibold text-kid-ink/50">
                ⭐ {earned} / {MAX_LESSON_STARS}
              </span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
