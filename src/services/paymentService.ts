import TransactionRepository from "../repositories/TransactionRepository";
import { TransactionHandler } from "../services/TransactionHandler";
import { PaymentRequest, PaymentResponse, RefundResponse } from "../types";

class PaymentService {
  static async processPayment(
    paymentData: PaymentRequest,
  ): Promise<PaymentResponse> {
    return TransactionHandler.handlePayment(paymentData);
  }

  static async refundPayment(
    id: string,
    refundData: { amount: number },
  ): Promise<RefundResponse> {
    return TransactionHandler.handleRefund(id, refundData.amount);
  }

  static async getPayment(id: string): Promise<PaymentResponse | null> {
    return TransactionRepository.getTransaction(id);
  }
}

export default PaymentService;
