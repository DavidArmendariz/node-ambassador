import express from "express";
import { createConnection } from "typeorm";
import { routes } from "./routes";
import dotenv from "dotenv";
import { kafkaProducer } from "./kafka/config";

dotenv.config();

const PORT = 8001;

createConnection().then(async () => {
  await kafkaProducer.connect();
  const app = express();
  app.use(express.json());

  routes(app);

  app.listen(PORT, () => {
    console.log(`listening to port ${PORT}`);
  });
});
