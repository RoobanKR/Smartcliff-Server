const Admission = require("../../models/degreeprogram/AdmissionProcessModal");

exports.createAdmission = async (req, res) => {
  try {
    const { admission, degree_program } = req.body;

    if (!admission) {
      return res.status(400).json({
        message: [{ key: "error", value: "Admission data is required" }],
      });
    }

    const admissionObjects = [];

    for (const item of admission) {
      const { heading } = item;

      if (!heading) {
        return res.status(400).json({
          message: [
            { key: "error", value: "Missing fields in admission data" },
          ],
        });
      }

      admissionObjects.push({
        heading,
      });
    }

    const newAdmission = new Admission({
      admission: admissionObjects,
      degree_program,
    });
    await newAdmission.save();

    return res.status(201).json({
      message: [{ key: "Success", value: "Admission Added Successfully" }],
    });
  } catch (error) {
    console.error("Error creating Admission:", error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.getAllAdmission = async (req, res) => {
  try {
    const admissions = await Admission.find().populate("degree_program");
    return res.status(201).json({
      message: [{ key: "Success", value: "Admission Getted Successfully" }],
      admission: admissions,
    });
  } catch (error) {
    console.error("Error fetching Admission:", error);
    res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.getAdmissionById = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetchadmission by ID from the database
    const admission = await Admission.findById(id).populate("degree_program");

    if (!admission) {
      return res
        .status(404)
        .json({ message: [{ key: "error", value: "Admission not found" }] });
    }

    return res.status(201).json({
      message: [
        { key: "Success", value: "Admission Id based get Successfully" },
      ],
      admissionById: admission,
    });
  } catch (error) {
    console.error("Error fetching Admission by ID:", error);
    res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.updateAdmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { admission, degree_program } = req.body;

    if (!admission) {
      return res.status(400).json({
        message: [{ key: "error", value: "admission data is required" }],
      });
    }

    const admissionObjects = [];

    for (const item of admission) {
      const { heading } = item;

      if (!heading) {
        return res.status(400).json({
          message: [{ key: "error", value: "Missing fields inadmission data" }],
        });
      }

      admissionObjects.push({
        heading,
      });
    }

    // Update theadmission by ID
    const updatedAdmission = await Admission.findByIdAndUpdate(id, {
      admission: admissionObjects,
      degree_program,   
    });

    if (!updatedAdmission) {
      return res
        .status(404)
        .json({ message: [{ key: "error", value: "Admission not found" }] });
    }

    return res.status(200).json({
      message: [{ key: "Success", value: "Admission updated successfully" }],
      admission: updatedAdmission,
    });
  } catch (error) {
    console.error("Error updatingadmission:", error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.deleteAdmission = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete theadmission by ID
    const deletedAdmission = await Admission.findByIdAndDelete(id);

    if (!deletedAdmission) {
      return res
        .status(404)
        .json({ message: [{ key: "error", value: "Admission not found" }] });
    }

    return res.status(200).json({
      message: [{ key: "Success", value: "Admission deleted successfully" }],
    });
  } catch (error) {
    console.error("Error deletingadmission:", error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};
