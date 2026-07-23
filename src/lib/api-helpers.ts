import { NextResponse } from "next/server";
import type { Model } from "mongoose";
import { getAdminSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { toPlain, toPlainArray } from "@/lib/serialize";

type SortSpec = Record<string, 1 | -1>;

/**
 * Builds the admin-protected GET/POST/PUT/DELETE handlers for a single
 * Mongoose model, shared by the /api/{blog,case-studies,faqs,...} REST
 * routes required by the migration spec. All CMS admin-UI mutations go
 * through the Server Actions in admin/cms/actions.ts instead; this is
 * the independent REST surface.
 */
export function createAdminCrudHandlers<T>(model: Model<T>, defaultSort: SortSpec) {
  async function requireAdmin() {
    return getAdminSession();
  }

  async function GET() {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    await connectToDatabase();
    const docs = await model.find().sort(defaultSort).lean();
    return NextResponse.json({ data: toPlainArray(docs as never[]) });
  }

  async function POST(request: Request) {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    await connectToDatabase();

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const payload = { ...(body as Record<string, unknown>) };
    delete payload.id;
    try {
      const doc = await model.create(payload as Parameters<typeof model.create>[0]);
      return NextResponse.json({ data: toPlain(doc.toObject() as never) }, { status: 201 });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create document.";
      return NextResponse.json({ error: message }, { status: 400 });
    }
  }

  async function PUT(request: Request) {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    await connectToDatabase();

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object" || typeof (body as { id?: unknown }).id !== "string") {
      return NextResponse.json({ error: "Missing document id." }, { status: 400 });
    }

    const { id, ...payload } = body as { id: string } & Record<string, unknown>;
    try {
      const doc = await model
        .findByIdAndUpdate(id, payload as Parameters<typeof model.findByIdAndUpdate>[1], { new: true })
        .lean();
      if (!doc) return NextResponse.json({ error: "Not found." }, { status: 404 });
      return NextResponse.json({ data: toPlain(doc as never) });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update document.";
      return NextResponse.json({ error: message }, { status: 400 });
    }
  }

  async function DELETE(request: Request) {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id query parameter." }, { status: 400 });

    const doc = await model.findByIdAndDelete(id).lean();
    if (!doc) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ data: { id } });
  }

  return { GET, POST, PUT, DELETE };
}
