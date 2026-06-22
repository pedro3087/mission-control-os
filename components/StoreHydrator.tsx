"use client";
import { useEffect } from "react";
import { useStore } from "@/lib/store";

// Triggers Zustand persist rehydration from localStorage after mount.
// Needed because we use skipHydration:true to avoid SSR/localStorage mismatch.
export function StoreHydrator() {
  useEffect(() => {
    useStore.persist.rehydrate();
  }, []);
  return null;
}
