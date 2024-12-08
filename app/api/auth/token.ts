




// app/api/auth/token.ts

import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const client = new MongoClient(process.env.MONGO_URI!);

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Authorization code missing" }, { status: 400 });
    }

    // Exchange the code for an access token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: JSON.stringify({
        client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return NextResponse.json({ error: "Failed to fetch access token" }, { status: 400 });
    }

    // Fetch user profile
    const userResponse = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const user = await userResponse.json();

    // Save the user to MongoDB
    await client.connect();
    const db = client.db("oauth-app");
    const usersCollection = db.collection("users");

    await usersCollection.updateOne(
      { githubId: user.id },
      {
        $set: {
          githubId: user.id,
          name: user.name,
          login: user.login,
          avatar_url: user.avatar_url,
          email: user.email,
          access_token: tokenData.access_token,
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ message: "User saved successfully", githubId: user.id });
  } catch (error) {
    console.error("Error in POST /api/auth/token:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
