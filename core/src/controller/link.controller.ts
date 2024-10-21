import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Link } from "../entity/link.entity";

export const Links = async (req: Request, res: Response) => {
  const links = await getRepository(Link).find({
    where: {
      user: req.params.id,
    },
    relations: ["orders", "orders.order_items"],
  });

  res.send(links);
};

export const CreateLink = async (req: Request, res: Response) => {
  const userId = req["user_database_id"];

  const link = await getRepository(Link).save({
    user_id: userId,
    code: Math.random().toString(36).substring(6),
    products: req.body.products.map((id) => ({ id })),
  });

  res.send(link);
};

export const Stats = async (req: Request, res: Response) => {
  const userId = req["user_database_id"];

  const links = await getRepository(Link).find({
    where: { user_id: userId },
    relations: ["orders", "orders.order_items"],
  });

  res.send(
    links.map((link) => {
      const orders = link.orders.filter((o) => o.complete);

      return {
        code: link.code,
        count: orders.length,
        revenue: orders.reduce((s, o) => s + o.ambassador_revenue, 0),
      };
    })
  );
};

export const GetLink = async (req: Request, res: Response) => {
  res.send(
    await getRepository(Link).findOne({
      where: {
        code: req.params.code,
      },
      relations: ["products"],
    })
  );
};
