export type MascotMood = "happy" | "excited" | "thinking";

/**
 * Zorro geométrico dibujado en código — mismo diseño que el MASCOT_SVG de
 * ingles-kids-app/app.js, ahora mood-aware. Se usa solo si todavía no se
 * generaron las fotos de "Fox" con IA (public/generated/mascot/*).
 */
export function Mascot({
  mood = "happy",
  className = "",
}: {
  mood?: MascotMood;
  className?: string;
}) {
  const eyeR = mood === "excited" ? 8 : 6;
  const rotate = mood === "thinking" ? -6 : 0;

  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="60" cy="106" rx="26" ry="7" fill="#00000012" />
      <g transform={`rotate(${rotate} 60 56)`}>
        <path d="M30 40 L14 12 L42 32 Z" fill="#F0904C" />
        <path d="M90 40 L106 12 L78 32 Z" fill="#F0904C" />
        <path d="M32 40 L20 20 L44 34 Z" fill="#FBD9B8" />
        <path d="M88 40 L100 20 L76 34 Z" fill="#FBD9B8" />
        <circle cx="60" cy="56" r="38" fill="#F0904C" />
        <path
          d="M60 60 C40 60 34 78 44 90 C50 96 70 96 76 90 C86 78 80 60 60 60 Z"
          fill="#FDF1E4"
        />
        <circle cx="46" cy="52" r={eyeR} fill="#2E2A26" />
        <circle cx="74" cy="52" r={eyeR} fill="#2E2A26" />
        <path d="M60 68 L54 76 L66 76 Z" fill="#2E2A26" />
        <path d="M60 76 Q60 84 70 80" stroke="#2E2A26" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}
