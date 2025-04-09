const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
    modulename: {
      type: String,
      required: true,
      trim: true
    },
    TrainingComponentInHours: {
      type: Number,
      required: true
    },
    TrainingComponentInDays: {
      type: Number,
      required: true
    }
  });
  
  const summarySchema = new mongoose.Schema({
    moduleLevel: {
      type: String,
      required: true,
      trim: true
    },
    TrainingInHours: {
      type: Number,
      required: true
    },
    TrainingInDays: {
      type: Number,
      required: true
    },
    remarks: {
      type: String,
      required: true
    }
  });

  
  const TrainingModuleSchema = new mongoose.Schema({
    modules: [ModuleSchema]
  });
  
  const placementTrainingTrackSchema = new mongoose.Schema({
    trackName: {
      type: String,
      required: true,
      trim: true
    },
    proposedHour: {
      type: Number,
      required: true
    },
    noOfDays: {
      type: Number,
      required: true
    },
    targetSemester: {
      type: [String],
      required: true
    },
    objecttive: {
      type: String,
      required: true
    },
    trainingModuleLevels: [TrainingModuleSchema],
    trainingModuleSummary: [summarySchema],

      business_service: { type: mongoose.Schema.Types.ObjectId, ref: 'business_service', required: true }, 
      service: { type: mongoose.Schema.Types.ObjectId, ref: "Services"},
    
    createdBy: {
      type: String,
      required: true,
      default: 'system'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  });
module.exports = mongoose.model("placement-training-track", placementTrainingTrackSchema);
