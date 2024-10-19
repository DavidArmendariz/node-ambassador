import express from "express";
import cors from "cors";
import { createConnection } from "typeorm";
import { routes } from "./routes";
import dotenv from "dotenv";

dotenv.config();

const PORT = 8001;

createConnection().then(async () => {
  const app = express();
  app.use(express.json());
  app.use(
    cors({
      credentials: true,
      origin: [`http://localhost:${PORT}`],
    })
  );

  routes(app);

  app.listen(PORT, () => {
    console.log(`listening to port ${PORT}`);
  });
});
