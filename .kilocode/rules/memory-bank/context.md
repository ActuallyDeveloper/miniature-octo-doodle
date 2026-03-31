# Active Context: Exotic - Telegram Clone

## Current State

**Project Status**: Production-ready messaging platform

Exotic is a complete Telegram clone with authentication, real-time messaging, channels, groups, voice/video call UI, message reactions, search, user profiles, settings, and E2E encryption indicators. All builds pass, database is seeded with demo data.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration with custom Telegram theme
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features
- [x] Complete database schema (9 tables)
- [x] Database client with WAL mode and foreign keys
- [x] Migration runner with performance indexes
- [x] Auth system (login, register, logout, session management)
- [x] API routes for all features (13 endpoints)
- [x] Chat sidebar with search, filters, and chat list
- [x] Chat window with message bubbles, reactions, reply, edit, delete
- [x] End-to-end encryption indicators
- [x] Voice and video call UI
- [x] User profiles with editable bio/display name
- [x] Settings panel with notifications toggle
- [x] Global search across users and messages
- [x] New chat, new group, new channel modals
- [x] Context menus on messages
- [x] Typing indicators
- [x] Online/away/offline status indicators
- [x] Responsive design (mobile + desktop)
- [x] Zustand state management
- [x] Demo data seeder (5 users, 4 chats, 11 messages)
- [x] Production build passing

## Database Tables

| Table | Purpose |
|-------|---------|
| `users` | User accounts with profiles, status |
| `chats` | Direct/group/channel conversations |
| `chat_members` | Chat membership with roles (owner/admin/member) |
| `messages` | Messages with replies, forwards, pins, edits |
| `message_reactions` | Emoji reactions |
| `attachments` | File/media attachments |
| `sessions` | Auth session tokens |
| `contacts` | User contact lists |
| `notifications` | User notifications |

## API Endpoints

| Method | Route | Purpose |
|--------|-------|---------|
| POST | /api/auth/login | User login |
| POST | /api/auth/register | User registration |
| GET | /api/auth/me | Get current user |
| POST | /api/auth/logout | User logout |
| GET/POST | /api/chats | List/create chats |
| GET/DELETE | /api/chats/[id] | Get/delete chat |
| GET/POST | /api/messages | List/send messages |
| PATCH/DELETE | /api/messages/[id] | Edit/delete message |
| POST | /api/reactions | Toggle reaction |
| GET | /api/search | Global search |
| GET/PATCH | /api/users | List/update users |
| GET/POST | /api/contacts | List/add contacts |
| GET/POST | /api/notifications | List/create notifications |

## Demo Accounts

| Email | Password |
|-------|----------|
| john@exotic.com | password123 |
| jane@exotic.com | password123 |
| alex@exotic.com | password123 |
| sarah@exotic.com | password123 |
| mike@exotic.com | password123 |

## Commands

```bash
bun install        # Install dependencies
bun dev            # Start dev server
bun run build      # Production build
bun start          # Start production server
bun lint           # Run ESLint
bun typecheck      # Run TypeScript type checking
bun run db:migrate # Run database migrations
bun run db:seed    # Seed demo data
```

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-03-31 | Complete Exotic Telegram clone built - database, auth, API, full UI |
