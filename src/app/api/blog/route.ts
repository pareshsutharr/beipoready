import { createAdminCrudHandlers } from "@/lib/api-helpers";
import { BlogPost } from "@/models/BlogPost";

export const { GET, POST, PUT, DELETE } = createAdminCrudHandlers(BlogPost, { created_at: -1 });
