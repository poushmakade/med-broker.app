CREATE TYPE "VendorType" AS ENUM ('MANUFACTURER', 'DISTRIBUTOR', 'PHARMACY');

CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'SHIPPED', 'CANCELLED');

CREATE TYPE "MedicineStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'BLOCKED', 'ARCHIVED');

CREATE TABLE "Medicine" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priceCents" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "wholesalePriceCents" INTEGER,
    "requiresPrescription" BOOLEAN NOT NULL DEFAULT false,
    "brand" TEXT,
    "category" TEXT,
    "dosageForm" TEXT,
    "hsnCode" TEXT,
    "imageUrls" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "manufacturer" TEXT,
    "meta" JSONB,
    "packSize" TEXT,
    "scheduleType" TEXT,
    "sku" TEXT,
    "slug" TEXT,
    "status" "MedicineStatus" NOT NULL DEFAULT 'PUBLISHED',
    "strength" TEXT,
    "subcategory" TEXT,
    "moderationNote" TEXT,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Medicine_sku_key" ON "Medicine"("sku");

CREATE UNIQUE INDEX "Medicine_slug_key" ON "Medicine"("slug");

CREATE INDEX "Medicine_updatedAt_idx" ON "Medicine"("updatedAt");

CREATE INDEX "Medicine_status_isActive_updatedAt_idx" ON "Medicine"("status", "isActive", "updatedAt");
