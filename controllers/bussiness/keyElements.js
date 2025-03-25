const KeyElements = require("../../models/bussiness/KeyElementsModal");
const path = require("path");
const fs = require('fs');

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

  const iconFile = req.files.icon;
   
           if (iconFile.size > 3 * 1024 * 1024) {
               return res.status(400).json({
                   message: [{ key: "error", value: "Image size exceeds the 3MB limit" }],
               });
           }
   
           const uniqueFileName = `${Date.now()}_${iconFile.name}`;
           const uploadPath = path.join(__dirname, "../../uploads/business/keyelement", uniqueFileName);
   
           await iconFile.mv(uploadPath);
   
            const newKeyElements = new KeyElements({
                title,
                icon: uniqueFileName,
            });

            await newKeyElements.save();

            return res.status(201).json({ message: [{ key: "Success", value: "Key Elements Added Successfully" }] });
        
        } catch (error) {
          return res
            .status(500)
            .json({ message: [{ key: "error", value: "Internal server error" }] });
        }
      };


      exports.getAllKeyElements = async (req, res) => {
        try {
          const keyelements = await KeyElements.find();
          const allOutcomes = keyelements.map((key) => {
            const keyElementObj = key.toObject();
            return {
                ...keyElementObj,
                icon: process.env.BACKEND_URL + "/uploads/business/keyelement/" + keyElementObj.icon,
            };
        });
    
          return res.status(200).json({
            message: [{ key: 'success', value: 'Key Elements Retrieved successfully' }],
            All_Key_Elements: allOutcomes,
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
            Key_Element_Id_Based:{
              ...Keyelement.toObject(),
              icon: process.env.BACKEND_URL + '/uploads/business/keyelement/' + Keyelement.icon,
          },
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
                      if (!existingKeyElements) {
                        return res
                          .status(404)
                          .json({ message: { key: "error", value: "Key element not found" } });
                      }
   
                      const imagePathToDelete = path.join(
                        __dirname,
                        "../../uploads/business/keyelement",
                        existingKeyElements.icon
                      );
                      if (fs.existsSync(imagePathToDelete)) {
                        fs.unlink(imagePathToDelete, (err) => {
                          if (err) {
                            console.error("Error deleting icon:", err);
                          }
                        });
                      }
                
                      const uniqueFileName = `${Date.now()}_${iconFile.name}`;
                      const uploadPath = path.join(
                        __dirname,
                        "../../uploads/business/keyelement",
                        uniqueFileName
                      );
                      await iconFile.mv(uploadPath);
                      updatedData.icon = uniqueFileName;
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
                       const imagePath = path.join(__dirname, "../../uploads/business/keyelement", keyElements.icon);
                       if (fs.existsSync(imagePath) && fs.lstatSync(imagePath).isFile()) {
                           fs.unlinkSync(imagePath);
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
      