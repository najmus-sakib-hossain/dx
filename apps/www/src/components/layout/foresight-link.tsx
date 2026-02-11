"use client";

import Link from "next/link";

// Default hitSlop extends the detection area around links
// This triggers prefetch earlier when cursor is heading toward a link
const DEFAULT_HIT_SLOP = { top: 50, right: 50, bottom: 50, left: 50 };

/**
 * A Next.js Link component that uses ForesightJS for predictive prefetching.
 * Instead of prefetching when the link enters the viewport, this only prefetches
 * when the user's cursor trajectory indicates they're heading toward the link.
 *
 * This significantly reduces unnecessary data transfer for navigation menus.
 *
 * @see https://foresightjs.com/docs/react/nextjs/
 */
export function ForesightLink({
  children,
  className,
  ...linkProps
}: any) {
  return (
    <Link
      {...linkProps}
      className={className}
    >
      {children}
    </Link>
  );
}
