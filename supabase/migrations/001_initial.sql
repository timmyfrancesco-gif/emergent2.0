-- ============================================================
-- EMERGENT 2.0 — Supabase Database Schema
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLE: profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username    TEXT,
  email       TEXT,
  credits     DECIMAL(10, 2) NOT NULL DEFAULT 10.00,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: projects
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name        TEXT NOT NULL DEFAULT 'Nuovo Progetto',
  slug        TEXT UNIQUE,
  code        JSONB,
  published   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS projects_user_id_idx ON projects(user_id);
CREATE INDEX IF NOT EXISTS projects_slug_idx ON projects(slug) WHERE slug IS NOT NULL;

-- ============================================================
-- TABLE: messages
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id    UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content       TEXT NOT NULL,
  file_changes  JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS messages_project_id_idx ON messages(project_id);

-- ============================================================
-- ROW-LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "profiles: view own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles: update own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Projects
CREATE POLICY "projects: view own" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "projects: view published" ON projects
  FOR SELECT USING (published = TRUE);

CREATE POLICY "projects: insert own" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "projects: update own" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "projects: delete own" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- Messages
CREATE POLICY "messages: view via project" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = messages.project_id
        AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "messages: insert via project" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = messages.project_id
        AND projects.user_id = auth.uid()
    )
  );

-- ============================================================
-- TRIGGER: create profile on user signup
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, email, username, credits)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    10.00
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- TRIGGER: update updated_at timestamp
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
