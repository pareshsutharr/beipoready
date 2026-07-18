-- Flags blog posts / case studies for inclusion in the site's "News & Alerts" popup.
alter table public.blog_posts
  add column if not exists show_in_news_alert boolean not null default false;

alter table public.case_studies
  add column if not exists show_in_news_alert boolean not null default false;
