const Contact = require("../models/ContactModal");
const { sendEmail } = require("../utils/sendEmail");


exports.submitContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingEmail = await Contact.findOne({ email });
        if (existingEmail) {
            return res.status(403).json({ message: [{ key: "error", value: "Email already exists" }] });
        }

        const newContact = new Contact({
            name,
            email,
            message,
        });

        await newContact.save();


        const userSubject = `Thank You for Your Contact SmartCliff`;
        const userBody = `
           <html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            background: #fff;
            padding: 20px;
            margin: 0 auto;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h2 {
            color: #0056b3;
            text-align: center;
        }
        p {
            font-size: 16px;
            color: #555;
        }
        .details {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Thank You for Contacting Us, ${name}!</h2>
        <p>We have received your Contact and will get back to you shortly.</p>

        <div class="details">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong> ${message}</p>
        </div>

        <p>We appreciate your interest in our services.</p>

        <div class="footer">
            <p><strong>SmartCliff</strong> | www.smartcliff.in</p>
        </div>
    </div>
</body>
</html>

        `;
        await sendEmail(email, userSubject, userBody);


        const adminEmail = process.env.ADMIN_EMAIL;
        const adminSubject = `New Contact Received - ${name}`;
        const adminBody = `
            <html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            background: #fff;
            padding: 20px;
            margin: 0 auto;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h2 {
            color: #d9534f;
            text-align: center;
        }
        .details {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .details p {
            font-size: 16px;
            color: #555;
            margin: 5px 0;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>New Contact Submission</h2>
        <p>A new contact has been submitted on your website.</p>

        <div class="details">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong> ${message}</p>
        </div>

        <p>Please follow up with the client as soon as possible.</p>

        <div class="footer">
            <p><strong>- Automated Notification from SmartCliff</strong></p>
        </div>
    </div>
</body>
</html>

        `;
        await sendEmail(adminEmail, adminSubject, adminBody);

        return res.status(201).json({
            message: [{ key: "success", value: "Our team will respond shortly." }],
        });

    } catch (error) {
        console.error("Contact submission error:", error);
        res.status(500).json({ error: "Server error" });
    }
};


exports.getAllContact = async (req, res) => {
    try {
        const contacts = await Contact.find()

            return res.status(200).json({
                message: [{ key: "success", value: "contact getted" }],
                allContact: contacts,
              });
        } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({ error: "Server error" });
    }
};


exports.getContactById = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findById(id);

        if (!contact) {
            return res.status(404).json({ error: "Contact not found" });
        }

        return res.status(200).json({
            message: [{ key: "success", value: "contact Id based getted" }],
            contactById: contact,
          });
          } catch (error) {
        console.error("Error fetching contact by ID:", error);
        res.status(500).json({ error: "Server error" });
    }
};


exports.deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedContact= await Contact.findByIdAndDelete(id);

        if (!deletedContact) {
            return res.status(404).json({ error: "Contact not found" });
        }

        return res.status(200).json({ message: [{ key: "success", value: "Contact deleted successfully" }] });
    } catch (error) {
        console.error("Error deleting contact:", error);
        res.status(500).json({ error: "Server error" });
    }
};  


exports.sendResponseEmailContact = async (req, res) => {
    try {
      const { subject, message, contactIds } = req.body;
  
      if (!subject || !message) {
        return res.status(400).json({
          message: [{ key: "error", value: "Subject and message are required" }],
        });
      }
  
      if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
        return res.status(400).json({
          message: [{ key: "error", value: "At least one application ID is required" }],
        });
      }
  
      const applicants = await Contact.find({ _id: { $in: contactIds } });
  
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
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f9f9f9;
                  margin: 0;
                  padding: 30px;
                }
                .container {
                  background-color: #ffffff;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 25px;
                  border-radius: 10px;
                  box-shadow: 0px 2px 8px rgba(0,0,0,0.1);
                }
                h2 {
                  color: #004aad;
                  text-align: center;
                }
                p {
                  color: #555;
                  line-height: 1.6;
                }
                .response-box {
                  background-color: #f1f4ff;
                  border-left: 4px solid #004aad;
                  padding: 15px;
                  margin-top: 20px;
                  font-size: 15px;
                }
                .footer {
                  margin-top: 30px;
                  font-size: 13px;
                  color: #999;
                  text-align: center;
                }
                .btn {
                  display: inline-block;
                  margin-top: 20px;
                  padding: 10px 20px;
                  background-color: #004aad;
                  color: #fff;
                  text-decoration: none;
                  border-radius: 5px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h2>${subject}</h2>
                <p>Dear ${applicant.name},</p>
                <p>Thank you for reaching out to us via our contact form. We appreciate your interest and would like to respond as follows:</p>
                
                <div class="response-box">
                  ${message}
                </div>
            
                <p>If you have any further questions or concerns, feel free to reply to this email or visit our website below.</p>
            
                <div class="footer">
                  <p><strong>SmartCliff Academy</strong></p>
                  <p><a class="btn" href="https://smartcliff.academy/">Visit Website</a></p>
                </div>
              </div>
            </body>
            </html>
            `;
            
  
            await sendEmail(applicant.email, subject, emailBody);
            results.success.push({
              id: applicant._id,
              from: req?.user?.email || process.env.NODEMAILER_FORM_EMAIL,
              to: applicant.email, 
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
              status: 'Success'
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