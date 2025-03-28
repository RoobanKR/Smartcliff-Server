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
    }

    if (!name || !institute_name || !mobile || !email || !enquiry) {
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
      services: services || [] // Optional services array
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
    const applications = await InstituteForm.find();
    return res.status(200).json(applications);
  } catch (error) {
    return res.status(500).json({ 
      message: [{ key: "error", value: "Error fetching applications" }] 
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