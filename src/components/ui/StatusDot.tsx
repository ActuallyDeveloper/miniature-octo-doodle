"use client";

interface StatusDotProps {
  status: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "w-2 h-2",
  md: "w-2.5 h-2.5",
  lg: "w-3 h-3",
};

const colors = {
  online: "bg-green-500",
  away: "bg-yellow-500",
  offline: "bg-gray-500",
  busy: "bg-red-500",
};

export function StatusDot({ status, size = "md" }: StatusDotProps) {
  return (
    <span
      className={`${sizes[size]} rounded-full ${colors[status as keyof typeof colors] || colors.offline} flex-shrink-0`}
    />
  );
}
