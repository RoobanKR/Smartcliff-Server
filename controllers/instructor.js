const Instructor = require("../models/InstructorModal");
const { createClient } = require('@supabase/supabase-js');
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseUrl = process.env.SUPABASE_URL;

const supabase = createClient(supabaseUrl, supabaseKey);

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

    const imageFile = req.files?.profile_pic;

    if (!imageFile) {
      return res.status(400).json({
        message: [{ key: "error", value: "Batches image is required" }],
      });
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        message: [{ key: "error", value: "Image size exceeds the 5MB limit" }],
      });
    }

    const uniqueFileName = `${Date.now()}_${imageFile.name}`;

    const { data, error } = await supabase.storage
      .from('SmartCliff/courses/instructors')
      .upload(uniqueFileName, imageFile.data);

    if (error) {
      console.error("Error uploading image to Supabase:", error);
      return res.status(500).json({
        message: [{ key: "error", value: "Error uploading image to Supabase" }],
      });
    }

    const imageUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/courses/instructors/${uniqueFileName}`;

    const newInstructor = new Instructor({
      name,
      experience,
      specialization: specialization.split(","),
      qualification,
      description,
      category: category.split(","),
      profile_pic: imageUrl,
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
      const instructor = await Instructor.find();
  
      
      return res.status(200).json({
        message: [{ key: 'success', value: 'Instructor Retrieved successfully' }],
        Instructor: instructor,
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
     
      return res.status(200).json({
        message: [{ key: 'success', value: 'Instructor retrieved successfully' }],
        instructor: instructor
      });
    } catch (error) {
      console.error("Error retrieving instructor by ID:", error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  

  exports.updateInstructor = async (req, res) => {
    const { id } = req.params;
    const imageFile = req.files?.profile_pic;

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
  
      if (imageFile) {
        if (instructor.profile_pic) {
            try {
                const imageUrlParts = instructor.profile_pic.split('/');
                const imageName = imageUrlParts[imageUrlParts.length - 1];
  
                const {data,error} =  await supabase.storage
                .from('SmartCliff')
                .remove(`courses/instructors/${[imageName]}`);
               
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: [{ key: "error", value: "Error removing existing image from Supabase storage" }] });
            }
        }
  
        const uniqueFileName = `${Date.now()}_${imageFile.name}`;
  
  
        const { data, error } = await supabase.storage
          .from("SmartCliff/courses/instructors")
          .upload(uniqueFileName, imageFile.data);
  
        if (error) {
          return res.status(500).json({ message: [{ key: "error", value: "Error uploading image to Supabase" }] });
        }
        const imageUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/courses/instructors/${uniqueFileName}`;

        instructor.profile_pic = imageUrl;
      }
  
      instructor.name = name;
      instructor.experience = experience;
      instructor.specialization = specialization.split(",");
      instructor.qualification = qualification;
      instructor.description = description;
      instructor.category = category.split(",");
  
      await instructor.save();
  
      return res.status(200).json({ message: [{ key: "success", value: "Instructor updated successfully" }], updated_instructor: instructor });
    } catch (error) {
      console.error("Error updating instructor:", error);
      return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
  };
  

  exports.deleteInstructor = async (req, res) => {
    const { id } = req.params;
  
    try {
      const instructor = await Instructor.findById(id);
  
      if (!instructor) {
        return res.status(404).json({ message: [{ key: "error", value: "Instructor not found" }] });
      }
  
      if (instructor.profile_pic) {
        const imageUrlParts = instructor.profile_pic.split('/');
        const imageName = imageUrlParts[imageUrlParts.length - 1];
  
        try {
          await supabase.storage.from('SmartCliff')
          .remove(`courses/instructors/${[imageName]}`);
        } catch (error) {
          console.error("Error deleting image from Supabase:", error);
        }
      }
  
  
      await Instructor.findByIdAndDelete(id);
  
      return res.status(200).json({ message: [{ key: "success", value: "Instructor deleted successfully" }], deleted_instructor: instructor });
    } catch (error) {
      console.error("Error deleting instructor:", error);
      return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
  };