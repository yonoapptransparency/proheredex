import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import router from "./routes/index.js";
import seoRouter from "./routes/seo.js";
import { logger } from "./lib/logger.js";

// Startup validation — warn loudly if critical secrets are missing
if (!process.env.AES_SECRET) {
  console.error(
    "\n⛔ FATAL: AES_SECRET is not set.\n" +
    "   Download links CANNOT be encrypted or decrypted.\n" +
    "   Set AES_SECRET in Replit Secrets and restart the API server.\n"
  );
}
if (!process.env.TOKEN_SECRET) {
  console.warn(
    "\n⚠️  WARNING: TOKEN_SECRET is not set.\n" +
    "   PoW gateway tokens will use an empty HMAC key (insecure).\n" +
    "   Set TOKEN_SECRET in Replit Secrets for production use.\n"
  );
}
if (!process.env.ADMIN_EMAIL) {
  console.warn(
    "\n⚠️  WARNING: ADMIN_EMAIL is not set.\n" +
    "   Backend admin verification will fail. Set ADMIN_EMAIL in Replit Secrets.\n"
  );
}

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// SEO routes at root level (not under /api)
app.use(seoRouter);

app.use("/api", router);

export default app;
