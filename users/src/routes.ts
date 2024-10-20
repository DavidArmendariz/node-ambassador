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
  router.post("/api/users/admin/register", Register);
  router.get("/api/users/admin/user", AuthMiddleware, AuthenticatedUser);
  router.put("/api/users/admin/users/info", AuthMiddleware, UpdateInfo);
  router.put("/api/users/admin/users/password", AuthMiddleware, UpdatePassword);
  router.get("/api/users/ambassador/user", AuthMiddleware, AuthenticatedUser);
  router.put("/api/users/ambassador/users/info", AuthMiddleware, UpdateInfo);
  router.put(
    "/api/users/ambassador/users/password",
    AuthMiddleware,
    UpdatePassword
  );
  router.post("/api/users/ambassador/register", Register);
  router.get("/api/admin/ambassadors", AuthMiddleware, Ambassadors);
};
