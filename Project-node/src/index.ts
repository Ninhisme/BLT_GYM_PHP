/**
 * Required External Modules
 */
import "reflect-metadata";
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { adminRouter } from "./router/admin/category.router";
import bodyParser from "body-parser";
import { productRouter } from "./router/admin/product.router";
import { homePageRouter } from "./router/Front-end/homepage.route";
import { AppDataSource } from "./data-source";
import { loginRouter } from "./router/login/login.router";
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { blogPageRouter } from "./router/Front-end/blogpage.router";
import { topicRouter } from "./router/admin/topic.router";
import { blogsRouter } from "./router/admin/blogs.router";


dotenv.config();


if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);
const path = require("path");
const app = express();

AppDataSource.initialize()
  .then(() => {
    // here you can start to work with your database
  })
  .catch((error) => console.log(error));

/**
 *  App Configuration
 */

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use("/", express.static("public"));
app.use(express.static(path.join(__dirname, 'view/admin/public')));
app.use(express.static(path.join(__dirname, 'view/front-end/public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({ secret: 'your_secret_key' }));
app.use(passport.initialize());
app.use(passport.session());

app.use(session({
  secret: 'my-secret-key', // Key bí mật để mã hóa phiên làm việc
  resave: false, // Không lưu lại phiên làm việc nếu không thay đổi
  saveUninitialized: false // Không tạo phiên làm việc mới cho mỗi request
}));

// app.use("/api/menu/items", itemsRouter);
app.use("/admin", adminRouter);
app.use("/product", productRouter);
app.use("/blogs-admin", blogsRouter);
app.use("/topic", topicRouter);
app.use("/login", loginRouter);
app.use("/homepage", homePageRouter);
app.use("/blogs", blogPageRouter);




app.set("view engine", "ejs"); //set view engine
app.set("views", "./src/view"); //chi ra thu muc chua view

/**
 * Server Activation
 */
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});


