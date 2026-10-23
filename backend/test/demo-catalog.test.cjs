const {test}=require('node:test');
const assert=require('node:assert/strict');
const dbPath=require.resolve('../src/database/prisma');
require.cache[dbPath]={id:dbPath,filename:dbPath,loaded:true,exports:{prisma:{}}};
const {mapDemoMedicine}=require('../src/modules/medicines/demo-catalog');
test('public demo preview exposes illustrative prices but never fake purchasable stock or manufacturer facts',()=>{
 const item=mapDemoMedicine({id:'demo-id',name:'Example',priceCents:10000,wholesalePriceCents:7200,manufacturer:null,createdAt:new Date()});
 assert.equal(item.retailPrice,100);assert.equal(item.wholesalePrice,72);assert.equal(item.currencyCode,'INR');
 assert.equal(item.isDemo,true);assert.equal(item.purchasable,false);assert.equal(item.inStock,false);assert.equal(item.stockLevel,0);assert.equal(item.vendorId,null);assert.equal(item.manufacturer,null);
});
test('direct cart API service rejects demo medicines before any cart write',async()=>{
 const {prisma}=require('../src/database/prisma');
 prisma.customer={findUnique:async()=>({id:'customer'})};
 prisma.user={findUnique:async()=>({preferredCurrency:'INR'})};
 prisma.medicine={findUnique:async()=>({status:'DRAFT',isActive:false,meta:{dataset:{synthetic:true}}})};
 prisma.cartItem={findFirst:()=>assert.fail('demo stock reached cart lookup'),create:()=>assert.fail('demo cart write')};
 const cart=require('../src/modules/cart/cart.service');
 await assert.rejects(cart.addItem('test-user',{medicineId:'demo-id'}),/not available for purchase/);
});
