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

// Configuración del API Gateway para redirigir todas las peticiones de ambassador
const ambassadorServiceProxyAmbassador = createProxyMiddleware({
  target: `http://localhost:3701`,
  changeOrigin: true,
});

const ambassadorServiceProxyCheckout = createProxyMiddleware({
  target: `http://localhost:3701`, // No incluyas /api/checkout en el target
  changeOrigin: true,
});

const ambassadorServiceProxyAdmin = createProxyMiddleware({
  target: `http://localhost:3701`,
  changeOrigin: true,
  pathRewrite: {
    "^/api/admin": "/api/admin", // Mantén el prefijo /api/admin
  },
});

// Aplicar el proxy para todas las rutas de ambassador
module.exports = function (app) {
  app.use("/api/checkout", ambassadorServiceProxyCheckout);
};

module.exports = function (app) {
  app.use("/api/ambassador", ambassadorServiceProxyAmbassador);
};

module.exports = function (app) {
  app.use("/api/admin", ambassadorServiceProxyAdmin);
};
// Mantener las demás rutas
routes(app);

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
