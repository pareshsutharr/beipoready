-- ────────────────────────────────────────────────────────────────
-- "Get Listed" IPO eligibility form submissions
-- Public form at /get-listed; admins review at /admin/eligibility.
-- ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.eligibility_submissions (
  id                        uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_name         text        NOT NULL,
  incorporation_date        date,
  operational_years         integer,
  is_three_years_old        boolean,
  has_min_operating_profit  boolean,    -- EBITDA > ₹1 Cr in any 2 of last 3 FYs
  ofs_compliant             boolean,    -- OFS ≤ 20% of issue; sellers ≤ 50% of holding
  net_worth                 text,       -- free-form INR amounts as entered
  paid_up_capital           text,
  net_tangible_assets       text,
  fund_purposes             text[],     -- Expansion / Working Capital / Debt Repayment / Other
  fund_purpose_other        text,
  financials_file_path      text,       -- storage path in eligibility-docs bucket
  contact_details           text,
  email                     text        NOT NULL,
  website                   text,
  status                    text        NOT NULL DEFAULT 'new'
                            CHECK (status IN ('new', 'reviewed', 'contacted', 'closed')),
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER eligibility_submissions_updated_at
  BEFORE UPDATE ON public.eligibility_submissions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.eligibility_submissions ENABLE ROW LEVEL SECURITY;

-- Unauthenticated visitors may submit the form (no SELECT — same pattern as leads).
CREATE POLICY "Anyone can submit an eligibility form"
  ON public.eligibility_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read eligibility submissions"
  ON public.eligibility_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update eligibility submissions"
  ON public.eligibility_submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

GRANT INSERT ON public.eligibility_submissions TO anon;
GRANT SELECT, INSERT, UPDATE ON public.eligibility_submissions TO authenticated;

-- Private bucket for uploaded audited financial statements.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'eligibility-docs',
  'eligibility-docs',
  false,
  10485760, -- 10 MB
  ARRAY[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'image/jpeg',
    'image/png',
    'application/zip'
  ]
)
ON CONFLICT (id) DO UPDATE
SET public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- Visitors may upload documents with their submission; only admins may read them.
CREATE POLICY "Anyone can upload eligibility docs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'eligibility-docs');

CREATE POLICY "Admins can read eligibility docs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'eligibility-docs'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );
