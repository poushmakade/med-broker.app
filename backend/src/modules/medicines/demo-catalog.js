const {prisma}=require('../../database/prisma');
const {DATASET_ID}=require('../../../scripts/import-medicine-dataset');
const mapDemoMedicine=medicine=>({
 id:medicine.id,medicineId:medicine.id,name:medicine.name,sku:medicine.sku,
 brand:medicine.brand,category:medicine.category,description:medicine.description,
 manufacturer:medicine.manufacturer,strength:medicine.strength,dosageForm:medicine.dosageForm,packSize:medicine.packSize,
 retailPrice:medicine.priceCents/100,wholesalePrice:(medicine.wholesalePriceCents??medicine.priceCents)/100,
 currencyCode:'INR',requiresPrescription:medicine.requiresPrescription,
 isDemo:true,purchasable:false,inStock:false,stockLevel:0,popularity:0,addedAt:medicine.createdAt,
 imageUrl:null,images:[],vendor:null,vendorId:null,
 warnings:'Example product. Price, composition and prescription status require review. Not available for purchase.'
});
const scope={meta:{path:['dataset','id'],equals:DATASET_ID}};
async function getDemoCatalog(query={}){
 const page=Math.max(1,parseInt(query.page,10)||1);const limit=Math.min(100,Math.max(1,parseInt(query.limit,10)||100));
 const search=String(query.search||'').trim();
 const where={...scope,...(search?{OR:['name','brand','category','sku'].map(key=>({[key]:{contains:search,mode:'insensitive'}}))}:{})};
 const [items,total]=await Promise.all([prisma.medicine.findMany({where,orderBy:{sku:'asc'},skip:(page-1)*limit,take:limit}),prisma.medicine.count({where})]);
 return {data:items.map(mapDemoMedicine),isDemo:true,currency:'INR',pagination:{page,limit,total,totalPages:Math.ceil(total/limit)}};
}
async function getDemoMedicine(id){const item=await prisma.medicine.findFirst({where:{...scope,id}});return item?mapDemoMedicine(item):null;}
module.exports={mapDemoMedicine,getDemoCatalog,getDemoMedicine};
