"use client";

export const dynamic = 'force-dynamic';

import { useSearchParams } from "next/navigation";
import LoginForm from "@/components/LoginForm";

export default function Home() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  return (
    <div>
      {errorParam && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
          {decodeURIComponent(errorParam)}
        </div>
      )}
      <LoginForm />
    </div>
  );
}
