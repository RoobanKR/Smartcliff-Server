const Software = require("../models/Tools_SoftwareModal");
const path = require("path");
const fs = require("fs");
exports.createToolSoftware = async (req, res) => {
  try {
    const { software_name, description, category } = req.body;

    if (!software_name || !description) {
      return res.status(400).json({
        message: [{ key: "error", value: "Required fields are missing" }],
      });
    }

    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: [{ key: "error", value: "Image is required" }] });
    }

    const imageFile = req.files.image;
    if (imageFile.size > 3 * 1024 * 1024) {
      return res.status(400).json({ message: [{ key: "error", value: "Image size exceeds the 3MB limit" }] });
    }

    const uniqueFileName = `${Date.now()}_${imageFile.name}`;
    const uploadPath = path.join(__dirname, "../uploads/courses/toolsoftware", uniqueFileName);
    await imageFile.mv(uploadPath);

    const newToolSoftware = new Software({
      software_name,
      description,
      category:typeof category === "string" ? category.split(","): Array.isArray(category) ? category : [],  
      image: uniqueFileName,
    });

    await newToolSoftware.save();

    return res.status(201).json({
      message: [{ key: "success", value: "Tool & Software added successfully" }],
    });
  } catch (error) {
    console.error("Error creating Tool & Software:", error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};
exports.getAllToolSoftware = async (req, res) => {
  try {
      const toolSoftware = await Software.find().populate('category');

    
      const allToolsSoftware = toolSoftware.map((tools) => {
        const toolsObj = tools.toObject();
        return {
            ...toolsObj,
            image: process.env.BACKEND_URL + "/uploads/courses/toolsoftware/" + toolsObj.image,
        };
    });

    return res.status(200).json({
      message: [{ key: "success", value: "Tool & Software Retrieved successfully" }],
      toolSoftware: allToolsSoftware,
    });
  } catch (error) {
    console.error("Error retrieving Tool & Software:", error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};

exports.getToolSoftwareById = async (req, res) => {
  try {
    const { id } = req.params;
    const software = await Software.findById(id).populate("category");

    if (!software) {
      return res.status(404).json({
        message: [{ key: "error", value: "Tool & Software not found" }],
      });
    }

    return res.status(200).json({
      message: [{ key: "success", value: "Tool & Software Retrieved successfully" }],
      toolSoftware:{
        ...software.toObject(),
        image: process.env.BACKEND_URL + '/uploads/courses/toolsoftware/' + software.image
    },
    });
  } catch (error) {
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};

exports.updateToolSoftware = async (req, res) => {
  try {
    const { id } = req.params;
    const { software_name, description, category } = req.body;
    const imageFile = req.files?.image;

    const existingSoftware = await Software.findById(id);

    if (!existingSoftware) {
      return res.status(404).json({
        message: [{ key: "error", value: "Tool & Software not found" }],
      });
    }

    if (imageFile) {
      if (existingSoftware.image) {
        const imagePathToDelete = path.join(__dirname, "../uploads/courses/toolsoftware", existingSoftware.image);
        if (fs.existsSync(imagePathToDelete)) {
          fs.unlinkSync(imagePathToDelete);
        }
      }

      const uniqueFileName = `${Date.now()}_${imageFile.name}`;
      const uploadPath = path.join(__dirname, "../uploads/courses/toolsoftware", uniqueFileName);
      await imageFile.mv(uploadPath);

      existingSoftware.image = uniqueFileName;
    }
  

    existingSoftware.software_name = software_name;
    existingSoftware.description = description;
    existingSoftware.category = Array.isArray(category) ? category : category.split(",");

    const updatedSoftware = await Software.findByIdAndUpdate(id, existingSoftware, { new: true });

    return res.status(200).json({
      message: [{ key: "success", value: "Tool & Software updated successfully" }],
    });
  } catch (error) {
    console.error("Error updating Tool & Software:", error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};
exports.deleteToolSoftware = async (req, res) => {
  try {
    const { id } = req.params;
    const software = await Software.findById(id);

    if (!software) {
      return res.status(404).json({
        message: [{ key: "error", value: "Tool & Software not found" }],
      });
    }

  if (software.image) {
                             const imagePath = path.join(__dirname, "../uploads/courses/toolsoftware", software.image);
                             if (fs.existsSync(imagePath) && fs.lstatSync(imagePath).isFile()) {
                                 fs.unlinkSync(imagePath);
                             }
                         }
    await Software.findByIdAndDelete(id);

    return res.status(200).json({
      message: [{ key: "success", value: "Tool & Software deleted successfully" }],
    });
  } catch (error) {
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};
