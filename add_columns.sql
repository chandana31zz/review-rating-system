-- Run this in Supabase → SQL Editor
-- Adds the extra columns your existing reviews table is missing

ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS student_name     text,
  ADD COLUMN IF NOT EXISTS college_name     text,
  ADD COLUMN IF NOT EXISTS category_ratings jsonb    DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS helpful_count    integer  DEFAULT 0,
  ADD COLUMN IF NOT EXISTS status           text     DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected'));

-- Allow public to read all reviews (admin will filter by status in the app)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Public read" ON reviews;
DROP POLICY IF EXISTS "Public insert" ON reviews;
DROP POLICY IF EXISTS "Admin update" ON reviews;
DROP POLICY IF EXISTS "Admin delete" ON reviews;

-- Re-create clean policies
CREATE POLICY "Public read"
  ON reviews FOR SELECT USING (true);

CREATE POLICY "Public insert"
  ON reviews FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin update"
  ON reviews FOR UPDATE USING (true);

CREATE POLICY "Admin delete"
  ON reviews FOR DELETE USING (true);
