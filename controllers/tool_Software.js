const { createClient } = require('@supabase/supabase-js');
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseUrl = process.env.SUPABASE_URL;

const supabase = createClient(supabaseUrl, supabaseKey);

const Software = require("../models/Tools_Software");

exports.createToolSoftware = async (req, res) => {
  try {
    const { software_name, description, category } = req.body;

    if (!software_name || !description) {
      return res.status(400).json({
        message: [{ key: "error", value: "Required fields are missing" }],
      });
    }

    const imageFile = req.files?.image;

    if (!imageFile) {
      return res.status(400).json({
        message: [{ key: "error", value: "Tool & Software image is required" }],
      });
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        message: [
          {
            key: "error",
            value: "Tool & Software image size exceeds the 5MB limit",
          },
        ],
      });
    }

    const uniqueFileName = `${Date.now()}_${imageFile.name}`;

    const { data, error } = await supabase.storage
      .from('SmartCliff/courses/tool_software')
      .upload(uniqueFileName, imageFile.data);

    if (error) {
      console.error("Error uploading image to Supabase:", error);
      return res.status(500).json({
        message: [{ key: "error", value: "Error uploading image to Supabase" }],
      });
    }

    const imageUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/courses/tool_software/${uniqueFileName}`;

    const newToolSoftware = new Software({
      software_name,
      description,
      category:typeof category === "string" ? category.split(","): Array.isArray(category) ? category : [],  
      image: imageUrl,
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

    

    return res.status(200).json({
      message: [{ key: "success", value: "Tool & Software Retrieved successfully" }],
      toolSoftware: toolSoftware,
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
      toolSoftware:software
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

    // Find the existing tool software
    const existingSoftware = await Software.findById(id);

    if (!existingSoftware) {
      return res.status(404).json({
        message: [{ key: "error", value: "Tool & Software not found" }],
      });
    }

    // If there is a new image, remove the existing one from Supabase
    if (imageFile) {
      if (existingSoftware.image) {
        try {
          const imageUrlParts = existingSoftware.image.split("/");
          const imageName = imageUrlParts[imageUrlParts.length - 1];

          const { error } = await supabase.storage
           .from('SmartCliff')
          .remove(`courses/tool_software/${[imageName]}`);


          if (error) {
            console.error("Error removing existing image from Supabase:", error);
            return res.status(500).json({
              message: [{ key: "error", value: "Error removing existing image from Supabase" }],
            });
          }
        } catch (removeError) {
          console.error("Error during image removal:", removeError);
          return res.status(500).json({
            message: [{ key: "error", value: "Internal server error" }],
          });
        }
      }

      // Upload the new image to Supabase
      const uniqueFileName = `${Date.now()}_${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('SmartCliff/courses/tool_software')
        .upload(uniqueFileName, imageFile.data);

      if (uploadError) {
        console.error("Error uploading new image to Supabase:", uploadError);
        return res.status(500).json({
          message: [{ key: "error", value: "Error uploading new image to Supabase" }],
        });
      }

      const imageUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/courses/tool_software/${uniqueFileName}`;
      existingSoftware.image = imageUrl;
    }

    // Update the software details
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
      const imageUrlParts = software.image.split("/");
      const imageName = imageUrlParts[imageUrlParts.length - 1];

      try {
        const { error } = await supabase.storage
          .from('SmartCliff')
          .remove(`courses/tool_software/${[imageName]}`);

      } catch (error) {
        console.error("Error deleting image from Supabase:", error);
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
