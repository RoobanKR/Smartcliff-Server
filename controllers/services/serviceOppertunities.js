const ServiceOpportunity = require("../../models/services/ServiceOppertunitiesModal");
const path = require("path");
const fs = require("fs");

exports.createServiceOpportunities = async (req, res) => {
  try {
    const { company_name, description, service, business_service } = req.body;

    if (!company_name || !description) {
      return res.status(400).json({
        message: [
          {
            key: "error",
            value: "Required fields: company_name and description are missing",
          },
        ],
      });
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
    const uploadPath = path.join(
      __dirname,
      "../../uploads/services/opportunity",
      uniqueFileName
    );

    await imageFile.mv(uploadPath);

    const newServiceOpportunity = new ServiceOpportunity({
      company_name,
      description,
      image: uniqueFileName,
      service,
      business_service,
    });

    await newServiceOpportunity.save();

    return res.status(201).json({
      message: [{ key: "success", value: "opportunity Added Successfully" }],
    });
  } catch (error) {
    console.error("Outer try block error:", error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};

exports.getAllServiceOpportunity = async (req, res) => {
  try {
    const serviceOpportunity = await ServiceOpportunity.find()
      .populate("service")
      .populate("business_service");

    const allserviceOpportunity = serviceOpportunity.map(
      (serviceopportunity) => {
        const serviceObj = serviceopportunity.toObject();
        return {
          ...serviceObj,
          image:
            process.env.BACKEND_URL +
            "/uploads/services/opportunity/" +
            serviceObj.image,
        };
      }
    );

    return res.status(200).json({
      message: [
        { key: "success", value: "opportunity Retrieved successfully" },
      ],
      getAllServiceOpportunity: allserviceOpportunity,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.getServiceOpportunityById = async (req, res) => {
  const { id } = req.params;
  try {
    const serviceOpportunity = await ServiceOpportunity.findById(id)
      .populate("service")
      .populate("business_service");
    if (!serviceOpportunity) {
      return res
        .status(404)
        .json({
          message: [{ key: "error", value: "Service Opportunity not found" }],
        });
    }
    return res.status(200).json({
      message: [
        {
          key: "success",
          value: "Service Opportunity Id based Retrieved successfully",
        },
      ],
      ServiceOpportunityById: {
        ...serviceOpportunity.toObject(),
        image:
          process.env.BACKEND_URL +
          "/uploads/services/opportunity/" +
          serviceOpportunity.image,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.updateServiceOpportunity = async (req, res) => {
  try {
    const opportunityId = req.params.id;
    const updatedData = req.body;
    const imageFile = req.files ? req.files.image : null;

    const existingServiceOpportunity = await ServiceOpportunity.findById(
      opportunityId
    );

    if (!existingServiceOpportunity) {
      return res.status(404).json({
        message: [{ key: "error", value: "Service Opportunity not found" }],
      });
    }


    if (imageFile) {
      if (!existingServiceOpportunity) {
        return res
          .status(404)
          .json({ message: { key: "error", value: "Opportunity not found" } });
      }

      const imagePathToDelete = path.join(
        __dirname,
        "../../uploads/services/opportunity",
        existingServiceOpportunity.image
      );
      if (fs.existsSync(imagePathToDelete)) {
        fs.unlink(imagePathToDelete, (err) => {
          if (err) {
            console.error("Error deleting image:", err);
          }
        });
      }

      const uniqueFileName = `${Date.now()}_${imageFile.name}`;
      const uploadPath = path.join(
        __dirname,
        "../../uploads/services/opportunity",
        uniqueFileName
      );
      await imageFile.mv(uploadPath);
      updatedData.image = uniqueFileName;
    }

    const updatedServiceOpportunity =
      await ServiceOpportunity.findByIdAndUpdate(opportunityId, updatedData);

    if (!updatedServiceOpportunity) {
      return res.status(404).json({
        message: [{ key: "error", value: "Service Opportunity not found" }],
      });
    }

    return res.status(200).json({
      message: [
        { key: "success", value: "Service Opportunity updated successfully" },
      ],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};



exports.deleteServiceOpportunity = async (req, res) => {
    const { id } = req.params;
  
    try {
      const serviceOpportunity = await ServiceOpportunity.findById(id);
      if (!serviceOpportunity) {
        return res.status(404).json({ message: [{ key: 'error', value: 'Service Opportunity not found' }] });
      }
  
       if (serviceOpportunity.image) {
                 const imagePath = path.join(__dirname, "../../uploads/services/opportunity", serviceOpportunity.image);
                 if (fs.existsSync(imagePath) && fs.lstatSync(imagePath).isFile()) {
                     fs.unlinkSync(imagePath);
                 }
             }
     
        await ServiceOpportunity.findByIdAndDelete(id);
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Service Opportunity deleted successfully' }],
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  