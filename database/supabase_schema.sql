-- AutoMod Pro - Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Guilds table
CREATE TABLE IF NOT EXISTS guilds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guild_id TEXT UNIQUE NOT NULL,
  prefix TEXT DEFAULT '!',
  owner_overrides TEXT[] DEFAULT '{}',
  staff JSONB DEFAULT '[]',
  modules JSONB DEFAULT '{}',
  log_channels JSONB DEFAULT '{}',
  verification JSONB DEFAULT '{}',
  security JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  guild_id TEXT NOT NULL,
  warn_points INTEGER DEFAULT 0,
  history TEXT[] DEFAULT '{}',
  flags JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, guild_id)
);

-- Cases table
CREATE TABLE IF NOT EXISTS cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id TEXT UNIQUE NOT NULL,
  guild_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('auto', 'manual')),
  module TEXT,
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  target_user_id TEXT NOT NULL,
  reporter_id TEXT,
  reviewer_id TEXT,
  evidence_content TEXT,
  evidence_attachments TEXT[] DEFAULT '{}',
  confidence_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'resolved', 'dismissed', 'escalated')),
  punishment TEXT DEFAULT 'none' CHECK (punishment IN ('none', 'warn', 'mute', 'kick', 'ban')),
  rejection_reason TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media Cases table
CREATE TABLE IF NOT EXISTS media_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id TEXT UNIQUE NOT NULL,
  guild_id TEXT NOT NULL,
  uploader_id TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  security_level_at_upload TEXT NOT NULL CHECK (security_level_at_upload IN ('low', 'moderate', 'high')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewer_id TEXT,
  rejection_reason TEXT,
  relayed_message_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_guilds_guild_id ON guilds(guild_id);
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_users_guild_id ON users(guild_id);
CREATE INDEX IF NOT EXISTS idx_cases_guild_id ON cases(guild_id);
CREATE INDEX IF NOT EXISTS idx_cases_target_user_id ON cases(target_user_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_media_cases_guild_id ON media_cases(guild_id);
CREATE INDEX IF NOT EXISTS idx_media_cases_status ON media_cases(status);

-- Enable Row Level Security (optional - disable for testing)
ALTER TABLE guilds ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_cases ENABLE ROW LEVEL SECURITY;

-- Create policies for anon access (for bot testing)
CREATE POLICY "Allow anon read guilds" ON guilds FOR SELECT USING (true);
CREATE POLICY "Allow anon insert guilds" ON guilds FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update guilds" ON guilds FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete guilds" ON guilds FOR DELETE USING (true);

CREATE POLICY "Allow anon read users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow anon insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update users" ON users FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete users" ON users FOR DELETE USING (true);

CREATE POLICY "Allow anon read cases" ON cases FOR SELECT USING (true);
CREATE POLICY "Allow anon insert cases" ON cases FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update cases" ON cases FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete cases" ON cases FOR DELETE USING (true);

CREATE POLICY "Allow anon read media_cases" ON media_cases FOR SELECT USING (true);
CREATE POLICY "Allow anon insert media_cases" ON media_cases FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update media_cases" ON media_cases FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete media_cases" ON media_cases FOR DELETE USING (true);