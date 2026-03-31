import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "exotic.db");
const sqlite = new Database(dbPath);

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    avatar TEXT,
    bio TEXT DEFAULT '',
    phone_number TEXT,
    status TEXT DEFAULT 'offline',
    last_seen INTEGER,
    created_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS chats (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL DEFAULT 'direct',
    name TEXT,
    avatar TEXT,
    description TEXT DEFAULT '',
    created_by TEXT REFERENCES users(id),
    created_at INTEGER,
    updated_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS chat_members (
    id TEXT PRIMARY KEY,
    chat_id TEXT NOT NULL REFERENCES chats(id),
    user_id TEXT NOT NULL REFERENCES users(id),
    role TEXT DEFAULT 'member',
    nickname TEXT,
    joined_at INTEGER,
    muted INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    chat_id TEXT NOT NULL REFERENCES chats(id),
    sender_id TEXT NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    type TEXT DEFAULT 'text',
    reply_to_id TEXT,
    forwarded_from TEXT,
    is_pinned INTEGER DEFAULT 0,
    is_edited INTEGER DEFAULT 0,
    created_at INTEGER,
    updated_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS message_reactions (
    id TEXT PRIMARY KEY,
    message_id TEXT NOT NULL REFERENCES messages(id),
    user_id TEXT NOT NULL REFERENCES users(id),
    emoji TEXT NOT NULL,
    created_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS attachments (
    id TEXT PRIMARY KEY,
    message_id TEXT NOT NULL REFERENCES messages(id),
    url TEXT NOT NULL,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    size INTEGER DEFAULT 0,
    created_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    expires_at INTEGER NOT NULL,
    created_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    contact_id TEXT NOT NULL REFERENCES users(id),
    created_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    data TEXT,
    is_read INTEGER DEFAULT 0,
    created_at INTEGER
  );

  CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
  CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
  CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
  CREATE INDEX IF NOT EXISTS idx_chat_members_chat_id ON chat_members(chat_id);
  CREATE INDEX IF NOT EXISTS idx_chat_members_user_id ON chat_members(user_id);
  CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
  CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);
  CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
  CREATE INDEX IF NOT EXISTS idx_message_reactions_message_id ON message_reactions(message_id);
  CREATE INDEX IF NOT EXISTS idx_attachments_message_id ON attachments(message_id);
`);

console.log("Database migrations completed successfully");
