const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
test('actual frontend service falls back to all 80 read-only examples and preserves real-stock results',async()=>{
 global.localStorage={getItem:()=>null};
 const code=fs.readFileSync(path.resolve(__dirname,'../../frontend/src/services/medicine.service.js'),'utf8').replaceAll('import.meta.env.VITE_API_URL',JSON.stringify('https://api.example.test'));
 const requests=[];
 global.fetch=async url=>{
  requests.push(String(url));
  if(String(url).includes('/demo?'))return new Response(JSON.stringify({isDemo:true,data:Array.from({length:80},(_,i)=>({id:`demo-${i}`,isDemo:true,inStock:false})),pagination:{total:80},currency:'INR'}));
  if(String(url).includes('search=live'))return new Response(JSON.stringify({data:[{id:'real-stock',inStock:true}],pagination:{total:1}}));
  return new Response(JSON.stringify({data:[],pagination:{total:0}}));
 };
 const service=(await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'))).default;
 const demo=await service.getMedicines();assert.equal(demo.isDemo,true);assert.equal(demo.medicines.length,80);assert(demo.medicines.every(m=>!m.inStock));
 const before=requests.length;const real=await service.getMedicines({search:'live'});assert.equal(real.isDemo,false);assert.equal(real.medicines[0].id,'real-stock');assert.equal(requests.length,before+1);
});
