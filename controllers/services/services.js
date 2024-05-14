const Service = require("../../models/services/ServicesModal");
const path = require("path");
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseUrl = process.env.SUPABASE_URL;

const supabase = createClient(supabaseUrl, supabaseKey);

exports.createServices = async (req, res) => {
    try {
        const { title, description,slug } = req.body;
        const existingService = await Service.findOne({ title });
        
        if (existingService) {
            return res.status(403).json({ message: [{ key: "error", value: "Service Name already exists" }] });
        }

        if (!title || !description || !slug) {
            return res.status(400).json({ message: [{ key: "error", value: "Required fields" }] });
        }

        let videoFiles = req.files.videos;


        const imageFile = req.files?.image;

        if (!imageFile) {
          return res.status(400).json({
            message: [{ key: "error", value: "services image is required" }],
          });
        }
    
        if (imageFile.size > 5 * 1024 * 1024) {
          return res.status(400).json({
            message: [
              {
                key: "error",
                value: "services image size exceeds the 5MB limit",
              },
            ],
          });
        }
    
        const uniqueFileName = `${Date.now()}_${imageFile.name}`;
    
        try {
          const { data, error } = await supabase.storage
            .from('SmartCliff/services/service')
            .upload(uniqueFileName, imageFile.data);
    
          if (error) {
            console.error("Error uploading image to Supabase:", error);
            return res.status(500).json({
              message: [{ key: "error", value: "Error uploading image to Supabase" }],
            });
          }
    
          const imageUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/services/service/${uniqueFileName}`;
    
                const videoPaths = [];
            if (videoFiles) {
                if (!Array.isArray(videoFiles)) {
                    videoFiles = [videoFiles];
                }

                for (const videoFile of videoFiles) {
                    if (videoFile.size > 20 * 1024 * 1024) {
                        return res.status(400).json({ message: [{ key: "error", value: "Video size exceeds the 20MB limit" }] });
                    }
                    const videoFileName = `${Date.now()}_${videoFile.name}`;
                    const videoUploadPath = path.join(__dirname, "../../uploads/services/service/videos", videoFileName);
                    await videoFile.mv(videoUploadPath);
                    videoPaths.push(videoFileName);
                }
            }

            const newService = new Service({
                title,
                slug,
                description,
                image: imageUrl,
                videos: videoPaths,
            });

            await newService.save();

            return res.status(201).json({ message: [{ key: "Success", value: "Service Added Successfully" }] });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
};


exports.getAllService = async (req, res) => {
    try {
        const services = await Service.find();

        const allServices = services.map((service) => {
            const serviceObj = service.toObject();
            const updatedService = {
                ...serviceObj,
                videos: serviceObj.videos.map(video => 'https://smartcliff-server-5qpp.onrender.com/uploads/services/service/videos/' + video)
            };
            return updatedService;
        });

        return res.status(200).json({
            message: [{ key: 'success', value: 'Service Retrieved successfully' }],
            get_all_services: allServices,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
};

exports.getServiceById = async (req, res) => {
    const { id } = req.params;
    try {
        const service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({ message: [{ key: 'error', value: 'Service not found' }] });
        }

        const videoURLs = service.videos.map(video => 'https://smartcliff-server-5qpp.onrender.com/uploads/services/service/videos/' + video);

        return res.status(200).json({
            message: [{ key: 'success', value: 'Service Id based Retrieved successfully' }],
            serviceById: {
                ...service.toObject(),
                videos: videoURLs,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
};

  

  
exports.updateService = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const updatedData = req.body;
        const imageFile = req.files ? req.files.image : null;
        let videoFiles = req.files ? req.files.videos : null;

        const existingService = await Service.findById(serviceId);

        if (!existingService) {
            return res.status(404).json({
                message: [{ key: 'error', value: 'Service not found' }]
            });
        }

        if (imageFile) {
            if (existingService.image) {
                try {
                    const imageUrlParts = existingService.image.split('/');
                    const imageName = imageUrlParts[imageUrlParts.length - 1];
      
                    const {data,error} =  await supabase.storage
                    .from('SmartCliff')
                    .remove(`services/service/${[imageName]}`);
                   
                } catch (error) {
                    console.error(error);
                    return res.status(500).json({ message: [{ key: "error", value: "Error removing existing image from Supabase storage" }] });
                }
            }
      
            const uniqueFileName = `${Date.now()}_${imageFile.name}`;
      
            try {
                const { data, error } = await supabase.storage
                    .from('SmartCliff/services/service')
                    .upload(uniqueFileName, imageFile.data);
      
                if (error) {
                    console.error(error);
                    return res.status(500).json({ message: [{ key: "error", value: "Error uploading image to Supabase storage" }] });
                }
      
                const imageUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/services/service/${uniqueFileName}`;
                updatedData.image = imageUrl;
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: [{ key: "error", value: "Error uploading image to Supabase storage" }] });
            }
        }
      
        if (videoFiles) {
            const videoPathsToDelete = existingService.videos.map(video => path.join(__dirname, '../../uploads/services/service/videos', video));
            for (const videoPathToDelete of videoPathsToDelete) {
                if (fs.existsSync(videoPathToDelete)) {
                    fs.unlink(videoPathToDelete, (err) => {
                        if (err) {
                            console.error('Error deleting video:', err);
                        }
                    });
                }
            }

            const videoPaths = [];
            if (!Array.isArray(videoFiles)) {
                videoFiles = [videoFiles]; // Convert to array if single file upload
            }

            for (const videoFile of videoFiles) {
                const uniqueVideoFileName = `${Date.now()}_${videoFile.name}`;
                const videoUploadPath = path.join(__dirname, '../../uploads/services/service/videos', uniqueVideoFileName);
                await videoFile.mv(videoUploadPath);
                videoPaths.push(uniqueVideoFileName);
            }
            updatedData.videos = videoPaths;
        }

        const updatedService = await Service.findByIdAndUpdate(serviceId, updatedData, { new: true });

        if (!updatedService) {
            return res.status(404).json({
                message: [{ key: 'error', value: 'Service not found' }]
            });
        }

        return res.status(200).json({
            message: [{ key: 'success', value: 'Service updated successfully' }]
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: [{ key: 'error', value: 'Internal server error' }]
        });
    }
};

  
exports.deleteServices = async (req, res) => {
    const { id } = req.params;

    try {
        const service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({ message: [{ key: 'error', value: 'Service not found' }] });
        }

        if (service.image) {
            const imageUrlParts = service.image.split('/');
            const imageName = imageUrlParts[imageUrlParts.length - 1];
      
            try {
              await supabase.storage
              .from('SmartCliff')
              .remove(`services/service/${[imageName]}`);
            } catch (error) {
              console.error("Error deleting image from Supabase:", error);
            }
          }
      
        if (service.videos && service.videos.length > 0) {
            for (const video of service.videos) {
                const videoPath = path.join(__dirname, '../../uploads/services/service/videos', video);
                if (fs.existsSync(videoPath)) {
                    fs.unlinkSync(videoPath);
                }
            }
        }

        await Service.findByIdAndDelete(id);

        return res.status(200).json({
            message: [{ key: 'success', value: 'Service deleted successfully' }],
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
};
