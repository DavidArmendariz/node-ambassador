import { Request, Response } from "express";
import { createClient } from "redis";
import { getRepository } from "typeorm";
import { Ranking } from "./entity/rankings.entity";

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

export const Stats = async (req: Request, res: Response) => {};
