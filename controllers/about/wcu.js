const WhyChooseUs = require("../../models/about/WCUModal");
const path = require("path")
const fs = require('fs');

exports.createWCU = async (req, res) => {
  try {
    const { description,title } = req.body;
    const existingWcu = await WhyChooseUs.findOne({ title });

    if (existingWcu) {
      return res
        .status(403)
        .json({ message: [{ key: "error", value: "Why Choose Us Title already exists" }] });
    }

               if (!req.files || !req.files.icon) {
                   return res.status(400).json({
                       message: [{ key: "error", value: "Image is required" }],
                   });
               }
       
               const iconFile = req.files.icon;
       
               if (iconFile.size > 3 * 1024 * 1024) {
                   return res.status(400).json({
                       message: [{ key: "error", value: "Image size exceeds the 3MB limit" }],
                   });
               }
       
               const uniqueFileName = `${Date.now()}_${iconFile.name}`;
               const uploadPath = path.join(__dirname, "../../uploads/about/whychooseus", uniqueFileName);
       
               await iconFile.mv(uploadPath);
    

    const newWcu = new WhyChooseUs({
      title,
      description,
      icon:uniqueFileName,
      // createdBy:req.user.email,
    });

    await newWcu.save();

    return res
      .status(201)
      .json({
        message: [
          { key: "Success", value: "Why Choose Us added successfully" },
        ],
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.getAllWCU = async (req, res) => {
  try {
    const allWCU = await WhyChooseUs.find();
    const getAllWCU = allWCU.map((wcu) => {
      const wcuObj = wcu.toObject();
      return {
          ...wcuObj,
          icon: process.env.BACKEND_URL + "/uploads/about/whychooseus/" + wcuObj.icon,
      };
  });


      return res.status(200).json({
          message: [{ key: 'success', value: 'why choose us Retrieved successfully' }],
          getAllWCU: getAllWCU,
      });

  } catch (error) {
    res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] })
  }
};

exports.getWCUById = async (req, res) => {
  try {
        const { id } = req.params;

        const whychoous = await WhyChooseUs.findById(id);

        if (!whychoous) {
            return res.status(404).json({ message: [{ key: 'error', value: 'WhyChooseUs not found' }] });
        }

        return res.status(200).json({
            message: [{ key: 'success', value: 'WhyChooseUs Id based Retrieved successfully' }],
            wcuById: {
              ...whychoous.toObject(),
              icon: process.env.BACKEND_URL + '/uploads/about/whychooseus/' + whychoous.icon,
          },
          });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
};



exports.editWCUById = async (req, res) => {
   try {
            const wcuId = req.params.id;
            const updatedData = req.body;
            const iconFile = req.files ? req.files.icon : null;
    
            const existingWcu = await WhyChooseUs.findById(wcuId);
    
            if (!existingWcu) {
                return res.status(404).json({
                    message: [{ key: 'error', value: 'Why choose Us not found' }]
                });
            }
    
    
             if (iconFile) {
                       if (!existingWcu) {
                         return res
                           .status(404)
                           .json({ message: { key: "error", value: "cliet not found" } });
                       }
    
                       const imagePathToDelete = path.join(
                         __dirname,
                         "../../uploads/about/whychooseus",
                         existingWcu.icon
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
                         "../../uploads/about/whychooseus",
                         uniqueFileName
                       );
                       await iconFile.mv(uploadPath);
                       updatedData.icon = uniqueFileName;
                     }
    
            const updatedWcu = await WhyChooseUs.findByIdAndUpdate(
                wcuId,
                updatedData,
            );
    
            if (!updatedWcu) {
                return res.status(404).json({
                    message: [{ key: 'error', value: 'Why choose us not found' }],
                });
            }
    
            return res.status(200).json({
                message: [{ key: 'success', value: 'Why choose Us updated successfully' }],updatedWcu:updatedWcu        });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: [{ key: 'error', value: 'Internal server error' }]
            });
        }
    };
    

exports.deleteWCUById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedWcu = await WhyChooseUs.findByIdAndRemove(id);

    if (!deletedWcu) {
      return res.status(404).json({ message: [{ key: 'error', value: 'WCU section not found' }] });
    }

                 if (deletedWcu.icon) {
                           const imagePath = path.join(__dirname, "../../uploads/about/whychooseus", deletedWcu.icon);
                           if (fs.existsSync(imagePath) && fs.lstatSync(imagePath).isFile()) {
                               fs.unlinkSync(imagePath);
                           }
                       }
    
    res.status(200).json({ message: [{ key: 'success', value: 'WCU section deleted successfully' }] });
  } catch (error) {
    res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
  }
};

