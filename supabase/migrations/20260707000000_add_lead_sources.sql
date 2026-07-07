-- Allow leads from the two new free tools: the Issue Cost Estimator and the
-- SME IPO Listing Checklist. Postgres auto-named the inline column CHECK
-- constraint leads_source_check.
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_source_check;

ALTER TABLE public.leads ADD CONSTRAINT leads_source_check CHECK (source IN (
  'contact',
  'readiness-tool',
  'issue-size-calculator',
  'issue-cost-estimator',
  'sme-ipo-checklist',
  'home-cta',
  'newsletter',
  'case-study',
  'services'
));
