import express from "express";
import { createConnection } from "typeorm";
import { routes } from "./routes";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createClient } from "redis";
import { kafkaProducer } from "./kafka/config";

dotenv.config();

const PORT = process.env.PORT || 3701;

export const redisClient = createClient({
  url: "redis://redis:6379",
});

createConnection().then(async () => {
  await kafkaProducer.connect();
  await redisClient.connect();

  const app = express();

  app.use(cookieParser());
  app.use(express.json());

  routes(app);

  app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
  });
});
