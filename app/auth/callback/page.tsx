"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Processing OAuth callback...");

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Check for errors in query params
      const error_description = searchParams.get("error_description");
      const error_code = searchParams.get("error_code");
      const code = searchParams.get("code");

      // Check for hash fragments (Supabase might use these)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const hashError = hashParams.get("error_description");
      const hashCode = hashParams.get("code");
      const accessToken = hashParams.get("access_token");

      console.log("🔍 OAuth Callback Debug Info:");
      console.log("  - Full URL:", window.location.href);
      console.log("  - Query params:", { code, error_code, error_description });
      console.log("  - Hash params:", { hashCode, hashError, accessToken });
      console.log("  - Origin:", window.location.origin);
      console.log("  - Expected redirect:", `${window.location.origin}/auth/callback`);

      // Handle OAuth errors
      if (error_description || error_code || hashError) {
        const errorMsg = error_description || hashError || "OAuth error";
        console.error("OAuth error:", error_code, errorMsg);
        setStatus(`Error: ${errorMsg}`);
        router.replace(`/?error=${encodeURIComponent(errorMsg)}`);
        return;
      }

      // Try to exchange code if we have one
      const codeToUse = code || hashCode;
      if (codeToUse) {
        try {
          setStatus("Exchanging authorization code for session...");
          console.log("Exchanging code for session...");
          
          const { data, error } = await supabase.auth.exchangeCodeForSession(codeToUse);

          if (error) {
            console.error("Error exchanging code for session:", error);
            setStatus(`Error: ${error.message}`);
            router.replace(`/?error=${encodeURIComponent(error.message)}`);
            return;
          }

          if (!data.session) {
            console.error("No session created after code exchange");
            setStatus("Error: No session created");
            router.replace("/?error=no_session_created");
            return;
          }

          console.log("✅ OAuth callback successful, session created");
          setStatus("Login successful! Redirecting...");
          
          // Wait for session to be fully established
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          router.replace("/dashboard");
          return;
        } catch (error: any) {
          console.error("Unexpected error during callback:", error);
          setStatus(`Error: ${error.message}`);
          router.replace(`/?error=${encodeURIComponent(error.message || "Unexpected error")}`);
          return;
        }
      }

      // If we have an access token in the hash, Supabase might have already handled it
      if (accessToken) {
        console.log("Access token found in hash, checking session...");
        setStatus("Verifying session...");
        
        // Wait a bit for Supabase to process the hash
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          setStatus(`Error: ${error.message}`);
          router.replace(`/?error=${encodeURIComponent(error.message)}`);
          return;
        }

        if (session) {
          console.log("✅ Session found, redirecting to dashboard");
          setStatus("Login successful! Redirecting...");
          router.replace("/dashboard");
          return;
        }
      }

      // If we get here, we don't have a code or token
      console.error("No authorization code or access token received");
      console.log("Full URL:", window.location.href);
      setStatus("Error: No authorization code received");
      router.replace("/?error=no_code_received");
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <LoadingSkeleton />
      <p className="mt-4 text-sm text-gray-600">{status}</p>
    </div>
  );
}

