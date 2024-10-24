import { createConnection, getRepository } from "typeorm";
import { faker } from "@faker-js/faker";
import { randomInt } from "crypto";
import { Order } from "../entity/order.entity";
import { OrderItem } from "../entity/order-item.entity";

createConnection().then(async () => {
  const orderRepository = getRepository(Order);
  const orderItemRepository = getRepository(OrderItem);

  for (let i = 0; i < 30; i++) {
    const order = await orderRepository.save({
      user_id: randomInt(2, 31),
      code: faker.string.alpha(6),
      ambassador_email: faker.internet.email(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      complete: true,
    });

    for (let j = 0; j < randomInt(1, 5); j++) {
      await orderItemRepository.save({
        order,
        product_title: faker.lorem.words(2),
        price: randomInt(10, 100),
        quantity: randomInt(1, 5),
        admin_revenue: randomInt(10, 100),
        ambassador_revenue: randomInt(10, 100),
      });
    }
  }

  process.exit();
});
