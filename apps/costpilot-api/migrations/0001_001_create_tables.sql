-- Migration number: 0001 	 2026-05-08T14:31:19.379Z

CREATE TABLE IF NOT EXISTS audits (
  id TEXT PRIMARY KEY,
  public_id TEXT UNIQUE NOT NULL,
  tools_json TEXT NOT NULL,
  recommendations_json TEXT NOT NULL,
  monthly_savings REAL NOT NULL DEFAULT 0,
  yearly_savings REAL NOT NULL DEFAULT 0,
  summary TEXT NOT NULL DEFAULT '',
  summary_source TEXT NOT NULL DEFAULT 'fallback',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  company_name TEXT,
  role TEXT,
  team_size INTEGER,
  audit_id TEXT NOT NULL REFERENCES audits(id),
  created_at TEXT NOT NULL
);
