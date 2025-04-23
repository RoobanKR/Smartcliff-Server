const mongoose = require('mongoose')


const popupNotificationSchema = new mongoose.Schema({

  title: { type: String, required: true },
  description: {type: String,required: true},
  link: {type: String,},
  image: {type: String,max: 5 * 1024 * 1024},
  isOpen: { type: Boolean,default:false },

  createdBy: { type: String },
  createdAt: { type: Date, required: true },

})

module.exports = mongoose.model("popup-notification", popupNotificationSchema);

