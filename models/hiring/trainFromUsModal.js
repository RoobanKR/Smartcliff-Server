const mongoose = require("mongoose");



const skillSchema = new mongoose.Schema({
  skillset: { type: String, required: true },
  resources: { type: String, required: true },
});

const trainFromUsSchema = new mongoose.Schema({
 
  company_name: {
    type: String,
    required: true,
  },
   
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  
 
  trainee_modal: {
    type: String,
  },
  skills: { type: [skillSchema] },

});

module.exports = mongoose.model("Train_From_Us", trainFromUsSchema);
