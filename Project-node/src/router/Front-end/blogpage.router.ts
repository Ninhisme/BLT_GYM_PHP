import express, { Request, Response } from "express";
import { Console } from "console";
import { AppDataSource } from "../../data-source";
import path from "path";
import multer from "multer";
import { Product } from "../../entity/Product";
import { Blogs } from "../../entity/BLogs";
import { Topic } from "../../entity/Topic";



export const blogPageRouter = express.Router();

blogPageRouter.get("/", async (req: Request, res: Response) => {
    try {
    const topic = await AppDataSource.manager.find(Topic);

      const items = await AppDataSource.manager
      .createQueryBuilder(Blogs, 'blogs')
    .leftJoinAndSelect('blogs.topic', 'topic')
    .select(['blogs.id', 'blogs.title_blog', 'blogs.desc_blog', 'blogs.content_blog', 'blogs.img_thum', 'blogs.by_user',  'topic.topic'])
    .getMany();
    
      res.render("front-end/blogs/list-blog", { items, topic });
    } catch (e: any) {
      res.status(500).send(e.message);
    }
  });

  blogPageRouter.get('/detailBlog/(:id)', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    const item = await AppDataSource.manager
          .createQueryBuilder(Blogs, 'blogs')
          .leftJoinAndSelect('blogs.topic', 'topic').where('blogs.id = :id', {id})
          .select(['blogs.id', 'blogs.title_blog', 'blogs.desc_blog', 'blogs.content_blog', 'blogs.img_thum', 'blogs.by_user',  'topic.topic'])
          .getOne();

          const items = await AppDataSource.manager
          .createQueryBuilder(Product, 'product')
          .leftJoinAndSelect('product.category', 'category')
          .select(['product.id', 'product.product_name','product.product_img', 'product.by_producer','product.product_desc',
          'product.main_price','product.sale_price','category.category'])
          .getMany();

    const topic = await AppDataSource.manager.find(Topic);

    const products = items.slice(0,3);
    // Hàm gọi ra file items/edit và mang theo biến item
    res.render("front-end/blogs/blog-detail",{item,products,topic});
    
  });
  