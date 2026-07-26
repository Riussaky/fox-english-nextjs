// Contenido estático: niveles, lecciones y vocabulario. Portado de
// ingles-kids-app/data.js — mismas 90 palabras, mismos íconos (ahora como
// datos tipados en vez de strings SVG armadas a mano; ver WordIcon.tsx para
// el render). La mayoría se mantiene en código/emoji (un ícono de
// vocabulario tiene que ser exacto — una manzana reconocible como "apple").
// Algunas palabras (ej. los animales) usan además un retrato ilustrado con
// IA (mismo pipeline que los avatares de NumiLandia) vía la variante
// "illustrated" — con el emoji como respaldo automático si la imagen
// generada no existe o falla al cargar.

export type IconSpec =
  | { kind: "emoji"; char: string; bg: string }
  | { kind: "drop"; color: string }
  | { kind: "shape"; shape: "circle" | "square" | "triangle" | "star" | "heart" | "rectangle" }
  | { kind: "number"; n: number; color: string }
  | { kind: "table" }
  | { kind: "illustrated"; asset: string; fallbackChar: string; fallbackBg: string };

export interface Word {
  en: string;
  es: string;
  icon: IconSpec;
}

export interface Lesson {
  id: string;
  name: string;
  icon: string; // emoji para la tarjeta de lección
  words: Word[];
}

export interface Level {
  id: string;
  name: string;
  color: string;
  subtitle: string;
  lessons: Lesson[];
}

function emoji(char: string, bg: string): IconSpec {
  return { kind: "emoji", char, bg };
}
function drop(color: string): IconSpec {
  return { kind: "drop", color };
}
function number(n: number, color: string): IconSpec {
  return { kind: "number", n, color };
}
function illustrated(asset: string, fallbackChar: string, fallbackBg: string): IconSpec {
  return { kind: "illustrated", asset, fallbackChar, fallbackBg };
}

