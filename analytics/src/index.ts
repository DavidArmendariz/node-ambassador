import express, { Request, Response } from "express";
import { createConnection } from "typeorm";
import { routes } from "./routes";
import { createClient } from "redis";

export const client = createClient({
  url: "redis://redis:6379",
});

createConnection()
  .then(async () => {
    await client.connect();

    const app = express();

    app.use(express.json());
    routes(app);

    app.listen(8001, () => {
      console.log("listening to port 8001");
    });
  })
  .catch((error) => console.error("Error in TypeORM connection: ", error));
