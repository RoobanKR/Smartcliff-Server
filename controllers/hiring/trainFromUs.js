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
      trainee_modal,
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
      trainee_modal,
      skillsetRequirements: skillsetRequirements || [] 
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
      ${trainee_modal ? `<p><strong>Trainee Modal:</strong> ${trainee_modal}</p>` : ''}
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
      ${trainee_modal ? `<p><strong>Trainee Modal:</strong> ${trainee_modal}</p>` : ''}
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
    