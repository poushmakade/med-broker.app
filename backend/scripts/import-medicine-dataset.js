const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { parse } = require('csv-parse/sync');
const DATASET_ID = 'med-broker-complete-v1';
const DEFAULT_DIR = path.join(__dirname, '../data/med-broker-complete');
const EXPECTED = {medicines:80, medicine_references:80, vendors:5, inventory:174, demand_history:4176, orders:150, order_items:294};
const HEADERS = {
 medicines:'sku name brand description priceCents wholesalePriceCents requiresPrescription category subcategory dosageForm packSize strength manufacturer slug status isActive',
 medicine_references:'sku name active_ingredients strength source_url price_data_type rx_data_type note',
 vendors:'vendor_code companyName vendorType country state city verificationStatus isDemo',
 inventory:'inventory_code sku vendor_code quantity reservedQuantity reorderLevel sellingPriceCents costPriceCents mrpCents isActive lastRestockedAt',
 demand_history:'month sku vendor_code past_month_sales price stock_level seasonality_index promotion_active next_month_sales',
 orders:'order_code demo_customer_code vendor_code order_month status currencyCode totalCents record_type',
 order_items:'order_code line_no sku vendor_code quantity unitPriceCents lineTotalCents'
};
const fail = message => {throw new Error(`Dataset validation: ${message}`);};
const str = (v, key) => typeof v === 'string' && v.trim() ? v.trim() : fail(`${key} is required`);
const integer = (v, key) => /^\d+$/.test(v) && Number.isSafeInteger(Number(v)) && Number(v)<=2147483647 ? Number(v) : fail(`${key} must be a nonnegative 32-bit integer`);
const boolean = (v, key) => /^(true|1)$/i.test(v) ? true : /^(false|0)$/i.test(v) ? false : fail(`${key} must be boolean`);
const decimal = (v,key,places) => new RegExp(`^\\d+(?:\\.\\d{1,${places}})?$`).test(v) && Number.isFinite(Number(v)) ? v : fail(`${key} must be a nonnegative decimal`);
const enumeration = (v, values, key) => values.includes(v) ? v : fail(`${key}: invalid enum ${v}`);
const date = (v, key, month=false) => {
 if (!(month ? /^\d{4}-(0[1-9]|1[0-2])$/ : /^\d{4}-\d{2}-\d{2}$/).test(v)) fail(`${key}: invalid date`);
 const text=month?`${v}-01`:v; const d=new Date(`${text}T00:00:00.000Z`);
 if (!Number.isFinite(d.getTime()) || d.toISOString().slice(0,10)!==text) fail(`${key}: invalid date`);
 return d;
};
function unique(rows, key, label) {
 const keys=new Set(); for(const row of rows){const k=key(row);if(keys.has(k))fail(`${label}: duplicate key ${k}`);keys.add(k);}return keys;
}
function loadDataset(directory=DEFAULT_DIR) {
 const raw={};const hash=crypto.createHash('sha256');
 for(const [name,headers] of Object.entries(HEADERS)) {
  const content=fs.readFileSync(path.join(directory,`${name}.csv`));hash.update(name);hash.update(content);
  const records=parse(content,{bom:true,columns:header=>{for(const key of headers.split(' '))if(!header.includes(key))fail(`${name}: missing column ${key}`);if(new Set(header).size!==header.length)fail(`${name}: duplicate column`);return header;},skip_empty_lines:true,trim:true});
  raw[name]=records;
 }
 return {...validateDataset(raw),sourceHash:hash.digest('hex')};
}
function validateDataset(raw) {
 const rows={};
 rows.medicines=raw.medicines.map(r=>({
  sku:str(r.sku,'sku'),name:str(r.name,'name'),brand:r.brand||null,description:str(r.description,'description'),
  priceCents:integer(r.priceCents,'priceCents'),wholesalePriceCents:integer(r.wholesalePriceCents,'wholesalePriceCents'),
  requiresPrescription:boolean(r.requiresPrescription,'requiresPrescription'),category:str(r.category,'category'),subcategory:r.subcategory||null,
  dosageForm:r.dosageForm||null,packSize:r.packSize||null,strength:r.strength||null,manufacturer:r.manufacturer||null,slug:str(r.slug,'slug'),
  status:enumeration(r.status,['DRAFT','PUBLISHED','BLOCKED','ARCHIVED'],'medicine status'),isActive:boolean(r.isActive,'isActive')
 }));
 rows.vendors=raw.vendors.map(r=>({vendorCode:str(r.vendor_code,'vendor_code'),companyName:str(r.companyName,'companyName'),vendorType:enumeration(r.vendorType,['PHARMACY','DISTRIBUTOR','MANUFACTURER'],'vendorType'),country:str(r.country,'country'),state:str(r.state,'state'),city:str(r.city,'city'),verificationStatus:enumeration(r.verificationStatus,['PENDING'],'verificationStatus'),isDemo:boolean(r.isDemo,'isDemo')}));
 if(rows.vendors.some(r=>!r.isDemo))fail('all supplied vendors must be identified as demo');
 rows.inventory=raw.inventory.map(r=>({inventoryCode:str(r.inventory_code,'inventory_code'),sku:str(r.sku,'sku'),vendorCode:str(r.vendor_code,'vendor_code'),quantity:integer(r.quantity,'quantity'),reservedQuantity:integer(r.reservedQuantity,'reservedQuantity'),reorderLevel:integer(r.reorderLevel,'reorderLevel'),sellingPriceCents:integer(r.sellingPriceCents,'sellingPriceCents'),costPriceCents:integer(r.costPriceCents,'costPriceCents'),mrpCents:integer(r.mrpCents,'mrpCents'),isActive:boolean(r.isActive,'isActive'),lastRestockedAt:date(r.lastRestockedAt,'lastRestockedAt')}));
 rows.medicine_references=raw.medicine_references.map(r=>{
  const url=r.source_url ? new URL(r.source_url) : null;if(url && url.protocol!=='https:')fail('references require HTTPS sources');
  return {sku:str(r.sku,'reference sku'),name:str(r.name,'reference name'),activeIngredients:str(r.active_ingredients,'active_ingredients'),strength:str(r.strength,'strength'),sourceUrl:url?.href || null,priceDataType:str(r.price_data_type,'price_data_type'),rxDataType:str(r.rx_data_type,'rx_data_type'),note:str(r.note,'note')};
 });
 rows.demand_history=raw.demand_history.map(r=>({month:date(r.month,'month',true),sku:str(r.sku,'sku'),vendorCode:str(r.vendor_code,'vendor_code'),pastMonthSales:integer(r.past_month_sales,'past_month_sales'),price:decimal(r.price,'price',2),stockLevel:integer(r.stock_level,'stock_level'),seasonalityIndex:decimal(r.seasonality_index,'seasonality_index',3),promotionActive:boolean(r.promotion_active,'promotion_active'),nextMonthSales:integer(r.next_month_sales,'next_month_sales')}));
 rows.orders=raw.orders.map(r=>({orderCode:str(r.order_code,'order_code'),demoCustomerCode:str(r.demo_customer_code,'demo_customer_code'),vendorCode:str(r.vendor_code,'vendor_code'),orderMonth:date(r.order_month,'order_month',true),status:enumeration(r.status,['PENDING','PAID','SHIPPED','CANCELLED'],'order status'),currencyCode:enumeration(r.currencyCode,['INR'],'currencyCode'),totalCents:integer(r.totalCents,'totalCents'),recordType:enumeration(r.record_type,['SYNTHETIC'],'record_type')}));
 rows.order_items=raw.order_items.map(r=>({orderCode:str(r.order_code,'order_code'),lineNo:integer(r.line_no,'line_no'),sku:str(r.sku,'sku'),vendorCode:str(r.vendor_code,'vendor_code'),quantity:integer(r.quantity,'quantity'),unitPriceCents:integer(r.unitPriceCents,'unitPriceCents'),lineTotalCents:integer(r.lineTotalCents,'lineTotalCents')}));
 const skus=unique(rows.medicines,r=>r.sku,'medicines');unique(rows.medicines,r=>r.slug,'slugs');
 const vendors=unique(rows.vendors,r=>r.vendorCode,'vendors');
 const pairs=unique(rows.inventory,r=>`${r.sku}|${r.vendorCode}`,'inventory pair');unique(rows.inventory,r=>r.inventoryCode,'inventory_code');
 const references=unique(rows.medicine_references,r=>r.sku,'references');
 const orders=unique(rows.orders,r=>r.orderCode,'orders');
 unique(rows.order_items,r=>`${r.orderCode}|${r.lineNo}`,'order item');
 unique(rows.demand_history,r=>`${r.month.toISOString()}|${r.sku}|${r.vendorCode}`,'demand history');
 for(const row of [...rows.inventory,...rows.medicine_references,...rows.demand_history,...rows.order_items])if(!skus.has(row.sku))fail(`unknown SKU ${row.sku}`);
 for(const row of [...rows.inventory,...rows.demand_history,...rows.orders,...rows.order_items])if(!vendors.has(row.vendorCode))fail(`unknown vendor ${row.vendorCode}`);
 for(const row of [...rows.demand_history,...rows.order_items])if(!pairs.has(`${row.sku}|${row.vendorCode}`))fail(`missing inventory relation ${row.sku}/${row.vendorCode}`);
 for(const row of rows.inventory)if(row.reservedQuantity>row.quantity)fail('reserved stock exceeds quantity');
 const orderByCode=new Map(rows.orders.map(r=>[r.orderCode,r]));const totals=new Map();
 for(const row of rows.order_items){
  if(!orders.has(row.orderCode))fail(`unknown order ${row.orderCode}`);
  if(row.lineNo<1||row.quantity<1||row.quantity*row.unitPriceCents!==row.lineTotalCents)fail(`invalid line total ${row.orderCode}`);
  if(row.vendorCode!==orderByCode.get(row.orderCode).vendorCode)fail(`order vendor mismatch ${row.orderCode}`);
  totals.set(row.orderCode,(totals.get(row.orderCode)||0)+row.lineTotalCents);
 }
 for(const row of rows.orders)if(totals.get(row.orderCode)!==row.totalCents)fail(`order total mismatch ${row.orderCode}`);
 if(references.size!==skus.size)fail('every medicine must have a reference');
 const counts=Object.fromEntries(Object.entries(rows).map(([key,value])=>[key,value.length]));
 for(const [key,value]of Object.entries(EXPECTED))if(counts[key]!==value)fail(`${key}: expected ${value}, found ${counts[key]}`);
 rows.demand_history.sort((a,b)=>a.sku.localeCompare(b.sku)||a.vendorCode.localeCompare(b.vendorCode)||a.month-b.month);
 return {rows,counts};
}
const MODELS={medicine_references:'medicineReference',vendors:'demoVendor',inventory:'demoInventory',demand_history:'demoDemandHistory',orders:'demoOrder',order_items:'demoOrderItem'};
async function getCounts(db,datasetId=DATASET_ID) {
 const counts={};
 counts.medicines=await db.medicine.count({where:{meta:{path:['dataset','id'],equals:datasetId}}});
 for(const [key,model]of Object.entries(MODELS))counts[key]=await db[model].count({where:{datasetId}});
 return counts;
}
async function operationalCounts(db) {
 const out={};for(const model of ['user','vendor','inventory','order','orderItem','payment'])out[model]=await db[model].count();return out;
}
async function importDataset(db,dataset) {
 const {rows,counts,sourceHash}=dataset;
 return db.$transaction(async tx=>{
  await tx.$queryRaw`SELECT pg_advisory_xact_lock(742690134)::text`;
  const before=await operationalCounts(tx);
  const existing=await tx.demoDataset.findUnique({where:{id:DATASET_ID}});
  if(existing){
   if(existing.sourceHash!==sourceHash)throw new Error('Dataset source changed; use a reviewed versioned import rather than overwriting existing data');
   const actual=await getCounts(tx);assert.deepEqual(actual,counts,'Imported dataset counts changed');
   return {status:'already-imported',counts:actual,rejected:0,operationalCounts:before};
  }
  const sourceSkus=rows.medicines.map(r=>r.sku);const slugs=rows.medicines.map(r=>r.slug);
  const conflicts=await tx.medicine.count({where:{OR:[{sku:{in:sourceSkus}},{slug:{in:slugs}}]}});
  if(conflicts)throw new Error('SKU/slug collision with existing catalog; import aborted without changing existing medicines');
  await tx.demoDataset.create({data:{id:DATASET_ID,sourceHash,counts}});
  const medicineIds=new Map();
  for(const medicine of rows.medicines){
   const data={...medicine,status:'DRAFT',isActive:false,meta:{dataset:{id:DATASET_ID,synthetic:true,currencyCode:'INR',sourceHash},reviewRequired:true}};
   const record=await tx.medicine.upsert({where:{sku:medicine.sku},update:{},create:data,select:{id:true}});medicineIds.set(medicine.sku,record.id);
  }
  for(const key of ['vendors','inventory','medicine_references','orders','order_items','demand_history']){
   const data=rows[key].map(row=>({datasetId:DATASET_ID,...row,...(['inventory','medicine_references'].includes(key)?{medicineId:medicineIds.get(row.sku)}:{})}));
   for(let start=0;start<data.length;start+=400)await tx[MODELS[key]].createMany({data:data.slice(start,start+400)});
  }
  const actual=await getCounts(tx);assert.deepEqual(actual,counts,'Import count verification failed');
  assert.deepEqual(await operationalCounts(tx),before,'Operational data changed');
  return {status:'imported',counts:actual,rejected:0,operationalCounts:before};
 },{timeout:120000,maxWait:30000,isolationLevel:'Serializable'});
}
async function main(){
 const args=process.argv.slice(2);const allowed=new Set(['--dry-run','--validate','--dir']);
 for(let i=0;i<args.length;i++){if(!allowed.has(args[i]))throw new Error(`Unknown argument ${args[i]}`);if(args[i]==='--dir')i++;}
 const index=args.indexOf('--dir');const directory=index>=0?args[index+1]:DEFAULT_DIR;
 const dataset=loadDataset(directory);console.log(JSON.stringify({status:'validated',counts:dataset.counts,total:Object.values(dataset.counts).reduce((a,b)=>a+b,0),sourceHash:dataset.sourceHash}));
 if(args.includes('--dry-run')||args.includes('--validate'))return;
 require('../src/config/env').loadEnv();if(!process.env.DATABASE_URL)throw new Error('DATABASE_URL is required for import');
 const {PrismaClient}=require('@prisma/client');const db=new PrismaClient();
 try{await db.$queryRaw`SELECT 1`;console.log(JSON.stringify(await importDataset(db,dataset)));}finally{await db.$disconnect();}
}
if(require.main===module)main().catch(error=>{console.error(error.message);process.exitCode=1;});
module.exports={DATASET_ID,DEFAULT_DIR,EXPECTED,loadDataset,validateDataset,importDataset,getCounts,operationalCounts};
