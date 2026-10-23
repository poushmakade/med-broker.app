const assert = require('node:assert/strict');
const { resolveOrderItemUnitPriceCents, validatePricingLogic } = require('../src/modules/orders/orderPricing.util');
const { ValidationError } = require('../src/utils/errors');

// The marketplace uses retail and wholesale tiers; quantity does not add a bulk tier.
const medicine = { priceCents: 1000, wholesalePriceCents: 850 };
for (const quantity of [1, 5, 10, 100]) {
  assert.equal(resolveOrderItemUnitPriceCents({medicine, buyerType:'RETAIL', quantity}),1000);
  assert.equal(resolveOrderItemUnitPriceCents({medicine, buyerType:'WHOLESALE', quantity}),850);
}
assert.equal(resolveOrderItemUnitPriceCents({medicine:{priceCents:1000},buyerType:'WHOLESALE'}),1000);
assert.equal(resolveOrderItemUnitPriceCents({medicine,buyerType:'wholesale'}),850);
assert.equal(resolveOrderItemUnitPriceCents({medicine}),1000);
assert.throws(()=>validatePricingLogic({priceCents:1000,wholesalePriceCents:1100}),ValidationError);
assert.doesNotThrow(()=>validatePricingLogic(medicine));
console.log('order pricing tests passed (13 assertions)');
