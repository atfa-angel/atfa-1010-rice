"use server";

import { prisma } from "@/lib/prisma";
import { computeAmount } from "@/lib/pricing";
import { formatReference } from "@/lib/reference";
import { sendConfirmationEmail } from "@/lib/email";
import { revalidatePath } from "next/cache";

export type RegisterState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | {
      status: "success";
      reference: string;
      phone: string;
      boxes: number;
      packs: number;
      amount: number;
      emailSent: boolean;
    };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_QUANTITY = 10000;

function parseQuantity(raw: FormDataEntryValue | null): number | null {
  const text = String(raw ?? "").trim();
  if (text === "") return 0;
  const value = Number(text);
  if (!Number.isInteger(value) || value < 0 || value > MAX_QUANTITY) return null;
  return value;
}

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const orgName = String(formData.get("orgName") || "").trim();
  const contactName = String(formData.get("contactName") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const note = String(formData.get("note") || "").trim();

  if (!orgName || !contactName || !phone || !email) {
    return { status: "error", message: "請完整填寫單位/姓名、聯絡人、電話與 Email。" };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { status: "error", message: "請輸入正確的 Email 格式。" };
  }

  const boxes = parseQuantity(formData.get("boxes"));
  const packs = parseQuantity(formData.get("packs"));
  if (boxes === null || packs === null) {
    return { status: "error", message: "箱數與包數請輸入 0 以上的整數。" };
  }
  if (boxes + packs === 0) {
    return { status: "error", message: "請至少認購 1 箱或 1 包。" };
  }

  const amount = computeAmount(boxes, packs);

  const registration = await prisma.registration.create({
    data: {
      orgName,
      contactName,
      phone,
      email,
      boxes,
      packs,
      amount,
      note: note || null,
    },
  });

  const reference = formatReference(registration.id);

  const emailResult = await sendConfirmationEmail({
    to: email,
    contactName,
    orgName,
    boxes,
    packs,
    amount,
    reference,
    phone,
  });

  if (emailResult.sent) {
    await prisma.registration.update({
      where: { id: registration.id },
      data: { emailSent: true },
    });
  }

  revalidatePath("/admin");

  return {
    status: "success",
    reference,
    phone,
    boxes,
    packs,
    amount,
    emailSent: emailResult.sent,
  };
}
