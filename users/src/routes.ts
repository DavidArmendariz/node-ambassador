import { Router } from "express";
import {
  Ambassadors,
  AuthenticatedUser,
  Register,
  UpdateInfo,
  UpdatePassword,
} from "./controller/auth.controller";

import { AuthMiddleware } from "./middleware/auth.middleware";

export const routes = (router: Router) => {
  router.post("/api/admin/register", Register);
  router.get("/api/admin/user", AuthMiddleware, AuthenticatedUser);
  router.put("/api/admin/users/info", AuthMiddleware, UpdateInfo);
  router.put("/api/admin/users/password", AuthMiddleware, UpdatePassword);
  router.get("/api/ambassador/user", AuthMiddleware, AuthenticatedUser);
  router.put("/api/ambassador/users/info", AuthMiddleware, UpdateInfo);
  router.put("/api/ambassador/users/password", AuthMiddleware, UpdatePassword);
  router.post("/api/ambassador/register", Register);
  router.get("/api/admin/ambassadors", AuthMiddleware, Ambassadors);
};
