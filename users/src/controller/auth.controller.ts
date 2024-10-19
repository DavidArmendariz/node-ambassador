import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/user.entity";
import bcryptjs from "bcryptjs";
import { AppDataSource } from "../../data-source";
import { kafkaProducer } from "../kafka/config";

export const AuthenticatedUser = async (req: Request, res: Response) => {
  const user = req["user"];

  if (req.path === "/api/admin/user") {
    return res.send(user);
  }

  res.send(user);
};

export const Register = async (req: Request, res: Response) => {
  const { password, password_confirm, ...body } = req.body;

  if (password !== password_confirm) {
    return res.status(400).send({
      message: "Password's do not match!",
    });
  }

  const user = await getRepository(User).save({
    ...body,
    password: await bcryptjs.hash(password, 10),
    is_ambassador: req.path === "/api/ambassador/register",
  });

  delete user.password;

  const value = JSON.stringify({
    event: "create",
    user_data: user,
  });

  await kafkaProducer.send({ topic: "authentication", messages: [{ value }] });
  res.send(user);
};

export const UpdateInfo = async (req: Request, res: Response) => {
  const user = req["user"];
  const repository = AppDataSource.getRepository(User);

  await repository.update(user.id, req.body);
  //const user_info = await repository.update(user.id, req.body);

  const value = JSON.stringify({
    event: "update",
    user_data: user,
  });

  await kafkaProducer.send({ topic: "authentication", messages: [{ value }] });
  res.send(await repository.findOne(user.id));
};

export const UpdatePassword = async (req: Request, res: Response) => {
  const user = req["user"];

  if (req.body.password !== req.body.password_confirm) {
    return res.status(400).send({
      message: "Password's do not match!",
    });
  }

  await AppDataSource.getRepository(User).update(user.id, {
    password: await bcryptjs.hash(req.body.password, 10),
  });

  const value = JSON.stringify({
    event: "update",
    user_data: user,
  });

  await kafkaProducer.send({ topic: "authentication", messages: [{ value }] });

  res.send(user);
};