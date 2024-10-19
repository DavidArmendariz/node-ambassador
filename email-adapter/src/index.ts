import { EachMessagePayload, Kafka } from "kafkajs";
import dotenv from "dotenv";
import { createTransport } from "nodemailer";

dotenv.config();

const kafka = new Kafka({
  clientId: "email-consumer-kafka",
  brokers: [process.env.KAFKA_BROKER],
  ssl: true,
  sasl: {
    mechanism: "plain",
    username: process.env.KAFKA_API_KEY,
    password: process.env.KAFKA_SECRET_KEY,
  },
});

const consumer = kafka.consumer({
  groupId: "email-consumer-kafka",
});

const transporter = createTransport({
  host: "172.17.0.2",
  port: 1025,
});

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "email" });
  await consumer.run({
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
  await transporter.close();
};
run().then(console.error);
