import { FastifyInstance } from "fastify";
import PaymentController from "../controllers/paymentController";

export async function paymentRoutes(app: FastifyInstance) {
  app.post("/payments", PaymentController.processPayment);
  app.get("/payments/:id", PaymentController.getPayment);
}
