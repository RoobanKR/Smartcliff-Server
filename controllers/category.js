const Category = require("../models/CategoryModal");
const path = require("path")
const fs = require('fs');


exports.createCategory = async (req, res) => {
  try {
    const { category_name, description } = req.body;
    
    if (!category_name) {
      return res.status(400).json({ message: [{ key: "error", value: "Required fields" }] });
    }

    const existingCategory = await Category.findOne({ category_name });
    if (existingCategory) {
      return res.status(403).json({ message: [{ key: "error", value: "Category Name already exists" }] });
    }

           if (!req.files || !req.files.image) {
               return res.status(400).json({
                   message: [{ key: "error", value: "Image is required" }],
               });
           }
   
           const imageFile = req.files.image;
   
           if (imageFile.size > 3 * 1024 * 1024) {
               return res.status(400).json({
                   message: [{ key: "error", value: "Image size exceeds the 3MB limit" }],
               });
           }
   
           const uniqueFileName = `${Date.now()}_${imageFile.name}`;
           const uploadPath = path.join(__dirname, "../uploads/courses/category", uniqueFileName);
   
           await imageFile.mv(uploadPath);

    const newCategory = new Category({
      category_name,
      description,
      image: uniqueFileName,
    });
    await newCategory.save();

    return res.status(201).json({
      message: [{ key: "success", value: "Category Added Successfully" }],
    });

  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};


exports.getAllCategory = async (req, res) => {
  try {
    const allcategory = await Category.find();

    if (!allcategory || allcategory.length === 0) {
      return res
        .status(404)
        .json({ message: [{ key: "error", value: "No category found" }] });
    }

    const category = allcategory.map((clientss) => {
      const serviceObj = clientss.toObject();
      return {
          ...serviceObj,
          image: process.env.BACKEND_URL + "/uploads/courses/category/" + serviceObj.image,
      };
  });

    return res.status(200).json({
      message: [{ key: "success", value: "Category getted" }],
      Category: category,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json({ message: [{ key: "error", value: "Category not found" }] });
    }

   

    return res.status(200).json({
      message: [{ key: "success", value: "Category getById Success" }],
      Category:{
        ...category.toObject(),
        image: process.env.BACKEND_URL + '/uploads/courses/category/' + category.image, 
    },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const { category_name, description } = req.body;
    const imageFile = req.files?.image;

    if (!category_name) {
      return res.status(400).json({ message: [{ key: "error", value: "Required fields" }] });
    }

    const existingCategory = await Category.findById(categoryId);

    if (!existingCategory) {
      return res.status(404).json({ message: [{ key: "error", value: "Category not found" }] });
    }

    if (imageFile) {
      const imagePathToDelete = path.join(
        __dirname,
        "../uploads/courses/category",
        existingCategory.image
      );

      if (fs.existsSync(imagePathToDelete)) {
        fs.unlink(imagePathToDelete, (err) => {
          if (err) {
            console.error("Error deleting image:", err);
          }
        });
      }

      const uniqueFileName = `${Date.now()}_${imageFile.name}`;
      const uploadPath = path.join(__dirname, "../uploads/courses/category", uniqueFileName);

      await imageFile.mv(uploadPath);
      existingCategory.image = uniqueFileName; 
    }

    existingCategory.category_name = category_name;
    existingCategory.description = description;

    await existingCategory.save();

    return res.status(200).json({
      message: [{ key: "success", value: "Category updated successfully" }],
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};


exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    const existingCategory = await Category.findById(categoryId);

    if (!existingCategory) {
      return res.status(404).json({ message: [{ key: "error", value: "Category not found" }] });
    }

             if (existingCategory.image) {
                       const imagePath = path.join(__dirname, "../uploads/courses/category", existingCategory.image);
                       if (fs.existsSync(imagePath) && fs.lstatSync(imagePath).isFile()) {
                           fs.unlinkSync(imagePath);
                       }
                   }
           

    await Category.deleteOne({ _id: categoryId });

    return res.status(200).json({ message: [{ key: "success", value: "Category deleted successfully" }] });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};



