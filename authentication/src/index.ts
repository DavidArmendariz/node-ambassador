import express from "express";
import { createConnection } from "typeorm";
import { routes } from "./routes";
import dotenv from "dotenv";
import { AppDataSource } from "../data-source";

dotenv.config();

const PORT = 8001;

AppDataSource.initialize().then(async () => {
  const app = express();
  app.use(express.json());

  routes(app);

  app.listen(PORT, () => {
    console.log(`listening to port ${PORT}`);
  });
});
