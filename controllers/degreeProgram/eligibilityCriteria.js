const EligibilityCriteria = require('../../models/degreeprogram/EligibiityCriteriaModal');
const mongoose = require('mongoose');

exports.createEligibilityCriteria = async (req, res) => {
    try {
        const { description, eligibility,degree_program } = req.body;

        const newEligibilityCriteria = new EligibilityCriteria({
            description,
            eligibility,
            degree_program,
        });

        await newEligibilityCriteria.save();

       return res.status(201).json({ message: [{ key: "Success", value: "Eligibility criteria added successfully" }] });
    } catch (error) {
        console.error(error);
      return  res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
};


exports.getAllEligibilityCriteria = async (req, res) => {
    try {
      const eligibilityCriteriaList = await EligibilityCriteria.find().populate("degree_program");
      return  res.status(200).json({ message: [{ key: "Success", value: "Eligibility getted successfully" }],
      allEligibilityCriteria:eligibilityCriteriaList
    });
    } catch (error) {
      console.error(error);
      return  res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
  };
  
  exports.getEligibilityCriteriaById = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
  
      const eligibilityCriteria = await EligibilityCriteria.findById(id).populate("degree_program");
  
      if (!eligibilityCriteria) {
        return res.status(404).json({ message: "Eligibility criteria not found" });
      }
  
      return  res.status(200).json({ message: [{ key: "Success", value: "Eligibility getById successfully" }],
      eligibilityCriteriaById:eligibilityCriteria
    });    } catch (error) {
      console.error(error);
      return  res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
  };


  exports.updateEligibilityCriteria = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, eligibility,degree_program } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const updatedEligibilityCriteria = await EligibilityCriteria.findByIdAndUpdate(
            id,
            { description, eligibility,degree_program },
            { new: true }
        );

        if (!updatedEligibilityCriteria) {
            return res.status(404).json({ message: "Eligibility criteria not found" });
        }

        res.status(200).json({ message: "Eligibility criteria updated successfully", updatedData: updatedEligibilityCriteria });
    } catch (error) {
        console.error(error);
        return  res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
};

exports.deleteEligibilityCriteria = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const deletedEligibilityCriteria = await EligibilityCriteria.findByIdAndDelete(id);

        if (!deletedEligibilityCriteria) {
            return res.status(404).json({ message: "Eligibility criteria not found" });
        }

        res.status(200).json({ message: "Eligibility criteria deleted successfully", deletedData: deletedEligibilityCriteria });
    } catch (error) {
        console.error(error);
        return  res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
};