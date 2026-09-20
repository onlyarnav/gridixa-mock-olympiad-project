declare module "*/models/user" {
  const User: any;
  export default User;
}

declare module "*/middleware/auth" {
  import { RequestHandler } from "express";
  export const authMiddleware: RequestHandler;
}

