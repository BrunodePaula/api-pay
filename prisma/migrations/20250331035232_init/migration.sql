-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "originalAmount" INTEGER NOT NULL,
    "currentAmount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "description" TEXT,
    "paymentMethod" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);
