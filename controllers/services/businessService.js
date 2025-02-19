const businessService = require("../../models/services/BusinessServiceModal");

exports.createbusinessService = async (req, res) => {
  try {
    const { name, description,slug,title } = req.body;
    const existingbusinessServices = await businessService.findOne({ name });

    if (existingbusinessServices) {
      return res
        .status(403)
        .json({ message: [{ key: "error", value: "Name already exists" }] });
    }

    const newbusinessServices = new businessService({
      name,
      title,
      description,
      slug,
      createdBy:req.user.email,
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
    const businessServices = await businessService.find();

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
      businessserviceById: businessServiceById  ,
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

    const existingbusinessService = await businessService.findById(
      businessSerives
    );

    if (!existingbusinessService) {
      return res.status(404).json({
        message: [{ key: "error", value: "Service not found" }],
      });
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

        await businessService.findByIdAndDelete(id);

        return res.status(200).json({
            message: [{ key: 'success', value: 'business Service deleted successfully' }],
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
};

