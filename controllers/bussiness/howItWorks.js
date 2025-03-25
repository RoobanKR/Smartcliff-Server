const HowItWork = require("../../models/bussiness/HowItWorksModal");
const path = require("path")
const fs = require('fs');

exports.createHowItWork = async (req, res) => {
  try {
    const { type, title, description } = req.body;

    if (!req.files || !req.files.image) {
      return res.status(400).json({
        message: [{ key: "error", value: "Image is required" }],
      });
    }

    const imageFile = req.files.image;

    if (imageFile.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        message: [{ key: "error", value: "Image size exceeds the 5MB limit" }],
      });
    }

    const uniqueFileName = `${Date.now()}_${imageFile.name}`;
    const uploadPath = path.join(__dirname, "../../uploads/business/howitwork", uniqueFileName);

    await imageFile.mv(uploadPath);

    const newHowItWork = new HowItWork({
      type,
      title,
      description,
      image: uniqueFileName,
    });

    await newHowItWork.save();

    return res.status(201).json({
      message: [
        { key: "Success", value: "How It Work item added successfully" },
      ],
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.getAllHowItWork = async (req, res) => {
  try {
    const howitworks = await HowItWork.find();

    const allHowItWorks = howitworks.map((item) => {
      const howitworkObj = item.toObject();
      return {
        ...howitworkObj,
        image: process.env.BACKEND_URL + "/uploads/business/howitwork/" + howitworkObj.image,
      };
    });

    return res.status(200).json({
      message: [{ key: 'success', value: 'How It Work items retrieved successfully' }],
      howitworks: allHowItWorks,
    });
  } catch (error) {
    return res.status(500).json({ 
      message: [{ key: 'error', value: 'Internal server error' }] 
    });
  }
};

exports.getHowItWorkById = async (req, res) => {
  try {
    const { id } = req.params;

    const howitwork = await HowItWork.findById(id);

    if (!howitwork) {
      return res
        .status(404)
        .json({ message: [{ key: "error", value: "How It Work item not found" }] });
    }

    return res.status(200).json({
      message: [
        { key: "success", value: "How It Work item retrieved successfully" },
      ],
      howitwork: {
        ...howitwork.toObject(),
        image: process.env.BACKEND_URL + "/uploads/business/howitwork/" + howitwork.image,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.updateHowItWorkById = async (req, res) => {
  try {
    const howItWorkId = req.params.id;
    const updatedData = req.body;
    const imageFile = req.files ? req.files.image : null;

    const existingHowItWork = await HowItWork.findById(howItWorkId);

    if (!existingHowItWork) {
      return res.status(404).json({
        message: [{ key: "error", value: "How It Work item not found" }],
      });
    }

    if (imageFile) {
      // Delete the old image
      const imagePathToDelete = path.join(
        __dirname,
        "../../uploads/business/howitwork",
        existingHowItWork.image
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
        "../../uploads/business/howitwork",
        uniqueFileName
      );
      await imageFile.mv(uploadPath);
      updatedData.image = uniqueFileName;
    }

    const updatedHowItWork = await HowItWork.findByIdAndUpdate(
      howItWorkId,
      updatedData,
      { new: true } // Return the updated document
    );

    if (!updatedHowItWork) {
      return res.status(404).json({
        message: [{ key: "error", value: "How It Work item not found" }],
      });
    }

    return res.status(200).json({
      message: [{ key: "success", value: "How It Work item updated successfully" }],
      updatedHowItWork: updatedHowItWork,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};

exports.deleteHowItWorkById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedHowItWork = await HowItWork.findByIdAndRemove(id);

    if (!deletedHowItWork) {
      return res.status(404).json({
        message: [{ key: "error", value: "How It Work item not found" }],
      });
    }

    // Delete the associated image file
    if (deletedHowItWork.image) {
      const imagePath = path.join(
        __dirname,
        "../../uploads/business/howitwork",
        deletedHowItWork.image
      );
      if (fs.existsSync(imagePath) && fs.lstatSync(imagePath).isFile()) {
        fs.unlinkSync(imagePath);
      }
    }

    return res.status(200).json({
      message: [{ key: "success", value: "How It Work item deleted successfully" }],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};
