import Fastify from "fastify";
import { randomUUID } from "crypto";

const fastify = Fastify();

type ChargeRequest = {
  amount: number;
  currency: string;
  description: string;
  paymentMethod: string;
};

type RefundRequest = {
  amount: number;
};

type TransactionRequest = {
  amount: number;
  currency: string;
  statementDescriptor: string;
  paymentType: string;
  card: string;
};

fastify.post<{ Body: ChargeRequest }>("/charges", async (request, reply) => {
  const { amount, currency, description } = request.body;

  const isApproved = Math.random() > 0.2;

  return reply.send({
    id: randomUUID(),
    createdAt: new Date().toISOString().split("T")[0],
    status: isApproved ? "authorized" : "failed",
    originalAmount: amount,
    currentAmount: isApproved ? amount : 0,
    currency,
    description,
    paymentMethod: "card",
    cardId: randomUUID(),
  });
});

fastify.post<{ Params: { id: string }; Body: RefundRequest }>(
  "/refund/:id",
  async (request, reply) => {
    const { amount } = request.body;
    const { id } = request.params;

    return reply.send({
      id,
      createdAt: new Date().toISOString().split("T")[0],
      status: "refunded",
      originalAmount: amount,
      currentAmount: 0,
      currency: "USD",
      description: "Refunded transaction",
      paymentMethod: "card",
      cardId: randomUUID(),
    });
  },
);

fastify.get<{ Params: { id: string } }>(
  "/charges/:id",
  async (request, reply) => {
    const { id } = request.params;

    return reply.send({
      id,
      createdAt: new Date().toISOString().split("T")[0],
      status: "authorized",
      originalAmount: 100,
      currentAmount: 100,
      currency: "USD",
      description: "Test payment",
      paymentMethod: "card",
      cardId: randomUUID(),
    });
  },
);

fastify.post<{ Body: TransactionRequest }>(
  "/transactions",
  async (request, reply) => {
    const { amount, currency, statementDescriptor, paymentType, card } =
      request.body;

    const isApproved = Math.random() > 0.2;

    return reply.send({
      id: randomUUID(),
      date: new Date().toISOString().split("T")[0],
      status: isApproved ? "paid" : "failed",
      amount,
      originalAmount: amount,
      currency,
      statementDescriptor,
      paymentType,
      cardId: randomUUID(),
    });
  },
);

fastify.post<{ Params: { id: string }; Body: RefundRequest }>(
  "/void/:id",
  async (request, reply) => {
    const { amount } = request.body;
    const { id } = request.params;

    return reply.send({
      id,
      date: new Date().toISOString().split("T")[0],
      status: "voided",
      amount,
      originalAmount: amount,
      currency: "USD",
      statementDescriptor: "Refunded transaction",
      paymentType: "card",
      cardId: randomUUID(),
    });
  },
);

fastify.get<{ Params: { id: string } }>(
  "/transactions/:id",
  async (request, reply) => {
    const { id } = request.params;

    return reply.send({
      id,
      date: new Date().toISOString().split("T")[0],
      status: "paid",
      amount: 100,
      originalAmount: 100,
      currency: "USD",
      statementDescriptor: "Test payment",
      paymentType: "card",
      cardId: randomUUID(),
    });
  },
);

fastify.listen(
  { port: Number(process.env.PROVIDER_API_URL) || 4000, host: "0.0.0.0" },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`🚀 Servidor de mocks rodando em ${address}`);
  },
);
