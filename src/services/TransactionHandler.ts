import { randomUUID } from "crypto";
import {
  MockPaymentProvider1,
  MockPaymentProvider2,
} from "../mocks/paymentProviders";
import TransactionRepository from "../repositories/TransactionRepository";
import {
  PaymentRequest,
  PaymentResponse,
  Provider1ChargeResponse,
  Provider2TransactionResponse,
  RefundResponse,
} from "../types";

export class TransactionHandler {
  static async handlePayment(
    paymentData: PaymentRequest,
  ): Promise<PaymentResponse> {
    try {
      const provider1Response =
        await MockPaymentProvider1.createCharge(paymentData);
      const result = this.formatProvider1Response(provider1Response);
      await TransactionRepository.saveTransaction(result);
      return result;
    } catch (error) {
      console.error("Provider1 failed, trying Provider2:", error);
    }

    try {
      const provider2Response =
        await MockPaymentProvider2.createTransaction(paymentData);
      const result = this.formatProvider2Response(provider2Response);
      await TransactionRepository.saveTransaction(result);
      return result;
    } catch (error) {
      console.error("Provider2 also failed:", error);
    }

    return this.createFailedPayment(paymentData);
  }

  static async handleRefund(
    transactionId: string,
    amount: number,
  ): Promise<RefundResponse> {
    const transaction =
      await TransactionRepository.getTransaction(transactionId);
    if (!transaction) {
      return this.createFailedRefund(transactionId);
    }

    try {
      const refund =
        transaction.provider === "provider1"
          ? await MockPaymentProvider1.refundCharge(transactionId, { amount })
          : await MockPaymentProvider2.voidTransaction(transactionId, {
              amount,
            });

      const refundResponse: RefundResponse = {
        ...refund,
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        status: "refunded",
        description: "Refunded transaction",
        paymentMethod: transaction.paymentMethod,
        cardId: transaction.cardId,
        provider: transaction.provider,
        type: "refund",
      };

      await TransactionRepository.saveTransaction(refundResponse);
      return refundResponse;
    } catch (error) {
      console.error("Refund failed:", error);
      const failedRefund = this.createFailedRefund(transactionId);
      await TransactionRepository.saveTransaction(failedRefund);
      return failedRefund;
    }
  }

  private static formatProvider1Response(
    response: Provider1ChargeResponse,
  ): PaymentResponse {
    return {
      id: response.id,
      createdAt: response.createdAt,
      status: response.status,
      originalAmount: response.originalAmount,
      currentAmount: response.currentAmount,
      currency: response.currency,
      description: response.description || null,
      paymentMethod: response.paymentMethod,
      cardId: response.cardId,
      provider: "provider1",
      type: "payment",
    };
  }

  private static formatProvider2Response(
    response: Provider2TransactionResponse,
  ): PaymentResponse {
    return {
      id: response.id,
      createdAt: response.date,
      status: response.status,
      originalAmount: response.amount,
      currentAmount: response.amount,
      currency: response.currency,
      description: response.statementDescriptor || null,
      paymentMethod: "card",
      cardId: response.cardId,
      provider: "provider2",
      type: "payment",
    };
  }

  private static createFailedPayment(
    paymentData: PaymentRequest,
  ): PaymentResponse {
    const failedResponse: PaymentResponse = {
      id: `fail-${randomUUID()}`,
      createdAt: new Date().toISOString(),
      status: "failed",
      originalAmount: paymentData.amount,
      currentAmount: 0,
      currency: paymentData.currency,
      description: paymentData.description || null,
      paymentMethod: paymentData.paymentMethod,
      cardId: `card-fail-${randomUUID()}`,
      provider: "provider1",
      type: "failed",
    };

    TransactionRepository.saveTransaction(failedResponse).catch((error) => {
      console.error("Failed to save failed transaction:", error);
    });

    return failedResponse;
  }

  private static createFailedRefund(transactionId: string): RefundResponse {
    return {
      id: `refund-fail-${randomUUID()}`,
      createdAt: new Date().toISOString(),
      status: "failed",
      originalAmount: 0,
      currentAmount: 0,
      currency: "USD",
      description: `Refund failed for transaction ${transactionId}`,
      paymentMethod: "card",
      cardId: `card-fail-${randomUUID()}`,
      provider: "provider1",
      type: "failed",
    };
  }
}
