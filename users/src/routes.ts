import { Router } from "express";
import {
  AuthenticatedUser,
  Login,
  Register,
  UpdateInfo,
  UpdatePassword,
} from "./controller/auth.controller";
import { AuthMiddleware } from "./middleware/auth.middleware";

export const routes = (router: Router) => {
  router.post("/api/ambassador/register", Register);
  router.get("/api/ambassador/user", AuthMiddleware, AuthenticatedUser);
  router.put("/api/ambassador/users/info", AuthMiddleware, UpdateInfo);
  router.put("/api/ambassador/users/password", AuthMiddleware, UpdatePassword);
};
