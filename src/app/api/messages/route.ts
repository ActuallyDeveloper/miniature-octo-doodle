import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { messages, chatMembers, users, messageReactions, attachments, chats } from "@/db/schema";
import { eq, and, desc, lt } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { generateId } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");
    const before = searchParams.get("before");
    const limit = parseInt(searchParams.get("limit") || "50");

    if (!chatId) return NextResponse.json({ error: "chatId is required" }, { status: 400 });

    const membership = await db
      .select()
      .from(chatMembers)
      .where(and(eq(chatMembers.chatId, chatId), eq(chatMembers.userId, user.id)))
      .get();

    if (!membership) return NextResponse.json({ error: "Not a member of this chat" }, { status: 403 });

    let query = db
      .select({
        id: messages.id, chatId: messages.chatId, senderId: messages.senderId, content: messages.content,
        type: messages.type, replyToId: messages.replyToId, forwardedFrom: messages.forwardedFrom,
        isPinned: messages.isPinned, isEdited: messages.isEdited, createdAt: messages.createdAt, updatedAt: messages.updatedAt,
        senderName: users.displayName, senderUsername: users.username, senderAvatar: users.avatar,
      })
      .from(messages)
      .leftJoin(users, eq(messages.senderId, users.id))
      .where(eq(messages.chatId, chatId))
      .orderBy(desc(messages.createdAt))
      .limit(limit);

    if (before) {
      query = db
        .select({
          id: messages.id, chatId: messages.chatId, senderId: messages.senderId, content: messages.content,
          type: messages.type, replyToId: messages.replyToId, forwardedFrom: messages.forwardedFrom,
          isPinned: messages.isPinned, isEdited: messages.isEdited, createdAt: messages.createdAt, updatedAt: messages.updatedAt,
          senderName: users.displayName, senderUsername: users.username, senderAvatar: users.avatar,
        })
        .from(messages)
        .leftJoin(users, eq(messages.senderId, users.id))
        .where(and(eq(messages.chatId, chatId), lt(messages.createdAt, Number(before))))
        .orderBy(desc(messages.createdAt))
        .limit(limit);
    }

    const messageList = await query;
    const sorted = messageList.reverse();

    const messageIds = sorted.map((m) => m.id);
    const reactions = messageIds.length > 0
      ? await db.select().from(messageReactions).where(
          messageIds.length === 1
            ? eq(messageReactions.messageId, messageIds[0])
            : eq(messageReactions.messageId, messageIds[0])
        )
      : [];

    const atts = messageIds.length > 0
      ? await db.select().from(attachments).where(
          messageIds.length === 1
            ? eq(attachments.messageId, messageIds[0])
            : eq(attachments.messageId, messageIds[0])
        )
      : [];

    const result = sorted.map((msg) => ({
      ...msg,
      isPinned: Boolean(msg.isPinned),
      isEdited: Boolean(msg.isEdited),
      sender: msg.senderName ? { id: msg.senderId, displayName: msg.senderName, username: msg.senderUsername, avatar: msg.senderAvatar } : null,
      reactions: reactions.filter((r) => r.messageId === msg.id).map((r) => ({ emoji: r.emoji, userId: r.userId })),
      attachments: atts.filter((a) => a.messageId === msg.id).map((a) => ({ id: a.id, url: a.url, type: a.type, name: a.name, size: a.size })),
    }));

    return NextResponse.json({ messages: result });
  } catch (error) {
    console.error("Get messages error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { chatId, content, type, replyToId } = await request.json();

    if (!chatId || !content) {
      return NextResponse.json({ error: "chatId and content are required" }, { status: 400 });
    }

    const membership = await db
      .select()
      .from(chatMembers)
      .where(and(eq(chatMembers.chatId, chatId), eq(chatMembers.userId, user.id)))
      .get();

    if (!membership) return NextResponse.json({ error: "Not a member of this chat" }, { status: 403 });

    const messageId = generateId();
    await db.insert(messages).values({
      id: messageId,
      chatId,
      senderId: user.id,
      content,
      type: type || "text",
      replyToId: replyToId || null,
    });

    await db.update(chats).set({ updatedAt: Date.now() }).where(eq(chats.id, chatId));

    const message = {
      id: messageId,
      chatId,
      senderId: user.id,
      content,
      type: type || "text",
      replyToId: replyToId || null,
      forwardedFrom: null,
      isPinned: false,
      isEdited: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      sender: { id: user.id, displayName: user.displayName, username: user.username, avatar: user.avatar },
      reactions: [],
      attachments: [],
    };

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
