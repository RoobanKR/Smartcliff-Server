const CourseApplyNow = require("../models/CourseApplyNowModal");
const otpGenerator = require("otp-generator");
const emailUtil = require("../utils/sendEmail");

const otpStorage = {};
const formStorage = {};

exports.createCourseApplyNow = async (req, res) => {
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

    const otp = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
    });
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

exports.verifyOTP = async (req, res) => {
  try {
    const { otp, email } = req.body;

    const storedOTP = otpStorage[email];
    if (!storedOTP) {
      return res.status(400).json({
        message: [{ key: "error", value: "OTP not found or expired" }],
      });
    }

    if (otp !== storedOTP) {
      return res
        .status(400)
        .json({ message: [{ key: "error", value: "Invalid OTP" }] });
    }

    const formData = formStorage[email];

    const newCourseApply = new CourseApplyNow(formData);
    await newCourseApply.save();

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


exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const formData = formStorage[email];
    if (!formData) {
      return res.status(400).json({
        message: [{ key: "error", value: "No form data found for this email" }],
      });
    }

    const newOTP = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
    });

    otpStorage[email] = newOTP;

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


exports.getAllCourseApplications = async (req, res) => {
  try {
    const applications = await CourseApplyNow.find();
    return res.status(200).json({
      message: [
        { key: "success", value: "Student Apply Form Retrieved successfully" },
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

exports.getCourseApplicationById = async (req, res) => {
  const { id } = req.params;
  try {
    const CourseApplyById = await CourseApplyNow.findById(id);
    if (!CourseApplyById) {
      return res.status(404).json({
        message: [{ key: "error", value: "Student Apply Now Data not found" }],
      });
    }
    return res.status(200).json({
      message: [
        {
          key: "success",
          value: "Student Apply Form Id based Retrieved successfully",
        },
      ],
      CourseApplyById: CourseApplyById,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal Server Error" }] });
  }
};

exports.deleteCourseApplicationById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedApplication = await CourseApplyNow.findByIdAndDelete(id);
    if (!deletedApplication) {
      return res.status(404).json({
        message: [{ key: "error", value: "Student Apply Now Data not found" }],
      });
    }
    res.status(200).json({
      message: [{ key: "success", value: "Student Data deleted successfully" }],
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal Server Error" }] });
  }
};
