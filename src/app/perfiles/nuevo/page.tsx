import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { KidButton } from "@/components/ui/Button";
import { AVATAR_OPTIONS, Avatar } from "@/components/ui/Avatar";
import { AnimatedMascot } from "@/components/ui/AnimatedMascot";
import { GameBackground } from "@/components/games/GameBackground";
import { getGeneratedAssetAnyExt, getMascotSrcs, getAvatarSrc } from "@/lib/generated-assets";
import { createChild } from "../actions";

export default async function NuevoPerfilPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const backgroundSrc = getGeneratedAssetAnyExt("backgrounds/home");
  const mascotSrcs = getMascotSrcs();

  return (
    <main className="min-h-screen flex flex-col items-center gap-6 px-4 py-12">
      <GameBackground src={backgroundSrc} theme="home" />
      <AnimatedMascot mood="happy" srcs={mascotSrcs} className="w-24 h-24" />
      <h1 className="text-2xl font-bold text-kid-ink bg-white/80 backdrop-blur rounded-full px-6 py-2 shadow-sm">
        Nuevo perfil
      </h1>

      <form
        action={createChild}
        className="flex flex-col gap-5 w-full max-w-sm bg-white/90 backdrop-blur rounded-blob p-6 shadow-lg"
      >
        <input
          type="text"
          name="name"
          required
          placeholder="Nombre del niño/a"
          className="rounded-full border-2 border-kid-ink/15 px-5 py-3 text-center outline-none focus:border-kid-teal"
        />

        <div>
          <p className="text-sm font-semibold text-kid-ink/70 mb-2 text-center">Avatar</p>
          <div className="grid grid-cols-4 gap-3">
            {AVATAR_OPTIONS.map((option, i) => (
              <label key={option.id} className="flex items-center justify-center cursor-pointer">
                <input
                  type="radio"
                  name="avatarId"
                  value={option.id}
                  defaultChecked={i === 0}
                  className="peer sr-only"
                />
                <span className="rounded-full p-1 border-4 border-transparent peer-checked:border-kid-teal">
                  <Avatar avatarId={option.id} src={getAvatarSrc(option.id)} size={56} />
                </span>
              </label>
            ))}
          </div>
        </div>

        <KidButton type="submit">Crear perfil</KidButton>
      </form>
    </main>
  );
}