export const LEVELS: Level[] = [
  {
    id: "basico",
    name: "Básico",
    color: "#4ECDC4",
    subtitle: "¡Primeras palabras!",
    lessons: [
      {
        id: "colores",
        name: "Colores",
        icon: "🎨",
        words: [
          { en: "red", es: "rojo", icon: drop("#FF6B6B") },
          { en: "blue", es: "azul", icon: drop("#4D96FF") },
          { en: "yellow", es: "amarillo", icon: drop("#FFD93D") },
          { en: "green", es: "verde", icon: drop("#6BCB77") },
          { en: "orange", es: "naranja", icon: drop("#FF9F45") },
          { en: "purple", es: "morado", icon: drop("#A78BFA") },
        ],
      },
      {
        id: "animales",
        name: "Animales",
        icon: "🐾",
        words: [
          { en: "cat", es: "gato", icon: illustrated("animals/cat", "🐱", "#FFF3E2") },
          { en: "dog", es: "perro", icon: illustrated("animals/dog", "🐶", "#F2E7D8") },
          { en: "bird", es: "pájaro", icon: illustrated("animals/bird", "🐦", "#E4F7FB") },
          { en: "fish", es: "pez", icon: illustrated("animals/fish", "🐟", "#E1F1FC") },
          { en: "rabbit", es: "conejo", icon: illustrated("animals/rabbit", "🐰", "#FCEFF5") },
          { en: "lion", es: "león", icon: illustrated("animals/lion", "🦁", "#FDF1DD") },
        ],
      },
      {
        id: "numeros",
        name: "Números",
        icon: "🔢",
        words: [
          { en: "one", es: "uno", icon: number(1, "#4ECDC4") },
          { en: "two", es: "dos", icon: number(2, "#FF6B6B") },
          { en: "three", es: "tres", icon: number(3, "#FFD93D") },
          { en: "four", es: "cuatro", icon: number(4, "#6BCB77") },
          { en: "five", es: "cinco", icon: number(5, "#A78BFA") },
          { en: "six", es: "seis", icon: number(6, "#FF9F45") },
        ],
      },
      {
        id: "formas",
        name: "Formas",
        icon: "🔺",
        words: [
          { en: "circle", es: "círculo", icon: { kind: "shape", shape: "circle" } },
          { en: "square", es: "cuadrado", icon: { kind: "shape", shape: "square" } },
          { en: "triangle", es: "triángulo", icon: { kind: "shape", shape: "triangle" } },
          { en: "star", es: "estrella", icon: { kind: "shape", shape: "star" } },
          { en: "heart", es: "corazón", icon: { kind: "shape", shape: "heart" } },
          { en: "rectangle", es: "rectángulo", icon: { kind: "shape", shape: "rectangle" } },
        ],
      },
      {
        id: "cuerpo",
        name: "Mi Cuerpo",
        icon: "🙂",
        words: [
          { en: "head", es: "cabeza", icon: emoji("😀", "#FDF1E4") },
          { en: "hand", es: "mano", icon: emoji("✋", "#FDF1E4") },
          { en: "foot", es: "pie", icon: emoji("🦶", "#FDF1E4") },
          { en: "eye", es: "ojo", icon: emoji("👁️", "#FEF3EE") },
          { en: "nose", es: "nariz", icon: emoji("👃", "#FDF1E4") },
          { en: "mouth", es: "boca", icon: emoji("👄", "#FEEEEF") },
        ],
      },
    ],
  },
  {
    id: "medio",
    name: "Medio",
    color: "#FFB84D",
    subtitle: "¡Vamos creciendo!",
    lessons: [
      {
        id: "comida",
        name: "Comida",
        icon: "🍎",
        words: [
          { en: "apple", es: "manzana", icon: illustrated("comida/apple", "🍎", "#FDECEC") },
          { en: "banana", es: "plátano", icon: illustrated("comida/banana", "🍌", "#FFF8E0") },
          { en: "bread", es: "pan", icon: emoji("🍞", "#FCF0DE") },
          { en: "milk", es: "leche", icon: illustrated("comida/milk", "🥛", "#EAF6FF") },
          { en: "egg", es: "huevo", icon: illustrated("comida/egg", "🥚", "#FFF8EA") },
          { en: "cake", es: "pastel", icon: illustrated("comida/cake", "🍰", "#FEF0F3") },
        ],
      },
      {
        id: "familia",
        name: "Familia",
        icon: "👪",
        words: [
          { en: "mom", es: "mamá", icon: illustrated("familia/mom", "👩", "#FDEFF5") },
          { en: "dad", es: "papá", icon: illustrated("familia/dad", "👨", "#EAF2FE") },
          { en: "sister", es: "hermana", icon: illustrated("familia/sister", "👧", "#F3ECFC") },
          { en: "brother", es: "hermano", icon: illustrated("familia/brother", "👦", "#EAF7EC") },
          { en: "baby", es: "bebé", icon: illustrated("familia/baby", "👶", "#FFF8E0") },
          { en: "grandma", es: "abuela", icon: illustrated("familia/grandma", "👵", "#F6EAF1") },
        ],
      },
      {
        id: "casa",
        name: "La Casa",
        icon: "🏠",
        words: [
          { en: "house", es: "casa", icon: illustrated("casa/house", "🏠", "#FFF3E9") },
          { en: "bed", es: "cama", icon: illustrated("casa/bed", "🛏️", "#EAF2FE") },
          { en: "chair", es: "silla", icon: illustrated("casa/chair", "🪑", "#FDF1DD") },
          { en: "table", es: "mesa", icon: { kind: "table" } },
          { en: "door", es: "puerta", icon: illustrated("casa/door", "🚪", "#F2E7D8") },
          { en: "window", es: "ventana", icon: illustrated("casa/window", "🪟", "#EAF6FD") },
        ],
      },
      {
        id: "escuela",
        name: "La Escuela",
        icon: "🎒",
        words: [
          { en: "book", es: "libro", icon: emoji("📖", "#EAF2FE") },
          { en: "pencil", es: "lápiz", icon: emoji("✏️", "#FFF8DE") },
          { en: "backpack", es: "mochila", icon: illustrated("escuela/backpack", "🎒", "#FFEEDC") },
          { en: "scissors", es: "tijeras", icon: illustrated("escuela/scissors", "✂️", "#F0F0F7") },
          { en: "ruler", es: "regla", icon: emoji("📏", "#FFF8DE") },
          { en: "crayon", es: "crayón", icon: emoji("🖍️", "#EAF7EC") },
        ],
      },
      {
        id: "transporte",
        name: "Transporte",
        icon: "🚗",
        words: [
          { en: "car", es: "carro", icon: illustrated("transporte/car", "🚗", "#FFEDED") },
          { en: "bus", es: "autobús", icon: illustrated("transporte/bus", "🚌", "#FFF8DE") },
          { en: "bike", es: "bicicleta", icon: illustrated("transporte/bike", "🚲", "#EAF2FE") },
          { en: "train", es: "tren", icon: illustrated("transporte/train", "🚂", "#FEEEF2") },
          { en: "plane", es: "avión", icon: illustrated("transporte/plane", "✈️", "#EAF2FE") },
          { en: "boat", es: "barco", icon: illustrated("transporte/boat", "⛵", "#EAF6FD") },
        ],
      },
    ],
  },
  {
    id: "intermedio",
    name: "Intermedio",
    color: "#B18CF0",
    subtitle: "¡Ya eres un experto!",
    lessons: [
      {
        id: "verbos",
        name: "Acciones",
        icon: "🏃",
        words: [
          { en: "run", es: "correr", icon: illustrated("verbos/run", "🏃", "#EAF2FE") },
          { en: "jump", es: "saltar", icon: illustrated("verbos/jump", "🤸", "#FFEEDC") },
          { en: "eat", es: "comer", icon: emoji("🍴", "#EAF7EC") },
          { en: "sleep", es: "dormir", icon: illustrated("verbos/sleep", "😴", "#F3EEFD") },
          { en: "read", es: "leer", icon: illustrated("verbos/read", "📖", "#FFEDED") },
          { en: "play", es: "jugar", icon: illustrated("verbos/play", "🧸", "#FEEFF3") },
        ],
      },
      {
        id: "clima",
        name: "El Clima",
        icon: "☀️",
        words: [
          { en: "sun", es: "sol", icon: illustrated("clima/sun", "☀️", "#FFF8DE") },
          { en: "cloud", es: "nube", icon: illustrated("clima/cloud", "☁️", "#EEF4F8") },
          { en: "rain", es: "lluvia", icon: illustrated("clima/rain", "🌧️", "#E7EFF5") },
          { en: "snow", es: "nieve", icon: illustrated("clima/snow", "❄️", "#EEF5FA") },
          { en: "wind", es: "viento", icon: illustrated("clima/wind", "💨", "#EAF6FD") },
          { en: "storm", es: "tormenta", icon: illustrated("clima/storm", "⛈️", "#E5EAEE") },
        ],
      },
      {
        id: "emociones",
        name: "Emociones",
        icon: "😊",
        words: [
          { en: "happy", es: "feliz", icon: emoji("😄", "#FFE873") },
          { en: "sad", es: "triste", icon: illustrated("emociones/sad", "😢", "#AFCBEE") },
          { en: "angry", es: "enojado", icon: emoji("😠", "#F5A6A6") },
          { en: "scared", es: "asustado", icon: illustrated("emociones/scared", "😱", "#C9B8F5") },
          { en: "surprised", es: "sorprendido", icon: illustrated("emociones/surprised", "😲", "#FFD1E6") },
          { en: "tired", es: "cansado", icon: illustrated("emociones/tired", "🥱", "#E4D9C4") },
        ],
      },
      {
        id: "adjetivos",
        name: "Adjetivos",
        icon: "⚡",
        words: [
          { en: "big", es: "grande", icon: illustrated("adjetivos/big", "🐘", "#EAF2FE") },
          { en: "small", es: "pequeño", icon: illustrated("adjetivos/small", "🐜", "#FFEDED") },
          { en: "fast", es: "rápido", icon: illustrated("adjetivos/fast", "⚡", "#FFF8DE") },
          { en: "slow", es: "lento", icon: illustrated("adjetivos/slow", "🐢", "#EAF7EC") },
          { en: "hot", es: "caliente", icon: illustrated("adjetivos/hot", "🔥", "#FFEDED") },
          { en: "cold", es: "frío", icon: illustrated("adjetivos/cold", "🧊", "#EAF6FD") },
        ],
      },
      {
        id: "lugares",
        name: "Lugares",
        icon: "🏙️",
        words: [
          { en: "park", es: "parque", icon: illustrated("lugares/park", "🏞️", "#EAF7EC") },
          { en: "school", es: "escuela", icon: illustrated("lugares/school", "🏫", "#FFF3E9") },
          { en: "beach", es: "playa", icon: illustrated("lugares/beach", "🏖️", "#FFF8E5") },
          { en: "zoo", es: "zoológico", icon: illustrated("lugares/zoo", "🦓", "#FDF1DD") },
          { en: "store", es: "tienda", icon: illustrated("lugares/store", "🏬", "#FEEEF2") },
          { en: "hospital", es: "hospital", icon: illustrated("lugares/hospital", "🏥", "#F0F0F7") },
        ],
      },
    ],
  },
];

export function findLevel(levelId: string): Level | undefined {
  return LEVELS.find((l) => l.id === levelId);
}

export function findLesson(levelId: string, lessonId: string): Lesson | undefined {
  return findLevel(levelId)?.lessons.find((l) => l.id === lessonId);
}

export function lessonKey(levelId: string, lessonId: string): string {
  return `${levelId}.${lessonId}`;
}

/** Inverso de lessonKey(): "basico.colores" -> { level, lesson }. */
export function resolveLessonKey(key: string): { level: Level; lesson: Lesson } | undefined {
  const [levelId, lessonId] = key.split(".");
  const level = findLevel(levelId);
  const lesson = level?.lessons.find((l) => l.id === lessonId);
  if (!level || !lesson) return undefined;
  return { level, lesson };
}
