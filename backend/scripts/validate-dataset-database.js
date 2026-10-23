// Integration test in a newly created schema. Never resets or truncates public tables.
const fs = require('node:fs');
const path = require('node:path');
const {randomUUID} = require('node:crypto');
const assert = require('node:assert/strict');
const {PrismaClient} = require('@prisma/client');
const {loadDataset,importDataset,getCounts,operationalCounts} = require('./import-medicine-dataset');
require('../src/config/env').loadEnv();
async function validateDatabase(){
 if(!process.env.DATABASE_URL)throw new Error('DATABASE_URL is required');
 const admin=new PrismaClient();
 const schema=`dataset_validation_${randomUUID().replaceAll('-','')}`;
 assert(/^dataset_validation_[a-f0-9]{32}$/.test(schema));
 const url=new URL(process.env.DATABASE_URL);url.searchParams.set('schema',schema);
 const db=new PrismaClient({datasources:{db:{url:url.toString()}}});
 let created=false;
 try {
  await admin.$executeRawUnsafe(`CREATE SCHEMA "${schema}"`);created=true;
  await db.$transaction(async tx=>{
   // Prisma qualifies model queries but raw SQL uses PostgreSQL's current search_path.
   // SET LOCAL keeps all initialization DDL inside this transaction's test schema.
   await tx.$executeRawUnsafe(`SET LOCAL search_path TO "${schema}"`);
   const current=await tx.$queryRaw`SELECT current_schema() AS schema`;
   assert.equal(current[0].schema,schema,'Schema isolation failed');
   for(const file of ['dataset-validation-schema.sql','../prisma/migrations/20261021190000_isolated_demo_dataset/migration.sql']){
    const sql=fs.readFileSync(path.resolve(__dirname,file),'utf8');
    for(const statement of sql.split(';').map(s=>s.replace(/--[^\n]*(\n|$)/g,'').trim()).filter(Boolean))await tx.$executeRawUnsafe(statement);
   }
   for(const table of ['User','Vendor','Inventory','Order','OrderItem','Payment'])await tx.$executeRawUnsafe(`CREATE TABLE "${table}" (id TEXT PRIMARY KEY)`);
   await tx.$executeRawUnsafe(`INSERT INTO "User" (id) VALUES ('preserved-user')`);
   await tx.$executeRawUnsafe(`INSERT INTO "Order" (id) VALUES ('preserved-order')`);
  },{timeout:60000});
  const before=await operationalCounts(db);const dataset=loadDataset();
  const first=await importDataset(db,dataset);assert.equal(first.status,'imported');
  const second=await importDataset(db,dataset);assert.equal(second.status,'already-imported');
  assert.deepEqual(await getCounts(db),dataset.counts);assert.deepEqual(await operationalCounts(db),before);
  const medicine=await db.medicine.findUnique({where:{sku:'MED-0001'}});
  assert.equal(medicine.priceCents,10000);assert.equal(medicine.status,'DRAFT');assert.equal(medicine.isActive,false);
  assert.equal(await db.demoVendor.count({where:{verificationStatus:'VERIFIED'}}),0);
  const demand=await db.demoDemandHistory.findFirst({where:{sku:'MED-0001',vendorCode:'V001'},orderBy:{month:'asc'}});
  assert.equal(Number(demand.price),107);assert.equal(demand.month.toISOString().slice(0,7),'2024-10');
  console.log(JSON.stringify({status:'isolated-database-tests-passed',schema,counts:second.counts,idempotent:true,operationalDataPreserved:true}));
 } finally {
  await db.$disconnect();
  // Only drop the random schema created by this invocation, never a supplied name.
  if(created)await admin.$executeRawUnsafe(`DROP SCHEMA "${schema}" CASCADE`);
  await admin.$disconnect();
 }
}
if(require.main===module)validateDatabase().catch(e=>{console.error(e.message);process.exitCode=1;});
module.exports={validateDatabase};
