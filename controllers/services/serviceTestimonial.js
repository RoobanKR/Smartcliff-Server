const Testimonial = require("../../models/services/ServiceTestimonialModal");

const { createClient } = require('@supabase/supabase-js');
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseUrl = process.env.SUPABASE_URL;

const supabase = createClient(supabaseUrl, supabaseKey);
exports.createTestimonial = async (req, res) => {
    try {
        const { name, review,service,stack } = req.body;
        
        if (!name || !review || !service || !stack) {
            return res.status(400).json({ message: [{ key: "error", value: "Required fields" }] });
        }

        if (!name || !req.files.image) {
          return res.status(400).json({ message: [{ key: "error", value: "Required fields" }] });
      }

      const imageFile = req.files.image;
      const uniqueFileName = `${Date.now()}_${imageFile.name}`;

      try {
          const { data, error } = await supabase.storage
          .from('SmartCliff/services/testimonial')
          .upload(uniqueFileName, imageFile.data);

          if (error) {
              console.error(error);
              return res.status(500).json({ message: [{ key: "error", value: "Error uploading image to Supabase storage" }] });
          }

          const imageUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/services/testimonial/${uniqueFileName}`;

        const newTestimonial = new Testimonial({
            name,
            review,
            image: imageUrl,
            service,
            stack
        });

        await newTestimonial.save();

        return res.status(201).json({ message: [{ key: "Success", value: "Testimonial Added Successfully" }] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
      }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
};

exports.getAllTestimonial = async (req, res) => {
    try {
      const testimonial = await Testimonial.find().populate("service").populate("stack");
  

  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Testimonial Retrieved successfully' }],
        getAllTestimonial: testimonial,
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
      return res.status(200).json({
        message: [{ key: 'success', value: 'Testimonial Id based Retrieved successfully' }],
        testimonialById: testimonial
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
          if (existingTestimonial.image) {
              try {
                  const imageUrlParts = existingTestimonial.image.split('/');
                  const imageName = imageUrlParts[imageUrlParts.length - 1];

                  const {data,error} =  await supabase.storage
                  .from('SmartCliff')
                  .remove(`services/testimonial/${[imageName]}`);
                 
              } catch (error) {
                  console.error(error);
                  return res.status(500).json({ message: [{ key: "error", value: "Error removing existing image from Supabase storage" }] });
              }
          }

          const uniqueFileName = `${Date.now()}_${imageFile.name}`;

          try {
              const { data, error } = await supabase.storage
                  .from('SmartCliff/services/testimonial')
                  .upload(uniqueFileName, imageFile.data);

              if (error) {
                  console.error(error);
                  return res.status(500).json({ message: [{ key: "error", value: "Error uploading image to Supabase storage" }] });
              }

              const imageUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/services/testimonial/${uniqueFileName}`;
              updatedData.image = imageUrl;
          } catch (error) {
              console.error(error);
              return res.status(500).json({ message: [{ key: "error", value: "Error uploading image to Supabase storage" }] });
          }
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
        try {
          
            const imageUrlParts = testimonial.image.split('/');
            const imageName = imageUrlParts[imageUrlParts.length - 1];
            const {data,error} =  await supabase.storage
            .from('SmartCliff')
            .remove(`services/testimonial/${[imageName]}`);
               

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: [{ key: "error", value: "Error removing image from Supabase storage" }] });
        }
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
  
