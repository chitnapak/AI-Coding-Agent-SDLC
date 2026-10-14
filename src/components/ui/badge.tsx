"use client";

import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "active" | "neutral" | "warning" | "destructive" | "brand";
  icon?: React.ReactNode;
}

export function Badge({
  children,
  className = "",
  variant = "neutral",
  icon,
  ...props
}: BadgeProps) {
  const baseStyles = "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold transition-colors shadow-xs";

  const variantStyles = {
    active: "bg-emerald-50 text-[#2b783c] border border-emerald-200",
    neutral: "bg-gray-100 text-gray-700 border border-gray-200",
    warning: "bg-amber-50 text-amber-800 border border-amber-200",
    destructive: "bg-red-500 text-white font-extrabold uppercase",
    brand: "bg-[#fab528] text-gray-950 font-black uppercase",
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {icon}
      {children}
    </span>
  );
}
