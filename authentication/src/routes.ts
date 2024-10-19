import { Router } from "express";
import { Login, Logout, Register } from "./controller/auth.controller";

export const routes = (router: Router) => {
  router.post("/api/admin/register", Register);
  router.post("/api/admin/login", Login);
  router.post("/api/admin/logout", Logout);
  router.post("/api/ambassador/register", Register);
  router.post("/api/ambassador/login", Login);
  router.post("/api/ambassador/logout", Logout);
};
