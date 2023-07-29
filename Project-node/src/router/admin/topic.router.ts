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
import { Topic } from "../../entity/Topic";




/**
 * Router Definition
 */
export const topicRouter = express.Router();


// ALL CATEGORY
topicRouter.get("/allTopic", async (req: Request, res: Response) => {
  try {
    
    // const items: Item[] = await ItemService.findAll();
    const items = await AppDataSource.manager.find(Topic);
    res.render("admin/topic/allTopic", { items });
  } catch (e: any) {
    res.status(500).send(e.message);
    
  }
  
});

//ADD CATEGORY
topicRouter.get("/addTopic", async (req: Request, res: Response) => {
  try {

    res.render("admin/topic/addTopic");
  } catch (e: any) {

    res.status(500).send(e.message);
  }
});

// //POST CATEGORY
topicRouter.post("/postTopic", async (req: Request, res: Response) => {
  
  await AppDataSource.createQueryBuilder()
    .insert()
    .into(Topic)
    .values({
      topic: req.body.topic_title,
    })
    .execute();
    
   res.redirect("/topic/allTopic");
});

// //EDIT ROuter Lay ID  Tạo API 
topicRouter.get('/editTopic/(:id)', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  const Items = AppDataSource.getRepository(Topic)
  const item = await Items.findOneBy({id})
  // Hàm gọi ra file items/edit và mang theo biến item
  res.render("admin/topic/editTopic",{item});
  
});

// //Update EDIT
topicRouter.post("/updateTopic/(:id)", async (req: Request, res: Response) => {
  // console.log(req.body.category_name);
  const id: number = parseInt(req.params.id, 10);
  await AppDataSource.createQueryBuilder()
    .update(Topic)
    .set({
      topic: req.body.topic_title,
    })
    .where("id = :id", { id })
    .execute();
  // Hàm gọi ra file items/edit và mang theo biến item
  return res.redirect("/topic/allTopic");
});


// //DELETE\ CATEGORY
topicRouter.get("/deleteTopic/(:id)", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  await AppDataSource
    .createQueryBuilder()
    .delete()
    .from(Topic)
    .where("id = :id", { id })
    .execute()
    res.redirect("/topic/allTopic");

});





