const mongoose = require('mongoose');


const ServiceSchema = new mongoose.Schema({
  businessService: {
    type: String,
  },
  service: {
    type: [String],
  }
});

const YearlyServiceSchema =new mongoose.Schema({
  year: {
    type: String,
    required: true
  },
  services: [ServiceSchema]
});

module.exports = mongoose.model('Yearly-Services', YearlyServiceSchema);
