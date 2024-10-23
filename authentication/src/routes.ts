import { Router } from "express";
import {
  Login,
  Logout,
  LoginExternal,
  AuthenticatedUser,
} from "./controller/auth.controller";
import { AuthMiddleware } from "./middleware/auth.middleware";

export const routes = (router: Router) => {
  router.post("/api/admin/login", Login);
  router.post("/api/admin/logout", Logout);
  router.get("/api/admin/user", AuthMiddleware, AuthenticatedUser);
  router.post("/api/ambassador/login", Login);
  router.post("/api/ambassador/loginExternal", LoginExternal);
  router.post("/api/ambassador/logout", Logout);
  router.get("/api/ambassador/user", AuthMiddleware, AuthenticatedUser);
};
