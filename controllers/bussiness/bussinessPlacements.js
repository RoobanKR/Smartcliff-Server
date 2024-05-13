const Placements = require("../../models/bussiness/BussinessPlacementsModal");

const { createClient } = require('@supabase/supabase-js');
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseUrl = process.env.SUPABASE_URL;

const supabase = createClient(supabaseUrl, supabaseKey);
exports.createBussinessPlacements = async (req, res) => {
    try {
        const { name, review,designation,type } = req.body;
        
        if (!name || !review || !designation || !type) {
            return res.status(400).json({ message: [{ key: "error", value: "Required fields" }] });
        }

      const imageFile = req.files.image;
      const uniqueFileName = `${Date.now()}_${imageFile.name}`;

      try {
          const { data, error } = await supabase.storage
          .from('SmartCliff/bussiness/placements')
          .upload(uniqueFileName, imageFile.data);

          if (error) {
              console.error(error);
              return res.status(500).json({ message: [{ key: "error", value: "Error uploading image to Supabase storage" }] });
          }

          const imageUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/bussiness/placements/${uniqueFileName}`;

        const newPlacements = new Placements({
            name,
            review,
            image: imageUrl,
            designation,
            type
        });

        await newPlacements.save();

        return res.status(201).json({ message: [{ key: "Success", value: "Placements Added Successfully" }] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
      }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
};


exports.getAllBussinessPlacements = async (req, res) => {
  try {
    const placements = await Placements.find();

    return res.status(200).json({
      message: [{ key: 'success', value: 'Bussiness Placements Retrieved successfully' }],
      getAllPlacements: placements,
    });
  } catch (error) {
    return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
  }
};



exports.getBussinessPlacementsById = async (req, res) => {
  const { id } = req.params;
  try {
    const placement = await Placements.findById(id);
    if (!placement) {
      return res.status(404).json({ message: [{ key: 'error', value: 'Bussiness Placements not found' }] });
    }
    return res.status(200).json({
      message: [{ key: 'success', value: 'Bussiness Placements Id based Retrieved successfully' }],
      placement_ById: placement
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
  }
};



exports.updateBussinessPlacements = async (req, res) => {
  try {
      const PlacementsId = req.params.id;
      const updatedData = req.body;
      const imageFile = req.files ? req.files.image : null;

      const existingPlacements = await Placements.findById(PlacementsId);

      if (!existingPlacements) {
          return res.status(404).json({
              message: [{ key: 'error', value: 'Bussiness Placements not found' }]
          });
      }

      if (imageFile) {
        if (existingPlacements.image) {
            try {
                const imageUrlParts = existingPlacements.image.split('/');
                const imageName = imageUrlParts[imageUrlParts.length - 1];

                const {data,error} =  await supabase.storage
                .from('SmartCliff')
                .remove(`bussiness/placements/${[imageName]}`);
               
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: [{ key: "error", value: "Error removing existing image from Supabase storage" }] });
            }
        }

        const uniqueFileName = `${Date.now()}_${imageFile.name}`;

        try {
            const { data, error } = await supabase.storage
                .from('SmartCliff/bussiness/placements')
                .upload(uniqueFileName, imageFile.data);

            if (error) {
                console.error(error);
                return res.status(500).json({ message: [{ key: "error", value: "Error uploading image to Supabase storage" }] });
            }

            const imageUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/bussiness/placements/${uniqueFileName}`;
            updatedData.image = imageUrl;
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: [{ key: "error", value: "Error uploading image to Supabase storage" }] });
        }
    }

      const updatedPlacements = await Placements.findByIdAndUpdate(
          PlacementsId,
          updatedData,
      );

      return res.status(200).json({
          message: [{ key: 'success', value: 'Bussiness Placements updated successfully' }]        });
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          message: [{ key: 'error', value: 'Internal server error' }]
      });
  }
};


exports.deleteBussinessPlacements = async (req, res) => {
  const { id } = req.params;

  try {
    const placement = await Placements.findById(id);
    if (!placement) {
      return res.status(404).json({ message: [{ key: 'error', value: 'Bussiness Placements not found' }] });
    }
    if (placement.image) {
      try {
        
          const imageUrlParts = placement.image.split('/');
          const imageName = imageUrlParts[imageUrlParts.length - 1];
          const {data,error} =  await supabase.storage
          .from('SmartCliff')
          .remove(`bussiness/placements/${[imageName]}`);
             

      } catch (error) {
          console.log(error);
          return res.status(500).json({ message: [{ key: "error", value: "Error removing image from Supabase storage" }] });
      }
  }
      await Placements.findByIdAndDelete(id);

    return res.status(200).json({
      message: [{ key: 'success', value: 'Bussiness Placements deleted successfully' }],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
  }
};

