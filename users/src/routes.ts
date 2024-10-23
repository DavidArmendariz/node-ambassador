import { Router } from "express";
import {
  Ambassadors,
  Register,
  RegisterExternMethod,
  UpdateInfo,
  UpdatePassword,
} from "./controller/auth.controller";

import { AuthMiddleware } from "./middleware/auth.middleware";

export const routes = (router: Router) => {
  router.post("/api/admin/register", Register);
  router.put("/api/admin/users/info", AuthMiddleware, UpdateInfo);
  router.put("/api/admin/users/password", AuthMiddleware, UpdatePassword);
  router.put("/api/ambassador/users/info", AuthMiddleware, UpdateInfo);
  router.put("/api/ambassador/users/password", AuthMiddleware, UpdatePassword);
  router.post("/api/ambassador/register", Register);
  router.post("/api/ambassador/register/extern", RegisterExternMethod);
  router.get("/api/admin/ambassadors", AuthMiddleware, Ambassadors);
};
