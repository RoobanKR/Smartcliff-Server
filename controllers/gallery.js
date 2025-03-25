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

    if (!req.files || !req.files.image) {
      return res
        .status(400)
        .json({ message: [{ key: "error", value: "Image is required" }] });
    }

    const imageFile = req.files.image;
    if (imageFile.size > 3 * 1024 * 1024) {
      return res
        .status(400)
        .json({
          message: [
            { key: "error", value: "Image size exceeds the 3MB limit" },
          ],
        });
    }

    const uniqueFileName = `${Date.now()}_${imageFile.name}`;
    const uploadPath = path.join(
      __dirname,
      "../uploads/gallery",
      uniqueFileName
    );
    await imageFile.mv(uploadPath);

    const newGallery = new Gallery({
        name,
        description,
        month,
        year,
      image: uniqueFileName,
    });

    await newGallery.save();

    return res.status(201).json({
      message: [
        {
          key: "Success",
          value: "Gallery Added Successfully",
        },
      ],
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
      return {
        ...galleryObj,
        image:
          process.env.BACKEND_URL +
          "/uploads/gallery/" +
          galleryObj.image,
      };
    });
    return res.status(200).json({
      message: [{ key: "success", value: "Gallery Retrieved successfully" }],
      Gallery: allGallery,
    });
  } catch (error) {
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

    return res.status(200).json({
      message: [{ key: "success", value: "Gallery Id based retrieved successfully" }],
      galleryById: {
        ...gallery.toObject(),
        image:
          process.env.BACKEND_URL +
          "/uploads/gallery/" +
          gallery.image,
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

  const {
    name,
    description,
    month,
    year,
  } = req.body;

  try {
    const gallery = await Gallery.findById(id);
    if (!gallery) {
      return res
        .status(404)
        .json({ message: [{ key: "error", value: "Gallery not found" }] });
    }

    const imageFile = req.files?.image;
    if (imageFile) {
      if (gallery.image) {
        const imagePathToDelete = path.join(
          __dirname,
          "../uploads/gallery",
          gallery.image
        );
        if (fs.existsSync(imagePathToDelete)) {
          fs.unlinkSync(imagePathToDelete);
        }
      }

      const uniqueFileName = `${Date.now()}_${imageFile.name}`;
      const uploadPath = path.join(
        __dirname,
        "../uploads/gallery",
        uniqueFileName
      );
      await imageFile.mv(uploadPath);

      gallery.image = uniqueFileName;
    }

    gallery.name = name;
    gallery.description = description;
    gallery.month = month;
    gallery.year = year;
    await gallery.save();

    return res
      .status(200)
      .json({
        message: [{ key: "success", value: "Gallery updated successfully" }],
        updated_gallery: gallery,
      });
  } catch (error) {
    console.error("Error updating gallery:", error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
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

    if (gallery.image) {
      const imagePath = path.join(
        __dirname,
        "../uploads/gallery",
        gallery.image
      );
      if (fs.existsSync(imagePath) && fs.lstatSync(imagePath).isFile()) {
        fs.unlinkSync(imagePath);
      }
    }

    await Gallery.findByIdAndDelete(id);

    return res
      .status(200)
      .json({
        message: [{ key: "success", value: "Gallery deleted successfully" }],
        deleted_instructor: gallery,
      });
  } catch (error) {
    console.error("Error deleting gallery:", error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};
