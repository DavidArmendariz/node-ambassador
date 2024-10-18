import { Request, Response } from "express";
import { createClient } from "redis";
import { getRepository } from "typeorm";
import { Ranking } from "./entity/rankings.entity";
import { Stats } from "./entity/stats.entity";

export const Rankings = async (req: Request, res: Response) => {
  try {
    console.log("Rankings endpoint hit");
    const rankings = getRepository(Ranking);

    const ordered_rankings = await rankings.find({
      order: { revenue: "DESC" },
    });

    const formatted_rankings = ordered_rankings.reduce((acc, ranking) => {
      return {
        ...acc,
        [ranking.user]: ranking.revenue,
      };
    }, {});

    res.send(formatted_rankings);
  } catch (error) {
    res.status(500).send("Error calculando los rankings");
  }
};

export const Stat = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.user_id, 10);
  console.log(userId);
  const statsRepository = getRepository(Stats);
  const userStats = await statsRepository.findOne({
    where: { user_id: userId },
  });

  if (!userStats) {
    return res.status(404).send("Estadísticas del usuario no encontradas");
  }

  return res.status(200).json(userStats);
};
