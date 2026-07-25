import { AnimatedMascot } from "@/components/ui/AnimatedMascot";
import { GameBackground } from "@/components/games/GameBackground";
import { getGeneratedAssetAnyExt, getMascotSrcs } from "@/lib/generated-assets";

export default function CheckEmailPage() {
  const mascotSrcs = getMascotSrcs();
  const backgroundSrc = getGeneratedAssetAnyExt("backgrounds/home");
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <GameBackground src={backgroundSrc} theme="home" />
      <AnimatedMascot mood="excited" srcs={mascotSrcs} className="w-28 h-28" />
      <h1 className="text-2xl font-bold text-kid-ink bg-white/85 backdrop-blur rounded-full px-6 py-2 shadow-sm">
        ¡Revisá tu email!
      </h1>
      <p className="text-kid-ink/70 max-w-sm bg-white/85 backdrop-blur rounded-blob px-5 py-3 shadow-sm">
        Te enviamos un link para entrar. Abrilo desde el mismo dispositivo en el que
        querés jugar.
      </p>
    </main>
  );
}
