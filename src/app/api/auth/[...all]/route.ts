import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/modules/auth/config";

export const runtime = "nodejs";
export const { GET, POST, PATCH, PUT, DELETE } = toNextJsHandler(auth);
