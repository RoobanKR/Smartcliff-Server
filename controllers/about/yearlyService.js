const YearlyService = require("../../models/about/YearlyServiceModal"); 

exports.createYearlyService = async (req, res) => {
  try {
    const { year, services } = req.body;

    if (!year || !services || !Array.isArray(services)) {
      return res.status(400).json({ message: [{ key: "error", value: "Year and services are required" }] });
    }

    const newYearlyService = new YearlyService({
      year,
      services,
    });

    await newYearlyService.save();
    return res.status(201).json({ message: [{ key: "success", value: "Yearly service created successfully" }] });
  } catch (error) {
    console.error("Error creating yearly service:", error);
    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.getAllYearlyServices = async (req, res) => {
  try {
    const yearlyServices = await YearlyService.find();
    return res.status(200).json({
      message: [{ key: "success", value: "Yearly services retrieved successfully" }],
      services: yearlyServices,
    });
  } catch (error) {
    console.error("Error retrieving yearly services:", error);
    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.getYearlyServiceById = async (req, res) => {
  const { id } = req.params;
  try {
    const yearlyService = await YearlyService.findById(id);
    if (!yearlyService) {
      return res.status(404).json({ message: [{ key: "error", value: "Yearly service not found" }] });
    }
    return res.status(200).json({
      message: [{ key: "success", value: "Yearly service retrieved successfully" }],
      service: yearlyService,
    });
  } catch (error) {
    console.error("Error retrieving yearly service by ID:", error);
    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.updateYearlyService = async (req, res) => {
  const { id } = req.params;
  const { year, services } = req.body;

  try {
    const existingService = await YearlyService.findById(id);
    if (!existingService) {
      return res.status(404).json({ message: [{ key: "error", value: "Yearly service not found" }] });
    }

    existingService.year = year || existingService.year;
    existingService.services = services || existingService.services;

    await existingService.save();
    return res.status(200).json({
      message: [{ key: "success", value: "Yearly service updated successfully" }],
      service: existingService,
    });
  } catch (error) {
    console.error("Error updating yearly service:", error);
    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.deleteYearlyService = async (req, res) => {
  const { id } = req.params;

  try {
    const yearlyService = await YearlyService.findById(id);
    if (!yearlyService) {
      return res.status(404).json({ message: [{ key: "error", value: "Yearly service not found" }] });
    }

    await YearlyService.findByIdAndDelete(id);
    return res.status(200).json({
      message: [{ key: "success", value: "Yearly service deleted successfully" }],
    });
  } catch (error) {
    console.error("Error deleting yearly service:", error);
    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};