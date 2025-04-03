const mongoose = require('mongoose');

const executionOverviewSchema = new mongoose.Schema({
 
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    sections: [{
        title: {
            type: String,
            required: true
        },
        count: {
            type: Number,
            required: true
        }
    }],
  

    service: { type: mongoose.Schema.Types.ObjectId, ref: "Services",required: true},
  business_service: { type: mongoose.Schema.Types.ObjectId, ref: 'business_service', required: true }, 

});

module.exports = mongoose.model('ExecutionOverview', executionOverviewSchema);

