const Faq = require("../models/faqModal");
 
exports.createFaq = async (req, res) => {
  try {
    const { faqItems, course, category, degree_program,service } = req.body;
 
    if (!faqItems || !Array.isArray(faqItems) || faqItems.length === 0) {
      return res
        .status(400)
        .json({ message: [{ key: "error", value: "FAQ items are required" }] });
    }
 
    // Validate each FAQ item
    const isValidFaqItems = faqItems.every((item) => {
      return item.question && item.answer;
    });
 
    if (!isValidFaqItems) {
      return res
        .status(400)
        .json({ message: [{ key: "error", value: "Invalid FAQ items" }] });
    }
 
    // Create a FaqGroup object
    const newFaq = new Faq({
      faqItems,
      course,
      category_name: category ? "non-common" : "common",
      degree_program,
      service
    });
 
    // Save the FaqGroup object
    await newFaq.save();
 
    return res.status(201).json({
      message: [{ key: "Success", value: "FAQs Added Successfully" }],
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};
 
exports.getAllFaq = async (req, res) => {
  try {
    const allFaq = await Faq.find().populate("course");
    res.status(200).json({
      message: [{ key: "success", value: "FAQ section get All data" }],
      FAQ: allFaq,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};
 
exports.getFaqById = async (req, res) => {
  const { id } = req.params;
 
  try {
    const FAQ = await Faq.findById(id);
    if (!FAQ) {
      return res
        .status(404)
        .json({ message: [{ key: "error", value: "FAQ section not found" }] });
    }
 
    res.status(200).json({
      message: [
        { key: "success", value: "FAQ  section Id based get the data" },
      ],
      FaqById: FAQ,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};
 
exports.updateFaq = async (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;
 
  try {
    const updatedFaq = await Faq.findByIdAndUpdate(id, {
      question,
      answer,
      lastModifiedBy: req.user.email,
      lastModifiedOn: new Date(),
    });
 
    if (!updatedFaq) {
      return res
        .status(404)
        .json({ message: [{ key: "error", value: "FAQ section not found" }] });
    }
 
    return res.status(200).json({
      message: [{ key: "success", value: "FAQ section Update Successfully" }],
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};
 
exports.deleteFaq = async (req, res) => {
  try {
    const faqId = req.params.id;
 
    const faq = await Faq.findById(faqId);
 
    if (!faq) {
      return res
        .status(404)
        .json({ message: { key: "error", value: "Faq not found" } });
    }
 
    const result = await Faq.deleteOne({ _id: faqId });
    if (result.deletedCount === 1) {
      return res.status(200).json({
        message: [
          {
            key: "success",
            value: "Faq and associated data deleted successfully",
          },
        ],
      });
    } else {
      return res
        .status(500)
        .json({ message: [{ key: "error", value: "Failed to delete Faq" }] });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};