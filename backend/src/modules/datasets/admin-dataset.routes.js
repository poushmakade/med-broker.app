const express = require('express');
const {prisma} = require('../../database/prisma');
const {DATASET_ID,getCounts} = require('../../../scripts/import-medicine-dataset');
const router=express.Router();
// Mounted inside the existing ADMIN-only router. These records never enter operational reports.
const paged=query=>({page:Math.max(1,parseInt(query.page,10)||1),limit:Math.min(100,Math.max(1,parseInt(query.limit,10)||25))});
router.get('/medicine-demo',async(req,res,next)=>{
 try{
  const dataset=await prisma.demoDataset.findUnique({where:{id:DATASET_ID}});
  if(!dataset)return res.status(404).json({success:false,message:'Dataset not imported'});
  res.json({success:true,data:{...dataset,counts:await getCounts(prisma),isDemo:true,currencyCode:'INR',publiclyPurchasable:false,missingSourceUrls:await prisma.medicineReference.count({where:{datasetId:DATASET_ID,sourceUrl:null}})}});
 }catch(e){next(e);}
});
router.get('/medicine-demo/catalog',async(req,res,next)=>{
 try{
  const {page,limit}=paged(req.query);const search=String(req.query.search||'').trim();
  const where={datasetId:DATASET_ID,...(search?{medicine:{OR:['name','brand','category','sku'].map(key=>({[key]:{contains:search,mode:'insensitive'}}))}}:{})};
  const [items,total]=await Promise.all([prisma.medicineReference.findMany({where,include:{medicine:{include:{demoInventory:{where:{datasetId:DATASET_ID},include:{vendor:true}}}}},orderBy:{sku:'asc'},skip:(page-1)*limit,take:limit}),prisma.medicineReference.count({where})]);
  res.json({success:true,data:items,isDemo:true,currencyCode:'INR',pagination:{page,limit,total,totalPages:Math.ceil(total/limit)}});
 }catch(e){next(e);}
});
router.get('/medicine-demo/demand',async(req,res,next)=>{
 try{
  const {page,limit}=paged(req.query);
  const where={datasetId:DATASET_ID,...(req.query.sku?{sku:String(req.query.sku)}:{}),...(req.query.vendorCode?{vendorCode:String(req.query.vendorCode)}:{})};
  const [items,total]=await Promise.all([prisma.demoDemandHistory.findMany({where,orderBy:[{sku:'asc'},{vendorCode:'asc'},{month:'asc'}],skip:(page-1)*limit,take:limit}),prisma.demoDemandHistory.count({where})]);
  res.json({success:true,data:items,isDemo:true,priceUnit:'INR',featureOrder:['pastMonthSales','price','stockLevel','seasonalityIndex','promotionActive'],pagination:{page,limit,total,totalPages:Math.ceil(total/limit)}});
 }catch(e){next(e);}
});
router.get('/medicine-demo/orders',async(req,res,next)=>{
 try{
  const {page,limit}=paged(req.query);const where={datasetId:DATASET_ID};
  const [items,total,totals]=await Promise.all([prisma.demoOrder.findMany({where,include:{items:true},orderBy:[{orderMonth:'asc'},{orderCode:'asc'}],skip:(page-1)*limit,take:limit}),prisma.demoOrder.count({where}),prisma.demoOrder.aggregate({where,_sum:{totalCents:true}})]);
  res.json({success:true,data:items,isDemo:true,currencyCode:'INR',syntheticTotalCents:totals._sum.totalCents||0,pagination:{page,limit,total,totalPages:Math.ceil(total/limit)}});
 }catch(e){next(e);}
});
module.exports=router;
