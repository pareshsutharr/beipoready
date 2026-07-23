import { createAdminCrudHandlers } from "@/lib/api-helpers";
import { Client } from "@/models/Client";

export const { GET, POST, PUT, DELETE } = createAdminCrudHandlers(Client, { sort_order: 1 });
