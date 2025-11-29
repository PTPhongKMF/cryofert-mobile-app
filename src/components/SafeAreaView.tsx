import { cn } from "@utils/cn";
import React from "react";

type SafeAreaViewProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  withFixedHeader?: boolean;
};

/**
 * Simple wrapper that adds system safe-area insets (notch, home bar, etc.).
 *
 * Place inside `<IonContent>`
 *
 * Only use this when your page has **IonContent alone** (no IonHeader / IonFooter),
 * to keep content inside the visible safe area.
 * Not needed if you're already using Ionic headers or footers — they handle that for you.
 */
export default function SafeAreaView({
  className,
  withFixedHeader,
  children,
  ...props
}: SafeAreaViewProps) {
  return (
    <div
      className={cn(
        "min-h-full",
        "pb-[var(--ion-safe-area-bottom)]",
        withFixedHeader
          ? "pt-[var(--app-fixed-header-height)]"
          : "pt-[var(--ion-safe-area-top)]",
        "pr-[var(--ion-safe-area-right)]  pl-[var(--ion-safe-area-left)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
