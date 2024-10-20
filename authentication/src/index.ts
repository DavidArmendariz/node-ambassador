import express from "express";
import { routes } from "./routes";
import dotenv from "dotenv";
import { kafkaConsumer } from "./kafka/config";
import { registerFirebaseUser } from "./firebase-utils";

dotenv.config();

const PORT = process.env.PORT || 3702;

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
          const data = JSON.parse(message.value.toString());
          if (data.event === "create") {
            await registerFirebaseUser({
              user_database_id: data.user_data.id,
              email: data.user_data.email,
              password: data.user_data.password,
              first_name: data.user_data.first_name,
              last_name: data.user_data.last_name,
              is_ambassador: data.user_data.is_ambassador,
            });
          }
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
