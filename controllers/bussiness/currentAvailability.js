const CurrentAvailability = require("../../models/bussiness/CurrentAvailabilityModal");

exports.createCurrentAvailability = async (req, res) => {
  try {
    const { skillset, resources, duration, batch, experience, remarks } = req.body;

    if (!skillset || !resources || !duration || !batch || !experience || !remarks) {
      return res.status(400).json({ message: [{ key: "error", value: "All fields are required" }] });
    }

    const newCurrentAvailability = new CurrentAvailability({
      skillset,
      resources,
      duration,
      batch,
      experience,
      remarks,
    });

    await newCurrentAvailability.save();
    return res.status(201).json({ message: [{ key: "success", value: "Current availability created successfully" }] });
  } catch (error) {
    console.error("Error creating current availability:", error);
    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.getAllCurrentAvailabilities = async (req, res) => {
  try {
    const currentAvailabilities = await CurrentAvailability.find();
    return res.status(200).json({
      message: [{ key: "success", value: "Current availabilities retrieved successfully" }],
      availabilities: currentAvailabilities,
    });
  } catch (error) {
    console.error("Error retrieving current availabilities:", error);
    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.getCurrentAvailabilityById = async (req, res) => {
  const { id } = req.params;
  try {
    const currentAvailability = await CurrentAvailability.findById(id);
    if (!currentAvailability) {
      return res.status(404).json({ message: [{ key: "error", value: "Current availability not found" }] });
    }
    return res.status(200).json({
      message: [{ key: "success", value: "Current availability retrieved successfully" }],
      availability: currentAvailability,
    });
  } catch (error) {
    console.error("Error retrieving current availability by ID:", error);
    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.updateCurrentAvailability = async (req, res) => {
  const { id } = req.params;
  const { skillset, resources, duration, batch, experience, remarks } = req.body;

  try {
    const existingAvailability = await CurrentAvailability.findById(id);
    if (!existingAvailability) {
      return res.status(404).json({ message: [{ key: "error", value: "Current availability not found" }] });
    }

    existingAvailability.skillset = skillset || existingAvailability.skillset;
    existingAvailability.resources = resources || existingAvailability.resources;
    existingAvailability.duration = duration || existingAvailability.duration;
    existingAvailability.batch = batch || existingAvailability.batch;
    existingAvailability.experience = experience || existingAvailability.experience;
    existingAvailability.remarks = remarks || existingAvailability.remarks;

    await existingAvailability.save();
    return res.status(200).json({
      message: [{ key: "success", value: "Current availability updated successfully" }],
      availability: existingAvailability,
    });
  } catch (error) {
    console.error("Error updating current availability:", error);
    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.deleteCurrentAvailability = async (req, res) => {
  const { id } = req.params;

  try {
    const currentAvailability = await CurrentAvailability.findById(id);
    if (!currentAvailability) {
      return res.status(404).json({ message: [{ key: "error", value: "Current availability not found" }] });
    }

    await CurrentAvailability.findByIdAndDelete(id);
    return res.status(200).json({
      message: [{ key: "success", value: "Current availability deleted successfully" }],
    });
  } catch (error) {
    console.error("Error deleting current availability:", error);
    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};