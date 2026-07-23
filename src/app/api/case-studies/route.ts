import { createAdminCrudHandlers } from "@/lib/api-helpers";
import { CaseStudy } from "@/models/CaseStudy";

export const { GET, POST, PUT, DELETE } = createAdminCrudHandlers(CaseStudy, { created_at: -1 });
