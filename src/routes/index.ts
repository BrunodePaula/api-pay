import { FastifyInstance } from "fastify";
import { paymentRoutes } from "./payment";
import { refundRoutes } from "./refunds";

export async function registerRoutes(fastify: FastifyInstance) {
  fastify.register(paymentRoutes);
  fastify.register(refundRoutes);
}
