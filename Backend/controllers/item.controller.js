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
    const shop = await Shop.findOne({ owner: req.userId });
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
    await shop.populate("owner");
    await shop.populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });
    return res.status(201).json({
      success: true,
      message: "Item added successfully.",
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

export const editItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { name, category, foodType, price } = req.body;
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found.",
      });
    }
    item.name = name;
    item.category = category;
    item.foodType = foodType;
    item.price = price;
    if (req.file) {
      const uploadedImage = await uploadOnCloudinary(req.file.path);
      if (!uploadedImage) {
        return res.status(500).json({
          success: false,
          message: "Image upload failed.",
        });
      }
      item.image = uploadedImage;
    }
    await item.save();
    const shop = await Shop.findOne({ owner: req.userId });
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Please create a shop first.",
      });
    }
    await shop.populate("owner");
    await shop.populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });
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

export const getItemById = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Item found successfully.",
      item,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Get Item Error.",
    });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.userId });
    const itemId = req.params.itemId;
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found.",
      });
    }
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Please create a shop first.",
      });
    }
    if (!shop.items.includes(item._id)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this item.",
      });
    }
    await Item.deleteOne({ _id: itemId });
    shop.items.pull(itemId);
    await shop.save();

    await shop.populate("owner");
    await shop.populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });
    return res.status(200).json({
      success: true,
      message: "Item deleted successfully.",
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

export const getItemByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    });
    if (shops.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No shops found in this city.",
      });
    }
    const shopIds = shops.map((shop) => shop._id);
    const items = await Item.find({
      shop: { $in: shopIds },
    }).populate("shop", "name image city");
    return res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    console.error("Get Items By City Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getItemByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const shop = await Shop.findById(shopId).populate("items");
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }
    return res.status(200).json({
      success: true,
      shop,
      items: shop.items,
    });
  } catch (error) {
    console.log("GET ITEMS BY SHOP ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get shop items",
      error: error.message,
    });
  }
};

export const searchItems = async (req, res) => {
  try {
    const { city, query } = req.query;
    if (!city || !query?.trim()) {
      return res.status(400).json({
        success: false,
        message: "City and search query are required.",
      });
    }
    const shops = await Shop.find({
      city: {
        $regex: new RegExp(`^${city.trim()}$`, "i"),
      },
    }).select("_id");
    if (shops.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No restaurants found in this city.",
      });
    }
    const shopIds = shops.map((shop) => shop._id);
    const escapedQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const items = await Item.find({
      shop: {
        $in: shopIds,
      },
      $or: [
        {
          name: {
            $regex: escapedQuery,
            $options: "i",
          },
        },
        {
          category: {
            $regex: escapedQuery,
            $options: "i",
          },
        },
      ],
    }).populate("shop", "name image");
    return res.status(200).json({
      success: true,
      message: items.length ? "Search results found." : "No food items found.",
      items,
    });
  } catch (error) {
    console.log("SEARCH ITEMS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to search food items.",
      error: error.message,
    });
  }
};
export const rating = async (req, res) => {
  try {
    const { itemId, rating } = req.body;
    if (!itemId || rating === undefined || rating === null) {
      return res.status(400).json({
        success: false,
        message: "Item ID and rating are required",
      });
    }
    const numericRating = Number(rating);
    if (
      !Number.isFinite(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }
    const oldCount = item.rating.count || 0;
    const oldAverage = item.rating.average || 0;
    const newCount = oldCount + 1;
    const newAverage =(oldAverage * oldCount + numericRating) / newCount;
    item.rating.count = newCount;
    item.rating.average = Number(newAverage.toFixed(1));
    await item.save();
    return res.status(200).json({
      success: true,
      message: "Rating submitted successfully",
      rating: {
        average: item.rating.average,
        count: item.rating.count,
      },
    });
  } catch (error) {
    console.error("RATING ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit rating",
      error: error.message,
    });
  }
};