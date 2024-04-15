const CareerOppertunities = require("../models/CareerOppertunitiesModal");
const path = require("path");
const fs = require('fs');

exports.createCareerOppertunities = async (req, res) => {
    try {
        const { company_name, description,course } = req.body;
        const existingCareerOpportunities = await CareerOppertunities.findOne({ company_name });
        
        if (existingCareerOpportunities) {
            return res.status(403).json({ message: [{ key: "error", value: "Company Name already exists" }] });
        }

        if (!company_name || !description) {
            return res.status(400).json({ message: [{ key: "error", value: "Required fields" }] });
        }

        let imageFile = req.files.image;

        if (!imageFile) {
            return res.status(400).json({ message: [{ key: "error", value: "Career Opportunities image is required" }] });
        }

        if (imageFile.size > 3 * 1024 * 1024) {
            return res.status(400).json({ message: [{ key: "error", value: "Career Opportunities image size exceeds the 3MB limit" }] });
        }

        const uniqueFileName = `${Date.now()}_${imageFile.name}`;
        const uploadPath = path.join(__dirname, "../uploads/career_opportunities", uniqueFileName);

        try {
            await imageFile.mv(uploadPath);

            const newCareerOpportunities = new CareerOppertunities({
                company_name,
                description,
                image: uniqueFileName,
                course
            });

            await newCareerOpportunities.save();

            return res.status(201).json({ message: [{ key: "Success", value: "Career Opportunities Added Successfully" }] });
        } catch (error) {
            console.error("Error moving the Career Opportunities Image file:", error);
            return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
};


exports.getAllCareerOpportunities = async (req, res) => {
    try {
      const careerOpportunities = await CareerOppertunities.find().populate("course");
  
      const careerOpportunitiesWithImageUrls = careerOpportunities.map((opportunity) => {
        return {
          ...opportunity.toObject(),
          image: opportunity.image ? process.env.BACKEND_URL + '/uploads/career_opportunities/' + opportunity.image : null,
        };
      });
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Career Opportunities Retrieved successfully' }],
        careerOpportunities: careerOpportunitiesWithImageUrls,
      });
    } catch (error) {
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  
  exports.getCareerOpportunityById = async (req, res) => {
    const { id } = req.params;
    try {
      const careerOpportunity = await CareerOppertunities.findById(id).populate("course");
      if (!careerOpportunity) {
        return res.status(404).json({ message: [{ key: 'error', value: 'Career Opportunity not found' }] });
      }
      const imageURL = careerOpportunity.image ? `${process.env.BACKEND_URL}/uploads/career_opportunities/${careerOpportunity.image}` : null;
      return res.status(200).json({
        message: [{ key: 'success', value: 'Career Opportunity Retrieved successfully' }],
        careerOpportunity: {
          ...careerOpportunity.toObject(),
          image: imageURL,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  


  exports.updateCareerOpportunity = async (req, res) => {
    const { id } = req.params;
    const { company_name, description,course } = req.body;
    let newImage = req.files ? req.files.image : null;
  
    try {
      const careerOpportunity = await CareerOppertunities.findById(id);
      if (!careerOpportunity) {
        return res.status(404).json({ message: [{ key: 'error', value: 'Career Opportunity not found' }] });
      }
  
      if (careerOpportunity.image) {
        const oldImagePath = path.join(__dirname, '../uploads/career_opportunities', careerOpportunity.image);
        fs.unlinkSync(oldImagePath);
      }
  
      careerOpportunity.company_name = company_name;
      careerOpportunity.description = description;
      careerOpportunity.course = course;

  
      if (newImage) {
        careerOpportunity.image = null;
  
        const uniqueFileName = `${Date.now()}_${newImage.name}`;
        const uploadPath = path.join(__dirname, '../uploads/career_opportunities', uniqueFileName);
        await newImage.mv(uploadPath);
  
        careerOpportunity.image = uniqueFileName;
      }
  
      await careerOpportunity.save();
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Career Opportunity updated successfully' }],
        careerOpportunity,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  

  exports.deleteCareerOpportunity = async (req, res) => {
    const { id } = req.params;
  
    try {
      const careerOpportunity = await CareerOppertunities.findById(id);
      if (!careerOpportunity) {
        return res.status(404).json({ message: [{ key: 'error', value: 'Career Opportunity not found' }] });
      }
  
      if (careerOpportunity.image) {
        const imagePath = path.join(__dirname, '../uploads/career_opportunities', careerOpportunity.image);
        fs.unlinkSync(imagePath);
      }
        await CareerOppertunities.findByIdAndDelete(id);
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Career Opportunity deleted successfully' }],
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  