import { Request, Response } from "express";
import { verify } from "jsonwebtoken";

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: Function
) => {
  try {
    const jwt = req.cookies["jwt"];

    const payload: any = verify(jwt, process.env.JWT_SECRET);

    if (!payload) {
      return res.status(401).send({
        message: "unauthenticated",
      });
    }

    const is_ambassador = req.path.indexOf("api/ambassador") >= 0;

    if (
      (is_ambassador && payload.scope !== "ambassador") ||
      (!is_ambassador && payload.scope !== "admin")
    ) {
      return res.status(401).send({
        message: "unauthorized",
      });
    }

    req["user_database_id"] = payload.id;

    next();
  } catch (e) {
    return res.status(401).send({
      message: "unauthenticated",
    });
  }
};
