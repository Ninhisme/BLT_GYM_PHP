/*
    Required External Modules and Interfaces
*/

import express, { Request, Response } from "express";
// import * as ItemService from "./items.service";
// import { BaseItem, Item } from "./item.interface";
// import { findAll } from "./items.service";
import { Console } from "console";
import { AppDataSource } from "../../data-source";
import path from "path";
import multer from "multer";
import { Category } from "../../entity/Category";



/**
 * Router Definition
 */
export const adminRouter = express.Router();

// const requireLogin = (req, res, next) => {
//   if (req.session.user) {
//     res.locals.user = req.session.user; ///<----- truyền thông tin user vào biến locals
//     next();
//   } else {
//     res.render("admin/login/login");
//   }
// }

// GET items
adminRouter.get("/", async (req: Request, res: Response) => {
  try {
  
    res.render("admin/index");
  } catch (e: any) {
    res.status(500).send(e.message);
  }
});

// ALL CATEGORY
adminRouter.get("/allCategory", async (req: Request, res: Response) => {
  try {
    
    // const items: Item[] = await ItemService.findAll();
    const items = await AppDataSource.manager.find(Category);
    res.render("admin/category/allCategory", { items });
  } catch (e: any) {
    res.status(500).send(e.message);
    
  }
  
});

// ADD CATEGORY
adminRouter.get("/addCategory", async (req: Request, res: Response) => {
  try {

    res.render("admin/category/addCategory");
  } catch (e: any) {

    res.status(500).send(e.message);
  }
});

// //POST CATEGORY
adminRouter.post("/postCategory", async (req: Request, res: Response) => {
  
  await AppDataSource.createQueryBuilder()
    .insert()
    .into(Category)
    .values({
      category: req.body.category_name,
    })
    .execute();
    
   res.redirect("/admin/allCategory");
});

// //EDIT ROuter Lay ID  Tạo API 
adminRouter.get('/editCategory/(:id)', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  const Items = AppDataSource.getRepository(Category)
  const item = await Items.findOneBy({id})
  // Hàm gọi ra file items/edit và mang theo biến item
  res.render("admin/category/editCategory",{item});
  
});

// //Update EDIT
adminRouter.post("/updateCategory/(:id)", async (req: Request, res: Response) => {
  console.log(req.body.category_name);
  const id: number = parseInt(req.params.id, 10);
  await AppDataSource.createQueryBuilder()
    .update(Category)
    .set({
      category: req.body.category_name,
    })
    .where("id = :id", { id })
    .execute();
  // Hàm gọi ra file items/edit và mang theo biến item
  return res.redirect("/admin/allCategory");
});


// //DELETE\ CATEGORY
adminRouter.get("/deleteCategory/(:id)", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  await AppDataSource
    .createQueryBuilder()
    .delete()
    .from(Category)
    .where("id = :id", { id })
    .execute()
    res.redirect("/admin/allCategory");

});





