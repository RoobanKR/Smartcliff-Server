const Course = require("../models/CourseModal");
const path = require("path");
const fs = require("fs");

exports.createCourse = async (req, res) => {
  try {
    const {
      course_id,
      course_name,
      short_description,
      objective,
      cost,
      duration,
      mode_of_trainee,
      course_level,
      certificate,
      number_of_assesment,
      projects,
      tool_software,
      category,
      instructor,
    } = req.body;
    const existingCourse = await Course.findOne({ course_name});
        if (existingCourse) {
            return res.status(403).json({ message: [{ key: "error", value: "Course name already exists" }] });
        }

        const existingCourseId = await Course.findOne({ course_id });
        if (existingCourseId) {
            return res.status(403).json({ message: [{ key: "error", value: "Course Id already exists" }] });
        }
    let imagesFiles = req.files.images;

    if (!Array.isArray(imagesFiles)) {
      imagesFiles = [imagesFiles];
    }

    if (imagesFiles.length === 0) {
      return res
        .status(400)
        .json({
          message: [{ key: "error", value: "Course images are required" }],
        });
    }

    const images = [];
    for (const imagesFile of imagesFiles) {
      if (imagesFile.size > 3 * 1024 * 1024) {
        return res
          .status(400)
          .json({
            message: [
              {
                key: "error",
                value: "Course image size exceeds the 3MB limit",
              },
            ],
          });
      }

      const uniqueFileName = `${Date.now()}_${imagesFile.name}`;
      const uploadPath = path.join(
        __dirname,
        "../uploads/course",
        uniqueFileName
      );

      try {
        await imagesFile.mv(uploadPath);
        images.push(uniqueFileName);
      } catch (err) {
        console.error("Error moving the Course Image file:", err);
        return res
          .status(500)
          .json({
            message: [{ key: "error", value: "Internal server error" }],
          });
      }
    }

    const newCourse = new Course({
      course_id,
      course_name,
      short_description,
      objective,
      cost,
      images,
      course_level,
      duration,
      mode_of_trainee,
      certificate,
      number_of_assesment,
      projects,
      tool_software:
        typeof tool_software === "string"
          ? tool_software.split(",")
          : Array.isArray(tool_software)
          ? tool_software
          : [],
      category,
      instructor:
        typeof instructor === "string"
          ? instructor.split(",")
          : Array.isArray(instructor)
          ? instructor
          : [],
    });

    try {
      await newCourse.save();
      return res
        .status(201)
        .json({
          message: [{ key: "Success", value: "Course Added Successfully" }],
        });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: [{ key: "error", value: "Failed to save Course" }] });
    }
  } catch (error) {
    console.log("error", error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("tool_software")
      .populate("category")
      .populate({
        path: "instructor",
        populate: {
          path: "category",
        },
      });

    const courseWithImages = courses.map((course) => {
      const courseData = { ...course._doc };

      if (course.images && course.images.length > 0) {
        const imagesWithUrls = course.images.map(
          (image) => `${process.env.BACKEND_URL}/uploads/course/${image}`
        );
        courseData.images = imagesWithUrls;
      }

      if (course.tool_software && course.tool_software.length > 0) {
        const toolSoftwareImagesWithUrls = course.tool_software.map((tool) => ({
          ...tool._doc,
          image: `${process.env.BACKEND_URL}/uploads/tool_software/${tool.image}`,
        }));
        courseData.tool_software = toolSoftwareImagesWithUrls;
      }

      if (course.category && course.category.images && course.category.images.length > 0) {
        const categoryImagesWithUrls = course.category.images.map(
          (image) =>
            `${process.env.BACKEND_URL}/uploads/category/${image.split("/").pop()}`
        );
        courseData.category.images = categoryImagesWithUrls;
      }

      if (course.instructor && course.instructor.length > 0) {
        courseData.instructor = course.instructor.map((instructor) => {
          if (instructor.profile_pic) {
            const instructorProfilePicFilename = instructor.profile_pic
              .split("/")
              .pop();
            const instructorProfilePicUrl = `${process.env.BACKEND_URL}/uploads/instructor/${instructorProfilePicFilename}`;
            return { ...instructor._doc, profile_pic: instructorProfilePicUrl };
          } else {
            return instructor;
          }
        });
      }

      return courseData;
    });

    return res.status(201).json({
      message: [{ key: "SUCCESS", value: "Courses retrieved successfully" }],
      courses: courseWithImages,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId)
      .populate("tool_software")
      .populate("category")
      .populate({
        path: "instructor",
        populate: {
          path: "category",
        },
      });

    if (!course) {
      return res
        .status(404)
        .json({ message: [{ key: "error", value: "Course not found" }] });
    }

    const courseData = { ...course._doc };

    if (course.images && course.images.length > 0) {
      const imagesWithUrls = course.images.map(
        (image) => `${process.env.BACKEND_URL}/uploads/course/${image}`
      );
      courseData.images = imagesWithUrls;
    }

    if (course.tool_software && course.tool_software.length > 0) {
      const toolSoftwareImagesWithUrls = course.tool_software.map((tool) => ({
        ...tool._doc,
        image: `${process.env.BACKEND_URL}/uploads/tool_software/${tool.image}`,
      }));
      courseData.tool_software = toolSoftwareImagesWithUrls;
    }

    if (course.category && course.category.images && course.category.images.length > 0) {
      const categoryImagesWithUrls = course.category.images.map(
        (image) =>
          `${process.env.BACKEND_URL}/uploads/category/${image.split("/").pop()}`
      );
      courseData.category.images = categoryImagesWithUrls;
    }

    if (course.instructor && course.instructor.length > 0) {
      courseData.instructor = course.instructor.map((instructor) => {
        if (instructor.profile_pic) {
          const instructorProfilePicFilename = instructor.profile_pic
            .split("/")
            .pop();
          const instructorProfilePicUrl = `${process.env.BACKEND_URL}/uploads/instructor/${instructorProfilePicFilename}`;
          return { ...instructor._doc, profile_pic: instructorProfilePicUrl };
        } else {
          return instructor;
        }
      });
    }

    return res.status(201).json({
      message: [
        { key: "SUCCESS", value: "Courses retrieved Id based successfully" },
      ],
      courses: courseData,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};


exports.updateCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    const {
      course_name,
      short_description,
      objective,
      cost,
      duration,
      mode_of_trainee,
      course_level,
      certificate,
      number_of_assesment,
      projects,
      tool_software,
      category,
      instructor,
    } = req.body;

    const course = await Course.findById(courseId);
    const imageFile = req.files && req.files.images; // Use a single variable for the image file

    if (!course) {
      return res.status(404).json({ message: [{ key: "error", value: "Course not found" }] });
    }

    if (!imageFile) { // Check if imageFile exists for single image update
      return res.status(400).json({ message: [{ key: "error", value: "No image was uploaded for the course" }] });
    }

    // Remove existing images if any
    for (const imageName of course.images) {
      try {
        fs.unlinkSync(path.join(__dirname, `../uploads/course/${imageName}`));
      } catch (err) {
        console.error("Error removing existing course image file:", err);
      }
    }

    const images = [];

    // Handle single or multiple image uploads
    if (Array.isArray(imageFile)) {
      // Handle multiple images
      for (const image of imageFile) {
        if (image.size > 3 * 1024 * 1024) {
          return res.status(400).json({ message: [{ key: "error", value: "Course image size exceeds the 3MB limit" }] });
        }

        const uniqueFileName = `${Date.now()}_${image.name}`;
        const uploadPath = path.join(__dirname, "../uploads/course", uniqueFileName);

        try {
          await image.mv(uploadPath);
          images.push(uniqueFileName);
        } catch (err) {
          console.error("Error moving the course image file:", err);
          return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
        }
      }
    } else {
      // Handle single image
      if (imageFile.size > 3 * 1024 * 1024) {
        return res.status(400).json({ message: [{ key: "error", value: "Course image size exceeds the 3MB limit" }] });
      }

      const uniqueFileName = `${Date.now()}_${imageFile.name}`;
      const uploadPath = path.join(__dirname, "../uploads/course", uniqueFileName);

      try {
        await imageFile.mv(uploadPath);
        images.push(uniqueFileName);
      } catch (err) {
        console.error("Error moving the course image file:", err);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
      }
    }

    // Update course data
    course.course_name = course_name;
    course.short_description = short_description;
    course.objective = objective;
    course.cost = cost;
    course.duration = duration;
    course.images = images;
    course.mode_of_trainee = mode_of_trainee;
    course.course_level = course_level;
    course.certificate = certificate;
    course.number_of_assesment = number_of_assesment;
    course.projects = projects;
    course.tool_software = typeof tool_software === "string" ? tool_software.split(",") : Array.isArray(tool_software) ? tool_software : [];
    course.category = category;
    course.instructor = typeof instructor === "string" ? instructor.split(",") : Array.isArray(instructor) ? instructor : [];

    await course.save();

    return res.status(201).json({
      message: [{ key: "SUCCESS", value: "Course updated successfully" }],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
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

    for (const imageName of existingCourse.images) {
      try {
        fs.unlinkSync(path.join(__dirname, `../uploads/course/${imageName}`));
      } catch (err) {
        console.error("Error removing category image file:", err);
      }
    }

    await Course.deleteOne({ _id: id });

    return res
      .status(200)
      .json({
        message: [{ key: "success", value: "Course Delete successfully" }],
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};
