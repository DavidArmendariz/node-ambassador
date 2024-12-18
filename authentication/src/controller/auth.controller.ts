import { Request, Response } from "express";
import { firebaseApp } from "../firebase";
import { sign } from "jsonwebtoken";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const Login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validate request body
  if (!email || !password) {
    return res.status(400).send({
      message: "Email and password are required!",
    });
  }

  const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;

  try {
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );

    const { idToken } = response.data;
    const decodedToken = await firebaseApp.auth().verifyIdToken(idToken);
    const { is_ambassador, user_database_id, name, uid } = decodedToken;

    const adminLogin = req.path === "/api/admin/login";

    if (is_ambassador && adminLogin) {
      return res.status(401).send({
        message: "Unauthorized",
      });
    }

    // Generate JWT token

    const token = sign(
      {
        id: user_database_id,
        name,
        scope: adminLogin ? "admin" : "ambassador",
        uid,
        email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : undefined,
      secure: process.env.NODE_ENV === "production",
    });
    res.send({
      message: "success",
    });
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(401).send({
      message: "Invalid credentials",
    });
  }
};

export const LoginExternal = async (req: Request, res: Response) => {
  const { idToken } = req.body;

  try {
    const decodedToken = await firebaseApp.auth().verifyIdToken(idToken);
    const { is_ambassador, user_database_id, name, uid, email } = decodedToken;

    const adminLogin = req.path === "/api/admin/login";

    if (is_ambassador && adminLogin) {
      return res.status(401).send({
        message: "Unauthorized",
      });
    }

    // Generate JWT token

    const token = sign(
      {
        id: user_database_id,
        name,
        scope: adminLogin ? "admin" : "ambassador",
        uid,
        email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : undefined,
      secure: process.env.NODE_ENV === "production",
    });
    res.send({
      message: "success",
    });
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(401).send({
      message: "Invalid credentials",
    });
  }
};

export const Logout = async (req: Request, res: Response) => {
  res.cookie("jwt", "", {
    maxAge: 0,
    sameSite: process.env.NODE_ENV === "production" ? "none" : undefined,
    secure: process.env.NODE_ENV === "production",
  });
  res.send({
    message: "success",
  });
};

export const AuthenticatedUser = async (req: Request, res: Response) => {
  const user = req["user"];
  res.send(user);
};
