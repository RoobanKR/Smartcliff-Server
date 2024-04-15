const DegreeProgram = require("../../models/degreeprogram/DegreeProgramModal");
const path = require("path");
const fs = require('fs');

exports.createDegreeProgram = async (req, res) => {
    try {
        const { title, description,program_name,slogan } = req.body;
        const existingDegreeProgram = await DegreeProgram.findOne({ title });
        if (existingDegreeProgram) {
            return res.status(403).json({ message: [{ key: "error", value: "College Name already exists" }] });
        }
        if (!title || !description) {
            return res.status(400).json({ message: [{ key: "error", value: "Required fields" }] });
        }

        let imagesFiles = req.files.images;

        if (!Array.isArray(imagesFiles)) {
            imagesFiles = [imagesFiles];
        }

        if (imagesFiles.length === 0) {
            return res.status(400).json({ message: [{ key: "error", value: "Degree Program images are required" }] });
        }

        if (imagesFiles.length > 3) {
            return res.status(400).json({ message: [{ key: "error", value: "Maximum 3 images are allowed" }] });
        }

        const images = [];

        for (const imagesFile of imagesFiles) {
            if (imagesFile.size > 5 * 1024 * 1024) {
                return res.status(400).json({ message: [{ key: "error", value: "Degree Program image size exceeds the 5MB limit" }] });
            }

            const uniqueFileName = `${Date.now()}_${imagesFile.name}`;
            const uploadPath = path.join(__dirname, "../../uploads/mca/degree_Program", uniqueFileName);

            try {
                await imagesFile.mv(uploadPath);
                images.push(uniqueFileName);
            } catch (err) {
                console.error("Error moving the Degree Program Image file:", err);
                return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
            }
        }

        const newDegreeProgram = new DegreeProgram({
            title,
            program_name,
            slogan,
            description,
            images
        });

        try {
            await newDegreeProgram.save();
            return res.status(201).json({ message: [{ key: "Success", value: "Degree Program Added Successfully" }] });
        } catch (error) {
            return res.status(500).json({ message: [{ key: "error", value: "Failed to save Degree Program" }] });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
};

exports.getAllDegreeProgram = async (req, res) => {
  try {
    const degreeProgram = await DegreeProgram.find();

    const degreeProgramWithImage = degreeProgram.map((degreeProgram) => {
      const degreeProgramsWithImages = { ...degreeProgram._doc };
      degreeProgramsWithImages.images = degreeProgram.images.map(
        (image) => `${process.env.BACKEND_URL}/uploads/mca/degree_Program/${image}`
      );


      return degreeProgramsWithImages;
    });

    return res.status(200).json({
      message: [{ key: "SUCCESS", value: "Degree Program getted" }],
      Degree_Program: degreeProgramWithImage,
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
  
      const degreePrograms = {
        ...degreeProgram.toObject(),
        images: degreeProgram.images
          ? degreeProgram.images.map(
              (images) => `${process.env.BACKEND_URL}/uploads/mca/degree_Program/${images}`
            )
          : null,
      };
  
  
      return res.status(201).json({
        message: [{ key: "SUCCESS", value: "Degree Program getById Success" }],
        Degree_Program: degreePrograms,
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
      const { title,description,program_name,slogan } = req.body;
      let imagesFiles = req.files.images;
  
      if (!title) {
        return res.status(400).json({ message: [{ key: "error", value: "Required fields" }] });
      }
      
      if (!Array.isArray(imagesFiles)) {
        imagesFiles = [imagesFiles];
      }
  
      const existingDegreeProgram = await DegreeProgram.findById(degreeProgramId);
  
      if (!existingDegreeProgram) {
        return res.status(404).json({ message: "Degree Program not found" });
      }
      if (imagesFiles.length > 3) {
        return res.status(400).json({ message: [{ key: "error", value: "Maximum 3 images are allowed" }] });
    }

      for (const imageName of existingDegreeProgram.images) {
        try {
          fs.unlinkSync(path.join(__dirname, `../../uploads/mca/degree_Program/${imageName}`));
        } catch (err) {
          console.error("Error removing existing Degree Program image file:", err);
        }
      }
  
      const images = [];
  
      for (const imagesFile of imagesFiles) {
        if (imagesFile.size > 5 * 1024 * 1024) {
          return res.status(400).json({ message: [{ key: "error", value: "Degree Program image size exceeds the 3MB limit" }] });
        }
        
        const uniqueFileName = `${Date.now()}_${imagesFile.name}`;
        const uploadPath = path.join(__dirname, "../../uploads/mca/degree_Program", uniqueFileName);
  
        try {
          await imagesFile.mv(uploadPath);
          images.push(uniqueFileName);
        } catch (err) {
          console.error("Error moving the Category Image file:", err);
          return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
        }
      }
  
      existingDegreeProgram.title = title;
      existingDegreeProgram.program_name = program_name;
      existingDegreeProgram.slogan = slogan;
      existingDegreeProgram.description = description;

      existingDegreeProgram.images = images;
  
      try {
        await existingDegreeProgram.save();
        return res.status(200).json({ message: [{ key: "success", value: "Degree Program updated successfully" }] });
      } catch (error) {
        return res.status(500).json({ message: [{ key: "error", value: "Failed to update Degree Program" }] });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
  };
  

  exports.deleteDegreeProgram = async (req, res) => {
    try {
      const degreeProgramId = req.params.degreeProgramId;
  
      const existingDegreeProgram = await DegreeProgram.findById(degreeProgramId);
  
      if (!existingDegreeProgram) {
      return res.status(404).json({ message: [{ key: "error", value: "Degree Program not found" }] });
      }
  
      for (const imageName of existingDegreeProgram.images) {
        try {
          fs.unlinkSync(path.join(__dirname, `../../uploads/mca/degree_Program/${imageName}`));
        } catch (err) {
          console.error("Error removing Degree Program image file:", err);
        }
      }
  
      await DegreeProgram.deleteOne({ _id: degreeProgramId });
  
      return res.status(200).json({ message: [{ key: "success", value: "Degree Program Delete successfully" }] });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
  };
  