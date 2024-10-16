import { EachMessagePayload, Kafka } from "kafkajs";
import dotenv from "dotenv";
import { client } from "./logica";

dotenv.config();

const kafka = new Kafka({
  clientId: "analytics-consumer",
  brokers: [process.env.KAFKA_BROKER],
  ssl: true,
  sasl: {
    mechanism: "plain",
    username: process.env.KAFKA_API_KEY,
    password: process.env.KAFKA_SECRET_KEY,
  },
});

const consumer = kafka.consumer({ groupId: "analytics-consumer" });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "rankings" });
  await consumer.run({
    eachMessage: async (message: EachMessagePayload) => {
      const data = JSON.parse(message.message.value.toString());
      await client.zIncrBy("rankings", data.ambassador_revenue, data.name);
    },
  });
};

run().then(console.error);
