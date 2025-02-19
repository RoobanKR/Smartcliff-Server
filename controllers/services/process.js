const ServiceProcess = require("../../models/services/ProcessModal");
const path = require("path")
const fs = require('fs');

exports.createServiceProcess = async (req, res) => {
    try {
      const { process, business_service, service } = req.body;
  
      let parsedProcess = [];
      if (process) {
        try {
          parsedProcess = JSON.parse(process);
        } catch (error) {
          return res.status(400).json({ message: [{ key: "error", value: "Invalid process format" }] });
        }
      }
  
      let formattedFeatures = parsedProcess.map((f, index) => {
        let processIcon = null;
        
        // Ensure req.files is defined and contains the icon file
        if (req.files && req.files[`icon_${index}`]) {
          const iconFile = req.files[`icon_${index}`];
          processIcon = `${Date.now()}_${iconFile.name}`;
          const iconPath = path.join(__dirname, "../../uploads/services/process/icon", processIcon);
          
          try {
            iconFile.mv(iconPath);
          } catch (err) {
            console.error("Error saving icon:", err);
            return res.status(500).json({ message: [{ key: "error", value: "Failed to upload process icon" }] });
          }
        }
        
        return { ...f, icon: processIcon };
      });
  
      const newServiceProcess = new ServiceProcess({
        process: formattedFeatures,
        business_service,
        service,
        createdBy: req.user.email,
        createdAt: new Date(),
      });
  
      await newServiceProcess.save();
      return res.status(201).json({ message: [{ key: "Success", value: "Service Process Added Successfully" }] });
  
    } catch (error) {
      console.error("Error creating service process:", error);
      return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
  };
  

  exports.getAllServiceProcess = async (req, res) => {
    try {
        const allProcess = await ServiceProcess.find().populate('business_service');

        const allAboutServices = allProcess.map((service) => {
            const serviceObj = service.toObject();

            // Ensure process icons have full URLs
            serviceObj.process = serviceObj.process.map(proc => ({
                ...proc,
                icon: proc.icon 
                    ? `${process.env.BACKEND_URL}/uploads/services/process/icon/${proc.icon}`
                    : null
            }));

            return serviceObj;
        });

        return res.status(200).json({
            message: [{ key: 'success', value: 'Service Process Retrieved successfully' }],
            get_all_services_process: allAboutServices,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
};


exports.getServiceProcessById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the service process by ID and populate business_service
        const serviceProcess = await ServiceProcess.findById(id).populate('business_service');

        if (!serviceProcess) {
            return res.status(404).json({ message: [{ key: 'error', value: 'Service Process not found' }] });
        }

        // Convert to object and modify process icons
        const serviceObj = serviceProcess.toObject();
        serviceObj.process = serviceObj.process.map(proc => ({
            ...proc,
            icon: proc.icon 
                ? `${process.env.BACKEND_URL}/uploads/services/process/icon/${proc.icon}`
                : null
        }));

        return res.status(200).json({
            message: [{ key: 'success', value: 'Service Process Id based Retrieved successfully' }],
            service_processById: serviceObj,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
};



exports.updateProcessService = async (req, res) => {
    try {
        const processServiceId = req.params.id;
        const {process, business_service, service } = req.body;

        // Check if Service About exists
        const existingAboutService = await ServiceProcess.findById(processServiceId);
        if (!existingAboutService) {
            return res.status(404).json({ message: [{ key: "error", value: "Process service not found" }] });
        }

        // Parse process data
        let parsedProcess = [];
        if (process) {
            try {
                parsedProcess = JSON.parse(process);
            } catch (error) {
                return res.status(400).json({ message: [{ key: "error", value: "Invalid process format" }] });
            }
        }

        // Handle process icons
        let formattedFeatures = parsedProcess.map((f, index) => {
            let featureIcon = f.icon; // Keep old icon if not updated

            if (req.files?.[`icon_${index}`]) {
                const iconFile = req.files[`icon_${index}`];
                featureIcon = `${Date.now()}_${iconFile.name}`;
                const iconPath = path.join(__dirname, "../../uploads/services/process/icon", featureIcon);

                // Delete old icon if exists
                if (f.icon) {
                    const oldIconPath = path.join(__dirname, "../../uploads/services/process/icon", f.icon);
                    if (fs.existsSync(oldIconPath)) {
                        fs.unlinkSync(oldIconPath);
                    }
                }

                try {
                    iconFile.mv(iconPath);
                } catch (err) {
                    console.error("Error saving icon:", err);
                    return res.status(500).json({ message: [{ key: "error", value: "Failed to upload process icon" }] });
                }
            }

            return { ...f, icon: featureIcon };
        });

        // Update the document
        const updatedService = await ServiceProcess.findByIdAndUpdate(
            processServiceId,
            {
                process: formattedFeatures,
                business_service,
                service,
                updatedBy: req?.user?.email || "admin@example.com",
                updatedAt: new Date(),
            },
        );

        return res.status(200).json({ 
            message: [{ key: "success", value: "Service Process updated successfully" }],
            updatedService
        });

    } catch (error) {
        console.error("Error updating service process:", error);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
};



exports.deleteprocessServices = async (req, res) => {
    const { id } = req.params;

    try {
        const Proces = await ServiceProcess.findById(id);
        if (!Proces) {
            return res.status(404).json({
                message: [{ key: "error", value: "Service Process not found" }],
            });
        }


        // Delete process icons if they exist
        if (Proces.process && Proces.process.length > 0) {
            Proces.process.forEach((process) => {
                if (process.icon) {
                    const featureIconPath = path.join(__dirname, "../../uploads/services/process/icon", process.icon);
                    if (fs.existsSync(featureIconPath)) {
                        fs.unlinkSync(featureIconPath);
                    }
                }
            });
        }

        // Delete service Proces entry from database
        await ServiceProcess.findByIdAndDelete(id);

        return res.status(200).json({
            message: [{ key: "success", value: "Service About deleted successfully" }],
        });
    } catch (error) {
        console.error("Error deleting service Proces:", error);
        return res.status(500).json({
            message: [{ key: "error", value: "Internal server error" }],
        });
    }
};
