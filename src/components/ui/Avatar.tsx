// Avatares con animales del vocabulario de la lección "Animales", para que
// combinen con el contenido de la app (zorro protagonista + 7 más).
export const AVATAR_OPTIONS = [
  { id: "zorro", emoji: "🦊", bg: "#FFDCC2" },
  { id: "gato", emoji: "🐱", bg: "#FFE0EC" },
  { id: "perro", emoji: "🐶", bg: "#F2E7D8" },
  { id: "pajaro", emoji: "🐦", bg: "#E4F7FB" },
  { id: "pez", emoji: "🐟", bg: "#E1F1FC" },
  { id: "conejo", emoji: "🐰", bg: "#E4FFE6" },
  { id: "leon", emoji: "🦁", bg: "#FFF1C2" },
  { id: "panda", emoji: "🐼", bg: "#E4EEFF" },
] as const;

export type AvatarId = (typeof AVATAR_OPTIONS)[number]["id"];

/**
 * Retrato ilustrado del avatar elegido (public/generated/avatars/*) si ya
 * se generó; si no, cae al emoji + fondo de color de siempre.
 */
export function Avatar({
  avatarId,
  size = 64,
  src,
}: {
  avatarId: string;
  size?: number;
  src?: string | null;
}) {
  const option = AVATAR_OPTIONS.find((a) => a.id === avatarId) ?? AVATAR_OPTIONS[0];

  if (src) {
    return (
      <span
        className="inline-block rounded-full overflow-hidden border-4 border-white shadow-md bg-kid-cream"
        style={{ width: size, height: size }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={option.id} className="h-full w-full object-cover" />
      </span>
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-full"
      style={{ width: size, height: size, background: option.bg, fontSize: size * 0.55 }}
    >
      <span role="img" aria-label={option.id}>
        {option.emoji}
      </span>
    </div>
  );
}
