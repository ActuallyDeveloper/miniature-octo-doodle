import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { chats, chatMembers, users, messages } from "@/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { generateId } from "@/lib/utils";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const memberships = await db.select().from(chatMembers).where(eq(chatMembers.userId, user.id));
    const chatIds = memberships.map((m) => m.chatId);

    if (chatIds.length === 0) return NextResponse.json({ chats: [] });

    const chatList = await db.select().from(chats).where(inArray(chats.id, chatIds)).orderBy(desc(chats.updatedAt));

    const result = await Promise.all(
      chatList.map(async (chat) => {
        const members = await db
          .select({ id: users.id, username: users.username, displayName: users.displayName, avatar: users.avatar, status: users.status, bio: users.bio, role: chatMembers.role, nickname: chatMembers.nickname, muted: chatMembers.muted })
          .from(chatMembers)
          .innerJoin(users, eq(chatMembers.userId, users.id))
          .where(eq(chatMembers.chatId, chat.id));

        const lastMsg = await db
          .select({ id: messages.id, content: messages.content, type: messages.type, senderId: messages.senderId, createdAt: messages.createdAt })
          .from(messages)
          .where(eq(messages.chatId, chat.id))
          .orderBy(desc(messages.createdAt))
          .limit(1);

        return {
          ...chat,
          members: members.map((m) => ({ ...m, muted: Boolean(m.muted) })),
          lastMessage: lastMsg[0] || null,
          unreadCount: 0,
        };
      })
    );

    return NextResponse.json({ chats: result });
  } catch (error) {
    console.error("Get chats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { type, name, description, memberIds } = await request.json();
    const chatId = generateId();

    await db.insert(chats).values({
      id: chatId,
      type: type || "direct",
      name: name || null,
      description: description || "",
      createdBy: user.id,
    }).run();

    const allMembers = [user.id, ...(memberIds || [])];
    const uniqueMembers = [...new Set(allMembers)];

    await db.insert(chatMembers).values(
      uniqueMembers.map((memberId) => ({
        id: generateId(),
        chatId,
        userId: memberId as string,
        role: memberId === user.id ? "owner" : "member",
      }))
    ).run();

    return NextResponse.json({ chatId, success: true });
  } catch (error) {
    console.error("Create chat error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
