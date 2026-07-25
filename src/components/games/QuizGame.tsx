"use client";

import { useEffect, useState } from "react";
import type { Lesson, Word } from "@/lib/content";
import { WordIcon } from "@/components/ui/WordIcon";
import { KidButton } from "@/components/ui/Button";
import { shuffle } from "@/lib/utils";
import { speak } from "@/lib/speech";
import { playCorrect, playIncorrect } from "@/lib/sound";

interface Question {
  word: Word;
  options: Word[];
}

// El orden aleatorio se arma recién en un useEffect (solo cliente): si
// shuffle() corriera dentro del useState inicial, el render del servidor y
// el primer render del cliente sacarían órdenes distintos (Math.random no
// es determinístico entre ambos) y React tiraría un error de hidratación.
function buildQuestions(words: Word[], randomize: boolean): Question[] {
  const order = randomize ? shuffle(words) : words;
  return order.map((word) => {
    const distractorPool = words.filter((w) => w.en !== word.en);
    const distractors = randomize ? shuffle(distractorPool).slice(0, 3) : distractorPool.slice(0, 3);
    const options = randomize ? shuffle([word, ...distractors]) : [word, ...distractors];
    return { word, options };
  });
}

/** Port de renderQuiz en ingles-kids-app/app.js — opción múltiple, 4 alternativas. */
export function QuizGame({ lesson, onFinish }: { lesson: Lesson; onFinish: (stars: number) => void }) {
  const [questions, setQuestions] = useState<Question[]>(() => buildQuestions(lesson.words, false));
  useEffect(() => {
    setQuestions(buildQuestions(lesson.words, true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [qIndex, setQIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answered, setAnswered] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  const q = questions[qIndex];

  function pick(optionEn: string) {
    if (answered) return;
    setAnswered(optionEn);
    const isCorrect = optionEn === q.word.en;
    if (isCorrect) {
      playCorrect();
      speak(q.word.en, "en");
      setCorrectCount((c) => c + 1);
    } else {
      playIncorrect();
    }

    setTimeout(() => {
      const next = qIndex + 1;
      if (next < questions.length) {
        setQIndex(next);
        setAnswered(null);
      } else {
        const total = correctCount + (isCorrect ? 1 : 0);
        const passed = total >= Math.ceil(questions.length * 0.6);
        if (passed) {
          const wrong = questions.length - total;
          const stars = wrong <= 0 ? 3 : wrong <= Math.max(1, Math.ceil(questions.length * 0.3)) ? 2 : 1;
          onFinish(stars);
        } else {
          setFailed(true);
        }
      }
    }, 900);
  }

  function retry() {
    setQIndex(0);
    setCorrectCount(0);
    setAnswered(null);
    setFailed(false);
  }

  if (failed) {
    return (
      <div className="flex flex-col items-center gap-4 text-center max-w-sm">
        <h2 className="text-2xl font-bold text-kid-ink">¡Casi lo lográs!</h2>
        <p className="text-kid-ink/70">
          Acertaste {correctCount} de {questions.length}. ¡Intentalo de nuevo, vos podés! 💪
        </p>
        <KidButton type="button" onClick={retry}>
          Intentar otra vez
        </KidButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-md">
      <div className="w-full h-2 rounded-full bg-white/60 overflow-hidden">
        <div
          className="h-full bg-kid-teal transition-all"
          style={{ width: `${(qIndex / questions.length) * 100}%` }}
        />
      </div>
      <div className="w-20 h-20">
        <WordIcon icon={q.word.icon} />
      </div>
      <p className="text-lg font-semibold text-kid-ink text-center">
        ¿Cómo se dice <b>&quot;{q.word.es}&quot;</b> en inglés?
      </p>
      <div className="grid grid-cols-2 gap-3 w-full">
        {q.options.map((opt) => {
          const isThisAnswer = answered === opt.en;
          const isCorrectOption = opt.en === q.word.en;
          const showState = answered !== null;
          const stateClass = showState
            ? isCorrectOption
              ? "bg-kid-green text-white animate-pop"
              : isThisAnswer
                ? "bg-kid-coral text-white animate-wobble"
                : "opacity-50"
            : "bg-white hover:bg-kid-cream";

          return (
            <button
              key={opt.en}
              type="button"
              disabled={showState}
              onClick={() => pick(opt.en)}
              className={`rounded-blob px-4 py-4 text-lg font-bold text-kid-ink shadow-sm transition ${stateClass}`}
            >
              {opt.en}
            </button>
          );
        })}
      </div>
    </div>
  );
}
