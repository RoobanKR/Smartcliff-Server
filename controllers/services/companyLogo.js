const CompanyLogo = require("../../models/services/CompanyLogoModal");
const { createClient } = require('@supabase/supabase-js');
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseUrl = process.env.SUPABASE_URL;

const supabase = createClient(supabaseUrl, supabaseKey);

exports.createCompanyLogo = async (req, res) => {
    try {
        const { name, service, subtitle } = req.body;
        const existingCompanyLogo = await CompanyLogo.findOne({ name });

        if (existingCompanyLogo) {
            return res.status(403).json({ message: [{ key: "error", value: "Company Name already exists" }] });
        }

        if (!name || !req.files.image) {
            return res.status(400).json({ message: [{ key: "error", value: "Required fields" }] });
        }

        const imageFile = req.files.image;
        const uniqueFileName = `${Date.now()}_${imageFile.name}`;

        try {
            const { data, error } = await supabase.storage
            .from('SmartCliff/services/client')
            .upload(uniqueFileName, imageFile.data);

            if (error) {
                console.error(error);
                return res.status(500).json({ message: [{ key: "error", value: "Error uploading image to Supabase storage" }] });
            }

            const imageUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/services/client/${uniqueFileName}`;

            const newCompanyLogo = new CompanyLogo({
                name,
                image: imageUrl,
                service,
                subtitle
            });

            await newCompanyLogo.save();

            return res.status(201).json({ message: [{ key: "Success", value: "Company Logo Added Successfully" }] });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
};

exports.getAllCompanyLogo = async (req, res) => {
    try {
      const companyLogo = await CompanyLogo.find().populate("service");
      return res.status(200).json({
        message: [{ key: 'success', value: 'Company Logo Retrieved successfully' }],
        AllCompanyLogos: companyLogo,
      });
    } catch (error) {
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };


  exports.getCompanyLogoById = async (req, res) => {
    const { id } = req.params;
    try {
      const companyLogo = await CompanyLogo.findById(id).populate("service");
      if (!companyLogo) {
        return res.status(404).json({ message: [{ key: 'error', value: 'Company Logo not found' }] });
      }
      return res.status(200).json({
        message: [{ key: 'success', value: 'Company Logo Id Based Retrieved successfully' }],
        companyLogoById: companyLogo
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  

exports.updateCompanyLogo = async (req, res) => {
  try {
      const logoId = req.params.id;
      const updatedData = req.body;
      const imageFile = req.files ? req.files.image : null;

      const existingCompanyLogo = await CompanyLogo.findById(logoId);

      if (!existingCompanyLogo) {
          return res.status(404).json({
              message: [{ key: 'error', value: 'Company Logo not found' }]
          });
      }

      if (updatedData.name && updatedData.name !== existingCompanyLogo.name) {
          const nameExists = await CompanyLogo.exists({ name: updatedData.name });
          if (nameExists) {
              return res.status(400).json({
                  message: [{ key: 'error', value: 'Company Logo with this name already exists' }]
              });
          }
      }

      if (imageFile) {
          if (existingCompanyLogo.image) {
              try {
                  const imageUrlParts = existingCompanyLogo.image.split('/');
                  const imageName = imageUrlParts[imageUrlParts.length - 1];

                  const {data,error} =  await supabase.storage
                  .from('SmartCliff')
                  .remove(`services/client/${[imageName]}`);
                 
              } catch (error) {
                  console.error(error);
                  return res.status(500).json({ message: [{ key: "error", value: "Error removing existing image from Supabase storage" }] });
              }
          }

          const uniqueFileName = `${Date.now()}_${imageFile.name}`;

          try {
              const { data, error } = await supabase.storage
                  .from('SmartCliff/services/client')
                  .upload(uniqueFileName, imageFile.data);

              if (error) {
                  console.error(error);
                  return res.status(500).json({ message: [{ key: "error", value: "Error uploading image to Supabase storage" }] });
              }

              const imageUrl = `${supabaseUrl}/storage/v1/object/public/SmartCliff/services/client/${uniqueFileName}`;
              updatedData.image = imageUrl;
          } catch (error) {
              console.error(error);
              return res.status(500).json({ message: [{ key: "error", value: "Error uploading image to Supabase storage" }] });
          }
      }

      const updatedCompanyLogo = await CompanyLogo.findByIdAndUpdate(
          logoId,
          updatedData,
      );

      if (!updatedCompanyLogo) {
          return res.status(404).json({
              message: [{ key: 'error', value: 'Company Logo not found' }]
          });
      }

      return res.status(200).json({
          message: [{ key: 'success', value: 'Company Logo updated successfully' }]
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          message: [{ key: 'error', value: 'Internal server error' }]
      });
  }
};

exports.deleteCompanyLogo = async (req, res) => {
  const { id } = req.params;

  try {
      const companyLogo = await CompanyLogo.findById(id);
      if (!companyLogo) {
          return res.status(404).json({ message: [{ key: 'error', value: 'Company Logo not found' }] });
      }

      if (companyLogo.image) {
          try {
            
              const imageUrlParts = companyLogo.image.split('/');
              const imageName = imageUrlParts[imageUrlParts.length - 1];
              const {data,error} =  await supabase.storage
              .from('SmartCliff')
              .remove(`services/client/${[imageName]}`);
                 

          } catch (error) {
              console.log(error);
              return res.status(500).json({ message: [{ key: "error", value: "Error removing image from Supabase storage" }] });
          }
      }

      await CompanyLogo.findByIdAndDelete(id);

      return res.status(200).json({
          message: [{ key: 'success', value: 'Company Logo deleted successfully' }],
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
  }
};
