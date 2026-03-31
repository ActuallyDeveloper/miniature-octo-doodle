import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { messageReactions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { generateId } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { messageId, emoji } = await request.json();
    if (!messageId || !emoji) return NextResponse.json({ error: "messageId and emoji required" }, { status: 400 });

    const existing = await db
      .select()
      .from(messageReactions)
      .where(and(eq(messageReactions.messageId, messageId), eq(messageReactions.userId, user.id), eq(messageReactions.emoji, emoji)))
      .get();

    if (existing) {
      await db.delete(messageReactions).where(eq(messageReactions.id, existing.id));
      return NextResponse.json({ removed: true });
    }

    await db.insert(messageReactions).values({ id: generateId(), messageId, userId: user.id, emoji });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reaction error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
