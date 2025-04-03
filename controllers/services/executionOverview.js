const ExecutionOverview = require("../../models/services/ExecutionOverviewModal");
const path = require("path");
const fs = require("fs");


exports.createExecutionOverview = async (req, res) => {
  try {
    let {
      name,
      service,
      business_service,
      sections 
    } = req.body;

    if (!req.files || !req.files.image) {
      return res.status(400).json({
        message: [{ key: "error", value: "Image is required" }],
      });
    }

    const imageFile = req.files.image;

    // Validate image size
    if (imageFile.size > 3 * 1024 * 1024) {
      return res.status(400).json({
        message: [{ key: "error", value: "Image size exceeds the 3MB limit" }],
      });
    }

    const uniqueFileName = `${Date.now()}_${imageFile.name}`;
    const uploadPath = path.join(
      __dirname,
      "../../uploads/services/executionoverview",
      uniqueFileName
    );

    await imageFile.mv(uploadPath);

    const newExecutionOverview = new ExecutionOverview({
      name,
      image: uniqueFileName,
      sections: Array.isArray(sections) ? sections : JSON.parse(sections),
      service,
      business_service,
    });

    await newExecutionOverview.save();

    return res.status(201).json({
      message: [
        { key: "Success", value: "Execution Overview Added Successfully" },
      ],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};

exports.getAllExecutionOverviews = async (req, res) => {
  try {
    const executionOverviews = await ExecutionOverview.find()
      .populate("service")
      .populate("business_service");
    if (!executionOverviews || executionOverviews.length === 0) {
      return res
        .status(404)
        .json({ message: [{ key: "error", value: "No Overview found" }] });
    }
    const AllExecutionOverviews = executionOverviews.map((overview) => {
      const overviewObj = overview.toObject();
      return {
        ...overviewObj,
        image:
          process.env.BACKEND_URL +
          "/uploads/services/executionoverview/" +
          overviewObj.image,
      };
    });
    return res.status(200).json({
      message: [
        { key: "success", value: "Execution Overview Retrieved successfully" },
      ],
      getAllExecutionOverviews: AllExecutionOverviews,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};

exports.getExecutionOverviewById = async (req, res) => {
  try {
    const executionOverview = await ExecutionOverview.findById(req.params.id)
      .populate("service")
      .populate("business_service");
    if (!executionOverview) {
      return res
        .status(404)
        .json({
          message: [{ key: "error", value: "Execution Overview not found" }],
        });
    }
    return res.status(200).json({
      message: [
        {
          key: "success",
          value: "Execution Overview Retrieved successfully",
        },
      ],
      getExecutionOverviewById: {
        ...executionOverview.toObject(),
        image:
          process.env.BACKEND_URL +
          "/uploads/services/executionoverview/" +
          executionOverview.image,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};

exports.updateExecutionOverview = async (req, res) => {
  try {
    const overviewId = req.params.id;
    let updatedData = req.body;
    const imageFile = req.files ? req.files.image : null;

    const existingExecutionOverview = await ExecutionOverview.findById(overviewId);

    if (!existingExecutionOverview) {
      return res.status(404).json({
        message: [{ key: "error", value: "ExecutionOverview not found" }],
      });
    }

    // Ensure type and typeName are properly formatted as arrays
    if (updatedData.sections) {
      updatedData.sections = Array.isArray(updatedData.sections) ? updatedData.sections : JSON.parse(updatedData.sections);
    }

    if (imageFile) {
      const imagePathToDelete = path.join(
        __dirname,
        "../../uploads/services/executionoverview",
        existingExecutionOverview.image
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
        "../../uploads/services/executionoverview",
        uniqueFileName
      );
      await imageFile.mv(uploadPath);
      updatedData.image = uniqueFileName;
    }

    const updatedExecutionOverview = await ExecutionOverview.findByIdAndUpdate(
      overviewId,
      updatedData,
      { new: true } // This ensures the updated document is returned
    );

    if (!updatedExecutionOverview) {
      return res.status(404).json({
        message: [{ key: "error", value: "ExecutionOverview not found" }],
      });
    }

    return res.status(200).json({
      message: [
        { key: "success", value: "Execution Overview updated successfully" },
      ],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};

exports.deleteExecutionOverview = async (req, res) => {
  try {
    const deletedExecutionOverview = await ExecutionOverview.findByIdAndDelete(
      req.params.id
    );
    if (!deletedExecutionOverview) {
      return res
        .status(404)
        .json({
          message: [{ key: "error", value: "Execution Overview not found" }],
        });
    }
    if (deletedExecutionOverview.image) {
      const imagePath = path.join(
        __dirname,
        "../../uploads/services/executionoverview",
        deletedExecutionOverview.image
      );
      if (fs.existsSync(imagePath) && fs.lstatSync(imagePath).isFile()) {
        fs.unlinkSync(imagePath);
      }
    }

    return res.status(200).json({
      message: [
        { key: "success", value: "Execution Overview deleted successfully" },
      ],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};
