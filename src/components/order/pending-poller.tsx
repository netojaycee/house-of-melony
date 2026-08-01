"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function PendingPoller({ status }: { status: string }) {
  const router = useRouter();

  useEffect(() => {
    if (status !== "pending") return;
    const interval = setInterval(() => router.refresh(), 2500);
    return () => clearInterval(interval);
  }, [status, router]);

  return null;
}
