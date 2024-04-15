const Software = require("../models/Tools_Software");
const path = require("path");
const fs = require('fs');

exports.createToolSoftware = async (req, res) => {
    try {
        const { software_name, description,category } = req.body;
        const existingcreateToolSoftware = await Software.findOne({ software_name });
        
        if (existingcreateToolSoftware) {
            return res.status(403).json({ message: [{ key: "error", value: "Tool & Software already exists" }] });
        }

        if (!software_name || !description) {
            return res.status(400).json({ message: [{ key: "error", value: "Required fields" }] });
        }

        let imageFile = req.files.image;

        if (!imageFile) {
            return res.status(400).json({ message: [{ key: "error", value: "Tool & Software image is required" }] });
        }

        if (imageFile.size > 3 * 1024 * 1024) {
            return res.status(400).json({ message: [{ key: "error", value: "Tool & Software image size exceeds the 3MB limit" }] });
        }

        const uniqueFileName = `${Date.now()}_${imageFile.name}`;
        const uploadPath = path.join(__dirname, "../uploads/tool_software", uniqueFileName);

        try {
            await imageFile.mv(uploadPath);

            const newToolSoftware = new Software({
                software_name,
                description,
                image: uniqueFileName,
                category:typeof category === "string"
                ? category.split(",")
                : Array.isArray(category)
                ? category
                : [],
          
            });

            await newToolSoftware.save();

            return res.status(201).json({ message: [{ key: "Success", value: "Tool & Software Added Successfully" }] });
        } catch (error) {
            return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
};


exports.getAllToolSoftware= async (req, res) => {
    try {
      const toolSoftware = await Software.find().populate('category');
  
      const toolSoftwareWithImageUrls = toolSoftware.map((software) => {
        return {
          ...software.toObject(),
          image: software.image ? process.env.BACKEND_URL + '/uploads/tool_software/' + software.image : null,
        };
      });
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Tool & Software Retrieved successfully' }],
        careerOpportunities: toolSoftwareWithImageUrls,
      });
    } catch (error) {
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };


  exports.getToolSoftwareById = async (req, res) => {
    const { id } = req.params;
    try {
        const toolSoftware = await Software.findById(id).populate('category');
        if (!toolSoftware) {
            return res.status(404).json({ message: [{ key: "error", value: "Tool & Software not found" }] });
        }

        const toolSoftwareWithImageUrl = {
            ...toolSoftware.toObject(),
            image: toolSoftware.image ? process.env.BACKEND_URL + '/uploads/tool_software/' + toolSoftware.image : null,
        };

        return res.status(200).json({
            message: [{ key: 'success', value: 'Tool & Software Retrieved successfully' }],
            toolSoftware: toolSoftwareWithImageUrl,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
};


exports.updateToolSoftware = async (req, res) => {
  const { id } = req.params;
  const {
    software_name,
    description,
      category,
  } = req.body;

  try {
      const software = await Software.findById(id);
      if (!software) {
          return res.status(404).json({ message: [{ key: "error", value: "Software not found" }] });
      }

      let newImage = null;
      if (req.files && req.files.image) {
          const imageFile = req.files.image;
          if (imageFile.size > 5 * 1024 * 1024) {
              return res.status(400).json({
                  message: [{ key: "error", value: "Software image size exceeds the 5MB limit" }],
              });
          }
          const uniqueFileName = `${Date.now()}_${imageFile.name}`;
          const uploadPath = path.join(__dirname, "../uploads/tool_software", uniqueFileName);
          await imageFile.mv(uploadPath);
          newImage = uniqueFileName;

          if (software.image) {
              const oldImagePath = path.join(__dirname, "../uploads/tool_software", software.image);
              if (fs.existsSync(oldImagePath)) {
                  fs.unlinkSync(oldImagePath);
              }
          }
      }

      software.software_name = software_name;
      software.description = description;
      software.category = category.split(",");
      if (newImage) {
          software.image = newImage;
      }

      await software.save();

      return res.status(200).json({ message: [{ key: "Success", value: "software Updated Successfully" }], updated_software: software });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};


exports.deleteToolSoftware = async (req, res) => {
    const { id } = req.params;
  
    try {
      const toolSoftware = await Software.findById(id);
      if (!toolSoftware) {
        return res.status(404).json({ message: [{ key: 'error', value: 'Tool & Software not found' }] });
      }
  
      if (toolSoftware.image) {
        const imagePath = path.join(__dirname, '../uploads/tool_software', toolSoftware.image);
        fs.unlinkSync(imagePath);
      }
        await Software.findByIdAndDelete(id);
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Tool & Software deleted successfully' }],
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  