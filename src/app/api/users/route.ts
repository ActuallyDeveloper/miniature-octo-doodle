import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, ne } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const allUsers = await db
      .select({ id: users.id, username: users.username, displayName: users.displayName, email: users.email, avatar: users.avatar, bio: users.bio, status: users.status, lastSeen: users.lastSeen })
      .from(users)
      .where(ne(users.id, user.id));

    return NextResponse.json({ users: allUsers });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { displayName, bio, avatar, status } = await request.json();
    const updates: Record<string, unknown> = {};
    if (displayName) updates.displayName = displayName;
    if (bio !== undefined) updates.bio = bio;
    if (avatar !== undefined) updates.avatar = avatar;
    if (status) updates.status = status;

    if (Object.keys(updates).length > 0) {
      await db.update(users).set(updates).where(eq(users.id, user.id)).run();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
