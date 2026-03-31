"use client";

import { useState } from "react";
import { Radio } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useChatStore } from "@/store/chat";

export function NewChannelModal() {
  const { showNewChannel, setShowNewChannel, setActiveChat, setChats } = useChatStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const createChannel = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "channel", name, description }),
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
        setShowNewChannel(false);
        setName("");
        setDescription("");
      }
    } catch (error) {
      console.error("Failed to create channel:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={showNewChannel} onClose={() => setShowNewChannel(false)} title="New Channel">
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 bg-[#4eae53]/20 rounded-full flex items-center justify-center mb-3">
          <Radio size={28} className="text-[#4eae53]" />
        </div>
        <p className="text-sm text-[#6c7883] text-center">
          Channels are for broadcasting messages to large audiences.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Channel Name"
          placeholder="e.g. Tech News"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Description (optional)"
          placeholder="What is this channel about?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <Button onClick={createChannel} disabled={!name.trim() || loading} className="w-full mt-6">
        {loading ? "Creating..." : "Create Channel"}
      </Button>
    </Modal>
  );
}
