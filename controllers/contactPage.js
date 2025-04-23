const ContactPage = require("../models/contactPage");
const path = require("path");
const fs = require('fs');

exports.createContactPage = async (req, res) => {
  try {
    const { contact } = req.body;

    if (!contact) {
      return res.status(400).json({
        message: [{ key: "error", value: "Required field: contact is missing" }],
      });
    }

    if (!req.files || !req.files.image) {
      return res.status(400).json({
        message: [{ key: "error", value: "Image is required" }],
      });
    }

    const imageFile = req.files.image;

    if (imageFile.size > 3 * 1024 * 1024) {
      return res.status(400).json({
        message: [{ key: "error", value: "Image size exceeds the 3MB limit" }],
      });
    }

    const uniqueFileName = `${Date.now()}_${imageFile.name}`;
    const uploadPath = path.join(__dirname, "../uploads/contact", uniqueFileName);

    await imageFile.mv(uploadPath);

    const newContactPage = new ContactPage({
      contact,
      image: uniqueFileName,
    });

    await newContactPage.save();

    return res.status(201).json({
      message: [{ key: "success", value: "Contact Page Added Successfully" }],
    });
  } catch (error) {
    console.error("Error creating contact page:", error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};

exports.getAllContactPages = async (req, res) => {
  try {
    const contactPages = await ContactPage.find();

    const allContactPages = contactPages.map((contactPage) => {
      const contactObj = contactPage.toObject();
      return {
        ...contactObj,
        image: process.env.BACKEND_URL + "/uploads/contact/" + contactObj.image,
      };
    });

    return res.status(200).json({
      message: [{ key: 'success', value: 'Contact Pages Retrieved successfully' }],
      getAllContactPages: allContactPages,
    });
  } catch (error) {
    console.error("Error getting all contact pages:", error);
    return res.status(500).json({ 
      message: [{ key: 'error', value: 'Internal server error' }] 
    });
  }
};

exports.getContactPageById = async (req, res) => {
  const { id } = req.params;
  try {
    const contactPage = await ContactPage.findById(id);
    if (!contactPage) {
      return res.status(404).json({ 
        message: [{ key: 'error', value: 'Contact Page not found' }] 
      });
    }
    
    return res.status(200).json({
      message: [{ key: 'success', value: 'Contact Page Retrieved successfully' }],
      contactPageById: {
        ...contactPage.toObject(),
        image: process.env.BACKEND_URL + '/uploads/contact/' + contactPage.image,
      },
    });
  } catch (error) {
    console.error("Error getting contact page by ID:", error);
    return res.status(500).json({ 
      message: [{ key: 'error', value: 'Internal server error' }] 
    });
  }
};

exports.updateContactPage = async (req, res) => {
  try {
    const contactId = req.params.id;
    const updatedData = req.body;
    const imageFile = req.files ? req.files.image : null;

    const existingContactPage = await ContactPage.findById(contactId);

    if (!existingContactPage) {
      return res.status(404).json({
        message: [{ key: 'error', value: 'Contact Page not found' }]
      });
    }

    if (imageFile) {
      // Delete old image if it exists
      const imagePathToDelete = path.join(
        __dirname,
        "../uploads/contact",
        existingContactPage.image
      );
      
      if (fs.existsSync(imagePathToDelete)) {
        fs.unlink(imagePathToDelete, (err) => {
          if (err) {
            console.error("Error deleting image:", err);
          }
        });
      }

      // Upload new image
      const uniqueFileName = `${Date.now()}_${imageFile.name}`;
      const uploadPath = path.join(
        __dirname,
        "../uploads/contact",
        uniqueFileName
      );
      await imageFile.mv(uploadPath);
      updatedData.image = uniqueFileName;
    }

    const updatedContactPage = await ContactPage.findByIdAndUpdate(
      contactId,
      updatedData,
      { new: true }
    );

    return res.status(200).json({
      message: [{ key: 'success', value: 'Contact Page updated successfully' }]
    });
  } catch (error) {
    console.error("Error updating contact page:", error);
    return res.status(500).json({
      message: [{ key: 'error', value: 'Internal server error' }]
    });
  }
};

exports.deleteContactPage = async (req, res) => {
  const { id } = req.params;

  try {
    const contactPage = await ContactPage.findById(id);
    if (!contactPage) {
      return res.status(404).json({ 
        message: [{ key: 'error', value: 'Contact Page not found' }] 
      });
    }

    // Delete image file
    if (contactPage.image) {
      const imagePath = path.join(__dirname, "../uploads/contact", contactPage.image);
      if (fs.existsSync(imagePath) && fs.lstatSync(imagePath).isFile()) {
        fs.unlinkSync(imagePath);
      }
    }

    await ContactPage.findByIdAndDelete(id);

    return res.status(200).json({
      message: [{ key: 'success', value: 'Contact Page deleted successfully' }],
    });
  } catch (error) {
    console.error("Error deleting contact page:", error);
    return res.status(500).json({ 
      message: [{ key: 'error', value: 'Internal server error' }] 
    });
  }
};