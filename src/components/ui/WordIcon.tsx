import type { IconSpec } from "@/lib/content";

// Portado de los generadores SVG en ingles-kids-app/data.js (svg/emojiIcon/
// dropIcon/numberIcon/tableIcon + formas) a JSX. Mismo look exacto, ahora
// como componente React en vez de strings armadas a mano.

function Base({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <circle cx={60} cy={60} r={58} fill={bg} />
      {children}
    </svg>
  );
}

const NUMBER_DOT_POSITIONS: number[][] = [
  [60, 92],
  [48, 92, 72, 92],
  [48, 92, 60, 92, 72, 92],
  [48, 84, 72, 84, 48, 96, 72, 96],
  [48, 84, 60, 84, 72, 84, 54, 96, 66, 96],
  [46, 84, 60, 84, 74, 84, 46, 96, 60, 96, 74, 96],
];

export function WordIcon({ icon }: { icon: IconSpec }) {
  switch (icon.kind) {
    case "emoji":
      return (
        <Base bg={icon.bg}>
          <text x={60} y={66} fontSize={66} textAnchor="middle" dominantBaseline="central">
            {icon.char}
          </text>
        </Base>
      );
    case "drop":
      return (
        <Base bg="#FFFFFF">
          <path
            d="M60 20 C60 20 34 58 34 80 a26 26 0 0 0 52 0 C86 58 60 20 60 20 Z"
            fill={icon.color}
            stroke="#00000022"
            strokeWidth={3}
          />
          <ellipse cx={50} cy={70} rx={6} ry={10} fill="#ffffff66" />
        </Base>
      );
    case "number": {
      const positions = NUMBER_DOT_POSITIONS[icon.n - 1] ?? [];
      const dots = [];
      for (let i = 0; i < positions.length; i += 2) {
        dots.push(<circle key={i} cx={positions[i]} cy={positions[i + 1]} r={4} fill={icon.color} />);
      }
      return (
        <Base bg="#FFFFFF">
          <text
            x={60}
            y={66}
            fontFamily="Fredoka, sans-serif"
            fontSize={46}
            fontWeight={700}
            fill={icon.color}
            textAnchor="middle"
          >
            {icon.n}
          </text>
          {dots}
        </Base>
      );
    }
    case "table":
      return (
        <Base bg="#F2E7D8">
          <rect x={26} y={46} width={68} height={12} rx={4} fill="#D9A066" />
          <line x1={34} y1={58} x2={34} y2={98} stroke="#B07C4F" strokeWidth={7} strokeLinecap="round" />
          <line x1={86} y1={58} x2={86} y2={98} stroke="#B07C4F" strokeWidth={7} strokeLinecap="round" />
        </Base>
      );
    case "shape":
      switch (icon.shape) {
        case "circle":
          return (
            <Base bg="#FFEDED">
              <circle cx={60} cy={60} r={30} fill="#FF6B6B" />
            </Base>
          );
        case "square":
          return (
            <Base bg="#EAF2FE">
              <rect x={32} y={32} width={56} height={56} rx={10} fill="#4D96FF" />
            </Base>
          );
        case "triangle":
          return (
            <Base bg="#FFF8DE">
              <path d="M60 28 L92 88 L28 88 Z" fill="#FFD93D" strokeLinejoin="round" />
            </Base>
          );
        case "star":
          return (
            <Base bg="#F3ECFC">
              <path
                d="M60 24 L70 50 L98 52 L76 70 L84 96 L60 80 L36 96 L44 70 L22 52 L50 50 Z"
                fill="#B18CF0"
              />
            </Base>
          );
        case "heart":
          return (
            <Base bg="#FEEFF3">
              <path
                d="M60 92 C20 66 28 34 50 34 C58 34 60 42 60 42 C60 42 62 34 70 34 C92 34 100 66 60 92 Z"
                fill="#F2789B"
              />
            </Base>
          );
        case "rectangle":
          return (
            <Base bg="#EAF7EC">
              <rect x={24} y={40} width={72} height={40} rx={10} fill="#6BCB77" />
            </Base>
          );
      }
  }
}
