const ProgramApply = require("../../models/degreeprogram/ApplyProgramModal");
const otpGenerator = require("otp-generator");
const emailUtil = require("../../utils/sendEmail");
const path = require("path"); 
const { sendEmail } = require("../../utils/sendEmail"); 
const config = require("config");
const LmsUserModal = require("../../models/LmsUserModal");
const emailConfig = config.get("emailConfig");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 

// Temporary storage for OTPs
const otpStorage = {};
const formStorage = {};

exports.createProgramApply = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      dob,
      gender,
      college,
      degree,
      degreeProgram,
      Tid,
    } = req.body;

    const otp = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
    });

    const formData = {
      name,
      email,
      phone,
      address,
      dob,
      gender,
      college,
      degree,
      degreeProgram,
      Tid,
    };
    formStorage[email] = formData;
    otpStorage[email] = otp;

    if (!req.files || !req.files.image) {
      return res.status(400).json({
        message: [{ key: "error", value: "Image file is required" }],
      });
    }

    const imageFile = req.files.image;

    if (imageFile.size > 3 * 1024 * 1024) {
      return res.status(400).json({
        message: [{ key: "error", value: "Image size exceeds the 3MB limit" }],
      });
    }

    const uniqueFileName = `${Date.now()}_${imageFile.name}`;
    const uploadPath = path.join(
      __dirname,
      "../../uploads/program_apply",
      uniqueFileName
    );

    try {
      await imageFile.mv(uploadPath); 

      formData.image = uniqueFileName; 

      const emailSubject = "Your OTP for Verification";
      const emailBody = `
        <p><strong>Welcome to SmartCliff</strong></p>
        <p>Your OTP for verification is: ${otp}</p>
      `;

      const emailSent = await emailUtil.sendEmail(
        email,
        emailSubject,
        emailBody
      );

      if (emailSent) {
        return res.status(200).json({
          message: [{ key: "success", value: "OTP sent successfully" }],
        });
      } else {
        return res.status(500).json({
          message: [{ key: "error", value: "Couldn't send OTP" }],
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: [{ key: "error", value: "Failed to upload image" }],
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal Server Error" }],
    });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { otp, email } = req.body;

    const storedOTP = otpStorage[email];
    if (!storedOTP) {
      return res.status(400).json({
        message: [{ key: "error", value: "OTP not found or expired" }],
      });
    }

    if (otp !== storedOTP) {
      return res
        .status(400)
        .json({ message: [{ key: "error", value: "Invalid OTP" }] });
    }

    const formData = formStorage[email];

    const newProgramApply = new ProgramApply(formData);
    await newProgramApply.save();

    delete formStorage[email];
    delete otpStorage[email];

    const receiverEmail = email;
    const senderEmail = emailConfig.user;

    const emailSubject = "Thank You for Applying";
    const emailBody =
      `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
      <html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">
          <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
            <!--[if !mso]><!-->
            <meta http-equiv="X-UA-Compatible" content="IE=Edge">
            <!--<![endif]-->
            <!--[if (gte mso 9)|(IE)]>
            <xml>
              <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
            </xml>
            <![endif]-->
            <!--[if (gte mso 9)|(IE)]>
        <style type="text/css">
          body {width: 600px;margin: 0 auto;}
          table {border-collapse: collapse;}
          table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
          img {-ms-interpolation-mode: bicubic;}
        </style>
      <![endif]-->
            <style type="text/css">
          body, p, div {
            font-family: inherit;
            font-size: 14px;
          }
          body {
            color: #000000;
          }
          body a {
            color: #1188E6;
            text-decoration: none;
          }
          p { margin: 0; padding: 0; }
          table.wrapper {
            width:100% !important;
            table-layout: fixed;
            -webkit-font-smoothing: antialiased;
            -webkit-text-size-adjust: 100%;
            -moz-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }
          img.max-width {
            max-width: 100% !important;
          }
          .column.of-2 {
            width: 50%;
          }
          .column.of-3 {
            width: 33.333%;
          }
          .column.of-4 {
            width: 25%;
          }
          ul ul ul ul  {
            list-style-type: disc !important;
          }
          ol ol {
            list-style-type: lower-roman !important;
          }
          ol ol ol {
            list-style-type: lower-latin !important;
          }
          ol ol ol ol {
            list-style-type: decimal !important;
          }
          @media screen and (max-width:480px) {
            .preheader .rightColumnContent,
            .footer .rightColumnContent {
              text-align: left !important;
            }
            .preheader .rightColumnContent div,
            .preheader .rightColumnContent span,
            .footer .rightColumnContent div,
            .footer .rightColumnContent span {
              text-align: left !important;
            }
            .preheader .rightColumnContent,
            .preheader .leftColumnContent {
              font-size: 80% !important;
              padding: 5px 0;
            }
            table.wrapper-mobile {
              width: 100% !important;
              table-layout: fixed;
            }
            img.max-width {
              height: auto !important;
              max-width: 100% !important;
            }
            a.bulletproof-button {
              display: block !important;
              width: auto !important;
              font-size: 80%;
              padding-left: 0 !important;
              padding-right: 0 !important;
            }
            .columns {
              width: 100% !important;
            }
            .column {
              display: block !important;
              width: 100% !important;
              padding-left: 0 !important;
              padding-right: 0 !important;
              margin-left: 0 !important;
              margin-right: 0 !important;
            }
            .social-icon-column {
              display: inline-block !important;
            }
          }
        </style>
            <!--user entered Head Start--><link href="https://fonts.googleapis.com/css?family=Muli&display=swap" rel="stylesheet"><style>
      body {font-family: 'Muli', sans-serif;}
      </style><!--End Head user entered-->
          </head>
          <body>
            <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size:14px; font-family:inherit; color:#000000; background-color:#FFFFFF;">
              <div class="webkit">
                <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#FFFFFF">
                  <tr>
                    <td valign="top" bgcolor="#FFFFFF" width="100%">
                      <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td width="100%">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td>
                                  <!--[if mso]>
          <center>
          <table><tr><td width="600">
        <![endif]-->
                                          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
                                            <tr>
                                              <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#FFFFFF" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
          <tr>
            <td role="module-content">
              <p></p>
            </td>
          </tr>
        </table><table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:30px 20px 30px 20px;" bgcolor="#f6f6f6" data-distribution="1">
          <tbody>
            <tr role="module-content">
              <td height="100%" valign="top"><table width="540" style="width:540px; border-spacing:0; border-collapse:collapse; margin:0px 10px 0px 10px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="" class="column column-0">
            <tbody>
              <tr>
                <td style="padding:0px;margin:0px;border-spacing:0;"><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="72aac1ba-9036-4a77-b9d5-9a60d9b05cba">
         
        </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="331cde94-eb45-45dc-8852-b7dbeb9101d7">
          <tbody>
            <tr>
              <td style="padding:0px 0px 20px 0px;" role="module-content" bgcolor="">
              </td>
            </tr>
          </tbody>
        </table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="d8508015-a2cb-488c-9877-d46adf313282">
      
        </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="27716fe9-ee64-4a64-94f9-a4f28bc172a0">
          <tbody>
            <tr>
              <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor="">
              </td>
            </tr>
          </tbody>
        </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="948e3f3f-5214-4721-a90e-625a47b1c957" data-mc-module-version="2019-10-22">
          <tbody>
            <tr>
              <td style="padding:50px 30px 18px 30px; line-height:36px; text-align:inherit; background-color:#ffffff;" height="100%" valign="top" bgcolor="#ffffff" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="font-size: 43px">Thanks for Register, ${formData.name}!</span></div><div></div></div></td>
            </tr>
          </tbody>
        </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="a10dcb57-ad22-4f4d-b765-1d427dfddb4e" data-mc-module-version="2019-10-22">
          <tbody>
            <tr>
              <td style="padding:18px 30px 18px 30px; line-height:22px; text-align:inherit; background-color:#ffffff;" height="100%" valign="top" bgcolor="#ffffff" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="font-size: 18px">Please verify your email address to</span><span style="color: #000000; font-size: 18px; font-family: arial, helvetica, sans-serif"> get access to thousands of exclusive job listings</span><span style="font-size: 18px">.</span></div>
      <div style="font-family: inherit; text-align: center"><span style="color: #ffbe00; font-size: 18px"><strong>Thank you!</strong></span></div><div></div></div></td>
            </tr>
          </tbody>
        </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="7770fdab-634a-4f62-a277-1c66b2646d8d">
          <tbody>
            <tr>
              <td style="padding:0px 0px 20px 0px;" role="module-content" bgcolor="#ffffff">
              </td>
            </tr>
          </tbody>
        </table><table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="d050540f-4672-4f31-80d9-b395dc08abe1">
            <tbody>
              <tr>
                <td align="center" bgcolor="#ffffff" class="outer-td" style="padding:0px 0px 0px 0px; background-color:#ffffff;">
                  <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
                    <tbody>
                      <tr>
                      <td align="center" bgcolor="#ffbe00" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;">
                        <a href="${BASE_URL}/" style="background-color:#ffbe00; border:1px solid #ffbe00; border-color:#ffbe00; border-radius:0px; border-width:1px; color:#000000; display:inline-block; font-size:14px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:12px 40px 12px 40px; text-align:center; text-decoration:none; border-style:solid; font-family:inherit;" target="_blank">Click Here</a>
                      </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="7770fdab-634a-4f62-a277-1c66b2646d8d.1">
          <tbody>
            <tr>
              <td style="padding:0px 0px 50px 0px;" role="module-content" bgcolor="#ffffff">
              </td>
            </tr>
          </tbody>
        </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="a265ebb9-ab9c-43e8-9009-54d6151b1600" data-mc-module-version="2019-10-22">
          <tbody>
            <tr>
              <td style="padding:50px 30px 50px 30px; line-height:22px; text-align:inherit; background-color:#6e6e6e;" height="100%" valign="top" bgcolor="#6e6e6e" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="color: #ffffff; font-size: 18px"><strong>Here’s what happens next:</strong></span></div>
      <div style="font-family: inherit; text-align: center"><br></div>
      <div style="font-family: inherit; text-align: center"><span style="color: #ffffff; font-size: 18px">1. Upload your resume and we'll keep it on file for every job submission.</span></div>
      <div style="font-family: inherit; text-align: center"><br></div>
      <div style="font-family: inherit; text-align: center"><span style="color: #ffffff; font-size: 18px">2. Submit and edit personalized cover letters for every job you apply to.</span></div>
      <div style="font-family: inherit; text-align: center"><br></div>
      <div style="font-family: inherit; text-align: center"><span style="color: #ffbe00; font-size: 18px"><strong>+ much more!</strong></span></div>
      <div style="font-family: inherit; text-align: center"><br></div>
      <div style="font-family: inherit; text-align: center"><span style="color: #ffffff; font-size: 18px">Need support? Our support team is always</span></div>
      <div style="font-family: inherit; text-align: center"><span style="color: #ffffff; font-size: 18px">ready to help!</span></div><div></div></div></td>
            </tr>
          </tbody>
        </table><table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="d050540f-4672-4f31-80d9-b395dc08abe1.1">
            <tbody>
              <tr>
                <td align="center" bgcolor="#6e6e6e" class="outer-td" style="padding:0px 0px 0px 0px; background-color:#6e6e6e;">
                  <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
                    <tbody>
                      <tr>
                      <td align="center" bgcolor="#ffbe00" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;">
                        <a href="${BASE_URL}/contact" style="background-color:#ffbe00; border:1px solid #ffbe00; border-color:#ffbe00; border-radius:0px; border-width:1px; color:#000000; display:inline-block; font-size:14px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:12px 40px 12px 40px; text-align:center; text-decoration:none; border-style:solid; font-family:inherit;" target="_blank">Contact Support</a>
                      </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="c37cc5b7-79f4-4ac8-b825-9645974c984e">
          <tbody>
            <tr>
              <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor="6E6E6E">
              </td>
            </tr>
          </tbody>
        </table></td>
              </tr>
            </tbody>
          </table></td>
            </tr>
          </tbody>
            <tbody>
              <tr>
                <td align="center" bgcolor="" class="outer-td" style="padding:0px 0px 20px 0px;">
                  <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
                    <tbody>
                      <tr>
                      <td align="center" bgcolor="#f5f8fd" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;"><a href="https://sendgrid.com/" style="background-color:#f5f8fd; border:1px solid #f5f8fd; border-color:#f5f8fd; border-radius:25px; border-width:1px; color:#a8b9d5; display:inline-block; font-size:10px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:5px 18px 5px 18px; text-align:center; text-decoration:none; border-style:solid; font-family:helvetica,sans-serif;" target="_blank">♥ POWERED BY ROOBAN K</a></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table></td>
                                            </tr>
                                          </table>
                                          <!--[if mso]>
                                        </td>
                                      </tr>
                                    </table>
                                  </center>
                                  <![endif]-->
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>
            </center>
          </body>
        </html>`;
//admin mail
    await sendEmail(receiverEmail, emailSubject, emailBody);
    const senderSubject = `Welcome SmartCliff`;
    const senderBody = `
    <h1>Thank you for applying to our program!</h1>
    <p>Your application details:</p>
    <ul>
      <li>Name: ${formData.name}</li>
      <li>Email: ${formData.email}</li>
      <li>Phone: ${formData.phone}</li>
      <li>Address: ${formData.address}</li>
      <li>Date of Birth: ${formData.dob}</li>
      <li>Gender: ${formData.gender}</li>
      <li>College: ${formData.college}</li>
      <li>Degree: ${formData.degree}</li>
      <li>Degree Program: ${formData.degreeProgram}</li>
      <li>Transaction ID: ${formData.Tid}</li>
    </ul>
    <p>We will review your application and get back to you soon.</p>`;
    const senderEmailSent = await sendEmail(
      senderEmail,
      senderSubject,
      senderBody
    );

    return res.status(201).json({
      message: [{ key: "Success", value: "Student data saved successfully" }],
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal Server Error" }] });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const formData = formStorage[email];
    if (!formData) {
      return res.status(400).json({
        message: [{ key: "error", value: "No form data found for this email" }],
      });
    }

    const newOTP = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
    });

    otpStorage[email] = newOTP;

    const emailSubject = "Your New OTP for Verification";
    const emailBody = `
      <p><strong>Welcome to SmartCliff</strong></p>
      <p>Your new OTP for verification is: ${newOTP}</p>
    `;

    const emailSent = await emailUtil.sendEmail(email, emailSubject, emailBody);

    if (emailSent) {
      return res.status(200).json({
        message: [{ key: "success", value: "New OTP sent successfully" }],
      });
    } else {
      return res.status(500).json({
        message: [{ key: "error", value: "Couldn't send new OTP" }],
      });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal Server Error" }] });
  }
};

exports.getAllProgramApplications = async (req, res) => {
  try {
    const programApplications = await ProgramApply.find();

    // Map program applications to include image URLs
    const programApplicationsWithImageUrls = programApplications.map((application) => {
      const { image, ...otherFields } = application.toObject();
      const imageUrl = image ? process.env.BACKEND_URL + '/uploads/program_apply/' + image : null;
      return { ...otherFields, image: imageUrl };
    });

    return res.status(200).json({
      message: [{ key: 'success', value: 'Program Applications Retrieved successfully' }],
      programApplications: programApplicationsWithImageUrls,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
  }
};
const getProgramApplyById = async (id) => {
  const programData = await ProgramApply.findById(id);
  if (programData) {
    return programData;
  } else {
    throw new Error('Program application not found');
  }
};

exports.sendProgramApplyEmail = async (req, res) => {
  try {
    const { id } = req.params;

    const programData = await getProgramApplyById(id);

    const fixedPassword = 'Welcome@123';
    // const hashedPassword = await bcrypt.hash(fixedPassword, 12);
    // console.log('Hashed Password:', hashedPassword);
    const newApplicant = new LmsUserModal({
      name: programData.name,
      email: programData.email,
      phone: programData.phone,
      address: programData.address,
      dob: programData.dob,
      gender: programData.gender,
      college: programData.college,
      degree: programData.degree,
      degreeProgram: programData.degreeProgram,
      transactionId: programData.Tid,
      password: fixedPassword, 
    });
    await newApplicant.save();
    const emailSubject = "Program Application Confirmation";
    const emailBody = `
      <h1>Thank you for applying to our program!</h1>
      <p>Your application details:</p>
      <ul>
        <li>Name: ${programData.name}</li>
        <li>Email: ${programData.email}</li>
        <li>Phone: ${programData.phone}</li>
        <li>Address: ${programData.address}</li>
        <li>Date of Birth: ${programData.dob}</li>
        <li>Gender: ${programData.gender}</li>
        <li>College: ${programData.college}</li>
        <li>Degree: ${programData.degree}</li>
        <li>Degree Program: ${programData.degreeProgram}</li>
        <li>Transaction ID: ${programData.Tid}</li>
        <li>Password: ${fixedPassword}</li>
      </ul>
      <p>We will review your application and get back to you soon.</p>
    `;

    const emailSent = await sendEmail(programData.email, emailSubject, emailBody);

    if (emailSent) {
      return res.status(200).json({
        message: [{ key: "success", value: "Program application email sent successfully" }],
      });
    } else {
      return res.status(500).json({
        message: [{ key: "error", value: "Couldn't send program application email" }],
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: [{ key: "error", value: "Internal Server Error" }] });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;


    const user = await LmsUserModal.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('Hashed Password in DB:', user.password); 

    const auth = await bcrypt.compare(password, user.password);

    if (!auth) {
      return res.status(400).json({
        message: [{ key: "error", value: "Incorrect password or email" }],
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({
      message: [{ key: "success", value: "Lms User signed in successfully" }],
      token: token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.updateProgramApplication = async (req, res) => {
  try {
    // Extract program application ID from request parameters
    const { id } = req.params;

    // Extract updated data from request body
    const { name, email, phone, address, dob, gender, college, degree, degreeProgram, Tid, status } = req.body;

    // Find the program application by ID and update it
    const updatedProgramApplication = await ProgramApply.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        address,
        dob,
        gender,
        college,
        degree,
        degreeProgram,
        Tid,
        status
      },
      { new: true } // Return the updated document
    );

    // Check if program application exists
    if (!updatedProgramApplication) {
      return res.status(404).json({ message: 'Program application not found' });
    }

    // Send response with updated program application data
    return res.status(200).json({
      message: 'Program application updated successfully',
      programApplication: updatedProgramApplication
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


exports.deleteProgramApplicationById = async (req, res) => {
  try {
    // Extract program application ID from request parameters
    const { id } = req.params;

    // Find the program application by ID and delete it
    const deletedProgramApplication = await ProgramApply.findByIdAndDelete(id);

    // Check if program application was found and deleted
    if (!deletedProgramApplication) {
      return res.status(404).json({ message: 'Program application not found' });
    }

    return res.status(200).json({ message: 'Program application deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};