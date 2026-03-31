"use client";

export function TypingIndicator({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <div className="flex gap-1">
        <span className="w-1.5 h-1.5 bg-[#2b5278] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-1.5 h-1.5 bg-[#2b5278] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-1.5 h-1.5 bg-[#2b5278] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
      <span className="text-xs text-[#aaaaaa]">{name} is typing...</span>
    </div>
  );
}
