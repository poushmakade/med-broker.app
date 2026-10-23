const assert=require('node:assert/strict');
const {PrismaClient}=require('@prisma/client');
const jwt=require('jsonwebtoken');
const {DATASET_ID}=require('./import-medicine-dataset');
const db=new PrismaClient();
(async()=>{
 const admin=await db.user.findFirst({where:{role:'ADMIN',isActive:true,isBanned:false},select:{id:true}});
 assert(admin,'An existing administrator is required for API verification');
 const server=require('../app').listen(0,'127.0.0.1');
 await new Promise(resolve=>server.once('listening',resolve));
 const base=`http://127.0.0.1:${server.address().port}`;
 const token=jwt.sign({id:admin.id},process.env.JWT_SECRET,{expiresIn:'60s'});
 const get=async(path,authenticated=true)=>{
  const r=await fetch(base+path,{headers:authenticated?{Authorization:`Bearer ${token}`}:{}});
  const body=await r.json();return {status:r.status,body};
 };
 const blocked=await get('/api/admin/datasets/medicine-demo',false);assert.equal(blocked.status,401);
 const summary=await get('/api/admin/datasets/medicine-demo');assert.equal(summary.status,200);assert.equal(summary.body.data.counts.demand_history,4176);assert.equal(summary.body.data.publiclyPurchasable,false);
 const catalog=await get('/api/admin/catalog?search=MED-0001');assert.equal(catalog.status,200);assert.equal(catalog.body.pagination.total,1);assert.equal(catalog.body.data[0].priceCents,10000);assert.equal(catalog.body.data[0].status,'DRAFT');
 for(const search of ['Dolo','Pain %26 Fever','MED-0001']){
  const result=await get('/api/admin/datasets/medicine-demo/catalog?search='+search);assert.equal(result.status,200);assert(result.body.pagination.total>0);
 }
 const demand=await get('/api/admin/datasets/medicine-demo/demand?sku=MED-0001&vendorCode=V001&limit=100');assert.equal(demand.status,200);assert.equal(demand.body.data.length,24);assert.equal(Number(demand.body.data[0].price),107);
 const orders=await get('/api/admin/datasets/medicine-demo/orders');assert.equal(orders.status,200);assert.equal(orders.body.pagination.total,150);assert.equal(orders.body.isDemo,true);
 const preview=await get('/api/medicines/demo?limit=100',false);assert.equal(preview.status,200);assert.equal(preview.body.data.length,80);assert(preview.body.data.every(m=>m.isDemo&&!m.inStock&&!m.purchasable));
 const previewDetail=await get('/api/medicines/demo/'+preview.body.data[0].id,false);assert.equal(previewDetail.status,200);assert.equal(previewDetail.body.data.retailPrice,100);
 const publicResult=await get('/api/medicines?search=MED-0001',false);assert.equal(publicResult.status,200);assert.equal(publicResult.body.data.length,0);
 assert.equal(await db.medicine.count({where:{meta:{path:['dataset','id'],equals:DATASET_ID},status:'DRAFT',isActive:false}}),80);
 console.log('PASS dataset admin API, catalog searches, pagination, demand ordering, synthetic orders, and public isolation');
 await db.$disconnect();server.close();process.exit(0);
})().catch(async error=>{console.error(error.message);await db.$disconnect();process.exit(1);});
