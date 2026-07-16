// ──────────────────────────────────────────────────────────────
// Supabase database types (hand-authored until supabase gen types
// is run against a live project).
// ──────────────────────────────────────────────────────────────

export type BlogCategory =
  | "sme-ipo"
  | "pre-ipo-fundraising"
  | "ipo-readiness"
  | "valuation"
  | "compliance"
  | "capital-markets";

export type ContentStatus = "draft" | "published";

export type FaqCategory =
  | "sme-ipo-eligibility"
  | "ipo-timeline"
  | "ipo-cost"
  | "pre-ipo-fundraising"
  | "valuation"
  | "compliance"
  | "documentation"
  | "investor-readiness";

export type LeadSource =
  | "contact"
  | "readiness-tool"
  | "issue-size-calculator"
  | "issue-cost-estimator"
  | "sme-ipo-checklist"
  | "home-cta"
  | "newsletter"
  | "case-study"
  | "services";

export type LeadStatus = "new" | "contacted" | "qualified" | "closed";

export type SiteAlertPlacement = "banner" | "popup";

export type UserRole = "admin" | "viewer";

// ──────────────────────────────────────────────────────────────
// Row shapes (mirrors the SQL schema exactly)
// ──────────────────────────────────────────────────────────────

export type Profile = {
  id: string;
  role: UserRole;
  full_name: string | null;
  created_at: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  cover_image_url: string | null;
  category: BlogCategory;
  status: ContentStatus;
  seo_title: string | null;
  seo_description: string | null;
  author_id: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CaseStudy = {
  id: string;
  company_name: string;
  slug: string;
  industry: string | null;
  challenge: string | null;
  our_role: string | null;
  solution: string | null;
  outcome: string | null;
  ipo_size: string | null;
  capital_raised: string | null;
  listing_results: string | null;
  testimonial_quote: string | null;
  testimonial_author: string | null;
  exchange: string | null;
  subscription: string | null;
  readiness_score: number | null;
  summary: string | null;
  approach: string[];
  result: string | null;
  cover_image_url: string | null;
  status: ContentStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Testimonial = {
  id: string;
  client_name: string;
  client_title: string | null;
  company_name: string | null;
  industry: string | null;
  image_url: string | null;
  quote: string;
  outcome: string | null;
  case_study_slug: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type ClientLogo = {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
  nature_of_business: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type SiteStat = {
  id: string;
  label: string;
  value: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type SiteAlert = {
  id: string;
  title: string;
  message: string;
  cta_label: string | null;
  cta_href: string | null;
  placement: SiteAlertPlacement;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
  service_interest: string | null;
  message: string | null;
  source: LeadSource;
  readiness_score: number | null;
  issue_size_estimate: string | null;
  status: LeadStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type EligibilityStatus = "new" | "reviewed" | "contacted" | "closed";

export type RuleStatus = "pass" | "fail" | "flag" | "pending";

export type EligibilityCheckResult = {
  id: string;
  label: string;
  exchanges: ("nse" | "bse")[];
  status: RuleStatus;
  message: string;
};

export type EligibilitySubmission = {
  id: string;
  organization_name: string;
  incorporation_date: string | null;
  operational_years: number | null;
  is_three_years_old: boolean | null;
  has_min_operating_profit: boolean | null;
  ofs_compliant: boolean | null;
  net_worth: string | null;
  paid_up_capital: string | null;
  net_tangible_assets: string | null;
  fund_purposes: string[] | null;
  fund_purpose_other: string | null;
  financials_file_path: string | null;
  contact_details: string | null;
  email: string;
  website: string | null;
  industry: string | null;
  designation: string | null;
  notes: string | null;
  nse_status: RuleStatus | null;
  bse_status: RuleStatus | null;
  answers: Record<string, unknown>;
  checks: EligibilityCheckResult[];
  status: EligibilityStatus;
  created_at: string;
  updated_at: string;
};

// ──────────────────────────────────────────────────────────────
// Minimal Database type for the Supabase client generic.
// Replace with the output of `supabase gen types` once the
// project is linked to a live Supabase instance.
// ──────────────────────────────────────────────────────────────

// ──────────────────────────────────────────────────────────────
// Database type, must satisfy GenericSchema from @supabase/postgrest-js:
//   Tables: each entry needs Row, Insert, Update, Relationships
//   Plus top-level Views and Functions keys on the public schema.
// Without these, Database["public"] doesn't extend GenericSchema and
// supabase.from("table").insert() resolves to `never`.
// ──────────────────────────────────────────────────────────────

// Insert variants mirror Supabase generated types: columns with SQL DEFAULTs
// and nullable columns are optional for callers.

type ProfileInsert = {
  id: string;
  role?: UserRole;
  full_name?: string | null;
  created_at?: string;
};

type BlogPostInsert = {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  body?: string | null;
  cover_image_url?: string | null;
  category: BlogCategory;
  status?: ContentStatus;
  seo_title?: string | null;
  seo_description?: string | null;
  author_id?: string | null;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

type CaseStudyInsert = {
  id?: string;
  company_name: string;
  slug: string;
  industry?: string | null;
  challenge?: string | null;
  our_role?: string | null;
  solution?: string | null;
  outcome?: string | null;
  ipo_size?: string | null;
  capital_raised?: string | null;
  listing_results?: string | null;
  testimonial_quote?: string | null;
  testimonial_author?: string | null;
  exchange?: string | null;
  subscription?: string | null;
  readiness_score?: number | null;
  summary?: string | null;
  approach?: string[];
  result?: string | null;
  cover_image_url?: string | null;
  status?: ContentStatus;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

type TestimonialInsert = {
  id?: string;
  client_name: string;
  client_title?: string | null;
  company_name?: string | null;
  industry?: string | null;
  image_url?: string | null;
  quote: string;
  outcome?: string | null;
  case_study_slug?: string | null;
  sort_order?: number;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
};

type ClientLogoInsert = {
  id?: string;
  name: string;
  logo_url: string;
  website_url?: string | null;
  nature_of_business?: string | null;
  sort_order?: number;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
};

type SiteStatInsert = {
  id?: string;
  label: string;
  value: string;
  sort_order?: number;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
};

type SiteAlertInsert = {
  id?: string;
  title: string;
  message: string;
  cta_label?: string | null;
  cta_href?: string | null;
  placement?: SiteAlertPlacement;
  is_active?: boolean;
  starts_at?: string | null;
  ends_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

type FaqInsert = {
  id?: string;
  question: string;
  answer: string;
  category: FaqCategory;
  sort_order?: number;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
};

type EligibilitySubmissionInsert = {
  id?: string;
  organization_name: string;
  incorporation_date?: string | null;
  operational_years?: number | null;
  is_three_years_old?: boolean | null;
  has_min_operating_profit?: boolean | null;
  ofs_compliant?: boolean | null;
  net_worth?: string | null;
  paid_up_capital?: string | null;
  net_tangible_assets?: string | null;
  fund_purposes?: string[] | null;
  fund_purpose_other?: string | null;
  financials_file_path?: string | null;
  contact_details?: string | null;
  email: string;
  website?: string | null;
  industry?: string | null;
  designation?: string | null;
  notes?: string | null;
  nse_status?: RuleStatus | null;
  bse_status?: RuleStatus | null;
  answers?: Record<string, unknown>;
  checks?: EligibilityCheckResult[];
  status?: EligibilityStatus;
  created_at?: string;
  updated_at?: string;
};

type LeadInsert = {
  id?: string;
  name: string;
  email: string;
  phone?: string | null;
  company_name?: string | null;
  service_interest?: string | null;
  message?: string | null;
  source: LeadSource;
  readiness_score?: number | null;
  issue_size_estimate?: string | null;
  status?: LeadStatus;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: Partial<Omit<Profile, "id" | "created_at">>;
        Relationships: [];
      };
      blog_posts: {
        Row: BlogPost;
        Insert: BlogPostInsert;
        Update: Partial<Omit<BlogPost, "id" | "created_at">>;
        Relationships: [];
      };
      case_studies: {
        Row: CaseStudy;
        Insert: CaseStudyInsert;
        Update: Partial<Omit<CaseStudy, "id" | "created_at">>;
        Relationships: [];
      };
      testimonials: {
        Row: Testimonial;
        Insert: TestimonialInsert;
        Update: Partial<Omit<Testimonial, "id" | "created_at">>;
        Relationships: [];
      };
      clients: {
        Row: ClientLogo;
        Insert: ClientLogoInsert;
        Update: Partial<Omit<ClientLogo, "id" | "created_at">>;
        Relationships: [];
      };
      site_stats: {
        Row: SiteStat;
        Insert: SiteStatInsert;
        Update: Partial<Omit<SiteStat, "id" | "created_at">>;
        Relationships: [];
      };
      site_alerts: {
        Row: SiteAlert;
        Insert: SiteAlertInsert;
        Update: Partial<Omit<SiteAlert, "id" | "created_at">>;
        Relationships: [];
      };
      faqs: {
        Row: Faq;
        Insert: FaqInsert;
        Update: Partial<Omit<Faq, "id" | "created_at">>;
        Relationships: [];
      };
      leads: {
        Row: Lead;
        Insert: LeadInsert;
        Update: Partial<Omit<Lead, "id" | "created_at">>;
        Relationships: [];
      };
      eligibility_submissions: {
        Row: EligibilitySubmission;
        Insert: EligibilitySubmissionInsert;
        Update: Partial<Omit<EligibilitySubmission, "id" | "created_at">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
