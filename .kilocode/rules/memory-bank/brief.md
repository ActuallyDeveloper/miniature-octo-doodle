# Project Brief: Exotic - Next-Gen Messaging Platform

## Purpose

Exotic is a production-ready Telegram clone messaging platform built with Next.js 16. It delivers a complete messaging experience with real-time chat, channels, groups, voice/video calls, and end-to-end encryption indicators. Named "Exotic" for its powerful, fast, and smart architecture.

## Target Users

- Users seeking a modern, fast messaging platform
- Teams needing group communication with channels
- Anyone wanting a Telegram-like experience on the web

## Core Features

1. **Real-Time Messaging** - Direct messages, group chats, broadcast channels
2. **End-to-End Encryption** - E2E encryption indicators on all chats
3. **Voice & Video Calls** - In-app call UI with mute/camera controls
4. **Channels & Groups** - Multi-user conversations with admin roles
5. **File/Media Sharing** - Attachments, images, and media support
6. **Message Reactions** - Emoji reactions on messages
7. **Search** - Global search across users, messages, and chats
8. **User Profiles** - Customizable profiles with status, bio, avatar
9. **Notifications** - In-app notification system
10. **Responsive Design** - Works on desktop and mobile

## Key Requirements

### Must Have

- Modern Next.js 16 setup with App Router
- TypeScript strict mode
- Tailwind CSS 4 for styling
- SQLite database with Drizzle ORM
- Authentication with session management
- Real-time message polling
- Dark theme Telegram-style UI
- Bun as package manager

### Architecture Decisions

- **Database**: SQLite via better-sqlite3 (production) / bun:sqlite (scripts)
- **State Management**: Zustand for client-side chat state
- **Auth**: Cookie-based sessions with bcrypt password hashing
- **Real-time**: Polling-based message updates (3s interval)
- **Styling**: Tailwind CSS 4 with custom Telegram-inspired theme

## Success Metrics

- Zero TypeScript errors
- Passing lint checks
- Successful production build
- Working authentication flow
- Functional messaging between demo accounts

## Constraints

- Single SQLite database file (exotic.db)
- Bun as package manager
- No external services required (self-contained)
- Modern browsers only (ES2020+)
