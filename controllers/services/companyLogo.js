const CompanyLogo = require("../../models/services/CompanyLogoModal");
const path = require("path");
const fs = require('fs');

exports.createCompanyLogo = async (req, res) => {
    try {
        const { name,service ,subtitle} = req.body;
        const existingCompanyLogo = await CompanyLogo.findOne({ name });
        
        if (existingCompanyLogo) {
            return res.status(403).json({ message: [{ key: "error", value: "Company Name already exists" }] });
        }

        if (!name) {
            return res.status(400).json({ message: [{ key: "error", value: "Required fields" }] });
        }

        let imageFile = req.files.image;

        if (!imageFile) {
            return res.status(400).json({ message: [{ key: "error", value: "Company Logo image is required" }] });
        }

        if (imageFile.size > 5 * 1024 * 1024) {
            return res.status(400).json({ message: [{ key: "error", value: "Company Logo image size exceeds the 3MB limit" }] });
        }

        const uniqueFileName = `${Date.now()}_${imageFile.name}`;
        const uploadPath = path.join(__dirname, "../../uploads/services/company_logo", uniqueFileName);

        try {
            await imageFile.mv(uploadPath);

            const newCompanyLogo = new CompanyLogo({
                name,
                image: uniqueFileName,
                service,
                subtitle
            });

            await newCompanyLogo.save();

            return res.status(201).json({ message: [{ key: "Success", value: "Company Logo Added Successfully" }] });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
};



exports.getAllCompanyLogo = async (req, res) => {
    try {
      const companyLogo = await CompanyLogo.find().populate("service");
  
      const companyLogos = companyLogo.map((logo) => {
        return {
          ...logo.toObject(),
          image: logo.image ? process.env.BACKEND_URL + '/uploads/services/company_logo/' + logo.image : null,
        };
      });
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Company Logo Retrieved successfully' }],
        AllCompanyLogos: companyLogos,
      });
    } catch (error) {
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };


  
  exports.getCompanyLogoById = async (req, res) => {
    const { id } = req.params;
    try {
      const companyLogo = await CompanyLogo.findById(id).populate("service");
      if (!companyLogo) {
        return res.status(404).json({ message: [{ key: 'error', value: 'Company Logo not found' }] });
      }
      const imageURL = companyLogo.image ? `${process.env.BACKEND_URL}/uploads/services/company_logo/${companyLogo.image}` : null;
      return res.status(200).json({
        message: [{ key: 'success', value: 'Company Logo Id Based Retrieved successfully' }],
        companyLogoById: {
          ...companyLogo.toObject(),
          image: imageURL,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };


  exports.updateCompanyLogo = async (req, res) => {
    try {
        const logoId = req.params.id;
        const updatedData = req.body;
        const imageFile = req.files ? req.files.image : null;

        const existingCompanyLogo = await CompanyLogo.findById(logoId);

        if (!existingCompanyLogo) {
            return res.status(404).json({
                message: [{ key: 'error', value: 'Company Logo not found' }]
            });
        }

        // Check if the name is being updated and if it already exists in the database
        if (updatedData.name && updatedData.name !== existingCompanyLogo.name) {
            const nameExists = await CompanyLogo.exists({ name: updatedData.name });
            if (nameExists) {
                return res.status(400).json({
                    message: [{ key: 'error', value: 'Company Logo with this name already exists' }]
                });
            }
        }

        if (imageFile) {
            const imagePathToDelete = path.join(
                __dirname,
                '../../uploads/services/company_logo',
                existingCompanyLogo.image
            );
            if (fs.existsSync(imagePathToDelete)) {
                fs.unlink(imagePathToDelete, (err) => {
                    if (err) {
                        console.error('Error deleting image:', err);
                    }
                });
            }

            const uniqueFileName = `${Date.now()}_${imageFile.name}`;
            const uploadPath = path.join(
                __dirname,
                '../../uploads/services/company_logo',
                uniqueFileName
            );
            await imageFile.mv(uploadPath);
            updatedData.image = uniqueFileName;
        }

        const updatedCompanyLogo = await CompanyLogo.findByIdAndUpdate(
            logoId,
            updatedData,
        );

        if (!updatedCompanyLogo) {
            return res.status(404).json({
                message: [{ key: 'error', value: 'Company Logo not found' }]
            });
        }

        return res.status(200).json({
            message: [{ key: 'success', value: 'Company Logo updated successfully' }]        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: [{ key: 'error', value: 'Internal server error' }]
        });
    }
};

exports.deleteCompanyLogo = async (req, res) => {
    const { id } = req.params;
  
    try {
      const companyLogo = await CompanyLogo.findById(id);
      if (!companyLogo) {
        return res.status(404).json({ message: [{ key: 'error', value: 'Company Logo not found' }] });
      }
  
      if (companyLogo.image) {
        const imagePath = path.join(__dirname, '../../uploads/services/company_logo', companyLogo.image);
        fs.unlinkSync(imagePath);
      }
        await CompanyLogo.findByIdAndDelete(id);
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Company Logo deleted successfully' }],
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  