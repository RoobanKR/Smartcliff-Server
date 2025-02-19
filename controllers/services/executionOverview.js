const ExecutionOverview = require("../../models/services/ExecutionOverviewModal");

// Create a new execution overview
exports.createExecutionOverview = async (req, res) => {
  try {
    const {
      type,
      typeName,
      batchName,
      stack,
      duration,
      status,
      year,
      service,
      business_service,
    } = req.body;
    const newExecutionOverview = new ExecutionOverview({
      type,
      typeName,
      batchName,
      stack,
      duration,
      status,
      year,
      service,
      business_service,
    });
    await newExecutionOverview.save();
    return res
      .status(201)
      .json({
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
    const executionOverviews = await ExecutionOverview.find().populate("stack").populate("service").populate("business_service");
    if (!executionOverviews || executionOverviews.length === 0) {
      return res.status(404).json({ message: [{ key: "error", value: "No Overview found" }] });
    }

    const overviewsWithFormattedImages = executionOverviews.map(overview => {
      if (overview.stack && overview.stack.image) {
        if (!overview.stack.image.startsWith(`${process.env.BACKEND_URL}/uploads/services/execution_highlights`)) {
          overview.stack.image = `${process.env.BACKEND_URL}/uploads/services/execution_highlights/${overview.stack.image}`;
        }
      }
      return overview;
    });

    return res.status(200).json({
      message: [{ key: "success", value: "Execution Overview Retrieved successfully" }],
      getAllExecutionOverviews: overviewsWithFormattedImages,
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
    const executionOverview = await ExecutionOverview.findById(req.params.id).populate("stack").populate("service").populate("business_service");
    if (!executionOverview) {
      return res.status(404).json({ message: [{ key: 'error', value: 'Execution Overview not found' }] });
    }
    if (executionOverview.stack && executionOverview.stack.image) {
      if (!executionOverview.stack.image.startsWith(`${process.env.BACKEND_URL}/uploads/services/execution_highlights`)) {
        executionOverview.stack.image = `${process.env.BACKEND_URL}/uploads/services/execution_highlights/${executionOverview.stack.image}`;
      }
    }
    return res.status(200).json({
      message: [
        {
          key: "success",
          value: "Execution Overview Retrieved successfully",
        },
      ],
      getExecutionOverviewById: executionOverview,
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
    const updatedData = req.body;

    const existingExecutionOverview = await ExecutionOverview.findById(overviewId);

    if (!existingExecutionOverview) {
        return res.status(404).json({
            message: [{ key: 'error', value: 'ExecutionOverview not found' }]
        });
    }


    const updatedExecutionOverview = await ExecutionOverview.findByIdAndUpdate(
        overviewId,
        updatedData,
    );

    if (!updatedExecutionOverview) {
        return res.status(404).json({
            message: [{ key: 'error', value: 'ExecutionOverview not found' }]
        });
    }

    return res.status(200).json({
        message: [{ key: 'success', value: 'Execution Highlights updated successfully' }]        });
} catch (error) {
    console.error(error);
    return res.status(500).json({
        message: [{ key: 'error', value: 'Internal server error' }]
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
        .json({ message: [{ key: 'error', value: 'Execution Overview not found' }] });
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
