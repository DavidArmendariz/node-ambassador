import { Request, Response } from "express";
import { User } from "../entity/user.entity";
import bcryptjs from "bcryptjs";
import { firebaseApp } from "../firebase";
import { AppDataSource } from "../../data-source";
import { sign } from "jsonwebtoken";

export const Register = async (req: Request, res: Response) => {
  const { password, email, first_name, last_name, is_ambassador } = req.body;

  try {
    const firebaseRecord = await firebaseApp.auth().createUser({
      email: email,
      password: password,
      displayName: `${first_name} ${last_name}`,
    });

    const claims = { is_ambassador: is_ambassador };
    await firebaseApp.auth().setCustomUserClaims(firebaseRecord.uid, claims);
  } catch (error) {
    console.error(
      "Error creating user or setting custom claims:",
      error.message
    );
  }
};

export const Login = async (req: Request, res: Response) => {
  const user = await AppDataSource.getRepository(User).findOne({
    where: { email: req.body.email },
    select: ["id", "password", "is_ambassador"],
  });

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
    process.env.SECRET_KEY!
  );

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, //1 day
  });

  res.send({
    message: "success",
  });
};

export const Logout = async (req: Request, res: Response) => {
  res.cookie("jwt", "", { maxAge: 0 });

  res.send({
    message: "success",
  });
};
