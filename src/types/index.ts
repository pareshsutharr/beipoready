// ──────────────────────────────────────────────────────────────
// Domain types shared between the Mongoose models (src/models/*.ts)
// and the UI. Field names mirror the MongoDB document shape exactly.
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
export type OutboundEmailAudienceKind = "manual" | "leads";
export type OutboundEmailStatus = "sent" | "partial" | "failed";
export type OutboundEmailRecipientStatus = "sent" | "failed";

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
  show_in_news_alert: boolean;
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
  show_in_news_alert: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ServiceStage = {
  stage: string;
  timeframe: string;
  items: string[];
  deliverables: string[];
};

export type ServiceApproachItem = { title: string; text: string };
export type ServiceFaqItem = { q: string; a: string };

export type ServiceRecord = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  icon: string;
  cover_image_url: string | null;
  overview: string[];
  who_its_for: string[];
  process: ServiceStage[];
  timeline: string;
  approach: ServiceApproachItem[];
  faq: ServiceFaqItem[];
  status: ContentStatus;
  sort_order: number;
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
  serial_number: string | null;
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

export type OutboundEmailRecipient = {
  email: string;
  lead_source: LeadSource | string | null;
  status: OutboundEmailRecipientStatus;
  message_id: string | null;
  response: string | null;
  error: string | null;
  tracking_token: string | null;
  click_count: number;
};

export type OutboundEmailCampaign = {
  id: string;
  audience_kind: OutboundEmailAudienceKind;
  audience_label: string;
  source_filter: LeadSource | string | null;
  subject: string;
  body: string;
  format: "text" | "html";
  initiated_by_email: string;
  send_copy_to_sender: boolean;
  copy_recipient: string | null;
  copy_status: OutboundEmailRecipientStatus | null;
  copy_message_id: string | null;
  copy_response: string | null;
  copy_error: string | null;
  attempted_count: number;
  sent_count: number;
  failed_count: number;
  status: OutboundEmailStatus;
  recipients: OutboundEmailRecipient[];
  clicked_count: number;
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
