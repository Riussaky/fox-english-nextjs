"use client";

import { useEffect, useRef, useState } from "react";
import type { Lesson, Word } from "@/lib/content";
import { WordIcon } from "@/components/ui/WordIcon";
import { shuffle, starsForScore } from "@/lib/utils";
import { speak } from "@/lib/speech";
import { playClick, playIncorrect } from "@/lib/sound";

/**
 * Port de renderDrag en ingles-kids-app/app.js — misma técnica de Pointer
 * Events manual (funciona bien en táctil), ahora dentro de un componente
 * React: se mueve el propio chip con `position: fixed` durante el arrastre
 * y se sueltan cambios de estado (placed/mistakes) recién al soltar.
 */
export function DragMatchGame({ lesson, onFinish }: { lesson: Lesson; onFinish: (stars: number) => void }) {
  const [words] = useState<Word[]>(lesson.words);
  // El orden de zonas/bandeja se randomiza recién en un useEffect (solo
  // cliente) para que el primer render coincida entre servidor y cliente —
  // si shuffle() corriera en el useState inicial, React tiraría un error de
  // hidratación (mismo motivo que en QuizGame/MemoryGame).
  const [zoneOrder, setZoneOrder] = useState<Word[]>(lesson.words);
  const [trayOrder, setTrayOrder] = useState<string[]>(lesson.words.map((w) => w.en));
  useEffect(() => {
    setZoneOrder(shuffle(words));
    setTrayOrder(shuffle(words).map((w) => w.en));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [placed, setPlaced] = useState<Set<string>>(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [wrongDrop, setWrongDrop] = useState<string | null>(null);

  // Se dispara desde un efecto que reacciona al `placed` ya confirmado por
  // React (no calculado "a mano" antes de setPlaced): varios drops sueltos
  // muy rápido pueden quedar en el mismo batch de React, así que leer
  // `placed.size` del closure justo antes de llamar a setPlaced puede
  // quedar desactualizado. El ref evita que el efecto dispare onFinish más
  // de una vez (p.ej. por el doble-invoke de efectos en modo estricto).
  const finishedRef = useRef(false);
  useEffect(() => {
    if (words.length > 0 && placed.size === words.length && !finishedRef.current) {
      finishedRef.current = true;
      const t = setTimeout(() => onFinish(starsForScore(mistakes, words.length)), 500);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placed, words.length]);

  function handlePointerDown(e: React.PointerEvent<HTMLButtonElement>, en: string) {
    e.preventDefault();
    const chip = e.currentTarget;
    const rect = chip.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    chip.setPointerCapture(e.pointerId);
    chip.classList.add("scale-110", "shadow-xl", "z-50");
    chip.style.position = "fixed";
    chip.style.left = `${rect.left}px`;
    chip.style.top = `${rect.top}px`;
    chip.style.width = `${rect.width}px`;

    function onMove(ev: PointerEvent) {
      chip.style.left = `${ev.clientX - offsetX}px`;
      chip.style.top = `${ev.clientY - offsetY}px`;
    }

    function onUp(ev: PointerEvent) {
      chip.removeEventListener("pointermove", onMove);
      chip.removeEventListener("pointerup", onUp);
      chip.classList.remove("scale-110", "shadow-xl", "z-50");
      chip.style.pointerEvents = "none";
      const dropEl = document.elementFromPoint(ev.clientX, ev.clientY);
      chip.style.pointerEvents = "";

      const zoneEl = dropEl instanceof Element ? dropEl.closest("[data-zone-word]") : null;
      const zoneWord = zoneEl?.getAttribute("data-zone-word");

      chip.style.position = "";
      chip.style.left = "";
      chip.style.top = "";
      chip.style.width = "";

      if (zoneWord === en) {
        playClick();
        speak(en, "en");
        setPlaced((prev) => {
          const next = new Set(prev);
          next.add(en);
          return next;
        });
        setTrayOrder((prev) => prev.filter((w) => w !== en));
      } else {
        playIncorrect();
        setMistakes((m) => m + 1);
        setWrongDrop(en);
        setTimeout(() => setWrongDrop(null), 400);
      }
    }

    chip.addEventListener("pointermove", onMove);
    chip.addEventListener("pointerup", onUp);
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg">
      <p className="text-sm font-semibold text-kid-ink/60">
        Arrastrá cada palabra hacia su imagen ({placed.size}/{words.length})
      </p>

      <div className="grid grid-cols-3 gap-3 w-full">
        {zoneOrder.map((w) => (
          <div
            key={w.en}
            data-zone-word={w.en}
            className={`flex flex-col items-center gap-1 rounded-blob p-2 border-2 ${
              placed.has(w.en) ? "border-kid-green bg-kid-green/10" : "border-dashed border-kid-ink/20 bg-white/70"
            }`}
          >
            <div className="w-12 h-12">
              <WordIcon icon={w.icon} />
            </div>
            <div className="text-lg font-bold text-kid-ink">{placed.has(w.en) ? "✓" : "?"}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-3 min-h-[3rem]">
        {trayOrder.map((en) => {
          const word = words.find((w) => w.en === en)!;
          return (
            <button
              key={en}
              type="button"
              onPointerDown={(e) => handlePointerDown(e, en)}
              className={`touch-none select-none rounded-full bg-kid-purple text-white px-5 py-3 font-bold shadow-md cursor-grab active:cursor-grabbing ${
                wrongDrop === en ? "animate-wobble" : ""
              }`}
            >
              {word.en}
            </button>
          );
        })}
      </div>
    </div>
  );
}
