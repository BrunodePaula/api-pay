export type TransactionStatus =
  | "authorized"
  | "paid"
  | "failed"
  | "refunded"
  | "voided";

interface BaseProviderResponse {
  id: string;
  status: TransactionStatus;
  amount: number;
  currency: string;
}

export interface Provider1ChargeResponse extends BaseProviderResponse {
  createdAt: string;
  originalAmount: number;
  currentAmount: number;
  description?: string;
  paymentMethod: string;
  cardId: string;
}

export interface Provider2TransactionResponse extends BaseProviderResponse {
  date: string;
  statementDescriptor?: string;
  paymentType: string;
  cardId: string;
}

export interface PaymentResponse {
  id: string;
  createdAt: string;
  status: TransactionStatus;
  originalAmount: number;
  currentAmount: number;
  currency: string;
  description: string | null;
  paymentMethod: string;
  cardId: string;
  type: string;
  provider: "provider1" | "provider2";
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  description?: string;
  paymentMethod: string;
}

export interface RefundResponse extends PaymentResponse {
  type: "refund" | "failed";
}
