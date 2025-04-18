const Footer = require('../models/FooterModal');
const path = require('path');
const fs = require('fs');


exports.createFooter = async (req, res) => {
    try {
      const {
        socials,
        quickLinks,
        business,
        support,
        contact
      } = req.body;
      
      // Handle logo upload
        if (!req.files || !req.files.logo) {
            return res.status(400).json({
                message: [{ key: "error", value: "Image is required" }],
            });
        }

        const imageFile = req.files.logo;

        if (imageFile.size > 3 * 1024 * 1024) {
            return res.status(400).json({
                message: [{ key: "error", value: "Image size exceeds the 3MB limit" }],
            });
        }

        const uniqueFileName = `${Date.now()}_${imageFile.name}`;
        const uploadPath = path.join(__dirname, "../uploads/footer", uniqueFileName);

        await imageFile.mv(uploadPath);

      
      // Parse JSON strings if they're provided as strings
      const parsedSocials = typeof socials === 'string' ? JSON.parse(socials) : socials;
      const parsedNavigationLinks = typeof quickLinks === 'string' ? JSON.parse(quickLinks) : quickLinks;
      const parsedSupportLink = typeof support === 'string' ? JSON.parse(support) : support;

      const parsedBusiness = typeof business === 'string' ? JSON.parse(business) : business;
      const parsedContact = typeof contact === 'string' ? JSON.parse(contact) : contact;
      
      // Create new footer
      const newFooter = new Footer({
        logo:uniqueFileName,
        socials: parsedSocials || [],
        quickLinks: parsedNavigationLinks || [],
        support: parsedSupportLink || [],
        business: parsedBusiness || {
          title: "Business",
          sections: []
        },
        contact: parsedContact || {
          title: "Contact",
          phone: "",
          address: ""
        },
        lastModifiedBy: req.user ? req.user.username : 'roobankr5@gmail.com'
      });
      
      
      await newFooter.save();
      
      return res.status(201).json({
        success: true,
        message: "Footer created successfully",
        data: newFooter
      });
      
    } catch (error) {
      console.error("Error creating footer:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message
      });
    }
  };


  exports.getAllFooter = async (req, res) => {
      try {
        const footer = await Footer.find();
    
        const allFooter = footer.map((footers) => {
          const footerObj = footers.toObject();
          return {
              ...footerObj,
              logo: process.env.BACKEND_URL + "/uploads/footer/" + footerObj.logo,
          };
      });
    
        return res.status(200).json({
          message: [{ key: 'success', value: 'Footer Retrieved successfully' }],
          getAllFooter: allFooter,
        });
      } catch (error) {
        return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
      }
    };
  


    exports.getFooterById = async (req, res) => {
        try {
          const footer = await Footer.findById(req.params.id);
      
          if (!footer) {
            return res.status(404).json({
              message: [{ key: "error", value: "Footer not found" }],
            });
          }
      
          const footerObj = footer.toObject();
          footerObj.logo = process.env.BACKEND_URL + "/uploads/footer/" + footerObj.logo;
      
          return res.status(200).json({
            message: [{ key: "success", value: "Footer retrieved successfully" }],
            footer: footerObj,
          });
        } catch (error) {
          return res.status(500).json({
            message: [{ key: "error", value: "Internal server error" }],
          });
        }
      };

      exports.updateFooter = async (req, res) => {
        try {
          const {
            socials,
            quickLinks,
            support,
            business,
            contact,
          } = req.body;
      
          const footer = await Footer.findById(req.params.id);
      
          if (!footer) {
            return res.status(404).json({
              message: [{ key: "error", value: "Footer not found" }],
            });
          }
      
          // Handle logo update if new file is uploaded
          if (req.files && req.files.logo) {
            const imageFile = req.files.logo;
      
            if (imageFile.size > 3 * 1024 * 1024) {
              return res.status(400).json({
                message: [{ key: "error", value: "Image size exceeds 3MB limit" }],
              });
            }
      
            const uniqueFileName = `${Date.now()}_${imageFile.name}`;
            const uploadPath = path.join(__dirname, "../uploads/footer", uniqueFileName);
            await imageFile.mv(uploadPath);
      
            // Delete old logo
            if (footer.logo) {
              const oldPath = path.join(__dirname, "../uploads/footer", footer.logo);
              if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
              }
            }
      
            footer.logo = uniqueFileName;
          }
      
          // Parse body fields if they're strings
          const parsedSocials = typeof socials === "string" ? JSON.parse(socials) : socials;
          const parsedQuickLinks = typeof quickLinks === "string" ? JSON.parse(quickLinks) : quickLinks;
          const parsedSupport = typeof support === "string" ? JSON.parse(support) : support;
          const parsedBusiness = typeof business === "string" ? JSON.parse(business) : business;
          const parsedContact = typeof contact === "string" ? JSON.parse(contact) : contact;
      
          footer.socials = parsedSocials || footer.socials;
          footer.quickLinks = parsedQuickLinks || footer.quickLinks;
          footer.support = parsedSupport || footer.support;
          footer.business = parsedBusiness || footer.business;
          footer.contact = parsedContact || footer.contact;
          footer.lastModifiedBy = req.user ? req.user.username : "roobankr5@gmail.com";
          footer.lastModifiedOn = new Date();
      
          await footer.save();
      
          return res.status(200).json({
            success: true,
            message: "Footer updated successfully",
            data: footer,
          });
        } catch (error) {
          console.error("Error updating footer:", error);
          return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
          });
        }
      };
      

      exports.deleteFooter = async (req, res) => {
        try {
          const footer = await Footer.findById(req.params.id);
      
          if (!footer) {
            return res.status(404).json({
              message: [{ key: "error", value: "Footer not found" }],
            });
          }
      
          // Delete logo image from disk
          if (footer.logo) {
            const logoPath = path.join(__dirname, "../uploads/footer", footer.logo);
            if (fs.existsSync(logoPath)) {
              fs.unlinkSync(logoPath);
            }
          }
      
          // Delete footer from DB
          await Footer.findByIdAndDelete(req.params.id);
      
          return res.status(200).json({
            success: true,
            message: "Footer deleted successfully",
          });
        } catch (error) {
          console.error("Error deleting footer:", error);
          return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
          });
        }
      };
      