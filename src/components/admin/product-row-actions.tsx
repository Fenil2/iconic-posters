"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Pencil, Trash2, ExternalLink } from "@/components/icons";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "@/components/icons";
import { deleteProduct } from "@/server/actions/product";

export function ProductRowActions({ id, slug }: { id: string; slug: string }) {
  const [isPending, startTransition] = useTransition();

  const onDelete = () => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    startTransition(async () => {
      const res = await deleteProduct(id);
      toast[res.ok ? "success" : "error"](res.ok ? "Product deleted" : res.error ?? "Failed");
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="grid size-8 place-items-center rounded-md hover:bg-secondary">
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/admin/products/${id}/edit`}>
            <Pencil /> Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/product/${slug}`} target="_blank">
            <ExternalLink /> View on store
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onDelete}
          disabled={isPending}
          className="text-destructive"
        >
          <Trash2 /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
