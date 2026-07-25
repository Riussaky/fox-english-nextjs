import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Avatar } from "@/components/ui/Avatar";
import { AnimatedMascot } from "@/components/ui/AnimatedMascot";
import { GameBackground } from "@/components/games/GameBackground";
import { getGeneratedAssetAnyExt, getMascotSrcs, getAvatarSrc } from "@/lib/generated-assets";
import { selectChild } from "./actions";

export default async function PerfilesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const children = await db.child.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
  });
  const backgroundSrc = getGeneratedAssetAnyExt("backgrounds/home");
  const mascotSrcs = getMascotSrcs();

  return (
    <main className="min-h-screen flex flex-col items-center gap-8 px-4 py-12">
      <GameBackground src={backgroundSrc} theme="home" />
      <AnimatedMascot mood="happy" srcs={mascotSrcs} className="w-24 h-24" />
      <h1 className="text-3xl font-bold text-kid-ink bg-white/80 backdrop-blur rounded-full px-6 py-2 shadow-sm">
        ¿Quién va a jugar?
      </h1>

      <div className="flex flex-wrap justify-center gap-6">
        {children.map((child) => (
          <form key={child.id} action={selectChild}>
            <input type="hidden" name="childId" value={child.id} />
            <button
              type="submit"
              className="flex flex-col items-center gap-2 rounded-blob bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition"
            >
              <Avatar avatarId={child.avatarId} src={getAvatarSrc(child.avatarId)} size={80} />
              <span className="font-semibold text-kid-ink">{child.name}</span>
            </button>
          </form>
        ))}

        <Link
          href="/perfiles/nuevo"
          className="flex flex-col items-center justify-center gap-2 rounded-blob border-4 border-dashed border-kid-ink/20 bg-white/60 backdrop-blur p-5 w-[136px] h-[136px] text-kid-ink/50 hover:border-kid-teal hover:text-kid-teal transition"
        >
          <span className="text-4xl">+</span>
          <span className="text-sm font-semibold">Agregar</span>
        </Link>
      </div>

      <Link
        href="/dashboard"
        className="text-sm text-kid-ink/60 underline bg-white/80 backdrop-blur rounded-full px-4 py-1.5"
      >
        Ir al panel de familia / docente
      </Link>
    </main>
  );
}
