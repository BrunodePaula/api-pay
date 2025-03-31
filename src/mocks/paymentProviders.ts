import axios from "axios";
import {
  Provider1ChargeResponse,
  Provider2TransactionResponse,
  RefundResponse,
  PaymentRequest,
} from "../types";

const baseUrl = `${process.env.PROVIDER_API_URL || "http://localhost:4000"}`;

export class MockPaymentProvider1 {
  static async createCharge(
    paymentData: PaymentRequest,
  ): Promise<Provider1ChargeResponse> {
    const response = await axios.post<Provider1ChargeResponse>(
      `${baseUrl}/charges`,
      paymentData,
    );
    return response.data;
  }

  static async refundCharge(
    id: string,
    refundData: { amount: number },
  ): Promise<RefundResponse> {
    const response = await axios.post<RefundResponse>(
      `${baseUrl}/refund/${id}`,
      refundData,
    );
    return response.data;
  }
}

export class MockPaymentProvider2 {
  static async createTransaction(
    paymentData: PaymentRequest,
  ): Promise<Provider2TransactionResponse> {
    const response = await axios.post<Provider2TransactionResponse>(
      `${baseUrl}/transactions`,
      paymentData,
    );
    return response.data;
  }

  static async voidTransaction(
    id: string,
    refundData: { amount: number },
  ): Promise<RefundResponse> {
    const response = await axios.post<RefundResponse>(
      `${baseUrl}/void/${id}`,
      refundData,
    );
    return response.data;
  }
}
