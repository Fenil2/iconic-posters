"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Plus, Trash2, Loader2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { createBanner, toggleBanner, deleteBanner } from "@/server/actions/banner";

export interface BannerRow {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  position: string;
  isActive: boolean;
}

export function BannerManager({ banners }: { banners: BannerRow[] }) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();

  const onDelete = (id: string) => {
    if (!confirm("Delete this banner?")) return;
    start(async () => {
      const res = await deleteBanner(id);
      toast[res.ok ? "success" : "error"](res.ok ? "Deleted" : res.error!);
    });
  };
  const onToggle = (id: string, v: boolean) => start(async () => { await toggleBanner(id, v); });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight">Banners</h1>
          <p className="mt-1 text-sm text-muted-foreground">Hero & promo banners on the storefront</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="size-4" /> New banner</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create banner</DialogTitle></DialogHeader>
            <BannerForm onDone={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {banners.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-20 text-center">
          <ImageIcon className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No banners yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {banners.map((b) => (
            <div key={b.id} className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="relative aspect-[21/9] bg-secondary">
                <Image src={b.image} alt={b.title} fill sizes="600px" className="object-cover" />
                <Badge className="absolute left-3 top-3">{b.position}</Badge>
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="min-w-0">
                  <p className="truncate font-medium">{b.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{b.subtitle}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={b.isActive} onCheckedChange={(v) => onToggle(b.id, v)} disabled={pending} />
                  <button onClick={() => onDelete(b.id)} className="text-destructive hover:opacity-70">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BannerForm({ onDone }: { onDone: () => void }) {
  const [form, setForm] = useState({
    title: "", subtitle: "", image: "", link: "", ctaLabel: "", position: "HERO",
  });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await createBanner(form);
    setSaving(false);
    if (res.ok) { toast.success("Banner created"); onDone(); }
    else toast.error(res.error ?? "Failed");
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="space-y-1.5"><Label>Title</Label>
        <Input value={form.title} onChange={(e) => set("title", e.target.value)} /></div>
      <div className="space-y-1.5"><Label>Subtitle</Label>
        <Input value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} /></div>
      <div className="space-y-1.5"><Label>Image URL</Label>
        <Input value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://…" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5"><Label>CTA label</Label>
          <Input value={form.ctaLabel} onChange={(e) => set("ctaLabel", e.target.value)} placeholder="Shop now" /></div>
        <div className="space-y-1.5"><Label>Link</Label>
          <Input value={form.link} onChange={(e) => set("link", e.target.value)} placeholder="/category/bikes" /></div>
      </div>
      <div className="space-y-1.5"><Label>Position</Label>
        <select value={form.position} onChange={(e) => set("position", e.target.value)} className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm">
          <option value="HERO">Hero carousel</option>
          <option value="OFFER">Offer strip</option>
          <option value="CATEGORY">Category</option>
          <option value="PROMO_STRIP">Promo strip</option>
        </select>
      </div>
      <Button type="submit" className="w-full" disabled={saving}>
        {saving && <Loader2 className="size-4 animate-spin" />} Create banner
      </Button>
    </form>
  );
}
