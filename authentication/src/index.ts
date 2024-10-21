import express from "express";
import { routes } from "./routes";
import dotenv from "dotenv";
import { kafkaConsumer } from "./kafka/config";
import {
  registerFirebaseUser,
  updateFirebaseUserPassword,
} from "./firebase-utils";
import { decrypt } from "./utils/utils";

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
            const decrypted_password = decrypt(
              data.user_data.password,
              process.env.ENCRYPTION_KEY
            );
            await registerFirebaseUser({
              user_database_id: data.user_data.id,
              email: data.user_data.email,
              password: decrypted_password,
              first_name: data.user_data.first_name,
              last_name: data.user_data.last_name,
              is_ambassador: data.user_data.is_ambassador,
            });
          } else if (data.event === "update_password") {
            const decrypted_password = decrypt(
              data.user_data.password,
              process.env.ENCRYPTION_KEY
            );
            await updateFirebaseUserPassword({
              uid: data.user_data.firebase_uid,
              newPassword: decrypted_password,
            });
          }
        },
      });
    });

  const expressPromise = new Promise<void>((resolve) => {
    app.listen(PORT, () => {
      console.log(`Listening to port ${PORT}`);
      resolve();
    });
  });

  await Promise.all([kafkaPromise, expressPromise]);
};

run().then(console.error);
