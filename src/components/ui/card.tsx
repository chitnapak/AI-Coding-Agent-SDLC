"use client";

import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function Card({ children, className = "", interactive = false, ...props }: CardProps) {
  const baseStyles = "bg-white border border-gray-100 rounded-2xl p-6 shadow-xs transition-all duration-200";
  const interactiveStyles = interactive
    ? "hover:border-[#fab528] hover:shadow-md cursor-pointer group"
    : "";

  return (
    <div className={`${baseStyles} ${interactiveStyles} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`space-y-1.5 pb-4 border-b border-gray-100 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-lg font-bold text-gray-900 tracking-tight ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-xs text-gray-500 leading-relaxed ${className}`}>{children}</p>;
}

export function CardContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`pt-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`pt-4 border-t border-gray-100 flex items-center justify-between gap-4 ${className}`}>{children}</div>;
}
