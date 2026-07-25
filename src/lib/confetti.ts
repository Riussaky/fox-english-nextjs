// Ráfaga de confeti tipo "fuegos artificiales" — manipulación imperativa del
// DOM, sin dependencias. Portado de numi-landia-app/src/lib/confetti.ts.

const COLORS = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#B18CF0", "#FFB84D"];

export function launchConfetti(originX = window.innerWidth / 2, originY = window.innerHeight / 2) {
  if (typeof document === "undefined") return;
  const count = 50;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-burst-piece";

    const angle = Math.random() * Math.PI * 2;
    const distance = 90 + Math.random() * 220;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 30;
    const size = 6 + Math.random() * 7;

    piece.style.left = `${originX}px`;
    piece.style.top = `${originY}px`;
    piece.style.width = `${size}px`;
    piece.style.height = `${size * 0.7}px`;
    piece.style.background = COLORS[i % COLORS.length];
    piece.style.setProperty("--dx", `${dx}px`);
    piece.style.setProperty("--dy", `${dy}px`);
    piece.style.animationDuration = `${0.9 + Math.random() * 0.6}s`;

    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 1700);
  }
}

/** Varias ráfagas seguidas, para el momento de completar una lección. */
export function launchFireworks() {
  if (typeof window === "undefined") return;
  const points = [
    [window.innerWidth * 0.3, window.innerHeight * 0.35],
    [window.innerWidth * 0.7, window.innerHeight * 0.3],
    [window.innerWidth * 0.5, window.innerHeight * 0.45],
  ];
  points.forEach(([x, y], i) => {
    setTimeout(() => launchConfetti(x, y), i * 250);
  });
}
