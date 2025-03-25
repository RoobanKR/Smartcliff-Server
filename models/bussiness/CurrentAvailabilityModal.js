const mongoose = require('mongoose');

const currentAvailabilitySchema = new mongoose.Schema({
    skillset: { type: String, required: true },
    resources: { type: String, required: true },
    duration: {type: String,required:true},
    batch: { type: String,required:true},
    experience: {type: String,required:true},
    remarks: {type: String,required:true},

//   lastModifiedBy: { type: String, required: true },
//   lastModifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Current-Availability', currentAvailabilitySchema);
