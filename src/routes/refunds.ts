import { FastifyInstance } from "fastify";
import RefundController from "../controllers/refundController";

export async function refundRoutes(app: FastifyInstance) {
  app.post("/refunds/:id", RefundController.processRefund);
}
