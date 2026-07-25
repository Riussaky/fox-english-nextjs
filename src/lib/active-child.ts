import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

/** Perfil de niño/a activo (guardado como cookie tras elegirlo en /perfiles),
 * verificado contra la cuenta logueada. Null si no hay sesión o el perfil
 * no pertenece a esta cuenta. */
export async function getActiveChild() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const cookieStore = await cookies();
  const childId = cookieStore.get("activeChildId")?.value;
  if (!childId) return null;

  return db.child.findFirst({ where: { id: childId, userId: session.user.id } });
}
