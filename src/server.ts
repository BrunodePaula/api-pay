import Fastify from "fastify";
import dotenv from "dotenv";
import { registerRoutes } from "./routes";

dotenv.config();

const app = Fastify({ logger: true });

registerRoutes(app);

const start = async () => {
  try {
    await app.listen({
      port: Number(process.env.PORT) || 3000,
      host: "0.0.0.0",
    });
    console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
