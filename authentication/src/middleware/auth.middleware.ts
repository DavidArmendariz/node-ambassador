import { Request, Response } from "express";
import { firebaseApp } from "../firebase";

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    return res.status(403).send({ message: "No token provided!" });
  }

  try {
    const decodedToken = await firebaseApp.auth().verifyIdToken(idToken);
    req["user"] = decodedToken;

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).send({ message: "Unauthorized" });
  }
};
