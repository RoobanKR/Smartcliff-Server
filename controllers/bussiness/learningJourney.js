const LearningJourney = require("../../models/bussiness/LearningJourneyModal");
const path = require("path")
const fs = require('fs');

exports.createLearningJourney = async (req, res) => {
  try {
    const {type, title, description } = req.body;

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
               const uploadPath = path.join(__dirname, "../../uploads/business/learningjourney", uniqueFileName);
       
        await imageFile.mv(uploadPath);
    

    const newLearningJourney = new LearningJourney({
      type,
      title,
      description,
      image:uniqueFileName,
      createdBy:req?.user?.email || "roobankr5@gmail.com",
    });

    await newLearningJourney.save();

    return res
      .status(201)
      .json({
        message: [
          { key: "Success", value: "Learning Journey added successfully" },
        ],
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};



exports.getAllLearningJourney = async (req, res) => {
    try {
      const learningjourney = await LearningJourney.find();
  
      const AlLearningjourney = learningjourney.map((journey) => {
        const ourSponsorsobj = journey.toObject();
        return {
            ...ourSponsorsobj,
            image: process.env.BACKEND_URL + "/uploads/business/learningjourney/" + ourSponsorsobj.image,
        };
    });

  
      return res.status(200).json({
        message: [{ key: 'success', value: 'learnig Journey Retrieved successfully' }],
        learningjourney: AlLearningjourney,
      });
    } catch (error) {
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };


  exports.getLearningJourneyById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const learningjourney = await LearningJourney.findById(id);
  
      if (!learningjourney) {
        return res
          .status(404)
          .json({ message: [{ key: "error", value: "Learning Journey not found" }] });
      }
  
      return res.status(200).json({
        message: [
          { key: "success", value: "learning journey based Retrieved successfully" },
        ],
        learningJourneyById: {
          ...learningjourney.toObject(),
          image:
            process.env.BACKEND_URL + "/uploads/business/learningjourney/" + learningjourney.image,
        },
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: [{ key: "error", value: "Internal server error" }] });
    }
  };
  


  exports.updateLearningJourneyById = async (req, res) => {
    try {
      const learningJourneyId = req.params.id;
      const updatedData = req.body;
      const imageFile = req.files ? req.files.image : null;
  
      const existingLearningJourney = await LearningJourney.findById(learningJourneyId);
  
      if (!existingLearningJourney) {
        return res.status(404).json({
          message: [{ key: "error", value: "Learning Journey not found" }],
        });
      }
  
      if (imageFile) {
        // Delete the old image
        const imagePathToDelete = path.join(
          __dirname,
          "../../uploads/business/learningjourney",
          existingLearningJourney.image
        );
        if (fs.existsSync(imagePathToDelete)) {
          fs.unlink(imagePathToDelete, (err) => {
            if (err) {
              console.error("Error deleting image:", err);
            }
          });
        }
  
        // Upload the new image
        const uniqueFileName = `${Date.now()}_${imageFile.name}`;
        const uploadPath = path.join(
          __dirname,
          "../../uploads/business/learningjourney",
          uniqueFileName
        );
        await imageFile.mv(uploadPath);
        updatedData.image = uniqueFileName;
      }
  
      const updatedLearningJourney = await LearningJourney.findByIdAndUpdate(
        learningJourneyId,
        updatedData,
        { new: true } // Return the updated document
      );
  
      if (!updatedLearningJourney) {
        return res.status(404).json({
          message: [{ key: "error", value: "Learning Journey not found" }],
        });
      }
  
      return res.status(200).json({
        message: [{ key: "success", value: "Learning Journey updated successfully" }],
        updatedLearningJourney: updatedLearningJourney,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: [{ key: "error", value: "Internal server error" }],
      });
    }
  };



  exports.deleteLearningJourneyById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedLearningJourney = await LearningJourney.findByIdAndRemove(id);
  
      if (!deletedLearningJourney) {
        return res.status(404).json({
          message: [{ key: "error", value: "Learning Journey not found" }],
        });
      }
  
      // Delete the associated image file
      if (deletedLearningJourney.image) {
        const imagePath = path.join(
          __dirname,
          "../../uploads/business/learningjourney",
          deletedLearningJourney.image
        );
        if (fs.existsSync(imagePath) && fs.lstatSync(imagePath).isFile()) {
          fs.unlinkSync(imagePath);
        }
      }
  
      return res.status(200).json({
        message: [{ key: "success", value: "Learning Journey deleted successfully" }],
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: [{ key: "error", value: "Internal server error" }],
      });
    }
  };