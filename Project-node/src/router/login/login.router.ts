import express, { Request, Response } from "express";
import { Console } from "console";
import { AppDataSource } from "../../data-source";
import path from "path";
import multer from "multer";
import { User } from "../../entity/User";
import bcrypt from 'bcryptjs';

export const loginRouter = express.Router();





// GET items
loginRouter.get("/", async (req: Request, res: Response) => {
  try {
  
    res.render("admin/login/login");
  } catch (e: any) {
    res.status(500).send(e.message);
  }
});

loginRouter.get("/signup", async (req: Request, res: Response) => {
  try {
  
    res.render("admin/login/signup");
  } catch (e: any) {
    res.status(500).send(e.message);
  }
});

loginRouter.post("/postSignup", async (req: Request, res: Response) => {
 

    if(req.body.password === req.body.cfpassword){
      
      await AppDataSource.createQueryBuilder()
      .insert()
      .into(User)
      .values({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,

    })
    .execute();
    res.locals.message = 'Resign Success!';
   
    
    // res.redirect("/login");
    }

    else{
      res.locals.errorMessage = 'Password are not matching, try again!';
      
    }
  
    res.render("admin/login/signup");
 
});



// //POST CATEGORY
loginRouter.post("/login-admin", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  // Tìm thông tin tài khoản user đăng nhập
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { username: username } });
  // Kiểm tra mật khẩu tồn tại và có đúng không

  if (password ===  user.password && username ===  user.username ) {
    res.locals.message = 'Login Success!';
  //  res.send(user.password);

        // Chuyển hướng đến trang home
        return res.render("admin/index");
    
  }
  

    
  else {
    res.locals.errorMessage = 'Invalid username or password';   
    return res.render("admin/login/login");
  
  }
        
        

  
});


   
