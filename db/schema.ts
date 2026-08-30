export const createStoriesTable = `
CREATE TABLE IF NOT EXISTS stories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  author_user_id TEXT,
  media_key TEXT,
  media_type TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','published','rejected')),
  created_at TEXT NOT NULL,
  published_at TEXT
)
`;

export const createStatusDateIndex = `
CREATE INDEX IF NOT EXISTS idx_stories_status_created
ON stories(status, created_at DESC)
`;

export const createOperationsTable = `
CREATE TABLE IF NOT EXISTS operations_records (
  id TEXT PRIMARY KEY,
  record_type TEXT NOT NULL CHECK(record_type IN ('request','offer','reunification','map','update','organization','alert')),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  contact_name TEXT NOT NULL DEFAULT '',
  contact_email TEXT NOT NULL DEFAULT '',
  contact_phone TEXT NOT NULL DEFAULT '',
  priority TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('low','medium','high','critical')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','pending','verified','published','resolved','archived')),
  latitude REAL,
  longitude REAL,
  people_count INTEGER NOT NULL DEFAULT 0,
  source TEXT NOT NULL DEFAULT '',
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  published_at TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}'
)
`;
export const createOperationsTypeStatusIndex = `CREATE INDEX IF NOT EXISTS idx_operations_type_status_updated ON operations_records(record_type, status, updated_at DESC)`;
export const createOperationsStatusPriorityIndex = `CREATE INDEX IF NOT EXISTS idx_operations_status_priority ON operations_records(status, priority, updated_at DESC)`;
export const createAuditTable = `
CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  record_id TEXT NOT NULL,
  action TEXT NOT NULL,
  actor_email TEXT NOT NULL,
  details_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL
)
`;
export const createAuditRecordIndex = `CREATE INDEX IF NOT EXISTS idx_audit_record_created ON audit_log(record_id, created_at DESC)`;
