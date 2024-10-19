import { DataSource } from "typeorm";
import { User } from "./src/entity/user.entity";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "db",
  port: 3306,
  username: "root",
  password: "root",
  database: "users",
  synchronize: true,
  logging: false,
  entities: [User],
  subscribers: [],
  migrations: [],
});
