"use client";

import Image from "next/image";
import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { UploadCloud, X, Link2, Star, GripVertical } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export interface UploadedImage {
  url: string;
  alt?: string;
}

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

/** Multi-image uploader: Cloudinary widget + manual URL entry, reorderable. */
export function ImageUploader({
  value,
  onChange,
}: {
  value: UploadedImage[];
  onChange: (imgs: UploadedImage[]) => void;
}) {
  const [url, setUrl] = useState("");

  const add = (img: UploadedImage) => onChange([...value, img]);
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const makePrimary = (i: number) => {
    const next = [...value];
    const [img] = next.splice(i, 1);
    onChange([img, ...next]);
  };

  const addUrl = () => {
    if (!/^https?:\/\/.+/.test(url)) {
      toast.error("Enter a valid image URL");
      return;
    }
    add({ url });
    setUrl("");
  };

  const cloudinaryReady = CLOUD && CLOUD !== "demo" && PRESET;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {value.map((img, i) => (
          <div
            key={`${img.url}-${i}`}
            className="group relative size-28 overflow-hidden rounded-lg border border-border bg-secondary"
          >
            <Image src={img.url} alt={img.alt ?? ""} fill sizes="112px" className="object-cover" />
            {i === 0 && (
              <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[9px] font-medium text-primary-foreground">
                Primary
              </span>
            )}
            <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              {i !== 0 && (
                <button
                  type="button"
                  onClick={() => makePrimary(i)}
                  title="Make primary"
                  className="grid size-8 place-items-center rounded-full bg-white/90 text-black"
                >
                  <Star className="size-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => remove(i)}
                title="Remove"
                className="grid size-8 place-items-center rounded-full bg-white/90 text-destructive"
              >
                <X className="size-4" />
              </button>
            </div>
            <GripVertical className="absolute bottom-1 right-1 size-4 text-white/70" />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {cloudinaryReady && (
          <CldUploadWidget
            uploadPreset={PRESET}
            options={{ multiple: true, maxFiles: 8, sources: ["local", "url", "camera"] }}
            onSuccess={(result) => {
              const info = result.info;
              if (info && typeof info === "object" && "secure_url" in info) {
                add({ url: (info as { secure_url: string }).secure_url });
                toast.success("Image uploaded");
              }
            }}
          >
            {({ open }) => (
              <Button type="button" variant="outline" onClick={() => open()}>
                <UploadCloud className="size-4" /> Upload images
              </Button>
            )}
          </CldUploadWidget>
        )}

        <div className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Link2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
              placeholder="Or paste an image URL"
              className="h-10 pl-9"
            />
          </div>
          <Button type="button" variant="secondary" className="h-10" onClick={addUrl}>
            Add
          </Button>
        </div>
      </div>

      {!cloudinaryReady && (
        <p className="text-xs text-muted-foreground">
          Set <code>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code> &amp; an unsigned upload
          preset to enable drag-and-drop uploads. You can add image URLs meanwhile.
        </p>
      )}
    </div>
  );
}
