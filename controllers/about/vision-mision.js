const VisionMision = require("../../models/about/vison-missonModal");

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


    const newVisionMision = new VisionMision({
      type,
      description,
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
    const getVisionMisions = await VisionMision.find();

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
      visionmissionById: visionmission,
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

    const existingVisionMission = await VisionMision.findById(visionmissionId);

    if (!existingVisionMission) {
      return res.status(404).json({
        message: [{ key: "error", value: "vision mission not found" }],
      });
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
