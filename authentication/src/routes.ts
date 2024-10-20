import { Router } from "express";
import { Login, Logout } from "./controller/auth.controller";

export const routes = (router: Router) => {
  router.post("/api/auth/admin/login", Login);
  router.post("/api/auth/admin/logout", Logout);
  router.post("/api/auth/ambassador/login", Login);
  router.post("/api/auth/ambassador/logout", Logout);
};
