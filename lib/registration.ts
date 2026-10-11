import { prisma } from "./prisma";

const REGISTRATION_OPEN_KEY = "registration_open";

export async function isRegistrationOpen(): Promise<boolean> {
  const row = await prisma.setting.findUnique({ where: { key: REGISTRATION_OPEN_KEY } });
  return row?.value !== "false";
}

export async function setRegistrationOpen(open: boolean): Promise<void> {
  await prisma.setting.upsert({
    where: { key: REGISTRATION_OPEN_KEY },
    create: { key: REGISTRATION_OPEN_KEY, value: open ? "true" : "false" },
    update: { value: open ? "true" : "false" },
  });
}
