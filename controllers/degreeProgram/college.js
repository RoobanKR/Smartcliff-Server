const College = require("../../models/degreeprogram/CollegeModal"); 
const path = require("path");
const fs = require("fs");

exports.createCollege = async (req, res) => {
  try {
    const { 
      slug, 
      collegeName, 
      description, 
      website,
    } = req.body;

    if (!req.files.logo) {
      return res.status(400).json({
        message: [{ key: "error", value: "logo are required" }],
      });
    }

    const logoFile = req.files.logo;

    if (logoFile.size > 3 * 1024 * 1024) {
      return res.status(400).json({
        message: [{ key: "error", value: "Image size exceeds the 3MB limit" }],
      });
    }

    const uniqueLogoFileName = `${Date.now()}_${logoFile.name}`;
    const uploadLogoPath = path.join(__dirname, "../../uploads/degreeprogram/college/logo", uniqueLogoFileName);

    await logoFile.mv(uploadLogoPath);

    const newCollege = new College({
      slug,
      collegeName,
      description,
      logo: uniqueLogoFileName,
      website,
      createdBy: req?.user?.email || "roobankr5@gmail.com",
    });

    await newCollege.save();

    return res.status(201).json({
      message: [{ key: "success", value: "College added successfully" }],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.getAllColleges = async (req, res) => {
  try {
    const colleges = await College.find();

    const allColleges = colleges.map((college) => {
      const collegeObj = college.toObject();
      return {
        ...collegeObj,
        logo: process.env.BACKEND_URL + "/uploads/degreeprogram/college/logo/" + collegeObj.logo,
      };
    });

    return res.status(200).json({
      message: [{ key: 'success', value: 'Colleges retrieved successfully' }],
      colleges: allColleges,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
  }
};

exports.getCollegeById = async (req, res) => {
  try {
    const { id } = req.params;

    const college = await College.findById(id);

    if (!college) {
      return res.status(404).json({ message: [{ key: "error", value: "College not found" }] });
    }

    return res.status(200).json({
      message: [{ key: "success", value: "College retrieved successfully" }],
      college: {
        ...college.toObject(),
        logo: process.env.BACKEND_URL + "/uploads/degreeprogram/college/logo/" + college.logo,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.updateCollege = async (req, res) => {
    try {
      const collegeId = req.params.id;
      const updatedData = req.body;
      const imageFile = req.files ? req.files.image : null;
      const logoFile = req.files ? req.files.logo : null;
  
      const existingCollege = await College.findById(collegeId);
  
      if (!existingCollege) {
        return res.status(404).json({
          message: [{ key: "error", value: "College not found" }],
        });
      }
  
      // Handle flattened fields
      if (updatedData.slug) existingCollege.slug = updatedData.slug;
      if (updatedData.collegeName) existingCollege.collegeName = updatedData.collegeName;
      if (updatedData.description) existingCollege.description = updatedData.description;
      if (updatedData.location) existingCollege.location = updatedData.location;
      if (updatedData.address) existingCollege.address = updatedData.address;
      if (updatedData.phone) existingCollege.phone = updatedData.phone;
      if (updatedData.email) existingCollege.email = updatedData.email;
      if (updatedData.website) existingCollege.website = updatedData.website;
  
  
      if (logoFile) {
        // Delete the old logo
        const logoPathToDelete = path.join(
          __dirname,
          "../../uploads/degreeprogram/college/logo",
          existingCollege.logo
        );
        if (fs.existsSync(logoPathToDelete)) {
          fs.unlink(logoPathToDelete, (err) => {
            if (err) {
              console.error("Error deleting logo:", err);
            }
          });
        }
  
        // Upload the new logo
        const uniqueLogoFileName = `${Date.now()}_${logoFile.name}`;
        const uploadLogoPath = path.join(
          __dirname,
          "../../uploads/degreeprogram/college/logo",
          uniqueLogoFileName
        );
        await logoFile.mv(uploadLogoPath);
        existingCollege.logo = uniqueLogoFileName;
      }
  
      await existingCollege.save();
  
      return res.status(200).json({
        message: [{ key: "success", value: "College updated successfully" }],
        updatedCollege: existingCollege,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: [{ key: "error", value: "Internal server error" }],
      });
    }
  };
exports.deleteCollege = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCollege = await College.findByIdAndRemove(id);

    if (!deletedCollege) {
      return res.status(404).json({
        message: [{ key: "error", value: "College not found" }],
      });
    }

    if (deletedCollege.logo) {
      const logoPath = path.join(
        __dirname,
        "../../uploads/degreeprogram/college/logo",
        deletedCollege.logo
      );
      if (fs.existsSync(logoPath) && fs.lstatSync(logoPath).isFile()) {
        fs.unlinkSync(logoPath);
      }
    }

    return res.status(200).json({
      message: [{ key: "success", value: "College deleted successfully" }],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};