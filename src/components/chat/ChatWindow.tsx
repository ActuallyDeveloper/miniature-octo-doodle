"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  ArrowLeft, Phone, Video, MoreVertical, Search, Pin, Trash2,
  Edit3, Forward, Copy, SmilePlus, Reply, Lock, Shield, Info, X, Paperclip, Send, Image as ImageIcon
} from "lucide-react";
import { useChatStore } from "@/store/chat";
import { Avatar } from "@/components/ui/Avatar";
import { EncryptionBadge } from "@/components/ui/EncryptionBadge";
import { TypingIndicator } from "@/components/ui/TypingIndicator";
import { ContextMenu } from "@/components/ui/ContextMenu";
import { formatMessageTime, formatDate, generateId } from "@/lib/utils";

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥", "🎉", "👏"];

export function ChatWindow() {
  const {
    activeChat, setActiveChat, messages, setMessages, addMessage,
    currentUser, setSidebarOpen, typingUsers, showSearch, setShowSearch,
    setShowProfile,
  } = useChatStore();

  const [messageText, setMessageText] = useState("");
  const [replyTo, setReplyTo] = useState<typeof messages[0] | null>(null);
  const [editingMessage, setEditingMessage] = useState<typeof messages[0] | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; message: typeof messages[0] } | null>(null);
  const [searchText, setSearchText] = useState("");
  const [showCallUI, setShowCallUI] = useState<"voice" | "video" | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const getChatName = () => {
    if (!activeChat) return "";
    if (activeChat.name) return activeChat.name;
    if (activeChat.type === "direct") {
      const other = activeChat.members.find((m) => m.id !== currentUser?.id);
      return other?.displayName || "Unknown";
    }
    return "Unnamed";
  };

  const getChatStatus = () => {
    if (!activeChat) return "";
    if (activeChat.type === "direct") {
      const other = activeChat.members.find((m) => m.id !== currentUser?.id);
      return other?.status || "offline";
    }
    return `${activeChat.members.length} members`;
  };

  const fetchMessages = useCallback(async () => {
    if (!activeChat) return;
    try {
      const res = await fetch(`/api/messages?chatId=${activeChat.id}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  }, [activeChat, setMessages]);

  useEffect(() => {
    if (activeChat) {
      fetchMessages();
      pollRef.current = setInterval(fetchMessages, 3000);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [activeChat, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!messageText.trim() || !activeChat) return;

    const text = messageText.trim();
    setMessageText("");
    setReplyTo(null);
    setEditingMessage(null);

    if (editingMessage) {
      await fetch(`/api/messages/${editingMessage.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      fetchMessages();
      return;
    }

    const tempId = generateId();
    const optimisticMessage = {
      id: tempId,
      chatId: activeChat.id,
      senderId: currentUser?.id || "",
      content: text,
      type: "text",
      replyToId: replyTo?.id || null,
      forwardedFrom: null,
      isPinned: false,
      isEdited: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      sender: currentUser ? { id: currentUser.id, displayName: currentUser.displayName, username: currentUser.username, avatar: currentUser.avatar } : undefined,
      reactions: [],
      attachments: [],
    };
    addMessage(optimisticMessage as typeof messages[0]);

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: activeChat.id,
          content: text,
          replyToId: replyTo?.id,
        }),
      });
      fetchMessages();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    await fetch("/api/reactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId, emoji }),
    });
    setShowEmojiPicker(null);
    fetchMessages();
  };

  const handleDelete = async (messageId: string) => {
    await fetch(`/api/messages/${messageId}`, { method: "DELETE" });
    fetchMessages();
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const filteredMessages = searchText
    ? messages.filter((m) => m.content.toLowerCase().includes(searchText.toLowerCase()))
    : messages;

  const groupedMessages: { date: string; messages: typeof messages }[] = [];
  filteredMessages.forEach((msg) => {
    const date = formatDate(new Date(msg.createdAt));
    const last = groupedMessages[groupedMessages.length - 1];
    if (last && last.date === date) {
      last.messages.push(msg);
    } else {
      groupedMessages.push({ date, messages: [msg] });
    }
  });

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0e1621]">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-[#2b5278]/20 rounded-full flex items-center justify-center">
            <Lock size={40} className="text-[#2b5278]" />
          </div>
          <h2 className="text-xl font-semibold text-[#f5f5f5] mb-2">Welcome to Exotic</h2>
          <p className="text-[#6c7883] text-sm max-w-xs mx-auto">
            Select a chat to start messaging. All messages are end-to-end encrypted.
          </p>
          <div className="mt-4">
            <EncryptionBadge />
          </div>
        </div>
      </div>
    );
  }

  const chatAvatar = activeChat.type === "direct"
    ? activeChat.members.find((m) => m.id !== currentUser?.id)?.avatar
    : activeChat.avatar;

  return (
    <div className="flex-1 flex flex-col bg-[#0e1621] h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#17212b] border-b border-[#2b5278]/20">
        <div className="flex items-center gap-3">
          <button onClick={() => { setActiveChat(null); setSidebarOpen(true); }} className="md:hidden p-1.5 text-[#aaaaaa] hover:text-[#f5f5f5]">
            <ArrowLeft size={20} />
          </button>
          <button onClick={() => setShowInfo(!showInfo)} className="flex items-center gap-3 hover:bg-[#2b5278]/20 rounded-lg px-2 py-1 transition-colors">
            <Avatar name={getChatName()} src={chatAvatar} size="md" userId={activeChat.type === "direct" ? activeChat.members.find((m) => m.id !== currentUser?.id)?.id : undefined} />
            <div>
              <h2 className="text-sm font-semibold text-[#f5f5f5] flex items-center gap-1.5">
                {getChatName()}
                {activeChat.type !== "direct" && <Shield size={12} className="text-[#4eae53]" />}
              </h2>
              <p className="text-xs text-[#6c7883]">
                {typingUsers[activeChat.id]?.length
                  ? `${typingUsers[activeChat.id].join(", ")} typing...`
                  : getChatStatus()}
              </p>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={() => setShowSearch(!showSearch)} className="p-2 text-[#aaaaaa] hover:text-[#f5f5f5] hover:bg-[#2b5278]/30 rounded-lg transition-colors">
            <Search size={18} />
          </button>
          <button onClick={() => setShowCallUI("voice")} className="p-2 text-[#aaaaaa] hover:text-[#f5f5f5] hover:bg-[#2b5278]/30 rounded-lg transition-colors">
            <Phone size={18} />
          </button>
          <button onClick={() => setShowCallUI("video")} className="p-2 text-[#aaaaaa] hover:text-[#f5f5f5] hover:bg-[#2b5278]/30 rounded-lg transition-colors">
            <Video size={18} />
          </button>
          <button onClick={() => setShowInfo(!showInfo)} className="p-2 text-[#aaaaaa] hover:text-[#f5f5f5] hover:bg-[#2b5278]/30 rounded-lg transition-colors">
            <Info size={18} />
          </button>
        </div>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className="px-4 py-2 bg-[#17212b] border-b border-[#2b5278]/20">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6c7883]" />
            <input
              type="text"
              placeholder="Search in conversation..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full bg-[#232e3c] text-[#f5f5f5] rounded-lg pl-9 pr-4 py-2 text-sm outline-none placeholder:text-[#6c7883]"
              autoFocus
            />
            <button onClick={() => { setShowSearch(false); setSearchText(""); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6c7883] hover:text-[#f5f5f5]">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Voice/Video Call UI */}
      {showCallUI && (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#0e1621]">
          <div className="text-center">
            <Avatar name={getChatName()} src={chatAvatar} size="xl" userId={activeChat.type === "direct" ? activeChat.members.find((m) => m.id !== currentUser?.id)?.id : undefined} />
            <h3 className="text-xl font-semibold text-[#f5f5f5] mt-4">{getChatName()}</h3>
            <p className="text-[#6c7883] mt-1">
              {showCallUI === "voice" ? "Voice Call" : "Video Call"} - Connecting...
            </p>
            <div className="mt-8 flex items-center gap-4">
              <button className="w-14 h-14 bg-[#232e3c] rounded-full flex items-center justify-center text-[#f5f5f5] hover:bg-[#2b5278]/50 transition-colors">
                <Lock size={20} />
              </button>
              <button onClick={() => setShowCallUI(null)} className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-colors">
                <Phone size={20} className="rotate-135" />
              </button>
              {showCallUI === "video" && (
                <button className="w-14 h-14 bg-[#232e3c] rounded-full flex items-center justify-center text-[#f5f5f5] hover:bg-[#2b5278]/50 transition-colors">
                  <Video size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      {!showCallUI && (
        <>
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 py-4">
            <div className="max-w-3xl mx-auto">
              {/* Encryption notice */}
              <div className="flex justify-center mb-6">
                <EncryptionBadge />
              </div>

              {groupedMessages.map(({ date, messages: dateMessages }) => (
                <div key={date}>
                  <div className="flex justify-center my-4">
                    <span className="px-3 py-1 bg-[#17212b] text-[#aaaaaa] text-xs rounded-full">{date}</span>
                  </div>
                  {dateMessages.map((msg) => {
                    const isOwn = msg.senderId === currentUser?.id;
                    const sender = msg.sender || activeChat.members.find((m) => m.id === msg.senderId);
                    const replyMsg = msg.replyToId ? messages.find((m) => m.id === msg.replyToId) : null;

                    return (
                      <div
                        key={msg.id}
                        className={`group flex gap-2 mb-1 ${isOwn ? "justify-end" : "justify-start"}`}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setContextMenu({ x: e.clientX, y: e.clientY, message: msg });
                        }}
                      >
                        {!isOwn && activeChat.type !== "direct" && (
                          <Avatar name={sender?.displayName || "Unknown"} src={sender?.avatar} size="sm" userId={msg.senderId} />
                        )}
                        <div className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"}`}>
                          {/* Sender name for groups */}
                          {!isOwn && activeChat.type !== "direct" && (
                            <p className="text-xs font-medium text-[#2b5278] mb-0.5 ml-1">{sender?.displayName}</p>
                          )}

                          {/* Reply preview */}
                          {replyMsg && (
                            <div className={`mb-1 px-3 py-1.5 rounded-t-lg border-l-2 ${isOwn ? "bg-[#2b5278]/30 border-[#4eae53]" : "bg-[#232e3c] border-[#2b5278]"}`}>
                              <p className="text-xs text-[#4eae53] font-medium">{replyMsg.sender?.displayName}</p>
                              <p className="text-xs text-[#aaaaaa] truncate">{replyMsg.content}</p>
                            </div>
                          )}

                          <div
                            className={`relative px-3 py-2 rounded-2xl ${
                              isOwn
                                ? "bg-[#2b5278] text-white rounded-br-md"
                                : "bg-[#182533] text-[#f5f5f5] rounded-bl-md"
                            } ${replyMsg ? (isOwn ? "rounded-tr-md" : "rounded-tl-md") : ""}`}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                            <div className={`flex items-center gap-1.5 mt-0.5 ${isOwn ? "justify-end" : "justify-start"}`}>
                              {msg.isEdited && <span className="text-[10px] opacity-60">edited</span>}
                              <span className={`text-[10px] ${isOwn ? "text-white/60" : "text-[#6c7883]"}`}>
                                {formatMessageTime(new Date(msg.createdAt))}
                              </span>
                              {isOwn && (
                                <span className="text-[10px] text-white/60">
                                  <svg width="16" height="11" viewBox="0 0 16 11" fill="none" className="inline">
                                    <path d="M1 5.5L5.5 10L14.5 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M5 5.5L9.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
                                  </svg>
                                </span>
                              )}
                            </div>

                            {/* Quick actions on hover */}
                            <div className={`absolute top-0 ${isOwn ? "left-0 -translate-x-full" : "right-0 translate-x-full"} opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 px-1`}>
                              <button onClick={() => setShowEmojiPicker(msg.id)} className="p-1 text-[#aaaaaa] hover:text-[#f5f5f5] hover:bg-[#2b5278]/30 rounded">
                                <SmilePlus size={14} />
                              </button>
                              <button onClick={() => setReplyTo(msg)} className="p-1 text-[#aaaaaa] hover:text-[#f5f5f5] hover:bg-[#2b5278]/30 rounded">
                                <Reply size={14} />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); setContextMenu({ x: e.clientX, y: e.clientY, message: msg }); }}
                                className="p-1 text-[#aaaaaa] hover:text-[#f5f5f5] hover:bg-[#2b5278]/30 rounded"
                              >
                                <MoreVertical size={14} />
                              </button>
                            </div>

                            {/* Emoji picker */}
                            {showEmojiPicker === msg.id && (
                              <div className={`absolute top-full mt-1 ${isOwn ? "right-0" : "left-0"} bg-[#17212b] rounded-lg shadow-xl border border-[#2b5278]/20 p-2 flex gap-1 z-10`}>
                                {REACTION_EMOJIS.map((emoji) => (
                                  <button
                                    key={emoji}
                                    onClick={() => handleReaction(msg.id, emoji)}
                                    className="text-lg hover:scale-125 transition-transform"
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Reactions */}
                          {msg.reactions.length > 0 && (
                            <div className="flex gap-1 mt-0.5 flex-wrap">
                              {Object.entries(
                                msg.reactions.reduce((acc, r) => {
                                  acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                                  return acc;
                                }, {} as Record<string, number>)
                              ).map(([emoji, count]) => (
                                <button
                                  key={emoji}
                                  onClick={() => handleReaction(msg.id, emoji)}
                                  className="flex items-center gap-0.5 px-1.5 py-0.5 bg-[#232e3c] rounded-full text-xs hover:bg-[#2b5278]/30 transition-colors"
                                >
                                  <span>{emoji}</span>
                                  <span className="text-[#aaaaaa]">{count}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Reply bar */}
          {replyTo && (
            <div className="px-4 py-2 bg-[#17212b] border-t border-[#2b5278]/20">
              <div className="max-w-3xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Reply size={16} className="text-[#4eae53]" />
                  <div>
                    <p className="text-xs text-[#4eae53] font-medium">{replyTo.sender?.displayName}</p>
                    <p className="text-xs text-[#aaaaaa] truncate max-w-xs">{replyTo.content}</p>
                  </div>
                </div>
                <button onClick={() => setReplyTo(null)} className="text-[#6c7883] hover:text-[#f5f5f5]">
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Edit bar */}
          {editingMessage && (
            <div className="px-4 py-2 bg-[#17212b] border-t border-[#2b5278]/20">
              <div className="max-w-3xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Edit3 size={16} className="text-[#2b5278]" />
                  <p className="text-xs text-[#aaaaaa]">Editing message</p>
                </div>
                <button onClick={() => setEditingMessage(null)} className="text-[#6c7883] hover:text-[#f5f5f5]">
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 bg-[#17212b] border-t border-[#2b5278]/20">
            <div className="max-w-3xl mx-auto flex items-end gap-2">
              <button className="p-2 text-[#aaaaaa] hover:text-[#f5f5f5] hover:bg-[#2b5278]/30 rounded-lg transition-colors">
                <Paperclip size={20} />
              </button>
              <button className="p-2 text-[#aaaaaa] hover:text-[#f5f5f5] hover:bg-[#2b5278]/30 rounded-lg transition-colors">
                <ImageIcon size={20} />
              </button>
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Write a message..."
                  rows={1}
                  className="w-full bg-[#232e3c] text-[#f5f5f5] rounded-xl px-4 py-2.5 text-sm outline-none placeholder:text-[#6c7883] resize-none max-h-32 border border-transparent focus:border-[#2b5278]/50 transition-colors"
                  style={{ minHeight: "40px" }}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!messageText.trim()}
                className="p-2.5 bg-[#2b5278] text-white rounded-xl hover:bg-[#2b5278]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          items={[
            { label: "Reply", icon: <Reply size={14} />, onClick: () => setReplyTo(contextMenu.message) },
            { label: "React", icon: <SmilePlus size={14} />, onClick: () => setShowEmojiPicker(contextMenu.message.id) },
            { label: "Copy", icon: <Copy size={14} />, onClick: () => handleCopy(contextMenu.message.content) },
            ...(contextMenu.message.senderId === currentUser?.id
              ? [
                  { label: "Edit", icon: <Edit3 size={14} />, onClick: () => { setEditingMessage(contextMenu.message); setMessageText(contextMenu.message.content); inputRef.current?.focus(); } },
                  { label: "Delete", icon: <Trash2 size={14} />, onClick: () => handleDelete(contextMenu.message.id), danger: true },
                ]
              : []),
          ]}
        />
      )}

      {/* Chat Info Panel */}
      {showInfo && (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-[#17212b] border-l border-[#2b5278]/20 z-30 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-[#2b5278]/20">
            <h3 className="text-sm font-semibold text-[#f5f5f5]">Chat Info</h3>
            <button onClick={() => setShowInfo(false)} className="text-[#aaaaaa] hover:text-[#f5f5f5]">
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col items-center mb-6">
              <Avatar name={getChatName()} src={chatAvatar} size="xl" userId={activeChat.type === "direct" ? activeChat.members.find((m) => m.id !== currentUser?.id)?.id : undefined} />
              <h3 className="text-lg font-semibold text-[#f5f5f5] mt-3">{getChatName()}</h3>
              <p className="text-sm text-[#6c7883]">{getChatStatus()}</p>
            </div>

            <EncryptionBadge />

            {activeChat.description && (
              <div className="mt-4">
                <h4 className="text-xs font-semibold text-[#6c7883] uppercase mb-1">About</h4>
                <p className="text-sm text-[#f5f5f5]">{activeChat.description}</p>
              </div>
            )}

            <div className="mt-4">
              <h4 className="text-xs font-semibold text-[#6c7883] uppercase mb-2">
                {activeChat.type === "direct" ? "User" : "Members"} ({activeChat.members.length})
              </h4>
              <div className="space-y-2">
                {activeChat.members.map((member) => (
                  <button
                    key={member.id}
                    className="w-full flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-[#2b5278]/20 transition-colors"
                  >
                    <Avatar name={member.displayName} src={member.avatar} size="sm" status={member.status} userId={member.id} />
                    <div className="flex-1 text-left">
                      <p className="text-sm text-[#f5f5f5]">{member.displayName}</p>
                      <p className="text-xs text-[#6c7883]">
                        {member.role !== "member" ? member.role : member.status || "offline"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
