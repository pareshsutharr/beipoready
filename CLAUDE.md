@AGENTS.md

## Supabase: RLS + RETURNING interaction for anon/public inserts

When the `anon` role inserts into `leads`, `blog_posts`, or `case_studies`, **never chain `.select()` after `.insert()`** in client code, and never use `RETURNING` columns in raw SQL tests for these tables as the anon role.

**Why:** `RETURNING` (raw SQL) and `Prefer: return=representation` (PostgREST / Supabase JS `.select()`) both require SELECT privilege on the table. The `anon` role intentionally has no SELECT on `leads` (sensitive data). When SELECT is denied with RLS enabled, Postgres surfaces the error as `42501: new row violates row-level security policy` — making it look like the INSERT policy is broken when it isn't.

**Correct client pattern for lead form submission:**
```ts
// ✓ works — no .select(), no RETURNING
const { error } = await supabase.from('leads').insert({ name, email, source })

// ✗ fails with 42501 even though the INSERT policy allows it
const { data, error } = await supabase.from('leads').insert({ name, email, source }).select()
```

**Correct SQL editor test pattern (anon role):**
```sql
-- ✓ no RETURNING
BEGIN;
SET LOCAL ROLE anon;
INSERT INTO public.leads (name, email, source) VALUES ('Test', 'test@example.com', 'contact');
ROLLBACK;

-- ✗ RETURNING requires SELECT — fails with 42501 as anon
BEGIN;
SET LOCAL ROLE anon;
INSERT INTO public.leads (name, email, source) VALUES ('Test', 'test@example.com', 'contact')
RETURNING id, name, email;
ROLLBACK;
```

This applies equally to `blog_posts` and `case_studies` if the anon role ever needs INSERT on those tables.

## Typography — two fonts only

The entire site uses exactly two fonts, loaded via `next/font/google` in `src/app/layout.tsx`:

- **Hanken Grotesk** — all headings/display text. Tailwind class: `font-heading` (token `--font-heading`).
- **Montserrat** — all body text. Tailwind class: `font-sans` (token `--font-sans`, default on `<body>`).

Never introduce another font family (no `font-serif`, no inline `font-family`, no other Google fonts). Every new component must use only these two classes/tokens. Standalone generated documents (e.g. print popups) must link these same fonts explicitly.
