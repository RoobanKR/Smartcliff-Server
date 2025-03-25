const Gallery = require("../../models/services/GalleryModal");
const { createClient } = require('@supabase/supabase-js');
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseUrl = process.env.SUPABASE_URL;

const supabase = createClient(supabaseUrl, supabaseKey);

exports.createGallery = async (req, res) => {
    try {
        const { name, year,service } = req.body;
        const existingGallery = await Gallery.findOne({ name });

        if (existingGallery) {
            return res.status(403).json({ message: [{ key: "error", value: "Gallery Name already exists" }] });
        }

        if (!name || !year || !service) {
            return res.status(400).json({ message: [{ key: "error", value: "Required fields" }] });
        }

        const imageFile = req.files.image;
        const uniqueFileName = `${Date.now()}_${imageFile.name}`;

        try {
            const { data, error } = await supabase.storage
            .from('SmartCliff/services/gallery')
            .upload(uniqueFileName, imageFile.data);

            if (error) {
                console.error(error);
                return res.status(500).json({ message: [{ key: "error", value: "Error uploading image to Supabase storage" }] });
            }

        const imageUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/services/gallery/${uniqueFileName}`;

        const newGallery = new Gallery({
            name,
            year,
            image: imageUrl,
            service
        });

        await newGallery.save();

        return res.status(201).json({ message: [{ key: "Success", value: "Gallery Added Successfully" }] });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
} catch (error) {
  console.error(error);
  return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
}
};


exports.getAllGallery = async (req, res) => {
    try {
      const gallery = await Gallery.find().populate("service");
  
      
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Gallery Retrieved successfully' }],
        getAllGallery: gallery,
      });
    } catch (error) {
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };

  
  exports.getGalleryById = async (req, res) => {
    const { id } = req.params;
    try {
      const gallery = await Gallery.findById(id).populate("service");
      if (!gallery) {
        return res.status(404).json({ message: [{ key: 'error', value: 'Gallery not found' }] });
      }
      return res.status(200).json({
        message: [{ key: 'success', value: 'Gallery Id based Retrieved successfully' }],
        galleryById:gallery
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  

  
  exports.updateGallery = async (req, res) => {
    try {
        const galleryId = req.params.id;
        const updatedData = req.body;
        const imageFile = req.files ? req.files.image : null;

        const existingGallery = await Gallery.findById(galleryId);

        if (!existingGallery) {
            return res.status(404).json({
                message: [{ key: 'error', value: 'Gallery not found' }]
            });
        }

        if (updatedData.name && updatedData.name !== existingGallery.name) {
            const nameExists = await Gallery.exists({ name: updatedData.name });
            if (nameExists) {
                return res.status(400).json({
                    message: [{ key: 'error', value: 'Gallery with this name already exists' }]
                });
            }
        }
        if (imageFile) {
          if (existingGallery.image) {
              try {
                  const imageUrlParts = existingGallery.image.split('/');
                  const imageName = imageUrlParts[imageUrlParts.length - 1];

                  const {data,error} =  await supabase.storage
                  .from('SmartCliff')
                  .remove(`services/gallery/${[imageName]}`);
                 
              } catch (error) {
                  console.error(error);
                  return res.status(500).json({ message: [{ key: "error", value: "Error removing existing image from Supabase storage" }] });
              }
          }

          const uniqueFileName = `${Date.now()}_${imageFile.name}`;

          try {
              const { data, error } = await supabase.storage
                  .from('SmartCliff/services/gallery')
                  .upload(uniqueFileName, imageFile.data);

              if (error) {
                  console.error(error);
                  return res.status(500).json({ message: [{ key: "error", value: "Error uploading image to Supabase storage" }] });
              }

              const imageUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/services/gallery/${uniqueFileName}`;
              updatedData.image = imageUrl;
          } catch (error) {
              console.error(error);
              return res.status(500).json({ message: [{ key: "error", value: "Error uploading image to Supabase storage" }] });
          }
      }
        const updatedGallery = await Gallery.findByIdAndUpdate(
            galleryId,
            updatedData,
        );

        if (!updatedGallery) {
            return res.status(404).json({
                message: [{ key: 'error', value: 'Gallery not found' }]
            });
        }

        return res.status(200).json({
            message: [{ key: 'success', value: 'Gallery updated successfully' }]        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: [{ key: 'error', value: 'Internal server error' }]
        });
    }
};



exports.deleteGallery = async (req, res) => {
    const { id } = req.params;
  
    try {
      const gallery = await Gallery.findById(id);
      if (!gallery) {
        return res.status(404).json({ message: [{ key: 'error', value: 'Gallery not found' }] });
      }
  
      if (gallery.image) {
        try {
          
            const imageUrlParts = gallery.image.split('/');
            const imageName = imageUrlParts[imageUrlParts.length - 1];
            const {data,error} =  await supabase.storage
            .from('SmartCliff')
            .remove(`services/gallery/${[imageName]}`);
               
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: [{ key: "error", value: "Error removing image from Supabase storage" }] });
        }
    }

        await Gallery.findByIdAndDelete(id);
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Gallery deleted successfully' }],
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  