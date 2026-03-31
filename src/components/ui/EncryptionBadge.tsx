"use client";

import { Shield, Lock } from "lucide-react";

export function EncryptionBadge({ variant = "full" }: { variant?: "full" | "mini" }) {
  if (variant === "mini") {
    return (
      <div className="flex items-center gap-1 text-[#4eae53]">
        <Lock size={12} />
        <span className="text-xs">Encrypted</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-[#4eae53]/10 rounded-lg border border-[#4eae53]/20">
      <Shield size={16} className="text-[#4eae53]" />
      <div>
        <p className="text-sm font-medium text-[#4eae53]">End-to-End Encrypted</p>
        <p className="text-xs text-[#aaaaaa]">Messages are secured with E2E encryption</p>
      </div>
    </div>
  );
}
