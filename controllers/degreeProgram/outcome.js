const Outcome = require("../../models/degreeprogram/OutcomesModal");
const path = require("path");
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseUrl = process.env.SUPABASE_URL;

const supabase = createClient(supabaseUrl, supabaseKey);

exports.createOutcome = async (req, res) => {
    try {
        const { title,degree_program } = req.body;
        const existingOutcome = await Outcome.findOne({ title });
        
        if (existingOutcome) {
            return res.status(403).json({ message: [{ key: "error", value: "Outcome Name already exists" }] });
        }

        if (!title) {
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

      const { data, error } = await supabase.storage
        .from('SmartCliff/degreeProgram/outcome')
        .upload(uniqueFileName, iconFile.data);

      if (error) {
        console.error("Error uploading icon to Supabase:", error);
        return res.status(500).json({
          message: [{ key: "error", value: "Error uploading icon to Supabase" }],
        });
      }

      const iconUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/degreeProgram/outcome/${uniqueFileName}`;


      
            const newOutcome = new Outcome({
                title,
                icon: iconUrl,
                degree_program
            });

            await newOutcome.save();

            return res.status(201).json({ message: [{ key: "Success", value: "Outcome Added Successfully" }] });
        } catch (error) {
            return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
        }
    
};

exports.getAllOutcome = async (req, res) => {
    try {
      const outcome = await Outcome.find().populate("degree_program");
  
     
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Outcome Retrieved successfully' }],
        AllOutcomes: outcome,
      });
    } catch (error) {
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };


  exports.getOutcomeById = async (req, res) => {
    const { id } = req.params;
    try {
      const outcome = await Outcome.findById(id).populate("degree_program");
      if (!outcome) {
        return res.status(404).json({ message: [{ key: 'error', value: 'outcome not found' }] });
      }
      return res.status(200).json({
        message: [{ key: 'success', value: 'Outcome Retrieved successfully' }],
        outcomeById:outcome
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  
  
  exports.updateOutcome = async (req, res) => {
    try {
      const outcomeId = req.params.id;
      const updatedData = req.body;
      const iconFile = req.files ? req.files.icon : null;
  
      const existingOutcome = await Outcome.findById(outcomeId);
  
      if (!existingOutcome) {
        return res.status(404).json({
          message: [{ key: 'error', value: 'Outcome not found' }]
        });
      }
  
      if (iconFile) {
        if (existingOutcome.icon) {
            try {
                const iconUrlParts = existingOutcome.icon.split('/');
                const iconName = iconUrlParts[iconUrlParts.length - 1];
  
                const {data,error} =  await supabase.storage
                .from('SmartCliff')
                .remove(`degreeProgram/outcome/${[iconName]}`);
               
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: [{ key: "error", value: "Error removing existing icon from Supabase storage" }] });
            }
        }
  
        const uniqueFileName = `${Date.now()}_${iconFile.name}`;
  
        try {
            const { data, error } = await supabase.storage
                .from('SmartCliff/degreeProgram/outcome')
                .upload(uniqueFileName, iconFile.data);
  
            if (error) {
                console.error(error);
                return res.status(500).json({ message: [{ key: "error", value: "Error uploading icon to Supabase storage" }] });
            }
  
            const iconUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/degreeProgram/outcome/${uniqueFileName}`;
            updatedData.icon = iconUrl;
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: [{ key: "error", value: "Error uploading icon to Supabase storage" }] });
        }
    }
      const updatedOutcome = await Outcome.findByIdAndUpdate(
        outcomeId,
        updatedData      );
  
      if (!updatedOutcome) {
        return res.status(404).json({
          message: [{ key: 'error', value: 'Outcome not found' }]
        });
      }
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Outcome updated successfully' }]
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: [{ key: 'error', value: 'Internal server error' }]
      });
    }
  };

  exports.deleteOutcome = async (req, res) => {
    const { id } = req.params;
  
    try {
      const outcome = await Outcome.findById(id);
      if (!outcome) {
        return res.status(404).json({ message: [{ key: 'error', value: 'Outcome not found' }] });
      }
      if (outcome.icon) {
        const iconUrlParts = outcome.icon.split('/');
        const iconName = iconUrlParts[iconUrlParts.length - 1];
  
        try {
          await supabase.storage
          .from('SmartCliff')
          .remove(`degreeProgram/outcome/${[iconName]}`);
        } catch (error) {
          console.error("Error deleting icon from Supabase:", error);
        }
      }
  
        await Outcome.findByIdAndDelete(id);
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Outcome deleted successfully' }],
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  