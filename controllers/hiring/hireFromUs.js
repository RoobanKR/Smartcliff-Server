const HireFromUs = require("../../models/hiring/hireFromUsModal");
const { sendEmail } = require("../../utils/sendEmail");
const config = require('config');
const emailConfig = config.get('emailConfig');


exports.createHireFromUs = async (req, res) => {
  try {
      const { name, company_name, mobile, email, enquiry, skillsetRequirements } = req.body;

      const existingHireFormUs = await HireFromUs.findOne({ email });
      if (existingHireFormUs) {
          return res.status(403).json({ message: [{ key: "error", value: "Email already exists" }] });
      }

      if (!name || !company_name || !mobile || !email || !enquiry) {
          return res.status(400).json({
              message: [{ key: "error", value: "Required fields are missing in hiring From Us" }],
          });
      }

      const newHiringApply = new HireFromUs({ name, company_name, mobile, email, enquiry, skillsetRequirements });

      await newHiringApply.save();

      // No need for populate, just find the saved document
      const savedApplication = await HireFromUs.findById(newHiringApply._id);


      // Ensure skillsetRequirements are formatted correctly
      const skillsList = savedApplication.skillsetRequirements.length > 0
          ? savedApplication.skillsetRequirements.map(skill => skill.skillset).join(', ')
          : "No skillsetRequirements provided";

      // Prepare email content
      const receiverEmail = email;
      const senderEmail = emailConfig.user;
      const receiverSubject = `Hi ${name}, Thank you for Applying`;
      const receiverBody = `
          <p>Hello,</p>
          <p>We have received a new job application from:</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${mobile}</p>
          <p><strong>Hiring Enquiry:</strong> ${enquiry}</p>
          <p><strong>Skills:</strong> ${skillsList}</p>
      `;

      const receiverEmailSent = await sendEmail(receiverEmail, receiverSubject, receiverBody);

      // Admin email
      const senderSubject = `${name} Thank you for Applying`;
      const senderBody = receiverBody;
      const senderEmailSent = await sendEmail(senderEmail, senderSubject, senderBody);

      if (receiverEmailSent && senderEmailSent) {
          return res.status(201).json({ message: [{ key: 'success', value: 'Application submitted successfully' }] });
      } else {
          console.error('Error sending emails');
          return res.status(500).json({ message: [{ key: 'error', value: 'Error sending emails' }] });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
  }
};


exports.sendResponseEmailhireFromUs = async (req, res) => {
  try {
    const { email, response } = req.body;


    const receiverEmail = email;
    const receiverSubject = "Response to your job application";
    const receiverBody = `
      <p>Hello,</p>
      <p>Thank you for your job application. Here is our response:</p>
      <p>${response}</p>
      <p>Best regards,</p>
      <p>SmartCliff</p>
    `;

    // Call the sendEmail function to send the response email
    const responseEmailSent = await sendEmail(receiverEmail, receiverSubject, receiverBody);

    if (responseEmailSent) {
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



exports.getAllHireFromUs = async (req, res) => {
  try {
    const hiringApplications = await HireFromUs.find().populate("course");

    return res.status(200).json({
      message: [
        {
          key: "success",
          value: "Successfully retrieved all hiring applications",
        },
      ],
      data: hiringApplications,
    });
  } catch (error) {
    console.error("Error retrieving hiring applications:", error);
    return res.status(500).json({
      message: [
        {
          key: "error",
          value: "Internal server error",
        },
      ],
    });
  }
};

exports.getHireFromUsById = async (req, res) => {
  const { id } = req.params;

  try {
    const hiringApplication = await HireFromUs.findById(id).populate("course");

    if (!hiringApplication) {
      return res.status(404).json({
        message: [
          {
            key: "error",
            value: `No hiring application found with ID: ${id}`,
          },
        ],
      });
    }

    return res.status(200).json({
      message: [
        {
          key: "success",
          value: `Successfully retrieved hiring application with ID: ${id}`,
        },
      ],
      data: hiringApplication,
    });
  } catch (error) {
    console.error(`Error retrieving hiring application with ID ${id}:`, error);
    return res.status(500).json({
      message: [
        {
          key: "error",
          value: "Internal server error",
        },
      ],
    });
  }
};

exports.deleteHireFromUs = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await HireFromUs.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({
        message: [
          {
            key: "error",
            value: `No hiring application found with ID: ${id}`,
          },
        ],
      });
    }

    return res.status(200).json({
      message: [
        {
          key: "success",
          value: `Successfully deleted hiring application with ID: ${id}`,
        },
      ],
    });
  } catch (error) {
    console.error(`Error deleting hiring application with ID ${id}:`, error);
    return res.status(500).json({
      message: [
        {
          key: "error",
          value: "Internal server error",
        },
      ],
    });
  }
};



