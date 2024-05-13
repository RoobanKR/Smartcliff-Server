const Hiring_Apply = require("../../models/hiring/hiringApplyModal");
const { sendEmail } = require("../../utils/sendEmail");
const config = require("config");
const emailConfig = config.get("emailConfig");

exports.createHiringApply = async (req, res) => {
  try {
    const {
      name,
      dob,
      email,
      mobile,
      gender,
      address,
      yop,
      highest_level_education,
      college,
      company
    } = req.body;

    if (
      !name ||
      !dob ||
      !email ||
      !mobile ||
      !gender ||
      !address ||
      !yop ||
      !highest_level_education ||
      !company ||
      !college
    ) {
      return res.status(400).json({
        message: [{ key: "error", value: "Required fields are missing" }],
      });
    }

    const newHiringApply = new Hiring_Apply({
      name,
      email,
      mobile,
      gender,
      address,
      yop,
      highest_level_education,
      college,
      company
    });

    await newHiringApply.save();
    const populatedApplication = await newHiringApply.populate("company");
    const companyInfo = populatedApplication.company;

    const receiverEmail = email;
    const senderEmail = emailConfig.user;

    const receiverSubject = `Hi ${name}, Thank you for Applying`;
    const receiverBody = `
      <p>Hello,</p>
      <p>We have received your job application:</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Date of Birth:</strong> ${dob}</p>
      <p><strong>Phone:</strong> ${mobile}</p>
      <p><strong>Gender:</strong> ${gender}</p>
      <p><strong>Address:</strong> ${address}</p>
      <p><strong>Year of Passing:</strong> ${yop}</p>
      <p><strong>Education Level:</strong> ${highest_level_education}</p>
      <p><strong>Company:</strong> ${companyInfo.company_name}

    `;

    const receiverEmailSent = await sendEmail(receiverEmail, receiverSubject, receiverBody);

    // Email to admin or HR
    const senderSubject = `New Job Application from ${name}`;
    const senderBody = `
      <p>Hello,</p>
      <p>We've received a new job application:</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Date of Birth:</strong> ${dob}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${mobile}</p>
      <p><strong>Gender:</strong> ${gender}</p>
      <p><strong>Address:</strong> ${address}</p>
      <p><strong>Year of Passing:</strong> ${yop}</p>
      <p><strong>Education Level:</strong> ${highest_level_education}</p>
      <p><strong>Company:</strong> ${companyInfo.company_name}</p>

    `;

    const senderEmailSent = await sendEmail(senderEmail, senderSubject, senderBody);

    if (receiverEmailSent && senderEmailSent) {
      console.log("Emails sent successfully");
      return res.status(201).json({ message: [{ key: "success", value: "Application submitted successfully" }] });
    } else {
      console.error("Error sending emails");
      return res.status(500).json({ message: [{ key: "error", value: "Error sending emails" }] });
    }
  } catch (error) {
    console.error("Error creating hiring application:", error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};


exports.sendResponseEmail = async (req, res) => {
  try {
    const { email, response } = req.body;

    // Assuming you have some validation for email and response here

    const receiverEmail = email;
    const receiverSubject = "Response to your job application";
    const receiverBody = `
      <p>Hello,</p>
      <p>Thank you for your job application. Here is our response:</p>
      <p>${response}</p>
      <p>Best regards,</p>
      <p>Your Company</p>
    `;

    // Call the sendEmail function to send the response email
    const responseEmailSent = await sendEmail(receiverEmail, receiverSubject, receiverBody);

    if (responseEmailSent) {
      console.log("Response email sent successfully");
      return res.status(200).json({ message: "Response email sent successfully" });
    } else {
      console.error("Error sending response email");
      return res.status(500).json({ message: "Error sending response email" });
    }
  } catch (error) {
    console.error("Error sending response email:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
