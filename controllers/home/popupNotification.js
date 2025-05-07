const PopUpNotification = require("../../models/home/popupNotificationModal");
const path = require("path");
const fs = require("fs");

exports.createPopUpNotification = async (req, res) => {
  try {
    const { title, description,button, link } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: [
          {
            key: "error",
            value: "Required fields: title and descrption are missing",
          },
        ],
      });
    }

    if (!req.files || !req.files.image) {
      return res.status(400).json({
        message: [{ key: "error", value: "Image is required" }],
      });
    }

    const imageFile = req.files.image;

    if (imageFile.size > 3 * 1024 * 1024) {
      return res.status(400).json({
        message: [{ key: "error", value: "Image size exceeds the 3MB limit" }],
      });
    }

    const uniqueFileName = `${Date.now()}_${imageFile.name}`;
    const uploadPath = path.join(
      __dirname,
      "../../uploads/home/popupnotification",
      uniqueFileName
    );

    await imageFile.mv(uploadPath);

    const newPopUpNotification = new PopUpNotification({
      title,
      description,
      button,
      link,
      image: uniqueFileName,
      createdAt: new Date(),
    });

    await newPopUpNotification.save();

    return res.status(201).json({
      message: [
        {
          key: "success",
          value: "PopUp Notification Added Successfully",
        },
      ],
    });
  } catch (error) {
    console.error("Outer try block error:", error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};

exports.togglePopUpOpenStatus = async (req, res) => {
    try {
      const popUpId = req.params.id;
      const popUp = await PopUpNotification.findById(popUpId);
  
      if (!popUp) {
        return res.status(404).json({ message: [{ key: "error", value: "PopUp not found" }] });
      }
  
      // Toggle the isOpen status
      popUp.isOpen = !popUp.isOpen;
  
      await popUp.save(); 
      return res.status(200).json({
        message: [{ key: "SUCCESS", value: "PopUp Notification status updated successfully" }],
        popUp: { id: popUp._id, isOpen: popUp.isOpen }, 
      });
    } catch (error) {
      console.error("Error updating popUp status:", error);
      return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
    }
  };

  exports.getAllPopUpNotification = async (req, res) => {
    try {
      const notifications = await PopUpNotification.find();
  
      const formattedNotifications = notifications.map((popup) => {
        const popupObj = popup.toObject();
        return {
          ...popupObj,
          image: `${process.env.BACKEND_URL}/uploads/home/popupnotification/${popupObj.image}`,
        };
      });
  
      return res.status(200).json({
        message: [
          { key: "success", value: "Pop-up notifications retrieved successfully" },
        ],
        getAllPopUpNotification: formattedNotifications,
      });
    } catch (error) {
      console.error("Error fetching all pop-up notifications:", error);
      return res.status(500).json({
        message: [{ key: "error", value: "Internal server error" }],
        error,
      });
    }
  };
  
  exports.getPopUpNotificationById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const popup = await PopUpNotification.findById(id);
  
      if (!popup) {
        return res.status(404).json({
          message: [
            { key: "error", value: "Pop-up notification not found" },
          ],
        });
      }
  
      return res.status(200).json({
        message: [
          {
            key: "success",
            value: "Pop-up notification retrieved successfully",
          },
        ],
        PopUpNotificationById: {
          ...popup.toObject(),
          image: `${process.env.BACKEND_URL}/uploads/home/popupnotification/${popup.image}`,
        },
      });
    } catch (error) {
      console.error("Error fetching pop-up notification by ID:", error);
      return res.status(500).json({
        message: [{ key: "error", value: "Internal server error" }],
        error,
      });
    }
  };
  
exports.updatePopUpNotification = async (req, res) => {
  try {
    const popupId = req.params.id;
    const updatedData = req.body;
    const imageFile = req.files ? req.files.image : null;

    const existingPopUpNotification = await PopUpNotification.findById(
      popupId
    );

    if (!existingPopUpNotification) {
      return res.status(404).json({
        message: [{ key: "error", value: "Pop Up not found" }],
      });
    }

    if (
      updatedData.title &&
      updatedData.title !== existingPopUpNotification.title
    ) {
      const titleExists = await PopUpNotification.exists({
        title: updatedData.title,
      });
      if (titleExists) {
        return res.status(400).json({
          message: [
            {
              key: "error",
              value: "Home Execution Highlights with this title already exists",
            },
          ],
        });
      }
    }

    if (imageFile) {
      if (!existingPopUpNotification) {
        return res
          .status(404)
          .json({ message: { key: "error", value: "highlights not found" } });
      }

      const imagePathToDelete = path.join(
        __dirname,
        "../../uploads/home/popupnotification",
        existingPopUpNotification.image
      );
      if (fs.existsSync(imagePathToDelete)) {
        fs.unlink(imagePathToDelete, (err) => {
          if (err) {
            console.error("Error deleting image:", err);
          }
        });
      }

      const uniqueFileName = `${Date.now()}_${imageFile.name}`;
      const uploadPath = path.join(
        __dirname,
        "../../uploads/home/popupnotification",
        uniqueFileName
      );
      await imageFile.mv(uploadPath);
      updatedData.image = uniqueFileName;
    }

    const updatedPopUpNotification =
      await PopUpNotification.findByIdAndUpdate(popupId, updatedData);

    if (!updatedPopUpNotification) {
      return res.status(404).json({
        message: [
          { key: "error", value: "Pop Up Notification not found" },
        ],
      });
    }

    return res.status(200).json({
      message: [
        {
          key: "success",
          value: "Pop Up Notification updated successfully",
        },
      ],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: [{ key: "error", value: "Internal server error" }],
    });
  }
};




    exports.deletePopUpNotification = async (req, res) => {
        const { id } = req.params;
      
        try {
          const popupnotification = await PopUpNotification.findById(id);
          if (!popupnotification) {
            return res.status(404).json({ message: [{ key: 'error', value: 'popup notification not found' }] });
          }
      
           if (popupnotification.image) {
                     const imagePath = path.join(__dirname, "../../uploads/home/popupnotification", popupnotification.image);
                     if (fs.existsSync(imagePath) && fs.lstatSync(imagePath).isFile()) {
                         fs.unlinkSync(imagePath);
                     }
                 }
         
            await PopUpNotification.findByIdAndDelete(id);
      
          return res.status(200).json({
            message: [{ key: 'success', value: 'Popup Notification deleted successfully' }],
          });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
        }
      };
      