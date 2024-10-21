import express from "express";
import { routes } from "./routes";
import dotenv from "dotenv";
import { kafkaProducer } from "./kafka/config";
import cookieParser from "cookie-parser";
import { AppDataSource } from "../data-source";

dotenv.config();

const PORT = process.env.PORT || 3700;

AppDataSource.initialize().then(async () => {
  await kafkaProducer.connect();
  const app = express();
  app.use(cookieParser());
  app.use(express.json());

  routes(app);

  app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
  });
});
