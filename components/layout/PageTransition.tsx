"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageTransition() {
  const pathname = usePathname();
  const [active, setActive] = useState(true);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Route change: adjust state during render instead of inside an effect.
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setActive(true);
  }

  useEffect(() => {
    if (!active) return;
    const timer = window.setTimeout(() => setActive(false), 520);
    return () => window.clearTimeout(timer);
  }, [active]);

  return (
    <div
      className={`page-transition ${active ? "is-active" : ""}`}
      aria-hidden="true"
    />
  );
}
