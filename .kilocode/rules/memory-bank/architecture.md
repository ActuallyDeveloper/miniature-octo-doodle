# System Patterns: Exotic - Telegram Clone

## Architecture Overview

```
src/
├── app/
│   ├── layout.tsx          # Root layout + metadata
│   ├── page.tsx            # Main chat page (client component)
│   ├── globals.css         # Tailwind + custom Telegram theme
│   ├── auth/
│   │   ├── login/page.tsx  # Login page
│   │   └── register/page.tsx # Register page
│   └── api/
│       ├── auth/           # Auth endpoints (login, register, me, logout)
│       ├── chats/          # Chat CRUD
│       ├── messages/       # Message CRUD
│       ├── reactions/      # Emoji reactions
│       ├── search/         # Global search
│       ├── users/          # User management
│       ├── contacts/       # Contact list
│       └── notifications/  # Notifications
├── components/
│   ├── ui/                 # Reusable UI primitives
│   ├── chat/               # ChatSidebar, ChatWindow
│   └── modals/             # All modal dialogs
├── db/                     # Database layer
├── lib/                    # Utilities and auth
└── store/                  # Zustand state
```

## Key Design Patterns

### 1. App Router with API Routes

All server-side logic lives in API routes. The main page is a client component that communicates with API routes via fetch.

### 2. Client-Side State (Zustand)

The `useChatStore` manages all client state: current user, chats, active chat, messages, modals, search, typing indicators. Components subscribe to relevant slices.

### 3. Optimistic Updates

Messages are added to the store immediately (optimistic) before the API response. The fetch then confirms or corrects the data.

### 4. Polling for Real-Time

Messages and chats are polled at 3-second intervals. This provides near-real-time updates without WebSocket complexity.

### 5. Component Organization

```
components/
├── ui/           # Atomic, reusable (Avatar, Button, Input, Modal)
├── chat/         # Feature-specific (ChatSidebar, ChatWindow)
└── modals/       # Modal dialogs (NewChat, Profile, Settings, etc.)
```

### 6. Dual SQLite Drivers

- `bun:sqlite` for CLI scripts (migrate, seed) - runs with `bun run`
- `better-sqlite3` for app code - compatible with Node.js (Next.js build)

### 7. Dark Theme Design

Custom Tailwind theme with Telegram-inspired colors:
- Background: #0e1621 (primary), #17212b (secondary), #232e3c (tertiary)
- Accent: #2b5278 (blue), #4eae53 (green)
- Text: #f5f5f5 (primary), #aaaaaa (secondary), #6c7883 (muted)

## State Management

### Zustand Store Structure

```typescript
{
  currentUser: User | null
  chats: Chat[]
  activeChat: Chat | null
  messages: Message[]
  searchQuery: string
  sidebarOpen: boolean
  typingUsers: Record<string, string[]>
  showProfile: boolean
  showSettings: boolean
  showNewChat: boolean
  showNewGroup: boolean
  showNewChannel: boolean
  showSearch: boolean
}
```

### Data Flow

1. User action → Store update (optimistic)
2. API call → Server processes
3. Response → Store update (confirm)
4. Polling → Background store sync

## File Naming Conventions

- Components: PascalCase (`ChatSidebar.tsx`, `Avatar.tsx`)
- Utilities: camelCase (`utils.ts`, `auth.ts`)
- Pages/Routes: lowercase (`page.tsx`, `layout.tsx`, `route.ts`)
- Directories: kebab-case (`api/`, `auth/`)
