




// app/profile/page.tsx

"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Typography, Avatar } from "@mui/material";

interface User {
  name: string;
  email?: string;
  avatar_url?: string;
  login: string;
}

export default function Profile(): JSX.Element {
  const searchParams = useSearchParams();
  const githubId = searchParams.get("githubId");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (githubId) {
      fetch(`/api/get-user?githubId=${githubId}`)
        .then((res) => res.json())
        .then((data) => setUser(data))
        .catch(() => setUser(null));
    }
  }, [githubId]);

  if (!user) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <Box textAlign="center" mt={4}>
      <Typography variant="h4">Welcome, {user.name}!</Typography>
      <Avatar
        src={user.avatar_url}
        alt="Profile Picture"
        sx={{ width: 120, height: 120, margin: "20px auto" }}
      />
      <Typography variant="body1">Username: {user.login}</Typography>
      <Typography variant="body1">Email: {user.email || "Not available"}</Typography>
    </Box>
  );
}
