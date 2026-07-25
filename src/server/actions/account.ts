"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { addressSchema, type AddressInput } from "@/lib/validations/checkout";
import { z } from "zod";

export interface AccountActionResult {
  ok: boolean;
  error?: string;
}

/** Create a new address; first address becomes the default. */
export async function addAddress(input: AddressInput): Promise<AccountActionResult> {
  const user = await requireUser();
  const parsed = addressSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid address" };
  }

  const count = await prisma.address.count({ where: { userId: user.id } });
  await prisma.address.create({
    data: { ...parsed.data, userId: user.id, isDefault: count === 0 },
  });
  revalidatePath("/account/addresses");
  return { ok: true };
}

export async function updateAddress(
  id: string,
  input: AddressInput,
): Promise<AccountActionResult> {
  const user = await requireUser();
  const parsed = addressSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid address" };
  }
  const existing = await prisma.address.findFirst({ where: { id, userId: user.id } });
  if (!existing) return { ok: false, error: "Address not found" };

  await prisma.address.update({ where: { id }, data: parsed.data });
  revalidatePath("/account/addresses");
  return { ok: true };
}

export async function deleteAddress(id: string): Promise<AccountActionResult> {
  const user = await requireUser();
  const existing = await prisma.address.findFirst({ where: { id, userId: user.id } });
  if (!existing) return { ok: false, error: "Address not found" };
  await prisma.address.delete({ where: { id } });
  revalidatePath("/account/addresses");
  return { ok: true };
}

export async function setDefaultAddress(id: string): Promise<AccountActionResult> {
  const user = await requireUser();
  await prisma.$transaction([
    prisma.address.updateMany({
      where: { userId: user.id },
      data: { isDefault: false },
    }),
    prisma.address.updateMany({
      where: { id, userId: user.id },
      data: { isDefault: true },
    }),
  ]);
  revalidatePath("/account/addresses");
  return { ok: true };
}

const profileSchema = z.object({
  name: z.string().min(2, "Name is too short").max(60),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
    .optional()
    .or(z.literal("")),
});

export async function updateProfile(input: {
  name: string;
  phone?: string;
}): Promise<AccountActionResult> {
  const user = await requireUser();
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { name: parsed.data.name, phone: parsed.data.phone || null },
  });
  revalidatePath("/account/settings");
  return { ok: true };
}
