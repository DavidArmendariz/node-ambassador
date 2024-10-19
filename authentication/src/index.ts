import express from "express";
import { routes } from "./routes";
import dotenv from "dotenv";
import { kafkaConsumer } from "./kafka/config";

dotenv.config();

const PORT = 3702;

const run = async () => {
  const app = express();
  app.use(express.json());

  routes(app);

  const kafkaPromise = kafkaConsumer
    .connect()
    .then(() => {
      return kafkaConsumer.subscribe({ topic: "authentication" });
    })
    .then(() => {
      return kafkaConsumer.run({
        eachMessage: async ({ message }) => {
          console.log(message.value.toString());
        },
      });
    });

  const expressPromise = new Promise<void>((resolve) => {
    app.listen(PORT, () => {
      console.log(`listening to port ${PORT}`);
      resolve();
    });
  });

  await Promise.all([kafkaPromise, expressPromise]);
};

run().then(console.error);
