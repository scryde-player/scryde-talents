"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
  }
}

export default function YMHit() {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    const url = pathname + (search?.toString() ? `?${search}` : "");
    if (typeof window !== "undefined" && typeof window.ym === "function") {
      window.ym(Number(process.env.NEXT_PUBLIC_YM_ID), "hit", url);
    }
  }, [pathname, search]);

  return null;
}
