"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/store/chat";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { NewChatModal } from "@/components/modals/NewChatModal";
import { NewGroupModal } from "@/components/modals/NewGroupModal";
import { NewChannelModal } from "@/components/modals/NewChannelModal";
import { ProfileModal } from "@/components/modals/ProfileModal";
import { SettingsModal } from "@/components/modals/SettingsModal";
import { SearchModal } from "@/components/modals/SearchModal";
import { MessageSquare } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { setCurrentUser, activeChat } = useChatStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
        } else {
          router.push("/auth/login");
        }
      } catch {
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router, setCurrentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e1621] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#2b5278] rounded-full flex items-center justify-center animate-pulse">
            <MessageSquare size={28} className="text-white" />
          </div>
          <p className="text-[#6c7883] text-sm">Loading Exotic...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-[#0e1621] overflow-hidden relative">
      <ChatSidebar />
      <ChatWindow />

      {/* Modals */}
      <NewChatModal />
      <NewGroupModal />
      <NewChannelModal />
      <ProfileModal />
      <SettingsModal />
      <SearchModal />
    </div>
  );
}
