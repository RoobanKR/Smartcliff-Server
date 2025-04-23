const HomeService = require("../../models/home/HomeServiceCountModal");

exports.createHomeSerivesCount = async (req, res) => {
    try {
      const { count, service, slug } = req.body;
  
      const existingHomeServices = await HomeService.findOne({ service });
      if (existingHomeServices) {
        return res.status(403).json({ message: [{ key: "error", value: " Home Service already exists" }] });
      }
    
  
      const newHomeServices = new HomeService({
        count,
        service,
        slug,
        createdBy: req?.user?.email || "roobankr5@gmail.com",
        createdAt: new Date(),
      });
  
      await newHomeServices.save();
      return res.status(201).json({ message: [{ key: "Success", value: "Home Services Added Successfully" }] });
  
    } catch (error) {
      console.error("Error creating Home service:", error);
      return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
  };
  


    exports.getAllHomeServicesCount = async (req, res) => {
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

        
  exports.getHomeServiceByIdCount  = async (req, res) => {
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
   

  
  
  exports.updateHomeServiceCount  = async (req, res) => {
    try {
        const { count, service, slug, createdBy } = req.body;
    
        const updatedHomeService = await HomeService.findByIdAndUpdate(
          req.params.id,
          { count, service, slug, createdBy },
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
    
  
  
  
    exports.deleteHomeServiceCount  = async (req, res) => {
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
       
        