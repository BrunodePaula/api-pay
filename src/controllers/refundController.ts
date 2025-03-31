import { FastifyReply, FastifyRequest } from "fastify";
import PaymentService from "../services/paymentService";

class RefundController {
  static async processRefund(
    req: FastifyRequest<{ Params: { id: string }; Body: { amount: number } }>,
    res: FastifyReply,
  ) {
    if (req.body.amount <= 0)
      return res.status(400).send({ error: "Amount must be greater than 0" });

    const refund = await PaymentService.refundPayment(req.params.id, {
      amount: req.body.amount,
    });
    refund.status === "failed"
      ? res.status(500).send({ error: "Refund processing failed" })
      : res.send(refund);
  }
}

export default RefundController;
