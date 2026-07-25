import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@/components/icons";
import { prisma } from "@/lib/prisma";
import { safe } from "@/server/queries/content";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

async function getPost(slug: string) {
  return prisma.blog.findUnique({ where: { slug } });
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await safe(() => getPost(slug), null);
  if (!post) return { title: "Post not found" };
  return {
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt ?? undefined,
    alternates: { canonical: `/blog/${slug}` },
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await safe(() => getPost(slug), null);
  if (!post || !post.isPublished) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to Journal
      </Link>

      <p className="mt-6 text-xs uppercase tracking-wider text-muted-foreground">
        {post.category ?? "Journal"} · {post.publishedAt ? formatDate(post.publishedAt) : ""} · {post.author}
      </p>
      <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight">{post.title}</h1>

      {post.coverImage && (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl bg-secondary">
          <Image src={post.coverImage} alt={post.title} fill sizes="768px" className="object-cover" priority />
        </div>
      )}

      <div className="mt-8 whitespace-pre-line text-[15px] leading-relaxed text-foreground/90">
        {post.content}
      </div>
    </article>
  );
}
