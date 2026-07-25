import { z } from "zod";

export const UserRole = {
  PARENT: "PARENT",
  TEACHER: "TEACHER",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const ActivityType = {
  FLASHCARDS: "FLASHCARDS",
  MEMORY: "MEMORY",
  QUIZ: "QUIZ",
  DRAG: "DRAG",
  SCRAMBLE: "SCRAMBLE",
} as const;
export type ActivityType = (typeof ActivityType)[keyof typeof ActivityType];

export const activityTypeSchema = z.enum(["FLASHCARDS", "MEMORY", "QUIZ", "DRAG", "SCRAMBLE"]);

export const attemptInputSchema = z.object({
  childId: z.string().min(1),
  levelId: z.string().min(1),
  lessonId: z.string().min(1),
  activityType: activityTypeSchema,
  starsEarned: z.number().int().min(1).max(3),
});
export type AttemptInput = z.infer<typeof attemptInputSchema>;
