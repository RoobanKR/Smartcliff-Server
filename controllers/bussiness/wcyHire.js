const WCYHire = require("../../models/bussiness/WCYHireModal");
const path = require("path");
const fs = require("fs");

// Create WCYHire
exports.createWCYHire = async (req, res) => {
    try {
        const { title, description, wcyDefinition, type } = req.body;

        let parsedWCYHire = [];
        if (wcyDefinition) {
            try {
                parsedWCYHire = JSON.parse(wcyDefinition);
            } catch (error) {
                return res.status(400).json({ message: [{ key: "error", value: "Invalid WCY hire Definition format" }] });
            }
        }

        let formattedWcyHire = parsedWCYHire.map((f, index) => {
            let wcyHireicon = null;

            if (req.files && req.files[`icon_${index}`]) {
                const iconFile = req.files[`icon_${index}`];
                wcyHireicon = `${Date.now()}_${iconFile.name}`;
                const iconPath = path.join(__dirname, "../../uploads/business/wcyhire/icon", wcyHireicon);

                try {
                    iconFile.mv(iconPath);
                } catch (err) {
                    console.error("Error saving icon:", err);
                    return res.status(500).json({ message: [{ key: "error", value: "Failed to upload wcyDefinition icon" }] });
                }
            }

            return { ...f, icon: wcyHireicon };
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
            "../../uploads/business/wcyhire/image",
            uniqueFileName
        );

        await imageFile.mv(uploadPath);

        const newWCYHire = new WCYHire({
            type,
            title,
            description,
            wcyDefinition: formattedWcyHire,
            image: uniqueFileName,
            createdBy: req?.user?.email || "roobankr5@gmail.com",
            createdAt: new Date(),
        });

        await newWCYHire.save();
        return res.status(201).json({ message: [{ key: "Success", value: "WCY Hire Added Successfully" }] });

    } catch (error) {
        console.error("Error creating WCY Hire:", error);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
};

// Get All WCYHire
exports.getAllWCYHire = async (req, res) => {
    try {
        const wcyHires = await WCYHire.find();

        const allWCYHire = wcyHires.map((wcyHire) => {
            const wcyHireObj = wcyHire.toObject();
            const imageUrl = wcyHireObj.image 
                ? `${process.env.BACKEND_URL}/uploads/business/wcyhire/image/${wcyHireObj.image}` 
                : null;

            const updatedWcyDefinition = Array.isArray(wcyHireObj.wcyDefinition)
                ? wcyHireObj.wcyDefinition.map(def => ({
                    ...def,
                    icon: def.icon
                        ? `${process.env.BACKEND_URL}/uploads/business/wcyhire/icon/${def.icon}`
                        : null
                }))
                : [];

            return {
                ...wcyHireObj,
                image: imageUrl,
                wcyDefinition: updatedWcyDefinition,
            };
        });

        return res.status(200).json({
            message: [{ key: 'success', value: 'WCY Hire Retrieved successfully' }],
            get_all_wcy_hire: allWCYHire,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
};

// Get WCYHire by ID
exports.getWCYHireById = async (req, res) => {
    const { id } = req.params;
    try {
        const wcyHire = await WCYHire.findById(id);
        if (!wcyHire) {
            return res.status(404).json({ message: [{ key: 'error', value: 'WCY Hire not found' }] });
        }

        const wcyHireObj = wcyHire.toObject();
        const imageUrl = wcyHireObj.image 
            ? `${process.env.BACKEND_URL}/uploads/business/wcyhire/image/${wcyHireObj.image}`
            : null;

        const updatedWcyDefinition = Array.isArray(wcyHireObj.wcyDefinition)
            ? wcyHireObj.wcyDefinition.map(def => ({
                ...def,
                icon: def.icon
                    ? `${process.env.BACKEND_URL}/uploads/business/wcyhire/icon/${def.icon}`
                    : null
            }))
            : [];

        return res.status(200).json({
            message: [{ key: 'success', value: 'WCY Hire Retrieved By Id successfully' }],
            wcyHireById: {
                ...wcyHireObj,
                image: imageUrl,
                wcyDefinition: updatedWcyDefinition,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
};

// Update WCYHire
exports.updateWCYHire = async (req, res) => {
    try {
        const wcyHireId = req.params.id;
        const { title, description, wcyDefinition } = req.body;

        // Find the existing WCYHire record
        const existingWCYHire = await WCYHire.findById(wcyHireId);
        if (!existingWCYHire) {
            return res.status(404).json({ message: [{ key: "error", value: "WCY Hire not found" }] });
        }

        // Parse `wcyDefinition` if it's provided
        let parsedWcyDefinition = [];
        if (wcyDefinition) {
            try {
                parsedWcyDefinition = JSON.parse(wcyDefinition);
            } catch (error) {
                return res.status(400).json({ message: [{ key: "error", value: "Invalid wcyDefinition format" }] });
            }
        }

        // Process wcyDefinition icons
        let formattedWcyDefinition = parsedWcyDefinition.map((f, index) => {
            let featureIcon = f.icon;

            if (req.files?.[`icon_${index}`]) {
                const iconFile = req.files[`icon_${index}`];
                featureIcon = `${Date.now()}_${iconFile.name}`;
                const iconPath = path.join(__dirname, "../../uploads/business/wcyhire/icon", featureIcon);

                // Remove old icon if it exists
                if (f.icon) {
                    const oldIconPath = path.join(__dirname, "../../uploads/business/wcyhire/icon", f.icon);
                    if (fs.existsSync(oldIconPath)) {
                        fs.unlinkSync(oldIconPath);
                    }
                }

                try {
                    iconFile.mv(iconPath);
                } catch (err) {
                    console.error("Error saving icon:", err);
                    return res.status(500).json({ message: [{ key: "error", value: "Failed to upload wcyDefinition icon" }] });
                }
            }

            return { ...f, icon: featureIcon };
        });

        // Handle single image upload
        let updatedImage = existingWCYHire.image;
        if (req.files?.image) {
            const imageFile = req.files.image;

            // Delete old image if it exists
            if (existingWCYHire.image) {
                const imagePathToDelete = path.join(__dirname, "../../uploads/business/wcyhire/image", existingWCYHire.image);
                if (fs.existsSync(imagePathToDelete)) {
                    fs.unlinkSync(imagePathToDelete);
                }
            }

            // Save new image
            const uniqueFileName = `${Date.now()}_${imageFile.name}`;
            const uploadPath = path.join(__dirname, "../../uploads/business/wcyhire/image", uniqueFileName);
            await imageFile.mv(uploadPath);
            updatedImage = uniqueFileName;
        }

        // Update WCYHire document
        const updatedWCYHire = await WCYHire.findByIdAndUpdate(
            wcyHireId,
            {
                title,
                description,
                image: updatedImage,
                wcyDefinition: formattedWcyDefinition,
                updatedBy: req?.user?.email || "admin@example.com",
                updatedAt: new Date(),
            },
            { new: true }
        );

        return res.status(200).json({
            message: [{ key: "success", value: "WCY Hire updated successfully" }],
            updatedWCYHire,
        });

    } catch (error) {
        console.error("Error updating WCY Hire:", error);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
};

// Delete WCYHire
exports.deleteWCYHire = async (req, res) => {
    const { id } = req.params;

    try {
        const wcyHire = await WCYHire.findById(id);
        if (!wcyHire) {
            return res.status(404).json({
                message: [{ key: "error", value: "WCY Hire not found" }],
            });
        }

        // Delete associated icons
        if (wcyHire.wcyDefinition && wcyHire.wcyDefinition.length > 0) {
            wcyHire.wcyDefinition.forEach((definition) => {
                if (definition.icon) {
                    const featureIconPath = path.join(__dirname, "../../uploads/business/wcyhire/icon", definition.icon);
                    if (fs.existsSync(featureIconPath)) {
                        fs.unlinkSync(featureIconPath )}
                }
            });
        }

        // Delete the main image
        if (wcyHire.image) {
            const imagePath = path.join(__dirname, "../../uploads/business/wcyhire/image", wcyHire.image);
            if (fs.existsSync(imagePath) && fs.lstatSync(imagePath).isFile()) {
                fs.unlinkSync(imagePath);
            }
        }

        await WCYHire.findByIdAndDelete(id);

        return res.status(200).json({
            message: [{ key: "success", value: "WCY Hire deleted successfully" }],
        });
    } catch (error) {
        console.error("Error deleting WCY Hire:", error);
        return res.status(500).json({
            message: [{ key: "error", value: "Internal server error" }],
        });
    }
};