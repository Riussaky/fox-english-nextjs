import { ActivityType } from "@/lib/types";

export const ACTIVITY_TYPES: ActivityType[] = [
  ActivityType.FLASHCARDS,
  ActivityType.MEMORY,
  ActivityType.QUIZ,
  ActivityType.DRAG,
  ActivityType.SCRAMBLE,
];

export const STARS_PER_ACTIVITY = 3;
export const MAX_LESSON_STARS = ACTIVITY_TYPES.length * STARS_PER_ACTIVITY;

export const ACTIVITY_META: Record<ActivityType, { slug: string; label: string; emoji: string; description: string }> = {
  FLASHCARDS: { slug: "tarjetas", label: "Tarjetas", emoji: "🗂️", description: "Conocé las palabras nuevas" },
  MEMORY: { slug: "memorama", label: "Memorama", emoji: "🧠", description: "Encontrá las parejas" },
  QUIZ: { slug: "quiz", label: "Quiz", emoji: "❓", description: "Poné a prueba lo aprendido" },
  DRAG: { slug: "arrastra", label: "Arrastra y Une", emoji: "🖐️", description: "Uní cada imagen con su palabra" },
  SCRAMBLE: { slug: "ordena", label: "Ordena las Letras", emoji: "🔤", description: "Formá la palabra en inglés" },
};

export function activityTypeFromSlug(slug: string): ActivityType | undefined {
  return ACTIVITY_TYPES.find((a) => ACTIVITY_META[a].slug === slug);
}
