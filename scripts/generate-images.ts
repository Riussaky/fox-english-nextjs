/**
 * Genera los fondos de cada lección, las poses de la mascota "Fox" y los
 * avatares de perfil con Cloudflare Workers AI (free tier, sin tarjeta),
 * estilo ilustración de cuento infantil, y los guarda como assets estáticos
 * en public/generated. Mismo patrón exacto que numi-landia-app/scripts/generate-images.ts.
 *
 * Uso: npx tsx scripts/generate-images.ts [--force]
 * --force regenera también los que ya existen (por defecto se saltan).
 * Requiere CLOUDFLARE_ACCOUNT_ID y CLOUDFLARE_API_TOKEN en .env.
 */
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const FORCE = process.argv.includes("--force");

try {
  process.loadEnvFile();
} catch {
  // sin .env en el root, se asume que las variables ya están en el entorno
}

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const MODEL = process.env.CLOUDFLARE_IMAGE_MODEL ?? "@cf/stabilityai/stable-diffusion-xl-base-1.0";

const BG_STYLE =
  "children's book illustration, painted gouache and watercolor texture, warm whimsical colors, storybook illustration, flat painterly rendering, soft brush texture, hand-painted, no photorealism, no 3D render, no text, no watermark, no letters, no people, no children, no human faces";
const BG_NEGATIVE =
  "photograph, photorealistic, 3D render, CGI, blurry, out of focus, low detail, text, watermark, signature, people, children, human faces, hands, low quality, distorted, cropped";

interface Asset {
  file: string; // sin extensión: se detecta el formato real al descargar
  prompt: string;
  negativePrompt: string;
  width: number;
  height: number;
  seed?: number;
}

// Un fondo ilustrado por lección (15) + "home" para las pantallas fuera de
// una lección (perfiles, dashboard, login) — a diferencia de NumiLandia
// (fondo por actividad, 8 en total), acá la unidad temática es la lección.
const BACKGROUNDS: Asset[] = [
  {
    file: "backgrounds/colores",
    prompt: `A vibrant rainbow arching over a garden of giant paint palette flowers, colorful paint drops splashing, ribbons floating in the breeze, ${BG_STYLE}`,
    negativePrompt: BG_NEGATIVE,
    width: 1600,
    height: 1024,
  },
  {
    file: "backgrounds/animales",
    prompt: `A sunny woodland clearing, friendly forest critters peeking from colorful bushes and flowers, soft dappled sunlight, ${BG_STYLE}`,
    negativePrompt: BG_NEGATIVE,
    width: 1600,
    height: 1024,
  },
  {
    file: "backgrounds/numeros",
    prompt: `A bright sky full of colorful numbered balloons floating upward, fluffy clouds, cheerful confetti, ${BG_STYLE}`,
    negativePrompt: BG_NEGATIVE,
    width: 1600,
    height: 1024,
  },
  {
    file: "backgrounds/formas",
    prompt: `A cheerful pile of colorful wooden toy shape blocks scattered on a soft rug, circles squares triangles and stars, bright playroom lighting, ${BG_STYLE}`,
    negativePrompt: BG_NEGATIVE,
    width: 1600,
    height: 1024,
  },
  {
    file: "backgrounds/cuerpo",
    prompt: `A bright cheerful playroom with colorful exercise mats, soft foam blocks and toys scattered around, warm sunny light through a window, ${BG_STYLE}`,
    negativePrompt: BG_NEGATIVE,
    width: 1600,
    height: 1024,
  },
  {
    file: "backgrounds/comida",
    prompt: `A cheerful picnic table with colorful fruits, a loaf of bread and a pitcher of milk, red checkered blanket, sunny park background, ${BG_STYLE}`,
    negativePrompt: BG_NEGATIVE,
    width: 1600,
    height: 1024,
  },
  {
    file: "backgrounds/familia",
    prompt: `A cozy warm living room with a crackling fireplace, framed photos on the wall, soft armchairs and a knit blanket, ${BG_STYLE}`,
    negativePrompt: BG_NEGATIVE,
    width: 1600,
    height: 1024,
  },
  {
    file: "backgrounds/casa",
    prompt: `A cozy warm living room interior, a comfy bed, a chair, a small table, a door and a window with curtains, warm afternoon lighting, ${BG_STYLE}`,
    negativePrompt: BG_NEGATIVE,
    width: 1600,
    height: 1024,
  },
  {
    file: "backgrounds/escuela",
    prompt: `A bright colorful classroom with wooden desks, a chalkboard with doodles, books and school supplies neatly arranged, ${BG_STYLE}`,
    negativePrompt: BG_NEGATIVE,
    width: 1600,
    height: 1024,
  },
  {
    file: "backgrounds/transporte",
    prompt: `A busy colorful toy town street, a red car, a yellow school bus, a bicycle, a train and a little boat, bright cheerful town, ${BG_STYLE}`,
    negativePrompt: BG_NEGATIVE,
    width: 1600,
    height: 1024,
  },
  {
    file: "backgrounds/verbos",
    prompt: `A sunny playground with swings, a slide and a see-saw, colorful balls scattered on green grass, ${BG_STYLE}`,
    negativePrompt: BG_NEGATIVE,
    width: 1600,
    height: 1024,
  },
  {
    file: "backgrounds/clima",
    prompt: `A whimsical sky showing bright sun, fluffy clouds, gentle rain and a rainbow all together, dreamy weather scene, ${BG_STYLE}`,
    negativePrompt: BG_NEGATIVE,
    width: 1600,
    height: 1024,
  },
  {
    file: "backgrounds/emociones",
    prompt: `A whimsical bright sky full of colorful round balloons each with a different simple smiley expression, soft pastel clouds, ${BG_STYLE}`,
    negativePrompt: `${BG_NEGATIVE}, human faces, realistic faces`,
    width: 1600,
    height: 1024,
  },
  {
    file: "backgrounds/adjetivos",
    prompt: `A whimsical garden with one giant friendly sunflower towering over a row of tiny daisies, warm sunny day, size contrast, ${BG_STYLE}`,
    negativePrompt: BG_NEGATIVE,
    width: 1600,
    height: 1024,
  },
  {
    file: "backgrounds/lugares",
    prompt: `A colorful toy village seen from above, a little school, a park with trees, a sandy beach and small shops, bright cheerful town, ${BG_STYLE}`,
    negativePrompt: BG_NEGATIVE,
    width: 1600,
    height: 1024,
  },
  {
    file: "backgrounds/home",
    prompt: `A cheerful sunny backyard with a big oak tree, a wooden rope swing, a white picket fence, flower beds and butterflies, warm inviting atmosphere, ${BG_STYLE}`,
    negativePrompt: BG_NEGATIVE,
    width: 1600,
    height: 1024,
  },
];

