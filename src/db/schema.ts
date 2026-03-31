import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  avatar: text("avatar"),
  bio: text("bio").default(""),
  phoneNumber: text("phone_number"),
  status: text("status").default("offline"),
  lastSeen: integer("last_seen", { mode: "timestamp" }).$defaultFn(() => new Date()),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const chats = sqliteTable("chats", {
  id: text("id").primaryKey(),
  type: text("type").notNull().default("direct"),
  name: text("name"),
  avatar: text("avatar"),
  description: text("description").default(""),
  createdBy: text("created_by").references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const chatMembers = sqliteTable("chat_members", {
  id: text("id").primaryKey(),
  chatId: text("chat_id").notNull().references(() => chats.id),
  userId: text("user_id").notNull().references(() => users.id),
  role: text("role").default("member"),
  nickname: text("nickname"),
  joinedAt: integer("joined_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  muted: integer("muted", { mode: "boolean" }).default(false),
});

export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  chatId: text("chat_id").notNull().references(() => chats.id),
  senderId: text("sender_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  type: text("type").default("text"),
  replyToId: text("reply_to_id"),
  forwardedFrom: text("forwarded_from"),
  isPinned: integer("is_pinned", { mode: "boolean" }).default(false),
  isEdited: integer("is_edited", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const messageReactions = sqliteTable("message_reactions", {
  id: text("id").primaryKey(),
  messageId: text("message_id").notNull().references(() => messages.id),
  userId: text("user_id").notNull().references(() => users.id),
  emoji: text("emoji").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const attachments = sqliteTable("attachments", {
  id: text("id").primaryKey(),
  messageId: text("message_id").notNull().references(() => messages.id),
  url: text("url").notNull(),
  type: text("type").notNull(),
  name: text("name").notNull(),
  size: integer("size").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const contacts = sqliteTable("contacts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  contactId: text("contact_id").notNull().references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  type: text("type").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  data: text("data"),
  isRead: integer("is_read", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
