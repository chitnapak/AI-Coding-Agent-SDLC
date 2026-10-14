"use client";

import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles matching Farmart Theme
    const baseStyles =
      "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-150 focus:outline-hidden focus:ring-2 focus:ring-[#fab528]/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50 shrink-0 cursor-pointer";

    // Variants matching Farmart Home Page
    const variantStyles = {
      primary: "bg-[#fab528] hover:bg-[#e99e02] text-gray-950 shadow-xs active:scale-[0.98]",
      secondary: "bg-[#166534] hover:bg-[#14532d] text-white shadow-xs active:scale-[0.98]",
      ghost: "p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg",
      destructive: "bg-red-500 hover:bg-red-600 text-white shadow-xs active:scale-[0.98]",
      outline: "bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 hover:border-gray-300 shadow-xs active:scale-[0.98]",
    };

    // Sizes
    const sizeStyles = {
      sm: "px-3 py-1.5 text-xs gap-1.5",
      md: "px-4 py-2.5 text-xs gap-2",
      lg: "px-6 py-3 text-sm gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
