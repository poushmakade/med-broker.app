# Supplied dataset provenance and handling

Source: user-supplied `med_broker_complete_dataset.zip`, uploaded on 2026-10-21.
The seven CSV files and README_IMPORT.md are retained byte-for-byte; the workbook is not imported because it duplicates the CSVs.
CSV SHA-256 (filename + contents in importer order): `d9e19649f05c9f59676a9879198f4296838576805e8c8b174ef8087aad2ca347`.

All prices, stock, sales, demand history, and supplier identities are demonstration data. There are 74 missing reference URLs, 59 missing brands, and 77 missing manufacturers. Missing facts remain null. References are supporting material, not regulatory verification.

Medicines enter the operational catalog only as DRAFT, inactive rows with `meta.dataset.synthetic=true`, a dataset identifier, source hash, and INR currency metadata. No CSV PUBLISHED/active flag enables public purchasing. Vendor profiles, inventory, demand history, orders, and order lines use dedicated Demo tables; they do not create User, Vendor, Inventory, Order, OrderItem, Payment, KYC, or payout records.

Do not publish these listings or treat demo stock/prices as real supplier offers. Have authoritative product details, pharmacy review, and real vendor/stock records before enabling commerce.
