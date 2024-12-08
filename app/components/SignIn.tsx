




// app/components/SignIn.tsx

"use client";

import { Button } from "@mui/material";

interface SignInButtonProps {
  disabled?: boolean;
}

export default function SignInButton({ disabled }: SignInButtonProps): JSX.Element {
  const handleSignIn = () => {
    const state = crypto.randomUUID();
    localStorage.setItem("oauth_state", state);

    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI!,
      scope: "read:user user:email",
      state,
    });

    window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`;
  };

  return (
    <Button
      color="inherit"
      onClick={handleSignIn}
      disabled={disabled} // Disable when logged in
    >
      Sign In
    </Button>
  );
}



