"use client";

import { useState, useEffect } from "react";
import { Search, MessageSquare } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useChatStore } from "@/store/chat";

interface UserItem {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  status: string;
}

export function NewChatModal() {
  const { showNewChat, setShowNewChat, setActiveChat, setChats } = useChatStore();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showNewChat) {
      fetch("/api/users").then((r) => r.json()).then((d) => setUsers(d.users || [])).catch(console.error);
    }
  }, [showNewChat]);

  const startChat = async (userId: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "direct", memberIds: [userId] }),
      });
      if (res.ok) {
        const data = await res.json();
        const chatsRes = await fetch("/api/chats");
        if (chatsRes.ok) {
          const chatsData = await chatsRes.json();
          setChats(chatsData.chats || []);
          const newChat = chatsData.chats.find((c: { id: string }) => c.id === data.chatId);
          if (newChat) setActiveChat(newChat);
        }
        setShowNewChat(false);
      }
    } catch (error) {
      console.error("Failed to create chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.displayName.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal isOpen={showNewChat} onClose={() => setShowNewChat(false)} title="New Message">
      <div className="mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6c7883]" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#232e3c] text-[#f5f5f5] rounded-lg pl-9 pr-4 py-2.5 text-sm outline-none placeholder:text-[#6c7883] border border-[#2b5278]/30 focus:border-[#2b5278]"
            autoFocus
          />
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto space-y-1">
        {filtered.length === 0 ? (
          <p className="text-center text-[#6c7883] py-8">No users found</p>
        ) : (
          filtered.map((user) => (
            <button
              key={user.id}
              onClick={() => startChat(user.id)}
              disabled={loading}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#2b5278]/20 transition-colors text-left"
            >
              <Avatar name={user.displayName} src={user.avatar} size="md" status={user.status} userId={user.id} />
              <div className="flex-1">
                <p className="text-sm font-medium text-[#f5f5f5]">{user.displayName}</p>
                <p className="text-xs text-[#6c7883]">@{user.username}</p>
              </div>
              <MessageSquare size={16} className="text-[#6c7883]" />
            </button>
          ))
        )}
      </div>
    </Modal>
  );
}
