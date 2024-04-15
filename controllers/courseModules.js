const CourseModules = require("../models/CourseModulesModal");

exports.createCourseModules = async (req, res) => {
  try {
    const { modules, course } = req.body;

    if (!course) {
      return res.status(400).json({
        message: [{ key: "error", value: "Course ID is required" }],
      });
    }

    // Check if modules array is empty
    if (!modules || modules.length === 0) {
      return res.status(400).json({
        message: [{ key: "error", value: "Modules array cannot be empty" }],
      });
    }

    // Validate and save each module
    const newCourseModules = new CourseModules({
      modules,
      course,
    });

    await newCourseModules.save();

    return res.status(201).json({
      message: [{ key: "Success", value: "Course Modules added successfully" }],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};



exports.getAllCourseModules = async (req, res) => {
  try {
    const courseModules = await CourseModules.find().populate("course");
    return res
      .status(201)
      .json({
        message: [
          { key: "Success", value: "Course Modules Get All Successfully" },
        ],
        course_Module: courseModules,
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.getCourseModuleById = async (req, res) => {
  const { id } = req.params;
  try {
    const courseModule = await CourseModules.findById(id).populate("course");
    if (!courseModule) {
      return res
        .status(404)
        .json({
          message: [{ key: "error", value: "Course Module not found" }],
        });
    }
    return res
      .status(201)
      .json({
        message: [
          { key: "Success", value: "Course Modules getById Successfully" },
        ],
        course_Module: courseModule,
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.updateCourseModule = async (req, res) => {
  const { id } = req.params;
  const { modules, course } = req.body;

  try {
    const updatedCourseModule = await CourseModules.findByIdAndUpdate(
      id,
      { modules, course }
    );

    if (!updatedCourseModule) {
      return res
        .status(404)
        .json({
          message: [{ key: "error", value: "Course Module not found" }],
        });
    }

    return res
      .status(200)
      .json({
        message: [
          { key: "Success", value: "Course Module Updated Successfully" },
        ],
        updated_module: updatedCourseModule,
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.deleteCourseModule = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCourseModule = await CourseModules.findByIdAndDelete(id);

    if (!deletedCourseModule) {
      return res
        .status(404)
        .json({
          message: [{ key: "error", value: "Course Module not found" }],
        });
    }

    return res
      .status(200)
      .json({
        message: [
          { key: "Success", value: "Course Module Deleted Successfully" },
        ],
        deleted_module: deletedCourseModule,
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};
