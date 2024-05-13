const Course = require("../models/CourseModal");
const path = require("path");
const fs = require("fs");
const { createClient } = require('@supabase/supabase-js');
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseUrl = process.env.SUPABASE_URL;

const supabase = createClient(supabaseUrl, supabaseKey);
exports.createCourse = async (req, res) => {
  try {
    const {
      course_id,
      slug,
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
        const images = [];

        if (req.files?.images) {
          const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
    
          for (const imageFile of imageFiles) {
            if (imageFile.size > 3 * 1024 * 1024) {
              return res.status(400).json({
                message: [{ key: "error", value: "Image size exceeds the 3MB limit" }],
              });
            }
    
            const uniqueFileName = `${Date.now()}_${imageFile.name}`;
    
            const { data, error } = await supabase.storage
            .from('SmartCliff/courses/course')
            .upload(uniqueFileName, imageFile.data);
    
            if (error) {
              console.error("Error uploading image to Supabase:", error);
              return res.status(500).json({
                message: [{ key: "error", value: "Error uploading image to Supabase" }],
              });
            }
    
            const imageUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/courses/course/${uniqueFileName}`;
            images.push(imageUrl);
          }
        }

    const newCourse = new Course({
      course_id,
      slug,
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

   
    return res.status(201).json({
      message: [{ key: "SUCCESS", value: "Courses retrieved successfully" }],
      courses: courses,
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

   
    return res.status(201).json({
      message: [
        { key: "SUCCESS", value: "Courses retrieved Id based successfully" },
      ],
      courses: course,
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
      slug,
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

    if (!course) {
      return res.status(404).json({ message: [{ key: "error", value: "Course not found" }] });
    }

    const imageFile = req.files?.images; // Access uploaded image(s)
    const images = [];

    if (imageFile) {
      const imageFiles = Array.isArray(imageFile) ? imageFile : [imageFile]; // Handle single or multiple files

      // Delete existing images from Supabase storage
      for (const imageUrl of course.images) {
        const imageParts = imageUrl.split("/");
        const imageName = imageParts[imageParts.length - 1];
        try {
          const { data, error } = await supabase.storage
          .from('SmartCliff')
              .remove(`courses/course/${[imageName]}`);
          if (error) {
            console.error("Error removing existing course image from Supabase:", error);
          }
        } catch (err) {
          console.error("Error deleting existing course image from Supabase:", err);
        }
      }

      // Upload new image(s) to Supabase
      for (const image of imageFiles) {
        if (image.size > 3 * 1024 * 1024) {
          return res.status(400).json({ message: [{ key: "error", value: "Course image size exceeds the 3MB limit" }] });
        }

        const uniqueFileName = `${Date.now()}_${image.name}`;

        try {
          const { data, error } = await supabase.storage
          .from('SmartCliff/courses/course')
          .upload(uniqueFileName, imageFile.data);


          if (error) {
            console.error("Error uploading image to Supabase:", error);
            return res.status(500).json({ message: [{ key: "error", value: "Error uploading image to Supabase" }] });
          }

          const imageUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/courses/course/${uniqueFileName}`;
          images.push(imageUrl);
        } catch (err) {
          console.error("Error moving the course image file:", err);
          return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
        }
      }
    }

    // Update course data
    course.course_name = course_name;
    course.slug = slug;
    course.short_description = short_description;
    course.objective = objective;
    course.cost = cost;
    course.duration = duration;
    course.mode_of_trainee = mode_of_trainee;
    course.course_level = course_level;
    course.certificate = certificate;
    course.number_of_assesment = number_of_assesment;
    course.projects = projects;
    course.tool_software = typeof tool_software === "string" ? tool_software.split(",") : Array.isArray(tool_software) ? tool_software : [];
    course.category = category;
    course.instructor = typeof instructor === "string" ? instructor.split(",") : Array.isArray(instructor) ? instructor : [];
    course.images = images;

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

    // Delete associated images from Supabase storage
    const supabaseImagePaths = existingCourse.images.map((imageUrl) => {
      const parts = imageUrl.split('/');
      return `courses/course/${parts[parts.length - 1]}`;
    });

    try {
      const { data, error } = await supabase.storage
      .from('SmartCliff')
      .remove(`courses/course/${[supabaseImagePaths]}`);

      if (error) {
        console.error("Error removing course images from Supabase:", error);
        return res.status(500).json({ message: [{ key: "error", value: "Error deleting course images" }] });
      }
    } catch (err) {
      console.error("Error deleting course images from Supabase:", err);
      return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }

    // Delete course from MongoDB
    await Course.deleteOne({ _id: id });

    return res.status(200).json({
      message: [{ key: "success", value: "Course deleted successfully" }],
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};