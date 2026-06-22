-- ================================================================
-- Be IPO Ready — CMS Content Controls
-- Apply this if the initial schema was already created before the
-- admin CMS tables/fields were added.
-- ================================================================

ALTER TABLE public.case_studies
  ADD COLUMN IF NOT EXISTS exchange text,
  ADD COLUMN IF NOT EXISTS subscription text,
  ADD COLUMN IF NOT EXISTS readiness_score integer CHECK (readiness_score BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS summary text,
  ADD COLUMN IF NOT EXISTS approach text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS result text;

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

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'clients'
      AND policyname = 'Public can read published clients'
  ) THEN
    CREATE POLICY "Public can read published clients"
      ON public.clients FOR SELECT
      USING (is_published = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'clients'
      AND policyname = 'Admins have full access to clients'
  ) THEN
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
  END IF;
END $$;

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

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'Public can read cms assets'
  ) THEN
    CREATE POLICY "Public can read cms assets"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'cms-assets');
  END IF;
END $$;

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

ALTER TABLE public.testimonials
  ADD COLUMN IF NOT EXISTS image_url text;

CREATE OR REPLACE TRIGGER testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'testimonials'
      AND policyname = 'Public can read published testimonials'
  ) THEN
    CREATE POLICY "Public can read published testimonials"
      ON public.testimonials FOR SELECT
      USING (is_published = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'testimonials'
      AND policyname = 'Admins have full access to testimonials'
  ) THEN
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
  END IF;
END $$;

GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;

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

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'site_stats'
      AND policyname = 'Public can read published site stats'
  ) THEN
    CREATE POLICY "Public can read published site stats"
      ON public.site_stats FOR SELECT
      USING (is_published = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'site_stats'
      AND policyname = 'Admins have full access to site_stats'
  ) THEN
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
  END IF;
END $$;

GRANT SELECT ON public.site_stats TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_stats TO authenticated;

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

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'site_alerts'
      AND policyname = 'Public can read active site alerts'
  ) THEN
    CREATE POLICY "Public can read active site alerts"
      ON public.site_alerts FOR SELECT
      USING (
        is_active = true
        AND (starts_at IS NULL OR starts_at <= now())
        AND (ends_at IS NULL OR ends_at >= now())
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'site_alerts'
      AND policyname = 'Admins have full access to site_alerts'
  ) THEN
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
  END IF;
END $$;

GRANT SELECT ON public.site_alerts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_alerts TO authenticated;
