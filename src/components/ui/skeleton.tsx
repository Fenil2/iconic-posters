import { cn } from "@/lib/utils";

/** Shimmer placeholder used across loading.tsx boundaries. */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("shimmer rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
