import { EachMessagePayload, Kafka } from "kafkajs";
import dotenv from "dotenv";

dotenv.config();

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

const consumer = kafka.consumer({ groupId: "analytics-consumer" });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "analytics" });
  await consumer.run({
    eachMessage: async (message: EachMessagePayload) => {
      console.log("Hello world!");
    },
  });
};

run().then(console.error);
