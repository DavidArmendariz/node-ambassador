import express from "express";
import cors from "cors";
import { routes } from "./routes";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createProxyMiddleware } from "http-proxy-middleware";
import { debug } from "console";

dotenv.config();

const PORT = 3703;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "http://localhost:4000",
      "http://localhost:5000",
    ],
  })
);

// Gateaway for Ambassador requests
app.use(
  "/api/ambassador",
  createProxyMiddleware({
    target: `http://localhost:"${process.env.PORT_AMBASSADOR}"`, // Cambia esta URL por el servidor que maneja las rutas de ambassador
    changeOrigin: true,
    pathRewrite: { "^/api/ambassador": "/api/ambassador" },
  })
);

app.use(
  "/api/checkout",
  createProxyMiddleware({
    target: `http://localhost:"${process.env.PORT_AMBASSADOR}`, // El servidor que maneja las rutas de checkout
    changeOrigin: true,
    pathRewrite: { "^/api/checkout": "/api/checkout" }, // Mantén el prefijo /api/checkout
  })
);

app.use(
  "/api/admin",
  createProxyMiddleware({
    target: `http://localhost:"${process.env.PORT_AMBASSADOR}`, // Cambia esta URL por el servidor que maneja las rutas de admin
    changeOrigin: true,
    pathRewrite: { "^/api/admin": "/api/admin" },
  })
);

// Gateaway for Users requests
app.use(
  "/api/users",
  createProxyMiddleware({
    target: `http://localhost:"${process.env.PORT_USERS}"`, // Cambia esta URL por el servidor que maneja las rutas de ambassador
    changeOrigin: true,
    pathRewrite: { "^/api/users": "/api/users" },
  })
);

// Gateaway for Authentication requests
app.use(
  "/api/authentication",
  createProxyMiddleware({
    target: `http://localhost:"${process.env.PORT_AUTHENTICATION}"`, // Cambia esta URL por el servidor que maneja las rutas de ambassador
    changeOrigin: true,
    pathRewrite: { "^/api/authentication": "/api/authentication" },
  })
);

routes(app);

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
