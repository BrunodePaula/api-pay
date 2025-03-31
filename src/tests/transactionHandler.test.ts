import { TransactionHandler } from "../services/TransactionHandler";
import TransactionRepository from "../repositories/TransactionRepository";
import {
  MockPaymentProvider1,
  MockPaymentProvider2,
} from "../mocks/paymentProviders";
import { jest } from "@jest/globals";
import { TransactionStatus } from "../types/index";

jest.mock("../repositories/TransactionRepository");
jest.mock("../mocks/paymentProviders");

describe("TransactionHandler", () => {
  const mockPaymentData = {
    amount: 100,
    currency: "USD",
    description: "Test transaction",
    paymentMethod: "card",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should process a payment successfully", async () => {
    const mockResponse = {
      id: "txn_123",
      type: "payment",
      provider: "MockProvider1",
      createdAt: new Date().toISOString(),
      status: "authorized" as TransactionStatus,
      amount: 100,
      currency: "USD",
      description: "Test",
      paymentMethod: "card",
      cardId: "card_123",
      originalAmount: 100,
      currentAmount: 100,
    };

    (
      MockPaymentProvider1.createCharge as jest.MockedFunction<
        typeof MockPaymentProvider1.createCharge
      >
    ).mockResolvedValue(mockResponse);

    const result = await TransactionHandler.handlePayment(mockPaymentData);

    expect(result.status).toBe("authorized" as TransactionStatus);
    expect(TransactionRepository.saveTransaction).toHaveBeenCalledWith(result);
  });

  it("should process a failed payment if the providers fail", async () => {
    jest
      .spyOn(MockPaymentProvider1, "createCharge")
      .mockRejectedValue(new Error("Provider1 Error"));
    jest
      .spyOn(MockPaymentProvider2, "createTransaction")
      .mockRejectedValue(new Error("Provider2 Error"));

    jest
      .spyOn(TransactionRepository, "saveTransaction")
      .mockResolvedValue(undefined);

    const result = await TransactionHandler.handlePayment(mockPaymentData);

    expect(result.status).toBe("failed");
    expect(TransactionRepository.saveTransaction).toHaveBeenCalledWith(
      expect.objectContaining({ status: "failed" }),
    );
  });

  it("should process a refund successfully", async () => {
    jest.spyOn(TransactionRepository, "getTransaction").mockResolvedValue({
      id: "txn_123",
      provider: "provider1",
      paymentMethod: "card",
      cardId: "card_123",
      createdAt: new Date().toISOString(),
      originalAmount: 1000,
      currency: "USD",
      currentAmount: 500,
      status: "paid",
      type: "payment",
      description: "test",
    });

    jest.spyOn(MockPaymentProvider1, "refundCharge").mockResolvedValue({
      id: "txn_123",
      provider: "provider1",
      paymentMethod: "card",
      cardId: "card_123",
      createdAt: new Date().toISOString(),
      originalAmount: 1000,
      currency: "USD",
      currentAmount: 500,
      status: "refunded",
      type: "refund",
      description: "test",
    });

    const result = await TransactionHandler.handleRefund("txn_123", 50);

    expect(result.status).toBe("refunded");
    expect(TransactionRepository.saveTransaction).toHaveBeenCalledWith(
      expect.objectContaining({ status: "refunded" }),
    );
  });

  it("should return failed when both provider and database fail", async () => {
    jest
      .spyOn(MockPaymentProvider1, "createCharge")
      .mockRejectedValue(new Error("Provider Error"));
    jest
      .spyOn(MockPaymentProvider2, "createTransaction")
      .mockRejectedValue(new Error("Provider Error"));
    jest
      .spyOn(TransactionRepository, "saveTransaction")
      .mockRejectedValue(new Error("DB Error"));

    const result = await TransactionHandler.handlePayment({
      amount: 100,
      currency: "USD",
      paymentMethod: "card",
    });

    expect(result.status).toBe("failed");
  });

  it("should use Provider2 when Provider1 fails", async () => {
    jest
      .spyOn(MockPaymentProvider1, "createCharge")
      .mockRejectedValue(new Error("Provider1 Error"));

    jest.spyOn(MockPaymentProvider2, "createTransaction").mockResolvedValue({
      status: "authorized",
      id: "test-123",
      amount: 100,
      cardId: "card",
      currency: "USD",
      date: new Date().toISOString(),
      paymentType: "payment",
      statementDescriptor: "test",
    });

    jest
      .spyOn(TransactionRepository, "saveTransaction")
      .mockResolvedValue(undefined);

    const result = await TransactionHandler.handlePayment({
      amount: 100,
      paymentMethod: "card",
      currency: "usd",
      description: "test",
    });

    expect(result.status).toBe("authorized");
    expect(MockPaymentProvider2.createTransaction).toHaveBeenCalled();
  });
});
