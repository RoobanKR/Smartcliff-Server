 const mongoose = require("mongoose");

const visionMissionSchema = new mongoose.Schema({
    type: { type: String, enum: ['vision', 'mission'] },
  description: { type: String, required: true },
  image: { type: String, required: true },
createdBy: { type: String},
createdOn: { type: Date, default: Date.now },
updatedBy: { type: String},
updatedOn: { type: Date, default: Date.now },

});

module.exports = mongoose.model("vison-mission", visionMissionSchema);
