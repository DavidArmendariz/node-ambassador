import { EachMessagePayload, Kafka } from "kafkajs";
import { getRepository } from "typeorm";
import { Stats } from "./entity/stats.entity";
import dotenv from "dotenv";

dotenv.config();

const calculation = async (stats) => {
  try {
    const user_id = stats.user;
    const links = stats.links;

    for (const link of links) {
      const { code, orders } = link;

      for (const order of orders) {
        if (order.complete) {
          const ambassadorRevenue = order.ambassador_revenue.reduce(
            (total, item) => total + item.ambassador_revenue,
            0
          );

          const statsRepo = getRepository(Stats);
          const stat = statsRepo.create({
            user_id: user_id,
            link_code: code,
            ambassador_revenue: ambassadorRevenue,
          });

          await statsRepo.save(stat);
        }
      }
    }

    console.log("Data processed and saved successfully");
  } catch (error) {
    console.error("Error processing message:", error);
  }
};

const kafka = new Kafka({
  clientId: "email-consumer",
  brokers: [process.env.KAFKA_BROKER],
  ssl: true,
  sasl: {
    mechanism: "plain",
    username: process.env.KAFKA_API_KEY,
    password: process.env.KAFKA_SECRET_KEY,
  },
});

const consumer = kafka.consumer({ groupId: "email-consumer" });

export const start_kafka_stats = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "rankings" });
  await consumer.run({
    eachMessage: async (message: EachMessagePayload) => {
      const data = JSON.parse(message.message.value.toString());
      calculation(data);
    },
  });
};

//run().then(console.error);
