
const express = require('express');
const router = express.Router();
const { userAuth } = require('../middlewares/userAuth.js');
const { userRole } = require('../middlewares/userRole.js');
const { createGallery, getAllGallery, getGalleryById, updateGallery, deleteGallery } = require('../controllers/gallery.js');

router.post('/create/gallery',createGallery);

router.get('/getAll/gallery', getAllGallery);

router.get('/getById/gallery/:id', getGalleryById);

router.delete('/delete/gallery/:id', deleteGallery);

router.put('/update/gallery/:id', updateGallery);

module.exports = router;
