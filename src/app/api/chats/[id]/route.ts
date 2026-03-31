import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { chats, chatMembers, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const chat = await db.select().from(chats).where(eq(chats.id, id)).get();
    if (!chat) return NextResponse.json({ error: "Chat not found" }, { status: 404 });

    const members = await db
      .select({ id: users.id, username: users.username, displayName: users.displayName, avatar: users.avatar, status: users.status, bio: users.bio, role: chatMembers.role, nickname: chatMembers.nickname, muted: chatMembers.muted })
      .from(chatMembers)
      .innerJoin(users, eq(chatMembers.userId, users.id))
      .where(eq(chatMembers.chatId, id));

    return NextResponse.json({
      ...chat,
      members: members.map((m) => ({ ...m, muted: Boolean(m.muted) })),
    });
  } catch (error) {
    console.error("Get chat error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const chat = await db.select().from(chats).where(eq(chats.id, id)).get();
    if (!chat) return NextResponse.json({ error: "Chat not found" }, { status: 404 });

    if (chat.createdBy !== user.id) {
      const membership = await db.select().from(chatMembers).where(and(eq(chatMembers.chatId, id), eq(chatMembers.userId, user.id))).get();
      if (!membership || membership.role !== "owner") {
        return NextResponse.json({ error: "Not authorized" }, { status: 403 });
      }
    }

    await db.delete(chatMembers).where(eq(chatMembers.chatId, id)).run();
    await db.delete(chats).where(eq(chats.id, id)).run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete chat error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
