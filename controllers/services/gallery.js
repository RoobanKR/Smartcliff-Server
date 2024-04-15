const Gallery = require("../../models/services/GalleryModal");
const path = require("path");
const fs = require('fs');

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

        if (!imageFile) {
            return res.status(400).json({ message: [{ key: "error", value: "Gallery image is required" }] });
        }

        if (imageFile.size > 5 * 1024 * 1024) {
            return res.status(400).json({ message: [{ key: "error", value: "Gallery image size exceeds the 3MB limit" }] });
        }

        const uniqueFileName = `${Date.now()}_${imageFile.name}`;
        const uploadPath = path.join(__dirname, "../../uploads/services/gallery", uniqueFileName);

        await imageFile.mv(uploadPath);

        const newGallery = new Gallery({
            name,
            year,
            image: uniqueFileName,
            service
        });

        await newGallery.save();

        return res.status(201).json({ message: [{ key: "Success", value: "Gallery Added Successfully" }] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
};



exports.getAllGallery = async (req, res) => {
    try {
      const gallery = await Gallery.find().populate("service");
  
      const allGallery = gallery.map((galleries) => {
        return {
          ...galleries.toObject(),
          image: galleries.image ? process.env.BACKEND_URL + '/uploads/services/gallery/' + galleries.image : null,
        };
      });
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Gallery Retrieved successfully' }],
        getAllGallery: allGallery,
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
      const imageURL = gallery.image ? `${process.env.BACKEND_URL}/uploads/services/gallery/${gallery.image}` : null;
      return res.status(200).json({
        message: [{ key: 'success', value: 'Gallery Id based Retrieved successfully' }],
        galleryById: {
          ...gallery.toObject(),
          image: imageURL,
        },
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

        // Check if the name is being updated and if it already exists in the database
        if (updatedData.name && updatedData.name !== existingGallery.name) {
            const nameExists = await Gallery.exists({ name: updatedData.name });
            if (nameExists) {
                return res.status(400).json({
                    message: [{ key: 'error', value: 'Gallery with this name already exists' }]
                });
            }
        }

        if (imageFile) {
            const imagePathToDelete = path.join(
                __dirname,
                '../../uploads/services/gallery',
                existingGallery.image
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
                '../../uploads/services/gallery',
                uniqueFileName
            );
            await imageFile.mv(uploadPath);
            updatedData.image = uniqueFileName;
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
        const imagePath = path.join(__dirname, '../../uploads/services/gallery', gallery.image);
        fs.unlinkSync(imagePath);
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
  