const Outcome = require("../../models/degreeprogram/OutcomesModal");
const path = require("path");
const fs = require('fs');

exports.createOutcome = async (req, res) => {
    try {
        const { title,degree_program } = req.body;
        const existingOutcome = await Outcome.findOne({ title });
        
        if (existingOutcome) {
            return res.status(403).json({ message: [{ key: "error", value: "Outcome Name already exists" }] });
        }

        if (!title) {
            return res.status(400).json({ message: [{ key: "error", value: "Required fields" }] });
        }

        let iconFile = req.files.icon;

        if (!iconFile) {
            return res.status(400).json({ message: [{ key: "error", value: "Outcome icon is required" }] });
        }

        if (iconFile.size > 5 * 1024 * 1024) {
            return res.status(400).json({ message: [{ key: "error", value: "Outcome icon size exceeds the 3MB limit" }] });
        }

        const uniqueFileName = `${Date.now()}_${iconFile.name}`;
        const uploadPath = path.join(__dirname, "../../uploads/mca/outcome", uniqueFileName);

        try {
            await iconFile.mv(uploadPath);

            const newOutcome = new Outcome({
                title,
                icon: uniqueFileName,
                degree_program
            });

            await newOutcome.save();

            return res.status(201).json({ message: [{ key: "Success", value: "Outcome Added Successfully" }] });
        } catch (error) {
            return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
};

exports.getAllOutcome = async (req, res) => {
    try {
      const outcome = await Outcome.find().populate("degree_program");
  
      const outcomes = outcome.map((out) => {
        return {
          ...out.toObject(),
          icon: out.icon ? process.env.BACKEND_URL + '/uploads/mca/outcome/' + out.icon : null,
        };
      });
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Outcome Retrieved successfully' }],
        AllOutcomes: outcomes,
      });
    } catch (error) {
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };


  exports.getOutcomeById = async (req, res) => {
    const { id } = req.params;
    try {
      const outcome = await Outcome.findById(id).populate("degree_program");
      if (!outcome) {
        return res.status(404).json({ message: [{ key: 'error', value: 'outcome not found' }] });
      }
      const iconURL = outcome.icon ? `${process.env.BACKEND_URL}/uploads/mca/outcome/${outcome.icon}` : null;
      return res.status(200).json({
        message: [{ key: 'success', value: 'Outcome Retrieved successfully' }],
        outcomeById: {
          ...outcome.toObject(),
          icon: iconURL,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  
  
  exports.updateOutcome = async (req, res) => {
    try {
      const outcomeId = req.params.id;
      const updatedData = req.body;
      const iconFile = req.files ? req.files.icon : null;
  
      const existingOutcome = await Outcome.findById(outcomeId);
  
      if (!existingOutcome) {
        return res.status(404).json({
          message: [{ key: 'error', value: 'Outcome not found' }]
        });
      }
  
      if (iconFile) {
        const iconPathToDelete = path.join(
          __dirname,
          '../../uploads/mca/outcome',
          existingOutcome.icon
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
          '../../uploads/mca/outcome',
          uniqueFileName
        );
        await iconFile.mv(uploadPath);
        updatedData.icon = uniqueFileName;
      }
  
      const updatedOutcome = await Outcome.findByIdAndUpdate(
        outcomeId,
        updatedData      );
  
      if (!updatedOutcome) {
        return res.status(404).json({
          message: [{ key: 'error', value: 'Outcome not found' }]
        });
      }
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Outcome updated successfully' }]
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: [{ key: 'error', value: 'Internal server error' }]
      });
    }
  };

  exports.deleteOutcome = async (req, res) => {
    const { id } = req.params;
  
    try {
      const outcome = await Outcome.findById(id);
      if (!outcome) {
        return res.status(404).json({ message: [{ key: 'error', value: 'Outcome not found' }] });
      }
  
      if (outcome.icon) {
        const iconPath = path.join(__dirname, '../../uploads/mca/outcome', outcome.icon);
        fs.unlinkSync(iconPath);
      }
        await Outcome.findByIdAndDelete(id);
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Outcome deleted successfully' }],
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  