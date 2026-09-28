import type { Metadata } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import { toPlainArray } from "@/lib/serialize";
import { Service } from "@/models/Service";
import { SERVICE_ICON_OPTIONS } from "@/lib/service-icons";
import {
  Checkbox,
  Field,
  ImagePreview,
  PageHeader,
  Select,
  SubmitRow,
  TextArea,
  cardClass,
  statuses,
} from "@/components/admin/cms/FormControls";
import { ImageUploadField } from "@/components/admin/cms/ImageUploadField";
import { deleteService, saveService } from "../cms/actions";
import type { ServiceRecord } from "@/types";

export const metadata: Metadata = { title: "Services - Be IPO Ready Admin" };

function linesToText(items: string[]) {
  return items.join("\n");
}

function approachToText(items: ServiceRecord["approach"]) {
  return items.map((item) => `${item.title} :: ${item.text}`).join("\n");
}

function faqToText(items: ServiceRecord["faq"]) {
  return items.map((item) => `Q: ${item.q}\nA: ${item.a}`).join("\n\n");
}

function processToText(stages: ServiceRecord["process"]) {
  return stages
    .map(
      (stage) =>
        `Stage: ${stage.stage}\nTimeframe: ${stage.timeframe}\nItems: ${stage.items.join(" | ")}\nDeliverables: ${stage.deliverables.join(" | ")}`
    )
    .join("\n\n");
}

const OVERVIEW_PLACEHOLDER = "One paragraph per line. These render as the intro copy on the service page.";
const WHO_ITS_FOR_PLACEHOLDER = "One bullet per line, e.g.\nGrowth-stage companies seeking growth capital\nPromoters looking for equity dilution at a fair valuation";
const APPROACH_PLACEHOLDER = "One item per line as: Title :: Description\ne.g.\nStory first, numbers next :: Investors back narratives supported by data.";
const FAQ_PLACEHOLDER = "Blocks of Q: / A:, separated by a blank line\ne.g.\nQ: How do you charge?\nA: A retainer plus a success fee on closing.";
const PROCESS_PLACEHOLDER =
  "Blocks separated by a blank line, each with Stage/Timeframe/Items/Deliverables lines (Items and Deliverables separated by |)\ne.g.\nStage: Readiness & Positioning\nTimeframe: Weeks 1-3\nItems: Business and financial diagnostic | Capital requirement assessment\nDeliverables: Investment Teaser | Pitch Deck";

export default async function ServicesPage() {
  await connectToDatabase();
  const services = toPlainArray(
    await Service.find().sort({ sort_order: 1, title: 1 }).lean()
  ) as unknown as ServiceRecord[];

  return (
    <div className="p-8">
      <PageHeader
        eyebrow="Content"
        title="Services"
        description="Manage the service pages shown under /services. Published services appear on the public site after save."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total services</p>
          <p className="mt-1 text-2xl font-bold text-brand-navy">{services.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Published</p>
          <p className="mt-1 text-2xl font-bold text-brand-navy">
            {services.filter((service) => service.status === "published").length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Drafts</p>
          <p className="mt-1 text-2xl font-bold text-brand-navy">
            {services.filter((service) => service.status === "draft").length}
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <form action={saveService} className={cardClass}>
          <h2 className="mb-4 font-heading text-lg font-bold text-brand-navy">New Service</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            <Field label="Title" name="title" required />
            <Field label="Slug" name="slug" placeholder="auto-created if blank" />
            <Field label="Tagline" name="tagline" placeholder="Short line shown under the title in the hero" />
            <Field label="Card Summary" name="summary" placeholder="Short blurb shown on the /services listing card" />
            <Select label="Icon" name="icon" options={SERVICE_ICON_OPTIONS} />
            <Select label="Status" name="status" options={statuses} />
            <Field label="Cover Image URL" name="cover_image_url" placeholder="https://... (or upload below)" hint="Direct image link only, not a share/viewer page (e.g. not an ibb.co page link)." />
            <ImageUploadField label="Or Upload Cover Image" name="cover_image_file" />
            <Field label="Sort Order" name="sort_order" type="number" defaultValue={0} />
            <Field label="Timeline" name="timeline" placeholder="e.g. A typical engagement takes 4 to 6 months..." />
          </div>
          <div className="mt-4 grid gap-4">
            <TextArea label="Overview" name="overview" rows={4} placeholder={OVERVIEW_PLACEHOLDER} />
            <TextArea label="Who It's For" name="who_its_for" rows={4} placeholder={WHO_ITS_FOR_PLACEHOLDER} />
            <TextArea label="Process Stages" name="process" rows={8} placeholder={PROCESS_PLACEHOLDER} />
            <TextArea label="Our Approach" name="approach" rows={4} placeholder={APPROACH_PLACEHOLDER} />
            <TextArea label="FAQs" name="faq" rows={6} placeholder={FAQ_PLACEHOLDER} />
            <Checkbox label="Email this published service update to all active subscribers" name="send_to_subscribers" />
          </div>
          <SubmitRow saveLabel="Publish / Save" />
        </form>

        {services.map((service) => (
          <form key={service.id} action={saveService} className={cardClass}>
            <input type="hidden" name="id" value={service.id} />
            <input type="hidden" name="current_cover_image_url" value={service.cover_image_url ?? ""} />
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="font-heading text-lg font-bold text-brand-navy">{service.title}</h2>
                <p className="mt-1 text-xs text-slate-400">/services/{service.slug}</p>
              </div>
              <span className="self-start rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {service.status}
              </span>
            </div>
            <ImagePreview url={service.cover_image_url} label={`${service.title} cover image`} />
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <Field label="Title" name="title" defaultValue={service.title} required />
              <Field label="Slug" name="slug" defaultValue={service.slug} />
              <Field label="Tagline" name="tagline" defaultValue={service.tagline} />
              <Field label="Card Summary" name="summary" defaultValue={service.summary} />
              <Select label="Icon" name="icon" defaultValue={service.icon} options={SERVICE_ICON_OPTIONS} />
              <Select label="Status" name="status" defaultValue={service.status} options={statuses} />
              <Field label="Cover Image URL" name="cover_image_url" defaultValue={service.cover_image_url} hint="Direct image link only, not a share/viewer page (e.g. not an ibb.co page link)." />
              <ImageUploadField label="Replace Cover Image" name="cover_image_file" />
              <Field label="Sort Order" name="sort_order" type="number" defaultValue={service.sort_order} />
              <Field label="Timeline" name="timeline" defaultValue={service.timeline} />
            </div>
            <div className="mt-4 grid gap-4">
              <TextArea label="Overview" name="overview" defaultValue={linesToText(service.overview)} rows={4} placeholder={OVERVIEW_PLACEHOLDER} />
              <TextArea label="Who It's For" name="who_its_for" defaultValue={linesToText(service.who_its_for)} rows={4} placeholder={WHO_ITS_FOR_PLACEHOLDER} />
              <TextArea label="Process Stages" name="process" defaultValue={processToText(service.process)} rows={8} placeholder={PROCESS_PLACEHOLDER} />
              <TextArea label="Our Approach" name="approach" defaultValue={approachToText(service.approach)} rows={4} placeholder={APPROACH_PLACEHOLDER} />
              <TextArea label="FAQs" name="faq" defaultValue={faqToText(service.faq)} rows={6} placeholder={FAQ_PLACEHOLDER} />
              <Checkbox label="Email this published service update to all active subscribers" name="send_to_subscribers" />
            </div>
            <SubmitRow deleteAction={deleteService} id={service.id} />
          </form>
        ))}
      </div>
    </div>
  );
}
