const mongoose = require("mongoose");


const moduleSchema = new mongoose.Schema({
  title: String,
  sub_title: [
    {
      heading: String,
      duration: Number
    }
  ]
});

const courseModulesSchema = new mongoose.Schema({
  modules: [moduleSchema],
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course",required: true},

})


module.exports = mongoose.model("CourseModules", courseModulesSchema);
