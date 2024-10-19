import { Request, Response } from "express";
import { User } from "../entity/user.entity";
import bcryptjs from "bcryptjs";
import { firebaseApp } from "../firebase";
import { AppDataSource } from "../../data-source";

export const Register = async (req: Request, res: Response) => {
  const { password, password_confirm, email, first_name, last_name } = req.body;

  if (password !== password_confirm) {
    return res.status(400).send({
      message: "Password's do not match!",
    });
  }

  const user = await AppDataSource.getRepository(User).save({
    first_name,
    last_name,
    email,
    password: await bcryptjs.hash(password, 10),
    is_ambassador: req.path === "/api/ambassador/register",
  });

  try {
    const firebaseRecord = await firebaseApp.auth().createUser({
      email: email,
      password: password,
      displayName: `${first_name} ${last_name}`,
    });

    const claims = { is_ambassador: user.is_ambassador };
    await firebaseApp.auth().setCustomUserClaims(firebaseRecord.uid, claims);
  } catch (error) {
    console.error(
      "Error creating user or setting custom claims:",
      error.message
    );
  }

  res.send(user);
};

export const AuthenticatedUser = async (req: Request, res: Response) => {
  const user = req["user"];

  // Esto debe estar en otro endpoint
  // const orders = await getRepository(Order).find({
  //   where: {
  //     user_id: user.id,
  //     complete: true,
  //   },
  //   relations: ["order_items"],
  // });

  // user.revenue = orders.reduce((s, o) => s + o.ambassador_revenue, 0);

  res.send(user);
};

export const Logout = async (req: Request, res: Response) => {
  res.cookie("jwt", "", { maxAge: 0 });

  res.send({
    message: "success",
  });
};

export const UpdateInfo = async (req: Request, res: Response) => {
  const user = req["user"];

  const repository = AppDataSource.getRepository(User);

  await repository.update(user.id, req.body);

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

  res.send(user);
};
