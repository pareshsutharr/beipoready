import { createAdminCrudHandlers } from "@/lib/api-helpers";
import { SiteAlert } from "@/models/SiteAlert";

export const { GET, POST, PUT, DELETE } = createAdminCrudHandlers(SiteAlert, { created_at: -1 });
