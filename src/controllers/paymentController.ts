import { FastifyReply, FastifyRequest } from "fastify";
import PaymentService from "../services/paymentService";
import { PaymentRequest } from "../types";

class PaymentController {
  static async processPayment(
    req: FastifyRequest<{ Body: PaymentRequest }>,
    res: FastifyReply,
  ) {
    try {
      const result = await PaymentService.processPayment(req.body);
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: "Payment processing failed" });
    }
  }

  static async getPayment(
    req: FastifyRequest<{ Params: { id: string } }>,
    res: FastifyReply,
  ) {
    const transaction = await PaymentService.getPayment(req.params.id);
    transaction
      ? res.send(transaction)
      : res.status(404).send({ error: "Transaction not found" });
  }
}

export default PaymentController;
