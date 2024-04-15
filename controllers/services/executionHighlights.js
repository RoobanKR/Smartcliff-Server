const ExecutionHighlights = require("../../models/services/ExecutionHighlightsModal");
const path = require("path");
const fs = require('fs');

exports.createExecutionHighlights = async (req, res) => {
    try {
        const { stack, count,service } = req.body;
        const existingExecutionHighlights = await ExecutionHighlights.findOne({ stack });

        if (existingExecutionHighlights) {
            return res.status(403).json({ message: [{ key: "error", value: "Execution Highlights Name already exists" }] });
        }

        if (!stack || !count) {
            return res.status(400).json({ message: [{ key: "error", value: "Required fields" }] });
        }

        const imageFile = req.files.image;

        if (!imageFile) {
            return res.status(400).json({ message: [{ key: "error", value: "Execution Highlights image is required" }] });
        }

        if (imageFile.size > 5 * 1024 * 1024) {
            return res.status(400).json({ message: [{ key: "error", value: "Execution Highlights image size exceeds the 3MB limit" }] });
        }

        const uniqueFileName = `${Date.now()}_${imageFile.name}`;
        const uploadPath = path.join(__dirname, "../../uploads/services/execution_highlights", uniqueFileName);

        await imageFile.mv(uploadPath);

        const newExecutionHighlights = new ExecutionHighlights({
            stack,
            count,
            image: uniqueFileName,
            service
        });

        await newExecutionHighlights.save();

        return res.status(201).json({ message: [{ key: "Success", value: "Execution Highlights Added Successfully" }] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
};


exports.getAllExecutionHighlights = async (req, res) => {
    try {
      const executionHighlight = await ExecutionHighlights.find().populate("service");
  
      const allExecutionHighlights = executionHighlight.map((highlights) => {
        return {
          ...highlights.toObject(),
          image: highlights.image ? process.env.BACKEND_URL + '/uploads/services/execution_highlights/' + highlights.image : null,
        };
      });
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Execution Highlights Retrieved successfully' }],
        getAllExecutionHighlight: allExecutionHighlights,
      });
    } catch (error) {
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };


  
  exports.getExecutionHighlightsById = async (req, res) => {
    const { id } = req.params;
    try {
      const executionHighlight = await ExecutionHighlights.findById(id).populate("service");
      if (!executionHighlight) {
        return res.status(404).json({ message: [{ key: 'error', value: 'Execution Highlights not found' }] });
      }
      const imageURL = executionHighlight.image ? `${process.env.BACKEND_URL}/uploads/services/execution_highlights/${executionHighlight.image}` : null;
      return res.status(200).json({
        message: [{ key: 'success', value: 'Execution Highlights Id based Retrieved successfully' }],
        serviceById: {
          ...executionHighlight.toObject(),
          image: imageURL,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  

  
  exports.updateExecutionHighlights = async (req, res) => {
    try {
        const highlightId = req.params.id;
        const updatedData = req.body;
        const imageFile = req.files ? req.files.image : null;

        const existingExecutionHighlights = await ExecutionHighlights.findById(highlightId);

        if (!existingExecutionHighlights) {
            return res.status(404).json({
                message: [{ key: 'error', value: 'Execution Highlights not found' }]
            });
        }

        // Check if the name is being updated and if it already exists in the database
        if (updatedData.stack && updatedData.stack !== existingExecutionHighlights.stack) {
            const stackExists = await ExecutionHighlights.exists({ stack: updatedData.stack });
            if (stackExists) {
                return res.status(400).json({
                    message: [{ key: 'error', value: 'Execution Highlights with this stack already exists' }]
                });
            }
        }

        if (imageFile) {
            const imagePathToDelete = path.join(
                __dirname,
                '../../uploads/services/execution_highlights',
                existingExecutionHighlights.image
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
                '../../uploads/services/execution_highlights',
                uniqueFileName
            );
            await imageFile.mv(uploadPath);
            updatedData.image = uniqueFileName;
        }

        const updatedExecutionHighlights = await ExecutionHighlights.findByIdAndUpdate(
            highlightId,
            updatedData,
        );

        if (!updatedExecutionHighlights) {
            return res.status(404).json({
                message: [{ key: 'error', value: 'Execution Highlights not found' }]
            });
        }

        return res.status(200).json({
            message: [{ key: 'success', value: 'Execution Highlights updated successfully' }]        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: [{ key: 'error', value: 'Internal server error' }]
        });
    }
};



exports.deleteExecutionHighlights = async (req, res) => {
    const { id } = req.params;
  
    try {
      const executionHighlight = await ExecutionHighlights.findById(id);
      if (!executionHighlight) {
        return res.status(404).json({ message: [{ key: 'error', value: 'Execution Highlights not found' }] });
      }
  
      if (executionHighlight.image) {
        const imagePath = path.join(__dirname, '../../uploads/services/execution_highlights', executionHighlight.image);
        fs.unlinkSync(imagePath);
      }
        await ExecutionHighlights.findByIdAndDelete(id);
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Execution Highlights deleted successfully' }],
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  