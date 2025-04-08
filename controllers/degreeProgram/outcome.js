const Outcome = require("../../models/degreeprogram/OutcomesModal");
const path = require("path");
const fs = require('fs');


exports.createOutcome = async (req, res) => {
  try {
      const { title, service, business_service, college, degree_program,company } = req.body;

      if (!title) {
          return res.status(400).json({ message: [{ key: "error", value: "Required fields" }] });
      }

      let uniqueFileName = null; // Initialize uniqueFileName as null

      // Check if an icon file is provided
      if (req.files && req.files.icon) {
          const iconFile = req.files.icon;

          if (iconFile.size > 3 * 1024 * 1024) {
              return res.status(400).json({
                  message: [{ key: "error", value: "Image size exceeds the 3MB limit" }],
              });
          }

          uniqueFileName = `${Date.now()}_${iconFile.name}`;
          const uploadPath = path.join(__dirname, "../../uploads/degreeprogram/outcomes", uniqueFileName);

          await iconFile.mv(uploadPath);
      }

      const newOutcome = new Outcome({
          title,
          icon: uniqueFileName, // This will be null if no icon was uploaded
          service,
          business_service,
          college,
          degree_program,
          company
      });

      await newOutcome.save();

      return res.status(201).json({ message: [{ key: "Success", value: "Outcome Added Successfully" }] });
  } catch (error) {
      console.error(error); // Log the error for debugging
      return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};
exports.getAllOutcome = async (req, res) => {
    try {
      const outcome = await Outcome.find().populate("degree_program").populate('service').populate('business_service').populate('college').populate('company');
  
      const allOutcomes = outcome.map((out) => {
        const outcomesObj = out.toObject();
        return {
            ...outcomesObj,
            icon: process.env.BACKEND_URL + "/uploads/degreeprogram/outcomes/" + outcomesObj.icon,
        };
    });

  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Outcome Retrieved successfully' }],
        AllOutcomes: allOutcomes,
      });
    } catch (error) {
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };


  exports.getOutcomeById = async (req, res) => {
    const { id } = req.params;
    try {
      const outcome = await Outcome.findById(id).populate("degree_program").populate('service').populate('business_service').populate('college').populate('company');
      if (!outcome) {
        return res.status(404).json({ message: [{ key: 'error', value: 'outcome not found' }] });
      }
      return res.status(200).json({
        message: [{ key: 'success', value: 'Outcome Retrieved successfully' }],
        outcomeById:{
          ...outcome.toObject(),
          icon: process.env.BACKEND_URL + '/uploads/degreeprogram/outcomes/' + outcome.icon,
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
                      if (!existingOutcome) {
                        return res
                          .status(404)
                          .json({ message: { key: "error", value: "cliet not found" } });
                      }
   
                      const imagePathToDelete = path.join(
                        __dirname,
                        "../../uploads/degreeprogram/outcomes",
                        existingOutcome.icon
                      );
                      if (fs.existsSync(imagePathToDelete)) {
                        fs.unlink(imagePathToDelete, (err) => {
                          if (err) {
                            console.error("Error deleting icon:", err);
                          }
                        });
                      }
                
                      const uniqueFileName = `${Date.now()}_${iconFile.name}`;
                      const uploadPath = path.join(
                        __dirname,
                        "../../uploads/degreeprogram/outcomes",
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
                       const imagePath = path.join(__dirname, "../../uploads/degreeprogram/outcomes", outcome.icon);
                       if (fs.existsSync(imagePath) && fs.lstatSync(imagePath).isFile()) {
                           fs.unlinkSync(imagePath);
                       }
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
  