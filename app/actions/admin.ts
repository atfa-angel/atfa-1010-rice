"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE_NAME, createSessionToken, verifySessionToken } from "@/lib/auth";

export type LoginState = { status: "idle" } | { status: "error"; message: string };

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = String(formData.get("password") || "");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return {
      status: "error",
      message: "系統尚未設定後台密碼（ADMIN_PASSWORD），請聯繫網站管理員。",
    };
  }

  if (password !== adminPassword) {
    return { status: "error", message: "密碼錯誤，請再試一次。" };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  redirect("/admin/login");
}

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    redirect("/admin/login");
  }
}

export async function togglePaidAction(id: number, nextPaid: boolean) {
  await requireAdmin();
  await prisma.registration.update({
    where: { id },
    data: { paid: nextPaid, paidAt: nextPaid ? new Date() : null },
  });
  revalidatePath("/admin");
}
