#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
npm run build
node scripts/import-medicine-dataset.js --dry-run
node scripts/validate-dataset-database.js
npx prisma migrate deploy
node scripts/import-medicine-dataset.js
node scripts/import-medicine-dataset.js
node scripts/verify-dataset-api.js
node onboarding-prepare.cjs
