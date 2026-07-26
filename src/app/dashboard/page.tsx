import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Avatar } from "@/components/ui/Avatar";
import { AnimatedMascot } from "@/components/ui/AnimatedMascot";
import { GameBackground } from "@/components/games/GameBackground";
import { getGeneratedAssetAnyExt, getMascotSrcs, getAvatarSrc } from "@/lib/generated-assets";
import { LEVELS, resolveLessonKey } from "@/lib/content";
import { ACTIVITY_META } from "@/lib/activity-types";
import { getChildStarsMap, lessonStars, levelAvgStars } from "@/lib/progress";
import { LevelChart } from "@/components/dashboard/LevelChart";
import type { Child, LessonAttempt } from "@prisma/client";

async function ChildProgressCard({ child }: { child: Child & { attempts: LessonAttempt[] } }) {
  const starsMap = await getChildStarsMap(child.id);
  const totalStars = LEVELS.reduce(
    (sum, level) => sum + level.lessons.reduce((s, lesson) => s + lessonStars(starsMap, level.id, lesson.id), 0),
    0
  );
  const chartData = LEVELS.map((level) => ({ level: level.name, avgStars: levelAvgStars(starsMap, level) }));

  return (
    <section className="rounded-blob bg-white p-6 shadow-sm flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Avatar avatarId={child.avatarId} src={getAvatarSrc(child.avatarId)} size={56} />
        <div>
          <p className="font-bold text-kid-ink text-lg">{child.name}</p>
        </div>
        <div className="ml-auto text-right text-sm text-kid-ink/60">
          <p>{totalStars} ⭐ en total</p>
        </div>
      </div>

      <LevelChart data={chartData} />

      {child.attempts.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-kid-ink/70">Últimas actividades</p>
          {child.attempts.map((attempt) => {
            const resolved = resolveLessonKey(attempt.lessonKey);
            const activityLabel =
              ACTIVITY_META[attempt.activityType as keyof typeof ACTIVITY_META]?.label ?? attempt.activityType;
            const title = resolved ? `${resolved.lesson.name} — ${activityLabel}` : attempt.lessonKey;
            return (
              <div key={attempt.id} className="flex items-center justify-between text-sm">
                <span className="text-kid-ink/80">{title}</span>
                <span className="text-kid-yellow font-semibold">
                  {"⭐".repeat(attempt.starsEarned)}
                  {"☆".repeat(3 - attempt.starsEarned)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const children = await db.child.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
    include: {
      attempts: {
        orderBy: { completedAt: "desc" },
        take: 5,
      },
    },
  });
  const backgroundSrc = getGeneratedAssetAnyExt("backgrounds/home");
  const mascotSrcs = getMascotSrcs();

  return (
    <main className="min-h-screen flex flex-col items-center gap-8 px-4 py-10">
      <GameBackground src={backgroundSrc} theme="home" />
      <AnimatedMascot mood="happy" srcs={mascotSrcs} className="w-16 h-16" />
      <h1 className="text-3xl font-bold text-kid-ink bg-white/80 backdrop-blur rounded-full px-6 py-2 shadow-sm">
        Panel de familia / docente
      </h1>
      <Link
        href="/perfiles"
        className="text-sm text-kid-ink/60 underline -mt-4 bg-white/80 backdrop-blur rounded-full px-4 py-1.5"
      >
        Volver a perfiles
      </Link>

      {children.length === 0 && (
        <p className="text-kid-ink/60">Todavía no creaste ningún perfil de niño/a.</p>
      )}

      <div className="flex flex-col gap-6 w-full max-w-2xl">
        {children.map((child) => (
          <ChildProgressCard key={child.id} child={child} />
        ))}
      </div>
    </main>
  );
}
