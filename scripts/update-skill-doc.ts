/**
 * scripts/update-skill-doc.ts
 *
 * Scans the Farmart source tree and patches PROJECT_SKILL.md in-place.
 * Sections that are auto-managed are wrapped with HTML comment markers:
 *   <!-- SECTION_NAME --> ... <!-- /SECTION_NAME -->
 *
 * Usage:
 *   npx tsx scripts/update-skill-doc.ts
 */

import fs from "fs";
import path from "path";

// ── Config ─────────────────────────────────────────────────────────────────────

const ROOT = path.resolve(import.meta.dirname, "..");
const SKILL_DOC = path.join(ROOT, "PROJECT_SKILL.md");

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Replace the content between <!-- TAG --> and <!-- /TAG --> markers */
function patchSection(doc: string, tag: string, newContent: string): string {
  const open = `<!-- ${tag} -->`;
  const close = `<!-- /${tag} -->`;
  const openIdx = doc.indexOf(open);
  const closeIdx = doc.indexOf(close);
  if (openIdx === -1 || closeIdx === -1) return doc; // marker not found — skip
  return (
    doc.slice(0, openIdx + open.length) +
    "\n" +
    newContent +
    "\n" +
    doc.slice(closeIdx)
  );
}

/** List immediate children of a directory, returning only entries that pass the filter */
function listDir(dir: string, filter: (name: string) => boolean): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(filter);
}

/** Recursively collect all files matching an extension under a directory */
function walkFiles(dir: string, ext: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(full, ext));
    } else if (entry.name.endsWith(ext)) {
      results.push(full);
    }
  }
  return results;
}

