"use client";

import Link from "next/link";
import { BookOpen, Download, ShoppingBag } from "lucide-react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function ApiDocsPage() {
  return (
    <main className="min-h-screen bg-[#fcfcfc] text-[#222222]">
      <header className="border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-4 py-3.5 lg:px-8">
          <Link href="/" className="group flex items-center gap-2" aria-label="Farmart home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fab528] shadow-md shadow-[#fab528]/30 transition-transform group-hover:scale-105">
              <ShoppingBag className="h-6 w-6 text-black" />
            </span>
            <span className="flex flex-col">
              <span className="text-2xl font-black leading-none tracking-tight text-gray-900">Farm<span className="text-[#fab528]">art</span></span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#2b783c]">Grocery Store</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 text-sm font-semibold text-gray-600 sm:flex"><BookOpen className="h-4 w-4 text-[#2b783c]" /> API Documentation</span>
            <a href="/api/openapi.json" className="inline-flex items-center gap-2 rounded-full bg-[#fab528] px-4 py-2 text-xs font-extrabold text-gray-950 transition-colors hover:bg-[#e99e02]">
              <Download className="h-3.5 w-3.5" /> Download OpenAPI JSON
            </a>
          </div>
        </div>
      </header>

      <section className="border-b border-[#2b783c]/10 bg-[#f4fbf5]">
        <div className="mx-auto max-w-[1400px] px-4 py-8 lg:px-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#2b783c]">Developer portal</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-gray-950">Farmart Storefront API</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">Interactive Swagger documentation for the catalog, product, cart, customer, and checkout flows in Farmart.</p>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-4 py-8 lg:px-8">
        <div className="farmart-swagger overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <SwaggerUI url="/api/openapi.json" docExpansion="list" defaultModelsExpandDepth={1} displayRequestDuration />
        </div>
      </div>
    </main>
  );
}
