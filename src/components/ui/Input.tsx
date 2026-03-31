"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-[#aaaaaa] mb-1.5">{label}</label>}
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaaaaa]">{icon}</div>}
          <input
            ref={ref}
            className={`w-full bg-[#232e3c] text-[#f5f5f5] rounded-lg px-4 py-2.5 outline-none border border-[#2b5278]/30 focus:border-[#2b5278] transition-colors placeholder:text-[#6c7883] ${icon ? "pl-10" : ""} ${error ? "border-red-500" : ""} ${className}`}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
