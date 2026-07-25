import { redirect, notFound } from "next/navigation";
import { getActiveChild } from "@/lib/active-child";
import { findLesson } from "@/lib/content";
import { activityTypeFromSlug } from "@/lib/activity-types";
import { getGeneratedAssetAnyExt, getMascotSrcs } from "@/lib/generated-assets";
import { GameRunner } from "@/components/games/GameRunner";

export default async function GamePage({
  params,
}: {
  params: Promise<{ levelId: string; lessonId: string; activity: string }>;
}) {
  const { levelId, lessonId, activity } = await params;
  const child = await getActiveChild();
  if (!child) redirect("/perfiles");

  const lesson = findLesson(levelId, lessonId);
  const activityType = activityTypeFromSlug(activity);
  if (!lesson || !activityType) notFound();

  const backgroundSrc = getGeneratedAssetAnyExt(`backgrounds/${lesson.id}`);
  const mascotSrcs = getMascotSrcs();

  return (
    <GameRunner
      levelId={levelId}
      lesson={lesson}
      activityType={activityType}
      backgroundSrc={backgroundSrc}
      mascotSrcs={mascotSrcs}
    />
  );
}
