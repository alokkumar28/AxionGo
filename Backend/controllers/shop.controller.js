import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const createOrUpdateShop = async (req, res) => {
  try {
    const { name, city, state, address } = req.body;
    if (!name || !city || !state || !address) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
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
    let shop = await Shop.findOne({ owner: req.userId });
    if (shop) {
      shop.name = name;
      shop.city = city;
      shop.state = state;
      shop.address = address;
      if (image) {
        shop.image = image;
      }
      await shop.save();
      await shop.populate(["owner", "items"]);
      return res.status(200).json({
        success: true,
        message: "Shop updated successfully.",
        shop,
      });
    }
    shop = await Shop.create({
      name,
      city,
      state,
      address,
      image,
      owner: req.userId,
    });
    await shop.populate("owner");
    return res.status(201).json({
      success: true,
      message: "Shop created successfully.",
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

export const getMyShop = async (req, res) => {
  try {
    let shop = await Shop.findOne({
      owner: req.userId,
    }).populate("owner");

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found.",
      });
    }
    await shop.populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });
    return res.status(200).json({
      success: true,
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
