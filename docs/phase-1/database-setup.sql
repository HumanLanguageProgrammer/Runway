-- ============================================================
-- Operation Runway: Phase 1 Database Setup
-- Run this script in Supabase SQL Editor
-- ============================================================

-- Step 1: Create the phase_configurations table
CREATE TABLE IF NOT EXISTS phase_configurations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  config_key TEXT UNIQUE NOT NULL,
  phase TEXT NOT NULL,
  initial_gear INTEGER NOT NULL CHECK (initial_gear BETWEEN 1 AND 4),
  default_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Insert the initial check-in configuration
-- Starting with Gear 1 (Tour Bus mode)
INSERT INTO phase_configurations (config_key, phase, initial_gear, default_agent)
VALUES ('checkin', 'check-in', 1, 'concierge')
ON CONFLICT (config_key) DO UPDATE SET
  initial_gear = EXCLUDED.initial_gear,
  updated_at = NOW();

-- Step 3: Verify the setup
SELECT * FROM phase_configurations;

-- ============================================================
-- TESTING: Change initial_gear to test different configurations
-- ============================================================
--
-- To switch to Gear 2 (Free Form):
-- UPDATE phase_configurations SET initial_gear = 2, updated_at = NOW() WHERE config_key = 'checkin';
--
-- To switch to Gear 3 (Deep Dive):
-- UPDATE phase_configurations SET initial_gear = 3, updated_at = NOW() WHERE config_key = 'checkin';
--
-- To switch to Gear 4 (Voice):
-- UPDATE phase_configurations SET initial_gear = 4, updated_at = NOW() WHERE config_key = 'checkin';
--
-- To reset to Gear 1 (Tour Bus):
-- UPDATE phase_configurations SET initial_gear = 1, updated_at = NOW() WHERE config_key = 'checkin';
--
-- ============================================================
