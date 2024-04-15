const EntrollBatch = require("../models/BatchEntrollModal");
const otpGenerator = require("otp-generator");
const emailUtil = require("../utils/sendEmail");

// Temporary storage for OTPs
const otpStorage = {};
const formStorage = {};

exports.createEntrollBatch = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      dob,
      gender,
      college,
      degree,
      course,
      reference,
    } = req.body;

    // Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
    });

    // Save form data and OTP to storage
    const formData = {
      name,
      email,
      phone,
      address,
      dob,
      gender,
      college,
      degree,
      course,
      reference,
    };
    formStorage[email] = formData;
    otpStorage[email] = otp;

    // Send OTP via email
    const emailSubject = "Your OTP for Verification";
    const emailBody = `
    <p><strong>Welcome to SmartCliff</strong></p>
    <p>Your OTP for verification is: ${otp}</p>
  `;

    const emailSent = await emailUtil.sendEmail(email, emailSubject, emailBody);

    if (emailSent) {
      return res.status(200).json({
        message: [{ key: "success", value: "OTP sent successfully" }],
      });
    } else {
      return res.status(500).json({
        message: [{ key: "error", value: "Couldn't send OTP" }],
      });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal Server Error" }] });
  }
};

exports.batchVerifyOTP = async (req, res) => {
  try {
    const { otp, email } = req.body;

    // Check if OTP exists in storage
    const storedOTP = otpStorage[email];
    if (!storedOTP) {
      return res.status(400).json({
        message: [{ key: "error", value: "OTP not found or expired" }],
      });
    }

    // Validate OTP
    if (otp !== storedOTP) {
      return res
        .status(400)
        .json({ message: [{ key: "error", value: "Invalid OTP" }] });
    }

    // Get form data from storage
    const formData = formStorage[email];

    // Save student data to MongoDB
    const newEntrollBatch = new EntrollBatch(formData);
    await newEntrollBatch.save();

    // Clear form data and OTP from storage after successful verification and saving
    delete formStorage[email];
    delete otpStorage[email];

    return res.status(201).json({
      message: [{ key: "Success", value: "Student data saved successfully" }],
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal Server Error" }] });
  }
};


exports.batchResendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email exists in form storage
    const formData = formStorage[email];
    if (!formData) {
      return res.status(400).json({
        message: [{ key: "error", value: "No form data found for this email" }],
      });
    }

    // Generate new OTP
    const newOTP = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
    });

    // Update OTP in OTP storage
    otpStorage[email] = newOTP;

    // Send new OTP via email
    const emailSubject = "Your New OTP for Verification";
    const emailBody = `
      <p><strong>Welcome back to SmartCliff</strong></p>
      <p>Your new OTP for verification is: ${newOTP}</p>
    `;

    const emailSent = await emailUtil.sendEmail(email, emailSubject, emailBody);

    if (emailSent) {
      return res.status(200).json({
        message: [{ key: "success", value: "New OTP sent successfully" }],
      });
    } else {
      return res.status(500).json({
        message: [{ key: "error", value: "Couldn't send new OTP" }],
      });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal Server Error" }] });
  }
};


exports.getAllEntrollBatch = async (req, res) => {
  try {
    const applications = await EntrollBatch.find().populate("course");
    return res.status(200).json({
      message: [
        { key: "success", value: "Entroll Batch Retrieved successfully" },
      ],
      applications: applications,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal Server Error" }] });
  }
};

exports.getEntrollBatchById = async (req, res) => {
  const { id } = req.params;
  try {
    const entrollBatchById = await EntrollBatch.findById(id).populate("course");
    if (!entrollBatchById) {
      return res.status(404).json({
        message: [{ key: "error", value: "Entroll Batch Now Data not found" }],
      });
    }
    return res.status(200).json({
      message: [
        {
          key: "success",
          value: "Entroll Batch Id based Retrieved successfully",
        },
      ],
      EntrollBatchById: entrollBatchById,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal Server Error" }] });
  }
};

exports.deleteEntrollBatchById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedApplication = await EntrollBatch.findByIdAndDelete(id);
    if (!deletedApplication) {
      return res.status(404).json({
        message: [{ key: "error", value: "Batches Data not found" }],
      });
    }
    res.status(200).json({
      message: [{ key: "success", value: " Batch Data deleted successfully" }],
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal Server Error" }] });
  }
};
