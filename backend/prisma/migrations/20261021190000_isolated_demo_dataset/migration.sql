-- CreateTable
CREATE TABLE "DemoDataset" (
    "id" TEXT NOT NULL,
    "sourceHash" TEXT NOT NULL,
    "counts" JSONB NOT NULL,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DemoDataset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemoVendor" (
    "datasetId" TEXT NOT NULL,
    "vendorCode" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "vendorType" "VendorType" NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "isDemo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "DemoVendor_pkey" PRIMARY KEY ("datasetId","vendorCode")
);

-- CreateTable
CREATE TABLE "DemoInventory" (
    "datasetId" TEXT NOT NULL,
    "inventoryCode" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "vendorCode" TEXT NOT NULL,
    "medicineId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reservedQuantity" INTEGER NOT NULL,
    "reorderLevel" INTEGER NOT NULL,
    "sellingPriceCents" INTEGER NOT NULL,
    "costPriceCents" INTEGER NOT NULL,
    "mrpCents" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "lastRestockedAt" DATE NOT NULL,

    CONSTRAINT "DemoInventory_pkey" PRIMARY KEY ("datasetId","inventoryCode")
);

-- CreateTable
CREATE TABLE "MedicineReference" (
    "datasetId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "medicineId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "activeIngredients" TEXT NOT NULL,
    "strength" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "priceDataType" TEXT NOT NULL,
    "rxDataType" TEXT NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "MedicineReference_pkey" PRIMARY KEY ("datasetId","sku")
);

-- CreateTable
CREATE TABLE "DemoDemandHistory" (
    "datasetId" TEXT NOT NULL,
    "month" DATE NOT NULL,
    "sku" TEXT NOT NULL,
    "vendorCode" TEXT NOT NULL,
    "pastMonthSales" INTEGER NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "stockLevel" INTEGER NOT NULL,
    "seasonalityIndex" DECIMAL(8,3) NOT NULL,
    "promotionActive" BOOLEAN NOT NULL,
    "nextMonthSales" INTEGER NOT NULL,

    CONSTRAINT "DemoDemandHistory_pkey" PRIMARY KEY ("datasetId","month","sku","vendorCode")
);

-- CreateTable
CREATE TABLE "DemoOrder" (
    "datasetId" TEXT NOT NULL,
    "orderCode" TEXT NOT NULL,
    "demoCustomerCode" TEXT NOT NULL,
    "vendorCode" TEXT NOT NULL,
    "orderMonth" DATE NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "totalCents" INTEGER NOT NULL,
    "recordType" TEXT NOT NULL DEFAULT 'SYNTHETIC',

    CONSTRAINT "DemoOrder_pkey" PRIMARY KEY ("datasetId","orderCode")
);

-- CreateTable
CREATE TABLE "DemoOrderItem" (
    "datasetId" TEXT NOT NULL,
    "orderCode" TEXT NOT NULL,
    "lineNo" INTEGER NOT NULL,
    "sku" TEXT NOT NULL,
    "vendorCode" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPriceCents" INTEGER NOT NULL,
    "lineTotalCents" INTEGER NOT NULL,

    CONSTRAINT "DemoOrderItem_pkey" PRIMARY KEY ("datasetId","orderCode","lineNo")
);

-- CreateIndex
CREATE UNIQUE INDEX "DemoInventory_datasetId_sku_vendorCode_key" ON "DemoInventory"("datasetId", "sku", "vendorCode");

-- CreateIndex
CREATE INDEX "DemoDemandHistory_datasetId_sku_vendorCode_month_idx" ON "DemoDemandHistory"("datasetId", "sku", "vendorCode", "month");

-- CreateIndex
CREATE INDEX "DemoOrder_datasetId_orderMonth_idx" ON "DemoOrder"("datasetId", "orderMonth");

-- AddForeignKey
ALTER TABLE "DemoVendor" ADD CONSTRAINT "DemoVendor_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "DemoDataset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoInventory" ADD CONSTRAINT "DemoInventory_datasetId_vendorCode_fkey" FOREIGN KEY ("datasetId", "vendorCode") REFERENCES "DemoVendor"("datasetId", "vendorCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoInventory" ADD CONSTRAINT "DemoInventory_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "Medicine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineReference" ADD CONSTRAINT "MedicineReference_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "DemoDataset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineReference" ADD CONSTRAINT "MedicineReference_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "Medicine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoDemandHistory" ADD CONSTRAINT "DemoDemandHistory_datasetId_sku_vendorCode_fkey" FOREIGN KEY ("datasetId", "sku", "vendorCode") REFERENCES "DemoInventory"("datasetId", "sku", "vendorCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoOrder" ADD CONSTRAINT "DemoOrder_datasetId_vendorCode_fkey" FOREIGN KEY ("datasetId", "vendorCode") REFERENCES "DemoVendor"("datasetId", "vendorCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoOrderItem" ADD CONSTRAINT "DemoOrderItem_datasetId_orderCode_fkey" FOREIGN KEY ("datasetId", "orderCode") REFERENCES "DemoOrder"("datasetId", "orderCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoOrderItem" ADD CONSTRAINT "DemoOrderItem_datasetId_sku_vendorCode_fkey" FOREIGN KEY ("datasetId", "sku", "vendorCode") REFERENCES "DemoInventory"("datasetId", "sku", "vendorCode") ON DELETE RESTRICT ON UPDATE CASCADE;
