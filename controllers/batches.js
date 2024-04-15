const Batches = require("../models/BatchesModal");
const path = require("path");
const fs = require("fs");

exports.createBatches = async (req, res) => {
  try {
    const {
      category,
      course,
      branch,
      batch_type,
      mode_of_type,
      start_date,
      duration,
      contact,
    } = req.body;

    if (
      !category ||
      !course ||
      !branch ||
      !batch_type ||
      !mode_of_type ||
      !start_date ||
      !duration
    ) {
      return res
        .status(400)
        .json({ message: [{ key: "error", value: "Required fields" }] });
    }

    let imageFile = req.files.image;

    if (!imageFile) {
      return res.status(400).json({
        message: [{ key: "error", value: "Batches image is required" }],
      });
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        message: [
          {
            key: "error",
            value: "Batches image size exceeds the 3MB limit",
          },
        ],
      });
    }

    const uniqueFileName = `${Date.now()}_${imageFile.name}`;
    const uploadPath = path.join(
      __dirname,
      "../uploads/batches",
      uniqueFileName
    );

    try {
      await imageFile.mv(uploadPath);

      const newbranch = new Batches({
        category,
        course,
        branch,
        batch_type,
        mode_of_type,
        start_date,
        duration,
        contact,
        image: uniqueFileName,
      });

      await newbranch.save();

      return res.status(201).json({
        message: [
          {
            key: "Success",
            value: "Batches Added Successfully",
          },
        ],
      });
    } catch (error) {
      console.error("Error moving the Batches Image file:", error);
      return res
        .status(500)
        .json({ message: [{ key: "error", value: "Internal server error" }] });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.getAllBatches = async (req, res) => {
  try {
    const batches = await Batches.find()
      .populate({
        path: "course",
        populate: {
          path: "instructor",
          model: "Instructor",
        },
      })
      .populate("category");

    const batchesWithImageUrls = batches.map((batch) => {
      return {
        ...batch.toObject(),
        image: batch.image
          ? process.env.BACKEND_URL + "/uploads/batches/" + batch.image
          : null,
      };
    });

    return res.status(200).json({
      message: [{ key: "success", value: "Batches Retrieved successfully" }],
      All_batches: batchesWithImageUrls,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.getBatchesById = async (req, res) => {
  try {
    const { id } = req.params;

    const batch = await Batches.findById(id)
      .populate({
        path: "course",
        populate: {
          path: "instructor",
          model: "Instructor",
        },
      })
      .populate("category");

    if (!batch) {
      return res.status(404).json({
        message: [{ key: "error", value: "Batch not found" }],
      });
    }

    const batchWithImageUrl = {
      ...batch.toObject(),
      image: batch.image
        ? process.env.BACKEND_URL + "/uploads/batches/" + batch.image
        : null,
    };

    return res.status(200).json({
      message: [
        { key: "success", value: "Batch Id Based Retrieved Successfully" },
      ],
      batch_Id_Base: batchWithImageUrl,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.updateBatches = async (req, res) => {
  try {
    const batchId = req.params.id;
    const updatedData = req.body;
    const imageFile = req.files ? req.files.image : null;

    const existingbatches = await Batches.findById(batchId);

    if (!existingbatches) {
      return res.status(404).json({
        message: [{ key: "error", value: "Batches not found" }],
      });
    }

    if (imageFile) {
      const imagePathToDelete = path.join(
        __dirname,
        "../uploads/batches",
        existingbatches.image
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
        "../uploads/batches",
        uniqueFileName
      );
      await imageFile.mv(uploadPath);
      updatedData.image = uniqueFileName;
    }

    const updatedBatches = await Batches.findByIdAndUpdate(
      batchId,
      updatedData
    );

    if (!updatedBatches) {
      return res.status(404).json({
        message: [{ key: "error", value: "Batches not found" }],
      });
    }

    return res.status(200).json({
      message: [{ key: "success", value: "Batches updated successfully" }],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};

exports.deleteBatches = async (req, res) => {
  const { id } = req.params;

  try {
    const batches = await Batches.findById(id);
    if (!batches) {
      return res
        .status(404)
        .json({ message: [{ key: "error", value: "Batches not found" }] });
    }

    if (batches.image) {
      const imagePath = path.join(
        __dirname,
        "../uploads/batches",
        batches.image
      );
      fs.unlinkSync(imagePath);
    }
    await Batches.findByIdAndDelete(id);

    return res.status(200).json({
      message: [{ key: "success", value: "Batches deleted successfully" }],
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};
