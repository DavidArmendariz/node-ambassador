import { Request, Response } from "express";
import { User } from "../entity/user.entity";
import bcryptjs from "bcryptjs";
import { AppDataSource } from "../../data-source";
import { kafkaProducer } from "../kafka/config";
import { encrypt } from "../utils/utils";

export const AuthenticatedUser = async (req: Request, res: Response) => {
  const user_id = req["user_database_id"];
  const user = await AppDataSource.getRepository(User).findOne({
    where: {
      id: user_id,
    },
  });

  res.send(user);
};

export const Register = async (req: Request, res: Response) => {
  console.log("Request", req.url);
  const { password, password_confirm, email, first_name, last_name } = req.body;

  if (password !== password_confirm) {
    return res.status(400).send({
      message: "Password's do not match!",
    });
  }

  const user = await AppDataSource.getRepository(User).save({
    email,
    first_name,
    last_name,
    password: await bcryptjs.hash(password, 10),
    is_ambassador: req.path === "/api/ambassador/register",
  });

  const encrypted_password = encrypt(password, process.env.ENCRYPTION_KEY);

  const value = JSON.stringify({
    event: "create",
    user_data: { ...user, password: encrypted_password },
  });

  delete user.password;

  await kafkaProducer.send({ topic: "authentication", messages: [{ value }] });
  res.send(user);
};

export const UpdateInfo = async (req: Request, res: Response) => {
  const user_id = req["user_database_id"];
  const repository = AppDataSource.getRepository(User);

  const user_update = await repository.update(user_id, req.body);

  const value = JSON.stringify({
    event: "update",
    user_data: user_update,
  });

  await kafkaProducer.send({ topic: "authentication", messages: [{ value }] });
  res.send(await repository.findOne(user_id));
};

export const UpdatePassword = async (req: Request, res: Response) => {
  const user_id = req["user_database_id"];

  if (req.body.password !== req.body.password_confirm) {
    return res.status(400).send({
      message: "Password's do not match!",
    });
  }

  const user_update = await AppDataSource.getRepository(User).update(user_id, {
    password: await bcryptjs.hash(req.body.password, 10),
  });

  const encrypted_password = encrypt(
    req.body.password,
    process.env.ENCRYPTION_KEY
  );

  const value = JSON.stringify({
    event: "update",
    user_data: { ...user_update, password: encrypted_password },
  });

  await kafkaProducer.send({ topic: "authentication", messages: [{ value }] });

  res.send(user_update);
};

export const Ambassadors = async (req: Request, res: Response) => {
  res.send(
    await AppDataSource.getRepository(User).find({
      where: {
        is_ambassador: true,
      },
    })
  );
};
