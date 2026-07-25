"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Plus, Trash2, Loader2, FolderTree, Star } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  createCategory, deleteCategory, toggleCategoryFeatured,
} from "@/server/actions/category";

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  isFeatured: boolean;
  productCount: number;
}

export function CategoryManager({ categories }: { categories: CategoryRow[] }) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();

  const onDelete = (id: string) => {
    if (!confirm("Delete this category?")) return;
    start(async () => {
      const res = await deleteCategory(id);
      toast[res.ok ? "success" : "error"](res.ok ? "Deleted" : res.error!);
    });
  };
  const onToggle = (id: string, v: boolean) =>
    start(async () => { await toggleCategoryFeatured(id, v); });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">{categories.length} categories</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="size-4" /> New category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create category</DialogTitle></DialogHeader>
            <CategoryForm onDone={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {categories.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-20 text-center">
          <FolderTree className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No categories yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div key={c.id} className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="relative aspect-[16/9] bg-secondary">
                {c.image && <Image src={c.image} alt={c.name} fill sizes="320px" className="object-cover" />}
                {c.isFeatured && <Badge className="absolute left-3 top-3"><Star className="size-3" /> Featured</Badge>}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">/{c.slug} · {c.productCount} products</p>
                  </div>
                  <button onClick={() => onDelete(c.id)} className="text-destructive hover:opacity-70">
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <label className="mt-3 flex items-center justify-between text-sm">
                  Featured on home
                  <Switch checked={c.isFeatured} onCheckedChange={(v) => onToggle(c.id, v)} disabled={pending} />
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryForm({ onDone }: { onDone: () => void }) {
  const [form, setForm] = useState({ name: "", slug: "", description: "", image: "", isFeatured: false });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await createCategory(form);
    setSaving(false);
    if (res.ok) { toast.success("Category created"); onDone(); }
    else toast.error(res.error ?? "Failed");
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="space-y-1.5">
        <Label>Name</Label>
        <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Bikes" />
      </div>
      <div className="space-y-1.5">
        <Label>Slug (optional)</Label>
        <Input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto" />
      </div>
      <div className="space-y-1.5">
        <Label>Image URL</Label>
        <Input value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://…" />
      </div>
      <div className="space-y-1.5">
        <Label>Description</Label>
        <Input value={form.description} onChange={(e) => set("description", e.target.value)} />
      </div>
      <label className="flex items-center justify-between text-sm">
        Feature on home page
        <Switch checked={form.isFeatured} onCheckedChange={(v) => set("isFeatured", v)} />
      </label>
      <Button type="submit" className="w-full" disabled={saving}>
        {saving && <Loader2 className="size-4 animate-spin" />} Create category
      </Button>
    </form>
  );
}
