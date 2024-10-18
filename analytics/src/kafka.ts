import { EachMessagePayload, Kafka } from "kafkajs";
import { getRepository } from "typeorm";
import { Ranking } from "./entity/rankings.entity";
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

const consumer = kafka.consumer({ groupId: "email-consumer" });

export const start_kafka_rankings = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "rankings" });
  await consumer.run({
    eachMessage: async (message: EachMessagePayload) => {
      const data = JSON.parse(message.message.value.toString());

      const ranking_repo = getRepository(Ranking);
      const existing_ranking = await ranking_repo.findOne({
        where: { user: data.user },
      });

      if (existing_ranking) {
        existing_ranking.revenue += Number(data.revenue);

        await ranking_repo.save(existing_ranking);
        console.log(`Revenue updated for user ${data.user}`);
      } else {
        const newRanking = ranking_repo.create({
          user: data.user,
          revenue: Number(data.revenue),
        });

        await ranking_repo.save(newRanking);
      }
    },
  });
};

//run().then(console.error);
