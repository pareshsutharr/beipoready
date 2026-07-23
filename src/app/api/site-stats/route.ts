import { createAdminCrudHandlers } from "@/lib/api-helpers";
import { SiteStat } from "@/models/SiteStat";

export const { GET, POST, PUT, DELETE } = createAdminCrudHandlers(SiteStat, { sort_order: 1 });
