const SkillVertical = require("../../models/degreeprogram/SKillVerticalModal"); 

exports.createSkillVertical = async (req, res) => {
  try {
    const { programName, skillVerticals,service, business_service, college, degree_program } = req.body;

    const newSkillVertical = new SkillVertical({
        service, business_service, college, degree_program,
      programName,
      skillVerticals,
    });

    await newSkillVertical.save();

    return res.status(201).json({
      message: [{ key: "Success", value: "Skill vertical added successfully" }],
      newSkillVertical,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

// Get all skill verticals
exports.getAllSkillVerticals = async (req, res) => {
  try {
    const skillVerticals = await SkillVertical.find().populate("degree_program").populate('service').populate('business_service').populate('college');
    return res.status(200).json({
      message: [{ key: "success", value: "Skill verticals retrieved successfully" }],
      skillVerticals,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

// Get a skill vertical by ID
exports.getSkillVerticalById = async (req, res) => {
  try {
    const { id } = req.params;
    const skillVertical = await SkillVertical.findById(id).populate("degree_program").populate('service').populate('business_service').populate('college');

    if (!skillVertical) {
      return res.status(404).json({ message: [{ key: "error", value: "Skill vertical not found" }] });
    }

    return res.status(200).json({
      message: [{ key: "success", value: "Skill vertical retrieved successfully" }],
      skillVertical,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

// Update a skill vertical
exports.updateSkillVertical = async (req, res) => {
  try {
    const { id } = req.params;
    const { programName, skillVerticals, service, business_service, college, degree_program } = req.body;

    const updatedSkillVertical = await SkillVertical.findByIdAndUpdate(
      id,
      {
        programName,
        skillVerticals,
        service,
        business_service,
        college,
        degree_program
      },
      { new: true }
    ).populate("degree_program").populate('service').populate('business_service').populate('college');

    if (!updatedSkillVertical) {
      return res.status(404).json({ message: [{ key: "error", value: "Skill vertical not found" }] });
    }

    return res.status(200).json({
      message: [{ key: "success", value: "Skill vertical updated successfully" }],
      updatedSkillVertical,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

// Delete a skill vertical
exports.deleteSkillVertical = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSkillVertical = await SkillVertical.findByIdAndDelete(id);

    if (!deletedSkillVertical) {
      return res.status(404).json({ message: [{ key: "error", value: "Skill vertical not found" }] });
    }

    return res.status(200).json({
      message: [{ key: "success", value: "Skill vertical deleted successfully" }],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};