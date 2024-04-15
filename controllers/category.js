const Category = require("../models/CategoryModal");
const path = require("path");
const fs = require('fs');

exports.createCategory = async (req, res) => {
    try {
        const { category_name,description } = req.body;
        const existingCategory = await Category.findOne({ category_name });
        if (existingCategory) {
            return res
              .status(403)
              .json({ message: [{ key: "error", value: "Category Name already exists" }] });
          }
        if (!category_name) {
            return res.status(400).json({ message: [{ key: "error", value: "Required fields" }] });
        }

        let imagesFiles = req.files.images;

        if (!Array.isArray(imagesFiles)) {
            imagesFiles = [imagesFiles];
        }

        if (imagesFiles.length === 0) {
            return res.status(400).json({ message: [{ key: "error", value: "Category images are required" }] });
        }

        const images = [];

        for (const imagesFile of imagesFiles) {
            if (imagesFile.size > 3 * 1024 * 1024) {
                return res.status(400).json({ message: [{ key: "error", value: "Category image size exceeds the 3MB limit" }] });
            }

            const uniqueFileName = `${Date.now()}_${imagesFile.name}`;
            const uploadPath = path.join(__dirname, "../uploads/category", uniqueFileName);

            try {
                await imagesFile.mv(uploadPath);
                images.push(uniqueFileName);
            } catch (err) {
                console.error("Error moving the Category Image file:", err);
                return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
            }
        }

        const newCategory = new Category({
          category_name,
            description,
            images
        });

        try {
            await newCategory.save();
            return res.status(201).json({ message: [{ key: "Success", value: "Category Added Successfully" }] });
        } catch (error) {
            return res.status(500).json({ message: [{ key: "error", value: "Failed to save Category" }] });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
};

  exports.getAllCategory = async (req, res) => {
    try {
      const category = await Category.find();
  
      if (!category || category.length === 0) {
        return res
          .status(404)
          .json({ message: [{ key: "error", value: "No category found" }] });
      }
  
      const categoryWithImages = category.map((category) => {
        const categorysWithImages = { ...category._doc };
        categorysWithImages.images = category.images.map(
          (image) => `${process.env.BACKEND_URL}/uploads/category/${image}`
        );
  
  
        return categorysWithImages;
      });
  
      return res.status(201).json({
        message: [{ key: "SUCCESS", value: "Category getted" }],
        Category: categoryWithImages,
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
          .json({ message: [{ key: "error", value: "category not found" }] });
      }
  
      const categoryWithImages = {
        ...category.toObject(),
        images: category.images
          ? category.images.map(
              (images) => `${process.env.BACKEND_URL}/uploads/category/${images}`
            )
          : null,
      };
  
  
      return res.status(201).json({
        message: [{ key: "SUCCESS", value: "category getById Success" }],
        Category: categoryWithImages,
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
      const { category_name,description } = req.body;
      let imagesFiles = req.files.images;
  
      if (!category_name) {
        return res.status(400).json({ message: [{ key: "error", value: "Required fields" }] });
      }
      
      // Convert single file upload to array
      if (!Array.isArray(imagesFiles)) {
        imagesFiles = [imagesFiles];
      }
  
      const existingCategory = await Category.findById(categoryId);
  
      if (!existingCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
  
      for (const imageName of existingCategory.images) {
        try {
          fs.unlinkSync(path.join(__dirname, `../uploads/category/${imageName}`));
        } catch (err) {
          console.error("Error removing existing category image file:", err);
        }
      }
  
      const images = [];
  
      for (const imagesFile of imagesFiles) {
        if (imagesFile.size > 3 * 1024 * 1024) {
          return res.status(400).json({ message: [{ key: "error", value: "Category image size exceeds the 3MB limit" }] });
        }
        
        const uniqueFileName = `${Date.now()}_${imagesFile.name}`;
        const uploadPath = path.join(__dirname, "../uploads/category", uniqueFileName);
  
        try {
          await imagesFile.mv(uploadPath);
          images.push(uniqueFileName);
        } catch (err) {
          console.error("Error moving the Category Image file:", err);
          return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
        }
      }
  
      existingCategory.category_name = category_name;
      existingCategory.description = description;

      existingCategory.images = images;
  
      try {
        await existingCategory.save();
        return res.status(200).json({ message: [{ key: "success", value: "Category updated successfully" }] });
      } catch (error) {
        return res.status(500).json({ message: [{ key: "error", value: "Failed to update Category" }] });
      }
    } catch (error) {
      console.error(error);
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
  
      for (const imageName of existingCategory.images) {
        try {
          fs.unlinkSync(path.join(__dirname, `../uploads/category/${imageName}`));
        } catch (err) {
          console.error("Error removing category image file:", err);
        }
      }
  
      await Category.deleteOne({ _id: categoryId });
  
      return res.status(200).json({ message: [{ key: "success", value: "Category Delete successfully" }] });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
  };
  