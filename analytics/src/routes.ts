import { Rankings } from "./logica";
import { Stats } from "./logica";
import { Router } from "express";

export const routes = (router: Router) => {
  router.get("/", (req, res) => res.send("ok"));

  router.get("/api/analytics/rankings", Rankings);
  router.get("/api/analytics/stats", Stats);
};
