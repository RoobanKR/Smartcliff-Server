const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createPopUpNotification, getAllPopUpNotification, getPopUpNotificationById, updatePopUpNotification, togglePopUpOpenStatus, deletePopUpNotification } = require('../../controllers/home/popupNotification.js');

router.post('/create/home/popup-notification',createPopUpNotification);

router.get('/getAll/home/popup-notification', getAllPopUpNotification);

router.get('/getById/home/popup-notification/:id', getPopUpNotificationById);

router.delete('/delete/home/popup-notification/:id',deletePopUpNotification);

router.put('/update/home/popup-notification/:id', updatePopUpNotification);

router.put('/popup-notification/isopen/:id', togglePopUpOpenStatus);

module.exports = router;    
