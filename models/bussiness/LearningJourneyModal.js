const mongoose = require('mongoose');

const learningJourneySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: {type: String,required:true,max: 5 * 1024 * 1024},
  type: { type: String, enum: ["hirefromus", "trainfromus", "institute"] },

//   lastModifiedBy: { type: String, required: true },
//   lastModifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('LearningJourney', learningJourneySchema);
