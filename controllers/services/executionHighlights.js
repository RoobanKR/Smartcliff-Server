const ExecutionHighlights = require("../../models/services/ExecutionHighlightsModal");
const path = require("path");
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseUrl = process.env.SUPABASE_URL;

const supabase = createClient(supabaseUrl, supabaseKey);

exports.createExecutionHighlights = async (req, res) => {
  try {
    const { stack, count, service } = req.body;

    // Validate required fields
    if (!stack || !count) {
      return res.status(400).json({
        message: [{ key: "error", value: "Required fields: stack and count are missing" }],
      });
    }

    // Check if execution highlights already exist
    const existingExecutionHighlights = await ExecutionHighlights.findOne({ stack });
    if (existingExecutionHighlights) {
      return res.status(403).json({
        message: [{ key: "error", value: "Execution Highlights Name already exists" }],
      });
    }

    if (!req.files?.image) {
      return res.status(400).json({
        message: [{ key: "error", value: "Required field: image is missing" }],
      });
    }

    const imageFile = req.files.image;
    const uniqueFileName = `${Date.now()}_${imageFile.name}`;

    // Ensure each `try` has a `catch`
    const imageUrl = await (async () => {
      try {
        const { data, error } = await supabase.storage
          .from('SmartCliff/services/highlights')
          .upload(uniqueFileName, imageFile.data);

        if (error) {
          console.error(error);
          throw new Error("Error uploading image to Supabase storage");
        }

        return `${supabaseUrl}/storage/v1/object/public/SmartCliff/services/highlights/${uniqueFileName}`;
      } catch (error) {
        console.error("Inner try block error:", error);
        throw new Error("Error during image upload");
      }
    })();

    const newExecutionHighlights = new ExecutionHighlights({
      stack,
      count,
      image: imageUrl,
      service,
    });

    await newExecutionHighlights.save();

    return res.status(201).json({
      message: [{ key: "success", value: "Execution Highlights Added Successfully" }],
    });
  } catch (error) {
    console.error("Outer try block error:", error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};



exports.getAllExecutionHighlights = async (req, res) => {
    try {
      const executionHighlight = await ExecutionHighlights.find().populate("service");
  
      
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Execution Highlights Retrieved successfully' }],
        getAllExecutionHighlight: executionHighlight,
      });
    } catch (error) {
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };


  
  exports.getExecutionHighlightsById = async (req, res) => {
    const { id } = req.params;
    try {
      const executionHighlight = await ExecutionHighlights.findById(id).populate("service");
      if (!executionHighlight) {
        return res.status(404).json({ message: [{ key: 'error', value: 'Execution Highlights not found' }] });
      }
      return res.status(200).json({
        message: [{ key: 'success', value: 'Execution Highlights Id based Retrieved successfully' }],
        serviceById: executionHighlight
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  

  
  exports.updateExecutionHighlights = async (req, res) => {
    try {
        const highlightId = req.params.id;
        const updatedData = req.body;
        const imageFile = req.files ? req.files.image : null;

        const existingExecutionHighlights = await ExecutionHighlights.findById(highlightId);

        if (!existingExecutionHighlights) {
            return res.status(404).json({
                message: [{ key: 'error', value: 'Execution Highlights not found' }]
            });
        }

        // Check if the name is being updated and if it already exists in the database
        if (updatedData.stack && updatedData.stack !== existingExecutionHighlights.stack) {
            const stackExists = await ExecutionHighlights.exists({ stack: updatedData.stack });
            if (stackExists) {
                return res.status(400).json({
                    message: [{ key: 'error', value: 'Execution Highlights with this stack already exists' }]
                });
            }
        }

        if (imageFile) {
          if (existingExecutionHighlights.image) {
              try {
                  const imageUrlParts = existingExecutionHighlights.image.split('/');
                  const imageName = imageUrlParts[imageUrlParts.length - 1];

                  const {data,error} =  await supabase.storage
                  .from('SmartCliff')
                  .remove(`services/highlights/${[imageName]}`);
                 
              } catch (error) {
                  console.error(error);
                  return res.status(500).json({ message: [{ key: "error", value: "Error removing existing image from Supabase storage" }] });
              }
          }

          const uniqueFileName = `${Date.now()}_${imageFile.name}`;

          try {
              const { data, error } = await supabase.storage
                  .from('SmartCliff/services/highlights')
                  .upload(uniqueFileName, imageFile.data);

              if (error) {
                  console.error(error);
                  return res.status(500).json({ message: [{ key: "error", value: "Error uploading image to Supabase storage" }] });
              }

              const imageUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/services/highlights/${uniqueFileName}`;
              updatedData.image = imageUrl;
          } catch (error) {
              console.error(error);
              return res.status(500).json({ message: [{ key: "error", value: "Error uploading image to Supabase storage" }] });
          }
      }

        const updatedExecutionHighlights = await ExecutionHighlights.findByIdAndUpdate(
            highlightId,
            updatedData,
        );

        if (!updatedExecutionHighlights) {
            return res.status(404).json({
                message: [{ key: 'error', value: 'Execution Highlights not found' }]
            });
        }

        return res.status(200).json({
            message: [{ key: 'success', value: 'Execution Highlights updated successfully' }]        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: [{ key: 'error', value: 'Internal server error' }]
        });
    }
};



exports.deleteExecutionHighlights = async (req, res) => {
    const { id } = req.params;
  
    try {
      const executionHighlight = await ExecutionHighlights.findById(id);
      if (!executionHighlight) {
        return res.status(404).json({ message: [{ key: 'error', value: 'Execution Highlights not found' }] });
      }
  
      if (executionHighlight.image) {
        try {
          
            const imageUrlParts = executionHighlight.image.split('/');
            const imageName = imageUrlParts[imageUrlParts.length - 1];
            const {data,error} =  await supabase.storage
            .from('SmartCliff')
            .remove(`services/highlights/${[imageName]}`);
               

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: [{ key: "error", value: "Error removing image from Supabase storage" }] });
        }
    }
        await ExecutionHighlights.findByIdAndDelete(id);
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Execution Highlights deleted successfully' }],
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  