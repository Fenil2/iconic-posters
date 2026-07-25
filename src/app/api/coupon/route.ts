import { NextResponse } from "next/server";
import { z } from "zod";
import { validateCoupon } from "@/server/queries/coupon";
import { getCurrentUser } from "@/lib/auth";

const schema = z.object({
  code: z.string().min(1).max(40),
  subtotal: z.number().nonnegative(),
});

export async function POST(req: Request) {
  try {
    const { code, subtotal } = schema.parse(await req.json());
    const user = await getCurrentUser();
    const result = await validateCoupon(code, subtotal, user?.id);
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not validate coupon" },
      { status: 400 },
    );
  }
}
