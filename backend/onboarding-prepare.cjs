const assert = require('node:assert/strict');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  await prisma.aiChatSession.deleteMany({where:{expiresAt:{lt:new Date()}}});
  const base = process.env.EXCHANGE_RATE_BASE || 'INR';
  if (!await prisma.exchangeRate.findUnique({where:{baseCode:base}})) {
    const r = await fetch(`https://open.er-api.com/v6/latest/${base}`);
    assert(r.ok, 'Exchange-rate provider request failed');
    const data = await r.json();
    assert(data.result === 'success' && data.base_code === base && data.rates[base] === 1);
    await prisma.exchangeRate.create({data:{baseCode:base,rates:data.rates,fetchedAt:new Date(data.time_last_update_unix*1000),source:'open.er-api.com'}});
    console.log('Cached provider exchange rates');
  }
  const countries = [
    ['IN','India','+91','INR'], ['US','United States','+1','USD'],
    ['GB','United Kingdom','+44','GBP'], ['CA','Canada','+1','CAD'],
    ['AU','Australia','+61','AUD'], ['AE','UAE','+971','AED'],
    ['SG','Singapore','+65','SGD'], ['KE','Kenya','+254','KES'],
    ['ZA','South Africa','+27','ZAR'], ['DE','Germany','+49','EUR']
  ];
  for (const [code,name,dialCode,currencyCode] of countries) {
    await prisma.country.upsert({where:{code},update:{},create:{code,name,dialCode,currencyCode}});
  }
  await require('./src/utils/seedSystemSettings').seedSystemSettings();
  if (process.env.GROQ_API_KEY) {
    try {
      const Groq = require('groq-sdk');
      const client = new Groq({apiKey:process.env.GROQ_API_KEY,timeout:15000,maxRetries:0});
      const model = await require('./src/modules/ai/groq-model').chooseGroqModel(client);
      console.log('Selected available Groq model', model);
      const completion = await client.chat.completions.create({model,max_tokens:512,...(model.includes('gpt-oss') ? {reasoning_effort:'low'} : {}),messages:[{role:'user',content:'Reply with OK.'}]});
      assert(completion.choices[0].message.content);
      console.log('PASS Groq live authentication and generation');
    } catch (error) {
      console.log('Groq error detail', JSON.stringify(error.error || {}).replaceAll(process.env.GROQ_API_KEY, '[REDACTED]'));
      throw new Error(`Groq check failed: status=${error.status || 'none'} code=${error.code || error.name}`);
    }
  }
  const app = require('./app');
  assert.equal(typeof app, 'function');
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening',resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  for (const path of ['/health','/api/medicines','/api/countries']) {
    const response = await fetch(url+path); const data = await response.json();
    assert.equal(response.status,200,`${path}: ${JSON.stringify(data)}`);
    if(path==='/health') assert.equal(data.database,'connected');
    console.log('PASS',path);
  }
  await prisma.$disconnect(); server.close(); process.exit(0);
})().catch(async e=>{ console.error(e.message); await prisma.$disconnect(); process.exit(1); });
