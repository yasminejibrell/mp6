




// app/api/store-user/route.ts

import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const client = new MongoClient(process.env.MONGO_URI!);

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Authorization code missing" }, { status: 400 });
    }

    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
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

    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/vnd.github+json",
      },
    });

    const userData = await userResponse.json();

    await client.connect();
    const db = client.db("oauth-app");
    const usersCollection = db.collection("users");

    const userRecord = {
      githubId: userData.id,
      name: userData.name,
      login: userData.login,
      avatar_url: userData.avatar_url,
      email: userData.email,
      access_token: tokenData.access_token,
    };

    await usersCollection.updateOne(
      { githubId: userData.id },
      { $set: userRecord },
      { upsert: true }
    );

    return NextResponse.json({ message: "User saved successfully", githubId: userData.id });
  } catch (error) {
    console.error("Error in /api/store-user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
