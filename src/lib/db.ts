/**
 * Singleton better-sqlite3 database connection.
 * The db file is stored at the repo root so it persists across dev restarts.
 */
import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "farmart.db");

// Reuse the connection across hot-module reloads in development
declare global {
  var __db: Database.Database | undefined;
}

function openDb(): Database.Database {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  return db;
}

export const db: Database.Database =
  globalThis.__db ?? (globalThis.__db = openDb());
