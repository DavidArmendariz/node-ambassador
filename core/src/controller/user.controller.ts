import { Request, Response } from "express";
import { redisClient } from "../index";

export const Rankings = async (req: Request, res: Response) => {
  const result: string[] = await redisClient.sendCommand([
    "ZREVRANGEBYSCORE",
    "rankings",
    "+inf",
    "-inf",
    "WITHSCORES",
  ]);
  let name;

  res.send(
    result.reduce((o, r) => {
      if (isNaN(parseInt(r))) {
        name = r;
        return o;
      } else {
        return {
          ...o,
          [name]: parseInt(r),
        };
      }
    }, {})
  );
};
