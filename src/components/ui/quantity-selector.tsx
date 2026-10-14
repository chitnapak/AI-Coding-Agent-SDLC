"use client";

import React from "react";
import { Plus, Minus } from "lucide-react";

export interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  className = "",
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div
      className={`inline-flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden h-10 ${className}`}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className="px-3 h-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors flex items-center justify-center"
        aria-label="Decrease quantity"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <span className="px-4 text-xs font-mono font-semibold text-gray-900 select-none min-w-[2.5rem] text-center">
        {value}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        className="px-3 h-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors flex items-center justify-center"
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
