"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, Save } from "@/components/icons";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ImageUploader, type UploadedImage } from "./image-uploader";
import { createProduct, updateProduct } from "@/server/actions/product";
import { SIZE_OPTIONS, PAPER_OPTIONS, FRAME_OPTIONS } from "@/config/product-options";
import type { ProductFormInput, VariantInput } from "@/lib/validations/product";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

type ScalarFields = Omit<ProductFormInput, "images" | "variants">;

export function ProductForm({
  categories,
  initial,
  productId,
}: {
  categories: Category[];
  initial?: Partial<ProductFormInput>;
  productId?: string;
}) {
  const router = useRouter();
  const [images, setImages] = useState<UploadedImage[]>(initial?.images ?? []);
  const [variants, setVariants] = useState<VariantInput[]>(
    initial?.variants ?? [
      { size: "A3", paperType: "Matte", frameType: "None", price: 799, mrp: 1299, stock: 25 },
    ],
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, watch, setValue } = useForm<ScalarFields>({
    defaultValues: {
      name: initial?.name ?? "",
      slug: initial?.slug ?? "",
      sku: initial?.sku ?? "",
      description: initial?.description ?? "",
      shortDescription: initial?.shortDescription ?? "",
      basePrice: initial?.basePrice ?? 0,
      mrp: initial?.mrp ?? 0,
      taxRate: initial?.taxRate ?? 12,
      orientation: initial?.orientation ?? "PORTRAIT",
      status: initial?.status ?? "ACTIVE",
      categoryId: initial?.categoryId ?? categories[0]?.id ?? "",
      theme: initial?.theme ?? "",
      color: initial?.color ?? "",
      artist: initial?.artist ?? "",
      brand: initial?.brand ?? "Iconik Posters",
      isFeatured: initial?.isFeatured ?? false,
      isBestSeller: initial?.isBestSeller ?? false,
      isNewArrival: initial?.isNewArrival ?? false,
      isTrending: initial?.isTrending ?? false,
      isLimitedEdition: initial?.isLimitedEdition ?? false,
      metaTitle: initial?.metaTitle ?? "",
      metaDescription: initial?.metaDescription ?? "",
    },
  });

  const flags = watch([
    "isFeatured",
    "isBestSeller",
    "isNewArrival",
    "isTrending",
    "isLimitedEdition",
  ]);

  const addVariant = () =>
    setVariants((v) => [
      ...v,
      { size: "A3", paperType: "Matte", frameType: "None", price: 799, mrp: 1299, stock: 10 },
    ]);
  const updateVariant = (i: number, patch: Partial<VariantInput>) =>
    setVariants((v) => v.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  const removeVariant = (i: number) =>
    setVariants((v) => v.filter((_, idx) => idx !== i));

  const onSubmit = async (scalars: ScalarFields) => {
    setErrors({});
    setSaving(true);
    const payload = { ...scalars, images, variants } as ProductFormInput;
    const result = productId
      ? await updateProduct(productId, payload)
      : await createProduct(payload);
    setSaving(false);

    if (!result.ok) {
      setErrors(result.fieldErrors ?? {});
      toast.error(result.error ?? "Could not save product");
      return;
    }
    toast.success(productId ? "Product updated" : "Product created");
    router.push("/admin/products");
    router.refresh();
  };

  const flagDefs: { key: keyof ScalarFields; label: string }[] = [
    { key: "isFeatured", label: "Featured" },
    { key: "isBestSeller", label: "Best Seller" },
    { key: "isNewArrival", label: "New Arrival" },
    { key: "isTrending", label: "Trending" },
    { key: "isLimitedEdition", label: "Limited Edition" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* Main column */}
      <div className="space-y-6">
        <Section title="Basics">
          <Grid>
            <Field label="Product name" error={errors.name} full>
              <Input {...register("name")} placeholder="Superbike — Apex Red" />
            </Field>
            <Field label="SKU" error={errors.sku}>
              <Input {...register("sku")} placeholder="PLS-0001" />
            </Field>
            <Field label="Slug (optional)" error={errors.slug}>
              <Input {...register("slug")} placeholder="auto-generated" />
            </Field>
            <Field label="Short description" error={errors.shortDescription} full>
              <Input {...register("shortDescription")} placeholder="One-line summary" />
            </Field>
            <Field label="Full description" error={errors.description} full>
              <Textarea {...register("description")} rows={5} />
            </Field>
          </Grid>
        </Section>

        <Section title="Images">
          <ImageUploader value={images} onChange={setImages} />
          {errors.images && <p className="mt-2 text-xs text-destructive">{errors.images}</p>}
        </Section>

        <Section title="Variants" action={
          <Button type="button" variant="outline" size="sm" onClick={addVariant}>
            <Plus className="size-4" /> Add variant
          </Button>
        }>
          {errors.variants && <p className="mb-2 text-xs text-destructive">{errors.variants}</p>}
          <div className="space-y-3">
            {variants.map((v, i) => (
              <div key={i} className="grid grid-cols-2 gap-2 rounded-lg border border-border p-3 sm:grid-cols-7">
                <Select value={v.size} onChange={(val) => updateVariant(i, { size: val })} options={SIZE_OPTIONS} />
                <Select value={v.paperType} onChange={(val) => updateVariant(i, { paperType: val })} options={PAPER_OPTIONS} />
                <Select value={v.frameType} onChange={(val) => updateVariant(i, { frameType: val })} options={FRAME_OPTIONS} />
                <NumberInput value={v.price} onChange={(n) => updateVariant(i, { price: n })} placeholder="Price" />
                <NumberInput value={v.mrp} onChange={(n) => updateVariant(i, { mrp: n })} placeholder="MRP" />
                <NumberInput value={v.stock} onChange={(n) => updateVariant(i, { stock: n })} placeholder="Stock" />
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  disabled={variants.length === 1}
                  className="grid place-items-center rounded-md text-destructive hover:bg-secondary disabled:opacity-40"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </Section>

        <Section title="SEO">
          <Grid>
            <Field label="Meta title" full>
              <Input {...register("metaTitle")} />
            </Field>
            <Field label="Meta description" full>
              <Textarea {...register("metaDescription")} rows={2} />
            </Field>
          </Grid>
        </Section>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <Section title="Status & Pricing">
          <div className="space-y-4">
            <Field label="Status">
              <select {...register("status")} className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="ACTIVE">Active</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </Field>
            <Field label="Category" error={errors.categoryId}>
              <select {...register("categoryId")} className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm">
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Price (₹)" error={errors.basePrice}>
                <Input type="number" step="1" {...register("basePrice")} />
              </Field>
              <Field label="MRP (₹)" error={errors.mrp}>
                <Input type="number" step="1" {...register("mrp")} />
              </Field>
            </div>
            <Field label="GST %">
              <Input type="number" step="1" {...register("taxRate")} />
            </Field>
          </div>
        </Section>

        <Section title="Attributes">
          <div className="space-y-4">
            <Field label="Orientation">
              <select {...register("orientation")} className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="PORTRAIT">Portrait</option>
                <option value="LANDSCAPE">Landscape</option>
                <option value="SQUARE">Square</option>
              </select>
            </Field>
            <Field label="Series / tag"><Input {...register("artist")} placeholder="e.g. JDM" /></Field>
            <Field label="Theme"><Input {...register("theme")} placeholder="e.g. superbike" /></Field>
            <Field label="Colour"><Input {...register("color")} placeholder="e.g. red" /></Field>
          </div>
        </Section>

        <Section title="Merchandising">
          <div className="space-y-3">
            {flagDefs.map((f, idx) => (
              <label key={f.key} className="flex items-center justify-between text-sm">
                {f.label}
                <Switch
                  checked={!!flags[idx]}
                  onCheckedChange={(val) => setValue(f.key, val as never)}
                />
              </label>
            ))}
          </div>
        </Section>

        <Button type="submit" size="lg" className="w-full" disabled={saving}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {productId ? "Save changes" : "Create product"}
        </Button>
      </div>
    </form>
  );
}

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function Field({ label, error, full, children }: { label: string; error?: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={cn("space-y-1.5", full && "sm:col-span-2")}>
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 rounded-md border border-input bg-background px-2 text-sm"
    >
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

function NumberInput({ value, onChange, placeholder }: { value: number; onChange: (n: number) => void; placeholder: string }) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      placeholder={placeholder}
      className="h-10 rounded-md border border-input bg-background px-2 text-sm"
    />
  );
}
