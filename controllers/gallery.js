const Gallery = require("../models/GalleryModal");
const path = require("path");
const fs = require("fs");

exports.createGallery = async (req, res) => {
  try {
    const {
      name,
      description,
      month,
      year,
    } = req.body;

    // Check if images are provided
    if (!req.files || !req.files.images) {
      return res
        .status(400)
        .json({ message: [{ key: "error", value: "Images are required" }] });
    }

    // Handle both single and multiple image uploads
    const imageFiles = Array.isArray(req.files.images) 
      ? req.files.images 
      : [req.files.images];
    
    // Validate image sizes
    for (const imageFile of imageFiles) {
      if (imageFile.size > 3 * 1024 * 1024) {
        return res
          .status(400)
          .json({
            message: [
              { key: "error", value: `Image ${imageFile.name} exceeds the 3MB limit` },
            ],
          });
      }
    }

    // Process and save each image
    const uploadedImages = [];
    for (const imageFile of imageFiles) {
      const uniqueFileName = `${Date.now()}_${imageFile.name}`;
      const uploadPath = path.join(
        __dirname,
        "../uploads/gallery",
        uniqueFileName
      );
      await imageFile.mv(uploadPath);
      uploadedImages.push(uniqueFileName);
    }

    const newGallery = new Gallery({
      name,
      description,
      month,
      year,
      images: uploadedImages, // Store array of image filenames
      createdBy: req.user ? req.user.id : undefined // Optional: add user ID if available
    });

    await newGallery.save();

    return res.status(201).json({
      message: [
        {
          key: "Success",
          value: "Gallery Added Successfully",
        },
      ],
      gallery: newGallery
    });
  } catch (error) {
    console.error("Error creating Gallery:", error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};


exports.getAllGallery = async (req, res) => {
  try {
    const gallery = await Gallery.find();

    const allGallery = gallery.map((inst) => {
      const galleryObj = inst.toObject();
      
      // Map each image filename to its full URL
      const imagesWithUrls = galleryObj.images.map(imageName => 
        process.env.BACKEND_URL + "/uploads/gallery/" + imageName
      );
      
      return {
        ...galleryObj,
        images: imagesWithUrls, // Replace image filenames with complete URLs
      };
    });
    
    return res.status(200).json({
      message: [{ key: "success", value: "Gallery Retrieved successfully" }],
      Gallery: allGallery,
    });
  } catch (error) {
    console.error("Error getting all galleries:", error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.getGalleryById = async (req, res) => {
  const { id } = req.params;
  try {
    const gallery = await Gallery.findById(id);

    if (!gallery) {
      return res
        .status(404)
        .json({ message: [{ key: "error", value: "Gallery not found" }] });
    }

    const galleryObj = gallery.toObject();
    
    // Map each image filename to its full URL
    const imagesWithUrls = galleryObj.images.map(imageName => 
      process.env.BACKEND_URL + "/uploads/gallery/" + imageName
    );

    return res.status(200).json({
      message: [{ key: "success", value: "Gallery Id based retrieved successfully" }],
      galleryById: {
        ...galleryObj,
        images: imagesWithUrls, // Replace image filenames with complete URLs
      },
    });
  } catch (error) {
    console.error("Error retrieving gallery by ID:", error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.updateGallery = async (req, res) => {
  const { id } = req.params;
  const { name, description, month, year } = req.body;

  try {
    const gallery = await Gallery.findById(id);
    if (!gallery) {
      return res
        .status(404)
        .json({ message: [{ key: "error", value: "Gallery not found" }] });
    }

    // If new images are uploaded
    if (req.files && req.files.images) {
      const imageFiles = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      // Validate image sizes
      for (const imageFile of imageFiles) {
        if (imageFile.size > 3 * 1024 * 1024) {
          return res.status(400).json({
            message: [
              { key: "error", value: `Image ${imageFile.name} exceeds the 3MB limit` },
            ],
          });
        }
      }

      // Delete old images
      if (gallery.images && gallery.images.length > 0) {
        for (const oldImage of gallery.images) {
          const imagePathToDelete = path.join(
            __dirname,
            "../uploads/gallery",
            oldImage
          );
          if (fs.existsSync(imagePathToDelete)) {
            fs.unlinkSync(imagePathToDelete);
          }
        }
      }

      // Save new images
      const uploadedImages = [];
      for (const imageFile of imageFiles) {
        const uniqueFileName = `${Date.now()}_${imageFile.name}`;
        const uploadPath = path.join(
          __dirname,
          "../uploads/gallery",
          uniqueFileName
        );
        await imageFile.mv(uploadPath);
        uploadedImages.push(uniqueFileName);
      }

      gallery.images = uploadedImages; // Replace old image array
    }

    // Update other fields
    gallery.name = name;
    gallery.description = description;
    gallery.month = month;
    gallery.year = year;

    await gallery.save();

    return res.status(200).json({
      message: [{ key: "success", value: "Gallery updated successfully" }],
      updated_gallery: gallery,
    });
  } catch (error) {
    console.error("Error updating gallery:", error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};


exports.deleteGallery = async (req, res) => {
  const { id } = req.params;

  try {
    const gallery = await Gallery.findById(id);

    if (!gallery) {
      return res
        .status(404)
        .json({ message: [{ key: "error", value: "Gallery not found" }] });
    }

    // Delete all associated images from filesystem
    if (gallery.images && gallery.images.length > 0) {
      for (const imageName of gallery.images) {
        const imagePath = path.join(
          __dirname,
          "../uploads/gallery",
          imageName
        );
        if (fs.existsSync(imagePath) && fs.lstatSync(imagePath).isFile()) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    await Gallery.findByIdAndDelete(id);

    return res
      .status(200)
      .json({
        message: [{ key: "success", value: "Gallery deleted successfully" }],
        deleted_gallery: gallery, // Fixed the key name from deleted_instructor to deleted_gallery
      });
  } catch (error) {
    console.error("Error deleting gallery:", error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};