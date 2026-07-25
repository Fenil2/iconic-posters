"use client";

import { useEffect, useState } from "react";

/** Live countdown timer to a target date (for flash sales & drops). */
export function Countdown({ target }: { target: string | Date }) {
  const targetTime = new Date(target).getTime();
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, targetTime - Date.now()),
  );

  useEffect(() => {
    const t = setInterval(
      () => setRemaining(Math.max(0, targetTime - Date.now())),
      1000,
    );
    return () => clearInterval(t);
  }, [targetTime]);

  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  const units = [
    { label: "Days", value: days },
    { label: "Hrs", value: hours },
    { label: "Min", value: minutes },
    { label: "Sec", value: seconds },
  ];

  return (
    <div className="flex items-center gap-2">
      {units.map((u, i) => (
        <div key={u.label} className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <span className="grid min-w-11 place-items-center rounded-md bg-primary px-2 py-1.5 font-mono text-lg font-semibold tabular-nums text-primary-foreground">
              {String(u.value).padStart(2, "0")}
            </span>
            <span className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
              {u.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="pb-4 text-lg font-semibold text-muted-foreground">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
