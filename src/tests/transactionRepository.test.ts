import TransactionRepository from "../repositories/TransactionRepository";
import { PrismaClient } from "@prisma/client";
import { jest } from "@jest/globals";
import { PaymentResponse, TransactionStatus } from "../types";

jest.mock("@prisma/client", () => {
  const prismaMock = {
    transaction: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => prismaMock) };
});

const prisma = new PrismaClient();

describe("TransactionRepository", () => {
  const mockTransaction: PaymentResponse = {
    id: "txn_123",
    createdAt: new Date().toISOString(),
    status: "authorized" as TransactionStatus,
    originalAmount: 100,
    currentAmount: 100,
    currency: "USD",
    description: "Test transaction",
    paymentMethod: "card",
    cardId: "card_123",
    provider: "provider1",
    type: "payment",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should save a transaction successfully", async () => {
    await TransactionRepository.saveTransaction(mockTransaction);

    expect(prisma.transaction.create).toHaveBeenCalledWith({
      data: {
        id: mockTransaction.id,
        status: mockTransaction.status,
        originalAmount: mockTransaction.originalAmount,
        currentAmount: mockTransaction.currentAmount,
        currency: mockTransaction.currency,
        description: mockTransaction.description,
        paymentMethod: mockTransaction.paymentMethod,
        cardId: mockTransaction.cardId,
        provider: mockTransaction.provider,
        createdAt: new Date(mockTransaction.createdAt),
        type: mockTransaction.type,
      },
    });
  });

  it("should throw an error when failing to save a transaction", async () => {
    jest
      .spyOn(prisma.transaction, "create")
      .mockRejectedValue(new Error("Database error"));

    await expect(
      TransactionRepository.saveTransaction(mockTransaction),
    ).rejects.toThrow("Failed to save transaction");
  });

  it("should return a valid transaction when fetching by ID", async () => {
    const mockTransaction: PaymentResponse = {
      id: "txn_123",
      cardId: "card_123",
      originalAmount: 100,
      currentAmount: 100,
      currency: "USD",
      description: "Test transaction",
      createdAt: new Date().toISOString(),
      status: "authorized",
      paymentMethod: "credit_card",
      type: "payment",
      provider: "provider1",
    };

    jest
      .spyOn(TransactionRepository, "getTransaction")
      .mockResolvedValue(mockTransaction);

    const result = await TransactionRepository.getTransaction("txn_123");

    expect(result).toEqual(mockTransaction);
  });

  it("should throw an error when failing to fetch a transaction", async () => {
    jest
      .spyOn(TransactionRepository, "getTransaction")
      .mockRejectedValue(
        new Error("Failed to fetch transaction from the database"),
      );

    await expect(
      TransactionRepository.getTransaction("non_existent_id"),
    ).rejects.toThrow("Failed to fetch transaction from the database");
  });
});
