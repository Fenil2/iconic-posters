"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { QueryProvider } from "./query-provider";

/**
 * Root client providers, mounted once in the app layout:
 * auth session, theme (dark mode), React Query, tooltips and toasts.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <QueryProvider>
          <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
          <Toaster />
          <InstallPrompt />
        </QueryProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
