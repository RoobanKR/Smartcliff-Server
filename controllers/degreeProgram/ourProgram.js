const OurProgram = require("../../models/degreeprogram/OurProgramModal");
const path = require("path");
const fs = require('fs');

exports.createOurProgram = async (req, res) => {
  try {
      const { title, description, service,business_service,college,degree_program } = req.body;



  const iconFile = req.files.icon;
   
           if (iconFile.size > 3 * 1024 * 1024) {
               return res.status(400).json({
                   message: [{ key: "error", value: "Image size exceeds the 3MB limit" }],
               });
           }
   
           const uniqueFileName = `${Date.now()}_${iconFile.name}`;
           const uploadPath = path.join(__dirname, "../../uploads/degreeprogram/ourprogram", uniqueFileName);
   
           await iconFile.mv(uploadPath);
   
      const newOurProgram = new OurProgram({
          title,
          description,
          icon: uniqueFileName,
          service,business_service,college,
          degree_program,
      });

      await newOurProgram.save();

      return res.status(201).json({ message: [{ key: "success", value: "Our Program added successfully" }] });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};



exports.getAllOurProgram = async (req, res) => {
    try {
      const ourPrograms = await OurProgram.find().populate("degree_program").populate('service').populate('business_service').populate('college');
  
      const allOutcomes = ourPrograms.map((out) => {
        const outcomesObj = out.toObject();
        return {
            ...outcomesObj,
            icon: process.env.BACKEND_URL + "/uploads/degreeprogram/ourprogram/" + outcomesObj.icon,
        };
    });


  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Our Program Retrieved successfully' }],
        our_Programs: allOutcomes,
      });
    } catch (error) {
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  
  exports.getOurProgramById = async (req, res) => {
    const { id } = req.params;
    try {
      const ourPrograms = await OurProgram.findById(id).populate("degree_program").populate('service').populate('business_service').populate('college');
      if (!ourPrograms) {
        return res.status(404).json({ message: [{ key: 'error', value: 'Our Program not found' }] });
      }
      return res.status(200).json({
        message: [{ key: 'success', value: 'Our Program Retrieved successfully' }],
        our_ProgramsById: {
          ...ourPrograms.toObject(),
          icon: process.env.BACKEND_URL + '/uploads/degreeprogram/ourprogram/' + ourPrograms.icon,
      },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  


  
  exports.updateOurProgram = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, degree_program } = req.body;
      const newIconFile = req.files?.icon;
  
      const ourProgram = await OurProgram.findById(id);
  
      if (!ourProgram) {
        return res.status(404).json({
          message: [{ key: "error", value: "Our Program not found" }],
        });
      }
  
    if (newIconFile) {
      const imagePathToDelete = path.join(
        __dirname,
        "../../uploads/degreeprogram/ourprogram",
        ourProgram.icon
      );

      // Delete the existing icon if it exists
      if (fs.existsSync(imagePathToDelete)) {
        fs.unlink(imagePathToDelete, (err) => {
          if (err) {
            console.error("Error deleting icon:", err);
          }
        });
      }

      const uniqueFileName = `${Date.now()}_${newIconFile.name}`;
      const uploadPath = path.join(__dirname, "../../uploads/degreeprogram/ourprogram", uniqueFileName);

      await newIconFile.mv(uploadPath);
      ourProgram.icon = uniqueFileName; 
    }
  
      ourProgram.title = title;
      ourProgram.description = description;
      ourProgram.service = service;
      ourProgram.business_service = business_service;
      ourProgram.college = college;

      ourProgram.degree_program = degree_program;
  
      await ourProgram.save();
  
      return res.status(200).json({
        message: [{ key: "success", value: "Our Program updated successfully" }],
        ourProgram,
      });
    } catch (error) {
      console.error("Error updating Our Program:", error);
      return res.status(500).json({
        message: [{ key: "error", value: "Internal server error" }],
      });
    }
  };

  exports.deleteOurProgram = async (req, res) => {
    const { id } = req.params;
  
    try {
      const ourProgram = await OurProgram.findById(id);
      if (!ourProgram) {
        return res.status(404).json({
          message: [{ key: 'error', value: 'Our Program not found' }],
        });
      }
  
      // If there's an icon, remove it from Supabase
             if (ourProgram.icon) {
                       const imagePath = path.join(__dirname, "../../uploads/degreeprogram/ourprogram", ourProgram.icon);
                       if (fs.existsSync(imagePath) && fs.lstatSync(imagePath).isFile()) {
                           fs.unlinkSync(imagePath);
                       }
                   }
  
      await OurProgram.findByIdAndDelete(id);
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Our Program deleted successfully' }],
      });
    } catch (error) {
      console.error("Error deleting Our Program:", error);
      return res.status(500).json({
        message: [{ key: 'error', value: 'Internal server error' }],
      });
    }
  };