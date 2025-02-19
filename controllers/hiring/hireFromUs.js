const HireFromUs = require("../../models/hiring/hireFromUsModal");
const { sendEmail } = require("../../utils/sendEmail");
const config = require('config');
const emailConfig = config.get('emailConfig');

exports.createHireFromUs = async (req, res) => {
  try {
    const { name, designation, company_name, mobile, email, enquiry,count,course } =
      req.body;

    if (
      !name ||
      !designation ||
      !company_name ||
      !mobile ||
      !email ||
      !enquiry ||
      !course ||
      !count
    ) {
      return res.status(400).json({
        message: [
          {
            key: "error",
            value: "Required fields are missing in hiring From Us",
          },
        ],
      });
    }

    const newHiringApply = new HireFromUs({
      name,
      designation,
      company_name,
      mobile,
      email,
      enquiry,
      count,
      course
    });

    await newHiringApply.save();
    const populatedApplication = await newHiringApply.populate("course");
    const courseInfo = populatedApplication.course;

    const receiverEmail = email;
    const senderEmail = emailConfig.user;
    // user mail
    const receiverSubject = ` Hi ${name}, Thank you for Applying `;
    const receiverBody = `
    <p>Hello,</p>
    <p>We have received a new job application from:</p>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${mobile}</p>
    <p><strong>Hiring Enquiry:</strong> ${enquiry}</p>
    <p><strong>Company:</strong> ${courseInfo.course_name}

`;

        const receiverEmailSent = await sendEmail(receiverEmail, receiverSubject, receiverBody);
        // admin mail
        const senderSubject = `${name} Thank you for Applying`;
        const senderBody = `
        <p>Hello,</p>
        <p>We have received a new job application from:</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${mobile}</p>
        <p><strong>Hiring Enquiry:</strong> ${enquiry}</p>
        <p><strong>Company:</strong> ${courseInfo.course_name}

          `;
        const senderEmailSent = await sendEmail(senderEmail, senderSubject, senderBody);

        if (receiverEmailSent && senderEmailSent) {
            console.log('Emails sent successfully');
            return res.status(201).json({ message: [{ key: 'success', value: 'Student Successfully Submited ' }] });
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



