"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Search, Plus, MessageSquare, Users, Radio, Settings, User,
  ChevronDown, LogOut, X, Menu
} from "lucide-react";
import { useChatStore } from "@/store/chat";
import { Avatar } from "@/components/ui/Avatar";
import { formatTime, truncate, getInitials } from "@/lib/utils";

export function ChatSidebar() {
  const {
    chats, setChats, activeChat, setActiveChat, currentUser,
    searchQuery, setSearchQuery, sidebarOpen, setSidebarOpen,
    setShowNewChat, setShowNewGroup, setShowNewChannel,
    setShowProfile, setShowSettings, setShowSearch,
  } = useChatStore();

  const [filter, setFilter] = useState<"all" | "personal" | "groups" | "channels">("all");
  const [showMenu, setShowMenu] = useState(false);

  const fetchChats = useCallback(async () => {
    try {
      const res = await fetch("/api/chats");
      if (res.ok) {
        const data = await res.json();
        setChats(data.chats || []);
      }
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    }
  }, [setChats]);

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 5000);
    return () => clearInterval(interval);
  }, [fetchChats]);

  const getChatName = (chat: typeof chats[0]) => {
    if (chat.name) return chat.name;
    if (chat.type === "direct") {
      const other = chat.members.find((m) => m.id !== currentUser?.id);
      return other?.displayName || "Unknown";
    }
    return "Unnamed";
  };

  const getChatAvatar = (chat: typeof chats[0]) => {
    if (chat.avatar) return chat.avatar;
    if (chat.type === "direct") {
      const other = chat.members.find((m) => m.id !== currentUser?.id);
      return other?.avatar;
    }
    return null;
  };

  const getStatus = (chat: typeof chats[0]) => {
    if (chat.type === "direct") {
      const other = chat.members.find((m) => m.id !== currentUser?.id);
      return other?.status || "offline";
    }
    return undefined;
  };

  const filteredChats = chats.filter((chat) => {
    if (filter === "personal" && chat.type !== "direct") return false;
    if (filter === "groups" && chat.type !== "group") return false;
    if (filter === "channels" && chat.type !== "channel") return false;
    if (searchQuery) {
      const name = getChatName(chat).toLowerCase();
      return name.includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/auth/login";
  };

  const sortedChats = [...filteredChats].sort((a, b) => {
    const aTime = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : new Date(a.createdAt).getTime();
    const bTime = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : new Date(b.createdAt).getTime();
    return bTime - aTime;
  });

  return (
    <aside className={`w-full md:w-[360px] bg-[#17212b] flex flex-col h-full border-r border-[#2b5278]/20 ${sidebarOpen ? "" : "hidden md:flex"}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2b5278]/20">
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 text-[#f5f5f5] hover:bg-[#2b5278]/30 rounded-lg px-2 py-1.5 transition-colors"
          >
            <Menu size={20} />
            <span className="font-semibold text-lg">Exotic</span>
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className="absolute left-0 top-full mt-1 w-56 bg-[#17212b] rounded-lg shadow-xl border border-[#2b5278]/20 z-50 py-1">
                <button
                  onClick={() => { setShowNewChat(true); setShowMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#f5f5f5] hover:bg-[#2b5278]/30"
                >
                  <MessageSquare size={18} /> New Message
                </button>
                <button
                  onClick={() => { setShowNewGroup(true); setShowMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#f5f5f5] hover:bg-[#2b5278]/30"
                >
                  <Users size={18} /> New Group
                </button>
                <button
                  onClick={() => { setShowNewChannel(true); setShowMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#f5f5f5] hover:bg-[#2b5278]/30"
                >
                  <Radio size={18} /> New Channel
                </button>
                <div className="border-t border-[#2b5278]/20 my-1" />
                <button
                  onClick={() => { setShowProfile(true); setShowMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#f5f5f5] hover:bg-[#2b5278]/30"
                >
                  <User size={18} /> My Profile
                </button>
                <button
                  onClick={() => { setShowSettings(true); setShowMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#f5f5f5] hover:bg-[#2b5278]/30"
                >
                  <Settings size={18} /> Settings
                </button>
                <div className="border-t border-[#2b5278]/20 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10"
                >
                  <LogOut size={18} /> Log Out
                </button>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSearch(true)}
            className="p-2 text-[#aaaaaa] hover:text-[#f5f5f5] hover:bg-[#2b5278]/30 rounded-lg transition-colors"
          >
            <Search size={20} />
          </button>
          <button
            onClick={() => setShowNewChat(true)}
            className="p-2 text-[#aaaaaa] hover:text-[#f5f5f5] hover:bg-[#2b5278]/30 rounded-lg transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6c7883]" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#232e3c] text-[#f5f5f5] rounded-lg pl-9 pr-4 py-2 text-sm outline-none placeholder:text-[#6c7883] border border-transparent focus:border-[#2b5278]/50 transition-colors"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6c7883] hover:text-[#f5f5f5]">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 px-3 pb-2">
        {(["all", "personal", "groups", "channels"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filter === tab
                ? "bg-[#2b5278] text-white"
                : "text-[#aaaaaa] hover:bg-[#2b5278]/30"
            }`}
          >
            {tab === "all" ? "All" : tab === "personal" ? "Personal" : tab === "groups" ? "Groups" : "Channels"}
          </button>
        ))}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {sortedChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-[#6c7883]">
            <MessageSquare size={32} className="mb-2 opacity-50" />
            <p className="text-sm">No conversations yet</p>
            <button
              onClick={() => setShowNewChat(true)}
              className="mt-2 text-sm text-[#2b5278] hover:underline"
            >
              Start a chat
            </button>
          </div>
        ) : (
          sortedChats.map((chat) => {
            const isActive = activeChat?.id === chat.id;
            const chatName = getChatName(chat);
            const chatAvatar = getChatAvatar(chat);
            const status = getStatus(chat);

            return (
              <button
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left ${
                  isActive ? "bg-[#2b5278]" : "hover:bg-[#232e3c]"
                }`}
              >
                <Avatar
                  name={chatName}
                  src={chatAvatar}
                  size="md"
                  status={status}
                  userId={chat.type === "direct" ? chat.members.find((m) => m.id !== currentUser?.id)?.id : undefined}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium truncate ${isActive ? "text-white" : "text-[#f5f5f5]"}`}>
                      {chat.type === "group" && <Users size={14} className="inline mr-1 text-[#2b5278]" />}
                      {chat.type === "channel" && <Radio size={14} className="inline mr-1 text-[#4eae53]" />}
                      {chatName}
                    </span>
                    {chat.lastMessage && (
                      <span className={`text-xs flex-shrink-0 ml-2 ${isActive ? "text-white/70" : "text-[#6c7883]"}`}>
                        {formatTime(new Date(chat.lastMessage.createdAt))}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={`text-xs truncate ${isActive ? "text-white/70" : "text-[#6c7883]"}`}>
                      {chat.lastMessage ? truncate(chat.lastMessage.content, 40) : "No messages yet"}
                    </p>
                    {chat.unreadCount > 0 && (
                      <span className="ml-2 px-1.5 py-0.5 bg-[#2b5278] text-white text-xs rounded-full flex-shrink-0 min-w-[20px] text-center">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* User info at bottom */}
      {currentUser && (
        <div className="flex items-center gap-3 px-4 py-3 border-t border-[#2b5278]/20">
          <Avatar name={currentUser.displayName} src={currentUser.avatar} size="sm" status={currentUser.status} userId={currentUser.id} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#f5f5f5] truncate">{currentUser.displayName}</p>
            <p className="text-xs text-[#6c7883] truncate">@{currentUser.username}</p>
          </div>
          <button onClick={() => setShowSettings(true)} className="p-1.5 text-[#aaaaaa] hover:text-[#f5f5f5] hover:bg-[#2b5278]/30 rounded-lg transition-colors">
            <Settings size={18} />
          </button>
        </div>
      )}
    </aside>
  );
}
