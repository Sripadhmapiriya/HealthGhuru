-- ============================================================
-- HealthGhuru — Advertisement System v2 Migration
-- Run this in your Neon/Postgres console ONCE
-- ============================================================

-- 1. Extend the existing advertisements table with hospital advertiser fields
ALTER TABLE advertisements
  ADD COLUMN IF NOT EXISTS advertiser_name    TEXT,
  ADD COLUMN IF NOT EXISTS advertiser_contact TEXT,
  ADD COLUMN IF NOT EXISTS advertiser_type    TEXT CHECK (advertiser_type IN ('hospital','doctor','clinic','pharmacy')),
  ADD COLUMN IF NOT EXISTS budget             NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS start_date         DATE,
  ADD COLUMN IF NOT EXISTS end_date           DATE;

-- 2. Ad Slot Pricing table — defines the rate card per placement
CREATE TABLE IF NOT EXISTS ad_slot_pricing (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  placement        TEXT        NOT NULL UNIQUE,
  label            TEXT        NOT NULL,
  description      TEXT,
  price_per_day    NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_per_week   NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_per_month  NUMERIC(10,2) NOT NULL DEFAULT 0,
  is_available     BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Seed default pricing for each placement slot
INSERT INTO ad_slot_pricing (placement, label, description, price_per_day, price_per_week, price_per_month)
VALUES
  ('top_banner',      'Top Banner',          'Leaderboard strip (728x90) above the main navigation — maximum visibility',        500,  3000,  10000),
  ('hero_banner',     'Hero Banner',          'Wide in-feed banner (1200x250) below hero stories — prime editorial placement',   1000,  6000,  20000),
  ('sidebar',         'Sidebar Banner',       'Medium rectangle (300x250 / 300x600) in the content sidebar rail',                 300,  1800,   6000),
  ('floating_footer', 'Floating Footer Bar',  'Fixed sticky strip at the bottom of the viewport — seen on every scroll',          400,  2400,   8000),
  ('popup',           'Health Popup Modal',   'Contextual health popup with frequency capping — high engagement',                 800,  4800,  16000)
ON CONFLICT (placement) DO NOTHING;

-- 3. Sponsored Articles table — links editorial articles to hospital sponsors
CREATE TABLE IF NOT EXISTS sponsored_articles (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id           TEXT        NOT NULL,
  article_title        TEXT        NOT NULL,
  article_slug         TEXT        NOT NULL,
  advertiser_name      TEXT        NOT NULL,
  advertiser_type      TEXT        CHECK (advertiser_type IN ('hospital','doctor','clinic','pharmacy')),
  advertiser_logo_url  TEXT,
  sponsor_label        TEXT        NOT NULL DEFAULT 'Sponsored by',
  cta_text             TEXT        DEFAULT 'Learn More',
  cta_url              TEXT,
  is_active            BOOLEAN     NOT NULL DEFAULT TRUE,
  start_date           DATE,
  end_date             DATE,
  created_at           TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at           TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sponsored_articles_slug ON sponsored_articles(article_slug);
CREATE INDEX IF NOT EXISTS idx_sponsored_articles_active ON sponsored_articles(is_active);
CREATE INDEX IF NOT EXISTS idx_advertisements_advertiser ON advertisements(advertiser_name);
CREATE INDEX IF NOT EXISTS idx_advertisements_dates ON advertisements(start_date, end_date);
