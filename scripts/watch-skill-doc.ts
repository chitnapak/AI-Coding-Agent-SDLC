/**
 * scripts/watch-skill-doc.ts
 *
 * Runs update-skill-doc.ts every 60 seconds.
 * Logs each cycle with a timestamp.
 *
 * Usage:
 *   npx tsx scripts/watch-skill-doc.ts
 *
 * Press Ctrl+C to stop.
 */

import { updateSkillDoc } from "./update-skill-doc.js";

const INTERVAL_MS = 60_000; // 1 minute

function timestamp(): string {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

async function tick() {
  try {
    updateSkillDoc();
  } catch (err) {
    console.error(`[skill:watch] ❌  Error during update:`, err);
  }
}

// Run once immediately on startup
console.log(`[skill:watch] 🚀  Starting — will update PROJECT_SKILL.md every ${INTERVAL_MS / 1000}s`);
console.log(`[skill:watch]     Press Ctrl+C to stop.\n`);
await tick();

// Then loop every INTERVAL_MS
setInterval(async () => {
  console.log(`\n[skill:watch] ⏱  ${timestamp()} — running update...`);
  await tick();
}, INTERVAL_MS);

// Keep the process alive and handle graceful shutdown
process.on("SIGINT", () => {
  console.log(`\n[skill:watch] 👋  Stopped.`);
  process.exit(0);
});
process.on("SIGTERM", () => {
  console.log(`\n[skill:watch] 👋  Stopped.`);
  process.exit(0);
});
