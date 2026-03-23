"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TradingLayout } from "@/components/layout/TradingLayout";

export default function Home() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) {
          router.push("/login");
        } else {
          setAuthorized(true);
        }
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  if (!authorized) {
    return (
      <div className="h-screen w-screen bg-bg-primary flex items-center justify-center">
        <div className="text-text-tertiary text-sm">Loading...</div>
      </div>
    );
  }

  return <TradingLayout />;
}