/** Read the first JSDoc/comment line from a TS file for a short description */
function extractDescription(file: string): string {
  try {
    const lines = fs.readFileSync(file, "utf-8").split("\n").slice(0, 10);
    for (const line of lines) {
      const m = line.match(/^\s*[\/*]+\s*(.+)/);
      if (m && m[1].trim().length > 3) return m[1].trim().replace(/\*\/$/, "").trim();
    }
  } catch {
    // ignore
  }
  return "—";
}

// ── Scanners ───────────────────────────────────────────────────────────────────

/** Scan src/app/api for route.ts files and build a Markdown table */
function scanRoutes(): string {
  const apiDir = path.join(ROOT, "src", "app", "api");
  const routeFiles = walkFiles(apiDir, "route.ts").filter(
    (f) => !f.endsWith("route.test.ts")
  );

  const rows: string[] = [];

  for (const file of routeFiles) {
    const rel = path.relative(apiDir, file).replace(/\\/g, "/");
    // Derive URL path from file path
    // e.g. catalog/home/route.ts → /api/catalog/home
    const urlPath =
      "/api/" + rel.replace(/\/route\.ts$/, "").replace(/^route\.ts$/, "");

    // Detect HTTP methods exported
    const content = fs.readFileSync(file, "utf-8");
    const methods = (["GET", "POST", "PUT", "PATCH", "DELETE"] as const)
      .filter((m) => new RegExp(`export\\s+(async\\s+)?function\\s+${m}`).test(content))
      .join(", ");

    const srcPath = "src/app/api/" + rel;
    const desc = extractDescription(file);

    rows.push(`| ${methods || "?"} | \`${urlPath}\` | \`${srcPath}\` | ${desc} |`);
  }

  const header =
    "| Method | Path | File | Description |\n|---|---|---|---|";
  return header + "\n" + rows.join("\n");
}

/** Scan src/app for page.tsx files (excluding api/) and build a Markdown table */
function scanPages(): string {
  const appDir = path.join(ROOT, "src", "app");

  const pageDirs: Array<{ route: string; file: string; desc: string }> = [];

  function walk(dir: string, routePrefix: string) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      if (entry.name === "api" || entry.name.startsWith(".")) continue;
      const sub = path.join(dir, entry.name);
      const routePath = routePrefix + "/" + entry.name;
      const pageTsx = path.join(sub, "page.tsx");
      if (fs.existsSync(pageTsx)) {
        const rel = "src/app" + routePath + "/page.tsx";
        pageDirs.push({
          route: routePath,
          file: rel,
          desc: extractDescription(pageTsx),
        });
      }
      walk(sub, routePath);
    }
  }

  // Root page
  const rootPage = path.join(appDir, "page.tsx");
  if (fs.existsSync(rootPage)) {
    pageDirs.unshift({
      route: "/",
      file: "src/app/page.tsx",
      desc: extractDescription(rootPage),
    });
  }

  walk(appDir, "");

  const header = "| Route | File | Description |\n|---|---|---|";
  const rows = pageDirs.map(
    (p) => `| \`${p.route}\` | \`${p.file}\` | ${p.desc} |`
  );
  return header + "\n" + rows.join("\n");
}

/** Scan src/components/ui for .tsx files and build a Markdown table */
function scanComponents(): string {
  const uiDir = path.join(ROOT, "src", "components", "ui");
  const files = listDir(uiDir, (n) => n.endsWith(".tsx")).sort();

  const header = "| Component | File | Usage |\n|---|---|---|";
  const rows = files.map((f) => {
    const name = f.replace(/\.tsx$/, "");
    // PascalCase component name from kebab-case file name
    const componentName = name
      .split("-")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join("");
    const desc = extractDescription(path.join(uiDir, f));
    return `| \`${componentName}\` | \`${f}\` | ${desc} |`;
  });
  return header + "\n" + rows.join("\n");
}

/** Scan package.json scripts and build a Markdown table */
function scanScripts(): string {
  const pkgPath = path.join(ROOT, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8")) as {
    scripts: Record<string, string>;
  };

  const header = "| Script | Command | Description |\n|---|---|---|";
  const descriptions: Record<string, string> = {
    dev: "Dev server → http://localhost:3000",
    build: "Production build",
    "build:vercel": "Seed + build for Vercel",
    start: "Start production server",
    "db:seed": "Seed farmart.db with demo data",
    lint: "Check code style",
    "lint:fix": "Auto-fix lint + format",
    e2e: "Run E2E tests",
    "e2e:ui": "Interactive E2E mode",
    storybook: "Start Storybook",
    "build-storybook": "Build Storybook",
    "skill:update": "Scan source and update PROJECT_SKILL.md",
    "skill:watch": "Auto-update PROJECT_SKILL.md every 60 s",
  };

  const rows = Object.entries(pkg.scripts).map(([name, cmd]) => {
    const desc = descriptions[name] ?? "—";
    return `| \`${name}\` | \`${cmd.replace(/`/g, "'")}\` | ${desc} |`;
  });
  return header + "\n" + rows.join("\n");
}

// ── Main ───────────────────────────────────────────────────────────────────────

export function updateSkillDoc(): void {
  if (!fs.existsSync(SKILL_DOC)) {
    console.error(`[skill:update] ❌  ${SKILL_DOC} not found — run initial setup first`);
    process.exit(1);
  }

  let doc = fs.readFileSync(SKILL_DOC, "utf-8");

  // Update timestamp
  const now = new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC";
  doc = doc.replace(/<!-- LAST_UPDATED -->.*/, `<!-- LAST_UPDATED --> ${now}`);

  // Patch each auto-managed section
  doc = patchSection(doc, "ROUTES_TABLE", scanRoutes());
  doc = patchSection(doc, "PAGES_TABLE", scanPages());
  doc = patchSection(doc, "COMPONENTS_TABLE", scanComponents());
  doc = patchSection(doc, "SCRIPTS_TABLE", scanScripts());

  fs.writeFileSync(SKILL_DOC, doc, "utf-8");
  console.log(`[skill:update] ✅  PROJECT_SKILL.md updated at ${now}`);
}

// Run when called directly
updateSkillDoc();
