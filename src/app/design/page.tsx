"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Search,
  Palette,
  Type,
  Box,
  LayoutGrid,
  ShieldCheck,
  Sliders,
  Terminal,
  ChevronRight,
  MessageSquare
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { Breadcrumb } from "@/components/ui/breadcrumb";

// Color Token Data with WCAG AA Contrast Ratios from DESIGN.md
const colorTokens = [
  { name: "Primary Background", hex: "#fcfcfc", class: "bg-[#fcfcfc]", textClass: "text-gray-950", borderClass: "border-gray-100", role: "Main storefront canvas", contrast: "Base canvas" },
  { name: "Surface (Card/Modal)", hex: "#ffffff", class: "bg-white", textClass: "text-gray-900", borderClass: "border-gray-100", role: "Card, container, and sidebar surface", contrast: "Surface" },
  { name: "Surface Hover", hex: "#f9fafb", class: "bg-gray-50", textClass: "text-gray-700", borderClass: "border-gray-200", role: "Interactive surface hover state", contrast: "Hover surface" },
  { name: "Border / Divider", hex: "#f3f4f6", class: "bg-gray-100", textClass: "text-gray-700", borderClass: "border-gray-200", role: "Subtle structural borders & lines", contrast: "Border" },
  { name: "Primary Brand / Accent", hex: "#fab528", class: "bg-[#fab528]", textClass: "text-gray-950", borderClass: "border-[#fab528]", role: "Primary CTA, focus rings, active states", contrast: "Dark text: AAA" },
  { name: "Accent Hover", hex: "#e99e02", class: "bg-[#e99e02]", textClass: "text-gray-950", borderClass: "border-[#e99e02]", role: "Hover state for primary buttons", contrast: "Dark text: AAA" },
  { name: "Text Primary", hex: "#111827", class: "bg-gray-900", textClass: "text-gray-900", borderClass: "border-gray-200", role: "Primary headings & main readable text", contrast: "AAA on white" },
  { name: "Text Secondary", hex: "#6b7280", class: "bg-gray-500", textClass: "text-gray-600", borderClass: "border-gray-300", role: "Subtitles, labels, and muted text", contrast: "AA on white" },
  { name: "Success State", hex: "#10b981", class: "bg-emerald-500", textClass: "text-emerald-500", borderClass: "border-emerald-500/20", role: "Status badges, positive trends", contrast: "7.2:1 (AAA)" },
  { name: "Warning State", hex: "#f59e0b", class: "bg-amber-500", textClass: "text-amber-500", borderClass: "border-amber-500/20", role: "Caution alerts & pending actions", contrast: "7.8:1 (AAA)" },
  { name: "Destructive State", hex: "#f43f5e", class: "bg-rose-500", textClass: "text-rose-500", borderClass: "border-rose-500/20", role: "Errors, warnings, deletion CTAs", contrast: "5.4:1 (AA)" },
];

// Typography Scale Data
const typeScales = [
  { level: "Display H1", class: "text-4xl font-bold tracking-tight text-gray-900", specs: "36px / 700", sample: "Labs Analytics Engine" },
  { level: "Section H2", class: "text-2xl font-semibold tracking-tight text-gray-900", specs: "24px / 600", sample: "Performance Overview" },
  { level: "Card Title H3", class: "text-lg font-medium text-gray-900", specs: "18px / 500", sample: "Active Subscriptions" },
  { level: "Body Primary", class: "text-sm font-normal text-gray-700 leading-relaxed", specs: "14px / 400", sample: "Real-time metrics calculated across all active deployment clusters." },
  { level: "Subtext / Muted", class: "text-xs font-normal text-gray-600", specs: "12px / 400", sample: "Last updated 2 minutes ago • Region: us-east-1" },
  { level: "Monospace", class: "font-mono text-xs text-[#2b783c]", specs: "12px / 400", sample: "const systemStatus = { status: 200, latency: '14ms' };" },
];

