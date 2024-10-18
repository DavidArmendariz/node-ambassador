import { EachMessagePayload, Kafka } from "kafkajs";
import { getRepository } from "typeorm";
import { Stats } from "./entity/stats.entity";
import dotenv from "dotenv";

dotenv.config();

const calculation = async (stats) => {
  try {
    const userId = stats.user;
    const link = stats.links;

    const code = link.code;
    const order = link.order;

    if (order.complete) {
      const ambassadorRevenue = order.ambassador_revenue.reduce(
        (total, item) => total + item.ambassador_revenue,
        0
      );

      const statsRepo = getRepository(Stats);
      const stat = statsRepo.create({
        user_id: userId,
        link_code: code,
        ambassador_revenue: ambassadorRevenue,
      });
      console.log("Data processed and saved successfully");
      await statsRepo.save(stat);
    }
  } catch (error) {
    console.error("Error processing message:", error);
  }
};

const kafka = new Kafka({
  clientId: "stats-consumer",
  brokers: [process.env.KAFKA_BROKER],
  ssl: true,
  sasl: {
    mechanism: "plain",
    username: process.env.KAFKA_API_KEY,
    password: process.env.KAFKA_SECRET_KEY,
  },
});

const consumer = kafka.consumer({ groupId: "stats-consumer" });

export const start_kafka_stats = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "stats" });
  await consumer.run({
    eachMessage: async (message: EachMessagePayload) => {
      const data = JSON.parse(message.message.value.toString());
      calculation(data);
    },
  });
};

//run().then(console.error);
