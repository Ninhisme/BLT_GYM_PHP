import express, { Request, Response } from "express";
import { Console } from "console";
import { AppDataSource } from "../../data-source";
import path from "path";
import multer from "multer";
import { Blogs } from "../../entity/BLogs";
import { Topic } from "../../entity/Topic";





/**
 * Router Definition
 */
export const blogsRouter = express.Router();

var storage = multer.diskStorage({
  destination: './public/images/blogs',
  filename: function(req,file,cb){
    return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
})
var upload = multer({
  storage:storage
})




// ALL CATEGORY
blogsRouter.get("/allBlog", async (req: Request, res: Response) => {
  try {
    
    const blogs = await AppDataSource.manager
    .createQueryBuilder(Blogs, 'blogs')
    .leftJoinAndSelect('blogs.topic', 'topic')
    .select(['blogs.id', 'blogs.title_blog','blogs.img_thum', 'blogs.by_user',  'topic.topic'])
    .getMany();
  
    res.render("admin/blogs/allBlog",{ blogs });
  } catch (e: any) {
    res.status(500).send(e.message);
  }
  
});


blogsRouter.get("/addBlog", async (req: Request, res: Response) => {
    try {
      const items = await AppDataSource.manager.find(Topic);
      res.render("admin/blogs/addBlog", { items });
    } catch (e: any) {
  
      res.status(500).send(e.message);
    }
  });

blogsRouter.post("/postBlog", upload.single('image'), async (req: Request, res: Response) => {
  
    await AppDataSource.createQueryBuilder()
      .insert()
      .into(Blogs)
      .values({
        title_blog: req.body.blog_title,
        desc_blog: req.body.description,
        content_blog: req.body.content_blog,
        img_thum: req.file.filename,
        by_user: req.body.by_user,
        topic: req.body.blog_op,
      })
      .execute();
      
     res.redirect("/blogs-admin/allBlog");
  });

  blogsRouter.get('/editBlog/(:id)', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    const topic = await AppDataSource.manager.find(Topic);
    const Items = AppDataSource.getRepository(Blogs)
    const item = await Items.findOneBy({id})
    // Hàm gọi ra file items/edit và mang theo biến item
    res.render("admin/blogs/editBlog",{item, topic});
    
  });

  blogsRouter.post("/updateBlog/(:id)",upload.single('image'), async (req: Request, res: Response) => {
  
    const id: number = parseInt(req.params.id, 10);
    await AppDataSource.createQueryBuilder()
      .update(Blogs)
      .set({
        title_blog: req.body.blog_title,
        desc_blog: req.body.description,
        content_blog: req.body.content_blog,
        img_thum: req.file.filename,
        by_user: req.body.by_user,
        topic: req.body.blog_op,
      })
      .where("id = :id", { id })
      .execute();
    // Hàm gọi ra file items/edit và mang theo biến item
    return res.redirect("/blogs-admin/allBlog");
  });

  blogsRouter.get("/deleteBlog/(:id)", async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    await AppDataSource
      .createQueryBuilder()
      .delete()
      .from(Blogs)
      .where("id = :id", { id })
      .execute()
      res.redirect("/blogs-admin/allBlog");
  
  });