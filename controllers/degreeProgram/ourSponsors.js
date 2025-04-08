const OurSponsors = require("../../models/degreeprogram/OurSponsorsModal");
const path = require("path");
const fs = require("fs");

exports.createOurSponsors = async (req, res) => {
  try {
    const {
      companyName,
      type,
      category,
      contributions,
      service,
      business_service,
      degree_program,
      company
    } = req.body;

    const logoFile = req.files.logo;

    if (logoFile.size > 3 * 1024 * 1024) {
      return res.status(400).json({
        message: [{ key: "error", value: "Image size exceeds the 3MB limit" }],
      });
    }

    const uniqueFileName = `${Date.now()}_${logoFile.name}`;
    const uploadPath = path.join(
      __dirname,
      "../../uploads/degreeprogram/oursponsors",
      uniqueFileName
    );

    await logoFile.mv(uploadPath);

    const newOurSponsors = new OurSponsors({
      companyName,
      type,
      category,
      contributions:Array.isArray(contributions) ? contributions : JSON.parse(contributions) ,
      logo: uniqueFileName,
      service,
      business_service,
      degree_program,
      company
    });

    await newOurSponsors.save();

    return res
      .status(201)
      .json({
        message: [{ key: "success", value: "Our Sponsors added successfully" }],
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};



exports.getAllOurSponsors = async (req, res) => {
    try {
      const ourSponsors = await OurSponsors.find().populate('service').populate('business_service').populate("degree_program").populate('company');
  
      const allOurSponsors = ourSponsors.map((sponsors) => {
        const ourSponsorsobj = sponsors.toObject();
        return {
            ...ourSponsorsobj,
            logo: process.env.BACKEND_URL + "/uploads/degreeprogram/oursponsors/" + ourSponsorsobj.logo,
        };
    });

  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Our Sponsors Retrieved successfully' }],
        our_sponsors: allOurSponsors,
      });
    } catch (error) {
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };



      exports.getOurSponsorsById = async (req, res) => {
        const { id } = req.params;
        try {
          const ourSponsors = await OurSponsors.findById(id).populate('service').populate('business_service').populate("degree_program").populate('company');
          if (!ourSponsors) {
            return res.status(404).json({ message: [{ key: 'error', value: 'Our Sponosrs not found' }] });
          }
          return res.status(200).json({
            message: [{ key: 'success', value: 'Our Sponosrs Retrieved successfully' }],
            our_SponosorsById: {
              ...ourSponsors.toObject(),
              logo: process.env.BACKEND_URL + '/uploads/degreeprogram/oursponsors/' + ourSponsors.logo,
          },
          });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
        }
      };
  

      exports.updateOurSponsors = async (req, res) => {
        const { id } = req.params;
        const { 
            companyName, 
            type, 
            category, 
            contributions, 
            service, 
            business_service, 
            degree_program,company
        } = req.body;
        const logoFile = req.files?.logo;
      
        try {
            const ourSponsors = await OurSponsors.findById(id);
      
            if (!ourSponsors) {
                return res.status(404).json({
                    message: [{ key: "error", value: "Our Sponsors not found" }],
                });
            }
      
            // If a new logo is provided, handle the file upload and deletion of the old logo
            if (logoFile) {
                // Check file size
                if (logoFile.size > 3 * 1024 * 1024) {
                    return res.status(400).json({
                        message: [{ key: "error", value: "Image size exceeds the 3MB limit" }],
                    });
                }
      
                const logoPathToDelete = path.join(
                    __dirname,
                    "../../uploads/degreeprogram/oursponsors",
                    ourSponsors.logo
                );
      
                // Delete the existing logo if it exists
                if (fs.existsSync(logoPathToDelete)) {
                    fs.unlink(logoPathToDelete, (err) => {
                        if (err) {
                            console.error("Error deleting logo:", err);
                        }
                    });
                }
      
                const uniqueFileName = `${Date.now()}_${logoFile.name}`;
                const uploadPath = path.join(__dirname, "../../uploads/degreeprogram/oursponsors", uniqueFileName);
      
                await logoFile.mv(uploadPath);
                ourSponsors.logo = uniqueFileName; 
            }
      
            // Update other fields
            ourSponsors.companyName = companyName || ourSponsors.companyName;
            ourSponsors.type = type || ourSponsors.type;
            ourSponsors.category = category || ourSponsors.category;
            ourSponsors.contributions = Array.isArray(contributions) ? contributions : JSON.parse(contributions || "[]"); // Ensure contributions is an array
            ourSponsors.service = service || ourSponsors.service;
            ourSponsors.business_service = business_service || ourSponsors.business_service;
            ourSponsors.degree_program = degree_program || ourSponsors.degree_program;
            ourSponsors.company = company || ourSponsors.company;

            await ourSponsors.save();
      
            return res.status(200).json({
                message: [{ key: "success", value: "Our Sponsors updated successfully" }],
                ourSponsors,
            });
        } catch (error) {
            console.error("Error updating Our Sponsors:", error);
            return res.status(500).json({
                message: [{ key: "error", value: "Internal server error" }],
            });
        }
      };
    
    exports.deleteOurSponsors = async (req, res) => {
        const { id } = req.params;
    
        try {
            const ourSponsors = await OurSponsors.findById(id);
            if (!ourSponsors) {
                return res.status(404).json({
                    message: [{ key: 'error', value: 'Our Sponsors not found' }],
                });
            }
    
            // If there's a logo, remove it from the filesystem
            if (ourSponsors.logo) {
                const logoPath = path.join(__dirname, "../../uploads/degreeprogram/oursponsors", ourSponsors.logo);
                if (fs.existsSync(logoPath) && fs.lstatSync(logoPath).isFile()) {
                    fs.unlinkSync(logoPath);
                }
            }
    
            await OurSponsors.findByIdAndDelete(id);
    
            return res.status(200).json({
                message: [{ key: 'success', value: 'Our Sponsors deleted successfully' }],
            });
        } catch (error) {
            console.error("Error deleting Our Sponsors:", error);
            return res.status(500).json({
                message: [{ key: 'error', value: 'Internal server error' }],
            });
        }
    };