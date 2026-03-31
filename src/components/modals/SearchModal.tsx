"use client";

import { useState, useEffect } from "react";
import { Search, User, MessageSquare, X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Avatar } from "@/components/ui/Avatar";
import { useChatStore } from "@/store/chat";
import { formatTime } from "@/lib/utils";

interface SearchUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  status: string;
}

interface SearchMessage {
  id: string;
  chatId: string;
  content: string;
  senderId: string;
  createdAt: Date;
}

interface SearchResults {
  users: SearchUser[];
  messages: SearchMessage[];
}

export function SearchModal() {
  const { showSearch, setShowSearch, setActiveChat, chats } = useChatStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({ users: [], messages: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setResults({ users: [], messages: [] }); return; }
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const openChat = (chatId: string) => {
    const chat = chats.find((c) => c.id === chatId);
    if (chat) setActiveChat(chat);
    setShowSearch(false);
    setQuery("");
  };

  return (
    <Modal isOpen={showSearch} onClose={() => { setShowSearch(false); setQuery(""); }} title="Search">
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6c7883]" />
        <input
          type="text"
          placeholder="Search messages, users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-[#232e3c] text-[#f5f5f5] rounded-lg pl-9 pr-8 py-2.5 text-sm outline-none placeholder:text-[#6c7883] border border-[#2b5278]/30 focus:border-[#2b5278]"
          autoFocus
        />
        {query && (
          <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6c7883] hover:text-[#f5f5f5]">
            <X size={14} />
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-[#2b5278] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !query.trim() ? (
          <p className="text-center text-[#6c7883] py-8">Type to search...</p>
        ) : results.users.length === 0 && results.messages.length === 0 ? (
          <p className="text-center text-[#6c7883] py-8">No results found</p>
        ) : (
          <>
            {results.users.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-[#6c7883] uppercase mb-2">Users</h4>
                {results.users.map((user) => (
                  <button
                    key={user.id}
                    className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#2b5278]/20 transition-colors text-left"
                  >
                    <Avatar name={user.displayName} src={user.avatar} size="sm" status={user.status} userId={user.id} />
                    <div>
                      <p className="text-sm text-[#f5f5f5]">{user.displayName}</p>
                      <p className="text-xs text-[#6c7883]">@{user.username}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {results.messages.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-[#6c7883] uppercase mb-2">Messages</h4>
                {results.messages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => openChat(msg.chatId)}
                    className="w-full flex items-start gap-3 px-2 py-2 rounded-lg hover:bg-[#2b5278]/20 transition-colors text-left"
                  >
                    <MessageSquare size={16} className="text-[#6c7883] mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#f5f5f5] truncate">{msg.content}</p>
                      <p className="text-xs text-[#6c7883]">{formatTime(new Date(msg.createdAt))}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
