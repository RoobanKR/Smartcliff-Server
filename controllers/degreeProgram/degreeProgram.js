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

      let imagesFiles = req.files?.images || [];
      if (!Array.isArray(imagesFiles)) {
        imagesFiles = [imagesFiles]; // Ensure it's always an array
      }

      if (imagesFiles.length === 0) {
          return res.status(400).json({ message: [{ key: "error", value: "Degree Program images are required" }] });
      }

      if (imagesFiles.length > 3) {
          return res.status(400).json({ message: [{ key: "error", value: "Maximum 3 images are allowed" }] });
      }

      const images = [];
      for (const imageFile of imagesFiles) {
        if (imageFile.size > 3 * 1024 * 1024) {
          return res.status(400).json({ message: [{ key: "error", value: "Image size exceeds 3MB" }] });
        }

        const uniqueFileName = `${Date.now()}_${imageFile.name}`;

        const { data, error } = await supabase.storage
          .from('SmartCliff/degreeProgram/degree_program')
          .upload(uniqueFileName, imageFile.data);

        if (error) {
          return res.status(500).json({ message: [{ key: "error", value: "Error uploading image to Supabase" }] });
        }

        const imageUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/degreeProgram/degree_program/${uniqueFileName}`;
        images.push(imageUrl);
      }

      const newDegreeProgram = new DegreeProgram({
        title,
        slug,
        program_name,
        slogan,
        description,
        images,
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
    const degreeProgram = await DegreeProgram.find();

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
  
   
      return res.status(201).json({
        message: [{ key: "SUCCESS", value: "Degree Program getById Success" }],
        Degree_Program: degreeProgram,
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
        if (imagesFiles.length > 0) {
            // Delete existing images from Supabase
            for (const imageUrl of existingDegreeProgram.images) {
                const parts = imageUrl.split("/");
                const imageName = parts[parts.length - 1];
                await supabase.storage
                    .from('SmartCliff/degreeProgram/degree_program')
                    .remove([`degreeProgram/degree_program/${imageName}`]); 
            }

            const newImages = [];
            for (const imageFile of imagesFiles) {
                if (imageFile.size > 3 * 1024 * 1024) {
                    return res.status(400).json({ message: [{ key: "error", value: "Image size exceeds 3MB limit" }] });
                }

                const uniqueFileName = `${Date.now()}_${imageFile.name}`;
                const { error } = await supabase.storage
                    .from('SmartCliff/degreeProgram/degree_program')
                    .upload(uniqueFileName, imageFile.data);

                if (error) {
                    console.error("Error uploading image to Supabase:", error);
                    return res.status(500).json({ message: [{ key: "error", value: "Error uploading image to Supabase" }] });
                }

                const imageUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/degreeProgram/degree_program/${uniqueFileName}`;
                newImages.push(imageUrl);
            }
            
            existingDegreeProgram.images = newImages; // Update the images field
        }

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
        const supabaseImagePaths = existingDegreeProgram.images.map((imageUrl) => {
          const parts = imageUrl.split('/');
          return `degreeProgram/degree_program/${parts[parts.length - 1]}`;
        });
    
        try {
          const { data, error } = await supabase.storage
          .from('SmartCliff')
          .remove(`degreeProgram/degree_program/${[supabaseImagePaths]}`);
    
          if (error) {
            console.error("Error removing course images from Supabase:", error);
            return res.status(500).json({ message: [{ key: "error", value: "Error deleting course images" }] });
          }
        } catch (err) {
          console.error("Error deleting course images from Supabase:", err);
          return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
        }
        // Delete Degree Program from MongoDB
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