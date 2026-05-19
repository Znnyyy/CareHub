"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  loading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  loading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyle = "inline-flex items-center justify-center font-medium rounded-xl transition-all disabled:opacity-75 disabled:cursor-not-allowed select-none";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 active:scale-[0.98]",
    secondary: "bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 active:scale-[0.98]",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20 active:scale-[0.98]",
    ghost: "text-slate-600 hover:bg-slate-100 active:scale-[0.98]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      )}
      {!loading && Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </button>
  );
}
