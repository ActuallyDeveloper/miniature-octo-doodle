"use client";

import { useEffect, useRef } from "react";

interface ContextMenuProps {
  x: number;
  y: number;
  items: { label: string; icon?: React.ReactNode; onClick: () => void; danger?: boolean }[];
  onClose: () => void;
}

export function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const adjustedX = Math.min(x, window.innerWidth - 200);
  const adjustedY = Math.min(y, window.innerHeight - items.length * 40);

  return (
    <div
      ref={ref}
      className="fixed z-50 bg-[#17212b] rounded-lg shadow-xl border border-[#2b5278]/20 py-1 min-w-[160px]"
      style={{ left: adjustedX, top: adjustedY }}
    >
      {items.map((item, i) => (
        <button
          key={i}
          onClick={() => {
            item.onClick();
            onClose();
          }}
          className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
            item.danger ? "text-red-400 hover:bg-red-500/10" : "text-[#f5f5f5] hover:bg-[#2b5278]/30"
          }`}
        >
          {item.icon && <span className="w-4 h-4">{item.icon}</span>}
          {item.label}
        </button>
      ))}
    </div>
  );
}
