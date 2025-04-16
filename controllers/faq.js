const Faq = require("../models/faqModal");
 
exports.createFaq = async (req, res) => {
  try {
    const { faqItems, type, course, college, degree_program, service, business_service } = req.body;
 
    if (!faqItems || !Array.isArray(faqItems) || faqItems.length === 0) {
      return res
        .status(400)
        .json({ message: [{ key: "error", value: "FAQ items are required" }] });
    }
 
    // Validate each FAQ item
    const isValidFaqItems = faqItems.every((item) => item.question && item.answer);
 
    if (!isValidFaqItems) {
      return res
        .status(400)
        .json({ message: [{ key: "error", value: "Invalid FAQ items" }] });
    }
 
    // Determine category_name based on provided values
    const category_name = type || course || degree_program || college || business_service || service ? "non-common" : "common";
 
    // Create a Faq object
    const newFaq = new Faq({
      faqItems,
      type: type || null,
      course: course || null,
      college: college || null,
      degree_program: degree_program || null,
      service: service || null,
      business_service: business_service || null,
      category_name,
    });
 
    // Save the Faq object
    await newFaq.save();
 
    return res.status(201).json({
      message: [{ key: "Success", value: "FAQs Added Successfully" }],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};
 
 
exports.getAllFaq = async (req, res) => {
  try {
    const allFaq = await Faq.find().populate("course").populate('business_service').populate('service').populate('college');
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
    const FAQ = await Faq.findById(id).populate('business_service').populate('service').populate("course").populate("degree_program").populate("business_service").populate('college');
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
  const { faqItems, type, course, college, degree_program, service, business_service, category_name } = req.body;
 
  try {
    // Basic validation
    if (!faqItems || !Array.isArray(faqItems) || faqItems.length === 0) {
      return res
        .status(400)
        .json({ message: [{ key: "error", value: "FAQ items are required" }] });
    }
 
    // Validate each FAQ item
    const isValidFaqItems = faqItems.every((item) => item.question && item.answer);
 
    if (!isValidFaqItems) {
      return res
        .status(400)
        .json({ message: [{ key: "error", value: "Invalid FAQ items" }] });
    }
 
    // Create update object
    const updateData = {
      faqItems,
      type: type || null,
      course: course || null,
      college: college || null,
      degree_program: degree_program || null,
      service: service || null,
      business_service: business_service || null,
      category_name: category_name || "common",
      lastModifiedOn: new Date(),
    };
 
    // Add lastModifiedBy if user info is available
    if (req.user?.email) {
      updateData.lastModifiedBy = req.user.email;
    }
 
    const updatedFaq = await Faq.findByIdAndUpdate(id, updateData, { new: true });
 
    if (!updatedFaq) {
      return res
        .status(404)
        .json({ message: [{ key: "error", value: "FAQ section not found" }] });
    }
 
    return res.status(200).json({
      message: [{ key: "success", value: "FAQ section Update Successfully" }],
      updatedFaq,
    });
  } catch (error) {
    console.error("Error updating FAQ:", error);
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
 