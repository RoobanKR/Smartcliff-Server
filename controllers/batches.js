const Batches = require("../models/BatchesModal");
const { createClient } = require('@supabase/supabase-js');
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseUrl = process.env.SUPABASE_URL;

const supabase = createClient(supabaseUrl, supabaseKey);


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

    const imageFile = req.files?.image;

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
            value: "Batches image size exceeds the 5MB limit",
          },
        ],
      });
    }

    const uniqueFileName = `${Date.now()}_${imageFile.name}`;

    try {
      const { data, error } = await supabase.storage
        .from('SmartCliff/courses/batches')
        .upload(uniqueFileName, imageFile.data);

      if (error) {
        console.error("Error uploading image to Supabase:", error);
        return res.status(500).json({
          message: [{ key: "error", value: "Error uploading image to Supabase" }],
        });
      }

      const imageUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/courses/batches/${uniqueFileName}`;

      const newBatch = new Batches({
        category,
        course,
        branch,
        batch_type,
        mode_of_type,
        start_date,
        duration,
        contact,
        image: imageUrl,
      });

      await newBatch.save();

      return res.status(201).json({
        message: [
          {
            key: "success",
            value: "Batch created successfully",
          },
        ],
      });
    } catch (error) {
      console.error("Error saving batch:", error);
      return res
        .status(500)
        .json({ message: [{ key: "error", value: "Internal server error" }] });
    }
  } catch (error) {
    console.error("Error creating batch:", error);
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

    return res.status(200).json({
      message: [{ key: "success", value: "Batches retrieved successfully" }],
      All_batches:batches
    });
  } catch (error) {
    console.error("Error retrieving batches:", error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
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

    return res.status(200).json({
      message: [{ key: "success", value: "Batch retrieved successfully" }],
      batch_Id_Base: batch
    });
  } catch (error) {
    console.error("Error retrieving batch by ID:", error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};

exports.updateBatches = async (req, res) => {
  try {
    const batchId = req.params.id;
    const updatedData = req.body;
    const imageFile = req.files?.image;

    const existingBatch = await Batches.findById(batchId);

    if (!existingBatch) {
      return res.status(404).json({
        message: [{ key: "error", value: "Batch not found" }],
      });
    }

    if (imageFile) {
      if (existingBatch.image) {
          try {
              const imageUrlParts = existingBatch.image.split('/');
              const imageName = imageUrlParts[imageUrlParts.length - 1];

              const {data,error} =  await supabase.storage
              .from('SmartCliff')
              .remove(`courses/batches/${[imageName]}`);
             
          } catch (error) {
              console.error(error);
              return res.status(500).json({ message: [{ key: "error", value: "Error removing existing image from Supabase storage" }] });
          }
      }

      const uniqueFileName = `${Date.now()}_${imageFile.name}`;

      try {
          const { data, error } = await supabase.storage
              .from('SmartCliff/courses/batches')
              .upload(uniqueFileName, imageFile.data);

          if (error) {
              console.error(error);
              return res.status(500).json({ message: [{ key: "error", value: "Error uploading image to Supabase storage" }] });
          }

          const imageUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/courses/batches/${uniqueFileName}`;
          updatedData.image = imageUrl;
      } catch (error) {
          console.error(error);
          return res.status(500).json({ message: [{ key: "error", value: "Error uploading image to Supabase storage" }] });
      }
  }

    const updatedBatch = await Batches.findByIdAndUpdate(batchId, updatedData, { new: true });

    return res.status(200).json({
      message: [{ key: "success", value: "Batch updated successfully" }]});
  } catch (error) {
    console.error("Error updating batch:", error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};

exports.deleteBatches = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await Batches.findById(id);

    if (!batch) {
      return res.status(404).json({
        message: [{ key: "error", value: "Batch not found" }],
      });
    }

    if (batch.image) {
      const imageUrlParts = batch.image.split('/');
      const imageName = imageUrlParts[imageUrlParts.length - 1];

      try {
        await supabase.storage
        .from('SmartCliff')
        .remove(`courses/batches/${[imageName]}`);
      } catch (error) {
        console.error("Error deleting image from Supabase:", error);
      }
    }

    await Batches.findByIdAndDelete(id);

    return res.status(200).json({
      message: [{ key: "success", value: "Batch deleted successfully" }],
    });
  } catch (error) {
    console.error("Error deleting batch:", error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};
