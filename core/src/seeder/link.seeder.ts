import { createConnection, getRepository } from "typeorm";
import { randomInt } from "crypto";
import { Link } from "../entity/link.entity";
import { User } from "../entity/user.entity";
import { faker } from "@faker-js/faker";

createConnection().then(async () => {
  const repository = getRepository(Link);

  for (let i = 0; i < 30; i++) {
    const user = new User();
    user.id = i + 1;

    await repository.save({
      code: faker.string.alpha(6),
      user,
      price: [randomInt(1, 30)],
    });
  }

  process.exit();
});
