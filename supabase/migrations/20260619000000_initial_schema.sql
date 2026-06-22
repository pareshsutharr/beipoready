-- ================================================================
-- Be IPO Ready — Initial Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ================================================================


-- ────────────────────────────────────────────────────────────────
-- 0. Shared trigger function: auto-stamp updated_at on every write
-- ────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


-- ────────────────────────────────────────────────────────────────
-- 1. profiles  (one row per auth.users row; stores admin role)
-- ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.profiles (
  id         uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role       text        NOT NULL DEFAULT 'viewer'
                         CHECK (role IN ('admin', 'viewer')),
  full_name  text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Auto-create a viewer profile whenever a new user is registered.
-- SECURITY DEFINER + empty search_path prevents search-path injection.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    'viewer'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can always read their own profile row.
-- This is also the row consulted by admin checks in other tables' policies
-- (EXISTS … WHERE profiles.id = auth.uid()), so it must be accessible.
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Role assignment is intentionally admin-only via service_role key in
-- Server Actions; no UPDATE policy is added here to avoid recursive
-- policy evaluation on the profiles table itself.

-- Explicit grants required (auto-expose was removed in April 2026).
GRANT SELECT ON public.profiles TO authenticated;


-- ────────────────────────────────────────────────────────────────
-- 2. blog_posts
-- ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text        NOT NULL,
  slug            text        NOT NULL UNIQUE,
  excerpt         text,
  body            text,                        -- Markdown
  cover_image_url text,                        -- Supabase Storage URL
  category        text        NOT NULL
                  CHECK (category IN (
                    'sme-ipo',
                    'pre-ipo-fundraising',
                    'ipo-readiness',
                    'valuation',
                    'compliance',
                    'capital-markets'
                  )),
  status          text        NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft', 'published')),
  seo_title       text,
  seo_description text,
  author_id       uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at    timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Anyone (anon + authenticated) may read published posts.
CREATE POLICY "Public can read published blog posts"
  ON public.blog_posts FOR SELECT
  USING (status = 'published');

-- Admins get unrestricted read + write over all rows (including drafts).
-- FOR ALL covers SELECT, INSERT, UPDATE, DELETE — the SELECT arm satisfies
-- Postgres's requirement that UPDATE must first pass a SELECT check.
CREATE POLICY "Admins have full access to blog_posts"
  ON public.blog_posts FOR ALL
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

GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;


-- ────────────────────────────────────────────────────────────────
-- 3. case_studies
-- ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.case_studies (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name       text        NOT NULL,
  slug               text        NOT NULL UNIQUE,
  industry           text,
  challenge          text,
  our_role           text,
  solution           text,
  outcome            text,
  ipo_size           text,                     -- e.g. "₹45 Cr"
  capital_raised     text,
  listing_results    text,                     -- e.g. "Listed at 42% premium"
  testimonial_quote  text,
  testimonial_author text,                     -- Name + title
  exchange           text,
  subscription       text,
  readiness_score    integer CHECK (readiness_score BETWEEN 0 AND 100),
  summary            text,
  approach           text[]      NOT NULL DEFAULT '{}',
  result             text,
  cover_image_url    text,
  status             text        NOT NULL DEFAULT 'draft'
                     CHECK (status IN ('draft', 'published')),
  published_at       timestamptz,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER case_studies_updated_at
  BEFORE UPDATE ON public.case_studies
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published case studies"
  ON public.case_studies FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins have full access to case_studies"
  ON public.case_studies FOR ALL
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

GRANT SELECT ON public.case_studies TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_studies TO authenticated;


-- ────────────────────────────────────────────────────────────────
-- 3b. clients
-- ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.clients (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name               text        NOT NULL,
  logo_url           text        NOT NULL,
  website_url        text,
  sort_order         integer     NOT NULL DEFAULT 0,
  is_published       boolean     NOT NULL DEFAULT true,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published clients"
  ON public.clients FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins have full access to clients"
  ON public.clients FOR ALL
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

GRANT SELECT ON public.clients TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cms-assets',
  'cms-assets',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE
SET public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

CREATE POLICY "Public can read cms assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'cms-assets');


-- ────────────────────────────────────────────────────────────────
-- 3c. testimonials
-- ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.testimonials (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name        text        NOT NULL,
  client_title       text,
  company_name       text,
  industry           text,
  image_url          text,
  quote              text        NOT NULL,
  outcome            text,
  case_study_slug    text,
  sort_order         integer     NOT NULL DEFAULT 0,
  is_published       boolean     NOT NULL DEFAULT true,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published testimonials"
  ON public.testimonials FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins have full access to testimonials"
  ON public.testimonials FOR ALL
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

GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;


-- ────────────────────────────────────────────────────────────────
-- 3c. site_stats
-- ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.site_stats (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  label        text        NOT NULL,
  value        text        NOT NULL,
  sort_order   integer     NOT NULL DEFAULT 0,
  is_published boolean     NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER site_stats_updated_at
  BEFORE UPDATE ON public.site_stats
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published site stats"
  ON public.site_stats FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins have full access to site_stats"
  ON public.site_stats FOR ALL
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

GRANT SELECT ON public.site_stats TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_stats TO authenticated;


-- ────────────────────────────────────────────────────────────────
-- 3d. site_alerts
-- ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.site_alerts (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text        NOT NULL,
  message      text        NOT NULL,
  cta_label    text,
  cta_href     text,
  placement    text        NOT NULL DEFAULT 'banner'
                           CHECK (placement IN ('banner', 'popup')),
  is_active    boolean     NOT NULL DEFAULT true,
  starts_at    timestamptz,
  ends_at      timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER site_alerts_updated_at
  BEFORE UPDATE ON public.site_alerts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.site_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active site alerts"
  ON public.site_alerts FOR SELECT
  USING (
    is_active = true
    AND (starts_at IS NULL OR starts_at <= now())
    AND (ends_at IS NULL OR ends_at >= now())
  );

CREATE POLICY "Admins have full access to site_alerts"
  ON public.site_alerts FOR ALL
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

GRANT SELECT ON public.site_alerts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_alerts TO authenticated;


-- ────────────────────────────────────────────────────────────────
-- 4. faqs
-- ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.faqs (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  question     text        NOT NULL,
  answer       text        NOT NULL,            -- Markdown ok
  category     text        NOT NULL
               CHECK (category IN (
                 'sme-ipo-eligibility',
                 'ipo-timeline',
                 'ipo-cost',
                 'pre-ipo-fundraising',
                 'valuation',
                 'compliance',
                 'documentation',
                 'investor-readiness'
               )),
  sort_order   integer     NOT NULL DEFAULT 0,  -- Display order within category
  is_published boolean     NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER faqs_updated_at
  BEFORE UPDATE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- FAQs have no draft concept visible to the public; is_published is the gate.
CREATE POLICY "Public can read published faqs"
  ON public.faqs FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins have full access to faqs"
  ON public.faqs FOR ALL
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

GRANT SELECT ON public.faqs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faqs TO authenticated;


-- ────────────────────────────────────────────────────────────────
-- 5. leads
-- ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.leads (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                 text        NOT NULL,
  email                text        NOT NULL,
  phone                text,
  company_name         text,
  service_interest     text,
  message              text,
  source               text        NOT NULL
                       CHECK (source IN (
                         'contact',
                         'readiness-tool',
                         'issue-size-calculator',
                         'home-cta',
                         'newsletter',
                         'case-study',
                         'services'
                       )),
  readiness_score      integer
                       CHECK (readiness_score BETWEEN 0 AND 100),
  issue_size_estimate  text,
  status               text        NOT NULL DEFAULT 'new'
                       CHECK (status IN ('new', 'contacted', 'qualified', 'closed')),
  notes                text,                   -- Internal admin notes only
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Unauthenticated visitors may submit the lead form.
CREATE POLICY "Anyone can submit a lead"
  ON public.leads FOR INSERT
  WITH CHECK (true);

-- Only admins may read leads (no non-admin user should ever see another lead).
CREATE POLICY "Admins can read leads"
  ON public.leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

-- UPDATE requires a matching SELECT policy — the "Admins can read leads"
-- policy above satisfies that requirement for the update path.
CREATE POLICY "Admins can update leads"
  ON public.leads FOR UPDATE
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

-- anon can INSERT (form submissions); authenticated covers admin CRUD.
GRANT INSERT ON public.leads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
