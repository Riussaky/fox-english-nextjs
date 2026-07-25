// Fondo animado CSS/SVG de respaldo, uno por lección (15) + "home" para las
// pantallas fuera de una lección (perfiles, dashboard, login). Se usa
// mientras no exista el fondo ilustrado generado con IA para esa lección
// (public/generated/backgrounds/<lessonId>.png).

export type BackgroundThemeId =
  | "colores"
  | "animales"
  | "numeros"
  | "formas"
  | "cuerpo"
  | "comida"
  | "familia"
  | "casa"
  | "escuela"
  | "transporte"
  | "verbos"
  | "clima"
  | "emociones"
  | "adjetivos"
  | "lugares"
  | "home";

interface ThemeConfig {
  gradient: string;
  emojis: string[];
  mode: "drift" | "twinkle";
}

const THEME_CONFIG: Record<BackgroundThemeId, ThemeConfig> = {
  colores: { gradient: "from-rose-200 via-amber-100 to-sky-200", emojis: ["🌈", "🎨", "💧", "✨", "🎨"], mode: "drift" },
  animales: { gradient: "from-lime-200 via-emerald-100 to-teal-200", emojis: ["🦊", "🐰", "🐦", "🐟", "🦁"], mode: "drift" },
  numeros: { gradient: "from-cyan-200 via-sky-100 to-blue-200", emojis: ["🔢", "✨", "🎈", "⭐", "🎈"], mode: "drift" },
  formas: { gradient: "from-violet-200 via-fuchsia-100 to-sky-100", emojis: ["🔺", "⭐", "🔵", "🟩", "❤️"], mode: "drift" },
  cuerpo: { gradient: "from-orange-200 via-amber-100 to-rose-100", emojis: ["🙂", "✋", "👣", "👀", "✋"], mode: "drift" },
  comida: { gradient: "from-rose-200 via-orange-100 to-amber-100", emojis: ["🍎", "🍌", "🍞", "🥛", "🍰"], mode: "drift" },
  familia: { gradient: "from-pink-200 via-rose-100 to-violet-100", emojis: ["👪", "❤️", "🏡", "👶", "❤️"], mode: "drift" },
  casa: { gradient: "from-amber-200 via-orange-100 to-yellow-100", emojis: ["🏠", "🛏️", "🚪", "🪟", "🪑"], mode: "drift" },
  escuela: { gradient: "from-blue-200 via-sky-100 to-cyan-100", emojis: ["📖", "✏️", "🎒", "📏", "🖍️"], mode: "drift" },
  transporte: { gradient: "from-slate-200 via-sky-100 to-blue-100", emojis: ["🚗", "🚌", "✈️", "🚂", "⛵"], mode: "drift" },
  verbos: { gradient: "from-teal-200 via-emerald-100 to-cyan-100", emojis: ["🏃", "🤸", "😴", "📖", "🧸"], mode: "drift" },
  clima: { gradient: "from-sky-200 via-blue-100 to-slate-100", emojis: ["☀️", "☁️", "🌧️", "❄️", "⛈️"], mode: "drift" },
  emociones: { gradient: "from-yellow-200 via-amber-100 to-pink-100", emojis: ["😄", "😢", "😠", "😲", "🥱"], mode: "drift" },
  adjetivos: { gradient: "from-red-200 via-orange-100 to-cyan-100", emojis: ["🐘", "🐜", "⚡", "🐢", "🧊"], mode: "drift" },
  lugares: { gradient: "from-emerald-200 via-lime-100 to-amber-100", emojis: ["🏞️", "🏫", "🏖️", "🦓", "🏥"], mode: "drift" },
  home: { gradient: "from-amber-200 via-orange-100 to-rose-100", emojis: ["🦊", "🏡", "✨", "🌼", "🎈"], mode: "drift" },
};

export function AnimatedBackground({ theme }: { theme: BackgroundThemeId }) {
  const config = THEME_CONFIG[theme];

  return (
    <div className={`absolute inset-0 overflow-hidden bg-gradient-to-b ${config.gradient}`}>
      {config.emojis.map((emoji, i) => {
        const top = 8 + ((i * 37) % 80);
        if (config.mode === "twinkle") {
          const left = 6 + ((i * 53) % 90);
          return (
            <span
              key={i}
              className="absolute text-2xl animate-twinkle"
              style={{ top: `${top}%`, left: `${left}%`, animationDuration: `${2 + (i % 3)}s`, animationDelay: `${i * 0.4}s` }}
            >
              {emoji}
            </span>
          );
        }
        const duration = 14 + (i % 4) * 6;
        return (
          <span
            key={i}
            className="absolute animate-drift"
            style={{ top: `${top}%`, animationDuration: `${duration}s`, animationDelay: `${i * -4}s` }}
          >
            <span className="block text-3xl animate-bob" style={{ animationDuration: `${3 + (i % 3)}s` }}>
              {emoji}
            </span>
          </span>
        );
      })}
    </div>
  );
}
