const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
    heading: { type: String, required: true },
  });
const admissionProcessSchema = new mongoose.Schema({
    admission: {
        type: [admissionSchema],
        required: true
      }, 
      degree_program: { type: mongoose.Schema.Types.ObjectId, ref: "Degree_Program",required: true},

//   lastModifiedBy: { type: String, required: true },
//   lastModifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Admission', admissionProcessSchema);
