const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
    required: false,
  },
  visitDate: {
    type: Date,
    default: Date.now,
  },
  page: {
    type: String,
    required: false,
  },
});

// Create indexes for better query performance
visitorSchema.index({ ip: 1 });
visitorSchema.index({ visitDate: 1 });

const Visitor = mongoose.model('Visitor', visitorSchema);

module.exports = Visitor;