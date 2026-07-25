import Link from "next/link";
import { AnimatedMascot } from "@/components/ui/AnimatedMascot";
import { GameBackground } from "@/components/games/GameBackground";
import { getGeneratedAssetAnyExt, getMascotSrcs } from "@/lib/generated-assets";

const HIGHLIGHTS = [
  { icon: "🗂️", title: "5 juegos por lección", text: "Tarjetas, memorama, quiz, arrastrar y ordenar letras." },
  { icon: "🌍", title: "3 niveles, 90 palabras", text: "De las primeras palabras a temas más avanzados." },
  { icon: "⭐", title: "Progreso guardado", text: "Cada niño/a tiene su propio perfil." },
];

export default function Home() {
  const mascotSrcs = getMascotSrcs();
  const backgroundSrc = getGeneratedAssetAnyExt("backgrounds/home");
  return (
    <main className="min-h-screen flex flex-col items-center gap-10 px-4 py-14">
      <GameBackground src={backgroundSrc} theme="home" />
      <AnimatedMascot mood="happy" srcs={mascotSrcs} className="w-32 h-32" />

      <div className="flex flex-col items-center gap-3 text-center max-w-xl bg-white/85 backdrop-blur rounded-blob px-8 py-6 shadow-md">
        <h1 className="text-4xl font-bold text-kid-ink">Fox English</h1>
        <p className="text-lg text-kid-ink/70">
          Aprendé inglés jugando: actividades interactivas para niños, con progreso
          guardado y un panel pensado para familias y docentes.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/login"
          className="rounded-full bg-kid-teal text-white px-8 py-3 text-lg font-semibold shadow-[0_4px_0_rgba(0,0,0,0.15)] hover:bg-kid-teal/90 transition"
        >
          Empezar
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-3xl mt-6">
        {HIGHLIGHTS.map((item) => (
          <div key={item.title} className="flex flex-col items-center gap-2 rounded-blob bg-white p-5 text-center shadow-sm">
            <span className="text-4xl">{item.icon}</span>
            <p className="font-bold text-kid-ink">{item.title}</p>
            <p className="text-sm text-kid-ink/60">{item.text}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
