import type { ReactNode } from 'react';

export function DocsCanvas({
  title,
  source,
  summary,
  children,
}: {
  title: string;
  source: string;
  summary: string;
  children: ReactNode;
}) {
  return (
    <article className="min-h-[720px] bg-[#fcfcfc] px-6 py-12 text-gray-900 sm:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <header className="space-y-3 border-b border-gray-200 pb-8">
          <p className="font-mono text-xs text-[#2b783c]">{source}</p>
          <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-gray-600">{summary}</p>
        </header>
        {children}
      </div>
    </article>
  );
}

export function DocsSection({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {note ? <p className="text-xs text-gray-500">{note}</p> : null}
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xs sm:p-10">{children}</div>
    </section>
  );
}
