import { Router } from "express";
import { Login, Logout, LoginExternal } from "./controller/auth.controller";

export const routes = (router: Router) => {
  router.post("/api/admin/login", Login);
  router.post("/api/admin/logout", Logout);
  router.post("/api/ambassador/login", Login);
  router.post("/api/ambassador/loginExternal", LoginExternal);
  router.post("/api/ambassador/logout", Logout);
};
