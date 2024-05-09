const OurProgram = require("../../models/degreeprogram/OurProgramModal");
const path = require("path");
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseUrl = process.env.SUPABASE_URL;

const supabase = createClient(supabaseUrl, supabaseKey);

exports.createOurProgram = async (req, res) => {
  try {
      const { title, description, degree_program } = req.body;

      const existingOurProgram = await OurProgram.findOne({ title });
      
      if (existingOurProgram) {
          return res.status(403).json({ message: [{ key: "error", value: "Our Program Name already exists" }] });
      }

      if (!title || !description) {
          return res.status(400).json({ message: [{ key: "error", value: "Required fields" }] });
      }

      const iconFile = req.files?.icon;

      if (!iconFile) {
          return res.status(400).json({
              message: [{ key: "error", value: "Our Program icon is required" }],
          });
      }

      if (iconFile.size > 5 * 1024 * 1024) {
          return res.status(400).json({
              message: [{ key: "error", value: "Our Program icon size exceeds the 5MB limit" }],
          });
      }

      const uniqueFileName = `${Date.now()}_${iconFile.name}`;

      const { error: uploadError } = await supabase.storage
          .from('SmartCliff/degreeProgram/our_program') // Ensure this is the correct bucket name/path
          .upload(uniqueFileName, iconFile.data);

      if (uploadError) {
          console.error("Error uploading icon to Supabase:", uploadError);
          return res.status(500).json({
              message: [{ key: "error", value: "Error uploading icon to Supabase" }],
          });
      }

      const iconUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/degreeProgram/our_program/${uniqueFileName}`;

      const newOurProgram = new OurProgram({
          title,
          description,
          icon: iconUrl,
          degree_program,
      });

      await newOurProgram.save();

      return res.status(201).json({ message: [{ key: "success", value: "Our Program added successfully" }] });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};



exports.getAllOurProgram = async (req, res) => {
    try {
      const ourPrograms = await OurProgram.find().populate("degree_program");
  
      
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Our Program Retrieved successfully' }],
        our_Programs: ourPrograms,
      });
    } catch (error) {
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  
  exports.getOurProgramById = async (req, res) => {
    const { id } = req.params;
    try {
      const ourPrograms = await OurProgram.findById(id).populate("degree_program");
      if (!ourPrograms) {
        return res.status(404).json({ message: [{ key: 'error', value: 'Our Program not found' }] });
      }
      return res.status(200).json({
        message: [{ key: 'success', value: 'Our Program Retrieved successfully' }],
        our_ProgramsById: ourPrograms
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  


  
  exports.updateOurProgram = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, degree_program } = req.body;
      const newIconFile = req.files?.icon;
  
      const ourProgram = await OurProgram.findById(id);
  
      if (!ourProgram) {
        return res.status(404).json({
          message: [{ key: "error", value: "Our Program not found" }],
        });
      }
  
      if (newIconFile) {
        // If there's an existing icon, remove it from Supabase
        if (ourProgram.icon) {
          const existingIconParts = ourProgram.icon.split("/");
          const existingIconName = existingIconParts[existingIconParts.length - 1];
  
          try {
            const { error } = await supabase.storage
            .from('SmartCliff')
            .remove(`degreeProgram/our_program/${[existingIconName]}`);
  
            if (error) {
              console.error("Error removing existing icon from Supabase storage:", error);
              return res.status(500).json({
                message: [{ key: "error", value: "Error removing existing icon from Supabase storage" }],
              });
            }
          } catch (error) {
            console.error("Error removing icon from Supabase storage:", error);
            return res.status(500).json({
              message: [{ key: "error", value: "Internal server error" }],
            });
          }
        }
  
        // Upload the new icon to Supabase
        const uniqueFileName = `${Date.now()}_${newIconFile.name}`;
  
        try {
          const { data, error } = await supabase.storage
            .from("SmartCliff/degreeProgram/our_program")
            .upload(uniqueFileName, newIconFile.data);
  
          if (error) {
            console.error("Error uploading new icon to Supabase storage:", error);
            return res.status(500).json({
              message: [{ key: "error", value: "Error uploading new icon to Supabase storage" }],
            });
          }
  
          const iconUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/degreeProgram/our_program/${uniqueFileName}`;
          ourProgram.icon = iconUrl;
        } catch (error) {
          console.error("Error uploading new icon to Supabase storage:", error);
          return res.status(500).json({
            message: [{ key: "error", value: "Internal server error" }],
          });
        }
      }
  
      ourProgram.title = title;
      ourProgram.description = description;
      ourProgram.degree_program = degree_program;
  
      await ourProgram.save();
  
      return res.status(200).json({
        message: [{ key: "success", value: "Our Program updated successfully" }],
        ourProgram,
      });
    } catch (error) {
      console.error("Error updating Our Program:", error);
      return res.status(500).json({
        message: [{ key: "error", value: "Internal server error" }],
      });
    }
  };

  exports.deleteOurProgram = async (req, res) => {
    const { id } = req.params;
  
    try {
      const ourProgram = await OurProgram.findById(id);
      if (!ourProgram) {
        return res.status(404).json({
          message: [{ key: 'error', value: 'Our Program not found' }],
        });
      }
  
      // If there's an icon, remove it from Supabase
      if (ourProgram.icon) {
        const iconUrlParts = ourProgram.icon.split('/');
        const iconFileName = iconUrlParts[iconUrlParts.length - 1];
  
        try {
          const { data, error } = await supabase.storage
          .from('SmartCliff')
          .remove(`degreeProgram/our_program/${[iconFileName]}`);
  
        } catch (error) {
          console.error("Error deleting icon from Supabase:", error);
          return res.status(500).json({
            message: [{ key: 'error', value: 'Internal server error' }],
          });
        }
      }
  
      await OurProgram.findByIdAndDelete(id);
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Our Program deleted successfully' }],
      });
    } catch (error) {
      console.error("Error deleting Our Program:", error);
      return res.status(500).json({
        message: [{ key: 'error', value: 'Internal server error' }],
      });
    }
  };