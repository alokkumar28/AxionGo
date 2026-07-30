import express from "express"
import isAuth from "../middlewares/isAuth.js";
import { createOrUpdateShop, getMyShop, getShopByCity } from "../controllers/shop.controller.js";
import { upload } from "../middlewares/multer.js";

const shopRouter = express.Router()

shopRouter.post("/create-edit-shop" , isAuth , upload.single("image") , createOrUpdateShop)
shopRouter.get("/get-my-shop" , isAuth, getMyShop)
shopRouter.get("/get-by-city/:city" , isAuth, getShopByCity)


export default shopRouter;