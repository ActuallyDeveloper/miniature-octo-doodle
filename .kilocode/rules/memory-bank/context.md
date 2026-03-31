# Active Context: Exotic - Telegram Clone

## Current State

**Project Status**: Database infrastructure complete, ready for UI/API development

The project is "Exotic", a Telegram clone built with Next.js 16. The database layer with Drizzle ORM + better-sqlite3 is now fully set up with schema, migrations, auth, seeding, and state management.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features
- [x] Database schema (users, chats, chat_members, messages, reactions, attachments, sessions, contacts, notifications)
- [x] Database client with WAL mode and foreign keys enabled
- [x] Migration runner with indexes
- [x] Auth utilities (bcrypt password hashing, session management)
- [x] General utilities (ID generation, date formatting, avatar colors)
- [x] Seed file with 5 demo users, 4 chats, and sample messages
- [x] Zustand chat store for client-side state
- [x] Drizzle Kit configuration

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/db/schema.ts` | Drizzle schema (9 tables) | ✅ Ready |
| `src/db/index.ts` | Database client | ✅ Ready |
| `src/db/migrate.ts` | SQL migration runner | ✅ Ready |
| `src/lib/db.ts` | Re-export convenience | ✅ Ready |
| `src/lib/auth.ts` | Auth/session utilities | ✅ Ready |
| `src/lib/utils.ts` | General utilities | ✅ Ready |
| `src/lib/seed.ts` | Demo data seeder | ✅ Ready |
| `src/store/chat.ts` | Zustand chat state | ✅ Ready |
| `drizzle.config.ts` | Drizzle Kit config | ✅ Ready |
| `src/app/page.tsx` | Home page | ✅ Ready |
| `src/app/layout.tsx` | Root layout | ✅ Ready |
| `src/app/globals.css` | Global styles | ✅ Ready |

## Database Tables

| Table | Purpose |
|-------|---------|
| `users` | User accounts with profiles |
| `chats` | Direct/group/channel conversations |
| `chat_members` | Chat membership with roles |
| `messages` | Chat messages with replies/forwards |
| `message_reactions` | Emoji reactions on messages |
| `attachments` | File/media attachments |
| `sessions` | Auth session tokens |
| `contacts` | User contact lists |
| `notifications` | User notifications |

## Demo Accounts

| Email | Password |
|-------|----------|
| john@exotic.com | password123 |
| jane@exotic.com | password123 |
| alex@exotic.com | password123 |
| sarah@exotic.com | password123 |
| mike@exotic.com | password123 |

## Current Focus

Database infrastructure is complete. Next steps for the Exotic app:

1. Build API routes for auth, chats, messages
2. Create UI components (sidebar, chat view, message bubbles)
3. Implement real-time messaging with WebSockets
4. Build login/register pages
5. Run seed script to populate demo data

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-03-31 | Added complete database infrastructure for Exotic Telegram clone |
