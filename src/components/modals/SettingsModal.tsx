"use client";

import { useState } from "react";
import { Moon, Sun, Bell, Shield, Palette, Globe, LogOut, ChevronRight } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useChatStore } from "@/store/chat";
import { EncryptionBadge } from "@/components/ui/EncryptionBadge";

interface SettingsItem {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  toggle?: boolean;
  onToggle?: () => void;
  value?: string;
}

interface SettingsGroup {
  title: string;
  items: SettingsItem[];
}

export function SettingsModal() {
  const { showSettings, setShowSettings, currentUser } = useChatStore();
  const [notifications, setNotifications] = useState(true);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/auth/login";
  };

  const settingsGroups: SettingsGroup[] = [
    {
      title: "General",
      items: [
        { icon: Bell, label: "Notifications", toggle: notifications, onToggle: () => setNotifications(!notifications) },
        { icon: Globe, label: "Language", value: "English" },
      ],
    },
    {
      title: "Privacy & Security",
      items: [
        { icon: Shield, label: "Privacy & Security" },
      ],
    },
  ];

  return (
    <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="Settings">
      {currentUser && (
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#2b5278]/20">
          <div className="w-12 h-12 bg-[#2b5278] rounded-full flex items-center justify-center text-white font-semibold">
            {currentUser.displayName[0]}
          </div>
          <div>
            <p className="text-sm font-medium text-[#f5f5f5]">{currentUser.displayName}</p>
            <p className="text-xs text-[#6c7883]">{currentUser.email}</p>
          </div>
        </div>
      )}

      <div className="mb-4">
        <EncryptionBadge />
      </div>

      {settingsGroups.map((group) => (
        <div key={group.title} className="mb-4">
          <h4 className="text-xs font-semibold text-[#6c7883] uppercase mb-2 px-1">{group.title}</h4>
          <div className="space-y-0.5">
            {group.items.map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#2b5278]/20 transition-colors"
              >
                <item.icon size={18} className="text-[#6c7883]" />
                <span className="flex-1 text-sm text-[#f5f5f5] text-left">{item.label}</span>
                {item.toggle !== undefined ? (
                  <div
                    onClick={(e: React.MouseEvent) => { e.stopPropagation(); item.onToggle?.(); }}
                    className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${item.toggle ? "bg-[#2b5278]" : "bg-[#232e3c]"}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-transform ${item.toggle ? "translate-x-5.5 ml-0.5" : "translate-x-0.5"}`} />
                  </div>
                ) : item.value ? (
                  <span className="text-xs text-[#6c7883]">{item.value}</span>
                ) : (
                  <ChevronRight size={16} className="text-[#6c7883]" />
                )}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="pt-4 border-t border-[#2b5278]/20">
        <Button variant="danger" onClick={handleLogout} className="w-full">
          <LogOut size={16} className="mr-2" />
          Log Out
        </Button>
      </div>
    </Modal>
  );
}
