const DPBeneficiaries = require("../../models/degreeprogram/DPBeneficiariesModal");

exports.createDPBeneficiaries = async (req, res) => {
  try {
    const {
      type,
      noOfCandidates,
      college,
      programme,
      batch,
      hours,
      duration,
      service,
      business_service,
      degree_program,
      company,
    } = req.body;

    // Validate type field is present and valid
    if (!type || !['degreeprogram', 'skilling'].includes(type)) {
      return res.status(400).json({
        message: [{ key: "error", value: "Type must be either 'degreeprogram' or 'skilling'" }]
      });
    }

    // Create base beneficiary object with common fields
    const beneficiaryData = {
      type,
      noOfCandidates,
      service,
      business_service,
      degree_program,
      company,
      createdBy: req?.user?.email || "roobankr5@gmail.com",
    };

    // Add type-specific fields based on the selected type
    if (type === "degreeprogram") {
      // For degree program, store college, programme, batch
      beneficiaryData.college = college;
      beneficiaryData.programme = programme;
      beneficiaryData.batch = batch;
    } else if (type === "skilling") {
      // For skilling, store hours, batch, duration
      beneficiaryData.hours = hours;
      beneficiaryData.batch = batch;
      beneficiaryData.duration = duration;
    }

    const dpBeneficiaries = new DPBeneficiaries(beneficiaryData);
    await dpBeneficiaries.save();

    return res.status(201).json({
      message: [
        { key: "success", value: "DPBeneficiaries added successfully" },
      ],
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.getAllDPBeneficiaries = async (req, res) => {
  try {
    const dpbeneficiaries = await DPBeneficiaries.find()
      .populate("service")
      .populate("business_service")
      .populate("degree_program")
      .populate("company");
    return res.status(200).json({
      message: [
        {
          key: "Success",
          value: "Degree Program Beneficiaries Get ALl Successfully",
        },
      ],
      getAllDpBeneficiaries: dpbeneficiaries,
    });
  } catch (error) {
    console.error("Error fetching Degree Program Beneficiarie:", error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.getDPBeneficiariesById = async (req, res) => {
  try {
    const { id } = req.params;
    const dpBeneficiaries = await DPBeneficiaries.findById(id).populate("service")
      .populate("business_service")
      .populate("degree_program")
      .populate("company");
    if (!dpBeneficiaries) {
      return res
        .status(404)
        .json({ message: [{ key: "error", value: "Degree Program Beneficiaries not found" }] });
    }
    return res
      .status(200)
      .json({
        message: [{ key: "Success", value: "Degree Program Beneficiaries Get ALl Successfully" }],
        getAllDpBeneficiaries: dpBeneficiaries,
      });
  } catch (error) {
    console.error("Error fetching Degree Program Beneficiaries by ID:", error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};




exports.updateDPBeneficiaries = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      type,
      noOfCandidates,
      college,
      programme,
      batch,
      hours,
      duration,
      service,
      business_service,
      degree_program,
      company,
    } = req.body;

    // First retrieve the current record to check if type is being changed
    const existingBeneficiary = await DPBeneficiaries.findById(id);
    
    if (!existingBeneficiary) {
      return res.status(404).json({
        message: [
          { key: "error", value: "DPBeneficiaries record not found" },
        ],
      });
    }

    // Determine which type to use (existing or new if provided)
    const beneficiaryType = type || existingBeneficiary.type;

    // Validate type field is valid if provided
    if (type && !['degreeprogram', 'skilling'].includes(type)) {
      return res.status(400).json({
        message: [{ key: "error", value: "Type must be either 'degreeprogram' or 'skilling'" }]
      });
    }

    // Create base update object with common fields
    const updateData = {
      noOfCandidates,
      service,
      business_service,
      degree_program,
      company,
      updatedBy: req?.user?.email || "roobankr5@gmail.com",
      updatedAt: Date.now(),
    };

    // If type is being updated, include it in the update
    if (type) {
      updateData.type = type;
    }

    // Add type-specific fields based on the type (existing or new)
    if (beneficiaryType === "degreeprogram") {
      // For degree program, update college, programme, batch
      if (college !== undefined) updateData.college = college;
      if (programme !== undefined) updateData.programme = programme;
      if (batch !== undefined) updateData.batch = batch;
      
      // If switching from skilling to degreeprogram, clear skilling-specific fields
      if (type && type !== existingBeneficiary.type) {
        updateData.hours = undefined;
        updateData.duration = undefined;
      }
    } else if (beneficiaryType === "skilling") {
      // For skilling, update hours, batch, duration
      if (hours !== undefined) updateData.hours = hours;
      if (batch !== undefined) updateData.batch = batch;
      if (duration !== undefined) updateData.duration = duration;
      
      // If switching from degreeprogram to skilling, clear degreeprogram-specific fields
      if (type && type !== existingBeneficiary.type) {
        updateData.college = undefined;
        updateData.programme = undefined;
      }
    }

    // Only include defined fields in the update
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    // Update the record
    const updatedBeneficiary = await DPBeneficiaries.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: [
        { key: "success", value: "DPBeneficiaries updated successfully" },
      ],
      data: updatedBeneficiary,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.deleteDPBeneficiaries = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the record and delete it
    const deletedBeneficiary = await DPBeneficiaries.findByIdAndDelete(id);

    if (!deletedBeneficiary) {
      return res.status(404).json({
        message: [
          { key: "error", value: "DPBeneficiaries record not found" },
        ],
      });
    }

    return res.status(200).json({
      message: [
        { key: "success", value: "DPBeneficiaries deleted successfully" },
      ],
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

