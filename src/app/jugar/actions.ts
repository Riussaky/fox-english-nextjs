"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getActiveChild } from "@/lib/active-child";
import { lessonKey } from "@/lib/content";
import { attemptInputSchema } from "@/lib/types";

export async function saveAttempt(input: {
  levelId: string;
  lessonId: string;
  activityType: string;
  starsEarned: number;
}) {
  const child = await getActiveChild();
  if (!child) throw new Error("No hay perfil activo");

  const parsed = attemptInputSchema.parse({ childId: child.id, ...input });

  await db.lessonAttempt.create({
    data: {
      childId: parsed.childId,
      lessonKey: lessonKey(parsed.levelId, parsed.lessonId),
      activityType: parsed.activityType,
      starsEarned: parsed.starsEarned,
    },
  });

  revalidatePath("/jugar");
  revalidatePath("/dashboard");
}
