import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, messages, chatMembers } from "@/db/schema";
import { eq, like, and, inArray, or } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    if (!query) return NextResponse.json({ users: [], messages: [], chats: [] });

    const foundUsers = await db
      .select({ id: users.id, username: users.username, displayName: users.displayName, avatar: users.avatar, status: users.status })
      .from(users)
      .where(or(like(users.username, `%${query}%`), like(users.displayName, `%${query}%`)))
      .limit(10);

    const userMemberships = await db.select({ chatId: chatMembers.chatId }).from(chatMembers).where(eq(chatMembers.userId, user.id));
    const chatIds = userMemberships.map((m) => m.chatId);

    const foundMessages = chatIds.length > 0
      ? await db
          .select({ id: messages.id, chatId: messages.chatId, content: messages.content, senderId: messages.senderId, createdAt: messages.createdAt })
          .from(messages)
          .where(and(inArray(messages.chatId, chatIds), like(messages.content, `%${query}%`)))
          .limit(20)
      : [];

    return NextResponse.json({ users: foundUsers, messages: foundMessages });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
