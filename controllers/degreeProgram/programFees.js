const ProgramFees = require("../../models/degreeprogram/ProgramFessModal");
const { createClient } = require('@supabase/supabase-js');
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseUrl = process.env.SUPABASE_URL;

const supabase = createClient(supabaseUrl, supabaseKey);

exports.createProgramFees = async (req, res) => {
    try {
        const { title, description,degree_program } = req.body;
        const existingProgramFees = await ProgramFees.findOne({ title });
        
        if (existingProgramFees) {
            return res.status(403).json({ message: [{ key: "error", value: "Program Fees Name already exists" }] });
        }

        if (!title || !description) {
            return res.status(400).json({ message: [{ key: "error", value: "Required fields" }] });
        }

        const iconFile = req.files?.icon;

    if (!iconFile) {
      return res.status(400).json({
        message: [{ key: "error", value: "Batches icon is required" }],
      });
    }

    if (iconFile.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        message: [
          {
            key: "error",
            value: "Batches icon size exceeds the 5MB limit",
          },
        ],
      });
    }

    const uniqueFileName = `${Date.now()}_${iconFile.name}`;

    try {
      const { data, error } = await supabase.storage
        .from('SmartCliff/degreeProgram/program_fees')
        .upload(uniqueFileName, iconFile.data);

      if (error) {
        console.error("Error uploading icon to Supabase:", error);
        return res.status(500).json({
          message: [{ key: "error", value: "Error uploading icon to Supabase" }],
        });
      }

      const iconUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/degreeProgram/program_fees/${uniqueFileName}`;

            const newProgramFees = new ProgramFees({
                title,
                description,
                icon: iconUrl,
                degree_program
            });

            await newProgramFees.save();

            return res.status(201).json({ message: [{ key: "Success", value: "Program Fees Added Successfully" }] });
          } catch (error) {           
          }
        } catch (error) {
          return res
            .status(500)
            .json({ message: [{ key: "error", value: "Internal server error" }] });
        }
      };
      

exports.getAllProgramFees = async (req, res) => {
    try {
      const programFees = await ProgramFees.find().populate("degree_program");
  
     
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Program Fees Retrieved successfully' }],
        program_feess: programFees,
      });
    } catch (error) {
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  
  exports.getProgramFeesById = async (req, res) => {
    const { id } = req.params;
    try {
      const programFees = await ProgramFees.findById(id).populate("degree_program");
      if (!programFees) {
        return res.status(404).json({ message: [{ key: 'error', value: 'Program Fees not found' }] });
      }
      return res.status(200).json({
        message: [{ key: 'success', value: 'Program Fees Retrieved successfully' }],
        programFeesById:programFees
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  


  
  exports.updateProgramFees = async (req, res) => {
    try {
      const feesId = req.params.id;
      const updatedData = req.body;
      const iconFile = req.files ? req.files.icon : null;
  
      const existingProgramFees = await ProgramFees.findById(feesId);
  
      if (!existingProgramFees) {
        return res.status(404).json({
          message: [{ key: 'error', value: 'Program Fees not found' }]
        });
      }
  
      if (iconFile) {
        if (existingProgramFees.icon) {
            try {
                const iconUrlParts = existingProgramFees.icon.split('/');
                const iconName = iconUrlParts[iconUrlParts.length - 1];
  
                const {data,error} =  await supabase.storage
                .from('SmartCliff')
                .remove(`degreeProgram/program_fees/${[iconName]}`);
               
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: [{ key: "error", value: "Error removing existing icon from Supabase storage" }] });
            }
        }
  
        const uniqueFileName = `${Date.now()}_${iconFile.name}`;
  
        try {
            const { data, error } = await supabase.storage
                .from('SmartCliff/degreeProgram/program_fees')
                .upload(uniqueFileName, iconFile.data);
  
            if (error) {
                console.error(error);
                return res.status(500).json({ message: [{ key: "error", value: "Error uploading icon to Supabase storage" }] });
            }
  
            const iconUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/degreeProgram/program_fees/${uniqueFileName}`;
            updatedData.icon = iconUrl;
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: [{ key: "error", value: "Error uploading icon to Supabase storage" }] });
        }
    }
  
      const updatedProgramFees = await ProgramFees.findByIdAndUpdate(
        feesId,
        updatedData      );
  
      if (!updatedProgramFees) {
        return res.status(404).json({
          message: [{ key: 'error', value: 'Program Fees not found' }]
        });
      }
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Program Fees updated successfully' }]
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: [{ key: 'error', value: 'Internal server error' }]
      });
    }
  };

  exports.deleteProgramFees = async (req, res) => {
    const { id } = req.params;
  
    try {
      const programFees = await ProgramFees.findById(id);
      if (!programFees) {
        return res.status(404).json({ message: [{ key: 'error', value: 'Program Fees not found' }] });
      }
  
      if (programFees.icon) {
        const iconUrlParts = programFees.icon.split('/');
        const iconName = iconUrlParts[iconUrlParts.length - 1];
  
        try {
          await supabase.storage
          .from('SmartCliff')
          .remove(`degreeProgram/program_fees/${[iconName]}`);
        } catch (error) {
          console.error("Error deleting icon from Supabase:", error);
        }
      }
  
        await ProgramFees.findByIdAndDelete(id);
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Program Fees deleted successfully' }],
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  