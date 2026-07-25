# Fox English

App para que niños de 5 a 12 años aprendan inglés jugando: 3 niveles (Básico, Medio, Intermedio), 15 lecciones, 90 palabras de vocabulario, 5 tipos de actividad por lección, perfiles por niño/a con progreso guardado, y un panel para familias/docentes. Instalable como PWA en el celular.

Migración de [`ingles-kids-app`](../ingles-kids-app) (vanilla JS, sin backend) al mismo stack que [NumiLandia](../numi-landia-app), pensado como base compartida para futuros proyectos de esta misma línea.

## Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS.
- **Backend**: Server Actions de Next.js + Prisma ORM.
- **Auth**: Auth.js (NextAuth v5) con magic link por email vía Resend.
- **Base de datos**: SQLite en desarrollo local (sin cuenta externa). **Antes de desplegar en Vercel hay que migrar a Postgres** (ver abajo), porque el filesystem de Vercel es efímero.
- **Gráficos**: Recharts, para el panel de progreso por nivel.
- **PWA**: `public/manifest.json` + `public/sw.js` (caché network-first).
- **Mascota, fondos y avatares**: generados con Cloudflare Workers AI (opcional), con fallback dibujado en código (SVG geométrico / emoji / fondo animado CSS) si no se generaron — la app nunca se ve rota.
- **Música y lectura en voz alta**: música de fondo sintetizada (Web Audio, distinta melodía a NumiLandia y a la app vieja) y lectura bajo demanda de instrucciones (español) y vocabulario (inglés) vía Web Speech API.

## Puesta en marcha

```bash
npm install
npx prisma migrate dev
npm run dev
```

Abre [http://localhost:3002](http://localhost:3002) (puerto 3002, para correr en paralelo a NumiLandia en el 3001).

## Login sin cuenta de Resend

Si `RESEND_API_KEY` está vacío en `.env`, el login no manda un email real: el link mágico se imprime en la consola del servidor (`npm run dev`). Copialo y pegalo en el navegador para entrar. Para producción, conseguí una key en [resend.com/api-keys](https://resend.com/api-keys).

## Variables de entorno

Ver [`.env.example`](.env.example).

| Variable | Dónde obtenerla |
|---|---|
| `DATABASE_URL` | `file:./dev.db` en desarrollo; en producción, tu proveedor de Postgres (Neon, Supabase, Railway...) |
| `AUTH_SECRET` | Generá uno con `npx auth secret` |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` | resend.com/api-keys (vacío = fallback de consola en dev) |
| `CLOUDFLARE_ACCOUNT_ID` / `CLOUDFLARE_API_TOKEN` | Ver sección "Assets generados con IA" |

## Migrar a Postgres antes de desplegar

1. En `prisma/schema.prisma`, cambiá `provider = "sqlite"` por `provider = "postgresql"` en el bloque `datasource`.
2. Conseguí una base gratis en [Neon](https://neon.tech) y poné su connection string en `DATABASE_URL` (en Vercel, como variable de entorno).
3. Corré `npx prisma migrate dev --name init` una vez con esa URL para generar las migraciones de Postgres.
4. Desplegá en Vercel normalmente (`npm run build` ya corre `prisma generate`).

## Assets generados con IA (opcional)

Sin configurar nada, la mascota Fox se ve como un SVG geométrico, los avatares como emoji, y los fondos como un fondo animado en CSS. Para la identidad ilustrada completa (mismo estilo pintado que NumiLandia):

1. Creá una cuenta gratis en [dash.cloudflare.com](https://dash.cloudflare.com) (no pide tarjeta para el free tier de Workers AI) — o reutilizá la misma que ya tengas de NumiLandia.
2. Copiá tu **Account ID** (barra lateral del dashboard, o Workers & Pages → Overview).
3. Creá un token: **Mi perfil → API Tokens → Create Token** → plantilla "Workers AI" (o custom con `Account · Workers AI · Edit`).
4. Pegá ambos en `.env` como `CLOUDFLARE_ACCOUNT_ID` y `CLOUDFLARE_API_TOKEN`.
5. Corré `npm run generate:images` y recargá la app.

Genera 27 imágenes: 3 poses de la mascota Fox (`mascot/happy|excited|thinking`), 16 fondos (uno por lección + `home`), y 8 avatares de perfil (`avatars/*`). Para cambiar los prompts o agregar un asset nuevo, editá el array `ASSETS` en [`scripts/generate-images.ts`](scripts/generate-images.ts).

## Voz y música

- Cada juego tiene un botón "🔊 Escuchar/Repetir" para leer la palabra en inglés bajo demanda (no lectura automática, a diferencia de NumiLandia) — mantiene el ritmo original de Fox English.
- Los controles flotantes (abajo a la derecha, dentro de `/jugar`) silencian música y voz por separado; la preferencia queda guardada en el navegador.

## Contenido y actividades

**3 niveles** (Básico, Medio, Intermedio) × **5 lecciones cada uno** × **6 palabras** = 90 palabras, definidas en [`src/lib/content.ts`](src/lib/content.ts).

**5 tipos de actividad** por lección, uno por componente en `src/components/games/`:

| Actividad | Componente | Mecánica |
|---|---|---|
| Tarjetas | `FlashcardsGame` | Dar vuelta la tarjeta, navegar con ← / → |
| Memorama | `MemoryGame` | Encontrar las 6 parejas ícono + palabra |
| Quiz | `QuizGame` | Opción múltiple, 4 alternativas |
| Arrastra y Une | `DragMatchGame` | Arrastrar cada palabra a su imagen (Pointer Events) |
| Ordena las Letras | `ScrambleGame` | Tocar letras para armar la palabra en inglés |

El puntaje (1-3 estrellas por lección×actividad, nunca baja en un reintento peor) se guarda en el modelo `LessonAttempt` de Prisma.

## Fuera de alcance

Apps nativas iOS/Android (se descartó el empaquetado Electron de la app vieja a favor de PWA), asistente de IA, currículos oficiales por país, roles docentes con múltiples alumnos por clase.
