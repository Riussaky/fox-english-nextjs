import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getActiveChild } from "@/lib/active-child";
import { getChildStarsMap, activityStars } from "@/lib/progress";
import { findLesson } from "@/lib/content";
import { ACTIVITY_TYPES, ACTIVITY_META, STARS_PER_ACTIVITY } from "@/lib/activity-types";
import { GameBackground } from "@/components/games/GameBackground";
import type { BackgroundThemeId } from "@/components/games/AnimatedBackground";
import { getGeneratedAssetAnyExt } from "@/lib/generated-assets";

export default async function LessonMenuPage({
  params,
}: {
  params: Promise<{ levelId: string; lessonId: string }>;
}) {
  const { levelId, lessonId } = await params;
  const child = await getActiveChild();
  if (!child) redirect("/perfiles");

  const lesson = findLesson(levelId, lessonId);
  if (!lesson) notFound();

  const starsMap = await getChildStarsMap(child.id);
  const backgroundSrc = getGeneratedAssetAnyExt(`backgrounds/${lesson.id}`);

  return (
    <main className="min-h-screen flex flex-col items-center gap-6 px-4 py-12">
      <GameBackground src={backgroundSrc} theme={lesson.id as BackgroundThemeId} />

      <Link
        href={`/jugar/${levelId}`}
        className="self-start bg-white/85 backdrop-blur rounded-full px-4 py-1.5 text-sm font-semibold text-kid-ink/70"
      >
        ← Volver
      </Link>

      <h1 className="text-3xl font-bold text-kid-ink bg-white/85 backdrop-blur rounded-full px-6 py-2 shadow-sm">
        {lesson.icon} {lesson.name}
      </h1>
      <p className="text-kid-ink/70 bg-white/85 backdrop-blur rounded-blob px-5 py-2 shadow-sm text-center max-w-sm">
        Elegí cómo querés practicar estas palabras.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-2xl">
        {ACTIVITY_TYPES.map((activityType) => {
          const meta = ACTIVITY_META[activityType];
          const earned = activityStars(starsMap, levelId, lessonId, activityType);
          return (
            <Link
              key={activityType}
              href={`/jugar/${levelId}/${lessonId}/${meta.slug}`}
              className="flex flex-col items-center gap-1 rounded-blob bg-white/90 backdrop-blur p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
            >
              <span className="text-3xl">{meta.emoji}</span>
              <p className="font-bold text-kid-ink text-center">{meta.label}</p>
              <p className="text-xs text-kid-ink/50 text-center">{meta.description}</p>
              <p className="text-xs font-semibold text-kid-yellow">
                {"⭐".repeat(earned)}
                {"☆".repeat(STARS_PER_ACTIVITY - earned)}
              </p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
