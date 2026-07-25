"use client";

import Image from "next/image";
import { useState } from "react";
import { ThumbsUp, BadgeCheck, MessageCircleQuestion } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/shared/rating-stars";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import type { ProductDetailData } from "@/types";

export function ProductTabs({ product }: { product: ProductDetailData }) {
  const specs: [string, string | number][] = [
    ["SKU", product.sku],
    ["Sizes", [...new Set(product.variants.map((v) => v.size))].join(", ")],
    ["Paper types", [...new Set(product.variants.map((v) => v.paperType))].join(", ")],
    ["Frame options", [...new Set(product.variants.map((v) => v.frameType))].join(", ")],
    ["Orientation", product.orientation.toLowerCase()],
    ["Brand", product.brand ?? "PULSE"],
    ["Theme", product.theme ?? "—"],
    ["Tax", `${product.taxRate}% GST`],
  ];

  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="flex w-full flex-wrap justify-start gap-1 overflow-x-auto">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="specs">Specifications</TabsTrigger>
        <TabsTrigger value="reviews">Reviews ({product.ratingCount})</TabsTrigger>
        <TabsTrigger value="qa">Q&A</TabsTrigger>
        <TabsTrigger value="returns">Shipping & Returns</TabsTrigger>
      </TabsList>

      {/* Description */}
      <TabsContent value="description" className="prose-sm max-w-3xl">
        <p className="text-[15px] leading-relaxed text-foreground/90">
          {product.description}
        </p>
        <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
          <li>• Archival, acid-free stock with pigment inks (100+ year fade resistance)</li>
          <li>• Ships in protective rigid packaging</li>
          <li>• Designed & printed in India by PULSE</li>
        </ul>
      </TabsContent>

      {/* Specifications */}
      <TabsContent value="specs">
        <div className="max-w-2xl overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <tbody>
              {specs.map(([k, v], i) => (
                <tr key={k} className={i % 2 ? "bg-secondary/40" : ""}>
                  <td className="w-1/3 px-4 py-3 font-medium">{k}</td>
                  <td className="px-4 py-3 capitalize text-muted-foreground">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>

      {/* Reviews */}
      <TabsContent value="reviews">
        <ReviewsPanel product={product} />
      </TabsContent>

      {/* Q&A */}
      <TabsContent value="qa">
        <div className="max-w-2xl space-y-4">
          <div className="flex items-start gap-3 rounded-lg border border-dashed p-5">
            <MessageCircleQuestion className="size-5 shrink-0 text-muted-foreground" />
            <div>
              <p className="font-medium">Have a question about this poster?</p>
              <p className="text-sm text-muted-foreground">
                Ask about sizing, framing or delivery — we usually reply within a day.
              </p>
              <Button variant="outline" size="sm" className="mt-3">
                Ask a question
              </Button>
            </div>
          </div>
          <QA q="Does the price include the frame?" a="Only if you select a frame option. 'No frame' ships the print alone, rolled in a rigid tube." />
          <QA q="Will the colours match exactly?" a="We calibrate every print, but screens vary. Expect a faithful, gallery-grade reproduction." />
        </div>
      </TabsContent>

      {/* Returns */}
      <TabsContent value="returns">
        <div className="max-w-2xl space-y-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-medium text-foreground">Shipping</h4>
            <p>Unframed prints ship in 2–4 business days; framed pieces in 4–7 days. Free shipping over ₹999. Tracking is shared at every step.</p>
          </div>
          <div>
            <h4 className="font-medium text-foreground">Returns</h4>
            <p>7-day easy returns on unframed prints in original condition. Framed & limited editions are made-to-order and non-returnable unless they arrive damaged.</p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

function ReviewsPanel({ product }: { product: ProductDetailData }) {
  const total = Object.values(product.ratingBreakdown).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      {/* Summary */}
      <div className="space-y-4">
        <div className="text-center">
          <p className="font-serif text-5xl font-semibold">
            {product.ratingAverage.toFixed(1)}
          </p>
          <RatingStars value={product.ratingAverage} className="mt-2 justify-center" />
          <p className="mt-1 text-sm text-muted-foreground">
            {product.ratingCount} reviews
          </p>
        </div>
        <div className="space-y-1.5">
          {([5, 4, 3, 2, 1] as const).map((r) => {
            const count = product.ratingBreakdown[r];
            const pct = (count / total) * 100;
            return (
              <div key={r} className="flex items-center gap-2 text-xs">
                <span className="w-3">{r}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-8 text-right text-muted-foreground">{count}</span>
              </div>
            );
          })}
        </div>
        <Button variant="outline" className="w-full">
          Write a review
        </Button>
      </div>

      {/* List */}
      <div className="space-y-6">
        {product.reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No reviews yet — be the first to review this poster.
          </p>
        ) : (
          product.reviews.map((r) => <ReviewCard key={r.id} review={r} />)
        )}
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: ProductDetailData["reviews"][number] }) {
  const [likes, setLikes] = useState(review.likeCount);
  const [liked, setLiked] = useState(false);

  return (
    <div className="border-b border-border pb-6 last:border-0">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={review.avatar ?? undefined} />
          <AvatarFallback>{review.author[0]}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{review.author}</span>
            {review.isVerified && (
              <span className="inline-flex items-center gap-1 text-xs text-[var(--success)]">
                <BadgeCheck className="size-3.5" /> Verified
              </span>
            )}
          </div>
          <RatingStars value={review.rating} size="sm" />
        </div>
        <span className="ml-auto text-xs text-muted-foreground">
          {formatDate(review.createdAt)}
        </span>
      </div>

      {review.title && <p className="mt-3 text-sm font-medium">{review.title}</p>}
      <p className="mt-1 text-sm text-muted-foreground">{review.comment}</p>

      {review.images.length > 0 && (
        <div className="mt-3 flex gap-2">
          {review.images.map((img, i) => (
            <div key={i} className="relative size-16 overflow-hidden rounded-md bg-secondary">
              <Image src={img} alt="" fill sizes="64px" className="object-cover" />
            </div>
          ))}
        </div>
      )}

      {review.adminReply && (
        <div className="mt-3 rounded-lg bg-secondary/60 p-3 text-sm">
          <span className="font-medium">PULSE:</span>{" "}
          <span className="text-muted-foreground">{review.adminReply}</span>
        </div>
      )}

      <button
        onClick={() => {
          setLiked((l) => !l);
          setLikes((n) => (liked ? n - 1 : n + 1));
        }}
        className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <ThumbsUp className={liked ? "size-3.5 fill-foreground" : "size-3.5"} />
        Helpful ({likes})
      </button>
    </div>
  );
}

function QA({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-sm font-medium">Q: {q}</p>
      <p className="mt-1 text-sm text-muted-foreground">A: {a}</p>
    </div>
  );
}
