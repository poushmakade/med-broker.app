# PharmaSense / Med Broker - DEMO medicine dataset

Prepared: 2026-10-21
Repository: https://github.com/Team-Innovatrix/med-broker.app
Prisma schema: backend/prisma/schema.prisma
Demand model: ai-ml/models/demand_forecasting/model_wrapper.py

## Included
- medicines.csv — 80 catalog records. Field names align with the project's Prisma `Medicine` model.
- medicine_references.csv — active ingredients + selected reference URLs and validation cautions.
- vendors.csv — 5 FICTIONAL supplier display profiles (NOT verified businesses or directly insertable Vendor records).
- inventory.csv — 174 fictional inventory records, linked by medicine `sku` and `vendor_code`.
- demand_history.csv — 4,176 completely SIMULATED monthly time-series rows over 24 months (October 2024 through September 2026). `next_month_sales` is the artificial training target.
- orders.csv — 150 fictional orders for demo analytics; not directly insertable into Order without real user records.
- order_items.csv — 294 fictional line items linked to demo order codes.
- medicines_dataset.xlsx — an Excel workbook with these tables and a starter summary.

## Critical cautions
1. Medicines are familiar generic or branded *example product names*, not a validated or complete pharmacy catalog. Brand composition, strengths, pack sizes, sources, and manufacturers must be independently verified against registered product packaging.
2. ALL medicine prices, vendor offers, vendor stock, promotion indicators, order history and forecast labels are randomly generated demonstration data. They are NOT live prices, dispensing records, prescriptions or real sales.
3. `requiresPrescription` is an indicative, deliberately conservative demo flag, NOT a legally reviewed India Schedule H/H1/X or OTC classification. Have a licensed pharmacist/regulatory specialist verify before enabling purchase or displaying an OTC badge.
4. Demo vendors are fictitious, marked PENDING, with no valid GSTIN/drug license. Do NOT give them a VERIFIED badge; do not bypass production compliance checks.
5. The `medicines.csv` priceCents/wholesalePriceCents fields are INTEGER MINOR UNITS: INR 45.00 = 4500 paise. The LSTM `demand_history.csv` `price` field is in INR. This distinction is intentional.
6. Inventory uses `sku` and `vendor_code` links for portability. The real Prisma `Inventory` table requires UUID foreign keys `medicineId`, `vendorId`, so map these to existing Prisma records during seeding.
7. Do not import fake orders/payments into a production system or mix synthetic forecasting rows with actual sales.
8. The existing demand model expects exactly five features, in order: past_month_sales, price, stock_level, seasonality_index, promotion_active; `next_month_sales` is provided for supervised training/evaluation. Split by time, not randomly, and retrain/revalidate before production.

## Basic import to the app
1. Configure development PostgreSQL/Neon and run Prisma migrations; back up any database before seeding.
2. Seed `medicines.csv` by `sku` with `prisma.medicine.upsert(...)` (the CSV fields match the Medicine schema). Keep `status=PUBLISHED` only in a DEMO environment; if public use is possible, use a moderated/non-public status appropriate for your application.
3. Create DEMO supplier accounts through your app's normal vendor onboarding, then map each vendor_code to the resulting vendor UUID. Preserve verificationStatus=PENDING.
4. Upsert inventory by composite unique key (medicineId, vendorId), resolving SKUs and demo vendor codes.
5. Use the 150 demo orders ONLY in an isolated test database (they use display IDs and don't match Prisma Order relations directly).
6. For AI input, select columns `past_month_sales,price,stock_level,seasonality_index,promotion_active` grouped by (sku,vendor_code) and ordered by month. Train using history with label `next_month_sales`. The current model wrapper may repeat single feature rows rather than consume six distinct months; revise that for true sequential inference.

## References
- India's official essential medicines documentation (background, NOT verification of every entry):
  https://cdsco.mohfw.gov.in/opencms/opencms/en/consumer/Essential-Medicines/
- Brand-specific sources for some sample names in `medicine_references.csv`.
- Med Broker repo documentation and current Prisma schema:
  https://github.com/Team-Innovatrix/med-broker.app/blob/main/backend/prisma/schema.prisma

All entries are for UI/engineering demonstrations and learning.
