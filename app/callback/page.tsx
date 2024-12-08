"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Callback(): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    const validateAndExchangeToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const returnedState = params.get("state");
      const savedState = localStorage.getItem("oauth_state");

      if (!code || !returnedState || returnedState !== savedState) {
        console.error("Invalid state or missing code.");
        router.push("/"); // Redirect to home page
      }

      localStorage.removeItem("oauth_state");

      try {
        const response = await fetch("/api/store-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        if (response.ok) {
          const { githubId } = await response.json();
          router.push(`/profile?githubId=${githubId}`);
        } else {
          console.error("Failed to exchange token.");
          router.push("/");
        }
      } catch (error) {
        console.error("Error processing callback:", error);
        router.push("/");
      }
    };

    validateAndExchangeToken();
  }, [router]);

  return <p>Processing login...</p>;
}
