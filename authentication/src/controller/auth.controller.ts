import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/user.entity";
import bcryptjs from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { firebaseApp } from "../firebase";

export const Register = async (req: Request, res: Response) => {
  const { password, password_confirm, email, first_name, last_name } = req.body;

  if (password !== password_confirm) {
    return res.status(400).send({
      message: "Password's do not match!",
    });
  }

  const user = await getRepository(User).save({
    first_name,
    last_name,
    email,
    password: await bcryptjs.hash(password, 10),
    is_ambassador: req.path === "/api/ambassador/register",
  });

  delete user.password;

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

export const Login = async (req: Request, res: Response) => {
  const user = await getRepository(User).findOne(
    { email: req.body.email },
    {
      select: ["id", "password", "is_ambassador"],
    }
  );

  if (!user) {
    return res.status(400).send({
      message: "invalid credentials!",
    });
  }

  if (!(await bcryptjs.compare(req.body.password, user.password))) {
    return res.status(400).send({
      message: "invalid credentials!",
    });
  }

  const adminLogin = req.path === "/api/admin/login";

  if (user.is_ambassador && adminLogin) {
    return res.status(401).send({
      message: "unauthorized",
    });
  }

  const token = sign(
    {
      id: user.id,
      scope: adminLogin ? "admin" : "ambassador",
    },
    process.env.SECRET_KEY
  );

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, //1 day
  });

  res.send({
    message: "success",
  });
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

  const repository = getRepository(User);

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

  await getRepository(User).update(user.id, {
    password: await bcryptjs.hash(req.body.password, 10),
  });

  res.send(user);
};
