const Assesment = require('../../models/degreeprogram/AssesmentModal');
const path = require('path');
const fs = require('fs');

exports.createAssesment = async (req, res) => {
    try {
        const { assesment } = req.body;
        
        if (!assesment || !Array.isArray(assesment)) {
            return res.status(400).json({ message: "Assessment data is required and should be an array" });
        }

        const assesmentObjects = [];

        for (const item of assesment) {
            const { heading, subHeading,submain, title, description,icon } = item;

            if (!heading || !subHeading) {
                return res.status(400).json({ message: "Missing fields in assesment data" });
            }

            let uniqueIconFileName = '';

            if (icon) {
                
                const iconImage = req.files?.icon;

                if (!iconImage) {
                    return res.status(400).json({ message: "Icon image is required" });
                }

                if (iconImage.size > 5 * 1024 * 1024) {
                    return res.status(400).json({ message: "Icon image size exceeds the 5MB limit" });
                }

                uniqueIconFileName = `${Date.now()}_${iconImage.name}`;
                const iconUploadPath = path.join(__dirname, '../../uploads/mca/assesment', uniqueIconFileName);

                try {
                    await iconImage.mv(iconUploadPath);
                } catch (err) {
                    console.error("Error moving the Assessment Icon file:", err);
                    return res.status(500).json({ message: "Internal server error" });
                }
            }

            assesmentObjects.push({
                heading,
                subHeading,
                submain,
                icon: uniqueIconFileName,
                title,
                description
            });
        }

        const newAssessment = new Assesment({ assesment: assesmentObjects });
        await newAssessment.save();

        return res.status(201).json({ message: "Assessment added successfully" });
    } catch (error) {
        console.error("Error creating assesment:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


exports.getAllAssessments = async (req, res) => {
    try {
        const assesments = await Assesment.find();
        const assesmentsWithIconURLs = assesments.map(assesment => {
            const assesmentData = assesment.toObject();
            const assesmentWithIconURL = {
                _id: assesmentData._id,
                assesment: assesmentData.assesment.map(item => ({
                    ...item,
                    icon: item.icon ? `${process.env.BACKEND_URL}/uploads/mca/assesment/${item.icon}` : null
                })),
                __v: assesmentData.__v
            };
            return assesmentWithIconURL;
        });
        return res.status(200).json({ assesments: assesmentsWithIconURLs });
    } catch (error) {
        console.error("Error fetching assesments:", error);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
};

// Controller to get assesment by ID
exports.getAssessmentById = async (req, res) => {
    try {
        const { assesmentId } = req.params;
        const assesment = await Assesment.findById(assesmentId);
        
        if (!assesment) {
            return res.status(404).json({ message: "Assessment not found" });
        }

        const assesmentData = assesment.toObject();
        const assesmentWithIconURL = {
            _id: assesmentData._id,
            assesment: assesmentData.assesment.map(item => ({
                ...item,
                icon: item.icon ? `${process.env.BACKEND_URL}/uploads/mca/assesment/${item.icon}` : null
            })),
            __v: assesmentData.__v
        };

        return res.status(200).json({
            message: [{ key: 'success', value: 'Assessment Retrieved successfully' }],
            assesment: assesmentWithIconURL,
        });
    } catch (error) {
        console.error("Error fetching assesment by ID:", error);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
};


exports.updateAssessment = async (req, res) => {
    try {
        const { assesmentId } = req.params;
        const { assesment } = req.body;

        if (!assesment) {
            return res.status(400).json({ message: [{ key: "error", value: "Assessment data is required" }] });
        }

        const existingAssessment = await Assesment.findById(assesmentId);
        
        if (!existingAssessment) {
            return res.status(404).json({ message: "Assessment not found" });
        }

        const updatedAssessmentObjects = [];

        for (const item of assesment) {
            const { heading, subHeading,submain, title, description,icon } = item;

            

            let uniqueFileName = '';

            if (req.files && req.files.icon) {
                const tourImage = req.files.icon;

                if (tourImage.size > 5 * 1024 * 1024) {
                    return res.status(400).json({ message: [{ key: 'error', value: 'Tour image size exceeds the 5MB limit' }] });
                }

                uniqueFileName = `${Date.now()}_${tourImage.name}`;
                const tourUploadPath = path.join(__dirname, '../../uploads/mca/assesment', uniqueFileName);

                try {
                    await tourImage.mv(tourUploadPath);
                } catch (err) {
                    console.error("Error moving the Assessment Image file:", err);
                    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
                }

                // Remove old icon if it exists
                if (existingAssessment.assesment.length > 0 && existingAssessment.assesment[0].icon) {
                    const oldIconPath = path.join(__dirname, '../../uploads/mca/assesment', existingAssessment.assesment[0].icon);
                    try {
                        fs.unlinkSync(oldIconPath);
                    } catch (err) {
                        console.error("Error removing old icon:", err);
                    }
                }
            }

            updatedAssessmentObjects.push({
                heading,
                subHeading,
                submain,
                icon: uniqueFileName,
                title,
                description
            });
        }

        existingAssessment.assesment = updatedAssessmentObjects;
        await existingAssessment.save();

        return res.status(200).json({ message: [{ key: "success", value: "Assessment updated successfully" }] });
    } catch (error) {
        console.error("Error updating assesment:", error);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
};

exports.deleteAssessment = async (req, res) => {
    try {
        const { assesmentId } = req.params;

        // Find the assesment by ID
        const assesment = await Assesment.findById(assesmentId);

        if (!assesment) {
            return res.status(404).json({ message: "Assessment not found" });
        }

        // Retrieve the icon filename associated with the assesment
        const iconFileName = assesment.assesment.length > 0 ? assesment.assesment[0].icon : null;

        // Delete the assesment
        await assesment.deleteOne();

        // If an icon exists, delete the associated icon file
        if (iconFileName) {
            const iconFilePath = path.join(__dirname, '../../uploads/mca/assesment', iconFileName);
            try {
                await fs.unlink(iconFilePath);
            } catch (err) {
                console.error("Error deleting icon file:", err);
            }
        }

        return res.status(200).json({ message: [{ key: "success", value: "Assessment deleted successfully" }] });
    } catch (error) {
        console.error("Error deleting assesment:", error);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
};