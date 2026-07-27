import Item from "../models/item.model.js";
import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const addItem = async (req, res) => {
  try {
    const { name, category, foodType, price } = req.body;
    if (!name || !category || !foodType || !price) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    const shop = await Shop.findOne({ owner: req.userId })
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Please create a shop first.",
      });
    }
    let image = "";
    if (req.file) {
      const uploadedImage = await uploadOnCloudinary(req.file.path);
      if (!uploadedImage) {
        return res.status(500).json({
          success: false,
          message: "Image upload failed.",
        });
      }
      image = uploadedImage;
    }
    const item = await Item.create({
      name,
      category,
      foodType,
      price,
      image,
      shop: shop._id,
    });

    shop.items.push(item._id);
    await shop.save();
    await shop.populate(["items" , "owner"])
    return res.status(201).json({
      success: true,
      message: "Item added successfully.",
      shop
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

export const editItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { name, category, foodType, price } = req.body;
    const shop = await Shop.findOne({ owner: req.userId });
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found.",
      });
    }
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found.",
      });
    }
    if (item.shop.toString() !== shop._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this item.",
      });
    }
    if (req.file) {
      const uploadedImage = await uploadOnCloudinary(req.file.path);
      if (!uploadedImage) {
        return res.status(500).json({
          success: false,
          message: "Image upload failed.",
        });
      }
      item.image = uploadedImage.url;
    }
    if (name) item.name = name;
    if (category) item.category = category;
    if (foodType) item.foodType = foodType;
    if (price) item.price = price;
    await item.save();
    return res.status(200).json({
      success: true,
      message: "Item updated successfully.",
      shop,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
