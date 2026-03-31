# Technical Context: Exotic - Telegram Clone

## Technology Stack

| Technology      | Version  | Purpose                              |
| --------------- | -------- | ------------------------------------ |
| Next.js         | 16.x     | React framework with App Router      |
| React           | 19.x     | UI library                           |
| TypeScript      | 5.9.x    | Type-safe JavaScript                 |
| Tailwind CSS    | 4.x      | Utility-first CSS with custom theme  |
| Bun             | Latest   | Package manager & runtime            |
| Drizzle ORM     | 0.45.x   | Type-safe SQLite ORM                 |
| better-sqlite3  | 12.x     | SQLite driver (production builds)    |
| bun:sqlite      | Built-in | SQLite driver (scripts/migrations)   |
| Zustand         | 5.x      | Client-side state management         |
| bcryptjs        | 3.x      | Password hashing                     |
| uuid            | 13.x     | ID generation                        |
| lucide-react    | 1.7.x    | Icon library                         |

## Development Environment

### Prerequisites

- Bun installed (`curl -fsSL https://bun.sh/install | bash`)
- Node.js 20+ (for Next.js build compatibility)

### Commands

```bash
bun install          # Install dependencies
bun dev              # Start dev server (http://localhost:3000)
bun run build        # Production build
bun start            # Start production server
bun lint             # Run ESLint
bun typecheck        # Run TypeScript type checking
bun run db:migrate   # Run SQLite migrations (uses bun:sqlite)
bun run db:seed      # Seed demo data (uses bun:sqlite)
```

## Project Configuration

### Next.js Config (`next.config.ts`)

- App Router enabled
- Default settings

### TypeScript Config (`tsconfig.json`)

- Strict mode enabled
- Path alias: `@/*` → `src/*`
- Bun types included
- Target: ES2017

### Tailwind CSS 4 (`postcss.config.mjs`)

- Uses `@tailwindcss/postcss` plugin
- CSS-first configuration with custom theme tokens
- Dark theme colors: #0e1621, #17212b, #232e3c, #2b5278

### ESLint (`eslint.config.mjs`)

- Uses `eslint-config-next`
- Flat config format

## File Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Home (chat app)
│   ├── globals.css                   # Tailwind + custom theme
│   ├── auth/
│   │   ├── login/page.tsx            # Login page
│   │   └── register/page.tsx         # Register page
│   └── api/
│       ├── auth/                     # Auth endpoints
│       ├── chats/                    # Chat CRUD
│       ├── messages/                 # Message CRUD
│       ├── reactions/                # Emoji reactions
│       ├── search/                   # Global search
│       ├── users/                    # User management
│       ├── contacts/                 # Contact list
│       └── notifications/            # Notifications
├── components/
│   ├── ui/                           # Reusable UI (Avatar, Button, Input, Modal, etc.)
│   ├── chat/                         # ChatSidebar, ChatWindow
│   └── modals/                       # NewChat, NewGroup, NewChannel, Profile, Settings, Search
├── db/
│   ├── schema.ts                     # Drizzle schema (9 tables)
│   ├── index.ts                      # Database client (better-sqlite3)
│   └── migrate.ts                    # SQL migrations (bun:sqlite)
├── lib/
│   ├── auth.ts                       # Auth utilities
│   ├── utils.ts                      # General utilities
│   ├── db.ts                         # Re-export convenience
│   └── seed.ts                       # Demo data seeder
└── store/
    └── chat.ts                       # Zustand state store
```

## Technical Constraints

### Database

- SQLite file-based database (exotic.db)
- Migrations run with bun:sqlite (scripts)
- App code uses better-sqlite3 (Node.js compatible for Next.js build)
- WAL mode for concurrent reads
- Foreign keys enabled

### Real-time

- Polling-based updates (3-second interval)
- Optimistic UI updates for sent messages
- No WebSocket (keeping it simple and production-stable)

### Authentication

- Cookie-based sessions (7-day expiry)
- bcrypt password hashing (10 rounds)
- Server-side session validation

### Browser Support

- Modern browsers (ES2020+)
- No IE11 support
