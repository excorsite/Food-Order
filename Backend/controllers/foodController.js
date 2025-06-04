// Backend/controllers/foodController.js (Corrected version)
import foodModel from "../models/foodModel.js";
import fs from "fs"; // Make sure to handle image deletion on failure if needed

// add food item
const addFood = async (req, res) => {
  // Ensure req.file exists if image upload is mandatory
  if (!req.file) {
    return res.json({ success: false, message: "Image file is required." });
  }
  let image_filename = `${req.file.filename}`;

  const { name, description, price, category } = req.body;

  // Basic validation for required fields from req.body
  if (!name || !description || !price || !category) {
    // If an image was uploaded but other fields are missing, you might want to delete the uploaded image
    // fs.unlink(`uploads/${image_filename}`, (err) => {
    //     if (err) console.log("Error deleting orphaned image:", err);
    // });
    return res.json({
      success: false,
      message: "All fields (name, description, price, category) are required.",
    });
  }

  const food = new foodModel({
    name: name,
    description: description,
    price: Number(price), // Ensure price is stored as a Number
    category: category,
    image: image_filename,
  });

  try {
    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.log(error); // This will now show more specific validation errors if they persist
    // If save fails, you might want to delete the uploaded image to prevent orphans
    // fs.unlink(`uploads/${image_filename}`, (err) => {
    //     if (err) console.log("Error deleting image after failed save:", err);
    // });
    res.json({
      success: false,
      message: "Error adding food. Please check data.",
    });
  }
};

// list food items
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching food list" });
  }
};

// remove food item
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (food) {
      // Delete the image from the 'uploads' folder
      fs.unlink(`uploads/${food.image}`, (err) => {
        if (err) {
          // Log error but continue, as main goal is DB removal
          console.log("Error deleting image file:", err);
        }
      });
      await foodModel.findByIdAndDelete(req.body.id);
      res.json({ success: true, message: "Food Removed" });
    } else {
      res.json({ success: false, message: "Food item not found" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error removing food" });
  }
};

export { addFood, listFood, removeFood };
