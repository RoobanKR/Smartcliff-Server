const Address = require("../models/AddressModal"); 
const path = require("path");
const fs = require('fs');

exports.createAddress = async (req, res) => {
  try {
    const {street,address,city } = req.body;
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


    const newAddress = new Address({
        street,address,city, 
        image: uniqueFileName,

      createdBy: req?.user?.email || "roobankr5@gmail.com",
    });

    await newAddress.save();

    return res.status(201).json({
      message: [
        { key: "Success", value: "Address added successfully" },
      ],
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};


exports.getAllAddress= async (req, res) => {
  try {
    const address = await Address.find();

    const allContactPages = address.map((addressPage) => {
        const contactObj = addressPage.toObject();
        return {
          ...contactObj,
          image: process.env.BACKEND_URL + "/uploads/contact/" + contactObj.image,
        };
      });
  

    return res.status(200).json({
      message: [{ key: 'success', value: 'Address retrieved successfully' }],
      address: allContactPages,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      message: [{ key: 'error', value: 'Internal server error' }] 
    });
  }
};


exports.getAddressById = async (req, res) => {
  const { id } = req.params;
  try {
    const addressPage = await Address.findById(id);
    if (!addressPage) {
      return res.status(404).json({ 
        message: [{ key: 'error', value: 'address Page not found' }] 
      });
    }
    
    return res.status(200).json({
      message: [{ key: 'success', value: 'Address Page Retrieved successfully' }],
      addressById: {
        ...addressPage.toObject(),
        image: process.env.BACKEND_URL + '/uploads/contact/' + addressPage.image,
      },
    });
  } catch (error) {
    console.error("Error getting contact page by ID:", error);
    return res.status(500).json({ 
      message: [{ key: 'error', value: 'Internal server error' }] 
    });
  }
};





exports.updateAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const updatedData = req.body;
    const imageFile = req.files ? req.files.image : null;

    const existingAddress = await Address.findById(addressId);

    if (!existingAddress) {
      return res.status(404).json({
        message: [{ key: 'error', value: 'Address not found' }]
      });
    }

    if (imageFile) {
      const imagePathToDelete = path.join(
        __dirname,
        "../uploads/contact",
        existingAddress.image
      );
      
      if (fs.existsSync(imagePathToDelete)) {
        fs.unlink(imagePathToDelete, (err) => {
          if (err) {
            console.error("Error deleting image:", err);
          }
        });
      }

      const uniqueFileName = `${Date.now()}_${imageFile.name}`;
      const uploadPath = path.join(
        __dirname,
        "../uploads/contact",
        uniqueFileName
      );
      await imageFile.mv(uploadPath);
      updatedData.image = uniqueFileName;
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      updatedData,
      { new: true }
    );

    return res.status(200).json({
      message: [{ key: 'success', value: 'Address updated successfully' }],
    });
  } catch (error) {
    console.error("Error updating address:", error);
    return res.status(500).json({
      message: [{ key: 'error', value: 'Internal server error' }]
    });
  }
};

exports.deleteAddress = async (req, res) => {
  const { id } = req.params;

  try {
    const address = await Address.findById(id);
    if (!address) {
      return res.status(404).json({ 
        message: [{ key: 'error', value: 'Address not found' }] 
      });
    }

    if (address.image) {
      const imagePath = path.join(__dirname, "../uploads/contact", address.image);
      if (fs.existsSync(imagePath) && fs.lstatSync(imagePath).isFile()) {
        fs.unlinkSync(imagePath);
      }
    }

    await Address.findByIdAndDelete(id);

    return res.status(200).json({
      message: [{ key: 'success', value: 'Address deleted successfully' }],
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    return res.status(500).json({ 
      message: [{ key: 'error', value: 'Internal server error' }] 
    });
  }
};
