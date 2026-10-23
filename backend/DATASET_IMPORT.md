# Medicine dataset import

The supplied seven CSVs contain 4,959 rows: 80 medicines, 80 references, 5 fictional vendors, 174 demo stock rows, 4,176 simulated monthly demand rows, 150 demo orders, and 294 demo order lines. The original data and README are in `data/med-broker-complete/`.

## Local commands

Run from `backend/` with Node 18+ (validated with Node 24) and installed dependencies:

```sh
npm run dataset:validate
npm run dataset:import -- --dry-run
# Supply DATABASE_URL securely. Do not put values in source or logs.
npm run build
npx prisma migrate deploy
npm run dataset:import
npm run dataset:import   # verifies counts and returns already-imported
node --test test/dataset-import.test.cjs
```

Use the existing Neon pooled `DATABASE_URL` with TLS verification enabled. Never run migrate reset, truncate, a destructive seed, or db push --accept-data-loss. A separate direct connection can be used for migration tooling if needed; this environment's pooled connection worked with Prisma 5.22.

## Validation and atomicity

Validation requires the source columns and exact row counts, strict integer prices, booleans, ISO dates/months, supported enums, unique keys, valid SKU/vendor/order links, one reference per medicine, coherent order/line totals, and reserved quantities within stock. Catalog minor units are INR paise; forecasting price is INR. A source hash prevents a changed file from silently overwriting an existing import.

`import-medicine-dataset.js` validates before opening its write transaction. The serializable transaction takes an advisory lock, rejects any existing catalog SKU/slug collision, upserts catalog rows by SKU, inserts related records in batches of 400, and verifies actual counts and unchanged operational table counts. Errors roll back the whole import. Identical reruns perform no writes and verify all seven counts. Nothing deletes existing data. After review changes, dataset count verification continues to work; imports do not re-disable approved rows.

The importer does not fabricate business credentials, real stock, payments, or verified accounts. Medicines are DRAFT and inactive. Demo records cannot feed operational revenue or fulfill orders.

## Isolated PostgreSQL integration test

```sh
node scripts/validate-dataset-database.js
```

This creates a random `dataset_validation_*` schema on the configured PostgreSQL endpoint. It checks the active schema, creates only isolated test tables, imports twice, verifies exact counts and units, checks draft/PENDING isolation, and preserves sentinel user/order rows. It then drops only the random schema created by that invocation, including on failure. It never resets or truncates public data. A dedicated Neon development branch may also be used by pointing DATABASE_URL at that branch; branch-management credentials are not required for the temporary-schema test.

`dataset-validation-schema.sql` is the current Medicine table, its indexes, and the four required enums generated from Prisma schema using migrate diff. Update that fixture when changing fields used by the importer.

## Database-backed application access

Existing admin Catalog APIs and the Catalog page read Medicine records through Prisma and show the 80 draft listings. Public `/api/medicines` continues to require active published medicines, real active inventory, and verified vendors. Public searches now also match SKU and category.

Additional read-only ADMIN endpoints:

- `GET /api/admin/datasets/medicine-demo`: source hash, counts, missing references, demo flag.
- `GET /api/admin/datasets/medicine-demo/catalog?search=MED-0001&page=1&limit=25`: medicine details, references, fictional stock/vendor details; searches name/brand/category/SKU.
- `GET /api/admin/datasets/medicine-demo/demand?sku=MED-0001&vendorCode=V001`: chronological monthly features, with explicit INR price units.
- `GET /api/admin/datasets/medicine-demo/orders`: paginated synthetic orders and their lines. Totals are explicitly synthetic.

All routes inherit the existing admin authentication/role guard. `verify-dataset-api.js` makes read-only authenticated local requests using a short-lived token for an existing admin, without printing it. It checks guest denial, database-backed catalog search, temporal data, source totals, and public isolation. It does not log in with or change an account's password.

## Deployment

`bash scripts/deploy-with-dataset.sh` runs generation, dry run, isolated-schema integration, additive migrations, actual import, idempotency rerun, API checks, and existing app/Groq smoke checks. Run in the backend directory with configured production environment values; deploy only after tests pass. The source changes remain in the shared checkout until committed separately; no GitHub push is implied by a Vercel deployment.

## Verified result and baseline

See [the import report](data/med-broker-complete/IMPORT_REPORT.md) for actual database counts and validation evidence. This deployment started from the existing, validated app schema. The repository's older migrations do not fully reconstruct every current application field on an empty database; this additive dataset migration does not repair unrelated historical drift. Validate a fresh database separately before using these deployment steps there.

## Read-only catalog preview

The shopper catalog now falls back to an explicitly labeled demo view when real-stock search returns no matches. `GET /api/medicines/demo?limit=100&search=...` and `/api/medicines/demo/:id` provide public read-only previews from the imported Medicine rows. These responses always set `isDemo=true`, `purchasable=false`, `inStock=false`, stockLevel=0, and no operational vendor/inventory ID. INR paise are converted to INR amounts once. The browser filters and paginates all 80 preview rows; detail pages suppress verification claims and use demo labels. The cart service independently rejects inactive/draft or synthetic medicines, even for direct API calls. The normal purchasable-stock endpoint remains unchanged in its draft exclusion.
