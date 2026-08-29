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
);
CREATE INDEX IF NOT EXISTS idx_stories_status_created ON stories(status, created_at DESC);
PRAGMA optimize;
