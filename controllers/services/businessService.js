const businessService = require("../../models/services/BusinessServiceModal");
const path = require("path")
const fs = require('fs');

exports.createbusinessService = async (req, res) => {
  try {
    const { name, description,slug,title } = req.body;
    const existingbusinessServices = await businessService.findOne({ name });

    if (existingbusinessServices) {
      return res
        .status(403)
        .json({ message: [{ key: "error", value: "Name already exists" }] });
    }

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
               const uploadPath = path.join(__dirname, "../../uploads/services/businessService/image", uniqueFileName);
       
               await imageFile.mv(uploadPath);
    

               if (!req.files || !req.files.image) {
                return res.status(400).json({
                    message: [{ key: "error", value: "Image is required" }],
                });
            }
    
            const logoFile = req.files.logo;
    
            if (logoFile.size > 3 * 1024 * 1024) {
                return res.status(400).json({
                    message: [{ key: "error", value: "Logo size exceeds the 3MB limit" }],
                });
            }
    
            const uniqueLogoFileName = `${Date.now()}_${logoFile.name}`;
            const uploadLogoPath = path.join(__dirname, "../../uploads/services/businessService/logo", uniqueLogoFileName);
    
            await logoFile.mv(uploadLogoPath);
 

    const newbusinessServices = new businessService({
      name,
      title,
      description,
      slug,
      image:uniqueFileName,
      logo:uniqueLogoFileName,
      createdBy:req.user.email || "roobankr5@gmail.com",
    });

    await newbusinessServices.save();

    return res
      .status(201)
      .json({
        message: [
          { key: "Success", value: "business Servicess added successfully" },
        ],
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.getAllbusinessService = async (req, res) => {
  try {
    const getbusinessServices = await businessService.find();

    const businessServices = getbusinessServices.map((business) => {
      const businessServiceObj = business.toObject();
      return {
          ...businessServiceObj,
          image: process.env.BACKEND_URL + "/uploads/services/businessService/image/" + businessServiceObj.image,
          logo: process.env.BACKEND_URL + "/uploads/services/businessService/logo/" + businessServiceObj.logo,

        };
  });

    return res.status(200).json({
      message: [{ key: "success", value: "Service Retrieved successfully" }],
      get_all_businessservices: businessServices,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.getbusinessServiceById = async (req, res) => {
  const { id } = req.params;
  try {
    const businessServiceById = await businessService.findById(id);
    if (!businessServiceById) {
      return res
        .status(404)
        .json({ message: [{ key: "error", value: "Service not found" }] });
    }

    return res.status(200).json({
      message: [
        { key: "success", value: "Service Id based Retrieved successfully" },
      ],
      businessserviceById: {
        ...businessServiceById.toObject(),
        image: process.env.BACKEND_URL + '/uploads/services/businessService/image/' + businessServiceById.image,
        logo: process.env.BACKEND_URL + '/uploads/services/businessService/logo/' + businessServiceById.logo,

      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.updatebusinessSerives = async (req, res) => {
  try {
    const businessSerives = req.params.id;
    const updatedData = req.body;
    const imageFile = req.files ? req.files.image : null;
      const logoFile = req.files ? req.files.logo : null;


    const existingbusinessService = await businessService.findById(
      businessSerives
    );

    if (!existingbusinessService) {
      return res.status(404).json({
        message: [{ key: "error", value: "Service not found" }],
      });
    }
    if (imageFile) {
      if (!existingbusinessService) {
        return res
          .status(404)
          .json({ message: { key: "error", value: "Business not found" } });
      }
    
      if (existingbusinessService.image) {
        const imagePathToDelete = path.join(
          __dirname,
          "../../uploads/services/businessService/image",
          existingbusinessService.image
        );
        if (fs.existsSync(imagePathToDelete)) {
          fs.unlink(imagePathToDelete, (err) => {
            if (err) {
              console.error("Error deleting image:", err);
            }
          });
        }
      }
    
      const uniqueFileName = `${Date.now()}_${imageFile.name}`;
      const uploadPath = path.join(
        __dirname,
        "../../uploads/services/businessService/image",
        uniqueFileName
      );
      await imageFile.mv(uploadPath);
      updatedData.image = uniqueFileName;
    }
       
    if (logoFile) {
      if (!existingbusinessService) {
        return res
          .status(404)
          .json({ message: { key: "error", value: "Business not found" } });
      }
    
      if (existingbusinessService.logo) {
        const logoPathToDelete = path.join(
          __dirname,
          "../../uploads/services/businessService/logo",
          existingbusinessService.logo
        );
        if (fs.existsSync(logoPathToDelete)) {
          fs.unlink(logoPathToDelete, (err) => {
            if (err) {
              console.error("Error deleting logo:", err);
            }
          });
        }
      }
    
      const uniqueLogoFileName = `${Date.now()}_${logoFile.name}`;
      const uploadLogoPath = path.join(
        __dirname,
        "../../uploads/services/businessService/logo",
        uniqueLogoFileName
      );
      await logoFile.mv(uploadLogoPath);
      updatedData.logo = uniqueLogoFileName;
    }


    const updatedPlacements = await businessService.findByIdAndUpdate(
      businessSerives,
      updatedData
    );

    return res.status(200).json({
      message: [
        { key: "success", value: "business Placements updated successfully" },
      ]    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};


exports.deletebusinessServices = async (req, res) => {
    const { id } = req.params;

    try {
        const businessServiceDelete = await businessService.findById(id);
        if (!businessServiceDelete) {
            return res.status(404).json({ message: [{ key: 'error', value: 'Service not found' }] });
        }
             if (businessServiceDelete.image) {
                       const imagePath = path.join(__dirname, "../../uploads/services/businessService", businessServiceDelete.image);
                       if (fs.existsSync(imagePath) && fs.lstatSync(imagePath).isFile()) {
                           fs.unlinkSync(imagePath);
                       }
                   }
           
                   if (businessServiceDelete.logo) {
                    const imagePath = path.join(__dirname, "../../uploads/services/businessService/logo", businessServiceDelete.logo);
                    if (fs.existsSync(imagePath) && fs.lstatSync(imagePath).isFile()) {
                        fs.unlinkSync(imagePath);
                    }
                }


        await businessService.findByIdAndDelete(id);

        return res.status(200).json({
            message: [{ key: 'success', value: 'business Service deleted successfully' }],
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
};

