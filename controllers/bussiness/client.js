const ServiceClient = require("../../models/bussiness/clientModal");
const path = require("path")
const fs = require('fs');

exports.createServiceClient = async (req, res) => {
    try {
       const {  name,type } = req.body;
        
   
           if (!req.files || !req.files.image) {
               return res.status(400).json({
                   message: [{ key: "error", value: "Image is required" }],
               });
           }
   
           const imageFile = req.files.image;
   
           if (imageFile.size > 3 * 1024 * 1024) {
               return res.status(400).json({
                   message: [{ key: "error", value: "Image size exceeds the 3MB limit" }],
               });
           }
   
           const uniqueFileName = `${Date.now()}_${imageFile.name}`;
           const uploadPath = path.join(__dirname, "../../uploads/business/client", uniqueFileName);
   
           await imageFile.mv(uploadPath);
   
       const newClients = new ServiceClient({
         name,
         type,
         image: uniqueFileName,
       });
   
       await newClients.save();
   
       return res.status(201).json({
         message: [{ key: "success", value: "Servise Client Added Successfully" }],
       });
     } catch (error) {
       console.error("Outer try block error:", error);
       return res.status(500).json({
         message: [{ key: "error", value: "Internal server error" }],
       });
     }
   };


  exports.getAllServiceClient = async (req, res) => {
    try {
        const allClients = await ServiceClient.find();

          const allServiceClients = allClients.map((clientss) => {
        const serviceObj = clientss.toObject();
        return {
            ...serviceObj,
            image: process.env.BACKEND_URL + "/uploads/business/client/" + serviceObj.image,
        };
    });
  

        return res.status(200).json({
            message: [{ key: 'success', value: 'Service client Retrieved successfully' }],
            get_all_services_Client: allServiceClients,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
};


exports.getServiceClientById = async (req, res) => {
    try {
        const { id } = req.params;

        const serviceProcess = await ServiceClient.findById(id);

        if (!serviceProcess) {
            return res.status(404).json({ message: [{ key: 'error', value: 'Service Clinet not found' }] });
        }

        return res.status(200).json({
            message: [{ key: 'success', value: 'Service client Id based Retrieved successfully' }],
            service_client: {
              ...serviceProcess.toObject(),
              image: process.env.BACKEND_URL + '/uploads/business/client/' + serviceProcess.image,
          },
          });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
};



exports.updateClientService = async (req, res) => {
     try {
           const clientsId = req.params.id;
           const updatedData = req.body;
           const imageFile = req.files ? req.files.image : null;
   
           const existingClient = await ServiceClient.findById(clientsId);
   
           if (!existingClient) {
               return res.status(404).json({
                   message: [{ key: 'error', value: 'Service Client not found' }]
               });
           }
   
   
            if (imageFile) {
                      if (!existingClient) {
                        return res
                          .status(404)
                          .json({ message: { key: "error", value: "cliet not found" } });
                      }
   
                      const imagePathToDelete = path.join(
                        __dirname,
                        "../../uploads/business/client",
                        existingClient.image
                      );
                      if (fs.existsSync(imagePathToDelete)) {
                        fs.unlink(imagePathToDelete, (err) => {
                          if (err) {
                            console.error("Error deleting image:", err);
                          }
                        });
                      }
                
                      const uniqueFileName = `${Date.now()}_${imageFile.name}`;
                      const uploadPath = path.join(
                        __dirname,
                        "../../uploads/business/client",
                        uniqueFileName
                      );
                      await imageFile.mv(uploadPath);
                      updatedData.image = uniqueFileName;
                    }
   
           const updatedClient = await ServiceClient.findByIdAndUpdate(
               clientsId,
               updatedData,
           );
   
           if (!updatedClient) {
               return res.status(404).json({
                   message: [{ key: 'error', value: 'Service CLient not found' }],
               });
           }
   
           return res.status(200).json({
               message: [{ key: 'success', value: 'Service Client updated successfully' }],updatedClient:updatedClient        });
       } catch (error) {
           console.error(error);
           return res.status(500).json({
               message: [{ key: 'error', value: 'Internal server error' }]
           });
       }
   };
   
   


exports.deleteclientServices = async (req, res) => {
    const { id } = req.params;

    try {
        const Client = await ServiceClient.findById(id);
        if (!Client) {
            return res.status(404).json({
                message: [{ key: "error", value: "Service Client not found" }],
            });
        }

      
             if (Client.image) {
                       const imagePath = path.join(__dirname, "../../uploads/business/client", Client.image);
                       if (fs.existsSync(imagePath) && fs.lstatSync(imagePath).isFile()) {
                           fs.unlinkSync(imagePath);
                       }
                   }
           

        await ServiceClient.findByIdAndDelete(id);

        return res.status(200).json({
            message: [{ key: "success", value: "Service Client deleted successfully" }],
        });
    } catch (error) {
        console.error("Error deleting service Client:", error);
        return res.status(500).json({
            message: [{ key: "error", value: "Internal server error" }],
        });
    }
};
