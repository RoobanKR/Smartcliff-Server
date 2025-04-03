const HomeExecutionHighlights = require("../../models/home/HomeExectionHighlightsModal");
const path = require("path");
const fs = require('fs');

exports.createHomeExecutionHighlights = async (req, res) => {
  try {
    const { stack, count } = req.body;

    if (!stack || !count) {
      return res.status(400).json({
        message: [{ key: "error", value: "Required fields: stack and count are missing" }],
      });
    }


        if (!req.files || !req.files.image) {
            return res.status(400).json({
                message: [{ key: "error", value: "Image is required" }],
            });
        }

        const imageFile = req.files.image;

        if (imageFile.size > 3 * 1024 * 1024) {
            return res.status(400).json({
                message: [{ key: "error", value: "Image size exceeds the 3MB limit" }],
            });
        }

        const uniqueFileName = `${Date.now()}_${imageFile.name}`;
        const uploadPath = path.join(__dirname, "../../uploads/home/highlights", uniqueFileName);

        await imageFile.mv(uploadPath);

    const newHomeExecutionHighlights = new HomeExecutionHighlights({
      stack,
      count,
      image: uniqueFileName,
    });

    await newHomeExecutionHighlights.save();

    return res.status(201).json({
      message: [{ key: "success", value: "Home Execution Highlights Added Successfully" }],
    });
  } catch (error) {
    console.error("Outer try block error:", error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};



exports.getAllHomeExecutionHighlights = async (req, res) => {
    try {
      const executionHighlight = await HomeExecutionHighlights.find();
  
      const allHomeExecutionHighlight = executionHighlight.map((executionHighlights) => {
        const serviceObj = executionHighlights.toObject();
        return {
            ...serviceObj,
            image: process.env.BACKEND_URL + "/uploads/home/highlights/" + serviceObj.image,
        };
    });
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Home Execution Highlights Retrieved successfully' }],
        getAllHomeExecutionHighlight: allHomeExecutionHighlight,
      });
    } catch (error) {
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };


    exports.getHomeExecutionHighlightsById = async (req, res) => {
      const { id } = req.params;
      try {
        const homeExecutionHighlight = await HomeExecutionHighlights.findById(id);
        if (!homeExecutionHighlight) {
          return res.status(404).json({ message: [{ key: 'error', value: 'Home Execution Highlights not found' }] });
        }
        return res.status(200).json({
          message: [{ key: 'success', value: 'Home Execution Highlights Id based Retrieved successfully' }],
          homeExecutionHighlightById: {
            ...homeExecutionHighlight.toObject(),
            image: process.env.BACKEND_URL + '/uploads/home/highlights/' + homeExecutionHighlight.image,
        },
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
      }
    };
  

    exports.updateHomeExecutionHighlights = async (req, res) => {
        try {
            const highlightId = req.params.id;
            const updatedData = req.body;
            const imageFile = req.files ? req.files.image : null;
    
            const existingExecutionHighlights = await HomeExecutionHighlights.findById(highlightId);
    
            if (!existingExecutionHighlights) {
                return res.status(404).json({
                    message: [{ key: 'error', value: 'Execution Highlights not found' }]
                });
            }
    
            if (updatedData.stack && updatedData.stack !== existingExecutionHighlights.stack) {
                const stackExists = await HomeExecutionHighlights.exists({ stack: updatedData.stack });
                if (stackExists) {
                    return res.status(400).json({
                        message: [{ key: 'error', value: 'Home Execution Highlights with this stack already exists' }]
                    });
                }
            }
    
             if (imageFile) {
                       if (!existingExecutionHighlights) {
                         return res
                           .status(404)
                           .json({ message: { key: "error", value: "highlights not found" } });
                       }
    
                       const imagePathToDelete = path.join(
                         __dirname,
                         "../../uploads/home/highlights",
                         existingExecutionHighlights.image
                       );
                       if (fs.existsSync(imagePathToDelete)) {
                         fs.unlink(imagePathToDelete, (err) => {
                           if (err) {
                             console.error("Error deleting image:", err);
                           }
                         });
                       }
                 
                       const uniqueFileName = `${Date.now()}_${imageFile.name}`;
                       const uploadPath = path.join(
                         __dirname,
                         "../../uploads/home/highlights",
                         uniqueFileName
                       );
                       await imageFile.mv(uploadPath);
                       updatedData.image = uniqueFileName;
                     }
    
            const updatedExecutionHighlights = await HomeExecutionHighlights.findByIdAndUpdate(
                highlightId,
                updatedData,
            );
    
            if (!updatedExecutionHighlights) {
                return res.status(404).json({
                    message: [{ key: 'error', value: 'HomeExecution Highlights not found' }]
                });
            }
    
            return res.status(200).json({
                message: [{ key: 'success', value: 'Home Execution Highlights updated successfully' }]        });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: [{ key: 'error', value: 'Internal server error' }]
            });
        }
    };
    

    exports.deleteHomeExecutionHighlights = async (req, res) => {
        const { id } = req.params;
      
        try {
          const executionHighlight = await HomeExecutionHighlights.findById(id);
          if (!executionHighlight) {
            return res.status(404).json({ message: [{ key: 'error', value: 'Execution Highlights not found' }] });
          }
      
           if (executionHighlight.image) {
                     const imagePath = path.join(__dirname, "../../uploads/home/highlights", executionHighlight.image);
                     if (fs.existsSync(imagePath) && fs.lstatSync(imagePath).isFile()) {
                         fs.unlinkSync(imagePath);
                     }
                 }
         
            await HomeExecutionHighlights.findByIdAndDelete(id);
      
          return res.status(200).json({
            message: [{ key: 'success', value: 'Execution Highlights deleted successfully' }],
          });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
        }
      };
      