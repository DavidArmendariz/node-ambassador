import express from "express";
import { routes } from "./routes";
import dotenv from "dotenv";
import { AppDataSource } from "../data-source";
import { kafkaConsumer } from "./kafka/config";

dotenv.config();

const PORT = 8001;

AppDataSource.initialize()
  .then(async () => {
    await kafkaConsumer.connect();
    await kafkaConsumer.subscribe({ topic: "authentication" });
    const app = express();
    app.use(express.json());

    routes(app);

    app.listen(PORT, () => {
      console.log(`listening to port ${PORT}`);
    });
  })
  .finally(async () => {
    await kafkaConsumer.disconnect();
  });
