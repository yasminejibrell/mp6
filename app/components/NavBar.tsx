"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import SignInButton from "./SignIn";
import SignOutButton from "./SignOut";

interface User {
  name: string;
  githubId: string;
}

export default function NavBar(): JSX.Element {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const githubId = localStorage.getItem("githubId");

    if (githubId) {
      fetch(`/api/user?githubId=${githubId}`)
        .then((res) => res.json())
        .then((data) => setUser(data))
        .catch(() => setUser(null));
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("githubId");
    setUser(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#0366d6" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link href="/" style={{ textDecoration: "none", color: "white" }}>
            My OAuth App
          </Link>
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Link href="/profile" style={{ textDecoration: "none", color: "white" }}>
            <Button color="inherit">Profile</Button>
          </Link>
          <SignInButton disabled={!!user} />
          <SignOutButton handleSignOut={handleSignOut} disabled={!user} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
