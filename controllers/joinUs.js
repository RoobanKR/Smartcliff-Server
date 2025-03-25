const JoinUs = require("../models/JoinUsModal");

exports.createJobPosition = async (req, res) => {
    try {
        const { job_position, description, createdBy } = req.body;

        const newJob = new JoinUs({
            job_position,
            description,
            selected: true, 
            createdBy,
            createdAt: new Date(),
        });

        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (error) {
        res.status(500).json({ message: "Error creating job position", error });
    }
};

// Get all JobPositions
exports.getAllJobPositions = async (req, res) => {
 try {
     const joinus = await JoinUs.find()
 
     return res.status(200).json({
       message: [{ key: "success", value: "Join Us retrieved successfully" }],
       All_joinus:joinus
     });
   } catch (error) {
     console.error("Error retrieving joinus:", error);
     return res.status(500).json({
       message: [{ key: "error", value: "Internal server error" }],
     });
   }
 };

// Get JoinUs by ID
exports.getJobPositionById = async (req, res) => {
   try {
      const { id } = req.params;
      const joinus = await JoinUs.findById(id)
      if (!joinus) {
        return res.status(404).json({
          message: [{ key: "error", value: "joinus not found" }],
        });
      }
  
      return res.status(200).json({
        message: [{ key: "success", value: "Join us retrieved successfully" }],
        joinUsGetById: joinus
      });
    } catch (error) {
      console.error("Error retrieving joinus by ID:", error);
      return res.status(500).json({
        message: [{ key: "error", value: "Internal server error" }],
      });
    }
  };
  
// Update JoinUs
exports.updateJobPosition = async (req, res) => {
    try {
        const updatedJob = await JoinUs.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedJob) return res.status(404).json({ message: "Job position not found" });
        res.status(200).json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: "Error updating job position", error });
    }
};

// Delete JoinUs
exports.deleteJobPosition = async (req, res) => {
    try {
        const deletedJob = await JoinUs.findByIdAndDelete(req.params.id);
        if (!deletedJob) return res.status(404).json({ message: "Job position not found" });
        res.status(200).json({ message: "Job position deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting job position", error });
    }
};

// Change Selected JoinUs (Set selected=true for one, false for others)
exports.updateSelectedJobPosition = async (req, res) => {
    try {
        const { id } = req.params;
        const { selected } = req.body; // Read `selected` from request body


        const updatedJob = await JoinUs.findByIdAndUpdate(id, { selected });

        if (!updatedJob) {
            return res.status(404).json({ message: "Job position not found" });
        }

        res.status(200).json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: "Error updating selected job position", error });
    }
};
