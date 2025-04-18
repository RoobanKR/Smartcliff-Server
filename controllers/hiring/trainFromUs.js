const TrainFromUs = require("../../models/hiring/trainFromUsModal");
const { sendEmail } = require("../../utils/sendEmail");
const config = require("config");
const emailConfig = config.get("emailConfig");

exports.createTrainFromUs = async (req, res) => {
  try {
    const {
      name,
      company_name,
      mobile,
      email,
      enquiry,
      skillsetRequirements
    } = req.body;

    const existingTrainFromUs = await TrainFromUs.findOne({ email });
    if (existingTrainFromUs) {
      return res.status(403).json({ 
        message: [{ key: "error", value: "Email already exists" }] 
      });
    }

    if (!name || !company_name || !mobile || !email) {
      return res.status(400).json({
        message: [{ key: "error", value: "Required fields are missing" }]
      });
    }

    const newTrainApplication = new TrainFromUs({
      name,
      company_name,
      mobile,
      email,
      skillsetRequirements: skillsetRequirements || [],
      enquiry,
      createdAt: new Date() 
    });

    await newTrainApplication.save();

    // Prepare email content
    const receiverSubject = `Hi ${name}, Thank you for Applying`;
    const receiverBody = `
      <p>Hello ${name},</p>
      <p>Thank you for your interest in our training program.</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Company:</strong> ${company_name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mobile:</strong> ${mobile}</p>
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

    // Send email to the applicant
    const receiverEmailSent = await sendEmail(email, receiverSubject, receiverBody);

    // Prepare admin email
    const senderSubject = `New Training Application from ${name}`;
    const senderBody = `
      <p>A new training application has been received:</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Company:</strong> ${company_name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mobile:</strong> ${mobile}</p>
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

    // Send email to admin
    const senderEmailSent = await sendEmail(emailConfig.user, senderSubject, senderBody);

    if (receiverEmailSent && senderEmailSent) {
      return res.status(201).json({ 
        message: [{ key: "success", value: "Application successfully submitted" }],
        data: newTrainApplication 
      });
    } else {
      return res.status(500).json({ 
        message: [{ key: "error", value: "Error sending confirmation emails" }] 
      });
    }
  } catch (error) {
    console.error("Error during the application process:", error);
    return res.status(500).json({ 
      message: [{ key: "error", value: "Internal server error" }] 
    });
  }
};

exports.getAllTrainFromUs = async (req, res) => {
    try {
      const trainApplications = await TrainFromUs.find();
  
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
      const trainApplication = await TrainFromUs.findById(id);
  
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
    




  exports.sendResponseEmailTrainFromUs = async (req, res) => {
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
  
      const applicants = await TrainFromUs.find({ _id: { $in: applicationIds } });
  
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
  