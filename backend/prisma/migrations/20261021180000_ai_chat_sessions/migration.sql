CREATE TABLE "AiChatSession" (
    "id" TEXT NOT NULL,
    "symptoms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "messages" JSONB NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AiChatSession_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AiChatSession_expiresAt_idx" ON "AiChatSession"("expiresAt");
