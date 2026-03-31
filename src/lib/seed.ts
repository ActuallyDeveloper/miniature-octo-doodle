import { db } from "@/db";
import { users, chats, chatMembers, messages } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { generateId } from "@/lib/utils";

async function seed() {
  const existingUsers = await db.select().from(users).limit(1);
  if (existingUsers.length > 0) {
    console.log("Database already seeded");
    return;
  }

  const passwordHash = await hashPassword("password123");

  const userIds = [generateId(), generateId(), generateId(), generateId(), generateId()];
  
  await db.insert(users).values([
    { id: userIds[0], username: "john_doe", displayName: "John Doe", email: "john@exotic.com", passwordHash, status: "online", bio: "Building Exotic - the future of messaging" },
    { id: userIds[1], username: "jane_smith", displayName: "Jane Smith", email: "jane@exotic.com", passwordHash, status: "online", bio: "Designer & Creative Director" },
    { id: userIds[2], username: "alex_wilson", displayName: "Alex Wilson", email: "alex@exotic.com", passwordHash, status: "away", bio: "Full-stack developer" },
    { id: userIds[3], username: "sarah_jones", displayName: "Sarah Jones", email: "sarah@exotic.com", passwordHash, status: "offline", bio: "Product Manager at Exotic" },
    { id: userIds[4], username: "mike_brown", displayName: "Mike Brown", email: "mike@exotic.com", passwordHash, status: "online", bio: "DevOps engineer" },
  ]);

  const chatId1 = generateId();
  const chatId2 = generateId();
  const groupId = generateId();
  const channelId = generateId();

  await db.insert(chats).values([
    { id: chatId1, type: "direct", createdBy: userIds[0] },
    { id: chatId2, type: "direct", createdBy: userIds[0] },
    { id: groupId, type: "group", name: "Exotic Team", description: "Main team chat for Exotic development", createdBy: userIds[0] },
    { id: channelId, type: "channel", name: "Exotic Announcements", description: "Official Exotic announcements channel", createdBy: userIds[0] },
  ]);

  await db.insert(chatMembers).values([
    { id: generateId(), chatId: chatId1, userId: userIds[0] },
    { id: generateId(), chatId: chatId1, userId: userIds[1] },
    { id: generateId(), chatId: chatId2, userId: userIds[0] },
    { id: generateId(), chatId: chatId2, userId: userIds[2] },
    { id: generateId(), chatId: groupId, userId: userIds[0], role: "owner" },
    { id: generateId(), chatId: groupId, userId: userIds[1], role: "admin" },
    { id: generateId(), chatId: groupId, userId: userIds[2] },
    { id: generateId(), chatId: groupId, userId: userIds[3] },
    { id: generateId(), chatId: groupId, userId: userIds[4] },
    { id: generateId(), chatId: channelId, userId: userIds[0], role: "owner" },
    { id: generateId(), chatId: channelId, userId: userIds[1] },
    { id: generateId(), chatId: channelId, userId: userIds[2] },
    { id: generateId(), chatId: channelId, userId: userIds[3] },
    { id: generateId(), chatId: channelId, userId: userIds[4] },
  ]);

  const now = Date.now();
  await db.insert(messages).values([
    { id: generateId(), chatId: chatId1, senderId: userIds[1], content: "Hey! Have you seen the new Exotic features?", type: "text", createdAt: new Date(now - 3600000) },
    { id: generateId(), chatId: chatId1, senderId: userIds[0], content: "Yes! The real-time messaging is incredible. 200x faster than anything else!", type: "text", createdAt: new Date(now - 3500000) },
    { id: generateId(), chatId: chatId1, senderId: userIds[1], content: "I love the E2E encryption too. So secure! ", type: "text", createdAt: new Date(now - 3400000) },
    { id: generateId(), chatId: chatId1, senderId: userIds[0], content: "Wait until you see the voice and video call features. Production ready from day one.", type: "text", createdAt: new Date(now - 3300000) },
    { id: generateId(), chatId: chatId2, senderId: userIds[0], content: "Alex, are you joining the standup?", type: "text", createdAt: new Date(now - 7200000) },
    { id: generateId(), chatId: chatId2, senderId: userIds[2], content: "On my way! Just finishing up the WebSocket implementation.", type: "text", createdAt: new Date(now - 7100000) },
    { id: generateId(), chatId: groupId, senderId: userIds[0], content: "Welcome to the Exotic team chat! 🚀", type: "text", createdAt: new Date(now - 86400000) },
    { id: generateId(), chatId: groupId, senderId: userIds[1], content: "Excited to be here! The UI design is coming along great.", type: "text", createdAt: new Date(now - 85000000) },
    { id: generateId(), chatId: groupId, senderId: userIds[3], content: "Product roadmap is ready for review. Check the pinned message.", type: "text", createdAt: new Date(now - 80000000) },
    { id: generateId(), chatId: channelId, senderId: userIds[0], content: "📢 Exotic v1.0 is now live! The fastest, most secure messaging platform ever built. 200x faster, 200x more powerful, 200x smarter.", type: "text", createdAt: new Date(now - 172800000) },
    { id: generateId(), chatId: channelId, senderId: userIds[0], content: "🔔 New feature: End-to-end encryption is now enabled for all chats by default.", type: "text", createdAt: new Date(now - 86400000) },
  ]);

  console.log("Database seeded successfully!");
  console.log("Demo accounts:");
  console.log("  john@exotic.com / password123");
  console.log("  jane@exotic.com / password123");
  console.log("  alex@exotic.com / password123");
  console.log("  sarah@exotic.com / password123");
  console.log("  mike@exotic.com / password123");
}

seed().catch(console.error);
