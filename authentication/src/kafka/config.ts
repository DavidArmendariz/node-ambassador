import { Kafka } from "kafkajs";
import dotenv from "dotenv";

dotenv.config();

const kafka = new Kafka({
  clientId: "auth-consumer",
  brokers: [process.env.KAFKA_BROKER],
  ssl: true,
  sasl: {
    mechanism: "plain",
    username: process.env.KAFKA_API_KEY,
    password: process.env.KAFKA_SECRET_KEY,
  },
  connectionTimeout: 10000,
});

export const kafkaConsumer = kafka.consumer({
  groupId: "auth-consumer",
  heartbeatInterval: 10000,
  sessionTimeout: 60000,
});
