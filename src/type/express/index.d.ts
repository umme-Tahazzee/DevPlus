import type { UserPayload } from "../../middleware/auth.ts";

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export {};