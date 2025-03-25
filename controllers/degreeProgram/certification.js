const Certification = require("../../models/degreeprogram/CertificationModal");
const path = require("path");
const fs = require("fs");

exports.createCertification = async (req, res) => {
  try {
    const { title, description, service, business_service, college, degree_program } = req.body;

    const existingCertification = await Certification.findOne({ title });

    if (existingCertification) {
      return res.status(403).json({ message: [{ key: "error", value: "Certification title already exists" }] });
    }

    if (!title || !description) {
      return res.status(400).json({ message: [{ key: "error", value: "Required fields" }] });
    }

    const certificationFile = req.files.certification;

    if (certificationFile.size > 3 * 1024 * 1024) {
      return res.status(400).json({
        message: [{ key: "error", value: "File size exceeds the 3MB limit" }],
      });
    }

    const uniqueFileName = `${Date.now()}_${certificationFile.name}`;
    const uploadPath = path.join(__dirname, "../../uploads/degreeprogram/certification", uniqueFileName);

    await certificationFile.mv(uploadPath);

    const newCertification = new Certification({
      title,
      description,
      certification: uniqueFileName,
      service,
      business_service,
      college,
      degree_program,
    });

    await newCertification.save();

    return res.status(201).json({ message: [{ key: "success", value: "Certification added successfully" }] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.getAllCertifications = async (req, res) => {
  try {
    const certifications = await Certification.find()
      .populate("degree_program")
      .populate("service")
      .populate("business_service")
      .populate("college");

    const allCertifications = certifications.map((cert) => {
      const certObj = cert.toObject();
      return {
        ...certObj,
        certification: process.env.BACKEND_URL + "/uploads/degreeprogram/certification/" + certObj.certification,
      };
    });

    return res.status(200).json({
      message: [{ key: "success", value: "Certifications retrieved successfully" }],
      certifications: allCertifications,
    });
  } catch (error) {
    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.getCertificationById = async (req, res) => {
  const { id } = req.params;
  try {
    const certification = await Certification.findById(id)
      .populate("degree_program")
      .populate("service")
      .populate("business_service")
      .populate("college");

    if (!certification) {
      return res.status(404).json({ message: [{ key: "error", value: "Certification not found" }] });
    }

    return res.status(200).json({
      message: [{ key: "success", value: "Certification retrieved successfully" }],
      certification: {
        ...certification.toObject(),
        certification: process.env.BACKEND_URL + "/uploads/degreeprogram/certification/" + certification.certification,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.updateCertification = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, service, business_service, college, degree_program } = req.body;
    const newCertificationFile = req.files?.certification;

    const certification = await Certification.findById(id);

    if (!certification) {
      return res.status(404).json({ message: [{ key: "error", value: "Certification not found" }] });
    }

    if (newCertificationFile) {
      const filePathToDelete = path.join(__dirname, "../../uploads/degreeprogram/certification", certification.certification);

      // Delete the existing certification file if it exists
      if (fs.existsSync(filePathToDelete)) {
        fs.unlink(filePathToDelete, (err) => {
          if (err) {
            console.error("Error deleting certification file:", err);
          }
        });
      }

      const uniqueFileName = `${Date.now()}_${newCertificationFile.name}`;
      const uploadPath = path.join(__dirname, "../../uploads/degreeprogram/certification", uniqueFileName);

      await newCertificationFile.mv(uploadPath);
      certification.certification = uniqueFileName;
    }

    certification.title = title;
    certification.description = description;
    certification.service = service;
    certification.business_service = business_service;
    certification.college = college;
    certification.degree_program = degree_program;

    await certification.save();

    return res.status(200).json({
      message: [{ key: "success", value: "Certification updated successfully" }],
      certification,
    });
  } catch (error) {
    console.error("Error updating certification:", error);
    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.deleteCertification = async (req, res) => {
  const { id } = req.params;

  try {
    const certification = await Certification.findById(id);
    if (!certification) {
      return res.status(404).json({ message: [{ key: "error", value: "Certification not found" }] });
    }

    // If there's a certification file, remove it
    if (certification.certification) {
      const filePath = path.join(__dirname, "../../uploads/degreeprogram/certification", certification.certification);
      if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      }
    }

    await Certification.findByIdAndDelete(id);

    return res.status(200).json({
      message: [{ key: "success", value: "Certification deleted successfully" }],
    });
  } catch (error) {
    console.error("Error deleting certification:", error);
    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};