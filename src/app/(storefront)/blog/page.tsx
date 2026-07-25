import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { safe } from "@/server/queries/content";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Journal",
  description: "Guides, design stories and styling tips from the PULSE studio.",
};

export default async function BlogPage() {
  const posts = await safe(
    () =>
      prisma.blog.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: "desc" },
      }),
    [],
  );

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-16">
      <header className="max-w-2xl">
        <h1 className="font-serif text-4xl font-semibold tracking-tight">The Journal</h1>
        <p className="mt-2 text-muted-foreground">
          Guides, design stories and styling tips for your walls.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="mt-12 text-sm text-muted-foreground">No posts yet — check back soon.</p>
      ) : (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-secondary">
                {post.coverImage && (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="360px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">
                {post.category ?? "Journal"} · {post.publishedAt ? formatDate(post.publishedAt) : ""}
              </p>
              <h2 className="mt-1 font-serif text-lg font-semibold group-hover:underline">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
