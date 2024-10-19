import { DataSource } from "typeorm";
import { User } from "./src/entity/user.entity";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "db",
  port: 5432,
  username: "root",
  password: "root",
  database: "node_ambassador_authentication_db",
  synchronize: true,
  logging: false,
  entities: [User],
  subscribers: [],
  migrations: [],
});
