import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const client = new MongoClient(process.env.MONGO_URI!);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const githubId = searchParams.get("githubId");

  if (!githubId) {
    return NextResponse.json({ error: "GitHub ID missing" }, { status: 400 });
  }

  try {
    await client.connect();
    const db = client.db("oauth-app");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ githubId: parseInt(githubId) });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error in /api/get-user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
