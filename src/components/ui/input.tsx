"use client";

import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", icon, rightElement, ...props }, ref) => {
    return (
      <div className="relative w-full flex items-center">
        {icon && <div className="absolute left-3.5 text-gray-500 pointer-events-none">{icon}</div>}
        <input
          ref={ref}
          className={`w-full bg-white border border-gray-200 focus:border-[#fab528] focus:ring-1 focus:ring-[#fab528] rounded-lg py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all ${
            icon ? "pl-10" : "px-3.5"
          } ${rightElement ? "pr-10" : "pr-3.5"} ${className}`}
          {...props}
        />
        {rightElement && <div className="absolute right-3">{rightElement}</div>}
      </div>
    );
  }
);

Input.displayName = "Input";
