const mongoose = require('mongoose');

const executionOverviewSchema = new mongoose.Schema({
    type: [{
        type: String,
        enum: ['Clientname', 'Institution Name', 'Industry Partner', 'College Name'],
        required: true
    }],
    typeName: [String], // Array of type names
    batchName: {
        type: String,
        required: true
    },
    stack: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Execution_Highlights', // Assuming ExecutionHighlights is another model
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['completed', 'in-progress'],
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Services",required: true},

});

module.exports = mongoose.model('ExecutionOverview', executionOverviewSchema);

