const EngagedGovermence = require("../../models/bussiness/EngagedGovermanceModal");
const { createClient } = require('@supabase/supabase-js');
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseUrl = process.env.SUPABASE_URL;

const supabase = createClient(supabaseUrl, supabaseKey);

exports.createEngagedGovermence = async (req, res) => {
    try {
        const { title } = req.body;
        const existingEngagedGovermence = await EngagedGovermence.findOne({ title });
        
        if (existingEngagedGovermence) {
            return res.status(403).json({ message: [{ key: "error", value: "Engaged Govermence Name already exists" }] });
        }

        if (!title) {
            return res.status(400).json({ message: [{ key: "error", value: "Required fields" }] });
        }

        const imageFile = req.files?.image;

    if (!imageFile) {
      return res.status(400).json({
        message: [{ key: "error", value: "Engaged Govermence image is required" }],
      });
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        message: [
          {
            key: "error",
            value: "Engaged Govermence image size exceeds the 5MB limit",
          },
        ],
      });
    }

    const uniqueFileName = `${Date.now()}_${imageFile.name}`;

    try {
      const { data, error } = await supabase.storage
        .from('SmartCliff/bussiness/engaged_govermence')
        .upload(uniqueFileName, imageFile.data);

      if (error) {
        console.error("Error uploading image to Supabase:", error);
        return res.status(500).json({
          message: [{ key: "error", value: "Error uploading image to Supabase" }],
        });
      }

      const imageUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/bussiness/engaged_govermence/${uniqueFileName}`;

            const newEngagedGovermence = new EngagedGovermence({
                title,
                image: imageUrl,
            });

            await newEngagedGovermence.save();

            return res.status(201).json({ message: [{ key: "Success", value: "Engaged Govermence Added Successfully" }] });
          } catch (error) {           
          }
        } catch (error) {
          return res
            .status(500)
            .json({ message: [{ key: "error", value: "Internal server error" }] });
        }
      };


      exports.getAllEngagedGovermence = async (req, res) => {
        try {
          const engagedgovermence = await EngagedGovermence.find();
      
          return res.status(200).json({
            message: [{ key: 'success', value: 'Engaged Govermence Retrieved successfully' }],
            All_EngagedGovermence: engagedgovermence,
          });
        } catch (error) {
          return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
        }
      };
      
      exports.getEngagedGovermenceById = async (req, res) => {
        const { id } = req.params;
        try {
          const engagedgovermence = await EngagedGovermence.findById(id);
          if (!engagedgovermence) {
            return res.status(404).json({ message: [{ key: 'error', value: 'Engaged Govermence not found' }] });
          }
          return res.status(200).json({
            message: [{ key: 'success', value: 'Engaged Govermence Id Based Retrieved successfully' }],
            EngagedGovermence_Id_Based:engagedgovermence
          });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
        }
      };
      

      exports.updateEngagedGovermence = async (req, res) => {
        try {
          const engagedId = req.params.id;
          const updatedData = req.body;
          const imageFile = req.files ? req.files.image : null;
      
          const existingEngagedGovermence = await EngagedGovermence.findById(engagedId);
      
          if (!existingEngagedGovermence) {
            return res.status(404).json({
              message: [{ key: 'error', value: 'Engaged Govermence not found' }]
            });
          }
      
          if (imageFile) {
            if (existingEngagedGovermence.image) {
                try {
                    const imageUrlParts = existingEngagedGovermence.image.split('/');
                    const imageName = imageUrlParts[imageUrlParts.length - 1];
      
                    const {data,error} =  await supabase.storage
                    .from('SmartCliff')
                    .remove(`bussiness/engaged_govermence/${[imageName]}`);
                   
                } catch (error) {
                    console.error(error);
                    return res.status(500).json({ message: [{ key: "error", value: "Error removing existing image from Supabase storage" }] });
                }
            }
      
            const uniqueFileName = `${Date.now()}_${imageFile.name}`;
      
            try {
                const { data, error } = await supabase.storage
                    .from('SmartCliff/bussiness/engaged_govermence')
                    .upload(uniqueFileName, imageFile.data);
      
                if (error) {
                    console.error(error);
                    return res.status(500).json({ message: [{ key: "error", value: "Error uploading image to Supabase storage" }] });
                }
                const imageUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/bussiness/engaged_govermence/${uniqueFileName}`;
                updatedData.image = imageUrl;
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: [{ key: "error", value: "Error uploading image to Supabase storage" }] });
            }
        }
          const updatedEngagedGovermence = await EngagedGovermence.findByIdAndUpdate(
            engagedId,
            updatedData  
            );
      
          if (!updatedEngagedGovermence) {
            return res.status(404).json({
              message: [{ key: 'error', value: 'Engaged Govermence not found' }]
            });
          }
          return res.status(200).json({
            message: [{ key: 'success', value: 'Engaged Govermence updated successfully' }]
          });
        } catch (error) {
          console.error(error);
          return res.status(500).json({
            message: [{ key: 'error', value: 'Internal server error' }]
          });
        }
      };
    
    
      exports.deleteEngagedGovermence = async (req, res) => {
        const { id } = req.params;
      
        try {
          const engagedgovermence = await EngagedGovermence.findById(id);
          if (!engagedgovermence) {
            return res.status(404).json({ message: [{ key: 'error', value: 'Key Elements not found' }] });
          }
      
          if (engagedgovermence.image) {
            const imageUrlParts = engagedgovermence.image.split('/');
            const imageName = imageUrlParts[imageUrlParts.length - 1];
      
            try {
              await supabase.storage
              .from('SmartCliff')
              .remove(`bussiness/engaged_govermence/${[imageName]}`);
            } catch (error) {
              console.error("Error deleting image from Supabase:", error);
            }
          }
      
            await EngagedGovermence.findByIdAndDelete(id);
      
          return res.status(200).json({
            message: [{ key: 'success', value: 'Engaged Govermence deleted successfully' }],
          });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
        }
      };
      
