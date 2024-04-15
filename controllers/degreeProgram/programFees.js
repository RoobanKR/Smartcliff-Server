const ProgramFees = require("../../models/degreeprogram/ProgramFessModal");
const path = require("path");
const fs = require('fs');

exports.createProgramFees = async (req, res) => {
    try {
        const { title, description,degree_program } = req.body;
        const existingProgramFees = await ProgramFees.findOne({ title });
        
        if (existingProgramFees) {
            return res.status(403).json({ message: [{ key: "error", value: "Program Fees Name already exists" }] });
        }

        if (!title || !description) {
            return res.status(400).json({ message: [{ key: "error", value: "Required fields" }] });
        }

        let iconFile = req.files.icon;

        if (!iconFile) {
            return res.status(400).json({ message: [{ key: "error", value: "Program Fees icon is required" }] });
        }

        if (iconFile.size > 5 * 1024 * 1024) {
            return res.status(400).json({ message: [{ key: "error", value: "Program Fees icon size exceeds the 3MB limit" }] });
        }

        const uniqueFileName = `${Date.now()}_${iconFile.name}`;
        const uploadPath = path.join(__dirname, "../../uploads/mca/program_fees", uniqueFileName);

        try {
            await iconFile.mv(uploadPath);

            const newProgramFees = new ProgramFees({
                title,
                description,
                icon: uniqueFileName,
                degree_program
            });

            await newProgramFees.save();

            return res.status(201).json({ message: [{ key: "Success", value: "Program Fees Added Successfully" }] });
        } catch (error) {
            return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
};


exports.getAllProgramFees = async (req, res) => {
    try {
      const programFees = await ProgramFees.find().populate("degree_program");
  
      const programFeess = programFees.map((program) => {
        return {
          ...program.toObject(),
          icon: program.icon ? process.env.BACKEND_URL + '/uploads/mca/program_fees/' + program.icon : null,
        };
      });
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Program Fees Retrieved successfully' }],
        program_feess: programFeess,
      });
    } catch (error) {
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  
  exports.getProgramFeesById = async (req, res) => {
    const { id } = req.params;
    try {
      const programFees = await ProgramFees.findById(id).populate("degree_program");
      if (!programFees) {
        return res.status(404).json({ message: [{ key: 'error', value: 'Program Fees not found' }] });
      }
      const iconURL = programFees.icon ? `${process.env.BACKEND_URL}/uploads/mca/program_fees/${programFees.icon}` : null;
      return res.status(200).json({
        message: [{ key: 'success', value: 'Program Fees Retrieved successfully' }],
        programFeesById: {
          ...programFees.toObject(),
          icon: iconURL,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  


  
  exports.updateProgramFees = async (req, res) => {
    try {
      const feesId = req.params.id;
      const updatedData = req.body;
      const iconFile = req.files ? req.files.icon : null;
  
      const existingProgramFees = await ProgramFees.findById(feesId);
  
      if (!existingProgramFees) {
        return res.status(404).json({
          message: [{ key: 'error', value: 'Program Fees not found' }]
        });
      }
  
      if (iconFile) {
        const iconPathToDelete = path.join(
          __dirname,
          '../../uploads/mca/program_fees',
          existingProgramFees.icon
        );
        if (fs.existsSync(iconPathToDelete)) {
          fs.unlink(iconPathToDelete, (err) => {
            if (err) {
              console.error('Error deleting icon:', err);
            }
          });
        }
  
        const uniqueFileName = `${Date.now()}_${iconFile.name}`;
        const uploadPath = path.join(
          __dirname,
          '../../uploads/mca/program_fees',
          uniqueFileName
        );
        await iconFile.mv(uploadPath);
        updatedData.icon = uniqueFileName;
      }
  
      const updatedProgramFees = await ProgramFees.findByIdAndUpdate(
        feesId,
        updatedData      );
  
      if (!updatedProgramFees) {
        return res.status(404).json({
          message: [{ key: 'error', value: 'Program Fees not found' }]
        });
      }
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Program Fees updated successfully' }]
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: [{ key: 'error', value: 'Internal server error' }]
      });
    }
  };

  exports.deleteProgramFees = async (req, res) => {
    const { id } = req.params;
  
    try {
      const programFees = await ProgramFees.findById(id);
      if (!programFees) {
        return res.status(404).json({ message: [{ key: 'error', value: 'Program Fees not found' }] });
      }
  
      if (programFees.icon) {
        const iconPath = path.join(__dirname, '../../uploads/mca/program_fees', programFees.icon);
        fs.unlinkSync(iconPath);
      }
        await ProgramFees.findByIdAndDelete(id);
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Program Fees deleted successfully' }],
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  