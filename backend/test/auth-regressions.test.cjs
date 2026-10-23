const {test} = require('node:test');
const assert = require('node:assert/strict');
process.env.JWT_SECRET = 'local-regression-test-key-only';
const bcrypt = require('bcryptjs');
const dbPath = require.resolve('../src/database/prisma');
let user;
const updates = [];
const prisma = {
  user: {
    findFirst: async () => ({...user}),
    findUnique: async () => ({...user}),
    update: async args => { updates.push(args); return {...user}; }
  },
  customer: {findFirst: async () => null},
  $transaction: async operations => Promise.all(operations),
  systemSetting: {upsert: async args => {assert(!('type' in args.create)); return args.create;}}
};
require.cache[dbPath] = {id:dbPath,filename:dbPath,loaded:true,exports:{prisma}};
const service = require('../src/modules/auth/auth.service');
const controller = require('../src/modules/auth/auth.controller');
const {authenticate} = require('../src/middlewares/auth.middleware');
test('account and session regressions', async t => {
 user = {id:'test-user',email:'test@example.invalid',role:'CUSTOMER',isActive:true,isProfileComplete:false,passwordHash:await bcrypt.hash('TestPassword123',4)};
 await t.test('incomplete customer can log back in to finish onboarding', async()=>{
  const result=await service.login({email:user.email,password:'TestPassword123',role:'CUSTOMER'});
  assert(result.token); assert.deepEqual(result.user.availableRoles,['CUSTOMER']); assert(!('passwordHash' in result.user));
 });
 await t.test('verified admin can sign in through customer selector without a customer profile',async()=>{
  user.role='ADMIN';
  const result=await service.login({email:user.email,password:'TestPassword123',role:'CUSTOMER'});
  assert.equal(result.user.role,'ADMIN'); assert.deepEqual(result.user.availableRoles,['ADMIN']);
  await assert.rejects(service.login({email:user.email,password:'WrongPassword123',role:'ADMIN'}),/Invalid credentials/);
  user.role='CUSTOMER';
  await assert.rejects(service.login({email:user.email,password:'TestPassword123',role:'ADMIN'}),/administrator privileges/);
 });
 await t.test('profile response does not contain password hash', async()=>{
  assert(!('passwordHash' in await service.updateProfile(user.id,{})));
 });
 await t.test('logout-all invokes session invalidation successfully',async()=>{
  let response; await controller.logoutAllSessions({user:{id:user.id}},{json:v=>{response=v;}},e=>{throw e;});
  assert(response.success); assert(updates.at(-1).data.tokenInvalidBefore instanceof Date);
 });
 await t.test('revoked token is rejected including same-second issuance',async()=>{
  const token=service.generateToken(user); user.tokenInvalidBefore=new Date();
  let status; let body; await authenticate({headers:{authorization:`Bearer ${token}`}},{status:v=>{status=v;return {json:v=>{body=v;}};}},()=>assert.fail('revoked session accepted'));
  assert.equal(status,401); assert.match(body.message,/invalidated/);
 });
 await t.test('inactive user cannot log in',async()=>{
  user.isActive=false; await assert.rejects(service.login({email:user.email,password:'TestPassword123'}),/inactive/);
 });
 await t.test('default settings match Prisma model fields',async()=>{
  await require('../src/utils/seedSystemSettings').seedSystemSettings();
 });
});
