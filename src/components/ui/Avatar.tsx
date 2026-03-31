"use client";

import { getInitials, getAvatarColor } from "@/lib/utils";

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  status?: string;
  userId?: string;
}

const sizes = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
};

const statusSizes = {
  sm: "w-2.5 h-2.5",
  md: "w-3 h-3",
  lg: "w-3.5 h-3.5",
  xl: "w-4 h-4",
};

export function Avatar({ name, src, size = "md", status, userId }: AvatarProps) {
  const color = userId ? getAvatarColor(userId) : getAvatarColor(name);

  if (src) {
    return (
      <div className="relative flex-shrink-0">
        <img
          src={src}
          alt={name}
          className={`${sizes[size]} rounded-full object-cover`}
        />
        {status && (
          <span
            className={`absolute bottom-0 right-0 ${statusSizes[size]} rounded-full border-2 border-[#17212b] ${
              status === "online" ? "bg-green-500" : status === "away" ? "bg-yellow-500" : "bg-gray-500"
            }`}
          />
        )}
      </div>
    );
  }

  return (
    <div className="relative flex-shrink-0">
      <div
        className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold text-white`}
        style={{ backgroundColor: color }}
      >
        {getInitials(name)}
      </div>
      {status && (
        <span
          className={`absolute bottom-0 right-0 ${statusSizes[size]} rounded-full border-2 border-[#17212b] ${
            status === "online" ? "bg-green-500" : status === "away" ? "bg-yellow-500" : "bg-gray-500"
          }`}
        />
      )}
    </div>
  );
}
