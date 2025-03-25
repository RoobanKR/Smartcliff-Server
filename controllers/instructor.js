const Instructor = require("../models/InstructorModal");
const path = require("path");
const fs = require("fs");

exports.createInstructor = async (req, res) => {
  try {
    const {
      name,
      experience,
      specialization,
      qualification,
      description,
      category,
    } = req.body;

    if (
      !name ||
      !experience ||
      !specialization ||
      !qualification ||
      !description ||
      !category
    ) {
      return res.status(400).json({
        message: [{ key: "error", value: "Required fields" }],
      });
    }

    if (!req.files || !req.files.profile) {
      return res
        .status(400)
        .json({ message: [{ key: "error", value: "Image is required" }] });
    }

    const imageFile = req.files.profile;
    if (imageFile.size > 3 * 1024 * 1024) {
      return res
        .status(400)
        .json({
          message: [
            { key: "error", value: "Image size exceeds the 3MB limit" },
          ],
        });
    }

    const uniqueFileName = `${Date.now()}_${imageFile.name}`;
    const uploadPath = path.join(
      __dirname,
      "../uploads/courses/instructor",
      uniqueFileName
    );
    await imageFile.mv(uploadPath);

    const newInstructor = new Instructor({
      name,
      experience,
      specialization: specialization.split(","),
      qualification,
      description,
      category: category.split(","),
      profile: uniqueFileName,
    });

    await newInstructor.save();

    return res.status(201).json({
      message: [
        {
          key: "Success",
          value: "Instructor Added Successfully",
        },
      ],
    });
  } catch (error) {
    console.error("Error creating instructor:", error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};

exports.getAllInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.find().populate("category");

    const allInstructor = instructor.map((inst) => {
      const instObj = inst.toObject();
      return {
        ...instObj,
        profile:
          process.env.BACKEND_URL +
          "/uploads/courses/instructor/" +
          instObj.profile,
      };
    });
    return res.status(200).json({
      message: [{ key: "success", value: "Instructor Retrieved successfully" }],
      Instructor: allInstructor,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.getInstructorById = async (req, res) => {
  const { id } = req.params;
  try {
    const instructor = await Instructor.findById(id).populate("category");

    if (!instructor) {
      return res
        .status(404)
        .json({ message: [{ key: "error", value: "Instructor not found" }] });
    }

    return res.status(200).json({
      message: [{ key: "success", value: "Instructor retrieved successfully" }],
      instructor: {
        ...instructor.toObject(),
        profile:
          process.env.BACKEND_URL +
          "/uploads/courses/instructor/" +
          instructor.profile,
      },
    });
  } catch (error) {
    console.error("Error retrieving instructor by ID:", error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.updateInstructor = async (req, res) => {
  const { id } = req.params;

  const {
    name,
    experience,
    specialization,
    qualification,
    description,
    category,
  } = req.body;

  try {
    const instructor = await Instructor.findById(id);
    if (!instructor) {
      return res
        .status(404)
        .json({ message: [{ key: "error", value: "Instructor not found" }] });
    }

    const imageFile = req.files?.profile;
    if (imageFile) {
      if (instructor.profile) {
        const imagePathToDelete = path.join(
          __dirname,
          "../uploads/courses/instructor",
          instructor.profile
        );
        if (fs.existsSync(imagePathToDelete)) {
          fs.unlinkSync(imagePathToDelete);
        }
      }

      const uniqueFileName = `${Date.now()}_${imageFile.name}`;
      const uploadPath = path.join(
        __dirname,
        "../uploads/courses/instructor",
        uniqueFileName
      );
      await imageFile.mv(uploadPath);

      instructor.profile = uniqueFileName;
    }

    instructor.name = name;
    instructor.experience = experience;
    instructor.specialization = specialization.split(",");
    instructor.qualification = qualification;
    instructor.description = description;
    instructor.category = category.split(",");

    await instructor.save();

    return res
      .status(200)
      .json({
        message: [{ key: "success", value: "Instructor updated successfully" }],
        updated_instructor: instructor,
      });
  } catch (error) {
    console.error("Error updating instructor:", error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.deleteInstructor = async (req, res) => {
  const { id } = req.params;

  try {
    const instructor = await Instructor.findById(id);

    if (!instructor) {
      return res
        .status(404)
        .json({ message: [{ key: "error", value: "Instructor not found" }] });
    }

    if (instructor.profile) {
      const imagePath = path.join(
        __dirname,
        "../uploads/courses/instructor",
        instructor.profile
      );
      if (fs.existsSync(imagePath) && fs.lstatSync(imagePath).isFile()) {
        fs.unlinkSync(imagePath);
      }
    }

    await Instructor.findByIdAndDelete(id);

    return res
      .status(200)
      .json({
        message: [{ key: "success", value: "Instructor deleted successfully" }],
        deleted_instructor: instructor,
      });
  } catch (error) {
    console.error("Error deleting instructor:", error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};
