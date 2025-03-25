const Career = require("../models/carrerModal"); 
const path = require("path");
const fs = require('fs');

exports.createCareer = async (req, res) => {
  try {
    const { title, description, subTitle, subDescription } = req.body;

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
    const uploadPath = path.join(__dirname, "../uploads/career/image", uniqueFileName);

    await imageFile.mv(uploadPath);

    const newCareer = new Career({
      title,
      description,
      subTitle,
      subDescription,
      image: uniqueFileName,
      createdBy: req?.user?.email || "roobankr5@gmail.com",
    });

    await newCareer.save();

    return res.status(201).json({
      message: [
        { key: "Success", value: "Career added successfully" },
      ],
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.getAllCareers = async (req, res) => {
  try {
    const careers = await Career.find();

    const allCareers = careers.map((career) => {
      const careerObj = career.toObject();
      return {
        ...careerObj,
        image: process.env.BACKEND_URL + "/uploads/career/image/" + careerObj.image,
      };
    });

    return res.status(200).json({
      message: [{ key: 'success', value: 'Careers retrieved successfully' }],
      careers: allCareers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      message: [{ key: 'error', value: 'Internal server error' }] 
    });
  }
};

exports.getCareerById = async (req, res) => {
  try {
    const { id } = req.params;

    const career = await Career.findById(id);

    if (!career) {
      return res
        .status(404)
        .json({ message: [{ key: "error", value: "Career not found" }] });
    }

    return res.status(200).json({
      message: [
        { key: "success", value: "Career retrieved successfully" },
      ],
      career: {
        ...career.toObject(),
        image: process.env.BACKEND_URL + "/uploads/career/image/" + career.image,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.updateCareer = async (req, res) => {
  try {
    const careerId = req.params.id;
    const updatedData = req.body;
    const imageFile = req.files ? req.files.image : null;

    const existingCareer = await Career.findById(careerId);

    if (!existingCareer) {
      return res.status(404).json({
        message: [{ key: "error", value: "Career not found" }],
      });
    }

    if (imageFile) {
      // Delete the old image
      const imagePathToDelete = path.join(
        __dirname,
        "../uploads/career/image",
        existingCareer.image
      );
      if (fs.existsSync(imagePathToDelete)) {
        fs.unlink(imagePathToDelete, (err) => {
          if (err) {
            console.error("Error deleting image:", err);
          }
        });
      }

      // Upload the new image
      const uniqueFileName = `${Date.now()}_${imageFile.name}`;
      const uploadPath = path.join(
        __dirname,
        "../uploads/career/image",
        uniqueFileName
      );
      await imageFile.mv(uploadPath);
      updatedData.image = uniqueFileName;
    }

    const updatedCareer = await Career.findByIdAndUpdate(
      careerId,
      updatedData,
      { new: true } // Return the updated document
    );

    if (!updatedCareer) {
      return res.status(404).json({
        message: [{ key: "error", value: "Career not found" }],
      });
    }

    return res.status(200).json({
      message: [{ key: "success", value: "Career updated successfully" }],
      updatedCareer: updatedCareer,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};

exports.deleteCareerById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCareer = await Career.findByIdAndRemove(id);

    if (!deletedCareer) {
      return res.status(404).json({
        message: [{ key: "error", value: "Career not found" }],
      });
    }

    // Delete the associated image file
    if (deletedCareer.image) {
      const imagePath = path.join(
        __dirname,
        "../uploads/career/image",
        deletedCareer.image
      );
      if (fs.existsSync(imagePath) && fs.lstatSync(imagePath).isFile()) {
        fs.unlinkSync(imagePath);
      }
    }

    return res.status(200).json({
      message: [{ key: "success", value: "Career deleted successfully" }],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};