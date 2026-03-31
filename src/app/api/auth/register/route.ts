import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, createSession } from "@/lib/auth";
import { generateId } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const { username, displayName, email, password } = await request.json();

    if (!username || !displayName || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const existingEmail = await db.select().from(users).where(eq(users.email, email)).get();
    if (existingEmail) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const existingUsername = await db.select().from(users).where(eq(users.username, username)).get();
    if (existingUsername) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }

    const id = generateId();
    const passwordHash = await hashPassword(password);

    await db.insert(users).values({
      id,
      username,
      displayName,
      email,
      passwordHash,
      status: "online",
    });

    const sessionId = await createSession(id);

    const response = NextResponse.json({
      user: { id, username, displayName, email, avatar: null, bio: "", status: "online" },
    });

    response.cookies.set("session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
