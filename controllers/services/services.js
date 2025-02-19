const Service = require("../../models/services/ServicesModal");
const path = require("path");
const fs = require('fs');

exports.createServices = async (req, res) => {
    try {
        const { title, description, slug, business_services } = req.body;

        if (!title || !description || !slug || !business_services) {
            return res.status(400).json({ message: [{ key: "error", value: "Required fields" }] });
        }

        if (!req.files || !req.files.icon) {
            return res.status(400).json({
                message: [{ key: "error", value: "Image is required" }],
            });
        }

        const imageFile = req.files.icon;

        if (imageFile.size > 3 * 1024 * 1024) {
            return res.status(400).json({
                message: [{ key: "error", value: "Image size exceeds the 3MB limit" }],
            });
        }

        const uniqueFileName = `${Date.now()}_${imageFile.name}`;
        const uploadPath = path.join(__dirname, "../../uploads/services/service/icon", uniqueFileName);

        await imageFile.mv(uploadPath);


        const newService = new Service({
            title,
            slug,
            description,
            icon: uniqueFileName,
            business_services,
        });

        await newService.save();

        return res.status(201).json({ message: [{ key: "Success", value: "Service Added Successfully" }] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
};


exports.getAllService = async (req, res) => {
    try {
        const services = await Service.find().populate("business_services"); // ✅ Correct field name

        const allServices = services.map((service) => {
            const serviceObj = service.toObject();
            return {
                ...serviceObj,
                icon: process.env.BACKEND_URL + "/uploads/services/service/icon/" + serviceObj.icon, // Append icon URL
            };
        });

        return res.status(200).json({
            message: [{ key: "success", value: "Service Retrieved successfully" }],
            get_all_services: allServices,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
};

exports.getServiceById = async (req, res) => {
    const { id } = req.params;
    try {
        const service = await Service.findById(id).populate("business_services");;
        if (!service) {
            return res.status(404).json({ message: [{ key: 'error', value: 'Service not found' }] });
        }

        return res.status(200).json({
            message: [{ key: 'success', value: 'Service Id based Retrieved successfully' }],
            serviceById: {
                ...service.toObject(),
                icon: process.env.BACKEND_URL + '/uploads/services/service/icon/' + service.icon, // Append icon URL
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
};
  

  
exports.updateService = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const updatedData = req.body;
        const imageFile = req.files ? req.files.icon : null;

        const existingService = await Service.findById(serviceId);

        if (!existingService) {
            return res.status(404).json({
                message: [{ key: 'error', value: 'Service not found' }]
            });
        }

        if (imageFile) {
            if (!existingService) {
              return res
                .status(404)
                .json({ message: { key: "error", value: "Service not found" } });
            }
      
            const imagePathToDelete = path.join(
              __dirname,
              "../../uploads/services/service/icon",
              existingService.icon
            );
            if (fs.existsSync(imagePathToDelete)) {
              fs.unlink(imagePathToDelete, (err) => {
                if (err) {
                  console.error("Error deleting icon:", err);
                }
              });
            }
      
            const uniqueFileName = `${Date.now()}_${imageFile.name}`;
            const uploadPath = path.join(
              __dirname,
              "../../uploads/services/service/icon",
              uniqueFileName
            );
            await imageFile.mv(uploadPath);
            updatedData.icon = uniqueFileName;
          }
            
        const updatedService = await Service.findByIdAndUpdate(serviceId, updatedData, { new: true });

        if (!updatedService) {
            return res.status(404).json({
                message: [{ key: 'error', value: 'Service not found' }]
            });
        }

        return res.status(200).json({
            message: [{ key: 'success', value: 'Service updated successfully' }]
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: [{ key: 'error', value: 'Internal server error' }]
        });
    }
};


exports.deleteServices = async (req, res) => {
    const { id } = req.params;

    try {
        const service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({ message: [{ key: 'error', value: 'Service not found' }] });
        }

        if (service.icon) {
            const imagePath = path.join(__dirname, "../../uploads/services/service/icon", service.icon);
            if (fs.existsSync(imagePath) && fs.lstatSync(imagePath).isFile()) {
                fs.unlinkSync(imagePath);
            }
        }

        await Service.findByIdAndDelete(id);

        return res.status(200).json({
            message: [{ key: 'success', value: 'Service deleted successfully' }],
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
};

