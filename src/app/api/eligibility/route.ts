import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { EligibilitySubmission } from "@/models/EligibilitySubmission";
import { saveEligibilityFile } from "@/lib/upload";
import type { EligibilityCheckResult, RuleStatus } from "@/types";

const ACCEPTED_EXTENSIONS = [".pdf", ".xls", ".xlsx", ".jpg", ".jpeg", ".png", ".zip"];

type EligibilityPayload = {
  organization_name?: unknown;
  incorporation_date?: unknown;
  operational_years?: unknown;
  is_three_years_old?: unknown;
  has_min_operating_profit?: unknown;
  ofs_compliant?: unknown;
  net_worth?: unknown;
  paid_up_capital?: unknown;
  net_tangible_assets?: unknown;
  fund_purposes?: unknown;
  fund_purpose_other?: unknown;
  contact_details?: unknown;
  email?: unknown;
  website?: unknown;
  industry?: unknown;
  designation?: unknown;
  notes?: unknown;
  nse_status?: unknown;
  bse_status?: unknown;
  answers?: unknown;
  checks?: unknown;
};

function stringOrNull(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function boolOrNull(value: unknown) {
  return typeof value === "boolean" ? value : null;
}

function numberOrNull(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function ruleStatusOrNull(value: unknown): RuleStatus | null {
  return value === "pass" || value === "fail" || value === "flag" || value === "pending" ? value : null;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const payloadRaw = formData.get("payload");
    const payload = (typeof payloadRaw === "string" ? JSON.parse(payloadRaw) : null) as EligibilityPayload | null;

    const organizationName = stringOrNull(payload?.organization_name);
    const email = stringOrNull(payload?.email);
    if (!payload || !organizationName || !email) {
      return NextResponse.json({ error: "organization_name and email are required." }, { status: 400 });
    }

    const file = formData.get("file");
    let financialsFilePath: string | null = null;
    if (file instanceof File && file.size > 0) {
      const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
      if (!ACCEPTED_EXTENSIONS.includes(extension)) {
        return NextResponse.json({ error: "Unsupported file type." }, { status: 400 });
      }
      financialsFilePath = await saveEligibilityFile(file);
    }

    await connectToDatabase();
    await EligibilitySubmission.create({
      organization_name: organizationName,
      incorporation_date: stringOrNull(payload.incorporation_date),
      operational_years: numberOrNull(payload.operational_years),
      is_three_years_old: boolOrNull(payload.is_three_years_old),
      has_min_operating_profit: boolOrNull(payload.has_min_operating_profit),
      ofs_compliant: boolOrNull(payload.ofs_compliant),
      net_worth: stringOrNull(payload.net_worth),
      paid_up_capital: stringOrNull(payload.paid_up_capital),
      net_tangible_assets: stringOrNull(payload.net_tangible_assets),
      fund_purposes: Array.isArray(payload.fund_purposes) ? payload.fund_purposes : null,
      fund_purpose_other: stringOrNull(payload.fund_purpose_other),
      financials_file_path: financialsFilePath,
      contact_details: stringOrNull(payload.contact_details),
      email,
      website: stringOrNull(payload.website),
      industry: stringOrNull(payload.industry),
      designation: stringOrNull(payload.designation),
      notes: stringOrNull(payload.notes),
      nse_status: ruleStatusOrNull(payload.nse_status),
      bse_status: ruleStatusOrNull(payload.bse_status),
      answers: payload.answers ?? {},
      checks: Array.isArray(payload.checks) ? (payload.checks as EligibilityCheckResult[]) : [],
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
