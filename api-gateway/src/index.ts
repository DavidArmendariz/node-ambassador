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

app.use(
  createProxyMiddleware({
    target: process.env.AUTHENTICATION_SERVER,
    changeOrigin: true,
    pathRewrite: {
      "^/api/admin/login": "/api/auth/admin/login",
      "^/api/admin/logout": "/api/auth/admin/logout",
    },
  })
);

app.use(
  createProxyMiddleware({
    target: process.env.USERS_SERVER,
    changeOrigin: true,
    pathRewrite: {
      "^/api/admin/register": "/api/users/admin/register",
      "^/api/admin/user": "/api/users/admin/user",
      "^/api/admin/users/info": "/api/users/admin/users/info",
      "^/api/admin/users/password": "/api/users/admin/users/password",
    },
  })
);

app.use(
  createProxyMiddleware({
    target: process.env.AUTHENTICATION_SERVER,
    changeOrigin: true,
    pathRewrite: {
      "^/api/ambassador/login": "/api/auth/ambassador/login",
      "^/api/ambassador/logout": "/api/auth/ambassador/logout",
    },
  })
);

app.use(
  createProxyMiddleware({
    target: process.env.USERS_SERVER,
    changeOrigin: true,
    pathRewrite: {
      "^/api/ambassador/register": "/api/users/ambassador/register",
      "^/api/ambassador/user": "/api/users/ambassador/user",
      "^/api/ambassador/users/info": "/api/users/ambassador/users/info",
      "^/api/ambassador/users/password": "/api/users/ambassador/users/password",
    },
  })
);

app.use(
  createProxyMiddleware({
    target: process.env.AMBASSADOR_SERVER,
    changeOrigin: true,
    pathRewrite: { "^/api/admin": "/api/admin" },
  })
);

app.use(
  createProxyMiddleware({
    target: process.env.AMBASSADOR_SERVER,
    changeOrigin: true,
    pathRewrite: { "^/api/ambassador": "/api/ambassador" },
  })
);

app.use(
  createProxyMiddleware({
    target: process.env.AMBASSADOR_SERVER,
    changeOrigin: true,
    pathRewrite: { "^/api/checkout": "/api/checkout" },
  })
);

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
