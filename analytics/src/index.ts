import express, { Request, Response } from "express";
import { createConnection } from "typeorm";
import { routes } from "./routes";
import { createClient } from "redis";
import cors from "cors";
import { start_kafka_rankings } from "./kafka";

// export const client = createClient({
//   url: "redis://redis:6379",
// });

createConnection()
  .then(async () => {
    //await client.connect();
    console.log("Database connection established.");
    const app = express();

    app.use(cors());
    app.use(express.json());
    routes(app);

    await start_kafka_rankings();

    app.listen(8001, () => {
      console.log("listening to port 8001");
    });
  })
  .catch((error) => console.error("Error in TypeORM connection: ", error));
