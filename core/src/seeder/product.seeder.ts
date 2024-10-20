import { createConnection, getRepository } from "typeorm";
import { faker } from "@faker-js/faker";
import { Product } from "../entity/product.entity";
import { randomInt } from "crypto";

createConnection().then(async () => {
  const repository = getRepository(Product);

  for (let i = 0; i < 30; i++) {
    await repository.save({
      title: faker.lorem.words(2),
      description: faker.lorem.words(10),
      image: faker.image.avatar(),
      price: randomInt(10, 100),
    });
  }

  process.exit();
});
