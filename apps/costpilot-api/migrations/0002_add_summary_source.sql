-- Migration number: 0002
ALTER TABLE audits ADD COLUMN summary_source TEXT NOT NULL DEFAULT 'fallback';
