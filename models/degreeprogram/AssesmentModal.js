const mongoose = require('mongoose');

const mainSchema = new mongoose.Schema({
  
icon: { type: String },
title: { type: String},
description: { type: String},
});

const roundSchema = new mongoose.Schema({
    heading: { type: String, required: true },
  subHeading: { type: String, required: true },
  submain: [mainSchema]
  });
const assesmentSchema = new mongoose.Schema({
    assesment: {
        type: [roundSchema],
        required: true
      }, 
      degree_program: { type: mongoose.Schema.Types.ObjectId, ref: "Degree_Program",required: true},

//   lastModifiedBy: { type: String, required: true },
//   lastModifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Assesment', assesmentSchema);
