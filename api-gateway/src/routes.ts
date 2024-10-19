import { Router } from "express";
import { mapper } from "./mapper";

export const routes = (router: Router) => {
  // Admin
  router.post("/api/admin/register", mapper);
  router.post("/api/admin/login", mapper);
  router.get("/api/admin/user", mapper);
  router.post("/api/admin/logout", mapper);
  router.put("/api/admin/users/info", mapper);
  router.put("/api/admin/users/password", mapper);
  router.get("/api/admin/ambassadors", mapper);
  router.get("/api/admin/products", mapper);
  router.post("/api/admin/products", mapper);
  router.get("/api/admin/products/:id", mapper);
  router.put("/api/admin/products/:id", mapper);
  router.delete("/api/admin/products/:id", mapper);
  router.get("/api/admin/users/:id/links", mapper);
  router.get("/api/admin/orders", mapper);

  // Ambassador
  router.post("/api/ambassador/register", mapper);
  router.post("/api/ambassador/login", mapper);
  router.get("/api/ambassador/user", mapper);
  router.post("/api/ambassador/logout", mapper);
  router.put("/api/ambassador/users/info", mapper);
  router.put("/api/ambassador/users/password", mapper);

  router.get("/api/ambassador/products/frontend", mapper);
  router.get("/api/ambassador/products/backend", mapper);
  router.post("/api/ambassador/links", mapper);
  router.get("/api/ambassador/stats", mapper);
  router.get("/api/ambassador/rankings", mapper);

  // Checkout
  router.get("/api/checkout/links/:code", mapper);
  router.post("/api/checkout/orders", mapper);
  router.post("/api/checkout/orders/confirm", mapper);
};
