import express from "express"
import isAuth from "../middlewares/isAuth.js";
import { createOrUpdateShop, getMyShop } from "../controllers/shop.controller.js";
import { upload } from "../middlewares/multer.js";

const shopRouter = express.Router()

shopRouter.post("/create-edit-shop" , isAuth , upload.single("image") , createOrUpdateShop)
shopRouter.get("/get-my-shop" , isAuth, getMyShop)


export default shopRouter;