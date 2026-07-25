import Image from "next/image";
import type { BackgroundThemeId } from "./AnimatedBackground";
import { AnimatedBackground } from "./AnimatedBackground";

/**
 * Muestra el fondo generado con IA (public/generated/backgrounds/*) cuando
 * existe; si todavía no se corrió `npm run generate:images`, cae de vuelta
 * al fondo animado con CSS/SVG para que la app nunca se vea rota.
 */
export function GameBackground({ src, theme }: { src: string | null; theme: BackgroundThemeId }) {
  return (
    <div className="fixed inset-0 -z-10">
      {src ? (
        <>
          <Image src={src} alt="" fill priority quality={95} className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-white/10" />
        </>
      ) : (
        <AnimatedBackground theme={theme} />
      )}
    </div>
  );
}
