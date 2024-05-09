const { createClient } = require("@supabase/supabase-js");
const CareerOppertunities = require("../models/CareerOppertunitiesModal");
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseUrl = process.env.SUPABASE_URL;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.createCareerOppertunities = async (req, res) => {
  try {
    const { company_name, description, course } = req.body;

    const existingCareerOpportunities = await CareerOppertunities.findOne({
      company_name,
    });

    if (existingCareerOpportunities) {
      return res
        .status(403)
        .json({ message: [{ key: "error", value: "Company name already exists" }] });
    }

    if (!company_name || !description) {
      return res
        .status(400)
        .json({ message: [{ key: "error", value: "Required fields" }] });
    }

    const imageFile = req.files?.image;

    if (!imageFile) {
      return res.status(400).json({
        message: [{ key: "error", value: "Career Opportunities image is required" }],
      });
    }

    if (imageFile.size > 3 * 1024 * 1024) {
      return res.status(400).json({
        message: [
          {
            key: "error",
            value: "Career Opportunities image size exceeds the 3MB limit",
          },
        ],
      });
    }

    const uniqueFileName = `${Date.now()}_${imageFile.name}`;

    try {
      const { data, error } = await supabase.storage
        .from("SmartCliff/courses/career_opportunities")
        .upload(uniqueFileName, imageFile.data);

      if (error) {
        console.error("Error uploading image to Supabase:", error);
        return res
          .status(500)
          .json({ message: [{ key: "error", value: "Error uploading image to Supabase" }] });
      }

      const imageUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/courses/career_opportunities/${uniqueFileName}`;

      const newCareerOpportunities = new CareerOppertunities({
        company_name,
        description,
        image: imageUrl,
        course,
      });

      await newCareerOpportunities.save();

      return res.status(201).json({
        message: [{ key: "success", value: "Career Opportunities added successfully" }],
      });
    } catch (error) {
      console.error("Error saving career opportunity:", error);
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

exports.getAllCareerOpportunities = async (req, res) => {
  try {
    const careerOpportunities = await CareerOppertunities.find().populate("course");

    const careerOpportunitiesWithImageUrls = careerOpportunities.map((opportunity) => {
      return {
        ...opportunity.toObject(),
        image: opportunity.image || null,
      };
    });

    return res.status(200).json({
      message: [{ key: "success", value: "Career Opportunities retrieved successfully" }],
      careerOpportunities: careerOpportunitiesWithImageUrls,
    });
  } catch (error) {
    console.error("Error retrieving career opportunities:", error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.getCareerOpportunityById = async (req, res) => {
  try {
    const { id } = req.params;
    const careerOpportunity = await CareerOppertunities.findById(id).populate("course");

    if (!careerOpportunity) {
      return res
        .status(404)
        .json({ message: [{ key: "error", value: "Career opportunity not found" }] });
    }

    return res.status(200).json({
      message: [{ key: "success", value: "Career opportunity retrieved successfully" }],
      careerOpportunity: {
        ...careerOpportunity.toObject(),
        image: careerOpportunity.image || null,
      },
    });
  } catch (error) {
    console.error("Error retrieving career opportunity by ID:", error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.updateCareerOpportunity = async (req, res) => {
  try {
    const { id } = req.params;
    const { company_name, description, course } = req.body;
    const newImage = req.files?.image;

    const careerOpportunity = await CareerOppertunities.findById(id);

    if (!careerOpportunity) {
      return res
        .status(404)
        .json({ message: [{ key: "error", value: "Career opportunity not found" }] });
    }

    if (careerOpportunity.image && newImage) {
      const imageUrlParts = careerOpportunity.image.split("/");
      const imageName = imageUrlParts[imageUrlParts.length - 1];

      try {
        const {data,error} =  await supabase.storage
              .from('SmartCliff')
              .remove(`courses/career_opportunities/${[imageName]}`);
      } catch (error) {
        console.error("Error removing existing image from Supabase:", error);
        return res
          .status(500)
          .json({ message: [{ key: "error", value: "Error removing existing image" }] });
      }
    }

    if (newImage) {
      const uniqueFileName = `${Date.now()}_${newImage.name}`;

      try {
        const { data, error } = await supabase.storage
          .from("SmartCliff/courses/career_opportunities")
          .upload(uniqueFileName, newImage.data);

        if (error) {
          console.error("Error uploading new image to Supabase:", error);
          return res
            .status(500)
            .json({ message: [{ key: "error", value: "Error uploading new image" }] });
        }

        careerOpportunity.image = `${supabaseUrl}/storage/v1/object/public/SmartCliff/courses/career_opportunities/${uniqueFileName}`;
      } catch (error) {
        console.error("Error uploading new image:", error);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
      }
    }

    careerOpportunity.company_name = company_name;
    careerOpportunity.description = description;
    careerOpportunity.course = course;

    await careerOpportunity.save();

    return res.status(200).json({
      message: [{ key: "success", value: "Career opportunity updated successfully" }],
      careerOpportunity,
    });
  } catch (error) {
    console.error("Error updating career opportunity:", error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.deleteCareerOpportunity = async (req, res) => {
  try {
    const { id } = req.params;

    const careerOpportunity = await CareerOppertunities.findById(id);

    if (!careerOpportunity) {
      return res
        .status(404)
        .json({ message: [{ key: "error", value: "Career opportunity not found" }] });
    }

    if (careerOpportunity.image) {
      const imageUrlParts = careerOpportunity.image.split("/");
      const imageName = imageUrlParts[imageUrlParts.length - 1];

      try {
         await supabase.storage
              .from('SmartCliff')
              .remove(`courses/career_opportunities/${[imageName]}`);
      } catch (error) {
        console.error("Error removing existing image from Supabase:", error);
      }
    }

    await CareerOppertunities.findByIdAndDelete(id);

    return res.status(200).json({
      message: [{ key: "success", value: "Career opportunity deleted successfully" }],
    });
  } catch (error) {
    console.error("Error deleting career opportunity:", error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};
