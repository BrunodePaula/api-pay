import { PrismaClient } from "@prisma/client";
import { PaymentResponse, RefundResponse, TransactionStatus } from "../types";

type TransactionData = PaymentResponse | RefundResponse;

const prisma = new PrismaClient();

export default {
  async saveTransaction(transactionData: TransactionData): Promise<void> {
    try {
      await prisma.transaction.create({
        data: {
          id: transactionData.id,
          status: transactionData.status,
          originalAmount: transactionData.originalAmount,
          currentAmount: transactionData.currentAmount,
          currency: transactionData.currency,
          description: transactionData.description || null,
          paymentMethod: transactionData.paymentMethod,
          cardId: transactionData.cardId,
          provider: transactionData.provider,
          createdAt: new Date(transactionData.createdAt),
          ...("type" in transactionData ? { type: transactionData.type } : {}),
        },
      });
    } catch (error) {
      console.error("Database save error:", error);
      throw new Error("Failed to save transaction");
    }
  },

  async getTransaction(id: string): Promise<PaymentResponse | null> {
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { id },
      });

      if (!transaction) return null;

      return {
        id: transaction.id,
        createdAt: transaction.createdAt.toISOString(),
        status: transaction.status as TransactionStatus,
        originalAmount: transaction.originalAmount,
        currentAmount: transaction.currentAmount,
        currency: transaction.currency,
        description: transaction.description,
        paymentMethod: transaction.paymentMethod,
        cardId: transaction.cardId,
        provider: transaction.provider as "provider1" | "provider2",
        type: transaction.type,
      };
    } catch (error) {
      console.error("Database read error:", error);
      throw new Error("Failed to get transaction");
    }
  },
};
