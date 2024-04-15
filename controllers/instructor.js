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

   
    if (!name ||
        !experience ||
        !specialization ||
        !qualification ||
        !description ||
        !category) {
      return res
        .status(400)
        .json({ message: [{ key: "error", value: "Required fields" }] });
    }

    let imageFile = req.files.profile_pic;

    if (!imageFile) {
      return res.status(400).json({
        message: [
          { key: "error", value: "Instructor profile_pic is required" },
        ],
      });
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        message: [
          {
            key: "error",
            value: "Instructor profile_pic size exceeds the 3MB limit",
          },
        ],
      });
    }

    const uniqueFileName = `${Date.now()}_${imageFile.name}`;
    const uploadPath = path.join(
      __dirname,
      "../uploads/instructor",
      uniqueFileName
    );

    try {
      await imageFile.mv(uploadPath);

      const newInstructor = new Instructor({
        name,
        experience,
        specialization:specialization.split(","),
        qualification,
        description,
        category: category.split(','),
        profile_pic: uniqueFileName,
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
      console.error("Error moving the Instructor Image file:", error);
      return res
        .status(500)
        .json({ message: [{ key: "error", value: "Internal server error" }] });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};



exports.getAllInstructor = async (req, res) => {
    try {
      const instructor = await Instructor.find();
  
      const instructorWithImageUrls = instructor.map((instructor) => {
        return {
          ...instructor.toObject(),
          profile_pic: instructor.profile_pic ? process.env.BACKEND_URL + '/uploads/instructor/' + instructor.profile_pic : null,
        };
      });
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Instructor Retrieved successfully' }],
        Instructor: instructorWithImageUrls,
      });
    } catch (error) {
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  
  exports.getInstructorById = async (req, res) => {
    const { id } = req.params;
    try {
      const instructor = await Instructor.findById(id);
      if (!instructor) {
        return res.status(404).json({ message: [{ key: 'error', value: 'Instructor not found' }] });
      }
      const imageURL = instructor.profile_pic ? `${process.env.BACKEND_URL}/uploads/instructor/${instructor.profile_pic}` : null;
      return res.status(200).json({
        message: [{ key: 'success', value: 'Instructor Id based get successfully' }],
        instructor: {
          ...instructor.toObject(),
          profile_pic: imageURL,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
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
            return res.status(404).json({ message: [{ key: "error", value: "Instructor not found" }] });
        }

        let newProfilePic = null;
        if (req.files && req.files.profile_pic) {
            const imageFile = req.files.profile_pic;
            if (imageFile.size > 5 * 1024 * 1024) {
                return res.status(400).json({
                    message: [{ key: "error", value: "Instructor profile_pic size exceeds the 5MB limit" }],
                });
            }
            const uniqueFileName = `${Date.now()}_${imageFile.name}`;
            const uploadPath = path.join(__dirname, "../uploads/instructor", uniqueFileName);
            await imageFile.mv(uploadPath);
            newProfilePic = uniqueFileName;

            if (instructor.profile_pic) {
                const oldImagePath = path.join(__dirname, "../uploads/instructor", instructor.profile_pic);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        instructor.name = name;
        instructor.experience = experience;
        instructor.specialization = specialization.split(",");
        instructor.qualification = qualification;
        instructor.description = description;
        instructor.category = category.split(",");
        if (newProfilePic) {
            instructor.profile_pic = newProfilePic;
        }

        await instructor.save();

        return res.status(200).json({ message: [{ key: "Success", value: "Instructor Updated Successfully" }], updated_instructor: instructor });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
};


  exports.deleteInstructor = async (req, res) => {
    const { id } = req.params;

    try {
        const instructor = await Instructor.findByIdAndDelete(id);
        if (!instructor) {
            return res.status(404).json({ message: [{ key: "error", value: "Instructor not found" }] });
        }

        const imagePath = path.join(__dirname, "../uploads/instructor", instructor.profile_pic);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        return res.status(200).json({ message: [{ key: "Success", value: "Instructor Deleted Successfully" }], deleted_instructor: instructor });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
};
