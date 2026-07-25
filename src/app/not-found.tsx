import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="font-serif text-8xl font-semibold tracking-tight">
        4<span className="text-accent">0</span>4
      </p>
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">This wall is bare</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          The page you’re looking for doesn’t exist or has been moved. Let’s get
          you back to the gallery.
        </p>
      </div>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/">Back home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/shop">Browse posters</Link>
        </Button>
      </div>
    </div>
  );
}
