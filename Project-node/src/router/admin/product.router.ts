import express, { Request, Response } from "express";
import { Console } from "console";
import { AppDataSource } from "../../data-source";
import path from "path";
import multer from "multer";
import { Product } from "../../entity/Product";
import { Category } from "../../entity/Category";




/**
 * Router Definition
 */
export const productRouter = express.Router();

var storage = multer.diskStorage({
  destination: './public/images',
  filename: function(req,file,cb){
    return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
})
var upload = multer({
  storage:storage
})




// ALL CATEGORY
productRouter.get("/allProduct", async (req: Request, res: Response) => {
  try {
    
    // const items: Item[] = await ItemService.findAll();
    // const items = await AppDataSource.manager.find(Product);
    const products = await AppDataSource.manager
    .createQueryBuilder(Product, 'product')
    .leftJoinAndSelect('product.category', 'category')
    .select(['product.id', 'product.product_name','product.product_img', 'product.by_producer', 'product.status', 'category.category'])
    .getMany();
  // console.log(items);
  
    res.render("admin/product/allProduct", { products });
  } catch (e: any) {
    res.status(500).send(e.message);
  }
  
});

// // ADD CATEGORY
productRouter.get("/addProduct", async (req: Request, res: Response) => {
  try {
    const items = await AppDataSource.manager.find(Category);
    res.render("admin/product/addProduct", { items });
  } catch (e: any) {

    res.status(500).send(e.message);
  }
});

// //POST CATEGORY
productRouter.post("/addProduct", upload.single('image'), async (req: Request, res: Response) => {
  
  await AppDataSource.createQueryBuilder()
    .insert()
    .into(Product)
    .values({
      product_name: req.body.product_title,
      category: req.body.category_op,
      status: req.body.category_status,
      product_img: req.file.filename,
      product_desc: req.body.description,
      by_producer: req.body.by_product,
      main_price: req.body.price_main,
      sale_price: req.body.price_sale,

    })
    .execute();
    
   res.redirect("/product/allProduct");
});

// //EDIT ROuter Lay ID  Tạo API 
productRouter.get('/editProduct/(:id)', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  const categories = await AppDataSource.manager.find(Category);
  const Items = AppDataSource.getRepository(Product)
  const item = await Items.findOneBy({id})
  // Hàm gọi ra file items/edit và mang theo biến item
  res.render("admin/product/editProduct",{item, categories});
  
});

// //Update EDIT
productRouter.post("/updateProduct/(:id)",upload.single('image'), async (req: Request, res: Response) => {
  
  const id: number = parseInt(req.params.id, 10);
  await AppDataSource.createQueryBuilder()
    .update(Product)
    .set({
      product_name: req.body.product_title,
      category: req.body.category_op,
      product_img: req.file.filename,
      product_desc: req.body.description,
      by_producer: req.body.by_product,
      main_price: req.body.price_main,
      sale_price: req.body.price_sale,
      status: req.body.category_status,
    })
    .where("id = :id", { id })
    .execute();
  // Hàm gọi ra file items/edit và mang theo biến item
  return res.redirect("/product/allProduct");
});


productRouter.get("/deleteProduct/(:id)", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  await AppDataSource
    .createQueryBuilder()
    .delete()
    .from(Product)
    .where("id = :id", { id })
    .execute()
    res.redirect("/product/allProduct");

});

productRouter.get('/detailProduct/(:id)', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  const item = await AppDataSource.manager
        .createQueryBuilder(Product, 'product')
        .leftJoinAndSelect('product.category', 'category').where('product.id = :id', {id})
        .select(['product.id', 'product.product_name','product.product_img', 'product.by_producer','product.product_desc',
        'product.main_price','product.sale_price','category.category'])
        .getOne();
  // Hàm gọi ra file items/edit và mang theo biến item
  res.render("admin/product/detailProduct",{item});
  
});

productRouter.get("/allCardProduct", async (req: Request, res: Response) => {
  try {
    
    // const items: Item[] = await ItemService.findAll();
    // const items = await AppDataSource.manager.find(Product);
    const products = await AppDataSource.manager
    .createQueryBuilder(Product, 'product')
    .leftJoinAndSelect('product.category', 'category')
    .select(['product.id', 'product.product_name','product.product_img', 'product.by_producer',
    'product.sale_price','product.main_price', 'product.status', 'category.category'])
    .getMany();
  // console.log(items);
  
    res.render("admin/product/allcardProduct", { products });
  } catch (e: any) {
    res.status(500).send(e.message);
  }
  
});
