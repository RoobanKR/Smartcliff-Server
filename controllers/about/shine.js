const Shine = require("../../models/about/shineModal");
const path = require("path")
const fs = require('fs');

exports.createShine = async (req, res) => {
    try {
      const { title, description, shineDefinition } = req.body;
  
  
      let parsedShine = [];
      if (shineDefinition) {
        try {
          parsedShine = JSON.parse(shineDefinition);
        } catch (error) {
          return res.status(400).json({ message: [{ key: "error", value: "Invalid shine Definition format" }] });
        }
      }
  
      let formattedShine = parsedShine.map((f, index) => {
        let shineIcon = null;
        
        if (req.files && req.files[`icon_${index}`]) {
          const iconFile = req.files[`icon_${index}`];
          shineIcon = `${Date.now()}_${iconFile.name}`;
          const iconPath = path.join(__dirname, "../../uploads/about/shine/icon", shineIcon);
          
          try {
            iconFile.mv(iconPath);
          } catch (err) {
            console.error("Error saving icon:", err);
            return res.status(500).json({ message: [{ key: "error", value: "Failed to upload shineDefinition icon" }] });
          }
        }
        
        return { ...f, icon: shineIcon };
      });
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
    const uploadPath = path.join(
      __dirname,
      "../../uploads/about/shine/image",
      uniqueFileName
    );

    await imageFile.mv(uploadPath);
  
      const newServiceAbout = new Shine({
        title,
        description,
        shineDefinition: formattedShine,
        image: uniqueFileName,
        createdBy: req?.user?.email || "roobankr5@gmail.com",
        createdAt: new Date(),
      });

      await newServiceAbout.save();
      return res.status(201).json({ message: [{ key: "Success", value: "SHine Added Successfully" }] });
  
    } catch (error) {
      console.error("Error creating shine:", error);
      return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
  };



  exports.getAllShine = async (req, res) => {
    try {
        const shines = await Shine.find();

        const allShine = shines.map((shin) => {
            const shineObj = shin.toObject();

            const imageUrl = shineObj.image 
                ? `${process.env.BACKEND_URL}/uploads/about/shine/image/${shineObj.image}` 
                : null;

            const updatedShine = Array.isArray(shineObj.shineDefinition)
                ? shineObj.shineDefinition.map(shineDefinition => ({
                      ...shineDefinition,
                      icon: shineDefinition.icon
                          ? `${process.env.BACKEND_URL}/uploads/about/shine/icon/${shineDefinition.icon}`
                          : null
                  }))
                : [];

            return {
                ...shineObj,
                image: imageUrl,
                shineDefinition: updatedShine,
            };
        });

        return res.status(200).json({
            message: [{ key: 'success', value: 'Shine Retrieved successfully' }],
            get_all_shine: allShine,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
};


exports.getShineById = async (req, res) => {
    const { id } = req.params;
    try {
        const shine = await Shine.findById(id);
        if (!shine) {
            return res.status(404).json({ message: [{ key: 'error', value: 'Shine not found' }] });
        }

        const shineObj = shine.toObject();

        const imageUrl = shineObj.image 
            ? `${process.env.BACKEND_URL}/uploads/about/shine/image/${shineObj.image}`
            : null;

        const updatedFeatures = Array.isArray(shineObj.shineDefinition)
            ? shineObj.shineDefinition.map(shineDefinition => ({
                  ...shineDefinition,
                  icon: shineDefinition.icon
                      ? `${process.env.BACKEND_URL}/uploads/about/shine/icon/${shineDefinition.icon}`
                      : null
              }))
            : [];

        return res.status(200).json({
            message: [{ key: 'success', value: 'Shine Retrieved By Id successfully' }],
            shineById: {
                ...shineObj,
                image: imageUrl,
                shineDefinition: updatedFeatures,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
};

exports.updateShine = async (req, res) => {
    try {
        const shineId = req.params.id;
        const { title, description, shineDefinition } = req.body;

        // Find the existing shine record
        const existingShine = await Shine.findById(shineId);
        if (!existingShine) {
            return res.status(404).json({ message: [{ key: "error", value: "Shine not found" }] });
        }

        // Parse `shineDefinition` if it's provided
        let parsedShineDefinition = [];
        if (shineDefinition) {
            try {
                parsedShineDefinition = JSON.parse(shineDefinition);
            } catch (error) {
                return res.status(400).json({ message: [{ key: "error", value: "Invalid shineDefinition format" }] });
            }
        }

        // Process shineDefinition icons
        let formattedShineDefinition = parsedShineDefinition.map((f, index) => {
            let featureIcon = f.icon;

            if (req.files?.[`icon_${index}`]) {
                const iconFile = req.files[`icon_${index}`];
                featureIcon = `${Date.now()}_${iconFile.name}`;
                const iconPath = path.join(__dirname, "../../uploads/about/shine/icon", featureIcon);

                // Remove old icon if it exists
                if (f.icon) {
                    const oldIconPath = path.join(__dirname, "../../uploads/about/shine/icon", f.icon);
                    if (fs.existsSync(oldIconPath)) {
                        fs.unlinkSync(oldIconPath);
                    }
                }

                try {
                    iconFile.mv(iconPath);
                } catch (err) {
                    console.error("Error saving icon:", err);
                    return res.status(500).json({ message: [{ key: "error", value: "Failed to upload shineDefinition icon" }] });
                }
            }

            return { ...f, icon: featureIcon };
        });

        // Handle single image upload
        let updatedImage = existingShine.image;
        if (req.files?.image) {
            const imageFile = req.files.image;

            // Delete old image if it exists
            if (existingShine.image) {
                const imagePathToDelete = path.join(__dirname, "../../uploads/about/shine/image", existingShine.image);
                if (fs.existsSync(imagePathToDelete)) {
                    fs.unlinkSync(imagePathToDelete, (err) => {
                        if (err) {
                            console.error("Error deleting image:", err);
                        }
                    });
                }
            }

            // Save new image
            const uniqueFileName = `${Date.now()}_${imageFile.name}`;
            const uploadPath = path.join(__dirname, "../../uploads/about/shine/image", uniqueFileName);
            await imageFile.mv(uploadPath);
            updatedImage = uniqueFileName;
        }

        // Update Shine document
        const updatedShine = await Shine.findByIdAndUpdate(
            shineId,
            {
                title,
                description,
                image: updatedImage,
                shineDefinition: formattedShineDefinition,
                updatedBy: req?.user?.email || "admin@example.com",
                updatedAt: new Date(),
            },
            { new: true }
        );

        return res.status(200).json({
            message: [{ key: "success", value: "Shine updated successfully" }],
            updatedShine,
        });

    } catch (error) {
        console.error("Error updating Shine:", error);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
};






exports.deleteShine = async (req, res) => {
    const { id } = req.params;

    try {
        const shine = await Shine.findById(id);
        if (!shine) {
            return res.status(404).json({
                message: [{ key: "error", value: "Service About not found" }],
            });
        }

        if (shine.icon) {
            const iconPath = path.join(__dirname, "../../uploads/about/shine/icon", shine.icon);
            if (fs.existsSync(iconPath)) {
                fs.unlinkSync(iconPath);
            }
        }

             if (shine.image) {
                       const imagePath = path.join(__dirname, "../../uploads/about/shine/image", shine.image);
                       if (fs.existsSync(imagePath) && fs.lstatSync(imagePath).isFile()) {
                           fs.unlinkSync(imagePath);
                       }
                   }

        if (shine.shineDefinition && shine.shineDefinition.length > 0) {
            shine.shineDefinition.forEach((shineDefinition) => {
                if (shineDefinition.icon) {
                    const featureIconPath = path.join(__dirname, "../../uploads/about/shine/icon", shineDefinition.icon);
                    if (fs.existsSync(featureIconPath)) {
                        fs.unlinkSync(featureIconPath);
                    }
                }
            });
        }

        await Shine.findByIdAndDelete(id);

        return res.status(200).json({
            message: [{ key: "success", value: "Shine deleted successfully" }],
        });
    } catch (error) {
        console.error("Error deleting service about:", error);
        return res.status(500).json({
            message: [{ key: "error", value: "Internal server error" }],
        });
    }
};
