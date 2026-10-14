"use client";

import React, { useEffect } from "react";
import { X, AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  variant?: "default" | "success" | "warning" | "destructive";
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  isLoading?: boolean;
}

// Low-level Primitive Components for Farmart Theme
export function DialogOverlay({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClick}
      className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all animate-in fade-in duration-150 ${className}`}
    >
      {children}
    </div>
  );
}

export function DialogSurface({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`relative w-full max-w-lg bg-white border border-gray-200 rounded-2xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 ${className}`}
    >
      {children}
    </div>
  );
}

export function DialogHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`space-y-1 ${className}`}>{children}</div>;
}

export function DialogTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <h3 className={`text-xl font-extrabold text-gray-900 ${className}`}>{children}</h3>;
}

export function DialogDescription({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={`text-xs text-gray-500 mt-0.5 ${className}`}>{children}</p>;
}

export function DialogFooter({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-end gap-3 pt-3 border-t border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

// Composite Component matching Farmart Theme
export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  variant = "default",
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel = "Cancel",
  onSecondaryAction,
  isLoading = false,
}: DialogProps) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Variant Icon & Color Specs for Farmart Theme
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
          badgeBg: "bg-emerald-50 border-emerald-200 text-emerald-700",
          primaryBtn: "bg-[#166534] hover:bg-[#14532d] text-white",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
          badgeBg: "bg-amber-50 border-amber-200 text-amber-800",
          primaryBtn: "bg-[#fab528] hover:bg-[#e99e02] text-gray-950",
        };
      case "destructive":
        return {
          icon: <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />,
          badgeBg: "bg-red-50 border-red-200 text-red-700",
          primaryBtn: "bg-red-600 hover:bg-red-700 text-white",
        };
      default:
        return {
          icon: <Info className="w-5 h-5 text-[#2b783c] shrink-0" />,
          badgeBg: "bg-emerald-50 border-emerald-200 text-[#2b783c]",
          primaryBtn: "bg-[#fab528] hover:bg-[#e99e02] text-gray-950",
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <DialogOverlay onClick={onClose}>
      <DialogSurface onClick={(e) => e.stopPropagation()}>
        {/* Header Section */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl border ${variantStyles.badgeBg}`}>
              {variantStyles.icon}
            </div>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              {description && <DialogDescription>{description}</DialogDescription>}
            </DialogHeader>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Custom Body Content if provided */}
        {children && <div className="text-xs sm:text-sm text-gray-700 space-y-3">{children}</div>}

        {/* Footer Actions */}
        <DialogFooter>
          <button
            type="button"
            onClick={onSecondaryAction || onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-xl border border-gray-200 text-xs transition-all cursor-pointer"
            disabled={isLoading}
          >
            {secondaryActionLabel}
          </button>

          {primaryActionLabel && (
            <button
              type="button"
              onClick={onPrimaryAction}
              disabled={isLoading}
              className={`font-bold px-4 py-2 rounded-xl text-xs transition-all duration-150 shadow-xs focus:ring-2 focus:ring-[#fab528]/50 flex items-center gap-2 cursor-pointer ${variantStyles.primaryBtn}`}
            >
              {isLoading && (
                <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              )}
              {primaryActionLabel}
            </button>
          )}
        </DialogFooter>
      </DialogSurface>
    </DialogOverlay>
  );
}
