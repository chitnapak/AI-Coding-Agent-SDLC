"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav className={`flex items-center gap-1.5 text-xs text-gray-500 font-medium ${className}`}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;

        return (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-[#2b783c] transition-colors truncate max-w-[180px] sm:max-w-none"
              >
                {item.label}
              </Link>
            ) : (
              <span className={`truncate max-w-[200px] sm:max-w-none ${isLast ? "text-gray-900 font-semibold" : ""}`}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
