const ServiceAbout = require("../../models/services/AboutModal");
const path = require("path")
const fs = require('fs');

exports.createServiceAbout = async (req, res) => {
    try {
      const { heading, subHeading, feature, business_service, service } = req.body;
  
      const existingAbout = await ServiceAbout.findOne({ heading, service });
      if (existingAbout) {
        return res.status(403).json({ message: [{ key: "error", value: "Service About already exists" }] });
      }
  
      let parsedFeatures = [];
      if (feature) {
        try {
          parsedFeatures = JSON.parse(feature);
        } catch (error) {
          return res.status(400).json({ message: [{ key: "error", value: "Invalid feature format" }] });
        }
      }
  
      let formattedFeatures = parsedFeatures.map((f, index) => {
        let featureIcon = null;
        
        if (req.files && req.files[`icon_${index}`]) {
          const iconFile = req.files[`icon_${index}`];
          featureIcon = `${Date.now()}_${iconFile.name}`;
          const iconPath = path.join(__dirname, "../../uploads/services/about/icon", featureIcon);
          
          try {
            iconFile.mv(iconPath);
          } catch (err) {
            console.error("Error saving icon:", err);
            return res.status(500).json({ message: [{ key: "error", value: "Failed to upload feature icon" }] });
          }
        }
        
        return { ...f, icon: featureIcon };
      });
  
      let uploadedImages = [];
      if (req.files?.images) {
        const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
        for (const imageFile of imageFiles) {
          if (imageFile.size > 3 * 1024 * 1024) {
            return res.status(400).json({ message: [{ key: "error", value: "One of the images exceeds the 3MB limit" }] });
          }
          const uniqueImageName = `${Date.now()}_${imageFile.name}`;
          const uploadPath = path.join(__dirname, "../../uploads/services/about/images", uniqueImageName);
          await imageFile.mv(uploadPath);
          uploadedImages.push(uniqueImageName);
        }
      }
  
      const newServiceAbout = new ServiceAbout({
        heading,
        subHeading,
        feature: formattedFeatures,
        images: uploadedImages,
        business_service,
        service,
        createdBy: req.user.email,
        createdAt: new Date(),
      });
  
      await newServiceAbout.save();
      return res.status(201).json({ message: [{ key: "Success", value: "Service About Added Successfully" }] });
  
    } catch (error) {
      console.error("Error creating service about:", error);
      return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
  };
  


  exports.getAllServiceAbout = async (req, res) => {
    try {
        const abouts = await ServiceAbout.find();

        const allAboutServices = abouts.map((about) => {
            const serviceAboutObj = about.toObject();

            const imageUrls = serviceAboutObj.images.map(image => 
                `${process.env.BACKEND_URL}/uploads/services/about/images/${image}`
            );

            const updatedFeatures = serviceAboutObj.feature.map(feature => ({
                ...feature,
                icon: feature.icon 
                    ? `${process.env.BACKEND_URL}/uploads/services/about/icon/${feature.icon}`
                    : null
            }));

            return {
                ...serviceAboutObj,
                images: imageUrls,
                feature: updatedFeatures,
            };
        });

        return res.status(200).json({
            message: [{ key: 'success', value: 'Service About Retrieved successfully' }],
            get_all_services_about: allAboutServices,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
};

exports.getAboutServiceById = async (req, res) => {
    const { id } = req.params;
    try {
        const about = await ServiceAbout.findById(id);
        if (!about) {
            return res.status(404).json({ message: [{ key: 'error', value: 'About not found' }] });
        }

        const serviceAboutObj = about.toObject();

        const imageUrls = serviceAboutObj.images.map(image => 
            `${process.env.BACKEND_URL}/uploads/services/about/images/${image}`
        );

        const updatedFeatures = serviceAboutObj.feature.map(feature => ({
            ...feature,
            icon: feature.icon 
                ? `${process.env.BACKEND_URL}/uploads/services/about/icon/${feature.icon}`
                : null
        }));

        return res.status(200).json({
            message: [{ key: 'success', value: 'Service About Retrieved successfully' }],
            serviceAboutById: {
                ...serviceAboutObj,
                images: imageUrls,
                feature: updatedFeatures,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
};



exports.updateAboutService = async (req, res) => {
    try {
        const aboutServiceId = req.params.id;
        const { heading, subHeading, feature, business_service, service } = req.body;

        const existingAboutService = await ServiceAbout.findById(aboutServiceId);
        if (!existingAboutService) {
            return res.status(404).json({ message: [{ key: "error", value: "About service not found" }] });
        }

        let parsedFeatures = [];
        if (feature) {
            try {
                parsedFeatures = JSON.parse(feature);
            } catch (error) {
                return res.status(400).json({ message: [{ key: "error", value: "Invalid feature format" }] });
            }
        }

        let formattedFeatures = parsedFeatures.map((f, index) => {
            let featureIcon = f.icon; 

            if (req.files?.[`icon_${index}`]) {
                const iconFile = req.files[`icon_${index}`];
                featureIcon = `${Date.now()}_${iconFile.name}`;
                const iconPath = path.join(__dirname, "../../uploads/services/about/icon", featureIcon);

                if (f.icon) {
                    const oldIconPath = path.join(__dirname, "../../uploads/services/about/icon", f.icon);
                    if (fs.existsSync(oldIconPath)) {
                        fs.unlinkSync(oldIconPath);
                    }
                }

                try {
                    iconFile.mv(iconPath);
                } catch (err) {
                    console.error("Error saving icon:", err);
                    return res.status(500).json({ message: [{ key: "error", value: "Failed to upload feature icon" }] });
                }
            }

            return { ...f, icon: featureIcon };
        });

        let uploadedImages = existingAboutService.images;
        if (req.files?.images) {
            const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

            existingAboutService.images.forEach((oldImage) => {
                const oldImagePath = path.join(__dirname, "../../uploads/services/about/images", oldImage);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            });

            uploadedImages = [];
            for (const imageFile of imageFiles) {
                if (imageFile.size > 3 * 1024 * 1024) {
                    return res.status(400).json({ message: [{ key: "error", value: "One of the images exceeds the 3MB limit" }] });
                }
                const uniqueImageName = `${Date.now()}_${imageFile.name}`;
                const uploadPath = path.join(__dirname, "../../uploads/services/about/images", uniqueImageName);
                await imageFile.mv(uploadPath);
                uploadedImages.push(uniqueImageName);
            }
        }

        const updatedService = await ServiceAbout.findByIdAndUpdate(
            aboutServiceId,
            {
                heading,
                subHeading,
                feature: formattedFeatures,
                images: uploadedImages,
                business_service,
                service,
                updatedBy: req?.user?.email || "admin@example.com",
                updatedAt: new Date(),
            },
            { new: true }
        );

        return res.status(200).json({ 
            message: [{ key: "success", value: "Service About updated successfully" }],
            updatedService
        });

    } catch (error) {
        console.error("Error updating service about:", error);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
};



exports.deleteAboutServices = async (req, res) => {
    const { id } = req.params;

    try {
        const about = await ServiceAbout.findById(id);
        if (!about) {
            return res.status(404).json({
                message: [{ key: "error", value: "Service About not found" }],
            });
        }

        if (about.icon) {
            const iconPath = path.join(__dirname, "../../uploads/services/about/icon", about.icon);
            if (fs.existsSync(iconPath)) {
                fs.unlinkSync(iconPath);
            }
        }

        if (about.images && about.images.length > 0) {
            about.images.forEach((image) => {
                const imagePath = path.join(__dirname, "../../uploads/services/about/images", image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            });
        }

        if (about.feature && about.feature.length > 0) {
            about.feature.forEach((feature) => {
                if (feature.icon) {
                    const featureIconPath = path.join(__dirname, "../../uploads/services/about/icon", feature.icon);
                    if (fs.existsSync(featureIconPath)) {
                        fs.unlinkSync(featureIconPath);
                    }
                }
            });
        }

        await ServiceAbout.findByIdAndDelete(id);

        return res.status(200).json({
            message: [{ key: "success", value: "Service About deleted successfully" }],
        });
    } catch (error) {
        console.error("Error deleting service about:", error);
        return res.status(500).json({
            message: [{ key: "error", value: "Internal server error" }],
        });
    }
};
