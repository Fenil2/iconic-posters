import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  value: number;
  count?: number;
  size?: "sm" | "md";
  className?: string;
  showCount?: boolean;
}

/** Accessible star rating with half-star precision via clip. */
export function RatingStars({
  value,
  count,
  size = "sm",
  className,
  showCount = false,
}: RatingStarsProps) {
  const dim = size === "sm" ? "size-3.5" : "size-4";
  return (
    <div
      className={cn("flex items-center gap-1", className)}
      aria-label={`Rated ${value} out of 5`}
    >
      <div className="relative flex">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={cn(dim, "text-border")} strokeWidth={1.5} />
        ))}
        <div
          className="absolute inset-0 flex overflow-hidden"
          style={{ width: `${(Math.min(value, 5) / 5) * 100}%` }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <Star
              key={i}
              className={cn(dim, "fill-accent text-accent")}
              strokeWidth={1.5}
            />
          ))}
        </div>
      </div>
      {showCount && (
        <span className="text-xs text-muted-foreground">
          {value.toFixed(1)}
          {count !== undefined && ` (${count})`}
        </span>
      )}
    </div>
  );
}
