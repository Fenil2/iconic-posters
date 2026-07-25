import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { toCardData } from "@/server/queries/products";

const schema = z.object({ ids: z.array(z.string()).max(60) });

/** Hydrate a set of product ids into card DTOs (for wishlist / recently viewed). */
export async function POST(req: Request) {
  try {
    const { ids } = schema.parse(await req.json());
    if (!ids.length) return NextResponse.json({ products: [] });

    const rows = await prisma.product.findMany({
      where: { id: { in: ids }, status: "ACTIVE" },
      include: {
        images: { orderBy: { position: "asc" }, take: 2 },
        variants: { select: { stock: true } },
      },
    });
    // Preserve the caller's ordering.
    const map = new Map(rows.map((r) => [r.id, toCardData(r)]));
    const products = ids.map((id) => map.get(id)).filter(Boolean);
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
