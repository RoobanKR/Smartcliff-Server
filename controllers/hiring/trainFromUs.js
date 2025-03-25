const TrainFromUs = require("../../models/hiring/trainFromUsModal");
const { sendEmail } = require("../../utils/sendEmail");
const config = require("config");
const emailConfig = config.get("emailConfig");

exports.createTrainFromUs = async (req, res) => {
  try {
    const {
      name,
      designation,
      company_name,
      mobile,
      email,
      enquiry,
      category,
      course,
      type,
      count,
      batch_size,
      location,
      client_location,
      duration,
      duration_type,
      
    } = req.body;
      const existingHireFormUs = await TrainFromUs.findOne({email});
      if (existingHireFormUs) {
        return res.status(403).json({ message: [{ key: "error", value: "Email exists" }] });
      }

    if (
      !name ||
      !designation ||
      !company_name ||
      !mobile ||
      !email ||
      !enquiry ||
      !course ||
      !category ||
      !type ||
      !location ||
      !duration
        ) {
      return res.status(400).json({
        message: [{ key: "error", value: "Required fields are missing" }],
      });
    }

    const newTrainApply = new TrainFromUs({
      name,
      designation,
      company_name,
      mobile,
      email,
      enquiry,
      category,
      course,
      type,
      count,
      batch_size,
      location,
      client_location,
      duration,
      duration_type
    });

    await newTrainApply.save();
    const populatedApplication = await TrainFromUs.findById(newTrainApply._id).populate("course").populate("category");
    const courseInfo = populatedApplication.course;
    const categoryInfo = populatedApplication.category;

    // User email
    const receiverSubject = `Hi ${name}, Thank you for Applying`;
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

    const receiverEmailSent = await sendEmail(email, receiverSubject, receiverBody);

    // Admin email
    const senderSubject = `${name} Applied for Training`;
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

    const senderEmailSent = await sendEmail(emailConfig.user, senderSubject, senderBody);

    if (receiverEmailSent && senderEmailSent) {
      console.log("Emails sent successfully");
      return res.status(201).json({ message: [{ key: "success", value: "Application successfully submitted" }] });
    } else {
      console.error("Error sending emails");
      return res.status(500).json({ message: [{ key: "error", value: "Error sending emails" }] });
    }
  } catch (error) {
    console.error("Error during the application process:", error);
    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};


exports.getAllTrainFromUs = async (req, res) => {
    try {
      const trainApplications = await TrainFromUs.find().populate("course").populate("category");
  
      return res.status(200).json({
        message: [{ key: "success", value: "Successfully retrieved all training applications" }],
        data: trainApplications,
      });
    } catch (error) {
      console.error("Error retrieving training applications:", error);
      return res.status(500).json({
        message: [{ key: "error", value: "Internal server error" }],
      });
    }
  };

  exports.getTrainFromUsById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const trainApplication = await TrainFromUs.findById(id).populate("course").populate("category");
  
      if (!trainApplication) {
        return res.status(404).json({
          message: [{ key: "error", value: `No training application found with ID: ${id}` }],
        });
      }
  
      return res.status(200).json({
        message: [{ key: "success", value: `Successfully retrieved training application with ID: ${id}` }],
        data: trainApplication,
      });
    } catch (error) {
      console.error(`Error retrieving training application with ID ${id}:`, error);
      return res.status(500).json({
        message: [{ key: "error", value: "Internal server error" }],
      });
    }
  };
  exports.deleteTrainFromUs = async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await TrainFromUs.findByIdAndDelete(id);
  
      if (!result) {
        return res.status(404).json({
          message: [{ key: "error", value: `No training application found with ID: ${id}` }],
        });
      }
  
      return res.status(200).json({
        message: [{ key: "success", value: `Successfully deleted training application with ID: ${id}` }],
      });
    } catch (error) {
      console.error(`Error deleting training application with ID ${id}:`, error);
      return res.status(500).json({
        message: [{ key: "error", value: "Internal server error" }],
      });
    }
  };
    