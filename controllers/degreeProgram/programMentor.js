const ProgramMentor = require("../../models/degreeprogram/ProgramMentorModal");
const { createClient } = require('@supabase/supabase-js');
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseUrl = process.env.SUPABASE_URL;

const supabase = createClient(supabaseUrl, supabaseKey);

exports.createProgramMentor = async (req, res) => {
  try {
    const {
      name,
      designation,
      degree_program,
    } = req.body;

    // Validate the required fields
    if (!name || !designation) {
      return res
        .status(400)
        .json({ message: [{ key: "error", value: "Required fields missing" }] });
    }

    // Validate the image
    const imageFile = req.files?.image;
    if (!imageFile) {
      return res.status(400).json({
        message: [{ key: "error", value: "Mentor image is required" }],
      });
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        message: [{ key: "error", value: "Image size exceeds the 5MB limit" }],
      });
    }

    const uniqueFileName = `${Date.now()}_${imageFile.name}`;

    const { data, error } = await supabase.storage
      .from("SmartCliff/degreeProgram/program_mentor")
      .upload(uniqueFileName, imageFile.data);

    if (error) {
      console.error("Error uploading image to Supabase:", error);
      return res.status(500).json({
        message: [{ key: "error", value: "Error uploading image to Supabase" }],
      });
    }

    const imageUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/degreeProgram/program_mentor/${uniqueFileName}`;

    const newProgramMentor = new ProgramMentor({
      name,
      designation,
      image: imageUrl,
      degree_program,
    });

    await newProgramMentor.save();

    return res.status(201).json({
      message: [{ key: "success", value: "Program Mentor added successfully" }],
      Program_Mentor: newProgramMentor,
    });

  } catch (error) {
    console.error("Internal server error:", error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};
exports.getAllProgramMentor = async (req, res) => {
    try {
      const programMentor = await ProgramMentor.find().populate("degree_program");
  
     
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Program Mentor Retrieved successfully' }],
        programMentor: programMentor,
      });
    } catch (error) {
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };

  exports.getProgramMentorById = async (req, res) => {
    const { id } = req.params;
    try {
      const programMentor = await ProgramMentor.findById(id).populate("degree_program");
      if (!programMentor) {
        return res.status(404).json({ message: [{ key: 'error', value: 'Program Mentor not found' }] });
      }
      
      return res.status(200).json({
        message: [{ key: 'success', value: 'Program Mentor Retrieved successfully' }],
        programMentorById: programMentor
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  

  exports.updateProgramMentor = async (req, res) => {
    try {
      const mentorId = req.params.id;
      const updatedData = req.body;
      const imageFile = req.files ? req.files.image : null;
  
      const existingProgramMentor = await ProgramMentor.findById(mentorId);
  
      if (!existingProgramMentor) {
        return res.status(404).json({
          message: [{ key: 'error', value: 'Program Mentor not found' }]
        });
      }
  
      if (imageFile) {
        if (existingProgramMentor.image) {
            try {
                const imageUrlParts = existingProgramMentor.image.split('/');
                const imageName = imageUrlParts[imageUrlParts.length - 1];
  
                const {data,error} =  await supabase.storage
                .from('SmartCliff')
                .remove(`degreeProgram/program_mentor/${[imageName]}`);
               
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: [{ key: "error", value: "Error removing existing image from Supabase storage" }] });
            }
        }
  
        const uniqueFileName = `${Date.now()}_${imageFile.name}`;
  
        try {
            const { data, error } = await supabase.storage
                .from('SmartCliff/degreeProgram/program_mentor')
                .upload(uniqueFileName, imageFile.data);
  
            if (error) {
                console.error(error);
                return res.status(500).json({ message: [{ key: "error", value: "Error uploading image to Supabase storage" }] });
            }
  
            const imageUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/degreeProgram/program_mentor/${uniqueFileName}`;
            updatedData.image = imageUrl;
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: [{ key: "error", value: "Error uploading image to Supabase storage" }] });
        }
    }
  
      const updatedProgramMentor = await ProgramMentor.findByIdAndUpdate(
        mentorId,
        updatedData      );
  
      if (!updatedProgramMentor) {
        return res.status(404).json({
          message: [{ key: 'error', value: 'Program Mentor not found' }]
        });
      }
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Program Mentor updated successfully' }]
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: [{ key: 'error', value: 'Internal server error' }]
      });
    }
  };

  exports.deleteProgramMentor = async (req, res) => {
    const { id } = req.params;
  
    try {
      const programMentor = await ProgramMentor.findById(id);
      if (!programMentor) {
        return res.status(404).json({ message: [{ key: 'error', value: 'Program Mentor not found' }] });
      }
  
      if (programMentor.image) {
        const imageUrlParts = programMentor.image.split('/');
        const imageName = imageUrlParts[imageUrlParts.length - 1];
  
        try {
          await supabase.storage
          .from('SmartCliff')
                .remove(`degreeProgram/program_mentor/${[imageName]}`);
        } catch (error) {
          console.error("Error deleting image from Supabase:", error);
        }
      }
        await ProgramMentor.findByIdAndDelete(id);
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Program Mentor deleted successfully' }],
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  