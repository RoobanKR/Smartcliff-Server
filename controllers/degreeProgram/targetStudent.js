const TargetStudent = require("../../models/degreeprogram/TargetStudentModal");
const path = require("path");
const fs = require('fs');

exports.createTargetStudent = async (req, res) => {
  try {
    const {
      description,
      bgColor,
      service,business_service,degree_program,
    } = req.body;


    // Validate the icon
  const iconFile = req.files.icon;
   
           if (iconFile.size > 3 * 1024 * 1024) {
               return res.status(400).json({
                   message: [{ key: "error", value: "Image size exceeds the 3MB limit" }],
               });
           }
   
           const uniqueFileName = `${Date.now()}_${iconFile.name}`;
           const uploadPath = path.join(__dirname, "../../uploads/degreeprogram/targetstudent", uniqueFileName);
   
           await iconFile.mv(uploadPath);

    const newProgramMentor = new TargetStudent({
      description,
      bgColor,
      icon: uniqueFileName,
      service,business_service,degree_program,
    });

    await newProgramMentor.save();

    return res.status(201).json({
      message: [{ key: "success", value: "Target Student added successfully" }],
      Program_Mentor: newProgramMentor,
    });

  } catch (error) {
    console.error("Internal server error:", error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};
exports.getAllTargetStudent = async (req, res) => {
    try {
         const targetstudent = await TargetStudent.find().populate("degree_program").populate('service').populate('business_service');
     
         const alltargetSTudent = targetstudent.map((student) => {
           const targetStudentObj = student.toObject();
           return {
               ...targetStudentObj,
               icon: process.env.BACKEND_URL + "/uploads/degreeprogram/targetstudent/" + targetStudentObj.icon,
           };
       });
   
   
     
         return res.status(200).json({
           message: [{ key: 'success', value: 'Target Studeny Retrieved successfully' }],
           target_Student: alltargetSTudent,
         });
       } catch (error) {
         return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
       }
     };
     

  exports.getTargetStudentById = async (req, res) => {
    const { id } = req.params;
       try {
         const targetstudent = await TargetStudent.findById(id).populate("degree_program").populate('service').populate('business_service');
         if (!targetstudent) {
           return res.status(404).json({ message: [{ key: 'error', value: 'Our Program not found' }] });
         }
         return res.status(200).json({
           message: [{ key: 'success', value: 'Target Student Retrieved successfully' }],
           targetstudentById: {
             ...targetstudent.toObject(),
             icon: process.env.BACKEND_URL + '/uploads/degreeprogram/targetstudent/' + targetstudent.icon,
         },
         });
       } catch (error) {
         console.error(error);
         return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
       }
     };
     
   
  exports.updateTargetStudent = async (req, res) => {
    try {
      const studentId = req.params.id;
      const updatedData = req.body;
      const iconFile = req.files ? req.files.icon : null;
  
      const existingtargetStudent = await TargetStudent.findById(studentId);
  
      if (!existingtargetStudent) {
        return res.status(404).json({
          message: [{ key: 'error', value: 'target student not found' }]
        });
      }
  
   if (iconFile) {
      // Delete the old icon
      const imagePathToDelete = path.join(
        __dirname,
        "../../uploads/degreeprogram/targetstudent",
        existingtargetStudent.icon
      );
      if (fs.existsSync(imagePathToDelete)) {
        fs.unlink(imagePathToDelete, (err) => {
          if (err) {
            console.error("Error deleting icon:", err);
          }
        });
      }

      // Upload the new icon
      const uniqueFileName = `${Date.now()}_${iconFile.name}`;
      const uploadPath = path.join(
        __dirname,
        "../../uploads/degreeprogram/targetstudent",
        uniqueFileName
      );
      await iconFile.mv(uploadPath);
      updatedData.icon = uniqueFileName;
    }
  
      const updatedtargetstudent = await TargetStudent.findByIdAndUpdate(
        studentId,
        updatedData      );
  
      if (!updatedtargetstudent) {
        return res.status(404).json({
          message: [{ key: 'error', value: 'target student not found' }]
        });
      }
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Target Student updated successfully' }]
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: [{ key: 'error', value: 'Internal server error' }]
      });
    }
  };

  exports.deleteTargetStudent = async (req, res) => {
    const { id } = req.params;
  
    try {
      const targetstudent = await TargetStudent.findById(id);
      if (!targetstudent) {
        return res.status(404).json({ message: [{ key: 'error', value: 'targetstudent not found' }] });
      }
  
  // If there's an icon, remove it from Supabase
             if (targetstudent.icon) {
                       const imagePath = path.join(__dirname, "../../uploads/degreeprogram/targetstudent", targetstudent.icon);
                       if (fs.existsSync(imagePath) && fs.lstatSync(imagePath).isFile()) {
                           fs.unlinkSync(imagePath);
                       }
                   }        await TargetStudent.findByIdAndDelete(id);
  
      return res.status(200).json({
        message: [{ key: 'success', value: 'Target Student deleted successfully' }],
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
    }
  };
  