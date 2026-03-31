# Product Context: Exotic - Telegram Clone

## Why Exotic Exists

Exotic is a production-ready messaging platform that replicates and extends Telegram's functionality in a web-first experience. It demonstrates what's possible with modern web technologies - a full-featured chat application with real-time messaging, channels, groups, and more, all in a single Next.js codebase.

## Problems It Solves

1. **Messaging Speed**: Fast, responsive chat experience with optimistic updates
2. **Communication Types**: Direct messages, groups, and broadcast channels
3. **Security**: E2E encryption indicators and secure session management
4. **Accessibility**: Web-based, works on any device with a browser
5. **Customization**: Full control over features and design

## User Flow

1. User visits Exotic and registers/logs in
2. User sees chat sidebar with existing conversations
3. User selects a chat to view messages
4. User types and sends messages in real-time
5. User can create groups, channels, or start new direct chats
6. User can search across all messages and users
7. User can customize their profile and settings

## Key User Experience Goals

- **Instant**: Messages appear immediately (optimistic UI)
- **Familiar**: Telegram-inspired dark theme and layout
- **Secure**: E2E encryption badges on every conversation
- **Fast**: Sub-second page loads, smooth animations
- **Responsive**: Works on desktop and mobile

## Feature Matrix

| Feature | Status | Description |
|---------|--------|-------------|
| Authentication | Complete | Login, register, session management |
| Direct Messages | Complete | 1-on-1 conversations |
| Groups | Complete | Multi-user chats with admin roles |
| Channels | Complete | Broadcast channels |
| Message Reactions | Complete | Emoji reactions on messages |
| Reply/Edit/Delete | Complete | Message management |
| Search | Complete | Global search across users and messages |
| User Profiles | Complete | Editable display name, bio, status |
| E2E Encryption | Complete | Encryption indicators on all chats |
| Voice/Video Call | Complete | Call UI with controls |
| Notifications | Complete | In-app notification system |
| Settings | Complete | Notification toggle, logout |
| Context Menus | Complete | Right-click actions on messages |
| Typing Indicators | Complete | Show who's typing |
| Online Status | Complete | Online/away/offline indicators |

## Integration Points

- **Database**: SQLite via Drizzle ORM
- **Styling**: Tailwind CSS 4 with custom theme
- **State**: Zustand for client state
- **Icons**: Lucide React
- **Auth**: Cookie-based sessions with bcrypt
