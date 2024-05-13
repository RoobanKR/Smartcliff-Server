const KeyElements = require("../../models/bussiness/KeyElementsModal");
const { createClient } = require('@supabase/supabase-js');
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseUrl = process.env.SUPABASE_URL;

const supabase = createClient(supabaseUrl, supabaseKey);

exports.createKeyElements = async (req, res) => {
    try {
        const { title } = req.body;
        const existingKeyElements = await KeyElements.findOne({ title });
        
        if (existingKeyElements) {
            return res.status(403).json({ message: [{ key: "error", value: "Key Elements Name already exists" }] });
        }

        if (!title) {
            return res.status(400).json({ message: [{ key: "error", value: "Required fields" }] });
        }

        const iconFile = req.files?.icon;

    if (!iconFile) {
      return res.status(400).json({
        message: [{ key: "error", value: "Key Elements icon is required" }],
      });
    }

    if (iconFile.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        message: [
          {
            key: "error",
            value: "Key Elements icon size exceeds the 5MB limit",
          },
        ],
      });
    }

    const uniqueFileName = `${Date.now()}_${iconFile.name}`;

    try {
      const { data, error } = await supabase.storage
        .from('SmartCliff/bussiness/key_elements')
        .upload(uniqueFileName, iconFile.data);

      if (error) {
        console.error("Error uploading icon to Supabase:", error);
        return res.status(500).json({
          message: [{ key: "error", value: "Error uploading icon to Supabase" }],
        });
      }

      const iconUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/bussiness/key_elements/${uniqueFileName}`;

            const newKeyElements = new KeyElements({
                title,
                icon: iconUrl,
            });

            await newKeyElements.save();

            return res.status(201).json({ message: [{ key: "Success", value: "Key Elements Added Successfully" }] });
          } catch (error) {           
          }
        } catch (error) {
          return res
            .status(500)
            .json({ message: [{ key: "error", value: "Internal server error" }] });
        }
      };


      exports.getAllKeyElements = async (req, res) => {
        try {
          const keyelements = await KeyElements.find();
      
          return res.status(200).json({
            message: [{ key: 'success', value: 'Key Elements Retrieved successfully' }],
            All_Key_Elements: keyelements,
          });
        } catch (error) {
          return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
        }
      };
      
      exports.getKeyElementsById = async (req, res) => {
        const { id } = req.params;
        try {
          const Keyelement = await KeyElements.findById(id);
          if (!Keyelement) {
            return res.status(404).json({ message: [{ key: 'error', value: 'Key Elements not found' }] });
          }
          return res.status(200).json({
            message: [{ key: 'success', value: 'Key Elements Id Based Retrieved successfully' }],
            Key_Element_Id_Based:Keyelement
          });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
        }
      };
      


      exports.updateKeyElements = async (req, res) => {
        try {
          const keyId = req.params.id;
          const updatedData = req.body;
          const iconFile = req.files ? req.files.icon : null;
      
          const existingKeyElements = await KeyElements.findById(keyId);
      
          if (!existingKeyElements) {
            return res.status(404).json({
              message: [{ key: 'error', value: 'Key Elements not found' }]
            });
          }
      
          if (iconFile) {
            if (existingKeyElements.icon) {
                try {
                    const iconUrlParts = existingKeyElements.icon.split('/');
                    const iconName = iconUrlParts[iconUrlParts.length - 1];
      
                    const {data,error} =  await supabase.storage
                    .from('SmartCliff')
                    .remove(`bussiness/key_elements/${[iconName]}`);
                   
                } catch (error) {
                    console.error(error);
                    return res.status(500).json({ message: [{ key: "error", value: "Error removing existing icon from Supabase storage" }] });
                }
            }
      
            const uniqueFileName = `${Date.now()}_${iconFile.name}`;
      
            try {
                const { data, error } = await supabase.storage
                    .from('SmartCliff/bussiness/key_elements')
                    .upload(uniqueFileName, iconFile.data);
      
                if (error) {
                    console.error(error);
                    return res.status(500).json({ message: [{ key: "error", value: "Error uploading icon to Supabase storage" }] });
                }
      
                const iconUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/bussiness/key_elements/${uniqueFileName}`;
                updatedData.icon = iconUrl;
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: [{ key: "error", value: "Error uploading icon to Supabase storage" }] });
            }
        }
      
          const updatedKeyElements = await KeyElements.findByIdAndUpdate(
            keyId,
            updatedData  
            );
      
          if (!updatedKeyElements) {
            return res.status(404).json({
              message: [{ key: 'error', value: 'Key Elements not found' }]
            });
          }
      
          return res.status(200).json({
            message: [{ key: 'success', value: 'Key Elements updated successfully' }]
          });
        } catch (error) {
          console.error(error);
          return res.status(500).json({
            message: [{ key: 'error', value: 'Internal server error' }]
          });
        }
      };
    
    
      exports.deleteKeyElements = async (req, res) => {
        const { id } = req.params;
      
        try {
          const keyElements = await KeyElements.findById(id);
          if (!keyElements) {
            return res.status(404).json({ message: [{ key: 'error', value: 'Key Elements not found' }] });
          }
      
          if (keyElements.icon) {
            const iconUrlParts = keyElements.icon.split('/');
            const iconName = iconUrlParts[iconUrlParts.length - 1];
      
            try {
              await supabase.storage
              .from('SmartCliff')
              .remove(`bussiness/key_elements/${[iconName]}`);
            } catch (error) {
              console.error("Error deleting icon from Supabase:", error);
            }
          }
      
            await KeyElements.findByIdAndDelete(id);
      
          return res.status(200).json({
            message: [{ key: 'success', value: 'Key Elements deleted successfully' }],
          });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
        }
      };
      