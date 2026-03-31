import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, contacts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { generateId } from "@/lib/utils";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const contactList = await db
      .select({ id: users.id, username: users.username, displayName: users.displayName, avatar: users.avatar, status: users.status, bio: users.bio })
      .from(contacts)
      .innerJoin(users, eq(contacts.contactId, users.id))
      .where(eq(contacts.userId, user.id));

    return NextResponse.json({ contacts: contactList });
  } catch (error) {
    console.error("Get contacts error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { contactId } = await request.json();
    if (!contactId) return NextResponse.json({ error: "contactId required" }, { status: 400 });

    await db.insert(contacts).values({ id: generateId(), userId: user.id, contactId });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Add contact error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
