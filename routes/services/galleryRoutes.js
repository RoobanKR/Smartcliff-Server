
const express = require('express');
const router = express.Router();
const { userAuth } = require('../../middlewares/userAuth.js');
const { userRole } = require('../../middlewares/userRole.js');
const { createGallery, getAllGallery, getGalleryById, updateGallery, deleteGallery } = require('../../controllers/services/gallery.js');

router.post('/create/service_gallery', createGallery);

router.get('/getAll/service_gallery', getAllGallery);

router.get('/getById/service_gallery/:id', getGalleryById);

router.put('/update/service_gallery/:id',updateGallery);

router.delete('/delete/service_gallery/:id',  deleteGallery);


module.exports = router;
