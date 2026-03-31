import { create } from "zustand";

interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string | null;
  bio: string;
  status: string;
  lastSeen: Date | null;
}

interface Chat {
  id: string;
  type: string;
  name: string | null;
  avatar: string | null;
  description: string;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  members: (User & { role: string; nickname: string | null; muted: boolean })[];
  lastMessage: Message | null;
  unreadCount: number;
}

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  sender?: User;
  content: string;
  type: string;
  replyToId: string | null;
  forwardedFrom: string | null;
  isPinned: boolean;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
  reactions: { emoji: string; userId: string; userName?: string }[];
  attachments: { id: string; url: string; type: string; name: string; size: number }[];
}

interface ChatStore {
  currentUser: User | null;
  chats: Chat[];
  activeChat: Chat | null;
  messages: Message[];
  searchQuery: string;
  sidebarOpen: boolean;
  typingUsers: Record<string, string[]>;
  showProfile: boolean;
  showSettings: boolean;
  showNewChat: boolean;
  showNewGroup: boolean;
  showNewChannel: boolean;
  showSearch: boolean;
  
  setCurrentUser: (user: User | null) => void;
  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  updateChat: (chatId: string, updates: Partial<Chat>) => void;
  setActiveChat: (chat: Chat | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  setSearchQuery: (query: string) => void;
  setSidebarOpen: (open: boolean) => void;
  setTypingUsers: (chatId: string, users: string[]) => void;
  setShowProfile: (show: boolean) => void;
  setShowSettings: (show: boolean) => void;
  setShowNewChat: (show: boolean) => void;
  setShowNewGroup: (show: boolean) => void;
  setShowNewChannel: (show: boolean) => void;
  setShowSearch: (show: boolean) => void;
  markChatAsRead: (chatId: string) => void;
  incrementUnread: (chatId: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  currentUser: null,
  chats: [],
  activeChat: null,
  messages: [],
  searchQuery: "",
  sidebarOpen: true,
  typingUsers: {},
  showProfile: false,
  showSettings: false,
  showNewChat: false,
  showNewGroup: false,
  showNewChannel: false,
  showSearch: false,

  setCurrentUser: (user) => set({ currentUser: user }),
  setChats: (chats) => set({ chats }),
  addChat: (chat) => set((state) => ({ chats: [chat, ...state.chats] })),
  updateChat: (chatId, updates) =>
    set((state) => ({
      chats: state.chats.map((c) => (c.id === chatId ? { ...c, ...updates } : c)),
      activeChat: state.activeChat?.id === chatId ? { ...state.activeChat, ...updates } : state.activeChat,
    })),
  setActiveChat: (chat) => set({ activeChat: chat, sidebarOpen: false }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => {
      const exists = state.messages.some((m) => m.id === message.id);
      if (exists) return state;
      return { messages: [...state.messages, message] };
    }),
  updateMessage: (messageId, updates) =>
    set((state) => ({
      messages: state.messages.map((m) => (m.id === messageId ? { ...m, ...updates } : m)),
    })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setTypingUsers: (chatId, users) =>
    set((state) => ({ typingUsers: { ...state.typingUsers, [chatId]: users } })),
  setShowProfile: (show) => set({ showProfile: show }),
  setShowSettings: (show) => set({ showSettings: show }),
  setShowNewChat: (show) => set({ showNewChat: show }),
  setShowNewGroup: (show) => set({ showNewGroup: show }),
  setShowNewChannel: (show) => set({ showNewChannel: show }),
  setShowSearch: (show) => set({ showSearch: show }),
  markChatAsRead: (chatId) =>
    set((state) => ({
      chats: state.chats.map((c) => (c.id === chatId ? { ...c, unreadCount: 0 } : c)),
    })),
  incrementUnread: (chatId) =>
    set((state) => ({
      chats: state.chats.map((c) => (c.id === chatId ? { ...c, unreadCount: (c.unreadCount || 0) + 1 } : c)),
    })),
}));
