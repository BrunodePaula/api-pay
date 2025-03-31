import {
  MockPaymentProvider1,
  MockPaymentProvider2,
} from "../mocks/paymentProviders";
import { RefundResponse, TransactionStatus, PaymentRequest } from "../types";

describe("MockPaymentProviders", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should simulate a successful payment with Provider1", async () => {
    const mockCharge = {
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
      amount: 100,
    };
    jest
      .spyOn(MockPaymentProvider1, "createCharge")
      .mockResolvedValue(mockCharge);

    const result = await MockPaymentProvider1.createCharge({
      amount: 100,
      currency: "USD",
      paymentMethod: "card",
    });

    expect(result).toEqual(mockCharge);
    expect(MockPaymentProvider1.createCharge).toHaveBeenCalledTimes(1);
  });

  it("should simulate a successful payment with Provider2", async () => {
    const mockCharge = {
      id: "txn_123",
      date: new Date().toISOString(),
      status: "authorized" as TransactionStatus,
      originalAmount: 100,
      currentAmount: 100,
      currency: "USD",
      description: "Test transaction",
      paymentMethod: "card",
      cardId: "card_123",
      provider: "provider2",
      paymentType: "payment",
      amount: 100,
    };
    jest
      .spyOn(MockPaymentProvider2, "createTransaction")
      .mockResolvedValue(mockCharge);

    const result = await MockPaymentProvider2.createTransaction({
      amount: 100,
      currency: "USD",
      paymentMethod: "card",
    });

    expect(result).toEqual(mockCharge);
    expect(MockPaymentProvider2.createTransaction).toHaveBeenCalledTimes(1);
  });

  it("should simulate an error with Provider1", async () => {
    jest
      .spyOn(MockPaymentProvider1, "createCharge")
      .mockRejectedValue(new Error("Error in Provider1"));

    await expect(
      MockPaymentProvider1.createCharge({
        amount: 100,
        currency: "USD",
        paymentMethod: "card",
      }),
    ).rejects.toThrow("Error in Provider1");

    expect(MockPaymentProvider1.createCharge).toHaveBeenCalledTimes(1);
  });

  it("should simulate an error with Provider2", async () => {
    jest
      .spyOn(MockPaymentProvider2, "createTransaction")
      .mockRejectedValue(new Error("Error in Provider2"));

    await expect(
      MockPaymentProvider2.createTransaction({
        amount: 100,
        currency: "USD",
        paymentMethod: "card",
      }),
    ).rejects.toThrow("Error in Provider2");

    expect(MockPaymentProvider2.createTransaction).toHaveBeenCalledTimes(1);
  });

  it("should process a refund with Provider1", async () => {
    const mockRefund: RefundResponse = {
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
      type: "refund",
    };

    jest
      .spyOn(MockPaymentProvider1, "refundCharge")
      .mockResolvedValue(mockRefund);

    const result = await MockPaymentProvider1.refundCharge("txn_123", {
      amount: 100,
    });

    expect(result).toEqual(mockRefund);
    expect(MockPaymentProvider1.refundCharge).toHaveBeenCalledTimes(1);
  });

  it("should process a refund with Provider2", async () => {
    const mockRefund: RefundResponse = {
      id: "txn_456",
      createdAt: new Date().toISOString(),
      status: "authorized" as TransactionStatus,
      originalAmount: 100,
      currentAmount: 100,
      currency: "USD",
      description: "Test transaction",
      paymentMethod: "card",
      cardId: "card_123",
      provider: "provider1",
      type: "failed",
    };

    jest
      .spyOn(MockPaymentProvider2, "voidTransaction")
      .mockResolvedValue(mockRefund);

    const result = await MockPaymentProvider2.voidTransaction("txn_456", {
      amount: 100,
    });

    expect(result).toEqual(mockRefund);
    expect(MockPaymentProvider2.voidTransaction).toHaveBeenCalledTimes(1);
  });

  it("should throw an error when payment amount is missing", async () => {
    const paymentData: PaymentRequest = {
      amount: 0,
      paymentMethod: "card",
      currency: "USD",
      description: "Test payment",
    };

    await expect(
      MockPaymentProvider1.createCharge(paymentData),
    ).rejects.toThrow("Error in Provider1");
  });

  it("should throw an error for invalid data", async () => {
    const paymentData: PaymentRequest = {
      amount: -50,
      paymentMethod: "card",
      currency: "USD",
      description: "Test payment",
    };

    await expect(
      MockPaymentProvider1.createCharge(paymentData),
    ).rejects.toThrow("Error in Provider1");
  });
});