export default function DesignSystemPage() {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "tokens" | "components" | "dialogs">("all");
  const [inputText, setInputText] = useState("");

  // Dialog State Management
  const [activeDialog, setActiveDialog] = useState<"default" | "success" | "warning" | "destructive" | "custom" | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(text);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleSimulateAction = (msg: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setActiveDialog(null);
      alert(msg);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased selection:bg-[#fab528]/30 selection:text-[#166534]">
      
      {/* Sticky Header Navigation following DESIGN.md Elevation */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#fab528]/10 border border-[#fab528]/30 flex items-center justify-center text-[#2b783c]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
                Farmart Design System
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#fab528]/10 text-[#2b783c] border border-[#fab528]/20">
                  v1.1 (DESIGN.md)
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-gray-600">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === "all" ? "bg-gray-100 text-gray-900" : "hover:text-gray-800"}`}
              >
                All Rules
              </button>
              <button
                onClick={() => setActiveTab("tokens")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === "tokens" ? "bg-gray-100 text-gray-900" : "hover:text-gray-800"}`}
              >
                Tokens & Typography
              </button>
              <button
                onClick={() => setActiveTab("components")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === "components" ? "bg-gray-100 text-gray-900" : "hover:text-gray-800"}`}
              >
                Components
              </button>
              <button
                onClick={() => setActiveTab("dialogs")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === "dialogs" ? "bg-gray-100 text-gray-900" : "hover:text-gray-800"}`}
              >
                Dialog Showcase
              </button>
            </nav>

            <Link
              href="/"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium px-3.5 py-1.5 rounded-lg border border-gray-300/50 transition-all flex items-center gap-1.5"
            >
              <span>Back to App</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </header>

      {/* Main Container following DESIGN.md Spacing */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">

        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-2xl bg-white/90 border border-gray-200/80 p-8 md:p-12 shadow-2xl shadow-gray-200/80">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-[#fab528]/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-gray-100 text-[#2b783c] border border-gray-300/50">
              <Terminal className="w-3.5 h-3.5" />
              <span>Specification derived from DESIGN.md</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
              Visual Language & <br />
              <span className="text-[#2b783c]">Design System Showcase</span>
            </h1>

            <p className="text-sm font-normal text-gray-700 leading-relaxed max-w-2xl">
              Live interactive preview of color tokens, typography hierarchy, component stylings, 
              elevation shadows, and the newly added <code className="text-[#2b783c] font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200">Dialog Component</code> specified in <code className="text-[#2b783c] font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200">DESIGN.md</code>.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveDialog("default")}
                className="bg-[#fab528] hover:bg-[#e99e02] text-gray-950 font-semibold px-4 py-2 rounded-lg transition-all duration-150 shadow-sm focus:ring-2 focus:ring-[#fab528]/50 flex items-center gap-2 text-xs"
              >
                <span>Launch Default Dialog</span>
                <MessageSquare className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveDialog("destructive")}
                className="bg-gray-100 hover:bg-gray-200 text-rose-400 font-medium px-4 py-2 rounded-lg border border-gray-300/50 transition-all duration-150 text-xs flex items-center gap-2"
              >
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Test Destructive Dialog</span>
              </button>
            </div>
          </div>
        </section>

        {/* SECTION: Dialog Component Showcase (NEW) */}
        {(activeTab === "all" || activeTab === "dialogs" || activeTab === "components") && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200/80 pb-4">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-5 h-5 text-[#2b783c]" />
                <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                  Dialog Component Showcase (DESIGN.md Spec)
                </h2>
              </div>
              <span className="text-xs font-mono text-gray-600">@/components/ui/dialog</span>
            </div>

            <div className="bg-white/90 border border-gray-200/80 rounded-xl p-6 space-y-6">
              <p className="text-sm text-gray-700 leading-relaxed max-w-3xl">
                The <code className="text-[#2b783c] font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200">Dialog</code> component follows the surface depth, border translucency, backdrop blur, and keyboard trap specifications from <code className="text-[#2b783c] font-mono">DESIGN.md</code>.
              </p>

              {/* Trigger Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

                {/* Default Variant */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#2b783c] font-semibold">Default / Brand</span>
                    <span className="w-2 h-2 rounded-full bg-[#e99e02]"></span>
                  </div>
                  <p className="text-xs text-gray-600">Information & general modal confirmation.</p>
                  <button
                    onClick={() => setActiveDialog("default")}
                    className="w-full bg-[#fab528] hover:bg-[#e99e02] text-gray-950 font-semibold py-2 rounded-lg text-xs transition-all shadow-sm"
                  >
                    Open Default Dialog
                  </button>
                </div>

                {/* Success Variant */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-emerald-400 font-semibold">Success State</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  </div>
                  <p className="text-xs text-gray-600">Positive feedback & completion steps.</p>
                  <button
                    onClick={() => setActiveDialog("success")}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-semibold py-2 rounded-lg text-xs transition-all shadow-sm"
                  >
                    Open Success Dialog
                  </button>
                </div>

                {/* Warning Variant */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-amber-400 font-semibold">Warning State</span>
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  </div>
                  <p className="text-xs text-gray-600">Cautionary prompts & unsaved changes.</p>
                  <button
                    onClick={() => setActiveDialog("warning")}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold py-2 rounded-lg text-xs transition-all shadow-sm"
                  >
                    Open Warning Dialog
                  </button>
                </div>

                {/* Destructive Variant */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-rose-400 font-semibold">Destructive</span>
                    <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  </div>
                  <p className="text-xs text-gray-600">Deletion & irreversible actions.</p>
                  <button
                    onClick={() => setActiveDialog("destructive")}
                    className="w-full bg-rose-500 hover:bg-rose-400 text-gray-950 font-semibold py-2 rounded-lg text-xs transition-all shadow-sm"
                  >
                    Open Destructive Dialog
                  </button>
                </div>

              </div>

              {/* Code Usage Snippet */}
              <div className="p-4 bg-white rounded-lg border border-gray-200 font-mono text-xs text-gray-700 space-y-2">
                <span className="text-gray-500">{"// Example Usage"}</span>
                <pre className="text-[#2b783c] overflow-x-auto">
{`<Dialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  description="Are you sure you want to process this update?"
  variant="default"
  primaryActionLabel="Save Changes"
  onPrimaryAction={() => handleSave()}
/>`}
                </pre>
              </div>
            </div>
          </section>
        )}

        {/* Section 1: Color Palette & Semantic Roles */}
        {(activeTab === "all" || activeTab === "tokens") && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200/80 pb-4">
              <div className="flex items-center gap-2.5">
                <Palette className="w-5 h-5 text-[#2b783c]" />
                <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                  1. Color Palette & Roles
                </h2>
              </div>
              <span className="text-xs font-mono text-gray-600">Tailwind CSS v4 Tokens</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {colorTokens.map((token, index) => (
                <div
                  key={index}
                  onClick={() => copyToClipboard(token.class)}
                  className="bg-white/90 border border-gray-200/80 hover:border-gray-300 rounded-xl p-4 transition-all duration-200 hover:shadow-[#fab528]/5 cursor-pointer group space-y-3"
                >
                  <div className="h-16 w-full rounded-lg border border-gray-200 relative flex items-center justify-center overflow-hidden shadow-inner" style={{ backgroundColor: token.hex }}>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 text-[#2b783c] text-[10px] font-mono px-2 py-1 rounded backdrop-blur-xs flex items-center gap-1">
                      {copiedToken === token.class ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {token.class}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">{token.name}</h3>
                      <span className="text-[11px] font-mono text-gray-600">{token.hex}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-600 leading-normal">{token.role}</p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-200/60 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-gray-500">WCAG Ratio</span>
                      <span className="text-[10px] font-mono font-medium text-[#2b783c] bg-[#fab528]/10 px-1.5 py-0.5 rounded border border-[#fab528]/20">
                        {token.contrast}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 2: Typography Hierarchy */}
        {(activeTab === "all" || activeTab === "tokens") && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200/80 pb-4">
              <div className="flex items-center gap-2.5">
                <Type className="w-5 h-5 text-[#2b783c]" />
                <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                  2. Typography Rules & Type Scale
                </h2>
              </div>
              <span className="text-xs font-mono text-gray-600">GeistSans & GeistMono</span>
            </div>

            <div className="bg-white/90 border border-gray-200/80 rounded-xl p-6 space-y-6">
              {typeScales.map((scale, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200/50 last:border-0 last:pb-0">
                  <div className="w-44 shrink-0">
                    <span className="text-xs font-mono text-[#2b783c] block">{scale.level}</span>
                    <span className="text-[11px] font-mono text-gray-500">{scale.specs}</span>
                  </div>
                  <div className="flex-1">
                    <span className={scale.class}>{scale.sample}</span>
                  </div>
                  <div className="shrink-0">
                    <code className="text-[10px] font-mono bg-white text-gray-600 px-2 py-1 rounded border border-gray-200">
                      {scale.class.split(" ")[0]} {scale.class.split(" ")[1]}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section: Shapes & Border Radii */}
        {(activeTab === "all" || activeTab === "tokens") && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200/80 pb-4">
              <div className="flex items-center gap-2.5">
                <Sliders className="w-5 h-5 text-[#2b783c]" />
                <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                  Shapes & Border Radii (DESIGN.md Tokens)
                </h2>
              </div>
              <span className="text-xs font-mono text-gray-600">Tailwind Radius Tokens</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/90 border border-gray-200/80 rounded-xl p-5 space-y-3">
                <div className="h-12 w-full bg-gray-100 border border-[#fab528]/30 rounded-md flex items-center justify-center">
                  <span className="text-xs font-mono text-[#2b783c]">rounded-md (6px)</span>
                </div>
                <p className="text-xs text-gray-600">Badges, icon buttons, dropdown items</p>
              </div>

              <div className="bg-white/90 border border-gray-200/80 rounded-xl p-5 space-y-3">
                <div className="h-12 w-full bg-gray-100 border border-[#fab528]/30 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-mono text-[#2b783c]">rounded-lg (8px)</span>
                </div>
                <p className="text-xs text-gray-600">Buttons, text inputs, select elements</p>
              </div>

              <div className="bg-white/90 border border-gray-200/80 rounded-xl p-5 space-y-3">
                <div className="h-12 w-full bg-gray-100 border border-[#fab528]/30 rounded-xl flex items-center justify-center">
                  <span className="text-xs font-mono text-[#2b783c]">rounded-xl (12px)</span>
                </div>
                <p className="text-xs text-gray-600">Cards, modals, sidebars, containers</p>
              </div>

              <div className="bg-white/90 border border-gray-200/80 rounded-xl p-5 space-y-3">
                <div className="h-12 w-full bg-gray-100 border border-[#fab528]/30 rounded-full flex items-center justify-center">
                  <span className="text-xs font-mono text-[#2b783c]">rounded-full (9999px)</span>
                </div>
                <p className="text-xs text-gray-600">Pill badges, status dots, avatars</p>
              </div>
            </div>
          </section>
        )}

        {/* Section: YAML Front Matter Spec */}
        {(activeTab === "all" || activeTab === "tokens") && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200/80 pb-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#2b783c]" />
                <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                  YAML Front Matter Spec (design.md Compliant)
                </h2>
              </div>
              <span className="text-xs font-mono text-gray-600">Machine-Readable Tokens</span>
            </div>

            <div className="bg-white/90 border border-gray-200/80 rounded-xl p-6 space-y-4">
              <p className="text-sm text-gray-700">
                The machine-readable YAML block defined at the header of <code className="text-[#2b783c] font-mono">DESIGN.md</code>:
              </p>
              <pre className="bg-white p-4 rounded-lg border border-gray-200 text-xs font-mono text-[#166534] overflow-x-auto">
{`---
name: Labs Design System
version: 1.0.0
tokens:
  colors:
    background: { primary: "#020617", surface: "#0f172a", surfaceHover: "#1e293b" }
    brand: { primary: "#06b6d4", accentHover: "#22d3ee" }
    text: { primary: "#f8fafc", secondary: "#94a3b8", muted: "#64748b" }
    status: { success: "#10b981", warning: "#f59e0b", destructive: "#f43f5e" }
  typography:
    fontFamily: { sans: "GeistSans, sans-serif", mono: "GeistMono, monospace" }
  spacing: { xs: "4px", sm: "8px", md: "12px", lg: "16px", xl: "24px" }
  borderRadius: { sm: "6px", md: "8px", lg: "12px", full: "9999px" }
---`}
              </pre>
            </div>
          </section>
        )}

        {/* Section 3: Component Stylings Showcase */}
        {(activeTab === "all" || activeTab === "components") && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200/80 pb-4">
              <div className="flex items-center gap-2.5">
                <Box className="w-5 h-5 text-[#2b783c]" />
                <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                  3. Component Stylings
                </h2>
              </div>
              <span className="text-xs font-mono text-gray-600">Buttons, Cards, Inputs & Badges</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Buttons Demo Card */}
              <Card className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center justify-between">
                  <span>Buttons &amp; Actions (@/components/ui/button)</span>
                  <span className="text-xs font-mono text-gray-500">Interactive</span>
                </h3>

                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary" size="sm">
                    Primary Button
                  </Button>

                  <Button variant="secondary" size="sm">
                    Secondary Button
                  </Button>

                  <Button variant="ghost" size="sm">
                    <Sparkles className="w-4 h-4" />
                  </Button>

                  <Button variant="destructive" size="sm">
                    Destructive
                  </Button>
                </div>

                <div className="p-3 bg-white rounded-lg border border-gray-200 text-xs font-mono text-gray-600">
                  <code>&lt;Button variant=&quot;primary&quot; size=&quot;sm&quot;&gt;Primary&lt;/Button&gt;</code>
                </div>
              </Card>

              {/* Form Inputs Demo Card */}
              <Card className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center justify-between">
                  <span>Form Input Component (@/components/ui/input)</span>
                  <span className="text-xs font-mono text-gray-500">Focus Ring</span>
                </h3>

                <div className="space-y-3">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter project name or search..."
                    icon={<Search className="w-4 h-4 text-gray-500" />}
                  />
                </div>

                <div className="p-3 bg-white rounded-lg border border-gray-200 text-xs font-mono text-gray-600">
                  <code>&lt;Input placeholder=&quot;Search...&quot; icon=&#123;&lt;Search /&gt;&#125; /&gt;</code>
                </div>
              </Card>

              {/* Quantity Selector Demo Card */}
              <Card className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center justify-between">
                  <span>Quantity Selector (@/components/ui/quantity-selector)</span>
                  <span className="text-xs font-mono text-gray-500">E-Commerce</span>
                </h3>

                <div className="flex items-center gap-4">
                  <QuantitySelector
                    value={1}
                    onChange={() => {}}
                    min={1}
                    max={10}
                  />
                  <span className="text-xs text-gray-600 font-mono">Increment / Decrement</span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-gray-200 text-xs font-mono text-gray-600">
                  <code>&lt;QuantitySelector value=&#123;qty&#125; onChange=&#123;setQty&#125; /&gt;</code>
                </div>
              </Card>

              {/* Breadcrumb Demo Card */}
              <Card className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center justify-between">
                  <span>Breadcrumb Component (@/components/ui/breadcrumb)</span>
                  <span className="text-xs font-mono text-gray-500">Navigation</span>
                </h3>

                <div className="pt-2">
                  <Breadcrumb
                    items={[
                      { label: "Home", href: "/" },
                      { label: "Raw Meats", href: "/#meats" },
                      { label: "British Beef Mince 500g" }
                    ]}
                  />
                </div>

                <div className="p-3 bg-white rounded-lg border border-gray-200 text-xs font-mono text-gray-600">
                  <code>&lt;Breadcrumb items=&#123;[&#123; label: &apos;Home&apos; &#125;...]&#125; /&gt;</code>
                </div>
              </Card>

              {/* Badges & Status Pills */}
              <Card className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center justify-between">
                  <span>Badges &amp; Status Pills (@/components/ui/badge)</span>
                  <span className="text-xs font-mono text-gray-500">Semantic States</span>
                </h3>

                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="active" icon={<CheckCircle2 className="w-3 h-3" />}>
                    Active / Success
                  </Badge>

                  <Badge variant="warning" icon={<AlertTriangle className="w-3 h-3" />}>
                    Pending Warning
                  </Badge>

                  <Badge variant="destructive" icon={<XCircle className="w-3 h-3" />}>
                    Destructive Error
                  </Badge>

                  <Badge variant="brand" icon={<Sparkles className="w-3 h-3" />}>
                    Brand Accent
                  </Badge>

                  <Badge variant="neutral">
                    Neutral Pill
                  </Badge>
                </div>
              </Card>

              {/* Interactive Card Example */}
              <Card interactive className="space-y-3 group">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-[#2b783c] transition-colors">
                    Interactive Card Component (@/components/ui/card)
                  </h3>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-[#2b783c] group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-sm font-normal text-gray-700 leading-relaxed">
                  Demonstrating subtle hover elevation with <code className="text-[#2b783c] font-mono">hover:border-gray-300</code> and a soft shadow.
                </p>
              </Card>

            </div>
          </section>
        )}

        {/* Section 5: Layout Principles & Elevation */}
        {(activeTab === "all" || activeTab === "components") && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200/80 pb-4">
              <div className="flex items-center gap-2.5">
                <LayoutGrid className="w-5 h-5 text-[#2b783c]" />
                <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                  5. Layout Principles & Elevation
                </h2>
              </div>
              <span className="text-xs font-mono text-gray-600">12-Column Grid & Spacing System</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/90 border border-gray-200/80 rounded-xl p-6 space-y-3">
                <h3 className="text-sm font-medium text-gray-900 flex items-center justify-between">
                  <span>Dashboard Container</span>
                  <span className="text-xs font-mono text-[#2b783c]">max-w-7xl</span>
                </h3>
                <p className="text-xs text-gray-600">Standard layout width with responsive horizontal padding (<code className="font-mono text-[#2b783c]">px-4 sm:px-6 lg:px-8</code>).</p>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#fab528] w-full"></div>
                </div>
              </div>

              <div className="bg-white/90 border border-gray-200/80 rounded-xl p-6 space-y-3">
                <h3 className="text-sm font-medium text-gray-900 flex items-center justify-between">
                  <span>Reading Container</span>
                  <span className="text-xs font-mono text-[#2b783c]">max-w-4xl</span>
                </h3>
                <p className="text-xs text-gray-600">Optimized width for documentation and long-form text readability.</p>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#fab528] w-3/4"></div>
                </div>
              </div>

              <div className="bg-white/90 border border-gray-200/80 rounded-xl p-6 space-y-3">
                <h3 className="text-sm font-medium text-gray-900 flex items-center justify-between">
                  <span>4px Grid Spacing</span>
                  <span className="text-xs font-mono text-[#2b783c]">Tailwind Multipliers</span>
                </h3>
                <p className="text-xs text-gray-600">Strict adherence to standard gap intervals: <code className="font-mono text-[#2b783c]">gap-3</code> (12px), <code className="font-mono text-[#2b783c]">gap-4</code> (16px), <code className="font-mono text-[#2b783c]">gap-6</code> (24px).</p>
                <div className="flex gap-2">
                  <div className="h-4 w-3 bg-[#fab528]/20 border border-[#fab528]/40 rounded"></div>
                  <div className="h-4 w-4 bg-[#fab528]/30 border border-[#fab528]/50 rounded"></div>
                  <div className="h-4 w-6 bg-[#fab528]/50 border border-[#fab528]/70 rounded"></div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Section 7: Do's and Don'ts */}
        {(activeTab === "all" || activeTab === "components") && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200/80 pb-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#2b783c]" />
                <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                  7. Design System Guardrails (Do&apos;s &amp; Don&apos;ts)
                </h2>
              </div>
              <span className="text-xs font-mono text-gray-600">DESIGN.md Rules</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Do's Card */}
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-medium text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>✅ Do&apos;s</span>
                </h3>
                <ul className="space-y-2.5 text-xs text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Include machine-readable YAML front matter in DESIGN.md.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Use semantic text colors (<code className="font-mono text-[#2b783c]">text-gray-900</code> for titles, <code className="font-mono text-[#2b783c]">text-gray-600</code> for subtitles).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Leverage flex/grid layouts with explicit <code className="font-mono text-[#2b783c]">gap-*</code> properties.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Add smooth micro-transitions (<code className="font-mono text-[#2b783c]">transition-all duration-200</code>) for interactive elements.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Ensure high contrast ratios for accessibility against dark backgrounds (WCAG AA).</span>
                  </li>
                </ul>
              </div>

              {/* Don'ts Card */}
              <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-medium text-rose-400 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  <span>❌ Don&apos;ts</span>
                </h3>
                <ul className="space-y-2.5 text-xs text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>DON&apos;T omit the YAML front matter header at the beginning of DESIGN.md.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>DON&apos;T use low-contrast text; use charcoal text on white surfaces and preserve clear gray borders (<code className="font-mono text-[#2b783c]">#111827</code>, <code className="font-mono text-[#2b783c]">#ffffff</code>).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>DON&apos;T mix multiple distinct accent colors arbitrarily. Use Farmart yellow as the primary accent and green for supporting emphasis.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>DON&apos;T hardcode static pixel values when Tailwind responsive utilities (<code className="font-mono text-[#2b783c]">sm:</code>, <code className="font-mono text-[#2b783c]">md:</code>, <code className="font-mono text-[#2b783c]">lg:</code>) are available.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>DON&apos;T omit focus ring indicators (<code className="font-mono text-[#2b783c]">focus:ring-2 focus:ring-[#fab528]/50</code>) on inputs and buttons.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        )}

      </main>

      {/* Render Dialog Components based on Active State */}

      {/* 1. Default Dialog */}
      <Dialog
        isOpen={activeDialog === "default"}
        onClose={() => setActiveDialog(null)}
        title="Deploy Application Update"
        description="This will deploy your latest main branch changes to the production environment."
        variant="default"
        primaryActionLabel="Confirm & Deploy"
        onPrimaryAction={() => handleSimulateAction("Deployment triggered successfully!")}
        isLoading={isLoading}
      />

      {/* 2. Success Dialog */}
      <Dialog
        isOpen={activeDialog === "success"}
        onClose={() => setActiveDialog(null)}
        title="Settings Saved Successfully"
        description="All your system configuration preferences have been saved to the cluster."
        variant="success"
        primaryActionLabel="Done"
        onPrimaryAction={() => setActiveDialog(null)}
      />

      {/* 3. Warning Dialog */}
      <Dialog
        isOpen={activeDialog === "warning"}
        onClose={() => setActiveDialog(null)}
        title="Unsaved Changes Detected"
        description="You have pending changes that will be lost if you leave this page."
        variant="warning"
        primaryActionLabel="Save & Proceed"
        onPrimaryAction={() => handleSimulateAction("Changes saved!")}
        isLoading={isLoading}
      />

      {/* 4. Destructive Dialog */}
      <Dialog
        isOpen={activeDialog === "destructive"}
        onClose={() => setActiveDialog(null)}
        title="Delete Project Cluster"
        description="This action cannot be undone. All database records and logs will be permanently deleted."
        variant="destructive"
        primaryActionLabel="Permanently Delete"
        onPrimaryAction={() => handleSimulateAction("Cluster deleted.")}
        isLoading={isLoading}
      />

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20 py-8 text-center text-xs text-gray-500">
        <p>Labs Next.js App Router • Design System specification following DESIGN.md</p>
      </footer>

    </div>
  );
}
