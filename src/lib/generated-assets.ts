import { existsSync } from "fs";
import path from "path";

/**
 * Los assets con IA se generan una sola vez (scripts/generate-images.ts) y
 * se guardan como archivos estáticos en public/generated. Mientras no
 * existan, la app sigue funcionando con el fallback dibujado en código.
 */
export function getGeneratedAsset(relativePath: string): string | null {
  const absolutePath = path.join(process.cwd(), "public", "generated", relativePath);
  return existsSync(absolutePath) ? `/generated/${relativePath}` : null;
}

/**
 * El script de generación no sabe de antemano si el modelo va a devolver
 * PNG o JPEG, así que guarda con la extensión real detectada. Esta función
 * prueba ambas para no tener que hardcodear la extensión en el resto del código.
 */
export function getGeneratedAssetAnyExt(basePathWithoutExt: string): string | null {
  return getGeneratedAsset(`${basePathWithoutExt}.jpg`) ?? getGeneratedAsset(`${basePathWithoutExt}.png`);
}

export interface MascotSrcs {
  happy: string | null;
  excited: string | null;
  thinking: string | null;
}

/** Las 3 poses generadas de la mascota "Fox" (el zorro, o null si todavía no se generaron). */
export function getMascotSrcs(): MascotSrcs {
  return {
    happy: getGeneratedAssetAnyExt("mascot/happy"),
    excited: getGeneratedAssetAnyExt("mascot/excited"),
    thinking: getGeneratedAssetAnyExt("mascot/thinking"),
  };
}

/** El retrato ilustrado de un avatar de perfil (o null si falta generar — Avatar cae al emoji). */
export function getAvatarSrc(avatarId: string): string | null {
  return getGeneratedAssetAnyExt(`avatars/${avatarId}`);
}

/** El fondo ilustrado de una lección (id de lección, ej. "colores") o null si falta generar. */
export function getLessonBackgroundSrc(lessonId: string): string | null {
  return getGeneratedAssetAnyExt(`backgrounds/${lessonId}`);
}
