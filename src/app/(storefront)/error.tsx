"use client";

import { useEffect } from "react";
import { RotateCcw } from "@/components/icons";
import { Button } from "@/components/ui/button";

export default function StorefrontError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-32 text-center">
      <p className="font-serif text-6xl font-semibold text-muted-foreground">
        oops
      </p>
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="text-sm text-muted-foreground">
        We hit an unexpected error loading this page. Please try again.
      </p>
      <Button onClick={reset} className="mt-2">
        <RotateCcw className="size-4" /> Try again
      </Button>
    </div>
  );
}
