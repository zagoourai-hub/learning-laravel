"use client";

import { useEffect } from "react";
import { visit } from "@/lib/progress";

export function VisitTracker({ id }: { id: string }) {
  useEffect(() => visit(id), [id]);
  return null;
}
