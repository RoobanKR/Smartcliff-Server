const ManagedCampus = require("../../models/services/ManagedCampusModal");

exports.createManagedCampus = async (req, res) => {
  try {
    const {
      sub_title,
      service,
      execution_highlights,
      execution_overview,
      our_client,
      gallery,
      service_testimonial,
    } = req.body;

    try {
      const newManagedCampus = new ManagedCampus({
        service,
        sub_title,
        execution_highlights:typeof execution_highlights === "string"? execution_highlights.split(","): Array.isArray(execution_highlights)? execution_highlights : [],
        execution_overview:typeof execution_overview === "string"? execution_overview.split(","): Array.isArray(execution_overview)? execution_overview : [],
        our_client:typeof our_client === "string"? our_client.split(","): Array.isArray(our_client)? our_client : [],
        gallery:typeof gallery === "string"? gallery.split(","): Array.isArray(gallery)? gallery : [],
        service_testimonial:typeof service_testimonial === "string"? service_testimonial.split(","): Array.isArray(service_testimonial)? service_testimonial : [],
      });
      await newManagedCampus.save();

      return res.status(201).json({
        message: [
          { key: "Success", value: "Managed Campus Added Successfully" },
        ],
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: [{ key: "error", value: "Internal server error" }] });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.getAllManagedCampus = async (req, res) => {
  try {
    const managedCampus = await ManagedCampus.find()
      .populate("execution_highlights")
      .populate("service")
      .populate("execution_overview")
      .populate("our_client")
      .populate("gallery")
      .populate({
        path: "service_testimonial",
        populate: [{ path: "service" }, { path: "stack" }],
      });       
    if (!managedCampus || managedCampus.length === 0) {
      return res.status(404).json({ message: [{ key: "error", value: "No Managed Campus found" }] });
    }
    const populatedManagedCampus = managedCampus.map(campus => ({
      ...campus._doc,
      service: {
        ...campus.service._doc,
        image: campus.service && campus.service.image ? process.env.BACKEND_URL + `/uploads/services/service/${campus.service.image}` : null,
        videos: campus.service && campus.service.videos ? campus.service.videos.map(video => `http://localhost:5353/uploads/services/service/videos/${video}`) : []
      },
      execution_highlights: campus.execution_highlights.map(highlight => ({
        ...highlight._doc,
        image: highlight && highlight.image
      })),
      gallery: campus.gallery.map(item => ({
        ...item._doc,
        image: item && item.image
      })),
      our_client: campus.our_client.map(client => ({
        ...client._doc,
        image: client && client.image
      })),
      service_testimonial: campus.service_testimonial.map(testimonial => ({
        ...testimonial._doc,
        image: testimonial && testimonial.image 
      }))
    }));

    return res.status(200).json({
      message: [{ key: "success", value: "Managed Campus Retrieved successfully" }],
      getAllManagedCampus: populatedManagedCampus,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};

exports.getManagedCampusById = async (req, res) => {
  const { id } = req.params;
  try {
    const managedCampus = await ManagedCampus.findById(id)
      .populate("execution_highlights")
      .populate("service")
      .populate("execution_overview")
      .populate("our_client")
      .populate("gallery")
      .populate({
        path: "service_testimonial",
        populate: [{ path: "service" }, { path: "stack" }],
      });   
       if (!managedCampus) {
      return res.status(404).json({ message: [{ key: "error", value: "Managed Campus not found" }] });
    }
    const populatedManagedCampus = {
      ...managedCampus._doc,
      service: {
        ...managedCampus.service._doc,
        image: managedCampus.service && managedCampus.service.image ? process.env.BACKEND_URL + `/uploads/services/service/${managedCampus.service.image}` : null,
        videos: managedCampus.service && managedCampus.service.videos ? managedCampus.service.videos.map(video => `http://localhost:5353/uploads/services/service/videos/${video}`) : []
      },
      execution_highlights: managedCampus.execution_highlights.map(highlight => ({
        ...highlight._doc,
        image: highlight && highlight.image
            })),
      gallery: managedCampus.gallery.map(item => ({
        ...item._doc,
        image: item && item.image
      })),
      our_client: managedCampus.our_client.map(client => ({
        ...client._doc,
        image: client && client.image
      })),
      service_testimonial: managedCampus.service_testimonial.map(testimonial => ({
        ...testimonial._doc,
        image: testimonial && testimonial.image
      }))
    };

    return res.status(200).json({
      message: [{ key: "success", value: "Managed Campus Id Based retrieved successfully" }],
      managedCampusById: populatedManagedCampus,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};
    
    exports.updateManagedCampus = async (req, res) => {
      try {
        const { id } = req.params; 
        const {
          sub_title,
          service,
          execution_highlights,
          execution_overview,
          our_client,
          gallery,
          service_testimonial,
        } = req.body;
    
        try {
          const updatedFields = {
            service,
            sub_title,
            execution_highlights: Array.isArray(execution_highlights)
              ? execution_highlights
              : typeof execution_highlights === "string"
              ? execution_highlights.split(",")
              : [],
            execution_overview: Array.isArray(execution_overview)
              ? execution_overview
              : typeof execution_overview === "string"
              ? execution_overview.split(",")
              : [],
            our_client: Array.isArray(our_client)
              ? our_client
              : typeof our_client === "string"
              ? our_client.split(",")
              : [],
            gallery: Array.isArray(gallery)
              ? gallery
              : typeof gallery === "string"
              ? gallery.split(",")
              : [],
            service_testimonial: Array.isArray(service_testimonial)
              ? service_testimonial
              : typeof service_testimonial === "string"
              ? service_testimonial.split(",")
              : [],
          };
    
          const updatedManagedCampus = await ManagedCampus.findByIdAndUpdate(
            id,
            updatedFields,
            { new: true }
          );
    
          if (!updatedManagedCampus) {
            return res.status(404).json({
              message: [{ key: "error", value: "Managed Campus not found" }],
            });
          }
    
          return res.status(200).json({
            message: [
              { key: "Success", value: "Managed Campus Updated Successfully" },
            ],
            data: updatedManagedCampus,
          });
        } catch (error) {
          console.error(error);
          return res
            .status(500)
            .json({ message: [{ key: "error", value: "Internal server error" }] });
        }
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ message: [{ key: "error", value: "Internal server error" }] });
      }
    };
    
    
    exports.deleteManagedCampus = async (req, res) => {
      const { id } = req.params;
      try {
        const deletedManagedCampus = await ManagedCampus.findByIdAndDelete(id);
        if (!deletedManagedCampus) {
          return res.status(404).json({ message: [{ key: "error", value: "Managed Campus not found" }] });
        }
        return res.status(200).json({
          message: [{ key: "success", value: "Managed Campus deleted successfully" }],
          deletedManagedCampus: deletedManagedCampus,
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          message: [{ key: "error", value: "Internal server error" }],
        });
      }
    };
    