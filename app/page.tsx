"use client"; 

import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import SignInButton from "./components/SignIn";
import SignOutButton from "./components/SignOut";

interface User {
  name: string;
  email?: string;
  avatar_url?: string;
}

export default function Home(): JSX.Element {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const githubId = localStorage.getItem("githubId");

    if (githubId) {
      fetch(`/api/user?githubId=${githubId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Not authenticated");
          return res.json();
        })
        .then((data: User) => setUser(data))
        .catch(() => setUser(null));
    }
  }, []);

  const handleSignOut = (): void => {
    localStorage.removeItem("githubId");
    setUser(null);
  };

  return (
    <Box sx={{ textAlign: "center", mt: 4 }}>
      <Typography variant="h4">Welcome to My CS391 OAuth App!</Typography>
      {!user ? (
        <Box>
          <Typography variant="h6">Sign in below</Typography>
          <SignInButton />
        </Box>
      ) : (
        <Box>
          <Typography variant="h6">Welcome, {user.name}!</Typography>
          <SignOutButton handleSignOut={handleSignOut} />
        </Box>
      )}
    </Box>
  );
}
