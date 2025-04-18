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

      const newHiringApply = new HireFromUs({ name, company_name, mobile, email, enquiry, skillsetRequirements,createdAt: new Date(),
      });

      await newHiringApply.save();

      // No need for populate, just find the saved document
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
      ${skillsetRequirements && skillsetRequirements.length > 0 ? `
        <p><strong>Skills:</strong></p>
        <ul>
          ${skillsetRequirements.map(skill => `
            <li>
              <strong>Skillset:</strong> ${skill.skillset}
              <br><strong>Resources:</strong> ${skill.resources}
            </li>
          `).join('')}
        </ul>
      ` : ''}
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
    const { subject, message, applicationIds } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        message: [{ key: "error", value: "Subject and message are required" }],
      });
    }

    if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
      return res.status(400).json({
        message: [{ key: "error", value: "At least one application ID is required" }],
      });
    }

    const applicants = await HireFromUs.find({ _id: { $in: applicationIds } });

    if (applicants.length === 0) {
      return res.status(404).json({
        message: [{ key: "error", value: "No applicants found with the provided IDs" }],
      });
    }

    const results = {
      success: [],
      failed: []
    };

    for (const applicant of applicants) {
      try {
        const emailBody = `
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px; }
              .container { max-width: 600px; background: #fff; padding: 20px; margin: 0 auto; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
              h2 { color: #0056b3; text-align: center; }
              .content { font-size: 16px; color: #555; line-height: 1.6; }
              .footer { text-align: center; margin-top: 20px; font-size: 14px; color: #777; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>${subject}</h2>
              <div class="content">
                <p>Dear ${applicant.name},</p>
                ${message}
              </div>
              <div class="footer">
                <p><strong>SmartCliff</strong> | https://smartcliff.academy/</p>
              </div>
            </div>
          </body>
          </html>
        `;

        await sendEmail(applicant.email, subject, emailBody);
        results.success.push({
          id: applicant._id,
          name: applicant.name,
          email: applicant.email,
          status: 'Success' // Store success status
        });

        // Store email subject and body in the applicant's record
        applicant.responseEmails.push({ 
          from: req?.user?.email || process.env.NODEMAILER_FORM_EMAIL,
          to: applicant.email, 
          name: applicant.name, 
          subject, 
          body: message,
          status: 'Success' // Store status in responseEmails
        });
        await applicant.save();
      } catch (error) {
        console.error(`Failed to send email to ${applicant.email}:`, error);
        results.failed.push({
          id: applicant._id,
          name: applicant.name,
          email: applicant.email,
          error: error.message,
          status: 'Failed' // Store failed status
        });
      }
    }

    return res.status(200).json({
      message: [{ 
        key: "success", 
        value: `Emails sent successfully to ${results.success.length} applicants${results.failed.length > 0 ? `, failed for ${results.failed.length} applicants` : ''}`
      }],
      results
    });
  } catch (error) {
    console.error("Send Email Error:", error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};

exports.getAllHireFromUs = async (req, res) => {
  try {
    const hiringApplications = await HireFromUs.find();

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
    const hiringApplication = await HireFromUs.findById(id);

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



