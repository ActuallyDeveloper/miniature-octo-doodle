import { cookies } from "next/headers";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string): Promise<string> {
  const sessionId = uuidv4();
  const expiresAt = new Date(Date.now() + SESSION_DURATION);
  await db.insert(sessions).values({ id: sessionId, userId, expiresAt });
  return sessionId;
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;
  if (!sessionId) return null;

  const session = await db.select().from(sessions).where(eq(sessions.id, sessionId)).get();
  if (!session) return null;
  if (new Date(session.expiresAt) < new Date()) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
    return null;
  }
  return session;
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  const user = await db.select().from(users).where(eq(users.id, session.userId)).get();
  if (!user) return null;

  const { passwordHash, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function destroySession(sessionId: string) {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}
