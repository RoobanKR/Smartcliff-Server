const mongoose = require('mongoose');

const managedCampusSchema = new mongoose.Schema({
sub_title: { type: String, required: true },

  service: { type: mongoose.Schema.Types.ObjectId, ref: "Services",required: true},
  execution_highlights: [{ type: mongoose.Schema.Types.ObjectId, ref: "Execution_Highlights",required: true}],
  execution_overview: [{ type: mongoose.Schema.Types.ObjectId, ref: "ExecutionOverview",required: true}],
  our_client: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company_Logo",required: true}],
  gallery: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service_Gallery",required: true}],
  service_testimonial: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service_Testimonial",required: true}],

//   lastModifiedBy: { type: String, required: true },
//   lastModifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Managed_Campus', managedCampusSchema);
