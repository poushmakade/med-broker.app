const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {parse}=require('csv-parse/sync');
const {loadDataset,validateDataset,DEFAULT_DIR,EXPECTED}=require('../scripts/import-medicine-dataset');
function raw(){return Object.fromEntries(Object.keys(EXPECTED).map(name=>[name,parse(fs.readFileSync(path.join(DEFAULT_DIR,name+'.csv')),{columns:true,bom:true,trim:true})]));}
test('all 4959 supplied CSV records parse with correct units and missing fields',()=>{
 const data=loadDataset();assert.deepEqual(data.counts,EXPECTED);
 assert.equal(data.rows.medicines[0].priceCents,10000);
 assert.equal(Number(data.rows.demand_history[0].price),107);
 assert.equal(data.rows.medicine_references.filter(r=>r.sourceUrl===null).length,74);
 assert.equal(data.rows.medicines.filter(r=>r.manufacturer===null).length,77);
 assert.equal(data.rows.medicines[0].requiresPrescription,false);
});
test('duplicate source keys are rejected before writes',()=>{const r=raw();r.inventory[1].inventory_code=r.inventory[0].inventory_code;assert.throws(()=>validateDataset(r),/duplicate key/);});
test('unresolved stock links are rejected',()=>{const r=raw();r.demand_history[0].vendor_code='V999';assert.throws(()=>validateDataset(r),/unknown vendor/);});
test('fractional paise and non-booleans are rejected',()=>{
 let r=raw();r.medicines[0].priceCents='100.5';assert.throws(()=>validateDataset(r),/integer/);
 r=raw();r.medicines[0].isActive='yes';assert.throws(()=>validateDataset(r),/boolean/);
});
test('invalid dates are rejected rather than normalized',()=>{const r=raw();r.inventory[0].lastRestockedAt='2026-02-30';assert.throws(()=>validateDataset(r),/invalid date/);});
test('order totals and line totals must reconcile',()=>{const r=raw();r.orders[0].totalCents='1';assert.throws(()=>validateDataset(r),/order total mismatch/);});
test('demo vendors cannot be verified or masquerade as real vendors',()=>{const r=raw();r.vendors[0].verificationStatus='VERIFIED';assert.throws(()=>validateDataset(r),/invalid enum/);});
test('changed required record counts are rejected',()=>{const r=raw();r.demand_history.pop();assert.throws(()=>validateDataset(r),/expected 4176/);});
