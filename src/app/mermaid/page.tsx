"use client";

import { useEffect, useRef, useState } from "react";

export default function MermaidPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [diagram, setDiagram] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // 1. Fetch the mermaid syntax from the API
  useEffect(() => {
    fetch("/api/mermaid")
      .then((r) => r.json())
      .then((data) => setDiagram(data.diagram))
      .catch(() => setError("Failed to load diagram data."));
  }, []);

  // 2. Load mermaid.js from CDN and render when diagram is ready
  useEffect(() => {
    if (!diagram || !containerRef.current) return;

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";
    script.async = true;
    script.onload = () => {
      // @ts-expect-error mermaid is loaded globally from CDN
      window.mermaid.initialize({
        startOnLoad: false,
        theme: "default",
        er: { diagramPadding: 30, layoutDirection: "TB" },
      });

      const el = containerRef.current;
      if (!el) return;
      el.innerHTML = "";

      const pre = document.createElement("pre");
      pre.className = "mermaid";
      pre.textContent = diagram;
      el.appendChild(pre);

      // @ts-expect-error mermaid is loaded globally from CDN
      window.mermaid.run({ nodes: [pre] });
    };
    document.head.appendChild(script);

    return () => {
      // cleanup script tag on unmount
      document.head.removeChild(script);
    };
  }, [diagram]);

  function handleCopy() {
    if (!diagram) return;
    navigator.clipboard.writeText(diagram).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Database Schema
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Entity-Relationship diagram generated from{" "}
              <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs">
                farmart.db
              </code>
            </p>
          </div>
          <button
            onClick={handleCopy}
            disabled={!diagram}
            className="shrink-0 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copied ? "✓ Copied!" : "Copy Mermaid"}
          </button>
        </div>

        {/* Diagram */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {error && (
            <p className="text-center text-sm text-red-500">{error}</p>
          )}
          {!diagram && !error && (
            <p className="text-center text-sm text-gray-400">
              Loading diagram…
            </p>
          )}
          <div ref={containerRef} />
        </div>

        {/* Raw source */}
        {diagram && (
          <details className="mt-6">
            <summary className="cursor-pointer select-none text-sm font-medium text-gray-600 hover:text-gray-900">
              View raw Mermaid source
            </summary>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-gray-900 p-5 text-xs leading-relaxed text-gray-100">
              {diagram}
            </pre>
          </details>
        )}
      </div>
    </main>
  );
}
