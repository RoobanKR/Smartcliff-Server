const mongoose = require('mongoose');


const assesmentSchema = new mongoose.Schema({
    subtitle: { type: String, },
    icon: { type: String, },
    objective:{type:String}
});

const eligibilitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    assesment: {
        type: [assesmentSchema],
        required: true
    },
});

const eligibilityCriteriaSchema = new mongoose.Schema({
    description: { type: String },
    eligibility: {
        type: [eligibilitySchema],
        required: true
    },

    degree_program: { type: mongoose.Schema.Types.ObjectId, ref: "Degree_Program", required: true },


//   lastModifiedBy: { type: String, required: true },
//   lastModifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Eligibility_Criteria', eligibilityCriteriaSchema);
