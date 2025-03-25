const AboutUs = require("../../models/about/aboutUsModal");
const path = require("path");
const fs = require("fs");

exports.createAboutUs = async (req, res) => {
  try {
    const { title } = req.body;
    const existingAboutUs = await AboutUs.findOne({ title });

    if (existingAboutUs) {
      return res
        .status(403)
        .json({
          message: [{ key: "error", value: "AboutUs Title already exists" }],
        });
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
    const uploadPath = path.join(
      __dirname,
      "../../uploads/about/aboutus",
      uniqueFileName
    );

    await imageFile.mv(uploadPath);

    const newAboutUs = new AboutUs({
      title,
      image: uniqueFileName,
      createdBy:req.user.email || "roobankr5@gmail.com",
    });

    await newAboutUs.save();

    return res.status(201).json({
      message: [{ key: "Success", value: "About Us added successfully" }],
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.getAllAboutUs = async (req, res) => {
  try {
    const allAboutUs = await AboutUs.find();
    const getAllAboutUs = allAboutUs.map((about) => {
      const aboutObj = about.toObject();
      return {
        ...aboutObj,
        image:
          process.env.BACKEND_URL + "/uploads/about/aboutus/" + aboutObj.image,
      };
    });

    return res.status(200).json({
      message: [{ key: "success", value: "About US Retrieved successfully" }],
      getAllAboutUs: getAllAboutUs,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.getAboutUsById = async (req, res) => {
  try {
    const { id } = req.params;

    const aboutus = await AboutUs.findById(id);

    if (!aboutus) {
      return res
        .status(404)
        .json({ message: [{ key: "error", value: "About Us not found" }] });
    }

    return res.status(200).json({
      message: [
        { key: "success", value: "About Us based Retrieved successfully" },
      ],
      aboutUsById: {
        ...aboutus.toObject(),
        image:
          process.env.BACKEND_URL + "/uploads/about/aboutus/" + aboutus.image,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.editAboutusById = async (req, res) => {
  try {
    const aboutUsId = req.params.id;
    const updatedData = { ...req.body };

    const imageFile = req.files ? req.files.image : null;
    const existingAboutUs = await AboutUs.findById(aboutUsId);

    if (!existingAboutUs) {
      return res.status(404).json({
        message: [{ key: "error", value: "About Us not found" }],
      });
    }

    // Handle Image Update
    if (imageFile) {
      const imagePathToDelete = path.join(
        __dirname,
        "../../uploads/about/aboutus",
        existingAboutUs.image
      );

      if (fs.existsSync(imagePathToDelete)) {
        fs.unlink(imagePathToDelete, (err) => {
          if (err) console.error("Error deleting image:", err);
        });
      }

      const uniqueFileName = `${Date.now()}_${imageFile.name}`;
      const uploadPath = path.join(
        __dirname,
        "../../uploads/about/aboutus",
        uniqueFileName
      );
      await imageFile.mv(uploadPath);
      updatedData.image = uniqueFileName;
    }

    // **Update `updatedBy` and `updatedOn`**
    updatedData.updatedBy = req.user.email || "roobankr6@gmail.com"; 
    updatedData.updatedOn = new Date();

    const updatedAboutUs = await AboutUs.findByIdAndUpdate(
      aboutUsId,
      updatedData,
      { new: true } // Ensure updated data is returned
    );

    if (!updatedAboutUs) {
      return res.status(404).json({
        message: [{ key: "error", value: "About Us not found" }],
      });
    }

    return res.status(200).json({
      message: [{ key: "success", value: "About Us updated successfully" }],
      updatedAboutUs,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};

exports.deleteAboutUsById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAboutUs = await AboutUs.findByIdAndRemove(id);

    if (!deletedAboutUs) {
      return res
        .status(404)
        .json({
          message: [{ key: "error", value: "About Us section not found" }],
        });
    }

    if (deletedAboutUs.image) {
      const imagePath = path.join(
        __dirname,
        "../../uploads/about/aboutus",
        deletedAboutUs.image
      );
      if (fs.existsSync(imagePath) && fs.lstatSync(imagePath).isFile()) {
        fs.unlinkSync(imagePath);
      }
    }

    res
      .status(200)
      .json({
        message: [{ key: "success", value: "About Us deleted successfully" }],
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};
