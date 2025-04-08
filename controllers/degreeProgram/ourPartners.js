const OurPartners = require("../../models/degreeprogram/OurPartnersModal");
const path = require("path");
const fs = require('fs');

exports.createOurPartners = async (req, res) => {
  try {
      const { companyName,websiteLink,type,service,business_service, degree_program,company } = req.body;


      if (!companyName) {
          return res.status(400).json({ message: [{ key: "error", value: "Required fields" }] });
      }

  const imageFile = req.files.image;
   
           if (imageFile.size > 3 * 1024 * 1024) {
               return res.status(400).json({
                   message: [{ key: "error", value: "Image size exceeds the 3MB limit" }],
               });
           }
   
           const uniqueFileName = `${Date.now()}_${imageFile.name}`;
           const uploadPath = path.join(__dirname, "../../uploads/degreeprogram/ourpartners", uniqueFileName);
   
           await imageFile.mv(uploadPath);
   
      const newOurPartners = new OurPartners({
          companyName,
          websiteLink,
          image: uniqueFileName,
          service,
          business_service,
          degree_program,
          type,
          company
      });

      await newOurPartners.save();

      return res.status(201).json({ message: [{ key: "success", value: "Our Partners added successfully" }] });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};



exports.getAllOurPartners = async (req, res) => {
    try {
      const ourPartners = await OurPartners.find().populate('service').populate('business_service').populate("degree_program").populate('company');
  
      const AllOurPartners = ourPartners.map((partners) => {
        const outPartnersObj = partners.toObject();
        return {
            ...outPartnersObj,
            image: process.env.BACKEND_URL + "/uploads/degreeprogram/ourpartners/" + outPartnersObj.image,
        };
    });


  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Our Partners Retrieved successfully' }],
        our_partners: AllOurPartners,
      });
    } catch (error) {
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };



    exports.getOurPartnersById = async (req, res) => {
      const { id } = req.params;
      try {
        const outPartners = await OurPartners.findById(id).populate('service').populate('business_service').populate("degree_program").populate('company');
        if (!outPartners) {
          return res.status(404).json({ message: [{ key: 'error', value: 'Our Partners not found' }] });
        }
        return res.status(200).json({
          message: [{ key: 'success', value: 'Our Partners Retrieved successfully' }],
          our_PartnersById: {
            ...outPartners.toObject(),
            image: process.env.BACKEND_URL + '/uploads/degreeprogram/ourpartners/' + outPartners.image,
        },
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
      }
    };
  


    exports.updateOurPartners = async (req, res) => {
        const { id } = req.params;
        const { companyName, service, websiteLink,type, business_service, degree_program,company } = req.body;
        const newImageFile = req.files?.image;
    
        try {
            const ourPartner = await OurPartners.findById(id);
    
            if (!ourPartner) {
                return res.status(404).json({
                    message: [{ key: "error", value: "Our Partner not found" }],
                });
            }
    
            // If a new image is provided, handle the file upload and deletion of the old image
            if (newImageFile) {
                const imagePathToDelete = path.join(
                    __dirname,
                    "../../uploads/degreeprogram/ourpartners",
                    ourPartner.image
                );
    
                // Delete the existing image if it exists
                if (fs.existsSync(imagePathToDelete)) {
                    fs.unlink(imagePathToDelete, (err) => {
                        if (err) {
                            console.error("Error deleting image:", err);
                        }
                    });
                }
    
                const uniqueFileName = `${Date.now()}_${newImageFile.name}`;
                const uploadPath = path.join(__dirname, "../../uploads/degreeprogram/ourpartners", uniqueFileName);
    
                await newImageFile.mv(uploadPath);
                ourPartner.image = uniqueFileName; 
            }
    
            // Update other fields
            ourPartner.companyName = companyName || ourPartner.companyName;
            ourPartner.type = type || ourPartner.type;

            ourPartner.websiteLink = websiteLink || ourPartner.websiteLink;
            ourPartner.service = service || ourPartner.service;
            ourPartner.business_service = business_service || ourPartner.business_service;
            ourPartner.degree_program = degree_program || ourPartner.degree_program;
            ourPartner.company = company || ourPartner.company;

            await ourPartner.save();
    
            return res.status(200).json({
                message: [{ key: "success", value: "Our Partner updated successfully" }],
                ourPartner,
            });
        } catch (error) {
            console.error("Error updating Our Partner:", error);
            return res.status(500).json({
                message: [{ key: "error", value: "Internal server error" }],
            });
        }
    };
    
    
    exports.deleteOurPartners = async (req, res) => {
      const { id } = req.params;
    
      try {
          const ourPartner = await OurPartners.findById(id);
          if (!ourPartner) {
              return res.status(404).json({
                  message: [{ key: 'error', value: 'Our Partner not found' }],
              });
          }
    
          // If there's an image, remove it from the filesystem
          if (ourPartner.image) {
              const imagePath = path.join(__dirname, "../../uploads/degreeprogram/ourpartners", ourPartner.image);
              if (fs.existsSync(imagePath) && fs.lstatSync(imagePath).isFile()) {
                  fs.unlinkSync(imagePath);
              }
          }
    
          await OurPartners.findByIdAndDelete(id);
    
          return res.status(200).json({
              message: [{ key: 'success', value: 'Our Partner deleted successfully' }],
          });
      } catch (error) {
          console.error("Error deleting Our Partner:", error);
          return res.status(500).json({
              message: [{ key: 'error', value: 'Internal server error' }],
          });
      }
    };