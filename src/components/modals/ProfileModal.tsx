"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Avatar } from "@/components/ui/Avatar";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useChatStore } from "@/store/chat";

export function ProfileModal() {
  const { showProfile, setShowProfile, currentUser, setCurrentUser } = useChatStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ displayName: "", bio: "" });
  const [loading, setLoading] = useState(false);

  const startEdit = () => {
    if (currentUser) {
      setForm({ displayName: currentUser.displayName, bio: currentUser.bio || "" });
      setEditing(true);
    }
  };

  const save = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok && currentUser) {
        setCurrentUser({ ...currentUser, displayName: form.displayName, bio: form.bio });
        setEditing(false);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <Modal isOpen={showProfile} onClose={() => { setShowProfile(false); setEditing(false); }} title="My Profile">
      <div className="flex flex-col items-center">
        <Avatar name={currentUser.displayName} src={currentUser.avatar} size="xl" status={currentUser.status} userId={currentUser.id} />

        {editing ? (
          <div className="w-full mt-4 space-y-4">
            <Input
              label="Display Name"
              value={form.displayName}
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
            />
            <Input
              label="Bio"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setEditing(false)} className="flex-1">Cancel</Button>
              <Button onClick={save} disabled={loading} className="flex-1">{loading ? "Saving..." : "Save"}</Button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-[#f5f5f5] mt-3">{currentUser.displayName}</h3>
            <p className="text-sm text-[#6c7883]">@{currentUser.username}</p>
            {currentUser.bio && <p className="text-sm text-[#aaaaaa] mt-2 text-center">{currentUser.bio}</p>}
            <div className="mt-2 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${currentUser.status === "online" ? "bg-green-500" : "bg-gray-500"}`} />
              <span className="text-xs text-[#6c7883] capitalize">{currentUser.status}</span>
            </div>
            <div className="w-full mt-6 space-y-2">
              <div className="flex justify-between py-2 border-b border-[#2b5278]/20">
                <span className="text-sm text-[#6c7883]">Email</span>
                <span className="text-sm text-[#f5f5f5]">{currentUser.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#2b5278]/20">
                <span className="text-sm text-[#6c7883]">Username</span>
                <span className="text-sm text-[#f5f5f5]">@{currentUser.username}</span>
              </div>
            </div>
            <Button onClick={startEdit} variant="secondary" className="w-full mt-4">Edit Profile</Button>
          </>
        )}
      </div>
    </Modal>
  );
}
