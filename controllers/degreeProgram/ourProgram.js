const OurProgram = require("../../models/degreeprogram/OurProgramModal");
const path = require("path");
const fs = require('fs');

exports.createOurProgram = async (req, res) => {
    try {
        const { title, description,degree_program } = req.body;
        const existingOurProgram = await OurProgram.findOne({ title });
        
        if (existingOurProgram) {
            return res.status(403).json({ message: [{ key: "error", value: "Our Program Name already exists" }] });
        }

        if (!title || !description) {
            return res.status(400).json({ message: [{ key: "error", value: "Required fields" }] });
        }

        let iconFile = req.files.icon;

        if (!iconFile) {
            return res.status(400).json({ message: [{ key: "error", value: "Our Program icon is required" }] });
        }

        if (iconFile.size > 5 * 1024 * 1024) {
            return res.status(400).json({ message: [{ key: "error", value: "Our Program icon size exceeds the 3MB limit" }] });
        }

        const uniqueFileName = `${Date.now()}_${iconFile.name}`;
        const uploadPath = path.join(__dirname, "../../uploads/mca/our_Program", uniqueFileName);

        try {
            await iconFile.mv(uploadPath);

            const newOurProgram = new OurProgram({
                title,
                description,
                icon: uniqueFileName,
                degree_program
            });

            await newOurProgram.save();

            return res.status(201).json({ message: [{ key: "Success", value: "Our Program Added Successfully" }] });
        } catch (error) {
            return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
};


exports.getAllOurProgram = async (req, res) => {
    try {
      const ourPrograms = await OurProgram.find().populate("degree_program");
  
      const ourProgramsWithImageUrls = ourPrograms.map((program) => {
        return {
          ...program.toObject(),
          icon: program.icon ? process.env.BACKEND_URL + '/uploads/mca/our_Program/' + program.icon : null,
        };
      });
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Our Program Retrieved successfully' }],
        our_Programs: ourProgramsWithImageUrls,
      });
    } catch (error) {
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  
  exports.getOurProgramById = async (req, res) => {
    const { id } = req.params;
    try {
      const ourPrograms = await OurProgram.findById(id).populate("degree_program");
      if (!ourPrograms) {
        return res.status(404).json({ message: [{ key: 'error', value: 'Our Program not found' }] });
      }
      const iconURL = ourPrograms.icon ? `${process.env.BACKEND_URL}/uploads/mca/our_Program/${ourPrograms.icon}` : null;
      return res.status(200).json({
        message: [{ key: 'success', value: 'Our Program Retrieved successfully' }],
        our_ProgramsById: {
          ...ourPrograms.toObject(),
          icon: iconURL,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  


  
  exports.updateOurProgram = async (req, res) => {
    const { id } = req.params;
    const { title, description,degree_program } = req.body;
    let newImage = req.files ? req.files.icon : null;
  
    try {
      const ourProgram = await OurProgram.findById(id);

      if (!ourProgram) {
        return res.status(404).json({ message: [{ key: 'error', value: 'Our Program not found' }] });
      }
   
  
      // if (ourProgram.icon) {
      //   const oldImagePath = path.join(__dirname, '../../uploads/mca/our_program', ourProgram.icon);
      //   fs.unlinkSync(oldImagePath);
      // }
  
      ourProgram.title = title;
      ourProgram.description = description;
      ourProgram.degree_program = degree_program;

      if (newImage) {
        ourProgram.icon = null;
  
        const uniqueFileName = `${Date.now()}_${newImage.name}`;
        const uploadPath = path.join(__dirname, '../../uploads/mca/our_program', uniqueFileName);
        await newImage.mv(uploadPath);
  
        ourProgram.icon = uniqueFileName;
      }
  
      await ourProgram.save();
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Our Program updated successfully' }],
        ourProgram,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  

  exports.deleteOurProgram = async (req, res) => {
    const { id } = req.params;
  
    try {
      const ourProgram = await OurProgram.findById(id);
      if (!ourProgram) {
        return res.status(404).json({ message: [{ key: 'error', value: 'Our Program not found' }] });
      }
  
      if (ourProgram.icon) {
        const iconPath = path.join(__dirname, '../../uploads/mca/our_program', ourProgram.icon);
        fs.unlinkSync(iconPath);
      }
        await OurProgram.findByIdAndDelete(id);
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Our Program deleted successfully' }],
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  