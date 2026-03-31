import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { generateId } from "@/lib/utils";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const notifs = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, user.id))
      .orderBy(desc(notifications.createdAt))
      .limit(50);

    return NextResponse.json({ notifications: notifs });
  } catch (error) {
    console.error("Get notifications error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { type, title, body, data } = await request.json();
    await db.insert(notifications).values({ id: generateId(), userId: user.id, type, title, body, data: JSON.stringify(data || {}) }).run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Create notification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
