import express, { Request, Response } from "express";
import { Console } from "console";
import { AppDataSource } from "../../data-source";
import path from "path";
import multer from "multer";
import { Product } from "../../entity/Product";



export const homePageRouter = express.Router();

  
// GET items
homePageRouter.get("/", async (req: Request, res: Response) => {
    try {
    
        // const items: Item[] = await ItemService.findAll();
        const items = await AppDataSource.manager
        .createQueryBuilder(Product, 'product')
        .leftJoinAndSelect('product.category', 'category')
        .select(['product.id', 'product.product_name','product.product_img', 'product.by_producer','product.product_desc',
        'product.main_price','product.sale_price','category.category'])
        .getMany();
        res.render("front-end/index", { items });
      } catch (e: any) {
        res.status(500).send(e.message);
      }


});

homePageRouter.get('/detailProduct/(:id)', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  const item = await AppDataSource.manager
        .createQueryBuilder(Product, 'product')
        .leftJoinAndSelect('product.category', 'category').where('product.id = :id', {id})
        .select(['product.id', 'product.product_name','product.product_img', 'product.by_producer','product.product_desc',
        'product.main_price','product.sale_price','category.category'])
        .getOne();
  const items = await AppDataSource.manager
        .createQueryBuilder(Product, 'product')
        .leftJoinAndSelect('product.category', 'category')
        .select(['product.id', 'product.product_name','product.product_img', 'product.by_producer','product.product_desc',
        'product.main_price','product.sale_price','category.category'])
        .getMany();
  const products = items.slice(0,3);
  // Hàm gọi ra file items/edit và mang theo biến item
  res.render("front-end/inf-product/detail-product",{item,products});
  
});
