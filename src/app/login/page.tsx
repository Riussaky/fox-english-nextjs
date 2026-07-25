import { AnimatedMascot } from "@/components/ui/AnimatedMascot";
import { GameBackground } from "@/components/games/GameBackground";
import { getGeneratedAssetAnyExt, getMascotSrcs } from "@/lib/generated-assets";
import { KidButton } from "@/components/ui/Button";
import { sendMagicLink } from "./actions";

export default function LoginPage() {
  const mascotSrcs = getMascotSrcs();
  const backgroundSrc = getGeneratedAssetAnyExt("backgrounds/home");
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <GameBackground src={backgroundSrc} theme="home" />
      <AnimatedMascot mood="happy" srcs={mascotSrcs} className="w-28 h-28" />
      <h1 className="text-3xl font-bold text-kid-ink bg-white/85 backdrop-blur rounded-full px-6 py-2 shadow-sm">
        Entrá a Fox English
      </h1>
      <p className="text-kid-ink/70 max-w-sm bg-white/85 backdrop-blur rounded-blob px-5 py-3 shadow-sm">
        Ingresá tu email y te mandamos un link mágico para entrar, sin contraseñas.
      </p>
      <form
        action={sendMagicLink}
        className="flex flex-col gap-3 w-full max-w-xs bg-white/90 backdrop-blur rounded-blob p-5 shadow-lg"
      >
        <input
          type="email"
          name="email"
          required
          placeholder="tu@email.com"
          className="rounded-full border-2 border-kid-ink/15 px-5 py-3 text-center outline-none focus:border-kid-teal"
        />
        <KidButton type="submit">Enviarme el link</KidButton>
      </form>
    </main>
  );
}
