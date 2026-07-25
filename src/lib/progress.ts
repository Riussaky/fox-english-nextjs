import { db } from "@/lib/db";
import { ACTIVITY_TYPES } from "@/lib/activity-types";
import { lessonKey as buildLessonKey, type Level } from "@/lib/content";
import type { ActivityType } from "@/lib/types";

/** Mapa "lessonKey.activityType" -> mejor puntaje (1-3) obtenido, para un niño/a. */
export async function getChildStarsMap(childId: string): Promise<Map<string, number>> {
  const rows = await db.lessonAttempt.groupBy({
    by: ["lessonKey", "activityType"],
    where: { childId },
    _max: { starsEarned: true },
  });
  const map = new Map<string, number>();
  for (const r of rows) {
    map.set(`${r.lessonKey}.${r.activityType}`, r._max.starsEarned ?? 0);
  }
  return map;
}

export function activityStars(starsMap: Map<string, number>, levelId: string, lessonId: string, activityType: ActivityType): number {
  return starsMap.get(`${buildLessonKey(levelId, lessonId)}.${activityType}`) ?? 0;
}

export function lessonStars(starsMap: Map<string, number>, levelId: string, lessonId: string): number {
  const key = buildLessonKey(levelId, lessonId);
  return ACTIVITY_TYPES.reduce((sum, a) => sum + (starsMap.get(`${key}.${a}`) ?? 0), 0);
}

/** Promedio de estrellas (0-3) entre todas las combinaciones lección×actividad
 * ya jugadas dentro de un nivel — para el gráfico del dashboard. */
export function levelAvgStars(starsMap: Map<string, number>, level: Level): number {
  const values: number[] = [];
  for (const lesson of level.lessons) {
    const key = buildLessonKey(level.id, lesson.id);
    for (const activityType of ACTIVITY_TYPES) {
      const v = starsMap.get(`${key}.${activityType}`);
      if (v !== undefined) values.push(v);
    }
  }
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}
