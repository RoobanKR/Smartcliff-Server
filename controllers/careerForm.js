const Career = require("../models/CareerFormModal");
const path = require("path");
const fs = require("fs");
const { sendEmail } = require("../utils/sendEmail");

exports.createCareerForm = async (req, res) => {
  try {
    const { name, email, phone, job_position, qualification,gender,yearOfRelevantExperience } = req.body;

    const existingApplication = await Career.findOne({ email });
    if (existingApplication) {
      return res.status(403).json({
        message: [
          { key: "error", value: "You have already applied for a job." },
        ],
      });
    }

    if (!req.files || !req.files.resume) {
      return res.status(400).json({
        message: [{ key: "error", value: "Resume is required" }],
      });
    }

    const resumeFile = req.files.resume;

    if (resumeFile.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        message: [{ key: "error", value: "Resume size exceeds the 5MB limit" }],
      });
    }

    const allowedExtensions = [".pdf", ".doc", ".docx"];
    const fileExtension = path.extname(resumeFile.name).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      return res.status(400).json({
        message: [
          { key: "error", value: "Only PDF, DOC, or DOCX files are allowed" },
        ],
      });
    }

    const uniqueFileName = `${Date.now()}_${resumeFile.name}`;
    const uploadPath = path.join(
      __dirname,
      "../uploads/career/resume",
      uniqueFileName
    );
    await resumeFile.mv(uploadPath);

    const newApplication = new Career({
      name,
      email,
      phone,
      job_position,
      qualification,
      gender,
      yearOfRelevantExperience,
      resume: uniqueFileName,
      createdBy: req.user ? req.user.email : "roobankr5@gmail.com",
    });

    await newApplication.save();

    const applicantSubject =
      "Thank You for Applying - Your Application is Received";
    const applicantBody = `
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px; }
            .container { max-width: 600px; background: #fff; padding: 20px; margin: 0 auto; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            h2 { color: #0056b3; text-align: center; }
            p { font-size: 16px; color: #555; }
            .footer { text-align: center; margin-top: 20px; font-size: 14px; color: #777; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Thank You for Applying, ${name}!</h2>
            <p>We have received your job application for <strong>${job_position}</strong>. Our team will review your resume and get back to you.</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
                        <p><strong>Gender:</strong> ${gender}</p>

                          <p><strong>Qualification:</strong> ${qualification}</p>
              <p><strong>Experience:</strong> ${yearOfRelevantExperience}</p>

            <p>We appreciate your interest in joining our team.</p>
            <div class="footer"><p><strong>SmartCliff</strong> | www.smartcliff.in</p></div>
          </div>
        </body>
        </html>
      `;
    await sendEmail(email, applicantSubject, applicantBody);

    // Admin Email
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminSubject = `New Job Application - ${name}`;
    const adminBody = `
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px; }
            .container { max-width: 600px; background: #fff; padding: 20px; margin: 0 auto; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            h2 { color: #d9534f; text-align: center; }
            .details { background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 14px; color: #777; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>New Job Application</h2>
            <p>A new job application has been submitted.</p>
            <div class="details">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Gender:</strong> ${phone}</p>
              <p><strong>Position:</strong> ${job_position}</p>
              <p><strong>Qualification:</strong> ${qualification}</p>
              <p><strong>Experience:</strong> ${yearOfRelevantExperience}</p>


            </div>
            <p><strong>Resume:</strong> <a href="${process.env.BACKEND_URL}/uploads/career/resume/${uniqueFileName}" target="_blank">Download</a></p>
            <p>Please review the application and follow up.</p>
            <div class="footer"><p><strong>SmartCliff</strong></p></div>
          </div>
        </body>
        </html>
      `;
    await sendEmail(adminEmail, adminSubject, adminBody);

    return res.status(201).json({
      message: [
        { key: "success", value: "Career application submitted successfully" },
      ],
    });
  } catch (error) {
    console.error("Career Application Error:", error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};

exports.getAllCareersForm = async (req, res) => {
  try {
    const careers = await Career.find();

    if (!careers || careers.length === 0) {
      return res.status(404).json({
        message: [{ key: "error", value: "No career applications found" }],
      });
    }

    const formattedCareers = careers.map((career) => {
      const careerObj = career.toObject();
      return {
        ...careerObj,
        resume:
          process.env.BACKEND_URL +
          "/uploads/career/resume/" +
          careerObj.resume,
      };
    });

    return res.status(200).json({
      message: [{ key: "success", value: "Careers retrieved successfully" }],
      allCareersForm: formattedCareers,
    });
  } catch (error) {
    console.error("Get All Careers Error:", error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};

exports.getCareerFormById = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);

    if (!career) {
      return res.status(404).json({
        message: [{ key: "error", value: "Career application not found" }],
      });
    }

    return res.status(200).json({
      message: [{ key: "success", value: "Career retrieved successfully" }],
      careerById: {
        ...career.toObject(),
        resume:
          process.env.BACKEND_URL + "/uploads/career/resume/" + career.resume,
      },
    });
  } catch (error) {
    console.error("Get Career By ID Error:", error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};

exports.updateCareerForm = async (req, res) => {
  try {
    const careerId = req.params.id;
    const { name, email, phone, job_position, qualification } = req.body;
    const resumeFile = req.files?.resume;

    const existingCareer = await Career.findById(careerId);

    if (!existingCareer) {
      return res.status(404).json({
        message: [{ key: "error", value: "Career application not found" }],
      });
    }

    if (resumeFile) {
      const oldResumePath = path.join(
        __dirname,
        "../uploads/career/resume",
        existingCareer.resume
      );
      if (fs.existsSync(oldResumePath)) {
        fs.unlinkSync(oldResumePath);
      }

      const uniqueFileName = `${Date.now()}_${resumeFile.name}`;
      const uploadPath = path.join(
        __dirname,
        "../uploads/career/resume",
        uniqueFileName
      );
      await resumeFile.mv(uploadPath);

      existingCareer.resume = uniqueFileName;
    }

    existingCareer.name = name || existingCareer.name;
    existingCareer.email = email || existingCareer.email;
    existingCareer.phone = phone || existingCareer.phone;
    existingCareer.phone = gender || existingCareer.gender;
    existingCareer.phone = yearOfRelevantExperience || existingCareer.yearOfRelevantExperience;
    existingCareer.job_position = job_position || existingCareer.job_position;
    existingCareer.qualification =
      qualification || existingCareer.qualification;

    await existingCareer.save();

    return res.status(200).json({
      message: [
        { key: "success", value: "Career application updated successfully" },
      ],
    });
  } catch (error) {
    console.error("Error updating career:", error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};

exports.deleteCareerForm = async (req, res) => {
  try {
    const careerId = req.params.id;

    const existingCareer = await Career.findById(careerId);

    if (!existingCareer) {
      return res.status(404).json({
        message: [{ key: "error", value: "Career application not found" }],
      });
    }

    if (existingCareer.resume) {
      const resumePath = path.join(
        __dirname,
        "../uploads/career/resume",
        existingCareer.resume
      );
      if (fs.existsSync(resumePath) && fs.lstatSync(resumePath).isFile()) {
        fs.unlinkSync(resumePath);
      }
    }

    await Career.deleteOne({ _id: careerId });

    return res.status(200).json({
      message: [
        { key: "success", value: "Career application deleted successfully" },
      ],
    });
  } catch (error) {
    console.error("Error deleting career:", error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};


exports.sendEmailToApplicants = async (req, res) => {
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

    const applicants = await Career.find({ _id: { $in: applicationIds } });

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
                <p><strong>SmartCliff</strong> | www.smartcliff.in</p>
              </div>
            </div>
          </body>
          </html>
        `;

        await sendEmail(applicant.email, subject, emailBody);
        results.success.push({
          from: req?.user?.email || process.env.NODEMAILER_FORM_EMAIL,
          to: applicant.email, 
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