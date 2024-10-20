import { createConnection, getRepository } from "typeorm";
import { randomInt } from "crypto";
import { Link } from "../entity/link.entity";
import { faker } from "@faker-js/faker";

createConnection().then(async () => {
  const linkRepository = getRepository(Link);

  for (let i = 0; i < 30; i++) {
    await linkRepository.save({
      code: faker.string.alpha(6),
      user_id: 1,
      price: [randomInt(1, 30)],
    });
  }

  process.exit();
});
