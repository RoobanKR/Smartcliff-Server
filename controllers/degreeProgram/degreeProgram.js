const DegreeProgram = require("../../models/degreeprogram/DegreeProgramModal");
const path = require("path");
const fs = require("fs");

exports.createDegreeProgram = async (req, res) => {
  try {
    const { title, description, program_name, slogan, slug,year,  service, business_service, college,company } = req.body;

    let uploadedImages = [];
    if (req.files?.images) {
      const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      for (const imageFile of imageFiles) {
        if (imageFile.size > 3 * 1024 * 1024) {
          return res.status(400).json({ message: [{ key: "error", value: "One of the images exceeds the 3MB limit" }] });
        }
        const uniqueImageName = `${Date.now()}_${imageFile.name}`;
        const uploadPath = path.join(__dirname, "../../uploads/degreeprogram/degree/images", uniqueImageName);
        await imageFile.mv(uploadPath);
        uploadedImages.push(uniqueImageName);
      }
    }

    // Ensure college is an array
    const collegeArray = Array.isArray(college) ? college : college ? [college] : [];

    const newDegreeProgram = new DegreeProgram({
      title,
      slug,
      program_name,
      slogan,
      description,
      images: uploadedImages,
      year,
      service,
      business_service,
      college: collegeArray, // Ensure college is an array before saving
      company
    });

    await newDegreeProgram.save();

    return res.status(201).json({ message: [{ key: "Success", value: "Degree Program Added Successfully" }] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.getAllDegreeProgram = async (req, res) => {
  try {
    const degreePrograms = await DegreeProgram.find().populate('service').populate('business_service').populate('college').populate('company');
    const degreeProgram = degreePrograms.map((degree) => {
      const serviceAboutObj = degree.toObject();

      const imageUrls = serviceAboutObj.images.map(
        (image) =>
          `${process.env.BACKEND_URL}/uploads/degreeprogram/degree/images/${image}`
      );

      return {
        ...serviceAboutObj,
        images: imageUrls,
      };
    });

    return res.status(200).json({
      message: [{ key: "SUCCESS", value: "Degree Program getted" }],
      Degree_Program: degreeProgram,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};
exports.getDegreeProgramById = async (req, res) => {
  try {
    const degreeProgram = await DegreeProgram.findById(req.params.id).populate('service').populate('business_service').populate('college').populate('company');

    if (!degreeProgram) {
      return res
        .status(404)
        .json({
          message: [{ key: "error", value: "Degree Program not found" }],
        });
    }

    const serviceAboutObj = degreeProgram.toObject();

    const imageUrls = serviceAboutObj.images.map(
      (image) =>
        `${process.env.BACKEND_URL}/uploads/degreeprogram/degree/images/${image}`
    );

    return res.status(200).json({
      message: [{ key: "success", value: "Degree Program getById Success" }],
      Degree_Program: {
        ...serviceAboutObj,
        images: imageUrls,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.updateDegreeProgram = async (req, res) => {
  try {
    const degreeProgramId = req.params.degreeProgramId;
    const { title, description, program_name, slogan, slug, location, service, business_service, college,company } = req.body;

    let imagesFiles = req.files?.images || [];
    if (!Array.isArray(imagesFiles)) {
      imagesFiles = [imagesFiles];
    }

    // Find the existing degree program
    const existingDegreeProgram = await DegreeProgram.findById(degreeProgramId);
    if (!existingDegreeProgram) {
      return res.status(404).json({
        message: [{ key: "error", value: "Degree Program not found" }],
      });
    }

    let uploadedImages = existingDegreeProgram.images;
    if (req.files?.images) {
      const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

      // Remove old images
      existingDegreeProgram.images.forEach((oldImage) => {
        const oldImagePath = path.join(__dirname, "../../uploads/degreeprogram/degree/images", oldImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      });

      // Upload new images
      uploadedImages = [];
      for (const imageFile of imageFiles) {
        if (imageFile.size > 3 * 1024 * 1024) {
          return res.status(400).json({
            message: [{ key: "error", value: "One of the images exceeds the 3MB limit" }],
          });
        }
        const uniqueImageName = `${Date.now()}_${imageFile.name}`;
        const uploadPath = path.join(__dirname, "../../uploads/degreeprogram/degree/images", uniqueImageName);
        await imageFile.mv(uploadPath);
        uploadedImages.push(uniqueImageName);
      }
    }

    // Ensure college is an array
    const collegeArray = Array.isArray(college) ? college : college ? [college] : [];

    // Update the existing degree program
    existingDegreeProgram.title = title;
    existingDegreeProgram.slug = slug;
    existingDegreeProgram.program_name = program_name;
    existingDegreeProgram.slogan = slogan;
    existingDegreeProgram.description = description;
    existingDegreeProgram.location = location;
    existingDegreeProgram.service = service;
    existingDegreeProgram.business_service = business_service;
    existingDegreeProgram.college = collegeArray;
    existingDegreeProgram.company = company;
    existingDegreeProgram.images = uploadedImages;

    await existingDegreeProgram.save();

    return res.status(200).json({
      message: [{ key: "success", value: "Degree Program updated successfully" }],
    });
  } catch (error) {
    console.error("Error updating Degree Program:", error);
    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.deleteDegreeProgram = async (req, res) => {
  try {
    const degreeProgramId = req.params.degreeProgramId;

    const existingDegreeProgram = await DegreeProgram.findById(degreeProgramId);

    if (!existingDegreeProgram) {
      return res.status(404).json({
        message: [{ key: "error", value: "Degree Program not found" }],
      });
    }

    if (
      existingDegreeProgram.images &&
      existingDegreeProgram.images.length > 0
    ) {
      existingDegreeProgram.images.forEach((image) => {
        const imagePath = path.join(
          __dirname,
          "../../uploads/degreeprogram/degree/images",
          image
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }
    await DegreeProgram.deleteOne({ _id: degreeProgramId });

    return res.status(200).json({
      message: [
        { key: "success", value: "Degree Program deleted successfully" },
      ],
    });
  } catch (error) {
    console.error("Error deleting Degree Program:", error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};
