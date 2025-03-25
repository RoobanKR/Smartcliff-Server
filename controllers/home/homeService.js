const HomeService = require("../../models/home/HomeServiceModal");

exports.createHomeSerives = async (req, res) => {
    try {
      const { heading, description, feature } = req.body;
  
      const existingHomeServices = await HomeService.findOne({ heading });
      if (existingHomeServices) {
        return res.status(403).json({ message: [{ key: "error", value: " Home Service already exists" }] });
      }
    
  
      const newHomeServices = new HomeService({
        heading,
        description,
        feature,
        // createdBy: req.user.email,
        createdAt: new Date(),
      });
  
      await newHomeServices.save();
      return res.status(201).json({ message: [{ key: "Success", value: "Home Services Added Successfully" }] });
  
    } catch (error) {
      console.error("Error creating Home service:", error);
      return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
  };
  


    exports.getAllHomeServices = async (req, res) => {
        try {
            const homeServices = await HomeService.find();
            return res.status(200).json({

                message: [{ key: 'success', value: 'Home Service Retrieved successfully' }],
                get_all_home_service: homeServices,
            });
            } catch (error) {
            res.status(500).json({ message: "Error fetching Home Services", error: error.message });
          }
        };

        
  exports.getHomeServiceById  = async (req, res) => {
     const { id } = req.params;
       try {
           const services = await HomeService.findById(id);
           if (!services) {
               return res.status(404).json({ message: [{ key: 'error', value: 'Home Services not found' }] });
           }
   
           return res.status(200).json({
               message: [{ key: 'success', value: 'Home Service Retrieved By Id successfully' }],
               homeServiceById: services
           });
       } catch (error) {
           console.error(error);
           return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
       }
   };
   

  
  
  exports.updateHomeService  = async (req, res) => {
    try {
        const { heading, description, feature, createdBy } = req.body;
    
        const updatedHomeService = await HomeService.findByIdAndUpdate(
          req.params.id,
          { heading, description, feature, createdBy },
          { new: true }
        );
    
        if (!updatedHomeService)
            return res.status(404).json({ message: [{ key: "error", value: "Home service not found" }] });
    
        return res.status(200).json({ 
            message: [{ key: "success", value: "Home Service updated successfully" }],
            updatedHomeService
        });      } catch (error) {
            return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
        }
    };
    
  
  
  
    exports.deleteHomeService  = async (req, res) => {
          const { id } = req.params;
       
           try {
               const home = await HomeService.findById(id);
               if (!home) {
                   return res.status(404).json({
                       message: [{ key: "error", value: "Home Service not found" }],
                   });
               }
       
               await HomeService.findByIdAndDelete(id);
       
               return res.status(200).json({
                   message: [{ key: "success", value: "Home Service deleted successfully" }],
               });
           } catch (error) {
               console.error("Error deleting service home:", error);
               return res.status(500).json({
                   message: [{ key: "error", value: "Internal server error" }],
               });
           }
       };
       
        