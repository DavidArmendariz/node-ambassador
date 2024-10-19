import { User } from "../entity/user.entity";
import bcryptjs from "bcryptjs";
import { AppDataSource } from "../../data-source";
import { faker } from "@faker-js/faker";

AppDataSource.initialize().then(async () => {
  const repository = AppDataSource.getRepository(User);
  const password = await bcryptjs.hash("1234", 10);
  for (let i = 0; i < 30; i++) {
    await repository.save({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password,
      is_ambassador: true,
    });
  }
  process.exit();
});
