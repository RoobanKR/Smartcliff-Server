const Company = require("../../models/degreeprogram/CompanyModal"); 
const path = require("path");
const fs = require("fs");


exports.createCompany = async (req, res) => {
  try {
    const { 
      companyName, 
      description, 
      website,
      year,
      service, business_service,
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
    const uploadLogoPath = path.join(__dirname, "../../uploads/degreeprogram/company/logo", uniqueLogoFileName);

    await logoFile.mv(uploadLogoPath);

    const newCompany = new Company({
      companyName,
      description,
      logo: uniqueLogoFileName,
      website,
      year,
      service, business_service,
      createdBy: req?.user?.email || "roobankr5@gmail.com",
    });

    await newCompany.save();

    return res.status(201).json({
      message: [{ key: "success", value: "Company added successfully" }],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};



exports.getAllCompany = async (req, res) => {
  try {
    const companys = await Company.find().populate('service').populate('business_service');

    const allCompany = companys.map((company) => {
      const companyObj = company.toObject();
      return {
        ...companyObj,
        logo: process.env.BACKEND_URL + "/uploads/degreeprogram/company/logo/" + companyObj.logo,
      };
    });

    return res.status(200).json({
      message: [{ key: 'success', value: 'Company retrieved successfully' }],
      companys: allCompany,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
  }
};



exports.getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findById(id).populate('service').populate('business_service');

    if (!company) {
      return res.status(404).json({ message: [{ key: "error", value: "Company not found" }] });
    }

    return res.status(200).json({
      message: [{ key: "success", value: "Company retrieved successfully" }],
      companyById: {
        ...company.toObject(),
        logo: process.env.BACKEND_URL + "/uploads/degreeprogram/company/logo/" + company.logo,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};



exports.updateCompany = async (req, res) => {
    try {
      const companyId = req.params.id;
      const updatedData = req.body;
      const logoFile = req.files ? req.files.logo : null;
  
      const existingCompany = await Company.findById(companyId);
  
      if (!existingCompany) {
        return res.status(404).json({
          message: [{ key: "error", value: "Company not found" }],
        });
      }
  
      // Update fields
      if (updatedData.companyName) existingCompany.companyName = updatedData.companyName;
      if (updatedData.description) existingCompany.description = updatedData.description;
      if (updatedData.website) existingCompany.website = updatedData.website;
      if (updatedData.year) existingCompany.year = updatedData.year;
      if (updatedData.service) existingCompany.service = updatedData.service;
      if (updatedData.business_service) existingCompany.business_service = updatedData.business_service;

      if (logoFile) {
        // Delete the old logo
        const logoPathToDelete = path.join(
          __dirname,
          "../../uploads/degreeprogram/company/logo",
          existingCompany.logo
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
          "../../uploads/degreeprogram/company/logo",
          uniqueLogoFileName
        );
        await logoFile.mv(uploadLogoPath);
        existingCompany.logo = uniqueLogoFileName;
      }
  
      await existingCompany.save();
  
      return res.status(200).json({
        message: [{ key: "success", value: "Company updated successfully" }],
        updatedCompany: existingCompany,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: [{ key: "error", value: "Internal server error" }],
      });
    }
  };



  exports.deleteCompany = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedCompany = await Company.findByIdAndRemove(id);
  
      if (!deletedCompany) {
        return res.status(404).json({
          message: [{ key: "error", value: "Company not found" }],
        });
      }
  
      if (deletedCompany.logo) {
        const logoPath = path.join(
          __dirname,
          "../../uploads/degreeprogram/company/logo",
          deletedCompany.logo
        );
        if (fs.existsSync(logoPath) && fs.lstatSync(logoPath).isFile()) {
          fs.unlinkSync(logoPath);
        }
      }
  
      return res.status(200).json({
        message: [{ key: "success", value: "Company deleted successfully" }],
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: [{ key: "error", value: "Internal server error" }],
      });
    }
  };