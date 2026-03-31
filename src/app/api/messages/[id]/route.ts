import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { content } = await request.json();

    const message = await db.select().from(messages).where(eq(messages.id, id)).get();
    if (!message) return NextResponse.json({ error: "Message not found" }, { status: 404 });
    if (message.senderId !== user.id) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    await db.update(messages).set({ content, isEdited: true, updatedAt: new Date() }).where(eq(messages.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Edit message error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const message = await db.select().from(messages).where(eq(messages.id, id)).get();
    if (!message) return NextResponse.json({ error: "Message not found" }, { status: 404 });
    if (message.senderId !== user.id) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    await db.delete(messages).where(eq(messages.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete message error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