const MASCOT_STYLE =
  "children's book illustration, painted gouache and watercolor texture, warm whimsical storybook style, hand-painted, soft brush texture, no photorealism, no 3D render, no text, no watermark, flat solid pastel color background, no scenery, plain background";
const MASCOT_NEGATIVE =
  "photograph, photorealistic, 3D render, CGI, blurry, text, watermark, signature, multiple characters, cropped, low quality, people, human, scary, busy background, circular frame, border, vignette, badge, coin, bokeh, blurred background, scenery, environment, out of focus background, patterned background, two foxes, duplicate, second character, pair, group";
const MASCOT_CHARACTER =
  "Fox, a small chubby friendly cartoon fox character with big round expressive eyes, orange and white fur, pointed ears, fluffy tail, centered, full body visible, single image, alone, single fox";
const MASCOT_SEED = 4821;

const MASCOT: Asset[] = [
  {
    file: "mascot/happy",
    prompt: `${MASCOT_CHARACTER}, standing pose, gentle happy smile, eyes open, ${MASCOT_STYLE}`,
    negativePrompt: MASCOT_NEGATIVE,
    width: 640,
    height: 640,
    seed: MASCOT_SEED,
  },
  {
    file: "mascot/excited",
    prompt: `${MASCOT_CHARACTER}, jumping with joy, front paws raised up, big excited open-mouth smile, eyes open wide, ${MASCOT_STYLE}`,
    negativePrompt: `${MASCOT_NEGATIVE}, twins, siblings, multiple foxes, second fox, conjoined, nuzzling, cheek to cheek, two characters touching, couple`,
    width: 640,
    height: 640,
    seed: MASCOT_SEED,
  },
  {
    file: "mascot/thinking",
    prompt: `${MASCOT_CHARACTER}, single image, head tilted, one paw near chin in a thinking pose, curious expression, plain flat pastel background, ${MASCOT_STYLE}`,
    negativePrompt: `${MASCOT_NEGATIVE}, repeating pattern, tiled, seamless pattern, wallpaper, texture, comic panels, multiple panels, grid, storyboard, collage, four panels, split image, snow, dots, polka dots, speckles, signature, artist signature, watermark text, gradient background, dark background, night sky, stars`,
    width: 640,
    height: 640,
    seed: MASCOT_SEED,
  },
];

// --- Avatares de perfil (mismos animales que AVATAR_OPTIONS en Avatar.tsx) ---

const AVATAR_STYLE =
  "children's book illustration, painted gouache and watercolor texture, warm whimsical storybook style, hand-painted, soft brush texture, no photorealism, no 3D render, no text, no watermark, flat solid pastel color background, no scenery, plain background, close-up head and shoulders portrait, front-facing, centered, single character, alone, full view not cropped";
const AVATAR_NEGATIVE =
  "photograph, photorealistic, 3D render, CGI, blurry, text, watermark, signature, multiple characters, cropped, low quality, people, human, scary, busy background, circular frame, border, vignette, badge, coin, bokeh, blurred background, scenery, environment, patterned background, duplicate, second character, pair, group, full body, body, legs";

