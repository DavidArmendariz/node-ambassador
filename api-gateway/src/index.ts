import express from "express";
import cors from "cors";
import { routes } from "./routes";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createProxyMiddleware } from "http-proxy-middleware";

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

// Configuración del API Gateway para redirigir todas las peticiones de ambassador
const ambassadorServiceProxyAmbassador = createProxyMiddleware({
  target: `http://localhost:${process.env.PORT_AMBASSADOR}/api/ambassador`, // Cambia esta URL por el servidor que maneja las rutas de ambassador
  changeOrigin: true,
});

const ambassadorServiceProxyCheckout = createProxyMiddleware({
  target: `http://localhost:${process.env.PORT_AMBASSADOR}/api/checkout`, // Cambia esta URL por el servidor que maneja las rutas de ambassador
  changeOrigin: true,
});

const ambassadorServiceProxyAdmin = createProxyMiddleware({
  target: `http://localhost:${process.env.PORT_AMBASSADOR}/api/admin`, // Cambia esta URL por el servidor que maneja las rutas de ambassador
  changeOrigin: true,
});

// Aplicar el proxy para todas las rutas de ambassador
app.use("/api/ambassador", ambassadorServiceProxyAmbassador);
app.use("/api/checkout", ambassadorServiceProxyCheckout);
app.use("/api/admin", ambassadorServiceProxyAdmin);

// Mantener las demás rutas
routes(app);

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
