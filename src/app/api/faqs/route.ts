import { createAdminCrudHandlers } from "@/lib/api-helpers";
import { Faq } from "@/models/Faq";

export const { GET, POST, PUT, DELETE } = createAdminCrudHandlers(Faq, { category: 1, sort_order: 1 });