const AVATARS: Asset[] = [
  {
    file: "avatars/zorro",
    prompt: `single image, a cute cartoon fox character portrait, orange and white fur, big round eyes, small pointed ears, ${AVATAR_STYLE}`,
    negativePrompt: `${AVATAR_NEGATIVE}, repeating pattern, tiled, seamless pattern, wallpaper, texture, comic panels, multiple panels, grid, collage, four panels, split image`,
    width: 640,
    height: 640,
  },
  {
    file: "avatars/gato",
    prompt: `a cute cartoon cat character portrait, orange and white fur, pointed ears, big round eyes, whiskers, ${AVATAR_STYLE}`,
    negativePrompt: AVATAR_NEGATIVE,
    width: 640,
    height: 640,
  },
  {
    file: "avatars/perro",
    prompt: `a cute cartoon puppy character portrait, tan and white fur, floppy ears, big round eyes, ${AVATAR_STYLE}`,
    negativePrompt: AVATAR_NEGATIVE,
    width: 640,
    height: 640,
  },
  {
    file: "avatars/pajaro",
    prompt: `a cute cartoon bluebird character portrait, round fluffy body, small orange beak, big round eyes, ${AVATAR_STYLE}`,
    negativePrompt: AVATAR_NEGATIVE,
    width: 640,
    height: 640,
  },
  {
    file: "avatars/pez",
    prompt: `single image, a cute cartoon clownfish character portrait on a plain solid pastel blue background, orange body with a couple of white stripes outlined in black, big round eyes, ${AVATAR_STYLE}`,
    negativePrompt: `${AVATAR_NEGATIVE}, repeating pattern, tiled, seamless pattern, wallpaper, texture, many fish, school of fish, multiple fish, comic panels, multiple panels, grid, collage, four panels, split image, striped background, stripes in background, black and white stripes, horizontal stripes, zebra pattern, barcode pattern`,
    width: 640,
    height: 640,
  },
  {
    file: "avatars/conejo",
    prompt: `a cute cartoon rabbit character portrait, white fur, long floppy ears, big round eyes, ${AVATAR_STYLE}`,
    negativePrompt: AVATAR_NEGATIVE,
    width: 640,
    height: 640,
  },
  {
    file: "avatars/leon",
    prompt: `a cute cartoon lion cub character portrait, golden fur, fluffy mane, big round eyes, ${AVATAR_STYLE}`,
    negativePrompt: `${AVATAR_NEGATIVE}, pencils, paintbrush, art supplies, props, paper, drawing tools`,
    width: 640,
    height: 640,
  },
  {
    file: "avatars/panda",
    prompt: `a cute cartoon panda character portrait, black and white fur, big round eyes, round ears, ${AVATAR_STYLE}`,
    negativePrompt: AVATAR_NEGATIVE,
    width: 640,
    height: 640,
  },
];

const ASSETS: Asset[] = [...BACKGROUNDS, ...MASCOT, ...AVATARS];

function detectExtension(buffer: Buffer): "png" | "jpg" {
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return "png";
  return "jpg";
}

async function generateImage(asset: Asset): Promise<{ buffer: Buffer; ext: string }> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${MODEL}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: asset.prompt,
      negative_prompt: asset.negativePrompt,
      width: asset.width,
      height: asset.height,
      num_steps: 20,
      guidance: 7.5,
      ...(asset.seed !== undefined ? { seed: asset.seed } : {}),
    }),
  });

  if (!res.ok) {
    throw new Error(`Cloudflare API error ${res.status}: ${await res.text()}`);
  }

  // Algunos modelos devuelven la imagen binaria directamente, otros un JSON
  // con base64 en result.image. Manejamos ambos casos.
  const contentType = res.headers.get("content-type") ?? "";
  let buffer: Buffer;
  if (contentType.startsWith("image/")) {
    buffer = Buffer.from(await res.arrayBuffer());
  } else {
    const data = await res.json();
    const base64: string | undefined = data?.result?.image;
    if (!base64) {
      throw new Error(`Cloudflare no devolvió una imagen: ${JSON.stringify(data).slice(0, 500)}`);
    }
    buffer = Buffer.from(base64, "base64");
  }

  return { buffer, ext: detectExtension(buffer) };
}

function alreadyExists(file: string): boolean {
  return (
    existsSync(path.join(process.cwd(), "public", "generated", `${file}.jpg`)) ||
    existsSync(path.join(process.cwd(), "public", "generated", `${file}.png`))
  );
}

async function main() {
  if (!ACCOUNT_ID || !API_TOKEN) {
    console.error(
      "Faltan CLOUDFLARE_ACCOUNT_ID y/o CLOUDFLARE_API_TOKEN en tu .env. Ver README para conseguirlos gratis."
    );
    process.exit(1);
  }

  for (const asset of ASSETS) {
    if (alreadyExists(asset.file) && !FORCE) {
      console.log(`↷ ${asset.file} ya existe, omitiendo (usa --force para regenerar todo)`);
      continue;
    }

    console.log(`Generando ${asset.file}...`);
    const { buffer, ext } = await generateImage(asset);
    const outPath = path.join(process.cwd(), "public", "generated", `${asset.file}.${ext}`);
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, buffer);
    console.log(`✓ ${asset.file}.${ext}`);
  }

  console.log("\nListo. Recargá la app para ver las imágenes en vez del fallback.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
