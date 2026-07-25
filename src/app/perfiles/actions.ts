"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { AVATAR_OPTIONS } from "@/components/ui/Avatar";

export async function createChild(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  const avatarId = String(formData.get("avatarId") ?? AVATAR_OPTIONS[0].id);

  if (!name) return;

  await db.child.create({
    data: { userId: session!.user.id, name, avatarId },
  });

  redirect("/perfiles");
}

export async function selectChild(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const childId = String(formData.get("childId") ?? "");
  const child = await db.child.findFirst({
    where: { id: childId, userId: session!.user.id },
  });
  if (!child) return;

  const cookieStore = await cookies();
  cookieStore.set("activeChildId", child.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/jugar");
}
