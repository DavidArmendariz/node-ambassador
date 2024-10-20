import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const PORT = process.env.API_GATEWAY_PORT;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: [
      process.env.FRONTEND_URL1,
      process.env.FRONTEND_URL2,
      process.env.FRONTEND_URL3,
    ],
  })
);

app.use("/api/admin", (req, res, next) => {
  let target = process.env.AMBASSADOR_SERVER;
  if (["/login", "/logout"].includes(req.path)) {
    target = process.env.AUTHENTICATION_SERVER;
  } else if (
    ["/register", "/user", "/users/info", "/users/password"].includes(req.path)
  ) {
    target = process.env.USERS_SERVER;
  }
  const proxy = createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: (path) => {
      return `/api/admin${path}`;
    },
  });
  return proxy(req, res, next);
});

app.use("/api/ambassador", (req, res, next) => {
  let target = process.env.AMBASSADOR_SERVER;
  if (["/login", "/logout"].includes(req.path)) {
    target = process.env.AUTHENTICATION_SERVER;
  } else if (
    ["/register", "/user", "/users/info", "/users/password"].includes(req.path)
  ) {
    target = process.env.USERS_SERVER;
  }
  const proxy = createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: (path) => {
      return `/api/ambassador${path}`;
    },
  });
  return proxy(req, res, next);
});

app.use("/api/checkout", (req, res, next) => {
  const proxy = createProxyMiddleware({
    target: process.env.AMBASSADOR_SERVER,
    changeOrigin: true,
    pathRewrite: (path) => {
      return `/api/checkout${path}`;
    },
  });
  return proxy(req, res, next);
});

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
