import Link from "next/link";
import { redirect } from "next/navigation";
import { getActiveChild } from "@/lib/active-child";
import { getChildStarsMap, lessonStars } from "@/lib/progress";
import { LEVELS } from "@/lib/content";
import { MAX_LESSON_STARS } from "@/lib/activity-types";
import { AnimatedMascot } from "@/components/ui/AnimatedMascot";
import { GameBackground } from "@/components/games/GameBackground";
import { getGeneratedAssetAnyExt, getMascotSrcs, getAvatarSrc } from "@/lib/generated-assets";
import { Avatar } from "@/components/ui/Avatar";

export default async function NivelesPage() {
  const child = await getActiveChild();
  if (!child) redirect("/perfiles");

  const starsMap = await getChildStarsMap(child.id);
  const backgroundSrc = getGeneratedAssetAnyExt("backgrounds/home");
  const mascotSrcs = getMascotSrcs();

  const totalStars = LEVELS.reduce(
    (sum, level) => sum + level.lessons.reduce((s, lesson) => s + lessonStars(starsMap, level.id, lesson.id), 0),
    0
  );

  return (
    <main className="min-h-screen flex flex-col items-center gap-8 px-4 py-12">
      <GameBackground src={backgroundSrc} theme="home" />

      <div className="flex items-center gap-3 bg-white/85 backdrop-blur rounded-full pl-2 pr-5 py-2 shadow-sm">
        <Avatar avatarId={child.avatarId} src={getAvatarSrc(child.avatarId)} size={40} />
        <span className="font-semibold text-kid-ink">{child.name}</span>
        <span className="text-kid-ink/50">·</span>
        <span className="font-semibold text-kid-yellow">⭐ {totalStars}</span>
      </div>

      <AnimatedMascot mood="happy" srcs={mascotSrcs} className="w-24 h-24" />
      <p className="text-lg text-kid-ink bg-white/85 backdrop-blur rounded-blob px-6 py-3 shadow-sm text-center max-w-sm">
        ¡Hola! Soy <b>Fox</b> 🦊 ¿Qué nivel querés practicar hoy?
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-3xl">
        {LEVELS.map((level) => {
          const totalLessonStars = level.lessons.length * MAX_LESSON_STARS;
          const earned = level.lessons.reduce((s, lesson) => s + lessonStars(starsMap, level.id, lesson.id), 0);
          const pct = Math.round((earned / totalLessonStars) * 100);
          return (
            <Link
              key={level.id}
              href={`/jugar/${level.id}`}
              className="flex flex-col items-center gap-2 rounded-blob p-5 text-white shadow-md hover:-translate-y-1 transition"
              style={{ background: level.color }}
            >
              <h2 className="text-xl font-bold">{level.name}</h2>
              <p className="text-sm opacity-90 text-center">{level.subtitle}</p>
              <div className="w-full h-2 rounded-full bg-white/30 overflow-hidden mt-2">
                <div className="h-full bg-white" style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs opacity-90">
                {earned} / {totalLessonStars} ⭐
              </p>
            </Link>
          );
        })}
      </div>

      <Link
        href="/perfiles"
        className="text-sm text-kid-ink/60 underline bg-white/80 backdrop-blur rounded-full px-4 py-1.5"
      >
        Cambiar de perfil
      </Link>
    </main>
  );
}
