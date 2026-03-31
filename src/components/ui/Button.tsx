"use client";

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary: "bg-[#2b5278] hover:bg-[#2b5278]/80 text-white",
  secondary: "bg-[#232e3c] hover:bg-[#232e3c]/80 text-[#f5f5f5]",
  ghost: "bg-transparent hover:bg-[#2b5278]/30 text-[#aaaaaa]",
  danger: "bg-red-600 hover:bg-red-700 text-white",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({ variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`${variants[variant]} ${sizes[size]} rounded-lg font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  );
}
