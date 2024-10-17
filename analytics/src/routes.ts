import { Rankings } from "./logica";
import { Stats } from "./logica";
import { Router } from "express";

export const routes = (router: Router) => {
  router.get("/", (req, res) => res.send("ok"));
  router.get("/analytics/rankings", Rankings);
  router.get("/analytics/stats", Stats);
};
