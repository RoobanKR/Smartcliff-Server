const VisionMision = require("../../models/about/vison-missonModal");
const path = require("path");
const fs = require("fs");

exports.createVisionMision = async (req, res) => {
  try {
    const { type,description } = req.body;
    const existingVisionMision = await VisionMision.findOne({ description });

    if (existingVisionMision) {
      return res
        .status(403)
        .json({
          message: [{ key: "error", value: "Vision Or Mision already exists" }],
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
      "../../uploads/about/visionmission",
      uniqueFileName
    );

    await imageFile.mv(uploadPath);

    const newVisionMision = new VisionMision({
      type,
      description,
      image: uniqueFileName,
      createdBy:req?.user?.email || "roobankr5@gmail.com",
    });

    await newVisionMision.save();

    return res.status(201).json({
      message: [{ key: "Success", value: "Vision Or Mision added successfully" }],
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};



exports.getAllVisionMision = async (req, res) => {
  try {
    const allVisionMisions = await VisionMision.find();
    const getVisionMisions = allVisionMisions.map((about) => {
      const visionMisions = about.toObject();
      return {
        ...visionMisions,
        image:
          process.env.BACKEND_URL + "/uploads/about/visionmission/" + visionMisions.image,
      };
    });

    return res.status(200).json({
      message: [{ key: "success", value: "About US Retrieved successfully" }],
      getVisionMisions: getVisionMisions,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};



exports.getVisionMisionById = async (req, res) => {
  try {
    const { id } = req.params;

    const visionmission = await VisionMision.findById(id);

    if (!visionmission) {
      return res
        .status(404)
        .json({ message: [{ key: "error", value: "Vision Mision not found" }] });
    }

    return res.status(200).json({
      message: [
        { key: "success", value: "Vision Mision based Retrieved successfully" },
      ],
      visionmissionById: {
        ...visionmission.toObject(),
        image:
          process.env.BACKEND_URL + "/uploads/about/visionmission/" + visionmission.image,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};




exports.editVisionMisionById = async (req, res) => {
  try {
    const visionmissionId = req.params.id;
    const updatedData = req.body;
    const imageFile = req.files ? req.files.image : null;

    const existingVisionMission = await VisionMision.findById(visionmissionId);

    if (!existingVisionMission) {
      return res.status(404).json({
        message: [{ key: "error", value: "vision mission not found" }],
      });
    }

    if (imageFile) {
      if (!existingVisionMission) {
        return res
          .status(404)
          .json({ message: { key: "error", value: "vision mission not found" } });
      }

      const imagePathToDelete = path.join(
        __dirname,
        "../../uploads/about/visionmission",
        existingVisionMission.image
      );
      if (fs.existsSync(imagePathToDelete)) {
        fs.unlink(imagePathToDelete, (err) => {
          if (err) {
            console.error("Error deleting image:", err);
          }
        });
      }

      const uniqueFileName = `${Date.now()}_${imageFile.name}`;
      const uploadPath = path.join(
        __dirname,
        "../../uploads/about/visionmission",
        uniqueFileName
      );
      await imageFile.mv(uploadPath);
      updatedData.image = uniqueFileName;
    }
    updatedData.updatedBy = req.user.email || "roobankr6@gmail.com"; 
    updatedData.updatedOn = new Date();

    const updatedVisionMission = await VisionMision.findByIdAndUpdate(
      visionmissionId,
      updatedData
    );

    if (!updatedVisionMission) {
      return res.status(404).json({
        message: [{ key: "error", value: "vision mission not found" }],
      });
    }

    return res.status(200).json({
      message: [{ key: "success", value: "vision mission updated successfully" }],
      updatedVisionMission: updatedVisionMission,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};


exports.deleteVisionMisionById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedVisionMission = await VisionMision.findByIdAndRemove(id);

    if (!deletedVisionMission) {
      return res
        .status(404)
        .json({
          message: [{ key: "error", value: "Vision mission section not found" }],
        });
    }

    if (deletedVisionMission.image) {
      const imagePath = path.join(
        __dirname,
        "../../uploads/about/visionmission",
        deletedVisionMission.image
      );
      if (fs.existsSync(imagePath) && fs.lstatSync(imagePath).isFile()) {
        fs.unlinkSync(imagePath);
      }
    }

    res
      .status(200)
      .json({
        message: [{ key: "success", value: "Vision mission deleted successfully" }],
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};
