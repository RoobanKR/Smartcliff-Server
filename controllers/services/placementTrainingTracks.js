const PlacementTrainingTrack = require('../../models/services/placementTrainingTracksModal');

exports.createPlacementTrainingTrack = async (req, res) => {
  try {
    const {
      trackName,
      proposedHour,
      noOfDays,
      targetSemester,
      objecttive,
      trainingModuleLevels,
      business_service,
      service
    } = req.body;

    // Create a new training track
    const newTrainingTrack = new PlacementTrainingTrack({
      trackName,
      proposedHour,
      noOfDays,
      targetSemester,
      objecttive,
      trainingModuleLevels,
      business_service,
      service,
      createdBy: req.user ? req.user.id : 'system',
      createdAt: new Date()
    });

    // Save the training track
    const savedTrack = await newTrainingTrack.save();
    
    res.status(201).json({
      success: true,
      message: 'Training track created successfully',
      data: savedTrack
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create training track',
      error: error.message
    });
  }
};



exports.getAllPlacementTrainingTrack = async (req, res) => {
  try {
    const placementtrainingtrack = await PlacementTrainingTrack.find().populate('business_service').populate('service');;
    return res
      .status(201)
      .json({
        message: [
          { key: "Success", value: "Placement Training Track Get All Successfully" },
        ],
        getAllPlacementtrainingtrack: placementtrainingtrack,
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};


exports.getPlacementTrainingTrackById = async (req, res) => {
    try {
        const { id } = req.params;

        const placementtrainingtrackById = await PlacementTrainingTrack.findById(id).populate('business_service').populate('service');;

        if (!placementtrainingtrackById) {
            return res.status(404).json({ message: [{ key: 'error', value: 'Placement Training Track Id not found' }] });
        }

        return res.status(200).json({
            message: [{ key: 'success', value: 'placement training track Id based Retrieved successfully' }],
            placementtrainingtrackById: placementtrainingtrackById
          });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
};


exports.updatePlacementTrainingTrack = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
  
      updateData.updatedAt = new Date(); // Update timestamp
  
      const updatedTrack = await PlacementTrainingTrack.findByIdAndUpdate(id, updateData);
  
      if (!updatedTrack) {
        return res.status(404).json({
          success: false,
          message: "Training track not found"
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Training track updated successfully",
        data: updatedTrack
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update training track",
        error: error.message
      });
    }
  };

  
  exports.deletePlacementTrainingTrack = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedTrack = await PlacementTrainingTrack.findByIdAndDelete(id);
  
      if (!deletedTrack) {
        return res.status(404).json({
          success: false,
          message: "Training track not found"
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Training track deleted successfully"
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete training track",
        error: error.message
      });
    }
  };
  