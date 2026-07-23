import { createAdminCrudHandlers } from "@/lib/api-helpers";
import { Testimonial } from "@/models/Testimonial";

export const { GET, POST, PUT, DELETE } = createAdminCrudHandlers(Testimonial, { sort_order: 1 });
