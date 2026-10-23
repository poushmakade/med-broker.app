# Verified import report

Imported on 2026-10-21 into the existing Neon database `neondb`, schema `public`, endpoint `ep-morning-mode-b5l9815p` (no credentials included). The Neon control-plane branch name/ID is not available through the supplied PostgreSQL connection; no branch creation or branch-level validation is claimed.

Before application import, the full dataset was imported twice into temporary schema `dataset_validation_1bd66f3266c941e2a7bc518a0030a1a5`. Exact counts, minor/major currency units, draft/PENDING handling, idempotency, and preservation of sentinel user/order rows passed. The temporary schema was removed by the integration-test cleanup.

| Dataset | Verified rows | Stored in |
|---|---:|---|
| Medicines | 80 | Medicine: inactive DRAFT, synthetic provenance metadata |
| References | 80 | MedicineReference |
| Vendors | 5 | DemoVendor: PENDING, fictional |
| Stock | 174 | DemoInventory |
| Demand history | 4,176 | DemoDemandHistory |
| Orders | 150 | DemoOrder |
| Order lines | 294 | DemoOrderItem |
| Total | 4,959 | Zero rejected records |

Actual import returned `imported`; the second returned `already-imported` with identical counts. Source hash: `d9e19649f05c9f59676a9879198f4296838576805e8c8b174ef8087aad2ca347`.

The import transaction checked unchanged operational counts: 4 User, 1 Vendor, 0 Inventory, 0 Order, 0 OrderItem, and 0 Payment rows. Existing accounts and the real vendor were not modified. No fake users, licenses, verified vendors, payments, fulfillment, or payouts were created.

18 automated tests passed, along with the pricing regression checks and frontend production build. Authenticated API smoke tests passed for the admin catalog, dataset catalog searches (name, category, SKU), exact dataset counts, ordered 24-month sample demand series, demo orders, and rejection of unauthenticated dataset requests. Public catalog search for MED-0001 returned zero listings as required for draft synthetic data. Existing health, catalog, country, and Groq generation checks passed.

Additive migration: `20261021190000_isolated_demo_dataset`.

Verified deployment: https://vercel.com/mohitmjms-projects/med-broker-backend/25fB2Qc69JQSJGZsGJPg7gYYGeE4

Admin catalog: https://med-broker-frontend.vercel.app/admin/catalog

Source changes are local and deployed to Vercel. No Git commit, GitHub push, or pull request was created as part of this import.
