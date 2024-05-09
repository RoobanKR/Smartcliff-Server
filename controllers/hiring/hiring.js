const Hiring = require("../../models/hiring/hiringModal");
const { createClient } = require("@supabase/supabase-js");
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseUrl = process.env.SUPABASE_URL;

const supabase = createClient(supabaseUrl, supabaseKey);

exports.createHiring = async (req, res) => {
  try {
    const {
        status,
      hiring_id,
      eligibility,
      yop,
      start_date,
      end_date,
      role,
      company_name
    } = req.body;

    // Ensure required fields are provided
    if (
      !hiring_id ||
      !eligibility ||
      !yop ||
      !start_date ||
      !end_date ||
      !role ||
      !status ||
      !company_name
    ) {
      return res.status(400).json({
        message: [{ key: "error", value: "Required fields are missing in hiring" }],
      });
    }
    
    const existingHiring_id = await Hiring.findOne({ hiring_id });
    if (existingHiring_id) {
        return res.status(403).json({ message: [{ key: "error", value: "Hiring Id already exists" }] });
    }
    const logoFile = req.files?.company_logo;
    if (!logoFile) {
      return res.status(400).json({
        message: [{ key: "error", value: "Company logo is required" }],
      });
    }

    if (logoFile.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        message: [
          {
            key: "error",
            value: "Company logo size exceeds the 5MB limit",
          },
        ],
      });
    }

    const uniqueFileName = `${Date.now()}_${logoFile.name}`;

    const { data, error } = await supabase.storage
      .from("SmartCliff/hiring/hiring")
      .upload(uniqueFileName, logoFile.data);

    if (error) {
      console.error("Error uploading logo to Supabase:", error);
      return res.status(500).json({
        message: [
          { key: "error", value: "Error uploading company logo to Supabase" },
        ],
      });
    }

    const logoUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/hiring/hiring/${uniqueFileName}`;

    const newHiring = new Hiring({
      status, 
      company_name,
      hiring_id,
      company_logo: logoUrl,
      eligibility: eligibility.split(","),
      yop,
      start_date,
      end_date,
      role,
    });

    await newHiring.save();

    return res.status(201).json({
      message: [
        { key: "success", value: "Hiring entry created successfully" },
      ],
    });
  } catch (error) {
    console.error("Error creating hiring entry:", error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};



exports.getAllHiring = async (req, res) => {
    try {
      const hire = await Hiring.find()
  
      return res.status(200).json({
        message: [{ key: "success", value: "Hiring retrieved successfully" }],
        All_hiring:hire
      });
    } catch (error) {
      console.error("Error retrieving Hiring:", error);
      return res.status(500).json({
        message: [{ key: "error", value: "Internal server error" }],
      });
    }
  };


  exports.getHiringById = async (req, res) => {
    try {
      const { id } = req.params;
      const hire = await Hiring.findById(id)
          if (!hire) {
        return res.status(404).json({
          message: [{ key: "error", value: "hiring not found" }],
        });
      }
  
      return res.status(200).json({
        message: [{ key: "success", value: "Hiring Id Based retrieved  successfully" }],
        hiring_Id_Base: hire
      });
    } catch (error) {
      console.error("Error retrieving Hiring by ID:", error);
      return res.status(500).json({
        message: [{ key: "error", value: "Internal server error" }],
      });
    }
  };

  exports.updateHiringById = async (req, res) => {
    try {
      const hiringId = req.params.id;
      const { status, hiring_id, eligibility, yop, start_date, end_date, role,company_name } = req.body;
      const imageFile = req.files?.company_logo;

      const hire = await Hiring.findById(hiringId);
  
      if (!hire) {
        return res.status(404).json({
          message: [{ key: "error", value: "Hiring not found" }],
        });
      }
  
      if (hiring_id && hiring_id !== hire.hiring_id) {
        const existingHire = await Hiring.findOne({ hiring_id });
        if (existingHire) {
          return res.status(400).json({
            message: [{ key: "error", value: `Hiring ID "${hiring_id}" is already in use` }],
          });
        }
      }
  
      if (imageFile) {
        if (hire.company_logo) {
            try {
                const imageUrlParts = hire.company_logo.split('/');
                const imageName = imageUrlParts[imageUrlParts.length - 1];
  
                const {data,error} =  await supabase.storage
                .from('SmartCliff')
                .remove(`hiring/hiring/${[imageName]}`);
               
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: [{ key: "error", value: "Error removing existing image from Supabase storage" }] });
            }
        }
  
        const uniqueFileName = `${Date.now()}_${imageFile.name}`;
  
        try {
            const { data, error } = await supabase.storage
                .from('SmartCliff/hiring/hiring')
                .upload(uniqueFileName, imageFile.data);
  
            if (error) {
                console.error(error);
                return res.status(500).json({ message: [{ key: "error", value: "Error uploading image to Supabase storage" }] });
            }
  
            const imageUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/hiring/hiring/${uniqueFileName}`;
            hire.company_logo = imageUrl;
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: [{ key: "error", value: "Error uploading image to Supabase storage" }] });
        }
    }
      hire.company_name = company_name
      hire.status = status;
      hire.hiring_id = hiring_id;
      hire.eligibility = Array.isArray(eligibility) ? eligibility : eligibility.split(",");
      hire.start_date = start_date;
      hire.end_date = end_date;
      hire.role = role;
      hire.yop = yop;
  
      await hire.save();
  
      return res.status(200).json({
        message: [{ key: "success", value: "Hiring updated successfully" }],
      });
    } catch (error) {
      console.error("Error updating hiring:", error);
      return res.status(500).json({
        message: [{ key: "error", value: "Internal server error" }],
      });
    }
  };
  
  
exports.deleteHiring = async (req, res) => {
    try {
      const { id } = req.params;
      const hire = await Hiring.findById(id);
  
      if (!hire) {
        return res.status(404).json({
          message: [{ key: "error", value: "Hiring not found" }],
        });
      }
  
      if (hire.company_logo) {
        const imageUrlParts = hire.company_logo.split('/');
        const imageName = imageUrlParts[imageUrlParts.length - 1];
  
        try {
          await supabase.storage
          .from('SmartCliff')
          .remove(`hiring/hiring/${[imageName]}`);
        } catch (error) {
          console.error("Error deleting image from Supabase:", error);
        }
      }
  
      await Hiring.findByIdAndDelete(id);
  
      return res.status(200).json({
        message: [{ key: "success", value: "Hiring deleted successfully" }],
      });
    } catch (error) {
      console.error("Error deleting Hire:", error);
      return res.status(500).json({
        message: [{ key: "error", value: "Internal server error" }],
      });
    }
  };
  