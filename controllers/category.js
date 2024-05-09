const Category = require("../models/CategoryModal");
const { createClient } = require('@supabase/supabase-js');
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseUrl = process.env.SUPABASE_URL;
const supabase = createClient(supabaseUrl, supabaseKey);

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

    const imageFile = req.files?.image;
    if (!imageFile) {
      return res.status(400).json({ message: [{ key: "error", value: "Category image is required" }] });
    }
    if (imageFile.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        message: [{ key: "error", value: "Category image size exceeds the 5MB limit" }],
      });
    }

    const uniqueFileName = `${Date.now()}_${imageFile.name}`;
    const { error } = await supabase.storage
      .from('SmartCliff/courses/category')
      .upload(uniqueFileName, imageFile.data);

    if (error) {
      console.error("Error uploading image to Supabase:", error);
      return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }

    const imageUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/courses/category/${uniqueFileName}`;

    const newCategory = new Category({
      category_name,
      description,
      image: imageUrl,
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
    const category = await Category.find();

    if (!category || category.length === 0) {
      return res
        .status(404)
        .json({ message: [{ key: "error", value: "No category found" }] });
    }

   

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
      Category: category,
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
      if (imageFile.size > 5 * 1024 * 1024) {
        return res.status(400).json({ message: [{ key: "error", value: "Category image size exceeds the 5MB limit" }] });
      }

      // Remove the existing image from Supabase if there's one
      if (existingCategory.image) {
        try {
          const imageUrlParts = existingCategory.image.split('/');
          const imageName = imageUrlParts[imageUrlParts.length - 1];
          const { error } = await supabase.storage
          .from('SmartCliff')
          .remove(`courses/category/${[imageName]}`);
          if (error) {
            throw new Error("Error removing existing image from Supabase storage");
          }
        } catch (removeError) {
          console.error(removeError);
          return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
        }
      }

      // Upload the new image
      const uniqueFileName = `${Date.now()}_${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('SmartCliff/courses/category')
        .upload(uniqueFileName, imageFile.data);

      if (uploadError) {
        console.error(uploadError);
        return res.status(500).json({ message: [{ key: "error", value: "Error uploading image to Supabase storage" }] });
      }

      const imageUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/courses/category/${uniqueFileName}`;
      existingCategory.image = imageUrl;
    }

    // Update category data
    existingCategory.category_name = category_name;
    existingCategory.description = description;

    await existingCategory.save();

    return res.status(200).json({ message: [{ key: "success", value: "Category updated successfully" }] });
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

    // If the category has an associated image in Supabase storage, delete it
    if (existingCategory.image) {
      try {
        const imageUrlParts = existingCategory.image.split("/");
        const imageName = imageUrlParts[imageUrlParts.length - 1];

        const { error } = await supabase.storage
        .from('SmartCliff')
        .remove(`courses/category/${[imageName]}`);

      } catch (err) {
        console.error("Error while deleting category image from Supabase storage:", err);
      }
    }

    // Now delete the category from the database
    await Category.deleteOne({ _id: categoryId });

    return res.status(200).json({ message: [{ key: "success", value: "Category deleted successfully" }] });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};