-- ────────────────────────────────────────────────────────────────
-- Extend "Get Listed" eligibility submissions with the full
-- NSE EMERGE / BSE SME rules-engine questionnaire.
--
-- Existing columns (organization_name, incorporation_date,
-- operational_years, is_three_years_old, has_min_operating_profit,
-- ofs_compliant, net_worth, paid_up_capital, net_tangible_assets,
-- fund_purposes, fund_purpose_other, financials_file_path,
-- contact_details, email, website, status) are kept and populated
-- with best-fit derived values so /admin/eligibility keeps working
-- unchanged. The columns below hold the richer detail the new form
-- collects, plus the computed per-exchange verdicts.
-- ────────────────────────────────────────────────────────────────

ALTER TABLE public.eligibility_submissions
  ADD COLUMN IF NOT EXISTS industry     text,
  ADD COLUMN IF NOT EXISTS designation  text,
  ADD COLUMN IF NOT EXISTS notes        text,
  ADD COLUMN IF NOT EXISTS nse_status   text
    CHECK (nse_status IN ('pass', 'fail', 'flag', 'pending')),
  ADD COLUMN IF NOT EXISTS bse_status   text
    CHECK (bse_status IN ('pass', 'fail', 'flag', 'pending')),
  ADD COLUMN IF NOT EXISTS answers      jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS checks       jsonb NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.eligibility_submissions.answers IS
  'Full raw answers to the NSE EMERGE / BSE SME eligibility questionnaire, keyed by question id.';
COMMENT ON COLUMN public.eligibility_submissions.checks IS
  'Computed rule-by-rule results at submission time: [{ id, label, exchanges, status, message }].';
COMMENT ON COLUMN public.eligibility_submissions.nse_status IS
  'Overall computed NSE EMERGE verdict at submission time: pass / fail / flag (pass with disclosures) / pending (not enough answers).';
COMMENT ON COLUMN public.eligibility_submissions.bse_status IS
  'Overall computed BSE SME verdict at submission time: pass / fail / flag (pass with disclosures) / pending (not enough answers).';
