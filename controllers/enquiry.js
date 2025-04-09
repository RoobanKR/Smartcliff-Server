const Enquiry = require("../models/EnquiryModal");
const { sendEmail } = require("../utils/sendEmail");


exports.submitEnquiry = async (req, res) => {
    try {
        const { name, email, phone,  category, courses, message } = req.body;

        const existingEmail = await Enquiry.findOne({ email });
        if (existingEmail) {
            return res.status(403).json({ message: [{ key: "error", value: "Email already exists" }] });
        }

        const newEnquiry = new Enquiry({
            name,
            email,
            phone,
            category,
            courses,
            message,
        });

        await newEnquiry.save();

        const enquiry = await Enquiry.findById(newEnquiry._id)
            .populate("category")
            .populate("courses");

        const categoryName = enquiry.category ? enquiry.category.category_name : "N/A";
        const coursesName = enquiry.courses ? enquiry.courses.course_name : "N/A";

        const userSubject = `Thank You for Your Enquiry - ${categoryName}`;
        const userBody = `
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #0056b3;">Hello ${name},</h2>
                <p>Thank you for reaching out! We have received your enquiry and will get back to you as soon as possible.</p>
                
                <h3 style="color: #333;">Enquiry Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Name:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${phone}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Business Service:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${categoryName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Service:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${coursesName}</td>
                    </tr>
                </table>

                <p>We appreciate your interest and will be in touch soon.</p>
                <p>Best regards,</p>
                <p><strong>SmartCliff</strong></p>
            </body>
            </html>
        `;
        await sendEmail(email, userSubject, userBody);


        const adminEmail = process.env.ADMIN_EMAIL;
        const adminSubject = `New Enquiry Received - ${categoryName}`;
        const adminBody = `
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #d9534f;">New Enquiry Submitted</h2>

                <h3 style="color: #333;">Enquiry Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Name:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${phone}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Business Service:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${categoryName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Service:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${coursesName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Message:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${message}</td>
                    </tr>
                </table>

                <p>Please follow up with the client as soon as possible.</p>
                <p><strong>- Automated Notification from SmartCliff</strong></p>
            </body>
            </html>
        `;
        await sendEmail(adminEmail, adminSubject, adminBody);

        return res.status(201).json({
            message: [{ key: "success", value: "Our team will respond shortly." }],
        });

    } catch (error) {
        console.error("Enquiry submission error:", error);
        res.status(500).json({ error: "Server error" });
    }
};



exports.getAllEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find()
        .populate("category")
        .populate("courses").sort({ createdAt: -1 });

            return res.status(200).json({
                message: [{ key: "success", value: "enquiry getted" }],
                allEnquiry: enquiries,
              });
        } catch (error) {
        console.error("Error fetching enquiries:", error);
        res.status(500).json({ error: "Server error" });
    }
};


exports.getEnquiryById = async (req, res) => {
    try {
        const { id } = req.params;
        const enquiry = await Enquiry.findById(id).populate("category").populate("courses");

        if (!enquiry) {
            return res.status(404).json({ error: "Enquiry not found" });
        }

        return res.status(200).json({
            message: [{ key: "success", value: "enquiry Id based getted" }],
            enquiryById: enquiry,
          });
          } catch (error) {
        console.error("Error fetching enquiry by ID:", error);
        res.status(500).json({ error: "Server error" });
    }
};



exports.deleteEnquiry = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEnquiry = await Enquiry.findByIdAndDelete(id);

        if (!deletedEnquiry) {
            return res.status(404).json({ error: "Enquiry not found" });
        }

        return res.status(200).json({ message: [{ key: "success", value: "Enquiry deleted successfully" }] });
    } catch (error) {
        console.error("Error deleting enquiry:", error);
        res.status(500).json({ error: "Server error" });
    }
};