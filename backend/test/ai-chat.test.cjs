const {test} = require('node:test');
const assert = require('node:assert/strict');
process.env.GROQ_API_KEY = 'test-key-not-a-real-credential';
const sessions = new Map();
const dbPath = require.resolve('../src/database/prisma');
require.cache[dbPath] = {id:dbPath,filename:dbPath,loaded:true,exports:{prisma:{
 aiChatSession:{findUnique:async({where})=>sessions.get(where.id),upsert:async({where,create,update})=>{sessions.set(where.id, structuredClone(sessions.has(where.id)?{id:where.id,...update}:create));}},
 inventory:{findMany:async()=>[]}
}}};
const requests=[];
global.fetch=async(url, options)=>{
 assert.match(String(url),/api.groq.com/);
 if (String(url).endsWith('/models')) return new Response(JSON.stringify({data:[{id:'llama-3.3-70b-versatile'}]}),{status:200,headers:{'Content-Type':'application/json'}});
 requests.push(JSON.parse(options.body));
 return new Response(JSON.stringify({choices:[{message:{content:'A contextual answer from the mocked model'}}]}),{status:200,headers:{'Content-Type':'application/json'}});
};
const servicePath=require.resolve('../src/modules/ai/ai.service');
let service=require(servicePath);
test('chat uses Groq, restores persisted history after a cold start, and handles emergencies',async()=>{
 const first=await service.chatWithRag({message:'How do I track my order?',sessionId:'test-session'});
 assert.equal(first.source,'groq');assert.match(first.reply,/contextual answer/);
 delete require.cache[servicePath];service=require(servicePath);
 const second=await service.chatWithRag({message:'And what about delivery delays?',sessionId:'test-session'});
 assert.equal(second.source,'groq');
 assert(requests[1].messages.some(m=>m.role==='user'&&m.content==='How do I track my order?'));
 assert(requests[1].messages.some(m=>m.role==='assistant'&&m.content===first.reply));
 const count=requests.length;
 const urgent=await service.chatWithRag({message:'I have chest pain and cannot breathe',sessionId:'emergency'});
 assert.equal(urgent.type,'redflag');assert.match(urgent.reply,/emergency/);assert.equal(requests.length,count);
});
test('rejects oversized messages and malformed session IDs before calling the service',async()=>{
 const controller=require('../src/modules/ai/ai.controller');
 for(const body of [{message:'x'.repeat(4001)},{message:'hello',sessionId:{bad:true}},{message:'hello',context:[]}]){
  let status;await controller.chat({body},{status:n=>{status=n;return{json:()=>{}}}},e=>{throw e;});assert.equal(status,400);
 }
});
