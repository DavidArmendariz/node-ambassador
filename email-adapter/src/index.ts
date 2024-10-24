import { EachMessagePayload, Kafka } from "kafkajs";
import dotenv from "dotenv";
import { createTransport } from "nodemailer";

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
  connectionTimeout: 10000,
});

const kafkaConsumer = kafka.consumer({ groupId: "email-consumer" });

const transporter = createTransport({
  host: "172.17.0.1", // IP de docker, también se puede usar host.docker.internal
  port: 1025,
});

const run = async () => {
  await kafkaConsumer.connect();
  await kafkaConsumer.subscribe({ topic: "default" });
  await kafkaConsumer.run({
    eachMessage: async (message: EachMessagePayload) => {
      const order = JSON.parse(message.message.value.toString());
      await transporter.sendMail({
        from: "from@example.com",
        to: "admin@admin.com",
        subject: "An order has been completed",
        html: `Order #${order.id} with a total of $${order.admin_revenue} has been completed`,
      });

      await transporter.sendMail({
        from: "from@example.com",
        to: order.ambassador_email,
        subject: "An order has been completed",
        html: `You earned $${order.ambassador_revenue} from the link #${order.code}`,
      });
    },
  });
  transporter.close();
};

run().then(console.error);
