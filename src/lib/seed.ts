import { Database } from "bun:sqlite";
import { hash } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const dbPath = path.join(process.cwd(), "exotic.db");
const sqlite = new Database(dbPath);

async function seed() {
  const existing = sqlite.query("SELECT id FROM users LIMIT 1").get();
  if (existing) {
    console.log("Database already seeded");
    return;
  }

  const passwordHash = await hash("password123", 10);

  const userIds = [uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4()];
  const now = Date.now();

  const insertUser = sqlite.prepare(
    "INSERT INTO users (id, username, display_name, email, password_hash, status, bio, created_at, last_seen) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );

  insertUser.run(userIds[0], "john_doe", "John Doe", "john@exotic.com", passwordHash, "online", "Building Exotic - the future of messaging", now, now);
  insertUser.run(userIds[1], "jane_smith", "Jane Smith", "jane@exotic.com", passwordHash, "online", "Designer & Creative Director", now, now);
  insertUser.run(userIds[2], "alex_wilson", "Alex Wilson", "alex@exotic.com", passwordHash, "away", "Full-stack developer", now, now);
  insertUser.run(userIds[3], "sarah_jones", "Sarah Jones", "sarah@exotic.com", passwordHash, "offline", "Product Manager at Exotic", now, now);
  insertUser.run(userIds[4], "mike_brown", "Mike Brown", "mike@exotic.com", passwordHash, "online", "DevOps engineer", now, now);

  const chatId1 = uuidv4();
  const chatId2 = uuidv4();
  const groupId = uuidv4();
  const channelId = uuidv4();

  const insertChat = sqlite.prepare(
    "INSERT INTO chats (id, type, name, description, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );

  insertChat.run(chatId1, "direct", null, "", userIds[0], now, now);
  insertChat.run(chatId2, "direct", null, "", userIds[0], now, now);
  insertChat.run(groupId, "group", "Exotic Team", "Main team chat for Exotic development", userIds[0], now, now);
  insertChat.run(channelId, "channel", "Exotic Announcements", "Official Exotic announcements channel", userIds[0], now, now);

  const insertMember = sqlite.prepare(
    "INSERT INTO chat_members (id, chat_id, user_id, role, joined_at) VALUES (?, ?, ?, ?, ?)"
  );

  insertMember.run(uuidv4(), chatId1, userIds[0], "member", now);
  insertMember.run(uuidv4(), chatId1, userIds[1], "member", now);
  insertMember.run(uuidv4(), chatId2, userIds[0], "member", now);
  insertMember.run(uuidv4(), chatId2, userIds[2], "member", now);
  insertMember.run(uuidv4(), groupId, userIds[0], "owner", now);
  insertMember.run(uuidv4(), groupId, userIds[1], "admin", now);
  insertMember.run(uuidv4(), groupId, userIds[2], "member", now);
  insertMember.run(uuidv4(), groupId, userIds[3], "member", now);
  insertMember.run(uuidv4(), groupId, userIds[4], "member", now);
  insertMember.run(uuidv4(), channelId, userIds[0], "owner", now);
  insertMember.run(uuidv4(), channelId, userIds[1], "member", now);
  insertMember.run(uuidv4(), channelId, userIds[2], "member", now);
  insertMember.run(uuidv4(), channelId, userIds[3], "member", now);
  insertMember.run(uuidv4(), channelId, userIds[4], "member", now);

  const insertMsg = sqlite.prepare(
    "INSERT INTO messages (id, chat_id, sender_id, content, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );

  insertMsg.run(uuidv4(), chatId1, userIds[1], "Hey! Have you seen the new Exotic features?", "text", now - 3600000, now - 3600000);
  insertMsg.run(uuidv4(), chatId1, userIds[0], "Yes! The real-time messaging is incredible. 200x faster than anything else!", "text", now - 3500000, now - 3500000);
  insertMsg.run(uuidv4(), chatId1, userIds[1], "I love the E2E encryption too. So secure!", "text", now - 3400000, now - 3400000);
  insertMsg.run(uuidv4(), chatId1, userIds[0], "Wait until you see the voice and video call features. Production ready from day one.", "text", now - 3300000, now - 3300000);
  insertMsg.run(uuidv4(), chatId2, userIds[0], "Alex, are you joining the standup?", "text", now - 7200000, now - 7200000);
  insertMsg.run(uuidv4(), chatId2, userIds[2], "On my way! Just finishing up the WebSocket implementation.", "text", now - 7100000, now - 7100000);
  insertMsg.run(uuidv4(), groupId, userIds[0], "Welcome to the Exotic team chat!", "text", now - 86400000, now - 86400000);
  insertMsg.run(uuidv4(), groupId, userIds[1], "Excited to be here! The UI design is coming along great.", "text", now - 85000000, now - 85000000);
  insertMsg.run(uuidv4(), groupId, userIds[3], "Product roadmap is ready for review. Check the pinned message.", "text", now - 80000000, now - 80000000);
  insertMsg.run(uuidv4(), channelId, userIds[0], "Exotic v1.0 is now live! The fastest, most secure messaging platform ever built. 200x faster, 200x more powerful, 200x smarter.", "text", now - 172800000, now - 172800000);
  insertMsg.run(uuidv4(), channelId, userIds[0], "New feature: End-to-end encryption is now enabled for all chats by default.", "text", now - 86400000, now - 86400000);

  console.log("Database seeded successfully!");
  console.log("Demo accounts:");
  console.log("  john@exotic.com / password123");
  console.log("  jane@exotic.com / password123");
  console.log("  alex@exotic.com / password123");
  console.log("  sarah@exotic.com / password123");
  console.log("  mike@exotic.com / password123");
}

seed().catch(console.error);
