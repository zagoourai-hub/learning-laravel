"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

// True when the user prefers reduced motion. Only flips after mount so the first client render
// matches the server HTML (reading the media query during render causes hydration mismatches).
export function useInstantMotion() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return Boolean(reduced) && mounted;
}
