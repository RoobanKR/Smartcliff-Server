const DegreeProgram = require("../../models/degreeprogram/DegreeProgramModal");
const path = require("path");
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseUrl = process.env.SUPABASE_URL;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.createDegreeProgram = async (req, res) => {
  try {
      const { title, description, program_name, slogan, slug } = req.body;
      const existingDegreeProgram = await DegreeProgram.findOne({ title });
      if (existingDegreeProgram) {
          return res.status(403).json({ message: [{ key: "error", value: "College Name already exists" }] });
      }
      if (!title || !description) {
          return res.status(400).json({ message: [{ key: "error", value: "Required fields" }] });
      }

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

      const newDegreeProgram = new DegreeProgram({
        title,
        slug,
        program_name,
        slogan,
        description,
        images:uploadedImages,
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
    const degreePrograms = await DegreeProgram.find();
    const degreeProgram = degreePrograms.map((degree) => {
      const serviceAboutObj = degree.toObject();

      const imageUrls = serviceAboutObj.images.map(image => 
          `${process.env.BACKEND_URL}/uploads/degreeprogram/degree/images/${image}`
      );

      return {
          ...serviceAboutObj,
          images: imageUrls, // Store array of full image URLs
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
      const degreeProgram = await DegreeProgram.findById(req.params.id);
  
      if (!degreeProgram) {
        return res
          .status(404)
          .json({ message: [{ key: "error", value: "Degree Program not found" }] });
      }
  
      const serviceAboutObj = degreeProgram.toObject();

      const imageUrls = serviceAboutObj.images.map(image => 
          `${process.env.BACKEND_URL}/uploads/degreeprogram/degree/images/${image}`
      );

      return res.status(200).json({
          message: [{ key: 'success', value: 'Degree Program getById Success' }],
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
        const { title, description, program_name, slogan, slug } = req.body;
        let imagesFiles = req.files?.images || [];
        
        if (!Array.isArray(imagesFiles)) {
            imagesFiles = [imagesFiles]; // Ensure it's always an array
        }

        // Find the existing program
        const existingDegreeProgram = await DegreeProgram.findById(degreeProgramId);
        if (!existingDegreeProgram) {
            return res.status(404).json({ message: [{ key: "error", value: "Degree Program not found" }] });
        }

        // If there are new images, update them
        let uploadedImages = existingDegreeProgram.images; // Keep old images if not updated
        if (req.files?.images) {
            const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

            // Delete old images
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
                    return res.status(400).json({ message: [{ key: "error", value: "One of the images exceeds the 3MB limit" }] });
                }
                const uniqueImageName = `${Date.now()}_${imageFile.name}`;
                const uploadPath = path.join(__dirname, "../../uploads/degreeprogram/degree/images", uniqueImageName);
                await imageFile.mv(uploadPath);
                uploadedImages.push(uniqueImageName);
            }

            existingDegreeProgram.images = uploadedImages; // Update the images field
        }

        // Assign other fields
        existingDegreeProgram.title = title;
        existingDegreeProgram.slug = slug;
        existingDegreeProgram.program_name = program_name;
        existingDegreeProgram.slogan = slogan;
        existingDegreeProgram.description = description;

        // Save the updated document
        await existingDegreeProgram.save();

        return res.status(200).json({ message: [{ key: "success", value: "Degree Program updated successfully" }] });

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

        // Delete images from Supabase storage
  if (existingDegreeProgram.images && existingDegreeProgram.images.length > 0) {
    existingDegreeProgram.images.forEach((image) => {
                const imagePath = path.join(__dirname, "../../uploads/degreeprogram/degree/images", image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            });
        }        // Delete Degree Program from MongoDB
        await DegreeProgram.deleteOne({ _id: degreeProgramId });

        return res.status(200).json({
            message: [{ key: "success", value: "Degree Program deleted successfully" }],
        });
    } catch (error) {
        console.error("Error deleting Degree Program:", error);
        return res.status(500).json({
            message: [{ key: "error", value: "Internal server error" }],
        });
    }
};