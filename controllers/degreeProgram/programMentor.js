const ProgramMentor = require("../../models/degreeprogram/ProgramMentorModal");
const path = require("path");
const fs = require("fs");

exports.createProgramMentor = async (req, res) => {
  try {
    const {
      name,
      designation,
      degree_program
     
    } = req.body;

    if (
      !name ||
      !designation
    ) {
      return res
        .status(400)
        .json({ message: [{ key: "error", value: "Required fields" }] });
    }

    let imageFile = req.files.image;

    if (!imageFile) {
      return res
        .status(400)
        .json({
          message: [
            {
              key: "error",
              value: "Program Mentor image is required",
            },
          ],
        });
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      return res
        .status(400)
        .json({
          message: [
            {
              key: "error",
              value:
                "Program Mentor image size exceeds the 5MB limit",
            },
          ],
        });
    }

    const uniqueFileName = `${Date.now()}_${imageFile.name}`;
    const uploadPath = path.join(
      __dirname,
      "../../uploads/mca/program_mentor",
      uniqueFileName
    );

    try {
      await imageFile.mv(uploadPath);

      const newProgramMentor = new ProgramMentor({
        name,
        designation,
        image: uniqueFileName,
        degree_program

      });

      await newProgramMentor.save();

      return res
        .status(201)
        .json({
          message: [
            {
              key: "Success",
              value: "Program Mentor Added Successfully",
            },
          ],
          Program_Mentor:newProgramMentor
        });
    } catch (error) {
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

exports.getAllProgramMentor = async (req, res) => {
    try {
      const programMentor = await ProgramMentor.find().populate("degree_program");
  
      const programMentorWithImage = programMentor.map((mentor) => {
        return {
          ...mentor.toObject(),
          image: mentor.image ? process.env.BACKEND_URL + '/uploads/mca/program_mentor/' + mentor.image : null,
        };
      });
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Program Mentor Retrieved successfully' }],
        programMentor: programMentorWithImage,
      });
    } catch (error) {
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };

  exports.getProgramMentorById = async (req, res) => {
    const { id } = req.params;
    try {
      const programMentor = await ProgramMentor.findById(id).populate("degree_program");
      if (!programMentor) {
        return res.status(404).json({ message: [{ key: 'error', value: 'Program Mentor not found' }] });
      }
      
      const programMentorimage = programMentor.image ? `${process.env.BACKEND_URL}/uploads/mca/program_mentor/${programMentor.image}` : null;
      return res.status(200).json({
        message: [{ key: 'success', value: 'Program Mentor Retrieved successfully' }],
        programMentorById: {
          ...programMentor.toObject(),
          image: programMentorimage,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  

  exports.updateProgramMentor = async (req, res) => {
    try {
      const mentorId = req.params.id;
      const updatedData = req.body;
      const imageFile = req.files ? req.files.image : null;
  
      const existingProgramMentor = await ProgramMentor.findById(mentorId);
  
      if (!existingProgramMentor) {
        return res.status(404).json({
          message: [{ key: 'error', value: 'Program Mentor not found' }]
        });
      }
  
      if (imageFile) {
        const imagePathToDelete = path.join(
          __dirname,
          '../../uploads/mca/program_mentor',
          existingProgramMentor.image
        );
        if (fs.existsSync(imagePathToDelete)) {
          fs.unlink(imagePathToDelete, (err) => {
            if (err) {
              console.error('Error deleting image:', err);
            }
          });
        }
  
        const uniqueFileName = `${Date.now()}_${imageFile.name}`;
        const uploadPath = path.join(
          __dirname,
          '../../uploads/mca/program_mentor',
          uniqueFileName
        );
        await imageFile.mv(uploadPath);
        updatedData.image = uniqueFileName;
      }
  
      const updatedProgramMentor = await ProgramMentor.findByIdAndUpdate(
        mentorId,
        updatedData      );
  
      if (!updatedProgramMentor) {
        return res.status(404).json({
          message: [{ key: 'error', value: 'Program Mentor not found' }]
        });
      }
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Program Mentor updated successfully' }]
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: [{ key: 'error', value: 'Internal server error' }]
      });
    }
  };

  exports.deleteProgramMentor = async (req, res) => {
    const { id } = req.params;
  
    try {
      const programMentor = await ProgramMentor.findById(id);
      if (!programMentor) {
        return res.status(404).json({ message: [{ key: 'error', value: 'Program Mentor not found' }] });
      }
  
      if (programMentor.image) {
        const imagePath = path.join(__dirname, '../../uploads/mca/program_mentor', programMentor.image);
        fs.unlinkSync(imagePath);
      }
        await ProgramMentor.findByIdAndDelete(id);
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Program Mentor deleted successfully' }],
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  