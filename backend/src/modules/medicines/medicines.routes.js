const express = require('express');
const medicinesController = require('./medicines.controller');
const { authenticateOptional } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.get('/', authenticateOptional, medicinesController.getMedicines);
// Explicit read-only preview; no synthetic inventory is exposed as real stock.
router.get('/demo', async (req,res,next)=>{
  try {res.json({success:true,...await require('./demo-catalog').getDemoCatalog(req.query)});}catch(e){next(e);}
});
router.get('/demo/:id', async (req,res,next)=>{
  try {const data=await require('./demo-catalog').getDemoMedicine(req.params.id);if(!data)return res.status(404).json({success:false,message:'Demo product not found'});res.json({success:true,data});}catch(e){next(e);}
});
router.get('/:id', authenticateOptional, medicinesController.getMedicineById);

module.exports = router;
