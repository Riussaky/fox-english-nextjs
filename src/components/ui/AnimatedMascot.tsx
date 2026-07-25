"use client";

import { useEffect, useState } from "react";
import { Mascot, type MascotMood } from "./Mascot";
import type { MascotSrcs } from "@/lib/generated-assets";

/**
 * Muestra la mascota "Fox" con las fotos ilustradas generadas con IA
 * (public/generated/mascot/*) cuando existen, recortadas en una placa
 * circular. En mood "happy" hace un "parpadeo" periódico simulado con CSS.
 * Cae de vuelta al SVG dibujado en código si no se generaron las imágenes
 * todavía. Portado de numi-landia-app/src/components/ui/AnimatedMascot.tsx.
 */
export function AnimatedMascot({
  mood = "happy",
  srcs,
  className = "",
}: {
  mood?: MascotMood;
  srcs: MascotSrcs;
  className?: string;
}) {
  const [blink, setBlink] = useState(false);
  const src = srcs[mood];
  const canBlink = mood === "happy" && !!src;

  useEffect(() => {
    if (!canBlink) return;
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 160);
    }, 3500);
    return () => clearInterval(interval);
  }, [canBlink]);

  if (!src) return <Mascot mood={mood} className={className} />;

  return (
    <span
      className={`${className} inline-block rounded-full overflow-hidden border-4 border-white shadow-lg bg-kid-cream`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className={`h-full w-full object-cover transition-transform duration-150 ${blink ? "scale-y-90" : ""}`}
      />
    </span>
  );
}
