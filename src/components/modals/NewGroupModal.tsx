"use client";

import { useState, useEffect } from "react";
import { Search, Check } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Avatar } from "@/components/ui/Avatar";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useChatStore } from "@/store/chat";

interface UserItem {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  status: string;
}

export function NewGroupModal() {
  const { showNewGroup, setShowNewGroup, setActiveChat, setChats } = useChatStore();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showNewGroup) {
      fetch("/api/users").then((r) => r.json()).then((d) => setUsers(d.users || [])).catch(console.error);
    }
  }, [showNewGroup]);

  const toggleUser = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const createGroup = async () => {
    if (!name.trim() || selected.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "group", name, description, memberIds: selected }),
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
        setShowNewGroup(false);
        setName("");
        setDescription("");
        setSelected([]);
        setStep(1);
      }
    } catch (error) {
      console.error("Failed to create group:", error);
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
    <Modal
      isOpen={showNewGroup}
      onClose={() => { setShowNewGroup(false); setStep(1); setSelected([]); setName(""); }}
      title={step === 1 ? "Add Members" : "New Group"}
    >
      {step === 1 ? (
        <>
          <div className="mb-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6c7883]" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#232e3c] text-[#f5f5f5] rounded-lg pl-9 pr-4 py-2.5 text-sm outline-none placeholder:text-[#6c7883] border border-[#2b5278]/30"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-1">
            {filtered.map((user) => (
              <button
                key={user.id}
                onClick={() => toggleUser(user.id)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#2b5278]/20 transition-colors text-left"
              >
                <Avatar name={user.displayName} src={user.avatar} size="sm" status={user.status} userId={user.id} />
                <div className="flex-1">
                  <p className="text-sm text-[#f5f5f5]">{user.displayName}</p>
                </div>
                {selected.includes(user.id) && <Check size={16} className="text-[#4eae53]" />}
              </button>
            ))}
          </div>

          <Button
            onClick={() => setStep(2)}
            disabled={selected.length === 0}
            className="w-full mt-4"
          >
            Next ({selected.length} selected)
          </Button>
        </>
      ) : (
        <>
          <div className="space-y-4">
            <Input
              label="Group Name"
              placeholder="Enter group name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Description (optional)"
              placeholder="What is this group about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">Back</Button>
            <Button onClick={createGroup} disabled={!name.trim() || loading} className="flex-1">
              {loading ? "Creating..." : "Create Group"}
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
