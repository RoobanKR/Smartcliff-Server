const InstituteForm = require("../../models/hiring/InstituteFormModal");
const { sendEmail } = require("../../utils/sendEmail");
const config = require("config");
const emailConfig = config.get("emailConfig");

exports.createInstituteForm = async (req, res) => {
  try {
    const {
      name,
      designation,
      institute_name,
      mobile,
      email,
      enquiry,
      category,
      course,
      service,
      target_year,
      no_of_students,
      duration,
      duration_type,
    } = req.body;
      const existingHireFormUs = await InstituteForm.findOne({email});
      if (existingHireFormUs) {
        return res.status(403).json({ message: [{ key: "error", value: "Email exists" }] });
      }

    if (
      !name ||
      !designation ||
      !institute_name ||
      !mobile ||
      !email ||
      !enquiry ||
      !course ||
      !category ||
      !duration ||
      !service ||
      !no_of_students ||
      !target_year
    ) {
      return res.status(400).json({
        message: [{ key: "error", value: "Required fields are missing" }],
      });
    }

    const newInstituteForm = new InstituteForm({
      name,
      designation,
      institute_name,
      mobile,
      email,
      enquiry,
      category,
      course,
      service,
      no_of_students,
      duration,
      duration_type,
      target_year
    });

    await newInstituteForm.save();
    const populatedApplication = await InstituteForm.findById(newInstituteForm._id)
      .populate("course")
      .populate("category").populate("service");
    const courseInfo = populatedApplication.course;
    const categoryInfo = populatedApplication.category;
    const serviceInfo = populatedApplication.service;

    // User email
    const receiverSubject = `Hi ${name}, Thank you for Institute`;
    const receiverBody = `
      <p>Hello,</p>
      <p>Thank you for your interest in our training program.</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Designation:</strong> ${designation}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${mobile}</p>
      <p><strong>Enquiry:</strong> ${enquiry}</p>
      <p><strong>Duration:</strong> ${duration},${duration_type}</p>
      <p><strong>Course:</strong> ${courseInfo.course_name}</p>
      <p><strong>Category:</strong> ${categoryInfo.category_name}</p>

    `;

    const receiverEmailSent = await sendEmail(
      email,
      receiverSubject,
      receiverBody
    );

    // Admin email
    const senderSubject = `${name} Applied for Institute`;
    const senderBody = `
      <p>Hello,</p>
      <p>We have received a new training application from:</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Designation:</strong> ${designation}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${mobile}</p>
      <p><strong>Enquiry:</strong> ${enquiry}</p>
      <p><strong>Duration:</strong> ${duration},${duration_type}</p>

      <p><strong>Course:</strong> ${courseInfo.course_name}</p>
      <p><strong>Category:</strong> ${categoryInfo.category_name}</p>

    `;

    const senderEmailSent = await sendEmail(
      emailConfig.user,
      senderSubject,
      senderBody
    );

    if (receiverEmailSent && senderEmailSent) {
      console.log("Emails sent successfully");
      return res
        .status(201)
        .json({
          message: [
            { key: "success", value: "Application successfully submitted" },
          ],
        });
    } else {
      console.error("Error sending emails");
      return res
        .status(500)
        .json({ message: [{ key: "error", value: "Error sending emails" }] });
    }
  } catch (error) {
    console.error("Error during the application process:", error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};
