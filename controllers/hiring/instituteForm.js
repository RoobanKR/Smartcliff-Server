const InstituteForm = require("../../models/hiring/InstituteFormModal");
const { sendEmail } = require("../../utils/sendEmail");
const config = require("config");
const emailConfig = config.get("emailConfig");

exports.createInstituteForm = async (req, res) => {
  try {
    const {
      name,
      institute_name,
      mobile,
      email,
      enquiry,
      services
    } = req.body;

    const existingInstituteForm = await InstituteForm.findOne({ email });
    if (existingInstituteForm) {
      return res.status(403).json({ 
        message: [{ key: "error", value: "Email already exists" }] 
      });
    }    if (!name || !institute_name || !mobile || !email || !enquiry) {
      return res.status(400).json({
        message: [{ key: "error", value: "Required fields are missing" }]
      });
    }

    const newInstituteForm = new InstituteForm({
      name,
      institute_name,
      mobile,
      email,
      enquiry,
      services: services || [], // Optional services array
      createdAt: new Date(),

    });

    // Save the application
    await newInstituteForm.save();

    // Prepare email content
    const receiverSubject = `Hi ${name}, Thank you for Your Institute Form Submission`;
    const receiverBody = `
      <p>Hello ${name},</p>
      <p>Thank you for your interest in our services.</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Institute Name:</strong> ${institute_name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mobile:</strong> ${mobile}</p>
      <p><strong>Enquiry:</strong> ${enquiry}</p>
      ${services && services.length > 0 ? `
        <p><strong>Services:</strong></p>
        <ul>
          ${services.map(service => `
            <li>
              <strong>Service:</strong> ${service.service}
              <br><strong>Resources:</strong> ${service.resources}
            </li>
          `).join('')}
        </ul>
      ` : ''}
    `;

    // Send email to the applicant
    const receiverEmailSent = await sendEmail(email, receiverSubject, receiverBody);

    // Prepare admin email
    const senderSubject = `New Institute Form Submission from ${name}`;
    const senderBody = `
      <p>A new institute form has been received:</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Institute Name:</strong> ${institute_name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mobile:</strong> ${mobile}</p>
      <p><strong>Enquiry:</strong> ${enquiry}</p>
      ${services && services.length > 0 ? `
        <p><strong>Services:</strong></p>
        <ul>
          ${services.map(service => `
            <li>
              <strong>Service:</strong> ${service.service}
              <br><strong>Resources:</strong> ${service.resources}
            </li>
          `).join('')}
        </ul>
      ` : ''}
    `;

    // Send email to admin
    const senderEmailSent = await sendEmail(emailConfig.user, senderSubject, senderBody);

    // Respond with success message
    if (receiverEmailSent && senderEmailSent) {
      return res.status(201).json({ 
        message: [{ key: "success", value: "Application successfully submitted" }],
        data: newInstituteForm 
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

// Optional: Add other CRUD operations
exports.getAllInstituteFormApplications = async (req, res) => {
    try {
      const instituteApplications = await InstituteForm.find();
  
      return res.status(200).json({
        message: [{ key: "success", value: "Successfully retrieved all trInstituteaining applications" }],
        data: instituteApplications,
      });
    } catch (error) {
      console.error("Error retrieving training applications:", error);
      return res.status(500).json({
        message: [{ key: "error", value: "Internal server error" }],
      });
    }
  };

exports.getInstituteFormById = async (req, res) => {
  try {
    const application = await InstituteForm.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ 
        message: [{ key: "error", value: "Application not found" }] 
      });
    }
    return res.status(200).json(application);
  } catch (error) {
    return res.status(500).json({ 
      message: [{ key: "error", value: "Error fetching application" }] 
    });
  }
};

  exports.deleteInstitute = async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await InstituteForm.findByIdAndDelete(id);
  
      if (!result) {
        return res.status(404).json({
          message: [{ key: "error", value: `No instiyute application found with ID: ${id}` }],
        });
      }
  
      return res.status(200).json({
        message: [{ key: "success", value: `Successfully deleted institute application with ID: ${id}` }],
      });
    } catch (error) {
      console.error(`Error deleting training application with ID ${id}:`, error);
      return res.status(500).json({
        message: [{ key: "error", value: "Internal server error" }],
      });
    }
  };



exports.sendResponseEmailInstituteForm = async (req, res) => {
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

    const applicants = await InstituteForm.find({ _id: { $in: applicationIds } });

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
