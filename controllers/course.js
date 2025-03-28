const Course = require("../models/CourseModal");
const path = require("path");
const fs = require("fs");

exports.createCourse = async (req, res) => {
  try {
    const {
      slug,
      course_name,
      short_description,
      category,
      objective,
      duration,
      mode_of_training,
      number_of_assessments,
      projects,
    } = req.body;

    let course_level;
    if (typeof req.body.course_level === "string") {
      course_level = JSON.parse(req.body.course_level);
    } else {
      course_level = req.body.course_level;
    }

    if (!course_name) {
      return res
        .status(400)
        .json({
          message: [{ key: "error", value: "Course name is required" }],
        });
    }

    const existingCourse = await Course.findOne({ course_name });
    if (existingCourse) {
      return res
        .status(403)
        .json({
          message: [{ key: "error", value: "Course name already exists" }],
        });
    }

    const courseInitials = course_name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();

    const lastCourse = await Course.findOne({
      course_id: new RegExp(`^${courseInitials}\\d{3}$`, "i"),
    }).sort({ course_id: -1 });

    let newCourseId = `${courseInitials}001`;
    if (lastCourse && lastCourse.course_id) {
      const lastNumber = parseInt(lastCourse.course_id.match(/\d+$/)[0], 10);
      newCourseId = `${courseInitials}${String(lastNumber + 1).padStart(
        3,
        "0"
      )}`;
    }

    if (!req.files || !req.files.image) {
      return res
        .status(400)
        .json({ message: [{ key: "error", value: "Image is required" }] });
    }

    const imageFile = req.files.image;
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
      "../uploads/courses/course",
      uniqueFileName
    );
    await imageFile.mv(uploadPath);

    const formattedLevels = Array.isArray(course_level)
      ? course_level.map((level) => ({
          level: level.level,
          duration: level.duration,
          tool_software: Array.isArray(level.tool_software)
            ? level.tool_software
            : [level.tool_software],
          lessons: Array.isArray(level.lessons)
            ? level.lessons.map((lesson) => ({
                title: lesson.title,
                content: Array.isArray(lesson.content)
                  ? lesson.content
                  : [lesson.content],
                duration: lesson.duration,
              }))
            : [],
        }))
      : [];

    const newCourse = new Course({
      course_id: newCourseId,
      slug,
      course_name,
      short_description,
      category,
      image: uniqueFileName,
      objective,
      duration,
      mode_of_training,
      number_of_assessments,
      projects,
      course_level: formattedLevels,
    });

    await newCourse.save();
    return res
      .status(201)
      .json({
        message: [{ key: "Success", value: "Course Added Successfully" }],
      });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("category")
      .populate({
        path: "course_level",
        populate: [
          { path: "tool_software" }
        ],
      });

    const allCourses = courses.map((course) => {
      const serviceObj = course.toObject();

      // Modify the image URL for the course (only if not already a full URL)
      if (serviceObj.image && !serviceObj.image.startsWith('http')) {
        serviceObj.image = process.env.BACKEND_URL + "/uploads/courses/course/" + serviceObj.image;
      }

      // Process course levels
      if (serviceObj.course_level) {
        serviceObj.course_level.forEach((level) => {
          // Modify tool_software image URLs
          if (level.tool_software) {
            level.tool_software.forEach((tool) => {
              // Only add base URL if image doesn't already start with http
              if (tool.image && !tool.image.startsWith('http')) {
                tool.image = process.env.BACKEND_URL + "/uploads/courses/toolsoftware/" + tool.image;
              }
            });
          }

        });
      }

      return serviceObj;
    });

    return res.status(201).json({
      message: [{ key: "SUCCESS", value: "Courses retrieved successfully" }],
      courses: allCourses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      message: [{ key: "error", value: "Internal server error" }] 
    });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId)
      .populate("category")
      .populate({
        path: "course_level",
        populate: [{ path: "tool_software" }],
      });

    if (!course) {
      return res.status(404).json({ 
        message: [{ key: "error", value: "Course not found" }] 
      });
    }

    const courseObj = course.toObject();
    
    // Fix course image URL
    if (courseObj.image && !courseObj.image.startsWith('http')) {
      courseObj.image = process.env.BACKEND_URL + "/uploads/courses/course/" + courseObj.image;
    }

    if (courseObj.course_level) {
      courseObj.course_level.forEach((level) => {
        if (level.tool_software) {
          level.tool_software.forEach((tool) => {
            // Only add base URL if image doesn't already start with http
            if (tool.image && !tool.image.startsWith('http')) {
              tool.image = process.env.BACKEND_URL + "/uploads/courses/toolsoftware/" + tool.image;
            }
          });
        }

      });
    }

    return res.status(201).json({
      message: [
        { key: "SUCCESS", value: "Course retrieved by ID successfully" },
      ],
      courses: courseObj,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      message: [{ key: "error", value: "Internal server error" }] 
    });
  }
};


exports.updateCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    const {
      course_name,
      short_description,
      slug,
      category,
      objective,
      duration,
      mode_of_training,
      number_of_assessments,
      projects,
    } = req.body;

    let course_level;
    if (typeof req.body.course_level === "string") {
      course_level = JSON.parse(req.body.course_level);
    } else {
      course_level = req.body.course_level;
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ message: [{ key: "error", value: "Course not found" }] });
    }

    const imageFile = req.files?.image;
    if (imageFile) {
      if (course.image) {
        const imagePathToDelete = path.join(
          __dirname,
          "../uploads/courses/course",
          course.image
        );
        if (fs.existsSync(imagePathToDelete)) {
          fs.unlinkSync(imagePathToDelete);
        }
      }

      const uniqueFileName = `${Date.now()}_${imageFile.name}`;
      const uploadPath = path.join(
        __dirname,
        "../uploads/courses/course",
        uniqueFileName
      );
      await imageFile.mv(uploadPath);

      course.image = uniqueFileName;
    }

    const formattedLevels = Array.isArray(course_level)
      ? course_level.map((level) => ({
          level: level.level,
          duration: level.duration,
          tool_software: Array.isArray(level.tool_software)
            ? level.tool_software
            : [level.tool_software],
          lessons: Array.isArray(level.lessons)
            ? level.lessons.map((lesson) => ({
                title: lesson.title,
                content: Array.isArray(lesson.content)
                  ? lesson.content
                  : [lesson.content],
                duration: lesson.duration,
              }))
            : [],
        }))
      : [];

    course.course_name = course_name;
    course.slug = slug;
    course.short_description = short_description;
    course.category = category;
    course.objective = objective;
    course.duration = duration;
    course.mode_of_training = mode_of_training;
    course.number_of_assessments = number_of_assessments;
    course.projects = projects;
    course.course_level = formattedLevels;

    await course.save();

    return res
      .status(200)
      .json({
        message: [{ key: "SUCCESS", value: "Course updated successfully" }],
      });
  } catch (error) {
    console.error("Error updating course:", error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const id = req.params.id;

    const existingCourse = await Course.findById(id);

    if (!existingCourse) {
      return res
        .status(404)
        .json({ message: [{ key: "error", value: "Course not found" }] });
    }

    if (existingCourse.image) {
      const imagePath = path.join(
        __dirname,
        "../uploads/courses/course",
        existingCourse.image
      );
      if (fs.existsSync(imagePath) && fs.lstatSync(imagePath).isFile()) {
        fs.unlinkSync(imagePath);
      }
    }

    await Course.deleteOne({ _id: id });

    return res.status(200).json({
      message: [{ key: "success", value: "Course deleted successfully" }],
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};
