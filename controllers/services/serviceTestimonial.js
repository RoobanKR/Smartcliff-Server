const Testimonial = require("../../models/services/ServiceTestimonialModal");
const path = require("path");
const fs = require('fs');

exports.createTestimonial = async (req, res) => {
    try {
        const { name, review,service,stack } = req.body;
        
        if (!name || !review || !service || !stack) {
            return res.status(400).json({ message: [{ key: "error", value: "Required fields" }] });
        }

        const imageFile = req.files.image;

        if (!imageFile) {
            return res.status(400).json({ message: [{ key: "error", value: "Testimonial image is required" }] });
        }

        if (imageFile.size > 5 * 1024 * 1024) {
            return res.status(400).json({ message: [{ key: "error", value: "Testimonial image size exceeds the 3MB limit" }] });
        }

        const uniqueFileName = `${Date.now()}_${imageFile.name}`;
        const uploadPath = path.join(__dirname, "../../uploads/services/testimonial", uniqueFileName);

        await imageFile.mv(uploadPath);

        const newTestimonial = new Testimonial({
            name,
            review,
            image: uniqueFileName,
            service,
            stack
        });

        await newTestimonial.save();

        return res.status(201).json({ message: [{ key: "Success", value: "Testimonial Added Successfully" }] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
};


exports.getAllTestimonial = async (req, res) => {
    try {
      const testimonial = await Testimonial.find().populate("service").populate("stack");
  
      const allTestimonial = testimonial.map((testimonials) => {
        return {
          ...testimonials.toObject(),
          image: testimonials.image ? process.env.BACKEND_URL + '/uploads/services/testimonial/' + testimonials.image : null,
        };
      });
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Testimonial Retrieved successfully' }],
        getAllTestimonial: allTestimonial,
      });
    } catch (error) {
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };


  
  exports.getTestimonialById = async (req, res) => {
    const { id } = req.params;
    try {
      const testimonial = await Testimonial.findById(id).populate("service").populate("stack");
      if (!testimonial) {
        return res.status(404).json({ message: [{ key: 'error', value: 'Testimonial not found' }] });
      }
      const imageURL = testimonial.image ? `${process.env.BACKEND_URL}/uploads/services/testimonial/${testimonial.image}` : null;
      return res.status(200).json({
        message: [{ key: 'success', value: 'Testimonial Id based Retrieved successfully' }],
        testimonialById: {
          ...testimonial.toObject(),
          image: imageURL,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  
  
  exports.updateTestimonial = async (req, res) => {
    try {
        const testimonialId = req.params.id;
        const updatedData = req.body;
        const imageFile = req.files ? req.files.image : null;

        const existingTestimonial = await Testimonial.findById(testimonialId);

        if (!existingTestimonial) {
            return res.status(404).json({
                message: [{ key: 'error', value: 'Testimonial not found' }]
            });
        }

        if (imageFile) {
            const imagePathToDelete = path.join(
                __dirname,
                '../../uploads/services/testimonial',
                existingTestimonial.image
            );
            if (fs.existsSync(imagePathToDelete)) {
                fs.unlink(imagePathToDelete, (err) => {
                    if (err) {
                        console.error('Error deleting image:', err);
                    }
                });
            }

            const uniqueFileName = `${Date.now()}_${imageFile.name}`;
            const uploadPath = path.join(
                __dirname,
                '../../uploads/services/testimonial',
                uniqueFileName
            );
            await imageFile.mv(uploadPath);
            updatedData.image = uniqueFileName;
        }

        const updatedTestimonial = await Testimonial.findByIdAndUpdate(
            testimonialId,
            updatedData,
        );

        if (!updatedTestimonial) {
            return res.status(404).json({
                message: [{ key: 'error', value: 'Testimonial not found' }]
            });
        }

        return res.status(200).json({
            message: [{ key: 'success', value: 'Testimonial updated successfully' }]        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: [{ key: 'error', value: 'Internal server error' }]
        });
    }
};


exports.deleteTestimonial = async (req, res) => {
    const { id } = req.params;
  
    try {
      const testimonial = await Testimonial.findById(id);
      if (!testimonial) {
        return res.status(404).json({ message: [{ key: 'error', value: 'Testimonial not found' }] });
      }
  
      if (testimonial.image) {
        const imagePath = path.join(__dirname, '../../uploads/services/testimonial', testimonial.image);
        fs.unlinkSync(imagePath);
      }
        await Testimonial.findByIdAndDelete(id);
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Testimonial deleted successfully' }],
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  
